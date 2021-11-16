import VChipItem from "./VZJHChipItem";
import USpriteFrames from "../../common/base/USpriteFrames";
import URandomHelper from "../../common/utility/URandomHelper";
import UHandler from "../../common/utility/UHandler";
import UNodeHelper from "../../common/utility/UNodeHelper";


const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 筹码的控制类
 */
export default class VChipManager {
    /**
     * 根节点
     */
    private _root: cc.Node;
    /**
     * 预制体
     */
    private _prefab: cc.Node;
    /**
     * 节点池
     */
    private _pool: Array<VChipItem>;
    /**
     * 正在显示的
     */
    private _run: Array<VChipItem>;

    private _xmin: number;
    private _ymin: number;
    private _xmax: number;
    private _ymax: number;

    constructor(root: cc.Node) {

        this._root = root;
        this._prefab = UNodeHelper.find(this._root, "node");
        this._pool = [];
        this._run = [];
        this._xmin = -root.width * 0.5;
        this._ymin = -root.height * 0.5;
        this._xmax = root.width * 0.5;
        this._ymax = root.height * 0.5;
    }
    /**
     * 获取实例
     */
    private getInstance(): VChipItem {

        if (this._pool.length > 0) {
            return this._pool.shift();
        }
        let itemObj = cc.instantiate(this._prefab) as cc.Node;
        let item = itemObj.getComponent(VChipItem);
        if (!item) {
            item = itemObj.addComponent(VChipItem);
            item.init();
            itemObj.parent = this._root;
            item.recoverHandler = new UHandler(this.reclaim, this);
        }
        return item;
    }
    /**
     * 回收
     * @param caller 
     */
    private reclaim(caller: VChipItem): void {
        let idx = this._run.indexOf(caller);
        if (idx > -1) {
            caller.reset();
            this._pool.push(caller);
            this._run.splice(idx, 1);
        }
    }
    private relainmAll(): void {
        this._run.forEach(element => {
            element.reset();
            this._pool.push(element);
        });
        this._run = [];
    }
    /**
     * 预创建
     */
    precreate(): void {
        const preCount = 50;
        for (let index = 0; index < preCount; index++) {
            let item = this.getInstance();
            this._pool.push(item);
        }
    }
    /**
     * 创建
     * @param pos 
     * @param chipType 
     * @param chipValue 
     * @param chipCount 
     */
    createChip(start: cc.Vec2, chipType: string, chipValue: number, chipCount: number, objId: number, chipState: number): Array<number> {
        let objs = [];
        start = this._root.convertToNodeSpaceAR(start);
        for (let i = 0; i < chipCount; i++) {
            let item = this.getInstance();
            let endPos = this.getEndPos();
            let angel = this.getRotAngel();
            item.bind(start, objId, chipType, chipValue, chipState);
            item.moveTo(endPos, angel, true);
            this._run.push(item);
            objs.push(objId);
        }
        return [];
    }

    /**创建失败回收 */
    createFail(objId: number): void {
        let item = this.getItem(objId);
        if (item) item.moveBack();
    }
    /**
     * 某个位置赢了之后将 东西全部发送给哪个位置
     */
    moveTo(end: cc.Vec2, time: number): void {
        end = this._root.convertToNodeSpaceAR(end);
        let len = this._run.length;
        for (let i = 0; i < len; i++) {
            const element = this._run[i];
            element.moveTo(end, 0, false, time);
        }
    }
    reset(): void {
        this.relainmAll();
    }
    private getEndPos(): cc.Vec2 {
        let end = new cc.Vec2();
        end.x = URandomHelper.randomBetween(this._xmin, this._xmax);
        end.y = URandomHelper.randomBetween(this._ymin - 50, this._ymax - 50);
        return end;
    }
    private getRotAngel(): number {
        return URandomHelper.randomBetween(-180, 180);
    }
    /**根据objid获取item*/
    private getItem(objId: number): VChipItem {
        let len = this._run.length;
        for (let i = 0; i < len; i++) {
            const element = this._run[i];
            if (element.objId == objId) {
                return element;
            }
        }
        return null;
    }
}
