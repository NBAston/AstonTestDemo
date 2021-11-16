import UNodeHelper from "../../../common/utility/UNodeHelper";
import { UVipitemData } from "./VipData";
import UResManager from "../../../common/base/UResManager";
import { EIconType } from "../../../common/base/UAllenum";
import AppGame from "../../base/AppGame";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VVipItem extends cc.Component {

    private _chagreRMB: cc.Label;
    private _frameIcon: cc.Sprite;
    private _vip_icon: cc.Sprite;
    private _desc: Array<cc.Label>;
    private _item_tilte_bg: cc.Sprite;
    private _item_tilte: cc.Label;
    private _reward_frame_lock: cc.Sprite;
    private _reward_frame: cc.Sprite;
    private _reward_wait_lock: cc.Sprite;
    
    init(): void {
        this._desc = [];
        this._chagreRMB = UNodeHelper.getComponent(this.node, "charge", cc.Label);
        this._frameIcon = UNodeHelper.getComponent(this.node, "frame", cc.Sprite);
        this._item_tilte_bg = UNodeHelper.getComponent(this.node, "vip_item_tilte", cc.Sprite);
        this._item_tilte = UNodeHelper.getComponent(this.node, "vip_item_tilte/lab", cc.Label);
        this._vip_icon = UNodeHelper.getComponent(this.node, "vip_icon", cc.Sprite);
        this._reward_frame = UNodeHelper.getComponent(this.node, "vip_reward/frame", cc.Sprite);
        this._reward_frame_lock = UNodeHelper.getComponent(this.node, "vip_reward/lock", cc.Sprite);
        this._reward_wait_lock = UNodeHelper.getComponent(this.node, "vip_reward_wait/lock", cc.Sprite);
    }

    bind(data: UVipitemData): void {
        this.node.active = true;
        this._chagreRMB.string = (data.chargeNum/100).toString();
        let or: any = this._chagreRMB;
        var x = this._chagreRMB.node.x + this._chagreRMB.node.width;
        UResManager.load(data.frameId, EIconType.Frame, this._frameIcon);

        //标题
        var dt = AppGame.ins.roleModel.getVipData();
        if ( data.lv <= dt.vipLv ){
            var url = "common/hall/texture/vip/vip_title_bg1"
            this._item_tilte.string = "VIP" + data.lv + "已达成"
            var urlFrame = "common/texture/frame/frame_" + data.lv;
            UResManager.loadUrl(urlFrame, this._reward_frame);
            this._reward_frame_lock.node.active = false
            this._reward_wait_lock.node.active = false
        }else{
            url = "common/hall/texture/vip/vip_title_bg2"
            this._item_tilte.string = "VIP" + data.lv + "未达成"
            this._reward_frame_lock.node.active = true
            this._reward_wait_lock.node.active = true
        }
        UResManager.loadUrl(url, this._item_tilte_bg);

        //icon
        url = "common/hall/texture/vip/vip_icon" + data.lv
        UResManager.loadUrl(url, this._vip_icon);

    }

    hide(): void {
        this.node.active = false;
    }


}
