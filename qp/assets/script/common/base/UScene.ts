import AppGame from "../../public/base/AppGame";
import UDebug from "../utility/UDebug";
import { EAppStatus, ECommonUI } from "./UAllenum";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
/**
 * 创建:gj
 * 作用:场景基类，每一个游戏的Game类需要继承 这个 然后挂接在对应游戏场景的Canvas根节点上面
 */
@ccclass
export default abstract class UScene extends cc.Component {
    /**
    * 改UI的主要atlas
    */
    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;
    /**
     * 是否初始化
     */
    protected _init: boolean;
    /**
     * 初始化抽象类(这里初始化必要的东西)
     */
    protected abstract init(): void;

    protected gamecloseUI(): void {
        setTimeout(() => {
            AppGame.ins.closeUI(ECommonUI.Loading);
        }, 400);
    }
    /**
     * 场景load完毕之后加载
     * 基类重写之后 一定要调用super.openScene(data);
     * @param data 传递的数据（根据没有游戏）
     */
    openScene(data: any): void {
        UDebug.Log("---------------UScene:openScene-------------------")
        if (!this._init) {
            this._init = true;
            this.init();
        }

        setTimeout(() => {
            AppGame.ins.closeUI(ECommonUI.Loading);
        }, 400);
    }

    /**
     * 获取Sprite
     * @param key sprite的名字
     */
    getSpriteFrame(key: string): cc.SpriteFrame {
        return this.atlas.getSpriteFrame(key);
    }
}
