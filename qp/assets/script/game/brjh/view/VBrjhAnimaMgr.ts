
const {ccclass, property} = cc._decorator;

@ccclass
export default class VBrjhAnimaMgr extends cc.Component {

    @property(sp.Skeleton)
    spine_start_stop: sp.Skeleton = null;
    @property(sp.Skeleton)
    spine_all_win: sp.Skeleton = null;
    @property(sp.Skeleton)
    spine_all_lose: sp.Skeleton = null;

    onLoad () {

        this.spine_start_stop.setCompleteListener((event) => {
            this.spine_start_stop.node.active = false;
        });

        this.spine_all_lose.setCompleteListener((event:any)=> {
            this.spine_all_lose.node.active = false;
        });

        this.spine_all_win.setCompleteListener((event:any)=> {
            this.spine_all_win.node.active = false;
        });

    }

    start () {

    }

    clear() {
        this.spine_all_win.node.active = false;
        this.spine_all_lose.node.active = false;
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

    playAllWin() {
        this.spine_all_win.node.active = true;
        this.spine_all_win.setAnimation(0 , 'zjts' , true);
    }

    playAllLose() {
        this.spine_all_lose.node.active = true;
        this.spine_all_lose.setAnimation(0 , 'zjtp' , true);
    }
}