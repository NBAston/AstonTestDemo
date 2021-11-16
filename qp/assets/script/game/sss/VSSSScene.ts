import UGame from "../../public/base/UGame";
import USpriteFrames from "../../common/base/USpriteFrames";
import VSSSSeat from "./VSSSSeat";
import VMatch from "./VSSSMatch";
import { REGSSSSTR, ESSSState, ESSSPlayerInfo, SSSPX } from "./ssshelp/USSSData";
import VSSSPokeManage from "./VSSSPokeManage";
import USSSMusic from "./ssshelp/USSSMusic";
import UCoinDFlyHelper from "../../common/utility/UCoinFlyHelper";
import UDebug from "../../common/utility/UDebug";
import UNodeHelper from "../../common/utility/UNodeHelper";
import Ujsreport from "../../common/utility/Ujsreport";
import SSSMenu from "./SSSMenu";
import UEventHandler from "../../common/utility/UEventHandler";
import MSSS, { SSS_SELF_SEAT } from "./MSSS";
import AppGame from "../../public/base/AppGame";
import { EEnterRoomErrCode, ECommonUI, ELevelType, EGameType, ETipType, ERoomKind } from "../../common/base/UAllenum";
import ULanHelper from "../../common/utility/ULanHelper";
import UHandler from "../../common/utility/UHandler";
import { ToBattle } from "../../common/base/UAllClass";
import { s13s } from "../../common/cmd/proto";
import UDateHelper from "../../common/utility/UDateHelper";
import { ZJH_SCALE } from "../zjh/MZJH";
import UResManager from "../../common/base/UResManager";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import { group } from "console";
import VSSSDetail from "./VSSSDetail";
import UStringHelper from "../../common/utility/UStringHelper";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";
import AppStatus from "../../public/base/AppStatus";
import MRoomModel from "../../public/hall/room_zjh/MRoomModel";
import VClubRoomInfo from "../../public/hall/club/VClubRoomInfo";
import MHall, { NEWS } from "../../public/hall/lobby/MHall";



const { ccclass, property } = cc._decorator;
/**
 * 创建:gss
 * 作用:十三水场景ui类
 */

@ccclass
export default class VSSSScene extends UGame {

    @property(cc.Font) winFont: cc.Font = null;
    @property(cc.Font) lastFont: cc.Font = null;
    @property({ type: cc.Node, tooltip: "聊天按钮节点" }) chatBtnNode: cc.Node = null;
    @property({ type: sp.Skeleton, tooltip: "开始游戏动画" }) ksyxSp: sp.Skeleton = null;
    @property({ type: sp.Skeleton, tooltip: "洗牌动画" }) xiPaiSp: sp.Skeleton = null;
    private _menuNode: cc.Node
    private _playerNode: cc.Node
    private _gameRoot: cc.Node
    private _res: USpriteFrames;
    private _seats: { [key: number]: VSSSSeat }
    private _match: VMatch;
    private _paixingNode: cc.Node;
    private _msgRegarr: Array<REGSSSSTR>
    private _pkManage: VSSSPokeManage;
    /**本局编号 */
    private _bianhao: cc.Label;
    private _dizhuLab: cc.Label;
    /**通杀通赔动画 */
    private _tong_Ani: sp.Skeleton;
    /**胜利动画 */
    private _win_Ani: sp.Skeleton;

    private _colorArg: cc.Color[];
    private _dunScore: cc.Node[];
    private _xjlcNode: cc.Node
    private _btnGoon: cc.Node
    private _btnDetail: cc.Node
    private _scorebg: cc.Node
    private _scorelab: cc.Label
    private _music: USSSMusic;
    private _detailPanel: VSSSDetail;
    private _coinFlyHelper: UCoinDFlyHelper;
    /**动态金币数组长度 */
    private _coins_length: number = 12;
    private _enterMinScore: number;
    /**4个头像的位置  和中间位置 */
    private _headpos = {
        [0]: cc.v2(-256, -251),
        [1]: cc.v2(567, -16),
        [2]: cc.v2(235, 209),
        [3]: cc.v2(-567, -16),
        [4]: cc.v2(0, 0),
    }
    private _QLDAni: sp.Skeleton;  //全垒打动画
    private _isPTPX: boolean  //玩家中是否含普通牌型
    private _selfIsTSPX: boolean //自己是不是特殊牌型
    private _charge_btn: cc.Node;
    private sss_pjbg: cc.Node;
    public _curTime: number = 0   //记录后台当前剩余时间
    private _isExit_nextRound = false;
    private _deltascore: number = 0; //每局的总分
    /**初始化 */
    init() {
        UDebug.Log("十三水初始化------------------")
        this._gameRoot = UNodeHelper.find(this.node, "uiroot/content")
        this._res = this.node.getComponent(USpriteFrames);
        let lableNode = UNodeHelper.find(this._gameRoot, "TRPos/idbg");
        this._bianhao = UNodeHelper.getComponent(lableNode, "bianhao", cc.Label); //编号
        this._dizhuLab = UNodeHelper.find(this._gameRoot, "dizhu").getComponent(cc.Label);  //底注
        this._music = new USSSMusic()
        // //金币飞行
        // let coinfly_parent = UNodeHelper.find(this._gameRoot, "coin_node");
        // let coin_temp = UNodeHelper.find(coinfly_parent, "sss_coin");  //金币预制
        // this._coinFlyHelper = new UCoinDFlyHelper(coin_temp, coinfly_parent, this._headpos);
        this._isExit_nextRound = false
        this.initMath()
        this.initMenu()
        this.initSeat()
        this.initPoke()
        this.initCeshi()
        this.initdunScore()
        this._charge_btn = UNodeHelper.find(this._gameRoot, "players_node/seat_1/charge_btn");
        this._charge_btn.active = true
        UEventHandler.addClick(this._charge_btn, this.node, "VSSSScene", "intoCharge")
        this.sss_pjbg = UNodeHelper.find(this._gameRoot, "TRPos/idbg");
        UEventHandler.addClick(this.sss_pjbg, this.node, "VSSSScene", "oncopy");
        this._xjlcNode = UNodeHelper.find(this._gameRoot, "toggle_xjlc");
        //继续游戏
        this._btnGoon = UNodeHelper.find(this.node, "uiroot/content/myturn_node/btn_goon");
        UEventHandler.addClick(this._btnGoon, this.node, "VSSSScene", "goonGame");
        //总分
        this._scorebg = UNodeHelper.find(this.node, "uiroot/content/poker_node/scorebg")
        this._scorebg.active = false
        this._scorelab = UNodeHelper.getComponent(this.node, "uiroot/content/poker_node/scorebg/score", cc.Label)
        //结算详情
        this._btnDetail = UNodeHelper.find(this.node, "uiroot/content/poker_node/scorebg");
        UEventHandler.addClick(this._btnDetail, this.node, "VSSSScene", "showDetail");

        this._detailPanel = UNodeHelper.getComponent(this.node, "uiroot/content/detailPanel", VSSSDetail);

        this.refChatbtnNodeAct(AppGame.ins.currRoomKind != ERoomKind.Club ? false : true);
    }

    showDetail() {
        this._detailPanel.show()
    }

    //点击复制牌局信息
    private oncopy(): void {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this._bianhao.string).substr(5, 30));
    }

    /**
     * @description 下局按钮显示隐藏
     * @param type 1是  2 是正常判断
     * @param boolean 是否显示
     */
    setXJLCNodeActive(type: number, boolean: boolean = false) {
        if (type == 1) {
            this._xjlcNode.active = boolean;
        } else {
            // this._battleplayer[AppGame.ins.roleModel.useId].userStatus == 5
            // let _battleplayer = AppGame.ins.sssModel.gBattlePlayer;
            // if (_battleplayer && _battleplayer[AppGame.ins.roleModel.useId]) {
            //     let userStatus = _battleplayer[AppGame.ins.roleModel.useId].userStatus;
                this._xjlcNode.active = boolean;// ? (userStatus >= 5) : boolean;
            // };
        };
    }

    //初始化每墩比牌时的分值ui
    private initdunScore() {
        //0-正值颜色 1-负值颜色
        this._colorArg = [cc.color(221, 219, 71, 255), cc.color(8, 0, 250, 255)]
        this._dunScore = new Array()
        let dunScoreNodeBg = UNodeHelper.find(this._gameRoot, "dunScoreBg")
        for (let i = 1; i <= 4; i++) {
            let _node = UNodeHelper.find(dunScoreNodeBg, "score" + i)
            let _nameImg = UNodeHelper.find(dunScoreNodeBg, "score" + i + "/nameImg")
            this._dunScore[i - 1] = _node
            this._dunScore[i - 1]["nameImg"] = _nameImg
            this._dunScore[i - 1].active = false
        }

        let dunScoreNode = UNodeHelper.find(this._gameRoot, "dunScore")
        for (let i = 1; i <= 4; i++) {
            let _node = UNodeHelper.find(dunScoreNode, "score" + i)
            let _score = UNodeHelper.getComponent(_node, "score", cc.Label)
            let _plus = UNodeHelper.getComponent(_node, "plus", cc.Label)
            this._dunScore[i - 1]["scoreNode"] = _node
            this._dunScore[i - 1]["score"] = _score
            this._dunScore[i - 1]["plus"] = _plus
            this._dunScore[i - 1]["score"].node.active = false
            this._dunScore[i - 1]["plus"].node.active = false
        }
    }
    //**测试模块 */
    private initCeshi() {
        let ceshibtnclickarr = {
            [1]: this.onclickceshi1,
            [2]: this.onclickceshi2,
            [3]: this.onclickceshi3,
            [4]: this.onclickceshi4,
        }
        let ceshiNode = UNodeHelper.find(this.node, "uiroot/content/ceshinode")
        for (let i = 1; i <= 4; i++) {
            UNodeHelper.getComponent(ceshiNode, "ceshibtn" + i, cc.Button).node.on('click', ceshibtnclickarr[i], this)
        }
    }

    //测试的函数 点击牌型组合选择提示面板
    onSelectTishi(event: cc.Event, data: number) {
        this._pkManage.onSelectTishi(event, data)
        UDebug.Log(data)
    }

    //测试的函数
    private onclickceshi1() {
        UDebug.Log("onclickceshi1开始")
        this._pkManage.fapaiAni(1)
        this._pkManage.fapaiAni(2)
        this._pkManage.fapaiAni(3)
        //玩家显示

    }
    private onclickceshi2() {
        UDebug.Log("onclickceshi2发牌")
        this._pkManage.stopfapaiAni()
        this._pkManage.kaipaiAni(1)
        this.playCoinFlyAni(1, 2);
        this.playCoinFlyAni(0, 2);
        Ujsreport.doReport("错误测试消息");
    }
    private onclickceshi3() {
        UDebug.Log("onclickceshi3摆拍")
        this._pkManage.setliPaiPanel(true)
        this.playCoinFlyAni(2, 3);
    }
    private onclickceshi4() {
        UDebug.Log("onclickceshi4测试")
        this.playCoinFlyAni(3, 0);
    }
    /**初始化菜单 */
    private initMenu() {
        this._menuNode = UNodeHelper.find(this._gameRoot, "menu")
        new SSSMenu(this._menuNode).showMenu(false)
    }

    showMenu() {
        this._menuNode.active = !this._menuNode.active
    }

    /**初始化座位 */
    private initSeat() {
        this._seats = {};
        this._playerNode = UNodeHelper.find(this._gameRoot, "players_node");
        this._paixingNode = UNodeHelper.find(this._gameRoot, "fx_node"); //没用到
        let len = this._playerNode.childrenCount
        len = 4
        for (let i = 1; i <= len; i++) {
            let idx = i;
            let st = UNodeHelper.find(this._playerNode, "seat_" + idx);
            //let paixing = UNodeHelper.find(this._paixingNode, "paixing_" + idx);
            let seat = new VSSSSeat(idx, st);
            this._seats[seat.seatId] = seat;
            seat.hideHead(); //隐藏 
        }
        //金币飞行
        let coinfly_parent = UNodeHelper.find(this._gameRoot, "coin_node");
        let coin_temp = UNodeHelper.find(coinfly_parent, "sss_coin");  //金币预制
        this._coinFlyHelper = new UCoinDFlyHelper(coin_temp, coinfly_parent, this._headpos);
    }

    /**通过userId获取道具节点 */
    getPropNodeByUserId(userId: number, callback: any = null) {
        for (let key in this._seats) {
            let seat = this._seats[key];
            let propNode = seat.getPropNode();
            let bindUserId = propNode.getComponent(GamePropManager).getBindUserId();
            if (bindUserId && (userId == bindUserId)) {
                callback && callback(propNode);
            }
        };
    }
    /**通过userId获取聊天节点 */
    getChatPropNodeByUserId(userId: number, callback: any = null) {
        for (let key in this._seats) {
            let seat = this._seats[key];
            let chatProp = seat.getChatPropNode();
            let bindUserId = chatProp.getComponent(VGameChatPropManager).getBindUserId();
            if (bindUserId && (userId == bindUserId)) {
                callback && callback(chatProp);
            }
        };
    }

    /**初始化匹配 */
    private initMath() {
        this._match = UNodeHelper.getComponent(this._gameRoot, "match_node", VMatch);
        this._match.init();
        this._match.hide();
    }

    /**初始化牌组 */
    private initPoke() {
        let pokerNode = UNodeHelper.find(this._gameRoot, "poker_node");
        let lipaiNode = UNodeHelper.find(this._gameRoot, "lipai_node")
        this._pkManage = new VSSSPokeManage()
        this._pkManage.init(pokerNode, lipaiNode, this._res, this._music)
        this._QLDAni = UNodeHelper.getComponent(this._gameRoot, "QLDAniNode/QLDAniNode", sp.Skeleton);
        this._QLDAni.node.parent.active = false
    }

    update(dt) {
        if (this._pkManage)
            this._pkManage.update(dt)
        MSSS.ins.updateM(dt)
    }
    onDestroy() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId)
        }
    };
    private timeoutId: any = null;
    /**进入失败 */
    enter_room_fail(errorCode: number, errorMsg?: any): void {
        let msg = errorMsg;
        this._isExit_nextRound = true;
        if (errorCode == 7 || errorCode == 16) {
            // msg = "您的金币不足，该房间需要" + this._enterMinScore * ZJH_SCALE + "金币以上才可以下注";
            // this.scheduleOnce(() => {
            // }, 4)
            this.timeoutId = setTimeout(() => {
                this.timeoutId = null;
                super.enter_room_fail(errorCode, errorMsg)
            }, 4)


        } else {
            // if (!msg) {
            //     msg = ULanHelper.ENTERROOM_ERROR[errorCode];
            // }
            super.enter_room_fail(errorCode, errorMsg)
        }
        // AppGame.ins.showUI(ECommonUI.NewMsgBox, {
        //     type: 1, data: msg, handler: UHandler.create(() => {
        //         AppGame.ins.loadLevel(ELevelType.Hall, EGameType.SSS);
        //     }, this)
        // });
    }

    /**短线回来 */
    protected reconnect_in_game_but_no_in_gaming(): void {
        super.reconnect_in_game_but_no_in_gaming()
        UDebug.Log("reconnect_in_game_but_no_in_gaming..............")
        this._match.hide();
        this._pkManage.clear();
        this._pkManage.clearDun();
        this.clearRes();
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                if (element.seatId == 0) {
                    // element.showbaseInfo(AppGame.ins.sgModel.getshowselfinfo());
                } else
                    element.hideHead();
            }
        }

        AppGame.ins.gamebaseModel.alreadExitGame();
        //this.clearRes()
    }


    /**
    * 场景被打开
    * @param data 
    *//**sq 修改 需要是否是断线重连进来的 data:ToBattle */
    openScene(data: any): void {
        super.openScene(data);
        if (data) {
            let dt = data as ToBattle;
            MSSS.ins.saveRoomInfo(dt.roomData);
            if (dt.roomData) {
                this._pkManage.setLev(dt.roomData.gameId, dt.roomData.roomId)
                this._enterMinScore = data.roomData.enterMinScore;
            }
        }
        this._music.playGamebg();  //游戏背景音乐
        this.setXJLCNodeActive(1, false);
    }



    /** 等待游戏开始*/
    waitbattle(): void {
        UDebug.Log("等待游戏开始")
        if (this._isExit_nextRound) return;
        MSSS.ins.setGameState(ESSSState.Wait);
        this._match.show();
        this._scorebg.active = false
        this.setXJLCNodeActive(1, false);
        this._detailPanel.node.active = false
        this.sss_pjbg.active = false;
        for (let i = 0; i < 4; i++) {
            this._seats[i].refFloatingPoints();
        };
    }
    // /**
    //  * @descriptio  通过下局离场 刷新游戏状态
    //  */
    // refGameCmdByNextExit() {
    //     if (this._isExit_nextRound) {
    //         AppGame.ins.sssModel._canGetCmd = false;
    //     } else {
    // AppGame.ins.sssModel._canGetCmd = false;
    //     };
    // };

    protected onEnable() {
        super.onEnable()
        UDebug.Log("vsssscene 加载。。。。。")
        MSSS.ins.run();
        //消息列表
        this._msgRegarr = [{ id: MSSS.CC_UPDATA_SEAT_INFO, fun: this.updatePlayer },
        { id: MSSS.CC_TS_UPDATA_GAME_INFO, fun: this.updata_game_info },

        { id: MSSS.GAME_START, fun: this.gamestart },
        { id: MSSS.CC_GAME_MANUAKCARD, fun: this.gameManualCards },
        { id: MSSS.CC_GAME_COMPARE, fun: this.gameCompareCard },
        { id: MSSS.CC_GAME_GAME_END, fun: this.gameendNew },
        { id: MSSS.CC_GAME_FINISHCARD, fun: this.onefinishCards },

        { id: MSSS.CC_CLEAR_RES, fun: this.clearRes },
        { id: MSSS.CC_CANCELCARDS, fun: this.gamecancelCards },
        { id: MSSS.CC_ROUNDEND_EXIT, fun: this.gameRoundEndExit },


        { id: MSSS.CC_GAME_SCENE_FREE, fun: this.gameScenefree },
        { id: MSSS.CC_GAME_SCENE_GROUP, fun: this.gameSceneGroup },
        { id: MSSS.CC_GAME_SCENE_OPEN, fun: this.gameSceneOpen },
        { id: MSSS.CC_GAME_SCENE_END, fun: this.gameSceneEnd },
        { id: MSSS.PLAYER_EXIT, fun: this.playerExitRef },
        ]
        //注册消息
        this._msgRegarr.forEach(element => {
            MSSS.ins.on(element.id, element.fun, this)
        });

        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
    }
    /**
     * @description  押后台
     */
    sceneHideUi1() {
        this.ksyxSp.setAnimation(0, "", false);
        this.ksyxSp.setCompleteListener(() => { });
        this.xiPaiSp.setAnimation(0, "", false);
        this.xiPaiSp.setCompleteListener(() => { });
        this.xiPaiSp.node.active = false;
        this.ksyxSp.node.active = false;
        this._match.hide();
        this._scorebg.active = false
    };
    sceneHideUi() {
        this._arrSeq.length = 0
        this._paixingNode.stopAllActions();
        this._coinFlyHelper.resetAll();
        this._pkManage.clear();
        this._pkManage.clearDun();
        this._pkManage.clearpoke();
        AppGame.ins.sssModel.clearCmds();
        AppGame.ins.sssModel.cmdRun();
        this.refChatbtnNodeAct(true);
        this.node.stopAllActions();
        this.unscheduleAllCallbacks();
        // this._bianhao.node.active = false;
        // this._dizhuLab.node.active = false;
        this.clearShui()
        this.hideShui()
        this._QLDAni.node.parent.active = false

    }
    /**
     * 游戏切换到后台
     * @param isHide 是否切在后台
     */
    onGameToBack(isBack: boolean) {
        if (!isBack) {
            this.sceneHideUi1();
            if (AppGame.ins.sssModel._state == ESSSState.Wait && AppGame.ins.currRoomKind != ERoomKind.Club) {
                AppGame.ins.sssModel.sendFreshGameScene();
                return
            }
            if (this._isExit_nextRound) {
                for (let i = 0; i < 4; i++) {
                    this._seats[i].hideHead();
                };
            };
            // this._arrSeq.length = 0
            // this._paixingNode.stopAllActions();
            // this._coinFlyHelper.resetAll();
            // this._pkManage.clear();
            // this._pkManage.clearDun();
            // AppGame.ins.sssModel.clearCmds();
            // AppGame.ins.sssModel.cmdRun();

            // this.refChatbtnNodeAct(true);
            // this.node.stopAllActions()
            // this.unscheduleAllCallbacks();
            // this._bianhao.node.active = false;
            // this._dizhuLab.node.active = false;
            // this.clearShui()
            // this.hideShui()
            AppGame.ins.sssModel.sendFreshGameScene();
        } else {
            this.sceneHideUi1();
            if (AppGame.ins.currRoomKind == ERoomKind.Club) {
                AppGame.ins.sssModel._canGetCmd = false;
                return
            };

        };
    }


    protected onDisable() {
        super.onDisable()
        UDebug.Log("sss scene 退出。。。。。")
        this._msgRegarr.forEach(element => {
            MSSS.ins.off(element.id, element.fun, this)
        });
        MSSS.ins.exit();
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
    }
    /**
     * @description   设置聊天按钮的显示隐藏
     * @param boo 
     */
    refChatbtnNodeAct(boo: boolean) {
        this.chatBtnNode.active = boo;;
    }

    /**更新场景编号等显示 */
    private updata_game_info(roundid: string, difen: number): void {
        this._bianhao.node.active = true;
        this._dizhuLab.node.active = true;
        this._dizhuLab.string = "底注: " + (difen / 100).toString();
        if (roundid != "") {
            this._bianhao.node.parent.active = true;
            this._bianhao.string = ULanHelper.GAME_NUMBER + roundid;
        }
        else {
            this._bianhao.node.parent.active = false;
            this._bianhao.string = ULanHelper.GAME_NUMBER;
        }

    }

    //显示玩家
    private updatePlayer(player: ESSSPlayerInfo): void {

        for (const key in player) {
            const element = player[key];
            let seatId = AppGame.ins.sssModel.getUISeatId(element.chairId);
            if (element.userStatus >= 0 && seatId != null) {
                this._seats[seatId].bind(element);
                if (element.userStatus == 5) {
                    this._seats[seatId].showHead()
                }
                else {
                    if (seatId == 0) {
                        this._seats[seatId].showHead()
                    } else {
                        if (AppGame.ins.currRoomKind == ERoomKind.Club && element.userStatus != 0) {
                            this._seats[seatId].showHead();
                        } else {
                            // this._pkManage.clearPokerBySeatId(seatId);
                            this._seats[seatId].hideHead();
                        };

                    }
                }
            }
        }
        UDebug.Log("更新玩家列表" + JSON.stringify(player))
    }
    /**
     * @description 玩家退出
     */
    private playerExitRef(data: ESSSPlayerInfo) {
        let seatId = AppGame.ins.sssModel.getUISeatId(data.chairId);
        this._seats[seatId].hideHead();
        this._pkManage.clearPokerBySeatId(seatId)
        // let seatId = MSSS.ins.getUISeatId(caller.peers[key].chairId)
    };

    //理牌场景消息
    private gameSceneGroup(data: s13s.CMD_S_StatusGroup) {
        this.sceneHideUi1();
        this.sceneHideUi();

        this.setXJLCNodeActive(2, AppGame.ins.currRoomKind == ERoomKind.Club);
        this.fapaiAni(false)
        let isLiPai: boolean = false;
        let isGameing: boolean = false;
        for (const key in data.players) {
            const element = data.players[key];
            var seatId = MSSS.ins.getUISeatId(element.chairId)
            if (element.selected == 1) {
                UDebug.Log("完成理牌。。。。" + seatId)
                this.onefinishCards(seatId)
            }
            if (seatId == 0 && data.players[key].selected == 0 && data.players[key].status >= 5) {
                let wTimeLeft = data.wTimeLeft;
                isLiPai = true;
                this.scheduleOnce(() => {
                    this._pkManage.initScenelipaiPanelData(data)
                }, wTimeLeft - 25 > 0 ? wTimeLeft - 25 : 0);
            }
            if (seatId == 0 && data.players[key].status >= 5) {
                isGameing = true;
            };
        }
        if (!isLiPai) {
            this._pkManage.enterTurn(data.wTimeLeft, data.wTimeLeft)  //倒计时
            let isAutoOpertor = false;
            this._pkManage.onquedingbtnibtn(null, isAutoOpertor, isGameing);
        }
    }

    //比牌场景消息
    private gameSceneOpen(data: s13s.CMD_S_StatusOpen) {
        this.sceneHideUi1();
        this.sceneHideUi();
        this.fapaiAni(false)
        this.setXJLCNodeActive(2, AppGame.ins.currRoomKind == ERoomKind.Club);
        for (const key in data.players) {
            const element = data.players[key];
            var seatId = MSSS.ins.getUISeatId(element.chairId)
            if (element.selected == 1) {
                UDebug.Log("完成理牌。。。。" + seatId)
                this.onefinishCards(seatId)
            }
            if (seatId == 0 && data.players[key].selected == 0 && data.players[key].status >= 5) {
                this._pkManage.initScenelipaiPanelData(data)
            }
        }
    }

    //游戏结束场景消息
    private gameSceneEnd(data: s13s.CMD_S_StatusEnd) {
        this.sceneHideUi1();
        this.sceneHideUi();
        this.setXJLCNodeActive(1, false);
        UDebug.Log("游戏结束场景")
        this.waitbattle()
        this.refChatbtnNodeAct(AppGame.ins.currRoomKind != ERoomKind.Club ? false : true);
    }

    //游戏结束场景消息  
    private gameScenefree(data: s13s.CMD_S_StatusFree) {
        UDebug.Log("等待空闲开始")
        this.sceneHideUi1();
        this.sceneHideUi();
        this.waitbattle()
    }
    /**
     * 
     * @param data 游戏开始
     */
    private gamestart(data: s13s.CMD_S_GameStart) {
        this.sceneHideUi();
        this.sceneHideUi1();
        if (AppGame.ins.sssModel._state == ESSSState.Wait) {
            return
        }
        this.setXJLCNodeActive(1, AppGame.ins.currRoomKind == ERoomKind.Club);
        this.refChatbtnNodeAct(true);
        this._music.playStart();  //游戏开始
        this._match.hide()
        this.ksyxSp.node.active = true;
        this.ksyxSp.setAnimation(0, "ksyx", false);
        this.ksyxSp.setCompleteListener((event) => {
            this.ksyxSp.node.active = false;
            this.xiPaiSp.node.active = true;
            this.xiPaiSp.setAnimation(0, "xipai", false);
            this.xiPaiSp.setCompleteListener((event) => {
                let aniName = event["animation"]["name"];
                if (aniName == "xipai") {
                    this.xiPaiSp.setAnimation(0, "fapai_center", false);
                    this.fapaiAni()
                } else {
                    this.xiPaiSp.node.active = false;
                    this.scheduleOnce(() => {
                        this._pkManage.enterTurn(data.wTimeLeft - 2 - 3, data.wTimeLeft - 2 - 3)  //倒计时
                        this._pkManage.initlipaiPanelData(data.handCards)
                    }, 0.5);
                }
            });

        })

    }

    private fapaiAni(isFaPai: boolean = true) {
        var players = MSSS.ins.gBattlePlayer;
        for (const key in players) {
            const element = players[key];
            let seatId = MSSS.ins.getUISeatId(element.chairId);
            if (element.isInGame) {
                this._pkManage.fapaiAni(seatId, isFaPai)
            }
        }
    }

    private gameManualCards(caller: s13s.CMD_S_ManualCards) {
        this._pkManage.setbtns(caller)
    }

    private gamecancelCards(caller: s13s.CMD_S_ManualCards) {
        this._pkManage.cancelCards(caller)
    }

    private gameRoundEndExit(caller: s13s.CMD_C_RoundEndExitResult) {
        UDebug.Info("处理下局离开逻辑");
        this._isExit_nextRound = caller.bExit;
        this._xjlcNode.getComponent(cc.Toggle).isChecked = caller.bExit;
    }

    private onefinishCards(seatid: number) {
        this._pkManage.stoponefapaiAni(seatid)
    }
    private _arrSeq = Array<cc.ActionInstant>()
    //开始比牌
    private gameCompareCard(caller: s13s.CMD_S_CompareCards, isReconnect: boolean) {
        cc.log("开始比牌", caller)
        this.sceneHideUi1();
        this.sceneHideUi();
        this.setXJLCNodeActive(2, AppGame.ins.currRoomKind == ERoomKind.Club);
        this._deltascore = caller.deltascore;
        this._pkManage.leaveTurn()
        this._music.playKSBP(MSSS.ins.selfUserSex);  //开始比牌
        this._pkManage.stopfapaiAni()

        //关闭倒计时
        this._pkManage.leaveFangpaiTurn()
        let isIngame: boolean = false;
        //结束摆牌的动画，显示发牌的背景图
        var players = MSSS.ins.gBattlePlayer;
        for (const key in players) {
            const element = players[key];
            let seatId = MSSS.ins.getUISeatId(element.chairId);
            if (element.isInGame) {
                this._pkManage.fangpaiReady(seatId);
            }
            if (element.userId == AppGame.ins.roleModel.useId) {
                isIngame = element.isInGame;
            }
        }
        this._arrSeq.length = 0;
        this.checkSelfTSPX(caller)  //检测自己牌型
        //显示特殊牌型的背面图片
        if (isIngame) {
            this.showTSPXBG(caller)
        }
        if (!isReconnect) {
            this.showCompareResult(caller, isIngame);
            //显示特殊牌型
            this.showTSPXBipai(caller, isIngame)
            //打枪
            this.showShoot();
            //显示括号后面的水数
            if (isIngame) {
                let extrashui = cc.callFunc(this.showExtrashui, this)
                this._arrSeq.push(extrashui)
            }

            //全垒打
            let qldAni = cc.sequence(cc.delayTime(1), cc.callFunc((target, data) => {
                this._pkManage.clearPmb()
                if (data == 1 || data == -1) {
                    this._music.playQLD(MSSS.ins.selfUserSex)
                    this._QLDAni.node.parent.active = true
                    this._QLDAni.setAnimation(0, "animation", false);
                    this._QLDAni.setCompleteListener((event) => {
                        UDebug.Log("全垒打是播放完毕。。。。。。")
                        this._QLDAni.node.parent.active = false
                    });
                }
            }, this, caller.allshoot))
            this._arrSeq.push(qldAni)
            if (caller.allshoot == 1 || caller.allshoot == -1) {
                this._arrSeq.push(cc.delayTime(1))
            }
            let showSeq = cc.sequence(this._arrSeq);
            // this.node.stopAllActions()
            this.node.runAction(showSeq)
        } else {
            //断线重连,不显示动画，直接显示数据
            this.showCompareResultReconnect(caller, isIngame);
        }

        this._scorelab.string = "总分: " + caller.deltascore
        this._detailPanel.data = caller
    }

    //游戏结束,飘分
    private gameendNew(resultdata: s13s.GameEndScore) {
        UDebug.Info("开始比牌" + JSON.stringify(resultdata))
        this.setXJLCNodeActive(1, false);
        var players = MSSS.ins.gBattlePlayer;
        for (const key in players) {
            const element = players[key];
            let seatId = MSSS.ins.getUISeatId(element.chairId);
            if (element.isInGame) {
                this._pkManage.fangpaiReady(seatId);
            }
            if (element.userId == AppGame.ins.roleModel.useId) {
                if (element.isInGame) {
                    this._scorebg.active = true
                }
            }
        }


        //飞金币动画
        let flygold = cc.callFunc(this.showFlygold, this, resultdata)
        let obj = {
            isIngame: true,
            result: resultdata
        }
        //显示结束
        let showresult = cc.callFunc(this.showResult, this, obj)
        //游戏结束
        let gameend = cc.callFunc(() => {
            if (AppGame.ins.currRoomKind != ERoomKind.Club) {
                this._btnGoon.active = true
                this._btnGoon.parent.active = true

            } else {
                if (this._isExit_nextRound) return;
                this.clearRes();
                this.waitbattle();
                MSSS.ins.refPlayerStatus();
            };
            this.refChatbtnNodeAct(AppGame.ins.currRoomKind != ERoomKind.Club ? false : true);
        })
        // this.node.stopAllActions()
        this.node.runAction(cc.sequence(flygold, showresult, cc.delayTime(3), gameend))
    }

    //显示特殊牌型背面图
    private showTSPXBG(caller: s13s.CMD_S_CompareCards) {
        if (caller.player.group.specialTy) {  //自己的
            if (caller.player.group.specialTy >= SSSPX.STH) {
                this._pkManage.showTSPXBG(0, true)
            }
        }
        for (const key in caller.peers) {  //其他人的
            if (caller.peers.hasOwnProperty(key)) {
                const element = caller.peers[key];
                if (element.group.specialTy) {
                    if (element.group.specialTy >= SSSPX.STH) {
                        let seatId = MSSS.ins.getUISeatId(element.chairId)
                        this._pkManage.showTSPXBG(seatId, true)
                    }
                }
            }
        }
    }

    //显示特殊牌型亮牌
    private showTSPXBipai(caller: s13s.CMD_S_CompareCards, isIngame: boolean) {
        let acArr = Array<cc.ActionInstant>()
        if (isIngame) {
            if (caller.player.group.specialTy) {  //自己的
                if (caller.player.group.specialTy >= SSSPX.STH) {
                    acArr.push(cc.callFunc((target, element) => {
                        this.showTSPXResult(target, element)
                    }, this, caller.player))
                    acArr.push(cc.delayTime(0.5))
                }
            }
        }
        for (const key in caller.peers) {  //其他人的
            if (caller.peers.hasOwnProperty(key)) {
                const element = caller.peers[key];
                if (element.group.specialTy) {
                    if (element.group.specialTy >= SSSPX.STH) {
                        acArr.push(cc.callFunc((target, element) => {
                            this.showTSPXResult(target, element)
                        }, this, element))
                        acArr.push(cc.delayTime(0.5))
                    }
                }
            }
        }

        let sp = cc.spawn(acArr);

        this._arrSeq.push(sp);
    }

    /**
     * 显示特殊牌型墩
     * @param data 
     */
    private showTSPXResult(target: any, data: s13s.IPlayerItem) {
        this._music.playTSPX()
        UDebug.Log(data.userId + " ----不比牌 有特殊牌型。。。。" + data.group.specialTy)
        this._pkManage.showTSPX(data)
    }


    private _itemscores: number[]  //比牌分
    private _itemscorePure: number[];  // + 号里面的输赢分
    private _scoreTotal = 0  //总水数
    private _endData: s13s.CMD_S_CompareCards = null;
    /**
     * 
     * @param arrSeq 比牌结果
     * @param caller 
     */
    private showCompareResult(caller: s13s.CMD_S_CompareCards, isIngame: boolean): any {
        this._endData = caller
        this._itemscores = Array()
        this._itemscores = caller.itemscores
        this._itemscorePure = new Array()
        this._itemscorePure = caller.itemscorePure
        this._scoreTotal = 0

        this.checkPTPX(caller, isIngame)
        //头墩
        // 头墩牌显示
        if (this._isPTPX) this._arrSeq.push(cc.delayTime(1.3))
        if (isIngame) {
            let showtd = cc.callFunc(this.showTD, this._pkManage, caller.player)
            this._arrSeq.push(showtd)
        } else {
            var otherObj = {
                chairId: caller.player.chairId,
                group: caller.player.group,
                deltascore: caller.deltascore
            }
            caller.peers.push(otherObj)
        }
        for (let i = 0; i < caller.peers.length; i++) {
            this._arrSeq.push(cc.callFunc(this.showTD, this._pkManage, caller.peers[i]))
        }

        // 头墩水数显示
        if (isIngame) {
            let showtdShui = cc.callFunc(this.showShui, this, 0)
            this._arrSeq.push(showtdShui)
        }

        //中墩
        if (this._isPTPX) this._arrSeq.push(cc.delayTime(1.3))
        if (isIngame) {
            let showzd = cc.callFunc(this.showZD, this._pkManage, caller.player)
            this._arrSeq.push(showzd)
        }
        for (let i = 0; i < caller.peers.length; i++) {
            this._arrSeq.push(cc.callFunc(this.showZD, this._pkManage, caller.peers[i]))
        }
        // 中墩水数显示
        if (isIngame) {
            let showzdShui = cc.callFunc(this.showShui, this, 1)
            this._arrSeq.push(showzdShui)
        }

        //尾墩
        if (this._isPTPX)
            this._arrSeq.push(cc.delayTime(1))
        if (isIngame) {
            let showwd = cc.callFunc(this.showWD, this._pkManage, caller.player)
            this._arrSeq.push(showwd)
        }
        for (let i = 0; i < caller.peers.length; i++) {
            this._arrSeq.push(cc.callFunc(this.showWD, this._pkManage, caller.peers[i]))
        }
        // 尾墩水数显示
        if (isIngame) {
            let showwdShui = cc.callFunc(this.showShui, this, 2)
            this._arrSeq.push(showwdShui)
        }
        return this._arrSeq;
    }

    //断线重连的比牌结果
    private showCompareResultReconnect(caller: s13s.CMD_S_CompareCards, isIngame: boolean) {
        let arrSeq = Array<cc.ActionInstant>()
        this._endData = caller
        this._itemscores = Array()
        this._itemscores = caller.itemscores
        this._itemscorePure = new Array()
        this._itemscorePure = caller.itemscorePure
        this._scoreTotal = 0

        //显示特殊牌型
        if (isIngame) {
            if (caller.player.group.specialTy) {  //自己的
                if (caller.player.group.specialTy >= SSSPX.STH) {
                    arrSeq.push(cc.callFunc(this.showTSPXResult, this, caller.player))
                    arrSeq.push(cc.delayTime(0.5))
                }
            }
        }
        for (const key in caller.peers) {  //其他人的
            if (caller.peers.hasOwnProperty(key)) {
                const element = caller.peers[key];
                if (element.group.specialTy) {
                    if (element.group.specialTy >= SSSPX.STH) {
                        arrSeq.push(cc.callFunc(this.showTSPXResult, this, element))
                        arrSeq.push(cc.delayTime(0.5))
                    }
                }
            }
        }

        this.checkPTPX(caller, isIngame)
        //头墩
        // 头墩牌显示
        let showtd = cc.callFunc(this.showTD, this._pkManage, caller.player)
        arrSeq.push(showtd)
        for (let i = 0; i < caller.peers.length; i++) {
            arrSeq.push(cc.callFunc(this.showTD, this._pkManage, caller.peers[i]))
        }

        // 头墩水数显示
        if (isIngame) {
            let showtdShui = cc.callFunc(this.showShui, this, 0)
            arrSeq.push(showtdShui)
        }

        //中墩
        let showzd = cc.callFunc(this.showZD, this._pkManage, caller.player)
        arrSeq.push(showzd)
        for (let i = 0; i < caller.peers.length; i++) {
            arrSeq.push(cc.callFunc(this.showZD, this._pkManage, caller.peers[i]))
        }
        // 中墩水数显示
        if (isIngame) {
            let showzdShui = cc.callFunc(this.showShui, this, 1)
            arrSeq.push(showzdShui)
        }

        let showwd = cc.callFunc(this.showWD, this._pkManage, caller.player)
        arrSeq.push(showwd)
        for (let i = 0; i < caller.peers.length; i++) {
            arrSeq.push(cc.callFunc(this.showWD, this._pkManage, caller.peers[i]))
        }
        // 尾墩水数显示
        if (isIngame) {
            let showwdShui = cc.callFunc(this.showShui, this, 2)
            arrSeq.push(showwdShui)
        }
        //显示括号后面的水数
        if (isIngame) {
            let extrashui = cc.callFunc(this.showExtrashui, this)
            arrSeq.push(extrashui)
        }

        let showSeq = cc.sequence(arrSeq)
        // this.node.stopAllActions()
        this.node.runAction(showSeq)
    }

    /**
     * 玩家中是否含 普通牌型
     * @param caller 
     */
    private checkPTPX(caller: s13s.CMD_S_CompareCards, isIngame: boolean) {
        this._isPTPX = false
        if (caller.player.group.specialTy == 0 || caller.player.group.specialTy < SSSPX.STH) { //是否是空值  普通牌型不传
            this._isPTPX = true
            return true //普通牌型    
        }
        for (let i = 0; i < caller.peers.length; i++) {
            if (caller.peers[i].group.specialTy == 0 || caller.player.group.specialTy < SSSPX.STH) {
                this._isPTPX = true
                return true //普通牌型 
            }
        }
        return false
    }

    /**
    * 自己是否是 特殊牌型
    * @param caller 
    */
    private checkSelfTSPX(caller: s13s.CMD_S_CompareCards) {
        if (caller.player.group.specialTy) {  //自己的
            if (caller.player.group.specialTy >= SSSPX.STH) {
                this._selfIsTSPX = true
                return true
            }
        }
        this._selfIsTSPX = false
        return false

    }
    private showTD(target: any, dundata: s13s.IPlayerItem) {
        this.showTD(target, dundata)  //this is  _pkManage
    }
    private showZD(target: any, dundata: s13s.IPlayerItem) {
        this.showZD(target, dundata)//this is  _pkManage
    }
    private showWD(target: any, dundata: s13s.IPlayerItem) {
        this.showWD(target, dundata)//this is  _pkManage
    }
    /**
     * 显示水数
     */
    private showShui(target: cc.Node, index: number) {
        if (this._itemscores.length == 0) return
        UDebug.Log("显示 水数。。。。。" + index)

        let moveby = cc.moveBy(0.01, new cc.Vec2(-100, 0))
        let moveby1 = cc.moveBy(0.05, new cc.Vec2(100, 0)).easing(cc.easeBackInOut())
        let spaw = cc.spawn(moveby1, cc.fadeTo(0.05, 255))
        this._dunScore[index].active = true
        this._dunScore[index].opacity = 1
        var color = cc.Color.BLACK;
        // this._dunScore[index]["plus"].font = this.winFont;
        this._dunScore[index]["plus"].node.active = false
        //显示自已的每墩分值
        if (this._selfIsTSPX) {  //显示自己特殊牌型水数
            this._dunScore[index]["score"].string = "+0"
            // this._dunScore[index]["score"].font = this.winFont;
            if (index == 2) {
                for (let i = 0; i < 3; i++) {
                    if (this._scoreTotal >= 0) {
                        // this._dunScore[i]["score"].font = this.winFont;
                    }
                    else {
                        // this._dunScore[i]["score"].font = this.lastFont;
                    }
                    // this._dunScore[i]["score"].font = this.winFont;
                    if (i == 3) {
                        // this._dunScore[i]["score"].string = `+${this._deltascore}`;
                    } else {
                        this._dunScore[i]["score"].string = "+0";
                    };
                    this._dunScore[i]["score"].node.stopAllActions();
                    this._dunScore[i]["score"].node.active = true;
                    this._dunScore[i].opacity = 255;
                };
                //总水数
                this._scoreTotal = this._itemscores[0]
                this._dunScore[3]["score"].string = this._deltascore > 0 ? "+" + this._deltascore : this._deltascore.toString();// this._scoreTotal >= 0 ? "+" + this._scoreTotal.toString() : this._scoreTotal.toString()
                this._dunScore[3]["score"].node.active = true
                this._dunScore[3].active = true;
                if (this._scoreTotal >= 0) {
                    // this._dunScore[3]["score"].font = this.winFont;
                }
                else {
                    // this._dunScore[3]["score"].font = this.lastFont;
                }
            }
        } else {//显示自己普通牌型水数
            this._dunScore[index].runAction(cc.sequence(moveby, spaw))
            var color = cc.Color.BLACK
            if (this._itemscores[index] >= 0) {
                // this._dunScore[index]["score"].font = this.winFont;
            }
            else {
                // this._dunScore[index]["score"].font = this.lastFont;
            }
            this._dunScore[index]["score"].string = this._itemscores[index] >= 0 ? "+" + this._itemscores[index].toString() : this._itemscores[index].toString()
            this._dunScore[index]["score"].node.active = true
            //总水数
            this._scoreTotal += this._itemscores[index]
            this._dunScore[3].active = true
            this._dunScore[3]["score"].node.active = true
            this._dunScore[3]["score"].string = this._scoreTotal >= 0 ? "+" + this._scoreTotal.toString() : this._scoreTotal.toString()

            if (this._scoreTotal >= 0) {
                // this._dunScore[3]["score"].font = this.winFont;
            }
            else {
                // this._dunScore[3]["score"].font = this.lastFont;
            }
            this._dunScore[3]["plus"].node.active = false
        }
        this._dunScore[index]["scoreNode"].runAction(cc.sequence(cc.scaleTo(0.2, 1.5), cc.scaleTo(0.2, 1)))
    }


    /**
     * 显示额外的水数
     * @param target 
     */
    private showExtrashui(target: cc.Node) {
        UDebug.Log("显示打枪后-----------------" + new Date().toLocaleString())
        this._dunScore[0]["score"].node.active = true
        this._dunScore[1]["score"].node.active = true
        this._dunScore[2]["score"].node.active = true

        for (const key in this._itemscorePure) {
            if (this._itemscorePure.hasOwnProperty(key)) {
                const element = this._itemscorePure[key];
                var color = cc.Color.BLACK
                if (element >= 0) {
                    // this._dunScore[key]["plus"].font = this.winFont;
                }
                else {
                    // this._dunScore[key]["plus"].font = this.lastFont;
                }
                this._dunScore[key]["plus"].string = element >= 0 ? "(+" + element.toString() + ")" : "(" + element.toString() + ")";
                this._dunScore[key]["plus"].node.active = true
            }
        }
        for (let index = 0; index < 4; index++) {
            const element = this._dunScore[index];
            //element.setContentSize(240,41)
            //UDebug.Log(element["nameImg"].x)
            //element["nameImg"].setPosition(-198,element["nameImg"].y) 
            //element["score"].node.setPosition(-82, element["score"].node.y)
        }

        this._dunScore[3]["scoreNode"].runAction(cc.sequence(cc.delayTime(0.2), cc.scaleTo(0.1, 1, 1.5), cc.scaleTo(0.1, 1, 1),
            cc.scaleTo(0.1, 1, 1.5), cc.scaleTo(0.1, 1, 1),
            cc.scaleTo(0.1, 1, 1.5), cc.scaleTo(0.1, 1, 1)))
    }

    private clearShui() {
        for (let index = 0; index < 4; index++) {
            const element = this._dunScore[index];
            element["score"].string = "0";
            element["plus"].string = "(0)";

            //element.setContentSize(197,41)
            //element["nameImg"].setPosition(-150,element["nameImg"].y)
            // element["score"].node.setPosition(0, element["score"].node.y)
        }


    }
    //显示打枪
    private showShoot() {
        let shoot = function (this) {
            const caller = this._endData;
            for (let key in caller.peers) {
                this.scheduleOnce(() => {
                    let shootseatId = MSSS.ins.getUISeatId(caller.peers[key].chairId)
                    let fromshootIds = caller.peers[key].fromshootIds;  //作为被打枪者(shoot=-1)，来自打枪者座椅ID列表
                    let toshootIds = caller.peers[key].toshootIds;//作为打枪者(shoot=1)，被打枪者座椅ID列表

                    if (toshootIds && toshootIds.length > 0) {
                        this.playShoot(shootseatId, true);
                        for (let k in toshootIds) {
                            let shooter = toshootIds[k];
                            let seatId = MSSS.ins.getUISeatId(shooter)
                            this.playShoot(seatId, false)
                        };
                    };
                    if (fromshootIds && fromshootIds.length > 0) {
                        this.playShoot(shootseatId, false);
                        for (let k in fromshootIds) {
                            let fromshootId = fromshootIds[k];
                            let seatId = MSSS.ins.getUISeatId(fromshootId)
                            this.playShoot(seatId, true)
                        };
                    };
                }, 1)
            };
        };
        this._arrSeq.push(cc.callFunc(shoot, this))
    }

    /**
     * 播放打枪动画
     * @param index   播放位置
     * @param shooter   是否是打枪者
     */
    private playShoot(index: number, shooter: boolean) {
        this._pkManage.playShoot(index, shooter);
        // let player = MSSS.ins.gBattlePlayer;
        // for (let key in player) {
        //     let chairId = player[key]["chairId"];
        //     let seatId = MSSS.ins.getUISeatId(chairId);
        //     if (seatId == chairId) {
        //         this._pkManage.playShoot(index, shooter);
        //         break;
        //     };
        // };

    }
    /**
     * 飞金币
     */
    private showFlygold(target: cc.Node, resultData: s13s.GameEndScore) {
        let winArr = new Array<number>()
        let loseArr = new Array<number>()
        for (const key in resultData) {
            if (resultData.hasOwnProperty(key)) {
                const element = resultData[key];
                for (let i = 0; i < element.length; i++) {
                    let seatId = MSSS.ins.getUISeatId(element[i].chairId)
                    let boo = MSSS.ins.isPurelyPlayer("chairId", element[i].chairId);
                    if (boo) {
                        if (element[i].score > 0) {
                            winArr.push(seatId)
                        } else if (element[i].score < 0) {
                            loseArr.push(seatId)
                        }
                    };
                };

            }
        }

        //金币从输方飞进池子里大约0.7s
        loseArr.forEach(element => {
            this.playCoinFlyAni(element, 4)

        })

        this._paixingNode.runAction(cc.sequence(
            cc.delayTime(0.7),
            cc.callFunc(() => {
                //金币从池子飞向赢家
                winArr.forEach(element => {
                    this.playCoinFlyAni(4, element)
                })
            })
        ))

    }

    /**
     * 显示结果
     * @param resultData 
     */
    private showResult(target: cc.Node, obj: any) {
        let resultdata: Object = obj.result;
        let isIngame = obj.isIngame;
        var players = MSSS.ins.gBattlePlayer;
        for (const key in resultdata) {
            if (resultdata.hasOwnProperty(key)) {
                const element = resultdata[key]
                for (let i = 0; i < element.length; i++) {
                    let seatId = MSSS.ins.getUISeatId(element[i].chairId)
                    if (isIngame) {
                        this._seats[seatId].resultDel(element[i].score)
                        this._seats[seatId].setScore(element[i].userscore)
                    }
                }

            }
        }
    }

    /**
     * fontName "H"  or "L"
     */
    private loadFont(fontName: string, fontNode: cc.Label) {
        let url = "font/sss_score" + fontName
        let bundle = cc.assetManager.getBundle(AppGame.ins.roomModel.BundleName)
        bundle.load(url, cc.Font, (error, res: any) => {
            if (error) {
                UDebug.Log(error);
            }
            fontNode.font = res
        });
    }

    /**金币飞行动画 */
    private playCoinFlyAni(start: number, end: number) {
        if (start < 0 || start > 4 || end < 0 || end > 4) return;
        // UDebug.Log("金币飞行动画")
        for (let i = 0; i < this._coins_length; i++) {
            var item = this._coinFlyHelper.getInstans();
            item.setPosition(this._headpos[start]);
            this._coinFlyHelper.moveChipToRect(item, start, end);
        }
        /**播10次声音 */
        //for (let j = 0; j < 5; j++) {
        this._music.playflyCoin()
        //}
        this.scheduleOnce(() => {
            this.spineWinner(end);
        }, 0.5);
    }
    private spineWinner(index: number) {
        let pl = this._seats[index];
        if (pl != null) {
            // if (pl.isOnRound) {
            pl.showWinnerSpine();
            // }
        }
    }



    //充值
    private intoCharge(): void {
        AppGame.ins.showUI(ECommonUI.LB_Charge);
    }

    /**胜利动画 */
    private winAni(iswin: boolean, waittime?: number) {
        if (iswin) {
            if (waittime != null) { //通杀/赔完再播"我赢了"动画
                this._win_Ani.unscheduleAllCallbacks();
                this._win_Ani.scheduleOnce(() => {
                    this.setWinAni(true, "win");
                }, waittime);
            }
            else {
                this.setWinAni(true, "win");
            }
        }
        else {
            if (waittime != null) {
                this._win_Ani.unscheduleAllCallbacks();
                this._win_Ani.scheduleOnce(() => {
                    this.setWinAni(true, "lost");
                }, waittime);
            }
            else {
                this.setWinAni(true, "lost");
            }
        }
    }

    /**设置胜利/输 动画 */
    private setWinAni(b: boolean, str?: string) {
        this._win_Ani.node.active = b;
        if (b && str != null) {
            // this._tmp_sp_name = str;
            this._win_Ani.animation = str;
            this._win_Ani.setAnimation(0, str, false);
        }
    }


    hideShui() {
        this._dunScore.forEach(element => {
            element.active = false
        })
        for (let index = 0; index < 4; index++) {
            this._dunScore[index]["score"].node.active = false
            this._dunScore[index]["plus"].node.active = false
        }
    }

    //清理数据
    clearRes(): void {
        this.node.stopAllActions()
        this._bianhao.node.active = false;
        this._dizhuLab.node.active = false;
        this.clearShui()
        this.hideShui()
        MSSS.ins.clearCmds()
        this._pkManage.clear();
        for (let i = 0; i < 4; i++) {
            this._seats[i].clear()
        }
        if (AppGame.ins.currRoomKind != ERoomKind.Club) {
            MSSS.ins.clearPlayer()
        }
    }
    // 游戏进入后台 true
    private gameToLeft() {
        this._curTime = UDateHelper.Date().getTime()
        UDebug.Log("游戏进入后台。。。。" + this._curTime)
    }
    // 游戏进入前台 true
    private gameToback() {
        const time = UDateHelper.Date().getTime()
        const changeTime = time - this._curTime
        const aftertime = changeTime % 100000 / 1000
        UDebug.Log("游戏进入前台。。。。" + aftertime)
        this._pkManage.syncCDTime(aftertime)
    }

    /**是否退出游戏 */
    private isExitGame(e: cc.Toggle) {
        UDebug.Log(e.isChecked);
        MSSS.ins.sendNextExit(e.isChecked)
    }

    /**继续游戏按钮回调 */
    private goonGame(): void {
        UDebug.Log("继续游戏按钮回调")
        this.clearRes();
        this.waitbattle();
        AppGame.ins.roomModel.requestMatch(true, MSSS._tableId)
        this._btnGoon.active = false
        this._btnGoon.parent.active = false
    }

    /**
     * @description 点击聊天
     */
    onChat() {
        AppGame.ins.showUI(ECommonUI.UI_CHAT_HY);
    };


}
