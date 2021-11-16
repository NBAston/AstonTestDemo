import { ECommonUI, EGameType } from "../../common/base/UAllenum";
import VWindow from "../../common/base/VWindow";
import UDebug from "../../common/utility/UDebug";
import AppGame from "../base/AppGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VMiPai extends VWindow {

    @property(cc.Prefab) pokerPfb: cc.Prefab = null;
    @property([cc.Node]) openCardNodes: cc.Node[] = [];
    @property(cc.Label) timeLbl: cc.Label = null;

    private _poker: cc.Node = null;
    private _openCardFunc: any = null;
    private _autoCloseTime: number = 0;
    private _autoCloseTimerId: any = null;
    private _openCardNode: cc.Node = null;

    show(data: any) {
        super.show(data);
        UDebug.log('show => ', data)
        this._openCardFunc = data.openCardFunc;
        this._autoCloseTime = data.autoCloseTime;

        if (this._poker) {
            this._poker.destroy();
            this._poker = null;
        }

        this._poker = cc.instantiate(this.pokerPfb);
        data.openedCallback = this.openedCallback.bind(this);
        this._poker.getComponent('MiPai').initPoker(data);
        this._poker.parent = this._root;

        this._openCardNode.active = true;
        this._openCardNode.zIndex = 20;
        this._poker.zIndex = 10;

        this.setAutoClose();
    }

    onEnable() {
        switch (AppGame.ins.currGameId) {
            case EGameType.KPQZNN:
            case EGameType.KPQZNN_HY:
                this._openCardNode = this.openCardNodes[0];
                break;
            case EGameType.SG:
                this._openCardNode = this.openCardNodes[1];
                break;
            default:
                this._openCardNode = this.openCardNodes[0];
                break;
        }
        this.openCardNodes.forEach(node => {
            node.active = false;
        });
    }

    onDisable() {
        if (this._autoCloseTimerId) {
            clearInterval(this._autoCloseTimerId);
        }
    }

    /**设置自动关闭 */
    setAutoClose() {
        this.timeLbl.string = '剩余' + this._autoCloseTime + '秒';
        this._autoCloseTimerId = setInterval(() => {
            this._autoCloseTime--;
            this._autoCloseTime = this._autoCloseTime <= 0 ? 0 : this._autoCloseTime;
            this.timeLbl.string = '剩余' + this._autoCloseTime + '秒';
            if (this._autoCloseTime <= 0) {
                AppGame.ins.closeUI(ECommonUI.UI_GAME_MIPAI);
            }
        }, 1000);
    }

    /**打开牌回调 */
    openedCallback() {
        this._openCardFunc = null;
        if (this._autoCloseTimerId) {
            clearInterval(this._autoCloseTimerId);
            this.openCardNodes.forEach(node => {
                node.active = false;
            });
        }
    }

    onClickOpenCard() {
        this.playclick();
        if (this._openCardFunc) {
            AppGame.ins.closeUI(ECommonUI.UI_GAME_MIPAI);
            this._openCardFunc();
        }
    }

    clickClose() {
        
    }

}
