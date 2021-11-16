import { ECommonUI, ETipType } from "../../common/base/UAllenum";
import { Bcbm, Game } from "../../common/cmd/proto";
import UDebug from "../../common/utility/UDebug";
import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "../../public/base/AppGame";
import UGame from "../../public/base/UGame";
import { RoomInfo } from "../../public/hall/URoomClass";
import { GAME_STATUS } from "./cfg_bcbm";
import MBcbm from "./model/MBcbm";
import VBcbmAnimaMgr from "./view/VBcbmAnimaMgr";
import BcbmRect from "./BcbmRect";
import BrlhSeat from "../common/BrlhSeat";
import UAudioManager from "../../common/base/UAudioManager";
import UEventHandler from "../../common/utility/UEventHandler";
import BcbmAnimation from "./BcbmAnimation";
import BcbmUIManager from "./BcbmUIManager";
import cfg_event from "../../config/cfg_event";
import { EventManager } from "../../common/utility/EventManager";
import ULanHelper from "../../common/utility/ULanHelper";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import UBcbmMusic from "./UBcbmMusic";
import MRole from "../../public/hall/lobby/MRole";
import BrChipNewGroup from "../common/BrChipNewGroup";

/**
 *  BENZ_AREA           = 0;    //奔驰
    BMW_AREA            = 1;    //宝马
    AUDI_AREA           = 2;    //奥迪
    JAGUAR_AREA         = 3;    //捷豹

    PORSCHE_AREA        = 4;    //保时捷
    MASERATI_AREA       = 5;    //玛莎拉蒂
    LAMBORGHINI_AREA    = 6;    //兰博基尼
    FERRARI_AREA        = 7;    //法拉利

    MAX_AREA            = 8;
 */
const { ccclass, property } = cc._decorator;
const CHIP_COUNT = 70;  // 每个区域筹码池个数
const FREE_TIME = 1.3;  // 自定义空闲时间
var BET_TIME = 0;
const my_seat_id = 6;   // 玩家自己的座位
const no_seat_id = 7;  // 无座
const MAX_TIME_END = 7;
const DELT_LUDAN = 2.0
const DELT_PIAO = 15.5;
const DELT_FLY = 0.5;
const COUNT_DOWN = 5;
export const ZJH_SCALE = 0.01;


@ccclass
export default class VbcbmScene extends UGame {
    @property(VBcbmAnimaMgr)
    vbcbm_animamgr: VBcbmAnimaMgr = null;
    @property(cc.Node)
    node_desk: cc.Node = null;
    @property(cc.Node)
    node_bottom: cc.Node = null;
    @property({ type: cc.Label, tooltip: "在线人数" })
    lab_online_count: cc.Label = null;
    @property(cc.Label) // 牌局编号
    lab_pjbh: cc.Label = null;
    @property({ type: [cc.Node], tooltip: "幸运星星" })
    node_luckys: cc.Node[] = [];
    @property({ type: cc.Node, tooltip: "特效层" })
    node_effect: cc.Node = null;
    @property({ type: cc.Sprite, tooltip: "游戏状态" })
    sp_status: cc.Sprite = null;
    @property(cc.Label)
    lb_leavetime: cc.Label = null;
    @property([cc.SpriteFrame])
    spf_status: cc.SpriteFrame[] = [];
    @property([cc.SpriteFrame])
    @property([cc.SpriteFrame])
    carLogoSpriteframes: cc.SpriteFrame[] = []; //游戏记录车标
    @property(cc.Node)
    historyNode: cc.Node = null;
    @property(cc.Node)
    spNewTip: cc.Node = null;
    @property(cc.Node)
    pathNode: cc.Node = null;
    @property(cc.Node)
    carNode: cc.Node = null;
    @property(cc.Node)
    bcbm_carlogo_light: cc.Node = null;
    @property(cc.Node)
    node_car_icon: cc.Node = null;
    @property(cc.Node)
    startAni: cc.Node = null;
    @property(cc.Node)
    lighter: cc.Node = null;

    // 游戏model
    _bcbm_model: MBcbm = null;
    _node_root: cc.Node = null;
    _node_wait_next: cc.Node = null;
    _node_wait_login: cc.Node = null;
    _layer_chip: cc.Node = null;
    _layer_fly: cc.Node = null;
    _self_id = 1000;  //自己的userID
    _leave_time = 0;   // 状态倒计时
    _game_status = GAME_STATUS.BCBM_GAME_START;
    _leave_bet_sound = 0;
    _room_info: RoomInfo = new RoomInfo();
    _gold = 0;
    _music_mgr: UBcbmMusic = null;
    _chipgroup: BrChipNewGroup = null;
    _rects: BcbmRect[] = [];
    public _seats: { [key: number]: BrlhSeat } = {};
    _chips_pool: cc.NodePool[] = [];
    _fly_pool: cc.NodePool = null;
    _resize_fun: Function;
    _is_first_in: boolean = true; // 刚刚进入游戏
    _betAreaPos = [];
    _node_ui_manager: cc.Node;
    _node_continue: cc.Node = null;
    _rectsPlaceOld: number[] = [];
    _resultNum: number = 8;//开奖个数
    _seatNum: number = 6; //座位数
    _showRecordNum = 7; //游戏记录个数
    _winTag: number = 0; //当前开奖区域
    private _charge_btn: cc.Node;
    private _sys_news: Array<string>;
    private _emergency_announcement: Array<string>;
    private _checkNode: cc.Node;
    old_leave_time: number = 0;
    _score: number = 0;
    isFrontAndBackSwitch: boolean = false;
    allJettonScore: any = null;
    toBack = false;

    protected onEnable() {
        super.onEnable();
    }

    protected onDisable() {
        super.onDisable();
    }

    onDestroy() {
        if (this._resize_fun)
            cc.game.off('resize', this._resize_fun);
        this.removeModelEventListener();
        this._bcbm_model.resetData();
        this._is_first_in = true;
        UAudioManager.ins.stopAll();
    }

    protected init() {
        this._sys_news = [];
        this._node_root = UNodeHelper.find(this.node, 'uiroot');
        this._layer_chip = UNodeHelper.find(this._node_root, 'layer_chips');
        this._layer_fly = UNodeHelper.find(this._node_root, 'layer_fly');
        this._node_wait_next = UNodeHelper.find(this._node_root, 'node_wait_next');
        this._node_wait_login = UNodeHelper.find(this._node_root, 'node_wait_login');
        this._node_wait_login.active = true;
        this._node_ui_manager = UNodeHelper.find(this._node_root, 'node_ui');
        this._charge_btn = UNodeHelper.find(this.node, "uiroot/node_desk/sp_seat_6/charge_btn");
        this._checkNode = UNodeHelper.find(this.node, "uiroot/checknode");
        UEventHandler.addClick(this._charge_btn, this.node, "VbcbmScene", "intoCharge")
        UEventHandler.addClick(this.lab_pjbh.node.parent, this.node, "VbcbmScene", "oncopy");

        this._node_continue = UNodeHelper.find(this.node_bottom, "btn_xutou");
        UEventHandler.addClick(this._node_continue, this.node, "VbcbmScene", "onContinue");
        this._node_continue.active = true;
        this._node_continue.getComponent(cc.Button).interactable = false;
        // 初始化筹码池子
        for (let index = 0; index < this._resultNum; index++) {
            this._chips_pool[index] = new cc.NodePool();
        }
        this._fly_pool = new cc.NodePool();

        this._bcbm_model = AppGame.ins.bcbmModel;
        this._self_id = AppGame.ins.roleModel.useId;
        this._music_mgr = new UBcbmMusic();

        //初始化筹码
        let chip_container = UNodeHelper.find(this.node_bottom, 'toggle_container');
        this._chipgroup = new BrChipNewGroup(chip_container);
        this._chipgroup.chipValues = this._room_info.jettons;
        //初始化座位
        for (let i = 1; i <= this._seatNum; i++) {
            let seat_node = UNodeHelper.find(this.node_desk, 'sp_seat_' + i);
            let lb_name = UNodeHelper.getComponent(this.node_desk, 'lb_name_' + i, cc.Label);
            let lb_gold = UNodeHelper.getComponent(this.node_desk, 'lb_gold_' + i, cc.Label);
            let lb_vip = UNodeHelper.getComponent(this.node_desk, 'lb_vip_' + i, cc.Label);
            let seat = new BrlhSeat(seat_node, lb_name, lb_gold, lb_vip);
            this._seats[i] = seat;
        }

        //初始化下注区域
        for (let i = 0; i < this._resultNum; i++) {
            let rect_node = UNodeHelper.find(this.node_desk, 'sp_rect_' + i);
            let lb_total = UNodeHelper.getComponent(this.node_desk, 'lb_total_jetton_' + i, cc.Label);
            let lb_self = UNodeHelper.getComponent(this.node_desk, 'lb_self_jetton_' + i, cc.Label);
            let rect = new BcbmRect(rect_node, lb_total, lb_self);
            this._rects[i] = rect;
        }

        //无座座位
        let lab_name = UNodeHelper.getComponent(this.node_desk, 'lb_name_7', cc.Label);
        let lab_gold = UNodeHelper.getComponent(this.node_desk, 'lb_gold_7', cc.Label);
        let lab_vip = UNodeHelper.getComponent(this.node_desk, 'lb_vip_7', cc.Label);
        let playerBtn = UNodeHelper.find(this.node_bottom, 'node_players/btn_players')
        UEventHandler.addClick(playerBtn, this.node, "VbcbmScene", "onopenPlayers");

        //设置其他玩家信息
        this.setSeatInfo(this._bcbm_model._desk_info.players);
        this.setMyInfo();
        //更新桌面信息
        this.updateDeskInfo(this._bcbm_model._desk_info);
        this._leave_time = this._bcbm_model._leave_time;
        this.setGameStatus(this._bcbm_model._game_status);
        let tmp_chip = UNodeHelper.find(this._node_root, 'tmp_chip');
        for (let i = 0; i < CHIP_COUNT; i++) {
            for (let index = 0; index < this._resultNum; index++) {
                let chip_node = cc.instantiate(tmp_chip);
                chip_node.active = true;
                this._chips_pool[index].put(chip_node);
            }
        }

        for (let i = 0; i < CHIP_COUNT * this._resultNum; i++) {
            let chip_node = cc.instantiate(tmp_chip);
            this._fly_pool.put(chip_node);
        }

        let self = this;
        this._resize_fun = () => {
            self._seats[my_seat_id].updatePosition();
        }
        cc.game.on('resize', this._resize_fun);
        this.initModelEventListener();
        this._node_ui_manager.getComponent(BcbmUIManager).carNode = this.carNode;
    }
    //更新余额
    update_socre(score) {
        this.setMyInfo();
    }
    //更新余额
    setMyInfo() {
        //设置自己信息
        this.setMySeatInfo({
            user: {
                userId: AppGame.ins.roleModel.useId,
                nickName: AppGame.ins.roleModel.nickName,
                score: AppGame.ins.roleModel.score,
                headerId: AppGame.ins.roleModel.headId,
                headboxId: AppGame.ins.roleModel.headboxId,
                vip: AppGame.ins.roleModel.vipLevel,
                headImgUrl: AppGame.ins.roleModel.headImgUrl
            }
        });
    }
    //切后台之前收到的消息
    toBackClear_After() {
        this.toBack = true;
        this._chipgroup.recoverSave();
    }
    //前后台切换
    toBackClear() {
        this.lighter.getComponent(sp.Skeleton).setToSetupPose();
        this.isFrontAndBackSwitch = true;
        this._leave_time = 0;
        this.startAni.active = false;
        let leave_time = this._leave_time > 0.1 ? Math.ceil(this._leave_time) : 0;
        let str_time = leave_time.toString();
        if (leave_time < 10) {
            str_time = '0' + leave_time;
        }
        this.lb_leavetime.string = str_time;
        this.recoverWinTag();
    }

    update(dt: number) {
        if (this._leave_time > 0) {
            if (this._leave_time < 0) {
                this._leave_time = 0;
            }
            let leave_time = this._leave_time > 0.1 ? Math.ceil(this._leave_time) : 0;
            if(leave_time <= 0){
                leave_time = 1;
            }
            let str_time = leave_time.toString();
            if (leave_time < 10) {
                str_time = '0' + leave_time;
            }
            this.lb_leavetime.string = str_time;
            if (this._game_status == GAME_STATUS.BCBM_GAME_START_TIPS) {
                switch (leave_time) {
                    case 3:
                        this.lighter.getComponent(sp.Skeleton).setAnimation(0, "red", false);
                        break;
                    case 2:
                        this.lighter.getComponent(sp.Skeleton).setAnimation(0, "yellow", false);
                        break;
                    case 1:
                        this.lighter.getComponent(sp.Skeleton).setAnimation(0, "green", false);
                        break;
                }
                if (leave_time == 3 && !this.startAni.active) {
                    this.startAni.active = true;
                    this.startAni.getComponent(sp.Skeleton).setCompleteListener((event) => {
                        this.startAni.active = false;
                    });
                    this.startAni.getComponent(sp.Skeleton).setAnimation(0, "321", false);
                }
            }
            if (leave_time <= COUNT_DOWN && (this.old_leave_time - leave_time >= 1) && (this._game_status == GAME_STATUS.BCBM_GAME_START_TIPS)) {
                this._music_mgr.playCountDown();
            }
            if (leave_time == COUNT_DOWN && this._game_status == GAME_STATUS.BCBM_GAME_BET) {
                this.onStartTips();
            }
            this._leave_time -= dt;
            this.old_leave_time = leave_time
        }
        this._leave_bet_sound -= dt;
        if (this._leave_bet_sound < 0) this._leave_bet_sound = 0;
    }

    onContinue() {
        this._node_continue.getComponent(cc.Button).interactable = false
        for (var k = 0; k < this._rectsPlaceOld.length; k++) {
            var total: number = this._rectsPlaceOld[k]
            var chipCount = parseInt((total / 500).toString())
            for (var j = 0; j < chipCount; j++) {
                AppGame.ins.bcbmModel.sendBet(k, 500 * 100);
            }

            total = total % 500
            chipCount = parseInt((total / 100).toString())
            for (var j = 0; j < chipCount; j++) {
                AppGame.ins.bcbmModel.sendBet(k, 100 * 100);
            }

            total = total % 100
            chipCount = parseInt((total / 50).toString())
            for (var j = 0; j < chipCount; j++) {
                AppGame.ins.bcbmModel.sendBet(k, 50 * 100);
            }

            total = total % 50
            chipCount = parseInt((total / 10).toString())
            for (var j = 0; j < chipCount; j++) {
                AppGame.ins.bcbmModel.sendBet(k, 10 * 100);
            }

            total = total % 10
            chipCount = parseInt((total / 5).toString())
            for (var j = 0; j < chipCount; j++) {
                AppGame.ins.bcbmModel.sendBet(k, 5 * 100);
            }

            total = total % 5
            chipCount = parseInt((total / 1).toString())
            for (var j = 0; j < chipCount; j++) {
                AppGame.ins.bcbmModel.sendBet(k, 1 * 100);
            }
        }
    }

    private intoCharge(): void {
        AppGame.ins.showUI(ECommonUI.LB_Charge);
    }

    //点击复制牌局信息
    private oncopy(): void {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this.lab_pjbh.string).substr(5, 30));
    }

    onStartTips() {
        this.setGameStatus(GAME_STATUS.BCBM_GAME_START_TIPS);
        this._music_mgr.playChipTips();
    }

    openScene(data: any) {
        if (data) {
            this._room_info = data.roomData;
        }
        super.openScene(data);
        this._music_mgr.playGamebg()
    }

    /**
     * 设置游戏状态 
     * @param status 状态
     */
    setGameStatus(status: GAME_STATUS) {
        this._game_status = status;
        if (status == GAME_STATUS.BCBM_GAME_STOP) {
            this.sp_status.spriteFrame = this.spf_status[2];
        } else if (status == GAME_STATUS.BCBM_GAME_START || status == GAME_STATUS.BCBM_GAME_FREE) {
            this.sp_status.spriteFrame = this.spf_status[0];
            this.lighter.getComponent(sp.Skeleton).setAnimation(0, "red", false);
        } else if (status == GAME_STATUS.BCBM_GAME_BET) {
            this.sp_status.spriteFrame = this.spf_status[1];
            this.lighter.getComponent(sp.Skeleton).setAnimation(0, "red", false);
        } else if (status == GAME_STATUS.BCBM_GAME_START_TIPS) {
            this.sp_status.spriteFrame = this.spf_status[1];
        } else if (status == GAME_STATUS.BCBM_GAME_END) {
            this.sp_status.spriteFrame = this.spf_status[3];
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
     * 从筹码池获取一个筹码
     * @param chip_type 
     * @param type  筹码类型，，0 普通筹码，  1 结算时动画筹码
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
        if (!chip_data.bg) {
            chip_data.bg = 'b';
        }
        if (!chip_data.value) {
            chip_data.value = this._room_info.jettons[1];
        }
        chip_node.getComponent(cc.Label).string = chip_data.bg;
        chip_node.active = true;
        chip_node.angle = 0;
        chip_node.scale = 1;
        return chip_node;
    }

    playBetSound() {
        if (this._leave_bet_sound == 0) {
            this._leave_bet_sound = 0.1;
            this._music_mgr.playbet();
        }
    }

    /**
     * 结算时飞筹码
    */
    flyChip(winTag: number) {
        let pos = UNodeHelper.find(this.node_desk, 'sp_clock').position;
        this._layer_chip.stopAllActions();
        this._layer_chip.runAction(cc.sequence(cc.delayTime(DELT_FLY), cc.callFunc(
            () => {  // 庄家先收赢了的金币
                let is_play = false;
                for (let index = 0; index < this._layer_chip.children.length; index++) {
                    var node = this._layer_chip.children[index];
                    if (winTag != node['bet_rect']) {
                        is_play = true;
                        BcbmAnimation.moveChip(node, new cc.Vec2(pos.x, pos.y), (node: cc.Node) => {
                            node.opacity = 0;
                        });
                    }
                }
                if (is_play) this._music_mgr.playflyCoin();
            }),
            cc.delayTime(1),
            cc.callFunc(
                () => {// 庄家补金币到桌子上
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
                            BcbmAnimation.bankerChipMove(new_node, desc_pos, (node: cc.Node) => { }, 0.3);
                        }
                    }
                    if (is_play) this._music_mgr.playflyCoin();
                }),
            cc.delayTime(1.2),
            cc.callFunc(
                () => {// 桌子的金币飞回给玩家
                    let is_play = false;
                    for (let index = 0; index < this._layer_chip.children.length; index++) {
                        var node = this._layer_chip.children[index];
                        is_play = true;
                        if (node['src_pos']) {
                            BcbmAnimation.moveChip(node, node['src_pos'], (node: cc.Node) => {
                                node.opacity = 0;
                            });
                        }
                    }

                    for (let index = 0; index < this._layer_fly.children.length; index++) {
                        var node = this._layer_fly.children[index];
                        if (node['src_pos']) {
                            BcbmAnimation.moveChip(node, node['src_pos'], (node: cc.Node) => {
                                node.opacity = 0;
                            });
                        } else {
                            BcbmAnimation.moveChip(node, new cc.Vec2(pos.x, pos.y), (node: cc.Node) => {
                                node.opacity = 0;
                            });
                        }
                    }
                    if (is_play) this._music_mgr.playflyCoin();
                }),
        ));
    }

    chipIndexToValue(index: number): number {
        if (this._room_info && this._room_info.jettons[index]) {
            return this._room_info.jettons[index];
        }
        return 0;
    }

    /**
    * 更新桌面信息
    * @param data LongHu.GameDeskInfo
    */
    updateDeskInfo(data: Bcbm.IGameDeskInfo) {
        this.allJettonScore = data.allJettonScore;
        this.setMyJetton(data.selfJettonScore);
        this.setTotalJetton(data.allJettonScore);
        this.setSeatInfo(data.players);
        this.lab_online_count.string = data.onlinePlayCount.toString();  // 设置在线人数
    }

    /**
     * 设置自己座位信息
     * @param data
     */
    setMySeatInfo(data: any) {
        this._seats[my_seat_id].show();
        this._seats[my_seat_id].setInfo(data);
        this._score = data.user.score;
        if (this.toBack) {
            this._chipgroup.recoverClear();
        }
        this._chipgroup.check(this._score);
        this.setMyGold(data.user.score);
    }

    /**
     * 设置座位信息
     * @param data
     */
    setSeatInfo(data: any) {
    }

    /**玩家列表 */
    onopenPlayers() {
        UDebug.log("请求玩家列表")
        let beginIndex: number = 1;
        let limitCount: number = 20;
        this._bcbm_model.sendPlayerList(beginIndex, limitCount);
        UAudioManager.ins.playSound("audio_click");
    }

    /**
    * 清理桌面
    */
    clearDesk(isStorn = false) {
        this.vbcbm_animamgr.clear();
        this._node_wait_next.active = false;
        // 清理下注
        if(isStorn && !this.toBack){
            this._rectsPlaceOld = [];
        }
        for (let i = 0; i < this._rects.length; i++) {
            if (this.node_luckys[i]){
                this.node_luckys[i].active = false;
            }
            if(isStorn && !this.toBack){
                this._rectsPlaceOld.push(Number(this._rects[i]._lab_total.string))
            }
            this._rects[i].clear();
        }

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
                this._chips_pool[4].put(node);   // 回收筹码到池
            } else if (node['bet_rect'] == 5) {
                this._chips_pool[5].put(node);
            } else if (node['bet_rect'] == 6) {
                this._chips_pool[6].put(node);
            } else if (node['bet_rect'] == 7) {
                this._chips_pool[7].put(node);
            } else {
                node.removeFromParent();
            }
        }

        while (this._layer_fly.children.length > 0) {
            let node = this._layer_fly.children[0];
            this._fly_pool.put(node);
        }


        let tmp_chip = UNodeHelper.find(this._node_root, 'tmp_chip');
        while (this._fly_pool.size() < CHIP_COUNT * 8) {
            let chip = cc.instantiate(tmp_chip)
            this._fly_pool.put(chip);
        }


        for (let i = 0; i < 8; i++) {
            while (this._chips_pool[i].size() < CHIP_COUNT) {
                let chip = cc.instantiate(tmp_chip)
                this._chips_pool[i].put(chip);
            }
        }

        this._layer_chip.stopAllActions();
        this._layer_chip.removeAllChildren();
        this.node_effect.removeAllChildren();

        for (let i in this._seats)
            this._seats[i].clear();

    }

    /**
     * 设置我的当前金币
     * @param gold 
     */
    setMyGold(gold: number) {
        this._seats[my_seat_id].setGold(gold);
        this._gold = gold;
        this.updateScore();
    }

    /**
     * 
     * @param data 
     */
    setSeatGold(userid: number, gold: number) {
        for (let i = 1; i <= this._seatNum; i++) {
            if (this._seats[i].userid == userid) {
                this._seats[i].setGold(gold);
            }
        }
    }

    /**
     * 设置每个区域总下注值
     */
    setTotalJetton(data: Bcbm.IPlaceJettonScore[]) {
        for (let index = 0; index < data.length; index++) {
            const place = data[index];
            this._rects[place.jettonArea].setTotalJetton(place.jettonScore);

        }
    }

    /**
     * 每个区域自己的下注值
     */
    setMyJetton(data: Bcbm.IPlaceJettonScore[]) {
        for (let index = 0; index < data.length; index++) {
            const place = data[index];
            this._rects[place.jettonArea].setSelfJetton(place.jettonScore);
        }
    }
    //是否存在自己的下注
    isHaveJetton() {
        let isHave = false;
        for (let index = 0; index < 4; index++) {
            if (this._rects[index].getSetSelfJetton() > 0) {
                isHave = true;
                break;
            }
        }
        return isHave;
    }

    getBetJettonPos(bet_rect: number) {
        var dest_pos = new cc.Vec2(0, 0);
        var ract_width = 55;
        var ract_height = 20;
        var end_center_pos = this._rects[bet_rect].getPosition();
        var flag = 1;
        if (Math.random() > 0.5) { flag = -1; }
        dest_pos.x = end_center_pos.x + Math.random() * ract_width * flag;

        flag = 1;
        if (Math.random() > 0.5) { flag = -1; }
        dest_pos.y = end_center_pos.y + Math.random() * ract_height * flag;
        return dest_pos;
    }

    playerBet(playerid: number, bet_type: number = 0, bet_rect: number, dlet_time?: number) {
        this.playBetSound(); // 播放下注声效
        dlet_time = dlet_time || 0;
        var dest_pos = this.getBetJettonPos(bet_rect);
        var chip_node = this.getChipByPool(bet_type, 0, bet_rect);
        if (playerid == AppGame.ins.roleModel.useId && !this.toBack){
            this._node_continue.getComponent(cc.Button).interactable = false;
        }

        chip_node.parent = this._layer_chip;
        chip_node['bet_type'] = bet_type;
        chip_node['bet_rect'] = bet_rect;
        chip_node['playerid'] = playerid;

        var notwait = false;

        var seat_id = this._bcbm_model.haveSeat(playerid);
        if (playerid == this._self_id) {
            chip_node.position = this._seats[my_seat_id].position;
            this._seats[my_seat_id].shake(1)
        } else {
            chip_node.position = this._seats[1].position;
            this._seats[1].shake(1);
        }
        chip_node['src_pos'] = chip_node.position;
        BcbmAnimation.betMove(chip_node, dest_pos, () => { }, dlet_time);
    }

    // 开始下注
    onStartBet(show_effect: boolean = true, timeLeave: number) {
        this.setGameStatus(GAME_STATUS.BCBM_GAME_BET);
        if (show_effect && timeLeave >= 13) {
            this._music_mgr.playStartBet();
            this.vbcbm_animamgr.showStartBet();
        }
        this._node_ui_manager.getComponent(BcbmUIManager).showCarAndEffect();
    }
    //续投检查状态
    checkContinueStatus(){
        let totalOld = 0
        for (let k = 0; k < this._rectsPlaceOld.length; k++) {
            totalOld += Number(this._rectsPlaceOld[k]);
        }
        if(!this.toBack){//前后台切换 以外 不处理
            if(this.isHaveJetton()){
                this._node_continue.getComponent(cc.Button).interactable = false;
            }else{
                this._node_continue.getComponent(cc.Button).interactable = totalOld != 0 && totalOld < Number(this._score / 100);
            }
        }
    }

    showWinTag(win_tag) {
        this._rects[win_tag].blink();
    }

    recoverWinTag() {
        for (let i in this._rects)
            this._rects[i].recover();
    }

    setRecord() {
        let recordList = this._bcbm_model._game_record.record;
        if (recordList && recordList.length > 0) {
            // 【0 奔驰】  【1 宝马】 【2 大众】  【3 阿尔法罗密欧】  【4 保时捷】  【5 玛莎拉蒂】  【6 兰博基尼】  【7 法拉利】
            // let descList = {0:"奔驰",1:"宝马",2:"大众",3:"阿尔法罗密欧",4:"保时捷",5:"玛莎拉蒂",6:"兰博基尼",7:"法拉利"}
            for (let index = recordList.length; index > -1; index--) {
                let record = recordList[index];
                if (record != null && record != undefined) {
                    let nodeName = "recordItem" + (index + 1);
                    let recordItem = UNodeHelper.find(this.historyNode, nodeName);
                    if (recordItem != null) {
                        recordItem.active = true;
                        let recordItemLogo = UNodeHelper.getComponent(recordItem, "carLogo", cc.Sprite);
                        recordItemLogo.spriteFrame = this.carLogoSpriteframes[record];
                    }
                }
            }
            this.spNewTip.active = true
            this.spNewTip.getComponent(sp.Skeleton).setAnimation(0, "new", false);
        }
    }

    //播放spine动画
    public playSpine(path: string, animation: string, skeleton: sp.Skeleton, loop: boolean, callback?: Function): void {
        if (AppGame.ins.roomModel.BundleName == "") return
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

            let src_pos = new_star.position;
            let des_pos = this.node_luckys[rect].position;
            let length = Math.sqrt((src_pos.x - des_pos.x) * (src_pos.x - des_pos.x) + (src_pos.y - des_pos.y) * (src_pos.y - des_pos.y));
            let speed = 700;
            let destime = length / speed;
            destime = destime < 0.5 ? 0.5 : destime;

            new_star.runAction(cc.sequence(cc.spawn(cc.scaleTo(destime, 1), BcbmAnimation.createParabolaTo(destime, new_star.position, this.node_luckys[rect].position, 60, 90)), cc.delayTime(0.2), cc.callFunc((node: any) => {
                this.node_luckys[node['rect']].active = true;
                node.destroy();
            }, this)));
        }
        else {
            this.node_luckys[rect].active = true;
        }
    }

    /**
     * 播放玩家输赢分数
     */
    playUserEndScore(data: any, timeLeave) {
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (element.userId == AppGame.ins.roleModel.useId) {
                var self_rect_score = 0
                element.jettonAreaScore.forEach(element => {
                    self_rect_score += element
                });
                if (self_rect_score != 0) {
                    this._seats[my_seat_id].playWinOrLoseScore2(element.returnScore, Number(timeLeave-1.8));
                }
            }
        }
    }
    private updateScore(): void {
        if (AppGame.ins.roleModel.score < AppGame.ins.game_watch_limit_score) {
            this._checkNode.active = true;
        } else {
            this._checkNode.active = false;
        }
    }


    private requestScore(): void {
        AppGame.ins.roleModel.requestUpdateScore();
    }

    /**
     * 初始化监听model事件
     */
    private initModelEventListener() {
        this._bcbm_model.on(MBcbm.S_GAME_START, this.requestScore, this);
        EventManager.getInstance().addEventListener(cfg_event.CLOSE_CHARGE, this.updateScore, this);
        this._bcbm_model.on(MBcbm.S_GAME_START, this.onGameStart, this);
        this._bcbm_model.on(MBcbm.S_SYNC_TIME, this.onSyncTime, this);
        this._bcbm_model.on(MBcbm.S_SEND_RECORD, this.onGameRecord, this);
        this._bcbm_model.on(MBcbm.S_START_PLACE_JETTON, this.onStartPlaceJetton, this);
        this._bcbm_model.on(MBcbm.S_PLACE_JET_FAIL, this.onPlaceJettonFail, this);
        this._bcbm_model.on(MBcbm.S_PLACE_JETTON, this.onPlaceJetton, this);
        this._bcbm_model.on(MBcbm.S_GAME_END, this.onGameEnd, this);

        this._bcbm_model.on(MBcbm.GAMESCENE_STATUS_FREE, this.onGameSceneStatusFree, this);
        this._bcbm_model.on(MBcbm.GAMESCENE_STATUS_JETTON, this.onGameSceneStatusJetton, this);
        this._bcbm_model.on(MBcbm.GAMESCENE_STATUS_OPEN, this.onGameSceneStatusOpen, this);
        this._bcbm_model.on(MBcbm.GAMESCENE_STATUS_END, this.onGameSceneStatusEnd, this);
        this._bcbm_model.on(MBcbm.OPEN_CARD, this.onOpenCard, this);

        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.update_socre, this);
        AppGame.ins.bcbmModel.on(MBcbm.TO_BACK_CLEAR, this.toBackClear, this);
        AppGame.ins.bcbmModel.on(MBcbm.TO_BACK_CLEAR_AFTER, this.toBackClear_After, this);
        this._bcbm_model.run();
    }

    /**
    * 移除监听model事件
    */
    private removeModelEventListener() {
        this._bcbm_model.off(MBcbm.S_GAME_START, this.requestScore, this);
        EventManager.getInstance().removeEventListener(cfg_event.CLOSE_CHARGE, this.updateScore, this);
        this._bcbm_model.off(MBcbm.S_GAME_START, this.onGameStart, this);
        this._bcbm_model.off(MBcbm.S_SYNC_TIME, this.onSyncTime, this);
        this._bcbm_model.off(MBcbm.S_SEND_RECORD, this.onGameRecord, this);
        this._bcbm_model.off(MBcbm.S_START_PLACE_JETTON, this.onStartPlaceJetton, this);
        this._bcbm_model.off(MBcbm.S_PLACE_JET_FAIL, this.onPlaceJettonFail, this);
        this._bcbm_model.off(MBcbm.S_PLACE_JETTON, this.onPlaceJetton, this);
        this._bcbm_model.off(MBcbm.S_GAME_END, this.onGameEnd, this);

        this._bcbm_model.off(MBcbm.GAMESCENE_STATUS_FREE, this.onGameSceneStatusFree, this);
        this._bcbm_model.off(MBcbm.GAMESCENE_STATUS_JETTON, this.onGameSceneStatusJetton, this);
        this._bcbm_model.off(MBcbm.GAMESCENE_STATUS_OPEN, this.onGameSceneStatusOpen, this);
        this._bcbm_model.off(MBcbm.GAMESCENE_STATUS_END, this.onGameSceneStatusEnd, this);
        this._bcbm_model.off(MBcbm.OPEN_CARD, this.onOpenCard, this);

        AppGame.ins.roleModel.off(MRole.UPDATA_SCORE, this.update_socre, this);
        AppGame.ins.bcbmModel.off(MBcbm.TO_BACK_CLEAR, this.toBackClear, this);
        AppGame.ins.bcbmModel.off(MBcbm.TO_BACK_CLEAR_AFTER, this.toBackClear_After, this);
        this._bcbm_model.exit();
        //this._bcbm_model.targetOff(this);
        UDebug.Log('aaa');
    }

    //model 监听回调 start
    onGameStart(data: Bcbm.CMD_S_GameStart) {
        UDebug.log('VbcbmScene:onGameStart' + data);
        this.clearDesk(true);
        this._leave_time = data.timeLeave;
        this.setGameStatus(GAME_STATUS.BCBM_GAME_START);
        // this.vbcbm_animamgr.showStartGame();
    }

    onSyncTime(data: Bcbm.CMD_S_SyncTime_Res) {
        UDebug.log('VbcbmScene:onSyncTime' + data);
    }

    onGameRecord(data: Bcbm.GameOpenRecord) {
        this.setRecord();  //初始化游戏记录
        this.isFrontAndBackSwitch = false;
    }

    onStartPlaceJetton(data: Bcbm.CMD_S_StartPlaceJetton) {
        UDebug.log('VbcbmScene:onStartPlaceJetton' + data);
        this.lab_pjbh.string = '牌局编号:' + data.roundId;
        // this._chipgroup.avAllChips();
        this._chipgroup.recoverClear();
        this._chipgroup.check(data.userScore);
        this._leave_time = data.timeLeave;
        BET_TIME = data.addJettonTime;
        this.onStartBet(!this._is_first_in, data.timeLeave);
        this.updateDeskInfo(data.deskData);
        this.setMyGold(data.userScore);

        this.setDeskChips(data);
        this.checkContinueStatus();
    }

    onPlaceJettonFail(data: Bcbm.CMD_S_PlaceJettonFail) {
        UDebug.log('VbcbmScene:onPlaceJettonFail' + data);
        AppGame.ins.showTips({ data: data.errMsg, type: ETipType.onlyone });
    }

    onPlaceJetton(data: Bcbm.CMD_S_PlaceJetSuccess) {
        var chip_index = this.chipValueToIndex(data.jettonScore);
        if (chip_index == -1) {
            AppGame.ins.showTips({ data: '没找到值为' + data.jettonScore / 100 + '的筹码', type: ETipType.onlyone });
            return;
        }
        this.playerBet(data.userId, chip_index, data.jettonArea);

        if (data.userId == AppGame.ins.roleModel.useId) {
            this.setMyGold(data.userScore);
            this._chipgroup.check(data.userScore);
        }
        this.allJettonScore = data.allJettonScore;
        this.setSeatGold(data.userId, data.userScore);
        this.setTotalJetton(data.allJettonScore);
        this.setMyJetton(data.selfJettonScore);
    }
    onGameEnd(data: Bcbm.CMD_S_GameEnd) {
        UDebug.log('VbcbmScene:onGameEnd' + data);
        this.allJettonScore = data.deskData.allJettonScore;
        this.lab_pjbh.string = '牌局编号:' + data.roundId;
        this._leave_time = data.timeLeave;
        this.setGameStatus(GAME_STATUS.BCBM_GAME_END);
        this.setMyJetton(data.deskData.selfJettonScore);
        this.setTotalJetton(data.deskData.allJettonScore);
        this._winTag = data.deskData.winTag
        if (!this._is_first_in) {
            this.updateDeskInfo(data.deskData);
            this.setMyGold(data.userScore);

            this.playUserEndScore(data.gameEndScore, data.timeLeave);
            this._node_continue.getComponent(cc.Button).interactable = false;
        } else {
            this._node_wait_next.active = true;
            this._node_wait_login.active = false;
            this.updateDeskInfo(data.deskData);
            this.setMyGold(data.userScore);
            this.playUserEndScore(data.gameEndScore, data.timeLeave);
            this.setDeskChips(data);
        }
        this._is_first_in = false;
        this.toBack = false;
    }

    /**开牌 */
    onOpenCard(data: Bcbm.CMD_S_OpenCard) {
        UDebug.log('scene 开牌 ' + data);
        this.setGameStatus(GAME_STATUS.BCBM_GAME_STOP);
        this._node_continue.getComponent(cc.Button).interactable = false;
        this._leave_time = data.timeLeave;
        this._winTag = data.winTag;
        this.vbcbm_animamgr.showStopBet();
        this._music_mgr.playStopBet();
        this._node_ui_manager.getComponent(BcbmUIManager).run(data.timeLeave);
    }

    /**游戏空闲状态 */
    onGameSceneStatusFree(data: Bcbm.CMD_Scene_StatusFree) {
        UDebug.log('scene 游戏场景状态-空闲 ' + data);
        this.toBack = false;
        this.setGameStatus(GAME_STATUS.BCBM_GAME_FREE);
        this._leave_time = data.timeLeave;
        this._node_continue.getComponent(cc.Button).interactable = false;
        this.clearDesk();
        this.lab_online_count.string = data.deskData.onlinePlayCount.toString();  // 设置在线人数
        this.checkContinueStatus();
    }

    /**游戏下注状态 */
    onGameSceneStatusJetton(data: Bcbm.CMD_Scene_StatusJetton) {
        UDebug.log('scene 游戏场景状态-下注 ' + data);
        this._node_wait_next.active = false;
        this._node_wait_login.active = false;
        this.setGameStatus(GAME_STATUS.BCBM_GAME_BET);
        this._leave_time = data.timeLeave;
        this.clearDesk();
    }

    /**游戏开牌状态 */
    onGameSceneStatusOpen(data: Bcbm.CMD_Scene_StatusOpen) {
        UDebug.log('scene 游戏场景状态-开牌 ' + data);
        this.setGameStatus(GAME_STATUS.BCBM_GAME_STOP);
        this._leave_time = data.timeLeave;
        this._node_continue.getComponent(cc.Button).interactable = false;
        this.clearDesk();
        this.setDeskChips(data);
    }

    /**游戏结束状态 */
    onGameSceneStatusEnd(data: Bcbm.CMD_Scene_StatusEnd) {
        UDebug.log('scene 游戏场景状态-结束 ' + data);
        this.setGameStatus(GAME_STATUS.BCBM_GAME_END);
        this._leave_time = data.timeLeave;
        this._node_continue.getComponent(cc.Button).interactable = false;
        this.clearDesk();
    }

    //初始化筹码
    initChipFormArea(newData) {
        //桌面额度
        for (let key in this.allJettonScore) {
            let deskChip = this.allJettonScore[key];
            if (deskChip != null && deskChip.jettonScore != null) {
                this.getChipForScore(deskChip.jettonScore, deskChip.jettonArea, newData);
            }
        }
    }
    getRandomNum(Min, Max) {
        let Range = Number(Max) - Number(Min);
        let Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }

    getChipForScore(areaMaxScore, area, deskPlayList) {
        let maxChip = 20;
        while (maxChip > 0) {
            for (let k in deskPlayList) {//所有的玩家
                let playData = deskPlayList[k];//单个玩家
                let seatPosition = UNodeHelper.find(this.node, "uiroot/node_desk/sp_seat_1").position;
                let chip = this.getScore(playData.returnScore);
                playData.returnScore -= chip;
                if (Number(playData.userId) == AppGame.ins.roleModel.useId && playData.returnScore >= chip) {
                    seatPosition = UNodeHelper.find(this.node, "uiroot/node_desk/sp_seat_6").position;
                }
                this.creatorChip(area, chip, Number(playData.userId), seatPosition);
                maxChip--;
            }
        }
    }

    getScore(returnScore) {
        let len = this._room_info.jettons.length - 1;
        let index = this.getRandomNum(0, len);
        let coin = this._room_info.jettons[0];
        for (let i = len; i > -1; i--) {
            index = this.getRandomNum(0, len);
            coin = this._room_info.jettons[index];
            if (returnScore >= coin) {
                return coin;
            }
        }
        return coin;
    }

    //创建无动画筹码
    creatorChip(area, jettonScore, playerId, seatPosition) {
        let chip_type = 1;
        let pool = this._fly_pool;
        if (pool.size() <= 0) {     // 筹码池不够
            if (this.recoverChipToPool(chip_type, area) == false) {
                this.putChipToPool(chip_type, area);
            }
        }
        let dest_pos = this.getBetJettonPos(area);
        let chip_index = this.chipValueToIndex(jettonScore);
        let chip_node = this.getChipByPool(chip_index, 1);
        chip_node.x = dest_pos.x;
        chip_node.y = dest_pos.y;
        chip_node.scale = 0.8;
        chip_node.active = true;
        chip_node.parent = this._layer_fly;
        chip_node['src_pos'] = seatPosition;
        chip_node['playerid'] = playerId;
        chip_node['src_x'] = seatPosition.x;
        chip_node['src_y'] = seatPosition.y;
    }

    /**设置桌子筹码 */
    setDeskChips(data: any) {
        if (!data || !data.deskData || !data.deskData.jetInfo) return;
        for (let index = 0; index < data.deskData.jetInfo.length; index++) {
            const element = data.deskData.jetInfo[index];
            for (let index = 0; index < element.jettonCount; index++) {
                var chip_index = this.chipValueToIndex(element.jettonType);
                if (chip_index == -1) {
                    AppGame.ins.showTips('找不到对应筹码 ' + element.jettonType / 100);
                    break;
                }
                let playerIndex = data.deskData.players[Math.floor((Math.random() * (data.deskData.players.length > 6 ? 6 : data.deskData.players.length)))];
                this.playerBet((playerIndex && playerIndex.hasOwnProperty('user')) ? playerIndex.user.userId : -1, chip_index, element.jettonArea);
            }
        }
    }
}