import { EIconType, ERoomKind } from "../../common/base/UAllenum";
import UAudioManager from "../../common/base/UAudioManager";
import UResManager from "../../common/base/UResManager";
import { texas } from "../../common/cmd/proto";
import UDebug from "../../common/utility/UDebug";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UStringHelper from "../../common/utility/UStringHelper";
import cfg_head from "../../config/cfg_head";
import AppGame from "../../public/base/AppGame";
import AppStatus from "../../public/base/AppStatus";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";
import GamePropManager from "../../public/GameProp/GamePropManager";
import { RoomPlayerInfo } from "../../public/hall/URoomClass";
import CarryingAmount from "../common/CarryingAmount";
import DZPK_Model, { DZPK_SCALE } from "./model/DZPK_Model";
import DZPK_SceneUI from "./view/DZPK_SceneUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class DZPK_Play extends cc.Component {

    @property(DZPK_SceneUI)
    sceneUI: DZPK_SceneUI = null;
    @property(cc.Sprite)
    head_icon: cc.Sprite = null;//头像
    @property(cc.Sprite)
    frame: cc.Sprite = null;//头像框
    @property(cc.Label)
    vip: cc.Label = null;//玩家VIP等级
    @property(cc.Label)
    playName: cc.Label = null;//玩家姓名
    @property(cc.Label)
    gold: cc.Label = null;//玩家金币
    @property(cc.Node)
    gf_ct: cc.Node = null;//时间进度框
    @property(cc.Node)
    chi_box: cc.Node = null;////玩家自己下注金额
    @property(cc.Label)
    betInfo: cc.Label = null;//玩家加注值
    @property(cc.Node)
    pokerNode: cc.Node = null;//牌节点
    @property([cc.Node])
    pokerList: cc.Node[] = [];//玩家牌集合
    @property([sp.Skeleton])
    pokerSkeleton: sp.Skeleton[] = [];//玩家牌动画
    @property(cc.Node)
    cardType: cc.Node = null;//牌值
    @property(cc.Node)
    banker: cc.Node = null;//庄家标识
    @property(cc.Node)
    score: cc.Node = null;//输赢飘字
    @property(cc.Node)
    action: cc.Node = null;//加注、弃牌、让牌
    @property(cc.Node)
    outSp: cc.Node = null;//黑色遮罩框

    @property(cc.Node)
    pokerAnim: cc.Node = null;//发牌动画

    @property(cc.Node)
    prop: cc.Node = null;
    @property(cc.Node)
    chatProp: cc.Node = null;

    @property(cc.Vec2)
    pokerAnimPos: cc.Vec2 = null;//发牌初始位置
    @property(cc.Vec2)
    giveUpMoto: cc.Vec2 = null;//弃牌位置


    //============================================================
    chairID: number = 666;       //玩家座位ID
    userId: number = 666;       //用户ID
    handCards: texas.IHandCards = null;//玩家手牌
    isfree: boolean = false;   //是否开启自己的时间进度条
    cdTime: number = 16;       //玩家操作时间
    sex: number = 0;//男头像或女头像

    win_Node: cc.Node = null;//赢飘字节点
    lose_Node: cc.Node = null;//输飘字节点
    win_lable: cc.Label = null;//赢飘字
    lose_lable: cc.Label = null;//赢飘字

    cardSkeleton: sp.Skeleton = null;//牌型
    actionSkeleton: sp.Skeleton = null;//加注、弃牌、让牌
    gf_ctSprite: cc.Sprite = null;//倒计时动画

    fontPos: cc.Vec2 = null;//飘字位置初始位置
    rotationPos: number = 0;//旋转角度
    chipPos: number = 0;//筹码移动位置
    isSuoHa: boolean = false;//断线重连是否梭哈
    isGive: boolean = false;//断线重连是否弃牌

    onLoad() {
        this.rotationPos = this.returnRota();
        this.gf_ctSprite = this.gf_ct.getComponent(cc.Sprite);//倒计时动画
        this.cardSkeleton = this.cardType.getComponent(sp.Skeleton);//牌型
        this.actionSkeleton = this.action.getComponent(sp.Skeleton);//加注、弃牌、让牌

        //输赢飘字
        this.fontPos = this.score.getPosition();
        this.win_Node = UNodeHelper.find(this.score, 'get_win_gold');
        let sp_win = UNodeHelper.find(this.win_Node, 'win_value');
        this.win_lable = sp_win.getComponent(cc.Label);
        this.lose_Node = UNodeHelper.find(this.score, 'get_lose_gold');
        let sp_lose = UNodeHelper.find(this.lose_Node, 'lose_value');
        this.lose_lable = sp_lose.getComponent(cc.Label);

        //梭哈动画事件注册
        this.actionSkeleton.setCompleteListener(() => {
            if (this.actionSkeleton.animation == "02_allin_begin") {
                this.SkeletonAnim("02_aillin_normal", this.actionSkeleton, true);
            }
        });
    }

    onEnable() {
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
    }

    onDestroy() {
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
    }

    //更新金币
    updateGold(takescore: number) {
        this.gold.string = UStringHelper.formatPlayerCoin((takescore * DZPK_SCALE)).toString();
    }

    //赋值玩家信息
    init(data: RoomPlayerInfo) {
        this.chairID = data.chairId;
        this.userId = data.userId;
        //正常玩家视角，防止掉线玩家刷新状态
        for (let i = 0; i < this.sceneUI.userList.length; i++) {
            if(this.sceneUI.userList[i].userId==data.userId){
                return;
            }
        }

        let cfg = cfg_head[data.headId];
        this.sex = cfg.sex;
        UResManager.load(data.headId, EIconType.Head, this.head_icon, data.headImgUrl);
        UResManager.load(data.headboxId, EIconType.Frame, this.frame);
        this.vip.string = data.vipLevel.toString();
        this.gold.string = UStringHelper.formatPlayerCoin((data.score * DZPK_SCALE)).toString();
        this.chi_box.active = false;

        if (this.sceneUI.isGameStart) {
            this.outSp.active = true;//遮罩
        }

        if (AppGame.ins.currRoomKind != ERoomKind.Normal) {
            this.playName.string = data.nickName;
        }
        else {
            if (data.chairId == this.sceneUI.chairPlay) {
                this.playName.string = data.userId.toString();
            }
            else {
                this.playName.string = UStringHelper.coverName(data.userId.toString());
            }
        }
        this.prop.getComponent(GamePropManager).bindUserId(data.userId);
        this.chatProp.getComponent(VGameChatPropManager).bindUserId(data.userId);
    }

    /**
     * 1、开始游戏重新赋值玩家信息
     * @param bankerID 庄家ID
     * @param NextUser 最先操作的玩家
     * @param data 玩家信息
     * @param tempBool 是否断线重连
     */
    assignment(bankerID: number, NextUser: number, data: texas.IPlayerItem, tableAllScore: number, tempBool: boolean = true) {
        this.cdTime = this.sceneUI.cdTime;//操作时间
        this.chairID = data.chairId;//自己ID
        this.userId = data.userId;//用户ID
        this.vip.string = data.vipLevel.toString();
        this.gold.string = UStringHelper.formatPlayerCoin((data.takeScore * DZPK_SCALE));
        this.handCards = data.handCards;//自己手牌

        if (data.playstatus) {
            if (bankerID == data.chairId) {//庄家标识
                this.banker.active = true;
            }
        }

        if (data.chairId == this.sceneUI.chairPlay) {//更新玩家自己金额
            this.playName.string = data.userId.toString();
            this.sceneUI.playstatus = data.playstatus;
            this.sceneUI.goldPlay = data.takeScore;
            CarryingAmount.sumGod = data.userScore;
            DZPK_Model.ins.carryingGold = data.takeScore;
        }
        else {
            this.playName.string = UStringHelper.coverName(data.userId.toString());
        }

        // this.updateCT(NextUser, this.cdTime);//更新进度条

        if (tempBool) {
            this.chi_box.active = true;//玩家自己下注金额
            this.betInfo.string = UStringHelper.getMoneyFormat((data.tableScore * DZPK_SCALE));//玩家加注值

            //大盲注、小盲注
            if (data.tableScore != 0) {
                this.action.active = true;
                let temp = data.tableScore / tableAllScore;
                if (temp > 0.5) {//大盲注
                    this.SkeletonAnim(this.sceneUI.cardCode[6], this.actionSkeleton);
                }
                else {//小盲注
                    this.SkeletonAnim(this.sceneUI.cardCode[7], this.actionSkeleton);
                }
            }
        }
        else {//断线重连
            if (data.playstatus) {//是否参与游戏
                this.outSp.active = false;//遮罩
                if (this.node.name == "play_0") {
                    this.sceneUI.btn_chat.active = true;//打开聊天
                    this.sceneUI.btn_chouMa.active = true;//打开带入筹码
                }
                this.chi_box.active = true;//玩家自己下注金额
                this.betInfo.string = UStringHelper.getMoneyFormat((data.tableScore * DZPK_SCALE));//玩家加注值
                if (data.isGiveup) {//弃牌了
                    this.isGive = true;
                    this.banker.active = false;
                    if (data.chairId == this.sceneUI.chairPlay) {//更新玩家自己金额
                        this.sceneUI.isQiPai = true;
                        if (AppGame.ins.currRoomKind == ERoomKind.Normal) {
                            this.sceneUI.lookPoker.node.active = true;//亮牌
                            //this.sceneUI.btn_goon.active = true;//只有是普通场的时候才可以有继续游戏按钮
                        }
                    }

                    this.action.active = true;
                    this.SkeletonAnim(this.sceneUI.cardCode[5], this.actionSkeleton);//弃牌

                    for (let i = 0; i < this.pokerList.length; i++) {
                        this.nodeOpacity(this.pokerList[i].getChildByName("chi_box"))
                    }
                }
                else {
                    if (data.isAllIn) {
                        this.isSuoHa = true;
                        this.action.active = true;
                        this.gold.string = "0";
                        this.SkeletonAnim(this.sceneUI.cardCode[2], this.actionSkeleton);//梭哈
                    }
                }

                this.pokerList[0].active = true;
                this.pokerList[1].active = true;
                if (data.handCards != null && data.handCards.cards[0]!=0) {
                    this.cardType.active = true;
                    this.SkeletonAnim(this.sceneUI.cardTypeList[this.handCards.ty], this.cardSkeleton);
                    this.sceneUI._music.playfapai();
                    for (let i = 0; i < data.handCards.cards.length; i++) {
                        this.SkeletonAnim(this.sceneUI.returnCard(this.handCards.cards[i]), this.pokerSkeleton[i]);
                    }
                }
                else {
                    for (let i = 0; i < 2; i++) {
                        this.SkeletonAnim("poke_back", this.pokerSkeleton[i]);
                    }
                }
            }
            else{
                this.outSp.active = true;//遮罩
            }
        }
    }

    //大小盲注
    BigSmallBlindUser(num: number) {
        if (!this.isSuoHa && !this.isGive && !this.outSp.activeInHierarchy) {//已经梭哈或者弃牌，就不需要大小盲注覆盖了
            this.action.active = true;
            if (this.actionSkeleton != null) {
                this.SkeletonAnim(this.sceneUI.cardCode[num], this.actionSkeleton);
            }
            else {
                this.actionSkeleton = this.action.getComponent(sp.Skeleton);
                this.SkeletonAnim(this.sceneUI.cardCode[num], this.actionSkeleton);
            }
        }
    }

    /**
     * 2、第一轮发牌动画
     * @param tempBool 
     * @param tempArr 
     */
    newSendCard(tempBool: boolean, tempArr: number) {
        this.sceneUI._music.playfapai();
        this.pokerAnim.active = true;
        this.pokerAnim.opacity = 255;
        this.pokerAnim.stopAllActions();
        this.pokerAnim.setPosition(this.pokerAnimPos);
        this.pokerAnim.runAction(cc.sequence(cc.moveTo(0.2, this.pokerList[tempArr].getPosition()).easing(cc.easeQuadraticActionOut()), cc.callFunc(() => {
            this.pokerAnim.opacity = 0;
            this.sceneUI.cardCount++;

            if (tempBool) {
                this.pokerList[0].active = true;
                if (this.handCards != null) {
                    this.SkeletonAnim(this.sceneUI.returnCard(this.handCards.cards[0]), this.pokerSkeleton[0]);
                }
                else {
                    this.SkeletonAnim("poke_back", this.pokerSkeleton[0]);
                }
            }
            else {
                this.pokerList[1].active = true;
                if (this.handCards != null) {
                    this.cardType.active = true;
                    this.SkeletonAnim(this.sceneUI.cardTypeList[this.handCards.ty], this.cardSkeleton);
                    this.SkeletonAnim(this.sceneUI.returnCard(this.handCards.cards[1]), this.pokerSkeleton[1]);
                }
                else {
                    this.SkeletonAnim("poke_back", this.pokerSkeleton[1]);
                }
            }
            this.sceneUI.SendCardAnim();
        })));
    }

    //更新进度条
    updateCT(next: number, wTimeLeft: number) {
        this.cdTime = wTimeLeft;
        if (next == this.chairID) {//是否是下一步的操作玩家
            this.isfree = true;
            this.gf_ct.active = true;//时间进度条
            if (this.gf_ctSprite == null) {
                this.gf_ctSprite = this.gf_ct.getComponent(cc.Sprite);//倒计时动画
            }

            if (this.rotationPos != 0) {
                this.sceneUI.lightAnim(this.rotationPos);
            }
            else {
                this.sceneUI.lightAnim(this.returnRota());
            }
        }
        else {
            this.closeCT();
        }
    }

    //返回光柱位置
    returnRota() {
        switch (this.node.name) {
            case "play_0":
                this.chipPos = 0;
                return this.sceneUI.playRotation[0];
            case "play_1":
                this.chipPos = 1;
                return this.sceneUI.playRotation[1];
            case "play_2":
                this.chipPos = 2;
                return this.sceneUI.playRotation[2];
            case "play_3":
                this.chipPos = 3;
                return this.sceneUI.playRotation[3];
            case "play_4":
                this.chipPos = 4;
                return this.sceneUI.playRotation[4];
            case "play_5":
                this.chipPos = 5;
                return this.sceneUI.playRotation[5];
            case "play_6":
                this.chipPos = 6;
                return this.sceneUI.playRotation[6];
            case "play_7":
                this.chipPos = 7;
                return this.sceneUI.playRotation[7];
            case "play_8":
                this.chipPos = 8;
                return this.sceneUI.playRotation[8];
        }
    }

    //关闭进度条
    closeCT() {
        this.isfree = false;
        this.gf_ct.active = false;//时间进度条
    }

    count: number = 0;
    //时间进度条
    update(dt: number): void {
        if (this.isfree) {
            this.cdTime -= dt;
            if (this.cdTime > 0) {
                this.gf_ctSprite.fillRange = this.cdTime / 15;
                if (this.cdTime <= 3 && this.count == 0) {
                    this.count = 1;
                    UAudioManager.ins.playSound("audio_Special");
                }
                else if (this.cdTime <= 2 && this.count == 1) {
                    this.count = 2;
                    UAudioManager.ins.playSound("audio_Special");
                }
                else if (this.cdTime <= 1 && this.count == 2) {
                    this.count = 3;
                    UAudioManager.ins.playSound("audio_Special");
                }
            }
            else {
                this.isfree = false;
            }
        }
    }

    //用户加注/跟注
    CMD_S_AddScore(data: texas.CMD_S_AddScore) {
        if (data.opValue != 3) {
            this.sceneUI._music.playJiazhu(this.sex);
        }
        else {
            this.sceneUI._music.playGenzhu(this.sex);
        }

        if (data.opUser == this.sceneUI.chairPlay) {
            this.sceneUI.goldPlay = data.takeScore;
            CarryingAmount.sumGod = data.userScore;
        }


        this.gold.string = UStringHelper.formatPlayerCoin((data.takeScore * DZPK_SCALE));
        this.betInfo.string = UStringHelper.getMoneyFormat((data.tableScore * DZPK_SCALE));
        this.action.active = true;
        this.SkeletonAnim(this.sceneUI.cardCode[data.opValue], this.actionSkeleton);
    }

    //用户弃牌
    CMD_S_GiveUp(data: texas.CMD_S_GiveUp) {
        this.sceneUI._music.playQiPai(this.sex);
        this.action.active = true;
        this.SkeletonAnim(this.sceneUI.cardCode[5], this.actionSkeleton);
        this.isGive = true;
        this.closeCT();//关闭进度条
        for (let i = 0; i < this.pokerList.length; i++) {
            this.nodeOpacity(this.pokerList[i].getChildByName("chi_box"))
        }
    }

    //让牌
    CMD_S_PassScore(data: texas.CMD_S_PassScore) {
        this.sceneUI._music.playRangPai(this.sex);
        this.action.active = true;
        this.SkeletonAnim(this.sceneUI.cardCode[1], this.actionSkeleton);
    }

    //孤注一掷 梭哈
    CMD_S_AllIn(data: texas.CMD_S_AllIn) {
        if (data.AllinUser == this.chairID) {//自己是否梭哈了
            this.sceneUI.isSuoHa = true;
        }

        if (data.AllinUser == this.sceneUI.chairPlay) {
            CarryingAmount.sumGod = data.UserScore;
        }

        this.sceneUI._music.playSoha(this.sex);
        this.action.active = true;
        this.gold.string = UStringHelper.formatPlayerCoin((data.takeScore * DZPK_SCALE));
        this.betInfo.string = UStringHelper.getMoneyFormat((data.tableScore * DZPK_SCALE));
        this.SkeletonAnim(this.sceneUI.cardCode[2], this.actionSkeleton);
    }

    //发牌更新牌型
    CMD_S_SendCard(ty: number) {
        this.SkeletonAnim(this.sceneUI.cardTypeList[ty], this.cardSkeleton);//牌型
    }

    //游戏结束切后台，更新玩家信息
    UpdateCards(handCards:texas.IHandCards,isGiveup:boolean,playstatus:boolean){
        if(playstatus){//是否参与游戏
            if(handCards!=null){
                this.pokerList[0].active = true;
                this.pokerList[1].active = true;
                if(this.node.name != "play_0"){
                    if (handCards.cards[0] != 0 && !isGiveup) {
                        this.cardType.active = true;
                        this.SkeletonAnim(this.sceneUI.cardTypeList[handCards.ty], this.cardSkeleton);//牌型
                        this.SkeletonAnim(this.sceneUI.returnCard(handCards.cards[0]), this.pokerSkeleton[0]);
                        this.SkeletonAnim(this.sceneUI.returnCard(handCards.cards[1]), this.pokerSkeleton[1]);
                    }
                    else {
                        this.cardType.active = false;
                        this.SkeletonAnim("poke_back", this.pokerSkeleton[0]);
                        this.SkeletonAnim("poke_back", this.pokerSkeleton[1]);
                    }
                }
                else{
                    this.cardType.active = true;
                    this.SkeletonAnim(this.sceneUI.cardTypeList[handCards.ty], this.cardSkeleton);//牌型
                    this.SkeletonAnim(this.sceneUI.returnCard(handCards.cards[0]), this.pokerSkeleton[0]);
                    this.SkeletonAnim(this.sceneUI.returnCard(handCards.cards[1]), this.pokerSkeleton[1]);
                }
            }
    
            if(isGiveup){
                this.cardType.active = false;
                this.action.active = true;
                this.SkeletonAnim(this.sceneUI.cardCode[5], this.actionSkeleton);
            }
        }
        else{
            this.outSp.active = true;//遮罩
        }
    }

    //游戏结束
    CMD_S_GameEnd(data: texas.ICMD_S_GameEnd_Player,tempTime:number) {
        this.isfree = false;
        if (data.userId != this.userId) return;
        this.score.active = true;//输赢飘字
        this.onWinEnd(data.deltascore);//输赢飘字

        //更新金币
        this.chi_box.active = true;//玩家自己下注金额
        this.betInfo.string = UStringHelper.getMoneyFormat((data.betScore * DZPK_SCALE));//玩家加注值
        this.gold.string = UStringHelper.formatPlayerCoin((data.takeScore * DZPK_SCALE));
        if (data.chairId == this.sceneUI.chairPlay) {
            this.sceneUI.goldPlay = data.takeScore;
            CarryingAmount.sumGod = data.userScore;
        }

        if (data.handcards.cards[0] != 0) {
            this.cardType.active = true;
            this.sceneUI._music.playfapai();
            this.SkeletonAnim(this.sceneUI.cardTypeList[data.handcards.ty], this.cardSkeleton);//牌型
            this.SkeletonAnim(this.sceneUI.returnCard(data.handcards.cards[0]), this.pokerSkeleton[0]);
            this.SkeletonAnim(this.sceneUI.returnCard(data.handcards.cards[1]), this.pokerSkeleton[1]);
        }
        else {
            this.cardType.active = false;
            this.SkeletonAnim("poke_back", this.pokerSkeleton[0]);
            this.SkeletonAnim("poke_back", this.pokerSkeleton[1]);
        }

        if (data.deltascore > 0) {
            //赢的边池钱
            for (let k = 0; k < data.winpots.length; k++) {
                this.sceneUI.creatoeChip(this.chipPos, data.winpots[k].index);
            }
        }
        else {
            this.banker.active = false;
            this.pokerShow(true);
        }

        this.closeCT();//关闭进度条
        this.scheduleOnce(() => {
            this.initGame();
        }, tempTime)
    }

    //牌隐藏
    emptyPoker() {
        this.cardType.active = false;
        for (let i = 0; i < this.pokerList.length; i++) {
            this.pokerList[i].active = false;
        }
    }

    //输赢飘字
    onWinEnd(tempValue: number) {
        this.score.active = true;
        this.score.setPosition(this.fontPos);
        this.score.opacity = 0;
        this.score.stopAllActions();

        let tempScore = UStringHelper.getMoneyFormat(tempValue * DZPK_SCALE);

        if (tempValue > 0) {
            this.win_Node.active = true;
            this.lose_Node.active = false;
            this.win_lable.string = '+' + tempScore;
        }
        else {
            this.lose_Node.active = true;
            this.win_Node.active = false;
            this.lose_lable.string = tempScore;
        }

        this.score.runAction(cc.sequence(cc.fadeIn(0.1), cc.callFunc(() => { }),
            cc.moveBy(1, 0, 80), cc.fadeOut(4)));
    }

    //初始化玩家
    initGame() {
        this.isfree = false;
        this.cdTime = 16;
        this.handCards = null;
        this.isSuoHa = false;
        this.isGive = false;

        this.gf_ct.active = false;
        this.action.active = false;
        this.score.active = false;
        this.banker.active = false;
        this.chi_box.active = false;
        this.emptyPoker();//牌隐藏
        this.betInfo.string = "0";
        this.pokerShow(false);
        if (this.prop != null) {
            this.prop.getComponent(GamePropManager).closePropPanelByUserId(this.userId);
        }

        if (this.chatProp != null) {
            this.chatProp.getComponent(VGameChatPropManager).bindUserId(this.userId);
        }

        for (let i = 0; i < this.pokerList.length; i++) {
            this.pokerList[i].getChildByName("chi_box").active = false;
            this.pokerList[i].getChildByName("poke_box").active = false;//光圈
        }
    }

    //手牌显示光圈
    showPokerLight(handIndexs: number[]) {
        for (let i = 0; i < this.pokerList.length; i++) {
            this.nodeOpacity(this.pokerList[i].getChildByName("chi_box"))
        }
        for (let i = 0; i < handIndexs.length; i++) {
            this.pokerList[handIndexs[i]].getChildByName("chi_box").active = false;//遮罩
            this.pokerList[handIndexs[i]].getChildByName("poke_box").active = true;//光圈
        }
    }

    //手牌遮罩
    pokerShow(isBool: boolean) {
        for (let i = 0; i < this.pokerList.length; i++) {
            if (isBool) {
                if (this.isGive && this.node.name == "play_0" && this.sceneUI.isLookPoker) {
                    this.pokerList[i].getChildByName("chi_box").active = false;
                }
                else {
                    this.nodeOpacity(this.pokerList[i].getChildByName("chi_box"))
                }
            }
            else {
                this.pokerList[i].getChildByName("chi_box").active = isBool;//遮罩
            }

            this.pokerList[i].getChildByName("poke_box").active = false;//光圈
        }
    }

    //渐变
    nodeOpacity(node: cc.Node) {
        node.active = true;//遮罩
        node.opacity = 0;
        node.runAction(cc.fadeTo(0.5, 255));
    }

    //骨骼动画
    SkeletonAnim(animName, tempSkel: sp.Skeleton, isBooL: boolean = false) {
        if (animName == '' || tempSkel == null) {
            UDebug.error("动画错误" + animName);
            UDebug.error("动画节点为空:" + tempSkel == null);
            return;
        }
        tempSkel.paused = true;
        tempSkel.setAnimation(0, animName, isBooL);
        tempSkel.paused = false;
    }

    /**通过userId获取道具节点 */
    getPropNodeByUserId(userId: number, callback: any = null) {
        for (let i = 0; i < this.sceneUI.playList.length; i++) {
            let player = this.sceneUI.playList[i];
            if (player != null) {
                let bindUserId = player.prop.getComponent(GamePropManager).getBindUserId();
                if (bindUserId && (userId == bindUserId)) {
                    callback && callback(player.prop);
                }
            }
        }
    }

    /**通过userId获取聊天节点 */
    getChatPropNodeByUserId(userId: number, callback: any = null) {
        for (let i = 0; i < this.sceneUI.playList.length; i++) {
            let player = this.sceneUI.playList[i];
            if (player != null && player.chatProp!=null) {
                let bindUserId = player.chatProp.getComponent(VGameChatPropManager).getBindUserId();
                if (bindUserId && (userId == bindUserId)) {
                    callback && callback(player.chatProp);
                }
            }
        }
    }

    onGameToBack(isBack: boolean) {
        this.unschedule(()=>{});
        this.unscheduleAllCallbacks();
        this.score.stopAllActions();
        this.pokerAnim.opacity = 0;
        this.pokerAnim.stopAllActions();
    }
}
