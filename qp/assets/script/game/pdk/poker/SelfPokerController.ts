import { CardNumber, CardType } from "./PDKEnum";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SelfPokerController extends cc.Component {
    @property(cc.Node)
    _m_Pokers: cc.Node = null; 

    @property(cc.Prefab)
    m_PokerPrefab: cc.Prefab = null;


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
    onLoad() {
       for (let index = 0; index < 16; index++) {
        //    const element = array[index];
        var TempPoker = cc.instantiate(this.m_PokerPrefab);
        TempPoker.getComponent("PokerController").initCard(2);
        TempPoker.getComponent("PokerController").showFront();
        this.node.addChild(TempPoker);
           
       }
    }

}
