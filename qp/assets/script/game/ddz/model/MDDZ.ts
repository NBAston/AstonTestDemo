import Model from "../../../common/base/Model";
import { RoomInfo, RoomPlayerInfo } from "../../../public/hall/URoomClass";
import AppGame from "../../../public/base/AppGame";
import MBaseGameModel from "../../../public/hall/MBaseGameModel";
import { Ddz, Game } from "../../../common/cmd/proto";
import UHandler from "../../../common/utility/UHandler";
import UMsgCenter from "../../../common/net/UMsgCenter";
import { EGameType, ELeftType, ELevelType, ERoomKind } from "../../../common/base/UAllenum";
import UDebug from "../../../common/utility/UDebug";
import ULanHelper from "../../../common/utility/ULanHelper";
import UDDZHelper, { ChatMsgType, EDDZState, ReceiveChairidType } from "../ddz_Helper";
import ddz_Library, { CardType } from "../ddz_Library";
import ddz_Main from "../ddz_Main";
import { GAME_STATUS } from "../../bcbm/cfg_bcbm";

/**
 * 创建:dz
 * 作用:数据逻辑
 */
export default class MDDZModel extends Model {

    static DDZ_GAMESTATUS = {
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
    private bankerIndex: number = 0
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

    /**本局的玩家 */
    private _battleplayer: { [key: number]: RoomPlayerInfo } = {};

    get gBattlePlayer(): { [key: number]: RoomPlayerInfo } {
        return this._battleplayer;
    }

    //牌库
    public pokerLibrary:ddz_Library = null

    //当前轮主动出牌的玩家
    public  firstOutChairId: number = -1

    //当前轮主动出牌打出的牌型
    public  firstOutCardType: number = -1

    //上局的桌子ID
    public lastTableId: number = -1

    init(): void {
        this.pokerLibrary = new ddz_Library();
        //开始游戏
        this.regesterMsg(Ddz.SUBID.SUB_S_GAME_FAPAI, new UHandler(this.onGameStart, this))
        //叫庄通知
        this.regesterMsg(Ddz.SUBID.SUB_S_CALL_SCORE, new UHandler(this.onCallBanker, this));
        //叫庄结果
        this.regesterMsg(Ddz.SUBID.SUB_S_CALL_SCOR_RESULT, new UHandler(this.onCallBankerResult, this));
        //地主信息
        this.regesterMsg(Ddz.SUBID.SUB_S_DZ_INFO, new UHandler(this.onBankerInfo, this));
        //玩家倍率
        this.regesterMsg(Ddz.SUBID.SUB_S_NOTIFY_BEILV, new UHandler(this.onBetLevel, this));
        //加倍通知
        this.regesterMsg(Ddz.SUBID.SUB_S_JIABEI, new UHandler(this.onAddScore, this));
        //加倍结果
        this.regesterMsg(Ddz.SUBID.SUB_S_JIABEI_RESULT, new UHandler(this.onAddScoreResult, this));
        //出牌通知
        this.regesterMsg(Ddz.SUBID.SUB_S_CHUPAI, new UHandler(this.onOutCard, this));  
        //出牌结果
        this.regesterMsg(Ddz.SUBID.SUB_S_NOTIFY_CHUPAI_INFO, new UHandler(this.onOutCardResult, this));
        //跟牌通知
        this.regesterMsg(Ddz.SUBID.SUB_S_FOLLOW, new UHandler(this.onFollowCard , this)); 
        //过牌结果
        this.regesterMsg(Ddz.SUBID.SUB_S_NOTIFY_PASS_INFO, new UHandler(this.onPassResult , this)); 
        //托管
        this.regesterMsg(Ddz.SUBID.SUB_S_NOTIFY_TUOGUAN, new UHandler(this.onTrustResult, this));  
        //聊天结果
        this.regesterMsg(Ddz.SUBID.SUB_S_NOTIFY_CHART_MESSAGE, new UHandler(this.onChatResult, this)); 
        //游戏结束
        this.regesterMsg(Ddz.SUBID.SUB_S_NOTIFY_GAME_RESULT, new UHandler(this.onGameEnd, this));  
        //通知消息
        this.regesterMsg(Ddz.SUBID.SUB_S_NOTIFY_MESSAGE, new UHandler(this.onNotifyMsg, this));

        //----------------------------------------场景消息------------------------------------------
        this.regesterMsg(Ddz.SUBID.SC_GAMESCENE_JDZ, new UHandler(this.onGameSceneCall , this));
        this.regesterMsg(Ddz.SUBID.SC_GAMESCENE_DOUBLE, new UHandler(this.onGameSceneScore , this));
        this.regesterMsg(Ddz.SUBID.SC_GAMESCENE_PLAY, new UHandler(this.onGameScenePlay , this));
    }

    exit(): void {
        super.exit();
        this.resetData();
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.user_status_notify, this);

        this.unregesterMsg(Ddz.SUBID.SUB_S_GAME_FAPAI, new UHandler(this.onGameStart, this));
        this.unregesterMsg(Ddz.SUBID.SUB_S_CALL_SCORE, new UHandler(this.onCallBanker, this));
        this.unregesterMsg(Ddz.SUBID.SUB_S_CALL_SCOR_RESULT, new UHandler(this.onCallBankerResult, this));
        this.unregesterMsg(Ddz.SUBID.SUB_S_NOTIFY_BEILV, new UHandler(this.onBetLevel, this));
        this.unregesterMsg(Ddz.SUBID.SUB_S_DZ_INFO, new UHandler(this.onBankerInfo, this));
        this.unregesterMsg(Ddz.SUBID.SUB_S_JIABEI, new UHandler(this.onAddScore, this));
        this.unregesterMsg(Ddz.SUBID.SUB_S_JIABEI_RESULT, new UHandler(this.onAddScoreResult, this));
        this.unregesterMsg(Ddz.SUBID.SUB_S_CHUPAI, new UHandler(this.onOutCard, this));  
        this.unregesterMsg(Ddz.SUBID.SUB_S_NOTIFY_CHUPAI_INFO, new UHandler(this.onOutCardResult, this));   
        this.unregesterMsg(Ddz.SUBID.SUB_S_FOLLOW, new UHandler(this.onFollowCard , this)); 
        this.unregesterMsg(Ddz.SUBID.SUB_S_NOTIFY_PASS_INFO, new UHandler(this.onPassResult , this)); 
        this.unregesterMsg(Ddz.SUBID.SUB_S_NOTIFY_TUOGUAN, new UHandler(this.onTrustResult, this));
        this.unregesterMsg(Ddz.SUBID.SUB_S_NOTIFY_GAME_RESULT, new UHandler(this.onGameEnd, this));  

        this.unregesterMsg(Ddz.SUBID.SC_GAMESCENE_JDZ, new UHandler(this.onGameSceneCall , this));
        this.unregesterMsg(Ddz.SUBID.SC_GAMESCENE_DOUBLE, new UHandler(this.onGameSceneScore , this));
        this.unregesterMsg(Ddz.SUBID.SC_GAMESCENE_PLAY, new UHandler(this.onGameScenePlay , this));
        this.unregesterMsg(Ddz.SUBID.SUB_S_NOTIFY_MESSAGE, new UHandler(this.onNotifyMsg, this));

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
        this.bankerIndex = null
        this._gameStatus = 0
        if (AppGame.ins.currRoomKind == ERoomKind.Normal){
            this._battleplayer = {}
            this._wMeChairId = null
        }

        if (AppGame.ins.currRoomKind == ERoomKind.Club){
            for(var k in this._battleplayer){
                if(this._battleplayer[k].userStatus == 0) 
                delete this._battleplayer[k]
            }
            //刷新用户列表 
            this.emit(UDDZHelper.DDZ_SELF_EVENT.DDZ_UPDATE_PLAYERS_EVENT, this._battleplayer)
        }
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
        UMsgCenter.ins.regester(EGameType.DDZ,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    }

    unregesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.unregester(EGameType.DDZ,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    }

    /** 发送网络消息*/
    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(EGameType.DDZ,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId, data, handler, unlock);
    }
    

    /***********************************************************接受消息**********************************/
    /**玩家状态 */
    private user_status_notify(userid: number, status: number) {
        if (this._battleplayer && this._battleplayer[userid]) {
            this._battleplayer[userid].userStatus = status
        }
    }

    /************* scene *****************/
    //叫地主
    onGameSceneCall(data: any) {
        UDebug.Log("onGameSceneCall-----------------------" + JSON.stringify(data))
        this._state = EDDZState.Gameing
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
        this.onCallBanker(data_cmd_s_callscore)
        //金币场上一桌
        if (AppGame.ins.currRoomKind == ERoomKind.Normal) 
        this.lastTableId = data.tableid

        
    }
   
    //加倍
    onGameSceneScore(data: any) {
        UDebug.Log("onGameSceneScore-----------------------" + JSON.stringify(data))
        this._state = EDDZState.Gameing
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
        this.onAddScore(data_cmd_s_jiabei)
        //金币场上一桌
        if (AppGame.ins.currRoomKind == ERoomKind.Normal) 
        this.lastTableId = data.tableid

    
    }

    //出牌中
    onGameScenePlay(data: any) {
        UDebug.Log("onGameScenePlay-----------------------" + JSON.stringify(data))
        this._state = EDDZState.Gameing
        var isFollowCard = false
        var playerbeilvList = []
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
        this.emit(UDDZHelper.DDZ_SELF_EVENT.DDZ_RECONNECT_OUT_CARD, data.outcarddatas)

        //金币场上一桌
        if (AppGame.ins.currRoomKind == ERoomKind.Normal) 
        this.lastTableId = data.tableid
    }

    /**出牌失败通知消息 */
    onNotifyMsg(data: any) {
        if(data.msg){
            AppGame.ins.showTips(data.msg);
        }
    }

    /**玩家进入房间 */
    private sc_ts_room_playerinfo(data: any) {
        var element: RoomPlayerInfo = data
        this._battleplayer[element.userId] = element
        if (element.userId == AppGame.ins.roleModel.useId) {
            this._wMeChairId = element.chairId;
        }
        if (this.gameStatus != MDDZModel.DDZ_GAMESTATUS.OVER)
        this.emit(UDDZHelper.DDZ_SELF_EVENT.DDZ_UPDATE_PLAYERS_EVENT, this._battleplayer)
    }

    /**玩家离开房间,针对自己 */ 
    private sc_ts_player_left_room(data: any) {
        UDebug.Log("sc_ts_player_left_room:" + JSON.stringify(data));
        //退出房间成功
        if (data.retCode == 0) {
            if (data.type == ELeftType.ReturnToRoom) {
                if (this._roomInfo) {
                    //关闭结算等待时钟
                    clearInterval(ddz_Main.ins.clockStartMatch)
                    clearInterval(ddz_Main.ins.clockShowResult)
                    AppGame.ins.loadLevel(ELevelType.Hall, this._roomInfo.gameId);
                } else {
                    AppGame.ins.loadLevel(ELevelType.Hall);
                }
            } else if (data.type == ELeftType.CancleMatch) {
                this.emit(UDDZHelper.DDZ_SELF_EVENT.DDZ_SC_TS_CANCLE_MATCH, true);
                this._state = EDDZState.Wait;
            } else if (data.type == ELeftType.LeftGame) {
                this._battleplayer = {};
                this._wMeChairId = 0;
                this._state = EDDZState.Match;
                this.emit(UDDZHelper.DDZ_SELF_EVENT.DDZ_SC_TS_START_MATCH);
            }
        }
        //退出房间失败
        else {
            if (data.type == ELeftType.ReturnToRoom) {
                AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
            }
            else if (data.type == ELeftType.CancleMatch) {
                if (this._state != EDDZState.Gameing) {
                    this.emit(UDDZHelper.DDZ_SELF_EVENT.DDZ_SC_TS_CANCLE_MATCH, false);
                }
                if (data.errorMsg) {
                    AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
                }
            } else if (data.type == ELeftType.LeftGame) {
                this.emit(UDDZHelper.DDZ_SELF_EVENT.DDZ_SC_TS_START_MATCH);
            }
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
                        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, AppGame.ins.roleModel.useId, ELeftType.ReturnToRoom);
                    }
                }
                break;
            case EDDZState.Watching:
            case EDDZState.Match:
            case EDDZState.Wait:
                {
                    if (this._roomInfo) {
                        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, AppGame.ins.roleModel.useId, ELeftType.ReturnToRoom);
                    } else {
                        AppGame.ins.loadLevel(ELevelType.Hall, EGameType.DDZ);
                    }
                }
                break;
        }
    }
 
    /**游戏开始 */
    onGameStart(data: any) {
        //框架不支持，手动修改用户状态
        for(var k in this._battleplayer){
            this._battleplayer[k].userStatus = 5
        }
        this._gameStatus = MDDZModel.DDZ_GAMESTATUS.SEND
        this._state = EDDZState.Gameing
        this.emit(UDDZHelper.DDZ_EVENT.DDZ_GAME_START, data)
    }

    /**叫庄 */
    onCallBanker(data: any) {
        this._gameStatus = MDDZModel.DDZ_GAMESTATUS.CALL
        this.emit(UDDZHelper.DDZ_EVENT.DDZ_CALL_BANKER, data)
    }

    /**叫庄结果 */
    onCallBankerResult(data: any) {
        this.emit(UDDZHelper.DDZ_EVENT.DDZ_CALL_BANKER_RESULT, data)
    }

    /**下注通知 */
    onAddScore(data: any) { 
        this._gameStatus = MDDZModel.DDZ_GAMESTATUS.SCORE
        this.emit(UDDZHelper.DDZ_EVENT.DDZ_ADD_SCORE, data)
    }

    /**下注结果 */
    onAddScoreResult(data: any) { 
        this.emit(UDDZHelper.DDZ_EVENT.DDZ_ADD_SCORE_RESULT, data)
    }

    /**游戏倍率 */
    onBetLevel(data: any) {
        this.emit(UDDZHelper.DDZ_EVENT.DDZ_GAME_BET_LEVEL, data)
    }

    /*地主信息*/
    onBankerInfo(data: any) {
        this.emit(UDDZHelper.DDZ_EVENT.DDZ_BANKER_INFO, data)
    }

    /*出牌通知*/
    onOutCard(data: any) {
        this._gameStatus = MDDZModel.DDZ_GAMESTATUS.OUT
        this.emit(UDDZHelper.DDZ_EVENT.DDZ_OUT_CARD, data)
    }

    /*出牌结果*/
    onOutCardResult(data: any) {
        this.emit(UDDZHelper.DDZ_EVENT.DDZ_OUT_CARD_RESULT, data)
    }

    /*跟牌通知*/
    onFollowCard(data: any) {
        this._gameStatus = MDDZModel.DDZ_GAMESTATUS.FOLLOW
        this.emit(UDDZHelper.DDZ_EVENT.DDZ_FOLLOW_CARD, data)
    }

    /*过牌通知*/
    onPassResult(data: any) {
        this.emit(UDDZHelper.DDZ_EVENT.DDZ_PASS_RESLUT, data)
    }

    //托管结果
    onTrustResult(data:any){
        this.emit(UDDZHelper.DDZ_EVENT.DDZ_TRUST_RESULT, data)
    }

    //托管结果
    onChatResult(data:any){
        this.emit(UDDZHelper.DDZ_EVENT.DDZ_NOTIFY_CHAT_MESSAGE, data)
    }

    /**游戏结束 */
    onGameEnd(data: any) {
        if (AppGame.ins.currRoomKind == ERoomKind.Club){
            if (this._battleplayer[AppGame.ins.roleModel.useId]){
                this._battleplayer[AppGame.ins.roleModel.useId].userStatus = 4
                if (data.gameresult[AppGame.ins.ddzModel.gMeChairId])
                this._battleplayer[AppGame.ins.roleModel.useId].score = data.gameresult[AppGame.ins.ddzModel.gMeChairId].currentsocre
            }
        }
        this._gameStatus = MDDZModel.DDZ_GAMESTATUS.OVER
        this.emit(UDDZHelper.DDZ_EVENT.DDZ_GAME_END, data)
        this._state = EDDZState.Wait
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
        this.pokerLibrary.splitToPlane = AppGame.ins.ddzModel.firstOutCardType == CardType.TYPE_FOUR_TWO_PAIR ? false : true
        //三带一和三不带
        var needChangeType = AppGame.ins.ddzModel.firstOutCardType == CardType.TYPE_WING_ONE ? true : false
        this.PromptList = this.pokerLibrary.searchByCards(this.otherOutPokers, this.handPokers,needChangeType)
        UDebug.Log("当前手牌" + JSON.stringify(this.handPokers))
        UDebug.Log("提示数据-------------------------" + JSON.stringify(this.PromptList))
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
     //请求叫庄
    sendCallBanker(score: number) {
        var data = {
            score: score,
        }
        this.sendMsg(Ddz.SUBID.SUB_C_CALL_SCORE, data);
    }

    //请求加倍
    sendAddScore(Flag: boolean) {
        var data = {
            jiabei: Flag,
        }
        this.sendMsg(Ddz.SUBID.SUB_C_JIABEI, data);
    }

    //请求出牌
    sendOutCard(type:number) {
        var data = {
            cardtype: type,
            cards: this.selectPokers,
        }
        AppGame.ins.ddzModel.sendMsg(Ddz.SUBID.SUB_C_CHUPAI, data);
    }

    //过牌 
    sendPassCard() {
        this.sendMsg(Ddz.SUBID.SUB_C_PASS, {});
    }

    //托管
    sendTrust(flay:boolean){
        var data = {
            istuoguan : flay
        }
        this.sendMsg(Ddz.SUBID.SUB_C_TUOGUAN, data);
    }

    /**
     * 发送聊天内容
     * @param sendchairid 发送消息的座位号
     * @param recvchairid 接收消息的座位号
     * @param msgtype 消息类型
     * @param msgbody 消息内容 文本
     */
    onSendChartMessage(sendchairid: number, recvchairid: ReceiveChairidType, msgtype: ChatMsgType, msgbody: string) {
        var data = {
            chartmessage: {
                sendchairid: sendchairid,
                recvchairid: recvchairid,
                msgtype: msgtype,
                msgbody: msgbody
            }
        }
        AppGame.ins.ddzModel.sendMsg(Ddz.SUBID.SUB_C_CHART_MESSAGE, data);
    }
}   
