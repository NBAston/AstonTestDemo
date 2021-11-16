import VWindow from "../../../common/base/VWindow";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UHandler from "../../../common/utility/UHandler";
import UEventListener from "../../../common/utility/UEventListener";
import UDebug from "../../../common/utility/UDebug";
import VChargeItem from "./VChargeItem";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame";
import { EAgentLevelReqType, ECommonUI, EUIPos } from "../../../common/base/UAllenum";
import ULanHelper from "../../../common/utility/ULanHelper";
import MRole, { CHARGE_SCALE } from "../lobby/MRole";
import UNodePool from "../../../common/utility/UNodePool";
import { UIChargeOffLineData, UIChargeOffLineDataItem, UIChargeOffLineOrderItem, UIChargeOnLineDataItem } from "./ChargeData";
import UStringHelper from "../../../common/utility/UStringHelper";
import VChargeConstants from "./chargeItem/VChargeConstants";
import { EventManager } from "../../../common/utility/EventManager";
import { EBtnType } from "../lb_service_mail/MailServiceData";
import cfg_event from "../../../config/cfg_event";
import MFriendsRoomCardModel from "../friends/friends_room_card/MFriendsRoomCardModel";
import MHall from "../lobby/MHall";
const { ccclass, property } = cc._decorator;

@ccclass
export default class VCharge extends VWindow {
    private _chargeBtns: Array<VChargeItem>;
    private _onlineChargeBtns: Array<VChargeItem>;
    _left_item: cc.Node[] = [];
    _online_btn: cc.Node = null;
    _offline_btn: cc.Node = null;
    _order_list_btn: cc.Node = null;
    _room_cards_btn: cc.Node = null;
    _proxy_btn: cc.Node = null;
    _online_list_content: cc.Node = null;
    _offline_list_content: cc.Node = null;
    _goldlabel: cc.Label = null;
    _roomCardlabel: cc.Label = null;
    _index: number = -1;

    @property(cc.ScrollView) onlineScrollView: cc.ScrollView = null;
    @property(cc.ScrollView) offlineScrollView: cc.ScrollView = null;
    private _top_right_menu: cc.Node = null;
    private _charge_list_node: cc.Node = null; // 线下充值列表内容节点
    private _charge_list_detail_node: cc.Node = null; // 线下支付列表详情节点
    private _online_charge_list_node: cc.Node = null; // 线上支付列表内容节点
    private _online_charge_list_detail_node: cc.Node = null; // 线上支付列表详情节点
    private charge_list_detail_check_node: cc.Node = null; // 线下支付订单详情界面
    private _order_list_node: cc.Node = null; // 线下充值订单列表内容节点
    private _offline_content: cc.Node = null;
    private _online_content: cc.Node = null;
    private _order_list_content: cc.Node = null; // 订单列表内容节点
    private _vcharge_list_item: cc.Node = null; // 线下充值 列表预制体
    private _vcharge_order_list: cc.Node = null; // 订单列表
    private _exchange_room_cards_content: cc.Node = null; // 房卡节点
    private _room_cards_scroll_content: cc.Node = null; // 房卡scroll滚动内容节点
    private _none_data: cc.Node = null; // 暂无数据
    private _back: cc.Node = null;
    private _title: cc.Label = null;
    private _close_btn_1: cc.Node = null;
    private _close_btn_2: cc.Node = null;
    private _top_bg: cc.Node = null;
    private _mask_bg: cc.Node = null;
    private _mask_bg_content: cc.Node = null;
    private _transfer: cc.Node;
    _root_scale: number = 0.1;
    _title_Arr: string[] = [];
    private _game_watch_limit_score: number = 3000;
    init(): void {
        super.init();
        this._chargeBtns = [];
        this._onlineChargeBtns = [];
        this._title_Arr = ["在线充值","线下充值","代理商城","金币换房卡","订单列表"];
        this._title = UNodeHelper.find(this._root, "title").getComponent(cc.Label);
        this._mask_bg_content = UNodeHelper.find(this._root, "mask_bg");
        this._goldlabel = UNodeHelper.find(this._root, "top_right_menu/user_gold/gold_num").getComponent(cc.Label);
        this._roomCardlabel = UNodeHelper.find(this._root, "top_right_menu/user_room_card/gold_num").getComponent(cc.Label);
        this._close_btn_1 = UNodeHelper.find(this._root, "btn_close");
        this._close_btn_2 = UNodeHelper.find(this._root, "top_right_menu/btn_close_2");
        this._transfer = UNodeHelper.find(this._root, "top_right_menu/btn_transfer");
        this._top_bg = UNodeHelper.find(this._root, "top_bg");
        UEventHandler.addClick(this._close_btn_2, this.node, "VCharge", "closeUI");

        this._online_btn = UNodeHelper.find(this._root, "mask_bg/content/left_bg/online_btn");
        this._offline_btn = UNodeHelper.find(this._root, "mask_bg/content/left_bg/offline_btn");
        this._order_list_btn = UNodeHelper.find(this._root, "mask_bg/content/left_bg/order_list_btn");
        this._proxy_btn = UNodeHelper.find(this._root, "mask_bg/content/left_bg/proxy_room_cards_btn");
        this._room_cards_btn = UNodeHelper.find(this._root, "mask_bg/content/left_bg/exchange_room_cards_btn");
        this._left_item.push(this._online_btn);
        this._left_item.push(this._offline_btn);
        this._left_item.push(this._proxy_btn);
        this._left_item.push(this._room_cards_btn);
        this._left_item.push(this._order_list_btn);

        // for (let index = 0; index < this._left_item.length; index++) {
        //     UEventHandler.addClick(this._left_item[index], this.node, "VCharge", "onClickLeftMenuBtn", index);
        // }

        // 线下支付
        this._offline_content = UNodeHelper.find(this._root, "mask_bg/content/offline_content");
        this._charge_list_node = UNodeHelper.find(this._root, "mask_bg/content/offline_content/charge_list");
        this._charge_list_detail_node = UNodeHelper.find(this._root, "mask_bg/content/offline_content/charge_list_detail");
        this.charge_list_detail_check_node = UNodeHelper.find(this._root, "mask_bg/content/offline_content/charge_list_detail_check");
        this._offline_list_content = UNodeHelper.find(this._root, "mask_bg/content/offline_content/charge_list/scrollview/view/content");
        // 线上支付
        this._online_content = UNodeHelper.find(this._root, "mask_bg/content/online_content");
        this._online_charge_list_node = UNodeHelper.find(this._root, "mask_bg/content/online_content/charge_list");
        this._online_charge_list_detail_node = UNodeHelper.find(this._root, "mask_bg/content/online_content/charge_list_detail");
        this._online_list_content = UNodeHelper.find(this._root, "mask_bg/content/online_content/charge_list/scrollview/view/content");
        
        // 兑换房卡
        this._exchange_room_cards_content = UNodeHelper.find(this._root, "mask_bg/content/room_cards_content");
        this._room_cards_scroll_content = UNodeHelper.find(this._root, "mask_bg/content/room_cards_content/scrollview/view/content");

        // 订单
        this._order_list_node = UNodeHelper.find(this._root, "mask_bg/content/order_list");
        this._order_list_content = UNodeHelper.find(this._root, "mask_bg/content/order_list_content");

        this._top_right_menu = UNodeHelper.find(this._root, "top_right_menu");
        var btn = UNodeHelper.find(this._root, "mask_bg/content/btn_bg/btn_b_mid");

        this._vcharge_list_item = UNodeHelper.find(this._root, "vcharge_list_item");
        this._vcharge_order_list = UNodeHelper.find(this._root, "charge_order_list");
        this._none_data = UNodeHelper.find(this._root, "none_data");
        UEventHandler.addClick(btn, this.node, "VCharge", "onopenchargerecords")
        this._back = UNodeHelper.find(this.node, "back");
        this._mask_bg = UNodeHelper.find(this._root, "bg");
        UEventHandler.addClick(this._back, this.node, "VCharge", "closeUI");

    }
    /**
    * 显示
    */
    show(data: any): void {
        this.requestAgentLevel();
        if(data && data.hasOwnProperty('isFullScreen') && data.isFullScreen) {
            this._top_right_menu.getComponent(cc.Widget).enabled = true;
            this._mask_bg_content.getComponent(cc.Widget).enabled = true;
            this._title.node.getComponent(cc.Widget).enabled = true;
            this._root_scale = 1;
            this._mask_bg.active = false;
            this._close_btn_2.active = false;
            this._top_bg.active = true;
            this._close_btn_1.active = true;
            this._back.color = cc.color(255,255,255);
            this._back.opacity = 255;
        } else {
            this.node.setContentSize(1280,720);
            this._top_right_menu.getComponent(cc.Widget).enabled = false;
            this._top_right_menu.setPosition(298.3,315.6);
            this._mask_bg_content.getComponent(cc.Widget).enabled = false;
            this._title.node.getComponent(cc.Widget).enabled = false;
            this._mask_bg_content.setContentSize(1250,620);
            this._mask_bg_content.setPosition(0,-38.464);
            this._close_btn_2.setPosition(289,0.92);
            this._title.node.x = -590;
            this._root_scale = 0.8;
            this._mask_bg.active = true;
            this._close_btn_2.active = true;
            this._top_bg.active = false;
            this._close_btn_1.active = false;
            this._back.color = cc.color(0,0,0);
            this._back.opacity = 120;
        }
        
        super.show(data);
        this.update_score(AppGame.ins.roleModel.getRoleGold());
        this.update_room_card(AppGame.ins.roleModel.getRoomCard());
        if (data && data.hasOwnProperty('index')) {
            this.onClickLeftMenuBtn(null, data.index);
        } else {
            this.onClickLeftMenuBtn(null, 0, true);
        }
    }

    /**房卡充值 */
    private requestAgentLevel() {
        AppGame.ins.hallModel.requestAgentLevel(EAgentLevelReqType.recharge);
    }

    
    onChargeRoomCard() {
        if(this._left_item[2].active) {
            this.onClickLeftMenuBtn(null, 2);
        } else {
            this.onClickLeftMenuBtn(null, 3);
        }
    }

     //转帐
     private onTransfer() {
        AppGame.ins.showUI(ECommonUI.UI_TRANSFER);
        this.playclick();
    }

    /**获取到代理等级 */ 
    onAgentLevelRes(data: any) {
        if(AppGame.ins.hallModel.reqAgentLevelType != EAgentLevelReqType.recharge) return;
        if(!data || data.retCode != 0 || !data.hasOwnProperty('level')) {
            this._transfer.active = false;
            this._left_item[2].active = false;
            return ;
        }
        if(data.level >= 5) {
            this._left_item[2].active = true;
            this._transfer.active = true;
            this._left_item[2].getChildByName("img_redpoint").active = cc.sys.localStorage.getItem("AGENT_SHOP_HED_ICON") == 1?false:true ;
        } else {
            this._left_item[2].active = false;
            this._transfer.active = false;

        }
    }

    private onClickLeftMenuBtn(event: any, index: number, noPlayClick?: boolean): void {
        if (this._index == index) {
            return;
        }
        if (!noPlayClick) {
            super.playclick();
        }
        this.setBtnSelectedInfo(index);
        this._index = index;
        // this._right_content.removeAllChildren();
        // AppGame.ins.showConnect(true);
        this._title.string = "商城·" +this._title_Arr[index > 4?0:index];
        if (index == 0) { // 在线充值
            this.setChargeNodeActive(this._online_content, true);
            this.setChargeNodeActive(this._online_charge_list_node, true);
            this.setChargeNodeActive(this._exchange_room_cards_content, false);
            this.setChargeNodeActive(this._online_charge_list_detail_node, false);
            this.setChargeNodeActive(this._offline_content, false);
            this.setChargeNodeActive(this._order_list_content, false);
            this.setChargeNodeActive(this.charge_list_detail_check_node, false);
            AppGame.ins.roleModel.requestOnlineChargeList();
        } else if (index == 1) {// 线下充值
            this.setChargeNodeActive(this._order_list_content, false);
            this.setChargeNodeActive(this._offline_content, true);
            this.setChargeNodeActive(this._online_content, false);
            this.setChargeNodeActive(this._charge_list_node, true);
            this.setChargeNodeActive(this._exchange_room_cards_content, false);
            this.setChargeNodeActive(this._charge_list_detail_node, false);
            this.setChargeNodeActive(this.charge_list_detail_check_node, false);
            AppGame.ins.roleModel.requestOffLineChargeList();
        } else if (index == 2 || index == 3) { // 2 代理商城 3金币换房卡
            if(index == 2 && cc.sys.localStorage.getItem('AGENT_SHOP_HED_ICON') != 1) {
                cc.sys.localStorage.setItem('AGENT_SHOP_HED_ICON', 1);
                this._left_item[2].getChildByName("img_redpoint").active = false;
            }
            this.setChargeNodeActive(this._exchange_room_cards_content, true);
            this.setChargeNodeActive(this._order_list_content, false);
            this.setChargeNodeActive(this._offline_content, false);
            this.setChargeNodeActive(this._online_content, false);
            AppGame.ins.friendsRoomCardModel.requestGetRoomCardList(index == 2?false:true);
        } else if (index == 4) { // 订单列表
            this.setChargeNodeActive(this._order_list_content, true);
            this.setChargeNodeActive(this._exchange_room_cards_content, false);
            this.setChargeNodeActive(this._offline_content, false);
            this.setChargeNodeActive(this._online_content, false);
            AppGame.ins.roleModel.requestOrderList();

        }
    }

    private initOrderListUI(): void {
        this._order_list_content.destroyAllChildren();
        let item = cc.instantiate(this._vcharge_order_list);
        item.getComponent("VChargeOrderList").initItemInfo(this);
        item.setParent(this._order_list_content);
        /* UNodePool.loadPrefabToParentNode(VChargeConstants.CHARGE_PREFAB_CHARGE_ORDER_LIST, this._order_list_content,
             UHandler.create((item: cc.Node) => {
                 item.getComponent("VChargeOrderList").initItemInfo(0,this);
                 })); */
    }

    // 线上支付UI 初始化
    private initOnLineChargeListUI(): void {
        this._online_list_content.removeAllChildren();
        let onLineData = AppGame.ins.roleModel.getOnLineChargeData().datas;
        UDebug.Log("onlineData = " + onLineData);
        if (onLineData.length > 0) {
            for (let index = 0; index < onLineData.length; index++) {
                this.scheduleOnce(()=>{
                    let onLineItem = onLineData[index];
                    UNodePool.loadPrefabToParentNode(VChargeConstants.CHARGE_PREFAB_CHARGE_LIST_ITEM, this._online_list_content,
                        UHandler.create((item: cc.Node) => {
                            item.getComponent("VChargeListItem").initOnLineItemInfo(index, onLineItem, this, 1);
                        }));
                        this.onlineScrollView.scrollToTop();
                },0.05)
                } 
               
        } else {
            UNodePool.loadPrefabToParentNode(VChargeConstants.CHARGE_PREFAB_CHARGE_NONE_DATA2, this._online_list_content,
                UHandler.create((item: cc.Node) => {
                }));
        }

    }

    // 线下支付UI 初始化
    private initOffLineChargeListUI(): void {
        this._offline_list_content.removeAllChildren();
        let offLineData = AppGame.ins.roleModel.getOffLineChargeData().datas;
        if (offLineData.length > 0) {
            for (let index = 0; index < offLineData.length; index++) {
                this.scheduleOnce(()=>{
                    let offLineItem = offLineData[index];
                    let item = cc.instantiate(this._vcharge_list_item);
                    item.getComponent("VChargeListItem").initItemInfo(index, offLineItem, this, 2);
                    item.setParent(this._offline_list_content);
                    this.offlineScrollView.scrollToTop();
                },0.05)
            }
        } else {
            let item = cc.instantiate(this._none_data);
            item.active = true;
            item.setParent(this._offline_list_content);
        }
    }

    // 点击线上支付Item
    onClickOnLineItem(index: number, onLineItem: UIChargeOnLineDataItem): void {
        // 隐藏线下支付列表支付节点
        this.setChargeNodeActive(this._online_charge_list_node, false);
        this.setChargeNodeActive(this._online_charge_list_detail_node, true);
        this._online_charge_list_detail_node.destroyAllChildren();
        if (onLineItem.type == 20 || onLineItem.type == 5) { // 假设为对应的USDT类型

        } else { // 非USDT类型
            UNodePool.loadPrefabToParentNode(VChargeConstants.CHARGE_PREFAB_ONLINE_CHARGE_BANK_ONE, this._online_charge_list_detail_node,
                UHandler.create((item: cc.Node) => {
                    item.getComponent("VChargeOnlineListDetailItem").initItemInfo(index, onLineItem, this);
                }));
        }
    }

    // 点击线下支付Item
    onClickOffLineItem(index: number, offLineItem: UIChargeOffLineDataItem): void {
        // 隐藏线下支付列表支付节点
        this.setChargeNodeActive(this._charge_list_node, false);
        this.setChargeNodeActive(this._charge_list_detail_node, true);
        this._charge_list_detail_node.destroyAllChildren();
        if (offLineItem.type == 5) { // 假设为对应的USDT类型
            UNodePool.loadPrefabToParentNode(VChargeConstants.CHARGE_PREFAB_CHARGE_USDT_ONE, this._charge_list_detail_node,
                UHandler.create((item: cc.Node) => {
                    item.getComponent("VChargeListUsdtDetailItem").initItemInfo(index, offLineItem, this);
                }));
        } else { // 非USDT类型
            UNodePool.loadPrefabToParentNode(VChargeConstants.CHARGE_PREFAB_CHARGE_BANK_ONE, this._charge_list_detail_node,
                UHandler.create((item: cc.Node) => {
                    item.getComponent("VChargeListDetailItem").initItemInfo(index, offLineItem, this);
                }));
        }
    }

    // 点击创建订单按钮
    onclickCreateOrder(rechargeTypeId: number, requestMoney: number): void {
        AppGame.ins.roleModel.requestCreateOffLineChargeOrder(rechargeTypeId, requestMoney, false, 1);
    }

    // 确认充值按钮
    onclickConfirmCharge(rechargeTypeId: number, requestMoney: number): void {
        // AppGame.ins.roleModel.requestCreateOffLineChargeOrder(rechargeTypeId, requestMoney);
    }

    // 创建订单回调函数
    private create_offline_charge_order(orderItem: UIChargeOffLineOrderItem, isSuccess: boolean, errMsg: string, isUsdt: boolean): void {
        if (isSuccess) { // 创建订单成功
            if (!isUsdt) {
                this.setChargeNodeActive(this._charge_list_detail_node, false);
                this.setChargeNodeActive(this.charge_list_detail_check_node, true);
                this.charge_list_detail_check_node.destroyAllChildren();
                UNodePool.loadPrefabToParentNode(VChargeConstants.CHARGE_PREFAB_CHARGE_ORDER_DETAIL, this.charge_list_detail_check_node,
                    UHandler.create((item: cc.Node) => {
                        item.getComponent("VChargeOrderDetailItem").initItemInfo(orderItem, this);
                    }));
            }
        } else {
            if (!isUsdt) {
                AppGame.ins.showTips(errMsg);
            }
        }
    }

    // 取消订单
    onclickCancelOrder(orderId: string): void {
        AppGame.ins.roleModel.requestCancelOffLineChargeOrder(orderId, false);
        UDebug.log("取消订单界面按钮");
    }

    // 我已转账
    onclickHadChargeBtn(): void {
        UDebug.log("我已转账---");

    }

    onclickContactKefu(): void {
        AppGame.ins.showUI(ECommonUI.LB_Service_Mail, { type: EBtnType.service, data: "" });
    }

    // 返回上一步
    onclickPrePageBtn(): void {
        this.setChargeNodeActive(this._charge_list_node, true);
        this.setChargeNodeActive(this._charge_list_detail_node, false);
    }

    onclickOnlinePrePageBtn(): void {
        this.setChargeNodeActive(this._online_charge_list_node, true);
        this.setChargeNodeActive(this._online_charge_list_detail_node, false);
    }

    // 设置节点Active属性
    setChargeNodeActive(iNode: cc.Node, isActive: boolean): void {
        iNode.active = isActive;
    }

    private setBtnSelectedInfo(index: number): void {
        let len = this._left_item.length;
        for (let i = 0; i < len; i++) {
            let element = this._left_item[i];
            if (index == i) {
                UNodeHelper.find(element, "checkmark").active = true;
                var color2 = new cc.Color(255, 255, 255);
                UNodeHelper.find(element, "title").color = color2;
            } else {
                UNodeHelper.find(element, "checkmark").active = false;
                var color2 = new cc.Color(164, 116, 51);
                UNodeHelper.find(element, "title").color = color2;
            }
        }
    }

    private onopenchargerecords(): void {
        AppGame.ins.showUI(ECommonUI.LB_ChargeRecords);
    }

    // 绑定用户名
    private bind_username(): void {
        AppGame.ins.showUI(ECommonUI.EXCHANGE_BIND_USERNAME);

    }

    // 设置用户真实姓名的回调消息监听
    private set_user_true_name(isSuccess: boolean, errMsg: string): void {
        AppGame.ins.closeUI(ECommonUI.EXCHANGE_BIND_USERNAME);
        if (isSuccess) {
            // 已经绑定了用户真实姓名 从新去请求线上支付列表的数据
            AppGame.ins.roleModel.requestOnlineChargeList();
        } else {
            AppGame.ins.showTips(errMsg);
        }

    }

    // 线上支付充值列表监听
    private update_online_charge(): void {
        this.initOnLineChargeListUI();
    }

    // 线下支付充值列表监听
    private update_offline_charge(): void {
        this.initOffLineChargeListUI();
    }

    // 订单列表列表监听
    private update_order_list(): void {
        this.initOrderListUI();
    }

    // 取消订单成功监听
    private cancel_offline_charge_order(isSuccess: boolean, errMsg: string, ifRefleshOrder: boolean): void {
        if (isSuccess && !ifRefleshOrder) {// 取消成功
            AppGame.ins.showTips("取消订单成功");
            this._index = 0;
            this.onClickLeftMenuBtn(null, 1);
        }
    }

    private on_charge(sucess: boolean, msg: string): void {
        if (sucess) {
            cc.sys.openURL(msg);
            this.unscheduleAllCallbacks();
            this.scheduleOnce(() => {
                AppGame.ins.showConnect(false);
                AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                    type: 1, data: ULanHelper.CHARGE_DELAY_TIP, handler: UHandler.create((a) => {

                    }, this)
                })
            }, 5);
        } else {
            AppGame.ins.showConnect(false);
            AppGame.ins.showTips(msg);
        }
    }

    private friend_room_card_gold_no_enough(): void {
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 3, data: `您的金币不足,是否充值?`, handler: UHandler.create((a) => {
                if (a) {
                    this.onClickLeftMenuBtn(null, 0, false);
                }
            }, this)
        });
    }

    /**
     * 点击线下支付item事件
     * @param index 线下支付索引值 
     * @param payType 支付类型备选参数
     */
    private clickLeftOffLineItem(index: number, payType: number): void {
        // UDebug.log("------->点击了第"+index+"个按钮"+" payType=="+payType);
    }

    /**
     * 线下支付按钮点击事件
     */
    private offline_btnClick(): void {
        // UDebug.log("111111111111111111111111");
        // this._offline_paylistNode.active = !this._offline_paylistNode.active;
    }

    /**
     * 线上支付按钮点击事件
     */
    private online_btnClick(): void {
        // this._online_paylistNode.active = !this._online_paylistNode.active;
    }

    private update_score(score: number): void {
        this._goldlabel.string = UStringHelper.getMoneyFormat(score * CHARGE_SCALE, -1, false, true).toString();
    }

    private update_room_card(roomCard: number): void {
        this._roomCardlabel.string = UStringHelper.getMoneyFormat(roomCard * CHARGE_SCALE, -1, false, true).toString();
    }

    /**
     * 设置点击事件
     */
    private onsetting(): void {
        AppGame.ins.showUI(ECommonUI.LB_Setting);
        this.playclick();
    }
    protected onEnable(): void {
        AppGame.ins.showConnect(false);
        this.unscheduleAllCallbacks();
        AppGame.ins.roleModel.requestUpdateScore();
        AppGame.ins.roleModel.on(MRole.UPDATE_OFFLINE_CHARGE, this.update_offline_charge, this);
        AppGame.ins.roleModel.on(MRole.UPDATE_ONLINE_CHARGE, this.update_online_charge, this);
        AppGame.ins.roleModel.on(MRole.BIND_USERNAME, this.bind_username, this);
        AppGame.ins.roleModel.on(MRole.SET_USER_TRUE_NAME, this.set_user_true_name, this);
        AppGame.ins.roleModel.on(MRole.UPDATE_OFFLINE_CREATE_ORDER, this.create_offline_charge_order, this);
        AppGame.ins.roleModel.on(MRole.UPDATE_OFFLINE_CANCEL_ORDER, this.cancel_offline_charge_order, this);
        AppGame.ins.roleModel.on(MRole.UPDATE_OFFLINE_ORDER_LIST, this.update_order_list, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.update_score, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_ROOM_CARD, this.update_room_card, this);
        AppGame.ins.roleModel.on(MRole.ON_CHARGE, this.on_charge, this);
        AppGame.ins.friendsRoomCardModel.on(MFriendsRoomCardModel.FRIEND_ROOM_CARD_GOLD_NO_ENOUGH, this.friend_room_card_gold_no_enough, this);
        AppGame.ins.hallModel.on(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);
    }
    protected onDisable(): void {
        this._index = -1;// 
        AppGame.ins.roleModel.off(MRole.UPDATE_OFFLINE_CHARGE, this.update_offline_charge, this);
        AppGame.ins.roleModel.off(MRole.UPDATE_ONLINE_CHARGE, this.update_online_charge, this);
        AppGame.ins.roleModel.off(MRole.BIND_USERNAME, this.bind_username, this);
        AppGame.ins.roleModel.off(MRole.SET_USER_TRUE_NAME, this.set_user_true_name, this);
        AppGame.ins.roleModel.off(MRole.UPDATE_OFFLINE_CREATE_ORDER, this.create_offline_charge_order, this);
        AppGame.ins.roleModel.off(MRole.UPDATE_OFFLINE_CANCEL_ORDER, this.cancel_offline_charge_order, this);
        AppGame.ins.roleModel.off(MRole.UPDATE_OFFLINE_ORDER_LIST, this.update_order_list, this);
        AppGame.ins.roleModel.off(MRole.UPDATA_SCORE, this.update_score, this);
        AppGame.ins.roleModel.off(MRole.UPDATA_ROOM_CARD, this.update_room_card, this);
        AppGame.ins.roleModel.off(MRole.ON_CHARGE, this.on_charge, this);
        AppGame.ins.friendsRoomCardModel.off(MFriendsRoomCardModel.FRIEND_ROOM_CARD_GOLD_NO_ENOUGH, this.friend_room_card_gold_no_enough, this);
        AppGame.ins.hallModel.off(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);

    }
    private hideall(): void {
        for (const key in this._chargeBtns) {
            if (this._chargeBtns.hasOwnProperty(key)) {
                const element = this._chargeBtns[key];
                // element.bind(null);
            }
        }
    }

    closeUI() {
        super.playclick();
        super.clickClose();
    }

    hide(handler?: UHandler): void {
        super.hide();
        // if(AppGame.ins.roleModel.score >= this._game_watch_limit_score){
        EventManager.getInstance().raiseEvent(cfg_event.CLOSE_CHARGE);
        // }

        // AppGame.ins.checkEnterMinScore(AppGame.ins.game_watch_limit_score + 1);
    }

     /**关闭的动画 */
     protected closeAnimation(completHandler?: UHandler): void {
        let ac = cc.scaleTo(0.1, 0.1, 0.1);
        // ac.easing(cc.easeBackIn());
        this._root.runAction(cc.sequence(ac, cc.callFunc(() => {
            if (completHandler) completHandler.run();
        }, this)));

    }
    /**显示的动画 */
    protected showAnimation(completHandler?: UHandler): void {
        this._root.setScale(0.1, 0.1);
        let ac = cc.scaleTo(0.1, this._root_scale, this._root_scale);
        // ac.easing(cc.easeBackInOut());
        this._root.runAction(cc.sequence(ac, cc.callFunc(() => {
            if (completHandler) completHandler.run();
        }, this)));
    }
}
