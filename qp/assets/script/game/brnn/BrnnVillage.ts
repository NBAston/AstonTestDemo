import { ECommonUI, EIconType, ERoomKind, ETipType, } from "../../common/base/UAllenum";
import UResManager from "../../common/base/UResManager";
import { Brnn } from "../../common/cmd/proto";
import UHandler from "../../common/utility/UHandler";
import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "../../public/base/AppGame";
import MRole from "../../public/hall/lobby/MRole";
import MBrnn from "./model/MBrnn";
import UStringHelper from "../../common/utility/UStringHelper";
import VBrnnScene from "./VBrnnScene";

const { ccclass, property } = cc._decorator;


enum GAME_STATUS {
    LH_GAME_START = 1,      // 开始下注
    LH_GAME_START_TIPS = 2, // 下注快结束了
    LH_GAME_STOP = 3,       // 停止下注
    LH_GAME_END = 4,        // 结束
    LH_GAME_FREE = 5,       // 空闲
}


@ccclass
export default class BrnnVillage extends cc.Component {

    @property(cc.Sprite)
    head: cc.Sprite = null;//头像

    @property(cc.Sprite)
    headframe: cc.Sprite = null;//头像框

    @property(cc.Node)
    systemBanker: cc.Node = null;//系统庄家

    @property(cc.Node)
    palyBanker: cc.Node = null;//玩家庄家

    @property(cc.Node)
    toggle_container: cc.Node = null;//筹码

    @property(cc.Label)
    bankerID: cc.Label = null;//庄家ID

    @property(cc.Label)
    LZNumber: cc.Label = null;//庄家连庄

    @property(cc.Label)
    goldLabel: cc.Label = null;//庄家携带金额

    @property(cc.Label)
    bankerNeed: cc.Label = null;//上庄需要金额

    @property(cc.Label)
    bankerNum: cc.Label = null;//上庄排队人数

    @property(cc.Sprite)
    bankerButton: cc.Sprite = null;//上下庄按钮

    @property(sp.Skeleton)
    bankerWin: sp.Skeleton = null;//闪烁框

    @property(cc.Node)
    tip_score: cc.Node = null;

    @property(cc.SpriteFrame)
    bankerFrame: cc.SpriteFrame[] = [];//上下庄图片

    private _tip_score_pos = cc.v2(-247, -30);
    bankerBT: cc.Button = null;

    onLoad() {
        this.bankerBT = this.bankerButton.node.getComponent(cc.Button);
    }

    onEnable() {
        AppGame.ins.brnnModel.on(MRole.BANKERINFO, this.updateInfo, this);//更新排队信息
        AppGame.ins.brnnModel.on(MRole.S_BANKERSUCCEED, this.bankerSucceed, this);//申请庄家成功
        AppGame.ins.brnnModel.on(MRole.S_BANKERFAILL, this.bankerFail, this);//申请庄家失败
        AppGame.ins.brnnModel.on(MRole.S_CANCELSUCCEED, this.cancelSucceed, this);//取消成功
        AppGame.ins.brnnModel.on(MRole.S_CANCELFAILL, this.cancelFail, this);//取消失败
        AppGame.ins.brnnModel.on(MRole.S_DOWNSUCCEED, this.downBankerSucceed, this);//下庄成功
        AppGame.ins.brnnModel.on(MRole.S_DOWNERFAILL, this.downBankerFail, this);//下庄失败
        AppGame.ins.brnnModel.on(MRole.S_CHANGEBANKER, this.changeBanke, this);//切换庄家
        AppGame.ins.brnnModel.on(MRole.S_CHANGEBANKER2, this.changeBanke2, this);//切换庄家
        AppGame.ins.brnnModel.on(MBrnn.S_GAME_END, this.onGameEnd, this);
        AppGame.ins.brnnModel.on(MBrnn.TO_BACK_CLEAR, this.toBackClear, this);
        AppGame.ins.brnnModel.on(MBrnn.GAMESCENE_STATUS_END, this.onGameSceneStatusEnd, this);
    }

    getRandomNum(Min, Max) {
        let Range = Number(Max) - Number(Min);
        let Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }

    //更新庄家信息
    updateInfo() {
        if (AppGame.ins.bankerInfo != null) {
            if (AppGame.ins.bankerBurrent == null) {//系统庄家
                // this.systemBanker.active=true;
                // this.palyBanker.active=false;
                // // UResManager.load(this.getRandomNum(0,19), EIconType.Head, this.head);
                // UResManager.load(1, EIconType.Head, this.head);
                // UResManager.load(1, EIconType.Frame, this.headframe);
                // this.goldLabel.string=1000000+"";
                // this.bankerButton.spriteFrame=this.bankerFrame[0];
                // this.LZNumber.string="N/A";
            }
            else {//玩家庄家
                this.systemBanker.active = false;
                this.palyBanker.active = true;
                UResManager.load(AppGame.ins.bankerBurrent.banker.headerId, EIconType.Head, this.head, AppGame.ins.bankerBurrent.banker.headImgUrl);
                UResManager.load(AppGame.ins.bankerBurrent.banker.headboxId, EIconType.Frame, this.headframe);
                this.bankerID.string = AppGame.ins.currRoomKind == ERoomKind.Normal ? AppGame.ins.bankerBurrent.banker.userId : AppGame.ins.bankerBurrent.banker.nickName;
                this.LZNumber.string = AppGame.ins.bankerBurrent.bankerTimes + "/8";
                this.goldLabel.string = UStringHelper.formatPlayerCoin(AppGame.ins.bankerBurrent.banker.score / 100);
                if (AppGame.ins.bankerBurrent.banker.userId == AppGame.ins.roleModel.useId) {
                    this.bankerButton.spriteFrame = this.bankerFrame[1];
                }
                else {
                    this.bankerButton.spriteFrame = this.bankerFrame[0];
                }
            }
            this.bankerNeed.string = (AppGame.ins.bankerInfo.applyBankerCondition / 100) + "";//上庄需要 value
            this.bankerNum.string = AppGame.ins.bankerApply.length + "";//排队人数 value

            if (AppGame.ins.bankerInfo.bEnableUserBanker) {//玩家可以坐庄
                this.bankerBT.interactable = true;
            }
            else {//玩家不可以坐庄
                this.bankerBT.interactable = false;
                if (AppGame.ins.bankerBurrent != null) {
                    if (AppGame.ins.bankerBurrent.banker.userId == AppGame.ins.roleModel.useId) {
                        this.bankerBT.interactable = true;
                    }
                }
            }
        }
        else {
            // this.systemBanker.active = true;
            // this.palyBanker.active = false;
            // // UResManager.load(this.getRandomNum(0,19), EIconType.Head, this.head);
            // UResManager.load(1, EIconType.Head, this.head);
            // UResManager.load(1, EIconType.Frame, this.headframe);
            // this.goldLabel.string = 1000000 + "";
            // this.bankerButton.spriteFrame = this.bankerFrame[0];
            // this.LZNumber.string="N/A";
        }
    }

    // 申请上庄成功
    bankerSucceed(data: Brnn.CMD_S_ApplyBanker) {
        this.bankerNum.string = data.applyBankerInfo.length + "";
    }

    // 申请上庄失败
    bankerFail(data: Brnn.CMD_S_ApplyBankerFail) {

    }

    // 取消申请排队成功
    cancelSucceed(data: Brnn.CMD_S_CancelBanker) {
        this.bankerNum.string = data.applyBankerInfo.length + "";
    }

    // 取消申请排队失败
    cancelFail(data: Brnn.CMD_S_CancelBankerFail) {

    }

    // 申请下庄成功
    downBankerSucceed(data: Brnn.CMD_CS_GetOffBanker) {

    }

    // 申请下庄失败
    downBankerFail(data: Brnn.CMD_S_GetOffBankerFail) {

    }
    // 切换庄家
    changeBanke2() {
        if (MRole.bankerBool == true) {
            this.toggle_container.active = false;
        }
    }
    // 切换庄家
    changeBanke(data: Brnn.CMD_S_ChangeBanker) {
        if (data.currentBankerInfo != null) {
            if (data.currentBankerInfo.banker.userId == AppGame.ins.roleModel.useId) {
                MRole.bankerBool = true;//庄家是自己
                this.toggle_container.active = false;
            }
            else {
                MRole.bankerBool = false;//庄家是别人
                this.toggle_container.active = true;
                this.resButton();
            }
        }
        else {
            MRole.bankerBool = false;//庄家是别人
            this.toggle_container.active = true;
            this.resButton();
        }
        this.bankerNum.string = data.applyBankerInfo.length + "";
        this.bankerFamer();
    }
    resButton() {
        AppGame.ins.brnnModel.emit(MRole.UPDATEBUTTON);
    }

    //前后台切换清理
    toBackClear() {
        if (VBrnnScene.game_status != GAME_STATUS.LH_GAME_STOP) {
            this.tip_score.active = false;
            this.tip_score.stopAllActions();
        }
    }
    onGameSceneStatusEnd(data: Brnn.CMD_Scene_StatusEnd) {
        this.onGameEnd(data, true);
    };
    onGameEnd(data: Brnn.CMD_S_GameEnd, isReconnection: boolean = false) {
        if (!VBrnnScene.is_init) {
            if (VBrnnScene.initEnterGameData) {//中途进入

            } else {
                return
            }
        }
        if (data.deskData.bankerInfo.currentBankerInfo != null) {
            let score = Number(data.deskData.bankerInfo.currentBankerInfo.bankerWinScore) / 100;
            let tempScore = (score).toFixed(2);
            let str_score = tempScore;
            let sp_win = UNodeHelper.find(this.tip_score, 'sp_win');
            let sp_lose = UNodeHelper.find(this.tip_score, 'sp_lose');
            let lab_win = UNodeHelper.getComponent(this.tip_score, 'lab_win', cc.Label);
            let lab_lose = UNodeHelper.getComponent(this.tip_score, 'lab_lose', cc.Label);

            if (score > 0) {
                sp_win.active = true;
                lab_win.node.active = true;
                sp_lose.active = false;
                lab_lose.node.active = false;

                str_score = '+' + str_score;
                lab_win.string = str_score;
            }
            else {
                sp_win.active = false;
                lab_win.node.active = false;
                sp_lose.active = true;
                lab_lose.node.active = true;
                lab_lose.string = str_score;
            }
            this.tip_score.active = true;
            this.tip_score.setPosition(this._tip_score_pos);
            this.tip_score.opacity = 0;
            this.tip_score.stopAllActions();
            if (data.timeLeave >= 3 && VBrnnScene.game_status == GAME_STATUS.LH_GAME_END) {
                let delayTime = data.timeLeave >= 3 ? 3 : 1;
                let delayTime2 = 2;
                if (VBrnnScene.initEnterGameData) {
                    // delayTime = (data.timeLeave - 3) > 0.1 ? data.timeLeave - 3 : 0.1;
                }
                this.tip_score.runAction(cc.sequence(cc.delayTime(delayTime), cc.fadeIn(0.1),
                    cc.callFunc(() => {
                        VBrnnScene.initEnterGameData = false;
                        if (score > 0)
                            this.showWinSpine();
                    }),
                    cc.moveBy(0.5, 0, 50), cc.delayTime(isReconnection ? 0.5 : delayTime2), cc.fadeOut(0.1)));
            }
        }
    }

    showWinSpine() {
        if (this.bankerWin) {
            this.bankerWin.node.active = true;
            this.bankerWin.setAnimation(0, 'animation', false);
        }
    }

    bankerFamer() {
        this.bankerWin.node.active = true;
        this.bankerWin.paused = true;
        this.bankerWin.setAnimation(0, 'animation', false);
        this.bankerWin.paused = false;
    }

    //点击上庄、下庄
    onClickVillage(event, customEventData) {
        if (event.target.getComponent(cc.Sprite).spriteFrame.name != "brnn_shangzhuangbtn_yellow") {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 3, data: "您确定要下庄吗？", handler: UHandler.create((a) => {
                    if (a) {
                        AppGame.ins.brnnModel.downBanker();//申请下庄
                        AppGame.ins.showTips({ data: "申请下庄成功,请耐心等待这局结束!", type: ETipType.onlyone });
                    }
                }, this)
            });
        }
        else {
            AppGame.ins.showUI(ECommonUI.LB_Village);
        }
    }

    protected onDisable(): void {
        AppGame.ins.brnnModel.off(MRole.BANKERINFO, this.updateInfo, this);//更新上庄列表信息
        AppGame.ins.brnnModel.off(MRole.S_BANKERSUCCEED, this.bankerSucceed, this);//上庄成功事件
        AppGame.ins.brnnModel.off(MRole.S_BANKERFAILL, this.bankerFail, this);//上庄失败事件
        AppGame.ins.brnnModel.off(MRole.S_CANCELSUCCEED, this.cancelSucceed, this);//取消成功
        AppGame.ins.brnnModel.off(MRole.S_CANCELFAILL, this.cancelFail, this);//取消失败
        AppGame.ins.brnnModel.off(MRole.S_DOWNSUCCEED, this.downBankerSucceed, this);//下庄成功
        AppGame.ins.brnnModel.off(MRole.S_DOWNERFAILL, this.downBankerFail, this);//下庄失败
        AppGame.ins.brnnModel.off(MRole.S_CHANGEBANKER, this.changeBanke, this);//切换庄家
        AppGame.ins.brnnModel.off(MRole.S_CHANGEBANKER2, this.changeBanke2, this);//切换庄家
        AppGame.ins.brnnModel.off(MBrnn.S_GAME_END, this.onGameEnd, this);
        AppGame.ins.brnnModel.off(MBrnn.TO_BACK_CLEAR, this.toBackClear, this);
        AppGame.ins.brnnModel.off(MBrnn.GAMESCENE_STATUS_END, this.onGameSceneStatusEnd, this);
    }
}
