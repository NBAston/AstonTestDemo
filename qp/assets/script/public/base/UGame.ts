import UScene from "../../common/base/UScene";
import AppGame from "./AppGame";
import MRoomModel from "../hall/room_zjh/MRoomModel";
import AppStatus from "./AppStatus";
import { EEnterRoomErrCode, ECommonUI, ELevelType, EGameType, ERoomKind } from "../../common/base/UAllenum";
import ULanHelper from "../../common/utility/ULanHelper";
import UHandler from "../../common/utility/UHandler";
import UDebug from "../../common/utility/UDebug";
import MHall, { NEWS } from "../hall/lobby/MHall";
import UStringHelper from "../../common/utility/UStringHelper";
import { ZJH_SCALE } from "../../game/zjh/MZJH";
import MBaseGameModel from "../hall/MBaseGameModel";
import UNodeHelper from "../../common/utility/UNodeHelper";

const { ccclass, property } = cc._decorator;
/**
 * 游戏基类
 * 目前只处理了 错误码
 */
@ccclass
export default abstract class UGame extends UScene {

    private _scrollMsgNode: cc.Node = null;
    private _gameId: number = 0;
    private _horseLampTimer: any = null;

    @property(cc.Prefab)
    scrollMsgNode: cc.Prefab = null;

    protected onEnable(): void {
        AppGame.ins.roomModel.on(MRoomModel.SC_ENTER_ROOM_FAIL, this.enter_room_fail, this);
        AppGame.ins.roomModel.on(MRoomModel.SC_GET_GAMESERVER_FAIL, this.get_gameserver_fail, this);
        AppGame.ins.appStatus.on(AppStatus.RECONNECT_IN_GAME_BUT_NO_IN_GAMING, this.reconnect_in_game_but_no_in_gaming, this);
    }

    protected onDisable(): void {
        AppGame.ins.roomModel.off(MRoomModel.SC_ENTER_ROOM_FAIL, this.enter_room_fail, this);
        AppGame.ins.roomModel.off(MRoomModel.SC_GET_GAMESERVER_FAIL, this.get_gameserver_fail, this);
        AppGame.ins.appStatus.off(AppStatus.RECONNECT_IN_GAME_BUT_NO_IN_GAMING, this.reconnect_in_game_but_no_in_gaming, this);

        if (this._horseLampTimer) {
            clearInterval(this._horseLampTimer);
        }
    }

    protected enter_room_fail(errorCode: number, errMsg?: string): void {
        let msg = errMsg
        if (!msg) {
            msg = ULanHelper.GAME_INFO_ERRO;
        }
        AppGame.ins.closeUI(ECommonUI.UI_GAME_MIPAI);
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 1, data: msg, handler: UHandler.create(() => {
                AppGame.ins.loadLevel(ELevelType.Hall, this._gameId);
            }, this)
        });
    }

    //直接显示服务器返回的失败原因
    protected get_gameserver_fail(data: any): void {
        UDebug.Log("获得游戏服务器失败" + data);
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 1, data: data.errorMsg, handler: UHandler.create((() => {
                AppGame.ins.loadLevel(ELevelType.Hall);
            }))
        });
    }
    protected reconnect_in_game_but_no_in_gaming(): void {

    }
    protected defaultRequestEnterRoom(): void {
        AppGame.ins.roomModel.requestMatch();
    }

    protected requestGameServer(data: any) {
        if (data && data.roomData) {
            UDebug.Log("roomKind => " + data.roomData.roomKind);
            switch (data.roomData.roomKind) {
                case ERoomKind.Normal:
                    this.defaultRequestEnterRoom();
                    break;
                case ERoomKind.Club:
                    AppGame.ins.roomModel.requestClubGameServer(true);
                    break;
                case ERoomKind.Friend:
                    AppGame.ins.gamebaseModel._friendRoomId = data.roomData.roomId;
                    break;
                default:
                    break;
            }
        }
    }

    openScene(data: any): void {
        if (data && data.roomData) {
            AppGame.ins.currRoomKind = data.roomData.roomKind;
            AppGame.ins.currGameId = data.roomData.gameId;
            this._gameId = data.roomData.gameId;
        }

        this.initHorseLamp();

        super.openScene(data);
        this.requestGameServer(data);

        this.scheduleOnce(() => {
            UDebug.Log("---------------收垃圾-------------------")
            cc.sys.garbageCollect();
        }, 5.0)

    }

    /*初始化跑马灯 */
    private initHorseLamp() {
        if (this.scrollMsgNode) {
            this._scrollMsgNode = cc.instantiate(this.scrollMsgNode);
            this._scrollMsgNode.parent = this.node;
        }

        if (!this._scrollMsgNode) return;

        this._horseLampTimer = setInterval(() => {
            if (NEWS.length > 0 && this._scrollMsgNode && this._scrollMsgNode.getComponent("VscrollMsg")) {
                this._scrollMsgNode.getComponent("VscrollMsg").label.string = NEWS[0];
                this._scrollMsgNode.active = true;
            }
        }, 1000)
    }

    /**设置跑马灯x, y位置 */
    setHorseLampPos(x: number, y: number) {
        if (this._scrollMsgNode) {
            this._scrollMsgNode.x = x;
            this._scrollMsgNode.y = y;
        }
    }
}
