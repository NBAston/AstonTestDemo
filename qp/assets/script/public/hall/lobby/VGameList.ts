import VHall from "./VHall";
import VGameItem from "./VGameItem";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UHandler from "../../../common/utility/UHandler";
import { EGameType, EGameState, EGameUpdateStatus, ERoomKind } from "../../../common/base/UAllenum";
import { UIGameItem, SysEvent } from "../../../common/base/UAllClass";
import USpriteFrames from "../../../common/base/USpriteFrames";
import VHallMusic from "./VHallMusic";
import { UHotManager } from "../../hot/UHotManager";
import { UpdaterEvent } from "../../hot/UHotData";
import AppGame from "../../base/AppGame";
import UDebug from "../../../common/utility/UDebug";
import cfg_game from "../../../config/cfg_game";
import UGameHotUpdate from "../../hot/UGameHotUpdate";
import MHall from "./MHall";


const { ccclass, property } = cc._decorator;
/**
 * 创建:gj
 * 作用:游戏列表入口
 */
export default class VGameList {

    protected checkOver: UHandler;
    /**
     * 根节点
     */
    private _root: cc.Node;
    /**
     * 大厅
     */
    private _hall: VHall;
    /**
     * 实例放置节点
     */
    private _itemRoot: cc.Node;
    /**
     * 缓存
     */
    private _cache: { [key: string]: VGameItem };

    /**通过gametype获取游戏项 */

    private _gamelist: { [key: number]: VGameItem };

    private _res: USpriteFrames;

    private _music: VHallMusic;

    private _node: cc.Node;

    private _check: { [key: number]: boolean } = {};

    private _gameItemPrefab: cc.Prefab;

    private _hots: Array<UGameHotUpdate>;

    private _clickGameList: Array<number> = [];

    private _failGameId: number = 0;

    private _touchBlock: boolean = false; //点击保护
    /**
     * 初始化
     */
    private init(): void {
        this._hots = [];
        this._check = {};
        this._cache = {};
        this._gamelist = {};
        this._node = UNodeHelper.find(this._root, "gamenode");
        this._node.setPosition(0, 0);
    }

    getHotsList() {
        return this._hots;
    }

    addGameItem(datas: Array<UIGameItem>): void {
        let length = datas.length;
        this._itemRoot = UNodeHelper.find(this._root, "gamenode/gameitem/view/content");
        let columnLength = Math.ceil(length / 2);
        let itemWidth = 300;
        let spacingX = 15;
        let left = 10;
        this._itemRoot.width = columnLength * itemWidth + columnLength * spacingX  + left;
        for (let index = 0; index < length; index++) {
            let element = cc.instantiate(this._gameItemPrefab);
            element.parent = this._itemRoot;
            if (index % 2 == 0) {
                element.y = 152;
            } else {
                element.y = -95;
            }
            element.x = left + itemWidth * Math.floor(index / 2) + itemWidth / 2 + spacingX * Math.floor(index / 2);
            let item = new VGameItem();
            element.active = false;
            item.init(element, this._res);
            item.clickHandler = new UHandler(this.gameenterClick, this);
            this._cache[index] = item;
        }
    }
    /*******流程*****
     * 1.进大厅,检查子游戏版本,是否可更新
     * 2.更新包括第一次安装 与 后来版本迭代
     * 
    */
    private unregester(): void {
        UHotManager.Ins.off(UpdaterEvent.SUB_UPDATE_FINISHED, this.sub_update_finished, this);
        UHotManager.Ins.off(UpdaterEvent.SUB_UPDATE_PROGRESSION, this.sub_update_progression, this);
        AppGame.ins.hallModel.off(MHall.HALL_RECONNECT, this.onHallReconnect, this);
    }
    private regester(): void {
        UHotManager.Ins.on(UpdaterEvent.SUB_UPDATE_FINISHED, this.sub_update_finished, this);
        UHotManager.Ins.on(UpdaterEvent.SUB_UPDATE_PROGRESSION, this.sub_update_progression, this);
        AppGame.ins.hallModel.on(MHall.HALL_RECONNECT, this.onHallReconnect, this);
    }

    private onHallReconnect() {
        UDebug.log('onHallReconnect hall重连 更新失败子游戏id => ', this._failGameId)
        UDebug.log('onHallReconnect hall重连 子游戏更新中列表 => ', AppGame.ins.hallModel.updatingGameIdList)
        UDebug.log('onHallReconnect hall重连 子游戏更新点击列表 => ', this._clickGameList)
        if (AppGame.ins.hallModel.updatingGameIdList.length > 0) {
            this._hots.forEach(hot => {
                if (this._failGameId == hot.gameId) {
                    this._failGameId = 0;
                    let index = this._hots.indexOf(hot);
                    this._hots.splice(index, 1);

                    hot.off(UpdaterEvent.SUB_UPDATE_FAILED, this.sub_update_failed, this);
                    hot.off(UpdaterEvent.SUB_ALREADY_UP_TO_DATE, this.sub_already_up_to_date, this);
                    hot.off(UpdaterEvent.SUB_NEW_VERSION_FOUND, this.sub_new_version_found, this);
                    hot.off(UpdaterEvent.SUB_UPDATE_FINISHED, this.sub_update_finished, this);
                    hot.off(UpdaterEvent.SUB_UPDATE_PROGRESSION, this.sub_update_progression, this);

                    let hotNew = new UGameHotUpdate(hot.gameId, ERoomKind.Normal);
                    hotNew.on(UpdaterEvent.SUB_UPDATE_FAILED, this.sub_update_failed, this);
                    hotNew.on(UpdaterEvent.SUB_ALREADY_UP_TO_DATE, this.sub_already_up_to_date, this);
                    hotNew.on(UpdaterEvent.SUB_NEW_VERSION_FOUND, this.sub_new_version_found, this);
                    hotNew.on(UpdaterEvent.SUB_UPDATE_FINISHED, this.sub_update_finished, this);
                    hotNew.on(UpdaterEvent.SUB_UPDATE_PROGRESSION, this.sub_update_progression, this);
                    this._hots.push(hotNew);
                    hotNew.checkUpdate(true);
                }
            });
        }
    }

    private sub_update_finished(gameId: number): void {
        UDebug.log('VGameList sub_update_finished gameId => ', gameId)
        if (this._gamelist && this._gamelist[gameId]) {
            var item = this._gamelist[gameId];
            item.setUpdateStatus(EGameUpdateStatus.Updated);
            //fa

        }
    }
    private sub_update_progression(gameId: number, value: number): void {
        if (this._gamelist && this._gamelist[gameId]) {
            var item = this._gamelist[gameId];
            item.setProccess(value);
        }
    }

    //点击游戏
    gameenterClick(gameId: number): void {
        var item = this._gamelist[gameId];
        if (item._data.gameState == EGameState.WeiHu) return

        if (this._touchBlock) {
            UDebug.log('touchBlock touchBlock touchBlock');
            return;
        }
        this._touchBlock = true;
        setTimeout(() => {
            this._touchBlock = false;
        }, 300);

        UDebug.log(gameId, ' hall点击游戏 updatingGameIdList => ', AppGame.ins.hallModel.updatingGameIdList)
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
                    AppGame.ins.hallModel.enterRoomLobby(gameId);
                }
                break;
        }
        this._music.playclick();
    }

    //下载游戏
    gameDownload(gameId: number): void {
        UDebug.log('下载游戏 ' + gameId)
        let hot: UGameHotUpdate = null;
        this._hots.forEach(element => {
            if (element.gameId == gameId) {
                hot = element;
            }
        });
        hot.hotUpdate();
        var item = this._gamelist[gameId];
        item.setUpdateStatus(EGameUpdateStatus.Updating);
    }


    /************  子包更新相关end *******************/
    //#endregion
    /**
     * 构造函数
     * @param root 根节点
     * @param hall 大厅
     */
    constructor(gameItemPrefab: cc.Prefab, root: cc.Node, hall: VHall, res: USpriteFrames, music: VHallMusic) {
        this._res = res;
        this._root = root;
        this._hall = hall;
        this._music = music;
        this._gameItemPrefab = gameItemPrefab;
        this.init();
    }
    /**
     * 初始化游戏入口
     * @param datas 
     */
    intGameList(datas: Array<UIGameItem>): void {
        this.addGameItem(datas);
        let len = datas.length;
        if (cc.sys.isNative) {
            var path = jsb.fileUtils.getSearchPaths();
            var write_path = jsb.fileUtils.getWritablePath();
            var hotPath = write_path + "/game-remote-asset/"
            if (!jsb.fileUtils.isDirectoryExist(hotPath)) {
                jsb.fileUtils.createDirectory(hotPath);
            }
            path.unshift(hotPath);
            jsb.fileUtils.setSearchPaths(path);
        }
        for (let i = 0; i < len; i++) {
            let dt = datas[i];
            this._cache[i].bind(dt);
            this._gamelist[dt.gameType] = this._cache[i];
            if (cc.sys.isNative) {
                let hot = new UGameHotUpdate(dt.gameType, ERoomKind.Normal);
                hot.on(UpdaterEvent.SUB_UPDATE_FAILED, this.sub_update_failed, this);
                hot.on(UpdaterEvent.SUB_ALREADY_UP_TO_DATE, this.sub_already_up_to_date, this);
                hot.on(UpdaterEvent.SUB_NEW_VERSION_FOUND, this.sub_new_version_found, this);
                hot.on(UpdaterEvent.SUB_UPDATE_FINISHED, this.sub_update_finished, this);
                hot.on(UpdaterEvent.SUB_UPDATE_PROGRESSION, this.sub_update_progression, this);
                this._hots.push(hot);
                hot.checkUpdate();
            } else {
                var status: EGameUpdateStatus = EGameUpdateStatus.Updated;
                this._gamelist[dt.gameType].setUpdateStatus(status);
            }
        }
        this.onresize();
        this.regester();
    }
    /**
     * 重置游戏入口
     */
    resetGameList(): void {
        this.unregester();
    }
    onresize(): void {

        let size = cc.view.getFrameSize();
        let gameitem = UNodeHelper.getComponent(this._node, 'gameitem', cc.ScrollView);
        let view = UNodeHelper.find(gameitem.node, 'view');
        let radio = (size.width / size.height) / (1280 / 720);

        radio = radio < 1 ? 1 : radio;
        gameitem.node.width = 1280 * radio;
        view.width = 1280 * radio;

        let ct = UNodeHelper.find(this._node, 'gameitem/view/content');
        if (view.width >= gameitem.content.width) {
            this._node.getComponent(cc.Widget).isAlignLeft = false;
            this._node.getComponent(cc.Widget).isAlignHorizontalCenter = true;
            this._node.getComponent(cc.Widget).horizontalCenter = -100;
            this._node.getComponent(cc.Widget).updateAlignment();
        } else {
            this._node.getComponent(cc.Widget).isAlignLeft = true;
            this._node.getComponent(cc.Widget).isAlignHorizontalCenter = false;
            this._node.getComponent(cc.Widget).left = 0;
            this._node.getComponent(cc.Widget).updateAlignment();
        }
    }

    /*....................................gameUpdate callBack start..................................*/
    //更新完成
    sub_already_up_to_date(gameId: EGameType, isCheck: boolean = true) {
        UDebug.log('hall 已经更新到最新 gameId => ' + gameId + ' this._clickGameList => ' + this._clickGameList);
        UDebug.log('hall 已经更新到最新 gameId => ' + gameId + ' updatingGameIdList => ' + AppGame.ins.hallModel.updatingGameIdList);

        if (this._gamelist && this._gamelist[gameId]) {
            var item = this._gamelist[gameId];
            item.setUpdateStatus(EGameUpdateStatus.Updated);
        }

        let idx2 = this._clickGameList.indexOf(gameId); 
        if (idx2 != -1) {
            this._clickGameList.splice(idx2, 1)
        }
        UDebug.log('hall 已经更新到最新 idx2 => ' + idx2 + ' this._clickGameList => ' + this._clickGameList);

        let idx = AppGame.ins.hallModel.updatingGameIdList.indexOf(gameId); 
        if (idx != -1) {
            AppGame.ins.hallModel.updatingGameIdList.splice(idx, 1);
        }
        UDebug.log('hall 已经更新到最新 idx => ' + idx + ' updatingGameIdList => ' + AppGame.ins.hallModel.updatingGameIdList);

        //查找等待更新队列
        if (this._clickGameList.length > 0) {
            this.gameDownload(this._clickGameList[0])
        }

        /**俱乐部内更新过了 刷新一下状态 */
        this._hots.forEach(element => {
            if (element.gameId == gameId) {
                element.isupdated = true;
            }
        });

        UDebug.log('isCheck => ' + isCheck);

        //非检测更新完成
        if (!isCheck) {
            AppGame.ins.hallModel.emit(MHall.UPDATE_GAME_FINISHED_HALL, gameId);
        }

        this._failGameId = 0;
    }

    //发现新版本
    sub_new_version_found(gameId: EGameType) {
        UDebug.log('sub_new_version_found', gameId);
        if (this._gamelist && this._gamelist[gameId]) {
            var item = this._gamelist[gameId];
            item.setUpdateStatus(EGameUpdateStatus.Update);
        }
    }

    //更新失败
    sub_update_failed(gameId: number) {
        UDebug.log('hall 更新失败 => ', gameId);
        this._failGameId = gameId;
    }
}
