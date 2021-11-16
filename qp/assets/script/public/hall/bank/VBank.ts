import VWindow from "../../../common/base/VWindow";
import VFlagAnim from "./VFlagAnim";
import UImgBtn from "../../../common/utility/UImgBtn";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UIBankData from "./BankData";
import AppGame from "../../base/AppGame";
import UHandler from "../../../common/utility/UHandler";
import UEventHandler from "../../../common/utility/UEventHandler";
import UStringHelper from "../../../common/utility/UStringHelper";
import { ZJH_SCALE } from "../../../game/zjh/MZJH";
import MRole from "../lobby/MRole";
import ULanHelper from "../../../common/utility/ULanHelper";
import { ECommonUI } from "../../../common/base/UAllenum";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VBank extends VWindow {

    @property(cc.SpriteFrame)
    NormalImg:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    InputImg:cc.SpriteFrame = null;

    private _currentFlag: VFlagAnim;
    private _bankflag: VFlagAnim;
    private _currentGold: cc.Label;
    private _bankGold: cc.Label;
    private _saveGoldBtn: UImgBtn;
    private _getGoldBtn: UImgBtn;
    private _getBtn: cc.Node;
    private _saveBtn: cc.Node;
    private _getSaveCount: cc.EditBox;
    private _getOrSaveZi: cc.Sprite;
    private _slider: cc.Slider;
    private _process: cc.Sprite;
    private _data: UIBankData;
    private _first_btn:cc.Node;
    private _second_btn:cc.Node;
    private _third_btn:cc.Node;
    private _max_btn:cc.Node;
    private _btns:cc.Node;
    private _btnclear:cc.Node;
    private _back:cc.Node;

    init(): void {
        super.init();
        this._currentGold = UNodeHelper.getComponent(this._root, "current_gold", cc.Label);
        this._bankGold = UNodeHelper.getComponent(this._root, "bank_gold", cc.Label);
        this._saveGoldBtn = UNodeHelper.getComponent(this._root, "btn_saveGold", UImgBtn);
        this._getGoldBtn = UNodeHelper.getComponent(this._root, "btn_getGold", UImgBtn);
        this._getSaveCount = UNodeHelper.getComponent(this._root, "count", cc.EditBox);
        this._getBtn = UNodeHelper.find(this._root, "btn_get");
        this._saveBtn = UNodeHelper.find(this._root, "btn_save");

        this._first_btn = UNodeHelper.find(this._root,"btns/btn_100");
        this._second_btn = UNodeHelper.find(this._root,"btns/btn_500");
        this._third_btn = UNodeHelper.find(this._root,"btns/btn_1000");
        this._max_btn = UNodeHelper.find(this._root,"btns/btn_max");
        this._btnclear = UNodeHelper.find(this._root, "btn_clear");
        this._btns = UNodeHelper.find(this._root,"btns");

        this._saveGoldBtn.clickHandler = new UHandler(this.onchangesave, this);
        this._getGoldBtn.clickHandler = new UHandler(this.onchangget, this);

        UEventHandler.addClick(this._getBtn, this.node, "VBank", "ongetgold");
        UEventHandler.addClick(this._saveBtn, this.node, "VBank", "onsavegold");
        UEventHandler.addClick(this._btnclear, this.node, "VBank", "onclear");
        UEventHandler.editingDidEnded(this._getSaveCount.node, this.node, "VBank", "oninputend");
        UEventHandler.addClick(this._first_btn,this.node,"VBank","firstBtnClick");
        UEventHandler.addClick(this._second_btn,this.node,"VBank","secondBtnClick");
        UEventHandler.addClick(this._third_btn,this.node,"VBank","thirdBtnClick");
        UEventHandler.addClick(this._max_btn,this.node,"VBank","maxBtnClick");

        this._getSaveCount.node.on('editing-did-began', this.checkNumber, this);
        this._getSaveCount.node.on('editing-did-ended', this.updateNumber, this);        //监听输入框    
        this._back = UNodeHelper.find(this.node,"back");
        UEventHandler.addClick(this._back,this.node,"VBank","closeUI");
    }
    
    /**
     * 显示
     */
    show(data: any): void {
        super.show(data);
        this._data = AppGame.ins.roleModel.getbankData();
        this.binddata();
        this.showGetGold(false);
        this._getGoldBtn.node.getChildByName("lab").color = cc.color(164,116,51,255);
        this._saveGoldBtn.node.getChildByName("lab").color = cc.color(255,255,255,255);
    }

    /**
     * 清零
     */
    private onclear(): void {
        super.playclick();
        this.setresultGold(0);
    }

    /**
     * 开始输入
     */
    private checkNumber(data: any):void{
        for(var i = 0;i < this._btns.childrenCount;i++){
            this._btns.children[i].getChildByName("impress_img").active = false;
            this._btns.children[i].getChildByName("lab").color = cc.color(164,116,51,255);
        }
        this._getSaveCount.node.children[0].getComponent(cc.Sprite).spriteFrame = this.InputImg;
        if(this._getSaveCount.string.length == 0){

        }else{
            this._getSaveCount.string = "";
        }
    }

    private firstBtnClick():void{
        super.playclick();
        this._getSaveCount.string = "100";
        for(var i = 0;i < this._btns.childrenCount;i++){
            this._btns.children[i].getChildByName("impress_img").active = false;
            this._btns.children[i].getChildByName("lab").color = cc.color(164,116,51,255);
        }
        this._btns.getChildByName("btn_100").getChildByName("impress_img").active = true;
        this._btns.getChildByName("btn_100").getChildByName("lab").color = cc.color(255,255,255,255);
    }

    private secondBtnClick():void{
        super.playclick();
        this._getSaveCount.string = "500";
        for(var i = 0;i < this._btns.childrenCount;i++){
            this._btns.children[i].getChildByName("impress_img").active = false;
            this._btns.children[i].getChildByName("lab").color = cc.color(164,116,51,255);
        }
        this._btns.getChildByName("btn_500").getChildByName("impress_img").active = true;
        this._btns.getChildByName("btn_500").getChildByName("lab").color = cc.color(255,255,255,255);
    }

    private thirdBtnClick():void{
        super.playclick();
        this._getSaveCount.string = "1000";
        for(var i = 0;i < this._btns.childrenCount;i++){
            this._btns.children[i].getChildByName("impress_img").active = false;
            this._btns.children[i].getChildByName("lab").color = cc.color(164,116,51,255);
        }
        this._btns.getChildByName("btn_1000").getChildByName("impress_img").active = true;
        this._btns.getChildByName("btn_1000").getChildByName("lab").color = cc.color(255,255,255,255);
    }

    private maxBtnClick():void{
        super.playclick();
        if(this._getGoldBtn.IsOn){
            this._getSaveCount.string = parseFloat(this._bankGold.string) + "";
        }else{
            this._getSaveCount.string = parseFloat(this._currentGold.string) + "";
        }
        for(var i = 0;i < this._btns.childrenCount;i++){
            this._btns.children[i].getChildByName("impress_img").active = false;
            this._btns.children[i].getChildByName("lab").color = cc.color(164,116,51,255);
        }
        this._btns.getChildByName("btn_max").getChildByName("impress_img").active = true;
        this._btns.getChildByName("btn_max").getChildByName("lab").color = cc.color(255,255,255,255);
    }

    /**
     * 输入结束
     */
    private updateNumber(data:any):void{
        this._getSaveCount.node.children[0].getComponent(cc.Sprite).spriteFrame = this.NormalImg;
        var a = /^[1-9]\d*$/;
        if (UStringHelper.isEmptyString(this._getSaveCount.string)) {
            return;
        }else{
            this._getSaveCount.string = parseFloat(this._getSaveCount.string).toFixed(2);
        }

        // var b = /^\d+(\.\d+)?$/;
        // if(this._getSaveCount.string == ""){

        // }else{
        //     if(a.test(this._getSaveCount.string)){

        //         if(this._getGoldBtn.IsOn){
        //             if(parseFloat(this._getSaveCount.string) > this._data.bankGold/100){
        //                 this._getSaveCount.string = parseFloat(this._data.bankGold/100 +"")  + "";
        //             }else{
        //                 this._getSaveCount.string = parseFloat(this._getSaveCount.string) + "";
        //             }
        //         }else{
        //             if(parseFloat(this._getSaveCount.string) > this._data.currentGold/100){
        //                 this._getSaveCount.string = parseFloat(this._data.currentGold/100 +"") + "";                
        //             }else{
        //                 this._getSaveCount.string = parseFloat(this._getSaveCount.string) + "";
        //             }
        //         }

        //     }else{
        //         AppGame.ins.showTips(ULanHelper.INPUT_POSITIVE_INTEGER);
        //         this._getSaveCount.string = "";
        //     }

        // }
    }
    private oninputend(): void {
        if (UStringHelper.isEmptyString(this._getSaveCount.string)) {
            return;
        }
        if (!UStringHelper.isRealNum(this._getSaveCount.string)) return;
        var gold = this._getGoldBtn.IsOn ? this._data.bankGold : this._data.currentGold;
        var value = parseFloat(this._getSaveCount.string);
        if (value > gold) {
            if(this._getGoldBtn.IsOn){
                AppGame.ins.showTips("金币不足，无法从保险箱取出");
            }else{
                AppGame.ins.showTips("金币不足，无法存入保险箱");
            }
            // AppGame.ins.showTips(ULanHelper.GOLD_BUZU);
            return;
        }
        var pro = value / gold;
        if (pro > 1) pro = 1;
    }
    private setresultGold(process: number): void {
        // super.playclick();
        var gold = this._getGoldBtn.IsOn ? this._data.bankGold : this._data.currentGold;
        this._getSaveCount.string = parseFloat(UStringHelper.getMoneyFormat(gold * process * ZJH_SCALE, 4, false,false,true)) + "" ;
    }

    /**
     * 取出金币
     */
    private ongetgold(): void {

        super.playclick();
        var gold = 0;
        if (UStringHelper.isEmptyString(this._getSaveCount.string)) {   
            gold = 0;
        } else {
            gold = parseFloat(this._getSaveCount.string);
        }
        AppGame.ins.roleModel.requestTaskScoreFromBack(gold);
        this._getBtn.getComponent(cc.Button).interactable = false;
        this.scheduleOnce(function() {
            this._getBtn.getComponent(cc.Button).interactable = true;
        },1)
    }

    /**
     * 存入金币
     */
    private onsavegold(): void {
        super.playclick();
        var gold = 0;
        if (UStringHelper.isEmptyString(this._getSaveCount.string)) {
            gold = 0;
        } else {
            gold = parseFloat(this._getSaveCount.string);
        }
        AppGame.ins.roleModel.requsetSaveScoreToBack(gold);
        this._saveBtn.getComponent(cc.Button).interactable = false;
        this.scheduleOnce(function() {
            this._saveBtn.getComponent(cc.Button).interactable = true;
        },1)
    }

    /**
     * 存入
     */
    private onchangesave(): void {
        super.playclick();
        this.showGetGold(false);
        this._saveGoldBtn.node.getChildByName("lab").color = cc.color(255,255,255,255);
        this._getGoldBtn.node.getChildByName("lab").color = cc.color(164,116,51,255);
        for(var i = 0;i < this._btns.childrenCount;i++){
            this._btns.children[i].getChildByName("impress_img").active = false;
            this._btns.children[i].getChildByName("lab").color = cc.color(164,116,51,255);
        }
        
    }

    /**
     * 取出
     */
    private onchangget(): void {
        super.playclick();
        this.showGetGold(true);
        this._saveGoldBtn.node.getChildByName("lab").color = cc.color(164,116,51,255);
        this._getGoldBtn.node.getChildByName("lab").color = cc.color(255,255,255,255);
        for(var i = 0;i < this._btns.childrenCount;i++){
            this._btns.children[i].getChildByName("impress_img").active = false;
            this._btns.children[i].getChildByName("lab").color = cc.color(164,116,51,255);
        }
    }

    private binddata(): void {
        this.update_socre(this._data.currentGold);
        this.update_bank_score(this._data.bankGold);
    }

    private showGetGold(value: boolean): void {
        this._saveGoldBtn.IsOn = !value;
        this._getGoldBtn.IsOn = value;
        this._getBtn.active = value;
        this._saveBtn.active = !value;
        this.clear();
    }

    /**
     * 清零
     */
    private clear(): void {
        this._getSaveCount.string = "";
    }

    private update_socre(score: number): void {
        this._data.currentGold = score;
        this._currentGold.string = UStringHelper.getMoneyFormat(score * ZJH_SCALE , -1,false,false,true).toString();
    }

    private update_bank_score(score: number): void {
        this._data.bankGold = score;
        this._bankGold.string = UStringHelper.getMoneyFormat(score * ZJH_SCALE, -1,false,false,true).toString();
    }

    /**
     * 存入金币提示
     */
    private save_score(sucess: boolean, msg: string): void {
        AppGame.ins.showTips(msg);
        this.clear();
    }

    /**
     * 取出金币提示
     */
    private tack_score(sucess: boolean, msg: string): void {
        AppGame.ins.showTips(msg);
        this.clear();
    }

    protected onEnable(): void {
        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.update_socre, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_BANK_SCORE, this.update_bank_score, this);

        AppGame.ins.roleModel.on(MRole.SAVE_SCORE, this.save_score, this);
        AppGame.ins.roleModel.on(MRole.TAKE_SCORE, this.tack_score, this);
    }

    protected onDisable(): void {
        AppGame.ins.roleModel.off(MRole.UPDATA_SCORE, this.update_socre, this);
        AppGame.ins.roleModel.off(MRole.UPDATA_BANK_SCORE, this.update_bank_score, this);
        AppGame.ins.roleModel.off(MRole.SAVE_SCORE, this.save_score, this);
        AppGame.ins.roleModel.off(MRole.TAKE_SCORE, this.tack_score, this);
        for (let index = 0; index < this._btns.childrenCount; index++) {
            const element = this._btns.children[index];
            element.getChildByName('impress_img').active = false;
            element.getChildByName('lab').color = cc.color(164,116,51,255);
            
        }
    }

    closeUI(){
        this.playclick();
        super.clickClose();
    }
}
