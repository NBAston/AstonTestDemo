import VChipItem from "./VBJChipItem";
import USpriteFrames from "../../../common/base/USpriteFrames";
import URandomHelper from "../../../common/utility/URandomHelper";
import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import cfg_chip from "../../../config/cfg_chip";
import AppGame from "../../../public/base/AppGame";
import { UIBJChipItem } from "../UBJData";
import UDateHelper from "../../../common/utility/UDateHelper";
import UDebug from "../../../common/utility/UDebug";


/**
 * 创建:gss
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

    private _jishuqi: number
    constructor(root: cc.Node) {

        this._root = root;
        this._prefab = UNodeHelper.find(this._root, "node");
        this._pool = [];
        this._run = [];
        this._jishuqi = 0
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
    // /**
    //  * 创建
    //  * @param pos 
    //  * @param chipType 
    //  * @param chipValue 
    //  * @param chipCount 
    //  */
    // createChip(start: cc.Vec2,end:cc.Vec2, chipType: string, chipValue: number, chipCount: number, objId: number): Array<number> {

    //     start = this._root.convertToNodeSpaceAR(start);
    //     let endPos = this._root.convertToNodeSpaceAR(end);
    //     for (let i = 0; i < chipCount; i++) {
    //         let item = this.getInstance();

    //         let angel = this.getRotAngel();
    //         item.bind(start, objId, chipType, chipValue);
    //         item.moveTo(endPos, true);
    //         this._run.push(item);
    //     }
    //     return [];
    // }




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
            element.moveTo(end, false, time);
        }
    }
    reset(): void {
        this.relainmAll();
        this._jishuqi = 0
    }
    private getEndPos(endpos: cc.Vec2): cc.Vec2 {
        let end = new cc.Vec2();
        end.x = endpos.x - 3;
        end.y = endpos.y - 3;
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

    private getItemByUserid(userid: number) {
        let itemArr = new Array<VChipItem>();
        let len = this._run.length;
        for (let i = 0; i < len; i++) {
            const element = this._run[i];
            let itemId = Math.floor(element.objId / 1000)
            if (itemId == userid) {
                itemArr.push(element);
            }
        }
        return itemArr;
    }


    //     //飞筹码
    //     moveChip(start: cc.Vec2,end:cc.Vec2, chipType: string, chipValue: number, chipCount: number, objId: number): Array<number> 
    //     {

    //         start = this._root.convertToNodeSpaceAR(start);
    //         let endPos = this._root.convertToNodeSpaceAR(end);
    //         for (let i = 0; i < chipCount; i++) {

    //             //item.moveToBack(endPos);
    //                 //this._run.push(item);
    //         }
    //         return [];
    //     }

    //  //飞回收筹码
    //  private chipBack(caller: Blackjack.CMD_S_AddScore): void {
    //     let wOperUsertid = this.getUISeatId(caller.wOperUser)
    //     let seatid = this.getFenPaiYuanSeatId(caller.wSeat)

    //     let count = 1;
    //     //分数量 暂不用


    //     let chips = new UIBJChip();
    //     chips.items = [];
    //     chips.chipState = caller.wUserScore;
    //     for (let i = 0; i < count; i++) {
    //         let chip = this.getchipitems(wOperUsertid, caller.wJettonScore);
    //         chips.items.push(chip);
    //     }
    //     this.emit(MBJ.CC_CZ_PUT_OUT_CHIP, chips,seatid,true);

    // }
    //  /**刷chipitem */
    //  private brash_chip(userId: number,seatId: number, state: number, chipvalue: number, isCompre: boolean): void {
    //    let value = chipvalue;
    //    let count = 1;
    //    //分数量 暂不用
    //    let totoalScore = chipvalue

    //    let chips = new UIBJChip();
    //    chips.items = [];
    //    chips.chipState = state;
    //    for (let i = 0; i < count; i++) {
    //        let chip = this.getchipitems(userId, value);
    //        chips.items.push(chip);
    //    }
    //    this.emit(MBJ.CC_CZ_PUT_OUT_CHIP, chips,seatId,false);
    // }

    // /**获取chipitem */
    private getchipitems(userId: number, chipvalue: number, areaType: number): UIBJChipItem {
        let chip = new UIBJChipItem();
        chip.chipType = this.getchiptypeBySocre(chipvalue);
        chip.objId = this.getchipId(userId, areaType);
        chip.gold = chipvalue;
        chip.seatId = userId;
        return chip;
    }

    // // 下注筹码位置 0-4  0 中间下注位置 1 保险下注位置 2 左边分牌筹码位置  3 右边分牌筹码位置  4其他玩家区域位置
    // //000 /玩家 / 位置 /筹码id
    private getchipId(userId: number, areaType: number): number {
        this._jishuqi++
        let num = userId * 10000 + areaType * 1000 + this._jishuqi
        return num;
    }

    // /**根据底注获取筹码 样式 */
    private getchiptypeBySocre(socre: number): string {
        //let idx = AppGame.ins.bjModel.getRoomInfo.jettons.indexOf(socre);
        //let idx = URandomHelper.randomBetween(0, 5)
        let idx = socre
        if (idx < 0) {
            return cfg_chip[0];
        }
        return cfg_chip[idx];
    }

    /**
        * 创建
        */
    createChip(userId: number, seatid: number, start: cc.Vec2, end: cc.Vec2, areaType: number, chipValue: number): Array<number> {

        let startPos = this._root.convertToNodeSpaceAR(start);
        let endPos = this._root.convertToNodeSpaceAR(end);
        endPos = this.getEndPos(endPos)
        let chipType = this.getchiptypeBySocre(chipValue)
        let objId = this.getchipId(userId, areaType)
        let item = this.getInstance();

        item.bind(startPos, objId, seatid, chipType, chipValue);
        item.moveTo(endPos, true);
        this._run.push(item);
        return [];
    }
    /**移动筹码 */
    moveChip(seatId: number, end: cc.Vec2, areaType?: number, value?: boolean): void {

        let endPos = this._root.convertToNodeSpaceAR(end);
        let len = this._run.length;

        let movetime = 0.1;
        for (let i = 0; i < len; i++) {
            if (this._run[i].seatid == seatId) {
                const element = this._run[i];
                if (areaType != null) {
                    let areanum = Math.floor(this._run[i].objId % 10000 / 1000)
                    if (areanum == areaType) {
                        if (value) //消失
                        {
                            element.moveTo(endPos, true, movetime, true);
                            movetime += 0.07;
                        }
                        else {
                            element.moveTo(endPos, true, movetime);
                            movetime += 0.07;
                        }

                    }
                }
                else {
                    if (value) {
                        element.moveTo(endPos, true, movetime, true);
                        movetime += 0.07;
                    }
                    else {
                        element.moveTo(endPos, true, movetime);
                        movetime += 0.07;
                    }
                }

            }
        }
    }


}
