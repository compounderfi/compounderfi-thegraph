import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  AutoCompounded,
  BalanceAdded,
  BalanceRemoved,
  BalanceWithdrawn,
  OwnershipTransferred,
  RewardUpdated,
  TokenDeposited,
  TokenWithdrawn
} from "../generated/Compounder/Compounder"

export function createAutoCompoundedEvent(
  account: Address,
  tokenId: BigInt,
  amountAdded0: BigInt,
  amountAdded1: BigInt,
  fees0: BigInt,
  fees1: BigInt,
  token0: Address,
  token1: Address
): AutoCompounded {
  let autoCompoundedEvent = changetype<AutoCompounded>(newMockEvent())

  autoCompoundedEvent.parameters = new Array()

  autoCompoundedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  autoCompoundedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  autoCompoundedEvent.parameters.push(
    new ethereum.EventParam(
      "amountAdded0",
      ethereum.Value.fromUnsignedBigInt(amountAdded0)
    )
  )
  autoCompoundedEvent.parameters.push(
    new ethereum.EventParam(
      "amountAdded1",
      ethereum.Value.fromUnsignedBigInt(amountAdded1)
    )
  )
  autoCompoundedEvent.parameters.push(
    new ethereum.EventParam("fees0", ethereum.Value.fromUnsignedBigInt(fees0))
  )
  autoCompoundedEvent.parameters.push(
    new ethereum.EventParam("fees1", ethereum.Value.fromUnsignedBigInt(fees1))
  )
  autoCompoundedEvent.parameters.push(
    new ethereum.EventParam("token0", ethereum.Value.fromAddress(token0))
  )
  autoCompoundedEvent.parameters.push(
    new ethereum.EventParam("token1", ethereum.Value.fromAddress(token1))
  )

  return autoCompoundedEvent
}

export function createBalanceAddedEvent(
  account: Address,
  token: Address,
  amount: BigInt
): BalanceAdded {
  let balanceAddedEvent = changetype<BalanceAdded>(newMockEvent())

  balanceAddedEvent.parameters = new Array()

  balanceAddedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  balanceAddedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  balanceAddedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return balanceAddedEvent
}

export function createBalanceRemovedEvent(
  account: Address,
  token: Address,
  amount: BigInt
): BalanceRemoved {
  let balanceRemovedEvent = changetype<BalanceRemoved>(newMockEvent())

  balanceRemovedEvent.parameters = new Array()

  balanceRemovedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  balanceRemovedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  balanceRemovedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return balanceRemovedEvent
}

export function createBalanceWithdrawnEvent(
  account: Address,
  token: Address,
  to: Address,
  amount: BigInt
): BalanceWithdrawn {
  let balanceWithdrawnEvent = changetype<BalanceWithdrawn>(newMockEvent())

  balanceWithdrawnEvent.parameters = new Array()

  balanceWithdrawnEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  balanceWithdrawnEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  balanceWithdrawnEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  balanceWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return balanceWithdrawnEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRewardUpdatedEvent(
  account: Address,
  totalRewardX64: BigInt,
  compounderRewardX64: BigInt
): RewardUpdated {
  let rewardUpdatedEvent = changetype<RewardUpdated>(newMockEvent())

  rewardUpdatedEvent.parameters = new Array()

  rewardUpdatedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  rewardUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalRewardX64",
      ethereum.Value.fromUnsignedBigInt(totalRewardX64)
    )
  )
  rewardUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "compounderRewardX64",
      ethereum.Value.fromUnsignedBigInt(compounderRewardX64)
    )
  )

  return rewardUpdatedEvent
}

export function createTokenDepositedEvent(
  account: Address,
  tokenId: BigInt
): TokenDeposited {
  let tokenDepositedEvent = changetype<TokenDeposited>(newMockEvent())

  tokenDepositedEvent.parameters = new Array()

  tokenDepositedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  tokenDepositedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return tokenDepositedEvent
}

export function createTokenWithdrawnEvent(
  account: Address,
  to: Address,
  tokenId: BigInt
): TokenWithdrawn {
  let tokenWithdrawnEvent = changetype<TokenWithdrawn>(newMockEvent())

  tokenWithdrawnEvent.parameters = new Array()

  tokenWithdrawnEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  tokenWithdrawnEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  tokenWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return tokenWithdrawnEvent
}
