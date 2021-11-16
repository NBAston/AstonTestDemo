import Model from "../../../common/base/Model"; 
import UIRankData, { UIRankDataItem } from "./RankData";
import { Game, HallServer } from "../../../common/cmd/proto";
import UMsgCenter from "../../../common/net/UMsgCenter";
import UHandler from "../../../common/utility/UHandler";
import AppGame from "../../base/AppGame";
import UDebug from "../../../common/utility/UDebug";


export default class MRannk extends Model {

    static UPDATE_RANK = "UPDATE_RANK";
    private _rankData: UIRankData;
    private _time: number;
    init(): void {
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_SCORE_RANK_MESSAGE_RES,
            new UHandler(this.get_score_rank_message_res, this));

    }
    resetData(): void {
        this._rankData = null;
        this._time = 0;
    }
    update(dt: number): void {

    }
    private get_score_rank_message_res(caller: HallServer.GetScoreRankMessageResponse): void {
        AppGame.ins.showConnect(false);
        UDebug.Log("排行榜数据"+caller)
        if (caller.retCode == 0) {
            this._rankData = new UIRankData();
            this._rankData.datas = [];
            var len = caller.message.length;
            var idx = 0;
            if(len > 0) {
                var item = new UIRankDataItem();
                let element = caller.message[len - 1];
                if(item.gold < 0) {
                    item.gold = 0;
                }
                item.name = element.nickName;
                item.frameId = element.headboxId;
                item.gold = element.winScore;
                item.headId = element.headId;
                item.rankId = element.rankId;
                item.userId = element.userId;
                item.vip = element.vip;
                this._rankData.self = item;
            }
            caller.message.forEach(element => { 
                idx++;
                var item = new UIRankDataItem();
                item.name = element.nickName;
                item.frameId = element.headboxId;
                item.gold = element.winScore;
                item.headId = element.headId;
                item.rankId = element.rankId;
                item.userId = element.userId;
                item.vip = element.vip;
                if(idx == len) {
                } else {
                    this._rankData.datas.push(item);
                    if(item.userId == this._rankData.self.userId) {
                        this._rankData.self.rankId = item.rankId;
                    }
                }
                this._rankData.datas.sort((a, b) => {
                    if (a.rankId > b.rankId)
                        return 1;
                    return -1;
                })
            });
            this.emit(MRannk.UPDATE_RANK, true, "");
        } else {
            this.emit(MRannk.UPDATE_RANK, false, caller.errorMsg);
        }
    }

    requestRank(): boolean {
        // var now = (new Date()).getTime();
        // if (this._rankData) {
        //     if (now - this._time < 300000)//5分钟
        //     {
        //         this.emit(MRannk.UPDATE_RANK, true, "");
        //         return false;
        //     }
        // }
        AppGame.ins.showConnect(true);
        // this._time = now;
        var data = new HallServer.GetScoreRankMessage();
        data.userId = AppGame.ins.roleModel.useId;
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_SCORE_RANK_MESSAGE_REQ
            , data);
        return true;
    }
    /**
    * 
    */
    getRankData(): UIRankData {
        return this._rankData;
    }

}
