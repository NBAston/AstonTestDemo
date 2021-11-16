import { ToBattle } from "../../../common/base/UAllClass";
import { EAgentLevelReqType, EAppStatus, ECommonUI, EGameType, ELevelType, ERoomKind } from "../../../common/base/UAllenum";
import UAudioManager from "../../../common/base/UAudioManager";
import VWindow from "../../../common/base/VWindow";
import { Game, GameFriendServer, HallFriendServer } from "../../../common/cmd/proto";
import UMsgCenter from "../../../common/net/UMsgCenter";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import UDebug from "../../../common/utility/UDebug";
import UEventHandler from "../../../common/utility/UEventHandler";
import UHandler from "../../../common/utility/UHandler";
import ULanHelper from "../../../common/utility/ULanHelper";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UStringHelper from "../../../common/utility/UStringHelper";
import cfg_friends from "../../../config/cfg_friends";
import AppGame from "../../base/AppGame";
import AppStatus from "../../base/AppStatus";
import MHall from "../lobby/MHall";
import MRole from "../lobby/MRole";
import { ZJH_SCALE } from "../lobby/VHall";
import MRoomModel from "../room_zjh/MRoomModel";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ui_enter_room extends VWindow {
    @property(cc.Label) cardLeb: cc.Label = null;

    private _btn_record: cc.Node;
    private _btn_create_record: cc.Node;
    private _room_label: cc.Label;
    private _btn_creat: cc.Node;

    init(): void {
        super.init();
        this._btn_create_record = UNodeHelper.find(this._root, "btn_create_record");
        this._btn_record = UNodeHelper.find(this._root, "btn_record");
        this._room_label = UNodeHelper.getComponent(this._root, "input_room_number/room_label", cc.Label);
        this._btn_creat = UNodeHelper.find(this._root, "btn_creat_room");

        UEventHandler.addClick(this._btn_record, this.node, "ui_enter_room", "iontoRecord");
        UEventHandler.addClick(this._btn_creat, this.node, "ui_enter_room", "intoCreat");
        UEventHandler.addClick(this._btn_create_record, this.node, "ui_enter_room", "showCreateRoomRecord");
    }

    show(data: any) {
        super.show(data);
        UDebug.log('show data => ', data)

        this.openAppEnterRoom();
        this.update_card(AppGame.ins.roleModel.getRoomCard());
    }

    /**房卡充值 */
    private onChargeRoomCard() {
        AppGame.ins.hallModel.requestAgentLevel(EAgentLevelReqType.enterRoom);
    }
    /**
     * @description  更新房卡
     * @param score 房卡数量
     */
    private update_card(score: number): void {
        this.cardLeb.string = UStringHelper.getMoneyFormat(score * ZJH_SCALE, -1, false, true, false).toString();
    }

    private onopencharge(event: any, index: number = 0): void {
        if (!AppGame.ins.roleModel.bindMobile) {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 3, data: ULanHelper.NO_BIND_PHONE, handler: UHandler.create((a) => {
                    if (a) {
                        // AppGame.ins.showUI(ECommonUI.LB_Charge,{});
                        AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true, index: index });
                    } else {
                        AppGame.ins.showUI(ECommonUI.LB_Regester);
                    }
                }, this)
            });

        } else {
            // AppGame.ins.showUI(ECommonUI.LB_Charge);
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true, index: index });
        }
        UAudioManager.ins.playSound("audio_click");
    }

    /**获取到代理等级 */
    onAgentLevelRes(data: any) {
        let tag = AppGame.ins.hallModel.reqAgentLevelType == EAgentLevelReqType.enterRoom;
        if (!data || data.retCode != 0 || !data.hasOwnProperty('level')) {
            tag && this.onopencharge(null, 3);
            return;
        }
        if (data.level < 5) {
            tag && this.onopencharge(null, 3);
        } else {
            tag && this.onopencharge(null, 2);
        }
    }
    onEnable() {
        AppGame.ins.roleModel.on(MRole.UPDATA_ROOM_CARD, this.update_card, this);
        AppGame.ins.hallModel.on(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);
    }

    onDisable() {
        this._room_label.string = "";
        AppGame.ins.roleModel.off(MRole.UPDATA_ROOM_CARD, this.update_card, this);
        AppGame.ins.hallModel.off(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);
    }

    /**拉起app进入房间的 */
    openAppEnterRoom() {
        UDebug.log('openAppEnterRoom => ', AppGame.ins.openFriendRoomId)
        if (AppGame.ins.openFriendRoomId) {
            AppGame.ins.roomModel.requestEnterRoomFriend(AppGame.ins.openFriendRoomId);
            AppGame.ins.openFriendRoomId = 0;
        }
    }

    private intoCharge(): void {
        this.playclick();
        AppGame.ins.showUI(ECommonUI.LB_Charge);
    }

    private iontoRecord(): void {
        this.playclick();
        AppGame.ins.showUI(ECommonUI.UI_APPONINTMENT_RECORD);
    }

    private showCreateRoomRecord() {
        this.playclick();
        AppGame.ins.showUI(ECommonUI.UI_CREATE_ROOM_RECORD);
    }

    private intoCreat(): void {
        this.playclick();
        if (AppGame.ins.roleModel.getIsTempAccount()) {
            AppGame.ins.showTips("非正式账号不能创建房间");
            AppGame.ins.showUI(ECommonUI.LB_RegesterPopu);
            return;
        }
        AppGame.ins.showUI(ECommonUI.UI_CREAT_ROOM);
    }

    private btnclick(event, CustomEventData): void {
        this.playclick();
        if (this._room_label.string.length < 5) {
            this._room_label.string = this._room_label.string + CustomEventData;
            if (this._room_label.string.length == 5) {
                AppGame.ins.roomModel.requestEnterRoomFriend(parseInt(this._room_label.string));
            }
        }
    }

    private resetNumber(): void {
        this._room_label.string = "";
    }

    private deleteNumber(): void {
        if (this._room_label.string.length > 0) {
            let a = this._room_label.string.length;
            this._room_label.string = this._room_label.string.substring(0, a - 1);
        }
    }

    onClickRule() {
        this.playclick();
        AppGame.ins.showUI(ECommonUI.ZJH_Help, { gameType: EGameType.KPQZNN, showFriend: true });
    }

    closeUI() {
        this.playclick();
        super.clickClose();
    }
}
