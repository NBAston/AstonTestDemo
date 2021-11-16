
import AppGame from "../../public/base/AppGame";
import USpriteFrames from "../../common/base/USpriteFrames";
import MBaseGameModel from "../../public/hall/MBaseGameModel";
import UNodeHelper from "../../common/utility/UNodeHelper";
import VQZJHMatch from "./VQZJHMatch";
import { ECommonUI, ELevelType, EGameType, EEnterRoomErrCode } from "../../common/base/UAllenum";
import ULanHelper from "../../common/utility/ULanHelper";
import UHandler from "../../common/utility/UHandler";
import UQZJHHelper, { UQZJHCmd, EQZJHState } from "./UQZJHHelper";
import { ToBattle } from "../../common/base/UAllClass";
import UQZJHMusic from "./UQZJHMusic";
import VQZJHMenu from "./VQZJHMenu";
import { Qzjh } from "../../common/cmd/proto";
import UDebug from "../../common/utility/UDebug";
import UGame from "../../public/base/UGame";
import VFyxbdNode from "../common/VFyxbdNode";
import UAudioManager from "../../common/base/UAudioManager";
import UEventHandler from "../../common/utility/UEventHandler";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import { ZJH_SCALE } from "../zjh/MZJH";
const { ccclass, property } = cc._decorator;

@ccclass
export default class UQZJHScene extends UGame {//UScene {
    /**单例 */
    private static _ins: UQZJHScene;
    static get ins(): UQZJHScene {
        return UQZJHScene._ins;
    }
    /**图片资源 */
    private _res: USpriteFrames = null;

    baseGameModel: MBaseGameModel = null;
    /** 是否可以取命令*/
    private _canGetCmd: boolean;
    /**匹配界面 */
    private _match: VQZJHMatch;
    /**提示label */
    private _tip: cc.Label;

    /**命令队列 */
    private _cmds: Array<UQZJHCmd>;
    /**底注label */
    private _dizhu: cc.Label;
    /**底注背景 */
    private _dizhubg: cc.Node;
    /**菜单节点 */
    private _menuNode: cc.Node;
    /** 菜单 */
    private _menu: VQZJHMenu;
    /**牌局编号 */
    private _label_gameid: cc.Label;
    /**牌局编号背景 */
    private qznn_pjbg: cc.Node;

    private _charge_btn:cc.Node;
    private _sys_news:Array<string>;
    private _emergency_announcement:Array<string>;
    private _enterMinScore:number;
    /**
     * 音乐播放器
     */
    private _music: UQZJHMusic;
    get getMusic(): UQZJHMusic {
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

    protected init(): void {
        UQZJHScene._ins = this;
        this._sys_news = [];
        this._cmds = [];
        this._canGetCmd = true;

        this._res = this.node.getComponent("USpriteFrames");
        this.baseGameModel = AppGame.ins.gamebaseModel;

        let root = UNodeHelper.find(this.node, "uiroot");
        //匹配界面
        this._match = UNodeHelper.getComponent(root, "match_node", VQZJHMatch);
        this._match.init();
        this.setMatch(false);

        //请等待xxx 那些提示
        this._tip = UNodeHelper.getComponent(root, "mainContent/label_tip", cc.Label);
        //声音资源
        // let audioRes = this.node.getComponent(UAudioRes);
        this._music = new UQZJHMusic();//audioRes
        //底注
        this._dizhu = UNodeHelper.getComponent(root, "mainContent/label_dizhu", cc.Label);
        this._dizhubg = UNodeHelper.find(root, "mainContent/dizhu_bg");

        this._menuNode = UNodeHelper.find(root, "menu"); // /menu_node
        let btnMenu = UNodeHelper.find(root, "mainContent/qznn_menu");
        this._menu = new VQZJHMenu(btnMenu, this._menuNode);
        this._menu.setOn(false);

        this._label_gameid = UNodeHelper.getComponent(root, "mainContent/label_gameID", cc.Label);
        this._label_gameid.node.active = false;

        this.qznn_pjbg = UNodeHelper.find(root, "mainContent/qznn_pjbg");
        this._charge_btn = UNodeHelper.find(root,"playersNode/seat0/charge_btn");
        UEventHandler.addClick(this.qznn_pjbg, this.node, "UQZJHScene", "oncopy");
        UEventHandler.addClick(this._charge_btn,this.node,"UQZJHScene","intoCharge");
        this.qznn_pjbg.active = false;
        this.fromeDisconnect = false;
    }
    /**
     * 场景被打开 
     * @param data 
     *//**sq 修改 需要是否是断线重连进来的 data:ToBattle */
    openScene(data: any): void {
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

        AppGame.ins.qzjhModel.setPlayerInfo(roleinfo);

        // cc.log(AppGame.ins.qzjhModel.getPlayerInfo());
        // this.getRoomPlayers();


        if (data) {
            let dt = data as ToBattle;
            AppGame.ins.qzjhModel.saveRoomInfo(dt.roomData);
            if (dt) {
                AppGame.ins.qzjhModel.currentDizhu = dt.roomData.floorScore;
                if (!dt.fromReconnet) {
                    this.waitbattle();
                    // this.delayTimerToMatch();
                }
                else {
                    AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_RESET_SCENE);
                    this.showgameinfo(false);
                    this.waitbattle();
                }

            }


            this._canGetCmd = true;
        }

        this.setLabelTip(false);
        this._music.playGamebg();
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
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_EVENT.QZJH_GAME_START, this.onGameStart, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_EVENT.QZJH_CALL_BANKER, this.onCallBanker, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_EVENT.QZJH_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_EVENT.QZJH_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_EVENT.QZJH_SEND_CARD, this.onSendCard, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_EVENT.QZJH_OPEN_CARD_RESULT, this.onOpenCardResult, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_EVENT.QZJH_GAME_END, this.onGameEnd, this);

        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_EVENT.QZJH_GAMESCENE_FREE, this.onGameSceneFree, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_EVENT.QZJH_GAMESCENE_CALL, this.onGameSceneCall, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_EVENT.QZJH_GAMESCENE_SCORE, this.onGameSceneScore, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_EVENT.QZJH_GAMESCENE_OPEN, this.onGameSceneOpen, this);

        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_MOVE_NEXT_CMD, this.onMoveNextCmd, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_UPDATE_ROOMID, this.onUpdateRoomId, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_START_ANI_COMPLETE, this.onStartAniComplete, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_FAPAI_COMPLETE, this.onFaPaiAniComplete, this);

        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SC_TS_START_MATCH, this.sc_ts_start_match, this);
        // AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SC_TS_SHOW_MATCH, this.sc_ts_show_match, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SC_TS_CANCLE_MATCH, this.set_cancel_match, this);

        AppGame.ins.qzjhModel.run();

    }
    private removeEvent() {
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_EVENT.QZJH_GAME_START, this.onGameStart, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_EVENT.QZJH_CALL_BANKER, this.onCallBanker, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_EVENT.QZJH_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_EVENT.QZJH_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_EVENT.QZJH_SEND_CARD, this.onSendCard, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_EVENT.QZJH_OPEN_CARD_RESULT, this.onOpenCardResult, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_EVENT.QZJH_GAME_END, this.onGameEnd, this);

        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_EVENT.QZJH_GAMESCENE_FREE, this.onGameSceneFree, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_EVENT.QZJH_GAMESCENE_CALL, this.onGameSceneCall, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_EVENT.QZJH_GAMESCENE_SCORE, this.onGameSceneScore, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_EVENT.QZJH_GAMESCENE_OPEN, this.onGameSceneOpen, this);

        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_MOVE_NEXT_CMD, this.onMoveNextCmd, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_UPDATE_ROOMID, this.onUpdateRoomId, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_START_ANI_COMPLETE, this.onStartAniComplete, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_FAPAI_COMPLETE, this.onFaPaiAniComplete, this);

        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SC_TS_START_MATCH, this.sc_ts_start_match, this);
        // AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SC_TS_SHOW_MATCH, this.sc_ts_show_match, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SC_TS_CANCLE_MATCH, this.set_cancel_match, this);

        AppGame.ins.qzjhModel.exit();
    }

    //点击复制牌局信息
    private oncopy():void {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this._label_gameid.string).substr(5,30));
    }

    private intoCharge():void{
        AppGame.ins.showUI(ECommonUI.LB_Charge);
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

        AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_RESET_SCENE);
        this.setDiZhu(null, false);

        this.showgameinfo(false);
        this.setMatch(true);

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
        AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_GAMEINFO_ACTIVE, value);
    }
    /**进入房间失败 */
    protected enter_room_fail(errorCode: number, errorMsg?: any): void {
        super.enter_room_fail(errorCode,errorMsg);
        return
        let self = this;
        if (errorMsg != null)
            // AppGame.ins.showTips(errorMsg);
            UDebug.log("进入房间失败"+ errorMsg+errorCode);

        switch (errorCode) {
            case EEnterRoomErrCode.ERROR_ENTERROOM_GAME_IS_END:
                // AppGame.ins.showUI(ECommonUI.MsgBox, {
                //     type: 1, data: ULanHelper.BATTLE_OVER, handler: UHandler.create(() => {
                //         this.waitbattle();
                //         AppGame.ins.qzjhModel.requestMatch();
                //     }, this)
                // });
                this.reconnect_in_game_but_no_in_gaming();
                break;
            case EEnterRoomErrCode.ERROR_ENTERROOM_SEAT_FULL:
            case EEnterRoomErrCode.ERROR_ENTERROOM_TABLE_FULL:
                {
                    this.setMatch(false);

                    // this._opreate.showMatch();
                    AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_RESET_SCENE);
                    AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_CONTINUE_ACTIVE, true);

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
                                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.QZJH);
                            }, this)
                        });
                    }, 3);
                }
                break;
            default:
                if(errorCode == 7){
                    var msg =  "您的金币不足，该房间需要" + self._enterMinScore*ZJH_SCALE + "金币以上才可以下注";
                }else{
                    var msg = ULanHelper.ENTERROOM_ERROR[errorCode];
                }
                if (!msg) {
                    msg = ULanHelper.GAME_INFO_ERRO;
                }
                AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                    type: 1, data: msg, handler: UHandler.create(() => {
                        AppGame.ins.loadLevel(ELevelType.Hall, EGameType.QZJH);
                    }, this)
                });
                break;
        }

    }

    /**取消 匹配 */
    private set_cancel_match(data: any): void {
        // UDebug.Log("set_cancel_match："+JSON.stringify(data));
        if (data == true) {
            AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_RESET_SCENE);

            AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_CONTINUE_ACTIVE, true);
            this.setMatch(false);

        } else {
            this.setMatch(true);
        }
    }

    private do_no_in_game() {
        this.setLabelTip(false);

        this.fromeDisconnect = true;

        AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_RESET_SCENE);
        AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_CONTINUE_ACTIVE, true);
        this.setMatch(false);

        // this.waitbattle();
        // AppGame.ins.qzjhModel.reconnectRequest();

        this._cmds = [];
        this._canGetCmd = true;

        AppGame.ins.qzjhModel.setReconnectState(EQZJHState.Wait, true);
        UDebug.Log("reconnect_in_game_but_no_in_gaming");
    }

    /**重连 显示匹配 */
    protected reconnect_in_game_but_no_in_gaming(): void {
        super.reconnect_in_game_but_no_in_gaming();

        // var index = 1;
        if (!this._cmds) {
            // index = 0;
            this._cmds = [];
        }
        // let item = new UQZJHCmd();
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
        num = AppGame.ins.qzjhModel.currentDizhu;
        if (num != null) {
            this._dizhu.string = "底注: " + (num / 100).toString();
        }
        // if (b != null) {
        //     this._dizhu.node.active = b;

        //     this._dizhubg.active = b;
        // }
    }
    /**设置倒计时事件 */
    private setDjs(time: number) {
        if (time != null) {
            AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_DJS_EVENT, time);
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
        this._tip.node.active = b;
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
        let item = new UQZJHCmd();
        item.cmd = cmd;
        item.data = dt;
        item.needwait = needwait;
        this._cmds.push(item);
    }
    /**取命令 */
    protected getcmd(): UQZJHCmd {
        if (this._cmds.length > 0) {
            return this._cmds.shift();
        }
        return null;
    }
    private docmd(cmd: UQZJHCmd): void {
        switch (cmd.cmd) {
            case "game_start"://开始
                this.do_game_start(cmd.data);
                break;
            case "call_banker"://个人叫庄结果
                this.do_call_banker(cmd.data);
                break;
            case "call_banker_result"://叫庄结果
                this.do_call_banker_result(cmd.data);
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
    onGameSceneFree(data: any, ishideContinue: boolean = false) {
        var cbReadyTime = data.cbReadyTime;//准备时间
        var cbJettonMultiple = data.cbJettonMultiple; //下注倍数 []
        var cbCallBankerMultiple = data.cbCallBankerMultiple;//叫庄倍数 []

        var dCellScore = data.dCellScore || AppGame.ins.qzjhModel.currentDizhu;//基础积分

        this._canGetCmd = true;

        AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_RESET_SCENE);

        if (!ishideContinue) {
            AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_CONTINUE_ACTIVE, true);
        }
    }

    onGameSceneCall(data: Qzjh.NN_MSG_GS_CALL) {
        this.setMatch(false);

        var dCellScore = data.cellScore || AppGame.ins.qzjhModel.currentDizhu;//基础积分
        this.setDiZhu(dCellScore, true);

        var sCallBanker = data.callBanker;//叫庄标志(-1:未叫; 0:不叫; 1:叫庄)[]
        var cbCallBankerMultiple = data.callBankerMultiple;//叫庄倍数[]
        this._canGetCmd = true;

        if (sCallBanker != null) { //&& cbCallBankerMultiple != null
            let count = sCallBanker.length;
            for (let i = 0; i < count; i++) {
                const callbanker = sCallBanker[i];

                if (callbanker >= 0) {
                    let dt = new Qzjh.NN_CMD_S_CallBanker();
                    dt.callBankerUser = i;
                    dt.callMultiple = callbanker;//cbCallBankerMultiple[i];
                    this.onCallBanker(dt);
                }
            }
        }

        var cbTimeLeave = data.timeLeave;//剩余时间 放在最后一个包上
        this.setDjs(cbTimeLeave);

    }

    onGameSceneScore(data: Qzjh.NN_MSG_GS_SCORE) {
        this.setMatch(false);

        var dCellScore = data.cellScore || AppGame.ins.qzjhModel.currentDizhu;//基础积分
        this.setDiZhu(dCellScore, true);

        var cbTimeLeave = data.timeLeave;//剩余时间 放在最后一个包上

        var wBankerUser = data.bankerUser;				//庄家用户
        var cbBankerMultiple = data.bankerMultiple;	//庄家倍数
        var cbUserJettonMultiple = data.userJettonMultiple;	//闲家下注倍数(0表示还没有下注)[]
        var cbJettonMultiple = data.jettonMultiple;			//下注倍数[]
        
        this._canGetCmd = true;

        //庄家叫庄
        let dt1 = new Qzjh.NN_CMD_S_CallBanker();
        dt1.callBankerUser = wBankerUser;
        dt1.callMultiple = cbBankerMultiple;
        this.onCallBanker(dt1);
        //叫庄结果
        let dt = new Qzjh.NN_CMD_S_CallBankerResult();
        var bankerarray = []
        for (let i = 0; i < 4; i++) {
            if (i == wBankerUser) {
                bankerarray.push(1);
            }
            else {
                bankerarray.push(0);
            }
        }
        dt.callBankerUser = bankerarray;
        dt.randBanker = false;
        dt.bankerUser = wBankerUser;
        dt.jettonMultiple = cbJettonMultiple;
        dt.addJettonTime = cbTimeLeave;
        this.onCallBankerResult(dt);

        //下注结果
        if (cbUserJettonMultiple != null) {
            let count = cbUserJettonMultiple.length;
            for (let j = 0; j < count; j++) {
                const addscoreuser = cbUserJettonMultiple[j];

                if (addscoreuser > 0) {
                    let dt2 = new Qzjh.NN_CMD_S_AddScoreResult();
                    dt2.addJettonUser = j;
                    dt2.jettonMultiple = addscoreuser;
                    this.onAddScoreResult(dt2);
                }
            }
        }

        // this.setDjs(cbTimeLeave);
    }

    onGameSceneOpen(data: Qzjh.NN_MSG_GS_OPEN) {
        this.setMatch(false);

        var dCellScore = data.cellScore || AppGame.ins.qzjhModel.currentDizhu;//基础积分
        this.setDiZhu(dCellScore, true);
        this._canGetCmd = true;


        var wBankerUser = data.bankerUser;				//庄家用户
        var cbBankerMutiple = data.bankerMultiple;			//庄家倍数
        var cbIsOpenCard = data.isOpenCard;				//是否开牌[]
        var cbCardType = data.cardType;				//牌型[]
        var cbCardData = data.cardData;				//牌数据[]
        // var cbHintCard = data.hintCard;				//牌数据(前三张牛牛，后两张点数)[]
        var cbUserJettonMultiple = data.userJettonMultiple;		//闲家下注倍数[]
       
        //分割cbCardData cbHintCard 因为都是20个数字
        var cbCardDataTemp = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]];

        for (let l = 0; l < cbCardData.length; l++) {
            const element = cbCardData[l];
            if (l < 3) {
                cbCardDataTemp[0][l] = element;
            }
            else if (l >= 3 && l < 6) {
                cbCardDataTemp[1][l - 3] = element;
            }
            else if (l >= 6 && l < 9) {
                cbCardDataTemp[2][l - 6] = element;
            }
            else if (l >= 9 && l < 12) {
                cbCardDataTemp[3][l - 9] = element;
            }
        }

        //庄家叫庄
        let dt1 = new Qzjh.NN_CMD_S_CallBanker();
        dt1.callBankerUser = wBankerUser;
        dt1.callMultiple = cbBankerMutiple;
        this.onCallBanker(dt1);
        //叫庄结果
        let dt = new Qzjh.NN_CMD_S_CallBankerResult();
        var bankerarray = []
        for (let i = 0; i < 4; i++) {
            if (i == wBankerUser) {
                bankerarray.push(1);
            }
            else {
                bankerarray.push(0);
            }

        }
        dt.callBankerUser = bankerarray;
        dt.randBanker = false;
        dt.bankerUser = wBankerUser;
        dt.jettonMultiple = null;//不显示下注按钮
        this.onCallBankerResult(dt);

        //下注结果
        if (cbUserJettonMultiple != null) {
            let count = cbUserJettonMultiple.length;
            for (let j = 0; j < count; j++) {
                const addscoreuser = cbUserJettonMultiple[j];
                if (addscoreuser > 0) {
                    let dt2 = new Qzjh.NN_CMD_S_AddScoreResult();
                    dt2.addJettonUser = j;
                    dt2.jettonMultiple = addscoreuser;
                    this.onAddScoreResult(dt2);
                }
            }
        }

        AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SC_GAMESCENE_OPEN, data);

        //发牌
        var myIndex = AppGame.ins.qzjhModel.gMeChairId;

        // var dt3 = new qznn.NN_CMD_S_SendCard();
        // dt3.cbSendCard = cbCardDataTemp[myIndex];
        // dt3.cbOxCard = cbHintCardTemp[myIndex];
        // dt3.cbOpenTime = cbTimeLeave;
        // dt3.cbCardType = cbCardType[myIndex];
        // this.onSendCard(dt3);

        this.onNoSendCard(cbCardDataTemp[myIndex]);
        // AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SCENE_OPEN_NOT_SEND_CARD
        //     , cbCardDataTemp[myIndex]);

        // UDebug.Log("cbCardDataTemp:"+JSON.stringify(cbCardDataTemp));
        // UDebug.Log("cbHintCardTemp:"+JSON.stringify(cbHintCardTemp));


        //开牌
        if (cbIsOpenCard != null) {
            for (let k = 0; k < cbIsOpenCard.length; k++) {
                const isopen = cbIsOpenCard[k];
                if (isopen) {//已开牌
                    let dt4 = new Qzjh.NN_CMD_S_OpenCardResult();
                    dt4.openCardUser = k;
                    dt4.cardType = cbCardType[k];
                    dt4.cardData = cbCardDataTemp[k];
                    UDebug.Log("手牌数据" + dt4.cardData + "ID" + dt4.openCardUser)
                    this.onOpenCardResult(dt4);
                }
            }
        }


        // this.setDjs(cbTimeLeave);
    }

    // onGameSceneEnd(data) {
    //     AppGame.ins.qzjhModel.onGameSceneEnd(data);

    // }

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
        let pl = AppGame.ins.qzjhModel.CopyBattlePlayer;
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
        AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_RESET_SCENE);

        AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SUB_S_GAME_START, data);

        this._tmp_time = data.callBankerTime;

        // this.setDjs(cbCallBankerTime);

        this.setMatch(false);
        this._music.playStart();
        this.setDiZhu(null, true);

        // this._canGetCmd = true;
    }

    private do_call_banker(data: any) {
        UDebug.log("do_call_banker");

        AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SUB_S_CALL_BANKER, data);

        var wCallBankerUser = data.callBankerUser;
        //是自己的结果
        if (wCallBankerUser == AppGame.ins.qzjhModel.gMeChairId) {
            this.setLabelTip(true, ULanHelper.WAIT_CALL_BANKER);
        }

        this._canGetCmd = true;
    }

    private do_call_banker_result(data: any) {
        AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SUB_S_CALL_BANKER_RESULT, data);
        UDebug.log("do_call_banker_result");

        var cbAddJettonTime = data.addJettonTime;
        this.setDjs(cbAddJettonTime);


        var dwBankerUser = data.bankerUser;
        var myPl = AppGame.ins.qzjhModel.gMeChairId;
        if (dwBankerUser == myPl) {//自己是庄
            this.setLabelTip(true, ULanHelper.WAIT_XIA_ZHU);
            this.waitPlaySound("audio_qzjh_ddxz");

        } else {
            this.setLabelTip(true , ULanHelper.WAIT_XIA_ZHU2);
            this.waitPlaySound("audio_qzjh_ksxz");

        }


        this._canGetCmd = true;
    }

    private waitPlaySound(soundName){
        this.node.runAction(
            cc.sequence(cc.delayTime(1),
                cc.callFunc(() => {
                    UAudioManager.ins.playSound(soundName);
                }, this))
        );
    }

    private do_xia_zhu(data: any) {
        UDebug.log("do_xia_zhu");

        AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SUB_S_ADD_SCORE_RESULT, data);

        let wAddJettonUser = data.addJettonUser;
        //是自己的结果
        if (wAddJettonUser == AppGame.ins.qzjhModel.gMeChairId) {
            this.setLabelTip(true, ULanHelper.WAIT_O_XIA_ZHU);
        }

        this._canGetCmd = true;
    }

    private do_no_send_card(data: any) {
        UDebug.log("do_no_send_card");

        AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SCENE_OPEN_NOT_SEND_CARD
            , data);
        this._canGetCmd = true;
    }

    private do_fapai(data: any) {
        UDebug.log("do_fapai");

        AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SUB_S_SEND_CARD, data);

        // var cbOpenTime = data.openTime;
        this._tmp_time = data.openTime;

        // this.setDjs(cbOpenTime);
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'audio_qzjh_qkp');
        this.setLabelTip(false);
    }

    private do_look_pai(data: any) {
        UDebug.Log("do_look_pai:" + JSON.stringify(data));
        AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SUB_S_OPEN_CARD_RESULT, data);

        var wOpenCardUser = data.openCardUser;
        if (wOpenCardUser == AppGame.ins.qzjhModel.gMeChairId) {
            this.setLabelTip(true, ULanHelper.WAIT_PIN_CARD);
        }
    }

    private do_game_end(dt: any) {
        // this.setDjs(0);
        UDebug.log("do_game_end");

        let data=dt.dt;
        AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SUB_S_GAME_END, data,dt.pl);
        this.setLabelTip(false);

        // this._music.playOver();

        // this.unscheduleAllCallbacks();

        this._canGetCmd = true;

        var dTotalScore = data.totalScore;
        if (dTotalScore != null) {
            for (let i = 0; i < dTotalScore.length; i++) {
                const element = dTotalScore[i];
                let index = AppGame.ins.qzjhModel.getUISeatId(i);
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
        UDebug.log("do_start_match");

        if (data == true) {
            this.waitbattle();
        }
        else {
            AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_RESET_SCENE);
            AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_CONTINUE_ACTIVE, true);
        }

    }
    private do_show_match(): void {
        // AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_RESET_SCENE);
        // AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_CONTINUE_ACTIVE, true);
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

    // private do_turn_time(data:any){

    // }

    //操作失败 
    // onOperateFail(data: any) {
    //     AppGame.ins.qzjhModel.onOperateFail(data);

    // }



    // onTongSha() {
    //     AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_TONGSHA_EVENT);
    // }

    // onTongPei() {
    //     AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_TONGPEI_EVENT);
    // }

    //#endregion
}
