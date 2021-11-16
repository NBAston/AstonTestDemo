import MKPQZNNModel from "./model/MKPQZNNModel";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UKPQZNNHelper from "./UKPQZNNHelper";
import UDebug from "../../common/utility/UDebug";
import UStringHelper from "../../common/utility/UStringHelper";

const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:结算界面
 */
@ccclass
export default class VKPQZNNResultNode extends cc.Component {
    /**
     * 4个座位的 输赢分显示节点
     * @param win 正数label
     * @param lose 负数label
     * @param score 输赢分
     */
    private _list = {
        "0": {
            win: null,
            lose: null,
            score: 0,
            loselabel: null,
            label: null
        },
        "1": {
            win: null,
            lose: null,
            score: 0,
            loselabel: null,
            label: null
        },
        "2": {
            win: null,
            lose: null,
            score: 0,
            loselabel: null,
            label: null
        },
        "3": {
            win: null,
            lose: null,
            score: 0,
            loselabel: null,
            label: null
        }
    };

    private _maxplayer: number = 4;
    private _isShowScore: boolean[] = [false, false, false, false];//false;
    private _posScores: number[] = [0, 0, 0, 0];
    /**结算后分数 */
    private _totalscore = [null, null, null, null];

    private _targetPos: Array<cc.Vec2> = new Array<cc.Vec2>();
    private _oriPos: Array<cc.Vec2> = new Array<cc.Vec2>();
    private _offestY = 20;

    private _node: cc.Node = null;

    start() {
        this._maxplayer = MKPQZNNModel.ins.maxPlayer;

        this.init();

        // 测试分数滚动
        // this.testAni();

        this.addEvent();
    }

    // init1() {
    //     for (let i = 0; i < this._maxplayer; i++) {
    //         let path = ("pos" + i.toString());
    //         var pos = UNodeHelper.find(this.node, path);
    //         let win = UNodeHelper.getComponent(pos, "qznn_fnt_win", cc.Label);
    //         let lose = UNodeHelper.getComponent(pos, "qznn_fnt_lose", cc.Label);
    //         this._list[i.toString()].win = win;
    //         this._list[i.toString()].lose = lose;
    //         this._list[i.toString()].node = pos;
    //         this.setPosNodeActive(i, false);
    //     }
    // }

    init() {
        this._node = UNodeHelper.find(this.node, "pos");
        for (let i = 0; i < this._maxplayer; i++) {

            let losePath = "game_lose" + i.toString();
            let winPath = "game_win" + i.toString();

            let win = UNodeHelper.getComponent(this._node, winPath, cc.Sprite);
            let lose = UNodeHelper.getComponent(this._node, losePath, cc.Sprite);

            let labelPath = "qznn_score" + i.toString();
            let label = UNodeHelper.getComponent(this._node, labelPath, cc.Label);

            let loselabelPath = "qznn_score_lose" + i.toString();
            let loselabel = UNodeHelper.getComponent(this._node, loselabelPath, cc.Label);

            this._list[i.toString()].win = win;
            this._list[i.toString()].lose = lose;
            this._list[i.toString()].label = label;
            this._list[i.toString()].loselabel = loselabel;

            this._targetPos.push(cc.v2(lose.node.getPosition().x, lose.node.getPosition().y + 17));
            let tmp_pos = new cc.Vec2(lose.node.getPosition().x, lose.node.getPosition().y - 10);
            this._oriPos.push(tmp_pos);
        }
        this.setPosNodeActive(false);
    }

    private addEvent() {
        MKPQZNNModel.ins.on(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_END, this.onGameEnd, this);
        MKPQZNNModel.ins.on(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, this.onGameStart, this);

        MKPQZNNModel.ins.on(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE, this.onResetScene, this);
        MKPQZNNModel.ins.on(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_END, this.onGameSceneEnd, this);
    }

    private removeEvent() {
        MKPQZNNModel.ins.off(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_END, this.onGameEnd, this);
        MKPQZNNModel.ins.off(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, this.onGameStart, this);

        MKPQZNNModel.ins.off(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE, this.onResetScene, this);
        MKPQZNNModel.ins.off(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_END, this.onGameSceneEnd, this);

    }

    onDestroy() {
        this.removeEvent();
    }

    onGameSceneEnd(data: any) {
        if (data.gameEnd) {
            this.onGameEnd(data.gameEnd, true);
        }
    }

    /**
     * 重置场景
     */
    private onResetScene(data?: any) {
        this.node.stopAllActions();

        this.setPosNodeActive(false);
    }

    /**
     * 游戏开始 隐藏 滚动分数动画
     * @param data 
     */
    private onGameStart(data: any) {

        this.setPosNodeActive(false);
    }
    /**结束的分数 */
    private showEndScore(data: any) {
        this._totalscore = [0, 0, 0, 0];
        var dLWScore = data.LWScore;//number[] | null
        var dTotalScore = data.totalScore;//number[] | null
        var cbEndType = data.endType;//number
        var cbOperate = data.operate;//number[] | null 不知道这个字段用途

        if (dTotalScore != null) {
            for (let i = 0; i < dTotalScore.length; i++) {
                const element = dTotalScore[i];
                let index = MKPQZNNModel.ins.getUISeatId(i);
                this._totalscore[index] = element;
            }
        }

        var players = MKPQZNNModel.ins.gBattlePlayer;

        // cc.log("players:"+JSON.stringify(players));

        if (players != null) {
            for (const key in players) {
                if (players.hasOwnProperty(key)) {
                    const element = players[key];
                    var uipos = MKPQZNNModel.ins.getUISeatId(element.chairId)

                    // this.setPlayerActiveByIndex(uipos,true);

                    // UDebug.Log("gBattlePlayer" + JSON.stringify(element));

                    if (element.playStatus == 1 && dLWScore != null && dLWScore[element.chairId] != null)//上座玩家
                    {
                        this.scoreAdd(uipos, dLWScore[element.chairId]);
                    }
                    else {
                        if (uipos >= 0 && uipos < 4) {//要加上，不然会报错
                            this.setPosIndexActive(uipos, false);
                        }
                    }

                }
            }
        }
    }

    /**
     * 游戏结算
     * @param data 
     */
    private onGameEnd(data: any, isEndScene: boolean = false) {
        UDebug.Log("gameend:" + JSON.stringify(data));
        var self = this;
        var cbEndType = data.endType;//number

        // this.unscheduleAllCallbacks();
        // cc.director.getScheduler().unscheduleAllForTarget(this);

        var delayTime = 1.6;

        this.node.stopAllActions();

        // if (cbEndType > 0) {
        //     this.scheduleOnce(() => {
        //         self.showEndScore(data);
        //     }, 0.8);
        // }
        // else {
        //     this.scheduleOnce(() => {
        //         self.showEndScore(data);
        //     }, 1.6);
        // }

        if (cbEndType > 0) {
            delayTime = 1.6;
        }
        if (isEndScene) {
            delayTime = 0.5;
        }
        let act = cc.sequence(cc.delayTime(delayTime), cc.callFunc(() => {
            self.showEndScore(data);
        }));

        this.node.runAction(act);


        // if (dLWScore != null) {
        //     for (let i = 0; i < dLWScore.length; i++) {
        //         const element = dLWScore[i];
        //         let index = MKPQZNNModel.ins.getUISeatId(i);

        //         this.scoreAdd(index, element);
        //     }
        // }
    }

    /**
     * pos 节点显示
     * @param index 索引
     * @param b 是否显示
     */
    setPosNodeActive(b: boolean) {
        if (!b) {
            for (let i = 0; i < this._maxplayer; i++) {
                // this._list[i].label.node.stopAllActions();
                // this._list[i].win.node.stopAllActions();
                // this._list[i].lose.node.stopAllActions();
                // this._list[i].loselabel.node.stopAllActions();  

                this.setPosIndexActive(i, false);

            }
        }
        this._node.active = b;
    }

    setPosIndexActive(index: number, b: boolean) {

        if (index && this._list && this._list[index.toString()]) {

            if (!b) {
                this._list[index.toString()].win.node.stopAllActions();
                this._list[index.toString()].lose.node.stopAllActions();
                this._list[index.toString()].label.node.stopAllActions();
                this._list[index.toString()].loselabel.node.stopAllActions();
            }

            this._list[index.toString()].win.node.active = b;
            this._list[index.toString()].lose.node.active = b;
            this._list[index.toString()].label.node.active = b;
            this._list[index.toString()].loselabel.node.active = b;

        }

    }

    /**
     * 分数显示
     * @param playerIndex 玩家索引
     * @param score1 分数
     */
    scoreAdd(playerIndex: number, score1: number) {
        this.setPosNodeActive(true);
        this.setPosIndexActive(playerIndex, true);
        var isWin = false;
        if (score1 > 0) {
            this._list[playerIndex.toString()].win.node.active = true;
            this._list[playerIndex.toString()].lose.node.active = false;
            this._list[playerIndex.toString()].label.node.active = true;
            this._list[playerIndex.toString()].loselabel.node.active = false;

            isWin = true;
        }
        else {
            this._list[playerIndex.toString()].win.node.active = false;
            this._list[playerIndex.toString()].lose.node.active = true;

            this._list[playerIndex.toString()].label.node.active = false;
            this._list[playerIndex.toString()].loselabel.node.active = true;
        }
        this._list[playerIndex.toString()].score = score1;

        this._isShowScore[playerIndex] = true;

        this.setScoreFunc(playerIndex, isWin, true);

    }
    /**飘分 */
    private setScoreFunc(index: number, iswin: boolean, isAction?: boolean, content1?: string): void {
        var score = this._list[index].score;

        var content = "";

        if (iswin) {
            content = "+" + UStringHelper.getMoneyFormat(score / 100, -1);
            this._list[index].label.string = content;
        }
        else {
            content = UStringHelper.getMoneyFormat(score / 100, -1);
            this._list[index].loselabel.string = content;
        }

        if (isAction == true) {

            if (iswin) {
                this._list[index].label.node.stopAllActions();
                this._list[index].win.node.stopAllActions();

                this._list[index].label.node.setPosition(this._oriPos[index]);
                this._list[index].win.node.setPosition(this._oriPos[index]);

                // this._list[index].label.node.runAction(cc.moveTo(1.0, this._targetPos[index]));
                this._list[index].label.node.runAction(cc.sequence(cc.moveTo(1.0, this._targetPos[index]), cc.callFunc(() => {
                    //分数滚动完赋值
                    if (this._totalscore[index] != null) {
                        let data = {
                            seatindex: index,//本地的索引
                            totalscore: this._totalscore[index],
                            isWin: iswin
                        }
                        MKPQZNNModel.ins.emit(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_TOTALSCORE_EVENT, data);
                    }
                }, this)));

                this._list[index].win.node.runAction(cc.moveTo(1.0, this._targetPos[index]));
            }
            else {
                this._list[index].loselabel.node.stopAllActions();
                this._list[index].lose.node.stopAllActions();

                this._list[index].loselabel.node.setPosition(this._oriPos[index]);
                this._list[index].lose.node.setPosition(this._oriPos[index]);

                this._list[index].loselabel.node.runAction(cc.sequence(cc.moveTo(1.0, this._targetPos[index]), cc.callFunc(() => {
                    //分数滚动完赋值
                    if (this._totalscore[index] != null) {
                        let data = {
                            seatindex: index,//本地的索引
                            totalscore: this._totalscore[index],
                            isWin: iswin
                        }
                        MKPQZNNModel.ins.emit(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_TOTALSCORE_EVENT, data);
                    }
                }, this)));

                this._list[index].lose.node.runAction(cc.moveTo(1.0, this._targetPos[index]));
            }
        }
        // this._flagRoot.runAction(cc.sequence(cc.moveTo(1.0, this._targetFlag), cc.callFunc(() => {
        //     this._flagRoot.active = false;
        // }, this)));
    }

    /**
     * 分数滚动  not use(美术说要统一 ，改成飘分的效果)
     * @param index 玩家索引
     * @param offest 偏移量
     */
    /*
    private scoreFunc(index: number, offest: number) {
        var score = this._list[index].score;
        var _offset = 0;
        if (score > 0)
            _offset = (offest * score / 1.5);
        else
            _offset = (offest * (-score) / 1.5);

        if (this._list[index].score > 0) {

            if (this._posScores[index] >= this._list[index].score) {
                this._posScores[index] = 0;
                this._isShowScore[index] = false;

                this._list[index].label.string = "+" + 
                    UStringHelper.getMoneyFormat(this._list[index].score/100);

                //分数滚动完赋值
                if (this._totalscore[index] != null) {
                    let data = {
                        seatindex: index,//本地的索引
                        totalscore: this._totalscore[index],
                        isWin: true
                    }
                    MKPQZNNModel.ins.emit(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_TOTALSCORE_EVENT, data);
                }
            }
            else {
                this._posScores[index] += _offset;
                this._list[index].label.string = "+" + (this._posScores[index]/100).toFixed(2);
            }
        }
        else {
            this._posScores[index] -= _offset;
            if (this._posScores[index] <= this._list[index].score) {
                this._posScores[index] = 0;
                this._isShowScore[index] = false;

                // this._list[index].label.string = this._list[index].score;//"-" +
                this._list[index].loselabel.string = UStringHelper.getMoneyFormat(this._list[index].score/100);

                //分数滚动完赋值
                if (this._totalscore[index] != null) {
                    let data = {
                        seatindex: index,//本地的索引
                        totalscore: this._totalscore[index],
                        isWin: false
                    }
                    MKPQZNNModel.ins.emit(UKPQZNNHelper.QZNN_SELF_EVENT.QZNN_TOTALSCORE_EVENT, data);
                }

            }
            else {
                // this._posScores[index] -= 1;
                // this._list[index].label.string = this._posScores[index].toFixed(2); //"-" + 
                this._list[index].loselabel.string = (this._posScores[index]/100).toFixed(2); 
            }
        }

    }

    update(dt: number) {

        if (this._isShowScore[0] ||
            this._isShowScore[1] ||
            this._isShowScore[2] ||
            this._isShowScore[3]
        ) {
            if (this._isShowScore[0]) {
                this.scoreFunc(0, dt);
            }

            if (this._isShowScore[1]) {
                this.scoreFunc(1, dt);
            }

            if (this._isShowScore[2]) {
                this.scoreFunc(2, dt);
            }

            if (this._isShowScore[3]) {
                this.scoreFunc(3, dt);
            }
        }
    }
    */
    //////////////////// test or not use ////////////////////////////////////

    lerp(a, b, t): number {
        if (t > 1) t = 1;
        return a + (b - a) * t;
    }
    private _t: number = 0
    test2(index, offest) {
        this._t += offest;
        let c = this.lerp(0, 35, this._t);

        this._list[index].label.string = "+" + c.toFixed(2);
        return;
    }

    testAni() {
        // var self = this;
        // let callback = cc.callFunc(() => {
        //     self.scoreAdd(0, -33456345);
        //     self.scoreAdd(1, -68.45);
        //     self.scoreAdd(2, 10000);
        //     self.scoreAdd(3, 25.7);

        // });
        // this.node.runAction(cc.sequence(cc.delayTime(1), callback));
    }


    //no 1 2 3
    // 1 2 3 4 5 6
    //1 3 5 7 10   
    //1 4 7 10 13           左边坐庄         
    // 1 4 8 11 15 选 1 倍  中间坐庄
}
