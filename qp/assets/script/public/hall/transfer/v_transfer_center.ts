
import UAudioManager from "../../../common/base/UAudioManager";
import UDebug from "../../../common/utility/UDebug";
import { ULocalStorage } from "../../../common/utility/ULocalStorage";

import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import MFriendsRoomCardModel from "../friends/friends_room_card/MFriendsRoomCardModel";
import MHall from "../lobby/MHall";
import V_Transfer_Center_Item from "./v_transfer_center_item";
import V_Transfer_Left_Select from "./v_transfer_left_select";
import V_Transfer_Main from "./v_transfer_main";

/**
 * 转账联系人
 */
 export class transUserInfo {
    userId: string;
    nickName: string;
    headId: number;
    headBoxId: number;
}

const { ccclass } = cc._decorator;
/**
 *作用:转账中心
 */
@ccclass
export default class V_Transfer_Center extends V_Transfer_Left_Select{

    private _prefab: cc.Node;
    private _parent: cc.Node;
    private _nothing: cc.Node;
    private _scrollview: cc.ScrollView;
    private _searchId:cc.EditBox
    private _roomCard:cc.Label
    private _agentLevel:cc.Label
    private _recentBtn: cc.Node;
    private _commonBtn: cc.Node;
    private _recentRecord:Array<any> = []
    private _commonRecord:Array<any> = []
    private editbox_img_input:cc.Sprite;
    private editbox_img_normal:cc.Sprite;

    init(): void {
        this._prefab = UNodeHelper.find(this.content, "scrollview/item");
        this._parent = UNodeHelper.find(this.content, "scrollview/view/content");
        this._nothing = UNodeHelper.find(this.content, "nothing");
        this._scrollview = UNodeHelper.getComponent(this.content, "scrollview",cc.ScrollView);
        this._searchId = UNodeHelper.getComponent(this.content, "topbar/userid_editbox",cc.EditBox);
        this._roomCard = UNodeHelper.getComponent(this.content, "topbar/cardtitle/number",cc.Label);
        this._agentLevel = UNodeHelper.getComponent(this.content, "topbar/leveltitle/number",cc.Label);
        this._recentBtn = UNodeHelper.find(this.content, "topbar/btnnear/checkmark");
        this._commonBtn = UNodeHelper.find(this.content, "topbar/btnnormal/checkmark");
        this.editbox_img_input = UNodeHelper.getComponent(this.content,"topbar/common_img_bg_editbox_input",cc.Sprite);
        this.editbox_img_normal = UNodeHelper.getComponent(this.content,"topbar/common_img_bg_editbox",cc.Sprite);
        this._searchId.node.on("editing-did-began",this.startInput,this);
        this._searchId.node.on("editing-did-ended",this.getInput,this);
    }
    
    private getInstance(): V_Transfer_Center_Item {
        let ins = cc.instantiate(this._prefab);
        let item = ins.getComponent(V_Transfer_Center_Item);
        if (!item) {
            item = ins.addComponent(V_Transfer_Center_Item);
        }
        ins.setParent(this._parent);
        item.init();
        return item;
    }

    /**
    * 开始输入
    */
     private startInput():void{
        UAudioManager.ins.playSound("audio_click");
        this._searchId.node.getComponentInChildren(cc.Sprite).spriteFrame = this.editbox_img_input.spriteFrame;
    }

    /**
     * 结束输入
     */
    private getInput():void{
        this._searchId.node.getComponentInChildren(cc.Sprite).spriteFrame = this.editbox_img_normal.spriteFrame;
    }

    //更新列表
    private onGetOtherUserList(data:any): void {
        if(data.retCode == 0){
            //保存当前数据
            var userListData = []
            userListData.push(data.userInfo) 
            userListData.forEach(element => {
                var item = this.getInstance();
                item.show(element);
            });
            this._scrollview.scrollToTop()
            this._nothing.active = false ;
        } else {
            AppGame.ins.showTips(data.errorMsg);
            this._nothing.active = true ;
        }
    }

    //发送
    protected isOnafter(): void {
        super.isOnafter()
        if (this.IsOn) {
            this._searchId.string = ""
            this._roomCard.string = (AppGame.ins.roleModel.roomCard / 100).toFixed(2)
            //加载缓存信息
            this.loadConfigData()
            //请求代理等级
            AppGame.ins.hallModel.requestAgentLevel();
            //显示最近记录
            this.onClickRecect()
        }
    }

    protected onEnable():void{
        AppGame.ins.friendsRoomCardModel.on(MFriendsRoomCardModel.OTHER_USER_INFO, this.onGetOtherUserList, this);
        AppGame.ins.friendsRoomCardModel.on(MFriendsRoomCardModel.TRANSFER_RESLUT, this.onGetTranseferResult, this);
        AppGame.ins.hallModel.on(MHall.GET_AGENT_LEVEL_RES, this.onGetAgentLevel, this);
    }

    protected onDisable():void{
        AppGame.ins.friendsRoomCardModel.off(MFriendsRoomCardModel.OTHER_USER_INFO, this.onGetOtherUserList, this);
        AppGame.ins.friendsRoomCardModel.off(MFriendsRoomCardModel.TRANSFER_RESLUT, this.onGetTranseferResult, this);
        AppGame.ins.hallModel.off(MHall.GET_AGENT_LEVEL_RES, this.onGetAgentLevel, this);
    }

    //查询其它人的账号信息
    clickSearchId(){
        this._recentBtn.active = false
        this._commonBtn.active = false
        if (this._searchId.string == ""){
            AppGame.ins.showTips("玩家ID不能为空");
            return
        }
        this._parent.removeAllChildren()
        var userId = parseInt(this._searchId.string)
        AppGame.ins.friendsRoomCardModel.requestOtherUserInfo(userId)
    }
 
    /**获取到代理等级 */
    onGetAgentLevel(data: any) {
        this._agentLevel.string =  data.levelName
    }

    //转账结果,更新金币数量
    onGetTranseferResult(data:any){
        if (data.retCode == 0) {
            //更新剩下房卡数量
            this._roomCard.string = (data.roomCard / 100).toFixed(2)
            this.saveRecentRecrd(data.recvUserId)
            this.saveCommonRecrd(data.recvUserId)
            this.onClickRecect()
            AppGame.ins.roleModel.saveRoomCard(data.roomCard)
        }
    }

    //加载缓存数据
    loadConfigData(){
        var jsonStr = ULocalStorage.getItem("RECENT_TRANSFER_LIST_"+ AppGame.ins.roleModel.useId)
        if (jsonStr){
            let data  = JSON.parse(jsonStr);
            this._recentRecord = data
        }
        var jsonCommonStr = ULocalStorage.getItem("COMMON_TRANSFER_LIST_"+ AppGame.ins.roleModel.useId)
        if (jsonCommonStr){
            let data  = JSON.parse(jsonCommonStr);
            this._commonRecord = data
        }
    }

    onClickRecect(){
        this._recentBtn.active = true
        this._commonBtn.active = false
        this._parent.removeAllChildren()
        if (this._recentRecord.length > 0){
            UDebug.Log("读取最近记录" + JSON.stringify(this._recentRecord))
            this._recentRecord.forEach(element => {
                var item = this.getInstance();
                item.show(element);
            });
            this._scrollview.scrollToTop()
            this._nothing.active = false ;
        }else{
            this._nothing.active = true ;
        }
    }

    
    onClickCommon(){
        this._recentBtn.active = false
        this._commonBtn.active = true
        this._parent.removeAllChildren()
        if (this._commonRecord.length > 0){
            var data = this._commonRecord
            UDebug.Log("读取常用记录" + JSON.stringify(data))
            //次数最大的排在最前
            data = data.sort((a: any, b: any) => {
                return b.count - a.count
            })
            //只显示10条
            for (var i = 0; i < 10; i++){
                if (data[i] == undefined){
                    break
                }  
                if (data[i].count >= 3){
                    var item = this.getInstance();
                    item.show(data[i]);
                }
            }
            this._scrollview.scrollToTop()
            this._nothing.active = false ;
        }else{
            this._nothing.active = true ;
        }
    }

    //保存最近10条记录
    saveRecentRecrd(userId:number){
        if (userId != AppGame.ins.friendsRoomCardModel.transferUserInfo.userId) return
        //删除之前的记录
        for (var i = 0 ; i< this._recentRecord.length; i++){
            if ( this._recentRecord[i].userId == userId){
                this._recentRecord.splice(i,1)
                break
            }
        }

        //保存最近10条记录
        var len = this._recentRecord.length
        if ( len >= 10 ){
            this._recentRecord.splice(9,len - 9)
        }

        //插入最新记录
        this._recentRecord.unshift(AppGame.ins.friendsRoomCardModel.transferUserInfo)
        UDebug.Log("保存最近记录" + JSON.stringify(this._recentRecord))

        //保存记录
        ULocalStorage.saveItem("RECENT_TRANSFER_LIST_" + AppGame.ins.roleModel.useId,this._recentRecord)
    }

    //保存最近50条记录，显示次数大于3的
    saveCommonRecrd(userId:number){
        if (userId != AppGame.ins.friendsRoomCardModel.transferUserInfo.userId) return

        //已存在，更新之前次数
        for (var i = 0 ; i< this._commonRecord.length; i++){
            if ( this._commonRecord[i].userId == userId){
                this._commonRecord[i].count ++
                ULocalStorage.saveItem("COMMON_TRANSFER_LIST_" + AppGame.ins.roleModel.useId,this._commonRecord)
                UDebug.Log("保存常用记录" + JSON.stringify(this._commonRecord))
                return
            }
        }

        var len = this._commonRecord.length
        if ( len >= 50 ){
            this._commonRecord.splice(49,len - 49)
        }
        //插入记录
        var data = {
            userId: AppGame.ins.friendsRoomCardModel.transferUserInfo.userId,
            nickName: AppGame.ins.friendsRoomCardModel.transferUserInfo.nickName,
            headId: AppGame.ins.friendsRoomCardModel.transferUserInfo.headId,
            headboxId: AppGame.ins.friendsRoomCardModel.transferUserInfo.headboxId,
            count:1
        }
        this._commonRecord.push(data)

        //保存记录
        ULocalStorage.saveItem("COMMON_TRANSFER_LIST_" + AppGame.ins.roleModel.useId,this._commonRecord)
        UDebug.Log("保存常用记录" + JSON.stringify(this._commonRecord))
    }

}
