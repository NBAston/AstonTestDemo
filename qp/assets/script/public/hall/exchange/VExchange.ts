import VWindow from "../../../common/base/VWindow";
import UIExchangeData from "./ExchangeData";
import AppGame from "../../base/AppGame";
import UImgBtn from "../../../common/utility/UImgBtn";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UStringHelper from "../../../common/utility/UStringHelper";
import ULanHelper from "../../../common/utility/ULanHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import UHandler from "../../../common/utility/UHandler";
import { ECommonUI } from "../../../common/base/UAllenum";
import MRole, { CHARGE_SCALE } from "../lobby/MRole";
import { ZJH_SCALE } from "../../../game/zjh/MZJH";
import UDebug from "../../../common/utility/UDebug";
import VChargeConstants from "../charge/chargeItem/VChargeConstants";
import UNodePool from "../../../common/utility/UNodePool";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VExchange extends VWindow {


    _left_item: cc.Node[] = [];
    _bank_btn: cc.Node = null;
    _alipay_btn: cc.Node = null;
    _wechat_btn: cc.Node = null;
    _usdt_btn: cc.Node = null;
    _exchange_btn: cc.Node = null;
    _right_content: cc.Node = null; 
    _goldlabel: cc.Label = null;
    _setting_btn: cc.Node = null;
    _index: number = 1;
    _exchangeArr: Array<number> = [0,0,0]; // 分别代表 银行卡， 支付宝,usdt
	private _back:cc.Node;

    init(): void {
        super.init();

        this._bank_btn = UNodeHelper.find(this._root, "mask_bg/content/left_bg/bank_btn");
        this._alipay_btn = UNodeHelper.find(this._root, "mask_bg/content/left_bg/alipay_btn");
        this._wechat_btn = UNodeHelper.find(this._root, "mask_bg/content/left_bg/wechat_btn");
        this._usdt_btn = UNodeHelper.find(this._root, "mask_bg/content/left_bg/usdt_btn");
        this._exchange_btn = UNodeHelper.find(this._root, "mask_bg/content/left_bg/exchange_btn");
        this._right_content = UNodeHelper.find(this._root, "mask_bg/content/right_content");
        this._setting_btn = UNodeHelper.find(this._root, "top_right_menu/setting_btn");
        this._goldlabel = UNodeHelper.find(this._root, "top_right_menu/user_gold/gold_num").getComponent(cc.Label);
        this._left_item.push(this._bank_btn);
        this._left_item.push(this._alipay_btn);
        this._left_item.push(this._wechat_btn);
        this._left_item.push(this._usdt_btn);
        this._left_item.push(this._exchange_btn);

        for(let index = 0; index < this._left_item.length; index++) {
            UEventHandler.addClick(this._left_item[index], this.node, "VExchange", "onClickLeftMenuBtn", index);
        }
        UEventHandler.addClick(this._setting_btn, this.node, "VExchange", "onsetting");
        this._back = UNodeHelper.find(this.node,"back");
        UEventHandler.addClick(this._back,this.node,"VExchange","closeUI");
    }


    /**点击左边按钮菜单 */
    onClickLeftMenuBtn(event:any, index: number, noPlayClick?:boolean): void {
        if(this._index == index) {
            return;
        }
        if(!noPlayClick) {
            super.playclick();
        }
        this._index = index;
        this._right_content.removeAllChildren();
        this.setBtnSelectedInfo(index);
        if(index == 0) {
            // UDebug.log("银行卡兑换");
            UNodePool.loadPrefabToParentNode(VChargeConstants.CHARGE_PREFAB_EXCHANGE_BANK_CARD, this._right_content,
                UHandler.create((node: cc.Node) => {
                  node.getComponent("VExchargeBankCard").initItemInfo(0, 1, this);
                }));
        } else if(index == 1) {
            // UDebug.log("支付宝兑换");
            UNodePool.loadPrefabToParentNode(VChargeConstants.CHARGE_PREFAB_EXCHANGE_ALIPAY, this._right_content,
                UHandler.create((node: cc.Node) => {
                    node.getComponent("VExchargeAlipay").initItemInfo(0, 1, this);
                  }));
        } else if(index == 2) {
            // UDebug.log("微信兑换");

        } else if(index == 3) {
            UNodePool.loadPrefabToParentNode(VChargeConstants.CHARGE_PREFAB_EXCHANGE_USDT, this._right_content,
                UHandler.create((node: cc.Node) => {
                  node.getComponent("VExchargeUsdt").initItemInfo(0, 1, this);
                }));     
        } else if(index == 4) {
            UNodePool.loadPrefabToParentNode(VChargeConstants.CHARGE_PREFAB_EXCHANGE_RECORD, this._right_content,
                UHandler.create((node: cc.Node) => {
                  node.getComponent("VExchargeRecordList").init();
                  node.getComponent("VExchargeRecordList").initItemInfo(0, 1, this);
                }));
        }
    }

    /**设置按钮选中信息 */
    private setBtnSelectedInfo(index: number): void {
        for (let i = 0; i < this._left_item.length; i++) {
            let element = this._left_item[i];
            if(index == i) {
                UNodeHelper.find(element, "checkmark").active = true;
                var color2 = new cc.Color(255, 255, 255);
                UNodeHelper.find(element,"title").color = color2;
            } else {
                UNodeHelper.find(element, "checkmark").active = false;
                var color2 = new cc.Color(164, 116, 51);
                UNodeHelper.find(element,"title").color = color2;
            }
        }
    }

     /**
     * 设置点击事件
     */
    private onsetting(): void {
        AppGame.ins.showUI(ECommonUI.LB_Setting);
        this.playclick();
    }

    /**
     * 显示
     */
    show(data: any): void {
        super.show(data);
        this.update_score(AppGame.ins.roleModel.getRoleGold());
        AppGame.ins.roleModel.requestExchangeScoreToRMBLimitMessage();
        AppGame.ins.roleModel.requestExchangeList();
        // this.onClickLeftMenuBtn(null, 0, true);
        // this.bind();
        // this.showali(false);
    }

    private update_exchange_list(issuccess: boolean, data: Array<number>): void {
        if(issuccess) {
            console.log("支付列表数据------"+JSON.stringify(data.toString()));
            if(data.length > 0) {
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    if(element == 1) {
                        this._exchangeArr[0] = 1;
                    } else if(element == 2) {
                        this._exchangeArr[1] = 2;
                    } else if(element == 5) {
                        this._exchangeArr[2] = 5;
                    }
                }
            }

            this._left_item[0].active = this._exchangeArr[0] != 0?true:false;
            this._left_item[1].active = this._exchangeArr[1] != 0?true:false;
            this._left_item[3].active = this._exchangeArr[2] != 0?true:false;

            if(this._exchangeArr[0] == 0) {
                if(this._exchangeArr[1] == 0) {
                    if(this._exchangeArr[2] == 0) {
                        this.onClickLeftMenuBtn(null, 4, true); // 订单列表
                    } else {
                        this.onClickLeftMenuBtn(null, 3, true); // USDT
                    }
                } else {
                    this.onClickLeftMenuBtn(null, 1, true); // 支付宝
                }
            } else {
                this.onClickLeftMenuBtn(null, 0, true); // 银行卡
            }
            
        }
    }
    
    private update_score(score: number): void {
        this._goldlabel.string = UStringHelper.getMoneyFormat(score * CHARGE_SCALE, -1,false,true).toString();
    }

    closeUI(){
        super.playclick();
        super.clickClose();
    }

protected onEnable(): void {
    // AppGame.ins.showConnect(false);
    AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.update_score, this);
    AppGame.ins.roleModel.on(MRole.EXCHANGE_REQUEST_LIST, this.update_exchange_list, this);

}
protected onDisable(): void {
    this._exchangeArr = [0,0,0];
    AppGame.ins.roleModel.off(MRole.EXCHANGE_REQUEST_LIST, this.update_exchange_list, this);
}

}
