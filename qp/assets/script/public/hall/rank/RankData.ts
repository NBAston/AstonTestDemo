
export class UIRankDataItem {
    userId: string;
    rankId: number;
    headId: number;
    frameId: number;
    name: string;
    vip: number;
    gold: number;
}

export default class UIRankData {
    datas: Array<UIRankDataItem>;
    self: UIRankDataItem;
}
