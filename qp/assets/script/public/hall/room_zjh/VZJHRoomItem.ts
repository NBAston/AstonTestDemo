import UHandler from "../../../common/utility/UHandler";
import { UZJHRoomItem } from "../../../common/base/UAllClass";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import UButton from "../../../common/utility/UButton";
import UDebug from "../../../common/utility/UDebug";
import AppGame from "../../base/AppGame";
import { ECommonUI, EGameType, ELevelType } from "../../../common/base/UAllenum";
import VZJHRoom from "./VZJHRoom";
import CarryingAmount from "../../../game/common/CarryingAmount";
import ULanHelper from "../../../common/utility/ULanHelper";

const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 作用:房间item
 */
@ccclass
export default class VZJHRoomItem extends cc.Component {
    /**
     * 点击事件
     */
    onClickHandler: UHandler;
    public room: VZJHRoom;
    protected _data: UZJHRoomItem;
    private _icon: cc.Sprite;
    private _lock: cc.Sprite;
    private _lbBaseScore: cc.Label;
    private _lbEnterScore: cc.Label;
    //需要限高的房间
    roomList: number[] = [
        4201, 4202, 4203, 4204,
        4501, 4502, 4503, 4504];

    private onClick(): void {
        if (this._data && this.onClickHandler) {
            if (this.roomList.indexOf(this._data.type) != -1) {//携带金额
                if(AppGame.ins.roleModel.score>=this._data.minScore){
                    CarryingAmount.onClickHandler = this.onClickHandler;
                    CarryingAmount.roomData.gameId = this.room._gameType;
                    CarryingAmount.roomData.type = this._data.type;
                    CarryingAmount.roomData.minScore = this._data.minScore;
                    CarryingAmount.roomData.maxScore = this._data.maxScore;
                    AppGame.ins.showUI(ECommonUI.UI_CARRYING, 0);
                }
                else{
                    AppGame.ins.showUI(ECommonUI.NewMsgBox, { type: 1, data: ULanHelper.PLAYER_FENSHU_BUZU });
                }
            }
            else {
                this.onClickHandler.runWith(this._data.type);
            }
        }
    }

    //推荐进入房间功能不用了
    roomSkip() {
        let tempGold = AppGame.ins.roleModel.getRoleShowInfo().gold;
        let isBool = tempGold >= this._data.minScore && tempGold <= this._data.maxScore;
        let isMay = tempGold >= this._data.minScore && this._data.maxScore <= 0;
        if (isBool || isMay) {
            this.onClickHandler.runWith(this._data.type);
        }
        else {
            let roomList: VZJHRoomItem[] = [];
            //查找一下是否有房间不限制上限金额
            for (const key in this.room._rooms) {
                const element = this.room._rooms[key];
                let elementBool = tempGold >= element._data.minScore && tempGold <= element._data.maxScore;
                let elementMay = tempGold >= element._data.minScore && element._data.maxScore <= 0;
                if (elementBool || elementMay) {
                    roomList.push(element);
                }
            }

            if (roomList.length > 0) {//当多个房间同时满足条件时，选择可进入的最大房间
                this.recommendRoom(roomList[roomList.length - 1]._data.type);
            }
            else {
                //当一个房间都不满足的时候，并且大于最大房间的金币
                if (tempGold > this.room._rooms[8204]._data.maxScore && this.room._rooms[8204]._data.maxScore > 0) {
                    AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                        type: 1, data: "您身上携带的金币过多，请存入保险箱再次进入!", handler: UHandler.create(() => { }, this)
                    });
                }
                else {
                    this.onClickHandler.runWith(this._data.type);
                }
            }
        }
    }

    //推荐房间
    recommendRoom(tempRoom: number) {
        let tempStr = "官甲场";
        switch (tempRoom) {
            case this.room._rooms[8201]._data.type:
                tempStr = "体验场";
                break;
            case this.room._rooms[8202]._data.type:
                tempStr = "平民场";
                break;
            case this.room._rooms[8203]._data.type:
                tempStr = "贵族场";
                break;
            case this.room._rooms[8204]._data.type:
                tempStr = "官甲场";
                break;
        }

        let str = "您的金币不符合本场次，推荐您去" + tempStr + "游玩";
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 3, data: str, handler: UHandler.create((a) => {
                if (a) {
                    AppGame.ins.roomModel.requestEnterRoom(tempRoom, this.room._gameType, false, AppGame.ins.currRoomKind, AppGame.ins.currClubId, AppGame.ins.currClubTableId);
                }
            }, this)
        });
    }

    // update (dt) {}
    init(): void {
        this._icon = UNodeHelper.getComponent(this.node, "icon", cc.Sprite);
        this._lock = UNodeHelper.getComponent(this.node, "lock", cc.Sprite);
        this._lbBaseScore = UNodeHelper.getComponent(this.node, "base_score", cc.Label)
        this._lbEnterScore = UNodeHelper.getComponent(this.node, "enter_score", cc.Label)
        let btn = this.node.getComponent(UButton);
        if (!btn)
            UEventHandler.addClick(this.node, this.node, "VZJHRoomItem", "onClick");
        else {
            btn.addClickCall(new UHandler(this.onClick, this));
        }


    }
    /**
     * 绑定数据
     * @param data 
     */
    bind(data: UZJHRoomItem): void {
        if (data) {
            this._data = data;
            if (data.type >= 4501 && data.type <= 4504) {//德州盲注
                let tempNum = this._data.dizu / 100;
                this._lbBaseScore.string = (tempNum * 0.5).toString() + "/" + tempNum.toString();
            }
            else {
                this._lbBaseScore.string = (this._data.dizu / 100).toString();
            }
            this._lbEnterScore.string = (this._data.zhunru / 100).toString() + '以上准入'
            // if (this.roomList.indexOf(data.type) != -1) {//是否加入限高名单
            //     if (data.maxScore <= 0) {
            //         this._lbEnterScore.string = (data.minScore / 100) + "以上";
            //     }
            //     else {
            //         this._lbEnterScore.string = (data.minScore / 100) + "-" + (data.maxScore / 100);
            //     }
            // }
            // else {
            //     this._lbEnterScore.string = (this._data.zhunru / 100).toString() + '以上准入'
            // }
            //非正常开发的房间
            if (this._data.status != 1) {
                //房间背景置灰
                this._icon.setMaterial(0, cc.Material.createWithBuiltin("2d-gray-sprite", 0));
                this._lock.node.active = true
            }
            else this._lock.node.active = false
        }

    }
    onDestroy() {
        this._data = null;
        if (this.onClickHandler) {
            this.onClickHandler.clear();
            this.onClickHandler = null;
        }

    }
}
