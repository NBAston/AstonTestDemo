import VSG from "./VSG";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import AppGame from "../../public/base/AppGame";
import UDebug from "../../common/utility/UDebug";
import UAudioManager from "../../common/base/UAudioManager";

const { ccclass, property } = cc._decorator;
/**
 * 创建：sq
 * 操作面板
 */
@ccclass
export default class VSGOperate extends cc.Component {

    /**
     * 继续游戏
     */
    private _btnGoon: cc.Button;
    /**
     * 跟注
     */
    private _btnGenZhu: cc.Button;
    /**
     * 比牌
     */
    // private _btnBiPai: cc.Button;
    /**
     * 弃牌
     */
    // private _btnQipai: cc.Button;
    /**
     * 自动跟注
     */
    // private _btnAutogenzhu: cc.Button;
    /**
     * 取消自动跟注
     */
    // private _btnCancelGenZhu: cc.Button;

    /**抢庄按钮界面 */
    private _qz_node: cc.Node;
    /**下注按钮界面 */
    private _xz_node: cc.Node;
    /**不抢按钮 */
    private _btn_bq: cc.Button;
    /**抢庄按钮 */
    private _btn_qz: cc.Button;
    /**下注按钮样本 */
    private _btn_xiazhu: cc.Node;
    /**动态下注按钮数组 */
    private _btns_xiazhu: cc.Node[] = new Array();
    /**动态下注按钮数组长度 */
    private _btns_length: number = 0;

    private _btn_seepai: cc.Button;

    private _xjlcToggle: cc.Toggle;

    posx = {
        [1]: [5],
        [2]: [-113, 98],
        [3]: [-161, 5, 171],
        [4]: [-248, -82, 85, 251],
        [5]: [-328, -161, 5, 171, 338],
    }

    private _vsg: VSG;
    /**重连场景在游戏房间内,但不是游戏 */
    private _fromeDisconnect: boolean = false;

    /**
     * 初始化
     */
    init(sg: VSG, addnode?: cc.Node): void {

        this._vsg = sg;
        // this._addChips = addnode.getComponent(VAddChips);
        // this._addChips.init(sg);

        this._qz_node = UNodeHelper.find(this.node, "qz_node");
        this._xz_node = UNodeHelper.find(this.node, "xz_node");

        this._btnGoon = UNodeHelper.getComponent(this.node, "btn_goon", cc.Button);

        this._btn_bq = UNodeHelper.getComponent(this._qz_node, "btn_bq", cc.Button);
        this._btn_qz = UNodeHelper.getComponent(this._qz_node, "btn_qz", cc.Button);
        this._btn_xiazhu = UNodeHelper.find(this._xz_node, "btn_zhu");
        this._btn_seepai = UNodeHelper.getComponent(this.node, "btn_seepai", cc.Button);

        this._xjlcToggle = UNodeHelper.getComponent(this.node, "toggle_xjlc", cc.Toggle);

        UEventHandler.addClick(this._btn_bq.node, this.node, "VSGOperate", "onBuQiang");
        UEventHandler.addClick(this._btn_qz.node, this.node, "VSGOperate", "onQiangZhuang");
        UEventHandler.addClick(this._btn_seepai.node, this.node, "VSGOperate", "onSeePai");


        UEventHandler.addClick(this._btnGoon.node, this.node, "VSGOperate", "goonGame");

        this._fromeDisconnect = false;
        this.hideall();
    }
    /**根据下注的数组 更新 */
    updateXiazhuBtns(zhus: number[], length?: number) {
        if (zhus == null || zhus.length == 0) {
            this.set_xz_node(false);
            return;
        }

        if (length == null) {
            length = zhus.length;
        }


        this.removeAllXiaZhuBtns();

        this._btns_length = length;
        for (let i = 0; i < length; i++) {
            var item = cc.instantiate(this._btn_xiazhu);
            item.parent = this._xz_node;
            item.name = "btn_xiazhu" + i.toString();
            item.active = true;

            if (zhus[i] > 0) {
                item.getComponent(cc.Button).interactable = true;
                UEventHandler.addClick(item, this.node, "VSGOperate", "onXiaZhu", i);
                UNodeHelper.find(item, "gen_value").active = true;
                UNodeHelper.find(item, "gray_label").active = false;
                UNodeHelper.getComponent(item, "gen_value", cc.Label).string = zhus[i].toString() + "倍";
            } else {
                item.getComponent(cc.Button).interactable = false;
                UNodeHelper.find(item, "gen_value").active = false;
                UNodeHelper.find(item, "gray_label").active = true;
                UNodeHelper.getComponent(item, "gray_label", cc.Label).string = Math.abs(zhus[i]).toString() + "倍";
                // item.active = false;
            }
            item.setPosition(this.posx[length][i], item.getPosition().y);
            this._btns_xiazhu.push(item);
        }
    }
    /**移除所有下注按钮 */
    removeAllXiaZhuBtns() {
        for (let i = 0; i < this._btns_length; i++) {
            var item = this._btns_xiazhu.pop();
            item.active = false;
            item.removeFromParent();
            item.destroy(); //removeFromParent();
        }
        this._btns_length = 0;
    }

    fromeDisconnect(value: boolean): void {
        this._fromeDisconnect = value;
    }

    /**继续游戏 */
    private goonGame(): void {
        // this._vsg.playClick();
        this._vsg.waitbattle();

        if (this._fromeDisconnect) {
            AppGame.ins.sgModel.reconnectRequest();

            this._fromeDisconnect = false;
        } else {

            AppGame.ins.sgModel.requestMatch();
        }


        this.showMatchBtn(false);



    }

    /**显示匹配文字的显示面板 */
    showMatchBtn(value: boolean): void {
        this._btnGoon.node.active = value;
    }

    /**不抢 */
    private onBuQiang(): void {
        // UDebug.Log("onBuQiang");
        AppGame.ins.sgModel.sendCallBanker(0);

        this._vsg.playClick();
    }
    /**抢庄 */
    private onQiangZhuang(): void {
        // UDebug.Log("onQiangZhuang");
        AppGame.ins.sgModel.sendCallBanker(1);
        this._vsg.playClick();

    }
    /**下注 */
    private onXiaZhu(event, customdata): void {
        UDebug.Log("customdata:" + customdata);
        AppGame.ins.sgModel.sendAddScore(customdata);
        this._vsg.playClick();
    }
    private onSeePai(event): void {
        // UDebug.Log("onSeePai");
        AppGame.ins.sgModel.sendOpenCard();
        this._vsg.playClick();

    }

    /**是否退出游戏 */
    private isExitGame(e: cc.Toggle) {
        UDebug.Log(e.isChecked)
        AppGame.ins.sgModel.sendNextExit(e.isChecked);
    }

    public onNextExit(data: any) {
        if (this._xjlcToggle.isChecked != data.bExit)
            this._xjlcToggle.isChecked = data.bExit;
    }


    /**
     * 进去自己的轮
     */
    intoSelfturn(operate: string, canBipai?: boolean): void {
        this._btnGoon.node.active = false;

        switch (operate) {
            case "call_banker":
                {
                    this.set_qz_node(true);
                    this.set_xz_node(false);
                    UAudioManager.ins.playSound("audio_qznn_ksqz");

                }

                break;
            case "xia_zhu":
                {
                    this.set_qz_node(false);
                    this.set_xz_node(true);
                    UAudioManager.ins.playSound("audio_qznn_ksxz");

                }

                break;
        }

        // if (auto) {
        // this._btnGenZhu.node.active = false;
        // this._addChips.setactive(false);
        // } else {
        // this._btnGenZhu.node.active = true;
        // this._addChips.setactive(true);
        // }
    }

    set_qz_node(b: boolean) {
        if (b) {
            if (AppGame.ins.sgModel.selfbettleInfo.playStatus != 1)
                return
        }

        this._qz_node.active = b;


    }

    set_xz_node(b: boolean) {
        if (b) {
            if (AppGame.ins.sgModel.selfbettleInfo.playStatus != 1)
                return
        }

        this._xz_node.active = b;

        if (b) {
            this.set_qz_node(false);
        }
    }

    set_seepai_node(b: boolean) {
        if (b) {
            if (AppGame.ins.sgModel.selfbettleInfo.playStatus != 1)

                //UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"audio_sg_qkp");
                return
        }

        // this._btn_seepai.node.active = b;

        if (b) {
            UAudioManager.ins.playSound("audio_qznn_qkp");
            this.set_qz_node(false);
            this.set_xz_node(false);
        }
    }

    /**
     * 进入其他人的轮
     */
    intoOtherTurn(auto: boolean): void {
        // this._addChips.setactive(false);

        // this._btnGenZhu.node.active = false;
        this._btnGoon.node.active = false;
    }

    // updateChip(chips: UISGOperate): void {
    //     this._genZhu.string = (chips.genzhu*SG_SCALE).toString();
    //     this._bipai.string = (chips.genzhu*SG_SCALE * 2).toString();
    // this._addChips.bind(chips.items);
    // }


    /**
     * 一局游戏结束 显示继续按钮
     */
    showMatch(): void {
        this._qz_node.active = false;
        this.removeAllXiaZhuBtns();
        this._xz_node.active = false;
        this.goonGame();
        // this._btnGoon.node.active = true;
        this.set_seepai_node(false);

    }
    /**隐藏所有 */
    hideall(): void {

        this._qz_node.active = false;
        this.removeAllXiaZhuBtns();
        this._xz_node.active = false;

        this._btnGoon.node.active = false;
        this.set_seepai_node(false);
    }

    onDestroy() {
        this._vsg = null;
    }

}
