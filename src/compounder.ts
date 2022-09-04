import { BigInt, ethereum } from "@graphprotocol/graph-ts"

import {
  Compounder,
  AutoCompound,
  AutoCompoundCall,
  OwnershipTransferred,
  RewardUpdated,
  TokenDeposited,
  TokenWithdrawn,
  AutoCompoundCallParamsStruct
} from "../generated/Compounder/Compounder"
import { Position, AutoCompounded, Transaction } from "../generated/schema"

/*
export function handleAutoCompounded(event: AutoCompounded): void {
  let autoCompoundEntity = new AutoCompound(event.transaction.from.toHex());

  autoCompoundEntity.amountAdded0 = event.params.amountAdded0;
  autoCompoundEntity.amountAdded1 = event.params.amountAdded1;
  autoCompoundEntity.fees = event.params.amountAdded1;

  const txn = loadTransaction(event);
  autoCompoundEntity.transaction = txn.id;
  // Entities can be written to the store with `.save()`
  autoCompoundEntity.save()
}
*/
//export function handleAutoCompound(call:)

export function handleAutoCompoundEvent(event: AutoCompound): void {
  let autoCompoundEntity = new AutoCompounded(event.transaction.hash.toHexString());
  const txn = loadTransaction(event);
  autoCompoundEntity.transaction = txn.id;

  autoCompoundEntity.save();
}

export function handleAutoCompoundCall(call: AutoCompoundCall): void {
  let autoCompoundEntity = AutoCompounded.load(call.transaction.hash.toHexString())
  if(autoCompoundEntity == null) {
    autoCompoundEntity = new AutoCompounded(call.transaction.hash.toHexString());
  }
  autoCompoundEntity.tokenId = call.inputs.params.tokenId;
  autoCompoundEntity.swap = call.inputs.params.doSwap;
  autoCompoundEntity.caller = call.from;
  autoCompoundEntity.amountAdded0 = call.outputs.compounded0;
  autoCompoundEntity.amountAdded1 = call.outputs.compounded1;
  autoCompoundEntity.fees = call.outputs.fees;
  autoCompoundEntity.feeToken = call.outputs.tokenAddress;

  autoCompoundEntity.save();

}


export function handleTokenDeposited(event: TokenDeposited): void {
  let positionEntity = new Position(event.params.tokenId.toString());
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