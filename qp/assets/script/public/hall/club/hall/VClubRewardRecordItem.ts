import { COIN_RATE } from "../../../../config/cfg_common";
import numberTabel from "../../personal/numbeTable";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VClubRewardRecordItem extends cc.Component {

    @property(cc.Label) titleLbl: cc.Label = null;
    @property(cc.Label) dateLbl: cc.Label = null;
    @property(cc.Label) coinLbl: cc.Label = null;

    setItemData(data: any) {
        if(!data) return;
        this.titleLbl.string = '';
        if (numberTabel[data.activityId]) {
            this.titleLbl.string = numberTabel[data.activityId].type;
        }
        this.dateLbl.string = data.createTime || '';
        this.coinLbl.string = (data.rewardScore / COIN_RATE).toString();
    }

}
