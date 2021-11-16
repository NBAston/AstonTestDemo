import USpriteFrames from "../../common/base/USpriteFrames";
import RsaKey from "../../common/utility/RsaKey";
import UDebug from "../../common/utility/UDebug";
import UStringHelper from "../../common/utility/UStringHelper";
import AppGame from "../../public/base/AppGame";
import { CHARGE_SCALE } from "../../public/hall/lobby/MRole";
import { PDK_SCALE } from "./model/MPdk_hy";
import UPDKHelper_hy from "./pdk_Helper_hy";
import pdk_Main_hy from "./pdk_Main_hy";

const { ccclass, property } = cc._decorator;
@ccclass
export default class pdk_resultPanel_hy extends cc.Component {
   
    @property(sp.Skeleton) resultSpine: sp.Skeleton = null;
    @property(sp.Skeleton) resultZiSpine: sp.Skeleton = null;
    @property(cc.Node) idImg: cc.Node = null;
    @property(cc.Node) difenImg: cc.Node = null;
    @property(cc.Node) leftCardImg: cc.Node = null;
    @property(cc.Node) goldImg: cc.Node = null;

    @property(cc.Node) resultNode: cc.Node = null;
    @property(cc.Node) playerList: cc.Node[] = [];
    @property(cc.Node) rewuImg: cc.Node = null; // 人物节点
    @property(cc.Node) playerInfoImg: cc.Node = null; // 个人信息背景
    @property(cc.Node) playerKuang: cc.Node = null; // 头像框
    @property(cc.Node) bomImg: cc.Node = null; // 炸弹流水背景框
    @property(cc.Label) nickname: cc.Label = null; // 玩家ID
    @property(cc.Label) coin: cc.Label = null; // 玩家金币
    @property(cc.Label) bomliushui: cc.Label = null; // 炸弹流水金币
    @property(cc.Label) bomlabel: cc.Label = null; // 炸弹流水
    @property(cc.Label) recordid: cc.Label = null; // 牌局编号

    _resultData: any = null;
    _myResultData: any = null;
    _otherResultData: any = null;

    show(data: any) {
        this.node.active = true;
        this.resultNode.opacity = 0;
        this._resultData = data;
        this.recordid.string = pdk_Main_hy.ins.recordId.string;
        if(this._resultData.length == 3) {
            this._otherResultData = this._resultData.filter(item => item.chairid != AppGame.ins.fPdkModel.gMeChairId);
            this._myResultData = this._resultData[this._resultData.findIndex(item => item.chairid == AppGame.ins.fPdkModel.gMeChairId)];
            // UDebug.Log("this._otherResultData===="+JSON.stringify(this._otherResultData));
            // UDebug.Log("thid._myResultData === "+JSON.stringify(this._myResultData));
        }
        this.setPanelInfo();
    }

   
    setPanelInfo() {
       if(this._myResultData != null) {
           // 胜利
           if(this._myResultData.iswin == 1) {
               this.idImg.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(USpriteFrames).getFrames('win_id');
               this.difenImg.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(USpriteFrames).getFrames('win_difen');
               this.leftCardImg.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(USpriteFrames).getFrames('win_card');
               this.goldImg.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(USpriteFrames).getFrames('win_gold');
               this.playerInfoImg.getComponent(cc.Sprite).spriteFrame = this.playerInfoImg.getComponent(USpriteFrames).frames[0];
               this.playerKuang.getComponent(cc.Sprite).spriteFrame = this.playerKuang.getComponent(USpriteFrames).frames[0];
               this.bomImg.getComponent(cc.Sprite).spriteFrame = this.bomImg.getComponent(USpriteFrames).frames[0];
               this.setColor(1);
               this.playResultSpine(1,this._myResultData.chairid);
            } else { // 失败
                this.idImg.getComponent(cc.Sprite).spriteFrame = this.node.getComponent(USpriteFrames).getFrames('lose_id');
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
            this.playSpine(path,"boy_01_"+(winOrLost == 0?"lose":"win"+"_01"),this.resultSpine,false,()=>{
             this.playSpine(path,"boy_01_"+(winOrLost == 0?"lose":"win"+"_02"),this.resultSpine,true)
            });

        } else if(chairid == 1) {
         path = "ani/new_result_panel/pdk_win_lose_girl_01";
         this.playSpine(path,"girl_01_"+(winOrLost == 0?"lose":"win"+"_01"),this.resultSpine,false,()=>{
            this.playSpine(path,"girl_01_"+(winOrLost == 0?"lose":"win"+"_02"),this.resultSpine,true)
           });
        } else if(chairid == 2) {
         path = "ani/new_result_panel/pdk_win_lose_girl_02";
         this.playSpine(path,"girl_02_"+(winOrLost == 0?"lose":"win"+"_01"),this.resultSpine,false,()=>{
            this.playSpine(path,"girl_02_"+(winOrLost == 0?"lose":"win"+"_02"),this.resultSpine,true)
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
       
        this.nickname.string = this._myResultData.userid;
        this.coin.string = `${this._myResultData.currentscore * PDK_SCALE}`
        this.bomliushui.string = `${this._myResultData.bombscore * PDK_SCALE}`
        var path = "ani/result_panel/meishuzi";
        var color1 = new cc.Color(255, 245, 131);
        var color2 = new cc.Color(131, 210, 255);
        var color3 = new cc.Color(255, 255, 255);
        var color4 = new cc.Color(255, 255, 255);
        if(this._myResultData.iswin == 1) {
            if(this._myResultData.winstreaknum != 0) {
                this.playSpine(path,(this._myResultData.winstreaknum>10?10:this._myResultData.winstreaknum)+"liansheng",this.resultZiSpine,false)
            } else {
                this.playSpine(path,"shengli",this.resultZiSpine,false)
            }
        } else {
            this.playSpine(path,"shibai",this.resultZiSpine,false)
        }

        this.playerList[0].getComponent("pdk_result_item_hy").setItemInfo(
            this._myResultData.isbaopei,
            this._myResultData.winstat,
            this._myResultData.userid,
           (AppGame.ins.fPdkModel.currentDizhu * PDK_SCALE),
            this._myResultData.cards?this._myResultData.cards.length:0,
            this._myResultData.iswin == 1?"+"+(this._myResultData.scorechange * PDK_SCALE):(this._myResultData.scorechange * PDK_SCALE),
            this._myResultData.scorestatus,
            this._myResultData.iswin == 1?color1:color3
            );

        for (let index = 0; index < this._otherResultData.length; index++) {
            const element = this._otherResultData[index];
            this.playerList[index+1].getComponent("pdk_result_item_hy").setItemInfo(
                element.isbaopei,
                element.winstat,
                UStringHelper.coverName(element.userid.toString()),
                (AppGame.ins.fPdkModel.currentDizhu * PDK_SCALE),
                element.cards?element.cards.length:0,
                element.iswin == 1? "+"+(element.scorechange* PDK_SCALE):(element.scorechange * PDK_SCALE),
                element.scorestatus,
                this._myResultData.iswin == 1?color2:color4
                );
        }
        var actionMove = cc.fadeIn(0.2);
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
        // this.renwuNode.setPosition(cc.v2(-861,75));
        this.node.active = false
        // AppGame.ins.fPdkModel.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SHOW_LEFT_CARDS,this._resultData);
        if(index == "1") {
            AppGame.ins.fPdkModel.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SHOW_CONTINUE_GAME, true);
        } else {
            AppGame.ins.fPdkModel.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SHOW_CONTINUE_GAME, false);
        }
        
        pdk_Main_hy.ins._music_mgr.playClick();
    }

     //继续游戏
     continueGame(event:any, index:string){
        AppGame.ins.fPdkModel.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SC_TS_START_MATCH);
        this.hide(null, index);
    }


}
