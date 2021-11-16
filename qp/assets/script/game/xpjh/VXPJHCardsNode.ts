import VQZNNPincardNode from "./VXPJHPincardNode";
import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "../../public/base/AppGame";
import UQZNNScene from "./UXPJHScene";
import MQZNNModel, { QZNN_SELF_SEAT } from "./model/MXPJHModel";
import UDebug from "../../common/utility/UDebug";
import UXPJHHelper from "./UXPJHHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import { XPQzjh } from "../../common/cmd/proto";

const { ccclass, property } = cc._decorator;

const CARD_COUNT = 3  

@ccclass
export default class VXPJHCardsNode extends cc.Component {

    private _pincardNode: VQZNNPincardNode = null;
    /**
     * 牌组节点下的各节点
     * @param card0-4 :牌
     * @param node 牌组的牌的父节点
     * @param done 完成图片显示
     * @param cardtypedb 牌型龙骨动画
     * @param cardtypespine 牌型spine动画
     * @param pos 各牌的初始坐标
     */
    private _cardsList = {
        "0": {
            "card0": null,
            "card1": null,
            "card2": null,
            "card3": null,
            "card4": null,
            node: null,
            // done: null,
            // cardtypedb: null,
            cardtypespine: sp.Skeleton,
            pos: {
                pos0: null,
                pos1: null,
                pos2: null,
                pos3: null,
                pos4: null,
            }

        },
        "1": {
            "card0": null,
            "card1": null,
            "card2": null,
            "card3": null,
            "card4": null,
            node: null,
            // done: null,
            // cardtypedb: null,
            cardtypespine: sp.Skeleton,
            pos: {
                pos0: null,
                pos1: null,
                pos2: null,
                pos3: null,
                pos4: null,
            }

        },
        "2": {
            "card0": null,
            "card1": null,
            "card2": null,
            "card3": null,
            "card4": null,
            node: null,
            // done: null,
            // cardtypedb: null,
            cardtypespine: sp.Skeleton,
            pos: {
                pos0: null,
                pos1: null,
                pos2: null,
                pos3: null,
                pos4: null,
            }
        },
        "3": {
            "card0": null,
            "card1": null,
            "card2": null,
            "card3": null,
            "card4": null,
            node: null,
            // done: null,
            // cardtypedb: null,
            cardtypespine: sp.Skeleton,
            pos: {
                pos0: null,
                pos1: null,
                pos2: null,
                pos3: null,
                pos4: null,
            }
        }
    }

    /**自己的牌 */
    private _cbCardData: number[] = null;
    /**拼牌倒计时数 */
    private _pinpaitime: number = null;

    /**最大玩家 */
    private _maxplayer: number = 4;

    private _isShowPinpai: boolean = false;//拼牌界面要不要

    private _isReconnect: boolean = false;
    private _btn_seepai: cc.Button;
    /**增加的选牌界面 */
    private _xpcardNode: cc.Node = null;
    /**选牌的node */
    private _selectCards: cc.Sprite[][] = [[], [], [], []];
    /**选派提示 */
    private _selectTipsFlag: cc.Node[] = []
    /**选择的点数 */
    private selectIdx = 0
    private _notSendNode: cc.Node;

    start() {

        this.init();
        this.addEvent();

        //全部隐藏手牌 动画隐藏
        for (let i = 0; i < this._maxplayer; i++) {
            this.setCardActiveByIndex(i, false);
            // this.setDragonBonesActive(i, false);

            this.setSpineActive(i, false);
        }

        //test
        // this.node.runAction(cc.sequence(
        //     cc.delayTime(1),
        //     cc.callFunc(()=>{
        //         this.showPincard();
        //     })
        // ));

    }
    /**初始化各组件 */
    private init() {
        this._maxplayer = AppGame.ins.xpqzjhModel.maxPlayer;

        this._pincardNode = UNodeHelper.getComponent(this.node, "pincardsNode", VQZNNPincardNode);

        this._btn_seepai = UNodeHelper.getComponent(this.node, "btn_seepai", cc.Button);

        UEventHandler.addClick(this._btn_seepai.node, this.node, "VXPJHCardsNode", "sendOpenCard");

        this._xpcardNode = UNodeHelper.find(this.node, "all_xp");
        this._xpcardNode.active = false

        this._notSendNode = UNodeHelper.find(this.node, "all_xp/notSendNode")
        this._notSendNode.active = false

        for (let i = 0; i < 10; i++) {
            UDebug.log("------------------------------" + i)

            for (let j = 0; j < 4; j++) {
                let path = "cards_xp" + (j + 1).toString()
                this._selectCards[j][i] = UNodeHelper.getComponent(this._xpcardNode, path + "/card" + i.toString(), cc.Sprite)
                if (this._selectTipsFlag[j] == null) {
                    this._selectTipsFlag[j] = UNodeHelper.find(this._xpcardNode, path + "/poker_xz1")
                    //this._selectTipsFlag[j].active = false
                    //UDebug.log(this._selectTipsFlag[j], this._selectCards[j][i])
                }

            }
            // let key = AppGame.ins.xpqzjhModel.cardValueToSpriteKey1(i+1);
            // UDebug.log("看这里------------------------- "+key)
            // this._selectCards[i].spriteFrame = UQZNNScene.ins.getSpriteFrame(key);

            //UEventHandler.addClick(this._selectCards[i].node, null, "VXPJHCardsNode", "selectCard");
        }

        for (let i = 0; i < this._maxplayer; i++) {
            var path = "cards" + i.toString();

            this._cardsList[i.toString()].node = UNodeHelper.find(this.node, path);

            // let wcPath = path + "/nn_wancheng";
            // this._cardsList[i.toString()].done = UNodeHelper.find(this.node, wcPath);

            for (let j = 0; j < CARD_COUNT + 1; j++) {
                let jpath = path + "/card" + j.toString();
                let tPath = "card" + j.toString();

                let posPath = "pos" + j.toString();

                this._cardsList[i.toString()][tPath] = UNodeHelper.getComponent(this.node, jpath, cc.Sprite);

                this._cardsList[i.toString()]["pos"][posPath] = this._cardsList[i.toString()][tPath].node.getPosition();
            }
            // let cardtypedbPath = path + "/qznnPxAni";
            // this._cardsList[i.toString()].cardtypedb = UNodeHelper.getComponent(this.node, cardtypedbPath, dragonBones.ArmatureDisplay);

            let cardtypespinePath = path + "/spine_cardtype";
            UDebug.log("sp.Skeleton       ", sp.Skeleton)
            this._cardsList[i.toString()].cardtypespine = UNodeHelper.getComponent(this.node, cardtypespinePath, sp.Skeleton);

        }
        //UDebug.log(this._cardsList);

    }

    /**添加事件 */
    private addEvent() {
        AppGame.ins.xpqzjhModel.on(UXPJHHelper.QZNN_SELF_EVENT.QZNN_FAPAI_COMPLETE, this.showCardBackByIndex, this);

        AppGame.ins.xpqzjhModel.on(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_OPEN, this.onGameSceneOpen, this);
        AppGame.ins.xpqzjhModel.on(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_OPEN_CARD_RESULT, this.onOpenCardResult, this);

        AppGame.ins.xpqzjhModel.on(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        AppGame.ins.xpqzjhModel.on(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_SEND_CARD1, this.onSendCard1, this);

        AppGame.ins.xpqzjhModel.on(UXPJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE, this.onResetScene, this);
        // AppGame.ins.xpqzjhModel.on(UXPJHHelper.QZNN_SELF_EVENT.QZNN_PINCARD_DONE, this.onPinCardDone, this);

        AppGame.ins.xpqzjhModel.on(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SCENE_OPEN_NOT_SEND_CARD, this.openNotSendCard, this);

        //发送选牌
        AppGame.ins.xpqzjhModel.on(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SELECT_CARD, this.onSelectCard, this);

        AppGame.ins.xpqzjhModel.on(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SELECT_CARD_OK, this.onSureSelectCard, this);

    }
    private removeEvent() {
        AppGame.ins.xpqzjhModel.off(UXPJHHelper.QZNN_SELF_EVENT.QZNN_FAPAI_COMPLETE, this.showCardBackByIndex, this);

        AppGame.ins.xpqzjhModel.off(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_OPEN, this.onGameSceneOpen, this);
        AppGame.ins.xpqzjhModel.off(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_OPEN_CARD_RESULT, this.onOpenCardResult, this);

        AppGame.ins.xpqzjhModel.off(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        AppGame.ins.xpqzjhModel.off(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_SEND_CARD1, this.onSendCard1, this);

        AppGame.ins.xpqzjhModel.off(UXPJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE, this.onResetScene, this);
        // AppGame.ins.xpqzjhModel.off(UXPJHHelper.QZNN_SELF_EVENT.QZNN_PINCARD_DONE, this.onPinCardDone, this);
        AppGame.ins.xpqzjhModel.off(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SCENE_OPEN_NOT_SEND_CARD, this.openNotSendCard, this);


        //发送选牌
        AppGame.ins.xpqzjhModel.off(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SELECT_CARD, this.onSelectCard, this);
        AppGame.ins.xpqzjhModel.off(UXPJHHelper.QZNN_SELF_EVENT.QZNN_SELECT_CARD_OK, this.onSureSelectCard, this);

    }

    onDestroy() {
        this.removeEvent();
    }

    /**
     * 重置场景
     */
    private onResetScene(data?: any) {
        for (let i = 0; i < this._maxplayer; i++) {
            this.setCardActiveByIndex(i, false);

            this.setSpineActive(i, false);
        }
        this._btn_seepai.node.active = false;
        this._notSendNode.active = true
        this.setCardsReset()
    }

    private setCardsReset() {
        this._xpcardNode.active = false


        for (let i of this._selectCards) {
            for (let j of i) {
                let key = "poker_b1";
                j.spriteFrame = UQZNNScene.ins.getSpriteFrame(key);
            }
        }

        for (let node of this._selectTipsFlag) {
            node.active = false
        }
    }

    /**
     * 分数添加完成
     * @param data 
     */
    private onAddScoreResult(data: any) {
        AppGame.ins.xpqzjhModel.gameStatus = MQZNNModel.QZNN_GAMESTATUS.SEND;
    }
    /**
     * 开牌场景消息
     * @param data 
     */
    private onGameSceneOpen(data: XPQzjh.NN_MSG_GS_OPEN) {


        var cbIsOpenCard = data.isOpenCard;
        //已开牌不显示拼牌界面
        if (cbIsOpenCard != null) {
            if (cbIsOpenCard[AppGame.ins.xpqzjhModel.gMeChairId]) {
                this._isReconnect = true;
            }
        }

        // UDebug.Log("isReconnect:" + this._isReconnect);
    }
    /**开牌场景 特殊处理下 不播发牌动画 */
    private openNotSendCard(data: any) {
        this._cbCardData = data;

        for (let i = 0; i < this._maxplayer; i++) {

            // this.setCardActiveByIndex(i, true);

            let player = AppGame.ins.xpqzjhModel.getbattleplayerbySeatId(i);
            if (player != null && player.playStatus == 1 && player.seatId >= 0 && player.seatId < 4) {
                this.showCardBackByIndex(i);
            }
        }
    }

    /**
     * 单个玩家开牌结果
     * @param data 
     */
    private onOpenCardResult(data: XPQzjh.NN_CMD_S_OpenCardResult) {
        // UDebug.Log("cardsnode onOpenCardResult:" + JSON.stringify(data));

        var wOpenCardUser = data.openCardUser;
        var cbCardType = data.cardType;
        var cbCardData = data.cardData; //number[] | null
        // var cbOxCardData = data.OXCardData;//number[] | null
        let selectCard = data.selectCard

        var chairId = AppGame.ins.xpqzjhModel.getUISeatId(wOpenCardUser);

        if (chairId == QZNN_SELF_SEAT) {
            // this._pincardNode.hide();

            this._btn_seepai.node.active = false;
            this.setCardActiveByIndex(0, true);
        }

        this.showCardTypeAni(chairId, cbCardData, selectCard, cbCardType);


    }
    /**
     * 可以开牌阶段
     * @param data 
     */
    private onSendCard1(data: XPQzjh.NN_CMD_S_SendCard) {
        var cbSendCard = data.sendCard;
       

        UDebug.Log("onSendCard1:" + JSON.stringify(data));
     
        this._cbCardData = cbSendCard;

        let player = AppGame.ins.xpqzjhModel.getbattleplayerbySeatId(0);
        if (player != null && player.playStatus == 1) {
            this._btn_seepai.node.active = true;
            this._notSendNode.active = true
        }
        // this._pinpaitime = cbOpenTime;
    }

    private sendOpenCard() {
        UQZNNScene.ins.playClick();
        AppGame.ins.xpqzjhModel.sendOpenCard();
    }

    /** 选择的点数 */
    private selectCard(e: cc.Event.EventTouch) {

        let node: cc.Node = e.currentTarget
        let str = e.currentTarget.name
        let idx = str.charAt(str.length - 1)
        UDebug.log("selectCard"+str+ idx)
        // this._selectTipsFlag[0].removeFromParent()
        // node.addChild(this._selectTipsFlag[0])
        // this._selectTipsFlag[0].active = true
        this.selectIdx = idx


        AppGame.ins.xpqzjhModel.sendSelectCard(idx);
    }

    /** 不能被点击 */
    private notSendSelectCard(e: cc.Event.EventTouch) {

    }

    /**是否推出游戏 */
    private isExitGame(e: cc.Toggle) {
        UDebug.Log(e.isChecked)
        AppGame.ins.xpqzjhModel.sendIsExitGame(e.isChecked);
    }


    // 接收所有玩家选牌
    onSelectCard(data: XPQzjh.NN_CMD_S_SendSelCard, selectedCard: number[]) {
        this._xpcardNode.active = true
        let d = data.toBeSelCardsData
        //let chairId = AppGame.ins.xpqzjhModel.gMeChairId

        /**选牌 */

        this._notSendNode.active = false
        for (let j = 0; j < this._selectCards.length; j++) {
            for (let i = 0; i < 10; i++) {

                //var pos = AppGame.ins.xpqzjhModel.getPlayerSexByRealSeat(j);
                var chairId = AppGame.ins.xpqzjhModel.getUISeatId(j);
                let list = this._selectCards[chairId]

                let idx = i + j * 10
                //UDebug.log("------------------------------" + idx, chairId)
                let key = "poker_b1";
                let cardNumber = d[idx]
                if (cardNumber != 0) {
                    key = AppGame.ins.xpqzjhModel.cardValueToSpriteKey1(cardNumber);
                } else {
                    list[i].node.parent.active = false
                    break
                }
                list[i].node.parent.active = true
                list[i].spriteFrame = UQZNNScene.ins.getSpriteFrame(key);


                if (selectedCard) {
                    if (cardNumber == selectedCard[j]) {
                        let d = new XPQzjh.NN_CMD_S_SelCardResult()
                        d.selCardUser = j
                        d.cardIndex = i
                        d.card = cardNumber
                        this.onSureSelectCard(d)
                    }
                } else {
                    if (i == 0) {
                        let d = new XPQzjh.NN_CMD_S_SelCardResult()
                        d.selCardUser = j
                        d.cardIndex = i
                        d.card = cardNumber
                        this.onSureSelectCard(d)
                    }
                }

            }
            //UEventHandler.addClick(this._selectCards[i].node, null, "VXPJHCardsNode", "selectCard");
        }

        if (selectedCard) {
            for (let i = 0; i < selectedCard.length; i++) {

                var chairId = AppGame.ins.xpqzjhModel.getUISeatId(i);
                let list = this._cardsList[chairId.toString()]

                let cardNumber = selectedCard[i]
                let path = "card3"
                if (cardNumber == 0) {
                    // if (chairId == 0) {
                    //     list[path].spriteFrame = UQZNNScene.ins.getSpriteFrame("xpnn_poker1");
                    // } else {
                    //     list[path].spriteFrame = UQZNNScene.ins.getSpriteFrame("xpnn_poker2");
                    // }
                } else {
                    let key = AppGame.ins.xpqzjhModel.cardValueToSpriteKey1(cardNumber);
                    list[path].spriteFrame = UQZNNScene.ins.getSpriteFrame(key);
                }


            }
        }
    }

    //单个玩家的选牌确认
    onSureSelectCard(data: XPQzjh.NN_CMD_S_SelCardResult) {

        UDebug.log("单个玩家的选牌确认"+ data)
        let chairId = AppGame.ins.xpqzjhModel.getUISeatId(data.selCardUser)//选牌玩家
        let cardIdx = data.cardIndex//选牌索引
        //data.card//选牌

        let node = this._selectCards[chairId][cardIdx].node
        this._selectTipsFlag[chairId].removeFromParent()
        node.addChild(this._selectTipsFlag[chairId])
        this._selectTipsFlag[chairId].active = true

        let k = AppGame.ins.xpqzjhModel.cardValueToSpriteKey1(data.card)
        this._cardsList[chairId.toString()]["card3"].spriteFrame = UQZNNScene.ins.getSpriteFrame(k);

    }


    /**
     * 拼牌完成，显示自己的牌背
     */
    private onPinCardDone() {
        // this.showCardBack(0);
    }


    /**拼牌界面显示 */
    private showPincard() {


        // this._pincardNode.setCardValue(this._cbCardData);
        // this._pincardNode.show();
    }

    /**
     * 发牌动画完显示的牌背
     * @param index 本地位置索引
     */
    private showCardBack(index: number) {
        this.setCardActiveByIndex(index, true);

        //设置卡背
        for (let i = 0; i < 2; i++) {
            // const element = array[i];
            let path = "card" + i.toString();
            let key = "poker_b1";
            this._cardsList[index.toString()][path].spriteFrame = UQZNNScene.ins.getSpriteFrame(key);

            let pos_path = "pos" + i.toString();
            let pos = this._cardsList[index.toString()]["pos"][pos_path];

            this._cardsList[index.toString()][path].node.setPosition(pos);
        }
        let path = "card2"
        this._cardsList[index.toString()][path].node.opacity = 0

        // path = "card3"
        // if (index == 0) {
        //     this._cardsList[index.toString()][path].spriteFrame = UQZNNScene.ins.getSpriteFrame("xpnn_poker1");
        // } else {
        //     this._cardsList[index.toString()][path].spriteFrame = UQZNNScene.ins.getSpriteFrame("xpnn_poker2");
        // }


    }


    /**
     * 设置牌节点激活状态 
     * @param index 座位索引
     * @param b 是否显示
     */
    setCardActiveByIndex(index: number, b: boolean) {
        this._cardsList[index.toString()].node.active = b;
    }
    /**
     * 设置牌背
     * @param index 座位索引
     */
    private showCardBackByIndex(index: number) {


        this.showCardBack(index);


    }
    /**
     * 设置牌精灵
     * @param index 座位索引
     * @param values 牌值数组
     */
    private setCardsSprite(index: number, values: number[], selectCard: number): void {

        if (values.length != CARD_COUNT) return;

        let cards = this._cardsList[index.toString()];

        for (let i = 0; i < CARD_COUNT + 1; i++) {
            let path = "card" + i.toString();

            // let posPath = "pos" + i.toString();
            // cards[path].node.setPosition(cards["pos"][posPath]);k

            let key = AppGame.ins.xpqzjhModel.cardValueToSpriteKey1(values[i] || 1);
            cards[path].spriteFrame = UQZNNScene.ins.getSpriteFrame(key);
            cards[path].node.opacity = 255
        }

        let k = AppGame.ins.xpqzjhModel.cardValueToSpriteKey1(selectCard)
        cards["card3"].spriteFrame = UQZNNScene.ins.getSpriteFrame(k);
        UDebug.Log(selectCard + " 看这里 ------------------- card3:   " + k);


    }

    /**
     * 设置完成图片显示 not use
     * @param index 座位索引
     * @param b 是否显示
     */
    private setWanChengActive(index: number, b: boolean): void {
        // let wancheng_image = this._cardsList[index.toString()]["done"];
        // wancheng_image.active = b;
    }
    /**
     * 设置龙骨动画显示 not use
     * @param index 座位索引
     * @param b 是否显示
     */
    private setDragonBonesActive(index: number, b: boolean) {
        // this._cardsList[index.toString()].cardtypedb.node.active = b;
    }

    /**
     * 显示牌型的龙骨动画 not use
     * @param index 座位索引
     * @param cardtype 牌型
     */
    private setDragonBonesCardType(index: number, cardtype: number): void {
        // let temp = this._cardsList[index.toString()].cardtypedb;
        // let aniName = "qznn_effect_px_" + cardtype.toString();
        // temp.animationName = aniName;
        // this.setDragonBonesActive(index, true);

        // temp.playAnimation(aniName, 1); //激活1次会自动播放动画
    }


    setSpineActive(index: number, b: boolean) {
        this._cardsList[index.toString()].cardtypespine.node.active = b;
    }

    /**
     * 显示牌型的Spine动画
     * @param index 座位索引
     * @param cardtype 牌型
     */
    setSpineCardType(index: number, cardtype: number): void {
        let temp: sp.Skeleton = this._cardsList[index.toString()].cardtypespine;

        var aniName = null;

        aniName = UXPJHHelper.CARD_TYPE2[cardtype];

        // aniName = "wuhuanull"; //测试
        // ="qznn_effect_px_" + cardtype.toString();
        if (aniName != null) {
            temp.animation = aniName;
            temp.setAnimation(0, aniName, false);
            this.setSpineActive(index, true);
        }
        // UDebug.log("cardtype:"+cardtype);
        UQZNNScene.ins.getMusic.playPaiXing(aniName, AppGame.ins.xpqzjhModel.getPlayerSexByUISeat(index));

        AppGame.ins.xpqzjhModel.emit(UXPJHHelper.QZNN_SELF_EVENT.QZNN_MOVE_NEXT_CMD);
    }




    /**
     * 显示整体牌型动画
     * @param index 座位索引
     * @param cbCardData 牌值数组
     */
    showCardTypeAni(index: number, cbCardData: number[], selectCard: number, cbCardType?: number, cbOxCardData?: number[]) {
        //步骤分解 1:4张牌往中间牌移动 2:赋牌值,且找出牛牛牌
        //3:普通牌型：3张牛牛牌移动到偏左,2张偏右
        //特殊牌型反转即可
        // var cards = this._cardsList[index.toString()];
        // var mindlePos = cards["pos"]["pos2"];
        // let oldCbCardData = cbCardData
        // var self = this;

        // // AppGame.ins.xpqzjhModel.sortCardList(cbCardData,cbCardData.length);
        // UDebug.log("sort:" + JSON.stringify(cbCardData));

        // var cardtype = 0;
        // if (cbCardType != null) {
        //     cardtype = cbCardType;
        // }
        // else {
        //     cardtype = AppGame.ins.xpqzjhModel.getCardType(cbCardData, cbCardData.length);
        // }

        // // UDebug.log("cardtype:" + cardtype);

        // if (cbOxCardData != null && cbOxCardData.length == CARD_COUNT) {
        //     let niuniuTemp = cbOxCardData;

        //     // for (let j = 0; j < CARD_COUNT; j++) {
        //     //     for (let k = 0; k < 3; k++) {
        //     //         if (cbCardData[j] != cbOxCardData[k]) {
        //     //             niuniuTemp.push(cbCardData[j]);
        //     //             break;
        //     //         }
        //     //     }
        //     // }
        //     if (niuniuTemp.length == CARD_COUNT) {
        //         cbCardData = niuniuTemp;
        //     }
        //     else { //找不对,就用本地找算了
        //         AppGame.ins.xpqzjhModel.getOxCard(cbCardData);
        //     }

        // }
        // else {
        //     // UDebug.log("before:"+cbCardData);

        //     //找出牛牛牌 cbCardData 的值已排序过
        //     var niuniuCard = AppGame.ins.xpqzjhModel.getOxCard(cbCardData);

        //     // UDebug.log("牛牛" + niuniuCard);
        //     // UDebug.log("after:"+cbCardData);
        // }




        // var offest = 10;//8;

        // if (index == 0) {//自己
        //     for (let i = 0; i < CARD_COUNT; i++) {
        //         let cardpath = "card" + i.toString();
        //         var movePos = new cc.Vec2(0, 0);
        //         let path = "pos" + i.toString();

        //         if (cardtype > 10 || cardtype == 0)//特殊牛 不知道怎么摆
        //         { //先按原来的位置摆
        //             let pos = new cc.Vec2(cards["pos"][path].x, cards["pos"][path].y);
        //             movePos = pos;
        //         }
        //         else {

        //             if (i < 3)//左3张
        //             {
        //                 let posx = cards["pos"]["pos1"].x - (20 - i * 40);
        //                 let pos = new cc.Vec2(posx, cards["pos"][path].y);

        //                 movePos = pos;
        //             }
        //             else {
        //                 let posx = cards["pos"]["pos1"].x + (20 + i * 40);
        //                 let pos = new cc.Vec2(posx, cards["pos"][path].y);
        //                 movePos = pos;
        //             }
        //         }

        //         cards[cardpath].node.stopAllActions();
        //         cards[cardpath].node.runAction(cc.sequence(
        //             cc.moveTo(0.2, mindlePos),
        //             cc.callFunc(() => {

        //                 if (i == 2) {//最后一张
        //                     self.setCardsSprite(index, cbCardData, selectCard);
        //                     self.setSpineCardType(index, cardtype);
        //                 }
        //             }),
        //             cc.moveTo(0.4, movePos)

        //         ));


        //     }
        //     return;
        // }

        // for (let i = 0; i < CARD_COUNT; i++) {
        //     let cardpath = "card" + i.toString();

        //     var movePos = new cc.Vec2(0, 0);
        //     let path = "pos" + i.toString();

        //     if (cardtype > 10 || cardtype == 0)//特殊牛 不知道怎么摆
        //     { //先按原来的位置摆
        //         // let posx = cards["pos"][path].x - offest;
        //         let pos = new cc.Vec2(cards["pos"][path].x, cards["pos"][path].y);
        //         movePos = pos;
        //     }
        //     else {

        //         if (i < 3)//左3张
        //         {
        //             // let posx = cards["pos"][path].x - offest;

        //             let posx = cards["pos"]["pos1"].x - (10 - i * 20) - offest;
        //             let pos = new cc.Vec2(posx, cards["pos"][path].y);

        //             movePos = pos;
        //         }
        //         else {
        //             // let posx = cards["pos"][path].x + offest;

        //             let posx = cards["pos"]["pos1"].x + (10 + i * 20) - offest;
        //             let pos = new cc.Vec2(posx, cards["pos"][path].y);
        //             movePos = pos;
        //         }
        //     }

        //     cards[cardpath].node.opacity = 255
        //     cards[cardpath].node.stopAllActions();
        //     cards[cardpath].node.runAction(cc.sequence(
        //         cc.moveTo(0.2, mindlePos),
        //         cc.callFunc(() => {

        //             if (i == 2) {//最后一张
        //                 self.setCardsSprite(index, cbCardData, selectCard);
        //                 // self.setWanChengActive(index, false);
        //                 // self.setDragonBonesCardType(index, cardtype);
        //                 self.setSpineCardType(index, cardtype);
        //             }
        //         }),
        //         cc.moveTo(0.4, movePos)

        //     ));


        // }
        // this.setWanChengActive(index, false);
        // this.setCardsSprite(index, cbCardData);
        // this.setSpineCardType(index, cardtype);


        var cards = this._cardsList[index.toString()];
        var mindlePos = cards["pos"]["pos2"];

        var self = this;

        // AppGame.ins.qzjhModel.sortCardList(cbCardData,cbCardData.length);
        UDebug.log("sort:" + JSON.stringify(cbCardData));

        var cardtype = cbCardType;
        
        // cardtype == 0 ? 1 : cardtype;

        var offest = 10;//8;

        if(index == 0){//自己
            for (let i = 0; i < CARD_COUNT; i++) {
                let cardpath = "card" + i.toString();
              
                let path = "pos" + i.toString();
                let posx = cards["pos"]["pos1"].x - (20-i*40);
                let movePos = new cc.Vec2(posx, cards["pos"][path].y);

                    
                cards[cardpath].node.stopAllActions();
                cards[cardpath].node.runAction(cc.sequence(
                    cc.moveTo(0.2, mindlePos),
                    cc.callFunc(() => {
    
                        if (i == 2) {//最后一张
                            self.setCardsSprite(index, cbCardData,selectCard);
                            self.setSpineCardType(index, cardtype);
                        }
                    }),
                    cc.moveTo(0.4, movePos)
                ));
            }
            return;
        }

        for (let i = 0; i < CARD_COUNT; i++) {
            let cardpath = "card" + i.toString();

            let path = "pos" + i.toString();


            let posx = cards["pos"]["pos1"].x - (10-i*20) - offest;
            let movePos = new cc.Vec2(posx, cards["pos"][path].y);

            cards[cardpath].node.stopAllActions();
            cards[cardpath].node.runAction(cc.sequence(
                cc.moveTo(0.2, mindlePos),
                cc.callFunc(() => {

                    if (i == 2) {//最后一张
                        self.setCardsSprite(index, cbCardData,selectCard);
                        self.setSpineCardType(index, cardtype);
                    }
                }),
                cc.moveTo(0.4, movePos)

            ));


        }
    }

}
