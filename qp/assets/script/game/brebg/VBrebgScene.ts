import UScene from "../../common/base/UScene";
import VBrebgMenu from "./view/VBrebgMenu";
import { RoomInfo } from "../../public/hall/URoomClass";
import MBrebg from "./model/MBrebg";
import AppGame from "../../public/base/AppGame";
import VBrebgAnima from "./view/VBrebgAnima";
import { Ebg } from "../../common/cmd/proto";
import UNodeHelper from "../../common/utility/UNodeHelper";
import BrebgAnimation from "./BrebgAnimation";
import UBrebgMusic from "./UBrebgMusic";
import UAudioRes from "../../common/base/UAudioRes";
import UResManager from "../../common/base/UResManager";
import { EIconType, ECommonUI, ETipType } from "../../common/base/UAllenum";

import USpriteFrames from "../../common/base/USpriteFrames";
import BrChipGroup from "../common/BrChipGroup";
// import BrSeat from "../common/BrSeat";
import BrAnimation from "../common/BrAnimation";
import UGame from "../../public/base/UGame";
import BrlhSeat from "../common/BrlhSeat";
import UDebug from "../../common/utility/UDebug";
import UEventHandler from "../../common/utility/UEventHandler";
import ULanHelper from "../../common/utility/ULanHelper";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import MHall, { NEWS } from "../../public/hall/lobby/MHall";
import UStringHelper from "../../common/utility/UStringHelper";
import MRole from "../../public/hall/lobby/MRole";
import cfg_event from "../../config/cfg_event";
import { EventManager } from "../../common/utility/EventManager";

export const ZJH_SCALE = 0.01;

/**
 * 创建： 朱武
 * 作用： 百人二八杠主场景脚本
 */

const { ccclass, property } = cc._decorator;

const CHIP_COUNT = 300;  // 筹码池数量

const DELT_LUDAN_UPDATE = 6;
const DELT_END_UPDATE = 8;  // 游戏结算，延时更新动画
const DELT_END_SCORE = 9;

const my_seat_id = 6;
const no_seat_id = 7;
enum GAME_STATUS {
    EBG_GAME_START = 1,   // 开始游戏  （摇塞子 发牌）
    EBG_GAME_BET = 2,       // 开始下注
    EBG_GAME_STOP = 3,       // 停止下注
    EBG_GAME_END = 4,  // 正在结算
    EBG_GAME_BET_TIP = 5,  // 下注时间快结束了提示
}


const GoldRate = 100;    // (1:100) (所有显示的地方都除以 GoldRate)

const COUNT_DOWN = 5;
const BET_INTER = 0.1;

@ccclass
export default class VBrebgScene extends UGame {
    // export default class VBrebgScene extends cc.Component {

    @property(cc.Node)
    node_menu: cc.Node = null;

    @property(cc.Node)
    node_desk: cc.Node = null;

    @property(cc.Node)
    node_bottom: cc.Node = null;

    @property(cc.Node)
    node_wait_next: cc.Node = null;

    @property(cc.Node)
    node_banker_head: cc.Node = null;

    @property({ type: [cc.Node], tooltip: "幸运星星" })
    node_luckys: cc.Node[] = [];

    @property(cc.Node)
    node_effect: cc.Node = null;

    @property(cc.Node)
    node_ludan: cc.Node = null;

    @property(cc.ToggleContainer)
    toggle_ct_chip: cc.ToggleContainer = null;

    @property(cc.Label)
    lab_leavetime: cc.Label = null;

    @property(cc.Sprite)
    sp_status: cc.Sprite = null;

    @property([cc.Label])
    lab_total_score: cc.Label[] = [];

    @property([cc.Label])
    lab_my_score: cc.Label[] = [];

    @property([cc.Node])
    node_my_jetton_bg: cc.Node[] = [];

    @property([cc.Node])
    node_win_rect: cc.Node[] = [];


    @property(cc.Button)
    btn_online: cc.Button = null;

    @property(VBrebgAnima)
    brebg_anima: VBrebgAnima = null;


    @property({ type: cc.Button, tooltip: "续压按钮" }) continueBtn: cc.Button = null;

    private _room_info: RoomInfo = null;
    private _brebg_model: MBrebg = null;

    _ui_root: cc.Node = null;

    _leave_time = 0;   // 状态倒计时
    _game_status = GAME_STATUS.EBG_GAME_START;
    _players: any = [];  // 座位玩家

    _music_mgr: UBrebgMusic = null;

    _chips_pool: cc.NodePool = null;    // 筹码对象池


    _layer_chip: cc.Node = null; //筹码层
    _layer_fly: cc.Node = null; // 飞筹码层

    _ui_node: cc.Node = null;
    _layer_wait_next: cc.Node = null;
    _layer_wait_login: cc.Node = null;

    _lab_pjbh: cc.Label = null;

    _leave_bet_sound: number = 0;
    _is_enter: boolean = true;

    _seats: BrlhSeat[] = [];

    _spframe: USpriteFrames = null;
    _pjbh: cc.Node = null;

    _chipgroup: BrChipGroup = null;

    _node_rect_1: cc.Button = null;
    _node_rect_2: cc.Button = null;
    _node_rect_3: cc.Button = null;

    _record_data: any[] = [];

    _is_first_in: boolean = true;
    _resize_fun: () => void;

    _charge_btn: cc.Node;
    @property(cc.Node)
    checkNode: cc.Node = null;
    _rectsPlaceOld: number[] = [];
    _gold = 0;
    /***************************************************************************************************** 
    * 
    *******************************************************************************************************/


    private updateScore(): void {
        // AppGame.ins.roleModel.requestUpdateScore();
        if (AppGame.ins.roleModel.score < AppGame.ins.game_watch_limit_score) {
            this.checkNode.active = true;
        } else {
            this.checkNode.active = false;
        }
    }


    protected onEnable() {

        super.onEnable();
        this.updateScore();
    }

    protected onDisable() {

        super.onDisable();
    }

    private intoCharge(): void {
        AppGame.ins.showUI(ECommonUI.LB_Charge);
    }

    protected init() {
        this._brebg_model = AppGame.ins.brebgModel;

        this._spframe = UNodeHelper.getComponent(this.node, '', USpriteFrames);
        this._ui_node = UNodeHelper.find(this.node, 'uinode');
        this._layer_wait_next = UNodeHelper.find(this._ui_node, 'node_wait_next');
        this._layer_wait_login = UNodeHelper.find(this._ui_node, 'node_wait_login');
        this._layer_wait_login.active = true;

        for (var i = 0; i < 8; i++) {

            let node_seat = UNodeHelper.find(this.node_desk, 'sp_seat_' + i);
            let lab_gold = UNodeHelper.getComponent(this.node_desk, 'lab_gold_' + i, cc.Label);
            let lab_name = UNodeHelper.getComponent(this.node_desk, 'lab_name_' + i, cc.Label);
            let lab_vip = UNodeHelper.getComponent(this.node_desk, 'lab_vip_' + i, cc.Label);
            this._seats[i] = new BrlhSeat(node_seat, lab_name, lab_gold, lab_vip);
        }

        this._seats[no_seat_id].show();

        this._ui_root = UNodeHelper.find(this.node, 'uinode');
        this._layer_chip = UNodeHelper.find(this.node_desk, 'node_chip_panel');
        this._layer_fly = UNodeHelper.find(this.node_desk, 'node_fly_panel');

        this._lab_pjbh = UNodeHelper.getComponent(this._ui_node, 'node_top/lab_pjbh', cc.Label);
        this._lab_pjbh.string = '';

        this._node_rect_1 = UNodeHelper.getComponent(this._ui_node, 'sp_desk/node_rect_1', cc.Button);
        this._node_rect_2 = UNodeHelper.getComponent(this._ui_node, 'sp_desk/node_rect_2', cc.Button);
        this._node_rect_3 = UNodeHelper.getComponent(this._ui_node, 'sp_desk/node_rect_3', cc.Button);

        this._pjbh = UNodeHelper.find(this.node, "uinode/node_top/pjbh");
        this._charge_btn = UNodeHelper.find(this.node, "uinode/sp_desk/sp_seat_6/charge_btn");
        UEventHandler.addClick(this._pjbh, this.node, "VBrebgScene", "oncopy");
        UEventHandler.addClick(this._charge_btn, this.node, "VBrebgScene", "intoCharge");

        this._music_mgr = new UBrebgMusic(this.node.getComponent(UAudioRes));

        this.brebg_anima.setMusicMgr(this._music_mgr);

        this.initChips();
        this.setMyInfo();
        this.clearDesk();

        this.initDgEventListener();
        this.initModelEventListener();

        let self = this;
        this._resize_fun = () => {
            self._seats[no_seat_id].updatePosition();
            self._seats[my_seat_id].updatePosition();
        }
        cc.game.on('resize', this._resize_fun, this);
        UDebug.Log(this._resize_fun);
    }

    start() {

        this._music_mgr.playGamebg();
    }

    onDestroy() {
        this.removeModelEventListener();
        if (this._resize_fun)
            cc.game.off('resize', this._resize_fun);
        this._brebg_model = null;

    }


    initDgEventListener() {
        // let node_graphics = UNodeHelper.getComponent(this._ui_node , 'node_graphics' ,  cc.Graphics);
        // let ctx = node_graphics;
        // // ctx = node.getComponent(cc.Graphics);
        // // ctx.lineCap = cc.Graphics.LineCap.ROUND;
        // // ctx.lineWidth = 10;

        // // ctx.moveTo(100, 100);
        // // ctx.lineTo(300, 100);
        // // ctx.stroke();

        // node_graphics.circle(0 ,0, 50);
        // node_graphics.stroke();
        // node_graphics.fill();

    }

    initModelEventListener() {
        this._brebg_model.on(MBrebg.S_SCENE_START, this.onGameSceneStart, this); // 开始场景
        this._brebg_model.on(MBrebg.S_SCENE_END, this.onGameSceneEnd, this);    // 结束场景
        this._brebg_model.on(MBrebg.S_SCENE_Jetton, this.onGameSceneJetton, this);  // 下注场景
        this._brebg_model.on(MBrebg.S_GameEnd, this.onGameEnd, this);       // 停止下注
        this._brebg_model.on(MBrebg.S_GameStart, this.onGameStart, this);     // 开始游戏  
        this._brebg_model.on(MBrebg.S_GameJetton, this.onGameJetton, this);  // 开始下注
        this._brebg_model.on(MBrebg.S_Jetton_Success, this.onJettonSuccess, this);  //下注成功 推送
        this._brebg_model.on(MBrebg.S_Jetton_Fail, this.onJettonFail, this);  //下注失败
        this._brebg_model.on(MBrebg.S_GameRecord, this.onGameRecord, this);
        this._brebg_model.on(MBrebg.S_GameStart, this.updateScore, this);
        EventManager.getInstance().addEventListener(cfg_event.CLOSE_CHARGE, this.updateScore, this);
        // this._brebg_model.on(MBrebg.S_JETTON_BROADCAST, this.onJettonBroadcast, this);

        this._brebg_model.run();
    }


    removeModelEventListener() {
        this._brebg_model.off(MBrebg.S_SCENE_START, this.onGameSceneStart, this); // 开始场景
        this._brebg_model.off(MBrebg.S_SCENE_END, this.onGameSceneEnd, this);    // 结束场景
        this._brebg_model.off(MBrebg.S_SCENE_Jetton, this.onGameSceneJetton, this);  // 下注场景
        this._brebg_model.off(MBrebg.S_GameEnd, this.onGameEnd, this);       // 停止下注
        this._brebg_model.off(MBrebg.S_GameStart, this.onGameStart, this);     // 开始游戏  
        this._brebg_model.off(MBrebg.S_GameJetton, this.onGameJetton, this);  // 开始下注
        this._brebg_model.off(MBrebg.S_Jetton_Success, this.onJettonSuccess, this);  //下注成功 推送
        this._brebg_model.off(MBrebg.S_Jetton_Fail, this.onJettonFail, this);  //下注失败
        this._brebg_model.off(MBrebg.S_GameRecord, this.onGameRecord, this);
        this._brebg_model.off(MBrebg.S_GameStart, this.updateScore, this);
        EventManager.getInstance().removeEventListener(cfg_event.CLOSE_CHARGE, this.updateScore, this);

        this._brebg_model.exit();
    }

    // 续压
    onContinue() {
        this.continueBtn.interactable = false
        for (var k = 0; k < this._rectsPlaceOld.length; k++) {
            var total: number = this._rectsPlaceOld[k]
            if (this._room_info.jettons.length > 0) {
                for (let index = this._room_info.jettons.length - 1; index >= 0; index--) {
                    const element = this._room_info.jettons[index];
                    var chipCount = parseInt((total / (element / 100)).toString())
                    for (var j = 0; j < chipCount; j++) {
                        AppGame.ins.brebgModel.sendJetton(k + 1, element);
                    }
                    total = total % (element / 100)
                }
            }
        }
    }


    //点击复制牌局信息
    private oncopy(): void {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this._lab_pjbh.string).substr(5, 30));
    }


    update(dt: number) {

        if (this._leave_time > 0) {
            let tmp_leave_time = Math.ceil(this._leave_time);
            this._leave_time -= dt;
            if (this._leave_time < 0) {
                this._leave_time = 0;
            }
            let leave_time = Math.ceil(this._leave_time);

            let str_time = leave_time.toString();
            // if (leave_time < 10) {
            //     str_time = '0' + leave_time;
            // }
            this.lab_leavetime.string = str_time;

            if (leave_time == COUNT_DOWN && this._game_status == GAME_STATUS.EBG_GAME_BET) {
                this.onStartTips(leave_time);
            }

            if (leave_time <= COUNT_DOWN && tmp_leave_time > leave_time && (this._game_status == GAME_STATUS.EBG_GAME_BET_TIP)) {
                this._music_mgr.playCountDown();
            }
            // if (this._leave_time == 0 && this._game_status == GAME_STATUS.LH_GAME_FREE) {
            //     // this.onGameFree({ sss: 111 });
            //     this._leave_time = BET_TIME;
            //     this.onStartBet();
            // }
        }

        this._leave_bet_sound -= dt;
        if (this._leave_bet_sound < 0) this._leave_bet_sound = 0;
    }

    // gamecloseUI() {
    //     super.gamecloseUI();
    // }

    /**sq 修改 需要是否是断线重连进来的 data:ToBattle */
    openScene(data: any) {
        UDebug.Log(data);
        if (data)
            this._room_info = data.roomData;
        super.openScene(data);
        // AppGame.ins.checkEnterMinScore(AppGame.ins.roleModel.score);
    }

    /**
     * 初始化筹码信息
     */
    initChips() {

        let chip_container = UNodeHelper.find(this.node_bottom, 'toggle_container');
        this._chipgroup = new BrChipGroup(chip_container);
        this._chipgroup.chipValues = this._room_info.jettons;


        this._chips_pool = new cc.NodePool();

        let tmp_chip = UNodeHelper.find(this._ui_root, 'temp_chip');

        for (let i = 0; i < CHIP_COUNT; i++) {
            let chip_node = cc.instantiate(tmp_chip);
            this._chips_pool.put(chip_node);
        }

    }

    /**
     * 清理桌面
     */
    clearDesk() {
        // this._layer_chip.stopAllActions();

        // 清理下注

        this.node_wait_next.active = false;



        while (this._layer_chip.children.length > 0) {
            let node = this._layer_chip.children[0];

            this._chips_pool.put(node);   // 回收筹码到池
        }
        UDebug.Log("-------------------------清理桌面" + this._rectsPlaceOld)
        this._layer_chip.stopAllActions();

        this._layer_fly.removeAllChildren();

        this.node_effect.removeAllChildren();

        this.brebg_anima.clearAllAnima();
        this._rectsPlaceOld = [];
        for (let index = 0; index < 3; index++) {
            let node_jet_bg = this.node_my_jetton_bg[index];
            let lab_my_score = this.lab_my_score[index];
            let lab_total_score = this.lab_total_score[index];
            this._rectsPlaceOld.push(parseInt(lab_my_score.string))
            node_jet_bg.active = false;
            lab_my_score.node.active = false;
            lab_my_score.string = "0";
            lab_total_score.string = '0';
        }

        for (let index = 0; index < 3; index++) {
            const element = this.node_win_rect[index];
            element.stopAllActions();
            element.opacity = 0;
        }

        for (let i = 0; i < this._seats.length; i++) {
            if (this._seats[i])
                this._seats[i].clear();
        }
        for (let i = 1; i <= 3; i++) {
            this.node_luckys[i].active = false;
        }

        this.updateLuDan(this._record_data, false);

    }

    /**
     * 设置每个区域玩家下注的金币值 （顺 天 地）
     * @param jettons 
     */
    setMyJettonScore(jettons: any) {

        for (let index = 0; index < jettons.length; index++) {
            const element = jettons[index];

            var rect = element.jettonArea;
            var score = element.jettonScore;

            if (score > 0) {
                let node_jet_bg = this.node_my_jetton_bg[rect - 1];
                node_jet_bg.active = true;
                let lab_my_score = this.lab_my_score[rect - 1];
                lab_my_score.string = (score / GoldRate).toString();
                lab_my_score.node.active = true;
            }
        }
    }

    /**
     * 设置每个区域总的下注金币值 （顺 天 地）
     * @param jettons 
     */
    setTotalJettonScore(jettons: any) {

        for (let index = 0; index < jettons.length; index++) {
            const element = jettons[index];

            var rect = element.jettonArea;
            var score = element.jettonScore;

            let lab_total_score = this.lab_total_score[rect - 1];
            lab_total_score.string = (score / GoldRate).toString();
        }
    }

    /**
     * 设置自己的座位信息
     */
    setMyInfo() {

        let user = {
            userId: AppGame.ins.roleModel.useId,
            nickName: AppGame.ins.roleModel.nickName,
            score: AppGame.ins.roleModel.score,
            headerId: AppGame.ins.roleModel.headId,
            headboxId: AppGame.ins.roleModel.headboxId,
            vip: AppGame.ins.roleModel.vipLevel,
        }

        // let data = {
        //     nickName: AppGame.ins.roleModel.nickName,
        //     lUserScore: AppGame.ins.roleModel.score,
        //     headerID: AppGame.ins.roleModel.headId,
        //     dwUserID: AppGame.ins.roleModel.useId,
        // }

        this._seats[my_seat_id].show();
        let data = { user: user };
        this._seats[my_seat_id].setInfo(data);
        if (data.user.score < AppGame.ins.game_watch_limit_score) {
            this._node_rect_1.interactable = false;
            this._node_rect_2.interactable = false;
            this._node_rect_3.interactable = false;
        } else {
            this._node_rect_1.interactable = true;
            this._node_rect_2.interactable = true;
            this._node_rect_3.interactable = true;
        }

    }

    setMyScore(score: number) {
        this._seats[my_seat_id].setGold(score);
        this._gold = score;
    }

    getMyGold(): number {
        return this._gold;
    }

    setSeatScore(userid: number, score: number) {

        for (let index = 0; index < 8; index++) {

            if (this._seats[index] && this._seats[index].userid == userid) {
                this._seats[index].setGold(score);
            }
        }
    }

    /**
     * 设置庄家的信息
     */
    setBankerInfo(info: any) {

    }

    /**
     * 设置座面路单
     * @param winTag 
     * @param isblink 最新的一个是否闪烁
     */
    setLuDan(winTag: any, isblink: boolean = false) {

        // setLuDan(shun: Array<number>, tian: Array<number>, di: Array<number>, isblink: boolean = false) {

        // this._record_data = winTag;


        if (isblink) {
            this.node_ludan.runAction(cc.sequence(cc.delayTime(DELT_LUDAN_UPDATE), cc.callFunc(() => {
                this.updateLuDan(winTag, true);
            }, this)))

        } else {
            this.updateLuDan(winTag, isblink);
        }
    }

    /**
     * 设置座面路单
     * @param winTag 
     * @param isblink 最新的一个是否闪烁
     */
    updateLuDan(winTag: any, isblink: boolean = false) {
        if (!winTag) { return; }
        let max_count = 9;  // 最多显示个数
        let temp_data = JSON.parse(JSON.stringify(winTag));

        while (temp_data.length > max_count) {
            temp_data.shift();
        }

        for (let i = 1; i <= 9; i++) {
            let node = UNodeHelper.find(this.node_ludan, 'node_' + i);
            node.active = false;
            let node_new = UNodeHelper.find(node, 'sp_new');
            node_new.stopAllActions();
            node_new.opacity = 0;
            node_new.active = true;
        }

        let last_node = null;
        for (let index = 0; index < temp_data.length; index++) {
            const element = temp_data[index];
            let node = UNodeHelper.find(this.node_ludan, 'node_' + (index + 1).toString());
            node.active = true;
            for (let i = 1; i <= 3; i++) {
                let sp_flag = UNodeHelper.getComponent(node, 'sp_' + i, cc.Sprite);
                if (element[i - 1]) {
                    sp_flag.spriteFrame = this._spframe.getFrames('brebg_data_win');
                } else {
                    sp_flag.spriteFrame = this._spframe.getFrames('brebg_data_lose');
                }
            }
            last_node = node;
        }

        if (last_node) {
            let node_new = UNodeHelper.find(last_node, 'sp_new');
            node_new.stopAllActions();
            if (isblink) {
                node_new.opacity = 0;
                node_new.runAction(cc.repeat(cc.sequence(cc.fadeTo(0.2, 100), cc.fadeTo(0.2, 255)), 5))
            } else {
                node_new.opacity = 255;
            }
        }
    }




    /**
     * 设置座位玩家的信息
     * @param players 
     */
    setSeatInfo(players: Ebg.IPlayerListItem[]) {
        UDebug.Log('aaa');

        this._players = players;

        for (let index = 0; index < 6; index++) {
            if (players[index]) {

                // let data = {
                //     nickName: players[index].nickName,
                //     lUserScore: players[index].lUserScore,
                //     headerID: players[index].headerID,
                //     dwUserID: players[index].dwUserID,
                // }

                this._seats[index].setInfo(players[index]);
                this._seats[index].show();
            }
            else {
                this._seats[index].hide();
            }
        }
    }


    /**
     * 新建一个筹码放入筹码池
     */
    putChipToPool() {
        let tmp_chip = UNodeHelper.find(this._ui_root, 'temp_chip');
        this._chips_pool.put(cc.instantiate(tmp_chip));
    }

    /**
     * 从桌面筹码回收一个筹码放入筹码池
     */
    recoverChipToPool(): boolean {
        if (this._layer_chip.children.length > 0) {
            this._layer_chip.children[0].active = false;
            this._chips_pool.put(this._layer_chip.children[0]);
            return true;
        }

        return false;
    }

    /**
     * 从筹码池获取一个筹码 
     * @param chip_type 
     */
    getChipByPool(chip_type: number) {
        if (this._chips_pool.size() <= 0) {     // 筹码池不够
            if (this.recoverChipToPool() == false) {
                this.putChipToPool();
            }
        }
        let chip_node = this._chips_pool.get();

        let chip_data = this._chipgroup.getLabBgValue(chip_type);

        let lab_chip = UNodeHelper.getComponent(chip_node, '', cc.Label);
        lab_chip.string = chip_data.bg;
        let lab_num = UNodeHelper.getComponent(chip_node, 'lab_num', cc.Label);
        lab_num.string = chip_data.value.toString();
        chip_node.active = true;
        return chip_node;
    }


    /**
     * 根据筹码值查找筹码所在位置
     * @param value 
     */
    findChipIndex(value: number) {

        if (this._room_info && this._room_info.jettons) {
            for (let index = 0; index < this._room_info.jettons.length; index++) {
                const element = this._room_info.jettons[index];
                if (value == element) {
                    return index;
                }
            }
        }
        return -1;
    }



    /**
     * 查找座位id
     * @param userid 
     */
    findSeatIdByUserId(userid: number): number {

        for (let index = 0; index < this._players.length; index++) {
            const element = this._players[index];
            if (element.user.userId == userid) {
                return index;
            }
        }
        return -1;
    }


    getBetJettonPos(bet_rect: number): cc.Vec2 {
        var dest_pos = new cc.Vec2(0, 0);
        // UDebug.Log(bet_rect);

        if (bet_rect < 1 || bet_rect > 3 || !bet_rect) {
            UDebug.Log('bet_rect = ' + bet_rect);
            throw new Error('bet_rect = ' + bet_rect);
        }

        var end_center_pos = this.node_win_rect[bet_rect - 1].getPosition();
        let offset = 100;

        dest_pos.x = end_center_pos.x + Math.random() * offset - offset / 2;
        dest_pos.y = end_center_pos.y + Math.random() * offset - offset / 2;

        return dest_pos;
    }


    moveChipToRect(node: cc.Node, rect: number) {
        var des_pos = this.getBetJettonPos(rect);
        var desc_scale = 0.3;
        var act_time = 0.5;
        node.opacity = 200;
        var dt_time = Math.random() * 0.2;
        var rote = Math.random() * 180;
        // var seq = cc.sequence(cc.delayTime(dt_time),
        var seq = cc.sequence(
            cc.spawn(cc.moveTo(act_time, des_pos).easing(cc.easeQuadraticActionOut()),
                cc.fadeIn(act_time / 1.5),
                cc.rotateBy(act_time, rote),
                cc.scaleTo(act_time, desc_scale * 1.05)),
            cc.scaleTo(0.2, desc_scale)
        );
        node.stopAllActions();
        node.runAction(seq);
    }

    moveChipToPos(node: cc.Node, pos: cc.Vec2) {
        var delt_time = 0.4;
        let del_time = Math.random() * 0.1;
        let stop_time = Math.random() * 0.2;
        let move_time = 0.5;  // 移动时间 

        var pos1 = pos;
        var pos2 = node.getPosition();
        var anit_x = (pos2.x - pos1.x) / 15;
        var anit_y = (pos2.y - pos1.y) / 15;


        node.runAction(cc.sequence(cc.delayTime(del_time), cc.moveBy(delt_time * 0.5, anit_x, anit_y), cc.moveTo(move_time, pos).easing(cc.easeQuadraticActionOut()),
            cc.delayTime(stop_time),
            cc.fadeOut(0.01)));
    }

    playBetSound() {
        if (this._leave_bet_sound == 0) {
            this._leave_bet_sound = BET_INTER;
            this._music_mgr.playbet();
        }
    }


    /**
     * 移动筹码到指定区域
     * @param userid   // 下注的用户id 
     * @param chip_value   // 下注的筹码值
     * @param rect  (1,2,3)  下注块 , 1: 顺门 2: 天门 3: 地门
     */
    // playerBet(chip_pos: cc.Vec2, chip_type: number, rect: number) {
    playerBet(userid: number, chip_index: number, rect: number, dlet_time?: number) {

        dlet_time = dlet_time || 0;

        this.playBetSound();

        let node_chip = this.getChipByPool(chip_index);

        node_chip.parent = this._layer_chip;
        //node_chip.scale = 0.3;
        node_chip.position = this._seats[no_seat_id].position;  // 无座位置

        node_chip['userid'] = userid;
        node_chip['chip_type'] = chip_index;
        node_chip['rect'] = rect;

        var seatid = this.findSeatIdByUserId(userid)

        if (userid == AppGame.ins.roleModel.useId) {
            node_chip.position = this._seats[my_seat_id].position;  // 自己的位置
            this._seats[my_seat_id].shake(1);
        } else if (seatid != -1 && seatid < 6) {

            this._seats[seatid].shake(1, true);
            node_chip.position = this._seats[seatid].position;
        } else {
            this._seats[no_seat_id].shake(3, false, 1.5);
        }

        if (seatid == 0) {
            this.playLuckyBet(rect, true);
        }


        node_chip['src_x'] = node_chip.x;
        node_chip['src_y'] = node_chip.y;
        var des_pos = this.getBetJettonPos(rect);
        BrebgAnimation.betMove(node_chip, des_pos, () => {

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
            let bolato = BrAnimation.createParabolaTo(destime, new_star.position, new cc.Vec2(this.node_luckys[rect].position.x, this.node_luckys[rect].position.y - 70), 60, 90);

            new_star.runAction(cc.sequence(cc.spawn(cc.scaleTo(destime, 1), bolato), cc.delayTime(0.2), cc.callFunc((node: any) => {
                this.node_luckys[node['rect']].active = true;
                node.destroy();
            }, this)));
        }
        else {
            this.node_luckys[rect].active = true;
        }
    }


    /**
     * 设置在线人数
     * @param num 在线人数
     */
    setOnlineNum(num: number) {

        var lab_num = UNodeHelper.getComponent(this.btn_online.node, 'lab_num', cc.Label);
        lab_num.string = num.toString();
    }



    /**
     * 根据筹码位子找对应的值
     * @param index 
     */
    chipIndexToValue(index: number): number {
        if (this._room_info && this._room_info.jettons[index]) {
            return this._room_info.jettons[index];
        }
        return 0;
    }

    /**
     * 根据筹码的值找对应位置
     * @param value 
     */
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
     * 闪烁赢了的区域
     * @param winindex 
     */
    blinkWinRect(winindex: any) {
        for (let index = 0; index < 3; index++) {
            const element = winindex[index];
            this.node_win_rect[index].stopAllActions();
            this.node_win_rect[index].opacity = 0;
            if (element == true) {
                this.node_win_rect[index].runAction(cc.sequence(cc.delayTime(3), cc.repeat(cc.sequence(cc.fadeTo(0.5, 100), cc.fadeTo(0.5, 255)), 16)));
            }
        }
    }


    /**
     * 拆分输赢结果
     * @param code 
     */
    getWinTag(code: number): any {
        let shun = (code & 1) != 0;
        let tian = (code & 2) != 0;
        let di = (code & 4) != 0;

        return { [0]: shun, [1]: tian, [2]: di };
    }

    /**
    * 设置游戏状态 
    * @param status 状态
    */
    setGameStatus(status: GAME_STATUS) {

        this._game_status = status;

        if (status == GAME_STATUS.EBG_GAME_START) {
            this.sp_status.spriteFrame = this.getSpriteFrame('ebg_text_zzfp');
        } else if (status == GAME_STATUS.EBG_GAME_BET) {
            this.sp_status.spriteFrame = this.getSpriteFrame('ebg_text_zzxz');
        } else if (status == GAME_STATUS.EBG_GAME_STOP) {
            this.sp_status.spriteFrame = this.getSpriteFrame('ebg_text_zzkp');
        } else if (status == GAME_STATUS.EBG_GAME_END) {
            this.sp_status.spriteFrame = this.getSpriteFrame('ebg_text_zzjs');
        }
    }


    /**
     * 结算时，筹码飞来飞去。。。
     * @param winindex 赢的区域 （数组）   -1 输   1 赢
     */
    flyChips(winindex: any) {
        let is_all_win = false;   // 庄家通赢
        let is_all_lose = false;   // 庄家通赔
        if (winindex[0] == false && winindex[1] == false && winindex[2] == false) is_all_win = true;
        if (winindex[0] == true && winindex[1] == true && winindex[2] == true) is_all_lose = true;

        this._layer_chip.stopAllActions();

        if (is_all_lose) {
            this._layer_chip.runAction(cc.sequence(cc.delayTime(5.5), cc.callFunc(() => {  // 庄家补齐区域金币
                this.brebg_anima.playAllLose();
                this._music_mgr.playAllPay();

                let length = this._layer_chip.children.length;

                for (let index = 0; index < length; index++) {
                    const element = this._layer_chip.children[index];
                    var new_chip = cc.instantiate(element);
                    new_chip['src_x'] = element['src_x'];
                    new_chip['src_y'] = element['src_y'];
                    new_chip.position = this.node_banker_head.position;
                    new_chip.parent = this._layer_fly;
                    // this.moveChipToRect(new_chip, element['rect']);
                    var desc_pos = this.getBetJettonPos(element['rect']);
                    BrebgAnimation.bankerChipMove(new_chip, desc_pos, null, 0.3);
                }

                if (length > 0) this._music_mgr.playflyCoin();

            }, this), cc.delayTime(1), cc.callFunc(() => {                                      // 区域的金币飞到玩家身上
                let length = this._layer_chip.children.length;
                for (let index = 0; index < length; index++) {
                    let chip = this._layer_chip.children[index];
                    // this.moveChipToPos(chip, cc.v2(chip['src_x'], chip['src_y']));
                    BrAnimation.moveChip(chip, cc.v2(chip['src_x'], chip['src_y']), (node: cc.Node) => {
                        node.opacity = 0;
                    });
                }
                for (let index = 0; index < length; index++) {
                    let chip = this._layer_fly.children[index];
                    // this.moveChipToPos(chip, cc.v2(chip['src_x'], chip['src_y']));
                    BrAnimation.moveChip(chip, cc.v2(chip['src_x'], chip['src_y']), (node: cc.Node) => {
                        node.opacity = 0;
                    });
                }
                if (length > 0) this._music_mgr.playflyCoin();
            }, this)));

        } else if (is_all_win) {

            this._layer_chip.runAction(cc.sequence(cc.delayTime(5.5), cc.callFunc(() => {  // 所有金币飞到庄家
                this.brebg_anima.playAllWin();
                this._music_mgr.playAllKill();
                let length = this._layer_chip.children.length;
                for (let index = 0; index < length; index++) {
                    var chip = this._layer_chip.children[index];
                    this.moveChipToPos(chip, this.node_banker_head.getPosition());
                }
                if (length > 0) this._music_mgr.playflyCoin();
            }, this)));

        } else {

            this._layer_chip.runAction(cc.sequence(cc.delayTime(5.5), cc.callFunc(() => {  // 庄家先把输的区域的筹码移走
                let length = this._layer_chip.children.length;
                let is_play = false;
                for (let index = 0; index < length; index++) {
                    var chip = this._layer_chip.children[index];

                    if (winindex[chip['rect'] - 1] == false) {
                        this.moveChipToPos(chip, this.node_banker_head.getPosition());
                        is_play = true;
                    }
                }
                if (is_play) this._music_mgr.playflyCoin();
            }, this),

                cc.delayTime(1),

                cc.callFunc(() => {
                    let length = this._layer_chip.children.length;
                    let is_play = false;
                    for (let index = 0; index < length; index++) {          // 在补齐赢的区域的筹码
                        const element = this._layer_chip.children[index];

                        if (winindex[element['rect'] - 1] == true) {
                            var new_chip = cc.instantiate(element);
                            new_chip['src_x'] = element['src_x'];
                            new_chip['src_y'] = element['src_y'];
                            new_chip['rect'] = element['rect'];
                            new_chip.position = this.node_banker_head.position;
                            new_chip.parent = this._layer_fly;
                            this.moveChipToRect(new_chip, element['rect']);
                            is_play = true;
                        }
                    }
                    if (is_play) this._music_mgr.playflyCoin();
                }, this),
                cc.delayTime(1),
                cc.callFunc(() => {
                    let length = this._layer_chip.children.length;
                    for (let index = 0; index < length; index++) {   //在把筹码分发给玩家
                        var chip = this._layer_chip.children[index];
                        if (winindex[chip['rect'] - 1] == true) {
                            this.moveChipToPos(chip, cc.v2(chip['src_x'], chip['src_y']));
                        }
                    }
                    for (let index = 0; index < this._layer_fly.children.length; index++) {   //在把筹码分发给玩家
                        var chip = this._layer_fly.children[index];
                        if (winindex[chip['rect'] - 1] == true) {
                            this.moveChipToPos(chip, cc.v2(chip['src_x'], chip['src_y']));
                        }
                    }
                    if (length > 0) this._music_mgr.playflyCoin();
                }, this)));
        }

    }


    playUserEndScore(data: any, current: Ebg.ICurrentBankerInfo = null) {
        if (current != null) {
            if (current.banker.userId == AppGame.ins.roleModel.useId) {
                this._seats[my_seat_id].playWinOrLoseScore(current.bankerWinScore, DELT_END_SCORE, false, 2, 1.5);
            }
        }

        for (let index = 0; index < data.length; index++) {
            const element = data[index];

            if (element.userId == AppGame.ins.roleModel.useId) {
                this._seats[my_seat_id].playWinOrLoseScore(element.returnScore, DELT_END_SCORE, false, 2, 1.5);
            }

            let have_seat = false;

            for (let i = 0; i < 6; i++) {

                if (this._seats[i].userid == element.userId) {
                    this._seats[i].playWinOrLoseScore(element.returnScore, DELT_END_SCORE, false, 2, 1.5);
                    have_seat = true;
                }
            }

            if (!have_seat) {
                // this._seats[no_seat_id].playWinOrLoseScore(element.returnScore, del_time);
            }
        }

    }



    /**
     * 点击菜单按钮
     * @param toggle 菜单按钮
     */
    onClickMenu(toggle: cc.Toggle) {

        var node = toggle.node;
        let is_check = toggle.isChecked;

        var v_menu = this.node_menu.getComponent(VBrebgMenu);
        var sp_bg = node.getChildByName('sp_bk');

        if (is_check) {
            sp_bg.active = false;
            v_menu.show(this._room_info);
            toggle.interactable = false;
            // toggle.enabled = false;
        }
        else {

            sp_bg.active = true;
        }
    }

    onClickLudan(node: cc.Button) {
        AppGame.ins.showBundleUI(ECommonUI.EBG_Ludan, this._room_info.gameId, this._record_data)

    }


    /**
     * 点击在线人数按钮
     */
    onClickOnline() {
        UDebug.Log('onClickOnline');

        // this.flyChips([1, -1, 1]);
        // this.flyChips([-1, -1, -1]);
    }


    /**
     * 点击下注区域
     * @param btn 
     */
    onClickRect(btn: cc.Button) {

        if (MRole.bankerBool) {
            AppGame.ins.showTips({ data: "自己是庄家时,不能下注!", type: ETipType.onlyone });
            return;
        }


        if (this._game_status != GAME_STATUS.EBG_GAME_BET && this._game_status != GAME_STATUS.EBG_GAME_BET_TIP) {
            // UD
            this.showTips('当前时间不能下注！');
            return;
        }


        // var cur_chip_sel = -1;
        // for (let index = 0; index < this.toggle_ct_chip.toggleItems.length; index++) {
        //     const element = this.toggle_ct_chip.toggleItems[index];
        //     if (element.isChecked) {
        //         cur_chip_sel = index;
        //     }
        // }

        let cur_chip_sel = this._chipgroup.curSel;

        if (cur_chip_sel == -1) {
            this.showTips('金币不足！');
            return;
        }


        var chipvalue = this.chipIndexToValue(cur_chip_sel);

        switch (btn.target.name) {

            case 'node_rect_1':
                {
                    this._brebg_model.sendJetton(1, chipvalue);
                    // this.playerBet(0, 10, 1);
                    break;
                }
            case 'node_rect_2':
                {
                    this._brebg_model.sendJetton(2, chipvalue);
                    // this.playerBet(0, 10, 2);
                    break;
                }
            case 'node_rect_3':
                {
                    this._brebg_model.sendJetton(3, chipvalue);
                    // this.playerBet(0, 10, 3);
                    break;
                }
        }
    }


    onStartTips(leave_time: number) {
        this.setGameStatus(GAME_STATUS.EBG_GAME_BET_TIP);
        this._leave_time = leave_time;
        this._music_mgr.playChipTips();
    }


    // 开始下注
    onStartBet(show_effact: boolean = true) {

        var totalOld = 0
        // cc.warn("placeOld = " + JSON.stringify(this._rectsPlaceOld));
        for (var k = 0; k < this._rectsPlaceOld.length; k++) {
            totalOld += this._rectsPlaceOld[k]
        }
        UDebug.log("----totalOld=" + totalOld);
        UDebug.log("---parseInt(this._seats[my_seat_id]._lab_gold.string=" + parseInt(this._seats[my_seat_id]._lab_gold.string));
        if (totalOld != 0 && totalOld < (this._gold / 100) - 30) {
            this.continueBtn.interactable = true
        }
        else {
            this.continueBtn.interactable = false
        }

    }

    /**************************************************************************
     * event 
     ****************************************************************************/
    /**
    onGameSceneStart(data: Ebg.CMD_S_Scene_GameStart) {
     * 游戏开始场景消息 弃用
     * @param data 
     */
    onGameSceneStart(data: any) {
        // onGameSceneStart(data: Ebg.CMD_S_Scene_GameStart) {
        // this._leave_time = data.cbPlaceTime - data.cbTimeLeave;
        // this.setGameStatus(GAME_STATUS.EBG_GAME_START);
        // this._layer_wait_login.active = false;
        // this._lab_pjbh.string = '牌局编号:' + data.roundId;

        // this.setTotalJettonScore([data.aeraInfo[0].lAllJettonScore, data.aeraInfo[1].lAllJettonScore, data.aeraInfo[2].lAllJettonScore]);
        // this.setMyJettonScore([data.aeraInfo[0].SelfJettonScore, data.aeraInfo[1].SelfJettonScore, data.aeraInfo[2].SelfJettonScore]);

        // this.setLuDan(data.shunplace, data.tianplace, data.diplace);

        // this._chipgroup.unAllChips();

        // this.setOnlineNum(data.OnlineNum);
        // this.setSeatInfo(data.players);
        // this.brebg_anima.setCardValue(data.cardgroup);
        // this.brebg_anima.showWall();
        // this.brebg_anima.openCard(false);
    }


    /**
     * 游戏结算场景消息  弃用
     * @param data 
     */
    onGameSceneEnd(data: any) {
        // onGameSceneEnd(data: Ebg.CMD_S_Scene_GameEnd) {
        // this.setLuDan(data.shunplace, data.tianplace, data.diplace);
        // this._chipgroup.unAllChips();
        // this._layer_wait_login.active = false;
        // this._leave_time = data.cbPlaceTime - data.cbTimeLeave;
        // this._lab_pjbh.string = '牌局编号:' + data.roundId;
        // this.setGameStatus(GAME_STATUS.EBG_GAME_END);
        // this.setOnlineNum(data.OnlineNum);
        // this.setSeatInfo(data.players);
        // this.setTotalJettonScore([data.aeraInfo[0].lAllJettonScore, data.aeraInfo[1].lAllJettonScore, data.aeraInfo[2].lAllJettonScore]);
        // this.setMyJettonScore([data.aeraInfo[0].SelfJettonScore, data.aeraInfo[1].SelfJettonScore, data.aeraInfo[2].SelfJettonScore]);
        // this.node_wait_next.active = true;
        // this.brebg_anima.setCardValue(data.cardgroup);
        // this.brebg_anima.openCard(false);
    }


    /**
     * 下注场景消息 弃用
     * @param data 
     */
    onGameSceneJetton(data: any) {
        // onGameSceneJetton(data: Ebg.CMD_S_Scene_GameJetton) {
        // this._layer_wait_login.active = false;
        // this._leave_time = data.cbPlaceTime - data.cbTimeLeave;
        // this.setGameStatus(GAME_STATUS.EBG_GAME_BET);
        // this.setLuDan(data.shunplace, data.tianplace, data.diplace);

        // for (let i = 0; i < data.aeraInfo.length; i++) {
        //     let chips = this._chipgroup.chipSplik2(data.aeraInfo[i].lAllJettonScore);
        //     UDebug.Log(chips);
        //     let max_count = chips.length;
        //     for (let j = 0; j < max_count; j++) {
        //         // let del_time = (j / max_count) * 0.9;
        //         for (let k = 0; k < chips[j]; k++) {
        //             this.playerBet(0, j, i+1);
        //         }
        //     }
        // }

        // this._chipgroup.avAllChips();
        // this._chipgroup.check(data.self.lUserScore);

        // this._lab_pjbh.string = '牌局编号:' + data.roundId;
        // this.setTotalJettonScore([data.aeraInfo[0].lAllJettonScore, data.aeraInfo[1].lAllJettonScore, data.aeraInfo[2].lAllJettonScore]);
        // this.setMyJettonScore([data.aeraInfo[0].SelfJettonScore, data.aeraInfo[1].SelfJettonScore, data.aeraInfo[2].SelfJettonScore]);
        // this.setOnlineNum(data.OnlineNum);
        // this.setSeatInfo(data.players);
        // this.brebg_anima.setCardValue(data.cardgroup);
        // this.brebg_anima.showWall();
        // this.brebg_anima.openCard(false);

        // for (let index = 0; index < data.shensuanziJettonFlag.length; index++) {

        //     if (data.shensuanziJettonFlag[index] > 0) {
        //         this.playLuckyBet(index + 1);
        //     }
        // }
    }


    /**
     * 游戏开始
     * @param data 
     */
    onGameStart(data: Ebg.CMD_S_GameStart) {

        this.clearDesk();
        // this._chipgroup.unAllChips();
        this._leave_time = data.timeLeave;
        this.setGameStatus(GAME_STATUS.EBG_GAME_START);
        this._lab_pjbh.string = '牌局编号:' + data.roundId;
        this.setOnlineNum(data.deskData.onlinePlayCount);
        this.brebg_anima.setCardGroup(data.deskData.cards);
        this.setSeatInfo(data.deskData.players);
        if (this._is_first_in) {
            this.brebg_anima.showWall();
            this.brebg_anima.openCard(false);
        } else {
            this.brebg_anima.setDiceValue(data.deskData.shaiZi[0], data.deskData.shaiZi[1]);
            // this.brebg_anima.setDiceValue(1, 4);
            this.brebg_anima.playWall();
        }



        // this.brebg_anima.setCardValue(data.deskData.cards);
        this._is_first_in = false;
    }


    /**
     * 游戏结算
     * @param data 
     */
    onGameEnd(data: Ebg.CMD_S_GameEnd) {
        this.continueBtn.interactable = false;
        // this._music_mgr.stopAll();

        // this._leave_time = data.cbPlaceTime - data.cbTimeLeave;
        this._leave_time = data.timeLeave;

        this.setGameStatus(GAME_STATUS.EBG_GAME_END);
        this._chipgroup.unAllChips();
        this._lab_pjbh.string = '牌局编号:' + data.roundId;


        this.setOnlineNum(data.deskData.onlinePlayCount);
        let win_tag = this.getWinTag(data.deskData.winTag)  // 获取赢的区域 顺天地
        this.brebg_anima.setCardGroup(data.deskData.cards);
        this.brebg_anima.setWinTag(win_tag);
        this.scheduleOnce(function () {
            this.blinkWinRect(win_tag);
        }, 1.5);


        // this.setLuDan(data.shunplace, data.tianplace, data.diplace, true);


        if (this._is_first_in) {
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

            this.setTotalJettonScore(data.deskData.allJettonScore);
            this.setMyJettonScore(data.deskData.selfJettonScore);
            this.node_wait_next.active = true;
            this.setSeatInfo(data.deskData.players);
            this.setMyScore(data.userScore);
            this.brebg_anima.openCard(true);
            this.setLuDan(this._record_data, true);

        }
        else {
            this._music_mgr.playStopBet();
            this._record_data.push(win_tag);  // 加一条输赢记录
            this.brebg_anima.playStopJetton();
            this._ui_root.runAction(cc.sequence(cc.delayTime(DELT_END_UPDATE), cc.callFunc(() => {
                this.setSeatInfo(data.deskData.players);
                this.setMyScore(data.userScore);
                this.setLuDan(this._record_data, true);
            })));
            // this.flyChips(data.deskData.winTag);
            this.flyChips(win_tag);
        }

        if (data.deskData.bankerInfo.currentBankerInfo != null) {
            this.playUserEndScore(data.gameEndScore, data.deskData.bankerInfo.currentBankerInfo);
        }
        else {
            this.playUserEndScore(data.gameEndScore);
        }
        this._is_first_in = false;
        // this._seats[my_seat_id].playWinOrLoseScore(data.self.lAllWinScore, DELT_END_SCORE);
    }

    /**
     * 开始下注
     * @param data 
     */
    onGameJetton(data: Ebg.CMD_S_StartPlaceJetton) {

        // this._music_mgr.playGamebg();

        // this._leave_time = data.cbPlaceTime - data.cbTimeLeave;
        this._leave_time = data.timeLeave;
        this.setGameStatus(GAME_STATUS.EBG_GAME_BET);
        this.setSeatInfo(data.deskData.players);
        this._lab_pjbh.string = '牌局编号:' + data.roundId;

        this._chipgroup.avAllChips();
        this._chipgroup.check(data.userScore);
        this.brebg_anima.setCardGroup(data.deskData.cards);

        this.onStartBet(!this._is_first_in);

        this.setTotalJettonScore(data.deskData.allJettonScore);
        this.setMyJettonScore(data.deskData.selfJettonScore);
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


        if (this._is_first_in) {
            this.brebg_anima.showWall();
            this.brebg_anima.openCard(false);
        } else {
            this._music_mgr.playStartBet();
            this.brebg_anima.playStartJetton();
        }

        this._is_first_in = false;

    }

    /**
     * 下注成功 （自己或者座位玩家下注）
     * @param data 
     */
    onJettonSuccess(data: Ebg.CMD_S_PlaceJetSuccess) {

        var chip_index = this.findChipIndex(data.jettonScore)

        if (chip_index == -1) {
            this.showTips('没找到值为' + data.jettonScore / 100 + '的筹码');
            return;
        }

        this.playerBet(data.userId, chip_index, data.jettonArea);
        this.setTotalJettonScore(data.allJettonScore);
        this.setMyJettonScore(data.selfJettonScore);

        if (data.userId == AppGame.ins.roleModel.useId) {
            this.continueBtn.interactable = false;
            this.setMyScore(data.userScore);
            this._chipgroup.check(data.userScore);
        }

        this.setSeatScore(data.userId, data.userScore);
    }

    showTips(str: string) {

        AppGame.ins.showTips({ data: str, type: ETipType.onlyone });
    }

    onJettonFail(data: Ebg.CMD_S_PlaceJettonFail) {

        this.showTips(data.errMsg);
    }

    onGameRecord(data: any) {
        this._layer_wait_login.active = false;

        for (let i = 0; i < data.record.length; i++) {
            let data_item = this.getWinTag(data.record[i]);
            this._record_data.push(data_item);
        }

        this.setLuDan(this._record_data);
    }


    /**
     * 筹码广播 （服务器收集之后，广播给客户端各个区域总数）
     * @param data 
     */
    onJettonBroadcast(data: any) {
        // onJettonBroadcast(data: Ebg.CMD_S_Jetton_Broadcast) {
        // for (let i = 0; i < data.tmpJettonScore.length; i++) {
        //     let chips = this._chipgroup.chipSplik(data.tmpJettonScore[i]);
        //     UDebug.Log(chips);
        //     for (let j = 0; j < chips.length; j++) {
        //         for (let k = 0; k < chips[j]; k++) {
        //             this.playerBet(0, j, i + 1);
        //         }
        //     }
        // }

        for (let i = 0; i < data.tmpJettonScore.length; i++) {
            let chips = this._chipgroup.chipSplik(data.tmpJettonScore[i]);
            UDebug.Log(chips);
            let max_count = chips.length;
            for (let j = 0; j < max_count; j++) {
                let del_time = (j / max_count) * 0.9;
                this.playerBet(0, chips[j], i + 1, del_time);
            }
        }

        this.setTotalJettonScore(data.AllJettonScore);

    }



}
