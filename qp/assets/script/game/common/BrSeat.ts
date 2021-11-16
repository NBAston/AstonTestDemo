import UNodeHelper from "../../common/utility/UNodeHelper";
import UResManager from "../../common/base/UResManager";
import { EIconType } from "../../common/base/UAllenum";
import UStringHelper from "../../common/utility/UStringHelper";


const GoldRate = 100;  //

export default class BrSeat {

    private _node_root: cc.Node = null;
    private _lab_gold: cc.Label = null;
    private _lab_name: cc.Label = null;
    private _sp_head: cc.Sprite = null;


    private _spine_win: sp.Skeleton = null;

    private _node_tip_score: cc.Node = null;

    private _userid: number = 0;

    private _x: number = 0;
    private _y: number = 0;

    private _tip_score_pos = cc.v2(0, -40);

    constructor(root: cc.Node) {

        this._node_root = root;
        // this._node_root.active = false;

        this.init();
    }


    get userid() {
        return this._userid;
    }

    get position() {
        return this._node_root.position;
    }

    updatePosition() {
        this._node_root.stopAllActions();
        this._node_root['isShakeing'] = false;

        let widget = this._node_root.getComponent(cc.Widget);
        if (widget) {
            widget.updateAlignment();
        }

        this._x = this._node_root.x;
        this._y = this._node_root.y;

        // if (this._node_tip_score)
        //     this._tip_score_pos = this._node_tip_score.position;


       


        // let bb = lab_win.node.getContentSize();
        // let cc1 = lab_win.node.position;
        // UDebug.Log(bb);
    }

    init() {

        this._lab_gold = UNodeHelper.getComponent(this._node_root, 'lab_gold', cc.Label);
        this._lab_name = UNodeHelper.getComponent(this._node_root, 'lab_name', cc.Label);
        this._sp_head = UNodeHelper.getComponent(this._node_root, 'sp_head', cc.Sprite);

        this._node_tip_score = UNodeHelper.find(this._node_root, 'node_tip_score');
        if (this._node_tip_score)
            // this._node_tip_score.active = false;

            this._spine_win = UNodeHelper.getComponent(this._node_root, 'spine_win', sp.Skeleton);

        if (this._spine_win) {
            this._spine_win.node.active = false;
            this._spine_win.premultipliedAlpha = false;
            this._spine_win.setCompleteListener(() => {

                this._spine_win.node.active = false;
            })
        }

        this.updatePosition();
    }



    loadHead(head_id: number) {


        UResManager.load(head_id, EIconType.Head, this._sp_head);

    }


    setName(name: string) {

        this._lab_name.string = name;
    }

    setGold(gold: number) {

        let str = UStringHelper.getMoneyFormat(gold / GoldRate);
        this._lab_gold.string = str;
    }


    setUserId(userid: number) {
        this._userid = userid;
    }

    setInfo(data: any) {
        this._node_root.active = true;
        this.setName(data.nickName);
        this.setGold(data.lUserScore);
        this.loadHead(data.headerID);
        this.setUserId(data.dwUserID);
    }

    shake(coust: number, isLand: boolean = false, speed: number = 1) {

        const const_x = this._x;
        const const_y = this._y;

        var marginx = 20;
        var marginy = 20;

        if (isLand) {
            marginy = 0;
        } else {
            marginx = 0;
        }

        if (this._node_root['isShakeing']) { return; }
        this._node_root.stopAllActions();
        this._node_root['isShakeing'] = true;

        this._node_root.scale = 1;

        var cccall = cc.callFunc((node) => {
            node['isShakeing'] = false;
        }, this)

        this._node_root.runAction(cc.speed(cc.sequence(
            cc.repeat(cc.sequence(cc.moveTo(0.05, const_x + marginx, const_y + marginy),
                cc.moveTo(0.05, const_x - marginx, const_y - marginy),
                cc.moveTo(0.05, const_x, const_y)), coust), cccall), speed));

    }

    hide() {

        this._node_root.active = false;
    }

    show() {

        this._node_root.active = true;
    }


    adjstPiaoWidth () {
        let size = cc.view.getFrameSize();
        if (this._node_tip_score) {
            let lab_score = UNodeHelper.getComponent(this._node_tip_score, 'lab_win', cc.Label);
            let sp_score = UNodeHelper.find(this._node_tip_score, 'sp_win');
            if (!lab_score.node.active) {
                lab_score = UNodeHelper.getComponent(this._node_tip_score, 'lab_lose', cc.Label);
                sp_score = UNodeHelper.find(this._node_tip_score, 'sp_lose');
            }

            sp_score.width = lab_score.node.width + 100;  
            this._node_tip_score.x = 0;

            if (lab_score.node.getContentSize().width > 100) {
                let cons_w = 1280;
                let node_x = this._node_root.x;
                let offset_w = size.width > cons_w ? size.width - cons_w : 0;
                let lab_width = lab_score.node.getContentSize().width / 2;
                let offset_x = node_x + lab_width;

                offset_w /= 2;
                // 右边
                if (offset_x > offset_w + 640) {
                    offset_x -= 640;
                    offset_x -= offset_w;
                    this._node_tip_score.x = -offset_x;
                }

                // 左边
                offset_x = node_x - lab_width;
                if (offset_x < -640 - offset_w) {
                    offset_x = -offset_x - 640 - offset_w;
                    this._node_tip_score.x = offset_x;
                }
            }
        }
    }


    playWinOrLoseScore(score: number, del_time: number) {

        if (!this._node_tip_score) return;

        let str_score = (score / GoldRate).toString();
        let sp_win = UNodeHelper.find(this._node_tip_score, 'sp_win');
        let sp_lose = UNodeHelper.find(this._node_tip_score, 'sp_lose');
        let lab_win = UNodeHelper.getComponent(this._node_tip_score, 'lab_win', cc.Label);
        let lab_lose = UNodeHelper.getComponent(this._node_tip_score, 'lab_lose', cc.Label);

        if (score > 0) {
            sp_win.active = true;
            lab_win.node.active = true;
            sp_lose.active = false;
            lab_lose.node.active = false;

            str_score = '+' + str_score;
            lab_win.string = str_score;
        }
        else if (score < 0) {
            sp_win.active = false;
            lab_win.node.active = false;
            sp_lose.active = true;
            lab_lose.node.active = true;
            lab_lose.string = str_score;

        } else {
            sp_win.active = false;
            lab_win.node.active = false;
            sp_lose.active = false;
            lab_lose.node.active = false;
        }

        this._node_tip_score.active = true;
        this._node_tip_score.setPosition(this._tip_score_pos);
        this._node_tip_score.opacity = 0;
        this._node_tip_score.stopAllActions();

        this.adjstPiaoWidth();

        this._node_tip_score.runAction(cc.sequence(cc.delayTime(del_time), cc.fadeIn(0.1),
            cc.callFunc(() => {
                if (score > 0)
                    this.showWinSpine();
            }),
            cc.moveBy(0.5, 0, 80), cc.delayTime(2.0), cc.fadeOut(0.1)));
    }


    clear() {
        if (this._node_tip_score) {
            this._node_tip_score.stopAllActions();
            this._node_tip_score.active = false;
        }

        if (this._spine_win)
            this._spine_win.node.active = false;
    }


    showWinSpine() {
        if (this._spine_win) {
            this._spine_win.node.active = true;
            this._spine_win.setAnimation(0, 'animation', false);
        }
    }

}
