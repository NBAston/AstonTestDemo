import UNodeHelper from "../../common/utility/UNodeHelper";
import USpriteFrames from "../../common/base/USpriteFrames";
import cfg_brhh from "./cfg_brhh";
import UDebug from "../../common/utility/UDebug";
import UBrhhMusic from "./UBrhhMusic";
import UHandler from "../../common/utility/UHandler";
import AppGame from "../../public/base/AppGame";
import AppStatus from "../../public/base/AppStatus";


const GoldRate = 100;  //

/**
 * 百人红黑牌组管理   
 */

export default class BrhhCardGroup {

    private _node_root: cc.Node = null;

    private _node_light: cc.Node = null;  // 中了之后闪烁的node

    private _node_card_type: cc.Node = null;

    private _spine_card_type: sp.Skeleton = null;

    private _node_card1 = null;
    private _node_card2 = null;
    private _node_card3 = null;

    private _sprite_frames: USpriteFrames = null;

    _card1_pos: cc.Vec2;
    _card2_pos: cc.Vec2;
    _card3_pos: cc.Vec2;

    _music_mgr: UBrhhMusic = null;
    private _card_type = 0;

    _is_win: boolean = false;

    constructor(root: cc.Node, music_mgr: UBrhhMusic) {
        this._node_root = root;
        this._music_mgr = music_mgr;
        this.init();
    }


    init() {

        this._sprite_frames = UNodeHelper.getComponent(this._node_root, '', USpriteFrames);
        this._node_light = UNodeHelper.find(this._node_root, 'sp_light');
        this._node_card_type = UNodeHelper.find(this._node_root, 'node_card_type');

        this._spine_card_type = UNodeHelper.getComponent(this._node_card_type, '', sp.Skeleton);

        this._node_card1 = UNodeHelper.find(this._node_root, 'sp_card1');
        this._node_card2 = UNodeHelper.find(this._node_root, 'sp_card2');
        this._node_card3 = UNodeHelper.find(this._node_root, 'sp_card3');
        this._card1_pos = new cc.Vec2(this._node_card1.position);
        this._card2_pos = new cc.Vec2(this._node_card2.position);
        this._card3_pos = new cc.Vec2(this._node_card3.position);
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);

    }


    clear() {
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        this._node_light.stopAllActions();
        // this._node_light.opacity = 0;
        this._node_light.active = false;
        this._node_card_type.opacity = 0;
        this._node_card_type.active = false;

        this._node_card1.opacity = 0;
        this._node_card2.opacity = 0;
        this._node_card3.opacity = 0;

        this.resetAnimation();
        this.isWin = false;
    }

    get position() {
        return this._node_root.position;
    }


    set cardType(card_type: number) {
        this._card_type = card_type;
    }

    set isWin(is_win: boolean) {
        this._is_win = is_win;
    }

    resetAnimation() {
        this._node_root.stopAllActions();
        this._node_card1.stopAllActions();
        this._node_card2.stopAllActions();
        this._node_card3.stopAllActions();
        UNodeHelper.getComponent(this._node_card1, '', cc.Sprite).spriteFrame = this._sprite_frames.getFrames('poker_b1');
        UNodeHelper.getComponent(this._node_card2, '', cc.Sprite).spriteFrame = this._sprite_frames.getFrames('poker_b1');
        UNodeHelper.getComponent(this._node_card3, '', cc.Sprite).spriteFrame = this._sprite_frames.getFrames('poker_b1');
    }

 /**
 * 游戏切换到后台
 * @param isHide 是否切在后台
 */
    onGameToBack(isBack: boolean) {
        if (!isBack) {
           this.resetAnimation();
        }
    }

    /**
     * 开牌
     * @param cards 
     * @param del_time 延时开始播放动画 
     */
    openCards(cards: Array<number>, del_time: number, time_3: number, is_action: boolean = true) {

        this.sendCard(false);

        if (is_action) {
            if (this._is_win)
                this.showBlink();
            this._node_root.runAction(cc.sequence(cc.delayTime(is_action?del_time:0), cc.callFunc(() => {
                this._music_mgr.playfapai();
                this._node_card1.runAction(cc.sequence(cc.scaleTo(0.2, 0, 1.2), cc.callFunc(() => {
                    let sp_card = UNodeHelper.getComponent(this._node_card1, '', cc.Sprite);
                    sp_card.spriteFrame = this._sprite_frames.getFrames('poker_' + cards[0]);
                }, this), cc.scaleTo(0.1, 1, 1)));

                this._node_card2.runAction(cc.sequence(cc.delayTime(is_action?0.2:0), cc.scaleTo(0.2, 0, 1.2), cc.callFunc(() => {
                    this._music_mgr.playfapai();
                    let sp_card = UNodeHelper.getComponent(this._node_card2, '', cc.Sprite);
                    sp_card.spriteFrame = this._sprite_frames.getFrames('poker_' + cards[1]);
                }, this), cc.scaleTo(0.1, 1, 1)));

                this._node_card3.runAction(cc.sequence(cc.delayTime(is_action?time_3:0), cc.spawn(cc.moveBy(0.2, 0, -10), cc.scaleTo(0.2, 0, 1.2)), cc.callFunc(() => {
                    this._music_mgr.playfapai();
                    let sp_card = UNodeHelper.getComponent(this._node_card3, '', cc.Sprite);
                    sp_card.spriteFrame = this._sprite_frames.getFrames('poker_' + cards[2]);
                }, this), cc.scaleTo(0.2, 1.2), cc.delayTime(0), cc.spawn(cc.moveTo(0.2, this._card3_pos), cc.scaleTo(0.2, 1, 1)),
                    cc.callFunc(() => {
                        this.showType();
                    }, this)));
            })));
        } else {
            this._node_card1.stopAllActions();
            this._node_card2.stopAllActions();
            this._node_card3.stopAllActions();
            this._node_card1.scale = 1;
            this._node_card2.scale = 1;
            this._node_card3.scale = 1;
            let sp_card = UNodeHelper.getComponent(this._node_card1, '', cc.Sprite);
            sp_card.spriteFrame = this._sprite_frames.getFrames('poker_' + cards[0]);

            sp_card = UNodeHelper.getComponent(this._node_card2, '', cc.Sprite);
            sp_card.spriteFrame = this._sprite_frames.getFrames('poker_' + cards[1]);

            sp_card = UNodeHelper.getComponent(this._node_card3, '', cc.Sprite);
            sp_card.spriteFrame = this._sprite_frames.getFrames('poker_' + cards[2]);
        }
    }

    /**
     * 发牌
     * @param is_action 
     */
    sendCard(is_action: boolean = true) {

        if (is_action) {
            this._node_card1.x = 0;
            this._node_card2.x = 0;
            this._node_card3.x = 0;
            this._node_card1.scale = 0;
            this._node_card2.scale = 0;
            this._node_card3.scale = 0;
            this._node_card1.stopAllActions();
            this._node_card2.stopAllActions();
            this._node_card3.stopAllActions();
            this._node_card1.opacity = 0;
            this._node_card2.opacity = 0;
            this._node_card3.opacity = 0;

            let cccall1 = cc.callFunc(() => {
                this._music_mgr.playfapai();
            }, this);

            let cccall2 = cc.callFunc(() => {
                this._music_mgr.playfapai();
            }, this);

            let cccall3 = cc.callFunc(() => {
                this._music_mgr.playfapai();
            }, this);

            this._node_card1.runAction(cc.sequence(cc.delayTime(0.1), cccall1, cc.scaleTo(0.2, 1), cc.spawn(cc.fadeIn(0.1), cc.moveTo(0.2, this._card1_pos))));
            this._node_card2.runAction(cc.sequence(cc.delayTime(0.2), cccall2, cc.scaleTo(0.2, 1), cc.spawn(cc.fadeIn(0.1), cc.moveTo(0.2, this._card2_pos))));
            this._node_card3.runAction(cc.sequence(cc.delayTime(0.3), cccall3, cc.scaleTo(0.2, 1), cc.spawn(cc.fadeIn(0.1), cc.moveTo(0.2, this._card3_pos))));
        } else {
            this._node_card1.position = this._card1_pos;
            this._node_card2.position = this._card2_pos;
            this._node_card3.position = this._card3_pos;
            this._node_card1.scale = 1;
            this._node_card2.scale = 1;
            this._node_card3.scale = 1;
            this._node_card1.opacity = 255;
            this._node_card2.opacity = 255;
            this._node_card3.opacity = 255;
            this._node_card1.stopAllActions();
            this._node_card2.stopAllActions();
            this._node_card3.stopAllActions();

        }
    }


    showType() {

        this._music_mgr.playPaiXing(this._card_type);


        // if (this._card_type != 0) {
        if (this._card_type >= 0 && this._card_type <= 5) {
            this._spine_card_type.setAnimation(0, cfg_brhh.anima[this._card_type], false);
            this._node_card_type.active = true;
            this._node_card_type.opacity = 255;
            // this._node_light.active = true;
            // this._node_light.opacity = 255;
        } else {
            UDebug.Log('找不到牌型：' + this._card_type);
        }
        // }
    }

    showBlink() {
        // this._node_light.runAction( cc.sequence(cc.delayTime(0.5) , cc.callFunc(()=>{
        //     this._node_light.stopAllActions();
        //     this._node_light.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.3, 100), cc.fadeTo(0.2, 255))));
        // })));

        this._node_light.active = true;
        this._node_light.opacity = 0;
        let spine_light = UNodeHelper.getComponent(this._node_light, '', sp.Skeleton);
        this._node_light.runAction(cc.sequence(cc.delayTime(3.2), cc.callFunc(() => {
            this._node_light.opacity = 255;
            spine_light.setAnimation(0, 'animation', true);
        })))



    }

}
