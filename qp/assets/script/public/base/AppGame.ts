import UDebug from "../../common/utility/UDebug";
import UHandler from "../../common/utility/UHandler";
import UIManager from "./UIManager";
import VCircle from "./VCircle";
import cfg_scene from "../../config/cfg_scene";
import { UHttpManager } from "../../common/net/UHttpManager";
import UJsonMsg from "../../common/net/UJsonMsg";
import VLoading from "./../loading/VLoading";
import UScene from "../../common/base/UScene";
import { ECommonUI, ELevelType, EGameType, ELoginType, EMsgType, ERoomKind } from "../../common/base/UAllenum";
import UNodeHelper from "../../common/utility/UNodeHelper";
import MHall from "../hall/lobby/MHall";
import Model from "../../common/base/Model";
import MRole from "../hall/lobby/MRole";
import MSettingModel from "../hall/lb_setting/MSettingModel";
import MRoomModel from "../hall/room_zjh/MRoomModel";
import MLogin from "../login/MLogin";
import MXPQZNNModel from "../../game/xpqznn/model/MQZNNModel_xp";
import UProtoMsg from "../../common/net/UProtoMsg";
import MBrlh from "../../game/brlh/model/MBrlh";
import MZJH, { ZJH_SCALE } from "../../game/zjh/MZJH";
import UMsgCenter from "../../common/net/UMsgCenter";
import MBrebg from "../../game/brebg/model/MBrebg";
import MBaseGameModel from "../hall/MBaseGameModel";
import MSGModel from "../../game/sg/MSGModel";
import AppStatus from "./AppStatus";
import MBrnn from "../../game/brnn/model/MBrnn";
import MBJ from "../../game/blackjack/MBJ";
import MBrhh from "../../game/brhh/model/MBrhh";
import AppRenderTexture from "./AppRenderTexture";
import UAudioManager from "../../common/base/UAudioManager";
import MainHotUpdate from "../hotupdate/MainHotUpdate";
import MAnnounceModel from "../hall/announce/MAnnounceModel";
import MRannk from "../hall/rank/MRank";
import MProxy from "../hall/proxy/MProxy";
import ULanHelper from "../../common/utility/ULanHelper";
import VPersonal from "../hall/personal/VPersonal";
import { UHotManager } from "../hot/UHotManager";
import MQZNNModel from "../../game/qznn/model/MQZNNModel";
import MBrjh from "../../game/brjh/model/MBrjh";
import MQZJHModel from "../../game/qzjh/model/MQZJHModel";
import MXPJHModel from "../../game/xpjh/model/MXPJHModel";
import cfg_game from "../../config/cfg_game";
import RsaKey from "../../common/utility/RsaKey";
import JSEncrypt from 'jsencrypt'
import MBcbm from "../../game/bcbm/model/MBcbm";
import MMailModel from "../hall/lb_service_mail/Mmail_Model";
import MDDZModel from "../../game/ddz/model/MDDZ";

import cfg_lucky from "../../config/cfg_lucky";
import UEventHandler from "../../common/utility/UEventHandler";
import ULocalDB, { AccountInfo, ChatInfo, chatMsgItem, MsgObj, ULocalStorage } from "../../common/utility/ULocalStorage";
import { Game, LongHu, ProxyServer } from "../../common/cmd/proto";
import cfg_global from "../../config/cfg_global";
const CryptoJS = require('crypto-js');
import * as NodeRSA from 'node-rsa';
import { RSA_NO_PADDING } from "constants";
import ErrorLogUtil, { LogLevelType } from "../errorlog/ErrorLogUtil";
import { EventManager } from "../../common/utility/EventManager";
import cfg_event from "../../config/cfg_event";
import MPdk from "../../game/pdk/model/MPdk";
import { MD5 } from "../../common/utility/UMD5";
import UStringHelper from "../../common/utility/UStringHelper";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import MTask from "../hall/task/MTask";
import { ver } from "../../common/net/USerializer";
import MActivity from "../hall/activity_new/MActivity";
import MSSS from "../../game/sss/MSSS";
import cfg_ui from "../../config/cfg_ui";
import cfg_res from "../../config/cfg_prefab";
import cfg_friends from '../../config/cfg_friends';
import MPdk_hy from '../../game/pdk_hy/model/MPdk_hy';
import MBrbjl from '../../game/bjl/model/MBrbjl';
import MZJH_hy from '../../game/zjh_hy/MZJH_hy';
import MDDZModel_hy from "../../game/ddz_hy/model/MDDZ_hy";

import cfg_httpProxy, { API_URL_LIST_DEFIND } from "../../config/cfg_httpProxy";
import { threadId } from "worker_threads";
import MFriendsRoomCardModel from "../hall/friends/friends_room_card/MFriendsRoomCardModel";
import MClub from "../hall/club/myClub/MClub";
import MClubHall from "../hall/club/hall/MClubHall";
import MBJLRoom from "../hall/room_bjl/MBJLRoom";



const MYAES = require('AES');
const APP_KEY = "8ef1e11d5fd3a1db43a80d91fc62ebb3";

const { ccclass, property } = cc._decorator;
/**
 * 创建:gj
 * 作用：游戏主入口
 */
@ccclass
export default class AppGame extends cc.Component {
    private static _ins: AppGame;


    /**
     * 游戏单例
     */
    static get ins(): AppGame {
        window["AppGame"] = AppGame;
        return AppGame._ins;
    }
    private _appRender: AppRenderTexture;
    /**
     * ui控制器
     */
    private _uimanager: UIManager;
    /**
     * models集合
     */
    private _models: Array<Model>;
    /**
     * 大厅model
     */
    private _hallModel: MHall;

    private _roommodel: MRoomModel;
    /**
     * 玩家信息model
     */
    private _rolemodel: MRole;
    /**
     * 登陆模块
     */
    private _loginModel: MLogin;
    /**
     * 邮件模块
     */
    private _mailModel: MMailModel;
    /**
     * 
     */
    private _setting: MSettingModel;
    /**抢庄牛牛主要逻辑 */
    private _qznnModel: MQZNNModel;
    private _xpqznnModel: MXPQZNNModel;
    /**三公主要逻辑 */
    private _sgModel: MSGModel;
    private _brlhModel: MBrlh;      // 百人龙虎斗
    private _brbjlModel: MBrbjl;      // 百人百家乐
    private _brebgModel: MBrebg;    // 百人二八杠
    private _brnnModel: MBrnn;      // 百人牛牛
    private _brhhModel: MBrhh;      // 百人红黑大战
    private _brjhModel: MBrjh;      // 百人金花
    private _brbjlRoomModel: MBJLRoom;      // 百人百家乐RoomModel

    private _qzjhModel: MQZJHModel;
    private _xpqzjhModel: MXPJHModel;
    private _bcbmModel: MBcbm;
    private _ddzModel: MDDZModel;
    private _pdkModel: MPdk;
    private _sssModel: MSSS;
    private _fPdkModel: MPdk_hy;
    private _ddzModel_hy: MDDZModel_hy;
    private _friendsRoomCardModel: MFriendsRoomCardModel;

    /**
   * 扎金花
   */
    private _zjhModel: MZJH;
    private _fzjhModel: MZJH_hy;
    //**  21点 黑杰克 */
    private _bjModel: MBJ;
    private _rankModel: MRannk;
    private _proxyModel: MProxy;
    private _taskModel: MTask;
    private _activityModel: MActivity;

    //俱乐部大厅
    private _clubHallModel: MClubHall;
    //我的俱乐部
    private _myClubModel: MClub;

    private _gamebase: MBaseGameModel;
    private _announce: MAnnounceModel;
    // private _brnnModel: MBrnn;
    private _appStatus: AppStatus;

    //local rsa
    public _localRsaKey: RsaKey;

    //common rsa
    private _commonRsaKey: RsaKey;

    //common aes
    private _commonAesKey: Uint8Array;

    //客服
    private _service_items: Array<Object>;
    private _charge_service_items: Array<Object>;
    private _exCharge_service_items: Array<Object>;
    private _self_chat_item: Object;
    private _isYunxinLogin: boolean;

    private _chatToken: string;
    private _sign_password: string;
    private _sign_sign: string;
    private _message: Object;
    private _picMessage: Object;
    private _unreadMsg: number;


    private _chatMsg: Array<chatMsgItem>;
    private _selfChatMsg: chatMsgItem;
    private _taskList: any = null;
    private _taskReachedNum: number = 0;

    public _MsgType: number;
    private _kefuUrl: string;
    private _chargeUrl: string;
    private _chargePayUrl: string; // 支付URL
    private _weChatUrl: string; //微信URL
    private _downUrl: string;
    private _serverList: Array<Object> = [];
    private _serverListTemp: Array<Object> = [];
    private _commonSerVerList: Array<Object>;
    private _spareSerVerList: Array<Object>;
    private _selectServer: Object;
    public isJudge: boolean = true;
    public bankerInfo: any = null;
    public bankerBurrent: any = null;
    public bankerApply: LongHu.IMSG_GS_USER[] = [];

    public editboxserver: cc.EditBox;
    // vip等级
    private _vipLevel: number;
    public vipKeyList: Array<string> = [];
    //api接口数据
    public apiConfigData: any = null;
    //api地址列表
    private apiUrlList: Array<string> = [];
    //http是否已经成功响应
    private bHttpReturnOk: boolean = false
    //http响应失败个数
    private httpErrorCount: number = 0

    /**当前bundle name */
    public currBundleName: string = null;

    public static channelNo: number = 0;//渠道号
    /**拉起好友房游戏房间id */
    public openFriendRoomId: number = 0;
    /**当前游戏房间类型 */
    public currRoomKind: ERoomKind = ERoomKind.Normal;
    /**当前游戏id */
    public currGameId: EGameType = 0;
    /**当前俱乐部id */
    public currClubId: number = 0;
    /**当前俱乐部桌子id */
    public currClubTableId: number = -1;
    /**当前打开道具面板玩家id */
    public currPropUserId: number = 0;
    /**在线客服url */
    public serviceUrl: string = null;

    set message(v: Object) {
        this._message = v;
    }

    get message(): Object {
        return this._message;
    }

    public set picMessage(v: Object) {
        this._picMessage = v;
    }

    public get picMessage(): Object {
        return this._picMessage;
    }

    public get unreadMsg(): number {
        return this._unreadMsg
    }

    public set unreadMsg(v: number) {
        this._unreadMsg = v;
    }

    set commonAesKey(v: Uint8Array) {
        this._commonAesKey = v;
    }

    get commonAesKey(): Uint8Array {
        return this._commonAesKey;
    }

    set commonRsaKey(v: RsaKey) {
        this._commonRsaKey = v;
    }

    get commonRsaKey(): RsaKey {
        return this._commonRsaKey;
    }

    set chatMsg(cahtMsg) {
        this._chatMsg = cahtMsg;
    }

    get chatMsg(): Array<chatMsgItem> {
        return this._chatMsg;
    }

    set selfChatMsg(v: chatMsgItem) {
        this._selfChatMsg = v;
    }

    get selfChatMsg(): chatMsgItem {
        return this._selfChatMsg;
    }

    set self_chat_item(self_chat_item) {
        this._self_chat_item = self_chat_item;
    }

    get self_chat_item(): Object {
        return this._self_chat_item;
    }

    set service_items(serviceItems) {
        this._service_items = serviceItems;
    }

    get service_items(): Array<Object> {
        return this._service_items;
    }

    set charge_service_items(v: Array<Object>) {
        this._charge_service_items = v;
    }

    get charge_service_items(): Array<Object> {
        return this._charge_service_items;
    }

    set exCharge_service_items(v: Array<Object>) {
        this._exCharge_service_items = v;
    }

    get exCharge_service_items(): Array<Object> {
        return this._exCharge_service_items;
    }

    set taskList(v: any) {
        this._taskList = v;
    }

    get taskList(): any {
        return this._taskList;
    }

    get taskReachedNum(): number {
        return this._taskReachedNum;
    }

    set taskReachedNum(v: number) {
        this._taskReachedNum = v;
    }

    get appRender(): AppRenderTexture {
        return this._appRender;
    }
    get appStatus(): AppStatus {
        return this._appStatus;
    }
    get chatToken(): string {
        return this._chatToken;
    }
    set chatToken(v: string) {
        this._chatToken = v;
    }

    get sign_password(): string {
        return this._sign_password;
    }

    set sign_password(v: string) {
        this._sign_password = v;
    }

    public get sign_sign(): string {
        return this._sign_sign;
    }

    public set sign_sign(v: string) {
        this._sign_sign = v;
    }

    get isYunxinLogin(): boolean {
        return this._isYunxinLogin;
    }

    set isYunxinLogin(v: boolean) {
        this._isYunxinLogin = v;
    }

    get kefuUrl(): string {
        return this._kefuUrl;
    }

    set kefuUrl(v: string) {
        this._kefuUrl = v;
    }

    get chargeUrl(): string {
        return this._chargeUrl;
    }

    set chargeUrl(v: string) {
        this._chargeUrl = v;
    }

    get chargePayUrl(): string {
        return this._chargePayUrl;
    }
    set chargePayUrl(v: string) {
        this._chargePayUrl = v;
    }


    get weChatUrl(): string {
        return this._weChatUrl;
    }
    set weChatUrl(v: string) {
        this._weChatUrl = v;
    }
    get serverList(): Array<Object> {
        return this._serverList;
    }
    get commonSerVerList(): Array<Object> {
        return this._commonSerVerList;
    }

    get spareSerVerList(): Array<Object> {
        return this._spareSerVerList;
    }

    get selectServer(): object {
        return this._selectServer;
    }

    set selectServer(v: object) {
        this._selectServer = v;
    }

    get proxyModel(): MProxy {
        return this._proxyModel;
    }

    get clubHallModel(): MClubHall {
        return this._clubHallModel;
    }

    get myClubModel(): MClub {
        return this._myClubModel;
    }
    get announceModel(): MAnnounceModel {
        return this._announce;
    }
    get rankModel(): MRannk {
        return this._rankModel;
    }
    /**
     * 大厅的Model
     */
    get hallModel(): MHall {
        return this._hallModel;
    }
    get roleModel(): MRole {
        return this._rolemodel;
    }
    get setting(): MSettingModel {
        return this._setting;
    }

    /**
     * 扎金花room model
     */
    get roomModel(): MRoomModel {
        return this._roommodel;
    }
    /**
     * 登陆模块
     */
    get LoginModel(): MLogin {
        return this._loginModel;
    }
    get xpqznnModel(): MXPQZNNModel {
        return this._xpqznnModel;
    }
    get qznnModel(): MQZNNModel {
        return this._qznnModel;
    }
    get zjhModel(): MZJH {
        return this._zjhModel;
    }
    get fzjhModel(): MZJH_hy {
        return this._fzjhModel;
    }
    /**
     * 百人龙虎
     */
    get brlhModel(): MBrlh {
        return this._brlhModel;
    }
    /**
     * 百人百家乐
     */
    get brbjlModel(): MBrbjl {
        return this._brbjlModel;
    }
    /** 百家乐房间Model*/
    get brbjlRoomModel(): MBJLRoom {
        return this._brbjlRoomModel;
    }


    get brebgModel(): MBrebg {
        return this._brebgModel;
    }
    get brnnModel(): MBrnn {
        return this._brnnModel;
    }

    get brjhModel(): MBrjh {
        return this._brjhModel;
    }

    get brhhModel(): MBrhh {
        return this._brhhModel;
    }
    get sgModel(): MSGModel {
        return this._sgModel;
    }
    get bjModel(): MBJ {
        return this._bjModel;
    }

    get qzjhModel(): MQZJHModel {
        return this._qzjhModel;
    }

    get xpqzjhModel(): MXPJHModel {
        return this._xpqzjhModel;
    }

    get bcbmModel(): MBcbm {
        return this._bcbmModel;
    }

    get ddzModel(): MDDZModel {
        return this._ddzModel;
    }

    get pdkModel(): MPdk {
        return this._pdkModel;
    }

    get ddzModel_hy(): MDDZModel_hy {
        return this._ddzModel_hy;
    }

    get fPdkModel(): MPdk_hy {
        return this._fPdkModel;
    }

    get friendsRoomCardModel(): MFriendsRoomCardModel {
        return this._friendsRoomCardModel;
    }

    get sssModel(): MSSS {
        return this._sssModel;
    }

    /**房间公共逻辑 */
    get gamebaseModel(): MBaseGameModel {
        return this._gamebase;
    }

    get mailModel(): MMailModel {
        return this._mailModel;
    }

    /**任务 */

    get taskModel(): MTask {
        return this._taskModel;
    }

    set taskModel(v: MTask) {
        this._taskModel = v;
    }

    /**活动 */

    get activityModel(): MActivity {
        return this._activityModel;
    }

    set activityModel(v: MActivity) {
        this._activityModel = v;
    }

    set vipLevel(v: number) {
        this._vipLevel = v;
    }

    get vipLevel(): number {
        return this._vipLevel;
    }

    public _msgBox: cc.Node;
    public _forceUpdateBox: cc.Node;
    public _msgBoxContent: cc.Label;

    private _scrollMsgNode: cc.Node;
    private _chargeBtn: cc.Node;

    private _game_watch_limit_score: number = 3000;
    get game_watch_limit_score(): number {
        return this._game_watch_limit_score
    }

    @property(cc.Boolean)
    /**离线模式 */
    offline: boolean = true;
    /**
     * 初始化
     */
    private init(): void {
        AppGame._ins = this;

        cc.game.addPersistRootNode(this.node);
        this.initmodels();
        // this._pubRsaKey = new RsaKey();
        this._appRender = new AppRenderTexture(this.node);
        this._appStatus = new AppStatus();
        this._appStatus.regester();
        this.service_items = new Array();
        this.charge_service_items = new Array();
        this.exCharge_service_items = new Array();
        this._self_chat_item = new Object();
        this.chatToken = "";
        this.sign_password = "";
        this.sign_sign = "";
        this._isYunxinLogin = false;
        this._serverList = [];
        this._selectServer = null;
        //生成秘钥对
        this._localRsaKey = new RsaKey();
        this.commonRsaKey = new RsaKey();
        this.editboxserver = null;
        this._uimanager = new UIManager(this.node);
        UAudioManager.ins.init();
        this._msgBox = UNodeHelper.find(this.node, "msgbox");
        this._forceUpdateBox = UNodeHelper.find(this.node, "forceupdatebox");
        this._msgBoxContent = UNodeHelper.getComponent(this._msgBox, "root/content", cc.Label);
        this._scrollMsgNode = UNodeHelper.find(this.node, "scrollMsgNode");

        let clearbtn = UNodeHelper.find(this.node, "commonui/update_ui/btn_clear_game");
        UEventHandler.addClick(clearbtn, this.node, "AppGame", "clearAppCache");

        let qqbtn = UNodeHelper.find(this.node, "commonui/update_ui/btn_QQ");
        UEventHandler.addClick(qqbtn, this.node, "AppGame", "showQQkeFu");

        let closebtn = UNodeHelper.find(this._msgBox, "root/btn_close");
        UEventHandler.addClick(closebtn, this.node, "AppGame", "closeTipMsg");

        let surebtn = UNodeHelper.find(this.node, "msgbox/root/btn_ok");
        UEventHandler.addClick(surebtn, this.node, "AppGame", "btnok");

        let cancelbtn = UNodeHelper.find(this.node, "msgbox/root/btn_cancel");
        UEventHandler.addClick(cancelbtn, this.node, "AppGame", "closeTipMsg");

        let forcesurebtn = UNodeHelper.find(this.node, "forceupdatebox/root/btn_ok");
        UEventHandler.addClick(forcesurebtn, this.node, "AppGame", "forceDownApp");

        //初始化消息中心
        UMsgCenter.ins.init();

        this._uimanager.showupdate(true);
        
        //初始化本地配置信息
        this.initLocalConfig();
    }

    /**
     * 获取本地环境变量，版本号，渠道号
     */
    initLocalConfig() {
        let channelNoJson: object;
        cc.loader.loadRes("channelNo", (err, jsonob) => {
            channelNoJson = jsonob["json"];
            cfg_global.isHot = channelNoJson["isHot"];//大厅是否热更
            cfg_global.isSubHot = channelNoJson["isSubHot"];//子游戏是否热更
            cfg_global.isUseInputServer = channelNoJson["inputshow"];
            cfg_global.version = channelNoJson["version"];
            cfg_global.env = channelNoJson["env"];
            //获得API域名列表
            this.getApiUrlList();
        });
    }

    //获得API入口列表
    getApiUrlList() {
        //读取缓存API接口配置信息
        if (ULocalStorage.getItem("API_CONFIG_INFO")) {
            var jsonStr = ULocalStorage.getItem("API_CONFIG_INFO")
            if (UMsgCenter.ins.http.isJSON(jsonStr)) {
                this.apiConfigData = JSON.parse(jsonStr);
                this.apiConfigData.g.forEach(element => { this.apiUrlList.push(element.url) })
            }
        }
        else {
            //第一次使用默认列表
            API_URL_LIST_DEFIND.forEach(element => { this.apiUrlList.push(element) })
        }
        UDebug.log("api域名列表", this.apiUrlList)
        //遍历API址址列表
        this.httpErrorCount = 0
        this.bHttpReturnOk = false
        this.apiUrlList.forEach(
            element => {
                this.getApiConfig(element)
            }
        )
    }

    //获得配置信息
    getApiConfig(apiUrl: string) {
        //0 测试 1 开发 2 正式 3 预发布
        if (cfg_global.env == 0) apiUrl += ".test";
        else if (cfg_global.env == 1) apiUrl += ".local";
        else if (cfg_global.env == 2) apiUrl += ".prod";
        else if (cfg_global.env == 3) apiUrl += ".preview";
        UMsgCenter.ins.http.send("get", "", apiUrl, null, true, UHandler.create((response: any) => {
            if (response.sucess == 0) {
                UDebug.Log("api域名响应成功 " + apiUrl)
                if (this.bHttpReturnOk) return
                UDebug.log("配置信息 " + JSON.stringify(response.data));
                //获得网关信息
                if (response.data.s) {
                    this.getNetPortData(response.data.s)
                }
                //原生获得版本信息
                if (cc.sys.isNative) {
                    if (response.data.m) {
                        this.getVersionInfo(response.data.m)
                    }
                } else {
                    this.jumpToLogin(false, true);
                }
                this.apiConfigData = response.data
                this.bHttpReturnOk = true
            } else {
                //全部接口无返回
                this.httpErrorCount++
                if (this.httpErrorCount == this.apiUrlList.length) {
                    //使用本地缓存配置
                    if (this.apiConfigData) {
                        if (this.apiConfigData.s) {
                            this.getNetPortData(this.apiConfigData.s)
                        }
                        if (cc.sys.isNative) {
                            this._uimanager.showupdate(true);
                            UHotManager.Ins.init(UHandler.create(() => {
                                this.jumpToLogin(false, true);
                            }, this));
                        } else {
                            this.jumpToLogin(false, true);
                        }
                    }
                    else {
                        this._msgBoxContent.string = "获取配置信息失败，请检查网络！";
                        this._msgBox.setScale(1)
                        this._MsgType = EMsgType.failed
                    }
                }
                var str = '获取配置信息失败：' + apiUrl + " 失败次数： " + this.httpErrorCount + " 列表总长度： " + this.apiUrlList.length
                ErrorLogUtil.ins.addErrorLog(str, LogLevelType.DEBUG);
            }
        }));
    }


    //获得网关数据
    getNetPortData(data: any) {
        for (let index = 0; index < data[0].length; index++) {
            const element = data[0][index];
            if (element.lineLevel == 1000) {
                if (cfg_global.env == 2 || cfg_global.env == 3) {
                    AppGame.ins.chargeUrl = "http://" + element.ip + ":" + element.port;
                } else {
                    AppGame.ins.chargeUrl = "http://" + element.ip + ":" + element.port;
                }
                UDebug.log("棋牌域名：", AppGame.ins.chargeUrl);
            } else if (element.lineLevel == 1001) {
                if (cfg_global.env == 2 || cfg_global.env == 3) {
                    AppGame.ins.kefuUrl = "https://" + element.ip + ":" + element.port;
                    AppGame.ins.weChatUrl = "https://" + element.ip + ":" + element.port;
                } else {
                    AppGame.ins.kefuUrl = "http://" + element.ip + ":" + element.port;
                    AppGame.ins.weChatUrl = "http://" + element.ip + ":" + element.port;
                }
                UDebug.log("客服域名：", AppGame.ins.kefuUrl);
                UDebug.log("微信域名：", AppGame.ins.weChatUrl);
            } else if (element.lineLevel == 1002) {
                if (cfg_global.env == 2 || cfg_global.env == 3) {
                    AppGame.ins.chargePayUrl = "https://" + element.ip + ":" + element.port;
                } else {
                    AppGame.ins.chargePayUrl = "http://" + element.ip + ":" + element.port;
                }
                UDebug.log("支付域名：", AppGame.ins.chargePayUrl);
            } else if (element.lineLevel == 1003) {
                AppGame.ins.serviceUrl = element.ip;
                UDebug.log("在线客服url：", AppGame.ins.serviceUrl);
            } else {
                this._serverListTemp.push(element);
            }
        }

        //解密VIP线路,一个VIP可能对应多个线路
        if (ULocalStorage.getItem("VIP")) {
            var vipObj = JSON.parse(ULocalStorage.getItem("VIP"))
            this._vipLevel = vipObj.level;
            var vipUrlStr = data[this.vipLevel]
            UDebug.log("解密VIP:", vipObj.level, "原文:", vipUrlStr, "密钥:", vipObj.aesKey);
            let jsonStr = AppGame.ins._localRsaKey.decryptAes(vipUrlStr, vipObj.aesKey);
            if (UMsgCenter.ins.http.isJSON(jsonStr)) {
                var data = JSON.parse(jsonStr);
                data.forEach(element => {
                    this._serverListTemp.push(element);
                });
            }
        } else {
            this._vipLevel = 0;
        }

        //生成网关列表
        for (var k in this._serverListTemp) {
            let serverObj = {
                key: "server" + k,
                server: this._serverListTemp[k]
            }
            this._serverList.push(serverObj)
        }
        UDebug.log("网关列表", JSON.stringify(this._serverList));
    }

    //获取版本信息
    getVersionInfo(data: any) {
        let version = data.version;
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            this._downUrl = data.downUrl;
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            this._downUrl = data.downUrlIos;
        }
        let isDownLoadApp = this.chekVersion(version);
        //底包更新
        if (isDownLoadApp) {
            var isForce = data.isForce
            //强制重新安装
            if (isForce) {
                this._forceUpdateBox.setScale(1)
            } else {
                this._MsgType = EMsgType.downapp;
                this._msgBoxContent.string = "发现新的APP版本，确定需要安装新的版本吗？";
                this._msgBox.setScale(1)
                this._uimanager.showLoadingProgress(false);
            }
        }
        //热更新
        else {
            this._uimanager.showupdate(true);
            UHotManager.Ins.init(UHandler.create(() => {
                this.jumpToLogin(false, true);
            }, this));
        }
    }

    /**
     * 跳转到登陆场景
     * @param data 
     * @param handler 
     */
    jumpToLogin(data?: any, isLogin?: boolean, handler?: UHandler): void {
        this._uimanager.showupdate(false);
        if (!isLogin) {
            UMsgCenter.ins.closepeer();
        }
        this.loadLevel(ELevelType.Login, data, handler);
    }
    private clearmodels(): void {
        this._models.forEach(element => {
            element.resetData();
        });
    }

    initChatMsg() {
        this._chatMsg = new Array();
        this._selfChatMsg = new chatMsgItem();
        this.unreadMsg = 0;
        let isInDb = false;
        if (ULocalDB.getDB("chatMsg")) {
            this._chatMsg = ULocalDB.getDB("chatMsg");
            this._chatMsg.forEach(element => {
                if (element.accountId == AppGame.ins.roleModel.useId) {
                    this._selfChatMsg = element;
                    isInDb = true;
                }
            });
        }
        if (!isInDb) {
            // let msgItem = new chatMsgItem();
            this._selfChatMsg.accountId = AppGame.ins.roleModel.useId;
            this._selfChatMsg.chatInfoArr = [];
            this._chatMsg.push(this._selfChatMsg);
        }
        ULocalDB.SaveDB("chatMsg", this._chatMsg);
        this._selfChatMsg.chatInfoArr.forEach(element => {
            element.msgBody.forEach(element1 => {
                if (!element1.isRead) {
                    this.unreadMsg += 1;
                }
            })
        });
    }

    generateAesKey(fun: Function) {
        this._localRsaKey.generate(this.getLocalKey.bind(this));
        fun();
    }

    //#region  初始化model
    /**
     * 初始化models
     */
    public initmodels(): void {
        this._models = [];
        this._hallModel = new MHall();
        this._hallModel.init();
        this._models.push(this._hallModel);

        this._roommodel = new MRoomModel();
        this._roommodel.init();
        this._models.push(this._roommodel);

        this._rolemodel = new MRole();
        this._rolemodel.init();
        this._models.push(this._rolemodel);

        this._setting = new MSettingModel();
        this._setting.init();
        this._models.push(this._setting);

        this._loginModel = new MLogin();
        this._loginModel.init();
        this._models.push(this._loginModel);
        this._gamebase = new MBaseGameModel();
        this._gamebase.init();
        this._models.push(this._gamebase);
        this._qznnModel = new MQZNNModel();
        this._qznnModel.init();
        this._models.push(this._qznnModel);

        this._xpqznnModel = new MXPQZNNModel();
        this._xpqznnModel.init();
        this._models.push(this._xpqznnModel);

        this._brlhModel = new MBrlh();
        this._brlhModel.init();
        this._models.push(this._brlhModel);

        this._brbjlModel = new MBrbjl();
        this._brbjlModel.init();
        this._models.push(this._brbjlModel);

        this._brbjlRoomModel = new MBJLRoom();
        this._brbjlRoomModel.init();
        this._models.push(this._brbjlRoomModel);

        this._brjhModel = new MBrjh();
        this._brjhModel.init();
        this._models.push(this._brjhModel);

        this._brebgModel = new MBrebg();
        this._brebgModel.init();
        this._models.push(this._brebgModel);

        this._brnnModel = new MBrnn();
        this._brnnModel.init();
        this._models.push(this._brnnModel);

        this._brhhModel = new MBrhh();
        this._brhhModel.init();
        this._models.push(this._brhhModel);


        this._sgModel = new MSGModel();
        this._sgModel.init();
        this._models.push(this._sgModel);


        this._zjhModel = new MZJH();
        this._zjhModel.init();
        this._models.push(this._zjhModel);


        this._fzjhModel = new MZJH_hy();
        this._fzjhModel.init();
        this._models.push(this._fzjhModel);

        this._bjModel = new MBJ();
        this._bjModel.init();
        this._models.push(this._bjModel);

        this._qzjhModel = new MQZJHModel();
        this._qzjhModel.init();
        this._models.push(this._qzjhModel);

        this._xpqzjhModel = new MXPJHModel();
        this._xpqzjhModel.init();
        this._models.push(this._xpqzjhModel);

        this._bcbmModel = new MBcbm();
        this._bcbmModel.init();
        this._models.push(this._bcbmModel);

        this._ddzModel = new MDDZModel();
        this._ddzModel.init();
        this._models.push(this._ddzModel);

        this._pdkModel = new MPdk();
        this._pdkModel.init();
        this._models.push(this._pdkModel);

        this._fPdkModel = new MPdk_hy();
        this._fPdkModel.init();
        this._models.push(this._fPdkModel);

        this._ddzModel_hy = new MDDZModel_hy();
        this._ddzModel_hy.init();
        this._models.push(this._ddzModel_hy);

        this._friendsRoomCardModel = new MFriendsRoomCardModel();
        this._friendsRoomCardModel.init();
        this._models.push(this._friendsRoomCardModel);

        this._sssModel = new MSSS();
        this._sssModel.init();
        this._models.push(this._sssModel);

        this._announce = new MAnnounceModel();
        this._announce.init();
        this._models.push(this._announce);

        this._rankModel = new MRannk();
        this._rankModel.init();
        this._models.push(this._rankModel);

        this._proxyModel = new MProxy();
        this._proxyModel.init();
        this._models.push(this._proxyModel);

        this._mailModel = new MMailModel();
        this.mailModel.init();
        this._models.push(this._mailModel);

        this._taskModel = new MTask();
        this.taskModel.init();
        this._models.push(this._taskModel);

        this._activityModel = new MActivity();
        this.activityModel.init();
        this._models.push(this._activityModel);

        this._clubHallModel = new MClubHall();
        this._clubHallModel.init();
        this._models.push(this._clubHallModel);

        this._myClubModel = new MClub();
        this._myClubModel.init();
        this._models.push(this._myClubModel);


    }
    //#endregion
    //#region  系统方法
    protected onLoad(): void {
        this.setComponentPrototype();
        // this.preLoadLoadingBgs();
        this.init();
        if (cfg_global.env == 2) {
            UDebug.isoff = false;
        } else {
            UDebug.isoff = false;
        }
        ErrorLogUtil.ins.onErrorLog();

        this.openFriendRoomId = UAPIHelper.returnOption();

        // @ts-ignore
        window.isInMain = false;
        EventManager.getInstance().addEventListener(cfg_event.INIT_CHATDB, this.initChatMsg.bind(this), this);
        EventManager.getInstance().addEventListener(cfg_event.LOGIN_YUNXIN, this.loginChatServer.bind(this), this);

        this.initYunxinCallbacks();
        window.closeMsgBox = () => {
            console.log("关闭修复弹窗");
            this._msgBox.setScale(0);
        }
    }

    onDestroy() {
        EventManager.getInstance().removeEventListener(cfg_event.LOGIN_YUNXIN, this.loginChatServer.bind(this), this);
        EventManager.getInstance().removeEventListener(cfg_event.INIT_CHATDB, this.initChatMsg.bind(this), this);
    }

    /**预加载loading页目录 */
    preLoadLoadingBgs() {
        cc.resources.loadDir('start/texture/loading/loadingBg', cc.Texture2D, (finish: number, total: number, item: cc.AssetManager.RequestItem) =>{
            // cc.warn('预加载loading页目录  完成finish: '+ finish + ' total: '+ total)
        }, (err, items) =>{
            // cc.warn('预加载loading页目录  完成100%  ' + items)
        }) 
    }

    //获得本地生成的公钥私钥
    getLocalKey() {
        let localAesKey = this._localRsaKey.aesKey;
        //UDebug.Log(`AES秘钥:${localAesKey}`);
    }


    protected update(dt: number): void {
        let len = this._models.length;
        for (let i = 0; i < len; i++) {
            let item = this._models[i];
            item.update(dt);
        }
        UMsgCenter.ins.update(dt);
    }

    loadGameScene(gameType: EGameType, data: any, handler?: UHandler) {
        this.setLoadingShow(true);
        var isFriend: boolean = data.roomData.roomKind == ERoomKind.Friend;
        let bundleName = isFriend ? cfg_friends[gameType].bundleName : cfg_game[gameType].bundleName;
        let lv = isFriend ? cfg_friends[gameType].lvType : cfg_game[gameType].lvType;
        let cfg = cfg_scene[lv];
        if (gameType == EGameType.ZJH) {
            this.setLoadingShow(false);
            let prefabName = cfg_ui[cfg_game[gameType].gameUI].resName;
            let prefabUrl = cfg_res[prefabName].url;
            this._uimanager.showUI(ECommonUI.Loading, {
                prefab: prefabUrl,
                eType: lv,
                handler: UHandler.create((resObj?: any) => {
                    let dt = resObj.dt;
                    let res = resObj.res;
                    if (!dt) {
                        cc.loader.loadRes(prefabUrl, cc.Prefab, (er, asset) => {
                            if (er) {
                                UDebug.error("er", er);
                            } else {
                                let gamePrefab: any = cc.instantiate(asset)
                                let scene = this._uimanager.afterchangelevel(gamePrefab);
                                let sc = gamePrefab.getComponent(UScene);
                                if (sc) {
                                    sc.openScene(data);
                                } else {
                                    throw new Error("该场景没有对应的场景类,请在场景Canvas上挂接对应场景->" + cfg.sceneName);
                                }
                                if (handler) handler.runWith(dt);
                            }
                        })
                    } else {
                        let cfg = cfg_game[gameType];
                        AppGame.ins.closeUI(cfg.roomUI);
                        let gamePrefab: any = cc.instantiate(res)
                        let scene = this._uimanager.afterchangelevel(gamePrefab);
                        let sc = gamePrefab.getComponent(UScene);
                        if (sc) {
                            sc.openScene(data);
                        } else {
                            // throw new Error("该场景没有对应的场景类,请在场景Canvas上挂接对应场景->" + cfg.sceneName);
                        }
                        if (handler) handler.runWith(dt);
                    }
                }, this)
            });
            return
        }
        let gameUI = isFriend ? cfg_friends[gameType].gameUI : cfg_game[gameType].gameUI;
        UDebug.log("加载Bundle loadGameScene bundleName => ", bundleName)
        cc.assetManager.loadBundle(bundleName, null, (err, bundle) => {
            this.setLoadingShow(false);
            if (err) {
                cc.error("加载bundle失败", err)
                return
            }
            AppGame.ins.currBundleName = bundleName;
            let prefabName = isFriend ? cfg_ui[cfg_friends[gameType].gameUI].resName : cfg_ui[cfg_game[gameType].gameUI].resName;
            let prefabUrl = cfg_res[prefabName].url;
            this._uimanager.showUI(ECommonUI.Loading, {
                prefab: prefabUrl,
                eType: lv,
                bundle: bundle,
                handler: UHandler.create((resObj?: any) => {
                    let dt = resObj.dt;
                    let res = resObj.res;
                    if (!dt) {
                        this._uimanager.beforchangeLevelComplete();
                        UDebug.Log("   加载场景->");
                        let prefabName = isFriend ? cfg_ui[cfg_friends[gameType].gameUI].resName : cfg_ui[cfg_game[gameType].gameUI].resName;
                        let prefabUrl = cfg_res[prefabName].url;
                        bundle.load(prefabUrl, cc.Prefab, (er, asset) => {
                            if (er) {
                                UDebug.error("er", er);
                            } else {
                                let gamePrefab: any = cc.instantiate(asset)
                                let scene = this._uimanager.afterchangelevel(gamePrefab);
                                let sc = gamePrefab.getComponent(UScene);
                                if (sc) {
                                    sc.openScene(data);
                                } else {
                                    throw new Error("该场景没有对应的场景类,请在场景Canvas上挂接对应场景->" + cfg.sceneName);
                                }
                                if (handler) handler.runWith(dt);
                            }
                        })
                    } else {
                        let cfg = isFriend ? cfg_friends[gameType] : cfg_game[gameType];
                        AppGame.ins.closeUI(cfg.roomUI);
                        let gamePrefab: any = cc.instantiate(res)
                        let scene = this._uimanager.afterchangelevel(gamePrefab);
                        let sc = gamePrefab.getComponent(UScene);
                        if (sc) {
                            sc.openScene(data);
                        } else {
                            throw new Error("该场景没有对应的场景类,请在场景Canvas上挂接对应场景->" + cfg.sceneName);
                        }
                        if (handler) handler.runWith(dt);
                    }
                }, this)
            });
        })
    }
    //#endregion 
    /**
    *  加载完场景之后直接跳转
    * @param lv 跳转场景的类型
    * @param data 场景跳转传递的参数
    * @param handler 资源下载完毕
    */
    loadLevel(lv: ELevelType, data?: any, handler?: UHandler): void {
        let cfg = cfg_scene[lv];
        this._uimanager.showUI(ECommonUI.Loading, {
            eType: lv,
            handler: UHandler.create((dt) => {
                if (!dt) {
                    this._uimanager.beforchangeLevelComplete();
                    UDebug.Log("   加载场景->" + cfg.sceneName);
                    cc.director.loadScene(cfg.sceneName, () => {
                        let scene = this._uimanager.afterchangelevel();
                        let sc = scene.getComponent(UScene);
                        if (sc) {
                            sc.openScene(data);
                        } else {
                            throw new Error("该场景没有对应的场景类,请在场景Canvas上挂接对应场景->" + cfg.sceneName);
                        }
                        if (handler) handler.runWith(dt);
                        // try {
                        //     let scene = this._uimanager.afterchangelevel();
                        //     let sc = scene.getComponent(UScene);
                        //     if (sc) {
                        //         sc.openScene(data);
                        //     } else {
                        //         throw new Error("该场景没有对应的场景类,请在场景Canvas上挂接对应场景->" + cfg.sceneName);
                        //     }
                        //     if (handler) handler.runWith(dt);
                        // } catch{
                        //     AppGame.ins.closeUI(ECommonUI.Loading);
                        //     if (handler) handler.runWith(dt);
                        // }
                    });
                } else {
                    AppGame.ins.closeUI(ECommonUI.Loading);
                    if (handler) handler.runWith(dt);
                }
            }, this)
        });

    }

    /**
     * 显示UI
     * @param uiType ui类型
     * @param data 传递的数据
     */
    showBundleUI(uiType: ECommonUI, gameType: EGameType, data?: any, needCircle: boolean = true, handler?: UHandler): void {
        this._uimanager.showBundleUI(uiType, gameType, data, needCircle, handler);
    }

    /**
     * 显示UI
     * @param uiType ui类型
     * @param data 传递的数据
     */
    showUI(uiType: ECommonUI, data?: any, needCircle: boolean = true): void {
        this._uimanager.showUI(uiType, data, needCircle);
    }

    /**
    * 显示连接中的ui
    * @param value 
    */
    showConnect(value: boolean, type: number = 1): void {
        this._uimanager.showConnect(value, type);
    }
    /**
    * 显示tips
    * @param content 1 string 或者 {data:string,type:ETipType,time:number} 0=ETipType.repeat 1=ETipType.onlyone
    *  onlyone的时候会比较内容 内容相同只会显示一个，但是只是与上一条相比
    *  time默认是2秒
    */
    showTips(content: any): void {
        this._uimanager.showTips(content);
    }
    /**
     * 关闭UI
     * @param uiType 
     * @param cb 
     */
    closeUI(uiType: ECommonUI, cb?: UHandler): void {
        this._uimanager.hideUI(uiType, cb);
    }
    /**
     * 退出游戏
     */
    exitGame(): void {
        UMsgCenter.ins.closepeer();
        cc.audioEngine.stopAll();
        cc.game.end();
    }
    setLoadingShow(value: boolean): void {
        this._uimanager.setLoadingShow(value);
    }
    checkconnenct(): boolean {
        if (!UMsgCenter.ins.isconnenct)//链接断开
        {
            UDebug.Log("网络链接断开")
            this.setLoadingShow(false);
            this.showUI(ECommonUI.NewMsgBox, {
                type: 1, data: ULanHelper.NET_ERROR, handler: UHandler.create(() => {
                    AppGame.ins.exitGame();
                }, this)
            })
            return false;
        }
        return true
    }

    //登录云信
    loginChatServer(tempBool: boolean = false) {
        // let _pwd = "quantest123";
        let _pwd = "byq123456";
        let _userName = "service_300_1";
        let _login = "F01A02";
        UDebug.log("加密前密码" + _pwd);
        let rsaKey = new RsaKey();

        let cryptPassword = rsaKey.crypt_password(_pwd);
        UDebug.log("加密后密码1" + cryptPassword);
        let cryptPassword1 = encodeURIComponent(cryptPassword);
        UDebug.log("加密后密码2" + cryptPassword1);

        let root = {};
        root["jkid"] = _login;
        root["username"] = AppGame.ins.roleModel.useId;
        root["password"] = cryptPassword1;
        if (tempBool) {
            root["refreshToken"] = 1;
        }
        let rooJsonStr = JSON.stringify(root);
        let client = { "jkid": _login, "jkparam": rooJsonStr };
        // AppGame.ins.showConnect(true);
        let url = AppGame.ins.chargeUrl + "/sbin";
        UMsgCenter.ins.http.send("post", "", url, client, false, UHandler.create((response: any) => {
            // let responsestr = JSON.stringify(response);
            let self = this;
            UDebug.log("response 类型" + JSON.stringify(response));
            if (response.sucess == 0) {
                //初始化客服列表
                let result = response.data.root.result;
                for (let index = 0; index < result.length; index++) {
                    const element = result[index];
                    AppGame.ins.chatToken = element["nim_token"];
                    AppGame.ins.sign_password = element["sign_password"];
                    AppGame.ins.sign_sign = element["sign_token"];
                }
                self.getKefuList();
            } else {
                var str = '客服接口异常：' + '__url：' + url + ' 请求参数params = ' + JSON.stringify(client);
                ErrorLogUtil.ins.addErrorLog(str, LogLevelType.ERROR);
            }
        }))
    }

    getKefuList() {
        var parms = {
            "token": new RsaKey().arrayBufferToBase64(AppGame.ins.roleModel.gamePass),
            "userId": AppGame.ins.roleModel.useId,
            "methodName": cfg_httpProxy.kefuList,
            "publicKey": "",
        };
        let url = "";
        url = AppGame.ins.kefuUrl + "/apps/kefu.php";
        AppGame.ins.service_items = [];
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                let self = this;
                UDebug.Log("   " + data.data);
                if (data.data == null) {
                    ErrorLogUtil.ins.addErrorLog("获取客服列表数据异常data = " + JSON.stringify(data.data), LogLevelType.ERROR);
                }
                if (data.data != null && data.data.code != null && data.data.code == 0) {
                    let self = this;
                    data.data.data.forEach(element => {
                        AppGame.ins.service_items.push(element);
                        if (element.type == 1) {

                        } else if (element.type == 2) {
                            AppGame.ins.charge_service_items.push(element);

                        } else if (element.type == 3) {
                            AppGame.ins.exCharge_service_items.push(element);
                        }
                    });
                    self.initYunxin();
                } else {
                    var str = '客服列表接口异常：' + '__url：' + url + ' 请求参数params = ' + JSON.stringify(parms);
                    ErrorLogUtil.ins.addErrorLog(str, LogLevelType.ERROR);
                }
            }, this, true));
    }

    //初始化云信
    initYunxin() {
        let userName = "byq_" + AppGame.ins.roleModel.useId;
        let userToken = AppGame.ins.chatToken;
        let self = this;
        UDebug.Log(`云信登陆，userName:${userName} ,userToken:${userToken} ,APP_KEY:${APP_KEY}`);
        if (cc.sys.isNative) {
            UAPIHelper.initYunxin(userName, userToken);
        } else {
            //初始化云信
            window.nim = SDK.NIM.getInstance({
                debug: true,   // 是否开启日志，将其打印到console。集成开发阶段建议打开。
                appKey: APP_KEY,
                account: userName,
                token: userToken,
                db: true, //若不要开启数据库请设置false。SDK默认为true。
                // privateConf: {}, // 私有化部署方案所需的配置
                onconnect: window.onConnectYX.bind(self),
                //onwillreconnect: window.onWillReconnectYX.bind(self),
                ondisconnect: window.onDisconnectYX.bind(self),
                onerror: window.onErrorYX.bind(self),
                onmsg: window.onMessageYX.bind(self),
                onsysmsg: window.onSysMsg.bind(self),
            });
        }
    }

    initYunxinCallbacks() {
        window.onConnectYX = (service_data_item: any) => {
            let self = this;
            AppGame.ins.showConnect(false);
            AppGame.ins.isYunxinLogin = true;
            UDebug.Log('云信连接成功js');
        };
        window.onSysMsg = (msg) => {
            console.log("撤回消息返回：", msg)

            if (cc.sys.OS_IOS == cc.sys.os) {
                let strArr = msg.split(",")
                let json = {
                    type: strArr[0],
                    msg: {
                        idServer: strArr[1],
                        msgId: strArr[2],
                        err: strArr[3],
                    }
                }
                msg = json;
            } else {
                msg = JSON.parse(msg);
            }
            let err = msg["err"]
            if (err) {
                AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                    type: 1, data: "超过2分钟的消息，不能撤回"
                });
                return;
            }
            let type = msg["type"];
            switch (type) {
                case "deleteMsg":
                    let data = msg["msg"];
                    console.log("data:", data);
                    EventManager.getInstance().raiseEvent(cfg_event.ON_DELET_MSG, {
                        DBidServer: data.idServer,
                        msgId: data.from,
                    });
                    break;
            };
        };

        window.onMessageYX = (msg: any) => {
            let self = this;
            let encryText = "";
            let time1: number = null;
            let originalMag = {};
            if (cc.sys.isNative) {
                let rsaKey = new RsaKey();
                let tempMsg: string = msg;

                let idServer = tempMsg.split(',')[1];
                let sessionId = tempMsg.split(',')[2];
                time1 = parseInt(tempMsg.split(',')[3]);
                msg = tempMsg.split(',')[0];
                UDebug.log(`截取字符串消息时间：${msg}`);
                encryText = rsaKey.deCrypt_password(msg).toString();
                originalMag["idServer"] = idServer;
                originalMag["sessionId"] = sessionId;
            } else if (cc.sys.isBrowser) {
                let rsaKey = new RsaKey();
                encryText = rsaKey.deCrypt_password(msg.text).toString();
                time1 = msg.time;
            }
            UDebug.log(`消息时间：${time1}  消息内容：${encryText}`);
            let encryTextObj = JSON.parse(encryText);
            let selfUid = "byq_" + AppGame.ins.roleModel.useId;
            UDebug.Log("selfUid" + selfUid);
            let isSelf = false;
            let msgkey: string = "";
            if (selfUid == encryTextObj["from"] || selfUid == "byq_" + encryTextObj["from"]) {
                isSelf = true;
                msgkey = encryTextObj["to"];
            } else {
                isSelf = false;
                msgkey = encryTextObj["from"];
            }
            let msgObj = new MsgObj();
            msgObj.isSelf = isSelf;
            if (!isSelf) {
                msgObj.isRead = false;
                AppGame.ins.unreadMsg++;
            } else {
                msgObj.isRead = true;
            }

            msgObj.content = encryTextObj["content"];
            msgObj.msgType = encryTextObj["messageType"];
            msgObj.msgId = msgkey;
            msgObj.time = time1;
            if (cc.sys.isNative) {
                msgObj.originalMag = originalMag;
            } else {
                msgObj.originalMag = msg;
            }


            let isInDb = false;
            AppGame.ins.selfChatMsg.chatInfoArr.forEach(element => {
                if (element.msgId == msgkey) {
                    element.msgBody.push(msgObj);
                    if (!isSelf) {
                        element.unread += 1;
                    }
                    isInDb = true;
                }
            });
            if (!isInDb) {
                let chatInfo = new ChatInfo();
                chatInfo.msgId = msgkey;
                chatInfo.msgBody = [];
                if (!isSelf) {
                    chatInfo.unread = 1;
                } else {
                    chatInfo.unread = 0;
                }
                chatInfo.msgBody.push(msgObj)
                AppGame.ins.selfChatMsg.chatInfoArr.push(chatInfo);
            }
            try {

                EventManager.getInstance().raiseEvent(cfg_event.REFRESH_MSG_MARK);
            } catch (error) {
                cc.warn(error);
            }
            AppGame.ins.chatMsg.forEach(element => {
                if (element.accountId == AppGame.ins.roleModel.useId) {
                    element = AppGame.ins.selfChatMsg;
                }
            });
            ULocalDB.SaveDB("chatMsg", AppGame.ins.chatMsg);
            EventManager.getInstance().raiseEvent(cfg_event.RECIEVE_MSG, msgObj);
        };

        window.onWillReconnectYX = (obj) => {
            UDebug.Log('即将重连');
            UDebug.Log(obj.retryCount);
            UDebug.Log(obj.duration);
        };

        window.onDisconnectYX = (error) => {
            // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
            UDebug.Log('丢失连接');
            UDebug.Log(error);
            if (error) {
                switch (error.code) {
                    // 账号或者密码错误, 请跳转到登录页面并提示错误
                    case 302:
                        break;
                    // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
                    case 417:
                        break;
                    // 被踢, 请提示错误后跳转到登录页面
                    case 'kicked':
                        break;
                    default:
                        break;
                }
            }
        };

        window.onException = (exception) => {
            UDebug.Log('云信登录异常' + exception);
            AppGame.ins.showTips("客服系统登录异常,");
        };

        window.onErrorYX = (code: any) => {
            AppGame.ins.isYunxinLogin = false;
            let tempCode = String(code)
            if (tempCode) {
                switch (tempCode) {
                    // 账号或者密码错误, 请跳转到登录页面并提示错误
                    case "302":
                        UDebug.Log("云信登录失败" + tempCode);
                        this.loginChatServer(true);
                        AppGame.ins.showTips("客服系统登录失败,账号或者密码错误");
                        break;
                    // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
                    case "417":
                        UDebug.Log("云信登录失败" + tempCode);
                        AppGame.ins.showTips("客服系统登录失败,重复登录");
                    case "415":
                        UDebug.Log("云信登录失败" + tempCode);
                        // AppGame.ins.showTips("客服系统登录失败,正在重启游戏!");
                        this.scheduleOnce(function () {
                            // cc.game.restart();
                            this.loginChatServer();
                        }, 5);
                        break;
                    // 被踢, 请提示错误后跳转到登录页面
                    case 'kicked':
                        UDebug.Log("云信登录失败" + tempCode);
                        AppGame.ins.showTips("客服系统登录失败,被踢");
                        break;
                    default:
                        AppGame.ins.showTips("客服系统登录失败:" + tempCode);
                        break;
                }
            }
        };

        window.pushMsg = (msg: any) => {
            UDebug.log("pushMsg.....msg", msg);
            let self = this;
            window.onMessageYX(msg);
        };
        window.pushMsgAndroid = (andMsg: any) => {
            UDebug.log("android 收到的时间戳1", andMsg);
            andMsg = JSON.parse(andMsg);
            let time = andMsg["time"];
            UDebug.log("收到的时间戳2", time);
            let msgType: string = null;
            let msg = null;
            if (AppGame.ins.message) {
                UDebug.log("文本消息初始化1" + JSON.stringify(AppGame.ins.message));
                msg = AppGame.ins.message;
                AppGame.ins.message = null;
                msgType = '1';
            } else if (AppGame.ins.picMessage) {
                UDebug.log("图片消息初始化1" + JSON.stringify(AppGame.ins.picMessage));
                msg = AppGame.ins.picMessage;
                AppGame.ins.picMessage = null;
                msgType = '2';
            }
            UDebug.log("消息*************************", msg);
            // UDebug.Log('cccccccccccccccccccccccccccccccccccccccccc'+JSON.stringify(msg));
            let selfUid = "byq_" + AppGame.ins.roleModel.useId;
            UDebug.Log("selfUid" + selfUid);
            let msgkey: string = msg['to'];
            let msgObj = new MsgObj();
            msgObj.isSelf = true;
            msgObj.content = msg['sendMsgStr'];
            msgObj.msgType = msgType;
            msgObj.isRead = true;
            msgObj.msgId = msgkey;
            msgObj.time = parseInt(time);

            msgObj.originalMag = msg;
            msgObj.originalMag["idServer"] = andMsg["idServer"];
            UDebug.log(`消息时间：${time}  消息内容：${msg['sendMsgStr']}`);
            let isInDb = false;
            AppGame.ins.selfChatMsg.chatInfoArr.forEach(element => {
                if (element.msgId == msgkey) {
                    element.msgBody.push(msgObj);
                    element.unread += 1;
                    isInDb = true;
                }
            });
            if (!isInDb) {
                let chatInfo = new ChatInfo();
                chatInfo.msgId = msgkey;
                chatInfo.msgBody = [];
                chatInfo.unread = 1;
                chatInfo.msgBody.push(msgObj)
                AppGame.ins.selfChatMsg.chatInfoArr.push(chatInfo);
            }
            ULocalDB.SaveDB("chatMsg", AppGame.ins.chatMsg);
            EventManager.getInstance().raiseEvent(cfg_event.RECIEVE_MSG, msgObj);
        };
    }

    //发送消息
    sendChargeMsg(chargeMsgStr: string, _service_data_item: any) {
        AppGame.ins.showConnect(true);
        this.scheduleOnce(() => {
            AppGame.ins.showConnect(false);
        }, 3);
        let self = this;
        let root: Object = {};
        root["messageType"] = "1";
        root["conversationType"] = "1";

        root["from"] = AppGame.ins.roleModel.useId;
        root["my_avatar"] = _service_data_item.avatar;
        root["my_name"] = AppGame.ins.roleModel.nickName;

        root["to"] = _service_data_item.name;
        root["to_avatar"] = _service_data_item.avatar;
        root["to_name"] = _service_data_item.name;

        root["my_group_member"] = "3";
        root["content"] = chargeMsgStr;

        let msg_id: string = UStringHelper.createUUID();
        root["client_msg_id_"] = msg_id;

        let sendMsg = JSON.stringify(root);
        let sendMsgStr: string = new RsaKey().crypt_password(sendMsg).toString();

        let msgObj = { sendMsgStr: sendMsgStr, to: _service_data_item.name };
        let msgObjLocal = { sendMsgStr: chargeMsgStr, to: _service_data_item.name };
        let msgStr = JSON.stringify(msgObj);
        UDebug.Log("发送消息json串" + msgStr);
        AppGame.ins.message = msgObjLocal;
        if (cc.sys.isNative) {
            UAPIHelper.sendText(msgStr);
            // UAPIHelper.sendPicture();
        } else {
            window.nim.sendText({
                scene: 'p2p',
                to: _service_data_item.name,
                // to: "service_300_2",
                text: sendMsgStr,
                done: (err, msg) => {
                    window.pushMsg(msg);
                }
            })
        }
    }

    chekVersion(version: string): boolean {
        UDebug.Log("新版本：" + version.split(".")[1] + "旧版本：" + cfg_global.version.split(".")[1]);
        if (version.split(".")[1] != cfg_global.version.split(".")[1]) {
            UDebug.Log("需要更新了。。。。。。。。。")
            return true;
        } else {
            return false;
        }
    }

    downLoadApp() {
        UDebug.Log("下载地址：" + this._downUrl)
        cc.sys.openURL(this._downUrl);
        // this.scheduleOnce(function () {
        //     // if (cc.sys.os == cc.sys.OS_ANDROID) {
        //     //     this._msgBoxContent.string = "正在下载包体，下载完毕后请重新安装";
        //     // }
        //     UAPIHelper.downloadApkAndInstall(this._downUrl);
        // }, 1);            
    }

    //清除缓存提示
    clearAppCache() {
        this._msgBoxContent.string = "清除后会重新下载最新资源，确定需要清除缓存吗？";
        this._MsgType = EMsgType.clear
        this._msgBox.setScale(1)
    }

    //QQ客服提示
    showQQkeFu() {
        if (AppGame.ins.serviceUrl) {
            cc.sys.openURL(AppGame.ins.serviceUrl);
        }
        // let lastSuccess = null;
        // AppGame.ins.LoginModel.getAccount((a: AccountInfo) => {
        //     lastSuccess = a;
        // });
        // let tempStr = ""
        // if (lastSuccess) {
        //     tempStr = "\nID: " + lastSuccess.userId;
        // }

        // this._msgBoxContent.string = "请联系客服QQ: 2318701585" + tempStr
        // this._MsgType = EMsgType.kefu
        // this._msgBox.setScale(1)
    }

    //关闭提示窗口
    closeTipMsg() {
        if (this._MsgType == EMsgType.downapp) {
            this._uimanager.showupdate(true);
            UHotManager.Ins.init(UHandler.create(() => {
                this.jumpToLogin(false, true);
            }, this));
        }
        this._msgBox.setScale(0)
    }

    //确定
    btnok() {
        //下载新包
        if (this._MsgType == EMsgType.downapp) {
            this.downLoadApp()
        }
        //清除缓存
        else if (this._MsgType == EMsgType.clear) {
            this._msgBox.setScale(0)
            var localCache = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'game-remote-asset')
            var localCacheTemp = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'game-remote-asset_temp')
            if (jsb.fileUtils.isDirectoryExist(localCache)) {
                jsb.fileUtils.removeDirectory(localCache)
            }
            if (jsb.fileUtils.isDirectoryExist(localCacheTemp)) {
                jsb.fileUtils.removeDirectory(localCacheTemp)
            }
            cc.audioEngine.stopAll()
            cc.game.restart()
        }
        //下载配置文件失败
        else if (this._MsgType == EMsgType.failed) {
            cc.game.restart()
        }
        //客服
        else if (this._MsgType == EMsgType.kefu) {
            this._msgBox.setScale(0)
        }
    }

    //强制重新安装 
    forceDownApp() {
        this.downLoadApp()

    }

    /**设置组件原型 */
    setComponentPrototype() {
        //@ts-ignore
        cc.EditBox.prototype._onTouchBegan = function (event) {
            let touch = event.touch
            let node = event.target
            let upLoadY = touch.getLocationY()
            let nodePos = node.convertToNodeSpaceAR(touch.getLocation())
            upLoadY -= nodePos.y + node.height / 2
            if (cc.sys.isNative) {
                if (cc.sys.os == cc.sys.OS_ANDROID) {
                    jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "upLoadEditBoxY", "(Ljava/lang/String;)V", upLoadY * cc.view.getScaleY())
                } else {

                }
            }
        }
        //@ts-ignore
        cc.Button.prototype._onTouchEnded = function (t) {
            this.nowTouchTime = Date.now();
            if (this.lastTouchTime && (this.nowTouchTime - this.lastTouchTime) < 500) {
                UDebug.log('点太快了');
                return;
            }
            this.lastTouchTime = this.nowTouchTime;
            if (this.interactable && this.enabledInHierarchy) {
                if (this._pressed) {
                    cc.Component.EventHandler.emitEvents(this.clickEvents, t);
                    this.node.emit("click", this);
                }
                this._pressed = false;
                this._updateState();
                t.stopPropagation();
            }
        }
    }
}
