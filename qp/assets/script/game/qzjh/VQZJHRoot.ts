
import AppGame from "../../public/base/AppGame";
import { ECommonUI } from "../../common/base/UAllenum";
import ULanHelper from "../../common/utility/ULanHelper";

const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:抢庄牛牛 主界面 (准备做的控制各ui)算了,用事件分发
 */
@ccclass
export default class VQZJHRoot extends cc.Component {

    // public static Instance: VQZJHRoot = new VQZJHRoot(); //readonly

    /**打开开始说明界面 */
    private opensm(): void {
        // if (!AppGame.ins.qzjhModel.gIsOpenSM)
        //     AppGame.ins.showUI(ECommonUI.QZJH_SM, this.node);

        //(382,201)
    }

    start() {

        this.addEvent();

        var self = this;
        this.node.runAction(cc.sequence(
            cc.delayTime(0.01),
            cc.callFunc(() => {
                self.testEvent();
            }
            )));
    }

    private addEvent() {
        // AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SM_OPEN, this.openSMPanel, this);
        // cc.systemEvent.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_PIPEI, this.showPiPeiPanel, this);
    }

    private removeEvent(){
        // AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SM_OPEN, this.openSMPanel, this);
    }

    onDestroy(){
        this.removeEvent();
    }

    ////////////////
    testEvent() {
        // cc.systemEvent.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_PIPEI);


        // var roleMsg = {
        //     coin: AppGame.ins.roleModel.gold,
        //     headId: AppGame.ins.roleModel.headId,
        //     nickname: AppGame.ins.roleModel.nickName
        // }

        // this.sendUpdateRoleInfo(roleMsg);
    }


    // sendUpdateRoleInfo(data: any) {
    //     AppGame.ins.qzjhModel.emit(, data);
    // }

    private openSMPanel() {
        // this.opensm();
    }

    showPiPeiPanel() {
        let data4 = {
            text: ULanHelper.QZJH_MATCH_TIP,
            type: 1,
            parent: this.node.parent,
            isRepatText: true,
            closecbfunc: () => {

            },

            isBgClick: false
        };
        AppGame.ins.showUI(ECommonUI.QZJH_Tip, data4);
    }
}
