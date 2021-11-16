import UAudioManager from "../../../common/base/UAudioManager";
import VWindow from "../../../common/base/VWindow";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ui_award_roomCard extends VWindow {

    @property(cc.Label) roomCardNumLbl: cc.Label = null;
    @property(sp.Skeleton) ani: sp.Skeleton = null;
    @property(cc.Node) title: cc.Node = null;

    show(data: any) {
        super.show(data);
        console.log('ui_award_roomCard show => ', data)
        this.roomCardNumLbl.node.opacity = 0;
        this.title.opacity = 0;
        this.roomCardNumLbl.string = '';

        if (data && data.roomCardNum) {
            this.roomCardNumLbl.string = 'x' + (Number(data.roomCardNum).toFixed(2));
        }

        UAudioManager.ins.playSound("audio_get_room_card");
        cc.tween(this.roomCardNumLbl.node).to(0.5, { opacity: 255, }, { easing: 'sineIn' }).start();
        cc.tween(this.title).to(0.5, { opacity: 255 }, { easing: 'sineIn' }).start();
        this.ani.setAnimation(0, 'fk_start', false);
        this.ani.setCompleteListener(() => {
            this.ani.setAnimation(0, 'fk_normal', true);
        })
    }

}
