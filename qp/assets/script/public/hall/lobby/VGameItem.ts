import UHandler from "../../../common/utility/UHandler";
import { UIGameItem } from "../../../common/base/UAllClass";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventListener from "../../../common/utility/UEventListener";
import USpriteFrames from "../../../common/base/USpriteFrames";
import { EGameState, EGameStatus, EGameUpdateStatus } from "../../../common/base/UAllenum";
import UDebug from "../../../common/utility/UDebug";
import UResLoader from "../../../common/base/UResLoader";
import UResManager from "../../../common/base/UResManager";


const { ccclass, property } = cc._decorator;

/**
 * 创建:gj
 * 作用：游戏的入口ui
 */
export default class VGameItem {

    private _key: string;
    /**
     *点击事件 
     */
    clickHandler: UHandler;
    /**
     *入口图片 
     */
    private _icon: cc.Sprite;
    /**进度背景 */
    private _processBg: cc.Node;
    /**进度圈 */
    private _jd: cc.Sprite;
    //游戏状态
    private _gameState: cc.Sprite;
    /**进度文字 */
    private _process: cc.Label;
    /**游戏标识 */
    get GameType(): number {
        if (this._data) {
            return this._data.gameType;
        }
        return -1;
    }
    /**下载游戏的图标 */
    private _downloadSign: cc.Node;
    // get IsHaveNewVersion():boolean{
    //     return this._downloadSign.active;
    // }

    // private _isCheck:boolean = false;
    // get IsCheck():boolean{
    //     return this._isCheck;
    // }
    // set IsCheck(IsCheck:boolean){
    //     this._isCheck = IsCheck;
    // }


    /**
     * 数据
     */
    public _data: UIGameItem;
    /**
     * 根节点
     */
    private _node: cc.Node;
    private _gameName: cc.Label;
    private _gameTitle: cc.Sprite;
    private _hall_game_lock: cc.Node;
    /**
     * 是否处于run状态
     */
    private _run: boolean;
    /** */
    private _res: USpriteFrames;

    private _gameSpine: sp.Skeleton;
    /**
     * 点击事件
     */
    private onclickhandler(): void {
        if (this._data && this.clickHandler) {
            this.clickHandler.runWith(this._data.gameType);
        }
    }
    /**
     * 存储key值
     */
    get Key(): string {
        return this._key;
    }
    /**
     * 初始化
     */
    init(node: cc.Node, res: USpriteFrames): void {
        this._node = node;
        this._key = node.name;
        this._res = res;
        this._icon = UNodeHelper.getComponent(node, "icon", cc.Sprite);
        let btn = UNodeHelper.find(node, "btn");
        UEventListener.get(btn).onClick = new UHandler(this.onclickhandler, this);
        this._processBg = UNodeHelper.find(node, "bg1");
        this._gameSpine = UNodeHelper.getComponent(node, "game_spine", sp.Skeleton);
        this._jd = UNodeHelper.getComponent(this._processBg, "jd", cc.Sprite);
        this._process = UNodeHelper.getComponent(this._processBg, "process", cc.Label);
        this._downloadSign = UNodeHelper.find(node, "hotdownload");
        this._gameTitle = UNodeHelper.getComponent(node, "game_title", cc.Sprite);
        this._gameName = UNodeHelper.getComponent(node, "name", cc.Label);
        this._hall_game_lock = UNodeHelper.find(node, "hall_img_close");
        this._gameState = UNodeHelper.getComponent(node, "game_status", cc.Sprite);
        this._gameName.node.color = new cc.Color(0,0,255,255);
        this._gameName.node.active = false;
        this._jd.node.active = false;
        this._jd.fillRange = 0;
        this._processBg.active = false;
        this._process.node.active = false;
        this._downloadSign.active = false;
    }

    /**
     * 绑定数据
     * @param data UIGameItem
     * @param frame 图片
     */
    bind(data: UIGameItem): void { 
        this.setactive(true);
        this._data = data;
        this._icon.spriteFrame = this._res.getFrames(data.gameIcon);
        this._icon.node.active = true;
        // this._gameName.string = data.gameType.toString();
        // this._gameName.string = data.gameState.toString();
        this._gameName.string = data.gameIcon.toString();
        if (data.gameState == EGameState.WeiHu) {
            this._hall_game_lock.active = true;
        } else {
            this._hall_game_lock.active = false;
            var url = ""
            if (data.gameState == EGameState.Hot){
                url = "common/hall/texture/huobao"
                UResManager.loadUrl(url,this._gameState)
            }else if (data.gameState == EGameState.New){
                url = "common/hall/texture/zuixin"
                UResManager.loadUrl(url,this._gameState)
            }
        }
        if (data.gameType == 450) {//德州入口动画需要开启alpha通道，其他游戏入口不需要
            this._gameSpine.premultipliedAlpha = true;
        }
        let spineBasePath = "common/hall/ani/gameIconSpine/" + data.abbreviateName + "/";
        cc.loader.loadRes(spineBasePath+data.gameSpine,  sp.SkeletonData, function(err, res) {
            if(err) {
                cc.error(err);
            }
            // var node=new cc.Node('spine1')
            //调用新建的node的addComponent函数，会返回一个Skeleton的对象
            // var spine=node.addComponent(sp.Skeleton)
            //给spine的skeletonData属性 赋值
            cc.loader.setAutoRelease(res, true);
            this._gameSpine.skeletonData=res;
            //把新的节点追加到父节点
            // node.parent = this.left1;       //必须在设置动画前添加到父节点，否则动画不能正常播放
            this._gameSpine.setAnimation(0, 'animation', true);
        }.bind(this))

        //加载游戏类型标题
        if (data.gameIcon != "") {
            let spritePath = "common/hall/texture/" + data.gameIcon + "_title"
            cc.loader.loadRes(spritePath, cc.SpriteFrame, function (err, res) {
                if (err) {
                    cc.error(err);
                    return
                }
                this._gameTitle.spriteFrame = res;
                res.addRef();
            }.bind(this))
        }

        switch (data.gameState) {
            /**普通 */
            case 0:
                {
                    this._icon.setMaterial(0, cc.Material.getBuiltinMaterial('2d-sprite'));
                }
                break;
            /**New */
            case 1:
                {
                    this._icon.setMaterial(0, cc.Material.getBuiltinMaterial('2d-sprite'));
                }
                break;
            /**Hot */
            case 2:
                {
                    this._icon.setMaterial(0, cc.Material.getBuiltinMaterial('2d-sprite'));
                }
                break;
            /**维护 */
            case 3:
                {
                    this._icon.setMaterial(0, cc.Material.getBuiltinMaterial('2d-gray-sprite'));
                }
                break;
        }
    }
    /**
     * 激活显示UI
     * @param value  boolean
     */
    setactive(value: boolean): void {
        this._node.active = value;
    }
    /**
     * 设置父对象
     * @param parent 
     */
    setparent(parent: cc.Node): void {
        this._node.parent = parent;
    }
    /**
     * 重置
     */
    reset(): void {
        if (this.clickHandler) {
            this.clickHandler.clear();
        }
        this.setactive(false);
    }
    update(): void {
        if (this._run) return;

    }
    /**
    * 更新标记绑定
    * @param updateStatus 0需要更新,1更新中,2已经是最新版本 
    */
    setUpdateStatus(updateStatus: EGameUpdateStatus): void {
        switch (updateStatus) {
            case EGameUpdateStatus.Update:
                {
                    this.showDownLoadSign();
                    this.hideProccess();
                }
                break;
            case EGameUpdateStatus.Updated:
                {
                    this.hideDownLoadSign();
                    this.hideProccess();
                }
                break;
            case EGameUpdateStatus.Updating:
                {
                    this.hideDownLoadSign();
                    this.showProccess();
                }
                break;
        }
    }
    protected showProccess() {
        this._jd.node.active = true;
        this._processBg.active = true;
        this._process.node.active = true;
    }
    protected hideProccess() {
        if (this._jd && this._jd.isValid) {
            this._jd.node.active = false;
        }
        if (this._processBg && this._processBg.isValid) {
            this._processBg.active = false;
        }

        if (this._process && this._process.isValid) {
            this._process.node.active = false;
        }
    }
    setProccess(percent: number) {

        if (percent) {
            let count = percent || 0;
            this._jd.fillRange = -count || 0;
            this._process.string = Math.round((count || 0) * 100).toFixed() + "%";
        }
    }

    protected showDownLoadSign() {
        //维护不显示更新
        if (this._data.gameState == EGameState.WeiHu) return
        this._downloadSign.active = true;
        this.hideProccess();
    }

    protected hideDownLoadSign() {
        this._downloadSign.active = false;
    }

}
