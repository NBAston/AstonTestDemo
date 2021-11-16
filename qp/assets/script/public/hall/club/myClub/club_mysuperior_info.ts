import AppGame from "../../../base/AppGame";
import MClubHall from "../hall/MClubHall";
import {ClubHallServer, Game, HallServer} from "../../../../common/cmd/proto";
import ULanHelper from "../../../../common/utility/ULanHelper";
import {UAPIHelper} from "../../../../common/utility/UAPIHelper";
import UResManager from "../../../../common/base/UResManager";
import {EIconType} from "../../../../common/base/UAllenum";
import UDebug from "../../../../common/utility/UDebug";
import UMsgCenter from "../../../../common/net/UMsgCenter";
import UHandler from "../../../../common/utility/UHandler";

const {ccclass, property} = cc._decorator;

@ccclass
export default class club_mysuperior_info extends cc.Component {

    @property(cc.Node) frame: cc.Node = null;
    @property(cc.Node) head: cc.Node = null;
    @property(cc.Node) nameLab: cc.Node = null;
    @property(cc.Node) idNode: cc.Node = null;
    @property(cc.Node) clubNode: cc.Node = null;

    @property(cc.Node) menu: cc.Node = null;

    @property(cc.Node) yqmMy: cc.Node = null;
    @property(cc.Node) wxMy: cc.Node = null;
    @property(cc.Node) qqMy: cc.Node = null;
    @property(cc.Node) wwMy: cc.Node = null;

    @property(cc.Node) yqmUp: cc.Node = null;
    @property(cc.Node) wxUp: cc.Node = null;
    @property(cc.Node) qqUp: cc.Node = null;
    @property(cc.Node) wwUp: cc.Node = null;

    @property(cc.Node) clubItem: cc.Node = null;
    @property(cc.Node) content: cc.Node = null;
    @property(cc.Node) btnView: cc.Node = null;
    @property(cc.Node) toggleLab: cc.Node = null;

    @property(cc.Node) myWxEditBox: cc.Node = null;
    @property(cc.Node) myQqEditBox: cc.Node = null;
    @property(cc.Node) myWwEditBox: cc.Node = null;

    @property(cc.Node) checkmark: cc.Node = null;

    currClubId = 0;
    currClubName = null;
    downUrl = null;             //旺旺下载地址
    myClubPromoterInfo = null;  //我的上级信息
    mySocialContactInfo = null; //我的信息
    //请求数据
    reqData(){
        this.scheduleOnce(() => {
            AppGame.ins.clubHallModel.requestMyClub();
        }, 0.01)
    }

    onEnable() {
        AppGame.ins.clubHallModel.on(MClubHall.MY_CLUB_RES, this.initClubList, this);
        AppGame.ins.clubHallModel.on(MClubHall.CLUB_MYSUPERIORINFO_RES, this.onMySuperiorInfo, this);

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_WW_MESSAGE_RES
            , new UHandler(this.changeWwHandler, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_QQ_MESSAGE_RES
            , new UHandler(this.changeQqHandler, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_WECHAT_MESSAGE_RES
            , new UHandler(this.changeWxHandler, this));
    }
    onDisable() {//text-changed  editing-did-began
        this.currClubId = 0;
        this.lastWxStr = "";
        this.lastQqStr = "";
        this.lastWwStr = "";
        this.myWxEditBox.active = false;
        this.myQqEditBox.active = false;
        this.myWwEditBox.active = false;
        this.hindContainer();

            AppGame.ins.clubHallModel.off(MClubHall.MY_CLUB_RES, this.initClubList, this);
        AppGame.ins.clubHallModel.off(MClubHall.CLUB_MYSUPERIORINFO_RES, this.onMySuperiorInfo, this);

        UMsgCenter.ins.unregester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_WW_MESSAGE_RES
            , new UHandler(this.changeWwHandler, this));
        UMsgCenter.ins.unregester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_QQ_MESSAGE_RES
            , new UHandler(this.changeQqHandler, this));
        UMsgCenter.ins.unregester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_WECHAT_MESSAGE_RES
            , new UHandler(this.changeWxHandler, this));
    }

    lastWxStr = "";
    wxWriteCallback(){
        let writeStr = this.myWxEditBox.getComponent(cc.EditBox).string;
        let endStr = this.checkName(writeStr);
        this.myWxEditBox.getComponent(cc.EditBox).string  = endStr;
        if(!this.isChina(endStr)){
            this.lastWxStr = endStr;
        }else{
            this.myWxEditBox.getComponent(cc.EditBox).string = this.lastWxStr;
            this.myWxEditBox.getComponent(cc.EditBox).blur();
            this.myWxEditBox.getComponent(cc.EditBox).focus();
        }
    }

    lastQqStr = "";
    qqWriteCallback(){
        let writeStr = this.myQqEditBox.getComponent(cc.EditBox).string;
        let endStr = this.checkName(writeStr);
        this.myQqEditBox.getComponent(cc.EditBox).string  = endStr;
        if(!this.isChina(endStr)){
            this.lastQqStr = endStr;
        }else{
            this.myQqEditBox.getComponent(cc.EditBox).string = this.lastQqStr;
            this.myQqEditBox.getComponent(cc.EditBox).blur();
            this.myQqEditBox.getComponent(cc.EditBox).focus();
        }
    }

    onWriteChange(){

    }

    lastWwStr = "";
    wwWriteCallback(){
        let writeStr = this.myWwEditBox.getComponent(cc.EditBox).string;
        let endStr = this.checkName(writeStr);
        this.myWwEditBox.getComponent(cc.EditBox).string  = endStr;
        if(!this.isChina(endStr)){
            this.lastWwStr = endStr;
        }else{
            this.myWwEditBox.getComponent(cc.EditBox).string = this.lastWwStr;
            this.myWwEditBox.getComponent(cc.EditBox).blur();
            this.myWwEditBox.getComponent(cc.EditBox).focus();
        }
    }

    isChina(str):boolean {
        return escape(str).indexOf( "%u" ) >= 0;
    }
    checkName(val){
        var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        var rs = "";
        for (var i = 0, l = val.length; i < val.length; i++) {
            rs = rs + val.substr(i, 1).replace(reg, '');
        }
        return rs;
    }

    //我的上级信息
    onMySuperiorInfo(data: ClubHallServer.GetClubPromoterInfoMessageResponse) {
        UDebug.Log('我的上级信息 data => ')
        UDebug.Log(data)
        this.downUrl = data.wwUrl;
        this.myClubPromoterInfo = data.myClubPromoterInfo;   //我的上级信息
        this.mySocialContactInfo = data.mySocialContactInfo;//我的信息
        this.initMyClubPromoterInfo(this.myClubPromoterInfo.userId == data.userId,data.clubId,data.clubName);
        this.initMySocialContactInfo();
    }
    /**初始化俱乐部列表 */
    initClubList(data: ClubHallServer.GetMyClubGameMessageResponse) {
        UDebug.Log('初始化俱乐部列表 data => ')
        UDebug.Log(data)
        this.content.removeAllChildren();
        this.content.height = 0;
        for (let i=0;i<data.clubInfos.length;i++){
            let item = cc.instantiate(this.clubItem);
            item.active = true;
            item.getChildByName("club_single").active = i%2 == 0;
            let idata = data.clubInfos[i];
            item.getChildByName("label").getComponent(cc.Label).string = idata.clubName;
            let button = item.getComponent(cc.Button);
            let clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this.node;
            clickEventHandler.component = "club_mysuperior_info";
            clickEventHandler.handler = "clickClubHandler";
            let temp_data = {clubId:idata.clubId,clubName:idata.clubName}
            clickEventHandler.customEventData = JSON.stringify(temp_data);
            if(this.currClubId == 0) {
                this.currClubId = Number(idata.clubId);
                this.currClubName = idata.clubName;
            }
            button.clickEvents.push(clickEventHandler);
            this.content.addChild(item);
            this.content.height += item.height;
        }
        this.content.getComponent(cc.Layout).updateLayout();

        if(this.currClubId != 0){
            AppGame.ins.clubHallModel.requestMyClubMySuperior(this.currClubId,this.currClubName);
        }
    }
    //选择俱乐部
    clickClubHandler(evt:Event,clubData){
        let data = JSON.parse(clubData);
        if(this.currClubId != Number(data.clubId)){
            this.currClubId = Number(data.clubId);
            this.currClubName = data.clubName;
            AppGame.ins.clubHallModel.requestMyClubMySuperior(this.currClubId,this.currClubName);
        }
        this.btnView.active = false;
    }
    //初始化 我的上级 信息
    initMyClubPromoterInfo(isMyself,clubId,clubName){
        this.toggleLab.getComponent(cc.Label).string = `${clubName}`;
        if(!isMyself){
            this.frame.active = true;
            this.head.active = true;

            this.clubNode.active = this.myClubPromoterInfo.userId != 990000;//平台不显示
            UResManager.load(this.myClubPromoterInfo.headboxId, EIconType.Frame, this.frame.getComponent(cc.Sprite));
            UResManager.load(this.myClubPromoterInfo.headId, EIconType.Head, this.head.getComponent(cc.Sprite),this.myClubPromoterInfo.headImgUrl);
            this.nameLab.getComponent(cc.Label).string = `${this.myClubPromoterInfo.nickName}`;
            this.idNode.getComponent(cc.Label).string = `ID ${this.myClubPromoterInfo.userId}`;
            let statusDesc = this.myClubPromoterInfo.userId == clubId ? "盟主":"合伙人";
            this.clubNode.getComponent(cc.Label).string = `${clubName} (俱乐部${statusDesc})`;

            this.yqmUp.getComponent(cc.Label).string = this.myClubPromoterInfo.socialContactInfo.invitationCode == "" ? "邀请码: ---" : "邀请码:"+this.myClubPromoterInfo.socialContactInfo.invitationCode;//邀请码
            this.wxUp.getComponent(cc.Label).string =  this.myClubPromoterInfo.socialContactInfo.wechat == ""         ? "微信: ---"   : "微信:"+this.myClubPromoterInfo.socialContactInfo.wechat;//微信
            this.qqUp.getComponent(cc.Label).string =  this.myClubPromoterInfo.socialContactInfo.qq == ""             ? "QQ: ---"    :  "QQ:"+this.myClubPromoterInfo.socialContactInfo.qq;//QQ
            this.wwUp.getComponent(cc.Label).string =  this.myClubPromoterInfo.socialContactInfo.ww == ""             ? "旺旺号: ---" :  "旺旺号:"+this.myClubPromoterInfo.socialContactInfo.ww;//旺旺
        }else{
            this.frame.active = false;
            this.head.active = false;

            this.nameLab.getComponent(cc.Label).string = "---";
            this.idNode.getComponent(cc.Label).string = "ID ---";
            this.clubNode.getComponent(cc.Label).string = "---";

            this.yqmUp.getComponent(cc.Label).string = "邀请码: ---";//邀请码
            this.wxUp.getComponent(cc.Label).string = "微信: ---";//微信
            this.qqUp.getComponent(cc.Label).string = "QQ: ---";//QQ
            this.wwUp.getComponent(cc.Label).string = "旺旺号: ---";//旺旺
        }
    }
    //初始化我的信息
    initMySocialContactInfo(){
        this.yqmMy.getComponent(cc.Label).string = this.mySocialContactInfo.invitationCode == "" ? "邀请码: ---" : "邀请码:"+this.mySocialContactInfo.invitationCode;//邀请码
        this.wxMy.getComponent(cc.Label).string = this.mySocialContactInfo.wechat == ""          ? "微信: ---"   : "微信:"+this.mySocialContactInfo.wechat;//微信
        this.qqMy.getComponent(cc.Label).string = this.mySocialContactInfo.qq == ""              ? "QQ: ---"    : "QQ:"+this.mySocialContactInfo.qq;//QQ
        this.wwMy.getComponent(cc.Label).string = this.mySocialContactInfo.ww == ""              ? "旺旺号: ---" : "旺旺号:"+this.mySocialContactInfo.ww ;//旺旺
    }
    clickMenu(){
        this.menu.active = true;
    }
    closeMenu(){
        this.menu.active = false;
    }
    //复制下载地址
    copyDownAds(){
        if(this.downUrl != ""){
            AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
            UAPIHelper.onCopyClicked(this.downUrl);
        }
    }
    //复制我的邀请码
    copyMyYqm(){
        if(this.mySocialContactInfo.invitationCode != ""){
            AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
            UAPIHelper.onCopyClicked(this.mySocialContactInfo.invitationCode);
        }
    }
    //编辑我的微信
    editMyWx(){
        this.myWxEditBox.active = !this.myWxEditBox.active;
        if(this.myWxEditBox.active){
            this.myWxEditBox.getComponent(cc.EditBox).string = this.mySocialContactInfo.wechat;
        }
    }
    //提交我的微信
    submitMyWx(){
        let inputStr = this.myWxEditBox.getComponent(cc.EditBox).string;
        let endStr = this.checkName(inputStr);
        if(inputStr.length != endStr.length || this.isChina(inputStr)){
            AppGame.ins.showTips("输入有误，请重新输入");
            return;
        }
        let msg = new HallServer.SetWechatMessage();
        msg.wechat = inputStr;
        msg.userId = AppGame.ins.roleModel.useId;
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL, Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_WECHAT_MESSAGE_REQ, msg);
    }
    changeWxHandler(data:HallServer.SetWechatMessageResponse){
        if(data.retCode == 0){
            this.wxMy.getComponent(cc.Label).string = data.wechat == ""? "微信:---":"微信:"+data.wechat;//wechat
            this.myWxEditBox.active = false;
        }else{
            AppGame.ins.showTips(data.errorMsg);
        }
    }
    //编辑我的QQ
    editMyQq(){
        this.myQqEditBox.active = !this.myQqEditBox.active;
        if(this.myQqEditBox.active){
            this.myQqEditBox.getComponent(cc.EditBox).string = this.mySocialContactInfo.qq;
        }
    }
    //提交我的Qq
    submitMyQq(){
        let inputStr = this.myQqEditBox.getComponent(cc.EditBox).string;
        let endStr = this.checkName(inputStr);
        if(inputStr.length != endStr.length || this.isChina(inputStr)){
            AppGame.ins.showTips("输入有误，请重新输入");
            return;
        }
        this.lastQqStr = "";
        let msg = new HallServer.SetQQMessage();
        msg.qq = this.myQqEditBox.getComponent(cc.EditBox).string;
        msg.userId = AppGame.ins.roleModel.useId;
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL, Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_QQ_MESSAGE_REQ, msg);
    }
    changeQqHandler(data:HallServer.SetQQMessageResponse){
        if(data.retCode == 0){
            this.qqMy.getComponent(cc.Label).string = data.qq == ""? "QQ:---":"QQ:"+data.qq;//qq
            this.myQqEditBox.active = false;
        }else{
            AppGame.ins.showTips(data.errorMsg);
        }
    }
    //编辑我的旺旺
    editMyWw(){
        this.myWwEditBox.active = !this.myWwEditBox.active;
        if(this.myWwEditBox.active){
            this.myWwEditBox.getComponent(cc.EditBox).string = this.mySocialContactInfo.ww;
        }
    }
    //提交我的旺旺
    submitMyWw(){
        let inputStr = this.myWwEditBox.getComponent(cc.EditBox).string;
        let endStr = this.checkName(inputStr);
        if(inputStr.length != endStr.length || this.isChina(inputStr)){
            AppGame.ins.showTips("输入有误，请重新输入");
            return;
        }
        this.lastWwStr = "";
        let msg = new HallServer.SetWWMessage();
        msg.ww = this.myWwEditBox.getComponent(cc.EditBox).string;
        msg.userId = AppGame.ins.roleModel.useId;
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL, Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_WW_MESSAGE_REQ, msg);
    }
    changeWwHandler(data:HallServer.SetWWMessageResponse){
        if(data.retCode == 0){
            this.wwMy.getComponent(cc.Label).string = data.ww == ""? "旺旺号:---":"旺旺号:"+data.ww;//旺旺
            this.myWwEditBox.active = false;
        }else{
            AppGame.ins.showTips(data.errorMsg);
        }
    }
    //复制上级邀请码
    copyUpYqm(){
        if(this.myClubPromoterInfo != null && this.myClubPromoterInfo.socialContactInfo.invitationCode != "") {
            AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
            UAPIHelper.onCopyClicked(this.myClubPromoterInfo.socialContactInfo.invitationCode);
        }
    }
    //复制上级的微信
    copyUpWx(){
        if(this.myClubPromoterInfo != null && this.myClubPromoterInfo.socialContactInfo.wechat != "") {
            AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
            UAPIHelper.onCopyClicked(this.myClubPromoterInfo.socialContactInfo.wechat);
        }
    }
    //复制上级的QQ
    copyUpQq(){
        if(this.myClubPromoterInfo != null && this.myClubPromoterInfo.socialContactInfo.qq != "") {
            AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
            UAPIHelper.onCopyClicked(this.myClubPromoterInfo.socialContactInfo.qq);
        }
    }
    //复制上级的旺旺
    copyUpWw(){
        if(this.myClubPromoterInfo != null &&  this.myClubPromoterInfo.socialContactInfo.ww != "") {
            AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
            UAPIHelper.onCopyClicked(this.myClubPromoterInfo.socialContactInfo.ww);
        }
    }
    //隐藏菜单
    hindContainer(){
        this.checkmark.active = false;
    }
    //显示菜单
    showContainer(){
        this.checkmark.active = true;
    }
}
