
/**-五张 */
// 牌型：同花顺＞铁支＞葫芦＞同花＞顺子＞三条＞两对＞对子＞乌龙。
// 点数：A＞K＞Q＞J＞10＞9＞8＞7＞6＞5＞4＞3＞2。
// 特殊牌型：至尊青龙＞一条龙＞十二皇族＞三同花顺＞三分天下＞全大＞全小＞凑一色＞四套三条＞五对三条＞六对半＞三顺子＞三同花。
// 乌龙：一墩牌里面都是一张张单独的牌，没牌型。获胜赢1水。
// 对子：除了两张一样点数的牌外没有其他牌型，获胜赢1水。
// 两对：两个对子加上一个单张组成的牌型。获胜赢1水。
// 三条：除了三张一样的点数的牌外没有其他牌型。获胜赢1水，摆头墩胜额外加2水。
// 顺子：点数按照顺序连续五张牌组成的牌型（特殊牌型除外）。获胜赢1水。
// 同花：花色相同的五张牌组成的牌型（特殊牌型除外）。
// 葫芦：一组三条加上一组对子组成的牌型。获胜赢1水，摆中墩胜额外+1水。
// 铁支：除了四张一样点数的牌外没有其他牌型。获胜赢4水，摆中墩胜额外+4水。

/**-三张 */
//三条 > 一对  >乌龙
const {ccclass, property} = cc._decorator;

@ccclass
export default class USSSPokeLogic  {


isTonghuashun():boolean{


    return false
}

private  gethuase(){


}
}