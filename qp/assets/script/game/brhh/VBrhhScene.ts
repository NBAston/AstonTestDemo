
import VBaseUI from "../../common/base/VBaseUI";
import UScene from "../../common/base/UScene";
import BrhhAnimation from "./BrhhAnimation";
import UNodeHelper from "../../common/utility/UNodeHelper";
import VBrhhMenu from "./view/VBrhhMenu";
import AppGame from "../../public/base/AppGame";

import MBrhh from "./model/MBrhh";

import { RoomInfo } from "../../public/hall/URoomClass";


import VBrhhAnimaMgr from "./view/VBrhhAnimaMgr";
import BrhhRect from "./BrhhRect";
import BrhhLuDan from "./BrhhLuDan";
import { HongHei } from "../../common/cmd/proto";
import BrhhCardGroup from "./BrhhCardGroup";
import UDebug from "../../common/utility/UDebug";
import UBrhhMusic from "./UBrhhMusic";
import UAudioRes from "../../common/base/UAudioRes";
import BrSeat from "../common/BrSeat";
import BrChipPool from "../common/BrChipPool";
import { ECommonUI, ETipType } from "../../common/base/UAllenum";
import BrAnimation from "../common/BrAnimation";
import UGame from "../../public/base/UGame";
import BrlhSeat from "../common/BrlhSeat";
import ULanHelper from "../../common/utility/ULanHelper";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import UEventHandler from "../../common/utility/UEventHandler";

import VBrhhBtn from "./view/VBrhhBtn";
import UStringHelper from "../../common/utility/UStringHelper";
import { ZJH_SCALE } from "../zjh/MZJH";
import MHall, { NEWS } from "../../public/hall/lobby/MHall";
import MRole from "../../public/hall/lobby/MRole";
import { EventManager } from "../../common/utility/EventManager";
import cfg_event from "../../config/cfg_event";
import AppStatus from "../../public/base/AppStatus";
import { SSL_OP_ALL } from "constants";
import BrChipNewGroup from "../common/BrChipNewGroup";


/**
 * 和 ：1    龙： 2     虎： 3
 */

const { ccclass, property } = cc._decorator;


enum GAME_STATUS {
    LH_GAME_START = 1,   // 开始
    LH_GAME_END = 2,       // 游戏结束
    LH_GAME_FREE = 3,  // 开始开牌
    LH_GAME_START_TIPS = 4,   // 开始时间快结束了
    LH_GAME_OPEN = 5, // 开牌
    LH_GAME_BET = 6, // 开始下注
    LH_GAME_SCENE_FREE = 7, // 空闲



}


const FREE_TIME = 2;  // 自定义空闲时间
var BET_TIME = 0;

const DELT_LUDAN = 0.0
const DELT_PIAO = 3.5;
const DELT_FLY = 2.5;

const PIAO_TIME = 6.3;  // 飘分等待时间

const my_seat_id = 6;   // 玩家自己的座位
const no_seat_id = 7;  // 无座

const CHIP_COUNT = 100;  // 筹码池数量


const COUNT_DOWN = 5;

/***
 * 创建: 朱武
 * 作用: 百人红黑 主场景
 */

@ccclass
export default class VBrhhScene extends UGame {


    @property(VBrhhAnimaMgr)
    vbrhh_animamgr: VBrhhAnimaMgr = null;

    @property(cc.Node)
    node_desk: cc.Node = null;


    @property({ type: cc.Label, tooltip: "在线人数" })
    lab_online_count: cc.Label = null;

    @property(cc.Node)
    node_bottom: cc.Node = null;

    @property({ type: cc.Node, tooltip: "顶端bar" })
    node_banker: cc.Node = null;

    @property({ type: [cc.Node], tooltip: "幸运星星" })
    node_luckys: cc.Node[] = [];

    @property(cc.Sprite)
    sp_status: cc.Sprite = null;

    @property(cc.Label)
    lab_leavetime: cc.Label = null;

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


    _node_root: cc.Node = null;

    _layer_chip: cc.Node[] = [];   // 筹码层
    _layer_fly: cc.Node = null;   // 筹码飞层
    _layer_effect: cc.Node = null;  // 动画层 （开始下注，停止下注，等）

    _lab_pjbh: cc.Label = null;

    _layer_wait_next: cc.Node = null;
    _layer_wait_login: cc.Node = null;

    _lhd_pjbg: cc.Node = null;
    _gold = 0;
    // 游戏model
    _brhh_model: MBrhh = null;
    _rectsPlaceOld: number[] = [];
    _music_mgr: UBrhhMusic = null;

    _self_id = 1000;
    _leave_time = 0;   // 状态倒计时
    _game_status = GAME_STATUS.LH_GAME_START;

    _chipgroup: BrChipNewGroup = null;
    _room_info: RoomInfo = null;
    tmp_ludan: Array<number> = [];

    _chips_pool: BrChipPool[] = [];    // 筹码对象池
    // _fly_pool: BrChipPool = null;    // 筹码对象池  (专门用来结算时动画用的筹码)

    private _seats: { [key: number]: BrlhSeat } = {};
    private _rects: { [key: number]: BrhhRect } = {};
    private _card_groups: { [key: number]: BrhhCardGroup } = {};
    private _ludan: BrhhLuDan = null;
    _leave_bet_sound: number = 0;
    _endGameData: any = null;


    _node_hong_flag: cc.Node = null;
    _node_hei_flag: cc.Node = null;

    _btn_rebet: cc.Button = null;

    _can_rebet: boolean = false;

    _is_first_in: boolean = true;
    _isShowFlag: boolean = false;
    _isHadInitJetton: boolean = false; // 是否已经初始化了筹码了， 主要用于在开牌场景进入时

    _hong_node: cc.Node = null;

    _hei_node: cc.Node = null;

    _teshu_node: cc.Node = null;

    _charge_btn: cc.Node = null;

    _playerHadPlaceJetton: boolean = false;

    _resize_fun: () => void;

    /******************************************************************** 
     *                                                                  *
     ********************************************************************/
    /**单例 */
    private static _ins: VBrhhScene;
    static get ins(): VBrhhScene {
        return VBrhhScene._ins;
    }

    private updateScore(): void {
        if (AppGame.ins.roleModel.score < AppGame.ins.game_watch_limit_score) {
            this.checkNode.active = true;
        } else {
            this.checkNode.active = false;
        }
    }

    private requestScore(): void {
        AppGame.ins.roleModel.requestUpdateScore();
    }

    protected onDisable() {
        super.onDisable();
        this.clearDesk();
    }

    protected onEnable() {
        super.onEnable();
        this.updateScore();
    }


    initUi() {
        this._music_mgr = new UBrhhMusic(this.node.getComponent(UAudioRes));

        this._node_root = UNodeHelper.find(this.node, 'uinode');
        this._layer_chip[0] = UNodeHelper.find(this._node_root, 'layer_chip0')
        this._layer_chip[1] = UNodeHelper.find(this._node_root, 'layer_chip1')
        this._layer_chip[2] = UNodeHelper.find(this._node_root, 'layer_chip2')
        this._layer_fly = UNodeHelper.find(this._node_root, 'layer_fly')
        this._layer_effect = UNodeHelper.find(this._node_root, 'layer_effect');


        this._layer_wait_login = UNodeHelper.find(this._node_root, 'node_wait_login');
        this._layer_wait_next = UNodeHelper.find(this._node_root, 'node_wait_next');
        this._layer_wait_login.active = true;

        let chip_container = UNodeHelper.find(this.node_bottom, 'toggle_container');
        this._chipgroup = new BrChipNewGroup(chip_container);
        this._chipgroup.chipValues = this._room_info.jettons;

        this._lab_pjbh = UNodeHelper.getComponent(this._node_root, 'node_top/lab_paiju', cc.Label);
        this._lab_pjbh.string = '';

        let lab_total0 = UNodeHelper.getComponent(this.node_desk, 'teshu_gold/lab_gold_total_0', cc.Label);
        let lab_self0 = UNodeHelper.getComponent(this.node_desk, 'teshu_gold/lab_my_xiazhu_0', cc.Label);

        let lab_total1 = UNodeHelper.getComponent(this.node_desk, 'hei_gold/lab_gold_total_1', cc.Label);
        let lab_self1 = UNodeHelper.getComponent(this.node_desk, 'hei_gold/lab_my_xiazhu_1', cc.Label);

        let lab_total2 = UNodeHelper.getComponent(this.node_desk, 'hong_gold/lab_gold_total_2', cc.Label);
        let lab_self2 = UNodeHelper.getComponent(this.node_desk, 'hong_gold/lab_my_xiazhu_2', cc.Label);

        this._rects[HongHei.JET_AREA.SPECIAL_AREA] = new BrhhRect(UNodeHelper.find(this.node_desk, 'sp_rect_teshu'), lab_total0, lab_self0);
        this._rects[HongHei.JET_AREA.RED_AREA] = new BrhhRect(UNodeHelper.find(this.node_desk, 'sp_rect_hong'), lab_total2, lab_self2);
        this._rects[HongHei.JET_AREA.BLACK_AREA] = new BrhhRect(UNodeHelper.find(this.node_desk, 'sp_rect_hei'), lab_total1, lab_self1);

        // this._chips_pool = new cc.NodePool();
        // this._fly_pool = new cc.NodePool();
        let tmp_chip = UNodeHelper.find(this._node_root, 'temp_chip');

        this._chips_pool[HongHei.JET_AREA.SPECIAL_AREA] = new BrChipPool(tmp_chip, this._layer_chip[HongHei.JET_AREA.SPECIAL_AREA]);
        this._chips_pool[HongHei.JET_AREA.RED_AREA] = new BrChipPool(tmp_chip, this._layer_chip[HongHei.JET_AREA.RED_AREA]);
        this._chips_pool[HongHei.JET_AREA.BLACK_AREA] = new BrChipPool(tmp_chip, this._layer_chip[HongHei.JET_AREA.BLACK_AREA]);
        this._chips_pool[3] = new BrChipPool(tmp_chip, this._layer_fly);

        this._chips_pool[HongHei.JET_AREA.SPECIAL_AREA].poolSize = CHIP_COUNT;
        this._chips_pool[HongHei.JET_AREA.RED_AREA].poolSize = CHIP_COUNT;
        this._chips_pool[HongHei.JET_AREA.BLACK_AREA].poolSize = CHIP_COUNT;

        this._chips_pool[3].poolSize = CHIP_COUNT * 3;

        this._card_groups[HongHei.JET_AREA.RED_AREA] = new BrhhCardGroup(UNodeHelper.find(this.node_desk, 'node_hong_cards'), this._music_mgr);
        this._card_groups[HongHei.JET_AREA.BLACK_AREA] = new BrhhCardGroup(UNodeHelper.find(this.node_desk, 'node_hei_cards'), this._music_mgr);


        this._node_hei_flag = UNodeHelper.find(this.node_desk, 'node_hei_flag');
        this._node_hong_flag = UNodeHelper.find(this.node_desk, 'node_hong_flag');

        this._hong_node = UNodeHelper.find(this.node, "uinode/sp_desk/sp_rect_hong");
        this._hei_node = UNodeHelper.find(this.node, "uinode/sp_desk/sp_rect_hei");
        this._teshu_node = UNodeHelper.find(this.node, "uinode/sp_desk/sp_rect_teshu");

        this._lhd_pjbg = UNodeHelper.find(this.node, "uinode/node_top/lhd_pjbg");
        this._charge_btn = UNodeHelper.find(this.node, "uinode/sp_desk/sp_seat_6/charge_btn");
        UEventHandler.addClick(this._lhd_pjbg, this.node, "VBrhhScene", "oncopy");
        UEventHandler.addClick(this._charge_btn, this.node, "VBrhhScene", "intoCharge");
        this.setHorseLampPos(0, 235);
        this._btn_rebet = UNodeHelper.getComponent(this.node_bottom, 'btn_rebet', cc.Button);
        this._btn_rebet['retime'] = 0;
        this.unRebet();

    }

    onLoad() {

    }

    start() {
        this._music_mgr.playGamebg();
        // this.testapi();
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

            let str_time = leave_time.toString();
            // if (leave_time < 10) {
            //     str_time = '0' + leave_time;
            // }
            this._leave_time -= dt;
            if (this._leave_time < 0) {
                this._leave_time = 0;
            }
            this.lab_leavetime.string = str_time;
            if (leave_time <= COUNT_DOWN && tmp_leave_time > leave_time && (this._game_status == GAME_STATUS.LH_GAME_BET || this._game_status == GAME_STATUS.LH_GAME_START_TIPS)) {
                this._music_mgr.playCountDown();
            }

            if (this._leave_time == 0 && this._game_status == GAME_STATUS.LH_GAME_FREE) {
                this.onStartBet(true, BET_TIME);
            }

            if (leave_time == COUNT_DOWN && this._game_status == GAME_STATUS.LH_GAME_BET) {
                this.onStartTips(leave_time);
            }
        }

        this._leave_bet_sound -= dt;
        if (this._leave_bet_sound < 0) this._leave_bet_sound = 0;

        if (this._can_rebet && !this._btn_rebet.interactable) {
            this._btn_rebet['retime'] -= dt;
            if (this._btn_rebet['retime'] <= 0) {
                this.avRebet();
            }
        }


    }

    // 测试
    testapi() {

        var num = 12345654.22;
        var nn = num.toLocaleString();
        UDebug.log(nn);
        var nnn = (num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'));
        UDebug.log(nnn);

    }

    //点击复制牌局信息
    private oncopy(): void {
        this._music_mgr.playClick();
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this._lab_pjbh.string).substr(5, 30));
    }

    private intoCharge(): void {
        this._music_mgr.playClick();
        AppGame.ins.showUI(ECommonUI.LB_Charge);
    }

    protected init() {
        VBrhhScene._ins = this;
        this.initUi();
        this.clearDesk();

        this._brhh_model = AppGame.ins.brhhModel;
        this._self_id = AppGame.ins.roleModel.useId;

        // for (let i = 0; i <= 5; i++) {
        //     let seat_node = UNodeHelper.find(this.node_desk, 'sp_seat_' + i);
        //     let seat = new BrSeat(seat_node);
        //     this._seats[i] = seat;
        // }

        for (let i = 0; i <= 7; i++) {
            let seat_node = UNodeHelper.find(this.node_desk, 'sp_seat_' + i);
            let lab_name = UNodeHelper.getComponent(this.node_desk, 'sp_seat_' + i + '/lab_name', cc.Label);
            let lab_gold = UNodeHelper.getComponent(this.node_desk, 'sp_seat_' + i + '/lab_gold', cc.Label);
            let lab_vip = UNodeHelper.getComponent(this.node_desk, 'lab_vip_' + i, cc.Label);
            let seat = new BrlhSeat(seat_node, lab_name, lab_gold, lab_vip);
            this._seats[i] = seat;
            seat.hide();
        }


        // this._seats[no_seat_id] = new BrSeat(UNodeHelper.find(this.node_bottom, 'btn_players'));
        this._seats[no_seat_id].show();

        let node_ludan = UNodeHelper.find(this.node_desk, 'node_ludan');
        this._ludan = new BrhhLuDan(node_ludan);

        /******************** */

        // this.setSeatInfo(this._brhh_model._desk_info.players);

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
        if (AppGame.ins.roleModel.score < AppGame.ins.game_watch_limit_score) {
            this.checkNode.active = true;
        } else {
            this.checkNode.active = false;
        }

        // this.setLuDan(this._brhh_model.gameRecord.record);

        // this.updateDeskInfo(this._brhh_model._desk_info);

        this.setGameStatus(this._brhh_model.gameStatus, this._brhh_model.leaveTime);
        if (this._game_status == GAME_STATUS.LH_GAME_FREE || this._game_status == GAME_STATUS.LH_GAME_BET) {
            this.sendCard();
        }

        let self = this;
        this._resize_fun = () => {
            self._seats[no_seat_id].updatePosition();
            self._seats[my_seat_id].updatePosition();
            // self._seats[5].updatePosition();
            // self._seats[0].updatePosition();
            // self._seats[1].updatePosition();
        }
        cc.game.on('resize', this._resize_fun);

        this.initModelEventListener();
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
                        AppGame.ins.brhhModel.sendBet(k, element);
                    }
                    total = total % (element / 100)
                }
            }
        }
    }

    /**
     * 清理桌面
     */
    clearDesk() {

        this._layer_chip[0].stopAllActions();

        this._layer_wait_next.active = false;

        this.vbrhh_animamgr.clear();

        this._layer_effect.removeAllChildren();

        this._chips_pool[HongHei.JET_AREA.SPECIAL_AREA].clear();
        this._chips_pool[HongHei.JET_AREA.BLACK_AREA].clear();
        this._chips_pool[HongHei.JET_AREA.RED_AREA].clear();
        this._chips_pool[3].clear();



        this._rectsPlaceOld = []

        for (let i = 0; i < 3; i++) {
            this._rectsPlaceOld.push(parseInt(this._rects[i]._lab_self_score.string))
            this._rects[i].clear();
        }
        UDebug.Log("-------------------------清理桌面" + this._rectsPlaceOld)

        for (let i = 1; i < 3; i++) {
            this._card_groups[i].clear();
        }

        for (let i = 0; i <= 2; i++) {
            this.node_luckys[i].active = false;
        }
        this._node_root.stopAllActions();
    }


    onDestroy() {
        cc.game.off('resize', this._resize_fun);
        this.removeModelEventListener();
        this._brhh_model.resetData();

    }

    /**
     * 监听model事件
     */
    private initModelEventListener() {
        // this._brhh_model.on(MBrhh.S_GAME_FREE, this.onGameFree, this);
        this._brhh_model.on(MBrhh.S_SYNC_TIME, this.onSyncTime, this);
        this._brhh_model.on(MBrhh.S_GAME_START, this.onGameStart, this);
        this._brhh_model.on(MBrhh.S_SEND_RECORD, this.onGameRecord, this);
        this._brhh_model.on(MBrhh.S_START_PLACE_JETTON, this.onStartPlaceJetton, this);
        this._brhh_model.on(MBrhh.S_PLACE_JET_FAIL, this.onPlaceJettonFail, this);
        this._brhh_model.on(MBrhh.S_PLACE_JETTON, this.onPlaceJetton, this);

        this._brhh_model.on(MBrhh.S_GAME_OPEN_CARD, this.onGameOpenCard, this);
        this._brhh_model.on(MBrhh.S_GAME_FREE_SCENE, this.onGameSceneFree, this);
        this._brhh_model.on(MBrhh.S_GAME_START_JETTON_SCENE, this.onGameSceneStartJetton, this);
        this._brhh_model.on(MBrhh.S_GAME_END_SCENE, this.onGameSceneEnd, this);
        this._brhh_model.on(MBrhh.S_GAME_OPEN_SCENE, this.onGameSceneOpenCard, this);

        this._brhh_model.on(MBrhh.S_JETTON_BROADCAST, this.onJettonBroadcast, this);
        this._brhh_model.on(MBrhh.S_GAME_END, this.onGameEnd, this);
        this._brhh_model.on(MBrhh.S_GAME_START, this.requestScore, this);
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        EventManager.getInstance().addEventListener(cfg_event.CLOSE_CHARGE, this.updateScore, this);
        this._brhh_model.run();
    }

    private removeModelEventListener() {
        // this._brhh_model.off(MBrhh.S_GAME_FREE);
        // this._brhh_model.off(MBrhh.S_GAME_FREE, this.onGameFree, this);
        this._brhh_model.off(MBrhh.S_SYNC_TIME, this.onSyncTime, this);
        this._brhh_model.off(MBrhh.S_GAME_START, this.onGameStart, this);
        this._brhh_model.off(MBrhh.S_SEND_RECORD, this.onGameRecord, this);
        this._brhh_model.off(MBrhh.S_START_PLACE_JETTON, this.onStartPlaceJetton, this);
        this._brhh_model.off(MBrhh.S_PLACE_JET_FAIL, this.onPlaceJettonFail, this);
        this._brhh_model.off(MBrhh.S_PLACE_JETTON, this.onPlaceJetton, this);
        this._brhh_model.off(MBrhh.S_GAME_OPEN_CARD, this.onGameOpenCard, this);

        this._brhh_model.off(MBrhh.S_GAME_FREE_SCENE, this.onGameSceneFree, this);
        this._brhh_model.off(MBrhh.S_GAME_START_JETTON_SCENE, this.onGameSceneStartJetton, this);
        this._brhh_model.off(MBrhh.S_GAME_END_SCENE, this.onGameSceneEnd, this);
        this._brhh_model.off(MBrhh.S_GAME_OPEN_SCENE, this.onGameSceneOpenCard, this);

        this._brhh_model.off(MBrhh.S_JETTON_BROADCAST, this.onJettonBroadcast, this);
        this._brhh_model.off(MBrhh.S_GAME_END, this.onGameEnd, this);
        this._brhh_model.off(MBrhh.S_GAME_START, this.requestScore, this);
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        EventManager.getInstance().removeEventListener(cfg_event.CLOSE_CHARGE, this.updateScore, this);
        this._brhh_model.exit();
        // this._brhh_model.targetOff(this);
    }


    /**
     * 设置游戏状态 
     * @param status 状态
     */
    setGameStatus(status: GAME_STATUS, leave_time: number) {

        UDebug.Log("设置状态->" + status);
        this._leave_time = leave_time;
        this._game_status = status;
        if(status == GAME_STATUS.LH_GAME_OPEN) {
            this.sp_status.spriteFrame = this.spf_status[2];
        } else if (status == GAME_STATUS.LH_GAME_END) {
            this.sp_status.spriteFrame = this.spf_status[3];
        } else if (status == GAME_STATUS.LH_GAME_BET) {
            this.sp_status.spriteFrame = this.spf_status[1];
        } else if (status == GAME_STATUS.LH_GAME_FREE) {
            this.sp_status.spriteFrame = this.spf_status[0];
        } else if (status == GAME_STATUS.LH_GAME_START_TIPS) {
            this.sp_status.spriteFrame = this.spf_status[1];
        }
    }


    /**
     * 获取一个筹码
     * @param rect 特殊 黑 红  fly  0123
     * @param type 筹码值
     */
    getChip(rect: number, type: number) {
        let chip_node = this._chips_pool[rect].getChipByPool();
        let chip_data = this._chipgroup.getLabBgValue(type);

        let lab_chip = UNodeHelper.getComponent(chip_node, '', cc.Label);
        lab_chip.string = chip_data.bg;

        // let lab_num = UNodeHelper.getComponent(chip_node, 'lab_num', cc.Label);
        // lab_num.string = chip_data.value.toString();
        // var color1 = new cc.Color(115, 159, 96);
        // let chip_font = "chip_1";
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



    /**
     * 发牌
     * @param action 是否播放发牌动画
     */
    sendCard(action: boolean = false) {

        this._card_groups[1].sendCard(action);
        this._card_groups[2].sendCard(action);
    }


    /**
     * 开牌
     * @param action 是否播放动画
     */
    openCard(cards: Array<HongHei.ICardGroup>, action: boolean = true) {

        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            if (card.groupId == HongHei.JET_AREA.BLACK_AREA) {
                this._card_groups[HongHei.JET_AREA.BLACK_AREA].openCards(card.cardData, 0.5, 2, action);
                this._card_groups[HongHei.JET_AREA.BLACK_AREA].cardType = card.cardType;
                // cc.warn("--------card.cardType = "+card.cardType)
                if (!action) {
                    this._card_groups[HongHei.JET_AREA.BLACK_AREA].showType();
                }

            } else if (card.groupId == HongHei.JET_AREA.RED_AREA) {
                this._card_groups[HongHei.JET_AREA.RED_AREA].openCards(card.cardData, 0.2, 1, action);
                this._card_groups[HongHei.JET_AREA.RED_AREA].cardType = card.cardType;
                if (!action) {
                    this._card_groups[HongHei.JET_AREA.RED_AREA].showType();
                }
                // cc.warn("--------card.cardType = "+card.cardType)

            }
        }
    }

    /** 
     * 结算时飞筹码
     */
    flyChip(winTag: number, is_lucky: boolean = false, isDelay: boolean = false) {

        let del_time = 0//isDelay ? 4 : 0;

        let pos = this._node_hong_flag.position;

        if (winTag == HongHei.JET_AREA.BLACK_AREA) {
            pos = this._node_hei_flag.position;
        }


        // for (let i = 0; i < this._layer_chip.length; i++) {
        //     this._layer_chip[i].stopAllActions();
        // }
        this._layer_chip[0].runAction(cc.sequence(cc.delayTime(del_time), cc.callFunc(() => {  // 庄家先收赢了的金币

            let is_play = false;

            for (let i = 0; i < this._layer_chip.length; i++) {
                for (let index = 0; index < this._layer_chip[i].children.length; index++) {
                    var node = this._layer_chip[i].children[index];

                    if (winTag != node['rect']) {
                        if (!is_lucky || node['rect'] != HongHei.JET_AREA.SPECIAL_AREA) {
                            is_play = true;
                            BrhhAnimation.moveChip(node, new cc.Vec2(pos.x, pos.y), (node: cc.Node) => {
                                node.opacity = 0;
                            });
                        }
                    }
                }
            }
            if (is_play) this._music_mgr.playflyCoin();
        }),
            cc.delayTime(1),
            cc.callFunc(() => {               // 庄家补金币到桌子上

                let is_play = false;
                for (let i = 0; i < this._layer_chip.length; i++) {
                    for (let index = 0; index < this._layer_chip[i].children.length; index++) {
                        var node = this._layer_chip[i].children[index];
                        if (winTag == node['rect'] || (is_lucky && node['rect'] == HongHei.JET_AREA.SPECIAL_AREA)) {
                            is_play = true;
                            var new_node = this.getChip(3, node['bet_type']);
                            new_node.position = pos;
                            new_node.parent = this._layer_fly;
                            new_node['src_pos'] = node['src_pos'];

                            var desc_pos = this.getBetJettonPos(node['rect']);

                            BrhhAnimation.bankerChipMove(new_node, desc_pos, (node: cc.Node) => { }, 0.3);
                        }
                    }
                }
                if (is_play) this._music_mgr.playflyCoin();

            }),
            cc.delayTime(1),
            cc.callFunc(() => {     // 桌子的金币飞回给玩家
                var no_pos = this._seats[no_seat_id].getPosition();
                let is_play = false;
                for (let i = 0; i < this._layer_chip.length; i++) {
                    for (let index = 0; index < this._layer_chip[i].children.length; index++) {
                        var node = this._layer_chip[i].children[index];
                        is_play = true;
                        if (node['src_pos']) {
                            BrhhAnimation.moveChip(node, node['src_pos'], (node: cc.Node) => {
                                node.opacity = 0;
                            });
                        } else {
                            BrhhAnimation.moveChip(node, no_pos, (node: cc.Node) => {
                                node.opacity = 0;
                            });
                        }
                    }
                }

                for (let index = 0; index < this._layer_fly.children.length; index++) {
                    var node = this._layer_fly.children[index];
                    if (node['src_pos']) {
                        BrhhAnimation.moveChip(node, node['src_pos'], (node: cc.Node) => {
                            node.opacity = 0;
                        });
                    } else {
                        BrhhAnimation.moveChip(node, no_pos, (node: cc.Node) => {
                            node.opacity = 0;
                        });
                    }
                }
                if (is_play) this._music_mgr.playflyCoin();
            }),
        ));
    }


    showWinTag(win_tag: number, is_lucky: boolean, isDelay: boolean = true) {
        if (this._rects[win_tag]) {
            if (this._leave_time >= 3) {
                if(this._game_status == GAME_STATUS.LH_GAME_END) {
                    this.vbrhh_animamgr.showWin(win_tag);
                }
            }
            this._rects[win_tag].showBlink();
        }

        if (is_lucky)
            this._rects[HongHei.JET_AREA.SPECIAL_AREA].showBlink();
    }


    setMySeatInfo(data: any) {
        this._seats[my_seat_id].show();
        this._seats[my_seat_id].setInfo(data);
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
    setLuDan(winTag: Array<HongHei.IHongHeiGameRecord>, isblink: boolean = false) {
        this._ludan.setLuDan(winTag, isblink);
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
            if (this._rects[place.jettonArea])
                this._rects[place.jettonArea].setTotalGold(place.jettonScore);
        }
    }

    /**
     * 每个区域自己的下注值
     */
    setMyJetton(data: any) {
        for (let index = 0; index < data.length; index++) {
            const place = data[index];
            if (this._rects[place.jettonArea])
                this._rects[place.jettonArea].setSelfGold(place.jettonScore);
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
    * @param data HongHei.GameDeskInfo
    */
    updateDeskInfo(data: HongHei.IGameDeskInfo) {
        if (data.bankerInfo && data.bankerInfo.hasOwnProperty('currentBankerInfo') && data.bankerInfo.currentBankerInfo.banker.score) {
            this.goldLabel.string = UStringHelper.formatPlayerCoin(data.bankerInfo.currentBankerInfo.banker.score / 100);
        }
        this.setMyJetton(data.selfJettonScore);
        this.setTotalJetton(data.allJettonScore);

        this.setSeatInfo(data.players);

        this.lab_online_count.string = `` + data.onlinePlayCount.toString();  // 设置在线人数
    }


    /**
     * 获取对应的下注区域pos （随机点）
     * @param bet_rect 下注区域  特殊， 黑， 红 0,1,2
     */
    getBetJettonPos(bet_rect: number): cc.Vec2 {
        var dest_pos = new cc.Vec2(0, 0);
        var ract_width = 160;
        var ract_height = 35;

        if (this._rects[bet_rect]) {
            var end_center_pos = this._rects[bet_rect].position;

            if (bet_rect == HongHei.JET_AREA.SPECIAL_AREA) { // 特殊，
                end_center_pos.y -= 2;
                ract_width = 450;
                ract_height = 20;
            }

            var flag = 1;
            if (Math.random() > 0.5) { flag = -1; }
            dest_pos.x = end_center_pos.x + Math.random() * ract_width * flag;

            flag = 1;
            if (Math.random() > 0.5) { flag = -1; }
            dest_pos.y = end_center_pos.y - 15 + Math.random() * ract_height * flag;
        } else {
            UDebug.Log('找不到区域: ' + bet_rect);
        }

        return dest_pos;
    }

    playBetSound() {
        if (this._leave_bet_sound == 0) {
            this._leave_bet_sound = 0.1;
            this._music_mgr.playbet();
        }
    }


    /**
     * 玩家下注
     * @param playerid 玩家id 
     * @param bet_type 下注类型
     * @param bet_rect 下注区域 （0：特殊  1：黑  2：红）
     */
    playerBet(playerid: number, bet_type: number = 10, bet_rect: number, dlet_time?: number, seat_id?: number) {

        dlet_time = dlet_time || 0;

        var dest_pos = this.getBetJettonPos(bet_rect);

        if (bet_type == -1) { return; }

        var chip_node = this.getChip(bet_rect, bet_type);

        chip_node.parent = this._layer_chip[bet_rect];

        chip_node['bet_type'] = bet_type;
        chip_node['rect'] = bet_rect;

        this.playBetSound();

        seat_id = seat_id || this._brhh_model.haveSeat(playerid);

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



        chip_node['src_pos'] = chip_node.position;
        chip_node.stopAllActions();
        chip_node.rotation = 0;
        BrhhAnimation.betMove(chip_node, dest_pos, () => {

        }, dlet_time);

    }


    /**
     * 播放幸运星下注动画
     * @param rect 
     * @param isaction 
     */
    playLuckyBet(rect: number, isaction: boolean = false) {
        if (isaction) {
            var new_star = cc.instantiate(this.node_luckys[3]);
            new_star.parent = this._layer_effect;
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

            let bolato = BrAnimation.createParabolaTo(destime, new_star.position, des_pos, 60, 90);
            new_star.runAction(cc.sequence(cc.spawn(cc.scaleTo(destime, 1), bolato), cc.delayTime(0.2), cc.callFunc((node: any) => {
                this.node_luckys[node['rect']].active = true;
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

    unRebet() {
        this._btn_rebet.interactable = false;
        this._btn_rebet['retime'] = 0.5;
        this._btn_rebet.node.color = cc.color(141, 115, 106, 212);
    }
    avRebet() {
        this._btn_rebet.interactable = true;
        this._btn_rebet.node.color = cc.color(255, 255, 255, 255);
    }


    /**
     * 播放玩家输赢分数
     */
    playUserEndScore(data: any, current: HongHei.ICurrentBankerInfo = null, isDelayTime: number = PIAO_TIME) {
        if (current != null) {
            if (current.banker.userId == AppGame.ins.roleModel.useId) {
                this._seats[my_seat_id].playWinOrLoseScore(current.bankerWinScore, isDelayTime);
            }
        }
        for (let index = 0; index < data.length; index++) {
            const element = data[index];

            if (element.userId == AppGame.ins.roleModel.useId) {
                this._seats[my_seat_id].playWinOrLoseScore(element.returnScore, isDelayTime);
            }

            let have_seat = false;

            for (let i = 0; i < 6; i++) {

                if (this._seats[i].userid == element.userId) {
                    this._seats[i].playWinOrLoseScore(element.returnScore, isDelayTime, false, i);
                    have_seat = true;
                }
            }

            if (!have_seat) {
                // this._seats[no_seat_id].playWinOrLoseScore(element.returnScore, del_time);
            }
        }
    }


    /********************************* msg event *********************/

    /**
     * 空闲时间
     * @param event 
     */
    onGameFree(show_effact: boolean = true) {

        this.setGameStatus(GAME_STATUS.LH_GAME_FREE, FREE_TIME);
        this.clearDesk();
        // this._chipgroup.unAllChips();
        if (show_effact) {
            this.vbrhh_animamgr.showVsAnima();
            this._music_mgr.playVs();
            this.sendCard(true);
        } else {
            this.sendCard(false);
        }
    }


    onStartBet(show_effact: boolean = true, leave_time: number) {
        this.setGameStatus(GAME_STATUS.LH_GAME_BET, leave_time);

        if (show_effact) {
            this.sendCard();
            if (leave_time >= 14) {
                this._music_mgr.playStartBet();
                this.vbrhh_animamgr.showStartBet();
            }
        } else {
            this.sendCard(false);
        }
    }


    onStartTips(leave_time: number) {
        this.setGameStatus(GAME_STATUS.LH_GAME_START_TIPS, leave_time);
        this._music_mgr.playChipTips();
    }

    /**设置桌面路单 */
    onGameRecord(data: any) {
        UDebug.log("设置桌面路单");
        UDebug.log(data);
        this._layer_wait_login.active = false;
        this.setLuDan(data.record, false);
    }
    /**
   * 游戏切换到后台
   * @param isHide 是否切在后台
   */
    onGameToBack(isBack: boolean) {
        this._node_root.stopAllActions();
        if (!isBack) {
            this._isShowFlag = true;
        }
    }

    /**
     * 玩家下注 （目前所有玩家下注都是走这里）
     * @param data 
     */
    onPlaceJetton(data: HongHei.CMD_S_PlaceJetSuccess) {
        let chips = this._chipgroup.chipSplik2(data.jettonScore);
        UDebug.log(chips);
        let max_count = chips.length;
        var seat_id = this._brhh_model.haveSeat(data.userId);
        for (let j = 0; j < max_count; j++) {
            // let del_time = (j / max_count) * 0.8;
            for (let k = 0; k < chips[j]; k++) {
                // for (let ii = 0; ii< 10; ii++)
                this.playerBet(data.userId, j, data.jettonArea, 0, seat_id);
            }
            // this.playerBet(data.dwUserID, chips[j], data.cbJettonArea);
        }

        if (seat_id == 0) {
            this.playLuckyBet(data.jettonArea, true);
        }

        // var chip_index = this.chipValueToIndex(data.jettonScore);
        // this.playerBet(data.dwUserID, chip_index, data.cbJettonArea);

        if (data.userId == AppGame.ins.roleModel.useId) {
            this.node_continue.getComponent(cc.Button).interactable = false
            this._playerHadPlaceJetton = true;
            this._chipgroup.check(data.userScore);
            this.setMyGold(data.userScore);
        }


        this.setSeatGold(data.userId, data.userScore);

        this.setTotalJetton(data.allJettonScore);
        this.setMyJetton(data.selfJettonScore);
    }


    onJettonBroadcast(data: any) {
        // onJettonBroadcast(data: HongHei.CMD_S_Jetton_Broadcast) {

        // for (let i = 0; i < data.tmpJettonScore.length; i++) {
        //     let chips = this._chipgroup.chipSplik(data.tmpJettonScore[i]);
        //     UDebug.log(chips);
        //     for (let j = 0; j < chips.length; j++) {
        //         for (let k = 0; k < chips[j]; k++) {
        //             // for (let ii = 0; ii< 10; ii++)
        //             this.playerBet(0, j, i);
        //         }
        //     }
        // }

        for (let i = 0; i < data.tmpJettonScore.length; i++) {
            let chips = this._chipgroup.chipSplik(data.tmpJettonScore[i]);
            UDebug.log(chips);
            let max_count = chips.length;
            for (let j = 0; j < max_count; j++) {
                let del_time = (j / max_count) * 0.8;
                this.playerBet(0, chips[j], i, del_time);
            }
        }

        for (let index = 0; index < data.AllJettonScore.length; index++) {

            if (this._rects[index])
                this._rects[index].setTotalGold(data.AllJettonScore[index]);
        }
        // this.setTotalJetton(data.AllJettonScore);
    }

    /**
     * 下注失败
     * @param data 
     */
    onPlaceJettonFail(data: HongHei.CMD_S_PlaceJettonFail) {
        UDebug.log(data);
        this.showTips(data.errMsg);
    }

    onSyncTime(data: HongHei.CMD_S_SyncTime_Res) {
        // cc.warn("data.timeleave------------"+data.timeLeave)
        if (this._game_status == GAME_STATUS.LH_GAME_FREE) {
            this.setGameStatus(GAME_STATUS.LH_GAME_BET, data.timeLeave);
        }
        this._leave_time = data.timeLeave;
        if (this._game_status == GAME_STATUS.LH_GAME_END && this._leave_time <= 6) {
            if (this._endGameData && this._endGameData.hasOwnProperty('deskData')) {
                this.setLuDan(this._brhh_model._game_record.record, true);
                this.openCard(this._endGameData.deskData.cards, false);
            }
        }
    }
    /** 游戏开始 */
    onGameStart(data: HongHei.CMD_S_GameStart) {
        this.setContinueStatus();
        this._isHadInitJetton = false;
        this._isShowFlag = false;
        this._leave_time = data.timeLeave;
        this.setGameStatus(GAME_STATUS.LH_GAME_START, data.timeLeave);
        this._lab_pjbh.string = '牌局编号:' + data.roundId;
        this.onGameFree(!this._is_first_in);
        this.updateDeskInfo(data.deskData);
        this._is_first_in = false;
        if (data.deskData && data.deskData.hasOwnProperty('gameOpenRecord')) {
            this.setLuDan(data.deskData.gameOpenRecord.record);
        }
    }


    /** 开始下注 */
    onStartPlaceJetton(data: HongHei.CMD_S_StartPlaceJetton) {
        if(!this._isShowFlag) {
            this._chipgroup.avAllChips();
        }
        this._chipgroup.check(data.userScore);
        this._isShowFlag = false;
        this._isHadInitJetton = false;
        for (let i in this._seats)
            this._seats[i].clear();
        // this.clearDesk();
        // this._can_rebet = data.bRejetton;
        this._lab_pjbh.string = "牌局编号:" + data.roundId;
        this._leave_time = data.timeLeave;
        // BET_TIME = data.cbPlaceTime - FREE_TIME;
        // if (data.cbPlaceTime - data.cbTimeLeave < FREE_TIME) {   // 场景消息， 刚刚进来的时候，开始下注时间，小于Freetime

        //     this._leave_time = FREE_TIME - (data.cbPlaceTime - data.cbTimeLeave);
        //     this.onGameFree(data);
        // }
        // else {
        // this.onStartBet(false, data.timeLeave);
        // }
        this.onStartBet(!this._is_first_in, data.timeLeave);

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
     onGameOpenCard(data: HongHei.CMD_S_OpenCard) {
        this._chipgroup.unAllChips();
        if(data.timeLeave >= 3.8) {
            this.vbrhh_animamgr.showStopBet();
            this._music_mgr.playStopBet();
        }
        this.setGameStatus(GAME_STATUS.LH_GAME_OPEN, data.timeLeave);
        this._lab_pjbh.string = '牌局编号:' + data.roundId;
        this.node_continue.getComponent(cc.Button).interactable = false
        this._leave_time = data.timeLeave;
        this.openCard(data.cards, data.timeLeave <= 3 ? false : true);

    }

    onGameSceneFree(data: HongHei.CMD_Scene_StatusFree) {
        this._leave_time = data.timeLeave;
        this.setGameStatus(GAME_STATUS.LH_GAME_SCENE_FREE, data.timeLeave);
        this._lab_pjbh.string = '牌局编号:' + '';
        this.updateDeskInfo(data.deskData);
        this.setMyGold(data.userScore);
    }
    
    onGameSceneStartJetton(data: HongHei.CMD_Scene_StatusJetton) {
        this._leave_time = data.timeLeave;
        this.setGameStatus(GAME_STATUS.LH_GAME_BET, data.timeLeave);
        this._lab_pjbh.string = '牌局编号:' + data.roundId;
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

    onGameSceneEnd(data: HongHei.CMD_Scene_StatusEnd) {
        this.openCard(data.deskData.cards, false);
        this.onGameEnd(data, true);
    }

    onGameSceneOpenCard(data: HongHei.CMD_Scene_StatusOpen) {
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
    /** 停止下注 */
    onGameEnd(data: HongHei.CMD_S_GameEnd, isGameEndScene = false) {
        this._leave_time = data.timeLeave;
        this._playerHadPlaceJetton = false;
        this._endGameData = data;
        this.node_continue.getComponent(cc.Button).interactable = false
        this._can_rebet = false;
        this.unRebet();
        this._chipgroup.unAllChips();
        this._lab_pjbh.string = "牌局编号:" + data.roundId;
        if (this._card_groups[data.deskData.winTag] != null) {
            this._card_groups[data.deskData.winTag].isWin = true;
        }
        this.setGameStatus(GAME_STATUS.LH_GAME_END, data.timeLeave);
        this._node_root.stopAllActions();
        if (this._is_first_in) {
            if(!isGameEndScene) {
                this.setLuDan(this._brhh_model._game_record.record, false);
            }
            this.updateDeskInfo(data.deskData);
            this.setMyGold(data.userScore);
            if (this._leave_time >= 2.5) {
                if (data.deskData.bankerInfo.currentBankerInfo != null) {
                    this.playUserEndScore(data.gameEndScore, data.deskData.bankerInfo.currentBankerInfo, data.timeLeave - 3);
                }
                else {
                    this.playUserEndScore(data.gameEndScore, null, data.timeLeave - 3);
                }
            }
            // this.openCard(data.deskData.cards, false);
            if(!this._isHadInitJetton) {
                for (let index = 0; index < data.deskData.jetInfo.length; index++) {
                    const element = data.deskData.jetInfo[index];
                    for (let index = 0; index < element.jettonCount; index++) {
                        var chip_index = this.chipValueToIndex(element.jettonType);
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
                this.flyChip(data.deskData.winTag, data.deskData.bLucky);
            }
            this._is_first_in = false;
        }
        this._isHadInitJetton = false;

        if (!this._is_first_in) {  // 普通一局结束
            // if (data.timeLeave >= data.cbPlaceTime) {  // 普通一局结束
            this._node_root.stopAllActions();
            this._layer_chip[0].stopAllActions();
            this._node_root.runAction(cc.sequence(cc.callFunc(() => {
                // if (this._leave_time >= 8) {
                //     this.vbrhh_animamgr.showStopBet();
                //     this._music_mgr.playStopBet();
                // }
                if (data.timeLeave > 2.5) {
                    if (data.deskData.bankerInfo.currentBankerInfo != null) {
                        this.playUserEndScore(data.gameEndScore, data.deskData.bankerInfo.currentBankerInfo, data.timeLeave - 3);
                    }
                    else {
                        this.playUserEndScore(data.gameEndScore, null, data.timeLeave - 3);
                    }
                }
                // this.openCard(data.deskData.cards, data.timeLeave <= 8 ? false : true);
                if (data.timeLeave > 3) {
                    this.flyChip(data.deskData.winTag, data.deskData.bLucky);
                }
                this.showWinTag(data.deskData.winTag, data.deskData.bLucky, data.timeLeave <= 4 ? false : true);
            }),
                cc.delayTime(DELT_LUDAN),
                cc.callFunc(() => {
                    if (!this._isShowFlag) {
                        if(!isGameEndScene) {
                            this.setLuDan(this._brhh_model._game_record.record, true);
                        }
                        this._isShowFlag = false;
                    }
                }, this),

                cc.delayTime(DELT_PIAO),
                cc.callFunc(() => {
                    if (!this._is_first_in) {
                        this.updateDeskInfo(data.deskData);
                        this.setMyGold(data.userScore);
                    }
                })))

            /* this.scheduleOnce(() => {
                 this.setLuDan(this._brhh_model._game_record.record, true);
             }, 3);
 
             this.scheduleOnce(() => {
                 this.updateDeskInfo(data.deskData);
                 this.setMyGold(data.userScore);
             }, 6.5);*/


            this._is_first_in = false;
        }

        // if (data.DeskData.winTag == HongHei.JET_AREA.BLACK_AREA) {

        // }
    }


}
