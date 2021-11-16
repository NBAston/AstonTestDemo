import { ECommonUI } from "../../../common/base/UAllenum";
import VWindow from "../../../common/base/VWindow";
import UDebug from "../../../common/utility/UDebug";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import { UIChargeOrderDetailItem, UIChargeOrderListDataItem } from "../charge/ChargeData";
import VChargeConstants from "../charge/chargeItem/VChargeConstants";
import VChargeOrderListItem from "../charge/chargeItem/VChargeOrderListItem";
import MRole from "../lobby/MRole";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Vcustom_charge_order_list extends VWindow {
    _scroll_content: cc.Node = null;
    _scrollView: cc.ScrollView = null;
    _bottom_tip: cc.Node = null;
    _page: number = 0;
    _pageSize: number = 8;
    _pageIndex: number = 0;
    _orderListData: Array<UIChargeOrderListDataItem> = [];
    _item: cc.Node;
    _index: number = 0;
    _isShowKefu: boolean = true;
    private _pool: Array<VChargeOrderListItem>;
    private _run: Array<VChargeOrderListItem>;

    init(): void {
        super.init();


    }

    private getInstance(): VChargeOrderListItem { 
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
    initItemInfo(): void {
        this._run = [];
        this._pool = [];
        this._scroll_content = UNodeHelper.find(this._root, "all/view/content");
        this._scrollView = UNodeHelper.find(this._root, "all").getComponent(cc.ScrollView);
        this._item = UNodeHelper.find(this._root, "item");
        this._bottom_tip = UNodeHelper.find(this._root, "bottom_tip");
        this._scrollView.node.on('scroll-ended', this.onRightScrollEnd, this);
        this._pageIndex = 0;
        this.node.active = true;
        this._orderListData = AppGame.ins.roleModel.getOrderListData().datas;
        if(this._orderListData.length > 0) {
            this._bottom_tip.opacity = 255;
            this.initRightItem();
        } else {
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
    }
     /**
     * 显示
     */
    show(data: any): void {
        super.show(data);
        AppGame.ins.roleModel.requestOrderList();
        // AppGame.ins.roleModel.on(MRole.UPDATE_OFFLINE_CREATE_ORDER, this.onCreateOrder, this);
    }

    private update_order_list(success: boolean): void {
        if(success) {
            this.initItemInfo();
        }
    }

    // 点击订单详情
    onclickOrderDetail(orderId: string, payType: number): void { 
        AppGame.ins.roleModel.requestChargeOrderDetailInfo(orderId, payType); 
    }

    onclickContactKefu(): void {

    }

     // 更新订单详情
     private update_order_detail_info(success: boolean, orderItem: UIChargeOrderDetailItem, msg: string): void {
        if(success) {
            let data = {"manager": this, "orderItem": orderItem, "isShowKefu":false};
            if(this.uiType == ECommonUI.UI_CHARGE_ORDER_DETAIL_BOX ) {
                AppGame.ins.closeUI(ECommonUI.UI_CHARGE_ORDER_DETAIL_BOX);
            }
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
        AppGame.ins.roleModel.on(MRole.UPDATE_OFFLINE_CANCEL_ORDER, this.reflesh_order_list, this);
        AppGame.ins.roleModel.on(MRole.UPDATE_OFFLINE_ORDER_LIST, this.update_order_list, this);
        AppGame.ins.roleModel.on(MRole.UPDATE_ORDER_DETAIL_INFO, this.update_order_detail_info, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.requestOrderList, this);
        AppGame.ins.roleModel.on(MRole.COMFIRM_ORDER_INFO, this.comfirm_order_info, this);
    }

    protected onDisable(): void {
        AppGame.ins.roleModel.off(MRole.UPDATE_OFFLINE_CANCEL_ORDER, this.reflesh_order_list, this);
        AppGame.ins.roleModel.off(MRole.UPDATE_OFFLINE_ORDER_LIST, this.update_order_list, this);
        AppGame.ins.roleModel.off(MRole.UPDATE_ORDER_DETAIL_INFO, this.update_order_detail_info, this);
        AppGame.ins.roleModel.off(MRole.UPDATA_SCORE, this.requestOrderList, this);
        AppGame.ins.roleModel.off(MRole.COMFIRM_ORDER_INFO, this.comfirm_order_info, this);
    }

    // update (dt) {}
}
