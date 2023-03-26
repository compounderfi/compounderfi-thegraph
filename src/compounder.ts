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

  const autoCompoundEntity = Compounded.load(event.transaction.hash.toHexString());

  const addr = Address.fromString(Constants.nonFungiblePositionManagerAddress);
  const NFPM = NonFungiblePositionManager.bind(addr);
  const position = NFPM.positions(event.params.tokenId);

  const tokens = loadTokens(position);
  const token0 = tokens[0];
  const token1 = tokens[1];

  autoCompoundEntity!.token0 = token0.id;
  autoCompoundEntity!.token1 = token1.id;

  autoCompoundEntity!.tokenId = event.params.tokenId;
  autoCompoundEntity!.caller = event.transaction.from;
  /*
  autoCompoundEntity.amountAdded0 = event.params.compounded0;
  autoCompoundEntity.amountAdded1 = event.params.compounded1;
  */
  autoCompoundEntity!.fee0Caller = event.params.fee0;
  autoCompoundEntity!.fee1Caller = event.params.fee1;

  /*
  //can't be null because for a compound to happen it won't be null in the first place
  let positionEntity = Position.load(event.params.tokenId.toString())
  */
  /*
  const beforeSwapLiq = positionEntity!.liquidityCurrent;
  
  const liqAdded = event.params.liqAdded;
  const liqbeforeSwapLiq = new BigDecimal(beforeSwapLiq);

  autoCompoundEntity.liquidityAdded = liqAdded;
  autoCompoundEntity.liquidityPercentIncrease = liqAdded.divDecimal(liqbeforeSwapLiq);
  positionEntity!.liquidityCurrent = beforeSwapLiq.plus(liqAdded);
  */
  const txn = loadTransaction(event);
  autoCompoundEntity!.transaction = txn.id;
  autoCompoundEntity!.timestamp = txn.timestamp

  /*
  positionEntity!.save();
  */
  autoCompoundEntity!.save();
}

function initalizeApproval(event:Approval): void {
  let positionEntity = new Position(event.params.tokenId.toString());

  const addr = Address.fromString(Constants.nonFungiblePositionManagerAddress);
  const NFPM = NonFungiblePositionManager.bind(addr);
  const position = NFPM.positions(event.params.tokenId);

  const tokens = loadTokens(position);
  const token0 = tokens[0];
  const token1 = tokens[1];

  const liquidityInital = position.getLiquidity();
  
  positionEntity.liquidityInital = liquidityInital;
  positionEntity.liquidityCurrent = liquidityInital;

  positionEntity.token0 = token0.id;
  positionEntity.token1 = token1.id;

  positionEntity.tokenWithdraw = null;

  let ownerEntity = new Owner(event.params.owner.toHexString());
  positionEntity.owner = event.params.owner.toHexString();

  const txn = loadTransaction(event);
  positionEntity.tokenDeposit = txn.id;
  positionEntity.save();
  ownerEntity.save();
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