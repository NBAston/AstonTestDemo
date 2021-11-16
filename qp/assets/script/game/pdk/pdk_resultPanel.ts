import { EIconType, ERoomKind } from "../../common/base/UAllenum";
import UResManager from "../../common/base/UResManager";
import USpriteFrames from "../../common/base/USpriteFrames";
import RsaKey from "../../common/utility/RsaKey";
import UDebug from "../../common/utility/UDebug";
import UStringHelper from "../../common/utility/UStringHelper";
import AppGame from "../../public/base/AppGame";
import { CHARGE_SCALE } from "../../public/hall/lobby/MRole";
import { PDK_SCALE, PDK_SCALE_100 } from "./model/MPdk";
import UPDKHelper from "./pdk_Helper";
import pdk_Main from "./pdk_Main";

const { ccclass, property } = cc._decorator;
@ccclass
export default class pdk_resultPanel extends cc.Component {
   
    @property(sp.Skeleton) resultSpine: sp.Skeleton = null;
    @property(sp.Skeleton) resultZiSpine: sp.Skeleton = null;
    @property(cc.Node) idImg: cc.Node = null;
    @property(cc.Node) difenImg: cc.Node = null;
    @property(cc.Node) leftCardImg: cc.Node = null;
    @property(cc.Node) goldImg: cc.Node = null;

    @property(cc.Node) resultNode: cc.Node = null;
    @property(cc.Node) playerList: cc.Node[] = [];
    @property(cc.Node) playerInfoImg: cc.Node = null; // 个人信息背景
    @property(cc.Node) playerKuang: cc.Node = null; // 头像框
    @property(cc.Node) iconNode: cc.Node = null; // 头像
    @property(cc.Node) bomImg: cc.Node = null; // 炸弹流水背景框
    @property(cc.Label) nickname: cc.Label = null; // 玩家ID
    @property(cc.Label) coin: cc.Label = null; // 玩家金币
    @property(cc.Label) bomliushui: cc.Label = null; // 炸弹流水金币
    @property(cc.Label) bomlabel: cc.Label = null; // 炸弹流水
    @property(cc.Label) recordid: cc.Label = null; // 牌局编号
    @property(cc.Node) continueBtn: cc.Node = null; // 继续游戏按钮
    @property(cc.Node) exitGameBtn: cc.Node = null; // 退出游戏按钮

    _resultData: any = null;
    _myResultData: any = null;
    _otherResultData: any = null;
    _allgreatestchair: number = -1;
    _isMatch:boolean = true;
    getHeadIdForUserId(userId: number, isGetHeadUrl: boolean = false) {
        for (const key in pdk_Main.ins.playerDataList){
            let element =  pdk_Main.ins.playerDataList[key]; 
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

    show(data: any, allgreatestchair:number = -1) { 
        this._allgreatestchair = allgreatestchair;
        this.node.active = true;
        this._isMatch = true;
        this.resultNode.opacity = 0;
        this._resultData = data;
        this.recordid.string = `牌局编号:`+pdk_Main.ins.recordid;
        if(this._resultData.length == 3) {
            this._otherResultData = this._resultData.filter(item => item.chairid != AppGame.ins.pdkModel.gMeChairId);
            this._myResultData = this._resultData[this._resultData.findIndex(item => item.chairid == AppGame.ins.pdkModel.gMeChairId)];
            // UDebug.Log("this._otherResultData===="+JSON.stringify(this._otherResultData));
            // UDebug.Log("thid._myResultData === "+JSON.stringify(this._myResultData));
        }
        if(AppGame.ins.currRoomKind == ERoomKind.Club) {
            this.continueBtn.active = false;
            this.exitGameBtn.active = true;
            if(this._isMatch ) {
                pdk_Main.ins.clockStartMatch = setTimeout(() => {
                    if(this.node) {
                        this.node.active = false;
                        AppGame.ins.pdkModel.emit(UPDKHelper.PDK_SELF_EVENT.PDK_SHOW_CONTINUE_GAME, false);
                        pdk_Main.ins._music_mgr.playClick();
                    }
                },3500)
            }
        } else {
            this.continueBtn.active = true;
            this.exitGameBtn.active = false;
        }
        this.setPanelInfo();
    }
   
    setPanelInfo() {
       var path = "";
       UResManager.load(this.getHeadIdForUserId(this._myResultData.userid), EIconType.Head, this.iconNode.getComponent(cc.Sprite), this.getHeadIdForUserId(this._myResultData.userid, true));
       if(this._myResultData != null) {
           // 胜利
           if(this._myResultData.iswin == 1) {
            this.idImg.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(USpriteFrames).getFrames(AppGame.ins.currRoomKind == ERoomKind.Club?'win_name':'win_id');
            this.difenImg.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(USpriteFrames).getFrames('win_difen');
            this.leftCardImg.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(USpriteFrames).getFrames('win_card');
            this.goldImg.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(USpriteFrames).getFrames('win_gold');
            this.playerInfoImg.getComponent(cc.Sprite).spriteFrame = this.playerInfoImg.getComponent(USpriteFrames).frames[0];
            this.playerKuang.getComponent(cc.Sprite).spriteFrame = this.playerKuang.getComponent(USpriteFrames).frames[0];
            this.bomImg.getComponent(cc.Sprite).spriteFrame = this.bomImg.getComponent(USpriteFrames).frames[0];
            this.setColor(1);
            this.playResultSpine(1,this._myResultData.chairid);
            } else { // 失败
                this.idImg.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(USpriteFrames).getFrames(AppGame.ins.currRoomKind == ERoomKind.Club?'lose_name':'lose_id');
                this.difenImg.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(USpriteFrames).getFrames('lose_difen');
                this.leftCardImg.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(USpriteFrames).getFrames('lose_card');
                this.goldImg.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(USpriteFrames).getFrames('lose_gold');
                this.setColor(0);
                this.playResultSpine(0,this._myResultData.chairid);
                this.playerInfoImg.getComponent(cc.Sprite).spriteFrame = this.playerInfoImg.getComponent(USpriteFrames).frames[1];
                this.playerKuang.getComponent(cc.Sprite).spriteFrame = this.playerKuang.getComponent(USpriteFrames).frames[1];
                this.bomImg.getComponent(cc.Sprite).spriteFrame = this.bomImg.getComponent(USpriteFrames).frames[1];
           }
       }
        this.setPlayerResultUI();
        
    }

    playResultSpine(winOrLost:number, chairid:number) {
        var path = "";
        if(chairid == 0) {
            path = "ani/new_result_panel/pdk_win_lose_boy_01";
            this.playSpine(path,"boy_01_"+((winOrLost == 0?"lose":"win")+"_01"),this.resultSpine,false,()=>{
             this.playSpine(path,"boy_01_"+((winOrLost == 0?"lose":"win")+"_02"),this.resultSpine,true)
            });

        } else if(chairid == 1) {
         path = "ani/new_result_panel/pdk_win_lose_girl_01";
         this.playSpine(path,"girl_01_"+((winOrLost == 0?"lose":"win")+"_01"),this.resultSpine,false,()=>{
            this.playSpine(path,"girl_01_"+((winOrLost == 0?"lose":"win")+"_02"),this.resultSpine,true)
           });
        } else if(chairid == 2) {
         path = "ani/new_result_panel/pdk_win_lose_girl_02";
         this.playSpine(path,"girl_02_"+((winOrLost == 0?"lose":"win")+"_01"),this.resultSpine,false,()=>{
            this.playSpine(path,"girl_02_"+((winOrLost == 0?"lose":"win")+"_02"),this.resultSpine,true)
           });
        }
    }

    setColor(isWin: number) {
        var color1 = new cc.Color(255, 244, 200);
        // var color2 = new cc.Color(255, 255, 255);
        var color3 = new cc.Color(255, 255, 255);
        // this.coin.node.color = color2;
        if(isWin == 1) {
            this.nickname.node.color = color3;
            this.bomliushui.node.color = color1;
            this.bomlabel.node.color = color1;
        } else {
            this.nickname.node.color = color3;
            this.bomliushui.node.color = color3;
            this.bomlabel.node.color = color3;
        }
    }
   
    setPlayerResultUI() {
       
        if(AppGame.ins.currRoomKind == ERoomKind.Normal) {
            this.nickname.string = `ID:`+this._myResultData.userid;
        } else {
            this.nickname.string = `昵称:`+this._myResultData.nickname;
        }
        this.coin.string = UStringHelper.getMoneyFormat(this._myResultData.currentscore / PDK_SCALE_100, -1,false,true).toString();
        this.bomliushui.string = (this._myResultData.bombscore / PDK_SCALE_100).toFixed(3).slice(0,-1);
        var path = "ani/new_result_panel/w_l_words";
        var color1 = new cc.Color(255, 245, 131);
        var color2 = new cc.Color(131, 210, 255);
        var color3 = new cc.Color(255, 255, 255);
        var color4 = new cc.Color(255, 255, 255);
        if(this._myResultData.iswin == 1) {
            // if(this._myResultData.winstreaknum != 0 && this._myResultData.winstreaknum > 1) {
            //     this.playSpine(path,(this._myResultData.winstreaknum>10?10:this._myResultData.winstreaknum)+"ls",this.resultZiSpine,false)
            // } else {
                this.playSpine(path,"win",this.resultZiSpine,false)
            // }
        } else {
            this.playSpine(path,"lose",this.resultZiSpine,false)
        }

        this.playerList[0].getComponent("pdk_result_item").setItemInfo(
            this._myResultData.isbaopei,
            this._myResultData.winstat,
            AppGame.ins.currRoomKind == ERoomKind.Normal?this._myResultData.userid:this._myResultData.nickname,
           (AppGame.ins.pdkModel.currentDizhu / PDK_SCALE_100),
            (this._allgreatestchair != -1 && this._allgreatestchair == this._myResultData.chairid && this._myResultData.iswin == 1)?0:(this._myResultData.cards?this._myResultData.cards.length:0),
            this._myResultData.iswin == 1?"+"+(this._myResultData.scorechange / PDK_SCALE_100).toFixed(3).slice(0,-1):(this._myResultData.scorechange / PDK_SCALE_100).toFixed(3).slice(0,-1),
            this._myResultData.scorestatus,
            this._myResultData.iswin == 1?color1:color2
            );

        for (let index = 0; index < this._otherResultData.length; index++) {
            const element = this._otherResultData[index];
            this.playerList[index+1].getComponent("pdk_result_item").setItemInfo(
                element.isbaopei,
                element.winstat,
                AppGame.ins.currRoomKind == ERoomKind.Normal?UStringHelper.coverName(element.userid.toString()):element.nickname,
                (AppGame.ins.pdkModel.currentDizhu / PDK_SCALE_100),
                (this._allgreatestchair != -1 && this._allgreatestchair == element.chairid &&  element.iswin == 1)?0:(element.cards?element.cards.length:0),
                element.iswin == 1? "+"+(element.scorechange/ PDK_SCALE_100).toFixed(3).slice(0,-1):(element.scorechange / PDK_SCALE_100).toFixed(3).slice(0,-1),
                element.scorestatus,
                this._myResultData.iswin == 1?color3:color4
                );
        }
        var actionMove = cc.fadeIn(0.3); 
        this.resultNode.runAction(actionMove);
    }

   
    //播放spine动画
    playSpine(path:string,animation:string,skeleton:sp.Skeleton,loop:boolean,callback?:Function): void {
        if (AppGame.ins.roomModel.BundleName == "") return
        UDebug.Log("name: " + AppGame.ins.roomModel.BundleName)
        let bundle = cc.assetManager.getBundle(AppGame.ins.roomModel.BundleName)
        bundle.load(path, sp.SkeletonData, function(err, res:any){
            if(err) cc.error(err)
            cc.loader.setAutoRelease(res, true)
            skeleton.skeletonData = res
            skeleton.setAnimation(0, animation, loop)
            skeleton.setCompleteListener((event) =>{
                if (callback != undefined ) callback()
            })
        })

    }

    hide(event:any, index:string){
        this.resultSpine.skeletonData = null;
        this.node.active = false
        this._isMatch = false;
        // AppGame.ins.pdkModel.emit(UPDKHelper.PDK_SELF_EVENT.PDK_SHOW_LEFT_CARDS,this._resultData);
        if(index == "1") {
            if(AppGame.ins.currRoomKind == ERoomKind.Club) {
                AppGame.ins.pdkModel.emit(UPDKHelper.PDK_SELF_EVENT.PDK_SC_TS_START_MATCH);
                AppGame.ins.pdkModel.emit(UPDKHelper.PDK_SELF_EVENT.PDK_SHOW_CONTINUE_GAME, false);
            } else {
                AppGame.ins.pdkModel.emit(UPDKHelper.PDK_SELF_EVENT.PDK_SHOW_CONTINUE_GAME, true);
            }
        } else {
            AppGame.ins.pdkModel.emit(UPDKHelper.PDK_SELF_EVENT.PDK_SHOW_CONTINUE_GAME, false);
        }
        
        pdk_Main.ins._music_mgr.playClick();
    }

     //继续游戏
     continueGame(event:any, index:string){
        pdk_Main.ins._music_mgr.playClick();
        AppGame.ins.pdkModel.emit(UPDKHelper.PDK_SELF_EVENT.PDK_SC_TS_START_MATCH);
        this.hide(null, index);
    }

    // 退出游戏
    exitGame() {
        pdk_Main.ins._music_mgr.playClick();
        AppGame.ins.pdkModel.exitGame();
    }


}
