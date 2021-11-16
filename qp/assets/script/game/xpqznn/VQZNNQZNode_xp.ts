import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import AppGame from "../../public/base/AppGame";
import UQZNNScene from "./UQZNNScene_xp";
import UQZNNHelper from "./UQZNNHelper_xp";
import UDebug from "../../common/utility/UDebug";
import { XPQznn } from "../../common/cmd/proto";

const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:抢庄按钮界面
 */
@ccclass
export default class VXPQZNNQZNode extends cc.Component {

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
            let gray_path = path + "/gray";
            this._qznnList[i.toString()].gray = UNodeHelper.find(this.node, gray_path);

            let gray_label_path = path + "/gray_label";
            this._qznnList[i.toString()].gray_label = UNodeHelper.getComponent(this.node, gray_label_path, cc.Label);
        }

        this._btnBuQiang = UNodeHelper.getComponent(this.node, "node/qznn_btn2buqiang", cc.Button);
        // UDebug.log(this._qznnList);
        this._qznode = UNodeHelper.find(this.node, "node");

    }

    private addEvent() {
        

        UEventHandler.addClick(this._btnBuQiang.node,
            this.node, "VQZNNQZNode_xp", "sendBeiShuInfo", 0);

        AppGame.ins.xpqznnModel.on(UQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER, this.onCallBanker, this);

        AppGame.ins.xpqznnModel.on(UQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, this.onGameStart, this);
        AppGame.ins.xpqznnModel.on(UQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER_RESULT, this.onCallBankerResult, this);

        AppGame.ins.xpqznnModel.on(UQZNNHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE,this.onResetGame,this);

        AppGame.ins.xpqznnModel.on(UQZNNHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_CALL, this.onGameSceneCall, this);
        AppGame.ins.xpqznnModel.on(UQZNNHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_SCORE, this.onGameSceneScore, this);

        // AppGame.ins.xpqznnModel.on(UQZNNHelper.QZNN_SELF_EVENT.QZNN_OPEN_QIANGZHUANG, this.openQiangZhuangPanel, this);
        AppGame.ins.xpqznnModel.on(UQZNNHelper.QZNN_SELF_EVENT.QZNN_START_ANI_COMPLETE, this.onStartAniComplete, this);
    }

    private removeEvent(){
        AppGame.ins.xpqznnModel.off(UQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER, this.onCallBanker, this);

        AppGame.ins.xpqznnModel.off(UQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, this.onGameStart, this);
        AppGame.ins.xpqznnModel.off(UQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER_RESULT, this.onCallBankerResult, this);

        AppGame.ins.xpqznnModel.off(UQZNNHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE,this.onResetGame,this);

        AppGame.ins.xpqznnModel.off(UQZNNHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_CALL, this.onGameSceneCall, this);
        AppGame.ins.xpqznnModel.off(UQZNNHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_SCORE, this.onGameSceneScore, this);

        // AppGame.ins.xpqznnModel.off(UQZNNHelper.QZNN_SELF_EVENT.QZNN_OPEN_QIANGZHUANG, this.openQiangZhuangPanel, this);
        AppGame.ins.xpqznnModel.off(UQZNNHelper.QZNN_SELF_EVENT.QZNN_START_ANI_COMPLETE, this.onStartAniComplete, this);

    }

    onDestroy(){
        this.removeEvent();
    }

    private onStartAniComplete(){
        this.setQZNdoeActive(true);
        UDebug.log("start ani comp");
        AppGame.ins.xpqznnModel.emit(UQZNNHelper.QZNN_SELF_EVENT.QZNN_MOVE_NEXT_CMD);
    }

    private onResetGame(){

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
        UDebug.log("抢庄:" + customEventData);

        UQZNNScene.ins.playClick();
        AppGame.ins.xpqznnModel.sendCallBanker(customEventData);
    }

    /**
     * 是自己的抢庄结果 就隐藏抢庄界面
     * @param data 
     */
    private onCallBanker(data: XPQznn.NN_CMD_S_CallBanker) {
        let wCallBankerUser = data.callBankerUser;

        // UDebug.log("gMeChairId :" + AppGame.ins.xpqznnModel.gMeChairId);
        // UDebug.log("wCallBankerUser:" + wCallBankerUser);

        if (wCallBankerUser == AppGame.ins.xpqznnModel.gMeChairId) {
            this.setQZNdoeActive(false);
        }

    }


    /**游戏开始 显示抢庄按钮*/
    private onGameStart(data: XPQznn.NN_CMD_S_GameStart) {
        var cbCallBankerMultiple = data.callBankerMultiple;
        // this.setQZNdoeActive(true);

        if(cbCallBankerMultiple != null && cbCallBankerMultiple[0]>0)
        {
            for (let i = 0; i < cbCallBankerMultiple.length; i++) {
                if(i>=3) 
                {
                    UDebug.Log("抢庄倍数超了");
                    continue;
                }
                this._qznnList[i.toString()].label.string = cbCallBankerMultiple[i].toString() + "倍";//"倍"
                this._qznnList[i.toString()].btn.clickEvents.pop();

                if (cbCallBankerMultiple[i] > 0) {
                    this._qznnList[i.toString()].btn.interactable = true;
                    this._qznnList[i.toString()].gray.active = false;
                    this._qznnList[i.toString()].gray_label.node.active = false;
                    this._qznnList[i.toString()].label.node.active = true;

                    UEventHandler.addClick(this._qznnList[i.toString()].btn.node,
                        this.node, "VQZNNQZNode_xp", "sendBeiShuInfo", cbCallBankerMultiple[i]);
                }
                else {
                    // this._qznnList[i.toString()].btn.node.active = false;
                    this._qznnList[i.toString()].btn.interactable = false;
                    this._qznnList[i.toString()].gray_label.node.active = true;
                    this._qznnList[i.toString()].gray_label.string = Math.abs(cbCallBankerMultiple[i]).toString() + "倍";
                    this._qznnList[i.toString()].gray.active = true;
                    this._qznnList[i.toString()].label.node.active = false;
                }
            }

            // for (let i = 0; i < 3; i++) {
            //     UEventHandler.addClick(this._qznnList[i.toString()].btn.node,
            //         this.node, "VQZNNQZNode_xp", "sendBeiShuInfo", (i + 1));
            // }
        }else{
            this.setQZNdoeActive(false);
        }
    }
    /**抢庄结束 隐藏抢庄按钮*/
    private onCallBankerResult(data: any) {
        this.setQZNdoeActive(false);
    }


    /**叫庄场景 */
    private onGameSceneCall(data: any) {
        this.setQZNdoeActive(true);
    }
    private onGameSceneScore(data: any) {
        this.setQZNdoeActive(false);
    }

}
