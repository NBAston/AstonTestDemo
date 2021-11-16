import { ECommonUI, EGameType } from "../../common/base/UAllenum";
import UDebug from "../../common/utility/UDebug";
import AppGame from "../../public/base/AppGame";
import MBaseGameModel from "../../public/hall/MBaseGameModel";
import MKPQZNNModel_hy from "./model/MKPQZNNModel_hy";
import UKPQZNNHelper_hy from "./UKPQZNNHelper_hy";
import UKPQZNNScene_hy from "./UKPQZNNScene_hy";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VKPQZNNExtendNode_hy extends cc.Component {

    @property(cc.Toggle) lookOn: cc.Toggle = null;   //旁观

    @property(cc.Toggle) lookOnNext: cc.Toggle = null;   //下局旁观

    @property(cc.Node) ready: cc.Node = null;   //准备

    @property(cc.Node) invite: cc.Node = null;   //邀请

    @property(cc.Node) again: cc.Node = null;   //再来一轮

    @property(cc.Node) chat: cc.Node = null;   //聊天

    @property(cc.Node) newRroundWaiting: cc.Node = null;   //再来一轮等待

    init() {

    }

    onEnable() {
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SELF_AGAIN, this.onSelfPlayAgain, this);
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_HOST_AGAIN, this.onHostPlayAgain, this);
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_PRE_DISMISS, this.onPreDismiss, this);

        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_UPDATE_SETTING_PANEL, this.onUpdateChat, this);
    }

    onDisable() {
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SELF_AGAIN, this.onSelfPlayAgain, this);
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_HOST_AGAIN, this.onHostPlayAgain, this);
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_PRE_DISMISS, this.onPreDismiss, this);

        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_UPDATE_SETTING_PANEL, this.onUpdateChat, this);
    }

    /**更新聊天显示 */
    onUpdateChat(data: any) {
        if (data.retCode == 0 && data.type == 4) {
            this.showChat(!data.bLimit);
        }
    }

    /**房主再来一轮 */
    onHostPlayAgain(data: any) {
        if (MKPQZNNModel_hy.ins.roomInfoHy.roomUserId != AppGame.ins.roleModel.useId) {
            this.showPlayAgain(true);
        }
        this.newRroundWaiting.active = false;
    }

    /**自己再来一轮 */
    onSelfPlayAgain(data: any) {
        this.showPlayAgain(false);
        this.showReady(true);
        this.showLookOn(true);
    }

    /**预解散 */
    onPreDismiss(data: any) {
        this.showReady(false);
        this.showLookOn(false);
        if (MKPQZNNModel_hy.ins.roomInfoHy.roomUserId == AppGame.ins.roleModel.useId) {
            this.showPlayAgain(true);
        } else {
            this.showPlayAgain(false);
        }
        this.newRroundWaiting.active = true;
    }

    /**点击再来一轮 */
    private onClickAgain() {
        UKPQZNNScene_hy.ins.playClick();
        MKPQZNNModel_hy.ins.sendPlayAgain();
    }

    /**点击聊天 */
    private onClickChat() {
        UKPQZNNScene_hy.ins.playClick();
        AppGame.ins.showUI(ECommonUI.UI_CHAT_HY);
        // AppGame.ins.showUI(ECommonUI.UI_CHAT_HY, {
        //     text_click_callback: MKPQZNNModel_hy.ins.sendChatMsg,
        //     emoj_click_callback: MKPQZNNModel_hy.ins.sendChatMsg,
        //     send_click_callback: MKPQZNNModel_hy.ins.sendChatMsg,
        // });
    }

    /**点击战绩 */
    private onClickRecord() {
        UKPQZNNScene_hy.ins.playClick();
        AppGame.ins.showBundleUI(ECommonUI.Game_record_kpqznn_hy, EGameType.KPQZNN_HY, { reuse: true });
    }

    /**点击邀请 */
    private onClickInvite() {
        UKPQZNNScene_hy.ins.playClick();
        let headId = 0;
        for (const key in MKPQZNNModel_hy.ins.gBattlePlayer) {
            let player = MKPQZNNModel_hy.ins.gBattlePlayer[key];
            if (player.userId == MKPQZNNModel_hy.ins.roomInfoHy.roomUserId) {
                headId = player.headId;
                break;
            }
        }
        AppGame.ins.showUI(ECommonUI.UI_SHARED_HY, { eGameType: EGameType.KPQZNN_HY, roomInfo: MKPQZNNModel_hy.ins.roomInfoHy, headId: headId });
    }

    /**点击准备 */
    private onClickReady() {
        UKPQZNNScene_hy.ins.playClick();
        MKPQZNNModel_hy.ins.sendReady();
    }

    /**点击旁观 */
    private onClickLookOn() {
        UKPQZNNScene_hy.ins.playClick();
        MKPQZNNModel_hy.ins.sendLookOn();
    }

    /**点击下局旁观 */
    private onClickLookOnNext() {
        UKPQZNNScene_hy.ins.playClick();
        MKPQZNNModel_hy.ins.sendLookOnNext(this.lookOnNext.isChecked);
    }

    /**显示再来一轮 */
    showPlayAgain(isShow: boolean) {
        this.again.active = isShow;
    }

    /**显示旁观 */
    showLookOn(isShow: boolean) {
        this.lookOn.isChecked = isShow;
        this.lookOn.interactable = isShow;
        if (!MKPQZNNModel_hy.ins.isSelfAgain) {
            this.lookOn.node.active = false;
        }
    }

    /**显示下局旁观 */
    showLookOnNext(isShow: boolean) {
        this.lookOnNext.node.active = isShow;
        this.lookOn.node.active = !isShow;
        if (!MKPQZNNModel_hy.ins.isSelfAgain) {
            this.lookOnNext.node.active = false;
            this.lookOn.node.active = false;
        }
    }

    /**显示准备 */
    showReady(isShow: boolean) {
        this.ready.active = isShow;
        if (!MKPQZNNModel_hy.ins.isSelfAgain) {
            this.ready.active = false;
        }
    }

    /**显示邀请 */
    showInvite(isShow: boolean) {
        this.invite.active = isShow;
    }

    /**设置下局旁观选中 */
    setLookOnNextIsChecked(isChecked: boolean) {
        this.lookOnNext.isChecked = isChecked;
    }
    
    /**显示聊天 */
    showChat(isShow: boolean) {
        this.chat.active = isShow;
    }
}
