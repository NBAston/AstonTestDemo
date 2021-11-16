import UGame from "../../public/base/UGame";
import USpriteFrames from "../../common/base/USpriteFrames";
import MBaseGameModel from "../../public/hall/MBaseGameModel";
import VTBNNMatch_hy from "./VTBNNMatch_hy";
import UTBNNHelper_hy, { UTBNNCmd, ETBNNState } from "./UTBNNHelper_hy";
import VTBNNMenu_hy from "./VTBNNMenu_hy";
import UTBNNMusic_hy from "./UTBNNMusic_hy";
import VFyxbdNode from "../common/VFyxbdNode";
import AppGame from "../../public/base/AppGame";
import UNodeHelper from "../../common/utility/UNodeHelper";
import MTBNNModel_hy from "./model/MTBNNModel_hy";
import ULocalStorage from "../../common/utility/ULocalStorage";
import { ToBattle } from "../../common/base/UAllClass";
import ULanHelper from "../../common/utility/ULanHelper";
import { EEnterRoomErrCode, ECommonUI, ELevelType, EGameType, ETipType, EAgentLevelReqType } from "../../common/base/UAllenum";
import UHandler from "../../common/utility/UHandler";
import UDebug from "../../common/utility/UDebug";
import { FTbnn } from "../../common/cmd/proto";
import UEventHandler from "../../common/utility/UEventHandler";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import MHall, { NEWS } from "../../public/hall/lobby/MHall";
import UStringHelper from "../../common/utility/UStringHelper";
import { ZJH_SCALE } from "../zjh/MZJH";
import VTBNNExtendNode_hy from "./VTBNNExtendNode_hy";
import AppStatus from "../../public/base/AppStatus";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UTBNNScene_hy extends UGame {//UScene {

    /**单例 */
    private static _ins: UTBNNScene_hy;
    static get ins(): UTBNNScene_hy {
        return UTBNNScene_hy._ins;
    }
    /**图片资源 */
    private _res: USpriteFrames = null;

    baseGameModel: MBaseGameModel = null;
    /** 是否可以取命令*/
    private _canGetCmd: boolean;
    /**匹配界面 */
    private _match: VTBNNMatch_hy;
    /**提示label */
    private _tip: cc.Label;

    /**命令队列 */
    private _cmds: Array<UTBNNCmd>;
    /**底注label */
    private _dizhu: cc.Label;
    /**房号label */
    private _roomIdLab: cc.Label;
    /**房号Node */
    private _roomIdNode: cc.Node;
    /**底注背景 */
    // private _dizhubg: cc.Node;
    /**菜单节点 */
    private _menuNode: cc.Node;
    /** 菜单 */
    private _menu: VTBNNMenu_hy;
    /**牌局编号 */
    private _label_gameid: cc.Label;
    /**牌局编号背景 */
    private qznn_pjbg: cc.Node;
    private _charge_btn: cc.Node;
    private _enterMinScore: number;

    /**
     * 音乐播放器
     */
    private _music: UTBNNMusic_hy;
    get getMusic(): UTBNNMusic_hy {
        return this._music;
    }
    /**自己的分数 */
    private _myScore: number = 0;
    get myScore(): number {
        return this._myScore;
    }
    /**临时存储的倒计时时间 */
    private _tmp_time: number = 0;
    /**防以小博大 */
    private _fyxbd_panel: VFyxbdNode;
    /**重连不在游戏房间内 */
    fromeDisconnect: boolean = false;
    /** 新增扩展 */
    extend: VTBNNExtendNode_hy;

    protected init(): void {
        UTBNNScene_hy._ins = this;
        this._cmds = [];
        this._canGetCmd = true;

        this._res = this.node.getComponent("USpriteFrames");
        this.baseGameModel = AppGame.ins.gamebaseModel;

        let root = UNodeHelper.find(this.node, "uiroot");
        //匹配界面
        this._match = UNodeHelper.getComponent(root, "match_node", VTBNNMatch_hy);
        this._match.init();
        this.setMatch(false);

        //扩展节点
        this.extend = UNodeHelper.getComponent(root, "extendNode", VTBNNExtendNode_hy);
        this.extend.init();

        //请等待xxx 那些提示
        this._tip = UNodeHelper.getComponent(root, "mainContent/tip/label_tip", cc.Label);
        //声音资源
        // let audioRes = this.node.getComponent(UAudioRes);
        this._music = new UTBNNMusic_hy();//audioRes
        //底注
        this._dizhu = UNodeHelper.getComponent(root, "mainContent/label_dizhu", cc.Label);
        // this._dizhubg = UNodeHelper.find(root, "mainContent/dizhu_bg");

        //房号
        this._roomIdNode = UNodeHelper.find(root, "mainContent/qznn_fanghao");
        this._roomIdLab = UNodeHelper.getComponent(root, "mainContent/qznn_fanghao/label_fanghao", cc.Label);

        this._menuNode = UNodeHelper.find(root, "menu"); // /menu_node
        let btnMenu = UNodeHelper.find(root, "mainContent/qznn_menu");
        this._menu = new VTBNNMenu_hy(btnMenu, this._menuNode);
        this._menu.setOn(false);

        this._label_gameid = UNodeHelper.getComponent(root, "mainContent/qznn_pjbg/label_gameID", cc.Label);
        this._label_gameid.node.active = false;

        this.qznn_pjbg = UNodeHelper.find(root, "mainContent/qznn_pjbg");
        this.qznn_pjbg.active = false;
        this._charge_btn = UNodeHelper.find(root, "playersNode/seat0/charge_btn");

        UEventHandler.addClick(this.qznn_pjbg, this.node, "UTBNNScene_hy", "oncopy");
        UEventHandler.addClick(this._roomIdNode, this.node, "UTBNNScene_hy", "onCopyRoomId");
        UEventHandler.addClick(this._charge_btn, this.node, "UTBNNScene_hy", "intoCharge");

        this.setHorseLampPos(35, 300);

        this.fromeDisconnect = false;
    }

    /**设置充值按钮显示 */
    setRechargeShow(data: any) {
        this._charge_btn.active = (data.roomInfo && data.roomInfo.roomUserId == AppGame.ins.roleModel.useId) ? true : false;
    }

    /**
     * 场景被打开 
     * @param data 
     *//**sq 修改 需要是否是断线重连进来的 data:ToBattle */
    openScene(data: any): void {
        UDebug.log('openScene => ', data)
        super.openScene(data);
        this._enterMinScore = data.roomData.enterMinScore;
        // let list = AppGame.ins.hallModel.getGameList();
        // this._gamelist.intGameList(list);

        // cc.log(this.atlas);

        var roleinfo = {
            touxiang: null,
            nickname: null,
            coin: null,
            userid: null
        };
        roleinfo.touxiang = AppGame.ins.roleModel.headId;
        roleinfo.nickname = AppGame.ins.roleModel.nickName;
        roleinfo.coin = AppGame.ins.roleModel.score;
        roleinfo.userid = AppGame.ins.roleModel.useId;

        MTBNNModel_hy.ins.setPlayerInfo(roleinfo);

        // cc.log(MTBNNModel_hy.ins.getPlayerInfo());
        // this.getRoomPlayers();

        if (data) {
            let dt = data as ToBattle;
            MTBNNModel_hy.ins.saveRoomInfo(dt.roomData);
            if (dt) {
                MTBNNModel_hy.ins.currentDizhu = dt.roomData.floorScore;

                if (!dt.fromReconnet) {
                    this.waitbattle();
                    // this.delayTimerToMatch();
                }
                else {
                    MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_RESET_SCENE);
                    this.showgameinfo(false);
                }
            }

            this.setRoomId(dt.roomData.roomId);
            this._canGetCmd = true;
        }

        this.setLabelTip(false);
        this._music.playGamebg();
    }

    /**设置房号 */
    private setRoomId(roomId: number) {
        this._roomIdLab.string = '' + (roomId ? roomId : '');
    }

    private onMoveNextCmd() {
        this._canGetCmd = true;
    }
    /**播放点击 */
    playClick() {
        this._music.playClick();
    }
    playTongsha() {
        this._music.playTongsha();
    }
    playTongpei() {
        this._music.playTongpei();
    }
    playWin() {
        this._music.playWin();
    }

    // start() {
    // onLoad() {
    //     this.addEvent();
    // }

    onEnable() {
        super.onEnable();
        this.addEvent();
    }

    onDisable() {
        super.onDisable();
        this.removeEvent();

        this._music.stop();
    }
    // onDestroy() {
    //     this.removeEvent();
    // }

    private addEvent() {
        AppGame.ins.hallModel.on(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAME_START, this.onGameStart, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_CALL_BANKER, this.onCallBanker, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_SEND_CARD, this.onSendCard, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_OPEN_CARD_RESULT, this.onOpenCardResult, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAME_END, this.onGameEnd, this);

        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_FREE, this.onGameSceneFree, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_CALL, this.onGameSceneCall, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_SCORE, this.onGameSceneScore, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_OPEN, this.onGameSceneOpen, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_END, this.onGameSceneEnd, this);


        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_MOVE_NEXT_CMD, this.onMoveNextCmd, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_UPDATE_ROOMID, this.onUpdateRoomId, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_START_ANI_COMPLETE, this.onStartAniComplete, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_FAPAI_COMPLETE, this.onFaPaiAniComplete, this);


        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_TS_START_MATCH, this.sc_ts_start_match, this);
        // MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_TS_SHOW_MATCH, this.sc_ts_show_match, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_TS_CANCLE_MATCH, this.set_cancel_match, this);

        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_HOST_AGAIN, this.onUpdateRoomInfo, this);

        MTBNNModel_hy.ins.run();

        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);

    }
    private removeEvent() {
        AppGame.ins.hallModel.off(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAME_START, this.onGameStart, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_CALL_BANKER, this.onCallBanker, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_SEND_CARD, this.onSendCard, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_OPEN_CARD_RESULT, this.onOpenCardResult, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAME_END, this.onGameEnd, this);

        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_FREE, this.onGameSceneFree, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_CALL, this.onGameSceneCall, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_SCORE, this.onGameSceneScore, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_OPEN, this.onGameSceneOpen, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_EVENT.TBNN_GAMESCENE_END, this.onGameSceneEnd, this);

        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_MOVE_NEXT_CMD, this.onMoveNextCmd, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_UPDATE_ROOMID, this.onUpdateRoomId, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_START_ANI_COMPLETE, this.onStartAniComplete, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_FAPAI_COMPLETE, this.onFaPaiAniComplete, this);


        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_TS_START_MATCH, this.sc_ts_start_match, this);
        // MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_TS_SHOW_MATCH, this.sc_ts_show_match, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_TS_CANCLE_MATCH, this.set_cancel_match, this);

        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_HOST_AGAIN, this.onUpdateRoomInfo, this);

        MTBNNModel_hy.ins.exit();

        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);

    }

    /**
     * 游戏切换到后台
     * @param isHide 是否切在后台
     */
    onGameToBack(isBack: boolean) {
        if (!isBack) {
            this._cmds = [];
            this._canGetCmd = false;
        }
    }

    /**获取到代理等级 */
    onAgentLevelRes(data: any) {
        let tag = AppGame.ins.hallModel.reqAgentLevelType == EAgentLevelReqType.default;
        if (!data || data.retCode != 0 || !data.hasOwnProperty('level')) {
            tag && AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: false, index: 3 });
            return;
        }
        if (data.level < 5) {
            tag && AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: false, index: 3 });
        } else {
            tag && AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: false, index: 2 });
        }
    }

    //点击复制牌局信息
    private oncopy(): void {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this._label_gameid.string).substr(5, 30));
    }

    /**复制房号 */
    private onCopyRoomId() {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this._roomIdLab.string).substr(3));
    }

    private intoCharge(): void {
        AppGame.ins.hallModel.requestAgentLevel();
    }

    /**更新房间信息 */
    onUpdateRoomInfo(data: any) {
        this.setRoomId(data.roomInfo.roomId);
    }

    /**
     * 重写 获取牌的图片
     * @param name 
     */
    getSpriteFrame(name: string): cc.SpriteFrame {
        return this._res.getFrames(name);
    }

    /*******************  **************************/
    /** 等待游戏开始*/
    waitbattle(): void {

        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_RESET_SCENE);
        // this.setDiZhu(null, false);

        this.showgameinfo(false);
        // this.setMatch(true);
    }

    /**延时显示匹配 第一次进 not use*/
    delayTimerToMatch() {
        this.node.stopAllActions();

        this.node.runAction(
            cc.sequence(cc.delayTime(0.5),
                cc.callFunc(() => {
                    this.waitbattle();
                }, this))
        );

    }

    private onUpdateRoomId(roomId: any) {
        if (this._label_gameid && roomId != null) {
            this._label_gameid.node.active = true;
            this.qznn_pjbg.active = true;
            this._label_gameid.string = ULanHelper.GAME_NUMBER + roomId;
        }
    }

    /**显示游戏信息 底注那些 */
    private showgameinfo(value: boolean): void {
        // this._dingzhu.node.active = value;
        // this._dizhu.node.active = value;
        this._label_gameid.node.active = value;
        this.qznn_pjbg.active = value;
        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_GAMEINFO_ACTIVE, value);
    }

    /**进入房间失败 */
    protected enter_room_fail(errorCode: number, errorMsg?: any): void {
        super.enter_room_fail(errorCode, errorMsg);
        return
        let self = this;
        if (errorMsg != null) {
            // AppGame.ins.showTips(errorMsg);
            UDebug.log("进入房间失败" + errorMsg + errorCode);
        }
        switch (errorCode) {
            case EEnterRoomErrCode.ERROR_ENTERROOM_GAME_IS_END:
                // AppGame.ins.showUI(ECommonUI.MsgBox, {
                //     type: 1, data: ULanHelper.BATTLE_OVER, handler: UHandler.create(() => {
                //         this.waitbattle();
                //         MTBNNModel_hy.ins.requestMatch();
                //     }, this)
                // });
                this.reconnect_in_game_but_no_in_gaming();
                break;
            case EEnterRoomErrCode.ERROR_ENTERROOM_SEAT_FULL:
            case EEnterRoomErrCode.ERROR_ENTERROOM_TABLE_FULL:
                {
                    this.setMatch(false);
                    AppGame.ins.showTips({ data: "房间桌子已满，请您稍后再试！", type: ETipType.repeat });
                    // this._opreate.showMatch();
                    MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_RESET_SCENE);
                    MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_CONTINUE_ACTIVE, true);

                }
                break;
            case EEnterRoomErrCode.ERROR_ENTERROOM_LONGTIME_NOOP:
                {
                    let msg = ULanHelper.ENTERROOM_ERROR[errorCode];
                    if (!msg) {
                        msg = ULanHelper.GAME_INFO_ERRO;
                    }
                    this.scheduleOnce(() => {
                        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                            type: 1, data: msg, handler: UHandler.create(() => {
                                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.TBNN_HY);
                            }, this)
                        });
                    }, 4);
                }
                break;
            case EEnterRoomErrCode.ERROR_ENTERROOM_SCORENOENOUGH:
                {
                    AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                        type: 1, data: ULanHelper.PLAYER_FENSHU_BUZU, handler: UHandler.create(() => {
                            AppGame.ins.loadLevel(ELevelType.Hall, EGameType.TBNN_HY);
                        }, this)
                    });

                }
                break;
            case EEnterRoomErrCode.ERROR_ENTERROOM_STOP_CUR_USER:
                {
                    AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                        type: 1, data: ULanHelper.ACCOUNT_STOP, handler: UHandler.create(() => {
                            AppGame.ins.loadLevel(ELevelType.Hall, EGameType.TBNN_HY);
                        }, this)
                    });

                }
                break;
            default:
                if (errorCode == 7) {
                    var msg = "您的金币不足，该房间需要" + self._enterMinScore * ZJH_SCALE + "金币以上才可以下注";
                } else {
                    var msg = ULanHelper.ENTERROOM_ERROR[errorCode];
                }
                if (!msg) {
                    msg = ULanHelper.ROOM_INFO_ERRO;
                }
                AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                    type: 1, data: msg, handler: UHandler.create(() => {
                        AppGame.ins.loadLevel(ELevelType.Hall, EGameType.TBNN_HY);
                    }, this)
                });
                break;


        }
    }

    /**取消 匹配 */
    private set_cancel_match(data: any): void {
        // UDebug.Log("set_cancel_match："+JSON.stringify(data));
        if (data == true) {
            MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_RESET_SCENE);

            MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_CONTINUE_ACTIVE, true);
            this.setMatch(false);

        } else {
            // this.setMatch(true);
        }
    }

    private do_no_in_game() {
        this.setLabelTip(false);

        this.fromeDisconnect = true;

        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_RESET_SCENE);
        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_CONTINUE_ACTIVE, true);
        this.setMatch(false);

        // this.waitbattle();
        // MTBNNModel_hy.ins.reconnectRequest();

        this._cmds = [];
        this._canGetCmd = true;

        MTBNNModel_hy.ins.setReconnectState(ETBNNState.Wait, true);
        UDebug.Log("reconnect_in_game_but_no_in_gaming");
    }

    /**重连 显示匹配 */
    protected reconnect_in_game_but_no_in_gaming(): void {
        super.reconnect_in_game_but_no_in_gaming();
        AppGame.ins.gamebaseModel.alreadExitGame();
        // var index = 1;
        if (!this._cmds) {
            // index = 0;
            this._cmds = [];
        }
        // let item = new UTBNNCmd();
        // item.cmd = "no_in_game";
        // item.data = 0;//随便传
        // item.needwait = true;
        // this._cmds.splice(index,0,item);

        this.setMatch(false);

        if (this._cmds.length <= 0) {
            this._canGetCmd = true;
        }

        this._cmds = [];
        this.pushcmd("no_in_game", 0, true);
    }

    /*****************************/
    //#region 场景还原相关
    /**
     * 设置底注显示
     * @param num 
     * @param b 
     */
    private setDiZhu(num?: number, b?: boolean) {
        // num = MTBNNModel_hy.ins.currentDizhu;
        // if (num != null) {
        //     this._dizhu.string = "底分: " + (num / 100).toString();
        // }
        // if (b != null) {
        //     this._dizhu.node.active = b;

        //     // this._dizhubg.active = b;
        // }
    }
    /**设置倒计时事件 */
    private setDjs(time: number) {

        UDebug.log("setDjs " + time.toString());
        if (time != null) {
            MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_DJS_EVENT, time);
        }
    }

    //#endregion

    /**************提示面板相关 */
    /**
     * 设置提示文字
     * @param b 是否显示
     * @param str 提示字样
     */
    setLabelTip(b: boolean, str?: string) {
        this._tip.node.parent.active = b;
        if (str != null) {
            this._tip.string = str;
        }
    }
    //#region 队列 cmd 相关
    /*************** 队列 cmd 相关 **********************/
    protected update(dt: number): void {
        while (this._canGetCmd && this._cmds.length > 0) {
            let cmd = this.getcmd();
            if (cmd) {
                this._canGetCmd = !cmd.needwait;
                this.docmd(cmd);
            } else {
                this._canGetCmd = true;
            }
        }
    }

    /**将命令压入等待处理队列 */
    protected pushcmd(cmd: string, dt: any, needwait: boolean): void {
        if (!this._cmds) this._cmds = [];
        let item = new UTBNNCmd();
        item.cmd = cmd;
        item.data = dt;
        item.needwait = needwait;
        this._cmds.push(item);
    }
    /**取命令 */
    protected getcmd(): UTBNNCmd {
        if (this._cmds.length > 0) {
            return this._cmds.shift();
        }
        return null;
    }
    private docmd(cmd: UTBNNCmd): void {
        switch (cmd.cmd) {
            case "game_start"://开始
                this.do_game_start(cmd.data);
                // this.do_call_banker_result(cmd.data);
                break;
            case "call_banker"://个人叫庄结果
                this.do_call_banker(cmd.data);
                break;
            case "call_banker_result"://叫庄结果
                // this.do_call_banker_result(cmd.data);
                break;
            case "xia_zhu"://下注结果
                this.do_xia_zhu(cmd.data);
                break;
            // case "seat_info"://座位信息
            //     this.seat_info(cmd.data);
            //     break;
            // case "player_score":
            //     this.player_score(cmd.data);
            //     break;

            // case "turn_time"://倒计时
            //     this.do_turn_time(cmd.data);
            //     break;
            case "game_end"://结算
                this.do_game_end(cmd.data);
                break;
            case "look_pai"://看牌
                this.do_look_pai(cmd.data);
                break;

            case "fapai"://发牌
                this.do_fapai(cmd.data);
                break;
            // case "show_match":
            //     this.do_show_match();
            //     break;
            case "start_match":
                this.do_start_match(cmd.data);
                break;

            case "no_send_card":
                this.do_no_send_card(cmd.data);
                break;

            case "no_in_game":
                this.do_no_in_game();
                break;

        }
        // this._canGetCmd = true;
    }
    //#endregion

    /******************** cmd event *************************/
    //#region cmd代码

    private setMatch(b: boolean) {
        if (this._match != null) {
            if (b) {
                this._match.show();
            } else {
                this._match.hide();
            }
        }
    }

    /************* scene *****************/
    onGameSceneFree(data: FTbnn.NN_MSG_GS_FREE, ishideContinue: boolean = false) {
        // var cbReadyTime = data.cbReadyTime;//准备时间
        // var cbJettonMultiple = data.cbJettonMultiple; //下注倍数 []
        // var cbCallBankerMultiple = data.cbCallBankerMultiple;//叫庄倍数 []
        // UDebug.log('空闲场景onGameSceneFree => ', data)
        this._cmds = [];
        this._canGetCmd = true;

        var dCellScore = data.cellScore || MTBNNModel_hy.ins.currentDizhu;//基础积分
        this.setLabelTip(false);
        this.setDiZhu(dCellScore, true);
        this.setRechargeShow(data);
        let isShow = (data.roomInfo && !data.roomInfo.bChatLimit) ? true : false;
        this.extend.showChat(isShow);
        // MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_RESET_SCENE);
        // if(!ishideContinue){
        //     MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_CONTINUE_ACTIVE, true);
        // }

        this.extend.setLookOnNextIsChecked(data.bLookon);
    }

    // 叫庄场景 ， not use
    onGameSceneCall(data: any) {
        this._cmds = [];
        this._canGetCmd = true;

        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_CONTINUE_ACTIVE, false);
        this.setMatch(false);

        var dCellScore = data.cellScore || MTBNNModel_hy.ins.currentDizhu;//基础积分
        this.setDiZhu(dCellScore, true);

        var sCallBanker = data.sCallBanker;//叫庄标志(-1:未叫; 0:不叫; 1:叫庄)[]
        var cbCallBankerMultiple = data.cbCallBankerMultiple;//叫庄倍数[]

        if (sCallBanker != null) { //&& cbCallBankerMultiple != null
            let count = sCallBanker.length;
            for (let i = 0; i < count; i++) {
                const callbanker = sCallBanker[i];

                if (callbanker >= 0) {
                    //注释掉叫庄结果
                    // let dt = new FTbnn.NN_CMD_S_CallBanker();
                    // dt.wCallBankerUser = i;
                    // dt.cbCallMultiple = callbanker;//cbCallBankerMultiple[i];
                    // this.onCallBanker(dt);
                }
            }
        }

        var cbTimeLeave = data.cbTimeLeave;//剩余时间 放在最后一个包上
        this.setDjs(cbTimeLeave);
        this.setRechargeShow(data);
        let isShow = (data.roomInfo && !data.roomInfo.bChatLimit) ? true : false;
        this.extend.showChat(isShow);

        this.extend.setLookOnNextIsChecked(data.bLookon);
    }

    onGameSceneScore(data: FTbnn.NN_MSG_GS_SCORE) {
        this._cmds = [];
        this._canGetCmd = true;

        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_CONTINUE_ACTIVE, false);
        this.setMatch(false);
        this.setLabelTip(false);
        var dCellScore = data.cellScore || MTBNNModel_hy.ins.currentDizhu;//基础积分
        this.setDiZhu(dCellScore, true);

        var cbTimeLeave = data.timeLeave;//剩余时间 放在最后一个包上

        var cbUserJettonMultiple = data.userJettonMultiple;	//闲家下注倍数(0表示还没有下注)[]
        var cbJettonMultiple = data.jettonMultiple;			//下注倍数[]

        var myIndex = MTBNNModel_hy.ins.gMeChairId;

        //下注结果
        if (cbUserJettonMultiple != null) {
            let count = cbUserJettonMultiple.length;
            for (let j = 0; j < count; j++) {
                const addscoreuser = cbUserJettonMultiple[j];

                if (addscoreuser > 0) {
                    let dt2 = new FTbnn.NN_CMD_S_AddScoreResult();
                    dt2.addJettonUser = j;
                    dt2.jettonMultiple = addscoreuser;
                    this.onAddScoreResult(dt2);
                } else if (addscoreuser == 0 && j == myIndex) { //重新进入时如果没有下注
                    if (cbTimeLeave > 0) //下注倒计时不为0
                    {
                        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_GAMESCENE_RELINE, cbJettonMultiple)
                        this.setDjs(cbTimeLeave)
                    }


                }
            }
        }

        // this.setDjs(cbTimeLeave);
        this.setRechargeShow(data);
        let isShow = (data.roomInfo && !data.roomInfo.bChatLimit) ? true : false;
        this.extend.showChat(isShow);

        this.extend.setLookOnNextIsChecked(data.bLookon);
    }

    onGameSceneOpen(data: FTbnn.NN_MSG_GS_OPEN) {
        this._cmds = [];
        this._canGetCmd = true;

        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_CONTINUE_ACTIVE, false);
        this.setMatch(false);
        this.setLabelTip(false);
        this.setRechargeShow(data);

        let isShow = (data.roomInfo && !data.roomInfo.bChatLimit) ? true : false;
        this.extend.showChat(isShow);

        var dCellScore = data.cellScore || MTBNNModel_hy.ins.currentDizhu;//基础积分
        this.setDiZhu(dCellScore, true);

        var cbIsOpenCard = data.isOpenCard;				//是否开牌[]
        var cbCardType = data.cardType;				//牌型[]
        var cbCardData = data.cardData;				//牌数据[]
        var cbHintCard = data.hintCard;				//牌数据(前三张牛牛，后两张点数)[]
        var cbUserJettonMultiple = data.userJettonMultiple;		//闲家下注倍数[]

        //分割cbCardData cbHintCard 因为都是20个数字
        var cbCardDataTemp = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
        var cbHintCardTemp = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];

        for (let l = 0; l < cbCardData.length; l++) {
            const element = cbCardData[l];
            const element1 = cbHintCard[l];
            if (l < 5) {
                cbCardDataTemp[0][l] = element;
                cbHintCardTemp[0][l] = element1;
            }
            else if (l >= 5 && l < 10) {
                cbCardDataTemp[1][l - 5] = element;
                cbHintCardTemp[1][l - 5] = element1;

            }
            else if (l >= 10 && l < 15) {
                cbCardDataTemp[2][l - 10] = element;
                cbHintCardTemp[2][l - 10] = element1;
            }
            else if (l >= 15 && l < 20) {
                cbCardDataTemp[3][l - 15] = element;
                cbHintCardTemp[3][l - 15] = element1;
            }
        }


        //下注结果
        if (cbUserJettonMultiple != null) {
            let count = cbUserJettonMultiple.length;
            for (let j = 0; j < count; j++) {
                const addscoreuser = cbUserJettonMultiple[j];
                if (addscoreuser > 0) {
                    let dt2 = new FTbnn.NN_CMD_S_AddScoreResult();
                    dt2.addJettonUser = j;
                    dt2.jettonMultiple = addscoreuser;
                    // this.onAddScoreResult(dt2);
                }
            }
        }

        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_GAMESCENE_OPEN, data);

        //发牌
        var myIndex = MTBNNModel_hy.ins.gMeChairId;

        cbCardDataTemp[myIndex]['isTips'] = false;
        this.onNoSendCard(cbCardDataTemp[myIndex]);

        // MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SCENE_OPEN_NOT_SEND_CARD
        //     , cbCardDataTemp[myIndex]);

        // UDebug.Log("cbCardDataTemp:"+JSON.stringify(cbCardDataTemp));
        // UDebug.Log("cbHintCardTemp:"+JSON.stringify(cbHintCardTemp));


        //开牌
        if (cbIsOpenCard != null) {
            for (let k = 0; k < cbIsOpenCard.length; k++) {
                const isopen = cbIsOpenCard[k];
                if (isopen == true) {//已开牌

                    let dt4 = new FTbnn.NN_CMD_S_OpenCardResult();
                    dt4.openCardUser = k;
                    dt4.cardType = cbCardType[k];
                    dt4.cardData = cbCardDataTemp[k];
                    dt4.OXCardData = cbHintCardTemp[k];
                    dt4["isTips"] = false;
                    this.onOpenCardResult(dt4);
                }
            }
        }

        // this.setDjs(cbTimeLeave);
        
        this.extend.setLookOnNextIsChecked(data.bLookon);
    }

    onGameSceneEnd(data: FTbnn.NN_MSG_GS_END) {
        this._cmds = [];
        this._canGetCmd = true;

        data.timeLeave = 0;
        this.onGameSceneOpen(data);

        this.setLabelTip(false);
        this.setMatch(false);
        this.setRechargeShow(data);
        this.setDjs(0);

        let isShow = (data.roomInfo && !data.roomInfo.bChatLimit) ? true : false;
        this.extend.showChat(isShow);

        var dCellScore = data.cellScore || MTBNNModel_hy.ins.currentDizhu;//基础积分
        this.setDiZhu(dCellScore, true);

        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_GAMESCENE_END, data);

        this.extend.setLookOnNextIsChecked(data.bLookon);
    }

    /************* s_event push cmd **************/
    private onNoSendCard(data: any) {
        this.pushcmd("no_send_card", data, true);
    }

    //游戏开始
    private onGameStart(data: any) {
        this.pushcmd("game_start", data, true);
    }

    //叫庄 
    private onCallBanker(data: any) {
        this.pushcmd("call_banker", data, true);
    }

    //叫庄结果
    private onCallBankerResult(data: any) {
        this.pushcmd("call_banker_result", data, true);
    }

    //下注结果
    private onAddScoreResult(data: any) {
        this.pushcmd("xia_zhu", data, true);
    }

    //发牌消息 
    private onSendCard(data: any) {
        this.pushcmd("fapai", data, true);
    }

    //开牌结果 
    private onOpenCardResult(data: any) {
        this.pushcmd("look_pai", data, true);
    }

    //游戏结束 
    private onGameEnd(data: any) {
        let pl = MTBNNModel_hy.ins.CopyBattlePlayer;
        this.pushcmd("game_end", { dt: data, pl: pl }, true);
        this.setDjs(0);
    }

    /**not use 显示继续按钮 */
    private sc_ts_show_match(): void {
        this.pushcmd("show_match", null, false);
    }
    private sc_ts_start_match(data: any): void {
        this.pushcmd("start_match", data, false);
    }
    /************* do  *******************/
    private do_game_start(data: any) {
        UDebug.log("do_game_start");
        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_RESET_SCENE);

        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_GAME_START, data);

        this._tmp_time = data.addJettonTime - 3;

        // this.setDjs(cbCallBankerTime);

        this.setMatch(false);
        this._music.playStart();
        this.setDiZhu(null, true);

        // this._canGetCmd = true;

        this.extend.showInvite(false);
        this.extend.setLookOnNextIsChecked(false);
    }

    private do_call_banker(data: any) {
        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_CALL_BANKER, data);

        var wCallBankerUser = data.callBankerUser;
        //是自己的结果
        if (wCallBankerUser == MTBNNModel_hy.ins.gMeChairId) {
            this.setLabelTip(true, ULanHelper.WAIT_CALL_BANKER);
        }

        this._canGetCmd = true;
    }

    private do_call_banker_result(data: any) {
        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBZNN_SUB_S_CALL_BANKER_RESULT, data);

        var cbAddJettonTime = data.addJettonTime;
        this.setDjs(cbAddJettonTime);

        // var dwBankerUser = data.dwBankerUser;
        // var myPl = MTBNNModel_hy.ins.gMeChairId;
        // if(dwBankerUser == myPl){//自己是庄
        //     this.setLabelTip(true, ULanHelper.WAIT_XIA_ZHU);
        // }else{
        this.setLabelTip(false);
        // }

        this._canGetCmd = true;
    }

    private do_xia_zhu(data: any) {
        UDebug.log("do_xia_zhu");
        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_ADD_SCORE_RESULT, data);

        let wAddJettonUser = data.addJettonUser;
        //是自己的结果
        if (wAddJettonUser == MTBNNModel_hy.ins.gMeChairId) {
            this.setLabelTip(true, ULanHelper.WAIT_TB_XIA_ZHU);
        }

        this._canGetCmd = true;
    }

    private do_no_send_card(data: any) {
        UDebug.log("do_no_send_card " + data);
        if (data['isTips'] == undefined) {
            this.setLabelTip(true, ULanHelper.WAIT_SHOW_CARD);
        }
        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SCENE_OPEN_NOT_SEND_CARD, data);
        this._canGetCmd = true;
    }

    private do_fapai(data: any) {
        UDebug.log("do_fapai");
        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_SEND_CARD, data);

        // var cbOpenTime = data.cbOpenTime;
        this._tmp_time = data.openTime;

        // this.setDjs(this._tmp_time);
        this.setDjs(0);
        this.onFaPaiAniComplete();
        this.setLabelTip(false);
        let player = MTBNNModel_hy.ins.getbattleplayerbySeatId(0);
        if (player && (player.playStatus == 5 || player.playStatus == 6)) {
            this.setLabelTip(true, ULanHelper.WAIT_SHOW_CARD);
        }
    }

    private do_look_pai(data: any) {
        UDebug.Log("do_look_pai:" + JSON.stringify(data));
        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_OPEN_CARD_RESULT, data);

        var wOpenCardUser = data.openCardUser;

        if (wOpenCardUser == MTBNNModel_hy.ins.gMeChairId && data['isTips'] == undefined) {
            this.setLabelTip(true, ULanHelper.WAIT_PIN_CARD);
        }
    }

    private do_game_end(dt: any) {
        // this.setDjs(0);
        let data = dt.dt;
        MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_GAME_END, data, dt.pl);
        this.setLabelTip(false);

        // this._music.playOver();

        // this.unscheduleAllCallbacks();

        this._canGetCmd = true;

        var dTotalScore = data.totalScore;
        if (dTotalScore != null) {
            for (let i = 0; i < dTotalScore.length; i++) {
                const element = dTotalScore[i];
                let index = MTBNNModel_hy.ins.getUISeatId(i);
                if (index == 0) {
                    this._myScore = element || 0;
                    break;
                }
            }
        }
    }

    private do_start_match(data: any): void {
        // this._cmds = [];
        // this._canGetCmd = true;

        if (data == true) {
            this.waitbattle();
            AppGame.ins.roomModel.requestMatch();
        }
        else {
            MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_RESET_SCENE);
            MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_CONTINUE_ACTIVE, true);
        }

    }
    private do_show_match(): void {
        // MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_RESET_SCENE);
        // MTBNNModel_hy.ins.emit(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_CONTINUE_ACTIVE, true);
        // this._canGetCmd = true;
    }

    private onStartAniComplete() {
        if (this._tmp_time != null && this._tmp_time > 0) {
            this.setDjs(this._tmp_time);
            this._tmp_time = 0;
        }
    }

    private onFaPaiAniComplete() {
        if (this._tmp_time != null && this._tmp_time > 0) {
            this.setDjs(this._tmp_time);
            this._tmp_time = 0;
        }
    }

}
