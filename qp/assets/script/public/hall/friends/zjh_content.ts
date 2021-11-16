import { ECommonUI } from "../../../common/base/UAllenum";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import UDebug from "../../../common/utility/UDebug";
import UEventHandler from "../../../common/utility/UEventHandler";
import ULanHelper from "../../../common/utility/ULanHelper";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import { account_type } from "../personal/personal";


const {ccclass, property} = cc._decorator;

@ccclass
export default class zjh_content extends cc.Component {

    // private _turn_slider:cc.Slider;
    // private _turn_progress:cc.ProgressBar;
    // private _turn_number:cc.Label;

    // private _difen_slider:cc.Slider;
    // private _difen_progress:cc.ProgressBar;
    // private _difen_number:cc.Label;

    // private _auto_slider:cc.Slider;
    // private _auto_progress:cc.ProgressBar;
    // private _auto_number:cc.Label;

    // private _turn_content:cc.Node;
    // private _time_content:cc.Node;

    // private _integral_slider:cc.Slider;
    // private _integral_slider2:cc.Slider;
    // private _intergral_progress:cc.ProgressBar;
    // private _intergral_progress2:cc.ProgressBar;
    // private _min:cc.Label;
    // private _max:cc.Label;
    // private _handle:cc.Node;
    // private _handle2:cc.Node;
    // private _ip_toggle:cc.Toggle;
    // private _intergral_toggle:cc.Toggle;
    // private _turn_creat_btn:cc.Node;
    // // private _turn_creat_coin_lab:cc.Node;
    // private _turn_count_sprite:cc.Node;
    // private _turn_difen_sprite:cc.Node;
    // private _turn_auto_sprite:cc.Node;
    // private _turn_integral_sprite:cc.Node;
    // private _turn_integral2_sprite:cc.Node;

    @property (cc.ScrollView)
    zjhScrollView: cc.ScrollView = null;
    @property (cc.Slider)
    timeSlider: cc.Slider = null;

    @property (cc.Label)
    time_number: cc.Label = null;

    @property (cc.Label)
    time_slider_number: cc.Label = null;

    @property (cc.Slider)
    time_difenSlider: cc.Slider = null;

    @property (cc.Label)
    time_difen_number: cc.Label = null;

    @property (cc.Slider)
    time_integralSlider: cc.Slider = null;

    @property (cc.Slider)
    time_integralSlider2: cc.Slider = null;

    @property (cc.Node)
    time_intergral_progress: cc.Node = null;

    @property (cc.ProgressBar)
    time_intergral_progress2: cc.ProgressBar = null;

    @property (cc.Label)
    time_min: cc.Label = null;

    @property (cc.Label)
    time_max: cc.Label = null;

    @property (cc.Node)
    handle3: cc.Node = null;

    @property (cc.Node)
    handle4: cc.Node = null;

    @property (cc.Slider)
    time_autoSlider: cc.Slider = null;

    @property (cc.Label)
    time_autoNumber: cc.Label = null;

    @property (cc.Node)
    time_creat_btn: cc.Node = null;

    @property (cc.Node)
    min_score_btn: cc.Node = null;

    @property (cc.Node)
    max_score_btn: cc.Node = null;

    @property (cc.Node)
    ip_limit_btn: cc.Node = null;
    @property (cc.Node)
    auto_ready_btn: cc.Node = null;

    @property (cc.Node)
    ctr_score_btn: cc.Node = null;

    @property (cc.Toggle)
    time_ip_toggle: cc.Toggle = null;

    @property (cc.Toggle)
    time_intergral_toggle: cc.Toggle = null;

    @property (cc.Node)
    time_count_sprite: cc.Node = null;

    @property (cc.Node)
    time_difen_sprite: cc.Node = null;

    @property (cc.Node)
    time_auto_sprite: cc.Node = null;

    @property (cc.Node)
    time_integral_sprite: cc.Node = null;

    @property (cc.Node)
    time_integral2_sprite: cc.Node = null;

    @property (cc.Node)
    auto_start_btn: cc.Node = null;

    @property (cc.Label)
    turn_creat_coin_lab: cc.Label = null;

    @property(cc.Node)
    time_btns:cc.Node = null;

    @property(cc.SpriteFrame)
    normal_btn:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    press_btn:cc.SpriteFrame = null;

    @property(cc.Node)
    time_labels:cc.Node = null;

    @property(cc.SpriteFrame)
    btn_reduce_gray:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    btn_reduce_normal:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    btn_add_gray:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    btn_add_normal:cc.SpriteFrame = null;

    @property(cc.Node)
    btn_reduce:cc.Node = null;

    @property(cc.Node)
    btn_add:cc.Node = null;

    @property(cc.Node)
    difen_btns:cc.Node = null;

    @property(cc.Node)
    difen_labels:cc.Node = null;

    @property(cc.Node)
    auto_btns:cc.Node = null;

    @property(cc.Node)
    auto_labels:cc.Node = null;

    @property(cc.Node)
    integral_labels:cc.Node = null;

    @property(cc.Toggle)
    chatLimit:cc.Toggle = null;

    @property(cc.Node)
    btn_chat_limit:cc.Node = null;

    @property(cc.Toggle)
    auto_toggleContainer:cc.Toggle = null;

    private isBool:boolean=false;
    _offsetY:number = 0;
    onLoad(){

        // //按局数开房

        // //局数滑动条
        // this._turn_slider = UNodeHelper.getComponent(this.node,"turn_content/turn_slider",cc.Slider);
        // this._turn_progress = UNodeHelper.getComponent(this.node,"turn_content/turn_slider/progressBar",cc.ProgressBar);
        // this._turn_number = UNodeHelper.getComponent(this.node,"turn_content/turn_number",cc.Label);
        // this._turn_slider.node.on("slide",this.turn_slider,this);
        // this._turn_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.turn_slider_touch_start,this);
        // this._turn_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.turn_slider_touch_end,this);
        // this._turn_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.turn_slider_touch_end,this);
        // this._turn_count_sprite = UNodeHelper.find(this.node,"turn_content/turn_slider/Handle/sprite");

        // //底分滑动条
        // this._difen_slider = UNodeHelper.getComponent(this.node,"turn_content/difen_slider",cc.Slider);
        // this._difen_progress = UNodeHelper.getComponent(this.node,"turn_content/difen_slider/progressBar",cc.ProgressBar);
        // this._difen_number = UNodeHelper.getComponent(this.node,"turn_content/difen",cc.Label);
        // this._difen_slider.node.on("slide",this.difen_slider,this);
        // this._difen_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.turn_difen_slider_touch_start,this);
        // this._difen_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.turn_difen_slider_touch_end,this);
        // this._difen_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.turn_difen_slider_touch_end,this);
        // this._turn_difen_sprite = UNodeHelper.find(this.node,"turn_content/difen_slider/Handle/sprite");

        // //开局滑动条
        // this._auto_slider = UNodeHelper.getComponent(this.node,"turn_content/auto_slider",cc.Slider);
        // this._auto_progress = UNodeHelper.getComponent(this.node,"turn_content/auto_slider/progressBar",cc.ProgressBar);
        // this._auto_number = UNodeHelper.getComponent(this.node,"turn_content/auto",cc.Label);
        // this._auto_slider.node.on("slide",this.auto_slider,this);
        // this._auto_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.turn_auto_slider_touch_start,this);
        // this._auto_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.turn_auto_slider_touch_end,this);
        // this._auto_slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.turn_auto_slider_touch_end,this);
        // this._turn_auto_sprite = UNodeHelper.find(this.node,"turn_content/auto_slider/Handle/sprite");

        // this._turn_content = UNodeHelper.find(this.node,"turn_content");
        // this._time_content = UNodeHelper.find(this.node,"time_content");

        // this._integral_slider = UNodeHelper.getComponent(this.node,"turn_content/integral_slider",cc.Slider);
        // this._integral_slider2 = UNodeHelper.getComponent(this.node,"turn_content/integral_slider2",cc.Slider);
        // this._intergral_progress = UNodeHelper.getComponent(this.node,"turn_content/integral_slider/progressBar",cc.ProgressBar);
        // this._intergral_progress2 = UNodeHelper.getComponent(this.node,"turn_content/integral_slider2/progressBar",cc.ProgressBar);
        // this._handle = UNodeHelper.find(this.node,"turn_content/Handle");
        // this._handle2 = UNodeHelper.find(this.node,"turn_content/Handle2");
        // this._min = UNodeHelper.getComponent(this.node,"turn_content/min",cc.Label);
        // this._max = UNodeHelper.getComponent(this.node,"turn_content/max",cc.Label);
        // this._integral_slider.node.on("slide",this.intergral_slider,this);
        // this._integral_slider2.node.on("slide",this.intergral2_slider,this);
        // this._ip_toggle = UNodeHelper.getComponent(this.node,"turn_content/ip_toggle",cc.Toggle);
        // this._intergral_toggle = UNodeHelper.getComponent(this.node,"turn_content/intergral_toggle",cc.Toggle);
        // this._turn_creat_btn = UNodeHelper.find(this.node,"turn_content/btn_creat");
        // UEventHandler.addClick(this._turn_creat_btn,this.node,"zjh_content","creat_room_turn");

        // this._turn_content.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.turn_slider1_touch_start,this);
        // this._turn_content.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.turn_slider1_touch_end,this);
        // this._turn_content.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.turn_slider1_touch_end,this);

        // this._turn_content.getChildByName("Handle2").on(cc.Node.EventType.TOUCH_START,this.turn_slider2_touch_start,this);
        // this._turn_content.getChildByName("Handle2").on(cc.Node.EventType.TOUCH_END,this.turn_slider2_touch_end,this);
        // this._turn_content.getChildByName("Handle2").on(cc.Node.EventType.TOUCH_CANCEL,this.turn_slider2_touch_end,this);

        // this._turn_integral_sprite = UNodeHelper.find(this.node,"turn_content/Handle/sprite");
        // this._turn_integral2_sprite = UNodeHelper.find(this.node,"turn_content/Handle2/sprite")
        //按时间开房

        //时间滑动条
        // this.timeSlider = UNodeHelper.getComponent(this.node,"time_content/time_slider",cc.Slider);
        // this.time_number = UNodeHelper.getComponent(this.node,"time_content/time_number",cc.Label);
        this.timeSlider.node.on("slide",this.time_slider,this);
        // this.timeSlider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.time_slider_touch_start,this);
        // this.timeSlider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.time_slider_touch_end,this);
        // this.timeSlider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.time_slider_touch_end,this);
        // this.time_count_sprite = UNodeHelper.find(this.node,"time_content/time_slider/Handle/sprite");
        // this.time_slider_number = UNodeHelper.getComponent(this.node,'time_content/time_slider/Handle/sprite/label',cc.Label);


        //底分滑动条
        // this.time_difenSlider = UNodeHelper.getComponent(this.node,"time_content/difen_slider",cc.Slider);
        // this.time_difen_number = UNodeHelper.getComponent(this.node,"time_content/difen",cc.Label);
        this.time_difenSlider.node.on("slide",this.time_difen_slider,this);
        // this.time_difenSlider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.time_difen_slider_touch_start,this);
        // this.time_difenSlider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.time_difen_slider_touch_end,this);
        // this.time_difenSlider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.time_difen_slider_touch_end,this);
        // this.time_difen_sprite = UNodeHelper.find(this.node,"time_content/difen_slider/Handle/sprite");

        // this.time_integralSlider = UNodeHelper.getComponent(this.node,"time_content/integral_slider",cc.Slider);
        // this.time_integralSlider2 = UNodeHelper.getComponent(this.node,"time_content/integral_slider2",cc.Slider);
        // this.time_intergral_progress = UNodeHelper.getComponent(this.node,"time_content/integral_slider/progressBar",cc.ProgressBar);
        // this.time_intergral_progress2 = UNodeHelper.getComponent(this.node,"time_content/integral_slider2/progressBar",cc.ProgressBar);
        // this.time_min = UNodeHelper.getComponent(this.node,"time_content/min",cc.Label);
        // this.time_max = UNodeHelper.getComponent(this.node,"time_content/max",cc.Label);
        // this.handle3 = UNodeHelper.find(this.node,"time_content/Handle");
        // this.handle4 = UNodeHelper.find(this.node,"time_content/Handle2");
        this.time_integralSlider.node.on("slide",this.time_integral_slider,this);
        this.time_integralSlider2.node.on("slide",this.time_integral_slider2,this);

        // this.handle3.on(cc.Node.EventType.TOUCH_START,this.time_slider1_touch_start,this);
        // this.handle3.on(cc.Node.EventType.TOUCH_END,this.time_slider1_touch_end,this);
        // this.handle3.on(cc.Node.EventType.TOUCH_CANCEL,this.time_slider1_touch_end,this);

        
        // this.handle4.on(cc.Node.EventType.TOUCH_START,this.time_slider2_touch_start,this);
        // this.handle4.on(cc.Node.EventType.TOUCH_END,this.time_slider2_touch_end,this);
        // this.handle4.on(cc.Node.EventType.TOUCH_CANCEL,this.time_slider2_touch_end,this);

        // this.time_integral_sprite = UNodeHelper.find(this.node,"time_content/Handle/sprite");        
        // this.time_integral2_sprite = UNodeHelper.find(this.node,"time_content/Handle2/sprite"); 

        //开局滑动条
        // this.time_autoSlider = UNodeHelper.getComponent(this.node,"time_content/auto_slider",cc.Slider);
        // this.time_autoNumber = UNodeHelper.getComponent(this.node,"time_content/auto",cc.Label);
        this.time_autoSlider.node.on("slide",this.time_auto_slider,this);
        // this.time_autoSlider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.time_auto_slider_touch_start,this);
        // this.time_autoSlider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.time_auto_slider_touch_end,this);
        // this.time_autoSlider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.time_auto_slider_touch_end,this);
        // this.time_auto_sprite = UNodeHelper.find(this.node,"time_content/auto_slider/Handle/sprite");

        // this.time_creat_btn = UNodeHelper.find(this.node,"time_content/btn_creat");
        // this._turn_creat_coin_lab = UNodeHelper.find(this.node,"time_content/btn_creat/coinLab");
        // this.min_score_btn = UNodeHelper.find(this.node,"time_content/btn_min_score");
        // this.max_score_btn = UNodeHelper.find(this.node,"time_content/btn_max_score");
        // this.ip_limit_btn = UNodeHelper.find(this.node,"time_content/btn_ip_limit");
        // this.ctr_score_btn = UNodeHelper.find(this.node,"time_content/btn_ctr_score");
        // this.auto_start_btn = UNodeHelper.find(this.node,"time_content/btn_auto_start");
        this.zjhScrollView.node.on('scroll-ended',this.onZjhScrollEnd,this) 
        UEventHandler.addClick(this.auto_start_btn,this.node,"zjh_content","show_tip_info",ULanHelper.GAME_HELP_TIP_HY.ZHJ_AUTO_START);
        UEventHandler.addClick(this.time_creat_btn,this.node,"zjh_content","creat_room_time");
        UEventHandler.addClick(this.min_score_btn,this.node,"zjh_content","show_tip_info", ULanHelper.GAME_HELP_TIP_HY.ZHJ_MIN_SCORE);
        UEventHandler.addClick(this.max_score_btn,this.node,"zjh_content","show_tip_info",ULanHelper.GAME_HELP_TIP_HY.ZHJ_MAX_SCORE);
        UEventHandler.addClick(this.ip_limit_btn,this.node,"zjh_content","show_tip_info",ULanHelper.GAME_HELP_TIP_HY.ZHJ_IP_LIMIT_SCORE);
        UEventHandler.addClick(this.auto_ready_btn,this.node,"zjh_content","show_tip_info",ULanHelper.GAME_HELP_TIP_HY.ZHJ_AUTO_READY);
        UEventHandler.addClick(this.ctr_score_btn,this.node,"zjh_content","show_tip_info",ULanHelper.GAME_HELP_TIP_HY.ZHJ_CTR_SCORE);
        UEventHandler.addClick(this.btn_chat_limit,this.node,"zjh_content","show_tip_info",ULanHelper.GAME_HELP_TIP_HY.ZHJ_FORBID_CHAT);
        // this.time_ip_toggle = UNodeHelper.getComponent(this.node,"time_content/ip_toggleContainer",cc.Toggle);
        // this.time_intergral_toggle = UNodeHelper.getComponent(this.node,"time_content/intergral_toggleContainer",cc.Toggle);
        // this._time_integral_slider.node.on("slide",this.time_intergral_slider,this);
        // this._time_integral_slider2.node.on("slide",this.time_intergral2_slider,this);



    }

    update(){
        // if(this._handle.x > this._handle2.x){
        //     this._integral_slider.progress = 0;
        //     this._intergral_progress.progress = 0;
        //     this._integral_slider2.progress = 1;
        //     this._intergral_progress2.progress = 0;
        //     this._min.string = "20";
        //     this._max.string = "400";
        //     UDebug.log("重复----")
        // }
        // if(this.isBool){
            if(this.handle3.x > this.handle4.x){
                this.time_integralSlider.progress = 0;
                this.time_intergral_progress.getComponentInChildren(cc.Sprite).fillRange = 0;
                this.time_integralSlider2.progress = 1;
                this.time_intergral_progress2.progress = 0;
                this.time_min.string = "20";
                this.time_max.string = "400";
                UDebug.log("重复----")
            }
        // }
    }

    start(){

    }

    onDestroy(){

    }

    onZjhScrollEnd(){ 
        this._offsetY = this.zjhScrollView.getScrollOffset().y
    }

    // private turn_slider():void{
    //     this._turn_progress.progress = this._turn_slider.progress;
    //     this._turn_number.string = parseInt(this._turn_progress.progress * 25 + 5 + "") + "";
    //     this._turn_count_sprite.getComponentInChildren(cc.Label).string = this._turn_number.string;
    // }

    // private turn_slider_touch_start():void{
    //     this._turn_count_sprite.active = true;
    // }

    // private turn_slider_touch_end():void{
    //     this._turn_count_sprite.active = false;
    // }

    // private difen_slider():void{
    //     this._difen_progress.progress = this._difen_slider.progress;
    //     this._difen_number.string = parseInt(this._difen_progress.progress * 999 + 1 + "") + "";
    //     this._turn_difen_sprite.getComponentInChildren(cc.Label).string = this._difen_number.string;
    // }

    // private turn_difen_slider_touch_start():void{
    //     this._turn_difen_sprite.active = true;
    // }

    // private turn_difen_slider_touch_end():void{
    //     this._turn_difen_sprite.active = false;
    // }

    // private auto_slider():void{
    //     this._auto_progress.progress = this._auto_slider.progress;
    //     // this._auto_number.string = parseInt(this._auto_progress.progress * 2  + 0 + "") + "";
    //     if(this._auto_progress.progress == 0){
    //         this._auto_number.string = "否";
    //     }else if(this._auto_progress.progress == 1){
    //         this._auto_number.string = "2";
    //     }
    //     this._turn_auto_sprite.getComponentInChildren(cc.Label).string = this._auto_number.string;
    // }

    // private turn_auto_slider_touch_start():void{
    //     this._turn_auto_sprite.active = true;
    // }

    // private turn_auto_slider_touch_end():void{
    //     this._turn_auto_sprite.active = false;
    // }

    // private intergral_slider():void{
    //     this._handle.zIndex = 1;
    //     this._handle2.zIndex = 0;
    //     // if(this._integral_slider.progress > this._integral_slider2.progress)
    //     this._intergral_progress.progress = this._integral_slider.progress;
    //     this._min.string = parseInt(this._intergral_progress.progress * 380 + "")  + 20 + "";
    //     this._turn_integral_sprite.getComponentInChildren(cc.Label).string = this._min.string;
    // }
    
    // private turn_slider1_touch_start():void{
    //     this._turn_integral_sprite.active = true;
    // }

    // private turn_slider1_touch_end():void{
    //     this._turn_integral_sprite.active = false;
    // }


    // private intergral2_slider():void{
    //     this._handle.zIndex = 0;
    //     this._handle2.zIndex = 1;
    //     this._intergral_progress2.progress = 1 - this._integral_slider2.progress;
    //     this._max.string = 400 - parseInt(this._intergral_progress2.progress * 380 + "") + "";
    //     this._turn_integral2_sprite.getComponentInChildren(cc.Label).string = this._max.string;
    // }

    // private turn_slider2_touch_start():void{
    //     this._turn_integral2_sprite.active = true;
    // }

    // private turn_slider2_touch_end():void{
    //     this._turn_integral2_sprite.active = false;
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

    //按时间开房

    private time_slider():void{
        // this.timeSlider.progress = Math.round(this.timeSlider.progress*100*(1/11))/100;

        if(Math.ceil(this.timeSlider.progress * 11) !== (this.timeSlider.progress * 11)){
            this.timeSlider.progress = Math.ceil(this.timeSlider.progress * 11)*(1/11);
        }
        this.timeSlider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange = this.timeSlider.progress;
        let c = parseInt(this.timeSlider.progress*11 + '');
        if(c <= 2){
            var a = parseInt(c*5 + 10 + "");
        }else if(c == 3){
            var a = 30;
        }else{
            var a = (c-2)*30;
        }
        // let a = parseInt(c*30 + 30 + "");
        // a = Math.floor(a/30);
        // a = a * 30;
        this.time_number.string = a + "";

        if(this.timeSlider.progress == 0){
            this.btn_reduce.getComponent(cc.Sprite).spriteFrame = this.btn_reduce_gray;
            this.btn_reduce.getComponent(cc.Button).interactable = false;
            this.btn_add.getComponent(cc.Sprite).spriteFrame = this.btn_add_normal;
            this.btn_add.getComponent(cc.Button).interactable = true;
            
        }else if(this.timeSlider.progress == 1){
            this.btn_add.getComponent(cc.Sprite).spriteFrame = this.btn_add_gray;
            this.btn_add.getComponent(cc.Button).interactable = false;
        }else{
            this.btn_reduce.getComponent(cc.Sprite).spriteFrame = this.btn_reduce_normal;
            this.btn_reduce.getComponent(cc.Button).interactable = true;
            this.btn_add.getComponent(cc.Sprite).spriteFrame = this.btn_add_normal;
            this.btn_add.getComponent(cc.Button).interactable = true;
        }

        for (let a = 0; a < this.time_labels.childrenCount; a++) {
            this.time_labels.children[a].y = 62.427;
            this.time_labels.children[a].color = cc.color(189,174,153.255);
            if(this.time_labels.children[a].getComponent(cc.Label).string == this.time_number.string){
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
        this.turn_creat_coin_lab.string = `x ${Math.ceil((a/5) * PART_COIN)}`
        this.time_slider_number.string = this.time_number.string;
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
        this.timeSlider.progress = a*b;
        this.timeSlider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange = a*b;
        for (let a = 0; a < this.time_labels.childrenCount; a++) {
            this.time_labels.children[a].y = 62.427;
            this.time_labels.children[a].color = cc.color(189,174,153.255);
        }
        this.time_labels.children[parseInt(customEventData) - 1].y = 70.427;
        this.time_labels.children[parseInt(customEventData) - 1].color = cc.color(164,116,51,255);
        // let c = 30 + (parseInt(customEventData) -1 )*30;
        if(customEventData <=3 ){
            var c = 10 + (customEventData - 1)*5;
        }else{
            var c = 30 + (customEventData - 4)*30;
        }
        let d = c/5;
        this.time_number.string = c + "";
        const PART_COIN = 2;//5分钟消耗2  通比牛牛+看牌抢庄牛牛+炸金花：每10分钟消耗4张房卡
        this.turn_creat_coin_lab.string = `x ${Math.ceil(d * PART_COIN)}`
        if(customEventData == "1"){
            this.btn_reduce.getComponent(cc.Sprite).spriteFrame = this.btn_reduce_gray;
            this.btn_reduce.getComponent(cc.Button).interactable = false;
            this.btn_add.getComponent(cc.Sprite).spriteFrame = this.btn_add_normal;
            this.btn_add.getComponent(cc.Button).interactable = true;
        }else if(customEventData == "12"){
            this.btn_reduce.getComponent(cc.Sprite).spriteFrame = this.btn_reduce_normal;
            this.btn_reduce.getComponent(cc.Button).interactable = true;
            this.btn_add.getComponent(cc.Sprite).spriteFrame = this.btn_add_gray;
            this.btn_add.getComponent(cc.Button).interactable = false;
        }else{
            this.btn_reduce.getComponent(cc.Sprite).spriteFrame = this.btn_reduce_normal;
            this.btn_reduce.getComponent(cc.Button).interactable = true;
            this.btn_add.getComponent(cc.Sprite).spriteFrame = this.btn_add_normal;
            this.btn_add.getComponent(cc.Button).interactable = true;
        }
        // switch (customEventData) {
        //     case '1':

        //         break;
        //     case '2':
        //         // this.timeSlider.progress = a;
        //         // this.timeSlider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange = a;
        //         break;
        
        //     default:
        //         break;
        // }
    }

    private difen_btn_click(event,customEventData):void{
        for(let i = 0;i < parseInt(customEventData) + 1;i++){
            this.difen_btns.children[i].getComponentInChildren(cc.Sprite).spriteFrame = this.press_btn;
        }

        for (let index = parseInt(customEventData) + 1; index < this.difen_btns.childrenCount; index++) {
            this.difen_btns.children[index].getComponentInChildren(cc.Sprite).spriteFrame = this.normal_btn;
        }

        let a = 1/10;
        let b = parseInt(customEventData);
        this.time_difenSlider.progress = a*b;
        this.time_difenSlider.node.getChildByName('progressBar').getComponentInChildren(cc.Sprite).fillRange = a*b;
        for (let a = 0; a < this.difen_labels.childrenCount; a++) {
            this.difen_labels.children[a].y = 0;
            this.difen_labels.children[a].color = cc.color(189,174,153.255);
        }
        this.difen_labels.children[parseInt(customEventData)].y = 8;
        this.difen_labels.children[parseInt(customEventData)].color = cc.color(164,116,51,255);
    }

    private time_difen_slider():void{
        if(Math.ceil(this.time_difenSlider.progress * 10) !== (this.time_difenSlider.progress * 10)){
            this.time_difenSlider.progress = Math.ceil(this.time_difenSlider.progress * 10)*(1/10);
        }
        this.time_difenSlider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange = this.time_difenSlider.progress;
        // this.time_difen_number.string = parseInt(this.time_difenSlider.progress * 99 + 1 + "") + "";
        for (let index = 0; index < this.difen_labels.childrenCount; index++) {
            this.difen_labels.children[index].y = 0;
            this.difen_labels.children[index].color = cc.color(189,174,153.255);
            if(this.difen_labels.children[index].getComponent(cc.Label).string == this.time_difen_number.string){
                this.difen_labels.children[index].y = 8;
                this.difen_labels.children[index].color = cc.color(164,116,51,255);
                for(let i = 0;i < index;i++){
                    this.difen_btns.children[i].getComponentInChildren(cc.Sprite).spriteFrame = this.press_btn;
                }
                for(let a = index;a < this.difen_btns.childrenCount;a++){
                    this.difen_btns.children[a].getComponentInChildren(cc.Sprite).spriteFrame = this.normal_btn;
                }
            }
            
        }
        let a = parseInt(this.time_difenSlider.progress * 99 + 1 + "");
        a = Math.floor(a/10);
        a = a * 10;
        this.time_difen_number.string = a + "";

        if(this.time_difenSlider.progress == 0){
            this.time_difen_number.string = "1";
        }
        // this.time_difen_sprite.getComponentInChildren(cc.Label).string = this.time_difen_number.string;
    }

    private time_difen_slider_touch_start():void{
        // this.time_difen_sprite.active = true;
    }

    private time_difen_slider_touch_end():void{
        // this.time_difen_sprite.active = false;
    }

    private time_auto_slider():void{
        if(Math.ceil(this.time_autoSlider.progress * 3) !== (this.time_autoSlider.progress * 3)){
            this.time_autoSlider.progress = Math.ceil(this.time_autoSlider.progress * 3)*(1/3);
        }
        this.time_autoSlider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange = this.time_autoSlider.progress;
        // if(this.time_autoSlider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange == 0){
        //     this.time_autoNumber.string = "否";
        // }else if(this.time_autoSlider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange == 1){
        //     this.time_autoNumber.string = "2";
        // }
        // this.time_auto_sprite.getComponentInChildren(cc.Label).string = this.time_autoNumber.string;
        let c = parseInt(this.time_autoSlider.progress*3 + '');
        let a = parseInt(c + 2 + "");
        a = Math.floor(a);
        this.time_autoNumber.string = a + "";
        for(let a = 0;a < this.auto_labels.childrenCount;a++){
            this.auto_labels.children[a].y = 0;
            this.auto_labels.children[a].color = cc.color(189,174,153.255);
            if(this.auto_labels.children[a].getComponent(cc.Label).string == this.time_autoNumber.string){
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
        let c = 1/3;
        let b = parseInt(customEventData) - 2;
        this.time_autoSlider.progress = c*b;
        this.time_autoSlider.node.getChildByName('progressBar').getComponentInChildren(cc.Sprite).fillRange = c*b;
        for (let a = 0; a < this.auto_labels.childrenCount; a++) {
            this.auto_labels.children[a].y = 0;
            this.auto_labels.children[a].color = cc.color(189,174,153.255);
        }
        this.auto_labels.children[parseInt(customEventData) - 2].y = 8;
        this.auto_labels.children[parseInt(customEventData) - 2].color = cc.color(164,116,51,255);
        // if(parseInt(customEventData) == 1){
        //     this.time_autoNumber.string = '否';
        // }else{
            this.time_autoNumber.string = customEventData;
        // }
    }

    private time_auto_slider_touch_start():void{
        this.time_auto_sprite.active = true;
    }

    private time_auto_slider_touch_end():void{
        this.time_auto_sprite.active = false;
    }

    private time_integral_slider():void{
        this.handle3.zIndex = 1;
        this.handle4.zIndex = 0;
        // if(this._integral_slider.progress > this._integral_slider2.progress)
        if(Math.ceil(this.time_integralSlider.progress * 8) !== (this.time_integralSlider.progress * 8)){
            this.time_integralSlider.progress = Math.ceil(this.time_integralSlider.progress * 8)*(1/8);
        }
        let c = parseInt(this.time_integralSlider.progress*8 + '');
        let a = parseInt(c*50 + "");
        // a = Math.floor(a/50);
        // a = a * 50;
        this.time_integralSlider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange = this.time_integralSlider.progress;
        this.time_min.string = a + "";
        if(this.time_integralSlider.progress == 0){
            this.time_min.string = "20";
        }
        for(let index = 0;index < this.integral_labels.childrenCount;index++){
            this.integral_labels.children[index].y = 0;
            this.integral_labels.children[index].color = cc.color(189,174,153.255);
            if(this.integral_labels.children[index].getComponent(cc.Label).string == this.time_min.string){
                this.integral_labels.children[index].y = 8;
                this.integral_labels.children[index].color = cc.color(164,116,51,255);
            }
            if(this.integral_labels.children[index].getComponent(cc.Label).string == this.time_max.string){
                this.integral_labels.children[index].y = 8;
                this.integral_labels.children[index].color = cc.color(164,116,51,255);
            }
        }
        // this.time_integral_sprite.getComponentInChildren(cc.Label).string = this.time_min.string;
    }

    private time_slider1_touch_start():void{
        this.time_integral_sprite.active = true;
    }

    private time_slider1_touch_end():void{
        this.time_integral_sprite.active = false;
    }

    private time_integral_slider2():void{
        this.handle3.zIndex = 0;
        this.handle4.zIndex = 1;
        if(Math.ceil(this.time_integralSlider2.progress * 8) !== (this.time_integralSlider2.progress * 8)){
            this.time_integralSlider2.progress = Math.ceil(this.time_integralSlider2.progress * 8)*(1/8);
        }
        let c = parseInt(this.time_integralSlider2.progress*8 + '');
        let a = parseInt(c*50 + "");
        this.time_integralSlider2.node.getChildByName("progressBar").getComponent(cc.ProgressBar).progress = 1 - this.time_integralSlider2.progress;
        // this.time_max.string = 
        this.time_max.string = a + "";
        if(this.time_integralSlider2.progress == 0){
            this.time_max.string = "20";
        }
        for(let index = 0;index < this.integral_labels.childrenCount;index++){
            this.integral_labels.children[index].y = 0;
            this.integral_labels.children[index].color = cc.color(189,174,153.255);
            if(this.integral_labels.children[index].getComponent(cc.Label).string == this.time_min.string){
                this.integral_labels.children[index].y = 8;
                this.integral_labels.children[index].color = cc.color(164,116,51,255);
            }
            if(this.integral_labels.children[index].getComponent(cc.Label).string == this.time_max.string){
                this.integral_labels.children[index].y = 8;
                this.integral_labels.children[index].color = cc.color(164,116,51,255);
            }
        }
        // this.time_integral2_sprite.getComponentInChildren(cc.Label).string = this.time_max.string;
    }

    private time_slider2_touch_start():void{
        this.time_integral2_sprite.active = true;
    }

    private time_slider2_touch_end():void{
        this.time_integral2_sprite.active = false;
    }

    // private creat_room_turn():void{
    //     let turn = parseInt(this._turn_number.string);
    //     if(this._auto_number.string == "否"){
    //         var auto = 0;
    //     }else{
    //         var auto = parseInt(this._auto_number.string)
    //     }
    //     let isLimit = this._ip_toggle.isChecked;
    //     let scoreLimit = this._intergral_toggle.isChecked;
    //     let minTime = parseInt(this._min.string);
    //     let maxTime = parseInt(this._max.string);
    //     let floorScore = parseInt(this._difen_number.string);
    //     let ceilScore = 0;
    //     AppGame.ins.roomModel.requestCreatRoom(11,"炸金花",turn,0,auto,isLimit,scoreLimit,floorScore,ceilScore,minTime,maxTime);
    // }

    private creat_room_time():void{
        let time = parseInt(this.time_number.string);
        // if(this.time_autoNumber.string == "否"){
        //     var auto = 0;
        // }else{
            // var auto = parseInt(this.time_autoNumber.string)
        // }
        let autoStart = this.auto_toggleContainer.isChecked;
        let playerNumLimit = parseInt(this.time_autoNumber.string);
        let bLimit = this.time_ip_toggle.isChecked;
        let scoreLimit = this.time_intergral_toggle.isChecked;
        let minTime = parseInt(this.time_min.string);
        let maxTime = parseInt(this.time_max.string);
        let floorScore = parseInt(this.time_difen_number.string);
        let ceilScore = 0;
        let chatLimit = this.chatLimit.isChecked;
        let extent = {
            "enterMinScoreTimes": minTime,
            "enterMaxScoreTimes": maxTime,
        }
        AppGame.ins.roomModel.requestCreatRoom(11,"炸金花",0,time,autoStart,playerNumLimit,bLimit,scoreLimit,floorScore,ceilScore,chatLimit,extent);
    }

    private btn_reduce_click():void{
        this.btn_add.getComponent(cc.Sprite).spriteFrame = this.btn_add_normal;
        this.btn_add.getComponent(cc.Button).interactable = true;
        if((this.timeSlider.progress).toFixed(2)  == (1/11).toFixed(2) || this.timeSlider.progress == 0){
            this.btn_reduce.getComponent(cc.Sprite).spriteFrame = this.btn_reduce_gray;
            this.btn_reduce.getComponent(cc.Button).interactable = false;
            this.timeSlider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange = 0;
            this.timeSlider.progress = 0;
        }else{
            this.timeSlider.progress = this.timeSlider.progress - (1/11);
            this.timeSlider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange = this.timeSlider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange - (1/11);
        }

        let c = Math.ceil(this.timeSlider.progress*11);
        let a = parseInt(c*30 + 30 + "");
        a = Math.floor(a/30);
        a = a * 30;
        this.time_number.string = a + "";
        const PART_COIN = 7;//通比牛牛+看牌抢庄牛牛+炸金花：每30分钟消耗7张房卡
        this.turn_creat_coin_lab.string = `x ${Math.ceil((a/30) * PART_COIN)}`
        for(let d = 0;d < this.time_labels.childrenCount;d++){
            if(this.time_labels.children[d].getComponent(cc.Label).string == this.time_number.string){
                this.time_labels.children[d].y = 70.427;
                this.time_labels.children[d].color = cc.color(164,116,51,255);
                for(let e = 0; e < d;e++){
                    this.time_btns.children[e].getComponentInChildren(cc.Sprite).spriteFrame = this.press_btn;
                }
                for(let f = d; f < this.time_btns.childrenCount;f++){
                    this.time_btns.children[f].getComponentInChildren(cc.Sprite).spriteFrame = this.normal_btn;
                }
            }else{
                this.time_labels.children[d].y = 62.427;
                this.time_labels.children[d].color = cc.color(189,174,153.255);
            }
        }
        // let c = parseInt(this.timeSlider.progress*11 + '');
        // let a = parseInt(c*30 + 30 + "");
        // a = Math.floor(a/30);
        // a = a * 30;
        // this.time_number.string = a + "";
        // const PART_COIN = 7;//通比牛牛+看牌抢庄牛牛+炸金花：每30分钟消耗7张房卡
        // this.turn_creat_coin_lab.string = `x ${Math.ceil((a/30) * PART_COIN)}`
    }

    private btn_add_click():void{
        this.btn_reduce.getComponent(cc.Sprite).spriteFrame = this.btn_reduce_normal;
        this.btn_reduce.getComponent(cc.Button).interactable = true;
        if((this.timeSlider.progress).toFixed(2)  == (10/11).toFixed(2) || this.timeSlider.progress == 1){
            this.btn_add.getComponent(cc.Sprite).spriteFrame = this.btn_add_gray;
            this.btn_add.getComponent(cc.Button).interactable = false;
            this.timeSlider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange = 1;
            this.timeSlider.progress = 1;
            for(let a = 0; a < this.time_btns.childrenCount;a++){
                this.time_btns.children[a].getComponentInChildren(cc.Sprite).spriteFrame = this.press_btn;
            }
        }else{
            this.timeSlider.progress = this.timeSlider.progress + (1/11);
            this.timeSlider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange = this.timeSlider.node.getChildByName("progressBar").getComponentInChildren(cc.Sprite).fillRange + (1/11);
        }
        let c = parseInt(this.timeSlider.progress*11 + '');
        let a = parseInt(c*30 + 30 + "");
        a = Math.floor(a/30);
        a = a * 30;
        this.time_number.string = a + "";
        const PART_COIN = 7;//通比牛牛+看牌抢庄牛牛+炸金花：每30分钟消耗7张房卡
        this.turn_creat_coin_lab.string = `x ${Math.ceil((a/30) * PART_COIN)}`
        for(let d = 0;d < this.time_labels.childrenCount;d++){
            if(this.time_labels.children[d].getComponent(cc.Label).string == this.time_number.string){
                this.time_labels.children[d].y = 70.427;
                this.time_labels.children[d].color = cc.color(164,116,51,255);
                for(let e = 0; e < d;e++){
                    this.time_btns.children[e].getComponentInChildren(cc.Sprite).spriteFrame = this.press_btn;
                }
                for(let f = d; f < this.time_btns.childrenCount;f++){
                    this.time_btns.children[f].getComponentInChildren(cc.Sprite).spriteFrame = this.normal_btn;
                }
            }else{
                this.time_labels.children[d].y = 62.427;
                this.time_labels.children[d].color = cc.color(189,174,153.255);
            }
        }
    }

    show_tip_info(event: any, tips: string): void { 
        let offsetY = 0;
        if(tips == ULanHelper.GAME_HELP_TIP_HY.ZHJ_AUTO_START || tips == ULanHelper.GAME_HELP_TIP_HY.ZHJ_MIN_SCORE || tips == ULanHelper.GAME_HELP_TIP_HY.ZHJ_MAX_SCORE) {
            offsetY = this._offsetY - 13;
        } else {
            offsetY -= 285 ;
        }
        let data = {msg:tips,height:UAPIHelper.getItemHeight(tips),v_point:cc.v2(event.target.x,event.target.y + offsetY) };
        AppGame.ins.showUI(ECommonUI.UI_TIP_HY, data);
    }

    onDisable(){
        // this._turn_content.active = true;
        // this._time_content.active = false;
        // UNodeHelper.find(this.node,"toggleContainer/toggle1").getComponent(cc.Toggle).isChecked = true;
        // UNodeHelper.find(this.node,"toggleContainer/toggle2").getComponent(cc.Toggle).isChecked = false;
        // this._turn_slider.progress = 0;
        // this._turn_progress.progress = 0;
        // this._difen_slider.progress = 0;
        // this._difen_progress.progress = 0;
        // this._auto_slider.progress = 0;
        // this._auto_progress.progress = 0;
        // this._integral_slider.progress = 0;
        // this._intergral_progress.progress = 0;
        // this._integral_slider2.progress = 1;
        // this._intergral_progress2.progress = 0;
        // this._ip_toggle.isChecked = false;
        // this._intergral_toggle.isChecked = false;
        // this._turn_number.string = "5";
        // this._difen_number.string = "1";
        // this._min.string = "20";
        // this._max.string = "400";
        // this._auto_number.string = "否";
        
    }
}
