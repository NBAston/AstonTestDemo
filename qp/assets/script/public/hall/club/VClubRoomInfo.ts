import VWindow from "../../../common/base/VWindow";
import AppGame from "../../base/AppGame";
import { ECommonUI, EGameType, EIconType, ERoomKind } from "../../../common/base/UAllenum";
import UDebug from "../../../common/utility/UDebug";
import cfg_game from "../../../config/cfg_game";
import UResManager from "../../../common/base/UResManager";
import ULanHelper from "../../../common/utility/ULanHelper";
import UAudioManager from "../../../common/base/UAudioManager";
import CarryingAmount from "../../../game/common/CarryingAmount";

const { ccclass, property } = cc._decorator;

//俱乐部 - 房间信息
@ccclass
export default class VClubRoomInfo extends VWindow {

    @property(cc.Node) gameIcon: cc.Node = null;
    @property(cc.Node) content: cc.Node = null;
    @property(cc.Node) labCantainer: cc.Node = null;
    @property(cc.Node) meitouxiang: cc.Node = null;
    @property(cc.Node) item: cc.Node = null;
    @property(cc.Node) cantainer: cc.Node = null;
    @property(cc.Node) zhd: cc.Node = null;
    @property(cc.Node) yhd: cc.Node = null;

    @property(cc.Node) lab1: cc.Node = null;
    @property(cc.Node) lab2: cc.Node = null;
    @property(cc.Node) lab3: cc.Node = null;
    @property(cc.Node) lab4: cc.Node = null;
    @property(cc.Node) lab5: cc.Node = null;
    @property(cc.Node) lab6: cc.Node = null;
    @property(cc.Node) lab7: cc.Node = null;
    @property(cc.Node) lab8: cc.Node = null;
    @property(cc.Node) lab9: cc.Node = null;
    @property(cc.Node) lab10: cc.Node = null;

    @property(cc.Node) lab1_1: cc.Node = null;
    @property(cc.Node) lab2_1: cc.Node = null;
    @property(cc.Node) lab3_1: cc.Node = null;
    @property(cc.Node) lab4_1: cc.Node = null;
    @property(cc.Node) lab5_1: cc.Node = null;
    @property(cc.Node) lab6_1: cc.Node = null;
    @property(cc.Node) lab7_1: cc.Node = null;
    @property(cc.Node) lab8_1: cc.Node = null;
    @property(cc.Node) lab9_1: cc.Node = null;
    @property(cc.Node) lab10_1: cc.Node = null;

    private _gameInfo = null;
    private _clubRoomInfo = null;
    private _gameRoomInfo = null;
    private _tableInfo = null;
    private _tableId = -1;
    private isHaveMain = false;
    private _clubId = -1;
    public static _clubRoomInfoTest = null;

    roomList: number[] = [
        4201, 4202, 4203, 4204,
        4501, 4502, 4503, 4504];

    /**
     * 初始化 UI创建的时候调用
     */
    init(): void {
        super.init();
    }

    onDisable() {
        window["isOpenWechat"] = false;
    }

    /***
     * 邀请初始化
     * **/
    show(data: any): void {
        super.show(data);
        //初始化 头像信息
        //赋值lab信息
        UDebug.log('show data => ', data)
        this._tableId = data.info.tableId;
        this._clubId = data.info.clubId;
        this._gameInfo = data.gameInfo ? data.gameInfo : data.info.gameInfo;
        this._clubRoomInfo = data.clubRoomInfo ? data.clubRoomInfo : data.info.clubRoomInfo;
        VClubRoomInfo._clubRoomInfoTest = this._clubRoomInfo;
        this._gameRoomInfo = data.gameRoomInfo ? data.gameRoomInfo : data.info.gameRoomInfo;
        this._tableInfo = data.tableInfo ? data.tableInfo : data.info.tableInfo;
        let cfg = cfg_game[this._clubRoomInfo.gameId];
        this.lab1_1.getComponent(cc.Label).string = cfg.gameName;//名字
        if (this._tableInfo == null) {
            this.lab2_1.getComponent(cc.Label).string = `0`;
        } else {
            this.lab2_1.getComponent(cc.Label).string = `${this._tableInfo.userInfo ? this._tableInfo.userInfo.length : 0}`;
        }
        if (data.info.isQuick) {
            this.lab2_1.getComponent(cc.Label).string = `-`;
        }
        this.lab2_1.active = true;
        this.lab2.active = true;
        this.isHaveMain = false;
        if (this._gameRoomInfo.enterMaxScore != null && this._gameRoomInfo.gameId == 420) {
            let end = this._gameRoomInfo.enterMaxScore == -1 ? "以上" : '-' + this._gameRoomInfo.enterMaxScore / 100;
            this.lab3_1.getComponent(cc.Label).string = `${this._gameRoomInfo.enterMinScore == -1 ? "无限制" : this._gameRoomInfo.enterMinScore / 100 + end}`;//准入
        } else {
            this.lab3_1.getComponent(cc.Label).string = `${this._gameRoomInfo.enterMinScore == -1 ? "无限制" : this._gameRoomInfo.enterMinScore / 100}`;//准入
        }
        this.lab4_1.getComponent(cc.Label).string = `${this._gameRoomInfo.floorScore / 100}`;//牌桌底注
        this.lab5.active = this._clubRoomInfo.gameId == EGameType.ZJH;
        this.lab6.active = this._clubRoomInfo.gameId == EGameType.ZJH;
        if (this.lab5.active) this.lab5_1.getComponent(cc.Label).string = `${data.info.zjhMenpaiLunshu}`;//闷牌轮数
        if (this.lab6.active) this.lab6_1.getComponent(cc.Label).string = `${20}`;//比牌轮数
        if (this._tableInfo && this._tableInfo.userInfo != null && this._tableInfo.userInfo.length > 0) {
            this.cantainer.destroyAllChildren();
            this.cantainer.width = 0;
            for (let i = 0; i < this._tableInfo.userInfo.length; i++) {
                let itemData = this._tableInfo.userInfo[i];
                if (Number(itemData.userId) == Number(AppGame.ins.roleModel.useId)) {
                    this.isHaveMain = true;
                }
                let itemUi = this.creatItem(itemData);
                this.cantainer.width += itemUi.width + 14;
                this.cantainer.addChild(itemUi);
            }
            if (this._tableInfo.userInfo.length == 1) {
                this.cantainer.width = 600;
            }
            this.meitouxiang.active = false;
        } else {
            this.meitouxiang.active = true;
        }
        if (cfg.doubleRule) {
            this.lab7.active = true;
            this.lab7_1.getComponent(cc.Label).string = `${cfg.doubleRule}`;
        } else {
            this.lab7.active = false;
        }
        if (cfg.specialRules) {
            this.lab8.active = true;
            this.lab8_1.getComponent(cc.Label).string = `${cfg.specialRules}`;
        } else {
            this.lab8.active = false;
        }
        if (cfg.specialCardType) {
            this.lab9.active = true;
            this.lab9_1.getComponent(cc.Label).string = `${cfg.specialCardType}`;
        } else {
            this.lab9.active = false;
        }
        if (cfg.multiplierCardType) {
            this.lab10.active = true;
            this.lab10_1.getComponent(cc.Label).string = `${cfg.multiplierCardType}`;
        } else {
            this.lab10.active = false;
        }
    }
    //创建头像
    creatItem(itemData) {
        let itemUi = cc.instantiate(this.item);
        itemUi.active = true;
        itemUi.getChildByName("nickLab").getComponent(cc.Label).string = `${itemData ? itemData.nickName : ""}`;//用户昵称
        itemUi.getChildByName("zjtxk").active = itemData != null && itemData.userId == this._tableInfo.curBankerUserId;//如果是庄家
        let headIcon = itemUi.getChildByName("head").getComponent(cc.Sprite);//用户头像
        let headBoxIcon = itemUi.getChildByName("txk").getComponent(cc.Sprite);//用户头像框
        if (itemData != null) {
            UResManager.load(itemData.headerId, EIconType.Head, headIcon, itemData.headImgUrl);
            UResManager.load(itemData.headboxId, EIconType.Frame, headBoxIcon);
        }
        return itemUi;
    }
    //上一个
    last() {

    }
    //下一个
    next() {

    }
    //进入游戏
    enterGame() {
        UAudioManager.ins.playSound("audio_click");
        if (this.roomList.indexOf(this._gameRoomInfo.roomId) != -1) {
            if (!this.isHaveMain && this._tableInfo && this._tableInfo.userInfo.length >= this._gameRoomInfo.maxPlayerNum) {
                AppGame.ins.showTips("房间人数已满");
                return;
            }
            this.Carrying();
        }
        else {
            if (this._gameRoomInfo.enterMaxScore != -1) {
                let tempGold = AppGame.ins.roleModel.getRoleShowInfo().gold;
                if (tempGold < this._gameRoomInfo.enterMinScore) {//金币不足
                    AppGame.ins.showTips(ULanHelper.ENTERROOM_ERROR[7]);
                    return;
                }
                else if (tempGold > this._gameRoomInfo.enterMaxScore) {//金币过多
                    AppGame.ins.showTips(ULanHelper.ENTERROOM_ERROR[8]);
                    return;
                }
            }

            if (!this.isHaveMain && this._tableInfo && this._tableInfo.userInfo.length >= this._gameRoomInfo.maxPlayerNum) {
                AppGame.ins.showTips("房间人数已满");
                return;
            }
            UDebug.log('进入游戏 _clubRoomInfo => ', this._clubRoomInfo)
            let tableId = this._tableInfo ? this._tableInfo.tableId : this._tableId;
            VClubRoomInfo._clubRoomInfoTest["tableId"] = tableId;
            VClubRoomInfo._clubRoomInfoTest["clubId"] = this._clubId;
            AppGame.ins.roomModel.requestEnterRoom(this._clubRoomInfo.roomId, this._clubRoomInfo.gameId, false, ERoomKind.Club, this._clubId, tableId);
        }
    }

    //俱乐部梭哈、德州
    Carrying() {
        if (AppGame.ins.roleModel.score >= this._gameRoomInfo.enterMinScore) {
            CarryingAmount.roomData.gameId = this._gameRoomInfo.gameId;
            CarryingAmount.roomData.type = this._gameRoomInfo.roomId;
            CarryingAmount.roomData.minScore = this._gameRoomInfo.enterMinScore;
            CarryingAmount.roomData.maxScore = this._gameRoomInfo.enterMaxScore;
            CarryingAmount.roomData.clubId = this._clubRoomInfo.clubId;
            let tableId = this._tableInfo ? this._tableInfo.tableId : this._tableId;
            CarryingAmount.roomData.tableId = tableId;
            AppGame.ins.showUI(ECommonUI.UI_CARRYING, 2);
        }
        else {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, { type: 1, data: ULanHelper.PLAYER_FENSHU_BUZU });
        }
    }

    closeUI() {
        AppGame.ins.closeUI(ECommonUI.CLUB_ROOMINFO);
    }
    /**
     *  隐藏
     */
    hide(): void {
        this.node.active = false;
    }
}
