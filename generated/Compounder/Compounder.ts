// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class AutoCompound extends ethereum.Event {
  get params(): AutoCompound__Params {
    return new AutoCompound__Params(this);
  }
}

export class AutoCompound__Params {
  _event: AutoCompound;

  constructor(event: AutoCompound) {
    this._event = event;
  }

  get tokenId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get fee0(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get fee1(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get compounded0(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get compounded1(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get liqAdded(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Compounder__AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Result {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: BigInt;
  value4: BigInt;

  constructor(
    value0: BigInt,
    value1: BigInt,
    value2: BigInt,
    value3: BigInt,
    value4: BigInt
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    return map;
  }

  getFee0(): BigInt {
    return this.value0;
  }

  getFee1(): BigInt {
    return this.value1;
  }

  getCompounded0(): BigInt {
    return this.value2;
  }

  getCompounded1(): BigInt {
    return this.value3;
  }

  getLiqAdded(): BigInt {
    return this.value4;
  }
}

export class Compounder extends ethereum.SmartContract {
  static bind(address: Address): Compounder {
    return new Compounder("Compounder", address);
  }

  AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513(
    tokenId: BigInt,
    rewardConversion: boolean
  ): Compounder__AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Result {
    let result = super.call(
      "AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513",
      "AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513(uint256,bool):(uint256,uint256,uint256,uint256,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromBoolean(rewardConversion)
      ]
    );

    return new Compounder__AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Result(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBigInt(),
      result[4].toBigInt()
    );
  }

  try_AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513(
    tokenId: BigInt,
    rewardConversion: boolean
  ): ethereum.CallResult<
    Compounder__AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Result
  > {
    let result = super.tryCall(
      "AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513",
      "AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513(uint256,bool):(uint256,uint256,uint256,uint256,uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(tokenId),
        ethereum.Value.fromBoolean(rewardConversion)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new Compounder__AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Result(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBigInt(),
        value[4].toBigInt()
      )
    );
  }

  callerBalances(param0: Address, param1: Address): BigInt {
    let result = super.call(
      "callerBalances",
      "callerBalances(address,address):(uint256)",
      [ethereum.Value.fromAddress(param0), ethereum.Value.fromAddress(param1)]
    );

    return result[0].toBigInt();
  }

  try_callerBalances(
    param0: Address,
    param1: Address
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "callerBalances",
      "callerBalances(address,address):(uint256)",
      [ethereum.Value.fromAddress(param0), ethereum.Value.fromAddress(param1)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  grossCallerReward(): BigInt {
    let result = super.call(
      "grossCallerReward",
      "grossCallerReward():(uint64)",
      []
    );

    return result[0].toBigInt();
  }

  try_grossCallerReward(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "grossCallerReward",
      "grossCallerReward():(uint64)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  multicall(data: Array<Bytes>): Array<Bytes> {
    let result = super.call("multicall", "multicall(bytes[]):(bytes[])", [
      ethereum.Value.fromBytesArray(data)
    ]);

    return result[0].toBytesArray();
  }

  try_multicall(data: Array<Bytes>): ethereum.CallResult<Array<Bytes>> {
    let result = super.tryCall("multicall", "multicall(bytes[]):(bytes[])", [
      ethereum.Value.fromBytesArray(data)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBytesArray());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  protocolReward(): BigInt {
    let result = super.call("protocolReward", "protocolReward():(uint64)", []);

    return result[0].toBigInt();
  }

  try_protocolReward(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "protocolReward",
      "protocolReward():(uint64)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _factory(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _nonfungiblePositionManager(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _swapRouter(): Address {
    return this._call.inputValues[2].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Call extends ethereum.Call {
  get inputs(): AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Call__Inputs {
    return new AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Call__Inputs(
      this
    );
  }

  get outputs(): AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Call__Outputs {
    return new AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Call__Outputs(
      this
    );
  }
}

export class AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Call__Inputs {
  _call: AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Call;

  constructor(call: AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Call) {
    this._call = call;
  }

  get tokenId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get rewardConversion(): boolean {
    return this._call.inputValues[1].value.toBoolean();
  }
}

export class AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Call__Outputs {
  _call: AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Call;

  constructor(call: AutoCompound25a502142c1769f58abaabfe4f9f4e8b89d24513Call) {
    this._call = call;
  }

  get fee0(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }

  get fee1(): BigInt {
    return this._call.outputValues[1].value.toBigInt();
  }

  get compounded0(): BigInt {
    return this._call.outputValues[2].value.toBigInt();
  }

  get compounded1(): BigInt {
    return this._call.outputValues[3].value.toBigInt();
  }

  get liqAdded(): BigInt {
    return this._call.outputValues[4].value.toBigInt();
  }
}

export class MulticallCall extends ethereum.Call {
  get inputs(): MulticallCall__Inputs {
    return new MulticallCall__Inputs(this);
  }

  get outputs(): MulticallCall__Outputs {
    return new MulticallCall__Outputs(this);
  }
}

export class MulticallCall__Inputs {
  _call: MulticallCall;

  constructor(call: MulticallCall) {
    this._call = call;
  }

  get data(): Array<Bytes> {
    return this._call.inputValues[0].value.toBytesArray();
  }
}

export class MulticallCall__Outputs {
  _call: MulticallCall;

  constructor(call: MulticallCall) {
    this._call = call;
  }

  get results(): Array<Bytes> {
    return this._call.outputValues[0].value.toBytesArray();
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class WithdrawBalanceCallerCall extends ethereum.Call {
  get inputs(): WithdrawBalanceCallerCall__Inputs {
    return new WithdrawBalanceCallerCall__Inputs(this);
  }

  get outputs(): WithdrawBalanceCallerCall__Outputs {
    return new WithdrawBalanceCallerCall__Outputs(this);
  }
}

export class WithdrawBalanceCallerCall__Inputs {
  _call: WithdrawBalanceCallerCall;

  constructor(call: WithdrawBalanceCallerCall) {
    this._call = call;
  }

  get tokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get to(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class WithdrawBalanceCallerCall__Outputs {
  _call: WithdrawBalanceCallerCall;

  constructor(call: WithdrawBalanceCallerCall) {
    this._call = call;
  }
}
