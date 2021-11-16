import { EIconType, ERoomKind } from "../../common/base/UAllenum";
import UResManager from "../../common/base/UResManager";
import UDebug from "../../common/utility/UDebug";
import AppGame from "../../public/base/AppGame";
import UDDZHelper from "./ddz_Helper";
import ddz_Main from "./ddz_Main";
import ddz_ResultItem from "./ddz_ResultItem";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ddz_ResultPanel extends cc.Component {
  
    @property(sp.Skeleton) spBg: sp.Skeleton = null
    @property(sp.Skeleton) spWinCount: sp.Skeleton = null
    @property(ddz_ResultItem) itemList: ddz_ResultItem[] = [] 
    @property(cc.Label) useid: cc.Label = null 
    @property(cc.Label) gold: cc.Label = null
    @property(cc.Sprite) face: cc.Sprite = null
    @property(cc.Sprite) frame: cc.Sprite = null
    @property(cc.Label) recordId: cc.Label = null
    @property(cc.Sprite) spContinue: cc.Sprite = null
    @property(cc.Sprite) spDetail: cc.Sprite = null
    @property(cc.Node) tipAutoStart: cc.Node = null
    @property(cc.Label) labTitleName: cc.Label = null

    public show(data:any){
        var result = data.gameresult
        for(var i=0; i<result.length; i++){
             const element = result[i]
             if (element.chairid == AppGame.ins.ddzModel.gMeChairId){
                var selfItem = element
                result.splice(i,1)
                break
             }
        }
        //自己放在第一位
        result.unshift(selfItem)

        //显示动画背景
        var playerSex = ""
        if (AppGame.ins.ddzModel.gMeChairId == 0) playerSex = "boy_01"
        else if (AppGame.ins.ddzModel.gMeChairId == 1) playerSex = "girl_01"
        else if (AppGame.ins.ddzModel.gMeChairId == 2) playerSex = "girl_02"
        var path = "ani/gameover/ddz_win_lose_" + playerSex
        var animation1 =  selfItem.iswin ? playerSex + "_win_01" : playerSex + "_lose_01"
        var animation2 =  selfItem.iswin ? playerSex + "_win_02" : playerSex + "_lose_02"
        ddz_Main.ins.playSpine(path,animation1,this.spBg,false,()=>{
            ddz_Main.ins.playSpine(path,animation2,this.spBg,true)
        })
        //连胜局数
        var pathWinCount = "ani/gameover/w_l_words"
        var action =  selfItem.iswin ? "win" : "lose" 
        ddz_Main.ins.playSpine(pathWinCount,action,this.spWinCount,false)
        //个人信息
        if(AppGame.ins.currRoomKind == ERoomKind.Normal){
           this.useid.string = "ID: " + AppGame.ins.roleModel.useId.toString()
           this.labTitleName.string = "ID"
        }else if (AppGame.ins.currRoomKind == ERoomKind.Club){
            this.useid.string = "昵称: " + AppGame.ins.roleModel.nickName
            this.labTitleName.string = "昵称"
        }

        this.gold.string = (selfItem.currentsocre/100).toString()
        //详情提示按钮
        var pathDetail = selfItem.iswin ? "texture/anniu1" : "texture/anniu0"
        UResManager.loadUrlByBundle(AppGame.ins.roomModel.BundleName,pathDetail, this.spDetail);
        //头像框
        var pathFace = selfItem.iswin ? "texture/facewin" : "texture/facelost"
        UResManager.loadUrlByBundle(AppGame.ins.roomModel.BundleName,pathFace, this.frame);
        //头像
        UResManager.load(AppGame.ins.roleModel.headId, EIconType.Head, this.face,AppGame.ins.roleModel.headImgUrl);


        //牌局编号
        this.recordId.string = ddz_Main.ins.recordId.string
        this.node.active = true
        //显示列表信息
        for(var i=0; i<this.itemList.length; i++){
            this.itemList[i].show(result[i])
        }
        //继续按钮
        var btnIconPath = AppGame.ins.currRoomKind == ERoomKind.Club ?  "texture/tuichuyouxi" : "texture/jixuyouxi"
        UResManager.loadUrlByBundle(AppGame.ins.roomModel.BundleName,btnIconPath, this.spContinue);
        this.tipAutoStart.active = AppGame.ins.currRoomKind == ERoomKind.Club ? true : false
    }

    hide(){
        this.node.active = false
        this.spBg.skeletonData = null
    }

    //继续游戏
    continueGame(){
        //俱乐部代表退出游戏
        if (AppGame.ins.currRoomKind == ERoomKind.Club){
            AppGame.ins.ddzModel.exitGame();
        }
        else{
            AppGame.ins.ddzModel.emit(UDDZHelper.DDZ_SELF_EVENT.DDZ_SC_TS_START_MATCH);
        }
        this.hide()
    }

    //继续游戏
    onClick(){
        this.itemList[0].multipleTipPopup.runAction(cc.scaleTo(0.15, 0));
    }
}
