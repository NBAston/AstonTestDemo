import VWindow from "../../../common/base/VWindow";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UQRCode from "../../../common/utility/UQRCode";
import AppGame from "../../base/AppGame";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ChargeUsdtQrcode extends VWindow {
    private _back:cc.Node;
    private _img_qrCode:UQRCode;
    private _qrcord: cc.Node = null;
    private _saveQrcodeBtn: cc.Node = null;
    init(): void {
        super.init();
        this._back = UNodeHelper.find(this.node,"back");
        this._saveQrcodeBtn = UNodeHelper.find(this._root,"add_bind_btn");
        this._qrcord = UNodeHelper.find(this._root,"qrcode");
        this._img_qrCode = UNodeHelper.getComponent(this._root, "qrcode/qrcode", UQRCode);
        UEventHandler.addClick(this._back,this.node,"ChargeUsdtQrcode","closeUI");
        UEventHandler.addClick(this._saveQrcodeBtn,this.node,"ChargeUsdtQrcode","saveQrcode");
    }
   
    /**
     *显示
     */
    show(data: any): void {
        super.show(data);
        this._img_qrCode.make(data);
    }

    closeUI(){
        super.playclick();
        super.clickClose();
    }
   
    /**
     * 保存海报
     */
    private saveQrcode():void{
    super.playclick();
    UAPIHelper.takePhoto(this._qrcord, "charge_qrcode.jpg");
    setTimeout(function () {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "photoTo", "(Ljava/lang/String;)V", jsb.fileUtils.getWritablePath() + "charge_qrcode" + '.jpg');
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            let value = jsb.reflection.callStaticMethod("AppController", "CanPhotoLibary:", jsb.fileUtils.getWritablePath() + "charge_qrcode" + ".jpg");
            if (value == 0)//拒绝
                {
                AppGame.ins.showTips("您已拒绝使用相册！");
            }
            else if (value == 1)//同意
            {
            jsb.reflection.callStaticMethod("AppController", "photoTo:", jsb.fileUtils.getWritablePath() + "charge_qrcode" + ".jpg");
            }
            else if (value == 2)//等你做决定呢
            {

            }
        } else {
            AppGame.ins.showTips("该图片保存功能只限安卓，苹果手机客户端");
        }
        }, 500);
    }
    protected onEnable(): void {
       
    }
    protected onDisable(): void {
       
    }
}
