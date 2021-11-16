import ddz_Main_hy from "./ddz_Main_hy";
import UResManager from "../../common/base/UResManager";
import {ECommonUI, EIconType} from "../../common/base/UAllenum";
import AppGame from "../../public/base/AppGame";
import MDDZModel_hy from "./model/MDDZ_hy";
import UStringHelper from "../../common/utility/UStringHelper";
import UDateHelper from "../../common/utility/UDateHelper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ddz_RecordPanel_hy extends cc.Component {

    @property(cc.Node)
    scoreItem: cc.Node = null;
    @property(cc.Node)
    itemList: cc.Node = null;
    @property(cc.Label)
    levelTimeLabel: cc.Label = null;
    @property(cc.Label)
    counDownLab: cc.Label = null;

    exitTime:number     = -1;
    exitTimeFrec:number =0;

    currentSystemTimeLab:cc.Label;

    betData:any;

    start () {
        this.currentSystemTimeLab = this.node.getChildByName("currentSystemTimeLab").getComponent(cc.Label);
    }

    update(dt: number) {
        this.currentSystemTimeLab.string = UDateHelper.format(null,"yyyy-MM-dd hh:mm:ss",true);//显示时间
        if(ddz_Main_hy.ins.gameOver){
            this.counDownLab.string = `00:00:00`;
        }else{
            if(ddz_Main_hy.ins.allSeconds > 0 && ddz_Main_hy.ins.leftSeconds > 0) {//以时间为准的房间
                this.counDownLab.string = ddz_Main_hy.ins.secondToDate(ddz_Main_hy.ins.leftSeconds < 0 ? 0 : ddz_Main_hy.ins.leftSeconds);//显示时间
            }
        }

        if(this.exitTime > -1) {
            this.exitTimeFrec += dt;
            if(this.exitTimeFrec > 1){
                this.exitTimeFrec = 0;
                this.exitTime --;

                if(this.exitTime > 0) {
                    this.node.getChildByName("endPanel").getChildByName("likaifangjian").getChildByName("levelTimeLabel").getComponent(cc.Label).string = `${this.exitTime}`;
                }else{
                    this.node.getChildByName("endPanel").getChildByName("likaifangjian").getChildByName("levelTimeLabel").getComponent(cc.Label).string = `00:00:00`;
                    this.exitTime = -1;
                    this.on_leave();
                }
            }
        }
    }
    //设置倍率
    set setBetData(value){
        this.betData = value;
    }

    showPanel (data) {
        this.node.getChildByName("endPanel").getChildByName("zailaiyilun").active = false;
        this.node.getChildByName("endPanel").getChildByName("likaifangjian").active = false;
        if(ddz_Main_hy.ins.allSeconds > 0){//以时间为准的房间
            if(ddz_Main_hy.ins.roomInfo.leftSeconds <= 0){
                this.counDownLab.string = "00:00:00";
                if (AppGame.ins.ddzModel_hy.gameStatus == MDDZModel_hy.DDZ_GAMESTATUS.OVER){
                    this.showGameOverView();
                }
            }
            this.node.getChildByName("currentPartTimeCantainer").active = true;
            this.node.getChildByName("progressLabContainer").active = false;
        }else{//以局数为准的
            this.node.getChildByName("currentPartTimeCantainer").active = false;
            this.node.getChildByName("progressLabContainer").active = true;
            let currProgress = ddz_Main_hy.ins.roomInfo.currentRound + "/" + ddz_Main_hy.ins.roomInfo.allRound + "局";
            this.node.getChildByName("progressLabContainer").getChildByName("progressValueLab").getComponent(cc.Label).string = currProgress;
            if (ddz_Main_hy.ins.roomInfo.currentRound == ddz_Main_hy.ins.roomInfo.allRound && AppGame.ins.ddzModel_hy.gameStatus == MDDZModel_hy.DDZ_GAMESTATUS.OVER){
                this.showGameOverView();
            }
        }
        if(ddz_Main_hy.ins.gameOver){//处理提前解散
            this.showGameOverView();
        }
        this.itemList.destroyAllChildren();
        let newList = data.friendGameRecords.sort((a: any, b: any) => {
            return b.winScore - a.winScore
        });
        this.itemList.height = 0;
        let GAP = 15;
        this.node.getChildByName("nodata").active = newList.length == 0;
        for (let i=0;i<newList.length;i++){
            let preData = newList[i];
            let nodeItem = cc.instantiate(this.scoreItem);
            nodeItem.active = true;
            this.itemList.height += nodeItem.height + GAP;
            this.itemList.addChild(nodeItem);
            let headId = this.findHeadId(preData);
            nodeItem.getChildByName("ying").active = i==0;

            if(AppGame.ins.roleModel.useId == Number(preData.userId)){
                nodeItem.getChildByName("idLabel").getComponent(cc.Label).string = "我";
            }else{
                nodeItem.getChildByName("idLabel").getComponent(cc.Label).string = `${preData.nickName}`;
            }
            if(this.betData != null){
                for (let i=0;i<this.betData.length;i++){
                    let obj = this.betData[i];
                    if(this.findUserId(obj.chairid) == preData.userId && obj.maxbeilv > 0 && obj.overmaxbeilv){
                        nodeItem.getChildByName("fdbl"+obj.maxbeilv).active = true;
                        break;
                    }
                }
            }

            UResManager.load(this.getHeadIdForHeadBoxId(preData.userId), EIconType.Frame, nodeItem.getChildByName("K1").getComponent(cc.Sprite));
            let socreLabel = nodeItem.getChildByName("socreLabel");         //玩家上局输赢 赢
            let socreLoseLabel = nodeItem.getChildByName("socreLoseLabel"); //玩家上局输赢 输

            let allSocreLabel = nodeItem.getChildByName("allSocreLabel");         //玩家总输赢 赢
            let allSocreLoseLabel = nodeItem.getChildByName("allSocreLoseLabel"); //玩家总输赢 输
            let nosocreLabel = nodeItem.getChildByName("nosocreLabel");    //玩家未参与

            if(preData.bPlayingLast){
                if(preData.lastWinScore > 0){
                    socreLabel.getComponent(cc.Label).string = `+${UStringHelper.getMoneyFormat2(preData.lastWinScore/100)}`;
                    socreLabel.active = true;
                }else{
                    socreLoseLabel.getComponent(cc.Label).string = UStringHelper.getMoneyFormat2(preData.lastWinScore/100);
                    socreLoseLabel.active = true;
                }
            }else{
                nosocreLabel.active = true;
            }

            if(preData.winScore > 0){
                allSocreLabel.getComponent(cc.Label).string = `+${UStringHelper.getMoneyFormat2(preData.winScore/100)}`;
                allSocreLabel.active = true;
            }else{
                allSocreLoseLabel.getComponent(cc.Label).string = UStringHelper.getMoneyFormat2(preData.winScore/100);
                allSocreLoseLabel.active = true;
            }

            UResManager.load(headId, EIconType.Head, nodeItem.getChildByName("icon").getComponent(cc.Sprite));
        }
        this.itemList.getComponent(cc.Layout).updateLayout();
    }

    findUserId(chairId): any {
        for (const key in AppGame.ins.ddzModel_hy.gBattlePlayer) {
            let element = AppGame.ins.ddzModel_hy.gBattlePlayer[key];
            if (element.chairId == chairId) {
                return element.userId
            }
        }
        return null;
    }

    getHeadIdForHeadBoxId(userId: number) {
        let headBoxId = 0;
        for (let key in AppGame.ins.ddzModel_hy.gBattlePlayer){
            if(AppGame.ins.ddzModel_hy.gBattlePlayer[key].userId == userId){
                headBoxId = AppGame.ins.ddzModel_hy.gBattlePlayer[key].headboxId;
                break;
            }
        }
        return headBoxId;
    }
    findHeadId (obj):any{
        let headId = 0;
        for (const key in AppGame.ins.ddzModel_hy.gBattlePlayer){
            let element = AppGame.ins.ddzModel_hy.gBattlePlayer[key];
            if (element.userId == obj.userId) {
                headId = element.headId
                break;
            }
        }
        return headId;
    }
    //仅限房主 显示再来一轮 房主点击后在 通过协议打开 showAgainButton
    showGameOverView(){
        if(!ddz_Main_hy.ins.node.getChildByName("zailaiyilunBtn").active){
            this.node.getChildByName("endPanel").getChildByName("zailaiyilun").active = ddz_Main_hy.ins.isRoomHost;
        }
        this.node.getChildByName("endPanel").getChildByName("likaifangjian").active = true;
    }

    showAgainButton () {
        this.node.getChildByName("endPanel").getChildByName("zailaiyilun").active = true;
    }

    closePanel (event = null) {
        if(event != null){
            ddz_Main_hy.ins.musicMgr.playClickBtn();
        }
        this.node.active = false;
        if (AppGame.ins.ddzModel_hy.gameStatus == MDDZModel_hy.DDZ_GAMESTATUS.OVER){
            this.exitTime = -1;
            if(!ddz_Main_hy.ins.node.getChildByName("zailaiyilunBtn").active){
                ddz_Main_hy.ins.resView(this.node.getChildByName("endPanel").getChildByName("zailaiyilun").active);
            }
        }
    }

    on_leave(event = null): void {
        if(event != null){
            ddz_Main_hy.ins.musicMgr.playClickBtn();
        }
        AppGame.ins.ddzModel_hy.exitGame();
    }
}
