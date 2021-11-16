import UDebug from "../../../../common/utility/UDebug";
import UEventHandler from "../../../../common/utility/UEventHandler";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import UStringHelper from "../../../../common/utility/UStringHelper";
import AppGame from "../../../base/AppGame";
import MRole, { CHARGE_SCALE } from "../../lobby/MRole";
import { UIChargeOffLineDataItem, UIChargeOnLineDataItem, UIChargeOnLineOrderItem } from "../ChargeData";
import VCharge from "../VCharge";
import VChargeConstants from "./VChargeConstants";
import VChargeMoneyItem from "./VChargeMoneyItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VChargeOnlineListDetailItem extends cc.Component {
    @property(cc.SpriteFrame)
    normalImg:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    inputImg:cc.SpriteFrame = null;
    _coin_label: cc.Label = null;
    _money_editBox: cc.EditBox = null;
    _scroll_content: cc.Node = null;
    _tip_lab: cc.Label = null;
    _manager: VCharge;
    _index: number;
    _payType: number;
    _money: number;// 选中的金额
    _moneyBtnArr: Array<VChargeMoneyItem> = [];
    _onLineItem: UIChargeOnLineDataItem;

    // onLoad () {}

    /**
     * @param index 索引
     * @param payType 支付类型
     * @param manager Vcharge
     */
    initItemInfo(index: number, onLineItem: UIChargeOnLineDataItem, manager: VCharge): void {
        var confirmChargeBtn = UNodeHelper.find(this.node, "confirm_charge_btn");
        var contactKefuBtn = UNodeHelper.find(this.node, "server_btn");
        var pre_one_btn = UNodeHelper.find(this.node, "pre_one_btn");
        var clearBtn = UNodeHelper.find(this.node, "btn_clear");
        this._scroll_content = UNodeHelper.find(this.node, "scrollview/view/content");
        // this._coin_label = UNodeHelper.find(this.node, "num_lab").getComponent(cc.Label);
        this._tip_lab = UNodeHelper.find(this.node, "tip_content/lab").getComponent(cc.Label);
        this._money_editBox = UNodeHelper.find(this.node, "num_edit").getComponent(cc.EditBox);
        UEventHandler.addClick(pre_one_btn, this.node, "VChargeOnlineListDetailItem", "onclickPrePageBtn");
        UEventHandler.addClick(confirmChargeBtn, this.node, "VChargeOnlineListDetailItem", "onclickConfirmCharge");
        UEventHandler.addClick(contactKefuBtn, this.node, "VChargeOnlineListDetailItem", "onclickContactKefu");
        UEventHandler.addClick(clearBtn, this.node, "VChargeOnlineListDetailItem", "clearMoney");
        let moneyArr = onLineItem.rechargeMoney.replace("[","").replace("]","").split(",");
        this._money_editBox.node.on('editing-did-began', this.editDidBegan, this);
        this._money_editBox.node.on('editing-did-ended', this.editDidEnded, this);  
        this.initScrollViewContent(moneyArr);
        this.updata_score(AppGame.ins.roleModel.getRoleGold());
        this._manager = manager;
        if(onLineItem.inputSw == 0) {
            this._money_editBox.enabled = false;
            this._money_editBox.placeholderLabel.string = "请选择以下固定充值金额";
            let arr: Array<string> = [];
            onLineItem.rechargeMoney.replace("[","").replace("]","").split(",").forEach(element => {
                element = parseFloat(element) * CHARGE_SCALE +"";
                arr.push(element);
            });
            this._tip_lab.string = "1. 固定充值金额为"+arr.join(",");
        } else {
            this._money_editBox.placeholderLabel.string = "请输入充值金额，限额"+onLineItem.minMoneyLimit+"~"+onLineItem.maxMoneyLimit;
            this._tip_lab.string = "1. 充值限额为"+onLineItem.minMoneyLimit+"~"+onLineItem.maxMoneyLimit;
        }
        
        this._onLineItem = onLineItem;
        this._index = index;
        this._payType = onLineItem.type;
    }

    start () {

    }
    editDidBegan(): void {
        this._money_editBox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.inputImg;
        this.setSelected(-1);
    }

    editDidEnded(): void {
        if(this.checkMoney()) {
        this._money_editBox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.normalImg;
    }
    }
    // 初始化滚动金币scrollview
    initScrollViewContent(moneyArr: Array<string>) {
        this._scroll_content.removeAllChildren();
        cc.loader.loadRes(VChargeConstants.CHARGE_PREFAB_CHARGE_MONEY_ITEM, (err, prefab) => {
            if (err != null) {
                UDebug.Log(err.message); 
                return;
            }
            if (prefab == null) {
                return;
            }
            if(moneyArr.length > 0) {
                for (let index = 0; index < moneyArr.length; index++) {
                    const element = moneyArr[index];                   
                    var item = cc.instantiate(prefab);
                    item.getComponent("VChargeMoneyItem").initItemInfo(index, element, this);
                    this._moneyBtnArr.push(item);
                    this._scroll_content.addChild(item);
                }
            }
        });  
    }

    // 确认充值
    onclickConfirmCharge() {
        if(this.checkMoney()) {
            // this._manager.onclickConfirmCharge(this._onLineItem.rechargeTypeId, this._money);
            AppGame.ins.roleModel.requestCreateOnlineOrder(this._onLineItem.rechargeTypeId, parseFloat(this._money_editBox.string));
        }
    }

    checkMoney(): boolean {

        if(UStringHelper.isEmptyString(this._money_editBox.string)) {
            if(this._onLineItem.inputSw == 0) {
                AppGame.ins.showTips("请选择固定充值金额"); 
            } else {
                AppGame.ins.showTips("请输入充值金额"); 
            }
            return false;
        }
        if(!UStringHelper.isFloat(this._money_editBox.string)) {
            AppGame.ins.showTips("充值金额请输入数字");
            this.clearMoney();   
            return false;
        }
        if(!UStringHelper.checkPointTwoData(this._money_editBox.string)) {
            AppGame.ins.showTips("充值金额最多只能输入两位小数");
            this.clearMoney();
            return false;
        }
        let orderAmount = parseFloat(this._money_editBox.string);
        if(parseFloat(this._money_editBox.string) < this._onLineItem.minMoneyLimit) {
            AppGame.ins.showTips("充值金额不能小于" + this._onLineItem.minMoneyLimit +"元"); 
            // this.clearMoney();
            this._money_editBox.string = this._onLineItem.minMoneyLimit+"";
            return false;
        }
        if(orderAmount > this._onLineItem.maxMoneyLimit) {
            AppGame.ins.showTips("充值金额不能大于" + this._onLineItem.maxMoneyLimit +"元"); 
            // this.clearMoney();
            this._money_editBox.string = this._onLineItem.maxMoneyLimit+"";
            return false;
        }
        return true;
    }

    // 联系客服
    onclickContactKefu() {
        this._manager.onclickContactKefu();
    }

     // 点击返回上一步按钮
     onclickPrePageBtn() {
        this._manager.onclickOnlinePrePageBtn();
    }

    // 点击对应的moneyItem
    onClickMoneyItem(tIndex: number, money: number, isClearSelect?: boolean) {
        this.setSelected(tIndex);
        if(!isClearSelect) {
            this._money_editBox.string = money+""; //+ "元";
        }
        this._money = money;
    }

    setSelected(tIndex: number) {
        let count = this._scroll_content.childrenCount;
        let moneyArr = this._scroll_content.children;
        if(count > 0) {
           for (let index = 0; index < count; index++) {
               const element = moneyArr[index];
               if(tIndex == index) {
                   UNodeHelper.find(element, "check_bg").active = true;
                   UNodeHelper.find(element, "label").color = new cc.Color(255, 255, 255);
               } else {
                   UNodeHelper.find(element, "check_bg").active = false;
                   UNodeHelper.find(element, "label").color = new cc.Color(164, 116, 51);
               } 
           }  
        }
    }
    // 清空充值金额
    clearMoney() {
        this._money_editBox.string = "";
        this.onClickMoneyItem(-1, 0, true);
        // this._money_editBox.focus();
    }

    private updata_score(score: number): void {
        // this._coin_label.string = UStringHelper.getMoneyFormat(score * CHARGE_SCALE, -1,false,true).toString();
    }

    // 创建订单成功之后的跳转
    private update_online_create_order(orderItem: UIChargeOnLineOrderItem, isSuccess: boolean, msg: string): void {
        if(isSuccess) {
            if(!UStringHelper.isEmptyString(orderItem.actionUrl)) {
                // cc.sys.openURL(orderItem.action);
                AppGame.ins.roleModel.requestOnlinePay(orderItem.actionUrl, orderItem.submitParam, orderItem.actionUrl2);
            }
        } else { 
            AppGame.ins.showTips(msg);
        }
    }

    // 监听用户金币改动消息
    protected onEnable(): void {
        AppGame.ins.roleModel.on(MRole.UPDATE_ONLINE_CREATE_ORDER, this.update_online_create_order, this);
    }

    protected onDisable(): void {
        AppGame.ins.roleModel.off(MRole.UPDATE_ONLINE_CREATE_ORDER, this.update_online_create_order, this);
    }

}
