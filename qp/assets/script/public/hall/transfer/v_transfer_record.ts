
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import UDebug from "../../../common/utility/UDebug";
import V_Transfer_Left_Select from "./v_transfer_left_select";
import UDateHelper from "../../../common/utility/UDateHelper";
import MFriendsRoomCardModel from "../friends/friends_room_card/MFriendsRoomCardModel";
import V_Transfer_Record_Item from "./v_transfer_record_item";

const { ccclass,property } = cc._decorator;
/**
 *作用:转账记录
 */
@ccclass
export default class V_Transfer_Record extends V_Transfer_Left_Select{

    @property(cc.SpriteFrame)
    up_arrow:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    down_arrow:cc.SpriteFrame = null;

    private _prefab: cc.Node;
    private _parent: cc.Node;
    private _nothing: cc.Node;
    private _scrollview: cc.ScrollView;

    private lastEndTime:string;
    private startTime:string;
    private endTime:string;
    private _time_select:cc.Toggle;

    private _outcardTotal:cc.Label
    private _incardTotal:cc.Label

    init(): void {
        this._prefab = UNodeHelper.find(this.content, "scrollview/item");
        this._parent = UNodeHelper.find(this.content, "scrollview/view/content");
        this._nothing = UNodeHelper.find(this.content, "nothing");
        this._scrollview = UNodeHelper.getComponent(this.content, "scrollview",cc.ScrollView);

        this._outcardTotal = UNodeHelper.getComponent(this.content, "topbar/outcardtitle/number",cc.Label);
        this._incardTotal = UNodeHelper.getComponent(this.content, "topbar/incardtitle/number",cc.Label);

        this._time_select = UNodeHelper.getComponent(this.content,"topbar/time_select",cc.Toggle);
        this._scrollview.node.on('scroll-to-bottom', this.OnScrollCallBack, this);

        //初始化查询条件 
        this.lastEndTime = ""
        this.startTime = "" 
        this.endTime = "" 
    }
    

    private getInstance(): V_Transfer_Record_Item {
        let ins = cc.instantiate(this._prefab);
        let item = ins.getComponent(V_Transfer_Record_Item);
        if (!item) {
            item = ins.addComponent(V_Transfer_Record_Item);
        }
        ins.setParent(this._parent);
        item.init();
        return item;
        
    }


    //刷新约牌记录列表
    private updateRecordList(dataParam:any): void{
        var data = dataParam.roomCardChangeItem
        this._outcardTotal.string = (dataParam.transferRoomCardOUT / 100).toFixed(2)
        this._incardTotal.string = (dataParam.transferRoomCardIN / 100).toFixed(2)
        if (!data || data.length == 0){
            if (this._parent.childrenCount > 0){
                AppGame.ins.showTips("没有更多记录了");
            }
        } 
        else{
            data.forEach(element => {
                 var item = this.getInstance();
                 item.show(element);
            });
           //保存最后一条记录的时间
           this.lastEndTime = data[data.length-1].createTime
           this._scrollview.scrollToTop()
        }
        this._nothing.active = this._parent.childrenCount > 0 ? false : true;
    }

    protected isOnafter(): void {
        super.isOnafter()
        if (this.IsOn) {
            this._parent.removeAllChildren()
            AppGame.ins.friendsRoomCardModel.requestTransferRecord(this.startTime,this.endTime,"")
        }
    }


    protected onEnable():void{
        AppGame.ins.friendsRoomCardModel.on(MFriendsRoomCardModel.TRANSFER_RECORD, this.updateRecordList, this);
    }

    protected onDisable():void{
        AppGame.ins.friendsRoomCardModel.off(MFriendsRoomCardModel.TRANSFER_RECORD, this.updateRecordList, this);
    }

    //切换时间多选框上下拉箭头
    private select_time_toggle():void{
        super.playclick();
        if(this._time_select.isChecked == true){
            this._time_select.node.getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.up_arrow;
        }else{
            this._time_select.node.getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.down_arrow;
        }
    }

    //关闭时间下拉框
    private closeTimeUi():void{
        this._time_select.isChecked = false;
        this._time_select.node.getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.down_arrow;
    }

    //选中时间条件
    private chooseTime(touEvent: TouchEvent,timeName:string):void{
        super.playclick();
        this._time_select.node.getChildByName("time").getComponent(cc.Label).string = timeName;
        this._time_select.isChecked = false;
        this._time_select.node.getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.down_arrow;

        switch (timeName){
            case "全部时间":{
                this.startTime = "" 
                this.endTime = "" 
            }
            break
            case "今天":{
                this.startTime = UDateHelper.format(new Date(), "yyyy-MM-dd")
                this.endTime = UDateHelper.format(new Date(), "yyyy-MM-dd")
            }
            break
            case "昨天":{
                this.startTime = this.getDays(1)
                this.endTime = this.getDays(1)
            }
            break
            case "七天以内":{
                this.endTime= UDateHelper.format(new Date(), "yyyy-MM-dd")
                this.startTime = this.getDays(6)
            }
            break
            case "十五天以内":{
                this.endTime= UDateHelper.format(new Date(), "yyyy-MM-dd")
                this.startTime = this.getDays(14)
            }
            break
            case "三十天以内":{
                this.endTime = UDateHelper.format(new Date(), "yyyy-MM-dd")
                this.startTime = this.getDays(29)
            }
            break
        }
        //刷新记录
        this.refreshRecord()
    }


     //获得前N天的时间字符串
    getDays(n:number):string{
        var now = new Date();
        var date = new Date( now.getTime() - n*24*3600*1000 );
        var year = date.getFullYear();
        var month = date.getMonth()+1 > 9 ? date.getMonth()+1 : "0" + (date.getMonth() + 1);
        var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        var result = year + "-" + month + "-" + day;
        return result
    }

    //重新查询数据
    refreshRecord(){
        //重置之前数据
        this._parent.removeAllChildren()
        //发求请求
        AppGame.ins.friendsRoomCardModel.requestTransferRecord(this.startTime,this.endTime,"")
    }

    //滚动后最后时，请求更多记录
    OnScrollCallBack(){
        UDebug.log("滚动到最底部,加载更多记录")
        AppGame.ins.friendsRoomCardModel.requestTransferRecord(this.startTime,this.endTime,this.lastEndTime)
    }
 
}
