import Model from "../../../common/base/Model";
import { RoomInfo, RoomPlayerInfo } from "../../../public/hall/URoomClass";
import AppGame from "../../../public/base/AppGame";
import MBaseGameModel from "../../../public/hall/MBaseGameModel";
import {FDdz, Game, HallFriendServer} from "../../../common/cmd/proto";
import UHandler from "../../../common/utility/UHandler";
import UMsgCenter from "../../../common/net/UMsgCenter";
import {ECommonUI, EGameType, ELeftType, ELevelType, EMsgType, ETipType} from "../../../common/base/UAllenum";
import UDebug from "../../../common/utility/UDebug";
import ULanHelper from "../../../common/utility/ULanHelper";
import UDDZHelper_hy, { ChatMsgType, EDDZState, ReceiveChairidType } from "../ddz_Helper_hy";
import ddz_Library_hy, { CardType } from "../ddz_Library_hy";
import ddz_Main_hy from "../ddz_Main_hy";

/**
 * 创建:dz
 * 作用:数据逻辑
 */
export default class MDDZModel_hy extends Model {

    static DDZ_GAMESTATUS = {
        /**空闲 */
        FREE: 0,
        /**匹配 */
        MATCH: 1,
        /**发牌 */
        SEND: 2,
        /**抢 1 2 3 分 模式 */
        CALL: 3,
        /**叫抢地主 模式 */
        LANDLORD: 3.1,
        /** 叫地主 或 叫分 阶段结束 */
        END: 3.2,
        /**加倍 */
        SCORE: 4,
        /**出牌*/
        OUT: 5,
        /**跟牌*/
        FOLLOW: 6,
        /**结束*/
        OVER: 7,
    }
    /************************/
    /**
     * 房间信息
     */
    public _roomInfo: RoomInfo;
    /**庄家索引 */
    private bankerIndex: number = null
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
    /**当前底注 */
    public cellScore: number;
    //记牌器
    public leftCardCount = []

    /**set 庄家索引 */
    set sBankerIndex(index: number) {
        this.bankerIndex = index;
    }
    /**get 庄家索引 */
    get gBankerIndex(): number {
        return this.bankerIndex;
    }

    /**自己在服务器上的位置 */
    private _wMeChairId: number = 0;
    get gMeChairId(): number {
        return this._wMeChairId;
    }
    set sMeChairId(wChairId: number) {
        this._wMeChairId = wChairId;
    }

    /**该游戏最大人数 */
    private _MaxPlayer: number = 3;
    get maxPlayer(): number {
        return this._MaxPlayer;
    }

    /**游戏状态 */
    private _gameStatus: number = 0;
    get gameStatus(): number {
        return this._gameStatus;
    }
    set gameStatus(gameStatus: number) {
        this._gameStatus = gameStatus;
    }
    /**
     * 游戏状态
     */
    private _state: EDDZState = EDDZState.Wait;

    //当前轮主动出牌的玩家
    public  firstOutChairId: number = -1

    //当前轮主动出牌打出的牌型
    public  firstOutCardType: number = -1

    /**本局的玩家 */
    private _battleplayer: { [key: number]: RoomPlayerInfo } = {};

    get gBattlePlayer(): { [key: number]: RoomPlayerInfo } {
        return this._battleplayer;
    }

    /** 配置 */
    private _gameConfig : any = {};

    get gGameConfig(): any {
        return this._gameConfig;
    }

    //牌库
    public pokerLibrary:ddz_Library_hy = null

    init(): void {
        this.pokerLibrary = new ddz_Library_hy();
        //===============================新加协议 start ===============================
        //空闲场景消息
        this.regesterMsg(FDdz.SUBID.SC_GAMESCENE_FREE, new UHandler(this.onGameSceneFree, this));
        //游戏结束
        this.regesterMsg(FDdz.SUBID.SC_GAMESCENE_END, new UHandler(this.onGameOver, this));
        //一轮结束或提前结束 弹出战绩
        this.regesterMsg(FDdz.SUBID.SUB_S_PRE_DISSMIS_RESULT, new UHandler(this.onAllOverShowRecord, this));
        //解散房间
        this.regesterMsg(FDdz.SUBID.SUB_S_DISSMIS_RESULT, new UHandler(this.onDissmisResult, this));
        //游戏准备
        this.regesterMsg(FDdz.SUBID.SUB_S_READY_RESULT, new UHandler(this.onReady, this));
        //旁观
        this.regesterMsg(FDdz.SUBID.SUB_S_LOOKON_RESULT, new UHandler(this.onLookOn, this));
        //提前结算
        this.regesterMsg(FDdz.SUBID.SUB_S_CONCLUDE_RESULT, new UHandler(this.onConcludeResult, this));
        //一局结算后，玩家状态切换
        this.regesterMsg(FDdz.SUBID.SUB_S_CHANGE_USER_STATUS, new UHandler(this.onChangeUserStatus, this));
        //再来一轮
        this.regesterMsg(FDdz.SUBID.SUB_S_AGAIN_RESULT, new UHandler(this.onAgainRoomGame, this));
        //洗牌
        this.regesterMsg(FDdz.SUBID.SUB_S_SHUFFLE_CARDS, new UHandler(this.onWashCard, this));
        //开始游戏,中途进入
        this.regesterMsg(FDdz.SUBID.SUB_S_GAME_START, new UHandler(this.onGameStartJoin, this));
        //通知信息
        this.regesterMsg(FDdz.SUBID.SUB_S_NOTIFY_CLIENT_CFG, new UHandler(this.onGameConfig, this));
        //点击聊天限制
        this.regesterMsg(FDdz.SUBID.SUB_S_SET_CHAT_LIMIT_RESULT, new UHandler(this.onSetChatLimitResult, this));
        //===============================新加协议 end ===============================

        //开始游戏
        this.regesterMsg(FDdz.SUBID.SUB_S_GAME_FAPAI, new UHandler(this.onGameStart, this));
        //叫庄通知
        this.regesterMsg(FDdz.SUBID.SUB_S_CALL_SCORE, new UHandler(this.onCallBanker, this));
        //叫庄结果
        this.regesterMsg(FDdz.SUBID.SUB_S_CALL_SCOR_RESULT, new UHandler(this.onCallBankerResult, this));
        //叫抢地主通知
        this.regesterMsg(FDdz.SUBID.SUB_S_CALL_FIGHT, new UHandler(this.onCallFightStart, this));
        //叫抢地主结果
        this.regesterMsg(FDdz.SUBID.SUB_S_CALL_FIGHT_RESULT, new UHandler(this.onCallFightResult, this));
        //地主信息
        this.regesterMsg(FDdz.SUBID.SUB_S_DZ_INFO, new UHandler(this.onBankerInfo, this));
        //玩家倍率
        this.regesterMsg(FDdz.SUBID.SUB_S_NOTIFY_BEILV, new UHandler(this.onBetLevel, this));
        //加倍通知
        this.regesterMsg(FDdz.SUBID.SUB_S_JIABEI, new UHandler(this.onAddScore, this));
        //加倍结果
        this.regesterMsg(FDdz.SUBID.SUB_S_JIABEI_RESULT, new UHandler(this.onAddScoreResult, this));
        //出牌通知
        this.regesterMsg(FDdz.SUBID.SUB_S_CHUPAI, new UHandler(this.onOutCard, this));
        //出牌结果
        this.regesterMsg(FDdz.SUBID.SUB_S_NOTIFY_CHUPAI_INFO, new UHandler(this.onOutCardResult, this));
        //跟牌通知
        this.regesterMsg(FDdz.SUBID.SUB_S_FOLLOW, new UHandler(this.onFollowCard , this));
        //过牌结果
        this.regesterMsg(FDdz.SUBID.SUB_S_NOTIFY_PASS_INFO, new UHandler(this.onPassResult , this));
        //托管
        this.regesterMsg(FDdz.SUBID.SUB_S_NOTIFY_TUOGUAN, new UHandler(this.onTrustResult, this));
        //游戏结束
        this.regesterMsg(FDdz.SUBID.SUB_S_NOTIFY_GAME_RESULT, new UHandler(this.onGameEnd, this));
        //15分钟超时消息
        this.regesterMsg(FDdz.SUBID.SUB_S_IDLE_TIMEOUT_RESULT, new UHandler(this.onOverTimeoutResult, this));
        //设置同桌IP限制
        this.regesterMsg(FDdz.SUBID.SUB_S_SET_IP_LIMIT_RESULT, new UHandler(this.onSetIpLimitResult, this));
        //设置自动开局
        this.regesterMsg(FDdz.SUBID.SUB_S_SET_AUTO_START_RESULT, new UHandler(this.onSetAutoStartResult, this));
        //通知消息
        this.regesterMsg(FDdz.SUBID.SUB_S_NOTIFY_MESSAGE, new UHandler(this.onNotifyMsg, this));
        //通知玩家状态信息
        this.regesterMsg(FDdz.SUBID.SUB_S_NOTIFY_USER_INFO, new UHandler(this.onUserStatusNotify, this));

        //----------------------------------------场景消息------------------------------------------
        this.regesterMsg(FDdz.SUBID.SC_GAMESCENE_JDZ, new UHandler(this.onGameSceneCall , this));
        this.regesterMsg(FDdz.SUBID.SC_GAMESCENE_DOUBLE, new UHandler(this.onGameSceneScore , this));
        this.regesterMsg(FDdz.SUBID.SC_GAMESCENE_PLAY, new UHandler(this.onGameScenePlay , this));
    }

    exit(): void {
        super.exit();
        this.resetData();
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.user_status_notify, this);


        //空闲场景消息
        this.unregesterMsg(FDdz.SUBID.SC_GAMESCENE_FREE, new UHandler(this.onGameSceneFree, this));
        //游戏结束
        this.unregesterMsg(FDdz.SUBID.SC_GAMESCENE_END, new UHandler(this.onGameOver, this));
        //一轮结束或提前结束 弹出战绩
        this.unregesterMsg(FDdz.SUBID.SUB_S_PRE_DISSMIS_RESULT, new UHandler(this.onAllOverShowRecord, this));
        //解散房间 弹窗离开
        this.unregesterMsg(FDdz.SUBID.SUB_S_DISSMIS_RESULT, new UHandler(this.onDissmisResult, this));
        //游戏准备
        this.unregesterMsg(FDdz.SUBID.SUB_S_READY_RESULT, new UHandler(this.onReady, this));
        //旁观
        this.unregesterMsg(FDdz.SUBID.SUB_S_LOOKON_RESULT, new UHandler(this.onLookOn, this));
        //提前结算
        this.unregesterMsg(FDdz.SUBID.SUB_S_CONCLUDE_RESULT, new UHandler(this.onConcludeResult, this));
        //一局结算后，玩家状态切换
        this.unregesterMsg(FDdz.SUBID.SUB_S_CHANGE_USER_STATUS, new UHandler(this.onChangeUserStatus, this));
        //再来一轮
        this.unregesterMsg(FDdz.SUBID.SUB_S_AGAIN_RESULT, new UHandler(this.onAgainRoomGame, this));
        //洗牌
        this.unregesterMsg(FDdz.SUBID.SUB_S_SHUFFLE_CARDS, new UHandler(this.onWashCard, this));
        //开始游戏,中途进入
        this.unregesterMsg(FDdz.SUBID.SUB_S_GAME_START, new UHandler(this.onGameStartJoin, this));
        //通知信息
        this.unregesterMsg(FDdz.SUBID.SUB_S_NOTIFY_CLIENT_CFG, new UHandler(this.onGameConfig, this));

        //点击聊天限制
        this.unregesterMsg(FDdz.SUBID.SUB_S_SET_CHAT_LIMIT_RESULT, new UHandler(this.onSetChatLimitResult, this));

        this.unregesterMsg(FDdz.SUBID.SUB_S_GAME_FAPAI, new UHandler(this.onGameStart, this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_CALL_SCORE, new UHandler(this.onCallBanker, this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_CALL_FIGHT, new UHandler(this.onCallFightStart, this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_CALL_FIGHT_RESULT, new UHandler(this.onCallFightResult, this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_CALL_SCOR_RESULT, new UHandler(this.onCallBankerResult, this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_NOTIFY_BEILV, new UHandler(this.onBetLevel, this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_DZ_INFO, new UHandler(this.onBankerInfo, this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_JIABEI, new UHandler(this.onAddScore, this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_JIABEI_RESULT, new UHandler(this.onAddScoreResult, this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_CHUPAI, new UHandler(this.onOutCard, this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_NOTIFY_CHUPAI_INFO, new UHandler(this.onOutCardResult, this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_FOLLOW, new UHandler(this.onFollowCard , this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_NOTIFY_PASS_INFO, new UHandler(this.onPassResult , this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_NOTIFY_TUOGUAN, new UHandler(this.onTrustResult, this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_NOTIFY_GAME_RESULT, new UHandler(this.onGameEnd, this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_IDLE_TIMEOUT_RESULT, new UHandler(this.onOverTimeoutResult, this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_SET_IP_LIMIT_RESULT, new UHandler(this.onSetIpLimitResult, this));
        this.unregesterMsg(FDdz.SUBID.SUB_S_SET_AUTO_START_RESULT, new UHandler(this.onSetAutoStartResult, this));

        //通知消息
        this.unregesterMsg(FDdz.SUBID.SUB_S_NOTIFY_MESSAGE, new UHandler(this.onNotifyMsg, this));
        //通知玩家状态信息
        this.unregesterMsg(FDdz.SUBID.SUB_S_NOTIFY_USER_INFO, new UHandler(this.onUserStatusNotify, this));
        this.unregesterMsg(FDdz.SUBID.SC_GAMESCENE_JDZ, new UHandler(this.onGameSceneCall , this));
        this.unregesterMsg(FDdz.SUBID.SC_GAMESCENE_DOUBLE, new UHandler(this.onGameSceneScore , this));
        this.unregesterMsg(FDdz.SUBID.SC_GAMESCENE_PLAY, new UHandler(this.onGameScenePlay , this));

        this._roomInfo = null;
        this._battleplayer = {};
        this._wMeChairId = null;
    }

    //每次进入场景时
    resetData(): void {
        this.otherOutPokers = []
        this.selectPokers =[]
        this.handPokers = []
        this.PromptList = []
        this.PromptIndex = 0
        this._battleplayer = {}
        this._wMeChairId = null
        this.bankerIndex = null
        this._gameStatus = 0
    }

    update(dt: number): void {
    }

    run(): void {
        super.run();
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.user_status_notify, this);
    }

    /**注册DDZ网络消息事件 */
    regesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.regester(EGameType.DDZ_HY,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            subId,
            handler);
    }

    unregesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.unregester(EGameType.DDZ_HY,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            subId,
            handler);
    }

    /** 发送网络消息*/
    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(EGameType.DDZ_HY,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            subId, data, handler, unlock);
    }

    /**玩家状态改变通知消息 */
    onUserStatusNotify(data: any) {
        if(data.userId != AppGame.ins.roleModel.useId){
            if(data.status == 6){
                AppGame.ins.showTips(`玩家 ${data.userId} 离线`);
            }
        }
    }
    /***********************************************************接受消息**********************************/
    /**玩家状态 */
    private user_status_notify(userid: number, status: number) {
        if(status == 3){
            if(userid != ddz_Main_hy.ins.roomUserId){
                AppGame.ins.showTips(`欢迎玩家 ${userid} 加入游戏`);
            }
        }
        if (this._battleplayer && this._battleplayer[userid]) {
            this._battleplayer[userid].userStatus = status
        }
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_PLAYERS_CHANGE, {userid:userid,status:status});
    }

    /************* scene *****************/
    //叫地主
    onGameSceneCall(data: any) {
        // UDebug.Log("onGameSceneCall-----------------------" + JSON.stringify(data))
        var playerbeilvList = []
        for (var k in data.playerinfo){
            //托管信息
            var data_cmd_s_notifytuoguan = {
                chairid: k,
                istuoguan: data.playerinfo[k].istuoguan
            }
            this.onTrustResult(data_cmd_s_notifytuoguan)
            playerbeilvList.push(data.playerinfo[k].playerbeilv)
        }
        //倍率信息
        var data_cmd_s_notifybeilv = {
            playerbeilv: playerbeilvList
        }
        this.onBetLevel(data_cmd_s_notifybeilv)
        //发牌信息
        var data_cmd_s_fapai = {
            isreconnect: true,
            chairid: this._wMeChairId,
            roundid: data.roundid,
            cards: data.playerinfo[this._wMeChairId].cards
        }
        this.onGameStart(data_cmd_s_fapai)
        //叫分通知
        var data_cmd_s_callscore = {
            chairid: data.currentchairid,
            waittime: data.waittime,
            callscorestat: data.callscorestat
        }
        this.onCallBanker(data_cmd_s_callscore);
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_UPDATE_ROOM_INFO, data);
    }

    //加倍
    onGameSceneScore(data: any) {
        // UDebug.Log("onGameSceneScore-----------------------" + JSON.stringify(data))
        var playerbeilvList = []
        for (var k in data.playerinfo){
            //托管信息
            var data_cmd_s_notifytuoguan = {
                chairid: k,
                istuoguan: data.playerinfo[k].istuoguan
            }
            this.onTrustResult(data_cmd_s_notifytuoguan)
            playerbeilvList.push(data.playerinfo[k].playerbeilv)
        }
        //倍率信息
        var data_cmd_s_notifybeilv = {
            playerbeilv: playerbeilvList
        }
        this.onBetLevel(data_cmd_s_notifybeilv)
        //发牌信息
        var data_cmd_s_fapai = {
            isreconnect: true,
            chairid: this._wMeChairId,
            roundid: data.roundid,
            cards: data.playerinfo[this._wMeChairId].cards
        }
        this.onGameStart(data_cmd_s_fapai)
        //地主信息
        var data_cmd_s_dzinfo = {
            isreconnect:true,
            dzinfo:data.dzinfo
        }
        this.onBankerInfo(data_cmd_s_dzinfo)
        //加倍通知
        var data_cmd_s_jiabei = {
            chairid: data.currentchairid,
            waittime: data.waittime,
        }
        this.onAddScore(data_cmd_s_jiabei);
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_UPDATE_ROOM_INFO, data);
    }

    //出牌中
    onGameScenePlay(data: any) {
        // UDebug.Log("onGameScenePlay-----------------------" + JSON.stringify(data))
        var isFollowCard = false
        var playerbeilvList = []
        //发牌信息
        var data_cmd_s_fapai = {
            isreconnect: true,
            chairid: this._wMeChairId,
            roundid: data.roundid,
            cards: data.playerinfo[this._wMeChairId].cards
        }
        this.onGameStart(data_cmd_s_fapai);

        //地主信息
        var data_cmd_s_dzinfo = {
            isreconnect: true,
            dzinfo: data.dzinfo
        }
        this.onBankerInfo(data_cmd_s_dzinfo)

        for (var k in data.playerinfo){
            //托管信息
            var data_cmd_s_notifytuoguan = {
                chairid: k,
                istuoguan: data.playerinfo[k].istuoguan
            }
            this.onTrustResult(data_cmd_s_notifytuoguan)
            playerbeilvList.push(data.playerinfo[k].playerbeilv)
            //显示其它两家的出牌信息
            if ( k != data.currentchairid){
                var isPass = data.playerinfo[k].lastchupaiinfo.ispass
                if (isPass){
                    var data_cmd_s_notifypassinfo = {
                        isreconnect: true,
                        chairid: k,
                        leftcardnum: data.playerinfo[k].leftcardnum
                    }
                    this.onPassResult(data_cmd_s_notifypassinfo)
                }else{
                    var data_cmd_s_notifychupaiinfo = {
                        isreconnect: true,
                        lastchairid: k,
                        leftcardnum: data.playerinfo[k].leftcardnum,
                        cards: data.playerinfo[k].lastchupaiinfo.cards
                    }
                    this.onOutCardResult(data_cmd_s_notifychupaiinfo)
                    isFollowCard = true
                }
            }
        }

        //倍率信息
        var data_cmd_s_notifybeilv = {
            playerbeilv: playerbeilvList
        }
        this.onBetLevel(data_cmd_s_notifybeilv)

        //出牌或跟牌通知
        var data_cmd_s_chupai = {
            isreconnect: true,
            chairid: data.currentchairid,
            waittime: data.waittime,
            leftcardnum: data.playerinfo[data.currentchairid].leftcardnum
        }
        isFollowCard ? this.onFollowCard(data_cmd_s_chupai) : this.onOutCard(data_cmd_s_chupai)

         //更新记牌器
        this.emit(UDDZHelper_hy.DDZ_SELF_EVENT.DDZ_RECONNECT_OUT_CARD, data.outcarddatas)
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_UPDATE_ROOM_INFO, data);
    }

    /**玩家进入房间 */
    private sc_ts_room_playerinfo(data: any) {
        var element: RoomPlayerInfo = data
        this._battleplayer[element.userId] = element
        if (element.userId == AppGame.ins.roleModel.useId) {
            this._wMeChairId = element.chairId;
        }
        this.emit(UDDZHelper_hy.DDZ_SELF_EVENT.DDZ_UPDATE_PLAYERS_EVENT, this._battleplayer)
    }

    /**玩家离开房间,针对自己 */
    private sc_ts_player_left_room(data: any) {
        //退出房间成功
        if (data.retCode == 0) {
            if (data.type == ELeftType.ReturnToRoom) {
                if (this._roomInfo) {
                    AppGame.ins.loadLevel(ELevelType.Hall, this._roomInfo.gameId);
                } else {
                    AppGame.ins.loadLevel(ELevelType.Hall);
                }
            } else if (data.type == ELeftType.CancleMatch) {
                this.emit(UDDZHelper_hy.DDZ_SELF_EVENT.DDZ_SC_TS_CANCLE_MATCH, true);
                this._state = EDDZState.Wait;
            } else if (data.type == ELeftType.LeftGame) {
                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.DDZ_HY);
            }
        }
        //退出房间失败
        else {
            AppGame.ins.showTips({data:data.errorMsg,type:ETipType.onlyone});
        }
    }

    /**
     * 退出游戏
     */
    exitGame(): void {
        UDebug.Log("this._state:" + this._state);
        switch (this._state) {
            case EDDZState.Gameing:
            case EDDZState.LeftGame:
                {
                    if (this._battleplayer[AppGame.ins.roleModel.useId].userStatus == 5) {
                        AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
                    } else {
                        AppGame.ins.gamebaseModel.requestLeftHy(this._roomInfo.gameId, this._roomInfo.roomId, AppGame.ins.roleModel.useId, ELeftType.LeftGame);
                    }
                }
                break;
            case EDDZState.Watching:
            case EDDZState.Match:
            case EDDZState.Wait:
                {
                    if (this._roomInfo) {
                        AppGame.ins.gamebaseModel.requestLeftHy(this._roomInfo.gameId, this._roomInfo.roomId, AppGame.ins.roleModel.useId, ELeftType.LeftGame);
                    } else {
                        AppGame.ins.loadLevel(ELevelType.Hall, EGameType.DDZ_HY);
                    }
                }
                break;
        }
    }
    /** 洗牌
     * */
    onWashCard(data: any) {
         this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_WASH_CARD_RESULT, data);
    }
    /** 游戏开始
     * */
    onGameStartJoin(data: any) {
         this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_UPDATE_ROOM_INFO, data);
    }
    /** 通知客户端配置
     * */
    onGameConfig(data: any) {
        this._gameConfig = JSON.parse(data.JsonString);
        if(!data.ParserJsonSuccess){
            AppGame.ins.showTips({data:"服务端解析json字符串失败!"});
        }
    }
    /** 空闲场景消息
     * */
    onGameSceneFree(data: any) {
         this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_UPDATE_ROOM_INFO, data);
    }
    /** 游戏结束
     * */
    onGameOver(data: any) {
         this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_UPDATE_ROOM_INFO, data);
    }
    /** 解散房间，弹窗退出
     * */
    onDissmisResult(data: any) {

        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_DISSMISS_ROOM_SHOW_RECORE, data);
    }
    /** 预解散 一轮结束/提前结束
     * */
    onAllOverShowRecord(data: any) {
        for (let key in this._battleplayer) {
            this._battleplayer[key].userStatus = 3;
        }
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_ALL_OVER_SHOW_RECORE, data);
    }
    /** 玩家准备
     * */
    onReady(data: any) {
        if(data.retCode == 0){
            this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_READY_RESULT, data);
        }else{
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: EMsgType.EOK,
                data: data.errorMsg,
                handler: UHandler.create((v: boolean) => {
                    // AppGame.ins.ddzModel_hy.exitGame();
                })
            })
        }
    }
    /** 旁观
     * */
    onLookOn(data: any) {
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_LOOKON_RESULT, data);
    }

    /** 提前结算 
     *  */
    onConcludeResult(data: any) {
        if(data.retCode == 0){
            if(!ddz_Main_hy.ins.isRoomHost)AppGame.ins.showTips(ULanHelper.GAME_HY.CHECK_OUT_TIP);
        }else if(ddz_Main_hy.ins.isRoomHost){
            AppGame.ins.showTips(data.errorMsg);
        }
    }
    /** 一局结算后，玩家状态切换
     * */
    onChangeUserStatus(data: any) {
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_CHANGE_USER_STATUS, data)

    }
    /** 再来一轮
     * */
    onAgainRoomGame(data: any) {
        if (data.retCode == 0){
            this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_AGAIN_ROOM_GAME, data)
        }else if(ddz_Main_hy.ins.isRoomHost && data.retCode == 2){//只提示房主
            this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_AGAIN_ROOM_GAME_UPDATE, data)
        }
    }
    /**游戏开始 */
    onGameStart(data: any) {
        //框架不支持，手动修改用户状态
        for(var k in this._battleplayer){
            this._battleplayer[k].userStatus = 5
        }
        this._gameStatus = MDDZModel_hy.DDZ_GAMESTATUS.SEND
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_START, data)
    }

    /**叫庄 */
    onCallBanker(data: any) {
        this._gameStatus = MDDZModel_hy.DDZ_GAMESTATUS.CALL
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_CALL_BANKER, data)
    }

    /** 1 叫庄结果 1 2 3 分 */
    onCallBankerResult(data: any) {
        this._gameStatus = MDDZModel_hy.DDZ_GAMESTATUS.END
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_CALL_BANKER_RESULT, data)
    }

    /**叫抢地主通知 */
    onCallFightStart(data: any) {
        this._gameStatus = MDDZModel_hy.DDZ_GAMESTATUS.LANDLORD
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_CALL_BANKER, data)
    }

    /**2 叫抢地主结果  */
    onCallFightResult(data: any) {
        this._gameStatus = MDDZModel_hy.DDZ_GAMESTATUS.END
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_CALL_BANKER_RESULT, data)
    }

    /**下注通知 */
    onAddScore(data: any) {
        this._gameStatus = MDDZModel_hy.DDZ_GAMESTATUS.SCORE
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_ADD_SCORE, data)
    }

    /**下注结果 */
    onAddScoreResult(data: any) {
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_ADD_SCORE_RESULT, data)
    }

    /**游戏倍率 */
    onBetLevel(data: any) {
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_BET_LEVEL, data)
    }

    /*地主信息*/
    onBankerInfo(data: any) {
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_BANKER_INFO, data)
    }

    /*出牌通知*/
    onOutCard(data: any) {
        this._gameStatus = MDDZModel_hy.DDZ_GAMESTATUS.OUT
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_OUT_CARD, data)
    }

    /*出牌结果*/
    onOutCardResult(data: any) {
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_OUT_CARD_RESULT, data)
    }

    /*跟牌通知*/
    onFollowCard(data: any) {
        this._gameStatus = MDDZModel_hy.DDZ_GAMESTATUS.FOLLOW
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_FOLLOW_CARD, data)
    }

    /*过牌通知*/
    onPassResult(data: any) {
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_PASS_RESLUT, data)
    }

    //托管结果
    onTrustResult(data:any){
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_TRUST_RESULT, data)
    }

    /**游戏结束 */
    onGameEnd(data: any) {
        this._gameStatus = MDDZModel_hy.DDZ_GAMESTATUS.OVER
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_END, data)
        this._state = EDDZState.Wait
    }
    /**通知消息 */
    onNotifyMsg(data: any) {
        if(data.msg != null){
            AppGame.ins.showTips(data.msg);
        }
    }

    //设置同桌IP限制
    onSetIpLimitResult(data: any) {
        data.type = 1;
        if (ddz_Main_hy.ins.roomInfo) {
            ddz_Main_hy.ins.roomInfo.bIPLimit = data.bLimit;
        }
        AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_SETTING_PANEL, data);
    }
    //设置自动开局
    onSetAutoStartResult(data: any) {
        if (ddz_Main_hy.ins.roomInfo) {
            ddz_Main_hy.ins.roomInfo.bAutoStart = data.bAutoStart;
        }
        AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_SETTING_PANEL, data);
    }
    //点击聊天限制
    onSetChatLimitResult(data: any) {
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_CHAT_SETTING, data)
    }
    //15分钟超时消息
    onOverTimeoutResult(data: any) {
        if (data.retCode == 0 && data.idleLeave <= 0) {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: EMsgType.EOK,
                data: ULanHelper.GAME_HY.TIME_OUT,
                handler: UHandler.create((v: boolean) => {
                    AppGame.ins.ddzModel_hy.exitGame();
                })
            })
        }
        this.emit(UDDZHelper_hy.DDZ_EVENT.DDZ_IDLE_TIMEOUT_RESULT, data)
    }
    /*********************************************** 通用逻辑处理 *************************************/
    //获得视图ID
    getUISeatId(wChairId: number): number {
        if (wChairId > this._MaxPlayer)
            return null;

        if (this._wMeChairId == null)
            return wChairId;

        var wViewChairID = wChairId + this._MaxPlayer - this._wMeChairId;
        return wViewChairID % this._MaxPlayer;
    }

    //提示大过上家的牌型
    getPrompt(){
        this.selectPokers = []
        //飞机和四带二
        this.pokerLibrary.splitToPlane = AppGame.ins.ddzModel_hy.firstOutCardType == CardType.TYPE_FOUR_TWO_PAIR ? false : true
        //三带一和三不带
        var needChangeType = AppGame.ins.ddzModel_hy.firstOutCardType == CardType.TYPE_WING_ONE ? true : false
        this.PromptList = this.pokerLibrary.searchByCards(this.otherOutPokers, this.handPokers,needChangeType)
        UDebug.Log("当前手牌" + JSON.stringify(this.handPokers))
        // UDebug.Log("提示数据-------------------------" + JSON.stringify(this.PromptList))
        if (this.PromptList.length > 0) {
            this.selectPokers = this.PromptList[this.PromptIndex]
            this.PromptIndex++
            if (this.PromptIndex >= this.PromptList.length) {
                this.PromptIndex = 0
            }
        }
        return this.selectPokers
    }

    //清除提示数据
    clearSelectPokers() {
        this.selectPokers = []
        this.PromptIndex = 0
        this.PromptList = []
    }

/*********************************************** 发送消息 *************************************/
     //请求准备
    sendReady() {
        this.sendMsg(FDdz.SUBID.SUB_C_READY,{});
    }
     //旁观
    sendLookOn() {
        this.sendMsg(FDdz.SUBID.SUB_C_LOOKON,{});
    }
     //提前结算
    sendConcludeResult() {
        this.sendMsg(FDdz.SUBID.SUB_C_CONCLUDE,{});
    }
     //获取实时战绩
    sendGetGameRecord(userGameKindId:string) {
        AppGame.ins.roomModel.requestRecord(userGameKindId);
    }

    //设置同桌IP限制
    sendSetIpLimitResult(data: any) {
        this.sendMsg(FDdz.SUBID.SUB_C_SET_IP_LIMIT, data);
    }
    //设置自动开局
    sendSetAutoStartResult(data: any) {
        this.sendMsg(FDdz.SUBID.SUB_C_SET_AUTO_START, data);
    }
    //设置Chat
    sendChatResult(data: any) {
        this.sendMsg(FDdz.SUBID.SUB_C_SET_CHAT_LIMIT, data);
    }
     //请求叫庄
    sendCallBanker(score: number) {
        var data = {
            score: score,
        }
        this.sendMsg(FDdz.SUBID.SUB_C_CALL_SCORE, data);
    }
     //请求叫庄 抢地主模式  1：叫 2：不叫 3：抢 4：不抢
    sendCallBanker2(value) {
        this.sendMsg(FDdz.SUBID.SUB_C_CALL_FIGHT, {jdz:value});
    }

    //请求加倍
    sendAddScore(Flag: boolean) {
        var data = {
            jiabei: Flag,
        }
        this.sendMsg(FDdz.SUBID.SUB_C_JIABEI, data);
    }

    //请求出牌
    sendOutCard(type:number) {
        var data = {
            cardtype: type,
            cards: this.selectPokers,
        }
        AppGame.ins.ddzModel_hy.sendMsg(FDdz.SUBID.SUB_C_CHUPAI, data);
    }

    //过牌
    sendPassCard() {
        this.sendMsg(FDdz.SUBID.SUB_C_PASS, {});
    }
    //再来一轮
    sendAgainRoomGame() {
        this.sendMsg(FDdz.SUBID.SUB_C_AGAIN, {});
    }

    //托管
    sendTrust(flay:boolean){
        var data = {
            istuoguan : flay
        }
        this.sendMsg(FDdz.SUBID.SUB_C_TUOGUAN, data);
    }

    /**
     * 发送聊天内容
     * @param faceId 表情id 默认 -1
     * @param message 聊天内容 默认""
     * @param type  默认 3
     */
    onSendChartMessage(faceId: number = -1,message: string = "",type:number = 3) {
        let data = {
            message: message,
            faceId: faceId ,
            type: type,
        }
        AppGame.ins.ddzModel_hy.sendMsg(FDdz.SUBID.SUB_C_MESSAGE, data);
    }
}   
