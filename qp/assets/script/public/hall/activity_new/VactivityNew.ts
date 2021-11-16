import { ECommonUI } from "../../../common/base/UAllenum";
import VWindow from "../../../common/base/VWindow";
import { EventManager } from "../../../common/utility/EventManager";
import UDebug from "../../../common/utility/UDebug";
import UEventHandler from "../../../common/utility/UEventHandler";
import UHandler from "../../../common/utility/UHandler";
import ULanHelper from "../../../common/utility/ULanHelper";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import cfg_event from "../../../config/cfg_event";
import AppGame from "../../base/AppGame";
import { activityType, cfg_activity } from "./cfg_activity";
import MActivity from "./MActivity";


const {ccclass, property} = cc._decorator;

@ccclass
export default class VactivityNew extends VWindow {

    @property ({ type: [cc.SpriteFrame] })
    spriteFramesDay:  Array<cc.SpriteFrame> = [];
    @property ({ type: [cc.SpriteFrame] })
    spriteFramesDayS:  Array<cc.SpriteFrame> = [];
    private _rule_popup: cc.Node;
    private _btn_charge: cc.Node;
    private _btn_rule: cc.Node;
    private _is_rule_open: boolean;
    private _activity_type: activityType;
    private _left_toggle_btns: Array<cc.Toggle>;
    private _activity_contents: Array<cc.Node>;
    private _back:cc.Node;
    
    // LIFE-CYCLE CALLBACKS:btn_

    // onLoad () {}

    init() {
        super.init();
        this._is_rule_open = false;
        this._activity_type =  activityType.REGISTER_REWARD;
        this._left_toggle_btns = [];
        this._activity_contents = [];
        this._rule_popup = UNodeHelper.find(this.node, "root/activity_rule_popup");
        let content = UNodeHelper.find(this.node, "root/maskbg/activity/content");
        this._back = UNodeHelper.find(this.node,"back");

        // content offline_charge
        let offline_charge_content = UNodeHelper.find(content, "offline_charge");
        // this._btn_rule = UNodeHelper.find(content, "offline_charge/activity_rule");
        this._btn_charge = UNodeHelper.find(content, "offline_charge/offline_charge");

        // content continuous_login
        let continuous_login_content = UNodeHelper.find(content, "continuous_login");
        // content offline_charge
        let register_reward_content = UNodeHelper.find(content, "register_reward");
        // content offline_charge
        let rebate_content = UNodeHelper.find(content, "rebate");
        // content offline_charge
        let spread_content = UNodeHelper.find(content, "spread");

        
        this._activity_contents.push(offline_charge_content);
        this._activity_contents.push(continuous_login_content);
        this._activity_contents.push(register_reward_content);
        this._activity_contents.push(rebate_content);
        this._activity_contents.push(spread_content);

        // left 
        let left_bar = UNodeHelper.find(this.node, "root/maskbg/left_bar");
        let offline_charge:cc.Toggle = UNodeHelper.getComponent(left_bar, "offline_charge", cc.Toggle);
        let continuous_login:cc.Toggle = UNodeHelper.getComponent(left_bar, "continuous_login", cc.Toggle);
        let register_reward:cc.Toggle = UNodeHelper.getComponent(left_bar, "register_reward", cc.Toggle);
        let rebate:cc.Toggle = UNodeHelper.getComponent(left_bar, "rebate", cc.Toggle);
        let spread:cc.Toggle = UNodeHelper.getComponent(left_bar, "spread", cc.Toggle);

        this._left_toggle_btns.push(offline_charge);
        this._left_toggle_btns.push(continuous_login);
        this._left_toggle_btns.push(register_reward);
        this._left_toggle_btns.push(rebate);
        this._left_toggle_btns.push(spread);

        UEventHandler.addToggle(offline_charge.node, this.node, "VactivityNew", "onLeftBtnClick", activityType.OFFLINE_CHARGE);
        UEventHandler.addToggle(continuous_login.node, this.node, "VactivityNew", "onLeftBtnClick", activityType.CONTINUOUS_LOGIN);
        UEventHandler.addToggle(register_reward.node, this.node, "VactivityNew", "onLeftBtnClick", activityType.REGISTER_REWARD);  
        UEventHandler.addToggle(rebate.node, this.node, "VactivityNew", "onLeftBtnClick", activityType.REBATE);  
        UEventHandler.addToggle(spread.node, this.node, "VactivityNew", "onLeftBtnClick", activityType.SPREAD);  

        // UEventHandler.addClick(this._btn_rule, this.node, "VactivityNew", "onClickActivityRule");
        UEventHandler.addClick(this._btn_charge, this.node, "VactivityNew", "onClickOfflineCharge");
        UEventHandler.addClick(this._back,this.node,"VactivityNew","closeUI");
    }

    start () {

    }

    show(data: any){
        super.show(data);
        // AppGame.ins.showConnect(true);
        this.onLeftBtnClick(null, this._activity_type);
    }

    closeUI(){
        super.playclick();
        super.clickClose();
        
    }

    onLeftBtnClick(event: Event,type: activityType, isFirst?: boolean)
    {
        super.playclick();
        this._activity_type = type;
        this._left_toggle_btns.forEach(element1 => {
            if (element1.node.name == this._activity_type) {
                element1.isChecked = true;       
            } else {
                element1.isChecked = false; 
            }
        });
        this.selectActivityContent(type);
    }

    selectActivityContent(type: activityType) {
        this._activity_contents.forEach(element => {
            if (element.name != type) {
                element.active = false;
                let com = cfg_activity[type].component;
                let activityId = cfg_activity[type].activityId;
            }
        });
        this._activity_contents.forEach(element => {
            if (element.name == type) {
                element.active = true;
                if (type == activityType.OFFLINE_CHARGE) {
                    
                } else {
                    let com = cfg_activity[type].component;
                    let activityId = cfg_activity[type].activityId;
                    element.getComponent(com).show(activityId);
                }
            }
        });
    }

    initAcrivityContent() {

    }

    onClickActivityRule(event: TouchEvent, params: any) {
        super.playclick();
        let ruleLb = UNodeHelper.getComponent(this.node, "root/activity_rule_popup/lb_rule", cc.Label);
        ruleLb.string = cfg_activity[params].activityHelp;
        if (this._is_rule_open) {
            this._rule_popup.runAction(cc.scaleTo(0.1, 0));
            this._is_rule_open = false;
        } else {
            this._rule_popup.runAction(cc.scaleTo(0.1, 1));
            this._is_rule_open = true;
        }
        
    }

    closeRulePopup() {
        this._rule_popup.runAction(cc.scaleTo(0.1, 0));
        this._is_rule_open = false;
    }

    onClickOfflineCharge() {
        super.playclick();
        this.clickClose();
        let data  = {
            index:1,
            isFullScreen: true
        }
        AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true, index: 1 });
        // if (!AppGame.ins.roleModel.bindMobile) {
        //     AppGame.ins.showUI(ECommonUI.NewMsgBox, {
        //         type: 3, data: ULanHelper.NO_BIND_PHONE, handler: UHandler.create((a) => {
        //             if (a) {
        //                 AppGame.ins.showUI(ECommonUI.LB_Charge);
        //             } else {
        //                 AppGame.ins.showUI(ECommonUI.LB_Regester);
        //             }
        //         }, this)
        //     });

        // } else {
        //     AppGame.ins.showUI(ECommonUI.LB_Charge);
        // }
    }

    getActivityList(data) {
        UDebug.log("getTaskList"+ data);
        // AppGame.ins.showConnect(false);
        this.initAcrivityContent();
    }

    clickClose() {
        super.clickClose();
        this._activity_type = activityType.REGISTER_REWARD;
    }

    // update (dt) {}
}
