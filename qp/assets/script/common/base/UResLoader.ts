import UHandler from "../utility/UHandler";
import UResManager from "./UResManager";

const { ccclass, property } = cc._decorator;

/**
 * 资源
 */
class ResInfo {

    /**
     * 资源路径
     */
    url: string = "";
    /**
     * 资源类型
     */
    type: typeof cc.Asset = null;
    /**
     * 资源依赖表
     */
    uuids: any = {};
    /**
     * 资源对象
     */
    asset: cc.Asset = null;
    /**
     * 资源引用计数
     */
    ref: number = 0;
}

/**
 * 创建:sq
 * 作用:动态资源加载管理
 * 注:在有资源下载的时候不能释放资源
 * 所有场景的资源必须弄程预制体 不然不场景资源不受管制
 */
@ccclass
export default class UResLoader extends cc.Component {

    private static _ins: UResLoader;
    /**
     * 资源加载单例
     */
    static get ins(): UResLoader {
        return UResLoader._ins;
    }
    /**
     * 资源池
     */
    private _resPool: { [key: string]: ResInfo } = {};
    /**
     * 资源使用情况表
     */
    private _uuidTable = {};
    /**
     * 当前还有资源的时候不能鞋子啊
     */
    private _loaderRef: number = 0;
    /**
     * 等待卸载的资源
     */
    private _waiteReleas: Array<string> = [];
    /**
     * 加载资源
     * @param path 资源路劲 
     * @param type 资源类型
     * @param handler 资源回调
     */
    loadRes(url: string, type: typeof cc.Asset, progressCallback?: UHandler, completehandler?: UHandler): void {
        if (url in this._resPool) {
            if (completehandler) completehandler.runWith({ error: null, url: url });
            return;
        }
        let that = this;
        this._loaderRef++;
        cc.loader.loadRes(url, type,
            (completedCount: number, totalCount: number, item: any) => {

            },
            (error: Error, resource: any) => {
                this._loaderRef--;
                if (!error) {
                    if (url in that._resPool) {
                        if (completehandler) completehandler.runWith({ error: null, url: url });
                        return;
                    }
                    let newInfo = new ResInfo();
                    newInfo.url = url;
                    newInfo.asset = resource;
                    newInfo.type = type;

                    //记录所有相关资源
                    let depends = cc.loader.getDependsRecursively(resource);
                    for (let key of depends) {
                        newInfo.uuids[key] = true;
                        if (key in that._uuidTable) {
                            that._uuidTable[key] += 1;
                        }
                        else {
                            that._uuidTable[key] = 1;
                        }
                    }
                    that._resPool[url] = newInfo;

                } else {

                }
                if (completehandler) completehandler.runWith({ error: null, url: url });
            });
    }
    loadScene(sceneName:string,progressCallback?: UHandler, completehandler?: UHandler):void{
        if (sceneName in this._resPool) {
            if (completehandler) completehandler.runWith({ error: null, url: sceneName });
            return;
        }
        let that = this;
        this._loaderRef++;
        cc.director.preloadScene(sceneName,
            (completedCount: number, totalCount: number, item: any) => {

            },
            (error: Error, resource: any) => {
                this._loaderRef--;
                if (!error) {
                    if (sceneName in that._resPool) {
                        if (completehandler) completehandler.runWith({ error: null, url: sceneName });
                        return;
                    }
                    let newInfo = new ResInfo();
                    newInfo.url = sceneName;
                    newInfo.asset = resource;
                    newInfo.type = cc.SceneAsset;

                    //记录所有相关资源
                    let depends = cc.loader.getDependsRecursively(resource);
                    for (let key of depends) {
                        newInfo.uuids[key] = true;
                        if (key in that._uuidTable) {
                            that._uuidTable[key] += 1;
                        }
                        else {
                            that._uuidTable[key] = 1;
                        }
                    }
                    that._resPool[sceneName] = newInfo;

                } else {

                }
                if (completehandler) completehandler.runWith({ error: null, url: sceneName });
            });
    }
    //获取
    getInstance(url: string): any {
        let p = this._resPool[url];
        if (p != null) {
            p.ref++;
            if (p.type == cc.Prefab) {
                return cc.instantiate(p.asset);
            }
            else {
                return p.asset;
            }
        }
        return null;
    }
    /**
     * 释放资源
     * 注:在有资源下载的时候不能释放资源
     * 所有场景的资源必须弄程预制体 不然不场景资源不受管制
     * @param url 
     */
    release(url: string): void {

        this._waiteReleas.push(url);
    }
    protected onLoad() {
        UResLoader._ins = this;
    }
    protected update(): void {
        /**
         * check下载资源
         */
        if (this._loaderRef === 0) {

            let len = this._waiteReleas.length;
            if (len > 0) {
                for (let i = 0; i < this._waiteReleas.length; i++) {
                    let element = this._waiteReleas[i];
                    let p = this._resPool[element];
                    if (p != null) {
                        p.ref -= 1;
                        //释放资源
                        if (p.ref <= 0) {
                            this._releaseRes(p);
                        }
                    }
                }
                this._waiteReleas = [];
            }
        }
    }
    //释放资源
    private _releaseRes(res: ResInfo): void {
        let that = this;
        Object.keys(res.uuids).forEach(function (key) {
            that._uuidTable[key]--;
            if (that._uuidTable[key] > 0) {
                delete res.uuids[key];
            }
            else {
                delete that._uuidTable[key];
            }
        });
        cc.loader.release(Object.keys(res.uuids));
        delete this._resPool[res.url];
    }
}
