import { Address, ethereum } from "@graphprotocol/graph-ts"

import { NonFungiblePositionManager, Collect, IncreaseLiquidity, NonFungiblePositionManager__positionsResult } from "../generated/NonFungiblePositionManager/NonFungiblePositionManager"
import { Position, Transaction, Token, Owner, Compounded } from "../generated/schema"
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from "./token";
import { log, BigInt, BigDecimal } from '@graphprotocol/graph-ts'
import { Constants } from "./constants";

export function handleCollectCompounderFees(event: Collect): void {
    if (event.params.recipient.toHexString() == Constants.compounderAddress.toLowerCase()) {
        const compoundEntity = new Compounded(event.transaction.hash.toHexString());
        
        compoundEntity.unclaimedFees0 = event.params.amount0;
        compoundEntity.unclaimedFees1 = event.params.amount1;

        compoundEntity.save();
    }
}

export function handleIncreaseLiquidityCompounderFees(event: IncreaseLiquidity): void {
    let compoundEntity = Compounded.load(event.params.tokenId.toString());

    if (compoundEntity == null) {
        
    }

}

function loadTransaction(event: ethereum.Event): Transaction {
  let transaction = Transaction.load(event.transaction.hash.toHexString())
  if (transaction === null) {
    transaction = new Transaction(event.transaction.hash.toHexString())
  }

  transaction.blockNumber = event.block.number
  transaction.timestamp = event.block.timestamp

  const receipt = event.receipt;
  if (receipt != null) {
    transaction.gasUsed = receipt.gasUsed
    transaction.gasPrice = event.transaction.gasPrice
  }
  transaction.save()
  return transaction as Transaction
}

function loadTokens(position: NonFungiblePositionManager__positionsResult): Token[] {
  const token0Addr = position.getToken0();
  const token1Addr = position.getToken1();

  const token0: Token = new Token(token0Addr.toHexString());
  token0.decimals = fetchTokenDecimals(token0Addr);
  token0.symbol = fetchTokenSymbol(token0Addr);
  token0.name = fetchTokenName(token0Addr);

  const token1: Token = new Token(token1Addr.toHexString());
  token1.decimals = fetchTokenDecimals(token1Addr);
  token1.symbol = fetchTokenSymbol(token1Addr);
  token1.name = fetchTokenName(token1Addr);

  token0.save()
  token1.save()

  return [token0, token1];
}