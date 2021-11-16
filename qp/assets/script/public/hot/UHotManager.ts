import UMainHotUpdate from "./UMainHotUpdate";
import UGameHotUpdate from "./UGameHotUpdate";
import UDebug from "../../common/utility/UDebug";
import { UpdaterEvent } from "./UHotData";
import UHandler from "../../common/utility/UHandler";
import cfg_game from "../../config/cfg_game";
import cfg_global from "../../config/cfg_global";
import UDateHelper from "../../common/utility/UDateHelper";

export const search_key = "HotUpdateSearchPaths";
export const subsearch_dir = "shqp/subpackages/";
export const projName = "shqp";


/**
 * 创建:time
 * 热更新的管理类
 */
export class UHotManager extends cc.EventTarget {

    private static _ins: UHotManager;
    /**
     * 热更新模块的单例
     */
    static get Ins(): UHotManager {
        if (!UHotManager._ins) {
            UHotManager._ins = new UHotManager();
        }
        return UHotManager._ins;
    }
    /**
     * 主体包的热更新
     */
    private _mainHot: UMainHotUpdate;
    private _subHots: { [key: string]: UGameHotUpdate };
    private _updateHandler: UHandler;

    private main_already_up_to_date(version: string): void {

        this.emit(UpdaterEvent.MAIN_ALREADY_UP_TO_DATE, version);
        // this.checkSubGameUpdate();
        if (this._updateHandler) this._updateHandler.runWith(true);
    }
    private main_update_progression(value: number): void {
        this.emit(UpdaterEvent.MAIN_UPDATE_PROGRESSION, value);
    }
    private sub_update_finished(gameId: number): void {
        UDebug.Log("sub_update_finished->" + gameId);
        this.emit(UpdaterEvent.SUB_UPDATE_FINISHED, gameId);
    }
    private sub_update_progression(gameId: number, value: number): void {
        UDebug.Log("sub_update_progression->" + gameId);
        this.emit(UpdaterEvent.SUB_UPDATE_PROGRESSION, gameId, value);
    }
    private sub_already_up_to_date(gameId: number): void {
        UDebug.Log("sub_already_up_to_date->" + gameId);
        this.emit(UpdaterEvent.SUB_ALREADY_UP_TO_DATE, gameId);
        this.refreshSubIscheck();
    }
    private sub_new_version_found(gameId: number): void {
        UDebug.Log("sub_new_version_found->" + gameId);
        this.emit(UpdaterEvent.SUB_NEW_VERSION_FOUND, gameId);
        this.refreshSubIscheck();
    }
    /**
     * 检查
     */
    private refreshSubIscheck(): void {
        for (const key in this._subHots) {
            if (this._subHots.hasOwnProperty(key)) {
                const element = this._subHots[key];
                if (!element.ischeck) {
                    return;
                }
            }
        }
        this.emit(UpdaterEvent.SUB_CHECK_OVER);
        if (this._updateHandler) this._updateHandler.runWith(true);
    }
    /**
     * 初始化热更新模块
     */
    init(hander: UHandler): void {
        this._subHots = {};
        if (!this.IsHotUpdate()) {
            if (hander) hander.runWith(false);
            return;
        }
        this._updateHandler = hander;
        this._mainHot = new UMainHotUpdate();
        this._mainHot.init();
        this._mainHot.on(UpdaterEvent.ALREADY_UP_TO_DATE, this.main_already_up_to_date, this);
        this._mainHot.on(UpdaterEvent.UPDATE_PROGRESSION, this.main_update_progression, this);

        if (this.IsSubUpdate()) {
            this.subPathInit();
        }
    }
    /**
     * 修改热更新地址
     */
    changeUrlByServer(data: any): void {
        var mainLocalUrl = "resources/manifest/project.manifest";
        var mainCacheUrl = jsb.fileUtils.getWritablePath() + projName + '/project.manifest';
        var localManifest = this.changeRemoteUrl(mainLocalUrl, mainCacheUrl, jsb.fileUtils.getWritablePath() + projName, data.hall.packageUrl, data.hall.remoteManifestUrl, data.hall.remoteVersionUrl);
        for (const key in localManifest.subVersionUrl) {
            if (localManifest.subVersionUrl.hasOwnProperty(key)) {
                const remote = localManifest.subVersionUrl[key];
                let local = cc.url.raw("resources/manifest/" + key + "/project.manifest");
                if (cc.loader.md5Pipe) local = cc.loader.md5Pipe.transformURL(local);
                let localcache = jsb.fileUtils.getWritablePath() + subsearch_dir + key + '/project.manifest';
                this.changeRemoteUrl(local, localcache, data.sub[key].packageUrl, jsb.fileUtils.getWritablePath() + subsearch_dir + key, data.sub[key].remoteManifestUrl, data.sub[key].remoteVersionUrl);
            }
        }
    }
    /**
    * 修改远程更新文件地址
    */
    private changeRemoteUrl(localUrl: string, cacheUrl: string, dir: string, packageUrl: string, remoteManifestUrl: string, remoteVersionUrl: string): any {
        /**存在cache 那么修改cache的更新url */
        if (jsb.fileUtils.isFileExist(cacheUrl)) {
            let cacheManifest = JSON.parse(jsb.fileUtils.getStringFromFile(cacheUrl));
            cacheManifest["packageUrl"] = packageUrl;
            cacheManifest["remoteManifestUrl"] = remoteManifestUrl;
            cacheManifest["remoteVersionUrl"] = remoteVersionUrl;
            jsb.fileUtils.writeStringToFile(JSON.stringify(cacheManifest), cacheUrl);
            return cacheManifest;
        } else {
            /**没有cache 那么先把 page里面的拷贝到 cache目录 */
            if (!jsb.fileUtils.isDirectoryExist(dir)) {
                jsb.fileUtils.createDirectory(dir);
            }
            var localUrl = cc.url.raw(localUrl);
            if (cc.loader.md5Pipe) localUrl = cc.loader.md5Pipe.transformURL(localUrl);
            let loadManifest = JSON.parse(jsb.fileUtils.getStringFromFile(localUrl));
            loadManifest["packageUrl"] = packageUrl;
            loadManifest["remoteManifestUrl"] = remoteManifestUrl;
            loadManifest["remoteVersionUrl"] = remoteVersionUrl;
            jsb.fileUtils.writeStringToFile(JSON.stringify(loadManifest), cacheUrl);
            return loadManifest;
        }



    }
    /**子包manifest 这里有点小问题 后面实现的时候没有用到这里的manifest的路径*/
    private subPathInit() {

        var manifest_data = "";
        var cacheManifest = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + projName + +'/project.manifest';
        if (jsb.fileUtils.isFileExist(cacheManifest)) {
            manifest_data = jsb.fileUtils.getStringFromFile(cacheManifest);
        } else {
            var path = cc.url.raw("resources/manifest/project.manifest");
            if (cc.loader.md5Pipe) {
                path = cc.loader.md5Pipe.transformURL(path);
            }
            manifest_data = jsb.fileUtils.getStringFromFile(path);
        }
        var data1 = JSON.parse(manifest_data);
        // var data1 = JSON.parse(JSON.stringify(manifest_data));
        if (data1 && data1.subVersionUrl) {
            var sub_data = data1.subVersionUrl;
            for (const key in sub_data) {
                if (sub_data.hasOwnProperty(key)) {
                    const remote = sub_data[key];
                    let gameId = this.getgameIdbyAbbreviateName(key);
                    var item = new UGameHotUpdate(gameId);
                    item.on(UpdaterEvent.UPDATE_FINISHED, this.sub_update_finished, this);
                    item.on(UpdaterEvent.UPDATE_PROGRESSION, this.sub_update_progression, this);
                    item.on(UpdaterEvent.ALREADY_UP_TO_DATE, this.sub_already_up_to_date, this);
                    item.on(UpdaterEvent.NEW_VERSION_FOUND, this.sub_new_version_found, this);
                    this._subHots[key] = item;
                }
            }
        }
    }
    /**获取子游戏的下载器 */
    getgameHot(gameId: number): UGameHotUpdate {
        var cfg = cfg_game[gameId];
        return this._subHots[cfg.abbreviateName];
    }
    /**根据游戏缩略名字获取游戏ID */
    getgameIdbyAbbreviateName(name: string): number {
        for (const key in cfg_game) {
            if (cfg_game.hasOwnProperty(key)) {
                const element = cfg_game[key];
                if (element.abbreviateName === name) {
                    return element.gametype;
                }
            }
        }
        return 0;
    }
    /**
    * 是否热更新
    */
    IsHotUpdate(): boolean {
        return cfg_global.isHot && cc.sys.isNative;
    }
    /**
     * 是否启用子包热更新
     */
    IsSubUpdate(): boolean {
        return this.IsHotUpdate() && cfg_global.isSub;
    }
    /**
    * 得到去重后的search
    * @param addPath 新增的搜索路径
    * @param srcPath 原搜索路径
    * @returns 去重后的searchpath
    */
    getSearchPath(addPath: any, srcPath: any[], isSort = false): any {
        if (srcPath) {
            if (isSort) {
                srcPath.sort((a, b) => {
                    if (a.length > b.length) {
                        return -1;
                    }
                    else if (a.length < b.length) {
                        return 1;
                    }
                    return 0;
                });
            }

            var temp = addPath + '/';

            srcPath.splice(0, 0, addPath);
            var re = [srcPath[0]];

            for (var i = 1; i < srcPath.length; i++) {
                if (srcPath[i] != re[re.length - 1] && srcPath[i] != srcPath[0]
                    && srcPath[i] != temp) {
                    re.push(srcPath[i]);
                }
            }
            return re;
        }
        return [];
    }
    /**
     * 设置子游戏的搜索路径
     * @param game_id 
     */
    setSubSearchPath(game_id: number) {
        var searchPaths = jsb.fileUtils.getSearchPaths();
        var cfg = cfg_game[game_id];
        var name = cfg.abbreviateName;
        if (name != null && name != "" && searchPaths != null) {

            var ph = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + subsearch_dir + name);
            searchPaths = this.getSearchPath(ph, searchPaths);

            jsb.fileUtils.setSearchPaths(searchPaths);
            var searchPaths1 = jsb.fileUtils.getSearchPaths();
            cc.sys.localStorage.setItem(search_key, JSON.stringify(searchPaths1));
        }
    }
    /**
     * 加载子包
     * @param name 包名字
     * @param cb  完成回调
     */
    loadSubGame(gameId: number, cb: UHandler): void {
        if (!this.IsSubUpdate()) {
            if (cb) cb.run();
            return;
        }
        var cfg = cfg_game[gameId];
        var up = this._subHots[cfg.abbreviateName];
        if (up.isloaded) {
            if (cb) cb.run();
        } else {
            //up.loadGame(cb);
        }
    }
    /**
     * 检查子游戏是否更新
     */
    checkSubGameUpdate(): void {
        for (const key in this._subHots) {
            if (this._subHots.hasOwnProperty(key)) {
                var element = this._subHots[key];
                if (!element.ischeck) {
                    element.checkUpdate();
                }
            }
        }
    }
}