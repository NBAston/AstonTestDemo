import UNodePool from "../../common/utility/UNodePool";
import UNodeHelper from "../../common//utility/UNodeHelper";
import VBaseUI from "../../common/base/VBaseUI";
import AppGame from "../../public/base/AppGame";
import { ECommonUI } from "../../common/base/UAllenum";
import UDebug from "../../common/utility/UDebug";
import UEventHandler from "../../common/utility/UEventHandler";
import UToggle from "../../common/utility/UToggle";
import UQZNNHelper from "./UQZNNHelper";
import UQZNNScene from "./UQZNNScene";
import { Qznn } from "../../common/cmd/proto";
import MQZNNModel from "./model/MQZNNModel";

const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:qznn主要界面功能
 */
@ccclass
export default class VQZNNMainNode extends cc.Component {
    /**牌局号 */
    // @property(cc.Label)
    // label_gameID: cc.Label = null;
    /**菜单按钮 */
    // @property(cc.Button)
    // btn_menu: cc.Button = null;
    /**继续按钮 */
    @property(cc.Button)
    btn_continue: cc.Button = null;
    @property(cc.Node)
    waitNode: cc.Node = null;
    @property(cc.Sprite)
    clockSprite: cc.Sprite = null;
    @property(cc.Node)
    chatBtn: cc.Node = null;
    //#region 倒计时相关

    /**控制是否清掉(倒计时)定时器的开关 */
    private _isShowDjs: boolean = false;
    /**倒计时定时器的方法 */
    private _refreshPickClockCd: Function = null;

    private _djsCallBack: Function = null;

    /**倒计总数 */
    private _clockTotalTime: number = 0;
    /**倒计秒数 */
    private _clockTime: number = 0;
    /**倒计时节点 */
    private _djsNode: cc.Node;
    /**显示秒数的label */
    private _progressTimerFont: cc.Label = null;

    private _iswait: boolean = false;

    private _xjlcToggle: cc.Toggle;
    //#endregion

    start() {
        // if (this.btn_menu != null) {
        //     UEventHandler.addClick(this.btn_menu.node, this.node, "VQZNNMainNode", "onBtnMenuClick");

        //     let menutoggle = this.btn_menu.node.getComponent("UToggle");
        //     menutoggle.IsOn = false;
        // }

        if (this.btn_continue != null) {
            // this.btn_continue.node.on(cc.Node.EventType.TOUCH_END, this.onBtnContinueClick, this);
            UEventHandler.addClick(this.btn_continue.node, this.node, "VQZNNMainNode", "onBtnContinueClick");
        }

        this._djsNode = UNodeHelper.find(this.node, "qznn_djsNode");
        this._djsNode.active = false

        this._progressTimerFont = UNodeHelper.getComponent(this._djsNode, "qznn_progressTimerFont", cc.Label);

        this.setContinueActive(false);

        this._xjlcToggle = UNodeHelper.getComponent(this.node , "toggle_xjlc" , cc.Toggle);
        //test
        // let a=0x1e;
        // let c=a>>4;
        // cc.log(c+"  "+a.toString(16));


        //测试倒计时
        // this.testDjs();

        this.addEvent();
    }

    private addEvent() {
        AppGame.ins.qznnModel.on(UQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, this.onGameStart, this);
        AppGame.ins.qznnModel.on(UQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_END, this.onGameEnd, this);
        AppGame.ins.qznnModel.on(UQZNNHelper.QZNN_SELF_EVENT.QZNN_DJS_EVENT, this.onDjsEvent, this);
        
        AppGame.ins.qznnModel.on(UQZNNHelper.QZNN_EVENT.QZNN_GAMESCENE_FREE, this.onGameSceneFree, this);
        AppGame.ins.qznnModel.on(UQZNNHelper.QZNN_EVENT.QZNN_GAMESCENE_CALL, this.onGameSceneCall, this);
        AppGame.ins.qznnModel.on(UQZNNHelper.QZNN_EVENT.QZNN_GAMESCENE_SCORE, this.onGameSceneCall, this);
        AppGame.ins.qznnModel.on(UQZNNHelper.QZNN_EVENT.QZNN_GAMESCENE_OPEN, this.onGameSceneCall, this);
        AppGame.ins.qznnModel.on(UQZNNHelper.QZNN_EVENT.QZNN_GAMESCENE_END, this.onGameSceneCall, this);

        AppGame.ins.qznnModel.on(UQZNNHelper.QZNN_SELF_EVENT.QZNN_CONTINUE_ACTIVE, this.setContinueActive, this);
        AppGame.ins.qznnModel.on(UQZNNHelper.QZNN_SELF_EVENT.QZNN_GAMEINFO_ACTIVE, this.setGameInfoActive, this);
        AppGame.ins.qznnModel.on(UQZNNHelper.QZNN_SELF_EVENT.QZNN_NEXT_EXIT , this.onNextExit , this);
        AppGame.ins.qznnModel.on(UQZNNHelper.QZNN_SELF_EVENT.QZNN_GAME_TO_SHOW, this.onGameToShow, this);

    }
    private removeEvent() {
        AppGame.ins.qznnModel.off(UQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, this.onGameStart, this);
        AppGame.ins.qznnModel.off(UQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_END, this.onGameEnd, this);
        AppGame.ins.qznnModel.off(UQZNNHelper.QZNN_SELF_EVENT.QZNN_DJS_EVENT, this.onDjsEvent, this);

        AppGame.ins.qznnModel.off(UQZNNHelper.QZNN_EVENT.QZNN_GAMESCENE_FREE, this.onGameSceneFree, this);
        AppGame.ins.qznnModel.off(UQZNNHelper.QZNN_EVENT.QZNN_GAMESCENE_CALL, this.onGameSceneCall, this);
        AppGame.ins.qznnModel.off(UQZNNHelper.QZNN_EVENT.QZNN_GAMESCENE_SCORE, this.onGameSceneCall, this);
        AppGame.ins.qznnModel.off(UQZNNHelper.QZNN_EVENT.QZNN_GAMESCENE_OPEN, this.onGameSceneCall, this);
        AppGame.ins.qznnModel.off(UQZNNHelper.QZNN_EVENT.QZNN_GAMESCENE_END, this.onGameSceneCall, this);

        AppGame.ins.qznnModel.off(UQZNNHelper.QZNN_SELF_EVENT.QZNN_CONTINUE_ACTIVE, this.setContinueActive, this);
        AppGame.ins.qznnModel.off(UQZNNHelper.QZNN_SELF_EVENT.QZNN_GAMEINFO_ACTIVE, this.setGameInfoActive, this);
        AppGame.ins.qznnModel.off(UQZNNHelper.QZNN_SELF_EVENT.QZNN_NEXT_EXIT , this.onNextExit , this);
        AppGame.ins.qznnModel.off(UQZNNHelper.QZNN_SELF_EVENT.QZNN_GAME_TO_SHOW, this.onGameToShow, this);


    }




    /******* event *********/
    /**
     * 游戏开始
     * @param data 
     */
    private onGameStart(data:Qznn.NN_CMD_S_GameStart) {
        // cc.log("ongamestart");

        var cbPlayStatus = data.playStatus;//玩家状态
        var cbCallBankerTime = data.callBankerTime;

        // if (cbCallBankerTime != null) {
        // this.showDjs(cbCallBankerTime);
        this.setContinueActive(false);


        // var data1 = {
        //     time: cbCallBankerTime,
        //     isAuto: true,
        //     callback: "qz"
        // }

        // this.onDjsEvent(data1);
        // }
    }
    private onDjsEvent(data: any, iswait?: boolean) { //

        if (data != null) {
            this._clockTime = data;
            this._clockTotalTime = data;
            if (data == 0) {
                this._djsNode.active = false;
            }
        }

        if (iswait != null) {
            this._iswait = iswait;

            if (this._iswait == true) {
                this._djsNode.active = false;
            }
        }

        //不要声音
        // if (this._iswait == false) {
        //     //倒计时声音
        //     var self = this;
        //     this.unscheduleAllCallbacks();
        //     this.schedule(() => {
        //         if (self._clockTime > 0) {
        //             if (self._clockTime > 3) {
        //                 UQZNNScene.ins.getMusic.playCountDown();
        //             } else {
        //                 UQZNNScene.ins.getMusic.playTimenotice();
        //             }
        //         }
        //     }, 1, this._clockTime);
        // }

    }




    onGameSceneFree(data) {
        this.setContinueActive(true);
        this._xjlcToggle.isChecked = data.bRoundEndExit;
        //AppGame.ins.qznnModel.emit(UQZNNHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE);
        //this.waitNode.active = true;
    }
    onGameSceneCall(data) {
        this.waitNode.active = false;
        if (data.bRoundEndExit)
        this._xjlcToggle.isChecked = data.bRoundEndExit;
        this.setContinueActive(false);
    }


    onGameEnd(data: any) {
        this.onDjsEvent(0);
        var self = this;
        this.node.runAction(cc.sequence(
            cc.delayTime(5),
            cc.callFunc(() => {
                //todo next start
                // self.setContinueActive(true);
                AppGame.ins.qznnModel.isGaming = false
                AppGame.ins.qznnModel.emit(UQZNNHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE);
                self.waitNode.active = true;
                //UQZNNScene.ins.waitbattle();
            }
            )));
    }

    /**点击聊天 */
    private onClickChat() {
        UQZNNScene.ins.playClick();
        AppGame.ins.showUI(ECommonUI.UI_CHAT_HY);
    }
        /*
    /**菜单按钮点击事件 */
    onBtnMenuClick(event) {
        // UDebug.Log("onBtnMenuClick");
        /* *
        var temp = this.node.parent.getChildByName("qznnMenuNode");
        if (temp != null) {
            // this.node.parent.removeChild(temp,true);
            // UNodePool.reclaimNode(temp);

            temp.active = true;
        }
        else {//方法2

            cc.loader.loadRes("prefab/game/qznn/qznnMenuNode", (err, prefab) => {
                if (err != null) {
                    UDebug.Log(err.message);//  
                    return;
                }
                if (prefab == null) {
                    return;
                }

                var newNode = UNodePool.getObj("qznnMenuNode", prefab);
                this.node.parent.addChild(newNode);
                newNode.active = true;

                //方法1
                //var newNode = cc.instantiate(prefab);
                //this.node.parent.addChild(newNode);

                // var temp1 = this.node.parent.getChildByName("qznnMenuNode");
                // cc.log(temp1);
                // cc.log(temp1.name);
            });
        }*/


        // AppGame.ins.showUI(ECommonUI.QZNN_Menu, this.btn_menu);
    }
    /**继续按钮点击事件 */
    onBtnContinueClick(event) {
        UQZNNScene.ins.playClick();

        this.resetScene();
        UQZNNScene.ins.waitbattle();

        if (UQZNNScene.ins.fromeDisconnect) {

            AppGame.ins.qznnModel.reconnectRequest();
            UQZNNScene.ins.fromeDisconnect = false;
        }
        else {
            AppGame.ins.qznnModel.requestMatch();
        }
        this.setContinueActive(false);


        // this.testDjs();
    }
    //请等待其他玩家抢庄  //请等待其他玩家拼牌  //请等待其他闲家下注  

    /**
     * 继续按钮激活状态
     * @param b 是否显示
     */
    setContinueActive(b: boolean = true) {
        if (!b)
        {
            this.waitNode.active = false;
            this.node.stopAllActions();
        }
    }

    setGameInfoActive(b: boolean) {

    }

    onGameInfo(data: any) {

    }


    /**
     * 场景重置
     */
    resetScene() {
        this.onDjsEvent(0);
        AppGame.ins.qznnModel.emit(UQZNNHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE);
    }

    //#region  旧倒计时相关
    /**
 * 倒计时 事件 not sue
 * @param data 
 */
    private onDjsEvent1(data) {
        var callback = data.callback;
        var isAuto = data.isAuto;
        var time = data.time;

        this.hideDjs();
        if (callback != null && isAuto == true) {
            switch (callback) {
                case "qz":
                    {
                        this._djsCallBack = () => {
                            // AppGame.ins.qznnModel.sendCallBanker(0); //时间到发送不抢 //服务器会有操作
                            // cc.log("mainnode_ondjsevent qqqqqqqqqqqqqqq");
                            var data = {
                                b: false
                            }
                            AppGame.ins.qznnModel.emit(UQZNNHelper.QZNN_SELF_EVENT.QZNN_OPEN_QIANGZHUANG, data);

                        }
                    }
                    break;
                case "xz":
                    {
                        // this._djsCallBack = () => {
                        //     AppGame.ins.qznnModel.sendAddScore(0); //时间到发送下注1倍 //服务器会有操作
                        //     cc.log("mainnode_ondjsevent xxxxxxxxxxxx");
                        //     var data ={
                        //         b:false
                        //     }
                        //     AppGame.ins.qznnModel.emit(UQZNNHelper.QZNN_SELF_EVENT.QZNN_OPEN_XIAZHU,data);

                        // }
                    }
                    break;
                default:
                    break;
            }
        }

        if (time != null) {
            this.showDjs(time);
        }
    }

    /**
     * 设置倒计时秒数显示
     * @param num 秒数
     */
    private setClockTimer(num: number): void {
        if (num < 0) return;

        if (this._progressTimerFont != null) //如果没加且定时器没清掉,跳场景这里会报错
            this._progressTimerFont.string = num.toFixed();//.toString();
    }

    /**
     * 显示倒计时 not use
     * @param cbTime 倒计秒数 
     */
    private showDjs(cbTime: number) {

        // this._djsNode.active = true;
        // this._clockTime = cbTime;

        // this.setClockTimer(this._clockTime);
        // this._isShowDjs = true;

        // var self = this;
        // this._refreshPickClockCd = () => {
        //     self._clockTime--;
        //     if (self._clockTime >= 0) {
        //         self.setClockTimer(self._clockTime);
        //     }
        //     else {
        //         // self.setClockTimer(0);
        //         self.hideDjs();
        //     }
        // };
        // cc.director.getScheduler().schedule(this._refreshPickClockCd, this.node, 1, false);
    }


    /**隐藏倒计时  not use*/
    private hideDjs() {
        // if (this._djsNode != null)//如果没加且定时器没清掉,跳场景这里会报错
        //     this._djsNode.active = false;
        // this._clockTime = 0;
        // this._isShowDjs = false;

        // if (this._djsCallBack != null) {
        //     this._djsCallBack();
        //     this._djsCallBack = null;
        // }

    }
    //#endregion


    update(dt: number) {
        // if (!this._isShowDjs) {
        //     cc.director.getScheduler().unschedule(this._refreshPickClockCd, this.node);
        // }

        // //倒计时相关
        // if (this._clockTime > 0) {
        //     this._djsNode.active = true;

        //     this._clockTime -= dt;
        //     if (this._clockTime < 0) {
        //         this._clockTime = 0;
        //         this._djsNode.active = false;
        //     }
        //     let leave_time = Math.floor(this._clockTime);

        //     let str_time = leave_time.toString();
        //     if (this._progressTimerFont != null)
        //         this._progressTimerFont.string = str_time;
        // }

        if (this._clockTime > 0 && !this._iswait) {
            this._djsNode.active = true;

            this._clockTime -= dt;
            if (this._clockTime < 0) {
                this._clockTime = 0;
                this._djsNode.active = false;
                UQZNNScene.ins.getMusic.playTimeOut();
                // this.unscheduleAllCallbacks();
            }

            let leave_time = Math.ceil(this._clockTime);//.floor

            //刷新圆圈时钟
            this.clockSprite.fillRange = this._clockTime /this._clockTotalTime 

            let str_time = leave_time.toString();
            // if (leave_time < 10) {
            //     str_time = '0' + leave_time;
            // }
            if (this._progressTimerFont != null) {
                this._progressTimerFont.string = str_time;


            }


        }
    }

    testDjs() {
        // this.showDjs(10);
    }

    onDisable() {
        //以防万一
        // cc.director.getScheduler().unschedule(this._refreshPickClockCd, this.node);
    }

    onDestroy() {
        //从全局对象池中清掉 本场景的缓存节点
        // UNodePool.clearall("qznnMenuNode");

        this.removeEvent();

        //以防万一 最后再清一次
        // cc.director.getScheduler().unschedule(this._refreshPickClockCd, this.node);
    }

     /**是否退出游戏 */
     private isExitGame(e: cc.Toggle) {
        UDebug.Log(e.isChecked)
        AppGame.ins.qznnModel.sendNextExit(e.isChecked);
    }

    private onNextExit(data:any) {
        if (this._xjlcToggle.isChecked != data.bExit)
            this._xjlcToggle.isChecked = data.bExit;    
    }

    onGameToShow(){
        this.waitNode.active = false
    }
}
