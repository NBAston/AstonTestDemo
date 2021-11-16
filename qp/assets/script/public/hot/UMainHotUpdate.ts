import UDebug from "../../common/utility/UDebug";
import { UHotManager, search_key, projName } from "./UHotManager";
import { UpdaterEvent } from "./UHotData";
import UDateHelper from "../../common/utility/UDateHelper";
import ErrorLogUtil, { LogLevelType } from "../errorlog/ErrorLogUtil";
import AppGame from "../base/AppGame";
import { EMsgType } from "../../common/base/UAllenum";
import cfg_global from "../../config/cfg_global";

/**
 * 创建:dz
 * 作用:测试下整包游戏
 */
export default class UMainHotUpdate extends cc.EventTarget {

    /**主包路径 */
    private _storagePath: string = "";
    private versionCompareHandle: any;
    private _am: any;

    /**是否正在更新 */
    private _updating: boolean = false;
    /**重试按钮显示 */
    private _canRetry: boolean = false;
    /**重试次数 */
    private _retryTime: number = 0;

    private _resver = "0.0.0.0";
    /**子包根据名字获取路径 key是子包包名 */
    private _subPath: { [key: string]: string } = {};

    /**
     * 初始化
     * @param hander 
     */
    init(): void {
        // Hot update is only available in Native build
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'game-remote-asset');
        UDebug.Log('main Storage path for remote asset : ' + JSON.stringify(this._storagePath));
        var self = this;
        this.versionCompareHandle = (versionA, versionB) => {
            UDebug.Log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
            self._resver = versionB;
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
        // Init with empty manifest url for testing custom manifest
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);

        // var self = this;
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback((path: string, asset: any) => {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            // var compressed = asset.compressed;
            // // Retrieve the correct md5 value.
            // var expectedMD5 = asset.md5;
            // // asset.path is relative path and path is absolute.
            // var relativePath = asset.path;
            // // The size of asset file, but this value could be absent.
            // var size = asset.size;
            // UDebug.Log("path:" + JSON.stringify(path));
            UDebug.Log("asset:" + JSON.stringify(asset));
            return true;
        });
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._am.setMaxConcurrentTask(8);
        } else {
            this._am.setMaxConcurrentTask(12);
        }

        this.checkUpdate();
    }

    private loadLocalManifest(path: string): void {
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            // Resolve md5 url
            // var url = this.manifestUrl.nativeUrl;
            /**主要热更的project.manifest文件 */
            var url = cc.url.raw(path);
            const loader = cc.loader as any;
            if (loader.md5Pipe) {
                url = loader.md5Pipe.transformURL(url);
            }
            UDebug.Log("url:" + url);
            this._am.loadLocalManifest(url);
        }
    }

    private checkUpdate(callback?: (err: any, result?: any) => void) {
        if (this._updating) {
            return;
        }

        this._am.setEventCallback(null);
        this.loadLocalManifest("resources/manifest/project.manifest");
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            UDebug.Log("没有本地的maifest");
            return;
        }

        cfg_global.version = this._am.getLocalManifest().getVersion();
        UDebug.Log("本地版本号：" + this._am.getLocalManifest().getVersion())
        this._am.setEventCallback(this.checkCb.bind(this));
        this._am.checkUpdate();
        UDebug.Log("更新   checkUpdate");
    }


    private hotUpdate() {
        if (this._am && !this._updating) {
            UDebug.Log("开始更新----------------------------------")
            this._am.setEventCallback(this.updateCb.bind(this));
            this.loadLocalManifest("resources/manifest/project.manifest");
            this._am.update();
            this._updating = true;
        }
    }

    private checkCb(event) {
        UDebug.Log('检测结果 : ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                UDebug.Log("No local manifest file found, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                UDebug.Log("Fail to download manifest file, hot update skipped.");
                this.showUpdateError()
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                UDebug.Log("Already up to date with the latest remote version." + this._resver);
                // this.btn_jump.node.active = true;
                this.emit(UpdaterEvent.ALREADY_UP_TO_DATE, this._resver);
                this.emit(UpdaterEvent.UPDATE_PROGRESSION, 1);
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                UDebug.Log('发现新版本');
                // this._checkBtn.node.active = false;
                // this._fileProgress.progress = 0;
                // this._byteProgress.progress = 0;
                this._updating = false;
                this.hotUpdate();
                break;
            default:
                return;
        }
        this._updating = false;
    }

    private updateCb(event) {
        var needRestart = false;
        var failed = false;
        UDebug.Log('更新结果 : ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                UDebug.Log('No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                // this._byteProgress.progress = event.getPercent();
                // this._fileProgress.progress = event.getPercentByFile();

                // this._fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                // this._byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                this.emit(UpdaterEvent.UPDATE_PROGRESSION, event.getPercent());
                var msg = event.getMessage();
                UDebug.Log("-------------------------------------" + event.getPercent());
                if (msg) {
                    UDebug.Log('Updated file: ' + msg);
                    // UDebug.Log(event.getPercent()/100 + '% : ' + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                UDebug.Log('Fail to download manifest file, hot update skipped.');
                failed = true;
                this.showUpdateError()
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                UDebug.Log('Already up to date with the latest remote version.');
                failed = true;
                needRestart = true;
                // AppGame.ins.finishUpdate();
                break;
            case jsb.EventAssetsManager.ASSET_UPDATED:
                UDebug.Log('Update ASSET_UPDATED. ' + event.getMessage());
                this.emit(UpdaterEvent.UPDATE_PROGRESSION, 1);
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                UDebug.Log('Update finished. ' + event.getMessage());
                this.emit(UpdaterEvent.UPDATE_PROGRESSION, 1);
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                UDebug.Log('Update failed. ' + event.getMessage());
                // this._retryBtn.node.active = true;
                this._updating = false;
                this._canRetry = true;
                this.retry();
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                UDebug.Log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                var str = '下载大厅资源失败： ' + event.getAssetId()
                ErrorLogUtil.ins.addErrorLog(str, LogLevelType.DEBUG)
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                UDebug.Log(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            this._am.setEventCallback(null);
            // this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            //this.emit(UpdaterEvent.UPDATE_PROGRESSION_DESC, "");
            UDebug.Log("更新完毕");
            this._am.setEventCallback(null);
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            UDebug.log("newPaths" + newPaths)
            Array.prototype.unshift.apply(searchPaths, newPaths);
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    }
    private retry() {
        if (this._retryTime > 3) {
            this._retryTime = 0;
            this.showUpdateError()
            return;
        }
        if (!this._updating && this._canRetry) {
            // this._retryBtn.node.active = false;
            this._canRetry = false;
            this._retryTime++;
            UDebug.Log('Retry failed Assets...');
            // UDebug.Log("Retry failed Assets:"+JSON.stringify(this._am.getFailedAssets()));
            this._am.downloadFailedAssets();
        }
    }

    private showUpdateError() {
        AppGame.ins._msgBoxContent.string = "更新失败，请检查本地网络是否正常。需要立即重试吗？";
        AppGame.ins._msgBox.setScale(1)
        AppGame.ins._MsgType = EMsgType.failed
    }
}