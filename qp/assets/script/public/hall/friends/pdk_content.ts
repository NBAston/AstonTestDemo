import { ECommonUI } from "../../../common/base/UAllenum";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import ULanHelper from "../../../common/utility/ULanHelper";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";


const {ccclass, property} = cc._decorator;

@ccclass
export default class pdk_content extends cc.Component {

    private _turn_content:cc.Node;
    private _time_content:cc.Node;
    private _turn_slider:cc.Slider;
    private _turn_number:cc.Label;
    private _time_slider:cc.Slider;
    private _time_number:cc.Label;
    private _turn_creat_btn:cc.Node;
    private _turn_creat_coin_lab:cc.Node;
    private _time_creat_btn:cc.Node;
    private _turn_ip_toggle:cc.Toggle;
    private _time_ip_toggle:cc.Toggle;
    private _turn_sprite:cc.Node;
    private _time_sprite:cc.Node;
    private _ip_limit_btn:cc.Node;
    private _host_time:number;
    private _turn_num:number;


    @property(cc.Toggle)
    chat_toggle:cc.Toggle = null;

    @property(cc.Toggle)
    type_toggle:cc.Toggle = null;
    @property(cc.Toggle)
    type_toggle_3:cc.Toggle = null; // 抽四张玩法

    @property(cc.Toggle)
    play_toggle:cc.Toggle = null; // 赢家先出
    @property(cc.Toggle)
    play_toggle_1:cc.Toggle = null; // 红桃三先出

    @property(cc.Toggle)
    toggle0:cc.Toggle = null;

    @property(cc.Toggle)
    toggle0_1:cc.Toggle = null; // 红桃三必出

    @property(cc.Toggle)
    toggle1:cc.Toggle = null;

    @property(cc.Toggle)
    toggle2:cc.Toggle = null;

    @property(cc.Toggle)
    toggle3:cc.Toggle = null;

    @property(cc.Toggle)
    toggle4:cc.Toggle = null;

    @property(cc.Toggle)
    toggle5:cc.Toggle = null;

    @property(cc.Toggle)
    toggle6:cc.Toggle = null;

    @property(cc.Toggle)
    toggle6_0:cc.Toggle = null; // 10倍底分
    @property(cc.Toggle)
    toggle6_1:cc.Toggle = null; // 5倍底分

    @property(cc.Toggle)
    toggle7:cc.Toggle = null;

    @property(cc.Toggle)
    toggle8:cc.Toggle = null;

    @property(cc.Toggle)
    toggle9:cc.Toggle = null;

    @property(cc.Toggle)
    toggle10:cc.Toggle = null;

    @property(cc.Toggle)
    toggle11:cc.Toggle = null; // 反关翻倍

    @property(cc.Node)
    btn_chat_limit:cc.Node = null;


    onLoad () {
        this._turn_content = UNodeHelper.find(this.node,"turn_content");
        // this._time_content = UNodeHelper.find(this.node,"time_content");
        this._turn_slider = UNodeHelper.getComponent(this.node,"turn_content/turn_slider",cc.Slider);
        this._turn_number = UNodeHelper.getComponent(this.node,"turn_content/turn_number",cc.Label);
        // this._turn_slider.node.on("slide",this.turn_slider,this);
        // this._turn_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.turn_slider_touch_start,this);
        // this._turn_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.turn_slider_touch_end,this);
        // this._turn_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.turn_slider_touch_end,this);

        this._turn_creat_btn = UNodeHelper.find(this.node,"turn_content/btn_creat");
        this._turn_creat_coin_lab = UNodeHelper.find(this.node,"turn_content/btn_creat/coinLab");
        UEventHandler.addClick(this._turn_creat_btn,this.node,"pdk_content","turn_creat_room");
        this._turn_ip_toggle = UNodeHelper.getComponent(this.node,"turn_content/ip_toggleContainer",cc.Toggle);
        this._turn_sprite = UNodeHelper.find(this.node,"turn_content/turn_slider/Handle/sprite");

        // this._time_slider = UNodeHelper.getComponent(this.node,"time_content/time_slider",cc.Slider);
        // this._time_number = UNodeHelper.getComponent(this.node,"time_content/time_number",cc.Label);
        this._ip_limit_btn = UNodeHelper.find(this.node,"turn_content/btn_ip_limit");
        // this._time_slider.node.on("slide",this.time_slider,this);
        // this._time_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.time_slider_touch_start,this);
        // this._time_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.time_slider_touch_end,this);
        // this._time_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.time_slider_touch_end,this);

        this._time_creat_btn = UNodeHelper.find(this.node,"time_content/btn_creat");
        UEventHandler.addClick(this._time_creat_btn,this.node,"pdk_content","time_creat_room");
        UEventHandler.addClick(this._ip_limit_btn,this.node,"pdk_content","show_tip_info",ULanHelper.GAME_HELP_TIP_HY.ZHJ_IP_LIMIT_SCORE);
        UEventHandler.addClick(this.btn_chat_limit,this.node,"pdk_content","show_tip_info",ULanHelper.GAME_HELP_TIP_HY.ZHJ_FORBID_CHAT);
        this._time_ip_toggle = UNodeHelper.getComponent(this.node,"time_content/ip_toggleContainer",cc.Toggle);
        this._time_sprite = UNodeHelper.find(this.node,"time_content/time_slider/Handle/sprite");

        this._host_time = 0;
        this._turn_num = 10;
    }

    start () {

    }

    private turn_creat_room():void{
        let turn = this._turn_num; 
        let isLimit = this._turn_ip_toggle.isChecked;
        let chatLimit = this.chat_toggle.isChecked;
        let extent = {
            "Mode":this.type_toggle.isChecked ? 1:(this.type_toggle_3.isChecked?2:0),//玩法	0:15张玩法，1:16张玩法，2:抽4张玩法
            "WhoFistChuPai":this.play_toggle.isChecked ? 1 : (this.play_toggle_1.isChecked?2:0),//谁先出牌。0:黑桃三先出，1:赢家先出，2:红桃三先出
            "MustSpades3":this.toggle0.isChecked,//黑桃3必出
            "MustHearts3":this.toggle0_1.isChecked,//红桃3必出
            // "ChuPaiThreeWithLessCard":this.toggle1.isChecked, //三张少带出完
            "FollowThreeWithLessCard":this.toggle2.isChecked, //三张少带可接完
            "FollowWingWithLessCard":this.toggle3.isChecked, //飞机少带可接完
            "AllowedFourWithTwo":this.toggle6.isChecked,//允许四带二
            "AllowedFourWithThree":this.toggle5.isChecked,//允许四带三
            "BombBeiLv":this.toggle6_0.isChecked?10:5, //炸弹	炸弹倍率
            "ShowCardNum":this.toggle7.isChecked,//显示牌数
            "AllowedPass":this.toggle8.isChecked,//可过牌
            "NotAllowedSeparateBomb":this.toggle9.isChecked, //炸弹不可拆
            "ThreeAIsBomb":this.toggle10.isChecked, //3A算炸弹
            "FanGuanDouble":this.toggle11.isChecked, //反关翻倍
            "ChuPaiTime":this._host_time //托管超时时间，单位秒。0:超时后不托管
        }
        AppGame.ins.roomModel.requestCreatRoom(13,"跑得快",turn,0,false,3,isLimit,0,1,0,chatLimit,extent);
        


    }

    private turn_toggleGroup(event,customEventData):void{
        const PART_COIN = 0.25;//斗地主+跑得快：每局消耗0.25张房卡
        this._turn_creat_coin_lab.getComponent(cc.Label).string = `x ${Math.ceil(parseInt(customEventData) * PART_COIN)}`;
        this._turn_num = parseInt(customEventData);
    }

    private play_togglegroup_select(event, type): void {
        this.toggle0_1.isChecked = false;
        this.toggle0.isChecked = false;
        if(parseInt(type) == 1) {
            this.toggle0_1.node.parent.active = true;
            this.toggle0.node.parent.active = true;
        } else if(parseInt(type) == 2 ) {
            this.toggle0_1.node.parent.active = false;
            this.toggle0.node.parent.active = true;
        } else if(parseInt(type) == 3) {
            this.toggle0.node.parent.active = false;
            this.toggle0_1.node.parent.active = true;
        }
    }

    private spades_toggle_select(event, type): void {
        if(parseInt(type) == 1) {
            if(this.toggle0.isChecked) {
                this.toggle0_1.isChecked = false;
            }
        } else if(parseInt(type) == 2){
            if(this.toggle0_1.isChecked) {
                this.toggle0.isChecked = false;
            }
        }
    }

    private host_toggleGroup(event,customEventData):void{
        this._host_time = parseInt(customEventData);
    }

    private type_toggle_select():void{
        this.toggle10.node.active = true;
    }

    private type_toggle2_select():void{
        this.toggle10.node.active = false;
    }

    private toggle5_select():void{
        this.toggle9.isChecked = false;
    }

    private toggle6_select():void{
        this.toggle9.isChecked = false;
    }

    private toggle9_select():void{
        this.toggle5.isChecked = false;
        this.toggle6.isChecked = false;
    }


    // private time_creat_room():void{
    //     let time = parseInt(this._time_number.string);
    //     let isLimit = this._time_ip_toggle.isChecked;
    //     let extent = {
    //         "JdzMode": 0,
    //         "MustJdz": 0,
    //         "MaxBeiLv": 30,
    //         "NotShuffle": false
    //     }
    //     AppGame.ins.roomModel.requestCreatRoom(13,"跑得快",0,time,0,isLimit,0,1,0,extent);
    // }

    
    // private turnToggle():void{
    //     let a = UNodeHelper.find(this.node,"toggleContainer/toggle1");
    //     if(a.getComponent(cc.Toggle).isChecked == true){
    //         this._turn_content.active = true;
    //         this._time_content.active = false;
    //     }else{
    //         this._turn_content.active = false;
    //         this._time_content.active = true;
    //     }
    // }

    // private timeToggle():void{
    //     let a = UNodeHelper.find(this.node,"toggleContainer/toggle2");
    //     if(a.getComponent(cc.Toggle).isChecked == false){
    //         this._turn_content.active = true;
    //         this._time_content.active = false;
    //     }else{
    //         this._turn_content.active = false;
    //         this._time_content.active = true;
    //     }
    // }

    // private turn_slider():void{
    //     this._turn_slider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange = this._turn_slider.progress;
    //     let a = parseInt(this._turn_slider.progress * 90 + 10 + "");
    //     a = Math.floor(a/5);
    //     a = a * 5;
    //     this._turn_number.string = a + "";
    //     const PART_COIN = 0.25;//斗地主+跑得快：每局消耗0.25张房卡
    //     this._turn_creat_coin_lab.getComponent(cc.Label).string = `x ${Math.ceil(a * PART_COIN)}`;
    //     this._turn_sprite.getComponentInChildren(cc.Label).string = this._turn_number.string;
    // }

    // private turn_slider_touch_start():void{
    //     this._turn_sprite.active = true;
    // }

    // private turn_slider_touch_end():void{
    //     this._turn_sprite.active = false;
    // }

    // private time_slider():void{
    //     this._time_slider.node.getChildByName("progressBar").getComponent(cc.ProgressBar).progress = this._time_slider.progress;
    //     let a = parseInt(this._time_slider.progress * 150 + 30 + "");
    //     a = Math.floor(a/10);
    //     a = a * 10;
    //     this._time_number.string = a + "";
    //     this._time_sprite.getComponentInChildren(cc.Label).string = this._time_number.string;
    // }

    // private time_slider_touch_start():void{
    //     this._time_sprite.active = true;
    // }

    // private time_slider_touch_end():void{
    //     this._time_sprite.active = false;
    // }

    show_tip_info(event: any, tips: string): void {
        let data = {msg:tips,height:UAPIHelper.getItemHeight(tips),v_point:cc.v2(event.target.x,event.target.y) };
        AppGame.ins.showUI(ECommonUI.UI_TIP_HY, data);
    }
    
}
