import Model from "../../common/base/Model";
import AppGame from "../../public/base/AppGame";
import UMsgCenter from "../../common/net/UMsgCenter";
import { ECommonUI, ELevelType, EGameType, ELeftType } from "../../common/base/UAllenum";
import { Game, Blackjack, GameServer } from "../../common/cmd/proto";
import UHandler from "../../common/utility/UHandler";
import UDebug from "../../common/utility/UDebug";
import MBaseGameModel from "../../public/hall/MBaseGameModel";
import { RoomInfo, RoomPlayerInfo } from "../../public/hall/URoomClass";
import { EBJState, EBJPlayerInfo, UIBJFanPai, UIBJPoker, UBJCmd } from "./UBJData";

import cfg_errorCode from "./help/cfg_errorCode";
import { SG_SELF_SEAT } from "../sg/MSGModel";
import ULanHelper from "../../common/utility/ULanHelper";
import UAudioManager from "../../common/base/UAudioManager";
import VBJSeat from "./VBJSeat";
import { setegid } from "process";
import { ESeatState } from "../zjh/UZJHClass";

//**金币缩放比例 */
export const BJ_SCALE = 0.01;
export const BJ_SELF_SEAT = 0;
export const BJ_ZHUANGJIA_SEAT = 5;
export const fapaitime = 0.18;
export default class MBJ extends Model {

    /**更新座位上玩家信息 */
    static CC_UPDATA_SEAT_INFO = "CC_UPDATA_SEAT_INFO";
    /**设置默认ui */
    static CC_DEFAULT_UI = "cc_default_ui";
    /**推送发牌 */
    static SC_TS_FAPAI = "SC_TS_FAPAI";
    /**推送下注 */
    static SC_TS_SET_ZHU = "SC_TS_SET_ZHU";
    /**推送下注金币信息更新 */
    static SC_TS_CHIP_SCORE = "SC_TS_CHIP_SCORE";
    /**推送下注玩家金币信息 */
    static SC_TS_PLAYER_SCORE = "SC_TS_PLAYER_SCORE";
    /**推送结算飘分信息更新 */
    static SC_TS_SHOW_JIESUAN = "SC_TS_SHOW_JIESUAN";
    /**推送刷新单个人牌点取大 */
    static SC_TS_REF_POINT = "SC_TS_REF_POINT";

    /**设置下注区域闪烁 */
    static CC_TS_SHOW_CHIPLIGHT = "CC_TS_SHOW_CHIPLIGHT";
    static CC_TS_SHOW_CHIPLIGHTSPRITE = "CC_TS_SHOW_CHIPLIGHTSPRITE";
    /**设置保险图片 */
    static CC_TS_SHOW_BAOXIAN_INFO = "CC_TS_SHOW_BAOXIAN_INFO";

    /**设置双倍·图片 */
    static CC_TS_SHOW_PKSB_IMG = "CC_TS_SHOW_PKSB_IMG";

    /**设置聚光灯 */
    static CC_TS_SHOW_JUGUANGDENG = "CC_TS_SHOW_JUGUANGDENG";

    /**房间满员 */
    static SC_ENTER_ROOM_FAIL = "SC_ENTER_ROOM_FAIL";
    /**默认ui */
    static CC_TS_UPDATA_GAME_NUMBER = "SC_TS_UPDATA_GAME_NUMBER";
    /**显示操作按钮 */
    static CC_TS_SHOW_CAOZUO_BTN = "CC_TS_SHOW_CAOZUO_BTN";
    /**显示其他下注区 */
    static CC_TS_SHOW_OTHER_AREA = "CC_TS_SHOW_OTHER_AREA";

    //**显示分牌 */
    static CC_TS_SHOW_FENPAI = "CC_TS_SHOW_FENPAI";

    /**显示继续按钮 */
    static CC_TS_SHOW_MATCH = "CC_TS_SHOW_MATCH";

    /**显示继续按钮 */
    static CC_TS_SHOW_JIXU_BTN = "CC_TS_SHOW_JIXU_BTN";
    /**设置总cd */
    static CC_TS_SET_ALLCDNUM = "CC_TS_SET_ALLCDNUM";
    /**设置单个玩家cd */
    static CC_TS_SET_ONECD = "CC_TS_SET_ONECD";
    /**设置所有玩家cd */
    static CC_TS_SET_ALLCD = "CC_TS_SET_ALLCD";
    /**切换显示当前操作玩家 */
    static CC_TS_SHOW_OPERATE = "CC_TS_SHOW_OPERATE";
    /**切换显示当前操作玩家状态 */
    static CC_TS_SHOW_CAOZUO_STATE = "CC_TS_SHOW_CAOZUO_STATE";
    /**创建筹码 */
    static CC_CZ_PUT_OUT_CHIP = "CC_CZ_PUT_OUT_CHIP";
    /**移动筹码 */
    static CC_CZ_FLY_CHIP = "CC_CZ_FLY_CHIP";
    /**翻牌 */
    static SC_TS_FAN_PAI = "SC_TS_FAN_PAI";
    /**庄家保险看牌 */
    static SC_TS_HAND_ANI = "SC_TS_HAND_ANI";

    static RESET_SCENE = "RESET_SCENE";

    static SHOW_RESULT = "SHOW_RESULT";

    static GET_CMD = "GET_CMD";

    /**消息队列 */
    static CC_TS_MESSAGE = "CC_TS_MESSAGE";
    static PUSH_SCORE = "PUSH_SCORE";    //下注推送自己金币数
    static GET_SCORE = "GET_SCORE";    //自己金币数
    static SET_WINIMG = "SET_WINIMG";    //设置赢方图片
    static SHOW_NEXT_EXIT = "SHOW_NEXT_EXIT";       //显示下局离场按钮  
    static HIDE_NEXT_EXIT = "HIDE_NEXT_EXIT";       //隐藏下局离场按钮
    static HIDE_MASK = "HIDE_MASK"          //隐藏遮罩
    static HIDE_ANI = "HIDE_ANI"        //隐藏动画
    static SHOW_CHAT = "SHOW_CHAT";
    static SHOW_NUMBER = "SHOW_NUMBER"      //显示座位号
    /**玩家状态改变 */
    static USSTAUTS_CHANGE = "USSTAUTS_CHANGE";
    /**玩家离开 */
    static DELETE_USER = "DELETE_USER";
    /**玩家加入 */
    static ADD_PLAYER = "ADD_PLAYER";

    static GAMESCENE_PLAY = "GAMESCENE_PLAY";

    public on_back: boolean = false;
    /**当前底注 */
    private _currentDizhu: number;
    /**当前点击下注区 ui的位置  */
    private _currentChipArea: number;
    /**当前下注额  */
    private _currChipNum: number = 0;

    private _currBaoxianSeat: number = 0;
    private _selfOtherSeat: number[]; //自己下注的其他区
    private _selfOtherSeatClone: number[]; //自己下注的其他区拷贝 不含自己 保险时可能会被销毁
    private _chipAreaNum: number[];//各区下注数
    /**
    * 游戏状态
    */
    public _state: EBJState = EBJState.Wait;
    /**本局的玩家 */
    public _battleplayer: { [key: number]: EBJPlayerInfo };
    private _playerNum: number = 0;
    /**
     * 房间信息
     */
    private _roomInfo: RoomInfo;
    private _selfUISeatId: number = BJ_SELF_SEAT;
    private _gameEndData: Blackjack.CMD_S_GameEnd
    /**命令队列 */
    public _cmds: Array<UBJCmd>;
    /** 是否可以取命令*/
    public _canGetCmd: boolean;
    private _fristoperate: boolean = false;  //是否是第一次操作
    private _fristoperateResult: boolean = false;  //是否是第一次操作
    private _roomInfoCathe = false  //是否清空数据

    public _isExit: boolean = false;
    public _isEnd: boolean = false;
    public _game_dealCard: any = null;
    public banker_deal_caller = null;
    public _end_caller: any = null;
    public _disconnect: boolean = false;

    setGameState(state: EBJState) {
        this._state = state

        if (this._state == EBJState.Wait) {
            this._roomInfoCathe = false
        }
    }

    // onLoad () {}
    resetData(): void {
        this.clearCmds()
        this._currChipNum = 0
    }

    run(): void {
        super.run();
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.sc_ts_player_start_change, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.sc_ts_player_usstatus_change, this);
    }

    exit(): void {
        super.exit();
        this.resetData();

        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.sc_ts_player_start_change, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.sc_ts_player_usstatus_change, this);

        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, //空闲
            Blackjack.SUBID.SUB_SC_GAMESCENE_FREE, new UHandler(this.sc_gamescene_free, this));
        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, //下注
            Blackjack.SUBID.SUB_SC_GAMESCENE_SCORE, new UHandler(this.gamescene_score, this));
        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, //保修
            Blackjack.SUBID.SUB_SC_GAMESCENE_INSURE, new UHandler(this.gamescene_insure, this));
        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, //游戏中
            Blackjack.SUBID.SUB_SC_GAMESCENE_PLAY, new UHandler(this.gamescene_play, this));
        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, //结束
            Blackjack.SUBID.SUB_SC_GAMESCENE_END, new UHandler(this.gamescene_end, this));

        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, //结束冷却
            Blackjack.SUBID.SUB_S_END_SCORE, new UHandler(this.game_Addend, this));

        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_GAME_START, new UHandler(this.game_start, this));
        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_ADD_SCORE, new UHandler(this.game_addScore, this));
        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_DEAL_CARD, new UHandler(this.game_dealCard, this));
        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_INSURE, new UHandler(this.game_insure, this));
        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_INSURE_RESULT, new UHandler(this.game_insure_result, this));
        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_OPERATE, new UHandler(this.s_gameReadOperate, this));
        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_OPER_RESULT, new UHandler(this.game_oper_result, this));
        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_BANKER_DEAL, new UHandler(this.game_banker_deal, this));
        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_GAME_END, new UHandler(this.s_gameEnd, this));
        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_GAME_START_AI, new UHandler(this.s_game_gameStartAi, this));
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_C_ROUND_END_EXIT, new UHandler(this.sc_game_RoundEndExiResult, this));
        //错误码
        UMsgCenter.ins.unregester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_ERROR_INFO, new UHandler(this.s_game_errorInfo, this));
    }

    /**
    * 退出游戏按钮
    */
    exitGame(): void {
        switch (this._state) {
            case EBJState.Match:
                // this._battleplayer = {};
                AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BJ);
                // this._isExit = true;
                break;

            case EBJState.Gameing:
                for (const key in this._battleplayer) {
                    if (this._battleplayer[key] && this._battleplayer[key].userId == AppGame.ins.roleModel.useId) {
                        if (this._battleplayer[key].userStatus == 5) {
                            AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
                        } else {
                            // this._battleplayer = {};
                            // this._isExit = true;
                            AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                            AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BJ);
                            return
                        }
                    }
                }
                break;

            case EBJState.LeftGame:
                // this._battleplayer = {};
                this._isExit = true;
                // AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
                // AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                // AppGame.ins.showUI(ECommonUI.MsgBox, { type: 1, data: ULanHelper.SG_CANT_EXIT_GAME });
                AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BJ);
                break;

            case EBJState.Watching:
                // this._battleplayer = {};
                this._isExit = true;
                AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BJ);
                break;

            case EBJState.Wait:
                // if (this._roomInfo && !this._roomInfoCathe) {
                // this.emit(MBJ.CC_TS_SHOW_JIXU_BTN, false)
                // this._battleplayer = {};
                this._isExit = true;
                AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                // } else {
                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BJ);
                // }
                // AppGame.ins.showUI(ECommonUI.MsgBox, {
                //     type: 2, data: ULanHelper.ZJH_EXIT_GAME, handler: UHandler.create((a) => {

                //         if (a) {
                //             if (this._roomInfo&& !this._roomInfoCathe) {
                //                 this.emit(MBJ.CC_TS_SHOW_JIXU_BTN,false)
                //                 AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                //             } else {
                //                 AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BJ)
                //             }
                //         }

                //     }, this)
                // });
                break;
        }
    }

    //#region  model 实现
    init(): void {
        this._isEnd = false;
        this._disconnect = false;
        /**场景消息 是正常进入 断线重连  */
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, //空闲
            Blackjack.SUBID.SUB_SC_GAMESCENE_FREE, new UHandler(this.sc_gamescene_free, this));
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, //下注
            Blackjack.SUBID.SUB_SC_GAMESCENE_SCORE, new UHandler(this.gamescene_score, this));
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, //保险
            Blackjack.SUBID.SUB_SC_GAMESCENE_INSURE, new UHandler(this.gamescene_insure, this));
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, //游戏中
            Blackjack.SUBID.SUB_SC_GAMESCENE_PLAY, new UHandler(this.gamescene_play, this));
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, //结束
            Blackjack.SUBID.SUB_SC_GAMESCENE_END, new UHandler(this.gamescene_end, this));

        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, //结束冷却
            Blackjack.SUBID.SUB_S_END_SCORE, new UHandler(this.game_Addend, this));

        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_GAME_START, new UHandler(this.game_start, this));
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_ADD_SCORE, new UHandler(this.game_addScore, this));
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_DEAL_CARD, new UHandler(this.game_dealCard, this));
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_INSURE, new UHandler(this.game_insure, this));
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_INSURE_RESULT, new UHandler(this.game_insure_result, this));
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_OPERATE, new UHandler(this.s_gameReadOperate, this));
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_OPER_RESULT, new UHandler(this.game_oper_result, this));
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_BANKER_DEAL, new UHandler(this.game_banker_deal, this));
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_GAME_END, new UHandler(this.s_gameEnd, this));
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_GAME_START_AI, new UHandler(this.s_game_gameStartAi, this));
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_C_ROUND_END_EXIT, new UHandler(this.sc_game_RoundEndExiResult, this));

        //错误码
        UMsgCenter.ins.regester(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            Blackjack.SUBID.SUB_S_ERROR_INFO, new UHandler(this.s_game_errorInfo, this));

        this._canGetCmd = false;
        this._cmds = [];
        this._fristoperate = false
        this._fristoperateResult = false
        this._currBaoxianSeat = 0;
        this._currChipNum = 0
        this._selfOtherSeat = new Array();
        this._selfOtherSeatClone = new Array();
        this._chipAreaNum = new Array();
        this._isExit = false;
    }

    private test() {
        let paixing = 3
        let card = new Number[2];
        card[0] = 1;
        card[1] = 2;
        this.update_fanpai(3, card, paixing, 0)
    }

    private s_game_errorInfo(caller: Blackjack.CMD_S_ErrorInfo): void {
        UDebug.Info(caller)
        if (cfg_errorCode[caller.wCode]) {
            AppGame.ins.showTips(cfg_errorCode[caller.wCode]);
            if (caller.wCode == 15) {
                this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, true, 1) //打开下注按钮
            }
        }
        else {
            AppGame.ins.showTips(cfg_errorCode[0])
        }
    }

    public sc_ts_room_playerinfo(caller: RoomPlayerInfo): void {
        UDebug.Info(caller);
        this.addPlayer(caller);
        // this.pushcmd("addPlayer", caller, false);
        // this.cmdRun()

        //测试代码
        // for (let i = 0;i<5 ; i++)
        // {
        //   let player  = new EBJPlayerInfo ()
        //   player.account = "123456789";
        //   player.chairId = i;
        //   player.headId = i;
        //   player.location = "中国";
        //   player.nickName = "player"+i;
        //   player.score = 500*i;
        //   player.sex = 1;
        //   player.tableId = i;
        //   player.userId  = 51*i;
        //   player.orderNum = i ;
        //   //player.userStatus = EUSER_STATUS.sReady;
        //  AppGame.ins.bjModel.emit(MBJ.CC_UPDATA_SEAT_INFO,player,this)
        // }
    }

    /**玩家离开 */
    private sc_ts_player_left_room(caller: GameServer.MSG_C2S_UserLeftMessageResponse): void {
        this.pushcmd("player_left_room", caller, false)
        this.cmdRun()
    }

    private player_left_room(caller: GameServer.MSG_C2S_UserLeftMessageResponse): void {
        // this._battleplayer = {};
        UDebug.Info(caller)
        if (this._state == EBJState.LeftGame) {
            AppGame.ins.roomModel.requestMatch();
        }
        if (caller.retCode == 0) {
            if (caller.type == ELeftType.ReturnToRoom) {
                if (this._state != EBJState.AlreadLeft) {
                    this._state = EBJState.AlreadLeft;
                    AppGame.ins.loadLevel(ELevelType.Hall, this._roomInfo.gameId);
                }
                // this._battleplayer = {}
            } else if (caller.type == ELeftType.CancleMatch) {
                //this.cancleMatch()
                //显示匹配
                this.clearPlayer();
                this.emit(MBJ.CC_TS_SHOW_JIXU_BTN, true)
                this._state = EBJState.Wait;

            } else if (caller.type == ELeftType.LeftGame) {
                this._state = EBJState.Match;
                this.clearPlayer();
                AppGame.ins.roomModel.requestMatch();
            }
        }
        else {
            if (caller.type == ELeftType.ReturnToRoom)
                AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
            //AppGame.ins.showUI(ECommonUI.MsgBox, { type: 1, data: ULanHelper.ZJH_CAN_EXIT_GAME });
            else if (caller.type == ELeftType.CancleMatch) {
                if (this._state != EBJState.Gameing)
                //this.cancleMatch()
                {
                    this._state = EBJState.Gameing
                    if (caller.errorMsg) {
                        AppGame.ins.showTips(caller.errorMsg)
                    }
                    //关闭匹配
                    this.emit(MBJ.CC_TS_SHOW_MATCH, false)
                }
                else {
                    this.emit(MBJ.CC_TS_SHOW_JIXU_BTN, false)
                }
            } else if (caller.type == ELeftType.LeftGame) {
                this.requestMatch()
            }
        }
    }

    /*
      sGetout     = 0,        // player get out.
    sFree,    1              // player is free.
    sSit,      2             // player is sitdown.
    sReady,     3            // player is ready.
    sPlaying,    4           // player is playing.
    sOffline,     5          // player is offline.
    sLookon,       6         // player is lookon.
    sGetoutAtplaying   7     // player is get out at 
    */
    /**其他玩家状态变化 */

    private sc_ts_player_start_change(userId: number, usStatus: number): void {
        let data = {}
        data["userId"] = userId
        data["usStatus"] = usStatus
        this.pushcmd("player_start_change", data, false)
        this.cmdRun()
    }

    private sc_ts_player_usstatus_change(data1, data2): void {
        this.emit(MBJ.USSTAUTS_CHANGE, data1, data2);
    }

    private player_start_change(data: {}): void {
        let userId = data["userId"]
        let usStatus = data["usStatus"]
        UDebug.Info(userId)
        if (usStatus == 0) {
            for (const key1 in this._battleplayer) {
                if (this._battleplayer[key1]) {
                    if (this._battleplayer[key1].userId == userId) {
                        let seatId = this._battleplayer[key1].seatId;
                        //    if(this._state == EBJState.Wait){
                        //        setTimeout(() => {
                        this._battleplayer[key1] = null;
                        // if(this._battleplayer[key1].paiState == []){
                        //     this.emit(MBJ.DELETE_USER,seatId);
                        // }
                        //         this.emit(MBJ.DELETE_USER,seatId);
                        //        }, 4000);
                        //    }

                        // if(AppGame.ins.currRoomKind == 2){
                        //     if(this._state == EBJState.Gameing){
                        //         setTimeout(() => {
                        //             if(this._state !== EBJState.Gameing){
                        //                 this.update_seat_info();
                        //             }
                        //         }, 6);
                        //     }else{
                        //         this.update_seat_info();
                        //     }

                        // }else{
                        // this.update_seat_info();
                        // }

                    }
                }
            }
        }
    }

    /**保存房间数据 不能修改 */
    saveRoomInfo(data: RoomInfo): void {
        this._roomInfo = data;
        UDebug.Info(data)
    }

    /**获得房间数据 不能修改 */
    get getRoomInfo(): RoomInfo {
        return this._roomInfo;
    }

    //获得底注
    get getCurDiZhu(): number {
        return this._currentDizhu
    }

    get getCurChipNum(): number {
        return this._currChipNum
    }

    /**匹配 */
    requestMatch(): void {
        if (this._state == EBJState.LeftGame) {
            return;
        }
        this._state = EBJState.Match;
        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.LeftGame);
    }

    /**
     * 取消匹配
     */
    cancleMatch(): void {
        this._state = EBJState.Wait;
        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.CancleMatch);
        //this.emit(MBJ.CC_TS_SHOW_JIXU_BTN,true)
    }
    // private giveup_timeout_op(caller: Blackjack.CMD_S_GIVEUP_TIMEOUT_OP): void {
    //     let pl = this._battleplayer[this.selfUserId];
    //     pl.fangchaoshi = caller.bGiveUp;
    //     this.emit(MZJH.SC_TS_FANGCHAOSHI, pl.fangchaoshi);
    // }
    /**
    * 场景消息
     */
    private sc_gamescene_free(caller: Blackjack.CMD_S_StatusFree): void {
        this.emit(MBJ.GET_CMD);
        this._disconnect = true;
        this._state = EBJState.Match;
        this._isEnd = false;
        // this.emit(MBJ.SHOW_CHAT,true);
        if (AppGame.ins.currRoomKind == 0) {
            this.emit(MBJ.CC_DEFAULT_UI);
        }
        this._battleplayer = {};
        // let item = new EBJPlayerInfo();
        // for (const key1 in caller) {
        //     if (caller.hasOwnProperty(key1)) {
        //         const el = caller[key1];
        //         item[key1] = el;
        //     }
        // }
        // item.seatId = this.getUISeatId(item.chairId);
        // this._battleplayer[item.seatId] = item;
        for (let index = 0; index < caller.GamePlayers.length; index++) {
            const element = caller.GamePlayers[index];
            let item = new EBJPlayerInfo();
            //item.account = 
            item.cdtime = 15;
            item.chairId = element.cbChairId;
            item.nickName = element.wUserId;
            item.headId = element.cbHeadIndex;
            item.score = element.llScore;
            item.location = element.szLocation;
            item.vipLevel = element.vipLevel;
            item.headboxId = element.headBoxIndex;
            item.userId = element.wUserId;
            item.seatId = this.getUISeatId(item.chairId);
            item.userStatus = 4;
            item.headImgUrl = element.headImgUrl;
            this._battleplayer[item.seatId] = item;
            this.sc_ts_room_playerinfo(item);
            // this._battleplayer[element.userId].isturn = false;
        }
        this.emit(MBJ.HIDE_MASK, true);
        this.emit(MBJ.HIDE_ANI);
        this.emit(MBJ.SHOW_NUMBER);
        this.cmdRun()
    }

    private gamescene_score(caller: Blackjack.ICMD_S_StatusScore): void {
        this.emit(MBJ.GET_CMD);
        this._disconnect = true;
        this.emit(MBJ.RESET_SCENE);
        this._state = EBJState.Gameing;
        this._isEnd = false;
        this.emit(MBJ.SHOW_CHAT, true);
        this.pushcmd("sc_gamescene_score", caller, false)
        this.cmdRun()
    }

    private sc_gamescene_score(caller: Blackjack.ICMD_S_StatusScore): void {
        UDebug.Info(caller)
        // this._battleplayer = {};
        // this._playerNum = 0;
        // this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN,true,1) //打开下注按钮
        this.emit(MBJ.HIDE_MASK, false);
        this.emit(MBJ.HIDE_ANI);
        this._currentDizhu = caller.dCellScore * BJ_SCALE;
        this.sceneInfo(caller.dCellScore, caller.roundId);
        // this.emit(MBJ.CC_TS_SET_ONECD, caller.GamePlayers[0], true, caller.wTimeLeft);
        // this.emit(MBJ.CC_TS_SET_ONECD, caller.GamePlayers[1], true, caller.wTimeLeft);
        // for (const key in caller.GamePlayers) {
        //     this.addScenePlayer(caller.GamePlayers[key])
        // }
        this.update_seat_info();
        this.emit(MBJ.SHOW_NUMBER);
        this.addSceneShadowScore(caller);
    }

    private gamescene_insure(caller: Blackjack.CMD_S_StatusInsure): void {
        this.emit(MBJ.GET_CMD);
        this._disconnect = true;
        this.emit(MBJ.SHOW_NUMBER);
        this._isEnd = false;
        this.emit(MBJ.SHOW_CHAT, true);
        this.pushcmd("sc_gamescene_insure", caller, false)
        this.cmdRun()
    }

    private sc_gamescene_insure(caller: Blackjack.CMD_S_StatusInsure): void {
        this._state = EBJState.Gameing;
        UDebug.Info(caller)
        // this._battleplayer = {};
        // this._playerNum = 0;
        this.emit(MBJ.CC_DEFAULT_UI);
        this.emit(MBJ.HIDE_MASK, false);
        this.emit(MBJ.HIDE_ANI);
        this.sceneInfo(caller.dCellScore, caller.roundId);
        // for (const key in caller.GamePlayers) {
        //     this.addScenePlayer(caller.GamePlayers[key])
        // }
        this.update_seat_info();
        this.emit(MBJ.SHOW_NUMBER);
        this.addSceneShadowInsure(caller)
    }

    public gamescene_play(caller: Blackjack.CMD_S_StatusPlay): void {
        this.emit(MBJ.GET_CMD);
        this._disconnect = true;
        this.emit(MBJ.RESET_SCENE);
        this.emit(MBJ.SHOW_NUMBER);
        this._isEnd = false;
        this.emit(MBJ.SHOW_CHAT, true);
        this.pushcmd("sc_gamescene_play", caller, false)
        this.cmdRun();
    }

    public sc_gamescene_play(caller: Blackjack.CMD_S_StatusPlay): void {
        this._state = EBJState.Gameing;
        this.emit(MBJ.CC_DEFAULT_UI);
        this.emit(MBJ.HIDE_ANI);
        this.sceneInfo(caller.dCellScore, caller.roundId);
        // this._battleplayer = {};
        // this._playerNum = 0;
        // for (const key in caller.GamePlayers) {
        //     this.addScenePlayer(caller.GamePlayers[key])
        // }
        this.emit(MBJ.HIDE_MASK, false);
        this.update_seat_info();
        this.emit(MBJ.SHOW_NUMBER);
        this.addSceneShadowPlay(caller);
        this.emit(MBJ.GAMESCENE_PLAY, caller);
    }

    private gamescene_end(caller: Blackjack.CMD_S_StatusEnd): void {
        this.emit(MBJ.GET_CMD);
        this._state = EBJState.Wait;
        this._disconnect = true;
        this._isEnd = true;
        this.emit(MBJ.SHOW_RESULT, caller);
        // this._isEnd = true;
        // this.exitGame();
        // AppGame.ins.showTips("该局已结束");
        // this.s_game_banker_deal(this.banker_deal_caller);
        // this.emit(MBJ.SHOW_NUMBER);
        // this._isEnd = true;
        // this.emit(MBJ.SHOW_CHAT,true);
        // this.emit(MBJ.CC_TS_SHOW_JIXU_BTN, true)
        this.pushcmd("sc_gamescene_end", caller, false)
        this.cmdRun()
    }

    private sc_gamescene_end(caller: Blackjack.CMD_S_StatusEnd): void {
        // this.emit(MBJ.CC_DEFAULT_UI);
        // this.emit(MBJ.HIDE_ANI);
    }

    private sceneInfo(dCellScore: string, roundId: string): void {
        this.emit(MBJ.CC_TS_UPDATA_GAME_NUMBER, roundId, dCellScore);
    }

    private game_start(caller: Blackjack.CMD_S_GameStart): void {
        this._state = EBJState.Gameing;
        // this.pushcmd("s_game_start", caller, false)
        this.s_game_start(caller);
        this._isExit = false;
    }

    private s_game_start(caller: Blackjack.CMD_S_GameStart): void {
        this._state = EBJState.Gameing;
        UDebug.Info(caller)
        this._roomInfoCathe = false
        this._currentChipArea = null
        this._selfOtherSeat = new Array();
        this._selfOtherSeatClone = new Array();
        this.emit(MBJ.CC_DEFAULT_UI)
        this.emit(MBJ.CC_TS_SET_ALLCDNUM, caller.wTimeLeft)
        this.sceneInfo(caller.dCellScore, caller.roundId)
        this._currentDizhu = caller.dCellScore * BJ_SCALE;

        for (const key1 in this._battleplayer) {
            if (this._battleplayer[key1]) {
                this._battleplayer[key1].cdtime = caller.wTimeLeft;
                this._battleplayer[key1].userStatus = 5;
            }
        }
        this.update_seat_info();
        this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, true, 1) //打开下注按钮
        if (AppGame.ins.currRoomKind == 2) {
            this.emit(MBJ.SHOW_NEXT_EXIT);
        }
        // this.emit(MBJ.CC_TS_SHOW_MATCH,true);
        this.emit(MBJ.HIDE_MASK, false);
        this.emit(MBJ.SHOW_CHAT, true);
        this.emit(MBJ.SHOW_NUMBER);
        this.cmdRun()
    }

    private game_addScore(caller: Blackjack.CMD_S_AddScore): void {
        this.pushcmd("s_game_addScore", caller, true)
    }

    public s_game_addScore(caller: Blackjack.CMD_S_AddScore): void {
        if (caller.wJettonScore <= 0) return
        UDebug.Info(caller)

        /**测试数据 。。 */
        // caller.wOperUser = 1
        // caller.wJettonScore = 5 ;
        // caller.wUserScore = 3333;
        this.add_chip(caller, 0)
        let id = this.getUISeatId(caller.wOperUser) //下注的玩家
        let seatid = this.getUISeatId(caller.wSeat) //下注的区

        if (caller.wOperUser != caller.wSeat) {
            if (caller.wOperUser == this.selfRealSeatId) {
                this._selfOtherSeat.push(caller.wSeat)
                this._selfOtherSeatClone.push(caller.wSeat)
            }
        }
        this._chipAreaNum.push(seatid)
        // if (this._chipAreaNum.length >= 5  )
        // {
        //     this.emit(MBJ.CC_TS_SET_ALLCD,false);
        // }
        this.emit(MBJ.SC_TS_CHIP_SCORE, seatid, caller.wUserScore, caller.wJettonScore, id)
        if (id == BJ_SELF_SEAT)  //其他区可以下注 就开启显示其他区 
        {
            //this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN,false,1) //关掉下注按钮 
            AppGame.ins.bjModel.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, true, 5) //打开下注按钮
            this.emit(MBJ.CC_TS_SHOW_OTHER_AREA, true)  //显示其他区

        }
        if (seatid == BJ_SELF_SEAT)  //记录自己区的下注额 做续压
        {
            this._currChipNum = caller.wJettonScore
        }
        this.emit(MBJ.CC_TS_SHOW_CHIPLIGHT, seatid, false, id)//关闭下注区
        this.cmdRun();
        // this.update_seat_info();
    }

    private game_Addend(caller: Blackjack.CMD_S_EndScore): void {
        this.pushcmd("sc_game_Addend", caller, false)
    }

    //关闭冷却
    private sc_game_Addend(caller: Blackjack.CMD_S_EndScore): void {
        let id = this.getUISeatId(caller.wOperUser) //下注的玩家
        if (id == BJ_SELF_SEAT)  //其他区可以下注 就开启显示其他区 
        {
            this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, false, 1) //关掉下注按钮 
        }
        this.emit(MBJ.CC_TS_SET_ONECD, id, false) //关冷却
        this.emit(MBJ.CC_TS_SHOW_CAOZUO_STATE, id, 0)    //显示下注完成提示
        this.cmdRun()
    }

    private game_dealCard(caller: Blackjack.CMD_S_DealCard): void {
        this._fristoperate = true  // 第一次操作 来延后操作按钮
        this._fristoperateResult = true
        this.pushcmd("s_game_dealCard", caller, true)
    }

    public s_game_dealCard(caller: Blackjack.CMD_S_DealCard): void {
        this._game_dealCard = caller;
        /**分发 发牌 */
        UDebug.Info(caller)
        this.emit(MBJ.CC_TS_SHOW_OTHER_AREA, false)  //关闭其他区
        this.emit(MBJ.CC_TS_SET_ALLCD, false);
        this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, false, 1)
        if (caller.wTimeLeft == 0) caller.wTimeLeft = 15
        this.emit(MBJ.CC_TS_SET_ALLCDNUM, caller.wTimeLeft)  //总操作时间

        let numtime = 0;
        let handler = null;
        let playLen = caller.cbHandCards.length
        for (const key in caller.cbHandCards) {  //第一张牌
            let data = new UIBJFanPai()
            let pokedata = new UIBJPoker()
            pokedata.pokerIcons = new Array<number>()
            data.poker = pokedata;
            data.seatId = this.getUISeatId(caller.cbHandCards[key].wChairId);
            pokedata.pokerIcons.push(caller.cbHandCards[key].cbHandCardData[0])
            pokedata.pokerType = caller.cbHandCards[key].cbHandCardType.toString()
            // data. = caller.cbHandCards[key].chHandCardPoint
            if (caller.cbHandCards[key].wChairId == BJ_ZHUANGJIA_SEAT) {
                data.deal = 0;
                numtime += fapaitime;
                numtime += 0.2;
            }
            else {
                numtime += fapaitime;
                data.deal = numtime;
            }
            data.isOneHand = true
            data.showNum = true;
            this.emit(MBJ.SC_TS_FAPAI, data);
        }

        let curLen = 0;
        let leng = caller.cbHandCards.length

        for (const key in caller.cbHandCards) { //第二张牌
            handler = null;
            let data = new UIBJFanPai()
            let pokedata = new UIBJPoker()
            pokedata.pokerIcons = new Array<number>()
            data.poker = pokedata;
            data.seatId = this.getUISeatId(caller.cbHandCards[key].wChairId);
            pokedata.pokerIcons.push(caller.cbHandCards[key].cbHandCardData[1])
            pokedata.pokerType = caller.cbHandCards[key].cbHandCardType.toString()
            // data. = caller.cbHandCards[key].chHandCardPoint
            //UDebug.Info(pokedata.pokerIcons)
            if (caller.cbHandCards[key].wChairId == BJ_ZHUANGJIA_SEAT) {
                data.deal = fapaitime * playLen
            }
            else {
                numtime += fapaitime;
                data.deal = numtime;
            }
            data.isOneHand = true
            if (caller.cbHandCards[key].wChairId == BJ_ZHUANGJIA_SEAT) {
                data.showNum = false;
            }
            else {
                data.showNum = true;
            }
            curLen++;
            if (curLen == leng - 1) {
                //是否购买保险回调
                if (caller.wNeedInsure) {
                    //初始化保险
                    this._currBaoxianSeat = this.selfRealSeatId;
                    handler = UHandler.create(this.openBaoxianBtn, this, true, this._currBaoxianSeat);
                    this.emit(MBJ.CC_TS_SET_ONECD, BJ_SELF_SEAT, true, caller.wTimeLeft);
                }
                else //不买保险直接冷却
                {
                    // let data = new Blackjack.CMD_S_Operate()
                    // data.wSeat  = caller.wSeat
                    // data.wOperUser = caller.wCurrentUser
                    // data.wOpercode = caller.wOpercode
                    // data.wTimeLeft = caller.wTimeLeft
                    // if (caller.wTimeLeft != 0)
                    // {
                    //     handler =UHandler.create(this.s_game_operate,this,true,data)
                    // }
                    handler = UHandler.create(this.cmdRun, this, true)
                }
            }
            this.emit(MBJ.SC_TS_FAPAI, data, handler);
            //data.playPos =i;
        }
    }

    private openBaoxianBtn(index: number) {
        this._currBaoxianSeat = index
        let seatid = this.getUISeatId(this._currBaoxianSeat);

        this.emit(MBJ.CC_TS_SHOW_JUGUANGDENG, seatid, true); //开聚光灯
        this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, true, 3)
        if (this._battleplayer[this._selfUISeatId].userStatus !== 5) {
            this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, false, 6);
            this.emit(MBJ.CC_TS_SHOW_JUGUANGDENG, 0, false); //开聚光灯
            this.emit(MBJ.CC_TS_SET_ONECD, BJ_SELF_SEAT, false);
            // return
        }
        this.cmdRun()
    }

    private game_insure(caller: Blackjack.CMD_S_Insure): void {
        this.pushcmd("s_game_insure", caller, true)
    }

    private s_game_insure(caller: Blackjack.CMD_S_Insure): void {
        UDebug.Info(caller)
        //扣钱
        let id = this.getUISeatId(caller.wInsureUser);
        caller.wSeat = (caller.wSeat != null) ? caller.wSeat : caller.wInsureUser  //？
        let seatid = this.getUISeatId(caller.wSeat);

        this.emit(MBJ.SC_TS_PLAYER_SCORE, id, caller.wUserScore)

        //飞保险筹码
        if (caller.bBought) //买了
        {
            this.emit(MBJ.CC_CZ_PUT_OUT_CHIP, id, seatid, 1);
            if (id == seatid)  //显示买保险状态
            {
                this.emit(MBJ.CC_TS_SHOW_BAOXIAN_INFO, seatid, true, true);
            }
            else {
                this.emit(MBJ.CC_TS_SHOW_BAOXIAN_INFO, seatid, true, false)
            }
        }
        else //不买
        {
            //显示不买状态
            this.emit(MBJ.CC_TS_SHOW_BAOXIAN_INFO, seatid, false, false)
        }
        this.cmdRun()
    }

    private game_insure_result(caller: Blackjack.CMD_S_Insure_Result): void {
        this.pushcmd("s_game_insure_result", caller, true)
    }

    private s_game_insure_result(caller: Blackjack.CMD_S_Insure_Result): void {
        UDebug.Info(caller)
        if (caller.bBankerBJ == 1)  // 1 无人操作
        {
            this.cmdRun()
        }
        else {
            this.emit(MBJ.SC_TS_HAND_ANI, UHandler.create(() => {

                if (caller.bBankerBJ == 2)  //庄家是黑杰克 发牌 游戏结束  2   动画
                {
                    this.emit(MBJ.CC_TS_SET_ALLCD, false);
                    this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, false, 1)
                    let numtime = 0;
                    let data = new UIBJFanPai()
                    let pokedata = new UIBJPoker()
                    pokedata.pokerIcons = new Array<number>()
                    data.poker = pokedata;
                    data.seatId = this.getUISeatId(BJ_ZHUANGJIA_SEAT);
                    pokedata.pokerIcons.push(caller.cbSecondCard)
                    pokedata.pokerType = "4"
                    // data. = caller.cbHandCards[key].chHandCardPoint
                    //UDebug.Info(pokedata.pokerIcons)
                    data.showNum = true;
                    numtime++;
                    data.deal = numtime;
                    data.isOneHand = true;
                    this.emit(MBJ.SC_TS_FAPAI, data, UHandler.create(this.cmdRun, this));

                }
                else if (caller.bBankerBJ == 3) //庄家收筹码  3  波动画
                {
                    this._fristoperate = false;
                    this._fristoperateResult = false
                    for (let i = 0; i < 5; i++)  //飘分
                    {
                        let id = this.getUISeatId(i);  //收筹码的位置
                        if (caller.bInsureScore[i] < 0) {
                            this.emit(MBJ.CC_CZ_FLY_CHIP, id, BJ_ZHUANGJIA_SEAT, 1)
                        }
                        else if (caller.bInsureScore[i] > 0)//庄家额外吐筹码 玩家得筹码
                        {
                            this.emit(MBJ.CC_CZ_PUT_OUT_CHIP, BJ_ZHUANGJIA_SEAT, id, 0);
                            this.emit(MBJ.CC_CZ_FLY_CHIP, id, id, 1, 0)
                        }
                        else if (caller.bInsureScore[i] == 0)//玩家得筹码
                        {
                            this.emit(MBJ.CC_CZ_FLY_CHIP, id, id, 1, 0)
                        }

                    }
                    this.cmdRun()
                }
            }, this))
        }
        // for(let i = 0 ; i<5;i++)  //飘分
        // {
        //     let id = this.getUISeatId(i);
        //     this.emit(MBJ.SC_TS_SHOW_JIESUAN,id,caller.bInsureScore[i],false)
        // }
    }

    private s_gameReadOperate(caller: Blackjack.CMD_S_Operate): void {
        // if(this._fristoperate)
        // {
        //     this._fristoperate = false ;
        this.pushcmd("s_game_operate", caller, true)
        // }
        // else
        // {
        //     this.pushcmd("s_gameReadOperate",caller,false)
        // }
    }

    //通知操作
    private s_game_operate(caller: Blackjack.CMD_S_Operate): void {
        UDebug.Info(caller)
        this.emit(MBJ.CC_TS_SET_ALLCD, false);

        let operId = this.getUISeatId(caller.wOperUser)  //操作的用户
        let seatId = this.getFenPaiYuanSeatId(caller.wSeat) //操作的位置
        if (operId == BJ_SELF_SEAT) //自己
        {
            this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, true, 4, caller.wOpercode, caller.wSeat)
        }
        else {
            this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, false, 4)
        }
        this.emit(MBJ.CC_TS_SET_ONECD, operId, true, caller.wTimeLeft);
        this.emit(MBJ.CC_TS_SHOW_JUGUANGDENG, seatId, true); //开聚光灯
        //如果有分开的位置显示
        if (caller.wSeat > 5)  //表明有两副牌 然后亮起其中一幅
        {
            this.emit(MBJ.CC_TS_SHOW_OPERATE, seatId, false) //第二手牌
        }
        else {
            this.emit(MBJ.CC_TS_SHOW_OPERATE, seatId, true) //第一手牌
        }
        this.cmdRun()
    }

    private game_oper_result(caller: Blackjack.CMD_S_Oper_Result): void {
        // if(this._fristoperateResult)
        // {
        //     this._fristoperateResult = false ;
        this.pushcmd("s_game_oper_result", caller, true)
        // }
        // else
        // {
        //     this.pushcmd("s_game_oper_result",caller,false)
        // }
    }

    //可分牌8<<可双倍4<<可要牌2<<可停牌1
    private s_game_oper_result(caller: Blackjack.CMD_S_Oper_Result): void {

        UDebug.Info(caller)

        let id = this.getUISeatId(caller.wOperUser); //操作的玩家
        let seatid = this.getFenPaiYuanSeatId(caller.wOperSeat)
        if (caller.wOperType == 1) //停牌1
        {
            this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, false, 1)
            this.emit(MBJ.CC_TS_SET_ONECD, id, false) //关冷却
            if (caller.wOperSeat > 5) {
                this.emit(MBJ.SC_TS_REF_POINT, seatid, 1)
            }
            else {
                this.emit(MBJ.SC_TS_REF_POINT, seatid, 0)
            }
        }
        else if (caller.wOperType == 2) //要牌2
        {
            this.oper_result_yaopai(caller);
            if (id == SG_SELF_SEAT) {
                this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, true, 4, caller.wOperCode)
            }
            else {
                this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, false, 4)
            }
        }
        else if (caller.wOperType == 4) //双倍
        {
            //扣钱
            this.emit(MBJ.SC_TS_PLAYER_SCORE, id, caller.wUserScore)

            let handpos = 0
            if (caller.wOperSeat <= 5) {
                handpos = 0;
            }
            else  //分牌了
            {
                handpos = 1;
            }
            //发牌
            this.oper_result_yaopai(caller);
            this.emit(MBJ.CC_TS_SHOW_PKSB_IMG, seatid, handpos) //开启双倍图片
            this.emit(MBJ.CC_TS_SET_ONECD, id, false) //关冷却
            this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, false, 4)
            if (caller.wOperSeat > 5) {
                this.emit(MBJ.SC_TS_REF_POINT, seatid, 1)
            }
            else {
                this.emit(MBJ.SC_TS_REF_POINT, seatid, 0)
            }
            //this.emit(MBJ.SC_TS_CHIP_SCORE,seatid,caller.wUserScore,caller.cbScore,id) 

        }
        else if (caller.wOperType == 8) //分牌
        {
            //扣钱
            this.emit(MBJ.SC_TS_PLAYER_SCORE, id, caller.wUserScore)
            //this.emit(MBJ.SC_TS_CHIP_SCORE,seatid,caller.wUserScore,caller.cbScore,id) 
            this.emit(MBJ.CC_TS_SHOW_FENPAI, seatid, true)
            this.oper_result_yaopai(caller);
            this.emit(MBJ.CC_TS_SET_ONECD, id, true, caller.wTimeLeft) //开冷却
            if (id == SG_SELF_SEAT) {
                this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, true, 4, caller.wOperCode, caller.wOperSeat)
            }
            else {
                this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, false, 4)
            }
            //如果有分开的位置显示
            if (caller.wOperSeat > 5)  //表明有两副牌 然后亮起第一幅
            {
                this.emit(MBJ.CC_TS_SHOW_OPERATE, seatid, false) //第e二手牌
            }
            else {
                this.emit(MBJ.CC_TS_SHOW_OPERATE, seatid, true) //第一手牌
            }
        }
        this.emit(MBJ.CC_TS_SHOW_CAOZUO_STATE, id, caller.wOperType)
        this.cmdRun()
    }

    private game_banker_deal(caller: Blackjack.CMD_S_Banker_Deal): void {
        this.pushcmd("s_game_banker_deal", caller, true)
    }

    public s_game_banker_deal(caller: Blackjack.CMD_S_Banker_Deal): void {
        UDebug.Info(caller)
        this.banker_deal_caller = caller;
        this.emit(MBJ.CC_TS_SET_ALLCD, false);
        this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, false, 1)
        this.emit(MBJ.CC_TS_SHOW_JUGUANGDENG, 0, false); //关聚光灯
        let numtime = 0.6;
        let curLen = 0;
        let leng = caller.cbHandCardData.length
        for (const key in caller.cbHandCardData) {
            let data = new UIBJFanPai()
            let pokedata = new UIBJPoker()
            pokedata.pokerIcons = new Array<number>()
            data.poker = pokedata;
            data.seatId = this.getUISeatId(BJ_ZHUANGJIA_SEAT);
            pokedata.pokerIcons.push(caller.cbHandCardData[key])
            pokedata.pokerType = "None"
            // data. = caller.cbHandCards[key].chHandCardPoint

            //UDebug.Info(pokedata.pokerIcons)
            data.showNum = true;
            numtime += fapaitime;
            data.deal = numtime;
            data.isOneHand = true;
            curLen++
            if (leng == curLen) //最后一张牌
            {
                data.deal = data.deal + 0.4
                pokedata.pokerType = caller.cbHandCardType.toString()
                this.emit(MBJ.SC_TS_FAPAI, data, UHandler.create(this.cmdRun, this));
            }
            else {
                this.emit(MBJ.SC_TS_FAPAI, data);
            }
        }
    }

    //暂存结算数据
    public s_gameEnd(caller: Blackjack.CMD_S_GameEnd): void {
        if (this.on_back) {
            return
        }
        this._end_caller = caller;
        this._isEnd = true;
        this.emit(MBJ.SHOW_CHAT, false);
        this._state = EBJState.Wait;
        this._gameEndData = caller;
        this.pushcmd("startGameEnd", caller, true);

    }

    private s_game_gameStartAi(caller: Blackjack.CMD_S_GameStartAi): void {
        UDebug.Info(caller)
    }

    //是否下局离开
    private sc_game_RoundEndExiResult(caller: Blackjack.CMD_C_RoundEndExitResult) {
        // if(caller.bExit == true){
        //     this._battleplayer = {};
        // }
        this.pushcmd("game_RoundEndExiResult", caller, true);
    }

    //运行结算数据
    private startGameEnd() {
        this.emit(MBJ.HIDE_NEXT_EXIT);
        let caller = this._gameEndData;
        UDebug.Info(caller)

        this.gameEndFlyChip()

        if (caller != null) {
            for (const key in caller.pEndPlayers) {
                let id = this.getUISeatId(caller.pEndPlayers[key].dChairId);
                this.emit(MBJ.SC_TS_PLAYER_SCORE, id, caller.pEndPlayers[key].dUserScore);
                this.emit(MBJ.SC_TS_SHOW_JIESUAN, id, caller.pEndPlayers[key].dScore, true);
                if (this._battleplayer[id]) {
                    this._battleplayer[id].score = caller.pEndPlayers[key].dUserScore;
                }


            }
            // this.emit(MBJ.SC_TS_SHOW_JIESUAN,BJ_ZHUANGJIA_SEAT,caller.dBankerWinScore,true)
            // this._battleplayer = {}  //清空玩家缓存数据
            // this.update_seat_info();
            this._playerNum = 0;
            this._gameEndData = null;
            this.emit(MBJ.CC_TS_SET_ALLCD, false)
            this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, false, 1) //关掉按钮 

            // setTimeout(() => {
            if (AppGame.ins.bjModel._state == EBJState.Gameing) {
                return
            }
            this.emit(MBJ.CC_TS_SHOW_MATCH, true);
            // }, 3000);

            //todo修改一局一匹配
            // this.emit(MBJ.CC_TS_SHOW_JIXU_BTN, true)
        }
    }

    private game_RoundEndExiResult() {

    }

    //结束飞筹码
    private gameEndFlyChip() {
        // setTimeout(() => {
        this._state = EBJState.Wait;
        // }, 2000);
        let caller = this._gameEndData
        if (caller != null) {
            for (const key in caller.pEndPlayers)  //玩家胜负信息
            {
                let id = this.getUISeatId(caller.pEndPlayers[key].dChairId);
                //回收筹码
                if (caller.pEndPlayers[key].dScore >= 0)  //飞向自己
                {
                    this.emit(MBJ.CC_CZ_FLY_CHIP, id, id)
                    UAudioManager.ins.playSound("audio_win");
                }
                else if (caller.pEndPlayers[key].dScore < 0)//飞向庄家
                {
                    this.emit(MBJ.CC_CZ_FLY_CHIP, id, BJ_ZHUANGJIA_SEAT)
                    this.emit(MBJ.CC_CZ_FLY_CHIP, id, BJ_ZHUANGJIA_SEAT)
                }
            }
            for (const key in caller.pEndHands) //手牌胜负信息
            {
                let id = this.getUISeatId(caller.pEndHands[key].dChairId);

                // SC_TS_REF_POINT  
                if (caller.pEndHands[key].dScore >= 0)  //飞向自己
                {
                    if (caller.pEndHands[key].dChairId > 5) {
                        this.emit(MBJ.CC_CZ_FLY_CHIP, id, id, 3)
                        {
                            this.emit(MBJ.SET_WINIMG, id, 1) //胜利点牌图片
                        }

                    } else {
                        this.emit(MBJ.CC_CZ_FLY_CHIP, id, id, 0)
                        this.emit(MBJ.CC_CZ_FLY_CHIP, id, id, 1)
                        this.emit(MBJ.CC_CZ_FLY_CHIP, id, id, 2)

                        this.emit(MBJ.CC_CZ_FLY_CHIP, id, id, 3) //因为没有各牌胜负 3 也一起回收 不然注释掉
                        if (caller.pEndHands[key].dScore != 0) {
                            this.emit(MBJ.SET_WINIMG, id, 0)
                        }
                    }

                }
                else if (caller.pEndHands[key].dScore < 0)//飞向庄家
                {

                    if (caller.pEndHands[key].dChairId > 5) {
                        this.emit(MBJ.CC_CZ_FLY_CHIP, id, BJ_ZHUANGJIA_SEAT, 3)
                    } else {
                        this.emit(MBJ.CC_CZ_FLY_CHIP, id, BJ_ZHUANGJIA_SEAT, 0)
                        this.emit(MBJ.CC_CZ_FLY_CHIP, id, BJ_ZHUANGJIA_SEAT, 1)
                        this.emit(MBJ.CC_CZ_FLY_CHIP, id, BJ_ZHUANGJIA_SEAT, 2)

                        this.emit(MBJ.CC_CZ_FLY_CHIP, id, BJ_ZHUANGJIA_SEAT, 3) //因为没有各牌胜负 3 也一起回收
                    }
                }

            }

        }

    }

    //创建筹码
    private add_chip(caller: Blackjack.CMD_S_AddScore, areaType: number): void {
        let wOperUsertid = this.getUISeatId(caller.wOperUser)
        let seatid = this.getFenPaiYuanSeatId(caller.wSeat)
        //this.brash_chip(wOperUsertid,seatid,caller.wUserScore,caller.wJettonScore,false)
        this.emit(MBJ.CC_CZ_PUT_OUT_CHIP, wOperUsertid, seatid, areaType, caller.wJettonScore);
    }

    //-------------------------------------------------------------

    /**添加玩家 */
    addPlayer(caller: RoomPlayerInfo): void {
        if (!this._battleplayer) {
            this._battleplayer = {};
        }
        // else{
        // for(const key in this._battleplayer){
        //     if(caller.userId == this._battleplayer[key].userId ){
        //         return
        //     }
        // }
        // }

        // if (hasDelId != null && hasDelId != -1) {
        //     delete this._battleplayer[hasDelId];
        // }
        let item = new EBJPlayerInfo();
        for (const key1 in caller) {
            if (caller.hasOwnProperty(key1)) {
                const el = caller[key1];
                item[key1] = el;
            }
        }

        item.seatId = this.getUISeatId(item.chairId);
        if (caller.userStatus == 5 && this._battleplayer[item.seatId]) {
            this._battleplayer[item.seatId].userStatus = 5;
        } else if (caller.userStatus == 6) {
            this._battleplayer[item.seatId] = null;
        }
        // item.headboxId = caller.headboxId;
        // item.vipLevel = caller.vipLevel;
        this._battleplayer[item.seatId] = item;
        let seatId = item.seatId;
        if (AppGame.ins.currRoomKind == 2) {
            if (this._state == EBJState.Gameing) {
                this.emit(MBJ.ADD_PLAYER, { seatId, caller });
            } else {
                // if(this._state == EBJState.Wait){
                //     setTimeout(() => {
                //         this.update_seat_info();
                //     }, 4000);
                // }else{
                this.update_seat_info();
                // }


            }
        } else {
            if (this._state == EBJState.Gameing) {
                return
            } else {
                this.update_seat_info();
            }
        }
        // if(this._state == EBJState.Gameing){
        //     return
        // }else{
        // this.update_seat_info();
        // }
    }
    /**添加场景玩家 */
    addScenePlayer(caller: Blackjack.IHJK_PlayerItem): void {
        if (caller.bShadow) return

        let item = new EBJPlayerInfo();
        //item.account = 
        item.cdtime = 15;
        item.chairId = caller.cbChairId;
        item.headId = caller.cbHeadIndex;
        item.location = caller.szLocation;

        item.nickName = caller.wUserId;

        item.score = caller.llScore;
        //item.seatId= caller.
        //item.sex= caller.szNickName
        // item.tableId = caller.szNickName
        item.userId = caller.wUserId
        //item.userTotal = caller.szNickName
        item.seatId = this.getUISeatId(item.chairId);
        this._battleplayer[item.seatId] = item;
        UDebug.Info(item)
        this._battleplayer[item.seatId].userStatus = 5;
        // this.update_seat_info();
    }
    /**添加下注场景影子玩家 */
    private addSceneShadowScore(caller: Blackjack.ICMD_S_StatusScore): void {

        //是否冷却
        this.emit(MBJ.CC_TS_SET_ALLCDNUM, caller.wTotalTime)
        this.emit(MBJ.CC_TS_SET_ALLCD, false)

        //添加下注信息
        for (const key in caller.GamePlayers) {

            let data = new Blackjack.CMD_S_AddScore()
            data.wJettonScore = caller.dBetScores[caller.GamePlayers[key].cbChairId]
            data.wOperUser = caller.GamePlayers[key].bShadow ? caller.GamePlayers[key].wMasterChair : caller.GamePlayers[key].cbChairId
            data.wSeat = caller.GamePlayers[key].cbChairId
            if (caller.GamePlayers[key].llScore) {
                data.wUserScore = caller.GamePlayers[key].llScore;
            }
            this.s_game_addScore(data);

        }
        for (let i = 0; i < 5; i++) {
            if (caller.bEndScore[i]) //关冷却
            {
                let id = this.getUISeatId(i) //下注的玩家
                this.emit(MBJ.CC_TS_SET_ONECD, id, false) //关冷却
            }
            else//开冷却
            {
                for (const key in caller.GamePlayers) {
                    if (!caller.GamePlayers[key].bShadow) {
                        if (caller.GamePlayers[key].cbChairId == i) {
                            let id = this.getUISeatId(caller.GamePlayers[key].cbChairId) //玩家
                            this.emit(MBJ.CC_TS_SET_ONECD, id, true, caller.wTimeLeft) //开冷却
                            if (id == BJ_SELF_SEAT && caller.GamePlayers[key].cbPlayStatus == 1) {
                                // this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, true, 2) //打开下注按钮
                                if (caller.dBetScores[caller.GamePlayers[key].cbChairId] > 0) {
                                    //下注完成按钮
                                    this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, true, 2) //打开下注按钮
                                }
                                else {
                                    this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, true, 1) //打开下注按钮
                                }
                            } else {
                                this.emit(MBJ.CC_TS_SET_ONECD, id, false) //关冷却
                                // this.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, false, 1) //关掉按钮 
                            }
                        }

                    }
                }

            }
        }
    }
    /**添加保险场景影子玩家 */
    private addSceneShadowInsure(caller: Blackjack.CMD_S_StatusInsure): void {
        //添加下注信息
        for (const key in caller.GamePlayers) {

            let data = new Blackjack.CMD_S_AddScore()
            data.wJettonScore = caller.GamePlayers[key].cbFirstHand.dTableJetton
            data.wOperUser = (caller.GamePlayers[key].bShadow) ? caller.GamePlayers[key].wMasterChair : caller.GamePlayers[key].cbChairId
            data.wSeat = caller.GamePlayers[key].cbChairId
            if (caller.GamePlayers[key].llScore) {
                data.wUserScore = caller.GamePlayers[key].llScore;
            }

            this.s_game_addScore(data);
        }
        //是否冷却
        this.emit(MBJ.CC_TS_SET_ALLCDNUM, caller.wTotalTime)
        this.emit(MBJ.CC_TS_SET_ALLCD, false)
        //添加玩家牌信息
        for (const key in caller.GamePlayers) {
            for (const index in caller.GamePlayers[key].cbFirstHand.cbHandCardData) {
                let data = new UIBJFanPai()
                let pokedata = new UIBJPoker()
                pokedata.pokerIcons = new Array<number>()
                data.poker = pokedata;
                data.seatId = this.getUISeatId(caller.GamePlayers[key].cbChairId);
                pokedata.pokerIcons.push(caller.GamePlayers[key].cbFirstHand.cbHandCardData[index])
                pokedata.pokerType = caller.GamePlayers[key].cbFirstHand.cbHandCardType.toString()
                data.showNum = true
                data.deal = 0;
                data.isOneHand = true
                UDebug.Info(data)
                this.emit(MBJ.SC_TS_FAPAI, data)
            }
        }

        //庄家牌信息
        for (let i = 0; i < 2; i++) {
            let data = new UIBJFanPai()
            let pokedata = new UIBJPoker()
            pokedata.pokerIcons = new Array<number>()
            data.poker = pokedata;
            data.seatId = BJ_ZHUANGJIA_SEAT;
            pokedata.pokerIcons.push(caller.wBankerHand.cbHandCardData[i])
            pokedata.pokerType = caller.wBankerHand.cbHandCardType.toString()
            if (i == 0) {
                data.showNum = true
            }
            else {
                data.showNum = false
            }
            data.deal = 0;
            data.isOneHand = true
            this.emit(MBJ.SC_TS_FAPAI, data)
        }
        for (let i = 0; i < 5; i++) //购买保险状态 0:未决定，1买了，2没买
        {
            if (caller.cbInsureStatus[i] != 0) //冷却不开
            {
                if (caller.cbInsureStatus[i] == 1) {
                    let id = this.getUISeatId(i); //下注的玩家
                    //添加下注信息
                    for (const key in caller.GamePlayers) {
                        if (caller.GamePlayers[key].cbChairId == i) {
                            let selfid = this.getUISeatId(caller.GamePlayers[key].wMasterChair); //下注的玩家
                            this.emit(MBJ.CC_CZ_PUT_OUT_CHIP, selfid, id, 1);
                            if (caller.GamePlayers[key].bShadow) {
                                this.emit(MBJ.CC_TS_SHOW_BAOXIAN_INFO, id, true, false)
                            }
                            else {
                                this.emit(MBJ.CC_TS_SHOW_BAOXIAN_INFO, id, true, true)
                            }
                        }
                    }
                }
            }
            else//开冷却
            {
                for (const key in caller.GamePlayers) {
                    if (caller.GamePlayers[key].bShadow) {
                        let id = this.getFenPaiYuanSeatId(caller.GamePlayers[key].wMasterChair) //玩家
                        this.emit(MBJ.CC_TS_SET_ONECD, id, true, caller.wTimeLeft) //开冷却
                        if (id == BJ_SELF_SEAT) {
                            //初始化保险
                            this.openBaoxianBtn(caller.GamePlayers[key].wMasterChair)
                        }
                    }
                    else {
                        let id = this.getFenPaiYuanSeatId(caller.GamePlayers[key].cbChairId) //玩家
                        this.emit(MBJ.CC_TS_SET_ONECD, id, true, caller.wTimeLeft) //开冷却
                        if (id == BJ_SELF_SEAT) {
                            //初始化保险
                            this.openBaoxianBtn(caller.GamePlayers[key].cbChairId)
                        }
                    }
                }
            }
        }
        this.emit(MBJ.CC_TS_SHOW_OTHER_AREA, false)  //关闭其他区
    }

    /**添加play场景影子玩家 */
    private addSceneShadowPlay(caller: Blackjack.CMD_S_StatusPlay): void {
        this._state = EBJState.Gameing;
        //是否冷却
        this.emit(MBJ.CC_TS_SET_ALLCDNUM, caller.wTotalTime)
        this.emit(MBJ.CC_TS_SET_ALLCD, false)
        //添加保险   下注信息
        for (const key in caller.GamePlayers) {
            if (caller.GamePlayers[key].bInsured) //买了保险
            {
                let id = this.getUISeatId(caller.GamePlayers[key].cbChairId)
                if (caller.GamePlayers[key].bShadow) //影子玩家
                {
                    this.emit(MBJ.CC_TS_SHOW_BAOXIAN_INFO, id, true, false)
                }
                else {
                    this.emit(MBJ.CC_TS_SHOW_BAOXIAN_INFO, id, true, true)
                }
            }

        }
        //添加玩家牌信息
        for (const key in caller.GamePlayers) {
            let isFenpai = false;
            if (caller.GamePlayers[key].cbSecondHand)  //检测分牌
            {
                if (caller.GamePlayers[key].cbSecondHand.cbHandCardData.length > 0) {
                    isFenpai = true;
                }
            }
            //------------------------------------ 下注
            let data = new Blackjack.CMD_S_AddScore()
            data.wJettonScore = caller.GamePlayers[key].cbFirstHand.dTableJetton
            data.wOperUser = (caller.GamePlayers[key].bShadow) ? caller.GamePlayers[key].wMasterChair : caller.GamePlayers[key].cbChairId
            data.wSeat = caller.GamePlayers[key].cbChairId;
            if (caller.GamePlayers[key].llScore) {
                data.wUserScore = caller.GamePlayers[key].llScore;
            }
            this.s_game_addScore(data);
            let seat = this.getFenPaiYuanSeatId(caller.GamePlayers[key].cbChairId)
            if (isFenpai) //分牌
            {
                this.emit(MBJ.CC_TS_SHOW_FENPAI, seat, false)   //分牌
                //发二手
                for (const index in caller.GamePlayers[key].cbSecondHand.cbHandCardData) {
                    let data = new UIBJFanPai()
                    let pokedata = new UIBJPoker()
                    pokedata.pokerIcons = new Array<number>()
                    data.poker = pokedata;
                    data.seatId = seat;
                    pokedata.pokerIcons.push(caller.GamePlayers[key].cbSecondHand.cbHandCardData[index])
                    pokedata.pokerType = caller.GamePlayers[key].cbSecondHand.cbHandCardType.toString()
                    data.showNum = true
                    data.deal = 0;
                    data.isOneHand = false

                    UDebug.Info(data)
                    this.emit(MBJ.SC_TS_FAPAI, data)
                }
            }
            //发一手
            for (const index in caller.GamePlayers[key].cbFirstHand.cbHandCardData) {
                let data = new UIBJFanPai()
                let pokedata = new UIBJPoker()
                pokedata.pokerIcons = new Array<number>()
                data.poker = pokedata;
                data.seatId = seat;
                pokedata.pokerIcons.push(caller.GamePlayers[key].cbFirstHand.cbHandCardData[index])
                pokedata.pokerType = caller.GamePlayers[key].cbFirstHand.cbHandCardType.toString()
                data.showNum = true
                data.deal = 0;
                data.isOneHand = true
                UDebug.Info(data)
                this.emit(MBJ.SC_TS_FAPAI, data);
            }
        }

        //庄家牌信息
        for (let i = 0; i < 2; i++) {
            let data = new UIBJFanPai()
            let pokedata = new UIBJPoker()
            pokedata.pokerIcons = new Array<number>()
            data.poker = pokedata;
            data.seatId = BJ_ZHUANGJIA_SEAT;
            pokedata.pokerIcons.push(caller.wBankerHand.cbHandCardData[i])
            pokedata.pokerType = caller.wBankerHand.cbHandCardType.toString()
            if (i == 0) {
                data.showNum = true
            }
            else {
                data.showNum = false
            }
            data.deal = 0;
            data.isOneHand = true
            this.emit(MBJ.SC_TS_FAPAI, data)
        }

        //通知操作
        let odata = new Blackjack.CMD_S_Operate()
        odata.wOperUser = caller.wCurrentUser
        odata.wOpercode = caller.wOpercode
        odata.wSeat = caller.wCurrentIndex
        odata.wTimeLeft = caller.wTimeLeft
        this.s_game_operate(odata)

        this.emit(MBJ.CC_TS_SHOW_OTHER_AREA, false)  //关闭其他区
    }

    public update_seat_info(): void {
        // this._state = EBJState.Gameing;
        let ar = {};
        for (const key in this._battleplayer) {
            if (this._battleplayer[key] != null) {
                if (this._battleplayer.hasOwnProperty(key)) {
                    const element = this._battleplayer[key];
                    element.seatId = this.getUISeatId(element.chairId);
                    ar[element.seatId] = element;

                }

                // if(this._battleplayer[key].userStatus !== 5){
                //     this._state = EBJState.Match;
                // }
            }

        }
        // if(this._state == EBJState.Wait){
        //     setTimeout(() => {
        this.emit(MBJ.CC_UPDATA_SEAT_INFO, ar);
        // }, 4000);
        // }

    }
    sendFreshGameScene() {
        UMsgCenter.ins.sendPkg(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, Blackjack.SUBID.CS_GAMESCENE_FRESH, {});
    }

    sendNextExit(b: boolean): void {
        var data = {
            bExit: b,
        }
        UMsgCenter.ins.sendPkg(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, Blackjack.SUBID.SUB_C_ROUND_END_EXIT, data);
    }

    /**请求下注 */
    requestaddScore(score: number): void {
        let pl = this._battleplayer[BJ_SELF_SEAT];
        if (score > pl.score) {
            //AppGame.ins.bjModel.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN,true,2) //打开下注按钮  重新选择
            AppGame.ins.showTips(cfg_errorCode[2])
            return;
        }

        /**发送命令*/
        let data = Blackjack.CMD_C_AddScore.create();
        if (this._currentChipArea) {
            data.dSeat = this.getRealSeatId(this._currentChipArea);
        }
        else {
            data.dSeat = this.selfRealSeatId;
        }
        data.dScore = score;
        UMsgCenter.ins.sendPkg(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, Blackjack.SUBID.SUB_C_ADD_SCORE, data);
    }

    //可分牌8<<可双倍4<<可要牌2<<可停牌1
    private oper_result_yaopai(caller: Blackjack.CMD_S_Oper_Result): void {
        if (caller.cbFirstHandCardData) {
            let data = new UIBJFanPai()
            let pokedata = new UIBJPoker()
            pokedata.pokerIcons = new Array<number>()
            data.poker = pokedata;
            data.seatId = this.getFenPaiYuanSeatId(caller.wOperSeat) //操作的桌子位置; 
            //
            pokedata.pokerIcons.push(caller.cbFirstHandCardData)
            pokedata.pokerType = caller.cbFirstHandCardType.toString()
            // data. = caller.cbHandCards[key].chHandCardPoint
            //UDebug.Info(pokedata.pokerIcons)
            data.showNum = true;
            data.deal = 0;
            if (caller.wOperSeat <= 5) {
                data.isOneHand = true;
            }
            else  //分牌了
            {
                data.isOneHand = false;
            }

            this.emit(MBJ.SC_TS_FAPAI, data);
        }
        if (caller.cbSecondHandCardData) {
            let data = new UIBJFanPai()
            let pokedata = new UIBJPoker()
            pokedata.pokerIcons = new Array<number>()
            data.poker = pokedata;
            data.seatId = this.getFenPaiYuanSeatId(caller.wOperSeat) //操作的桌子位置; 
            pokedata.pokerIcons.push(caller.cbSecondHandCardData)
            pokedata.pokerType = caller.cbSecondHandCardType.toString()
            // data. = caller.cbHandCards[key].chHandCardPoint
            //UDebug.Info(pokedata.pokerIcons)
            data.showNum = true;
            data.deal = 0;
            data.isOneHand = false;
            this.emit(MBJ.SC_TS_FAPAI, data);
        }
    }

    //下注完成
    onChipComplete() {
        UMsgCenter.ins.sendPkg(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, Blackjack.SUBID.SUB_C_END_SCORE, null);
    }

    /**不买保险 */
    onclickbumaibaox() {
        /**发送命令*/
        let data = Blackjack.CMD_C_Insure.create();
        data.wBuy = false;
        data.dSeat = this._currBaoxianSeat
        UMsgCenter.ins.sendPkg(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, Blackjack.SUBID.SUB_C_INSURE, data);
        if (this._selfOtherSeatClone.length > 0) {
            this._currBaoxianSeat = this._selfOtherSeatClone.pop()
            this.openBaoxianBtn(this._currBaoxianSeat)
        }
        else {
            this.emit(MBJ.CC_TS_SHOW_JUGUANGDENG, 0, false); //关聚光灯
        }
    }

    /**买保险 */
    onclickmaibaox() {
        /**发送命令*/
        let data = Blackjack.CMD_C_Insure.create();
        data.wBuy = true;
        data.dSeat = this._currBaoxianSeat
        UMsgCenter.ins.sendPkg(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, Blackjack.SUBID.SUB_C_INSURE, data);

        if (this._selfOtherSeatClone.length > 0) {
            this._currBaoxianSeat = this._selfOtherSeatClone.pop()
            this.openBaoxianBtn(this._currBaoxianSeat)
        }
        else {
            this.emit(MBJ.CC_TS_SHOW_JUGUANGDENG, 0, false); //关聚光灯
        }
    }

    /**分牌 */
    onclickfenpai() {
        /**发送命令*/
        let data = Blackjack.CMD_C_Operate.create();
        data.wOpercode = 8
        UMsgCenter.ins.sendPkg(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, Blackjack.SUBID.SUB_C_OPERATE, data);

    }

    /**停牌 */
    onclicktingpai() {
        let data = Blackjack.CMD_C_Operate.create();
        data.wOpercode = 1
        UMsgCenter.ins.sendPkg(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, Blackjack.SUBID.SUB_C_OPERATE, data);
    }

    /**双倍 */
    onclickshuanbei() {
        let data = Blackjack.CMD_C_Operate.create();
        data.wOpercode = 4
        UMsgCenter.ins.sendPkg(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, Blackjack.SUBID.SUB_C_OPERATE, data);
    }

    /**要牌 */
    onclickyaopai() {
        let data = Blackjack.CMD_C_Operate.create();
        data.wOpercode = 2
        UMsgCenter.ins.sendPkg(EGameType.BJ, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, Blackjack.SUBID.SUB_C_OPERATE, data);

    }

    /**翻牌 */
    private update_fanpai(useId: number, pai: Array<number>, paixing: number, pos: number, withAnimation: boolean = true): void {
        if (paixing == 0) return;
        let cardType = new Array<string>();
        cardType[0] = "None";
        cardType[1] = "21d";
        cardType[2] = "bust";
        cardType[3] = "wxl";
        let pl = this._battleplayer[useId];
        pl.pai = pai;
        pl.paiXing = paixing;
        let fanpan = new UIBJFanPai();
        fanpan.seatId = pl.seatId;
        //fanpan.isOneHand =
        fanpan.withAnimation = withAnimation;
        fanpan.poker = new UIBJPoker();
        fanpan.poker.pokerType = cardType[paixing];
        fanpan.poker.pokerIcons = [];
        pai.forEach(element => {
            fanpan.poker.pokerIcons.push(element);
        });
        this.emit(MBJ.SC_TS_FAN_PAI, fanpan);
    }

    /**当前点击的下注区 为seat 位置 */
    setChipArea(id: number): void {
        this._currentChipArea = id;
        // let seatId = this.getRealSeatId(id) + 1;
        // this.emit(MBJ.SHOW_NUMBER,{id,seatId});
        //关掉所有下注区
        //this.emit(MBJ.CC_TS_SHOW_CHIPLIGHTSPRITE)
    }

    /**自己的真实位置 */
    get selfRealSeatId(): number {
        let role = AppGame.ins.gamebaseModel.getRoomPlayerInfo(this.selfUserId);
        return role.chairId;
    }

    /**
   * 玩家自己的userid
   */
    protected get selfUserId(): number {
        return AppGame.ins.roleModel.useId;
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
        if (realId == BJ_ZHUANGJIA_SEAT) {
            return BJ_ZHUANGJIA_SEAT;
        }
        let temp = this.selfRealSeatId - this._selfUISeatId;
        let temp2 = realId - temp;
        if (temp2 < 0) temp2 = 5 + temp2;

        return temp2;
    }

    //获得分牌的操作玩家位置 传chairid  出seatid 0-0+6 1-1+6  2-2+6 3-3+6 4-4+6
    getFenPaiYuanSeatId(seat: number): number {
        return this.getUISeatId((seat >= 6) ? seat - 6 : seat)
    }

    /**逻辑运行 */
    update(dt: number): void {
        while (this._canGetCmd && this._cmds.length > 0) {
            let cmd = this.getcmd();
            if (cmd) {
                this._canGetCmd = !cmd.needwait;
                this.docmd(cmd);
            } else {
                this._canGetCmd = true;
            }
        }
    }

    /**将命令压入等待处理队列 命令名和函数名相同*/
    protected pushcmd(cmd: string, dt: any, needwait: boolean): void {
        if (!this._cmds) this._cmds = [];
        let item = new UBJCmd();
        item.cmd = cmd;
        item.data = dt;
        item.needwait = needwait;
        this._cmds.push(item);
    }

    /**取命令 */
    protected getcmd(): UBJCmd {
        if (this._cmds.length > 0) {
            let len = this._cmds.length;
            let dt = this._cmds.shift();
            return dt;
        }
        return null;
    }

    clearCmds(): void {
        if (this._cmds) {
            this._cmds = []
        }
        this._state = EBJState.Wait;
    }

    clearPlayer() {
        this._battleplayer = {}
        this._roomInfoCathe = true
    }

    /**处理消息队列 */
    private docmd(cmd: UBJCmd): void {
        UDebug.Info(cmd.data)
        this[cmd.cmd].call(this, cmd.data)
    }

    public cmdRun(): void {
        this._canGetCmd = true
    }

}
