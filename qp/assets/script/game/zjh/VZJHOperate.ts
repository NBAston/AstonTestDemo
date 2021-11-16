import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import VZJH from "./VZJH";
import AppGame from "../../public/base/AppGame";
import VAddChips from "./VZJHAddChips";
import { EBattlePlayerPaiState, EZJHState, UIZJHChips, UIZJHOperate } from "./UZJHClass";
import MZJH, { ZJH_SCALE } from "./MZJH";
import UToggle from "../../common/utility/UToggle";
import UHandler from "../../common/utility/UHandler";
import UDebug from "../../common/utility/UDebug";
import { EventManager } from "../../common/utility/EventManager";
import cfg_event from "../../config/cfg_event";
import { ECommonUI } from "../../common/base/UAllenum";


const { ccclass, property } = cc._decorator;
/**
 * 创建：sq
 * 操作面板
 */
@ccclass
export default class VZJHOperate extends cc.Component {
    /**
     * 继续游戏
     */
    public _btnGoon: cc.Button;
    /**
     * 跟注
     */
    private _btnGenZhu: cc.Button;
    /**
     * 比牌
     */
    private _btnBiPai: cc.Button;
    /**
     * 弃牌
     */
    private _btnQipai: cc.Button;
    /**
     * 自动跟注
     */
    private _btnAutogenzhu: cc.Button;
    /**
     * 取消自动跟注
     */
    private _btnCancelGenZhu: cc.Button;
    /**
     * 加注按钮
     */
    private _btnJiaZhu: cc.Button;
    /**
     * 孤注一致
     */
    private _guzhuyizhi: cc.Button;
    /**防超时 */
    private _fangchaoshi: cc.Toggle;

    private _biPaiGray: cc.Node;
    private _jiazhuGray: cc.Node;
    private _genzhuGray: cc.Node;

    private _leftBottom: cc.Node;
    private _rightBottom: cc.Node;
    private _genZhu: cc.Label;
    private _bipai: cc.Label;
    private _addChips: VAddChips
    private _vzjh: VZJH;

    /**自动跟注 */
    _auto: boolean;
    private _canjiazhu: boolean;
    private _isturn: boolean;
    private _canbipai: boolean;
    private _guzhu: boolean;
    private _bipaiZi1: cc.Node;
    private _bipaiZi2: cc.Node;
    public _toggle_xjlc: cc.Toggle;
    public _cuoPaiToggle: cc.Toggle;
    private _nextTime: number;
    private _chatBtn: cc.Node;
    private _fromeDisconnect: boolean;

    /**
     * 初始化
     */
    init(zjh: VZJH, addnode: cc.Node): void {
        this.node.active = true;
        this._fromeDisconnect = false;
        this._vzjh = zjh;
        this._addChips = addnode.getComponent(VAddChips);
        this._addChips.closeHandler = new UHandler(this.closeChip, this);
        this._addChips.init(this);

        this._leftBottom = UNodeHelper.find(this.node, "leftbottom");
        this._rightBottom = UNodeHelper.find(this.node, "rightbottom");

        this._btnGoon = UNodeHelper.getComponent(this.node, "bottom/btn_goon", cc.Button);
        this._btnJiaZhu = UNodeHelper.getComponent(this.node, "rightbottom/btn_jiazhu", cc.Button);
        this._btnGenZhu = UNodeHelper.getComponent(this.node, "rightbottom/btn_genzhu", cc.Button);
        this._btnBiPai = UNodeHelper.getComponent(this.node, "rightbottom/btn_bipai", cc.Button);
        this._btnQipai = UNodeHelper.getComponent(this.node, "leftbottom/btn_qipai", cc.Button);
        this._btnAutogenzhu = UNodeHelper.getComponent(this.node, "rightbottom/btn_autogenzhu", cc.Button);
        this._btnCancelGenZhu = UNodeHelper.getComponent(this.node, "rightbottom/btn_cancelautogenzhu", cc.Button);
        this._guzhuyizhi = UNodeHelper.getComponent(this.node, "rightbottom/btn_genzhuyizhi", cc.Button);
        this._fangchaoshi = UNodeHelper.getComponent(this.node, "leftbottom/fangchaoshi", cc.Toggle);
        this._genZhu = UNodeHelper.getComponent(this.node, "rightbottom/btn_genzhu/gen_value", cc.Label);
        this._bipai = UNodeHelper.getComponent(this.node, "rightbottom/btn_bipai/zi_1", cc.Label);
        this._bipaiZi1 = UNodeHelper.find(this.node, "rightbottom/btn_bipai/zi_1");
        this._bipaiZi2 = UNodeHelper.find(this.node, "rightbottom/btn_bipai/zi_2");
        this._biPaiGray = UNodeHelper.find(this.node, "rightbottom/btn_bipai/gray");
        this._genzhuGray = UNodeHelper.find(this.node, "rightbottom/btn_genzhu/gray");
        this._jiazhuGray = UNodeHelper.find(this.node, "rightbottom/btn_jiazhu/gray");
        this._toggle_xjlc = UNodeHelper.getComponent(this.node, "toggle_xjlc", cc.Toggle);
        this._cuoPaiToggle = UNodeHelper.getComponent(this.node, "cuoPaiToggle", cc.Toggle);
        this._chatBtn = UNodeHelper.find(this.node, 'chatBtn');

        UEventHandler.addClick(this._btnGoon.node, this.node, "VZJHOperate", "goonGame");

        UEventHandler.addClick(this._btnGenZhu.node, this.node, "VZJHOperate", "ongenzhu");
        UEventHandler.addClick(this._btnBiPai.node, this.node, "VZJHOperate", "onbipai");
        UEventHandler.addClick(this._btnQipai.node, this.node, "VZJHOperate", "onqipai");
        UEventHandler.addClick(this._btnAutogenzhu.node, this.node, "VZJHOperate", "onautogenzhu");
        UEventHandler.addClick(this._btnCancelGenZhu.node, this.node, "VZJHOperate", "oncancelgenzhu");
        UEventHandler.addClick(this._guzhuyizhi.node, this.node, "VZJHOperate", "onguzhuyizhi");
        UEventHandler.addToggle(this._fangchaoshi.node, this.node, "VZJHOperate", "fangchaoshiClick");
        UEventHandler.addToggle(this._cuoPaiToggle.node, this.node, "VZJHOperate", "cuoPaiClick");
        UEventHandler.addClick(this._btnJiaZhu.node, this.node, "VZJHOperate", "onopenchipnode");
        UEventHandler.addClick(this._chatBtn, this.node, "VZJHOperate", "onClickChat")
        this._bipaiZi1.active = false;
        this._bipaiZi2.active = true;
        this.showall(true);
        this._auto = false;
        this._guzhu = false;
        this._isturn = false;
        this._canbipai = false;
        this._canjiazhu = true;
        this._biPaiGray.active = false;
        this._jiazhuGray.active = false;
        this._genzhuGray.active = false;
        this._nextTime = 0;
        this._btnGoon.node.active = false;
        this._biPaiGray.getComponent(cc.Sprite).setState(cc.Sprite.State.GRAY);
        this._genzhuGray.getComponent(cc.Sprite).setState(cc.Sprite.State.GRAY);
        this._jiazhuGray.getComponent(cc.Sprite).setState(cc.Sprite.State.GRAY);

    }
    private clickmusic(): void {
        this._vzjh["_music"].playclick();
    }
    private closeChip(): void {
        this._btnJiaZhu.node.active = true;
        this.clickmusic();
    }
    private onopenchipnode(): void {
        this._btnJiaZhu.node.active = false;
        this._cuoPaiToggle.node.active = false;
        this._chatBtn.active = false;
        this._addChips.setactive(true);
        this.clickmusic();
    }
    private fangchaoshiClick(caller): void {
        this.clickmusic();
        AppGame.ins.zjhModel.requestFangChaoshi(this._fangchaoshi.isChecked);
    }
    private cuoPaiClick(): void {
        this.clickmusic();
        if (this._cuoPaiToggle.isChecked) {

        }
    }
    private goonGame(): void {
        // this.clickmusic();
        MZJH.isBool = true;
        this.oncancelgenzhu();
        if (this._fromeDisconnect) {
            AppGame.ins.zjhModel.reconnectRequest();
            this._vzjh.waitbattle();
            this._fromeDisconnect = false;
        } else {
            // this.scheduleOnce(function() {
            AppGame.ins.zjhModel.requestMatch();
            UDebug.log("繼續遊戲")
            // },3)
        }
        this._toggle_xjlc.node.active = false;
        this.showMatchBtn(false);
        this._auto = false;
        this._vzjh.waitbattle();
    }
    private onguzhuyizhi(): void {
        this.clickmusic();
        AppGame.ins.zjhModel.requestGuzhuyizhi();
        this.updateBtn();
    }
    private ongenzhu(): void {
        this.clickmusic();
        AppGame.ins.zjhModel.requestGenzhu();
        this.updateBtn();
    }
    private onbipai(): void {
        this.clickmusic();

        let compare = AppGame.ins.zjhModel.getcompareArray();
        let len = compare.length;
        if (len == 0)
            return;
        else if (len == 1) {
            AppGame.ins.zjhModel.requestComparePoker(compare[0]);
        } else {
            this._vzjh.selectCompare(AppGame.ins.zjhModel.getcompareArray());
        }
        // this.updateBtn();
    }
    private onqipai(): void {
        this.clickmusic();
        AppGame.ins.zjhModel.requestQipai();
        if (this._toggle_xjlc.isChecked == true) {
            this.showMatchBtn(false);
        } else {
            this._toggle_xjlc.node.active = false;
        }
    }
    private onautogenzhu(): void {
        this.clickmusic();
        AppGame.ins.zjhModel.requestAutoGenzhu(true);
        this._auto = true;
        this.updateBtn();
    }
    private oncancelgenzhu(): void {
        this.clickmusic();
        AppGame.ins.zjhModel.requestAutoGenzhu(false);
        this._auto = false;
        this.updateBtn();
    }
    public updateBtn(): void {
        this._btnJiaZhu.node.active = true;
        if (AppGame.ins.currRoomKind == 2 && AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId] && ((AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.mengPai || AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.kanPai))) {
            this._toggle_xjlc.node.active = true;
        } else {
            this._toggle_xjlc.node.active = false;
        }
        if (AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId] && (AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.mengPai || AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.kanPai)) {
            this._cuoPaiToggle.node.active = true;
        } else {
            this._cuoPaiToggle.node.active = false;
        }

        this._chatBtn.active = true;
        //暂时隐藏聊天功能
        // this._chatBtn.active = false;
        if (this._isturn) {
            if (AppGame.ins.currRoomKind == 2) {
                if (this._vzjh.turn_number > AppGame.ins.zjhModel._wLookCardMinTurnsRound) {
                    this._canbipai = true;
                } else {
                    this._canbipai = false;
                }
            }
            this._btnBiPai.interactable = this._canbipai;
            if (this._canbipai) {
                this._bipaiZi1.color = cc.color(255, 255, 255, 255);
                this._bipaiZi2.color = cc.color(255, 255, 255, 255);
            } else {
                this._bipaiZi1.color = cc.color(134, 134, 134, 204);
                this._bipaiZi2.color = cc.color(134, 134, 134, 204);
            }
            this._biPaiGray.active = !this._canbipai;
            if (this._guzhu) {

                this._btnBiPai.node.active = false;
                this._guzhuyizhi.node.active = true;
                this._btnGenZhu.node.active = true;
                this._btnGenZhu.interactable = false;
                this._genzhuGray.active = true;
                this._btnCancelGenZhu.node.active = false;
                this._btnAutogenzhu.node.active = false;
                this._btnJiaZhu.interactable = false;
                this._btnJiaZhu.node.getChildByName("pi_value").color = cc.color(133, 133, 133, 204);
                this._jiazhuGray.active = true;

            } else {
                this._btnBiPai.node.active = true;
                this._guzhuyizhi.node.active = false;
                if (this._auto) {
                    this._btnGenZhu.node.active = false;
                    this._btnCancelGenZhu.node.active = true;
                    this._btnAutogenzhu.node.active = false;
                    this._btnJiaZhu.interactable = this._canjiazhu;
                    if (this._canjiazhu) {
                        this._btnJiaZhu.node.getChildByName("pi_value").color = cc.color(255, 255, 255, 204);
                    } else {
                        this._btnJiaZhu.node.getChildByName("pi_value").color = cc.color(133, 133, 133, 204);
                    }
                    this._jiazhuGray.active = !this._canjiazhu;

                } else {
                    this._btnGenZhu.interactable = true;
                    this._btnGenZhu.node.active = true;
                    this._genzhuGray.active = false;
                    this._btnCancelGenZhu.node.active = false;
                    this._btnAutogenzhu.node.active = false;
                    this._btnJiaZhu.interactable = this._canjiazhu;
                    if (this._canjiazhu) {
                        this._btnJiaZhu.node.getChildByName("pi_value").color = cc.color(255, 255, 255, 204);
                    } else {
                        this._btnJiaZhu.node.getChildByName("pi_value").color = cc.color(133, 133, 133, 204);
                    }
                    this._jiazhuGray.active = !this._canjiazhu;
                    UDebug.Log(this._canjiazhu);
                }
            }
        } else {
            this._guzhuyizhi.node.active = false;
            this._btnBiPai.interactable = false;
            this._bipaiZi1.color = cc.color(134, 134, 134, 204);
            this._bipaiZi2.color = cc.color(134, 134, 134, 204);
            this._btnJiaZhu.interactable = false;
            this._btnJiaZhu.node.getChildByName("pi_value").color = cc.color(133, 133, 133, 204);
            this._btnGenZhu.node.active = false;
            this._jiazhuGray.active = true;
            this._biPaiGray.active = true;

            this._btnBiPai.node.active = true;
            if (this._auto) {
                this._btnCancelGenZhu.node.active = true;
                this._btnAutogenzhu.node.active = false;
            } else {
                this._btnCancelGenZhu.node.active = false;
                this._btnAutogenzhu.node.active = true;
            }
        }
    }
    protected update(dt: number): void {
        if (this._isturn && this._auto) {
            this._nextTime -= dt;
            if (this._nextTime < 0) {
                this._nextTime = 100000000;
                var a = Math.random() + 1;
                this.scheduleOnce(function () {
                    AppGame.ins.zjhModel.requestGenzhu();
                }, a)

            }
        }
    }


    // 点击聊天
    private onClickChat(): void {
        AppGame.ins.showUI(ECommonUI.UI_CHAT_HY);
    }
    /**
     * 进去自己的轮
     */
    intoSelfturn(auto: boolean): void {
        this._nextTime = 0.5;
        this._isturn = true;
        this.showall(true);
        this._btnQipai.node.active = true;
        this.updateBtn();

    }
    /**
     * 进入其他人的轮
     */
    intoOtherTurn(auto: boolean): void {
        if (AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.biPaiShu || AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.qiPai || AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.none) {
            this.showall(false);
            this._toggle_xjlc.node.active = false;
        } else {
            this._isturn = false;
            this._canbipai = false;
            this.showall(true);
            this.updateBtn();
            this._btnQipai.node.active = false;
        }

        // this._btnAutogenzhu.node.active = false;
        // this._btnCancelGenZhu.node.active = false;

    }
    updateChip(chips: UIZJHOperate): void {
        this._bipai.node.active = chips.showBipaiValue;
        var value = Math.round(chips.genzhu * ZJH_SCALE);
        this._genZhu.string = "dq:" + value;
        this._bipai.string = "Ah:" + value * 2;
        this._addChips.bind(chips.items);
        this._auto = chips.isauto;
        this._guzhu = chips.isguzhu;
        this._canjiazhu = chips.canJiaZhu;
        this._canbipai = chips.canBipai;
        this.updateBtn();
        this._bipaiZi2.active = !chips.showBipaiValue;
        this._bipaiZi1.active = chips.showBipaiValue;

    }
    fromeDisconnect(value: boolean): void {
        this._fromeDisconnect = value;
    }
    /**
     * 一局游戏结束chips.showBipaiValue
     */
    showMatch(): void {
        this._isturn = false;
        // this._canbipai = false;
        // this._auto = false;
        // this._canjiazhu = true;
        this._btnGoon.node.active = true;
        // if(AppGame.ins.currRoomKind == 2){
        //     this._toggle_xjlc.node.active = true;
        // }else{
        this._toggle_xjlc.node.active = false;
        // }

        this.showall(false);
        // if(this._toggle_xjlc.isChecked !== true){
        // this.goonGame();
        // }

    }

    showMatchBtn(value: boolean): void {
        this._btnGoon.node.active = value;
    }

    /**设置防超时棋牌 */
    setFangChaoShi(value: boolean): void {
        this._fangchaoshi.isChecked = value;
    }

    /**隐藏所有 */
    public showall(value: boolean): void {
        this._leftBottom.active = value;
        this._rightBottom.active = value;
        this._addChips.setactive(false);
        this._cuoPaiToggle.node.active = false;
        this._chatBtn.active = false;
    }

    onEnable() {

        AppGame.ins.zjhModel.on(MZJH.SHOW_GOON_BTN, this.showMatchBtn, this);
        EventManager.getInstance().addEventListener(cfg_event.START_MATFCH, this.showMatch.bind(this), this);
    }

    onDisable() {
        AppGame.ins.zjhModel.off(MZJH.SHOW_GOON_BTN, this.showMatchBtn, this);
        EventManager.getInstance().removeEventListener(cfg_event.START_MATFCH, this.showMatch.bind(this), this);
    }
}
