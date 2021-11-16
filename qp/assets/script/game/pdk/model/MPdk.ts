import Model from "../../../common/base/Model";
import { RoomInfo, RoomPlayerInfo } from "../../../public/hall/URoomClass";
import AppGame from "../../../public/base/AppGame";
import MBaseGameModel from "../../../public/hall/MBaseGameModel";
import { Ddz, Game, Pdk } from "../../../common/cmd/proto";
import UHandler from "../../../common/utility/UHandler";
import UMsgCenter from "../../../common/net/UMsgCenter";
import { EGameType, ELeftType, ELevelType, ECommonUI, ERoomKind } from "../../../common/base/UAllenum";
import cfg_head from "../../../config/cfg_head";
import UDebug from "../../../common/utility/UDebug";
import ULanHelper from "../../../common/utility/ULanHelper";
import UPDKHelper, { EPDKState } from "../pdk_Helper";
import { CardType, ChatMsgType, ReceiveChairidType } from "../poker/PDKEnum";
import pdk_Library from "../pdk_Library";
import pdk_Main from "../pdk_Main";
// import UPDKHelper, { EPDKState } from "../../ddz/ddz_Helper";

export const PDK_SCALE = 0.01; 
export const PDK_SCALE_100 = 100; 
/**
 * 创建:dz 
 * 作用:数据逻辑
 */
export default class MPdk extends Model {
    
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
    /**
     * 房间信息
     */
    public _roomInfo: RoomInfo;
    /**返回大厅 */
    private _retrunLobby: boolean = false;

    /**庄家索引 */
    private _bankerIndex: number = null;
    static ins: any;
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

    //别人出的牌
    public otherOutPokers:number[] =[]
    //选中的牌
    public selectPokers:number[] =[]
    //手牌
    public handPokers: number[] = []
    //提示列表
    public PromptList: any[] = []
    //提示列表当前序号
    public PromptIndex = 0
    // cardsType: PDKEnum.CardType;
    //牌库
    public pokerLibrary:pdk_Library = null
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
        this._retrunLobby = false;
        this.pokerLibrary = new pdk_Library()
        // 游戏空闲
        this.regesterMsg(Pdk.SUBID.SC_GAMESCENE_FREE, new UHandler(this.onGameSceneFree, this));
        // 游戏中场景消息
        this.regesterMsg(Pdk.SUBID.SC_GAMESCENE_PLAY, new UHandler(this.onGamescenePlay, this));
        // 开始游戏
        this.regesterMsg(Pdk.SUBID.SUB_S_GAME_FAPAI, new UHandler(this.onGameStart, this));
        // 游戏结束
        this.regesterMsg(Pdk.SUBID.SC_GAMESCENE_END, new UHandler(this.onGameEnd, this));
        // 红桃三玩家的座位
        this.regesterMsg(Pdk.SUBID.SUB_S_OWNREDPEACH3CHAIR, new UHandler(this.onOwnerEdpeach3Chair, this));
        //请玩家出牌
        this.regesterMsg(Pdk.SUBID.SUB_S_CHUPAI, new UHandler(this.onOutCard, this));
        // 请玩家跟牌
        this.regesterMsg(Pdk.SUBID.SUB_S_FOLLOW, new UHandler(this.onFollowCard, this));
        // 通知玩家出牌信息
        this.regesterMsg(Pdk.SUBID.SUB_S_NOTIFY_CHUPAI_INFO, new UHandler(this.onNotifyOutCardInfo, this));
        // 通知玩家过牌信息
        this.regesterMsg(Pdk.SUBID.SUB_S_NOTIFY_PASS_INFO, new UHandler(this.onNotifyPassCardInfo, this));
        // 通知游戏结果	
        this.regesterMsg(Pdk.SUBID.SUB_S_NOTIFY_GAME_RESULT, new UHandler(this.onNotifyGameResult, this));
        // 通知玩家托管信息
        this.regesterMsg(Pdk.SUBID.SUB_S_NOTIFY_TUOGUAN, new UHandler(this.onNotifyPlayerTuoguanInfo, this));
        // 通知玩家分数变化
        this.regesterMsg(Pdk.SUBID.SUB_S_NOTIFY_SCORECHANGE, new UHandler(this.onNotifyPlayerScoreChange, this));

        // 通知消息
        this.regesterMsg(Pdk.SUBID.SUB_S_NOTIFY_MESSAGE, new UHandler(this.onNotifyMessageInfo, this));
        // 通知聊天消息
        this.regesterMsg(Pdk.SUBID.SUB_S_NOTIFY_CHART_MESSAGE, new UHandler(this.onNotifyChartMessageInfo, this));
       
    }

    exit(): void {
        super.exit();
        this.resetData();
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.user_status_notify, this);

        this.unregesterMsg(Pdk.SUBID.SC_GAMESCENE_FREE, new UHandler(this.onGameSceneFree, this));
        this.unregesterMsg(Pdk.SUBID.SC_GAMESCENE_PLAY, new UHandler(this.onGamescenePlay, this));
        this.unregesterMsg(Pdk.SUBID.SUB_S_GAME_FAPAI, new UHandler(this.onGameStart, this));
        this.unregesterMsg(Pdk.SUBID.SC_GAMESCENE_END, new UHandler(this.onGameEnd, this));

        this.unregesterMsg(Pdk.SUBID.SUB_S_OWNREDPEACH3CHAIR, new UHandler(this.onOwnerEdpeach3Chair, this)); 
        this.unregesterMsg(Pdk.SUBID.SUB_S_CHUPAI, new UHandler(this.onOutCard, this));
        this.unregesterMsg(Pdk.SUBID.SUB_S_FOLLOW, new UHandler(this.onFollowCard, this));
        this.unregesterMsg(Pdk.SUBID.SUB_S_NOTIFY_CHUPAI_INFO, new UHandler(this.onNotifyOutCardInfo, this));
        this.unregesterMsg(Pdk.SUBID.SUB_S_NOTIFY_PASS_INFO, new UHandler(this.onNotifyPassCardInfo, this));
        this.unregesterMsg(Pdk.SUBID.SUB_S_NOTIFY_GAME_RESULT, new UHandler(this.onNotifyGameResult, this));
        this.unregesterMsg(Pdk.SUBID.SUB_S_NOTIFY_TUOGUAN, new UHandler(this.onNotifyPlayerTuoguanInfo, this));
        this.unregesterMsg(Pdk.SUBID.SUB_S_NOTIFY_SCORECHANGE, new UHandler(this.onNotifyPlayerScoreChange, this));
        this.unregesterMsg(Pdk.SUBID.SUB_S_NOTIFY_MESSAGE, new UHandler(this.onNotifyMessageInfo, this));
        this.unregesterMsg(Pdk.SUBID.SUB_S_NOTIFY_CHART_MESSAGE, new UHandler(this.onNotifyChartMessageInfo, this));

        this._roomInfo = null;
        this._battleplayer = {};
        this._wMeChairId = null;
    }

    resetData(): void {
        this.otherOutPokers = []
        this.selectPokers =[]
        this.handPokers = []
        this.PromptList = []
        this.PromptIndex = 0

        if(AppGame.ins.currRoomKind == ERoomKind.Normal) {
            this._battleplayer = {}
            this._wMeChairId = null
        } else if(AppGame.ins.currRoomKind == ERoomKind.Club) {
            for(var k in this._battleplayer){
                if(this._battleplayer[k].userStatus == 0) 
                delete this._battleplayer[k]
            }
            //刷新用户列表 
            this.emit(UPDKHelper.PDK_SELF_EVENT.PDK_UPDATE_PLAYERS_EVENT, this._battleplayer)
        }
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
        UMsgCenter.ins.regester(EGameType.PDK,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    } 

    unregesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.unregester(EGameType.PDK,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    }


    /** 发送网络消息*/
    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(EGameType.PDK,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId, data, handler, unlock);
    }


    /**玩家状态 */
    private user_status_notify(userid: number, usstatus: number) { //data: GameServer.MSG_S2C_GameUserStatus
        //UDebug.Log("更新玩家状态------------------------" + userid + "   " + usstatus);


        var userId = userid;
        var usStatus = usstatus;
        if (usStatus == null || usStatus == 0) {
            if (this._battleplayer && this._battleplayer[userId]) {
                this._battleplayer[userId].userStatus = 0;
                if (userId != AppGame.ins.roleModel.useId) {
                    //this._battleplayer[userId].isExit = true
                    // this.emit(UPDKHelper.PDK_SELF_EVENT.PDK_UPDATE_PLAYERS_EVENT, this._battleplayer);
                }
            }
        }
        // else {//if(data.usStatus > 0)
        //     if (this._battleplayer && this._battleplayer[userId]) {
        //         //this._battleplayer[userId].playStatus = 1;
        //     }
        // }

        // if ((userId == this.selfUserId && this._dataSceneTemp != null && this._sceneNum > 0 && this._isWaitGameServerMsg)
        //     || (this._battleplayer != null && this.getBattlePlayerLength() == 4 && this._isWaitGameServerMsg)) {
        //     this._isWaitGameServerMsg = false;

        //     // this.handleWaitGameMsg(this._sceneNum, this._dataSceneTemp);
        // }
    }

    /************* scene *****************/
    /**玩家进入房间 */
    private sc_ts_room_playerinfo(data: any) {
        UDebug.log("玩家进入房间------"+JSON.stringify(data));
        var element: RoomPlayerInfo = data
        this._battleplayer[element.userId] = element
        if (element.userId == AppGame.ins.roleModel.useId) {
            this._wMeChairId = element.chairId;
        }
        UDebug.log("this.battleplayer = "+JSON.stringify(this._battleplayer));
        if(this.gameStatus != MPdk.PDK_GAMESTATUS.OVER)
        this.emit(UPDKHelper.PDK_SELF_EVENT.PDK_UPDATE_PLAYERS_EVENT, this._battleplayer)
    }

    /**玩家离开房间 */
    private sc_ts_player_left_room(data: any) {
        UDebug.Log("sc_ts_player_left_room:" + JSON.stringify(data));
        if (data.retCode == 0) {

            if (data.type == ELeftType.ReturnToRoom) {
                if (this._state != EPDKState.AlreadyLeft) {
                    this._state = EPDKState.AlreadyLeft;
                    if (this._roomInfo) {
                        clearInterval(pdk_Main.ins.clockShowResult);
                        clearInterval(pdk_Main.ins.clockStartMatch);
                        clearInterval(pdk_Main.ins.clockActionId);
                        AppGame.ins.loadLevel(ELevelType.Hall, this._roomInfo.gameId);
                    } else {

                        AppGame.ins.loadLevel(ELevelType.Hall);
                    }
                }
            } else if (data.type == ELeftType.CancleMatch) {

                this.emit(UPDKHelper.PDK_SELF_EVENT.PDK_SC_TS_CANCLE_MATCH, true);
                this._state = EPDKState.Wait;

            } else if (data.type == ELeftType.LeftGame) {

                this._battleplayer = {};
                this._currentDizhu = 0;
                this._wMeChairId = 0;

                this._state = EPDKState.Match;

                // AppGame.ins.roomModel.requestMatch();
                this.emit(UPDKHelper.PDK_SELF_EVENT.PDK_SC_TS_START_MATCH);
            }

        }
        // else if (data.retCode == 2) {
        //     this.emit(UPDKHelper.PDK_SELF_EVENT.DDZ_CONTINUE_ACTIVE, true);
        // }
        else {
            
            if (data.type == ELeftType.ReturnToRoom) {
                this._retrunLobby = false;
                AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
            }
            else if (data.type == ELeftType.CancleMatch) {
                if (this._state != EPDKState.Gameing) {
                    this.emit(UPDKHelper.PDK_SELF_EVENT.PDK_SC_TS_CANCLE_MATCH, false);
                }

                if (data.errorMsg) {
                    AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
                }

            } else if (data.type == ELeftType.LeftGame) {

                this.emit(UPDKHelper.PDK_SELF_EVENT.PDK_SC_TS_START_MATCH);
            }

        }
    }

    /**保存房间数据 不能修改 */
    saveRoomInfo(data: RoomInfo): void {
        this._roomInfo = data;

        UDebug.log("this._roomInfo:" + JSON.stringify(this._roomInfo));
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
                        AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
                    } else {
                        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                    }
                }
                break;
            case EPDKState.Watching:
            case EPDKState.Match:
            case EPDKState.Wait:
                {
                    if (this._roomInfo ) {
                        this._retrunLobby = true;
                        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                    } else {
                        AppGame.ins.loadLevel(ELevelType.Hall, EGameType.PDK);
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
        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.LeftGame);
    }

    /************* s_event **************/
    /**游戏开始 */
    onGameStart(data: any) {
        for (var k in this._battleplayer) {
           this._battleplayer[k].userStatus = 5;
        }
        this.emit(UPDKHelper.PDK_EVENT.PDK_GAME_START, data);
        this._gameStatus = MPdk.PDK_GAMESTATUS.SEND;
        this._state = EPDKState.Gameing
        // this.emit(UPDKHelper.PDK_SELF_EVENT.PDK_UPDATE_ROOMID, roomId);
    }

    private onGameSceneFree(data: any): void {
        AppGame.ins.pdkModel.currentDizhu = data.discore;
        this.emit(UPDKHelper.PDK_EVENT.PDK_GAMESCENE_FREE, data);
    }

    /**游戏中场景消息  */
    private onGamescenePlay(data: any): void {
        AppGame.ins.pdkModel.currentDizhu = data.discore;
        var isFollowCard = false
        if(data.playerinfo.length > 0) {
            AppGame.ins.pdkModel.handPokers = data.playerinfo[this._wMeChairId].cards;
        }
        for (let k = 0; k < data.playerinfo.length; k++){
            //托管信息
            var data_cmd_s_notifytuoguan = {
                chairid: data.playerinfo[k].chairid,
                istuoguan: data.playerinfo[k].istuoguan
            }
            this.onNotifyPlayerTuoguanInfo(data_cmd_s_notifytuoguan) 
           
            //显示其它两家的出牌信息
            if (data.playerinfo[k].chairid != data.currentchairid){
                var isPass = data.playerinfo[k].lastchupaiinfo.ispass
                if (isPass == 1){
                    var data_cmd_s_notifypassinfo = {
                        chairid: data.playerinfo[k].chairid,
                        leftnum: data.playerinfo[k].leftcardnum,    
                    }
                    this.onNotifyPassCardInfo(data_cmd_s_notifypassinfo)
                }else{
                    var data_cmd_s_notifychupaiinfo = {
                        chairid: data.playerinfo[k].chairid,    
                        cardtype: data.playerinfo[k].lastchupaiinfo.cardtype,
                        cards:data.playerinfo[k].lastchupaiinfo.cards,
                        leftnum:data.playerinfo[k].leftcardnum,
                        leftcards:data.playerinfo[k].cards,
                    }
                    this.onNotifyOutCardInfo(data_cmd_s_notifychupaiinfo)
                    isFollowCard = true
                }
            }
        }
        //发牌信息
        var data_cmd_s_fapai = {
            isReconnect: true,
            chairid: this._wMeChairId,
            roundid: data.roundid,
            cards: data.playerinfo[this._wMeChairId].cards,
            outcarddatas:data.hasOwnProperty('outcarddatas')?data.outcarddatas:[],
        }
        this.onGameStart(data_cmd_s_fapai)
        //出牌或跟牌通知
        var data_cmd_s_chupai = {
            chairid: data.currentchairid,
            waittime: data.waittime,
            isReconnect: true,
            leftnum: data.playerinfo[data.currentchairid].leftcardnum, 
        }
        isFollowCard ? this.onFollowCard(data_cmd_s_chupai) : this.onOutCard(data_cmd_s_chupai)
    }

    /**游戏结束场景消息 */
    onGameEnd(data: any) {
        // if(AppGame.ins.currRoomKind == ERoomKind.Club) {
        //     this.onGamescenePlay(data);        
        // }
        // this.emit(UPDKHelper.PDK_EVENT.DDZ_GAME_END, data);
        // this.emit(UPDKHelper.PDK_SELF_EVENT.DDZ_DJS_EVENT, 0);
        UDebug.Log("onGameEnd:"+ JSON.stringify(data));
        this._state = EPDKState.Wait;
    }
    
    /**红桃三玩家座位消息通知 */
    private onOwnerEdpeach3Chair(data: any): void {
        this.emit(UPDKHelper.PDK_EVENT.PDK_GAME_OWNREDPEACH3CHAIR, data);
    }
    // 请玩家出牌
    private onOutCard(data: any): void {
        this._gameStatus = MPdk.PDK_GAMESTATUS.CARD;
        this.emit(UPDKHelper.PDK_EVENT.PDK_GAME_PLAYER_CHUPAI, data);
    }
    // 请玩家跟牌
    private onFollowCard(data: any): void {
        this._gameStatus = MPdk.PDK_GAMESTATUS.FOLLOW_CARD;
        this.emit(UPDKHelper.PDK_EVENT.PDK_GAME_PLAYER_FOLLOWCARD, data);
    }
    // 通知玩家出牌信息
    private onNotifyOutCardInfo(data: any): void {
        this.emit(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_CHUPAI_INFO, data);
    }
    // 通知过牌信息
    private onNotifyPassCardInfo(data: any): void {
        this.emit(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_PASS_INFO, data);
    }
    // 通知游戏结果
    private onNotifyGameResult(data: any): void {
        this._state = EPDKState.Wait;
        this._gameStatus = MPdk.PDK_GAMESTATUS.OVER;
        var result = data.gameresult
        for (var i = 0; i < result.length; i++) {
            const element = result[i]
            //更新分数
            if (this._battleplayer && this._battleplayer[element.userid]) {
                this._battleplayer[element.userid].score = element.currentscore
            } 
        }

        this.emit(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_GAME_RESULT, data);
    }
    // 通知玩家托管信息
    private onNotifyPlayerTuoguanInfo(data: any): void {
        this.emit(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_TUOGUAN, data);
    }
    // 通知玩家分数变化
    private onNotifyPlayerScoreChange(data: any): void {
        this.emit(UPDKHelper.PDK_EVENT.PDK_NOTIFY_SCORECHANGE, data);
    }

    private onNotifyMessageInfo(data: any): void {
        this.emit(UPDKHelper.PDK_EVENT.PDK_NOTIFY_MESSAGE, data);
    }

    // 通知玩家聊天消息
    private onNotifyChartMessageInfo(data: any): void {
        this.emit(UPDKHelper.PDK_EVENT.PDK_NOTIFY_CHAT_MESSAGE, data)
    }



    /**发牌消息 */
    onSendCard(data: any) {
        // this.emit(UPDKHelper.PDK_EVENT.DDZ_SEND_CARD, data);
        // this._state = EPDKState.Gameing;

    }

    /**开牌结果 */
    onOpenCardResult(data: any) {
        // this.emit(UPDKHelper.PDK_EVENT.DDZ_OPEN_CARD_RESULT, data);
        // this._state = EPDKState.Gameing;

    }

    


    onNextExit(data: any) {
        UDebug.log(data);
        // this.emit(UPDKHelper.PDK_SELF_EVENT.DDZ_NEXT_EXIT, data);

    }


    clearSelectPokers() {
        this.selectPokers = [];
        this.PromptIndex = 0;
        this.PromptList = [];
    }

     //提示大过上家的牌型
     getPrompt() {
        this.selectPokers = []
        var needChangeType = AppGame.ins.pdkModel.firstOutCardType == CardType.PDKTYPE_WING_ONE ? true : false
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
    onSendOutCards(type:number) {
        if(AppGame.ins.pdkModel.selectPokers.length > 0) {
                var data = {
                    cardtype: type,
                    cards: AppGame.ins.pdkModel.selectPokers,
                }
                UDebug.Log("Pdk.SUBID.SUB_C_CHUPAI = "+Pdk.SUBID.SUB_C_CHUPAI +"#####Pdk.SUBID.SUB_C_CHUPAI ======"+data);
                AppGame.ins.pdkModel.sendMsg(Pdk.SUBID.SUB_C_CHUPAI, data)
        }
    }

    /**过牌 */
    onSendPass() {
        var data = {}
        UDebug.Log("过牌消息");
        AppGame.ins.pdkModel.sendMsg(Pdk.SUBID.SUB_C_PASS, data)
    }

    /**
     * 发送聊天内容
     * @param sendchairid 发送消息的座位号
     * @param recvchairid 接收消息的座位号
     * @param msgtype 消息类型
     * @param msgbody 消息内容 文本
     */
    onSendChartMessage(sendchairid: number, recvchairid: ReceiveChairidType, msgtype: ChatMsgType, msgbody: string) {
        // var data = new Pdk.CMD_C_ChartMessage();
        var data = {
            chartmessage: {
                sendchairid: sendchairid,
                recvchairid: recvchairid,
                msgtype: msgtype,
                msgbody: msgbody
            }
        }
        AppGame.ins.pdkModel.sendMsg(Pdk.SUBID.SUB_C_CHART_MESSAGE, data);
    }

    //托管
    sendTrust(isFlag: number) {
        var data = {
            istuoguan : isFlag
        }
        this.sendMsg(Pdk.SUBID.SUB_C_TUOGUAN, data);
    }

    /**
     * 请求下注
     * @param jetton 倍数索引  
     */
    sendAddScore(jetton: number) {
        var data = {
            jettonIndex: jetton,
        }
        //this.sendMsg(Ddz.SUBID.NN_SUB_C_ADD_SCORE, data);
    }
    /**
     * 请求叫庄
     * @param callFlag 
     */
    sendCallBanker(callFlag: number) {
        var data = {
            callFlag: callFlag,
        }
        // this.sendMsg(Ddz.SUBID.NN_SUB_C_CALL_BANKER, data);
    }

    /**请求开牌 */
    sendOpenCard() {
        //this.sendMsg(Ddz.SUBID.NN_SUB_C_OPEN_CARD, {});
    }

    /**
     * 请求下局离场
     * @param b 
     */
    sendNextExit(b: boolean): void {
        var data = {
            bExit: b,
        }
        //this.sendMsg(Ddz.SUBID.NN_SUB_C_ROUND_END_EXIT, data);
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
    getUIChairId(seatId: number) : number {
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
