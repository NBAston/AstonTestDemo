import VWindow from "../../../common/base/VWindow";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import VVipItem from "./VVipItem";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";
import UEventHandler from "../../../common/utility/UEventHandler";
import { ECommonUI } from "../../../common/base/UAllenum";
import ULanHelper from "../../../common/utility/ULanHelper";
import UHandler from "../../../common/utility/UHandler";
import  {UVipData, UVipitemData}  from "./VipData";
import UDebug from "../../../common/utility/UDebug";



const { ccclass, property } = cc._decorator;

@ccclass
export default class VVip extends VWindow {
    private _vipnomaxNode: cc.Node;
    private _btnLfet: cc.Node;
    private _btnRight: cc.Node;
    private _vipNow: cc.Sprite;
    private _vipNext: cc.Sprite;
    private _vipprocess: cc.Label;
    private _chargeTip: cc.Label;
    private _process: cc.Sprite;
    private _chargeTipNode: cc.Node;
    private _btncharge: cc.Node;
    private _back:cc.Node;
    /**
    * 头像预制
    */
    private _prefab: cc.Node;
    /**
     * 根对象
     */
    private _parent: cc.Node;

    private _pool: Array<VVipItem>;
    /**
     * 
     */
    private _run: Array<VVipItem>;

    private _view: cc.PageView;

    private _showIdx: number;
    private _totalCount: number;

    private _chagreRMB: cc.Label;

    private getInstance(): VVipItem {
        if (this._pool.length > 0) {
            var it = this._pool.shift();
            //    it.node.setParent(this._parent);
            this._view.addPage(it.node);
            return it;
        }
        let ins = cc.instantiate(this._prefab);
        let item = ins.getComponent(VVipItem);
        if (!item) {
            item = ins.addComponent(VVipItem);
        }
        //  ins.setParent(this._parent);
        item.init();
        this._view.addPage(ins);
        return item;
    }
    private reclaimAll(): void {
        let len = this._run.length;
        for (let index = 0; index < len; index++) {
            let element = this._run[index];
            element.hide();
            this._pool.push(element);
        }
        this._view.removeAllPages();
        this._run = [];
    }
    init(): void {
        super.init();
        this._pool = [];
        this._run = [];
        this._showIdx = 0;
        this._totalCount = 0;
        this._back = UNodeHelper.find(this.node,"back");
        
        this._vipnomaxNode = UNodeHelper.find(this._root, "nomaxnode");

        this._vipNow = UNodeHelper.getComponent(this._root, "nomaxnode/vip_icon_now", cc.Sprite);
        this._vipNext = UNodeHelper.getComponent(this._root, "nomaxnode/vip_icon_next", cc.Sprite);
        this._vipprocess = UNodeHelper.getComponent(this._root, "nomaxnode/process", cc.Label);
        this._chargeTip = UNodeHelper.getComponent(this._root, "tip/lab",cc.Label);
        
        this._process = UNodeHelper.getComponent(this._root, "nomaxnode/vip_title_progress", cc.Sprite);
        this._prefab = UNodeHelper.find(this._root, "item");
        this._parent = UNodeHelper.find(this._root, "bar/view/content");
        this._chargeTipNode = UNodeHelper.find(this._root, "tip");
        this._view = UNodeHelper.getComponent(this._root, "bar", cc.PageView);

        this._btncharge = UNodeHelper.find(this._root, "vip_btn_charge");
        this._btnLfet = UNodeHelper.find(this._root, "vip_btn_left");
        this._btnRight = UNodeHelper.find(this._root, "vip_btn_right");
        UEventHandler.addClick(this._btncharge, this.node, "VVip", "onopencharge");
        UEventHandler.addClick(this._btnLfet, this.node, "VVip", "onscrollLeft");
        UEventHandler.addClick(this._btnRight, this.node, "VVip", "onscrollRight");
        UEventHandler.addpageEvents(this._view.node, this.node, "VVip", "onpageView");
        UEventHandler.addClick(this._back,this.node,"VVip","closeUI");
    }

    closeUI(){
        super.playclick();
        super.clickClose();
    }

    private onpageView(): void {
        this._showIdx = this._view.getCurrentPageIndex();
        this.refreshArrowBtn();
    }

    private onscrollRight(): void {
        super.playclick();
        var lp = this._showIdx + 1;
        if (lp < this._totalCount) {
            this._showIdx = lp;
            this.scrollTo(0.3);
            this._view.setCurrentPageIndex(this._showIdx)   
        }
    }

    private onscrollLeft(): void {
        super.playclick();
        var lp = this._showIdx - 1;
        if (lp >= 0) {
            this._showIdx = lp;
            this.scrollTo(0.3);
            this._view.setCurrentPageIndex(this._showIdx)
        }
    }

    private onopencharge(): void {
        super.playclick();
        if (!AppGame.ins.roleModel.bindMobile) {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 3, data: ULanHelper.NO_BIND_PHONE, handler: UHandler.create((a) => {
                    if (a) {
                        AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true, index: 0 });
                    } else {
                        AppGame.ins.showUI(ECommonUI.LB_Regester);
                    }
                }, this)
            });

        } else {
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true, index: 0 });
        }
        this.clickClose();
    }
    /**
   * 显示
   */ 
    show(data: any): void {
        super.show(data);
        var dt = AppGame.ins.roleModel.getVipData();
        this._showIdx = dt.vipLv;
         
        this._totalCount = dt.items.length;
        if(!dt.items[dt.vipLv] || dt.exp - dt.items[dt.vipLv].chargeNum > 0) {
            this._chargeTipNode.active = false;
            this._btncharge.active = false;
        } else {
            this._chargeTipNode.active = true;
            this._btncharge.active = true;
        }
        if (dt.max <= 0) {
            this._vipnomaxNode.active = false;
            this._showIdx = dt.vipLv - 1;
        } else {
            this._vipnomaxNode.active = true;
            var resPath = "common/hall/texture/vip/vip" + dt.vipLv.toString()
            cc.loader.loadRes(resPath, cc.SpriteFrame, function (error, res){
                if (error == null) {
                    this._vipNow.spriteFrame = res;
                } else {
                    UDebug.Log(error);
                }
            }.bind(this));
        
            resPath = "common/hall/texture/vip/vip" + (dt.vipLv + 1).toString()
            cc.loader.loadRes(resPath, cc.SpriteFrame, function (error, res){
                if (error == null) {
                    this._vipNext.spriteFrame = res;
                } else {
                    UDebug.Log(error);
                }
            }.bind(this));

            this._vipprocess.string = dt.exp/100 + "/" + dt.max/100;
            var pr = (dt.exp / dt.max);
            if (pr > 1)
                pr = 1;
            else if (pr < 0)
                pr = 0;
            this._process.fillRange = pr;
            this._chargeTip.string = "累计充值" + dt.exp/100 +"元，再充值" + dt.needChargeNum/100 + "元即可升级为尊贵的VIP" + (dt.vipLv + 1)
            // 背景自适应
            var numberCount = (dt.exp/100).toString().length + (dt.needChargeNum/100).toString().length
            this._chargeTipNode.width = 340 + numberCount * 10
        }

        this.reclaimAll();
        dt.items.forEach(element => {
            var item = this.getInstance();
            item.bind(element);
            this._run.push(item);
        });
        this.scrollTo(0);
        this._view.setCurrentPageIndex(this._showIdx)
        
    }
    private scrollTo(time: number): void {
        this.refreshArrowBtn();
        this._view.scrollToPercentHorizontal(this._showIdx / (this._totalCount - 1), time);
    }
    private refreshArrowBtn(): void {
        var showLeft = true;
        var showright = true;
        if (this._showIdx == 0) {
            showLeft = false;
            showright = true;
        } else if (this._showIdx == this._totalCount - 1) {
            showLeft = true;
            showright = false;
        } else {
            showLeft = true;
            showright = true;
        }
        this._btnLfet.active = showLeft;
        this._btnRight.active = showright;
    }

}
