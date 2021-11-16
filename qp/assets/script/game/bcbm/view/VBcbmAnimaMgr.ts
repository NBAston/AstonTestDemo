import AppGame from "../../../public/base/AppGame";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VBcbmAnimaMgr extends cc.Component {

    @property(sp.Skeleton)
    spine_start_stop: sp.Skeleton = null;

    @property(sp.Skeleton)
    spine_start_stop2: sp.Skeleton = null;

    @property(sp.Skeleton)
    spine_card_light: sp.Skeleton = null;

    @property(sp.Skeleton)
    spine_reward: sp.Skeleton = null;

    @property(sp.Skeleton)
    spine_reward_bg: sp.Skeleton = null;

 
    onLoad () {
        this.spine_start_stop.setCompleteListener((event) =>{
            this.spine_start_stop.node.active = false;
        });

        this.spine_card_light.setCompleteListener((event) =>{
            this.spine_card_light.node.active = false;
        });

        this.spine_reward.setCompleteListener((event) =>{
            this.spine_reward.node.active = false;
        });

        this.spine_reward_bg.setCompleteListener((event) =>{
            this.spine_reward_bg.node.active = false;
        });
    }

    start () {

    }

    clear() {
        this.spine_start_stop.node.active = false;
        this.spine_card_light.node.active = false;
        this.spine_reward.node.active = false;
        this.spine_reward_bg.node.active = false;
    }

    showCardLight(show:boolean){
        this.spine_start_stop.node.active = show;
    }

    showReward(id:number){
        // var pathArray:string[] =
        // [
        //     "ani/reward/benchiBJ/benchiBJ",
        //     "ani/reward/baomaBJ/baomagai",
        //     "ani/reward/aodiBJ/AodiBJ",
        //     "ani/reward/jiebaoBJ/jiebaoBJ",
        //     "ani/reward/baoshijieBJ/baoshijieBJ",
        //     "ani/reward/mashaladiBJ/mashaladiBJ",
        //     "ani/reward/lanbojiniBJ/lanbojiniBJ",
        //     "ani/reward/falaliBJ/falaliBJ",
        // ]
        // let bundle = cc.assetManager.getBundle(AppGame.ins.roomModel.BundleName)
        // bundle.load(pathArray[id], sp.SkeletonData, function(err, res:any){
        //     if(err) cc.error(err)
        //     cc.loader.setAutoRelease(res, true)
        //     this.spine_reward.skeletonData = res
        //     this.spine_reward.setAnimation(0, 'animation', false)
        // }.bind(this))
        //
        // this.spine_reward.node.active = true;
        // this.spine_reward_bg.setAnimation(0, "animation", false);
        // this.spine_reward_bg.node.active = true

        let animation:string[] =
            [
                "bc",
                "bm",
                "ad",
                "aef",
                "bsj",
                "msld",
                "lbjn",
                "fll",
            ]

        let bundle = cc.assetManager.getBundle(AppGame.ins.roomModel.BundleName)
        bundle.load("ani/kj/bcbm_kj", sp.SkeletonData, function(err, res:any){
            if(err) cc.error(err)
            cc.loader.setAutoRelease(res, true)
            this.spine_reward.skeletonData = res
            this.spine_reward.setAnimation(0, animation[id], false)
        }.bind(this))

        this.spine_reward.node.active = true;
        // this.spine_reward_bg.setAnimation(0, animation[id], false);
        // this.spine_reward_bg.node.active = true
    }

    showStartGame() {
        // this.spine_start_stop.node.active = true;
        // this.spine_start_stop.setAnimation(0, "ksyx", false);
    }

    showStartBet() {
        this.spine_start_stop.node.active = true;
        this.spine_start_stop.setAnimation(0, "ksxz", false);
        // this.spine_start_stop2.setAnimation(0, "start", true);
    }

    showStopBet() {
        // this.spine_start_stop.node.active = true;
        // this.spine_start_stop.setAnimation(0, "tzxz", false);
        // this.spine_start_stop2.setAnimation(0, "stop", false);
    }


}
