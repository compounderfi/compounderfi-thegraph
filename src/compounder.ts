import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts"

import {
  Compound
} from "../generated/Compounder/Compounder"

import { NonFungiblePositionManager, Approval, ApprovalForAll, NonFungiblePositionManager__positionsResult } from "../generated/NonFungiblePositionManager/NonFungiblePositionManager"
import { Position, Compounded, Transaction, Token, Owner } from "../generated/schema"
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from "./token";
import { log, dataSource } from '@graphprotocol/graph-ts'
import { Constants } from "./constants";


export function handleCompoundEvent(event: Compound): void {

  const compoundEntity = Compounded.load(event.transaction.hash.toHexString());

  const addr = Address.fromString(Constants.nonFungiblePositionManagerAddress);
  const NFPM = NonFungiblePositionManager.bind(addr);
  const position = NFPM.positions(event.params.tokenId);

  const tokens = loadTokens(position);
  const token0 = tokens[0];
  const token1 = tokens[1];

  compoundEntity!.token0 = token0.id;
  compoundEntity!.token1 = token1.id;

  compoundEntity!.tokenId = event.params.tokenId;
  compoundEntity!.caller = event.transaction.from;

  compoundEntity!.fee0Caller = event.params.fee0;
  compoundEntity!.fee1Caller = event.params.fee1;

  const txn = loadTransaction(event);
  compoundEntity!.transaction = txn.id;
  compoundEntity!.timestamp = txn.timestamp

  /*
  positionEntity!.save();
  */
  compoundEntity!.save();
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