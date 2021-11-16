// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import VWindow from "../../../common/base/VWindow";
import UDebug from "../../../common/utility/UDebug";
import UEventHandler from "../../../common/utility/UEventHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import MZJH_hy from "../../../game/zjh_hy/MZJH_hy";
import AppGame from "../../base/AppGame";
import { ZJH_SCALE } from "../lobby/VHall";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ui_bring_points extends VWindow {

    private _slider:cc.Slider;
    private _progressBar:cc.Node;
    private _points:cc.Label;
    private _btn_confirm:cc.Node;
    private _min:cc.Label;
    private _max:cc.Label;
    private _handle_label:cc.Label;
    private _handle_sprite:cc.Node;

    init() {
        super.init();
        this._slider = UNodeHelper.getComponent(this._root,"slider",cc.Slider);
        this._progressBar = UNodeHelper.find(this._root,"slider/progressBar");
        this._points = UNodeHelper.getComponent(this.node,"root/points",cc.Label);
        this._slider.node.on("slide",this.slider_move,this);
        this._slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_START,this.touch_start,this);
        this._slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_END,this.touch_end,this);
        this._slider.node.getChildByName("Handle").on(cc.Node.EventType.TOUCH_CANCEL,this.touch_end,this);
        this._btn_confirm = UNodeHelper.find(this._root,"btn_confirm");
        UEventHandler.addClick(this._btn_confirm,this.node,"ui_bring_points","supplement");

        this._min = UNodeHelper.getComponent(this._root,"left_node/min",cc.Label);
        this._max = UNodeHelper.getComponent(this._root,"right_node/max",cc.Label);
        this._handle_label = UNodeHelper.getComponent(this._root,'slider/Handle/sprite/label',cc.Label);
        this._handle_sprite = UNodeHelper.find(this._root,'slider/Handle/sprite');
    }

    start(){
        
    }

    // onLoad () {}
    private slider_move():void{
        this._progressBar.getComponentInChildren(cc.Sprite).fillRange = this._slider.progress;
        this._points.string = parseInt(this._progressBar.getComponentInChildren(cc.Sprite).fillRange * (parseInt(this._max.string) - parseInt(this._min.string)) + parseInt(this._min.string) + "") + "";
        this._handle_label.string = this._points.string;
    }

    private touch_start():void{
        this._handle_sprite.active = true;
    }

    private touch_end():void{
        this._handle_sprite.active = false;
    }

    private supplement():void{

        if(AppGame.ins.fzjhModel.roomInfo.bAddScoreLimit){
            if(AppGame.ins.fzjhModel._roomInfo.roomUserId !== AppGame.ins.roleModel.useId){
                if(AppGame.ins.fzjhModel._sengMsg){
                    AppGame.ins.showTips("房主正在审核，请等待");
                }else{
                    AppGame.ins.fzjhModel.requestSupplement(parseInt(this._points.string)*100);
                    AppGame.ins.showTips("等待房主确认您带入的积分");
                    AppGame.ins.fzjhModel._sengMsg = true;
                }
            }else{
                AppGame.ins.fzjhModel.requestSupplement(parseInt(this._points.string)*100);
            }
        }else{
            AppGame.ins.fzjhModel.requestSupplement(parseInt(this._points.string)*100);
        }
        
        super.playclick();
        super.clickClose();
    }



    closeUI(){
        super.playclick();
        super.clickClose();

    }

    onEnable(){
        let a = JSON.parse(AppGame.ins.fzjhModel._roomInfo.extent);
        this._min.string = AppGame.ins.fzjhModel._roomInfo.floorScore/100 * a.enterMinScoreTimes + "";
        this._max.string = AppGame.ins.fzjhModel._roomInfo.floorScore/100 * a.enterMaxScoreTimes + "";
        this._points.string = (parseInt((parseInt(this._max.string) - parseInt(this._min.string))/2 + "") + parseInt(this._min.string))  + "";
        this._handle_label.string = (parseInt((parseInt(AppGame.ins.fzjhModel._roomInfo.floorScore/100 * a.enterMaxScoreTimes + "") - parseInt(AppGame.ins.fzjhModel._roomInfo.floorScore/100 * a.enterMinScoreTimes + ""))/2 + "") + parseInt(AppGame.ins.fzjhModel._roomInfo.floorScore/100 * a.enterMinScoreTimes + ""))  + "";
        UDebug.log("底注为：" +  AppGame.ins.fzjhModel._roomInfo.floorScore/100 + "最小倍数为：" + a.enterMinScoreTimes + "最大倍数为：" + a.enterMaxScoreTimes)
    }


    onDisable(){
        let a = JSON.parse(AppGame.ins.fzjhModel._roomInfo.extent);
        this._slider.progress = 0.5;
        this._progressBar.getComponentInChildren(cc.Sprite).fillRange = 0.5;
        this._min.string = AppGame.ins.fzjhModel._roomInfo.floorScore/100 * a.enterMinScoreTimes + "";
        this._max.string = AppGame.ins.fzjhModel._roomInfo.floorScore/100 * a.enterMaxScoreTimes + "";
        this._points.string = (parseInt(this._max.string) - parseInt(this._min.string))/2 + parseInt(this._min.string)  + "";
        this._handle_label.string = (parseInt((parseInt(AppGame.ins.fzjhModel._roomInfo.floorScore/100 * a.enterMaxScoreTimes + "") - parseInt(AppGame.ins.fzjhModel._roomInfo.floorScore/100 * a.enterMinScoreTimes + ""))/2 + "") + parseInt(AppGame.ins.fzjhModel._roomInfo.floorScore/100 * a.enterMinScoreTimes + ""))  + "";
        // if(AppGame.ins.fzjhModel._battleplayer[AppGame.ins.roleModel.useId].score*ZJH_SCALE < AppGame.ins.fzjhModel._roomInfo.floorScore/100*AppGame.ins.fzjhModel._roomInfo.enterMinScoreTimes){
        //     AppGame.ins.showTips("您的积分不足，请补充");
        // }    
    }


    
    // hide(){
    //     AppGame.ins.fzjhModel.requestUserScore();
    // }

    // show(data:any){
    //     this._slider.progress = 0.5;
    //     this._progressBar.progress = 0.5;
    //     this._min.string = AppGame.ins.fzjhModel._roomInfo.floorScore/100 * AppGame.ins.fzjhModel._roomInfo.enterMinScoreTimes + "";
    //     this._max.string = AppGame.ins.fzjhModel._roomInfo.floorScore/100 * AppGame.ins.fzjhModel._roomInfo.enterMaxScoreTimes + "";
    //     this._points.string = (parseInt(this._max.string) - parseInt(this._min.string))/2 + parseInt(this._min.string)  + "";
    //     this._slider.node.getChildByName("Handle").getChildByName("sprite").getComponentInChildren(cc.Label).string = (parseInt((parseInt(this._max.string) - parseInt(this._min.string))/2 + "") + parseInt(this._min.string))  + "";
       
    // }

    // update (dt) {}
}
