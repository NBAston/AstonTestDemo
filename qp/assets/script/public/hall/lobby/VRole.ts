import UNodeHelper from "../../../common/utility/UNodeHelper";
import UHandler from "../../../common/utility/UHandler";
import UEventListener from "../../../common/utility/UEventListener";
import { URoleInfo } from "../../../common/base/UAllClass";
import UResManager from "../../../common/base/UResManager";
import { EIconType, ECommonUI } from "../../../common/base/UAllenum";
import AppGame from "../../base/AppGame";
import MRole from "./MRole";
import { ZJH_SCALE } from "../../../game/zjh/MZJH";
import UStringHelper from "../../../common/utility/UStringHelper";
import VHallMusic from "./VHallMusic";
import UDebug from "../../../common/utility/UDebug";
import ULanHelper from "../../../common/utility/ULanHelper";
import UAudioManager from "../../../common/base/UAudioManager";




const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 作用:玩家角色信息显示
 */
@ccclass
export default class VRole extends cc.Component {
    /**
     * 头像
     */
    private _headIcon: cc.Sprite;
    /**
     * 角色名字
     */
    private _roleName: cc.Label;

    private _headframe: cc.Sprite;
    /**
     * 玩家金币
     */
    private _roleGold: cc.Label;
    /**
     * 玩家id
     */
    private _roleId: cc.Label;
    /**
     * 是否初始化
     */
    private _isInit: boolean;

    private _data: URoleInfo;

    private _music: VHallMusic;

    private _vip: cc.Label;

    private _root:cc.Node;

    /**
     * 初始化
     */
    init(roleRoot:cc.Node,music: VHallMusic, gold: cc.Node): void {
        if (this._isInit) return;
        this._root=roleRoot;
        this._isInit = true;
        this._music = music;
        this._headIcon = UNodeHelper.getComponent(roleRoot, "headicon", cc.Sprite);
        this._headframe = UNodeHelper.getComponent(roleRoot, "head_back", cc.Sprite);
        this._roleName = UNodeHelper.getComponent(roleRoot, "nickname", cc.Label);
        this._roleGold = UNodeHelper.getComponent(this.node, "layout/goldBg/center_gold/chip", cc.Label);
        this._roleId = UNodeHelper.getComponent(roleRoot, "roleid", cc.Label);
        this._vip = UNodeHelper.getComponent(roleRoot, "nickname/vip_bg/vip", cc.Label);
        let clickNode = UNodeHelper.find(roleRoot, "head_back");
        UEventListener.get(clickNode).onClick = new UHandler(this.click, this);
    }
    private click(): void {
        AppGame.ins.showUI(ECommonUI.LB_Personal);
        UAudioManager.ins.playSound("audio_vhall_persion_picture");
        this._music.playclick();
    }
    start() {

    }
    // update (dt) {}
    /**
     * 设置显示或者隐藏
     * @param value 
     */
    setactive(value: boolean): void {
        this._root.active = value;
    }
    bindData(data: URoleInfo): void {
        this._data = data;
        this._roleName.string = data.roleName == ""?data.roleId.toString():data.roleName; 
        this.updata_score(data.gold);
        if (this._roleId) this._roleId.string = data.roleId.toString();
        this._vip.string = data.vip.toString();
        this.updata_head(data.headId, true);
        this.update_frame(data.frameId, true);
    }
    onDestroy(): void {
        this._data = null;
    }
    protected onEnable(): void {
        AppGame.ins.roleModel.on(MRole.UPDATA_HEAD, this.updata_head, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_HEADBOX, this.update_frame, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.updata_score, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_REBNAME, this.update_rename, this);
        AppGame.ins.roleModel.on(MRole.UPLOAD_HEAD_IMG_SUCCESS, this.upload_head_success, this);


    }
    protected onDisable(): void {
        AppGame.ins.roleModel.off(MRole.UPDATA_HEAD, this.updata_head, this);
        AppGame.ins.roleModel.off(MRole.UPDATA_HEADBOX, this.update_frame, this);
        AppGame.ins.roleModel.off(MRole.UPDATA_SCORE, this.updata_score, this);
        AppGame.ins.roleModel.off(MRole.UPDATA_REBNAME, this.update_rename, this);
        AppGame.ins.roleModel.off(MRole.UPLOAD_HEAD_IMG_SUCCESS, this.upload_head_success, this);

    }
    private update_rename(nickname: string, sucess: boolean, error: string): void {
        this._roleName.string = nickname;
        if (sucess) {
            AppGame.ins.showTips(ULanHelper.NICKNAME_CHANGE_SUCESS);
        } else {
            AppGame.ins.showTips(ULanHelper.NICKNAME_CHANGE_FAIL);
        }
    }
    private updata_head(headId: number, sucess: boolean): void {
        if (sucess)
            UResManager.load(headId, EIconType.Head, this._headIcon, AppGame.ins.roleModel.headImgUrl);
    }
    private upload_head_success(success:boolean, headImgUrl: string = ''): void {
        if(success) {
            UResManager.load(1, EIconType.Head, this._headIcon, headImgUrl);
        } 
    }
    private update_frame(frameId: number, sucess: boolean) {
        if (sucess)
            UResManager.load(frameId, EIconType.Frame, this._headframe);
    }
    private updata_score(score: number): void {
        this._roleGold.string = UStringHelper.getMoneyFormat(score * ZJH_SCALE, -1,false,true).toString();
        // let or: any = this._roleGold;
        // or._updateRenderData(true);
        // let len = 60 + this._roleGold.node.width;
        // if (len > 143) {
        //     this._back.width = len;
        // } else {
        //     this._back.width = 143;
        // }
    }
}
