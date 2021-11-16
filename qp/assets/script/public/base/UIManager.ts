import VBaseUI from "../../common/base/VBaseUI";
import VCircle from "./VCircle";
import UNodeHelper from "../../common/utility/UNodeHelper";
import { ECommonUI, EUIPos, EGameType } from "../../common/base/UAllenum";
import UHandler from "../../common/utility/UHandler";
import UDebug from "../../common/utility/UDebug";
import cfg_ui, { res_ui } from "../../config/cfg_ui";
import cfg_res from "../../config/cfg_prefab";
import VLoading from "../loading/VLoading";
import VTips from "./VTips";
import VHotLoading from "../hotupdate/VHotLoading";

import AppGame from "./AppGame";
import USubManager from "../hotupdate/USubManager";
import UUpdateMgr from "../hotupdate/UUpdateMgr";
import cfg_subgame from "../../config/cfg_subgame";
import VConnect from "./VConnect";
import VAddChips from "../../game/zjh/VZJHAddChips";
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";
import cfg_game from "../../config/cfg_game";
import UScene from "../../common/base/UScene";
import cfg_friends, { cfg_friendGameIds } from "../../config/cfg_friends";


const { ccclass, property } = cc._decorator;

/**
 * 创建:gj
 * 作用：公共ui管理器
 */
export default class UIManager {
    /**
     * ui存储
     */
    private _uiDict: { [key: number]: VBaseUI };
    /**
     * ui对象池
     */
    private _pool: { [key: number]: VBaseUI };

    private _runLoading: { [key: string]: any };
    /**
    * 圈圈
    */
    private _loading: VCircle;
    /**
     * 提示
     */
    private _tip: VTips;
    /**
     * 加载ui的挂接节点
     */
    private _uiRoot: cc.Node;
    /**
     * 场景的挂接节点
     */
    private _sceneNode: cc.Node;
    /**
     * 每个场景的根节点
     */
    private _sceneRoot: cc.Node;
    /**
     * 画布
     */
    private _canvas: cc.Canvas;
    /**
     * 游戏大厅节点
     */
    private _roomNode: cc.Node;
    /**
     * 链接
     */
    private _connect: VConnect;

    private _updateUI: VHotLoading;
    /**
     * 构造函数
     * @param constNode 常驻节点 
     * @param loading 加载转圈
     */
    constructor(root: cc.Node) {
        this._runLoading = {};
        this._canvas = root.getComponent(cc.Canvas);
        this._uiRoot = UNodeHelper.find(root, "commonui");
        this._sceneNode = UNodeHelper.find(root, "scene");
        this._loading = UNodeHelper.getComponent(root, "loading", VCircle);
        this._loading.hide();
        this._loading.clickHander = UHandler.create(this.hideCircle, this);
        this._uiDict = {};
        this._pool = [];
        let ld = UNodeHelper.getComponent(root, "commonui/loading_ui", VLoading);
        ld.uiType = ECommonUI.Loading;
        ld.uiPos = EUIPos.Window
        ld.init();
        ld.hide();
        this._pool[ld.uiType] = ld;
        this._tip = UNodeHelper.getComponent(root, "tipnode", VTips);
        this._tip.init();

        this._updateUI = UNodeHelper.getComponent(root, "commonui/update_ui", VHotLoading);
        this._updateUI.init();
        this._connect = UNodeHelper.getComponent(root, "connect", VConnect);
        this._connect.init();
        this._connect.show(false);
    }
    private hideCircle(assetName: string): void {
        delete this._runLoading[assetName];
    }
    /**
     * 场景切换之前调用
     */
    beforchangeLevelComplete(): void {
        let scene = cc.director.getScene();
        //scene.zIndex = 0;
        if (this._sceneRoot) {
            this._sceneRoot.parent = scene;
            this._sceneRoot.setPosition(5000, 5000);
            this._sceneRoot.active = false;
        }
        Object.keys(this._uiDict).forEach((key) => {
            let item = this._uiDict[key];
            if (item.uiType != ECommonUI.Loading)
                this.hideUI(item.uiType);
        });
    }
    /**
     * 切换场景之后
     */
    afterchangelevel(scene1?: any): cc.Node {
        let scene = cc.director.getScene();
        this._sceneRoot = UNodeHelper.find(scene, "sceneRoot");
        if (scene1) {
            this._sceneRoot = scene1;
        }
        if (!this._sceneRoot) {
            throw new Error("sceneRoot");
        }
        scene.setScale(1, 1);
        this._sceneRoot.active = true;
        this._sceneNode.removeAllChildren();
        this._sceneRoot.parent = this._sceneNode;
        this._sceneRoot.setPosition(0, 0);
        this.add_widget(this._sceneRoot);
        this._roomNode = UNodeHelper.find(this._sceneRoot, "uiroot/content/content");
        return this._sceneRoot;
    }

    showBundleUI(uiType: ECommonUI, gameType: EGameType, data: any, needCircle: boolean = true, handler?: UHandler): void {
        this.loadBundleUi(uiType, gameType, data, needCircle, handler);
    }

    private loadBundleUi(uiType: ECommonUI, gameType: EGameType, data: any, needCircle: boolean = true, handler?: UHandler): void {
        let u_cfg = cfg_ui[uiType];
        if (!u_cfg) {
            return UDebug.Log("没有对应的配置UI配置表->" + uiType);
        }
        let res = cfg_res[u_cfg.resName];
        if (needCircle) this._loading.show("aa");
        let bundleName = '';
        if (cfg_friendGameIds.includes(gameType)) {
            bundleName = cfg_friends[gameType].bundleName;
        } else {
            bundleName = cfg_game[gameType].bundleName;
        }
        let bundle = cc.assetManager.getBundle(bundleName);
        if (bundle) {
            UDebug.log("loadBundleUi 存在 bundleName => ", bundleName)
            this.loadUiByBundle(bundle, res.url, uiType, data);
        } else {
            UDebug.log("loadBundleUi 新建 bundleName => ", bundleName)
            cc.assetManager.loadBundle(bundleName, null, (err, bundle) => {
                if (err) {
                    cc.error("loadBundle error.................", err)
                } else {
                    AppGame.ins.currBundleName = bundleName;
                    this.loadUiByBundle(bundle, res.url, uiType, data);
                }
            });
        }
    }

    loadUiByBundle(bundle: cc.AssetManager.Bundle, url: string, uiType: ECommonUI, data: any) {
        if (!bundle || !url || url == '') return;
        bundle.load(url, cc.Asset,
            (completedCount: number, totalCount: number, item: any) => {
                if (totalCount == 0) totalCount = 1;
                let process = completedCount / totalCount;
                if (process > 1) process = 1.0;
                this._loading.updateProcess(process);
            },
            (er, asset: any) => {
                if (er) {
                    this._loading.hide();
                    cc.error("loadBundle error.................", er)
                } else {
                    if (this._uiDict[uiType]) {
                        cc.warn('重复加载！！！！')
                        this._loading.hide();
                        return;
                    }

                    let ins = cc.instantiate(asset) as cc.Node;
                    let ui = ins.getComponent(VBaseUI);
                    ui.uiType = uiType;
                    this.add_widget(ui.node);
                    ui.init();
                    ui.setParent(this._uiRoot);
                    this.realshow(uiType, ui, data);
                    this._loading.hide();

                    // if (handler) handler.runWith(dt);
                }
            }
        );
    }

    /**
     * 显示UI
     * @param uiType 
     * @param data 
     */
    showUI(uiType: ECommonUI, data: any, needCircle: boolean = true): void {
        //cc.log("显示UI 000000000000000  ", uiType)
        if (this._uiDict[uiType]) {
            UDebug.log("显示UI _uiDict   " + uiType)
            this._uiDict[uiType].refresh(data);
        } else {
            let ui = this._pool[uiType];
            if (ui) {
                UDebug.log("显示UI 缓存池   " + uiType)
                this.realshow(uiType, ui, data);
                delete this._pool[uiType];

            } else {
                this.loadui(uiType, data, needCircle);
                UDebug.log("显示UI 创建  ", uiType)
            }
        }
    }
    /**
     * 显示tips
     * @param content 1 string 或者 {data:string,type:ETipType} 0=ETipType.repeat 1=ETipType.onlyone
     * onlyone的时候会比较内容 内容相同只会显示一个，但是只是与上一条相比
     */
    showTips(content: any): void {
        this._tip.show(content);
    }
    /**
     * 显示连接中的ui
     * @param value 
     */
    showConnect(value: boolean, type: number = 1): void {
        this._connect.show(value, type);
    }
    /**
     * 显示更新UI
     */
    showupdate(value: boolean): void {
        if (value) {
            this._updateUI.show(null);
        } else {
            this._updateUI.hide(null);
        }
    }

    /**
     * 
     * @param 显示loading进度条
    
     */
    showLoadingProgress(isShow: boolean) {
        let loadingNode = UNodeHelper.find(this._updateUI.node, "bottom");
        if (isShow) {
            loadingNode.active = true;
        } else {
            loadingNode.active = false;
        }
    }

    /**
    * 显示load条 默认关闭
    * @param ishow 
    */
    setLoadingShow(ishow?: boolean) {
        if (ishow) {
            this._loading.show("aa");
        } else {
            this._loading.hide();
        }
    }
    /**
     * 隐藏ui
     * @param uiType ui类型 
     * @param handler 回调函数
     */
    hideUI(uiType: ECommonUI, handler?: UHandler): void {
        let ui = this._uiDict[uiType];
        if (ui) {
            let pos = ui.uiPos;
            ui.hide(handler);
            this._pool[uiType] = ui; /**加入池列表 */
            //cc.log("加入池列表", uiType)
            if (pos == EUIPos.Normal) {
                if (this._roomNode) this._roomNode.active = true;
            }
            ui.setZIndex(100);
            delete this._uiDict[uiType];/** 运行列表中删除*/

        } else {
            UDebug.Log("警告!对应的UI已经关闭->" + uiType);
            if (handler) handler.run();
        }
    }
    /**
     * 加载UI
     */
    private loadui(uiType: ECommonUI, data: any, needCircle: boolean = true): void {
        let u_cfg = cfg_ui[uiType];
        if (!u_cfg) {
            return UDebug.Log("没有对应的配置UI配置表->" + uiType);
        }
        let res = cfg_res[u_cfg.resName];
        if (needCircle) this._loading.show("aa");
        cc.loader.loadRes(res.url, cc.Asset,
            (completedCount: number, totalCount: number, item: any) => {
                if (totalCount == 0) totalCount = 1;
                let process = completedCount / totalCount;
                if (process > 1) process = 1.0;
                this._loading.updateProcess(process);
            },
            (er, asset) => {
                if (er) {
                    this._loading.hide();
                } else {
                    this._loading.hide();

                    if (this._uiDict[uiType]) {
                        return; // 有可能会重复加载
                    }

                    let ins = cc.instantiate(asset) as cc.Node;
                    let ui = ins.getComponent(VBaseUI);
                    ui.uiType = uiType;
                    this.add_widget(ui.node);
                    ui.init();
                    ui.setParent(this._uiRoot);

                    this.realshow(uiType, ui, data);
                }
            }
        );
        /**由于没有看见 可以取消下载的 方法 所以这里先这样处理 等找到可以取消的办法之后 再来更改这里 */
        // let res = cfg_res[u_cfg.resName];
        // let temp = res.url.split('/');
        // let resname = temp[temp.length - 1];
        // this._runLoading[resname] = { uiType: uiType };
        // this._loading.show(resname);

        // cc.loader.loadRes(res.url, cc.Asset,
        //     (completedCount: number, totalCount: number, item: any) => {
        //         if (totalCount == 0) totalCount = 1;
        //         let process = completedCount / totalCount;
        //         if (process > 1) process = 1.0;
        //         this._loading.updateProcess(process);
        //     },
        //     (er, asset) => {

        //         if (er) {

        //             UDebug.Log("下载出错->" + res.url);
        //             delete this._runLoading[uiType];
        //         } else {

        //             if (this._runLoading[asset.name]) {

        //                 let utype = this._runLoading[asset.name].uiType;
        //                 delete this._runLoading[asset.name];

        //                 if (!this._uiDict[utype]) {
        //                     let ins = cc.instantiate(asset) as cc.Node;
        //                     let ui = ins.getComponent(VBaseUI);
        //                     ui.uiType = uiType;
        //                     this.add_widget(ui.node);
        //                     ui.init();
        //                     ui.setParent(this._uiRoot);
        //                     this.realshow(uiType, ui, data);
        //                 }
        //             }
        //         }

        //         /**完毕之后检查一下 是否已经加载完毕 加载完毕之后就关闭 */
        //         let idx = 0;
        //         for (const key in this._runLoading) {
        //             if (this._runLoading.hasOwnProperty(key)) {
        //                 const element = this._runLoading[key];
        //                 idx++;
        //             }
        //         }
        //         if (idx == 0) this._loading.hide();
        //     });
    }
    /**
     * 真实显示UI
     * @param ui 
     * @param data 
     */
    private realshow(uiType: ECommonUI, ui: VBaseUI, data: any): void {
        this.add_widget(ui.node);
        let idx = this.getIndx();
        ui.show(data);
        this._uiDict[uiType] = ui;

        if (ui.uiPos == EUIPos.Normal) {
            if (this._roomNode) this._roomNode.active = false;
        } else if (ui.uiPos == EUIPos.Window) {
            ui.setZIndex(idx);
        }
        // if(uiType == ECommonUI.Loading){
        //    ui.setZIndex(idx);
        // }else{
        //     if (ui.uiPos == EUIPos.Normal) {
        //         if (this._roomNode) this._roomNode.active = false;
        //     } else if (ui.uiPos == EUIPos.Window) {
        //         ui.setZIndex(idx);
        //     }
        // }
    }
    private getIndx(): number {
        let idx = 200;
        for (const key in this._uiDict) {
            if (this._uiDict.hasOwnProperty(key)) {
                const element = this._uiDict[key];
                if (element.uiPos == EUIPos.Window && element.node.zIndex > idx) {
                    idx = element.node.zIndex;
                }
            }
        }
        return idx + 1;
    }
    private add_widget(node: cc.Node): void {
        let ws = node.getComponent<cc.Widget>(cc.Widget);
        if (ws) {
            ws.isAlignLeft = true;
            ws.isAlignRight = true;
            ws.isAlignTop = true;
            ws.isAlignBottom = true;
            ws.top = 0;
            ws.right = 0;
            ws.left = 0;
            ws.bottom = 0;
            ws.target = this._canvas.node;
        }
    }
}
