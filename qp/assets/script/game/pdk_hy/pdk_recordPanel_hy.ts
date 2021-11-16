import { ECommonUI, ERoomKind } from "../../common/base/UAllenum";
import USpriteFrames from "../../common/base/USpriteFrames";
import RsaKey from "../../common/utility/RsaKey";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import UDateHelper from "../../common/utility/UDateHelper";
import UDebug from "../../common/utility/UDebug";
import UHandler from "../../common/utility/UHandler";
import ULanHelper from "../../common/utility/ULanHelper";
import UStringHelper from "../../common/utility/UStringHelper";
import AppGame from "../../public/base/AppGame";
import MRoomModel from "../../public/hall/room_zjh/MRoomModel";
import MPdk_hy, { PDK_SCALE, PDK_SCALE_100 } from "./model/MPdk_hy";
import UPDKHelper_hy from "./pdk_Helper_hy";
import pdk_Main_hy from "./pdk_Main_hy";

const { ccclass, property } = cc._decorator;
@ccclass
export default class pdk_recordPanel_hy extends cc.Component {
   
    @property(cc.Label) tip1: cc.Label = null; 
    @property(cc.Label) tip2: cc.Label = null; 
    @property(cc.Label) tip3: cc.Label = null; 
    @property(cc.Label) time_tip: cc.Label = null; 
    @property(cc.Label) djs_tip: cc.Label = null; 
    @property(cc.Node) againBtn: cc.Node = null; // 再来一轮按钮节点
    @property(cc.Node) savePhotoBtn: cc.Node = null; // 截屏保存节点
    @property(cc.Node) leaveRoomBtn: cc.Node = null; // 离开房间按钮节点
    @property(cc.Node) recordItem: cc.Node = null; // 记录item
    @property(cc.Node) recordContent: cc.Node = null; // 记录content 
    @property(cc.ScrollView) scrollView: cc.ScrollView = null; // 记录
    @property(cc.Node) noneData: cc.Node = null; // wu记录

    // _djs_interval: any = null; // 倒计时计时器
    // _djs_interval2: any = null; 
    // _djs_second2: number = 0;
    _recordData: any = null;
    _myRecordData: any = null;
    _otherResultData: any = null;
    _roomInfoData: any = null; 
    _isPreDissRoom: boolean = false;
    _isTimeRoom: boolean = false;
    _djs_second: number = -1;
    _leaveTime: number = -1;
    _timeCount: number = -1;
    _isShowFlag: boolean = true; // 是否弹房主考虑再来一轮提示
    _isShowBtn: boolean = false; // 是否展示按钮

    protected onEnable(): void {
        this._timeCount = 0;
        this.time_tip.string = UDateHelper.format(new Date(), "yyyy-MM-dd hh:mm:ss", true);
        // AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_GET_GAME_RECORD, this.updateGameRecord, this);
        AppGame.ins.roomModel.on(MRoomModel.CLIENT_RECORD_FRIEND, this.updateGameRecord, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_SELF_EVENT.PDK_ROOM_USER_CLICK_AGAIN_GAME, this.showAgainGameBtn, this);
    }

    protected onDisable(): void {
        this._timeCount = -1;
        // AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_GET_GAME_RECORD, this.updateGameRecord, this);
        AppGame.ins.roomModel.off(MRoomModel.CLIENT_RECORD_FRIEND, this.updateGameRecord, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_SELF_EVENT.PDK_ROOM_USER_CLICK_AGAIN_GAME, this.showAgainGameBtn, this);
    }

    show(data: any) {
        this.node.active = true;
        this.tip2.string = pdk_Main_hy.ins.time_round.string;
       
        if(data) {
            this._isPreDissRoom = data.isPreDissRoom;
            this._leaveTime = data.leaveTime;
        }
        // AppGame.ins.fPdkModel.sendGetGameRecord();
        if(MPdk_hy.ins.roomInfoHy) {
            AppGame.ins.roomModel.requestRecord(MPdk_hy.ins.roomInfoHy.userGameKindId);
        }
    }

    update(dt: number) {

        if (this._timeCount >= 0) {
            this._timeCount += dt;
            if (this._timeCount >= 1) {
                this._timeCount = 0;
                this.time_tip.string = UDateHelper.format(new Date(), "yyyy-MM-dd hh:mm:ss", true);
            }
        }
         //超时时间倒计时
         /*if (this._isPreDissRoom && this._leaveTime > 0) {
            this._leaveTime -= dt;
            if (this._leaveTime < 0) {
                this._leaveTime = 0;
                this.onClickLeaveRoomBtn();
            }
            let second = Math.ceil(this._leaveTime);
            this.djs_tip.string = `${second}`;
        }*/

        // 剩余时长倒计时
        if(this._isPreDissRoom && this._isTimeRoom) {
            this.setTimeOutTime(0);
            this._djs_second = 0;
        }
        if(this._djs_second > 0 && this._isTimeRoom) {
            this._djs_second -= dt;
            if (this._djs_second < 0) {
                this._djs_second = 0;
                this.onClickLeaveRoomBtn();
            }
            let second = Math.ceil(this._djs_second);
            this.setTimeOutTime(second);
        }
    }

    /**设置超时时间 */
    setTimeOutTime(seconds: number) {
        this.tip2.string = UDateHelper.secondsToTime(seconds);
    }

    hide() {
        this.node.active = false;
        if(this._isPreDissRoom) {
            if(AppGame.ins.roleModel.useId != MPdk_hy.ins.roomInfoHy.roomUserId) {
                if(this._isShowFlag) {
                    pdk_Main_hy.ins.waitAgain.active = true;
                    // AppGame.ins.showTips(ULanHelper.GAME_HY.THE_IS_CONSIDERING_WHETHER_TO_COME_AGAIN_PLEASE_WAIT);
                }
            } 
            let data = {isShowBtn: AppGame.ins.roleModel.useId != MPdk_hy.ins.roomInfoHy.roomUserId?this._isShowBtn:this._isShowBtn?false:true, flag: true};
            AppGame.ins.fPdkModel.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SHOW_AGAIN_GAME, data);
        }
        this._isPreDissRoom = false;
        this._isShowFlag = true;
        this._isShowBtn = false;
    }

    showAgainGameBtn() {
        this._isShowBtn = true;
        this._isShowFlag = false;
        if(AppGame.ins.roleModel.useId != MPdk_hy.ins.roomInfoHy.roomUserId) {
            this.againBtn.active = true;
        }
    }

    updateGameRecord(data: any) {
        this._recordData = data.friendGameRecords;
        this._roomInfoData = MPdk_hy.ins.roomInfoHy;
        this._recordData.sort(function(a, b){
            return (b.winScore - a.winScore);
        });

        this.setRoomInfoUI(this._roomInfoData);
        this.setRecordListUI(this._recordData);
    }

    // 设置房间信息
    setRoomInfoUI(data: any): void {
        this.time_tip.string = UDateHelper.format(new Date(), "yyyy-MM-dd hh:mm:ss", true) //"2021-02-23 20:15:13"
        if(data.allRound <= 0) { // 以时间来计算的开局 
            this.tip3.node.active = false;
            this.tip1.string = "牌局剩余时长：";
            this.tip2.string = data.leftSeconds <=0 ? UDateHelper.secondsToTime(data.allSeconds): UDateHelper.secondsToTime(data.leftSeconds);

            if(data.leftSeconds <= 0) { // 游戏未开始
                this.tip2.string = UDateHelper.secondsToTime(data.allSeconds);
            } else { // 开始倒计时
                this._djs_second = data.leftSeconds;
            }
            this._isTimeRoom = true;
        } else { // 局数为计算的开局
            this._isTimeRoom = false;
            this.tip1.string = "局数：";
            this.tip2.string = (data.currentRound<0?0:data.currentRound)+"/"+data.allRound;
            this.tip3.string = "局";
        }

        if(AppGame.ins.roleModel.useId == MPdk_hy.ins.roomInfoHy.roomUserId  && this._isPreDissRoom) {// 房主
            this.againBtn.active = true;
        } else {
            this.againBtn.active = false;
        }
        this.leaveRoomBtn.active = this._isPreDissRoom
    }

    // 设置记录列表
    setRecordListUI(data: any): void {
        this.recordContent.removeAllChildren(); 
        if(data.length > 0) {
            this.noneData.active = false;
            for (let index = 0; index < data.length; index++) {
                const element = data[index]; 
                let item = cc.instantiate(this.recordItem);
                item.parent = this.recordContent;
                item.getComponent('pdk_record_item_hy').setItemInfo(
                    index, 
                    AppGame.ins.currRoomKind == ERoomKind.Normal?element.userId:(element.hasOwnProperty('nickName')?element.nickName:""),
                    element.lastWinScore==0?`0`:`${element.lastWinScore/PDK_SCALE_100}`,
                    element.winScore==0?`0`:`${element.winScore/PDK_SCALE_100}`,
                    element.bPlayingLast,
                    );
            }
        } else {
            this.noneData.active = true;
        }
        this.scrollView.scrollToTop(0.1);
    }
 

     //继续游戏
     continueGame(event:any, index:string){
        // AppGame.ins.fPdkModel.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SC_TS_START_MATCH);
        // this.hide(null, index);
    }

    // 再来一轮
    onClickAgainOneGameBtn() {
        AppGame.ins.fPdkModel.sendAgain(); 
        let data = {isShowBtn: true, flag: false};
        AppGame.ins.fPdkModel.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SHOW_AGAIN_GAME, data);
        this.hide();
    }

    onClickSavePhotoBtn() {
        UAPIHelper.savePhoto2(this.node, "PDK_HY"+Date.now());
    }

    onClickLeaveRoomBtn() {
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 3, data: "确定离开房间", handler: UHandler.create((a) => {
                if (a) {
                    AppGame.ins.fPdkModel.exitGame(); 
                }
            }, this)
        });
    }

}
