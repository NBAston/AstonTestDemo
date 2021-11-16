import UGame from "../../public/base/UGame";
import USpriteFrames from "../../common/base/USpriteFrames";
import MBaseGameModel from "../../public/hall/MBaseGameModel";
import VKPQZJHMatch from "./VKPQZJHMatch";
import UKPQZJHHelper, { UKPQZJHCmd, EQZNNState } from "./UKPQZJHHelper";
import VKPQZJHMenu from "./VKPQZJHMenu";
import UKPQZJHMusic from "./UKPQZJHMusic";
import VFyxbdNode from "../common/VFyxbdNode";
import AppGame from "../../public/base/AppGame";
import UNodeHelper from "../../common/utility/UNodeHelper";
import MKPQZJHModel from "./model/MKPQZJHModel";
import ULocalStorage from "../../common/utility/ULocalStorage";
import { ToBattle } from "../../common/base/UAllClass";
import ULanHelper from "../../common/utility/ULanHelper";
import { EEnterRoomErrCode, ECommonUI, ELevelType, EGameType, ETipType } from "../../common/base/UAllenum";
import UHandler from "../../common/utility/UHandler";
import UDebug from "../../common/utility/UDebug";
import { KPQzjh } from "../../common/cmd/proto";
import UAudioManager from "../../common/base/UAudioManager";
import UEventHandler from "../../common/utility/UEventHandler";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import MHall, { NEWS } from "../../public/hall/lobby/MHall";
import UStringHelper from "../../common/utility/UStringHelper";
import { ZJH_SCALE } from "../zjh/MZJH";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UKPQZJHScene extends UGame {//UScene {

    /**单例 */
    private static _ins: UKPQZJHScene;
    static get ins(): UKPQZJHScene {
        return UKPQZJHScene._ins;
    }
    /**图片资源 */
    private _res: USpriteFrames = null;

    baseGameModel: MBaseGameModel = null;
    /** 是否可以取命令*/
    private _canGetCmd: boolean;
    /**匹配界面 */
    private _match: VKPQZJHMatch;
    /**提示label */
    private _tip: cc.Label;

    /**命令队列 */
    private _cmds: Array<UKPQZJHCmd>;
    /**底注label */
    private _dizhu: cc.Label;
    /**底注背景 */
    private _dizhubg: cc.Node;
    /**菜单节点 */
    private _menuNode: cc.Node;
    /** 菜单 */
    private _menu: VKPQZJHMenu;
    /**牌局编号 */
    private _label_gameid: cc.Label;
    /**牌局编号背景 */
    private qznn_pjbg: cc.Node;
    private _charge_btn:cc.Node;

    /**
     * 音乐播放器
     */
    private _music: UKPQZJHMusic;
    get getMusic(): UKPQZJHMusic {
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
    /**动作 */
    private _delayAction = null;
    private _emergency_announcement:Array<string>;
    private _enterMinScore:number;
    protected init(): void {
        UKPQZJHScene._ins = this;
        this._cmds = [];
        this._canGetCmd = true;

        this._res = this.node.getComponent("USpriteFrames");
        this.baseGameModel = AppGame.ins.gamebaseModel;

        let root = UNodeHelper.find(this.node, "uiroot");
        //匹配界面
        this._match = UNodeHelper.getComponent(root, "match_node", VKPQZJHMatch);
        this._match.init();
        this.setMatch(false);

        //请等待xxx 那些提示
        this._tip = UNodeHelper.getComponent(root, "mainContent/label_tip", cc.Label);
        //声音资源
        // let audioRes = this.node.getComponent(UAudioRes);
        this._music = new UKPQZJHMusic();//audioRes
        //底注
        this._dizhu = UNodeHelper.getComponent(root, "mainContent/label_dizhu", cc.Label);
        this._dizhubg = UNodeHelper.find(root, "mainContent/dizhu_bg");

        this._menuNode = UNodeHelper.find(root, "menu"); // /menu_node
        let btnMenu = UNodeHelper.find(root, "mainContent/qznn_menu");
        this._menu = new VKPQZJHMenu(btnMenu, this._menuNode);
        this._menu.setOn(false);

        this._label_gameid = UNodeHelper.getComponent(root, "mainContent/label_gameID", cc.Label);
        this._label_gameid.node.active = false;

        this.qznn_pjbg = UNodeHelper.find(root, "mainContent/qznn_pjbg");
        this.qznn_pjbg.active = false;
        this._charge_btn = UNodeHelper.find(root,"playersNode/seat0/charge_btn");
        UEventHandler.addClick(this.qznn_pjbg, this.node, "UKPQZJHScene", "oncopy");
        UEventHandler.addClick(this._charge_btn,this.node,"UKPQZJHScene","intoCharge");


        this.fromeDisconnect = false;

        //测试差集
        // let lostArray = [0,1,2,3]; 
        // let lostArray1 = [0,2,3]; 
        // let difference = lostArray.concat(lostArray1).filter(v => !lostArray1.includes(v) ) 

        // UDebug.Log("difference:"+JSON.stringify(difference));
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


        MKPQZJHModel.ins.setPlayerInfo(roleinfo);

        // cc.log(MKPQZJHModel.ins.getPlayerInfo());
        // this.getRoomPlayers();


        if (data) {
            let dt = data as ToBattle;
            MKPQZJHModel.ins.saveRoomInfo(dt.roomData);
            if (dt) {
                MKPQZJHModel.ins.currentDizhu = dt.roomData.floorScore;

                if (!dt.fromReconnet) {
                    this.waitbattle();
                    // this.delayTimerToMatch();
                }
                else {
                    MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE);
                    this.showgameinfo(false);
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

        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_EVENT.QZNN_GAME_START, this.onGameStart, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_EVENT.QZNN_CALL_BANKER, this.onCallBanker, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_EVENT.QZNN_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_EVENT.QZNN_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_EVENT.QZNN_SEND_CARD, this.onSendCard, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_EVENT.QZNN_OPEN_CARD_RESULT, this.onOpenCardResult, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_EVENT.QZNN_GAME_END, this.onGameEnd, this);

        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_EVENT.QZNN_GAMESCENE_FREE, this.onGameSceneFree, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_EVENT.QZNN_GAMESCENE_CALL, this.onGameSceneCall, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_EVENT.QZNN_GAMESCENE_SCORE, this.onGameSceneScore, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_EVENT.QZNN_GAMESCENE_OPEN, this.onGameSceneOpen, this);

        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_MOVE_NEXT_CMD, this.onMoveNextCmd, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_UPDATE_ROOMID, this.onUpdateRoomId, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_START_ANI_COMPLETE, this.onStartAniComplete, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_FAPAI_COMPLETE, this.onFaPaiAniComplete, this);

        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SC_TS_START_MATCH, this.sc_ts_start_match, this);
        // MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SC_TS_SHOW_MATCH, this.sc_ts_show_match, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SC_TS_CANCLE_MATCH, this.set_cancel_match, this);


        MKPQZJHModel.ins.run();

    }
    private removeEvent() {

        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_EVENT.QZNN_GAME_START, this.onGameStart, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_EVENT.QZNN_CALL_BANKER, this.onCallBanker, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_EVENT.QZNN_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_EVENT.QZNN_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_EVENT.QZNN_SEND_CARD, this.onSendCard, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_EVENT.QZNN_OPEN_CARD_RESULT, this.onOpenCardResult, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_EVENT.QZNN_GAME_END, this.onGameEnd, this);

        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_EVENT.QZNN_GAMESCENE_FREE, this.onGameSceneFree, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_EVENT.QZNN_GAMESCENE_CALL, this.onGameSceneCall, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_EVENT.QZNN_GAMESCENE_SCORE, this.onGameSceneScore, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_EVENT.QZNN_GAMESCENE_OPEN, this.onGameSceneOpen, this);

        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_MOVE_NEXT_CMD, this.onMoveNextCmd, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_UPDATE_ROOMID, this.onUpdateRoomId, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_START_ANI_COMPLETE, this.onStartAniComplete, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_FAPAI_COMPLETE, this.onFaPaiAniComplete, this);

        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SC_TS_START_MATCH, this.sc_ts_start_match, this);
        // MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SC_TS_SHOW_MATCH, this.sc_ts_show_match, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SC_TS_CANCLE_MATCH, this.set_cancel_match, this);

        MKPQZJHModel.ins.exit();
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

        MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE);
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
        MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_GAMEINFO_ACTIVE, value);
    }
    /**进入房间失败 */
    protected enter_room_fail(errorCode: number, errorMsg?: any): void {
        super.enter_room_fail(errorCode,errorMsg);
        return
        // let self = this;
        // if (errorMsg != null) {
        //     // AppGame.ins.showTips(errorMsg);
        //     UDebug.log("进入房间失败"+ errorMsg+errorCode);
        // }
        // switch (errorCode) {
        //     case EEnterRoomErrCode.ERROR_ENTERROOM_GAME_IS_END:
        //         // AppGame.ins.showUI(ECommonUI.MsgBox, {
        //         //     type: 1, data: ULanHelper.BATTLE_OVER, handler: UHandler.create(() => {
        //         //         this.waitbattle();
        //         //         MKPQZJHModel.ins.requestMatch();
        //         //     }, this)
        //         // });
        //         this.reconnect_in_game_but_no_in_gaming();
        //         break;
        //     case EEnterRoomErrCode.ERROR_ENTERROOM_SEAT_FULL:
        //     case EEnterRoomErrCode.ERROR_ENTERROOM_TABLE_FULL:
        //         {
        //             this.setMatch(false);
        //             AppGame.ins.showTips({ data: "房间桌子已满，请您稍后再试！", type: ETipType.repeat });
        //             // this._opreate.showMatch();
        //             MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE);
        //             MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_CONTINUE_ACTIVE, true);

        //         }
        //         break;
        //     case EEnterRoomErrCode.ERROR_ENTERROOM_SCORENOENOUGH:
        //         {
        //             AppGame.ins.showUI(ECommonUI.NewMsgBox, {
        //                 type: 1, data: ULanHelper.PLAYER_FENSHU_BUZU, handler: UHandler.create(() => {
        //                     AppGame.ins.loadLevel(ELevelType.Hall, EGameType.KPQZJH);
        //                 }, this)
        //             });

        //         }
        //         break;
        //     case EEnterRoomErrCode.ERROR_ENTERROOM_STOP_CUR_USER:
        //             {
        //                 AppGame.ins.showUI(ECommonUI.NewMsgBox, {
        //                     type: 1, data: ULanHelper.ACCOUNT_STOP, handler: UHandler.create(() => {
        //                         AppGame.ins.loadLevel(ELevelType.Hall, EGameType.KPQZJH);
        //                     }, this)
        //                 });
    
        //             }
        //             break;
        //     default:
        //         if(errorCode == 7){
        //             var msg =  "您的金币不足，该房间需要" + self._enterMinScore*ZJH_SCALE + "金币以上才可以下注";
        //         }else{
        //             var msg = ULanHelper.ENTERROOM_ERROR[errorCode];
        //         }
        //         AppGame.ins.showUI(ECommonUI.NewMsgBox, {
        //             type: 1, data: msg, handler: UHandler.create(() => {
        //                 AppGame.ins.loadLevel(ELevelType.Hall, EGameType.KPQZJH);
        //             }, this)
        //         });
        //         break;
            // default:
            //     AppGame.ins.showUI(ECommonUI.MsgBox, {
            //         type: 1, data: ULanHelper.ROOM_INFO_ERRO, handler: UHandler.create(() => {
            //             AppGame.ins.loadLevel(ELevelType.Hall, EGameType.KPQZJH);
            //         }, this)
            //     });
            //     break;

        // }

    }

    /**取消 匹配 */
    private set_cancel_match(data: any): void {
        // UDebug.Log("set_cancel_match："+JSON.stringify(data));
        if (data == true) {
            MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE);

            MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_CONTINUE_ACTIVE, true);
            this.setMatch(false);

        } else {
            this.setMatch(true);
        }
    }

    private do_no_in_game() {
        this.setLabelTip(false);

        this.fromeDisconnect = true;

        MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE);
        MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_CONTINUE_ACTIVE, true);
        this.setMatch(false);

        // this.waitbattle();
        // MKPQZJHModel.ins.reconnectRequest();
        this.setDjs(0);
        this._cmds = [];
        this._canGetCmd = true;

        MKPQZJHModel.ins.setReconnectState(EQZNNState.Wait, true);
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
        // let item = new UKPQZJHCmd();
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
        num = MKPQZJHModel.ins.currentDizhu;
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
            MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_DJS_EVENT, time);
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
        let item = new UKPQZJHCmd();
        item.cmd = cmd;
        item.data = dt;
        item.needwait = needwait;
        this._cmds.push(item);
    }
    /**取命令 */
    protected getcmd(): UKPQZJHCmd {
        if (this._cmds.length > 0) {
            return this._cmds.shift();
        }
        return null;
    }
    private docmd(cmd: UKPQZJHCmd): void {
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
        var cbJettonMultiple = data.jettonMultiple; //下注倍数 []
        var cbCallBankerMultiple = data.callBankerMultiple;//叫庄倍数 []

        var dCellScore = data.cellScore || MKPQZJHModel.ins.currentDizhu;//基础积分
        this._canGetCmd = true;

        // MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE);
        // if(!ishideContinue){
        //     MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_CONTINUE_ACTIVE, true);
        // }
    }

    onGameSceneCall(data: any) {
        this.setMatch(false);

        var dCellScore = data.cellScore || MKPQZJHModel.ins.currentDizhu;//基础积分
        this.setDiZhu(dCellScore, true);

        var sCallBanker = data.callBanker;//叫庄标志(-1:未叫; 0:不叫; 1:叫庄)[]
        var cbCallBankerMultiple = data.callBankerMultiple;//叫庄倍数[]
        this._canGetCmd = true;

        var cbTimeLeave = data.timeLeave;//剩余时间 放在最后一个包上
        this.setDjs(cbTimeLeave);

        let cbHandcard = data.showCards;

        var myIndex = MKPQZJHModel.ins.gMeChairId;

        //发牌
        if (data.user.userId == AppGame.ins.roleModel.useId) {
            this.onNoSendCard(cbHandcard);
        }

        if (sCallBanker != null) { //&& cbCallBankerMultiple != null
            let count = sCallBanker.length;
            for (let i = 0; i < count; i++) {
                const callbanker = sCallBanker[i];

                if (callbanker >= 0) {
                    let dt = new KPQzjh.NN_CMD_S_CallBanker();
                    dt.callBankerUser = i;
                    dt.callMultiple = callbanker;//cbCallBankerMultiple[i];
                    this.onCallBanker(dt);
                }
                // else if (callbanker == -1 && myIndex == i) {//自己未叫，显示叫庄按钮
                //     MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_CALL, data);
                // }

            }
        }



    }

    onGameSceneScore(data: any) {
        this.setMatch(false);

        var dCellScore = data.cellScore || MKPQZJHModel.ins.currentDizhu;//基础积分
        this.setDiZhu(dCellScore, true);

        var cbTimeLeave = data.timeLeave;//剩余时间 放在最后一个包上

        var wBankerUser = data.bankerUser;				//庄家用户
        var cbBankerMultiple = data.bankerMultiple;	//庄家倍数
        var cbUserJettonMultiple = data.userJettonMultiple;	//闲家下注倍数(0表示还没有下注)[]
        var cbJettonMultiple = data.jettonMultiple;			//下注倍数[]
        // var cbJettonsMuls = data.cbJettonsMuls;	
        var cbCallBankerMultiple = data.callBankerMultiple;	//叫庄倍数[] not use
        var cbHandcard = data.showCards; //自己亮的牌


        this._canGetCmd = true;
        var myIndex = MKPQZJHModel.ins.gMeChairId;

        //发牌
        if (data.user.userId == AppGame.ins.roleModel.useId) {
            this.onNoSendCard(cbHandcard);
        }
        //庄家叫庄
        let dt1 = new KPQzjh.NN_CMD_S_CallBanker();
        dt1.callBankerUser = wBankerUser;
        dt1.callMultiple = cbBankerMultiple;
        this.onCallBanker(dt1);
        //叫庄结果
        let dt = new KPQzjh.NN_CMD_S_CallBankerResult();
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
        // dt.cbJettonsMuls = cbJettonsMuls;
        dt.addJettonTime = cbTimeLeave;


        //下注结果
        if (cbUserJettonMultiple != null) {
            let count = cbUserJettonMultiple.length;
            for (let j = 0; j < count; j++) {
                const addscoreuser = cbUserJettonMultiple[j];

                if (addscoreuser > 0) {
                    let dt2 = new KPQzjh.NN_CMD_S_AddScoreResult();
                    dt2.addJettonUser = j;
                    dt2.jettonMultiple = addscoreuser;
                    this.onAddScoreResult(dt2);
                }
                else if (addscoreuser == 0 && myIndex == j) {//自己未叫，显示叫庄按钮
                    // MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_SCORE, data);
                    dt["isScene"] = true;
                    this.onCallBankerResult(dt);
                }
            }
        }

        // this.setDjs(cbTimeLeave);
    }

    onGameSceneOpen(data: any) {
        this.setMatch(false);

        var dCellScore = data.cellScore || MKPQZJHModel.ins.currentDizhu;//基础积分
        this.setDiZhu(dCellScore, true);
        this._canGetCmd = true;


        var wBankerUser = data.bankerUser;				//庄家用户
        var cbBankerMutiple = data.bankerMutiple;			//庄家倍数
        var cbIsOpenCard = data.isOpenCard;				//是否开牌[]
        var cbCardType = data.cardType;				//牌型[]
        var cbCardData = data.cardData;				//牌数据[]
        var cbUserJettonMultiple = data.userJettonMultiple;		//闲家下注倍数[]
        var cbJettonMultiple = data.jettonMultiple;			//下注倍数[] not use
        // var cbJettonsMuls = data.cbJettonsMuls;			//下注倍数[] not use
        var cbCallBankerMultiple = data.callBankerMultiple;		//叫庄倍数[] not use
        var cbTimeLeave = data.timeLeave;//剩余时间 放在最后一个包上
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

        //发牌
        let myIndex = MKPQZJHModel.ins.gMeChairId;
        let cbHandcard = [];
        for (let i = 0; i < 5; i++) {
            cbHandcard.push(cbCardDataTemp[myIndex][i]);
        }
        if (data.user.userId == AppGame.ins.roleModel.useId) {
            this.onNoSendCard(cbHandcard);
        }

        //庄家叫庄
        let dt1 = new KPQzjh.NN_CMD_S_CallBanker();
        dt1.callBankerUser = wBankerUser;
        dt1.callMultiple = cbBankerMutiple;
        this.onCallBanker(dt1);
        //叫庄结果
        let dt = new KPQzjh.NN_CMD_S_CallBankerResult();
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
        // dt.cbJettonsMuls = null;//不显示下注按钮
        this.onCallBankerResult(dt);

        //下注结果
        if (cbUserJettonMultiple != null) {
            let count = cbUserJettonMultiple.length;
            for (let j = 0; j < count; j++) {
                const addscoreuser = cbUserJettonMultiple[j];
                if (addscoreuser > 0) {
                    let dt2 = new KPQzjh.NN_CMD_S_AddScoreResult();
                    dt2.addJettonUser = j;
                    dt2.jettonMultiple = addscoreuser;
                    this.onAddScoreResult(dt2);
                }
            }
        }

        MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_OPEN, data);


        //开牌
        if (cbIsOpenCard != null) {
            for (let k = 0; k < cbIsOpenCard.length; k++) {
                const isopen = cbIsOpenCard[k];
                if (isopen == 1) {//已开牌

                    let dt4 = new KPQzjh.NN_CMD_S_OpenCardResult();
                    dt4.openCardUser = k;
                    dt4.cardType = cbCardType[k];
                    dt4.cardData = cbCardDataTemp[k];
                    // dt4.OXCardData = cbHintCardTemp[k];
                    this.onOpenCardResult(dt4);
                }
            }
        }


        // this.setDjs(cbTimeLeave);
    }

    // onGameSceneEnd(data) {
    //     MKPQZJHModel.ins.onGameSceneEnd(data);

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
        this.pushcmd("game_end", data, true);
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

        MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE);

        MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, data);

        this._tmp_time = data.callBankerTime;

        // this.setDjs(cbCallBankerTime);

        

        this.setMatch(false);
        this._music.playStart();
        this.setDiZhu(null, true);

        // this._canGetCmd = true;
    }

    private do_call_banker(data: any) {
        MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER, data);

        var wCallBankerUser = data.callBankerUser;
        //是自己的结果
        if (wCallBankerUser == MKPQZJHModel.ins.gMeChairId) {
            this.setLabelTip(true, ULanHelper.WAIT_CALL_BANKER);
        }

        this._canGetCmd = true;
    }

    private do_call_banker_result(data: any) {
        MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER_RESULT, data);

        var cbAddJettonTime = data.addJettonTime;
        this.setDjs(cbAddJettonTime);


        var dwBankerUser = data.bankerUser;
        var myPl = MKPQZJHModel.ins.gMeChairId;
        if (dwBankerUser == myPl) {//自己是庄
            this.setLabelTip(true, ULanHelper.WAIT_XIA_ZHU);
            this.waitPlaySound("audio_qznn_ddxz");
        } else {
            // this.setLabelTip(false);
            this.setLabelTip(true, ULanHelper.WAIT_XIA_ZHU2);
            this.waitPlaySound("audio_qznn_ksxz");
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
        MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_ADD_SCORE_RESULT, data);

        let wAddJettonUser = data.addJettonUser;
        //是自己的结果
        if (wAddJettonUser == MKPQZJHModel.ins.gMeChairId) {
            this.setLabelTip(true, ULanHelper.WAIT_O_XIA_ZHU);
        }

        this._canGetCmd = true;
    }

    private do_no_send_card(data: any) {
        UDebug.Log("do_no_send_card cangetcmd =true")
        MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SCENE_OPEN_NOT_SEND_CARD
            , data);
        this._canGetCmd = true;
    }

    private do_fapai(data: any) {
        MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_SEND_CARD, data);

        var cbOpenTime = data.openTime;//发牌在游戏开始后
        var self = this;
        self.setDjs(cbOpenTime);
        UAudioManager.ins.playSound("audio_qznn_qkp");
        // this._delayAction = cc.sequence(cc.delayTime(0.5),
        //         cc.callFunc(() => {
        //             self.setDjs(cbOpenTime);
        //         }, this));

        // if (this._delayAction) {
        //     let acts = this.node.getNumberOfRunningActions();
        //     this.node.stopAction(this._delayAction);
        //     this.node.runAction(
        //         this._delayAction
        //     );
        // }



        // this._tmp_time = data.cbOpenTime; //发牌在下注后才用
        // this.setDjs(0);




        this.setLabelTip(false);
        this._canGetCmd = true;//因为只是翻最后一张牌,不需等动画
    }

    private do_look_pai(data: any) {
        UDebug.Log("do_look_pai:" + JSON.stringify(data));
        MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_OPEN_CARD_RESULT, data);

        var wOpenCardUser = data.openCardUser;
        if (wOpenCardUser == MKPQZJHModel.ins.gMeChairId) {
            this.setLabelTip(true, ULanHelper.WAIT_PIN_CARD);
        }
    }

    private do_game_end(data: any) {
        // this.setDjs(0);
        /* ######################## 
        
        */

        MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_END, data);
        this.setLabelTip(false);

        // this._music.playOver();

        // this.unscheduleAllCallbacks();

        this._canGetCmd = true;

        var dTotalScore = data.totalScore;
        if (dTotalScore != null) {
            for (let i = 0; i < dTotalScore.length; i++) {
                const element = dTotalScore[i];
                let index = MKPQZJHModel.ins.getUISeatId(i);
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
            MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE);
            MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_CONTINUE_ACTIVE, true);
        }

    }
    private do_show_match(): void {
        // MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE);
        // MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_CONTINUE_ACTIVE, true);
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
    //     MKPQZJHModel.ins.onOperateFail(data);

    // }



    // onTongSha() {
    //     MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_TONGSHA_EVENT);
    // }

    // onTongPei() {
    //     MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_TONGPEI_EVENT);
    // }

    //#endregion
}
