import UNodeHelper from "../../../common/utility/UNodeHelper";
import VBlackJackRoom from "./VBlackJackRoom";
import USpriteFrames from "../../../common/base/USpriteFrames";
import URandomHelper from "../../../common/utility/URandomHelper";

const { ccclass, property } = cc._decorator;

/**
 * 创建:sq
 * 功能：桌子人物变换
 */
@ccclass
export default class VTablePerson extends cc.Component {
    /**
     * 角色图标
     */
    private _person: Array<cc.Sprite>;
    /**
     * 椅子节点
     */
    private _site: Array<cc.Node>;
    /**
     * 资源
     */
    private _res: USpriteFrames;
    /**
     * 下次变换的事件
     */
    private _nextTime: number;

    private _len: number;
    init(res: USpriteFrames) {
        this._res = res;
        this._person = [];
        this._site = [];
        for (let index = 0; index < 5; index++) {
            let idx = index + 1;
            let p = UNodeHelper.getComponent(this.node, "person_" + idx, cc.Sprite);
            let s = UNodeHelper.find(this.node, "site_" + idx);
            this._person.push(p);
            this._site.push(s);
        }
        this._nextTime = URandomHelper.randomBetween(4, 10);
        this._len = res.frames.length;
        this.refresh();

    }
    protected update(dt: number): void {
        this._nextTime -= dt;
        if (this._nextTime < 0) {
            this._nextTime = URandomHelper.randomBetween(4, 10);
            this.refresh();
        }
    }
    private refresh(): void {

        for (let index = 0; index < 4; index++) {
            this._person[index].node.active = false;;
            this._site[index].active = true;
        }

        let arr = [0, 1, 2, 3, 4];
        let count = URandomHelper.randomBetween(1, 5);
        for (let index = 0; index < count; index++) {
            let idx = URandomHelper.randomBetween(0, arr.length);
            let sp = this._res.getFrameIdx(URandomHelper.randomBetween(0, this._len));
            let i = arr[idx];
            arr.splice(idx, 1);
            this._person[i].node.active = true;
            this._person[i].spriteFrame = sp;
            this._site[i].active = false;
        }
    }
}
