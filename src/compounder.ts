import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts"

import {
  Compounder,
  AutoCompound,
  AutoCompoundCall,
  OwnershipTransferred,
  RewardUpdated,
  TokenDeposited,
  TokenWithdrawn,
  AutoCompoundCallParamsStruct,
} from "../generated/Compounder/Compounder"

import { NonFungiblePositionManager } from "../generated/Compounder/NonFungiblePositionManager"
import { Position, AutoCompounded, Transaction, Token } from "../generated/schema"
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from "./token";
import { log } from '@graphprotocol/graph-ts'

export function handleAutoCompoundEvent(event: AutoCompound): void {
  let autoCompoundEntity = new AutoCompounded(event.transaction.hash.toHexString());
  const txn = loadTransaction(event);
  autoCompoundEntity.transaction = txn.id;
  autoCompoundEntity.timestamp = txn.timestamp

  autoCompoundEntity.save();
}

export function handleAutoCompoundCall(call: AutoCompoundCall): void {
  let autoCompoundEntity = AutoCompounded.load(call.transaction.hash.toHexString())
  if(autoCompoundEntity == null) {
    autoCompoundEntity = new AutoCompounded(call.transaction.hash.toHexString());
  }

  const tokens = loadTokens(call.inputs.params.tokenId);
  const token0 = tokens[0];
  const token1 = tokens[1];

  autoCompoundEntity.token0 = token0.id;
  autoCompoundEntity.token1 = token1.id;

  autoCompoundEntity.tokenId = call.inputs.params.tokenId;
  autoCompoundEntity.swap = call.inputs.params.doSwap;
  autoCompoundEntity.caller = call.from;
  autoCompoundEntity.amountAdded0 = call.outputs.compounded0;
  autoCompoundEntity.amountAdded1 = call.outputs.compounded1;
  autoCompoundEntity.fee0 = call.outputs.fee0;
  autoCompoundEntity.fee1 = call.outputs.fee1;

  autoCompoundEntity.save();

}


export function handleTokenDeposited(event: TokenDeposited): void {
  let positionEntity = new Position(event.params.tokenId.toString());

  const tokens = loadTokens(event.params.tokenId);
  const token0 = tokens[0];
  const token1 = tokens[1];

  positionEntity.token0 = token0.id;
  positionEntity.token1 = token1.id;

  positionEntity.owner = event.params.account;
  const txn = loadTransaction(event);
  positionEntity.tokenDeposit = txn.id;
  positionEntity.save()
}

export function handleTokenWithdrawn(event: TokenWithdrawn): void {
  let positionEntity = Position.load(event.params.tokenId.toString())
  if (positionEntity == null) {
    positionEntity = new Position(event.params.tokenId.toString());
  }

  const txn = loadTransaction(event);
  positionEntity.tokenWithdraw = txn.id;
  positionEntity.save()
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

function loadTokens(tokenID: BigInt): Token[] {
  const addr = Address.fromString("0xC36442b4a4522E871399CD717aBDD847Ab11FE88");
  const NFPM = NonFungiblePositionManager.bind(addr);

  const position = NFPM.positions(tokenID);
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