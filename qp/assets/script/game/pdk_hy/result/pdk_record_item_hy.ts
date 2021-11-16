
import { isMainThread } from "worker_threads";
import { EIconType } from "../../../common/base/UAllenum";
import UResManager from "../../../common/base/UResManager";
import USpriteFrames from "../../../common/base/USpriteFrames";
import UDebug from "../../../common/utility/UDebug";
import AppGame from "../../../public/base/AppGame";
import MPdk_hy from "../model/MPdk_hy";
import pdk_Main_hy from "../pdk_Main_hy";


const { ccclass, property } = cc._decorator;
@ccclass
export default class pdk_record_item_hy extends cc.Component { 
    @property(cc.Node) iconNode: cc.Node = null; // 头像框
    @property(cc.Label) nickname: cc.Label = null;
    @property(cc.Label) lastscore: cc.Label = null;
    @property(cc.Label) allscore: cc.Label = null;
    @property(cc.Node) win_icon: cc.Node = null; // 赢图标
    @property(cc.Node) ziji_icon: cc.Node = null; // 赢图标
    @property(cc.Node) icon_kuang: cc.Node = null; // 头像框

    getHeadIdForUserId(userId: number, isGetHeadUrl: boolean = false) {
        for (const key in pdk_Main_hy.ins.playerDataList){
            let element =  pdk_Main_hy.ins.playerDataList[key]; 
            if (element.userId == userId) {
                if(isGetHeadUrl) {
                    return element.headImgUrl;
                } else {
                    return element.headId;
                }
            }
        }
        return isGetHeadUrl?``:0;
    }

    getHeadUrlForUserId(userId: number, isGetHeadUrl: boolean = false) {
        for (const key in pdk_Main_hy.ins.playerDataList){
            let element =  pdk_Main_hy.ins.playerDataList[key]; 
            if (element.userId == userId) {
                if(isGetHeadUrl) {
                    return element.headImgUrl;
                } else {
                    return element.headId;
                }
            }
        }
        return isGetHeadUrl?``:0;
    }

    getHeadIdForHeadBoxId(userId: number) {
        let headBoxId = 0;
        for (let key in AppGame.ins.fPdkModel.gBattlePlayer){
            if(AppGame.ins.fPdkModel.gBattlePlayer[key].userId == userId){
                headBoxId = AppGame.ins.fPdkModel.gBattlePlayer[key].headboxId;
                break;
            }
        }
        return headBoxId;
    }

    setItemInfo(index:number, userId:number, lastscore: number, allscore: number, bPlayingLast: boolean = false) {
        UResManager.load(this.getHeadIdForUserId(userId), EIconType.Head, this.iconNode.getComponent(cc.Sprite), this.getHeadUrlForUserId(userId, true));
        UResManager.load(this.getHeadIdForHeadBoxId(userId), EIconType.Frame, this.icon_kuang.getComponent(cc.Sprite));
        this.node.active = true;
        // var color1 = new cc.Color(53, 172, 81);
        // var color2 = new cc.Color(245, 2, 2);
        // var color3 = new cc.Color(127, 162, 203);

        if(index == 0) {
            if(bPlayingLast) {
                this.win_icon.opacity = 255;
            }
            // this.icon_kuang.getComponent("MagicSprite").index = 0;
        } else {
            // this.icon_kuang.getComponent("MagicSprite").index = 1;
            this.win_icon.opacity = 0;
        }
        if(AppGame.ins.roleModel.useId == userId) {
            // this.ziji_icon.active = index == 0?false:true;
            this.nickname.string = "我";
            this.node.getComponent("MagicSprite").index = 1;
        } else {
            // this.ziji_icon.active = false;
            this.node.getComponent("MagicSprite").index = 0;
            this.nickname.string = userId+"";
        }

        // this.lastscore.node.color = lastscore > 0?color1:color2;
        // this.allscore.node.color = allscore > 0?color1:color2;
        this.allscore.string = allscore >= 0? "+"+allscore:allscore+"";
        if(bPlayingLast) {
            this.lastscore.string = lastscore >= 0? "+"+lastscore:lastscore+"";
        } else {
            this.lastscore.string = "未参与"
            // this.lastscore.node.color = color3;
            // this.allscore.node.color = color3;
        }
    }


}
