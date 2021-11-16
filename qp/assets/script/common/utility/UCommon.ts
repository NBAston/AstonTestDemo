import { COIN_RATE, ZJH_MENPAI_LUNSHU } from "../../config/cfg_common";
import cfg_game from "../../config/cfg_game";
import AppGame from "../../public/base/AppGame";
import { ECommonUI, EGameType } from "../base/UAllenum";

export default class UCommon {

    /**
     * 获取俱乐部游戏房间名称
     * @param gameId 游戏id
     * @param roomId 房间id
     * @returns 俱乐部游戏房间名称
     */
    static getClubRoomName(gameId: EGameType, roomId: number,isRecord:boolean): string {
        let roomListInfo = AppGame.ins.roomModel.getRoomListInfo(gameId);
        if (!cfg_game[gameId] || !cfg_game[gameId].rooms[roomId]) {
            return null;
        }
        let roomType = cfg_game[gameId].rooms[roomId].roomType;
        let dizhu = 1;
        if (roomListInfo[roomType]) {
            dizhu = roomListInfo[roomType].dizu / COIN_RATE;
        }
        let clubRoomName = cfg_game[gameId].rooms[roomId].roomName;
        switch (gameId) {
            case EGameType.ZJH:
                clubRoomName = isRecord?"炸金花" + "<br/>" + "(俱乐部-" + dizhu + '元必闷' + ZJH_MENPAI_LUNSHU[roomType] + '轮)':"炸金花(俱乐部-" + dizhu + '元必闷' + ZJH_MENPAI_LUNSHU[roomType] + '轮)'; 
                break;
            case EGameType.DDZ:
                clubRoomName = isRecord?"斗地主" + "<br/>" + "(俱乐部-"  + dizhu + '元)':"斗地主(俱乐部-"  + dizhu + '元)';
                break;
            case EGameType.PDK:
                clubRoomName = isRecord?"跑得快" + "<br/>" + "(俱乐部-"  + dizhu + '元/张)':clubRoomName = "跑得快(俱乐部-"  + dizhu + '元/张)';
                break;
            case EGameType.TBNN:
                clubRoomName = isRecord?"通比牛牛" + "<br/>" + "(俱乐部-"  + dizhu + '元底)':"通比牛牛(俱乐部-"  + dizhu + '元底)';
                break;
            case EGameType.SG:
                clubRoomName = isRecord?"三公" + "<br/>" + "(俱乐部-"  + dizhu + '元底)':"三公(俱乐部-"  + dizhu + '元底)';
                break;
            case EGameType.KPQZNN:
                clubRoomName = isRecord?"看牌抢庄牛牛" + "<br/>" + "(俱乐部-"  + dizhu + '元底)':"看牌抢庄牛牛(俱乐部-"  + dizhu + '元底)';
                break;
            case EGameType.SH:
                clubRoomName = isRecord?"梭哈" + "<br/>" + "(俱乐部-" + dizhu + '元)':"梭哈(俱乐部-" + dizhu + '元)';
                break;
            case EGameType.SSS:
                clubRoomName = isRecord?"十三水" + "<br/>" + "(俱乐部-"  + dizhu + '元底)':"十三水(俱乐部-"  + dizhu + '元底)';
                break;
            case EGameType.BRNN:
                clubRoomName = isRecord?"百人牛牛" + "<br/>" + "(俱乐部-" + (roomType + 1) + '号桌)':"百人牛牛(俱乐部-" + (roomType + 1) + '号桌)';
                break;
            case EGameType.QZLH:
                clubRoomName = isRecord?"百人龙虎" + "<br/>" + "(俱乐部-" + (roomType + 1)+ '号桌)':"百人龙虎(俱乐部-" + (roomType + 1)+ '号桌)';
                break;
            case EGameType.BRJH:
                clubRoomName = isRecord?"百人金花" + "<br/>" + "(俱乐部-" + (roomType + 1) + '号桌)':"百人金花(俱乐部-" + (roomType + 1) + '号桌)';
                break;
            case EGameType.BRHH:
                clubRoomName = isRecord?"红黑大战" + "<br/>" + "(俱乐部-"  + (roomType + 1) + '号桌)':"红黑大战(俱乐部-"  + (roomType + 1) + '号桌)';
                break;
            default:
                clubRoomName = '';
                break;
        }
        return clubRoomName
    }
    
}
