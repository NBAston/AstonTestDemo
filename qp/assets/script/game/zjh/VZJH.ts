import UScene from "../../common/base/UScene";
import VZJHMenu from "./VZJHMenu";
import VZJHOperate from "./VZJHOperate";
import VChipManager from "./VZJHChipManager";
import UNodeHelper from "../../common/utility/UNodeHelper";
import VZJHSeat from "./VZJHSeat";
import USpriteFrames from "../../common/base/USpriteFrames";
import { UIZJHPoker, UIZJHCompare, UIZJHChip, UIZJHNextTurn, EBattlePlayerPaiState, ZJHBattlePlayerInfo, UIZJHUpdateTurnTime, UZJHCmd, UIZJHChips, UIZJHUpdateSeatRoleInfo, UIZJHOverTurn, UIZJHFanPai, UIZJHBattleOver, UIZJHSetZHU, UIZJHOperate, EZJHState } from "./UZJHClass";
import VPKAction from "./VZJHPKAction";
import AppGame from "../../public/base/AppGame";
import MZJH, { ZJH_SELF_SEAT, ZJH_TURN_COUNT_TO_COMPARE, ZJH_SCALE } from "./MZJH";
import { RoomInfo } from "../../public/hall/URoomClass";
import UHandler from "../../common/utility/UHandler";
import VZJHMatch from "./VZJHMatch";
import MRoomModel from "../../public/hall/room_zjh/MRoomModel";
import { ECommonUI, ELevelType, EGameType, EEnterRoomErrCode, ETipType, ERoomKind } from "../../common/base/UAllenum";
import ULanHelper from "../../common/utility/ULanHelper";
import { ToBattle } from "../../common/base/UAllClass";
import AppStatus from "../../public/base/AppStatus";
import UZJHMusic from "./UZJHMusic";
import UAudioRes from "../../common/base/UAudioRes";
import UStringHelper from "../../common/utility/UStringHelper";
import UGame from "../../public/base/UGame";
import UDebug from "../../common/utility/UDebug";
import { ZJH } from "../../common/cmd/proto";
import MHall from "../../public/hall/lobby/MHall";
import UEventHandler from "../../common/utility/UEventHandler";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import { EventManager } from "../../common/utility/EventManager";
import VCuoPai from "./VCuoPai";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";
import UQZNNHelper from "../qznn/UQZNNHelper";
import UAudioManager from "../../common/base/UAudioManager";


const { ccclass, property } = cc._decorator;
/**
 * ??????:sq
 * ??????:???????????????
 */
@ccclass
export default class VZJH extends UGame {

    @property(cc.Toggle)
    cuoPaiToggle: cc.Toggle = null;

    @property(cc.Node)
    cuoPai: cc.Node = null;

    @property(cc.Node)
    menpai: cc.Node = null;

    @property(cc.Node)
    click_pai: cc.Node = null;

    /**???????????? */
    private _playerNode: cc.Node;

    /**??????????????? */
    private _pokerNode: cc.Node;

    /**??????flagnode */
    private _stataFlagNode: cc.Node;

    /**?????????????????? */
    private _playerChipNode: cc.Node;

    /**???ui?????? */
    private _mainNode: cc.Node;

    /**???????????? */
    private _menuNode: cc.Node;

    /**??????????????? */
    private _addchipNode: cc.Node;

    /** ??????????????????*/
    private _chipNode: cc.Node;

    /**????????????????????????????????? */
    private _myturn: cc.Node;

    /**??????????????????????????? */
    private _fxNode: cc.Node;

    /**???????????????????????? */
    private _lableNode: cc.Node;

    /**?????????????????? */
    private _playerchipNode: cc.Node;

    /**????????????????????????*/
    private _pjbhgb: cc.Node;

    /**????????????*/
    private _menu: VZJHMenu;

    /**????????????*/
    private _seats: { [key: number]: VZJHSeat };

    /**??????????????????*/
    private _opreate: VZJHOperate;

    /**????????????*/
    private _chipManager: VChipManager;

    /**??????PK*/
    private _pkAction: VPKAction;

    /**???????????? */
    private _totoalCount: cc.Label;

    /**???????????? */
    private _dizhu: cc.Label;

    /**???????????? */
    // private _dingzhu: cc.Label;

    /**???????????? */
    private _bianhao: cc.Label;

    /**??????????????? */
    private _totalLun: cc.Label;

    /**??? */
    private _light: cc.Node;


    private _res: USpriteFrames;

    /**?????????????????? */
    private _guzhuyizhi: sp.Skeleton;

    /**???????????? */
    private _match: VZJHMatch;

    /**???????????? */
    private _cmds: Array<UZJHCmd>;

    /** ?????????????????????*/
    private _canGetCmd: boolean;

    /**???????????????*/
    private _music: UZJHMusic;

    /**?????????????????????*/
    private _lightPos: { [key: number]: number };

    /**????????????*/
    private _emergency_announcement: Array<string>;

    /**????????????*/
    private _btn_charge: cc.Node;

    /**?????????????????????????????????*/
    private _btn_pjbh: cc.Node;

    /**????????????*/
    private _lab_bian_hao: cc.Label;

    /**?????????????????????????????????*/
    private _enterMinScore: number;

    /**??????*/
    public turn_number: number = 0;

    /**?????????????????????*/
    private play_finised: boolean = false;

    /**???????????????????????????*/
    public play_vs_finised: boolean = false;


    /**
     * ?????????
     */
    protected init(): void {

        this._music = new UZJHMusic();

        /**????????????????????? */
        let root = UNodeHelper.find(this.node, "uiroot/content");
        this._pjbhgb = UNodeHelper.find(root, "top/zjh_pjbg");
        this._playerNode = UNodeHelper.find(root, "players_node");
        this._pokerNode = UNodeHelper.find(root, "poker_node");
        this._stataFlagNode = UNodeHelper.find(root, "stateflag_node");
        this._mainNode = UNodeHelper.find(root, "main");
        this._menuNode = UNodeHelper.find(root, "topleft/menu_node");
        this._addchipNode = UNodeHelper.find(root, "myturn_node/bottom/addchip_node");
        this._chipNode = UNodeHelper.find(root, "chips_node");
        this._myturn = UNodeHelper.find(root, "myturn_node");
        this._fxNode = UNodeHelper.find(root, "fx_node");
        this._lableNode = UNodeHelper.find(root, "label_node");
        this._light = UNodeHelper.find(root, "main/light");
        this._playerchipNode = UNodeHelper.find(root, "player_chip");
        this._guzhuyizhi = UNodeHelper.getComponent(this._fxNode, "guzhuyizhi", sp.Skeleton);
        this._totoalCount = UNodeHelper.getComponent(this._lableNode, "zhu", cc.Label);
        this._dizhu = UNodeHelper.getComponent(this._lableNode, "dizhu", cc.Label);
        // this._dingzhu = UNodeHelper.getComponent(this._lableNode, "dingzhu", cc.Label);
        this._bianhao = UNodeHelper.getComponent(root, "top/bianhao", cc.Label);
        this._totalLun = UNodeHelper.getComponent(this._lableNode, "lun", cc.Label);
        this._match = UNodeHelper.getComponent(root, "match_node", VZJHMatch);
        this._match.init();
        // this._match.hide();
        this._res = this.node.getComponent(USpriteFrames);
        let topleft = UNodeHelper.find(root, "topleft");

        this._menu = new VZJHMenu(topleft, this._menuNode, this._music);
        this._menu.showMenu(false);

        let vsNode = UNodeHelper.find(root, "vs_node");
        let bp = UNodeHelper.find(root, "bipai");
        let vs = UNodeHelper.find(vsNode, "node");
        this._pkAction = vsNode.getComponent(VPKAction);
        this._pkAction.init(this, vs, bp, this._res)

        this._opreate = this._myturn.getComponent(VZJHOperate);
        this._opreate.init(this, this._addchipNode);

        /**???????????????????????? */
        this._chipManager = new VChipManager(this._chipNode);
        this._btn_charge = UNodeHelper.find(this.node, "uiroot/content/players_node/seat_1/btn_charge");
        this._btn_pjbh = UNodeHelper.find(this.node, "uiroot/content/top/zjh_pjbg");
        this._lab_bian_hao = UNodeHelper.getComponent(this.node, "uiroot/content/top/bianhao", cc.Label);
        UEventHandler.addClick(this._btn_charge, this.node, "VZJH", "intoCharge");
        UEventHandler.addClick(this._btn_pjbh, this.node, "VZJH", "oncopy");

        this.setHorseLampPos(0, 330);

        /**??????????????? */
        this._seats = {};
        let fapaiOri = UNodeHelper.find(this._pokerNode, "fapai_ori");
        let qipai = UNodeHelper.find(this._pokerNode, "qipai_ori");
        let len = 5;
        for (let i = 0; i < len; i++) {
            let idx = i + 1;
            let st = UNodeHelper.find(this._playerNode, "seat_" + idx);
            let score = UNodeHelper.find(this._playerNode, "score_" + idx);
            let pk = UNodeHelper.find(this._pokerNode, "poker_" + idx);
            let turn = UNodeHelper.find(root, "myturn_node");
            let flag = UNodeHelper.find(this._stataFlagNode, "flag_" + idx);
            let chip_bg = UNodeHelper.find(this._playerchipNode, "chip_bg_" + idx);
            let chip_count = UNodeHelper.find(this._playerchipNode, "chip_count_" + idx);
            let paixing = UNodeHelper.find(this._fxNode, "paixing_" + idx);
            let fanpai = UNodeHelper.find(this._fxNode, "fanpai_" + idx);
            let win = UNodeHelper.find(this._pokerNode, "win_" + idx);
            let win2 = UNodeHelper.find(this._fxNode, "winner_" + idx);
            let seat = new VZJHSeat(idx, qipai, fapaiOri, st, score, pk, turn, flag, chip_bg, chip_count, fanpai, paixing, win, win2, this._res);
            this._seats[seat.seatId] = seat;
            seat.free();
        }
        this._chipNode.active = true;
        this._canGetCmd = true;
        this._cmds = [];
        this._lightPos = {};
        this._lightPos[0] = 45;
        this._lightPos[1] = -85;
        this._lightPos[2] = -110;
        this._lightPos[3] = 110;
        this._lightPos[4] = 85;
        this._light.active = false;
        this._mainNode.active = false;
        this._pjbhgb.active = false;

        this.play_vs_finised = false;
        //this._opreate.battleOver();
    }

    /**
     * ???????????????????????? ?????????????????????
     * @param data ???????????? 
     */
    openScene(data: any): void {
        this._enterMinScore = data.roomData.enterMinScore;
        super.openScene(data);
        if (!this._init) {
            this._init = true;
            this.init();
        }

        if (data) {
            let dt = data as ToBattle;
            AppGame.ins.zjhModel.saveRoomInfo(dt.roomData);
            if (dt.roomData) {
                // this._dingzhu.string = "??????:" + (dt.roomData.ceilScore * ZJH_SCALE).toString();
                this._dizhu.string = "??????:" + (dt.roomData.floorScore * ZJH_SCALE).toString();
            }
            this.waitbattle();
            this._canGetCmd = true;
        }
        /**??????????????????*/
        this._music.playGamebg();
        this._chipManager.precreate();
        this.gamecloseUI();
        // // this.defaultRequestEnterRoom();
        // if (cc.sys.os == cc.sys.OS_ANDROID) {
        //     this.scheduleOnce(() => {
        //         this.requestGameServer(data);
        //     }, 0.3)
        // } else {
        //     this.requestGameServer(data);
        // }
    }

    /**
     * ??????????????????
     * @param compare ?????? 
     */
    selectCompare(compare: Array<number>): void {
        this._pkAction.selectCompare(compare);
    }

    /**
     * ??????????????????
     */
    waitbattle(): void {
        this._playerNode.active = true;
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                element._out_node.active = false;
                if (element.seatId == 0) {
                    /**????????????????????????????????????*/
                    element.showbaseInfo(AppGame.ins.zjhModel.getshowselfinfo());
                } else {
                    // element.free();
                    if (AppGame.ins.currRoomKind == 2) {
                        /**??????????????????*/
                        for (const key in AppGame.ins.zjhModel._battleplayer) {
                            if (AppGame.ins.zjhModel._battleplayer[key].seatId !== 0 && AppGame.ins.zjhModel._battleplayer[key].seatId == element.seatId) {
                                element.showbaseInfo(AppGame.ins.zjhModel._battleplayer[key]);
                            }
                        }
                        // element.free();
                    } else {
                        //??????????????????
                        element.free();
                    }

                }
            }
        }
        this._pjbhgb.active = false;
        this._mainNode.active = false;
        this._bianhao.node.active = false;
        this.showgameinfo(false);
        this._light.active = false;
        this._match.show();
        this._chipManager.reset();
        this._myturn.active = false;
        this.resetUI();
        this._fxNode.active = false;
        // this._pokerNode.active = false;
    }

    /**
     * ?????????????????????
     */
    private intoCharge(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showUI(ECommonUI.LB_Charge);
    }

    /**
     * ????????????????????????
     */
    private oncopy(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this._lab_bian_hao.string).substr(5, 30));
    }

    /**
     * ?????????????????????
     */
    resetUI() {
        this._totalLun.string = "???0/20???";
        this._totoalCount.string = "??????:0";
    }

    /**
     * ??????????????????
     * @param value ????????????
     */
    private showgameinfo(value: boolean): void {
        // this._dingzhu.node.active = value;
        this._dizhu.node.active = value;
        this._totoalCount.node.active = value;
        this._totalLun.node.active = value;
    }

    /**
     * ??????????????????
     * @param seatId ??????ID
     */
    private setlightAngel(seatId: number): void {
        this._light.active = true;
        this._light.setRotation(this._lightPos[seatId]);
    }

    /**
     * ?????????????????????????????????
     * @param caller ??????????????????
     */
    private reconnentSetLightAngel(caller): void {
        this.setlightAngel(AppGame.ins.zjhModel._battleplayer[caller.wCurrentUser].seatId);

    }

    /**
     * ????????????
     * @param dt ??????
     */
    protected update(dt: number): void {
        while (this._canGetCmd && this._cmds.length > 0) {
            let cmd = this.getcmd();
            if (cmd) {
                this._canGetCmd = !cmd.needwait;
                this.docmd(cmd);
            } else {
                this._canGetCmd = true;
            }
        }
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                if (!element.isFree) {
                    element.update(dt);
                }
            }
        }
    }

    /**
     * ?????????????????????????????????
     * @param cmd ??????
     * @param dt ???
     * @param needwait ??????????????????
     */
    protected pushcmd(cmd: string, dt: any, needwait: boolean): void {
        if (!this._cmds) this._cmds = [];
        let item = new UZJHCmd();
        item.cmd = cmd;
        item.data = dt;
        item.needwait = needwait;
        this._cmds.push(item);

    }

    /**
     * ?????????
     */
    protected getcmd(): UZJHCmd {
        if (this._cmds.length > 0) {
            let len = this._cmds.length;
            let dt = this._cmds.shift();
            return dt;
        }
        return null;
    }

    /**
     * ??????????????????
     * @param cmd ??????
     */
    private docmd(cmd: UZJHCmd): void {
        switch (cmd.cmd) {

            case "reconnect_no_gameing":
                this.do_reconnect_no_gameing();
                break;

            //??????????????????
            case "seat_info":
                this.seat_info(cmd.data);
                break;

            //????????????
            case "guzhuyizhi":
                this.do_guzguyizhi(cmd.data);
                break;

            //????????????
            case "out_chip":
                this.createChip(cmd.data);
                break;

            case "next_turn":
                this.next_turn(cmd.data);
                break;

            case "player_score":
                this.player_score(cmd.data);
                break;

            case "total_turn":
                this.total_turn(cmd.data);
                break;

            case "total_score":
                this.total_score(cmd.data);
                break;

            case "turn_over":
                this.turn_over(cmd.data);
                break;

            case "set_zhu":
                this.do_set_zhu(cmd.data);
                break;

            case "give_up":
                this.do_give_up(cmd.data);
                break;

            case "refresh_chip":
                this.do_refresh_chip(cmd.data);
                break;

            case "turn_time":
                this.turn_time(cmd.data);
                break;

            case "compare":
                this.do_compare(cmd.data);
                break;

            case "game_end":
                this.do_game_end(cmd.data);
                break;

            case "look_pai":
                this.do_look_pai(cmd.data);
                break;

            case "fan_pai":
                this.do_fan_pai(cmd.data);
                break;

            case "bipai_shu":
                this.do_bipai_shu(cmd.data);
                break;

            case "fapai":
                this.do_fapai();
                break;

            case "free_scene":
                this.do_free_scene();
                break;

            case "do_show_match":
                this.do_show_match();
                break;

            case "start_match":
                this.do_start_match(cmd.data);
                break;

            case "cancle_match":
                this.do_cancel_mathc(cmd.data);
                break;
        }
    }

    /**
     * ??????
     */
    private do_reconnect_no_gameing(): void {
        this._opreate.fromeDisconnect(true);
        this.waitbattle();
        this._match.hide();
        // this._opreate.showMatch();
        this._pkAction.battleOver();
        AppGame.ins.zjhModel.resetGameState();
        this._cmds = [];
        this._canGetCmd = true;
    }

    /**
     * vs??????????????????
     * @param lst 
     * @param rst
     */
    pkActionOver(lst: number, rst: number): void {
        this._seats[lst].bipai(false);
        this._seats[rst].bipai(false);
        this.scheduleOnce(() => {
            this._canGetCmd = true;
        }, 0.01);
        // this._opreate.showMatchBtn(false);
    }

    /**
     * ????????????
     * @param caller ????????????
     */
    private do_cancel_mathc(caller: boolean): void {
        if (caller) {
            if (AppGame.ins.currRoomKind == 0) {
                // this._opreate.showMatchBtn(true);
            }
            this._match.hide();
        } else {
            this._match.show();
        }
    }

    /**
     * ????????????
     * @param sucess ????????????
     */
    private do_start_match(sucess: boolean): void {
        if (sucess) {
            this.waitbattle();
        } else {
            this._opreate.showMatch();
        }
    }

    /**
     * ????????????
     */
    private do_show_match(): void {
        if (AppGame.ins.currRoomKind == 0) {
            this._opreate.showMatch();
        }

    }

    /**
     * ??????
     * @param caller ??????
     */
    private do_fan_pai(caller: UIZJHFanPai): void {
        this._canGetCmd = true;
        let seat = this._seats[caller.seatId];
        if (caller.playPos == 0) this._music.playKanPai(seat.sex);
        seat.fanpai(caller.poker, caller.withAnimation, UHandler.create(() => {
            if (caller.playPos == 0) this._music.playPaiXing(caller.poker.pokerType);
        }, this));
    }

    /**
     * ?????????
     * @param caller ?????????
     */
    private do_bipai_shu(caller: number): void {
        let seat = this._seats[caller];
        if (caller == ZJH_SELF_SEAT) {
            this._opreate._toggle_xjlc.node.active = false;
            this.cuoPaiToggle.node.active = false;
            if (AppGame.ins.currRoomKind == 0) {
                this.scheduleOnce(function () {
                    this._opreate.showMatchBtn(true);
                }, 5)
            }
        }
        this._opreate.showall(false);
        seat.bipai_shu();
    }

    /**
     * ??????????????????
     */
    private do_free_scene(): void {
        this._totalLun.string = "???1/20???";
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                element.free();
            }
        }
        this._totoalCount.string = "";
        this._light.active = false;
    }

    /**
     * ????????????
     * @param caller ??????
     */
    private do_give_up(caller): void {
        this._canGetCmd = true;
        let seat = this._seats[AppGame.ins.zjhModel._battleplayer[caller.wGiveUpUser].seatId];
        seat.qipai();
        this._music.playQiPai(seat.sex);
        if (AppGame.ins.zjhModel._battleplayer[caller.wGiveUpUser].seatId == ZJH_SELF_SEAT) {
            this._opreate._toggle_xjlc.node.active = false;
            this._opreate.showall(false);
            this.cuoPaiToggle.node.active = false;
            this.menpai.active = false;
            // this.scheduleOnce(function(){
            if (AppGame.ins.currRoomKind == 0) {
                if (!caller.bEndGame) {
                    this._opreate.showMatchBtn(true);
                }
            }
            // },0.001)
        }

    }

    /**
     * ????????????
     * @param caller ???????????????
     */
    private do_set_zhu(caller: UIZJHSetZHU): void {
        let seat = this._seats[caller.seatId];
        if (caller.state == 1) {
            seat.genzhu();
            this._music.playGenzhu(seat.sex);
        } else if (caller.state == 2) {
            seat.jiazhu();
            this._music.playJiazhu(seat.sex);
        }
    }

    /**
     * ??????
     */
    private do_fapai(): void {
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                if (!element.isFree) {
                    if (element.seatId == ZJH_SELF_SEAT) {
                        element.fapai(UHandler.create(() => {
                            this._canGetCmd = true;
                        }, this));
                    } else {
                        element.fapai(null);
                    }
                }
            }
        }
        this._music.playfapai();
    }

    /**
     * ??????????????????
     * @param caller ??????????????????
     */
    private do_compare(caller: UIZJHCompare): void {
        if(this.cuoPai.active){
            this.cuoPai.active = false;
        }
        let left = this._seats[caller.leftSeatId].getSeatWordPos();
        let right = this._seats[caller.rightSeatId].getSeatWordPos();
        let paiLeft = this._seats[caller.leftSeatId].getPaiWordsPos();
        let paiRight = this._seats[caller.rightSeatId].getPaiWordsPos();
        this._pkAction.playPkAction(left, right, paiLeft, paiRight, caller);
        this._seats[caller.leftSeatId].bipai(true);
        this._seats[caller.rightSeatId].bipai(true);
        this._music.playBiPai(this._seats[caller.leftSeatId].sex)
    }

    /**
     * ????????????
     * @param caller ??????????????????
     */
    private do_game_end(caller: UIZJHBattleOver): void {
        this._canGetCmd = true;
        this._light.active = false;
        this._seats[0]._clickPai.active = false;
        this.menpai.active = false;
        this._opreate._toggle_xjlc.node.active = false;
        this._pkAction.battleOver();

        for (const key in caller.statics) {
            if (caller.statics.hasOwnProperty(key)) {
                let element = caller.statics[key];
                let pl = this._seats[element.seatId];
                pl.setScore(element.lastscore);
                pl.result(caller.winseatId == pl.seatId, element.getScore);
                if (element.uipoker) {
                    if (pl.seatId == ZJH_SELF_SEAT) {
                        if (element.paistate == EBattlePlayerPaiState.qiPai || element.paistate == EBattlePlayerPaiState.kanPai || element.paistate == EBattlePlayerPaiState.biPaiShu) {
                            if (this.cuoPai.active) {
                                pl.fanpai(element.uipoker);
                                this.cuoPai.active = false;
                            }
                        } else {
                            pl.fanpai(element.uipoker);
                        }
                    } else {
                        pl.fanpai(element.uipoker);
                    }
                }
            }
        }
        let seat = this._seats[caller.winseatId];
        this._chipManager.moveTo(seat.getSeatWordPos(), 0.5);
        this._music.playflyCoin();
        this._opreate.showall(false);
        this.scheduleOnce(function () {
            if (AppGame.ins.currRoomKind == 0 && AppGame.ins.zjhModel._state == EZJHState.Wait) {
                //?????????????????????????????????
                this._opreate.showMatchBtn(true);
            }
        }, 3)

        if (AppGame.ins.currRoomKind == 2) {
            this.clearBattlePlayer();
            this.scheduleOnce(function () {
                seat.closewinfx();
                    //??????????????????????????????
                    AppGame.ins.zjhModel._state = EZJHState.Match;
                    this.waitbattle();
            }, 3);
        }
    }

    /**
     * ??????????????????
     * @param caller ??????
     */
    private do_look_pai(caller: number): void {

        let seat = this._seats[caller];
        seat.seePai();
        if (seat.seatId != ZJH_SELF_SEAT) {
            this._music.playKanPai(seat.sex);
        }
    }

    /**
     * ????????????????????????
     * @param caller ????????????????????????
     */
    private do_guzguyizhi(caller: any): void {
        this._guzhuyizhi.node.active = true;
        this._guzhuyizhi.setAnimation(0, "gzyz", false);
        this._guzhuyizhi.setCompleteListener(() => {
            this._canGetCmd = true;
            this._guzhuyizhi.node.active = false;
        });
        let seat = this._seats[caller];
        if (caller == 0) {
            if (AppGame.ins.currRoomKind == 0) {
                // if(AppGame.ins.zjhModel.state == EZJHState.)
                this.scheduleOnce(function () {
                    this._opreate.showMatchBtn(true);
                }, 8)

            }
        }
        this._music.playGuzhuyizhi(seat.sex);
    }

    /**
     * ??????????????????
     * @param caller ????????????
     */
    private seat_info(caller: { [key: number]: ZJHBattlePlayerInfo }): void {
        this.showgameinfo(true);
        // this._match.hide();
        this._mainNode.active = true;
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                let data = caller[element.seatId];
                element.free();
                if (data) {
                    element.bind(data);
                } else {
                    element.free();
                }
            }
        }
        let self = caller[ZJH_SELF_SEAT];
        if (self) {
            if (self.isturn) {
                this._opreate.intoSelfturn(self.auto);

            } else {
                this._opreate.intoOtherTurn(false);
            }
            this._opreate.setFangChaoShi(self.fangchaoshi);
            this._opreate.showMatchBtn(false);
            this._fxNode.active = true;
        }
        if (AppGame.ins.currRoomKind == 2) {
            this.men_pai(AppGame.ins.zjhModel._wLookCardMinTurnsRound);
            this._opreate.updateBtn();
        }
    }

    /**
     * ????????????
     * @param caller ????????????
     */
    private createChip(caller: UIZJHChip): void {
        let len = caller.items.length;
        for (let i = 0; i < len; i++) {
            const element = caller.items[i];
            let seat = this._seats[element.seatId];
            let state = element.state;
            if (caller.chipState == 2) {
                state = 2;
            }
            this._chipManager.createChip(seat.getSeatWordPos(), element.chipType, element.gold, 1, element.objId, state);
            this._music.playbet(caller.chipState);
        }
    }

    /**
     * ???????????????????????????
     * @param caller ???????????????
     */
    private next_turn(caller: UIZJHNextTurn): void {
        let seat = this._seats[caller.seatId];
        seat.enterTurn(caller.cdtime);
        if (caller.seatId == ZJH_SELF_SEAT) {
            this._opreate.intoSelfturn(caller.auto);
        }
        this.setlightAngel(caller.seatId);
    }

    /**
     * ????????????
     * @param caller ????????????
     */
    private player_score(caller: UIZJHUpdateSeatRoleInfo): void {
        this._seats[caller.seatId].updateScore(caller.score, caller.usetotal);
    }

    /**
     * ????????????
     * @param turn ??????
     */
    private total_turn(turn: number): void {
        this._totalLun.string = "???" + turn.toString() + "/20???";
        this._myturn.active = true;
        this.turn_number = turn;
        if (turn !== 0) {
            this._match.hide();
        }
        this.men_pai(AppGame.ins.zjhModel._wLookCardMinTurnsRound);
        this._opreate.updateBtn();
    }

    /**
     * ????????????
     * @param score ??????
     */
    private total_score(score: number): void {
        this._totoalCount.string = "??????:" + UStringHelper.getMoneyFormat((score * ZJH_SCALE)).toString();
    }

    /**
     * ????????????
     * @param data ?????????????????????
     */
    private turn_over(data: UIZJHOverTurn): void {
        this._seats[data.seatId].leaveTurn();
        if (data.seatId == ZJH_SELF_SEAT) {
            this._opreate.intoOtherTurn(data.auto);
            this._pkAction.hideCompareUI();
        }
    }

    /**
     * ???????????????????????????
     * @param caller ????????????
     */
    private do_refresh_chip(caller: UIZJHOperate): void {
        this._opreate.updateChip(caller);
    }

    /**
     * ????????????????????????
     * @param caller ????????????
     */
    private turn_time(caller: UIZJHUpdateTurnTime): void {
        this._seats[caller.seatId].updateturnTime(caller.leftTime);
    }

    /**
     * ???????????? ???????????????????????????
     */
    private ts_fapai(): void {
        this.pushcmd("fapai", null, true);
    }
    private updata_seat_info(caller: any): void {
        this.pushcmd("seat_info", caller, false);
    }
    private sc_ts_guzhuyizhi(caller: any): void {
        this.pushcmd("guzhuyizhi", caller, true);
    }
    private sc_ts_player_compare(caller: any): void {
        this.pushcmd("compare", caller, true);
    }
    private sc_cz_put_out_chip(caller: UIZJHChip): void {
        this.pushcmd("out_chip", caller, false);
    }
    private sc_ts_set_next_turn(caller: UIZJHNextTurn): void {
        this.pushcmd("next_turn", caller, false);
    }
    private sc_ts_updata_total_player_score(caller: any): void {
        this.pushcmd("player_score", caller, false);
    }
    private sc_ts_updata_total_turn(caller: any): void {
        this.pushcmd("total_turn", caller, false);
    }
    private sc_ts_updata_total_score(caller: any): void {
        this.pushcmd("total_score", caller, false);
    }
    private game_end(caller: any): void {
        this.pushcmd("game_end", caller, true);
    }
    private look_pai(caller: any): void {
        this.pushcmd("look_pai", caller, false);
    }
    private fan_pai(caller: any): void {
        this.pushcmd("fan_pai", caller, true);
    }
    private bipai_shu(caller: any): void {
        this.pushcmd("bipai_shu", caller, false);
    }
    private set_turn_over(caller: any): void {
        this.pushcmd("turn_over", caller, false);
    }
    private refresh_chip(caller: any): void {
        this.pushcmd("refresh_chip", caller, false);
    }
    private updata_turn_time(caller: UIZJHUpdateTurnTime): void {
        this.pushcmd("turn_time", caller, false);
    }
    private set_zhu(caller: any): void {
        this.pushcmd("set_zhu", caller, false);
    }
    private player_give_up(caller: any): void {
        this.pushcmd("give_up", caller, false);
    }
    private set_game_free(): void {
        this.pushcmd("free_scene", null, false);
    }
    private set_cancle_match(caller: any): void {
        this.pushcmd("cancle_match", caller, false);
    }
    private sc_ts_show_match(): void {
        this.pushcmd("do_show_match", null, false);
    }
    private sc_ts_start_match(caller: any): void {
        this.pushcmd("start_match", caller, false);
    }

    /**
     * ????????????????????????turn??????
     * @param auto 
     */
    private cc_end_self_turn(auto: boolean): void {
        this._seats[ZJH_SELF_SEAT].leaveTurn();
        this._opreate.intoOtherTurn(auto);
    }

    /**
     * ??????????????????
     * @param errorCode ????????????
     * @param errorMsg ????????????
     */
    protected enter_room_fail(errorCode: number, errorMsg?: any): void {
        if (errorCode == 16 || errorCode == 7 || errorCode == 11) {
            if (AppGame.ins.zjhModel._isExit) {
                // AppGame.ins.loadLevel(ELevelType.Hall, EGameType.ZJH);
            } else {
                super.enter_room_fail(errorCode, errorMsg);
            }
        } else {
            super.enter_room_fail(errorCode, errorMsg);
        }
        return
        // let self = this;
        // switch (errorCode) {
        //     case EEnterRoomErrCode.ERROR_ENTERROOM_GAME_IS_END:
        //         AppGame.ins.showUI(ECommonUI.NewMsgBox, {
        //             type: 1, data: ULanHelper.BATTLE_OVER, handler: UHandler.create((isOK) => {
        //                 if (isOK) {
        //                     // this.waitbattle();
        //                     AppGame.ins.zjhModel.requestMatch(); 
        //                 }  
        //             }, this)
        //         });
        //         break;
        //     case EEnterRoomErrCode.ERROR_ENTERROOM_SEAT_FULL:
        //     case EEnterRoomErrCode.ERROR_ENTERROOM_TABLE_FULL:
        //         {
        //             this._match.hide();
        //             this._opreate.showMatch();
        //         }
        //         break;
        //     case EEnterRoomErrCode.ERROR_ENTERROOM_USER_AUTO_EXIT:
        //         {
        //             let msg = ULanHelper.ENTERROOM_ERROR[errorCode];
        //             if (!msg) {
        //                 msg = ULanHelper.ROOM_INFO_ERRO;
        //             }
        //             this.scheduleOnce(() => {
        //                 AppGame.ins.showUI(ECommonUI.NewMsgBox, {
        //                     type: 1, data: msg, handler: UHandler.create(() => {
        //                         AppGame.ins.loadLevel(ELevelType.Hall, EGameType.ZJH);
        //                     }, this)
        //                 });
        //             }, 6);
        //         }
        //         break;
        //     case EEnterRoomErrCode.ERROR_ENTERROOM_LONGTIME_NOOP:
        //         {
        //             AppGame.ins.zjhModel.long_timg = true;
        //             let msg = ULanHelper.ENTERROOM_ERROR[errorCode];
        //             if (!msg) {
        //                 msg = ULanHelper.GAME_INFO_ERRO;
        //             }
        //             this.scheduleOnce(function() {
        //                 AppGame.ins.showUI(ECommonUI.NewMsgBox, {
        //                     type: 1, data: msg, handler: UHandler.create(() => {
        //                         AppGame.ins.loadLevel(ELevelType.Hall, EGameType.ZJH);
        //                     }, this)
        //                 });
        //             },4)

        //         }
        //         break;
        //     default:
        //         if(errorCode == 7){
        //             var msg =  "????????????????????????????????????" + self._enterMinScore*ZJH_SCALE + "???????????????????????????";
        //         }else{
        //             var msg = ULanHelper.ENTERROOM_ERROR[errorCode];
        //         }
        //         if (!msg) {
        //             msg = ULanHelper.GAME_INFO_ERRO;
        //         }
        //         this.scheduleOnce(function(){
        //             AppGame.ins.showUI(ECommonUI.NewMsgBox, {
        //                 type: 1, data: msg, handler: UHandler.create(() => {
        //                     AppGame.ins.loadLevel(ELevelType.Hall);
        //                 }, this)
        //             });
        //         },5.5)

        //         break;
        // }
    }

    /**
     * ??????
     */
    protected reconnect_in_game_but_no_in_gaming(): void {
        this.pushcmd("reconnect_no_gameing", null, false);
        this.waitbattle();
        // AppGame.ins.roomModel.requestMatch();
    }

    /**
     * ????????????
     * @param userId ??????ID
     * @param callback 
     */
    private propRun(userId: number, callback: any = null): void {
        for (let i = 0; i < 5; i++) {
            let player = this._seats[i.toString()];
            let bindUserId = player.prop.getComponent(GamePropManager).getBindUserId();
            if (bindUserId && (userId == bindUserId)) {
                callback && callback(player.prop);
            }
        }
    }

    /**
     * ????????????
     * @param userId ??????ID
     * @param callback 
     */
    private chatRun(userId: number, callback: any = null): void {
        for (let i = 0; i < 5; i++) {
            let player = this._seats[i.toString()];
            let bindUserId = player.chatProp.getComponent(VGameChatPropManager).getBindUserId();
            if (bindUserId && (userId == bindUserId)) {
                callback && callback(player.chatProp);
            }
        }
    }

    /**
     * ??????????????????????????????
     * @param caller 
     */
    private updata_game_number(caller: string): void {
        this._pokerNode.active = true;
        this._bianhao.node.active = true;
        this._bianhao.string = ULanHelper.GAME_NUMBER + caller;
        this._pjbhgb.active = true;
        this._playerchipNode.active = true;
        if (AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId] && AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.mengPai || AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.kanPai) {
            this.cuoPaiToggle.node.active = true;
        }
        this.play_finised = false;
    }

    /**
     * ???????????????
     * @param value ?????????
     */
    private show_pai(value): void {
        this._pokerNode.active = value;
    }

    /**
     * ????????????
     * @param value ??????
     */
    private show_ani(value): void {
        this._fxNode.active = value;
    }

    /**
     * ??????????????????
     * @param data1 ??????ID
     * @param data2 ????????????
     */
    private usstauts_change(data1, data2): void {
        if (data2 == 6 || data2 == 0 && (data1 !== AppGame.ins.roleModel.useId)) {
            if (AppGame.ins.zjhModel.state == EZJHState.Gameing) {
                if (AppGame.ins.currRoomKind == 2) {
                    if (AppGame.ins.zjhModel._battleplayer[data1]) {
                        if (AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId] && AppGame.ins.zjhModel._battleplayer[data1].paiState == EBattlePlayerPaiState.none) {
                            this.clearPlayer(data1);
                        }
                    }
                }
            } else {
                if (AppGame.ins.currRoomKind == 2) {
                    if (AppGame.ins.zjhModel.state == EZJHState.Match) {
                        this.clearPlayer(data1);
                    } else {
                        this.schedule(function () {
                            if (AppGame.ins.zjhModel._battleplayer[data1] && AppGame.ins.zjhModel._battleplayer[data1].paiState == EBattlePlayerPaiState.none) {
                                if (AppGame.ins.zjhModel.state == EZJHState.Match) {
                                    this.clearPlayer(data1);
                                    this.unscheduleAllCallbacks();
                                }
                            }
                        }, 1)
                    }
                } else {
                    if (AppGame.ins.zjhModel.state == EZJHState.Match) {
                        this.clearPlayer(data1);
                    }
                }
            }
        } else {
            // AppGame.ins.zjhModel._battleplayer[data1].paiState = AppGame.ins.zjhModel._battleplayer[data1].paiState;
        }
    }

    /**
     * ?????????????????????????????????????????????
     * @param data1 ??????ID
     */
    private clearPlayer(data1): void {
        if (AppGame.ins.zjhModel._battleplayer[data1]) {
            this._seats[AppGame.ins.zjhModel._battleplayer[data1].seatId].free();
            delete AppGame.ins.zjhModel._battleplayer[data1];
        }
    }

    /**
     * ????????????????????????
     * @param caller ?????? 
     */
    private update_fanpai(caller: ZJH.CMD_S_LookCard): void {
        //???????????????????????????????????????
        if (this.cuoPaiToggle.isChecked) {

        } else {
            AppGame.ins.zjhModel.update_fanpai(caller.wLookCardUser, caller.cbCardData, caller.cbCardType, 0);
        }
    }

    /**
     * ????????????????????????
     * @param e ????????????toggle???????????????
     */
    isExitGame(e: cc.Toggle) {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.zjhModel.nextExit = e.isChecked;
        AppGame.ins.zjhModel.sendNextExit(e.isChecked);
    }

    /**
     * ???????????????????????????
     * @param value ???????????????
     */
    private ts_fangchaoshi(value: boolean): void {
        UAudioManager.ins.playSound("audio_click");
        this._opreate.setFangChaoShi(value);
        let tips = !value ? ULanHelper.OFF_FANG_CHAOSHI : ULanHelper.ON_FANG_CHAOSHI;
        AppGame.ins.showTips({ data: tips, type: ETipType.onlyone });
    }

    /**
    * ?????????????????????
    * @param isHide ??????????????????
    */
    onGameToBack(isBack: boolean) {

        if (AppGame.ins.currRoomKind == 0) {
            //?????????
            AppGame.ins.zjhModel.on_back = isBack;
            if (!isBack) {
                // if(this.play_vs_finised){
                //     let a = UNodeHelper.find(this.node,"uiroot/content/vs_node/node");
                //     a.active = false;
                // }
                if (this.cuoPai.active) {
                    this.cuoPai.active = false;
                }
                this._guzhuyizhi.node.active = false;
                if (AppGame.ins.zjhModel._isEnd) {
                    this._opreate.showall(false)
                } else {
                    this._cmds = [];
                    this._canGetCmd = false;
                    AppGame.ins.zjhModel._disconnect = false;

                    AppGame.ins.zjhModel.sendFreshGameScene();
                    this.scheduleOnce(function () {
                        if (!AppGame.ins.zjhModel._disconnect) {
                            // this.reset_scene();
                            this.show_empty();
                            let msg = "??????????????????????????????????????????";
                            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                                type: 1, data: msg, handler: UHandler.create(() => {
                                    AppGame.ins.loadLevel(ELevelType.Hall, EGameType.ZJH);
                                }, this)
                            });
                        }
                    }, 2)
                }
            } else {
                if (!AppGame.ins.zjhModel._isEnd) {
                    this._cmds = [];
                    this._canGetCmd = false;
                }
            }
        } else {
            //?????????
            if (!isBack) {
                this._cmds = [];
                this._canGetCmd = false;
                let a = UNodeHelper.find(this.node, "uiroot/content/vs_node/node");
                a.active = false;
                if (this.cuoPai.active) {
                    this.cuoPai.active = false;
                }
                this._chipManager.reset();
                AppGame.ins.zjhModel.sendFreshGameScene();
            } else {
                this._cmds = [];
                this._canGetCmd = false;
            }
        }
    }

    private show_empty(): void {
        this._playerNode.active = false;
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                element.free();
            }
        }
        this._pjbhgb.active = false;
        this._mainNode.active = false;
        this._bianhao.node.active = false;
        this.showgameinfo(false);
        this._light.active = false;
        // this._match.show();
        this._chipManager.reset();
        this._myturn.active = false;
        this.resetUI();
        this._fxNode.active = false;
        this._pokerNode.active = false;
        this._playerchipNode.active = false;
    }

    private show_wait(): void {
        if (AppGame.ins.zjhModel.state !== EZJHState.Gameing) {
            this.waitbattle();
        }
    }

    private reset_scene(): void {
        let pai = [];
        let cbCardType = 0;
        for (let i = 0; i < AppGame.ins.zjhModel._end_caller.pEndUserInfo.length; i++) {
            if (AppGame.ins.zjhModel._end_caller.pEndUserInfo[i].dUserId == AppGame.ins.roleModel.useId) {
                pai = AppGame.ins.zjhModel._end_caller.pEndUserInfo[i].cbCardData;
                cbCardType = AppGame.ins.zjhModel._end_caller.pEndUserInfo[i].cbCardType;
            }
        }
        if (AppGame.ins.zjhModel._compare_card !== null && AppGame.ins.zjhModel._end_caller !== null) {
            AppGame.ins.zjhModel.s_compare_card(AppGame.ins.zjhModel._compare_card);
            AppGame.ins.zjhModel.update_fanpai(AppGame.ins.roleModel.useId, pai, cbCardType, ZJH_SELF_SEAT, false);
            AppGame.ins.zjhModel.s_game_end(AppGame.ins.zjhModel._end_caller);
            this.clearBattlePlayer();
            this._opreate.showall(false);
        }
    }

    private show_result(caller): void {
        if (AppGame.ins.currRoomKind == 2) {
        //     //?????????
        //     if (caller.wWaitTime > 2) {
        //         //?????????????????????????????????2???
        //         this._light.active = false;
        //         this._chipManager.reset();

        //         //??????????????????
        //         for (let index = 0; index < caller.gameEndInfo.pEndUserInfo.length; index++) {
        //             for (const key in AppGame.ins.zjhModel._battleplayer) {
        //                 if (AppGame.ins.zjhModel._battleplayer[key].userId == caller.gameEndInfo.pEndUserInfo[index].dUserId) {
        //                     AppGame.ins.zjhModel._battleplayer[key].score = caller.gameEndInfo.pEndUserInfo[index].dUserScore;
        //                 }
        //             }
        //         }
        //         AppGame.ins.zjhModel.update_seat_info();


        //         for (let index = 0; index < caller.gameEndInfo.pEndUserInfo.length; index++) {
        //             let score = caller.gameEndInfo.pEndUserInfo[index].dGameScore * ZJH_SCALE;
        //             let win = score > 0 ? true : false;
        //             let seatId = AppGame.ins.zjhModel.getUISeatId(caller.gameEndInfo.pEndUserInfo[index].dChairId);


        //             this._seats[seatId]._win.active = win;
        //             this._seats[seatId]._lose.active = !win;

        //             let show = win ? this._seats[seatId]._win : this._seats[seatId]._lose;
        //             let label = win ? this._seats[seatId]._winNum : this._seats[seatId]._loseNum;
        //             label.string = win ? "+" + UStringHelper.getMoneyFormat(score) : UStringHelper.getMoneyFormat(score, -1);
        //             show.setPosition(0, -70);
        //             show.runAction(cc.moveTo(0.1, 0, 5));

        //         }

        //         for (let index = 0; index < caller.GamePlayers.length; index++) {
        //             this._seats[AppGame.ins.zjhModel.getUISeatId(caller.GamePlayers[index].cbChairId)]._chipBg.active = true;
        //             this._seats[AppGame.ins.zjhModel.getUISeatId(caller.GamePlayers[index].cbChairId)]._chipCount.string = caller.GamePlayers[index].dTableJetton;
        //             if (caller.GamePlayers[index].bMingZhu) {
        //                 this._seats[AppGame.ins.zjhModel.getUISeatId(caller.GamePlayers[index].cbChairId)].seePai();
        //             }
        //             if (caller.GamePlayers[index].bGiveUp) {
        //                 this._seats[AppGame.ins.zjhModel.getUISeatId(caller.GamePlayers[index].cbChairId)].qipai();
        //             }
        //             if (caller.GamePlayers[index].bLost) {
        //                 this._seats[AppGame.ins.zjhModel.getUISeatId(caller.GamePlayers[index].cbChairId)].bipai_shu();
        //             }
        //             if (caller.GamePlayers[index].cbHandCardData !== []) {
        //                 AppGame.ins.zjhModel.update_fanpai(caller.GamePlayers[index].wUserId, caller.GamePlayers[index].cbHandCardData, caller.GamePlayers[index].cbHandCardType, AppGame.ins.zjhModel.getUISeatId(caller.GamePlayers[index].cbChairId));
        //             }

        //         }

        //         this.scheduleOnce(function () {
        //             this.waitbattle();
        //         }, 1)
        //     } else {
        //         if (AppGame.ins.zjhModel._state !== EZJHState.Gameing) {
        //             this.clearBattlePlayer();
        //         }
        //         this.waitbattle();
        //     }
                this.waitbattle();
        } else {
            if (this._match.node.active) {
                this._match.node.active = false;
                // this._pjbhgb.active = true;
                // this._mainNode.active = true;
                // this._bianhao.node.active = true;
                // this._pokerNode.active = true;
                // this._fxNode.active = true;
                // this.showgameinfo(true);
                // this._myturn.active = true;
                // for (const key in this._seats) {
                //     if (this._seats.hasOwnProperty(key)) {

                //         const element = this._seats[key];
                //         element._paiAction._poker1.node.active = true;
                //         element._paiAction._poker2.node.active = true;
                //         element._paiAction._poker3.node.active = true;
                //         element._paiAction.normalState();
                //         element._isfree = false;
                //         element._seatRoot.active = true;
                //         element._pokerRoot.active = true;
                //         element._chipBg.active = true;
                //         element._chipValue.active = true;
                //         element._win.active = true;
                //         element._winNum.node.active = true;
                //         element._loseNum.node.active = true;
                //         element._lose.active = true;
                //         element._bipaiShuNode.active = true;
                //         element._paixingNode.active = true;
                //         element._qipai.active = true;
                //         element._paiAction.normalState();
                //         element._paiAction._fapaiAct1.init();
                //         element._paiAction._fapaiAct2.init();
                //         element._paiAction._fapaiAct3.init();
                //     }
                // }
                this.show_empty();
                let msg = "??????????????????????????????????????????";
                AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                    type: 1, data: msg, handler: UHandler.create(() => {
                        AppGame.ins.loadLevel(ELevelType.Hall, EGameType.ZJH);
                    }, this)
                });
                return
            }
            //?????????
            this._light.active = false;
            this._chipManager.reset();

            //??????????????????
            for (let index = 0; index < caller.gameEndInfo.pEndUserInfo.length; index++) {
                for (const key in AppGame.ins.zjhModel._battleplayer) {
                    if (AppGame.ins.zjhModel._battleplayer[key].userId == caller.gameEndInfo.pEndUserInfo[index].dUserId) {
                        AppGame.ins.zjhModel._battleplayer[key].score = caller.gameEndInfo.pEndUserInfo[index].dUserScore;
                    }
                }
            }
            AppGame.ins.zjhModel.update_seat_info();


            for (let index = 0; index < caller.gameEndInfo.pEndUserInfo.length; index++) {
                let score = caller.gameEndInfo.pEndUserInfo[index].dGameScore * ZJH_SCALE;
                let win = score > 0 ? true : false;
                let seatId = AppGame.ins.zjhModel.getUISeatId(caller.gameEndInfo.pEndUserInfo[index].dChairId);


                this._seats[seatId]._win.active = win;
                this._seats[seatId]._lose.active = !win;

                let show = win ? this._seats[seatId]._win : this._seats[seatId]._lose;
                let label = win ? this._seats[seatId]._winNum : this._seats[seatId]._loseNum;
                label.string = win ? "+" + UStringHelper.getMoneyFormat(score) : UStringHelper.getMoneyFormat(score, -1);
                show.setPosition(0, -70);
                show.runAction(cc.moveTo(0.3, 0, 5));

                if (caller.GamePlayers[index].cbHandCardData !== []) {
                    AppGame.ins.zjhModel.update_fanpai(caller.GamePlayers[index].wUserId, caller.GamePlayers[index].cbHandCardData, caller.GamePlayers[index].cbHandCardType, AppGame.ins.zjhModel.getUISeatId(caller.GamePlayers[index].cbChairId));
                }
            }

            for (let index = 0; index < caller.GamePlayers.length; index++) {
                this._seats[AppGame.ins.zjhModel.getUISeatId(caller.GamePlayers[index].cbChairId)]._chipBg.active = true;
                this._seats[AppGame.ins.zjhModel.getUISeatId(caller.GamePlayers[index].cbChairId)]._chipCount.string = caller.GamePlayers[index].dTableJetton;
                if (caller.GamePlayers[index].bMingZhu) {
                    this._seats[AppGame.ins.zjhModel.getUISeatId(caller.GamePlayers[index].cbChairId)].seePai();
                }
                if (caller.GamePlayers[index].bGiveUp) {
                    this._seats[AppGame.ins.zjhModel.getUISeatId(caller.GamePlayers[index].cbChairId)].qipai();
                }
                if (caller.GamePlayers[index].bLost) {
                    this._seats[AppGame.ins.zjhModel.getUISeatId(caller.GamePlayers[index].cbChairId)].bipai_shu();
                }

            }

            this._opreate.showall(false);

            this.scheduleOnce(function () {
                this._opreate.showMatchBtn(true);
            }, 2)

        }

    }

    private show_exit_next(): void {
        if (AppGame.ins.currRoomKind == 2) {
            this._opreate._toggle_xjlc.isChecked = true;
        }
    }

    private reset_chip(): void {
        this._chipManager.reset();
        this._opreate.showMatchBtn(false);
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                element._paiAction.free();
                if(element.seatId == ZJH_SELF_SEAT){
                    element._paiAction._fapaiAct1.node.setScale(1.05);
                    element._paiAction._fapaiAct2.node.setScale(1.05);
                    element._paiAction._fapaiAct3.node.setScale(1.05);
                }
            }
        }
    }

    private get_comd():void{
        this._cmds = [];
        this._canGetCmd = true;

    }

    private self_bipaishu():void{
        this._seats[ZJH_SELF_SEAT].bipai_shu();
    }

    private self_qipai():void{
        this._seats[ZJH_SELF_SEAT].qipai();
    }

    private brash_chip(caller): void {
        let chips = new UIZJHChip();
        chips.items = [];
        chips.chipState = 0;
        for (let index = 0; index < caller.chips.length; index++) {
            for (let i = 0; i < caller.chips[index].count; i++) {
                let chip = AppGame.ins.zjhModel.getchipitems(0, caller.chips[index].chip);
                chips.items.push(chip);
            }
        }
        let len = chips.items.length;
        for (let i = 0; i < len; i++) {
            const element = chips.items[i];
            let seat = this._seats[element.seatId];
            let state = element.state;
            if (chips.chipState == 2) {
                state = 2;
            }
            this._chipManager.createChip(cc.v2(this.node.width / 2, this.node.height / 2), element.chipType, element.gold, 1, element.objId, state);
            // this._music.playbet(chips.chipState);
        }
    }

    private clearBattlePlayer(): void {
        for (const key in AppGame.ins.zjhModel._battleplayer) {
            AppGame.ins.zjhModel._battleplayer[key].auto = false;
            AppGame.ins.zjhModel._battleplayer[key].userTotal = 0;
            AppGame.ins.zjhModel._battleplayer[key].playTurn = 0;
            AppGame.ins.zjhModel._battleplayer[key].isturn = false;
            AppGame.ins.zjhModel._battleplayer[key].isFirst = false;
            AppGame.ins.zjhModel._battleplayer[key].auto = false;
            AppGame.ins.zjhModel._battleplayer[key].pai = [];
            AppGame.ins.zjhModel._battleplayer[key].cdtime = 0;
            AppGame.ins.zjhModel._battleplayer[key].userTotal = 0;
            AppGame.ins.zjhModel._battleplayer[key].paiXing = 0;
            AppGame.ins.zjhModel._battleplayer[key].nextXizhuCount = 0;
            AppGame.ins.zjhModel._battleplayer[key].paiState = EBattlePlayerPaiState.none;
        }
    }

    private reconnectResetUI(): void {
        let a = UNodeHelper.find(this.node, "uiroot/content/vs_node/node");
        a.active = false;
        if (this.cuoPai.active) {
            this.cuoPai.active = false;
        }

        this.scheduleOnce(function () {
            if (AppGame.ins.zjhModel._state == EZJHState.Gameing) {
                if (AppGame.ins.currRoomKind == 0 && AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId] &&  AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.qiPai) {
                    this._opreate.showMatchBtn(true);
                } else {
                    this._opreate.showMatchBtn(false);
                }
                this.men_pai(AppGame.ins.zjhModel._wLookCardMinTurnsRound);
                this._opreate.updateBtn();
            }
        }, 0.1)
    }

    private men_pai(a): void {
        if (AppGame.ins.currRoomKind == 2) {
            if (AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId] && AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.mengPai) {
                if (this.turn_number > a) {
                    this.menpai.active = false;
                    this.click_pai.active = true;
                } else {
                    this.menpai.active = true;
                    this.click_pai.active = false;
                }
            }
        }
    }

    /**
     * ????????????
     */
    private sc_ts_left(): void {
        this._cmds = [];
    }

    protected onEnable(): void {
        super.onEnable();
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_GUZHUYIZHI, this.sc_ts_guzhuyizhi, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_PLAYER_COMPARE, this.sc_ts_player_compare, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_SET_NEXT_TURN, this.sc_ts_set_next_turn, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_UPDATA_TOTAL_PLAYER_SCORE, this.sc_ts_updata_total_player_score, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_UPDATA_TOTAL_TURN, this.sc_ts_updata_total_turn, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_UPDATA_TOTAL_SCORE, this.sc_ts_updata_total_score, this);
        AppGame.ins.zjhModel.on(MZJH.SC_CZ_PUT_OUT_CHIP, this.sc_cz_put_out_chip, this);
        AppGame.ins.zjhModel.on(MZJH.CC_UPDATA_SEAT_INFO, this.seat_info, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_GAME_END, this.game_end, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_LOOK_PAI, this.look_pai, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_FAN_PAI, this.fan_pai, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_BIPAI_SHU, this.bipai_shu, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_SET_TURN_OVER, this.set_turn_over, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_REFRESH_CHIP, this.refresh_chip, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_UPDATA_TURN_TIME, this.updata_turn_time, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_FAPAI, this.ts_fapai, this);
        AppGame.ins.zjhModel.on(MZJH.CC_END_SELF_TURN, this.cc_end_self_turn, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_SET_ZHU, this.set_zhu, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_PLAYER_GIVE_UP, this.player_give_up, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_SET_GAME_FREE, this.set_game_free, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_CANCLE_MATCH, this.set_cancle_match, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_UPDATA_GAME_NUMBER, this.updata_game_number, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_FANGCHAOSHI, this.ts_fangchaoshi, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_START_MATCH, this.sc_ts_start_match, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_SHOW_MATCH, this.sc_ts_show_match, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_LEFT, this.sc_ts_left, this);
        AppGame.ins.zjhModel.on(MZJH.SHOW_PAI, this.show_pai, this);
        AppGame.ins.zjhModel.on(MZJH.SHOW_ANI, this.show_ani, this);
        AppGame.ins.zjhModel.on(MZJH.USSTAUTS_CHANGE, this.usstauts_change, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_FANPAI, this.update_fanpai, this);
        AppGame.ins.zjhModel.on(MZJH.SET_LIGHT, this.reconnentSetLightAngel, this);
        AppGame.ins.zjhModel.on(MZJH.SHOW_WAIT, this.show_wait, this);
        AppGame.ins.zjhModel.on(MZJH.SHOW_RESULT, this.show_result, this);
        AppGame.ins.zjhModel.on(MZJH.SHOW_EXIT_NEXT, this.show_exit_next, this);
        AppGame.ins.zjhModel.on(MZJH.RESET_CHIP, this.reset_chip, this);
        AppGame.ins.zjhModel.on(MZJH.BRASH_CHIP, this.brash_chip, this);
        AppGame.ins.zjhModel.on(MZJH.GET_CMD,this.get_comd,this);
        AppGame.ins.zjhModel.on(MZJH.SELF_BIPAISHU,this.self_bipaishu,this);
        AppGame.ins.zjhModel.on(MZJH.SELF_QIPAI,this.self_qipai,this);
        AppGame.ins.zjhModel.run();

    }

    protected onDisable(): void {
        super.onDisable();
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_GUZHUYIZHI, this.sc_ts_guzhuyizhi, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_PLAYER_COMPARE, this.sc_ts_player_compare, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_SET_NEXT_TURN, this.sc_ts_set_next_turn, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_UPDATA_TOTAL_PLAYER_SCORE, this.sc_ts_updata_total_player_score, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_UPDATA_TOTAL_TURN, this.sc_ts_updata_total_turn, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_UPDATA_TOTAL_SCORE, this.sc_ts_updata_total_score, this);
        AppGame.ins.zjhModel.off(MZJH.SC_CZ_PUT_OUT_CHIP, this.sc_cz_put_out_chip, this);
        AppGame.ins.zjhModel.off(MZJH.CC_UPDATA_SEAT_INFO, this.seat_info, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_GAME_END, this.game_end, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_LOOK_PAI, this.look_pai, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_FAN_PAI, this.fan_pai, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_BIPAI_SHU, this.bipai_shu, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_SET_TURN_OVER, this.set_turn_over, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_REFRESH_CHIP, this.refresh_chip, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_UPDATA_TURN_TIME, this.updata_turn_time, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_FAPAI, this.ts_fapai, this);
        AppGame.ins.zjhModel.off(MZJH.CC_END_SELF_TURN, this.cc_end_self_turn, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_SET_ZHU, this.set_zhu, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_PLAYER_GIVE_UP, this.player_give_up, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_SET_GAME_FREE, this.set_game_free, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_CANCLE_MATCH, this.set_cancle_match, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_UPDATA_GAME_NUMBER, this.updata_game_number, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_FANGCHAOSHI, this.ts_fangchaoshi, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_START_MATCH, this.sc_ts_start_match, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_SHOW_MATCH, this.sc_ts_show_match, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_LEFT, this.sc_ts_left, this);
        AppGame.ins.zjhModel.off(MZJH.SHOW_PAI, this.show_pai, this);
        AppGame.ins.zjhModel.off(MZJH.SHOW_ANI, this.show_ani, this);
        AppGame.ins.zjhModel.off(MZJH.USSTAUTS_CHANGE, this.usstauts_change, this);
        AppGame.ins.zjhModel.off(MZJH.SC_TS_FANPAI, this.update_fanpai, this);
        AppGame.ins.zjhModel.off(MZJH.SET_LIGHT, this.reconnentSetLightAngel, this);
        AppGame.ins.zjhModel.off(MZJH.SHOW_WAIT, this.show_wait, this);
        AppGame.ins.zjhModel.off(MZJH.SHOW_RESULT, this.show_result, this);
        AppGame.ins.zjhModel.off(MZJH.SHOW_EXIT_NEXT, this.show_exit_next, this);
        AppGame.ins.zjhModel.off(MZJH.RESET_CHIP, this.reset_chip, this);
        AppGame.ins.zjhModel.off(MZJH.BRASH_CHIP, this.brash_chip, this);
        AppGame.ins.zjhModel.off(MZJH.GET_CMD,this.get_comd,this);
        AppGame.ins.zjhModel.off(MZJH.SELF_BIPAISHU,this.self_bipaishu,this);
        AppGame.ins.zjhModel.off(MZJH.SELF_QIPAI,this.self_qipai,this);
        AppGame.ins.zjhModel.exit();
        this._music.stop();
    }

}
