import Model from "../../../common/base/Model";
import {RoomInfoHy, RoomPlayerInfo } from "../../../public/hall/URoomClass";
import AppGame from "../../../public/base/AppGame";
import MBaseGameModel from "../../../public/hall/MBaseGameModel";
import { Ddz, FPdk, Game } from "../../../common/cmd/proto";
import UHandler from "../../../common/utility/UHandler";
import UMsgCenter from "../../../common/net/UMsgCenter";
import { EGameType, ELeftType, ELevelType, ECommonUI, EMsgType, EAgentLevelReqType } from "../../../common/base/UAllenum";
import cfg_head from "../../../config/cfg_head";
import UDebug from "../../../common/utility/UDebug";
import ULanHelper from "../../../common/utility/ULanHelper";
import UPDKHelper_hy, { EPDKState } from "../pdk_Helper_hy";
import pdk_Library_hy from "../pdk_Library_hy";
import pdk_Main_hy from "../pdk_Main_hy";
import { UIPDKBattleOver } from "../../pdk/pdk_Helper";
import MHall from "../../../public/hall/lobby/MHall";
import { CardType } from "../poker/PDKEnum_hy";
import UStringHelper from "../../../common/utility/UStringHelper";

export const PDK_SCALE = 0.01;
export const PDK_SCALE_100 = 100;
/**
 * 创建:dz 
 * 作用:数据逻辑
 */
export default class MPdk_hy extends Model {

    static PDK_GAMESTATUS = {
        /**空闲 */
        FREE: 0,
        /**匹配 */
        MATCH: 1,
        /**发牌 */
        SEND: 2,
        /**抢庄 */
        CALL: 3,
        /**加倍 */
        SCORE: 4,
        /**出牌*/
        CARD: 5,
        /**跟牌 */
        FOLLOW_CARD: 7,
        /**结束*/
        OVER: 6,
    }

    /************************/

    /**返回大厅 */
    private _retrunLobby: boolean = false;

    /**庄家索引 */
    private _bankerIndex: number = null;
    
    static _ins: MPdk_hy;
    static get ins(): MPdk_hy {
        if (MPdk_hy._ins == null) {
            MPdk_hy._ins = new MPdk_hy();
            MPdk_hy._ins.init();
        }
        return MPdk_hy._ins;
    }
    /**set 庄家索引 */
    set sBankerIndex(index: number) {
        this._bankerIndex = index;
    }
    /**get 庄家索引 */
    get gBankerIndex(): number {
        return this._bankerIndex;
    }
    /**是否展示过说明(只需显示一次) */
    private _isOpenSM: boolean = false;
    /**get 是否展示过说明(只需显示一次) */
    get gIsOpenSM(): boolean {
        return this._isOpenSM;
    }
    /**set 是否展示过说明(只需显示一次) */
    set sIsOpenSM(b: boolean) {
        this._isOpenSM = b;
    }
    /**玩家自己的信息 */
    private _myPlayer = {
        touxiang: null,
        nickname: null,
        coin: null,
        userid: null
    }

    /**自己在服务器上的位置 */
    private _wMeChairId: number = 0;//null;
    get gMeChairId(): number {
        return this._wMeChairId;
    }
    set sMeChairId(wChairId: number) {
        this._wMeChairId = wChairId;
    }
    /**好友房房间信息 */
    _roomInfoHy: RoomInfoHy;
    get roomInfoHy(): RoomInfoHy {
        return this._roomInfoHy;
    }
    set roomInfoHy(v: RoomInfoHy) {
        this._roomInfoHy = v;
    }
    /**上家出牌的chairid */
    public _lastDealChairId: number = 0;
    get gLastDealChairId(): number {
        return this._lastDealChairId;
    }
    set sLastDealChairId(lastDealChairId: number) {
        this._lastDealChairId = lastDealChairId;
    }

    /**该游戏最大人数 */
    private _MaxPlayer: number = 3;
    get maxPlayer(): number {
        return this._MaxPlayer;
    }

    /**自己的真实位置 */
    get selfRealSeatId(): number {
        let role = AppGame.ins.gamebaseModel.getRoomPlayerInfo(this.selfUserId);
        return role.chairId;
    }


    /**游戏状态 */
    private _gameStatus: number = 0;
    get gameStatus(): number {
        return this._gameStatus;
    }
    set gameStatus(wChairId: number) {
        this._gameStatus = wChairId;
    }
    protected get selfUserId(): number {
        return AppGame.ins.roleModel.useId;
    }

    /**
     * 游戏状态
     */
    private _state: EPDKState = EPDKState.Wait;
    get state(): number {
        return this._state;
    }
    set state(states: number) {
        this._state = states;
    }

    /**本局的玩家 */
    private _battleplayer: { [key: number]: RoomPlayerInfo } = {};

    get gBattlePlayer(): { [key: number]: RoomPlayerInfo } {
        return this._battleplayer;
    }
    /**获得玩家字典长度 */
    getBattlePlayerLength(): number {
        var length = 0;
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                length++;
            }
        }
        return length;
    }

    /**当前底注 */
    private _currentDizhu: number;
    /**当前的底注 */
    get currentDizhu(): number {
        return this._currentDizhu;
    }
    set currentDizhu(num: number) {
        this._currentDizhu = num;
    }
    /**读消息先后顺序,以防先收到场景消息，后才收到玩家进入消息 */
    private _isWaitGameServerMsg = false;
    /**场景消息标记 0:free(不用处理) 1:call 2:score 3:open */
    private _sceneNum = 0;
    /**临时缓存的 */
    private _dataSceneTemp: any;

    /**游戏自定义玩法配置信息 */
    private _gameCfgInfo: any;  
    public get gameCfgInfo() : any {
        return this._gameCfgInfo;
    }
    public set gameCfgInfo(v : any) {
        this._gameCfgInfo = v;
    }
    
    public isFreeScene: boolean = false;

    //别人出的牌
    public otherOutPokers: number[] = []
    //选中的牌
    public selectPokers: number[] = []
    //手牌
    public handPokers: number[] = []
    //提示列表
    public PromptList: any[] = []
    //提示列表当前序号
    public PromptIndex = 0
    // cardsType: PDKEnum.CardType;
    //牌库
    public pokerLibrary: pdk_Library_hy = null
    // 结算数据
    public resultData: any = null;
    /**当前底注 */
    public cellScore: number;
    //记牌器
    public leftCardCount = [];
    //当前轮主动出牌的玩家
    public  firstOutChairId: number = -1

     //当前轮主动出牌打出的牌型
     public  firstOutCardType: number = -1
 

    init(): void {
        MPdk_hy._ins = this;
        this._retrunLobby = false;
        this.pokerLibrary = new pdk_Library_hy()
        // 游戏空闲
        this.regesterMsg(FPdk.SUBID.SC_GAMESCENE_FREE, new UHandler(this.onGameSceneFree, this));
        // 游戏中场景消息
        this.regesterMsg(FPdk.SUBID.SC_GAMESCENE_PLAY, new UHandler(this.onGamescenePlay, this));
        // 好友房创建房间时候客户端上传的json字符串配置，玩家进入的时候，原字符串发送给客户端
        this.regesterMsg(FPdk.SUBID.SUB_S_NOTIFY_CLIENT_CFG, new UHandler(this.onGamesClientCfg, this));

        // 开始游戏
        this.regesterMsg(FPdk.SUBID.SUB_S_GAME_START, new UHandler(this.onGameStart, this));

        this.regesterMsg(FPdk.SUBID.SUB_S_GAME_FAPAI, new UHandler(this.onGameFaPai, this));
        // 游戏结束
        this.regesterMsg(FPdk.SUBID.SC_GAMESCENE_END, new UHandler(this.onGameEnd, this));
        // 通知谁拥有特殊牌
        this.regesterMsg(FPdk.SUBID.SUB_S_NOTIFY_SPECIALCARD, new UHandler(this.onOwnerEdpeach3Chair, this));
        //请玩家出牌
        this.regesterMsg(FPdk.SUBID.SUB_S_CHUPAI, new UHandler(this.onOutCard, this));
        // 请玩家跟牌
        this.regesterMsg(FPdk.SUBID.SUB_S_FOLLOW, new UHandler(this.onFollowCard, this));
        // 通知玩家出牌信息
        this.regesterMsg(FPdk.SUBID.SUB_S_NOTIFY_CHUPAI_INFO, new UHandler(this.onNotifyOutCardInfo, this));
        // 通知玩家过牌信息
        this.regesterMsg(FPdk.SUBID.SUB_S_NOTIFY_PASS_INFO, new UHandler(this.onNotifyPassCardInfo, this));
        // 通知游戏结果	
        this.regesterMsg(FPdk.SUBID.SUB_S_NOTIFY_GAME_RESULT, new UHandler(this.onNotifyGameResult, this));
        // 通知玩家托管信息
        this.regesterMsg(FPdk.SUBID.SUB_S_NOTIFY_TUOGUAN, new UHandler(this.onNotifyPlayerTuoguanInfo, this));
        // 通知玩家分数变化
        this.regesterMsg(FPdk.SUBID.SUB_S_NOTIFY_SCORECHANGE, new UHandler(this.onNotifyPlayerScoreChange, this));
        // 通知消息
        this.regesterMsg(FPdk.SUBID.SUB_S_NOTIFY_MESSAGE, new UHandler(this.onNotifyMessageInfo, this));
        // 通知聊天消息
        this.regesterMsg(FPdk.SUBID.SUB_S_MESSAGE_RESULT, new UHandler(this.onNotifyChartMessageInfo, this));
        // 通知玩家信息
        this.regesterMsg(FPdk.SUBID.SUB_S_NOTIFY_USER_INFO, new UHandler(this.onNotifyPlayerInfo, this));

        // 玩家准备消息通知返回
        this.regesterMsg(FPdk.SUBID.SUB_S_READY_RESULT, new UHandler(this.onNotifyReadyResult, this));
        // 玩家旁观消息
        this.regesterMsg(FPdk.SUBID.SUB_S_LOOKON_RESULT, new UHandler(this.onNotifyLookOnResult, this));
        // 结算
        this.regesterMsg(FPdk.SUBID.SUB_S_CONCLUDE_RESULT, new UHandler(this.onNotifyConcludeResult, this));
        // 一局之后玩家状态切换
        this.regesterMsg(FPdk.SUBID.SUB_S_CHANGE_USER_STATUS, new UHandler(this.onNotifyChangeUserStatus, this));

        // 战绩记录
        this.regesterMsg(FPdk.SUBID.SUB_S_GET_GAME_REOCRD, new UHandler(this.onNotifyGetGameRecord, this));

        // 解散房间
        this.regesterMsg(FPdk.SUBID.SUB_S_DISSMIS_RESULT, new UHandler(this.onNotifyDissmisResult, this));
        // 预解散房间
        this.regesterMsg(FPdk.SUBID.SUB_S_PRE_DISSMIS_RESULT, new UHandler(this.onNotifyPreDissmisResult, this));

        // 再来一轮
        this.regesterMsg(FPdk.SUBID.SUB_S_AGAIN_RESULT, new UHandler(this.onNotifyAgainResult, this));
        // 15分钟超时
        this.regesterMsg(FPdk.SUBID.SUB_S_IDLE_TIMEOUT_RESULT, new UHandler(this.onNotifyTimeOutResult, this));
        // IP设置限制
        this.regesterMsg(FPdk.SUBID.SUB_S_SET_IP_LIMIT_RESULT, new UHandler(this.onNotifyIpLimitResult, this));
        // 自动开局
        this.regesterMsg(FPdk.SUBID.SUB_S_SET_AUTO_START_RESULT, new UHandler(this.onNotifyAutoStartResult, this));
        // 设置聊天限制
        this.regesterMsg(FPdk.SUBID.SUB_S_SET_CHAT_LIMIT_RESULT, new UHandler(this.onNotifyChatLimitResult, this));
        
    }

    exit(): void {
        super.exit();
        this.resetData();
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.user_status_notify, this);

        this.unregesterMsg(FPdk.SUBID.SC_GAMESCENE_FREE, new UHandler(this.onGameSceneFree, this));
        this.unregesterMsg(FPdk.SUBID.SC_GAMESCENE_PLAY, new UHandler(this.onGamescenePlay, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_NOTIFY_CLIENT_CFG, new UHandler(this.onGamesClientCfg, this));

        this.unregesterMsg(FPdk.SUBID.SUB_S_GAME_START, new UHandler(this.onGameStart, this));
        this.unregesterMsg(FPdk.SUBID.SC_GAMESCENE_END, new UHandler(this.onGameEnd, this));

        this.unregesterMsg(FPdk.SUBID.SUB_S_GAME_FAPAI, new UHandler(this.onGameFaPai, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_NOTIFY_SPECIALCARD, new UHandler(this.onOwnerEdpeach3Chair, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_CHUPAI, new UHandler(this.onOutCard, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_FOLLOW, new UHandler(this.onFollowCard, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_NOTIFY_CHUPAI_INFO, new UHandler(this.onNotifyOutCardInfo, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_NOTIFY_PASS_INFO, new UHandler(this.onNotifyPassCardInfo, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_NOTIFY_GAME_RESULT, new UHandler(this.onNotifyGameResult, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_NOTIFY_TUOGUAN, new UHandler(this.onNotifyPlayerTuoguanInfo, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_NOTIFY_SCORECHANGE, new UHandler(this.onNotifyPlayerScoreChange, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_NOTIFY_MESSAGE, new UHandler(this.onNotifyMessageInfo, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_MESSAGE_RESULT, new UHandler(this.onNotifyChartMessageInfo, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_NOTIFY_USER_INFO, new UHandler(this.onNotifyPlayerInfo, this));

        this.unregesterMsg(FPdk.SUBID.SUB_S_READY_RESULT, new UHandler(this.onNotifyReadyResult, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_LOOKON_RESULT, new UHandler(this.onNotifyLookOnResult, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_CONCLUDE_RESULT, new UHandler(this.onNotifyConcludeResult, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_CHANGE_USER_STATUS, new UHandler(this.onNotifyChangeUserStatus, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_GET_GAME_REOCRD, new UHandler(this.onNotifyGetGameRecord, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_DISSMIS_RESULT, new UHandler(this.onNotifyDissmisResult, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_PRE_DISSMIS_RESULT, new UHandler(this.onNotifyPreDissmisResult, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_AGAIN_RESULT, new UHandler(this.onNotifyAgainResult, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_IDLE_TIMEOUT_RESULT, new UHandler(this.onNotifyTimeOutResult, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_SET_IP_LIMIT_RESULT, new UHandler(this.onNotifyIpLimitResult, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_SET_AUTO_START_RESULT, new UHandler(this.onNotifyAutoStartResult, this));
        this.unregesterMsg(FPdk.SUBID.SUB_S_SET_CHAT_LIMIT_RESULT, new UHandler(this.onNotifyChatLimitResult, this));
        this._roomInfoHy = null;
        this._battleplayer = {};
        this._wMeChairId = null;
    }

    resetData(): void {
        this.otherOutPokers = []
        this.selectPokers = []
        this.handPokers = []
        this.PromptList = []
        this.PromptIndex = 0
        this._battleplayer = {}
        this._wMeChairId = null
        this._bankerIndex = null
        this._gameStatus = 0
        this._state = 0
    }
    update(dt: number): void {

    }
    run(): void {
        super.run();
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.user_status_notify, this);
    }

    /**注册PDK网络消息事件 */
    regesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.regester(EGameType.PDK_HY,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            subId,
            handler);
    }

    unregesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.unregester(EGameType.PDK_HY,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            subId,
            handler);
    }


    /** 发送网络消息*/
    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(EGameType.PDK_HY,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            subId, data, handler, unlock);
    }


    /**玩家状态 */
    private user_status_notify(userid: number, usstatus: number) { //data: GameServer.MSG_S2C_GameUserStatus
        UDebug.Log("更新玩家状态------------------------" + userid + "   " + usstatus);
        var userId = userid;
        var usStatus = usstatus;
        if (usStatus == null || usStatus == 0) {
            if (this._battleplayer && this._battleplayer[userId]) {


                // if (userId != AppGame.ins.roleModel.useId) {
                //     //this._battleplayer[userId].isExit = true
                //     this.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_UPDATE_PLAYERS_EVENT, this._battleplayer);
                // }
            }
        } else {
            if (this._battleplayer && this._battleplayer[userId]) {
                this._battleplayer[userId].userStatus = usStatus;
                if (userId != AppGame.ins.roleModel.useId) {
                    //this._battleplayer[userId].isExit = true
                    // this.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_UPDATE_PLAYERS_EVENT, this._battleplayer);
                }
            }
        }

        // if ((userId == this.selfUserId && this._dataSceneTemp != null && this._sceneNum > 0 && this._isWaitGameServerMsg)
        //     || (this._battleplayer != null && this.getBattlePlayerLength() == 4 && this._isWaitGameServerMsg)) {
        //     this._isWaitGameServerMsg = false;

        //     // this.handleWaitGameMsg(this._sceneNum, this._dataSceneTemp);
        // }
    }

    /************* scene *****************/
    /**玩家进入房间 */
    private sc_ts_room_playerinfo(data: any) {
        UDebug.log("玩家进入房间-----data = " + JSON.stringify(data));
        var element: RoomPlayerInfo = data
        this._battleplayer[element.userId] = element
        // this._battleplayer[element.userId].score = element.score
        if (element.userId == AppGame.ins.roleModel.useId) {
            this._wMeChairId = element.chairId;
        }
        // AppGame.ins.showTips("欢迎玩家"+element.userId+"加入游戏");
        this.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_UPDATE_PLAYERS_EVENT, this._battleplayer)
    }

    /**玩家离开房间 */
    private sc_ts_player_left_room(data: any) {
        UDebug.Log("sc_ts_player_left_room:" + JSON.stringify(data));
        if (data.retCode == 0) {

            if (data.type == ELeftType.ReturnToRoom) {
                if (this._state != EPDKState.AlreadyLeft) {
                    this._state = EPDKState.AlreadyLeft;
                    if(pdk_Main_hy.ins.clockActionId) {
                        clearInterval(pdk_Main_hy.ins.clockActionId);
                    }
                    AppGame.ins.loadLevel(ELevelType.Hall);
                }
            } else if (data.type == ELeftType.CancleMatch) {

                this.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SC_TS_CANCLE_MATCH, true);
                this._state = EPDKState.Wait;

            } else if (data.type == ELeftType.LeftGame) {

                this._battleplayer = {};
                this._currentDizhu = 0;
                this._wMeChairId = 0;

                this._state = EPDKState.Match;

                // AppGame.ins.roomModel.requestMatch();
                this.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SC_TS_START_MATCH, true);
            }

        }
        // else if (data.retCode == 2) {
        //     this.emit(UPDKHelper_hy.PDK_SELF_EVENT.DDZ_CONTINUE_ACTIVE, true);
        // }
        else {
            this._retrunLobby = false;
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
            return
        }
    }

    /**保存房间数据 不能修改 */
    saveRoomInfo(data: any): void {
        this._roomInfoHy = data;
    }


    /**
     * 退出游戏
     */
    exitGame(): void {
        UDebug.Log("this._state:" + this._state);
        switch (this._state) {
            case EPDKState.Gameing:
            case EPDKState.LeftGame:
                {
                    if (this.getbattleplayerbyChairId(this._wMeChairId).userStatus == 5) {
                        AppGame.ins.showTips(ULanHelper.GAME_HY.EXIT_OFF_TIP);
                    } else {
                        AppGame.ins.gamebaseModel.requestLeftHy(this._roomInfoHy.gameId, this._roomInfoHy.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                    }
                }
                break;
            case EPDKState.Watching:
            case EPDKState.Match:
            case EPDKState.Wait:
                {
                    if (this._roomInfoHy) {
                        this._retrunLobby = true;
                        AppGame.ins.gamebaseModel.requestLeftHy(this._roomInfoHy.gameId, this._roomInfoHy.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                    } else {
                        AppGame.ins.loadLevel(ELevelType.Hall, EGameType.PDK_HY);
                    }
                }
                break;
        }
    }
    /**
     * 取消匹配
     */
    cancleMatch(): void {
        AppGame.ins.gamebaseModel.requestLeft(this._roomInfoHy.gameId, this._roomInfoHy.roomId, this.selfUserId, ELeftType.CancleMatch);
    }

    /**
     * 断线重连上了 游戏结束之后 直接发起匹配
     */
    reconnectRequest(): void {
        this._state = EPDKState.Match;
        AppGame.ins.roomModel.requestMatch();
    }

    /**匹配 */
    requestMatch(): void {
        if (this._retrunLobby) return;
        if (this._state == EPDKState.LeftGame) {
            return;
        }
        this._state = EPDKState.LeftGame;
        AppGame.ins.gamebaseModel.requestLeft(this._roomInfoHy.gameId, this._roomInfoHy.roomId, this.selfUserId, ELeftType.LeftGame);
    }

    /************* s_event **************/

    // 通知客户端配置
    onGamesClientCfg(data: any) {
        // this._state = EPDKState.Gameing;
        // this._roomInfoHy = data.roomInfo;
        // this._gameCfgInfo = JSON.parse(data.JsonString);
        this.setGameCfgInfo(data.JsonString); 
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_GAME_CLIENT_CFG, this._gameCfgInfo);
    }

    setGameCfgInfo(data: any) {
        if(!UStringHelper.isEmptyString(data)) {
            this._gameCfgInfo = JSON.parse(data);
        }
    }

    /**游戏开始 */
    onGameStart(data: any) {
        this._state = EPDKState.Gameing;
        this._roomInfoHy = data.roomInfo;
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_GAME_START, data);
    }

    /**发牌 */
    onGameFaPai(data: any) {
        for (var k in this._battleplayer) {
            this._battleplayer[k].userStatus = 5;
        }
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_GAME_FAPAI, data);
        this._gameStatus = MPdk_hy.PDK_GAMESTATUS.SEND;
        // this.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_UPDATE_ROOMID, roomId);
    }

    // 游戏空闲场景消息
    private onGameSceneFree(data: any): void {
        this._roomInfoHy = data.roomInfo;
        this.isFreeScene = true;
        this.setGameCfgInfo(data.roomInfo.extent);
        // this._state = EPDKState.Wait;
        if (this._state != EPDKState.Match) {
            this._state = EPDKState.Wait;
        }
        /*for (var i = 0; i < result.length; i++) {
            const element = result[i]
            this._battleplayer[element.userid].score = element.currentscore;
        }*/
        for (var k in data.playerinfo) {
            var data_cmd_s_ready = {
                retCode: 0,
                chairId: data.playerinfo[k].chairID,
            }
            if (this._battleplayer && this._battleplayer[data.playerinfo[k].userId]) {
                this._battleplayer[data.playerinfo[k].userId].userStatus = data.playerinfo[k].status;
                this._battleplayer[data.playerinfo[k].userId].score = data.playerinfo[k].score;
                this._battleplayer[data.playerinfo[k].userId].headId = data.playerinfo[k].headerId;
            }
            if (data.playerinfo[k].status == 4) { // 准备
                this.onNotifyReadyResult(data_cmd_s_ready);
                UDebug.log("准备---------"+JSON.stringify(data.playerinfo[k]));
            }
            if (data.playerinfo[k].status == 7) { // 旁观
                this.onNotifyLookOnResult(data_cmd_s_ready);
            }
        }
        this.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_UPDATE_PLAYERS_EVENT, this._battleplayer);
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_GAMESCENE_FREE, data);
    }


    /**游戏中场景消息  */
    private onGamescenePlay(data: any): void {
        this._state = EPDKState.Gameing;
        this.isFreeScene = false;
        this._roomInfoHy = data.roomInfo;
        this.setGameCfgInfo(data.roomInfo.extent);
        AppGame.ins.fPdkModel.currentDizhu = data.discore;
        var isFollowCard = false
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_GAMESCENE_PLAY, data);
        //发牌信息
        var data_cmd_s_fapai = {
            roomInfo: data.roomInfo,
            isReconnect: true,
            chairid: this._wMeChairId,
            roundid: data.roundid,
            cards: data.playerinfo[this._wMeChairId].cards,
            removecards:data.removecards,
            outcarddatas:data.outcarddatas
        }

        var data_cmd_s_start = {
            roomInfo: data.roomInfo,
            isReconnect: true,
            roundId: data.roundid,
            playerinfo: data.playerinfo,
        }

        this.onGameStart(data_cmd_s_start);
        UDebug.log("----------即将要执行发牌-----------+"+JSON.stringify(data_cmd_s_fapai));
        this.onGameFaPai(data_cmd_s_fapai)
        for (let k = 0; k < data.playerinfo.length; k++) {
            //托管信息
            var data_cmd_s_notifytuoguan = {
                chairid: data.playerinfo[k].chairID,
                istuoguan: data.playerinfo[k].istuoguan
            }
            if (this._battleplayer && this._battleplayer[data.playerinfo[k].userId]) {
                this._battleplayer[data.playerinfo[k].userId].userStatus = data.playerinfo[k].status;
                this._battleplayer[data.playerinfo[k].userId].score = data.playerinfo[k].score;
                this._battleplayer[data.playerinfo[k].userId].headId = data.playerinfo[k].headerId;
            }
            this.onNotifyPlayerTuoguanInfo(data_cmd_s_notifytuoguan)

            //显示其它两家的出牌信息
            if (data.playerinfo[k].chairid != data.currentchairid) {
                var isPass = data.playerinfo[k].lastchupaiinfo.ispass
                if (isPass == 1) {
                    var data_cmd_s_notifypassinfo = {
                        chairid:data.playerinfo[k].chairID,
                        leftnum: data.playerinfo[k].leftcardnum,
                    }
                    this.onNotifyPassCardInfo(data_cmd_s_notifypassinfo)
                } else {
                    var data_cmd_s_notifychupaiinfo = {
                        chairid: data.playerinfo[k].chairID,
                        cardtype: data.playerinfo[k].lastchupaiinfo.cardtype,
                        cards: data.playerinfo[k].lastchupaiinfo.cards,
                        leftnum: data.playerinfo[k].leftcardnum,
                        leftcards: data.playerinfo[k].cards,
                        isReconnect: true,
                    }
                    this.onNotifyOutCardInfo(data_cmd_s_notifychupaiinfo)
                    isFollowCard = true
                }
            }
        }
        this.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_UPDATE_PLAYERS_EVENT, this._battleplayer);
        
        //出牌或跟牌通知
        var data_cmd_s_chupai = {
            chairid: data.currentchairid,
            waittime: data.waittime,
            isReconnect: true,
            leftnum: data.playerinfo[data.currentchairid].leftcardnum, 
        }
        isFollowCard ? this.onFollowCard(data_cmd_s_chupai) : this.onOutCard(data_cmd_s_chupai)
    }

    /**通知谁拥有特殊牌 */
    private onOwnerEdpeach3Chair(data: any): void {
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_GAME_OWNREDPEACH3CHAIR, data);
    }
    // 请玩家出牌
    private onOutCard(data: any): void {
        this._gameStatus = MPdk_hy.PDK_GAMESTATUS.CARD;
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_GAME_PLAYER_CHUPAI, data);
    }
    // 请玩家跟牌
    private onFollowCard(data: any): void {
        this._gameStatus = MPdk_hy.PDK_GAMESTATUS.FOLLOW_CARD;
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_GAME_PLAYER_FOLLOWCARD, data);
    }
    // 通知玩家出牌信息
    private onNotifyOutCardInfo(data: any): void {
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_GAME_NOTIFY_CHUPAI_INFO, data);
    }
    // 通知过牌信息
    private onNotifyPassCardInfo(data: any): void {
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_GAME_NOTIFY_PASS_INFO, data);
    }
    // 通知游戏结果
    private onNotifyGameResult(data: any): void {
        this._roomInfoHy = data.roomInfo;
        this._state = EPDKState.Wait;
        this._gameStatus = MPdk_hy.PDK_GAMESTATUS.OVER;
        var result = data.gameresult
        for (var i = 0; i < result.length; i++) {
            const element = result[i]
            // UDebug.log("this.battleplayer = "+ JSON.stringify(this._battleplayer));
            if(this._battleplayer && this._battleplayer.hasOwnProperty(element.userid)) {
                this._battleplayer[element.userid].score = element.currentscore;
            }
        }
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_GAME_NOTIFY_GAME_RESULT, data); 
    }
    // 通知玩家托管信息
    private onNotifyPlayerTuoguanInfo(data: any): void {
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_GAME_NOTIFY_TUOGUAN, data);
    }
    // 通知玩家分数变化
    private onNotifyPlayerScoreChange(data: any): void {
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_SCORECHANGE, data);
    }

    private onNotifyMessageInfo(data: any): void {
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_MESSAGE, data);
    }

    // 通知玩家聊天消息
    private onNotifyChartMessageInfo(data: any): void {

        for (let i = 0; i < pdk_Main_hy.ins.playerList.length; i++) {
            if (pdk_Main_hy.ins.playerList[i].userId == `${data.sendUserId}`) {
                data.headerId = this.findHeadId(pdk_Main_hy.ins.playerList[i].chairId); 
                data.nickName = this.findHeadId(pdk_Main_hy.ins.playerList[i].chairId, true, true);
                data.headImgUrl =  this.findHeadId(pdk_Main_hy.ins.playerList[i].chairId, true);
                AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_CHAT_MESSAGE, data);
                break;
            }
        }
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_CHAT_MESSAGE, data)
    }

    // 通知玩家信息
    /**message CMD_S_NotifyUserInfo
{
	required int64   	userId 		= 1;
	required int32   	chairId 	= 2;
	optional playerinfo playerinfo  = 3;//没有此字段，则用户离线
}
 */
    private onNotifyPlayerInfo(data: any): void {
        UDebug.log("更新用户状态信息----data = "+JSON.stringify(data));
        if(data && data.hasOwnProperty('playerinfo')) {
            if (this._battleplayer && this._battleplayer[data.userId]) {
                if(data.playerinfo.status == 3 && data.chairId != AppGame.ins.fPdkModel.gMeChairId) {
                    AppGame.ins.showTips("欢迎玩家"+data.userId+"加入游戏");
                } else if(data.playerinfo.status == 6) {
                    AppGame.ins.showTips("玩家"+data.userId+"离线");
                }
                this._battleplayer[data.userId].userStatus = data.playerinfo.status;
                this._battleplayer[data.userId].score = data.playerinfo.score;
                this._battleplayer[data.userId].headId = data.playerinfo.headerId;
                this.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_UPDATE_PLAYERS_EVENT, this._battleplayer);
            }
        } else {
            if (this._battleplayer && this._battleplayer[data.userId]) {
                // AppGame.ins.showTips("玩家"+data.userId+"退出游戏");
                this.isFreeScene = true;
                this._battleplayer[data.userId].userStatus = 0;
                this.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_UPDATE_PLAYERS_EVENT, this._battleplayer);
                delete this.gBattlePlayer[data.userId];
            }
        }
    }

    findHeadId(chairId:number, isGetHeadUrl: boolean = false, isGetNickName: boolean = false): any {
        for (const key in pdk_Main_hy.ins.playerDataList) {
            let element = pdk_Main_hy.ins.playerDataList[key];
            if (element.chairId == chairId) {
                if(isGetHeadUrl) {
                    if(isGetNickName) {
                        return element.nickName;
                    }
                    return element.headImgUrl;
                } else {
                    return element.headId
                }
            }
        }
        return null;
    }

    // 通知玩家准备消息
    private onNotifyReadyResult(data: any): void {
        // UDebug.log('准备')
        if (data.retCode == 0) {
            if (this._battleplayer && this.getbattleplayerbyChairId(data.chairId)) {
                this.getbattleplayerbyChairId(data.chairId).userStatus = data.status;
                // this.updateBattlePlayer();
                this.emit(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_GAME_READY, data);
                // if (this._wMeChairId == data.chairId) {
                //     // let isShowTip = false;
                //     let playerNum = 0;
                //     for (const key in this._battleplayer) {
                //         playerNum++;
                //     }
                //     for (const key in this._battleplayer) {
                //         const element = this._battleplayer[key];
                //         // if(element.userStatus != 4 || playerNum != 3) {
                //         //     isShowTip = true;
                //         // }
                //     }
                //     // isShowTip && AppGame.ins.showTips(ULanHelper.GAME_HY.STATUS_READY);
                // }
            }
        } else {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
    }

    // 通知玩家旁观
    private onNotifyLookOnResult(data: any): void {
        // UDebug.log('旁观')
        if (data.retCode == 0) {
            if (this._battleplayer && this.getbattleplayerbyChairId(data.chairId)) {
                this.getbattleplayerbyChairId(data.chairId).userStatus = data.status;
                // this.updateBattlePlayer();
                this.emit(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_LOOK_ON, data);
                // if (this._wMeChairId == data.chairId) {
                //     // AppGame.ins.showTips(ULanHelper.GAME_HY.STATUS_LOOK_ON);
                // }
            }
            // this.emit(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_LOOK_ON, data);
        } else {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
    }

    // 通知提前结算
    private onNotifyConcludeResult(data: any): void {
        // this.emit(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_CONCLUDE_RESULT,data);
        if (data.retCode == 0) {
            // PDK_NOTIFY_CONCLUDE_RESULT
            if (this._state == EPDKState.Gameing) {
                if(AppGame.ins.roleModel.useId != MPdk_hy.ins.roomInfoHy.roomUserId) {
                    AppGame.ins.showTips(ULanHelper.GAME_HY.CHECK_OUT_TIP);
                }
            } else {
                // 弹出结算界面 通知用户结算
                // this.emit(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_CLICK_GAME_RECORD);
            }
        } else {
            if (data.errorMsg && this.roomInfoHy.roomUserId == AppGame.ins.roleModel.useId) {
                AppGame.ins.showTips(data.errorMsg);
            }
        }
    }

    // 玩家状态切换
    private onNotifyChangeUserStatus(data: any): void {
        UDebug.log('一局结算后，玩家状态切换')
        // if(data.ret)
        // this.setRoomPlayersInfo();
        //设置玩家状态
        for (let i = 0; i < data.status.length; i++) {
            let status = data.status[i];
            let chairId = AppGame.ins.fPdkModel.getUIChairId(i);//this.getbattleplayerbyChairId(i);
            let pl = this.getbattleplayerbyChairId(chairId);
            if (pl) {
                pl.userStatus = status;
            }
        }
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_CHANGE_USER_STATUS, data);

    }

    // 通知玩家解散房间
    private onNotifyDissmisResult(data: any): void {
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_DISSMIS_ROOM, data);
    }

    // 通知玩家预解散房间
    private onNotifyPreDissmisResult(data: any): void {
        //准备旁观的都取消掉
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                let player = this._battleplayer[key];
                if (player.userStatus == 4 || player.userStatus == 7) {
                    player.userStatus = 3;
                }
            }
        }
        this.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_UPDATE_PLAYERS_EVENT, this._battleplayer);
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_PRE_DISSMIS_ROOM, data);
    }

    // 再来一轮
    private onNotifyAgainResult(data: any): void {
        if (data.retCode == 0) {
            this.emit(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_AGAIN_GAME, data);
            if(data.hasOwnProperty("roomInfo")) {
                pdk_Main_hy.ins.waitAgain.active = false;
                this.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_ROOM_USER_CLICK_AGAIN_GAME, data);
                if(AppGame.ins.roleModel.useId != data.userId) { // 其他玩家弹出提示
                    AppGame.ins.showTips(ULanHelper.GAME_HY.THE_HOMEOWNER_DECIDES_TO_HAVE_ANOTHER_ROUND);
                }
                for (const key in this._battleplayer) {
                    if (this._battleplayer.hasOwnProperty(key)) {
                        const element = this._battleplayer[key];
                        element.score = 0;
                    }
                }
                this._roomInfoHy = data.roomInfo;
                let msg_free_data = {
                    roomInfo: data.roomInfo,
                    discore: 1,
                    playerinfo: [{
                        chairID: 0,
                        status: this.getbattleplayerbyChairId(0) == null?0:this.getbattleplayerbyChairId(0).userStatus,
                        score: 0,
                    }, {
                        chairID: 1,
                        status: this.getbattleplayerbyChairId(1) == null?0:this.getbattleplayerbyChairId(1).userStatus,
                        score: 0,
                    }, {
                        chairID: 2,
                        status: this.getbattleplayerbyChairId(2) == null?0:this.getbattleplayerbyChairId(2).userStatus,
                        score: 0,
                    }],
                }
                this.onGameSceneFree(msg_free_data);
            } 
        } else if(data.retCode == 2) {
            if (data.userId == this.roomInfoHy.roomUserId) {
                AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                    type: EMsgType.EOKAndCancel, data: data.errorMsg, handler: UHandler.create((a) => {
                        if (a) {
                            this.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_ROOM_CHARGE_ROOM_CARD);
                        }
                    }, this)
                });

            }
        } else {
            AppGame.ins.showTips(data.errorMsg);
        }
    }

    // 获取实时战绩
    private onNotifyGetGameRecord(data: any): void {
        this.emit(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_GET_GAME_RECORD, data);
    }

    // 15超时消息
    private onNotifyTimeOutResult(data: any): void {
        if (data.retCode == 0) {
            if(data.idleLeave <= 0) {
                AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                    type: EMsgType.EOK,
                    data: ULanHelper.GAME_HY.TIME_OUT,
                    handler: UHandler.create((v: boolean) => {
                        MPdk_hy.ins.exitGame();
                    })
                })
            } else {
                this.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SHOW_TIME_OUT, data);
            }
        }
    }

    // ip限制
    private onNotifyIpLimitResult(data: any): void {
        data.type = 1;
        if (data.retCode != 0) {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
        this._roomInfoHy.bIPLimit = data.bLimit;
        AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_SETTING_PANEL, data);
    }

    // 自动开局回调
    private onNotifyAutoStartResult(data: any): void {
        if(data.retCode == 0) {
            this.emit(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_AUTOSTART_MESSAGE_RESULT, data);
        }
    }

    // 聊天设置限制
    private onNotifyChatLimitResult(data: any): void {
        if(data.retCode == 0) {
            this.roomInfoHy.bChatLimit = data.bLimit;
            this.emit(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_SET_CHAT_LIMIT_RESULT, data);
        } else {
            AppGame.ins.showTips(data.errorMsg);
        }
    }


    /**游戏结束 */
    onGameEnd(data: any) {
        UDebug.Log("onGameEnd:" + JSON.stringify(data));
        this._state = EPDKState.Wait;
        this._roomInfoHy = data.roomInfo;
    }


    onNextExit(data: any) {

    }

    clearSelectPokers() {
        this.selectPokers = [];
        this.PromptIndex = 0;
        this.PromptList = [];
    }

    //提示大过上家的牌型
    getPrompt() {
        this.selectPokers = []
        var needChangeType = AppGame.ins.fPdkModel.firstOutCardType == CardType.PDKTYPE_WING_ONE ? true : false
        this.PromptList = this.pokerLibrary.searchByCards(this.otherOutPokers, this.handPokers,needChangeType)
        UDebug.Log("提示数据" + JSON.stringify(this.PromptList))
        if (this.PromptList.length > 0) {
            this.selectPokers = this.PromptList[this.PromptIndex];
            this.PromptIndex++;
            if (this.PromptIndex >= this.PromptList.length) {
                this.PromptIndex = 0;
            }
        }
        return this.selectPokers;
    }

    /*************** c_send *****************/
    // this.sendMsg(Ddz.SUBID.NN_SUB_C_CALL_BANKER, data);


    // 客户端主动发出牌
    onSendOutCards(type: number) {
        if (AppGame.ins.fPdkModel.selectPokers.length > 0) {
            var data = {
                cardtype: type,
                cards: AppGame.ins.fPdkModel.selectPokers,
            }
            AppGame.ins.fPdkModel.sendMsg(FPdk.SUBID.SUB_C_CHUPAI, data)
        }
    }

    /**过牌 */
    onSendPass() {
        var data = {}
        UDebug.Log("过牌消息");
        AppGame.ins.fPdkModel.sendMsg(FPdk.SUBID.SUB_C_PASS, data)
    }

    /**
     * 发送聊天内容
     * @param faceId 表情ID
     * @param msgbody 消息内容 文本
     * @param type 消息类型 type = 1 常用语音文字 type = 2 表情， type = 3 自定义的输入文本
     */
    onSendChartMessage(faceId: number, msgbody: string, type: number = 3) {
        // var data = new FPdk.CMD_C_ChartMessage();
        var data = {
            message: msgbody,
            faceId: faceId,
            type: type,
        }
        AppGame.ins.fPdkModel.sendMsg(FPdk.SUBID.SUB_C_MESSAGE, data);
    }

    //托管
    sendTrust(isFlag: number) {
        var data = {
            istuoguan: isFlag
        }
        this.sendMsg(FPdk.SUBID.SUB_C_TUOGUAN, data);
    }

    /**准备 */
    sendReady() {
        this.sendMsg(FPdk.SUBID.SUB_C_READY, {});
    }

    /**旁观 */
    sendLookOn() {
        this.sendMsg(FPdk.SUBID.SUB_C_LOOKON, {});
    }

    /**下局旁观 */
    sendLookOnNext(isLookOn: boolean) {
        /*this.sendMsg(FPdk.SUBID.NN_SUB_C_NEXT_LOOKON, {
            bLookon: isLookOn
        });*/
    }

    /**结算 */
    sendCheckout() {
        this.sendMsg(FPdk.SUBID.SUB_C_CONCLUDE, {});
    }

    /**再来一轮 */
    sendAgain() {
        this.sendMsg(FPdk.SUBID.SUB_C_AGAIN, {});
    }

    // 解散房间
    sendDissmisRoom() {
        // this.sendMsg(FPdk.SUBID.SUB_C_DISSMIS, {});
    }

    // 发送获取战绩记录
    sendGetGameRecord() {
        this.sendMsg(FPdk.SUBID.SUB_C_GET_GAME_REOCRD, {});
    }

    // 发送聊天限制
    sendSetChatLimit(bLimit: boolean = false) {
        let data = new FPdk.CMD_C_ChatLimitMessage();
        data.bLimit = bLimit;
        this.sendMsg(FPdk.SUBID.SUB_C_SET_CHAT_LIMIT, data)
    }

    // sendSetIpLimit() {
    //     this.sendMsg(FPdk.SUBID.SUB_C_GET_GAME_REOCRD, {});
    // }

    /**
    * 点击设置界面按钮请求
    * @param type 1、点击ip限制 2、点击控制带入 3、点击自动开局
    */
    sendSettingToggleRequest(type: number, bLimit: boolean = false, autoStartNum: number = 2) {
        switch (type) {
            case 1:
                MPdk_hy.ins.sendMsg(FPdk.SUBID.SUB_C_SET_IP_LIMIT, { bLimit: bLimit });
                break;
            case 3:
                MPdk_hy.ins.sendMsg(FPdk.SUBID.SUB_C_SET_AUTO_START, { autoStartNum: autoStartNum });
                break;
            case 4:
                MPdk_hy.ins.sendMsg(FPdk.SUBID.SUB_C_SET_CHAT_LIMIT, { bLimit: bLimit });
                break;
            default:
                break;
        }
    }

    /**根据真实玩家位置获取玩家信息 */
    getbattleplayerbyChairId(chairId: number): RoomPlayerInfo {
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

    setPlayerInfo(data: any) {
        this._myPlayer.touxiang = data.touxiang;
        this._myPlayer.nickname = data.nickname;
        this._myPlayer.coin = data.coin;
        this._myPlayer.userid = data.userid;
    }

    getPlayerInfo(): any {
        return this._myPlayer;
    }
    /**服务器坐标转换本地坐标 */
    getUISeatId(wChairId: number): number {
        if (wChairId > this._MaxPlayer)
            return null;

        if (this._wMeChairId == null)//自己
            return wChairId;

        var wViewChairID = wChairId + this._MaxPlayer - this._wMeChairId; //+1
        return wViewChairID % this._MaxPlayer;  //+ 1
    }

    /**本地坐标转换服务器坐标 */
    getUIChairId(seatId: number): number {
        if (seatId > this._MaxPlayer) {
            return null;
        }
        if (this._wMeChairId == null)
            return seatId;

        var wViewChairID = seatId + this._wMeChairId; //+1

        UDebug.log("seatId: " + seatId + "  meChairId: " + this._wMeChairId + "  wViewChairID: " + wViewChairID);

        return wViewChairID % this._MaxPlayer;  //+ 1    

    }


    /**获取刚进房间时候 显示自己的信息 */
    getshowselfinfo(): RoomPlayerInfo {
        let bb = new RoomPlayerInfo();
        bb.nickName = AppGame.ins.roleModel.useId.toString();
        bb.headId = AppGame.ins.roleModel.headId;
        bb.score = AppGame.ins.roleModel.score;
        bb.headboxId = AppGame.ins.roleModel.headboxId;
        bb.vipLevel = AppGame.ins.roleModel.vipLevel;
        return bb;
    }
}
