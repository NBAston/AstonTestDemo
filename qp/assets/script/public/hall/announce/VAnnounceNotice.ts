import VAnnounceSelect from "./VAnnounceSelect";
import VAnnounceItem from "./VAnnounceItem";
import UHandler from "../../../common/utility/UHandler";
import AppGame from "../../base/AppGame";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import MAnnounceModel from "./MAnnounceModel";
import { mailData } from "./AnnounceData";
import { ECommonUI } from "../../../common/base/UAllenum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VAnnounceNotice extends VAnnounceSelect {
    private _parent: cc.Node;
    private _prefab: cc.Node;
    private _pool: Array<VAnnounceItem>;
    private _run: Array<VAnnounceItem>;
    private _noannounce:cc.Node;
    init(): void {
        this._pool = [];
        this._run = [];
        this._prefab = UNodeHelper.find(this.content, "item");
        this._parent = UNodeHelper.find(this.content, "view/content");
        this._noannounce=UNodeHelper.find(this.content,"noannounce");
    }
    private getInstance(): VAnnounceItem {
        if (this._pool.length > 0) {
            var it = this._pool.shift();
            it.node.setParent(this._parent);
            return it;
        }
        let ins = cc.instantiate(this._prefab);
        let item = ins.getComponent(VAnnounceItem);
        if (!item) {
            item = ins.addComponent(VAnnounceItem);
        }
        ins.setParent(this._parent);
        item.init();
        item.clickhander = new UHandler(this.on_readMail, this);
        return item;
    }
    private reclaimAll(): void {
        let len = this._run.length;
        for (let index = 0; index < len; index++) {
            let element = this._run[index];
            element.hide();
            element.node.parent = null;
            this._pool.push(element);
        }
        this._run = [];
    }
    private on_readMail(caller: VAnnounceItem): void {
        if (AppGame.ins.announceModel.requestReadMail(caller.Data.mailId)) {
            this.scheduleOnce(() => {
                AppGame.ins.showConnect(false);
            }, 5);
        }
    }
    private read_mail(sucess: boolean, data: mailData, msg: string): void {
        if (sucess) {
            AppGame.ins.showUI(ECommonUI.LB_AnnounceDetail, data);
            this.refreshData();
        } else {
            AppGame.ins.showTips(msg);
        }
    }
    private update_announce(sucess: boolean, msg: string): void {
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
            if (AppGame.ins.announceModel.requestPullMail()) {
                this.scheduleOnce(() => {
                    AppGame.ins.showConnect(false);
                }, 0.1);
            }
            /*
            公告弹窗BUG
            */
        }
    }
    private refreshData(): void {
        var dt = AppGame.ins.announceModel.getannouncedata();
        this.reclaimAll();
        dt.forEach(element => {
            var item = this.getInstance();
            item.show(element);
            this._run.push(item);
        });
        this._noannounce.active = dt.length > 0 ? false : true;
    }

    protected onEnable():void{
        AppGame.ins.announceModel.on(MAnnounceModel.UPDATE_MAIL, this.update_announce, this);
        AppGame.ins.announceModel.on(MAnnounceModel.READ_MAIL, this.read_mail, this);
    }
    protected onDisable():void{
        AppGame.ins.announceModel.on(MAnnounceModel.UPDATE_MAIL, this.update_announce, this);
        AppGame.ins.announceModel.on(MAnnounceModel.READ_MAIL, this.read_mail, this);
    }
}
