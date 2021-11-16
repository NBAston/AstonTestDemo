import { EIconType } from "../../common/base/UAllenum";
import UResManager from "../../common/base/UResManager";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UStringHelper from "../../common/utility/UStringHelper";
import AppGame from "../../public/base/AppGame";


const GoldRate = 100;  //
const {ccclass, property} = cc._decorator;

@ccclass
export default class BcbmBottomManager extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    private _playerHead : cc.Sprite ;
    private _playerScore : cc.Label ;
    private _playerName : cc.Label ;
    private _userid : number;
    private _playerHeadbox : cc.Sprite;
    private _playerSpineWin: sp.Skeleton = null;
    private _playerTipScore: cc.Node
    private _playerVip : cc.Label;

    private _selectBetIndex :number = 0;
    private _selectBetContainer : cc.Node ;


    onLoad () {
        // this._selectBetIndex = 0;
        // this._playerHead = UNodeHelper.getComponent(this.node, "sp_seat/sp_head", cc.Sprite);
        // this._playerScore = UNodeHelper.getComponent(this.node, "lb_score", cc.Label);
        // this._playerName = UNodeHelper.getComponent(this.node, "lb_name", cc.Label);
        // this._playerHeadbox = UNodeHelper.getComponent(this.node, "sp_seat/sp_headbox", cc.Sprite);
        // this._playerVip = UNodeHelper.getComponent(this.node, "lb_vip", cc.Label);
        // this._playerTipScore = UNodeHelper.find(this.node, 'sp_seat/node_tip_score' );
        // this._selectBetContainer = UNodeHelper.find(this.node, "toggle_container");
        // if (this._playerTipScore)
        //     this._playerSpineWin = UNodeHelper.getComponent(this.node, 'sp_seat/spine_win', sp.Skeleton);

        // if (this._playerSpineWin) {
        //     this._playerSpineWin.node.active = false;
        //     this._playerSpineWin.premultipliedAlpha = false;
        //     this._playerSpineWin.setCompleteListener(() => {
        //         this._playerSpineWin.node.active = false;
        //     })
        // }
        
        // this.setPlayerInfo();
        // this.updatePosition();
    }

    setPlayerInfo() {
        let data = AppGame.ins.roleModel;
        this.setName(data.nickName);
        this.loadHead(data.headId);
        this.setScore(data.score);
        this.loadHeadBox(data.headboxId);
        this.setVip(data.vipLevel);
    }

    loadHead(head_id: number) {
        let data = AppGame.ins.roleModel;
        let headImgUrl = data.headImgUrl;
        UResManager.load(head_id, EIconType.Head, this._playerHead, headImgUrl);
    }

    setName(name: string) {
        this._playerName.string = name;
    }

    setScore(gold: number) {

        let str = UStringHelper.getMoneyFormat(gold / GoldRate);
        this._playerScore.string = str;
    }

    setUserId(userid: number) {
        this._userid = userid;
    }

    setVip(vip: number): void {
        this._playerVip.string = vip.toString();
    }

    loadHeadBox(headbox_id: number) {
        UResManager.load(headbox_id, EIconType.Frame, this._playerHeadbox);
    }

    updatePosition() {
        let seatRoot = UNodeHelper.find(this.node, "sp_seat");
        seatRoot.stopAllActions();
        seatRoot['isShakeing'] = false;

        let widget = this.node.getComponent(cc.Widget);
        if (widget) {
            widget.updateAlignment();
        }
    }

    start () {

    }

    // update (dt) {}
}
