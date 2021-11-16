import { ECommonUI, InformMessageType } from "../../common/base/UAllenum";
import UAudioManager from "../../common/base/UAudioManager";
import UDebug from "../../common/utility/UDebug";
import AppGame from "../base/AppGame";
import MRoomModel from "../hall/room_zjh/MRoomModel";

const ArrowDirection = cc.Enum({
    TOP: 0,    // 上
    BOTTOM: 1, // 下
    LEFT: 2,   // 左
    RIGHT: 3,  // 右
})

const AniName = {
    0: 'rose',
    1: 'beer',
    2: 'tomato',
    3: 'boom',
    4: 'kiss',
    5: 'pighead'
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class GamePropManager extends cc.Component {

    @property({
        type: cc.Component.EventHandler,
        tooltip: '根据userId获取道具节点方法'
    })
    getPropNodeFunc: cc.Component.EventHandler = null;

    @property({
        type: ArrowDirection,
        tooltip: '面板箭头指向'
    })
    arrowDirection = ArrowDirection.LEFT;

    private _bindUserId: number = 0;
    private _data: any = null;
    private _propPool: cc.NodePool = new cc.NodePool();

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onClickHead, this);
    }

    onDestroy() {
        this._propPool.clear();
    }

    onEnable() {
        AppGame.ins.roomModel.on(MRoomModel.GAME_INFORM_MESSAGE, this.onInformMessage, this);
    }

    onDisable() {
        AppGame.ins.roomModel.off(MRoomModel.GAME_INFORM_MESSAGE, this.onInformMessage, this);
    }

    /**收到广播 */
    private onInformMessage(data: any) {
        if (data && data.type == InformMessageType.gameProp && data.msg.recvUserId == this._bindUserId) {
            this._data = data;
            if (this.getPropNodeFunc && this._data) {
                this.getPropNodeFunc.emit([data.msg.sendUserId, this.getPropNodeCallback.bind(this)]);
            }
        }
    }

    /**获取道具节点回调 */
    getPropNodeCallback(sendPropNode: cc.Node) {
        if (this._propPool.size() > 0) {
            let aniNode = this._propPool.get();
            this.showPropAni(aniNode, sendPropNode);
        } else {
            let path = 'common/ani/prop/gifts';
            cc.resources.load(path, sp.SkeletonData, (err, skeData: sp.SkeletonData) => {
                if (!err) {
                    let aniNode = new cc.Node();
                    aniNode.addComponent(sp.Skeleton);
                    aniNode.getComponent(sp.Skeleton).skeletonData = skeData;
                    this.showPropAni(aniNode, sendPropNode);
                }
            })
        }
    }

    /**展示道具动画 */
    private showPropAni(aniNode: cc.Node, sendPropNode: cc.Node) {
        let propIndex = this._data.msg.propId;
        let scene = cc.director.getScene();
        aniNode.parent = scene;
        aniNode.getComponent(sp.Skeleton).setAnimation(0, AniName[propIndex] + '_01', false);
        let sendPropNodeWorldPos = sendPropNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let sendPos = scene.convertToNodeSpaceAR(sendPropNodeWorldPos);
        aniNode.setPosition(sendPos);
        let targetNodeWorldPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let targetPos = scene.convertToNodeSpaceAR(targetNodeWorldPos);
        cc.tween(aniNode)
            .to(1.2, { position: cc.v3(targetPos.x, targetPos.y) })
            .call(() => {
                aniNode.getComponent(sp.Skeleton).setAnimation(0, AniName[propIndex] + '_02', false);
                aniNode.getComponent(sp.Skeleton).setCompleteListener(() => {
                    this._propPool.put(aniNode);
                })
            })
            .start()
    }

    /**点击头像 */
    private onClickHead() {
        if (this._bindUserId == AppGame.ins.roleModel.useId) {
            return;
        }
        let params = {
            propNode: this.node,
            arrowDirection: this.arrowDirection,
            recvUserId: this._bindUserId,
        }
        AppGame.ins.currPropUserId = this._bindUserId;
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showUI(ECommonUI.UI_GAME_PROP, params);
    }

    /**设置userId */
    bindUserId(userId: number) {
        this._bindUserId = userId;
    }

    /**获取userId */
    getBindUserId(): number {
        return this._bindUserId;
    }

    /**关闭玩家道具面板 */
    closePropPanelByUserId(userId: number) {
        if (AppGame.ins.currPropUserId == userId) {
            this.node.destroyAllChildren();
            AppGame.ins.closeUI(ECommonUI.UI_GAME_PROP);
        }
    }
}
