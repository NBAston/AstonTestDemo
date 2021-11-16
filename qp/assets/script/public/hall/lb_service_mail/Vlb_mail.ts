
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import { ECommonUI, EIconType } from "../../../common/base/UAllenum";
import VMailItem from "./Vlb_mail_item";
import MMailModel from "./Mmail_Model";
import Vlb_left_select from "./Vlb_left_select";
import { MailData } from "./MailServiceData";
import UHandler from "../../../common/utility/UHandler";
import { ULocalStorage } from "../../../common/utility/ULocalStorage";
import VHall from "../lobby/VHall";


const { ccclass, property } = cc._decorator;
/**
 *创建:sq
 *作用:邮件和客服中心
 */
@ccclass
export default class Vlb_mail extends Vlb_left_select {
    private _prefab: cc.Node;
    private _parent: cc.Node;
    private _nothing: cc.Node;
    private _red: cc.Node;
    private _scrollview: cc.ScrollView;
    private _pool: Array<VMailItem>;
    private _run: Array<VMailItem>;
    private _clickItem:VMailItem;

    init(): void {
        this._pool = [];
        this._run = [];
        this._prefab = UNodeHelper.find(this.content, "scrollview/item");
        this._parent = UNodeHelper.find(this.content, "scrollview/view/content");
        this._red = UNodeHelper.find(this.node, "redicon");
        this._nothing = UNodeHelper.find(this.content, "nothing");
        this._scrollview = UNodeHelper.getComponent(this.content, "scrollview",cc.ScrollView);
    }
    
    private getInstance(): VMailItem {
        if (this._pool.length > 0) {
            return this._pool.shift();
        }
        let ins = cc.instantiate(this._prefab);
        let item = ins.getComponent(VMailItem);
        if (!item) {
            item = ins.addComponent(VMailItem);
        }
        ins.setParent(this._parent);
        item.init();
        item.clickhander = new UHandler(this.on_readMail, this);
        return item;
    }

    private reclaimAll(): void {
        if (!this._run) return
        let len = this._run.length;
        for (let index = 0; index < len; index++) {
            let element = this._run[index];
            element.hide();
            this._pool.push(element);
        }
        this._run = [];
    }


    private on_readMail(caller: VMailItem): void {
        //系统邮件本地读取
        this._clickItem = caller;
        if (caller.Data.userId == 0){
            AppGame.ins.showUI(ECommonUI.LB_Mail_Detail, caller.Data);
            caller.Data.status = 1 ;
            ULocalStorage.saveItem(caller.Data.mailId,1);
            this._clickItem.show(caller.Data);
            this.showRed();
            AppGame.ins.mailModel.requestReadMail(caller.Data.mailId);
        }
        else if (AppGame.ins.mailModel.requestReadMail(caller.Data.mailId)) {
            this.scheduleOnce(() => {
                AppGame.ins.showConnect(false);
            }, 0.1);
        }
    }

    private read_mail(sucess: boolean, data: MailData, msg: string): void {
        if (sucess) {
            AppGame.ins.showUI(ECommonUI.LB_Mail_Detail, data);
            this._clickItem.show(data);
            this.showRed();
        } else {
            AppGame.ins.showTips(msg);
        }
    }

    private update_list(sucess: boolean, msg: string): void {
        if (sucess) {
            this.refreshData();
        } else {
            AppGame.ins.showTips(msg);
        }
    }

    protected isOnafter(): void {
        super.isOnafter();
        if (this.IsOn) {
            this.reclaimAll();
            if (AppGame.ins.mailModel.requestPullMail()) {
                this.scheduleOnce(() => {
                    AppGame.ins.showConnect(false);
                }, 0.1);
            }
        }
    }

    private showRed() {
        var dt = AppGame.ins.mailModel.getdata();
        var noRead = false
        for (var k in dt){
            if (dt[k].status == 0){
                noRead = true;
                break
            }
        }
        this._red.active = noRead
    }

    private refreshData(): void {
        var dt = AppGame.ins.mailModel.getdata();
        this.reclaimAll();
        var index = 0 ; 
        dt.forEach(element => {
            var item = this.getInstance();
            item.show(element);
            item.node.zIndex = index++;
            this._run.push(item);
        });
        this._scrollview.scrollToTop()
        this._nothing.active = dt.length > 0 ? false : true;
        this.showRed();  
    }

    protected onEnable():void{
        AppGame.ins.mailModel.on(MMailModel.UPDATE_MAIL, this.update_list, this);
        AppGame.ins.mailModel.on(MMailModel.READ_MAIL, this.read_mail, this);
    }
    protected onDisable():void{
        AppGame.ins.mailModel.off(MMailModel.UPDATE_MAIL, this.update_list, this);
        AppGame.ins.mailModel.off(MMailModel.READ_MAIL, this.read_mail, this);
    }
 
 
}
