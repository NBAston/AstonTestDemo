import UBrlhMusic from "./UBrbjlMusic";
import USpriteFrames from "../../common/base/USpriteFrames";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UHandler from "../../common/utility/UHandler";

const { ccclass, property } = cc._decorator;


export default class BrbjlCards {

    _node_long: cc.Node = null;
    _node_hu: cc.Node = null;

    _node_long_card: cc.Node = null;
    _node_hu_card: cc.Node = null;

    _music_mgr: UBrlhMusic = null;

    _spframe: USpriteFrames = null;

    _node_long_win: cc.Node = null;
    _node_hu_win: cc.Node = null;;


    win_flag: number = 0;  // 和龙虎 012   

    constructor(card1: cc.Node, card2: cc.Node, music_mgr: UBrlhMusic) {
        this._node_long = card1;
        this._node_hu = card2;
        this._music_mgr = music_mgr;
        this.init();


    }

    init() {

        // this._node_long_card = UNodeHelper.find(this._node_long, 'sp_long_card');
        // this._node_hu_card = UNodeHelper.find(this._node_hu, 'sp_hu_card');

        // this._node_hu_card.active = false;
        // this._node_long_card.active = false;

        // this._node_long_card['const_x'] = this._node_long_card.x;
        // this._node_long_card['const_y'] = this._node_long_card.y;
        // this._node_long_card['const_scale'] = this._node_long_card.scale;
        // this._node_hu_card['const_x'] = this._node_hu_card.x;
        // this._node_hu_card['const_y'] = this._node_hu_card.y;
        // this._node_hu_card['const_scale'] = this._node_hu_card.scale;

        // this._node_long_win = UNodeHelper.find(this._node_long, 'spine_win');
        // this._node_hu_win = UNodeHelper.find(this._node_hu, 'spine_win');
        // this._node_hu_win.active = false;
        // this._node_long_win.active = false;

        // this._spframe = UNodeHelper.getComponent(this._node_long_card, '', USpriteFrames);

    }

    clear() {
        this._node_long_card.getComponent(cc.Sprite).spriteFrame = this._spframe.getFrames('poker_b1');
        this._node_hu_card.getComponent(cc.Sprite).spriteFrame = this._spframe.getFrames('poker_b1');

        this._node_hu_win.active = false;
        this._node_long_win.active = false;

    }

    /**
     * 发牌
     * @param action 是否播放发牌动画
     */
    sendCard(action: boolean = false) {

        this._node_long_card.active = true;
        this._node_hu_card.active = true;

        this._node_long_card.getComponent(cc.Sprite).spriteFrame = this._spframe.getFrames('poker_b1');
        this._node_hu_card.getComponent(cc.Sprite).spriteFrame = this._spframe.getFrames('poker_b1');

        this._node_long_card.stopAllActions();
        this._node_hu_card.stopAllActions();

        if (action) {
            this._node_long_card.x = 0;
            this._node_hu_card.x = 0;
            this._node_long_card.scale = 0.01;
            this._node_hu_card.scale = 0.01;

            this._node_long_card.runAction(cc.sequence(cc.delayTime(0.5),
                cc.spawn(cc.moveTo(0.2, this._node_long_card['const_x'], this._node_long_card['const_y']),
                    cc.scaleTo(0.2, this._node_long_card['const_scale']))))

            this._node_hu_card.runAction(cc.sequence(cc.delayTime(0.7),
                cc.spawn(cc.moveTo(0.2, this._node_hu_card['const_x'], this._node_hu_card['const_y']),
                    cc.scaleTo(0.2, this._node_hu_card['const_scale']))))

        }
        else {
            this._node_long_card.x = this._node_long_card['const_x'];
            this._node_long_card.y = this._node_long_card['const_y'];
            this._node_long_card.scale = this._node_long_card['const_scale'];
            this._node_hu_card.x = this._node_hu_card['const_x'];
            this._node_hu_card.y = this._node_hu_card['const_y'];
            this._node_hu_card.scale = this._node_hu_card['const_scale'];

        }
    }


    /**
     * 开牌
     * @param card1 龙牌值
     * @param card2 虎牌值
     * @param action 是否播放动画
     */
    openCard(card1: number, card2: number, action: boolean = true,hander?:UHandler) {
        this._node_long_card.active = true;
        this._node_hu_card.active = true;
        let long_num = card1 & 0x0f;
        let hu_num = card2 & 0x0f;
        if (long_num > hu_num) {
            this.win_flag = 1;
        } else if (hu_num > long_num) {
            this.win_flag = 2;
        } else {
            this.win_flag = 0;
        }

        if (action) {
            // this._node_long_card.runAction(cc.sequence(cc.delayTime(0.5), cc.rotateBy(0, 0, -180),cc.rotateBy(0.2, 0, 90), cc.callFunc((node) => {
                this._node_long_card.runAction(cc.sequence(cc.delayTime(0.5), cc.scaleTo(0.2, 0.01, 1.15), cc.callFunc((node) => {
                let spf = this._spframe.getFrames('poker_' + card1) || this._spframe.getFrames('poker_b1');
                node.getComponent(cc.Sprite).spriteFrame = spf;

                this._music_mgr.playLong();

            }, this), cc.scaleTo(0.1, 1.1), cc.delayTime(0.2), cc.scaleTo(0.1, 1), cc.callFunc(() => {
            // }, this), cc.rotateBy(0.2, 0, 90), cc.delayTime(0.2), cc.scaleTo(0.2, 1), cc.callFunc(() => {
                this._music_mgr.playPaiXing(long_num.toString());
            })));

            this._node_hu_card.runAction(cc.sequence(cc.delayTime(1.5), cc.scaleTo(0.2, 0.01, 1.15), cc.callFunc((node) => {
                let spf = this._spframe.getFrames('poker_' + card2) || this._spframe.getFrames('poker_b1');
                node.getComponent(cc.Sprite).spriteFrame = spf;
                this._music_mgr.playHu();

            }, this), cc.scaleTo(0.1, 1.1), cc.delayTime(0.2), cc.scaleTo(0.1, 1), cc.callFunc(() => {
                this._music_mgr.playPaiXing(hu_num.toString());
            }),
                cc.delayTime(0.2), cc.callFunc(() => {
                    this.showWin(hander);
                })));
        }
        else {
            this._node_long_card.stopAllActions();
            this._node_hu_card.stopAllActions();
            this._node_long_card.x = this._node_long_card['const_x'];
            this._node_long_card.y = this._node_long_card['const_y'];
            this._node_long_card.scale = this._node_long_card['const_scale'];
            this._node_hu_card.x = this._node_hu_card['const_x'];
            this._node_hu_card.y = this._node_hu_card['const_y'];
            this._node_hu_card.scale = this._node_hu_card['const_scale'];

            this._node_long_card.getComponent(cc.Sprite).spriteFrame = this._spframe.getFrames('poker_' + card1) || this._spframe.getFrames('poker_b1');
            this._node_hu_card.getComponent(cc.Sprite).spriteFrame = this._spframe.getFrames('poker_' + card2) || this._spframe.getFrames('poker_b1');
            this.showWin(hander);
        }
    }


    showWin(handler?:UHandler) {

        this._node_long_win.active = false;
        this._node_hu_win.active = false;

        let delt_time = 0.5;

        if (this.win_flag == 1) {
            this._node_long_win.active = true;
            this._node_long_win.opacity = 0;
            this._node_long_win.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(delt_time, 100), cc.fadeTo(delt_time, 255))));
            if(handler) handler.runWith(true);  
        } else if (this.win_flag == 2) {
            this._node_hu_win.active = true;
            this._node_hu_win.opacity = 0;
            this._node_hu_win.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(delt_time, 100), cc.fadeTo(delt_time, 255))));
            if(handler) handler.runWith(false);  
        } else {
            this._node_long_win.active = true;
            this._node_long_win.opacity = 0;
            this._node_long_win.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(delt_time, 100), cc.fadeTo(delt_time, 255))));

            this._node_hu_win.active = true;
            this._node_hu_win.opacity = 0;
            this._node_hu_win.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(delt_time, 100), cc.fadeTo(delt_time, 255))));
        }

    }


}
