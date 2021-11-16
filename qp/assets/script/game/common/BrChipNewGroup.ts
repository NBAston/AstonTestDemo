import UDebug from "../../common/utility/UDebug";
import UEventHandler from "../../common/utility/UEventHandler";
import UNodeHelper from "../../common/utility/UNodeHelper";
// import ShaderMaterial from "../../common/shader/ShaderMaterial";

/**
 * 筹码组管理
 */

const { ccclass, property } = cc._decorator;

const CHIP_COUNT = 6;   // 筹码个数
const GoldRate = 100;


export default class BrChipNewGroup {

    UNCHIP_Y = -60;  // 不可用的时候筹码下滑点
    AVCHIP_Y = -46;  // 可用的时候筹码下滑点
    private _root_node: cc.Node = null;
    private _chips: cc.Node[] = [];

    private _un_toggle: cc.Toggle = null;
    _chip_value_arr = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
    _chip_av_lab = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'];
    _chip_value_map = {
        '1': 'a',
        '2': 'b',
        '5': 'c',
        '10': 'd',
        '20': 'e',
        '50': 'f',
        '100': 'g',
        '200': 'h',
        '500': 'i',
        '1000': 'j',
        '2000': 'k',
        '5000': 'l',
        '10000': 'm',
    }
    _chip_un_lab = ['g', 'g', 'g', 'g', 'g', 'g', 'g'];

    _chip_values = [];

    _cur_sel = 0;
    _cur_sel2 = -1;

    _un_color = cc.color(124, 124, 124);
    _av_color_arr = [cc.color(115, 159, 96),
    cc.color(170, 121, 51),
    cc.color(59, 149, 175),
    cc.color(111, 98, 216),
    cc.color(191, 107, 60),
    cc.color(183, 74, 94),
    cc.color(255, 255, 255)
    ]

    // _lab_mates: ShaderMaterial[] = [];

    /**
     * 设置每个筹码对应的值
     */
    set chipValues(values: Array<number>) {
        this._chip_values = values;
        this.initChips();

    }

    get curSel() {
        let index = -1;

        for (let i = 0; i < this._chips.length; i++) {
            let toggle = this._chips[i].getComponent(cc.Toggle);
            if (toggle.isChecked) {
                index = i;
            }
        }
        return index;
    }

    recoverSave(){
        this._cur_sel2 = this.curSel;
    }

    recoverClear(){
        this._cur_sel2 = -1;
    }

    recover(){
        for (let i = 0; i < this._chips.length; i++) {
            if(this._cur_sel2 == i){
                this.selChip(this._chips[i]);
            }
        }
    }
    constructor(root_node: cc.Node,unchip_y = -60,avchip_y = -46) {
        this.UNCHIP_Y = unchip_y;
        this.AVCHIP_Y = avchip_y;
        this._root_node = root_node;
        this.init();
    }

    init() {
        this.recoverClear();
        for (let i = 1; i <= CHIP_COUNT; i++) {
            let chip_node = UNodeHelper.find(this._root_node, 'toggle' + i);
            this._chips.push(chip_node);
            chip_node.active = false;
        }

    }

    initChips() {
        for (let index = 0; index < this._chip_values.length; index++) {
            const element = this._chip_values[index];
            this._chips[index].active = true;
            let node_choese1 = UNodeHelper.find(this._chips[index], 'sp_chip/checkmark/node_choese');
            let node_choese2 = UNodeHelper.find(this._chips[index], 'sp_chip/checkmark/node_choese2');
            var lab_chip_bg = UNodeHelper.getComponent(this._chips[index], 'Background', cc.Label);
            lab_chip_bg.string = this._chip_value_map[(this._chip_value_arr.includes(element / GoldRate) ? (element / GoldRate) : 1).toString()];
            lab_chip_bg = UNodeHelper.getComponent(this._chips[index], 'sp_chip/checkmark', cc.Label);
            lab_chip_bg.string = this._chip_value_map[(this._chip_value_arr.includes(element / GoldRate) ? (element / GoldRate) : 1).toString()];
            if (element / GoldRate < 1000) {
                node_choese1.active = true;
                node_choese2.active = false;
            } else {
                node_choese2.active = true;
                node_choese1.active = false;

            }
            var lab_chip = UNodeHelper.getComponent(this._chips[index], 'Background/lab_num', cc.Label);
            lab_chip.string = (element / GoldRate).toString();

            lab_chip = UNodeHelper.getComponent(this._chips[index], 'sp_chip/checkmark/lab_num', cc.Label);
            lab_chip.string = (element / GoldRate).toString();
        }

        this._un_toggle = UNodeHelper.getComponent(this._root_node, 'toggle0', cc.Toggle);


    }

    /**
     * 禁用筹码
     */
    unChip(index: number, isback?: boolean) {
        let node = this._chips[index];
        let toggle = node.getComponent(cc.Toggle);
        toggle.interactable = false;
        let back = UNodeHelper.getComponent(node, 'Background', cc.Label);
        let back2 = UNodeHelper.getComponent(node, 'sp_chip/checkmark', cc.Label);
        if (isback) {
            back.setMaterial(0, cc.Material.getBuiltinMaterial('2d-gray-sprite'));
            back2.setMaterial(0, cc.Material.getBuiltinMaterial('2d-gray-sprite'));
            back2.node.parent.active = false;
        }
    }

    /**
     * 启用筹码
     */
    avChip(index: number) {
        let node = this._chips[index];
        let toggle = node.getComponent(cc.Toggle);
        toggle.interactable = true;
        let back = UNodeHelper.getComponent(node, 'sp_chip/checkmark', cc.Label);
        let back2 = UNodeHelper.getComponent(node, 'Background', cc.Label);
        if (back) {
            back.string = this._chip_value_map[(this._chip_value_arr.includes(this._chip_values[index] / GoldRate) ? (this._chip_values[index] / GoldRate) : 1).toString()];
            back.node.opacity = 255;
            back.setMaterial(0, cc.Material.getBuiltinMaterial('2d-sprite'));
            back2.setMaterial(0, cc.Material.getBuiltinMaterial('2d-sprite'));
        }

    }

    selChip(node: cc.Node) {
        let toggle = node.getComponent(cc.Toggle);
        toggle.isChecked = true;
    }

    moveToBack(node: cc.Node) {
        node.stopAllActions();
        node.runAction(cc.moveTo(0.2, node.x, this.UNCHIP_Y));
    }

    moveToUp(node: cc.Node) {
        node.stopAllActions();
        node.runAction(cc.moveTo(0.2, node.x, this.AVCHIP_Y));
    }

    unAllChips() {
        this._cur_sel = this.curSel;
        if(this._cur_sel == 0) {
            this._un_toggle.isChecked = true;
        } else if (this._chips[this._cur_sel]){
            this.selChip(this._chips[this._cur_sel]);
        }
        for (let i = 0; i < this._chips.length; i++) {
            this.unChip(i, true);
            this.moveToBack(this._chips[i]);
        }
    }

    avAllChips() {
        // this._cur_sel = this.curSel;
        if (this._chips[this._cur_sel]){
            this.selChip(this._chips[this._cur_sel]);
            this.recover();
        }
        if (this._chips[this._cur_sel])
        this.selChip(this._chips[this._cur_sel]);
        for (let i = 0; i < this._chips.length; i++) {
            this.moveToUp(this._chips[i]);
        }
    }

    /**
     * 
     * @param score 
     */
    check(score: number) {
        let cur_sel = this.curSel;
        let isSel = false;
        for (let i = 0; i < this._chip_values.length; i++) {
            const element = this._chip_values[i];
            if (element <= score) {
                this.avChip(i);
                if (i <= cur_sel) {
                    this.selChip(this._chips[i]);
                    isSel = true;
                }
                if (cur_sel == -1) {
                    this.selChip(this._chips[0]);
                    isSel = true;
                }
            } else {
                this.unChip(i, true);
                if (i == 0) {
                    this._un_toggle.isChecked = true;
                }
            }
        }
        if(isSel){
            this.recover();
        }
    }

    /**
     * 获取筹码背景值和当前值
     * @param index  (1-max) abcdefg
     */
    getLabBgValue(index: number) {
        let data = {
            bg: this._chip_value_map[(this._chip_value_arr.includes(this._chip_values[index] / GoldRate) ? (this._chip_values[index] / GoldRate) : 1).toString()],//this._chip_av_lab[index],
            value: this._chip_values[index] / GoldRate,
        };
        return data;
    }


    /**
     * 获取当前选中筹码的值
     */
    getCurSelValue() {
        return this._chip_values[this.curSel];
    }

    chipSplik(value: number): any {
        let all_chips = this._chip_values;
        // let ret_chip = [0, 0, 0, 0, 0, 0];

        let ret_chip = [];

        let max_count = 40;  // 每次最多拆分筹码个数

        let chip_rate = [40, 30, 10, 10, 6, 4];
        let max_num = 100;

        while (value > 0) {
            let rand = Math.random() * max_num;
            let index = 0;
            let sum = 0;
            for (let i = 0; i < chip_rate.length; i++) {
                sum += chip_rate[i];
                if (rand <= sum) {
                    index = i;
                    break;
                }
            }

            if (value >= all_chips[index] || index == 0) {
                value -= all_chips[index];
                // ret_chip[index] += 1;
                ret_chip.push(index);
                if (ret_chip.length > max_count) return ret_chip;
            } else {
                // chip_rate[0] += chip_rate[index];
                // chip_rate[index] = 0;
                chip_rate.splice(index, 1);
                max_num = 0;
                for (let i = 0; i < chip_rate.length; i++) {
                    max_num += chip_rate[i];
                }
            }
        }

        // for (let i = 0; i< ret_chip.length; i++) {
        //     ret_chip[i] = ret_chip[i] > max_count ? max_count : ret_chip[i];
        // }

        return ret_chip;
    }

    chipSplik2(value: number) {
        let all_chips = this._chip_values;
        let ret_chip = [0, 0, 0, 0, 0, 0];


        let max_count = 40;  // 每次最多拆分筹码个数


        for (let i = all_chips.length - 1; i >= 0; i--) {
            ret_chip[i] = Math.floor(value / all_chips[i]);
            value %= all_chips[i];
        }

        for (let i = 0; i < ret_chip.length; i++) {
            ret_chip[i] = ret_chip[i] > max_count ? max_count : ret_chip[i];
        }

        return ret_chip;
    }



    start() {

    }
}
