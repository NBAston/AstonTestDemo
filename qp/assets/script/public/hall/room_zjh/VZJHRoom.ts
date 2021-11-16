import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import VZJHRoomItem from "./VZJHRoomItem";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame";
import { ECommonUI, EGameType, EAppStatus, ELoginType, ELevelType, EUIPos } from "../../../common/base/UAllenum";
import VHallMusic from "../lobby/VHallMusic";
import UStringHelper from "../../../common/utility/UStringHelper";
import { ZJH_SCALE } from "../../../game/zjh/MZJH";
import ULanHelper from "../../../common/utility/ULanHelper";
import MRole from "../lobby/MRole";
import cfg_game from "../../../config/cfg_game";
import UResManager from "../../../common/base/UResManager";

const { ccclass, property } = cc._decorator;

/**
 * 创建:sq
 * 作用:zjh房间控制
 */
@ccclass
export default class VZJHRoom extends VBaseUI {
    /**
     * 房间
     */
    public _rooms: { [key: number]: VZJHRoomItem };
    protected _init: boolean; 
    public _gameType: EGameType;
    private _roomCount: number;
    private _btnSetting: cc.Node;
    private _lbScore: cc.Label;
    private _btnGold: cc.Node;
    private _music: VHallMusic;

    onLoad() {
        cc.game.on("resize_bg", this.resize_bg, this);
    }

    onEnable() {
        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.update_score, this);
    }

    onDisable() {
        AppGame.ins.roleModel.off(MRole.UPDATA_SCORE, this.update_score, this);
    }

    protected openhelp(): void {
        this.playclick();
        AppGame.ins.showUI(ECommonUI.ZJH_Help, {gameType: this._gameType});
    }
    protected openrecord(): void {
        this.playclick();
        AppGame.ins.showUI(ECommonUI.LB_Record, this._gameType);
    }
    private openreturn(): void {
        this.playclick();
        AppGame.ins.closeUI(this.uiType);
        if (this._gameType === EGameType.ZJH) return;
        //从t大厅场景时，清理Bundle资源
        let bundleName = cfg_game[this._gameType].bundleName;
        UResManager.releaseBundle();
    }
    private onClick(caller: number): void {
        AppGame.ins.roomModel.requestEnterRoom(caller, this._gameType);
        this.playclick();
    }
    /**
      * 初始化 UI创建的时候调用
      */
    init(): void {
        if (this._init) return;
        this._music = new VHallMusic();
        super.init();
        this._btnSetting = UNodeHelper.find(this.node, "game_room/right_top/btn_setting");
        this._lbScore = UNodeHelper.getComponent(this.node, "game_room/let_top/gold_bg/lb_score", cc.Label)
        this._btnGold = UNodeHelper.find(this.node, "game_room/let_top/gold_bg")
        let btn_charge_plus = UNodeHelper.find(this.node, "game_room/let_top/btn_charge_plus");


        let role = AppGame.ins.roleModel.getRoleShowInfo();
        let gold = role.gold
        this.update_score(gold )

    
        UEventHandler.addClick(this._btnSetting, this.node, "VZJHRoom", "onSetting");
        // UEventHandler.addClick(this._btnGold, this.node, "VZJHRoom", "onopencharge");
        UEventHandler.addClick(btn_charge_plus, this.node, "VZJHRoom", "onopencharge");
        this._init = true;
        this._rooms = {};
        let room = UNodeHelper.find(this.node, "game_room/room");
        let len = room.childrenCount;
        this._roomCount = len;
        for (let i = 0; i < len; i++) {
            let element = room.children[i];
            let nm = element.name.split("_");
            let item = element.getComponent(VZJHRoomItem);
            item.init();
            item.room=this;
            item.onClickHandler = new UHandler(this.onClick, this);
            this._rooms[parseInt(nm[1])] = item;
        }
        var returnBtn = UNodeHelper.find(this.node, "game_room/let_top/room_name/btn_back");
        var helpBtn = UNodeHelper.find(this.node, "game_room/game_name/btn_help");
        UEventHandler.addClick(returnBtn, this.node, "VZJHRoom", "openreturn");
        UEventHandler.addClick(helpBtn, this.node, "VZJHRoom", "openhelp");
        this.node.zIndex = 100;
    }
    /**
     *  隐藏
     */
    hide(handler?: UHandler): void {
        this.node.active = false;
    }
    /**
     * 显示
     */
    show(data: any): void {
        AppGame.ins.appStatus.status = EAppStatus.Room;
        this.node.active = true;
        this._gameType = data;
        let dt = AppGame.ins.roomModel.getRoomListInfo(this._gameType);
        let len = dt.length;
        let idx = 0;
        for (const key in this._rooms) {
            if (this._rooms.hasOwnProperty(key)) {
                const element = this._rooms[key];
                if (idx < len) {
                    element.bind(dt[idx]);
                } else {
                    element.bind(null);
                }
                idx++;
            }
        }

        //显示金币
        let role = AppGame.ins.roleModel.getRoleShowInfo();
        let gold = role.gold
        this.update_score(gold )
        
    }
    onDestroy() {
        this._rooms = null;
        cc.game.off("resize_bg", this.resize_bg, this);
    }

    onSetting() :void {
        AppGame.ins.showUI(ECommonUI.LB_Setting);
        this._music.playclick();
    }

    private update_score(gold: number): void {
        this._lbScore.string = UStringHelper.getMoneyFormat(gold * ZJH_SCALE, -1,false,true).toString();
    }
    private onopencharge(): void {
        if (!AppGame.ins.roleModel.bindMobile) {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 3, data: ULanHelper.NO_BIND_PHONE, handler: UHandler.create((a) => {
                    if (a) {
                        // AppGame.ins.showUI(ECommonUI.LB_Charge);
                        AppGame.ins.showUI(ECommonUI.LB_Charge,{isFullScreen: true});
                    } else {
                        AppGame.ins.showUI(ECommonUI.LB_Regester);
                    }
                }, this)
            });

        } else {
            // AppGame.ins.showUI(ECommonUI.LB_Charge);
            AppGame.ins.showUI(ECommonUI.LB_Charge,{isFullScreen: true});
        }
        this._music.playclick();
    }

    resize_bg() {
        let bg = UNodeHelper.find(this.node, "hall_bg")
        bg.getComponent(cc.Widget).isAlignLeft = true;
        bg.getComponent(cc.Widget).isAlignHorizontalCenter = false;
        bg.getComponent(cc.Widget).left = 0;
        bg.getComponent(cc.Widget).updateAlignment();
    }
}
