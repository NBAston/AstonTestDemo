import UScene from "../../common/base/UScene";
import VZJHMenu_hy from "./VZJHMenu_hy";
import VZJHOperate_hy from "./VZJHOperate_hy";
import VZJHChipManager_hy from "./VZJHChipManager_hy";
import UNodeHelper from "../../common/utility/UNodeHelper";
import VZJHSeat_hy from "./VZJHSeat_hy";
import USpriteFrames from "../../common/base/USpriteFrames";
import { UIZJHPoker, UIZJHCompare, UIZJHChip, UIZJHNextTurn, EBattlePlayerPaiState, ZJHBattlePlayerInfo, UIZJHUpdateTurnTime, UZJHCmd, UIZJHChips, UIZJHUpdateSeatRoleInfo, UIZJHOverTurn, UIZJHFanPai, UIZJHBattleOver, UIZJHSetZHU, UIZJHOperate, EZJHState } from "./UZJHClass_hy";
import VZJHPKAction_hy from "./VZJHPKAction_hy";
import AppGame from "../../public/base/AppGame";
import MZJH_hy, { ZJH_SELF_SEAT, ZJH_TURN_COUNT_TO_COMPARE, ZJH_SCALE } from "./MZJH_hy";
import { RoomInfoHy } from "../../public/hall/URoomClass";
import UHandler from "../../common/utility/UHandler";
import VZJHMatch_hy from "./VZJHMatch_hy";
import MRoomModel from "../../public/hall/room_zjh/MRoomModel";
import { ECommonUI, ELevelType, EGameType, EEnterRoomErrCode, ETipType, EAgentLevelReqType, ERoomKind } from "../../common/base/UAllenum";
import ULanHelper from "../../common/utility/ULanHelper";
import { ToBattle } from "../../common/base/UAllClass";
import AppStatus from "../../public/base/AppStatus";
import UZJHMusic_hy from "./UZJHMusic_hy";
import UAudioRes from "../../common/base/UAudioRes";
import UStringHelper from "../../common/utility/UStringHelper";
import UGame from "../../public/base/UGame";
import UDebug from "../../common/utility/UDebug";
import { FZJH } from "../../common/cmd/proto";
import MHall, { NEWS } from "../../public/hall/lobby/MHall";
import UEventHandler from "../../common/utility/UEventHandler";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import { EventManager } from "../../common/utility/EventManager";
import ui_enter_room from "../../public/hall/friends/ui_enter_room";
import VOnlineGM from "../../public/hall/announce/VOnlineGM";
import UResManager from "../../common/base/UResManager";
import MZJH from "../zjh/MZJH";
import UDateHelper from "../../common/utility/UDateHelper";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";
import UAudioManager from "../../common/base/UAudioManager";



const { ccclass, property } = cc._decorator;
/**
 * 功能:sq
 * 作用:扎金花游戏
 */
@ccclass
export default class VZJH_hy extends UGame {

    @property(cc.Prefab) emojItem: cc.Prefab = null;
    @property(cc.Prefab) textItem: cc.Prefab = null;
    @property(cc.Toggle)
    cuoPaiToggle: cc.Toggle = null;

    @property(cc.Node)
    cuoPai: cc.Node = null;

    /**玩家节点 */
    private _playerNode: cc.Node;
    /**扑克牌节点 */
    private _pokerNode: cc.Node;
    /**状态flagnode */
    private _stataFlagNode: cc.Node;
    /**玩家筹码节点 */
    private _playerChipNode: cc.Node;
    /**主ui节点 */
    private _mainNode: cc.Node;
    /**菜单节点 */
    private _menuNode: cc.Node;
    /**加筹码节点 */
    private _addchipNode: cc.Node;
    /** 丢的筹码节点*/
    private _chipNode: cc.Node;
    /**玩家出牌时候的按钮节点 */
    private _myturn: cc.Node;
    /**游戏的各种特效节点 */
    private _fxNode: cc.Node;
    /**游戏中的文字节点 */
    private _lableNode: cc.Node;
    /**玩家筹码数量 */
    private _playerchipNode: cc.Node;

    private _pjbhgb: cc.Node;
    /**
     * 菜单
     */
    private _menu: VZJHMenu_hy;
    /**
     * 座位
     */
    private _seats: { [key: number]: VZJHSeat_hy };
    /**
     * 玩家操作
     */
    private _opreate: VZJHOperate_hy;
    /**
     * 筹码管理
     */
    private _chipManager: VZJHChipManager_hy;
    /**比较 */
    private _pkAction: VZJHPKAction_hy;
    /**当前筹码 */
    private _totoalCount: cc.Label;
    /**本局底注 */
    private _dizhu: cc.Label;
    /**本局顶注 */
    // private _dingzhu: cc.Label;
    /**本局编号 */
    private _bianhao: cc.Label;
    /**总共的论数 */
    private _totalLun: cc.Label;
    /**灯 */
    private _light: cc.Node;

    private _res: USpriteFrames;
    private _guzhuyizhi: sp.Skeleton;
    private _match: VZJHMatch_hy;
    /**命令队列 */
    private _cmds: Array<UZJHCmd>;
    /** 是否可以取命令*/
    private _canGetCmd: boolean;
    /**
     * 音乐播放器
     */
    private _music: UZJHMusic_hy;
    private _lightPos: { [key: number]: number };
    private _emergency_announcement: Array<string>;
    private _btn_charge: cc.Node;
    private _btn_pjbh: cc.Node;
    private _lab_bian_hao: cc.Label;
    private _enterMinScore: number;
    private _gf_chip_bg: cc.Node;
    private _gf_chip_bg2: cc.Node;

    /**邀请按钮 */
    private _invite_btn: cc.Node;
    /**准备按钮 */
    private _ready_btn: cc.Node;
    /**旁观按钮 */
    private _pause_btn: cc.Node;
    /**下局旁观按钮 */
    private _next_pause_btn: cc.Toggle;
    /**房间ID */
    private _room_number: cc.Node;
    /**实时战绩按钮 */
    private _record: cc.Node;
    /**聊天按钮 */
    private _chat: cc.Node;
    /**超时消息 */
    private _roundTimeLab: cc.Label;

    private _timeOutSeconds: number = -1; //超时剩余时间

    private _left_time: cc.Node;

    public left_time_seconds: number = 0; //牌局剩余时间

    _chatMain: cc.Node = null;

    private _btn_again: cc.Node;

    private _wait_ani: cc.Node;

    private _room_number_bg: cc.Node;

    private _hideTime = -1; //隐藏到后台的时候时间戳

    private play_already: boolean = false;

    // /**倒计时节点 */
    // private _djsNode: cc.Node;

    private _iswait: boolean = false;

    /**是否播放完动画*/
    private play_finised: boolean = false;

    /**是否播放完比牌动画*/
    public play_vs_finised: boolean = false;

    /**
     * 初始化
     */
    protected init(): void {
        this._music = new UZJHMusic_hy();
        /**初始化各种节点 */
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
        this._bianhao = UNodeHelper.getComponent(root, "top/zjh_pjbg/bianhao", cc.Label);
        this._totalLun = UNodeHelper.getComponent(this._lableNode, "lun", cc.Label);
        this._match = UNodeHelper.getComponent(root, "match_node", VZJHMatch_hy);
        this._match.init();
        // this._match.hide();
        this._res = this.node.getComponent(USpriteFrames);
        let topleft = UNodeHelper.find(root, "topleft");

        this._menu = new VZJHMenu_hy(topleft, this._menuNode, this._music);
        this._menu.showMenu(false);

        this._room_number = UNodeHelper.find(root, "room_number_bg/room_number");
        this._roundTimeLab = UNodeHelper.getComponent(root, "dismiss_bg/dismiss", cc.Label);

        let vsNode = UNodeHelper.find(root, "vs_node");
        let bp = UNodeHelper.find(root, "bipai");
        let vs = UNodeHelper.find(vsNode, "node");
        this._pkAction = vsNode.getComponent(VZJHPKAction_hy);
        this._pkAction.init(this, vs, bp, this._res);

        this._opreate = this._myturn.getComponent(VZJHOperate_hy);
        this._opreate.init(this, this._addchipNode);

        this._gf_chip_bg = UNodeHelper.find(root, "main/gf_chip_bg_1");
        this._gf_chip_bg2 = UNodeHelper.find(root, "main/gf_chip_bg_2");
        this._left_time = UNodeHelper.find(root, 'label_node/left_time');
        this._btn_again = UNodeHelper.find(root, 'btn_again');
        this._wait_ani = UNodeHelper.find(root, 'wait_ani');
        this._room_number_bg = UNodeHelper.find(root, 'room_number_bg');
        UEventHandler.addClick(this._room_number_bg, this.node, 'VZJH_hy', 'onCopyRoomId');

        this._btn_charge = UNodeHelper.find(root, 'players_node/seat_1/name/btn_charge');
        UEventHandler.addClick(this._btn_charge, this.node, 'VZJH_hy', 'intoCharge');

        /**初始化筹码控制器 */
        this._chipManager = new VZJHChipManager_hy(this._chipNode);
        this._btn_pjbh = UNodeHelper.find(this.node, "uiroot/content/top/zjh_pjbg");
        this._lab_bian_hao = UNodeHelper.getComponent(this.node, "uiroot/content/top/zjh_pjbg/bianhao", cc.Label);
        UEventHandler.addClick(this._btn_pjbh, this.node, "VZJH_hy", "oncopy");

        this._invite_btn = UNodeHelper.find(root, "btn_invite");
        this._ready_btn = UNodeHelper.find(root, "btn_ready");
        this._pause_btn = UNodeHelper.find(root, "btn_pause");
        this._next_pause_btn = UNodeHelper.getComponent(root, "next_pause_toggle", cc.Toggle);
        this._record = UNodeHelper.find(root, "btn_record");
        this._chat = UNodeHelper.find(root, "btn_chat");
        UEventHandler.addClick(this._invite_btn, this.node, "VZJH_hy", "inviteFriends");
        UEventHandler.addClick(this._ready_btn, this.node, "VZJH_hy", "clickReady");
        UEventHandler.addClick(this._pause_btn, this.node, "VZJH_hy", "clickPause");
        UEventHandler.addClick(this._record, this.node, "VZJH_hy", "clickRecord");
        UEventHandler.addClick(this._chat, this.node, "VZJH_hy", "clickChat");
        UEventHandler.addClick(this._btn_again, this.node, 'VZJH_hy', 'clickAgain');

        this.setHorseLampPos(0, 330);

        this.play_already = false;

        /**初始化位置 */
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
            let seat = new VZJHSeat_hy(idx, qipai, fapaiOri, st, score, pk, turn, flag, chip_bg, chip_count, fanpai, paixing, win, win2, this._res);
            this._seats[seat.seatId] = seat;
            seat._ok_node.active = false;
            seat.free();
        }
        this._chipNode.active = true;
        this._canGetCmd = true;
        this._cmds = [];
        this._lightPos = {};
        this._lightPos[0] = 45;
        this._lightPos[1] = -78;
        this._lightPos[2] = -106;
        this._lightPos[3] = 106;
        this._lightPos[4] = 78;
        this._light.active = false;
        this._mainNode.active = false;
        this._pjbhgb.active = false;

        this.play_vs_finised = false;
        //this._opreate.battleOver();
    }

    start() {
        // this.initChatPanel();

    }

    /**场景加载完毕之后 首先执行的函数 */
    openScene(data: any): void {
        // this._enterMinScore = data.roomData.enterMinScore;
        super.openScene(data);
        if (!this._init) {
            this._init = true;
            this.init();
        }

        if (data) {
            // let dt = data as ToBattle;
            // AppGame.ins.fzjhModel.saveRoomInfo(dt.roomData);
            // if (dt.roomData) {
            // this._dingzhu.string = "顶注:" + (dt.roomData.ceilScore * ZJH_SCALE).toString();
            // this._dizhu.string = "底注:" + (dt.roomData.floorScore).toString();
            // }
            this.waitbattle();
            this._canGetCmd = true;
        }
        this._music.playGamebg();
        this._chipManager.precreate();
        this.gamecloseUI();
        this.play_already = true;
        // this.defaultRequestEnterRoom();
    }
    /**
     * 展示选择比牌
     */
    selectCompare(compare: Array<number>): void {
        this._pkAction.selectCompare(compare);
    }

    /** 等待游戏开始*/
    waitbattle(): void {
        this._playerNode.active = true;
        this._ready_btn.active = true;
        this._invite_btn.active = true;
        this._pause_btn.active = true;
        this._record.active = true;
        // this._chat.active = true;
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                if (element.seatId != 0) {
                    element.free();
                }
            }
        }
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                if (element.seatId == 0) {
                    element.showbaseInfo(AppGame.ins.fzjhModel.getshowselfinfo());
                    if (this._btn_again.active == true) {
                        this.showBtns(false);
                        this._pause_btn.getComponent(cc.Button).interactable = false;
                    } else {
                        this.showBtns(true);
                        this._pause_btn.getComponent(cc.Button).interactable = true;
                    }

                    if (AppGame.ins.fzjhModel._roomInfo) {
                        if (AppGame.ins.fzjhModel._roomInfo.autoStart) {
                            UDebug.log('自动开始');
                            if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId]) {
                                if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.pangGuan) {
                                    this.showBtns(true);
                                    // this._pause_btn.getComponent(cc.Button).interactable = true;
                                } else if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.ready) {
                                    this._seats[ZJH_SELF_SEAT]._ok_node.active = true;
                                    this.showBtns(false);
                                } else if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.mengPai) {
                                    this._ready_btn.active = false;
                                    // this._pause_btn.active = false;
                                    this._pause_btn.getComponent(cc.Button).interactable = false;
                                    this._next_pause_btn.node.active = true;
                                    this._seats[ZJH_SELF_SEAT]._out_node.active = false;
                                    this._seats[ZJH_SELF_SEAT]._ok_node.active = false;
                                } else if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.none) {
                                    this._ready_btn.active = true;
                                    // this._pause_btn.active = false;
                                    this._pause_btn.getComponent(cc.Button).interactable = false;
                                } else {
                                    // this.showBtns(false);
                                    UDebug.log('玩家状态不正常');
                                }
                                if (AppGame.ins.fzjhModel.isPreDismiss) {
                                    this._ready_btn.active = true;
                                    this._pause_btn.active = true;
                                    this._pause_btn.getComponent(cc.Button).interactable = true;
                                    this._next_pause_btn.node.active = false;
                                }

                            }

                        } else {
                            if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId]) {
                                if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.pangGuan) {
                                    this.showBtns(true);
                                } else if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.ready) {
                                    this._seats[ZJH_SELF_SEAT]._ok_node.active = true;
                                    this.showBtns(false);
                                    this._pause_btn.getComponent(cc.Button).interactable = true;
                                } else if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.mengPai) {
                                    this._ready_btn.active = false;
                                    // this._pause_btn.active = false;
                                    this._pause_btn.getComponent(cc.Button).interactable = false;
                                } else if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.none) {
                                    this._ready_btn.active = true;
                                    // this._pause_btn.active = false;
                                    this._pause_btn.getComponent(cc.Button).interactable = true;
                                } else {
                                    // this.showBtns(false);
                                    UDebug.log('玩家状态不正常');
                                }
                            }
                        }
                    }
                } else {
                    for (const a in AppGame.ins.fzjhModel._battleplayer) {
                        if (AppGame.ins.fzjhModel._battleplayer[a].seatId != 0 && AppGame.ins.fzjhModel._battleplayer[a].seatId == element.seatId) {
                            element.showbaseInfo(AppGame.ins.fzjhModel._battleplayer[a]);
                            element._ok_node.active = false;
                        }
                    }
                }
            }
        }
        for (const key in AppGame.ins.fzjhModel._battleplayer) {
            if (!AppGame.ins.fzjhModel._battleplayer[key]) {
                return
            }
            if (AppGame.ins.fzjhModel._battleplayer[key].paiState == EBattlePlayerPaiState.pangGuan) {
                this._seats[AppGame.ins.fzjhModel._battleplayer[key].seatId]._out_node.getComponentInChildren(cc.Label).string = '旁观中';
                this._seats[AppGame.ins.fzjhModel._battleplayer[key].seatId]._out_node.getChildByName('OutSp').active = true;
                this._seats[AppGame.ins.fzjhModel._battleplayer[key].seatId]._ok_node.active = false;
            } else if (AppGame.ins.fzjhModel._battleplayer[key].paiState == EBattlePlayerPaiState.ready) {
                this._seats[AppGame.ins.fzjhModel._battleplayer[key].seatId]._out_node.getComponentInChildren(cc.Label).string = '已准备';
                this._seats[AppGame.ins.fzjhModel._battleplayer[key].seatId]._out_node.getChildByName('OutSp').active = false;
                this._seats[AppGame.ins.fzjhModel._battleplayer[key].seatId]._ok_node.active = true;
            } else if (AppGame.ins.fzjhModel._battleplayer[key].paiState == EBattlePlayerPaiState.none) {
                this._seats[AppGame.ins.fzjhModel._battleplayer[key].seatId]._out_node.getComponentInChildren(cc.Label).string = '';
                this._seats[AppGame.ins.fzjhModel._battleplayer[key].seatId]._out_node.getChildByName('OutSp').active = true;
                this._seats[AppGame.ins.fzjhModel._battleplayer[key].seatId]._ok_node.active = false;
            }
        }

        if (AppGame.ins.fzjhModel.isPreDismiss) {
            this._pause_btn.active = false;
            this._ready_btn.active = false;
            for (const key in AppGame.ins.fzjhModel._battleplayer) {
                if (!AppGame.ins.fzjhModel._battleplayer[key]) {
                    return
                }
                this._seats[AppGame.ins.fzjhModel._battleplayer[key].seatId]._out_node.getComponentInChildren(cc.Label).string = '';
                this._seats[AppGame.ins.fzjhModel._battleplayer[key].seatId]._out_node.getChildByName('OutSp').active = true;
                this._seats[AppGame.ins.fzjhModel._battleplayer[key].seatId]._ok_node.active = false;
            }
        }
        this._pjbhgb.active = false;
        this._light.active = false;
        this._bianhao.node.active = false;
        this.showgameinfo(false);
        this._light.active = false;
        // this._match.show();
        this._chipManager.reset();
        this._myturn.active = false;
        this._next_pause_btn.node.active = false;
    }

    //点击复制牌局信息
    private oncopy(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this._lab_bian_hao.string).substr(5, 30));
    }

    /**复制房号 */
    private onCopyRoomId() {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked(AppGame.ins.fzjhModel._roomInfo.roomId + '');
    }

    private intoCharge(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.hallModel.requestAgentLevel(EAgentLevelReqType.default);
    }

    /**获取到代理等级 */
    onAgentLevelRes(data: any) {
        if (AppGame.ins.hallModel.reqAgentLevelType != EAgentLevelReqType.default) return;
        if (!data || data.retCode != 0 || !data.hasOwnProperty('level')) {
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: false, index: 3 });
            return;
        }
        if (data.level >= 5) {
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: false, index: 2 });
        } else {
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: false, index: 3 });
        }
    }

    private propRun(userId: number, callback: any = null): void {
        for (let i = 0; i < 5; i++) {
            let player = this._seats[i.toString()];
            let bindUserId = player.prop.getComponent(GamePropManager).getBindUserId();
            if (bindUserId && (userId == bindUserId)) {
                callback && callback(player.prop);
            }
        }
    }

    private chatRun(userId: number, callback: any = null): void {
        for (let i = 0; i < 5; i++) {
            let player = this._seats[i.toString()];
            let bindUserId = player.chatProp.getComponent(VGameChatPropManager).getBindUserId();
            if (bindUserId && (userId == bindUserId)) {
                callback && callback(player.chatProp);
            }
        }
    }

    private showgameinfo(value: boolean): void {
        // this._dingzhu.node.active = value;
        // this._dizhu.node.active = value;
        // this._totoalCount.node.active = value;
        // this._totalLun.node.active = value;
    }
    private setlightAngel(seatId: number): void {
        this._light.active = true;
        this._light.setRotation(this._lightPos[seatId]);
    }
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

        //超时时间倒计时
        if (this._timeOutSeconds > 0) {
            this._timeOutSeconds -= dt;
            if (this._timeOutSeconds < 0) {
                this._timeOutSeconds = 0;
            }
            let second = Math.ceil(this._timeOutSeconds);
            this.setTimeOutTime(second);
        }

        if (AppGame.ins.fzjhModel._end_time) {
            let second = Math.ceil(this.left_time_seconds);
            this._left_time.getComponent(cc.Label).string = UDateHelper.secondsToTime(second, true);
        } else {
            if (AppGame.ins.fzjhModel.restart) {
                let second = Math.ceil(AppGame.ins.fzjhModel._roomInfo.allSeconds);
                this._left_time.getComponent(cc.Label).string = UDateHelper.secondsToTime(second, true);
            } else {
                if (AppGame.ins.fzjhModel._roomInfo) {
                    if (this.left_time_seconds > 0) {
                        this.left_time_seconds -= dt;
                        if (this.left_time_seconds < 0) {
                            this.left_time_seconds = 0;
                        }
                        let second = Math.ceil(this.left_time_seconds);
                        this._left_time.getComponent(cc.Label).string = UDateHelper.secondsToTime(second, true);
                        AppGame.ins.fzjhModel._roomInfo.leftSeconds = this.left_time_seconds;
                    }
                }

            }

        }


    }

    /**将命令压入等待处理队列 */
    protected pushcmd(cmd: string, dt: any, needwait: boolean): void {
        if (!this._cmds) this._cmds = [];
        let item = new UZJHCmd();
        item.cmd = cmd;
        item.data = dt;
        item.needwait = needwait;
        this._cmds.push(item);

    }
    /**取命令 */
    protected getcmd(): UZJHCmd {
        if (this._cmds.length > 0) {
            let len = this._cmds.length;
            let dt = this._cmds.shift();
            return dt;
        }
        return null;
    }
    /**处理消息队列 */
    private docmd(cmd: UZJHCmd): void {
        switch (cmd.cmd) {
            case "reconnect_no_gameing":
                this.do_reconnect_no_gameing();
                break;
            case "seat_info":
                this.seat_info(cmd.data);
                break;
            case "guzhuyizhi":
                this.do_guzguyizhi(cmd.data);
                break;
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
            case "player_ready":
                this.do_player_ready(cmd.data);
                break;
            case "player_pause":
                this.do_player_pause(cmd.data);
                break;
            case "show_next_pause":
                this.do_next_pause();
                break;
            case "player_next_pause":
                this.do_player_next_pause(cmd.data);
                break;
        }
    }
    private do_reconnect_no_gameing(): void {
        this._opreate.fromeDisconnect(true);
        this.waitbattle();
        this._match.hide();
        this._opreate.showMatch();
        this._pkAction.battleOver();
        AppGame.ins.fzjhModel.resetGameState();
    }
    /**vs动画播放完毕 */
    pkActionOver(lst: number, rst: number): void {
        this._seats[lst].bipai(false);
        this._seats[rst].bipai(false);
        this.scheduleOnce(() => {
            this._canGetCmd = true;
        }, 0.01);
    }
    private do_player_ready(caller: any): void {
        if (caller == ZJH_SELF_SEAT) {
            this.showBtns(false);
            // AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].userStatus = 4;
            AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState = EBattlePlayerPaiState.ready;
        }
        this._seats[caller]._out_node.getChildByName("label").getComponent(cc.Label).string = "已准备";
        this._seats[caller]._out_node.getChildByName('OutSp').active = false;
        this._seats[caller]._ok_node.active = true;
    }
    private do_player_pause(caller: any): void {
        if (caller == ZJH_SELF_SEAT) {
            this.showBtns(true);
            AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState = EBattlePlayerPaiState.pangGuan;
        }
        this._seats[caller]._out_node.getChildByName('OutSp').active = true;
        this._seats[caller]._out_node.getChildByName("label").getComponent(cc.Label).string = "旁观中";
        this._seats[caller]._ok_node.active = false;
        this._seats[caller].stopcd();
        // this._seats[caller].bipai(false);
    }
    private do_next_pause(): void {
        // this._pause_btn.active = false;
        // this._next_pause_btn.node.active = true;

    }
    private do_player_next_pause(caller: any): void {
        if (caller[1] == true) {
            this._seats[caller[0]]._out_node.active = true;
            this._seats[caller[0]]._out_node.getChildByName('OutSp').active = true;
            this._seats[caller[0]]._out_node.getChildByName("label").getComponent(cc.Label).string = "旁观中";
        } else {
            return
        }
    }
    private do_cancel_mathc(caller: boolean): void {
        if (caller) {
            this._opreate.showMatchBtn(true);
            this._match.hide();
        } else {
            // this._match.show();
        }
    }
    private do_start_match(sucess: boolean): void {
        if (sucess) {
            // this.waitbattle();
        } else {
            this._opreate.showMatch();
        }
    }
    private do_show_match(): void {
        this._opreate.showMatch();
    }
    private do_fan_pai(caller: UIZJHFanPai): void {
        this._canGetCmd = true;
        let seat = this._seats[caller.seatId];
        if (caller.playPos == 0) this._music.playKanPai(seat.sex);
        seat.fanpai(caller.poker, caller.withAnimation, UHandler.create(() => {

            if (caller.playPos == 0) this._music.playPaiXing(caller.poker.pokerType);
        }, this));
    }
    private do_bipai_shu(caller: number): void {
        let seat = this._seats[caller];
        if (caller == ZJH_SELF_SEAT) {
            this._opreate.showMatchBtn(true);
            this.cuoPaiToggle.node.active = false;
            AppGame.ins.fzjhModel._state = EZJHState.Watching;
        }
        seat.bipai_shu();
    }
    private do_free_scene(): void {
        this._totalLun.string = "第1/20轮";
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                // element.free();
            }
        }
        this._totoalCount.string = "";
        this._light.active = false;

    }
    private do_give_up(caller): void {
        this._canGetCmd = true;
        let seat = this._seats[AppGame.ins.fzjhModel._battleplayer[caller.wGiveUpUser].seatId];
        seat.qipai();
        this._music.playQiPai(seat.sex);
        if (AppGame.ins.fzjhModel._battleplayer[caller.wGiveUpUser].seatId == ZJH_SELF_SEAT) {
            this._opreate._toggle_xjlc.node.active = false;
            AppGame.ins.fzjhModel._state = EZJHState.Watching;
            this._opreate.showall(false);
            this.cuoPaiToggle.node.active = false;
        }

    }
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
    private do_fapai(): void {
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                if (!element.isFree) {
                    if (element._out_node.getChildByName("label").getComponent(cc.Label).string == "" || element._out_node.getChildByName("label").getComponent(cc.Label).string == "旁观中") {
                        this._canGetCmd = true;
                        return
                    } else {
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
        }
        this._music.playfapai();
    }
    /**播放比牌動畫 */
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
    /**播放游戲機結束 */
    private do_game_end(caller: UIZJHBattleOver): void {
        this._canGetCmd = true;
        this._light.active = false;
        this._seats[0]._clickPai.active = false;
        this._pause_btn.active = false;
        this._next_pause_btn.node.active = false;
        // this._opreate.clearDesk();
        this._pkAction.battleOver();
        let a = 0;
        let b = 0;
        let c = false;
        for (const key in caller.statics) {
            if (caller.statics.hasOwnProperty(key)) {
                let element = caller.statics[key];
                if (!element.uipoker) {
                    a = a + 1;
                }
                b = b + 1;
            }
        }
        if (b == (a + 1)) {
            c = true;
        }

        for (const key in caller.statics) {
            if (caller.statics.hasOwnProperty(key)) {
                let element = caller.statics[key];
                let pl = this._seats[element.seatId];
                pl.setScore(element.lastscore);
                pl.result(caller.winseatId == pl.seatId, element.getScore);
                // if(!c){
                if (element.uipoker) {
                    if (pl.seatId == ZJH_SELF_SEAT) {
                        if (element.paistate == EBattlePlayerPaiState.qiPai || element.paistate == EBattlePlayerPaiState.kanPai || element.paistate == EBattlePlayerPaiState.qiPai) {
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
                // }

            }
        }
        this._ready_btn.active = false;
        let seat = this._seats[caller.winseatId];
        this._chipManager.moveTo(seat.getSeatWordPos(), 0.5);
        this._music.playflyCoin();
        this._opreate.node.active = false;
        if (AppGame.ins.fzjhModel.roomInfo.autoStart) {
            this.scheduleOnce(function () {
                AppGame.ins.fzjhModel._state = EZJHState.Gameing;
                seat.closewinfx();

                this._totalLun.string = "";
                this._totoalCount.string = "";
                this._next_pause_btn.isChecked = false;
                this.waitbattle();
            }, 2)

        } else {
            this.scheduleOnce(function () {
                AppGame.ins.fzjhModel._state = EZJHState.Match;
                seat.closewinfx();
                this._totalLun.string = "";
                this._totoalCount.string = "";
                this._next_pause_btn.isChecked = false;
                this.waitbattle();
            }, 4)
        }

        // }

    }
    /**播放看牌效果 */
    private do_look_pai(caller: number): void {

        let seat = this._seats[caller];
        seat.seePai();
        if (seat.seatId != ZJH_SELF_SEAT)
            this._music.playKanPai(seat.sex);

    }
    /**播放孤注一擲效果 */
    private do_guzguyizhi(caller: any): void {
        this._guzhuyizhi.node.active = true;
        this._guzhuyizhi.setAnimation(0, "gzyz", false);
        this._guzhuyizhi.setCompleteListener(() => {
            this._canGetCmd = true;
            this._guzhuyizhi.node.active = false;
        });
        let seat = this._seats[caller];
        this._music.playGuzhuyizhi(seat.sex);
    }
    /**設置玩家信息 */
    private seat_info(caller: { [key: number]: ZJHBattlePlayerInfo }): void {
        this.showgameinfo(true);
        // this._match.hide();
        this._mainNode.active = true;
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                let data = caller[element.seatId];
                if (data) {
                    element.bind(data);
                } else {
                    element.free();
                }
            }
        }
        let self = caller[ZJH_SELF_SEAT];
        if (self.isturn) {
            this._opreate.intoSelfturn(self.auto);

        } else {

            this._opreate.intoOtherTurn(false);
        }

        this._opreate.setFangChaoShi(self.fangchaoshi);
        this._opreate.showMatchBtn(false);
    }
    /**創建籌碼 */
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
    /**設置下一個玩家説話 */
    private next_turn(caller: UIZJHNextTurn): void {
        let seat = this._seats[caller.seatId];
        seat.enterTurn(caller.cdtime);
        if (caller.seatId == ZJH_SELF_SEAT) {
            this._opreate.intoSelfturn(caller.auto);
        }
        this.setlightAngel(caller.seatId);
    }
    /**更新分數 */
    private player_score(caller: UIZJHUpdateSeatRoleInfo): void {
        this._seats[caller.seatId].updateScore(caller.score, caller.usetotal);
    }
    /**更遜論述 */
    private total_turn(turn: number): void {
        this._totalLun.string = "第" + turn.toString() + "/20轮";
        this._myturn.active = true;
        if (turn !== 0) {
            this._match.hide();
        }
        if(AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.mengPai || AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.kanPai){
            this._opreate.showall(true);
        }else{
            this._opreate.showall(false);
        }
    }
    /**更新分數 */
    private total_score(score: number): void {
        this._totoalCount.string = "总注: " + (score * ZJH_SCALE).toString();
    }
    /**説話結束 */
    private turn_over(data: UIZJHOverTurn): void {
        this._seats[data.seatId].leaveTurn();
        if (data.seatId == ZJH_SELF_SEAT) {
            this._opreate.intoOtherTurn(data.auto);
            this._pkAction.hideCompareUI();
        }
    }
    /** 刷新玩家看到的籌碼*/
    private do_refresh_chip(caller: UIZJHOperate): void {
        this._opreate.updateChip(caller);
    }
    /**玩家更新伦的时间 */
    private turn_time(caller: UIZJHUpdateTurnTime): void {
        this._seats[caller.seatId].updateturnTime(caller.leftTime);
    }
    //#region  消息处理 将消息压入消息队列
    /**
     * 
     * @param caller 
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
    private player_ready(caller: any): void {
        this.pushcmd("player_ready", caller, false);
    }
    private player_pause(caller: any): void {
        this.pushcmd("player_pause", caller, false);
    }
    private show_next_pause(caller: any): void {
        this.pushcmd("show_next_pause", caller, false);
    }
    private player_next_pause(caller: any): void {
        this.pushcmd("player_next_pause", caller, false);
    }

    private update_room_number(caller: any): void {
        this.left_time_seconds = AppGame.ins.fzjhModel._roomInfo.leftSeconds;
        UDebug.error("000000")
        this._chat.active = !AppGame.ins.fzjhModel.roomInfo.bChatLimit;
        this._room_number.getComponent(cc.Label).string = "" + caller;
        if (AppGame.ins.roleModel.useId == AppGame.ins.fzjhModel._roomInfo.roomUserId) {
            this._btn_charge.active = true;
        } else {
            this._btn_charge.active = false;
        }
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

    private receive_message(caller: any): void {
        let seatId = AppGame.ins.fzjhModel.getUISeatId(caller.sendChairId);
        let message = caller.message;
        let faceId = caller.faceId;
        this._seats[seatId]._chat.removeAllChildren();
        let item = null;
        if (faceId != -1) {
            item = cc.instantiate(this.emojItem);
            let emojSp = UNodeHelper.getComponent(item, "emoj_item_img", cc.Sprite);
            let emojUrl = "common/texture/game_chat/game_chat_emoj/game_emoj_" + faceId;
            UResManager.loadUrl(emojUrl, emojSp);
            if (seatId == 1) {
                item.scaleX = -1;
                emojSp.node.scaleX = -1.25;
            } else if (seatId == 2) {
                item.scaleX = -1;
                emojSp.node.scaleX = -1.25;
            } else {
                item.scaleX = 1;
                emojSp.node.scaleX = 1.25;
            }

        } else if (message.length > 0) {
            item = cc.instantiate(this.textItem);
            if (seatId == 1) {
                item.getComponent("VGameChatItem").setChatItemContent(message, true);
            } else if (seatId == 2) {
                item.getComponent("VGameChatItem").setChatItemContent(message, true);
            } else {
                item.getComponent("VGameChatItem").setChatItemContent(message, false);
            }
            // item.getComponent("VGameChatItem").setChatItemContent(message,(seatId == 3 || 4) ? true:false);
        }
        item.setPosition(cc.v2(0, 0));
        this.scheduleOnce(() => {
            item.active = false;
        }, 1.5)
        this._seats[seatId]._chat.addChild(item);
    }

    private update_dizhu(data): void {
        this._dizhu.string = "底分:" + data;
        if (AppGame.ins.fzjhModel._roomInfo.leftSeconds < 0) {
            this._left_time.getComponent(cc.Label).string = UDateHelper.secondsToTime(AppGame.ins.fzjhModel._roomInfo.allSeconds, true);
        } else {
            this._left_time.getComponent(cc.Label).string = UDateHelper.secondsToTime(AppGame.ins.fzjhModel._roomInfo.leftSeconds, true);
        }

    }

    private time_out(caller): void {
        this.setTimeOutTime(caller.idleLeave);
        this._roundTimeLab.node.parent.active = true;
        this._timeOutSeconds = caller.idleLeave;
    }

    private usstauts_change(data1, data2): void {

        if (!AppGame.ins.fzjhModel._battleplayer[data1]) {
            return
        }
        if (data2 == 6 && data1 !== AppGame.ins.roleModel.useId) {
            if (AppGame.ins.fzjhModel.state !== EZJHState.Gameing) {
                if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.qiPai || AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.biPaiShu || AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.mengPai) {
                    this._seats[AppGame.ins.fzjhModel._battleplayer[data1].seatId]._out_node.active = true;
                    this._seats[AppGame.ins.fzjhModel._battleplayer[data1].seatId]._out_node.getChildByName('OutSp').active = true;
                    this._seats[AppGame.ins.fzjhModel._battleplayer[data1].seatId]._out_node.getChildByName("label").getComponent(cc.Label).string = "";
                } else {
                    if(AppGame.ins.fzjhModel._battleplayer[data1].paiState == EBattlePlayerPaiState.none || AppGame.ins.fzjhModel._battleplayer[data1].paiState == EBattlePlayerPaiState.pangGuan || AppGame.ins.fzjhModel._battleplayer[data1].paiState == EBattlePlayerPaiState.ready){
                        this._seats[AppGame.ins.fzjhModel._battleplayer[data1].seatId].free();
                        this._seats[AppGame.ins.fzjhModel._battleplayer[data1].seatId]._ok_node.active = false;
                        delete AppGame.ins.fzjhModel._battleplayer[data1];
                    }
                    if(AppGame.ins.fzjhModel._battleplayer[data1] && (AppGame.ins.fzjhModel._battleplayer[data1].paiState == EBattlePlayerPaiState.ready || AppGame.ins.fzjhModel._battleplayer[data1].paiState == EBattlePlayerPaiState.none)&& AppGame.ins.fzjhModel.state == EZJHState.Match){
                        this._seats[AppGame.ins.fzjhModel._battleplayer[data1].seatId].free();
                        delete AppGame.ins.fzjhModel._battleplayer[data1];
                    }

                }

            } else {
                if (AppGame.ins.fzjhModel._battleplayer[data1]) {
                    if (AppGame.ins.fzjhModel._battleplayer[data1].paiState == EBattlePlayerPaiState.pangGuan || AppGame.ins.fzjhModel._battleplayer[data1].paiState == EBattlePlayerPaiState.none || AppGame.ins.fzjhModel._battleplayer[data1].paiState == EBattlePlayerPaiState.ready) {
                        if (this._seats[AppGame.ins.fzjhModel._battleplayer[data1].seatId]) {
                            this._seats[AppGame.ins.fzjhModel._battleplayer[data1].seatId].free();
                            this._seats[AppGame.ins.fzjhModel._battleplayer[data1].seatId]._ok_node.active = false;
                            delete AppGame.ins.fzjhModel._battleplayer[data1];
                        }
                    } else {
                        this._seats[AppGame.ins.fzjhModel._battleplayer[data1].seatId]._out_node.active = true;
                        this._seats[AppGame.ins.fzjhModel._battleplayer[data1].seatId]._out_node.getChildByName('OutSp').active = true;
                        this._seats[AppGame.ins.fzjhModel._battleplayer[data1].seatId]._out_node.getChildByName("label").getComponent(cc.Label).string = "";
                    }
                }
            }
            // AppGame.ins.showTips("玩家" + data1 + "已经离开房间");
        }
    }

    private stauts_change(data): void {

        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (AppGame.ins.fzjhModel.getbattleplayerbyChairId(index)) {
                let a = AppGame.ins.fzjhModel.getbattleplayerbyChairId(index).userId;
                let b = AppGame.ins.fzjhModel.getbattleplayerbyChairId(index).seatId;
                // AppGame.ins.fzjhModel._battleplayer[a].auto = false;
                // AppGame.ins.fzjhModel._battleplayer[a].userTotal = 0;
                // AppGame.ins.fzjhModel._battleplayer[a].playTurn = 0;
                // AppGame.ins.fzjhModel._battleplayer[a].isturn = false;
                // AppGame.ins.fzjhModel._battleplayer[a].isFirst = false;
                // AppGame.ins.fzjhModel._battleplayer[a].auto = false;
                // AppGame.ins.fzjhModel._battleplayer[a].pai = [];
                // AppGame.ins.fzjhModel._battleplayer[a].cdtime = 0;
                // AppGame.ins.fzjhModel._battleplayer[a].userTotal = 0;
                // AppGame.ins.fzjhModel._battleplayer[a].paiXing = 0;
                // AppGame.ins.fzjhModel._battleplayer[a].nextXizhuCount = 0;
                if (element == 7) {
                    AppGame.ins.fzjhModel._battleplayer[a].paiState = EBattlePlayerPaiState.pangGuan;
                } else if (element == 0) {
                    this.schedule(function(){
                        if(AppGame.ins.fzjhModel.state == EZJHState.Match){
                            this._seats[b].free();
                            this._seats[b]._ok_node.active = false;
                            delete AppGame.ins.fzjhModel._battleplayer[a];
                            this.unscheduleAllCallbacks();
                        }
                    },0.1)

                    // this.scheduleOnce(function () {
                    //     let c = 0;
                    //     for (const key in AppGame.ins.fzjhModel._battleplayer) {

                    //         if (AppGame.ins.fzjhModel._battleplayer[key].userId == a) {
                    //             c = 1;
                    //         }
                    //     }
                    //     if (a == 0) {
                    //         this._seats[b].free();
                    //     }
                    // }, 5.5)
                } else if (element == 3) {
                    AppGame.ins.fzjhModel._battleplayer[a].paiState = EBattlePlayerPaiState.none;
                    this._seats[b]._ok_node.active = false;
                } else if (element == 4) {
                    AppGame.ins.fzjhModel._battleplayer[a].paiState = EBattlePlayerPaiState.ready;
                }
                // if(AppGame.ins.fzjhModel.isPreDismiss){
                //     // AppGame.ins.fzjhModel._battleplayer[a].paiState = EBattlePlayerPaiState.none;
                //     for(const key in this._seats){
                //         this._seats[key]._ok_node.active = false;
                //         this._seats[key]._out_node.active = false;
                //         this._seats[key]._out_node.getChildByName("label").getComponent(cc.Label).string = "";
                //     }

                // }
            }

        }

    }

    private show_next_pause_ischeck(data): void {
        // this._next_pause_btn.isChecked = true;
        if (AppGame.ins.fzjhModel._battleplayer[data]) {
            if (AppGame.ins.fzjhModel._battleplayer[data].seatId == ZJH_SELF_SEAT) {
                this._next_pause_btn.isChecked = true;
            }
        }
    }

    /**收到房主点击再来一轮的消息 */
    private play_again(caller): void {
        this._room_number.getComponent(cc.Label).string = "" + AppGame.ins.fzjhModel.roomInfo.roomId;

        if (caller.userId == AppGame.ins.fzjhModel.roomInfo.roomUserId && AppGame.ins.fzjhModel._roomInfo.roomUserId == AppGame.ins.roleModel.useId) {
            // AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState = EBattlePlayerPaiState.none;
            for (const key in this._seats) {
                if (this._seats.hasOwnProperty(key)) {
                    const element = this._seats[key];
                    element._out_node.getChildByName('OutSp').active = true;
                    element._out_node.getChildByName('label').getComponent(cc.Label).string = '';
                    element._ok_node.active = false;
                }
            }
            this._btn_again.active = false;
            this.showBtns(true);

        } else if (caller.userId == AppGame.ins.fzjhModel.roomInfo.roomUserId && AppGame.ins.fzjhModel._roomInfo.roomUserId !== AppGame.ins.roleModel.useId) {
            AppGame.ins.showTips("房主决定再来一轮");
            // AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState = EBattlePlayerPaiState.none;
            for (const key in this._seats) {
                if (this._seats.hasOwnProperty(key)) {
                    const element = this._seats[key];
                    element._out_node.getChildByName('OutSp').active = true;
                    element._out_node.getChildByName('label').getComponent(cc.Label).string = '';
                    element._ok_node.active = false;
                }
            }
            this._btn_again.active = true;
            // this._pause_btn.active = false;

            // this.showBtns(false);
        } else if (caller.userId == AppGame.ins.roleModel.useId && AppGame.ins.roleModel.useId !== AppGame.ins.fzjhModel._roomInfo.roomUserId) {
            this._btn_again.active = false;
            // AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState = EBattlePlayerPaiState.none;
            this.showBtns(true);
        }
        this._wait_ani.active = false;

        this._chat.active = !AppGame.ins.fzjhModel.roomInfo.bChatLimit;

        
        this._record.active = true;
        // this.waitbattle();

    }

    /**收到房主预结算的消息 */
    private show_again(): void {
        for (const key in this._seats) {
            this._seats[key]._ok_node.active = false;
            this._seats[key]._out_node.active = true;
            this._seats[key]._out_node.getComponentInChildren(cc.Label).string = '';
            this._seats[key]._out_node.getChildByName('OutSp').active = true;
        }
        if (AppGame.ins.fzjhModel.clickAgain) {

            if (AppGame.ins.roleModel.useId == AppGame.ins.fzjhModel.roomInfo.roomUserId) {
                this.scheduleOnce(function () {
                    this._btn_again.active = true;
                }, 7)

                // this._pause_btn.active = false;
                this._ready_btn.active = false;
                this._next_pause_btn.node.active = false;
            } else {
                this.scheduleOnce(function () {
                    this._btn_again.active = true;
                    AppGame.ins.fzjhModel.clickAgain = false;
                }, 7)

                // this._pause_btn.active = false;
                this._ready_btn.active = false;
                this._next_pause_btn.node.active = false;
            }
            this._wait_ani.active = false;
        } else {
            if (AppGame.ins.roleModel.useId == AppGame.ins.fzjhModel.roomInfo.roomUserId) {
                if (AppGame.ins.fzjhModel._state == EZJHState.Wait) {
                    this.scheduleOnce(function () {
                        this._btn_again.active = true;
                        // this.showBtns(false);
                        // this._pause_btn.active = false;
                        this._ready_btn.active = false;
                        this._next_pause_btn.node.active = false;
                    }, 7)
                } else {
                    this._btn_again.active = true;
                    // this.showBtns(false);
                    // this._pause_btn.active = false;
                    this._ready_btn.active = false;
                    this._next_pause_btn.node.active = false;
                }

            } else {
                if (AppGame.ins.fzjhModel._state == EZJHState.Wait) {
                    this.scheduleOnce(function () {
                        this._btn_again.active = false;
                        // this.showBtns(false);
                        // this._pause_btn.active = false;
                        this._ready_btn.active = false;
                        this._next_pause_btn.node.active = false;
                    }, 7)
                } else {
                    this._btn_again.active = false;
                    // this.showBtns(false);
                    // this._pause_btn.active = false;
                    this._ready_btn.active = false;
                    this._next_pause_btn.node.active = false;
                }

            }
            if (AppGame.ins.fzjhModel._state == EZJHState.Wait) {
                this.scheduleOnce(function () {
                    this._wait_ani.active = true;
                }, 7)
            } else {
                this._wait_ani.active = true;
            }

        }
        this.scheduleOnce(function () {
            for (const key in AppGame.ins.fzjhModel._battleplayer) {
                AppGame.ins.fzjhModel._battleplayer[key].paiState = EBattlePlayerPaiState.none;
            }
        }, 6)



    }

    private show_pause(): void {
        for (const key in AppGame.ins.fzjhModel._battleplayer) {
            if (AppGame.ins.fzjhModel._battleplayer[key].paiState == EBattlePlayerPaiState.none && AppGame.ins.fzjhModel._battleplayer[key] == AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId]) {
                this._pause_btn.active = true;
                this._next_pause_btn.node.active = false;
            }
        }
        // paiState = EBattlePlayerPaiState.none;
    }

    private click_ready(): void {
        if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.none) {
            this.scheduleOnce(function () {
                this.clickReady();

            }, 0.1)
        }
    }


    /**设置超时时间 */
    setTimeOutTime(seconds: number) {

        this._roundTimeLab.string = '自动解散:' + UDateHelper.secondsToTime(seconds, false);

        if (seconds > 600 || (AppGame.ins.fzjhModel._roomInfo && seconds > AppGame.ins.fzjhModel._roomInfo.leftSeconds && AppGame.ins.fzjhModel._roomInfo.leftSeconds >= 0)) {
            this._roundTimeLab.node.parent.opacity = 0;
        } else {
            this._roundTimeLab.node.parent.opacity = 255;
        }
    }

    private m_nBack: number = 0
    private m_tmpClockTime: number = 0;
    /**倒计秒数 */
    private _clockTime: number = 0;

    /**
 * 游戏切换到后台
 * @param isHide 是否切在后台
 */
    onGameToBack(isBack: boolean) {
        //处理自动解散时间、房间时间
        if (isBack) {
            this._hideTime = new Date().getTime();
        } else {
            let nowTime = new Date().getTime();
            if (this._hideTime > 0) {
                let diffSeconds = (nowTime - this._hideTime) / 1000;
                for (const key in AppGame.ins.fzjhModel._battleplayer) {
                    if (AppGame.ins.fzjhModel._battleplayer[key].isturn) {
                        this._seats[AppGame.ins.fzjhModel._battleplayer[key].seatId]._cdTime -= diffSeconds;
                    }
                }
                this._timeOutSeconds -= diffSeconds;
                this.left_time_seconds -= diffSeconds;
                this._hideTime = -1;
            }
        }

        //倒计时逻辑
        if (isBack == true) {
            this.m_nBack = new Date().getTime() / 1000
            this.m_tmpClockTime = this._clockTime;

        } else if (this._clockTime > 0 && !this._iswait) {
            let disTime = Math.round(new Date().getTime() / 1000 - this.m_nBack)
            if (disTime > this.m_tmpClockTime) //如果当前局结束
            {
                this.onDjsEvent(0);
            } else if (this.m_tmpClockTime > disTime) {
                this._clockTime = this.m_tmpClockTime - disTime;
            }
        } else {
            this.onDjsEvent(0);
        }

        if (!isBack) {
            // if(this.play_vs_finised){
                this._pkAction.battleOver();
                let a = UNodeHelper.find(this.node,"uiroot/content/vs_node/node");
                a.active = false;
            // }
            if (this.cuoPai.active) {
                this.cuoPai.active = false;
            }

            this._cmds = [];
            this._canGetCmd = false;
            this.unscheduleAllCallbacks();
            
            UDebug.error("this._cmds.length====" + this._cmds.length);
            this._guzhuyizhi.node.active = false;
            AppGame.ins.fzjhModel.on_back = isBack;
            AppGame.ins.fzjhModel.sendFreshGameScene();
            UDebug.error("this._cmds.length====" + this._cmds.length);

            // this.scheduleOnce(function(){
            //     UDebug.error(AppGame.ins.fzjhModel._state)
            //     if(AppGame.ins.fzjhModel._state == EZJHState.Watching){
            //         AppGame.ins.roomModel.requestEnterRoomFriend(AppGame.ins.fzjhModel.roomInfo.roomId);
            //     }
            // },0.1)

        } else {
            this._cmds = [];
            this._canGetCmd = false;
        }
    }

        private show_empty(): void {
        this._playerNode.active = false;
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                element._ok_node.active = false;
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
        this._totalLun.string = "第0/20轮";
        this._totoalCount.string = "总注:0";
        this._fxNode.active = false;
        this._pokerNode.active = false;
        this._playerchipNode.active = false;
    }

    private chat_limit(bLimit: boolean): void {
        UDebug.error("33333333333")
        this._chat.active = !bLimit;
    }

    private reconnect_hide(): void {
        this._ready_btn.active = false;
        this._pause_btn.active = false;
    }

    private update_fanpai(caller: FZJH.CMD_S_LookCard): void {
        // this.update_fanpai(caller.wLookCardUser, caller.cbCardData, caller.cbCardType, 0);
        if (this.cuoPaiToggle.isChecked) {

        } else {
            AppGame.ins.fzjhModel.update_fanpai(caller.wLookCardUser, caller.cbCardData, caller.cbCardType, 0);
        }
    }

    private reconnentSetLightAngel(caller): void {
        this.setlightAngel(AppGame.ins.fzjhModel._battleplayer[caller.wCurrentUser].seatId);
    }

    private do_gamescene_free(caller): void {

        this._chipManager.reset();
        // this._opreate.showall(false);
        AppGame.ins.fzjhModel._state = EZJHState.Match;
        this._totalLun.string = "";
        this._totoalCount.string = "";
        this._next_pause_btn.isChecked = false;
        this.waitbattle();
        if(AppGame.ins.fzjhModel._state == EZJHState.Match){
            AppGame.ins.fzjhModel.update_seat_info();
        }
    }

    private do_show_result(caller): void {

        if(!this.play_already){
            this.play_already = true;
            this._light.active = false;
            this._chipManager.reset();
            for (const key in this._seats) {
                this._seats[key].stopcd();
                // this._seats[key]._pokerRoot.active = true;
            }

            //更新玩家分数
            for (let index = 0; index < caller.gameEndInfo.pEndUserInfo.length; index++) {
                for (const key in AppGame.ins.fzjhModel._battleplayer) {
                    if (AppGame.ins.fzjhModel._battleplayer[key].userId == caller.gameEndInfo.pEndUserInfo[index].dUserId) {
                        AppGame.ins.fzjhModel._battleplayer[key].score = caller.gameEndInfo.pEndUserInfo[index].dUserScore;
                    }
                }
            }
            // AppGame.ins.fzjhModel.update_seat_info();

            for (let index = 0; index < caller.GamePlayers.length; index++) {
                this._seats[AppGame.ins.fzjhModel.getUISeatId(caller.GamePlayers[index].cbChairId)]._chipBg.active = true;
                this._seats[AppGame.ins.fzjhModel.getUISeatId(caller.GamePlayers[index].cbChairId)]._chipCount.string = caller.GamePlayers[index].dTableJetton;
                if (caller.GamePlayers[index].bMingZhu) {
                    this._seats[AppGame.ins.fzjhModel.getUISeatId(caller.GamePlayers[index].cbChairId)].seePai();
                }
                if (caller.GamePlayers[index].bGiveUp) {
                    this._seats[AppGame.ins.fzjhModel.getUISeatId(caller.GamePlayers[index].cbChairId)].qipai();
                }
                if (caller.GamePlayers[index].bLost) {
                    this._seats[AppGame.ins.fzjhModel.getUISeatId(caller.GamePlayers[index].cbChairId)].bipai_shu();
                }
                if (caller.GamePlayers[index].cbHandCardData !== null && caller.GamePlayers[index].cbHandCardData.length > 0) {

                    AppGame.ins.fzjhModel.update_fanpai(caller.GamePlayers[index].wUserId, caller.GamePlayers[index].cbHandCardData, caller.GamePlayers[index].cbHandCardType, AppGame.ins.fzjhModel.getUISeatId(caller.GamePlayers[index].cbChairId));
                }
            }


            for (let index = 0; index < caller.gameEndInfo.pEndUserInfo.length; index++) {
                let score = caller.gameEndInfo.pEndUserInfo[index].dGameScore * ZJH_SCALE;
                let win = score > 0 ? true : false;
                let seatId = AppGame.ins.fzjhModel.getUISeatId(caller.gameEndInfo.pEndUserInfo[index].dChairId);

                this._seats[seatId]._win.active = win;
                this._seats[seatId]._lose.active = !win;

                let show = win ? this._seats[seatId]._win : this._seats[seatId]._lose;
                let label = win ? this._seats[seatId]._winNum : this._seats[seatId]._loseNum;
                label.string = win ? "+" + UStringHelper.getMoneyFormat(score) : UStringHelper.getMoneyFormat(score, -1);
                show.setPosition(0, -70);
                show.runAction(cc.moveTo(0.3, 0, 5));
            }

            //是否下局旁观
            for (let index = 0; index < caller.user.length; index++) {
                if (caller.user[index].userId == AppGame.ins.roleModel.useId) {
                    if (caller.user[index].bRoundEndLookon == true) {
                        this._next_pause_btn.isChecked = true;
                    }
                }
            }

            this.scheduleOnce(function () {
                if(AppGame.ins.fzjhModel.state == EZJHState.Match){
                    this._totalLun.string = "";
                    this._totoalCount.string = "";
                    this.waitbattle();
                    if(AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState !== EBattlePlayerPaiState.ready){
                        this._ready_btn.active = true;
                    }

                }
            }, 5)
        
        }




    }

    private show_exit_next(): void {
        this._opreate._toggle_xjlc.isChecked = true;
    }

    private show_next_pause_btn(caller): void {
        this._next_pause_btn.node.active = true;
        //筹码重置
        // this._chipManager.reset();
        //是否下局旁观
        for (let index = 0; index < caller.user.length; index++) {
            if (caller.user[index].userId == AppGame.ins.roleModel.useId) {
                if (caller.user[index].bRoundEndLookon) {
                    this._next_pause_btn.isChecked = true;
                }
            }
        }
    }

    private brash_chip(caller):void{
        this._chipManager.reset();
        let chips = new UIZJHChip();
        chips.items = [];
        chips.chipState = 0;
        for(let index = 0; index < caller.chips.length;index++){
            for (let i = 0; i < caller.chips[index].count; i++) {
                let chip = AppGame.ins.fzjhModel.getchipitems(0, caller.chips[index].chip/ZJH_SCALE);
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
            this._chipManager.createChip(cc.v2(this.node.width/2,this.node.height/2), element.chipType, element.gold, 1, element.objId, state);
            // this._music.playbet(chips.chipState);
        }
    }

    private base_info():void{
        this._ready_btn.active = false;
        this._invite_btn.active = false;
        this._pause_btn.active = false;
        this._record.active = false;
        this._chat.active = !AppGame.ins.fzjhModel.roomInfo.bChatLimit;
        UDebug.error("4444444444")
        this._chipManager.reset();
        this._light.active = false;
        this._myturn.active = false;
        this._pjbhgb.active = false;
        this._bianhao.node.active = false;
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                if(element.seatId == 0){
                    element.showbaseInfo(AppGame.ins.fzjhModel.getshowselfinfo());
                } else {
                    for (const a in AppGame.ins.fzjhModel._battleplayer) {
                        if (AppGame.ins.fzjhModel._battleplayer[a].seatId != 0 && AppGame.ins.fzjhModel._battleplayer[a].seatId == element.seatId) {
                            element.showbaseInfo(AppGame.ins.fzjhModel._battleplayer[a]);
                        }
                    }
                }
            }
        }
    }

    private hide_btns():void{
        this._opreate.showall(false);
    }

    private hide_chat():void{
        this._chat.active = false;
        UDebug.error("55555555555555")
    }

    private status_none():void{
        this._ready_btn.active = true;
        this._pause_btn.active = true;
        this._next_pause_btn.node.active = false;
        this._seats[ZJH_SELF_SEAT]._ok_node.active = false;
        this._seats[ZJH_SELF_SEAT]._out_node.getComponentInChildren(cc.Label).string = "";
        this._record.active = true;

        // this._opreate.showall(false);
    }

    private status_watching():void{
        this._ready_btn.active = false;
        this._invite_btn.active = false;
        this._pause_btn.active = false;
        this._next_pause_btn.node.active = false;
        this._seats[ZJH_SELF_SEAT]._ok_node.active = false;
        this._seats[ZJH_SELF_SEAT]._out_node.getComponentInChildren(cc.Label).string = "";
        this._record.active = true;
        // this._opreate.showall(false);
    }

    private status_gameing():void{
        this._ready_btn.active = false;
        this._pause_btn.active = false;
        this._next_pause_btn.node.active = true;
        this._seats[ZJH_SELF_SEAT]._ok_node.active = false;
        this._seats[ZJH_SELF_SEAT]._out_node.getComponentInChildren(cc.Label).string = "";
        this._record.active = true;
    }

    private status_qipai():void{
        this._ready_btn.active = false;
        this._invite_btn.active = false;
        this._pause_btn.active = false;
        this._next_pause_btn.node.active = true;
        this._seats[ZJH_SELF_SEAT]._ok_node.active = false;
        this._seats[ZJH_SELF_SEAT]._out_node.getComponentInChildren(cc.Label).string = "";
        this._record.active = true;
        // this._opreate.showall(false);
    }

    private status_pangguan():void{
        this._ready_btn.active = true;
        this._invite_btn.active = false;
        this._pause_btn.getComponent(cc.Button).interactable = false;
        this._next_pause_btn.node.active = false;
        this._seats[ZJH_SELF_SEAT]._ok_node.active = false;
        this._seats[ZJH_SELF_SEAT]._out_node.getComponentInChildren(cc.Label).string = "旁观中";
        this._record.active = true;
        // this._opreate.showall(false);
    }

    private status_ready():void{
        this._ready_btn.active = false;
        this._invite_btn.active = false;
        this._pause_btn.active = true;
        this._pause_btn.getComponent(cc.Button).interactable = true;
        this._next_pause_btn.node.active = false;
        this._seats[ZJH_SELF_SEAT]._ok_node.active = true;
        this._seats[ZJH_SELF_SEAT]._out_node.getComponentInChildren(cc.Label).string = "已准备";
        this._record.active = true;
        // this._opreate.showall(false);
    }

    private next_pause_ischeck():void{
        this._next_pause_btn.isChecked = true;
    }

    private get_comd():void{
        this._cmds = [];
        this._canGetCmd = true;

    }

    private reset_seat():void{
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                element._flagRoot.active = false;
                element._win.active = false;
                element._chipCount.string = "0";
                element._lose.active = false;
                element._paixingNode.active = false;
                element._qipai.active = false;
                element._win2.active = false;
                element._paiAction.free();
                element._flagAction.reset();
                element.closewinfx()
            }
        }
    }

    private onDjsEvent(data: any, iswait?: boolean) { //
        if (data != null) {
            this._clockTime = data;
            // if (data == 0) {
            //     this._djsNode.active = false;
            // }
        }

        if (iswait != null) {
            this._iswait = iswait;

            // if (this._iswait == true) {
            //     this._djsNode.active = false;
            // }
        }

        //不要声音
        // if (this._iswait == false) {
        //     //倒计时声音
        //     var self = this;
        //     this.unscheduleAllCallbacks();
        //     this.schedule(() => {
        //         if (self._clockTime > 0) {
        //             if (self._clockTime > 3) {
        //                 UTBNNScene_hy.ins.getMusic.playCountDown();
        //             } else {
        //                 UTBNNScene_hy.ins.getMusic.playTimenotice();
        //             }
        //         }
        //     }, 1, this._clockTime);
        // }

    }



    // // 初始化聊天面板
    // initChatPanel(): void {
    //     this._chatMain = cc.instantiate(this.chatPrefab);
    //     this._chatMain.getComponent("VFriendGameChat").init((textNode: cc.Node, voiceText: string) => { // 快捷常用语句
    //         AppGame.ins.fzjhModel.onSendChartMessage(-1, voiceText);
    //         this._chatMain.getComponent("VFriendGameChat").hide();
    //         this.chatPanel.active = false;
    //     }, (imgNode: cc.Node, emojId: number) => { // 表情
    //         AppGame.ins.fzjhModel.onSendChartMessage(emojId, "");
    //         this._chatMain.getComponent("VFriendGameChat").hide();
    //         this.chatPanel.active = false;
    //     }, (textEdit: cc.Node, editText: string) => { // 输入文本
    //         AppGame.ins.fzjhModel.onSendChartMessage(-1,editText);
    //         this._chatMain.getComponent("VFriendGameChat").hide();
    //         this.chatPanel.active = false;
    //     }, this);
    //     this._chatMain.setPosition(cc.v2(0, 0));
    //     this._chatMain.getComponent("VFriendGameChat").hide();
    //     this.chatPanel.addChild(this._chatMain);
    // }


    /**自己操作完毕之后turn结束 */
    private cc_end_self_turn(auto: boolean): void {
        this._seats[ZJH_SELF_SEAT].leaveTurn();
        this._opreate.intoOtherTurn(auto);
    }
    // protected enter_room_fail(errorCode: number): void {
    //     let self = this;
    //     switch (errorCode) {
    //         case EEnterRoomErrCode.ERROR_ENTERROOM_GAME_IS_END:
    //             AppGame.ins.showUI(ECommonUI.NewMsgBox, {
    //                 type: 1, data: ULanHelper.BATTLE_OVER, handler: UHandler.create((isOK) => {
    //                     // if (isOK) {
    //                     //     this.waitbattle();
    //                     //     AppGame.ins.fzjhModel.requestMatch(); 
    //                     // }  
    //                 }, this)
    //             });
    //             break;
    //         case EEnterRoomErrCode.ERROR_ENTERROOM_SEAT_FULL:
    //         case EEnterRoomErrCode.ERROR_ENTERROOM_TABLE_FULL:
    //             {
    //                 this._match.hide();
    //                 this._opreate.showMatch();
    //             }
    //             break;
    //         case EEnterRoomErrCode.ERROR_ENTERROOM_USER_AUTO_EXIT:
    //             {
    //                 let msg = ULanHelper.ENTERROOM_ERROR[errorCode];
    //                 if (!msg) {
    //                     msg = ULanHelper.ROOM_INFO_ERRO;
    //                 }
    //                 this.scheduleOnce(() => {
    //                     AppGame.ins.showUI(ECommonUI.NewMsgBox, {
    //                         type: 1, data: msg, handler: UHandler.create(() => {
    //                             AppGame.ins.loadLevel(ELevelType.Hall, EGameType.ZJH_HY);
    //                         }, this)
    //                     });
    //                 }, 4);
    //             }
    //             break;
    //         case EEnterRoomErrCode.ERROR_ENTERROOM_LONGTIME_NOOP:
    //             {
    //                 AppGame.ins.fzjhModel.long_timg = true;
    //                 let msg = ULanHelper.ENTERROOM_ERROR[errorCode];
    //                 if (!msg) {
    //                     msg = ULanHelper.GAME_INFO_ERRO;
    //                 }
    //                 this.scheduleOnce(function() {
    //                     AppGame.ins.showUI(ECommonUI.NewMsgBox, {
    //                         type: 1, data: msg, handler: UHandler.create(() => {
    //                             AppGame.ins.loadLevel(ELevelType.Hall, EGameType.ZJH_HY);
    //                         }, this)
    //                     });
    //                 },4)

    //             }
    //             break;
    //         case EEnterRoomErrCode.ERROR_ENTERROOM_OTHER:
    //             {
    //                 // AppGame.ins.fzjhModel.long_timg = true;
    //                 let msg = ULanHelper.ENTERROOM_ERROR[errorCode];
    //                 if (!msg) {
    //                     msg = '房间IP限制,请稍后重试';
    //                 }
    //                 AppGame.ins.showUI(ECommonUI.NewMsgBox, {
    //                     type: 1, data: msg, handler: UHandler.create(() => {
    //                         AppGame.ins.loadLevel(ELevelType.Hall, EGameType.ZJH_HY);
    //                     }, this)
    //                 });


    //             }
    //             break;



    //         default:
    //             if(errorCode == 7){
    //                 var msg =  "您的金币不足，该房间需要" + self._enterMinScore*ZJH_SCALE + "金币以上才可以下注";
    //             }else{
    //                 var msg = ULanHelper.ENTERROOM_ERROR[errorCode];
    //             }
    //             if (!msg) {
    //                 msg = ULanHelper.GAME_INFO_ERRO;
    //             }
    //             AppGame.ins.showUI(ECommonUI.NewMsgBox, {
    //                 type: 1, data: msg, handler: UHandler.create(() => {
    //                     AppGame.ins.loadLevel(ELevelType.Hall);
    //                 }, this)
    //             });
    //             break;
    //     }
    // }

    protected enter_room_fail(errorCode: number, errorMsg?: any): void {
        super.enter_room_fail(errorCode, errorMsg);
        return
    }

    private inviteFriends(): void {
        UAudioManager.ins.playSound("audio_click");
        if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.fzjhModel._roomInfo.roomUserId]) {
            AppGame.ins.showUI(ECommonUI.UI_SHARED_HY, { eGameType: EGameType.ZJH_HY, roomInfo: AppGame.ins.fzjhModel._roomInfo, headId: AppGame.ins.fzjhModel._battleplayer[AppGame.ins.fzjhModel._roomInfo.roomUserId].headId });
        } else {
            AppGame.ins.showUI(ECommonUI.UI_SHARED_HY, { eGameType: EGameType.ZJH_HY, roomInfo: AppGame.ins.fzjhModel._roomInfo, headId: 0 });
        }
    }

    private clickReady(): void {
        // this.play_already = true;
        UAudioManager.ins.playSound("audio_click");
        let a = JSON.parse(AppGame.ins.fzjhModel._roomInfo.extent);
        if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].score * ZJH_SCALE >= AppGame.ins.fzjhModel._roomInfo.floorScore / 100 * a.enterMinScoreTimes) {
            AppGame.ins.fzjhModel.requestReady();
            AppGame.ins.showTips(ULanHelper.GAME_HY.STATUS_READY);
            this._next_pause_btn.isChecked = false;
            this._opreate.oncancelgenzhu()
        } else {
            AppGame.ins.showUI(ECommonUI.UI_BRING_POINTS);
        }
        // this._invite_btn.active = false;
        if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.pangGuan || AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.none) {
            if (AppGame.ins.fzjhModel.isPreDismiss) {
                // this._pause_btn.active = false;
            } else {
                this._pause_btn.active = true;
            }

        }

    }

    private clickPause(): void {
        // this.play_already = true;
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.fzjhModel.requestRause();
        if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.pangGuan || AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.none || AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.ready) {
            this._ready_btn.active = true;
        }

    }

    private clickRecord(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showUI(ECommonUI.UI_REAL_TIME_RECORD);
    }

    private clickChat(): void {
        // this.chatPanel.active = !this.chatPanel.active;
        // if(this.chatPanel.active) {
        //     this._chatMain.getComponent("VFriendGameChat").show();
        // } else {
        //     this._chatMain.getComponent("VFriendGameChat").hide();
        // }
        // AppGame.ins.showUI(ECommonUI.UI_CHAT_HY,{
        //     text_click_callback:AppGame.ins.fzjhModel.onSendChartMessage,
        //     emoj_click_callback:AppGame.ins.fzjhModel.onSendChartMessage,
        //     send_click_callback:AppGame.ins.fzjhModel.onSendChartMessage,
        // });
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showUI(ECommonUI.UI_CHAT_HY);
    }

    private clickAgain(): void {
        // this.play_already = true;
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.fzjhModel.requestAgain();
        this._ready_btn.active = true;
        AppGame.ins.fzjhModel.isPreDismiss = false;

        // this._btn_again.active = false;
        // this.showBtns(true);
    }

    protected reconnect_in_game_but_no_in_gaming(): void {
        this.pushcmd("reconnect_no_gameing", null, false);
        // this.waitbattle();
        // AppGame.ins.roomModel.requestMatch();
    }
    private updata_game_number(caller: string): void {
        this.play_already = false;
        this.play_finised = false;
        if(AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.mengPai || AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.kanPai){
            this.cuoPaiToggle.node.active = true;
        }
        this._pokerNode.active = true;
        this._lableNode.active = true;
        this._playerchipNode.active = true;
        this._bianhao.node.active = true;
        this._bianhao.string = ULanHelper.GAME_NUMBER + caller;
        this._pjbhgb.active = true;
        this._roundTimeLab.node.parent.active = false;
        this._roundTimeLab.node.parent.active = false;
        this.left_time_seconds = AppGame.ins.fzjhModel._roomInfo.leftSeconds;
        if (AppGame.ins.fzjhModel._roomInfo.autoStart) {
            if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId]) {
                if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.pangGuan) {
                    this._seats[ZJH_SELF_SEAT]._out_node.active = true;
                    this._seats[ZJH_SELF_SEAT]._out_node.getComponentInChildren(cc.Label).string = '旁观中';
                    this._seats[ZJH_SELF_SEAT]._out_node.getChildByName('OutSp').active = true;
                    this._seats[ZJH_SELF_SEAT]._ok_node.active = false;
                    // this._pause_btn.active = false;
                    this._ready_btn.active = true;
                    this._next_pause_btn.node.active = false;
                } else if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.mengPai) {
                    this._seats[ZJH_SELF_SEAT]._out_node.active = false;
                    this._seats[ZJH_SELF_SEAT]._ok_node.active = false;
                    // this._pause_btn.active = false;
                    this._ready_btn.active = false;
                    this._next_pause_btn.node.active = true;
                } else if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.none) {
                    this._seats[ZJH_SELF_SEAT]._out_node.active = true;
                    this._seats[ZJH_SELF_SEAT]._out_node.getComponentInChildren(cc.Label).string = '';
                    this._seats[ZJH_SELF_SEAT]._out_node.getChildByName('OutSp').active = true;
                    this._seats[ZJH_SELF_SEAT]._ok_node.active = false;
                    this._pause_btn.active = true;
                    this._ready_btn.active = true;
                    this._next_pause_btn.node.active = false;
                } else {
                    this._pause_btn.active = false;
                    this._ready_btn.active = false;
                    this._next_pause_btn.node.active = true;
                }
            }
        } else {
            if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId]) {
                if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.pangGuan) {
                    this._seats[ZJH_SELF_SEAT]._out_node.active = true;
                    this._seats[ZJH_SELF_SEAT]._out_node.getChildByName('OutSp').active = true;
                    this._seats[ZJH_SELF_SEAT]._out_node.getComponentInChildren(cc.Label).string = '旁观中';
                    this._seats[ZJH_SELF_SEAT]._ok_node.active = false;
                    // this._pause_btn.active = false;
                    this._ready_btn.active = true;
                    this._next_pause_btn.node.active = false;
                } else if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.mengPai || AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.ready) {
                    this._seats[ZJH_SELF_SEAT]._out_node.active = false;
                    this._seats[ZJH_SELF_SEAT]._ok_node.active = false;
                    // this._pause_btn.active = false;
                    this._ready_btn.active = false;
                    this._next_pause_btn.node.active = true;
                } else if (AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.none) {
                    this._seats[ZJH_SELF_SEAT]._out_node.active = true;
                    this._seats[ZJH_SELF_SEAT]._out_node.getComponentInChildren(cc.Label).string = '';
                    this._seats[ZJH_SELF_SEAT]._out_node.getChildByName('OutSp').active = true;
                    this._seats[ZJH_SELF_SEAT]._ok_node.active = false;
                    this._pause_btn.active = true;
                    this._ready_btn.active = true;
                    this._next_pause_btn.node.active = false;
                } else {
                    this._pause_btn.active = false;
                    this._ready_btn.active = true;
                    this._next_pause_btn.node.active = true;
                }
            }
        }

        this._invite_btn.active = false;
        AppGame.ins.fzjhModel.isPreDismiss = false;
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                element._ok_node.active = false;
            }
        }
    }

    private showBtns(show: boolean): void {
        this._ready_btn.active = show;
        this._pause_btn.getComponent(cc.Button).interactable = !show;
    }

    isExitGame(e: cc.Toggle) {
        UDebug.Log(e.isChecked)
        // AppGame.ins.fzjhModel.nextExit = e.isChecked;
        // AppGame.ins.fzjhModel.sendNextExit(e.isChecked);
    }

    isNextLook(e: cc.Toggle) {
        AppGame.ins.fzjhModel.nextLook = e.isChecked;
        AppGame.ins.fzjhModel.requestNextRause(e.isChecked);
    }

    private ts_fangchaoshi(value: boolean): void {
        this._opreate.setFangChaoShi(value);
        let tips = !value ? ULanHelper.OFF_FANG_CHAOSHI : ULanHelper.ON_FANG_CHAOSHI;
        AppGame.ins.showTips({ data: tips, type: ETipType.onlyone });
    }
    private sc_ts_left(): void {
        this._cmds = [];
    }
    protected onEnable(): void {
        super.onEnable();
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_GUZHUYIZHI, this.sc_ts_guzhuyizhi, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_PLAYER_COMPARE, this.sc_ts_player_compare, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_SET_NEXT_TURN, this.sc_ts_set_next_turn, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_UPDATA_TOTAL_PLAYER_SCORE, this.sc_ts_updata_total_player_score, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_UPDATA_TOTAL_TURN, this.sc_ts_updata_total_turn, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_UPDATA_TOTAL_SCORE, this.sc_ts_updata_total_score, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_CZ_PUT_OUT_CHIP, this.sc_cz_put_out_chip, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.CC_UPDATA_SEAT_INFO, this.seat_info, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_GAME_END, this.game_end, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_LOOK_PAI, this.look_pai, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_FAN_PAI, this.fan_pai, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_BIPAI_SHU, this.bipai_shu, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_SET_TURN_OVER, this.set_turn_over, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_REFRESH_CHIP, this.refresh_chip, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_UPDATA_TURN_TIME, this.updata_turn_time, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_FAPAI, this.ts_fapai, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.CC_END_SELF_TURN, this.cc_end_self_turn, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_SET_ZHU, this.set_zhu, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_PLAYER_GIVE_UP, this.player_give_up, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_SET_GAME_FREE, this.set_game_free, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_CANCLE_MATCH, this.set_cancle_match, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_UPDATA_GAME_NUMBER, this.updata_game_number, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_FANGCHAOSHI, this.ts_fangchaoshi, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_START_MATCH, this.sc_ts_start_match, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_SHOW_MATCH, this.sc_ts_show_match, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_LEFT, this.sc_ts_left, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.PLAYER_READY, this.player_ready, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.PLAYER_PAUSE, this.player_pause, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.NEXT_PAUSE, this.show_next_pause, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.PLAYER_NEXT_PAUSE, this.player_next_pause, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.UPDATE_ROOM_ID, this.update_room_number, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.RECEIVE_MESSAGE, this.receive_message, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.UPDATE_DIZHU, this.update_dizhu, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.TIME_OUT, this.time_out, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.USSTAUTS_CHANGE, this.usstauts_change, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.STAUTS_CHANGE, this.stauts_change, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SHOW_NEXT_PAUSE, this.show_next_pause_ischeck, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.PLAY_AGAIN, this.play_again, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SHOW_AGAIN, this.show_again, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SHOW_PAUSE, this.show_pause, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.CLICK_READY, this.click_ready, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.ZJH_ROOM_CHARGE_ROOM_CARD, this.intoCharge, this);
        AppGame.ins.hallModel.on(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.CHAT_LIMIT, this.chat_limit, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.RECONNECT_HIDE, this.reconnect_hide, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_FANPAI, this.update_fanpai, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SET_LIGHT, this.reconnentSetLightAngel, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.RESET_SCENE, this.do_gamescene_free, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SHOW_RESULT, this.do_show_result, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SHOW_EXIT_NEXT, this.show_exit_next, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SHOW_NEXT_PAUSE_BTN, this.show_next_pause_btn, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.BRASH_CHIP, this.brash_chip, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SHOW_BASEINFO, this.base_info, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.HIDE_NEXT_PAUSE_BTN, this.hide_btns, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.HIDE_CHAT, this.hide_chat, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.STATUS_WATCHING, this.status_watching, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.STATUS_GAMING, this.status_gameing, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.STATUS_NONE, this.status_none, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.STATUS_QIPAI, this.status_qipai, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.STATUS_PANGGUAN, this.status_pangguan, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.STATUS_READY, this.status_ready, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.NEXT_PAUSE_ISCHECK, this.next_pause_ischeck, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.GET_CMD, this.get_comd, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.RESET_SEAT, this.reset_seat, this);
        AppGame.ins.fzjhModel.run();

    }
    protected onDisable(): void {
        super.onDisable();
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_GUZHUYIZHI, this.sc_ts_guzhuyizhi, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_PLAYER_COMPARE, this.sc_ts_player_compare, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_SET_NEXT_TURN, this.sc_ts_set_next_turn, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_UPDATA_TOTAL_PLAYER_SCORE, this.sc_ts_updata_total_player_score, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_UPDATA_TOTAL_TURN, this.sc_ts_updata_total_turn, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_UPDATA_TOTAL_SCORE, this.sc_ts_updata_total_score, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_CZ_PUT_OUT_CHIP, this.sc_cz_put_out_chip, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.CC_UPDATA_SEAT_INFO, this.seat_info, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_GAME_END, this.game_end, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_LOOK_PAI, this.look_pai, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_FAN_PAI, this.fan_pai, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_BIPAI_SHU, this.bipai_shu, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_SET_TURN_OVER, this.set_turn_over, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_REFRESH_CHIP, this.refresh_chip, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_UPDATA_TURN_TIME, this.updata_turn_time, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_FAPAI, this.ts_fapai, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.CC_END_SELF_TURN, this.cc_end_self_turn, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_SET_ZHU, this.set_zhu, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_PLAYER_GIVE_UP, this.player_give_up, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_SET_GAME_FREE, this.set_game_free, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_CANCLE_MATCH, this.set_cancle_match, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_UPDATA_GAME_NUMBER, this.updata_game_number, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_FANGCHAOSHI, this.ts_fangchaoshi, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_START_MATCH, this.sc_ts_start_match, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_SHOW_MATCH, this.sc_ts_show_match, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_LEFT, this.sc_ts_left, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.PLAYER_READY, this.player_ready, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.PLAYER_PAUSE, this.player_pause, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.NEXT_PAUSE, this.show_next_pause, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.PLAYER_NEXT_PAUSE, this.player_next_pause, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.UPDATE_ROOM_ID, this.update_room_number, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.RECEIVE_MESSAGE, this.receive_message, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.UPDATE_DIZHU, this.update_dizhu, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.TIME_OUT, this.time_out, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.USSTAUTS_CHANGE, this.usstauts_change, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.STAUTS_CHANGE, this.stauts_change, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SHOW_NEXT_PAUSE, this.show_next_pause_ischeck, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.PLAY_AGAIN, this.play_again, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SHOW_AGAIN, this.show_again, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SHOW_PAUSE, this.show_pause, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.CLICK_READY, this.click_ready, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.ZJH_ROOM_CHARGE_ROOM_CARD, this.intoCharge, this);
        AppGame.ins.hallModel.off(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.CHAT_LIMIT, this.chat_limit, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.RECONNECT_HIDE, this.reconnect_hide, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_FANPAI, this.update_fanpai, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SET_LIGHT, this.reconnentSetLightAngel, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.RESET_SCENE, this.do_gamescene_free, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SHOW_RESULT, this.do_show_result, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SHOW_EXIT_NEXT, this.show_exit_next, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SHOW_NEXT_PAUSE_BTN, this.show_next_pause_btn, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.BRASH_CHIP, this.brash_chip, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SHOW_BASEINFO, this.base_info, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.HIDE_NEXT_PAUSE_BTN, this.hide_btns, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.HIDE_CHAT, this.hide_chat, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.STATUS_WATCHING, this.status_watching, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.STATUS_GAMING, this.status_gameing, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.STATUS_NONE, this.status_none, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.STATUS_QIPAI, this.status_qipai, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.STATUS_PANGGUAN, this.status_pangguan, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.STATUS_READY, this.status_ready, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.NEXT_PAUSE_ISCHECK, this.next_pause_ischeck, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.GET_CMD, this.get_comd, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.RESET_SEAT, this.reset_seat, this);
        AppGame.ins.fzjhModel.exit();
        this._music.stop();
    }
    //#endregion
}
