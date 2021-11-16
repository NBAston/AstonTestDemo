import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import MKPQZNNModel_hy from "./model/MKPQZNNModel_hy";
import UKPQZNNHelper_hy from "./UKPQZNNHelper_hy";
import UDebug from "../../common/utility/UDebug";
import UKPQZNNScene_hy from "./UKPQZNNScene_hy";
import UAudioManager from "../../common/base/UAudioManager";
import AppGame from "../../public/base/AppGame";


const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:抢庄按钮界面
 */
@ccclass
export default class VKPQZNNQZNode_hy extends cc.Component {

    private _qznnList = {
        "0": {
            btn: null,
            label: null,
            gray: cc.Node,
            gray_label: cc.Label
        },
        "1": {
            btn: null,
            label: null,
            gray: cc.Node,
            gray_label: cc.Label
        },
        "2": {
            btn: null,
            label: null,
            gray: cc.Node,
            gray_label: cc.Label
        },
        "3": {
            btn: null,
            label: null,
            gray: cc.Node,
            gray_label: cc.Label
        }
    }

    private _btnBuQiang: cc.Button = null;
    private _qznode: cc.Node = null;

    start() {
        this.init();
        this.addEvent();

        this.setQZNdoeActive(false);
    }

    private init(): void {
        for (let i = 0; i < 4; i++) {
            let path = "node/qznn_btn" + (i + 1).toString() + "bei";
            this._qznnList[i.toString()].btn = UNodeHelper.getComponent(this.node, path, cc.Button);

            // let labelPath = "node/Label" + (i + 1).toString();
            let labelPath = path + "/Label" + (i + 1).toString();
            this._qznnList[i.toString()].label = UNodeHelper.getComponent(this.node, labelPath, cc.Label);
            this._qznnList[i.toString()].label.node.active = false;//隐藏有色字

            let gray_path = path + "/gray";
            this._qznnList[i.toString()].gray = UNodeHelper.find(this.node, gray_path);

            let gray_label_path = path + "/gray_label";
            this._qznnList[i.toString()].gray_label = UNodeHelper.getComponent(this.node, gray_label_path, cc.Label);
        }

        this._btnBuQiang = UNodeHelper.getComponent(this.node, "node/qznn_btn2buqiang", cc.Button);
        // cc.log(this._qznnList);
        this._qznode = UNodeHelper.find(this.node, "node");

    }

    private addEvent() {


        UEventHandler.addClick(this._btnBuQiang.node,
            this.node, "VKPQZNNQZNode_hy", "sendBeiShuInfo", 0);

        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER, this.onCallBanker, this);

        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, this.onGameStart, this);
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER_RESULT, this.onCallBankerResult, this);

        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_RESET_SCENE, this.onResetGame, this);

        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_CALL, this.onGameSceneCall, this);
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_SCORE, this.onGameSceneScore, this);

        // MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_OPEN_QIANGZHUANG, this.openQiangZhuangPanel, this);
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_START_ANI_COMPLETE, this.onStartAniComplete, this);
    }

    private removeEvent() {
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER, this.onCallBanker, this);

        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, this.onGameStart, this);
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER_RESULT, this.onCallBankerResult, this);

        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_RESET_SCENE, this.onResetGame, this);

        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_CALL, this.onGameSceneCall, this);
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_SCORE, this.onGameSceneScore, this);

        // MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_OPEN_QIANGZHUANG, this.openQiangZhuangPanel, this);
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_START_ANI_COMPLETE, this.onStartAniComplete, this);

    }

    onDestroy() {
        this.removeEvent();
    }

    private onStartAniComplete() {
        if (MKPQZNNModel_hy.ins.gBattlePlayer[AppGame.ins.roleModel.useId].playStatus == 5) {
            this.setQZNdoeActive(true);
        } else {
            this.setQZNdoeActive(false);
        }
        UDebug.log("start ani comp");
        UAudioManager.ins.playSound("audio_qznn_ksqz");
        MKPQZNNModel_hy.ins.emit(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_MOVE_NEXT_CMD);
    }

    private onResetGame() {

        this.setQZNdoeActive(false);

    }

    /**
     * 抢庄界面打开
     * @param data 倍数数据
     */
    private openQiangZhuangPanel(data: any) {

        // var b = data.b;
        // this.setQZNdoeActive(b);
    }

    private setQZNdoeActive(b: boolean) {
        this._qznode.active = b;
    }

    /**
     * 点击抢庄倍数
     */
    private sendBeiShuInfo(event, customEventData) {
        UDebug.Log("抢庄:" + customEventData);

        UKPQZNNScene_hy.ins.playClick();

        if (customEventData >= 0) {//负数置灰,不发送
            MKPQZNNModel_hy.ins.sendCallBanker(customEventData);
        }
    }

    /**
     * 是自己的抢庄结果 就隐藏抢庄界面
     * @param data 
     */
    private onCallBanker(data: any) {
        let wCallBankerUser = data.callBankerUser;

        // cc.log("gMeChairId :" + MKPQZNNModel_hy.ins.gMeChairId);
        // cc.log("wCallBankerUser:" + wCallBankerUser);

        if (wCallBankerUser == MKPQZNNModel_hy.ins.gMeChairId) {
            this.setQZNdoeActive(false);
        }

    }

    getMycbCallBankerMultiple(mpl: number, cbCallBankerMultiple: number[], cbPlayStatus?: []) {
        let mycbCallBankerMultiple = [];

        // let playernum = MKPQZNNModel_hy.ins.getBattlePlayerLength() || 4;

        let localIndex = Math.floor(cbCallBankerMultiple.length / 4);//除去玩家数 playernum
        if (localIndex > 3) {
            localIndex = 3;
        }
        // if (playernum < 4 && cbPlayStatus) {//小于4人,证明桌上人少了
        //     //循环找出缺了哪些人的座位号
        //     let lostArray = [];

        //     for (const key in cbPlayStatus) {
        //         if (cbPlayStatus.hasOwnProperty(key)) {
        //             const element = cbPlayStatus[key];
        //             if (element == 0 || element < 1) {
        //                 lostArray.push(parseInt(key));
        //             }
        //         }
        //     }
        //     UDebug.Log("lostArray:" + JSON.stringify(lostArray));

        //     for (let j = 0; j < lostArray.length; j++) {
        //         const element = lostArray[j];
        //         for (let i = 0; i < localIndex; i++) {
        //             let inde = (element * localIndex) + i;
        //             UDebug.Log("inde element:"+ inde);

        //             if(element == 0)
        //                 cbCallBankerMultiple.unshift(0);
        //             else
        //                 cbCallBankerMultiple.splice(inde, 0, 0);

        //         }
        //     }
        // }


        UDebug.Log("mpl" + mpl);
        UDebug.Log("localIndex" + localIndex);
        UDebug.Log("cbCallBankerMultiple" + JSON.stringify(cbCallBankerMultiple));



        for (let j = 0; j < 3; j++) {
            let inde = (mpl * localIndex) + j;
            UDebug.Log("inde:" + inde);
            let element = cbCallBankerMultiple[(mpl * localIndex) + j];
            if (element) {
                // mycbCallBankerMultiple.splice(0, 0, element);
                mycbCallBankerMultiple.push(element);
            }
        }

        UDebug.Log("mycbCallBankerMultiple " + mpl + " :::::" + JSON.stringify(mycbCallBankerMultiple));
        return mycbCallBankerMultiple;
    }

    /**游戏开始 显示抢庄按钮*/
    private onGameStart(data: any) {
        var cbCallBankerMultiple = data.callBankerMultiple;
        // this.setQZNdoeActive(true);
        var cbPlayStatus = data.playStatus;

        if (cbCallBankerMultiple != null) {


            let mpl = MKPQZNNModel_hy.ins.gMeChairId;

            //发全部人的过来 
            // let mycbCallBankerMultiple = this.getMycbCallBankerMultiple(mpl, cbCallBankerMultiple, cbPlayStatus);

            //只发自己的过来
            let mycbCallBankerMultiple = cbCallBankerMultiple;


            // for (let i = 0; i < cbCallBankerMultiple.length; i++) {
            for (let i = 0; i < mycbCallBankerMultiple.length; i++) {

                if (this._qznnList && this._qznnList[i.toString()]) {

                    this._qznnList[i.toString()].label.string = mycbCallBankerMultiple[i].toString() + "倍";//"倍"

                    this._qznnList[i.toString()].btn.clickEvents.pop();

                    if (mycbCallBankerMultiple[i] > 0) {
                        this._qznnList[i.toString()].gray.active = false;
                        this._qznnList[i.toString()].gray_label.node.active = false;
                        this._qznnList[i.toString()].label.node.active = true;
                        this._qznnList[i.toString()].btn.interactable = true;
                        UEventHandler.addClick(this._qznnList[i.toString()].btn.node,
                            this.node, "VKPQZNNQZNode_hy", "sendBeiShuInfo", mycbCallBankerMultiple[i]);
                    }
                    else {
                        // this._qznnList[i.toString()].btn.node.active = false;
                        this._qznnList[i.toString()].btn.interactable = false;
                        this._qznnList[i.toString()].gray_label.node.active = true;
                        this._qznnList[i.toString()].gray_label.string = Math.abs(mycbCallBankerMultiple[i]).toString() + "倍";

                        this._qznnList[i.toString()].gray.active = true;
                        this._qznnList[i.toString()].label.node.active = false;
                    }
                }



            }

            // for (let i = 0; i < 3; i++) {
            //     UEventHandler.addClick(this._qznnList[i.toString()].btn.node,
            //         this.node, "VKPQZNNQZNode_hy", "sendBeiShuInfo", (i + 1));
            // }
        }
    }
    /**抢庄结束 隐藏抢庄按钮*/
    private onCallBankerResult(data: any) {
        this.setQZNdoeActive(false);
    }


    /**叫庄场景 */
    private onGameSceneCall(data: any) {



        this.setQZNdoeActive(true);

        if (data && data.callBankerMultiple && data.playStatus) {
            let cmdData = {
                callBankerMultiple: data.callBankerMultiple,
                playStatus: data.playStatus
            }
            this.onGameStart(cmdData);
        }
    }
    private onGameSceneScore(data: any) {
        this.setQZNdoeActive(false);
    }

}
