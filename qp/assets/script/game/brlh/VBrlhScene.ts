

import UScene from "../../common/base/UScene";
import BrlhAnimation from "./BrlhAnimation";
import UNodeHelper from "../../common/utility/UNodeHelper";

import AppGame from "../../public/base/AppGame";

import MBrlh from "./model/MBrlh";
import { LongHu } from "../../common/cmd/proto";
import { RoomInfo } from "../../public/hall/URoomClass";

import VBrlhAnimaMgr from "./view/VBrlhAnimaMgr";
import UBrlhMusic from "./UBrlhMusic";
import UAudioRes from "../../common/base/UAudioRes";
import BrlhRect from "./BrlhRect";
import BrlhCards from "./BrlhCards";
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
import BrlhVillage from "./BrlhVillage";
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
    LH_GAME_START = 1,   // 开始下注
    LH_GAME_BET = 2,
    LH_GAME_END = 3,       // 游戏结算
    LH_GAME_FREE = 4,  
    LH_GAME_OPEN = 5, // 开牌
    LH_GAME_START_TIPS = 6,   // 开始时间快结束了
    LH_GAME_SCENE_FREE = 7, // 空闲
}


const FREE_TIME = 2;  // 自定义空闲时间
var BET_TIME = 0;

const my_seat_id = 6;   // 玩家自己的座位
const no_seat_id = 7;  // 无座

const MAX_TIME_END = 7;

const DELT_LUDAN = 0.0
const DELT_PIAO = 3.0;
const DELT_FLY = 2.5;


const COUNT_DOWN = 5;

/***
 * 创建: 朱武
 * 作用: 百人龙虎 主场景
 */

@ccclass
export default class VBrlhScene extends UGame {

    @property(VBrlhAnimaMgr)
    vbrlh_animamgr: VBrlhAnimaMgr = null;


    @property(cc.Node)
    node_desk: cc.Node = null;

    @property({ type: cc.Node, tooltip: "龙牌" })
    node_long_card: cc.Node = null;

    @property({ type: cc.Node, tooltip: "虎牌" })
    node_hu_card: cc.Node = null;

    @property({ type: cc.Label, tooltip: "在线人数" })
    lab_online_count: cc.Label = null;

    @property(cc.Node)
    node_bottom: cc.Node = null;

    @property(cc.Label) // 牌局编号
    lab_pjbh: cc.Label = null;

    @property({ type: [cc.Node], tooltip: "幸运星星" })
    node_luckys: cc.Node[] = [];

    @property({ type: cc.Node, tooltip: "特效层" })
    node_effect: cc.Node = null;

    @property(cc.Node)
    node_ludan: cc.Node = null;

    @property(cc.Sprite)
    sp_status: cc.Sprite = null;

    @property(cc.Label)
    lab_leavetime: cc.Label = null;


    @property([cc.SpriteFrame])
    spf_ludan: cc.SpriteFrame[] = [];

    @property([cc.SpriteFrame])
    spf_status: cc.SpriteFrame[] = [];
    @property(cc.Node)
    node_continue: cc.Node = null;


    @property(cc.Node)
    node_tips: cc.Node = null;
    @property(cc.Label)
    goldLabel: cc.Label = null;// 自己是庄家，更新庄家金额

    @property(cc.Node)
    checkNode: cc.Node = null;
    // 游戏model
    _brlh_model: MBrlh = null;
    _rectsPlaceOld: number[] = [];

    _node_root: cc.Node = null;

    _node_wait_next: cc.Node = null;
    _node_wait_login: cc.Node = null;

    _layer_chip: cc.Node = null;
    _layer_fly: cc.Node = null;
    _pjbg: cc.Node = null;
    _charge_btn: cc.Node = null;

    // _ludan_nodes: Array<cc.Node> = [];  // 主场景路单

    _self_id = 1000;
    _leave_time = 0;   // 状态倒计时
    _game_status = GAME_STATUS.LH_GAME_START;

    _leave_bet_sound = 0;

    _room_info: RoomInfo = new RoomInfo();
    tmp_ludan: Array<number> = [];

    _gold = 0;

    _sp_rect_1: UButton = null;
    _sp_rect_2: UButton = null;
    _sp_rect_3: UButton = null;

    _music_mgr: UBrlhMusic = null;

    _brlh_cards: BrlhCards = null;
    _chipgroup: BrChipNewGroup = null;
    _rects: BrlhRect[] = [];

    private _seats: { [key: number]: BrlhSeat } = {};
    _chips_pool: cc.NodePool[] = [];
    _fly_pool: cc.NodePool = null;
    _resize_fun: Function;

    _is_first_in: boolean = true; // 刚刚进入游戏
    _isShowFlag: boolean = false;
    _playerHadPlaceJetton: boolean = false;
    _isHadInitJetton: boolean = false; // 是否已经初始化了筹码了， 主要用于在开牌场景进入时

    /********************************************************************
     *                                                                  *
     ********************************************************************/
    /**单例 */
    private static _ins: VBrlhScene;
    static get ins(): VBrlhScene {
        return VBrlhScene._ins;
    }
    onLoad() {

    }

    // gamecloseUI() {

    // }

    protected onDisable() {
        super.onDisable();
        this.clearDesk();
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
        UDebug.log(data);
        // AppGame.ins.checkEnterMinScore(AppGame.ins.roleModel.score);
    }


    update(dt: number) {
        if (this._leave_time > 0) {
            let tmp_leave_time = Math.ceil(this._leave_time);
            let leave_time = Math.ceil(this._leave_time);
            this._leave_time -= dt;
            if (this._leave_time < 0) {
                this._leave_time = 0;
            }

            let str_time = leave_time.toString();
            if (leave_time < 10) {
                str_time = '0' + leave_time;
            }
            this.lab_leavetime.string = str_time;

            if (leave_time <= COUNT_DOWN && tmp_leave_time > leave_time && (this._game_status == GAME_STATUS.LH_GAME_START_TIPS)) {
                this._music_mgr.playCountDown();
            }

            if (leave_time == COUNT_DOWN && this._game_status == GAME_STATUS.LH_GAME_BET) {
                this.onStartTips();
            }



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
        VBrlhScene._ins = this;

        this._node_root = UNodeHelper.find(this.node, 'uinode');

        this._layer_chip = UNodeHelper.find(this._node_root, 'layer_chips');
        this._layer_fly = UNodeHelper.find(this._node_root, 'layer_fly');

        this._node_wait_next = UNodeHelper.find(this._node_root, 'node_wait_next');
        this._node_wait_login = UNodeHelper.find(this._node_root, 'node_wait_login');
        this._node_wait_login.active = true;

        this._chips_pool[0] = new cc.NodePool();
        this._chips_pool[1] = new cc.NodePool();
        this._chips_pool[2] = new cc.NodePool();
        this._chips_pool[3] = new cc.NodePool();

        this._sp_rect_1 = UNodeHelper.getComponent(this.node, "uinode/sp_desk/sp_rect_1", UButton);
        this._sp_rect_2 = UNodeHelper.getComponent(this.node, "uinode/sp_desk/sp_rect_2", UButton);
        this._sp_rect_3 = UNodeHelper.getComponent(this.node, "uinode/sp_desk/sp_rect_3", UButton);

        this._fly_pool = new cc.NodePool();


        this._brlh_model = AppGame.ins.brlhModel;
        this._self_id = AppGame.ins.roleModel.useId;

        this._music_mgr = new UBrlhMusic(this.node.getComponent(UAudioRes));

        this._brlh_cards = new BrlhCards(this.node_long_card, this.node_hu_card, this._music_mgr);

        // this._room_info.jettons = [100,200,300,400,500,600];

        let chip_container = UNodeHelper.find(this.node_bottom, 'toggle_container');

        this._chipgroup = new BrChipNewGroup(chip_container);

        this._chipgroup.chipValues = this._room_info.jettons;

        this._pjbg = UNodeHelper.find(this.node, "uinode/sp_desk/pjbg");
        this._charge_btn = UNodeHelper.find(this.node, "uinode/sp_desk/sp_seat_6/charge_btn");

        this.setHorseLampPos(0, 220);
        UEventHandler.addClick(this._pjbg, this.node, "VBrlhScene", "oncopy");
        UEventHandler.addClick(this._charge_btn, this.node, "VBrlhScene", "intoCharge");


        for (let i = 0; i <= 6; i++) {
            let seat_node = UNodeHelper.find(this.node_desk, 'sp_seat_' + i);
            let lab_name = UNodeHelper.getComponent(this.node_desk, 'sp_seat_' + i + '/lab_name', cc.Label);
            let lab_gold = UNodeHelper.getComponent(this.node_desk, 'sp_seat_' + i + '/lab_gold', cc.Label);
            let lab_vip = UNodeHelper.getComponent(this.node_desk, 'lab_vip_' + i, cc.Label);
            let seat = new BrlhSeat(seat_node, lab_name, lab_gold, lab_vip); 
            this._seats[i] = seat;
        }

        for (let i = 1; i < 4; i++) {
            let rect_node = UNodeHelper.find(this.node_desk, 'sp_rect_' + i);
            let lab_total = UNodeHelper.getComponent(this.node_desk, 'lab_total_jetton_' + i, cc.Label);
            let lab_self = UNodeHelper.getComponent(this.node_desk, 'lab_self_jetton_' + i, cc.Label);
            let rect = new BrlhRect(rect_node, lab_total, lab_self);
            this._rects[i] = rect;
        }


        // this._seats[my_seat_id] = new BrlhSeat(UNodeHelper.find(this.node_bottom, 'sp_seat_self'));
        let lab_name = UNodeHelper.getComponent(this.node_desk, 'lab_name_7', cc.Label);
        let lab_gold = UNodeHelper.getComponent(this.node_desk, 'lab_gold_7', cc.Label);
        let lab_vip = UNodeHelper.getComponent(this.node_desk, 'lab_vip_7', cc.Label);

        let playerBtn = UNodeHelper.find(this.node_bottom, 'node_players/btn_players')
        this._seats[no_seat_id] = new BrlhSeat(playerBtn, lab_name, lab_gold, lab_vip);
        this._seats[no_seat_id].show();

        UEventHandler.addClick(playerBtn, this.node, "VBrlhScene", "onopenPlayers");

        /******************** */

        this.setSeatInfo(this._brlh_model._desk_info.players);

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


        // this.setLuDan(this._brlh_model.gameRecord.record);

        this.updateDeskInfo(this._brlh_model._desk_info);

        this._leave_time = this._brlh_model.leaveTime;
        this.setGameStatus(this._brlh_model.gameStatus);
        if (this._game_status == GAME_STATUS.LH_GAME_FREE || this._game_status == GAME_STATUS.LH_GAME_START) {
            this.sendCard();
        }

        let tmp_chip = UNodeHelper.find(this._node_root, 'tmp_chip');

        for (let i = 0; i < CHIP_COUNT; i++) {
            let chip_node = cc.instantiate(tmp_chip);
            this._chips_pool[1].put(chip_node);
            chip_node = cc.instantiate(tmp_chip);
            this._chips_pool[2].put(chip_node);
            chip_node = cc.instantiate(tmp_chip);
            this._chips_pool[3].put(chip_node);
        }

        for (let i = 0; i < CHIP_COUNT * 3; i++) {
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
        this._brlh_model.sendPlayerList()
        UAudioManager.ins.playSound("audio_click");
    }

    /**
     * 清理桌面
     */
    clearDesk() {

        this.vbrlh_animamgr.clear();
        this._node_wait_next.active = false;

        this._brlh_cards.clear();



        // 清理下注
        this._rectsPlaceOld = []
        for (let i = 1; i <= 3; i++) {
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
            } else {
                node.removeFromParent();
            }
        }

        while (this._layer_fly.children.length > 0) {
            let node = this._layer_fly.children[0];
            this._fly_pool.put(node);
        }

        let tmp_chip = UNodeHelper.find(this._node_root, 'tmp_chip');
        while (this._fly_pool.size() < CHIP_COUNT * 3) {
            let chip = cc.instantiate(tmp_chip)
            this._fly_pool.put(chip);
        }

        for (let i = 1; i <= 3; i++) {
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
        this._brlh_model.resetData();

    }

    private updateScore(): void {
        if (AppGame.ins.roleModel.score < AppGame.ins.game_watch_limit_score) {
            if (this._sp_rect_1 && this._sp_rect_2 && this._sp_rect_3) {
                this._sp_rect_1.enabled = false;
                this._sp_rect_2.enabled = false;
                this._sp_rect_3.enabled = false;
            }
            this.checkNode.active = true;
        } else {
            if (this._sp_rect_1 && this._sp_rect_2 && this._sp_rect_3) {
                this._sp_rect_1.enabled = true;
                this._sp_rect_2.enabled = true;
                this._sp_rect_3.enabled = true;
            }
            this.checkNode.active = false;
        }
    }

    private requestScore(): void {
        AppGame.ins.roleModel.requestUpdateScore();
    }

    /**
     * 监听model事件
     */
    private initModelEventListener() {
        // this._brlh_model.on(MBrlh.S_GAME_FREE, this.onGameFree, this);
        this._brlh_model.on(MBrlh.S_GAME_START, this.onGameStart, this);
        this._brlh_model.on(MBrlh.S_SEND_RECORD, this.onGameRecord, this);
        this._brlh_model.on(MBrlh.S_START_PLACE_JETTON, this.onStartPlaceJetton, this);
        this._brlh_model.on(MBrlh.S_PLACE_JET_FAIL, this.onPlaceJettonFail, this);
        this._brlh_model.on(MBrlh.S_PLACE_JETTON, this.onPlaceJetton, this);
        this._brlh_model.on(MBrlh.S_GAME_OPEN_CARD, this.onGameOpenCard, this);

        this._brlh_model.on(MBrlh.S_GAME_FREE_SCENE, this.onGameSceneFree, this);
        this._brlh_model.on(MBrlh.S_GAME_OPEN_SCENE, this.onGameSceneOpenCard, this);
        this._brlh_model.on(MBrlh.S_GAME_START_JETTON_SCENE, this.onGameSceneStartJetton, this);
        this._brlh_model.on(MBrlh.S_GAME_END_SCENE, this.onGameSceneEnd, this);
        
        this._brlh_model.on(MBrlh.S_GAME_END, this.onGameEnd, this);
        this._brlh_model.on(MBrlh.S_JETTON_BROADCAST, this.onJettonBroadcast, this);
        this._brlh_model.on(MBrlh.S_SYNC_TIME, this.onSyncTime, this);
        this._brlh_model.on(MBrlh.S_GAME_START, this.requestScore, this);
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        EventManager.getInstance().addEventListener(cfg_event.CLOSE_CHARGE, this.updateScore, this);


        this._brlh_model.run();
    }

    private removeModelEventListener() {
        // this._brlh_model.off(MBrlh.S_GAME_FREE);//     static S_GAME_START_JETTON_SCENE = 'S_GAME_OPEN_SCENE'; // 游戏下注场景消息
    // static S_GAME_OPEN_SCENE = 'S_GAME_OPEN_SCENE'; // 游戏开牌场景消息
    // static S_GAME_END_SCENE = 'S_GAME_END_SCENE'; // 游戏结束场景消息
        // this._brlh_model.off(MBrlh.S_GAME_FREE, this.onGameFree, this);
        this._brlh_model.off(MBrlh.S_GAME_START, this.onGameStart, this);
        this._brlh_model.off(MBrlh.S_SEND_RECORD, this.onGameRecord, this);
        this._brlh_model.off(MBrlh.S_START_PLACE_JETTON, this.onStartPlaceJetton, this);
        this._brlh_model.off(MBrlh.S_PLACE_JET_FAIL, this.onPlaceJettonFail, this);
        this._brlh_model.off(MBrlh.S_PLACE_JETTON, this.onPlaceJetton, this);

        this._brlh_model.off(MBrlh.S_GAME_OPEN_CARD, this.onGameOpenCard, this);
        this._brlh_model.off(MBrlh.S_GAME_FREE_SCENE, this.onGameSceneFree, this);
        this._brlh_model.off(MBrlh.S_GAME_START_JETTON_SCENE, this.onGameSceneStartJetton, this);
        this._brlh_model.off(MBrlh.S_GAME_END_SCENE, this.onGameSceneEnd, this);
        this._brlh_model.off(MBrlh.S_GAME_OPEN_SCENE, this.onGameSceneOpenCard, this);

        this._brlh_model.off(MBrlh.S_GAME_END, this.onGameEnd, this);
        this._brlh_model.off(MBrlh.S_JETTON_BROADCAST, this.onJettonBroadcast, this);
        this._brlh_model.off(MBrlh.S_SYNC_TIME, this.onSyncTime, this);
        this._brlh_model.off(MBrlh.S_GAME_START, this.requestScore, this);
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        EventManager.getInstance().removeEventListener(cfg_event.CLOSE_CHARGE, this.updateScore, this);

        this._brlh_model.exit();
        // this._brlh_model.targetOff(this);
        UDebug.log('aaa');
    }

    // 续压
    onContinue() {
        VBrlhScene.ins._music_mgr.playClick();
        this.node_continue.getComponent(cc.Button).interactable = false
        for (var k = 0; k < this._rectsPlaceOld.length; k++) {
            var total: number = this._rectsPlaceOld[k]
            if (this._room_info.jettons.length > 0) {
                for (let index = this._room_info.jettons.length - 1; index >= 0; index--) {
                    const element = this._room_info.jettons[index];
                    var chipCount = parseInt((total / (element / 100)).toString())
                    for (var j = 0; j < chipCount; j++) {
                        AppGame.ins.brlhModel.sendBet(k + 1, element);
                    }
                    total = total % (element / 100)
                }
            }
        }
    }

    //点击复制牌局信息
    private oncopy(): void {
        VBrlhScene.ins._music_mgr.playClick();
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this.lab_pjbh.string).substr(5, 30));
    }


    private intoCharge(): void {
        VBrlhScene.ins._music_mgr.playClick();
        AppGame.ins.showUI(ECommonUI.LB_Charge);
    }


    /**
     * 设置游戏状态 
     * @param status 状态
     */
    setGameStatus(status: GAME_STATUS) {

        this._game_status = status;
        if(status == GAME_STATUS.LH_GAME_OPEN) {
            this.sp_status.spriteFrame = this.spf_status[2];
        } else if (status == GAME_STATUS.LH_GAME_END) {
            this.sp_status.spriteFrame = this.spf_status[3];
        } else if (status == GAME_STATUS.LH_GAME_START || status == GAME_STATUS.LH_GAME_FREE || status == GAME_STATUS.LH_GAME_SCENE_FREE) {
            this.sp_status.spriteFrame = this.spf_status[0];
        } else if (status == GAME_STATUS.LH_GAME_BET) {
            this.sp_status.spriteFrame = this.spf_status[1];
        } else if (status == GAME_STATUS.LH_GAME_START_TIPS) {
            this.sp_status.spriteFrame = this.spf_status[1];
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
        // cc.loader.loadRes("common/font/chip_font/"+chip_font, cc.Font, (err, res)=>{
        //     lab_num.font = res;
        // });
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
        this._brlh_cards.sendCard(action);

    }


    /**
     * 开牌
     * @param card1 龙牌值
     * @param card2 虎牌值
     * @param action 是否播放动画
     */
    openCard(card1: number, card2: number, action: boolean = true) {
        this._brlh_cards.openCard(card1, card2, action, UHandler.create((longWin) => {
            if(this._game_status == GAME_STATUS.LH_GAME_END || this._game_status == GAME_STATUS.LH_GAME_OPEN) {
                this.vbrlh_animamgr.showWin(longWin);
            }
        }, this));
    }

    /**
     * 结算时飞筹码
     */
    flyChip(winTag: number, isDelay: boolean = true) {
        this._layer_chip.stopAllActions();
        let pos = UNodeHelper.find(this.node_desk, 'gold_Pos').position;

        this._layer_chip.runAction(cc.sequence(cc.delayTime(0), cc.callFunc(() => {  // 庄家先收赢了的金币

            if (winTag == LongHu.JET_AREA.AREA_HU) {
                this._music_mgr.playHuWin();
            } else if (winTag == LongHu.JET_AREA.AREA_LONG) {
                this._music_mgr.playLongWin();
            } else {
                this._music_mgr.playHeWin();
            }

            let is_play = false;
            for (let index = 0; index < this._layer_chip.children.length; index++) {
                var node = this._layer_chip.children[index];

                if (winTag != node['bet_rect']) {
                    is_play = true;
                    BrlhAnimation.moveChip(node, new cc.Vec2(pos.x, pos.y), (node: cc.Node) => {
                        node.opacity = 0;
                    });
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
                        BrlhAnimation.bankerChipMove(new_node, desc_pos, (node: cc.Node) => { }, 0.3);
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

                        BrlhAnimation.moveChip(node, node['src_pos'], (node: cc.Node) => {
                            node.opacity = 0;
                        });
                    } else {
                        BrlhAnimation.moveChip(node, no_seat_pos, (node: cc.Node) => {
                            node.opacity = 0;
                        });
                    }
                }

                for (let index = 0; index < this._layer_fly.children.length; index++) {
                    var node = this._layer_fly.children[index];
                    if (node['src_pos']) {
                        BrlhAnimation.moveChip(node, node['src_pos'], (node: cc.Node) => {
                            node.opacity = 0;
                        });
                    } else {
                        BrlhAnimation.moveChip(node, new cc.Vec2(pos.x, pos.y), (node: cc.Node) => {
                            node.opacity = 0;
                        });
                    }
                }
                if (is_play) this._music_mgr.playflyCoin();
            }),
        ));
    }


    showWinTag(win_tag) {
        if ([1, 2, 3].includes(win_tag)) {
            if (this._rects[win_tag]) {
                this._rects[win_tag].blink();
            }
        }
    }


    setMySeatInfo(data: any) {
        this._seats[my_seat_id].show();
        this._seats[my_seat_id].setInfo(data);
        this.setMyGold(data.user.score);
        if (AppGame.ins.roleModel.score < AppGame.ins.game_watch_limit_score) {
            this._sp_rect_1.enabled = false;
            this._sp_rect_2.enabled = false;
            this._sp_rect_3.enabled = false;
        } else {
            this._sp_rect_1.enabled = true;
            this._sp_rect_2.enabled = true;
            this._sp_rect_3.enabled = true;
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

        let max_count = 17;  // 最多显示个数

        let temp_data = JSON.parse(JSON.stringify(winTag));

        let isMove = false;  // 是否需要移动

        if (temp_data.length > max_count) {
            isMove = true;
        }

        while (temp_data.length > max_count) {
            temp_data.shift();
        }

        this.node_ludan.removeAllChildren();

        var node_index = this.node_ludan.parent.getChildByName('sp_1');
        var last_node = null;
        for (let index = 0; index < temp_data.length; index++) {
            var node = cc.instantiate(node_index);
            node.parent = this.node_ludan;
            var flag = temp_data[index];
            if (flag) {
                node.active = true;
                node.getComponent(cc.Sprite).spriteFrame = this.spf_ludan[flag];
                last_node = node;
            } else {
                node.active = false;
            }
        }

        if (isMove) {
            this.node_ludan.x = -(temp_data.length - (max_count + 1)) * 35.5 - 355;
        }

        if (isblink && last_node) {
            if (!isMove) {
                this.node_ludan.x = -355;
                last_node.runAction(cc.blink(3, 4));
            } else {

                last_node.opacity = 0;
                this.node_ludan.stopAllActions();
                this.node_ludan.runAction(cc.sequence(cc.moveBy(0.5, -35.5, 0), cc.delayTime(0), cc.callFunc(() => {
                    last_node.opacity = 255;
                    last_node.runAction(cc.blink(3, 4));
                })));
            }
        } else if (isMove) {
            this.node_ludan.x = -(temp_data.length - max_count) * 35.5 - 355;
        } else {
            this.node_ludan.x = -355;
        }
    }


    /**
     * 设置我的当前金币
     * @param gold 
     */
    setMyGold(gold: number) {
        this._seats[my_seat_id].setGold(gold);
        if (AppGame.ins.bankerBurrent && AppGame.ins.bankerBurrent.banker && AppGame.ins.bankerBurrent.banker.userId == AppGame.ins.roleModel.useId) {
            AppGame.ins.bankerBurrent.banker.score = gold;
            this.goldLabel.string = UStringHelper.formatPlayerCoin(gold / 100);
        }
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
        for (let index = 0; index < data.length; index++) {
            const place = data[index];

            this._rects[place.jettonArea].setTotalJetton(place.jettonScore);

        }
    }

    /**
     * 每个区域自己的下注值
     */
    setMyJetton(data: any) {
        for (let index = 0; index < data.length; index++) {
            const place = data[index];
            this._rects[place.jettonArea].setSelfJetton(place.jettonScore);
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
    updateDeskInfo(data: LongHu.IGameDeskInfo) {
        if (data.bankerInfo && data.bankerInfo.hasOwnProperty('currentBankerInfo') && data.bankerInfo.currentBankerInfo.banker.score) {
            this.goldLabel.string = UStringHelper.formatPlayerCoin(parseFloat(data.bankerInfo.currentBankerInfo.banker.score) / 100);
        }
        this.setMyJetton(data.selfJettonScore);
        this.setTotalJetton(data.allJettonScore);
        this.setSeatInfo(data.players);
        cc.warn("---桌上玩家数据为--data.players === "+JSON.stringify(data.players));
        this.lab_online_count.string = `` + data.onlinePlayCount.toString();  // 设置在线人数
    }


    /**
     * 获取对应的下注区域pos （随机点）
     * @param bet_rect 下注区域  和 龙 虎
     */
    getBetJettonPos(bet_rect: number): cc.Vec2 {
        var dest_pos = new cc.Vec2(0, 0);
        var ract_width = 60;
        var ract_height = 60;

        var end_center_pos = this._rects[bet_rect].getPosition();

        // if (bet_rect == 1) { // 和
        //     end_center_pos.y -= 5;
        //     ract_width = 390;
        //     ract_height = 15;
        // }

        var flag = 1;
        if (Math.random() > 0.5) { flag = -1; }
        dest_pos.x = end_center_pos.x + Math.random() * ract_width * flag;

        flag = 1;
        if (Math.random() > 0.5) { flag = -1; }
        dest_pos.y = end_center_pos.y + Math.random() * ract_height * flag;

        return dest_pos;
    }

    /**
     * 玩家下注
     * @param playerid 玩家id 
     * @param bet_type 下注类型
     * @param bet_rect 下注区域 （1：龙  2：虎   3：和）
     */
    playerBet(playerid: number, bet_type: number = 0, bet_rect: number, dlet_time?: number) {

        this.playBetSound(); // 播放下注声效

        dlet_time = dlet_time || 0;

        var dest_pos = this.getBetJettonPos(bet_rect);

        var chip_node = this.getChipByPool(bet_type, 0, bet_rect);

        chip_node.parent = this._layer_chip;
        chip_node['bet_type'] = bet_type;
        chip_node['bet_rect'] = bet_rect;
        chip_node['playerid'] = playerid;

        var notwait = false;

        var seat_id = this._brlh_model.haveSeat(playerid);

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
            this.playLuckyBet(bet_rect, true);
        }

        chip_node['src_pos'] = chip_node.position;
        chip_node.stopAllActions();
        chip_node.rotation = 0;
        BrlhAnimation.betMove(chip_node, dest_pos, () => {

        }, dlet_time);
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


    /**
     * 播放玩家输赢分数
     */
    playUserEndScore(data: any, current: LongHu.ICurrentBankerInfo = null, isDelayTime: number = DELT_PIAO) {
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
        this.setGameStatus(GAME_STATUS.LH_GAME_FREE);
        // this._chipgroup.unAllChips();
        this.clearDesk();
        if (show_effact) {
            this.vbrlh_animamgr.showVsAnima();
            this._music_mgr.playVs();
            this.sendCard(true);
        } else {
            this.sendCard(false);
        }
    }

    // 开始下注
    onStartBet(show_effact: boolean = true) {
        this.setGameStatus(GAME_STATUS.LH_GAME_BET);
        if (show_effact) {
            this.sendCard();
            if (this._leave_time <= 14) {
                return;
            }
            this._music_mgr.playStartBet();
            this.vbrlh_animamgr.showStartBet();
        } else {
            this.sendCard(false);
        }
    }

    onStartTips() {
        // this.setGameStatus(GAME_STATUS.LH_GAME_START_TIPS);
        this._music_mgr.playChipTips();
    }


    /**桌面路单 */
    onGameRecord(data: any) {
        UDebug.log(data);
        this._node_wait_login.active = false;
        this.setLuDan(data.record, false);
    }


    onSyncTime(data: LongHu.CMD_S_SyncTime_Res) {

        if (this._game_status == GAME_STATUS.LH_GAME_FREE) {
            this.setGameStatus(GAME_STATUS.LH_GAME_START);
        }
        this._leave_time = data.timeLeave;
    }
    /**
      * 游戏切换到后台
      * @param isHide 是否切在后台
      */
    onGameToBack(isBack: boolean) {
        this._node_root.stopAllActions();
        if (!isBack) {
            this._isShowFlag = true;
            // this._is_first_in = true; 
        }
    }

    /**
     * 玩家下注 （目前所有玩家下注都是走这里）
     * @param data 
     */
    onPlaceJetton(data: LongHu.CMD_S_PlaceJetSuccess) {

        var chip_index = this.chipValueToIndex(data.jettonScore);

        if (chip_index == -1) {
            this.showTips('没找到值为' + data.jettonScore / 100 + '的筹码');
            return;
        }

        this.playerBet(data.userId, chip_index, data.jettonArea);

        if (data.userId == AppGame.ins.roleModel.useId) {
            this.node_continue.getComponent(cc.Button).interactable = false
            this._playerHadPlaceJetton = true;
            this.setMyGold(data.userScore);
            this._chipgroup.check(data.userScore);
        }

        this.setSeatGold(data.userId, data.userScore);

        this.setTotalJetton(data.allJettonScore);
        this.setMyJetton(data.selfJettonScore);
    }


    onJettonBroadcast(data: any) {

        for (let i = 0; i < data.tmpJettonScore.length; i++) {
            let chips = this._chipgroup.chipSplik(data.tmpJettonScore[i]);

            let max_count = chips.length;
            for (let j = 0; j < max_count; j++) {
                let del_time = (j / max_count) * 0.8;
                this.playerBet(0, chips[j], i + 1, del_time);
            }
        }

        for (let i = 0; i < data.allJettonScore.length; i++) {
            // this._rects[i + 1].setTotalJetton(data.allJettonScore[i]);
        }

    }


    onPlaceJettonFail(data: LongHu.CMD_S_PlaceJettonFail) {

        // UDebug.log(data);
        // this.showTips('下注失败');

        // UDebug.log(data);
        if (data.errorCode == 6 || data.errorCode == 7) {
            return;
        }

        let str = cfg_error.brlh_bet[data.errorCode] || '下注失败';

        this.showTips(str);

    }

    /** 1 游戏开始  */
    onGameStart(data: LongHu.CMD_S_GameStart) {
        this._isHadInitJetton = false;
        for (let i in this._seats)
        this._seats[i].clear();
        this.setContinueStatus();
        this._isShowFlag = false;
        this._leave_time = data.timeLeave;
        this.lab_pjbh.string = '牌局编号:' + data.roundId;
        this.onGameFree(!this._is_first_in);
        this.updateDeskInfo(data.deskData);
        this._is_first_in = false;
        if (data.deskData && data.deskData.hasOwnProperty('gameOpenRecord')) {
            this.setLuDan(data.deskData.gameOpenRecord.record);
        }
    }


    /** 2 开始下注 */
    onStartPlaceJetton(data: LongHu.CMD_S_StartPlaceJetton) {
        this._isHadInitJetton = false;
        if(!this._isShowFlag) {
            this._chipgroup.avAllChips();
        }
        this._chipgroup.check(data.userScore);
        this._isShowFlag = false;
        this.lab_pjbh.string = '牌局编号:' + data.roundId;
        for (let i in this._seats)
            this._seats[i].clear();

        // this.clearDesk();
        this._leave_time = data.timeLeave;
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
        this.setContinueStatus();

        this._is_first_in = false;
    }

    setContinueStatus() {
        var totalOld = 0
        // cc.warn("placeOld = " + JSON.stringify(this._rectsPlaceOld));
        for (var k = 0; k < this._rectsPlaceOld.length; k++) {
            totalOld += this._rectsPlaceOld[k]
        }
        if (totalOld != 0 && totalOld < (this._gold / 100) - 30 && (AppGame.ins.bankerBurrent && AppGame.ins.bankerBurrent.hasOwnProperty('banker') && AppGame.ins.bankerBurrent.banker.userId != AppGame.ins.roleModel.useId && !this._playerHadPlaceJetton)) {
            this.node_continue.getComponent(cc.Button).interactable = true
        }
        else {
            this.node_continue.getComponent(cc.Button).interactable = false
        }
    }
    
    // 游戏开牌
    onGameOpenCard(data: LongHu.CMD_S_OpenCard) {
        this._chipgroup.unAllChips();
        if(data.timeLeave >= 2.8) {
            this.vbrlh_animamgr.showStopBet();
            this._music_mgr.playStopBet();
        }
        this.setGameStatus(GAME_STATUS.LH_GAME_OPEN);
        // this.updateDeskInfo(data.);
        this.lab_pjbh.string = '牌局编号:' + data.roundId;
        this.node_continue.getComponent(cc.Button).interactable = false
        this._leave_time = data.timeLeave;
        this.openCard(data.cards[0].cardData, data.cards[1].cardData, data.timeLeave <= 2 ? false : true);

    }

    onGameSceneOpenCard(data: LongHu.CMD_Scene_StatusOpen) {
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

    onGameSceneFree(data: LongHu.CMD_Scene_StatusFree) {
        
        this._leave_time = data.timeLeave;
        this.setGameStatus(GAME_STATUS.LH_GAME_SCENE_FREE);
        this.lab_pjbh.string = '牌局编号:' + '';
        this.updateDeskInfo(data.deskData);
        this.setMyGold(data.userScore);
    }

    onGameSceneStartJetton(data: LongHu.CMD_Scene_StatusJetton) {
        this._leave_time = data.timeLeave;
        this.setGameStatus(GAME_STATUS.LH_GAME_BET);
        this.lab_pjbh.string = '牌局编号:' + data.roundId;
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
                this.playerBet((playerIndex && playerIndex.hasOwnProperty('user'))? playerIndex.user.userId:-1, chip_index, element.jettonArea);
            }
        }

        for (let index = 0; index < data.deskData.divineJettonScore.length; index++) {
            if (data.deskData.divineJettonScore[index].jettonScore > 0) {
                this.playLuckyBet(data.deskData.divineJettonScore[index].jettonArea);
            }
        }
    }

    onGameSceneEnd(data: LongHu.CMD_Scene_StatusEnd) {
        this.openCard(data.deskData.cards[0].cardData, data.deskData.cards[1].cardData, false);
        this.onGameEnd(data, true);
    }


    /** 停止下注 */
    onGameEnd(data: LongHu.CMD_S_GameEnd, isGameEndScene = false) {
        this._playerHadPlaceJetton = false;
        if(!isGameEndScene) {
            this._node_root.stopAllActions();
            this._layer_chip.stopAllActions();
        }
        this.setGameStatus(GAME_STATUS.LH_GAME_END);
        // cc.warn("龙虎游戏记录数据5。。。。。。。。。。。。。。this._is_first_in"+this._is_first_in)
        if (this._is_first_in) {
            // this._node_wait_next.active = true;
            if(!isGameEndScene) {
                this.setLuDan(this._brlh_model._game_record.record, true);
            }
            this.updateDeskInfo(data.deskData);
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
            this.setMyGold(data.userScore);
            if (this._leave_time >= 2.5) {
                if (data.deskData.bankerInfo.currentBankerInfo != null) {
                    this.playUserEndScore(data.gameEndScore, data.deskData.bankerInfo.currentBankerInfo, data.timeLeave - 3);
                }
                else {
                    this.playUserEndScore(data.gameEndScore, null, data.timeLeave - 3);
                }
            }
            // this.openCard(data.deskData.cards[0].cardData, data.deskData.cards[1].cardData, false);
            this._is_first_in = false;
            this.showWinTag(data.deskData.winTag);
            if (data.timeLeave > 3) {
                this.flyChip(data.deskData.winTag);
            }

        }
        this.node_continue.getComponent(cc.Button).interactable = false
        this.lab_pjbh.string = '牌局编号:' + data.roundId;
        this._leave_time = data.timeLeave;
       
        this.setMyJetton(data.deskData.selfJettonScore);
        this.setTotalJetton(data.deskData.allJettonScore);

        this._chipgroup.unAllChips();

        this._isHadInitJetton = false;
        if (!this._is_first_in) {
            // if (this._leave_time >= 7) {
            //     this.vbrlh_animamgr.showStopBet();
            //     this._music_mgr.playStopBet();
            // }
            this.showWinTag(data.deskData.winTag);
            if (data.timeLeave > 2.5) {
                if (data.deskData.bankerInfo.currentBankerInfo != null) {
                    this.playUserEndScore(data.gameEndScore, data.deskData.bankerInfo.currentBankerInfo, data.timeLeave -3);
                }
                else {
                    this.playUserEndScore(data.gameEndScore, null, data.timeLeave -3);
                }
            }
            this._node_root.runAction(cc.sequence(
                cc.delayTime(DELT_LUDAN),
                cc.callFunc(() => {
                    if (!this._isShowFlag) {
                        if(!isGameEndScene) {
                            this.setLuDan(this._brlh_model._game_record.record, data.timeLeave > 4 ? true : false);
                        }
                        this._isShowFlag = false;
                    }
                    // this.setLuDan([2,2,2], true);
                }, this),

                cc.delayTime(DELT_PIAO),
                cc.callFunc(() => {
                   
                    this.setMyGold(data.userScore);
                })))
                // cc.warn("游戏结束时候调取---"+JSON.stringify(data));

                this.updateDeskInfo(data.deskData);
            if (data.timeLeave > 3) {
                this.flyChip(data.deskData.winTag);
            }
            // this.openCard(data.deskData.cards[0].cardData, data.deskData.cards[1].cardData, data.timeLeave <= 5 ? false : true);
            this._is_first_in = false;
        }
    }

}
