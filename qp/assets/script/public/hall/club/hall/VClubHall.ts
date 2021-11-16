import { ECommonUI, EGameState, EGameType, EGameUpdateStatus, EMsgType, ERoomKind } from "../../../../common/base/UAllenum";
import VWindow from "../../../../common/base/VWindow";
import { ClubGameServer, ClubHallServer } from "../../../../common/cmd/proto";
import UDebug from "../../../../common/utility/UDebug";
import UStringHelper from "../../../../common/utility/UStringHelper";
import { BrGameList, ClubExcludedGameList, COIN_RATE } from "../../../../config/cfg_common";
import AppGame from "../../../base/AppGame";
import UGameHotUpdate from "../../../hot/UGameHotUpdate";
import { UpdaterEvent } from "../../../hot/UHotData";
import { EBtnType } from "../../lb_service_mail/MailServiceData";
import MHall from "../../lobby/MHall";
import MRole from "../../lobby/MRole";
import MClubHall from "./MClubHall";
import VClubBrcGameItem from "./VClubBrcGameItem";
import VClubGameItem from "./VClubGameItem";
import VClubItem from "./VClubItem";
import VClubTableItem from "./VClubTableItem";

/**桌子类型 */
const enum TableType {
    /**对战类 */
    dz = 1,
    /**百人场 */
    brc = 2,
}
/**自动刷新桌子时间 */
const AutoRefreshInterval = 30;
/**一次加载的桌子数量 */
const LoadTableNumOnce = 12;
/**百人场游戏id */
const BrcGameId = 888888;
/**百人场游戏信息 */
const BrcGameInfo = {
    gameType: BrcGameId,
    abbreviateName: 'brc',
    clubGameSpine: 'bairenchang',
}

/**俱乐部游戏排序 */
const ClubGameSort = [
    EGameType.ZJH,
    EGameType.KPQZNN,
    EGameType.TBNN,
    EGameType.SG,
    EGameType.SH,
    BrcGameId,
    EGameType.SSS,
    EGameType.DDZ,
    EGameType.PDK,
]

/**俱乐部百人游戏排序 */
const ClubBrcGameSort = [
    EGameType.BRNN,
    EGameType.QZLH,
    EGameType.BRJH,
    EGameType.BRHH,
    EGameType.BREBG,
]

/**炸金花焖牌轮数 */
const ZJH_MENPAI_LUNSHU = [1, 1, 2, 3]

const { ccclass, property } = cc._decorator;

@ccclass
export default class VClubHall extends VWindow {

    @property(cc.ScrollView) clubScrollView: cc.ScrollView = null;
    @property(cc.ScrollView) gameScrollView: cc.ScrollView = null;
    @property(cc.ScrollView) tableScrollView: cc.ScrollView = null;
    @property(cc.ScrollView) brcGameScrollView: cc.ScrollView = null;
    @property(cc.Node) clubContent: cc.Node = null;
    @property(cc.Node) gameContent: cc.Node = null;
    @property(cc.Node) brcGameContent: cc.Node = null;
    @property(cc.Node) tableContent: cc.Node = null;
    @property(cc.Node) roomTypeContent: cc.Node = null;
    @property(cc.Node) roomList: cc.Node = null;
    @property(cc.Node) noClub: cc.Node = null;
    @property(cc.Label) coinLbl: cc.Label = null;
    @property(cc.Node) brcGameList: cc.Node = null;

    @property(cc.Prefab) clubPfb: cc.Prefab = null;
    @property(cc.Prefab) gamePfb: cc.Prefab = null;
    @property(cc.Prefab) tablePfb: cc.Prefab = null;
    @property(cc.Prefab) brcGamePfb: cc.Prefab = null;

    @property([cc.Label]) roomLblList: cc.Label[] = [];

    @property(cc.Node) myAchievement: cc.Node = null;
    @property(cc.Node) refreshNode: cc.Node = null;

    private _clubId: number = -1;  //选中的俱乐部id
    private _gameId: number = -1;  //选中的游戏id（真实游戏id）
    private _roomId: number = -1;  //选中的房间id
    private _tableId: number = -1;  //选中的桌子id
    private _roomIndex: number = 0;  //选中的房间下标
    private _leftGameId: number = EGameType.ZJH;  //选中左侧游戏id(包括百人场格子)

    private _gameItemlist: { [key: number]: VClubGameItem } = null;
    private _brcGameItemlist: { [key: number]: VClubBrcGameItem } = null;
    private _hots: Array<UGameHotUpdate> = [];
    private _clickGameList: Array<number> = [];

    private _gameInfo: any = null; //游戏信息
    private _roomInfo: any = null; //房间信息

    private _tableCount: number = 0; //桌子数量
    private _tableType: TableType = TableType.dz; //桌子类型
    private _tableInfos: any = null; //桌子信息列表    

    private _gameDataList: any[] = [];  //左侧栏游戏数据列表
    private _brcGameDataList: any[] = [];  //百人场游戏数据列表

    private _failGameId: number = 0;

    private _isShowActivity: boolean = false; //是否展示活动

    private _tablePool: cc.NodePool; //桌子对象池

    onLoad() {
        //初始化对象池
        this._tablePool = new cc.NodePool();
        for (let i = 0; i < LoadTableNumOnce * 2; i++) {
            let item = cc.instantiate(this.tablePfb);
            this._tablePool.put(item);
        }
        AppGame.ins.hallModel.on(MHall.UPDATE_GAME_FINISHED_HALL, this.subAlreadyUpdate, this);
        AppGame.ins.hallModel.on(MHall.HALL_RECONNECT, this.onClubHallReconnect, this);
    }

    onDestroy() {
        this._tablePool.clear();
        AppGame.ins.hallModel.off(MHall.UPDATE_GAME_FINISHED_HALL, this.subAlreadyUpdate, this);
        AppGame.ins.hallModel.off(MHall.HALL_RECONNECT, this.onClubHallReconnect, this);
    }

    show(data: any) {
        super.show(data);
        this._isShowActivity = false;
        if (data && data.showActivity) {
            this._isShowActivity = true;
        }
    }

    onEnable() {
        this.myAchievement.active = false;
        this.refreshNode.active = false;
        AppGame.ins.clubHallModel.isAutoRefreshTable = true;
        this.resetData();
        this.initGameList();
        this.setCoin(AppGame.ins.roleModel.getRoleGold());
        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.setCoin, this);
        AppGame.ins.clubHallModel.on(MClubHall.MY_CLUB_RES, this.initClubList, this);
        AppGame.ins.clubHallModel.on(MClubHall.CLUB_ROOM_INFO_RES, this.setTableList, this);
        AppGame.ins.clubHallModel.on(MClubHall.CLUB_BRC_ROOM_INFO_RES, this.setBrcTableList, this);
        AppGame.ins.clubHallModel.on(MClubHall.CLUB_CLEAR_TABLE, this.clearTable, this);

        this.scheduleOnce(() => {
            AppGame.ins.clubHallModel.requestMyClub(true, true);
        }, 0.01)

        this.schedule(() => {
            if (AppGame.ins.clubHallModel.isAutoRefreshTable) {
                this.refreshRoomInfo(false);
            }
        }, AutoRefreshInterval, cc.macro.REPEAT_FOREVER, AutoRefreshInterval);
    }

    onDisable() {
        this.resetData();
        AppGame.ins.roleModel.off(MRole.UPDATA_SCORE, this.setCoin, this);
        AppGame.ins.clubHallModel.off(MClubHall.MY_CLUB_RES, this.initClubList, this);
        AppGame.ins.clubHallModel.off(MClubHall.CLUB_ROOM_INFO_RES, this.setTableList, this);
        AppGame.ins.clubHallModel.off(MClubHall.CLUB_BRC_ROOM_INFO_RES, this.setBrcTableList, this);
        AppGame.ins.clubHallModel.off(MClubHall.CLUB_CLEAR_TABLE, this.clearTable, this);

        this.unscheduleAllCallbacks();
    }

    /**断线重连 */
    private onClubHallReconnect() {
        UDebug.log('onClubHallReconnect club重连 更新失败子游戏id => ', this._failGameId)
        UDebug.log('onClubHallReconnect club重连 子游戏更新中列表 => ', AppGame.ins.hallModel.updatingGameIdList)
        UDebug.log('onClubHallReconnect club重连 子游戏更新点击列表 => ', this._clickGameList)
        if (AppGame.ins.hallModel.updatingGameIdList.length > 0) {
            this._hots.forEach(hot => {
                if (this._failGameId == hot.gameId) {
                    this._failGameId = 0;
                    let index = this._hots.indexOf(hot);
                    this._hots.splice(index, 1);

                    hot.off(UpdaterEvent.SUB_UPDATE_FAILED, this.subUpdateFailed, this);
                    hot.off(UpdaterEvent.SUB_ALREADY_UP_TO_DATE, this.subAlreadyUpdate, this);
                    hot.off(UpdaterEvent.SUB_NEW_VERSION_FOUND, this.subNewVersionFound, this);
                    hot.off(UpdaterEvent.SUB_UPDATE_FINISHED, this.subUpdateFinished, this);
                    hot.off(UpdaterEvent.SUB_UPDATE_PROGRESSION, this.subUpdateProgression, this);

                    let hotNew = new UGameHotUpdate(hot.gameId, ERoomKind.Normal);
                    hotNew.on(UpdaterEvent.SUB_UPDATE_FAILED, this.subUpdateFailed, this);
                    hotNew.on(UpdaterEvent.SUB_ALREADY_UP_TO_DATE, this.subAlreadyUpdate, this);
                    hotNew.on(UpdaterEvent.SUB_NEW_VERSION_FOUND, this.subNewVersionFound, this);
                    hotNew.on(UpdaterEvent.SUB_UPDATE_FINISHED, this.subUpdateFinished, this);
                    hotNew.on(UpdaterEvent.SUB_UPDATE_PROGRESSION, this.subUpdateProgression, this);
                    this._hots.push(hotNew);
                    hotNew.checkUpdate(true);
                }
            });
        }
    }

    /**刷新金币 */
    setCoin(coin: number) {
        this.coinLbl.string = UStringHelper.getMoneyFormat(coin / COIN_RATE).toString();
    }

    /**初始化百人场游戏列表 */
    initBrcGameList() {
        let lastGameIdx = 0; //左侧游戏列表的
        let lastBrcGameIdx = 0; //百人场游戏列表的
        let delay = 0;
        let scrollTime = 0;
        if (this._brcGameItemlist) {
            UDebug.log('百人场---已存在游戏列表 _brcGameItemlist => ', this._brcGameItemlist)
            for (let i = 0; i < this._brcGameDataList.length; i++) {
                let gameInfo = this._brcGameDataList[i];
                if (gameInfo.gameType === AppGame.ins.clubHallModel.lastClubGameId) {
                    lastGameIdx = 5;
                    lastBrcGameIdx = i;
                }
            }
        } else {
            this._brcGameItemlist = {};
            UDebug.log('百人场---初始化游戏列表 _brcGameDataList => ', this._brcGameDataList)
            for (let i = 0; i < this._brcGameDataList.length; i++) {
                let gameInfo = this._brcGameDataList[i];
                let item = cc.instantiate(this.brcGamePfb);
                let data = {
                    index: i,
                    callback: this.clickBrcGameItemCallback.bind(this),
                    gameInfo: gameInfo
                }
                item.getComponent(VClubBrcGameItem).init(data);
                item.getComponent(VClubBrcGameItem).setHotNewTagShow((i == 0));
                item.parent = this.brcGameContent;
                this._brcGameItemlist[gameInfo.gameType] = item.getComponent(VClubBrcGameItem);

                if (gameInfo.gameType === AppGame.ins.clubHallModel.lastClubGameId) {
                    lastGameIdx = 5;
                    lastBrcGameIdx = i;
                }

                if (cc.sys.isNative) {
                    let hot = new UGameHotUpdate(gameInfo.gameType, ERoomKind.Normal);
                    hot.on(UpdaterEvent.SUB_UPDATE_FAILED, this.subUpdateFailed, this);
                    hot.on(UpdaterEvent.SUB_ALREADY_UP_TO_DATE, this.subAlreadyUpdate, this);
                    hot.on(UpdaterEvent.SUB_NEW_VERSION_FOUND, this.subNewVersionFound, this);
                    hot.on(UpdaterEvent.SUB_UPDATE_FINISHED, this.subUpdateFinished, this);
                    hot.on(UpdaterEvent.SUB_UPDATE_PROGRESSION, this.subUpdateProgression, this);
                    this._hots.push(hot);
                    hot.checkUpdate();
                } else {
                    this._brcGameItemlist[gameInfo.gameType].setUpdateStatus(EGameUpdateStatus.Updated);
                }
            }
        }

        this._gameId = this._brcGameDataList[lastBrcGameIdx].gameType;
        this._gameInfo = this._brcGameDataList[lastBrcGameIdx];
        this.scheduleOnce(() => {
            for (let key in this._brcGameItemlist) {
                let gameItem = this._brcGameItemlist[key];
                let isChecked = gameItem.getGameId() == this._gameId;
                gameItem.setIsChecked(isChecked);
            }
            let maxScrollOffset = this.brcGameScrollView.getMaxScrollOffset();
            this.brcGameScrollView.stopAutoScroll();
            let length = Object.keys(this._brcGameItemlist).length;
            this.brcGameScrollView.scrollToOffset(cc.v2(maxScrollOffset.y * (lastBrcGameIdx + 0.1 * lastBrcGameIdx) / length, 0), scrollTime);
        }, delay)

        UDebug.log('lastGameIdx ===> ', lastGameIdx)
        UDebug.log('lastBrcGameIdx ===> ', lastBrcGameIdx)
        UDebug.log('this._gameId ===> ', this._gameId)

        AppGame.ins.clubHallModel.lastClubGameId = -1;
        AppGame.ins.clubHallModel.lastRoomIndex = 0;
    }

    /**初始化游戏列表 */
    initGameList() {
        this._gameDataList = [];
        this._brcGameDataList = [];
        let serGameList = AppGame.ins.hallModel.getGameList();
        //剔除俱乐部不需要显示的游戏、百人场游戏
        for (let i = 0; i < serGameList.length; i++) {
            let gameInfo = serGameList[i];
            if (!ClubExcludedGameList.includes(gameInfo.gameType) && !BrGameList.includes(gameInfo.gameType)) {
                this._gameDataList.push(gameInfo);
            }

            if (BrGameList.includes(gameInfo.gameType) && !ClubExcludedGameList.includes(gameInfo.gameType)) {
                this._brcGameDataList.push(gameInfo);
            }
        }
        //第6个插入百人场
        this._gameDataList.splice(5, 0, BrcGameInfo);
        //游戏排序
        let sortFunc = (arr) => {
            arr.sort((a, b) => {
                let pa = a.sort;
                let pb = b.sort;
                if (a.sort > b.sort)
                    return 1;
                else if (pa < pb)
                    return -1;
                else {
                    return 0;
                }
            });
        }
        this._gameDataList.forEach(element => {
            if (ClubGameSort.indexOf(element.gameType) != -1) {
                element.sort = ClubGameSort.indexOf(element.gameType);
            }
        });
        this._brcGameDataList.forEach(element => {
            if (ClubBrcGameSort.indexOf(element.gameType) != -1) {
                element.sort = ClubBrcGameSort.indexOf(element.gameType);
            }
        });
        sortFunc(this._gameDataList);
        sortFunc(this._brcGameDataList);

        UDebug.log('左侧游戏数据列表 _gameDataList => ', this._gameDataList)
        UDebug.log('百人场游戏数据列表 _brcGameDataList => ', this._brcGameDataList)

        //有最后进入的游戏 同时设置房间场次
        if (AppGame.ins.clubHallModel.lastClubGameId != -1) {
            let idx = AppGame.ins.clubHallModel.lastRoomIndex;
            this._roomIndex = idx;
            this.roomTypeContent.children[idx].getComponent(cc.Toggle).isChecked = true;
        } else {
            this.roomTypeContent.children[0].getComponent(cc.Toggle).isChecked = true;
        }

        let lastGameIdx = 0;
        let delay = 0;
        let scrollTime = 0;
        if (this._gameItemlist) {
            UDebug.log('已存在游戏列表 _gameItemlist => ', this._gameItemlist)
            for (let i = 0; i < this._gameDataList.length; i++) {
                let gameInfo = this._gameDataList[i];
                if (gameInfo.gameType === AppGame.ins.clubHallModel.lastClubGameId) {
                    lastGameIdx = i;
                    this._leftGameId = gameInfo.gameType;
                }
                //百人场游戏第6个
                if (BrGameList.includes(AppGame.ins.clubHallModel.lastClubGameId)) {
                    lastGameIdx = 5;
                    this._leftGameId = BrcGameId;
                }
            }
        } else {
            delay = 0.33;
            scrollTime = 0.1;
            this._gameItemlist = {};
            this.gameContent.destroyAllChildren();
            UDebug.log('初始化游戏列表 _gameDataList => ', this._gameDataList)
            for (let i = 0; i < this._gameDataList.length; i++) {
                let gameInfo = this._gameDataList[i];
                let item = cc.instantiate(this.gamePfb);
                let data = {
                    index: i,
                    callback: this.clickGameItemCallback.bind(this),
                    gameInfo: gameInfo,
                }
                item.getComponent(VClubGameItem).init(data);
                item.getComponent(VClubGameItem).setHotNewTagShow((i == 0));
                item.parent = this.gameContent;
                this._gameItemlist[gameInfo.gameType] = item.getComponent(VClubGameItem);

                if (gameInfo.gameType === AppGame.ins.clubHallModel.lastClubGameId) {
                    lastGameIdx = i;
                    this._leftGameId = gameInfo.gameType;
                }
                //百人场游戏第6个
                if (BrGameList.includes(AppGame.ins.clubHallModel.lastClubGameId) && !ClubExcludedGameList.includes(AppGame.ins.clubHallModel.lastClubGameId)) {
                    lastGameIdx = 5;
                    this._leftGameId = BrcGameId;
                }

                if (cc.sys.isNative && gameInfo.gameType != BrcGameId) {
                    let hot = new UGameHotUpdate(gameInfo.gameType, ERoomKind.Normal);
                    hot.on(UpdaterEvent.SUB_UPDATE_FAILED, this.subUpdateFailed, this);
                    hot.on(UpdaterEvent.SUB_ALREADY_UP_TO_DATE, this.subAlreadyUpdate, this);
                    hot.on(UpdaterEvent.SUB_NEW_VERSION_FOUND, this.subNewVersionFound, this);
                    hot.on(UpdaterEvent.SUB_UPDATE_FINISHED, this.subUpdateFinished, this);
                    hot.on(UpdaterEvent.SUB_UPDATE_PROGRESSION, this.subUpdateProgression, this);
                    this._hots.push(hot);
                    hot.checkUpdate();
                } else {
                    this._gameItemlist[gameInfo.gameType].setUpdateStatus(EGameUpdateStatus.Updated);
                }
            }
        }

        this._gameId = this._gameDataList[lastGameIdx].gameType;
        this._gameInfo = this._gameDataList[lastGameIdx];
        this.scheduleOnce(() => {
            // this.gameContent.children[lastGameIdx].getComponent(cc.Toggle).isChecked = true;
            for (let key in this._gameItemlist) {
                let gameItem = this._gameItemlist[key];
                let isChecked = gameItem.getGameId() == this._leftGameId;
                gameItem.setIsChecked(isChecked);
            }
            let maxScrollOffset = this.gameScrollView.getMaxScrollOffset();
            this.gameScrollView.stopAutoScroll();
            let length = Object.keys(this._gameItemlist).length;
            this.gameScrollView.scrollToOffset(cc.v2(0, maxScrollOffset.y * (lastGameIdx + 0.1 * lastGameIdx) / length), scrollTime);
        }, delay)

        this.setRoomListInfo();
        UDebug.log('lastGameIdx ===> ', lastGameIdx)
        UDebug.log('this._leftGameId ===> ', this._leftGameId)

        //百人场
        if (this._gameId == BrcGameId) {
            this.brcGameList.active = true;
            this.initBrcGameList();
        }

        AppGame.ins.clubHallModel.lastClubGameId = -1;
        AppGame.ins.clubHallModel.lastRoomIndex = 0;
    }

    /**初始化俱乐部列表 */
    initClubList(data: ClubHallServer.GetMyClubGameMessageResponse) {
        if (!AppGame.ins.clubHallModel.myClubReqTag) return;
        // UDebug.log('初始化俱乐部列表 data => ', data)
        this._clubId = -1;
        this.clubContent.destroyAllChildren();
        this.clubContent.width = 0;
        this.clearTable();
        if (!data.clubInfos || data.clubInfos.length < 1) {
            this.noClub.opacity = 255;
            AppGame.ins.showUI(ECommonUI.CLUB_HALL_JOIN, { isShowActivity: this._isShowActivity });
            return;
        }
        if (AppGame.ins.clubHallModel.isShowTip && this._isShowActivity) {
            AppGame.ins.showUI(ECommonUI.CLUB_HALL_ACTIVITY);
        }
        this.myAchievement.active = true;
        this.refreshNode.active = true;
        this.noClub.opacity = 0;
        let clubNum = data.clubInfos.length;
        //如果只有一个俱乐部，则默认为选中此俱乐部，如果超过一个俱乐部，则出现“全部”按钮，默认选中“全部”。取消
        // let showAll = clubNum > 1 ? true : false;
        // let len = showAll ? clubNum + 1  : clubNum; //全部
        let len = clubNum;  //temp
        let lastClubIdx = 0;
        for (let i = 0; i < len; i++) {
            let allClubInfo = {
                clubId: 0,
                clubName: '全部'
            }
            let clubInfo = data.clubInfos[i]; //temp
            // 全部
            // let clubInfo = null;
            // if (showAll) {
            //     clubInfo = i == 0 ? allClubInfo : data.clubInfos[i - 1];
            // } else {
            //     clubInfo = data.clubInfos[i];
            // }

            if (clubInfo.clubId === AppGame.ins.clubHallModel.lastClubId) {
                lastClubIdx = i;
            }

            let item = cc.instantiate(this.clubPfb);
            let itemData = {
                callback: this.clickClubItemCallback.bind(this),
                clubInfo: clubInfo
            }
            if (i == clubNum - 1) {
                item.getComponent(VClubItem).init(itemData, true);
            } else {
                item.getComponent(VClubItem).init(itemData);
            }
            item.parent = this.clubContent;
        }

        // this.clubContent.children[0].getComponent(cc.Toggle).isChecked = true;
        // this.clubContent.children[0].getComponent(VClubItem).clubNameLbl.node.color = new cc.Color().fromHEX('#803606');
        // // this._clubId = showAll ? 0 : data.clubInfos[0].clubId;
        // this._clubId = data.clubInfos[0].clubId;
        // this.clubScrollView.stopAutoScroll();
        // this.clubScrollView.scrollToLeft(0);

        this._clubId = data.clubInfos[lastClubIdx].clubId;
        this.scheduleOnce(() => {
            this.clubContent.children[lastClubIdx].getComponent(cc.Toggle).isChecked = true;
            this.clubContent.children[lastClubIdx].getComponent(VClubItem).clubNameLbl.node.color = new cc.Color().fromHEX('#803606');
            // this._clubId = showAll ? 0 : data.clubInfos[0].clubId;
            this.clubScrollView.stopAutoScroll();
            let maxScrollOffset = this.clubScrollView.getMaxScrollOffset();
            this.clubScrollView.scrollToOffset(cc.v2(maxScrollOffset.x * (lastClubIdx + 0.05 * lastClubIdx) / data.clubInfos.length, 0), 0);
        }, 0.15)

        AppGame.ins.clubHallModel.lastClubId = -1;
        this.refreshRoomInfo();
    }

    /**清理桌子 */
    clearTable() {
        if (!this.tableContent) return;
        // cc.warn('清理桌子前 ' + this._tablePool.size())
        for (let i = this.tableContent.childrenCount; i >= 0; i--) {
            let node = this.tableContent.children[i];
            this._tablePool.put(node);
        }
        this.tableContent.width = 0;
        // cc.warn('清理桌子后 ' + this._tablePool.size())
    }

    /**获取桌子 */
    getTableItem(tableType: TableType) {
        let item = null;
        if (this._tablePool.size() > 0) {
            item = this._tablePool.get();
        } else {
            item = cc.instantiate(this.tablePfb);
            this._tablePool.put(item);
        }
        item.getComponent(VClubTableItem).reset(tableType);
        return item;
    }

    /**获取到俱乐部房间信息 设置桌子列表 */
    setTableList(data: ClubGameServer.MSG_S2C_GetRoomInfoResponse) {
        // UDebug.log('获取到俱乐部房间信息 设置桌子列表 => ', data)
        if (!this.tableContent) return;
        this.clearTable();
        this._roomInfo = data;
        if (!data.tableInfos || data.retCode != 0) return;
        let tableType = BrGameList.includes(this._gameId) ? TableType.brc : TableType.dz; //百人场2 其他1
        let len = tableType == TableType.dz ? 2 : data.tableCount;
        //对战类最后一张有人的桌子再加2张空桌子
        if (data.tableInfos.length > 0 && tableType == TableType.dz) {
            let lastTableId = data.tableInfos[data.tableInfos.length - 1].tableId;
            len += lastTableId + 1;
        }
        this._tableCount = len;
        //对战类加一张快速加入的
        len = tableType == TableType.dz ? len + 1 : len;
        this._tableType = tableType;
        this._tableInfos = data.tableInfos;
        // this._tableCount = data.tableCount;
        len = len > LoadTableNumOnce ? LoadTableNumOnce : len;

        for (let i = 0; i < len; i++) {
            let tableInfo = null;
            // if (tableType == 1) {
            //     tableInfo = i == 0 ? null : data.tableInfos[i - 1];
            //     // if (i > data.tableInfos.length) {
            //     //     tableInfo = null;
            //     // }
            // } 
            // else {
            //     if (i >= data.tableInfos.length) {
            //         tableInfo = null;
            //     } else {
            //         tableInfo = data.tableInfos[i];
            //     }
            // }
            let isQuick = (tableType == TableType.dz && i == 0) ? true : false;
            let tableId = isQuick ? -1 : i - 1;
            if (tableType == TableType.brc) {
                tableId = i;
            }
            //有人的
            for (let j = 0; j < data.tableInfos.length; j++) {
                let info = data.tableInfos[j];
                if (info.tableId == tableId) {
                    tableInfo = info;
                }
            }

            let item = this.getTableItem(tableType);
            let tableData = {
                index: i,
                tableId: tableId,
                isQuick: isQuick,
                tableType: tableType,
                callback: this.clickTableItemCallback.bind(this),
                gameInfo: this._gameInfo,
                roomInfo: data,
                tableInfo: tableInfo,
                roomIndex: this._roomIndex,
                roomName: this.roomLblList[this._roomIndex].string
            }
            item.getComponent(VClubTableItem).init(tableData);
            item.parent = this.tableContent;
        }
        this.tableScrollView.stopAutoScroll();
        this.tableScrollView.scrollToLeft(0);
    }

    /**获取到百人场俱乐部房间信息 设置桌子列表 */
    setBrcTableList(data: ClubGameServer.MSG_S2C_GetGameInfoResponse) {
        // UDebug.log('获取到俱乐部房间信息 设置桌子列表 => ', data)
        if (!this.tableContent) return;
        this.clearTable();
        this._roomInfo = data;
        this._tableType = TableType.brc;
        if (!data.roomInfos) return;
        let tableId = 0;
        for (let i = 0; i < data.roomInfos.length; i++) {
            let roomInfo = data.roomInfos[i];
            let tableInfos = roomInfo.tableInfos;
            for (let j = 0; j < tableInfos.length; j++) {
                let tableInfo = tableInfos[j];
                let item = this.getTableItem(TableType.brc);
                let tableData = {
                    index: j,
                    tableId: tableId,
                    isQuick: false,
                    tableType: TableType.brc,
                    callback: this.clickTableItemCallback.bind(this),
                    gameInfo: this._gameInfo,
                    roomInfo: roomInfo,
                    tableInfo: tableInfo,
                }
                item.getComponent(VClubTableItem).init(tableData);
                item.parent = this.tableContent;
                tableId++;
            }
        }
        this.tableScrollView.stopAutoScroll();
        this.tableScrollView.scrollToLeft(0);
    }

    /**点击桌子回调 */
    clickTableItemCallback(tableInfo: any, tableId: number, isQuick: boolean, roomId: number) {
        this._tableId = tableInfo ? tableInfo.tableId : tableId;
        this._roomId = roomId;
        let tableType = BrGameList.includes(this._gameId) ? 2 : 1; //百人场2 其他1
        if (tableType == 2) {
            AppGame.ins.roomModel.requestEnterRoom(this._roomId, this._gameId, false, ERoomKind.Club, this._clubId, this._tableId);
        } else {
            AppGame.ins.clubHallModel.lastRoomIndex = this._roomIndex;

            let gameRoomInfo = AppGame.ins.roomModel.getRoomData(this._gameId, this._roomId);
            let info = {
                gameInfo: this._gameInfo,
                clubRoomInfo: this._roomInfo,
                gameRoomInfo: gameRoomInfo,
                tableInfo: tableInfo,
                tableId: tableId,
                isQuick: isQuick,
                clubId: this._clubId,
                zjhMenpaiLunshu: ZJH_MENPAI_LUNSHU[this._roomIndex]
            }
            AppGame.ins.showUI(ECommonUI.CLUB_ROOMINFO, { info: info });
        }
    }

    /**点击俱乐部回调 */
    clickClubItemCallback(clubId: number) {
        if (this._clubId == clubId) return;
        UDebug.log('点击俱乐部回调 clubId => ', clubId)
        this.clearTable();
        this._clubId = clubId;
        this.clubContent.children.forEach(node => {
            let lblNode = node.getComponent(VClubItem).clubNameLbl.node;
            lblNode.color = new cc.Color().fromHEX('#b08c68');
            if (node.getComponent(cc.Toggle).isChecked) {
                lblNode.color = new cc.Color().fromHEX('#803606');
            }
        });

        this.refreshRoomInfo();
    }

    /**点击百人场游戏回调 */
    clickBrcGameItemCallback(gameInfo: any) {
        if (this._gameId == gameInfo.gameType || gameInfo.gameState == EGameState.WeiHu) return;
        this.clearTable();
        this.tableContent.width = 0;
        let gameId = gameInfo.gameType;
        let item = this._brcGameItemlist[gameId];
        this._gameId = gameId;
        this._gameInfo = gameInfo;
        UDebug.log('百人场---点击游戏回调 gameId => ', gameId)
        for (let key in this._brcGameItemlist) {
            let gameItem = this._brcGameItemlist[key];
            let isChecked = gameItem.getGameId() == gameId;
            gameItem.setIsChecked(isChecked);
        }
        this.setGameUpdate(gameId, item);
    }

    /**点击游戏回调 */
    clickGameItemCallback(gameInfo: any) {
        if (this._gameId == gameInfo.gameType || gameInfo.gameState == EGameState.WeiHu || (gameInfo.gameType == BrcGameId && BrGameList.includes(this._gameId))) {
            UDebug.log('重复点击 _gameId => ', this._gameId)
            return;
        };
        this.clearTable();
        this.tableContent.width = 0;
        this.roomTypeContent.children[0].getComponent(cc.Toggle).isChecked = true;
        this._roomIndex = 0;
        let gameId = gameInfo.gameType;
        this._leftGameId = gameId;
        this._gameId = gameId;
        this._gameInfo = gameInfo;
        this.setRoomListInfo();
        UDebug.log('111点击游戏回调 this._gameId => ', this._gameId)

        let item = this._gameItemlist[gameId];
        if (gameInfo.gameType == BrcGameId) {
            this.initBrcGameList();
            this.brcGameList.active = true;
        } else {
            this.brcGameList.active = false;
        }

        for (let key in this._gameItemlist) {
            let gameItem = this._gameItemlist[key];
            let isChecked = gameItem.getGameId() == gameInfo.gameType;
            gameItem.setIsChecked(isChecked);
        }

        UDebug.log('222点击游戏回调 this._gameId => ', this._gameId)
        if (gameId == BrcGameId) {
            if (cc.sys.isNative) {
                this._hots.forEach(element => {
                    if (element.gameId == ClubBrcGameSort[0] && element.isupdated) {
                        this.refreshRoomInfo();
                    }
                });
            } else {
                this.refreshRoomInfo();
            }
            return;
        };

        this.setGameUpdate(gameId, item);
    }

    /**设置游戏更新 */
    setGameUpdate(gameId: number, item: any) {
        UDebug.log('设置游戏更新 updatingGameIdList => ', AppGame.ins.hallModel.updatingGameIdList)
        if (AppGame.ins.hallModel.updatingGameIdList.includes(gameId)) {
            AppGame.ins.showTips('游戏已在更新中，请等待');
            return;
        }

        let hot: UGameHotUpdate = null;
        let status: EGameUpdateStatus = null;
        this._hots.forEach(element => {
            if (element.gameId == gameId) {
                hot = element;
            }
        });
        if (cc.sys.isNative) {
            if (hot.isupdated) {
                status = EGameUpdateStatus.Updated;
            } else {
                status = EGameUpdateStatus.Update;
            }
        } else {
            status = EGameUpdateStatus.Updated;
        }
        switch (status) {
            case EGameUpdateStatus.Update:
                {
                    if (this._clickGameList.length == 0) {
                        this.gameDownload(gameId)
                    }
                    if (!this._clickGameList.includes(gameId)) {
                        this._clickGameList.push(gameId)
                        if (!AppGame.ins.hallModel.updatingGameIdList.includes(gameId)) {
                            AppGame.ins.hallModel.updatingGameIdList.push(gameId);
                        }
                        item.setUpdateStatus(EGameUpdateStatus.Updating);
                    }
                }
                break;
            case EGameUpdateStatus.Updated:
                {
                    this.refreshRoomInfo();
                }
                break;
        }
    }

    /**点击房间类型 */
    onClickRoomType(toggle: cc.Toggle, customData: string) {
        this.playclick();
        if (this._roomIndex == parseInt(customData)) return;
        UDebug.log('点击房间类型 => ' + customData)
        this._roomIndex = parseInt(customData);
        this.refreshRoomInfo();
    }

    /**设置房间列表信息 */
    setRoomListInfo() {
        // UDebug.log('_gameId=> ', this._gameId, ' this._gameInfo=> ' + JSON.stringify(this._gameInfo))
        if (BrGameList.includes(this._gameId) || this._gameId == BrcGameId) {
            this.roomList.active = false;
            return;
        }

        this.roomList.active = true;
        // let getGameInfo = AppGame.ins.hallModel.getGameInfo(this._gameId);
        let roomListInfo = AppGame.ins.roomModel.getRoomListInfo(this._gameId);
        // UDebug.log('游戏信息 => ' + JSON.stringify(getGameInfo))
        // UDebug.log('所有房间信息 => ' + JSON.stringify(roomListInfo))
        // UDebug.log('当前房间信息 => ' + JSON.stringify(roomListInfo[this._roomIndex]))

        for (let i = 0; i < this.roomLblList.length; i++) {
            let lbl = this.roomLblList[i];
            let dizhu = roomListInfo[i].dizu / COIN_RATE;
            //不同游戏展示不一样
            switch (this._gameId) {
                case EGameType.ZJH:
                    lbl.string = dizhu + '元必闷' + ZJH_MENPAI_LUNSHU[i] + '轮';
                    break;
                case EGameType.DDZ:
                    lbl.string = dizhu + '元/' + '斗地主';
                    break;
                case EGameType.PDK:
                    lbl.string = dizhu + '元/一张';
                    break;
                case EGameType.TBNN:
                    lbl.string = '通比牛' + dizhu + '元底';
                    break;
                case EGameType.SG:
                    lbl.string = '三公' + dizhu + '元底';
                    break;
                case EGameType.KPQZNN:
                    lbl.string = '看牌牛牛' + dizhu + '元底';
                    break;
                case EGameType.SH:
                    lbl.string = dizhu + '元/' + '梭哈';
                    break;
                case EGameType.SSS:
                    lbl.string = '十三水' + dizhu + '元底';
                    break;
                default:
                    lbl.string = '';
                    break;
            }
        }
    }

    /**刷新俱乐部服务信息 */
    refreshRoomInfo(isShowTip: boolean = true) {
        // if (this._gameId == BrcGameId) return;
        //先刷新房间id
        let roomListInfo = AppGame.ins.roomModel.getRoomListInfo(this._gameId);
        this._roomId = roomListInfo[this._roomIndex].type;

        let roomId = this._roomId;
        if (BrGameList.includes(this._gameId)) {
            roomId = 0;
        }

        UDebug.log('请求 refreshRoomInfo _gameId => ', this._gameId + ' roomId => ' + roomId + ' _clubId =>' + this._clubId)

        let isUpdated = true;
        if (cc.sys.isNative) {
            this._hots.forEach(element => {
                if (element.gameId == this._gameId) {
                    isUpdated = element.isupdated;
                }
            });
        }

        if (this._gameId != -1 && roomId != -1 && this._clubId != -1 && isUpdated) {
            //请求房间信息前要先请求游戏服务信息
            this.scheduleOnce(() => {
                !isShowTip && (AppGame.ins.clubHallModel.isShowTip = false);
                AppGame.ins.roomModel.requestClubGameServer(false, this._gameId, roomId, this._clubId);
            }, 0.01)
        }
    }

    /**刷新添加桌子 */
    refreshAddTables() {
        if (BrGameList.includes(this._gameId)) return;
        let totalTableCount = this._tableType == TableType.brc ? this._tableCount : this._tableCount + 1;
        if (this.tableContent.childrenCount < totalTableCount) {
            AppGame.ins.showConnect(true);
            let remainTableCount = totalTableCount - this.tableContent.childrenCount;
            let addCount = remainTableCount > LoadTableNumOnce ? LoadTableNumOnce : remainTableCount;
            let tableIdFrom = this._tableType == TableType.brc ? this.tableContent.childrenCount : this.tableContent.childrenCount - 1;
            UDebug.log('刷新添加桌子 addCount => ', addCount)
            for (let i = 0; i < addCount; i++) {
                let tableInfo = null;
                let tableId = tableIdFrom + i;

                for (let j = 0; j < this._tableInfos.length; j++) {
                    let info = this._tableInfos[j];
                    if (info.tableId == tableId) {
                        tableInfo = info;
                    }
                }

                let item = this.getTableItem(this._tableType);
                let tableData = {
                    index: this.tableContent.childrenCount,
                    tableId: tableId,
                    isQuick: false,
                    tableType: this._tableType,
                    callback: this.clickTableItemCallback.bind(this),
                    gameInfo: this._gameInfo,
                    roomInfo: this._roomInfo,
                    tableInfo: tableInfo,
                    roomIndex: this._roomIndex,
                    roomName: this.roomLblList[this._roomIndex].string
                }
                item.getComponent(VClubTableItem).init(tableData);
                item.parent = this.tableContent;
            }

            this.scheduleOnce(() => {
                AppGame.ins.showConnect(false);
            }, 0.25)
        }
    }

    /**滚动到右边 */
    onEventScrollToRight() {
        this.refreshAddTables();
    }

    /**重置数据 */
    resetData() {
        this._clubId = -1;
        this._gameId = -1;
        this._roomId = -1;
        this._tableId = -1;
        this._roomIndex = 0;
        this._leftGameId = EGameType.ZJH;

        this.clearTable();
        this.clubContent.destroyAllChildren();
        this.clubContent.width = 0;
        this.roomList.active = true;
        this.brcGameList.active = false;
    }

    /**点击刷新 */
    onClickRefresh() {
        this.refreshRoomInfo(true);
        this.playclick();
    }

    /**点击客服 */
    onClickService() {
        AppGame.ins.showUI(ECommonUI.LB_Service_Mail, { type: EBtnType.service, data: { service_type: 2 } });
        this.playclick();
    }

    /**点击活动 */
    onClickActivity() {
        AppGame.ins.showUI(ECommonUI.CLUB_HALL_ACTIVITY);
        this.playclick();
    }

    /**点击我的战绩 */
    onClickMyAchievement() {
        AppGame.ins.showUI(ECommonUI.UI_CLUB, { Vindex: 5 });
        this.playclick();
    }

    /**点击创建俱乐部 */
    onClickCreateClub() {
        AppGame.ins.showUI(ECommonUI.UI_CREATE_CLUB);
        this.playclick();
    }

    /**点击我的俱乐部 */
    onClickMyClub() {
        AppGame.ins.showUI(ECommonUI.UI_CLUB);
        AppGame.ins.clubHallModel.isAutoRefreshTable = false;
        this.playclick();
    }

    /**点击充值 */
    onClickRecharge() {
        AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true, index: 0 });
    }

    //下载游戏
    gameDownload(gameId: number): void {
        let hot: UGameHotUpdate = null;
        this._hots.forEach(element => {
            if (element.gameId == gameId) {
                hot = element;
            }
        });
        hot.hotUpdate();

        let item = this.getGameItem(gameId);
        if (!item) return;
        item.setUpdateStatus(EGameUpdateStatus.Updating);
    }

    /******************************子游戏更新回调**********************************/

    /**更新进度 */
    private subUpdateProgression(gameId: number, value: number) {
        let item = this.getGameItem(gameId);
        if (!item) return;
        item.setProccess(value);
    }

    /**更新完成 */
    private subUpdateFinished(gameId: EGameType) {
        UDebug.log('c更新完成 gameId => ', gameId);
        let item = this.getGameItem(gameId);
        if (!item) return;
        item.setUpdateStatus(EGameUpdateStatus.Updated);
    }

    /**发现新版本 */
    private subNewVersionFound(gameId: EGameType) {
        UDebug.log('club 发现新版本 gameId => ', gameId);
        let item = this.getGameItem(gameId);
        if (!item) return;
        item.setUpdateStatus(EGameUpdateStatus.Update);

        //百人场第一个游戏直接下载或者塞入队列
        if (gameId == ClubBrcGameSort[0]) {
            if (this._clickGameList.length == 0) {
                this.gameDownload(gameId)
            }
            if (!this._clickGameList.includes(gameId)) {
                this._clickGameList.push(gameId)
                item.setUpdateStatus(EGameUpdateStatus.Updating);
            }
            if (!AppGame.ins.hallModel.updatingGameIdList.includes(gameId)) {
                AppGame.ins.hallModel.updatingGameIdList.push(gameId);
            }
        }
    }

    /**已经更新到最新 */
    private subAlreadyUpdate(gameId: EGameType, isCheck: boolean = true) {
        UDebug.log('club 已经更新到最新 gameId => ' + gameId + ' this._clickGameList => ' + this._clickGameList);
        UDebug.log('club 已经更新到最新 gameId => ' + gameId + ' updatingGameIdList => ' + AppGame.ins.hallModel.updatingGameIdList);

        this._hots.forEach(element => {
            if (element.gameId == gameId) {
                element.isupdated = true;
            }
        });

        let idx2 = this._clickGameList.indexOf(gameId); 
        if (idx2 != -1) {
            this._clickGameList.splice(idx2, 1)
        }
        UDebug.log('club 已经更新到最新 idx2 => ' + idx2 + ' this._clickGameList => ' + this._clickGameList);

        let idx = AppGame.ins.hallModel.updatingGameIdList.indexOf(gameId); 
        if (idx != -1) {
            AppGame.ins.hallModel.updatingGameIdList.splice(idx, 1);
        }
        UDebug.log('club 已经更新到最新 idx => ' + idx + ' updatingGameIdList => ' + AppGame.ins.hallModel.updatingGameIdList);

        //查找等待更新队列
        if (this._clickGameList.length > 0) {
            this.gameDownload(this._clickGameList[0])
        }

        UDebug.log('isCheck => ' + isCheck + 'this._gameId => ' + this._gameId);

        //非检测更新完成
        if (!isCheck) {
            if (gameId == this._gameId) {
                this.refreshRoomInfo();
            }
            AppGame.ins.hallModel.emit(MHall.UPDATE_GAME_FINISHED_CLUB, gameId);
        } else {
            if (gameId == this._gameId){
                this.refreshRoomInfo();
            }
        }

        let item = this.getGameItem(gameId);
        if (!item) return;
        item.setUpdateStatus(EGameUpdateStatus.Updated);
    }

    /**更新失败 */
    private subUpdateFailed(gameId: number) {
        UDebug.log('club 更新失败 => ', gameId);
        this._failGameId = gameId;
    }

    private getGameItem(gameId: number): any {
        let item = null;
        if (BrGameList.includes(gameId)) {
            if (this._brcGameItemlist && this._brcGameItemlist[gameId]) {
                item = this._brcGameItemlist[gameId];
            }
        } else if (this._gameItemlist && this._gameItemlist[gameId]){
            item = this._gameItemlist[gameId];
        }
        return item;
    }

}
