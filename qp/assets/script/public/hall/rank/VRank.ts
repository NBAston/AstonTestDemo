import VWindow from "../../../common/base/VWindow";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import VRankItem from "./VRankItem";
import AppGame from "../../base/AppGame";
import MHall from "../lobby/MHall";
import UHandler from "../../../common/utility/UHandler";
import UEventHandler from "../../../common/utility/UEventHandler";
import UImgBtn from "../../../common/utility/UImgBtn";
import MRannk from "./MRank";
import ErrorLogUtil, { LogLevelType } from "../../errorlog/ErrorLogUtil";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VRank extends VWindow {

    private _self: VRankItem;
    private _imgBtn: UImgBtn;
    private _parent: cc.Node;
    private _prefab: cc.Node;
    private _pool: Array<VRankItem>;
    private _run: Array<VRankItem>;
    private _nodata: cc.Node;
    private _back:cc.Node;
    private getInstance(): VRankItem {
        if (this._pool.length > 0) {
            var it = this._pool.shift();
            it.node.setParent(this._parent);
            return it;
        }
        let ins = cc.instantiate(this._prefab);
        let item = ins.getComponent(VRankItem);
        if (!item) {
            item = ins.addComponent(VRankItem);
        }
        ins.setParent(this._parent);
        item.init();
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
    init(): void {
        super.init();
        this._run = [];
        this._pool = [];
        var self = UNodeHelper.find(this._root, "self");
        this._self = self.addComponent(VRankItem);
        this._self.init();
        this._prefab = UNodeHelper.find(this._root, "item");
        this._parent = UNodeHelper.find(this._root, "bar/view/content");
        this._imgBtn = UNodeHelper.getComponent(this._root, "btn_win", UImgBtn);
        this._nodata = UNodeHelper.find(this._root, "nodata");
        this._back = UNodeHelper.find(this.node,"back");
        UEventHandler.addClick(this._back,this.node,"VRank","closeUI");

    }

    closeUI(){
        super.playclick();
        super.clickClose();
    }

    hide(handler?: UHandler): void {
        super.hide(handler);
        this.cancel();
    }
    /**
      * 显示
    */
    show(data: any): void { 
        super.show(data);
        this.reclaimAll();
        this._self.hide();
        this.regester();
        this._nodata.active = false;
        this._imgBtn.IsOn = true;
        if (AppGame.ins.rankModel.requestRank()) {
            AppGame.ins.showConnect(true);
            // this.scheduleOnce(() => { 
            // }, 5);
        }
    }
    protected onDisable(): void {
        AppGame.ins.showConnect(false);
        this.unscheduleAllCallbacks();
    }
    private regester(): void {
        AppGame.ins.rankModel.on(MRannk.UPDATE_RANK, this.on_update_rank, this);
    }
    private cancel(): void {

        AppGame.ins.rankModel.off(MRannk.UPDATE_RANK, this.on_update_rank, this);
    }
    private on_update_rank(sucess: boolean, msg: string): void {
        AppGame.ins.showConnect(false);
        if (sucess)
            this.refreshdata();
        else {
            AppGame.ins.showTips(msg);
        }
    }
    private refreshdata(): void {
        var data = AppGame.ins.rankModel.getRankData();
        this.reclaimAll(); 
        if (data.datas.length == 0) {
            var str = '排行榜数据长度：' + data.datas.length;
            ErrorLogUtil.ins.addErrorLog(str, LogLevelType.INFO); 
            this._nodata.active = true;
            this._self.hide();
        } else {
            this._nodata.active = false;
            this._self.bind(data.self);
            this._self.show(null);
        }
        data.datas.forEach(element => {
            var item = this.getInstance();
            item.show(this._parent);
            item.bind(element);
            this._run.push(item);
        });
    }
}
