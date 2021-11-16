
const ScrollEventTypes = cc.Enum({
    'scroll-to-bottom': -1,
    'scroll-to-top': -1,
    'scroll-to-left': -1,
    'scroll-to-right': -1,
    'bounce-bottom': -1,
    'bounce-top ': -1,
    'bounce-left': -1,
    'bounce-right': -1,
    'scroll-began': -1,
    'scroll-ended': -1,
    'scrolling': -1,
    'touch-up': -1
});

const ScrollEventTypeNames = [
    'scroll-to-bottom',
    'scroll-to-top',
    'scroll-to-left',
    'scroll-to-right',
    'bounce-bottom',
    'bounce-top ',
    'bounce-left',
    'bounce-right',
    'scroll-began',
    'scroll-ended',
    'scrolling',
    'touch-up'
]

const { ccclass, property } = cc._decorator;

@ccclass
export default class UScrollViewHelper extends cc.Component {

    @property({
        type: cc.Component.EventHandler,
        tooltip: '滚动回调事件'
    })
    scrollEventCallback: cc.Component.EventHandler = null;

    @property({
        type: ScrollEventTypes,
        tooltip: '滚动事件类型'
    })
    scrollEventType = ScrollEventTypes["bounce-bottom"];

    @property({
        type: cc.Node,
        tooltip: '检测的内容列表父节点，没有则默认为ScrollView的content'
    })
    checkContent: cc.Node = null;

    @property({
        tooltip: '默认item 透明度'
    })
    itemOpacity: number = 255;

    _content: cc.Node = null;
    _svBoxRect: cc.Rect = null;
    _isShowing: boolean = false;

    onEnable() {
        if (!this.node.getComponent(cc.ScrollView)) return;
        this._content = this.checkContent || this.node.getComponent(cc.ScrollView).content;
        this.node.on(ScrollEventTypeNames[this.scrollEventType], this.onScrollEvent, this);
        // this.node.on('scrolling', this.onEventScrolling, this);

        this._svBoxRect = new cc.Rect(
            0,
            0,
            cc.winSize.width,
            cc.winSize.height
        )

        this._isShowing = true;
    }

    onDisable() {
        this.node.off(ScrollEventTypeNames[this.scrollEventType], this.onScrollEvent, this);
        // this.node.off('scrolling', this.onEventScrolling, this);
        this._isShowing = false;
    }

    /**检测交叉包围盒 */
    checkIntersects() {
        if (!this._content || this._content.childrenCount == 0) {
            return;
        }
        this._svBoxRect.width = cc.winSize.width;
        this._svBoxRect.height = cc.winSize.height;
        for (let i = 0; i < this._content.childrenCount; i++) {
            var childNode = this._content.children[i];
            if (childNode.getBoundingBoxToWorld().intersects(this._svBoxRect)) {
                if (childNode.opacity != this.itemOpacity) {
                    childNode.opacity = this.itemOpacity;
                }
            } else {
                if (childNode.opacity != 0) {
                    childNode.opacity = 0;
                }
            }
        }
    }

    /**滚动事件回调 */
    onScrollEvent() {
        if (this.scrollEventCallback) {
            this.scrollEventCallback.emit([this.scrollEventCallback.customEventData]);
        }
    }

    /**Scrolling滚动事件回调 */
    onEventScrolling() {
        // this.checkIntersects();
    }

    update(dt) {
        if (this._isShowing) {
            this.checkIntersects();
        }
    }

}
