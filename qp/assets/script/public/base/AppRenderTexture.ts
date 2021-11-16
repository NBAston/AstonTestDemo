import UNodeHelper from "../../common/utility/UNodeHelper";
import UDebug from "../../common/utility/UDebug";

/**
 * 获取RenderTexture
 */
export default class AppRenderTexture {

    private _camera: cc.Camera;
    private _renderTexture: cc.RenderTexture;
    private _run: boolean;
    /**
     * renderTexture
     */
    get renderTexture(): cc.RenderTexture {
        return this._renderTexture;
    }

    constructor(node: cc.Node) {
        this._camera = UNodeHelper.getComponent(node, "SubCamera", cc.Camera);
    }
    canRender(): boolean {
        if (this._run && this._renderTexture) {
            return true;
        }
        return false;
    }
    setActive(value: boolean): void {
        this._run = value;
        this._camera.node.active = value;
        if (value) {
            //CanvasRenderingContext2D
            this._renderTexture = new cc.RenderTexture();
            
            let win = cc.winSize;
            this._renderTexture.initWithSize(win.width, win.height , 0x8d48); // fix mask bug by zhuwu  use STENCIL_INDEX8
            UDebug.log(document.body.clientWidth + "  " + document.body.clientHeight);
            this._camera.targetTexture = this._renderTexture;
        }
        //let size = cc.view.getCanvasSize();
        // this._renderTexture.initWithSize(size.width, size.height);
    }
}
