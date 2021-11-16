import { ECommonUI } from "../../../common/base/UAllenum";
import VWindow from "../../../common/base/VWindow";
import UDebug from "../../../common/utility/UDebug";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UNodePool from "../../../common/utility/UNodePool";
import AppGame from "../../base/AppGame";
import { UIChargeOrderDetailItem, UIChargeOrderListDataItem } from "../charge/ChargeData";
import VChargeConstants from "../charge/chargeItem/VChargeConstants";
import VChargeOrderListItem from "../charge/chargeItem/VChargeOrderListItem";
import { UIExchargeRecordsItem } from "../exchange/ExchangeData";
import VExchargeRecordListItem from "../exchange/exchangeItem/VExchargeRecordListItem";
import VExchange from "../exchange/VExchange";
import MRole from "../lobby/MRole";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Vcustom_exchange_order_list extends VWindow {
    _scroll_content: cc.Node = null;
    _manager: VExchange;
    _scrollView: cc.ScrollView = null;
    _bottom_tip: cc.Node = null;
    _page: number = 0;
    _pageSize: number = 8;
    _pageIndex: number = 0;
    _orderListData: Array<UIExchargeRecordsItem> = []; 
    _index: number = 0;
    _item: cc.Node;
    private _pool: Array<VExchargeRecordListItem>;
    private _run: Array<VExchargeRecordListItem>;

    private getInstance(): VExchargeRecordListItem { 
        /*if (this._pool.length > 0) {
            var it = this._pool.shift();
            it.node.setParent(this._scroll_content);
            return it;
        }*/
        let ins = cc.instantiate(this._item);
        let item = ins.getComponent(VExchargeRecordListItem);
        if (!item) {
            item = ins.addComponent(VExchargeRecordListItem);
        }
        ins.setParent(this._scroll_content);
        item.init();
        return item;
    }

    /*private reclaimAll(): void {
        let len = this._run.length;
        for (let index = 0; index < len; index++) {
            let element = this._run[index];
            element.hide();
            element.node.parent = null;
            this._pool.push(element);
        }
        this._run = [];
    }*/
    init(): void {
        super.init();
        this._run = [];
        this._pool = [];
        this._scroll_content = UNodeHelper.find(this._root, "all/view/content");
        this._scrollView = UNodeHelper.find(this._root, "all").getComponent(cc.ScrollView);
        this._item = UNodeHelper.find(this._root, "all/view/content/item");
        this._bottom_tip = UNodeHelper.find(this._root, "bottom_tip");
        this._scrollView.node.on('scroll-ended', this.onRightScrollEnd, this);

    }
    // init(): void {
       
    // }
    /**
     * @param index 索引
     * @param payType 支付类型
     * @param manager Vcharge
     */
    // initItemInfo(manager: VExchange): void {
       
    //     this._pageIndex = 0;
    //     this._manager = manager;
    //     AppGame.ins.roleModel.requesetExchangeRecords();
    // }

    /**
     * 显示
     */
    show(data: any): void {
        super.show(data);
        AppGame.ins.roleModel.requesetExchangeRecords();
        // AppGame.ins.roleModel.on(MRole.UPDATE_OFFLINE_CREATE_ORDER, this.onCreateOrder, this);
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
            item.getComponent("VExchargeRecordListItem").initItemInfo(j, element, this);
            this._run.push(item);
        }
    }
    }

    // 暂无数据设置
    setNoneDataUI() {
        this._bottom_tip.opacity = 0;
        this._scroll_content.removeAllChildren()
        UNodePool.loadPrefabToParentNode(VChargeConstants.CHARGE_PREFAB_CHARGE_NONE_DATA, this._scroll_content); 
    }

    onclickCancelOrderBtn(index: number) {
        this._index = index;
        AppGame.ins.showUI(ECommonUI.CHARGE_CANCEL_CONFIRM_BOX);
    }

    // 监听获取兑换记录列表消息
    private update_exchange_list(isSuccess: boolean): void {
        if(isSuccess) {
            this._orderListData = AppGame.ins.roleModel.getExChargeRecords();
            if(this._orderListData.length > 0) {
                this._bottom_tip.opacity = 255;
                this._pageIndex = 0
                this.initRightItem();
            } else {
               this.setNoneDataUI();
            }
        } else {
            this.setNoneDataUI();
        }
    }

    private confirm_cancel_order(isSuccess: boolean): void {
        AppGame.ins.closeUI(ECommonUI.CHARGE_CANCEL_CONFIRM_BOX);
        if(isSuccess) { // 确认取消
            // 发送取消订单请求
            let item = this._orderListData[this._index]
            AppGame.ins.roleModel.requestCancelExchange(item.id,item.orderId, item.gold, item.type, item.status);
        } 
    }

    // 收到取消成功的消息之后 重新请求订单列表数据，然后刷新状态
    private reflesh_order_list(isSuccess: boolean, errMsg: string): void {
        if(isSuccess) { // 
            AppGame.ins.roleModel.requesetExchangeRecords();
        } else {
            AppGame.ins.showTips(errMsg); 
        }
    }

    // 后台兑换成功之后也要刷新订单列表
    private requestOrderList() {
        AppGame.ins.roleModel.requesetExchangeRecords();
    }

    protected onEnable(): void {
        AppGame.ins.roleModel.on(MRole.UPDATE_EXCHARGE_RECORDS, this.update_exchange_list, this);
        AppGame.ins.roleModel.on(MRole.CANCEL_EXCHANGE_ORDER, this.reflesh_order_list, this);
        AppGame.ins.roleModel.on(MRole.CHARGE_CANCEL_CONFIRM_BOX, this.confirm_cancel_order, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.requestOrderList, this);
    }

    protected onDisable(): void {
        AppGame.ins.roleModel.off(MRole.UPDATE_EXCHARGE_RECORDS, this.update_exchange_list, this);
        AppGame.ins.roleModel.off(MRole.CANCEL_EXCHANGE_ORDER, this.reflesh_order_list, this);
        AppGame.ins.roleModel.off(MRole.CHARGE_CANCEL_CONFIRM_BOX, this.confirm_cancel_order, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.requestOrderList, this);

    }
}
