import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import VWindow from "../../../common/base/VWindow";
import VServiceItem from "./Vlb_service_item";
import UEventHandler from "../../../common/utility/UEventHandler";
import { Service_type, Vlb_service_data } from "./Vlb_service_data";
import Vlb_left_select from "./Vlb_left_select";
import AppGame from "../../base/AppGame";
import UDebug from "../../../common/utility/UDebug";

const { ccclass, property } = cc._decorator;
/**
 *创建:sq
 *作用:邮件和客服中心
 */

@ccclass
export default class Vlb_service extends Vlb_left_select {
    private _prefab: cc.Node;
    private _parent: cc.Node;
    private _btn_mail: cc.Node;
    private _btn_deposit: cc.Node;
    private _btn_exchange: cc.Node;
    private _btn_activity: cc.Node;
    private _btn_service: cc.Node;
    private _content_mail: cc.Node;
    private _content_service: cc.Node;
    private _charge_service_list : Array<Object>; 
    private _activity_service_list : Array<Object>; 
    private _exchange_service_list : Array<Object>; 
    private _kefu_service_list : Array<Object>; 
    private _service_type : number; 
    private _isLogin: boolean;
    public set kefu_service_list(v : Array<Object>) {
        this._kefu_service_list = v;
    }
    _left_item: cc.Node[] = [];
    _service_top_item: cc.Node[] = [];
    _service_data : [Vlb_service_data];
    //云信
    _key = "49KdgB8_9=12+3hF"; //16位
    _iv = [0, 0, 0 , 0 , 0 ,0 , 0 ,0 , 0 , 0 ,0 ,0 ,0, 0, 0, 0]
    _userName = "service_300_1";
    _pwd = "quantest123";
    // _pwd = "123456";
    _login = "F01A02";

    /**
     * 初始化 UI创建的时候调用
     */
    init(): void {
        super.init();
 
        this._charge_service_list = [];
        this._activity_service_list = [];
        this._exchange_service_list = [];
        this._prefab = UNodeHelper.find(this.node.parent.parent, "service/scrollview/item");
        this._parent = UNodeHelper.find(this.node.parent.parent, "service/scrollview/view/content");

        this._btn_deposit = UNodeHelper.find(this.node.parent.parent, "service/topbar/deposit");
        this._btn_exchange = UNodeHelper.find(this.node.parent.parent, "service/topbar/exchange");
        this._btn_activity = UNodeHelper.find(this.node.parent.parent, "service/topbar/activity");
        this._service_type = Service_type.service_charge;
        this._service_top_item.push(this._btn_deposit)
        this._service_top_item.push(this._btn_exchange)
        this._service_top_item.push(this._btn_activity)
        this._isLogin = false;

        for(let index = 0; index < this._service_top_item.length; index++) {
            UEventHandler.addClick(this._service_top_item[index], this.node, "Vlb_service", "onClickServiceTopBtn", index);
        }
        this.initServerListData();
        
        //初始化客服
        //登陆账号
        // this.loginChatServer();
    }
    
    private getInstance( service_data_item: Object): VServiceItem {
        let ins = cc.instantiate(this._prefab);
        var item = ins.addComponent(VServiceItem);
        ins.setParent(this._parent);
        item.init();
        item.bind(service_data_item);
        return item;
    }

    /**
     *  隐藏
     */
    hide(handler?: UHandler): void {
        this.node.active = false;
        // this._parent.removeAllChildren();
        this._parent.destroyAllChildren();
    }

    protected isOnafter(): void {
        super.isOnafter();
        this.node.active = true;
        if(this.IsOn) {
            let index = 0;
            this.onClickServiceTopBtn(null, index);
        } else {
            this._parent.destroyAllChildren();
        }
    }

    protected onEnable(): void {
        if (AppGame.ins.service_items.length == 0) {
            AppGame.ins.showTips("网络信号弱，客服列表正在刷新，请等待几秒，重新打开窗口!");
        }
        else {
            if (this._activity_service_list.length == 0) {
                this.initServerListData();
            }
        }
    }
    protected onDisable(): void {

    }

    private onClickServiceTopBtn(event:any, index: number): void {
        //按钮
        let len = this._service_top_item.length;
        for (let i = 0; i < len; i++) {
            let element = this._service_top_item[i];
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
        this._service_type = index + 1;
        this.showServiceList();
    }

    initServerListData() {
        this._charge_service_list = [];
        this._activity_service_list = [];
        this._exchange_service_list = [];
        AppGame.ins.service_items.forEach(element => {
            if (element["type"] == 1) {
                this._activity_service_list.push(element);
            } else if(element["type"] == 2) {
                this._charge_service_list.push(element);
            } else if (element["type"] == 3) {
                this._exchange_service_list.push(element);
            }
        });
    }

    show(data: any): void {
        super.show(data);
    }

    bindData(data: any): void {
        if(data.service_type == 2) {
            this.onClickServiceTopBtn(null, 1);
        } else if(data.service_type == 3) {
            this.onClickServiceTopBtn(null, 2);
        }
    }

    showServiceList() {
        let self = this;
        // this._parent.removeAllChildren();
        this._parent.destroyAllChildren();
        if (self._service_type == Service_type.service_charge) {
            self._charge_service_list.forEach(element => {
                let item = this.getInstance(element);
            });
        } else if (self._service_type == Service_type.service_activity) {
            self._activity_service_list.forEach(element => {
                let item = this.getInstance(element);
            });
        } else if (self._service_type == Service_type.service_exchange) {
            self._exchange_service_list.forEach(element => {
                let item = this.getInstance(element);
            });
        }
    }
}
