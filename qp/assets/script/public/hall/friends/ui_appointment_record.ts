import { ECommonUI, EGameType } from "../../../common/base/UAllenum";
import VWindow from "../../../common/base/VWindow";
import UDateHelper from "../../../common/utility/UDateHelper";
import UDebug from "../../../common/utility/UDebug";
import UEventHandler from "../../../common/utility/UEventHandler";
import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import MRoomModel from "../room_zjh/MRoomModel";
import VRecordItem from "./ui_record_item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ui_appointment_record extends VWindow {

    @property(cc.SpriteFrame)
    up_arrow:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    down_arrow:cc.SpriteFrame = null;

    private _time_mask:cc.Node;
    private _game_maks:cc.Node;
    private _time_select:cc.Toggle;
    private _game_select:cc.Toggle;

    private _nothing: cc.Node;
    private _scrollview: cc.ScrollView;
    private _prefab: cc.Node;
    private _parent: cc.Node;

    private data:any;
    private lastGameEndTime:string
    private selectBeginTime:string 
    private selectEndTime:string
    private selectGameId:number

    init():void{
        super.init();
        this._time_mask = UNodeHelper.find(this._root,"time_checkmark/mask");
        this._game_maks = UNodeHelper.find(this._root,"game_checkmark/mask");
        this._time_select = UNodeHelper.getComponent(this._root,"time_select",cc.Toggle);
        this._game_select = UNodeHelper.getComponent(this._root,"game_select",cc.Toggle);
        this._prefab = UNodeHelper.find(this._root, "scrollView/item");
        this._parent = UNodeHelper.find(this._root, "scrollView/view/content");
        this._nothing = UNodeHelper.find(this._root, "default_node");
        this._scrollview  = UNodeHelper.getComponent(this._root, "scrollView",cc.ScrollView);

        UEventHandler.addClick(this._time_mask,this.node,"ui_appointment_record","closeTimeUi");
        UEventHandler.addClick(this._game_maks,this.node,"ui_appointment_record","closeGameUi");

        let a = UNodeHelper.find(this._root,"time_checkmark/content");
        for(var i = 0;i < a.childrenCount ;i++){
            UEventHandler.addClick(a.children[i],this.node,"ui_appointment_record","chooseTime",a.children[i].getChildByName("label").getComponent(cc.Label).string);
        };

        let b = UNodeHelper.find(this._root,"game_checkmark/content");
        for(var i = 0;i < b.childrenCount;i++){
            UEventHandler.addClick(b.children[i],this.node,"ui_appointment_record","chooseGame",b.children[i].getChildByName("label").getComponent(cc.Label).string);
        }

        this._scrollview.node.on('scroll-to-bottom', this.OnScrollCallBack, this);

        //初始化查询条件 
        this.lastGameEndTime = ""
        this.selectBeginTime = "" 
        this.selectEndTime = ""
        this.selectGameId = 0
        this._time_select.node.getChildByName("time").getComponent(cc.Label).string = "全部时间";
        this._game_select.node.getChildByName("game").getComponent(cc.Label).string = "全部类型";
    }

    //关闭时间下拉框
    private closeTimeUi():void{
        this._time_select.isChecked = false;
        this._time_select.node.getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.down_arrow;
    }

    //关闭游戏类型下拉框
    private closeGameUi():void{
        this._game_select.isChecked = false;
        this._game_select.node.getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.down_arrow;
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

    //切换游戏多选框上下拉箭头
    private select_game_toggle():void{
        super.playclick();
        if(this._game_select.isChecked == true){
            this._game_select.node.getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.up_arrow;
        }else{ 
            this._game_select.node.getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.down_arrow;
        }
    }

    //选中时间条件
    private chooseTime(touEvent: TouchEvent,timeName:string):void{
        super.playclick();
        this._time_select.isChecked = false;
        this._time_select.node.getChildByName("time").getComponent(cc.Label).string = timeName;
        this._time_select.node.getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.down_arrow;

        switch (timeName){
            case "全部时间":{
                this.selectBeginTime = ""
                this.selectEndTime = ""
            }
            break
            case "今天":{
                this.selectBeginTime = UDateHelper.format(new Date(), "yyyy-MM-dd")
                this.selectEndTime = UDateHelper.format(new Date(), "yyyy-MM-dd")
            }
            break
            case "昨天":{
                this.selectBeginTime = this.getDays(1)
                this.selectEndTime = this.getDays(1)
            }
            break
            case "七天以内":{
                this.selectEndTime = UDateHelper.format(new Date(), "yyyy-MM-dd")
                this.selectBeginTime = this.getDays(6)
            }
            break
            case "十五天以内":{
                this.selectEndTime = UDateHelper.format(new Date(), "yyyy-MM-dd")
                this.selectBeginTime = this.getDays(14)
            }
            break
            case "三十天以内":{
                this.selectEndTime = UDateHelper.format(new Date(), "yyyy-MM-dd")
                this.selectBeginTime = this.getDays(29)
            }
            break
        }
        //刷新记录
        this.refreshRecord()
    }

    //选中游戏条件 
    private chooseGame(touEvent:TouchEvent,gameName:string):void{
        super.playclick();
        this._game_select.isChecked = false;
        this._game_select.node.getChildByName("game").getComponent(cc.Label).string = gameName;
        this._game_select.node.getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.down_arrow

        if (gameName == "全部类型") this.selectGameId = 0
        else if (gameName == "斗地主") this.selectGameId = EGameType.DDZ_HY
        else if (gameName == "跑得快") this.selectGameId = EGameType.PDK_HY
        else if (gameName == "炸金花") this.selectGameId = EGameType.ZJH_HY
        else if (gameName == "通比牛牛") this.selectGameId = EGameType.TBNN_HY
        else if (gameName == "看牌抢庄牛牛") this.selectGameId = EGameType.KPQZNN_HY

        //刷新记录
        this.refreshRecord()
    }

    onEnable(){
        AppGame.ins.roomModel.on(MRoomModel.UPDATA_FRIEND_GAME_RECORDS, this.updateRecordList, this);
        
    }

    onDisable(){
        AppGame.ins.roomModel.on(MRoomModel.UPDATA_FRIEND_GAME_RECORDS, this.updateRecordList, this);
    }

    show(data:any){
        super.show(data)
        this.refreshRecord()
    }

    //获得一个约牌记录实例
    private getInstance(): VRecordItem {
        let ins = cc.instantiate(this._prefab);
        let item = ins.getComponent(VRecordItem);
        if (!item) {
            item = ins.addComponent(VRecordItem);
        }
        ins.setParent(this._parent);
        item.init();
        return item;
    }

    //刷新约牌记录列表
    private updateRecordList(data:any): void{
        if (!data || data.length == 0){
            if (this._parent.childrenCount > 0){
                AppGame.ins.showTips("没有更多记录了");
            }
        } 
        else{
            data.forEach(element => {
                 var item = this.getInstance();
                 item.bind(element);

            });
           //保存最后一条记录的时间
           this.lastGameEndTime = data[data.length-1].gameEndTime
        }
        this._nothing.active = this._parent.childrenCount > 0 ? false : true;
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
        AppGame.ins.roomModel.requestFriendRcord(this.selectBeginTime,this.selectEndTime,this.selectGameId,"")
    }

    //滚动后最后时，请求更多记录
    OnScrollCallBack(){
        UDebug.log("滚动到最底部,加载更多记录")
        AppGame.ins.roomModel.requestFriendRcord(this.selectBeginTime,this.selectEndTime,this.selectGameId,this.lastGameEndTime)
    }
}
