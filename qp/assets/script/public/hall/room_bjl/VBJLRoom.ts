import VZJHRoom from "../room_zjh/VZJHRoom";
import AppGame from "../../base/AppGame";
import { ECommonUI, EGameType } from "../../../common/base/UAllenum";
import UDebug from "../../../common/utility/UDebug";
import VBaseUI from "../../../common/base/VBaseUI";
import MRole from "../lobby/MRole";
import MBrbjl from "../../../game/bjl/model/MBrbjl";
import MBJLRoom from "./MBJLRoom";
import VWindow from "../../../common/base/VWindow";
import VBrbjlRoomItem from "../../../game/bjl/view/VBrbjlRoomItem";
import cfg_game from "../../../config/cfg_game";
import BrbjlSummaryData from "../../../game/bjl/BrbjlSummaryData";
import UStringHelper from "../../../common/utility/UStringHelper";
import UDDZHelper from "../../../game/ddz/ddz_Helper";
import { UZJHRoomItem } from "../../../common/base/UAllClass";
import VHallMusic from "../lobby/VHallMusic";
import ULanHelper from "../../../common/utility/ULanHelper";
import UHandler from "../../../common/utility/UHandler";
import UResManager from "../../../common/base/UResManager";
import AppStatus from "../../base/AppStatus";
export const ZJH_SCALE = 0.01;
export const roomArr = [9101, 9102, 9103, 9104];

const { ccclass, property } = cc._decorator;

@ccclass
export default class VBJLRoom extends VWindow {
    /**
     * 房间
     */
    public _rooms: { [key: number]: VBrbjlRoomItem };
    @property(cc.Node) bjlRoomItem: cc.Node = null;
    @property(cc.Node) scrollContent: cc.Node = null;
    @property(cc.Label)
    lbScore: cc.Label = null; // 金币
    public _gameType: EGameType;
    roomInfoArr: Array<UZJHRoomItem> = [];
    private _music: VHallMusic;
    /**
     * 点击关闭按钮 
    */
    protected clickClose(): void {
        this.playclick();
        this.closeAnimation(UHandler.create(() => {
            AppGame.ins.closeUI(this.uiType);
            UResManager.releaseBundle();
        }, this));

    }
    onEnable() {
        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.update_score, this);
        // this.regesterMsg(Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ACTIVITY_LIST_MESSAGE_RES, new UHandler(this.onActivityList, this));
    }

    onDisable() {
        AppGame.ins.brbjlRoomModel.sendUnregisterBJLSummaryMessage();
        AppGame.ins.roleModel.off(MRole.UPDATA_SCORE, this.update_score, this);
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.brbjlRoomModel.off(MBJLRoom.GET_BJL_SUMMARY_MESSAGE, this.onGetSummaryMessage, this);
        AppGame.ins.brbjlRoomModel.off(MBJLRoom.UPDATE_SUMMARY_MESSAGE, this.onUpdateSummaryMessage, this);
    }
    onLoad() {
        UDebug.log("onLoad");
    }

     /**
   * 游戏切换到后台
   * @param isHide 是否切在后台
   */
      onGameToBack(isBack: boolean) {
        if (!isBack) {
            AppGame.ins.brbjlRoomModel.sendGetBjlSummaryMessage();
        }
    }

    show(data: any): void {
        AppGame.ins.brbjlRoomModel.on(MBJLRoom.GET_BJL_SUMMARY_MESSAGE, this.onGetSummaryMessage, this);
        AppGame.ins.brbjlRoomModel.on(MBJLRoom.UPDATE_SUMMARY_MESSAGE, this.onUpdateSummaryMessage, this);
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.brbjlRoomModel.sendGetBjlSummaryMessage();
        super.show(data);
        this._gameType = data;
        this.roomInfoArr = AppGame.ins.roomModel.getRoomListInfo(this._gameType);
        let dt = AppGame.ins.roomModel.getRoomListInfo(this._gameType);
        this.scrollContent.removeAllChildren();
        for (const key in cfg_game[EGameType.BJL].rooms) {
            let item = cc.instantiate(this.bjlRoomItem);
            let j = dt.findIndex(item => item.type == parseInt(key));
            // UDebug.log("dt ["+j+"]-----"+JSON.stringify(dt[j]));
            item.getComponent("VBrbjlRoomItem").configRoomTitleLimitScore(parseInt(key), j != -1 ? dt[j] : null, this);
            item.active = true;
            this.scrollContent.addChild(item);
        }
        //显示金币
        let role = AppGame.ins.roleModel.getRoleShowInfo();
        let gold = role.gold
        this.update_score(gold)
    }

    init() {
        super.init();
        this._music = new VHallMusic();
    }

    onSetting(): void {
        AppGame.ins.showUI(ECommonUI.LB_Setting);
        this._music.playclick();
    }

    openhelp(): void {
        this.playclick();
        AppGame.ins.showUI(ECommonUI.ZJH_Help, { gameType: this._gameType });
    }

    onopencharge(): void {
        if (!AppGame.ins.roleModel.bindMobile) {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 3, data: ULanHelper.NO_BIND_PHONE, handler: UHandler.create((a) => {
                    if (a) {
                        // AppGame.ins.showUI(ECommonUI.LB_Charge);
                        AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true });
                    } else {
                        AppGame.ins.showUI(ECommonUI.LB_Regester);
                    }
                }, this)
            });

        } else {
            // AppGame.ins.showUI(ECommonUI.LB_Charge);
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true });
        }
        this._music.playclick();
    }

    // 进入游戏
    enterGame(roomType: number) {
        AppGame.ins.roomModel.requestEnterRoom(roomType, this._gameType);
        this.playclick();
    }

    private update_score(gold: number): void {
        this.lbScore.string = UStringHelper.getMoneyFormat(gold * ZJH_SCALE, -1, false, true).toString();
    }

    // 获取所有路单信息监听
    onGetSummaryMessage(data: Array<BrbjlSummaryData>) {
        cc.warn(JSON.stringify(data));
        if (data && data.length > 0) {
            for (let k = 0; k < data.length; k++) {
                let itemData = data[k];
                for (let index = 0; index < 4; index++) {
                    let item = this.scrollContent.children[index];
                    if (roomArr[index] == itemData.roomId) {
                        item.getComponent("VBrbjlRoomItem").initRoomItemData(itemData, null, true, this);
                        break;
                    }
                }
            }
        }
    }

    // 更新单一的路单
    onUpdateSummaryMessage(data: BrbjlSummaryData, index: number = 0) {
        for (let index = 0; index < this.scrollContent.childrenCount; index++) {
            const element = this.scrollContent.children[index];
            if (element.getComponent('VBrbjlRoomItem').bjlSummaryData && data.roomId == element.getComponent('VBrbjlRoomItem').bjlSummaryData.roomId) {
                let j = this.roomInfoArr.findIndex(item => item.type == data.roomId);
                element.getComponent('VBrbjlRoomItem').initRoomItemData(data, j != -1 ? this.roomInfoArr[j] : null, false, this);
            }
        }
    }
}
