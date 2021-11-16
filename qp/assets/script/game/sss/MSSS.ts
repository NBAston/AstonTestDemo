import Model from "../../common/base/Model";
import { REGSSSSUB, USSSCmd, ESSSState, ESSSPlayerInfo } from "./ssshelp/USSSData";
import { RoomInfo, RoomPlayerInfo } from "../../public/hall/URoomClass";
import AppGame from "../../public/base/AppGame";
import MBaseGameModel from "../../public/hall/MBaseGameModel";
import { ECommonUI, ELeftType, ELevelType, EGameType, ERoomKind } from "../../common/base/UAllenum";
import ULanHelper from "../../common/utility/ULanHelper";
import UHandler from "../../common/utility/UHandler";
import { s13s, Game, GameServer } from "../../common/cmd/proto";
import UMsgCenter from "../../common/net/UMsgCenter";
import UDebug from "../../common/utility/UDebug";
import cfg_head from "../../config/cfg_head";




//**金币缩放比例 */
export const SSS_SCALE = 0.01;
export const SSS_SELF_SEAT = 0;
export const fapaitime = 0.18;

export default class MSSS extends Model {

    //游戏开始
    static GAME_START = "GAME_START"
    static CC_TS_SHOW_MATCH = "CC_TS_SHOW_MATCH"

    static CC_TS_SHOW_JIXU_BTN = "CC_TS_SHOW_JIXU_BTN"
    static CC_TS_UPDATA_GAME_INFO = "CC_TS_UPDATA_GAME_INFO"
    static CC_UPDATA_SEAT_INFO = "CC_UPDATA_SEAT_INFO"
    static CC_GAME_MANUAKCARD = "CC_GAME_MANUAKCARD"
    static CC_GAME_COMPARE = "CC_GAME_COMPARE"
    static CC_GAME_GAME_END = "CC_GAME_GAME_END"
    static CC_GAME_FINISHCARD = "CC_GAME_FINISHCARD"
    static CC_GAME_SCENE_FREE = "CC_GAME_SCENE_FREE"
    static CC_GAME_SCENE_GROUP = "CC_GAME_SCENE_GROUP"
    static CC_GAME_SCENE_OPEN = "CC_GAME_SCENE_OPEN"
    static CC_GAME_SCENE_END = "CC_GAME_SCENE_END"
    static CC_CLEAR_RES = "CC_CLEAR_RES"
    static CC_CANCELCARDS = "CC_CANCELCARDS"
    static CC_ROUNDEND_EXIT = "CC_ROUNDEND_EXIT"
    static PLAYER_EXIT = "PLAYER_EXIT"
    private _msgRegArr: Array<REGSSSSUB>
    private _cmds: Array<USSSCmd>;
    public _canGetCmd: boolean;
    static _tableId: number = 0;
    /**
    * 游戏状态
    */
    public _state: ESSSState = ESSSState.Wait;
    private _selfUISeatId: number = SSS_SELF_SEAT;
    /**
  * 房间信息
  */
    private _roomInfo: RoomInfo;
    private _battleplayer: { [key: number]: ESSSPlayerInfo } = {}
    get gBattlePlayer(): { [key: number]: ESSSPlayerInfo } {
        return this._battleplayer;
    }

    updateSeatInfo() {
        this.emit(MSSS.CC_UPDATA_SEAT_INFO, this._battleplayer);
    }
    private _selfPlayer: ESSSPlayerInfo;

    private _roomInfoCathe = false  //是否清空数据

    static s_ins: MSSS;
    static get ins(): MSSS {
        if (MSSS.s_ins == null) {
            MSSS.s_ins = new MSSS();
            MSSS.s_ins.init();
        }
        return MSSS.s_ins;
    }




    setGameState(state: ESSSState) {
        this._state = state

        if (this._state == ESSSState.Wait) {
            this._roomInfoCathe = false
        }
    }

    // onLoad () {}
    resetData(): void {
        this.clearCmds()
        this._roomInfo = null;
        this._battleplayer = {};
    }

    // onLoad () {}
    run(): void {
        super.run();
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.sc_ts_player_start_change, this);
    }

    exit(): void {
        super.exit();
        this.resetData();
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.sc_ts_player_start_change, this);

    }

    /**
     * 退出游戏按钮
    */
    exitGame(): void {
        UDebug.Log("this._state:" + this._state);
        switch (this._state) {
            case ESSSState.Gameing:
            case ESSSState.LeftGame: {
                if (this._battleplayer[AppGame.ins.roleModel.useId].userStatus == 5) {
                    AppGame.ins.showUI(ECommonUI.NewMsgBox, { type: 1, data: ULanHelper.SG_CANT_EXIT_GAME });
                } else {
                    AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                }


            }
                break;
            case ESSSState.Watching:
            case ESSSState.Wait:
            case ESSSState.Match: {
                if (this._roomInfo && !this._roomInfoCathe) {
                    this.emit(MSSS.CC_TS_SHOW_JIXU_BTN, false)
                    AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                } else {
                    this.emit(MSSS.CC_CLEAR_RES)
                    AppGame.ins.loadLevel(ELevelType.Hall, EGameType.SSS)
                }
            }
                break
        }
    }

    /**
     * 
     * @param jetton 倍数索引  
     */
    sendFreshGameScene() {
        UMsgCenter.ins.sendPkg(EGameType.SSS, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, s13s.SUBID.CS_GAMESCENE_FRESH, {});
    }

    start() {
    }


    init() {
        this._msgRegArr = [{ sub: s13s.SUBID.SUB_S_GAME_START, fun: this.sc_games_start },
        { sub: s13s.SUBID.SUB_S_MANUALCARDS, fun: this.sc_game_manualCards },
        { sub: s13s.SUBID.SUB_S_COMPARECARDS, fun: this.sc_game_compare },
        { sub: s13s.SUBID.SUB_S_GAME_END, fun: this.sc_game_end },
        { sub: s13s.SUBID.SUB_S_MAKESUREDUNHANDTY, fun: this.sc_game_finshCard },
        { sub: s13s.SUBID.SUB_S_CANCELCARDS, fun: this.sc_game_canceCard },
        { sub: s13s.SUBID.SUB_C_ROUND_END_EXIT_RESULT, fun: this.sc_game_RoundEndExiResult },

        { sub: s13s.SUBID.SUB_SC_GAMESCENE_FREE, fun: this.sc_gameScene_free },
        { sub: s13s.SUBID.SUB_SC_GAMESCENE_GROUP, fun: this.sc_gameScene_group },
        { sub: s13s.SUBID.SUB_SC_GAMESCENE_OPEN, fun: this.sc_gameScene_open },
        { sub: s13s.SUBID.SUB_SC_GAMESCENE_END, fun: this.sc_gameScene_end },
        ]
        this._msgRegArr.forEach(element => {
            UMsgCenter.ins.regester(EGameType.SSS, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
                element.sub, new UHandler(element.fun, this));
        });
    }


    sendNextExit(b: boolean): void {
        var data = {
            bExit: b,
        }
        UMsgCenter.ins.sendPkg(EGameType.SSS, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, s13s.SUBID.SUB_C_ROUND_END_EXIT, data);
    }

    /**保存房间数据 不能修改 */
    saveRoomInfo(data: RoomInfo): void {
        this._roomInfo = data;
        UDebug.Log("房间数据")
        UDebug.Info(data)
    }


    /**获得房间数据 不能修改 */
    get getRoomInfo(): RoomInfo {
        return this._roomInfo
    }

    private sceneInfo(dCellScore: any, roundId: string): void {
        this.emit(MSSS.CC_TS_UPDATA_GAME_INFO, roundId, dCellScore);
    }

    /**玩家离开 */
    private sc_ts_player_left_room(caller: GameServer.MSG_C2S_UserLeftMessageResponse): void {
        this.pushcmd("player_left_room", caller, false)
        this.cmdRun()
    }

    /**玩家离开房间,针对自己 */
    private player_left_room(caller: GameServer.MSG_C2S_UserLeftMessageResponse): void {
        UDebug.Log("玩家离开" + JSON.stringify(caller))
        if (caller.retCode == 0) {
            if (caller.type == ELeftType.ReturnToRoom) {
                this.emit(MSSS.CC_CLEAR_RES)
                if (this._roomInfo) {
                    AppGame.ins.loadLevel(ELevelType.Hall, this._roomInfo.gameId);
                } else {
                    AppGame.ins.loadLevel(ELevelType.Hall);
                }
            }
        }
        else {
            if (caller.type == ELeftType.ReturnToRoom) {
                AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
                //AppGame.ins.showUI(ECommonUI.NewMsgBox, { type: 1, data: ULanHelper.ZJH_CAN_EXIT_GAME });
            }
        }
    }

    /**其他玩家状态变化 */
    private sc_ts_player_start_change(userId: number, usStatus: number): void {
        let data = {}
        data["userId"] = userId
        data["usStatus"] = usStatus
        if (AppGame.ins.currRoomKind != ERoomKind.Club) {
            this.pushcmd("test111", data, false)
        } else {
            this.pushcmd("player_start_change", data, false)
        }
        this.cmdRun()
    }
    private test111() {

    };
    private player_start_change(data: {}): void {
        let userId = data["userId"]
        let usStatus = data["usStatus"]
        if (this._battleplayer && this._battleplayer[userId]) {
            this._battleplayer[userId].userStatus = usStatus
            var playing = usStatus >= 5 ? true : false
            this._battleplayer[userId].isInGame = playing;
            if (usStatus == 0 && AppGame.ins.currRoomKind == ERoomKind.Club) {
                if (userId != this.selfUserId) {
                    let _battleplayer = this._battleplayer[userId];

                    this.emit(MSSS.PLAYER_EXIT, _battleplayer);
                    delete this._battleplayer[userId];
                };
            };
        }
    }
    /**
     * @description  场景消息返回刷新玩家
     */
    sceneCmdRefPlayer(data: s13s.IPlayerItem[]) {
        this._battleplayer = {};
        for (let i = 0; i < data.length; i++) {
            let item = new ESSSPlayerInfo();
            let caller = data[i];
            for (let key1 in caller) {
                if (caller.hasOwnProperty(key1)) {
                    const el = caller[key1];
                    if (key1 == "status") {
                        item.isInGame = caller.status >= 5 ? true : false;
                        key1 = "userStatus";
                    };
                    if (key1 == "nickname") {
                        key1 = "nickName";
                    };
                    if (key1 == "headBoxIndex") {
                        key1 = "headboxId";
                    };
                    item[key1] = el;
                }
            }
            item.selected = -1;
            this._battleplayer[item.userId] = item;
        };
        this.emit(MSSS.CC_UPDATA_SEAT_INFO, this._battleplayer);
    };

    private sc_ts_room_playerinfo(caller: RoomPlayerInfo): void {
        this.addPlayer(caller);
        this.pushcmd("test111", caller, false)
        this.cmdRun()
        // if (AppGame.ins.currRoomKind != ERoomKind.Club) {

        // } else {

        //     this.cmdRun()
        //     this._canGetCmd = false;
        // }
    }

    //-------------------------------------------------------------

    /**添加玩家 */
    addPlayer(caller: RoomPlayerInfo): void {
        let item = new ESSSPlayerInfo();

        cc.log("游戏转台", this._state);
        for (const key1 in caller) {
            if (caller.hasOwnProperty(key1)) {
                const el = caller[key1];
                item[key1] = el;
            }
        }
        item.selected = -1;
        item.isInGame = caller.userStatus >= 5 ? true : false

        this._battleplayer[item.userId] = item;
        this.emit(MSSS.CC_UPDATA_SEAT_INFO, this._battleplayer);
    }

    private sc_games_start(caller: s13s.CMD_S_GameStart) {
        this._state = ESSSState.Gameing;
        MSSS._tableId = caller.tableId;
        for (const key1 in this._battleplayer) {
            if (this._battleplayer[key1]) {
                this._battleplayer[key1].cdtime = caller.wTimeLeft;
                this._battleplayer[key1].isInGame = true
                this._battleplayer[key1].userStatus = 5
            }
        }
        this.pushcmd("games_start", caller, false)
    }

    private games_start(caller: s13s.CMD_S_GameStart) {
        UDebug.Log("十三水游戏开始 ")
        this._roomInfoCathe = false
        this.sceneInfo(caller.ceilScore, caller.roundId)

        //更新玩家列表中的最新分数
        for (const key in caller.players) {
            const element = caller.players[key];
            this._battleplayer[element.userId].score = element.score;
        }

        this.emit(MSSS.GAME_START, caller)
        this.emit(MSSS.CC_UPDATA_SEAT_INFO, this._battleplayer);
        this.cmdRun()
    }

    private sc_game_manualCards(caller: s13s.CMD_S_ManualCards) {
        UDebug.Log("sc_game_manualCards   shoud收到。。。。。牌")
        this._state = ESSSState.Gameing;
        this.pushcmd("game_manualCards", caller, false)
    }

    private game_manualCards(caller: s13s.CMD_S_ManualCards) {
        UDebug.Log("sc_game_manualCards   收到。。。。。牌")

        UDebug.Info(caller)
        this.emit(MSSS.CC_GAME_MANUAKCARD, caller)
    }

    private sc_game_compare(caller: s13s.CMD_S_CompareCards) {
        this._state = ESSSState.Gameing;
        this.pushcmd("game_compare", caller, false)
    }

    private sc_game_end(caller: s13s.CMD_S_GameEnd) {
        this._state = ESSSState.Wait;
        this.pushcmd("game_end", caller, false)
    }

    private sc_gameScene_free(caller: s13s.CMD_S_StatusFree) {
        this._state = ESSSState.Wait;
        this.sceneCmdRefPlayer(caller.players);
        this.emit(MSSS.CC_UPDATA_SEAT_INFO, this._battleplayer);
        MSSS._tableId = caller.tableId;
        this.pushcmd("gameScene_free", caller, false)
    }

    private sc_gameScene_group(caller: s13s.CMD_S_StatusGroup) {
        this._state = ESSSState.Gameing;
        this.sceneCmdRefPlayer(caller.players);
        this.emit(MSSS.CC_UPDATA_SEAT_INFO, this._battleplayer);
        MSSS._tableId = caller.tableId;
        this.pushcmd("gameScene_group", caller, false)
    }

    private sc_gameScene_open(caller: s13s.CMD_S_StatusOpen) {
        this._state = ESSSState.Gameing;
        this.sceneCmdRefPlayer(caller.players);
        this.emit(MSSS.CC_UPDATA_SEAT_INFO, this._battleplayer);
        MSSS._tableId = caller.tableId;
        this.pushcmd("gameScene_open", caller, false)
    }

    private sc_gameScene_end(caller: s13s.CMD_S_StatusEnd) {
        this._state = ESSSState.Wait;
        this.sceneCmdRefPlayer(caller.players);
        cc.log("游戏结束：", caller);
        MSSS._tableId = caller.tableId;
        this.pushcmd("gameScene_end", caller, false)
    }

    private gameScene_free(caller: s13s.CMD_S_StatusFree) {
        UDebug.Log("空闲场景")
        this._roomInfoCathe = false
        this.sceneInfo(caller.ceilscore, "")
        this.emit(MSSS.CC_GAME_SCENE_FREE, caller)
        this.recoverRoundEndExit(caller);
    }

    private gameScene_group(caller: s13s.CMD_S_StatusGroup) {
        UDebug.Log("理牌场景")
        this._roomInfoCathe = false
        this.sceneInfo(caller.ceilscore, caller.roundId)
        this.emit(MSSS.CC_GAME_SCENE_GROUP, caller)
        this.recoverRoundEndExit(caller);
    }

    private gameScene_open(caller: s13s.CMD_S_StatusOpen) {
        UDebug.Log("比牌场景")
        this._roomInfoCathe = false
        this.sceneInfo(caller.ceilscore, caller.roundId)
        this.emit(MSSS.CC_GAME_COMPARE, caller.cmp, true)
        this.recoverRoundEndExit(caller);
    }

    private gameScene_end(caller: s13s.CMD_S_StatusEnd) {
        UDebug.Log("结束场景")
        this.emit(MSSS.CC_GAME_SCENE_END, caller)
        this.recoverRoundEndExit(caller);
    }

    //场景消息返回恢复本局游戏是否退出
    recoverRoundEndExit(caller: any) {
        let bRoundEndExit = caller["bRoundEndExit"];
        let CMD_C_RoundEndExitResult = new s13s.CMD_C_RoundEndExitResult();
        CMD_C_RoundEndExitResult.bExit = bRoundEndExit
        this.sc_game_RoundEndExiResult(CMD_C_RoundEndExitResult);
    };

    private sc_game_canceCard(caller: s13s.CMD_S_CancelCards) {
        this.pushcmd("game_canceCard", caller, false)
    }

    private sc_game_RoundEndExiResult(caller: s13s.CMD_C_RoundEndExitResult) {
        this.pushcmd("game_RoundEndExiResult", caller, false)
    }

    private game_RoundEndExiResult(caller: s13s.CMD_C_RoundEndExitResult) {
        UDebug.Log("设置是否下局离开")
        this.emit(MSSS.CC_ROUNDEND_EXIT, caller)
    }

    private game_canceCard(caller: s13s.CMD_S_CancelCards) {
        UDebug.Log("取消牌，。。。")
        this.emit(MSSS.CC_CANCELCARDS, caller)
    }

    private sc_game_finshCard(caller: s13s.CMD_S_MakesureDunHandTy) {
        this.pushcmd("game_finshCard", caller, false)
    }

    private game_finshCard(caller: s13s.CMD_S_MakesureDunHandTy) {
        UDebug.Log("sc_game_finshCard.......摆牌完成" + caller.chairId)
        this.emit(MSSS.CC_GAME_FINISHCARD, this.getUISeatId(caller.chairId))

    }

    private game_end(caller: s13s.CMD_S_GameEnd) {
        this._state = ESSSState.Watching;
        if (AppGame.ins.currRoomKind == ERoomKind.Club) {
            for (let i = 0; i < caller.scores.length; i++) {
                let player = caller.scores[i];
                let userscore = player["userscore"];
                let chairId = player["chairId"];
                for (let key in this._battleplayer) {
                    let chairId1 = this._battleplayer[key]["chairId"];
                    if (chairId == chairId1) {
                        this._battleplayer[key]["score"] = userscore;
                    };
                };
            };
        };

        this.emit(MSSS.CC_GAME_GAME_END, caller);
    }

    private game_compare(caller: s13s.CMD_S_CompareCards) {
        this._state = ESSSState.Gameing;
        this.emit(MSSS.CC_GAME_COMPARE, caller, false)
    }

    //手动点击
    onShoudong(index?: number, data?: Uint8Array) {
        UMsgCenter.ins.sendPkg(EGameType.SSS, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, s13s.SUBID.SUB_C_MANUALCARDS, { dt: index, cards: data });
    }

    /**
     * 确定组牌完成按钮
     */
    onquedingBtn(indextype: number, isAutoOpertor: boolean) {
        UMsgCenter.ins.sendPkg(EGameType.SSS, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, s13s.SUBID.SUB_C_MAKESUREDUNHANDTY, { groupindex: indextype, isAutoOpertor: isAutoOpertor });
    }

    /**
    * 取消墩牌按钮
    */
    oncancelCradBtn(indextype: number) {
        UMsgCenter.ins.sendPkg(EGameType.SSS, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, s13s.SUBID.SUB_C_CANCELCARDS, { dt: indextype });
    }

    update(dt) { }

    /**逻辑运行 */
    updateM(dt: number): void {
        while (this._canGetCmd && this._cmds.length > 0) {
            let cmd = this.getcmd()
            if (cmd) {
                this._canGetCmd = !cmd.needwait
                this.docmd(cmd)
            } else {
                this._canGetCmd = true
            }
        }
    }
    /**
  * 玩家自己的userid
  */
    protected get selfUserId(): number {
        return AppGame.ins.roleModel.useId;
    }
    /**
     * 玩家自己的性别
     */
    get selfUserSex(): number {
        return cfg_head[AppGame.ins.roleModel.headId].sex;
    }

    /**自己的真实位置 */
    get selfRealSeatId(): number {
        let role = AppGame.ins.gamebaseModel.getRoomPlayerInfo(this.selfUserId);
        // cc.log("自己的真实位置：", role);
        return role.chairId;
    }
    /**
* 根据UI的seatid 获取真实的座位id
* @param seatId 
*/
    private getRealSeatId(seatId): number {
        let temp = this.selfRealSeatId - this._selfUISeatId;
        let temp2 = seatId + temp;
        if (temp2 > 3) temp2 = temp2 - 4;
        return temp2;
    }

    /**
     * 根据真实的座位ID获取玩家的UI座位ID
     * @param realId 
     */
    getUISeatId(realId: number): number {
        let temp = this.selfRealSeatId - this._selfUISeatId;
        let temp2 = realId - temp;
        if (temp2 < 0) temp2 = 4 + temp2;
        return temp2;
    }


    //压入队列
    private pushcmd(cmd: string, data: any, needwait: boolean) {
        if (!this._cmds) this._cmds = []
        let item = new USSSCmd()
        item.cmd = cmd
        item.data = data
        item.needwait = needwait
        this._cmds.push(item)
    }

    /**取命令 */
    private getcmd(): USSSCmd {
        if (this._cmds.length > 0) {
            return this._cmds.shift()
        }
        return null
    }

    private docmd(cmd: USSSCmd) {
        this[cmd.cmd].call(this, cmd.data)
    }
    public cmdRun() {
        this._canGetCmd = true
    }
    clearCmds() {
        if (this._cmds) this._cmds = []
    }

    clearPlayer() {
        this._battleplayer = {}
        this._roomInfoCathe = true
    }
    /**
     * @description 刷新玩家状态
     */
    refPlayerStatus() {
        for (let key in this._battleplayer) {
            this._battleplayer[key]["userStatus"] = 4;
        };
        MSSS.ins.emit(MSSS.CC_UPDATA_SEAT_INFO, MSSS.ins.gBattlePlayer);
    };

    /**
     * @description 玩家是否纯在
     * @param
     */
    isPurelyPlayer(key: string, value: any): boolean {
        for (let f in this._battleplayer) {
            let v = this._battleplayer[f][key];
            if (v == value) {
                return true;
            };
        };
        return false;
    };
}
