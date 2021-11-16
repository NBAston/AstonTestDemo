
import { ToBattle } from "../../../common/base/UAllClass";
import { EAppStatus, ECommonUI, EGameType } from "../../../common/base/UAllenum";
import UScene from "../../../common/base/UScene";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import UHandler from "../../../common/utility/UHandler";
import ULanHelper from "../../../common/utility/ULanHelper";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import cfg_game from "../../../config/cfg_game";
import AppGame from "../../base/AppGame";
import UIManager from "../../base/UIManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class tbnn_content extends cc.Component {

    private _turn_content:cc.Node;
    private _time_content:cc.Node;
    private _turn_slider:cc.Slider;
    private _turn_number:cc.Label;
    private _time_slider:cc.Slider;
    private _time_number:cc.Label;
    private _turn_auto_slider:cc.Slider;
    private _turn_auto_number:cc.Label;
    private _time_auto_slider:cc.Slider;
    private _time_auto_number:cc.Label;
    private _turn_creat_btn:cc.Node;
    private _time_creat_btn:cc.Node;
    private _turn_creat_coin_lab:cc.Node;
    private _turn_ip_toggle:cc.Toggle;
    private _time_ip_toggle:cc.Toggle;
    private _turn_count_sprite:cc.Node;
    private _turn_auto_sprite:cc.Node;
    private _time_count_sprite:cc.Node;
    private _time_auto_sprite:cc.Node;
    private _ip_limit_btn:cc.Node;
    private _auto_ready_btn: cc.Node = null;
    private _auto_start_btn:cc.Node;

    @property(cc.Node)
    time_btns:cc.Node = null;

    @property(cc.Node)
    time_labels:cc.Node = null;

    @property(cc.Node)
    auto_btns:cc.Node = null;

    @property(cc.Node)
    auto_labels:cc.Node = null;

    @property(cc.SpriteFrame)
    press_btn:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    normal_btn:cc.SpriteFrame = null;

    @property(cc.Toggle)
    chat_toggle:cc.Toggle = null;

    @property(cc.Node)
    btn_chat_limit:cc.Node = null;

    @property(cc.Toggle)
    auto_toggleContainer:cc.Toggle = null;

    /**
     * ui控制器
     */
    private _uimanager: UIManager;

    onLoad () {
        this._turn_content = UNodeHelper.find(this.node,"turn_content");
        this._time_content = UNodeHelper.find(this.node,"time_content");
        this._turn_slider = UNodeHelper.getComponent(this.node,"turn_content/turn_slider",cc.Slider);
        this._turn_number = UNodeHelper.getComponent(this.node,"turn_content/turn_number",cc.Label);
        this._turn_slider.node.on("slide",this.turn_slider,this);
        // this._turn_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.turn_slider_touch_start,this);
        // this._turn_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.turn_slider_touch_end,this);
        // this._turn_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.turn_slider_touch_end,this);
        this._turn_count_sprite = UNodeHelper.find(this.node,"turn_content/turn_slider/Handle/sprite");

        this._turn_auto_slider = UNodeHelper.getComponent(this.node,"turn_content/auto_slider",cc.Slider);
        this._turn_auto_number = UNodeHelper.getComponent(this.node,"turn_content/auto_number",cc.Label);
        this._turn_auto_slider.node.on("slide",this.turn_auto_slider,this);
        // this._turn_auto_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.turn_auto_slider_touch_start,this);
        // this._turn_auto_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.turn_auto_slider_touch_end,this);
        // this._turn_auto_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.turn_auto_slider_touch_end,this);
        this._turn_auto_sprite = UNodeHelper.find(this.node,"turn_content/auto_slider/Handle/sprite");

        this._time_slider = UNodeHelper.getComponent(this.node,"time_content/time_slider",cc.Slider);
        this._time_number = UNodeHelper.getComponent(this.node,"time_content/time_number",cc.Label);
        this._time_slider.node.on("slide",this.time_slider,this);
        // this._time_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.time_slider_touch_start,this);
        // this._time_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.time_slider_touch_end,this);
        // this._time_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.time_slider_touch_end,this);
        this._time_count_sprite = UNodeHelper.find(this.node,"time_content/time_slider/Handle/sprite");

        this._time_auto_slider = UNodeHelper.getComponent(this.node,"time_content/auto_slider",cc.Slider);
        this._time_auto_number = UNodeHelper.getComponent(this.node,"time_content/auto_number",cc.Label);
        this._time_auto_slider.node.on("slide",this.time_auto_slider,this);
        // this._time_auto_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.time_auto_slider_touch_start,this);
        // this._time_auto_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.time_auto_slider_touch_end,this);
        // this._time_auto_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.time_auto_slider_touch_end,this);
        this._time_auto_sprite = UNodeHelper.find(this.node,"time_content/auto_slider/Handle/sprite");


        this._turn_creat_btn = UNodeHelper.find(this.node,"turn_content/btn_creat");
        UEventHandler.addClick(this._turn_creat_btn,this.node,"tbnn_content","turn_creat_room");
        this._turn_ip_toggle = UNodeHelper.getComponent(this.node,"turn_content/ip_toggleContainer",cc.Toggle);
        this._ip_limit_btn = UNodeHelper.find(this.node,"time_content/btn_ip_limit");
        UEventHandler.addClick(this._ip_limit_btn,this.node,"tbnn_content","show_tip_info",ULanHelper.GAME_HELP_TIP_HY.ZHJ_IP_LIMIT_SCORE);
        this._auto_ready_btn = UNodeHelper.find(this.node,"time_content/btn_auto_limit");
        UEventHandler.addClick(this._auto_ready_btn,this.node,"tbnn_content","show_tip_info",ULanHelper.GAME_HELP_TIP_HY.ZHJ_AUTO_READY);
        this._auto_start_btn = UNodeHelper.find(this.node,"time_content/btn_auto_start");
        UEventHandler.addClick(this._auto_start_btn,this.node,"tbnn_content","show_tip_info",ULanHelper.GAME_HELP_TIP_HY.ZHJ_AUTO_START);
        UEventHandler.addClick(this.btn_chat_limit,this.node,"tbnn_content","show_tip_info",ULanHelper.GAME_HELP_TIP_HY.ZHJ_FORBID_CHAT);
        this._time_creat_btn = UNodeHelper.find(this.node,"time_content/btn_creat");
        this._turn_creat_coin_lab = UNodeHelper.find(this.node,"time_content/btn_creat/coinLab");
        UEventHandler.addClick(this._time_creat_btn,this.node,"tbnn_content","time_creat_room");
        this._time_ip_toggle = UNodeHelper.getComponent(this.node,"time_content/ip_toggleContainer",cc.Toggle);

    }

    start () {

    }

    // private turn_creat_room():void{
    //     let turn = parseInt(this._turn_number.string);
    //     let isLimit = this._turn_ip_toggle.isChecked;
    //     if(this._turn_auto_number.string == "否"){
    //         var a = 0;
    //     }else{
    //         var a = parseInt(this._turn_auto_number.string);
    //     }
    //     AppGame.ins.roomModel.requestCreatRoom(15,"通比牛牛",turn,0,a,isLimit,0,1,0,);


        // AppGame.ins.roomModel.requestEnterRoom(1501, EGameType.TBNN_HY, false);
    // }

    private time_creat_room():void{
        let time = parseInt(this._time_number.string);
        let isLimit = this._time_ip_toggle.isChecked;
        let autoStart = this.auto_toggleContainer.isChecked;
        let chatLimit = this.chat_toggle.isChecked;
        var a = parseInt(this._time_auto_number.string);
        AppGame.ins.roomModel.requestCreatRoom(15,"通比牛牛",0,time,autoStart,a,isLimit,0,1,0,chatLimit);
    }

    
    private turnToggle():void{
        let a = UNodeHelper.find(this.node,"toggleContainer/toggle1");
        if(a.getComponent(cc.Toggle).isChecked == true){
            this._turn_content.active = true;
            this._time_content.active = false;
        }else{
            this._turn_content.active = false;
            this._time_content.active = true;
        }
    }

    private timeToggle():void{
        let a = UNodeHelper.find(this.node,"toggleContainer/toggle2");
        if(a.getComponent(cc.Toggle).isChecked == false){
            this._turn_content.active = true;
            this._time_content.active = false;
        }else{
            this._turn_content.active = false;
            this._time_content.active = true;
        }
    }

    private turn_slider():void{
        this._turn_slider.node.getChildByName("progressBar").getComponent(cc.ProgressBar).progress = this._turn_slider.progress;
        this._turn_number.string = parseInt(this._turn_slider.progress * 25 + 5 + "") + "";
        this._turn_count_sprite.getComponentInChildren(cc.Label).string = this._turn_number.string;
    }

    private turn_slider_touch_start():void{
        this._turn_count_sprite.active = true;
    }

    private turn_slider_touch_end():void{
        this._turn_count_sprite.active = false;
    }

    private turn_auto_slider():void{
        this._turn_auto_slider.node.getChildByName("progressBar").getComponent(cc.ProgressBar).progress = this._turn_auto_slider.progress;
        if(this._turn_auto_slider.node.getChildByName("progressBar").getComponent(cc.ProgressBar).progress == 0){
            this._turn_auto_number.string = "否";
        }else if(this._turn_auto_slider.node.getChildByName("progressBar").getComponent(cc.ProgressBar).progress == 1){
            this._turn_auto_number.string = "2";
        }
        this._turn_auto_sprite.getComponentInChildren(cc.Label).string = this._turn_auto_number.string;
    }
    
    private turn_auto_slider_touch_start():void{
        this._turn_auto_sprite.active = true;
    }   

    private turn_auto_slider_touch_end():void{
        this._turn_auto_sprite.active = false;
    }

    private time_slider():void{
        if(Math.ceil(this._time_slider.progress * 11) !== (this._time_slider.progress * 11)){
            this._time_slider.progress = Math.ceil(this._time_slider.progress * 11)*(1/11);
        }
        this._time_slider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange = this._time_slider.progress;

        let c = parseInt(this._time_slider.progress*11 + '');
        if(c <= 2){
            var a = parseInt(c*5 + 10 + "");
        }else if(c == 3){
            var a = 30;
        }else{
            var a = (c-2)*30;
        }
        this._time_number.string = a + "";

        for (let a = 0; a < this.time_labels.childrenCount; a++) {
            this.time_labels.children[a].y = 62.427;
            this.time_labels.children[a].color = cc.color(189,174,153.255);
            if(this.time_labels.children[a].getComponent(cc.Label).string == this._time_number.string){
                this.time_labels.children[a].y = 70.427;
                this.time_labels.children[a].color = cc.color(164,116,51,255);
                for(let i = 0; i < a + 1;i++){
                    this.time_btns.children[i].getComponentInChildren(cc.Sprite).spriteFrame = this.press_btn;
                }
                for(let index = a +1; index < this.time_btns.childrenCount;index++){
                    this.time_btns.children[index].getComponentInChildren(cc.Sprite).spriteFrame = this.normal_btn;  
                }
            }
        }

        const PART_COIN = 2;//5分钟消耗2  通比牛牛+看牌抢庄牛牛+炸金花：每10分钟消耗4张房卡
        this._turn_creat_coin_lab.getComponent(cc.Label).string = `x ${Math.ceil((a/5) * PART_COIN)}`
        // this._time_count_sprite.getComponentInChildren(cc.Label).string = this._time_number.string;
    }

    private time_btn(event,customEventData):void{
        for(let i = 0;i < parseInt(customEventData) ;i++){
            this.time_btns.children[i].getComponentInChildren(cc.Sprite).spriteFrame = this.press_btn;
        }

        for (let index = parseInt(customEventData); index < this.time_btns.childrenCount; index++) {
            this.time_btns.children[index].getComponentInChildren(cc.Sprite).spriteFrame = this.normal_btn;  
        }
        let a = 1/11;
        let b = parseInt(customEventData) - 1;
        this._time_slider.progress = a*b;
        this._time_slider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange = a*b;
        for (let a = 0; a < this.time_labels.childrenCount; a++) {
            this.time_labels.children[a].y = 62.427;
            this.time_labels.children[a].color = cc.color(189,174,153.255);
        }
        this.time_labels.children[parseInt(customEventData) - 1].y = 70.427;
        this.time_labels.children[parseInt(customEventData) - 1].color = cc.color(164,116,51,255);
        if(customEventData <=3 ){
            var c = 10 + (customEventData - 1)*5;
        }else{
            var c = 30 + (customEventData - 4)*30;
        }
        let d = c/5;
        this._time_number.string = c + "";
        const PART_COIN = 2;//5分钟消耗2  通比牛牛+看牌抢庄牛牛+炸金花：每10分钟消耗4张房卡
        this._turn_creat_coin_lab.getComponent(cc.Label).string = `x ${Math.ceil(d * PART_COIN)}`;
    }

    private time_slider_touch_start():void{
        this._time_count_sprite.active = true;
    }

    private time_slider_touch_end():void{
        this._time_count_sprite.active = false;
    }

    private time_auto_slider():void{
        if(Math.ceil(this._time_auto_slider.progress * 2) !== (this._time_auto_slider.progress * 2)){
            this._time_auto_slider.progress = Math.ceil(this._time_auto_slider.progress * 2)*(1/2);
        }
        this._time_auto_slider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange = this._time_auto_slider.progress;
        let c = parseInt(this._time_auto_slider.progress*2 + '');
        let a = parseInt(c + 2 + "");
        a = Math.floor(a);
        this._time_auto_number.string = a + "";


        for(let a = 0;a < this.auto_labels.childrenCount;a++){
            this.auto_labels.children[a].y = 0;
            this.auto_labels.children[a].color = cc.color(189,174,153.255);
            if(this.auto_labels.children[a].getComponent(cc.Label).string == this._time_auto_number.string){
                this.auto_labels.children[a].y = 8;
                this.auto_labels.children[a].color = cc.color(164,116,51,255);
                for(let i = 0;i < a + 1;i++){
                    this.auto_btns.children[i].getComponentInChildren(cc.Sprite).spriteFrame = this.press_btn;
                }
                for(let index = a +1; index < this.auto_btns.childrenCount;index++){
                    this.auto_btns.children[index].getComponentInChildren(cc.Sprite).spriteFrame = this.normal_btn;  
                }
            }
        }
    }

    private auto_btn_click(event,customEventData):void{
        for (let index = 0; index < parseInt(customEventData) - 2; index++) {
            this.auto_btns.children[index].getComponentInChildren(cc.Sprite).spriteFrame = this.press_btn;
        }
        for (let index = parseInt(customEventData) - 2; index < this.auto_btns.childrenCount; index++) {
            this.auto_btns.children[index].getComponentInChildren(cc.Sprite).spriteFrame = this.normal_btn;
        }
        let c = 1/2;
        let b = parseInt(customEventData) - 2;
        this._time_auto_slider.progress = c*b;
        this._time_auto_slider.node.getChildByName('progressBar').getComponentInChildren(cc.Sprite).fillRange = c*b;
        for (let a = 0; a < this.auto_labels.childrenCount; a++) {
            this.auto_labels.children[a].y = 0;
            this.auto_labels.children[a].color = cc.color(189,174,153.255);
        }
        this.auto_labels.children[parseInt(customEventData) - 2].y = 8;
        this.auto_labels.children[parseInt(customEventData) - 2].color = cc.color(164,116,51,255);
        // if(parseInt(customEventData) == 1){
        //     this._time_auto_number.string = '否';
        // }else{
            this._time_auto_number.string = customEventData;
        // }
    }

    private time_auto_slider_touch_start():void{
        this._time_auto_sprite.active = true;
    }

    private time_auto_slider_touch_end():void{
        this._time_auto_sprite.active = false;
    }

    show_tip_info(event: any, tips: string): void {
        let data = {msg:tips,height:UAPIHelper.getItemHeight(tips),v_point:cc.v2(event.target.x,event.target.y) };
        AppGame.ins.showUI(ECommonUI.UI_TIP_HY, data);
    }
    
}


