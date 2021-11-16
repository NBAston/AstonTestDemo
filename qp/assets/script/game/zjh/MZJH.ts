import Model from "../../common/base/Model";
import AppGame from "../../public/base/AppGame";
import { ECommonUI, ELevelType, EGameHot, EGameType, EGameState, ELeftType, EIconType } from "../../common/base/UAllenum";
import ULanHelper from "../../common/utility/ULanHelper";
import UHandler from "../../common/utility/UHandler";
import { ZJHBattlePlayerInfo, EZJHState, UIZJHChip, EBattlePlayerPaiState, UIZJHChipItem, UIZJHNextTurn, UIZJHChips, UIZJHCompare, UIZJHUpdateSeatRoleInfo, UIZJHOverTurn, UIZJHUpdateTurnTime, UIZJHFanPai, UIZJHPoker, UIZJHBattleOver, UIZJHStaticsItem, UIZJHSetZHU, UIZJHOperate } from "./UZJHClass";
import { RoomInfo, RoomPlayerInfo } from "../../public/hall/URoomClass";
import cfg_chip from "../../config/cfg_chip";
import UMsgCenter from "../../common/net/UMsgCenter";
import { Game, ZJH, GameServer } from "../../common/cmd/proto";
import VComparePlayer from "./VZJHComparePlayer";
import UDebug from "../../common/utility/UDebug";
import UPokerHelper from "../../common/utility/UPokerHelper";
import cfg_paixing from "../../config/cfg_paixing";
import MBaseGameModel from "../../public/hall/MBaseGameModel";
import MRoomModel from "../../public/hall/room_zjh/MRoomModel";
import { EventManager } from "../../common/utility/EventManager";
import cfg_event from "../../config/cfg_event";
import VZJH from "./VZJH";
import VZJHOperate from "./VZJHOperate";
import UResManager from "../../common/base/UResManager";

export const ZJH_SELF_SEAT = 0;
export const ZJH_TURN_COUNT_TO_COMPARE = 1;
export const ZJH_SCALE = 0.01;
export const UNIT = 100;


/**
 * 创建:sq
 * 扎金花游戏model
 */
export default class MZJH extends Model {

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

    /**看牌*/
    static SC_TS_LOOK_PAI = "SC_TS_LOOK_PAI";

    /**翻牌*/
    static SC_TS_FAN_PAI = "SC_TS_FAN_PAI";

    /**比牌输*/
    static SC_TS_BIPAI_SHU = "SC_TS_BIPAI_SHU";

    /**推送下一个Turn*/
    static SC_TS_SET_NEXT_TURN = "SC_TS_SET_NEXT_TURN";

    /**推送turn结束*/
    static SC_TS_SET_TURN_OVER = "SC_TS_SET_TURN_OVER";

    /**推送玩家比牌*/
    static SC_TS_PLAYER_COMPARE = "SC_TS_PLAYER_COMPARE";

    /**推送玩家孤注一致*/
    static SC_TS_GUZHUYIZHI = "SC_TS_GUZHUYIZHI";

    /**推送玩家匹配*/
    static SC_TS_SHOW_MATCH = "SC_TS_SHOW_MATCH";

    /**玩家操作结果下注*/
    static SC_CZ_PUT_OUT_CHIP = "SC_CZ_PUT_OUT_CHIP";

    /** 玩家弃牌*/
    static SC_TS_PLAYER_GIVE_UP = "SC_TS_PLAYER_GIVE_UP";

    /**刷新自己的筹码*/
    static SC_TS_REFRESH_CHIP = "SC_TS_REFRESH_CHIP";

    /**更新伦的时间*/
    static SC_TS_UPDATA_TURN_TIME = "SC_TS_UPDATA_TURN_TIME";

    /**结束自己的turn*/
    static CC_END_SELF_TURN = "CC_END_SELF_TURN";

    /** 开始跟注*/
    static CC_UPDATE_AUTO_GENZHU = "CC_UPDATE_AUTO_GENZHU";

    /**开始匹配*/
    static CC_START_MATCH = "CC_START_MATCH";

    /**更新座位上玩家信息*/
    static CC_UPDATA_SEAT_INFO = "CC_UPDATA_SEAT_INFO";

    /**玩家取消匹配*/
    static SC_TS_CANCLE_MATCH = "SC_TS_CANCLE_MATCH";

    /**设置先手*/
    static SC_TS_XIAN_SHOU = "SC_TS_XIAN_SHOU";

    /**更新牌局编号*/
    static SC_TS_UPDATA_GAME_NUMBER = "SC_TS_UPDATA_GAME_NUMBER";

    /**防超时*/
    static SC_TS_FANGCHAOSHI = "SC_TS_FANGCHAOSHI";

    /**玩家状态改变*/
    static USSTAUTS_CHANGE = "USSTAUTS_CHANGE";

    /**玩家自己翻牌*/
    static SC_TS_FANPAI = "SC_TS_FANPAI";

    /**断线重连设置灯光角度*/
    static SET_LIGHT = "SET_LIGHT";

    /**防超时*/
    static SC_TS_START_MATCH = "SC_TS_START_MATCH";

    /**玩家离开*/
    static SC_TS_LEFT = "SC_TS_LEFT";

    /**展示继续按钮*/
    static SHOW_GOON_BTN = "SHOW_GOON_BTN";

    /**展示牌*/
    static SHOW_PAI = "SHOW_PAI";

    /**展示“我在这”的动画*/
    static SHOW_ANI = "SHOW_ANI";

    static isBool: boolean = false;

    /**游戏结束*/
    static GAME_END: "GAME_END";

    /**游戏开始*/
    static GAME_START = "GAME_START";

    static BIPAISHU_SELF = "BIPAISHU_SELF";

    /**焖牌*/
    static MEN_PAI = "MEN_PAI";

    /**俱乐部游戏结束后切后台再切回来显示等待中*/
    static SHOW_WAIT = "SHOW_WAIT";

    static SHOW_RESULT = "SHOW_RESULT";

    static SHOW_EXIT_NEXT = 'SHOW_EXIT_NEXT';

    static RESET_CHIP = "RESET_CHIP";

    static BRASH_CHIP = "BRASH_CHIP";

    static GET_CMD = "GET_CMD";

    static SELF_BIPAISHU = "SELF_BIPAISHU";

    static SELF_QIPAI = "SELF_QIPAI";

    /**chip的id */
    private _chipObjId: number = 1;

    //#endregion
    /**
     * 游戏状态
     */
    public _state: EZJHState = EZJHState.Wait;

    /**本局的玩家 */
    public _battleplayer: { [key: number]: ZJHBattlePlayerInfo };

    private _selfUISeatId: number = ZJH_SELF_SEAT;

    /**本局下的总注 */
    private _totalChip: number;

    /**一局总过的轮数 */
    private _totalTurn: number = 16;

    /**当前的论数 */
    private _currentTurn: number;

    /**当前底注 */
    private _currentDizhu: number;

    /**房间信息*/
    private _roomInfo: RoomInfo;

    /**返回大厅*/
    private _retrunLobby: boolean;

    /**房间信息*/
    private _nextExit: boolean;

    public on_back: boolean = false;

    public _wLookCardMinTurnsRound: number;


    public set nextExit(v: boolean) {
        this._nextExit = v;
    }


    private _user_count: number;


    private _long_timg: boolean;


    public set long_timg(v: boolean) {
        this._long_timg = v;
    }

    public _isExit: boolean = false;


    public _isEnd: boolean = false;

    public _end_caller: any = null;

    public _compare_card: any = null;

    public _disconnect = false;

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
        super.exit();
        this.resetData();
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.sc_ts_player_left_room, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ENTER_GAME, this.sc_ts_enter_game, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.sc_ts_player_usstatus_change, this);
        this._roomInfo = null;
        this._battleplayer = {};

    }

    //#region  model 实现
    init(): void {
        this._user_count = 0;
        this._nextExit = false;
        this._long_timg = false;
        this._isExit = false;
        this._isEnd = false;
        this._wLookCardMinTurnsRound = 0;
        this._disconnect = false;
        /**这三个命令 不是流程控制 是正常进入 断线重连  */
        UMsgCenter.ins.regester(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            ZJH.SUBID.SUB_SC_GAMESCENE_FREE, new UHandler(this.sc_gamescene_free, this));
        UMsgCenter.ins.regester(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            ZJH.SUBID.SUB_SC_GAMESCENE_PLAY, new UHandler(this.sc_gamescene_play, this));
        UMsgCenter.ins.regester(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            ZJH.SUBID.SUB_SC_GAMESCENE_END, new UHandler(this.sc_gamescene_end, this));
        UMsgCenter.ins.regester(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            ZJH.SUBID.CS_GAMESCENE_FRESH, new UHandler(this.sc_gamescene_fresh, this));

        UMsgCenter.ins.regester(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            ZJH.SUBID.SUB_S_GAME_START, new UHandler(this.s_game_start, this));
        UMsgCenter.ins.regester(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            ZJH.SUBID.SUB_S_ADD_SCORE, new UHandler(this.s_add_score, this));
        UMsgCenter.ins.regester(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            ZJH.SUBID.SUB_S_GIVE_UP, new UHandler(this.s_give_up, this));
        UMsgCenter.ins.regester(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            ZJH.SUBID.SUB_S_COMPARE_CARD, new UHandler(this.s_compare_card, this));
        UMsgCenter.ins.regester(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            ZJH.SUBID.SUB_S_LOOK_CARD, new UHandler(this.s_look_card, this));
        UMsgCenter.ins.regester(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            ZJH.SUBID.SUB_S_GAME_END, new UHandler(this.s_game_end, this));
        UMsgCenter.ins.regester(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            ZJH.SUBID.SUB_S_ALL_IN, new UHandler(this.s_all_in, this));
        UMsgCenter.ins.regester(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            ZJH.SUBID.SUB_C_ROUND_END_EXIT, new UHandler(this.NextExit, this));
        UMsgCenter.ins.regester(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            ZJH.SUBID.SUB_S_GIVEUP_TIMEOUT_OP, new UHandler(this.giveup_timeout_op, this));
    }

    private sc_ts_enter_game(): void {
        this._battleplayer = {};
        UDebug.log(this._battleplayer);
    }

    private sc_ts_player_usstatus_change(data1, data2): void {
        this.emit(MZJH.USSTAUTS_CHANGE, data1, data2);
    }

    private sc_ts_player_left_room(caller: GameServer.MSG_C2S_UserLeftMessageResponse): void {
        if (caller.retCode == 0) {
            if (caller.type == ELeftType.ReturnToRoom) {
                this._retrunLobby = false;
                if (this._state != EZJHState.AlreadLeft) {
                    this._state = EZJHState.AlreadLeft;
                    AppGame.ins.loadLevel(ELevelType.Hall, this._roomInfo.gameId);
                    this.emit(MZJH.SC_TS_LEFT);
                }
            } else if (caller.type == ELeftType.CancleMatch) {

                this.emit(MZJH.SC_TS_CANCLE_MATCH, true);
                this._state = EZJHState.Wait;
            } else if (caller.type == ELeftType.LeftGame) {

                this._battleplayer = {};
                this._currentDizhu = 0;
                this._totalChip = 0;
                this._totalTurn = 0;
                this._state = EZJHState.Match;

                AppGame.ins.roomModel.requestMatch();
                this.emit(MZJH.SC_TS_START_MATCH, true);
            }
        } else {
            if (caller.type == ELeftType.ReturnToRoom) {
                this._retrunLobby = false;
                AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
                //AppGame.ins.showUI(ECommonUI.MsgBox, { type: 1, data: ULanHelper.ZJH_CAN_EXIT_GAME });
            }
            else if (caller.type == ELeftType.CancleMatch) {
                if (this._state != EZJHState.Gameing)
                    this.emit(MZJH.SC_TS_CANCLE_MATCH, false);
            } else if (caller.type == ELeftType.LeftGame) {

                if (this._state != EZJHState.Gameing)
                    this.emit(MZJH.SC_TS_START_MATCH, false);
                AppGame.ins.roomModel.requestMatch();
            }
        }
    }
    public sc_ts_room_playerinfo(caller: RoomPlayerInfo): void {
        UDebug.log("玩家进入房间：" + caller);
        for (const key in this._battleplayer) {
            if (caller.userId == this._battleplayer[key].userId) {
                return
            }
        }
        this.add_battle_player(caller);
        this.update_seat_info();
        if (caller.userId !== AppGame.ins.roleModel.useId) {
            this._user_count = this._user_count + 1;
        }

    }
    private add_battle_player(element: RoomPlayerInfo): ZJHBattlePlayerInfo {
        UDebug.log("玩家进入：" + JSON.stringify(element))
        if (!this._battleplayer) {
            this._battleplayer = {};
        }
        for (const key in this._battleplayer) {
            if (element.userId == this._battleplayer[key].userId) {
                return
            }
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
        item.paiState = EBattlePlayerPaiState.none;
        item.auto = false;
        item.pai = [];
        item.cdtime = 0;
        item.headImgUrl = element.headImgUrl;
        //item.seatId = this.getUISeatId(item.chairId);
        item.fangchaoshi = true;
        this._battleplayer[item.userId] = item;
        this.update_role_seat();
        UDebug.log("add_battle_player:  this._battleplayer======" + JSON.stringify(this._battleplayer))
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
        let ar = {};
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                const element = this._battleplayer[key];
                ar[element.seatId] = element;
            }

        }

        this.emit(MZJH.CC_UPDATA_SEAT_INFO, ar);
    }

    private update_xin_shou(userId: number): void {
        if (!this._battleplayer[userId]) {
            UDebug.Log("没有对应的玩家->" + userId);
            return;
        }
        this._battleplayer[userId].isFirst = true;
        this.emit(MZJH.SC_TS_XIAN_SHOU, this._battleplayer[userId].seatId);
    }
    private sc_gamescene_free(caller: ZJH.CMD_S_StatusFree): void {
        this.emit(MZJH.GET_CMD);
        this.allchips = caller.allChip;
        this._compare_card = null;
        this._disconnect = true;
        this._end_caller = null;
        this.emit(MZJH.SHOW_PAI, false);
        this.emit(MZJH.SHOW_ANI, false);
        // this.emit(MZJH.SHOW_WAIT);
        this._currentDizhu = caller.dCellScore;
        this._state = EZJHState.Match;
        this._wLookCardMinTurnsRound = caller.wLookCardMinTurnsRound;
        
    }

    private sc_gamescene_play(caller: ZJH.CMD_S_StatusPlay): void {
        this.emit(MZJH.GET_CMD);
        this.allchips = caller.allChip;
        this.emit(MZJH.RESET_CHIP);
        this._compare_card = null;
        this._disconnect = true;
        this._end_caller = null;
        this._wLookCardMinTurnsRound = caller.wLookCardMinTurnsRound;
        this._isEnd = false;
        this.update_role_seat();
        this._state = EZJHState.Gameing;
        this._currentDizhu = caller.dCellScore;
        this.emit(MZJH.SC_TS_UPDATA_GAME_NUMBER, caller.roundId);
        this.update_game_total(caller.dTotalJetton);
        this.update_game_turn(caller.wJettonCount);
        if (caller.user.bRoundEndExit) {
            this.emit(MZJH.SHOW_EXIT_NEXT);
        }
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

        this.emit(MZJH.BRASH_CHIP, caller);
        // let chips = new UIZJHChip();
        // chips.items = [];
        // chips.chipState = 0;
        // if(caller.user.userId == this.selfUserId){
        //     this.brash_chip(this.selfUserId,0,caller.chips,false);
        // }
        caller.GamePlayers.forEach(element => {
            let pl = this._battleplayer[element.wUserId];
            if (pl) {
                pl.userTotal = element.dTableJetton;
                pl.nextXizhuCount = caller.dCurrentJetton;
                pl.playTurn = caller.wJettonCount;
                pl.paiXing = element.cbHandCardType;
                pl.pai = element.cbHandCardData;


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
                if (pl.userId == caller.user.userId) {
                    pl.score = pl.score;
                    //  - element.dTableJetton;
                } else {
                    pl.score = pl.score;
                }
                if (this.selfUserId == caller.user.userId) {
                    if (pl.userId !== caller.user.userId && (pl.paiState == EBattlePlayerPaiState.mengPai || pl.paiState == EBattlePlayerPaiState.kanPai)) {
                        pl.score = pl.score
                        // - element.dTableJetton;
                    }
                }
                // if(caller.user.userId == this.selfUserId){
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
        });
        // this.emit(MZJH.SC_CZ_PUT_OUT_CHIP, chips);
        this.emit(MZJH.SET_LIGHT, caller);
        this.update_seat_info();
        /** 分发创建chipitem*/
        if (self.paiState == EBattlePlayerPaiState.kanPai || self.paiState == EBattlePlayerPaiState.qiPai || self.paiState == EBattlePlayerPaiState.biPaiShu) {
            this.update_fanpai(self.userId, self.pai, self.paiXing, 5, false);
        }
        // /**分发nextturn */
        // this.step_next_player(caller.wCurrentUser, caller.wTimeLeft, caller.dCurrentJetton)
        //  if (caller.wCurrentUser == this.selfUserId) {
        /**分发刷新chip*/

        AppGame.ins.roleModel.saveGold(self.score);
        if (self.paiState == EBattlePlayerPaiState.qiPai || self.paiState == EBattlePlayerPaiState.biPaiShu) {
            this.brash_canmatch(self.userId);
            if(self.paiState == EBattlePlayerPaiState.biPaiShu){
                this.emit(MZJH.SELF_BIPAISHU);
            }else{
                this.emit(MZJH.SELF_QIPAI);
            }
        } else {
            this.refreshchip(caller.dCurrentJetton, self.paiState == EBattlePlayerPaiState.kanPai, self.score, self.auto);
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
    private sc_gamescene_end(caller: ZJH.CMD_S_StatusEnd): void {
        this.emit(MZJH.GET_CMD);
        if(AppGame.ins.currRoomKind == 2){
            for (const key in this._battleplayer) {
                this._battleplayer[key].auto = false;
                this._battleplayer[key].userTotal = 0;
                this._battleplayer[key].playTurn = 0;
                this._battleplayer[key].isturn = false;
                this._battleplayer[key].isFirst = false;
                this._battleplayer[key].auto = false;
                this._battleplayer[key].pai = [];
                this._battleplayer[key].cdtime = 0;
                this._battleplayer[key].userTotal = 0;
                this._battleplayer[key].paiXing = 0;
                this._battleplayer[key].nextXizhuCount = 0;
                this._battleplayer[key].paiState = EBattlePlayerPaiState.none;
                this._battleplayer[key].paiXing = 0;
                
            }
        }
        this.allchips = caller.allChip;
        this._state = EZJHState.Wait;
        this._end_caller = caller;
        this._disconnect = true;
        this._isEnd = true;
        this._wLookCardMinTurnsRound = caller.wLookCardMinTurnsRound;


        this.emit(MZJH.SHOW_RESULT, caller);
    }

    private sc_gamescene_fresh(): void {

    }


    sendFreshGameScene() {
        this.sendMsg(ZJH.SUBID.CS_GAMESCENE_FRESH, {});
    }

    private giveup_timeout_op(caller: ZJH.CMD_S_GIVEUP_TIMEOUT_OP): void {
        let pl = this._battleplayer[this.selfUserId];
        pl.fangchaoshi = caller.bGiveUp;
        this.emit(MZJH.SC_TS_FANGCHAOSHI, pl.fangchaoshi);
    }
    private s_game_start(caller: ZJH.CMD_S_GameStart): void {
        this._compare_card = null;
        this._end_caller = null;
        this._isEnd = false;
        this._isExit = false;
        this._battleplayer = {};
        MZJH.isBool = false;

        for (let index = 0; index < caller.users.length; index++) {
            const element = caller.users[index];
            let a = new RoomPlayerInfo();
            a.userId = element.userId;
            a.userStatus = 1;
            a.account = element.nickName;
            a.nickName = element.nickName;
            a.headId = element.headerId;
            a.headboxId = element.headboxId;
            a.vipLevel = element.vip;
            a.tableId = element.tableID;
            a.chairId = element.chairID;
            a.location = element.location;
            a.score = element.score;
            a.sex = element.gender;
            a.headImgUrl = element.headImgUrl;
            this.sc_ts_room_playerinfo(a);
            // this._battleplayer[element.userId].isturn = false;
        }
        try {
            this._battleplayer[caller.wCurrentUser].cdtime = caller.wTimeLeft;
            this._battleplayer[caller.wCurrentUser].isturn = true;
            this._battleplayer[caller.wCurrentUser].isFirst = true;
        } catch (error) {
            cc.error("找不到玩家-----" + this._battleplayer[caller.wCurrentUser]);
        }
        this._state = EZJHState.Gameing;



        this.emit(MZJH.SC_TS_UPDATA_TOTAL_TURN, 1);
        this.emit(MZJH.GAME_START);
        this._currentDizhu = caller.dCellScore;
        this._totalChip = caller.dTotalJetton;

        // if(this._battleplayer[caller.wCurrentUser]){

        // }else{

        // }
        let len = caller.cbPlayStatus.length;
        let chips = new UIZJHChip();
        chips.items = [];
        chips.chipState = 0;
        for (let i = 0; i < len; i++) {
            let status = caller.cbPlayStatus[i];
            let score = caller.dUserScore[i];
            let pl = this.getbattleplayerbyChairId(i);
            if (!pl) continue;
            pl.paiState = EBattlePlayerPaiState.mengPai;
            pl.score = score;
            pl.playTurn = 0;
            pl.userTotal = this._currentDizhu;
            pl.nextXizhuCount = caller.dCurrentJetton;
            /**创建chipitem */
            let chip = this.getchipitems(pl.seatId, this._currentDizhu);
            chips.items.push(chip);
        }
        this.update_seat_info();
        this.update_role_seat();
        this.emit(MZJH.SHOW_PAI, true);
        this.emit(MZJH.SHOW_ANI, true);
        this.emit(MZJH.SC_TS_UPDATA_GAME_NUMBER, caller.roundId);
        /**分发游戏数据 */

        this.emit(MZJH.SC_TS_UPDATA_TOTAL_SCORE, caller.dTotalJetton);

        this.emit(MZJH.BRASH_CHIP,caller);
        /** 分发创建chipitem*/
        // this.emit(MZJH.SC_CZ_PUT_OUT_CHIP, chips);

        /**分发 发牌 */
        this.emit(MZJH.SC_TS_FAPAI);



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
                this.update_player_scoreinfo(AppGame.ins.roleModel.useId, element.score - this.currentDizhu, this.currentDizhu);
            }
        }
    }

    public s_game_end(caller: ZJH.CMD_S_GameEnd): void {
        if (this.on_back) {
            return
        }

        // this._battleplayer = {}
        this._isEnd = true;
        this._state = EZJHState.Wait;
        // this.emit(MZJH.GAME_END);
        let data = new UIZJHBattleOver();
        data.statics = [];
        if (this._battleplayer[caller.dWinneruserId]) {
            let pl = this._battleplayer[caller.dWinneruserId];
            data.winseatId = pl.seatId;
        }

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
                    element.cbCardData.forEach(element => {
                        item.uipoker.pokerIcons.push(UPokerHelper.getCardSpriteName(element));
                    });
                }
                data.statics[item.seatId] = item;
            }
        });
        let self = this._battleplayer[this.selfUserId];
        if (self) {
            AppGame.ins.roleModel.saveGold(self.score);
            //游戏结束后自己是焖牌状态则显示自己的牌
            if (self.paiState == EBattlePlayerPaiState.mengPai) {
                // this.update_fanpai(self.userId,self.pai,self.paiXing,5,true);
            }
        }
        this.emit(MZJH.SC_TS_GAME_END, data);

    }
    private s_add_score(caller: ZJH.CMD_S_AddScore): void {
        try {
            let pl = this._battleplayer[caller.wOpUserId];
            let zhu = new UIZJHSetZHU();
            zhu.seatId = pl.seatId;
            zhu.state = caller.cbState;
            this.emit(MZJH.SC_TS_SET_ZHU, zhu);

            /**更新玩家分数 */
            this.update_player_scoreinfo(caller.wOpUserId, caller.wUserScore, caller.wAllJetton);
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
    /**更新游戏信息 */
    private update_game_total(totalchip: number): void {
        this._totalChip = totalchip;
        this.emit(MZJH.SC_TS_UPDATA_TOTAL_SCORE, this._totalChip);
    }
    /**更新论述 */
    private update_game_turn(turn: number): void {
        this._totalTurn = turn;
        this.emit(MZJH.SC_TS_UPDATA_TOTAL_TURN, this._totalTurn);
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
        this.emit(MZJH.SC_TS_SET_TURN_OVER, data);
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

        this.emit(MZJH.SC_TS_SET_NEXT_TURN, nextTurn);
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
        this.emit(MZJH.SC_TS_UPDATA_TOTAL_PLAYER_SCORE, data);
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
                let chip = this.getchipitems(pl.seatId, chipvalue[index].chip);
                chips.items.push(chip);
            }
        }
        this.emit(MZJH.SC_CZ_PUT_OUT_CHIP, chips);
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
        this.emit(MZJH.SC_TS_FAN_PAI, fanpan);

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
            // AppGame.ins.roomModel.requestMatch();
        }
        this.emit(MZJH.SC_TS_BIPAI_SHU, pl.seatId);
    }
    /** 看牌*/
    private update_kanpai(useId: number) {
        let pl = this._battleplayer[useId];
        if (!pl) {
            UDebug.Log("没有对应的玩家->" + useId);
            return;
        }
        pl.paiState = EBattlePlayerPaiState.kanPai;
        this.emit(MZJH.SC_TS_LOOK_PAI, pl.seatId);
    }
    private brash_canmatch(useId: number): void {
        if (useId == this.selfUserId) {
            this.emit(MZJH.SC_TS_SHOW_MATCH);
        }
    }
    /**弃牌 */
    public s_give_up(caller: ZJH.CMD_S_GiveUp): void {

        let pl = this._battleplayer[caller.wGiveUpUser];
        if (!pl) {
            UDebug.Log("没有对应的玩家->" + caller.wGiveUpUser);
            return;
        }
        let self = pl.userId == this.selfUserId;
        if (self && pl.paiState != EBattlePlayerPaiState.kanPai) {
            this.update_fanpai(caller.wGiveUpUser, caller.cbCardData, caller.cbCardType, 1);
            this._state = EZJHState.Watching;
        }
        let state = pl.paiState;
        pl.paiState = EBattlePlayerPaiState.qiPai;
        this.emit(MZJH.SC_TS_PLAYER_GIVE_UP, caller);

        if (caller.bIsCurrentUser) {
            this.over_player_turn(caller.wGiveUpUser);
            if (!caller.bEndGame) {
                this.update_game_turn(caller.nextStep.wTurns)
                this.step_next_player(caller.nextStep.wNextUser, caller.nextStep.wTimeLeft, caller.nextStep.wNeedJettonScore, caller.nextStep.wTurns);
                /**弃牌的是自己 那么可以匹配 */
            }
            // this.emit(MZJH.SHOW_GOON_BTN,true);
        }

        // this.brash_canmatch(caller.wGiveUpUser);
    }
    /**比牌 */
    public s_compare_card(caller: ZJH.CMD_S_CompareCard): void {
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
        if (AppGame.ins.currRoomKind == 2) {
            cpr.leftName = left_pl.nickName;
        } else {
            cpr.leftName = left_pl.userId.toString();

        }

        cpr.leftSeatId = left_pl.seatId;
        cpr.leftHeadId = left_pl.headId;
        cpr.leftHeadUrl = left_pl.headImgUrl;
        cpr.leftPai = this.get_paiString(left_pl.userId);
        cpr.leftvipLv = left_pl.vipLevel;
        cpr.leftheadBoxId = left_pl.headboxId;

        cpr.rightGold = right_pl.score;
        if (AppGame.ins.currRoomKind == 2) {
            cpr.rightName = right_pl.nickName;
        } else {
            cpr.rightName = right_pl.userId.toString();
        }

        cpr.rightSeatId = right_pl.seatId;
        cpr.rightHeadId = right_pl.headId;
        cpr.rightHeadUrl = right_pl.headImgUrl;
        cpr.rightvipLv = right_pl.vipLevel;
        cpr.rightheadBoxId = right_pl.headboxId;
        cpr.rightPai = this.get_paiString(right_pl.userId);
        cpr.winseat = win_pl.seatId;
        this.emit(MZJH.SC_TS_PLAYER_COMPARE, cpr);
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
            // if(!this._nextExit && !this._long_timg){
            //     setTimeout(()=>{
            //         EventManager.getInstance().raiseEvent(cfg_event.START_MATFCH);
            //         AppGame.ins.roomModel.requestMatch();
            //     }, 6000);
            // }
        }

        // this.brash_canmatch(los_pl.userId);
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
    private s_look_card(caller: ZJH.CMD_S_LookCard): void {
        let pl = this._battleplayer[caller.wLookCardUser];
        if (!pl) {
            UDebug.Log("没有对应的玩家->" + caller.wLookCardUser);
            return;
        }
        if (caller.cbTimeLeft > 0) {
            let data = new UIZJHUpdateTurnTime();
            data.leftTime = caller.cbTimeLeft;
            data.seatId = pl.seatId;
            this.emit(MZJH.SC_TS_UPDATA_TURN_TIME, data);
        }

        if (pl.userId == this.selfUserId) {
            this.refreshchip(pl.nextXizhuCount, true, pl.score, pl.auto);
            // this.update_fanpai(caller.wLookCardUser, caller.cbCardData, caller.cbCardType, 0);
            this.emit(MZJH.SC_TS_FANPAI, caller);
        }
        this.update_kanpai(caller.wLookCardUser);
    }
    private s_all_in(caller: ZJH.CMD_S_AllIn): void {
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
        // chips.chipState = 3;
        // let chip = this.getchipitems(pl.seatId, this._roomInfo.jettons[0]);
        // chip.gold = caller.dAllinScore;
        // chips.items.push(chip);
        this.brash_chip(caller.wAllinUser, 0, caller.chips, true);
        this.emit(MZJH.SC_CZ_PUT_OUT_CHIP, chips);
        this.emit(MZJH.SC_TS_GUZHUYIZHI, pl.seatId);
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
            //         AppGame.ins.roomModel.requestMatch();
            //     }, 6000);

            // }

        }
        /**输的是自己 那么显示匹配按钮 */
        // if (!caller.bWin) this.brash_canmatch(caller.wAllinUser);
        // if (!caller.bWin) EventManager.getInstance().raiseEvent(cfg_event.START_MATFCH);
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
        this.emit(MZJH.SC_TS_REFRESH_CHIP, data);
    }

    NextExit(caller: ZJH.CMD_C_RoundEndExit) {

    }
    //#endregion
    /**保存房间数据 不能修改 */
    saveRoomInfo(data: RoomInfo): void {
        this._roomInfo = data;

    }
    /**
     * 取消匹配
     */
    cancleMatch(): void {
        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.CancleMatch);
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
                                AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                            } else {
                                AppGame.ins.loadLevel(ELevelType.Hall);
                            }
                        }
                    } else {
                        this._isExit = true;
                        if (this._roomInfo) {
                            this._retrunLobby = true;
                            AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                        } else {
                            AppGame.ins.loadLevel(ELevelType.Hall);
                        }
                    }
                }
                break

            case EZJHState.LeftGame:
                {
                    AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                    // AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
                    //AppGame.ins.showUI(ECommonUI.MsgBox, { type: 1, data: ULanHelper.ZJH_CAN_EXIT_GAME });
                }
                break;
            case EZJHState.Match:
                {
                    this._isExit = true;
                    if (this._roomInfo) {
                        this._retrunLobby = true;
                        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                    } else {
                        AppGame.ins.loadLevel(ELevelType.Hall, EGameType.ZJH);
                    }

                }
                break;
            case EZJHState.Watching:
                {
                    this._isExit = true;
                    if (this._roomInfo) {
                        this._retrunLobby = true;
                        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                    } else {
                        AppGame.ins.loadLevel(ELevelType.Hall, EGameType.ZJH);
                    }
                }
                break;
            case EZJHState.Wait:
                // {
                //     if (this._roomInfo) {
                //         this._retrunLobby = true;
                //         AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                //     } else {
                //         AppGame.ins.loadLevel(ELevelType.Hall, EGameType.ZJH);
                //     }
                //     // AppGame.ins.showUI(ECommonUI.MsgBox, {
                //     //     type: 2, data: ULanHelper.ZJH_EXIT_GAME, handler: UHandler.create((a) => {
                //     //         if (a) {
                //     //             if (this._roomInfo) {
                //     //                 this._retrunLobby = true;
                //     //                 AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                //     //             } else {
                //     //                 AppGame.ins.loadLevel(ELevelType.Hall, EGameType.ZJH);
                //     //             }
                //     //         }
                //     //     }, this)
                //     // });
                // }


                {
                    this._isExit = true;
                    if (this._roomInfo) {
                        this._retrunLobby = true;
                        AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.ReturnToRoom);
                    } else {
                        AppGame.ins.loadLevel(ELevelType.Hall, EGameType.ZJH);
                    }
                }
                break;
            // break;
        }
    }



    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(EGameType.ZJH,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId, data, handler, unlock);
    }

    /**
 * 请求下局离场
 * @param b 
 */
    sendNextExit(b: boolean): void {
        var data = {
            bExit: b,
        }
        // this.sendMsg(ZJH.SUBID.SUB_C_ROUND_END_EXIT, data);
        UMsgCenter.ins.sendPkg(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, ZJH.SUBID.SUB_C_ROUND_END_EXIT, data);
    }

    requestFangChaoshi(value: boolean): void {
        let pl = this._battleplayer[this.selfUserId];
        if (pl.fangchaoshi == value) return;
        let data = ZJH.CMD_C_GIVEUP_TIMEOUT_OP.create();
        data.bGiveUp = value;
        UMsgCenter.ins.sendPkg(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, ZJH.SUBID.SUB_C_GIVEUP_TIMEOUT_OP, data);
    }
    /**
     * 请求比牌
     * @param seatId 玩家的显示位置id 
     */
    requestComparePoker(seatId: number): void {
        let pl = this.getbattleplayerbyChairId(this.getRealSeatId(seatId));
        let data = ZJH.CMD_C_CompareCard.create();
        data.wCompareUser = pl.userId;
        UMsgCenter.ins.sendPkg(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, ZJH.SUBID.SUB_C_COMPARE_CARD, data);
    }
    /**
     * 断线重连上了 游戏结束之后 直接发起匹配
     */
    reconnectRequest(): void {
        this._state = EZJHState.Match;
        AppGame.ins.roomModel.requestMatch();
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

            AppGame.ins.gamebaseModel.requestLeft(this._roomInfo.gameId, this._roomInfo.roomId, this.selfUserId, ELeftType.LeftGame);
        }

    }
    /**请求自动跟注 */
    requestAutoGenzhu(auto: boolean): void {
        let br = this._battleplayer[this.selfUserId];
        br.auto = auto;
        this.emit(MZJH.CC_UPDATE_AUTO_GENZHU, br.seatId, auto);
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
            let data = new ZJH.CMD_C_NULL();
            UMsgCenter.ins.sendPkg(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, ZJH.SUBID.SUB_C_ALL_IN, data);
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
        if (AppGame.ins.currRoomKind == 2) {
            bb.nickName = AppGame.ins.roleModel.nickName;
        } else {
            bb.nickName = AppGame.ins.roleModel.useId.toString();
        }

        bb.headId = AppGame.ins.roleModel.headId;
        bb.score = AppGame.ins.roleModel.score;
        bb.userId = AppGame.ins.roleModel.useId;
        bb.vipLevel = AppGame.ins.roleModel.vipLevel;
        bb.headboxId = AppGame.ins.roleModel.headboxId;
        bb.headImgUrl = AppGame.ins.roleModel.headImgUrl;
        bb.paiState = EBattlePlayerPaiState.none;
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
        let data = ZJH.CMD_C_AddScore.create();
        data.dScore = score;
        UMsgCenter.ins.sendPkg(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, ZJH.SUBID.SUB_C_ADD_SCORE, data);
    }
    /**
     * 请求弃牌
     */
    requestQipai(): void {
        let data = ZJH.CMD_C_NULL.create();
        UMsgCenter.ins.sendPkg(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, ZJH.SUBID.SUB_C_GIVE_UP, data);
    }
    /**
     * 请求看牌
     */
    requestSeepai(): void {
        let data = ZJH.CMD_C_NULL.create();
        UMsgCenter.ins.sendPkg(EGameType.ZJH, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC, ZJH.SUBID.SUB_C_LOOK_CARD, data);
    }
    /**获取可以比较的seatids */
    getcompareArray(): Array<number> {
        let ar = [];
        for (const key in this._battleplayer) {
            if (this._battleplayer.hasOwnProperty(key)) {
                const element = this._battleplayer[key];
                if (element.userId != this.selfUserId && element.paiState != EBattlePlayerPaiState.none &&
                    element.paiState != EBattlePlayerPaiState.qiPai && element.paiState != EBattlePlayerPaiState.biPaiShu) {
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

        let idx = this.allchips.indexOf(socre);
        if (idx < 0) {
            return cfg_chip[0];
        }
        return cfg_chip[idx];
    }
    /**根据真实玩家位置获取玩家信息 */
    private getbattleplayerbyChairId(chairId: number): ZJHBattlePlayerInfo {
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
