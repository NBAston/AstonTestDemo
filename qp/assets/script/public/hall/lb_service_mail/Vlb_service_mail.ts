import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import VWindow from "../../../common/base/VWindow";
import Vlb_left_select from "./Vlb_left_select";
import { EBtnType, LeftBtnData } from "./MailServiceData";
import UEventHandler from "../../../common/utility/UEventHandler";



const { ccclass, property } = cc._decorator;
/**
 *创建:sq
 *作用:邮件和客服中心
 */
@ccclass  
export default class Vlb_service_mail extends VWindow {
    private _selectBtns: { [key: number]: Vlb_left_select };
    private _back:cc.Node;
    init(): void {
        super.init();
        this._selectBtns = {};
        let mail = UNodeHelper.getComponent(this._root, "mask_bg/btn_mail", Vlb_left_select);
        mail.init();
        this._selectBtns[mail.type] = mail;

        let service = UNodeHelper.getComponent(this._root, "mask_bg/btn_service", Vlb_left_select);
        service.init();
        this._selectBtns[service.type] = service;

        let faq = UNodeHelper.getComponent(this._root, "mask_bg/btn_FAQ", Vlb_left_select);
        faq.init();
        this._selectBtns[faq.type] = faq;

        for (const key in this._selectBtns) {
            if (this._selectBtns.hasOwnProperty(key)) {
                const element = this._selectBtns[key];
                element.clickHandler = new UHandler(this.onchekclick, this, element.type);
            }
        }
        this._back = UNodeHelper.find(this.node,"back");
        UEventHandler.addClick(this._back,this.node,"Vlb_service_mail","closeUI");
    }

    private onchekclick(type: EBtnType, IsOn: boolean): void {
        super.playclick();
        for (const key in this._selectBtns) {
            if (this._selectBtns.hasOwnProperty(key)) {
                const element = this._selectBtns[key];
                if (element.type != type) {
                    element.IsOn = false;
                }
                if (element.IsOn){
                    var color = new cc.Color(255, 255, 255);
                    UNodeHelper.find(element.node,"title").color = color;
                } else {
                     color = new cc.Color(164, 116, 51);
                    UNodeHelper.find(element.node,"title").color = color;
                }
            }
        }
    }

    hide(hander?: UHandler): void {
        super.hide(hander);
        for (const key in this._selectBtns) {
            if (this._selectBtns.hasOwnProperty(key)) {
                let element = this._selectBtns[key];
                element.hide();
            }
        }
    }

    closeUI(){
        super.playclick();
        super.clickClose();
    }

    /**
    * 显示
    */
    show(data: LeftBtnData): void {
        super.show(data);
        data = data || { type: EBtnType.email, data: "" };
        this._selectBtns[data.type].IsOn = true;
        this._selectBtns[data.type].bindData(data.data); 
        this.onchekclick(data.type,true);
    }
}
