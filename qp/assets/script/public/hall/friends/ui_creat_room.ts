import { EAgentLevelReqType, ECommonUI, EMsgType } from "../../../common/base/UAllenum";
import VWindow from "../../../common/base/VWindow";
import { HallFriendServer } from "../../../common/cmd/proto";
import UDebug from "../../../common/utility/UDebug";
import UEventHandler from "../../../common/utility/UEventHandler";
import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import MHall from "../lobby/MHall";
import MRoomModel from "../room_zjh/MRoomModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ui_creat_room extends VWindow {

    private _toggle_container:cc.Node;
    private _content:cc.Node;

    init() {
        super.init();
        this._toggle_container = UNodeHelper.find(this._root,"maskbg/left_bar/toggleContainer");
        this._content = UNodeHelper.find(this._root,"maskbg/creat_room/content");
    }

    closeUI(){
        super.playclick();
        super.clickClose();
        
    }

    private btnClick():void{
        for(var i = 0; i < this._content.childrenCount;i++){
            this._content.children[i].active = false;
        }
        if(this._toggle_container.getChildByName("btn_zjh").getComponent(cc.Toggle).isChecked == true){
            this._content.getChildByName("zjh").active = true;
        }
        if(this._toggle_container.getChildByName("btn_ddz").getComponent(cc.Toggle).isChecked == true){
            this._content.getChildByName("ddz").active = true;
        }
        if(this._toggle_container.getChildByName("btn_pdk").getComponent(cc.Toggle).isChecked == true){
            this._content.getChildByName("pdk").active = true;
        }
        if(this._toggle_container.getChildByName("btn_kpqznn").getComponent(cc.Toggle).isChecked == true){
            this._content.getChildByName("kpqznn").active = true;
        }
        if(this._toggle_container.getChildByName("btn_tbnn").getComponent(cc.Toggle).isChecked == true){
            this._content.getChildByName("tbnn").active = true;
        }
    }

    private get_game_list(caller:HallFriendServer.GameListMessageResponse){
        if(caller.retCode == 0){
            UDebug.log("返回游戏列表:" + caller);
        }else{

        }
    }

    onEnable(){
        AppGame.ins.hallModel.on(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);
        AppGame.ins.roomModel.on(MRoomModel.NO_ENOUGH_ROOM_CARD, this.onNoEnoughRoomCard, this);
    }

    onDisable(){
        AppGame.ins.hallModel.off(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);
        AppGame.ins.roomModel.off(MRoomModel.NO_ENOUGH_ROOM_CARD, this.onNoEnoughRoomCard, this);

        this._toggle_container.getChildByName("btn_zjh").getComponent(cc.Toggle).isChecked = true;
        for(var i = 0;i < this._content.childrenCount;i++){
            this._content.children[i].active = false;
        }
        this._content.getChildByName("zjh").active = true;
    }

    /**房卡不足 */
    onNoEnoughRoomCard(errorMsg: any) {
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: EMsgType.EOKAndCancel, data: errorMsg, handler: UHandler.create((a) => {
                if (a) {
                    AppGame.ins.hallModel.requestAgentLevel(EAgentLevelReqType.creatRoom);
                }
            }, this)
        });
    }

    /**获取到代理等级 */ 
    onAgentLevelRes(data: any) {
        // AppGame.ins.closeUI(ECommonUI.UI_CREAT_ROOM);
        // AppGame.ins.closeUI(ECommonUI.UI_ENTER_ROOM);
        if (AppGame.ins.hallModel.reqAgentLevelType != EAgentLevelReqType.creatRoom) return;
        if (!data || data.retCode != 0 || !data.hasOwnProperty('level')) {
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true, index: 3 });
            return;
        }
        if (data.level < 5) {
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true, index: 3 });
        } else {
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true, index: 2 });
        }
    }

}

