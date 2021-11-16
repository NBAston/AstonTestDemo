import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import AppGame from "../../../public/base/AppGame";
import UNodeHelper from "../../../common/utility/UNodeHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VBrnnFeedBack extends VBaseUI {


    private _node_bg: cc.Node;
    private _node_mask: cc.Node;


    private _editbox: cc.EditBox;

    private _node_plac_lab: cc.Node;


    init(): void {
        this.node.zIndex = 200;

        this._node_bg = UNodeHelper.find(this.node, 'sp_bg');
        this._node_mask = UNodeHelper.find(this.node, 'sp_mask');
        this._node_plac_lab = UNodeHelper.find(this._node_bg, 'editbox/PLACEHOLDER_LABEL_COUSTOM');
        this._editbox = UNodeHelper.getComponent(this._node_bg, 'editbox', cc.EditBox);


    }

    onClickClose() {

        let ac = cc.scaleTo(0.2, 0.8, .8);
        ac.easing(cc.easeInOut(2.0));
        let ac2 = cc.fadeOut(0.2);

        let spa = cc.spawn(ac, ac2);

        this._node_mask.runAction(cc.fadeOut(0.1));
        this._node_bg.stopAllActions();
        this._node_bg.runAction(cc.sequence(spa, cc.callFunc(() => {
            AppGame.ins.closeUI(this.uiType);
        }, this)));
    }

    hide(handler?: UHandler) {
        this.node.active = false;
    }

    show(data: any): void {
        this.node.active = true;
        this._node_bg.opacity = 255;
        this._node_bg.scale = 0.01;
        let ac = cc.scaleTo(0.2, 1.1, 1.1);
        let ac2 = cc.scaleTo(0.1, 1, 1);
        let seq = cc.sequence(ac, ac2);
        ac.easing(cc.easeInOut(2.0));
        this._node_bg.runAction(seq);
        this._node_mask.opacity = 0.1;
        this._node_mask.runAction(cc.fadeTo(0.5, 120));
    }

    private onEditBegan() {

        this._node_plac_lab.active = false;
    }

    private onEditEnded() {


        if (this._editbox.string == '')
            this._node_plac_lab.active = true; 
        else
            this._node_plac_lab.active = false;


    }

    private onEditReturn() {
        if (this._editbox.string == '')
            this._node_plac_lab.active = true;
        else
            this._node_plac_lab.active = false;
    }

    // update (dt) {}
}
