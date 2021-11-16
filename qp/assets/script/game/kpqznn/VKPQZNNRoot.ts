import ULanHelper from "../../common/utility/ULanHelper";
import AppGame from "../../public/base/AppGame";
import { ECommonUI } from "../../common/base/UAllenum";


const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:抢庄牛牛 主界面 (准备做的控制各ui)算了,用事件分发
 */
@ccclass
export default class VKPQZNNRoot extends cc.Component {

    // public static Instance: VKPQZNNRoot = new VKPQZNNRoot(); //readonly

    /**打开开始说明界面 */
    private opensm(): void {
        // if (!MKPQZNNModel.ins.gIsOpenSM)
        //     AppGame.ins.showUI(ECommonUI.QZNN_SM, this.node);

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
        // MKPQZNNModel.ins.on(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SM_OPEN, this.openSMPanel, this);
        // cc.systemEvent.on(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_PIPEI, this.showPiPeiPanel, this);
    }

    private removeEvent(){
        // MKPQZNNModel.ins.off(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SM_OPEN, this.openSMPanel, this);
    }

    onDestroy(){
        this.removeEvent();
    }

    ////////////////
    testEvent() {
        // cc.systemEvent.emit(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_PIPEI);


        // var roleMsg = {
        //     coin: AppGame.ins.roleModel.gold,
        //     headId: AppGame.ins.roleModel.headId,
        //     nickname: AppGame.ins.roleModel.nickName
        // }

        // this.sendUpdateRoleInfo(roleMsg);
    }


    // sendUpdateRoleInfo(data: any) {
    //     MKPQZNNModel.ins.emit(, data);
    // }

    private openSMPanel() {
        // this.opensm();
    }

    showPiPeiPanel() {
        let data4 = {
            text: ULanHelper.QZNN_MATCH_TIP,
            type: 1,
            parent: this.node.parent,
            isRepatText: true,
            closecbfunc: () => {

            },

            isBgClick: false
        };
        AppGame.ins.showUI(ECommonUI.QZNN_Tip, data4);
    }
}
