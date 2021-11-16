import { EPokerType } from "../base/UAllenum";
import { JettonItem } from "../base/UAllClass";

/**
 * 创建:sq
 * 作用:扑克牌帮助类
 */
export default class UPokerHelper {

    /**数值掩码 */
    private static LOGIC_MASK = {
        COLOR: 240,//0xf0
        VALUE: 15  //0x0f
    };
    /**大致的牌值 */
    private static _M_CARDLISTDATA: number[] = [
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D, //方块Diamond
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D, //梅花Club
        0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D, //红桃Heart
        0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D, //黑桃Spade
        0x4E, 0x4F //鬼
    ];
    /**
     * 得到扑克花色
     * @param card 牌值
     * @returns 花色
     */
    static getCardSuit(card: number): EPokerType {
        return (card & UPokerHelper.LOGIC_MASK.COLOR) >> 4;
    }
    /**
     * 获取数值
     * @param card 牌值
     * @returns 牌的数值
     */
    static getCardValue(card: number): number {
        return card & UPokerHelper.LOGIC_MASK.VALUE;
    }
    /**
     * 获取牌对应的图片资源
     * @param card 
     */
    static getCardSpriteName(card: number): string {
        return "poker_" + card;
    }
    /**
     * 拆分筹码
     */
    static splitChip(chipValue: number, jettons: Array<number>, maxCount: number = -1): Array<JettonItem> {
        let result = new Array<JettonItem>();
        let len = jettons.length;
        for (let i = len - 1; i >= 0; i--) {
            let po = Math.floor((chipValue / jettons[i]));
            if (maxCount != -1) {
                po = po > maxCount ? maxCount : po;
            }
            if (po > 0) {
                let item = new JettonItem();
                item.count = po;
                item.jetton = jettons[i];
                chipValue = chipValue - jettons[i] * po;
                result.push(item)
            }
        }
        return result;
    }
}
