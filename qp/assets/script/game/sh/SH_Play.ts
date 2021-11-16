import { EIconType, ERoomKind } from "../../common/base/UAllenum";
import UAudioManager from "../../common/base/UAudioManager";
import UResManager from "../../common/base/UResManager";
import { suoha } from "../../common/cmd/proto";
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
import SHModel, { SH_SCALE } from "./model/SHModel";
import SHSceneUI from "./viewController/SHSceneUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SH_Play extends cc.Component {

    @property(SHSceneUI)
    shScene: SHSceneUI = null;
    @property(cc.Node)
    gf_ct: cc.Node = null;//时间进度框
    @property(cc.Node)
    outSp: cc.Node = null;//黑色遮罩框
    @property(cc.Sprite)
    head_icon: cc.Sprite = null;//头像
    @property(cc.Sprite)
    frame_2: cc.Sprite = null;//头像框
    @property(cc.Node)
    banker: cc.Node = null;//庄家标识
    @property(sp.Skeleton)
    action: sp.Skeleton = null;//加注、弃牌、让牌
    @property(cc.Node)
    score1_bg: cc.Node = null;//玩家下注节点
    @property(cc.Label)
    gold: cc.Label = null;//玩家金币
    @property(cc.Label)
    vip: cc.Label = null;//玩家VIP等级
    @property(cc.Label)
    playName: cc.Label = null;//玩家姓名
    @property(cc.Label)
    betInfo: cc.Label = null;//玩家加注值
    @property(cc.Node)
    score: cc.Node = null;//输赢飘字
    @property(cc.Node)
    poker_Layout: cc.Node = null;//牌的父节点
    @property(cc.Node)
    get_win_gold: cc.Node = null;//赢飘字
    @property(cc.Node)
    get_lose_gold: cc.Node = null;//输飘字
    @property([sp.Skeleton])
    poker: sp.Skeleton[] = [];//玩家牌集合
    @property(cc.Node)
    fanpai: cc.Node = null;//玩家翻牌动画
    @property(sp.Skeleton)
    cardType: sp.Skeleton = null;//牌值
    @property(cc.Vec2)
    cardPos: cc.Vec2 = null;//发牌初始位置
    @property(cc.Vec2)
    giveUpMoto: cc.Vec2 = null;//弃牌位置
    @property(cc.Node)
    pokerAnim: cc.Node = null;//发牌动画
    @property(cc.Node)
    chip_container: cc.Node = null;//筹码动画父节点
    @property(cc.Node)
    chip_Pre: cc.Node = null;//筹码预制体
    @property(cc.Node)
    chipPos: cc.Node = null;//筹码位置
    @property(cc.Node)
    prop: cc.Node = null;
    @property(cc.Node)
    chatProp: cc.Node = null;

    userId: number = 0;       //用户ID
    chairID: number = 666;       //玩家座位ID
    handCards: suoha.IHandCards = null;//玩家手牌
    isKanpai: boolean = false;//是否点击看牌
    kanpaiTime: number = 1;
    isfree: boolean = false;   //是否开启自己的时间进度条
    cdTime: number = 16;       //玩家操作时间
    sex: number = 0;//男头像或女头像
    chipsPool: cc.Node[] = [];    // 筹码对象池

    win_Node: cc.Node = null;
    lose_Node: cc.Node = null;
    win_lable: cc.Label = null;
    lose_lable: cc.Label = null;
    fapaiCount: number = 0;//发牌计数
    gf_ctSprite: cc.Sprite = null;//倒计时动画
    fanpaiInitPOs: cc.Vec2 = new cc.Vec2();
    isOver: boolean = false;//游戏是否结束
    ty: number = 0;//上一次牌型

    giveUpNode: cc.Node = null;//所有牌的父节点
    giveUpPos: cc.Vec2 = new cc.Vec2();//所有牌父节点的初始位置
    fontPos: cc.Vec2 = null;//飘字位置初始位置

    initData: suoha.IPlayerItem = null;//开始游戏
    isGiveup: boolean = false;//断线重连是否弃牌
    initVect: cc.Vec2 = new cc.Vec2(-44.968, 0.411);

    rotationPos: number = 0;//旋转角度

    onLoad() {
        this.gf_ctSprite = this.gf_ct.getComponent(cc.Sprite);//倒计时动画
        this.giveUpNode = this.fanpai.parent.parent.parent;//所有牌的父节点
        this.giveUpPos = this.giveUpNode.getPosition();//所有牌父节点的初始位置
        this.rotationPos = this.returnRota();
        this.fontPos = this.score.getPosition();//飘字位置初始位置

        //输赢飘字
        this.win_Node = UNodeHelper.find(this.score, 'get_win_gold');
        let sp_win = UNodeHelper.find(this.win_Node, 'win_value');
        this.win_lable = sp_win.getComponent(cc.Label);
        this.lose_Node = UNodeHelper.find(this.score, 'get_lose_gold');
        let sp_lose = UNodeHelper.find(this.lose_Node, 'lose_value');
        this.lose_lable = sp_lose.getComponent(cc.Label);

        if (this.node.name == "play_0") {
            this.fanpai.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.fanpai.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.fanpai.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        }

        //梭哈动画事件注册
        this.action.setCompleteListener(() => {
            if (this.action.animation == "02_allin_begin") {
                this.SkeletonAnim("02_aillin_normal", this.action, true);
            }
        });
    }

    onEnable() {
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
    }

    onDestroy() {
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        if (this.node.name == "play_0") {
            this.fanpai.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
            this.fanpai.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
            this.fanpai.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        }
    }

    //更新金币
    updateGold(takescore: number) {
        this.gold.string = UStringHelper.formatPlayerCoin((takescore * SH_SCALE)).toString();
    }


    //赋值玩家信息
    init(data: RoomPlayerInfo) {
        this.userId = data.userId;
        this.chairID = data.chairId;
        //正常玩家视角，防止掉线玩家刷新状态
        for (let i = 0; i < this.shScene.userList.length; i++) {
            if(this.shScene.userList[i].userId==data.userId){
                return;
            }
        }

        let cfg = cfg_head[data.headId];
        this.sex = cfg.sex;
        UResManager.load(data.headId, EIconType.Head, this.head_icon, data.headImgUrl);
        UResManager.load(data.headboxId, EIconType.Frame, this.frame_2);
        this.vip.string = data.vipLevel.toString();
        if (data.chairId == this.shScene.chairPlay) {
            this.gold.string = UStringHelper.formatPlayerCoin((CarryingAmount.curTakeScore * SH_SCALE)).toString();
        }
        else {
            this.gold.string = UStringHelper.formatPlayerCoin((data.score * SH_SCALE)).toString();
        }

        if(this.shScene.isGameStart){
            this.outSp.active = true;//遮罩
        }

        if (AppGame.ins.currRoomKind != ERoomKind.Normal) {
            this.playName.string = data.nickName;
        }
        else {
            if (data.chairId == this.shScene.chairPlay) {
                this.playName.string = data.userId.toString();
            }
            else {
                this.playName.string = UStringHelper.coverName(data.userId.toString());
            }
        }
        this.prop.getComponent(GamePropManager).bindUserId(data.userId);
        this.chatProp.getComponent(VGameChatPropManager).bindUserId(data.userId);
    }

    //开始游戏重新赋值玩家信息
    assignment(bankerID: number, NextUser: number, data: suoha.IPlayerItem, tempBool: boolean = true) {
        this.isOver = false;//游戏开始了
        this.poker_Layout.setPosition(this.initVect);
        if (this.giveUpNode != null) {//牌的父节点 
            this.giveUpNode.setScale(1, 1);
            this.giveUpNode.setPosition(this.giveUpPos);
        }

        this.cdTime = this.shScene.cdTime;//操作时间
        this.userId = data.userId;
        this.chairID = data.chairId;
        this.vip.string = data.vipLevel.toString();
        this.gold.string = UStringHelper.formatPlayerCoin((data.takeScore * SH_SCALE)).toString();
        this.handCards = data.handCards;
        this.score1_bg.active = true;
        this.betInfo.string = UStringHelper.getMoneyFormat((data.tableScore * SH_SCALE)).toString();

        if (bankerID == data.chairId) {//庄家标识
            this.banker.active = true;
        }
        else {
            this.banker.active = false;
        }

        if (data.chairId == this.shScene.chairPlay) {
            this.shScene.goldPlay = data.takeScore;
            CarryingAmount.sumGod = data.userScore;
            SHModel.ins.carryingGold = data.takeScore;
            this.shScene.toggle_xjlc.isChecked = data.bRoundEndExit;
        }

        this.fapaiCount = 1;
        // this.updateCT(NextUser, this.shScene.cdTime);//倒计时进度条

        if (tempBool) {//正常游戏进程
            this.creatoeChip((data.tableScore * SH_SCALE).toString());//开始游戏筹码飞出
        }
        else {//断线重连
            if (data.playstatus) {//是否参与游戏
                this.outSp.active = false;//遮罩
                if (this.node.name == "play_0") {
                    this.shScene.chatNode.active = true;//打开聊天
                    this.shScene.btn_chouMa.active = true;//打开带入筹码
                }
                if (data.isGiveup) {//是否弃牌
                    this.isGiveup = true;
                    this.action.node.active = true;
                    this.closeCT();//关闭进度条
                    this.SkeletonAnim(this.shScene.cardCode[5], this.action);//弃牌
                }
                else {
                    if (data.isAllIn) {
                        this.action.node.active = true;
                        this.SkeletonAnim(this.shScene.cardCode[2], this.action);//梭哈
                    }
                    this.isGiveup = false;
                    this.poker[0].node.parent.active = true;
                    this.SkeletonAnim("poke_back", this.poker[0]);
                    this.cardType.node.active = true;
                    this.ty = data.handCards.ty;
                    this.SkeletonAnim(this.shScene.cardTypeList[data.handCards.ty], this.cardType);
                    this.fapaiCount = 0;
                    for (let i = 1; i < data.handCards.cards.length; i++) {
                        this.fapaiCount++;
                        this.poker[i].node.parent.active = true;
                        this.SkeletonAnim(this.shScene.returnCard(data.handCards.cards[i]), this.poker[i]);
                    }
                }
            }
            else {
                this.outSp.active = true;//遮罩
                this.score1_bg.active = false;
                this.closeCT();
                for (let i = 0; i < this.poker.length; i++) {
                    this.poker[i].node.parent.active = false;
                }
            }
        }
        this.initData = data;
    }

    //更新进度条
    updateCT(next: number, wTimeLeft: number) {
        this.cdTime = wTimeLeft;
        if (next == this.chairID) {//是否是下一步的操作玩家
            this.isfree = true;
            this.count = 0;
            this.gf_ct.active = true;//时间进度条
            this.shScene.lightAnim(this.rotationPos);//灯光
        }
        else {
            this.closeCT();
        }
    }

    //第一轮发牌动画
    newSendCard(tempBool: boolean) {
        this.pokerAnim.active = true;
        this.pokerAnim.opacity = 255;
        this.pokerAnim.stopAllActions();
        this.pokerAnim.setPosition(this.cardPos);
        this.shScene._music.playfapai();
        this.poker_Layout.setPosition(this.initVect);
        this.pokerAnim.runAction(cc.sequence(cc.moveTo(0.4, new cc.Vec2(0, 0)).easing(cc.easeQuadraticActionOut()), cc.callFunc(() => {
            this.pokerAnim.opacity = 0;
            this.shScene.cardCount++;

            if (tempBool) {
                this.poker[0].node.parent.active = true;
                this.SkeletonAnim("poke_back", this.poker[0]);
            }
            else {
                this.cardType.node.active = true;
                this.ty = this.initData.handCards.ty;
                this.SkeletonAnim(this.shScene.cardTypeList[this.initData.handCards.ty], this.cardType);//牌型
                this.poker[1].node.parent.active = true;
                this.SkeletonAnim(this.shScene.returnCard(this.initData.handCards.cards[1]), this.poker[1]);//牌值
            }
            this.shScene.SendCardAnim();
        })));
    }

    //刷新庄家标识
    bankerUpdate(NextUser: number) {
        if (NextUser == this.chairID) {
            this.banker.active = true;
        }
        else {
            this.banker.active = false;
        }
    }

    //返回光柱位置
    returnRota() {
        switch (this.node.name) {
            case "play_0":
                return this.shScene.playRotation[0];
            case "play_1":
                return this.shScene.playRotation[1];
            case "play_2":
                return this.shScene.playRotation[2];
            case "play_3":
                return this.shScene.playRotation[3];
            case "play_4":
                return this.shScene.playRotation[4];
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
                this.gf_ctSprite.fillRange = this.cdTime / 16;
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

        if (this.isKanpai) {//是否看牌
            if (this.isOver) {//游戏结束了
                this.isKanpai = false;
            }
            else {
                this.kanpaiTime -= dt;
                if (this.kanpaiTime <= 0) {
                    this.isKanpai = false;
                    this.kanpaiTime = 1;
                    this.SkeletonAnim("poke_back", this.poker[0]);
                }
            }
        }
    }

    //用户加注/跟注
    CMD_S_AddScore(data: suoha.CMD_S_AddScore) {
        for (let i = 0; i < data.chips.length; i++) {
            for (let index = 0; index < data.chips[i].count; index++) {
                this.creatoeChip(data.chips[i].chip.toString());
            }
        }
        if (data.opValue != 3) {
            this.shScene._music.playJiazhu(this.sex);
        }
        else {
            this.shScene._music.playGenzhu(this.sex);
        }

        if (data.opUser == this.shScene.chairPlay) {
            this.shScene.goldPlay = data.takeScore;
            CarryingAmount.sumGod = data.userScore;
        }

        this.gold.string = UStringHelper.formatPlayerCoin((data.takeScore * SH_SCALE)).toString();
        this.betInfo.string = UStringHelper.getMoneyFormat((data.tableScore * SH_SCALE)).toString();
        this.action.node.active = true;
        this.SkeletonAnim(this.shScene.cardCode[data.opValue], this.action);
    }

    chipColor(key: string) {
        switch (key) {
            case "1":
                return "a";
            case "2":
                return "b";
            case "5":
                return "c";
            case "10":
                return "d";
            case "20":
                return "e";
            case "50":
                return "f";
            case "100":
                return "g";
            case "200":
                return "h";
            case "500":
                return "i";
            case "1000":
                return "j";
            case "2000":
                return "k";
            case "5000":
                return "l";
            case "10000":
                return "m";
            default:
                UDebug.error("未知筹码" + key)
                return "m";
        }
    }

    //生成筹码
    creatoeChip(strValue: string) {
        if (strValue == "20") {
            this.creatoeChip("10");
            strValue = "10";
        }
        this.shScene._music.playflyCoin();
        let tempPre = cc.instantiate(this.chip_Pre);
        tempPre.active = true;
        this.chip_container.addChild(tempPre);
        tempPre.setPosition(this.chipPos.position);
        tempPre.getComponent(cc.Label).string = this.chipColor(strValue);
        let Vect2 = new cc.Vec2(this.shScene.random(-100, 100), this.shScene.random(30, 180));
        tempPre.runAction(cc.sequence(cc.moveTo(0.2, Vect2).easing(cc.easeQuadraticActionOut()), cc.callFunc(() => { }, this)));
        this.chipsPool.push(tempPre);
    }

    //断线重连
    CMD_S_StatusPlay(data: suoha.IChipInfo[]) {
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].count; j++) {
                let strValue=data[i].chip;
                if (strValue == 20) {//分解20块筹码
                    strValue=10;
                    let tempPre = cc.instantiate(this.chip_Pre);
                    tempPre.active = true;
                    this.chip_container.addChild(tempPre);
                    tempPre.getComponent(cc.Label).string = this.chipColor(strValue.toString());
                    let Vect2 = new cc.Vec2(this.shScene.random(-100, 100), this.shScene.random(30, 180));
                    tempPre.setPosition(Vect2);
                    this.chipsPool.push(tempPre);
                }
                let tempPre = cc.instantiate(this.chip_Pre);
                tempPre.active = true;
                this.chip_container.addChild(tempPre);
                tempPre.getComponent(cc.Label).string = this.chipColor(strValue.toString());
                let Vect2 = new cc.Vec2(this.shScene.random(-100, 100), this.shScene.random(30, 180));
                tempPre.setPosition(Vect2);
                this.chipsPool.push(tempPre);
            }
        }
    }

    //发牌
    CMD_S_SendCard(data: suoha.ICardItem) {
        this.fapaiCount++;
        this.poker_Layout.setPosition(this.initVect);
        if (this.poker[this.fapaiCount] != null) {
            this.SendCardAnim(this.poker[this.fapaiCount], data);
        }
    }

    //发牌动画
    SendCardAnim(tempNode: sp.Skeleton, data: suoha.ICardItem) {
        this.shScene._music.playfapai();
        this.pokerAnim.active = true;
        this.pokerAnim.opacity = 255;
        this.ty = data.ty;
        this.pokerAnim.setPosition(this.cardPos);
        this.pokerAnim.runAction(cc.sequence(cc.moveTo(0.3, new cc.Vec2(0, 0)).easing(cc.easeQuadraticActionOut()), cc.callFunc(() => {
            this.pokerAnim.setPosition(this.cardPos);
            this.pokerAnim.opacity = 0;
            tempNode.node.parent.active = true;
            this.SkeletonAnim(this.shScene.returnCard(data.cards[0]), tempNode);
            this.SkeletonAnim(this.shScene.cardTypeList[data.ty], this.cardType);

            this.shScene.twoCardCount++;
            this.shScene.newSendCardAnim();
        })));
    }

    //用户弃牌
    CMD_S_GiveUp(data: suoha.CMD_S_GiveUp) {
        this.shScene._music.playQiPai(this.sex);
        this.action.node.active = true;
        this.SkeletonAnim(this.shScene.cardCode[5], this.action);
        if (data.cards != null && data.cards.length != 0) {
            for (let i = 0; i < data.cards.length; i++) {
                if (data.cards[i] != 0) {
                    this.poker[i].node.parent.active = true;
                    this.SkeletonAnim(this.shScene.returnCard(data.cards[i]), this.poker[i]);
                }
            }
        }

        if (data.ty != null) {
            this.ty = data.ty;
            this.SkeletonAnim(this.shScene.cardTypeList[data.ty], this.cardType);
        }
        this.banker.active = false;
        this.closeCT();//关闭进度条
        this.GiveUpAnim();//玩家弃牌动画
    }

    //玩家弃牌动画
    GiveUpAnim() {
        this.giveUpNode.runAction(cc.sequence(cc.spawn(cc.moveTo(0.3, this.giveUpMoto), cc.scaleTo(0.5, 0)), cc.callFunc(() => {
            this.giveUpNode.setPosition(this.giveUpPos);
        }, this)));
    }

    //让牌
    CMD_S_PassScore(data: suoha.CMD_S_PassScore) {
        this.shScene._music.playRangPai(this.sex);
        this.action.node.active = true;
        this.SkeletonAnim(this.shScene.cardCode[1], this.action);
    }

    //点击看牌
    onTouchStart(event: any) {
        this.isKanpai = false;
        this.kanpaiTime = 1;
        if (this.poker[0].animation == "poke_back") {
            SHModel.ins.kanpai();
        }
    }

    //手指离开节点
    onTouchEnd(event: any) {
        if (this.isOver) return;
        this.isKanpai = true;
        this.kanpaiTime = 1;
    }

    //手指离开节点
    onTouchCancel(event: any) {
        if (this.isOver) return;
        this.isKanpai = true;
        this.kanpaiTime = 1;
    }

    //看牌
    CMD_S_LookCard(data: suoha.CMD_S_LookCard) {
        this.shScene._music.playfanpai();
        this.SkeletonAnim(this.shScene.returnCard(data.cards[0]), this.poker[0]);
        this.SkeletonAnim(this.shScene.cardTypeList[data.ty], this.cardType);
    }

    //孤注一掷 梭哈
    CMD_S_AllIn(data: suoha.CMD_S_AllIn) {
        for (let i = 0; i < data.chips.length; i++) {
            for (let index = 0; index < data.chips[i].count; index++) {
                this.creatoeChip(data.chips[i].chip.toString());
            }
        }

        if (data.AllinUser == this.shScene.chairPlay) {
            CarryingAmount.sumGod = data.UserScore;
        }

        this.shScene._music.playSoha(this.sex);
        this.action.node.active = true;
        this.SkeletonAnim(this.shScene.cardCode[2], this.action);
        this.gold.string = UStringHelper.formatPlayerCoin((data.takeScore * SH_SCALE)).toString();
        this.betInfo.string = UStringHelper.getMoneyFormat((data.tableScore * SH_SCALE)).toString();
    }

    //游戏结束切后台玩家是否弃牌
    gameEndisGiveup(data: suoha.IPlayerItem){
        if(data.isGiveup){
            this.action.node.active = true;
            this.SkeletonAnim(this.shScene.cardCode[5], this.action);
            this.cardType.node.active = false;
            for (let i = 0; i < this.poker.length; i++) {
                this.poker[i].node.parent.active=false;
            }
        }

        if(!data.playstatus){
            this.outSp.active = true;//遮罩
        }
    }

    //游戏结束
    CMD_S_GameEnd(data: suoha.ICMD_S_GameEnd_Player,tempBool:boolean=false) {
        this.isfree = false;
        if (data.userId != this.userId) return;
        this.score.active = true;
        this.onWinEnd(data.deltascore);//输赢飘字

        if (data.chairId == this.shScene.chairPlay) {
            this.shScene.goldPlay = data.takeScore;
            CarryingAmount.sumGod = data.userScore;
        }

        this.gold.string = UStringHelper.formatPlayerCoin((data.takeScore * SH_SCALE)).toString();
        if (!this.isGiveup && data.handcards != null) {
            this.cardType.node.active = true;
            this.SkeletonAnim(this.shScene.cardTypeList[data.handcards.ty], this.cardType);
        }

        if(tempBool){
            this.score1_bg.active = true;
            this.betInfo.string = UStringHelper.getMoneyFormat((data.betScore * SH_SCALE)).toString();
            for (let i = 0; i < data.handcards.cards.length; i++) {
                this.poker[i].node.parent.active = true;
                if (data.handcards.cards[i] != 0) {
                    this.SkeletonAnim(this.shScene.returnCard(data.handcards.cards[i]), this.poker[i]);
                }
                else{
                    this.SkeletonAnim("poke_back", this.poker[i]);
                }
            }
        }

        this.closeCT();//关闭进度条
    }

    //游戏结束比牌翻牌
    GameEndFanPai(winuser: number, dataPlayer: suoha.ICMD_S_GameEnd_Player, data: any,tempBool:boolean=false) {
        this.closeCT();//关闭进度条
        this.ty = dataPlayer.handcards.ty;
        this.cardType.node.active = true;
        this.SkeletonAnim(this.shScene.cardTypeList[dataPlayer.handcards.ty], this.cardType);

        this.score1_bg.active = true;
        this.betInfo.string = UStringHelper.getMoneyFormat((dataPlayer.betScore * SH_SCALE)).toString();

        if(tempBool){
            for (let i = 0; i < dataPlayer.handcards.cards.length; i++) {
                this.poker[i].node.parent.active = true;
                if (dataPlayer.handcards.cards[i] != 0) {
                    this.SkeletonAnim(this.shScene.returnCard(dataPlayer.handcards.cards[i]), this.poker[i]);
                }
                else{
                    this.SkeletonAnim("poke_back", this.poker[i]);
                }
            }
        }
        else{
            if (dataPlayer.handcards.cards[0] != 0) {
                this.SkeletonAnim(this.shScene.returnCard(dataPlayer.handcards.cards[0]), this.poker[0]);
            }
        }

        if (winuser == this.chairID) {
            if(tempBool){
                this.shScene.endWinSettle(dataPlayer, data, this.node.name,tempBool);//结算界面
            }
            else{
                this.scheduleOnce(() => {
                    this.shScene.endWinSettle(dataPlayer, data, this.node.name);//结算界面
                }, 1)
            }
        }
        else {
            this.closeCT();//关闭进度条
        }
    }

    //是否返还筹码
    returnChip(chips: suoha.IChipInfo[]) {
        for (let index = 0; index < 1; index++) {
            this.scheduleOnce(() => {
                this.shScene._music.playflyCoins();
            }, index * 0.2)
        }

        for (let i = 0; i < chips.length; i++) {
            for (let j = 0; j < chips[i].count; j++) {
                let tempPre = cc.instantiate(this.chip_Pre);
                tempPre.active = true;
                this.chip_container.addChild(tempPre);
                let Vect2 = new cc.Vec2(this.shScene.random(-100, 100), this.shScene.random(30, 180));
                tempPre.setPosition(Vect2);
                tempPre.getComponent(cc.Label).string = this.chipColor(chips[i].chip.toString());
                tempPre.runAction(cc.sequence(cc.spawn(cc.delayTime(0.5), cc.moveTo(1, this.chipPos.getPosition()).easing(cc.easeQuadraticActionOut())), cc.callFunc(() => {
                    tempPre.destroy();
                }, this)));
            }
        }
    }

    //牌隐藏
    emptyPoker() {
        this.cardType.node.active = false;
        for (let i = 0; i < this.poker.length; i++) {
            this.poker[i].node.parent.active = false;
        }
    }

    //输赢飘字
    onWinEnd(tempValue: number) {
        this.score.active = true;
        this.score.setPosition(this.fontPos);
        this.score.opacity = 0;
        this.score.stopAllActions();

        let tempScore = UStringHelper.getMoneyFormat(tempValue * SH_SCALE);
        tempScore = tempScore.toString();

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
            cc.moveBy(1, 0, 80), cc.fadeOut(2)));
    }

    //初始化数值
    initGame(isBool: boolean = true) {
        this.gf_ct.active = false;
        this.isKanpai = false;
        this.ty = 0;
        this.fapaiCount = 0;
        this.isfree = false;
        this.cdTime = 16;
        this.betInfo.string = "0";
        this.isGiveup = false;

        this.closeCT();//关闭进度条
        this.action.node.active = false;
        this.score.active = false;
        this.banker.active = false;
        this.score1_bg.active = false;
        this.emptyPoker();//牌隐藏
        this.poker_Layout.setPosition(this.initVect);

        //停止一切动画
        this.pokerAnim.stopAllActions();
        this.pokerAnim.active = false;
        if (this.giveUpNode != null) {
            this.giveUpNode.stopAllActions();
        }
        this.score.stopAllActions();
        this.fanpai.stopAllActions();

        if (this.prop != null) {
            this.prop.getComponent(GamePropManager).closePropPanelByUserId(this.userId);
        }

        if (this.chatProp != null) {
            this.chatProp.getComponent(VGameChatPropManager).bindUserId(this.userId);
        }

        if (isBool) {
            this.cearChipsPool();
        }
        else {
            for (let index = 0; index < this.chipsPool.length; index++) {
                if (this.chipsPool[index] != null) {
                    try {
                        if (this.node.name != "play_0") {
                            this.shScene.playList[0].chipsPool.push(this.chipsPool[index]);
                        }
                    } catch (error) {
                        UDebug.error("梭哈对象池崩溃了!");
                    }
                }
            }
            this.chipsPool = [];
        }
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

    //清除筹码
    cearChipsPool() {
        for (let index = 0; index < this.chipsPool.length; index++) {
            if (this.chipsPool[index] != null) {
                this.chipsPool[index].destroy()
            }
        }
        this.chipsPool = [];
    }

    //看牌抖动
    shakeNode() {
        this.fanpaiInitPOs = this.poker[0].node.getPosition();//看牌抖动初始位置
        const marginy = 10;
        let cccall = cc.callFunc((node) => {
            this.fanpai.setPosition(this.poker[0].node.getPosition());
        }, this)
        this.fanpai.stopAllActions();
        this.fanpai.runAction(cc.sequence(
            cc.repeat(cc.sequence(cc.moveTo(0.05, this.fanpaiInitPOs.x, this.fanpaiInitPOs.y + marginy),
                cc.moveTo(0.05, this.fanpaiInitPOs.x, this.fanpaiInitPOs.y - marginy),
                cc.moveTo(0.05, this.fanpaiInitPOs.x, this.fanpaiInitPOs.y)), 5), cccall));
    }

    //设置遮罩大小和位置
    setOutSpSize() {
        if (this.outSp.activeInHierarchy) {
            this.outSp.opacity = 0;
        }
    }

    //还原遮罩大小和位置
    initOutSpSize() {
        if (this.outSp.activeInHierarchy) {
            this.outSp.opacity = 255;
        }
    }

    /**通过userId获取道具节点 */
    getPropNodeByUserId(userId: number, callback: any = null) {
        for (let i = 0; i < this.shScene.playList.length; i++) {
            let player = this.shScene.playList[i];
            if (player.prop != null) {
                let bindUserId = player.prop.getComponent(GamePropManager).getBindUserId();
                if (bindUserId && (userId == bindUserId)) {
                    callback && callback(player.prop);
                }
            }
        }
    }

    /**通过userId获取聊天节点 */
    getChatPropNodeByUserId(userId: number, callback: any = null) {
        for (let i = 0; i < this.shScene.playList.length; i++) {
            let player = this.shScene.playList[i];
            if (player.chatProp != null) {
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
        this.fanpai.stopAllActions();
        this.score.stopAllActions();
        this.giveUpNode.stopAllActions();
        this.pokerAnim.opacity = 0;
        this.pokerAnim.stopAllActions();
        this.fanpai.stopAllActions();
    }
}
