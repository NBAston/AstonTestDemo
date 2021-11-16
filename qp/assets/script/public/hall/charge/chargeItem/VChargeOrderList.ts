import { ECommonUI } from "../../../../common/base/UAllenum";
import UDebug from "../../../../common/utility/UDebug";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import AppGame from "../../../base/AppGame";
import ErrorLogUtil, { LogLevelType } from "../../../errorlog/ErrorLogUtil";
import MRole from "../../lobby/MRole";
import { UIChargeOffLineOrderItem, UIChargeOrderDetailItem, UIChargeOrderListDataItem } from "../ChargeData";
import VCharge from "../VCharge";
import VChargeConstants from "./VChargeConstants";
import VChargeOrderListItem from "./VChargeOrderListItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VChargeOrderList extends cc.Component {

    _scroll_content: cc.Node = null;
    _manager: VCharge;
    _scrollView: cc.ScrollView = null;
    _bottom_tip: cc.Node = null;
    _page: number = 0;
    _pageSize: number = 8;
    _pageIndex: number = 0;
    _orderListData: Array<UIChargeOrderListDataItem> = [];
    _item: cc.Node;
    _index: number = 0;
    private _pool: Array<VChargeOrderListItem>;
    private _run: Array<VChargeOrderListItem>;
    // onLoad () {}

    private getInstance(): VChargeOrderListItem { 
        /*if (this._pool.length > 0) {
            var it = this._pool.shift();
            it.node.setParent(this._scroll_content);
            return it;
        }*/
        let ins = cc.instantiate(this._item);
        let item = ins.getComponent(VChargeOrderListItem);
        if (!item) {
            item = ins.addComponent(VChargeOrderListItem);
        }
        ins.setParent(this._scroll_content);
        item.init();
        return item;
    }
    /**
     * @param index 索引
     * @param payType 支付类型
     * @param manager Vcharge
     */
    initItemInfo(manager: VCharge): void {
        this._run = [];
        this._pool = [];
        this._scroll_content = UNodeHelper.find(this.node, "all/view/content");
        this._scrollView = UNodeHelper.find(this.node, "all").getComponent(cc.ScrollView);
        this._item = UNodeHelper.find(this.node, "item");
        this._bottom_tip = UNodeHelper.find(this.node, "bottom_tip");
        this._scrollView.node.on('scroll-ended', this.onRightScrollEnd, this);
        this._pageIndex = 0;
        this._manager = manager;
        this.node.active = true;
        this._orderListData = AppGame.ins.roleModel.getOrderListData().datas;
        if(this._orderListData.length > 0) {
            this._bottom_tip.opacity = 255;
            this.initRightItem();
        } else {
            var str = '充值订单列表数据长度length = 0';
            ErrorLogUtil.ins.addErrorLog(str, LogLevelType.INFO); 
            this._bottom_tip.opacity = 0;
            this._scroll_content.removeAllChildren()
            cc.loader.loadRes(VChargeConstants.CHARGE_PREFAB_CHARGE_NONE_DATA, (err, prefab) => {
                if (err != null) {
                    UDebug.Log(err.message); 
                    return;
                }
                if (prefab == null) {
                    return;
                }
                let item = null;              
                item = cc.instantiate(prefab);
                this._scroll_content.addChild(item);          
            });  
        }
    }

    // 滑动的监听
    onRightScrollEnd() {
        let maxoffset = this._scrollView.getMaxScrollOffset();
        let offset = this._scrollView.getScrollOffset();
        if(Math.abs(maxoffset.y) -  Math.abs(offset.y) <= 100  && this._scroll_content.childrenCount > 7){
            this.initRightItem();
        }
    }

    // 初始化scrollView
    initRightItem() {
        if(this._pageIndex == 0) {
            this._scroll_content.removeAllChildren()
            this._page = 0;
            this._pageIndex = -1;
        } else {
            this._page += 1;
        }

        if((this._page * this._pageSize) >= this._orderListData.length){
            //没有更多元素了
            return;
        }

        if(this._orderListData.length > 0) {
            for (var j = (this._page * this._pageSize);j < this._orderListData.length && j < ((this._page + 1) * this._pageSize); j++) {
                const element = this._orderListData[j];   
                var item = this.getInstance();
                item.show();
                item.getComponent("VChargeOrderListItem").initItemInfo(j, element, this);
                this._run.push(item);
            }
        }

        /*cc.loader.loadRes(VChargeConstants.CHARGE_PREFAB_CHARGE_ORDER_LIST_ITEM, (err, prefab) => {
            if (err != null) {
                UDebug.Log(err.message); 
                return; 
            }
            if (prefab == null) {
                return;
            }
            let item = null;
            if(this._orderListData.length > 0) {
                for (var j = (this._page * this._pageSize);j < this._orderListData.length && j < ((this._page + 1) * this._pageSize); j++) {
                    const element = this._orderListData[j];                   
                    item = cc.instantiate(prefab);
                    item.getComponent("VChargeOrderListItem").initItemInfo(j, element, this._manager)
                    this._scroll_content.addChild(item);
                }
            }
        });  */

    }

    onclickCancelOrderBtn(index: number) {
        this._index = index;
        AppGame.ins.showUI(ECommonUI.CHARGE_CANCEL_CONFIRM_BOX);
    }

    // 点击订单详情
    onclickOrderDetail(orderId: string, payType: number) {
        AppGame.ins.roleModel.requestChargeOrderDetailInfo(orderId, payType); 
    }

    // 更新订单详情
    private update_order_detail_info(success: boolean, orderItem: UIChargeOrderDetailItem, msg: string): void {
        if(success) {
            let data = {"manager": this._manager, "orderItem": orderItem, "isShowKefu":true};
            AppGame.ins.showUI(ECommonUI.UI_CHARGE_ORDER_DETAIL_BOX, data); 
        } else {
            AppGame.ins.showTips(msg);
        }
        UDebug.log("订单详情消息成功");
    }

    private confirm_cancel_order(isSuccess: boolean): void {
        AppGame.ins.closeUI(ECommonUI.CHARGE_CANCEL_CONFIRM_BOX);
        if(isSuccess) { // 确认取消
            // 发送取消订单请求
            let item = this._orderListData[this._index]
            AppGame.ins.roleModel.requestCancelOffLineChargeOrder(item.orderId, true);
        } 
    }

    // 收到取消成功的消息之后 重新请求订单列表数据，然后刷新状态
    private reflesh_order_list(isSuccess: boolean, errMsg: string, isReflseshOrder: boolean): void {
        AppGame.ins.showTips(errMsg);
        if(isSuccess) { // 
            AppGame.ins.roleModel.requestOrderList();
        }
    }

    // 后台充值成功之后也要刷新订单列表
    private requestOrderList() {
        AppGame.ins.roleModel.requestOrderList();
    }

    // 已支付确认
    private comfirm_order_info(success: boolean, msg: string) {
        AppGame.ins.showTips(msg);
        if(success) {
            this.requestOrderList();
        }
    }

    protected onEnable(): void {
        // AppGame.ins.roleModel.on(MRole.CHARGE_CANCEL_CONFIRM_BOX, this.confirm_cancel_order, this);
        AppGame.ins.roleModel.on(MRole.UPDATE_OFFLINE_CANCEL_ORDER, this.reflesh_order_list, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.requestOrderList, this);
        AppGame.ins.roleModel.on(MRole.UPDATE_ORDER_DETAIL_INFO, this.update_order_detail_info, this);
        AppGame.ins.roleModel.on(MRole.COMFIRM_ORDER_INFO, this.comfirm_order_info, this);
    }

    protected onDisable(): void {
        // AppGame.ins.roleModel.off(MRole.CHARGE_CANCEL_CONFIRM_BOX, this.confirm_cancel_order, this);
        AppGame.ins.roleModel.off(MRole.UPDATE_OFFLINE_CANCEL_ORDER, this.reflesh_order_list, this);
        AppGame.ins.roleModel.off(MRole.UPDATA_SCORE, this.requestOrderList, this);
        AppGame.ins.roleModel.off(MRole.UPDATE_ORDER_DETAIL_INFO, this.update_order_detail_info, this);
        AppGame.ins.roleModel.off(MRole.COMFIRM_ORDER_INFO, this.comfirm_order_info, this);
    }
}
