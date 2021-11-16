import { Bjl } from "../../common/cmd/proto";

export default class BrbjlSummaryData {
    gameId: number;
    roomId: number;
    status: number;
    statusTime: number; // 当前状态的时间，单位秒
    updateTime: number;// 更新数据时候的服务器时间
    currentServerTime: number = 0; // 第一次获取所有牌路数据的时候进行赋值
    recordList: Array<number>;
    game_record: Bjl.GameOpenRecord;
}



