

const { ccclass, property } = cc._decorator;

@ccclass
export default class VFlagAnim extends cc.Component {

    @property(cc.Sprite)

    target: cc.Sprite = null;

    private _showtime: number;

    protected update(dt: number): void {
        this._showtime = -dt;
        if (this._showtime < 0) {
            this.hide();
        }
    }

    show(sp: cc.SpriteFrame): void {
        this.target.spriteFrame = sp;
        this.node.active = true;
        this._showtime = 1;
    }

    hide(): void {
        this._showtime = -1;
        this.node.active = false;
    }
    
}
