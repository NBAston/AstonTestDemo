export enum GameRst  {
    Ferrari= 1,
    Lamborghini = 2,
    Porsche = 3,
    Maserati = 4,
    Benz = 5,
    Bmw = 6,
    Audi = 7,
    Jaguar = 8
};

export enum GAME_STATUS {
    BCBM_GAME_START = 1, // 游戏开始
    BCBM_GAME_BET = 2,   // 开始下注
    BCBM_GAME_STOP = 3,       // 停止下注
    BCBM_GAME_FREE = 4,  // 开始开牌
    BCBM_GAME_START_TIPS = 5, // 开始时间快结束了
    BCBM_GAME_END = 6 // 结算时间
}

export var logoCfg = [
    [1,6,12,18,23],
    [2,8,13,19,25],
    [4,9,15,20,26],
    [5,11,16,22,27],
    [0,14],
    [3,17],
    [7,21],
    [10,24],
] ;

export default {GameRst, GAME_STATUS, logoCfg};