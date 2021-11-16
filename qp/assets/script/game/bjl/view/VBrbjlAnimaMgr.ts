import AppGame from "../../../public/base/AppGame";

const { ccclass, property } = cc._decorator;
@ccclass
export default class VBrbjlAnimaMgr extends cc.Component {

    @property(sp.Skeleton)
    spine_start_stop: sp.Skeleton = null;
    @property(cc.Node)
    node_vs: cc.Node = null;
    @property(sp.Skeleton)
    spine_vs: sp.Skeleton = null;
    @property(sp.Skeleton)
    result_win: sp.Skeleton = null;
    
    
    onLoad() {
        this.spine_start_stop.setCompleteListener((event) => {
            this.spine_start_stop.node.active = false;
        });
        this.spine_vs.setCompleteListener((event) => {
            this.node_vs.active = false;
        });
        // this.dragon_win.on(dragonBones.EventObject.COMPLETE, () => {
        //     this.dragon_win.node.active = false;
        // }, this);
        // this.tiger_win.on(dragonBones.EventObject.COMPLETE, () => {
        //     this.tiger_win.node.active = false;
        // }, this);
    }
    start() {
    }
    clear() {
        this.node_vs.active = false;
        this.spine_start_stop.node.active = false;
    }
    /**
     * 播放开始下注
     */
    showStartBet() {
        this.spine_start_stop.node.active = true;
        this.spine_start_stop.setAnimation(0, 'ksxz', false);
    }
    /**
     * 播放停止下注
     */
    showStopBet() {
        this.spine_start_stop.node.active = true;
        this.spine_start_stop.setAnimation(0, 'tzxz', false);
    }

    showWin(value: number): void {
        var path = "ani/win/";
        this.result_win.node.active = true;
        if (value == 1) {
            this.playSpine(path, "zhuangying", this.result_win, false, () => {
                this.result_win.node.active = false;
            });
        } else if(value == 2) {
            this.playSpine(path, "xianying", this.result_win, false, () => {
                this.result_win.node.active = false;
            });
        } else {
            // 和局
            this.playSpine(path, "heju", this.result_win, false, () => {
                this.result_win.node.active = false;
            });
        }
    }
    /**
     * 播放VS
     */
    showVsAnima() {
        this.node_vs.active = true;
        this.node_vs.opacity = 0;
        // this.node_vs.runAction(cc.sequence(cc.delayTime(2), cc.callFunc(() => {
        this.node_vs.opacity = 255;
        // this.spine_vs.setAnimation(0, 'animation', false);
        // }, this)));
    }

    //播放spine动画 
    playSpine(path: string, animation: string, skeleton: sp.Skeleton, loop: boolean, callback?: Function): void {
        if (AppGame.ins.roomModel.BundleName == "") return
        let bundle = cc.assetManager.getBundle(AppGame.ins.roomModel.BundleName)
        bundle.load(path, sp.SkeletonData, function (err, res: any) {
            if (err) cc.error(err)
            cc.loader.setAutoRelease(res, true)
            skeleton.skeletonData = res
            skeleton.setAnimation(0, animation, loop)
            skeleton.setCompleteListener((event) => {
                if (callback != undefined) callback()
            })
        })
    }

}
