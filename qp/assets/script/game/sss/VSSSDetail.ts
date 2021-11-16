import { SSSPX, SSSPXStr } from "./ssshelp/USSSData";

//结算明细
const { ccclass, property } = cc._decorator;
@ccclass


export default class VSSSDetail extends cc.Component {
    @property(cc.Label) score1: cc.Label = null;
    @property(cc.Label) score2: cc.Label = null;
    @property(cc.Label) score3: cc.Label = null;
    @property(cc.Label) specialType: cc.Label = null;
    @property(cc.Label) scoreBase: cc.Label = null;
    @property(cc.Label) scoreFire: cc.Label = null;
    @property(cc.Label) scoreSpeciel: cc.Label = null;
    @property(cc.Label) scoreAll: cc.Label = null;

    public data: any

    public show() {
        this.node.active = !this.node.active
        var itemscores: number[] = this.data.itemscores
        //头墩
        if (itemscores[0] >= 0) {
            this.score1.string = "+" + itemscores[0]
        }
        else {
            this.score1.string = itemscores[0] + ""
        }
        //中墩
        if (this.data.itemscores[1] >= 0) {
            this.score2.string = "+" + itemscores[1]
        }
        else {
            this.score2.string = itemscores[1] + ""
        }

        //尾墩
        if (this.data.itemscores[2] >= 0) {
            this.score3.string = "+" + itemscores[2] + ""
        }
        else {
            this.score3.string = itemscores[2] + ""
        }

        //基础分
        var scoreBase = itemscores[0] + itemscores[1] + itemscores[2]
        if (scoreBase >= 0) {
            this.scoreBase.string = "+" + scoreBase
        }
        else {
            this.scoreBase.string = scoreBase + ""
        }

        //打枪
        var itemscorePure: number[] = this.data.itemscorePure
        if (this.data.itemscorePure[3] > 0) {
            this.scoreFire.string = "+" + itemscorePure[3] + ""
        }
        else if (this.data.itemscorePure[3] == 0) {
            this.scoreFire.string = "-"
        }
        else {
            this.scoreFire.string = itemscorePure[3] + ""
        }

        //特殊牌型得分
        if (this.data.deltascore >= 0) {
            this.scoreSpeciel.string = "+" + this.data.deltascore
        }
        else {
            this.scoreSpeciel.string = this.data.deltascore + ""
        }

        //特殊牌型
        var specialTy = this.data.player.group.specialTy
        if (specialTy < SSSPX.STH) {
            this.specialType.string = '无'
            this.scoreSpeciel.string = '-'
        } else {
            this.specialType.string = SSSPXStr[specialTy]
            this.score1.string = "-"
            this.score2.string = "-"
            this.score3.string = "-"
            this.scoreBase.string = "-"
            this.scoreFire.string = "-"
        }

        //总分
        if (this.data.deltascore >= 0) {
            this.scoreAll.string = "+" + this.data.deltascore
        }
        else {
            this.scoreAll.string = this.data.deltascore + ""
        }

    }
}




