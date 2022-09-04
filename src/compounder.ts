import { BigInt, ethereum } from "@graphprotocol/graph-ts"

import {
  Compounder,
  AutoCompounded,
  BalanceAdded,
  BalanceRemoved,
  BalanceWithdrawn,
  OwnershipTransferred,
  RewardUpdated,
  TokenDeposited,
  TokenWithdrawn
} from "../generated/Compounder/Compounder"
import { Position, AutoCompound, Transaction } from "../generated/schema"

export function handleAutoCompounded(event: AutoCompounded): void {
  let autoCompoundEntity = new AutoCompound(event.transaction.from.toHex());

  autoCompoundEntity.caller = event.params.account;
  autoCompoundEntity.amountAdded0 = event.params.amountAdded0;
  autoCompoundEntity.amountAdded1 = event.params.amountAdded1;
  autoCompoundEntity.fees0 = event.params.fees0;
  autoCompoundEntity.fees1 = event.params.fees1;
  autoCompoundEntity.token0 = event.params.token0;
  autoCompoundEntity.token1 = event.params.token1;

  // Entities can be written to the store with `.save()`
  autoCompoundEntity.save()
}

export function handleTokenDeposited(event: TokenDeposited): void {
  let positionEntity = new Position(event.params.tokenId.toHex());
  positionEntity.owner = event.params.account;
  positionEntity.tokenDeposit = loadTransaction(event);

}

export function handleTokenWithdrawn(event: TokenWithdrawn): void {
  let positionEntity = Position.load(event.params.tokenId.toHex())
  positionEntity.tokenWithdraw = loadTransaction(event);
}

function loadTransaction(event: ethereum.Event): Transaction {
  let transaction = Transaction.load(event.transaction.hash.toHexString())
  if (transaction === null) {
    transaction = new Transaction(event.transaction.hash.toHexString())
  }
  transaction.blockNumber = event.block.number
  transaction.timestamp = event.block.timestamp
  transaction.gasUsed = event.receipt.gasUsed
  transaction.gasPrice = event.transaction.gasPrice
  transaction.save()
  return transaction as Transaction
}