import VWindow from "../../common/base/VWindow";
import VAccountItem from "./VAccountItem";
import UHandler from "../../common/utility/UHandler";
import { UAccountItemData } from "./ULoginData";
import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "../base/AppGame";
import ULanHelper from "../../common/utility/ULanHelper";
import VLoginOtherAccount from "./VLoginOtherAccount";
import VResetPsw from "./VResetPsw";
import UEventHandler from "../../common/utility/UEventHandler";
import VPopuWindow from "../base/VPopuWindow";
import MLogin from "./MLogin";
import { ELoginType } from "../../common/base/UAllenum";

const { ccclass, property } = cc._decorator;
/**
 * 登陆界面弹出框
 */
@ccclass
export default class VChangeAccount extends VPopuWindow {
    /**
     * 预制节点
     */
    private _prefab: cc.Node;
    /**
     * 预制节点父对象
     */
    private _parent: cc.Node;
    /**
     * contentSize
     */
    private _content: cc.Node;
    /**
     * account池
     */
    private _pools: Array<VAccountItem>;
    /**
     * 正在显示的
     */
    private _run: Array<VAccountItem>;
    /**
     * 当前选中的userId
     */
    private _currentUserId: number;

    private _mobile:string;
    /**
     * 其他账号登陆界面
     */
    private _loginOtherAccount: VLoginOtherAccount;
    /**
     * 密码重置界面
     */
    private _resetPsw: VResetPsw;
    /**
     * 获取单个实例
     */
    private getInstance(): VAccountItem {
        var item: VAccountItem = null;
        var temp = cc.instantiate(this._prefab) as cc.Node;
        temp.setParent(this._parent);
        item = temp.addComponent(VAccountItem);
        item.selectHander = new UHandler(this.onSelectHander, this);
        item.deleteHanlder = new UHandler(this.onDeleteHanlder, this);
        item.init();
        item.setactive(true);
        this._run.push(item);
        return item;
    }
    /**
     * 回收所有
     */
    private reclaimAll(): void {
        let len = this._run.length;
        for (let i = 0; i < len; i++) {
            var element = this._run[i];
            element.reset();
            this._pools.push(element);
        }
        this._run = [];
    }
    private onSelectHander(userId: number): void {
        super.playclick();
        AppGame.ins.LoginModel.selectUserId(userId);
    }
    private onDeleteHanlder(userId: number): void {
        super.playclick();
        let result = AppGame.ins.LoginModel.deleteDbAccount(userId);
        if (result == 1) {
            AppGame.ins.showTips(ULanHelper.LIMIT_ONE_ACCOUNT);
        } else if (result == 2) {
            AppGame.ins.showTips(ULanHelper.DELETE_ACCOUNT_FAILED);
        }
    }
    private on_showOtherLogin(): void {
        super.playclick();
        this._loginOtherAccount.show(null);
    }
    private on_showchangepsw(): void {
        super.playclick();
        AppGame.ins.LoginModel._loginType = ELoginType.forgetPsw
        AppGame.ins.LoginModel.requestLoginData();
    }
    private onlogin(): void {
        AppGame.ins.LoginModel._loginType = ELoginType.fastLogin
        AppGame.ins.LoginModel.requestLoginData();
        super.playclick();
    }
    /** 
     * 初始化
     */
    init(): void {
        super.init();
        this._content = UNodeHelper.find(this._root, "accountbar/view/content");
        this._prefab = UNodeHelper.find(this._root, "item");
        this._parent = this._content;
        this._loginOtherAccount = UNodeHelper.getComponent(this.node.parent, "loginOtherAccount", VLoginOtherAccount);
        this._loginOtherAccount.init();
        this._resetPsw = UNodeHelper.getComponent(this.node.parent, "loginResetPsw", VResetPsw);
        this._resetPsw.init();

        var btn_change = UNodeHelper.find(this._root, "btn_changepasswords");
        var btn_loginOther = UNodeHelper.find(this._root, "btn_loginotheraccount");
        var btn_login = UNodeHelper.find(this._root, "btn_ok");

        UEventHandler.addClick(btn_change, this.node, "VChangeAccount", "on_showchangepsw");
        UEventHandler.addClick(btn_loginOther, this.node, "VChangeAccount", "on_showOtherLogin");
        UEventHandler.addClick(btn_login, this.node, "VChangeAccount", "onlogin");
        this.hide();

        this._run = [];
        this._pools = [];
    }
    /**
     * 绑定数据
     * @param datas 
     */
    bind(datas: Array<UAccountItemData>): void {
        this._parent.removeAllChildren();
        let len = datas.length;
        for (let i = 0; i < len; i++) {
            let element = datas[i];
            if (element.current) { 
                this._currentUserId = element.userId;
                this._mobile=element.mobile;
            }
            let item = this.getInstance();
            item.bind(element);
        }
        let height = len * 40 + 30;
        this._content.height = height;
    }

    onEnable(){
        AppGame.ins.LoginModel.on(MLogin.CONNECT_SUCESS, this.connectsucess, this);
    }

    onDisable(): void {
        AppGame.ins.LoginModel.off(MLogin.CONNECT_SUCESS, this.connectsucess, this);
    }

    connectsucess(){
        if(AppGame.ins.LoginModel._loginType == ELoginType.fastLogin){ 
             if (this._currentUserId || this._mobile)
             AppGame.ins.LoginModel.fastLogin(this._currentUserId,this._mobile);
             this.hide();
        }else if (AppGame.ins.LoginModel._loginType == ELoginType.forgetPsw){
            this._resetPsw.show(this._currentUserId);
            this.hide();
        }
    }


}
