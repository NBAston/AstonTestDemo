import { EIconType } from "../../../common/base/UAllenum";
import UResManager from "../../../common/base/UResManager";
import VWindow from "../../../common/base/VWindow";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import UDateHelper from "../../../common/utility/UDateHelper";
import UDebug from "../../../common/utility/UDebug";
import UEventHandler from "../../../common/utility/UEventHandler";
import UEventListener from "../../../common/utility/UEventListener";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import MZJH_hy from "../../../game/zjh_hy/MZJH_hy";
import VZJH_hy from "../../../game/zjh_hy/VZJH_hy";
import AppGame from "../../base/AppGame";
import AppStatus from "../../base/AppStatus";
import { ZJH_SCALE } from "../lobby/VHall";
import MRoomModel from "../room_zjh/MRoomModel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ui_real_time_record extends VWindow {

    @property(cc.SpriteFrame) winner: cc.SpriteFrame = null;
    // @property(cc.SpriteFrame) myself: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) otherBg: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) selfBg: cc.SpriteFrame = null;

    private _btn_again:cc.Node;
    private _btn_left:cc.Node;
    private _count:cc.Label;
    private _nodata:cc.Node;
    private _item:cc.Node;
    private _time:cc.Label;
    private _timeleftSeconds: number = 0; //超时剩余时间
    private _btn_save:cc.Node;
    private _timeCount: number = -1;
    private _vzjh: VZJH_hy;
    private _hideTime = -1; //隐藏到后台的时候时间戳
    private m_nBack: number = 0
    private m_tmpClockTime: number = 0;
    /**倒计秒数 */
    private _clockTime: number = 0;
    private _iswait: boolean = false;


    init(): void {
        super.init();
        this._btn_again = UNodeHelper.find(this._root,"btns/btn_again");
        this._btn_left = UNodeHelper.find(this._root,"btns/btn_left");
        this._btn_save = UNodeHelper.find(this._root,"btns/btn_save");
        UEventHandler.addClick(this._btn_again,this.node,"ui_real_time_record","request_again");
        UEventHandler.addClick(this._btn_left,this.node,"ui_real_time_record","request_left");
        UEventHandler.addClick(this._btn_save,this.node,"ui_real_time_record","onClickTakePhotoSave");

        this._count = UNodeHelper.getComponent(this.node,"root/count",cc.Label);
        this._nodata = UNodeHelper.find(this._root,"scrollView/view/content/nodata");
        this._item = UNodeHelper.find(this._root,"scrollView/view/content/item");
        this._time = UNodeHelper.getComponent(this._root,"time",cc.Label);
        this._vzjh = null;
    }

    closeUI(){
        super.playclick();
        super.clickClose();
    }

    onEnable(){
        AppGame.ins.roomModel.on(MRoomModel.CLIENT_RECORD_FRIEND, this.onRecordData, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.PLAY_AGAIN,this.play_again,this);
        AppGame.ins.roomModel.requestRecord(AppGame.ins.fzjhModel._roomInfo.userGameKindId);
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK,this.onGameToBack,this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_UPDATA_GAME_NUMBER,this.refreshTime,this);
        this._time.string = UDateHelper.format(new Date(), "yyyy-MM-dd hh:mm:ss");
        this._timeCount = 0;
        // if(AppGame.ins.fzjhModel._roomInfo.leftSeconds < 0){
        //     this._timeleftSeconds = AppGame.ins.fzjhModel._roomInfo.allSeconds;
        // }else{
            this._timeleftSeconds = AppGame.ins.fzjhModel._roomInfo.leftSeconds;
        // }
        if(AppGame.ins.fzjhModel.isPreDismiss){
            if(AppGame.ins.roleModel.useId == AppGame.ins.fzjhModel._roomInfo.roomUserId){
                this.showLeaveAndAgain(true);
            }else{
                this._btn_again.active = false;
                this._btn_left.active = true;
            }
        }

        this._btn_left.active = true;
        if(AppGame.ins.fzjhModel._roomInfo.leftSeconds < 0){
            let second = Math.ceil(AppGame.ins.fzjhModel._roomInfo.allSeconds);
            this._count.string = "" + UDateHelper.secondsToTime(second);
        }

    }

    onDisable(){
        AppGame.ins.roomModel.off(MRoomModel.CLIENT_RECORD_FRIEND, this.onRecordData, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.PLAY_AGAIN,this.play_again,this);
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK,this.onGameToBack,this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_UPDATA_GAME_NUMBER,this.refreshTime,this);
        this._timeCount = -1;
        this.showLeaveAndAgain(false);
        this._btn_left.active = true;
        let content = UNodeHelper.find(this._root,"scrollView/view/content");
        content.removeAllChildren();
        this._count.string = "" ;
    }

    /**
     * 游戏切换到后台
     * @param isHide 是否切在后台
     */
    onGameToBack(isBack: boolean) {
        //处理自动解散时间、房间时间
        if (isBack) {
            this._hideTime = new Date().getTime();
        }else {
            let nowTime = new Date().getTime();
            if (this._hideTime > 0) {
                let diffSeconds = (nowTime - this._hideTime) / 1000;
                // this._timeOutSeconds -= diffSeconds;
                this._timeleftSeconds -= diffSeconds;
                this._hideTime = -1;
            }
        }

        //倒计时逻辑
        if (isBack == true) {
            this.m_nBack = new Date().getTime() / 1000
            this.m_tmpClockTime = this._clockTime
        } else if (this._clockTime > 0 && !this._iswait) {
            let disTime = Math.round(new Date().getTime() / 1000 - this.m_nBack)
            if (disTime > this.m_tmpClockTime) //如果当前局结束
            {
                this.onDjsEvent(0)
            } else if (this.m_tmpClockTime > disTime) {
                this._clockTime = this.m_tmpClockTime - disTime
            }
        } else {
            this.onDjsEvent(0)
        }
    }

    private refreshTime():void{
        this._timeleftSeconds = AppGame.ins.fzjhModel._roomInfo.leftSeconds;
    }
        
    private onDjsEvent(data: any, iswait?: boolean) { //
        if (data != null) {
            this._clockTime = data;
            // if (data == 0) {
            //     this._djsNode.active = false;
            // }
        }

        if (iswait != null) {
            this._iswait = iswait;
        }
    }

    /**实时战绩返回数据 */
    onRecordData(data: any) {
        UDebug.log('实时战绩返回数据 ' + JSON.stringify(data));
        if(data.friendGameRecords.length > 0){
            let content = UNodeHelper.find(this._root,"scrollView/view/content");
            content.removeAllChildren();
            let list = data.friendGameRecords;
            list.sort(this.compare('score'));
            for(var i = 0;i < list.length;i++){
                let item = cc.instantiate(this._item);
                item.parent = content;
                if(i ==0){
                    item.getChildByName("logo").getComponent(cc.Sprite).spriteFrame = this.winner;
                }
                item.getChildByName("name").getComponent(cc.Label).string = data.friendGameRecords[i].nickName;
                item.getChildByName("take_in").getComponent(cc.Label).string = parseInt(data.friendGameRecords[i].enterScore * ZJH_SCALE + '') + "";
                item.getChildByName("left").getComponent(cc.Label).string = parseInt((data.friendGameRecords[i].enterScore + data.friendGameRecords[i].winScore) * ZJH_SCALE + '') + "" ;
                item.getChildByName("total").getComponent(cc.Label).string = parseInt(data.friendGameRecords[i].winScore * ZJH_SCALE + "") + "";
                if(data.friendGameRecords[i].userId == AppGame.ins.roleModel.useId){
                    item.getChildByName("name").getComponent(cc.Label).string = "我";
                    if(i !== 0){
                        // item.getChildByName("logo").getComponent(cc.Sprite).spriteFrame = this.myself;
                        item.getChildByName("logo").getComponent(cc.Sprite).spriteFrame = null;
                    }
                    item.getComponent(cc.Sprite).spriteFrame = this.selfBg;
                }else{
                    if(i !== 0){
                        item.getChildByName("logo").getComponent(cc.Sprite).spriteFrame = null;
                    }
                    item.getComponent(cc.Sprite).spriteFrame = this.otherBg;
                }
                item.getChildByName("take_in").color = data.friendGameRecords[i].enterScore >= 0 ? cc.color(239,82,40,255) : cc.color(50,160,124,255);
                item.getChildByName("left").color = (data.friendGameRecords[i].enterScore + data.friendGameRecords[i].winScore) >= 0 ? cc.color(239,82,40,255) : cc.color(50,160,124,255);
                item.getChildByName("total").color = data.friendGameRecords[i].winScore >= 0 ? cc.color(239,82,40,255) : cc.color(50,160,124,255);

                if(AppGame.ins.fzjhModel._battleplayer[data.friendGameRecords[i].userId]){
                    UResManager.load(AppGame.ins.fzjhModel._battleplayer[data.friendGameRecords[i].userId].headboxId, EIconType.Frame, item.getChildByName("head").getChildByName("frame").getComponent(cc.Sprite));
                    UResManager.load(AppGame.ins.fzjhModel._battleplayer[data.friendGameRecords[i].userId].headId, EIconType.Head,item.getChildByName("head").getComponent(cc.Sprite),AppGame.ins.fzjhModel._battleplayer[data.friendGameRecords[i].userId].headImgUrl);
                }else{
                    UResManager.load(0, EIconType.Frame, item.getChildByName("head").getChildByName("frame").getComponent(cc.Sprite));
                    UResManager.load(0, EIconType.Head,item.getChildByName("head").getComponent(cc.Sprite));
                }
               
            }
            if(AppGame.ins.fzjhModel.isPreDismiss){
                this._btn_left.active = true;
                // this._btn_again.active = true;
                this._btn_save.active = true;
            }else{
                this._btn_left.active = false;
                this._btn_again.active = false;
                this._btn_save.active = true;
            }


        }else{
            let content = UNodeHelper.find(this._root,"scrollView/view/content");
            content.removeAllChildren();
            let nodata = cc.instantiate(this._nodata);
            nodata.parent = content;
            this._btn_again.active = false;
            this._btn_left.active = false;
            this._btn_save.active = false;
        }

    }

    /**对象属性排序-降序 */
    compare(key: any) {
        return (a, b) => {
            let v1 = a[key];
            let v2 = b[key];
            return v2 - v1;
        }
    }

    /**显示离开和再来一轮 */
    showLeaveAndAgain(isShow: boolean) {
        this._btn_again.active = isShow;
        this._btn_left.active = isShow;
    }

    update(dt:number){
        if (this._timeCount > 0) {
            this._timeCount += dt;
            if (this._timeCount >= 1) {
                this._timeCount = 0;
                this._time.string = UDateHelper.format(new Date(), "yyyy-MM-dd hh:mm:ss");
            }
        }

        if(AppGame.ins.fzjhModel._end_time){
            // let second = Math.ceil(this._timeleftSeconds);
            // this._count.string = "" + UDateHelper.secondsToTime(second);
            // if(second < 0){
                this._count.string = "00:00:00";
            // }
        }else{
            if(AppGame.ins.fzjhModel.restart){
                let second = Math.ceil(AppGame.ins.fzjhModel._roomInfo.allSeconds);
                this._count.string = "" + UDateHelper.secondsToTime(second);
            }else{
                if(this._timeleftSeconds > 0){
                    this._timeleftSeconds -= dt;
                    if(this._timeleftSeconds < 0){
                        this._timeleftSeconds = 0;
                        let second = Math.ceil(AppGame.ins.fzjhModel._roomInfo.allSeconds);
                        this._count.string = "" + UDateHelper.secondsToTime(second);
                    }
                    if(this._timeleftSeconds == 0){
                        this._btn_again.active = true;
                    }
                    let second = Math.ceil(this._timeleftSeconds);
                    this._count.string = "" + UDateHelper.secondsToTime(second);
                }
            }
        }
    }

    private request_again(){
        AppGame.ins.fzjhModel.requestAgain();
        AppGame.ins.fzjhModel.isPreDismiss = false;
        this.clickClose();
    }

    private play_again(data:any):void{
        if(data.userId == AppGame.ins.fzjhModel._roomInfo.roomUserId){
            this.showLeaveAndAgain(true);
        }
    }

    private request_left():void{
        AppGame.ins.fzjhModel.exitGame();
    }

    /**点击截屏保存 */
    private onClickTakePhotoSave():void {
        UAPIHelper.savePhoto2(this.node, "ZJH"+Date.now());
    }

}
