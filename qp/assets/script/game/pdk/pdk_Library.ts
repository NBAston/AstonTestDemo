import UDebug from "../../common/utility/UDebug"

export interface IPDKConfig {
    cardCount: number
    cardTotal: number
    inarow: string
    pairTotal: any
    pairCount: number
    bewrite?: string,
    canSplit?: number[],
    biggerThanIt?: number[],
    pairCanSplit?: number[]
}
export interface IMergerSummary {
    count: number
    value: number,
    special: boolean,
    origins: number[]
}
export interface ICardConfig {
    config: ICardType,
    mainData: IMergerSummary[]
    pairData: IMergerSummary[]
}
export interface ICardType {
    cardCount: number
    cardTotal: number
    inarow: string
    pairTotal: any
    pairCount: number
    bewrite?: string,
    canSplit?: number[],
    biggerThanIt?: number[],
    pairCanSplit?: number[]
}
export const PDKCardType = {
    default: {
        // 规定牌的数量 1 : 单张 2 : 对子
        cardCount: 0,
        // 规定牌有多少张
        cardTotal: 0,
        // 连续的数量 值为 顺子"5+" 连队"3+" 飞机"2+" 等
        inarow: null,
        // 附加的牌有多少张 三带一：1 三带一对：2 四带两单：2 四带两对：4
        pairTotal: 0,
        // 附加的牌为单还是双还是3张
        pairCount: 0,
    },
    single: {
        cardCount: 1,
        cardTotal: 1,
        inarow: null,
        pairTotal: 0,
        pairCount: 0,
        bewrite: "单张",
        canSplit: [2, 3],
        biggerThanIt: [4],
        pairCanSplit: []
    },
    single_inarow: {
        cardCount: 1,
        cardTotal: 0,
        inarow: "5+",
        pairTotal: 0,
        pairCount: 0,
        bewrite: "顺子",
        canSplit: [2, 3,4],
        pairCanSplit: [],
        biggerThanIt: [4]
    },
    double: {
        cardCount: 2,
        cardTotal: 2,
        inarow: null,
        pairTotal: 0,
        pairCount: 0,
        bewrite: "对子",
        canSplit: [3, 4],
        pairCanSplit: [],
        biggerThanIt: [4]
    },
    double_inarow: {
        cardCount: 2,
        cardTotal: 0,
        inarow: "2+",
        pairTotal: 0,
        pairCount: 0,
        bewrite: "连对",
        canSplit: [3,4],
        pairCanSplit: [],
        biggerThanIt: [4]
    },
    three: {
        cardCount: 3,
        cardTotal: 3,
        inarow: null,
        pairTotal: 0,
        pairCount: 0,
        bewrite: "三张",
        canSplit: [4],
        pairCanSplit: [],
        biggerThanIt: [4]
    },
    three_inarow: {
        cardCount: 3,
        cardTotal: 0,
        inarow: "2+",
        pairCount: 0,
        pairTotal: 0,
        bewrite: "飞机",
        canSplit: [4],
        pairCanSplit: [],
        biggerThanIt: [4]
    },
    three_belt_single: {
        cardCount: 3,
        cardTotal: 3,
        inarow: null,
        pairCount: 1,
        pairTotal: 1,
        bewrite: "三带一",
        canSplit: [4],
        pairCanSplit: [2, 3],
        biggerThanIt: [4]
    },
    three_belt_two_single: {
        cardCount: 3,
        cardTotal: 3,
        inarow: null,
        pairCount: 1,
        pairTotal: 2,
        bewrite: "三带二",
        canSplit: [4],
        pairCanSplit: [2],
        biggerThanIt: [4]
    },
    three_inarow_belt_double: {
        cardCount: 3,
        cardTotal: 0,
        inarow: "2+",
        pairCount: 2,
        pairTotal: "2+",
        bewrite: "飞机带对",
        canSplit: [4],
        pairCanSplit: [3, 4],
        biggerThanIt: [4]
    },
    three_inarow_belt_single: {
        cardCount: 3,
        cardTotal: 0,
        inarow: "2+",
        pairCount: 1,
        pairTotal: "2+",
        bewrite: "飞机带单",
        canSplit: [4],
        pairCanSplit: [2, 3],
        biggerThanIt: [4]
    },
    four: {
        cardCount: 4,
        cardTotal: 4,
        inarow: null,
        pairCount: 0,
        pairTotal: 0,
        bewrite: "炸彈",
        canSplit: [],
        pairCanSplit: [],
        biggerThanIt: []
    },
    
    four_belt_one: {
        cardCount: 4,
        cardTotal: 4,
        inarow: null,
        pairCount: 1,
        pairTotal: 1,
        bewrite: "四帶一",
        canSplit: [],
        pairCanSplit: [2, 3, 4],
        biggerThanIt: [4]
    },

    four_belt_single: {
        cardCount: 4,
        cardTotal: 4,
        inarow: null,
        pairCount: 1,
        pairTotal: 2,
        bewrite: "四帶二",
        canSplit: [],
        pairCanSplit: [2, 3, 4],
        biggerThanIt: [4]
    },

    four_belt_single_single: {
        cardCount: 4,
        cardTotal: 4,
        inarow: null,
        pairCount: 2,
        pairTotal: 2,
        bewrite: "四帶一对",
        canSplit: [],
        pairCanSplit: [2, 3, 4],
        biggerThanIt: [4]
    },
    four_belt_double: {
        cardCount: 4,
        cardTotal: 4,
        inarow: null,
        pairCount: 2,
        pairTotal: 4,
        bewrite: "四帶二对",
        canSplit: [],
        pairCanSplit: [3],
        biggerThanIt: [4]
    },
    four_belt_three:{
        cardCount: 4,
        cardTotal: 4,
        inarow: null,
        pairCount: 1,
        pairTotal: 3,
        bewrite: "四帶三",
        canSplit: [],
        pairCanSplit: [2, 3, 4],
        biggerThanIt: [4]
    },
    big_boss: {
        cardCount: 1,
        cardTotal: 2,
        inarow: null,
        pairCount: 0,
        pairTotal: 0,
        bewrite: "王炸",
        canSplit: [],
        pairCanSplit: [],
        biggerThanIt: []
    }

}

enum POKER_VALUE {
	POKER_VALUE_3 = 0,
	POKER_VALUE_4 = 1,
	POKER_VALUE_5 = 2,
	POKER_VALUE_6 = 3,
	POKER_VALUE_7 = 4,
	POKER_VALUE_8 = 5,
	POKER_VALUE_9 = 6,
	POKER_VALUE_10 = 7,
	POKER_VALUE_J = 8,
	POKER_VALUE_Q = 9,
	POKER_VALUE_K = 10,
	POKER_VALUE_A = 11,
	POKER_VALUE_2 = 12,
	POKER_VALUE_Queen = 13,
	POKER_VALUE_King = 14,
};

enum CardType
{
    TYPE_NO = 0,
	TYPE_SINGLE = 1,  //单张
	TYPE_PAIR = 2, //对子
	TYPE_THREE = 3, //三张。比如 333,444 这种
	TYPE_ONE_STRAIGHT = 4, //单顺子，比如 34567
	TYPE_TWO_STRAIGHT = 5, //连对，比如 334455
	TYPE_THREE_ONE = 6, // 三带单张  比如 333J
	TYPE_THREE_TWO = 7,//三带两张	 比如 333JK
	TYPE_WING_ZERO = 8, //飞机不带 ，比如 333444555
	TYPE_WING_ONE = 9, //飞机带一个，比如 333J444Q555K
	TYPE_WING_PAIR = 10,//飞机带一对，比如 333JJ444QQ555KK
	TYPE_FOUR_ONE = 11, // 四带1个单张
	TYPE_FOUR_TWO = 12, // 四带两个单张。可以是一对，也可以是两张单牌
	TYPE_FOUR_THREE = 13,//四带三。
	TYPE_BOMB = 14, //炸弹
	TYPE_PAIR_KING = 15, //王炸
};

export default class pdk_Library  { 
    private cardConfigs: any = {}
    constructor() {
        this.cardConfigs[this.configToString(PDKCardType.single)] = PDKCardType.single
        this.cardConfigs[this.configToString(PDKCardType.single_inarow)] = PDKCardType.single_inarow
        this.cardConfigs[this.configToString(PDKCardType.double)] = PDKCardType.double
        this.cardConfigs[this.configToString(PDKCardType.double_inarow)] = PDKCardType.double_inarow
        this.cardConfigs[this.configToString(PDKCardType.three)] = PDKCardType.three
        this.cardConfigs[this.configToString(PDKCardType.three_inarow)] = PDKCardType.three_inarow
        this.cardConfigs[this.configToString(PDKCardType.three_belt_single)] = PDKCardType.three_belt_single
        this.cardConfigs[this.configToString(PDKCardType.three_belt_two_single)] = PDKCardType.three_belt_two_single
        this.cardConfigs[this.configToString(PDKCardType.three_inarow_belt_double)] = PDKCardType.three_inarow_belt_double
        this.cardConfigs[this.configToString(PDKCardType.three_inarow_belt_single)] = PDKCardType.three_inarow_belt_single
        this.cardConfigs[this.configToString(PDKCardType.four)] = PDKCardType.four
        this.cardConfigs[this.configToString(PDKCardType.four_belt_single)] = PDKCardType.four_belt_single
        this.cardConfigs[this.configToString(PDKCardType.four_belt_single_single)] = PDKCardType.four_belt_single_single
        this.cardConfigs[this.configToString(PDKCardType.four_belt_double)] = PDKCardType.four_belt_double
        this.cardConfigs[this.configToString(PDKCardType.four_belt_one)] = PDKCardType.four_belt_one
        this.cardConfigs[this.configToString(PDKCardType.four_belt_three)] = PDKCardType.four_belt_three
        this.cardConfigs[this.configToString(PDKCardType.big_boss)] = PDKCardType.big_boss
    }

    public sortFunc(p1: number, p2: number): number {
        return this.getPokerValue(p2) -this.getPokerValue(p1)
    }
    /**
     * 功能需求
     * 1 给定一组源数据 返回它的类型 （获取上家出牌类型）
     * 2 从源数据中查找一个给定的类型，并返回匹配到的所有数据 数组形式返回 （提示，滑牌提示 从自己手牌中找到多组匹配类型的牌） 
     * 
     */
    private searchHandler(cardType: ICardType, firstCard: number, cardTotal: number, myOriginCards: number[]) {
        if (!cardType) return []
        var mergers = this.mergerSummary(myOriginCards,false)
        var mainCards = []
        var pairCards = []
        var specialCard: any = null
        var lastValue = 0
        var currMainCards = [[]]
        var currMainIndex = 0
        var iBobmCount = 0

        //主牌--------------------------------------------------------------------------------
        //顺子，连对，飞机先大小排序
        if (!cardType.inarow) {
            mergers = mergers.sort((a: any, b: any) => {
                if (a.count === b.count) {
                    return a.value - b.value
                }
                return a.count - b.count
            })
        }

        mergers.forEach(ms => {
            if (ms.value > firstCard && ms.count >= cardType.cardCount) {
                // 如果手牌的长度===对方牌型要求的长度 或者 当前的牌组在牌型可分割数组内 
                if (ms.count === cardType.cardCount || cardType.canSplit.includes(ms.count)) {
                    // 如果牌型是连续的
                    if(cardType.inarow) {
                        // 过滤掉 2和大小王
                        if (ms.value < 12) {
                            if (lastValue === 0 || Math.abs(ms.value - lastValue) === 1){
                                currMainCards[currMainIndex].push(ms)
                                // UDebug.log("连续的-添加", ms)
                            }else {
                                currMainIndex++
                                currMainCards[currMainIndex] = []
                                currMainCards[currMainIndex].push(ms)
                            }
                            lastValue = ms.value
                        }
                    }else {
                        if (cardType.cardTotal > cardType.cardCount) {
                            if (!specialCard) {
                                specialCard = ms
                            }else{
                                mainCards.push({
                                    count: 2,
                                    value: 1617,
                                    special: true,
                                    origins: [specialCard.origins[0], ms.origins[0]]
                                })
                                specialCard = null
                            }
                        }else {
                            if (ms.count == 4){
                                iBobmCount++
                            }
                            mainCards.push(ms)
                        }
                    }
                }
            }
            // 特殊牌
            if (cardTotal > 0 && cardType.biggerThanIt.includes(ms.count)) {
                mainCards.push(Object.assign({ bigger: true }, ms))
            }
            // 王炸
            if (ms.special) {
                if (cardTotal > 0) {
                    if (!specialCard) {
                        specialCard = ms
                    }else {
                        mainCards.push({
                            count: 2,
                            value: 1617,
                            special: true,
                            bigger: true,
                            origins: [specialCard.origins[0], ms.origins[0]]
                        })
                        specialCard = null
                    }
                }
            }
        })

        //顺子，连对，飞机再按类型排序 
        var indexSameType = 0
        currMainCards.forEach(inarowValue => {
            var index = 0
            if (cardTotal > 0) {
                var SplitFromBobm = false
                while (inarowValue.length - index >= cardTotal) {
                    var temp = []
                    var cardCount = 0 
                    var SplitFromBobm = false
                    for (let i = index; i < inarowValue.length; i++) {
                        const curr = inarowValue[i];
                        if (curr.count == 4){
                            SplitFromBobm = true
                        }
                        cardCount = cardCount + curr.count
                        temp.push(curr)
                        if (temp.length === cardTotal) {
                            break
                        }
                    }
                    var indexBomb = mainCards.findIndex(main =>main.bigger && main.origins.length === 4)
                    //没有炸弹时
                    if (indexBomb == -1) {
                        //同类型的放前面
                        if (cardCount == cardType.cardCount * cardTotal){
                            mainCards.splice(indexSameType, 0 ,temp)
                            indexSameType++
                        }else{
                            //插入到数组的最后方
                            mainCards.push(temp)
                        }
                    }else{
                        //炸弹拆的牌放后面
                        if (SplitFromBobm){
                            mainCards.push(temp) 
                        }
                        else{
                            //同类型的放前面
                            if (cardCount == cardType.cardCount * cardTotal){
                                mainCards.splice(indexSameType, 0, temp)
                                indexSameType++
                            }else{
                                mainCards.splice(indexBomb, 0, temp)
                            }
                        }
                    }
                    index++
                }
            } else {
                if (
                    (cardType.cardCount === 1 && inarowValue.length >= 5) ||
                    (cardType.cardCount === 2 && inarowValue.length >= 3) ||
                    (cardType.cardCount === 3 && inarowValue.length >= 2)) {
                    mainCards.push(inarowValue)
                }
            }
        })

        //副牌------------------------------------------------------------------------------
        //类型优先
        mergers = mergers.sort((a: any, b: any) => {
            if (a.count === b.count) {
                return a.value - b.value
            }
            return a.count - b.count
        })
        mergers.forEach(ms => {
            if (ms.count >= 1 && ms.count <= 4) {
                var pairCount = ms.count
                for(var k = 0;k< pairCount; k++){
                    pairCards.push({
                        count: 1,
                        value: ms.value,
                        special: false,
                        origins: [ms.origins[k]]
                    })
                }
            }
        })
        
        // 王炸排到最后
        var index = mainCards.findIndex(main => main.special && main.origins.length === 2)
        if (index !== -1) {
            mainCards.push(mainCards.splice(index, 1)[0])
        }

        //普通炸弹拆出来的牌放后面
        for (var i = 0 ;i < iBobmCount; i ++){
            var index = mainCards.findIndex(main => (main.bigger == undefined &&  main.count == 4))
            if (index !== -1) {
                mainCards.push(mainCards.splice(index, 1)[0])
            }
        }
        return this.mergerCards(cardType, mainCards, pairCards)
    }

    
    private mergerCards(cardType: ICardType, mainCards: any[], pairCards: any[]) {
        var results: any[] = []
        mainCards.forEach(main => {
            var currCardGroup = []
            var mainValues = []
            var pairCount = 0 
            if (cardType.pairCount > 0 ) {
                if (!main.bigger){
                    var config = this.getMainValues(cardType, main)
                    currCardGroup = config.currCardGroup
                    mainValues = config.mainValues
                    var itemCount = 0
                    if (typeof cardType.pairTotal == 'number') { 
                        itemCount = cardType.pairTotal
                    }else{
                        itemCount = cardType.pairCount * mainValues.length
                    }
                    for (let p = 0; p < pairCards.length; p++) {
                        const pair = pairCards[p]
                        if (pairCount < itemCount ){
                            if (currCardGroup.includes(pair.origins[0])) continue 
                            currCardGroup.push(pair.origins[0])
                            pairCount++
                        }
                    }
                    if (pairCount == itemCount){
                        results.push(currCardGroup)
                    }
                }
                else{
                    results.push(main.origins)
                }
            }else {
                if (!main.bigger){
                    var config = this.getMainValues(cardType, main)
                    results.push(config.currCardGroup)
                }else{
                    results.push(main.origins)
                }
            }
        })
        return results
    }

    private getMainValues(cardType: ICardType, main: any) {
        var currCardGroup = []
        var mainValues = []
        var isBiggger = false
        if(main.origins)
        main.origins.sort((n1, n2) => n2 - n1);
        if (main instanceof Array) {
            main.forEach(subMain => {
                if (subMain.special) {
                    for (let i = 0; i < subMain.origins.length; i++) {
                        const origin = subMain.origins[i];
                        currCardGroup.push(origin)
                    }
                } else {
                    for (let i = 0; i < cardType.cardCount; i++) {
                        currCardGroup.push(subMain.origins[i])
                    }
                }
                mainValues.push(subMain.value)
            })
        }else {
            if (main.special) {
                for (let i = 0; i < main.origins.length; i++) {
                    const origin = main.origins[i];
                    currCardGroup.push(origin)
                }
            } else if (main.bigger) {
                for (let i = 0; i < main.origins.length; i++) {
                    currCardGroup.push(main.origins[i])
                }
            } else {
                for (let i = 0; i < cardType.cardCount; i++) {
                    currCardGroup.push(main.origins[i])
                }
            }
            mainValues.push(main.value)
        }
        return {
            currCardGroup,
            mainValues,
            isBiggger
        }
    }
    /**
    * 合并整理源数据 初步整理
    * @param originCards 源数据
    */

    public mergerSummary(originCards: number[],splitBomb:boolean): IMergerSummary[] {
        var result: any[] = []
        var list = []
        for (let i = 0; i < originCards.length; i++) {
            const originCard = originCards[i];
            list.push({
                origin: originCard,
                value: this.getPokerValue(originCard)
            })
        }
        list = list.sort((a: any, b: any) => a.value - b.value)
        var preNumber = -1
        for (let i = 0; i < list.length; i++) {
            const data = list[i];
            if (preNumber === data.value) {
                let item = result[result.length - 1]
                item.origins.push(data.origin)
                item.count++
            } else {
                preNumber = data.value
                var special = data.value > 12
                let item = {
                    count: 1,
                    value: data.value,
                    special: special,
                    origins: [data.origin]
                }
                result.push(item)
            }
        }
         //分割炸弹
        if (splitBomb){
            //四带二对
            var flag = false
            for(var i = 0 ;i < result.length ;i++){
                if (result[i].count == 2){
                    flag  =  true
                    break
                } 
            }
            result.forEach(item=>{
                if (item.count == 2){
                    flag = true
                } 
            })
            if (originCards.length == 8 && result.length == 3 && flag){
                var bFourPairTwo = true
            }
            //超过8张，炸弹拆成三带一
            if (originCards.length >= 8 && bFourPairTwo == undefined){
                for( var k in result ){
                    if ( result[k].count == 4 ){ 
                        const data = result[k];
                        data.count = 3
                        var outItem = data.origins.splice(3, 1)
                        let item = {
                            count: 1,
                            value: data.value,
                            special: false,
                            origins: outItem
                        }
                        result.push(item)
                    }
                }
            }
        }
        return result
    }

    /**
     * 获取牌类型
     * @param ms mergerSummary 整合后的数据   
     */
    public getCardConfig(mergers: IMergerSummary[],needChangeType:boolean = false): ICardConfig {
        var config: IPDKConfig = Object.assign({}, PDKCardType.default) 
        // 主牌
        var mainData: IMergerSummary[] = []
        // 副牌
        var pairData: IMergerSummary[] = []
        // 上一个牌
        var preNumber = 0
        // 连续
        var inarow = 0

        mergers.forEach(ms => {
            if (ms.count > config.cardCount) {
                mainData.forEach(mainValue => {
                    pairData.push(mainValue)
                    config.pairCount = mainValue.count
                    config.pairTotal += mainValue.count
                })
                mainData = []
                mainData.push(ms)
                config.cardCount = ms.count
                config.cardTotal = ms.count
                preNumber = ms.value
                inarow = 1
            } else if (ms.count === config.cardCount) {
                mainData.push(ms)
                config.cardTotal += ms.count
                if (preNumber === 0 || Math.abs(ms.value - preNumber) === 1){
                    preNumber = ms.value
                    inarow++
                }
            } else {
                pairData.push(ms)
                config.pairCount = ms.count
                config.pairTotal += ms.count
            }
        })
        //顺子
        if (config.cardCount === 1 && inarow >= 5) {
            if (config.cardTotal == inarow){
                config.inarow = '5+'
            }
        }
        //连对
        else if (config.cardCount === 2 && inarow >= 2) {
            config.inarow = '2+'
        }

        //飞机
        else if (config.cardCount === 3 && inarow >= 2) {
            if (mainData.length === config.pairTotal || mainData.length * 2 === config.pairTotal || pairData.length === 0){
                config.inarow = '2+'
                if (inarow == config.pairTotal / config.pairCount || (inarow *2 == config.pairTotal / config.pairCount) ){
                    config.pairCount = config.pairTotal / inarow
                    config.pairTotal = config.inarow
                }
                // 相同的牌
                else{
                    if (mainData.length == config.pairTotal){
                        config.pairCount = 1
                        config.pairTotal = config.inarow
                    }
                }
            }
        }
           
        //两组飞机可以带任意四张牌，可以是三带一或炸弹
        //从主牌中拆出一组三张与副凑中的单张凑成四个单张
        if ((config.cardCount === 3 && config.cardTotal >= 9 && config.pairTotal == 1)||
            (config.cardCount === 3 && config.cardTotal == 12 && config.pairTotal == 3)){ 
                config.pairCount = 2
                config.inarow = '2+'
                config.pairTotal = config.inarow
                //在主牌中找到需要分割主牌的id
                var spliceId = 0
                for (let i = 0; i < mainData.length; i++) {
                    var key = mainData[i].value
                    var index = mainData.findIndex(item => item.value == key + 1 || item.value == key -1)
                    if (index == -1){
                        spliceId = i
                        break
                    }
                }
                //换到副牌
                pairData.push(mainData[spliceId])
                //删除主牌
                mainData.splice(spliceId,1)
        }

        //飞机不带可以压飞机带一张
        if (needChangeType){
            if(config.cardCount === 3 && config.cardTotal >= 9 && config.pairTotal == 0){
                config.pairCount = 1
                config.inarow = '2+'
                config.pairTotal = config.inarow
                //在主牌中找到需要分割主牌的id
                var spliceId = 0
                for (let i = 0; i < mainData.length; i++) {
                    var key = mainData[i].value
                    var index = mainData.findIndex(item => item.value == key + 1 || item.value == key -1)
                    if (index == -1){
                        spliceId = i
                        break
                    }
                }
                //换到副牌
                pairData.push(mainData[spliceId])
                //删除主牌
                mainData.splice(spliceId,1)
            }
        }

        //过掉特殊牌
        for (let i = 0; i < mainData.length; i++) {
            const main = mainData[i]
            if (config.cardCount === 1 && config.cardTotal === 2) {
                //大小王
                if (!main.special) {
                    config = undefined
                    break
                }
            }
            if (config.inarow == '5+'|| config.inarow == '2+'){
                //连牌不带2
                if (main.value == 12){
                    config = undefined
                    break
                }
            }
        }
        
        //三带一对当三带二个单张处理
        var codeString = this.configToString(config)
        if (codeString == "3322") codeString ="3312"

        //四带一对加一个单张当四带三个单张处理
        else if (codeString == "4423") codeString ="4413"
        else if (codeString == "4433") codeString ="4413"
        else if (codeString == "4422") codeString ="4412"
     
        config = this.cardConfigs[codeString]
        return { config, mainData, pairData }
    }

    
    public getCardType(origins: number[]) {
        var mergers = this.mergerSummary(origins,true) 
        var result = this.getCardConfig(mergers)
        if  (result.config != undefined){
            var cardType = {
                type: this.stringToCode(this.configToString(result.config)),
                name:result.config.bewrite
            }
            return cardType
        }
        return undefined
    }

    /**
     * 从源数据中获取提示数据
     * @param originCards 源数据
     */
    public searchByType(cardType: ICardType, myOriginCards: number[]) {
        // 初步合并整理
        return this.searchHandler(cardType, 0, 0, myOriginCards)
    }

    public searchByCards(otherOriginCards: number[], myOriginCards: number[],needChangeType:boolean) {
        // 初步合并整理
        var mergers = this.mergerSummary(otherOriginCards,true)
        // 获取牌型配置
        var cardType = this.getCardConfig(mergers,needChangeType)

        if (!cardType.config || cardType.mainData.length === 0) return []
        return this.searchHandler(cardType.config, cardType.mainData[0].value, cardType.mainData.length, myOriginCards)
    }

    public configToString(config: IPDKConfig): string {
        if (!config) return undefined
        var str = ""
        str = str + config.cardCount
        if (config.inarow) {
            str = str + config.inarow
        } else {
            str = str + config.cardTotal
        }
        str = str + config.pairCount + config.pairTotal
        return str
    }

    //获得单张牌的大小
    public getPokerValue(num: number) {
        switch (num) {
            case 52: return 13
            case 53: return 14
            default: return num % 13
        }
    }

    //配置表转牌型码
    public stringToCode(configStr: string): number {
        switch (configStr) {
            case "1100": return CardType.TYPE_SINGLE         //单张
            case "2200": return CardType.TYPE_PAIR           //对子
            case "3300": return CardType.TYPE_THREE          //三张
            case "15+00": return CardType.TYPE_ONE_STRAIGHT  //单顺子    
            case "22+00": return CardType.TYPE_TWO_STRAIGHT   //连对      
            case "3311": return CardType.TYPE_THREE_ONE      //三带单张    
            case "3322": return CardType.TYPE_THREE_TWO    //三带一对 
            case "3312": return CardType.TYPE_THREE_TWO    //三带两个单张 
            case "32+00": return CardType.TYPE_WING_ZERO     //飞机不带   
            case "32+12+": return CardType.TYPE_WING_ONE     //飞机带单张 
            case "32+22+": return CardType.TYPE_WING_PAIR    //飞机带对子     
            case "4412": return CardType.TYPE_FOUR_TWO   //四带两个单张
            case "4422": return CardType.TYPE_FOUR_TWO   //四带一个对子
            case "4413": return CardType.TYPE_FOUR_THREE   //四带3
            case "4411": return CardType.TYPE_FOUR_ONE   //四带1
            // case "4424": return CardType.TYPE_FOUR_TWO_PAIR  //四带两对
            case "4400": return CardType.TYPE_BOMB           //炸弹
            case "1200": return CardType.TYPE_PAIR_KING      //王炸
        }
        return 0
    }

    /**
     * 从源数据中查找连续的类型，并返回匹配到的所有数据 数组形式返回
     */

     public searchArowHandler(cardCount: number, firstCard: number, myOriginCards: number[]){
        var mergers = this.mergerSummary(myOriginCards,false)
        var lastValue = firstCard
        var currMainCards = []
        var result = []

        mergers.forEach(ms => {
            if (ms.value > firstCard && ms.count >= cardCount){
                // 过滤掉 2和大小王
                if (ms.value < 12) {
                    if (Math.abs(ms.value - lastValue) === 1){
                        currMainCards.push(ms)
                    }else {
                        return 
                    }
                    lastValue = ms.value
                }
            }
        })
        
        //顺子
        if (cardCount == 1){
            for(var i=0; i<currMainCards.length;i++){
                //小于三张
                if (i < 3){
                    result.push(currMainCards[i].origins[0])
                }else{
                    //超过三张后，查找连续的单张
                    if (currMainCards[i].count == 1){
                        result.push(currMainCards[i].origins[0])
                    }else{
                        break
                    }
                }
            }
        }

        return result
    }
}
