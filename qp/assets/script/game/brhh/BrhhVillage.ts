import { ECommonUI, EIconType, ERoomKind, ETipType, } from "../../common/base/UAllenum";
import UResManager from "../../common/base/UResManager";
import { HongHei } from "../../common/cmd/proto";
import UDebug from "../../common/utility/UDebug";
import UHandler from "../../common/utility/UHandler";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UStringHelper from "../../common/utility/UStringHelper";
import AppGame from "../../public/base/AppGame";
import AppStatus from "../../public/base/AppStatus";
import MRole from "../../public/hall/lobby/MRole";
import MBrhh from "./model/MBrhh";
import VBrhhScene from "./VBrhhScene";

const { ccclass, property } = cc._decorator;
enum GAME_STATUS {
    LH_GAME_START = 1,   // 开始下注
    LH_GAME_STOP = 2,       // 停止下注
    LH_GAME_FREE = 3,  // 开始开牌
    LH_GAME_START_TIPS = 4,   // 开始时间快结束了
}
@ccclass
export default class BrhhVillage extends cc.Component {

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
    @property({ type: VBrhhScene })
    brhh_scene: VBrhhScene = null;
    private _tip_score_pos = cc.v2(-430, -15);
    bankerBT: cc.Button = null;
    _leave_time = 0;   // 状态倒计时
    _gameStatus = GAME_STATUS.LH_GAME_START;

    onLoad() {
        this.bankerBT = this.bankerButton.node.getComponent(cc.Button);
    }

    onEnable() {
        AppGame.ins.brhhModel.on(MRole.BANKERINFO, this.updateInfo, this);//更新排队信息
        AppGame.ins.brhhModel.on(MRole.S_BANKERSUCCEED, this.bankerSucceed, this);//申请庄家成功
        AppGame.ins.brhhModel.on(MRole.S_BANKERFAILL, this.bankerFail, this);//申请庄家失败
        AppGame.ins.brhhModel.on(MRole.S_CANCELSUCCEED, this.cancelSucceed, this);//取消成功
        AppGame.ins.brhhModel.on(MRole.S_CANCELFAILL, this.cancelFail, this);//取消失败
        AppGame.ins.brhhModel.on(MRole.S_DOWNSUCCEED, this.downBankerSucceed, this);//下庄成功
        AppGame.ins.brhhModel.on(MRole.S_DOWNERFAILL, this.downBankerFail, this);//下庄失败
        AppGame.ins.brhhModel.on(MRole.S_CHANGEBANKER, this.changeBanke, this);//切换庄家
        AppGame.ins.brhhModel.on(MBrhh.S_GAME_END, this.onGameEnd, this);
        AppGame.ins.brhhModel.on(MBrhh.S_START_PLACE_JETTON, this.onStartPlaceJetton, this);
        AppGame.ins.brhhModel.on(MBrhh.S_GAME_START, this.onGameStart, this);
        AppGame.ins.brhhModel.on(MBrhh.S_SYNC_TIME, this.onSyncTime, this);
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.brhhModel.on(MBrhh.S_GAME_END_SCENE, this.onGameSceneEnd, this);


    }

    update(dt: number) {
        if (this._leave_time > 0) {
            this._leave_time -= dt;
            if (this._leave_time < 0) {
                this._leave_time = 0;
            }
        }
    }

    /**
  * 游戏切换到后台
  * @param isHide 是否切在后台
  */
    onGameToBack(isBack: boolean) {
        if (!isBack) {
            this.tip_score.stopAllActions();
        }
    }

    //更新庄家信息
    updateInfo(data: any, delaySeconds: number = 0) {
        if (AppGame.ins.bankerInfo != null) {
            if (AppGame.ins.bankerBurrent == null) {//系统庄家
                // this.systemBanker.active=true;
                // this.palyBanker.active=false;
                // UResManager.load(1, EIconType.Head, this.head);
                // UResManager.load(1, EIconType.Frame, this.headframe);
                // this.goldLabel.string=1000000+"";
                this.bankerButton.spriteFrame = this.bankerFrame[0];
                this.LZNumber.string = "N/A";
            }
            else {//玩家庄家
                this.systemBanker.active = false;
                this.palyBanker.active = true;
                UResManager.load(AppGame.ins.bankerBurrent.banker.headerId, EIconType.Head, this.head, AppGame.ins.bankerBurrent.banker.headImgUrl);
                UResManager.load(AppGame.ins.bankerBurrent.banker.headboxId, EIconType.Frame, this.headframe);
                this.bankerID.string = AppGame.ins.currRoomKind == ERoomKind.Normal ? AppGame.ins.bankerBurrent.banker.userId : AppGame.ins.bankerBurrent.banker.nickName;
                this.LZNumber.string = AppGame.ins.bankerBurrent.bankerTimes + "/8";
                this.scheduleOnce(() => {
                    if (AppGame.ins.bankerBurrent && AppGame.ins.bankerBurrent.hasOwnProperty('banker')) {
                        this.goldLabel.string = UStringHelper.formatPlayerCoin(AppGame.ins.bankerBurrent.banker.score / 100);
                    }
                }, delaySeconds)
                if (AppGame.ins.bankerBurrent.banker.userId == AppGame.ins.roleModel.useId) {
                    this.bankerButton.spriteFrame = this.bankerFrame[1];
                    this.toggle_container.active = false;
                }
                else {
                    this.toggle_container.active = true;
                    this.bankerButton.spriteFrame = this.bankerFrame[0];
                }
            }
            this.bankerNeed.string = (AppGame.ins.bankerInfo.applyBankerCondition / 100).toString();
            this.bankerNum.string = AppGame.ins.bankerApply.length + "";

            if (AppGame.ins.bankerInfo.bEnableUserBanker) {//玩家可以坐庄
                this.bankerBT.interactable = true;
            }
            else {//玩家不可以坐庄
                this.bankerBT.interactable = false;
                if (AppGame.ins.bankerBurrent != null) {
                    if (AppGame.ins.bankerBurrent.banker.userId == AppGame.ins.roleModel.useId) {
                        this.bankerBT.interactable = true;
                        this.toggle_container.active = false;
                    } else {
                        this.toggle_container.active = true;
                    }
                }
            }
        }
        else {
            // this.systemBanker.active = true;
            // this.palyBanker.active = false;
            // UResManager.load(1, EIconType.Head, this.head);
            // UResManager.load(1, EIconType.Frame, this.headframe);
            // this.goldLabel.string = 1000000 + "";
            this.bankerButton.spriteFrame = this.bankerFrame[0];
            this.LZNumber.string = "N/A";
        }
    }

    // 申请上庄成功
    bankerSucceed(data: HongHei.CMD_S_ApplyBanker) {
        this.bankerNum.string = data.applyBankerInfo.length + "";
    }

    // 申请上庄失败
    bankerFail(data: HongHei.CMD_S_ApplyBankerFail) {

    }

    // 取消申请排队成功
    cancelSucceed(data: HongHei.CMD_S_CancelBanker) {
        this.bankerNum.string = data.applyBankerInfo.length + "";
    }

    // 取消申请排队失败
    cancelFail(data: HongHei.CMD_S_CancelBankerFail) {

    }

    // 申请下庄成功
    downBankerSucceed(data: HongHei.CMD_CS_GetOffBanker) {

    }

    // 申请下庄失败
    downBankerFail(data: HongHei.CMD_S_GetOffBankerFail) {

    }

    // 切换庄家
    changeBanke(data: HongHei.CMD_S_ChangeBanker) {
        if (data.currentBankerInfo != null) {
            if (data.currentBankerInfo.banker.userId == AppGame.ins.roleModel.useId) {
                MRole.bankerBool = true;//庄家是自己
                this.toggle_container.active = false;
            }
            else {
                MRole.bankerBool = false;//庄家是别人
                this.toggle_container.active = true;
            }
        }
        else {
            MRole.bankerBool = false;//庄家是别人
            this.toggle_container.active = true;
        }
        this.bankerNum.string = data.applyBankerInfo.length + "";
        this.bankerFamer();
    }

    onStartPlaceJetton(data: HongHei.CMD_S_StartPlaceJetton) {
        this.tip_score.stopAllActions();
        this.tip_score.active = false;
        this._leave_time = data.timeLeave;
        this._gameStatus = GAME_STATUS.LH_GAME_START;

    }

    onSyncTime(data: HongHei.CMD_S_SyncTime_Res) {
        this._leave_time = data.timeLeave;
    }

    /** 游戏开始 */
    onGameStart(data: HongHei.CMD_S_GameStart) {
        this.tip_score.stopAllActions();
        this.tip_score.active = false;
        this._leave_time = data.timeLeave;
        this._gameStatus = GAME_STATUS.LH_GAME_START;
    }

    onGameSceneEnd(data: HongHei.CMD_Scene_StatusEnd) {
        this.tip_score.stopAllActions();
        this.tip_score.active = false;
        this.onGameEnd(data);
    }

    onGameEnd(data: HongHei.CMD_S_GameEnd) {
        this._gameStatus = GAME_STATUS.LH_GAME_STOP;
        this._leave_time = data.timeLeave;
        if (data.deskData.bankerInfo.currentBankerInfo != null) {
            let tempScore = data.deskData.bankerInfo.currentBankerInfo.bankerWinScore / 100;
            let str_score = UStringHelper.getMoneyFormat(tempScore).toString();
            let sp_win = UNodeHelper.find(this.tip_score, 'sp_win');
            let sp_lose = UNodeHelper.find(this.tip_score, 'sp_lose');
            let lab_win = UNodeHelper.getComponent(this.tip_score, 'lab_win', cc.Label);
            let lab_lose = UNodeHelper.getComponent(this.tip_score, 'lab_lose', cc.Label);

            if (tempScore > 0) {
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
            if (this._leave_time <= 2.5 || this._gameStatus != GAME_STATUS.LH_GAME_STOP) return;
            this.tip_score.runAction(cc.sequence(cc.delayTime(data.timeLeave - 3 < 0?0:(data.timeLeave - 3)), cc.fadeIn(0.1),
                cc.callFunc(() => {
                    if(this._gameStatus != GAME_STATUS.LH_GAME_STOP) {
                        this.tip_score.active = false;
                        if (tempScore > 0)
                            this.showWinSpine();
                    }
                }),
                cc.moveBy(0.5, 0, 30), cc.delayTime(2.0), cc.fadeOut(0.1)));
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
        VBrhhScene.ins._music_mgr.playClick();
        if (event.target.getComponent(cc.Sprite).spriteFrame.name != "shangzhuangAN2") {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 3, data: "您确定要下庄吗？", handler: UHandler.create((a) => {
                    if (a) {
                        AppGame.ins.brhhModel.downBanker();//申请下庄
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
        AppGame.ins.brhhModel.off(MRole.BANKERINFO, this.updateInfo, this);//更新上庄列表信息
        AppGame.ins.brhhModel.off(MRole.S_BANKERSUCCEED, this.bankerSucceed, this);//上庄成功事件
        AppGame.ins.brhhModel.off(MRole.S_BANKERFAILL, this.bankerFail, this);//上庄失败事件
        AppGame.ins.brhhModel.off(MRole.S_CANCELSUCCEED, this.cancelSucceed, this);//取消成功
        AppGame.ins.brhhModel.off(MRole.S_CANCELFAILL, this.cancelFail, this);//取消失败
        AppGame.ins.brhhModel.off(MRole.S_DOWNSUCCEED, this.downBankerSucceed, this);//下庄成功
        AppGame.ins.brhhModel.off(MRole.S_DOWNERFAILL, this.downBankerFail, this);//下庄失败
        AppGame.ins.brhhModel.off(MRole.S_CHANGEBANKER, this.changeBanke, this);//切换庄家
        AppGame.ins.brhhModel.on(MBrhh.S_GAME_END, this.onGameEnd, this);
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.brhhModel.off(MBrhh.S_START_PLACE_JETTON, this.onStartPlaceJetton, this);
        AppGame.ins.brhhModel.off(MBrhh.S_GAME_START, this.onGameStart, this);
        AppGame.ins.brhhModel.off(MBrhh.S_SYNC_TIME, this.onSyncTime, this);
        AppGame.ins.brhhModel.off(MBrhh.S_GAME_END_SCENE, this.onGameSceneEnd, this);
        AppGame.ins.bankerInfo = null;
        AppGame.ins.bankerBurrent = null;
    }
}
