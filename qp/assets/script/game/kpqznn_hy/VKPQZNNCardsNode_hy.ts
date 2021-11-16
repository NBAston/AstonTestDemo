// import VKPQZNNPincardNode from "./VKPQZNNPincardNode";
import MKPQZNNModel_hy, { QZNN_SELF_SEAT } from "./model/MKPQZNNModel_hy";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import UKPQZNNHelper_hy from "./UKPQZNNHelper_hy";
import UDebug from "../../common/utility/UDebug";
import UKPQZNNScene_hy from "./UKPQZNNScene_hy";
import UHandler from "../../common/utility/UHandler";
import { off } from "process";
import AppGame from "../../public/base/AppGame";
import { ECommonUI } from "../../common/base/UAllenum";
import AppStatus from "../../public/base/AppStatus";



const { ccclass, property } = cc._decorator;

@ccclass
export default class VKPQZNNCardsNode_hy extends cc.Component {

    // private _pincardNode: VKPQZNNPincardNode = null;
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
            cardtypespine: null,
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
            cardtypespine: null,
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
            cardtypespine: null,
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
            cardtypespine: null,
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

    private _cbShowCardsData: number[][] = [];

    /**拼牌倒计时数 */
    private _pinpaitime: number = null;

    /**最大玩家 */
    private _maxplayer: number = 4;

    private _isShowPinpai: boolean = false;//拼牌界面要不要

    private _isReconnect: boolean = false;
    /**开牌按钮 */
    private _btn_seepai: cc.Button;

    start() {

        this.init();
        this.addEvent();

        //全部隐藏手牌 动画隐藏
        for (let i = 0; i < this._maxplayer; i++) {
            this.setCardActiveByIndex(i, false);
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
        this._maxplayer = MKPQZNNModel_hy.ins.maxPlayer;

        // this._pincardNode = UNodeHelper.getComponent(this.node, "pincardsNode", VKPQZNNPincardNode);

        this._btn_seepai = UNodeHelper.getComponent(this.node, "btn_seepai", cc.Button);
        UEventHandler.addClick(this._btn_seepai.node, this.node, "VKPQZNNCardsNode_hy", "sendOpenCard");

        for (let i = 0; i < this._maxplayer; i++) {
            var path = "cards" + i.toString();

            this._cardsList[i.toString()].node = UNodeHelper.find(this.node, path);

            // let wcPath = path + "/nn_wancheng";
            // this._cardsList[i.toString()].done = UNodeHelper.find(this.node, wcPath);

            for (let j = 0; j < 5; j++) {
                let jpath = path + "/card" + j.toString();
                let tPath = "card" + j.toString();

                let posPath = "pos" + j.toString();

                this._cardsList[i.toString()][tPath] = UNodeHelper.getComponent(this.node, jpath, cc.Sprite);

                this._cardsList[i.toString()]["pos"][posPath] = this._cardsList[i.toString()][tPath].node.getPosition();
            }
            let cardtypespinePath = path + "/spine_cardtype";
            this._cardsList[i.toString()].cardtypespine = UNodeHelper.getComponent(this.node, cardtypespinePath, sp.Skeleton);

        }

    }

    /**添加事件 */
    private addEvent() {
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_FAPAI_COMPLETE, this.showCardBackByIndex, this);
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_EVENT.QZNN_GAMESCENE_SCORE, this.onGameSceneScore, this);
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_OPEN, this.onGameSceneOpen, this);
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_END, this.onGameSceneEnd, this);


        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, this.onGameStart, this);

        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_OPEN_CARD_RESULT, this.onOpenCardResult, this);

        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_SEND_CARD, this.onSendCard, this);

        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_RESET_SCENE, this.onResetScene, this);
        // MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_PINCARD_DONE, this.onPinCardDone, this);

        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SCENE_OPEN_NOT_SEND_CARD, this.openNotSendCard, this);

        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
    }
    private removeEvent() {
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_FAPAI_COMPLETE, this.showCardBackByIndex, this);
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_EVENT.QZNN_GAMESCENE_SCORE, this.onGameSceneScore, this);
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_OPEN, this.onGameSceneOpen, this);
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_END, this.onGameSceneEnd, this);

        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_OPEN_CARD_RESULT, this.onOpenCardResult, this);

        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_SEND_CARD, this.onSendCard, this);

        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_RESET_SCENE, this.onResetScene, this);
        // MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_PINCARD_DONE, this.onPinCardDone, this);
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SCENE_OPEN_NOT_SEND_CARD, this.openNotSendCard, this);

        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);

    }

    onGameToBack(isBack: boolean) {
        if (!isBack) {
            this.resetCardNode();
        }
    }

    resetCardNode() {
        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < 5; i++) {
                let path = "card" + i.toString();
                let pos_path = "pos" + i.toString();
                let pos = this._cardsList[j.toString()]["pos"][pos_path];
                this._cardsList[j.toString()][path].node.stopAllActions();
                this._cardsList[j.toString()][path].node.setPosition(pos);
                this._cardsList[j.toString()][path].node.setScale(1, 1);
            }
        }
    }

    // private showKaiPaiBtn() {
    //     let player = MKPQZNNModel_hy.ins.getbattleplayerbySeatId(0);
    //     if (player != null && player.playStatus == 5) {
    //         this._btn_seepai.node.active = true;
    //         this._notSendNode.active = true
    //     }
    // }

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
        this._cbShowCardsData = [];
        this._btn_seepai.node.active = false;
    }

    /**
     * 分数添加完成
     * @param data 
     */
    private onAddScoreResult(data: any) {
        MKPQZNNModel_hy.ins.gameStatus = MKPQZNNModel_hy.QZNN_GAMESTATUS.SEND;
    }

    onGameSceneScore(data: any) {
        for (let i = 0; i < this._maxplayer; i++) {
            let player = MKPQZNNModel_hy.ins.getbattleplayerbySeatId(i);
            if (player != null && (player.playStatus == 5 || player.playStatus == 6) && player.seatId >= 0 && player.seatId < 4) {
                this.setCardActiveByIndex(i, true);
                this.showCardBackByIndex(i);
            }
        }
    }

    /**
     * 开牌场景消息
     * @param data 
     */
    private onGameSceneOpen(data: any) {
        /**肯定已发全部牌了 */
        var cbIsOpenCard = data.isOpenCard;
        //已开牌不显示拼牌界面
        if (cbIsOpenCard != null) {
            if (cbIsOpenCard[MKPQZNNModel_hy.ins.gMeChairId] == 1) {
                this._isReconnect = true;
            }
        }
        this._btn_seepai.node.active = false;
        let player = MKPQZNNModel_hy.ins.getbattleplayerbySeatId(0);
        if (player && (player.playStatus == 5 || player.playStatus == 6)) {
            this._btn_seepai.node.active = false;
        }
        let cbHandcard = data.cardData;

        for (let i = 0; i < 4; i++) {
            this._cbShowCardsData[i] = [0, 0, 0, 0, 0];
        }

        let chairId = 0;
        let index = 0;
        let myChairId = MKPQZNNModel_hy.ins.gMeChairId;
        this._cbCardData = this._cbShowCardsData[myChairId];

        for (let i = 0; i < cbHandcard.length; i++) {
            if (this._cbShowCardsData[chairId] == null) {
                this._cbShowCardsData[chairId] = [0, 0, 0, 0, 0];
            }
            this._cbShowCardsData[chairId][index] = cbHandcard[i];
            index++;
            if (index == 5) {
                chairId++;
                index = 0;
            }
        }

        //用0补齐5张牌
        for (let i = 0; i < 5; i++) {
            if (!this._cbCardData[i] && this._cbCardData[i] != 0) {
                this._cbCardData.push(0);
            }
        }
        //////
        for (let i = 0; i < this._maxplayer; i++) {
            // this.setCardActiveByIndex(i, true);
            let player = MKPQZNNModel_hy.ins.getbattleplayerbySeatId(i);
            if (player != null && (player.playStatus == 5 || player.playStatus == 6) && player.seatId >= 0 && player.seatId < 4) {
                this.showCardBackByIndex(i, cbIsOpenCard);
            }
        }


        if((player.playStatus == 5 || player.playStatus == 6) && !cbIsOpenCard[MKPQZNNModel_hy.ins.gMeChairId]) {
            let param = {
                pokerData: this._cbCardData[4],
                autoCloseTime: data.timeLeave,
                openCardFunc: this.playFanPai.bind(this),
            }
            AppGame.ins.showUI(ECommonUI.UI_GAME_MIPAI, param);
        }
    }

    onGameSceneEnd(data: any) {

    }

    /**开牌场景 特殊处理下 不播发牌动画 */
    private openNotSendCard(data: any) {
        let cbHandcard = data;
        let maxLen = cbHandcard.length == 5 ? 5 : 4;
        for (let i = 0; i < 4; i++) {
            this._cbShowCardsData[i] = [0, 0, 0, 0, 0];
        }

        let chairId = 0;
        let index = 0;
        for (let i = 0; i < cbHandcard.length; i++) {
            if (this._cbShowCardsData[chairId] == null) {
                this._cbShowCardsData[chairId] = [0, 0, 0, 0, 0];
            }
            this._cbShowCardsData[chairId][index] = cbHandcard[i];
            index++;
            if (index == maxLen) {
                chairId++;
                index = 0;
            }
        }

        let myChairId = MKPQZNNModel_hy.ins.gMeChairId;
        this._cbCardData = this._cbShowCardsData[myChairId];

        //用0补齐5张牌
        for (let i = 0; i < 5; i++) {
            if (!this._cbCardData[i] && this._cbCardData[i] != 0) {
                this._cbCardData.push(0);
            }
        }
        //////
        for (let i = 0; i < this._maxplayer; i++) {
            // this.setCardActiveByIndex(i, true);
            let player = MKPQZNNModel_hy.ins.getbattleplayerbySeatId(i);
            if (player != null && (player.playStatus == 5 || player.playStatus == 6) && player.seatId >= 0 && player.seatId < 4) {
                this.showCardBackByIndex(i);
            }
        }
    }

    /**
     * 单个玩家开牌结果
     * @param data 
     */
    private onOpenCardResult(data: any) {
        // UDebug.Log("cardsnode onOpenCardResult:" + JSON.stringify(data));

        var wOpenCardUser = data.openCardUser;
        var cbCardType = data.cardType;
        var cbCardData = data.cardData; //number[] | null
        var cbOxCardData = data.OxCardData;//number[] | null

        var chairId = MKPQZNNModel_hy.ins.getUISeatId(wOpenCardUser);

        if (chairId == QZNN_SELF_SEAT) {
            // this._pincardNode.hide();

            this._btn_seepai.node.active = false;
            this.setCardActiveByIndex(0, true);
        }


        this.showCardTypeAni1(chairId, cbCardData, cbCardType, cbOxCardData);


        //test//
        // this.showCardTypeAni(1, [0x01, 0x09, 0x3D, 0x2B, 0x1A]);
    }

    private onGameStart(data: any) {
        let cbHandcard = data.showCards;

        for (let i = 0; i < 4; i++) {
            this._cbShowCardsData[i] = [0, 0, 0, 0, 0];
        }

        let chairId = 0;
        let index = 0;
        for (let i = 0; i < cbHandcard.length; i++) {
            if (this._cbShowCardsData[chairId] == null) {
                this._cbShowCardsData[chairId] = [0, 0, 0, 0, 0];
            }
            this._cbShowCardsData[chairId][index] = cbHandcard[i];
            index++;
            if (index == 4) {
                chairId++;
                index = 0;
            }
        }

        let myChairId = MKPQZNNModel_hy.ins.gMeChairId;
        this._cbCardData = this._cbShowCardsData[myChairId];

        //用0补齐5张牌
        for (let i = 0; i < 5; i++) {
            if (!this._cbCardData[i] && this._cbCardData[i] != 0) {
                this._cbCardData.push(0);
            }
        }

        // this._cbCardData = cbHandcard;
    }


    /**
     * 发牌
     * @param data 
     */
    private onSendCard(data: any) {
        var cbSendCard = data.sendCard;
        var cbOxCard = data.OXCard;
        var cbCardType = data.cardType;
        var cbOpenTime = data.openTime;

        // UDebug.Log("onSendCard:" + JSON.stringify(data));

        this._cbCardData = cbSendCard;
        // this._pinpaitime = cbOpenTime;
        // this.playFanPai();
        let param = {
            pokerData: this._cbCardData[4],
            autoCloseTime: cbOpenTime,
            openCardFunc: this.playFanPai.bind(this),
        }
        AppGame.ins.showUI(ECommonUI.UI_GAME_MIPAI, param);
    }


    /**自己的最后一张手牌 翻开 */
    private playFanPai() {
        this.resetTransform();
        let self = this;

        let player = MKPQZNNModel_hy.ins.getbattleplayerbySeatId(0);
        if (player == null || (player.playStatus != 5 && player.playStatus != 6)) {
            return;
        }

        this._btn_seepai.node.active = false; // 显示开牌按钮

        this._cardsList["0"].card4.node.runAction(cc.sequence(cc.scaleTo(0.2, 0, 1.2), cc.callFunc((node) => {
            let sp_card = UNodeHelper.getComponent(node, '', cc.Sprite);
            let key = "poker_" + this._cbCardData[4].toString();
            sp_card.spriteFrame = UKPQZNNScene_hy.ins.getSpriteFrame(key);
        }, this), cc.scaleTo(0.1, 1, 1)));

        setTimeout(() => {
            this._cardsList["0"].card4.node.setScale(1, 1)
            MKPQZNNModel_hy.ins.sendOpenCard();
            AppGame.ins.closeUI(ECommonUI.UI_GAME_MIPAI);
        }, 600);
    }

    /**翻开的手牌恢复原位置 */
    private resetTransform(): void {
        this._cardsList["0"].card4.node.stopAllActions();
        this._cardsList["0"].card4.node.setScale(1, 1);
        this._cardsList["0"].card4.node.setPosition(this._cardsList["0"].pos.pos4);
        // this._cardsList["0"].card4.node.setRotation(0);
        this._cardsList["0"].card4.node.angle = 0;
    }
    
    /**翻牌后action */
    private playPokerAction(poker: cc.Node, handler?: UHandler): void {
        poker.setScale(1.2, 1.1);
        let action = cc.sequence(cc.scaleTo(0.2, 1), cc.callFunc(() => {
            if (handler) handler.run();
        }, this));
        poker.runAction(action);
    }

    /**发送开牌消息 */
    private sendOpenCard() {
        UKPQZNNScene_hy.ins.playClick();
        MKPQZNNModel_hy.ins.sendOpenCard();
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
        this.resetCardNode();
        this.setCardActiveByIndex(index, true);

        //设置卡背
        for (let i = 0; i < 5; i++) {
            // const element = array[i];
            let path = "card" + i.toString();
            let key = "poker_b1";
            this._cardsList[index.toString()][path].spriteFrame = UKPQZNNScene_hy.ins.getSpriteFrame(key);

            let pos_path = "pos" + i.toString();
            let pos = this._cardsList[index.toString()]["pos"][pos_path];

            this._cardsList[index.toString()][path].node.setPosition(pos);
            this._cardsList[index.toString()][path].node.setScale(1, 1);
        }
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
    private showCardBackByIndex(index: number, isOpenCard: any = null) {
        //#region发牌后自己的牌显示
        if (index == 0 && this._cbCardData != null) {
            if (this._cbCardData[0] == 0 && this._cbCardData[1] == 0 && this._cbCardData[2] == 0) {
                return;
            }

            if (this._cbCardData[1] == 0 && this._cbCardData[2] == 0 && this._cbCardData[3] == 0 && this._cbCardData[4] == 0) {
                return;
            }
            this.setCardActiveByIndex(index, true);

            let randCards = [];
            this._cbCardData.forEach(num => {
                randCards.push(num);
            });
            //MKPQZNNModel_hy.ins.randCardData(this._cbCardData,this._cbCardData.length);
            UDebug.Log("******randCards-------------" + JSON.stringify(randCards));
            if (isOpenCard && !isOpenCard[MKPQZNNModel_hy.ins.gMeChairId]) {
                UDebug.Log('置0')
                randCards[4] = 0;
            }
            //重置位置
            for (let i = 0; i < 5; i++) {
                let path = "card" + i.toString();
                let pos_path = "pos" + i.toString();
                let pos = this._cardsList[index.toString()]["pos"][pos_path];

                this._cardsList[index.toString()][path].node.setPosition(pos);
            }

            this.setCardsSprite(index, randCards);
        }
        else {//其他玩家
            this.showCardBack(index);
            let chairId = MKPQZNNModel_hy.ins.getUIChairId(index);
            this.setCardsSprite(index, this._cbShowCardsData[chairId]);
        }
        //#endregion



        // if (index == 0) {
        //显示抢庄按钮
        // MKPQZNNModel_hy.ins.emit(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_START_ANI_COMPLETE);
        // }
    }
    /**
     * 设置牌精灵
     * @param index 座位索引
     * @param values 牌值数组
     */
    private setCardsSprite(index: number, values: number[]): void {

        if (!values || values.length != 5) return;

        let cards = this._cardsList[index.toString()];

        for (let i = 0; i < 5; i++) {
            let path = "card" + i.toString();

            let key = MKPQZNNModel_hy.ins.cardValueToSpriteKey1(values[i]);
            if (values[i] == 0) {//无牌值
                key = "poker_b1";
            }

            cards[path].spriteFrame = UKPQZNNScene_hy.ins.getSpriteFrame(key);

        }
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
        let temp = this._cardsList[index.toString()].cardtypespine;

        var aniName = null;

        aniName = UKPQZNNHelper_hy.CARD_TYPE2[cardtype];

        if (aniName != null) {
            temp.animation = aniName;
            temp.setAnimation(0, aniName, false);
            this.setSpineActive(index, true);
        }
        // cc.log("cardtype:"+cardtype);
        UKPQZNNScene_hy.ins.getMusic.playPaiXing(cardtype, MKPQZNNModel_hy.ins.getPlayerSexByUISeat(index));

        MKPQZNNModel_hy.ins.emit(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_MOVE_NEXT_CMD);
    }

    /**
     * 按产品要求改的动画
     * @param index 
     * @param cbCardData 
     * @param cbCardType 
     * @param cbOxCardData 
     */
    showCardTypeAni1(index: number, cbCardData: number[], cbCardType?: number, cbOxCardData?: number[]) {
        //步骤分解 1:4张牌往中间牌移动 2:赋牌值,且找出牛牛牌
        //3:普通牌型：3张牛牛牌移动到偏下,2张偏上
        //特殊牌型反转即可
        var cards = this._cardsList[index.toString()];
        var mindlePos = cards["pos"]["pos2"];

        var self = this;

        // MKPQZNNModel_hy.ins.sortCardList(cbCardData,cbCardData.length);
        // UDebug.log("sort:" + JSON.stringify(cbCardData));

        var cardtype = 0;
        if (cbCardType != null) {
            cardtype = cbCardType;
        }
        else {
            cardtype = MKPQZNNModel_hy.ins.getCardType(cbCardData, cbCardData.length);
        }

        if (cbOxCardData != null && cbOxCardData.length == 5) {
            let niuniuTemp = cbOxCardData;

            if (niuniuTemp.length == 5) {
                cbCardData = niuniuTemp;
            }
            else { //找不对,就用本地找算了
                MKPQZNNModel_hy.ins.getOxCard(cbCardData);
            }

        }
        else {
            //找出牛牛牌 cbCardData 的值已排序过
            var niuniuCard = MKPQZNNModel_hy.ins.getOxCard(cbCardData);
            // cc.log("牛牛" + niuniuCard);
            // cc.log("after:"+cbCardData);
        }

        var offest = 10;//8;

        // if (index == 0) {//自己
        for (let i = 0; i < 5; i++) {
            let cardpath = "card" + i.toString();
            var movePos = new cc.Vec2(0, 0);
            let path = "pos" + i.toString();

            let pos = new cc.Vec2(cards["pos"][path].x, cards["pos"][path].y);
            movePos = pos;
            // UDebug.Log("cc.callFunc movePos" + JSON.stringify(movePos));

            cards[cardpath].node.stopAllActions();
            if (cardtype < 10 && cardtype > 0)//不是特殊牛
            {
                if (i == 3 || i == 4) {//最后2张
                    let posy = cards["pos"][path].y + offest;
                    let pos1 = new cc.Vec2(cards["pos"][path].x, posy);

                    // UDebug.Log("cc.callFunc pos" + JSON.stringify(pos1));
                    cards[cardpath].node.runAction(cc.sequence(
                        cc.moveTo(0.2, mindlePos),
                        cc.callFunc(() => {

                            if (i == 4) {//最后一张
                                self.setCardsSprite(index, cbCardData);
                                self.setSpineCardType(index, cardtype);
                            }
                        }),
                        cc.moveTo(0.4, movePos),
                        cc.moveTo(0.2, pos1),
                        cc.scaleTo(0.1, 1, 1)
                    ));
                }
                else {
                    let posy = cards["pos"][path].y - offest;
                    let pos1 = new cc.Vec2(cards["pos"][path].x, posy);

                    cards[cardpath].node.runAction(cc.sequence(
                        cc.moveTo(0.2, mindlePos),
                        cc.moveTo(0.4, movePos),
                        cc.moveTo(0.2, pos1),
                        cc.scaleTo(0.1, 1, 1)
                    ));
                }
            } else {
                cards[cardpath].node.runAction(cc.sequence(
                    cc.moveTo(0.2, mindlePos),
                    cc.callFunc(() => {

                        if (i == 4) {//最后一张
                            self.setCardsSprite(index, cbCardData);
                            self.setSpineCardType(index, cardtype);
                        }
                    }),
                    cc.moveTo(0.4, movePos),
                    cc.scaleTo(0.1, 1, 1)
                ));
            }
        }
    }

    /**
     * 显示整体牌型动画
     * @param index 座位索引
     * @param cbCardData 牌值数组
     */
    showCardTypeAni(index: number, cbCardData: number[], cbCardType?: number, cbOxCardData?: number[]) {
        //步骤分解 1:4张牌往中间牌移动 2:赋牌值,且找出牛牛牌
        //3:普通牌型：3张牛牛牌移动到偏左,2张偏右
        //特殊牌型反转即可
        var cards = this._cardsList[index.toString()];
        var mindlePos = cards["pos"]["pos2"];

        var self = this;

        // MKPQZNNModel_hy.ins.sortCardList(cbCardData,cbCardData.length);
        // UDebug.log("sort:" + JSON.stringify(cbCardData));

        var cardtype = 0;
        if (cbCardType != null) {
            cardtype = cbCardType;
        }
        else {
            cardtype = MKPQZNNModel_hy.ins.getCardType(cbCardData, cbCardData.length);
        }

        // cc.log("cardtype:" + cardtype);

        if (cbOxCardData != null && cbOxCardData.length == 5) {
            let niuniuTemp = cbOxCardData;

            // for (let j = 0; j < 5; j++) {
            //     for (let k = 0; k < 3; k++) {
            //         if (cbCardData[j] != cbOxCardData[k]) {
            //             niuniuTemp.push(cbCardData[j]);
            //             break;
            //         }
            //     }
            // }
            if (niuniuTemp.length == 5) {
                cbCardData = niuniuTemp;
            }
            else { //找不对,就用本地找算了
                MKPQZNNModel_hy.ins.getOxCard(cbCardData);
            }

        }
        else {
            // cc.log("before:"+cbCardData);

            //找出牛牛牌 cbCardData 的值已排序过
            var niuniuCard = MKPQZNNModel_hy.ins.getOxCard(cbCardData);

            // cc.log("牛牛" + niuniuCard);
            // cc.log("after:"+cbCardData);
        }




        var offest = 10;//8;

        if (index == 0) {//自己
            for (let i = 0; i < 5; i++) {
                let cardpath = "card" + i.toString();
                var movePos = new cc.Vec2(0, 0);
                let path = "pos" + i.toString();

                if (cardtype > 10 || cardtype == 0)//特殊牛 不知道怎么摆
                { //先按原来的位置摆
                    let pos = new cc.Vec2(cards["pos"][path].x, cards["pos"][path].y);
                    movePos = pos;
                }
                else {

                    if (i < 3)//左3张
                    {
                        let posx = cards["pos"]["pos1"].x - (20 - i * 40);
                        let pos = new cc.Vec2(posx, cards["pos"][path].y);

                        movePos = pos;
                    }
                    else {
                        let posx = cards["pos"]["pos1"].x + (20 + i * 40);
                        let pos = new cc.Vec2(posx, cards["pos"][path].y);
                        movePos = pos;
                    }
                }

                cards[cardpath].node.stopAllActions();
                cards[cardpath].node.runAction(cc.sequence(
                    cc.moveTo(0.2, mindlePos),
                    cc.callFunc(() => {

                        if (i == 4) {//最后一张
                            self.setCardsSprite(index, cbCardData);
                            self.setSpineCardType(index, cardtype);
                        }
                    }),
                    cc.moveTo(0.4, movePos)

                ));


            }
            return;
        }

        for (let i = 0; i < 5; i++) {
            let cardpath = "card" + i.toString();

            var movePos = new cc.Vec2(0, 0);
            let path = "pos" + i.toString();

            if (cardtype > 10 || cardtype == 0)//特殊牛 不知道怎么摆
            { //先按原来的位置摆
                // let posx = cards["pos"][path].x - offest;
                let pos = new cc.Vec2(cards["pos"][path].x, cards["pos"][path].y);
                movePos = pos;
            }
            else {

                if (i < 3)//左3张
                {
                    // let posx = cards["pos"][path].x - offest;

                    let posx = cards["pos"]["pos1"].x - (10 - i * 20) - offest;
                    let pos = new cc.Vec2(posx, cards["pos"][path].y);

                    movePos = pos;
                }
                else {
                    // let posx = cards["pos"][path].x + offest;

                    let posx = cards["pos"]["pos1"].x + (10 + i * 20) - offest;
                    let pos = new cc.Vec2(posx, cards["pos"][path].y);
                    movePos = pos;
                }
            }

            cards[cardpath].node.stopAllActions();
            cards[cardpath].node.runAction(cc.sequence(
                cc.moveTo(0.2, mindlePos),
                cc.callFunc(() => {

                    if (i == 4) {//最后一张
                        self.setCardsSprite(index, cbCardData);
                        // self.setWanChengActive(index, false);
                        // self.setDragonBonesCardType(index, cardtype);
                        self.setSpineCardType(index, cardtype);
                    }
                }),
                cc.moveTo(0.4, movePos)

            ));


        }
        // this.setWanChengActive(index, false);
        // this.setCardsSprite(index, cbCardData);
        // this.setSpineCardType(index, cardtype);
    }

}
