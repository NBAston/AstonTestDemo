import UGame from "../../../public/base/UGame";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import { ECommonUI, EEnterRoomErrCode, EGameType, ELevelType, ERoomKind } from "../../../common/base/UAllenum";
import ULanHelper from "../../../common/utility/ULanHelper";
import AppGame from "../../../public/base/AppGame";
import UHandler from "../../../common/utility/UHandler";
import { ToBattle } from "../../../common/base/UAllClass";
import UStringHelper from "../../../common/utility/UStringHelper";
import { GameServer, Gswz, texas } from "../../../common/cmd/proto";
import UDebug from "../../../common/utility/UDebug";
import MBaseGameModel from "../../../public/hall/MBaseGameModel";
import { RoomPlayerInfo } from "../../../public/hall/URoomClass";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import { ZJH_SCALE } from "../../../public/hall/lobby/VHall";
import DZPK_Play from "../DZPK_Play";
import DZPK_Music from "../DZPK_Music";
import DZPK_MenuUI from "./DZPK_MenuUI";
import DZPK_Model, { DZPK_SCALE } from "../model/DZPK_Model";
import DZPK_Light from "./DZPK_Light";
import DZPK_MatchUI from "./DZPK_MatchUI";
import MRoomModel from "../../../public/hall/room_zjh/MRoomModel";
import AppStatus from "../../../public/base/AppStatus";
import UCoinDFlyHelper from "../../../common/utility/UCoinFlyHelper";
import CarryingAmount from "../../common/CarryingAmount";
import cfg_head from "../../../config/cfg_head";
import { NEWS } from "../../../public/hall/lobby/MHall";



const { ccclass, property } = cc._decorator;

@ccclass
export default class DZPK_SceneUI extends UGame {

    @property(cc.Node)
    chip_Animator: cc.Node = null;//筹码父节点
    @property(cc.Node)
    chip_Pre: cc.Node = null;//筹码预制体
    @property(sp.Skeleton)
    heguan: sp.Skeleton = null;//荷官
    @property(cc.Node)
    label_node: cc.Node = null;//池底节点
    @property(cc.Label)
    chiBox0: cc.Label = null;//底注
    @property(cc.Node)
    tips: cc.Node = null;//补充筹码提示节点
    @property(cc.Label)
    tipsLabel: cc.Label = null;//补充筹码提示
    @property(cc.Node)
    chiBox1: cc.Node = null;//边池item
    @property(cc.Node)
    chiLayout: cc.Node = null;//边池父节点
    @property(cc.Label)
    Label_1: cc.Label = null;//体验场
    @property(cc.Label)
    Label_2: cc.Label = null;//大盲注
    @property(cc.Label)
    Label_3: cc.Label = null;//小盲注
    @property([cc.SpriteFrame])
    chiBoxSF: cc.SpriteFrame[] = [];//边池图标

    @property(cc.Label)
    bianhao: cc.Label = null;//牌局编号
    @property(cc.Node)
    btn_chat: cc.Node = null;//聊天按钮
    @property(cc.Node)
    btn_chouMa: cc.Node = null;//带入筹码按钮
    @property(cc.Node)
    playNode: cc.Node[] = [];//所有玩家节点
    @property(sp.Skeleton)
    settlement: sp.Skeleton = null;//结算牌型
    @property([sp.Skeleton])
    settlePoker: sp.Skeleton[] = [];//公共牌
    @property([cc.Node])
    pokerLight: cc.Node[] = [];//公共牌光圈
    @property([cc.Node])
    pokerBox: cc.Node[] = [];//公共牌遮罩
    @property(cc.Node)
    shgamelight: cc.Node = null;//灯光

    @property(cc.Node)
    buttonList_1: cc.Node = null;//弃牌、跟注、加注
    @property(cc.Node)
    jiaZhu_Button: cc.Node = null;//加注
    @property(cc.Node)
    rangPai_Button: cc.Node = null;//让牌
    @property(cc.Node)
    genZhu_Button: cc.Node = null;//跟注
    @property(cc.Node)
    suoHa_Button: cc.Node = null;//梭哈

    @property(cc.Node)
    buttonList_2: cc.Node = null;//加注值界面
    @property(cc.Node)
    button_Layout: cc.Node = null;//加注值父节点
    @property(cc.Node)
    jiazhuItem: cc.Node = null;//加注按钮预制体

    @property(cc.Node)
    buttonList_3: cc.Node = null;//大盲注、小盲注
    @property(cc.Button)
    button1: cc.Button = null;//3x大盲
    @property(cc.Button)
    button2: cc.Button = null;//4x大盲
    @property(cc.Button)
    button3: cc.Button = null;//1x底池

    @property(sp.Skeleton)
    animator: sp.Skeleton = null;//全屏动画

    @property(cc.Node)
    btn_goon: cc.Node = null;//继续游戏按钮
    @property(sp.Skeleton)
    lookPoker: sp.Skeleton = null;//亮牌

    @property(cc.Slider)
    sliderJiaZhu: cc.Slider = null;//加注滑动器
    @property(cc.Label)
    jiazhuLable: cc.Label = null;//加注变动值

    @property(cc.Node)
    buttonList_4: cc.Node = null;//让或弃、自动让牌、跟任何注、界面
    @property(sp.Skeleton)
    genSkeleton: sp.Skeleton = null;//跟任何注
    @property(sp.Skeleton)
    ziDongSkeleton: sp.Skeleton = null;//自动让牌
    @property(sp.Skeleton)
    rangSkeleton: sp.Skeleton = null;//让或弃

    public _music: DZPK_Music;//声音控制
    public light: DZPK_Light;//灯光
    public _menu: DZPK_MenuUI;//菜单控制
    public _menuNode: cc.Node;//菜单节点
    public _matchNode: DZPK_MatchUI;//匹配界面
    public _sys_news: Array<string>;//跑马灯
    public _emergency_announcement: Array<string>;//跑马灯

    public playList: DZPK_Play[] = [];//所有玩家信息
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
    public cardTypeList: string[] = ["010_gp", "009_dz", "008_ld", "007_st", "006_sz", "005_th_01", "004_hl", "003_st", "002_ths_01", "002_hjths_01"];//牌型
    //看牌0 过牌1 弃牌2 跟注3 加注4 梭哈5
    public cardCode: string[] = ["01_normal", "05_gp", "02_allin_begin", "04_gz", "03_jz",
        "06_qp", "07_dmz", "07_xmz",];

    chairPlay: number = 0;//玩家自己座位号
    goldPlay: number = 0;//玩家自己金额
    cdTime: number = 16;//玩家操作时间
    playstatus: boolean = false;//玩家自己是否参与游戏
    optContext: texas.IOptContext = null;//可操作上下文
    addScore: number = 0;//滑动计数值

    maxScore: number = 0;//大盲注
    cisterna: number = 0;//底池
    tableAllScore: number = 0;//桌面总注
    isLookPoker: boolean = false;

    isGameStart:boolean = false;//判断是否开始游戏
    isQiPai: boolean = false;//玩家自己是否弃牌
    isSuoHa: boolean = false;//是否梭哈
    isGen: boolean = false;//是否选中跟任何注
    isziDongRang: boolean = false;//是否选中自动让牌
    isRangHuoQi: boolean = false;//是否选中让或弃
    userList: texas.IPlayerItem[] = [];//当局开局玩家ID
    playRotation: number[] = [335, 290, 270, 255, 235, 125, 103, 90, 65];

    coinFlyHelper: UCoinDFlyHelper;
    /**9个头像的位置 */
    pos = {
        [0]: cc.v2(-85, -199),
        [1]: cc.v2(-463, -186),
        [2]: cc.v2(-575, -20),
        [3]: cc.v2(-522, 153),
        [4]: cc.v2(-275, 186),
        [5]: cc.v2(277, 188),
        [6]: cc.v2(525, 152),
        [7]: cc.v2(573, -23),
        [8]: cc.v2(470, -190)
    }

    onLoad() {
        this._music = new DZPK_Music();
        this.light = this.shgamelight.getComponent(DZPK_Light);
        CarryingAmount.sumGod = AppGame.ins.roleModel.score;//总金额
        for (let i = 0; i < this.playNode.length; i++) {
            this.playList.push(this.playNode[i].getComponent(DZPK_Play));
        }
    }

    protected init(): void {
        //菜单按钮
        let root = UNodeHelper.find(this.node, "uiroot/content");
        let topleft = UNodeHelper.find(root, "topleft");
        this._menuNode = UNodeHelper.find(root, "topleft/menu_node");
        this._menu = new DZPK_MenuUI(topleft, this._menuNode, this._music);
        this._menu.showMenu(false);
        this.setHorseLampPos(0,300);
        //匹配界面
        this._matchNode = UNodeHelper.getComponent(this.node, "uiroot/content/match_node", DZPK_MatchUI);
        this._matchNode.init();
        UEventHandler.addSliderClick(this.sliderJiaZhu.node, this.node, "DZPK_SceneUI", "musicchange");

        //荷官动画监听
        this.heguan.setCompleteListener(() => {
            this.SkeletonAnim("heguan_normal", this.heguan, true);
        });

        //输赢动画
        this.animator.setCompleteListener(() => {
            this.animator.node.active = false;
        });

        this.coinFlyHelper = new UCoinDFlyHelper(this.chip_Pre, this.chip_Animator, this.pos);
    }

    //事件监听层
    protected onEnable(): void {
        super.onEnable();
        DZPK_Model.ins.gameState = true;
        DZPK_Model.ins.on(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);

        DZPK_Model.ins.on("CMD_S_StatusFree", this.CMD_S_StatusFree, this);//空闲场景消息
        DZPK_Model.ins.on("CMD_S_StatusPlay", this.CMD_S_StatusPlay, this);//游戏中场景消息
        DZPK_Model.ins.on("CMD_S_StatusEnd", this.CMD_S_StatusEnd, this);//游戏结束场景
        DZPK_Model.ins.on("CMD_S_GameStart", this.CMD_S_GameStart, this);//游戏开始
        DZPK_Model.ins.on("CMD_S_AddScore", this.CMD_S_AddScore, this);//用户跟注/加注
        DZPK_Model.ins.on("CMD_S_GiveUp", this.CMD_S_GiveUp, this);//用户弃牌
        DZPK_Model.ins.on("CMD_S_PassScore", this.CMD_S_PassScore, this);//用户过牌
        DZPK_Model.ins.on("CMD_S_AllIn", this.CMD_S_AllIn, this);//孤注一掷 梭哈
        DZPK_Model.ins.on("CMD_S_GameEnd", this.CMD_S_GameEnd, this);//游戏结束
        DZPK_Model.ins.on("CMD_S_SendCard", this.CMD_S_SendCard, this);//发牌
        DZPK_Model.ins.on("CMD_S_AndroidCard", this.CMD_S_AndroidCard, this);//机器人消息
        DZPK_Model.ins.on("CMD_S_Operate_Notify", this.CMD_S_Operate_Notify, this);//操作失败通知
        DZPK_Model.ins.on("CMD_S_RoundEndExitResult", this.CMD_S_RoundEndExitResult, this);//用户看牌
        DZPK_Model.ins.on("sc_ts_player_start_change", this.sc_ts_player_start_change, this);//其他玩家离开
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        DZPK_Model.ins.on("GoonGame", this.goonGame, this);//继续游戏
        DZPK_Model.ins.on("CarryingAmountTips", this.onCarrying, this);//设置携带返回
        DZPK_Model.ins.on("CMD_S_BroadcastTakeScore", this.CMD_S_BroadcastTakeScore, this);//设置携带返回
        DZPK_Model.ins.run();

    }
    //关闭事件监听
    protected onDisable(): void {
        super.onDisable();
        DZPK_Model.ins.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.sc_ts_room_playerinfo, this);

        DZPK_Model.ins.off("CMD_S_StatusFree", this.CMD_S_StatusFree, this);//空闲场景消息
        DZPK_Model.ins.off("CMD_S_StatusPlay", this.CMD_S_StatusPlay, this);//游戏中场景消息
        DZPK_Model.ins.off("CMD_S_StatusEnd", this.CMD_S_StatusEnd, this);//游戏结束场景
        DZPK_Model.ins.off("CMD_S_GameStart", this.CMD_S_GameStart, this);//游戏开始
        DZPK_Model.ins.off("CMD_S_AddScore", this.CMD_S_AddScore, this);//用户跟注/加注
        DZPK_Model.ins.off("CMD_S_GiveUp", this.CMD_S_GiveUp, this);//用户弃牌
        DZPK_Model.ins.off("CMD_S_PassScore", this.CMD_S_PassScore, this);//用户过牌
        DZPK_Model.ins.off("CMD_S_AllIn", this.CMD_S_AllIn, this);//孤注一掷 梭哈
        DZPK_Model.ins.off("CMD_S_GameEnd", this.CMD_S_GameEnd, this);//游戏结束
        DZPK_Model.ins.off("CMD_S_SendCard", this.CMD_S_SendCard, this);//发牌
        DZPK_Model.ins.off("CMD_S_AndroidCard", this.CMD_S_AndroidCard, this);//机器人消息
        DZPK_Model.ins.off("CMD_S_Operate_Notify", this.CMD_S_Operate_Notify, this);//操作失败通知
        DZPK_Model.ins.off("CMD_S_RoundEndExitResult", this.CMD_S_RoundEndExitResult, this);//用户看牌
        DZPK_Model.ins.off("sc_ts_player_start_change", this.sc_ts_player_start_change, this);//其他玩家离开
        DZPK_Model.ins.off("GoonGame", this.goonGame, this);//继续游戏
        DZPK_Model.ins.off("CarryingAmountTips", this.onCarrying, this);//设置携带返回
        DZPK_Model.ins.off("CMD_S_BroadcastTakeScore", this.CMD_S_BroadcastTakeScore, this);//设置携带返回
        DZPK_Model.ins.exit();
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        this._music.stop();
    }

    //获取牌值
    returnCard(tempCard16: number) {
        for (let i = 0; i < DZPK_Model.ins.card16.length; i++) {
            if (DZPK_Model.ins.card16[i] == tempCard16) {
                return this.cardValueLsit[i];
            }
        }
        return "fp_04_001";
    }

    //查找返回玩家数据
    returnPlayID(userID: number) {
        for (let i = 0; i < this.playList.length; i++) {
            if (this.playList[i].userId == userID) {
                return this.playList[i];
            }
        }
    }

    //1、当前进入房间玩家信息
    sc_ts_room_playerinfo(data: RoomPlayerInfo) {
        if (MRoomModel.ROOM_ID != 0) {
            switch (MRoomModel.ROOM_ID) {
                case 4501:
                    this.Label_1.string = "体验场";
                    break;
                case 4502:
                    this.Label_1.string = "平民场";
                    break;
                case 4503:
                    this.Label_1.string = "贵族场";
                    break;
                case 4504:
                    this.Label_1.string = "官甲场";
                    break;
            }
        }
        if (data.userId == AppGame.ins.roleModel.useId) {
            this.chairPlay = data.chairId;//玩家自己座位号
            this.goldPlay = data.score;//玩家自己金额
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
                let tempCoun = data.chairId + (9 - this.chairPlay);
                this.playList[tempCoun].node.active = true;
                this.playList[tempCoun].init(data);
            }
        }
    }

    //======================加注================================

    //点击加注，生成加注按钮
    jiaZhuButton() {
        this.buttonList_1.active = false;//弃牌、跟注、加注
        this.buttonList_2.active = true;//加注值界面
        this.button_Layout.removeAllChildren();
        this.jiaZhuJianTou();//滑动箭头
        for (let i = this.optContext.jettons.length - 1; i >= 0; i--) {
            let tempPre = cc.instantiate(this.jiazhuItem);
            tempPre.active = true;
            this.button_Layout.addChild(tempPre);
            tempPre.setPosition(0, 0);
            if (i < this.optContext.range[0] || this.goldPlay < this.optContext.jettons[i]) {
                tempPre.getComponent(cc.Button).interactable = false;
            }
            tempPre.getChildByName("Label").getComponent(cc.Label).string = UStringHelper.getMoneyFormat((this.optContext.jettons[i] * DZPK_SCALE));
            UEventHandler.addClick(tempPre, this.node, "DZPK_SceneUI", "jiaZhuValue", this.optContext.jettons[i]);
        }
    }

    //滑动箭头
    jiaZhuJianTou() {
        this.sliderJiaZhu.progress = 0;
        this.addScore = this.optContext.minAddScore;
        this.jiazhuLable.string = UStringHelper.getMoneyFormat((this.optContext.minAddScore * DZPK_SCALE));//当前最小加注值
    }

    //滑动组件
    musicchange(caller: cc.Slider): void {
        if (caller.progress == 1) {
            this.addScore = this.goldPlay;
        }
        else if (caller.progress == 0) {
            this.addScore = this.optContext.minAddScore;
        }
        else {
            let vlaue = this.goldPlay - this.optContext.minAddScore;
            this.addScore = (vlaue * caller.progress) + this.optContext.minAddScore;
            let str = Math.floor(this.addScore).toString();
            let num = parseInt(str.substr(str.length - 2, str.length));
            let tempStr = "00";
            if (num <= 50) {
                tempStr = "50";
            }
            let tempScore = str.substr(0, str.length - 2) + tempStr;
            this.addScore = parseInt(tempScore);
        }
        this.jiazhuLable.string = UStringHelper.getMoneyFormat(this.addScore * DZPK_SCALE);
    }

    //点击第二层加注
    jiaZhuButton2() {
        DZPK_Model.ins.jiazhu(4, this.addScore);//发送加注、跟注
        this.buttonList_1.active = false;
        this.buttonList_2.active = false;
        this.SkeletonAnim("heguan_kiss", this.heguan, false);
    }

    //加注值
    jiaZhuValue(event, data) {
        this.SkeletonAnim("heguan_kiss", this.heguan, false);
        DZPK_Model.ins.jiazhu(4, data);
        this.buttonList_1.active = false;
        this.buttonList_2.active = false;
    }

    //3x大盲,4x大盲,1x底池,
    mangZhu(event, data) {
        if (data == 0) {
            DZPK_Model.ins.jiazhu(4, this.maxScore * 3);
        }
        else if (data == 1) {
            DZPK_Model.ins.jiazhu(4, this.maxScore * 4);
        }
        else if (data == 2) {
            DZPK_Model.ins.jiazhu(4, this.tableAllScore);
        }
        this.SkeletonAnim("heguan_kiss", this.heguan, false);
        this.buttonList_1.active = false;
        this.buttonList_2.active = false;
    }

    //======================================================

    //让牌
    rangPaiButton() {
        this.SkeletonAnim("heguan_kiss", this.heguan, false);
        DZPK_Model.ins.rangPai();
        this.buttonList_1.active = false;
    }

    //梭哈
    texasButton() {
        this.SkeletonAnim("heguan_kiss", this.heguan, false);
        DZPK_Model.ins.texas();
        this.buttonList_1.active = false;
        this.buttonList_2.active = false;
    }

    //弃牌
    qiPaiButton() {
        this.SkeletonAnim("heguan_kiss", this.heguan, false);
        DZPK_Model.ins.qipai();
        this.buttonList_1.active = false;
        this.buttonList_2.active = false;
        this.buttonList_4.active = false;
    }

    //跟注
    genzhu() {
        this.SkeletonAnim("heguan_kiss", this.heguan, false);
        DZPK_Model.ins.jiazhu(3, this.optContext.followScore);
        this.buttonList_1.active = false;
    }

    //跟任何注：如果前面让牌，此操作也会让牌，如果前面加注或ALL in，此操作也会跟随。
    genRenHeZhu() {
        if (this.genSkeleton.animation == "blue_normal") {
            this.isGen = true;
            this.SkeletonAnim("heguan_knock_table", this.heguan, false);
            this.SkeletonAnim("blue_select", this.genSkeleton, true);
        }
        else {
            this.isGen = false;
            this.SkeletonAnim("blue_normal", this.genSkeleton);
        }
        this.isziDongRang = false;
        this.SkeletonAnim("green_normal", this.ziDongSkeleton);
        this.isRangHuoQi = false;
        this.SkeletonAnim("red_normal", this.rangSkeleton);
    }

    //自动让牌：首选让牌，若前面产生加注则返回手动操作
    ziDongRenPai() {
        if (this.ziDongSkeleton.animation == "green_normal") {
            this.isziDongRang = true;
            this.SkeletonAnim("heguan_knock_table", this.heguan, false);
            this.SkeletonAnim("green_select", this.ziDongSkeleton, true);
        }
        else {
            this.isziDongRang = false;
            this.SkeletonAnim("green_normal", this.ziDongSkeleton);
        }
        this.isGen = false;
        this.SkeletonAnim("blue_normal", this.genSkeleton);
        this.isRangHuoQi = false;
        this.SkeletonAnim("red_normal", this.rangSkeleton);
    }

    //让或弃:首选让牌，若前面产生加注则弃牌
    rengHuoQi() {
        if (this.rangSkeleton.animation == "red_normal") {
            this.isRangHuoQi = true;
            this.SkeletonAnim("heguan_knock_table", this.heguan, false);
            this.SkeletonAnim("red_select", this.rangSkeleton, true);
        }
        else {
            this.isRangHuoQi = false;
            this.SkeletonAnim("red_normal", this.rangSkeleton);
        }
        this.isGen = false;
        this.SkeletonAnim("blue_normal", this.genSkeleton);
        this.isziDongRang = false;
        this.SkeletonAnim("green_normal", this.ziDongSkeleton);
    }

    //初始化 跟任何注 自动让牌  让或弃
    initButton() {
        this.isziDongRang = false;
        this.isGen = false;
        this.isRangHuoQi = false;
        this.SkeletonAnim("green_normal", this.ziDongSkeleton);
        this.SkeletonAnim("blue_normal", this.genSkeleton);
        this.SkeletonAnim("red_normal", this.rangSkeleton);
    }

    //==============================================消息接收=========================

    //广播携带分
    CMD_S_BroadcastTakeScore(data: texas.CMD_S_BroadcastTakeScore): void {
        let tempPlay = this.returnPlay(data.chairId);
        if (tempPlay != null) {
            tempPlay.node.active = true;
            tempPlay.updateGold(data.takescore);
        }
    }

    //空闲场景消息
    CMD_S_StatusFree(data: texas.CMD_S_StatusFree): void {
        this.isGameStart=false;
        this.maxScore = data.cellscore;
        this.Label_2.string = "大盲注：" + UStringHelper.getMoneyFormat((data.cellscore * DZPK_SCALE));
        this.Label_3.string = "小盲注：" + UStringHelper.getMoneyFormat(((data.cellscore * 0.5) * DZPK_SCALE));

        this.initPlayerInfo(data.players);
    }

    //断开网络清理界面
    protected reconnect_in_game_but_no_in_gaming(): void {
        super.reconnect_in_game_but_no_in_gaming();
        this._matchNode.show();//显示正在匹配中
        this.shgamelight.opacity = 0;//关闭灯光
        this.userList = [];
        this.initGame();//初始化数值
        for (let i = 0; i < this.playList.length; i++) {
            this.playList[i].action.active = false;
            this.playList[i].initGame();
            if (i != 0) {
                this.playList[i].chairID = 666;
                this.playList[i].userId = 666;
                this.playList[i].node.active = false;
            }
        }
    }


    //断线重连消息
    CMD_S_StatusPlay(data: texas.CMD_S_StatusPlay): void {
        this.isGameStart=true;
        this._matchNode.hide();//关闭匹配图标
        this.label_node.active = true;//打开池底
        this.shgamelight.opacity = 255;//打开灯光
        this.cdTime = data.wTotalTime;//剩余时间
        this.tableAllScore = data.tableAllScore;
        this.bianhao.string = "牌局编号:" + data.roundId;
        this.optContext = data.ctx;
        this.maxScore = data.cellscore;
        CarryingAmount.curTakeScore = data.cfgTakeScore;
        CarryingAmount.bAutoSetScore = data.isAutoSetScore;
        this.Label_2.string = "大盲注：" + UStringHelper.getMoneyFormat((data.cellscore * DZPK_SCALE));
        this.Label_3.string = "小盲注：" + UStringHelper.getMoneyFormat(((data.cellscore * 0.5) * DZPK_SCALE));
        this.initPlayerInfo(data.players);
        this.potsChiBox(data.pots);//主池、边池
        this.userList = [];
        for (let i = 0; i < data.players.length; i++) {
            this.userList.push(data.players[i]);
        }
        //玩家赋值
        for (let i = 0; i < data.players.length; i++) {
            for (let j = 0; j < this.playList.length; j++) {
                if (data.players[i].userId == this.playList[j].userId) {
                    this.playList[j].assignment(data.BankerUser, data.CurrentUser, data.players[i], data.tableAllScore, false);
                }
            }
        }
        //公共牌
        if (data.tableCards != null) {
            for (let k = 0; k < data.tableCards.cards.length; k++) {
                this.pokerCount++;
                this.settlePoker[k].node.parent.active = true;
                this.SkeletonAnim(this.returnCard(data.tableCards.cards[k]), this.settlePoker[k]);//翻牌动画
            }
        }

        for (let i = 0; i < this.playList.length; i++) {
            this.playList[i].updateCT(data.CurrentUser, data.wTimeLeft);
        }

        if (data.CurrentUser == this.chairPlay) {//判断是否是自己先开局
            this.buttonList_1.active = true;
            this.buttonList_2.active = false;
            if (data.ctx != null) {
                this.optContext = data.ctx;
                this.rangPai_Button.active = data.ctx.canPass;//让牌
                this.genZhu_Button.active = data.ctx.canFollow;//跟注
                this.jiaZhu_Button.active = data.ctx.canAdd;//加注
                this.suoHa_Button.active = data.ctx.canAllIn;//梭哈
                this.playList[0].updateCT(this.chairPlay, data.wTimeLeft);
                if (data.ctx.canFollow) {
                    this.genZhu_Button.getChildByName("JiaZhu").getComponent(cc.Label).string =
                        "跟注" + UStringHelper.getMoneyFormat((data.ctx.followScore * DZPK_SCALE));
                }

                if (data.ctx.canAdd) {//加注显示
                    this.buttonList_3.active = true;
                    let temp3 = this.maxScore * 3;
                    let temp4 = this.maxScore * 4;

                    if (temp3 >= data.ctx.minAddScore) {
                        this.button1.interactable = true;
                    }
                    else {
                        this.button1.interactable = false;
                    }

                    if (temp4 >= data.ctx.minAddScore) {
                        this.button2.interactable = true;
                    }
                    else {
                        this.button2.interactable = false;
                    }

                    if (this.tableAllScore >= data.ctx.minAddScore && this.tableAllScore <= this.goldPlay) {
                        this.button3.interactable = true;
                    }
                    else {
                        this.button3.interactable = false;
                    }
                }
                else {
                    this.buttonList_3.active = false;
                }
            }
        }
        else {
            this.buttonList_1.active = false;
            this.buttonList_2.active = false;
            if (!this.isQiPai && !this.playList[0].outSp.activeInHierarchy) {
                this.buttonList_4.active = true;
            }
        }
        let tempBig = this.returnPlay(data.BigBlindUser);
        let tempSma = this.returnPlay(data.SmallBlindUser)
        if (tempBig != null) {
            tempBig.BigSmallBlindUser(6);//大盲注
        }

        if (tempSma != null) {
            tempSma.BigSmallBlindUser(7);//小盲注
        }
    }

    //游戏结束场景
    CMD_S_StatusEnd(data: texas.CMD_S_StatusEnd): void {
        this._matchNode.hide();//关闭匹配中
        this.isGameStart=false;
        this.shgamelight.opacity = 0;//关闭灯光
        DZPK_Model.ins.gameState = true;//玩家弃牌了，可以离开游戏
        this.Label_2.string = "大盲注：" + UStringHelper.getMoneyFormat((data.cellscore * DZPK_SCALE));
        this.Label_3.string = "小盲注：" + UStringHelper.getMoneyFormat(((data.cellscore * 0.5) * DZPK_SCALE));

        this.initPlayerInfo(data.players);

        if(data.wTimeLeft>=3){
            if(data.gameEndInfo!=null){
                for (let i = 0; i < data.tableCards.cards.length; i++) {
                    this.settlePoker[i].node.parent.active = true;
                    this.SkeletonAnim(this.returnCard(data.tableCards.cards[i]), this.settlePoker[i]);//翻牌动画
                }
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
    initPlayerInfo(dataPlayers: texas.IPlayerItem[]){
        for (let i = 0; i < dataPlayers.length; i++) {
            if(dataPlayers[i].userId == AppGame.ins.roleModel.useId){
                this.chairPlay = dataPlayers[i].chairId;//玩家自己座位号
                this.goldPlay = dataPlayers[i].takeScore;//玩家自己金额
                CarryingAmount.sumGod = dataPlayers[i].takeScore;
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
                    let tempCoun = dataPlayers[i].chairId + (9 - this.chairPlay);
                    this.playList[tempCoun].node.active = true;
                    this.playList[tempCoun].init(this.retuenPlayerInfo(dataPlayers[i]));
                }
           }
        }
    }

    //返回房间玩家信息
    retuenPlayerInfo(data: texas.IPlayerItem){
        let tempPlay=new RoomPlayerInfo();
        tempPlay.userId=data.userId;
        tempPlay.account=data.userId;
        tempPlay.nickName=data.nickname;
        tempPlay.headId=data.headId;
        tempPlay.headImgUrl=data.headImgUrl;
        tempPlay.headboxId=data.headBoxIndex;
        tempPlay.vipLevel=data.vipLevel;
        tempPlay.tableId=DZPK_Model.ins.tableId;
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
    showPlayCard(data: texas.ICMD_S_GameEnd,dataPlayers: texas.IPlayerItem[]){
        this.isGameStart=false;
        this.userList = [];//清空当前玩游戏的玩家ID
        this.initButton();
        this._matchNode.hide();//关闭正在匹配中
        for (let i = 0; i < data.players.length; i++) {
            let tempPlay = this.returnPlay(data.players[i].chairId);
            if (tempPlay != null) {
                tempPlay.CMD_S_GameEnd(data.players[i],2);
                if (data.players[i].userId == AppGame.ins.roleModel.useId) {
                    this.scheduleOnce(() => {
                        this.winAnimator(data.players[i].deltascore);//输赢动画
                    }, 1)
                }

                if (data.winuser == data.players[i].chairId) {//赢家数据
                    if (data.showwincard) {
                        this.settlement.node.active = true;
                        this.SkeletonAnim(this.cardTypeList[data.players[i].handcards.ty], this.settlement);
                        this.showPokerLight(data.players[i].tblIndexs);
                        tempPlay.showPokerLight(data.players[i].handIndexs);
                        this.scheduleOnce(() => {
                            this._music.winMusic(data.players[i].handcards.ty);//输赢声音
                        }, 1)
                    }

                    //特殊情况，平局或多个赢家
                    for (let j = 0; j < data.players.length; j++) {
                        if (data.players[j].deltascore >= 0) {//赢家
                            if (data.players[j].chairId != data.winuser) {
                                let play = this.returnPlay(data.players[j].chairId);
                                if (data.players[j].deltascore == data.players[i].deltascore && play != null) {//平局
                                    let winIndex = data.players[i];
                                    let tempCard = [];//牌值
                                    for (let k = 0; k < winIndex.handIndexs.length; k++) {
                                        tempCard.push(winIndex.handcards.cards[winIndex.handIndexs[k]]);
                                    }

                                    if (tempCard.length != 0) {
                                        let sumIndex = data.players[j];
                                        let newIndex = [];//新的下标
                                        for (let m = 0; m < tempCard.length; m++) {
                                            for (let v = 0; v < sumIndex.handcards.cards.length; v++) {
                                                if ((tempCard[m] % 16) == (sumIndex.handcards.cards[v] % 16)) {
                                                    newIndex.push(v);
                                                }
                                            }
                                        }

                                        this.scheduleOnce(() => {
                                            //新的下标
                                            if (newIndex.length != 0) {
                                                play.showPokerLight(newIndex);
                                            }
                                        }, 0.1)
                                    }
                                }
                                else {//不是平局
                                    if (play != null) {
                                        play.pokerShow(true);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                UDebug.log("结算前有人跑路了！");
            }
        }

        //游戏结算展示玩家手牌和是否弃牌
        for (let i = 0; i < dataPlayers.length; i++) {
            let tempPlay = this.returnPlay(dataPlayers[i].chairId);
            if (tempPlay != null) {
                tempPlay.UpdateCards(dataPlayers[i].handCards, dataPlayers[i].isGiveup,dataPlayers[i].playstatus);
            }
        }

        //延时自动初始化
        this.scheduleOnce(() => {
            this._matchNode.show();//显示正在匹配中
            this.initGame();//初始化数值
        }, 2)
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

    //1、开始游戏
    public CMD_S_GameStart(data: texas.CMD_S_GameStart) {
        let curDate = new Date();
        this.initGameToBack(curDate.getSeconds());
        this.gameEndTime=666;
        this.isGameStart=true;
        this._matchNode.hide();//关闭匹配图标
        this.isQiPai = false;
        this._music.startGame();
        this.Label_2.string = "大盲注：" + UStringHelper.getMoneyFormat((data.cellscore * DZPK_SCALE));
        this.Label_3.string = "小盲注：" + UStringHelper.getMoneyFormat(((data.cellscore * 0.5) * DZPK_SCALE));
        this.showTips(data.needtip, data.setscoretip, data.players);//提示

        this.userList = [];
        for (let i = 0; i < data.players.length; i++) {
            this.userList.push(data.players[i]);
        }

        this.sortPlay(data.players, data.tableAllScore);
        this.animator.node.active = true;
        this.SkeletonAnim("begin", this.animator);
        this.scheduleOnce(() => {
            this.potsChiBox(data.pots);//主池、边池
            this.btn_chat.active = true;//聊天按钮
            this.btn_chouMa.active = true;//带入筹码按钮
            this.label_node.active = true;//打开池底
            this.cdTime = data.nextStep.wTimeLeft;//玩家操作时间
            this.bianhao.string = "牌局编号:" + data.roundId;//牌局编号
            this.tableAllScore = data.tableAllScore;
            //玩家赋值
            this.sendCardCount = [];
            for (let i = 0; i < this.players.length; i++) {
                for (let j = 0; j < this.playList.length; j++) {
                    if (this.players[i].userId == this.playList[j].userId) {
                        this.sendCardCount.push(j);
                        this.playList[j].assignment(data.BankerUser, data.nextStep.NextUser, this.players[i], data.tableAllScore);
                    }
                }
            }
            this.SendCardAnim();//发牌动画

            let tempTime = 0.4;
            if (data.nextStep.NextUser == this.chairPlay) {
                tempTime = data.players.length * 0.4;
            }

            this.scheduleOnce(() => {
                this.shgamelight.opacity = 255;//打开灯光
                let tempPlay = this.returnPlay(data.nextStep.NextUser);
                if (tempPlay != null) {
                    let rotationPos = tempPlay.rotationPos;
                    this.light.tempAngle = rotationPos
                    this.shgamelight.angle = rotationPos;
                }
                this.CMD_S_Next_StepInfo(data.nextStep);//桌面情况及下一步操作信息
            }, tempTime)
        }, 1.5)
    }

    //提示
    showTips(needtip: boolean, setscoretip: boolean, players: texas.IPlayerItem[]) {
        for (let i = 0; i < players.length; i++) {
            if (players[i].userId == AppGame.ins.roleModel.useId) {
                if (needtip) {
                    this.showTipsUI("您的牌桌携带筹码已调整至" + (players[i].takeScore + players[i].tableScore) * 0.01);
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

    //初始发牌动画=========================================
    cardCount: number = 0;
    isOne: boolean = true;
    sendCardCount: number[] = [];
    players: texas.IPlayerItem[] = [];

    //排序玩家座位号
    sortPlay(players: texas.IPlayerItem[], tableAllScore: number) {
        let tempI = 0;
        for (let i = 0; i < players.length; i++) {
            if (players[i].tableScore != 0) {
                let tempScore = players[i].tableScore / tableAllScore;
                if (tempScore < 0.5) {//小盲注
                    tempI = i;
                    break;
                }
            }
        }
        this.players = [];
        for (let k = tempI; k < players.length; k++) {
            this.players.push(players[k]);
        }
        for (let j = 0; j < tempI; j++) {
            this.players.push(players[j]);
        }
    }

    //发牌动画
    SendCardAnim() {
        try {
            if (this.isOne) {//第一张牌
                if (this.cardCount < this.sendCardCount.length) {
                    this.playList[this.sendCardCount[this.cardCount]].newSendCard(this.isOne, 0);
                }
                else {
                    this.isOne = false;
                    this.cardCount = 0;
                    if (this.playList[this.sendCardCount[this.cardCount]] != null) {
                        this.playList[this.sendCardCount[this.cardCount]].newSendCard(this.isOne, 1);
                    }
                }
            }
            else {
                if (this.cardCount < this.sendCardCount.length) {
                    this.playList[this.sendCardCount[this.cardCount]].newSendCard(this.isOne, 1);
                }
            }
        } catch (error) {
            UDebug.error("玩家离开了：", error);
        }
    }

    //主池、边池
    potsChiBox(pots: number[]) {
        if (pots.length > 0) {
            this.chiBox0.string = UStringHelper.getMoneyFormat((pots[0] * DZPK_SCALE));//池底
            //边池
            this.chiLayout.removeAllChildren();
            for (let index = 1; index < pots.length; index++) {
                let tempPre = cc.instantiate(this.chiBox1);
                tempPre.active = true;
                this.chiLayout.addChild(tempPre);
                tempPre.setPosition(0, 0);
                tempPre.getChildByName("chi_01").getComponent(cc.Sprite).spriteFrame = this.chiBoxSF[index - 1];
                tempPre.getChildByName("chi_value").getComponent(cc.Label).string = UStringHelper.getMoneyFormat((pots[index] * DZPK_SCALE));
            }
        }
    }

    //桌面情况及下一步操作信息
    CMD_S_Next_StepInfo(data: texas.ICMD_S_Next_StepInfo) {
        this._matchNode.hide();//关闭匹配图标
        if (data != null) {
            for (let i = 0; i < this.playList.length; i++) {
                this.playList[i].updateCT(data.NextUser, data.wTimeLeft);//倒计时
            }

            if (data.ctx != null) {
                this.optContext = data.ctx;
            }

            //判断是否是自己先开局
            if (data.NextUser == this.chairPlay) {
                this.scheduleOnce(() => {
                    //自动让牌
                    if (this.isziDongRang) {
                        if (data.ctx.canPass) {//自动让牌
                            DZPK_Model.ins.rangPai();
                            this.initButton();
                            return;
                        }
                    }

                    //跟任何注：
                    if (this.isGen) {
                        if (data.ctx.canPass) {//自动让牌
                            DZPK_Model.ins.rangPai();
                            this.initButton();
                            return;
                        }

                        if (data.ctx.canFollow) {//自动跟注
                            DZPK_Model.ins.jiazhu(3, data.ctx.followScore);
                            this.initButton();
                            return;
                        }

                        if (data.ctx.canAllIn) {//自动梭哈
                            DZPK_Model.ins.texas();
                            this.initButton();
                            return;
                        }
                    }

                    //让或弃
                    if (this.isRangHuoQi) {
                        if (data.ctx.canPass) {//自动让牌
                            DZPK_Model.ins.rangPai();
                            this.initButton();
                            return;
                        }

                        if (data.ctx.canFollow || data.ctx.canAllIn) {//自动弃牌
                            DZPK_Model.ins.qipai();
                            this.initButton();
                            return;
                        }
                    }

                    this.buttonList_1.active = true;
                    if (data.ctx != null) {
                        this.rangPai_Button.active = data.ctx.canPass;//让牌
                        this.genZhu_Button.active = data.ctx.canFollow;//跟注
                        this.jiaZhu_Button.active = data.ctx.canAdd;//加注
                        this.suoHa_Button.active = data.ctx.canAllIn;//梭哈
                        if (data.ctx.canFollow) {
                            this.genZhu_Button.getChildByName("JiaZhu").getComponent(cc.Label).string =
                                "跟注" + UStringHelper.getMoneyFormat((data.ctx.followScore * DZPK_SCALE));
                        }
                        if (data.ctx.canAdd) {//加注显示
                            this.buttonList_3.active = true;
                            let temp3 = this.maxScore * 3;
                            let temp4 = this.maxScore * 4;

                            if (temp3 >= data.ctx.minAddScore) {
                                this.button1.interactable = true;
                            }
                            else {
                                this.button1.interactable = false;
                            }

                            if (temp4 >= data.ctx.minAddScore) {
                                this.button2.interactable = true;
                            }
                            else {
                                this.button2.interactable = false;
                            }

                            if (this.tableAllScore >= data.ctx.minAddScore && this.tableAllScore <= this.goldPlay) {
                                this.button3.interactable = true;
                            }
                            else {
                                this.button3.interactable = false;
                            }
                        }
                        else {
                            this.buttonList_3.active = false;
                        }
                    }
                    this.buttonList_4.active = false;
                    this.initButton();
                }, 0.2)
            }
            else {
                this.buttonList_1.active = false;
                this.buttonList_2.active = false;
                if (this.isQiPai || this.isSuoHa || !this.playstatus) {//自己是否弃牌
                    this.buttonList_4.active = false;
                }
                else {
                    if (!this.btn_goon.activeInHierarchy) {
                        this.buttonList_4.active = true;
                    }
                }
            }
        }
        else {
            this.buttonList_1.active = false;
            this.buttonList_2.active = false;
        }
    }

    //灯光旋转动画
    lightAnim(rotation: number) {
        this.light.startRotation(rotation);
    }

    //接收 用户跟注/加注
    CMD_S_AddScore(data: texas.CMD_S_AddScore): void {
        this.potsChiBox(data.pots);//主池、边池
        let tempPlay = this.returnPlay(data.opUser);
        if (tempPlay != null) {
            tempPlay.CMD_S_AddScore(data);//查找返回玩家数据    
        }
        this.tableAllScore = data.tableAllScore;
        this.CMD_S_Next_StepInfo(data.nextStep);//桌面情况及下一步操作信息
    }

    //用户弃牌
    CMD_S_GiveUp(data: texas.CMD_S_GiveUp): void {
        this.potsChiBox(data.pots);//主池、边池
        let tempPlay = this.returnPlay(data.GiveUpUser);
        if (tempPlay != null) {
            tempPlay.CMD_S_GiveUp(data);//查找返回玩家数据
        }

        if (data.GiveUpUser == this.chairPlay) {
            this.isQiPai = true;
            DZPK_Model.ins.gameState = true;//玩家弃牌了，可以离开游戏
            if (AppGame.ins.currRoomKind == ERoomKind.Normal) {
                if (this.userList.length > 2) {
                    this.lookPoker.node.active = true;//亮牌
                    this.SkeletonAnim("red_normal", this.lookPoker);
                    //this.btn_goon.active = true;//只有是普通场的时候才可以有继续游戏按钮
                }
                else {
                    UDebug.log("游戏用户数量:" + this.userList.length);
                }
            }
        }

        if (data.nextStep != null) {
            this.CMD_S_Next_StepInfo(data.nextStep);//桌面情况及下一步操作信息
        }
        this.deleteUserList(data.GiveUpUser)
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
    CMD_S_PassScore(data: texas.CMD_S_PassScore): void {
        this.potsChiBox(data.pots);//主池、边池
        let tempPlay = this.returnPlay(data.PassUser);
        if (tempPlay != null) {
            tempPlay.CMD_S_PassScore(data);//查找返回玩家数据
        }
        if (data.nextStep != null) {
            this.CMD_S_Next_StepInfo(data.nextStep);//桌面情况及下一步操作信息
        }
    }

    //孤注一掷 梭哈
    CMD_S_AllIn(data: texas.CMD_S_AllIn): void {
        this.potsChiBox(data.pots);//主池、边池
        this.tableAllScore = data.tableAllScore;
        let tempPlay = this.returnPlay(data.AllinUser);
        if (tempPlay != null) {
            tempPlay.CMD_S_AllIn(data);//查找返回玩家数据
        }
        if (data.nextStep != null) {
            this.CMD_S_Next_StepInfo(data.nextStep);//桌面情况及下一步操作信息
        }
    }

    pokerCount: number = 0;
    //发牌
    CMD_S_SendCard(data: texas.CMD_S_SendCard): void {
        this.potsChiBox(data.pots);//主池、边池
        this._music.playfapai();
        if (data.nextStep != null) {
            this.CMD_S_Next_StepInfo(data.nextStep);//桌面情况及下一步操作信息
        }
        if (this.settlePoker[this.pokerCount] != null) {
            this.settlePoker[this.pokerCount].node.parent.active = true;
        }
        this.SkeletonAnim(this.returnCard(data.cards[0]), this.settlePoker[this.pokerCount]);//翻牌动画
        let tempPlay = this.returnPlay(this.chairPlay);
        if (tempPlay != null) {
            tempPlay.CMD_S_SendCard(data.ty);
        }
        this.pokerCount++;
    }

    //结算筹码动画
    creatoeChip(chipPos: number, index: number) {
        this._music.playflyCoin();
        let tempX = 0;
        if (this.chiLayout.children[index] != null) {
            tempX = this.chiLayout.children[index].position.x;
        }
        for (let i = 0; i < 12; i++) {
            var item = this.coinFlyHelper.getInstans();
            item.active = true;
            if (index != 0) {
                item.setPosition(tempX, 75);
            }
            else {
                item.setPosition(0, 115);
            }
            this.coinFlyHelper.moveChipToRect(item, 0, chipPos);
        }
    }

    //游戏结束
    CMD_S_GameEnd(data: texas.CMD_S_GameEnd): void {
        let curDate = new Date();
        this.gameEndTime=curDate.getSeconds();
        this.isGameStart=false;
        this.userList = [];//清空当前玩游戏的玩家ID
        this.btn_goon.active = false;
        this.lookPoker.node.active = false;//亮牌
        this.initButton();
        this.buttonList_1.active = false;//加注、让牌、弃牌
        this.buttonList_2.active = false;
        this.buttonList_4.active = false;//让或弃、自动跟注
        this.shgamelight.opacity = 0;//关闭灯光

        for (let i = 0; i < data.players.length; i++) {
            let tempPlay = this.returnPlay(data.players[i].chairId);
            if (tempPlay != null) {
                tempPlay.CMD_S_GameEnd(data.players[i],4);
                if (data.players[i].chairId == this.chairPlay && data.players[i].userId == AppGame.ins.roleModel.useId) {
                    this.scheduleOnce(() => {
                        this.winAnimator(data.players[i].deltascore);//输赢动画
                    }, 2)
                }

                if (data.winuser == data.players[i].chairId) {//赢家数据
                    if (data.showwincard) {
                        this.settlement.node.active = true;
                        this.SkeletonAnim(this.cardTypeList[data.players[i].handcards.ty], this.settlement);
                        this.showPokerLight(data.players[i].tblIndexs);
                        tempPlay.showPokerLight(data.players[i].handIndexs);
                        this.scheduleOnce(() => {
                            this._music.winMusic(data.players[i].handcards.ty);//输赢声音
                        }, 1)
                    }

                    //特殊情况，平局或多个赢家
                    for (let j = 0; j < data.players.length; j++) {
                        if (data.players[j].deltascore >= 0) {//赢家
                            if (data.players[j].chairId != data.winuser) {
                                let play = this.returnPlay(data.players[j].chairId);
                                if (data.players[j].deltascore == data.players[i].deltascore && play != null) {//平局
                                    let winIndex = data.players[i];
                                    let tempCard = [];//牌值
                                    for (let k = 0; k < winIndex.handIndexs.length; k++) {
                                        tempCard.push(winIndex.handcards.cards[winIndex.handIndexs[k]]);
                                    }

                                    if (tempCard.length != 0) {
                                        let sumIndex = data.players[j];
                                        let newIndex = [];//新的下标
                                        for (let m = 0; m < tempCard.length; m++) {
                                            for (let v = 0; v < sumIndex.handcards.cards.length; v++) {
                                                if ((tempCard[m] % 16) == (sumIndex.handcards.cards[v] % 16)) {
                                                    newIndex.push(v);
                                                }
                                            }
                                        }

                                        this.scheduleOnce(() => {
                                            //新的下标
                                            if (newIndex.length != 0) {
                                                play.showPokerLight(newIndex);
                                            }
                                        }, 0.1)
                                    }
                                }
                                else {//不是平局
                                    if (play != null) {
                                        play.pokerShow(true);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                UDebug.log("结算前有人跑路了！");
            }
        }

        //延时自动初始化
        this.scheduleOnce(() => {
            this._matchNode.show();//显示正在匹配中
            this.initGame();//初始化数值
        }, 4)
    }

    //显示公共牌光圈
    showPokerLight(tblIndexs: number[]) {
        for (let k = 0; k < this.pokerBox.length; k++) {
            if (tblIndexs.indexOf(k) == -1) {
                this.pokerBox[k].active = true;
            }
        }
        for (let i = 0; i < tblIndexs.length; i++) {
            this.pokerLight[tblIndexs[i]].active = true;
        }
    }

    //输赢动画
    winAnimator(deltascore: number) {
        if (deltascore == 0) return;
        this.animator.node.active = true;
        if (deltascore > 0) {
            this._music.DZPK_yingpai();
            this.SkeletonAnim("youwin", this.animator);
        }
        else {
            this.SkeletonAnim("youlose", this.animator);
        }
    }

    //初始化
    initGame() {
        this.isSuoHa = false;//是否梭哈
        this.isQiPai = false;//玩家自己是否弃牌
        this.chiBox0.string = "0";//池底
        this.cardCount = 0;//发牌计数
        this.pokerCount = 0;//发牌计数
        this.isOne = true;//是否第一张牌
        this.isLookPoker = false;//是否亮牌
        this.sendCardCount = [];//发牌排队计数

        this.btn_chat.active = false;//关闭聊天聊天
        this.btn_chouMa.active = false;//带入筹码按钮
        this.label_node.active = false;//关闭牌局编号底池
        this.buttonList_1.active = false;
        this.buttonList_2.active = false;
        this.buttonList_3.active = false;
        this.buttonList_4.active = false;
        this.btn_goon.active = false;
        this.lookPoker.node.active = false;//亮牌
        this.chiLayout.removeAllChildren();//清空边池
        this.light.initClass();//初始化灯光
        DZPK_Model.ins.isGame = false;
        this.clear();//清理界面
        this.switchOutSp(false);
    }

    //隐藏、显示遮罩
    switchOutSp(tempBool:boolean){
        for (let i = 0; i < this.playList.length; i++) {
            this.playList[i].outSp.active=tempBool;
        }
    }


    //清理界面
    clear() {
        this.settlement.node.active = false;
        //公共牌牌全部还原成牌背
        for (let index = 0; index < this.settlePoker.length; index++) {
            this.SkeletonAnim("poke_back", this.settlePoker[index]);
            this.pokerLight[index].active = false;
            this.settlePoker[index].node.parent.active = false;
        }

        //公共牌遮罩
        for (let k = 0; k < this.pokerBox.length; k++) {
            this.pokerBox[k].active = false;
        }
    }

    //继续游戏
    private goonGame() {
        this._music.playclick();
        this.initGame();//初始化数值
        this._matchNode.show();//打开匹配游戏
        for (let i = 0; i < this.playList.length; i++) {
            this.playList[i].initGame();
            if (i != 0) {
                this.playList[i].chairID = 666;
                this.playList[i].userId = 666;
                this.playList[i].node.active = false;
            }
        }

        //等待两秒匹配
        this.scheduleOnce(() => {
            DZPK_Model.ins.requestMatch();
        }, 1)
    }

    //继续游戏
    chickGoonGame() {
        this.shgamelight.opacity = 0;//关闭灯光
        DZPK_Model.ins.isGame = true;
        DZPK_Model.ins.exitGame();
    }

    //点击空白处关闭加注按钮
    closeJiaZu() {
        this.buttonList_1.active = true;
        this.buttonList_2.active = false;
    }

    //查找返回玩家数据
    returnPlay(tempID: number) {
        for (let i = 0; i < this.playList.length; i++) {
            if (this.playList[i].chairID == tempID) {
                return this.playList[i];
            }
        }
    }

    //进入房间失败
    protected enter_room_fail(errorCode: number, errMsg?: string): void {
        let msg = errMsg
        if (!msg) {
            msg = EEnterRoomErrCode[errorCode];
        }
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 1, data: msg, handler: UHandler.create(() => {
                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.DZPK);
            }, this)
        });
    }

    //机器人消息
    CMD_S_AndroidCard(data: texas.CMD_S_AndroidCard): void {
        UDebug.log("机器人消息");
        UDebug.log(data);
    }

    //操作失败通知
    CMD_S_Operate_Notify(data: texas.CMD_S_Operate_Notify): void {
        AppGame.ins.showTips(data.errmsg);
        this.buttonList_1.active = true;
    }

    //本局结束后退出
    CMD_S_RoundEndExitResult(data: texas.CMD_S_RoundEndExitResult): void {
        UDebug.log("本局结束后退出");
        UDebug.log(data);
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
            DZPK_Model.ins.saveRoomInfo(dt.roomData);
            this._matchNode.show();//显示正在匹配中

        }
        this._music.playGamebg();
        this.gamecloseUI();
    }

    //点击复制牌局信息
    private oncopy(): void {
        this._music.playclick();
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this.bianhao.string).substr(5, 30));
    }

    //充值
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
        this._music.playclick();
        if (DZPK_Model.ins.isOneChat) {
            DZPK_Model.ins.isOneChat = false;
            this.scheduleOnce(() => {
                for (let i = 0; i < DZPK_Model.ins.dataAny.length; i++) {
                    AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_CHAT_MESSAGE, DZPK_Model.ins.dataAny[i]);
                }
            }, 0.5)
        }
        AppGame.ins.showUI(ECommonUI.UI_CHAT_HY);
    }

    //点击携带金额
    onClickDaiRu() {
        if (CarryingAmount.roomData != null) {
            if (CarryingAmount.sumGod >= CarryingAmount.roomData.minScore) {
                AppGame.ins.showUI(ECommonUI.UI_CARRYING, 4);
            }
            else {
                AppGame.ins.showUI(ECommonUI.NewMsgBox, { type: 1, data: "金币不足，补充筹码失败" });
            }
        }
        else {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, { type: 1, data: "是请退出当前房间，重新进入" });
        }
    }

    //骨骼动画
    SkeletonAnim(animName, tempSkel: sp.Skeleton, isBool: boolean = false) {
        if (tempSkel != null) {
            tempSkel.paused = true;
            tempSkel.setAnimation(0, animName, isBool);
            tempSkel.paused = false;
        }
    }

    //下局离场
    TheBureauOfLeave(e: cc.Toggle) {
        DZPK_Model.ins.quitGame(e.isChecked);
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
            tempPlay.initGame();
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

    //是否亮牌
    playLookPoker() {
        if (this.lookPoker.animation == "red_normal") {
            this.isLookPoker = true;
            DZPK_Model.ins.CMD_C_ShowCardSwitch(true);
            this.SkeletonAnim("red_select", this.lookPoker, true);
        }
        else {
            this.isLookPoker = false;
            DZPK_Model.ins.CMD_C_ShowCardSwitch(false);
            this.SkeletonAnim("red_normal", this.lookPoker);
        }
    }

    /**
    * 游戏切换到后台
    * @param isHide 是否切在后台
    */
    onGameToBack(isBack: boolean) {
        DZPK_Model.ins.isBack = isBack;
        DZPK_Model.ins.receive = false;
        this.unschedule(()=>{});
        this.unscheduleAllCallbacks();
        this.light.node.height = 280;
        this.tips.active = false;
        this.animator.node.active = false;//关闭动画
        this.coinFlyHelper.resetAll();//回收全部金币
        this.userList = [];
        if (!isBack) {
            this.initGame();//初始化数值
            for (let i = 0; i < this.playList.length; i++) {
                this.playList[i].action.active = false;
                this.playList[i].initGame();
                if (i != 0) {
                    this.playList[i].userId=666;
                    this.playList[i].node.active = false;
                }
            }

            DZPK_Model.ins.sendFreshGameScene();
        }
    }
}
