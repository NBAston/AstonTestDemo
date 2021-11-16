

import UScene from "../../common/base/UScene";
import BrbjlAnimation from "./BrbjlAnimation";
import UNodeHelper from "../../common/utility/UNodeHelper";

import AppGame from "../../public/base/AppGame";

import MBrbjl from "./model/MBrbjl";
import { Bjl, GameServer, LongHu } from "../../common/cmd/proto";
import { RoomInfo } from "../../public/hall/URoomClass";

import VBrbjlAnimaMgr from "./view/VBrbjlAnimaMgr";
import UBrbjlMusic from "./UBrbjlMusic";
import UAudioRes from "../../common/base/UAudioRes";
import BrChipGroup from "../common/BrChipGroup";
import BrbjlRect from "./BrbjlRect";
import BrbjlCards from "./BrbjlCards";
import BrlhSeat from "../common/BrlhSeat";
import { ECommonUI, ETipType } from "../../common/base/UAllenum";
import UGame from "../../public/base/UGame";
import BrAnimation from "../common/BrAnimation";
import cfg_error from "../common/cfg_error";
import UDebug from "../../common/utility/UDebug";
import UHandler from "../../common/utility/UHandler";
import UEventHandler from "../../common/utility/UEventHandler";
import UAudioManager from "../../common/base/UAudioManager";
import ULanHelper from "../../common/utility/ULanHelper";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import UButton from "../../common/utility/UButton";
import MHall, { NEWS } from "../../public/hall/lobby/MHall";
import UStringHelper from "../../common/utility/UStringHelper";
import { ZJH_SCALE } from "../zjh/MZJH";
import MRole from "../../public/hall/lobby/MRole";
import cfg_event from "../../config/cfg_event";
import { EventManager } from "../../common/utility/EventManager";
import AppStatus from "../../public/base/AppStatus";
import BrChipNewGroup from "../common/BrChipNewGroup";



/**
 * 和 ：1    龙： 2     虎： 3
 */

const { ccclass, property } = cc._decorator;
const CHIP_COUNT = 70;  // 每个区域筹码池个数


enum GAME_STATUS {
    BJL_GAME_START = 1,   // 游戏开始
    BJL_GAME_BET = 2,     // 开始下注
    BJL_GAME_END = 3,       // 结算
    BJL_GAME_FREE = 4,  // 开始开牌
    BJL_GAME_START_TIPS = 5,   // 开始时间快结束了
    BJL_GAME_SHUFFLE_CARDS = 6, // 洗牌中
    BJL_GAME_OPEN = 7, // 开牌
    BJL_GAME_SCENE_FREE = 8, // 空闲场景


}




const FREE_TIME = 2;  // 自定义空闲时间
var BET_TIME = 0;

const my_seat_id = 6;   // 玩家自己的座位
const no_seat_id = 7;  // 无座

const MAX_TIME_END = 7;

const DELT_LUDAN = 0.0
const DELT_PIAO = 6;
const DELT_FLY = 6;


const COUNT_DOWN = 5;


@ccclass
export default class VBrbjlScene extends UGame {
    @property(cc.Node)
    node_desk: cc.Node = null;
    @property(VBrbjlAnimaMgr)
    vbrbjl_animamgr: VBrbjlAnimaMgr = null;
    // @property({ type: cc.Node, tooltip: "龙牌" })
    // node_long_card: cc.Node = null;

    // @property({ type: cc.Node, tooltip: "虎牌" })
    // node_hu_card: cc.Node = null;

    @property({ type: cc.Label, tooltip: "在线人数" })
    lab_online_count: cc.Label = null;

    @property(cc.Node)
    node_bottom: cc.Node = null;

    @property(cc.Label) // 牌局编号
    lab_pjbh: cc.Label = null;

    @property(cc.Label) // 限红
    lab_limit: cc.Label = null;

    @property({ type: [cc.Node], tooltip: "幸运星星" })
    node_luckys: cc.Node[] = [];

    @property({ type: cc.Node, tooltip: "特效层" })
    node_effect: cc.Node = null;
    @property(sp.Skeleton) fapaiSpine: sp.Skeleton = null; // 发牌动画节点

    @property(cc.Node)
    node_ghxp: cc.Node = null; // 更换洗牌文字提示动画

    // @property(cc.Node)
    // node_ludan: cc.Node = null;

    @property(cc.Sprite)
    sp_status: cc.Sprite = null;

    @property(cc.Label)
    lab_leavetime: cc.Label = null;
    @property(cc.Sprite)
    sp_clock_mask: cc.Sprite = null;

    // @property([cc.SpriteFrame])
    // spf_ludan: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spf_status: cc.SpriteFrame[] = [];



    @property(cc.Node)
    node_tips: cc.Node = null;

    @property(cc.Node)
    resultPanel: cc.Node = null;

    @property(cc.Node)
    recordPanel: cc.Node = null;

    @property(cc.Node)
    node_continue: cc.Node = null;
    @property(cc.Node)
    checkNode: cc.Node = null;

    // 游戏model
    _brbjl_model: MBrbjl = null;
    _rectsPlaceOld: number[] = [];
    _node_root: cc.Node = null;

    _node_wait_next: cc.Node = null;
    _node_wait_login: cc.Node = null;

    _layer_chip: cc.Node = null;
    _layer_fly: cc.Node = null;
    _pjbg: cc.Node = null;
    _charge_btn: cc.Node = null;
    _isDelay: boolean = true;

    // _ludan_nodes: Array<cc.Node> = [];  // 主场景路单

    _self_id = 1000;
    _leave_time = 0;   // 状态倒计时
    clockMaxTime = 0;   // 状态总倒计时

    _game_status = GAME_STATUS.BJL_GAME_START;

    _leave_bet_sound = 0;

    _room_info: RoomInfo = new RoomInfo();
    tmp_ludan: Array<number> = [];

    _gold = 0;

    _sp_rect_0: UButton = null;
    _sp_rect_1: UButton = null;
    _sp_rect_2: UButton = null;
    _sp_rect_3: UButton = null;
    _sp_rect_4: UButton = null;

    _music_mgr: UBrbjlMusic = null;

    _brlh_cards: BrbjlCards = null;
    _chipgroup: BrChipNewGroup = null;
    _rects: BrbjlRect[] = [];

    private _seats: { [key: number]: BrlhSeat } = {};
    _chips_pool: cc.NodePool[] = [];
    _fly_pool: cc.NodePool = null;
    _resize_fun: Function;
    private isGameEnd: boolean = false;
    _is_first_in: boolean = true; // 刚刚进入游戏
    _isShowFlag: boolean = false;
    _isHadInitJetton: boolean = false; // 是否已经初始化了筹码了， 主要用于在开牌场景进入时

    _winResultData: Array<number> = [];
    /**单例 */
    private static _ins: VBrbjlScene;
    static get ins(): VBrbjlScene {
        return VBrbjlScene._ins;
    }
    /********************************************************************
     *                                                                  *
     ********************************************************************/

    onLoad() {

    }

    // gamecloseUI() {

    // }

    protected onDisable() {
        super.onDisable();
    }
    protected onEnable() {
        super.onEnable();
        this.updateScore();
    }


    closeLoading() {

    }


    /**sq 修改 需要是否是断线重连进来的 data:ToBattle */
    openScene(data: any) {
        if (data) {
            this._room_info = data.roomData;
        }
        super.openScene(data);
        // UDebug.log("房间信息----------------------"+data);
        this.lab_limit.string = this._room_info.roomName.substr(3, 20) + `限红: ` + (this._room_info.jettons.length > 0 ? this._room_info.jettons[0] / 100 : 1) + `-` + (this._room_info.maxJettonScore / 100 >= 10000 ? (this._room_info.maxJettonScore / 100 / 10000 + `万`) : this._room_info.maxJettonScore / 100);
        this.lab_limit.node.parent.active = true;
        // AppGame.ins.checkEnterMinScore(AppGame.ins.roleModel.score);
    }


    update(dt: number) { 
        if (this._leave_time > 0) {
            let tmp_leave_time = Math.ceil(this._leave_time);
           
            let leave_time = Math.ceil(this._leave_time);
            let str_time = leave_time.toString();
            if (leave_time < 10) {
                str_time = '0' + leave_time;
            }
            this._leave_time -= dt;
            if (this._leave_time < 0) {
                this._leave_time = 0;
            }
            this.lab_leavetime.string = str_time;

            if (leave_time <= COUNT_DOWN && tmp_leave_time > leave_time && (this._game_status == GAME_STATUS.BJL_GAME_START_TIPS)) {
                this._music_mgr.playCountDown();
            }

            if (leave_time == COUNT_DOWN && this._game_status == GAME_STATUS.BJL_GAME_BET) {
                this.onStartTips();
            }

            this.sp_clock_mask.fillRange = (this._leave_time / this.clockMaxTime);


            // if (this._leave_time == 0 && this._game_status == GAME_STATUS.LH_GAME_FREE) {
            //     this._leave_time = BET_TIME;
            //     this.onStartBet();
            // }
        }

        this._leave_bet_sound -= dt;

        if (this._leave_bet_sound < 0) this._leave_bet_sound = 0;
    }

    start() {
        // this.clearDesk();
        this._music_mgr.playGamebg();

    }


    protected init() {
        VBrbjlScene._ins = this;
        this._node_root = UNodeHelper.find(this.node, 'uinode');

        this._layer_chip = UNodeHelper.find(this._node_root, 'layer_chips');
        this._layer_fly = UNodeHelper.find(this._node_root, 'layer_fly');

        this._node_wait_next = UNodeHelper.find(this._node_root, 'node_wait_next');
        this._node_wait_login = UNodeHelper.find(this._node_root, 'node_wait_login');
        this._node_wait_login.active = false;

        this._chips_pool[0] = new cc.NodePool();
        this._chips_pool[1] = new cc.NodePool();
        this._chips_pool[2] = new cc.NodePool();
        this._chips_pool[3] = new cc.NodePool();
        this._chips_pool[4] = new cc.NodePool();
        this._chips_pool[5] = new cc.NodePool();
        this._chips_pool[6] = new cc.NodePool();

        this._sp_rect_0 = UNodeHelper.getComponent(this.node, "uinode/sp_desk/sp_rect_0", UButton);
        this._sp_rect_1 = UNodeHelper.getComponent(this.node, "uinode/sp_desk/sp_rect_1", UButton);
        this._sp_rect_2 = UNodeHelper.getComponent(this.node, "uinode/sp_desk/sp_rect_2", UButton);
        this._sp_rect_3 = UNodeHelper.getComponent(this.node, "uinode/sp_desk/sp_rect_3", UButton);
        this._sp_rect_4 = UNodeHelper.getComponent(this.node, "uinode/sp_desk/sp_rect_4", UButton);

        this._fly_pool = new cc.NodePool();


        this._brbjl_model = AppGame.ins.brbjlModel;
        this._self_id = AppGame.ins.roleModel.useId;

        this._music_mgr = new UBrbjlMusic(this.node.getComponent(UAudioRes));

        // this._brlh_cards = new BrbjlCards(this.node_long_card, this.node_hu_card, this._music_mgr);

        // this._room_info.jettons = this._room_info.jettons;

        let chip_container = UNodeHelper.find(this.node_bottom, 'toggle_container');

        this._chipgroup = new BrChipNewGroup(chip_container);

        this._chipgroup.chipValues = this._room_info.jettons;

        this._pjbg = UNodeHelper.find(this.node, "uinode/sp_desk/pjbg");
        this._charge_btn = UNodeHelper.find(this.node, "uinode/sp_desk/sp_seat_6/charge_btn");

        UEventHandler.addClick(this._pjbg, this.node, "VBrbjlScene", "oncopy");
        UEventHandler.addClick(this._charge_btn, this.node, "VBrbjlScene", "intoCharge");


        for (let i = 0; i <= 6; i++) {
            let seat_node = UNodeHelper.find(this.node_desk, 'sp_seat_' + i);
            let lab_name = UNodeHelper.getComponent(this.node_desk, 'sp_seat_' + i + '/lab_name', cc.Label);
            let lab_gold = UNodeHelper.getComponent(this.node_desk, 'sp_seat_' + i + '/lab_gold', cc.Label);
            let lab_vip = UNodeHelper.getComponent(seat_node, 'lab_vip_' + i, cc.Label);
            let seat = new BrlhSeat(seat_node, lab_name, lab_gold, lab_vip);
            this._seats[i] = seat;
        }

        for (let i = 0; i < 5; i++) {
            let rect_node = UNodeHelper.find(this.node_desk, 'sp_rect_' + i);
            let lab_total = UNodeHelper.getComponent(this.node_desk, 'lab_total_jetton_' + i + '/total', cc.Label);
            let lab_self = UNodeHelper.getComponent(this.node_desk, 'lab_total_jetton_' + i + '/lab_self_jetton_' + i, cc.Label);
            let rect = new BrbjlRect(rect_node, lab_total, lab_self);
            this._rects[i] = rect;
        }


        let lab_name = UNodeHelper.getComponent(this.node_desk, 'lab_name_7', cc.Label);
        let lab_gold = UNodeHelper.getComponent(this.node_desk, 'lab_gold_7', cc.Label);
        let lab_vip = UNodeHelper.getComponent(this.node_desk, 'lab_vip_7', cc.Label);

        let playerBtn = UNodeHelper.find(this.node_bottom, 'node_players/btn_players')
        this._seats[no_seat_id] = new BrlhSeat(playerBtn, lab_name, lab_gold, lab_vip);
        this._seats[no_seat_id].show();

        UEventHandler.addClick(playerBtn, this.node, "VBrbjlScene", "onopenPlayers");

        /******************** */
        this.setSeatInfo(this._brbjl_model._desk_info.players);

        let user = {
            userId: AppGame.ins.roleModel.useId,
            nickName: AppGame.ins.roleModel.nickName,
            score: AppGame.ins.roleModel.score,
            headerId: AppGame.ins.roleModel.headId,
            headboxId: AppGame.ins.roleModel.headboxId,
            headImgUrl: AppGame.ins.roleModel.headImgUrl,
            vip: AppGame.ins.roleModel.vipLevel,
        }

        this.setMySeatInfo({ user: user });


        // this.setLuDan(this._brbjl_model.gameRecord.gamerecord);

        this.updateDeskInfo(this._brbjl_model._desk_info);

        this._leave_time = this._brbjl_model.leaveTime;
        this.clockMaxTime = this._brbjl_model.leaveTime;
        this.setGameStatus(this._brbjl_model.gameStatus);
        if (this._game_status == GAME_STATUS.BJL_GAME_FREE || this._game_status == GAME_STATUS.BJL_GAME_START) {
            this.sendCard();
        }

        let tmp_chip = UNodeHelper.find(this._node_root, 'tmp_chip');

        for (let i = 0; i < CHIP_COUNT; i++) {
            let chip_node = cc.instantiate(tmp_chip);
            this._chips_pool[0].put(chip_node);
            chip_node = cc.instantiate(tmp_chip);
            this._chips_pool[1].put(chip_node);
            chip_node = cc.instantiate(tmp_chip);
            this._chips_pool[2].put(chip_node);
            chip_node = cc.instantiate(tmp_chip);
            this._chips_pool[3].put(chip_node);
            chip_node = cc.instantiate(tmp_chip);
            this._chips_pool[4].put(chip_node);
            chip_node = cc.instantiate(tmp_chip);
            this._chips_pool[5].put(chip_node);
            chip_node = cc.instantiate(tmp_chip);
            this._chips_pool[6].put(chip_node);
        }

        for (let i = 0; i < CHIP_COUNT * 7; i++) {
            let chip_node = cc.instantiate(tmp_chip);
            this._fly_pool.put(chip_node);
        }

        let self = this;
        this._resize_fun = () => {
            self._seats[no_seat_id].updatePosition();
            self._seats[my_seat_id].updatePosition();
        }
        cc.game.on('resize', this._resize_fun);
        this.initModelEventListener();

    }

    /**玩家列表 */
    onopenPlayers() {
        UDebug.log("请求玩家列表")
        this._brbjl_model.sendPlayerList()
        UAudioManager.ins.playSound("audio_click");
    }

    /**
     * 清理桌面
     */
    clearDesk() {

        this.vbrbjl_animamgr.clear();
        this._node_wait_next.active = false;

        // this._brlh_cards.clear();



        // 清理下注
        this._rectsPlaceOld = []
        for (let i = 0; i <= 4; i++) {
            UDebug.log("*********rects[i]===" + this._rects[i]._lab_self.string);
            this.node_luckys[i].active = false;
            this._rectsPlaceOld.push(parseInt(this._rects[i]._lab_self.string))
            this._rects[i].clear();

        }
        UDebug.Log("-------------------------清理桌面" + this._rectsPlaceOld)
        while (this._layer_chip.children.length > 0) {
            let node = this._layer_chip.children[0];
            if (node['bet_rect'] == 0) {
                this._chips_pool[0].put(node);   // 回收筹码到池
            } else if (node['bet_rect'] == 1) {
                this._chips_pool[1].put(node);
            } else if (node['bet_rect'] == 2) {
                this._chips_pool[2].put(node);
            } else if (node['bet_rect'] == 3) {
                this._chips_pool[3].put(node);
            } else if (node['bet_rect'] == 4) {
                this._chips_pool[4].put(node);
            } else if (node['bet_rect'] == 5) {
                this._chips_pool[5].put(node);
            } else if (node['bet_rect'] == 6) {
                this._chips_pool[6].put(node);
            }
            else {
                node.removeFromParent();
            }
        }

        while (this._layer_fly.children.length > 0) {
            let node = this._layer_fly.children[0];
            this._fly_pool.put(node);
        }

        let tmp_chip = UNodeHelper.find(this._node_root, 'tmp_chip');
        while (this._fly_pool.size() < CHIP_COUNT * 7) {
            let chip = cc.instantiate(tmp_chip)
            this._fly_pool.put(chip);
        }

        for (let i = 0; i < 7; i++) {
            while (this._chips_pool[i].size() < CHIP_COUNT) {
                let chip = cc.instantiate(tmp_chip)
                this._chips_pool[i].put(chip);
            }
        }

        this._layer_chip.stopAllActions();
        // this._layer_chip.removeAllChildren();
        this.node_effect.removeAllChildren();

        for (let i in this._seats)
            this._seats[i].clear();

    }

    onDestroy() {
        if (this._resize_fun)
            cc.game.off('resize', this._resize_fun);

        this.removeModelEventListener();
        this._brbjl_model.resetData();

    }

    private updateScore(): void {
        if (AppGame.ins.roleModel.score < AppGame.ins.game_watch_limit_score) {
            this.checkNode.active = true;
        } else {
            this.checkNode.active = false;
        }
    }

    /**
     * 监听model事件
     */
    private initModelEventListener() {
        // this._brbjl_model.on(MBrbjl.S_GAME_FREE, this.onGameFree, this);
        this._brbjl_model.on(MBrbjl.S_LEFT_ROOM, this.onPlayerLeftRoom, this);
        this._brbjl_model.on(MBrbjl.S_GAME_START, this.onGameStart, this);
        this._brbjl_model.on(MBrbjl.S_SEND_RECORD, this.onGameRecord, this);
        this._brbjl_model.on(MBrbjl.S_START_PLACE_JETTON, this.onStartPlaceJetton, this);
        this._brbjl_model.on(MBrbjl.S_PLACE_JET_FAIL, this.onPlaceJettonFail, this);
        this._brbjl_model.on(MBrbjl.S_PLACE_JETTON, this.onPlaceJetton, this);
        this._brbjl_model.on(MBrbjl.S_GAME_OPEN_CARD, this.onGameOpenCard, this);
        this._brbjl_model.on(MBrbjl.S_GAME_FREE_SCENE, this.onGameSceneFree, this);
        this._brbjl_model.on(MBrbjl.S_GAME_START_JETTON_SCENE, this.onGameSceneStartJetton, this);
        this._brbjl_model.on(MBrbjl.S_GAME_END_SCENE, this.onGameSceneEnd, this);
        this._brbjl_model.on(MBrbjl.S_GAME_OPEN_SCENE, this.onGameSceneOpenCard, this);
        this._brbjl_model.on(MBrbjl.S_GAME_END, this.onGameEnd, this);
        this._brbjl_model.on(MBrbjl.S_SHUFFLE_CARDS, this.onShuffleCards, this);
        // this._brbjl_model.on(MBrbjl.S_JETTON_BROADCAST, this.onJettonBroadcast, this);
        this._brbjl_model.on(MBrbjl.S_SYNC_TIME, this.onSyncTime, this);
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        EventManager.getInstance().addEventListener(cfg_event.CLOSE_CHARGE, this.updateScore, this);

        this._brbjl_model.run();
    }

    private removeModelEventListener() {
        // this._brbjl_model.off(MBrbjl.S_GAME_FREE);
        // this._brbjl_model.off(MBrbjl.S_GAME_FREE, this.onGameFree, this);
        this._brbjl_model.off(MBrbjl.S_LEFT_ROOM, this.onPlayerLeftRoom, this);
        this._brbjl_model.off(MBrbjl.S_GAME_START, this.onGameStart, this);
        this._brbjl_model.off(MBrbjl.S_SEND_RECORD, this.onGameRecord, this);
        this._brbjl_model.off(MBrbjl.S_START_PLACE_JETTON, this.onStartPlaceJetton, this);
        this._brbjl_model.off(MBrbjl.S_PLACE_JET_FAIL, this.onPlaceJettonFail, this);

        this._brbjl_model.off(MBrbjl.S_PLACE_JETTON, this.onPlaceJetton, this);
        this._brbjl_model.off(MBrbjl.S_GAME_OPEN_CARD, this.onGameOpenCard, this);
        this._brbjl_model.off(MBrbjl.S_GAME_FREE_SCENE, this.onGameSceneFree, this);
        this._brbjl_model.off(MBrbjl.S_GAME_START_JETTON_SCENE, this.onGameSceneStartJetton, this);
        this._brbjl_model.off(MBrbjl.S_GAME_END_SCENE, this.onGameSceneEnd, this);
        this._brbjl_model.off(MBrbjl.S_GAME_OPEN_SCENE, this.onGameSceneOpenCard, this);
        this._brbjl_model.off(MBrbjl.S_GAME_END, this.onGameEnd, this);
        this._brbjl_model.off(MBrbjl.S_SHUFFLE_CARDS, this.onShuffleCards, this);
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);

        // this._brbjl_model.off(MBrbjl.S_JETTON_BROADCAST, this.onJettonBroadcast, this);
        this._brbjl_model.off(MBrbjl.S_SYNC_TIME, this.onSyncTime, this);
        EventManager.getInstance().removeEventListener(cfg_event.CLOSE_CHARGE, this.updateScore, this);

        this._brbjl_model.exit();
        // this._brbjl_model.targetOff(this);
    }

    // 续压
    onContinue() {
        this._music_mgr.playClick();
        this.node_continue.getComponent(cc.Button).interactable = false
        for (var k = 0; k < this._rectsPlaceOld.length; k++) {
            var total: number = this._rectsPlaceOld[k]
            if (this._room_info.jettons.length > 0) {
                for (let index = this._room_info.jettons.length - 1; index >= 0; index--) {
                    const element = this._room_info.jettons[index];
                    var chipCount = parseInt((total / (element / 100)).toString())
                    for (var j = 0; j < chipCount; j++) {
                        AppGame.ins.brbjlModel.sendBet(k, element);
                    }
                    total = total % (element / 100)
                }
            }
        }
    }

    //点击复制牌局信息
    private oncopy(): void {
        this._music_mgr.playClick();
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this.lab_pjbh.string).substr(5, 30));
    }


    private intoCharge(): void {
        this._music_mgr.playClick();
        AppGame.ins.showUI(ECommonUI.LB_Charge);
    }

    /**
     * 设置游戏状态 
     * @param status 状态
     */
    setGameStatus(status: GAME_STATUS) {

        this._game_status = status;
        if (status == GAME_STATUS.BJL_GAME_END) {
            this.sp_status.spriteFrame = this.spf_status[3];
        } else if (status == GAME_STATUS.BJL_GAME_OPEN) {
            this.sp_status.spriteFrame = this.spf_status[2];
        } else if (status == GAME_STATUS.BJL_GAME_START || status == GAME_STATUS.BJL_GAME_FREE) {
            this.sp_status.spriteFrame = this.spf_status[0];
        } else if (status == GAME_STATUS.BJL_GAME_BET) {
            this.sp_status.spriteFrame = this.spf_status[1];
        } else if (status == GAME_STATUS.BJL_GAME_START_TIPS) {
            this.sp_status.spriteFrame = this.spf_status[1];
        } else if (status == GAME_STATUS.BJL_GAME_SHUFFLE_CARDS) {
            this.sp_status.spriteFrame = this.spf_status[0];
        }
    }

    /**
     * 新建一个筹码放入筹码池
     */
    putChipToPool(type: number = 0, rect: number = 0) {
        let tmp_chip = UNodeHelper.find(this._node_root, 'tmp_chip');

        if (type == 1) {
            this._fly_pool.put(cc.instantiate(tmp_chip));
        } else {
            this._chips_pool[rect].put(cc.instantiate(tmp_chip));
        }
    }

    /**
     * 从桌面筹码回收一个筹码放入筹码池
     */
    recoverChipToPool(type: number = 0, rect: number = 0): boolean {
        let layer = this._layer_chip;
        let pool = null;
        if (type == 1) {
            pool = this._fly_pool;
            layer = this._layer_fly;
            if (layer.children.length > 0) {
                pool.put(layer.children[0]);
                return true;
            }

        } else {
            pool = this._chips_pool[rect];

            for (let i = 0; i < layer.children.length; i++) {
                let node = layer.children[i];
                if (node['bet_rect'] == rect) {
                    pool.put(layer.children[i]);
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 从筹码池获取一个筹码
     * @param chip_type 
     * @param type  筹码类型，，0 普通筹码，  2 结算时动画筹码
     */
    getChipByPool(chip_type: number, type: number = 0, rect: number = 0) {

        let pool = this._chips_pool[rect];
        if (type == 1) {
            pool = this._fly_pool;
        }

        if (pool.size() <= 0) {     // 筹码池不够
            UDebug.log("筹码池不够---------回收---");
            if (this.recoverChipToPool(type, rect) == false) {
                this.putChipToPool(type, rect);
            }
        }
        let chip_node = pool.get();

        let chip_data = this._chipgroup.getLabBgValue(chip_type);

        let lab_chip = UNodeHelper.getComponent(chip_node, '', cc.Label);
        if (!chip_data) {
            UDebug.log('aaaaa');
        }

        if (!chip_data.bg) {
            UDebug.log('bbbbb');
        }

        lab_chip.string = chip_data.bg;

        // let lab_num = UNodeHelper.getComponent(chip_node, 'lab_num', cc.Label);
        // lab_num.string = chip_data.value.toString();
        // var color1 = new cc.Color(115, 159, 96);
        // // let chip_font = "chip_1";
        // switch (chip_data.bg) {
        //     case 'a':
        //         color1 = new cc.Color(115, 159, 96);
        //         break;
        //     case 'b':
        //         color1 = new cc.Color(170, 121, 51);
        //         break;
        //     case 'c':
        //         color1 = new cc.Color(59, 149, 175);
        //         break;
        //     case 'd':
        //         color1 = new cc.Color(111, 98, 216);
        //         break;
        //     case 'e':
        //         color1 = new cc.Color(191, 107, 60);
        //         break;
        //     case 'f':
        //         color1 = new cc.Color(183, 74, 94);
        //         break;
        //     case 'g':
        //         color1 = new cc.Color(115, 159, 96);
        //         break;
        //     default:
        //         break;
        // }
        // lab_num.node.color = color1;
        chip_node.active = true;
        return chip_node;
    }



    playBetSound() {
        if (this._leave_bet_sound == 0) {
            this._leave_bet_sound = 0.1;
            this._music_mgr.playbet();
        }
    }


    /**
     * 发牌
     * @param action 是否播放发牌动画
     */
    sendCard(action: boolean = false) {
        // this._brlh_cards.sendCard(action);

    }


    /**
     * 开牌
     * @param card1 龙牌值
     * @param card2 虎牌值
     * @param action 是否播放动画
     */
    openCard(card1: number, card2: number, action: boolean = true) {
        this._brlh_cards.openCard(card1, card2, action, UHandler.create((longWin) => {
            this.vbrbjl_animamgr.showWin(longWin);
        }, this));
    }

    /**
     * 结算时飞筹码
     */
    flyChip(winTag: number, isContainsHe: boolean = false, isDelay: number = DELT_FLY) {
        // this._layer_chip.stopAllActions();
        let pos = UNodeHelper.find(this.node_desk, 'gold_Pos').position;
        // cc.warn("赢的区域是---" + winTag);
        this._layer_chip.runAction(cc.sequence(cc.callFunc(() => {  // 庄家先收赢了的金币

            if (winTag == Bjl.JET_AREA.XIAN_AREA) {
                // this._music_mgr.playXianWin();
            } else if (winTag == Bjl.JET_AREA.ZHUANG_AREA) {
                // this._music_mgr.playZhuangWin();
            } else if (winTag == Bjl.JET_AREA.XIAN_DUI_AREA) {
                // this._music_mgr.playXianDuiWin();
            } else if (winTag == Bjl.JET_AREA.ZHUANG_DUI_AREA) {
                // this._music_mgr.playZhuangDuiWin();
            } else if (winTag == Bjl.JET_AREA.HE_AREA) {
                // this._music_mgr.playHeWin();
            } else {
                // this._music_mgr.playHeWin();
            }

            let is_play = false;
            for (let index = 0; index < this._layer_chip.children.length; index++) {
                var node = this._layer_chip.children[index];
                // cc.warn("------node----" + node['bet_rect']);
                // cc.warn("--------------winTag ==== " + winTag);
                if (isContainsHe) {
                    // cc.warn("---------结果有和");
                    // cc.warn("---------结果有和" + winTag);

                    if (winTag != node['bet_rect'] && node['bet_rect'] != Bjl.JET_AREA.ZHUANG_AREA && node['bet_rect'] != Bjl.JET_AREA.XIAN_AREA && !this._winResultData.includes(node['bet_rect'])) {
                        is_play = true;
                        BrbjlAnimation.moveChip(node, new cc.Vec2(pos.x, pos.y), (node: cc.Node) => {
                            node.opacity = 0;
                        });
                    }
                } else {
                    // cc.warn("---------结果没有和" + winTag);
                    if (winTag != node['bet_rect'] && !this._winResultData.includes(node['bet_rect'])) {
                        // cc.warn("------jjjjjjjjjjjjj-" + node['bet_rect'] + "-------------" + winTag);
                        is_play = true;
                        BrbjlAnimation.moveChip(node, new cc.Vec2(pos.x, pos.y), (node: cc.Node) => {
                            node.opacity = 0;
                        });
                    }
                }
            }
            if (is_play) this._music_mgr.playflyCoin();
        }),
            cc.delayTime(1),
            cc.callFunc(() => {               // 庄家补金币到桌子上
                let is_play = false;
                for (let index = 0; index < this._layer_chip.children.length; index++) {
                    var node = this._layer_chip.children[index];
                    if (winTag == node['bet_rect']) {
                        is_play = true;
                        var new_node = this.getChipByPool(node['bet_type'], 1);
                        new_node.position = pos;
                        new_node.parent = this._layer_fly;
                        new_node['src_pos'] = node['src_pos'];
                        new_node['playerid'] = node['playerid'];
                        var desc_pos = this.getBetJettonPos(winTag);
                        BrbjlAnimation.bankerChipMove(new_node, desc_pos, (node: cc.Node) => { }, 0.3);
                    }
                }
                if (is_play) this._music_mgr.playflyCoin();
            }),
            cc.delayTime(1.2),
            cc.callFunc(() => {     // 桌子的金币飞回给玩家
                let is_play = false;
                let no_seat_pos = this._seats[no_seat_id].getPosition();
                for (let index = 0; index < this._layer_chip.children.length; index++) {
                    var node = this._layer_chip.children[index];
                    is_play = true;
                    if (node['src_pos']) {

                        BrbjlAnimation.moveChip(node, node['src_pos'], (node: cc.Node) => {
                            node.opacity = 0;
                        });
                    } else {
                        BrbjlAnimation.moveChip(node, no_seat_pos, (node: cc.Node) => {
                            node.opacity = 0;
                        });
                    }
                }

                for (let index = 0; index < this._layer_fly.children.length; index++) {
                    var node = this._layer_fly.children[index];
                    if (node['src_pos']) {
                        BrbjlAnimation.moveChip(node, node['src_pos'], (node: cc.Node) => {
                            node.opacity = 0;
                        });
                    } else {
                        BrbjlAnimation.moveChip(node, new cc.Vec2(pos.x, pos.y), (node: cc.Node) => {
                            node.opacity = 0;
                        });
                    }
                }
                if (is_play) this._music_mgr.playflyCoin();
            }),
        ));
    }


    showWinTag(win_tag) {
        win_tag.forEach(element => {
            UDebug.log("闪烁----" + element);
            this._rects[element].blink();
        });
    }


    setMySeatInfo(data: any) {
        this._seats[my_seat_id].show();
        this._seats[my_seat_id].setInfo(data);
        this.setMyGold(data.user.score);
        if (data.user.score < AppGame.ins.game_watch_limit_score) {
            this._sp_rect_0.enabled = false;
            this._sp_rect_1.enabled = false;
            this._sp_rect_2.enabled = false;
            this._sp_rect_3.enabled = false;
            this._sp_rect_4.enabled = false;
        } else {
            this._sp_rect_0.enabled = true;
            this._sp_rect_1.enabled = true;
            this._sp_rect_2.enabled = true;
            this._sp_rect_3.enabled = true;
            this._sp_rect_4.enabled = true;
        }
    }

    getUserStatusForUserId(userId: string) {
        for (const key in AppGame.ins.brbjlModel.gBattlePlayer) {
            if (key == userId) {
                return AppGame.ins.brbjlModel.gBattlePlayer[key];
            }
        }
        return null;
    }

    /**
     * 设置座位信息
     * @param data
     */
    setSeatInfo(data: any) {

        let playerItem = null;
        for (let index = 0; index < 6; index++) {
            if (data.length >= index && data[index]) {
                playerItem = this.getUserStatusForUserId(data[index].user.userId);
                if (playerItem != null && playerItem.userStatus != 0) {
                    this._seats[index].show();
                    this._seats[index].setInfo(data[index]);
                } else {
                    this._seats[index].setUserId(-1);
                    this._seats[index].hide();
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
    setLuDan(winTag: Array<number>, isblink: boolean = false) {


    }


    /**
     * 设置我的当前金币
     * @param gold 
     */
    setMyGold(gold: number) {
        this._seats[my_seat_id].setGold(gold);
        this._gold = gold;
    }

    getMyGold(): number {
        return this._gold;
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
    setTotalJetton(data: any) {
        if (data) {
            for (let index = 0; index < data.length; index++) {
                const place = data[index];

                this._rects[place.jettonArea].setTotalJetton(place.jettonScore);

            }
        }
    }

    /**
     * 每个区域自己的下注值
     */
    setMyJetton(data: any) {
        if (data) {
            for (let index = 0; index < data.length; index++) {
                const place = data[index];
                this._rects[place.jettonArea].setSelfJetton(place.jettonScore);
            }
        }
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


    /**
    * 更新桌面信息
    * @param data LongHu.GameDeskInfo
    */
    updateDeskInfo(data: Bjl.IGameDeskInfo) {
        // cc.warn("---------桌面信息--" + JSON.stringify(data)+"-----------dataInt = "+dataInt);
        this.setMyJetton(data.selfJettonScore);
        this.setTotalJetton(data.allJettonScore);

        this.setSeatInfo(data.players);

        this.lab_online_count.string = data.onlinePlayCount.toString();  // 设置在线人数
    }


    /**
     * 获取对应的下注区域pos （随机点）
     * @param bet_rect 下注区域  和 龙 虎
     */
    getBetJettonPos(bet_rect: number): cc.Vec2 {
        var dest_pos = new cc.Vec2(0, 0);
        var ract_width = 60;
        var ract_height = 40;
        if (bet_rect == 2 || bet_rect == 3) {
            ract_width = 90;
            ract_height = 80;
        } else if (bet_rect == 4) {
            ract_width = 90;
        } else if (bet_rect == 0 || bet_rect == 1) {
            ract_width = 110;
        }

        var end_center_pos = this._rects[bet_rect].getPosition();

        // if (bet_rect == 1) { // 和
        //     end_center_pos.y -= 5;
        //     ract_width = 390;
        //     ract_height = 15;
        // }

        var flag = 1;
        if (Math.random() > 0.5) { flag = -1; }
        dest_pos.x = end_center_pos.x + Math.random() * ract_width * flag - ((bet_rect == 3 || bet_rect == 1) ? 25 : 0) - ((bet_rect == 2 || bet_rect == 0) ? -25 : 0);

        flag = 1;
        if (Math.random() > 0.5) { flag = -1; }
        dest_pos.y = end_center_pos.y + Math.random() * (ract_height - 25) * flag - 15;

        return dest_pos;
    }

    /**
     * 玩家下注
     * @param playerid 玩家id 
     * @param bet_type 下注类型
     * @param bet_rect 下注区域 （0：闲  1：庄   2：和 3：闲对 4： 庄对）
     */
    playerBet(playerid: number, bet_type: number = 0, bet_rect: number, dlet_time?: number, isShowStar = true) {

        this.playBetSound(); // 播放下注声效

        dlet_time = dlet_time || 0;

        var dest_pos = this.getBetJettonPos(bet_rect);

        var chip_node = this.getChipByPool(bet_type, 0, bet_rect);

        chip_node.parent = this._layer_chip;
        chip_node['bet_type'] = bet_type;
        chip_node['bet_rect'] = bet_rect;
        chip_node['playerid'] = playerid;

        var notwait = false;

        var seat_id = this._brbjl_model.haveSeat(playerid);

        if (playerid == this._self_id) {   // 自己的位置
            chip_node.position = this._seats[my_seat_id].position;
            this._seats[my_seat_id].shake(1);
        }
        else if (seat_id == -1) {
            chip_node.position = this._seats[no_seat_id].position;  //  无座位置
            this._seats[no_seat_id].shake(4, false);
        } else {   // 0 ：神算子  1，2，3，4，5 富豪榜
            chip_node.position = this._seats[seat_id].position;
            this._seats[seat_id].shake(1, true);
        }

        if (seat_id == 0) {
            if(isShowStar) {
                cc.warn("展示星星---"+bet_rect);
                this.playLuckyBet(bet_rect, true);
            }
        }

        chip_node['src_pos'] = chip_node.position;
        chip_node.stopAllActions();
        chip_node.rotation = 0;
        BrbjlAnimation.betMove(chip_node, dest_pos, () => {

        }, dlet_time);
    }


    /**
     * 播放幸运星下注动画
     * @param rect 
     * @param isaction 
     */
    playLuckyBet(rect: number, isaction: boolean = false) {
        if (isaction) {
            var new_star = cc.instantiate(this.node_luckys[5]);
            new_star.parent = this.node_effect;
            new_star.position = this._seats[0].position;
            new_star.active = true;
            new_star.scale = 2;
            new_star['rect'] = rect;

            // var cent_pos = new cc.Vec2();
            // cent_pos.x = (new_star.x + this.node_luckys[rect].x) / 2;
            // cent_pos.y = (new_star.y + this.node_luckys[rect].y) / 2;


            // var cent_pos1 = new cc.Vec2();
            // cent_pos1.x = (new_star.x + this.node_luckys[rect].x) / 3;
            // cent_pos1.y = (new_star.y + this.node_luckys[rect].y) / 3;

            let src_pos = new_star.position;
            let des_pos = this.node_luckys[rect].position;

            let length = Math.sqrt((src_pos.x - des_pos.x) * (src_pos.x - des_pos.x) + (src_pos.y - des_pos.y) * (src_pos.y - des_pos.y));
            let speed = 700;
            let destime = length / speed;
            destime = destime < 0.5 ? 0.5 : destime;

            new_star.runAction(cc.sequence(cc.spawn(cc.scaleTo(destime, 1), BrAnimation.createParabolaTo(destime, new_star.position, this.node_luckys[rect].position, 60, 90)), cc.delayTime(0.2), cc.callFunc((node: any) => {
                this.node_luckys[node['rect']].active = true;
                node.destroy();
            }, this)));
        }
        else {
            this.node_luckys[rect].active = true;
        }
    }

    showTips(str?: string) {

        str = str || '当前不是下注时间'

        AppGame.ins.showTips({ data: str, type: ETipType.onlyone });

    }

    onClickLuDan() {
        this._music_mgr.playClick();
        // this.recordPanel.opacity = this.recordPanel.opacity==255?0:255;
        // this.onLuDanMove(true);
        AppGame.ins.showBundleUI(ECommonUI.BJL_Ludan, this._room_info.gameId, { "reuse": false, "minScore": this._room_info.jettons.length > 0 ? this._room_info.jettons[0] : 1 })
    }

    onCloseLuDan() {
        // this.onLuDanMove(false);
    }

    onLuDanMove(isShow: boolean = false) {
        if (isShow) {
            this.recordPanel.setPosition(cc.v2(0, 165.5 + cc.winSize.height / 2));
            var actionMove = cc.moveTo(0.1, cc.v2(0, cc.winSize.height / 2 - 165.5));
            this.recordPanel.runAction(actionMove);
            this.recordPanel.runAction(cc.sequence(cc.callFunc(() => {
                this.recordPanel.active = true;
                this.recordPanel.getChildByName('result').getComponent('VBrbjlLudan_new').show();
            }), actionMove));

        } else {
            this.recordPanel.setPosition(cc.v2(0, cc.winSize.height / 2 - 165.5))
            var actionMove2 = cc.moveTo(0.1, cc.v2(0, 165.5 + cc.winSize.height / 2));
            this.recordPanel.runAction(cc.sequence(actionMove2, cc.callFunc(() => { this.recordPanel.active = false })));
        }

    }


    /**
     * 播放玩家输赢分数
     */
    playUserEndScore(data: any, current: Bjl.ICurrentBankerInfo = null, isDelayTime: number = DELT_PIAO) {
        if (current != null) {
            if (current.banker.userId == AppGame.ins.roleModel.useId) {
                this._seats[my_seat_id].playWinOrLoseScore(current.bankerWinScore, isDelayTime, true);
            }
        }

        for (let index = 0; index < data.length; index++) {
            const element = data[index];

            if (element.userId == AppGame.ins.roleModel.useId) {
                this._seats[my_seat_id].playWinOrLoseScore(element.returnScore, isDelayTime, true);
            }

            let have_seat = false;

            for (let i = 0; i < 6; i++) {
                if (this._seats[i].userid == element.userId) {
                    this._seats[i].playWinOrLoseScore(element.returnScore, isDelayTime, false, i);
                    // have_seat = true;
                }
            }

            if (!have_seat) {
                // this._seats[no_seat_id].playWinOrLoseScore(element.returnScore, del_time);
            }
        }
    }


    /********************************* msg event *********************/

    /**
     * 空闲时间 (游戏开始)
     * @param event 
     */
    onGameFree(show_effact: boolean = true) {

        this._leave_time = FREE_TIME;
        this.clockMaxTime = FREE_TIME;
        this._node_wait_next.active = false;
        this.setGameStatus(GAME_STATUS.BJL_GAME_FREE);

        this.clearDesk();
        // cc.warn("空闲时候清理-----------------桌面信息");

        if (show_effact) {
            this.vbrbjl_animamgr.showVsAnima();
            this._music_mgr.playVs();
            // this.sendCard(true);
        } else {
            this.sendCard(false);
        }
    }

    // 开始下注
    onStartBet(show_effact: boolean = true) {
        this.setGameStatus(GAME_STATUS.BJL_GAME_BET);

        if (show_effact) {
            this.sendCard();
            this._music_mgr.playStartBet();
            if (this._leave_time > 11) {
                this.vbrbjl_animamgr.showStartBet();
            }
        } else {
            this.sendCard(false);
        }

        var totalOld = 0
        // cc.warn("placeOld = " + JSON.stringify(this._rectsPlaceOld));
        for (var k = 0; k < this._rectsPlaceOld.length; k++) {
            totalOld += this._rectsPlaceOld[k]
        }
        if (totalOld != 0 && totalOld < (this._gold / 100) - 30) {
            this.node_continue.getComponent(cc.Button).interactable = true
        }
        else {
            this.node_continue.getComponent(cc.Button).interactable = false
        }

    }

    onStartTips() {
        this.setGameStatus(GAME_STATUS.BJL_GAME_START_TIPS);
        this._music_mgr.playChipTips();
    }


    /**桌面路单 */
    onGameRecord(data: any) {
        UDebug.log(data);
        this._node_wait_login.active = false;
        this.setLuDan(data.record);
    }

    /**
   * 游戏切换到后台
   * @param isHide 是否切在后台
   */
    onGameToBack(isBack: boolean) {
        if (!isBack) {
            this._node_root.stopAllActions();
            this.resultPanel.getComponent("BrbjlResultPanel").onGameStart();
            if (this._game_status == GAME_STATUS.BJL_GAME_END || this._game_status == GAME_STATUS.BJL_GAME_FREE) {
                // this._node_wait_next.active = true;

            }
            // this._is_first_in = false;
            this._isDelay = false;
            this._isShowFlag = true;

        }
    }

    onSyncTime(data: Bjl.CMD_S_SyncTime_Res) {

        if (this._game_status == GAME_STATUS.BJL_GAME_FREE) {
            this.setGameStatus(GAME_STATUS.BJL_GAME_START);
        }
        // this.resultPanel.getComponent("BrbjlResultPanel").onGameStart();
        this._leave_time = data.timeLeave;
        this.clockMaxTime = data.timeLeave;
        // if (data.status == 104 || data.status == 105) {
        //     this._node_wait_next.active = false;
        // }

    }


    /**
     * 玩家下注 （目前所有玩家下注都是走这里）
     * @param data 
     */
    onPlaceJetton(data: Bjl.CMD_S_PlaceJetSuccess) {

        var chip_index = this.chipValueToIndex(data.jettonScore);

        if (chip_index == -1) {
            this.showTips('没找到值为' + data.jettonScore / 100 + '的筹码');
            return;
        }

        this.playerBet(data.userId, chip_index, data.jettonArea);

        if (data.userId == AppGame.ins.roleModel.useId) {
            this.node_continue.getComponent(cc.Button).interactable = false
            this.setMyGold(data.userScore);
            this._chipgroup.check(data.userScore);
        }

        this.setSeatGold(data.userId, data.userScore);

        this.setTotalJetton(data.allJettonScore);
        this.setMyJetton(data.selfJettonScore);
    }


    /*onJettonBroadcast(data: LongHu.CMD_S_Jetton_Broadcast) {

        for (let i = 0; i < data.tmpJettonScore.length; i++) {
            let chips = this._chipgroup.chipSplik(data.tmpJettonScore[i]);

            let max_count = chips.length;
            for (let j = 0; j < max_count; j++) {
                let del_time = (j / max_count) * 0.8;
                this.playerBet(0, chips[j], i + 1, del_time);
            }
        }

        for (let i = 0; i < data.allJettonScore.length; i++) {
            this._rects[i + 1].setTotalJetton(data.allJettonScore[i]);
        }

    }*/


    onPlaceJettonFail(data: Bjl.CMD_S_PlaceJettonFail) {

        // UDebug.log(data);
        // this.showTips('下注失败');

        // UDebug.log(data);
        if (data.errorCode == 6 || data.errorCode == 7) {
            return;
        }

        if (data.errorCode == 5 || data.errorCode == 8) {
            this.showTips(data.errMsg);
        } else {
            let str = cfg_error.brlh_bet[data.errorCode] || '下注失败';
            this.showTips(str);
        }


    }

    onPlayerLeftRoom(data: GameServer.MSG_C2S_UserLeftMessageResponse) {
        if (data.retCode == 0) {

        }
    }

    /** 1 游戏开始  */
    onGameStart(data: Bjl.CMD_S_GameStart) {
        this._isShowFlag = false;
        this._isHadInitJetton = false;

        if (AppGame.ins.brbjlModel.isAutoOpenRecord && this.isGameEnd) {
            AppGame.ins.closeUI(ECommonUI.BJL_Ludan);
        }
        this._isDelay = true;
        this.resultPanel.getComponent("BrbjlResultPanel").onGameStart();
        this.node_ghxp.active = false;
        this.isGameEnd = false;
        this._leave_time = data.timeLeave;
        this.lab_pjbh.string = '牌局编号:' + data.roundId;
        // cc.warn("游戏开始11111-------" + JSON.stringify(data.deskData));
        this._node_wait_next.active = false;
        this.onGameFree(!this._is_first_in);
        // this._chipgroup.unAllChips();
        // cc.warn("游戏开始2222-------" + JSON.stringify(data.deskData));
        this.updateDeskInfo(data.deskData);
        this._is_first_in = false;
    }


    /** 2 开始下注 */
    onStartPlaceJetton(data: Bjl.CMD_S_StartPlaceJetton) {
        // cc.warn("开始下注-------" + JSON.stringify(data.deskData));
        this._isHadInitJetton = false;
        if (this.resultPanel) {
            this.resultPanel.getComponent("BrbjlResultPanel").resetWinSpine();
        }
        this._isDelay = true;
        this.resultPanel.getComponent("BrbjlResultPanel").onGameStart();
        this.lab_pjbh.string = '牌局编号:' + data.roundId;
        if(!this._isShowFlag) {
            this._chipgroup.avAllChips();
        }
        this._chipgroup.check(data.userScore);
        this._isShowFlag = false;

        this._node_wait_next.active = false;
        // this.clearDesk();
        this._leave_time = data.timeLeave;
        this.clockMaxTime = data.timeLeave;
        BET_TIME = data.addJettonTime - FREE_TIME;

        this.onStartBet(!this._is_first_in);

        // if (data.addJettonTime - data.timeLeave < FREE_TIME) {   // 场景消息， 刚刚进来的时候，开始下注时间，小于Freetime

        //     this._leave_time = FREE_TIME - (data.addJettonTime - data.timeLeave);
        //     this.onGameFree(data);
        // }
        // else {
        //     this.onStartBet(false);
        // }
        this.updateDeskInfo(data.deskData);

        this.setMyGold(data.userScore);

        for (let index = 0; index < data.deskData.jetInfo.length; index++) {
            const element = data.deskData.jetInfo[index];

            for (let index = 0; index < element.jettonCount; index++) {
                var chip_index = this.chipValueToIndex(element.jettonType);
                if (chip_index == -1) {
                    this.showTips('找不到对应筹码 ' + element.jettonType / 100);
                    break;
                }

                this.playerBet(-1, chip_index, element.jettonArea);
            }
        }

        for (let index = 0; index < data.deskData.divineJettonScore.length; index++) {

            if (data.deskData.divineJettonScore[index].jettonScore > 0) {
                this.playLuckyBet(data.deskData.divineJettonScore[index].jettonArea);
            }
        }

        this._is_first_in = false;
    }

      // 游戏开牌
      onGameOpenCard(data: Bjl.CMD_S_OpenCard, isPlayAni = true) {
        this._chipgroup.unAllChips();
        if(data.timeLeave >= 2.8) {
            this.vbrbjl_animamgr.showStopBet();
            this._music_mgr.playStopBet();
        }
        this.setGameStatus(GAME_STATUS.BJL_GAME_OPEN);
        // this.updateDeskInfo(data.);
        this.lab_pjbh.string = '牌局编号:' + data.roundId;
        this.node_continue.getComponent(cc.Button).interactable = false
        this._leave_time = data.timeLeave;
        if (this.resultPanel) {
            this.resultPanel.getComponent("BrbjlResultPanel").showResultPanel(data, this._music_mgr, isPlayAni);
        }
        // this.openCard(data.cards[0].cardData, data.cards[1].cardData, data.timeLeave <= 2 ? false : true);

    }

    onGameSceneOpenCard(data: Bjl.CMD_Scene_StatusOpen) {
        this._leave_time = data.timeLeave;
        this.clockMaxTime = data.timeLeave;
        this.updateDeskInfo(data.deskData);
        for (let index = 0; index < data.deskData.jetInfo.length; index++) {
            const element = data.deskData.jetInfo[index];

            for (let index = 0; index < element.jettonCount; index++) {
                var chip_index = this.chipValueToIndex(element.jettonType);
                if (chip_index == -1) {
                    this.showTips('找不到对应筹码 ' + element.jettonType / 100);
                    break;
                }
                let playerIndex = data.deskData.players[Math.floor((Math.random()*(data.deskData.players.length>6?6:data.deskData.players.length)))];
                this.playerBet((playerIndex && playerIndex.hasOwnProperty('user'))? playerIndex.user.userId:-1, chip_index, element.jettonArea);
            }
        }

        for (let index = 0; index < data.deskData.divineJettonScore.length; index++) {
            if (data.deskData.divineJettonScore[index].jettonScore > 0) {
                this.playLuckyBet(data.deskData.divineJettonScore[index].jettonArea);
            }
        }
        this._isHadInitJetton = true;
    }

    onGameSceneFree(data: Bjl.CMD_Scene_StatusFree) {
        this._leave_time = data.timeLeave;
        this.setGameStatus(GAME_STATUS.BJL_GAME_SCENE_FREE);
        this.clockMaxTime = data.timeLeave;
        this.lab_pjbh.string = '牌局编号:' + '';
        this.updateDeskInfo(data.deskData);
        this.setMyGold(data.userScore);
    }

    onGameSceneStartJetton(data: Bjl.CMD_Scene_StatusJetton) {
        this._leave_time = data.timeLeave;
        this.setGameStatus(GAME_STATUS.BJL_GAME_BET);
        this.lab_pjbh.string = '牌局编号:' + data.roundId;
        this.clockMaxTime = data.timeLeave;
        this.setMyJetton(data.deskData.selfJettonScore);
        this.setTotalJetton(data.deskData.allJettonScore);
        this.updateDeskInfo(data.deskData);
        this.setMyGold(data.userScore);

        for (let index = 0; index < data.deskData.jetInfo.length; index++) {
            const element = data.deskData.jetInfo[index];
            for (let index = 0; index < element.jettonCount; index++) {
                var chip_index = this.chipValueToIndex(element.jettonType);
                if (chip_index == -1) {
                    this.showTips('找不到对应筹码 ' + element.jettonType / 100);
                    break;
                }
                let playerIndex = data.deskData.players[Math.floor((Math.random()*(data.deskData.players.length>6?6:data.deskData.players.length)))];
                // this.playerBet((playerIndex && playerIndex.hasOwnProperty('user'))? playerIndex.user.userId:-1, chip_index, element.jettonArea, 0,false);
            }
        }

        for (let index = 0; index < data.deskData.divineJettonScore.length; index++) {
            if (data.deskData.divineJettonScore[index].jettonScore > 0) {
                this.playLuckyBet(data.deskData.divineJettonScore[index].jettonArea);
            }
        }



    }

    onGameSceneEnd(data: any/*Bjl.CMD_Scene_StatusEnd*/) {
        // data.userEnter = 
        this._leave_time = data.timeLeave;
        let openCard = new Bjl.CMD_S_OpenCard();
        openCard.roundId = data.roundId;
        openCard.timeLeave = data.timeLeave;
        openCard.cards = data.deskData.cards;
        this.setGameStatus(GAME_STATUS.BJL_GAME_END);
        this.resultPanel.getComponent("BrbjlResultPanel").showResultPanel(openCard, this._music_mgr, false);
        this.onGameEnd(data, true);
    }

    /** 结算消息 */
    onGameEnd(data: Bjl.CMD_S_GameEnd, isGameEndScene = false) {
        this.node_continue.getComponent(cc.Button).interactable = false
        this.node_ghxp.active = false;
        this.isGameEnd = true;
        this.lab_pjbh.string = '牌局编号:' + data.roundId;
        this._leave_time = data.timeLeave;
        this.clockMaxTime = data.timeLeave;

        this.setGameStatus(GAME_STATUS.BJL_GAME_END);
        this.setMyJetton(data.deskData.selfJettonScore);
        this.setTotalJetton(data.deskData.allJettonScore);
        this._winResultData = data.deskData.winArea
        this.showWinTag(data.deskData.winArea);

        this._chipgroup.unAllChips();
        if(!isGameEndScene) {
            this._layer_chip.stopAllActions();
            this._node_root.stopAllActions();
            this._music_mgr.playStopBet();
        }
        if (!this._is_first_in) {
            // if (this._leave_time > 11) {
            //     this.vbrbjl_animamgr.showStopBet();
            // }
            this._node_root.runAction(cc.sequence(
                cc.delayTime(DELT_PIAO),
                cc.callFunc(() => {
                    if (!this._is_first_in) {
                        this.updateDeskInfo(data.deskData);
                        this.setMyGold(data.userScore);
                    }
                })))
            if (data.timeLeave > 2.5) {
                if (data.deskData.bankerInfo.currentBankerInfo != null) {
                    this.playUserEndScore(data.gameEndScore, data.deskData.bankerInfo.currentBankerInfo, data.timeLeave - 3.5);
                }
                else {
                    this.playUserEndScore(data.gameEndScore, null, data.timeLeave - 3.5); 
                }
            }

            if (data.timeLeave > 2) {
                data.deskData.winArea.forEach(element => {
                    this.flyChip(element, data.deskData.winArea.includes(Bjl.JET_AREA.HE_AREA));
                });
            }
            if (this.resultPanel) {
                this.resultPanel.getComponent("BrbjlResultPanel").onGameEnd(data, !isGameEndScene);
            }
            this._is_first_in = false;

        } else {
            // this.setLuDan(this._brbjl_model._game_record.record, true);
            this.updateDeskInfo(data.deskData);
            // this.clearDesk(); // 这时候断线重连进来就清理桌面信息
            // this._node_wait_next.active = true;
            this.setMyGold(data.userScore);
            if (data.timeLeave > 2) {
                if (data.deskData.bankerInfo.currentBankerInfo != null) {
                    this.playUserEndScore(data.gameEndScore, data.deskData.bankerInfo.currentBankerInfo, data.timeLeave - 3.5);
                }
                else {
                    this.playUserEndScore(data.gameEndScore, null, data.timeLeave - 3.5);
                }
            }
            if (this.resultPanel) {
                this.resultPanel.getComponent("BrbjlResultPanel").onGameEnd(data, !isGameEndScene);
            }
            // this.resultPanel.getComponent("BrbjlResultPanel").showResultPanel(data, this._music_mgr, false);
            if(!this._isHadInitJetton) {
                for (let index = 0; index < data.deskData.jetInfo.length; index++) {
                    const element = data.deskData.jetInfo[index];
    
                    for (let index = 0; index < element.jettonCount; index++) {
                        var chip_index = this.chipValueToIndex(element.jettonType);
                        if (chip_index == -1) {
                            this.showTips('找不到对应筹码 ' + element.jettonType / 100);
                            break;
                        }
    
                        let playerIndex = data.gameEndScore[Math.floor((Math.random()*data.gameEndScore.length))];
                        this.playerBet((playerIndex && playerIndex.hasOwnProperty('returnScore') && playerIndex.returnScore > 0)? playerIndex.userId:-1, chip_index, element.jettonArea);
                    }
                }
    
                for (let index = 0; index < data.deskData.divineJettonScore.length; index++) {
                    if (data.deskData.divineJettonScore[index].jettonScore > 0) {
                        this.playLuckyBet(data.deskData.divineJettonScore[index].jettonArea);
                    }
                }
            }
            if (data.timeLeave > 3) {
                data.deskData.winArea.forEach(element => {
                    this.flyChip(element, data.deskData.winArea.includes(Bjl.JET_AREA.HE_AREA));
                });
            }
            // this.openCard(data.deskData.cards[0].cardData, data.deskData.cards[1].cardData, false);
            this._is_first_in = false;
        }
        this._isHadInitJetton = false;

    }


    onShuffleCards(data: Bjl.CMD_S_ShuffleCards) {
        // cc.warn("洗牌消息---" + JSON.stringify(data));
        if (data && data.timeLeave > 0) {
            this.node_ghxp.active = true;
            this._leave_time = data.timeLeave;
            this.clockMaxTime = data.timeLeave;
            //洗牌状态
            this.setGameStatus(GAME_STATUS.BJL_GAME_SHUFFLE_CARDS);
            this.resultPanel.getComponent("BrbjlResultPanel").onGameStart();
            this.clearDesk();
            // this._chipgroup.unAllChips();
            this.playXpSpine();
        }
    }

    // 播放洗牌动画
    playXpSpine() {
        var path1 = "ani/xp";
        this.fapaiSpine.timeScale = 0.5;
        this.playSpine(path1, 'xp', this.fapaiSpine, false, () => {
            this.fapaiSpine.timeScale = 1;
            this.node_ghxp.active = false;
        });
    }

    //播放spine动画
    playSpine(path: string, animation: string, skeleton: sp.Skeleton, loop: boolean, callback?: Function): void {
        if (AppGame.ins.roomModel.BundleName == "") return
        UDebug.Log("name: " + AppGame.ins.roomModel.BundleName)
        let bundle = cc.assetManager.getBundle(AppGame.ins.roomModel.BundleName)
        bundle.load(path, sp.SkeletonData, function (err, res: any) {
            if (err) cc.error(err)
            cc.loader.setAutoRelease(res, true)
            skeleton.skeletonData = res
            skeleton.setAnimation(0, animation, loop)
            skeleton.setCompleteListener((event) => {
                if (callback != undefined) callback()
            })
        })

    }


}
