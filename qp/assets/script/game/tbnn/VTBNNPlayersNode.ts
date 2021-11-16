import MTBNNModel, { TBNN_SELF_SEAT } from "./model/MTBNNModel";
import UTBNNHelper, { ETBNNState } from "./UTBNNHelper";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UTBNNScene from "./UTBNNScene";
import AppGame from "../../public/base/AppGame";
import UResManager from "../../common/base/UResManager";
import { EIconType, ERoomKind } from "../../common/base/UAllenum";
import UStringHelper from "../../common/utility/UStringHelper";
import UDebug from "../../common/utility/UDebug";
import { Tbnn } from "../../common/cmd/proto";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";


const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:各玩家 view
 */
@ccclass
export default class VTBNNPlayersNode extends cc.Component {

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
            prop: null,
            wsz: null,
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
            prop: null,
            wsz: null,
            chatProp: null
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
            prop: null,
            wsz: null,
            chatProp: null,
        },
    };

    /**抢庄下注时的Y位置 qzbs/xzbs*/
    private _qzPosY: Array<number> = [62, 57.3, -53, 57.3];
    /**发牌时的Y位置 qzbs/xzbs*/
    private _fpPosY: Array<number> = [62, 87.5, -90.5, 87.5];//84.1
    /**抢庄下注时的Y位置 qp*/
    private _qzQpPosY: Array<number> = [50.8, 44, -43.8, 44];//-63.8
    /**发牌时的Y位置 qp*/
    private _fpQpPosY: Array<number> = [50.8, 75.7, -76.5, 75.7]; // -101.3


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
        // MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_UPDATE_ROLEINFO, this.updateMyRoleInfo, this);

        MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SUB_S_GAME_START, this.onGamestart, this);
        // MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SUB_S_CALL_BANKER, this.onCallBanker, this);
        MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);


        MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_XUAN_ZHUANG_END_EVENT, this.onXuanZhuangEnd, this);
        MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_TOTALSCORE_EVENT, this.onTotalScore, this);

        MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);


        MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_RESET_SCENE, this.onResetScene, this);

    
    }

    private removeEvent() {
        // MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_UPDATE_ROLEINFO, this.updateMyRoleInfo, this);

        MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SUB_S_GAME_START, this.onGamestart, this);
        // MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SUB_S_CALL_BANKER, this.onCallBanker, this);
        MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_SUB_S_ADD_SCORE_RESULT, this.onAddScoreResult, this);


        MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_XUAN_ZHUANG_END_EVENT, this.onXuanZhuangEnd, this);
        MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_TOTALSCORE_EVENT, this.onTotalScore, this);

        MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);

        MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_RESET_SCENE, this.onResetScene, this);
    }

    onDestroy() {
        this.removeEvent();
    }

    init() {
        this._maxplayer = MTBNNModel.ins.maxPlayer;
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

    /**绑定道具节点userId */
    setPlayerPropUserId(index: number, userId: number) {
        this._players[index.toString()].prop.getComponent(GamePropManager).bindUserId(userId);
        this._players[index.toString()].chatProp.getComponent(VGameChatPropManager).bindUserId(userId);
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
                var myscore = UTBNNScene.ins.myScore;
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
                    viplv: AppGame.ins.roleModel.vipLevel
                }
                this.updateMyRoleInfo(myInfo);
            }
        }
        this.resetPopPos();
        MTBNNModel.ins.updateBattlePlayer();
        //         if (element.seatId == 0) {
        //             element.showbaseInfo(MSGModel.ins.getshowselfinfo());
        //         } else
        //             element.free();
    }

    onGamestart(data:any) {
        var players = MTBNNModel.ins.gBattlePlayer;
        this._myscore = -1;
        if (players != null) {
            for (const key in players) {
                if (players.hasOwnProperty(key)) {
                    const element = players[key];
                    var uipos = MTBNNModel.ins.getUISeatId(element.chairId)
                    if (element.playStatus == 1 && uipos != null) {
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
        if (index != 0 && AppGame.ins.currRoomKind != ERoomKind.Club)
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
    setTBBSActive(index: number, b: boolean) {
        if (!b) {
            this._players[index.toString()].qzbs.node.stopAllActions();
        }

        this._players[index.toString()].qzbs.node.active = b;
    }

    /**气泡背景 */
    setQPActive(index: number, b: boolean) {
        return
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

            let offest = 65;
            if (i == 2) {
                node.setPosition(cc.v2(node.getPosition().x, (this._fpPosY[i])));
                node1.setPosition(cc.v2(node1.getPosition().x, (this._fpPosY[i] + 220)));
            }else{
                node.setPosition(cc.v2(node.getPosition().x, (this._qzPosY[i] + offest)));
                node1.setPosition(cc.v2(node1.getPosition().x, (this._qzPosY[i] + offest)));
            }
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

                // let chairId = MTBNNModel.ins.getUISeatId(element.chairId);
                // if (element.playStatus == 1 && chairId != null) {
                //     this.setPlayerNickName(chairId, element.userId);//element.nickName
                //     this.setPlayerCoin(chairId, element.score);
                //     this.setPlayerIcon(chairId, element.headId);

                //     this.setPlayerActiveByIndex(chairId, true);
                //     this.setPlayerVip(chairId, element.vipLevel);
                //     this.setPlayerHeadBox(chairId, element.headboxId);
                // }
                let chairId = MTBNNModel.ins.getUISeatId(element.chairId);
                if (!element.isExit && element.playStatus >= 0 && chairId != null) {
                    if(AppGame.ins.currRoomKind == ERoomKind.Normal) {
                        this.setPlayerNickName(chairId, ""+element.userId);
                    } else {
                        this.setPlayerNickName(chairId, ""+element.nickName);
                    }
                    this.setPlayerCoin(chairId, element.score);
                    this.setPlayerIcon(chairId, element.headId,element.headImgUrl);
                    this.setPlayerActiveByIndex(chairId, true);
                    this.setPlayerHeadBox(chairId, element.headboxId);
                    this.setPlayerVip(chairId, element.vipLevel);
                    this.setPlayerPropUserId(chairId, element.userId);
                    //只有中途加入的玩家才显示遮罩
                    var bshow = false
                    if (element.playStatus == 0 && MTBNNModel.ins.isGaming){
                        bshow = true
                    }
                    this.setPlayerWsz(chairId,bshow)
                    //UDebug.log("111111111111更新房间玩家信息", element)
                }else{
                    this.setPlayerActiveByIndex(chairId, false);
                    this.closePropPanelByUserId(chairId, element.userId);
                    delete data[key];
                }

            }
        }
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

    /**关闭对应道具面板 */
    closePropPanelByUserId(index: number, userId: number) {
        this._players[index.toString()].prop.getComponent(GamePropManager).closePropPanelByUserId(userId);
    }
    /******** 协议 event ********/

    /**
     * 某个玩家的下注结果
     * @param data 
     */
    private onAddScoreResult(data: Tbnn.NN_CMD_S_AddScoreResult) {
        // cc.log(data);

        //#region  test 0-3 
        // MTBNNModel.ins.sMeChairId = 0;
        //#endregion

        let wAddJettonUser = data.addJettonUser;
        let cbJettonMultiple = data.jettonMultiple;

        let chairId = MTBNNModel.ins.getUISeatId(wAddJettonUser);

        this.setTBBSActive(chairId, false);

        this.setXZBSActive(chairId, true);
        this.setQPActive(chairId, true);
        this.setXZBSJettonMultiple(chairId, cbJettonMultiple);



    }

    


    /************ 自定义 event ***************/

    /**
     * 选庄结束 隐藏不是庄家的 抢庄字体 改成下注时在隐藏
     * @param data 
     */
    private onXuanZhuangEnd(data) {
        // var bankindex = MTBNNModel.ins.gBankerIndex;//data.banker;
        // var index = MTBNNModel.ins.getUISeatId(bankindex);

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

    getTestEvent() {
        this.testSetAllPlayerInfo();
    }

    /**测试 */
    testSetAllPlayerInfo() {

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
