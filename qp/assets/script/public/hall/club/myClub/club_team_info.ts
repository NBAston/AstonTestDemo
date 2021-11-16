// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ECommonUI } from "../../../../common/base/UAllenum";
import UAudioManager from "../../../../common/base/UAudioManager";
import { ClubHallServer } from "../../../../common/cmd/proto";
import UDebug from "../../../../common/utility/UDebug";
import UEventHandler from "../../../../common/utility/UEventHandler";
import UStringHelper from "../../../../common/utility/UStringHelper";
import AppGame from "../../../base/AppGame";
import { ZJH_SCALE } from "../../lobby/VHall";
import MClub from "./MClub";

const {ccclass, property} = cc._decorator;

@ccclass
export default class club_team_info extends cc.Component {

    @property(cc.Toggle)
    club_toggle: cc.Toggle = null;

    @property(cc.Toggle)
    level_toggle: cc.Toggle = null;

    @property(cc.Node)
    label_node:cc.Node = null;

    @property(cc.Node)
    item:cc.Node = null;

    @property(cc.Node)
    no_data:cc.Node = null;

    @property(cc.EditBox)
    editbox:cc.EditBox = null;

    @property(cc.SpriteFrame)
    editbox_img_normal:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    editbox_img_input:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    arrow_up:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    arrow_down:cc.SpriteFrame = null;

    @property(cc.Sprite)
    club_toggle_sprite:cc.Sprite = null;

    @property(cc.Sprite)
    level_toggle_sprite:cc.Sprite = null;

    @property(cc.Node)
    content:cc.Node = null;

    @property(cc.SpriteFrame)
    toggle_single:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    toggle_double:cc.SpriteFrame = null;

    @property(cc.Node)
    club_toggle_item: cc.Node = null;

    @property(cc.Node)
    level_toggle_item: cc.Node = null;

    private club_id:number = 0;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.editbox.node.on("editing-did-began",this.startInput,this);
        this.editbox.node.on("editing-did-ended",this.getInput,this);
    }

    /**
    * 开始输入
    */
    private startInput():void{
        UAudioManager.ins.playSound("audio_click");
        this.editbox.node.getComponentInChildren(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    /**
     * 结束输入
     */
    private getInput():void{
        this.editbox.node.getComponentInChildren(cc.Sprite).spriteFrame = this.editbox_img_normal;
    }

    private club_toggle_click():void{
        this.club_toggle_sprite.spriteFrame = this.club_toggle.isChecked ? this.arrow_up : this.arrow_down;
    }

    private level_toggle_click():void{
        this.level_toggle_sprite.spriteFrame = this.level_toggle.isChecked ? this.arrow_up : this.arrow_down;
        if(this.club_toggle.isChecked){
            this.club_toggle.isChecked = false;
            this.club_toggle_sprite.spriteFrame = this.arrow_down;
        }
    }

    private getMyClub(caller:ClubHallServer.GetMyClubMessageResponse):void{
        if(caller.clubItem.length == 0){
            this.club_toggle.node.getChildByName("checkmark").getChildByName("content").removeAllChildren();
            this.level_toggle.getComponent(cc.Toggle).enabled = false;
            this.club_toggle.node.getChildByName("Background").getComponentInChildren(cc.Label).string = "-";
            this.club_toggle.node.getChildByName("Background").getChildByName("arrow").active = false;
            this.level_toggle.node.getChildByName("Background").getComponentInChildren(cc.Label).string = "-";
            this.level_toggle.node.getChildByName("Background").getChildByName("arrow").active = false;
            this.content.removeAllChildren();
            let no_data = cc.instantiate(this.no_data);
            no_data.parent = this.content;
        }else{
            this.club_toggle.node.getChildByName("checkmark").getChildByName("content").removeAllChildren();
            this.level_toggle.enabled = true;
            this.club_toggle.node.getChildByName("Background").getChildByName("arrow").active = true;
            this.level_toggle.node.getChildByName("Background").getChildByName("arrow").active = true;
            for (let index = 0; index < caller.clubItem.length; index++) {
                let item = cc.instantiate(this.club_toggle_item);
                item.parent = this.club_toggle.node.getChildByName("checkmark").getChildByName("content");
                if(index % 2 == 0){
                    item.getComponent(cc.Sprite).spriteFrame = this.toggle_double;
                }else{
                    item.getComponent(cc.Sprite).spriteFrame = this.toggle_single;
                }
                item.getComponentInChildren(cc.Label).string = caller.clubItem[index].clubName;

                let a = caller.clubItem[index].clubName;
                let b = caller.clubItem[index].clubId
                UEventHandler.addClick(item, this.node, "club_team_info", "clubToggleClick",{a,b});
                if(index == 0){
                    this.club_toggle.node.getChildByName("Background").getComponentInChildren(cc.Label).string = caller.clubItem[index].clubName;
                    this.club_id = caller.clubItem[index].clubId;
                }
            }
            if(caller.clubItem[0].clubId == caller.userId){
                this.level_toggle.node.getChildByName("checkmark").getChildByName("content").getChildByName("item1").active = true;
                this.level_toggle.node.getChildByName("Background").getComponentInChildren(cc.Label).string = "全部";
            }else{
                this.level_toggle.node.getChildByName("checkmark").getChildByName("content").getChildByName("item1").active = true;
                this.level_toggle.node.getChildByName("Background").getComponentInChildren(cc.Label).string = "全部";
            }
            let clubId = this.club_id;
            let type = this.getType(this.level_toggle.node.getComponentInChildren(cc.Label).string);
            if(this.editbox.string == ""){
                var searchPromoterId = 0;
            }else{
                var searchPromoterId = parseInt(this.editbox.string);
            }
            AppGame.ins.myClubModel.requestClubMyTeam(clubId,type,searchPromoterId);
        }
    }

    private clubToggleClick(evetn,i):void{
        this.club_toggle.node.getChildByName("Background").getComponentInChildren(cc.Label).string = i.a;
        this.club_id = i.b;
        this.club_toggle.isChecked = false;
        this.club_toggle_sprite.spriteFrame = this.arrow_down;
        let type = this.getType(this.level_toggle.node.getComponentInChildren(cc.Label).string);
        if(this.editbox.string == ""){
            var searchPromoterId = 0;
        }else{
            var searchPromoterId = parseInt(this.editbox.string);
        }
        AppGame.ins.myClubModel.requestClubMyTeam(this.club_id,type,searchPromoterId);
    }

    private levelToggleClick(event,customEventData):void{
        this.level_toggle.node.getChildByName("Background").getComponentInChildren(cc.Label).string = customEventData;
        this.level_toggle.isChecked = false;
        this.level_toggle_sprite.spriteFrame = this.arrow_down;
        let clubId = this.club_id;
        let type = this.getType(this.level_toggle.node.getComponentInChildren(cc.Label).string);
        if(this.editbox.string == ""){
            var searchPromoterId = 0;
        }else{
            var searchPromoterId = parseInt(this.editbox.string);
        }
        AppGame.ins.myClubModel.requestClubMyTeam(clubId,type,searchPromoterId);
    }



    private checkMember():void{
        if(this.club_toggle.node.getChildByName("Background").getChildByName("arrow").active == false){
            AppGame.ins.showTips("您没有加入俱乐部，无法查询");
        }else{
            let clubId = this.club_id;
            let type = this.getType(this.level_toggle.node.getComponentInChildren(cc.Label).string);
            if(this.editbox.string == ""){
                var searchPromoterId = 0;
            }else{
                var searchPromoterId = parseInt(this.editbox.string);
            }
            AppGame.ins.myClubModel.requestClubMyTeam(clubId,type,searchPromoterId);
        }
    }

    private getMyClubTeam(caller:ClubHallServer.GetMyTeamMessageResponse):void{
        if(caller.teamItems.length == 0){
            this.content.removeAllChildren();
            let no_data = cc.instantiate(this.no_data);
            no_data.parent = this.content;
        }else{
            this.content.removeAllChildren();
            for (let index = 0; index < caller.teamItems.length; index++) {
                let item = cc.instantiate(this.item);
                item.parent = this.content;

                item.getChildByName("id").getComponent(cc.Label).string = caller.teamItems[index].memberId;
                item.getChildByName("name").getComponent(cc.Label).string = caller.teamItems[index].memberName;
                if(caller.teamItems[index].promoterRate == -1){
                    item.getChildByName("level").getComponent(cc.Label).string = "会员";
                }else{
                    if(caller.teamItems[index].status == -2){
                        item.getChildByName("level").getComponent(cc.Label).string = "合伙人停用";
                    }else if(caller.teamItems[index].status == -1){
                        item.getChildByName("level").getComponent(cc.Label).string = "会员停用";
                    }else if(caller.teamItems[index].status == 0){
                        item.getChildByName("level").getComponent(cc.Label).string = "退出";
                    }else if(caller.teamItems[index].status == 1){
                        item.getChildByName("level").getComponent(cc.Label).string = "会员";
                    }else if(caller.teamItems[index].status == 2){
                        if(caller.teamItems[index].memberId == caller.clubId){
                            item.getChildByName("level").getComponent(cc.Label).string = "盟主(" + caller.teamItems[index].promoterRate + "%)";
                        }else{
                            item.getChildByName("level").getComponent(cc.Label).string = "合伙人(" + caller.teamItems[index].promoterRate + "%)";
                        }
                    }
                }
                item.getChildByName("performance").getComponent(cc.Label).string =(caller.teamItems[index].todayRevenue * ZJH_SCALE).toFixed(2);
                if(caller.teamItems[index].thisWeekRevenue <= 0 && caller.teamItems[index].status == 1){
                    item.getChildByName("weekly_performance").getComponent(cc.Label).string = "-";
                }else{
                    item.getChildByName("weekly_performance").getComponent(cc.Label).string = (caller.teamItems[index].thisWeekRevenue * ZJH_SCALE).toFixed(2);
                }
                
                if(caller.teamItems[index].teamPlayerCount == -1){
                    item.getChildByName("team_num").getComponent(cc.Label).string = "-";
                }else{
                    item.getChildByName("team_num").getComponent(cc.Label).string = caller.teamItems[index].teamPlayerCount + "";
                }


                let a = caller.teamItems[index].memberId;
                let b = caller.teamItems[index].memberName;
                let c = caller.teamItems[index].promoterRate;
                let d = MClub.getClubInfoByClubId(caller.clubId).rate;
                // let e = caller.teamItems[index].levelName;
                let f = caller.clubId;


                if(caller.teamItems[index].status == 2){
                    if(caller.teamItems[index].memberId == caller.clubId){
                        item.getChildByName("btn1").active = false;
                        item.getChildByName("btn2").active = false;
                    }else{
                        item.getChildByName("btn1").active = true;
                        item.getChildByName("btn2").active = false;
                        UEventHandler.addClick(item.getChildByName("btn1"),this.node,"club_team_info","directPartner",{a,b,c,d,f});
                    }
                }else if(caller.teamItems[index].status == 1){
                    item.getChildByName("btn1").active = false;
                    item.getChildByName("btn2").active = true;
                    UEventHandler.addClick(item.getChildByName("btn2"),this.node,"club_team_info","directMember",{a,b,d,f});
                } 
            }
        }
    }


    private directPartner(event:Event,a){
        AppGame.ins.showUI(ECommonUI.CLUB_CHANGE_SCALE,a);
    }

    private directMember(event:Event,a){
        AppGame.ins.showUI(ECommonUI.CLUB_LEVEL_UP,a);
    }

    private checkInfo(event:Event,a){
        AppGame.ins.showUI(ECommonUI.CLUB_CHANGE_INFO,a);
    }

    private upgradeSuccess(caller:ClubHallServer.BecomePartnerMessageResponse):void{
        AppGame.ins.showTips("恭喜  " + caller.userId + "成功升级为合伙人");
        this.checkMember();
    }

    private getSubordinateRate (caller: ClubHallServer.SetSubordinateRateMessageResponse):void{
        let clubId = this.club_id;
        let type = this.getType(this.level_toggle.node.getComponentInChildren(cc.Label).string);
        if(this.editbox.string == ""){
            var searchPromoterId = 0;
        }else{
            var searchPromoterId = parseInt(this.editbox.string);
        }
        AppGame.ins.myClubModel.requestClubMyTeam(clubId,type,searchPromoterId);
    }

    private btnOneClick():void{
        this.club_toggle.isChecked = false;
        this.club_toggle_sprite.spriteFrame = this.arrow_down;
    }

    private btnTwoClick():void{
        this.level_toggle.isChecked = false;
        this.level_toggle_sprite.spriteFrame = this.arrow_down;
    }

    getType(n:string):number{
        let a = 0;
        if(n == "全部"){
            a = 0;
        }else if(n == "直属合伙人"){
            a = 1;
        }else if(n == "直属会员"){
            a = 2;
        }
        return a 
    }

    resetUI(){
        this.editbox.string = '';
        this.club_toggle.isChecked = false;
        this.level_toggle.isChecked = false;
        this.level_toggle.node.getChildByName("Background").getComponentInChildren(cc.Label).string = "-";
        this.content.removeAllChildren();
        let no_data = cc.instantiate(this.no_data);
        no_data.parent = this.content;
        AppGame.ins.myClubModel.requestGetMyClub();
    }

    protected onEnable():void{
        this.resetUI();
        AppGame.ins.myClubModel.on(MClub.MY_CLUB_GET_MY_CLUB,this.getMyClub,this);
        AppGame.ins.myClubModel.on(MClub.UPDATE_CLUB_TEAM,this.getMyClubTeam,this);
        AppGame.ins.myClubModel.on(MClub.BECOME_PARTNER,this.upgradeSuccess,this);
        AppGame.ins.myClubModel.on(MClub.UPDATE_SUBORDINATE_RATE,this.getSubordinateRate,this);
    }

    protected onDisable():void{
        AppGame.ins.myClubModel.off(MClub.MY_CLUB_GET_MY_CLUB,this.getMyClub,this);
        AppGame.ins.myClubModel.off(MClub.UPDATE_CLUB_TEAM,this.getMyClubTeam,this);
        AppGame.ins.myClubModel.off(MClub.BECOME_PARTNER,this.upgradeSuccess,this);
        AppGame.ins.myClubModel.off(MClub.UPDATE_SUBORDINATE_RATE,this.getSubordinateRate,this);

    }

    // update (dt) {}
}
