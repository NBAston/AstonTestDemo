import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "../../public/base/AppGame";
import UStringHelper from "../../common/utility/UStringHelper";

import UDebug from "../../common/utility/UDebug";
import { QZJH_SELF_SEAT } from "./model/MQZJHModel";
import UQZJHScene from "./UQZJHScene";
import UResManager from "../../common/base/UResManager";
import { EIconType } from "../../common/base/UAllenum";
import UQZJHHelper from "./UQZJHHelper";

const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:各玩家 view
 */
@ccclass
export default class VQZJHPlayersNode extends cc.Component {

    private _players = {
        "0": {
            touxiang: null,
            nickname: null,
            coin: null,
            node: null,
            qzbs: null,
            xzbs: null,
            qp: null,
            headbox: null,
            viplv: null,
            wsz: null,
        },
        "1": {
            touxiang: null,
            nickname: null,
            coin: null,
            node: null,
            qzbs: null,
            xzbs: null,
            qp: null,
            headbox: null,
            viplv: null,
            wsz: null,
        },
        "2": {
            touxiang: null,
            nickname: null,
            coin: null,
            node: null,
            qzbs: null,
            xzbs: null,
            qp: null,
            headbox: null,
            viplv: null,
            wsz: null,

        },
        "3": {
            touxiang: null,
            nickname: null,
            coin: null,
            node: null,
            qzbs: null,
            xzbs: null,
            qp: null,
            headbox: null,
            viplv: null,
            wsz: null,
        },
    };

    /**抢庄下注时的Y位置 qzbs/xzbs*/
    private _qzPosY: Array<number> = [62, 56, -53, 57.3];
    /**发牌时的Y位置 qzbs/xzbs*/
    private _fpPosY: Array<number> = [62, 87.5, -90.5, 84.1];
    /**抢庄下注时的Y位置 qp*/
    private _qzQpPosY: Array<number> = [50.8, 44, -43.8, 50.8];//-63.8
    /**发牌时的Y位置 qp*/
    private _fpQpPosY: Array<number> = [50.8, 75.5, -80, 75.7]; // -101.3


    private _maxplayer: number = 4;
    // private _seats;

    /**自己的分数 */
    private _myscore: number = -1;

    //start
    onLoad() {
        this.init();
        this.addEvent();
    }
    private addEvent() {
        // AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_UPDATE_ROLEINFO, this.updateMyRoleInfo, this);

        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SUB_S_GAME_START, this.onGamestart, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SUB_S_CALL_BANKER, this.onCallBanker, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);


        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_XUAN_ZHUANG_END_EVENT, this.onXuanZhuangEnd, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_TOTALSCORE_EVENT, this.onTotalScore, this);

        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SUB_S_SEND_CARD, this.onSendCard, this);

        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_RESET_SCENE, this.onResetScene, this);
        AppGame.ins.qzjhModel.on(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SCENE_OPEN_NOT_SEND_CARD, this.openNotSendCard, this);

    }

    private removeEvent() {
        // AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_UPDATE_ROLEINFO, this.updateMyRoleInfo, this);

        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SUB_S_GAME_START, this.onGamestart, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SUB_S_CALL_BANKER, this.onCallBanker, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);

        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SUB_S_SEND_CARD, this.onSendCard, this);

        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_XUAN_ZHUANG_END_EVENT, this.onXuanZhuangEnd, this);
        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_TOTALSCORE_EVENT, this.onTotalScore, this);

        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);

        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_RESET_SCENE, this.onResetScene, this);

        AppGame.ins.qzjhModel.off(UQZJHHelper.QZJH_SELF_EVENT.QZJH_SCENE_OPEN_NOT_SEND_CARD, this.openNotSendCard, this);
    }

    onDestroy() {
        this.removeEvent();
    }

    init() {
        this._maxplayer = AppGame.ins.qzjhModel.maxPlayer;
        for (let i = 0; i < this._maxplayer; i++) {
            let path = "seat" + i.toString();

            this._players[i.toString()].touxiang =
                UNodeHelper.getComponent(this.node, path + "/qznn_touxiang", cc.Sprite);

            this._players[i.toString()].nickname =
                UNodeHelper.getComponent(this.node, path + "/nickname", cc.Label);

            this._players[i.toString()].coin =
                UNodeHelper.getComponent(this.node, path + "/coin", cc.Label);

            this._players[i.toString()].node =
                UNodeHelper.find(this.node, path);

            this._players[i.toString()].qzbs =
                UNodeHelper.getComponent(this.node, path + "/Label_qzbs", cc.Label);

            this._players[i.toString()].xzbs =
                UNodeHelper.getComponent(this.node, path + "/Label_xzbs", cc.Label);

            this._players[i.toString()].qp =
                UNodeHelper.find(this.node, path + "/qznn_talkbg");

            this._players[i.toString()].viplv =
                UNodeHelper.getComponent(this.node, path + "/vip", cc.Label);

            this._players[i.toString()].headbox =
                UNodeHelper.getComponent(this.node, path + "/frame_0", cc.Sprite);

            this._players[i.toString()].wsz =
                UNodeHelper.find(this.node, path + "/outNode");
        }
        // cc.log(this._players);

        //一进去,除自己之外都隐藏
        for (let i = 0; i < this._maxplayer; i++) {

            this.setQZBSActive(i, false);
            this.setXZBSActive(i, false);
            this.setQPActive(i, false);
            // if (i != 0)
            // this.setPlayerActiveByIndex(i, false);
        }


    }

    /**
     * 重置场景
     * @param data 
     */
    private onResetScene(data?: any) {
        for (let i = 0; i < this._maxplayer; i++) {
            this.setQZBSActive(i, false);
            this.setXZBSActive(i, false);
            this.setQPActive(i, false);

            if (i != QZJH_SELF_SEAT) {
                this._players[i.toString()].node.active = false;
            }
            else//自己 就更新信息
            {
                var myscore = UQZJHScene.ins.myScore;
                if (myscore == 0) {

                    if (this._myscore != null && this._myscore != -1) {
                        myscore = this._myscore;
                    } else {
                        myscore = AppGame.ins.roleModel.score;
                    }

                }

                var myInfo = {
                    coin: myscore,
                    headId: AppGame.ins.roleModel.headId,
                    nickname: AppGame.ins.roleModel.useId,//.nickName
                    headboxId: AppGame.ins.roleModel.headboxId,
                    viplv: AppGame.ins.roleModel.vipLevel,
                }
                this.updateMyRoleInfo(myInfo);
            }
        }
        this.resetPopPos();
        AppGame.ins.qzjhModel.updateBattlePlayer();
        //         if (element.seatId == 0) {
        //             element.showbaseInfo(AppGame.ins.sgModel.getshowselfinfo());
        //         } else
        //             element.free();
    }

    onGamestart(data: any) {
        var players = AppGame.ins.qzjhModel.gBattlePlayer;
        this._myscore = -1;
        if (players != null) {
            for (const key in players) {
                if (players.hasOwnProperty(key)) {
                    const element = players[key];
                    var uipos = AppGame.ins.qzjhModel.getUISeatId(element.chairId)
                    if (element.playStatus == 1 && uipos != null) {
                        this.setPlayerActiveByIndex(uipos, true);
                    }
                }
            }
        }

        for (let i = 0; i < this._maxplayer; i++) {
            this.setQZBSActive(i, false);
            this.setXZBSActive(i, false);
            this.setQPActive(i, false);
        }
        //更新自己金币
        let users = data.users;
        for (let index = 0; index < users.length; index++) {
            const element = users[index];
            if (element.userId == AppGame.ins.roleModel.useId) {
                this.setPlayerCoin(0, element.score);
            }
        }
    }
    onSendCard() {
        for (let i = 0; i < this._maxplayer; i++) {
            this.setFPQPAction(i);
        }

    }
    /**重连时 没发牌动画时 */
    openNotSendCard() {
        for (let i = 0; i < this._maxplayer; i++) {
            this.setFPQPAction(i, false);

            // this.setFPQPAction(i);//实在不行用带动画的
        }
    }
    setPlayerHeadBox(index: number, iconIndex: number): void {
        UResManager.load(iconIndex, EIconType.Frame, this._players[index.toString()]["headbox"]);
    }
    setPlayerVip(index: number, vip: number): void {
        this._players[index.toString()]["viplv"].string = vip;
    }

    setPlayerWsz(index: number,isShow:boolean): void {
        this._players[index.toString()].wsz.active = isShow
    }

    /**
     * 设置玩家头像
     * @param index 
     * @param iconIndex 
     */
    setPlayerIcon(index: number, iconIndex: number,headImgUrl:string) {
        //0-7 男 8-15 女
        // let gender = "man";
        // if (iconIndex > 7) {
        //     gender = "women";
        //     iconIndex = (iconIndex % 8);
        // }

        // let iconPath = "public/Texture/head/" + gender + iconIndex.toString();
        // var self = this;

        //not work 
        // let callback = UHandler.create((err,spriteFrame)=>{
        //     self._players[index.toString()]["touxiang"].spriteFrame = spriteFrame;
        // },this,true,iconPath);

        // UResLoader.ins.loadRes(iconPath,cc.SpriteFrame,null,callback);

        // cc.loader.loadRes(iconPath, cc.SpriteFrame, function (err, spriteFrame) {
        //     if (err) {
        //         cc.error(err.message || err);
        //         return;
        //     }

        //     self._players[index.toString()]["touxiang"].spriteFrame = spriteFrame;

        // });

        UResManager.load(iconIndex, EIconType.Head, this._players[index.toString()]["touxiang"],headImgUrl);
    }

    /**
     * 设置玩家昵称
     * @param index 座位索引
     * @param name 名字
     */
    setPlayerNickName(index: number, name: string) {
        // this._players[index.toString()]["nickname"].string = name;
        // this._players[index.toString()]["nickname"].string = UStringHelper.spliteString(name.toString(), 12);

        if (index != 0)
        this._players[index.toString()]["nickname"].string = UStringHelper.coverName(name.toString());
    else
        this._players[index.toString()]["nickname"].string = name.toString();
    }

    /**
     * 设置玩家金币
     * @param index 座位索引
     * @param coin 金币数
     */
    setPlayerCoin(index: number, coin: number) {
        let temp = UStringHelper.formatPlayerCoin(coin / 100);
        this._players[index.toString()]["coin"].string = temp;

        if (index == 0) {//自己更新
            this._myscore = coin;
        }
    }

    /**
     * 设置qzbs显示
     * @param index 座位索引
     * @param b 是否显示
     */
    setQZBSActive(index: number, b: boolean) {
        if (!b) {
            this._players[index.toString()].qzbs.node.stopAllActions();
        }

        this._players[index.toString()].qzbs.node.active = b;
    }

    /**气泡背景 */
    setQPActive(index: number, b: boolean) {
        if (!b) {
            this._players[index.toString()].qp.stopAllActions();
        }
        this._players[index.toString()].qp.active = b;
    }

    /**
     * 设置xzbs
     * @param index 座位索引
     * @param b 是否显示
     */
    setXZBSActive(index: number, b: boolean) {
        if (!b) {
            this._players[index.toString()].xzbs.node.stopAllActions();
        }
        this._players[index.toString()].xzbs.node.active = b;
    }
    /**
     * 抢多少倍
     * @param index 座位索引
     * @param jettonMultiple 倍数
     */
    setQZBSJettonMultiple(index: number, jettonMultiple: number) {
        var str = "";//+ "b"

        if (jettonMultiple == 0) {
            str = "n"; // n:不抢  
        }
        else {
            str = "qx" + jettonMultiple.toString();
        }

        this._players[index.toString()].qzbs.string = str;
    }
    /**
     * 下注多少倍
     * @param index 座位索引
     * @param jettonMultiple 倍数
     */
    setXZBSJettonMultiple(index: number, jettonMultiple: number) {
        let str = "x" + jettonMultiple.toString();//+"b"
        this._players[index.toString()].xzbs.string = str;
    }
    /**抢庄下注冒泡动画 */
    private setQPAction(index: number, tag: string, isAction: boolean = true) {

        if (isAction) {
            var strNode = (tag == "qz") ? (this._players[index.toString()].qzbs.node) : (this._players[index.toString()].xzbs.node);
            this.doPopAction(strNode, this._qzPosY[index], index);

            var qpNode = this._players[index.toString()].qp;
            // this.doPopAction(qpNode, this._qzQpPosY[index], index);

            if (index == 3 || index == 0) {
                this.doPopAction(qpNode, this._qzQpPosY[index], index, -1);
            } else {
                this.doPopAction(qpNode, this._qzQpPosY[index], index, 1);
            }
        }
    }
    /**发牌冒泡动画 */
    private setFPQPAction(index: number, isAction: boolean = true) {
        if (index == 0) return;

        var strNode = (this._players[index.toString()].qzbs.node);
        var strNode1 = (this._players[index.toString()].xzbs.node);

        var qpNode = this._players[index.toString()].qp;



        if (isAction) {

            this.doPopAction(strNode, this._fpPosY[index], index, 1, false);
            this.doPopAction(strNode1, this._fpPosY[index], index, 1, false);


            if (index == 3) {
                this.doPopAction(qpNode, this._fpQpPosY[index], index, -1, false);
            } else {
                this.doPopAction(qpNode, this._fpQpPosY[index], index, 1, false);
            }
        }
        else {
            var str_pos = new cc.Vec2(strNode.getPosition().x, this._fpPosY[index]);
            var str_pos1 = new cc.Vec2(strNode1.getPosition().x, this._fpPosY[index]);
            var fp_pos = new cc.Vec2(qpNode.getPosition().x, this._fpQpPosY[index]);

            strNode.stopAllActions();
            strNode1.stopAllActions();
            qpNode.stopAllActions();

            if (index == 3) {

                strNode.setScale(1, 1);
                strNode1.setScale(1, 1);
                qpNode.setScale(-1, 1);
            }
            else {
                strNode.setScale(1, 1);
                strNode1.setScale(1, 1);
                qpNode.setScale(1, 1);
            }
            strNode.setPosition(str_pos);
            strNode1.setPosition(str_pos1);
            qpNode.setPosition(fp_pos);
        }
    }

    /**冒泡动画 */
    private doPopAction(node: cc.Node, targetPosY: number, index: number, scalex = 1, isrest: boolean = true, time = 0.2) {
        var pos = new cc.Vec2(node.getPosition().x, targetPosY);
        node.stopAllActions();
        // var action = cc.moveTo(time,pos);
        if (isrest) {
            node.setScale(0, 0);

            if (index == 2) {
                // node.setPosition(cc.v2(node.getPosition().x, (targetPosY + 50)));
                node.setPosition(pos);

            } else {
                node.setPosition(cc.v2(node.getPosition().x, (targetPosY - 50)));
            }

            node.runAction(cc.sequence(cc.scaleTo(0.2, scalex, 1), cc.moveTo(0.5, pos)));

        }
        else {

            node.setScale(scalex, 1);
            node.runAction(cc.moveTo(0.3, pos));
        }
        // node.runAction(action);
    }

    private resetPopPos() {
        for (let i = 0; i < this._maxplayer; i++) {
            let node = this._players[i.toString()].qzbs.node;
            let node1 = this._players[i.toString()].xzbs.node;
            let node2 = this._players[i.toString()].qp;

            let offest = -50;
            if (i == 2) {
                // offest = 50;

                node.setPosition(cc.v2(node.getPosition().x, (this._fpPosY[i])));
                node1.setPosition(cc.v2(node1.getPosition().x, (this._fpPosY[i])));
                node2.setPosition(cc.v2(node2.getPosition().x, (this._fpQpPosY[i])));
                continue;
            }

            node.setPosition(cc.v2(node.getPosition().x, (this._qzPosY[i] + offest)));
            node1.setPosition(cc.v2(node1.getPosition().x, (this._qzPosY[i] + offest)));
            node2.setPosition(cc.v2(node2.getPosition().x, (this._qzQpPosY[i] + offest)));
        }
    }

    /**
     * 设置玩家节点激活状态
     * @param index 座位显示
     * @param b 是否显示
     */
    setPlayerActiveByIndex(index: number, b: boolean) {
        // this._players[index.toString()]["touxiang"].node.active = b;
        // this._players[index.toString()]["nickname"].node.active = b;
        // this._players[index.toString()]["coin"].node.active = b;
        this._players[index.toString()]["node"].active = b;
    }


    updateMyRoleInfo(data: any) {
        // cc.log("data:" + data);
        if (data != null) {
            let headId = data.headId;
            let coin = data.coin;
            let nickname = data.nickname;
            if (headId != null) {
                this.setPlayerIcon(0, headId,data.headImgUrl);
            }
            if (coin != null) {
                this.setPlayerCoin(0, coin);
            }

            if (nickname != null) {
                this.setPlayerNickName(0, nickname);
            }
            this.setPlayerVip(0, data.viplv);
            this.setPlayerHeadBox(0, data.headboxId);
        }
    }

    /**
     * 更新房间玩家信息
     * @param data 
     */
    private onUpdatePlayers(data: any) {
        if (data == null) return;

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];

                // let chairId = AppGame.ins.qzjhModel.getUISeatId(element.chairId);
                // if (element.playStatus == 1 && chairId != null) {
                //     this.setPlayerNickName(chairId, element.userId);//element.nickName
                //     this.setPlayerCoin(chairId, element.score);
                //     this.setPlayerIcon(chairId, element.headId);
                //     this.setPlayerActiveByIndex(chairId, true);
                //     this.setPlayerHeadBox(chairId, element.headboxId);
                //     this.setPlayerVip(chairId, element.vipLevel);
                // }
                let chairId = AppGame.ins.qzjhModel.getUISeatId(element.chairId);
                if (!element.isExit && element.playStatus >= 0 && chairId != null) {
                    this.setPlayerNickName(chairId, ""+element.userId);//element.nickName
                    if(chairId == 0){

                    }else{
                        this.setPlayerCoin(chairId, element.score);
                    }
                    this.setPlayerIcon(chairId, element.headId,element.headImgUrl);
                    this.setPlayerActiveByIndex(chairId, true);
                    this.setPlayerHeadBox(chairId, element.headboxId);
                    this.setPlayerVip(chairId, element.vipLevel);
                    // if(element.vipLevel == 0){
                    //     this.node.children[chairId].getChildByName("vip_03").active = false;
                    //     this.node.children[chairId].getChildByName("vip").active = false;
                    // }
                    this.setPlayerWsz(chairId,element.playStatus == 0)
                    //UDebug.log("111111111111更新房间玩家信息", element)
                }else{
                    this.setPlayerActiveByIndex(chairId, false);
                    delete data[key];
                }
            }
        }
    }

    /******** 协议 event ********/

    /**
     * 某个玩家的下注结果
     * @param data 
     */
    private onAddScoreResult(data) {
        // cc.log(data);

        //#region  test 0-3 
        // AppGame.ins.qzjhModel.sMeChairId = 0;
        //#endregion

        let wAddJettonUser = data.addJettonUser;
        let cbJettonMultiple = data.jettonMultiple;

        let chairId = AppGame.ins.qzjhModel.getUISeatId(wAddJettonUser);

        this.setQZBSActive(chairId, false);

        this.setXZBSActive(chairId, true);
        this.setQPActive(chairId, true);
        this.setQPAction(chairId, "xz");

        this.setXZBSJettonMultiple(chairId, cbJettonMultiple);



    }

    /**
     * 某个玩家的叫庄结果
     * @param data 
     */
    private onCallBanker(data) {
        UDebug.Log("callbanker:" + JSON.stringify(data));

        let wCallBankerUser = data.callBankerUser;
        let cbCallMultiple = data.callMultiple;

        let chairId = AppGame.ins.qzjhModel.getUISeatId(wCallBankerUser);

        this.setQZBSActive(chairId, true);
        this.setQPActive(chairId, true);
        this.setQZBSJettonMultiple(chairId, cbCallMultiple);
        this.setQPAction(chairId, "qz");

        var pos = AppGame.ins.qzjhModel.getPlayerSexByRealSeat(wCallBankerUser);
        if (cbCallMultiple > 0) {
            UQZJHScene.ins.getMusic.playQiangZhung(true, pos);
        }
        else {
            UQZJHScene.ins.getMusic.playQiangZhung(false, pos);
        }


    }



    /************ 自定义 event ***************/

    /**
     * 选庄结束 隐藏不是庄家的 抢庄字体 改成下注时在隐藏
     * @param data 
     */
    private onXuanZhuangEnd(data) {
        // var bankindex = AppGame.ins.qzjhModel.gBankerIndex;//data.banker;
        // var index = AppGame.ins.qzjhModel.getUISeatId(bankindex);

        // if (index != null) {
        //     for (let i = 0; i < 4; i++) {
        //         if (index != i) {
        //             this.setQZBSActive(i, false);
        //         }
        //     }
        // }
    }
    /**
     * 分数动画滚动播放完后的 结算分数赋值事件
     * @param data 
     */
    private onTotalScore(data) {
        var seatindex = data.seatindex;
        var totalscore = data.totalscore;

        if (seatindex != null && totalscore != null) {
            this.setPlayerCoin(seatindex, totalscore);
        }
    }

    //////////////////////////////////////////////

    getTestEvent() {
        this.testSetAllPlayerInfo();
    }

    /**测试 */
    testSetAllPlayerInfo() {
        // this.setPlayerIcon(0, 2);
        // this.setPlayerIcon(1, 11);
        // this.setPlayerIcon(2, 14);
        // this.setPlayerIcon(3, 15);

        this.setPlayerNickName(0, "抢庄一哥");
        this.setPlayerNickName(1, "抢庄一姐");
        this.setPlayerNickName(2, "抢庄二姐");
        this.setPlayerNickName(3, "抢庄三姐");

        this.setPlayerCoin(0, 9999.99126126415);
        this.setPlayerCoin(1, 1234.5);
        this.setPlayerCoin(2, 123441563666666.66);
        this.setPlayerCoin(3, 555);

    }
}
