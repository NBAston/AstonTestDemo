import MTBNNModel, { TBNN_SELF_SEAT } from "./model/MTBNNModel";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import UTBNNHelper from "./UTBNNHelper";
import UDebug from "../../common/utility/UDebug";
import UTBNNScene from "./UTBNNScene";
import VTBNNPincardNode from "./VTBNNPincardNode"
import { Tbnn } from "../../common/cmd/proto";
import AppGame from "../../public/base/AppGame";



const { ccclass, property } = cc._decorator;

@ccclass
export default class VTBNNCardsNode extends cc.Component {

    private _pincardNode: VTBNNPincardNode = null;
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
    /**拼牌倒计时数 */
    private _pinpaitime: number = null;

    /**最大玩家 */
    private _maxplayer: number = 4;

    private _isShowPinpai: boolean = false;//拼牌界面要不要

    private _isReconnect: boolean = false;
    private _btn_seepai: cc.Button;

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
        this._maxplayer = MTBNNModel.ins.maxPlayer;

        this._pincardNode = UNodeHelper.getComponent(this.node, "pincardsNode", VTBNNPincardNode);

        this._btn_seepai = UNodeHelper.getComponent(this.node, "btn_seepai", cc.Button);
        UEventHandler.addClick(this._btn_seepai.node, this.node, "VTBNNCardsNode", "sendOpenCard");

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
            // let cardtypedbPath = path + "/qznnPxAni";
            // this._cardsList[i.toString()].cardtypedb = UNodeHelper.getComponent(this.node, cardtypedbPath, dragonBones.ArmatureDisplay);

            let cardtypespinePath = path + "/spine_cardtype";
            this._cardsList[i.toString()].cardtypespine = UNodeHelper.getComponent(this.node, cardtypespinePath, sp.Skeleton);

        }
        //cc.log(this._cardsList);

    }

    /**添加事件 */
    private addEvent() {
        MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_FAPAI_COMPLETE, this.showCardBackByIndex, this);

        MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SC_GAMESCENE_OPEN, this.onGameSceneOpen, this);
        MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SUB_S_OPEN_CARD_RESULT, this.onOpenCardResult, this);

        MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SUB_S_SEND_CARD, this.onSendCard, this);

        MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_RESET_SCENE, this.onResetScene, this);
        // MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_PINCARD_DONE, this.onPinCardDone, this);
        cc.game.on(cc.game.EVENT_SHOW, this.game_show, this);

        MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SCENE_OPEN_NOT_SEND_CARD, this.openNotSendCard, this);


    }
    private removeEvent() {
        MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_FAPAI_COMPLETE, this.showCardBackByIndex, this);

        MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SC_GAMESCENE_OPEN, this.onGameSceneOpen, this);
        MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SUB_S_OPEN_CARD_RESULT, this.onOpenCardResult, this);

        MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SUB_S_SEND_CARD, this.onSendCard, this);

        MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_RESET_SCENE, this.onResetScene, this);
        // MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_PINCARD_DONE, this.onPinCardDone, this);
        MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SCENE_OPEN_NOT_SEND_CARD, this.openNotSendCard, this);
        cc.game.off(cc.game.EVENT_SHOW, this.game_show, this);


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
        this._cbCardData = null
    }

    /**
     * 分数添加完成
     * @param data 
     */
    private onAddScoreResult(data: any) {
        MTBNNModel.ins.gameStatus = MTBNNModel.TBNN_GAMESTATUS.SEND;
    }
    /**
     * 开牌场景消息
     * @param data 
     */
    private onGameSceneOpen(data: any) {
        var cbIsOpenCard = data.isOpenCard;
        //已开牌不显示拼牌界面
        if (cbIsOpenCard != null) {
            if (cbIsOpenCard[MTBNNModel.ins.gMeChairId] == 1) {
                this._btn_seepai.node.active = false
                this._isReconnect = true;
            }else if(data.playStatus[MTBNNModel.ins.gMeChairId] == 1) {
                this._btn_seepai.node.active = true
            }
        }

        // UDebug.Log("isReconnect:" + this._isReconnect);
    }
    /**开牌场景 特殊处理下 不播发牌动画 */
    private openNotSendCard(data: any) {
        this._cbCardData = data;

        for (let i = 0; i < this._maxplayer; i++) {

            // this.setCardActiveByIndex(i, true);

            let player = MTBNNModel.ins.getbattleplayerbySeatId(i);
            if (player != null && player.playStatus == 1 && player.seatId >= 0 && player.seatId < 4) {
                this.showCardBackByIndex(i);
            }
        }
    }

    /**
     * 单个玩家开牌结果
     * @param data 
     */
    private onOpenCardResult(data: Tbnn.NN_CMD_S_OpenCardResult) {
        // UDebug.Log("cardsnode onOpenCardResult:" + JSON.stringify(data));

        var wOpenCardUser = data.openCardUser;
        var cbCardType = data.cardType;
        var cbCardData = data.cardData; //number[] | null
        var cbOxCardData = data.OXCardData;//number[] | null

        var chairId = MTBNNModel.ins.getUISeatId(wOpenCardUser);

        if (chairId == TBNN_SELF_SEAT) {
            // this._pincardNode.hide();

            this._btn_seepai.node.active = false;
            this.setCardActiveByIndex(0, true);
        }

        this.showCardTypeAni(chairId, cbCardData, cbCardType, cbOxCardData);

        //test//
        // this.showCardTypeAni(1, [0x01, 0x09, 0x3D, 0x2B, 0x1A]);
    }
    /**
     * 发牌
     * @param data 
     */
    private onSendCard(data: Tbnn.NN_CMD_S_SendCard) {
        if (!data) return
        var cbSendCard = data.sendCard;
        var cbOxCard = data.OXCard;
        var cbCardType = data.cardType;
        var cbOpenTime = data.openTime;

        UDebug.Log("onSendCard:" + JSON.stringify(data));

        this._cbCardData = cbSendCard;
        // this._pinpaitime = cbOpenTime;
        let player = MTBNNModel.ins.getbattleplayerbySeatId(0);
        if (player && player.playStatus == 1) {
            this._btn_seepai.node.active = true;
        }
        MTBNNModel.ins.emit(UTBNNHelper.TBNN_SELF_EVENT.TBNN_MOVE_NEXT_CMD);
    }

    private sendOpenCard() {
        UTBNNScene.ins.playClick();
        MTBNNModel.ins.sendOpenCard();
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
        for (let i = 0; i < 5; i++) {
            // const element = array[i];
            let path = "card" + i.toString();
            let key = "poker_b1";
            this._cardsList[index.toString()][path].spriteFrame = UTBNNScene.ins.getSpriteFrame(key);

            let pos_path = "pos" + i.toString();
            let pos = this._cardsList[index.toString()]["pos"][pos_path];

            this._cardsList[index.toString()][path].node.setPosition(pos);
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
    private showCardBackByIndex(index: number) {
        //#region 1显示拼牌
        // if (index == 0) {

        //     if(!this._isReconnect)//重连不用显示拼牌
        //     {
        //         this.showPincard();

        //     }else
        //     {
        //         this._isReconnect = false;
        //     }
        // }
        // else {
        //     this.showCardBack(index);
        // }
        //#endregion 

        //#region 2发牌后自己的牌显示
        if (index == 0 && this._cbCardData != null) {

            let player = MTBNNModel.ins.getbattleplayerbySeatId(0);
            if (player == null || player.playStatus != 1) {
                this._btn_seepai.node.active = false;
                return;
            }

            this.setCardActiveByIndex(index, true);

            var randCards = this._cbCardData;//不混乱也行
            //MTBNNModel.ins.randCardData(this._cbCardData,this._cbCardData.length);
            // UDebug.Log("randCards"+JSON.stringify(randCards));

            //重置位置
            for (let i = 0; i < 5; i++) {
                let path = "card" + i.toString();
                let pos_path = "pos" + i.toString();
                let pos = this._cardsList[index.toString()]["pos"][pos_path];

                this._cardsList[index.toString()][path].node.setPosition(pos);
            }

            this.setCardsSprite(index, randCards);
            this._btn_seepai.node.active = true;
            UTBNNScene.ins.getMusic.playQkp();
        }
        else {
            this.showCardBack(index);
        }
        //#endregion


        //#region 3 发牌后自己显示牌背
        // this.showCardBack(index);

        //#endregion

        //测试代码
        // if (index == 1) {
        //     var self = this;
        //     this.node.runAction(cc.sequence(
        //         cc.delayTime(1),
        //         cc.callFunc(() => {
        //             self.showCardTypeAni(index, [0x01, 0x09, 0x3D, 0x2B, 0x1A]);//1
        //         })
        //     ));
        // }

    }
    /**
     * 设置牌精灵
     * @param index 座位索引
     * @param values 牌值数组
     */
    private setCardsSprite(index: number, values: number[]): void {

        if (values.length != 5) return;

        let cards = this._cardsList[index.toString()];

        for (let i = 0; i < 5; i++) {
            let path = "card" + i.toString();

            // let posPath = "pos" + i.toString();
            // cards[path].node.setPosition(cards["pos"][posPath]);

            let key = MTBNNModel.ins.cardValueToSpriteKey1(values[i]);

            // UDebug.Log("key:"+JSON.stringify(key)+ "  index:"+index);

            cards[path].spriteFrame = UTBNNScene.ins.getSpriteFrame(key);
        }
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
        let temp = this._cardsList[index.toString()].cardtypespine;

        var aniName = null;
        // if (cardtype == 0) {
        //     aniName = "nobull";
        // }
        // else if (cardtype > 0 && cardtype < 10) {
        //     aniName = "bull" + cardtype.toString();
        // }
        // else if (cardtype == 10) {
        //     aniName = "bullbull";
        // }
        // else if (cardtype == 12) {

        //     aniName = "wuhuabull";
        // }
        // else if (cardtype == 13) {
        //     aniName = "bomb";
        // }
        // cardtype = 14;
        aniName = UTBNNHelper.CARD_TYPE2[cardtype];

        // aniName = "wuhuanull"; //测试
        // ="qznn_effect_px_" + cardtype.toString();
        if (aniName != null) {
            temp.animation = aniName;
            temp.setAnimation(0, aniName, false);
            this.setSpineActive(index, true);
        }
        // cc.log("cardtype:"+cardtype);
        UTBNNScene.ins.getMusic.playPaiXing(cardtype, MTBNNModel.ins.getPlayerSexByUISeat(index));

        MTBNNModel.ins.emit(UTBNNHelper.TBNN_SELF_EVENT.TBNN_MOVE_NEXT_CMD);
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

        // MTBNNModel.ins.sortCardList(cbCardData,cbCardData.length);
        UDebug.log("sort:" + JSON.stringify(cbCardData));

        var cardtype = 0;
        if (cbCardType != null) {
            cardtype = cbCardType;
        }
        else {
            cardtype = MTBNNModel.ins.getCardType(cbCardData, cbCardData.length);
        }

        if (cbOxCardData != null && cbOxCardData.length == 5) {
            let niuniuTemp = cbOxCardData;

            if (niuniuTemp.length == 5) {
                cbCardData = niuniuTemp;
            }
            else { //找不对,就用本地找算了
                MTBNNModel.ins.getOxCard(cbCardData);
            }

        }
        else {
            //找出牛牛牌 cbCardData 的值已排序过
            var niuniuCard = MTBNNModel.ins.getOxCard(cbCardData);
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
            UDebug.Log("cc.callFunc movePos" + JSON.stringify(movePos));

            cards[cardpath].node.stopAllActions();
            if (cardtype < 10 && cardtype > 0)//不是特殊牛
            {
                if (i == 3 || i == 4) {//最后2张
                    let posy = cards["pos"][path].y + offest;
                    let pos1 = new cc.Vec2(cards["pos"][path].x, posy);

                    UDebug.Log("cc.callFunc pos" + JSON.stringify(pos1));
                    cards[cardpath].node.runAction(cc.sequence(
                        cc.moveTo(0.2, mindlePos),
                        cc.callFunc(() => {

                            if (i == 4) {//最后一张
                                self.setCardsSprite(index, cbCardData);
                                self.setSpineCardType(index, cardtype);
                            }
                        }),
                        cc.moveTo(0.4, movePos),
                        cc.moveTo(0.2, pos1)
                    ));
                }
                else {
                    let posy = cards["pos"][path].y - offest;
                    let pos1 = new cc.Vec2(cards["pos"][path].x, posy);

                    cards[cardpath].node.runAction(cc.sequence(
                        cc.moveTo(0.2, mindlePos),
                        cc.moveTo(0.4, movePos),
                        cc.moveTo(0.2, pos1)
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
                    cc.moveTo(0.4, movePos)
                ));
            }



        }
        // return;
        // }
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

        // MTBNNModel.ins.sortCardList(cbCardData,cbCardData.length);
        UDebug.log("sort:" + JSON.stringify(cbCardData));

        var cardtype = 0;
        if (cbCardType != null) {
            cardtype = cbCardType;
        }
        else {
            cardtype = MTBNNModel.ins.getCardType(cbCardData, cbCardData.length);
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
                MTBNNModel.ins.getOxCard(cbCardData);
            }

        }
        else {
            // cc.log("before:"+cbCardData);

            //找出牛牛牌 cbCardData 的值已排序过
            var niuniuCard = MTBNNModel.ins.getOxCard(cbCardData);

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

    //切换到前台
    game_show(){
        //防止出现上局的牌，停掉当前可能没有播放完成的翻牌动画
        for (var k in this._cardsList){
            for (var j = 0; j< 5;j++){
                let cardpath = "card" + j.toString();
                var card = this._cardsList[k][cardpath]
                card.node.stopAllActions();
            }
        }
    }

}
