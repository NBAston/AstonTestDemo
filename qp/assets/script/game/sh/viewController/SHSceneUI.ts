import UGame from "../../../public/base/UGame";
import SHMusic from "../SHMusic";
import SHModel, { SH_SCALE } from "../model/SHModel";
import SHMatchUI from "./SHMatchUI";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import { EEnterRoomErrCode, ECommonUI, ELevelType, EGameType, ERoomKind } from "../../../common/base/UAllenum";
import ULanHelper from "../../../common/utility/ULanHelper";
import AppGame from "../../../public/base/AppGame";
import UHandler from "../../../common/utility/UHandler";
import { ToBattle } from "../../../common/base/UAllClass";
import UStringHelper from "../../../common/utility/UStringHelper";
import { GameServer, suoha } from "../../../common/cmd/proto";
import UDebug from "../../../common/utility/UDebug";
import MBaseGameModel from "../../../public/hall/MBaseGameModel";
import { RoomPlayerInfo } from "../../../public/hall/URoomClass";
import SHMenuUI from "./SHMenuUI";
import SH_Play from "../SH_Play";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import SH_Light from "./SH_Light";
import AppStatus from "../../../public/base/AppStatus";
import CarryingAmount from "../../common/CarryingAmount";
import cfg_head from "../../../config/cfg_head";
import { NEWS } from "../../../public/hall/lobby/MHall";



const { ccclass, property } = cc._decorator;
/**
 * 梭哈
 */
@ccclass
export default class SHSceneUI extends UGame {

    @property(cc.Node)
    chatNode: cc.Node = null;//聊天按钮
    @property(cc.Node)
    btn_chouMa: cc.Node = null;//带入筹码按钮
    @property(cc.Node)
    playNodeList: cc.Node[] = [];//所有玩家信息
    @property(cc.Label)
    labelBianhao: cc.Label = null;//牌局编号
    @property(cc.Label)
    dizhu: cc.Label = null;//底注
    @property(cc.Node)
    tips: cc.Node = null;//补充筹码提示节点
    @property(cc.Label)
    tipsLabel: cc.Label = null;//补充筹码提示
    @property(cc.Node)
    label_node: cc.Node = null;//池底节点 
    @property(cc.Node)
    top: cc.Node = null;//牌局节点
    @property(cc.Label)
    chiDi: cc.Label = null;//池底
    @property(cc.Node)
    shgamelight: cc.Node = null;//灯光
    @property(cc.Node)
    btn_action: cc.Node = null;//功能按钮加注、弃牌、跟注
    @property(cc.Node)
    jiazhu2: cc.Node = null;//加注按钮
    @property(cc.Node)
    rangpai2: cc.Node = null;//让牌
    @property(cc.Node)
    genzhu2: cc.Node = null;//跟注
    @property(cc.Node)
    suoha2: cc.Node = null;//梭哈
    @property(cc.Node)
    btn_jiazhu: cc.Node = null;//加注界面
    @property(cc.Node)
    btn_Layout: cc.Node = null;//加注按钮父节点
    @property(cc.Node)
    btn_jiazhuItem: cc.Node = null;//加注按钮预制体
    @property(sp.Skeleton)
    ksyxAnima: sp.Skeleton = null;//开始游戏动画
    @property(sp.Skeleton)
    winLoseAnima: sp.Skeleton = null;//输赢动画
    @property(cc.Slider)
    sliderJiaZhu: cc.Slider = null;//加注滑动器
    @property(cc.Sprite)
    background: cc.Sprite = null;//滑动器背景
    @property(cc.Label)
    jiazhuLable: cc.Label = null;//加注变动值
    @property(cc.Sprite)
    jiazhuNode: cc.Sprite = null;//加注按钮
    @property(cc.Sprite)
    jianzhuNode: cc.Sprite = null;//减注按钮
    @property(cc.Node)
    btn_goon: cc.Node = null;//继续游戏按钮
    @property(cc.Node)
    bgSprite: cc.Node = null;//结算遮罩
    @property(cc.Node)
    winSettle: cc.Node = null;//结算
    @property([sp.Skeleton])
    winPoker: sp.Skeleton[] = [];//结算赢家牌
    @property(sp.Skeleton)
    winType: sp.Skeleton = null;//结算赢家牌型
    @property(cc.Toggle)
    toggle_xjlc: cc.Toggle = null;//下局离场

    public _music: SHMusic;//声音控制
    private _menu: SHMenuUI;//菜单控制
    private _menuNode: cc.Node;//菜单节点
    private _matchNode: SHMatchUI;//匹配界面
    public sh_Light: SH_Light;//灯光

    playList: SH_Play[] = [];//所有玩家信息
    jiazhuInter: cc.Button = null;//加号按钮
    jianzhuInter: cc.Button = null;//减号按钮

    isGameStart:boolean = false;//判断是否开始游戏
    chairPlay: number = 0;//玩家自己座位号
    goldPlay: number = 0;//玩家自己金额
    cdTime: number = 16;//玩家操作时间
    optContext: suoha.IOptContext = null;//可操作上下文
    addScore: number = 0;//滑动计数值
    isSuoha: boolean = false;//判断这局是否梭哈
    userList: suoha.IPlayerItem[] = [];
    playRotation: number[] = [0, 50, 70, 290, 320];//光柱角度

    //牌值、黑、红、梅、方
    public cardValueLsit: string[] = [
        "fp_04_001", "fp_04_002", "fp_04_003", "fp_04_004", "fp_04_005", "fp_04_006",
        "fp_04_007", "fp_04_008", "fp_04_009", "fp_04_010", "fp_04_011", "fp_04_012", "fp_04_013",//方块
        "fp_03_001", "fp_03_002", "fp_03_003", "fp_03_004", "fp_03_005", "fp_03_006",
        "fp_03_007", "fp_03_008", "fp_03_009", "fp_03_010", "fp_03_011", "fp_03_012", "fp_03_013",//梅花
        "fp_02_001", "fp_02_002", "fp_02_003", "fp_02_004", "fp_02_005", "fp_02_006",
        "fp_02_007", "fp_02_008", "fp_02_009", "fp_02_010", "fp_02_011", "fp_02_012", "fp_02_013",//红心
        "fp_01_001", "fp_01_002", "fp_01_003", "fp_01_004", "fp_01_005", "fp_01_006",
        "fp_01_007", "fp_01_008", "fp_01_009", "fp_01_010", "fp_01_011", "fp_01_012", "fp_01_013",//黑桃
    ];
    //牌型
    public cardTypeList: string[] = ["010_sp", "009_dz", "008_ld", "007_st", "006_sz", "005_th_01", "004_hl", "003_st", "002_ths_01", "002_hjths_01"];//牌型
    //看牌0 过牌1 弃牌2 跟注3 加注4 梭哈5
    public cardCode: string[] = ["01_normal", "05_gp", "02_allin_begin", "04_gz", "03_jz",
        "06_qp", "07_dmz", "07_xmz",];

    protected init(): void {
        this._music = new SHMusic();
        let root = UNodeHelper.find(this.node, "uiroot/content");
        this.jiazhuInter = this.jiazhuNode.getComponent(cc.Button);
        this.jianzhuInter = this.jianzhuNode.getComponent(cc.Button);

        //菜单按钮
        let topleft = UNodeHelper.find(root, "topleft");
        this._menuNode = UNodeHelper.find(root, "topleft/menu_node");
        this._menu = new SHMenuUI(topleft, this._menuNode, this._music);
        this._menu.showMenu(false);
        this.setHorseLampPos(0,250);
        //匹配界面
        this._matchNode = UNodeHelper.getComponent(this.node, "uiroot/content/match_node", SHMatchUI);
        this._matchNode.init();
        UEventHandler.addSliderClick(this.sliderJiaZhu.node, this.node, "SHSceneUI", "musicchange");
    }

    onLoad() {
        this.sh_Light = this.shgamelight.getComponent(SH_Light);
        CarryingAmount.sumGod = AppGame.ins.roleModel.score;//总金额
        for (let i = 0; i < this.playNodeList.length; i++) {
            this.playList.push(this.playNodeList[i].getComponent(SH_Play));
        }
    }

    //产生随机整数，包含下限值，包括上限值
    random(lower: number, upper: number) {
        return Math.floor(Math.random() * (upper - lower + 1)) + lower;
    }

    //事件监听层
    protected onEnable(): void {
        super.onEnable();
        SHModel.ins.gameState = true;
        SHModel.ins.on(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);

        SHModel.ins.on("CMD_S_StatusFree", this.CMD_S_StatusFree, this);//空闲场景消息
        SHModel.ins.on("CMD_S_StatusPlay", this.CMD_S_StatusPlay, this);//游戏中场景消息
        SHModel.ins.on("CMD_S_StatusEnd", this.CMD_S_StatusEnd, this);//游戏结束场景
        SHModel.ins.on("CMD_S_GameStart", this.CMD_S_GameStart, this);//游戏开始
        SHModel.ins.on("CMD_S_AddScore", this.CMD_S_AddScore, this);//用户跟注/加注
        SHModel.ins.on("CMD_S_GiveUp", this.CMD_S_GiveUp, this);//用户弃牌
        SHModel.ins.on("CMD_S_PassScore", this.CMD_S_PassScore, this);//用户过牌
        SHModel.ins.on("CMD_S_LookCard", this.CMD_S_LookCard, this);//用户看牌
        SHModel.ins.on("CMD_S_AllIn", this.CMD_S_AllIn, this);//孤注一掷 梭哈
        SHModel.ins.on("CMD_S_GameEnd", this.CMD_S_GameEnd, this);//游戏结束
        SHModel.ins.on("CMD_S_SendCard", this.CMD_S_SendCard, this);//发牌
        SHModel.ins.on("CMD_S_AndroidCard", this.CMD_S_AndroidCard, this);//机器人消息
        SHModel.ins.on("CMD_S_Operate_Notify", this.CMD_S_Operate_Notify, this);//操作失败通知
        SHModel.ins.on("CMD_S_RoundEndExitResult", this.CMD_S_RoundEndExitResult, this);//用户看牌
        SHModel.ins.on("GoonGame", this.goonGame, this);//继续游戏
        SHModel.ins.on("CarryingAmountTips", this.onCarrying, this);//设置携带返回
        SHModel.ins.on("CMD_S_BroadcastTakeScore", this.CMD_S_BroadcastTakeScore, this);//设置携带返回
        SHModel.ins.on("sc_ts_player_start_change", this.sc_ts_player_start_change, this);//其他玩家离开
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        SHModel.ins.run();

    }
    //关闭事件监听
    protected onDisable(): void {
        super.onDisable();
        SHModel.ins.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);

        SHModel.ins.off("CMD_S_StatusFree", this.CMD_S_StatusFree, this);//空闲场景消息
        SHModel.ins.off("CMD_S_StatusPlay", this.CMD_S_StatusPlay, this);//游戏中场景消息
        SHModel.ins.off("CMD_S_StatusEnd", this.CMD_S_StatusEnd, this);//游戏结束场景
        SHModel.ins.off("CMD_S_GameStart", this.CMD_S_GameStart, this);//游戏开始
        SHModel.ins.off("CMD_S_AddScore", this.CMD_S_AddScore, this);//用户跟注/加注
        SHModel.ins.off("CMD_S_GiveUp", this.CMD_S_GiveUp, this);//用户弃牌
        SHModel.ins.off("CMD_S_PassScore", this.CMD_S_PassScore, this);//用户过牌
        SHModel.ins.off("CMD_S_LookCard", this.CMD_S_LookCard, this);//用户看牌
        SHModel.ins.off("CMD_S_AllIn", this.CMD_S_AllIn, this);//孤注一掷 梭哈
        SHModel.ins.off("CMD_S_GameEnd", this.CMD_S_GameEnd, this);//游戏结束
        SHModel.ins.off("CMD_S_SendCard", this.CMD_S_SendCard, this);//发牌
        SHModel.ins.off("CMD_S_AndroidCard", this.CMD_S_AndroidCard, this);//机器人消息
        SHModel.ins.off("CMD_S_Operate_Notify", this.CMD_S_Operate_Notify, this);//操作失败通知
        SHModel.ins.off("CMD_S_RoundEndExitResult", this.CMD_S_RoundEndExitResult, this);//用户看牌
        SHModel.ins.off("GoonGame", this.goonGame, this);//继续游戏
        SHModel.ins.off("CarryingAmountTips", this.onCarrying, this);//设置携带返回
        SHModel.ins.off("CMD_S_BroadcastTakeScore", this.CMD_S_BroadcastTakeScore, this);//设置携带返回
        SHModel.ins.off("sc_ts_player_start_change", this.sc_ts_player_start_change, this);//其他玩家离开
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        SHModel.ins.exit();
        this._music.stop();
    }

    //获取牌值
    returnCard(tempCard16: number) {
        for (let i = 0; i < SHModel.ins.card16.length; i++) {
            if (SHModel.ins.card16[i] == tempCard16) {
                return this.cardValueLsit[i];
            }
        }
    }

    //当前进入房间玩家信息
    sc_ts_room_playerinfo(data: RoomPlayerInfo) {
        if (data.userId == AppGame.ins.roleModel.useId) {
            this.chairPlay = data.chairId;
            this.goldPlay = data.score;
            CarryingAmount.sumGod = data.score;
            this.playList[0].node.active = true;
            this.playList[0].init(data);
        }
        else {
            if (data.chairId > this.chairPlay) {
                this.playList[data.chairId - this.chairPlay].node.active = true;
                this.playList[data.chairId - this.chairPlay].init(data);
            }
            else {
                let tempCoun = data.chairId + (5 - this.chairPlay);
                this.playList[tempCoun].node.active = true;
                this.playList[tempCoun].init(data);
            }
        }
    }

    //点击加注，生成加注按钮
    jiaZhuButton() {
        this.btn_action.active = false;
        this.btn_jiazhu.active = true;//显示加注按钮
        this.btn_Layout.removeAllChildren();
        this.jiaZhuJianTou();//滑动箭头
        for (let i = this.optContext.jettons.length - 1; i >= 0; i--) {
            let tempPre = cc.instantiate(this.btn_jiazhuItem);
            tempPre.active = true;
            this.btn_Layout.addChild(tempPre);
            tempPre.setPosition(0, 0);
            let tempLable = tempPre.getChildByName("Label");
            if (i < this.optContext.range[0] || this.goldPlay < this.optContext.jettons[i]) {
                this.SkeletonAnim("none", tempPre.getComponent(sp.Skeleton));
                tempPre.getComponent(cc.Button).interactable = false;
                let tempColor = cc.Color.BLACK;
                tempLable.getComponent(cc.LabelOutline).color = tempColor.fromHEX("#A1A1A1");
            }
            tempLable.getComponent(cc.Label).string = UStringHelper.getMoneyFormat((this.optContext.jettons[i] * SH_SCALE)).toString();
            UEventHandler.addClick(tempPre, this.node, "SHSceneUI", "jiaZhuValue", this.optContext.jettons[i]);
        }
    }

    //滑动箭头
    jiaZhuJianTou() {
        this.addScore = this.optContext.minAddScore;
        this.jiazhuInter.interactable = true;
        this.jianzhuInter.interactable = false;
        this.background.fillRange = 0;
        this.sliderJiaZhu.progress = 0;
        this.jiazhuLable.string = UStringHelper.getMoneyFormat((this.optContext.minAddScore * SH_SCALE)).toString();//当前最小加注值
    }

    //滑动组件
    musicchange(caller: cc.Slider): void {
        this.background.fillRange = caller.progress;
        if (caller.progress > 0.999999) {
            this.jiazhuLable.string = "梭哈";
            this.addScore = -1;
            this.jiazhuInter.interactable = false;
            this.jianzhuInter.interactable = true;
            this.background.fillRange = 1;
        }
        else {
            let vlaue = this.goldPlay - this.optContext.minAddScore;
            this.addScore = (vlaue * caller.progress) + this.optContext.minAddScore;
            let tempScore = this.addScore * SH_SCALE;
            this.addScore = Math.floor(tempScore);
            this.addScore = this.addScore * 100;

            this.jiazhuLable.string = UStringHelper.getMoneyFormat(this.addScore * SH_SCALE).toString();

            if (this.addScore <= this.optContext.minAddScore) {
                this.jiazhuInter.interactable = true;
                this.jianzhuInter.interactable = false;
            }
            else {
                this.jiazhuInter.interactable = true;
                this.jianzhuInter.interactable = true;
            }
        }
    }

    //加减注按钮点击
    jiaJianZhuButton(event, data) {
        if (data != 1) {//加
            if (this.jiazhuLable.string != "梭哈") {
                this.addScore += 100;
                if (this.addScore >= Math.floor(this.goldPlay)) {
                    this.jiazhuLable.string = "梭哈";
                    this.addScore = -1;
                    this.jiazhuInter.interactable = false;
                    this.jianzhuInter.interactable = true;
                    AppGame.ins.showTips("已加到最大下注");
                    return;
                }

                if (this.addScore > Math.floor(this.optContext.minAddScore)) {
                    this.jianzhuInter.interactable = true;
                }
            }
            else {
                this.jiazhuLable.string = "梭哈";
                this.addScore = -1;
                this.jiazhuInter.interactable = false;
                this.jianzhuInter.interactable = true;
                AppGame.ins.showTips("已加到最大下注");
                return;
            }
        }
        else {//减
            if (this.jiazhuLable.string == "梭哈") {
                let tempScore = this.goldPlay * SH_SCALE;
                this.addScore = Math.floor(tempScore);
                this.addScore = this.addScore * 100;
            }

            this.addScore -= 100;
            if (this.addScore <= Math.floor(this.optContext.minAddScore)) {
                this.addScore = Math.floor(this.optContext.minAddScore);
                this.jianzhuInter.interactable = false;
                this.jiazhuLable.string = UStringHelper.getMoneyFormat(this.addScore * SH_SCALE).toString();
                AppGame.ins.showTips("已减到最小下注");
                return;
            }

            if (this.addScore < Math.floor(this.goldPlay)) {
                this.jiazhuInter.interactable = true;
            }
        }


        let vlaue = this.goldPlay - this.optContext.minAddScore;
        let progress = (this.addScore - this.optContext.minAddScore) / vlaue;
        if (progress > 0.999999) {
            this.jiazhuLable.string = "梭哈";
            this.addScore = -1;
            this.jiazhuInter.interactable = false;
            this.jianzhuInter.interactable = true;
        }
        else {
            this.jiazhuLable.string = UStringHelper.getMoneyFormat(this.addScore * SH_SCALE).toString();

            if (this.addScore <= Math.floor(this.optContext.minAddScore)) {
                this.jiazhuInter.interactable = true;
                this.jianzhuInter.interactable = false;
            }
            else {
                this.jiazhuInter.interactable = true;
                this.jianzhuInter.interactable = true;
            }
        }
    }

    //点击第二层加注
    jiaZhuValue0() {
        if (this.addScore == -1) {
            SHModel.ins.suoha();
        }
        else {
            SHModel.ins.jiazhu(4, this.addScore);
        }
        this.btn_action.active = false;
        this.btn_jiazhu.active = false;
    }

    //加注值
    jiaZhuValue(event, data) {
        SHModel.ins.jiazhu(4, data);
        this.btn_action.active = false;
        this.btn_jiazhu.active = false;
    }

    //让牌
    rangPaiButton() {
        SHModel.ins.rangPai();
        this.btn_action.active = false;
        this.btn_jiazhu.active = false;
    }

    //梭哈
    suohaButton() {
        SHModel.ins.suoha();
        this.btn_action.active = false;
        this.btn_jiazhu.active = false;
    }

    //弃牌
    qiPaiButton() {
        SHModel.ins.qipai();
        this.btn_action.active = false;
        this.btn_jiazhu.active = false;
    }

    //跟注
    genzhu() {
        SHModel.ins.jiazhu(3, this.optContext.followScore);
        this.btn_action.active = false;
        this.btn_jiazhu.active = false;
    }

    //==============================================消息接收=========================

    //广播携带分
    CMD_S_BroadcastTakeScore(data: suoha.CMD_S_BroadcastTakeScore): void {
        let tempPlay = this.returnPlay(data.chairId);
        if (tempPlay != null) {
            tempPlay.node.active = true;
            tempPlay.updateGold(data.takescore);
        }
    }

    //空闲场景消息
    CMD_S_StatusFree(data: suoha.CMD_S_StatusFree): void {
        this.isGameStart=false;
        this.initPlayerInfo(data.players);
    }

    //断开网络清理界面
    protected reconnect_in_game_but_no_in_gaming(): void {
        super.reconnect_in_game_but_no_in_gaming();
        this._matchNode.show();//显示正在匹配中
        this.shgamelight.opacity = 0;//关闭灯光
        this.userList = [];
        this.initGame();//初始化数值
        this.clearChipsPool();
        for (let i = 0; i < this.playList.length; i++) {
            this.playList[i].cearChipsPool();
            this.playList[i].action.node.active = false;
            this.playList[i].initGame();
            if (i != 0) {
                this.playList[i].chairID = 666;
                this.playList[i].userId = 666;
                this.playList[i].node.active = false;
            }
        }
    }

    //断线重连消息
    CMD_S_StatusPlay(data: suoha.CMD_S_StatusPlay): void {
        this.isGameStart=true;
        this._matchNode.hide();//关闭匹配图标
        this.label_node.active = true;//打开池底
        this.top.active = true;//打开牌局编号
        this.shgamelight.opacity = 255;//打开灯光
        this.cdTime = data.wTotalTime;//剩余时间
        this.initPlayerInfo(data.players);
        CarryingAmount.curTakeScore = data.cfgTakeScore;
        CarryingAmount.bAutoSetScore = data.isAutoSetScore;
        this.labelBianhao.string = "牌局编号:" + data.roundId;
        this.playList[0].CMD_S_StatusPlay(data.chips);
        this.chiDi.string = UStringHelper.getMoneyFormat((data.tableAllScore * SH_SCALE)).toString();//池底

        this.userList = [];
        for (let i = 0; i < data.players.length; i++) {
            this.userList.push(data.players[i]);
        }

        //玩家赋值
        for (let i = 0; i < data.players.length; i++) {
            for (let j = 0; j < this.playList.length; j++) {
                if (data.players[i].userId == this.playList[j].userId) {
                    this.playList[j].assignment(data.BankerUser, data.CurrentUser, data.players[i], false);
                }
            }
        }

        for (let i = 0; i < this.playList.length; i++) {
            this.playList[i].updateCT(data.CurrentUser, data.wTimeLeft);
        }

        if (data.CurrentUser == this.chairPlay) {//判断是否是自己先开局
            this.btn_action.active = true;
            if (data.ctx != null) {
                this.optContext = data.ctx;
                this.rangpai2.active = data.ctx.canPass;
                this.genzhu2.active = data.ctx.canFollow;
                this.jiazhu2.active = data.ctx.canAdd;
                this.suoha2.active = data.ctx.canAllIn;
                if (data.ctx.canFollow) {
                    this.genzhu2.getChildByName("genzhuLabel").getComponent(cc.Label).string =
                        "跟注" + UStringHelper.getMoneyFormat((data.ctx.followScore * SH_SCALE)).toString();
                }
            }
        }
        else {
            this.btn_action.active = false;
        }
    }

    //游戏结束场景
    CMD_S_StatusEnd(data: suoha.CMD_S_StatusEnd): void {
        this._matchNode.hide();//关闭匹配中
        this.shgamelight.opacity = 0;//关闭灯光
        SHModel.ins.gameState = true;//玩家弃牌了，可以离开游戏
        this.isGameStart=false;
        this.initPlayerInfo(data.players);

        if(data.wTimeLeft>=3){
            if(data.gameEndInfo!=null){
                this.showPlayCard(data.gameEndInfo,data.players);
            }
            else{
                this._matchNode.show();//显示正在匹配中
            }
        }
        else{
            this._matchNode.show();//显示正在匹配中
        }
    }

    //初始化玩家
    initPlayerInfo(dataPlayers: suoha.IPlayerItem[]){
        for (let i = 0; i < dataPlayers.length; i++) {
            if(dataPlayers[i].userId == AppGame.ins.roleModel.useId){
                this.chairPlay = dataPlayers[i].chairId;//玩家自己座位号
                this.goldPlay = dataPlayers[i].takeScore;//玩家自己金额
                CarryingAmount.sumGod = dataPlayers[i].takeScore;
                this.toggle_xjlc.isChecked = dataPlayers[i].bRoundEndExit;
                this.playList[0].node.active = true;
                this.playList[0].init(this.retuenPlayerInfo(dataPlayers[i]));
                break;
            }
        }

        for (let i = 0; i < dataPlayers.length; i++) {
            if(dataPlayers[i].userId != AppGame.ins.roleModel.useId){
                if (dataPlayers[i].chairId > this.chairPlay) {
                    this.playList[dataPlayers[i].chairId - this.chairPlay].node.active = true;
                    this.playList[dataPlayers[i].chairId - this.chairPlay].init(this.retuenPlayerInfo(dataPlayers[i]));
                }
                else {
                    let tempCoun = dataPlayers[i].chairId + (5 - this.chairPlay);
                    this.playList[tempCoun].node.active = true;
                    this.playList[tempCoun].init(this.retuenPlayerInfo(dataPlayers[i]));
                }
           }
        }
    }

    //返回房间玩家信息
    retuenPlayerInfo(data: suoha.IPlayerItem){
        let tempPlay=new RoomPlayerInfo();
        tempPlay.userId=data.userId;
        tempPlay.account=data.userId;
        tempPlay.nickName=data.nickname;
        tempPlay.headId=data.headId;
        tempPlay.headImgUrl=data.headImgUrl;
        tempPlay.headboxId=data.headBoxIndex;
        tempPlay.vipLevel=data.vipLevel;
        tempPlay.tableId=SHModel.ins.tableId;
        tempPlay.chairId=data.chairId;
        tempPlay.userStatus=4;
        tempPlay.location=data.location;
        tempPlay.score=data.userScore;
        let cfg = cfg_head[data.headId];
        tempPlay.sex=cfg.sex;
        tempPlay.szLocation=data.location;
        return tempPlay;
    }

    //切后台展示牌型
    showPlayCard(data: suoha.ICMD_S_GameEnd,dataPlayers: suoha.IPlayerItem[]){
        this.isGameStart=false;
        this.userList = [];//清空当前玩游戏的玩家ID
        this.playList[0].isOver = true;//游戏是否结束

        if (data.showwincard) {//是否翻牌
            for (let i = 0; i < data.players.length; i++) {
                let tempPlay = this.returnPlay(data.players[i].chairId);
                if (tempPlay != null) {
                    tempPlay.GameEndFanPai(data.winuser, data.players[i], data,true);//游戏结束比牌翻牌
                }
            }
        }
        else {//不比牌
            this.gameEmdChipAnim(data,true);//游戏结算筹码移动
            for (let i = 0; i < data.players.length; i++) {
                let tempPlay = this.returnPlay(data.players[i].chairId);
                if (tempPlay != null) {
                    tempPlay.CMD_S_GameEnd(data.players[i],true);//游戏结束不翻牌
                }
            }
        }

        for (let i = 0; i < dataPlayers.length; i++) {
            let tempPlay = this.returnPlay(dataPlayers[i].chairId);
            if (tempPlay != null) {
                tempPlay.gameEndisGiveup(dataPlayers[i]);
            }
        }
    }

    gameEndTime: number = 666;
    //异常时间判断
    initGameToBack(startTime: number) {
        if (this.gameEndTime == 666) return;
        let tempTime = 0;
        if (startTime >= this.gameEndTime) {
            tempTime = startTime - this.gameEndTime;
        }
        else {
            tempTime = (60-this.gameEndTime) + startTime;
        }

        if (tempTime <= 4) {
            this.onGameToBack(false);
        }
    }

    //开始游戏
    public CMD_S_GameStart(data: suoha.CMD_S_GameStart) {
        let curDate = new Date();
        this.initGameToBack(curDate.getSeconds());
        this.gameEndTime=666;
        this.isGameStart=true;
        this.ksyxAnima.node.active = true;
        this.SkeletonAnim("ksyx", this.ksyxAnima);
        this._matchNode.hide();//关闭匹配图标
        this.showTips(data.needtip, data.setscoretip, data.players);//提示
        this.scheduleOnce(() => {
            this.initGame();
            this.chatNode.active = true;
            this.btn_chouMa.active = true;//打开带入筹码
            this.label_node.active = true;//打开池底
            this.top.active = true;//打开牌局编号
            this.toggle_xjlc.isChecked = false;
            this.cdTime = data.nextStep.wTimeLeft + 1;//玩家操作时间
            this.labelBianhao.string = "牌局编号:" + data.roundId;
            this.chiDi.string = UStringHelper.getMoneyFormat((data.tableAllScore * SH_SCALE)).toString();//池底

            this.userList = [];
            for (let i = 0; i < data.players.length; i++) {
                this.userList.push(data.players[i]);
            }

            //玩家赋值
            for (let i = 0; i < data.players.length; i++) {
                for (let j = 0; j < this.playList.length; j++) {
                    if (data.players[i].userId == this.playList[j].userId) {
                        this.sendCardCount.push(j);
                        this.playList[j].assignment(data.BankerUser, data.nextStep.NextUser, data.players[i]);
                    }
                }
            }

            this.SendCardAnim();

            let tempTime = 1;
            if (data.nextStep.NextUser == this.chairPlay) {
                tempTime = data.players.length * 1.1;
            }
            this.scheduleOnce(() => {
                this.shgamelight.opacity = 255;//打开灯光
                let tempPlay = this.returnPlay(data.nextStep.NextUser);
                if (tempPlay != null) {
                    let rotationPos = tempPlay.rotationPos;
                    this.sh_Light.tempAngle = rotationPos
                    this.shgamelight.angle = rotationPos;
                }
                this.CMD_S_Next_StepInfo(data.nextStep);//桌面情况及下一步操作信息
            }, tempTime)
        }, 1.2)
    }

    //提示
    showTips(needtip: boolean, setscoretip: boolean, players: suoha.IPlayerItem[]) {
        for (let i = 0; i < players.length; i++) {
            if (players[i].userId == AppGame.ins.roleModel.useId) {
                if (needtip) {
                    this.showTipsUI("余额不足，您的牌桌携带筹码已调整至" + (players[i].takeScore + players[i].tableScore) * 0.01);
                }
                else {
                    if (setscoretip) {
                        this.showTipsUI("您的牌桌携带筹码已调整至" + (players[i].takeScore + players[i].tableScore) * 0.01);
                    }
                }
                break;
            }
        }
    }

    showTipsUI(tempStr: string) {
        this.tips.active = true;
        this.tipsLabel.string = tempStr;
        this.scheduleOnce(() => {
            this.tips.active = false;
        }, 2)
    }

    onCarrying(data: any) {
        if (data.bok == 1) {
            CarryingAmount.bAutoSetScore = data.autoset;
            this.showTipsUI("下一局您的牌桌携带筹码将调整至" + (CarryingAmount.curTakeScore * 0.01));
        }
        else {
            this.showTipsUI("牌桌携带筹码调整失败");
        }
    }

    //新的发牌动画=========================================
    cardCount: number = 0;
    isOne: boolean = true;
    sendCardCount: number[] = [];

    //发牌动画
    SendCardAnim(data: suoha.CMD_S_GameStart = null) {
        if (this.isOne) {
            if (this.cardCount < this.sendCardCount.length) {
                this.playList[this.sendCardCount[this.cardCount]].newSendCard(this.isOne);
            }
            else {
                this.isOne = false;
                this.cardCount = 0;
                if (this.sendCardCount[this.cardCount] != null) {
                    this.playList[this.sendCardCount[this.cardCount]].newSendCard(this.isOne);
                }
                else {
                    UDebug.error(this.cardCount);
                    UDebug.error(this.sendCardCount[this.cardCount]);
                }
            }
        }
        else {
            if (this.cardCount < this.sendCardCount.length) {
                this.playList[this.sendCardCount[this.cardCount]].newSendCard(this.isOne);
            }
        }
    }
    //新的发牌动画=========================================

    //接收 用户跟注/加注
    CMD_S_AddScore(data: suoha.CMD_S_AddScore): void {
        this.chiDi.string = UStringHelper.getMoneyFormat((data.tableAllScore * SH_SCALE)).toString();//池底
        let tempPlay = this.returnPlay(data.opUser);
        if (tempPlay != null) {
            tempPlay.CMD_S_AddScore(data);//查找返回玩家数据    
        }
        this.CMD_S_Next_StepInfo(data.nextStep);//桌面情况及下一步操作信息
    }

    //桌面情况及下一步操作信息
    CMD_S_Next_StepInfo(data: suoha.ICMD_S_Next_StepInfo) {
        this._matchNode.hide();//关闭匹配图标
        if (data != null) {
            for (let i = 0; i < this.playList.length; i++) {
                this.playList[i].updateCT(data.NextUser, data.wTimeLeft + 1);
            }

            if (data.NextUser == this.chairPlay) {//判断是否是自己先开局
                this.btn_action.active = true;
                if (data.ctx != null) {
                    this.optContext = data.ctx;
                    this.rangpai2.active = data.ctx.canPass;
                    this.genzhu2.active = data.ctx.canFollow;
                    this.jiazhu2.active = data.ctx.canAdd;
                    this.suoha2.active = data.ctx.canAllIn;
                    if (data.ctx.canFollow) {
                        this.genzhu2.getChildByName("genzhuLabel").getComponent(cc.Label).string =
                            "跟注" + UStringHelper.getMoneyFormat((data.ctx.followScore * SH_SCALE)).toString();
                    }
                }
            }
            else {
                this.btn_action.active = false;
                this.btn_jiazhu.active = false;
            }
        }
        else {
            this.btn_action.active = false;
        }
    }

    //灯光旋转动画
    lightAnim(rotation: number) {
        this.sh_Light.startRotation(rotation);
    }

    //用户弃牌
    CMD_S_GiveUp(data: suoha.CMD_S_GiveUp): void {
        let tempPlay = this.returnPlay(data.GiveUpUser);
        if (tempPlay != null) {
            tempPlay.CMD_S_GiveUp(data);//查找返回玩家数据
        }
        if (data.nextStep != null) {
            this.CMD_S_Next_StepInfo(data.nextStep);//桌面情况及下一步操作信息
        }

        if (data.GiveUpUser == this.chairPlay) {
            SHModel.ins.gameState = true;//玩家弃牌了，可以离开游戏
            if (AppGame.ins.currRoomKind == ERoomKind.Normal) {
                //this.btn_goon.active = true;//只有是普通场的时候才可以有继续游戏按钮
            }
            this.btn_action.active = false;
            this.btn_jiazhu.active = false;
        }
        this.deleteUserList(data.GiveUpUser);
    }

    //根据座位ID删除弃牌用户ID
    deleteUserList(chairID: number) {
        let tempUserID = 0;
        for (let k = 0; k < this.playList.length; k++) {
            if (this.playList[k].chairID == chairID) {
                tempUserID = this.playList[k].userId;
            }
        }

        for (let i = 0; i < this.userList.length; i++) {
            if (tempUserID == this.userList[i].userId) {
                this.userList[i].playstatus = false;
            }
        }
    }

    //让牌
    CMD_S_PassScore(data: suoha.CMD_S_PassScore): void {
        let tempPlay = this.returnPlay(data.PassUser);
        if (tempPlay != null) {
            tempPlay.CMD_S_PassScore(data);//查找返回玩家数据
        }
        if (data.nextStep != null) {
            this.CMD_S_Next_StepInfo(data.nextStep);//桌面情况及下一步操作信息
        }
    }

    //看牌
    CMD_S_LookCard(data: suoha.CMD_S_LookCard) {
        let tempPlay = this.returnPlay(data.LookCardUser);
        if (tempPlay != null) {
            if (data.LookCardUser == this.chairPlay) {
                tempPlay.CMD_S_LookCard(data);
            }
            else {
                tempPlay.shakeNode();
            }
        }
    }

    //孤注一掷 梭哈
    CMD_S_AllIn(data: suoha.CMD_S_AllIn): void {
        this.isSuoha = true;
        let tempPlay = this.returnPlay(data.AllinUser);
        if (tempPlay) {
            tempPlay.CMD_S_AllIn(data);//查找返回玩家数据
        }
        this.chiDi.string = UStringHelper.getMoneyFormat((data.tableAllScore * SH_SCALE)).toString();//池底
        if (data.nextStep != null) {
            this.CMD_S_Next_StepInfo(data.nextStep);//桌面情况及下一步操作信息
        }
    }

    //骨骼动画
    SkeletonAnim(animName, tempSkel: sp.Skeleton) {
        if (tempSkel != null) {
            tempSkel.paused = true;
            tempSkel.setAnimation(0, animName, false);
            tempSkel.paused = false;
        }
    }

    //游戏结束
    CMD_S_GameEnd(data: any): void {
        this.isGameStart=false;
        this.shgamelight.opacity = 0;//打开灯光
        this.userList = [];//清空当前玩游戏的玩家ID
        this.toggle_xjlc.node.active = false;
        this.btn_goon.active = false;
        this.playList[0].isOver = true;//游戏是否结束
        this.showwincard(data);
    }

    //判断是否比牌
    showwincard(data: any) {
        this.btn_action.active = false;
        this.btn_jiazhu.active = false;
        if (data.showwincard) {//是否翻牌
            for (let i = 0; i < data.players.length; i++) {
                let tempPlay = this.returnPlay(data.players[i].chairId);
                if (tempPlay != null) {
                    tempPlay.GameEndFanPai(data.winuser, data.players[i], data);//游戏结束比牌翻牌
                }
            }
        }
        else {//不比牌
            this.gameEmdChipAnim(data,false);//游戏结算筹码移动
            for (let i = 0; i < data.players.length; i++) {
                let tempPlay = this.returnPlay(data.players[i].chairId);
                if (tempPlay != null) {
                    tempPlay.CMD_S_GameEnd(data.players[i]);//游戏结束不翻牌
                }
            }
        }
    }

    //游戏结算筹码移动
    gameEmdChipAnim(data: any,tempBool:boolean) {
        for (let index = 0; index < 1; index++) {
            this.scheduleOnce(() => {
                this._music.playflyCoins();
            }, index * 0.2)
        }
        let winPlay = this.returnPlay(data.winuser);//赢家
        for (let i = 0; i < data.players.length; i++) {
            let tempPlay = this.returnPlay(data.players[i].chairId);//其他玩家
            if (data.players[i].chips.length > 0 && tempPlay != null) {
                tempPlay.returnChip(data.players[i].chips);
            }
            if (tempPlay != null) {
                for (let index = 0; index < tempPlay.chipsPool.length; index++) {
                    if (tempPlay.chipsPool[index] != null && winPlay != null) {
                        tempPlay.chipsPool[index].runAction(cc.sequence(cc.moveTo(0.5, winPlay.chipPos.getPosition()), cc.callFunc(() => {
                            if(tempPlay.chipsPool[index] != null){
                                tempPlay.chipsPool[index].active = false;
                            }
                        }, this)));
                    }
                }

                if (tempPlay.userId == AppGame.ins.roleModel.useId) {
                    this.scheduleOnce(() => {
                        this.winLoseAnima.node.active = true;
                        if (data.players[i].deltascore > 0) {
                            this.SkeletonAnim("win", this.winLoseAnima);
                        }
                        else if (data.players[i].deltascore < 0) {
                            this.SkeletonAnim("lose", this.winLoseAnima);
                        }
                    }, 0.5)
                }
            }
            else {//特殊情况，完成重复进入一个房间
                for (let k = 0; k < this.playList.length; k++) {
                    let tempCount = true;
                    for (let m = 0; m < data.players.length; m++) {
                        if (this.playList[k].chairID == data.players[m].chairId) {
                            tempCount = false;
                        }
                    }

                    if (tempCount && this.playList[k].node.activeInHierarchy) {
                        this.playList[k].cearChipsPool();
                    }
                }
            }
        }

        let tempTime=2.5
        if(tempBool){
            tempTime=2;
        }

        //延时自动初始化
        this.scheduleOnce(() => {
            this.winLoseAnima.paused = true;
            this.winLoseAnima.node.active = false;
            this._matchNode.show();//显示正在匹配中
            this.initGame();//初始化数值
            for (let k = 0; k < this.playList.length; k++) {
                this.playList[k].cearChipsPool();
                this.playList[k].action.node.active = false;
            }
            for (let i = 0; i < data.players.length; i++) {
                let tempPlay = this.returnPlay(data.players[i].chairId);
                if (tempPlay != null) {
                    tempPlay.initGame();
                }
            }
        }, tempTime)
    }

    //赢家坐标，结算界面飘动
    winSettleAnim(data: any,tempBool:boolean) {
        this.btn_action.active = false;
        this.btn_jiazhu.active = false;
        this.shgamelight.opacity = 0;//关闭灯光
        this.gameEmdChipAnim(data,tempBool);
        for (let i = 0; i < data.players.length; i++) {
            let tempPlay = this.returnPlay(data.players[i].chairId);
            if (tempPlay != null) {
                tempPlay.CMD_S_GameEnd(data.players[i]);
            }
        }
    }

    //结算
    winPos: cc.Vec2[] = [new cc.Vec2(0, -110), new cc.Vec2(280, -50), new cc.Vec2(400, 115), new cc.Vec2(-400, 115), new cc.Vec2(-250, -50)];

    nodeNameGetVect(nodeName: string) {
        switch (nodeName) {
            case "play_0":
                return this.winPos[0];
            case "play_1":
                return this.winPos[1];
            case "play_2":
                return this.winPos[2];
            case "play_3":
                return this.winPos[3];
            case "play_4":
                return this.winPos[4];
        }
    }

    //结算界面
    endWinSettle(dataPlayer: suoha.ICMD_S_GameEnd_Player, data: any, nodeName: string,tempBool:boolean=false) {
        this.winSettle.setPosition(this.nodeNameGetVect(nodeName));
        this.winSettle.active = true;
        this.SkeletonAnim(this.cardTypeList[dataPlayer.handcards.ty], this.winType);//牌型
        for (let index = 0; index < dataPlayer.handcards.cards.length; index++) {
            this.winPoker[index].node.active = true;
            this.SkeletonAnim(this.returnCard(dataPlayer.handcards.cards[index]), this.winPoker[index]);//牌值
        }
        if(tempBool){
            this.winSettle.setPosition(0,0);
            this.winSettle.setScale(1);
            
            //顺子以上的牌型或梭哈赢了之后，有欢呼声的音效
            if (dataPlayer.handcards.ty >= 4 || this.isSuoha) {
                this._music.GrandTheftAuto();
            }
            this.bgSprite.active = true;
            for (let i = 0; i < this.playList.length; i++) {
                this.playList[i].setOutSpSize();
            }
            this.scheduleOnce(() => {
                this.bgSprite.active = false;
                for (let i = 0; i < this.winPoker.length; i++) {
                    this.winPoker[i].node.active = false;
                }
                for (let i = 0; i < this.playList.length; i++) {
                    this.playList[i].initOutSpSize();
                }
                this.winSettle.scale = 0.5;
                this.winSettle.active = false;
                this.winSettleAnim(data,tempBool);
            }, 1)
        }
        else{
            this.winSettle.runAction(cc.sequence(cc.spawn(cc.moveTo(0.3, new cc.Vec2(0, 0)), cc.scaleTo(1, 1)), cc.callFunc(() => {
                //顺子以上的牌型或梭哈赢了之后，有欢呼声的音效
                if (dataPlayer.handcards.ty >= 4 || this.isSuoha) {
                    this._music.GrandTheftAuto();
                }
                this.bgSprite.active = true;
                for (let i = 0; i < this.playList.length; i++) {
                    this.playList[i].setOutSpSize();
                }
                this.scheduleOnce(() => {
                    this.bgSprite.active = false;
                    for (let i = 0; i < this.winPoker.length; i++) {
                        this.winPoker[i].node.active = false;
                    }
                    for (let i = 0; i < this.playList.length; i++) {
                        this.playList[i].initOutSpSize();
                    }
                    this.winSettle.scale = 0.5;
                    this.winSettle.active = false;
                    this.winSettleAnim(data,tempBool);
                }, 1)
            }, this)));
        }
    }

    //发牌
    CMD_S_SendCard(data: suoha.CMD_S_SendCard): void {
        if (data.nextStep != null) {
            this.CMD_S_Next_StepInfo(data.nextStep);//桌面情况及下一步操作信息

            //最新庄家
            for (let i = 0; i < this.playList.length; i++) {
                this.playList[i].bankerUpdate(data.nextStep.NextUser);
            }
        }

        this.twoCardCount = 0;
        this.twoICardItem = data.cardItems;
        this.newSendCardAnim();
    }

    //新的发牌动画=========================================
    twoCardCount: number = 0;
    twoICardItem: suoha.ICardItem[] = [];

    //发牌动画
    newSendCardAnim() {
        if (this.twoCardCount < this.twoICardItem.length) {
            let tempPlay = this.returnPlay(this.twoICardItem[this.twoCardCount].chairId);
            if (tempPlay != null) {
                tempPlay.CMD_S_SendCard(this.twoICardItem[this.twoCardCount]);
            }
        }
    }
    //新的发牌动画=========================================

    //机器人消息
    CMD_S_AndroidCard(data: suoha.CMD_S_AndroidCard): void {
        UDebug.log("机器人消息");
        UDebug.log(data);
    }

    //操作失败通知
    CMD_S_Operate_Notify(data: suoha.CMD_S_Operate_Notify): void {
        AppGame.ins.showTips(data.errmsg);
        this.btn_action.active = true;
    }

    //本局结束后退出
    CMD_S_RoundEndExitResult(data: suoha.CMD_S_RoundEndExitResult): void {
        UDebug.log("本局结束后退出");
        UDebug.log(data);
    }

    //初始化数值
    initGame() {
        this.cardCount = 0;
        this.isOne = true;
        this.isSuoha = false;//是否梭哈
        this.sendCardCount = [];

        this.chatNode.active = false;//关闭聊天聊天
        this.btn_chouMa.active = false;//关闭带入筹码
        this.top.active = false;
        this.label_node.active = false;
        this.btn_action.active = false;
        this.btn_jiazhu.active = false;
        this.shgamelight.opacity = 0;
        this.btn_goon.active = false;
        this.chiDi.string = "0";//池底
        this.sh_Light.initClass();//初始化灯光
        SHModel.ins.isGame = false;
        this.switchOutSp(false);
    }

    //点击继续游戏继续游戏
    private goonGame() {
        this.initGame();//初始化数值
        this._matchNode.show();//打开匹配游戏
        this._music.playclick();
        for (let i = 0; i < this.playList.length; i++) {
            this.playList[i].initGame();
            if (i != 0) {
                this.playList[i].chairID = 666;
                this.playList[i].userId = 666;
                this.playList[i].node.active = false;
            }
        }
        this.clearChipsPool();


        //等待两秒匹配
        this.scheduleOnce(() => {
            SHModel.ins.requestMatch();
        }, 1)
    }

    //继续游戏
    chickGoonGame() {
        SHModel.ins.isGame = true;
        SHModel.ins.exitGame();
    }

    clearChipsPool() {
        let container = this.playList[0].chip_container;
        for (let i = 0; i < container.children.length; i++) {
            if (container.children[i].name == "chip_res") {
                container.children[i].destroy();
            }
        }
    }

    //点击空白处关闭加注按钮
    closeJiaZu() {
        this.btn_action.active = true;
        this.btn_jiazhu.active = false;
    }

    //查找返回玩家数据
    returnPlay(tempID: number) {
        for (let i = 0; i < this.playList.length; i++) {
            if (this.playList[i].chairID == tempID) {
                return this.playList[i];
            }
        }
    }

    //查找返回玩家数据
    returnPlayID(userID: number) {
        for (let i = 0; i < this.playList.length; i++) {
            if (this.playList[i].userId == userID) {
                return this.playList[i];
            }
        }
    }

    //进入房间失败
    protected enter_room_fail(errorCode: number, errMsg?: string): void {
        if (errMsg == "") {
            errMsg = EEnterRoomErrCode[errorCode];
        }
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 1, data: errMsg, handler: UHandler.create(() => {
                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.SH);
            }, this)
        });
    }

    /**场景加载完毕之后 首先执行的函数 */
    openScene(data: any): void {
        super.openScene(data);
        if (!this._init) {
            this._init = true;
            this.init();
        }
        if (data) {
            let dt = data as ToBattle;
            this.dizhu.string = "底注：" + dt.roomData.floorScore * SH_SCALE;
            SHModel.ins.saveRoomInfo(dt.roomData);
            this._matchNode.show();//显示正在匹配中

        }
        this._music.playGamebg();
        this.gamecloseUI();
    }

    //点击复制牌局信息
    private oncopy(): void {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this.labelBianhao.string).substr(5, 30));
    }

    private onopencharge(): void {
        if (!AppGame.ins.roleModel.bindMobile) {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 3, data: ULanHelper.NO_BIND_PHONE, handler: UHandler.create((a) => {
                    if (a) {
                        AppGame.ins.showUI(ECommonUI.LB_Charge);
                    } else {
                        AppGame.ins.showUI(ECommonUI.LB_Regester);
                    }
                }, this)
            });

        } else {
            AppGame.ins.showUI(ECommonUI.LB_Charge);
        }
        this._music.playclick();
    }

    /**点击聊天 */
    private onClickChat() {
        if (SHModel.ins.isOneChat) {
            SHModel.ins.isOneChat = false;
            this.scheduleOnce(() => {
                for (let i = 0; i < SHModel.ins.dataAny.length; i++) {
                    AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_CHAT_MESSAGE, SHModel.ins.dataAny[i]);
                }
            }, 0.5)
        }
        AppGame.ins.showUI(ECommonUI.UI_CHAT_HY);
    }

    //点击携带金额
    onClickDaiRu() {
        if (CarryingAmount.roomData != null) {
            if (CarryingAmount.sumGod >= CarryingAmount.roomData.minScore) {
                AppGame.ins.showUI(ECommonUI.UI_CARRYING, 3);
            }
            else {
                AppGame.ins.showUI(ECommonUI.NewMsgBox, { type: 1, data: "金币不足，补充筹码失败" });
            }
        }
        else {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, { type: 1, data: "是请退出当前房间，重新进入" });
        }
    }

    //下局离场
    TheBureauOfLeave(e: cc.Toggle) {
        SHModel.ins.quitGame(e.isChecked);
    }

    //隐藏、显示遮罩
    switchOutSp(tempBool:boolean){
        for (let i = 0; i < this.playList.length; i++) {
            this.playList[i].outSp.active=tempBool;
        }
    }

    //玩家离开
    sc_ts_player_start_change(usStatus: number, data: GameServer.MSG_S2C_GameUserStatus) {
        if (usStatus == 6 || usStatus == null || usStatus == 0) {
            if (this.userList.length != 0) {
                let tempCount = 0;
                for (let i = 0; i < this.userList.length; i++) {
                    if (data.userId == this.userList[i].userId) {
                        tempCount++;
                        if (!this.userList[i].playstatus) {//只有没有不玩游戏的用户才踢出房间
                            this.deletePlay(data.chairId)
                            return;
                        }
                        break;
                    }
                }

                if (tempCount == 0) {
                    this.deletePlay(data.chairId)
                }
            }
            else {
                this.deletePlay(data.chairId)
            }
        }
    }

    deletePlay(chairId: number) {
        let tempPlay = this.returnPlay(chairId);
        if (tempPlay != null) {
            tempPlay.initGame(false);
            if (tempPlay.node.name != "play_0") {
                tempPlay.chairID = 666;
                tempPlay.userId = 666;
                tempPlay.node.active = false;
            }
        }
        else {
            UDebug.log("玩家已离开！");
        }
    }

    /**
    * 游戏切换到后台
    * @param isHide 是否切在后台
    */
    onGameToBack(isBack: boolean) {
        SHModel.ins.isBack = isBack;
        SHModel.ins.receive = false;
        this.unschedule(()=>{});
        this.unscheduleAllCallbacks();
        this.sh_Light.node.height = 280;
        this.tips.active = false;
        this.winLoseAnima.clearTracks();
        this.winLoseAnima.node.active = false;//关闭动画
        this.bgSprite.active = false;
        this.winSettle.scale = 0.5;
        this.winSettle.stopAllActions();
        this.winSettle.active = false;//关闭结算界面
        this.userList = [];
        this.node.stopAllActions();
        if (!isBack) {
            this.initGame();//初始化数值
            this.clearChipsPool();
            for (let i = 0; i < this.playList.length; i++) {
                for (let j = 0; j < this.playList[i].chipsPool.length; j++) {
                    this.playList[i].chipsPool[j].stopAllActions();
                }
                this.playList[i].cearChipsPool();
                this.playList[i].action.node.active = false;
                this.playList[i].initGame();
                if (i != 0) {
                    this.playList[i].userId=666;
                    this.playList[i].node.active = false;
                }
            }

            SHModel.ins.sendFreshGameScene();
        }
    }
}
