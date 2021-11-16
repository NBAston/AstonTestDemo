const { ccclass, property } = cc._decorator;
@ccclass
export default class pdk_time_hy extends cc.Component {
  
    @property(cc.Sprite) timeSprite: cc.Sprite = null;
    @property(cc.Label) timeLab: cc.Label = null;
    @property(cc.Label) scoreClock: cc.Label = null;
    @property(cc.Label) cardClock: cc.Label = null;
    @property(cc.Node) cardPass: cc.Node = null;
    @property(cc.Node) cardHint: cc.Node = null;
    @property(cc.Node) cardOut: cc.Node = null;
   


    onLoad() {

    }

    update(dt: number) {

    }

    //  /**帧更新 */
    //  update(dt: number): void {

    //  }

}
