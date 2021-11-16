import { ECommonUI } from "../../../common/base/UAllenum";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import ULanHelper from "../../../common/utility/ULanHelper";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ddz_content extends cc.Component {

    private _turn_content:cc.Node;
    private _time_content:cc.Node;
    private _turn_slider:cc.Slider;
    private _turn_number:cc.Label;
    private _time_slider:cc.Node;
    private _time_number:cc.Label;
    private _ip_toggle:cc.Toggle;
    private _turn_creat_btn:cc.Node;
    private _time_creat_btn:cc.Node;
    private _turn_creat_coin_lab:cc.Node;
    private _time_ip_toggle:cc.Toggle;
    private _turn_sprite:cc.Node;
    private _time_sprite:cc.Node;
    private _ip_limit_btn:cc.Node;
    private _top_num:number;
    private _turn_num:number;

    @property(cc.Toggle)
    type_toggle:cc.Toggle = null;

    @property(cc.Toggle)
    random_toggle:cc.Toggle = null;

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
    toggle7:cc.Toggle = null;

    @property(cc.Toggle)
    chat_toggle:cc.Toggle = null;

    @property(cc.Node)
    btn_chat_limit:cc.Node = null;


    onLoad () {

        this._turn_content = UNodeHelper.find(this.node,"turn_content");
        this._time_content = UNodeHelper.find(this.node,"time_content");

        this._turn_slider = UNodeHelper.getComponent(this.node,"turn_content/turn_slider",cc.Slider);
        this._turn_number = UNodeHelper.getComponent(this.node,"turn_content/turn_number",cc.Label);
        // this._turn_slider.node.on("slide",this.turn_slider,this);
        // this._turn_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.turn_slider_touch_start,this);
        // this._turn_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.turn_slider_touch_end,this);
        // this._turn_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.turn_slider_touch_end,this);

        this._ip_toggle = UNodeHelper.getComponent(this.node,"turn_content/ip_toggleContainer",cc.Toggle);
        this._turn_creat_btn = UNodeHelper.find(this.node,"turn_content/btn_creat");
        this._turn_creat_coin_lab = UNodeHelper.find(this.node,"turn_content/btn_creat/coinLab");
        UEventHandler.addClick(this._turn_creat_btn,this.node,"ddz_content","turn_creat_room");
        this._turn_sprite = UNodeHelper.find(this.node,"turn_content/turn_slider/Handle/sprite");


        // this._time_slider = UNodeHelper.find(this.node,"time_content/time_slider");
        // this._time_number = UNodeHelper.getComponent(this.node,"time_content/time_number",cc.Label);
        this._ip_limit_btn = UNodeHelper.find(this.node,"turn_content/btn_ip_limit");
        // this._time_slider.on("slide",this.time_slider,this);
        // this._time_slider.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.time_slider_touch_start,this);
        // this._time_slider.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.time_slider_touch_end,this);
        // this._time_slider.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.time_slider_touch_end,this);

        // this._time_ip_toggle = UNodeHelper.getComponent(this.node,"time_content/ip_toggleContainer",cc.Toggle);
        this._time_creat_btn = UNodeHelper.find(this.node,"time_content/btn_creat");
        UEventHandler.addClick(this._time_creat_btn,this.node,"ddz_content","time_creat_room");
        UEventHandler.addClick(this._ip_limit_btn,this.node,"ddz_content","show_tip_info",ULanHelper.GAME_HELP_TIP_HY.ZHJ_IP_LIMIT_SCORE);
        UEventHandler.addClick(this.btn_chat_limit,this.node,"ddz_content","show_tip_info",ULanHelper.GAME_HELP_TIP_HY.ZHJ_FORBID_CHAT);
        this._time_sprite = UNodeHelper.find(this.node,"time_content/time_slider/Handle/sprite");

        this._top_num = 0;
        this._turn_num = 10;
    }

    start () {

    }

    
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

    private turn_toggleGroup(event,customEventData):void{
        const PART_COIN = 0.25;//斗地主+跑得快：每局消耗0.25张房卡
        this._turn_creat_coin_lab.getComponent(cc.Label).string = `x ${Math.ceil(parseInt(customEventData) * PART_COIN)}`;
        this._turn_num = parseInt(customEventData);
    }

    private top_toggleGroup(event,customEventData):void{
        this._top_num = parseInt(customEventData);
    }

    private turn_creat_room():void{
        let turn = this._turn_num;
        let isLimit = this._ip_toggle.isChecked;
        let chatLimit = this.chat_toggle.isChecked;
        let ddzMode = this.type_toggle.isChecked ? 0 : 1;
        let extent = {
            "JdzMode": ddzMode,//0:叫抢模式(叫地主，抢地主，抢地主)  1：叫分模式（1分，2分，3分，分数最高的是本局的地主）
            "MaxBeiLv": this._top_num,//0:不封顶；  16\32\64倍封顶：当局最大倍数不超过这个设定值
            "FistJdzRandom": this.toggle1.isChecked,//首叫随机
            "TwoKingMustJdz": this.toggle2.isChecked,//双王必叫地主
            "Four2MustJdz": this.toggle3.isChecked,//四个2必叫地主
            "AllowedDouble": this.toggle4.isChecked,//加倍
            "AllowedFourWithTwo": this.toggle5.isChecked,//允许四带二
            "AllowedThreeWithTwo": this.toggle6.isChecked,//允许三带二
            "AllowedThree": this.toggle7.isChecked,//允许三张
            "NotShuffle": !this.random_toggle.isChecked
        }
        AppGame.ins.roomModel.requestCreatRoom(12,"斗地主",turn,0,false,3,isLimit,0,1,0,chatLimit,extent);
    }

    // private time_creat_room():void{
    //     let time = parseInt(this._time_number.string);
    //     let isLimit = this._time_ip_toggle.isChecked;
    //     let extent = {
    //         "JdzMode": 0,//0:叫抢模式(叫地主，抢地主，抢地主)  1：叫分模式（1分，2分，3分，分数最高的是本局的地主）
    //         "MaxBeiLv": 16,//0:不封顶；  16\32\64倍封顶：当局最大倍数不超过这个设定值
    //         "FistJdzRandom": false,//首叫随机
    //         "TwoKingMustJdz": true,//双王必叫地主
    //         "Four2MustJdz": true,//四个2必叫地主
    //         "AllowedDouble": false,//加倍
    //         "AllowedFourWithTwo": true,//允许四带二
    //         "AllowedThreeWithTwo": true,//允许三带二
    //         "AllowedThree": true,//允许三张
    //         "NotShuffle": false
    //     }
    //     AppGame.ins.roomModel.requestCreatRoom(12,"斗地主",0,time,0,isLimit,0,1,0,extent);
    // }

    // private turn_slider():void{
    //     this._turn_slider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange = this._turn_slider.progress;
    //     let a = parseInt(this._turn_slider.progress * 90 + 10 + "");
    //     a = Math.floor(a/5);
    //     a = a * 5;
    //     this._turn_number.string = a + "";
    //     const PART_COIN = 0.25;//斗地主+跑得快：每局消耗0.25张房卡
    //     this._turn_creat_coin_lab.getComponent(cc.Label).string = `x ${Math.ceil(a * PART_COIN)}`;
    //     this._turn_slider.node.getChildByName("Handle").getChildByName("sprite").getComponentInChildren(cc.Label).string = this._turn_number.string;
    // }

    // private turn_slider_touch_start():void{
    //     this._turn_sprite.active = true;
    // }

    // private turn_slider_touch_end():void{
    //     this._turn_sprite.active = false;
    // }

    // private time_slider():void{
    //     this._time_slider.getChildByName("progressBar").getComponent(cc.ProgressBar).progress = this._time_slider.progress;
    //     let a = parseInt(this._time_slider.getComponentInChildren(cc.Sprite).fillRange * 150 + 30 + "");
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
