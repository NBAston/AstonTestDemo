import MTBNNModel_hy, { TBNN_SELF_SEAT } from "./model/MTBNNModel_hy";
import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "../../public/base/AppGame";
import UResManager from "../../common/base/UResManager";
import { EIconType } from "../../common/base/UAllenum";
import UStringHelper from "../../common/utility/UStringHelper";
import UDebug from "../../common/utility/UDebug";
import { FTbnn } from "../../common/cmd/proto";
import UTBNNHelper_hy from "./UTBNNHelper_hy";
import UTBNNScene_hy from "./UTBNNScene_hy";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";


const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:各玩家 view
 */
@ccclass
export default class VTBNNPlayersNode_hy extends cc.Component {

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
            readyOk: null,
            chat: null,
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
            qp: null,
            headbox: null,
            viplv: null,
            wsz: null,
            readyOk: null,
            chat: null,
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
            qp: null,
            headbox: null,
            viplv: null,
            wsz: null,
            readyOk: null,
            chat: null,
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
            qp: null,
            headbox: null,
            viplv: null,
            wsz: null,
            readyOk: null,
            chat: null,
            prop: null,
            chatProp: null,
        },
    };

    @property(cc.Prefab) emojItem: cc.Prefab = null;
    @property(cc.Prefab) textItem: cc.Prefab = null;

    /**抢庄下注时的Y位置 qzbs/xzbs*/
    private _qzPosY: Array<number> = [125, 125, 125, 125];
    /**发牌时的Y位置 qzbs/xzbs*/
    private _fpPosY: Array<number> = [125, 125, 125, 125];//84.1
    /**抢庄下注时的Y位置 qp*/
    private _qzQpPosY: Array<number> = [125, 125, 125, 125];//-63.8
    /**发牌时的Y位置 qp*/
    private _fpQpPosY: Array<number> = [125, 125, 125, 125]; // -101.3


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
        // MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_UPDATE_ROLEINFO, this.updateMyRoleInfo, this);

        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_GAME_START, this.onGamestart, this);
        // MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_CALL_BANKER, this.onCallBanker, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);


        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_XUAN_ZHUANG_END_EVENT, this.onXuanZhuangEnd, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_TOTALSCORE_EVENT, this.onTotalScore, this);

        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_SEND_CARD, this.onSendCard, this);

        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_RESET_SCENE, this.onResetScene, this);
        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SCENE_OPEN_NOT_SEND_CARD, this.openNotSendCard, this);

        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_CHAT_MESSAGE, this.onChatMessage, this);

        MTBNNModel_hy.ins.on(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_GAMESCENE_END, this.onGameSceneEnd, this);

    }

    private removeEvent() {
        // MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_UPDATE_ROLEINFO, this.updateMyRoleInfo, this);

        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_GAME_START, this.onGamestart, this);
        // MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_CALL_BANKER, this.onCallBanker, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);

        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SUB_S_SEND_CARD, this.onSendCard, this);

        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_XUAN_ZHUANG_END_EVENT, this.onXuanZhuangEnd, this);
        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_TOTALSCORE_EVENT, this.onTotalScore, this);

        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);

        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_RESET_SCENE, this.onResetScene, this);

        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SCENE_OPEN_NOT_SEND_CARD, this.openNotSendCard, this);

        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_CHAT_MESSAGE, this.onChatMessage, this);

        MTBNNModel_hy.ins.off(UTBNNHelper_hy.TBNN_SELF_EVENT.TBNN_SC_GAMESCENE_END, this.onGameSceneEnd, this);

    }

    onDestroy() {
        this.removeEvent();
    }

    init() {
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
            this.setTBBSActive(i, false);
            this.setXZBSActive(i, false);
            this.setQPActive(i, false);
            // if (i != 0)
            // this.setPlayerActiveByIndex(i, false);
        }
    }

    /**收到聊天消息 */
    onChatMessage(data: any) {
        for (let index = 0; index < this._maxplayer; index++) {
            const playerItem = this._players[index];
            if(playerItem.nickname.string == data.sendUserId) {
                playerItem.chat.removeAllChildren();
                let item = null;
                if(data.faceId != -1) {
                    item = cc.instantiate(this.emojItem);
                    let emojSp = UNodeHelper.getComponent(item, "emoj_item_img", cc.Sprite);
                    let emojUrl = "common/texture/game_chat/game_chat_emoj/game_emoj_"+data.faceId;
                    UResManager.loadUrl(emojUrl, emojSp);
                    if(index == 3) {
                        item.scaleX = -1;
                        emojSp.node.scaleX = -1.25;
                    } else {
                        item.scaleX = 1;
                        emojSp.node.scaleX = 1.25;
                    }
                } else if(data.message.length > 0) {
                    item = cc.instantiate(this.textItem);
                    item.getComponent("VGameChatItem").setChatItemContent(data.message, index == 3?true:false);
                }
                item.setPosition(cc.v2(0,0));
                this.scheduleOnce(()=>{
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
            this.setTBBSActive(i, false);
            this.setXZBSActive(i, false);
            this.setQPActive(i, false);

            if (i != TBNN_SELF_SEAT) {
                this._players[i.toString()].node.active = false;
            }
            else//自己 就更新信息
            {
                // var myscore = UTBNNScene_hy.ins.myScore;
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
        MTBNNModel_hy.ins.updateBattlePlayer();
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
        var players = MTBNNModel_hy.ins.gBattlePlayer;
        this._myscore = -1;
        if (players != null) {
            for (const key in players) {
                if (players.hasOwnProperty(key)) {
                    const element = players[key];
                    var uipos = MTBNNModel_hy.ins.getUISeatId(element.chairId)
                    if ((element.playStatus == 5 || element.playStatus == 6) && uipos != null) {
                        this.setPlayerActiveByIndex(uipos, true);
                    }
                }
            }
        }

        for (let i = 0; i < this._maxplayer; i++) {
            this.setTBBSActive(i, false);
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
        if (chairId == MTBNNModel_hy.ins.selfRealSeatId) {
            UTBNNScene_hy.ins.extend.showLookOn(showLookOn);
            UTBNNScene_hy.ins.extend.showReady(showReady);
            UTBNNScene_hy.ins.extend.showLookOnNext(showNextLookOn);
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
        if (index != 0)
            this._players[index.toString()]["nickname"].string = name.toString(); //UStringHelper.coverName(name.toString());
        else
            this._players[index.toString()]["nickname"].string = name.toString();
    }

    /**
     * 设置玩家金币
     * @param index 座位索引
     * @param coin 金币数
     */
    setPlayerCoin(index: number, coin: number) {
        let temp = coin / 100;
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
    setTBBSActive(index: number, b: boolean) {
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
        // this._players[index.toString()].qp.active = b;
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
    setTBBSJettonMultiple(index: number, jettonMultiple: number) {
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
        // cc.log('index  => ', index, '  tag   => ', tag, 'isAction  => ', isAction)
        if (isAction) {
            var strNode = (tag == "qz") ? (this._players[index.toString()].qzbs.node) : (this._players[index.toString()].xzbs.node);
            this.doPopAction(strNode, this._qzPosY[index], index);
            // cc.log('this._qzPosY[index]  => ', this._qzPosY[index])
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
        // UDebug.log(index + ' 冒泡动画  targetPosY => ', targetPosY, ' isrest => ', isrest)
        var pos = new cc.Vec2(node.getPosition().x, targetPosY);
        node.stopAllActions();
        // var action = cc.moveTo(time,pos);
        if (isrest) {
            node.setScale(0, 0);

            // if (index == 2) {
            //     // node.setPosition(cc.v2(node.getPosition().x, (targetPosY + 50)));
            //     node.setPosition(pos);

            // } else {
            //     node.setPosition(cc.v2(node.getPosition().x, (targetPosY - 50)));
            // }

            node.setPosition(cc.v2(node.getPosition().x, (targetPosY - 50)));

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
                // node1.setPosition(cc.v2(node1.getPosition().x, (this._fpPosY[i])));
                node1.setPosition(cc.v2(node1.getPosition().x, (this._qzPosY[i] + offest)));
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

        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key];
                // let chairId = MTBNNModel_hy.ins.getUISeatId(element.chairId);
                // if (element.playStatus == 5 && chairId != null) {
                //     this.setPlayerNickName(chairId, element.userId);//element.nickName
                //     this.setPlayerCoin(chairId, element.score);
                //     this.setPlayerIcon(chairId, element.headId);

                //     this.setPlayerActiveByIndex(chairId, true);
                //     this.setPlayerVip(chairId, element.vipLevel);
                //     this.setPlayerHeadBox(chairId, element.headboxId);
                // }
                let chairId = MTBNNModel_hy.ins.getUISeatId(element.chairId);
                if (!element.isExit && element.playStatus >= 0 && chairId != null) {
                    this.setPlayerNickName(chairId, "" + element.nickName);//element.nickName
                    this.setPlayerCoin(chairId, element.score);
                    this.setPlayerPropUserId(chairId, element.userId);
                    // if (chairId == 0) {

                    // } else {
                    //     this.setPlayerCoin(chairId, element.score);
                    // }
                    this.setPlayerIcon(chairId, element.headId, element.headImgUrl);
                    this.setPlayerActiveByIndex(chairId, true);
                    this.setPlayerHeadBox(chairId, element.headboxId);
                    this.setPlayerVip(chairId, element.vipLevel);
                    // if (element.vipLevel == 0) {
                    //     this.node.children[chairId].getChildByName("vip_03").active = false;
                    //     this.node.children[chairId].getChildByName("vip").active = false;
                    // }
                    this.node.children[chairId].getChildByName("vip_03").active = true;
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
                            UTBNNScene_hy.ins.extend.showInvite(false);
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
    private onAddScoreResult(data: FTbnn.NN_CMD_S_AddScoreResult) {
        // cc.log(data);

        //#region  test 0-3 
        // MTBNNModel_hy.ins.sMeChairId = 0;
        //#endregion

        let wAddJettonUser = data.addJettonUser;
        let cbJettonMultiple = data.jettonMultiple;

        let chairId = MTBNNModel_hy.ins.getUISeatId(wAddJettonUser);

        this.setTBBSActive(chairId, false);

        this.setXZBSActive(chairId, true);
        this.setQPActive(chairId, true);
        this.setQPAction(chairId, "xz");

        this.setXZBSJettonMultiple(chairId, cbJettonMultiple);
    }

    /************ 自定义 event ***************/

    /**
     * 选庄结束 隐藏不是庄家的 抢庄字体 改成下注时在隐藏
     * @param data 
     */
    private onXuanZhuangEnd(data) {
        // var bankindex = MTBNNModel_hy.ins.gBankerIndex;//data.banker;
        // var index = MTBNNModel_hy.ins.getUISeatId(bankindex);

        // if (index != null) {
        //     for (let i = 0; i < 4; i++) {
        //         if (index != i) {
        //             this.setTBBSActive(i, false);
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
