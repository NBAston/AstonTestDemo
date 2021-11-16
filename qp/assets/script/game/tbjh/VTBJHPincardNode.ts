import VTBJHPinCard from "./VTBJHPinCard";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import MTBJHModel from "./model/MTBJHModel";
import UTBJHHelper from "./UTBJHHelper";
import UTBJHScene from "./UTBJHScene";
import UDebug from "../../common/utility/UDebug";




const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:拼牛界面 不是继承于VBaseUI
 */
@ccclass
export default class VTBJHPinCardNode extends cc.Component {

    /**牌数组 编辑器上赋值*/
    @property([cc.Sprite])
    pincards: Array<cc.Sprite> = [];

    /**label数组显示牌值 编辑器上赋值*/
    @property([cc.Label])
    pinnums: Array<cc.Label> = [];

    /**发牌动画 终点 */
    private _endPos: Array<cc.Vec2> = [];
    /**local pincardnode节点下的局部坐标 */
    private _posy: number = -15;
    private _posx: number = 0;//-250;

    private _cardData: Array<number> = [];

    /**有牛按钮  */
    private _btn_YN: cc.Button = null;
    /**没牛按钮  */
    private _btn_MN: cc.Button = null;
    /**拼牌错误 动画  */
    private _pinpaicuowu: cc.Animation = null;
    /**挂在5张牌的脚本 数组 */
    private _pingcardsCom: Array<VTBJHPinCard> = [];

    /**5张牌 事件 防止出问题 not use*/
    // private _cardsEvent: Array<any> = [];

    private _eventList = new Array();

    /**拼牌结果 */
    private _sum: number = 0;
    /**字典 
     * @param value label上的数值
     * @param index 对应的VTBJHPinCard实例索引
     */
    private pinDic = {
        '0': {
            value: 0,
            index: 5,
        }
        ,
        '1': {
            value: 0,
            index: 5,
        }
        ,
        '2': {
            value: 0,
            index: 5,
        }
    };

    //  onLoad
    start() {
        // this.init();
        // this.action();
    }

    /**初始化 */
    init(): void {
        for (let i = 0; i < this.pincards.length; i++) {
            let cardCom = this.pincards[i].getComponent(VTBJHPinCard);
            cardCom.setIndex = i;
            this._pingcardsCom.push(cardCom);

        }

        // UDebug.Log(this._pingcardsCom);


        for (let index = 0; index < this.pincards.length; index++) {
            //存储牌的终点
            const x = this.pincards[index].node.getPosition().x;
            let pos = new cc.Vec2(x, this._posy);
            this._endPos.push(pos);
            //
            this._pingcardsCom[index].setfirstLocalPos = pos;//.set(pos);// = pos.x; 

            this.pincards[index].node.setPosition(this._posx, this._posy);
        }

        this._btn_YN = UNodeHelper.getComponent(this.node, "qznn_ynbg", cc.Button);
        this._btn_MN = UNodeHelper.getComponent(this.node, "qznn_mnbg", cc.Button);

        UEventHandler.addClick(this._btn_YN.node, this.node, "VTBJHPinCardNode", "onBtnYNClick");
        UEventHandler.addClick(this._btn_MN.node, this.node, "VTBJHPinCardNode", "onBtnMNClick");

        this._pinpaicuowu = UNodeHelper.getComponent(this.node, "pinpaicuowu", cc.Animation);
        this.setPinpaicuowuActive(false);

        this._pinpaicuowu.on("finished", this.aniDoneEvent, this);

        this.node.active = false;

        // pinnums 全赋初值""
        this.resetPinNum();

        this.addEvent();

        // this._pinpaicuowu.getAnimationState("pinpaicuowu").
        // this.setCardValue([0x01,0x11,0x21,0x31,0x01]);
        // this.setCardValue([0x03,0x1D,0x2A,0x35,0x08]);

        // let callb = cc.callFunc(this.setCardValue,this,[0x03,0x1D,0x2A,0x35,0x08]);
        // this.node.runAction(cc.sequence(cc.delayTime(1),callb));
    }

    /**外部(隐藏再次显示)需调用的显示函数，因为需重置坐标 */
    show() {
        this.node.active = true;

        for (let index = 0; index < this.pincards.length; index++) {
            this.pincards[index].node.setPosition(this._posx, this._posy);
        }
        this.action();
        
        // var self = this;
        // for (let i = 0; i < this._pingcardsCom.length; i++) {
        //     let addevent = (event) => {
        //         self.labelPinEvent(self._pingcardsCom[i].cardValue);
        //     }
        //     this._cardsEvent.push(addevent);
        //     this._pingcardsCom[i].node.on(cc.Node.EventType.TOUCH_END, addevent);
        // }
    }
    hide() {

        // for (let i = 0; i < this._pingcardsCom.length; i++) {
        //     this._pingcardsCom[i].node.off(cc.Node.EventType.TOUCH_END, this._cardsEvent[i]);
        // }
        // this._cardsEvent = [];

        this.setPinCardsLock(false);
        this._sum = 0;
        this.setTotalLabel(this._sum);

        this.resetDic();
        this.resetPinNum();
        this.node.active = false;

        
    }

    addEvent() {
        //监听分发的牌
        var event1 = MTBJHModel.ins.on(UTBJHHelper.TBJH_SELF_EVENT.TBJH_PINPAI_ADD, this.addPinCardEvent, this);
        var event2 = MTBJHModel.ins.on(UTBJHHelper.TBJH_SELF_EVENT.TBJH_PINPAI_DEL, this.delPinCardEvent, this);

        // this._eventList.push(event1);
        // this._eventList.push(event2);
    }
    removeEvent() {

        // var length = this._eventList.length;
        // for (let index = 0; index < length; index++) {
        //     // MTBJHModel.ins.off(this._eventList.pop());
        // }

        MTBJHModel.ins.off(UTBJHHelper.TBJH_SELF_EVENT.TBJH_PINPAI_ADD, this.addPinCardEvent, this);
        MTBJHModel.ins.off(UTBJHHelper.TBJH_SELF_EVENT.TBJH_PINPAI_DEL, this.delPinCardEvent, this);
    }

    onDestroy() {
        this.removeEvent();
    }

    /**显示牌动画执行完的回调(有用) not use*/
    turnPoker(obj) {
        // UDebug.log(obj.name);
    }

    /**外部传值
     * @param arr 牌值数组
     */
    setCardValue(arr: Array<number>) {

        for (let i = 0; i < arr.length; i++) {
            const element = arr[i];
            var key = MTBJHModel.ins.cardValueToSpriteKey1(element);
            // UDebug.log(key);
            this.pincards[i].spriteFrame = UTBJHScene.ins.getSpriteFrame(key);

            this._pingcardsCom[i].setCardValue = element;
        }

        this._cardData = arr;
    }
    /**牌滑动动画 */
    action() {
        for (let i = 0; i < this.pincards.length; i++) {
            // const element = this.pincards[i];

            var self = this;
            let act = cc.sequence(
                cc.delayTime(i * 0.04),
                cc.moveTo(0.2, self._endPos[i]),
                cc.callFunc(self.turnPoker, self)
            );
            this.pincards[i].node.runAction(act);
        }

    }
    /**有牛按钮点击事件 */
    private onBtnYNClick(event) {

        //如果拼牌不对,也弹错误动画
        if (this.pinnums[0].string == "" ||
            this.pinnums[1].string == "" ||
            this.pinnums[2].string == "" ||

            (this._sum % 10) != 0
        ) {
            this.setPinpaicuowuActive(true);
            this._pinpaicuowu.play();
            return;
        }

        // this.testGetCardType();

        //发送开牌消息
        MTBJHModel.ins.sendOpenCard();
        // MTBJHModel.ins.emit(UTBJHHelper.TBJH_SELF_EVENT.TBJH_PINCARD_DONE);

        this.hide();
    }
    /**无牛按钮点击事件 */
    private onBtnMNClick(event) {
        var isYouNiu = MTBJHModel.ins.getOxCard(this._cardData);

        // UDebug.log(this._cardData);
        // UDebug.log(isYouNiu);

        if (isYouNiu) {
            //加判断 其实有牛才进来
            this.setPinpaicuowuActive(true);
            this._pinpaicuowu.play();
            // UDebug.log("有牛");
        }
        else {
            // UDebug.log("无牛");
            //发送事件
            MTBJHModel.ins.sendOpenCard();
            // MTBJHModel.ins.emit(UTBJHHelper.TBJH_SELF_EVENT.TBJH_PINCARD_DONE);

            this.hide();
        }
    }
    //拼牌错误动画的回调
    aniDoneEvent() {
        // UDebug.log("ani doned one");
        this.setPinpaicuowuActive(false);
    }
    /**设置拼牌错误动画激活状态
     * @param b 是否激活
     */
    setPinpaicuowuActive(b: boolean) {
        this._pinpaicuowu.node.active = b;
    }

    private getPinNum(num: number): number {
        let value = MTBJHModel.ins.getCardValue(num);
        let value1 = MTBJHModel.ins.getCardTrueValue(value);
        // UDebug.log(value1);
        return value1;
    }

    /**添加牌弹起落下事件监听 */
    addPinCardEvent(value: number, cardindex: number) {
        var trueValue = this.getPinNum(value);
        this._sum += trueValue;

        // UDebug.log("add:" + trueValue + " sum:" + this._sum);

        this.setTotalLabel(this._sum);


        // var labelIndex = 5;//从哪里开始空的索引
        for (const key in this.pinDic) {
            if (this.pinDic.hasOwnProperty(key)) {
                const element = this.pinDic[key];
                // if (element.index != 5) {

                // }

                if (element.value == 0) { //是空就
                    // labelIndex = parseInt(key);

                    element.index = cardindex;
                    element.value = trueValue;
                    break;
                }
                // UDebug.log("labelIndex:"+labelIndex);
            }
        }

        var isLock = false;
        if (this.pinDic[0].value != 0 &&
            this.pinDic[1].value != 0 &&
            this.pinDic[2].value != 0) {
            isLock = true;
        }

        if (isLock) {
            //没有空的，就锁住不让往上弹
            this.setPinCardsLock(true);
        }
        this.setPinLabel();

        // Object.keys(this.pinDic).forEach((key) => {}); //遍历删除字典
    }


    delPinCardEvent(value: number, cardindex: number) {
        let trueValue = this.getPinNum(value);
        this._sum -= trueValue;
        UDebug.log("del:" + trueValue + " sum:" + this._sum);

        this.setTotalLabel(this._sum);

        var labelIndex = 5;
        for (const k in this.pinDic) {
            if (this.pinDic.hasOwnProperty(k)) {
                const element = this.pinDic[k];
                if (element.index == cardindex) {
                    labelIndex = parseInt(k);

                    element.index = 5;
                    element.value = 0;

                    break;
                }
            }
        }

        var arr = ["0", "1", "2"];

        for (const key in this.pinDic) {
            if (this.pinDic.hasOwnProperty(key)) {
                const element = this.pinDic[key];
                //大于索引
                let aindex = parseInt(key)
                if (aindex >= labelIndex && aindex < 3) {
                    let k = (aindex + 1).toString()
                    if (this.pinDic.hasOwnProperty(k)) {
                        let element1 = this.pinDic[k];
                        element.index = element1.index;
                        element.value = element1.value;
                    }
                    else {
                        element.index = 5;
                        element.value = 0;
                    }

                }
            }
        }

        //有往下的，就打开锁
        this.setPinCardsLock(false);

        this.setPinLabel();
    }

    private setPinLabel() {
        if (this.pinDic[0].value != 0) {
            this.pinnums[0].string = this.pinDic[0].value.toString();
        }
        else {
            this.pinnums[0].string = "";
        }
        if (this.pinDic[1].value != 0) {
            this.pinnums[1].string = this.pinDic[1].value.toString();
        }
        else {
            this.pinnums[1].string = "";
        }
        if (this.pinDic[2].value != 0) {
            this.pinnums[2].string = this.pinDic[2].value.toString();
        }
        else {
            this.pinnums[2].string = "";
        }
    }

    /**拼牛置空 */
    resetPinNum(): void {
        for (let i = 0; i < this.pinnums.length; i++) {
            const element = this.pinnums[i];
            element.string = "";
        }
    }
    resetDic() {
        this.pinDic = {
            '0': {
                value: 0,
                index: 5,
            }
            ,
            '1': {
                value: 0,
                index: 5,
            }
            ,
            '2': {
                value: 0,
                index: 5,
            }
        };
    }

    private setPinCardsLock(b: boolean) {
        for (let i = 0; i < this._pingcardsCom.length; i++) {
            const element = this._pingcardsCom[i];
            element.setIsLock(b);
        }
    }
    /**
     * 设置总拼牛数
     * @param num 
     */
    private setTotalLabel(num: number) {
        if (num === 0)
            this.resetPinNum();
        else
            this.pinnums[this.pinnums.length - 1].string = num.toString();
    }
    /////////////////////////// test 代码
    // private setCardLockUp() {
    //     for (let index = 0; index < this.pincards.length; index++) {
    //         this._pingcardsCom[index].setIsLock(true);
    //     }
    // }   

    //#region 测试代码
    testGetCardType() {
        let card1 = [0x01, 0x09, 0x3D, 0x2B, 0x1A];//牛牛
        let type1 = MTBJHModel.CARDTYPE_NAME[MTBJHModel.ins.getCardType(card1, card1.length)];
        UDebug.log("牌型 :" + type1 + " 牌值" + card1);

        let card2 = [0x2C, 0x2C, 0x3D, 0x2B, 0x1D];//五花牛
        let type2 = MTBJHModel.CARDTYPE_NAME[MTBJHModel.ins.getCardType(card2, card2.length)];
        UDebug.log("牌型 :" + type2 + " 牌值" + card2);

        let card3 = [0x2B, 0x3D, 0x3D, 0x3B, 0x1A];//四花牛
        let type3 = MTBJHModel.CARDTYPE_NAME[MTBJHModel.ins.getCardType(card3, card3.length)];
        UDebug.log("牌型 :" + type3 + " 牌值" + card3);

        let card4 = [0x07, 0x1D, 0x0D, 0x3D, 0x2D];//炸弹
        let type4 = MTBJHModel.CARDTYPE_NAME[MTBJHModel.ins.getCardType(card4, card4.length)];
        UDebug.log("牌型 :" + type4 + " 牌值" + card4);

        let card5 = [0x32, 0x12, 0x11, 0x33, 0x21];//五小牛
        let type5 = MTBJHModel.CARDTYPE_NAME[MTBJHModel.ins.getCardType(card5, card5.length)];
        UDebug.log("牌型 :" + type5 + " 牌值" + card5);
    }
    //#endregion
}
