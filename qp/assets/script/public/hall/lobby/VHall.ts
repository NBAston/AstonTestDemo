import UScene from "../../../common/base/UScene";
import VGameList from "./VGameList";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import { EGameType, ECommonUI, EAppStatus, ELoginType, ERoomKind, EAgentLevelReqType, EGameUpdateStatus } from "../../../common/base/UAllenum";
import AppGame from "../../base/AppGame";
import VRole from "./VRole";
import UEventHandler from "../../../common/utility/UEventHandler";
import UFullScreen from "../../../common/utility/UFullScreen";
import USpriteFrames from "../../../common/base/USpriteFrames";
import UAudioManager from "../../../common/base/UAudioManager";
import VHallMusic from "./VHallMusic";
import cfg_game from "../../../config/cfg_game";
import MLogin from "../../login/MLogin";
import VActivity from "../activity/VActivity";
import UHandler from "../../../common/utility/UHandler";
import ULanHelper from "../../../common/utility/ULanHelper";
import { UIAnnData, EAnnType, mailData } from "../announce/AnnounceData";
import MRole from "./MRole";
import MAnnounceModel from "../announce/MAnnounceModel";
import { EBtnType, MailData } from "../lb_service_mail/MailServiceData";
import MHall, { NEWS } from "./MHall";
import UStringHelper from "../../../common/utility/UStringHelper";
import RsaKey from "../../../common/utility/RsaKey";
import UMsgCenter from "../../../common/net/UMsgCenter";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import { EventManager } from "../../../common/utility/EventManager";
import VChat from "../lb_chat/Vlb_chat";
import ULocalDB, { ChatInfo, MsgObj, ULocalStorage } from "../../../common/utility/ULocalStorage";
import VChargeConstants from "../charge/chargeItem/VChargeConstants";
import cfg_event from "../../../config/cfg_event";
import UDebug from "../../../common/utility/UDebug";
import MMailModel from "../lb_service_mail/Mmail_Model";
import VMailItem from "../lb_service_mail/Vlb_mail_item";
import UResManager from "../../../common/base/UResManager";
import VGameListFriend from "./VGameListFriend";
import { SysEvent } from "../../../common/base/UAllClass";
import MRoomModel from "../room_zjh/MRoomModel";

export const ZJH_SCALE = 0.01;

// export const ISPLAYING:Boolean = ;

// export const NEWS = [];

// const APP_KEY =  "57feaa48112bc0e975fe5c15a5cb7bd7"
const APP_KEY = "8ef1e11d5fd3a1db43a80d91fc62ebb3";


const { ccclass, property } = cc._decorator;
/**
 * 创建:gj
 * 作用:大厅控制 
 */
@ccclass
export default class VHall extends UScene {

    @property(cc.Prefab)
    scrollMsgNode: cc.Prefab = null;

    /**
     * 游戏进入接口
     */
    private _gamelist: VGameList;
    private _gameListFriend: VGameListFriend;
    /**
     * 游戏入口节点
     */
    private _gameRoot: cc.Node;
    /**
     * 大厅UIroot
     */
    private _hallUIRoot: cc.Node;
    /**
     * 游戏房间root
     */
    private _gameRoom: cc.Node;
    private _regesterNode: cc.Node;
    private _proxNode: cc.Node;
    private _icon_mail_red: cc.Node;
    private _banner_img: cc.Node;
    private _qrcode_activity: cc.Node;
    private _scrollMsgNode: cc.Node;
    private _icon_friends: cc.Node;
    private _icon_club: cc.Node;
    /**
     * 
     */
    private _role: VRole;
    private _res: USpriteFrames;
    private _activty: VActivity;
    private _music: VHallMusic;
    private _vhallMusic: UAudioManager;
    // public _news:Array<string>;
    private _sys_news: Array<string>;
    private _emergency_announcement: Array<string>;
    private _msgMark: cc.Node;
    private _msgMarkLb: cc.Label;
    private _roomCardLbl: cc.Label;
    private _transfer: cc.Node;
    private _mail_count: cc.Label;
    @property(cc.Prefab)
    gameItemPrefab: cc.Prefab = null;
    public static isLogin: boolean = false;

    // private _accounts: Array<AccountInfo>;
    // private _serializers: { [key: number]: USerializer };
  
    private fullClick(on: boolean): void {
        if (on) {
            UFullScreen.fullScreen();
        } else {
            UFullScreen.exitScreen();
        }
        this._music.playclick();
    }
    private openSetting(): void {
        AppGame.ins.showUI(ECommonUI.LB_Setting);
        this._music.playclick();
    }
    private exitGame(): void {
        AppGame.ins.exitGame();
    }
    //打开官网
    private openGWUrl() {
    }

    /**
     * 初始化
     */
    
    protected init(): void {
        // this._news = [];
        this._sys_news = [];
        this._music = new VHallMusic();
        this._vhallMusic = new UAudioManager();
        // this._music.playmusic();
        this._res = this.node.getComponent(USpriteFrames);
        this._banner_img = UNodeHelper.find(this.node, "banner_img");
        this._gameRoot = UNodeHelper.find(this.node, "uiroot/content");
        this._gameRoom = UNodeHelper.find(this.node, "uiroot/content/content");
        this._qrcode_activity = UNodeHelper.find(this._gameRoom, "gamenode/activy/view/content/qrcodeactivity");
        this._gamelist = new VGameList(this.gameItemPrefab, this._gameRoom, this, this._res, this._music);

        this._role = UNodeHelper.getComponent(this._gameRoot, "topcenter", VRole);
        this._icon_mail_red = UNodeHelper.find(this._gameRoom, "bottomleft/btn_mail/redicon");
        var goldnode = UNodeHelper.find(this._gameRoot, "topcenter/layout/goldBg/center_gold");
        var roleRoot = UNodeHelper.find(this._gameRoot, "content/roleinfo");

        this._role.init(roleRoot, this._music, goldnode);

        var btn_bank = UNodeHelper.find(this._gameRoom, "bottomleft/btn_bank");
        var btn_exchange = UNodeHelper.find(this._gameRoom, "bottomright/btn_exchange");
        var btn_rank = UNodeHelper.find(this._gameRoom, "bottomleft/btn_rank");
        this._proxNode = UNodeHelper.find(this._gameRoom, "bottomleft/ibtn_proxy");
        var hall_charge = UNodeHelper.find(this._gameRoom, "bottomright/hall_charge");
        var btn_news = UNodeHelper.find(this._gameRoom, "bottomleft/btn_news");
        var btn_task = UNodeHelper.find(this._gameRoom, "bottomleft/btn_task");
        var btn_help = UNodeHelper.find(this._gameRoom, "bottomleft/btn_help");
        var btn_activity = UNodeHelper.find(this._gameRoom, "bottomleft/btn_activity");
        var btn_service = UNodeHelper.find(this._gameRoom, "bottomleft/btn_customer");
        var btn_mail = UNodeHelper.find(this._gameRoom, "bottomleft/btn_mail");
        var btn_vip = UNodeHelper.find(this._gameRoom, "topleft/icon_vip");
        var btn_charge_plus = UNodeHelper.find(this._gameRoot, "topcenter/layout/goldBg/btn_charge_plus");
        var btn_roomCard_plus = UNodeHelper.find(this._gameRoot, "topcenter/layout/roomCardBg/btn_roomCard_plus");
        this._regesterNode = UNodeHelper.find(this._gameRoom, "bottomleft/btn_register");
        this._activty = UNodeHelper.getComponent(this._gameRoom, "gamenode/activy", VActivity);
        // let btn_setting = UNodeHelper.find(this._gameRoom, "topright/btn_setting");
        this._transfer = UNodeHelper.find(this._gameRoot, "topcenter/layout/btn_transfer");
        this._transfer.active = false;
        this._scrollMsgNode = cc.instantiate(this.scrollMsgNode);
        this._scrollMsgNode.parent = this._gameRoot;
        this._scrollMsgNode.y = 261;
        this._msgMark = UNodeHelper.find(this._gameRoom, "bottomleft/btn_customer/redicon");
        this._msgMarkLb = UNodeHelper.getComponent(this._msgMark, "count", cc.Label);
        this._icon_friends = UNodeHelper.find(this._gameRoom, "gamenode/btn_friends_room");
        this._icon_club = UNodeHelper.find(this._gameRoom, "gamenode/btn_club");
        this._mail_count = UNodeHelper.getComponent(this._gameRoom, "bottomleft/btn_mail/redicon/count", cc.Label);
        this._roomCardLbl = UNodeHelper.getComponent(this._gameRoot, "topcenter/layout/roomCardBg/center_roomCard/roomCardLbl", cc.Label);
        this.refreshRoomCard(AppGame.ins.roleModel.roomCard);
        let istempAccount = AppGame.ins.roleModel.getIsTempAccount();
        this._regesterNode.active = istempAccount;
        if (istempAccount && VHall.isLogin) {
            AppGame.ins.showUI(ECommonUI.LB_RegesterPopu);
            VHall.isLogin = false;
        };
        this._activty.init();

        UEventHandler.addClick(this._qrcode_activity, this.node, "VHall", "savePhoto");
        UEventHandler.addClick(btn_bank, this.node, "VHall", "onopenbank");
        UEventHandler.addClick(btn_exchange, this.node, "VHall", "onexchange");
        UEventHandler.addClick(btn_rank, this.node, "VHall", "onopenrank");
        UEventHandler.addClick(this._proxNode, this.node, "VHall", "onopenproxy");
        UEventHandler.addClick(hall_charge, this.node, "VHall", "onopencharge");
        UEventHandler.addClick(btn_charge_plus, this.node, "VHall", "onopencharge");
        UEventHandler.addClick(btn_roomCard_plus, this.node, "VHall", "onChargeRoomCard");
        UEventHandler.addClick(btn_news, this.node, "VHall", "onopennews");
        UEventHandler.addClick(btn_vip, this.node, "VHall", "onopenvip");
        UEventHandler.addClick(this._regesterNode, this.node, "VHall", "onregister");
        // UEventHandler.addClick(btn_setting, this.node, "VHall", "onsetting");
        UEventHandler.addClick(btn_service, this.node, "VHall", "onopenservicemail");
        UEventHandler.addClick(btn_mail, this.node, "VHall", "onopenservicemail");
        UEventHandler.addClick(btn_task, this.node, "VHall", "onopenTask");
        UEventHandler.addClick(btn_help, this.node, "VHall", "onopenHelp");
        UEventHandler.addClick(btn_activity, this.node, "VHall", "onopenActivity");
        UEventHandler.addClick(this._icon_friends, this.node, "VHall", "onopenFriends");
        UEventHandler.addClick(this._transfer, this.node, "VHall", "onTransfer");
        UEventHandler.addClick(this._icon_club, this.node, "VHall", "onClickClub");

        //event
        EventManager.getInstance().addEventListener(cfg_event.TASK_LIST, this.getTaskList, this);
        AppGame.ins.roleModel.on(
            MRole.CLOSE_REGISTER, () => {
                this._regesterNode.active = false;
            }, this);
        this.schedule(function () {
            if (NEWS.length > 0) {
                this.showScrollMsg(NEWS[0]);
            }
        }, 1)
        AppGame.ins.hallModel.requestAgentLevel();
        //请求好友房列表
        AppGame.ins.roomModel.requestGameFriendList();
    }

    /**
     * @description  是否显示代理的红点
     */
    // proxyShowHedIcon(data: any) {
    //     if (AppGame.ins.hallModel.reqAgentLevelType != EAgentLevelReqType.default) return;
    //     if (this._proxNode) {
    //         var hedIcon = UNodeHelper.find(this._proxNode, "chat_img_redpoint");
    //         if (!data || data.retCode != 0 || !data.hasOwnProperty('level')) {
    //             hedIcon.active = false;
    //             return;
    //         }
    //         let level = data.level

    //         if (level && level > 4 && hedIcon) {
    //             let isShowHedIcon = cc.sys.localStorage.getItem("PROXY_MALL_BTN_HED_ICON");
    //             hedIcon.active = !isShowHedIcon
    //         };
    //     }
    // }

    // 保存图片
    private savePhoto(): void {
        if (CC_JSB) {
            this._banner_img.opacity = 255;
            UAPIHelper.takePhoto(this._banner_img, "banner_mode.jpg");
            UAPIHelper.savePhoto("banner_mode");
            let action = cc.fadeOut(0.1);
            this._banner_img.runAction(action);
        }
    }
    private onregister(): void {
        AppGame.ins.showUI(ECommonUI.LB_RegesterPopu);
        this._music.playclick();
        this._vhallMusic.playSound("audio_vhall_register");
    }
    private onopenbank(): void {
        // cc.systemEvent.emit("SHOW_AWARDS", 100000);
        AppGame.ins.showUI(ECommonUI.LB_Bank);
        this._music.playclick();
        this._vhallMusic.playSound("audio_vhall_vbank");
    }
    private onexchange(): void {
        if (AppGame.ins.roleModel.getIsTempAccount()) {
            this.onregister();
        } else {
            AppGame.ins.showUI(ECommonUI.LB_EXCHANGE);
            this._music.playclick();
            this._vhallMusic.playSound("audio_vhall_vexchange");
        }
    }
    private onopenrank(): void {
        AppGame.ins.showUI(ECommonUI.LB_Rank);
        this._music.playclick();
        this._vhallMusic.playSound("audio_vhall_rank");
    }
    private onopenproxy(): void {
        AppGame.ins.showUI(ECommonUI.LB_Proxy);
        // this._music.playclick();
        this._vhallMusic.playSound("audio_vhall_promoter");
    }
    private onsetting(): void {
        AppGame.ins.showUI(ECommonUI.LB_Setting);
        this._music.playclick();
        this._vhallMusic.playSound("audio_vhall_setting_down");
    }

    /**俱乐部 */
    onClickClub() {
        AppGame.ins.showUI(ECommonUI.CLUB_HALL, { showActivity: true });
        this._music.playclick();
    }

    //转帐
    private onTransfer() {
        AppGame.ins.showUI(ECommonUI.UI_TRANSFER);
        this._music.playclick();
    }

    /**房卡充值 */
    private onChargeRoomCard() {
        AppGame.ins.hallModel.requestAgentLevel(EAgentLevelReqType.hall);
    }

    /**获取到代理等级 */
    onAgentLevelRes(data: any) {
        let tag = AppGame.ins.hallModel.reqAgentLevelType == EAgentLevelReqType.hall;
        if (!data || data.retCode != 0 || !data.hasOwnProperty('level')) {
            this._transfer.active = false;
            tag && this.onopencharge(null, 3);
            return;
        }
        if (data.level < 5) {
            this._transfer.active = false;
            tag && this.onopencharge(null, 3);
        } else {
            this._transfer.active = true;
            tag && this.onopencharge(null, 2);
        }
    }

    /**更新房卡 */
    refreshRoomCard(roomCard: number) {
        this._roomCardLbl.string = UStringHelper.getMoneyFormat(roomCard / 100);
    }

    private onopenservicemail(data: any): void {
        if (data.currentTarget._name == "btn_customer") {
            this._vhallMusic.playSound("audio_vhall_customer");
            AppGame.ins.showUI(ECommonUI.LB_Service_Mail, { type: EBtnType.service, data: "" });
        } else if (data.currentTarget._name == "btn_mail") {
            this._vhallMusic.playSound("audio_vhall_mail");
            // this._icon_mail_red.active = false
            AppGame.ins.showUI(ECommonUI.LB_Service_Mail, { type: EBtnType.email, data: "" });
        }
        // this._music.playclick();
    }
    private onopencharge(event: any, index: number = 0): void {
        if (!AppGame.ins.roleModel.bindMobile) {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 3, data: ULanHelper.NO_BIND_PHONE, handler: UHandler.create((a) => {
                    if (a) {
                        // AppGame.ins.showUI(ECommonUI.LB_Charge,{});
                        AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true, index: index });
                    } else {
                        AppGame.ins.showUI(ECommonUI.LB_Regester);
                    }
                }, this)
            });

        } else {
            // AppGame.ins.showUI(ECommonUI.LB_Charge);
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true, index: index });
        }
        this._vhallMusic.playSound("audio_vhall_vcharge");
        this._music.playclick();
    }
    private onopenvip(): void {
        AppGame.ins.showUI(ECommonUI.LB_VIP);
        this._vhallMusic.playSound("audio_vhall_vip");
        this._music.playclick();
    }
    private onopennews(): void {
        AppGame.ins.showUI(ECommonUI.LB_Announce);
        this._vhallMusic.playSound("audio_vhall_gonggao");
        // this._music.playclick();
    }

    private onopenTask(): void {
        AppGame.ins.showUI(ECommonUI.LB_TASK);
        this._vhallMusic.playSound("audio_vhall_task");
        this._music.playclick();
    }

    private onopenHelp(): void {
        AppGame.ins.showUI(ECommonUI.ZJH_Help, { gameType: EGameType.BJ });
        this._vhallMusic.playSound("audio_vhall_game_rule");
        // this._music.playclick();
    }

    private onopenActivity(): void {
        AppGame.ins.showUI(ECommonUI.LB_ACTIVITY);
        this._vhallMusic.playSound("audio_vhall_activity");
        this._music.playclick();
    }

    private onopenFriends(): void {

        this._gameListFriend.gameEnterClick()
        this._music.playclick();
    }

    /**好友房拉起进入房间 */
    private onEnterFriendRoom() {
        let updateStatus = this._gameListFriend.getUpdateStatus();
        UDebug.log('onEnterFriendRoom updateStatus => ' + updateStatus)
        UDebug.log('onEnterFriendRoom openFriendRoomId => ' + AppGame.ins.openFriendRoomId)
        if (updateStatus == EGameUpdateStatus.Updated && AppGame.ins.openFriendRoomId && (AppGame.ins.appStatus.status == EAppStatus.Hall || AppGame.ins.appStatus.status == EAppStatus.Room)) {
            AppGame.ins.showUI(ECommonUI.UI_ENTER_ROOM);
        } else {
            AppGame.ins.openFriendRoomId = 0;
        }
    }

    //判读跑马灯是否展示
    private showScrollMsg(a: string): void {
        this._scrollMsgNode.getComponent("VscrollMsg").label.string = a;
        this._scrollMsgNode.active = true;
    }

    private add_data(caller): void {
        let message = JSON.parse(JSON.parse(JSON.stringify(caller)).message);
        if (message.type == 0) {
            AppGame.ins.roleModel.requestUpdateScore();
        } else if (message.type == 1) {

            this._sys_news = JSON.parse(caller.message).msg;
            for (var i = 0; i < this._sys_news.length; i++) {
                NEWS.push(this._sys_news[i]["title"] + ":" + this._sys_news[i]["content"]);
            }
        } else if (message.type == 2) {
            if (message.vip == 0) {
                var b = "恭喜玩家" +
                    UStringHelper.coverName(message.nickName) +
                    "在<color=#fed752>" +
                    message.roomName +
                    "</color>中<color=#fed752>" +
                    message.cardType +
                    "</color>一把赢得<color=#fed752>" +
                    UStringHelper.getMoneyFormat(message.winScore * ZJH_SCALE) +
                    "</color>金币";
            } else {
                var b = "恭喜<color=#fed752>VIP" +
                    message.vip +
                    "</color>玩家" +
                    UStringHelper.coverName(message.nickName) +
                    "在" +
                    message.roomName +
                    "中<color=#fed752>" +
                    message.cardType +
                    "</color>一把赢得<color=#fed752>" +
                    UStringHelper.getMoneyFormat(message.winScore * ZJH_SCALE) +
                    "</color>金币";
            }
            NEWS.push(b);
        } else if (message.type == 3) {
            this._emergency_announcement = JSON.parse(caller.message);
            var title = this._emergency_announcement["title"];
            var content = this._emergency_announcement["content"];
            AppGame.ins.showUI(ECommonUI.UI_MANDATORY_POPUP, { title, content });
        }

    }

    /**
     * 
     * @param gameType 
     */
    enterGameView(gameType: EGameType): void {
        AppGame.ins.hallModel.enterRoomLobby(gameType);
    }

    protected gamecloseUI() {

    }
    /**
     * 场景被打开
     * @param data 
     */
    openScene(data: any): void {
        super.openScene(data);
        AppGame.ins.clubHallModel.lastClubGameId = -1;

        AppGame.ins.hallModel.updatingGameIdList = [];
        let list = AppGame.ins.hallModel.getGameList();
        this._gamelist.intGameList(list);
        AppGame.ins.hallModel.gameAllList = this._gamelist;

        if (AppGame.ins.currRoomKind == ERoomKind.Friend) {
            UDebug.log('好友房游戏 data ' + data)
            AppGame.ins.showUI(ECommonUI.UI_ENTER_ROOM);
            this.delayReleaseBundle();
        } else if (AppGame.ins.currRoomKind == ERoomKind.Club) {
            UDebug.log('俱乐部游戏 data ' + data)
            data && (AppGame.ins.clubHallModel.lastClubGameId = data);
            AppGame.ins.showUI(ECommonUI.CLUB_HALL);
            this.delayReleaseBundle();
        } else {
            UDebug.log('金币场游戏 data ' + data)
            if (data) {
                //直接进
                var cfg = cfg_game[data];
                if (cfg.roomUI != ECommonUI.None) {
                    if (cfg.gametype == EGameType.ZJH) {
                        AppGame.ins.showUI(cfg.roomUI, cfg.gametype);
                    } else {
                        AppGame.ins.showBundleUI(cfg.roomUI, cfg.gametype, cfg.gametype);
                    }
                } else {
                    this.delayReleaseBundle();
                }
            } else {
                this.delayReleaseBundle();
                AppGame.ins.hallModel.requsetHasLastGame();
                UAudioManager.ins.preload(0);
            }
        }

        this._music.playmusic();

        this.onresize();
        cc.game.on("resize", this.onresize, this);
        cc.game.on("resize_bg", this.resize_bg, this);

        let role = AppGame.ins.roleModel.getRoleShowInfo();
        this._role.bindData(role);
        AppGame.ins.appStatus.status = EAppStatus.Hall;
        var acdata = AppGame.ins.hallModel.getActivityData();
        this._activty.bind(acdata);
        this.refreshbtn();

        AppGame.ins.currRoomKind = ERoomKind.Normal;
        AppGame.ins.gamebaseModel.alreadExitGame();
        AppGame.ins.roleModel.requestUpdateScore();
        AppGame.ins.taskModel.sendTaskList();
        this.refreshChatMsgMark();
        this.showRed();
        if (ULocalStorage.getItem("isRegister") == "true" && ULocalStorage.getItem("RegRewardScore") > 0) {
            cc.systemEvent.emit(SysEvent.SHOW_AWARDS, ULocalStorage.getItem("RegRewardScore"), `恭喜收到注册奖励${ULocalStorage.getItem("RegRewardScore") * ZJH_SCALE}金币`);
            ULocalStorage.saveItem("isRegister", "false")
        }
    }

    /**延迟释放bundle */
    delayReleaseBundle() {
        let delyTime = 0.5;
        this.scheduleOnce(() => {
            UResManager.releaseBundle();
        }, delyTime)
    }

    refreshChatMsgMark() {
        if (AppGame.ins.unreadMsg > 0) {
            this._msgMark.active = true;
            if (AppGame.ins.unreadMsg > 99) {
                this._msgMarkLb.string = "99+";
            } else {
                this._msgMarkLb.string = AppGame.ins.unreadMsg + "";
            }
        } else {
            this._msgMark.active = false;
        }
    }

    onDestroy(): void {
        EventManager.getInstance().removeEventListener(cfg_event.TASK_LIST, this.getTaskList, this);
        UAudioManager.ins.setStopMusic();
        cc.game.off("resize", this.onresize, this);
        cc.game.off("resize_bg", this.resize_bg, this);
        this._gamelist.resetGameList();
        this._gameListFriend.resetGameList();
    }

    showRed() {
        var dt = AppGame.ins.mailModel.getdata();
        var mailCount = 0
        for (let index = 0; index < dt.length; index++) {
            //个人邮件
            if (dt[index].userId !== 0) {
                if (dt[index].status == 0){
                    mailCount++
                }
            }
            //系统邮件
            else {
                if (!ULocalStorage.getItem(dt[index].mailId)){
                    mailCount++
                }
            }
        }
        this._icon_mail_red.active = mailCount == 0 ? false : true;
        if (mailCount > 99)  this._mail_count.string = "99+"
        else this._mail_count.string = mailCount.toString()
    }

    /**监听公告消息如果有弹窗公告则直接弹出弹窗公告 */
    private update_announce_list() {
        let publicNoticeItemData = AppGame.ins.announceModel.getPublicNoticeListData();
        if (publicNoticeItemData.length > 0) {
            for (let index = 0; index < publicNoticeItemData.length; index++) {
                const element = publicNoticeItemData[index];
                if (element.bPopShow == 1) { // 如果有弹窗公告则直接弹窗
                    AppGame.ins.showUI(ECommonUI.LB_Announce, index);
                    return;
                }
            }
        }
    }

    private refreshbtn(): void {
        // var tempAccount = AppGame.ins.roleModel.getIsTempAccount();
        // this._proxNode.x = tempAccount ? 710 : 530;
        // this._regesterNode.active = tempAccount;
    }
    protected start(): void {
        this.resize_bg();
    }
    private resize_bg(): void {
        // this.scheduleOnce(() => {
        //     let size = this._bg_center.getContentSize();
        //     let s_x = size.width / 1280;
        //     let s_y = size.height / 720;
        //     this._bg_anima.setScale(s_x, s_y);
        // }, 0.05);
    }
    private onresize(): void {
        this._gamelist.onresize();
    }
    protected onEnable(): void {
        AppGame.ins.LoginModel.on(MLogin.BIND_MOBILE, this.on_bind_msg, this);
        AppGame.ins.hallModel.on(MHall.GETSCROLLERMSG, this.add_data, this);
        AppGame.ins.announceModel.on(MAnnounceModel.UPDATE_ANNOUNCE_LIST, this.update_announce_list, this);
        AppGame.ins.hallModel.on(MHall.HALL_MAIL_NOTIFY, this.on_showRed, this);
        EventManager.getInstance().addEventListener("refreshmsgMark", this.refreshChatMsgMark.bind(this), this);
        AppGame.ins.mailModel.on(MMailModel.READ_MAIL, this.showRed, this);
        AppGame.ins.mailModel.on(MMailModel.UPDATE_MAIL, this.showRed, this);

        AppGame.ins.hallModel.on(MHall.OPEN_ENTER_FRIEND_ROOM, this.onEnterFriendRoom, this);

        AppGame.ins.hallModel.on(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_ROOM_CARD, this.refreshRoomCard, this);
        // AppGame.ins.hallModel.on(MHall.GET_AGENT_LEVEL_RES, this.proxyShowHedIcon, this);

        AppGame.ins.hallModel.on(MHall.UPDATE_GAME_FINISHED_CLUB, this.onUpdateGameFinished, this);
        AppGame.ins.roomModel.on(MRoomModel.FRIEND_GAME_LIST, this.getFriendGameList, this);


    }

    //收到服务器通知后，再去请求
    on_showRed() {
        AppGame.ins.mailModel.requestPullMail();
    }
    
    protected onDisable(): void {
        AppGame.ins.LoginModel.off(MLogin.BIND_MOBILE, this.on_bind_msg, this);
        AppGame.ins.hallModel.off(MHall.GETSCROLLERMSG, this.add_data, this);
        AppGame.ins.announceModel.off(MAnnounceModel.UPDATE_ANNOUNCE_LIST, this.update_announce_list, this);
        AppGame.ins.hallModel.off(MHall.HALL_MAIL_NOTIFY, this.on_showRed, this);
        EventManager.getInstance().removeEventListener("refreshmsgMark", this.refreshChatMsgMark.bind(this), this);
        AppGame.ins.mailModel.off(MMailModel.READ_MAIL, this.showRed, this);
        AppGame.ins.mailModel.off(MMailModel.UPDATE_MAIL, this.showRed, this);
        AppGame.ins.hallModel.off(MHall.OPEN_ENTER_FRIEND_ROOM, this.onEnterFriendRoom, this);
        AppGame.ins.hallModel.off(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);
        // AppGame.ins.hallModel.off(MHall.GET_AGENT_LEVEL_RES, this.proxyShowHedIcon, this);
        AppGame.ins.roleModel.off(MRole.UPDATA_ROOM_CARD, this.refreshRoomCard, this);
        AppGame.ins.hallModel.off(MHall.UPDATE_GAME_FINISHED_CLUB, this.onUpdateGameFinished, this);
        AppGame.ins.roomModel.off(MRoomModel.FRIEND_GAME_LIST, this.getFriendGameList, this);


        cc.game.off("resize", this.onresize, this);
        cc.game.off("resize_bg", this.resize_bg, this);
        this._gamelist.resetGameList();
        this._gameListFriend.resetGameList(); 
        EventManager.getInstance().removeEventListener(cfg_event.TASK_LIST, this.getTaskList, this);
    }


    /**更新完游戏 */
    onUpdateGameFinished(gameId: EGameType) {
        UDebug.log('通知大厅更新完游戏 gameId => ', gameId);
        this._gamelist.sub_already_up_to_date(gameId);
    }

    private on_bind_msg(sucess: boolean, msg: string): void {
        if (sucess) {
            AppGame.ins.closeUI(ECommonUI.LB_Regester);
        }
        this.refreshbtn();
        AppGame.ins.showTips(msg);
    }

    private getTaskList(event: any, data: any) {
        AppGame.ins.taskList = data;
        AppGame.ins.taskReachedNum = 0;
        this.refreshTaskNum();
    }

    refreshTaskNum() {
        for (let index = 0; index < AppGame.ins.taskList.length; index++) {
            const element = AppGame.ins.taskList[index];
            if ((parseFloat(element.currentNum)) >= parseFloat(element.reachNum) && element.status != 3) {
                AppGame.ins.taskReachedNum++;
            }
        }
        if (AppGame.ins.taskReachedNum > 0) {
            //显示任务小红点
            var btn_task_icon = UNodeHelper.find(this._gameRoom, "bottomleft/btn_task/redicon");
            let task_num = UNodeHelper.getComponent(btn_task_icon, "count", cc.Label)
            btn_task_icon.active = true;
            if (AppGame.ins.taskReachedNum > 99) {
                task_num.string = "99+";
            } else {
                task_num.string = AppGame.ins.taskReachedNum + "";
            }
        } else {
            var btn_task_icon = UNodeHelper.find(this._gameRoom, "bottomleft/btn_task/redicon");
            btn_task_icon.active = false;
        }
    }

    //创建好友房列表
    getFriendGameList(){
        this._gameListFriend = new VGameListFriend(this._icon_friends)
    }
}
