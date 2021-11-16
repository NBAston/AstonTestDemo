// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import UDebug from "./UDebug";
import UHandler from "./UHandler";

/**
 * 创建:gj
 * 作用：Node节点的对象池
 */
export default class UNodePool {
    /**
     * 池
     */
    private static _pools: { [key: string]: cc.NodePool } = {};
    /**
     * 清除缓存池
     * @param vkey 为空时清除所有的池
     */
    static clearall(vkey?: string): void {
        vkey = vkey || null;
        if (!vkey) {
            for (const key in UNodePool._pools) {
                if (UNodePool._pools.hasOwnProperty(key)) {
                    const element = UNodePool._pools[key];
                    element.clear();
                }
            }
            this._pools = {};
        } else {
            var targetPool = UNodePool._pools[vkey];
            if (targetPool) {
                targetPool.clear();
                delete UNodePool._pools[vkey];
            }
        }
    }
    /**
     * 获取node实例
     * @param key 
     * @param prfab 
     */
    static getObj(vkey: string, prfab: cc.Prefab): cc.Node {
        var targetPool = UNodePool._pools[vkey];
        var node: cc.Node;
        if (targetPool) {
            node = targetPool.get();
        } else {
            targetPool = new cc.NodePool();
            UNodePool._pools[vkey] = targetPool;
        }
        if (!node) {
            node = cc.instantiate(prfab);
        }
        node["vkey"] = vkey;
        return node;
    }
    /**
     * 获取node组件实例
     * @param vkey 
     * @param prfab 
     * @param className 
     */
    static getComObjByPrefab<T extends cc.Component>(vkey: string, prfab: cc.Prefab, className: string, parent?: cc.Node): T {
        var targetPool = UNodePool._pools[vkey];
        var node: cc.Node;
        if (targetPool) {
            node = targetPool.get();
        } else {
            targetPool = new cc.NodePool(className);
            UNodePool._pools[vkey] = targetPool;
        }
        let isnew = false;
        if (!node) {
            node = cc.instantiate(prfab);
            isnew = true;
        }
        node["vkey"] = vkey;
        var com = node.getComponent(className);
        if (!com) {
            com = node.addComponent(className);
        }
        if (isnew && com.init) com.init();
        if (parent) {
            node.parent = parent;
            node.setPosition(0, 0);
        }
        return com;
    }
    /**
     * 获取node组件实例
     * 如果component有init方法 在创建的时候会调用
     * @param vkey 
     * @param prfab 
     * @param className 
     * @param parent 父节点（加入父节点之后会执行归一化操作) 
     */
    static getComObjByNode<T extends cc.Component>(vkey: string, prfabNode: cc.Node, className: string, parent?: cc.Node): T {
        var targetPool = UNodePool._pools[vkey];
        var node: cc.Node;
        if (targetPool) {
            node = targetPool.get();
        } else {
            targetPool = new cc.NodePool(className);
            UNodePool._pools[vkey] = targetPool;
        }
        let isnew = false;
        if (!node) {
            node = cc.instantiate(prfabNode);
            isnew = true;
        }
        node["vkey"] = vkey;
        var com = node.getComponent(className);
        if (!com) {
            com = node.addComponent(className);
        }
        if (isnew && com.init) com.init();
        if (parent) {
            node.parent = parent;
            node.setPosition(0, 0);
        }
        return com;
    }

    /**
     * 加载预制体到当前父节点
     * @param url 预制体路径 必须是resources文件夹下的预制体才能被找到
     * @param prefabName 预制体名称
     * @param parentNode 父节点 把当前的预制体挂载在该父节点
     * @param handler 回调函数
     */
    static loadPrefabToParentNode(url: string, parentNode: cc.Node, handler?: UHandler, prefabName?: any): void {
        cc.loader.loadRes(url, (err, prefab) => {
            if (err != null) {
                UDebug.log(err.message);//  
                return;
            }
            if (prefab == null) {
                return;
            }
            var newNode = cc.instantiate(prefab);//UNodePool.getObj(prefabName, prefab);
            if(handler) handler.runWith(newNode);
            newNode.setPosition(0, 0);
            parentNode.addChild(newNode);
        });  
    }

    static loadPrefab(url: string, prefabName: string): cc.Node {
        var prefabNode = null;
        cc.loader.loadRes(url, (err, prefab) => {
            if (err != null) {
                UDebug.log(err.message);//  
                return;
            }
            if (prefab == null) {
                return;
            }
            prefabNode = UNodePool.getObj(prefabName, prefab);
            prefabNode.setPosition(0, 0);
            // return prefabNode;
        });  
        return prefabNode;
        
    }

    /**
     * 回收节点
     * @param vkey 
     * @param go 
     */
    static reclaimNode(go: cc.Node): void {
        var targetPool = UNodePool._pools[go["vkey"]];
        if (!targetPool) {
            targetPool = new cc.NodePool();
            UNodePool._pools[go["vkey"]] = targetPool;
        }
        targetPool.put(go);
    }
    /**
     * 回收组件
     * @param vkey 
     * @param go 
     */
    static reclaimCom(go: cc.Component, className: string): void {
        var targetPool = UNodePool._pools[go.node["vkey"]];
        if (!targetPool) {
            targetPool = new cc.NodePool(className);
            UNodePool._pools[go.node["vkey"]] = targetPool;
        }
        targetPool.put(go.node);
    }
}
