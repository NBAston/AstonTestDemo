import UNodeHelper from "../../common/utility/UNodeHelper";
import UDebug from "../../common/utility/UDebug";




const { ccclass, property } = cc._decorator;

@ccclass
export default class VSSSPokeAni extends cc.Component {

    @property({ type: [cc.Node] })
    private pokepos: Array<cc.Node> = []


    private _pokeAniNode: cc.Node

    private _duns: { [key: number]: { [key: number]: number } }

    onLoad() {
        this._duns = {
            [0]: { [0]: 0, [1]: 1, [2]: 2 },
            [1]: { [0]: 3, [1]: 4, [2]: 5, [3]: 6, [4]: 7 },
            [2]: { [0]: 8, [1]: 9, [2]: 10, [3]: 11, [4]: 12 },
        }
        if (this._pokeAniNode == null) {
            this._pokeAniNode = UNodeHelper.find(this.node, "aniNode")
            this._pokeAniNode.zIndex = 100
            UNodeHelper.find(this.node, "shootAni").zIndex = 1000
        }

    }

    onDestroy() {
        this._duns = null
    }

    /**播放开牌动作  */
    playFapai(dunindex: number, delayTime: number): void {
        let sep1 = cc.callFunc(() => {
            UDebug.Log("播放开牌动作" + this._pokeAniNode.childrenCount)
            this._pokeAniNode.setScale(0, 1)
            for (const key in this._duns[dunindex]) {
                if (this._duns[dunindex].hasOwnProperty(key)) {
                    const element = this._duns[dunindex][key];
                    this.pokepos[element].setParent(this._pokeAniNode)
                }
            }
        })
        let sep2 = cc.sequence(cc.delayTime(delayTime), sep1, cc.scaleTo(0.15, 1.1, 0.9), cc.scaleTo(0.2, 1.0, 1))
        this._pokeAniNode.runAction(cc.sequence(sep2, cc.callFunc(() => {
            this._pokeAniNode.setScale(1)
            for (const key in this._duns[dunindex]) {
                if (this._duns[dunindex].hasOwnProperty(key)) {
                    const element = this._duns[dunindex][key];
                    this.pokepos[element].setParent(this.node)
                    this.pokepos[element].zIndex = element
                }
            }
        })));
    }

    free(): void {
        this.node.stopAllActions()
        this.unscheduleAllCallbacks()
    }

}
