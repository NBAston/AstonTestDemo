// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ECommonUI } from "../../../../common/base/UAllenum";
import VWindow from "../../../../common/base/VWindow";
import UDebug from "../../../../common/utility/UDebug";
import UStringHelper from "../../../../common/utility/UStringHelper";
import AppGame from "../../../base/AppGame";
import MClub from "./MClub";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ui_level_up extends VWindow{

    @property(cc.Label)
    subordinate_id: cc.Label = null;

    @property(cc.Label)
    subordinate_name: cc.Label = null;

    @property(cc.EditBox)
    editbox:cc.EditBox = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private user_id:number;
    private club_id:number;
    private user_rate:number;

    init():void{
        super.init();
    }

    start () {
        this.editbox.node.on("editing-did-ended", this.getInput, this);
    }

    closeUI(){
        super.playclick();
        super.clickClose();
    }

    /**
     *  隐藏
     */
    hide(): void {
        this.node.active = false;
    }
    /**
     * 显示
     */
    show(data: any): void {
        super.show(data);
        this.subordinate_id.string = data.a;
        this.subordinate_name.string = data.b;
        this.user_id = data.a;
        this.club_id = data.f;
        this.user_rate = data.d;
        this.editbox.node.getChildByName("PLACEHOLDER_LABEL").getComponent(cc.Label).string = "请输入升级后分成比例，最高为" + this.user_rate + "%";
    }

    private requestUpgrade():void{
        if(UStringHelper.isInt(this.editbox.string)){
            AppGame.ins.myClubModel.requestBecomePartner(this.club_id,this.user_id,parseInt(this.editbox.string));
        }else{
            AppGame.ins.showTips("请输入下级分成比例");
        }   
    }

    private getInput():void{
        if(parseInt(this.editbox.string) > this.user_rate){
            AppGame.ins.showTips("输入的分成不能高于" + this.user_rate + "%");
        }
        if(!UStringHelper.isInt(this.editbox.string)){
            if(parseInt(this.editbox.string) == 0){
                AppGame.ins.showTips("下级分成比例不能设置为0");
            }else if(this.editbox.string == ""){
                // AppGame.ins.showTips("您输入的内容含有特殊字符，请重新输入");
                return
            }else{
                AppGame.ins.showTips("您输入的内容含有特殊字符，请重新输入");
            }

            this.editbox.string = "";
        }
    }

    private expelled_user():void{
        UDebug.log('开除此用户');
    }    

    private upgradeSuccess():void{
        super.playclick();
        super.clickClose();
        let a = this.subordinate_id.string;
        let b = this.subordinate_name.string;
        let c = 1;
        let d = MClub.getClubInfoByClubId(this.club_id).rate;
        let f = this.club_id;
        // AppGame.ins.showUI(ECommonUI.CLUB_CHANGE_SCALE,{a,b,c,d,f});
    }

    protected onEnable(){
        this.editbox.string = "";
        AppGame.ins.myClubModel.on(MClub.BECOME_PARTNER,this.upgradeSuccess,this);
    }

    protected onDisable(){
        AppGame.ins.myClubModel.off(MClub.BECOME_PARTNER,this.upgradeSuccess,this);
    }
    // update (dt) {}
}
