import UNodeHelper from "../../common/utility/UNodeHelper";
import MKPQZJHModel from "./model/MKPQZJHModel";
import UKPQZJHHelper from "./UKPQZJHHelper";
import UDebug from "../../common/utility/UDebug";
import UEventHandler from "../../common/utility/UEventHandler";
import UKPQZJHScene from "./UKPQZJHScene";


const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:下注界面
 */
@ccclass
export default class VKPQZJHXiaZhuNode extends cc.Component {

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
        this._btn_xiazhu = UNodeHelper.find(this._xiazhuNode, "qznn_btn3");
        this._btn_xiazhu.active = false;

        // for (let i = 0; i < 5; i++) {
        //     let btnpath = "node/qznn_btn3_" + (i + 1).toString();
        //     let labelpath = "node/Label_" + (i + 1).toString();
        //     this._xiaZhuList[i.toString()].btn = UNodeHelper.getComponent(this.node, btnpath, cc.Button);
        //     this._xiaZhuList[i.toString()].label = UNodeHelper.getComponent(this.node, labelpath, cc.Label);
        // }

        // cc.log(this._xiaZhuList);

    }

    private addEvent() {
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE, this.onResetGame, this);

        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_SCORE, this.onGameSceneScore, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_SEND_CARD, this.onSendCard, this);

        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_XUAN_ZHUANG_END_EVENT, this.onXuanZhuangEnd, this);

    }

    private removeEvent() {
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE, this.onResetGame, this);

        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_SEND_CARD, this.onSendCard, this);

        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_SCORE, this.onGameSceneScore, this);

        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_XUAN_ZHUANG_END_EVENT, this.onXuanZhuangEnd, this);
    }
    onDestroy() {
        this.removeEvent();
        this.unscheduleAllCallbacks();
    }

    private onSendCard() {
        this.setXiaZhuNodeActive(false);
    }

    private onResetGame() {
        this.setXiaZhuNodeActive(false);
    }

    /**根据下注的数组 更新 */
    updateXiazhuBtns(zhus: number[], length1?: number ,isScene?:boolean) {
        if (zhus[0] == 0) return;
        UDebug.Log("isScene:"+isScene);
        //是否重连进来
        isScene = true;//因为现在无论什么情况只发自己的了,如果以后恢复发4个人，就把这个赋值去掉
        if(isScene == undefined || !isScene){//不是重连的话，是发四个人的
            let mpl = MKPQZJHModel.ins.gMeChairId;
            // let playernum = MKPQZJHModel.ins.getBattlePlayerLength() || 4;

            let localArrayLen = Math.floor(zhus.length / 4);//除去玩家数  playernum
            let mycbJettonMultiple = [];

            
            // if (playernum < 4) {//小于4人,证明桌上人少了
            //     //循环找出缺了哪些人的座位号
            //     let plArray = [];
            //     let lostArray = [0,1,2,3];
            //     let baplayers = MKPQZJHModel.ins.gBattlePlayer

                

            //     for (const key in baplayers) {
            //         if (baplayers.hasOwnProperty(key)) {
            //             const element1 = baplayers[key];
            //             UDebug.Log("element1:" + JSON.stringify(element1));

            //             if (element1.chairId){
            //                 plArray.push(element1.chairId);
            //             }
            //         }
            //     }

            //     let difference = lostArray.concat(plArray).filter(v => !plArray.includes(v) ) 

            //     UDebug.Log("lostArray:" + JSON.stringify(lostArray));
            //     UDebug.Log("plArray:" + JSON.stringify(plArray));
            //     UDebug.Log("difference:" + JSON.stringify(difference));

            //     for (let j = 0; j < difference.length; j++) {
            //         const element = difference[j];
            //         if(element){
            //             for (let i = 0; i < localArrayLen; i++) {
            //                 let inde = (element * localArrayLen) + i;
            //                 if (inde) {
            //                     if (element == 0)
            //                         zhus.unshift(0);
            //                     else
            //                         zhus.splice(inde, 0, 0);
            //                 }
            //             }
            //         }
            //     }
            // }

        
            UDebug.Log("zhu:" + JSON.stringify(zhus));
            UDebug.Log("mpl:" + mpl);
            UDebug.Log("localArrayLen:" + localArrayLen);

            for (let j = 0; j < 4; j++) {
                let inde = (mpl * localArrayLen) + j;
                UDebug.Log("inde:" + inde);
                let element = zhus[(mpl * localArrayLen) + j];
                if (element > 0) {
                    mycbJettonMultiple.push(element);
                }
            }
            this._btns_length = mycbJettonMultiple.length;

            let length = mycbJettonMultiple.length; //localArrayLen

            if (length > 5) {
                length = 5;
            }


            UDebug.Log("mycbJettonMultiple " + mpl + " :::::" + JSON.stringify(mycbJettonMultiple));

            for (let i = 0; i < length; i++) {
                var item = cc.instantiate(this._btn_xiazhu);
                item.parent = this._xiazhuNode;
                item.name = "btn_xiazhu" + i.toString();
                item.active = true;

                item.setPosition(this.posx[length][i], item.getPosition().y);

                // var button = item.getComponent(cc.Button);
                var label = UNodeHelper.getComponent(item, "Label", cc.Label);
                var gray_label = UNodeHelper.getComponent(item, "gray_label", cc.Label);
                var gray = UNodeHelper.find(item, "gray");

                UDebug.Log("mycbJettonMultiple[i]:" + mycbJettonMultiple[i]);

                if (mycbJettonMultiple[i] > 0) {
                    item.getComponent(cc.Button).interactable = true;
                    label.node.active = true;
                    UEventHandler.addClick(item, this.node, "VKPQZJHXiaZhuNode", "sendXiaZhuInfo", i);//zhus[i] 点击的要传什么
                    label.string = mycbJettonMultiple[i].toString() + "b";
                    gray_label.node.active = false;
                    gray.active = false;
                }
                else {
                    item.getComponent(cc.Button).interactable = false;
                    label.node.active = false;
                    gray_label.node.active = true;
                    gray_label.string = Math.abs(mycbJettonMultiple[i]).toString() + "倍";
                    gray.active = true;
                }

                this._btns_xiazhu.push(item);
            }
        }
        else{
            if (length == null) {
                length = zhus.length;
            }
            this._btns_length = length;
            for (let i = 0; i < length; i++) {
                var item = cc.instantiate(this._btn_xiazhu);
                item.parent = this._xiazhuNode;
                item.name = "btn_xiazhu" + i.toString();
                // item.active = true;

                item.setPosition(this.posx[length][i], item.getPosition().y);

                // var button = item.getComponent(cc.Button);
                var label = UNodeHelper.getComponent(item, "Label", cc.Label);
                var gray_label = UNodeHelper.getComponent(item, "gray_label", cc.Label);
                var gray = UNodeHelper.find(item, "gray");
                item.active = true;
                if(zhus[i] > 0){
                    label.node.active = true;
                    item.getComponent(cc.Button).interactable = true;
                    UEventHandler.addClick(item, this.node, "VKPQZJHXiaZhuNode", "sendXiaZhuInfo", i);//zhus[i]
                    label.string = zhus[i].toString() + "b";
                    gray_label.node.active = false;
                    gray.active = false;
                }
                else{
                    item.getComponent(cc.Button).interactable = false;
                    label.node.active = false;
                    gray_label.node.active = true;
                    gray_label.string = Math.abs(zhus[i]).toString() + "倍";
                    gray.active = true;
                }

                this._btns_xiazhu.push(item);
            }
        }

    }
    /**移除所有下注按钮 */
    removeAllXiaZhuBtns() {
        for (let i = 0; i < this._btns_length; i++) {
            var item = this._btns_xiazhu.pop();
            if(item)
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
        if (b == false) {
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
        UKPQZJHScene.ins.playClick();

        MKPQZJHModel.ins.sendAddScore(customEventData);
    }

    /**
     * 是自己的下注结果 就隐藏下注界面
     * @param data
     */
    private onAddScoreResult(data: any) {
        let wAddJettonUser = data.addJettonUser;
        // let chairId = MKPQZJHModel.ins.changeToLocalPos(wAddJettonUser);

        // UDebug.Log("gMeChairId :" + MKPQZJHModel.ins.gMeChairId);
        // UDebug.Log("wAddJettonUser：" + wAddJettonUser);

        // UDebug.Log("onAddScoreResult:" + JSON.stringify(data));

        if (wAddJettonUser == MKPQZJHModel.ins.gMeChairId) {
            this.setXiaZhuNodeActive(false);
        }

    }
    /**下注场景 */
    private onGameSceneScore(data: any) {
        // this.setXiaZhuNodeActive(true);

        
        this.onCallBankerResult(data);
        //抢庄那边
        // var cbTimeLeave = data.cbTimeLeave;
        // if (cbTimeLeave != null) {
        //     var djsData = {
        //         time: cbTimeLeave,
        //         isAuto: true,
        //         callback:"xz"
        //     }
        //     MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_DJS_EVENT, djsData);
        // }

        // MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_DJS_EVENT)
    }

    private onXuanZhuangEnd(data: any) {
        var dwBankerUser = MKPQZJHModel.ins.gBankerIndex;
        var myPl = MKPQZJHModel.ins.gMeChairId;

        if (dwBankerUser != null && dwBankerUser == myPl) { //自己是庄家，就不显示下注按钮
            return;
        }
        var self = this;
        this.unscheduleAllCallbacks();

        this.scheduleOnce(() => {
            self.setXiaZhuNodeActive(true);
        }, 1.2);

    }


    /**抢庄结束 显示下注按钮*/
    private onCallBankerResult(data: any) {
        var dwBankerUser = data.bankerUser;
        var myPl = MKPQZJHModel.ins.gMeChairId;

        // cc.log(dwBankerUser);
        // cc.log(myPl);



        if (dwBankerUser != null && dwBankerUser == myPl) { //自己是庄家，就不显示下注按钮
            return;
        }

        // var cbJettonsMuls = data.cbJettonsMuls;
        // if (cbJettonsMuls != null) {
        //     // cbJettonsMuls
        //     UDebug.Log("xiazhunode onCallBankerResult" + JSON.stringify(data))
        //     this.updateXiazhuBtns(cbJettonsMuls,cbJettonsMuls.length);

        // }

        var cbJettonMultiple = data.jettonMultiple;
        var isScene = data["isScene"];
        if (cbJettonMultiple != null) {
            this.updateXiazhuBtns(cbJettonMultiple, cbJettonMultiple.length,isScene);
        }

    }

}
