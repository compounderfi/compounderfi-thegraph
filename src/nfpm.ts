import { Address, ethereum } from "@graphprotocol/graph-ts"

import { NonFungiblePositionManager, Approval, ApprovalForAll, NonFungiblePositionManager__positionsResult } from "../generated/NonFungiblePositionManager/NonFungiblePositionManager"
import { Position, Transaction, Token, Owner } from "../generated/schema"
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from "./token";
import { log } from '@graphprotocol/graph-ts'
import { Constants } from './constants'

export function handleApproval(event: Approval): void {
  let positionEntity = Position.load(event.params.tokenId.toHexString())
  //two cases
  //1. it's a new position and has to be added the graphql api
  //2. it's a position already in the graphql api (approved before) and the owner is removing it
  if (positionEntity == null) {
    if (event.params.approved.toHexString() == Constants.compounderAddress.toLowerCase()){
      let positionEntity = new Position(event.params.tokenId.toHexString());

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

      positionEntity.owner = event.params.owner.toHexString();

      const txn = loadTransaction(event);
      positionEntity.tokenDeposit = txn.id;
      positionEntity.save()
    }
  } else {
    //make sure they approved someone else, NOT the contract again
    if (event.params.approved.toHexString() != Constants.compounderAddress.toLowerCase()){
      const txn = loadTransaction(event);
      positionEntity.tokenWithdraw = txn.id;
      positionEntity.save()
    }
  }
}

export function handleApprovalForAll(event: ApprovalForAll): void {
  const approvalOwner = event.params.owner.toHexString();
  const operator = event.params.operator.toHexString();
  const isApproved = event.params.approved;

  let ownerEntity = Owner.load(approvalOwner);

  if (ownerEntity == null) {
    if (event.params.operator.toHexString() == Constants.compounderAddress.toLowerCase()) {
        ownerEntity = new Owner(approvalOwner);
        ownerEntity.isApprovedForAll = isApproved;
        ownerEntity.save();
    }
  } else {
    ownerEntity.isApprovedForAll = isApproved
    ownerEntity.save();
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