import UScene from "../../common/base/UScene";
import UNodeHelper from "../../common/utility/UNodeHelper";
import BJMenu from "./BJMenu"
import UDebug from "../../common/utility/UDebug";
import VBJSeat from "./VBJSeat";
import USpriteFrames from "../../common/base/USpriteFrames";
import AppGame from "../../public/base/AppGame";
import UEventHandler from "../../common/utility/UEventHandler";
import MBJ, { BJ_SCALE, BJ_SELF_SEAT } from "./MBJ";
import { UIBJChip, EBJPlayerInfo, UIBJFanPai, EBJState, EPlayerPaiState, UIBJPoker } from "./UBJData";
import VChipManager from "./help/VBJChipManager";
import VMatch from "./VBJMatch";
import { ToBattle } from "../../common/base/UAllClass";
import { EEnterRoomErrCode, ECommonUI, ELevelType, EGameType, ERoomKind } from "../../common/base/UAllenum";
import ULanHelper from "../../common/utility/ULanHelper";
import UHandler from "../../common/utility/UHandler";
import VBJAddChips from "./help/VBJAddChips";
import MRoomModel from "../../public/hall/room_zjh/MRoomModel";
import AppStatus from "../../public/base/AppStatus";
import UAudioManager from "../../common/base/UAudioManager";
import UGame from "../../public/base/UGame";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import { ZJH_SCALE } from "../zjh/MZJH";
import UBJMusic from "./UBJMusic";
import UStringHelper from "../../common/utility/UStringHelper";
import MHall, { NEWS } from "../../public/hall/lobby/MHall";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";
import { RoomPlayerInfo } from "../../public/hall/URoomClass";
import { Blackjack } from "../../common/cmd/proto";

export const fapaitime = 0.18;
const { ccclass, property } = cc._decorator;
/**
 * 创建:gss
 * 作用:21点场景ui类
 */

@ccclass
export default class VBJScene extends UGame {

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
    /**加筹码按钮节点 */
    private _addchipNode: cc.Node;
    /** 丢的筹码节点*/
    private _chipNode: cc.Node;
    /**玩家出牌时候的按钮节点 */
    private _myturn: cc.Node;
    /**游戏的各种特效节点 */
    private _fxNode: cc.Node;
    /**游戏中的文字节点 */
    private _lableNode: cc.Node;
    /**继续游戏按钮 */
    private _btnGoon: cc.Button;
    private _match: VMatch;
    /**玩家筹码数量 */
    private _playerchipNode: cc.Node;
    /**看牌动画点 */
    private _kanpai_ori: sp.Skeleton;
    /**牌局编号背景 */
    private _pjbhbg: cc.Node;
    /**本局编号 */
    private _bianhao: cc.Label;
    /**灯 */
    private _light: cc.Node;
    private _lightPos: { [key: number]: number };
    public _res: USpriteFrames;
    private _addChips: VBJAddChips;
    private _charge_btn: cc.Node;
    private _copy_number: cc.Node;
    private _toggle_xjlc: cc.Node;
    private _an_node: cc.Node;
    private _enterMinScore: number;
    private _emergency_announcement: Array<string>;
    private _tips: cc.Node;

    @property(cc.Node)
    chatBtn: cc.Node = null;

    @property(cc.SpriteFrame)
    seat1: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    seat2: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    seat3: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    seat4: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    seat5: cc.SpriteFrame = null;

    /**
     * 音乐播放器
     */
    private _music: UBJMusic;
    get getMusic(): UBJMusic {
        return this._music;
    }
    /**
     * 菜单
     */
    private _menu: BJMenu;
    /**
   * 筹码管理
   */
    private _chipManager: VChipManager;

    /**
     * 座位
     */
    private _seats: { [key: number]: VBJSeat };

    protected init(): void {
        /**初始化各种节点 */
        this._music = new UBJMusic();
        let root = UNodeHelper.find(this.node, "uiroot/content");
        this._menuNode = UNodeHelper.find(this.node, "uiroot/TLPos/menu_node");
        let btnMenu = UNodeHelper.find(this.node, "uiroot/TLPos/btn_menu");
        let baodianNode = UNodeHelper.find(this.node, "uiroot/TPos/baodian_node");
        let baodianMenu = UNodeHelper.find(this.node, "uiroot/TLPos/menu_baodian");
        this._menu = new BJMenu(btnMenu, this._menuNode, baodianMenu, baodianNode);
        this._menu.showMenu(false);

        /**初始化各种节点 */
        this._playerNode = UNodeHelper.find(root, "players_node");
        this._pokerNode = UNodeHelper.find(root, "poker_node");
        this._stataFlagNode = UNodeHelper.find(root, "stateflag_node");
        this._addchipNode = UNodeHelper.find(root, "addchip_node");
        this._chipNode = UNodeHelper.find(root, "chips_node");
        this._myturn = UNodeHelper.find(root, "myturn_node");
        this._fxNode = UNodeHelper.find(root, "fx_node");
        this._lableNode = UNodeHelper.find(this.node, "uiroot/TLPos/label_node");
        this._light = UNodeHelper.find(root, "main");
        this._playerchipNode = UNodeHelper.find(root, "player_chip");
        this._kanpai_ori = UNodeHelper.find(this._pokerNode, "kanpai_ori").getComponent(sp.Skeleton);
        this._charge_btn = UNodeHelper.find(this.node, "uiroot/content/players_node/seat_1/gold/charge_btn");
        this._copy_number = UNodeHelper.find(this.node, "uiroot/TLPos/label_node");
        this._toggle_xjlc = UNodeHelper.find(this.node, "uiroot/content/toggle_xjlc");
        this._an_node = UNodeHelper.find(this.node, "uiroot/content/players_node/seat_1/ani_node");

        this._bianhao = UNodeHelper.getComponent(this._lableNode, "bianhao", cc.Label);
        this._pjbhbg = UNodeHelper.find(this.node, "uiroot/TLPos/label_node/bg");
        this._btnGoon = UNodeHelper.getComponent(this._myturn, "btn_goon", cc.Button);
        this._tips = UNodeHelper.find(root, "tips");

        this._mainNode = UNodeHelper.find(root, "main");

        UEventHandler.addClick(this._btnGoon.node, this.node, "VBJScene", "goonGame");
        UEventHandler.addClick(this._charge_btn, this.node, "VBJScene", "toCharge");
        UEventHandler.addClick(this._copy_number, this.node, "VBJScene", "copyNumber");

        this.setHorseLampPos(-20, 330);

        this._addChips = this._addchipNode.getComponent(VBJAddChips);
        this._addChips.init()
        /**初始化筹码控制器 */
        this._chipManager = new VChipManager(this._chipNode);

        this._res = this.node.getComponent(USpriteFrames);

        /**初始化位置 */
        this._seats = {};
        let fapaiOri = UNodeHelper.find(this._pokerNode, "fapai_ori");

        let len = this._playerNode.childrenCount;
        for (let i = 1; i <= len; i++) {
            let idx = i;
            let st = UNodeHelper.find(this._playerNode, "seat_" + idx);
            let pk = UNodeHelper.find(this._pokerNode, "poker_" + idx);
            let chip_bg = UNodeHelper.find(this._playerchipNode, "chip_bg_" + idx);
            let chip_count = UNodeHelper.find(this._playerchipNode, "chip_count_" + idx);
            let paixing = UNodeHelper.find(this._fxNode, "paixing_" + idx);
            let fanpai = UNodeHelper.find(this._fxNode, "fanpai_" + idx);
            let win = UNodeHelper.find(this._fxNode, "win_" + idx);
            let seat = new VBJSeat(idx, fapaiOri, st, pk, chip_bg, chip_count, fanpai, paixing, win, this._res);
            this._seats[seat.seatId] = seat;
            seat.free();  //测试修改
        }
        this._match = UNodeHelper.getComponent(root, "match_node", VMatch);
        this._match.init();
        // this._match.hide();

        this._chipNode.active = true;
        this._lightPos = {};
        this._lightPos[0] = 0;
        this._lightPos[1] = 33;
        this._lightPos[2] = 60;
        this._lightPos[3] = -60;
        this._lightPos[4] = -33;
        this._light.active = false;
    }

    /**
     * 场景被打开
     * @param data 
     *//**sq 修改 需要是否是断线重连进来的 data:ToBattle */
    openScene(data: any): void {
        super.openScene(data);
        if (data) {
            let dt = data as ToBattle;
            AppGame.ins.bjModel.saveRoomInfo(dt.roomData);
            if (dt.roomData) {
                UDebug.Info(dt.roomData);
                this._enterMinScore = data.roomData.enterMinScore;
                // this._dingzhu.string = "底注:" + (dt.roomData.ceilScore * ZJH_SCALE).toString();
                // this._dizhu.string = "顶注:" + (dt.roomData.floorScore * ZJH_SCALE).toString();
            }
            this.waitbattle();
            //this._canGetCmd = true;
        }
        this._music.playGamebg();
    }

    /**
    * 游戏切换到后台
    * @param isHide 是否切在后台
    */
    onGameToBack(isBack: boolean) {
        AppGame.ins.bjModel.on_back = isBack;
        if (!isBack) {
            AppGame.ins.bjModel._cmds = [];
            AppGame.ins.bjModel._canGetCmd = false;
            this.unscheduleAllCallbacks();
            if (AppGame.ins.bjModel._isEnd == true) {
                AppGame.ins.bjModel.emit(MBJ.CC_TS_SHOW_JIXU_BTN, true);
            }else{
                AppGame.ins.bjModel._disconnect = false;
                AppGame.ins.bjModel.sendFreshGameScene();
                this.scheduleOnce(function () {
                    if (!AppGame.ins.bjModel._disconnect) {
                        this.reset_scene();
                        let msg = "本局游戏已结束，即将返回大厅";
                        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                            type: 1, data: msg, handler: UHandler.create(() => {
                                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BJ);
                            }, this)
                        });
                    }
                }, 2)
            }

        } else {
            // if (!AppGame.ins.bjModel._isEnd) {
                AppGame.ins.bjModel._cmds = [];
                AppGame.ins.bjModel._canGetCmd = false;
            // }

        }
    }

    private showOrderNum(): void {
        for (const key in this._seats) {
            let seatId = AppGame.ins.bjModel.getRealSeatId(this._seats[key].seatId) + 1;
            this._seats[key].showOrderNum(seatId);
        }
    }

    //切后台后重置场景
    private reset_scene(): void {
        this.defalutUI();
        this._chipManager.reset();
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                this._seats[key]._paiAction._totalPointsImg_1.unscheduleAllCallbacks();
                this._seats[key]._paiAction.resetTransform();
            }
        }
        for (const key in AppGame.ins.bjModel._battleplayer) {
            if (AppGame.ins.bjModel._battleplayer[key]) {
                AppGame.ins.bjModel._battleplayer[key].pai = [];
            }

        }
    }

    //切后台后再切回前台到游戏结算界面并收到游戏结算的场景消息
    private show_result(caller): void {
        //清空当前页面和玩家列表
        this.reset_scene();

        this._bianhao.string = ULanHelper.GAME_NUMBER + caller.roundId;
        AppGame.ins.bjModel._battleplayer = {};

        //获得新的玩家列表
        for (let index = 0; index < caller.GamePlayers.length; index++) {
            const element = caller.GamePlayers[index];
            if (!element.bShadow) {
                let a = new RoomPlayerInfo();
                a.userId = element.wUserId;
                a.userStatus = 1;
                a.account = element.szNickName;
                a.nickName = element.szNickName;
                a.headId = element.cbHeadIndex;
                a.headboxId = element.headBoxIndex;
                a.vipLevel = element.vipLevel;
                a.tableId = element.cbChairId;
                a.chairId = element.cbChairId;
                a.location = element.szLocation;
                a.score = 0;
                a.sex = 1;
                a.headImgUrl = element.headImgUrl;
                AppGame.ins.bjModel.addPlayer(a);
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
            AppGame.ins.bjModel.s_game_addScore(data);
            let seat = AppGame.ins.bjModel.getFenPaiYuanSeatId(caller.GamePlayers[key].cbChairId)
            if (isFenpai) //分牌
            {
                AppGame.ins.bjModel.emit(MBJ.CC_TS_SHOW_FENPAI, seat, false)   //分牌
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
                    AppGame.ins.bjModel.emit(MBJ.SC_TS_FAPAI, data)
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
                AppGame.ins.bjModel.emit(MBJ.SC_TS_FAPAI, data);
            }

            //双倍下注
            if (caller.GamePlayers[key].cbFirstHand.bDoubled && !caller.GamePlayers[key].cbSecondHand) {
                let pos = caller.GamePlayers[key].cbFirstHand.cbHandCardData.length;
                let offsetX = 8;
                AppGame.ins.bjModel.emit(MBJ.CC_TS_SHOW_PKSB_IMG, AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId), 0);
                this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_1.node.x = this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._pokerInItPos[0][pos].x + offsetX;
            }
            if (caller.GamePlayers[key].cbSecondHand) {
                let pos = caller.GamePlayers[key].cbFirstHand.cbHandCardData.length;
                // AppGame.ins.bjModel.emit(MBJ.CC_TS_SHOW_PKSB_IMG, AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId), 1);
                if (caller.GamePlayers[key].cbFirstHand.bDoubled && !caller.GamePlayers[key].cbSecondHand.bDoubled) {
                    let offsetX = 13;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_1.node.active = true;
                    let pos0 = caller.GamePlayers[key].cbFirstHand.cbHandCardData.length - 1;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_1.node.x = this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._pokeInItrOnePos[pos0].x + offsetX;
                }
                if (caller.GamePlayers[key].cbSecondHand.bDoubled && caller.GamePlayers[key].cbFirstHand.bDoubled) {
                    let offsetX = 13;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_1.node.active = true;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_2.node.active = true;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_2.node.x = this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._pokerInItPos[1][pos].x - 10;
                    let pos0 = caller.GamePlayers[key].cbFirstHand.cbHandCardData.length - 1;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_1.node.x = this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._pokeInItrOnePos[pos0].x + offsetX;
                }
                if (!caller.GamePlayers[key].cbFirstHand.bDoubled && caller.GamePlayers[key].cbSecondHand.bDoubled) {
                    let offsetX = 12;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_2.node.active = true;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_2.node.x = this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._pokerInItPos[1][pos].x + offsetX;
                }
            }

            //最大点数
            AppGame.ins.bjModel.emit(MBJ.SC_TS_REF_POINT, AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId), 1);
        }
        AppGame.ins.bjModel.emit(MBJ.CC_TS_SHOW_OTHER_AREA, false)//关闭其他区
        AppGame.ins.bjModel.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, false, 1)//关闭下注按钮

        //庄家牌信息
        for (let i = 0; i < 2; i++) {
            let data = new UIBJFanPai()
            let pokedata = new UIBJPoker()
            pokedata.pokerIcons = new Array<number>()
            data.poker = pokedata;
            data.seatId = 5;
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
            AppGame.ins.bjModel.emit(MBJ.SC_TS_FAPAI, data);
        }

        let numtime = 0.6;
        let curLen = 0;
        caller.wBankerHand.cbHandCardData = caller.wBankerHand.cbHandCardData.slice(1, caller.wBankerHand.cbHandCardData.length);
        let leng = caller.wBankerHand.cbHandCardData.length;
        for (const key in caller.wBankerHand.cbHandCardData) {
            let data = new UIBJFanPai()
            let pokedata = new UIBJPoker()
            pokedata.pokerIcons = new Array<number>()
            data.poker = pokedata;
            data.seatId = AppGame.ins.bjModel.getUISeatId(5);
            pokedata.pokerIcons.push(caller.wBankerHand.cbHandCardData[key])
            pokedata.pokerType = caller.wBankerHand.cbHandCardType.toString();
            data.showNum = true;
            numtime += fapaitime;
            data.deal = numtime;
            data.isOneHand = true;
            curLen++
            if (leng == curLen) //最后一张牌
            {
                data.deal = data.deal + 0.4
                pokedata.pokerType = caller.wBankerHand.cbHandCardType.toString()
                AppGame.ins.bjModel.emit(MBJ.SC_TS_FAPAI, data, UHandler.create(AppGame.ins.bjModel.cmdRun, this));
            }
            else {
                AppGame.ins.bjModel.emit(MBJ.SC_TS_FAPAI, data);
            }
        }

        //设置保险标志和下注筹码
        for (let index = 0; index < caller.GamePlayers.length; index++) {
            const element = caller.GamePlayers[index];
            if (element.bInsured) {
                this._seats[AppGame.ins.bjModel._battleplayer[element.wUserId].seatId].setBaoxianInfo(true);
            }
            this._seats[AppGame.ins.bjModel.getUISeatId(element.cbChairId)]._chipBg.active = true;
            this._seats[AppGame.ins.bjModel.getUISeatId(element.cbChairId)]._chipCount.node.active = true;
            this._seats[AppGame.ins.bjModel.getUISeatId(element.cbChairId)]._chipCount.string = element.cbFirstHand.dTableJetton * BJ_SCALE + "";
        }

        //玩家飘分
        for (let index = 0; index < caller.gameEndInfo.pEndPlayers.length; index++) {
            let score = caller.gameEndInfo.pEndPlayers[index].dScore * BJ_SCALE;
            let win = score > 0 ? true : false;
            let seatId = AppGame.ins.bjModel.getUISeatId(caller.gameEndInfo.pEndPlayers[index].dChairId);
            this._seats[seatId]._win.active = win;
            this._seats[seatId]._lose.active = !win;
            let show = win ? this._seats[seatId]._win : this._seats[seatId]._lose;
            let label = win ? this._seats[seatId]._winNum : this._seats[seatId]._loseNum;
            label.string = win ? "+" + UStringHelper.getMoneyFormat(score) : UStringHelper.getMoneyFormat(score);
            if (seatId == 0) {
                show.setPosition(0, 0);
            } else {
                show.setPosition(0, -11);
            }
            let seq = cc.sequence(cc.moveBy(0.8, cc.v2(0, 5)), cc.delayTime(2.2))
            show.stopAllActions()
            show.runAction(seq);
        }

        //更新玩家分数
        for (let index = 0; index < caller.gameEndInfo.pEndPlayers.length; index++) {
            for (const key in AppGame.ins.bjModel._battleplayer) {
                if (AppGame.ins.bjModel._battleplayer[key].userId == caller.gameEndInfo.pEndPlayers[index].dUserId) {
                    AppGame.ins.bjModel._battleplayer[key].score = caller.gameEndInfo.pEndPlayers[index].dUserScore;
                }
            }
        }
        AppGame.ins.bjModel.update_seat_info();

        this._chipManager.reset();

        //显示继续按钮
        this.scheduleOnce(function () {
            AppGame.ins.bjModel.emit(MBJ.CC_TS_SHOW_JIXU_BTN, true)
        }, 3)

    }

    private gamescene_play(caller): void {
        for (const key in caller.GamePlayers) {
            //双倍下注
            if (caller.GamePlayers[key].cbFirstHand.bDoubled && !caller.GamePlayers[key].cbSecondHand) {
                let pos = caller.GamePlayers[key].cbFirstHand.cbHandCardData.length;
                let offsetX = 8;
                AppGame.ins.bjModel.emit(MBJ.CC_TS_SHOW_PKSB_IMG, AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId), 0);
                this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_1.node.x = this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._pokerInItPos[0][pos].x + offsetX;
            }
            if (caller.GamePlayers[key].cbSecondHand) {
                let pos = caller.GamePlayers[key].cbFirstHand.cbHandCardData.length;
                // AppGame.ins.bjModel.emit(MBJ.CC_TS_SHOW_PKSB_IMG, AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId), 1);
                if (caller.GamePlayers[key].cbFirstHand.bDoubled && !caller.GamePlayers[key].cbSecondHand.bDoubled) {
                    let offsetX = 13;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_1.node.active = true;
                    let pos0 = caller.GamePlayers[key].cbFirstHand.cbHandCardData.length - 1;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_1.node.x = this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._pokeInItrOnePos[pos0].x + offsetX;
                }
                if (caller.GamePlayers[key].cbSecondHand.bDoubled && caller.GamePlayers[key].cbFirstHand.bDoubled) {
                    let offsetX = 13;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_1.node.active = true;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_2.node.active = true;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_2.node.x = this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._pokerInItPos[1][pos].x - 10;
                    let pos0 = caller.GamePlayers[key].cbFirstHand.cbHandCardData.length - 1;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_1.node.x = this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._pokeInItrOnePos[pos0].x + offsetX;
                }
                if (!caller.GamePlayers[key].cbFirstHand.bDoubled && caller.GamePlayers[key].cbSecondHand.bDoubled) {
                    let offsetX = 12;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_2.node.active = true;
                    this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._sbImg_2.node.x = this._seats[AppGame.ins.bjModel.getUISeatId(caller.GamePlayers[key].cbChairId)]._paiAction._pokerInItPos[1][pos].x + offsetX;
                }
            }
        }
    }

    private get_comd():void{
        AppGame.ins.bjModel._cmds = [];
        AppGame.ins.bjModel._canGetCmd = true;

    }

    /** 等待游戏开始*/
    waitbattle(): void {
        this._an_node.active = true;
        this._mainNode.active = true;
        this._playerNode.active = true;
        this._playerchipNode.active = true;
        this._pokerNode.active = true;
        this._addchipNode.active = false;
        this._lableNode.active = true;
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                element.free();
                // for(const key1 in AppGame.)
                // element.showbaseInfo();
                // for(const key1 in AppGame.ins.bjModel._battleplayer){
                //     if(AppGame.ins.bjModel._battleplayer[key1].seatId == element.seatId){
                //         element.showHead();
                //     }
                // }

                // if(AppGame.ins.currRoomKind == 2){
                //     for(const key1 in AppGame.ins.bjModel._battleplayer){
                //         if(AppGame.ins.bjModel._battleplayer[key1].seatId !== 0 && AppGame.ins.bjModel._battleplayer[key1].seatId == element.seatId){
                //             element.showbaseInfo(AppGame.ins.bjModel._battleplayer[key1]);
                //         }
                //     }
                // }
                // this._seats[key]._gf_mengban1.node.active = true;
                // element.free();
                // element._gf_mengban1.node.active = true;
            }
        }
        AppGame.ins.bjModel.setGameState(EBJState.Match);
        this._pjbhbg.active = false;
        this._bianhao.node.active = false;
        // this.showgameinfo(false);
        //this._light.active = false;
        this.setlightAngel(0, false)
        this._match.show();
        this._chipManager.reset();
        this.showContinueBtn(false);
        // this._match.show();
    }

    private hideNext(): void {
        this._toggle_xjlc.active = false;
    }

    private showNext(): void {
        this._toggle_xjlc.active = true;
    }

    protected onEnable() {
        super.onEnable()
        AppGame.ins.bjModel.run();
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.bjModel.on(MBJ.CC_UPDATA_SEAT_INFO, this.updatePlayer, this)
        AppGame.ins.bjModel.on(MBJ.CC_DEFAULT_UI, this.defalutUI, this)
        AppGame.ins.bjModel.on(MBJ.SC_TS_FAPAI, this.fapaiOne, this);
        AppGame.ins.bjModel.on(MBJ.SC_TS_FAN_PAI, this.do_fan_pai, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_UPDATA_GAME_NUMBER, this.updata_game_number, this);
        AppGame.ins.bjModel.on(MBJ.CC_CZ_PUT_OUT_CHIP, this.createChip, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_SHOW_OPERATE, this.showPlayOperate, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_SET_ALLCD, this.setAllCd, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_SET_ONECD, this.setOneCd, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_SHOW_JIXU_BTN, this.showContinueBtn, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_SHOW_CAOZUO_STATE, this.showPlayOperateState, this);
        AppGame.ins.bjModel.on(MBJ.CC_CZ_FLY_CHIP, this.flyChip, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_SHOW_BAOXIAN_INFO, this.setBaoXian, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_SET_ALLCDNUM, this.setTotalTurnTime, this);
        AppGame.ins.bjModel.on(MBJ.SC_TS_REF_POINT, this.refreshPointMax, this);
        AppGame.ins.bjModel.on(MBJ.SET_WINIMG, this.setWin, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_SHOW_CAOZUO_BTN, this.setshowcaozuoBtn, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_SHOW_CHIPLIGHTSPRITE, this.setChipLightSprite, this);
        AppGame.ins.bjModel.on(MBJ.SC_TS_CHIP_SCORE, this.updateOnePlayerChip, this);
        AppGame.ins.bjModel.on(MBJ.SC_TS_PLAYER_SCORE, this.updateOnePlayerScore, this);
        AppGame.ins.bjModel.on(MBJ.SC_TS_SHOW_JIESUAN, this.showOnePlayerEndScore, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_SHOW_OTHER_AREA, this.setShowOtherChipArea, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_SHOW_CHIPLIGHT, this.setChipLight, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_SHOW_FENPAI, this.startFenpai, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_SHOW_JUGUANGDENG, this.setlightAngel, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_SHOW_PKSB_IMG, this.setsbImgPos, this);
        AppGame.ins.bjModel.on(MBJ.PUSH_SCORE, this.pushScore, this);
        AppGame.ins.bjModel.on(MBJ.SC_TS_HAND_ANI, this.lookpokeAni, this);
        AppGame.ins.bjModel.on(MBJ.CC_TS_SHOW_MATCH, this.setMatch, this);
        AppGame.ins.bjModel.on(MBJ.HIDE_NEXT_EXIT, this.hideNext, this);
        AppGame.ins.bjModel.on(MBJ.SHOW_NEXT_EXIT, this.showNext, this);
        AppGame.ins.bjModel.on(MBJ.HIDE_MASK, this.show_mask, this);
        AppGame.ins.bjModel.on(MBJ.HIDE_ANI, this.hide_ani, this);
        AppGame.ins.bjModel.on(MBJ.USSTAUTS_CHANGE, this.usstauts_change, this);
        // AppGame.ins.hallModel.on(MHall.GETSCROLLERMSG,this.add_data,this);
        AppGame.ins.bjModel.on(MBJ.DELETE_USER, this.delete_user, this);
        AppGame.ins.bjModel.on(MBJ.ADD_PLAYER, this.add_player, this);
        AppGame.ins.bjModel.on(MBJ.SHOW_CHAT, this.show_chat, this);
        AppGame.ins.bjModel.on(MBJ.SHOW_NUMBER, this.showOrderNum, this);
        AppGame.ins.bjModel.on(MBJ.RESET_SCENE, this.reset_scene, this);
        AppGame.ins.bjModel.on(MBJ.SHOW_RESULT, this.show_result, this);
        AppGame.ins.bjModel.on(MBJ.GAMESCENE_PLAY, this.gamescene_play, this);
        AppGame.ins.bjModel.on(MBJ.GET_CMD, this.get_comd, this);
        // AppGame.ins.roomModel.on(MBJ.SC_ENTER_ROOM_FAIL, this.enter_room_fail, this);
        // AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK , this.onGameToBack , this);
        //AppGame.ins.appStatus.on(AppStatus.RECONNECT_IN_GAME_BUT_NO_IN_GAMING, this.reconnect_in_game_but_no_in_gaming, this);
    }
    protected onDisable() {
        super.onDisable()
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.bjModel.off(MBJ.CC_UPDATA_SEAT_INFO, this.updatePlayer, this)
        AppGame.ins.bjModel.off(MBJ.CC_DEFAULT_UI, this.defalutUI, this)
        AppGame.ins.bjModel.off(MBJ.SC_TS_FAPAI, this.fapaiOne, this);
        AppGame.ins.bjModel.off(MBJ.SC_TS_FAN_PAI, this.do_fan_pai, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_UPDATA_GAME_NUMBER, this.updata_game_number, this);
        AppGame.ins.bjModel.off(MBJ.CC_CZ_PUT_OUT_CHIP, this.createChip, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_SHOW_OPERATE, this.showPlayOperate, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_SET_ALLCD, this.setAllCd, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_SET_ONECD, this.setOneCd, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_SHOW_JIXU_BTN, this.showContinueBtn, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_SHOW_CAOZUO_BTN, this.setshowcaozuoBtn, this);
        AppGame.ins.bjModel.off(MBJ.SC_TS_CHIP_SCORE, this.updateOnePlayerChip, this);
        AppGame.ins.bjModel.off(MBJ.SC_TS_PLAYER_SCORE, this.updateOnePlayerScore, this);
        AppGame.ins.bjModel.off(MBJ.SC_TS_SHOW_JIESUAN, this.showOnePlayerEndScore, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_SHOW_OTHER_AREA, this.setShowOtherChipArea, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_SHOW_CHIPLIGHT, this.setChipLight, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_SHOW_CHIPLIGHTSPRITE, this.setChipLightSprite, this);
        AppGame.ins.bjModel.off(MBJ.SET_WINIMG, this.setWin, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_SHOW_FENPAI, this.startFenpai, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_SHOW_JUGUANGDENG, this.setlightAngel, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_SHOW_CAOZUO_STATE, this.showPlayOperateState, this);
        AppGame.ins.bjModel.off(MBJ.CC_CZ_FLY_CHIP, this.flyChip, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_SHOW_BAOXIAN_INFO, this.setBaoXian, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_SET_ALLCDNUM, this.setTotalTurnTime, this);
        AppGame.ins.bjModel.off(MBJ.SC_TS_REF_POINT, this.refreshPointMax, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_SHOW_PKSB_IMG, this.setsbImgPos, this);
        AppGame.ins.bjModel.off(MBJ.SC_TS_HAND_ANI, this.lookpokeAni, this);
        AppGame.ins.bjModel.off(MBJ.PUSH_SCORE, this.pushScore, this);
        AppGame.ins.bjModel.off(MBJ.CC_TS_SHOW_MATCH, this.setMatch, this);
        AppGame.ins.bjModel.off(MBJ.HIDE_NEXT_EXIT, this.hideNext, this);
        AppGame.ins.bjModel.off(MBJ.SHOW_NEXT_EXIT, this.showNext, this);
        AppGame.ins.bjModel.off(MBJ.HIDE_MASK, this.show_mask, this);
        AppGame.ins.bjModel.off(MBJ.HIDE_ANI, this.hide_ani, this);
        AppGame.ins.bjModel.off(MBJ.USSTAUTS_CHANGE, this.usstauts_change, this);
        // AppGame.ins.hallModel.off(MHall.GETSCROLLERMSG,this.add_data,this);
        AppGame.ins.bjModel.off(MBJ.DELETE_USER, this.delete_user, this);
        AppGame.ins.bjModel.off(MBJ.ADD_PLAYER, this.add_player, this);
        AppGame.ins.bjModel.off(MBJ.SHOW_CHAT, this.show_chat, this);
        AppGame.ins.bjModel.off(MBJ.SHOW_NUMBER, this.showOrderNum, this);
        AppGame.ins.bjModel.off(MBJ.RESET_SCENE, this.reset_scene, this);
        AppGame.ins.bjModel.off(MBJ.SHOW_RESULT, this.show_result, this);
        AppGame.ins.bjModel.off(MBJ.GAMESCENE_PLAY, this.gamescene_play, this);
        AppGame.ins.bjModel.off(MBJ.GET_CMD, this.get_comd, this);
        //AppGame.ins.roomModel.off(MBJ.SC_ENTER_ROOM_FAIL, this.enter_room_fail, this);
        //AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK , this.onGameToBack , this);
        //AppGame.ins.appStatus.off(AppStatus.RECONNECT_IN_GAME_BUT_NO_IN_GAMING, this.reconnect_in_game_but_no_in_gaming, this);
        AppGame.ins.bjModel.exit();
    }

    // 点击聊天
    private onClickChat(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showUI(ECommonUI.UI_CHAT_HY);
    }

    /**进入房间失败 */
    protected enter_room_fail(errorCode: number, errorMsg?: any): void {

        if (errorCode == 16 || errorCode == 7 || errorCode == 11) {
            setTimeout(() => {
                if (AppGame.ins.bjModel._isExit) {
                    return
                } else {
                    super.enter_room_fail(errorCode, errorMsg);
                }
                AppGame.ins.bjModel._battleplayer = {};
            }, 7000);
        } else {
            super.enter_room_fail(errorCode, errorMsg);
            AppGame.ins.bjModel._battleplayer = {};
        }


        return
        // let self = this;
        // if (errorMsg != null)
        //     // AppGame.ins.showTips(errorMsg);
        // switch (errorCode) {
        //     case EEnterRoomErrCode.ERROR_ENTERROOM_GAME_IS_END:
        //         // AppGame.ins.showUI(ECommonUI.MsgBox, {
        //         //     type: 1, data: ULanHelper.BATTLE_OVER, handler: UHandler.create(() => {
        //         //         this.waitbattle();
        //         //         AppGame.ins.qzjhModel.requestMatch();
        //         //     }, this)
        //         // });
        //         // this.reconnect_in_game_but_no_in_gaming();
        //         break;
        //     case EEnterRoomErrCode.ERROR_ENTERROOM_SEAT_FULL:
        //     case EEnterRoomErrCode.ERROR_ENTERROOM_TABLE_FULL:
        //         {

        //         }
        //         break;
        //     case EEnterRoomErrCode.ERROR_ENTERROOM_LONGTIME_NOOP:
        //         {
        //             AppGame.ins.bjModel._battleplayer = {};
        //             AppGame.ins.showUI(ECommonUI.NewMsgBox, {
        //                 type: 1, data: errorMsg, handler: UHandler.create(() => {
        //                     AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BJ);
        //                 }, this)
        //             });
        //         }
        //         break;
        //     default:
        //         if(errorCode == 7){
        //             var msg =  "您的金币不足，该房间需要" + self._enterMinScore*ZJH_SCALE + "金币以上才可以下注";
        //         }else{
        //             var msg = ULanHelper.ENTERROOM_ERROR[errorCode];
        //         }
        //         if (!msg) {
        //             msg = ULanHelper.GAME_INFO_ERRO;
        //         }
        //         this.scheduleOnce(function(){
        //             AppGame.ins.showUI(ECommonUI.NewMsgBox, {
        //                 type: 1, data: msg, handler: UHandler.create(() => {
        //                     AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BJ);
        //                 }, this)
        //             });
        //         },5.5)
        //         break;
        // }

    }
    /*
    private enter_room_fail(errorCode: number): void {
        UDebug.Info(errorCode)

        if(errorCode != null)
        //AppGame.ins.showTips(errorCode);

            switch (errorCode) {
                case EEnterRoomErrCode.ERROR_ENTERROOM_GAME_IS_END:
                    AppGame.ins.showUI(ECommonUI.MsgBox, {
                        type: 1, data: ULanHelper.BATTLE_OVER, handler: UHandler.create(() => {
                            this.waitbattle();
                            AppGame.ins.bjModel.requestMatch();
                        }, this)
                    });
                    break;
                case EEnterRoomErrCode.ERROR_ENTERROOM_SEAT_FULL:
                case EEnterRoomErrCode.ERROR_ENTERROOM_TABLE_FULL:
                    {
                        this._match.hide();
                        this._match.mathFail();

                    }
                    break;
                case EEnterRoomErrCode.ERROR_ENTERROOM_SCORENOENOUGH:
                    {
                        AppGame.ins.showUI(ECommonUI.MsgBox, {
                            type: 1, data: ULanHelper.PLAYER_FENSHU_BUZU, handler: UHandler.create(() => {
                                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BJ);
                            }, this)
                        });

                    }
                    break;
                default:
                    AppGame.ins.showUI(ECommonUI.MsgBox, {
                        type: 1, data: ULanHelper.ROOM_INFO_ERRO, handler: UHandler.create(() => {
                            AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BJ);
                        }, this)
                    });
                    break;
            }
            
    }
    /*
    private onGameToBack(data: any)
    {
        UDebug.Info(data)
    }

    */
    protected reconnect_in_game_but_no_in_gaming(): void {
        super.reconnect_in_game_but_no_in_gaming()
        this.clearRes()
        this.waitbattle();
        // this.showContinueBtn(true)
        AppGame.ins.bjModel.requestMatch();
        //AppGame.ins.roomModel.requestMatch();
    }

    private toCharge(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showUI(ECommonUI.LB_Charge);
    }

    private copyNumber(): void {
        if (this._bianhao.node.active == false) {
            return
        } else {
            AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
            UAudioManager.ins.playSound("audio_click");
            UAPIHelper.onCopyClicked((this._copy_number.getChildByName("bianhao").getComponent(cc.Label).string).substr(5, 30));
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

    private pushScore() {
        AppGame.ins.bjModel.emit(MBJ.GET_SCORE, this._seats[0].getselfScore)   //下注滑动条分
        this._addChips.getscore(this._seats[0].getselfScore)  //下注按钮
    }


    private fapaiOne(data: UIBJFanPai, fapaibackcall?: UHandler): void {
        const element = this._seats[data.seatId];
        if (fapaibackcall) {
            element.fapaiOne(data, fapaibackcall);
        }
        else {
            element.fapaiOne(data, null);
        }
    }

    //**刷新单个牌点 */
    private refreshPointMax(id: number, isOnehand: number) {
        this._seats[id].refreshPointMax(isOnehand)

    }
    /**继续游戏 */
    private goonGame(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.bjModel._battleplayer = {};
        AppGame.ins.roomModel.requestMatch();
        this.clearRes()

        this.waitbattle();
        //---测试分牌

        // for(let i = 0 ;i<5 ; i ++)
        // {

        //     this._seats[i].startfenPai();
        // }
    }

    update(dt: number) {
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                if (!element.isFree) {
                    element.update(dt);
                }
            }
        }
        AppGame.ins.bjModel.update(dt)
    }

    private updata_game_number(roundid: string, difen: number): void {
        this._pjbhbg.active = true;
        this._bianhao.node.active = true;
        this._bianhao.string = ULanHelper.GAME_NUMBER + roundid;
        this._addChips.setdizhu(difen);
        this._match.hide();
    }
    updatePlayer(player: EBJPlayerInfo): void {
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];

                let data = player[element.seatId];
                if (data) {
                    element.bind(data);
                    element.setTotalTurnTime(data.cdtime)
                    element.enterTurn(data.cdtime)
                    element.showHead();

                    if (data.userStatus == 4) {
                        element._gf_mengban1.node.active = true;
                    } else {
                        element._gf_mengban1.node.active = false;
                    }


                    // this._match.hide();
                }
                else {
                    if (key != "5") {
                        if (element._otherSeatsName.node.active == false) {
                            element.free();
                            element.hideHead();
                        }

                    }
                }
            }

        }

    }

    //更新一个玩家的下注分 //下注的区 
    updateOnePlayerChip(id: number, wUserScore: number, wJettonScore: number, selfSeat: number): void {
        this._seats[id].updateChip(wJettonScore);
        this._seats[selfSeat].setScore(wUserScore);

        if (id != selfSeat) {
            this._seats[id].setOtherName(true, this._seats[selfSeat].userId.toString());
        }
        else {
            if (id == 0) {

                this.pushScore()  //更新下注判断
            }
        }

    }

    private show_mask(value): void {
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                if (!element.isFree) {
                    if (AppGame.ins.bjModel._state == EBJState.Wait) {
                        element._gf_mengban1.node.active = false;
                    } else {
                        element._gf_mengban1.node.active = value;
                    }
                }
                else {
                    if (element.prop) {
                        element.prop.active = false;
                    }

                }
            }

        }

    }

    private hide_ani(): void {
        this._an_node.active = false;
    }

    private usstauts_change(data1, data2): void {
        // if(data2 == 6 || data2 == 0 && (data1 !== AppGame.ins.roleModel.useId)){

        // }
    }

    private updateOnePlayerScore(id: number, score: number) {
        this._seats[id].setScore(score)
        if (id == 0) {
            this.pushScore()
        }
    }

    private showOnePlayerEndScore(id: number, score: number, value: boolean): void {
        if (!this._seats[id].isFree) {
            this.scheduleOnce(function () {
                if (value) {

                    this._seats[id].result(score)
                    this._chipManager.reset();
                }
                else {
                    this._seats[id].resultDel(score)
                }

            }, 1);
        }


    }
    /**显示 第几手牌赢 */
    setWin(id: number, handpos: number): void {
        this._seats[id].setWin(handpos)
    }
    //**设置双倍图片位置  几手牌*/
    setsbImgPos(id: number, handpos: number) {
        this._seats[id].setsbImgPos(handpos);
    }

    // /**創建籌碼 */
    // private createChip(caller: UIBJChip,endPos:number,index:number): void {
    //     let len = caller.items.length;
    //     for (let i = 0; i < len; i++) {
    //         const element = caller.items[i];
    //         let seat = this._seats[element.seatId];
    //         let endseat =  endPos ?this._seats[endPos]:seat

    //         this._chipManager.createChip(seat.getSeatWordPos(),endseat.getChipWordPos(index), element.chipType, element.gold, 1, element.objId);

    //         
    //     }
    // }
    //创建筹码
    private createChip(selfPos: number, endPos: number, areaType: number, chipNum?: number): void {
        let startSeat = this._seats[selfPos];
        let endseat = this._seats[endPos]
        let value = chipNum ? chipNum : 500
        for (let i = 1; i <= 5; i++) {
            if (value * BJ_SCALE > AppGame.ins.bjModel.getCurDiZhu * i) {
                this._chipManager.createChip(selfPos, endPos, startSeat.getSeatWordPos(), endseat.getChipWordPos(areaType), areaType, i) //筹码颜色随机
            }
            else if (value * BJ_SCALE == AppGame.ins.bjModel.getCurDiZhu * i) {
                this._chipManager.createChip(selfPos, endPos, startSeat.getSeatWordPos(), endseat.getChipWordPos(areaType), areaType, 0) //筹码颜色随机
            }
            else {
                this._chipManager.createChip(selfPos, endPos, startSeat.getSeatWordPos(), endseat.getChipWordPos(areaType), areaType, 0) //筹码颜色随机
            }
        }

        UAudioManager.ins.playSound("audio_coinsfly");
    }
    //移动筹码不消失
    private moveChip(seatid: number, endId: number, areaType?: number, endType?: number): void {
        let endseat = this._seats[endId]
        let endPos = endType ? endseat.getChipWordPos(endType) : endseat.getSeatWordPos();
        this._chipManager.moveChip(seatid, endPos, areaType)
        UAudioManager.ins.playSound("audio_coinsfly");
    }
    //飞筹码消失
    private flyChip(seatid: number, endId: number, areaType?: number, endType?: number): void {

        if (this._seats[endId]._otherSeatsName.node.active) {
            if (this._seats[endId]._otherSeatsName.spriteFrame == this._res.getFrames("self_seat")) {
                endId = 0;
            } else if (this._seats[endId]._otherSeatsName.spriteFrame == this._res.getFrames("seat1")) {
                endId = AppGame.ins.bjModel.getUISeatId(0);
            } else if (this._seats[endId]._otherSeatsName.spriteFrame == this._res.getFrames("seat2")) {
                endId = AppGame.ins.bjModel.getUISeatId(1);
            } else if (this._seats[endId]._otherSeatsName.spriteFrame == this._res.getFrames("seat3")) {
                endId = AppGame.ins.bjModel.getUISeatId(2);
            } else if (this._seats[endId]._otherSeatsName.spriteFrame == this._res.getFrames("seat4")) {
                endId = AppGame.ins.bjModel.getUISeatId(3);
            } else if (this._seats[endId]._otherSeatsName.spriteFrame == this._res.getFrames("seat5")) {
                endId = AppGame.ins.bjModel.getUISeatId(4);
            }
        }
        let endseat = this._seats[endId];
        let endPos = endType ? endseat.getChipWordPos(endType) : endseat.getSeatWordPos();
        this._chipManager.moveChip(seatid, endPos, areaType, true)
        UAudioManager.ins.playSound("audio_coinsfly");
    }


    //**分牌 */
    private startFenpai(id: number, isvalue?: boolean): void {

        this.createChip(id, id, 3, this._seats[id].getChipNum / BJ_SCALE);
        this.moveChip(id, id, 0, 2);
        this._seats[id].startfenPai(isvalue);

    }
    /**显示玩家的当前操作 */
    private showPlayOperate(id: number, isOnehand: boolean): void {
        this._seats[id].setPokeLight(isOnehand)

    }

    /**显示玩家的操作 结果*/
    private showPlayOperateState(id: number, state: number): void {
        if (!this._seats[id].isFree) {
            this._seats[id].showOperateState(state)
        }

    }
    private do_fan_pai(caller: UIBJFanPai): void {
        let seat = this._seats[caller.seatId];
        //if (caller.playPos == 0) this._music.playKanPai(seat.sex);
        // seat.fanpaiOne(caller.poker, caller.withAnimation, UHandler.create(() => {
        //     //this._canGetCmd = true;
        //     //if (caller.playPos == 0) this._music.playPaiXing(caller.poker.pokerType);
        // }, this));
    }

    private temp = 0;
    private ts_fapai(index: number, deal: number): void {
        for (const key in this._seats) {
            // if (this._seats.hasOwnProperty(key)) {
            //     const element = this._seats[key];
            //     if (!element.isFree) {
            //         if (element.seatId == BJ_SELF_SEAT) {
            //             //element.fapai(UHandler.create(() => {
            //                 element.fapaiOne(index,deal,UHandler.create(() => {
            //                 //this._canGetCmd = true;
            //             }, this));
            //         } else {
            //            // element.fapai(null);
            //            element.fapaiOne(index,deal,null);
            //         }
            //     }
            // }
        }
        //this._music.playfapai();   
    }
    //设置聚光灯
    private setlightAngel(seatId: number, value?: boolean): void {
        this._light.active = value;
        this._light.setRotation(this._lightPos[seatId]);
        for (let i = 0; i < 5; i++) {
            this._seats[i].startCaozuo(false)
        }
        this._seats[seatId].startCaozuo(value)
    }
    //设置总操作时间
    setTotalTurnTime(value: number): void {
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                element.setTotalTurnTime(value);

            }
        }
    }
    //设置单个冷却
    private setOneCd(id: number, value: boolean, cdtime?: number): void {
        for (let i = 0; i <= 4; i++) {
            const element = this._seats[id];
            if (!element.isFree) {
                if (id == i) {
                    value ? element.enterTurn(cdtime) : element.leaveTurn();
                    value ? element._isTurn = true : element._isTurn = false;
                    return
                }
            }
        }
    }

    //设置所有冷却
    private setAllCd(value: boolean, cdtime?: number): void {
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                value ? element.enterTurn(cdtime) : element.leaveTurn();
            }
        }
    }

    //设置下注区域光
    private setChipLight(id: number, value: boolean): void {
        this._seats[id].setChipLight(value)
    }
    //关闭下注区域光图片
    private setChipLightSprite(): void {
        //for(let i = 1 ; i <=5 ; i++)
        //this._seats[i].setChipLightSprite(false)

    }

    /**保险看牌动画 */
    private lookpokeAni(handler?: UHandler) {
        this._kanpai_ori.unscheduleAllCallbacks()
        this._kanpai_ori.scheduleOnce(() => {
            this._kanpai_ori.node.active = true;
            this._pokerNode.getChildByName("poker_6").getChildByName("gf_poker2").active = false;
            this._tips.active = true;
            this._kanpai_ori.setAnimation(0, "zhuangjiakanpai", false);
            this._kanpai_ori.setCompleteListener((event) => {
                this._kanpai_ori.node.active = false;
                this._tips.active = false;
                this._pokerNode.getChildByName("poker_6").getChildByName("gf_poker2").active = true;
                if (handler != null) handler.run();
            });
        }, 1)

    }

    //设置保险标志
    private setBaoXian(id: number, value?: boolean, isself?: boolean): void {
        if (isself) {
            this._seats[id].setBaoxianInfo(value);
        }
        else {
            this._seats[id].setOtherBaoImage(value)
        }
        this._seats[id].updatebaoxianScore(value);//d更新保险分
    }


    //**显示 其他下注区 */
    setShowOtherChipArea(value: boolean, id?: number): void {

        if (id) {
            const element = this._seats[id];
            if (element.isFree) {
                element.setOtherName(!value)
                element.setChipLight(value)
            }

        }
        else {
            //显示其他可以下注的区域
            for (let i = 1; i < 5; i++) {
                const element = this._seats[i];
                if (value) {
                    if (element.isFree) {
                        element.setOtherName(!value)
                        element.setChipLight(value)

                    }
                }
                else {
                    if (element.isFree) {
                        element.setChipLight(false)
                        element.setOtherImage(false)
                    }

                }
            }
        }
    }

    //**显示 操作按钮 */
    setshowcaozuoBtn(value: boolean, index: number, code?: number, seatid?: number): void {
        this._match.hide();
        if (AppGame.ins.currRoomKind == 2) {
            this._toggle_xjlc.active = value;
        }
        this._addchipNode.active = value;
        this._addChips.setChipNodeActive(index, code);
        if (value) {

            if (index == 1 || index == 2) {
                this._addChips.getscore(this._seats[0].getselfScore)  //下注按钮
            }
            else if (index == 4)//更新分牌双倍金币不足逻辑 
            {
                if (seatid != null) {
                    let chipid = AppGame.ins.bjModel.getFenPaiYuanSeatId(seatid)
                    if (seatid > 5) //二手牌
                    {
                        this._addChips.setCaozuobtn(this._seats[0].getselfScore, this._seats[chipid].chipNum2)
                    }
                    else  //一手牌
                    {
                        this._addChips.setCaozuobtn(this._seats[0].getselfScore, this._seats[chipid].chipNum1)
                    }

                }
            }
        }
    }


    setMatch(value: boolean) {
        if (value) {
            if (AppGame.ins.currRoomKind == 2) {
                this.waitbattle();
            } else {
                // this._match.show();
                this.showContinueBtn(true);
            }

            // this.clearRes();
            // this._match.show();
        }
        else {
            this._match.hide();
            // this.showContinueBtn(true)
        }

    }
    /**显示继续游戏按钮 */
    showContinueBtn(value: boolean): void {
        if (this._btnGoon) {
            if (value) {
                this._btnGoon.scheduleOnce(() => {
                    this._btnGoon.node.active = value;
                    this._match.hide();
                }, 3)

            }
            else {
                this._btnGoon.unscheduleAllCallbacks()
                this._btnGoon.node.active = value; //测试修改
            }
        }
        //this._light.active = false;
        this.setlightAngel(0, false)
        //if (value)  this._chipManager.reset();
    }

    //**默认ui显示 */
    defalutUI(): void {
        // this._match.hide();
        // this._match.show();
        this._an_node.active = false;
        for (let i = 0; i <= 5; i++) {
            this._seats[i].clear()

        }

        // this.showContinueBtn(false)
        this._addchipNode.active = false;
        this.setlightAngel(0, false);
        //this._light.active = false;

    }
    //清理数据
    clearRes(): void {
        AppGame.ins.bjModel.clearCmds()
        this._chipManager.reset();
        for (let i = 0; i <= 5; i++) {
            this._seats[i].clear()
        }
        AppGame.ins.bjModel.clearPlayer()
        this.defalutUI();
    }

    /**是否退出游戏 */
    private isExitGame(e: cc.Toggle) {
        AppGame.ins.bjModel.sendNextExit(e.isChecked);
    }

    private delete_user(a): void {
        if (a !== 0) {
            this._seats[a].free();
        }

    }

    private add_player(a): void {
        this._seats[a.seatId].bind(a.caller);
        if (a.caller.userStatus == 5) {
            this._seats[a.seatId].showHead();
        } else {
            this._seats[a.seatId].showOffHead();
        }
    }

    private show_chat(value): void {
        this.chatBtn.active = value;
    }

}
