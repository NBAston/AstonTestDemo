import VTipItem from "./VTipItem";
import { ETipType } from "../../common/base/UAllenum";

const { ccclass, property } = cc._decorator;
/**
 * 小提示框
 */
@ccclass
export default class VTips extends cc.Component {
    private _cache: Array<VTipItem>;
    private _run: Array<VTipItem>;
    private _temp: Array<VTipItem>;
    private _time: number = 2;
    private getInstance(): VTipItem {
        if (this._cache.length > 0) {
            return this._cache.shift();
        }
        return this._run.shift();
    }
    private reclainm(caller: VTipItem): void {
        let idx = this._run.indexOf(caller);
        if (idx > -1) {
            this._run.splice(idx, 1);
            this._cache.push(caller);
        }
        caller.setActivity(false);
    }
    private calutePos(): void {
        let len = this._run.length;
        for (let i = 0; i < len; i++) {
            let element = this._run[i];
            element.pos(0, (len - i - 1) * 100);
        }
    }
    /**初始化 */
    init(): void {

        this._cache = [];
        this._run = [];
        this._temp = [];
        let count = this.node.childrenCount;
        for (let i = 0; i < count; i++) {
            let element = this.node.children[i];
            let item = new VTipItem();
            item.init(element);
            this._cache.push(item);
        }
    }
    private create(content: any, time: number): void {
        let item = this.getInstance();
        item.bind(content, time);
        this._run.push(item);
        this.calutePos();
    }
    /**
     * 显示内容
     */
    show(content: any): void {

        if (typeof (content) == "string") {
            this.create(content, this._time);
        }
        else {
            if (!content) return;
            let str = content.data;
            let type = content.type || 0;
            let time = content.time || this._time;
            if (type == ETipType.repeat) {
                this.create(str, time);
            } else {
                let len = this._run.length;
                if (len > 0) {

                    let or = this._run[this._run.length - 1];
                    if (or.isSame(str)) {
                        or.bind(str, time);
                    } else {
                        this.create(str, time);
                    }
                } else {
                    this.create(str, time);
                }
            }
        }
    }
    protected update(dt: number): void {
        let len = this._run.length;
        for (let i = 0; i < len; i++) {
            let element = this._run[i];
            if (element.update(dt)) {
                this._temp.push(element);
            }
        }
        len = this._temp.length;
        if (len > 0) {
            for (let i = 0; i < len; i++) {
                let element = this._temp[i];
                this.reclainm(element);
            }
            this._temp = [];
        }
    }
}
