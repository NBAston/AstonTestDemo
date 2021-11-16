
/**
 * 朱武
 * 百人筹码池管理
 */
const { ccclass, property } = cc._decorator;

export default class BrChipPool {

    private _tmp_chip: cc.Node = null;

    private _pool: cc.NodePool = null;

    private _parent: cc.Node = null;


    constructor(tmp_chip: cc.Node, layer: cc.Node) {

        this._pool = new cc.NodePool();
        this._tmp_chip = tmp_chip;
        this._parent = layer;

        this.init();
    }


    clear() {

        this.recoverAllChipToPool();
    }



    set poolSize(size: number) {
        for (let i = 0; i < size; i++) {
            let chip = cc.instantiate(this._tmp_chip);
            this._pool.put(chip);
        }
    }

    /**
     * 回收所有筹码
     */
    recoverAllChipToPool() {
        while (this._parent.children.length > 0) {
            let node = this._parent.children[0];
            this._pool.put(node);
        }

    }

    putChipToPool() {

        let chip = cc.instantiate(this._tmp_chip);
        this._pool.put(chip);
    }



    /**
     * 从桌面筹码回收一个筹码放入筹码池
     */
    recoverChipToPool(): boolean {
        let layer = this._parent;
        let pool = this._pool;

        if (layer.children.length > 0) {
            pool.put(layer.children[0]);
            return true;
        }
        return false;
    }

    getChipByPool() {
       
        if (this._pool.size() <= 0) {     // 筹码池不够
            if (this.recoverChipToPool() == false) {
                this.putChipToPool();
            }
        }
        let chip_node = this._pool.get();

        chip_node.active = true;
        chip_node.opacity = 255;
        return chip_node;
    }



    init() {

    }



}
