
import { isMainThread } from "worker_threads";
import USpriteFrames from "../../../common/base/USpriteFrames";


const { ccclass, property } = cc._decorator;
@ccclass
export default class pdk_result_item_hy extends cc.Component {
    @property(cc.Label) nickname: cc.Label = null;
    @property(cc.Label) discore: cc.Label = null;
    @property(cc.Label) leftcard: cc.Label = null;
    @property(cc.Label) coin: cc.Label = null;
    @property(cc.Node) info_icon: cc.Node = null; // 封顶破产图标节点
    @property(cc.Node) info_icon_guan: cc.Node = null; // 关，被关标签
    @property(cc.Node) resultPanel: cc.Node = null;

    public upFlag:boolean = false
    public lockFlag:boolean = false
    _cardValue: number = 0;

    setItemInfo(isbaopei: number,winstat: number, nickname: string, discore: string, leftcard: string, coin: string, scorestatus: number, color1: cc.Color) {
        this.nickname.string = nickname;
        this.discore.string = discore;
        this.leftcard.string = leftcard;
        this.coin.string = coin;
        this.nickname.node.color = color1;
        this.discore.node.color = color1;
        this.coin.node.color = color1;
        this.leftcard.node.color = color1;
        if(scorestatus == 0) {
            this.info_icon.active = false;
        } else if(scorestatus == 1 || scorestatus == 2) {
            this.info_icon.active = true;
            this.info_icon.getComponent(cc.Sprite).spriteFrame = this.info_icon.getComponent(USpriteFrames).frames[scorestatus-1];
        }

        if(isbaopei == 1) { // 包赔isbaopei = 1 
            this.info_icon_guan.active = true;
            this.info_icon_guan.getComponent(cc.Sprite).spriteFrame = this.info_icon_guan.getComponent(USpriteFrames).frames[4];
        } else {
            if(winstat == 0) {//0正常输赢，1被关，2反关，3双关，4单关。
                this.info_icon_guan.active = false;
            } else if(winstat == 1 || winstat == 2 || winstat == 3 || winstat == 4){
                this.info_icon_guan.active = true;
                this.info_icon_guan.getComponent(cc.Sprite).spriteFrame = this.info_icon_guan.getComponent(USpriteFrames).frames[winstat-1];
            }
        }

    }


}
