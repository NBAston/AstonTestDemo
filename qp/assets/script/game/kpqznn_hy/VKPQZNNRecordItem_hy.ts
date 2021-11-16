import { EIconType } from "../../common/base/UAllenum";
import UResManager from "../../common/base/UResManager";
import UStringHelper from "../../common/utility/UStringHelper";
import AppGame from "../../public/base/AppGame";
import MKPQZNNModel_hy from "./model/MKPQZNNModel_hy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VKPQZNNRecordItem_hy extends cc.Component {

    @property(cc.Label) lastLbl: cc.Label = null;    //上一局

    @property(cc.Label) totalLbl: cc.Label = null;   //总成绩

    @property(cc.Label) userIdLbl: cc.Label = null;   //id

    @property(cc.Node) logo: cc.Node = null;

    @property(cc.Node) selfBg: cc.Node = null;

    @property(cc.Node) otherBg: cc.Node = null;

    @property(cc.Sprite) head: cc.Sprite = null;

    @property(cc.Sprite) headFrame: cc.Sprite = null;


    setItemData(data: any, isWinner: boolean) {
        let lastWinScore = data.lastWinScore / 100;
        let winScore = data.winScore / 100;
        this.lastLbl.string = lastWinScore.toString();
        this.totalLbl.string = winScore.toString();
        this.userIdLbl.string = AppGame.ins.roleModel.useId == data.userId ? '我' : data.nickName;

        if (data.lastWinScore < 0) {
            this.lastLbl.node.color = new cc.Color().fromHEX("#32a07c");
        } else {
            this.lastLbl.node.color = new cc.Color().fromHEX("#ef5228");
            (data.lastWinScore != 0) && (this.lastLbl.string = '+' + lastWinScore);
        }

        if (!data.bPlayingLast) {
            this.lastLbl.node.color = new cc.Color().fromHEX("#a18c71");
            this.lastLbl.string = '未参与';
        }

        if (data.winScore < 0) {
            this.totalLbl.node.color = new cc.Color().fromHEX("#32a07c");
        } else {
            this.totalLbl.node.color = new cc.Color().fromHEX("#ef5228");
            (data.winScore != 0) && (this.totalLbl.string = '+' + winScore);
        }

        let headImgUrl = '';
        if (data.userId == AppGame.ins.roleModel.useId) {
            this.selfBg.opacity = 255;
            this.otherBg.opacity = 0;
            headImgUrl = AppGame.ins.roleModel.headImgUrl;
        } else {
            this.selfBg.opacity = 0;
            this.otherBg.opacity = 255;
        }

        this.logo.opacity = isWinner ? 255 : 0;

        if (MKPQZNNModel_hy.ins.gBattlePlayer[data.userId]) {
            UResManager.load(MKPQZNNModel_hy.ins.gBattlePlayer[data.userId].headId, EIconType.Head, this.head, headImgUrl);
            UResManager.load(MKPQZNNModel_hy.ins.gBattlePlayer[data.userId].headboxId, EIconType.Frame, this.headFrame);
        }
    }

}
