import { RoomPlayerInfo, RoomInfo } from "../../../public/hall/URoomClass";
import Model from "../../../common/base/Model";
import AppGame from "../../../public/base/AppGame";
import MBaseGameModel from "../../../public/hall/MBaseGameModel";
import UMsgCenter from "../../../common/net/UMsgCenter";
import { EGameType, ELeftType, ELevelType, ETipType } from "../../../common/base/UAllenum";
import { GameServer, suoha } from "../../../common/cmd/proto";
import UHandler from "../../../common/utility/UHandler";
import ULanHelper from "../../../common/utility/ULanHelper";
import UDebug from "../../../common/utility/UDebug";
import MRoomModel from "../../../public/hall/room_zjh/MRoomModel";

export const SH_SCALE = 0.01;

/**
 * 梭哈model
 */
export default class SHModel extends Model {

    public _roomInfo: RoomInfo;//房间信息
    public isBack: boolean = false;//是否切换到后台
    public receive: boolean = true;//是否接收消息
    public isGame: boolean = false;//是否点击继续游戏
    public gameState: boolean = true;//判断是否可以离开游戏
    private logic: number = 4;//网络请求数值
    public isOneChat: boolean = true;//是否第一次打开聊天界面
    public dataAny: any[] = [];

    public tableId: number = 0;//牌桌ID
    public carryingGold: number = 0;//带入金额

    static s_ins: SHModel;//梭哈model
    static get ins(): SHModel {
        if (SHModel.s_ins == null) {
            SHModel.s_ins = new SHModel();
            SHModel.s_ins.init();
        }
        return SHModel.s_ins;
    }

    //10进制牌值对应的16进制值
    card16: number[] = [
        17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, //方块
        33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, //梅花
        49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, //红心
        65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, //黑桃
    ];

    run(): void {
        super.run();
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_ENTER_GAME, this.sc_ts_enter_game, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.sc_ts_player_start_change, this);
    }

    exit(): void {
        super.exit();
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ENTER_GAME, this.sc_ts_enter_game, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.sc_ts_player_start_change, this);
    }

    init(): void {
        /**这三个命令 不是流程控制 是正常进入 断线重连  */
        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_SC_GAMESCENE_FREE, new UHandler(this.CMD_S_StatusFree, this));
        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_SC_GAMESCENE_PLAY, new UHandler(this.CMD_S_StatusPlay, this));
        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_SC_GAMESCENE_END, new UHandler(this.CMD_S_StatusEnd, this));

        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_S_GAME_START, new UHandler(this.CMD_S_GameStart, this));
        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_S_ADD_SCORE, new UHandler(this.CMD_S_AddScore, this));
        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_S_GIVE_UP, new UHandler(this.CMD_S_GiveUp, this));
        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_S_PASS_SCORE, new UHandler(this.CMD_S_PassScore, this));
        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_S_LOOK_CARD, new UHandler(this.CMD_S_LookCard, this));
        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_S_ALL_IN, new UHandler(this.CMD_S_AllIn, this));
        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_S_GAME_END, new UHandler(this.CMD_S_GameEnd, this));
        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_S_SEND_CARD, new UHandler(this.CMD_S_SendCard, this));
        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_S_ANDROID_CARD, new UHandler(this.CMD_S_AndroidCard, this));
        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_S_OPERATE_NOTIFY, new UHandler(this.CMD_S_Operate_Notify, this));
        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_S_ROUND_END_EXIT_RESULT, new UHandler(this.CMD_S_RoundEndExitResult, this));

        AppGame.ins.roomModel.on(MRoomModel.GAME_INFORM_MESSAGE, this.onInformMessage, this);  //聊天消息
        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_S_TAKESCORE, new UHandler(this.onCarrying, this));//设置携带
        UMsgCenter.ins.regester(EGameType.SH, this.logic, suoha.SUBID.SUB_S_BROADCASTTAKESCORE, new UHandler(this.CMD_S_BroadcastTakeScore, this));//广播携带分
    }

    //发送网络消息
    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(EGameType.SH, this.logic, subId, data, handler, unlock);
    }

    //==================================消息推送==============================

    //进入房间
    private sc_ts_enter_game() {
        if (this.isBack) return;//切换后台，不接收消息
        this.emit(MBaseGameModel.SC_TS_ENTER_GAME);
    }

    //当前进入房间玩家信息
    private sc_ts_room_playerinfo(data: RoomPlayerInfo) {
        if (this.isBack) return;//切换后台，不接收消息
        this.tableId = data.tableId;
        this.emit(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, data);
    }

    //空闲场景消息
    private CMD_S_StatusFree(data: suoha.CMD_S_StatusFree): void {
        if (this.isBack) return;//切换后台，不接收消息
        this.receive=true;
        this.emit("CMD_S_StatusFree", data);
    }

    //游戏中场景消息
    private CMD_S_StatusPlay(data: suoha.CMD_S_StatusPlay): void {
        if (this.isBack) return;//切换后台，不接收消息
        this.receive=true;
        this.emit("CMD_S_StatusPlay", data);
    }

    //游戏结束场景
    private CMD_S_StatusEnd(data: suoha.CMD_S_StatusEnd): void {
        if (this.isBack) return;//切换后台，不接收消息
        this.receive=true;
        this.emit("CMD_S_StatusEnd", data);
    }

    //游戏开始
    private CMD_S_GameStart(data: suoha.CMD_S_GameStart): void {
        if (this.isBack) return;//切换后台，不接收消息
        if (!this.receive) return;//没有收到切后台消息返回前，不接收消息
        this.gameState = false;//游戏开始不能离开游戏
        this.emit("CMD_S_GameStart", data);
    }

    //接收加注、跟注
    private CMD_S_AddScore(data: suoha.CMD_S_AddScore) {
        if (this.isBack) return;//切换后台，不接收消息
        if (!this.receive) return;//没有收到切后台消息返回前，不接收消息
        this.emit("CMD_S_AddScore", data);
    }

    //用户弃牌
    private CMD_S_GiveUp(data: suoha.CMD_S_GiveUp) {
        if (this.isBack) return;//切换后台，不接收消息
        if (!this.receive) return;//没有收到切后台消息返回前，不接收消息
        this.emit("CMD_S_GiveUp", data);
    }

    //让牌
    private CMD_S_PassScore(data: suoha.CMD_S_PassScore) {
        if (!this.receive) return;//没有收到切后台消息返回前，不接收消息
        if (this.isBack) return;//切换后台，不接收消息
        this.emit("CMD_S_PassScore", data);
    }

    //看牌
    private CMD_S_LookCard(data: suoha.CMD_S_LookCard) {
        if (this.isBack) return;//切换后台，不接收消息
        if (!this.receive) return;//没有收到切后台消息返回前，不接收消息
        this.emit("CMD_S_LookCard", data);
    }

    //孤注一掷 梭哈
    private CMD_S_AllIn(data: suoha.CMD_S_AllIn) {
        if (this.isBack) return;//切换后台，不接收消息
        if (!this.receive) return;//没有收到切后台消息返回前，不接收消息
        this.emit("CMD_S_AllIn", data);
    }

    //游戏结束
    private CMD_S_GameEnd(data: suoha.CMD_S_GameEnd) {
        if (this.isBack) return;//切换后台，不接收消息
        if (!this.receive) return;//没有收到切后台消息返回前，不接收消息
        this.gameState = true;
        this.emit("CMD_S_GameEnd", data);
    }

    //发牌
    private CMD_S_SendCard(data: suoha.CMD_S_SendCard) {
        if (this.isBack) return;//切换后台，不接收消息
        if (!this.receive) return;//没有收到切后台消息返回前，不接收消息
        this.emit("CMD_S_SendCard", data);
    }

    //机器人消息
    private CMD_S_AndroidCard(data: suoha.CMD_S_AndroidCard) {
        if (this.isBack) return;//切换后台，不接收消息
        if (!this.receive) return;//没有收到切后台消息返回前，不接收消息
        this.emit("CMD_S_AndroidCard", data);
    }

    //操作失败通知
    private CMD_S_Operate_Notify(data: suoha.CMD_S_Operate_Notify) {
        if (this.isBack) return;//切换后台，不接收消息
        if (!this.receive) return;//没有收到切后台消息返回前，不接收消息
        this.emit("CMD_S_Operate_Notify", data);
    }

    //本局结束后退出
    private CMD_S_RoundEndExitResult(data: suoha.CMD_S_RoundEndExitResult) {
        if (this.isBack) return;//切换后台，不接收消息
        if (!this.receive) return;//没有收到切后台消息返回前，不接收消息
        this.emit("CMD_S_RoundEndExitResult", data);
    }

    //==================================请求数据==============================

    //发送加注、跟注
    public jiazhu(opValue: number, addScore: number): void {
        let data = suoha.CMD_C_AddScore.create();
        data.opValue = opValue;
        data.addScore = addScore;
        this.sendMsg(suoha.SUBID.SUB_C_ADD_SCORE, data);
    }

    //让牌
    public rangPai(): void {
        let data = suoha.CMD_C_NULL.create();
        this.sendMsg(suoha.SUBID.SUB_C_PASS_SCORE, data);
    }

    //梭哈
    public suoha(): void {
        let data = suoha.CMD_C_NULL.create();
        this.sendMsg(suoha.SUBID.SUB_C_ALL_IN, data);
    }

    //弃牌
    public qipai(): void {
        let data = suoha.CMD_C_NULL.create();
        this.sendMsg(suoha.SUBID.SUB_C_GIVE_UP, data);
    }

    //看牌
    public kanpai(): void {
        let data = suoha.CMD_C_NULL.create();
        this.sendMsg(suoha.SUBID.SUB_C_LOOK_CARD, data);
    }

    //本局结束后退出
    public quitGame(isExit: boolean): void {
        let data = suoha.CMD_C_RoundEndExit.create();
        data.bExit = isExit;
        this.sendMsg(suoha.SUBID.SUB_C_ROUND_END_EXIT, data);
    }

    //取消匹配
    cancleMatch(): void {
        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, AppGame.ins.roleModel.useId, ELeftType.CancleMatch);
    }

    /**匹配 */
    requestMatch(): void {
        // AppGame.ins.roomModel.requestMatch(true, this.tableId);
    }


    //退出游戏
    exitGame(): void {
        if (this.gameState) {
            if (this._roomInfo) {
                AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, AppGame.ins.roleModel.useId, ELeftType.ReturnToRoom);
            } else {
                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.SH)
            }
        }
        else {
            AppGame.ins.showTips(ULanHelper.ZJH_CAN_EXIT_GAME);
        }
    }

    resetData(): void {

    }

    update(dt: number): void {

    }

    //离开房间消息
    private sc_ts_player_left_room(data: GameServer.MSG_C2S_UserLeftMessageResponse): void {
        if (!this.isGame) {
            if (data.retCode == 0) {
                if (data.type == ELeftType.ReturnToRoom) {
                    AppGame.ins.loadLevel(ELevelType.Hall, this._roomInfo.gameId);
                } else if (data.type == ELeftType.CancleMatch) {
                    this.emit("cancle_match");
                } else if (data.type == ELeftType.LeftGame) {
                    // AppGame.ins.roomModel.requestMatch(false, this.tableId);
                }
            } else {
                if (data.type == ELeftType.ReturnToRoom) {
                    AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
                }
                else if (data.type == ELeftType.CancleMatch) {
                    this.emit("cancle_match");
                } else if (data.type == ELeftType.LeftGame) {
                    this.emit("start_match");
                }
            }
            this.emit(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM);
        }
        else {
            //继续游戏
            this.emit("GoonGame");
        }
    }

    private sc_ts_player_start_change(userId: number, usStatus: number, data: GameServer.MSG_S2C_GameUserStatus): void {
        this.emit("sc_ts_player_start_change", usStatus, data);
    }

    /**保存房间数据 不能修改 */
    saveRoomInfo(data: RoomInfo): void {
        this._roomInfo = data;
    }


    /**收到聊天消息 */
    onInformMessage(data: any) {
        if (this.isOneChat) {
            this.dataAny.push(data);
        }
    }

    //设置携带
    public onCarryingAmount(takescore: number, autoset: boolean): void {
        let data = suoha.CMD_C_TakeScore.create();
        this.carryingGold = takescore;
        data.takescore = takescore;
        data.autoset = autoset;
        this.sendMsg(suoha.SUBID.SUB_C_TAKESCORE, data);
    }

    /**设置携带返回 */
    private onCarrying(data: any) {
        this.emit("CarryingAmountTips", data);
    }

    /**广播携带分 */
    private CMD_S_BroadcastTakeScore(data: suoha.CMD_S_BroadcastTakeScore) {
        if (this.isBack) return;//切换后台，不接收消息
        if (!this.receive) return;//没有收到切后台消息返回前，不接收消息
        this.emit("CMD_S_BroadcastTakeScore", data);
    }

    //切后台请求刷新数据
    sendFreshGameScene() {
        this.sendMsg(suoha.SUBID.CS_GAMESCENE_FRESH, {});
    }
}
