import { EGameType, ERoomKind } from './../../common/base/UAllenum';
import { UpdaterEvent } from "./UHotData";
import UDebug from "../../common/utility/UDebug";
import cfg_game from "../../config/cfg_game";
import cfg_global from '../../config/cfg_global';
import cfg_friends from '../../config/cfg_friends';

/**
 * 子游戏更新
 */
export default class UGameHotUpdate extends cc.EventTarget {
    /**下载管理 */
    private _am: any;
    /**游戏名 */
    private _name: string = "";
    /**写入路径 */
    private _storagePath: string = "";
    /**回调 */
    private versionCompareHandle: any;
    /**是否正在更新 */
    private _updating: boolean = false;
    /**
     * 是否已经更新完毕
     */
    private _isupdated: boolean = false;
    /**
     * 是否已经检查过更新
     */
    private _ischeck: boolean = false;
    /**
     * 是否已经加载完毕
     */
    private _isloaded: boolean = false;

    /**重试 */
    private _canRetry: boolean = false;
    /**重试次数 */
    private _retryTime: number = 0;
    /**游戏ID */
    private _gameId: number;
    /**是否是重连的更新 */
    private _isReconnectUpdate: boolean = false;
    /**
     * 更新的游戏ID
     */
    get gameId(): number {
        return this._gameId;
    }
    /**
     * 游戏缩略名字
     */
    get abbreviateName(): string {
        return this._name;
    }
    /**
     * 游戏是否已经检查过更新
     */
    get ischeck(): boolean {
        return this._ischeck;
    }
    /**
    * 是否在更新中
    */
    get isupdating(): boolean {
        return this._updating;
    }
    /**
     * 游戏是否已经加载
     */
    get isloaded(): boolean {
        return this._isloaded;
    }
    /**
     * 是否已经完毕
     */
    get isupdated(): boolean {
        return this._isupdated;
    }

    set isupdated(v: boolean) {
        this._isupdated = v;
    }

    constructor(gameId: number, roomKind: ERoomKind) {
        super();
        this._gameId = gameId;
        if (roomKind == ERoomKind.Normal) {
            if (cfg_game[gameId])
                this._name = cfg_game[gameId].abbreviateName;
        } else if (roomKind == ERoomKind.Friend) {
            if (cfg_friends[gameId])
                this._name = cfg_friends[gameId].abbreviateName;
        }

        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'game-remote-asset/assets/' + this._name);
        this.versionCompareHandle = (versionA, versionB) => {
            if (!cfg_global.isSubHot) return 0;
            UDebug.log(this._name + ": JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB)
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            }
            else {
                return 0;
            }
        };
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
        //实现验证回调函数
        this._am.setVerifyCallback(this.verificationFile.bind(this));
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._am.setMaxConcurrentTask(8);
        } else {
            this._am.setMaxConcurrentTask(12);
        }
    }
    /**
     * MD5验证回调
     */
    private verificationFile(path, asset): boolean {
        //UDebug.log("asset:" + JSON.stringify(asset));
        return true;
    }

    //开始检测
    checkUpdate(isReconnectUpdate: boolean = false): void {
        UDebug.log('开始检测 gameId=> ' + this._gameId + ' isReconnectUpdate => ' + isReconnectUpdate + ' updating => ' + this._updating)
        if (!cc.sys.isNative || this._gameId == EGameType.ZJH) {
            this.emit(UpdaterEvent.SUB_ALREADY_UP_TO_DATE, this._gameId);
            this._isupdated = true;
            return;
        }
        if (this._updating) return;

        this._isReconnectUpdate = isReconnectUpdate;

        this._am.setEventCallback(null);

        // if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
        //正式服
        var hotUrl = ""
        if (cfg_global.env == 2) {
            hotUrl = "https://shqp-hot.oss-accelerate.aliyuncs.com/" + this._name + "/"
        }
        //预发布
        else if (cfg_global.env == 3) {
            hotUrl = "https://hot-yfb.oss-accelerate.aliyuncs.com/" + this._name + "/"
        }
        //测试服
        else {
            hotUrl = "http://192.168.128.224:90/" + this._name + "/"
        }
        let customManifestStr = JSON.stringify(
            {
                "packageUrl": hotUrl,
                "remoteManifestUrl": hotUrl + this._name + ".manifest",
                "remoteVersionUrl": hotUrl + this._name + "-ver.manifest",
                "version": "1.0.0",
                "assets": {},
                "searchPaths": []
            })
        let localMainfestUrl = this._storagePath + "/project.manifest";
        let bExist = jsb.fileUtils.isFileExist(localMainfestUrl);
        if (!bExist) {
            if (!jsb.fileUtils.isDirectoryExist(this._storagePath)) {
                jsb.fileUtils.createDirectory(this._storagePath);
            }
            jsb.fileUtils.writeStringToFile(customManifestStr, localMainfestUrl);
        }
        this._am.loadLocalManifest(localMainfestUrl);
        this._ischeck = false;
        this._am.setEventCallback(this.checkCb.bind(this));
        this._am.checkUpdate();
        // }
    }

    //检测结果
    private checkCb(event): void {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.emit(UpdaterEvent.SUB_UPDATE_FAILED, this._gameId);
                UDebug.log("检测结果：不存在本地版本文件" + this._gameId);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.emit(UpdaterEvent.SUB_UPDATE_FAILED, this._gameId);
                UDebug.log('检测结果：下载远程版本文件失败 ' + this._gameId)
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                UDebug.log("检测结果：已经更新到最新版本" + this._gameId);
                this._ischeck = true;
                this._isupdated = true;
                this.emit(UpdaterEvent.SUB_ALREADY_UP_TO_DATE, this._gameId);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                UDebug.log("检测结果：发现了新版本 " + this._gameId);
                this._updating = false;
                this._ischeck = true;
                this._isupdated = false;
                if (this._isReconnectUpdate) {
                    this.hotUpdate();
                } else {
                    this.emit(UpdaterEvent.SUB_NEW_VERSION_FOUND, this._gameId);
                }
                break;
            default:
                return;
        }
        this._updating = false;
        this._isReconnectUpdate = false;
    }

    //开始更新
    hotUpdate() {
        UDebug.log('开始更新 ' + this._name)
        this._am.setEventCallback(null);
        this._am.setEventCallback(this.updateCb.bind(this));
        this._am.update();
        this._updating = true;
    }

    //更新结果
    private updateCb(event) {
        var needRestart = false;
        var failed = false;
        var isFinish = false;
        this._isupdated = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                UDebug.log("不存在本地mainfest文件 gameId => " + this._gameId);
                failed = true;
                this.emit(UpdaterEvent.SUB_UPDATE_FAILED, this._gameId);
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                if (event.getPercent()) {
                    this.emit(UpdaterEvent.SUB_UPDATE_PROGRESSION, this._gameId, event.getPercent());
                }
                var msg = event.getMessage();
                if (msg) {
                    UDebug.log(this._gameId + ' 准备更新：' + msg);
                }
                UDebug.log(this._gameId + ' ---更新中--- ');
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                UDebug.log("下载远端mainfes文件失败 gameId => " + this._gameId)
                failed = true;
                this.emit(UpdaterEvent.SUB_UPDATE_FAILED, this._gameId);
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                UDebug.log("解析mainfest文件失败 gameId => " + this._gameId)
                failed = true;
                this.emit(UpdaterEvent.SUB_UPDATE_FAILED, this._gameId);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                UDebug.log("已经更新到远端最新版本 gameId => " + this._gameId)
                this._isupdated = true;
                isFinish = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                UDebug.log("更新完成 gameId => " + this.gameId);
                needRestart = false;
                isFinish = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                UDebug.Log('失败的文件: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                UDebug.Log("更新失败 gameId => " + this.gameId);
                this._updating = false;
                this._canRetry = true;
                this.retry();
                this.emit(UpdaterEvent.SUB_UPDATE_FAILED, this._gameId);
                break;
            default:
                UDebug.Log("更新default gameId => " + this.gameId + ' code => ' + event.getEventCode())
                break;
        }
        if (isFinish) {
            this._am.setEventCallback(null);
            this._isupdated = true;
            this.emit(UpdaterEvent.SUB_ALREADY_UP_TO_DATE, this._gameId, false);
        }
        if (failed) {
            this._am.setEventCallback(null);
            this._updating = false;
        }
    }

    /**
     * 重试
     */
    retry(): void {
        if (this._retryTime > 2) {
            this._retryTime = 0;
            UDebug.log('失败三次了')
            jsb.fileUtils.removeDirectory(this._storagePath);
            jsb.fileUtils.removeDirectory(this._storagePath + '_temp/');
            return;
        }
        UDebug.log('重试 this._retryTime => ', this._retryTime)
        if (!this._updating && this._canRetry) {
            this._canRetry = false;
            this._retryTime++;
            this._am.downloadFailedAssets();
        }
    }
}
