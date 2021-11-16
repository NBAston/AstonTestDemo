import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../../public/base/AppGame";

/**
 * 创建：朱武
 * 作用：查看玩家在百人龙虎的输赢记录
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class VBrbjlRecords extends VBaseUI {

    private _node_bg: cc.Node;
    
    private _node_mask: cc.Node;

    private _content: cc.Node;
    

    init(): void {
        this.node.zIndex = 200;

        this._node_bg = UNodeHelper.find(this.node , 'sp_bg');    
        this._node_mask = UNodeHelper.find(this.node, 'sp_mask');
        this._content = UNodeHelper.find(this._node_bg , 'scrollview/view/content');

    } 


    onClickClose() {

        let ac = cc.scaleTo(0.2, 0.8, .8);
        ac.easing(cc.easeInOut(2.0));
        let ac2 = cc.fadeOut(0.2);

        let spa = cc.spawn(ac , ac2);

        this._node_mask.runAction(cc.fadeOut(0.1));
        this._node_bg.stopAllActions();
        this._node_bg.runAction(cc.sequence(spa, cc.callFunc(() => {
            AppGame.ins.closeUI(this.uiType);
        }, this)));
    }


    hide(handler?: UHandler) {
        this.node.active = false;
    }

    show(data:any): void {
        this.node.active = true;
        this._node_bg.opacity = 255;
        this._node_bg.scale = 0.01;
        let ac = cc.scaleTo(0.2, 1.1, 1.1);
        let ac2 = cc.scaleTo(0.1,1,1);
        let seq = cc.sequence(ac,ac2);
        ac.easing(cc.easeInOut(2.0));
        this._node_bg.runAction(seq);
        
        this._node_mask.opacity = 0.1;
        this._node_mask.runAction(cc.fadeTo(0.5,120));

        data = {
            [1]: 11,
            [2]: 22,
            [3]: 33,
        }

        this.refreshData(data);
    }


    private refreshData(data:any) {
        for (let i=1; i<=10; i++) {
            var item = UNodeHelper.find(this._content , 'item'+i);
            if (data[i])
                item.active = true;
            else
                item.active = false;
        }
    }



    
    // update (dt) {}
}
