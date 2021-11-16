import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import UToggle from "../../../common/utility/UToggle";
import VHeadItem from "./VHeadItem";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import UResManager from "../../../common/base/UResManager";
import { UHeadData, UIHeadItem } from "../../../common/base/UAllClass";
import { ECommonUI, EIconType } from "../../../common/base/UAllenum";
import USelectBtn from "../../../common/utility/USelectBtn";
import UEventListener from "../../../common/utility/UEventListener";
import UEventHandler from "../../../common/utility/UEventHandler";
import MRole from "../lobby/MRole";
import ULanHelper from "../../../common/utility/ULanHelper";
import VWindow from "../../../common/base/VWindow";
import UImgBtn from "../../../common/utility/UImgBtn";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";



const { ccclass, property } = cc._decorator;
/**
 *创建:sq
 *作用:头像管理器
 */
@ccclass
export default class VHead extends VWindow {
    /**
     * 男头像选择
     */
    private _selectHead: UImgBtn;
    /**
     * 女头像选择
     */
    private _selectFrame: UImgBtn;
    /**
     * 自己的头像
     */
    private _ownerHead: cc.Sprite;
    /**
     * 自己的头像框
     */
    private _ownerframe: cc.Sprite;
    /**
     * 头像预制
     */
    private _prefab: cc.Node;
    /**
     * 根对象
     */
    private _parent: cc.Node;

    private _pool: Array<VHeadItem>;
    /**
     * 当前选中
     */
    private _current: VHeadItem;
    /**
     * 
     */
    private _run: Array<VHeadItem>;

    private _data: UHeadData;

    private _okBtn : cc.Node;
    	
	private _back:cc.Node;

    private _uploadHeadBtn:cc.Node;

    

    private getInstance(): VHeadItem {
        if (this._pool.length > 0) {
            var it = this._pool.shift();
            it.node.setParent(this._parent);
            return it;
        }
        let ins = cc.instantiate(this._prefab);
        let item = ins.getComponent(VHeadItem);
        if (!item) {
            item = ins.addComponent(VHeadItem);
        }
        ins.setParent(this._parent);
        item.init();
        item.clickHandler = new UHandler(this.click, this);
        return item;
    }
    
    private reclaimAll(): void {
        let len = this._run.length;
        for (let index = 0; index < len; index++) {
            let element = this._run[index];
            element.reset();
            element.node.parent = null;
            this._pool.push(element);
        }
        this._run = [];
    }
    private click(caller: VHeadItem): void {
        if (this._current) 
        {
            this._current.IsSelect = false;
        }
        this._current = caller;
        this._current.IsSelect = true;
        if (this._selectHead.IsOn) {
            this._data.owner = caller.Id;
            UResManager.load(this._data.owner, EIconType.Head, this._ownerHead);
        } else {
            this._data.frameId = caller.Id;
            UResManager.load(this._data.frameId, EIconType.Frame, this._ownerframe);
        }
        this.playclick();
    }
    /**
     * 初始化 UI创建的时候调用
     */
    init(): void {
        super.init();
        this._pool = [];
        this._run = [];
        this._prefab = UNodeHelper.find(this.node, "root/item");
        this._parent = UNodeHelper.find(this.node, "root/bar/view/content");
        this._okBtn = UNodeHelper.find(this.node, "root/ok");
        this._uploadHeadBtn = UNodeHelper.find(this.node, "root/upload_face");
        this._ownerHead = UNodeHelper.getComponent(this.node, "root/owerhead", cc.Sprite);
        this._ownerframe = UNodeHelper.getComponent(this.node, "root/frame", cc.Sprite);
        this._selectHead = UNodeHelper.getComponent(this.node, "root/select_head", UImgBtn);
        this._selectFrame = UNodeHelper.getComponent(this.node, "root/select_frame", UImgBtn);
        this._selectHead.clickHandler = new UHandler(this.selectheads, this);
        this._selectFrame.clickHandler = new UHandler(this.selectframe, this);
        UEventHandler.addClick(this._okBtn, this.node, "VHead", "onBtnClick");  
        this._back = UNodeHelper.find(this.node,"back");
        UEventHandler.addClick(this._back,this.node,"VHead","closeUI");     
        

    }
    /**
     *  隐藏
     */
    hide(handler?: UHandler): void {
        this.node.active = false;
    }
    /**
     * 显示
     */
    show(data: any): void {
        super.show(data);
        this._data = AppGame.ins.roleModel.getHeadInfo(); 
        UResManager.load(this._data.owner, EIconType.Head, this._ownerHead, AppGame.ins.roleModel.headImgUrl);
        UResManager.load(this._data.frameId, EIconType.Frame, this._ownerframe);
        this.showselect(true);
        this.refreshHead(this._data.heads);
    }
    private selectframe(isOn: boolean): void {
        this.showselect(false);
        this.refreshHead(this._data.frames);
        this.playclick();
    }
    private selectheads(isOn: boolean): void {
        this.showselect(true);
        this.refreshHead(this._data.heads);
        this.playclick();
    }
    private refreshHead(headIcons: Array<UIHeadItem>): void {
        this.reclaimAll();
        let len = headIcons.length;
        var type = this._selectHead.IsOn ? EIconType.Head : EIconType.Frame;
        var owerId = this._selectHead.IsOn ? this._data.owner : this._data.frameId;
        this._parent.getComponent(cc.Layout).cellSize.height = this._selectHead.IsOn ? 100 : 170
        for (let i = 0; i < len; i++) {
            let element = headIcons[i];
            let item = this.getInstance();
            item.bind(element, type);
            this._run.push(item);
            if (owerId == element.frameId) {
                this._current = item;
                this._current.IsSelect = AppGame.ins.roleModel.headImgUrl==""?true:false;
            }
        }
    }
    private showselect(head: boolean): void {
        this._selectHead.IsOn = head;
        this._selectFrame.IsOn = !head;
    }
    private onBtnClick() {
        if (this._selectHead.IsOn) {
            AppGame.ins.roleModel.requestSaveHead(this._data.owner);
        } else {
            AppGame.ins.roleModel.requestSaveHeadBox(this._data.frameId);
        }
        this.playclick();
    }

    closeUI(){
        super.playclick();
        super.clickClose();
    }

    //上传头像
    onUploadHead(){
        AppGame.ins.showUI(ECommonUI.LB_Head_Image_From);
        this.playclick();
    }



    protected onEnable(): void {
        AppGame.ins.roleModel.on(MRole.UPDATA_HEAD, this.updata_head, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_HEADBOX, this.updata_frame, this);
        AppGame.ins.roleModel.on(MRole.UPLOAD_HEAD_IMG_SUCCESS, this.upload_head_success, this);
    }
    protected onDisable(): void {
        AppGame.ins.roleModel.off(MRole.UPDATA_HEAD, this.updata_head, this);
        AppGame.ins.roleModel.off(MRole.UPDATA_HEADBOX, this.updata_frame, this);
        AppGame.ins.roleModel.off(MRole.UPLOAD_HEAD_IMG_SUCCESS, this.upload_head_success, this);
    }
    private updata_frame(frameid: number, sucess: boolean) {
        if (sucess) {
            UResManager.load(frameid, EIconType.Frame, this._ownerframe);
            AppGame.ins.showTips(ULanHelper.FRAME_CHANGE_SUCESS);
        }
        else {
            AppGame.ins.showTips(ULanHelper.FRAME_CHANGE_FAIL);
        }
    }
    private updata_head(headId: number, sucess: boolean): void {
        if (sucess) {
            UResManager.load(headId, EIconType.Head, this._ownerHead);
            AppGame.ins.showTips(ULanHelper.HEAD_CHANGE_SUCESS);
        }
        else {
            AppGame.ins.showTips(ULanHelper.HEAD_CHANGE_FAIL);
        }
    }

    private upload_head_success(success:boolean, headImgUrl: string = ''): void {
        if(success) {
            UResManager.load(1, EIconType.Head, this._ownerHead, headImgUrl);
            AppGame.ins.showTips(ULanHelper.UPLOAD_HEAD_SUCCESS);
        } else {
            AppGame.ins.showTips(ULanHelper.UPLOAD_HEAD_FAIL);
        }
    }
}
