import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts"

import {
  AutoCompound,
  AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Call
} from "../generated/Compounder/Compounder"

import { NonFungiblePositionManager, Approval, ApprovalForAll, NonFungiblePositionManager__positionsResult } from "../generated/NonFungiblePositionManager/NonFungiblePositionManager"
import { Position, AutoCompounded, Transaction, Token, Owner } from "../generated/schema"
import { fetchTokenDecimals, fetchTokenName, fetchTokenSymbol } from "./token";
import { log, dataSource } from '@graphprotocol/graph-ts'

const nfpmAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
const compounderContract = "0x1e00a453E200005600A5F38936B70900007400D0"
export function handleAutoCompoundEvent(event: AutoCompound): void {

  const autoCompoundEntity = new AutoCompounded(event.transaction.hash.toHexString());

  const addr = Address.fromString(nfpmAddress);
  const NFPM = NonFungiblePositionManager.bind(addr);
  const position = NFPM.positions(event.params.tokenId);

  const tokens = loadTokens(position);
  const token0 = tokens[0];
  const token1 = tokens[1];

  autoCompoundEntity.token0 = token0.id;
  autoCompoundEntity.token1 = token1.id;

  autoCompoundEntity.tokenId = event.params.tokenId;
  autoCompoundEntity.caller = event.transaction.from;
  autoCompoundEntity.amountAdded0 = event.params.compounded0;
  autoCompoundEntity.amountAdded1 = event.params.compounded1;
  autoCompoundEntity.fee0 = event.params.fee0;
  autoCompoundEntity.fee1 = event.params.fee1;

  //can't be null because for a compound to happen it won't be null in the first place
  let positionEntity = Position.load(event.params.tokenId.toString())

  const beforeSwapLiq = positionEntity!.liquidityCurrent;
  const liqAdded = event.params.liqAdded;
  const liqAddedDecimal = new BigDecimal(liqAdded);

  autoCompoundEntity.liquidityAdded = liqAdded;
  autoCompoundEntity.liquidityPercentIncrease = beforeSwapLiq.divDecimal(liqAddedDecimal);
  positionEntity!.liquidityCurrent = beforeSwapLiq.plus(liqAdded);
  
  const txn = loadTransaction(event);
  autoCompoundEntity.transaction = txn.id;
  autoCompoundEntity.timestamp = txn.timestamp

  positionEntity!.save();
  autoCompoundEntity.save();
}

export function handleAutoCompoundCall(call: AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Call): void {
  let autoCompoundEntity = AutoCompounded.load(call.transaction.hash.toHexString())
  if(autoCompoundEntity == null) {
    autoCompoundEntity = new AutoCompounded(call.transaction.hash.toHexString());
  }

  const addr = Address.fromString(nfpmAddress);
  const NFPM = NonFungiblePositionManager.bind(addr);
  const position = NFPM.positions(call.inputs.tokenId);

  const tokens = loadTokens(position);
  const token0 = tokens[0];
  const token1 = tokens[1];

  autoCompoundEntity.token0 = token0.id;
  autoCompoundEntity.token1 = token1.id;

  autoCompoundEntity.tokenId = call.inputs.tokenId;
  autoCompoundEntity.caller = call.from;
  autoCompoundEntity.amountAdded0 = call.outputs.compounded0;
  autoCompoundEntity.amountAdded1 = call.outputs.compounded1;
  autoCompoundEntity.fee0 = call.outputs.fee0;
  autoCompoundEntity.fee1 = call.outputs.fee1;

  let positionEntity = Position.load(call.inputs.tokenId.toString())
  //can't be null because for a compound to happen it won't be null in the first place
  const beforeSwapLiq = positionEntity!.liquidityCurrent;
  const liqAdded = call.outputs.liqAdded;
  const liqAddedDecimal = new BigDecimal(liqAdded);

  autoCompoundEntity.liquidityAdded = liqAdded;
  autoCompoundEntity.liquidityPercentIncrease = beforeSwapLiq.divDecimal(liqAddedDecimal);
  positionEntity!.liquidityCurrent = beforeSwapLiq.plus(liqAdded);

  positionEntity!.save();
  autoCompoundEntity.save();

}

export function handleApproval(event: Approval): void {
  let positionEntity = Position.load(event.params.tokenId.toString())

  //two cases
  //1. it's a new position and has to be added the graphql api
  //2. it's a position already in the graphql api (approved before) and the owner is removing it
  if (positionEntity == null) {
    if (event.params.approved.toHexString() == compounderContract.toLowerCase()){
      initalizeApproval(event)
    }
  } else {
    //if tokenwithdraw is not null, then it's a position that was they 'withdrew' by approving someone else
    if (positionEntity.tokenWithdraw != null) {
      //make sure they approved the contract again
      if (event.params.approved.toHexString() == compounderContract.toLowerCase()){
        initalizeApproval(event)
      }
    } else {
      //make sure they approved someone else, NOT the contract again
      if (event.params.approved.toHexString() != compounderContract.toLowerCase()){
        const txn = loadTransaction(event);
        positionEntity.tokenWithdraw = txn.id;
        positionEntity.save()
      }
    }
    
  }
}

export function handleApprovalForAll(event: ApprovalForAll): void {
  const approvalOwner = event.params.owner.toHexString();
  const operator = event.params.operator.toHexString();
  const isApproved = event.params.approved;

  let ownerEntity = Owner.load(approvalOwner);

  if (ownerEntity == null) {
    if (event.params.operator.toHexString() == compounderContract.toLowerCase()) {
        ownerEntity = new Owner(approvalOwner);
        ownerEntity.isApprovedForAll = isApproved;
        ownerEntity.save();
    }
  } else {
    ownerEntity.isApprovedForAll = isApproved
    ownerEntity.save();
  }
  
}

function initalizeApproval(event:Approval): void {
  let positionEntity = new Position(event.params.tokenId.toString());

  const addr = Address.fromString("0xC36442b4a4522E871399CD717aBDD847Ab11FE88");
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