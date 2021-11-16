import { ECommonUI } from "../../../../common/base/UAllenum";
import VWindow from "../../../../common/base/VWindow";
import AppGame from "../../../base/AppGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VClubJoin extends VWindow {

    @property(cc.EditBox) editBox: cc.EditBox = null;

    onEnable() {
        this.editBox.string = '';
    }

    show(data: any) {
        super.show(data);
        if (AppGame.ins.clubHallModel.isShowTip && data.isShowActivity) {
            this.scheduleOnce(() =>{
                AppGame.ins.showUI(ECommonUI.CLUB_HALL_ACTIVITY);
            }, 0.2)
        }
    }

    /**点击确定加入俱乐部 */
    onClickJoin() {
        AppGame.ins.myClubModel.requestJoinClub(parseInt(this.editBox.string))
    }

}
