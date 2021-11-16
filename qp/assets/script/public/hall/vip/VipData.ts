
export class UVipitemData {
    lv: number;
    frameId: number;
    chargeNum: number;
    desc: Array<string>;
}

export class UVipData {
    vipLv: number;
    exp: number;
    max: number;
    needChargeNum: number;
    items: Array<UVipitemData>;
}
