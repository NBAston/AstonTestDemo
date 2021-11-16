import { CardNumber, CardType } from "./PDKEnum";

const { ccclass, property } = cc._decorator;
@ccclass
export default class PokerController extends cc.Component {
    @property(cc.Node)
    m_TouchArea: cc.Node = null; // 小触摸节点

    @property(cc.Node)
    m_TouchBigArea: cc.Node = null; // 大触摸节点
    
    @property(cc.Sprite)
    m_PokerBack: cc.Sprite = null; // 牌背面

    @property(cc.Node)
    m_NormalPokerNode: cc.Node = null; // 扑克控制节点

    _m_PokerType: CardType = CardType.Error; // 牌型
    _m_PokerNumber: CardNumber = CardNumber.Error; // 牌数字

    _m_CurrentTouchArea: cc.Node = null; // 当前触摸区域
    _m_Chosed: boolean = false; 
    _b_IsPreChosen: boolean = false;
    _b_IsFirstChose: boolean = false;
    _ChosenOffSet: number = 50;
    _m_FilpSpeed: number = 0.7;
    _m_ColorGray: cc.Color = cc.color(111, 111, 111);
    _m_ColorWhite: cc.Color = cc.color(255, 255, 255);

    // 初始化扑克牌
    // initCard(cardNumber: CardNumber, cardType: CardType) {
    //     this._m_PokerType = cardType;
    //     this._m_PokerNumber = cardNumber;
    //     this.m_NormalPokerNode.active = true;
    //     let startIndex = 0;
    //     switch(this._m_PokerType)
    //     {
    //         case CardType.Spades:
    //         {
    //             startIndex = 0;
    //             var FinalIndex = startIndex +　this._m_PokerNumber;
    //             this.m_NormalPokerNode.getComponent(cc.Sprite).spriteFrame = this.m_NormalPokerNode.getComponent("USpriteFrames").getFrameIdx(FinalIndex);
    //         }
    //         break;
    //         case CardType.Heart:
    //         {
    //             startIndex = 13;
    //             var FinalIndex = startIndex +　this._m_PokerNumber;
    //             this.m_NormalPokerNode.getComponent(cc.Sprite).spriteFrame = this.m_NormalPokerNode.getComponent("USpriteFrames").getFrameIdx(FinalIndex);
    //         }
    //         break;
    //         case CardType.Club:
    //         {
    //             startIndex = 26;
    //             var FinalIndex = startIndex +　this._m_PokerNumber;
    //             this.m_NormalPokerNode.getComponent(cc.Sprite).spriteFrame = this.m_NormalPokerNode.getComponent("USpriteFrames").getFrameIdx(FinalIndex);
    //         }
    //         break;
    //         case CardType.Diamond:
    //         {
    //             startIndex = 39;
    //             var FinalIndex = startIndex +　this._m_PokerNumber;
    //             this.m_NormalPokerNode.getComponent(cc.Sprite).spriteFrame = this.m_NormalPokerNode.getComponent("USpriteFrames").getFrameIdx(FinalIndex);
    //         }
    //         break;
    //     }

    //     this.setTouchAreaToNormal();

    // }

    initCard(cardNumber: CardNumber) {
        this._m_PokerNumber = cardNumber;
        this.m_NormalPokerNode.active = true;
        this.m_NormalPokerNode.getComponent(cc.Sprite).spriteFrame = this.m_NormalPokerNode.getComponent("USpriteFrames").getFrameIdx(cardNumber);


        this.setTouchAreaToNormal();

    }

    // 展示背面
    showBack() {
        this.m_PokerBack.node.active = true;
    }

    // 正面
    showFront() {
        this.m_PokerBack.node.active = false;
        this.m_NormalPokerNode.active = true;
    }

    backToZeroAnimation() {
        this.showBack();
        this.node.scaleX = 1;
        this.node.scaleY = 1;
        var ScaleToZero  =  cc.scaleTo(this._m_FilpSpeed, 0,1.0);
        var CallBack = cc.callFunc(this.zeroToFrontAnimation.bind(this))
        var Sequence = cc.sequence(ScaleToZero,CallBack);
        this.node.runAction(Sequence);
    }

    zeroToFrontAnimation() {
        this.showFront();
        var ScaleToFull = cc.scaleTo(this._m_FilpSpeed, 1.0,1.0);
        this.node.runAction(ScaleToFull);
    }
    
    chose() {
        if(this._m_Chosed == false) {
            this.node.y = this.node.y + this._ChosenOffSet;
            this._m_Chosed = true;
        }
    }

    dechose() {
        if(this._m_Chosed == true)
        {
            this.node.y = 0;
            this._m_Chosed = false;
        }
    }

    CalculateTouch(_TouchPos: any) {
        if(this._b_IsPreChosen)
        {
            return;
        }

        var BoundingBox = this.getTouchAreaRectInWorldSpaceWithAr();
        if (BoundingBox.contains(_TouchPos))
        {
            this._b_IsFirstChose = true;
            this.preChose();
        }
    }

    preChose() {
        this._b_IsPreChosen = true;
        this.grayAll();
    }

    dePrechose() {
        this._b_IsPreChosen = false;
        this.highLightAll();
    }

    excutiveChose() {
        if(this._b_IsPreChosen) {
            if(this._m_Chosed == false) {
                this.chose();
            } else {
                this.dechose();
            }
        }
        this._b_IsPreChosen = false;
        this._b_IsFirstChose = false;
        this.highLightAll();
    }

    checkTouchMove(_StartPos,_EndPos) {
        if(this._b_IsFirstChose) {
            return;
        }
        var TouchAreaRect = this.getTouchAreaRectInWorldSpaceWithAr();
        if(cc.Intersection.lineRect(_StartPos,_EndPos, TouchAreaRect)) {
            this.preChose();
        } else {
            this.dePrechose();
        }
    }

    getTouchAreaRectInWorldSpaceWithAr() {
        var WorldPos = this._m_CurrentTouchArea.convertToWorldSpaceAR(cc.v2(0, 0));
        var Width = this._m_CurrentTouchArea.width;
        var Height = this._m_CurrentTouchArea.height;
        var BoundingBox = cc.rect(WorldPos.x-Width/2,WorldPos.y-Height/2,Width,Height);
        return BoundingBox;
    }

    setTouchAreaToNormal() {
        this._m_CurrentTouchArea = this.m_TouchArea;
    }

    setTouchAreaToBig() {
        this._m_CurrentTouchArea = this.m_TouchBigArea;
    }

    grayAll() {
        this.m_NormalPokerNode.color  =  this._m_ColorGray;
    }

    highLightAll() {
        this.m_NormalPokerNode.color  =  this._m_ColorWhite;
    }

    // 重置选择
    resetChose() {
        this.highLightAll();
        this._b_IsPreChosen = false;
        this.node.y = 0;
        this._m_Chosed = false;
        this._b_IsFirstChose = false;
    }

    // 获取牌信息
    getCardInfo() {
        var CardInfo = 
        {
            Number:this._m_PokerNumber,
            Type:this._m_PokerType,
        }
        return CardInfo;
    }

    // 销毁
    deleteSelf() {
        this.node.destroy();
    }

}
