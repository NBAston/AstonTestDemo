import Model from "../../common/base/Model";
import UHandler from "../../common/utility/UHandler";
import { EGameType, ELevelType, ECommonUI, ELeftType } from "../../common/base/UAllenum";
import UMsgCenter from "../../common/net/UMsgCenter";
import { Game, SanGong, GameServer } from "../../common/cmd/proto";
import { RoomPlayerInfo, RoomInfo } from "../../public/hall/URoomClass";
import AppGame from "../../public/base/AppGame";
import MBaseGameModel from "../../public/hall/MBaseGameModel";
import USGHelper, { ESGState, SGBattlePlayerInfo, ESGBattlePlayerPaiState, UISGUpdateTurnTime, UISGOverTurn, UISGNextTurn, UISGUpdateSeatRoleInfo, UISGLookPai, UISGPoker, UISGBattleOver, UISGStaticsItem } from "./USGHelper";
import UDebug from "../../common/utility/UDebug";
import cfg_paixing from "../../config/cfg_paixing";
import UPokerHelper from "../../common/utility/UPokerHelper";
import ULanHelper from "../../common/utility/ULanHelper";

/**三公游戏 自己的座位 */
export const SG_SELF_SEAT = 0;


/**
 * 创建:dz
 * 作用:sg 主要逻辑
 */

export default class MSGModel extends Model {

    /**返回大厅 */
    private _retrunLobby: boolean = false;
    /**重连在房间内,但服务器上的房间已结束 */
    private _reconnectInRoomWithNoGame: boolean = false;
    /**是否看过防以小博大提示 */
    isseen_fyxbd: boolean = false;
    private _gameStatus: number;
    static SG_GAMESTATUS = {
        /**空闲状态/结算 */
        FREE: 0,
        /**匹配状态 */
        MATCH: 1,
        /**抢庄 */
        CALL: 2,
        /**下注 */
        SCORE: 3,
        /**发牌 */
        SEND: 4,
        /**开牌 */
        OPEN: 5
    }
    static s_ins: MSGModel;
    static get ins(): MSGModel {

        if (MSGModel.s_ins == null) {
            MSGModel.s_ins = new MSGModel();
            MSGModel.s_ins.init();
        }
        return MSGModel.s_ins;
    }
    setStateMatch() {
        this.state = ESGState.Match;
    }

    /**
     * 注册三公事件
     */
    sgRegesterMsg() {
        this.regesterMsg(SanGong.SUBID.SC_GAMESCENE_FREE, new UHandler(this.onGameSceneFree, this));
        this.regesterMsg(SanGong.SUBID.SC_GAMESCENE_CALL, new UHandler(this.onGameSceneCall, this));
        this.regesterMsg(SanGong.SUBID.SC_GAMESCENE_SCORE, new UHandler(this.onGameSceneScore, this));
        this.regesterMsg(SanGong.SUBID.SC_GAMESCENE_OPEN, new UHandler(this.onGameSceneOpen, this));
        this.regesterMsg(SanGong.SUBID.SC_GAMESCENE_END, new UHandler(this.onGameSceneEnd, this));

        this.regesterMsg(SanGong.SUBID.NN_SUB_S_GAME_START, new UHandler(this.onGameStart, this));
        this.regesterMsg(SanGong.SUBID.NN_SUB_S_CALL_BANKER, new UHandler(this.onCallBanker, this));
        this.regesterMsg(SanGong.SUBID.NN_SUB_S_CALL_BANKER_RESULT, new UHandler(this.onCallBankerResult, this));
        this.regesterMsg(SanGong.SUBID.NN_SUB_S_ADD_SCORE_RESULT, new UHandler(this.onAddScoreResult, this));
        this.regesterMsg(SanGong.SUBID.NN_SUB_S_SEND_CARD, new UHandler(this.onSendCard, this));
        this.regesterMsg(SanGong.SUBID.NN_SUB_S_OPEN_CARD_RESULT, new UHandler(this.onOpenCardResult, this));
        this.regesterMsg(SanGong.SUBID.NN_SUB_S_GAME_END, new UHandler(this.onGameEnd, this));

        this.regesterMsg(SanGong.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT, new UHandler(this.onEndExiitResult, this));


        //玩家进房消息
        // UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER, GameServer.SUBID.SUB_S2C_USER_ENTER_NOTIFY,
        //     new UHandler(this.onUserEnterNotify, this));
    }


    /**注册sg网络消息事件 */
    regesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.regester(EGameType.SG,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    }

    unregesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.unregester(EGameType.SG,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    }

    /** 发送网络消息*/
    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(EGameType.SG,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId, data, handler, unlock);
    }

    private getMyOwnScore(cbCardData: number[], index: number = 5): number[][] {
        //分割倍数  因为是25个数字
        var cbCardDataTemp = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];

        for (let l = 0; l < cbCardData.length; l++) {
            const element = cbCardData[l];

            if (l < index) {
                cbCardDataTemp[0][l] = element;
            }
            else if (l >= index && l < index * 2) {
                cbCardDataTemp[1][l - index] = element;
            }
            else if (l >= index * 2 && l < index * 3) {
                cbCardDataTemp[2][l - index * 2] = element;
            }
            else if (l >= index * 3 && l < index * 4) {
                cbCardDataTemp[3][l - index * 3] = element;
            }
            else if (l >= index * 4 && l < index * 5) {
                cbCardDataTemp[4][l - index * 4] = element;
            }
        }
        // UDebug.log("cbCardDataTemp:" + JSON.stringify(cbCardDataTemp));
        return cbCardDataTemp;
    }

    /**
    * updateSeatInfo
    * 更新座位玩家信息
    */
    public updateSeatInfo() {
        // let ar = {};
        // for (const key in this._battleplayer) {
        //     if (this._battleplayer.hasOwnProperty(key)) {
        //         const element = this._battleplayer[key];
        //         element.seatId = this.getUISeatId(element.chairId);

        //         ar[element.seatId] = element;
        //     }
        // }
        // UDebug.log("玩家进入。。。。。。。。。。。。。", JSON.stringify(ar));
        this.emit(USGHelper.SG_SELF_EVENT.SG_CC_UPDATA_SEAT_INFO, this._battleplayer);

    }

    /*********** hall event ***************/
    private onUserEnterNotify(data: any) {
        let player = new RoomPlayerInfo();
        player.account = data.account || "";
        player.chairId = data.chairId || 0;
        player.headId = data.headIndex || 0;
        player.location = data.location || "";
        player.nickName = data.userId || "";
        player.score = data.score || 0;
        player.tableId = data.tableId || 0;
        player.userId = data.userId || 0;
        player.userStatus = data.userStatus || 0;

        // this._roomPlayers[player.chairId] = player;
        // this.emit(SG_UPDATE_PLAYERS_EVENT, this._roomPlayers);
    }

    /** scene event */

    /**
     * 设置所有场景内玩家状态
     * @param gameStatus MSGModel.SG_GAMESTATUS状态
     * @param state ESGState状态
     * @param cbPlayStatus 各玩家状态
     * @returns 房间内玩家状态 是否上座
     */
    private setAllSceneStatus(gameStatus: number, state: ESGState, cbPlayStatus?: boolean[]): any {

        var playerStatus = {};
        //赋值房间内玩家状态
        if (cbPlayStatus != null) {
            let len = cbPlayStatus.length;
            for (let i = 0; i < len; i++) {
                let status = cbPlayStatus[i];
                let pl = this.getbattleplayerbyChairId(i);
                let localPos = this.getUISeatId(i);
                if (pl) {
                    pl.playStatus = status ? 1 : 0;
                    playerStatus[localPos] = status;
                }
            }
        }
        //默认赋状态 旁观 自由人
        this.state = state//ESGState.Wait;
        this._gameStatus = MSGModel.SG_GAMESTATUS.FREE;
        //如果是上座玩牌玩家，重新赋状态
        if (this._battleplayer[this.selfUserId] != null
            && this._battleplayer[this.selfUserId].playStatus == 1) {
            this.state = state;//ESGState.Gameing;
            this._gameStatus = gameStatus;//MSGModel.SG_GAMESTATUS.CALL;
        }

        return playerStatus;
    }

    onGameSceneFree(data: SanGong.NN_MSG_GS_FREE) {
        UDebug.Log("onGameSceneFree" + JSON.stringify(data));
        this._currentDizhu = data.cellScore || 1;
        if (this.state != ESGState.Match) {
            this.state = ESGState.Wait;
        }

        this._gameStatus = MSGModel.SG_GAMESTATUS.FREE;
        var ishideContinue = false;
        if (this.state == ESGState.Match) {
            ishideContinue = true;
        }

        //玩家信息更新
        this.updateSeatInfo();
        this.emit(USGHelper.SG_EVENT.SG_GAMESCENE_FREE, data);
        let d = {
            bExit: data.bRoundEndExit
        }
        this.emit(USGHelper.SG_SELF_EVENT.QZNN_NEXT_EXIT, d);
    }

    onGameSceneCall(data: SanGong.NN_MSG_GS_CALL) {
        UDebug.Log("onGameSceneCall" + JSON.stringify(data));

        this.state = ESGState.Gameing
        this.updateSeatInfo();
        var dCellScore = data.cellScore; //底注
        var cbTimeLeave = data.timeLeave;  //剩于时间
        var sCallBanker = data.callBanker;//叫庄标志(-1:未叫; 0:不叫; 1:叫庄) []

        var cbPlayStatus = data.playStatus;//游戏中玩家(1打牌玩家) []
        this._currentDizhu = data.cellScore || 1;
        var roomId = data.roundId || 0;//牌局编号        



        var playersStatus = this.setAllSceneStatus(MSGModel.SG_GAMESTATUS.CALL, ESGState.Gameing, cbPlayStatus);

        var call_banker_temp = new Array();
        //叫庄
        if (sCallBanker != null) {
            for (let i = 0; i < sCallBanker.length; i++) {
                if (sCallBanker[i] >= 0) {
                    let pl = this.getUISeatId(i);

                    let dt1 = {
                        localPos: pl,
                        callMultiple: sCallBanker[i]
                    }
                    call_banker_temp.push(dt1);
                }
            }
        }

        var data1 = {
            call_banker: call_banker_temp,
            playerStatus: playersStatus,
            dt: data
        }
        this.emit(USGHelper.SG_EVENT.SG_GAMESCENE_CALL, data1);
        this.emit(USGHelper.SG_SELF_EVENT.SG_UPDATE_ROOMID, roomId);
        let d = {
            bExit: data.bRoundEndExit
        }
        this.emit(USGHelper.SG_SELF_EVENT.QZNN_NEXT_EXIT, d);
    }

    onGameSceneScore(data: SanGong.NN_MSG_GS_SCORE) {
        UDebug.Log("onGameSceneScore" + JSON.stringify(data));

        this.state = ESGState.Gameing
        this.updateSeatInfo();
        var dCellScore = data.cellScore;
        var cbTimeLeave = data.timeLeave;

        var wBankerUser = data.bankerUser;//庄家用户
        var cbUserCurJetton = data.userJettonMultiple;//闲家下注倍数(0表示还没有下注) []
        var cbUserMaxJetton = data.jettonMultiple;//闲家最大下注倍数[]

        var cbPlayStatus = data.playStatus;//游戏中玩家(1打牌玩家) []
        this._currentDizhu = data.cellScore || 1;
        var roomId = data.roundId || 0;//牌局编号        

        //玩家信息更新
        // let ar = {};


        // for (const key in this._battleplayer) {
        //     if (this._battleplayer.hasOwnProperty(key)) {
        //         const element = this._battleplayer[key];
        //         element.seatId = this.getUISeatId(element.chairId);

        //         ar[element.seatId] = element;

        //     }
        // }
        var playersStatus = this.setAllSceneStatus(MSGModel.SG_GAMESTATUS.SCORE, ESGState.Gameing, cbPlayStatus);


        var bankerLocalPos = this.getUISeatId(wBankerUser);

        //叫庄
        var call_banker_temp = {};
        if (wBankerUser != null) {
            let pl = bankerLocalPos;
            let dt1 = {
                localPos: pl,
                cbCallMultiple: 1
            }
            call_banker_temp = dt1;
        }
        //叫庄结果
        var call_banker_result_temp = {
            beidatas: [],
            cbCallBankerUser: [bankerLocalPos],
            dwBankerUser: bankerLocalPos
        };
        if (cbUserMaxJetton != null) {

            // var temp = this.getMyOwnScore(cbUserMaxJetton, 5);
            // if (this.selfRealSeatId != null && temp != null && temp[this.selfRealSeatId] != null) {
            //     var selfJetton = temp[this.selfRealSeatId];
            //     for (let i = 0; i < selfJetton.length; i++) {
            //         const element = selfJetton[i];
            //         if (element != null && element != 0) {
            //             call_banker_result_temp.beidatas.push(element);
            //         }
            //     }
            // }

            call_banker_result_temp.beidatas = cbUserMaxJetton;

        }
        call_banker_result_temp.beidatas.sort((a, b) => {
            let pa = a;
            let pb = b;
            if (pa > pb)
                return 1;
            else if (pa < pb)
                return -1;
            else {
                return 0;
            }
        });


        this._bankerindex = wBankerUser;

        //下注
        var xia_zhu_temp = new Array();
        if (cbUserCurJetton != null) {
            for (let j = 0; j < cbUserCurJetton.length; j++) {
                const element = cbUserCurJetton[j];

                if (element > 0) {
                    let pl = this.getUISeatId(j);
                    let temp = {
                        localPos: pl,
                        cbJettonMultiple: element
                    }
                    xia_zhu_temp.push(temp);

                    if (pl == 0)//自己已下注 不显示下注按钮
                    {
                        call_banker_result_temp.beidatas = [];
                    }
                }
            }
        }

        var data1 = {
            dt: data,
            playerStatus: playersStatus,
            call_banker: call_banker_temp,
            call_banker_result: call_banker_result_temp,
            xia_zhu: xia_zhu_temp
        }

        this.emit(USGHelper.SG_EVENT.SG_GAMESCENE_SCORE, data1);
        this.emit(USGHelper.SG_SELF_EVENT.SG_UPDATE_ROOMID, roomId);
        let d = {
            bExit: data.bRoundEndExit
        }
        this.emit(USGHelper.SG_SELF_EVENT.QZNN_NEXT_EXIT, d);
    }

    onGameSceneOpen(data: any) {

        UDebug.Log("onGameSceneOpen" + JSON.stringify(data));
        var dCellScore = data.cellScore;
        var cbTimeLeave = data.timeLeave;
        this.state = ESGState.Gameing
        this.updateSeatInfo();
        var wBankerUser = data.bankerUser;//庄家用户
        var cbIsOpenCard = data.isOpenCard;//是否开牌[]
        var cbCardType = data.cardType;//牌型[]
        var cbCardData = data.cardData;//牌数据[]
        var cbUserJettonMultiple = data.userJettonMultiple;//闲家下注倍数[]

        var cbPlayStatus = data.playStatus;//游戏中玩家(1打牌玩家)[]
        this._currentDizhu = data.cellScore || 1;
        var roomId = data.roundId || 0;//牌局编号        


        var playersStatus = this.setAllSceneStatus(MSGModel.SG_GAMESTATUS.OPEN, ESGState.Gameing, cbPlayStatus);

        var bankerLocalPos = this.getUISeatId(wBankerUser);
        //叫庄
        var call_banker_temp = {};
        if (wBankerUser != null) {
            let pl = bankerLocalPos;
            let dt1 = {
                localPos: pl,
                cbCallMultiple: 1
            }
            call_banker_temp = dt1;
        }
        //叫庄结果
        var call_banker_result_temp = {
            beidatas: [],
            cbCallBankerUser: [bankerLocalPos],
            dwBankerUser: bankerLocalPos
        };
        this._bankerindex = wBankerUser;


        //下注
        var xia_zhu_temp = new Array();
        if (cbUserJettonMultiple != null) {
            for (let j = 0; j < cbUserJettonMultiple.length; j++) {
                const element = cbUserJettonMultiple[j];

                if (element > 0) {
                    let pl = this.getUISeatId(j);
                    let temp = {
                        localPos: pl,
                        cbJettonMultiple: element
                    }
                    xia_zhu_temp.push(temp);
                }
            }
        }
        //发牌
        var issee = false;
        var fapai = {
            isSee: issee
        };

        //开牌
        var look_pai_temp = new Array();
        //分割cbCardData  因为是12个数字
        var cbCardDataTemp = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];

        for (let l = 0; l < cbCardData.length; l++) {
            const element = cbCardData[l];

            if (l < 3) {
                cbCardDataTemp[0][l] = element;
            }
            else if (l >= 3 && l < 6) {
                cbCardDataTemp[1][l - 3] = element;
            }
            else if (l >= 6 && l < 9) {
                cbCardDataTemp[2][l - 6] = element;
            }
            else if (l >= 9 && l < 12) {
                cbCardDataTemp[3][l - 9] = element;
            }
            else if (l >= 12 && l < 15) {
                cbCardDataTemp[4][l - 12] = element;
            }
        }

        if (cbIsOpenCard != null) {
            for (let i = 0; i < cbIsOpenCard.length; i++) {
                const element = cbIsOpenCard[i];
                let localPos = this.getUISeatId(i);
                let player: any = this.getbattleplayerbyChairId(i)
                if (player == null) continue
                let userId = player.userId;
                let pl = this._battleplayer[userId];
                if (pl != null) {
                    if (element == true) {
                        pl.paiState = ESGBattlePlayerPaiState.kanPai;
                        pl.pai = cbCardDataTemp[i];
                        pl.paiXing = cbCardType[i];
                        if (pl.pai == null) {
                            UDebug.Log("没牌数据 cbCardData cbSGCardData 都没");
                        }
                        let lookpai = new UISGLookPai();
                        lookpai.seatId = localPos;
                        lookpai.poker = new UISGPoker();
                        lookpai.poker.cardtype = cbCardType[i];
                        lookpai.poker.pokerType = USGHelper.GAME_TYPE[cbCardType[i]];
                        lookpai.poker.pokerIcons = [];
                        pl.pai.forEach(element => {
                            lookpai.poker.pokerIcons.push(UPokerHelper.getCardSpriteName(element));
                        });
                        look_pai_temp.push(lookpai);
                        if (localPos == this._selfUISeatId) {//自己已开牌,不显示 开牌按钮
                            issee = true
                            fapai.isSee = true;
                        }
                    } else if (pl.playStatus == 1) {
                        pl.paiState = ESGBattlePlayerPaiState.mengPai;
                    }
                }

            }
        }

        var data1 = {
            dt: data,
            playerStatus: playersStatus,
            call_banker: call_banker_temp,
            call_banker_result: call_banker_result_temp,
            xia_zhu: xia_zhu_temp,
            ts_fapai: fapai,
            look_pai: look_pai_temp//[]
        }



        this.emit(USGHelper.SG_EVENT.SG_GAMESCENE_OPEN, data1);
        this.emit(USGHelper.SG_SELF_EVENT.SG_UPDATE_ROOMID, roomId);
        let d = {
            bExit: data.bRoundEndExit
        }
        this.emit(USGHelper.SG_SELF_EVENT.QZNN_NEXT_EXIT, d);

    }

    /** game event */

    /**游戏开始 */
    onGameStart(data: SanGong.NN_CMD_S_GameStart) {
        this._reconnectInRoomWithNoGame = false;

        var cbPlayStatus = data.playStatus;//[]
        var cbCallBankerTime = data.callBankerTime;
        // UDebug.log("onGameStart:" + JSON.stringify(data));
        var roomId = data.roundId || 0;//牌局编号        

        //游戏状态更新
        this.state = ESGState.Gameing;


        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                const element = this._battleplayer[key];
                element.seatId = this.getUISeatId(element.chairId);
                element.paiState = ESGBattlePlayerPaiState.mengPai;
                element.playStatus = 1
                element.pai = []
            }
        }

        this.emit(USGHelper.SG_SELF_EVENT.SG_CC_UPDATA_SEAT_INFO, this._battleplayer);

        var playerStatus = {};

        //设置玩家状态
        let len = cbPlayStatus.length;
        for (let i = 0; i < len; i++) {

            let status = cbPlayStatus[i];
            // if(status !=)

            let pl = this.getbattleplayerbyChairId(i);
            let localPos = this.getUISeatId(i);

            if (pl) {
                pl.playStatus = status ? 1 : 0;
                playerStatus[localPos] = status;
                pl.userStatus = status ? 5 : pl.userStatus;
            }
        }

        //设置开始
        this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_GAME_START, data);
        this.emit(USGHelper.SG_SELF_EVENT.SG_UPDATE_ROOMID, roomId);

        //倒计时 时间 叫庄
        if (cbCallBankerTime != null)
            this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_UPDATE_TURN_TIME, cbCallBankerTime - 2, true);

        let users = data.users;
        for (let index = 0; index < users.length; index++) {
            const element = users[index];
            if (element.userId == AppGame.ins.roleModel.useId) {
                this.update_player_scoreinfo(AppGame.ins.roleModel.useId, element.score, 0);
            }
        }
    }

    /**叫庄 */
    onCallBanker(data: SanGong.NN_CMD_S_CallBanker) {
        var wCallBankerUser = data.callBankerUser;
        var cbCallMultiple1 = data.callMultiple;
        // UDebug.log("onCallBanker:" + data);

        var pl = this.getUISeatId(wCallBankerUser);

        var data1 = {
            localPos: pl,
            callMultiple: cbCallMultiple1
        }
        //设置谁选庄的结果
        this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_CALL_BANKER, data1);
    }
    /**总叫庄结果 */
    onCallBankerResult(data: SanGong.NN_CMD_S_CallBankerResult) {
        var dwBankerUser = data.bankerUser;
        var cbCallBankerUser1 = data.callBankerUser;//[] 选庄动画用
        var cbAddJettonTime = data.addJettonTime;
        var lMaxJettonMultiple = data.jettonMultiple;//[]
        // UDebug.log("onCallBankerResult:" + data);

        //多个就随机选庄
        this._bankerindex = dwBankerUser;//确定的庄

        var data1 = {
            beidatas: [],
            cbCallBankerUser: [],
            dwBankerUser: this.getUISeatId(dwBankerUser)
        };

        //转换成本地位置索引
        if (cbCallBankerUser1 != null) {
            for (let i = 0; i < cbCallBankerUser1.length; i++) {
                const element = cbCallBankerUser1[i];
                if (element >= 0) {
                    var localPos = this.getUISeatId(element);
                    data1.cbCallBankerUser.push(localPos);
                }
            }
        }

        if (data1.cbCallBankerUser[0] == data1.cbCallBankerUser[1]) {
            data1.cbCallBankerUser = []
        }


        if (lMaxJettonMultiple != null) {


            // var temp = this.getMyOwnScore(lMaxJettonMultiple, 5);
            // if (this.selfRealSeatId != null && temp != null && temp[this.selfRealSeatId] != null) {
            //     var selfJetton = temp[this.selfRealSeatId];
            //     for (let i = 0; i < selfJetton.length; i++) {
            //         const element = selfJetton[i];
            //         if (element != null && element != 0) {
            //             data1.beidatas.push(element);
            //         }
            //     }
            // }
            data1.beidatas = lMaxJettonMultiple;

        }

        data1.beidatas.sort((a, b) => {
            let pa = Math.abs(a);
            let pb = Math.abs(b);
            if (pa > pb)
                return 1;
            else if (pa < pb)
                return -1;
            else {
                return 0;
            }
        });

        this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TZ_CALL_BANKER_RESULT, data1);

        //倒计时 时间 下注
        if (cbAddJettonTime != null && cbAddJettonTime > 0) {
            this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_UPDATE_TURN_TIME, cbAddJettonTime);
        } else {
            this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_UPDATE_TURN_TIME, cbAddJettonTime, true);
        }

    }
    /**下注结果 */
    onAddScoreResult(data: SanGong.NN_CMD_S_AddScoreResult) {
        var wAddJettonUser = data.addJettonUser;
        var cbJettonMultiple1 = data.jettonMultiple;

        // UDebug.log("onAddScoreResult:" + data);


        var pl = this.getUISeatId(wAddJettonUser);

        var data1 = {
            localPos: pl,
            cbJettonMultiple: cbJettonMultiple1
        }
        //设置谁选庄的结果
        this.emit(USGHelper.SG_SELF_EVENT.SG_SC_CZ_PUT_OUT_CHIP, data1);

    }
    /**发牌 */
    onSendCard(data: SanGong.NN_CMD_S_SendCard) {
        var cbSendCard = data.sendCard;//[]
        // var cbSGCard = data.cbSGCard;//[]
        var cbCardType = data.cardType;
        var cbOpenTime = data.openTime;

        // UDebug.log("onSendCard:" + data);

        //发牌
        if (cbSendCard != null)
            this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_FAPAI, data);

        //倒计时 时间 开牌
        if (cbOpenTime != null)
            this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_UPDATE_TURN_TIME, cbOpenTime);
    }
    /**开牌结果 */
    onOpenCardResult(data: SanGong.NN_CMD_S_OpenCardResult) {
        var wOpenCardUser = data.openCardUser;
        var cbCardType = data.cardType;
        var cbCardData = data.cardData;//[]
        var cbSGCardData = data.cardData;//[]


        // UDebug.log("onOpenCardResult:" + data);

        let localPos = this.getUISeatId(wOpenCardUser);
        let player: any = this.getbattleplayerbyChairId(wOpenCardUser)
        if (player == null) return
        let userId = player.userId;
        let pl = this._battleplayer[userId];
        if (pl != null) {

            pl.paiState = ESGBattlePlayerPaiState.kanPai;

            if (cbCardData != null) {
                pl.pai = cbCardData;
            }
            else {
                pl.pai = cbSGCardData;
            }

            pl.paiXing = cbCardType;


            if (pl.pai == null) {
                UDebug.Log("没牌数据 cbCardData cbSGCardData 都没");
            }

            let lookpai = new UISGLookPai();

            // UDebug.Log("pl.seatId" + pl.seatId);
            // UDebug.Log("localPos" + localPos);

            lookpai.seatId = localPos;
            lookpai.poker = new UISGPoker();
            lookpai.poker.cardtype = cbCardType;
            lookpai.poker.pokerType = USGHelper.GAME_TYPE[cbCardType];//cfg_paixing[cbCardType];
            lookpai.poker.pokerIcons = [];
            pl.pai.forEach(element => {
                lookpai.poker.pokerIcons.push(UPokerHelper.getCardSpriteName(element));
            });
            this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_LOOK_PAI, lookpai);

        }
        // if (caller.wCurrentUser == wOpenCardUser) {
        //     let data = new UISGUpdateTurnTime();
        //     data.leftTime = caller.cbTimeLeft;
        //     data.seatId = pl.seatId;
        //     this.emit(MSG.SC_TS_UPDATA_TURN_TIME, pl.seatId, caller.cbTimeLeft);
        // }
    }
    /**结果 */
    onGameEnd(data: SanGong.INN_CMD_S_GameEnd, isSend: boolean = true): UISGBattleOver {
        var dLWScore = data.LWScore;//[]
        var dTotalScore = data.totalScore;//[]
        var cbEndType = data.endType;
        var cbOperate = data.operate;//[] not use

        // UDebug.log("onGameEnd:" + data);


        let data1 = new UISGBattleOver();
        data1.statics = [];
        data1.endTime = data.endTime;
        data1.endType = cbEndType;

        for (let i = 0; i < dLWScore.length; i++) {
            let dlw = dLWScore[i];
            let dtotal = dTotalScore[i];

            let localPos = this.getUISeatId(i);

            if (dlw != null && dtotal != null && localPos != null) {
                //let userId = this.uiposToUserId[localPos];
                let player = this.getbattleplayerbyChairId(i)
                if (player == null) continue
                let userId = player.userId;
                var pbr = this._battleplayer[userId];
                let item = new UISGStaticsItem();

                if (pbr) {
                    pbr.score += dlw;
                    //pbr.paiState = ESGBattlePlayerPaiState.none
                    item.getScore = dlw;
                    item.lastscore = dtotal;
                    item.seatId = localPos;
                    if (dlw >= 0) {
                        item.iswin = true;
                    }
                    else {
                        item.iswin = false;
                    }
                    this.update_player_scoreinfo(userId, dlw, dtotal);
                }

                data1.statics[localPos] = (item);

            }

        }
        if (isSend) {
            this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_GAME_END, data1);
            this.state = ESGState.Wait;
        } else {
            return data1
        };
        // this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_UPDATE_TURN_TIME, 1);



    }


    onEndExiitResult(data: SanGong.NN_CMD_C_RoundEndExitResult) {
        // UDebug.log(data);
        this.emit(USGHelper.SG_SELF_EVENT.QZNN_NEXT_EXIT, data);

    }

    /*********** c2s ***************/

    /**
     * 请求叫庄
     * @param callFlag 
     */
    sendCallBanker(callFlag: number) {
        var data = {
            callFlag: callFlag
        }
        this.sendMsg(SanGong.SUBID.NN_SUB_C_CALL_BANKER, data);
    }

    /**
     * 请求下注
     * @param jetton 
     */
    sendAddScore(jettonIndex: number) {
        var data = {
            jettonIndex: jettonIndex
        }
        this.sendMsg(SanGong.SUBID.NN_SUB_C_ADD_SCORE, data);
    }
    /**请求开牌 */
    sendOpenCard() {
        console.log("3公请求开牌")
        this.sendMsg(SanGong.SUBID.NN_SUB_C_OPEN_CARD, {});
    }

    sendNextExit(b: boolean) {
        var data = {
            bExit: b,
        }
        this.sendMsg(SanGong.SUBID.NN_SUB_C_ROUND_END_EXIT, data);
    }

    //#region 
    /**
     * 游戏状态
     */
    public _state: ESGState = ESGState.Wait;
    /**本局的玩家 */
    public _battleplayer: { [key: number]: SGBattlePlayerInfo };
    private _selfUISeatId: number = SG_SELF_SEAT;//0
    // private _userId: number;
    /**本局下的总注 */
    private _totalChip: number;
    /**一局总过的轮数 */
    private _totalTurn: number = 16;
    /**当前的论数 */
    private _currentTurn: number;
    /**当前底注 */
    private _currentDizhu: number;
    /**
     * 房间信息
     */
    private _roomInfo: RoomInfo;
    /**
     * 玩家自己的userid
     */
    protected get selfUserId(): number {
        return AppGame.ins.roleModel.useId;
    }
    /**本局下的总注 */
    get totalChip(): number {
        return this._totalChip;
    }
    /**总共的论数 */
    get totalTurn(): number {
        return this._totalTurn;
    }
    /**当前的论数*/
    get currentTurn(): number {
        return this._currentTurn;
    }
    /**自己的真实位置 */
    get selfRealSeatId(): number {
        let role = AppGame.ins.gamebaseModel.getRoomPlayerInfo(this.selfUserId);
        if (role)
            return role.chairId;
        return 0;
    }

    get selfbettleInfo(): any {
        return this._battleplayer[AppGame.ins.roleModel.useId];
    }

    /**
     * 游戏状态
     */
    get state(): ESGState {
        return this._state;
    }
    set state(state) {
        if (state == ESGState.Wait) {
            cc.log("aaaaaaaaaaaaaaaaaaa");
        };
        this._state = state;
    }

    /**当前的底注 */
    get currentDizhu(): number {
        return this._currentDizhu;
    }

    /**本局庄家 服务器位置索引 */
    private _bankerindex: number = 0;
    /**本局庄家 服务器位置索引 */
    get bankerChairId(): number {
        return this._bankerindex;
    }
    set bankerChairId(index: number) {
        this._bankerindex = index;
    }



    /**本局庄家 本地位置索引 */
    getLocalBankerIndex(): number {
        return this.getUISeatId(this._bankerindex);
    }

    /**设置状态 */
    setReconnectState(state: ESGState, isRestRoominfo?: boolean, isBack: boolean = false) {
        this.state = state;

        if (isRestRoominfo) {
            // this._roomInfo = null;
            this._reconnectInRoomWithNoGame = true;
            if (!isBack) {
                this._battleplayer = {};
            };

        }
    }

    resetData(): void {

    }
    /**逻辑运行 */
    update(dt: number): void {

    }
    run(): void {

        super.run();
        this._retrunLobby = false;
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);

        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.user_status_notify, this);
    }
    exit(): void {
        super.exit();
        this.resetData();
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);

        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.user_status_notify, this);

        this.unregesterMsg(SanGong.SUBID.SC_GAMESCENE_FREE, new UHandler(this.onGameSceneFree, this));
        this.unregesterMsg(SanGong.SUBID.SC_GAMESCENE_CALL, new UHandler(this.onGameSceneCall, this));
        this.unregesterMsg(SanGong.SUBID.SC_GAMESCENE_SCORE, new UHandler(this.onGameSceneScore, this));
        this.unregesterMsg(SanGong.SUBID.SC_GAMESCENE_OPEN, new UHandler(this.onGameSceneOpen, this));
        this.unregesterMsg(SanGong.SUBID.SC_GAMESCENE_END, new UHandler(this.onGameSceneEnd, this));

        this.unregesterMsg(SanGong.SUBID.NN_SUB_S_GAME_START, new UHandler(this.onGameStart, this));
        this.unregesterMsg(SanGong.SUBID.NN_SUB_S_CALL_BANKER, new UHandler(this.onCallBanker, this));
        this.unregesterMsg(SanGong.SUBID.NN_SUB_S_CALL_BANKER_RESULT, new UHandler(this.onCallBankerResult, this));
        this.unregesterMsg(SanGong.SUBID.NN_SUB_S_ADD_SCORE_RESULT, new UHandler(this.onAddScoreResult, this));
        this.unregesterMsg(SanGong.SUBID.NN_SUB_S_SEND_CARD, new UHandler(this.onSendCard, this));
        this.unregesterMsg(SanGong.SUBID.NN_SUB_S_OPEN_CARD_RESULT, new UHandler(this.onOpenCardResult, this));
        this.unregesterMsg(SanGong.SUBID.NN_SUB_S_GAME_END, new UHandler(this.onGameEnd, this));

        this.unregesterMsg(SanGong.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT, new UHandler(this.onEndExiitResult, this));
        this._roomInfo = null;
        this._battleplayer = null;
    }

    //#region  model 实现
    init(): void {
        this.sgRegesterMsg();
        this._battleplayer = {};
    }




    private onGameSceneEnd(data: SanGong.NN_MSG_GS_END) {

        this.state = ESGState.Match;
        this.updateSeatInfo();
        var wBankerUser = data.bankerUser;//庄家用户
        var cbIsOpenCard = data.isOpenCard;//是否开牌[]
        var cbCardType = data.cardType;//牌型[]
        var cbCardData = data.cardData;//牌数据[]
        var cbUserJettonMultiple = data.userJettonMultiple;//闲家下注倍数[]

        var cbPlayStatus = data.playStatus;//游戏中玩家(1打牌玩家)[]
        this._currentDizhu = data.cellScore || 1;
        var roomId = data.roundId || 0;//牌局编号        


        var playersStatus = this.setAllSceneStatus(MSGModel.SG_GAMESTATUS.FREE, ESGState.Gameing, cbPlayStatus);

        var bankerLocalPos = this.getUISeatId(wBankerUser);
        //叫庄
        var call_banker_temp = {};
        if (wBankerUser != null) {
            let pl = bankerLocalPos;
            let dt1 = {
                localPos: pl,
                cbCallMultiple: 1
            }
            call_banker_temp = dt1;
        }
        //叫庄结果
        var call_banker_result_temp = {
            beidatas: [],
            cbCallBankerUser: [bankerLocalPos],
            dwBankerUser: bankerLocalPos
        };
        this._bankerindex = wBankerUser;


        //下注
        var xia_zhu_temp = new Array();
        if (cbUserJettonMultiple != null) {
            for (let j = 0; j < cbUserJettonMultiple.length; j++) {
                const element = cbUserJettonMultiple[j];

                if (element > 0) {
                    let pl = this.getUISeatId(j);
                    let temp = {
                        localPos: pl,
                        cbJettonMultiple: element
                    }
                    xia_zhu_temp.push(temp);
                }
            }
        }
        //发牌
        var issee = false;
        var fapai = {
            isSee: issee
        };

        //开牌
        var look_pai_temp = new Array();
        //分割cbCardData  因为是12个数字
        var cbCardDataTemp = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];

        for (let l = 0; l < cbCardData.length; l++) {
            const element = cbCardData[l];

            if (l < 3) {
                cbCardDataTemp[0][l] = element;
            }
            else if (l >= 3 && l < 6) {
                cbCardDataTemp[1][l - 3] = element;
            }
            else if (l >= 6 && l < 9) {
                cbCardDataTemp[2][l - 6] = element;
            }
            else if (l >= 9 && l < 12) {
                cbCardDataTemp[3][l - 9] = element;
            }
            else if (l >= 12 && l < 15) {
                cbCardDataTemp[4][l - 12] = element;
            }
        }

        if (cbIsOpenCard != null) {
            for (let i = 0; i < cbIsOpenCard.length; i++) {
                const element = cbIsOpenCard[i];
                let localPos = this.getUISeatId(i);
                let player: any = this.getbattleplayerbyChairId(i)
                if (player == null) continue
                let userId = player.userId;
                let pl = this._battleplayer[userId];
                if (pl != null) {
                    if (element == true) {
                        pl.paiState = ESGBattlePlayerPaiState.kanPai;
                        pl.pai = cbCardDataTemp[i];
                        pl.paiXing = cbCardType[i];
                        if (pl.pai == null) {
                            UDebug.Log("没牌数据 cbCardData cbSGCardData 都没");
                        }
                        let lookpai = new UISGLookPai();
                        lookpai.seatId = localPos;
                        lookpai.poker = new UISGPoker();
                        lookpai.poker.cardtype = cbCardType[i];
                        lookpai.poker.pokerType = USGHelper.GAME_TYPE[cbCardType[i]];
                        lookpai.poker.pokerIcons = [];
                        pl.pai.forEach(element => {
                            lookpai.poker.pokerIcons.push(UPokerHelper.getCardSpriteName(element));
                        });
                        look_pai_temp.push(lookpai);
                        if (localPos == this._selfUISeatId) {//自己已开牌,不显示 开牌按钮
                            issee = true
                            fapai.isSee = true;
                        }
                    } else if (pl.playStatus == 1) {
                        pl.paiState = ESGBattlePlayerPaiState.mengPai;
                    }
                }

            }
        }
        let gameEnd = data.gameEnd;
        let gameEndData = this.onGameEnd(gameEnd, false);

        var data1 = {
            dt: data,
            playerStatus: playersStatus,
            call_banker: call_banker_temp,
            call_banker_result: call_banker_result_temp,
            xia_zhu: xia_zhu_temp,
            ts_fapai: fapai,
            look_pai: look_pai_temp,//[]
            gameEndData: gameEndData
        }

        this._currentDizhu = data.cellScore || 1;
        var cbIsOpenCard = data.isOpenCard
        if (cbIsOpenCard) {
            for (let i = 0; i < cbIsOpenCard.length; i++) {
                let player: any = this.getbattleplayerbyChairId(i)
                if (player == null) continue
                let pl = this._battleplayer[player.userId];
                if (pl != null)
                    pl.paiState = ESGBattlePlayerPaiState.none
            }
        }

        this.emit(USGHelper.SG_EVENT.SG_GAMESCENE_END, data1);
        this.emit(USGHelper.SG_SELF_EVENT.SG_UPDATE_ROOMID, roomId);
        let d = {
            bExit: data.bRoundEndExit
        }
        this.emit(USGHelper.SG_SELF_EVENT.QZNN_NEXT_EXIT, d);
    }

    /**玩家进入房间 */
    private sc_ts_room_playerinfo(caller: RoomPlayerInfo): void {
        this.add_battle_player(caller);
        this.updateSeatInfo();

    }

    /**离开房间 */
    private sc_ts_player_left_room(caller: GameServer.MSG_C2S_UserLeftMessageResponse): void {
        if (caller.retCode == 0) {
            if (caller.type == ELeftType.ReturnToRoom) {
                if (this.state != ESGState.AlreadyLeft) {
                    this.state = ESGState.AlreadyLeft;
                    if (this._roomInfo) {
                        AppGame.ins.loadLevel(ELevelType.Hall, this._roomInfo.gameId);
                    }
                    else {
                        AppGame.ins.loadLevel(ELevelType.Hall, EGameType.SG);
                    }
                    this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_LEFT);
                }
            } else if (caller.type == ELeftType.CancleMatch) {
                this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_CANCLE_MATCH, true);
                this.state = ESGState.Wait;
            }
            else if (caller.type == ELeftType.LeftGame) {

                this._battleplayer = {};

                this._currentDizhu = 0;
                // this._totalChip = 0;
                // this._totalTurn = 0;
                this.state = ESGState.Match;

                AppGame.ins.roomModel.requestMatch();
                this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_START_MATCH, true);
            }
        }
        // else if(caller.retCode == 2){
        // } 
        else {
            if (caller.type == ELeftType.ReturnToRoom) {
                this._retrunLobby = false;

                AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
            }
            else if (caller.type == ELeftType.CancleMatch) {
                if (this.state != ESGState.Gameing)
                    this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_CANCLE_MATCH, false);
            } else if (caller.type == ELeftType.LeftGame) {
                this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_START_MATCH, false);
            }
        }
    }
    /**添加玩家 */
    private add_battle_player(element: RoomPlayerInfo): SGBattlePlayerInfo {
        if (!this._battleplayer) this._battleplayer = {};
        let item = new SGBattlePlayerInfo();
        for (const key1 in element) {
            if (element.hasOwnProperty(key1)) {
                const el = element[key1];
                item[key1] = el;
            }
        }

        item.auto = false;
        item.userTotal = 0;
        item.playTurn = 0;
        item.isturn = false;
        item.isFirst = false;
        if (item.userStatus == 5) {
            item.paiState = ESGBattlePlayerPaiState.kanPai;
        } else {
            item.paiState = ESGBattlePlayerPaiState.none;
        }
        item.auto = false;
        item.pai = [];
        item.cdtime = 0;
        /// item.seatId = this.getUISeatId(item.chairId);
        // item.seatId = 0;
        item.playStatus = item.userStatus == 5 ? 1 : 0;


        //把之前重的id删掉
        var hasDelId = -1;
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                const element = this._battleplayer[key];
                if (element && item && element.chairId == item.chairId) {
                    hasDelId = element.userId;
                    break;
                }
            }
        }
        if (hasDelId != null && hasDelId != -1) {
            delete this._battleplayer[hasDelId];
        }

        this._battleplayer[item.userId] = item;
        UDebug.Log("玩家进入" + JSON.stringify(item))
        return item;
    }

    private user_status_notify(userid: number, usstatus: number) {
        UDebug.Log("状态改变-----------------------" + userid + "usstatus = " + usstatus)
        var userId = userid;
        var usStatus = usstatus;
        if (usStatus == null || usStatus == 0) {
            if (this._battleplayer && this._battleplayer[userId]) {
                if (userId != AppGame.ins.roleModel.useId) {
                    this._battleplayer[userId].isExit = true
                    this.updateSeatInfo()
                }
            }
        }
        else {
            if (this._battleplayer && this._battleplayer[userId]) {
                var playing = usStatus >= 5 ? 1 : 0
                this._battleplayer[userId].playStatus = playing;
            }
        }
    }

    // }
    /**更新玩家分数 */
    private update_player_scoreinfo(userId: number, score: number, usetotal: number): void {
        return
        let pl = this._battleplayer[userId];
        if (pl == null) return;

        pl.score = score;
        pl.userTotal = usetotal;

        let data = new UISGUpdateSeatRoleInfo();
        data.score = score;
        data.usetotal = usetotal;
        data.seatId = pl.seatId;

        this.emit(USGHelper.SG_SELF_EVENT.SG_SC_TS_UPDATA_TOTAL_PLAYER_SCORE, data);
    }

    //#endregion

    getBeiShuArray(num: number): number[] {
        var array = new Array();

        var bei = num / 5;

        if (bei < 1) {
            // array[0] = bei;
            var yu = num % 5;
            for (let j = 0; j < yu; j++) {
                array.push(Math.ceil(j + 1));
            }

        }
        else if (bei == 1) {
            for (let i = 0; i < 5; i++) {
                array.push(i + 1);
            }
        }
        else if (bei > 1) {
            for (let i = 0; i < 5; i++) {
                let temp = (i + 1) * bei;
                array.push(Math.ceil(temp));
            }
        }
        return array;
    }

    /**
     * 断线重连上了 游戏结束之后 直接发起匹配
     */
    reconnectRequest(): void {
        this.state = ESGState.Match;
        AppGame.ins.roomModel.requestMatch();
    }


    /**匹配 */
    requestMatch(): void {
        if (this._retrunLobby) return;
        if (this.state == ESGState.LeftGame) {
            return;
        }
        this.state = ESGState.LeftGame;
        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.LeftGame);


        // this._battleplayer = {};
        // this._currentDizhu = 0;
        // this._totalChip = 0;
        // this._totalTurn = 0;
        // this.state = ESGState.Match;
        // AppGame.ins.roomModel.requestMatch();
    }

    /**获取刚进房间时候 显示自己的信息 */
    getshowselfinfo(): SGBattlePlayerInfo {

        let bb = new SGBattlePlayerInfo();
        bb.seatId = SG_SELF_SEAT;
        bb.nickName = AppGame.ins.roleModel.useId.toString();
        bb.headId = AppGame.ins.roleModel.headId;
        bb.score = AppGame.ins.roleModel.score;
        bb.headboxId = AppGame.ins.roleModel.headboxId;
        bb.vipLevel = AppGame.ins.roleModel.vipLevel;
        return bb;
    }

    /**
     * 取消匹配
     */
    cancleMatch(): void {
        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.CancleMatch);
    }

    /**保存房间数据 不能修改 */
    saveRoomInfo(data: RoomInfo): void {
        this._roomInfo = data;
    }

    /**
    * 退出游戏
    */
    exitGame(): void {
        UDebug.Log("this._state:" + this._state);
        if (!this._battleplayer || this._battleplayer[AppGame.ins.roleModel.useId].playStatus == 0) {
            this.state = ESGState.Wait;
        }
        switch (this.state) {
            case ESGState.Gameing:
            case ESGState.LeftGame:
                {
                    if (this._battleplayer[AppGame.ins.roleModel.useId].playStatus == 1) {
                        AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
                    } else {
                        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                    }

                }
                break;
            case ESGState.Watching:
            case ESGState.Match:
            case ESGState.Wait:
                {
                    if (this._roomInfo) {
                        this._retrunLobby = true;
                        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                    } else {
                        AppGame.ins.loadLevel(ELevelType.Hall, EGameType.SG);
                    }
                }
                break;
        }
    }

    /*************** c_send *****************/
    /**
     * 
     * @param jetton 倍数索引  
     */
    sendFreshGameScene() {
        // this._battleplayer = {};
        this.sendMsg(SanGong.SUBID.CS_GAMESCENE_FRESH, {});
    }

    /**根据真实玩家位置获取玩家信息 */
    public getbattleplayerbyChairId(chairId: number): SGBattlePlayerInfo {
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                const element = this._battleplayer[key];
                if (element.chairId == chairId) {
                    return element;
                }
            }
        }
        return null;
    }
    /**
     * 根据UI的seatid 获取真实的座位id
     * @param seatId 
     */
    public getRealSeatId(seatId): number {
        let temp = this.selfRealSeatId - this._selfUISeatId;
        let temp2 = seatId + temp;
        if (temp2 > 4) temp2 = temp2 - 5;
        return temp2;
    }
    /**
     * 根据真实的座位ID获取玩家的UI座位ID
     * @param realId 
     */
    public getUISeatId(realId: number): number {
        let temp = this.selfRealSeatId - this._selfUISeatId;
        let temp2 = realId - temp;
        if (temp2 < 0) temp2 = 5 + temp2;
        return temp2;
    }
    //#endregion


}
