import { EGameType, EGameState, ECommonUI, ELevelType } from './../common/base/UAllenum';


export let cfg_friendGameIds = [
    EGameType.TBNN_HY,
    EGameType.KPQZNN_HY,
    EGameType.PDK_HY,
    EGameType.ZJH_HY,
    EGameType.DDZ_HY,
]

let cfg_friends = {
    [EGameType.TBNN_HY]: {
        gameName:"通比牛牛_好友房",
        gametype: EGameType.TBNN_HY,
        prefabIcon: "hall_tb",
        gameState: EGameState.Normal,
        sortId: 15,
        isFirst: false,
        roomUI: ECommonUI.TBNN_Room,
        lvType: ELevelType.TBNN_HY,
        defaultRoom:1501,
        abbreviateName:"tbnn_hy",
        gameSpineRes: "tongbiniuniu_hy",
        bundleName: "tbnn_hy",
        gameUI: ECommonUI.Game_tbnn_hy,
        rooms: {
            [1501]: {
                roomId: 1501,
                roomName: "体验场",
                roomType:0
            },
        }
    },

    [EGameType.PDK_HY]: {
        gameName:"跑得快_好友房",
        gametype: EGameType.PDK_HY, 
        prefabIcon: "hall_pdk",
        gameState: EGameState.Normal,
        sortId: 15,
        isFirst: false,
        roomUI: ECommonUI.PDK_Room,
        lvType: ELevelType.PDK_HY,
        defaultRoom:1501,
        abbreviateName:"pdk_hy",
        gameSpineRes: "pdk_hy",
        bundleName: "pdk_hy",
        gameUI: ECommonUI.Game_pdk_hy,
        rooms: {
        [1501]: {
                roomId: 1501,
                roomName: "体验场",
                roomType:0
            },
        }
    },

    [EGameType.KPQZNN_HY]: {
        gameName:"看牌抢庄牛牛_好友房",
        gametype: EGameType.KPQZNN_HY,
        prefabIcon: "hall_kpqz",
        gameState: EGameState.Normal,
        sortId: 8,
        isFirst: false,
        roomUI: ECommonUI.KPQZNN_Room,
        lvType: ELevelType.KPQZNN_HY,
        defaultRoom:8901,
        abbreviateName:"kpqznn_hy",
        gameSpineRes: "qiangzhuangniuniu1_hy",
        bundleName: "kpqznn_hy",
        gameUI: ECommonUI.Game_kpqznn_hy,
        rooms: {
            [8901]: {
                roomId: 8901,
                roomName: "体验场",
                roomType:0
            },
        }
    },


    [EGameType.ZJH_HY]: {
        gameName:"炸金花_好友房",
        gametype: EGameType.ZJH_HY,
        prefabIcon: "hall_tb",
        gameState: EGameState.Normal,
        sortId: 11,
        isFirst: false,
        roomUI: ECommonUI.ZJH_Room,
        lvType: ELevelType.ZJH_HY,
        defaultRoom:1101,
        abbreviateName:"zjh_hy",
        gameSpineRes: "zhajinhua_hy",
        bundleName: "zjh_hy",
        gameUI: ECommonUI.Game_zjh_hy,
        rooms: {
        [1101]: {
                roomId: 1101,
                roomName: "体验场",
                roomType:0
            },
        }
    },

    [EGameType.DDZ_HY]: {
        gameName:"斗地主_好友房",
        gametype: EGameType.DDZ_HY,
        prefabIcon: "hall_ddz",
        gameState: EGameState.Normal,
        sortId: 1,
        isFirst: false,
        roomUI: ECommonUI.DDZ_Room,
        lvType: ELevelType.DDZ_HY,
        defaultRoom:1001,
        abbreviateName:"ddz_hy",
        gameSpineRes: "doudizhu",
        bundleName: "ddz_hy",
        gameUI: ECommonUI.Game_ddz_hy,
        rooms: {
            [1501]: {
                roomId: 1501,
                roomName: "体验场",
                roomType:0
            },
        }
    },

}


export default cfg_friends;