import UNodeHelper from "../../common/utility/UNodeHelper";
import UResManager from "../../common/base/UResManager";
import { EIconType } from "../../common/base/UAllenum";
import BrhhAnimation from "./BrhhAnimation";
import { HongHei } from "../../common/cmd/proto";
import USpriteFrames from "../../common/base/USpriteFrames";
import cfg_brhh from "./cfg_brhh";
import UDebug from "../../common/utility/UDebug";




const GoldRate = 100;  //


export default class BrhhLuDan {

    private _node_root: cc.Node = null;

    private _node_ludan: cc.Node = null;

    private _sp_frames: USpriteFrames = null;

    private _node_ludan_type: cc.Node = null;  // 牌型路单

    private _sp_type_nodes: cc.Node[] = [];

    private _sp_nodes: cc.Node[] = [];

    private _userid: number = 0;

    constructor(root: cc.Node) {

        this._node_root = root;
        this.init();
    }


    get userid() {
        return this._userid;
    }

    get position() {
        return this._node_root.position;
    }

    init() {

        this._node_ludan = UNodeHelper.find(this._node_root, 'layout_ludan');
        this._node_ludan_type = UNodeHelper.find(this._node_root, 'layout_ludan2');

        this._sp_frames = UNodeHelper.getComponent(this._node_root, '', USpriteFrames);

        for (let i = 0; i < this._node_ludan.children.length; i++) {
            this._sp_nodes[i] = this._node_ludan.children[i];
        }

        for (let i = 0; i < this._node_ludan_type.children.length; i++) {
            this._sp_type_nodes[i] = this._node_ludan_type.children[i];
        }

    }


    /**
     * 设置座面路单
     * @param winTag 
     * @param isblink 最新的一个是否闪烁
     */
    setLuDan(winTag: Array<HongHei.IHongHeiGameRecord>, isblink: boolean = false) {

        let max_count = 20;  // 最多显示个数

        let temp_data = JSON.parse(JSON.stringify(winTag));

        while (temp_data.length > (max_count)) {
            temp_data.shift();
        }


        let last_node = null;
        this._node_ludan.removeAllChildren();
        var node_index1 = this._node_root.getChildByName('sp_1');
        for (let i = 0; i < temp_data.length; i++) {
            let node = cc.instantiate(node_index1);
            node.parent = this._node_ludan;
            // let node = this._sp_nodes[i];
            if (temp_data[i]) {
                node.active = true;
                last_node = node;

                if (temp_data[i].winArea == HongHei.JET_AREA.RED_AREA) {
                    UNodeHelper.getComponent(node, '', cc.Sprite).spriteFrame = this._sp_frames.getFrames('hhdz_list_hong1');
                }else if (temp_data[i].winArea == HongHei.JET_AREA.BLACK_AREA) {
                    UNodeHelper.getComponent(node, '', cc.Sprite).spriteFrame = this._sp_frames.getFrames('hhdz_list_hei1');
                }
                  
            } else {
                node.active = false;
            }
        }

        if (last_node && isblink){
            last_node.runAction(cc.blink(4, 4));
            last_node.opacity = 255;
        }
            




        max_count = 9;   // 牌型路单
        while (temp_data.length > max_count) {
            temp_data.shift();
        }


        let last_node2 = null;
        this._node_ludan_type.removeAllChildren();
        var node_index = this._node_root.getChildByName('sp_2');
        for (let i = 0; i <temp_data.length; i++) {
            let node = cc.instantiate(node_index);
            node.parent = this._node_ludan_type;
            if (temp_data[i]) {
                node.active = true;
                last_node2 = node;
                
                UNodeHelper.getComponent(node, '', cc.Sprite).spriteFrame = this._sp_frames.getFrames('hhdz_list_3');
                if (temp_data[i].cardGroupType == 1) {
                    UNodeHelper.getComponent(node, '', cc.Sprite).spriteFrame = this._sp_frames.getFrames('hhdz_list_2');
                } else if (temp_data[i].cardGroupType == 0) {
                    UNodeHelper.getComponent(node, '', cc.Sprite).spriteFrame = this._sp_frames.getFrames('hhdz_list_1');
                }
                
                UDebug.Info(cfg_brhh);
                UDebug.Info(cfg_brhh.label);
                UDebug.Info(temp_data[i].cardGroupType);
                let sp_lab = UNodeHelper.getComponent(node , 'sp_lab' , cc.Sprite);
                if (temp_data[i].cardGroupType >= 0 && temp_data[i].cardGroupType <= 5)
                    sp_lab.spriteFrame = this._sp_frames.getFrames(cfg_brhh.label[temp_data[i].cardGroupType]);
            } else {
                node.active = false;
            }
        }

        if (last_node2 && isblink){
            last_node2.runAction(cc.blink(4, 4));
            last_node2.opacity = 255;
        }
            







        //     let isMove = false;  // 是否需要移动

        //     if (temp_data.length > max_count) {
        //         isMove = true;
        //     }

        //     while (temp_data.length > (max_count + 2)) {
        //         temp_data.shift();
        //     }

        //     this._node_ludan.removeAllChildren();

        //     var node_index = this._sp_index.node;
        //     var last_node = null;

        //     for (let index = 0; index < temp_data.length; index++) {
        //         var node = cc.instantiate(node_index);
        //         node.parent = this._node_ludan;
        //         var flag = temp_data[index];
        //         if (flag) {
        //             node.active = true;
        //             node.getComponent(cc.Sprite).spriteFrame = this._spf_ludan[flag];
        //             last_node = node;
        //         } else {
        //             node.active = false;
        //         }
        //     }

        //     if (isMove) {
        //         this._node_ludan.x = -(temp_data.length - (max_count + 1)) * 42.5 - 441;
        //     }

        //     if (isblink && last_node) {
        //         if (!isMove) {
        //             last_node.runAction(cc.blink(3, 4));
        //         } else {

        //             last_node.opacity = 0;
        //             this._node_ludan.stopAllActions();
        //             this._node_ludan.runAction(cc.sequence(cc.moveBy(0.5, -42.5, 0), cc.delayTime(1), cc.callFunc(() => {
        //                 last_node.opacity = 255;
        //                 last_node.runAction(cc.blink(3, 4));
        //             })));
        //         }
        //     } else if (isMove) {
        //         this._node_ludan.x = -(temp_data.length - max_count) * 42.5 - 441;
        //     }
    }

}
