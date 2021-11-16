import Model from "../../../common/base/Model";
import { RoomInfo, RoomInfoHy, RoomPlayerInfo } from "../../../public/hall/URoomClass";
import AppGame from "../../../public/base/AppGame";
import UTBNNHelper_hy, { ETBNNState, TBNNBattlePlayerInfo } from "../UTBNNHelper_hy";
import MBaseGameModel from "../../../public/hall/MBaseGameModel";
import { FTbnn, Game, GameFriendServer } from "../../../common/cmd/proto";
import UHandler from "../../../common/utility/UHandler";
import UMsgCenter from "../../../common/net/UMsgCenter";
import { EGameType, ELeftType, ELevelType, ECommonUI, ERoomKind, EMsgType } from "../../../common/base/UAllenum";
import cfg_head from "../../../config/cfg_head";
import UDebug from "../../../common/utility/UDebug";
import ULanHelper from "../../../common/utility/ULanHelper";
import { MAX_COUNT, OX_FIVE_SMALL, OX_GOLDEN_BULL, OX_BOMB, OX_SILVERY_BULL, OX_VALUE0 } from "./../UTBNNHelper_hy";
import AppStatus from "../../../public/base/AppStatus";

/**qznn 自己ui的位置 */
export const TBNN_SELF_SEAT = 0;

export default class MTBNNModel_hy extends Model {

    static TBNN_GAMESTATUS = {
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

    /**数值掩码 */
    public static LOGIC_MASK = {
        COLOR: 240,//0xf0
        VALUE: 15  //0x0f
    };

    /**大致的牌值 */
    public _M_CARDLISTDATA: number[] = [
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, //方块Diamond
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, //梅花Club
        0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, //红桃Heart
        0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, //黑桃Spade
        0x4E, 0x4F
    ];

    static CARDTYPE_NAME = {
        [0]: "没牛",
        [1]: "牛一",
        [2]: "牛二",
        [3]: "牛三",
        [4]: "牛四",
        [5]: "牛五",
        [6]: "牛六",
        [7]: "牛七",
        [8]: "牛八",
        [9]: "牛九",
        [10]: "牛牛",
        [11]: "四花牛",//"银牛"
        [12]: "四炸",//"炸弹牛"
        [13]: "五花牛",//"金牛"
        [14]: "五小牛",
    }

    static CARDCOLOR_NAME = {
        [0]: "方块",
        [1]: "梅花",
        [2]: "红桃",
        [3]: "黑桃",
        [4]: "王",
    }

    static CARDVALUE_NAME = {
        [1]: "A",
        [2]: "2",
        [3]: "3",
        [4]: "4",
        [5]: "5",
        [6]: "6",
        [7]: "7",
        [8]: "8",
        [9]: "9",
        [10]: "10",
        [11]: "J",
        [12]: "Q",
        [13]: "K",
        [14]: "BlackJoker",
        [15]: "RedJoker",
    }

    static s_ins: MTBNNModel_hy;
    static get ins(): MTBNNModel_hy {
        if (MTBNNModel_hy.s_ins == null) {
            MTBNNModel_hy.s_ins = new MTBNNModel_hy();
            MTBNNModel_hy.s_ins.init();
        }
        return MTBNNModel_hy.s_ins;
    }

    /************************/

    /**房间信息 */
    private _roomInfo: RoomInfo;
    /**重连在房间内,但服务器上的房间已结束 */
    private _reconnectInRoomWithNoGame: boolean = false;
    /**返回大厅 */
    private _retrunLobby: boolean = false;
    /**庄家索引 */
    private _bankerIndex: number = null;
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

    /**该游戏最大人数 */
    private _MaxPlayer: number = 4;
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

    // private _roomPlayers = {}
    // get groomPlayers(): {} {
    //     return this._roomPlayers;
    // }

    // set sroomPlayers(roomPlayers: any) {
    //     this._roomPlayers = roomPlayers;
    // }
    /********************加匹配后改的 **/

    /**uipos 转换 玩家id */
    private uiposToUserId: { [key: number]: number };

    protected get selfUserId(): number {
        return AppGame.ins.roleModel.useId;
    }

    /**游戏状态 */
    private _state: ETBNNState = ETBNNState.Wait;

    /**本局的玩家 */
    private _battleplayer: { [key: number]: TBNNBattlePlayerInfo };

    get gBattlePlayer(): { [key: number]: TBNNBattlePlayerInfo } {
        return this._battleplayer;
    }
    /**
     * 游戏结束的时候copy一份用，因为代码里面延迟执行了 当延迟的时候会造成数据的不一致
     */
    get CopyBattlePlayer(): { [key: number]: TBNNBattlePlayerInfo } {
        let data = {};
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                const element = this._battleplayer[key];
                data[key] = element;
            }
        }
        return data;
    }
    /**获得玩家字典长度 */
    private getBattlePlayerLength(): number {
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
    /**是否看过防以小博大提示 */
    isseen_fyxbd: boolean = false;

    get roomInfo(): RoomInfo {
        return this._roomInfo;
    }

    get gameState(): ETBNNState {
        return this._state;
    }

    /** 1-round ,2-time*/
    roomType: number = 2;
    /**好友房房间信息 */
    private _roomInfoHy: RoomInfoHy;
    get roomInfoHy(): RoomInfoHy {
        return this._roomInfoHy;
    }
    set roomInfoHy(v: RoomInfoHy) {
        this._roomInfoHy = v;
    }
    /**是否过了空闲场景 */
    isOverFreeScene: boolean = false;
    /**是否房主再来一轮 */
    isHostAgain: boolean = true;
    /**是否自己再来一轮 */
    isSelfAgain: boolean = true;

    init(): void {
        this.qznnRegest();
    }
    resetData(): void {
        this.isSelfAgain = true;
        this.isHostAgain = true;
        this.isOverFreeScene = false;
    }

    update(dt: number): void {

    }

    run(): void {
        super.run();
        this._retrunLobby = false;
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.user_status_notify, this);

        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
    }
    
    exit(): void {
        super.exit();
        this.resetData();
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.user_status_notify, this);

        this.unregesterMsg(FTbnn.SUBID.SC_GAMESCENE_FREE, new UHandler(this.onGameSceneFree, this));
        //this.regesterMsg(FTbnn.SUBID.SC_GAMESCENE_CALL, new UHandler(this.onGameSceneCall, this)); //叫庄场景
        this.unregesterMsg(FTbnn.SUBID.SC_GAMESCENE_SCORE, new UHandler(this.onGameSceneScore, this));
        this.unregesterMsg(FTbnn.SUBID.SC_GAMESCENE_OPEN, new UHandler(this.onGameSceneOpen, this));
        this.unregesterMsg(FTbnn.SUBID.SC_GAMESCENE_END, new UHandler(this.onGameSceneEnd, this));

        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_ADD_SCORE_RESULT, new UHandler(this.onAddScoreResult, this));
        //this.regesterMsg(FTbnn.SUBID.NN_SUB_S_CALL_BANKER, new UHandler(this.onCallBanker, this)); //叫庄
        //this.regesterMsg(FTbnn.SUBID.NN_SUB_S_CALL_BANKER_RESULT, new UHandler(this.onCallBankerResult, this)); //叫庄结果
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_GAME_END, new UHandler(this.onGameEnd, this));
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_GAME_START, new UHandler(this.onGameStart, this));
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_OPEN_CARD_RESULT, new UHandler(this.onOpenCardResult, this));
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_SEND_CARD, new UHandler(this.onSendCard, this));

        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_READY_RESULT, new UHandler(this.onReady, this)); //准备
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_MESSAGE_RESULT, new UHandler(this.onChatMessage, this));  //聊天消息
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_AGAIN_RESULT, new UHandler(this.onPlayAgain, this));  //再来一轮
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_PRE_DISSMIS_RESULT, new UHandler(this.onPreDismiss, this));  //预解散房间
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_DISSMIS_RESULT, new UHandler(this.onDismiss, this));  //解散房间
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_LOOKON_RESULT, new UHandler(this.onLookOn, this));  //旁观
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_CONCLUDE_RESULT, new UHandler(this.onAheadCheckout, this));  //提前结算
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_CHANGE_USER_STATUS, new UHandler(this.onCheckoutChangeStatus, this));  //一局结算后，玩家状态切换
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_IDLE_TIMEOUT_RESULT, new UHandler(this.onTimeOutResult, this)); //15分钟超时消息

        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_SET_IP_LIMIT_RESULT, new UHandler(this.onIpLimit, this));  //ip限制
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_SET_SCORE_LIMIT_RESULT, new UHandler(this.onBringInLimit, this));  //控制带入
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_C_SET_CHAT_LIMIT_RESULT, new UHandler(this.onChatLimit, this));  //聊天限制
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_SET_PLAYER_NUM_LIMIT_RESULT, new UHandler(this.onPlayerNumLimit, this));  //开局人数
        this.unregesterMsg(FTbnn.SUBID.NN_SUB_S_SET_AUTO_START_RESULT, new UHandler(this.onAutoStartLimit, this));  //自动开局

        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);

        this._roomInfo = null;
        this._roomInfoHy = null;
        this._battleplayer = {};
        this._wMeChairId = null;
    }

    //#region 协议相关
    qznnRegest() {
        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_IDLE_TIMEOUT_RESULT, new UHandler(this.onTimeOutResult, this)); //15分钟超时消息

        this.regesterMsg(FTbnn.SUBID.SC_GAMESCENE_FREE, new UHandler(this.onGameSceneFree, this));
        //this.regesterMsg(FTbnn.SUBID.SC_GAMESCENE_CALL, new UHandler(this.onGameSceneCall, this)); //叫庄场景
        this.regesterMsg(FTbnn.SUBID.SC_GAMESCENE_SCORE, new UHandler(this.onGameSceneScore, this));
        this.regesterMsg(FTbnn.SUBID.SC_GAMESCENE_OPEN, new UHandler(this.onGameSceneOpen, this));
        this.regesterMsg(FTbnn.SUBID.SC_GAMESCENE_END, new UHandler(this.onGameSceneEnd, this));

        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_ADD_SCORE_RESULT, new UHandler(this.onAddScoreResult, this));
        //this.regesterMsg(FTbnn.SUBID.NN_SUB_S_CALL_BANKER, new UHandler(this.onCallBanker, this)); //叫庄
        //this.regesterMsg(FTbnn.SUBID.NN_SUB_S_CALL_BANKER_RESULT, new UHandler(this.onCallBankerResult, this)); //叫庄结果
        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_GAME_END, new UHandler(this.onGameEnd, this));
        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_GAME_START, new UHandler(this.onGameStart, this));
        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_OPEN_CARD_RESULT, new UHandler(this.onOpenCardResult, this));
        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_SEND_CARD, new UHandler(this.onSendCard, this));

        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_READY_RESULT, new UHandler(this.onReady, this));  //准备
        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_MESSAGE_RESULT, new UHandler(this.onChatMessage, this));  //发送消息
        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_AGAIN_RESULT, new UHandler(this.onPlayAgain, this));  //再来一轮
        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_PRE_DISSMIS_RESULT, new UHandler(this.onPreDismiss, this));  //预解散房间
        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_DISSMIS_RESULT, new UHandler(this.onDismiss, this));  //解散房间
        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_LOOKON_RESULT, new UHandler(this.onLookOn, this));  //旁观
        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_CONCLUDE_RESULT, new UHandler(this.onAheadCheckout, this));  //提前结算
        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_CHANGE_USER_STATUS, new UHandler(this.onCheckoutChangeStatus, this));  //一局结算后，玩家状态切换

        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_SET_IP_LIMIT_RESULT, new UHandler(this.onIpLimit, this));  //ip限制
        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_SET_SCORE_LIMIT_RESULT, new UHandler(this.onBringInLimit, this));  //控制带入
        this.regesterMsg(FTbnn.SUBID.NN_SUB_C_SET_CHAT_LIMIT_RESULT, new UHandler(this.onChatLimit, this));  //聊天限制
        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_SET_PLAYER_NUM_LIMIT_RESULT, new UHandler(this.onPlayerNumLimit, this));  //开局人数
        this.regesterMsg(FTbnn.SUBID.NN_SUB_S_SET_AUTO_START_RESULT, new UHandler(this.onAutoStartLimit, this));  //自动开局
        
    }

    onGameToBack(isBack: boolean) {
        if (!isBack) {
            MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_RESET_SCENE);
            this.sendMsg(FTbnn.SUBID.CS_GAMESCENE_FRESH, {});
        }
    }

    /**注册qznn网络消息事件 */
    regesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.regester(EGameType.TBNN_HY,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            subId,
            handler);
    }

    unregesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.unregester(EGameType.TBNN_HY,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            subId,
            handler);
    }

    /** 发送网络消息*/
    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(EGameType.TBNN_HY,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            subId, data, handler, unlock);
    }

    /**玩家状态 */
    private user_status_notify(userid: number, usstatus: number) { //data: GameServer.MSG_S2C_GameUserStatus
        var userId = userid;
        var usStatus = usstatus;
        if (usStatus == null || usStatus == 0) {
            if (this._battleplayer && this._battleplayer[userId]) {
                if (userId != AppGame.ins.roleModel.useId) {
                    this._battleplayer[userId].isExit = true
                } else {
                    // AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                    //         type: EMsgType.EOK,
                    //         data: ULanHelper.GAME_HY.STATUS_ERROR,
                    //         handler: UHandler.create((v: boolean) => {
                    //             v && MTBNNModel_hy.ins.exitGame();
                    //         })
                    //     })
                }
            }
        }
        else {//if(data.usStatus > 0)
            if (this._battleplayer && this._battleplayer[userId]) {
                this._battleplayer[userId].playStatus = usStatus;
            }
        }
        this.updateBattlePlayer();

        if ((userId == this.selfUserId && this._dataSceneTemp != null && this._sceneNum > 0 && this._isWaitGameServerMsg)
            || (this._battleplayer != null && this.getBattlePlayerLength() == 4 && this._isWaitGameServerMsg)) {
            this._isWaitGameServerMsg = false;

            this.handleWaitGameMsg(this._sceneNum, this._dataSceneTemp);
        }
    }

    /************* scene *****************/

    /**重新执行相应的场景消息 */
    private handleWaitGameMsg(sceneMask: number, data: any) {
        switch (sceneMask) {
            // case 1: {
            //     this.onGameSceneCall(data);
            // }
            //     break;
            case 2: {
                this.onGameSceneScore(data);
            }
                break;
            case 3: {
                this.onGameSceneOpen(data);
            }
                break;
        }
    }

    /**
     * 设置所有场景内玩家状态
     * @param gameStatus MTBNNModel_hy.TBNN_GAMESTATUS状态
     * @param state ETBNNState状态
     * @param cbPlayStatus 各玩家状态
     */
    private setAllSceneStatus(gameStatus: number, state: ETBNNState, cbPlayStatus?: number[]) {
        //赋值房间内玩家状态
        if (cbPlayStatus != null) {
            let len = cbPlayStatus.length;
            for (let i = 0; i < len; i++) {
                let status = cbPlayStatus[i];
                let pl = this.getbattleplayerbyChairId(i);
                if (pl) {
                    pl.playStatus = status;
                }
            }
        }
        //默认赋状态 旁观 自由人
        this._state = ETBNNState.Watching;
        this._gameStatus = MTBNNModel_hy.TBNN_GAMESTATUS.FREE;
        //如果是上座玩牌玩家，重新赋状态
        if (this._battleplayer[this.selfUserId] != null
            && this._battleplayer[this.selfUserId].playStatus == 5) {
            this._state = state;//ETBNNState.Gameing;
            this._gameStatus = gameStatus;//MTBNNModel_hy.TBNN_GAMESTATUS.CALL;
        }
    }
    /**设置房间内玩家信息 */
    private setRoomPlayersInfo() {
        //房间内位置存储
        // if (!this.uiposToUserId) this.uiposToUserId = {};
        this.uiposToUserId = {};
        //找自己的id
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                const element = this._battleplayer[key];
                if (element.userId == AppGame.ins.roleModel.useId) {
                    this._wMeChairId = element.chairId;
                    break;
                }
            }
        }

        //玩家信息更新
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                const element = this._battleplayer[key];

                element.seatId = this.getUISeatId(element.chairId);
                this.uiposToUserId[element.seatId] = element.userId;
            }
        }
    }

    public updateBattlePlayer() {
        this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_UPDATE_PLAYERS_EVENT, this._battleplayer);
    }

    private onGameSceneFree(data: any) {
        // this.emit(TBNN_UPDATE_PLAYERS_EVENT, this._roomPlayers);
        this.setRoomHyInfo(data);

        if (this._state != ETBNNState.Match) {
            this._state = ETBNNState.Wait;
        }

        this._gameStatus = MTBNNModel_hy.TBNN_GAMESTATUS.FREE;

        this.setRoomPlayersInfo();

        var ishideContinue = false;

        if (this._state == ETBNNState.Match) {
            ishideContinue = true;
        }

        this.emit(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_FREE, data, ishideContinue);
        this.updateBattlePlayer();
        // this.dispatchSceneMsg(data);
        this.isOverFreeScene = true;
    }

    // onGameSceneCall(data: any) {
    //     if (this._battleplayer == null) {
    //         this._dataSceneTemp = data;
    //         this._sceneNum = 1;
    //         this._isWaitGameServerMsg = true;
    //         return;
    //     }


    //     var cbPlayStatus = data.cbPlayStatus;//游戏中玩家(1打牌玩家)[]
    //     var cbTimeLeave = data.cbTimeLeave;//剩余时间
    //     var roomId = data.roundId || 0;//牌局编号

    //     this._currentDizhu = data.dCellScore || 1;
    //     this.setRoomPlayersInfo();


    //     this.setAllSceneStatus(MTBNNModel_hy.TBNN_GAMESTATUS.CALL, ETBNNState.Gameing, cbPlayStatus);
    //     this.emit(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_CALL, data);
    //     this.updateBattlePlayer();
    //     this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_UPDATE_ROOMID, roomId);

    //     this._dataSceneTemp = null;
    //     this._sceneNum = 0;
    // }

    onGameSceneScore(data: FTbnn.NN_MSG_GS_SCORE) {
        this.setRoomHyInfo(data);

        if (this._battleplayer == null) {
            this._dataSceneTemp = data;
            this._sceneNum = 2
            this._isWaitGameServerMsg = true;
            return;
        }
        var cbPlayStatus = data.playStatus;//游戏中玩家(1打牌玩家) []
        var roomId = data.roundId || 0;//牌局编号
        this.setRoomPlayersInfo();
        this.setAllSceneStatus(MTBNNModel_hy.TBNN_GAMESTATUS.SCORE, ETBNNState.Gameing, cbPlayStatus);
        this.emit(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_SCORE, data);
        this.updateBattlePlayer();
        this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_UPDATE_ROOMID, roomId);
        this._dataSceneTemp = null;
        this._sceneNum = 0;
    }

    onGameSceneOpen(data: FTbnn.NN_MSG_GS_OPEN) {
        this.setRoomHyInfo(data);

        if (this._battleplayer == null) {
            this._dataSceneTemp = data;
            this._sceneNum = 3;
            this._isWaitGameServerMsg = true;
            return;
        }

        var cbPlayStatus = data.playStatus;//游戏中玩家(1打牌玩家)[]
        var roomId = data.roundId || 0;//牌局编号

        this.setRoomPlayersInfo();
        this.setAllSceneStatus(MTBNNModel_hy.TBNN_GAMESTATUS.OPEN, ETBNNState.Gameing, cbPlayStatus);
        this.emit(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_OPEN, data);
        this.updateBattlePlayer();
        this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_UPDATE_ROOMID, roomId);
        this._dataSceneTemp = null;
        this._sceneNum = 0;
    }

    onGameSceneEnd(data: FTbnn.NN_MSG_GS_END) {
        this.setRoomHyInfo(data);
        this._sceneNum = 0;
        this._currentDizhu = data.cellScore || 1;
        this._state = ETBNNState.Wait;
        UDebug.log('End Scene!!!')
        this.emit(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_END, data);
    }

    /**设置好友房信息 */
    setRoomHyInfo(data: any) {
        if(!data.roomInfo) return;
        this._roomInfoHy = data.roomInfo;
        if (data.roomInfo.allRound > 0) {
            MTBNNModel_hy.ins.roomType = 1;
        } else if (data.roomInfo.allSeconds > 0) {
            MTBNNModel_hy.ins.roomType = 2;
        }
    }

    // onGameSceneEnd(data) {
    //  this.emit(TBNN_SC_GAMESCENE_END, data);
    // }

    /*********** hall event ***************/
    private onUserEnterNotify(data: any) {
        let player = new RoomPlayerInfo();
        player.account = data.account || "";
        player.chairId = data.chairId || 0;
        player.headId = data.headIndex || 0;
        player.location = data.location || "";
        player.nickName = data.nickName || "";
        player.score = data.score || 0;
        player.tableId = data.tableId || 0;
        player.userId = data.userId || 0;
        player.userStatus = data.userStatus || 0;
        let cfg = cfg_head[data.headIndex];
        player.sex = cfg.sex;

        this.sc_ts_room_playerinfo(player);

        // var temp = JSON.parse(JSON.stringify(this._roomPlayers));

        // for (const key in this._roomPlayers) {
        //     if (this._roomPlayers.hasOwnProperty(key)) {
        //         const element = this._roomPlayers[key];
        //         if (element.userId == player.userId) {
        //             // temp = null;

        //             return;
        //         }
        //     }
        // }

        // this._roomPlayers[player.chairId] = player;

        // this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_UPDATE_PLAYERS_EVENT, this._roomPlayers);
    }

    /**玩家进入房间 */
    private sc_ts_room_playerinfo(data: any) {
        this.add_battle_player(data);
        this.updateBattlePlayer();
    }

    private add_battle_player(element: RoomPlayerInfo): TBNNBattlePlayerInfo {
        if (!this._battleplayer) this._battleplayer = {};
        let item = new TBNNBattlePlayerInfo();
        for (const key1 in element) {
            if (element.hasOwnProperty(key1)) {
                const el = element[key1];
                item[key1] = el;
            }
        }
        item.userTotal = 0;
        item.playTurn = 0;
        item.isturn = false;
        // item.isFirst = false;
        // item.paiState = ESGBattlePlayerPaiState.none;
        // item.auto = false;
        item.pai = [];
        item.cdtime = 0;
        // item.seatId = this.getUISeatId(item.chairId);
        item.seatId = 0;
        item.playStatus = element.userStatus
        item.headImgUrl = element.headImgUrl

        //把之前重的id删掉
        var hasDelId = -1;
        let isInRoom = false; //当前玩家是否已经在游戏中
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                const element = this._battleplayer[key];
                if (element.userId == item.userId) {
                    isInRoom = true;
                }
                if (element && item && element.chairId == item.chairId) {
                    hasDelId = element.userId;
                    break;
                }                
            }
        }

        if (!isInRoom && this.isOverFreeScene) {
            AppGame.ins.showTips(`欢迎玩家 ${item.userId} 加入游戏`);
        }

        if (hasDelId != null && hasDelId != -1) {
            delete this._battleplayer[hasDelId];
        }

        this._battleplayer[item.userId] = item;
        this.setRoomPlayersInfo();
        // if (!this.uiposToUserId) this.uiposToUserId = {};
        // this.uiposToUserId[item.seatId] = item.userId;
        return item;
    }

    /**玩家离开房间 */
    private sc_ts_player_left_room(data: any) {
        if (data.retCode == 0) {

            if (data.type == ELeftType.ReturnToRoom) {
                if (this._state != ETBNNState.AlreadyLeft) {
                    this._state = ETBNNState.AlreadyLeft;
                    // if (this._roomInfo) {
                    //     AppGame.ins.loadLevel(ELevelType.Hall, this._roomInfo.gameId);
                    //     //AppGame.ins.backHall();
                    // } else {
                    //     AppGame.ins.loadLevel(ELevelType.Hall);
                    // }
                }
                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.TBNN_HY);
            } else if (data.type == ELeftType.CancleMatch) {
                this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_TS_CANCLE_MATCH, true);
                this._state = ETBNNState.Wait;
            } else if (data.type == ELeftType.LeftGame) {
                this._battleplayer = {};
                this.uiposToUserId = {};
                this._currentDizhu = 0;
                this._wMeChairId = 0;
                this._state = ETBNNState.Match;
                // AppGame.ins.roomModel.requestMatch();
                this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_TS_START_MATCH, true);
            }

        }
        else {
            this._retrunLobby = false;
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
            return
            if (data.type == ELeftType.ReturnToRoom) {
                this._retrunLobby = false;
                data.errorMsg && AppGame.ins.showTips(data.errorMsg);
            }
            else if (data.type == ELeftType.CancleMatch) {
                if (this._state != ETBNNState.Gameing) {
                    this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_TS_CANCLE_MATCH, false);
                }

                if (data.errorMsg) {
                    AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
                    // AppGame.ins.showUI(ECommonUI.MsgBox, { type: 1, data: ULanHelper.SG_CANT_EXIT_GAME });
                }

            } else if (data.type == ELeftType.LeftGame) {

                this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_TS_START_MATCH, false);
            }

        }
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
        switch (this._state) {
            case ETBNNState.Gameing:
            case ETBNNState.LeftGame:
                {
                    if (this.getbattleplayerbySeatId(0).playStatus == 5) {
                        AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
                    } else {
                        this._retrunLobby = true;
                        AppGame.ins.gamebaseModel.requestLeftHy(this._roomInfoHy.gameId, this._roomInfoHy.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                    }
                }
                break;
            case ETBNNState.AlreadyLeft:
            case ETBNNState.Watching:
            case ETBNNState.Match:
            case ETBNNState.Wait:
                {
                    if (this._roomInfoHy && !this._reconnectInRoomWithNoGame) {
                        this._retrunLobby = true;
                        AppGame.ins.gamebaseModel.requestLeftHy(this._roomInfoHy.gameId, this._roomInfoHy.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                    } else {
                        AppGame.ins.loadLevel(ELevelType.Hall, EGameType.TBNN_HY);
                    }
                }
                break;
        }
    }

    /**
     * 取消匹配
     */
    cancleMatch(): void {
        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.CancleMatch);
    }

    /**
     * 断线重连上了 游戏结束之后 直接发起匹配
     */
    reconnectRequest(): void {
        this._state = ETBNNState.Match;
        AppGame.ins.roomModel.requestMatch();
    }

    /**匹配 */
    requestMatch(): void {
        if (this._retrunLobby) return;
        if (this._state == ETBNNState.LeftGame) {
            return;
        }
        this._state = ETBNNState.LeftGame;
        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.LeftGame);

        // this._battleplayer = {};
        // this.uiposToUserId = {};
        // this._currentDizhu = 0;

        // this._state = ETBNNState.Match;
        // AppGame.ins.roomModel.requestMatch();
    }

    /**
     * 发送聊天消息
     * @param faceId 表情
     * @param msgbody 消息
     */
    sendChatMsg(faceId: number, msgbody: string, type: number) {
        let data = {
            message: msgbody,
            faceId: faceId,
            type: type
        }
        MTBNNModel_hy.ins.sendMsg(FTbnn.SUBID.NN_SUB_C_MESSAGE, data);
    }

    /************* s_event **************/

    /**超时 */
    private onTimeOutResult(data: any) {
        if (data.retCode == 0) {
            if (data.idleLeave <= 0) {
                AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                    type: EMsgType.EOK,
                    data: ULanHelper.GAME_HY.TIME_OUT,
                    handler: UHandler.create((v: boolean) => {
                        MTBNNModel_hy.ins.exitGame();
                    })
                })
            } else {
                this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SHOW_TIME_OUT, data);
            }
        }
    }

    /**准备 */
    private onReady(data: any) {
        if (data.retCode == 0) {
            if (this._battleplayer && this.getbattleplayerbyChairId(data.chairId)) {
                this.getbattleplayerbyChairId(data.chairId).playStatus = data.status;
                this.updateBattlePlayer();
                if (this._wMeChairId == data.chairId) {
                    AppGame.ins.showTips(ULanHelper.GAME_HY.STATUS_READY);
                }
            }
        } else {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
    }

    /**旁观 */
    private onLookOn(data: any) {
        if (data.retCode == 0) {
            if (this._battleplayer && this.getbattleplayerbyChairId(data.chairId)) {
                this.getbattleplayerbyChairId(data.chairId).playStatus = data.status;
                this.updateBattlePlayer();
                if (this._wMeChairId == data.chairId) {
                    AppGame.ins.showTips(ULanHelper.GAME_HY.STATUS_LOOK_ON);
                }
            }
        } else {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
    }

    /**聊天消息 */
    private onChatMessage(data: any) {
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                const player = this._battleplayer[key];
                if (player.userId == data.sendUserId) {
                    data.headerId = player.headId;
                    data.headImgUrl = player.headImgUrl;
                    data.nickName = player.nickName;
                    AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_CHAT_MESSAGE, data);
                }
            }
        }
        this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_CHAT_MESSAGE, data)
    }

    /**再来一轮 */
    private onPlayAgain(data: any) {
        if (data.retCode == 0) {
            if (data.userId == this.roomInfoHy.roomUserId && data.roomInfo) {
                this._roomInfoHy = data.roomInfo;
                this.isHostAgain = true;
                this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_HOST_AGAIN, data);
                AppGame.ins.showTips(ULanHelper.GAME_HY.THE_HOMEOWNER_DECIDES_TO_HAVE_ANOTHER_ROUND);
            }
            if (data.userId == AppGame.ins.roleModel.useId) {
                this.isSelfAgain = true;
                this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SELF_AGAIN, data);
                AppGame.ins.closeUI(ECommonUI.Game_record_tbnn_hy);
            }
            this._battleplayer[data.userId].score = data.score;
            this.updateBattlePlayer();
        } else if(data.retCode == 2) {
            if (data.userId == this.roomInfoHy.roomUserId) {
                AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                    type: EMsgType.EOKAndCancel, data: data.errorMsg, handler: UHandler.create((a) => {
                        if (a) {
                            AppGame.ins.hallModel.requestAgentLevel();
                        }
                        AppGame.ins.closeUI(ECommonUI.Game_record_tbnn_hy);
                    }, this)
                });
            }
        } else {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
    }

    /**预解散房间 */
    private onPreDismiss(data: any) {
        if (data.retCode == 0) {
            this.isSelfAgain = false;
            this.isHostAgain = false;
            //准备旁观的都取消掉
            for (const key in this._battleplayer) {
                if (this._battleplayer.hasOwnProperty(key)) {
                    let player = this._battleplayer[key];
                    player.playStatus = 3;
                }
            }
            this.updateBattlePlayer();
            this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_PRE_DISMISS, data);
            AppGame.ins.showBundleUI(ECommonUI.Game_record_tbnn_hy, EGameType.TBNN_HY, { reuse: true });
            if (this.roomInfoHy.roomUserId != AppGame.ins.roleModel.useId) {
                AppGame.ins.showTips(ULanHelper.GAME_HY.THE_IS_CONSIDERING_WHETHER_TO_COME_AGAIN_PLEASE_WAIT);
            }
        } else {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
    }

    /**解散房间 */
    private onDismiss(data: any) {
        if (data.retCode == 0) {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: EMsgType.EOK,
                data: data.retMsg,
                handler: UHandler.create((v: boolean) => {
                    MTBNNModel_hy.ins.exitGame();
                })
            })
        } else {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
    }

    /**提前结算 */
    private onAheadCheckout(data: any) {
        if (data.retCode == 0) {
            if (this._state == ETBNNState.Gameing) {
                AppGame.ins.showTips(ULanHelper.GAME_HY.CHECK_OUT_TIP);
            }
        } else {
            if (data.errorMsg && this.roomInfoHy.roomUserId == AppGame.ins.roleModel.useId) {
                AppGame.ins.showTips(data.errorMsg);
            }
        }
    }

    /**一局结算后，玩家状态切换 */
    private onCheckoutChangeStatus(data: any) {
        this.setRoomPlayersInfo();
        if (this.isHostAgain) {
            for (let i = 0; i < data.status.length; i++) {
                let status = data.status[i];
                let pl = this.getbattleplayerbyChairId(i);
                if (pl) {
                    pl.playStatus = status;
                }
            }
            this.updateBattlePlayer();
        }

        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_RESET_SCENE);
    }

    /**聊天限制 */
    private onChatLimit(data: any) {
        data.type = 4;
        if (data.retCode != 0) {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
        this._roomInfoHy.bChatLimit = data.bLimit;
        AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_SETTING_PANEL, data);
    }

    /**ip限制 */
    private onIpLimit(data: any) {
        data.type = 1;
        if (data.retCode != 0) {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
        this._roomInfoHy.bIPLimit = data.bLimit;
        AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_SETTING_PANEL, data);
    }

    /**控制带入 */
    private onBringInLimit(data: any) {
        data.type = 2;
        if (data.retCode != 0) {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
        this._roomInfoHy.bAddScoreLimit = data.bLimit;
        AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_SETTING_PANEL, data);
    }

    /**开局人数 */
    private onPlayerNumLimit(data: any) {
        data.type = 3;
        if (data.retCode != 0) {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
        this._roomInfoHy.playerNumLimit = data.playerNumLimit;
        AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_SETTING_PANEL, data);
    }

    /**自动开局 */
    private onAutoStartLimit(data: any) {
        data.type = 5;
        if (data.retCode != 0) {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
        this._roomInfoHy.autoStart = data.bAutoStart;
        AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_SETTING_PANEL, data);
    }

    /**
     * 点击设置界面按钮请求
     * @param type 1、点击ip限制 2、点击控制带入 3、点击自动开局 4、点击聊天限制
     */
    sendSettingToggleRequest(type: number, param: any) {
        switch (type) {
            case 1:
                MTBNNModel_hy.ins.sendMsg(FTbnn.SUBID.NN_SUB_C_SET_IP_LIMIT, { bLimit: param });
                break;
            case 2:
                MTBNNModel_hy.ins.sendMsg(FTbnn.SUBID.NN_SUB_C_SET_SCORE_LIMIT, { bLimit: param });
                break;
            case 5:
                MTBNNModel_hy.ins.sendMsg(FTbnn.SUBID.NN_SUB_C_SET_AUTO_START, { bAutoStart: param });
                break;
            case 4:
                MTBNNModel_hy.ins.sendMsg(FTbnn.SUBID.NN_SUB_C_SET_CHAT_LIMIT, { bLimit: param });
                break;
            case 3:
                MTBNNModel_hy.ins.sendMsg(FTbnn.SUBID.NN_SUB_C_SET_PLAYER_NUM_LIMIT, { playerNumLimit: param });
                break;
            default:
                break;
        }
    }

    /**游戏开始 */
    private onGameStart(data: any) {
        this.setRoomHyInfo(data);
        this._reconnectInRoomWithNoGame = false;
        var cbPlayStatus = data.playStatus;//[]
        var roomId = data.roundId || 0;//牌局编号
        // UDebug.Log("this._battleplayer:"+JSON.stringify(this._battleplayer));
        this.setRoomPlayersInfo();

        // var playerStatus = {};
        //设置玩家状态
        let len = cbPlayStatus.length;
        for (let i = 0; i < len; i++) {
            let status = cbPlayStatus[i];
            let pl = this.getbattleplayerbyChairId(i);
            // let localPos = this.getUISeatId(i);
            if (pl) {
                pl.playStatus = status;
                // playerStatus[localPos] = status;
            }
        }
        this._state = ETBNNState.Gameing;
        this.emit(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAME_START, data);
        this.updateBattlePlayer();
        this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_UPDATE_ROOMID, roomId);
    }

    /**叫庄 */
    // onCallBanker(data: any) {
    //     this.emit(UTBNNHelper_hy.TBNN_EVENT.TBNN_CALL_BANKER, data);
    //     this._state = ETBNNState.Gameing;

    // }

    // /**叫庄结果 */
    // onCallBankerResult(data: any) {
    //     this.emit(UTBNNHelper_hy.TBNN_EVENT.TBNN_CALL_BANKER_RESULT, data);
    //     this._state = ETBNNState.Gameing;

    // }

    /**下注结果 */
    onAddScoreResult(data: any) {  // private
        //    var wAddJettonUser = data.wAddJettonUser
        //    var cbJettonMultiple = data.cbJettonMultiple

        this.emit(UTBNNHelper_hy.TBNN_EVENT.TBNN_ADD_SCORE_RESULT, data);
        this._state = ETBNNState.Gameing;
    }

    /**发牌消息 */
    onSendCard(data: any) {
        this.emit(UTBNNHelper_hy.TBNN_EVENT.TBNN_SEND_CARD, data);
        this._state = ETBNNState.Gameing;
    }

    /**开牌结果 */
    onOpenCardResult(data: any) {
        this.emit(UTBNNHelper_hy.TBNN_EVENT.TBNN_OPEN_CARD_RESULT, data);
        this._state = ETBNNState.Gameing;
    }

    /**游戏结束 */
    onGameEnd(data: any) {
        this.setRoomHyInfo(data);
        var dTotalScore = data.totalScore;
        if (dTotalScore != null) {
            for (let i = 0; i < dTotalScore.length; i++) {
                const element = dTotalScore[i];
                let item = this.getbattleplayerbyChairId(i);
                if (item && this._battleplayer[item.userId].playStatus > 0) {
                    item.score = element;
                }
            }
        }
        this.emit(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAME_END, data);
        this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_DJS_EVENT, 0);
        this._state = ETBNNState.Wait;
        // this.updateBattlePlayer();
    }

    /**设置状态 */
    setReconnectState(state: ETBNNState, isRestRoominfo?: boolean) {
        this._state = state;
        if (isRestRoominfo) {
            // this._roomInfo = null;
            this._reconnectInRoomWithNoGame = true;

            this._battleplayer = {};
            this.uiposToUserId = {};
            this._wMeChairId = 0;
        }
    }

    /**操作失败 没用*/
    onOperateFail(data: any) {

    }
    /**游戏开始AI 没用*/
    onGameStartAI(data: any) {

    }

    onNextExit(data: any) {
        UDebug.log(data);
        this.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_NEXT_EXIT, data);
    }

    /*************** c_send *****************/

    /**准备 */
    sendReady() {
        this.sendMsg(FTbnn.SUBID.NN_SUB_C_READY, {});
    }

    /**旁观 */
    sendLookOn() {
        this.sendMsg(FTbnn.SUBID.NN_SUB_C_LOOKON, {});
    }

    /**下局旁观 */
    sendLookOnNext(isLookOn: boolean) {
        this.sendMsg(FTbnn.SUBID.NN_SUB_C_NEXT_LOOKON, {
            bLookon: isLookOn
        });
    }

    /**结算 */
    sendCheckout() {
        this.sendMsg(FTbnn.SUBID.NN_SUB_C_CONCLUDE, {});
    }

    /**再来一轮 */
    sendPlayAgain() {
        this.sendMsg(FTbnn.SUBID.NN_SUB_C_AGAIN, {});
    }

    /**
     * 请求下注
     * @param jetton 倍数索引  
     */
    sendAddScore(jetton: number) {
        var data = {
            jettonIndex: jetton,
        }
        this.sendMsg(FTbnn.SUBID.NN_SUB_C_ADD_SCORE, data);
    }
    /**
     * 请求叫庄
     * @param callFlag 
     */
    sendCallBanker(callFlag: number) {
        var data = {
            cbCallFlag: callFlag,
        }
        // this.sendMsg(FTbnn.SUBID.NN_SUB_C_CALL_BANKER, data);
    }

    /**请求开牌 */
    sendOpenCard() {
        this.sendMsg(FTbnn.SUBID.NN_SUB_C_OPEN_CARD, {});
    }

    /**
     * 请求下局离场
     * @param b 
     */
    sendNextExit(b: boolean): void {
        // var data = {
        //     bExit: b,
        // }
        // this.sendMsg(FTbnn.SUBID.NN_SUB_C_ROUND_END_EXIT, data);
    }

    //#endregion

    //#region  牌相关

    /**
     * 得到扑克花色
     * @param card 牌值
     * @returns 花色
     */
    public getCardSuit(card: number): number {
        return (card & MTBNNModel_hy.LOGIC_MASK.COLOR) >> 4;
    }
    /**获取一副完整的牌 not use*/
    public getCards(): number[] {
        var cards = new Array<number>();
        cards = this._M_CARDLISTDATA;
        return cards;
    }

    /**
     * 获取数值
     * @param card 牌值
     * @returns 牌的数值
     */
    public getCardValue(card: number): number {
        return card & MTBNNModel_hy.LOGIC_MASK.VALUE;
    }

    /**
     * 新版取牌名字(10进制)
     * @param value 
     */
    cardValueToSpriteKey1(value: number): string {
        var key = "poker_";

        key = key + value.toString(10);
        // UDebug.log(key);
        return key;
    }

    //图片是扒别人的，要转下 2-K ---- 1-12   A：13    黑桃/红桃/梅花/方块 
    //only for qznn   not use
    /** 把牌值转换成 读取spriteFrame的路径
     * @param value 牌值 例0x01
     * @returns 读取spriteFrame的路径
     */
    cardValueToSpriteKey(value: number): string {
        if (value != null) {
            var key = "lord_card"; //"poker_";
            // key = 

            let num = this.getCardValue(value);//数值
            let color = this.getCardSuit(value);//花色
            var v = 1;

            if (color < 0 || color >= 4) {
                // throw new Error("color not match");
                //可弹个提示
                return null;
            }

            if (num == 1)//是A
            {
                v = (color % 4 + 1) * 13;
                // UDebug.log(v);
                key += v.toString();
            }
            else {
                num -= 1;
                num += ((3 - color) * 13);

                // UDebug.log(num);
                key += num.toString();
            }
            // key += ".webp";

            return key;
        }
        return null;
    }
    /**
     * 获得牛牛 真实牌值 J,Q,K 都算10
     * @param num 牌值
     * @returns 真实牌值
     */
    getCardTrueValue(num: number): number {
        var value = 0;
        if (num === 13 || num === 12 || num === 11) {
            value = 10;
        }
        else {
            value = num;
        }
        return value;
    }

    /**
     * 得到抢庄牛牛的逻辑值
     * @param cbCardData 牌值掩码
     * @returns 逻辑值
     */
    getLogicValue(cbCardData: number) {
        //扑克属性
        var bCardValue = this.getCardValue(cbCardData);
        //转换数值
        return (bCardValue > 10) ? (10) : bCardValue;
    }

    /**
     * 排列扑克
     * @param cbCardData 牌值掩码
     * @param cbCardCount 排数
     */
    sortCardList(cbCardData: Array<number>, cbCardCount: number) {
        // assert(cbCardCount ==MAX_COUNT);

        //数目过虑
        if (cbCardCount == 0)
            return;

        if (cbCardCount != MAX_COUNT) {
            throw new Error("抢庄牛牛的牌需为5张");
        }

        //转换数值
        var cbSortValue = new Array(MAX_COUNT);
        for (let i = 0; i < cbCardCount; i++) {
            cbSortValue[i] = this.getCardValue(cbCardData[i]);
        }

        //排序操作
        var bSorted = true;
        let cbSwitchData = 0, cbLast = cbCardCount - 1;

        do {
            bSorted = true;

            for (let i = 0; i < cbLast; i++) {
                if ((cbSortValue[i] < cbSortValue[i + 1]) ||
                    ((cbSortValue[i] == cbSortValue[i + 1]) && (cbCardData[i] < cbCardData[i + 1]))) {
                    //设置标志
                    bSorted = false;

                    //扑克数据
                    cbSwitchData = cbCardData[i];
                    cbCardData[i] = cbCardData[i + 1];
                    cbCardData[i + 1] = cbSwitchData;

                    //排序权位
                    cbSwitchData = cbSortValue[i];
                    cbSortValue[i] = cbSortValue[i + 1];
                    cbSortValue[i + 1] = cbSwitchData;
                }

            }
            cbLast--;
        } while (bSorted == false);

    }

    /**
     * 获取类型
     * @param cbCardData 
     * @param cbCardCount 
     */
    getCardType(cbCardData: Array<number>, cbCardCount: number): number {
        // assert(cbCardCount == MAX_COUNT);
        if (cbCardCount != MAX_COUNT) {
            throw new Error("抢庄牛牛的牌需为5张");
        }

        // UDebug.log(this.isFiveSmall(cbCardData));
        // UDebug.log(this.isGoldenBull(cbCardData));
        // UDebug.log(this.isBomb(cbCardData));
        // UDebug.log(this.isSilveryBull(cbCardData));


        //是否为五小牛
        if (this.isFiveSmall(cbCardData)) {
            return OX_FIVE_SMALL;
        }

        //是否为五花牛
        if (this.isGoldenBull(cbCardData)) {
            return OX_GOLDEN_BULL;
        }

        //是否为炸弹
        if (this.isBomb(cbCardData)) {
            return OX_BOMB;
        }

        //是否为银牛(四花牛)
        if (this.isSilveryBull(cbCardData)) {
            return OX_SILVERY_BULL;
        }

        //牛1-10
        var bTemp = new Array(MAX_COUNT);
        var bSum = 0;

        for (let i = 0; i < cbCardCount; ++i) {
            bTemp[i] = this.getLogicValue(cbCardData[i]);
            bSum += bTemp[i];
        }

        for (let i = 0; i < cbCardCount - 1; i++) {

            for (let j = i + 1; j < cbCardCount; j++) {
                if ((bSum - bTemp[i] - bTemp[j]) % 10 == 0) {
                    return ((bTemp[i] + bTemp[j]) > 10) ? (bTemp[i] + bTemp[j] - 10) : (bTemp[i] + bTemp[j]);
                }
            }
        }
        return OX_VALUE0;	//无牛
    }

    /**
     * 是否为五小
     * @param cbCardData 
     */
    isFiveSmall(cbCardData: number[] = new Array(MAX_COUNT)): boolean {
        var wTotalValue = 0;
        //统计牌点总合
        for (let i = 0; i < MAX_COUNT; i++) {
            let wValue = this.getCardValue(cbCardData[i]);
            if (wValue > 4) {
                return false;
            }
            wTotalValue += wValue;
        }
        //判断是否五小
        return (wTotalValue <= 10 && wTotalValue > 0) ? true : false;
    }

    /**
     * 金牛 五花牛
     * @param cbCardData 
     */
    isGoldenBull(cbCardData: number[] = new Array(MAX_COUNT)): boolean {
        var cbCount = 0;
        for (let i = 0; i < MAX_COUNT; ++i) {
            if (this.getCardValue(cbCardData[i]) > 10) {//大于10
                ++cbCount;
            }
            else {
                return false;
            }
        }
        return (5 == cbCount) ? true : false;
    }

    /**
     * 是否为炸弹
     * @param cbCardData 
     */
    isBomb(cbCardData: number[] = new Array(MAX_COUNT)): boolean {
        //炸弹牌型
        var cbSameCount = 0;
        var cbTempCard = new Array(MAX_COUNT);
        cbTempCard[MAX_COUNT] = 0;
        // memcpy(cbTempCard, cbCardData, sizeof(cbTempCard));

        // cbTempCard = cbTempCard.copyWithin(cbCardData,0,MAX_COUNT);

        cbTempCard = JSON.parse(JSON.stringify(cbCardData));
        // Object.assign(cbTempCard, cbCardData);

        // UDebug.log("cbTempCard sort before:"+cbTempCard);
        //排序
        this.sortCardList(cbTempCard, MAX_COUNT);
        // UDebug.log("cbTempCard sort after:"+cbTempCard);

        var bSecondValue = this.getCardValue(cbTempCard[2]); //dz改了下  //MAX_COUNT / 2
        for (let i = 0; i < MAX_COUNT; ++i) {
            if (bSecondValue == this.getCardValue(cbTempCard[i])) {
                cbSameCount++;
            }
        }
        return (4 == cbSameCount) ? true : false;
    }

    /**
     * 是否为银牛
     * @param cbCardData 
     */
    isSilveryBull(cbCardData: Array<number> = new Array(MAX_COUNT)): boolean {
        var cbCountNoHua = 0;
        var cbCount = 0
        for (let i = 0; i < MAX_COUNT; ++i) {
            if (this.getCardValue(cbCardData[i]) >= 11) {//大于等于11
                ++cbCount;
            } else if (this.getCardValue(cbCardData[i]) == 10) {
                ++cbCountNoHua;
            }
            else {
                return false;
            }
        }
        return ((4 == cbCount) && (cbCountNoHua == 1)) ? true : false;
    }

    /**
     * 获取倍数
     * @param cbCardData 
     */
    getMultiple(cbCardData: number[]): number {
        var cbCardType = this.getCardType(cbCardData, MAX_COUNT);
        if (cbCardType <= 6) return 1;
        else if (cbCardType <= 9) return 2;
        else if (cbCardType == 10) return 3;
        else if (cbCardType == OX_BOMB) return 4;
        else if (cbCardType == OX_SILVERY_BULL) return 4;//开元的是4  加上的
        else if (cbCardType == OX_GOLDEN_BULL) return 4;//开元的是4   5
        else if (cbCardType == OX_FIVE_SMALL) return 4; //开元的是4   5
        return 0;
    }

    /**
     * 获取牛牛牌
     * @param cbCardData 
     */
    getOxCard(cbCardData: number[]): boolean {
        //设置变量
        // var cbTemp[MAX_COUNT] = { 0 };
        // var cbTempData[MAX_COUNT] = { 0 };

        var cbTemp = new Array(MAX_COUNT);
        cbTemp[MAX_COUNT] = 0;

        var cbTempData = new Array(MAX_COUNT);
        cbTempData[MAX_COUNT] = 0;

        // memcpy(cbTempData, cbCardData, sizeof(cbTempData));
        cbTempData = JSON.parse(JSON.stringify(cbCardData));
        // Object.assign(cbTempData, cbCardData);

        var bSum = 0;
        for (let i = 0; i < MAX_COUNT; ++i) {
            cbTemp[i] = this.getLogicValue(cbCardData[i]);
            bSum += cbTemp[i];
        }

        //查找牛牛
        for (let i = 0; i < MAX_COUNT - 1; ++i) {
            for (let j = i + 1; j < MAX_COUNT; ++j) {
                if ((bSum - cbTemp[i] - cbTemp[j]) % 10 == 0) {
                    let bCount = 0;
                    for (let k = 0; k < MAX_COUNT; ++k) {
                        if (k != i && k != j) {
                            cbCardData[bCount++] = cbTempData[k];
                        }
                    }

                    // assert(bCount == 3);
                    if (bCount != 3) {
                        throw new Error("牛牛牌需为3张");
                    }

                    cbCardData[bCount++] = cbTempData[i];
                    cbCardData[bCount++] = cbTempData[j];

                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 对比扑克 前大于后:true
     * @param cbFirstCard 
     * @param cbNextCard 
     */
    compareCard(cbFirstCard: number[], cbNextCard: number[]): boolean {
        //获取点数
        var cbFirstType = this.getCardType(cbFirstCard, MAX_COUNT);
        var cbNextType = this.getCardType(cbNextCard, MAX_COUNT);

        if (cbFirstType != cbNextType) {//牌型不同
            return (cbFirstType > cbNextType) ? true : false;
        }

        //牌型相同
        //排序大到小
        // uint8_t bFirstTemp[MAX_COUNT] = { 0 };
        // uint8_t bNextTemp[MAX_COUNT] = { 0 };
        var bFirstTemp = new Array(MAX_COUNT);
        bFirstTemp[MAX_COUNT] = 0;

        var bNextTemp = new Array(MAX_COUNT);
        bNextTemp[MAX_COUNT] = 0;

        // memcpy(bFirstTemp, cbFirstCard, MAX_COUNT);
        // memcpy(bNextTemp, cbNextCard, MAX_COUNT);

        // Object.assign(bFirstTemp, cbFirstCard);
        // Object.assign(bNextTemp, cbNextCard);
        bFirstTemp = JSON.parse(JSON.stringify(cbFirstCard));
        bNextTemp = JSON.parse(JSON.stringify(cbNextCard));

        this.sortCardList(bFirstTemp, MAX_COUNT);
        this.sortCardList(bNextTemp, MAX_COUNT);

        //牌型相等
        if (cbFirstType == OX_BOMB) {
            return this.getCardValue(bFirstTemp[MAX_COUNT / 2]) > this.getCardValue(bNextTemp[MAX_COUNT / 2]);
        }

        //有牛牌型(非牛牛)比较：比牛数；牛数相同庄吃闲。
        //if (cbFirstType > OX_VALUE0 && cbFirstType < 10)
        //{
        //	return true;
        //}
        //比较数值
        var cbFirstMaxValue = this.getCardValue(bFirstTemp[0]);
        var cbNextMaxValue = this.getCardValue(bNextTemp[0]);
        if (cbNextMaxValue != cbFirstMaxValue)
            return cbFirstMaxValue > cbNextMaxValue;

        //比较颜色
        return this.getCardSuit(bFirstTemp[0]) > this.getCardSuit(bNextTemp[0]);

        return false;
    }

    /**
     * 混乱扑克
     * @param byCardBuffer 牌值
     * @param byBufferCount 牌数组长度
     * @return 混乱后的牌值数组
     */
    randCardData(byCardBuffer: number[], byBufferCount: number): number[] {
        //混乱准备
        //    uint8_t cbCardData[MAX_CARD_TOTAL] = {0};
        // memcpy(byCardBuffer, m_byCardDataArray, MAX_CARD_TOTAL);

        var byCardBufferTemp = JSON.parse(JSON.stringify(byCardBuffer));
        var randCards = [];

        var shuffle = function (arr: number[], arrLength: number) {
            var m = arrLength, t: any, i: any;
            while (m) {
                i = Math.floor(Math.random() * m--);
                t = arr[m];
                arr[m] = arr[i];
                arr[i] = t;
            }
            return arr;
        }
        randCards = shuffle(byCardBufferTemp, byBufferCount);

        return randCards;

        //    //混乱扑克
        //    uint8_t bRandCount=0, bPosition=0;
        //    do
        //    {
        //        bPosition=rd()%(MAX_CARD_TOTAL-bRandCount);
        //        byCardBuffer[bRandCount++]=cbCardData[bPosition];
        //        cbCardData[bPosition]=cbCardData[MAX_CARD_TOTAL-bRandCount];
        //    } while (bRandCount<byBufferCount && bRandCount<MAX_CARD_TOTAL);

        // random_shuffle(byCardBuffer, byCardBuffer+5);

    }

    //#endregion

    //#region  玩家信息相关

    /**根据真实玩家位置获取玩家信息 */
    getbattleplayerbyChairId(chairId: number, pl?: any): TBNNBattlePlayerInfo {
        let ppp = pl || this._battleplayer;//**将就他原来的写法 */
        for (const key in ppp) {
            if (ppp.hasOwnProperty(key)) {
                const element = ppp[key];
                if (element.chairId == chairId) {
                    return element;
                }
            }
        }
        return null;
    }

    /**根据ui玩家位置获取玩家信息 */
    getbattleplayerbySeatId(seatId: number, pl?: any): TBNNBattlePlayerInfo {
        let ppp = pl || this._battleplayer;//**将就他原来的写法 */
        for (const key in ppp) {
            if (ppp.hasOwnProperty(key)) {
                const element = ppp[key];
                if (element.seatId == seatId) {
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

    /**获取刚进房间时候 显示自己的信息 */
    getshowselfinfo(): TBNNBattlePlayerInfo {
        let bb = new TBNNBattlePlayerInfo();
        bb.seatId = TBNN_SELF_SEAT;
        bb.nickName = AppGame.ins.roleModel.useId.toString();
        bb.headId = AppGame.ins.roleModel.headId;
        bb.score = AppGame.ins.roleModel.score;
        return bb;
    }

    /**根据ui位置,获得性别 */
    getPlayerSexByUISeat(localPos: number): number {
        var sex = 0;
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                const element = this._battleplayer[key];
                var localPos1 = this.getUISeatId(element.chairId);
                if (localPos == localPos1) {
                    sex = element.sex;
                    break;
                }
            }
        }

        return sex;
    }
    /**通过真实位置得到sex */
    getPlayerSexByRealSeat(pos: number): number {
        var sex = 0;
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                const element = this._battleplayer[key];
                if (pos == element.chairId) {
                    sex = element.sex;
                    break;
                }
            }
        }

        return sex;
    }

    //#endregion
}
