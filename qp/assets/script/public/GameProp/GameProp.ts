import { InformMessageType } from "../../common/base/UAllenum";
import VWindow from "../../common/base/VWindow";
import UDebug from "../../common/utility/UDebug";
import UHandler from "../../common/utility/UHandler";
import ULanHelper from "../../common/utility/ULanHelper";
import AppGame from "../base/AppGame";

const ArrowDirection = {
    TOP: 0,    // 上
    BOTTOM: 1, // 下
    LEFT: 2,   // 左
    RIGHT: 3,  // 右
};

/**丢道具限制时间 */
const LimitTime = 30;
/**丢道具限制次数 */
const LimitCount = 5;

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameProp extends VWindow {

    @property([cc.Node]) arrows: cc.Node[] = [];
    @property(cc.Node) panel: cc.Node = null;

    private _propNode: cc.Node = null;
    private _arrowDirection: number = ArrowDirection.LEFT;
    private _recvUserId: number = 0;
    private _throwCout: number = 0;
    private _time: number = 0;
    private _timerId: any = null;

    show(data: any): void {
        super.show(data);
        this._propNode = data.propNode;
        this._arrowDirection = data.arrowDirection;
        this._recvUserId = data.recvUserId;
        this.setPos();
    }

    /**点击道具 */
    onClickProp(event: any, customData: string) {
        this.playclick();
        if (this._throwCout > (LimitCount - 1)) {
            AppGame.ins.showTips(ULanHelper.GAME_PROP_LIMIT);
            return;
        }
        let body = {
            type: InformMessageType.gameProp,
            msg: {
                sendUserId: AppGame.ins.roleModel.useId,
                recvUserId: this._recvUserId,
                propId: parseInt(customData),
            }
        }
        let str = JSON.stringify(body);
        AppGame.ins.roomModel.requestInformMessage(str);
        this._throwCout++;
        if (this._throwCout == 1) {
            if (this._timerId) {
                window.clearInterval(this._timerId);
                this._timerId = null;
            }
            this._time = 0;
            this._timerId = setInterval(() => {
                if (this._time < LimitTime) {
                    this._time += 1;
                } else {
                    this._time = 0;
                    this._throwCout = 0;
                }
            }, 1000)
        }
        this.clickClose();
    }

    /**点击空白区域 */
    clickClose() {
        this.closeAnimation(UHandler.create(() => {
            AppGame.ins.closeUI(this.uiType);
        }, this));
    }

    /**设置位置 */
    setPos() {
        let subY = -5; // panel图下面有空白
        let headWorldPos = this._propNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var newVec2 = this.node.convertToNodeSpaceAR(headWorldPos);
        this.arrows.forEach(arrow => {
            arrow.opacity = 0;
        });
        switch (this._arrowDirection) {
            case ArrowDirection.TOP:
                this.panel.x = newVec2.x;
                this.panel.y = newVec2.y + this._propNode.height / 2 + this.panel.height / 2 + subY;
                this.arrows[1].opacity = 255;
                break;
            case ArrowDirection.BOTTOM:
                this.panel.x = newVec2.x;
                this.panel.y = newVec2.y - this._propNode.height / 2 - this.panel.height / 2 + subY;
                this.arrows[0].opacity = 255;
                break;
            case ArrowDirection.LEFT:
                this.panel.x = newVec2.x - this._propNode.width / 2 - this.panel.width / 2;
                this.panel.y = newVec2.y + subY;
                this.arrows[3].opacity = 255;
                break;
            case ArrowDirection.RIGHT:
                this.panel.x = newVec2.x + this._propNode.width / 2 + this.panel.width / 2;
                this.panel.y = newVec2.y + subY;
                this.arrows[2].opacity = 255;
                break;
            default:
                break;
        }
    }

}
