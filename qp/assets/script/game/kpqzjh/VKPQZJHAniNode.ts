import UCoinDFlyHelper from "../../common/utility/UCoinFlyHelper";
import UNodeHelper from "../../common/utility/UNodeHelper";
import MKPQZJHModel from "./model/MKPQZJHModel";
import UKPQZJHHelper from "./UKPQZJHHelper";
import UKPQZJHScene from "./UKPQZJHScene";
import UAudioManager from "../../common/base/UAudioManager";


const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:各龙骨动画
 */
@ccclass
export default class VKPQZJHAniNode extends cc.Component {
    /**赢家框 */
    // private _qznnWin: dragonBones.ArmatureDisplay[] = new Array(4);
    private _qznnWin: sp.Skeleton[] = new Array(4);
    private _winKuangNode: cc.Node = null;

    /**发牌动画 */
    private _fapaiAni: dragonBones.ArmatureDisplay[] = new Array(4);
    private _fapaiNode: cc.Node = null;

    /**开始动画 */
    // private _gameStartAni: dragonBones.ArmatureDisplay = null;
    private _gameStartAni: sp.Skeleton = null;
    /**庄家通杀 */
    // private _tongShaAni: dragonBones.ArmatureDisplay = null;
    private _tongShaAni: sp.Skeleton = null;
    /**庄家通赔 */
    // private _tongPeiAni: dragonBones.ArmatureDisplay = null;
    private _tongPeiAni: sp.Skeleton = null;


    private _coinFlyNode: cc.Node = null;

    private _maxplayer = 4;
    /**重置场景 */
    private _isRest: boolean = false;

    /**牛牛动画 */
    // private _cardType10Ani: dragonBones.ArmatureDisplay = null;


    /**胜利/输*/
    // private _winAni: dragonBones.ArmatureDisplay = null;
    private _winAni: sp.Skeleton = null;
    /**金币龙骨 */
    // private _showScoreAni = {
    //     "0": {
    //         "1": null,
    //         "2": null,
    //         "3": null
    //     },
    //     "1": {
    //         "0": null,
    //         "2": null,
    //         "3": null
    //     },
    //     "2": {
    //         "0": null,
    //         "1": null,
    //         "3": null
    //     },
    //     "3": {
    //         "0": null,
    //         "1": null,
    //         "2": null
    //     },
    // }

    /**飞行金币模板 */
    private _coinTemp: cc.Node;
    /**动态金币数组 */
    // private _coins: cc.Node[] = new Array();
    /**动态金币数组长度 */
    private _coins_length: number = 150;

    private _coinFlyHelper: UCoinDFlyHelper;

    /**4个头像的位置 */
    private pos = {
        [0]: cc.v2(-329.2, -265.8),
        [1]: cc.v2(-518, 15.9),
        // [2]: cc.v2(-89.6, 241.9),
        [2]: cc.v2(-112, 240),
        [3]: cc.v2(517, 15.9)
    }
    /**4个玩家发牌的终点 */
    private cardPos = {
        [0]: {
            [0]: cc.v2(-164, -257),
            [1]: cc.v2(-82, -257),
            [2]: cc.v2(-1, -257),
            [3]: cc.v2(81, -257),
            [4]: cc.v2(162, -257),
        },
        [1]: {
            [0]: cc.v2(-408.8, 18),
            [1]: cc.v2(-378.8, 18),
            [2]: cc.v2(-348.8, 18),
            [3]: cc.v2(-318.8, 18),
            [4]: cc.v2(-288.8, 18),
        },
        [2]: {
            [0]: cc.v2(6.2, 240.2),
            [1]: cc.v2(36.8, 240.2),
            [2]: cc.v2(66.9, 240.2),
            [3]: cc.v2(97.1, 240.2),
            [4]: cc.v2(127.2, 240.2),
        },
        [3]: {
            [0]: cc.v2(297, 19),
            [1]: cc.v2(325, 19),
            [2]: cc.v2(354, 19),
            [3]: cc.v2(383, 19),
            [4]: cc.v2(412, 19),
        }
    }
    private _cardsFly: {
        [key: number]: {
            [key: number]: cc.Node
        }
    };
    private _cardTemp: cc.Node;
    /**是否可播放赢家框动画 */
    private _canplay = true;
    private _myScore: number = 0;


    start() {
        this._winKuangNode = UNodeHelper.find(this.node, "winKuangNode");
        this._fapaiNode = UNodeHelper.find(this.node, "fapaiNode");
        this._maxplayer = MKPQZJHModel.ins.maxPlayer;

        this._cardTemp = UNodeHelper.find(this._fapaiNode, "cardTemp");

        var self = this;

        this._cardsFly = {};

        for (let i = 0; i < this._maxplayer; i++) {
            let path = "qznnWin" + i.toString();
            // this._qznnWin[i] = UNodeHelper.getComponent(this._winKuangNode, path, dragonBones.ArmatureDisplay);
            this._qznnWin[i] = UNodeHelper.getComponent(this._winKuangNode, path, sp.Skeleton);

            // let fpPath = "qznnFaPaiAni" + i.toString();
            // this._fapaiAni[i] = UNodeHelper.getComponent(this._fapaiNode, fpPath, dragonBones.ArmatureDisplay);
            // this._fapaiAni[i].addEventListener(dragonBones.EventObject.COMPLETE, (event) => {
            //     self.sendFapaiCompleteEvent(i);
            // }, this);

            // this.setFaPaiNodeActive(i, false);

            //代码的牌飞行动画
            this._cardsFly[i] = {};
            for (let j = 0; j < 3; j++) {
                this._cardsFly[i][j] = cc.instantiate(this._cardTemp);
                this._cardsFly[i][j].parent = this._fapaiNode;
                this._cardsFly[i][j].setPosition(cc.v2(0, 0));
            }
        }

        // this._cardType10Ani = UNodeHelper.getComponent(this.node, "qznnCardType10Ani", dragonBones.ArmatureDisplay);
        // this._cardType10Ani.removeEventListener(dragonBones.EventObject.COMPLETE);
        // this._cardType10Ani.addEventListener(dragonBones.EventObject.COMPLETE, (event) => {
        //     self.setCardType10AniActive(false);
        // });
        // this.setCardType10AniActive(false);

        // this._gameStartAni = UNodeHelper.getComponent(this.node, "qznnStartAni", dragonBones.ArmatureDisplay);
        // this._gameStartAni.removeEventListener(dragonBones.EventObject.COMPLETE);
        // this._gameStartAni.addEventListener(dragonBones.EventObject.COMPLETE, (event) => {
        //     self.setGameStartAniActive(false);
        // });
        // this.setGameStartAniActive(false);

        // this._winAni = UNodeHelper.getComponent(this.node, "qznnWinAni", dragonBones.ArmatureDisplay);
        // this._winAni.removeEventListener(dragonBones.EventObject.COMPLETE);
        // this._winAni.addEventListener(dragonBones.EventObject.COMPLETE, (event) => {
        //     self.setWinAniActive(false);
        // });
        // this.setWinAniActive(false);

        /*
        this._tongShaAni = UNodeHelper.getComponent(this.node, "qznnTongShaAni", dragonBones.ArmatureDisplay);
        this._tongShaAni.removeEventListener(dragonBones.EventObject.COMPLETE);
        this._tongShaAni.addEventListener(dragonBones.EventObject.COMPLETE, (event) => {
            self.setTongShaAniActive(false);
        });
        self.setTongShaAniActive(false);


        this._tongPeiAni = UNodeHelper.getComponent(this.node, "qznnTongPeiAni", dragonBones.ArmatureDisplay);
        this._tongPeiAni.removeEventListener(dragonBones.EventObject.COMPLETE);
        this._tongPeiAni.addEventListener(dragonBones.EventObject.COMPLETE, (event) => {
            self.setTongPeiAniActive(false);
        });
        this.setTongPeiAniActive(false);
        */

        this._winAni = UNodeHelper.getComponent(this.node, "qznnWinAni", sp.Skeleton);
        this._winAni.setCompleteListener((event) => {
            self.setWinAniActive(false);
        });
        this.setWinAniActive(false);

        this._gameStartAni = UNodeHelper.getComponent(this.node, "qznnStartAni", sp.Skeleton);
        this._gameStartAni.setCompleteListener((event) => {
            if (!self._isRest) {
                // MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_START_ANI_COMPLETE);
                self.firstSendCard();
            }
            self.setGameStartAniActive(false);
        });
        this.setGameStartAniActive(false);

        this._tongShaAni = UNodeHelper.getComponent(this.node, "qznnTongShaAni", sp.Skeleton);

        this._tongShaAni.setCompleteListener((event) => {
            self.setTongShaAniActive(false);
        });
        self.setTongShaAniActive(false);


        this._tongPeiAni = UNodeHelper.getComponent(this.node, "qznnTongPeiAni", sp.Skeleton);

        this._tongPeiAni.setCompleteListener((event) => {
            self.setTongPeiAniActive(false);
        });
        this.setTongPeiAniActive(false);

        this._coinFlyNode = UNodeHelper.find(this.node, "coinflyNode");
        this._coinTemp = UNodeHelper.find(this._coinFlyNode, "coinTemp");
        this._coinFlyHelper = new UCoinDFlyHelper(this._coinTemp, this._coinFlyNode, this.pos);


        // this.showCoinFlyAni(3,2);

        // this.showWinKuangAni(0);
        // this.testAni(1);
        // this.testAni(2);
        // this.testAni(3);

        //#region 金币龙骨ani
        /*
        this._showScoreAni[0][1] = UNodeHelper.getComponent(this._coinFlyNode, "qznnShowScoreAni0-1", dragonBones.ArmatureDisplay);
        this._showScoreAni[0][2] = UNodeHelper.getComponent(this._coinFlyNode, "qznnShowScoreAni0-2", dragonBones.ArmatureDisplay);
        this._showScoreAni[0][3] = UNodeHelper.getComponent(this._coinFlyNode, "qznnShowScoreAni0-3", dragonBones.ArmatureDisplay);
        this._showScoreAni[1][0] = UNodeHelper.getComponent(this._coinFlyNode, "qznnShowScoreAni1-0", dragonBones.ArmatureDisplay);
        this._showScoreAni[1][2] = UNodeHelper.getComponent(this._coinFlyNode, "qznnShowScoreAni1-2", dragonBones.ArmatureDisplay);
        this._showScoreAni[1][3] = UNodeHelper.getComponent(this._coinFlyNode, "qznnShowScoreAni1-3", dragonBones.ArmatureDisplay);
        this._showScoreAni[2][0] = UNodeHelper.getComponent(this._coinFlyNode, "qznnShowScoreAni2-0", dragonBones.ArmatureDisplay);
        this._showScoreAni[2][1] = UNodeHelper.getComponent(this._coinFlyNode, "qznnShowScoreAni2-1", dragonBones.ArmatureDisplay);
        this._showScoreAni[2][3] = UNodeHelper.getComponent(this._coinFlyNode, "qznnShowScoreAni2-3", dragonBones.ArmatureDisplay);
        this._showScoreAni[3][0] = UNodeHelper.getComponent(this._coinFlyNode, "qznnShowScoreAni3-0", dragonBones.ArmatureDisplay);
        this._showScoreAni[3][1] = UNodeHelper.getComponent(this._coinFlyNode, "qznnShowScoreAni3-1", dragonBones.ArmatureDisplay);
        this._showScoreAni[3][2] = UNodeHelper.getComponent(this._coinFlyNode, "qznnShowScoreAni3-2", dragonBones.ArmatureDisplay);


        var self = this;
        for (const key in this._showScoreAni) {
            if (this._showScoreAni.hasOwnProperty(key)) {
                const element = this._showScoreAni[key];

                for (const key1 in element) {
                    if (element.hasOwnProperty(key1)) {
                        const element1 = element[key1];

                        // UDebug.Log("key:" + key + " key1:" + key1);

                        element1.node.active = false;
                        //cocos 关于龙骨奇怪的问题,要先移除再监听才生效
                        element1.removeEventListener(dragonBones.EventObject.COMPLETE);

                        element1.addEventListener(dragonBones.EventObject.COMPLETE, (event) => {
                            self._showScoreAni[key][key1].node.active = false;
                        });


                    }
                }
            }
        }
        */
        //#endregion
        this.addEvent();
    }

    onDestroy() {
        this.removeEvent();
    }

    private addEvent() {
        // this._eventTongsha = MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_TONGSHA_EVENT, this.onTongSha, this);
        // this._eventTongpei = MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_TONGPEI_EVENT, this.onTongPei, this);

        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, this.showGameStart, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_SEND_CARD, this.onSendCard, this);

        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_END, this.onGameEnd, this);
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_TOTALSCORE_EVENT, this.onTotalScore, this);//分数滚动完事件
        MKPQZJHModel.ins.on(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE, this.onResetScene, this);//重置场景事件



    }

    private removeEvent() {
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, this.showGameStart, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_SEND_CARD, this.onSendCard, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_END, this.onGameEnd, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_TOTALSCORE_EVENT, this.onTotalScore, this);
        MKPQZJHModel.ins.off(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_RESET_SCENE, this.onResetScene, this);
    }



    private onResetScene(data?: any) {
        this._isRest = true;

        for (let i = 0; i < this._maxplayer; i++) {
            // this.resetBreathingLampAni(i);
            this.hideWinKuangAni(i);

            if (this._cardsFly != null) {
                for (let j = 0; j < 3; j++) {
                    if (this._cardsFly[i] && this._cardsFly[i][j]) {
                        this._cardsFly[i][j].stopAllActions();
                    }
                }
                this.resetCardsPos();

                for (let j = 0; j < 3; j++) {
                    if (this._cardsFly[i] && this._cardsFly[i][j]) {
                        this._cardsFly[i][j].active = false;
                    }
                }
            }


        }
        if (this._coinFlyHelper) {
            this._coinFlyHelper.resetAll();
        }
        this.unscheduleAllCallbacks();
        this._myScore = 0;
        this.setWinAniActive(false);
        this._canplay = false;
    }

    private onTongSha(data?: any) {
        this.setTongShaAniActive(true);

        UKPQZJHScene.ins.playTongsha();
    }

    private onTongPei(data?: any) {
        this.setTongPeiAniActive(true);

        UKPQZJHScene.ins.playTongpei();
    }

    // private testaaaa(event, custom) {
    //     this.playCoinFlyAni(0, custom);

    //     for (let i = 0; i < 4; i++) {
    //         this.setFaPaiAni(i, true);
    //     }
    // }

    //#region 金币飞行

    /**代码实现的 金币飞行动画 */
    private playCoinFlyAni(start: number, end: number, isMusicPlayOne: boolean = false) {

        if (start < 0 || start > 3 || end < 0 || end > 3) return;

        for (let i = 0; i < this._coins_length; i++) {
            var item = this._coinFlyHelper.getInstans();
            item.setPosition(this.pos[start]);
            this._coinFlyHelper.moveChipToRect(item, start, end);

        }
        if (!isMusicPlayOne) {
            /**播5次声音 */
            for (let j = 0; j < 5; j++) {
                UKPQZJHScene.ins.getMusic.playflyCoin();
            }
        }

        this.showWinKuangAni(end);

        // var self = this;
        // this.scheduleOnce(()=>{
        //     self.showWinKuangAni(end);
        // },0.4);
    }


    /**
     * 金币飞动画 not use 龙骨
     * @param start 开始玩家本地位置
     * @param end 结束玩家本地位置
     */
    private showCoinFlyAni1(start: number, end: number) {
        // this._showScoreAni[start][end].node.active = true;

        // var self = this;
        // this._showScoreAni[start][end].removeEventListener(dragonBones.EventObject.COMPLETE);
        // this._showScoreAni[start][end].addEventListener(dragonBones.EventObject.COMPLETE, (event) => {
        //     this._showScoreAni[start][end].node.active = false;
        // });

        // var name = "qznn_showScore" + start.toString() + "-" + end.toString();
        // this._showScoreAni[start][end].animationName = name;

        // this._showScoreAni[start][end].playAnimation(name, 1);
    }

    //#endregion

    private showGameStart(data: any) {
        this._isRest = false;
        this._canplay = true;
        //刷新玩家数据
        // let playerData = data;
        this.setGameStartAniActive(true);
        
    }

    //第一次发牌 4张
    private firstSendCard(){
        var players = MKPQZJHModel.ins.gBattlePlayer;

        if (players != null) {
            for (const key in players) {
                if (players.hasOwnProperty(key)) {
                    const element = players[key];
                    var uipos = MKPQZJHModel.ins.getUISeatId(element.chairId);

                    // this.setPlayerActiveByIndex(uipos,true);

                    if (element.playStatus == 1)//上座玩家
                    {
                        this.setFaPaiAni(uipos, true);
                    }
                }
            }
        }
    }
    //盖住的牌翻起 最后的牌亮起
    private onSendCard(data: any) {
        // var players = MKPQZJHModel.ins.gBattlePlayer;
        // if (players != null) {
        //     for (const key in players) {
        //         if (players.hasOwnProperty(key)) {
        //             const element = players[key];
        //             var uipos = MKPQZJHModel.ins.getUISeatId(element.chairId);

        //             if (element.playStatus == 1)//上座玩家
        //             {
        //                 this.setFaPaiAni(uipos, true);
        //             }

        //         }
        //     }
        // }
    }

    private onGameEnd(data: any,pl:any) {
        var dLWScore = data.LWScore;
        var cbEndType = data.endType;
        var totalScore = data.totalScore;

        var self = this;
        // showCoinFlyAni
        //金币飞行
        if (dLWScore != null) {

            var banker = MKPQZJHModel.ins.gBankerIndex;
            var bankerLocalPos = MKPQZJHModel.ins.getUISeatId(banker);

            //计算自己的输赢
            var myScore = 0;

            // var endPos = new Array(dLWScore.length);
            if (bankerLocalPos != null)//有庄家
            {
                if (cbEndType == 1) {//通杀
                    // this.onTongSha();

                    this.unscheduleAllCallbacks();

                    //金币动画从各处往庄家飞
                    for (let j = 0; j < dLWScore.length; j++) {
                        let player = MKPQZJHModel.ins.getbattleplayerbyChairId(j,pl);
                        if (player != null && player.playStatus == 1 && player.seatId >= 0 && player.seatId < 4) {

                            let index1 = MKPQZJHModel.ins.getUISeatId(j);
                            if (index1 != null && index1 != bankerLocalPos) {
                                this.playCoinFlyAni(index1, bankerLocalPos, true);
                            }
                        }
                    }
                    for (let i = 0; i < 5; i++) {
                        UKPQZJHScene.ins.getMusic.playflyCoin();
                    }

                    if (bankerLocalPos == 0) {//自己是庄家
                        myScore = 1;
                    } else {//其他就是输
                        myScore = -1;
                    }


                    this.scheduleOnce(() => {
                        self.onTongSha();
                    }, 0.8);

                    // this.scheduleOnce(() => {
                    //     self.setWinAniActive(true,myScore);
                    // }, 1.7);

                    this._myScore = myScore;

                    return;
                }
                else if (cbEndType == 2) {//通赔
                    // this.onTongPei();

                    this.unscheduleAllCallbacks();

                    //金币动画从庄家往各处飞
                    for (let j = 0; j < dLWScore.length; j++) {

                        let player = MKPQZJHModel.ins.getbattleplayerbyChairId(j,pl);
                        if (player != null && player.playStatus == 1 && player.seatId >= 0 && player.seatId < 4) {

                            let index2 = MKPQZJHModel.ins.getUISeatId(j);
                            if (index2 != null && index2 != bankerLocalPos) {
                                this.playCoinFlyAni(bankerLocalPos, index2, true);
                            }
                        }
                    }
                    for (let i = 0; i < 5; i++) {
                        UKPQZJHScene.ins.getMusic.playflyCoin();
                    }

                    if (bankerLocalPos == 0) {//自己是庄家
                        myScore = -1;
                    } else {//其他就是赢
                        myScore = 1;
                    }


                    this.scheduleOnce(() => {
                        self.onTongPei();
                    }, 0.8);

                    // this.scheduleOnce(() => {
                    //     self.setWinAniActive(true,myScore);
                    // }, 1.7);
                    this._myScore = myScore;
                    return;
                }

                /**飞向庄家的 */
                let toBanker = new Array();
                /**飞向玩家的 */
                let toPlayers = new Array();

                for (let i = 0; i < dLWScore.length; i++) {

                    let player = MKPQZJHModel.ins.getbattleplayerbyChairId(i,pl);
                    if (player != null && player.playStatus == 1 && player.seatId >= 0 && player.seatId < 4) {
                        const score = dLWScore[i];
                        let index = MKPQZJHModel.ins.getUISeatId(i);
                        if (index == 0) {
                            if (score > 0) {
                                myScore = 1;
                            } else if (score < 0) {
                                myScore = -1;
                            }
                        }

                        if (score > 0) {//代表大过庄家
                            if (index != null && bankerLocalPos != index) {//不是庄家
                                // this.playCoinFlyAni(bankerLocalPos, index);
                                toPlayers.push({ start: bankerLocalPos, end: index });
                            }
                        }
                        else if (score < 0) {
                            if (index != null && bankerLocalPos != index) {
                                // this.playCoinFlyAni(index, bankerLocalPos);
                                toBanker.push({ start: index, end: bankerLocalPos });
                            }
                        }
                    }
                }

                this.unscheduleAllCallbacks();

                for (let i = 0; i < toBanker.length; i++) {
                    let element = toBanker[i];
                    this.playCoinFlyAni(element.start, element.end);
                }
                this._myScore = myScore;
                this.scheduleOnce(() => {
                    for (let j = 0; j < toPlayers.length; j++) {
                        let element = toPlayers[j];
                        self.playCoinFlyAni(element.start, element.end);
                    }
                    // self.setWinAniActive(true,myScore);

                }, 0.8);

            }
        }

    }
    /**显示赢家呼吸灯 */
    onTotalScore(data: any) {
        var seatindex = data.seatindex;
        var isWin = data.isWin;

        if (isWin && this._canplay) {
            // this.showWinKuangAni(seatindex);
            this.setWinAniActive(true, this._myScore);

            if (seatindex == 0) {//自己赢
                UKPQZJHScene.ins.playWin();
            }
        }
    }



    //#region 赢家框部分
    /**
     * 打开赢家框
     */
    // showWinKuang() {
    //     this._winKuangNode.active = true;
    // }
    /**
     * 隐藏所有赢家框节点
     */
    hideWinKuang() {
        this._winKuangNode.active = false;
    }
    /**
     * 显示某个赢家框
     * @param index 
     */
    showWinKuangAni(index: number) {
        this._qznnWin[index].node.active = true;
        // this.breathingLampAni(index);

        this._qznnWin[index].animation = "animation";
        this._qznnWin[index].setAnimation(0, "animation", false);
    }


    /**
     * 隐藏赢家框
     * @param index 
     */
    hideWinKuangAni(index: number) {
        this._qznnWin[index].node.active = false;
    }
    /**重置呼吸灯效果 not use */
    resetBreathingLampAni(index: number) {
        // this._qznnWin[index].node.stopAllActions();
        // this._qznnWin[index].removeEventListener(dragonBones.EventObject.COMPLETE);
    }

    /**
     * 赢家呼吸灯效果 not use
     * @param index 
     */
    breathingLampAni(index: number) {

        /////////////不等第一次播放完毕//////////////
        // this._qznnWin[index].timeScale = 0;
        // if (index == 0 || index == 2)
        //     this._qznnWin[index].playAnimation("qznn_win_transverse", 1);
        // else
        //     this._qznnWin[index].playAnimation("qznn_win_vertical", 1);
        // this._qznnWin[index].node.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(1, 150), cc.fadeTo(1, 255))));

        /*
        //等第一次播放完毕
        var self = this;
        this._qznnWin[index].timeScale = 1;

        this._qznnWin[index].animationName = "qznn_win_vertical";
        this._qznnWin[index].playAnimation("qznn_win_vertical", 1);//换了

        if(cc.sys.isNative){//因为模拟器会闪
            return;
        }

        this._qznnWin[index].removeEventListener(dragonBones.EventObject.COMPLETE);
        this._qznnWin[index].addEventListener(dragonBones.EventObject.COMPLETE, (event) => {
            self._qznnWin[index].timeScale = 0;

            // if (index == 0 || index == 2)
            //     self._qznnWin[index].playAnimation("qznn_win_transverse", 1);
            // else
            // self._qznnWin[index].playAnimation("qznn_win_vertical", 1);//换了

            self._qznnWin[index].node.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(1, 120), cc.fadeTo(1, 170))));
            
        });
        */
    }
    //#endregion

    resetCardsPos() {
        if (this._cardsFly != null) {
            for (let i = 0; i < this._maxplayer; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this._cardsFly[i][j.toString()] != null) {
                        this._cardsFly[i][j.toString()].setPosition(cc.v2(0, 0));
                    }
                }
            }
        }

    }
    /**发牌完成 */
    sendFapaiCompleteEvent(index: number) {
        if (index == 0) {
            MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_MOVE_NEXT_CMD);
        }

        MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_FAPAI_COMPLETE, index);

        // this._fapaiAni[index].node.active = false;

        if (this._cardsFly != null && this._cardsFly[index] != null) {
            for (let j = 0; j < 3; j++) {
                this._cardsFly[index][j].active = false;
            }
        }
    }

    private setFaPaiAni(index: number, b?: boolean) {
        this.resetCardsPos();
        if (b) {
            for (let j = 0; j < 3; j++) {

                // this._cardsFly[index][j].runAction()
                this.moveCardTo(this._cardsFly[index][j], index, j);
                // UKPQZJHScene.ins.getMusic.playSendCard();
            }
        }
    }

    moveCardTo(node: cc.Node, playerIndex: number, cardIndex: number) {
        node.active = true;
        node.setScale(0);

        var desc_scalex = 1;
        // var act_time = 0.5;
        // node.opacity = 255;//200;
        var dt_time = 0.2 * cardIndex;//Math.random() * 0.2;
        var desc_scaley = 1

        var self = this;
        if (playerIndex != 0) {
            desc_scalex = 0.55;
            desc_scaley = 0.58;
        }

        var seq = cc.sequence(cc.delayTime(dt_time),
            cc.spawn(
                // cc.fadeIn(act_time / 1.5),
                cc.scaleTo(0.2, desc_scalex, desc_scaley),
                cc.moveTo(0.3, self.cardPos[playerIndex.toString()][cardIndex.toString()])
            ),
            cc.callFunc(() => {

                if (cardIndex == 2) {
                    self.sendFapaiCompleteEvent(playerIndex);
                } else {
                    UKPQZJHScene.ins.getMusic.playSendCard();
                }

            })
        );

        node.stopAllActions();
        node.runAction(seq);
    }


    //not use
    private sendFapaiCompleteEvent1(index: number) {
        // MKPQZJHModel.ins.emit(UKPQZJHHelper.QZNN_SELF_EVENT.QZNN_FAPAI_COMPLETE, index);
        // this._fapaiAni[index].node.active = false;
    }

    /**
     * 设置动画激活状态 not use
     * @param index 索引
     * @param b 是否激活
     */
    setFaPaiNodeActive1(index: number, b: boolean) {
        this._fapaiAni[index].node.active = b;

        if (b == true) {

            var name = "";
            if (index == 3) {
                name = "qznn_effect_fapai1";
            }
            else if (index == 1) {
                name = "qznn_effect_fapai3";
            }
            else {
                name = "qznn_effect_fapai" + index.toString();
            }

            this._fapaiAni[index].animationName = name;
            this._fapaiAni[index].playAnimation(name, 1);
        }
    }

    /**
     * 自己是牛牛可调用这个方法
     * @param b 
     */
    setCardType10AniActive(b: boolean) {
        // this._cardType10Ani.node.active = b;

        // if (b == true) {
        //     this._cardType10Ani.animationName = "newAnimation";
        //     this._cardType10Ani.playAnimation("newAnimation", 1)
        // }
    }
    /**游戏开始动画 */
    setGameStartAniActive(b: boolean) {

        this._gameStartAni.node.active = b;

        if (b == true) {
            // this._gameStartAni.animationName = "newAnimation";
            // this._gameStartAni.playAnimation("newAnimation", 1)
            this._gameStartAni.animation = "ksyx";
            this._gameStartAni.setAnimation(0, "ksyx", false);

            UKPQZJHScene.ins.getMusic.playStart();
        }
    }
    /**庄家通杀动画 */
    setTongShaAniActive(b: boolean) {
        this._tongShaAni.node.active = b;

        if (b == true) {
            // this._tongShaAni.animationName = "newAnimation";
            // this._tongShaAni.playAnimation("newAnimation", 1)
            this._tongShaAni.animation = "zjts";
            this._tongShaAni.setAnimation(0, "zjts", false);
            // UDebug.Log("zjts xxxxxxxxx");

        }
    }
    /**庄家通赔动画 */
    setTongPeiAniActive(b: boolean) {
        this._tongPeiAni.node.active = b;

        if (b == true) {
            // this._tongPeiAni.animationName = "newAnimation";
            // this._tongPeiAni.playAnimation("newAnimation", 1)
            this._tongPeiAni.animation = "zjtp";
            this._tongPeiAni.setAnimation(0, "zjtp", false);
            // UDebug.Log("zjtp xxxxxxxxx");
        }
    }
    /**胜利动画 */
    setWinAniActive(b: boolean, score?: number) {
        this._winAni.node.active = b;

        if (b == true) {
            // this._winAni.animationName = "newAnimation";
            // this._winAni.playAnimation("newAnimation", 1)
            var name = "win";
            this._winAni.animation = name;

            if (score < 0) {
                name = "lost";
                // this._winAni.animation = name;
                this._winAni.setAnimation(0, name, false);
                // this._winAni.node.active = false;
                UAudioManager.ins.playSound("audio_qznn_nsl");
            }
            else if (score > 0) {
                this._winAni.setAnimation(0, name, false);
                UAudioManager.ins.playSound("audio_qznn_gxnyl");

            }
            else if (score == 0) {
                this._winAni.node.active = false;
            }

        }
    }

    /********************** test function *********************************/
    //test all score ani
    testAllCoinFly() {
        //     var self = this;
        //     for (const key in this._showScoreAni) {
        //         if (this._showScoreAni.hasOwnProperty(key)) {
        //             const element = this._showScoreAni[key];

        //             for (const key1 in element) {
        //                 if (element.hasOwnProperty(key1)) {
        //                     const element1 = element[key1];

        //                     // UDebug.Log("key:" + key + " key1:" + key1);
        //                     self.showCoinFlyAni(parseInt(key), parseInt(key1));
        //                 }
        //             }
        //         }
        //     }
    }
}
