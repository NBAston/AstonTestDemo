import MKPQZNNModel_hy, { QZNN_SELF_SEAT } from "./model/MKPQZNNModel_hy";
import UKPQZNNHelper_hy from "./UKPQZNNHelper_hy";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UKPQZNNScene_hy from "./UKPQZNNScene_hy";
import AppGame from "../../public/base/AppGame";
import UResManager from "../../common/base/UResManager";
import { EIconType } from "../../common/base/UAllenum";
import UStringHelper from "../../common/utility/UStringHelper";
import UDebug from "../../common/utility/UDebug";
import { COIN_RATE } from "../../config/cfg_common";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";

const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:各玩家 view
 */
@ccclass
export default class VKPQZNNPlayersNode_hy extends cc.Component {

    private _players = {
        "0": {
            touxiang: null,
            nickname: null,
            coin: null,
            node: null,
            qzbs: null,
            xzbs: null,
            headbox: null,
            viplv: null,
            wsz: null,
            readyOk: null,
            chat: null,
            userId: null,
            prop: null,
            chatProp: null,
        },
        "1": {
            touxiang: null,
            nickname: null,
            coin: null,
            node: null,
            qzbs: null,
            xzbs: null,
            headbox: null,
            viplv: null,
            wsz: null,
            readyOk: null,
            chat: null,
            userId: null,
            prop: null,
            chatProp: null,
        },
        "2": {
            touxiang: null,
            nickname: null,
            coin: null,
            node: null,
            qzbs: null,
            xzbs: null,
            headbox: null,
            viplv: null,
            wsz: null,
            readyOk: null,
            chat: null,
            userId: null,
            prop: null,
            chatProp: null,
        },
        "3": {
            touxiang: null,
            nickname: null,
            coin: null,
            node: null,
            qzbs: null,
            xzbs: null,
            headbox: null,
            viplv: null,
            wsz: null,
            readyOk: null,
            chat: null,
            userId: null,
            prop: null,
            chatProp: null,
        },
    };

    @property(cc.Prefab) emojItem: cc.Prefab = null;
    @property(cc.Prefab) textItem: cc.Prefab = null;


    /**抢庄下注时的Y位置 qzbs/xzbs*/
    private _qzPosY: Array<number> = [62, 87.5, -90.5, 87.5];//[62, 57.3, -53, 57.3];
    /**发牌时的Y位置 qzbs/xzbs*/
    private _fpPosY: Array<number> = [117, 117, 117, 117];//84.1

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
        // MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_UPDATE_ROLEINFO, this.updateMyRoleInfo, this);

        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, this.onGamestart, this);
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER, this.onCallBanker, this);
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);


        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_XUAN_ZHUANG_END_EVENT, this.onXuanZhuangEnd, this);
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_TOTALSCORE_EVENT, this.onTotalScore, this);

        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_SEND_CARD, this.onSendCard, this);

        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_RESET_SCENE, this.onResetScene, this);
        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SCENE_OPEN_NOT_SEND_CARD, this.openNotSendCard, this);

        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_CHAT_MESSAGE, this.onChatMessage, this);

        MKPQZNNModel_hy.ins.on(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_END, this.onGameSceneEnd, this);

    }

    private removeEvent() {
        // MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_UPDATE_ROLEINFO, this.updateMyRoleInfo, this);

        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_GAME_START, this.onGamestart, this);
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_CALL_BANKER, this.onCallBanker, this);
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);

        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SUB_S_SEND_CARD, this.onSendCard, this);

        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_XUAN_ZHUANG_END_EVENT, this.onXuanZhuangEnd, this);
        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_TOTALSCORE_EVENT, this.onTotalScore, this);

        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);

        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_RESET_SCENE, this.onResetScene, this);

        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SCENE_OPEN_NOT_SEND_CARD, this.openNotSendCard, this);

        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_CHAT_MESSAGE, this.onChatMessage, this);

        MKPQZNNModel_hy.ins.off(UKPQZNNHelper_hy.QZNN_SELF_EVENT.QZNN_SC_GAMESCENE_END, this.onGameSceneEnd, this);

    }

    onDestroy() {
        this.removeEvent();
    }

    init() {
        this._maxplayer = MKPQZNNModel_hy.ins.maxPlayer;
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
                UNodeHelper.getComponent(this.node, path + "/Label_xzbs/Label_qzbs", cc.Label);

            this._players[i.toString()].xzbs =
                UNodeHelper.getComponent(this.node, path + "/Label_xzbs", cc.Label);


            this._players[i.toString()].viplv =
                UNodeHelper.getComponent(this.node, path + "/vip/vip", cc.Label);

            this._players[i.toString()].headbox =
                UNodeHelper.getComponent(this.node, path + "/frame_0", cc.Sprite);

            this._players[i.toString()].wsz =
                UNodeHelper.find(this.node, path + "/outNode/OutSp");

            this._players[i.toString()].readyOk =
                UNodeHelper.find(this.node, path + "/readyOk");

            this._players[i.toString()].chat =
                UNodeHelper.find(this.node, path + "/chat");

            this._players[i.toString()].prop =
                UNodeHelper.find(this.node, path + "/prop");

            this._players[i.toString()].chatProp =
                UNodeHelper.find(this.node, path + "/chatProp");

        }
        // cc.log(this._players);

        //一进去,除自己之外都隐藏
        for (let i = 0; i < this._maxplayer; i++) {

            this.setQZ_XZActive(i, false);
            // if (i != 0)
            // this.setPlayerActiveByIndex(i, false);
        }
    }

    /**收到聊天消息 */
    onChatMessage(data: any) {
        for (let index = 0; index < this._maxplayer; index++) {
            const playerItem = this._players[index];
            if (playerItem.userId == data.sendUserId) {
                playerItem.chat.removeAllChildren();
                let item = null;
                if (data.faceId != -1) {
                    item = cc.instantiate(this.emojItem);
                    let emojSp = UNodeHelper.getComponent(item, "emoj_item_img", cc.Sprite);
                    let emojUrl = "common/texture/game_chat/game_chat_emoj/game_emoj_" + data.faceId;
                    UResManager.loadUrl(emojUrl, emojSp);
                    if (index == 3) {
                        item.scaleX = -1;
                        emojSp.node.scaleX = -1.25;
                    } else {
                        item.scaleX = 1;
                        emojSp.node.scaleX = 1.25;
                    }
                } else if (data.message.length > 0) {
                    item = cc.instantiate(this.textItem);
                    item.getComponent("VGameChatItem").setChatItemContent(data.message, index == 3 ? true : false);
                }
                item.setPosition(cc.v2(0, 0));
                this.scheduleOnce(() => {
                    item.active = false;
                }, 2.0)
                playerItem.chat.addChild(item);
                break;
            } else {
                continue;
            }
        }
    }

    /**
     * 重置场景
     * @param data 
     */
    private onResetScene(data?: any) {

        for (let i = 0; i < this._maxplayer; i++) {
            this.setQZ_XZActive(i, false);
            if (i != QZNN_SELF_SEAT) {
                this._players[i.toString()].node.active = false;
            }
            else//自己 就更新信息
            {
                // var myscore = UKPQZNNScene_hy.ins.myScore;
                // if (myscore == 0) {

                //     if (this._myscore != null && this._myscore != -1) {
                //         myscore = this._myscore;
                //     } else {
                //         myscore = AppGame.ins.roleModel.score;
                //     }

                // }

                // var myInfo = {
                //     coin: myscore,
                //     headId: AppGame.ins.roleModel.headId,
                //     nickname: AppGame.ins.roleModel.useId,//.nickName
                //     headboxId: AppGame.ins.roleModel.headboxId,
                //     viplv: AppGame.ins.roleModel.vipLevel
                // }
                // this.updateMyRoleInfo(myInfo);
            }
        }
        this.resetPopPos();
        MKPQZNNModel_hy.ins.updateBattlePlayer();
        //         if (element.seatId == 0) {
        //             element.showbaseInfo(MSGModel.ins.getshowselfinfo());
        //         } else
        //             element.free();
    }

    onGameSceneEnd(data: any) {
        let user = data.user;
        if (user.userId == AppGame.ins.roleModel.useId) {
            this.setPlayerCoin(0, user.score);
        }
    }

    onGamestart(data: any) {
        var players = MKPQZNNModel_hy.ins.gBattlePlayer;
        this._myscore = -1;
        if (players != null) {
            for (const key in players) {
                if (players.hasOwnProperty(key)) {
                    const element = players[key];
                    var uipos = MKPQZNNModel_hy.ins.getUISeatId(element.chairId)
                    if ((element.playStatus == 5 || element.playStatus == 6) && uipos != null) {
                        this.setPlayerActiveByIndex(uipos, true);
                    }
                }
            }
        }

        for (let i = 0; i < this._maxplayer; i++) {
            this.setQZ_XZActive(i, false);
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

    setPlayerWsz(index: number, isShow: boolean, text: string = ''): void {
        this._players[index.toString()].wsz.active = isShow;
        let path = "seat" + index.toString();
        let tipLab = UNodeHelper.getComponent(this.node, path + "/outNode/tipLab", cc.Label);
        tipLab.string = text;
    }
    /**绑定道具节点userId */
    setPlayerPropUserId(index: number, userId: number) {
        this._players[index.toString()].prop.getComponent(GamePropManager).bindUserId(userId);
        this._players[index.toString()].chatProp.getComponent(VGameChatPropManager).bindUserId(userId);
    }

    /**关闭对应道具面板 */
    closePropPanelByUserId(index: number, userId: number) {
        this._players[index.toString()].prop.getComponent(GamePropManager).closePropPanelByUserId(userId);
    }

    /**通过userId获取道具节点 */
    getPropNodeByUserId(userId: number, callback: any = null) {
        for (let i = 0; i < this._maxplayer; i++) {
            let player = this._players[i.toString()];
            let bindUserId = player.prop.getComponent(GamePropManager).getBindUserId();
            if (bindUserId && (userId == bindUserId)) {
                callback && callback(player.prop);
            }
        }
    }

    /**通过userId获取聊天节点 */
    getChatPropNodeByUserId(userId: number, callback: any = null) {
        for (let i = 0; i < this._maxplayer; i++) {
            let player = this._players[i.toString()];
            let bindUserId = player.chatProp.getComponent(VGameChatPropManager).getBindUserId();
            if (bindUserId && (userId == bindUserId)) {
                callback && callback(player.chatProp);
            }
        }
    }

    /**
     * 设置准备、旁观
     * @param chairId 真实位置
     * @param showLookOn 旁观
     * @param showReady 准备
     */
    setReadyAndLookOn(chairId: number, showLookOn: boolean, showReady: boolean, showNextLookOn: boolean = false) {
        if (chairId == MKPQZNNModel_hy.ins.selfRealSeatId) {
            UKPQZNNScene_hy.ins.extend.showLookOn(showLookOn);
            UKPQZNNScene_hy.ins.extend.showReady(showReady);
            UKPQZNNScene_hy.ins.extend.showLookOnNext(showNextLookOn);
        }
    }

    /**
     * 设置玩家头像
     * @param index 
     * @param iconIndex 
     */
    setPlayerIcon(index: number, iconIndex: number, headImgUrl: string) {
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

        UResManager.load(iconIndex, EIconType.Head, this._players[index.toString()]["touxiang"], headImgUrl);
    }

    /**
     * 设置玩家昵称
     * @param index 座位索引
     * @param name 名字
     */
    setPlayerNickName(index: number, name: string) {
        // this._players[index.toString()]["nickname"].string = name;
        // if (index != 0)
        //     this._players[index.toString()]["nickname"].string = name.toString(); //UStringHelper.coverName(name.toString());
        // else
        this._players[index.toString()]["nickname"].string = name.toString();
    }

    /**
     * 设置玩家金币
     * @param index 座位索引
     * @param coin 金币数
     */
    setPlayerCoin(index: number, coin: number) {
        // let temp = UStringHelper.formatPlayerCoin(coin / COIN_RATE);
        // this._players[index.toString()]["coin"].string = temp;
        let temp = coin / 100;
        this._players[index.toString()]["coin"].string = temp;
        if (index == 0) {//自己更新
            this._myscore = coin;
        }
    }

    /**
     * @description 设置抢庄下注提示显示隐藏
     * @param index 
     * @param b 
     */
    setQZ_XZActive(index: number, b: boolean) {
        if (!b) {
            this._players[index.toString()].xzbs.node.stopAllActions();
        };
        this._players[index.toString()].xzbs.node.active = b;
    };

    /**
     * 抢多少倍
     * @param index 座位索引
     * @param jettonMultiple 倍数
     */
    setQZBSJettonMultiple(index: number, jettonMultiple: number) {
        this._players[index.toString()].qzbs.string = "";
        this._players[index.toString()].xzbs.string = "";
        var str = "";//+ "b"
        if (jettonMultiple == null) return;
        if (jettonMultiple == 0) {
            str = "不抢"; // n:不抢
            this._players[index.toString()].qzbs.string = str;
        }
        else {
            str = "抢x" + jettonMultiple.toString() + "倍";
            this._players[index.toString()].xzbs.string = str;
        }
    }
    /**
     * 下注多少倍
     * @param index 座位索引
     * @param jettonMultiple 倍数
     */
    setXZBSJettonMultiple(index: number, jettonMultiple: number) {
        this._players[index.toString()].qzbs.string = "";
        this._players[index.toString()].xzbs.string = "";
        let str = "x" + jettonMultiple.toString();//+"b"
        this._players[index.toString()].xzbs.string = str;
    }
    /**抢庄下注冒泡动画 */
    private setQPAction(index: number, isAction: boolean = true) {

        if (isAction) {
            var strNode = this._players[index.toString()].xzbs.node;
            this.doPopAction(strNode, this._qzPosY[index], index);
        }
    }
    /**发牌冒泡动画 */
    private setFPQPAction(index: number, isAction: boolean = true) {
        if (index == 0) return;

        var strNode1 = (this._players[index.toString()].xzbs.node);

        if (isAction) {

            this.doPopAction(strNode1, this._fpPosY[index], index, 1, false);
        }
        else {
            var str_pos1 = new cc.Vec2(strNode1.getPosition().x, this._fpPosY[index]);

            strNode1.stopAllActions();

            if (index == 3) {

                strNode1.setScale(1, 1);
            }
            else {
                strNode1.setScale(1, 1);
            }
            strNode1.setPosition(str_pos1);
        }
    }

    /**冒泡动画 */
    private doPopAction(node: cc.Node, targetPosY: number, index: number, scalex = 1, isrest: boolean = true, time = 0.2) {
        var pos = new cc.Vec2(node.getPosition().x, 117);
        node.stopAllActions();
        if (isrest) {
            node.setScale(0, 0);
            node.setPosition(cc.v2(node.getPosition().x, (117 - 50)));
            node.runAction(cc.sequence(cc.scaleTo(0.2, scalex, 1), cc.moveTo(0.5, pos)));
        }
        else {
            node.setScale(scalex, 1);
            node.runAction(cc.moveTo(0.3, pos));
        }
    }

    private resetPopPos() {
        for (let i = 0; i < this._maxplayer; i++) {
            let node1 = this._players[i.toString()].xzbs.node;

            let offest = -50;
            if (i == 2) {
                // offest = 50;
                node1.setPosition(cc.v2(node1.getPosition().x, (this._fpPosY[i])));
                continue;
            }
            node1.setPosition(cc.v2(node1.getPosition().x, (this._qzPosY[i] + offest)));
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
            let headImgUrl = data.headImgUrl;
            if (headId != null) {
                this.setPlayerIcon(0, headId, headImgUrl);
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
        // UDebug.log("更新房间玩家信息 => ", JSON.stringify(data))
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];
                let chairId = MKPQZNNModel_hy.ins.getUISeatId(element.chairId);
                if (!element.isExit && element.playStatus >= 0 && chairId != null) {
                    this._players[chairId]["userId"] = element.userId;
                    this.setPlayerNickName(chairId, "" + element.nickName);//element.nickName
                    this.setPlayerCoin(chairId, element.score);
                    this.setPlayerIcon(chairId, element.headId, element.headImgUrl);
                    this.setPlayerActiveByIndex(chairId, true);
                    this.setPlayerHeadBox(chairId, element.headboxId);
                    this.setPlayerVip(chairId, element.vipLevel);
                    this.setPlayerPropUserId(chairId, element.userId);
                    // if (element.vipLevel == 0) {
                    //     this.node.children[chairId].getChildByName("vip_03").active = false;
                    //     this.node.children[chairId].getChildByName("vip").active = false;
                    // }
                    UDebug.log("更新玩家chairId=>", chairId, "playStatus=>", element.playStatus)
                    this._players[chairId].readyOk.active = false;
                    switch (element.playStatus) {
                        case 3: //坐下
                            this.setPlayerWsz(chairId, true)
                            this.setReadyAndLookOn(element.chairId, true, true);
                            break;
                        case 4: //准备
                            this.setPlayerWsz(chairId, false, '')
                            this.setReadyAndLookOn(element.chairId, true, false);
                            this._players[chairId].readyOk.active = true;
                            break;
                        case 5: //游戏中
                            this.setPlayerWsz(chairId, false);
                            this.setReadyAndLookOn(element.chairId, true, false, true);
                            UKPQZNNScene_hy.ins.extend.showInvite(false);
                            break;
                        case 6: //离线
                            this.setPlayerWsz(chairId, true, '离线')
                            this.setReadyAndLookOn(element.chairId, false, false);
                            break;
                        case 7: //旁观中
                            this.setPlayerWsz(chairId, true, '旁观中')
                            this.setReadyAndLookOn(element.chairId, false, true);
                            break;
                        default:
                            this.setPlayerWsz(chairId, false);
                            this.setReadyAndLookOn(element.chairId, true, true);
                            break;
                    }
                } else {
                    this.setPlayerActiveByIndex(chairId, false);
                    this.closePropPanelByUserId(chairId, element.userId);
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
        // MKPQZNNModel_hy.ins.sMeChairId = 0;
        //#endregion

        let wAddJettonUser = data.addJettonUser;
        let cbJettonMultiple = data.jettonMultiple;

        let chairId = MKPQZNNModel_hy.ins.getUISeatId(wAddJettonUser);
        this.setQZ_XZActive(chairId, true);
        this.setQPAction(chairId);

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

        if ((wCallBankerUser > 3 || wCallBankerUser < 0)) {
            return
        }

        let chairId = MKPQZNNModel_hy.ins.getUISeatId(wCallBankerUser);

        this.setQZ_XZActive(chairId, true);
        this.setQZBSJettonMultiple(chairId, cbCallMultiple);
        this.setQPAction(chairId);

        var pos = MKPQZNNModel_hy.ins.getPlayerSexByRealSeat(wCallBankerUser);
        if (cbCallMultiple > 0) {
            UKPQZNNScene_hy.ins.getMusic.playQiangZhung(true, pos);
        }
        else {
            UKPQZNNScene_hy.ins.getMusic.playQiangZhung(false, pos);
        }


    }



    /************ 自定义 event ***************/

    /**
     * 选庄结束 隐藏不是庄家的 抢庄字体 改成下注时在隐藏
     * @param data 
     */
    private onXuanZhuangEnd(data) {
        // var bankindex = MKPQZNNModel_hy.ins.gBankerIndex;//data.banker;
        // var index = MKPQZNNModel_hy.ins.getUISeatId(bankindex);
        // //不抢，随机选庄后 变为抢1
        // if(this._players && this._players[index.toString()]  && this._players[index.toString()].qzbs
        //     && this._players[index.toString()].qzbs.string == "n"){
        //     this.setQZBSJettonMultiple(index, 1);
        // }
        // 以上功能去掉


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

}
