
    import UGame from "../../public/base/UGame";
    import AppGame from "../../public/base/AppGame";
    import { ToBattle } from "../../common/base/UAllClass";
    import ULanHelper from "../../common/utility/ULanHelper";
    import UHandler from "../../common/utility/UHandler";
    import UDDZHelper, { ChatMsgType, ReceiveChairidType } from "./ddz_Helper";
    import ddz_Player from "./ddz_Player";
    import ddz_ActionPanel from "./ddz_actionPanel";    
    import ddz_ResultPanel from "./ddz_ResultPanel";
    import { EAppStatus, ECommonUI, EGameType, ELevelType, ERoomKind } from "../../common/base/UAllenum";
    import ddz_Card from "./ddz_Card";
    import UDebug from "../../common/utility/UDebug";
    import ddz_Music from "./ddz_Music";
    import { UAPIHelper } from "../../common/utility/UAPIHelper";
    import VGameChat from "../../public/gamechat/VGameChat";
    import UAudioManager from "../../common/base/UAudioManager";
    import ddz_SelectPanel from "./ddz_SelectPanel";
    import UNodeHelper from "../../common/utility/UNodeHelper";
    import { Ddz } from "../../common/cmd/proto";
    import { ZJH_SCALE } from "../../public/hall/lobby/VHall";
    import cfg_ui from "../../config/cfg_ui";
    import cfg_game from "../../config/cfg_game";
    import UStringHelper from "../../common/utility/UStringHelper";
    import MHall, { NEWS } from "../../public/hall/lobby/MHall";
import MDDZModel from "./model/MDDZ";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";
    /**
     * 作用:斗地主入口
     */

    const { ccclass, property } = cc._decorator;

    @ccclass
    export default class ddz_Main extends UGame {
        @property(cc.Node) menu: cc.Node = null;
        @property(cc.Label) baseScore: cc.Label = null;
        @property(cc.Node) match: cc.Node = null;
        @property(ddz_Player) playerList: ddz_Player[] = [];
        @property(ddz_ActionPanel) action: ddz_ActionPanel = null;
        @property(cc.Label) betLevel: cc.Label = null;
        @property(sp.Skeleton) spWashCard: sp.Skeleton = null;
        @property(sp.Skeleton) spBomb: sp.Skeleton = null;
        @property(cc.Node) trust: cc.Node = null;
        @property(ddz_ResultPanel) result: ddz_ResultPanel = null;
        @property(cc.Label) recordId: cc.Label = null;
        @property(cc.Node) countItem: cc.Node = null;
        @property(cc.Node) cardRecord: cc.Node = null;
        @property(cc.Node) countBox: cc.Node = null;
        @property(cc.Node) lastItem: cc.Node[] = [];
        @property(sp.Skeleton) spWinLost: sp.Skeleton = null;
        @property(sp.Skeleton) spChunTian: sp.Skeleton = null;
        @property(cc.Node) bottomBar: cc.Node = null
        @property(cc.Node) btnNext: cc.Node = null
        @property(cc.Label) tipMsg: cc.Label = null;
        @property(ddz_SelectPanel) selectType: ddz_SelectPanel = null;
        @property(cc.Node) multipleTipPopup: cc.Node = null;
        @property(cc.Sprite) tipImage: cc.Sprite = null;
        @property(cc.Node) spBg: cc.Node = null;
        @property(cc.Node) lastThreecard: cc.Node = null;
        @property(cc.Node) lastItemClub: cc.Node[] = [];

        private _is_multiple_open: boolean;
        /**单例 */
        private static _ins: ddz_Main;
        private _enterMinScore: any;

        public clockShowResult:any;
        public clockStartMatch:any;
        
        static get ins(): ddz_Main {
            return ddz_Main._ins;
        }
        public musicMgr : ddz_Music
        public chatMain : VGameChat = null
        
        protected init(): void {
            ddz_Main._ins = this;
            this.musicMgr = new ddz_Music()
            this.menu.active = false;
            this._is_multiple_open = false;
            //记牌器个数
            for (var i=0;i<15;i++){
                let ins = cc.instantiate(this.countItem);
                ins.setParent(this.countBox)
            }
        }

        onEnable() {
            super.onEnable();
            AppGame.ins.ddzModel.run();
            AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_GAME_START, this.onGameStart, this);
            AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_BANKER_INFO, this.onBankerInfo, this);
            AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_OUT_CARD_RESULT, this.onOutCardResult, this);
            AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_GAME_BET_LEVEL, this.onBetLevel, this);
            AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_GAME_END, this.onGameEnd, this);
            AppGame.ins.ddzModel.on(UDDZHelper.DDZ_SELF_EVENT.DDZ_SC_TS_START_MATCH, this.onStartMatch, this);
            AppGame.ins.ddzModel.on(UDDZHelper.DDZ_SELF_EVENT.DDZ_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);
            AppGame.ins.ddzModel.on(UDDZHelper.DDZ_SELF_EVENT.DDZ_RECONNECT_OUT_CARD, this.onUpdateRecordBox, this);
            cc.game.on(cc.game.EVENT_SHOW, this.game_show, this);
        }

        onDisable() {
            super.onDisable();
            this.musicMgr.stop()
            this.node.stopAllActions()
            AppGame.ins.ddzModel.exit();
            AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_GAME_START, this.onGameStart, this);
            AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_BANKER_INFO, this.onBankerInfo, this);
            AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_OUT_CARD_RESULT, this.onOutCardResult, this);
            AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_GAME_BET_LEVEL, this.onBetLevel, this);
            AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_GAME_END, this.onGameEnd, this);
            AppGame.ins.ddzModel.off(UDDZHelper.DDZ_SELF_EVENT.DDZ_SC_TS_START_MATCH, this.onStartMatch, this);
            AppGame.ins.ddzModel.off(UDDZHelper.DDZ_SELF_EVENT.DDZ_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);
            AppGame.ins.ddzModel.off(UDDZHelper.DDZ_SELF_EVENT.DDZ_RECONNECT_OUT_CARD, this.onUpdateRecordBox, this);
            cc.game.off(cc.game.EVENT_SHOW, this.game_show, this);
        }

        //场景被打开 
        openScene(data: any): void {
            super.openScene(data);
            if (data) {
                let dt = data as ToBattle;
                if (dt) {
                    this.match.active = true
                    this.cardRecord.active = false
                    this.lastThreecard.active = false
                    this.bottomBar.active = false
                    this.baseScore.node.active = true
                    AppGame.ins.ddzModel.cellScore = dt.roomData.floorScore
                    AppGame.ins.ddzModel._roomInfo = dt.roomData;
                    this._enterMinScore = data.roomData.enterMinScore;
                    this.baseScore.string = "底注："+ (AppGame.ins.ddzModel.cellScore/100).toString()
                    this.musicMgr.playGamebg()
                }
            }
        }

        
        //重写进入房间失败消息
        protected enter_room_fail(errorCode: number, errMsg?:string): void {
            let msg = errMsg
            if (!msg) {
                msg = ULanHelper.GAME_INFO_ERRO;
            }
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 1, data: msg, handler: UHandler.create(() => {
                    //关闭结算等待时钟
                    clearInterval(this.clockStartMatch)
                    clearInterval(this.clockShowResult)
                    AppGame.ins.loadLevel(ELevelType.Hall, AppGame.ins.roomModel.GameID);
                }, this)
            });
        }

        //////////////////////////////////////////////////////////////游戏消息///////////////////////////////////////////////////////
        //显示倍率
        private onBetLevel(data:any){
            UDebug.Log("倍率消息"+ JSON.stringify(data))
            this.betLevel.string = data.playerbeilv[AppGame.ins.ddzModel.gMeChairId].totalbeilv + "倍";
            this.refreshMultiple(data);
        }

        refreshMultiple(data: any, isReset?:boolean){
            let ddz_PlusView = this.multipleTipPopup.getComponent("ddz_PlusView");
            if (isReset) {
                ddz_PlusView.resetView();
                return;
            }
            ddz_PlusView.resetView();
            let selfData: Ddz.playerbeilv = data.playerbeilv[AppGame.ins.ddzModel.gMeChairId]
            // //基础倍率
            // ddz_PlusView.setBase(selfData.basebeilv);
            //炸弹倍率
            ddz_PlusView.setBomb(selfData.bombbeilv);
            //春天倍率
            ddz_PlusView.setSpring(selfData.springbeilv);
            ddz_PlusView.setCommon(selfData.bombbeilv * selfData.springbeilv*selfData.jdzbeilv);
            //叫地主倍率
            ddz_PlusView.setLandlord(selfData.jdzbeilv);
            //农民加倍倍率
            ddz_PlusView.setFarmer(selfData.jiabeibeilv);
            //总倍率
            ddz_PlusView.setTotal(selfData.totalbeilv);
            ddz_PlusView.setUser(AppGame.ins.roleModel.useId);
        }

        //游戏开始 
        private onGameStart(data:any){
            this.match.active = false
            this.recordId.string = "牌局编号:" + data.roundid
            this.recordId.node.parent.active = true
            this.bottomBar.active = true
            this.betLevel.string = "1倍"
            this.cardRecord.active = false
            this.lastThreecard.active = false
            this.resetRecordCard()
            data.cards.forEach(element => {
                this.updateRecordCard(element)
            })
            for (var i =0; i<3;i++){
                if (AppGame.ins.currRoomKind == ERoomKind.Normal){
                    var poker = this.lastItem[i].getComponent(ddz_Card)
                }else if (AppGame.ins.currRoomKind == ERoomKind.Club){
                    poker = this.lastItemClub[i].getComponent(ddz_Card)
                }
                poker.lockFlag = true
                poker.showCardBack(true)
                poker.showCardCheck(false)
            }
            this.musicMgr.playSendCard()
            //开始游戏后再显示玩家
            this.playerList.forEach(player =>{
                player.node.active = true
            })
            this.refreshMultiple(null, true)

            //播放洗牌动画
            if (!data.isreconnect){
                this.playWashCardSpine()
            }
        }

        //确定地主
        private onBankerInfo(data:any){
            if (!data.isreconnect){
                if (data.dzinfo.dzchairid == AppGame.ins.ddzModel.gMeChairId){
                    data.dzinfo.dicards.forEach(element => {
                        this.updateRecordCard(element)
                    })
                }
            }
            for (var i =0; i<data.dzinfo.dicards.length;i++){
                if (AppGame.ins.currRoomKind == ERoomKind.Normal){
                    var poker = this.lastItem[i].getComponent(ddz_Card)
                }else if (AppGame.ins.currRoomKind == ERoomKind.Club){
                    poker = this.lastItemClub[i].getComponent(ddz_Card)
                }
                poker.showCardBack(false)
                poker.setCardValue(data.dzinfo.dicards[i])
            }
            this.musicMgr.playBankerResult()
        }

        //出牌结果
        private onOutCardResult(data:any){
            if (data.isreconnect) return
            if (data.lastchairid != AppGame.ins.ddzModel.gMeChairId){
                data.cards.forEach(element => {
                    this.updateRecordCard(element)
                })
            }
            //更新三张底牌透明度
            for (var i =0; i<3;i++){
                if (AppGame.ins.currRoomKind == ERoomKind.Normal){
                    var poker = this.lastItem[i].getComponent(ddz_Card)
                }else if (AppGame.ins.currRoomKind == ERoomKind.Club){
                    poker = this.lastItemClub[i].getComponent(ddz_Card)
                }
                if (data.cards.includes(poker.value)){
                    if (AppGame.ins.currRoomKind == ERoomKind.Normal)
                    poker.showCardCheck(true)
                }
            }
        }

        //游戏结束
        onGameEnd(data:any){
            AppGame.ins.closeUI(ECommonUI.UI_GAME_PROP);
            AppGame.ins.closeUI(ECommonUI.UI_CHAT_HY)
            var result = data.gameresult
            var bSpring = false
            for(var i=0; i<result.length; i++){
                const element = result[i]
                //更新分数
                let seatId = AppGame.ins.ddzModel.getUISeatId(element.chairid)
                this.playerList[seatId].setScore(element.currentsocre)
                //输赢动画
                if (element.chairid == AppGame.ins.ddzModel.gMeChairId){
                    var banker = AppGame.ins.ddzModel.gMeChairId == AppGame.ins.ddzModel.gBankerIndex ? true : false
                    this.playWinOrLostSpine(element.iswin,banker)
                }
            
                //通知玩家
                if (element.cards.length > 0){
                    this.playerList[seatId].onGameEnd(element)
                }
                bSpring = element.ispring
            }

            //春天动画
            if (bSpring){
                this.playChunTianSpine()
                this.musicMgr.playChunTian(AppGame.ins.ddzModel.gMeChairId == 0 ? "" : "Woman_")
            }
            
            //延迟播放动画
            this.clockShowResult = setTimeout(function(){
                if (AppGame.ins.appStatus.status == EAppStatus.Game){
                    UDebug.Log("显示结算界面")
                    this.result.show(data)
                    this.bottomBar.active = false
                    this.btnNext.active = AppGame.ins.currRoomKind == ERoomKind.Normal ? true : false
                    this.closeMultiplePopup();
                }
            }.bind(this), 3000);

            //俱乐部自动匹配
            if (AppGame.ins.currRoomKind == ERoomKind.Club){
                this.clockStartMatch = setTimeout(function(){
                        if (AppGame.ins.appStatus.status == EAppStatus.Game)
                        AppGame.ins.ddzModel.emit(UDDZHelper.DDZ_SELF_EVENT.DDZ_SC_TS_START_MATCH)
                }.bind(this), 9000);
            }
        }

        //重连成功，游戏已经结束,房间信息置空
        protected reconnect_in_game_but_no_in_gaming(): void {
            //AppGame.ins.ddzModel._roomInfo = null
            this.match.active = false
            //清理玩家
            for (var k in this.playerList){
                this.playerList[k].onClearDesk()
            }
            //清理数据
            AppGame.ins.ddzModel.resetData()
        }

        //////////////////////////////////////////////////////////////本地事件///////////////////////////////////////////////////////
        //播放spine动画
        public playSpine(path:string,animation:string,skeleton:sp.Skeleton,loop:boolean,callback?:Function): void {
            if (AppGame.ins.roomModel.BundleName == "") return
            let bundle = cc.assetManager.getBundle(AppGame.ins.roomModel.BundleName)
            bundle.load(path, sp.SkeletonData, function(err, res:any){
                if(err) cc.error(err)
                cc.loader.setAutoRelease(res, true)
                skeleton.skeletonData = res
                skeleton.setAnimation(0, animation, loop)
                skeleton.setCompleteListener((event) =>{
                    if (callback != undefined ) callback()
                })
            })
        }

        //播放春天
        playChunTianSpine(){
            this.spChunTian.node.active = true
            ddz_Main.ins.playSpine("ani/gameover/chuntian","chuntian",this.spChunTian,false,()=>{
                this.spChunTian.node.active = false
            })
        }  

        //播放洗牌动画
        playWashCardSpine(){
            this.spWashCard.node.active = true
            this.playSpine("ani/xipai","xipai_01",this.spWashCard,false,()=>{
            this.spWashCard.node.active = false})
        }


        //播放输赢动画
        playWinOrLostSpine(isWin:boolean,banker:boolean){
            this.spWinLost.node.active = true
            this.spBg.active = true
            var path = isWin ? "ani/gameover/win" : "ani/gameover/lose37"
            if (isWin){
                var action = banker ? "dizhu_win" : "farmer_win"
            }else{
                var action = banker ? "dizhu_lose" : "farmer_lose"
            }
            ddz_Main.ins.playSpine(path,action,this.spWinLost,false,()=>{
                this.spWinLost.node.active = false
                this.spBg.active = false
            })
            this.musicMgr.playIsWin(isWin)
            this.scheduleOnce(()=>{this.musicMgr.playGamebg()},6.5);
        }

        //更新记牌器
        updateRecordCard(cardValue:number){
            var index = 14 - AppGame.ins.ddzModel.pokerLibrary.getCardWeight(cardValue)
            AppGame.ins.ddzModel.leftCardCount[index] = AppGame.ins.ddzModel.leftCardCount[index] - 1
            this.countBox.children[index].getComponent(cc.Label).string = AppGame.ins.ddzModel.leftCardCount[index].toString()
            if (AppGame.ins.ddzModel.leftCardCount[index] == 0){
                this.countBox.children[index].getComponent(cc.Label).node.color =   cc.color(113,73,60) 
            }else if (AppGame.ins.ddzModel.leftCardCount[index] == 4){
                this.countBox.children[index].getComponent(cc.Label).node.color =   cc.color(201,67,53) 
            }else{
                this.countBox.children[index].getComponent(cc.Label).node.color =   cc.color(232,229,209) 
            }
            
        }

        //显示记牌器
        resetRecordCard(){
            AppGame.ins.ddzModel.leftCardCount = [1,1,4,4,4,4,4,4,4,4,4,4,4,4,4]
            for(var i = 0 ;i<this.countBox.childrenCount ;i++){
                this.countBox.children[i].getComponent(cc.Label).string = AppGame.ins.ddzModel.leftCardCount[i].toString()
                if (AppGame.ins.ddzModel.leftCardCount[i] == 0){
                    this.countBox.children[i].getComponent(cc.Label).node.color =   cc.color(113,73,60) 
                }else if (AppGame.ins.ddzModel.leftCardCount[i] == 4){
                    this.countBox.children[i].getComponent(cc.Label).node.color =   cc.color(201,67,53) 
                }else{
                    this.countBox.children[i].getComponent(cc.Label).node.color =   cc.color(232,229,209) 
                }
            }
        }

        //点击菜单
        onClickMenu(){
            this.menu.active = !this.menu.active
        }

       //复制牌局编号
       onCopyRecordID() {
            AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
            UAPIHelper.onCopyClicked((this.recordId.string).substr(5,30));
        }

        //点击聊天
        onClickChat(){
            this.closeMultiplePopup()
            AppGame.ins.showUI(ECommonUI.UI_CHAT_HY);
        }

        //断线重连时更新记牌器
        onUpdateRecordBox(cards:number[]){
            cards.forEach(element => {
                this.updateRecordCard(element)
            })
        }
        
        //点击充值
        onClickCharge(){
            AppGame.ins.showUI(ECommonUI.LB_Charge);
        }

        //继续游戏
        continueGame(){
            AppGame.ins.ddzModel.emit(UDDZHelper.DDZ_SELF_EVENT.DDZ_SC_TS_START_MATCH);
        }

        // 显示提示文本
        public onShowTips(content: string) {
            var action1 = cc.fadeIn(0.2);
            var action2 = cc.fadeOut(0.2);
            var actionPlay1 = cc.callFunc(()=>{
                this.scheduleOnce(()=>{
                    this.tipMsg.node.parent.runAction(action2);
                },1.5);
            })
            this.tipMsg.string = content;
            this.tipMsg.node.parent.active = true
            this.tipMsg.node.parent.runAction(cc.sequence(action1,actionPlay1));
        }

        // 显示提示图片
        public onShowTipImage() {
            var action1 = cc.fadeIn(0.2);
            var action2 = cc.fadeOut(0.2);
            var actionPlay1 = cc.callFunc(()=>{
                this.scheduleOnce(()=>{
                    this.tipImage.node.runAction(action2);
                },1.5);
            })
            this.tipImage.node.active = true
            this.tipImage.node.runAction(cc.sequence(action1,actionPlay1));
        }
    
        //托管
        onClickTrust(event:any, CustomEventData:boolean){
            if (AppGame.ins.ddzModel.gameStatus == MDDZModel.DDZ_GAMESTATUS.OVER) return
            this.closeMultiplePopup()
            AppGame.ins.ddzModel.sendTrust(CustomEventData)
        }

        //开始匹配
        private onStartMatch(data: any): void {
            this.match.active = true
            this.betLevel.string = ""
            this.cardRecord.active = false
            this.lastThreecard.active = false
            this.recordId.node.parent.active = false
            this.btnNext.active = false
            this.result.hide()
            //重置桌子
            AppGame.ins.ddzModel.emit(UDDZHelper.DDZ_SELF_EVENT.DDZ_CLEAR_DESK)
            //进入房间
            AppGame.ins.ddzModel.resetData()
            //金币房
            if (AppGame.ins.currRoomKind == ERoomKind.Normal)
            AppGame.ins.roomModel.requestMatch(true,AppGame.ins.ddzModel.lastTableId);
        }

        //更新房间玩家信息
        private onUpdatePlayers(data: any) {
            if (!data) return
            UDebug.Log("onUpdatePlayers" + JSON.stringify(data))
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const element = data[key]
                    let seatId = AppGame.ins.ddzModel.getUISeatId(element.chairId)
                    UDebug.Log("当前用户" + element)
                    if  (element.userStatus >= 0 && seatId!= null) {
                        this.playerList[seatId].setChairId(element.chairId)
                        if(AppGame.ins.currRoomKind == ERoomKind.Normal) {
                            this.playerList[seatId].setUserID(element.userId)
                        } else {
                            this.playerList[seatId].setUserID(element.nickName)
                        }
                        this.playerList[seatId].setScore(element.score)
                        this.playerList[seatId].setPlayerPropUserId(element.userId)
                        //断线重连
                        if (element.userStatus == 5){
                            this.playerList[seatId].node.active = true
                        }else{
                            this.playerList[seatId].node.active = seatId == 0 ?  true : false
                        }
                    }
                }
            }
        }
        
        /**通过userId获取聊天节点 */
        getChatPropNodeByUserId(userId: number, callback: any = null) {
            for (let i = 0; i < this.playerList.length; i++) {
                let player = this.playerList[i];
                let bindUserId = player.chatProp.getComponent(VGameChatPropManager).getBindUserId();
                if (bindUserId && (userId == bindUserId)) {
                    callback && callback(player.chatProp);
                }
            }
        }

        onMultiplePopBtn() {
            if (this._is_multiple_open) {
                this.multipleTipPopup.runAction(cc.scaleTo(0.15, 0));  
            } else {
                this.multipleTipPopup.runAction(cc.scaleTo(0.15, 1));
            }
            this._is_multiple_open = !this._is_multiple_open;
        }

        closeMultiplePopup() {
            if (this._is_multiple_open)  {
                this.multipleTipPopup.runAction(cc.scaleTo(0.15, 0));  
                this._is_multiple_open = !this._is_multiple_open;
            }
        }

        closeAllPop(){
            AppGame.ins.closeUI(ECommonUI.UI_CHAT_HY)
            this.menu.active = false
            this.closeMultiplePopup()
            this.action.setHandCardBack()
            this.selectType.node.active = false
            AppGame.ins.ddzModel.selectPokers = []
        }

        //切到前台，停止可能正在播放的动画
        game_show(){
            this.spWashCard.node.stopAllActions()
            this.spWashCard.node.active = false
        }
    }