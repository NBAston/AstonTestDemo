import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import AppGame from "../../public/base/AppGame";
import UDebug from "../../common/utility/UDebug";
import UQZNNScene from "./UXPJHScene";
import UXPJHHelper from "./UXPJHHelper";
import { XPQzjh } from "../../common/cmd/proto";

const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:下注界面
 */
@ccclass
export default class VXPJHXiaZhuNode extends cc.Component {

    // private _xiaZhuList = {
    //     "0": {
    //         btn: null,
    //         label: null
    //     },
    //     "1": {
    //         btn: null,
    //         label: null
    //     },
    //     "2": {
    //         btn: null,
    //         label: null
    //     },
    //     "3": {
    //         btn: null,
    //         label: null
    //     },
    //     "4": {
    //         btn: null,
    //         label: null
    //     }
    // }


    /**下注按钮样本 */
    private _btn_xiazhu: cc.Node;
    /**动态下注按钮数组 */
    private _btns_xiazhu: cc.Node[] = new Array();
    /**动态下注按钮数组长度 */
    private _btns_length: number = 0;

    posx = {
        [1]: [5],
        [2]: [-113, 98],
        [3]: [-161, 5, 171],
        [4]: [-248, -82, 85, 251],
        [5]: [-328, -161, 5, 171, 338],
    }

    private _xiazhuNode: cc.Node = null;


    start() {
        this.init();
        this.addEvent();

        this.setXiaZhuNodeActive(false);

    }

    private init() {
        this._xiazhuNode = UNodeHelper.find(this.node, "node");
        this._btn_xiazhu = UNodeHelper.find(this._xiazhuNode,"qznn_btn3");
        this._btn_xiazhu.active = false;

        // for (let i = 0; i < 5; i++) {
        //     let btnpath = "node/qznn_btn3_" + (i + 1).toString();
        //     let labelpath = "node/Label_" + (i + 1).toString();
        //     this._xiaZhuList[i.toString()].btn = UNodeHelper.getComponent(this.node, btnpath, cc.Button);
        //     this._xiaZhuList[i.toString()].label = UNodeHelper.getComponent(this.node, labelpath, cc.Label);
        // }

        // UDebug.log(this._xiaZhuList);

    }

    private addEvent() {
        AppGame.ins.xpqzjhModel.on(UXPJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE,this.onResetGame,this);

        AppGame.ins.xpqzjhModel.on(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        AppGame.ins.xpqzjhModel.on(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_SCORE, this.onGameSceneScore, this);

        AppGame.ins.xpqzjhModel.on(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        AppGame.ins.xpqzjhModel.on(UXPJHHelper.QZNN_SELF_EVENT.QZNN_XUAN_ZHUANG_END_EVENT, this.onXuanZhuangEnd, this);
        
    }

    private removeEvent() {
        AppGame.ins.xpqzjhModel.off(UXPJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE,this.onResetGame,this);

        AppGame.ins.xpqzjhModel.off(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        AppGame.ins.xpqzjhModel.off(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_SCORE, this.onGameSceneScore, this);

        AppGame.ins.xpqzjhModel.off(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        AppGame.ins.xpqzjhModel.off(UXPJHHelper.QZNN_SELF_EVENT.QZNN_XUAN_ZHUANG_END_EVENT, this.onXuanZhuangEnd, this);
    }
    onDestroy(){
        this.removeEvent();
        this.unscheduleAllCallbacks();
    }


    private onResetGame(){
        
        this.setXiaZhuNodeActive(false);
    }

    /**根据下注的数组 更新 */
    updateXiazhuBtns(zhus: number[], length?: number) {
        if(zhus[0]==0){
            return 
        }
        if (length == null) {
            length = zhus.length;
        }
        this._btns_length = length;
        for (let i = 0; i < length; i++) {
            var item = cc.instantiate(this._btn_xiazhu);
            item.parent = this._xiazhuNode;
            item.name = "btn_xiazhu" + i.toString();
            item.active = true;
            if(zhus[i] > 0) {
                item.getComponent(cc.Button).interactable = true;
                UEventHandler.addClick(item, this.node, "VXPJHXiaZhuNode", "sendXiaZhuInfo", i);
                UNodeHelper.find(item, "gray").active = false;
                UNodeHelper.find(item, "Label").active = true;
                UNodeHelper.find(item, "gray_label").active = false;
                UNodeHelper.getComponent(item, "Label", cc.Label).string = zhus[i].toString() + "b";
            } else {
                item.getComponent(cc.Button).interactable = false;
                UNodeHelper.find(item, "gray").active = true;
                UNodeHelper.find(item, "Label").active = false;
                UNodeHelper.find(item, "gray_label").active = true;
                UNodeHelper.getComponent(item, "gray_label", cc.Label).string = Math.abs(zhus[i]).toString() + "倍";
                // item.active = false;
            }
            item.setPosition(this.posx[length][i], item.getPosition().y);
            this._btns_xiazhu.push(item);
        }
    }  
    
    /**移除所有下注按钮 */
    removeAllXiaZhuBtns() {
        for (let i = 0; i < this._btns_length; i++) {
            var item = this._btns_xiazhu.pop();
            item.destroy(); //removeFromParent();
        }
        this._btns_length = 0;
    }

    /**
     * 设置下注界面显示状态
     * @param b 是否显示
     */
    private setXiaZhuNodeActive(b: boolean) {
        this._xiazhuNode.active = b;
        if(b == false)
        {
            this.removeAllXiaZhuBtns();
        }
    }

    /**
     * 下注界面打开 not use
     * @param data 倍数数据
     */
    private openXiaZhuPanel(data: any) {

        // var b = data.b;
        // this.setXiaZhuNodeActive(b);

        //假设数据是 倍数 1,4,8,11,15   1 3 5 7 11
    }

    /**
     * 点击按钮，发送下注选择
     * @param event 
     * @param customEventData 
     */
    private sendXiaZhuInfo(event, customEventData) {
        UDebug.log("下注:" + customEventData);
        UQZNNScene.ins.playClick();

        AppGame.ins.xpqzjhModel.sendAddScore(customEventData);
    }

    /**
     * 是自己的下注结果 就隐藏下注界面
     * @param data
     */
    private onAddScoreResult(data: any) {
        let addJettonUser = data.addJettonUser;
        // let chairId = AppGame.ins.xpqzjhModel.changeToLocalPos(addJettonUser);

        // UDebug.Log("gMeChairId :" + AppGame.ins.xpqzjhModel.gMeChairId);
        // UDebug.Log("wAddJettonUser：" + addJettonUser);

        // UDebug.Log("onAddScoreResult:" + JSON.stringify(data));

        if(addJettonUser == AppGame.ins.xpqzjhModel.gMeChairId)
        {
            this.setXiaZhuNodeActive(false);
        }

    }
    /**下注场景 */
    private onGameSceneScore(data: any) {
        // this.setXiaZhuNodeActive(true);

        //抢庄那边
        // var cbTimeLeave = data.timeLeave;
        // if (cbTimeLeave != null) {
        //     var djsData = {
        //         time: cbTimeLeave,
        //         isAuto: true,
        //         callback:"xz"
        //     }
        //     AppGame.ins.xpqzjhModel.emit(UXPJHHelper.QZNN_SELF_EVENT.QZNN_DJS_EVENT, djsData);
        // }

        // AppGame.ins.xpqzjhModel.emit(UXPJHHelper.QZNN_SELF_EVENT.QZNN_DJS_EVENT)
    }

    private onXuanZhuangEnd(data:any){
        var dwBankerUser = AppGame.ins.xpqzjhModel.gBankerIndex;
        var myPl = AppGame.ins.xpqzjhModel.gMeChairId;

        if(dwBankerUser != null && dwBankerUser == myPl)
        { //自己是庄家，就不显示下注按钮
            return;
        }
        var self = this;
        this.unscheduleAllCallbacks();

        this.scheduleOnce(()=>{
            self.setXiaZhuNodeActive(true);
        },1.2);
        
    }


    /**抢庄结束 显示下注按钮*/
    private onCallBankerResult(data: XPQzjh.NN_CMD_S_CallBankerResult) {
        var dwBankerUser = data.bankerUser;
        var myPl = AppGame.ins.xpqzjhModel.gMeChairId;

        // UDebug.log(dwBankerUser);
        // UDebug.log(myPl);

        

        if(dwBankerUser != null && dwBankerUser == myPl)
        { //自己是庄家，就不显示下注按钮
            return;
        }

        

        var jettonMultiple = data.jettonMultiple;
        if(jettonMultiple != null)
        {
            this.updateXiazhuBtns(jettonMultiple,jettonMultiple.length);
        }

    }

}
