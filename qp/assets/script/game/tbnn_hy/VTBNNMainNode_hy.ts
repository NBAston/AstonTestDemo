import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "../../public/base/AppGame";
import AppStatus from "../../public/base/AppStatus";
import UDebug from "../../common/utility/UDebug";
import { FTbnn } from "../../common/cmd/proto";
import MTBNNModel_hy from "./model/MTBNNModel_hy";
import UTBNNHelper_hy from "./UTBNNHelper_hy";
import UTBNNScene_hy from "./UTBNNScene_hy";
import UDateHelper from "../../common/utility/UDateHelper";
import { ECommonUI, EGameType } from "../../common/base/UAllenum";
import { ETBNNState } from "../tbnn/UTBNNHelper";



const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:qznn主要界面功能
 */
@ccclass
export default class VTBNNMainNode_hy extends cc.Component {
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
    //#region 倒计时相关


    /**控制是否清掉(倒计时)定时器的开关 */
    private _isShowDjs: boolean = false;
    /**倒计时定时器的方法 */
    private _refreshPickClockCd: Function = null;

    private _djsCallBack: Function = null;


    /**总倒计秒数 */
    private _clockTimeTotal: number = 0;
    /**倒计秒数 */
    private _clockTime: number = 0;
    /**倒计时节点 */
    private _djsNode: cc.Node;
    /**倒计时filled img*/
    private _djsImg: cc.Sprite;
    /**显示秒数的label */
    private _progressTimerFont: cc.Label = null;

    private _iswait: boolean = false;

    private _roomLeftSeconds: number = -1; //房间剩余时间
    private _timeOutSeconds: number = -1; //超时剩余时间

    @property(cc.Label) roundTimeLab: cc.Label = null; //局数、时间显示
    @property(cc.Label) timeOutLbl: cc.Label = null; //超时计时label

    private _hideTime = -1; //隐藏到后台的时候时间戳

    //#endregion

    start() {
        // if (this.btn_menu != null) {
        //     UEventHandler.addClick(this.btn_menu.node, this.node, "VTBNNMainNode_hy", "onBtnMenuClick");

        //     let menutoggle = this.btn_menu.node.getComponent("UToggle");
        //     menutoggle.IsOn = false;
        // }

        // if (this.btn_continue != null) {
        //     // this.btn_continue.node.on(cc.Node.EventType.TOUCH_END, this.onBtnContinueClick, this);
        //     UEventHandler.addClick(this.btn_continue.node, this.node, "VTBNNMainNode_hy", "onBtnContinueClick");
        // }
        this.timeOutLbl.node.parent.opacity = 0;
        this.timeOutLbl.node.parent.active = true;

        this._djsNode = UNodeHelper.find(this.node, "qznn_djsNode");
        this._djsImg = UNodeHelper.getComponent(this._djsNode, "time1", cc.Sprite);
        this._progressTimerFont = UNodeHelper.getComponent(this._djsNode, "qznn_progressTimerFont", cc.Label);

        this.setContinueActive(false);

        this.addEvent();

    }

    private addEvent() {
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAME_START, this.onGameStart, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_GAME_END, this.onGameEnd, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_DJS_EVENT, this.onDjsEvent, this);

        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_FREE, this.onGameSceneFree, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_GAMESCENE_CALL, this.onGameSceneCall, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_SCORE, this.onGameSceneScore, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_OPEN, this.onGameSceneOpen, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_END, this.onGameSceneEnd, this);

        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_CONTINUE_ACTIVE, this.setContinueActive, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_GAMEINFO_ACTIVE, this.setGameInfoActive, this);

        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);

        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_HOST_AGAIN, this.onUpdateRoomInfo, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SHOW_TIME_OUT, this.onTimeOut, this)
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_PRE_DISMISS, this.onPreDismiss, this);

    }
    private removeEvent() {
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAME_START, this.onGameStart, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_GAME_END, this.onGameEnd, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_DJS_EVENT, this.onDjsEvent, this);

        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_FREE, this.onGameSceneFree, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_GAMESCENE_CALL, this.onGameSceneCall, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_SCORE, this.onGameSceneScore, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_OPEN, this.onGameSceneOpen, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_END, this.onGameSceneEnd, this);


        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_CONTINUE_ACTIVE, this.setContinueActive, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_GAMEINFO_ACTIVE, this.setGameInfoActive, this);

        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);

        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_HOST_AGAIN, this.onUpdateRoomInfo, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SHOW_TIME_OUT, this.onTimeOut, this)
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_PRE_DISMISS, this.onPreDismiss, this);

    }

    private m_nBack: number = 0
    private m_tmpClockTime: number = 0

    /**
     * 游戏切换到后台
     * @param isHide 是否切在后台
     */
    onGameToBack(isBack: boolean) {
        //处理自动解散时间、房间时间
        if (isBack) {
            this._hideTime = new Date().getTime();
        } else {
            let nowTime = new Date().getTime();
            if (this._hideTime > 0) {
                let diffSeconds = (nowTime - this._hideTime) / 1000;
                this._timeOutSeconds -= diffSeconds;
                this._roomLeftSeconds -= diffSeconds;
                this._hideTime = -1;
            }

            if (MTBNNModel_hy.ins.gameState == ETBNNState.Wait) {
                this.waitNode.active = true;
            }
        }

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
        // var cbPlayStatus = data.cbPlayStatus;//玩家状态
        //var cbCallBankerTime = data.cbAddJettonTime;

        // if (cbCallBankerTime != null) {
        // this.showDjs(cbCallBankerTime);

        this.setContinueActive(false);
        this.setRoundOrTime(data);
        // var data1 = {
        //     time: cbCallBankerTime,
        //     isAuto: true,
        //     callback: "qz"
        // }
        //var data1 = cbCallBankerTime;
        //  this.onDjsEvent(data1);
        // }

        this.timeOutLbl.node.parent.opacity = 0;
        this._timeOutSeconds = -1;

        setTimeout(() => {
            MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_START_ANI_COMPLETE);
        }, 3500);
    }
    private onDjsEvent(data: any, iswait?: boolean) { //
        if (data != null) {
            this._clockTime = data;
            this._clockTimeTotal = data;
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
        //                 UTBNNScene_hy.ins.getMusic.playCountDown();
        //             } else {
        //                 UTBNNScene_hy.ins.getMusic.playTimenotice();
        //             }
        //         }
        //     }, 1, this._clockTime);
        // }

    }

    onGameSceneFree(data) {
        this.setContinueActive(true);
        this._timeOutSeconds = data.idleLeave;
        this.setRoundOrTime(data);
    }
    onGameSceneCall(data) {
        this.setContinueActive(false);
        this.setRoundOrTime(data);
    }

    onGameSceneScore(data) {
        this.setContinueActive(false);
        this.setRoundOrTime(data);
    }

    onGameSceneOpen(data) {
        this.setContinueActive(false);
        this.setRoundOrTime(data);
    }

    onGameSceneEnd(data) {
        this.setContinueActive(true);
        this.setRoundOrTime(data);
    }

    onGameEnd(data: any) {
        this.onDjsEvent(0);
        this.setRoundOrTime(data);
        var self = this;
        this.node.runAction(cc.sequence(
            cc.delayTime(data.endTime),
            cc.callFunc(() => {
                //todo 一局一匹配
                //self.setContinueActive(true);
                self.waitNode.active = true;
                UTBNNScene_hy.ins.waitbattle();
            }
            )));
    }

    /**超时消息 */
    onTimeOut(data: any) {
        this.setTimeOutTime(data.idleLeave);
        this._timeOutSeconds = data.idleLeave;
    }

    onPreDismiss() {
        this._roomLeftSeconds = 0;
        this.setRounTimeLabel(0);
    }

    /**更新房间信息 */
    onUpdateRoomInfo(data: any) {
        this.setRoundOrTime(data);
    }

    /**设置超时时间 */
    setTimeOutTime(seconds: number) {
        if (this.timeOutLbl) {
            this.timeOutLbl.string = '自动解散:' + UDateHelper.secondsToTime(seconds, false);
            if (seconds > 600 || (this._roomLeftSeconds >= 0 && this._roomLeftSeconds < seconds)) {
                this.timeOutLbl.node.parent.opacity = 0;
            } else {
                this.timeOutLbl.node.parent.opacity = 255;
            }
        }
    }

    /**菜单按钮点击事件 */
    onBtnMenuClick(event) {

    }
    /**继续按钮点击事件 */
    onBtnContinueClick(event) {
        UTBNNScene_hy.ins.playClick();

        this.resetScene();
        UTBNNScene_hy.ins.waitbattle();

        if (UTBNNScene_hy.ins.fromeDisconnect) {
            MTBNNModel_hy.ins.reconnectRequest();
            UTBNNScene_hy.ins.fromeDisconnect = false;
        }
        else {
            MTBNNModel_hy.ins.requestMatch();
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
        // this.btn_continue.node.active = b;
        this.node.stopAllActions();
        this.waitNode.active = b;

        // if (this.btn_continue.node.active) {
        //     this.onDjsEvent(0);
        // }
    }

    /**设置局数或者时间 */
    setRoundOrTime(data: any) {
        if (!data.roomInfo) return;
        let roomInfo = data.roomInfo;
        if (MTBNNModel_hy.ins.roomType == 1) {
            let roundNow = roomInfo.currentRound < 0 ? 0 : roomInfo.currentRound;
            this.roundTimeLab.string = '第' + roundNow + '/' + roomInfo.allRound + '局';
        } else if (MTBNNModel_hy.ins.roomType == 2) {
            this._roomLeftSeconds = roomInfo.leftSeconds;
            let second = roomInfo.leftSeconds;
            second = roomInfo.leftSeconds < 0 ? roomInfo.allSeconds : roomInfo.leftSeconds;
            second = !MTBNNModel_hy.ins.isHostAgain ? 0 : second;
            this.setRounTimeLabel(second);
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
        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_RESET_SCENE);
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
                            // MTBNNModel_hy.ins.sendCallBanker(0); //时间到发送不抢 //服务器会有操作
                            // cc.log("mainnode_ondjsevent qqqqqqqqqqqqqqq");
                            var data = {
                                b: false
                            }
                            MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_OPEN_QIANGZHUANG, data);

                        }
                    }
                    break;
                case "xz":
                    {
                        // this._djsCallBack = () => {
                        //     MTBNNModel_hy.ins.sendAddScore(0); //时间到发送下注1倍 //服务器会有操作
                        //     cc.log("mainnode_ondjsevent xxxxxxxxxxxx");
                        //     var data ={
                        //         b:false
                        //     }
                        //     MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_OPEN_XIAZHU,data);

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
                UTBNNScene_hy.ins.getMusic.playTimeOut();
                // this.unscheduleAllCallbacks();
            }

            this._djsImg.fillRange = this._clockTime / this._clockTimeTotal;

            let leave_time = Math.ceil(this._clockTime);//.floor

            let str_time = leave_time.toString();
            // if (leave_time < 10) {
            //     str_time = '0' + leave_time;
            // }
            if (this._progressTimerFont != null) {
                this._progressTimerFont.string = str_time;
            }
        }

        //房间时间倒计时
        if (this._roomLeftSeconds > 0) {
            this._roomLeftSeconds -= dt;
            if (this._roomLeftSeconds < 0) {
                this._roomLeftSeconds = 0;
            }
            let second = Math.ceil(this._roomLeftSeconds);
            second = !MTBNNModel_hy.ins.isHostAgain ? 0 : second;
            if (MTBNNModel_hy.ins.roomInfoHy) {
                this.setRounTimeLabel(second);
                MTBNNModel_hy.ins.roomInfoHy.leftSeconds = second;
            }
        }

        //超时时间倒计时
        if (this._timeOutSeconds > 0) {
            this._timeOutSeconds -= dt;
            if (this._timeOutSeconds < 0) {
                this._timeOutSeconds = 0;
            }
            let second = Math.ceil(this._timeOutSeconds);
            this.setTimeOutTime(second);
        }
    }

    /**设置牌局剩余时间label */
    setRounTimeLabel(second: number) {
        let roomInfoHy = MTBNNModel_hy.ins.roomInfoHy;
        let floorScore = ((roomInfoHy && roomInfoHy.floorScore) || 100) / 100;
        this.roundTimeLab.string = '牌局剩余时间' + UDateHelper.secondsToTime(second) + '  底分:' + floorScore;
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
        MTBNNModel_hy.ins.sendNextExit(e.isChecked);
    }

}
