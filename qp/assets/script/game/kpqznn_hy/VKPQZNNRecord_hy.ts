import { ECommonUI, EMsgType } from "../../common/base/UAllenum";
import VWindow from "../../common/base/VWindow";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import UClock from "../../common/utility/UClock";
import UDateHelper from "../../common/utility/UDateHelper";
import UDebug from "../../common/utility/UDebug";
import UHandler from "../../common/utility/UHandler";
import AppGame from "../../public/base/AppGame";
import MRoomModel from "../../public/hall/room_zjh/MRoomModel";
import MKPQZNNModel_hy from "./model/MKPQZNNModel_hy";
import UKPQZNNHelper_hy from "./UKPQZNNHelper_hy";
import UKPQZNNScene_hy from "./UKPQZNNScene_hy";
import VKPQZNNRecordItem_hy from "./VKPQZNNRecordItem_hy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VKPQZNNRecord_hy extends VWindow {

    @property(cc.Prefab) itemPfb: cc.Prefab = null;

    @property(cc.Node) content: cc.Node = null;

    @property(cc.Label) dateLbl: cc.Label = null;     //日期

    @property(cc.Label) roundLbl: cc.Label = null;    //对局

    @property(cc.Label) leftTimeLbl: cc.Label = null;    //剩余时长

    @property(cc.Node) againNode: cc.Node = null;    //再来一局

    @property(cc.Node) leaveNode: cc.Node = null;    //离开房间

    @property(cc.Label) leaveTimeLbl: cc.Label = null;    //离开房间时间

    @property(cc.Node) noDataNode: cc.Node = null;    //暂无数据


    private _timeCount: number = -1;
    private _leaveTime: number = -1;

    onEnable() {
        AppGame.ins.roomModel.on(MRoomModel.CLIENT_RECORD_FRIEND, this.onRecordData, this);
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_HOST_AGAIN, this.onHostPlayAgain, this);

        if (MKPQZNNModel_hy.ins.roomInfoHy) {
            AppGame.ins.roomModel.requestRecord(MKPQZNNModel_hy.ins.roomInfoHy.userGameKindId);
        }
        this._timeCount = 0;
        this.content.removeAllChildren();
        this.dateLbl.string = UDateHelper.format(new Date(), "yyyy-MM-dd hh:mm:ss");
        this.setRoundOrTime();

        if (!MKPQZNNModel_hy.ins.isSelfAgain) {
            if (MKPQZNNModel_hy.ins.roomInfoHy.roomUserId == AppGame.ins.roleModel.useId) {
                this.showLeaveAndAgain(true, true);
            } else {
                this.showLeaveAndAgain(true, false);
                if (MKPQZNNModel_hy.ins.isHostAgain) {
                    this.showLeaveAndAgain(true, true);
                }
            }
        }
        AppGame.ins.closeUI(ECommonUI.UI_GAME_PROP)
    }

    onDisable() {
        AppGame.ins.roomModel.off(MRoomModel.CLIENT_RECORD_FRIEND, this.onRecordData, this);
        this._timeCount = -1;
        this.showLeaveAndAgain(false, false);
    }

    show(data: any) {
        super.show(data);
        UDebug.log('show data=>', data);
    }

    /**房主再来一轮 */
    onHostPlayAgain(data: any) {
        if (!MKPQZNNModel_hy.ins.isSelfAgain) {
            this.showLeaveAndAgain(true, true);
        }
    }

    /**显示离开和再来一轮 */
    showLeaveAndAgain(showLeave: boolean, showAgain: boolean) {
        this.leaveNode.active = showLeave;
        this.againNode.active = showAgain;
    }

    /**设置局数或者时间 */
    setRoundOrTime() {
        let roomInfoHy = MKPQZNNModel_hy.ins.roomInfoHy;
        if (!roomInfoHy) return;
        if (MKPQZNNModel_hy.ins.roomType == 1) {
            let roundNow = roomInfoHy.currentRound < 0 ? 0 : roomInfoHy.currentRound;
            this.roundLbl.string = roundNow + '/' + roomInfoHy.allRound;;
            this.roundLbl.node.parent.opacity = 255;
            this.leftTimeLbl.node.parent.opacity = 0;
        } else if (MKPQZNNModel_hy.ins.roomType == 2) {
            let leftSeconds = roomInfoHy.leftSeconds;
            if (MKPQZNNModel_hy.ins.isHostAgain) {
                leftSeconds = leftSeconds < 0 ? roomInfoHy.allSeconds : leftSeconds;
            } else {
                leftSeconds = 0;
            }
            this.leftTimeLbl.string = UDateHelper.secondsToTime(leftSeconds);
            this.roundLbl.node.parent.opacity = 0;
            this.leftTimeLbl.node.parent.opacity = 255;
        }
    }

    /**实时战绩返回数据 */
    onRecordData(data: any) {
        let list = data.friendGameRecords;
        list.sort(this.compare('score'));
        for (let i = 0; i < list.length; i++) {
            let item = cc.instantiate(this.itemPfb);
            let isWinner = i == 0 ? true : false;
            item.getComponent(VKPQZNNRecordItem_hy).setItemData(list[i], isWinner);
            item.parent = this.content;
        }

        this.noDataNode.opacity = list.length < 1 ? 255 : 0;
    }

    /**对象属性排序-降序 */
    compare(key: any) {
        return (a, b) => {
            let v1 = a[key];
            let v2 = b[key];
            return v2 - v1;
        }
    }

    /**点击再来一轮 */
    onClickPlayAgain() {
        UKPQZNNScene_hy.ins.playClick();
        MKPQZNNModel_hy.ins.sendPlayAgain();
    }

    /**点击截屏保存 */
    onClickTakePhotoSave() {
        UKPQZNNScene_hy.ins.playClick();
        UAPIHelper.savePhoto2(this.node, Date.now().toString());
    }

    /**点击离开房间 */
    onClickExitRoom() {
        UKPQZNNScene_hy.ins.playClick();
        MKPQZNNModel_hy.ins.exitGame();
    }

    update(dt: number) {
        if (this._timeCount >= 0) {
            this._timeCount += dt;
            if (this._timeCount >= 1) {
                this._timeCount = 0;
                this.dateLbl.string = UDateHelper.format(new Date(), "yyyy-MM-dd hh:mm:ss");
                if (MKPQZNNModel_hy.ins.roomType == 2) {
                    this.setRoundOrTime();
                }
            }
        }
    }
}
