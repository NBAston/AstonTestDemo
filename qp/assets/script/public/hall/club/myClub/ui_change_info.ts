// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ECommonUI } from "../../../../common/base/UAllenum";
import VWindow from "../../../../common/base/VWindow";
import UDebug from "../../../../common/utility/UDebug";
import UHandler from "../../../../common/utility/UHandler";
import AppGame from "../../../base/AppGame";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ui_change_info extends VWindow {

    @property(cc.Label)
    subordinate_id: cc.Label = null;

    @property(cc.Label)
    subordinate_name: cc.Label = null;

    @property(cc.SpriteFrame)
    sprite_partner:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    sprite_member:cc.SpriteFrame = null;

    @property(cc.Label)
    introduction:cc.Label = null;

    @property(cc.Sprite)
    sprite:cc.Sprite = null;

    private club_id:number;
    private level:string;
    private user_id:number;

    init():void{
        super.init();
    }

    start () {

    }

    private expelled_user():void{
        UDebug.log('开除此用户');
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 2, data: "确定要开除" + this.level + this.user_id + "吗？", handler: UHandler.create((a) => {
                if (a) {
                    // AppGame.ins.myClubModel.requestFireMember(this.club_id,AppGame.ins.roleModel.useId,this.user_id);
                }
            }, this)
        });
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
        this.user_id = data.a;
        this.subordinate_name.string = data.b;
        this.level = data.e;
        if(data[2] == "普通会员"){
            this.introduction.string = "当前会员为普通会员";
            this.sprite.spriteFrame = this.sprite_member;
        }else{
            this.introduction.string = "当前会员为合伙人";
            this.sprite.spriteFrame = this.sprite_partner;
        }
    }
}
