// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EGameType } from "../../../../common/base/UAllenum";
import UAudioManager from "../../../../common/base/UAudioManager";
import { ClubHallServer } from "../../../../common/cmd/proto";
import { UAPIHelper } from "../../../../common/utility/UAPIHelper";
import UDateHelper from "../../../../common/utility/UDateHelper";
import UDebug from "../../../../common/utility/UDebug";
import UEventHandler from "../../../../common/utility/UEventHandler";
import ULanHelper from "../../../../common/utility/ULanHelper";
import UStringHelper from "../../../../common/utility/UStringHelper";
import cfg_common, { BrGameList, ClubExcludedGameList, COIN_RATE } from "../../../../config/cfg_common";
import AppGame from "../../../base/AppGame";
import { ZJH_SCALE } from "../../lobby/VHall";
import game_type from "../../personal/game_type";
import room_name from "../../personal/room_name";
import time_type from "../../personal/time_type";
import MClubHall from "../hall/MClubHall";
import MClub from "./MClub";

const {ccclass, property} = cc._decorator;

/**炸金花焖牌轮数 */
const ZJH_MENPAI_LUNSHU = [1, 1, 2, 3]

@ccclass
export default class club_betting_record extends cc.Component {

    @property(cc.Toggle)
    select_time: cc.Toggle = null;

    @property(cc.Toggle)
    select_club: cc.Toggle = null;

    @property(cc.Toggle)
    select_type: cc.Toggle = null;

    @property(cc.SpriteFrame)
    arrow_up:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    arrow_down:cc.SpriteFrame = null;

    @property(cc.Node)
    no_data:cc.Node = null;

    @property(cc.Node)
    content:cc.Node = null;

    @property(cc.SpriteFrame)
    toggle_double:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    toggle_single:cc.SpriteFrame = null;

    @property(cc.Node)
    club_toggle_item:cc.Node = null;

    @property(cc.Label)
    select_time_label:cc.Label = null;

    @property(cc.Node)
    item:cc.Node = null;

    @property(cc.Node)
    type_content:cc.Node = null;

    
    @property(cc.SpriteFrame)
    brlh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    qznn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    brhh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    kpqzjh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    brnn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    qzjh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    ebg: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    tbjh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    tbnn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    kpqznn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    xpnn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    xpjh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    sg: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    brjh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    ddz: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    zjh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    bcbm: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    bj: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    pdk: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    sss: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    sh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    dzpk: cc.SpriteFrame = null;


    
    private club_id:number = 0;
    private startTime:string;
    private endTime:string;
    private _record_request_id: string;
    private _gameDataList: any[] = [];  //左侧栏游戏数据列表
    private _brcGameDataList: any[] = [];  //百人场游戏数据列表


    onLoad(){
        this.startTime = "" ;
        this.endTime = "" ;
        this.node.getChildByName("scrollView").on("scroll-to-bottom", this.recordScrollToBottom, this);
        this._record_request_id = "";
    }

    


    /**
     * @description 关闭Toggle
     * @param touEvent button传入的CustomEventData
     */
    private close_toggle(touEvent: TouchEvent, i):void{
        UAudioManager.ins.playSound("audio_click");
        switch(i){
            case "select_time":
                this.select_time.isChecked = false;
                this.select_time.node.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.arrow_up;
                break
            case "select_club":
                this.select_club.isChecked = false;
                this.select_club.node.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.arrow_up;
                break
            case "select_type":
                this.select_type.isChecked = false;
                this.select_type.node.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.arrow_up;
                break
        }
    }

    private open_toggle(touEvent: TouchEvent, i):void{
        UAudioManager.ins.playSound("audio_click");
        switch(i){
            case "select_time":
                this.select_time.isChecked = true;
                this.select_time.node.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.arrow_down;
                break
            case "select_club":
                this.select_club.isChecked = true;
                this.select_club.node.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.arrow_down;
                break
            case "select_type":
                this.select_type.isChecked = true;
                this.select_type.node.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.arrow_down;
                break
        }
    }

    private getMyClub(caller:ClubHallServer.GetMyClubGameMessageResponse):void{
            AppGame.ins.myClubModel.requestGetAllPlayRecordMessage("","",0,0,"");
            AppGame.ins.showConnect(true);
            this.select_club.node.getChildByName("checkmark").getChildByName("all_club").removeAllChildren();
            let item = cc.instantiate(this.club_toggle_item);
            item.parent = this.select_club.node.getChildByName("checkmark").getChildByName("all_club");
            let a = "全部俱乐部";
            let b = 0;
            item.getComponentInChildren(cc.Label).string = a;
            UEventHandler.addClick(item, this.node, "club_betting_record", "clubToggleClick",{a,b});
            for (let index = 0; index < caller.clubInfos.length; index++) {
                let item = cc.instantiate(this.club_toggle_item);
                item.parent = this.select_club.node.getChildByName("checkmark").getChildByName("all_club");
                if(index % 2 == 0){
                    item.getComponent(cc.Sprite).spriteFrame = this.toggle_single;
                }else{
                    item.getComponent(cc.Sprite).spriteFrame = this.toggle_double;
                }
                item.getComponentInChildren(cc.Label).string = caller.clubInfos[index].clubName;

                let a = caller.clubInfos[index].clubName;
                let b = caller.clubInfos[index].clubId
                UEventHandler.addClick(item, this.node, "club_betting_record", "clubToggleClick",{a,b});
            }
    }

    private clubToggleClick(evetn,i):void{
        this._record_request_id = "";
        this.select_club.node.getChildByName("Background").getComponentInChildren(cc.Label).string = i.a;
        this.club_id = i.b;
        this.select_club.isChecked = false;
        this.select_club.node.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.arrow_up;
        AppGame.ins.myClubModel.requestGetAllPlayRecordMessage(this.startTime,this.endTime,this.club_id,game_type[this.select_type.node.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string].id,"");
    }

    private timeToggleClick(event, customEventData): void {
        UAudioManager.ins.playSound("audio_click");
        this._record_request_id = "";
        this.select_time.isChecked = false;
        this.select_time.node.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.arrow_up;
        switch (customEventData) {

            case 'alltime':
                    this.select_time_label.string = "全部时间";
                    this.startTime = "" 
                    this.endTime = "" 
                break;

            case 'today':
                    this.select_time_label.string = "今天";
                    this.startTime = UDateHelper.format(new Date(), "yyyy-MM-dd")
                    this.endTime = UDateHelper.format(new Date(), "yyyy-MM-dd")
                break;

            case 'yesterday':
                    this.select_time_label.string = "昨天";
                    this.startTime = this.getDays(1);
                    this.endTime = this.getDays(1);
                break;

            case 'seven_days':
                    this.select_time_label.string = "七天以内";
                    this.endTime= UDateHelper.format(new Date(), "yyyy-MM-dd")
                    this.startTime = this.getDays(6)
                break;

            case 'fifteen_days':
                    this.select_time_label.string = "十五天以内";
                    this.endTime= UDateHelper.format(new Date(), "yyyy-MM-dd")
                    this.startTime = this.getDays(14)
                break;
            case 'thirty_days':
                    this.select_time_label.string = "三十天以内";
                    this.endTime = UDateHelper.format(new Date(), "yyyy-MM-dd")
                    this.startTime = this.getDays(29)
                break;
            default:
                break;
        }
        //刷新记录
        AppGame.ins.myClubModel.requestGetAllPlayRecordMessage(this.startTime,this.endTime,this.club_id,game_type[this.select_type.node.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string].id,"");
    }

    private gameToggleClick(event,i):void{
        UAudioManager.ins.playSound("audio_click");

        this._record_request_id = "";
        this.select_type.isChecked = false;
        this.select_type.node.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.arrow_up;
        this.select_type.node.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string = i;
        AppGame.ins.myClubModel.requestGetAllPlayRecordMessage(this.startTime,this.endTime,this.club_id,game_type[this.select_type.node.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string].id,"");
    }

    /**设置房间列表信息 */
    etRoomListInfo(gameId,i) {

        let roomListInfo = AppGame.ins.roomModel.getRoomListInfo(gameId);
        let lbl = "";
        let dizhu = 1;
        if (roomListInfo[i]) {
            dizhu = roomListInfo[i].dizu / COIN_RATE;
        }
        //不同游戏展示不一样
        switch (gameId) {
            case EGameType.ZJH:
                lbl = "炸金花(俱乐部-" + dizhu + '元必闷' + ZJH_MENPAI_LUNSHU[i] + '轮)';
                break;
            case EGameType.DDZ:
                lbl = "斗地主(俱乐部-" + dizhu + '元)';
                break;
            case EGameType.PDK:
                lbl = "跑得快(俱乐部-" + dizhu + '元/张)';
                break;
            case EGameType.TBNN:
                lbl = '通比牛牛(俱乐部-' + dizhu + '元底)';
                break;
            case EGameType.SG:
                lbl = '三公(俱乐部-' + dizhu + '元底)';
                break;
            case EGameType.KPQZNN:
                lbl = '看牌抢庄牛牛(俱乐部-' + dizhu + '元底)';
                break;
            case EGameType.SH:
                lbl = "梭哈(俱乐部-" + dizhu + '元)';
                break;
            case EGameType.SSS:
                lbl = '十三水(俱乐部-' + dizhu + '元底)';
                break;
            case EGameType.BRNN:
                lbl = '百人牛牛(俱乐部-' + (i + 1) + '号桌)';
                break;
            case EGameType.QZLH:
                lbl = '龙虎大战(俱乐部-' + (i + 1) + '号桌)';
                break;
            case EGameType.BRJH:
                lbl = '百人金花(俱乐部-' + (i + 1) + '号桌)';
                break;
            case EGameType.BRHH:
                lbl = '红黑大战(俱乐部-' + (i + 1) + '号桌)';
                break;
            default:
                lbl = '';
                break;
        }
        return lbl
    }

    private getBetRecord(caller:ClubHallServer.GetAllPlayRecordMessageResponse):void{
        if(caller.retCode == 0){
            var a = this.content.childrenCount;
            if(caller.detailInfo.length == 0){
                if(this.content.children[a - 1].getChildByName("time") && this.content.children[a - 1].getChildByName("time").getComponent(cc.Label).string == this._record_request_id && (this._record_request_id !== "")){
                    AppGame.ins.showTips("没有记录了");
                }else{
                    this.content.removeAllChildren();
                    var no_data = cc.instantiate(this.no_data);
                    no_data.parent = this.content;
                }
            }else{
                if(this.content.children[a - 1].getChildByName("time") && this._record_request_id == this.content.children[a - 1].getChildByName("time").getComponent(cc.Label).string){
                    for(let index = 0;index < caller.detailInfo.length;index ++){
                        let item = cc.instantiate(this.item);
                        item.parent = this.content;
                        let a = caller.detailInfo[index].gameId;
                        let b = parseInt((caller.detailInfo[index].roomId.toString()).substring(3,4)) - 1;
                        item.getChildByName("game_name").getComponent(cc.Label).string = this.etRoomListInfo(a,b);
                        item.getChildByName("time").getComponent(cc.Label).string = caller.detailInfo[index].gameEndTime;
                        item.getChildByName("bet").getComponent(cc.Label).string = "已投注：" + UStringHelper.getMoneyFormat(caller.detailInfo[index].betScore * ZJH_SCALE);
                        item.getChildByName("pjbh").getComponent(cc.Label).string = "牌局编号：" + caller.detailInfo[index].gameRoundNo;
                        item.getChildByName("income").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.detailInfo[index].winLoseScore * ZJH_SCALE);
                        
                        if (caller.detailInfo[index].winLoseScore < 0) {
                            item.getChildByName("income").color = cc.color(50, 160, 124, 255);
                        } else {
                            item.getChildByName("income").color = cc.color(206, 105, 56, 255);
                        }
                        UEventHandler.addClick(item.getChildByName("copy"), this.node, "club_betting_record", "copyNumber", caller.detailInfo[index].gameRoundNo);
                        if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "900") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brlh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "830") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.qznn;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "210") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brhh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "820") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.kpqzjh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "930") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brnn;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "840") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.qzjh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "720") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.ebg;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "850") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.tbjh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "870") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.tbnn;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "890") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.kpqznn;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "810") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.xpnn;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "880") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.xpjh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "860") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sg;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "920") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brjh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "100") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.ddz;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "300") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.pdk;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "220") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.zjh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "950") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.bcbm;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "600") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.bj;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "550") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sss;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "420") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "450") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.dzpk;
                        }
                    }
                }else{
                    this.content.removeAllChildren(); 
                    for(let index = 0;index < caller.detailInfo.length;index ++){
                        let item = cc.instantiate(this.item);
                        item.parent = this.content;
                        let a = caller.detailInfo[index].gameId;
                        let b = parseInt((caller.detailInfo[index].roomId.toString()).substring(3,4)) - 1;
                        item.getChildByName("game_name").getComponent(cc.Label).string = this.etRoomListInfo(a,b);
                        item.getChildByName("time").getComponent(cc.Label).string = caller.detailInfo[index].gameEndTime;
                        item.getChildByName("bet").getComponent(cc.Label).string = "已投注：" + UStringHelper.getMoneyFormat(caller.detailInfo[index].betScore * ZJH_SCALE);
                        item.getChildByName("pjbh").getComponent(cc.Label).string = "牌局编号：" + caller.detailInfo[index].gameRoundNo;
                        item.getChildByName("income").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.detailInfo[index].winLoseScore * ZJH_SCALE);
                        
                        if (caller.detailInfo[index].winLoseScore < 0) {
                            item.getChildByName("income").color = cc.color(50, 160, 124, 255);
                        } else {
                            item.getChildByName("income").color = cc.color(206, 105, 56, 255);
                        }
                        UEventHandler.addClick(item.getChildByName("copy"), this.node, "club_betting_record", "copyNumber", caller.detailInfo[index].gameRoundNo);
                        if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "900") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brlh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "830") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.qznn;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "210") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brhh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "820") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.kpqzjh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "930") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brnn;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "840") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.qzjh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "720") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.ebg;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "850") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.tbjh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "870") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.tbnn;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "890") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.kpqznn;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "810") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.xpnn;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "880") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.xpjh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "860") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sg;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "920") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brjh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "100") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.ddz;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "300") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.pdk;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "220") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.zjh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "950") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.bcbm;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "600") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.bj;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "550") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sss;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "420") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sh;
                        } else if (caller.detailInfo[index].roomId.toString().substr(0, 3) == "450") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.dzpk;
                        }
                    }
                }
            }
        }else{
            this.content.removeAllChildren();
            var no_data = cc.instantiate(this.no_data);
            no_data.parent = this.content;
        }

    }

    private recordScrollToBottom(): void {
        var a = this.content.childrenCount;
        var b = this.content.children[a - 1].getChildByName("time").getComponent(cc.Label).string;
        var startDate = time_type[this.select_time.node.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string].startDate;
        var endDate = time_type[this.select_time.node.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string].endDate;
        var id = game_type[this.select_type.node.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string].id;
        AppGame.ins.myClubModel.requestGetAllPlayRecordMessage(startDate, endDate, 0, id, b);
        this._record_request_id = b;
        AppGame.ins.showConnect(true);
    }

    private copyNumber(event, i) {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked(i);

    }
    

    //获得前N天的时间字符串
    getDays(n:number):string{
        // var now = new Date();
        var now = new Date(new Date().getTime() + (new Date().getTimezoneOffset() / 60 + 8) * 3600 * 1000);
        var date = new Date( now.getTime() - n*24*3600*1000 );
        var year = date.getFullYear();
        var month = date.getMonth()+1 > 9 ? date.getMonth()+1 : "0" + (date.getMonth() + 1);
        var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        var result = year + "-" + month + "-" + day;

        return result
    }


    start () {
        for(let index = 0;index < this.type_content.childrenCount;index++){
            UEventHandler.addClick(this.type_content.children[index],this.node,"club_betting_record","gameToggleClick",this.type_content.children[index].getComponentInChildren(cc.Label).string);
        }

    }

    resetUI(){
        this.showGameList();
        this.select_time.isChecked = false;
        this.select_club.isChecked = false;
        this.select_type.isChecked = false;
        this.select_time.node.getChildByName("Background").getComponentInChildren(cc.Label).string = "全部时间";
        this.select_club.node.getChildByName("Background").getComponentInChildren(cc.Label).string = "全部俱乐部";
        this.select_type.node.getChildByName("Background").getComponentInChildren(cc.Label).string = "全部游戏";
        this.content.removeAllChildren();
        let no_data = cc.instantiate(this.no_data);
        no_data.parent = this.content;
        AppGame.ins.clubHallModel.requestMyClub();


    }

    private showGameList():void{
        let gameClubList = [];
        let serGameList = AppGame.ins.hallModel.getGameList();
        for (let i = 0; i < serGameList.length; i++) {
            let gameInfo = serGameList[i];
            if (!ClubExcludedGameList.includes(gameInfo.gameType)) {
                gameClubList.push(gameInfo);
            }
        }

        let count = 0;
        for (let i = 0; i < gameClubList.length; i++) {
            let abbreviateName = gameClubList[i]["abbreviateName"];
            let node = this.type_content.getChildByName(abbreviateName);
            if(node!=null){
                node.active = true;
                node.zIndex=count;
                if(count % 2 == 0){
                    node.getComponentInChildren(cc.Sprite).spriteFrame = this.toggle_single;
                    
                }else{
                    node.getComponentInChildren(cc.Sprite).spriteFrame  = this.toggle_double;
                }
                count++;
            }
        };
        
        // for(let i = 1;i < this.type_content.childrenCount;i++){
        //     for(let index = 0; index < ClubExcludedGameList.length;index ++){
        //         if(game_type[this.type_content.children[i].getComponentInChildren(cc.Label).string].id == ClubExcludedGameList[index]){
        //             this.type_content.children[i].removeFromParent();
        //             // this.type_content.children[i].zIndex = 200;
        //         }
        //     }

        // }
        // for(let a = 0; a <this.type_content.childrenCount;a++){
        //     if(a%2 ==0){
        //         this.type_content.children[a].getComponentInChildren(cc.Sprite).spriteFrame = this.toggle_double;
        //     }else{
        //         this.type_content.children[a].getComponentInChildren(cc.Sprite).spriteFrame = this.toggle_single;
        //     }
        // }
    }

    protected onEnable():void{
        this.resetUI();
        AppGame.ins.clubHallModel.on(MClubHall.MY_CLUB_RES,this.getMyClub,this);
        AppGame.ins.myClubModel.on(MClub.Get_All_Play_Record,this.getBetRecord,this);
    }

    protected onDisable():void{
        AppGame.ins.clubHallModel.off(MClubHall.MY_CLUB_RES,this.getMyClub,this);
        AppGame.ins.myClubModel.off(MClub.Get_All_Play_Record,this.getBetRecord,this);

    }



    // update (dt) {}
}
