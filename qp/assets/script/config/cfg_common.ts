import { EGameType } from "../common/base/UAllenum";


/**分转化元比率 除以*/
export let COIN_RATE = 100;

/**百人场游戏列表 */
export const BrGameList = [
    EGameType.BCBM,
    EGameType.BREBG,
    EGameType.BRNN,
    EGameType.BRHH,
    EGameType.QZLH,
    EGameType.BRJH,
    EGameType.BJL,
];

/**俱乐部排除游戏列表 */
export const ClubExcludedGameList = [
    EGameType.DZPK,
    EGameType.BJL,
    EGameType.BJ,
    EGameType.QZNN,
    EGameType.BCBM,
    EGameType.BREBG,
];

/**炸金花焖牌轮数 */
export const ZJH_MENPAI_LUNSHU = [1, 1, 2, 3]

let cfg_common = {

}

export default cfg_common;