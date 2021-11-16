import Model from "../../common/base/Model";
import AppGame from "../../public/base/AppGame";
import { ECommonUI, ELevelType, EGameHot, EGameType, EGameState, ELeftType, EMsgType } from "../../common/base/UAllenum";
import ULanHelper from "../../common/utility/ULanHelper";
import UHandler from "../../common/utility/UHandler";
import { ZJHBattlePlayerInfo, EZJHState, UIZJHChip, EBattlePlayerPaiState, UIZJHChipItem, UIZJHNextTurn, UIZJHChips, UIZJHCompare, UIZJHUpdateSeatRoleInfo, UIZJHOverTurn, UIZJHUpdateTurnTime, UIZJHFanPai, UIZJHPoker, UIZJHBattleOver, UIZJHStaticsItem, UIZJHSetZHU, UIZJHOperate } from "./UZJHClass_hy";
import { RoomInfoHy, RoomPlayerInfo } from "../../public/hall/URoomClass";
import cfg_chip from "../../config/cfg_chip";
import UMsgCenter from "../../common/net/UMsgCenter";
import { Game, FZJH, GameFriendServer } from "../../common/cmd/proto";
import VZJHComparePlayer_hy from "./VZJHComparePlayer_hy";
import UDebug from "../../common/utility/UDebug";
import UPokerHelper from "../../common/utility/UPokerHelper";
import cfg_paixing from "../../config/cfg_paixing";
import MBaseGameModel from "../../public/hall/MBaseGameModel";
import MRoomModel from "../../public/hall/room_zjh/MRoomModel";
import { EventManager } from "../../common/utility/EventManager";
import cfg_event from "../../config/cfg_event";
import VZJH_hy from "./VZJH_hy";
import VZJHOperate_hy from "./VZJHOperate_hy";
import MZJH from "../zjh/MZJH";

export const ZJH_SELF_SEAT = 0;
export const ZJH_TURN_COUNT_TO_COMPARE = 1;
export const ZJH_SCALE = 0.01;
export const UNIT = 100;


/**
 * 创建:sq
 * 扎金花游戏model
 */
export default class MZJH_hy extends Model {

    //#region 服务消息拆分
    static SC_TS_SET_GAME_FREE = "SC_TS_SET_GAME_FREE";
    /**推送更新当前轮数 */
    static SC_TS_UPDATA_TOTAL_TURN = "SC_TS_UPDATA_TOTAL_TURN";
    /**推送更新当前总分数*/
    static SC_TS_UPDATA_TOTAL_SCORE = "SC_TS_UPDATA_TOTAL_SCORE";
    /**推送加分是 加注还是跟注 */
    static SC_TS_SET_ZHU = "SC_TS_SET_ZHU";
    /**推送更新玩家总分数和下注分数 */
    static SC_TS_UPDATA_TOTAL_PLAYER_SCORE = "SC_TS_UPDATA_TOTAL_PLAYER_SCORE";
    /**游戏结束 */
    static SC_TS_GAME_END = "SC_TS_GAME_END";
    /**推送发牌 */
    static SC_TS_FAPAI = "SC_TS_FAPAI";
    /**看牌 */
    static SC_TS_LOOK_PAI = "SC_TS_LOOK_PAI";
    /**看牌 */
    static SC_TS_FAN_PAI = "SC_TS_FAN_PAI";
    /**比牌输 */
    static SC_TS_BIPAI_SHU = "SC_TS_BIPAI_SHU";
    /**推送下一个Turn */
    static SC_TS_SET_NEXT_TURN = "SC_TS_SET_NEXT_TURN";
    /**推送turn结束 */
    static SC_TS_SET_TURN_OVER = "SC_TS_SET_TURN_OVER";
    /**推送玩家比牌 */
    static SC_TS_PLAYER_COMPARE = "SC_TS_PLAYER_COMPARE";
    /**推送玩家孤注一致 */
    static SC_TS_GUZHUYIZHI = "SC_TS_GUZHUYIZHI";
    /**推送玩家孤注一致 */
    static SC_TS_SHOW_MATCH = "SC_TS_SHOW_MATCH";
    /**玩家操作结果下注 */
    static SC_CZ_PUT_OUT_CHIP = "SC_CZ_PUT_OUT_CHIP";
    /** 玩家弃牌*/
    static SC_TS_PLAYER_GIVE_UP = "SC_TS_PLAYER_GIVE_UP";
    /**刷新自己的筹码 */
    static SC_TS_REFRESH_CHIP = "SC_TS_REFRESH_CHIP";
    /**更新伦的时间 */
    static SC_TS_UPDATA_TURN_TIME = "SC_TS_UPDATA_TURN_TIME";
    /**结束自己的turn */
    static CC_END_SELF_TURN = "CC_END_SELF_TURN";
    /** 开始跟注*/
    static CC_UPDATE_AUTO_GENZHU = "CC_UPDATE_AUTO_GENZHU";
    /**开始匹配 */
    static CC_START_MATCH = "CC_START_MATCH";
    /**更新座位上玩家信息 */
    static CC_UPDATA_SEAT_INFO = "CC_UPDATA_SEAT_INFO";

    static SC_TS_CANCLE_MATCH = "SC_TS_CANCLE_MATCH";

    static SC_TS_XIAN_SHOU = "SC_TS_XIAN_SHOU";

    static SC_TS_UPDATA_GAME_NUMBER = "SC_TS_UPDATA_GAME_NUMBER";
    /**防超时 */
    static SC_TS_FANGCHAOSHI = "SC_TS_FANGCHAOSHI";

    /**防超时 */
    static SC_TS_START_MATCH = "SC_TS_START_MATCH";
    static SC_TS_LEFT = "SC_TS_LEFT";
    static UPDATE_ROOM_ID = "UPDATE_ROOM_ID";
    static SHOW_RESULT = 'SHOW_RESULT';

    /**玩家已准备 */
    static PLAYER_READY = "PLAYER_READY";
    /**玩家旁观 */
    static PLAYER_PAUSE = "PLAYER_PAUSE";
    /**玩家下局旁观 */
    static NEXT_PAUSE = "NEXT_PAUSE";
    /**玩家下局旁观 */
    static PLAYER_NEXT_PAUSE = "PLAYER_NEXT_PAUSE";
    /**房主ID */
    static ROOM_USERID = "ROOM_USERID";
    /**再来一局 */
    static PLAY_AGAIN = "PLAY_AGAIN";
    /**收到消息 */
    static RECEIVE_MESSAGE = "RECEIVE_MESSAGE";
    /**隐藏按钮 */
    static HIDE_BTN = "HIDE_BTN";
    /**更新底注 */
    static UPDATE_DIZHU = "UPDATE_DIZHU";
    /**超时消息 */
    static TIME_OUT = "TIME_OUT";
    /**玩家状态改变 */
    static USSTAUTS_CHANGE = "USSTAUTS_CHANGE";
    /**一局结束后玩家状态改变 */
    static STAUTS_CHANGE = 'STAUTS_CHANGE';
    /**勾选下局旁观后一直显示下局旁观勾选 */
    static SHOW_NEXT_PAUSE = 'SHOW_NEXT_PAUSE';
    /**显示再来一局按钮 */
    static SHOW_AGAIN = 'SHOW_AGAIN';
    /**玩家已点击再来一局按钮 */
    static OWNER_CLICK_AGAIN = 'OWNER_CLICK_AGAIN';
    /**展示旁观按钮 */
    static SHOW_PAUSE = 'SHOW_PAUSE';
    /**禁止聊天 */
    static CHAT_LIMIT = 'CHAT_LIMIT';
    /**断线重连隐藏按钮 */
    static RECONNECT_HIDE = "RECONNECT_HIDE";
    /**自己弃牌 */
    static SELF_GIVEUP = "SELF_GIVEUP";
    /**断线重连设置灯光角度 */
    static SET_LIGHT = "SET_LIGHT";
    /**刷新场景*/
    static RESET_SCENE = "RESET_SCENE";

    static SHOW_EXIT_NEXT = 'SHOW_EXIT_NEXT';

    static ZJH_ROOM_CHARGE_ROOM_CARD = 'ZJH_ROOM_CHARGE_ROOM_CARD';

    static ADUIT = 'ADUIT';

    static SC_TS_FANPAI = "SC_TS_FANPAI";

    static SHOW_NEXT_PAUSE_BTN = "SHOW_NEXT_PAUSE_BTN";

    static SHOW_BASEINFO = "SHOW_BASEINFO";
    
    static BRASH_CHIP = "BRASH_CHIP";

    static HIDE_NEXT_PAUSE_BTN = "HIDE_NEXT_PAUSE_BTN";

    static HIDE_CHAT = "HIDE_CHAT";

    static STATUS_WATCHING = "STATUS_WATCHING";

    static STATUS_GAMING = "STATUS_GAMING";

    static STATUS_NONE = "STATUS_NONE";

    static STATUS_QIPAI = "STATUS_QIPAI";

    static STATUS_PANGGUAN = "STATUS_PANGGUAN";

    static STATUS_READY = "STATUS_READY";

    static GET_CMD = "GET_CMD";

    static NEXT_PAUSE_ISCHECK = "NEXT_PAUSE_ISCHECK";

    static RESET_SEAT = "RESET_SEAT";

    static s_ins: MZJH_hy;

    static get ins(): MZJH_hy {
        if (MZJH_hy.s_ins == null) {
            MZJH_hy.s_ins = new MZJH_hy();
            MZJH_hy.s_ins.init();
        }
        return MZJH_hy.s_ins;
    }

    static CLICK_READY = 'CLICK_READY';

    /**chip的id */
    private _chipObjId: number = 1;
    public _is_room_owner: boolean = false;
    //#endregion
    /**
     * 游戏状态
     */
    public _state: EZJHState = EZJHState.Match;
    /**本局的玩家 */
    public _battleplayer: { [key: number]: ZJHBattlePlayerInfo };
    get gBattlePlayer(): { [key: number]: ZJHBattlePlayerInfo } {
        return this._battleplayer;
    }
    /**
     * 游戏结束的时候copy一份用，因为代码里面延迟执行了 当延迟的时候会造成数据的不一致
     */
    get CopyBattlePlayer(): { [key: number]: ZJHBattlePlayerInfo } {
        let data = {};
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                const element = this._battleplayer[key];
                data[key] = element;
            }
        }
        return data;
    }

    private _selfUISeatId: number = ZJH_SELF_SEAT;
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
    public _roomInfo: RoomInfoHy;

    private _retrunLobby: boolean;
    private _nextExit: boolean;
    public set nextExit(v: boolean) {
        this._nextExit = v;
    }
    private _nextLook: boolean;
    public set nextLook(v: boolean) {
        this._nextLook = v;
    }

    private _user_count: number;
    private _long_timg: boolean;
    public set long_timg(v: boolean) {
        this._long_timg = v;
    }

    private isBool: boolean = false;

    public clickAgain: boolean = false;

    public _sengMsg: boolean = false;

    public _isEnd: boolean = false;

    public _compare_card: any = null;

    public _end_caller: any = null;

    public on_back: boolean = false;

    private allchips = null;

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
        return role.chairId;
    }
    /**
     * 游戏状态
     */
    get state(): EZJHState {
        return this._state;
    }

    /**当前的底注 */
    get currentDizhu(): number {
        return this._currentDizhu;
    }
    get roomInfo(): RoomInfoHy {
        return this._roomInfo;
    }
    set roomInfo(v: RoomInfoHy) {
        this._roomInfo = v;
    }
    /**是否预解散 */
    isPreDismiss: boolean = false;
    /**
     * 房主ID
     */
    public room_userid: number;

    public _end_time: boolean = false;

    public restart: boolean = false;
    resetData(): void {

    }
    /**逻辑运行 */
    update(dt: number): void {

    }
    run(): void {
        super.run();
        this._retrunLobby = false;
        this._state = EZJHState.Match;
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_ENTER_GAME, this.sc_ts_enter_game, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.sc_ts_player_usstatus_change, this);
    }
    exit(): void {
        this.isPreDismiss = false;
        this._end_time = false;
        this.clickAgain = false;
        this.restart = false;
        super.exit();
        this.resetData();
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ENTER_GAME, this.sc_ts_enter_game, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.sc_ts_player_usstatus_change, this);
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_SC_GAMESCENE_FREE, new UHandler(this.sc_gamescene_free, this));
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_SC_GAMESCENE_PLAY, new UHandler(this.sc_gamescene_play, this));
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_SC_GAMESCENE_END, new UHandler(this.sc_gamescene_end, this));
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.CS_GAMESCENE_FRESH, new UHandler(this.sc_gamescene_fresh, this));

        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_GAME_START, new UHandler(this.s_game_start, this));
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_ADD_SCORE, new UHandler(this.s_add_score, this));
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_GIVE_UP, new UHandler(this.s_give_up, this));
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_COMPARE_CARD, new UHandler(this.s_compare_card, this));
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_LOOK_CARD, new UHandler(this.s_look_card, this));
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_GAME_END, new UHandler(this.s_game_end, this));
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_ALL_IN, new UHandler(this.s_all_in, this));
        // UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
        //     FZJH.SUBID.SUB_C_ROUND_END_EXIT, new UHandler(this.NextExit, this));
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_GIVEUP_TIMEOUT_OP, new UHandler(this.giveup_timeout_op, this));

        /**玩家准备 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_READY_RESULT, new UHandler(this.player_ready, this));

        /**旁观 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_LOOKON_RESULT, new UHandler(this.player_pause, this));

        /**下局旁观 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_NEXT_LOOKON_RESULT, new UHandler(this.player_next_pause, this));

        /**再来一轮 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_AGAIN_RESULT, new UHandler(this.play_again, this));

        /**收到消息 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_MESSAGE_RESULT, new UHandler(this.receive_message, this));

        /**提前结算 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_CONCLUDE_RESULT, new UHandler(this.settle_early, this));

        /**房主收到其他玩家补充积分的消息 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S2H_RECHARGE, new UHandler(this.supplement_points, this));

        /**玩家申请补充积分收到的审核消息 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_H2C_RECHARGE_RESULT, new UHandler(this.audit_msg, this));

        /**IP限制 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_SET_IP_LIMIT_RESULT, new UHandler(this.onIpLimit, this));

        /**控制带入 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_SET_SCORE_LIMIT_RESULT, new UHandler(this.onBringInLimit, this));

        /**自动开局 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_SET_AUTO_START_RESULT, new UHandler(this.onAutoPlay, this));

        /**15分钟超时消息 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_IDLE_TIMEOUT_RESULT, new UHandler(this.onTimeOut, this));

        /**更新玩家积分 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_GET_USER_SCORE_RESULT, new UHandler(this.onUpdateSocre, this));

        /**预解散房间 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_PRE_DISSMIS_RESULT, new UHandler(this.onShowRecord, this));

        /**解散房间 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_DISSMIS_RESULT, new UHandler(this.onOwerLeft, this));

        /**一局结算后玩家状态切换 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_CHANGE_USER_STATUS, new UHandler(this.user_status, this));

        /**收到禁止聊天的消息 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_C_SET_CHAT_LIMIT_RESULT, new UHandler(this.chat_limit, this));

        /**收到更改开局人数的消息 */
        UMsgCenter.ins.unregester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_SET_PLAYER_NUM_LIMIT_RESULT, new UHandler(this.start_limit, this));

        this._roomInfo = null;
        this._battleplayer = {};
        this._is_room_owner = false;
    }

    //#region  model 实现
    init(): void {
        this._user_count = 0;
        this._nextExit = false;
        this._nextLook = false;
        this._long_timg = false;
        this.clickAgain = false;
        this._isEnd = false;
        /**这三个命令 不是流程控制 是正常进入 断线重连  */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_SC_GAMESCENE_FREE, new UHandler(this.sc_gamescene_free, this));
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_SC_GAMESCENE_PLAY, new UHandler(this.sc_gamescene_play, this));
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_SC_GAMESCENE_END, new UHandler(this.sc_gamescene_end, this));
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.CS_GAMESCENE_FRESH, new UHandler(this.sc_gamescene_fresh, this));

        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_GAME_START, new UHandler(this.s_game_start, this));
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_ADD_SCORE, new UHandler(this.s_add_score, this));
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_GIVE_UP, new UHandler(this.s_give_up, this));
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_COMPARE_CARD, new UHandler(this.s_compare_card, this));
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_LOOK_CARD, new UHandler(this.s_look_card, this));
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_GAME_END, new UHandler(this.s_game_end, this));
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_ALL_IN, new UHandler(this.s_all_in, this));
        // UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
        //     FZJH.SUBID.SUB_C_ROUND_END_EXIT, new UHandler(this.NextExit, this));
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.SUB_S_GIVEUP_TIMEOUT_OP, new UHandler(this.giveup_timeout_op, this));

        /**玩家准备 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_READY_RESULT, new UHandler(this.player_ready, this));

        /**旁观 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_LOOKON_RESULT, new UHandler(this.player_pause, this));

        /**下局旁观 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_NEXT_LOOKON_RESULT, new UHandler(this.player_next_pause, this));

        /**再来一轮 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_AGAIN_RESULT, new UHandler(this.play_again, this));

        /**收到消息 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_MESSAGE_RESULT, new UHandler(this.receive_message, this));

        /**提前结算 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_CONCLUDE_RESULT, new UHandler(this.settle_early, this));

        /**房主收到其他玩家补充积分的消息 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S2H_RECHARGE, new UHandler(this.supplement_points, this));

        /**玩家申请补充积分收到的审核消息 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_H2C_RECHARGE_RESULT, new UHandler(this.audit_msg, this));

        /**IP限制 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_SET_IP_LIMIT_RESULT, new UHandler(this.onIpLimit, this));

        /**自动开局 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_SET_SCORE_LIMIT_RESULT, new UHandler(this.onBringInLimit, this));

        /**控制带入 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_SET_AUTO_START_RESULT, new UHandler(this.onAutoPlay, this));

        /**15分钟超时消息 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_IDLE_TIMEOUT_RESULT, new UHandler(this.onTimeOut, this));

        /**更新玩家积分 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_GET_USER_SCORE_RESULT, new UHandler(this.onUpdateSocre, this));

        /**预解散房间 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_PRE_DISSMIS_RESULT, new UHandler(this.onShowRecord, this));

        /**解散房间 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_DISSMIS_RESULT, new UHandler(this.onOwerLeft, this));

        /**一局结算后玩家状态切换 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_CHANGE_USER_STATUS, new UHandler(this.user_status, this));

        /**收到禁止聊天的消息 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_C_SET_CHAT_LIMIT_RESULT, new UHandler(this.chat_limit, this));

        /**收到更改开局人数的消息 */
        UMsgCenter.ins.regester(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            FZJH.SUBID.NN_SUB_S_SET_PLAYER_NUM_LIMIT_RESULT, new UHandler(this.start_limit, this));
    }

    private sc_ts_enter_game(): void {
        this._battleplayer = {};
    }
    private sc_ts_player_usstatus_change(data1, data2): void {
        this.emit(MZJH_hy.USSTAUTS_CHANGE, data1, data2);
    }
    private sc_ts_player_left_room(caller: GameFriendServer.MSG_C2S_UserLeftMessageResponse): void {
        if (caller.retCode == 0) {
            if (caller.type == ELeftType.ReturnToRoom) {
                this._retrunLobby = false;
                if (this._state != EZJHState.AlreadLeft) {
                    this._state = EZJHState.AlreadLeft;
                    AppGame.ins.loadLevel(ELevelType.Hall);
                    this.emit(MZJH_hy.SC_TS_LEFT);
                }
            } else if (caller.type == ELeftType.CancleMatch) {
                this.emit(MZJH_hy.SC_TS_CANCLE_MATCH, true);
                this._state = EZJHState.Wait;

            } else if (caller.type == ELeftType.LeftGame) {
                // this._battleplayer = {};
                this._currentDizhu = 0;
                this._totalChip = 0;
                this._totalTurn = 0;
                this._state = EZJHState.Match;
                // AppGame.ins.roomModel.requestMatch();
                // this.emit(MZJH_hy.SC_TS_START_MATCH, true);
            }
        } else {
            // if (caller.type == ELeftType.ReturnToRoom) {
            //     this._retrunLobby = false;
            //     AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
            //     //AppGame.ins.showUI(ECommonUI.MsgBox, { type: 1, data: ULanHelper.ZJH_CAN_EXIT_GAME });
            // }
            // else if (caller.type == ELeftType.CancleMatch) {
            //     if (this._state != EZJHState.Gameing)
            //         this.emit(MZJH_hy.SC_TS_CANCLE_MATCH, false);
            // } else if (caller.type == ELeftType.LeftGame) {
            //     if (this._state != EZJHState.Gameing)
            //         this.emit(MZJH_hy.SC_TS_START_MATCH, false);
            // }
            this._retrunLobby = false;
            caller.errorMsg && AppGame.ins.showTips(caller.errorMsg);
            return
        }
    }
    private sc_ts_room_playerinfo(caller: RoomPlayerInfo): void {
        UDebug.log("玩家进入房间：" + caller);
        for (const key in this._battleplayer) {
            if (caller.userId == this._battleplayer[key].userId) {
                return
            }
        }
        this.add_battle_player(caller);
        if(this._state == EZJHState.Wait){
            AppGame.ins.scheduleOnce(function(){
                AppGame.ins.fzjhModel.update_seat_info();
            },3)
        }else{
            this.update_seat_info();
        }
        


        if (caller.userId !== AppGame.ins.roleModel.useId) {
            this._user_count = this._user_count + 1;
        }
    }
    private add_battle_player(element: RoomPlayerInfo): ZJHBattlePlayerInfo {

        UDebug.log("玩家进入：" + JSON.stringify(element))
        if (!this._battleplayer) {
            this._battleplayer = {};
        }
        let item = new ZJHBattlePlayerInfo();
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
        item.auto = false;
        item.pai = [];
        item.cdtime = 0;
        item.userStatus = element.userStatus;
        item.headImgUrl = element.headImgUrl;
        item.paiState = EBattlePlayerPaiState.none;
        if (item.userStatus == 7) {
            item.paiState = EBattlePlayerPaiState.pangGuan;
        } else if (item.userStatus == 4) {
            item.paiState = EBattlePlayerPaiState.ready;
        }
        // }else if(item.userStatus == 6){
        //     item.paiState = EBattlePlayerPaiState.mengPai;
        // }else{
        //     item.paiState = EBattlePlayerPaiState.none;
        // }

        for (const key in this._battleplayer) {
            if (item.userId == this._battleplayer[key].userId) {
                // if(this._state == EZJHState.Gameing || this._state == EZJHState.Watching || this._state == EZJHState.Wait){
                item.paiState = this._battleplayer[key].paiState;
                // }
            }
        }
        //item.seatId = this.getUISeatId(item.chairId);
        item.fangchaoshi = true;
        this._battleplayer[item.userId] = item;
        this.update_role_seat();
        if (item.userId == AppGame.ins.roleModel.useId) {
            this.isBool = true;
            AppGame.ins.scheduleOnce(function(){
                this.isBool = false;
            },0.3)
        }

        if (!this.isBool) {
            if (item.userId !== AppGame.ins.roleModel.useId) {
                AppGame.ins.showTips("欢迎玩家" + item.userId + "进入房间");
                UDebug.log(this._roomInfo);
            }
        }
        return item;
    }
    private update_role_seat(): void {
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                let element = this._battleplayer[key];
                element.seatId = this.getUISeatId(element.chairId);
            }
        }
    }
    public update_seat_info(): void {
        // this._state = EZJHState.Gameing;
        let ar = {};
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                const element = this._battleplayer[key];
                ar[element.seatId] = element;
            }
        }
        this.emit(MZJH_hy.CC_UPDATA_SEAT_INFO, ar);
    }

    private update_xin_shou(userId: number): void {
        if (!this._battleplayer[userId]) {
            UDebug.Log("没有对应的玩家->" + userId);
            return;
        }
        this._battleplayer[userId].isFirst = true;
        this.emit(MZJH_hy.SC_TS_XIAN_SHOU, this._battleplayer[userId].seatId);
    }
    private sc_gamescene_free(caller: any): void {
        this.emit(MZJH_hy.GET_CMD);
        this.allchips = caller.allChip;
        this._roomInfo = caller.roomInfo;
        this._currentDizhu = caller.dCellScore;

        this.emit(MZJH_hy.ROOM_USERID, caller.roomInfo.roomUserId);
        this.room_userid = caller.roomInfo.roomUserId;
        this.emit(MZJH_hy.UPDATE_ROOM_ID, caller.roomInfo.roomId);
        if (caller.roomInfo.roomUserId == AppGame.ins.roleModel.useId) {
            this._is_room_owner = true;
        }
        for(let index = 0;index < caller.user.length;index++){
            for(const key in this._battleplayer){
                if(this._battleplayer[key].userId == caller.user[index].userId){
                    this._battleplayer[key].score = caller.user[index].score;
                }
            }
        }
        this.emit(MZJH_hy.UPDATE_DIZHU, caller.roomInfo.floorScore / 100);
        this._state = EZJHState.Match;
        if (caller.gameEndInfo && !this._isEnd) {
            this.emit(MZJH_hy.SHOW_RESULT,caller);
            // this.emit(MZJH_hy.RESET_SCENE, caller);
        } else {

            this.emit(MZJH_hy.RESET_SCENE, caller);
        }
        if(caller.roomInfo.bChatLimit){
            this.emit(MZJH_hy.HIDE_CHAT);
        }
    }

    private sc_gamescene_play(caller: any): void {
        this._state = EZJHState.Gameing;
        this.emit(MZJH_hy.GET_CMD);
        this.emit(MZJH_hy.RESET_SEAT);
        this.allchips = caller.allChip;
        if (caller.user.bRoundEndExit) {
            this.emit(MZJH_hy.SHOW_EXIT_NEXT);
        }
        for(let index = 0;index < caller.user.length;index++){
            if(caller.user[index].userId == this.selfUserId && caller.user[index].bRoundEndLookon){
                this.emit(MZJH_hy.NEXT_PAUSE_ISCHECK);
            }
        }
        this._compare_card = null;
        this._isEnd = false;
        this._roomInfo = caller.roomInfo;
        this.emit(MZJH_hy.UPDATE_ROOM_ID, caller.roomInfo.roomId);
        for(let index = 0;index < caller.user.length;index++){
            for(const key in this._battleplayer){
                if(this._battleplayer[key].userId == caller.user[index].userId){
                    this._battleplayer[key].score = caller.user[index].score;
                }
            }
        }

        this.update_role_seat();

        this._currentDizhu = caller.dCellScore;
        this.emit(MZJH_hy.SC_TS_UPDATA_GAME_NUMBER, caller.roundId);
        this.update_game_total(caller.dTotalJetton);
        this.update_game_turn(caller.wJettonCount);

        let zz = this._battleplayer[caller.wBankerUser];
        if (!zz) {
            UDebug.Log("没有对应的玩家->" + caller.wBankerUser);
            return;
        }
        zz.isFirst = true;
        let self = this._battleplayer[this.selfUserId];
        if (!self) {
            UDebug.Log("没有对应的玩家->" + this.selfUserId);
            return;
        } else {
            self.fangchaoshi = caller.bTimeoutGiveUp;
            // self.pai = caller.this;
            // self.paiXing = caller.cbHandCardType;
        }
        let cpl = this._battleplayer[caller.wCurrentUser];
        cpl.cdtime = caller.wTimeLeft;
        cpl.isturn = true;

        // let chips = new UIZJHChip();
        // chips.items = [];
        // chips.chipState = 0;
        // if (caller.user.userId == this.selfUserId) {
        //     this.brash_chip(this.selfUserId, 0, caller.chips, false);
        // }
        this.emit(MZJH_hy.BRASH_CHIP,caller);
        caller.GamePlayers.forEach(element => {

            let pl = this._battleplayer[element.wUserId];
            if (pl) {
                pl.userTotal = element.dTableJetton;
                pl.nextXizhuCount = caller.dCurrentJetton;
                pl.playTurn = caller.wJettonCount;
                pl.paiXing = element.cbHandCardType;
                pl.pai = element.cbHandCardData;
                pl.score = pl.score;

                if (element.bGiveUp) {
                    pl.paiState = EBattlePlayerPaiState.qiPai;
                } else {
                    if (element.bMingZhu) {
                        pl.paiState = EBattlePlayerPaiState.kanPai;
                    } else {
                        pl.paiState = EBattlePlayerPaiState.mengPai;
                    }
                }
                if (element.bLost) {
                    pl.paiState = EBattlePlayerPaiState.biPaiShu;
                }

                // if (pl.userId == caller.user.userId) {
                //     if (pl.paiState == EBattlePlayerPaiState.qiPai || pl.paiState == EBattlePlayerPaiState.biPaiShu) {
                //         pl.score = caller.user.score + element.dTableJetton;
                //     } else {
                //         pl.score = caller.user.score;
                //     }

                // }
                // }else{
                //     pl.score = pl.score;
                // }
                // if(this.selfUserId == caller.user.userId){
                //     if(pl.userId !== caller.user.userId && (pl.paiState == EBattlePlayerPaiState.mengPai || pl.paiState == EBattlePlayerPaiState.kanPai)){
                //         pl.score = pl.score  - element.dTableJetton;
                //     }
                //     // if(AppGame.ins.fzjhModel._battleplayer[this.selfUserId].paiState == EBattlePlayerPaiState.none){
                //     //     pl.score = pl.score - element.dTableJetton;
                //     // }
                // }
                // if(caller.user.userId == pl.userId && pl.userId == this.selfUserId){
                //     this._roomInfo.jettons.splice(0,1,caller.dCellScore);
                //     let jettons = UPokerHelper.splitChip(pl.userTotal, this._roomInfo.jettons, 20);
                //     jettons.forEach(element => {
                //         for (let i = 0; i < element.count; i++) {
                //             let chip = this.getchipitems(pl.seatId, element.jetton);
                //             chips.items.push(chip);
                //         }
                //     });
                // }
            } else {
                UDebug.Log("没有对应的玩家->" + element.wUserId);
            }
            /** 分发创建chipitem*/
            // this.emit(MZJH_hy.SC_CZ_PUT_OUT_CHIP, chips);
        });
        this.update_seat_info();
        if (self.paiState == EBattlePlayerPaiState.kanPai || self.paiState == EBattlePlayerPaiState.qiPai) {
            this.update_fanpai(self.userId, self.pai, self.paiXing, 5, false);
        }
        // /**分发nextturn */
        // this.step_next_player(caller.wCurrentUser, caller.wTimeLeft, caller.dCurrentJetton)
        //  if (caller.wCurrentUser == this.selfUserId) {
        /**分发刷新chip*/
        if (self.paiState == EBattlePlayerPaiState.qiPai) {
            this.brash_canmatch(self.userId);
        } else {
            this.refreshchip(caller.dCurrentJetton, self.paiState == EBattlePlayerPaiState.kanPai, self.score, self.auto);
        }
        for(let index = 0;index < caller.user.length;index++){
            if(caller.user[index].userId == AppGame.ins.roleModel.useId){
                if(caller.user[index].status == 3){
                    AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState = EBattlePlayerPaiState.none;
                }else if(caller.user[index].status == 4){
                    AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState = EBattlePlayerPaiState.ready;
                }else if(caller.user[index].status == 7){
                    AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState = EBattlePlayerPaiState.pangGuan;
                } 
            }
        }

        AppGame.ins.roleModel.saveGold(self.score);
        this.emit(MZJH_hy.UPDATE_DIZHU, caller.roomInfo.floorScore / 100);
        this.emit(MZJH_hy.SET_LIGHT, caller);

        if(AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.mengPai || AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.kanPai){
            this._state = EZJHState.Gameing;
        }else {
            this._state = EZJHState.Watching;
        }

        if(AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.none){
            this.emit(MZJH_hy.STATUS_NONE);
        }else if(AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.mengPai){
            this.emit(MZJH_hy.STATUS_GAMING);
        }else if(AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.kanPai){
            this.emit(MZJH_hy.STATUS_GAMING);
        }else if(AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.qiPai){
            this.emit(MZJH_hy.STATUS_QIPAI);
        }else if(AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.biPaiShu){
            this.emit(MZJH_hy.STATUS_QIPAI);
        }else if(AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.pangGuan){
            this.emit(MZJH_hy.STATUS_PANGGUAN);
        }else if(AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.ready){
            this.emit(MZJH_hy.STATUS_READY);
        }
        if(caller.roomInfo.bChatLimit){
            this.emit(MZJH_hy.HIDE_CHAT);
        }


        // }
    }
    private chaifenChouma(total: number): Array<any> {
        let result = [];
        let len = this._roomInfo.jettons.length;
        for (let i = len - 1; i >= 0; i--) {
            let po = Math.floor((total / this._roomInfo.jettons[i]));
            if (po > 0) {
                let item = { value: this._roomInfo.jettons[i], count: po };
                total = total - this._roomInfo.jettons[i] * po;
                result.push(item)
            }
        }
        return result;
    }
    private sc_gamescene_end(caller: FZJH.CMD_S_StatusEnd): void {
        this.emit(MZJH_hy.GET_CMD);
    }
    private giveup_timeout_op(caller: FZJH.CMD_S_GIVEUP_TIMEOUT_OP): void {
        let pl = this._battleplayer[this.selfUserId];
        pl.fangchaoshi = caller.bGiveUp;
        this.emit(MZJH_hy.SC_TS_FANGCHAOSHI, pl.fangchaoshi);
    }

    /**游戏开始 */
    private s_game_start(caller: any): void {
        this._compare_card = null;
        this._isEnd = false;
        this._roomInfo = caller.roomInfo;

        this._state = EZJHState.Gameing;
        this.restart = false;
        this.clickAgain = false;
        this._end_time = false;
        /**显示下局旁观 */
        if (this._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.pangGuan) {

        } else {
            this.emit(MZJH_hy.NEXT_PAUSE);
        }

        this.update_role_seat();
        this._roomInfo = caller.roomInfo;
        this._currentDizhu = caller.dCellScore;
        this._totalChip = caller.dTotalJetton;
        try {
            this._battleplayer[caller.wCurrentUser].cdtime = caller.wTimeLeft;
            this._battleplayer[caller.wCurrentUser].isturn = true;
            this._battleplayer[caller.wCurrentUser].isFirst = true;
        } catch (error) {
            cc.error("找不到玩家-----" + this._battleplayer[caller.wCurrentUser]);
        }
        if(this._battleplayer[caller.wCurrentUser]){

        }else{
            
        }

        let len = caller.cbPlayStatus.length;
        let chips = new UIZJHChip();
        chips.items = [];
        chips.chipState = 0;
        for (let i = 0; i < len; i++) {
            let status = caller.cbPlayStatus[i];
            let score = caller.dUserScore[i];
            let pl = this.getbattleplayerbyChairId(i);
            if (!pl) continue;
            if (status == 7) {
                pl.paiState = EBattlePlayerPaiState.pangGuan;
                // this.emit(MZJH_hy.SHOW_NEXT_PAUSE, pl.userId);
                pl.userTotal = 0;
            } else if (status == 3) {
                pl.paiState = EBattlePlayerPaiState.none;
                this.emit(MZJH_hy.SHOW_PAUSE);
                pl.userTotal = 0;
            } else if (status == 4) {
                pl.paiState = EBattlePlayerPaiState.ready;
                pl.userTotal = 0;
            } else {
                pl.paiState = EBattlePlayerPaiState.mengPai;
                pl.userTotal = this._currentDizhu;
                pl.score = score;
            }
            pl.playTurn = 0;
            pl.nextXizhuCount = caller.dCurrentJetton;
            /**创建chipitem */
            let chip = this.getchipitems(pl.seatId, this._currentDizhu);
            chips.items.push(chip);
        }

        this.emit(MZJH_hy.SC_TS_UPDATA_GAME_NUMBER, caller.roundId);
        this.update_seat_info();
        this._state = EZJHState.Gameing;

        /**分发游戏数据 */
        this.emit(MZJH_hy.SC_TS_UPDATA_TOTAL_TURN, 1);
        this.emit(MZJH_hy.SC_TS_UPDATA_TOTAL_SCORE, caller.dTotalJetton);
        /** 分发创建chipitem*/
        this.emit(MZJH_hy.BRASH_CHIP,caller);
        // this.emit(MZJH_hy.SC_CZ_PUT_OUT_CHIP, chips);

        /**分发 发牌 */
        this.emit(MZJH_hy.SC_TS_FAPAI);
        /**分发nextturn */
        this.step_next_player(caller.wCurrentUser, caller.wTimeLeft, caller.dCurrentJetton, 1);

        // if (caller.wCurrentUser == this.selfUserId) {
        let pl = this._battleplayer[this.selfUserId];
        /**分发刷新chip*/
        this.refreshchip(caller.dCurrentJetton, false, pl.score, pl.auto);
        AppGame.ins.roleModel.saveGold(pl.score);
        //}

        let users = caller.users;
        for (let index = 0; index < users.length; index++) {
            const element = users[index];
            if (element.userId == AppGame.ins.roleModel.useId) {
                if (this._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.pangGuan || this._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.none || this._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.ready) {
                    this.update_player_scoreinfo(AppGame.ins.roleModel.useId, element.score, 0);
                } else {
                    this.update_player_scoreinfo(AppGame.ins.roleModel.useId, element.score - this.currentDizhu, this.currentDizhu);
                }

            } else {
                this.update_player_scoreinfo(element.useId, element.score - this.currentDizhu, this.currentDizhu);
            }
        }
    }

    public s_game_end(caller: FZJH.CMD_S_GameEnd): void {
        if (this.on_back) {
            return
        }
        this._end_caller = caller;
        this._isEnd = true;
        this._state = EZJHState.Wait;
        let data = new UIZJHBattleOver();
        data.statics = [];
        let pl = this._battleplayer[caller.dWinneruserId];
        data.winseatId = pl.seatId;
        let selfCompare = [];
        /**将数据复制给 */
        caller.pEndUserInfo.forEach(element => {
            let pbr = this._battleplayer[element.dUserId];
            if (pbr) {
                pbr.score = element.dUserScore;
                pbr.pai = element.cbCardData;
                pbr.paiXing = element.cbCardType;
                if (pbr.seatId == this._selfUISeatId) {
                    selfCompare = element.wCompareUserId;
                }
            }
        });

        caller.pEndUserInfo.forEach(element => {
            let pbr = this._battleplayer[element.dUserId];
            if (pbr) {
                let item = new UIZJHStaticsItem();
                item.seatId = pbr.seatId;
                item.getScore = element.dGameScore;
                item.lastscore = element.dUserScore;
                item.paistate = this._battleplayer[element.dUserId].paiState;
                let idx = selfCompare.indexOf(element.dUserId);
                if (pbr.pai[0] !== 0) {
                    item.uipoker = new UIZJHPoker();
                    item.uipoker.pokerType = cfg_paixing[element.cbCardType];
                    item.uipoker.pokerIcons = [];
                    item.compareId = element.wCompareUserId;
                    element.cbCardData.forEach(element => {
                        item.uipoker.pokerIcons.push(UPokerHelper.getCardSpriteName(element));
                    });
                }
                // if ((idx > -1 && element.dUserId != this.selfUserId) || (pbr.seatId == this._selfUISeatId && pbr.paiState == EBattlePlayerPaiState.mengPai)) {
                // if (pbr.paiState !== EBattlePlayerPaiState.qiPai) {
                // }
                data.statics[item.seatId] = item;
            }
        });
        let self = this._battleplayer[this.selfUserId];
        if (self) {
            AppGame.ins.roleModel.saveGold(self.score);
            if (self.paiState == EBattlePlayerPaiState.mengPai) {
                // this.update_fanpai(self.userId,self.pai,self.paiXing,5,false);
            }
        }
        this.emit(MZJH_hy.SC_TS_GAME_END, data);
        // if(!this._nextExit && !this._long_timg){
        //     setTimeout(()=>{
        //         // EventManager.getInstance().raiseEvent(cfg_event.START_MATFCH);
        //         AppGame.ins.zjhModel.requestMatch();
        //     }, 6000);
        // }
        // setTimeout(() => {
        for(const key in this._battleplayer){
            // if(this._battleplayer[key].userStatus == 3){
                this._battleplayer[key].auto = false;
                this._battleplayer[key].userTotal = 0;
                this._battleplayer[key].playTurn = 0;
                this._battleplayer[key].isturn = false;
                this._battleplayer[key].isFirst = false;
                this._battleplayer[key].auto = false;
                this._battleplayer[key].pai = [];
                this._battleplayer[key].cdtime = 0;
                this._battleplayer[key].paiState = EBattlePlayerPaiState.none;
                this._battleplayer[key].userTotal = 0;
                this._battleplayer[key].paiXing = 0;
                this._battleplayer[key].nextXizhuCount = 0;
            // }else{

            // }

        }
        // }, 3000);
    }
    private s_add_score(caller: FZJH.CMD_S_AddScore): void {
        try {
            let pl = this._battleplayer[caller.wOpUserId];
            let zhu = new UIZJHSetZHU();
            zhu.seatId = pl.seatId;
            zhu.state = caller.cbState;
            this.emit(MZJH_hy.SC_TS_SET_ZHU, zhu);

            /**更新玩家分数 */
            this.update_player_scoreinfo(caller.wOpUserId, caller.wUserScore, caller.wAllJetton)
            /**发出筹码 */
            this.brash_chip(caller.wOpUserId, caller.cbState, caller.chips, false);
            /**结束上一个伦的玩家 */
            this.over_player_turn(caller.wOpUserId);
            /**计算下一个step玩家 */
            this.step_next_player(caller.nextStep.wNextUser, caller.nextStep.wTimeLeft, caller.nextStep.wNeedJettonScore, caller.nextStep.wTurns);

            this.update_game_total(caller.nextStep.dTotalJetton);
            this.update_game_turn(caller.nextStep.wTurns);
            if (caller.cbState == 2) {
                let pl = this._battleplayer[this.selfUserId];
                this.refreshchip(pl.nextXizhuCount, pl.paiState == EBattlePlayerPaiState.kanPai, pl.score, pl.auto);
            }
        } catch (error) {
            cc.error("找不到玩家+++++++" + this._battleplayer[caller.wOpUserId])
        }
    }

    /**玩家准备返回 */
    private player_ready(caller: FZJH.NN_CMD_S_ReadyResult): void {
        if (caller.retCode == 0) {
            UDebug.log("玩家已准备");
            let a = this.getUISeatId(caller.chairId)
            let b = this.getbattleplayerbyChairId(a);
            for (const key in this._battleplayer) {
                if (this._battleplayer[key].seatId == a) {
                    this._battleplayer[key].paiState = EBattlePlayerPaiState.ready
                }
            }
            this.emit(MZJH_hy.PLAYER_READY, a);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }
    /**玩家旁观返回 */
    private player_pause(caller: FZJH.NN_CMD_S_LookonResult): void {
        if (caller.retCode == 0) {
            UDebug.Log("玩家点击旁观");
            let a = this.getUISeatId(caller.chairId);
            for (const key in this._battleplayer) {
                if (this._battleplayer[key].chairId == caller.chairId) {
                    this._battleplayer[key].paiState = EBattlePlayerPaiState.pangGuan;
                }
            }
            this.emit(MZJH_hy.PLAYER_PAUSE, a);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }
    /**玩家下局旁观返回 */
    private player_next_pause(caller: FZJH.NN_CMD_S_NextLookonResult): void {
        if (caller.retCode == 0) {
            UDebug.Log("玩家点击下局旁观");
            let a = this.getUISeatId(caller.chairId);
            let b = caller.bLookon;
            this.emit(MZJH_hy.PLAYER_NEXT_PAUSE, { a, b });
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    private sc_gamescene_fresh(): void {

    }

    sendFreshGameScene() {
        this.sendMsg(FZJH.SUBID.CS_GAMESCENE_FRESH, {});
    }

    private play_again(caller: any): void {
        if (caller.retCode == 0) {
            UDebug.log("再来一轮");
            for(const key in this._battleplayer){
                this._battleplayer[key].paiState = EBattlePlayerPaiState.none;
            }
            if (caller.userId == this._roomInfo.roomUserId) {
                this._roomInfo = caller.roomInfo;
                this.clickAgain = true;
                this._end_time = false;
                this.restart = true;
            }
            this.emit(MZJH_hy.PLAY_AGAIN, caller);
            if (this._roomInfo.autoStart) {
                this.requestUserScore();
            } else {
                if (this._state !== EZJHState.Gameing) {
                    this.requestUserScore();
                }
            }
        }
        else if (caller.retCode == 2 && (AppGame.ins.roleModel.useId == this._roomInfo.roomUserId)) {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: EMsgType.EOKAndCancel, data: caller.errorMsg, handler: UHandler.create((a) => {
                    if (a) {
                        this.emit(MZJH_hy.ZJH_ROOM_CHARGE_ROOM_CARD);
                    }
                }, this)
            });
        }
        else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    private receive_message(caller: FZJH.NN_CMD_S_MessageResult): void {
        this.emit(MZJH_hy.RECEIVE_MESSAGE, caller);
        for (const key in this._battleplayer) {
            if (this._battleplayer[key].userId == caller.sendUserId) {
                caller.headImgUrl = this._battleplayer[key].headImgUrl;
                caller.nickName = this._battleplayer[key].nickName;
                // caller.headerId = this._battleplayer[key].chairId;
            }
        }
        AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_CHAT_MESSAGE, caller);
    }

    private settle_early(caller: FZJH.NN_CMD_S_ConcludeResult): void {
        if (caller.retCode == 0) {
            if (this._state == EZJHState.Gameing) {
                AppGame.ins.showTips(ULanHelper.GAME_HY.CHECK_OUT_TIP);
            }
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    /** 房主收到其他玩家补充积分的消息 */
    private supplement_points(caller: FZJH.NN_CMD_S2H_Recharge): void {
        if (AppGame.ins.roleModel.useId == this._roomInfo.roomUserId) {

            let data = "是否同意玩家" + caller.rechargeUserId + "补充" + caller.rechargeScore / 100 + "积分";
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 2, data, handler: UHandler.create((a) => {
                    if (a) {
                        this.masterAudit(true, caller.rechargeScore, caller.rechargeUserId);
                    } else {
                        this.masterAudit(false, caller.rechargeScore, caller.rechargeUserId);
                    }
                }, this)
            });
        }
    }

    /** 玩家补充积分收到房主的审核消息 */
    private audit_msg(caller: FZJH.NN_CMD_H2C_RechargeResult): void {
        if (this._roomInfo.bAddScoreLimit) {
            if (caller.retCode == 0) {
                this.requestUserScore();
                if (this._roomInfo.roomUserId !== AppGame.ins.roleModel.useId) {
                    AppGame.ins.showTips("房主已同意，带入积分成功");
                } else {
                    AppGame.ins.showTips("补充积分成功");
                    AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].score += caller.rechargeScore;
                }
                this.emit(MZJH_hy.CLICK_READY);
                this._sengMsg = false;
            } else {
                AppGame.ins.showTips("房主已拒绝，带入积分失败");
                this._sengMsg = false;
            }
        } else {
            if (caller.retCode == 0) {
                this.emit(MZJH_hy.CLICK_READY);
                AppGame.ins.showTips("补充积分成功");
                AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].score += caller.rechargeScore;
                this.requestUserScore();
            } else {
                AppGame.ins.showTips(caller.errorMsg);
            }
        }
}

    /** 玩家状态切换 */
    private user_status(caller: FZJH.NN_CMD_S_EndChangeUserStatus): void {
        this.emit(MZJH_hy.STAUTS_CHANGE, caller.status);
    }

    private chat_limit(caller: FZJH.NN_CMD_S_ChatLimitMessageResult): void {
        if (caller.retCode == 0) {
            this.emit(MZJH_hy.CHAT_LIMIT, caller.bLimit);
            this.roomInfo.bChatLimit = caller.bLimit;
        } else {
            AppGame.ins.showTips(caller.errorMsg)
        }
    }

    private start_limit(caller: FZJH.NN_CMD_S_PlayerNumLimitMessageResult): void {
        if (caller.retCode == 0) {
            this.roomInfo.playerNumLimit = caller.playerNumLimit;
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    /**更新游戏信息 */
    private update_game_total(totalchip: number): void {
        this._totalChip = totalchip;
        this.emit(MZJH_hy.SC_TS_UPDATA_TOTAL_SCORE, this._totalChip);
    }
    /**更新论述 */
    private update_game_turn(turn: number): void {
        this._totalTurn = turn;
        this.emit(MZJH_hy.SC_TS_UPDATA_TOTAL_TURN, this._totalTurn);
    }
    /**结束一个玩家的伦 */
    private over_player_turn(userId: number): void {

        let pl = this._battleplayer[userId];
        if (!pl) {
            UDebug.Log("没有对应的玩家->" + userId);
            return;
        }
        pl.isturn = false;
        let data = new UIZJHOverTurn();
        data.seatId = pl.seatId;
        data.auto = pl.auto;
        this.emit(MZJH_hy.SC_TS_SET_TURN_OVER, data);
    }
    /**设置下一个人的伦 */
    private step_next_player(userId: number, timeleft: number, nextXiaZhu: number, turn: number): void {

        let nextPl = this._battleplayer[userId];
        if (!nextPl) {
            UDebug.Log("没有对应的玩家->" + userId);
            return;
        }
        nextPl.playTurn = turn;
        nextPl.cdtime = timeleft;
        nextPl.nextXizhuCount = nextXiaZhu;
        nextPl.isturn = true;

        let nextTurn = new UIZJHNextTurn();
        nextTurn.auto = nextPl.auto;
        nextTurn.cdtime = timeleft;
        nextTurn.seatId = nextPl.seatId;
        this.emit(MZJH_hy.SC_TS_SET_NEXT_TURN, nextTurn);
        if (nextPl.userId == this.selfUserId) {
            this.refreshchip(nextPl.nextXizhuCount, nextPl.paiState == EBattlePlayerPaiState.kanPai, nextPl.score, nextPl.auto);
        }
    }
    /**更新玩家分数 */
    private update_player_scoreinfo(userId: number, score: number, usetotal: number): void {
        let pl = this._battleplayer[userId];
        if (!pl) {
            UDebug.Log("没有对应的玩家->" + userId);
            return;
        }
        pl.score = score;
        pl.userTotal = usetotal;

        let data = new UIZJHUpdateSeatRoleInfo();
        data.score = score;
        data.usetotal = usetotal;
        data.seatId = pl.seatId;
        if (userId == this.selfUserId) {
            AppGame.ins.roleModel.saveGold(pl.score);
        }
        this.emit(MZJH_hy.SC_TS_UPDATA_TOTAL_PLAYER_SCORE, data);
    }
    /**刷chipitem */
    private brash_chip(userId: number, state: number, chipvalue: any, isCompre: boolean): void {
        let pl = this._battleplayer[userId];
        if (!pl) {
            UDebug.Log("没有对应的玩家->" + userId);
            return;
        }
        // let value = chipvalue;
        // let count = 1;
        // if (isCompre) {
        //     count = count * 2;
        //     value = value / 2
        // }
        // if (pl.paiState == EBattlePlayerPaiState.kanPai) {
        //     count = count * 2;
        //     value = value / 2;
        // }
        let chips = new UIZJHChip();
        chips.items = [];
        chips.chipState = state;
        for (let index = 0; index < chipvalue.length; index++) {
            for (let i = 0; i < chipvalue[index].count; i++) {
                let chip = this.getchipitems(pl.seatId, chipvalue[index].chip / ZJH_SCALE);
                chips.items.push(chip);
            }
        }
        this.emit(MZJH_hy.SC_CZ_PUT_OUT_CHIP, chips);
    }
    /**翻牌 */
    public update_fanpai(useId: number, pai: Array<number>, paixing: number, pos: number, withAnimation: boolean = true): void {
        if (paixing == 0) return;
        let pl = this._battleplayer[useId];
        if (!pl) {
            UDebug.Log("没有对应的玩家->" + useId);
            return;
        }
        pl.pai = pai;
        pl.paiXing = paixing;
        let fanpan = new UIZJHFanPai();
        fanpan.seatId = pl.seatId;
        fanpan.playPos = pos;
        fanpan.withAnimation = withAnimation;
        fanpan.poker = new UIZJHPoker();
        fanpan.poker.pokerType = cfg_paixing[paixing];
        fanpan.poker.pokerIcons = [];
        pai.forEach(element => {
            fanpan.poker.pokerIcons.push(UPokerHelper.getCardSpriteName(element));
        });
        this.emit(MZJH_hy.SC_TS_FAN_PAI, fanpan);

    }
    /**比牌输 */
    private update_bipaishu(useId: number): void {
        let pl = this._battleplayer[useId];
        if (!pl) {
            UDebug.Log("没有对应的玩家->" + useId);
            return;
        }
        pl.paiState = EBattlePlayerPaiState.biPaiShu;
        if (pl.userId == this.selfUserId) {
            this._state = EZJHState.Watching;
        }
        this.emit(MZJH_hy.SC_TS_BIPAI_SHU, pl.seatId);
    }
    /** 看牌*/
    private update_kanpai(useId: number) {
        let pl = this._battleplayer[useId];
        if (!pl) {
            UDebug.Log("没有对应的玩家->" + useId);
            return;
        }
        pl.paiState = EBattlePlayerPaiState.kanPai;
        this.emit(MZJH_hy.SC_TS_LOOK_PAI, pl.seatId);
    }
    private brash_canmatch(useId: number): void {
        if (useId == this.selfUserId) {
            this.emit(MZJH_hy.SC_TS_SHOW_MATCH);
        }
    }
    /**弃牌 */
    private s_give_up(caller: FZJH.CMD_S_GiveUp): void {
        this.emit(MZJH_hy.SC_TS_PLAYER_GIVE_UP, caller);
        let pl = this._battleplayer[caller.wGiveUpUser];
        if (!pl) {
            UDebug.Log("没有对应的玩家->" + caller.wGiveUpUser);
            return;
        }
        let self = pl.userId == this.selfUserId;
        if (self && pl.paiState !== EBattlePlayerPaiState.kanPai) {
            // if (state == EBattlePlayerPaiState.mengPai)
            this.update_fanpai(caller.wGiveUpUser, caller.cbCardData, caller.cbCardType, 1);
            this._state = EZJHState.Watching;
            this.emit(MZJH_hy.SELF_GIVEUP, caller);
        }
        let state = pl.paiState;
        pl.paiState = EBattlePlayerPaiState.qiPai;

        if (caller.bIsCurrentUser) {
            this.over_player_turn(caller.wGiveUpUser);
            if (!caller.bEndGame) {
                this.update_game_turn(caller.nextStep.wTurns)
                this.step_next_player(caller.nextStep.wNextUser, caller.nextStep.wTimeLeft, caller.nextStep.wNeedJettonScore, caller.nextStep.wTurns);
                // /**弃牌的是自己 那么可以匹配 */
                // setTimeout(() => {
                //     EventManager.getInstance().raiseEvent(cfg_event.OPEN_CONTINUE);
                // }, 4000); 
            }
        }
        // if (caller.bEndGame && !this._nextExit && !this._long_timg){
        //     setTimeout(() => {

        //         AppGame.ins.zjhModel.requestMatch();
        //     }, 6000); 
        // }
        // this.brash_canmatch(caller.wGiveUpUser);
    }
    /**比牌 */
    public s_compare_card(caller: FZJH.CMD_S_CompareCard): void {
        this._compare_card = caller;
        let left_pl = this._battleplayer[caller.wCompareUser];
        let right_pl = this._battleplayer[caller.wPassiveUser];
        if (!left_pl) {
            UDebug.Log("没有对应的玩家->" + caller.wCompareUser);
            return;
        }
        if (!right_pl) {
            UDebug.Log("没有对应的玩家->" + caller.wPassiveUser);
            return;
        }
        let win_pl = caller.bIsWin ? left_pl : right_pl;
        let los_pl = caller.bIsWin ? right_pl : left_pl;
        this.update_player_scoreinfo(left_pl.userId, caller.wUserScore, caller.wAllJetton);
        this.brash_chip(left_pl.userId, 0, caller.chips, true);
        this.update_game_total(caller.nextStep.dTotalJetton);

        let cpr = new UIZJHCompare();
        cpr.leftGold = left_pl.score;
        cpr.leftName = left_pl.nickName;
        cpr.leftSeatId = left_pl.seatId;
        cpr.leftHeadId = left_pl.headId;
        cpr.leftHeadUrl = left_pl.headImgUrl;
        cpr.leftPai = this.get_paiString(left_pl.userId);
        cpr.leftvipLv = left_pl.vipLevel;
        cpr.leftheadBoxId = left_pl.headboxId;

        cpr.rightGold = right_pl.score;
        cpr.rightName = right_pl.nickName;
        cpr.rightSeatId = right_pl.seatId;
        cpr.rightHeadId = right_pl.headId;
        cpr.rightHeadUrl = right_pl.headImgUrl;
        cpr.rightvipLv = right_pl.vipLevel;
        cpr.rightheadBoxId = right_pl.headboxId;
        cpr.rightPai = this.get_paiString(right_pl.userId);
        cpr.winseat = win_pl.seatId;
        this.emit(MZJH_hy.SC_TS_PLAYER_COMPARE, cpr);
        // if (los_pl.userId == this.selfUserId && los_pl.paiState == EBattlePlayerPaiState.mengPai && !caller.bIsGameOver) {

        //     this.update_fanpai(los_pl.userId, caller.cbCardData, caller.cbCardType, 2);
        // }
        if (los_pl.userId == this.selfUserId) {
            // this.emit(MZJH.BIPAISHU_SELF,caller);
            if (this._battleplayer[this.selfUserId].paiState == EBattlePlayerPaiState.mengPai) {
                this.update_fanpai(this.selfUserId, caller.cbCardData, caller.cbCardType, 1);
                this._battleplayer[this.selfUserId].paiState = EBattlePlayerPaiState.biPaiShu;
            }
        }
        this.update_bipaishu(los_pl.userId);
        if (!caller.bIsGameOver) {
            this.over_player_turn(caller.wCompareUser);
            this.step_next_player(caller.nextStep.wNextUser, caller.nextStep.wTimeLeft, caller.nextStep.wNeedJettonScore, caller.nextStep.wTurns);
            this.update_game_turn(caller.nextStep.wTurns);
        } else {
            // if(!this._nextExit){
            //     setTimeout(()=>{
            //         EventManager.getInstance().raiseEvent(cfg_event.START_MATFCH);
            //     }, 6000);
            // }
        }
        this.brash_canmatch(los_pl.userId);
    }
    private get_paiString(useid: number): Array<string> {
        if (useid != this.selfUserId) return ["poker_b1", "poker_b1", "poker_b1"];
        let pl = this._battleplayer[useid];
        if (!pl) {
            UDebug.Log("没有对应的玩家->" + useid);
            return;
        }
        // if (pl.paiState != EBattlePlayerPaiState.kanPai) 
        return ["poker_b1", "poker_b1", "poker_b1"];
        let ar = [];
        pl.pai.forEach(element => {
            ar.push(UPokerHelper.getCardSpriteName(element));
        });
        return ar;
    }
    /**看牌 */
    private s_look_card(caller: FZJH.CMD_S_LookCard): void {

        let pl = this._battleplayer[caller.wLookCardUser];
        if (!pl) {
            UDebug.Log("没有对应的玩家->" + caller.wLookCardUser);
            return;
        }
        if (caller.cbTimeLeft > 0) {
            let data = new UIZJHUpdateTurnTime();
            data.leftTime = caller.cbTimeLeft;
            data.seatId = pl.seatId;
            this.emit(MZJH_hy.SC_TS_UPDATA_TURN_TIME, data);
        }

        if (pl.userId == this.selfUserId) {
            this.refreshchip(pl.nextXizhuCount, true, pl.score, pl.auto);
            // this.update_fanpai(caller.wLookCardUser, caller.cbCardData, caller.cbCardType, 0);
            this.emit(MZJH_hy.SC_TS_FANPAI, caller);
        }
        this.update_kanpai(caller.wLookCardUser);
    }
    private s_all_in(caller: FZJH.CMD_S_AllIn): void {
        let pl = this._battleplayer[caller.wAllinUser];
        if (!pl) {
            UDebug.Log("没有对应的玩家->" + caller.wAllinUser);
            return;
        }
        this.update_player_scoreinfo(pl.userId, 0, pl.userTotal + caller.dAllinScore);
        if (caller.nextStep) {
            this.update_game_total(caller.nextStep.dTotalJetton);
        }

        let chips = new UIZJHChip();
        chips.items = [];
        chips.chipState = 3;
        let chip = this.getchipitems(pl.seatId, this._roomInfo.jettons[0]);
        chip.gold = caller.dAllinScore;
        chips.items.push(chip);
        this.emit(MZJH_hy.SC_CZ_PUT_OUT_CHIP, chips);
        this.emit(MZJH_hy.SC_TS_GUZHUYIZHI, pl.seatId);
        if (!caller.bWin) {
            if (caller.wAllinUser == this.selfUserId && pl.paiState == EBattlePlayerPaiState.mengPai) {
                this.update_fanpai(caller.wAllinUser, caller.cbCardData, caller.cbCardType, 3);
            }
            this.update_bipaishu(caller.wAllinUser);
        }
        this.over_player_turn(caller.wAllinUser);
        if (!caller.bGameOver) {
            this.update_game_turn(caller.nextStep.wTurns);
            this.step_next_player(caller.nextStep.wNextUser, caller.nextStep.wTimeLeft, caller.nextStep.wNeedJettonScore, caller.nextStep.wTurns);
        } else {
            // if(!this._nextExit){
            //     setTimeout(() => {
            //         AppGame.ins.zjhModel.requestMatch();
            //     }, 6000);
            // }
        }
        /**输的是自己 那么显示匹配按钮 */
        // if (!caller.bWin) this.brash_canmatch(caller.wAllinUser);
        if (!caller.bWin) EventManager.getInstance().raiseEvent(cfg_event.START_MATFCH);
    }
    /**
     * 刷新筹码
     * @param chipType 算筹码类型 /2
     * @param chipValue 筹码的个数
     */
    private refreshchip(chipType: number, isseepai: boolean, score: number, auto: boolean): void {
        let chip = chipType / 2;
        let pl = this._battleplayer[this.selfUserId];
        if (!pl) {
            UDebug.Log("没有对应的玩家->" + this.selfUserId);
            return;
        }
        let data = new UIZJHOperate();
        data.genzhu = isseepai ? chip * 2 : chip;
        data.items = new Array<UIZJHChips>();
        data.isguzhu = data.genzhu >= score;
        data.isauto = auto;
        data.showBipaiValue = pl.playTurn > ZJH_TURN_COUNT_TO_COMPARE;
        data.canBipai = pl.playTurn > ZJH_TURN_COUNT_TO_COMPARE && pl.score > (data.genzhu * 2);
        let canjiazhu = false;
        let len = this._roomInfo.jettons.length;
        for (let i = 0; i < len; i++) {
            const element = this._roomInfo.jettons[i];
            let item = new UIZJHChips();
            item.count = isseepai ? element * 2 : element;
            item.canUse = element > chip && item.count < pl.score;
            data.items.push(item);
            if (item.canUse) canjiazhu = true;
        }
        data.canJiaZhu = canjiazhu;
        this.emit(MZJH_hy.SC_TS_REFRESH_CHIP, data);
    }


    /**ip限制 */
    private onIpLimit(data: any) {
        data.type = 1;
        if (data.retCode != 0) {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
        this.roomInfo.bIPLimit = data.bLimit;
        AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_SETTING_PANEL, data);
    }

    /**控制带入 */
    private onBringInLimit(data: any) {
        data.type = 2;
        if (data.retCode != 0) {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
        this.roomInfo.bAddScoreLimit = data.bLimit;
        AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_SETTING_PANEL, data);
    }

    /**自动开局 */
    private onAutoPlay(data: any) {
        data.type = 3;
        if (data.retCode != 0) {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
        this.roomInfo.autoStart = data.bAutoStart;
        AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_SETTING_PANEL, data);
    }

    /**15分钟超时消息 */
    private onTimeOut(caller: FZJH.NN_CMD_S_IdleTimeoutResult): void {
        UDebug.Log("超时消息：" + caller);
        if (caller.retCode == 0) {
            this.emit(MZJH_hy.TIME_OUT, caller);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    /**更新玩家积分 */
    private onUpdateSocre(caller: FZJH.NN_CMD_S_GetUserScoreMessageResponse): void {
        UDebug.log("更新玩家积分" + caller);
        if (caller.retCode == 0) {
            this.update_player_scoreinfo(caller.userId, caller.score, 0);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    /**收到预解散房间的消息，弹出实时战绩的弹窗 */
    private onShowRecord(caller: FZJH.NN_CMD_S_PreDissmisResult): void {
        
        if (caller.retCode == 0) {
            this.isPreDismiss = true;
            this.emit(MZJH_hy.SHOW_AGAIN);
            if (this._state == EZJHState.Wait) {
                AppGame.ins.scheduleOnce(function(){
                    if(this._roomInfo==null)return;
                    AppGame.ins.showUI(ECommonUI.UI_REAL_TIME_RECORD);
                    this._end_time = true;
                    if (AppGame.ins.roleModel.useId !== this._roomInfo.roomUserId) {
                        AppGame.ins.showTips(ULanHelper.GAME_HY.THE_IS_CONSIDERING_WHETHER_TO_COME_AGAIN_PLEASE_WAIT);
                    }
                    this.emit(MZJH_hy.SHOW_BASEINFO);
                },7)
            } else {
                AppGame.ins.showUI(ECommonUI.UI_REAL_TIME_RECORD);
                this._end_time = true;
                if (AppGame.ins.roleModel.useId !== this._roomInfo.roomUserId) {
                    AppGame.ins.showTips(ULanHelper.GAME_HY.THE_IS_CONSIDERING_WHETHER_TO_COME_AGAIN_PLEASE_WAIT);
                }
                this.emit(MZJH_hy.SHOW_BASEINFO);
            }
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    /**收到解散房间的消息，弹出离开房间的弹窗 */
    private onOwerLeft(caller: FZJH.NN_CMD_S_DissmisResult): void {
        if (caller.retCode == 0) {
            // this._end_time = true;
            // this._battleplayer = {};
            if (AppGame.ins.roleModel.useId !== this._roomInfo.roomUserId) {
                let msg = caller.retMsg;
                AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                    type: 1, data: msg, handler: UHandler.create(() => {
                        AppGame.ins.loadLevel(ELevelType.Hall);
                    }, this)
                });
            } else {
                let msg = caller.retMsg;
                AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                    type: 1, data: msg, handler: UHandler.create(() => {
                        AppGame.ins.loadLevel(ELevelType.Hall);
                    }, this)
                });
            }

        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    /**再来一轮 */
    private onPlayAgain(data: any) {
        if (data.retCode == 0) {
            if (data.userId == this.roomInfo.roomUserId && data.roomInfo) {
                this._end_time = false;
                this._roomInfo = data.roomInfo;
                // this.emit(..QZNN_UPDATE_NEW_ROUND, data);
            }
            if (data.userId == AppGame.ins.roleModel.useId) {
                this._end_time = false;
                this.isPreDismiss = false;
                // this.emit(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_PLAY_AGAIN, data);
                // AppGame.ins.closeUI(ECommonUI.Game_record_kpqznn_hy);
            }
            this._battleplayer[data.userId].score = data.score;
            this.emit(MZJH_hy.OWNER_CLICK_AGAIN, data);
            // this.updateBattlePlayer();
        } else {
            data.errorMsg && AppGame.ins.showTips(data.errorMsg);
        }
    }

    /**
     * 点击设置界面按钮请求
     * @param type 1、点击ip限制 2、点击控制带入 3、点击自动开局
     */
    sendSettingToggleRequest(type: number, isOpen: boolean) {
        switch (type) {
            case 1:
                AppGame.ins.fzjhModel.sendMsg(FZJH.SUBID.NN_SUB_C_SET_IP_LIMIT, { bLimit: isOpen });
                break;
            case 2:
                AppGame.ins.fzjhModel.sendMsg(FZJH.SUBID.NN_SUB_C_SET_SCORE_LIMIT, { bLimit: isOpen });
                break;
            case 3:
                AppGame.ins.fzjhModel.sendMsg(FZJH.SUBID.NN_SUB_C_SET_PLAYER_NUM_LIMIT, { playerNumLimit: isOpen });
                break;
            case 4:
                AppGame.ins.fzjhModel.sendMsg(FZJH.SUBID.NN_SUB_C_SET_CHAT_LIMIT, { bLimit: isOpen });
                break;
            case 5:
                AppGame.ins.fzjhModel.sendMsg(FZJH.SUBID.NN_SUB_C_SET_AUTO_START, { bAutoStart: isOpen });
                break;
            default:
                break;
        }
    }

    //#endregion
    /**保存房间数据 不能修改 */
    saveRoomInfo(data: any): void {
        this._roomInfo = data;

    }
    /**
     * 取消匹配
     */
    cancleMatch(): void {
        AppGame.ins.gamebaseModel.requestLeftHy(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.CancleMatch);
    }
    resetGameState(): void {
        this._state = EZJHState.Match;
    }
    /**
     * 退出游戏
     */
    exitGame(): void {
        switch (this._state) {

            case EZJHState.Gameing:
                {
                    if (this._battleplayer[AppGame.ins.roleModel.useId].userStatus == 5) {
                        if (this._user_count >= 1) {
                            AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
                        } else {
                            if (this._roomInfo) {
                                this._retrunLobby = true;
                                AppGame.ins.gamebaseModel.requestLeftHy(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                            } else {
                                AppGame.ins.loadLevel(ELevelType.Hall);
                            }
                        }
                    } else {
                        if (this._roomInfo) {
                            this._retrunLobby = true;
                            AppGame.ins.gamebaseModel.requestLeftHy(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                        } else {
                            AppGame.ins.loadLevel(ELevelType.Hall);
                        }
                    }

                }
                break;

            case EZJHState.LeftGame:
                {

                }
                break;

            case EZJHState.Match:
                {
                    if (this._roomInfo) {
                        this._retrunLobby = true;
                        AppGame.ins.gamebaseModel.requestLeftHy(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                    } else {
                        AppGame.ins.loadLevel(ELevelType.Hall)
                    }

                }
                break;

            case EZJHState.Watching:
                {
                    if (this._roomInfo) {
                        this._retrunLobby = true;
                        AppGame.ins.gamebaseModel.requestLeftHy(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                    } else {
                        AppGame.ins.loadLevel(ELevelType.Hall)
                    }
                }
                break;

            case EZJHState.Wait:
                {
                    if (this._roomInfo) {
                        this._retrunLobby = true;
                        AppGame.ins.gamebaseModel.requestLeftHy(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                    } else {
                        AppGame.ins.loadLevel(ELevelType.Hall)
                    }
                }
                break;
            // break;
        }
    }

    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(EGameType.ZJH_HY,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            subId, data, handler, unlock);
    }

    requestFangChaoshi(value: boolean): void {
        let pl = this._battleplayer[this.selfUserId];
        if (pl.fangchaoshi == value) return;
        let data = FZJH.CMD_C_GIVEUP_TIMEOUT_OP.create();
        data.bGiveUp = value;
        UMsgCenter.ins.sendPkg(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND, FZJH.SUBID.SUB_C_GIVEUP_TIMEOUT_OP, data);
    }
    /**
     * 请求比牌
     * @param seatId 玩家的显示位置id 
     */
    requestComparePoker(seatId: number): void {
        let pl = this.getbattleplayerbyChairId(this.getRealSeatId(seatId));
        let data = FZJH.CMD_C_CompareCard.create();
        data.wCompareUser = pl.userId;
        UMsgCenter.ins.sendPkg(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND, FZJH.SUBID.SUB_C_COMPARE_CARD, data);
    }
    /**
     * 断线重连上了 游戏结束之后 直接发起匹配
     */
    reconnectRequest(): void {
        this._state = EZJHState.Match;
        // AppGame.ins.roomModel.requestMatch();
    }
    /**匹配 */
    requestMatch(): void {
        if (!this._long_timg) {
            this._user_count = 0;
            if (this._retrunLobby) return;
            if (this._state == EZJHState.LeftGame) {
                return;
            }
            this._state = EZJHState.LeftGame;

            AppGame.ins.gamebaseModel.requestLeftHy(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.LeftGame);
        }

    }
    /**请求自动跟注 */
    requestAutoGenzhu(auto: boolean): void {
        let br = this._battleplayer[this.selfUserId];
        br.auto = auto;
        this.emit(MZJH_hy.CC_UPDATE_AUTO_GENZHU, br.seatId, auto);
    }
    /**
     * 请求孤注一致
     */
    requestGuzhuyizhi(): void {
        let pl = this._battleplayer[this.selfUserId];
        let value = pl.nextXizhuCount;
        if (pl.paiState == EBattlePlayerPaiState.mengPai) {
            value = value * 0.5;
        }
        if (pl.score <= value) {
            let data = new FZJH.CMD_C_NULL();
            UMsgCenter.ins.sendPkg(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND, FZJH.SUBID.SUB_C_ALL_IN, data);
        }
    }
    /**
     * 请求跟注
     */
    requestGenzhu(): void {
        let pl = this._battleplayer[this.selfUserId];
        let count = pl.nextXizhuCount;
        if (pl.paiState == EBattlePlayerPaiState.mengPai)
            count = count / 2;
        this.requestaddScore(count);
    }
    /**
     * 请求加注
     * @param idx 
     */
    requestJiaZhu(idx: number): void {
        let pl = this._battleplayer[this.selfUserId];
        let count = this._roomInfo.jettons[idx];
        if (count <= pl.nextXizhuCount / 2) {
            return;
        }
        if (pl.paiState == EBattlePlayerPaiState.kanPai)
            count = count * 2;
        this.requestaddScore(count);
    }
    /**获取刚进房间时候 显示自己的信息 */
    getshowselfinfo(): ZJHBattlePlayerInfo {

        let bb = new ZJHBattlePlayerInfo();
        bb.seatId = ZJH_SELF_SEAT;
        bb.nickName = AppGame.ins.roleModel.nickName;
        bb.headId = AppGame.ins.roleModel.headId;
        bb.score = AppGame.ins.roleModel.score;
        bb.userId = AppGame.ins.roleModel.useId;
        bb.vipLevel = AppGame.ins.roleModel.vipLevel;
        bb.headboxId = AppGame.ins.roleModel.headboxId;
        bb.headImgUrl = AppGame.ins.roleModel.headImgUrl;
        return bb;
    }
    /**获取刚进房间时候 显示其他玩家的信息 */
    getshowotherinfo(userId: number): ZJHBattlePlayerInfo {

        let bb = new ZJHBattlePlayerInfo();
        bb.seatId = this._battleplayer[userId].seatId;
        bb.nickName = this._battleplayer[userId].userId.toString();
        bb.headId = this._battleplayer[userId].headId;
        bb.score = this._battleplayer[userId].score;
        bb.userId = this._battleplayer[userId].userId;
        bb.vipLevel = this._battleplayer[userId].vipLevel;
        bb.headboxId = this._battleplayer[userId].headboxId;
        return bb;
    }
    /**请求下注 */
    private requestaddScore(score: number): void {

        let pl = this._battleplayer[this.selfUserId];
        if (score > pl.score) {
            UDebug.Log("分数不够");
            return;
        }
        /**发送命令*/
        let data = FZJH.CMD_C_AddScore.create();
        data.dScore = score;
        UMsgCenter.ins.sendPkg(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND, FZJH.SUBID.SUB_C_ADD_SCORE, data);
    }
    /**
     * 请求弃牌
     */
    requestQipai(): void {
        let data = FZJH.CMD_C_NULL.create();
        UMsgCenter.ins.sendPkg(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND, FZJH.SUBID.SUB_C_GIVE_UP, data);
    }
    /**
     * 请求看牌
     */
    requestSeepai(): void {
        let data = FZJH.CMD_C_NULL.create();
        UMsgCenter.ins.sendPkg(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND, FZJH.SUBID.SUB_C_LOOK_CARD, data);
    }

    /**
     * 请求准备
     */
    requestReady(): void {
        let data = FZJH.NN_CMD_C_Ready.create();
        UMsgCenter.ins.sendPkg(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND, FZJH.SUBID.NN_SUB_C_READY, data);
    }
    /**
     * 请求旁观
     */
    requestRause(): void {
        let data = FZJH.NN_CMD_C_Lookon.create();
        UMsgCenter.ins.sendPkg(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND, FZJH.SUBID.NN_SUB_C_LOOKON, data);
    }
    /**
     * 再来一轮
     */
    requestAgain(): void {
        let data = FZJH.NN_CMD_C_Again.create();
        UMsgCenter.ins.sendPkg(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND, FZJH.SUBID.NN_SUB_C_AGAIN, data);
    }

    /**
     * 请求下局旁观
     */
    requestNextRause(b: boolean): void {
        var data = {
            bLookon: b,
        }
        this.sendMsg(FZJH.SUBID.NN_SUB_C_NEXT_LOOKON, data);
        // let data = FZJH.NN_CMD_C_NextLookon.create();
        // UMsgCenter.ins.sendPkg(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND, FZJH.SUBID.NN_SUB_C_NEXT_LOOKON, data); 
    }
    /**
     * 请求补充积分
     */
    requestSupplement(b: number): void {
        let data = FZJH.NN_CMD_C_Recharge.create();
        data.rechargeScore = b;
        UMsgCenter.ins.sendPkg(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND, FZJH.SUBID.NN_SUB_C_RECHARGE, data);
        // var data = {
        //     rechargeScore: b,
        // }
        // this.sendMsg(FZJH.SUBID.NN_SUB_C_RECHARGE, data);
    }

    /**
     * 房主是否同意补充积分
     */
    masterAudit(a: boolean, b: number, c: number): void {
        let data = FZJH.NN_CMD_H2C_RechargeResult.create();
        data.masteragree = a;
        data.rechargeScore = b;
        data.rechargeUserId = c;
        UMsgCenter.ins.sendPkg(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND, FZJH.SUBID.NN_SUB_H2C_RECHARGE_RESULT, data);
        // var data = {
        //     rechargeScore: b,
        // }
        // this.sendMsg(FZJH.SUBID.NN_SUB_C_RECHARGE, data);
    }

    /**
     * 发送聊天内容
     * @param sendchairid 发送消息的座位号
     * @param recvchairid 接收消息的座位号
     * @param msgtype 消息类型
     * @param msgbody 消息内容 文本
     */
    onSendChartMessage(faceId: number, msgbody: string, type: number = 3) {
        // var data = new FPdk.CMD_C_ChartMessage();
        var data = {
            message: msgbody,
            faceId: faceId,
            type: type,
        }
        AppGame.ins.fzjhModel.sendMsg(FZJH.SUBID.NN_SUB_C_MESSAGE, data);
    }

    /**
     * 请求提前结算
     */
    requestSettleEarly(): void {
        let data = FZJH.NN_CMD_C_Conclude.create();
        UMsgCenter.ins.sendPkg(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND, FZJH.SUBID.NN_SUB_C_CONCLUDE, data);
    }

    /**
     * 请求获取玩家当前积分
     */
    requestUserScore(): void {
        let data = FZJH.NN_CMD_C_GetUserScoreMessage.create();
        UMsgCenter.ins.sendPkg(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND, FZJH.SUBID.NN_SUB_C_GET_USER_SCORE, data);
    }

    /**
     * 请求禁止聊天
     */
    requestChatLimit(): void {
        let data = FZJH.NN_CMD_C_ChatLimitMessage.create();
        UMsgCenter.ins.sendPkg(EGameType.ZJH_HY, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND, FZJH.SUBID.NN_SUB_C_SET_CHAT_LIMIT, data);
    }

    /**获取可以比较的seatids */
    getcompareArray(): Array<number> {
        let ar = [];
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                const element = this._battleplayer[key];
                if (element.userId != this.selfUserId && element.paiState != EBattlePlayerPaiState.none && element.paiState != EBattlePlayerPaiState.pangGuan &&
                    element.paiState != EBattlePlayerPaiState.qiPai && element.paiState != EBattlePlayerPaiState.biPaiShu && element.paiState != EBattlePlayerPaiState.ready) {
                    ar.push(element.seatId);
                }
            }
        }
        return ar;
    }
    /**获取chipitem */
    public getchipitems(seatId: number, chipvalue: number): UIZJHChipItem {
        let chip = new UIZJHChipItem();
        chip.chipType = this.getchiptypeBySocre(chipvalue);
        chip.objId = this.getchipId();
        chip.gold = chipvalue;
        chip.seatId = seatId;
        chip.state = chipvalue >= 100000 ? 2 : 0;
        return chip;
    }
    private getchipId(): number {
        return this._chipObjId++;
    }
    /**根据底注获取筹码 样式 */
    private getchiptypeBySocre(socre: number): string {
        let idx = this.allchips.indexOf(socre/100);
        if (idx < 0) {
            return cfg_chip[0];
        }
        return cfg_chip[idx];
    }
    /**根据真实玩家位置获取玩家信息 */
    public getbattleplayerbyChairId(chairId: number): ZJHBattlePlayerInfo {
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
    private getRealSeatId(seatId): number {
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
}
