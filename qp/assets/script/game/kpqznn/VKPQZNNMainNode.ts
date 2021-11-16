import UEventHandler from "../../common/utility/UEventHandler";
import UNodeHelper from "../../common/utility/UNodeHelper";
import MKPQZNNModel from "./model/MKPQZNNModel";
import UKPQZNNHelper from "./UKPQZNNHelper";
import UKPQZNNScene from "./UKPQZNNScene";
import UDebug from "../../common/utility/UDebug";
import AppGame from "../../public/base/AppGame";
import { ECommonUI } from "../../common/base/UAllenum";
import AppStatus from "../../public/base/AppStatus";


const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:qznn主要界面功能
 */
@ccclass
export default class VKPQZNNMainNode extends cc.Component {
    /**牌局号 */
    // @property(cc.Label)
    // label_gameID: cc.Label = null;
    /**菜单按钮 */
    // @property(cc.Button)
    // btn_menu: cc.Button = null;
    /**继续按钮 */
    @property(cc.Button)
    btn_continue: cc.Button = null;

    @property(cc.Node) //wait
    waitNode: cc.Node = null;

    //#region 倒计时相关

    /**控制是否清掉(倒计时)定时器的开关 */
    private _isShowDjs: boolean = false;
    /**倒计时定时器的方法 */
    private _refreshPickClockCd: Function = null;

    private _djsCallBack: Function = null;


    /**倒计秒数 */
    private _clockTime: number = 0;
    private _allTimer: number = 0;
    /**倒计时节点 */
    private _djsNode: cc.Node;
    /**显示秒数的label */
    private _progressTimerFont: cc.Label = null;

    private _iswait: boolean = false;

    private _xjlcToggle: cc.Toggle;


    //#endregion

    start() {
        // if (this.btn_menu != null) {
        //     UEventHandler.addClick(this.btn_menu.node, this.node, "VKPQZNNMainNode", "onBtnMenuClick");

        //     let menutoggle = this.btn_menu.node.getComponent("UToggle");
        //     menutoggle.IsOn = false;
        // }

        if (this.btn_continue != null) {
            // this.btn_continue.node.on(cc.Node.EventType.TOUCH_END, this.onBtnContinueClick, this);
            UEventHandler.addClick(this.btn_continue.node, this.node, "VKPQZNNMainNode", "onBtnContinueClick");
        }

        this._djsNode = UNodeHelper.find(this.node, "timer");
        this._progressTimerFont = UNodeHelper.getComponent(this._djsNode, "qznn_progressTimerFont", cc.Label);

        this.setContinueActive(false);


        this._xjlcToggle = UNodeHelper.getComponent(this.node, "toggle_xjlc", cc.Toggle);

        //test
        // let a=0x1e;
        // let c=a>>4;
        // cc.log(c+"  "+a.toString(16));


        //测试倒计时
        // this.testDjs();

        this.addEvent();
    }

    private addEvent() {
        MKPQZNNModel.ins.on(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, this.onGameStart, this);
        MKPQZNNModel.ins.on(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_END, this.onGameEnd, this);
        MKPQZNNModel.ins.on(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_DJS_EVENT, this.onDjsEvent, this);

        MKPQZNNModel.ins.on(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_FREE, this.onGameSceneFree, this);
        MKPQZNNModel.ins.on(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_CALL, this.onGameSceneCall, this);


        MKPQZNNModel.ins.on(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_CONTINUE_ACTIVE, this.setContinueActive, this);
        MKPQZNNModel.ins.on(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_GAMEINFO_ACTIVE, this.setGameInfoActive, this);
        MKPQZNNModel.ins.on(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_NEXT_EXIT, this.onNextExit, this);

        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
    }
    private removeEvent() {
        MKPQZNNModel.ins.off(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, this.onGameStart, this);
        MKPQZNNModel.ins.off(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_END, this.onGameEnd, this);
        MKPQZNNModel.ins.off(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_DJS_EVENT, this.onDjsEvent, this);

        MKPQZNNModel.ins.off(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_FREE, this.onGameSceneFree, this);
        MKPQZNNModel.ins.off(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_CALL, this.onGameSceneCall, this);

        MKPQZNNModel.ins.off(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_CONTINUE_ACTIVE, this.setContinueActive, this);
        MKPQZNNModel.ins.off(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_GAMEINFO_ACTIVE, this.setGameInfoActive, this);
        MKPQZNNModel.ins.off(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_NEXT_EXIT, this.onNextExit, this);

        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);

    }

    private m_nBack: number = 0
    private m_tmpClockTime: number = 0

    /**
     * 游戏切换到后台
     * @param isHide 是否切在后台
     */
    onGameToBack(isBack: boolean) {
        //倒计时逻辑
        if (isBack == true) {
            this.m_nBack = new Date().getTime() / 1000
            this.m_tmpClockTime = this._clockTime
        } else if (this._clockTime > 0 && !this._iswait) {
            let disTime = Math.round(new Date().getTime() / 1000 - this.m_nBack)
            if (disTime > this.m_tmpClockTime) //如果当前局结束
            {
                this.onDjsEvent(0)
            } else if (this.m_tmpClockTime > disTime) {
                this._clockTime = this.m_tmpClockTime - disTime
            }
        } else {
            this.onDjsEvent(0)
        }
    }

    /******* event *********/
    /**
     * 游戏开始
     * @param data 
     */
    private onGameStart(data) {
        // cc.log("ongamestart");

        var cbPlayStatus = data.playStatus;//玩家状态
        var cbCallBankerTime = data.callBankerTime;

        // if (cbCallBankerTime != null) {
        // this.showDjs(cbCallBankerTime);
        this.setContinueActive(false);

        setTimeout(() => {
            MKPQZNNModel.ins.emit(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_START_ANI_COMPLETE);
        }, 3500);
    }
    private onDjsEvent(data: any, iswait?: boolean) { //

        if (data != null) {
            this._clockTime = data;
            this._allTimer = data;
            if (data == 0) {
                this.updateTimerPro(this._clockTime, true);
            }
        }

        if (iswait != null) {
            this._iswait = iswait;

            if (this._iswait == true) {
                this._djsNode.active = false;
                this.updateTimerPro(this._clockTime, true);
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
        //                 UKPQZNNScene.ins.getMusic.playCountDown();
        //             } else {
        //                 UKPQZNNScene.ins.getMusic.playTimenotice();
        //             }
        //         }
        //     }, 1, this._clockTime);
        // }

    }




    onGameSceneFree(data) {
        this.setContinueActive(true);
    }
    onGameSceneCall(data) {
        this.setContinueActive(false);
    }


    onGameEnd(data: any) {
        this.onDjsEvent(0);

        var self = this;
        this.node.runAction(cc.sequence(
            cc.delayTime(data.endTime + 0.5),
            cc.callFunc(() => {
                // self.setContinueActive(true);
                MKPQZNNModel.ins.emit(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE);
                this.setContinueActive(true);
                // UKPQZNNScene.ins.waitbattle();
            }
            )));
    }

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
        UKPQZNNScene.ins.playClick();

        this.resetScene();
        UKPQZNNScene.ins.waitbattle();

        if (UKPQZNNScene.ins.fromeDisconnect) {

            MKPQZNNModel.ins.reconnectRequest();
            UKPQZNNScene.ins.fromeDisconnect = false;
        }
        else {
            MKPQZNNModel.ins.requestMatch();
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
        this.node.stopAllActions();
        this.waitNode.active = b;
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
        MKPQZNNModel.ins.emit(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE);
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
                            // MKPQZNNModel.ins.sendCallBanker(0); //时间到发送不抢 //服务器会有操作
                            // cc.log("mainnode_ondjsevent qqqqqqqqqqqqqqq");
                            var data = {
                                b: false
                            }
                            MKPQZNNModel.ins.emit(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_OPEN_QIANGZHUANG, data);

                        }
                    }
                    break;
                case "xz":
                    {
                        // this._djsCallBack = () => {
                        //     MKPQZNNModel.ins.sendAddScore(0); //时间到发送下注1倍 //服务器会有操作
                        //     cc.log("mainnode_ondjsevent xxxxxxxxxxxx");
                        //     var data ={
                        //         b:false
                        //     }
                        //     MKPQZNNModel.ins.emit(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_OPEN_XIAZHU,data);

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
    }


    /**隐藏倒计时  not use*/
    private hideDjs() {

    }
    //#endregion


    update(dt: number) {
        if (this._clockTime > 0 && !this._iswait) {
            this._djsNode.active = true;

            this._clockTime -= dt;
            let leave_time = Math.ceil(this._clockTime);//.floor

            let str_time = leave_time.toString();
            this.updateTimerPro(this._clockTime, false);
            if (this._progressTimerFont != null) {
                this._progressTimerFont.string = str_time;
            }

            if (this._clockTime < 0) {
                this._clockTime = 0;
                UKPQZNNScene.ins.getMusic.playTimeOut();
                this.updateTimerPro(this._clockTime, true);
            }
        }
    }

    /**
     * @description 计时器进度条
     * @param lastTime  剩余时间
     * @param isInit 是否初始化
     */
    updateTimerPro(lastTime: number, isInit: boolean) {
        let _ProgressBar = this._djsNode.getComponent(cc.ProgressBar);
        this._djsNode.active = !isInit;
        if (isInit) {
            this._clockTime = 0;
            this._allTimer = 0;
            _ProgressBar.progress = 1;
        } else {
            _ProgressBar.progress = lastTime / this._allTimer;
        };
    };

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
        UKPQZNNScene.ins.playClick();
        MKPQZNNModel.ins.sendNextExit(e.isChecked);
    }

    private onNextExit(data: any) {
        if (this._xjlcToggle.isChecked != data.bExit)
            this._xjlcToggle.isChecked = data.bExit;
    }

    onClickChat() {
        UKPQZNNScene.ins.playClick();
        AppGame.ins.showUI(ECommonUI.UI_CHAT_HY);
    }
}
