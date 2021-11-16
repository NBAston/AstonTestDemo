import { EGameType, EGameState, ECommonUI, ELevelType } from "../common/base/UAllenum";



export class roomInfo {
    roomId: number;
    roomName: string;
    roomType:number;
}
/**
 * 创建:gj
 * 作用:游戏类型配置
 */

export class gameitem {
    gameName:string;
    /**
     *游戏类型 
     */
    gametype: EGameType;
    /**
     * 入口图标
     */
    prefabIcon: string;
    /**
     * 是否为热推游戏
     */
    gameState: number;
    /**
     * 排序字段
     */
    sortId: number;
    /**
     * 第一个大图标游戏
     */
    isFirst: boolean;
    /**
     * 游戏对应的房间UI
     */
    roomUI: ECommonUI;
    /**
     * 游戏场景
     */
    lvType: ELevelType;

    rooms: { [key: number]: roomInfo };

    defaultRoom:number;

    abbreviateName:string;

    gameSpineRes: string;

    clubGameSpineRes: string;

    bundleName: string;

    gameUI: ECommonUI;

    //翻倍规则： 俱乐部专用
    doubleRule: string;

    //特殊规则： 俱乐部专用
    specialRules: string;

    //特殊牌型： 俱乐部专用
    specialCardType: string;

    //牌型倍数：俱乐部专用
    multiplierCardType: string;
}

var cfg_game: { [key: number]: gameitem } = { 
    [EGameType.BJL]: {  
        gameName:"百家乐",
        gametype: EGameType.BJL,
        prefabIcon: "hall_bjl",
        gameState: EGameState.New,
        sortId: 0,
        isFirst: true,
        roomUI: ECommonUI.BJL_Room, 
        lvType: ELevelType.BJL, 
        defaultRoom:9101,
        abbreviateName:"bjl",
        gameSpineRes: "dt_baijiale",
        // abbreviateName:"bjl",
        // gameSpineRes: "baijiale",
        clubGameSpineRes: "dt_baijiale",
        bundleName: "bjl",
        gameUI: ECommonUI.Game_bjl,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:null,
        rooms: {
            [9101]: {
                roomId: 9101,
                roomName: "体验场",
                roomType:0
            },
            [9102]: {
                roomId: 9102,
                roomName: "平民场",
                roomType:1
            },
            [9103]: {
                roomId: 9103,
                roomName: "贵族场",
                roomType:2
            },
            [9104]: {
                roomId: 9104,
                roomName: "官甲场",
                roomType:3
            }
           
        }
    },
    [EGameType.PDK]: {  
        gameName:"跑得快",
        gametype: EGameType.PDK,
        prefabIcon: "hall_pdk",
        gameState: EGameState.New,
        sortId: 0,
        isFirst: true,
        roomUI: ECommonUI.PDK_Room, 
        lvType: ELevelType.PDK, 
        defaultRoom:3001,
        abbreviateName:"pdk",
        gameSpineRes: "paodekuai",
        clubGameSpineRes: "paodekuai",
        bundleName: "pdk",
        gameUI: ECommonUI.Game_pdk,
        doubleRule:null,
        specialRules:"中途禁止加入",
        specialCardType:null,
        multiplierCardType:null,
        rooms: {
            [3001]: {
                roomId: 3001,
                roomName: "体验场",
                roomType:0
            },
            [3002]: {
                roomId: 3002,
                roomName: "平民场",
                roomType:1
            },
            [3003]: {
                roomId: 3003,
                roomName: "贵族场",
                roomType:2
            },
            [3004]: {
                roomId: 3004,
                roomName: "官甲场",
                roomType:3
            },
            [3005]: {
                roomId: 3005,
                roomName: "至尊场",
                roomType:4
            },
            [3006]: {
                roomId: 3006,
                roomName: "王者场",
                roomType:5
            },
        }
    },
    [EGameType.QZNN]: { 
        gameName:"抢庄牛牛",
        gametype: EGameType.QZNN,
        prefabIcon: "hall_qznn",
        gameState: EGameState.New,
        sortId: 1,
        isFirst: true,
        roomUI: ECommonUI.QZNN_Room,
        lvType: ELevelType.QZNN,
        defaultRoom:8301,
        abbreviateName:"qznn",
        gameSpineRes: "qiangzhuangniuniu1",
        clubGameSpineRes: "qiangzhuangniuniu",
        bundleName: "qznn",
        gameUI: ECommonUI.Game_qznn,
        doubleRule:"牛七~牛九2倍；牛牛3倍",
        specialRules:null,
        specialCardType:"五小牛、四炸、五花牛、四花牛4倍",
        multiplierCardType:null,
        rooms: {
            [8301]: {
                roomId: 8301,
                roomName: "体验场",
                roomType:0
            },
            [8302]: {
                roomId: 8302,
                roomName: "平民场",
                roomType:1
            },
            [8303]: {
                roomId: 8303,
                roomName: "贵族场",
                roomType:2
            },
            [8304]: {
                roomId: 8304,
                roomName: "官甲场",
                roomType:3
            },
            [8305]: {
                roomId: 8305,
                roomName: "至尊房",
                roomType:4
            },
            [8306]: {
                roomId: 8306,
                roomName: "王者房",
                roomType:5
            },
        }
    },
    [EGameType.XPQZNN]: {
        gameName:"选牌牛牛",
        gametype: EGameType.XPQZNN,
        prefabIcon: "hall_xpqznn",
        gameState: EGameState.New,
        sortId: 11,
        isFirst: false,
        roomUI: ECommonUI.XPQZNN_Room,
        lvType: ELevelType.XPQZNN,
        defaultRoom:8301,
        abbreviateName:"xpqznn",
        gameSpineRes: "xuanpainiuniu",
        clubGameSpineRes: "xuanpainiuniu",
        bundleName: "xpqznn",
        gameUI: ECommonUI.Game_xpqznn,
        doubleRule:null,
        specialRules:null,
        specialCardType:"五小牛、四炸、五花牛、四花牛4倍",
        multiplierCardType:"牛七~牛九2倍；牛牛3倍",
        rooms: {
            [8101]: {
                roomId: 8101,
                roomName: "体验场",
                roomType:0
            },
            [8102]: {
                roomId: 8102,
                roomName: "平民场",
                roomType:1
            },
            [8103]: {
                roomId: 8103,
                roomName: "贵族场",
                roomType:2
            },
            [8104]: {
                roomId: 8104,
                roomName: "官甲场",
                roomType:3
            },
            [8105]: {
                roomId: 8105,
                roomName: "至尊房",
                roomType:4
            },
            [8106]: {
                roomId: 8106,
                roomName: "王者房",
                roomType:5
            },
        }
    },
    [EGameType.ZJH]: {
        gameName:"炸金花",
        gametype: EGameType.ZJH,
        prefabIcon: "hall_zjh",
        gameState: EGameState.New,
        sortId: 3,
        isFirst: false,
        roomUI: ECommonUI.ZJH_Room,
        lvType: ELevelType.ZJH,
        defaultRoom:2201,
        abbreviateName:"zjh",
        gameSpineRes: "zhajinhua",
        clubGameSpineRes: "zhajinhua",
        bundleName: "zjh",
        gameUI: ECommonUI.Game_zjh,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:null,
        rooms: {
            [2201]: {
                roomId: 2201,
                roomName: "体验场",
                roomType:0
            },
            [2202]: {
                roomId: 2202,
                roomName: "平民场",
                roomType:1
            },
            [2203]: {
                roomId: 2203,
                roomName: "贵族场",
                roomType:2
            },
            [2204]: {
                roomId: 2204,
                roomName: "官甲场",
                roomType:3
            },
        }
    },
    [EGameType.BREBG]: {
        gameName:"二八杠",
        gametype: EGameType.BREBG,
        prefabIcon: "hall_ebg",
        gameState: EGameState.Normal,
        sortId: 6,
        isFirst: false,
        roomUI: ECommonUI.None,
        lvType: ELevelType.BREBG,
        defaultRoom:7201,
        abbreviateName:"brebg",
        gameSpineRes: "bairenerbagang",
        clubGameSpineRes: "erbagang",
        bundleName: "brebg",
        gameUI: ECommonUI.GAME_brebg,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:null,
        rooms: {
            [7201]: {
                roomId: 7201,
                roomName: "体验场",
                roomType:0
            },
            [7202]: {
                roomId: 7202,
                roomName: "平民场",
                roomType:1
            },
            [7203]: {
                roomId: 7203,
                roomName: "贵族场",
                roomType:2
            },
            [7204]: {
                roomId: 7204,
                roomName: "官甲场",
                roomType:3
            }, 
            [7205]: {
                roomId: 7205,
                roomName: "至尊房",
                roomType:4
            },
            [7206]: {
                roomId: 7206,
                roomName: "王者房",
                roomType:5
            },
        }
    },
    [EGameType.QZLH]: {
        gameName:"万人龙虎",
        gametype: EGameType.QZLH,
        prefabIcon: "hall_lhdz",
        gameState: EGameState.Normal,
        sortId: 2,
        isFirst: false,
        roomUI: ECommonUI.None,
        lvType: ELevelType.BRLH,
        defaultRoom:9001,
        abbreviateName:"brlh",
        gameSpineRes: "longhudazhan1",
        clubGameSpineRes: "longhudazhan",
        bundleName: "brlh",
        gameUI: ECommonUI.GAME_brlh,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:null,
        rooms: {
            [9001]: {
                roomId: 9001,
                roomName: "体验场",
                roomType:0
            },
            [9002]: {
                roomId: 9002,
                roomName: "平民场",
                roomType:1
            },
            [9003]: {
                roomId: 9003,
                roomName: "贵族场",
                roomType:2
            },
            [9004]: {
                roomId: 9004,
                roomName: "官甲场",
                roomType:3
            },
        }
    },
    [EGameType.BRNN]: {
        gameName:"百人牛牛",
        gametype: EGameType.BRNN,
        prefabIcon: "hall_brnn",
        gameState: EGameState.Normal,
        sortId: 8,
        isFirst: false,
        roomUI: ECommonUI.None,
        lvType: ELevelType.BRNN,
        defaultRoom:9301,
        abbreviateName:"brnn",
        gameSpineRes: "bairenniuniu",
        clubGameSpineRes: "bairenniuniu",
        bundleName: "brnn",
        gameUI: ECommonUI.GAME_brnn,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:null,
        rooms: {
            [9301]: {
                roomId: 9301,
                roomName: "体验场",
                roomType:0
            },
            [9302]: {
                roomId: 9302,
                roomName: "平民场",
                roomType:1
            },
            [9303]: {
                roomId: 9303,
                roomName: "贵族场",
                roomType:2
            },
            [9304]: {
                roomId: 9304,
                roomName: "官甲场",
                roomType:3
            },
        }
    },
    [EGameType.BRJH]: {
        gameName:"百人金花",
        gametype: EGameType.BRJH,
        prefabIcon: "hall_brjh",
        gameState: EGameState.Normal,
        sortId: 1,
        isFirst: false,
        roomUI: ECommonUI.None,
        lvType: ELevelType.BRJH,
        defaultRoom:9201,
        abbreviateName:"brjh",
        gameSpineRes: "bairenjinhua1",
        clubGameSpineRes: "bairenjinhua",
        bundleName: "brjh",
        gameUI: ECommonUI.GAME_brjh,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:null,
        rooms: {
            [9201]: {
                roomId: 9201,
                roomName: "体验场",
                roomType:0
            },
            [9202]: {
                roomId: 9202,
                roomName: "平民场",
                roomType:1
            },
            [9203]: {
                roomId: 9203,
                roomName: "贵族场",
                roomType:2
            },
            [9204]: {
                roomId: 9204,
                roomName: "官甲场",
                roomType:3
            },
        }
    },
    [EGameType.BRHH]: {
        gameName:"百人红黑",
        gametype: EGameType.BRHH,
        prefabIcon: "hall_hhdz",
        gameState: EGameState.Normal,
        sortId: 4,
        isFirst: false,
        roomUI: ECommonUI.None,
        lvType: ELevelType.BRHH,
        defaultRoom:2101,
        abbreviateName:"brhh",
        gameSpineRes: "hongheidazhan",
        clubGameSpineRes: "hongheidazhan",
        bundleName: "brhh",
        gameUI: ECommonUI.GAME_brhh,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:null,
        rooms: {
            [2101]: {
                roomId: 2101,
                roomName: "体验场",
                roomType:0
            },
            [2102]: {
                roomId: 2102,
                roomName: "平民场",
                roomType:1
            },
            [2103]: {
                roomId: 2103,
                roomName: "贵族场",
                roomType:2
            },
            [2104]: {
                roomId: 2104,
                roomName: "官甲场",
                roomType:3
            },
        }
    },
    [EGameType.SG]: {
        gameName:"三公",
        gametype: EGameType.SG,
        prefabIcon: "hall_sg",
        gameState: EGameState.Normal,
        sortId: 5,
        isFirst: false,
        roomUI: ECommonUI.SG_Room,
        lvType: ELevelType.SG,
        defaultRoom:8601,
        abbreviateName:"sg",
        gameSpineRes: "sangong",
        clubGameSpineRes: "sangong",
        bundleName: "sg",
        gameUI: ECommonUI.Game_sg,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:"7~9点2倍；三公3倍；炸弹4倍；爆玖5倍",
        rooms: {
            [8601]: {
                roomId: 8601,
                roomName: "体验场",
                roomType:0
            },
            [8602]: {
                roomId: 8602,
                roomName: "平民场",
                roomType:1
            },
            [8603]: {
                roomId: 8603,
                roomName: "贵族场",
                roomType:2
            },
            [8604]: {
                roomId: 8604,
                roomName: "官甲场",
                roomType:3
            },
            [8605]: {
                roomId: 8605,
                roomName: "至尊房",
                roomType:4
            },
            [8606]: {
                roomId: 8606,
                roomName: "王者房",
                roomType:5
            },
        }
    },
    [EGameType.BJ]: {
        gameName:"二十一点",
        gametype: EGameType.BJ,
        prefabIcon: "hall_bj",
        gameState: EGameState.Normal,
        sortId: 7,
        isFirst: false,
        roomUI: ECommonUI.BJ_Room,
        lvType: ELevelType.BJ,
        defaultRoom:6001,
        abbreviateName:"blackjack",
        gameSpineRes: "ershiyidianB",
        clubGameSpineRes: "ershiyidian",
        bundleName: "blackjack",
        gameUI: ECommonUI.GAME_bj,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:null,
        rooms: {
            [6001]: {
                roomId: 6001,
                roomName: "体验场",
                roomType:0
            },
            [6002]: {
                roomId: 6002,
                roomName: "平民场",
                roomType:1
            },
            [6003]: {
                roomId: 6003,
                roomName: "贵族场",
                roomType:2
            },
            [6004]: {
                roomId: 6004,
                roomName: "官甲场",
                roomType:3
            },
        }
    },
    [EGameType.KPQZNN]: {
        gameName:"看牌抢庄牛牛",
        gametype: EGameType.KPQZNN,
        prefabIcon: "hall_kpqz",
        gameState: EGameState.Normal,
        sortId: 8,
        isFirst: false,
        roomUI: ECommonUI.KPQZNN_Room,
        lvType: ELevelType.KPQZNN,
        defaultRoom:8901,
        abbreviateName:"kpqznn",
        gameSpineRes: "qiangzhuangniuniu1",
        clubGameSpineRes: "qiangzhuangniuniu",
        bundleName: "kpqznn",
        gameUI: ECommonUI.Game_kpqznn,
        doubleRule:"牛七~牛九2倍；牛牛3倍",
        specialRules:null,
        specialCardType:"五小牛、四炸、五花牛、四花牛4倍",
        multiplierCardType:null,
        rooms: {
            [8901]: {
                roomId: 8901,
                roomName: "体验场",
                roomType:0
            },
            [8902]: {
                roomId: 8902,
                roomName: "平民场",
                roomType:1
            },
            [8903]: {
                roomId: 8903,
                roomName: "贵族场",
                roomType:2
            },
            [8904]: {
                roomId: 8904,
                roomName: "官甲场",
                roomType:3
            },
        }
    },
    [EGameType.TBNN]: {
        gameName:"通比牛牛",
        gametype: EGameType.TBNN,
        prefabIcon: "hall_tb",
        gameState: EGameState.Normal,
        sortId: 9,
        isFirst: false,
        roomUI: ECommonUI.TBNN_Room,
        lvType: ELevelType.TBNN,
        defaultRoom:8701,
        abbreviateName:"tbnn",
        gameSpineRes: "tongbiniuniu",
        clubGameSpineRes: "tongbiniuniu",
        bundleName: "tbnn",
        gameUI: ECommonUI.Game_tbnn,
        doubleRule:"牛七~牛九2倍；牛牛3倍",
        specialRules:null,
        specialCardType:"五小牛、四炸、五花牛、四花牛4倍",
        multiplierCardType:null,
        rooms: {
            [8701]: {
                roomId: 8701,
                roomName: "体验场",
                roomType:0
            },
            [8702]: {
                roomId: 8702,
                roomName: "平民场",
                roomType:1
            },
            [8703]: {
                roomId: 8703,
                roomName: "贵族场",
                roomType:2
            },
            [8704]: {
                roomId: 8704,
                roomName: "官甲场",
                roomType:3
            },
        }
    },
    // [EGameType.TBNN_HY]: {
    //     gameName:"通比牛牛_好友房",
    //     gametype: EGameType.TBNN_HY,
    //     prefabIcon: "hall_tb",
    //     gameState: EGameState.Normal,
    //     sortId: 15,
    //     isFirst: false,
    //     roomUI: ECommonUI.TBNN_Room,
    //     lvType: ELevelType.TBNN_HY,
    //     defaultRoom:1501,
    //     abbreviateName:"tbnn_hy",
    //     gameSpineRes: "tongbiniuniu_hy",
    //     bundleName: "tbnn_hy",
    //     gameUI: ECommonUI.Game_tbnn_hy,
    //     rooms: {
    //         [1501]: {
    //             roomId: 1501,
    //             roomName: "体验场",
    //             roomType:0
    //         },
    //     }
    // },
    // [EGameType.ZZWZ]: {
    //     gameName:"至尊五张",
    //     gametype: EGameType.ZZWZ,
    //     prefabIcon: "hall_sg",
    //     gameState: EGameState.Normal,
    //     sortId: 10,
    //     isFirst: false,
    //     roomUI: ECommonUI.ZZWZ_Room,
    //     lvType: ELevelType.ZZWZ,
    //     defaultRoom:8401,
    //     abbreviateName:"zzwz",
    //     gameSpineRes: "qiangzhuangniuniu1",
    //     bundleName: "zzwz",
    //     gameUI: ECommonUI.Game_zzwz,
    //     rooms: {
    //         [4001]: {
    //             roomId: 4001,
    //             roomName: "体验场",
    //             roomType:0
    //         },
    //         [4002]: {
    //             roomId: 4002,
    //             roomName: "平民场",
    //             roomType:1
    //         },
    //         [4003]: {
    //             roomId: 4003,
    //             roomName: "贵族场",
    //             roomType:2
    //         },
    //         [4004]: {
    //             roomId: 4004,
    //             roomName: "官甲场",
    //             roomType:3
    //         },
    //     }
    // },
    // [EGameType.QZJH]: {
    //     gameName:"抢注金花",
    //     gametype: EGameType.QZJH,
    //     prefabIcon: "hall_qzjh",
    //     gameState: EGameState.Normal,
    //     sortId: 1,
    //     isFirst: false,
    //     roomUI: ECommonUI.QZJH_Room,
    //     lvType: ELevelType.QZJH,
    //     defaultRoom:8401,
    //     abbreviateName:"qzjh",
    //     gameSpineRes: "qiangzhuangjinhua2BKP",
    //     bundleName: "qzjh",
    //     gameUI: ECommonUI.Game_qzjh,
    //     rooms: {
    //         [8401]: {
    //             roomId: 8401,
    //             roomName: "体验场",
    //             roomType:0
    //         },
    //         [8402]: {
    //             roomId: 8402,
    //             roomName: "平民场",
    //             roomType:1
    //         },
    //         [8403]: {
    //             roomId: 8403,
    //             roomName: "贵族场",
    //             roomType:2
    //         },
    //         [8404]: {
    //             roomId: 8404,
    //             roomName: "官甲场",
    //             roomType:3
    //         },
    //     }
    // },
    [EGameType.SH]: {
        gameName:"梭哈",
        gametype: EGameType.SH,
        prefabIcon: "hall_suohua",
        gameState: EGameState.Normal,
        sortId: 10,
        isFirst: false,
        roomUI: ECommonUI.SUOHA_Room,
        lvType: ELevelType.SH,
        defaultRoom:4201,
        abbreviateName:"suoha",
        gameSpineRes: "suohaSP",
        clubGameSpineRes: "suoha",
        bundleName: "suoha",
        gameUI: ECommonUI.Game_suoha,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:null,
        rooms: {
            [4201]: {
                roomId: 4201,
                roomName: "体验场",
                roomType:0
            },
            [4202]: {
                roomId: 4202,
                roomName: "平民场",
                roomType:1
            },
            [4203]: {
                roomId: 4203,
                roomName: "贵族场",
                roomType:2
            },
            [4204]: {
                roomId: 4204,
                roomName: "官甲场",
                roomType:3
            },
        }
    },
    [EGameType.DZPK]: {
        gameName:"德州扑克",
        gametype: EGameType.DZPK,
        prefabIcon: "",
        gameState: EGameState.Normal,
        sortId: 11,
        isFirst: false,
        roomUI: ECommonUI.DZPK_Room,
        lvType: ELevelType.DZPK,
        defaultRoom:4501,
        abbreviateName:"dzpk",
        clubGameSpineRes: "dzpk",
        gameSpineRes: "dt_dezhoupuke",
        bundleName: "dzpk",
        gameUI: ECommonUI.Game_dzpk,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:null,
        rooms: {
            [4501]: {
                roomId: 4501,
                roomName: "体验场",
                roomType:0
            },
            [4502]: {
                roomId: 4502,
                roomName: "平民场",
                roomType:1
            },
            [4503]: {
                roomId: 4503,
                roomName: "贵族场",
                roomType:2
            },
            [4504]: {
                roomId: 4504,
                roomName: "官甲场",
                roomType:3
            },
        }
    },
    [EGameType.QZJH]: {
        gameName:"抢注金花",
        gametype: EGameType.QZJH,
        prefabIcon: "hall_qzjh",
        gameState: EGameState.Normal,
        sortId: 1,
        isFirst: false,
        roomUI: ECommonUI.QZJH_Room,
        lvType: ELevelType.QZJH,
        defaultRoom:8401,
        abbreviateName:"qzjh",
        gameSpineRes: "qiangzhuangjinhua2BKP",
        clubGameSpineRes: "qiangzhuangjinhua",
        bundleName: "qzjh",
        gameUI: ECommonUI.Game_qzjh,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:null,
        rooms: {
            [8401]: {
                roomId: 8401,
                roomName: "体验场",
                roomType:0
            },
            [8402]: {
                roomId: 8402,
                roomName: "平民场",
                roomType:1
            },
            [8403]: {
                roomId: 8403,
                roomName: "贵族场",
                roomType:2
            },
            [8404]: {
                roomId: 8404,
                roomName: "官甲场",
                roomType:3
            },
        }
    },

    [EGameType.TBJH]: {
        gameName:"通比金花",
        gametype: EGameType.TBJH,
        prefabIcon: "hall_tbjh",
        gameState: EGameState.Normal,
        sortId: 1,
        isFirst: false,
        roomUI: ECommonUI.TBJH_Room,
        lvType: ELevelType.TBJH,
        defaultRoom:8501,
        abbreviateName:"tbjh",
        gameSpineRes: "tongbijinhua",
        clubGameSpineRes: "tongbijinhua",
        bundleName: "tbjh",
        gameUI: ECommonUI.Game_tbjh,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:"对子2倍；顺子，金花3倍；豹子，顺金4倍",
        rooms: {
            [8501]: {
                roomId: 8501,
                roomName: "体验场",
                roomType:0
            },
            [8502]: {
                roomId: 8502,
                roomName: "平民场",
                roomType:1
            },
            [8503]: {
                roomId: 8503,
                roomName: "贵族场",
                roomType:2
            },
            [8504]: {
                roomId: 8504,
                roomName: "官甲场",
                roomType:3
            },
        }
    },
    [EGameType.KPQZJH]: {
        gameName:"看牌抢庄金花",
        gametype: EGameType.KPQZJH,
        prefabIcon: "hall_kpqzjh",
        gameState: EGameState.Normal,
        sortId: 1,
        isFirst: false,
        roomUI: ECommonUI.KPQZJH_Room,
        lvType: ELevelType.KPQZJH,
        defaultRoom:8201,
        abbreviateName:"kpqzjh",
        gameSpineRes: "qiangzhuangjinhuaKP",
        clubGameSpineRes: "kanpaiqiangzhuangjinhua",
        bundleName: "kpqzjh",
        gameUI: ECommonUI.Game_kpqzjh,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:"对子2倍；顺子，金花3倍；豹子，顺金4倍",
        rooms: {
            [8201]: {
                roomId: 8201,
                roomName: "体验场",
                roomType:0
            },
            [8202]: {
                roomId: 8202,
                roomName: "平民场",
                roomType:1
            },
            [8203]: {
                roomId: 8203,
                roomName: "贵族场",
                roomType:2
            },
            [8204]: {
                roomId: 8204,
                roomName: "官甲场",
                roomType:3
            },
        }
    },
    [EGameType.XPJH]: {
        gameName:"选牌金花",
        gametype: EGameType.XPJH,
        prefabIcon: "hall_xpjh",
        gameState: EGameState.Normal,
        sortId: 1,
        isFirst: false,
        roomUI: ECommonUI.XPJH_Room,
        lvType: ELevelType.XPJH,
        defaultRoom:8801,
        abbreviateName:"xpjh",
        gameSpineRes: "xuanpaijinhua1",
        clubGameSpineRes: "xuanpaijinhua",
        bundleName: "xpjh",
        gameUI: ECommonUI.Game_xpjh,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:"对子2倍；顺子，金花3倍；豹子，顺金4倍",
        rooms: {
            [8801]: {
                roomId: 8801,
                roomName: "体验场",
                roomType:0
            },
            [8802]: {
                roomId: 8802,
                roomName: "平民场",
                roomType:1
            },
            [8803]: {
                roomId: 8803,
                roomName: "贵族场",
                roomType:2
            },
            [8804]: {
                roomId: 8804,
                roomName: "官甲场",
                roomType:3
            },
        }
    },
    [EGameType.BCBM]: {
        gameName:"奔驰宝马",
        gametype: EGameType.BCBM,
        prefabIcon: "hall_bcbm",
        gameState: EGameState.Normal,
        sortId: 1,
        isFirst: false,
        roomUI: ECommonUI.None,
        lvType: ELevelType.BCBM,
        defaultRoom:9501,
        abbreviateName:"bcbm",
        gameSpineRes: "benchibaoma",
        clubGameSpineRes: "benchibaoma",
        bundleName: "bcbm",
        gameUI: ECommonUI.GAME_Bcbm,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:null,
        rooms: {
            [9501]: {
                roomId: 9501,
                roomName: "体验场",
                roomType:0
            },
        }
    },
    [EGameType.DDZ]: {
        gameName:"斗地主",
        gametype: EGameType.DDZ,
        prefabIcon: "hall_ddz",
        gameState: EGameState.New,
        sortId: 1,
        isFirst: false,
        roomUI: ECommonUI.DDZ_Room,
        lvType: ELevelType.DDZ,
        defaultRoom:1001,
        abbreviateName:"ddz",
        gameSpineRes: "doudizhu",
        clubGameSpineRes: "doudizhu",
        bundleName: "ddz",
        gameUI: ECommonUI.GAME_ddz,
        doubleRule:null,
        specialRules:"中途禁止加入",
        specialCardType:null,
        multiplierCardType:null,
        rooms: {
            [1001]: {
                roomId: 1001,
                roomName: "体验场",
                roomType:0
            },
            [1002]: {
                roomId: 1002,
                roomName: "平民场",
                roomType:1
            },
            [1003]: {
                roomId: 1003,
                roomName: "贵族场",
                roomType:2
            },
            [1004]: {
                roomId: 1004,
                roomName: "官甲场",
                roomType:3
            },
            [1005]: {
                roomId: 1005,
                roomName: "至尊房",
                roomType:4
            },
            [1006]: {
                roomId: 1006,
                roomName: "王者房",
                roomType:5
            },
        }
    },
    [EGameType.SSS]: {
        gameName:"十三水",
        gametype: EGameType.SSS,
        prefabIcon: "hall_sss",
        gameState: EGameState.New,
        sortId: 1,
        isFirst: false,
        roomUI: ECommonUI.SSS_Room,
        lvType: ELevelType.SSS,
        defaultRoom:5501,
        abbreviateName:"sss",
        gameSpineRes: "shisanshui",
        clubGameSpineRes: "shisanshui",
        bundleName: "sss",
        gameUI: ECommonUI.Game_sss,
        doubleRule:null,
        specialRules:null,
        specialCardType:null,
        multiplierCardType:null,
        rooms: {
            [5501]: {
                roomId: 5501,
                roomName: "体验场",
                roomType:0
            },
            [5502]: {
                roomId: 5502,
                roomName: "平民场",
                roomType:1
            },
            [5503]: {
                roomId: 5503,
                roomName: "贵族场",
                roomType:2
            },
            [5504]: {
                roomId: 5504,
                roomName: "官甲场",
                roomType:3
            },
        }
    },
}

export default cfg_game;
