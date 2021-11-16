import UNodeHelper from "../../../common/utility/UNodeHelper";
import cfg_brnn_type from "../cfg_brjh_type";
import UBrjhMusic from "../UBrjhMusic";
import USpriteFrames from "../../../common/base/USpriteFrames";

/**
 * 创建 ： 朱武
 * 百人牛牛牌组
 */
const spine_name = {
    [0]: "danzhang",
    [1]: "duizi",
    [2]:"shunzi",
    [3]:"jinhua",
    [4]:"shunjin",
    [5]:"baozi",
    [6]:"sanpai",
}

const { ccclass, property } = cc._decorator;
const GoldRate = 100;
export default class VBrjhCardGrop {

    private _node_root: cc.Node = null;
    private _sp_cards: cc.Sprite[] = [];
    private _spf_cards: USpriteFrames = null;
    private _spine_px: sp.Skeleton = null;
    private _node_no_bet: cc.Node = null;
    private _music_mgr: UBrjhMusic = null;
    private _node_tip_score: cc.Node = null;
    private _spf_end_score: cc.SpriteFrame[] = [];
    private _self_win_score: number = 0;
    private _is_banker = false;

    constructor(root: cc.Node,  music_mgr: UBrjhMusic) {
        this._node_root = root;
        this._spf_cards = UNodeHelper.getComponent(this._node_root , '', USpriteFrames);
        this._music_mgr = music_mgr;
        this.init();
    }

    init() {
        for (let i = 1; i <= 3; i++) {
            this._sp_cards[i - 1] = UNodeHelper.getComponent(this._node_root, 'sp_' + i, cc.Sprite);
            this._sp_cards[i - 1].node['const_x'] = this._sp_cards[i - 1].node.x;
            this._sp_cards[i - 1].node['const_y'] = this._sp_cards[i - 1].node.y;
        }

        this._spine_px = UNodeHelper.getComponent(this._node_root, 'spine_px', sp.Skeleton);
        this._node_no_bet = UNodeHelper.find(this._node_root, 'sp_no_bet');
        this._node_tip_score = UNodeHelper.find(this._node_root , 'node_tip_score');
    }

    clear() {
        this._node_root.stopAllActions();
        for (let i = 0; i < 3; i++) {
            this._sp_cards[i].spriteFrame = this._spf_cards.getFrames('poker_b1');
            this._sp_cards[i].node.active = false;
            this._sp_cards[i].node.scale = 1;
        }
        this._node_no_bet.active = false;
        this._node_tip_score.active = false;
        this._spine_px.node.active = false;
    }

    set isbanker(is: boolean) {
        this._is_banker = is;
    }

    set winscore(score: number) {
        this._self_win_score = score / GoldRate;
    }

    showWinScore() {
        if (this._is_banker) {
            this._node_no_bet.active = false;
            this._node_tip_score.active = false;
            return;
        }

        let score = this._self_win_score;
        if (score == 0) {  // 输赢分数为 0 表示未下注
            this._node_no_bet.active = true;
            this._node_tip_score.active = false;
            return;
        }
        this._node_no_bet.active = false;
        this._node_tip_score.active = true;
        let str_score = score.toString();
        let lab_win = UNodeHelper.getComponent(this._node_tip_score, 'lab_win', cc.Label);
        let lab_lose = UNodeHelper.getComponent(this._node_tip_score, 'lab_lose', cc.Label);

        if (score > 0) {
            lab_win.node.active = true;
            lab_lose.node.active = false;
            str_score = '+' + str_score;
            lab_win.string = str_score;
        }
        else {
            lab_win.node.active = false;
            lab_lose.node.active = true;
            lab_lose.string = str_score;
        }
    }

    showType(type: number, is_win: boolean = true) {
        this._spine_px.node.active = true;
        let anima_str = cfg_brnn_type[type];
        if (is_win) {
            anima_str += 'win';
        }
        else {
            anima_str += 'lose';
        }

        anima_str = spine_name[type];  // 暂时使用
        this._spine_px.setAnimation(0, anima_str, false);
        this._music_mgr.playPaiXing(anima_str.toString());
    }

    /**
     * 显示牌值
     * @param cards 
     * @param active 是否播放动画
     */
    openCards(cards: any, is_win: boolean = true, active: boolean = false, del_time: number = 0) {
        let cards_value = cards.cardData;
        let card_type = cards.cardType;
        let is_show = false;
        if (active) {
            this._node_root.stopAllActions();
            this._node_root.runAction(cc.sequence(cc.delayTime(del_time), cc.callFunc(() => {
                for (let i = 0; i < 3; i++) {
                    this._sp_cards[i].node.stopAllActions();
                    this._sp_cards[i].node.runAction(cc.sequence(cc.moveTo(0.3, 0, 0), cc.scaleTo(0.1, 0.01, 1.2), cc.callFunc((node) => {
                        this._sp_cards[i].spriteFrame = this._spf_cards.getFrames('poker_' + cards_value[i]);
                    }), cc.scaleTo(0.1, 1, 1), cc.moveTo(0.1, this._sp_cards[i].node['const_x'], 0), cc.callFunc(() => {
                        if (!is_show) {
                            this._music_mgr.playTurnCard();
                            this.showType(card_type, is_win);
                            this.showWinScore();
                        }
                        is_show = true;
                    })));
                }
            }, this)));
        } else {
            this._node_root.stopAllActions();
            for (let i = 0; i < 3; i++) {
                this._sp_cards[i].node.stopAllActions();
                this._sp_cards[i].spriteFrame = this._spf_cards.getFrames('poker_' + cards_value[i]);
                this._sp_cards[i].node.active = true;
                this._sp_cards[i].node.x = this._sp_cards[i].node['const_x'];
            }
            this.showType(card_type, is_win);
            this.showWinScore();
        }
    }

    cardPos(index: number) {
        var v1 = cc.v2(this._sp_cards[index - 1].node['const_x'], this._sp_cards[index - 1].node['const_y']);
        v1 = this._node_root.convertToWorldSpaceAR(v1);
        v1 = this._node_root.parent.convertToNodeSpaceAR(v1);
        return v1;
    }

    sendCard() {
        this._sp_cards.forEach(element => {
            element.node.x = element.node['const_x'];
            element.node.y = element.node['const_y'];
            element.node.scale = 1.0;
            element.node.stopAllActions();
            element.node.active = true;
            element.spriteFrame = this._spf_cards.getFrames('poker_b1');
        });
    }
}
