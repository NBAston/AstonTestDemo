/**
 * 创建：jerry
 * 作用：存放跑得快使用的枚举
 */

import UDebug from "../../../common/utility/UDebug";

//  /**
//   * 牌类型枚举
//   */
// export enum CardType {
//     Error = -1, // 没有
//     Spades = 0,  //黑桃
//     Heart = 1,    //红桃
//     Club = 2,     //梅花
//     Diamond = 3,  //方片
// }

export class PDKCardDataUtil {


    // 获取牌点数字符串
    static getCardNumStr(value: number): string {
        let numValue = value % 13;
        return this.getNumberString(numValue);
    }

    /**打印一张牌 */
    static logOneCard(value: number) {
        let type = Math.floor(value / 13);
        let number1 = value % 13;
        let TypeString = "";
        let NumberString = ""
        switch(type) { /**0- 12  方片3 4 5 6 7 8 9 10 11 12 13 1 2 -方片2*/
            case 0:
                {
                    TypeString = "方片";
                    NumberString = this.getNumberString(number1);
                }
            break;
            case 1:
                {
                    TypeString = "梅花";
                    NumberString = this.getNumberString(number1);
                }
            break;
            case 2:
                {
                    TypeString = "红桃";
                    NumberString = this.getNumberString(number1);
                }
            break;
            case 3:
            {
                TypeString = "黑桃";
                NumberString = this.getNumberString(number1);
            }
            break;
            default:
                {
                    UDebug.Log("牌类型错误------");
                }
            break;
        }
        UDebug.Log("================="+TypeString + ":" + NumberString);
    }

    static getNumberString(value: number): string {
        let NumberString = "";
        if(value == 11) {
            NumberString = "A";
        } else if(value == 12) {
            NumberString = "2";
        } else if(value == 10){
            NumberString = "K";
        } else if(value == 9) {
            NumberString = "Q"
        } else if(value == 8) {
            NumberString = "J"
        } else {
            NumberString = (value + 3) +""
        }

        return NumberString;
    }

}

/**聊天消息内容类型 */
export enum ChatMsgType {
    PDK_CHAT_TYPE_TEXT = 1, // 文本
    PDK_CHAT_TYPE_EMOJ = 2, // 图片表情
}

/**聊天接收座位id类型 */
export enum ReceiveChairidType {
    PDK_CHAT_RECEIVE_CHAIRID_0 = 0, // chariid = 0 玩家
    PDK_CHAT_RECEIVE_CHAIRID_1 = 1, // chariid = 1 玩家
    PDK_CHAT_RECEIVE_CHAIRID_2 = 2, // chariid = 2 玩家
    PDK_CHAT_RECEIVE_CHAIRID_ALL = -1 , // chariid = -1 所有玩家
}

export enum CardType {
    PDKTYPE_NO = 0,
	PDKTYPE_SINGLE = 1,//单张
	PDKTYPE_PAIR = 2,  //对子
	PDKTYPE_THREE = 3, //三张。比如 333,444 这种
	PDKTYPE_ONE_STRAIGHT = 4, //单顺子，比如 34567
	PDKTYPE_TWO_STRAIGHT = 5, //连对，比如 3344、334455
	PDKTYPE_THREE_ONE = 6, // 三带单张  比如 333J
	PDKTYPE_THREE_TWO = 7, //三带两张	 比如 333JJ
	PDKTYPE_WING_ZERO = 8,//飞机不带 ，比如 JJJQQQKKK
	PDKTYPE_WING_ONE = 9,//飞机带一个，比如 JJJ3KKK4KKK5
	PDKTYPE_WING_TWO = 10,//飞机带两个，比如 JJJ34KKK67KKK89
	PDKTYPE_FOUR_ONE = 11,//四带一
	PDKTYPE_FOUR_TWO = 12,//四带二
	PDKTYPE_FOUR_THREE = 13,//四带三	
	PDKTYPE_BOMB = 14, //炸弹
	PDKTYPE_END,					
}

export enum CardsCombinationCondition {
    Single = 1, 
    Pair  = 2,
    Trible = 3,
    TribleAndSingle = 4,
    TribleAndPair = 5,
    FourAndTwo = 6,
    FourAndSingle = 5,
    ComboPair = 6,
    ComboTrible = 6,
    ComboTribleWithSingle = 8,
    ComboTribleWithPair = 10,
    Straight = 5,
    Bomb = 4,
}

/**
 * 牌点数
 */
export enum CardNumber {
    Error = -1, // 没有
    Ace = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9,
    Ten = 10,
    Jack = 11,
    Queen = 12,
    King = 13,
    SmallJoker = 14,
    BigJoker = 15,
}








