import UNodeHelper from "../../common/utility/UNodeHelper";
import UResManager from "../../common/base/UResManager";
import { EIconType, ERoomKind } from "../../common/base/UAllenum";
import UStringHelper from "../../common/utility/UStringHelper";
import { LongHu } from "../../common/cmd/proto";
import UDebug from "../../common/utility/UDebug";
import AppGame from "../../public/base/AppGame";


const GoldRate = 100;  //

export default class BrlhSeat {

    private _node_root: cc.Node = null;
    public _lab_gold: cc.Label = null;
    private _lab_name: cc.Label = null;
    private _sp_head: cc.Sprite = null;
    private _lab_vip: cc.Label = null;
    private _sp_headbox: cc.Sprite = null;
    private _vip_bg: cc.Node = null;


    private _spine_win: sp.Skeleton = null;

    private _node_tip_score: cc.Node = null;

    private _userid: number = 0;

    private _x: number = 0;
    private _y: number = 0;

    private _name_x: number = 0;
    private _name_y: number = 0;

    private _gold_x: number = 0;
    private _gold_y: number = 0;

    private _vip_x: number = 0;
    private _vip_y: number = 0;

    private _tip_score_pos = cc.v2(0, -40);
    private _tip_score_pos_me = cc.v2(0, -40);

    constructor(root: cc.Node, lab_name: cc.Label, lab_gold: cc.Label, lab_vip: cc.Label) {

        this._node_root = root;
        // this._node_root.active = false;

        this._lab_gold = lab_gold;
        this._lab_name = lab_name;
        this._lab_vip = lab_vip;

        this.init();
    }


    get userid() {
        return this._userid;
    }

    get position() {
        return this._node_root.position;
    }

    getPosition() {
        return this._node_root.getPosition();
    }

    updatePosition() {
        this._node_root.stopAllActions();
        this._node_root['isShakeing'] = false;

        let widget = this._node_root.getComponent(cc.Widget);
        if (widget) {
            widget.updateAlignment();
        }
        let name_widget = this._lab_name.node.getComponent(cc.Widget);
        let gold_widget = this._lab_gold.node.getComponent(cc.Widget);
        let vip_widget = this._lab_vip.node.getComponent(cc.Widget);
        if (name_widget) {
            name_widget.updateAlignment();
        }
        if (gold_widget) {
            gold_widget.updateAlignment();
        }
        if (vip_widget) {
            vip_widget.updateAlignment();
        }

        this._x = this._node_root.x;
        this._y = this._node_root.y;

        this._name_x = this._lab_name.node.x;
        this._name_y = this._lab_name.node.y;

        this._gold_x = this._lab_gold.node.x;
        this._gold_y = this._lab_gold.node.y;

        this._vip_x = this._lab_vip.node.x;
        this._vip_y = this._lab_vip.node.y;
        // if (this._node_tip_score)
        //     this._tip_score_pos = this._node_tip_score.position;





        // let bb = lab_win.node.getContentSize();
        // let cc1 = lab_win.node.position;
        // UDebug.Log(bb);
    }

    init() {

        // this._lab_gold = UNodeHelper.getComponent(this._node_root, 'lab_gold', cc.Label);
        // this._lab_name = UNodeHelper.getComponent(this._node_root, 'lab_name', cc.Label);
        this._sp_head = UNodeHelper.getComponent(this._node_root, 'sp_head', cc.Sprite);
        this._sp_headbox = UNodeHelper.getComponent(this._node_root, 'sp_headbox', cc.Sprite);
        this._node_tip_score = UNodeHelper.find(this._node_root, 'node_tip_score');
        this._vip_bg = UNodeHelper.find(this._node_root, "vip_03");
        if (this._node_tip_score)
            // this._node_tip_score.active = false;

            // this._spine_win = UNodeHelper.getComponent(this._node_root, 'spine_win', sp.Skeleton);

            if (this._spine_win) {
                this._spine_win.node.active = false;
                this._spine_win.premultipliedAlpha = false;
                this._spine_win.setCompleteListener(() => {

                    this._spine_win.node.active = false;
                })
            }

        this.updatePosition();
    }



    loadHead(head_id: number, headImgUrl: string = ``) {
        UResManager.load(head_id, EIconType.Head, this._sp_head, headImgUrl);
    }

    loadHeadBox(headbox_id: number) {

        UResManager.load(headbox_id, EIconType.Frame, this._sp_headbox);
    }
    setVip(vip: number): void {
        // if (vip == 0) {
        //     this._lab_vip.node.active = false;
        //     this._vip_bg.active = false;
        // } else {
        //     this._lab_vip.node.active = true;
        //     this._vip_bg.active = true;
        //     this._lab_vip.string = vip.toString();
        // }
        this._lab_vip.node.active = true;
        this._vip_bg.active = true;
        this._lab_vip.string = vip.toString();

    }


    setName(name: string) {

        this._lab_name.string = name;
    }

    setGold(gold: number) {

        let str = UStringHelper.formatPlayerCoin(gold / GoldRate);
        this._lab_gold.string = str;
    }


    setUserId(userid: number) {
        this._userid = userid;
    }

    setInfo(data: any) {
        // setInfo(data: LongHu.PlayerListItem) {
        this._node_root.active = true;
        // if(AppGame.ins.currRoomKind == ERoomKind.Normal) {
        //     this.setName(data.user.userId);
        // } else {
        this.setName(AppGame.ins.currRoomKind == ERoomKind.Normal?data.user.userId:data.user.nickName);
        // }
        // this.setName(data.user.userId || data.user.nickName);
        this.setGold(data.user.score);
        this.loadHead(data.user.headerId, data.user.headImgUrl);
        this.loadHeadBox(data.user.headboxId || 0);
        this.setVip(data.user.vip);
        this.setUserId(data.user.userId);
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

        if (this._node_root["oldScale"] == null) {
            this._node_root["oldScale"] = this._node_root.scale;
        } else {
            this._node_root.scale = this._node_root["oldScale"];
        }

        var cccall = cc.callFunc((node) => {
            node['isShakeing'] = false;
        }, this)

        this._node_root.x = this._x;
        this._node_root.y = this._y;

        this._lab_gold.node.x = this._gold_x;
        this._lab_gold.node.y = this._gold_y;
        this._lab_name.node.x = this._name_x;
        this._lab_name.node.y = this._name_y;

        this._lab_vip.node.x = this._vip_x;
        this._lab_vip.node.y = this._vip_y;


        this._node_root.runAction(cc.speed(cc.sequence(
            cc.repeat(cc.sequence(cc.moveBy(0.05, marginx, marginy),
                cc.moveBy(0.05, - marginx, - marginy)),
                coust), cccall), speed));

        this._lab_gold.node.runAction(cc.speed(cc.sequence(
            cc.repeat(cc.sequence(cc.moveBy(0.05, marginx, marginy),
                cc.moveBy(0.05, - marginx, - marginy)),
                coust), cccall), speed));

        this._lab_name.node.runAction(cc.speed(cc.sequence(
            cc.repeat(cc.sequence(cc.moveBy(0.05, marginx, marginy),
                cc.moveBy(0.05, - marginx, - marginy)),
                coust), cccall), speed));

        this._lab_vip.node.runAction(cc.speed(cc.sequence(
            cc.repeat(cc.sequence(cc.moveBy(0.05, marginx, marginy),
                cc.moveBy(0.05, - marginx, - marginy)),
                coust), cccall), speed));

    }

    hide() {
        this._lab_gold.node.active = false;
        this._lab_name.node.active = false;
        this._lab_vip.node.active = false;
        this._node_root.active = false;
        // this._vip_bg.active = false;
    }

    show() {

        this._node_root.active = true;
        this._lab_gold.node.active = true;
        // this._lab_vip.node.active = true;
        this._lab_name.node.active = true;
        // this._vip_bg.active = true;
    }


    adjstPiaoWidth(isMe: boolean = false) {
        let size = cc.view.getFrameSize();
        if (this._node_tip_score) {
            let lab_score = UNodeHelper.getComponent(this._node_tip_score, 'lab_win', cc.Label);
            let sp_score = UNodeHelper.find(this._node_tip_score, 'sp_win');
            if (!lab_score.node.active) {
                lab_score = UNodeHelper.getComponent(this._node_tip_score, 'lab_lose', cc.Label);
                sp_score = UNodeHelper.find(this._node_tip_score, 'sp_lose');
            }

            sp_score.width = lab_score.node.width + 100;
            this._node_tip_score.x = 0 + (isMe ? 10 : 0);

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
                    this._node_tip_score.x = -offset_x + (isMe ? 10 : 0);
                }

                // 左边
                offset_x = node_x - lab_width;
                if (offset_x < -640 - offset_w) {
                    offset_x = -offset_x - 640 - offset_w;
                    this._node_tip_score.x = offset_x + (isMe ? 10 : 0);
                }
            }
        }
    }


    playWinOrLoseScore(score: number, del_time: number, isMe: boolean = false, rect: number = 2, moveTime: number = 0.5) {

        if (!this._node_tip_score) return;

        let str_score = UStringHelper.getMoneyFormat(score / 100);
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
        else {
            sp_win.active = false;
            lab_win.node.active = false;
            sp_lose.active = true;
            lab_lose.node.active = true;
            lab_lose.string = str_score;
        }

        this._node_tip_score.active = true;

        if (!isMe) {
            this._node_tip_score.setPosition(this._tip_score_pos);
        } else {
            this._node_tip_score.setPosition(this._tip_score_pos_me);
        }

        // this._node_tip_score.position = this._tip_score_pos;
        this._node_tip_score.opacity = 0;
        this._node_tip_score.stopAllActions();

        // if(!isMe) {
        this.adjstPiaoWidth(isMe);
        // }

        this._node_tip_score.runAction(cc.sequence(cc.delayTime(del_time), cc.fadeIn(0.1),
            cc.callFunc(() => {
                if (score > 0)
                    this.showWinSpine();
            }),
            cc.moveBy(moveTime, 0, (rect == 0 || rect == 1) ? 62 : 50), cc.delayTime(2.0), cc.fadeOut(0.1)));
    }

    playWinOrLoseScore2(score: number, del_time: number, isMe: boolean = false) {

        if (!this._node_tip_score) return;

        let str_score = UStringHelper.getMoneyFormat(score / 100);
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
        else {
            sp_win.active = false;
            lab_win.node.active = false;
            sp_lose.active = true;
            lab_lose.node.active = true;
            lab_lose.string = str_score;
        }

        this._node_tip_score.active = true;

        if (!isMe) {
            this._node_tip_score.setPosition(this._tip_score_pos);
        } else {
            this._node_tip_score.setPosition(this._tip_score_pos_me);
        }

        // this._node_tip_score.position = this._tip_score_pos;
        this._node_tip_score.opacity = 0;
        this._node_tip_score.stopAllActions();
        this.adjstPiaoWidth(isMe);

        this._node_tip_score.runAction(cc.sequence(cc.delayTime(del_time), cc.fadeIn(0.1),
            cc.callFunc(() => {
                if (score > 0){
                    this.showWinSpine();
                }
            }),
            cc.moveBy(0.7, 0, 50), cc.delayTime(2.0), cc.fadeOut(0.1)));
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
