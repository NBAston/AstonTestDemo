import VWindow from "../../../common/base/VWindow";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UQRCode from "../../../common/utility/UQRCode";
import AppGame from "../../base/AppGame";
import MClub from "../club/myClub/MClub";
import MProxy from "./MProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class SelectPoster extends VWindow {

    @property({ type: [cc.SpriteFrame], tooltip: "俱乐部图" }) clubPosterSp: cc.SpriteFrame[] = [];
    @property({ type: cc.Node, tooltip: "content" }) content: cc.Node = null;

    private _btn_left: cc.Node;
    private _btn_right: cc.Node;
    private _btn_save: cc.Node;
    private _pageView: cc.PageView;
    private _content: cc.Node;
    private _first_qrCode: UQRCode;
    private _second_qrCode: UQRCode;
    private _third_qrCode: UQRCode;
    private _fourth_qrCode: UQRCode;
    private _fifth_qrCode: UQRCode;
    private _sixth_qrCode: UQRCode;
    private _img_qrCode: UQRCode;
    private _first_node: cc.Node = null;
    private _selectIndex: number = 1;
    private _qrcord: cc.Node = null;
    @property({ type: [cc.SpriteFrame] })
    imageFrameArr: Array<cc.SpriteFrame> = [];
    private _back: cc.Node;

    init(): void {
        super.init();
        this._btn_left = UNodeHelper.find(this._root, "btn_left");
        this._btn_right = UNodeHelper.find(this._root, "btn_right");
        this._btn_save = UNodeHelper.find(this._root, "btn_save");
        this._pageView = UNodeHelper.getComponent(this._root, "pageView", cc.PageView);
        this._content = UNodeHelper.find(this._root, "pageView/view/content");
        this._first_node = UNodeHelper.find(this._root, "pageView/view/content/page_first");
        this._qrcord = UNodeHelper.find(this._root, "qrcord");
        this._first_qrCode = UNodeHelper.getComponent(this._root, "pageView/view/content/page_first/qrcode", UQRCode);
        this._second_qrCode = UNodeHelper.getComponent(this._root, "pageView/view/content/page_second/qrcode", UQRCode);
        this._third_qrCode = UNodeHelper.getComponent(this._root, "pageView/view/content/page_third/qrcode", UQRCode);
        this._fourth_qrCode = UNodeHelper.getComponent(this._root, "pageView/view/content/page_fourth/qrcode", UQRCode);
        this._fifth_qrCode = UNodeHelper.getComponent(this._root, "pageView/view/content/page_fifth/qrcode", UQRCode);
        this._sixth_qrCode = UNodeHelper.getComponent(this._root, "pageView/view/content/page_sixth/qrcode", UQRCode);
        this._img_qrCode = UNodeHelper.getComponent(this._root, "qrcord/qrcode", UQRCode);
        this._back = UNodeHelper.find(this.node, "back");
        UEventHandler.addClick(this._back, this.node, "SelectPoster", "closeUI");

        UEventHandler.addClick(this._btn_left, this.node, "SelectPoster", "selectLeft");
        UEventHandler.addClick(this._btn_right, this.node, "SelectPoster", "selectRight");
        UEventHandler.addClick(this._btn_save, this.node, "SelectPoster", "savePoster");
    }
    private _viewType: number = 0;
    private _invitationCode: number = 0;
    show(data: any) {
        super.show(data);
        let spreadUrl = data["spreadUrl"]; //0是代理 1是俱乐部
        this._viewType = data["viewType"]; //0是代理 1是俱乐部
        this._invitationCode = data["invitationCode"];

        let childs = this.content.children;

        for (let i = 0; i < childs.length; i++) {
            let sprite = childs[i].getChildByName("Background").getComponent(cc.Sprite);
            sprite.spriteFrame = this._viewType == 0 ? this.imageFrameArr[i] : this.clubPosterSp[i];
            let codeNode = childs[i].getChildByName("code");
            codeNode.active = false;
            if (this._viewType == 1) {
                codeNode.active = true;
                codeNode.getComponent(cc.Label).string = this._invitationCode.toString();
            };
        };

        this._first_qrCode.make(spreadUrl);
        this._second_qrCode.make(spreadUrl);
        this._third_qrCode.make(spreadUrl);
        this._fourth_qrCode.make(spreadUrl);
        this._fifth_qrCode.make(spreadUrl);
        this._sixth_qrCode.make(spreadUrl);
        this._img_qrCode.make(spreadUrl);
    };

    /**
     * 点击往左
     */
    private selectLeft(): void {
        super.playclick();
        var a = this._pageView.getCurrentPageIndex();
        if (a == 0) {
            return
        } else {
            this._pageView.scrollToPage(0, 1);
        }
    }

    /**
     * 点击往右
     */
    private selectRight(): void {
        super.playclick();
        var a = this._pageView.getCurrentPageIndex();
        if (a == this._content.childrenCount) {
            return
        } else {
            this._pageView.scrollToPage(5, 1);
        }
    }


    /**
     * 选择海报
     */
    onclickPageViewIndex(event: any, index: number): void {
        super.playclick();
        this._selectIndex = index;
        this._qrcord.getComponent(cc.Sprite).spriteFrame = this._viewType == 0 ? this.imageFrameArr[this._selectIndex] : this.clubPosterSp[this._selectIndex];
    }

    /**
     * 保存海报
     */
    private savePoster(): void {
        super.playclick();
        this._qrcord.active = true
        this._qrcord.getComponent(cc.Sprite).spriteFrame = this._viewType == 0 ? this.imageFrameArr[this._selectIndex] : this.clubPosterSp[this._selectIndex];
        UAPIHelper.takePhoto(this._qrcord, "poster_mode.jpg");
        this._qrcord.active = false
        setTimeout(function () {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "photoTo", "(Ljava/lang/String;)V", jsb.fileUtils.getWritablePath() + "poster_mode" + '.jpg');
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                let value = jsb.reflection.callStaticMethod("AppController", "CanPhotoLibary:", jsb.fileUtils.getWritablePath() + "poster_mode" + ".jpg");
                if (value == 0)//拒绝
                {
                    AppGame.ins.showTips("您已拒绝使用相册！");
                }
                else if (value == 1)//同意
                {
                    jsb.reflection.callStaticMethod("AppController", "photoTo:", jsb.fileUtils.getWritablePath() + "poster_mode" + ".jpg");
                }
                else if (value == 2)//等你做决定呢
                {

                }
            }
        }, 500);
        // UAPIHelper.savePhoto("poster_mode");
    }

    closeUI() {
        super.playclick();
        super.clickClose();
    }

    protected onEnable(): void {
    }
    protected onDisable(): void {
        this._selectIndex = 1;
        AppGame.ins.showConnect(false);
        this.unscheduleAllCallbacks();


    }



}
