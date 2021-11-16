import UHandler from "../../common/utility/UHandler";
import cfg_scene from "../../config/cfg_scene";
import VBaseUI from "../../common/base/VBaseUI";
import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "../base/AppGame";
import UEventListener from "../../common/utility/UEventListener";
import ULanHelper from "../../common/utility/ULanHelper";
import { SysEvent } from "../../common/base/UAllClass";
import cfg_lucky from "../../config/cfg_lucky";
import UDebug from "../../common/utility/UDebug";

const { ccclass, property } = cc._decorator;
/**
 * 创建:gj
 * 作用：显示场景加载进度条
 */
@ccclass
export default class VLoading extends VBaseUI {

    @property(cc.Node) loadingBarHead: cc.Node = null;
    @property(cc.Sprite) bg: cc.Sprite = null;
    @property([cc.SpriteFrame]) loadingBgs: cc.SpriteFrame[] = [];

    /**
     * 进度文字显示
     */
    private _process: cc.Label;
    /**
     * 进度条
     */
    private _loadingZi: cc.Label;
    /**
     * 进度条显示
     */
    private _processBar: cc.Sprite;
    /**
     * 初始化
     */
    private _init: boolean;
    private _idx: number;
    private _time: number;
    private _loadSceneName: string;
    private _needLoadScene: boolean;
    private _needLoadPrefab: boolean;
    private _hander: any;
    private _lucky: cc.Label;
    private _loadPrefab: any;
    private _bundle: any = null;
    /**
     * 初始化
     */
    init(): void {
        if (this._init) return;
        this._init = true;
        this._process = UNodeHelper.getComponent(this.node, "bottom/layout/loading_progress_zi", cc.Label);
        this._loadingZi = UNodeHelper.getComponent(this.node, "bottom/layout/loading_progress_zi2", cc.Label);
        this._processBar = UNodeHelper.getComponent(this.node, "bottom/loading_progress_bar", cc.Sprite);
        this._process.string = "";
        this._processBar.fillRange = 0;
        this.setLoadingHeadPos();
        this._iscache = true;
        let bg = UNodeHelper.find(this.node, "bg_all");
        UEventListener.get(bg).onClick = null;
        this._idx = 0;
        this._time = 0;
        this._lucky = UNodeHelper.getComponent(this.node, "mask/lucky", cc.Label);
    }

    protected onLoad(): void {
        
    }

    protected start() {
        this.node.zIndex = 300;
    }

    refresh(data: any) {
        this.show(data);
    }

    /**
     * 隐藏
     * @param handler 回调 
     */
    hide(handler?: UHandler): void {
        super.hide(handler);
    }
    /**
     * 显示
     * @param eType 
     * {
     *     eType:ELevelType, //跳转场景类型
     *     handler?: UHandler //跳转场景回调 可空
     * }
     */
    show(data: any): void {
        super.show(data);
        //加载背景
        this.bg.spriteFrame = null;
        let cfg = cfg_scene[data.eType];
        if (cfg && cfg.loadingBgIdx != -1) {
            this.bg.spriteFrame = this.loadingBgs[cfg.loadingBgIdx];
            //动态加载有延迟
            // let url = 'start/texture/loading/loadingBg/' + cfg.loadingBg;
            // cc.resources.load(url, (err, asset: cc.Texture2D) => {
            //     if (!err) {
            //         this.bg.spriteFrame = new cc.SpriteFrame(asset);
            //     }
            // })
        }

        if (!data) {
            // this._process.string = "资源初始化中...";
            this._processBar.fillRange = 1;
            this.setLoadingHeadPos();
            return;
        }
        if (data.prefab) {
            this._needLoadPrefab = true;
            this._loadPrefab = data.prefab;
            this._bundle = data.bundle;
        } else {
            let cfg = cfg_scene[data.eType];
            this._needLoadScene = true;
            this._loadSceneName = cfg.sceneName;
            UDebug.Log("------------->" + cfg.sceneName + "   " + (new Date()).getTime());
        }
        this._loadingZi.string = '正在加载中，请稍后...'
        this._process.string = "0%";
        this._processBar.fillRange = 0;
        this.setLoadingHeadPos();
        this._hander = data.handler;
        /**预加载地图 */
        this._idx = 0;
        // if (this._loadSceneName == "hall")
        //     this._time = 0.5;
        // else
        this._time = 0;
        this.updateContent();
        this.getRandom();
        // this._hander.runWith(false);

        // if (data.handler) data.handler.runWith(false);
    }

    /**加载头部节点位置 */
    setLoadingHeadPos() {
        this.loadingBarHead.x = this._processBar.node.width * this._processBar.fillRange;
        // UDebug.log('fillRange = ' + this._processBar.fillRange + '加载头部节点位置 = ' + this.loadingBarHead.x)
    }

    protected update(dt: number): void {
        this._time += dt;
        if (this._needLoadScene && this._time > 0) {
            this._needLoadScene = false;
            cc.director.preloadScene(this._loadSceneName,
                (completedCount: number, totalCount: number, item: any) => {
                    totalCount = totalCount || 0;
                    let count = (completedCount / totalCount);
                    if (this._processBar.fillRange < count) {
                        this._processBar.fillRange = count || 0;
                        this.setLoadingHeadPos();
                        this._process.string = Math.round((count || 0) * 100) + "%";
                    }
                }, (error: Error) => {
                    if (!error) {
                        // this._process.string = ULanHelper.GAME_INIT;
                        if (this._hander) {
                            this._hander.runWith(false);
                            this._hander = null;
                        }
                    } else {
                        if (this._hander) {
                            this._hander.runWith(true);
                            this._hander = null;
                        }
                        throw new Error("加载场景失败" + this._loadSceneName + " error:" + error.message);
                    }
                });
        } else if (this._needLoadPrefab && this._time > 0) {
            this._needLoadPrefab = false;
            if (this._bundle) {
                this._bundle.load(this._loadPrefab, cc.Prefab, (completedCount, totalCount, item) => {
                    totalCount = totalCount || 0;
                    let count = (completedCount / totalCount);
                    if (this._processBar.fillRange < count) {
                        this._processBar.fillRange = count || 0;
                        this.setLoadingHeadPos();
                        this._process.string = Math.round((count || 0) * 100) + "%";
                    }
                }, (error, resource) => {
                    if (error) {
                        UDebug.error("下载失败。。。。。");
                        if (this._hander) {
                            this._hander.runWith(false);
                            this._hander = null;
                        }
                        throw new Error("加载场景失败" + this._loadSceneName + " error:" + error.message);
                    } else {
                        UDebug.Info("下载场景prefab成功")
                        // this._process.string = ULanHelper.GAME_INIT;
                        if (this._hander) {
                            let resourceObj = {
                                dt: true,
                                res: resource
                            }
                            this._hander.runWith(resourceObj);
                            this._hander = null;
                        }
                    }
                })
            } else {
                cc.resources.load(this._loadPrefab, cc.Prefab, (completedCount, totalCount, item) => {
                    totalCount = totalCount || 0;
                    let count = (completedCount / totalCount);
                    if (this._processBar.fillRange < count) {
                        this._processBar.fillRange = count || 0;
                        this.setLoadingHeadPos();
                        this._process.string = Math.round((count || 0) * 100) + "%";
                    }
                }, (error, resource) => {
                    if (error) {
                        UDebug.error("下载失败。。。。。");
                        if (this._hander) {
                            this._hander.runWith(false);
                            this._hander = null;
                        }
                        throw new Error("加载场景失败" + this._loadSceneName + " error:" + error.message);
                    } else {
                        UDebug.Info("下载场景prefab成功")
                        // this._process.string = ULanHelper.GAME_INIT;
                        if (this._hander) {
                            let resourceObj = {
                                dt: true,
                                res: resource
                            }
                            this._hander.runWith(resourceObj);
                            this._hander = null;
                        }
                    }
                })
            }
        }
        if (this._time > 1) {
            this._time = 0;
            this.updateContent();
        }

    }
    private updateContent(): void {
        this._idx++;
        if (this._idx >= ULanHelper.LOADING_MSG.length) {
            this._idx = 0;
        }
        // this._loadingZi.string = ULanHelper.LOADING_MSG[this._idx];
    }
    protected onDisable() {
        this._hander = null;
        cc.systemEvent.off(SysEvent.CHANGE_CONTENT_DESC, this.change_content_desc, this);
    }
    protected onEnable(): void {
        cc.systemEvent.on(SysEvent.CHANGE_CONTENT_DESC, this.change_content_desc, this);
    }
    private change_content_desc(content: string): void {
        this._time = -1000;
        // this._loadingZi.string = "";
        // this._process.string=content;
    }

    private getRandom(): void {
        var b = Math.floor(Math.random() * (cfg_lucky.tips.length));
        this._lucky.string = cfg_lucky.tips[b];
    }
}
