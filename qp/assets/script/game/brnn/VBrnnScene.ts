import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "../../public/base/AppGame";
import { Brnn } from "../../common/cmd/proto";
import { RoomInfo } from "../../public/hall/URoomClass";
import { ECommonUI, ETipType, EIconType } from "../../common/base/UAllenum";
import VBrnnAnimaMgr from "./view/VBrnnAnimaMgr";
import MBrnn from "./model/MBrnn";
import BrnnAnimation from "./BrnnAnimation";
import VBrnnRect from "./view/VBrnnRect";
import VBrnnCardGrop from "./view/VBrnnCardGrop";
import UAudioRes from "../../common/base/UAudioRes";
import UBrnnMusic from "./UBrnnMusic";
import BrChipPool from "../common/BrChipPool";
import UGame from "../../public/base/UGame";
import BrlhSeat from "../common/BrlhSeat";
import UDebug from "../../common/utility/UDebug";
import UEventHandler from "../../common/utility/UEventHandler";
import ULanHelper from "../../common/utility/ULanHelper";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import UStringHelper from "../../common/utility/UStringHelper";
import MRole from "../../public/hall/lobby/MRole";
import { EventManager } from "../../common/utility/EventManager";
import cfg_event from "../../config/cfg_event";
import CommVillage from "../common/CommVillage";
import VBrjhScene from "../brjh/VBrjhScene";
import BrChipNewGroup from "../common/BrChipNewGroup";


/**
 * 天 ：1    地： 2     玄： 3      黄： 4
 */
const { ccclass, property } = cc._decorator;

enum GAME_STATUS {
    LH_GAME_START = 1,      // 开始下注
    LH_GAME_START_TIPS = 2, // 下注快结束了
    LH_GAME_STOP = 3,       // 停止下注
    LH_GAME_END = 4,        // 结束
    LH_GAME_FREE = 5,       // 空闲
}


const CHIP_COUNT = 80;  // 每个区域筹码池个数

const GoldRate = 100;    // (1:100) (所有显示的地方都除以 GoldRate)

const FREE_TIME = 2;  // 自定义空闲时间
var BET_TIME = 0;

const my_seat_id = 6;   // 玩家自己的座位
const no_seat_id = 7;  // 无座

const MAX_TIME_END = 13;
const MAX_TIME_BET = 13;

const COUNT_DOWN = 5;

const DELT_LUDAN_UPDATE = 6;
const DELT_END_UPDATE = 8;  // 游戏结算，延时更新动画
const DELT_PIAO = 8;


/***
 * 创建: 朱武
 * 作用: 百人牛牛 主场景
 */

@ccclass
export default class VBrnnScene extends UGame {

    @property(VBrnnAnimaMgr) vbrnn_animamgr: VBrnnAnimaMgr = null;
    @property(cc.Node) node_desk: cc.Node = null;
    @property(cc.SpriteFrame) cardbg_frame: cc.SpriteFrame = null;
    @property(cc.Sprite) z_head: cc.Sprite = null;
    @property(cc.Sprite) z_headBox: cc.Sprite = null;
    @property({ type: cc.Label, tooltip: "在线人数" }) lab_online_count: cc.Label = null;
    @property(cc.Node) node_bottom: cc.Node = null;
    @property({ type: [cc.Node], tooltip: "幸运星星" }) node_luckys: cc.Node[] = [];
    @property({ type: cc.Node, tooltip: "特效层" }) node_effect: cc.Node = null;
    @property({ type: cc.Node, tooltip: "发牌层" }) node_send_card: cc.Node = null;
    @property(cc.Node) node_jetton_tip: cc.Node = null;
    @property(cc.Node) node_ludan: cc.Node = null;
    @property(cc.Sprite) sp_status: cc.Sprite = null;
    @property(cc.Label) lab_leavetime: cc.Label = null;
    @property(cc.Sprite) sp_clock_mask: cc.Sprite = null;
    @property([cc.SpriteFrame]) spf_ludan: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame]) spf_status: cc.SpriteFrame[] = [];
    @property(cc.Node) node_tips: cc.Node = null;
    @property(cc.Node) node_wait_next: cc.Node = null;
    @property(cc.Node) lose_Node: cc.Node = null;
    @property(cc.Node) win_Node: cc.Node = null;
    @property(cc.Node) ludan_1_Cantainer: cc.Node = null;
    @property(cc.Node) ludan_2_Cantainer: cc.Node = null;
    @property(cc.Node) ludan_3_Cantainer: cc.Node = null;
    @property(cc.Node) ludan_4_Cantainer: cc.Node = null;
    @property(cc.Node) layer_chip: cc.Node = null;
    @property(cc.Node) lab_gold_total_Desc_1: cc.Node = null;
    @property(cc.Node) lab_gold_total_Desc_2: cc.Node = null;
    @property(cc.Node) lab_gold_total_Desc_3: cc.Node = null;
    @property(cc.Node) lab_gold_total_Desc_4: cc.Node = null;
    @property(cc.Node) roundNode: cc.Node = null;
    @property(cc.Node) currTogglebtn: cc.Node = null;
    _layer_wait_login: cc.Node = null;   // 正在进来房间
    node_chips: cc.Node[] = [];
    _brnn_model: MBrnn = null;// 游戏model
    _self_id = 0;
    _leave_time = 0;   // 状态倒计时
    clockMaxTime = 0;   // 状态总倒计时
    static game_status = GAME_STATUS.LH_GAME_START;
    _lab_pjbh: cc.Label = null; // 
    lab_pjbh: cc.Node = null;
    _charge_btn: cc.Node = null;
    _room_info: RoomInfo = null;
    _chipgroup: BrChipNewGroup = null;
    private _sys_news: Array<string>;
    private _emergency_announcement: Array<string>;
    private _checkNode: cc.Node;
    toBack: boolean = false;
    static initEnterGameData: boolean = false;
    onGameEndData: any = null;
    allJettonScore: any = null;
    myReturnScore: number = -1;

    /**
     * 1,2,3,4
     */
    private _rects: { [key: number]: VBrnnRect } = {};

    private _seats: { [key: number]: BrlhSeat } = {};

    private _cards_grop: { [key: number]: VBrnnCardGrop } = {};

    private _send_cards: cc.Node[] = [];

    _ui_root: cc.Node = null;
    _layer_chip: cc.Node[] = [];
    _layer_fly: cc.Node = null;

    _music_mgr: UBrnnMusic = null;
    _leave_bet_sound: number = 0;  // 下注筹码音效间隔播放

    _chips_pool: BrChipPool[] = [];  // 0 结算临时筹码，  1，天  2，地   3，玄   4，黄
    _fly_pool: cc.NodePool = null;


    static is_init: boolean = false;

    _is_first_in: boolean = true;

    _resize_fun: Function = null;

    _sp_rect_1: cc.Button = null;
    _sp_rect_2: cc.Button = null;
    _sp_rect_3: cc.Button = null;
    _sp_rect_4: cc.Button = null;

    _node_continue: cc.Node = null;
    _rectsPlaceOld: number[] = [];
    _score: number = 0;

    @property(cc.Label) goldLabel: cc.Label = null;

    /********************************************************************
     *                                                                  *
     ********************************************************************/

    onLoad() {

        UDebug.Log('onLoad');
    }

    getRandomNum(Min, Max) {
        let Range = Number(Max) - Number(Min);
        let Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }
    start() {
        // UResManager.load(this.getRandomNum(0,19),EIconType.Head,this.z_head);
        // UResManager.load(1,EIconType.Head,this.z_head);
        // UResManager.load(1,EIconType.Frame,this.z_headBox);
    }
    /**sq 修改 需要是否是断线重连进来的 data:ToBattle */
    openScene(data: any) {
        if (data) {
            this._room_info = data.roomData;
        }
        super.openScene(data);
        UDebug.Log(data);
    }



    update(dt: number) {

        if (this._leave_time > 0) {

            let tmp_leave_time = Math.ceil(this._leave_time);
            this._leave_time -= dt;
            if (this._leave_time < 0) {
                this._leave_time = 0;
                this.clockMaxTime = Number(this._leave_time + "");
                this.sp_clock_mask.fillRange = 0;
            }
            let leave_time = Math.ceil(this._leave_time);
            if(leave_time <= 0){
                leave_time = 1;
            }
            let str_time = leave_time.toString();
            this.lab_leavetime.string = str_time;


            if (leave_time == COUNT_DOWN && VBrnnScene.game_status == GAME_STATUS.LH_GAME_START) {
                this.onStartTips(leave_time);
            }

            if (leave_time <= COUNT_DOWN && tmp_leave_time > leave_time && (VBrnnScene.game_status == GAME_STATUS.LH_GAME_START_TIPS)) {
                this._music_mgr.playCountDown();
            }

        }
        if (this._leave_time > 0) {
            this.sp_clock_mask.fillRange = (this._leave_time / this.clockMaxTime);
        }

        this._leave_bet_sound -= dt;
        if (this._leave_bet_sound < 0) {
            this._leave_bet_sound = 0;
        }

    }


    onContinue() {
        this.refContinueBtnState(false);
        for (var k = 0; k < this._rectsPlaceOld.length; k++) {
            var total: number = this._rectsPlaceOld[k]
            var chipCount = parseInt((total / 500).toString())

            for (var j = 0; j < chipCount; j++) {
                AppGame.ins.brnnModel.sendBet(Number(k + 1), 500 * 100);
            }

            total = total % 500
            chipCount = parseInt((total / 100).toString())
            for (var j = 0; j < chipCount; j++) {
                AppGame.ins.brnnModel.sendBet(Number(k + 1), 100 * 100);
            }

            total = total % 100
            chipCount = parseInt((total / 50).toString())
            for (var j = 0; j < chipCount; j++) {
                AppGame.ins.brnnModel.sendBet(Number(k + 1), 50 * 100);
            }

            total = total % 50
            chipCount = parseInt((total / 10).toString())
            for (var j = 0; j < chipCount; j++) {
                AppGame.ins.brnnModel.sendBet(Number(k + 1), 10 * 100);
            }

            total = total % 10
            chipCount = parseInt((total / 5).toString())
            for (var j = 0; j < chipCount; j++) {
                AppGame.ins.brnnModel.sendBet(Number(k + 1), 5 * 100);
            }

            total = total % 5
            chipCount = parseInt((total / 1).toString())
            for (var j = 0; j < chipCount; j++) {
                AppGame.ins.brnnModel.sendBet(Number(k + 1), 1 * 100);
            }
        }
    }

    onToggleClick(e: any) {
        // if(this.currTogglebtn == e.target)return
        // if(this.currTogglebtn != e.target && this.currTogglebtn.getComponent(cc.Toggle).interactable){
        //     this.currTogglebtn.getChildByName("Background").active = true;
        // }
        // this.currTogglebtn = e.target;
        // this.currTogglebtn.getChildByName("Background").active = false;
    }

    protected init() {
        this._sys_news = [];

        this._self_id = AppGame.ins.roleModel.useId;

        this._ui_root = UNodeHelper.find(this.node, 'uinode');
        this._checkNode = UNodeHelper.find(this.node, "uinode/checknode");

        let tmp_chip = UNodeHelper.find(this._ui_root, 'tmp_chip');
        for (let i = 1; i <= 4; i++) {
            let layer_chip_curr = this.layer_chip.getChildByName('layer_chip' + i);
            this._layer_chip[i] = layer_chip_curr;
            this._chips_pool[i] = new BrChipPool(tmp_chip, layer_chip_curr);
            this._chips_pool[i].poolSize = CHIP_COUNT;
        }
        this._layer_fly = this.layer_chip.getChildByName("layer_fly");
        this._chips_pool[0] = new BrChipPool(tmp_chip, this._layer_fly);
        this._chips_pool[0].poolSize = CHIP_COUNT * 4;

        this._sp_rect_1 = UNodeHelper.getComponent(this.node, "uinode/sp_desk/sp_rect_1", cc.Button);
        this._sp_rect_2 = UNodeHelper.getComponent(this.node, "uinode/sp_desk/sp_rect_2", cc.Button);
        this._sp_rect_3 = UNodeHelper.getComponent(this.node, "uinode/sp_desk/sp_rect_3", cc.Button);
        this._sp_rect_4 = UNodeHelper.getComponent(this.node, "uinode/sp_desk/sp_rect_4", cc.Button);


        this._lab_pjbh = UNodeHelper.getComponent(this._ui_root, "node_top/pjbg/lab_paiju", cc.Label);
        this._lab_pjbh.string = '';
        this.roundNode.active = false;
        this._charge_btn = UNodeHelper.find(this.node, "uinode/sp_desk/sp_seat_6/charge_btn");

        this.lab_pjbh = UNodeHelper.find(this._ui_root, "node_top/pjbg");
        this.setHorseLampPos(0, 192);
        UEventHandler.addClick(this._charge_btn, this.node, "VBrnnScene", "intoCharge");
        UEventHandler.addClick(this.lab_pjbh, this.node, "VBrnnScene", "oncopy");


        for (let i = 1; i <= 6; i++) {
            let toggle = UNodeHelper.find(this.node_bottom, 'toggle_container/toggle' + i);
            this.node_chips.push(toggle);
        }

        let chip_container = UNodeHelper.find(this.node_bottom, 'toggle_container');
        this._chipgroup = new BrChipNewGroup(chip_container, -15, -8);
        this._chipgroup.chipValues = this._room_info.jettons;


        for (let i = 0; i <= 7; i++) {
            let seat_node = UNodeHelper.find(this.node_desk, 'sp_seat_' + i);
            let lab_gold = UNodeHelper.getComponent(seat_node, 'lab_gold', cc.Label);
            let lab_name = UNodeHelper.getComponent(seat_node, 'lab_name', cc.Label);
            let lab_vip = UNodeHelper.getComponent(seat_node, 'lab_vip', cc.Label);
            this._seats[i] = new BrlhSeat(seat_node, lab_name, lab_gold, lab_vip);
        }

        this._seats[no_seat_id].show();
        //初始化下注区域
        for (let i = 1; i < 5; i++) {
            let rect_node = UNodeHelper.find(this.node_desk, 'sp_rect_' + i);
            let container = UNodeHelper.find(rect_node, 'container');
            let lab_total = UNodeHelper.getComponent(container, 'lab_gold_total', cc.Label);
            let lab_self = UNodeHelper.getComponent(container, 'lab_my_xiazhu', cc.Label);
            let desc_bg = UNodeHelper.find(container, 'lab_gold_total_Desc');
            let rect = new VBrnnRect(rect_node, lab_total, lab_self, desc_bg);
            this._rects[i] = rect;
        }


        for (let i = 0; i < 5; i++) {
            let card_node = UNodeHelper.find(this.node_desk, 'node_cards_' + i);
            let card = new VBrnnCardGrop(card_node, this._music_mgr);
            this._cards_grop[i] = card;
        }
        this._cards_grop[0].isbanker = true;

        for (let i = 0; i < 25; i++) {
            let card = new cc.Node();
            let sp = card.addComponent(cc.Sprite);
            sp.spriteFrame = this.cardbg_frame;
            sp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            sp.type = cc.Sprite.Type.SIMPLE;
            card.setContentSize(72.5, 96.7);
            card.scale = 1;
            card.parent = this.node_send_card;
            card.x = 0;
            card.y = 100;
            this._send_cards.push(card);
        }

        // this._layer_wait_login = UNodeHelper.find(this.node, 'uinode/node_wait_login');
        // this._layer_wait_login.active = true;

        this._node_continue = UNodeHelper.find(this.node_bottom, "btn_xutou");
        UEventHandler.addClick(this._node_continue, this.node, "VBrnnScene", "onContinue");
        this.refContinueBtnState(false);
        /******************** */

        let user = {
            userId: AppGame.ins.roleModel.useId,
            nickName: AppGame.ins.roleModel.nickName,
            score: AppGame.ins.roleModel.score,
            headerId: AppGame.ins.roleModel.headId,
            headboxId: AppGame.ins.roleModel.headboxId,
            vip: AppGame.ins.roleModel.vipLevel,
            headImgUrl: AppGame.ins.roleModel.headImgUrl
        }

        this.setMySeatInfo({ user: user });



        if (VBrnnScene.game_status == GAME_STATUS.LH_GAME_FREE || VBrnnScene.game_status == GAME_STATUS.LH_GAME_START) {
            this.sendCard();
        }

        this.clearDesk(true);

        let self = this;
        this._resize_fun = () => {
            self._seats[no_seat_id].updatePosition();
            self._seats[my_seat_id].updatePosition();
        }
        cc.game.on('resize', this._resize_fun);
    }


    /**
     * 清理桌面
     */
    clearDesk(isStorn = false) {
        this.vbrnn_animamgr.clear();

        this.node_wait_next.active = false;
        // this._layer_wait_login.active = false;

        // 清理下注
        for (let i = 1; i <= 4; i++) {
            this.node_luckys[i].active = false;

            this._layer_chip[i].stopAllActions();
            this._layer_chip[i].destroyAllChildren();
        }

        for (let i = 0; i < 4; i++) {
            this._chips_pool[i].clear();
        }

        this.node_send_card.stopAllActions();
        this.node_send_card.active = false;

        this.node_jetton_tip.active = false;

        this.node_effect.removeAllChildren();

        if (isStorn) {
            this._rectsPlaceOld = []
            for (let i in this._rects) {
                this._rectsPlaceOld.push(Number(this._rects[i]._lab_self_score.string))
                this._rects[i].clear();
            }
            this.myReturnScore = -1;
        }

        for (let i in this._seats) {
            this._seats[i].clear();
        }

        for (let i in this._cards_grop) {
            this._cards_grop[i].clear();
        }

        this._ui_root.stopAllActions();
        for (let index = 0; index < this._layer_fly.children.length; index++) {
            let chip = this._layer_fly.children[index];
            if (chip) {
                chip.stopAllActions();
                chip.active = false;
            }
        }
        this._layer_fly.destroyAllChildren();
    }

    onDestroy() {
    }

    protected onEnable() {
        super.onEnable();
        this._music_mgr = new UBrnnMusic(this.node.getComponent(UAudioRes));
        this.initModelEventListener();
        this._music_mgr.playGamebg();
    }

    protected onDisable() {
        super.onDisable();
        VBrnnScene.is_init = false;
        if (this._resize_fun)
            cc.game.off('resize', this._resize_fun);

        this.removeModelEventListener();
    }

    private updateScore(): void {
        if (AppGame.ins.roleModel.score < AppGame.ins.game_watch_limit_score) {
            this._checkNode.active = true;
            if (this.currTogglebtn != null && this.currTogglebtn.name == "toggle1")
                this.currTogglebtn.getChildByName("Background").active = true;
        } else {
            this._checkNode.active = false;
        }
    }

    private requestScore(): void {
        AppGame.ins.roleModel.requestUpdateScore();
    }

    /**
     * 监听model事件
     */
    private initModelEventListener() {
        this._brnn_model = AppGame.ins.brnnModel;
        this._brnn_model.on(MBrnn.S_GAME_START, this.onGameStart, this);
        this._brnn_model.on(MBrnn.S_SYNC_TIME, this.onSyncTime, this);
        this._brnn_model.on(MBrnn.S_SEND_RECORD, this.onGameRecord, this);
        this._brnn_model.on(MBrnn.S_START_PLACE_JETTON, this.onStartPlaceJetton, this);
        this._brnn_model.on(MBrnn.S_PLACE_JET_FAIL, this.onPlaceJettonFail, this);
        this._brnn_model.on(MBrnn.S_PLACE_JETTON, this.onPlaceJetton, this);
        this._brnn_model.on(MBrnn.S_GAME_END, this.onGameEnd, this);
        this._brnn_model.on(MBrnn.S_JETTON_BROADCAST, this.onJettonBroadcast, this);
        this._brnn_model.on(MBrnn.S_GAME_START, this.requestScore, this);
        this._brnn_model.on(MRole.UPDATEBUTTON, this.updateButton, this);
        this._brnn_model.on(MRole.BANKERINFO, this.updateInfo, this);//更新排队信息

        this._brnn_model.on(MBrnn.GAMESCENE_STATUS_FREE, this.onGameSceneStatusFree, this);
        this._brnn_model.on(MBrnn.GAMESCENE_STATUS_JETTON, this.onGameSceneStatusJetton, this);
        this._brnn_model.on(MBrnn.GAMESCENE_STATUS_OPEN, this.onGameSceneStatusOpen, this);
        this._brnn_model.on(MBrnn.GAMESCENE_STATUS_END, this.onGameSceneStatusEnd, this);
        this._brnn_model.on(MBrnn.OPEN_CARD, this.onOpenCard, this);

        AppGame.ins.brnnModel.on(MBrnn.TO_BACK_CLEAR, this.toBackClear, this);
        AppGame.ins.brnnModel.on(MBrnn.TO_BACK_CLEAR_AFTER, this.toBackClear_After, this);
        EventManager.getInstance().addEventListener(cfg_event.CLOSE_CHARGE, this.updateScore, this);
        this._brnn_model.run();
    }

    private removeModelEventListener() {
        this._brnn_model.off(MBrnn.S_GAME_START, this.onGameStart, this);
        this._brnn_model.off(MBrnn.S_SYNC_TIME, this.onSyncTime, this);
        this._brnn_model.off(MBrnn.S_SEND_RECORD, this.onGameRecord, this);
        this._brnn_model.off(MBrnn.S_START_PLACE_JETTON, this.onStartPlaceJetton, this);
        this._brnn_model.off(MBrnn.S_PLACE_JET_FAIL, this.onPlaceJettonFail, this);
        this._brnn_model.off(MBrnn.S_PLACE_JETTON, this.onPlaceJetton, this);
        this._brnn_model.off(MBrnn.S_GAME_END, this.onGameEnd, this);
        this._brnn_model.off(MBrnn.S_JETTON_BROADCAST, this.onJettonBroadcast, this);
        this._brnn_model.off(MBrnn.S_GAME_START, this.requestScore, this);
        this._brnn_model.off(MRole.UPDATEBUTTON, this.updateButton, this);
        this._brnn_model.off(MRole.BANKERINFO, this.updateInfo, this);//更新排队信息

        this._brnn_model.off(MBrnn.GAMESCENE_STATUS_FREE, this.onGameSceneStatusFree, this);
        this._brnn_model.off(MBrnn.GAMESCENE_STATUS_JETTON, this.onGameSceneStatusJetton, this);
        this._brnn_model.off(MBrnn.GAMESCENE_STATUS_OPEN, this.onGameSceneStatusOpen, this);
        this._brnn_model.off(MBrnn.GAMESCENE_STATUS_END, this.onGameSceneStatusEnd, this);
        this._brnn_model.off(MBrnn.OPEN_CARD, this.onOpenCard, this);

        AppGame.ins.brnnModel.off(MBrnn.TO_BACK_CLEAR, this.toBackClear, this);
        AppGame.ins.brnnModel.off(MBrnn.TO_BACK_CLEAR_AFTER, this.toBackClear_After, this);
        EventManager.getInstance().removeEventListener(cfg_event.CLOSE_CHARGE, this.updateScore, this);
        AppGame.ins.bankerInfo = null;
        AppGame.ins.bankerBurrent = null;
        this._brnn_model.exit();
        // this._brnn_model.targetOff(this);
        UDebug.Log('aaa');
    }

    //点击复制牌局信息
    private oncopy(): void {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this._lab_pjbh.string).substr(5, 30));
    }

    private intoCharge(): void {
        AppGame.ins.showUI(ECommonUI.LB_Charge);
    }


    /**
     * 设置游戏状态 
     * @param status 状态
     * @param leave_time 状态剩余时间
     */
    setGameStatus(status: GAME_STATUS, leave_time: number, isRefTime = true) {
        if (isRefTime) {
            this._leave_time = leave_time;
            this.clockMaxTime = Number(leave_time + "");
        }
        VBrnnScene.game_status = status;

        if (status == GAME_STATUS.LH_GAME_STOP) {
            this.sp_status.spriteFrame = this.spf_status[2];
        } else if (status == GAME_STATUS.LH_GAME_START) {
            this.sp_status.spriteFrame = this.spf_status[1];
        } else if (status == GAME_STATUS.LH_GAME_FREE) {
            this.sp_status.spriteFrame = this.spf_status[0];
        } else if (status == GAME_STATUS.LH_GAME_START_TIPS) {
            this.sp_status.spriteFrame = this.spf_status[1];
        } else if (status == GAME_STATUS.LH_GAME_END) {
            this.sp_status.spriteFrame = this.spf_status[3];
        }
    }


    /**
     * 发牌
     * @param action 是否播放发牌动画
     */
    sendCard(action: boolean = false) {
        if (action) {
            this.node_send_card.active = true;

            let index = this._send_cards.length - 1;

            for (let i = 0; i <= 4; i++) {
                for (let j = 1; j <= 5; j++) {
                    // let index = j - 1 + i * 5;
                    let node = this._send_cards[index];
                    index -= 1;
                    if (index <= 0) index = 0;
                    node.x = 0;
                    node.y = 100 + i * 5 + j;
                    node.angle = 180;
                    node.width = 62.7;
                    node.height = 78.3;
                    // node.scale = 0.6;
                    let des_pos = this._cards_grop[i].cardPos(j);
                    node.stopAllActions();
                    node.runAction(cc.sequence(cc.delayTime(i * 0.3 + j * 0.05),
                        cc.callFunc(() => {
                            this._music_mgr.playSendCard();
                        }, this),
                        cc.spawn(cc.rotateBy(0.2, 180),
                            // cc.scaleTo(0.2, 1),
                            cc.moveTo(0.2, des_pos)),
                        cc.callFunc(() => {
                            node.zIndex = j;
                        })));
                }
            }

            this.node_send_card.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => {
                this.node_send_card.active = false;
                for (let i = 0; i <= 4; i++) {
                    this._cards_grop[i].sendCard();
                }
            }, this)))

        }
        else {
            this.node_send_card.active = false;
            for (let i = 0; i < this._send_cards.length; i++) {
                this._send_cards[i].stopAllActions();
            }

            for (let i = 0; i <= 4; i++) {
                this._cards_grop[i].sendCard();
            }
        }
    }


    /**
     * 设置可下注
     * @param kexiazhu 
     */
    setLabKexiazhuTip(kexiazhu: number) {
        let lab_kexia = UNodeHelper.getComponent(this.node_jetton_tip, 'lab_kexia', cc.Label);
        lab_kexia.string = kexiazhu.toString();
    }

    /**
     * 设置已下注
     * @param kexiazhu 
     */
    setLabYixiazhuTip(kexiazhu: number) {
        let lab_yixia = UNodeHelper.getComponent(this.node_jetton_tip, 'lab_yixia', cc.Label);
        lab_yixia.string = kexiazhu.toString();
    }


    /**
     * 开牌
     * @param cards 牌值 [] [] 
     * @param action 是否播放动画
     */
    openCard(cards: Brnn.ICardGroup[], win_tag: any, action: boolean = true) {

        UDebug.Log(cards);
        for (let i = 0; i < cards.length; i++) {
            let is_win = true;
            if (i != 0) {

                is_win = win_tag[i];
            }
            this._cards_grop[i].sendCard();
            this._cards_grop[i].openCards(cards[i], is_win, action, i * 1);
        }
    }

    moveChipToRect(node: cc.Node, rect: number) {
        var des_pos = this.getBetJettonPos(rect);
        var desc_scale = 1;
        var act_time = 0.5;
        node.opacity = 200;
        node.scale = desc_scale;

        var dt_time = Math.random() * 0.2;
        var rote = 360;
        var seq = cc.sequence(
            cc.delayTime(dt_time),
            cc.spawn(
                cc.moveTo(act_time, des_pos).easing(cc.easeQuadraticActionOut()),
                cc.fadeIn(act_time / 1.5),
                cc.rotateBy(act_time, 360),
                cc.scaleTo(act_time, desc_scale * 1.05)
            ),
            cc.scaleTo(0.2, desc_scale),
        );
        node.stopAllActions();
        node.runAction(seq);
    }

    moveChipToPos(node: cc.Node, pos: cc.Vec2) {
        let del_rand = Math.random() * 0.2;
        let del_time = Math.random() * 0.2;
        node.runAction(cc.sequence(cc.delayTime(del_time), cc.moveTo(0.6, pos).easing(cc.easeBackIn()), cc.delayTime(del_rand), cc.fadeOut(0.1)));
    }

    //检查筹码是否适合飞向自己
    checkChipFlyToMySeat(chip) {
        let otherPosition = UNodeHelper.find(this.node, "uinode/sp_desk/sp_seat_7").position;
        let seat_id = -1;
        for (let i = 0; i < 6; i++) {
            if (this._seats[i].userid == AppGame.ins.roleModel.useId) {
                seat_id = i;
            }
        }
        let mySeatPosition = this._seats[my_seat_id].position;
        if (chip['playerid'] == AppGame.ins.roleModel.useId && this.myReturnScore <= 0) {
            chip['src_x'] = otherPosition.x;
            chip['src_y'] = otherPosition.y;
            return 1;
        }
        if (chip['playerid'] == -1 && chip['src_x'] == mySeatPosition.x && chip['src_y'] == mySeatPosition.y && this.myReturnScore <= 0) {
            chip['src_x'] = otherPosition.x;
            chip['src_y'] = otherPosition.y;
            return 2;
        }
        return -1;
    }

    /**
     * 结算时飞筹码
     */
    flyChip(winindex: boolean[], timeLeave = 3) {
        let del_time = 0;
        let wateDelayTime = timeLeave >= 3 ? 1 : 0.1;
        let is_all_win = false;   // 庄家通赢
        let is_all_lose = false;   // 庄家通赔
        if (winindex[4] == false && winindex[1] == false && winindex[2] == false && winindex[3] == false) is_all_win = true;
        if (winindex[4] == true && winindex[1] == true && winindex[2] == true && winindex[3] == true) is_all_lose = true;

        for (let i = 1; i <= 4; i++) {
            this._layer_chip[i].stopAllActions();
        }
        var node_banker_head = this.node_desk.getChildByName('sp_banker');
        var bankerpos = node_banker_head.position;

        if (is_all_lose) {
            this._layer_chip[1].runAction(cc.sequence(cc.delayTime(del_time), cc.callFunc(() => {
                this.vbrnn_animamgr.playAllLose();
                this._music_mgr.playAllPay();
                let is_play = false;

                for (let i = 1; i <= 4; i++) {
                    for (let index = 0; index < this._layer_chip[i].children.length; index++) {
                        const element = this._layer_chip[i].children[index];
                        var new_chip = this.getChip(0, element['bet_type']);
                        new_chip['src_x'] = element['src_x'];
                        new_chip['src_y'] = element['src_y'];
                        let end = this.checkChipFlyToMySeat(new_chip);
                        new_chip.position = bankerpos;
                        new_chip.parent = this._layer_fly;
                        new_chip.stopAllActions();
                        this.moveChipToRect(new_chip, element['bet_rect']);
                        is_play = true;
                    }
                }

                if (is_play) this._music_mgr.playflyCoin();
            }, this), cc.delayTime(wateDelayTime), cc.callFunc(() => {
                let is_play = false;
                for (let i = 1; i <= 4; i++) {
                    for (let index = 0; index < this._layer_chip[i].children.length; index++) {
                        var chip = this._layer_chip[i].children[index];
                        chip.stopAllActions();
                        let end = this.checkChipFlyToMySeat(chip);
                        this.moveChipToPos(chip, cc.v2(chip['src_x'], chip['src_y']));
                        is_play = true;
                    }
                }

                for (let index = 0; index < this._layer_fly.children.length; index++) {
                    var chip = this._layer_fly.children[index];
                    chip.stopAllActions();
                    let end = this.checkChipFlyToMySeat(chip);
                    this.moveChipToPos(chip, cc.v2(chip['src_x'], chip['src_y']));
                    is_play = true;
                }

                if (is_play) this._music_mgr.playflyCoin();

            }, this)));

        } else if (is_all_win) {
            this._layer_chip[1].runAction(cc.sequence(cc.delayTime(del_time), cc.callFunc(() => {
                this.vbrnn_animamgr.playAllWin();
                this._music_mgr.playAllKill();
                let is_play = false;
                for (let i = 1; i <= 4; i++) {
                    for (let index = 0; index < this._layer_chip[i].children.length; index++) {
                        var chip = this._layer_chip[i].children[index];
                        chip.stopAllActions();
                        this.moveChipToPos(chip, new cc.Vec2(bankerpos.x, bankerpos.y));
                        is_play = true;
                    }
                }
                if (is_play) this._music_mgr.playflyCoin();
            }, this)));
        } else {
            this._layer_chip[1].runAction(cc.sequence(cc.delayTime(del_time), cc.callFunc(() => {  // 庄家先把输的区域的筹码移走
                let is_play = false;
                for (let i = 1; i <= 4; i++) {
                    for (let index = 0; index < this._layer_chip[i].children.length; index++) {
                        var chip = this._layer_chip[i].children[index];
                        if (winindex[chip['bet_rect']] == false) {
                            chip.stopAllActions();
                            this.moveChipToPos(chip, new cc.Vec2(bankerpos.x, bankerpos.y));
                            is_play = true;
                        }
                    }
                }
                if (is_play) this._music_mgr.playflyCoin();
            }, this),

                cc.delayTime(wateDelayTime),

                cc.callFunc(() => {
                    let is_play = false;
                    for (let i = 1; i <= 4; i++) {
                        for (let index = 0; index < this._layer_chip[i].children.length; index++) {          // 在补齐赢的区域的筹码
                            const element = this._layer_chip[i].children[index];

                            if (winindex[element['bet_rect']] == true) {
                                var new_chip = this.getChip(0, element['bet_type']);
                                new_chip['src_x'] = element['src_x'];
                                new_chip['src_y'] = element['src_y'];
                                new_chip['bet_rect'] = element['bet_rect'];
                                new_chip.position = bankerpos;
                                new_chip.parent = this._layer_fly;
                                new_chip.stopAllActions();
                                this.moveChipToRect(new_chip, element['bet_rect']);
                                is_play = true;
                            }
                        }
                    }
                    if (is_play) this._music_mgr.playflyCoin();

                }, this),
                cc.delayTime(wateDelayTime),
                cc.callFunc(() => {
                    let is_play = false;
                    for (let i = 1; i <= 4; i++) {
                        for (let index = 0; index < this._layer_chip[i].children.length; index++) {   //在把筹码分发给玩家
                            var chip = this._layer_chip[i].children[index];
                            if (winindex[chip['bet_rect']] == true) {
                                chip.stopAllActions();
                                let end = this.checkChipFlyToMySeat(chip);
                                this.moveChipToPos(chip, cc.v2(chip['src_x'], chip['src_y']));
                                is_play = true;
                            }
                        }
                    }
                    for (let index = 0; index < this._layer_fly.children.length; index++) {   //在把筹码分发给玩家
                        var chip = this._layer_fly.children[index];
                        if (winindex[chip['bet_rect']] == true) {
                            chip.stopAllActions();
                            let end = this.checkChipFlyToMySeat(chip);
                            this.moveChipToPos(chip, cc.v2(chip['src_x'], chip['src_y']));
                            is_play = true;
                        }
                    }
                    if (is_play) this._music_mgr.playflyCoin();
                }, this)));
        }
    }

    /**
     * 拆分输赢结果
     * @param code 
     */
    getWinTag(code: number): any {
        let tian = (code & 1) != 0;
        let di = (code & 2) != 0;
        let xuan = (code & 4) != 0;
        let huang = (code & 8) != 0;

        return { [1]: tian, [2]: di, [3]: xuan, [4]: huang };
    }

    /**
     * 赢了的区域进行闪烁
     * @param win_tag 
     */
    showWinTag(win_tag: any) {
        for (let i = 1; i < 5; i++) {
            if (win_tag[i]) {
                this._rects[i].winBlink();
            }
        }
    }

    recoverWinTag() {
        for (let i in this._rects)
            this._rects[i].recover();
    }

    setMySeatInfo(data: any) {
        this._seats[my_seat_id].show();
        this._seats[my_seat_id].setInfo(data);
        this._score = data.user.score;
        if (AppGame.ins.bankerBurrent != null && AppGame.ins.bankerBurrent.banker != null && AppGame.ins.bankerBurrent.banker.userId == AppGame.ins.roleModel.useId) {
            this.goldLabel.string = UStringHelper.formatPlayerCoin(data.user.score / GoldRate);
        }
        if (data.user.score < AppGame.ins.game_watch_limit_score) {
            this._sp_rect_1.interactable = false;
            this._sp_rect_2.interactable = false;
            this._sp_rect_3.interactable = false;
            this._sp_rect_4.interactable = false;
        } else {
            this._sp_rect_1.interactable = true;
            this._sp_rect_2.interactable = true;
            this._sp_rect_3.interactable = true;
            this._sp_rect_4.interactable = true;
        }
    }

    /**
     * 设置座位信息
     * @param data
     */
    setSeatInfo(data: any) {
        for (let index = 0; index < 6; index++) {
            if (data[index]) {
                this._seats[index].show();
                this._seats[index].setInfo(data[index]);
                if (data[index].user.userId == AppGame.ins.roleModel.useId && AppGame.ins.bankerBurrent && AppGame.ins.bankerBurrent.banker && AppGame.ins.bankerBurrent.banker.userId == AppGame.ins.roleModel.useId) {
                    this.goldLabel.string = UStringHelper.formatPlayerCoin(data[index].user.score / GoldRate);
                }
            } else {
                this._seats[index].setUserId(-1);
                this._seats[index].hide();
            }
        }
    }

    /**
     * 设置座面路单
     * @param winTag 
     * @param isblink 最新的一个是否闪烁
     */
    setLuDan(winTag: any, isblink: boolean = false) {

        let max_count = 9;  // 最多显示个数
        let temp_data = JSON.parse(JSON.stringify(winTag));

        while (temp_data.length > max_count) {
            temp_data.shift();
        }
        this.ludan_1_Cantainer.destroyAllChildren();
        this.ludan_2_Cantainer.destroyAllChildren();
        this.ludan_3_Cantainer.destroyAllChildren();
        this.ludan_4_Cantainer.destroyAllChildren();
        for (let i = 0; i <= temp_data.length; i++) {
            let data = temp_data[i];
            if (data) {
                let item1 = cc.instantiate(data["1"] ? this.win_Node : this.lose_Node);
                item1.active = true;
                this.ludan_1_Cantainer.addChild(item1);
                let item2 = cc.instantiate(data["2"] ? this.win_Node : this.lose_Node);
                item2.active = true;
                this.ludan_2_Cantainer.addChild(item2);
                let item3 = cc.instantiate(data["3"] ? this.win_Node : this.lose_Node);
                item3.active = true;
                this.ludan_3_Cantainer.addChild(item3);
                let item4 = cc.instantiate(data["4"] ? this.win_Node : this.lose_Node);
                item4.active = true;
                this.ludan_4_Cantainer.addChild(item4);
            }
        }
    }

    /**
     * 设置我的当前金币
     * @param gold 
     */
    setMyGold(gold: number) {
        this._seats[my_seat_id].setGold(gold);
        this._score = gold;
    }

    /**
     * 
     * @param data 
     */
    setSeatGold(userid: number, gold: number) {

        for (let i = 0; i < 6; i++) {
            if (this._seats[i].userid == userid) {
                this._seats[i].setGold(gold);
            }
        }
    }

    /**
     * 设置每个区域总下注值
     */
    setTotalJetton(data: Brnn.IPlaceJettonScore[]) {

        for (let index = 0; index < data.length; index++) {

            this._rects[index + 1].setTotalGold(data[index].jettonScore);

        }
    }

    /**
     * 每个区域自己的下注值
     */
    setMyJetton(data: Brnn.IPlaceJettonScore[]) {
        let total_score = 0;
        for (let index = 0; index < data.length; index++) {
            this._rects[index + 1].setSelfGold(data[index].jettonScore);
            total_score += data[index].jettonScore;
        }
        this.setLabYixiazhuTip(total_score / GoldRate);
    }


    chipIndexToValue(index: number): number {
        if (this._room_info && this._room_info.jettons[index]) {
            return this._room_info.jettons[index];
        }
        return 0;
    }

    chipValueToIndex(value: number): number {

        for (let index = 0; index < this._room_info.jettons.length; index++) {
            const element = this._room_info.jettons[index];

            if (element == value) {
                return index;
            }
        }
        return -1;
    }

    delayUpdate() {

    }

    /**
    * 更新桌面信息
    * @param data Brnn.GameDeskInfo
    */
    updateDeskInfo(data: Brnn.IGameDeskInfo) {
        this.setMyJetton(data.selfJettonScore);
        this.setTotalJetton(data.allJettonScore);
        this.setSeatInfo(data.players);
        this.lab_online_count.string = data.onlinePlayCount.toString();  // 设置在线人数
    }

    /**
     * 获取对应的下注区域pos （随机点）
     * @param bet_rect 下注区域  天地玄黄
     */
    getBetJettonPos(bet_rect: number): cc.Vec2 {
        var dest_pos = new cc.Vec2(0, 0);
        var ract_width = 50;
        var ract_height = 22;

        var end_center_pos = this._rects[bet_rect].position;

        var flag = 1;
        if (Math.random() > 0.5) { flag = -1; }
        dest_pos.x = end_center_pos.x + Math.random() * ract_width * flag;

        flag = 1;
        if (Math.random() > 0.5) { flag = -1; }
        dest_pos.y = end_center_pos.y + Math.random() * ract_height * flag + 28;

        return dest_pos;
    }

    playBetSound() {
        if (this._leave_bet_sound == 0) {
            this._leave_bet_sound = 0.05;
            this._music_mgr.playbet();
        }
    }

    /**
     * 获取一个筹码
     * @param rect 天地玄黄
     * @param type 筹码值
     */
    getChip(rect: number, type: number, score: number = 1) {
        let tmp_chip = UNodeHelper.find(this._ui_root, 'tmp_chip');
        let chip_node = cc.instantiate(tmp_chip);//this._chips_pool[rect].getChipByPool();
        let chip_data = this._chipgroup.getLabBgValue(type);
        if (type == -1) {
            chip_data = { bg: "a", value: score };
        }
        chip_node.getComponent(cc.Label).string = chip_data.bg;
        chip_node.opacity = 255;
        chip_node.active = true;
        chip_node.stopAllActions();
        return chip_node;
    }

    /**
     * 中途进入初始化下注筹码
     */
    updateInfo(data: any) {
        if (!VBrnnScene.is_init && this._layer_chip[1].childrenCount == 0) {
            this.allJettonScore = data.allJettonScore;
            VBrnnScene.initEnterGameData = true;
        }
    }
    //找到位置
    getPresionPosition(userId) {
        for (let i = 0; i <= 7; i++) {
            let data: BrlhSeat = this._seats[i];
            if (Number(data.userid) == Number(userId)) {
                return data.position;
            }
        }
        return null;
    }
    //寻找筹码位置
    getUserPos(deskPlay) {
        let score = Number(deskPlay.returnScore);
        if (score > 0) {
            let position = this.getPresionPosition(deskPlay.userId);
            if (!position) {
                position = UNodeHelper.find(this.node, "uinode/sp_desk/sp_seat_7").position;
            }
            return { pos: position, playerid: Number(deskPlay.userId) };
        }
        return null;
    }
    //创建无动画筹码
    creatorChip(area, jettonScore, playerId, src_x, src_y) {
        let chip_index = this.chipValueToIndex(jettonScore);
        let chip_node = this.getChip(area, chip_index, jettonScore / 100);
        let dest_pos = this.getBetJettonPos(area);
        let disc_scale = 1;
        chip_node.parent = this._layer_chip[area];
        chip_node.scale = disc_scale;
        chip_node.x = dest_pos.x;
        chip_node.y = dest_pos.y;
        chip_node['bet_rect'] = area;
        chip_node['bet_type'] = chip_index;
        chip_node['playerid'] = playerId;
        chip_node['src_x'] = src_x;
        chip_node['src_y'] = src_y;
    }
    getChipForScore(areaMaxScore, area, deskList, deskPlayList, isFlyOther, PassKill) {
        let maxScore = Number(areaMaxScore + "");//4个公共区域其中一个的总分
        for (let i = 0; i < this._room_info.jettons.length; i++) {
            let chip;
            for (let k in deskPlayList) {//所有的玩家
                if (maxScore > 0) {
                    let playData = deskPlayList[k];//单个玩家
                    chip = this._room_info.jettons[this.getRandomNum(0, this._room_info.jettons.length - 1)];
                    let maxIndex = 20;
                    while (playData.returnScore <= chip || maxScore > chip) {
                        maxIndex--;
                        chip = this._room_info.jettons[this.getRandomNum(0, this._room_info.jettons.length - 1)];
                        if (maxIndex < 0) {
                            break;
                        }
                    }
                    let isHave = false;
                    if (playData.returnScore >= chip && maxScore >= chip) {//足够一个筹码的量
                        isHave = true;
                    }
                    if (PassKill) {
                        isHave = true;
                    }
                    if (isHave) {
                        let tmpData = deskList[Number(playData.userId)];
                        let pos = null;
                        if (PassKill) {
                            pos = UNodeHelper.find(this.node, "uinode/sp_desk/sp_banker").position;
                        } else {
                            if (tmpData) {
                                pos = tmpData.pos;
                            } else if (isFlyOther) {
                                pos = UNodeHelper.find(this.node, "uinode/sp_desk/sp_seat_7").position;
                            }
                        }
                        if (pos != null) {
                            maxScore -= chip;
                            this.creatorChip(area, chip, Number(playData.userId), pos.x, pos.y);
                        }
                    }
                }
            }
        }
        return Number(maxScore + "");
    }
    //初始化筹码
    initChipFormArea(newData, isTs) {
        let deskList = {};
        for (let i = 0; i <= 7; i++) {
            let data: BrlhSeat = this._seats[i];
            if (Number(data.userid) != 0) {
                deskList[Number(data.userid)] = { pos: data.position, userid: data.userid, seat: i };
            }
        }
        //桌面额度
        for (let key in this.allJettonScore) {
            let deskChip = this.allJettonScore[key];
            if (deskChip != null && deskChip.jettonScore != null) {
                let area = Number(deskChip.jettonArea + "");
                //有图标的玩家：6个头像玩家
                deskChip.jettonScore = this.getChipForScore(deskChip.jettonScore, area, deskList, newData, false, isTs);

                deskChip.jettonScore = this.getChipForScore(deskChip.jettonScore, area, deskList, newData, true, isTs);

            }
        }
    }

    /**
     * 玩家下注
     * @param playerid 玩家id 
     * @param bet_type 下注类型
     * @param bet_rect 下注区域 （1天2地3玄4黄）
     */
    playerBet(playerid: number, bet_type: number = 10, bet_rect: number, dlet_time?: number) {
        this.playBetSound();
        dlet_time = dlet_time || 0;
        var dest_pos = this.getBetJettonPos(bet_rect);
        var chip_node = this.getChip(bet_rect, bet_type);

        if (playerid == AppGame.ins.roleModel.useId)
            this.refContinueBtnState(false);

        chip_node.parent = this._layer_chip[bet_rect];
        chip_node['bet_rect'] = bet_rect;
        chip_node['playerid'] = playerid;
        chip_node['bet_type'] = bet_type;

        var seat_id = -1;
        for (let i = 0; i < 6; i++) {
            if (this._seats[i].userid == playerid) {
                seat_id = i;
            }
        }

        if (playerid == this._self_id) {   // 自己的位置
            chip_node.position = this._seats[my_seat_id].position;
            this._seats[my_seat_id].shake(1);
        }
        else if (seat_id == -1) {
            chip_node.position = this._seats[no_seat_id].position;  //  无座位置
            this._seats[no_seat_id].shake(1);
        } else {   // 0 ：神算子  1，2，3，4，5 富豪榜
            chip_node.position = this._seats[seat_id].position;
            this._seats[seat_id].shake(1, true);
        }

        if (seat_id == 0) {
            this.playLuckyBet(bet_rect, true);
        }

        chip_node['src_x'] = chip_node.x;
        chip_node['src_y'] = chip_node.y;

        BrnnAnimation.betMove2(chip_node, dest_pos, () => {
        }, dlet_time, false);

    }


    /**
     * 播放幸运星下注动画
     * @param rect 
     * @param isaction 
     */
    playLuckyBet(rect: number, isaction: boolean = false) {
        if (isaction) {
            var new_star = cc.instantiate(this.node_luckys[0]);
            new_star.parent = this.node_effect;
            new_star.position = this._seats[0].position;
            new_star.active = true;
            new_star.scale = 2.0;
            new_star['bet_rect'] = rect;

            let src_pos = new_star.position;
            let des_pos = this.node_luckys[rect].position;

            let length = Math.sqrt((src_pos.x - des_pos.x) * (src_pos.x - des_pos.x) + (src_pos.y - des_pos.y) * (src_pos.y - des_pos.y));
            let speed = 700;
            let destime = length / speed;
            destime = destime < 0.5 ? 0.5 : destime;

            let bolato = BrnnAnimation.createParabolaTo(destime, new_star.position, this.node_luckys[rect].position, 60, 90);

            new_star.runAction(cc.sequence(cc.spawn(bolato, cc.scaleTo(destime, 1)), cc.delayTime(0.2), cc.callFunc((node: any) => {
                this.node_luckys[node['bet_rect']].active = true;
                node.destroy();
            }, this)));
        }
        else {
            this.node_luckys[rect].active = true;
        }
    }


    showTips(str?: string) {
        str = str || '当前不是下注状态'
        AppGame.ins.showTips({ data: str, type: ETipType.onlyone });
    }


    /**
     * 播放玩家输赢分数
     */
    playUserEndScore(data: any, current: Brnn.ICurrentBankerInfo = null, timeLeave: number = 3) {
        let delayTime = timeLeave >= 3 ? 3 : 1;
        if (current != null) {
            if (current.banker.userId == AppGame.ins.roleModel.useId) {
                if (timeLeave >= 3 && VBrjhScene.game_status != GAME_STATUS.LH_GAME_FREE) {
                    this._seats[my_seat_id].playWinOrLoseScore(current.bankerWinScore, delayTime);
                }
            }
        }

        let self_rect_score: number[] = [0, 0, 0, 0];

        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (element.userId == AppGame.ins.roleModel.useId) {
                if (timeLeave >= 3 && VBrjhScene.game_status != GAME_STATUS.LH_GAME_FREE) {
                    this._seats[my_seat_id].playWinOrLoseScore(element.returnScore, delayTime);
                }
                self_rect_score = element.jettonAreaScore;
            }
            let have_seat = false;
            for (let i = 0; i < 6; i++) {
                if (this._seats[i].userid == element.userId) {
                    if (timeLeave >= 3 && VBrjhScene.game_status != GAME_STATUS.LH_GAME_FREE) {
                        this._seats[i].playWinOrLoseScore(element.returnScore, delayTime);
                    }
                    have_seat = true;
                }
            }
        }

        for (let i = 1; i <= 4; i++) {
            this._cards_grop[i].winscore = self_rect_score[i - 1];
        }

    }

    /********************************* msg event *********************/

    /**
     * 空闲时间
     * @param event 
     */
    onGameFree(show_effact: boolean = true, leave_time: number) {
        this.setGameStatus(GAME_STATUS.LH_GAME_FREE, leave_time);
        this.clearDesk(true);
        // this.vbrnn_animamgr.showVsAnima();
        if (show_effact) {
            this.sendCard(true);
        } else {
            this.sendCard(false);
        }

    }


    onStartBet(show_effact: boolean = true, leave_time: number) {
        this.setGameStatus(GAME_STATUS.LH_GAME_START, leave_time);

        if (show_effact) {
            this.sendCard();
            this._music_mgr.playStartBet();
            this.vbrnn_animamgr.showStartBet();

            let totalOld = 0
            for (let k = 0; k < this._rectsPlaceOld.length; k++) {
                totalOld += Number(this._rectsPlaceOld[k]);
            }
            if (AppGame.ins.bankerBurrent && AppGame.ins.bankerBurrent.banker && AppGame.ins.bankerBurrent.banker.userId == AppGame.ins.roleModel.useId) {
                this.refContinueBtnState(false);//庄家
            } else {
                let myTotal = (this._score / GoldRate) * (1 / 3);
                this.refContinueBtnState(totalOld != 0 && totalOld < myTotal);
            }
        } else {
            this.sendCard(false);
        }
    }

    onStartTips(leave_time: number) {
        this.setGameStatus(GAME_STATUS.LH_GAME_START_TIPS, leave_time, false);
        this._music_mgr.playChipTips();
    }


    onSyncTime(data: Brnn.CMD_S_SyncTime_Res) {
        // if (VBrnnScene.game_status == GAME_STATUS.LH_GAME_FREE) {
        //     this.setGameStatus(GAME_STATUS.LH_GAME_START, data.timeLeave);
        // }
        this._leave_time = data.timeLeave;
        this.clockMaxTime = Number(this._leave_time + "");
    }


    /**设置桌面路单 */
    onGameRecord(data: any) {
        UDebug.Log(data);
        this.setLuDan(data);
    }

    /**
     * 玩家下注 （目前所有玩家下注都是走这里）
     * @param data 
     */
    onPlaceJetton(data: Brnn.CMD_S_PlaceJetSuccess) {

        var chip_index = this.chipValueToIndex(data.jettonScore);

        if (chip_index == -1) {
            this.showTips('没找到值为' + data.jettonScore / 100 + '的筹码');
            return;
        }

        this.playerBet(data.userId, chip_index, data.jettonArea);

        if (data.userId == AppGame.ins.roleModel.useId) {
            this.setMyGold(data.userScore);
            this._chipgroup.check(data.userScore);
        }


        this.setSeatGold(data.userId, data.userScore);

        this.setTotalJetton(data.allJettonScore);
        this.setMyJetton(data.selfJettonScore);
    }

    // 弃用
    onJettonBroadcast(data: any) {
        for (let i = 0; i < data.tmpJettonScore.length; i++) {
            let chips = this._chipgroup.chipSplik(data.tmpJettonScore[i]);
            UDebug.Log(chips);
            let max_count = chips.length;
            for (let j = 0; j < max_count; j++) {
                let del_time = (j / max_count) * 0.8;
                this.playerBet(0, chips[j], i + 1, del_time);
            }
        }

        for (let i = 0; i < data.AllJettonScore.length; i++) {

            this._rects[i + 1].setTotalGold(data.AllJettonScore[i]);
        }
    }


    onPlaceJettonFail(data: Brnn.CMD_S_PlaceJettonFail) {
        if (data.errorCode == 6 || data.errorCode == 7) {
            return;
        }
        this.showTips(data.errMsg);
    }

    onGameStart(data: Brnn.CMD_S_GameStart) {
        this._leave_time = data.timeLeave;
        this._lab_pjbh.string = '牌局编号:' + data.roundId;
        this.roundNode.active = true;
        if (!this.toBack) {
            this.onGameFree(VBrnnScene.is_init, data.timeLeave);
        } else {
            this.onGameFree(true, data.timeLeave);
        }
        this.updateDeskInfo(data.deskData);
        VBrnnScene.is_init = true;
    }

    /** 开始下注 */
    onStartPlaceJetton(data: Brnn.CMD_S_StartPlaceJetton) {
        this.clearDesk();
        this._lab_pjbh.string = '牌局编号:' + data.roundId;
        this.roundNode.active = true;
        if (!this._checkNode.active) {
            if (!this.toBack) {
                this._chipgroup.avAllChips();
            } else {
                this._chipgroup.recoverClear();
            }
        } else {
            if (this.currTogglebtn != null && this.currTogglebtn.name == "toggle1") {
                this.currTogglebtn.getChildByName("Background").active = true;
            }
        }
        this._chipgroup.check(data.userScore);
        if (VBrnnScene.is_init) {   // 场景消息， 刚刚进来的时候，开始下注时间，小于Freetime
            this.onStartBet(true, data.timeLeave);
        }
        else {
            this.onStartBet(false, data.timeLeave);
        }

        this.updateDeskInfo(data.deskData);
        this.setMyGold(data.userScore);
        for (let index = 0; index < data.deskData.jetInfo.length; index++) {
            const element = data.deskData.jetInfo[index];

            for (let index = 0; index < element.jettonCount; index++) {
                var chip_index = this.chipValueToIndex(element.jettonType);
                this.playerBet(-1, chip_index, element.jettonArea);
            }
        }

        for (let index = 0; index < data.deskData.divineJettonScore.length; index++) {

            if (data.deskData.divineJettonScore[index].jettonScore > 0) {
                this.playLuckyBet(data.deskData.divineJettonScore[index].jettonArea);
            }
        }
        VBrnnScene.is_init = true;
    }

    //切后台之前收到的消息
    toBackClear_After() {
        VBrnnScene.initEnterGameData = true;
        this._chipgroup.recoverSave();
    }
    //前后台切换清理
    toBackClear() {
        this.toBack = true;
        VBrnnScene.is_init = false;
        this._ui_root.stopAllActions();
        this.recoverWinTag();
        for (let i = 0; i < 6; i++) {
            this._seats[i].clear();
        }
    }
    //更新按钮
    updateButton() {
        if (this._chipgroup) {
            if (!this.toBack) {
                this._chipgroup.avAllChips();
            }
            this._chipgroup.check(this._score);
        }
    }
    /** 停止下注  */
    onGameEnd(data: Brnn.CMD_S_GameEnd) {
        this.onGameEndData = data;
        this.setGameStatus(GAME_STATUS.LH_GAME_END, data.timeLeave);
        let win_tag = this.getWinTag(data.deskData.winTag)  // 获取赢的区域 天地玄黄

        this.myReturnScore = -1;
        for (let index = 0; index < data.gameEndScore.length; index++) {
            const element = data.gameEndScore[index];
            if (element.userId == AppGame.ins.roleModel.useId) {
                this.myReturnScore = element.returnScore;
                break;
            }
        }

        this.setMyJetton(data.deskData.selfJettonScore);
        this.setTotalJetton(data.deskData.allJettonScore);
        this.refContinueBtnState(false);
        let delayEndUpdateTiem = data.timeLeave >= 3 ? 3 : 0;
        UDebug.log('VBrnnScene.is_init ' + VBrnnScene.is_init)
        if (VBrnnScene.is_init) {
            this._ui_root.stopAllActions();
            this._ui_root.runAction(cc.sequence(
                cc.delayTime(delayEndUpdateTiem),
                cc.callFunc(() => {
                    this.setBankerInfo(data);
                    this.updateDeskInfo(data.deskData);  // 更新桌子信息
                    this.setMyGold(data.userScore);    // 更新手上还剩多少金币
                })));
            if (data.deskData.bankerInfo.currentBankerInfo != null) {
                this.playUserEndScore(data.gameEndScore, data.deskData.bankerInfo.currentBankerInfo, data.timeLeave);
            }
            else {
                this.playUserEndScore(data.gameEndScore, null, data.timeLeave);
            }
            this.flyChip(win_tag);  // 收筹码动画
            this.showWinTag(win_tag);   // 赢的区域进行闪烁
        }
        else {
            this.setBankerInfo(data);
            this.updateDeskInfo(data.deskData);  // 更新桌子信息
            if (!this.toBack) {
                //中途进入
                if (!VBrnnScene.is_init && VBrnnScene.initEnterGameData) {
                    if (data.deskData.bankerInfo.currentBankerInfo != null) {
                        this.playUserEndScore(data.gameEndScore, data.deskData.bankerInfo.currentBankerInfo, data.timeLeave);
                    }
                    else {
                        this.playUserEndScore(data.gameEndScore, null, data.timeLeave);
                    }
                    if (data.timeLeave >= 3) {
                        this.setDeskChips(data);
                        for (let index = 0; index < data.deskData.divineJettonScore.length; index++) {
                            if (data.deskData.divineJettonScore[index].jettonScore > 0) {
                                this.playLuckyBet(data.deskData.divineJettonScore[index].jettonArea);
                            }
                        }
                    }

                    this.openCard(data.deskData.cards, win_tag, false);
                    this.flyChip(win_tag, data.timeLeave);  // 收筹码动画
                    let time = 0.1;
                    this.scheduleOnce(() => {
                        VBrnnScene.initEnterGameData = false;
                        VBrnnScene.is_init = true;
                        this.showWinTag(win_tag);   // 赢的区域进行闪烁
                    }, time);
                } else {

                }
            } else {
                if (data.deskData.bankerInfo.currentBankerInfo != null) {
                    this.playUserEndScore(data.gameEndScore, data.deskData.bankerInfo.currentBankerInfo, data.timeLeave);
                }
                else {
                    this.playUserEndScore(data.gameEndScore, null, data.timeLeave);
                }
                if (this._layer_chip[1].childrenCount == 0) {
                    if (data.timeLeave >= 3) {
                        this.setDeskChips(data);
                        for (let index = 0; index < data.deskData.divineJettonScore.length; index++) {
                            if (data.deskData.divineJettonScore[index].jettonScore > 0) {
                                this.playLuckyBet(data.deskData.divineJettonScore[index].jettonArea);
                            }
                        }
                    }
                }
                this.openCard(data.deskData.cards, win_tag, false);
                this.flyChip(win_tag, data.timeLeave);  // 收筹码动画
            }
            if (data.roundId != null && data.roundId != "") {
                this._lab_pjbh.string = '牌局编号:' + data.roundId;
                this.roundNode.active = true;
            }

            return;
        }
        this.node_jetton_tip.active = false;    // 隐藏已下注
        VBrnnScene.is_init = true;
        this.toBack = false;
    }

    /**游戏空闲状态 */
    onGameSceneStatusFree(data: Brnn.CMD_Scene_StatusFree) {
        UDebug.log('scene 游戏场景状态-空闲 ' + data);
        this.setGameStatus(GAME_STATUS.LH_GAME_FREE, data.timeLeave);
        this._leave_time = data.timeLeave;
        this.clearDesk();

        this.setSeatInfo(data.deskData.players);
        this.lab_online_count.string = data.deskData.onlinePlayCount.toString();  // 设置在线人数
    }

    /**游戏下注状态 */
    onGameSceneStatusJetton(data: Brnn.CMD_Scene_StatusJetton) {
        UDebug.log('scene 游戏场景状态-下注 ' + data);
        this.setGameStatus(GAME_STATUS.LH_GAME_START, data.timeLeave);
        this._leave_time = data.timeLeave;
        this.clearDesk();
    }

    /**游戏开牌状态 */
    onGameSceneStatusOpen(data: Brnn.CMD_Scene_StatusOpen) {
        UDebug.log('scene 游戏场景状态-开牌 ' + data);
        VBrnnScene.is_init = true;
        this.setGameStatus(GAME_STATUS.LH_GAME_STOP, data.timeLeave);
        this._node_continue.getComponent(cc.Button).interactable = false;
        this._leave_time = data.timeLeave;
        this.clockMaxTime = Number(this._leave_time + "");
        this._lab_pjbh.string = '牌局编号:' + data.roundId;
        this.roundNode.active = true;
        this.clearDesk();
        this.updateDeskInfo(data.deskData);
        this.setMyGold(data.userScore);    // 更新手上还剩多少金币

        this.setDeskChips(data);

        if (!this._checkNode.active) {
            this._chipgroup.unAllChips();
        } else {
            if (this.currTogglebtn != null && this.currTogglebtn.name == "toggle1") {
                this.currTogglebtn.getChildByName("Background").active = true;
            }
        }

        this.setMyJetton(data.deskData.selfJettonScore);
        this.setTotalJetton(data.deskData.allJettonScore);
        this.refContinueBtnState(false);
        this.setBankerInfo(data);

        this.sendCard(false);
        this.openCard(data.deskData.cards, false, false);  // 开牌动画
    }

    /**游戏结束状态 */
    onGameSceneStatusEnd(data: Brnn.CMD_Scene_StatusEnd) {
        UDebug.log('scene 游戏场景状态-结束 ' + data);
        this.setGameStatus(GAME_STATUS.LH_GAME_END, data.timeLeave);
        this._leave_time = data.timeLeave;
        this.setBankerInfo(data);
        VBrjhScene.is_init = false;
        VBrjhScene.initEnterGameData = true;

        this.onGameEnd(data);
    }

    /**开牌 */
    onOpenCard(data: Brnn.CMD_S_OpenCard) {
        UDebug.log('scene 开牌 ' + data);
        this.refContinueBtnState(false);
        this.sendCard();
        this.setGameStatus(GAME_STATUS.LH_GAME_STOP, data.timeLeave);  // 设置游戏状态

        let self_rect_score: number[] = [0, 0, 0, 0];
        self_rect_score = data.jettonAreaScore;
        for (let i = 1; i <= 4; i++) {
            this._cards_grop[i].winscore = self_rect_score[i - 1];
        }

        if (!this._checkNode.active) {
            this._chipgroup.unAllChips();
        } else {
            if (this.currTogglebtn != null && this.currTogglebtn.name == "toggle1") {
                this.currTogglebtn.getChildByName("Background").active = true;
            }
        }
        this._music_mgr.playStopBet();
        this.vbrnn_animamgr.showStopBet();   // 播放停止下注动画
        this.openCard(data.cards, false, true);  // 开牌动画
    }

    /**设置庄家信息 */
    setBankerInfo(data: any) {
        if (!data || !data.deskData || !data.deskData.bankerInfo) return;
        AppGame.ins.bankerInfo = data.deskData.bankerInfo;
        if (data.deskData.bankerInfo != null) {
            if (data.deskData.bankerInfo.currentBankerInfo != null) {
                AppGame.ins.bankerBurrent = data.deskData.bankerInfo.currentBankerInfo;
            }

            if (data.deskData.bankerInfo.applyBankerInfo != null) {
                AppGame.ins.bankerApply = data.deskData.bankerInfo.applyBankerInfo;
            }
        }
        AppGame.ins.brnnModel.emit(MRole.BANKERINFO, data.deskData);
        if (CommVillage.ins != null) {
            CommVillage.ins.updateInfo();
        }
        if (AppGame.ins.bankerBurrent && AppGame.ins.bankerBurrent.banker && AppGame.ins.bankerBurrent.banker.userId == AppGame.ins.roleModel.useId) {
            this.goldLabel.string = UStringHelper.formatPlayerCoin(data.userScore / GoldRate);
        }
    }

    /**设置桌子筹码 */
    setDeskChips(data: any) {
        if (!data || !data.deskData || !data.deskData.jetInfo) return;
        for (let index = 0; index < data.deskData.jetInfo.length; index++) {
            const element = data.deskData.jetInfo[index];
            for (let index = 0; index < element.jettonCount; index++) {
                var chip_index = this.chipValueToIndex(element.jettonType);
                if (chip_index == -1) {
                    this.showTips('找不到对应筹码 ' + element.jettonType / 100);
                    break;
                }
                let playerIndex = data.deskData.players[Math.floor((Math.random() * (data.deskData.players.length > 6 ? 6 : data.deskData.players.length)))];
                this.playerBet((playerIndex && playerIndex.hasOwnProperty('user')) ? playerIndex.user.userId : -1, chip_index, element.jettonArea);
            }
        }
    }

    /**
     * @description 续压按钮禁用状态
     * @param boo false禁用  true不禁用
     */
    refContinueBtnState(boo: boolean) {
        this._node_continue.getComponent(cc.Button).interactable = boo;
    };
}