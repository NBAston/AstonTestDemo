import { URoleInfo, UHeadData, UIHeadItem, SysEvent } from "../../../common/base/UAllClass";
import Model from "../../../common/base/Model";
import cfg_game from "../../../config/cfg_game";
import cfg_head from "../../../config/cfg_head";
import { HallServer, Game, ProxyServer, Gswz, HallFriendServer, ClubHallServer } from "../../../common/cmd/proto";
import UMsgCenter from "../../../common/net/UMsgCenter";
import UHandler from "../../../common/utility/UHandler";
import UDebug from "../../../common/utility/UDebug";
import UStringHelper from "../../../common/utility/UStringHelper";
import ULanHelper from "../../../common/utility/ULanHelper";
import { UIPersonalData } from "../personal/RoleInfoClass";
import cfg_frame from "../../../config/cfg_frame";
import UIBankData from "../bank/BankData";
import UIExchangeData, { UIExchargeRecordsItem } from "../exchange/ExchangeData";
import cfg_vip from "../../../config/cfg_vip";
import { ZJH_SCALE, UNIT } from "../../../game/zjh/MZJH";
import UIChargeData, { UIHttpChargeData, UIChargeRecordsItem, UIChargeOffLineData, UIChargeOffLineDataItem, UIChargeOffLineOrderItem, UIChargeOrderListData, UIChargeOrderListDataItem, UserBindInfoData, UIChargeOnLineData, UIChargeOnLineDataItem, UIChargeOnLineOrderItem, ExchangeLimitMoneyInfoData, UIChargeOrderDetailItem } from "../charge/ChargeData";
import cfg_charge from "../../../config/cfg_charge";
import { UVipData, UVipitemData } from "../vip/VipData";
import AppGame from "../../base/AppGame";
import { CancelExchangeType, EChargeType, ECommonUI, EExchareType } from "../../../common/base/UAllenum";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import UDateHelper from "../../../common/utility/UDateHelper";
import MLogin from "../../login/MLogin";
import RsaKey from "../../../common/utility/RsaKey";
import VChargeConstants from "../charge/chargeItem/VChargeConstants";
import { info } from "console";
import ULocalDB, { AccountInfo } from "../../../common/utility/ULocalStorage";
import { UAccountItemData } from "../../login/ULoginData";
import cfg_global from "../../../config/cfg_global";
import UPlatformHelper from "../../login/UPlatformHelper";
import ErrorLogUtil, { LogLevelType } from "../../errorlog/ErrorLogUtil";
import cfg_event from "../../../config/cfg_event";
import { EventManager } from "../../../common/utility/EventManager";
import cfg_key from "../../../config/cfg_key";
import VBindWeChatVerify from "../personal/VBindWeChatVerify";


const { ccclass, property } = cc._decorator;

export const CHARGE_SCALE = 0.01; // 充值提现金额显示比例
export const CHARGE_SCALE_100 = 100; // 充值提交服务端金额比例
/**
 * 创建:sq
 * 作用:玩家角色信息业务逻辑处理
 */

export default class MRole extends Model {

    static UPDATA_HEADBOX = "UPDATA_HEADBOX";
    /**修改头像 */
    static UPDATA_HEAD = "UPDATA_HEAD";
    /**更新分值 */
    static UPDATA_SCORE = "UPDATA_SCORE";
    static UPDATA_ROOM_CARD = "UPDATA_ROOM_CARD";
    static UPDATA_BANK_SCORE = "UPDATA_BANK_SCORE";
    /**请求重命名 */
    static UPDATA_REBNAME = "UPDATA_REBNAME";
    static BIND_MIBLE = "UPDATA_REBNAME";
    /**更新性别 */
    static UPDATA_SEX = "UPDATA_SEX";
    static SAVE_SCORE = "SAVE_SCORE";
    static TAKE_SCORE = "TAKE_SCORE";
    static BIND_ALIPAY = "BIND_ALIPAY";
    static BIND_BANK = "BIND_BANK";
    static BIND_USDT_ADDRESS = "BIND_USDT_ADDRESS" // USDT
    static UPDATE_USDT_RATE = "UPDATE_USDT_RATE" // USDT费率更新
    static EXCHANGE_SOCRE = "ERROR_MSG";

    static UPDATE_CHARGE = "UPDATE_CHARGE";
    static BIND_USERNAME = "BIND_USERNAME"; // 绑定用户名弹框
    static SET_USER_TRUE_NAME = "SET_USER_TRUE_NAME" // 设置用户真实姓名
    static UPDATE_ONLINE_CHARGE = "UPDATE_ONLINE_CHARGE"; // 更新线上充值
    static UPDATE_ONLINE_CREATE_ORDER = "UPDATE_ONLINE_CREATE_ORDER" // 创建线上支付订单
    static UPDATE_OFFLINE_CHARGE = "UPDATE_OFFLINE_CHARGE"; // 更新线下充值
    static UPDATE_OFFLINE_CREATE_ORDER = "UPDATE_OFFLINE_CREATE_ORDER"; // 创建线下支付订单
    static UPDATE_OFFLINE_CANCEL_ORDER = "UPDATE_OFFLINE_CANCEL_ORDER"; // 取消订单
    static UPDATE_ORDER_DETAIL_INFO = "UPDATE_ORDER_DETAIL_INFO"; // 订单详情
    static COMFIRM_ORDER_INFO = "COMFIRM_ORDER_INFO"; // 确认订单信息
    static UPDATE_OFFLINE_ORDER_LIST = "UPDATE_OFFLINE_ORDER_LIST"; // 订单列表
    static CANCEL_EXCHANGE_ORDER = "CANCEL_EXCHANGE_ORDER"// 取消兑换订单
    static EXCHANGE_SCORETO_RMB_LIMIT = "EXCHANGE_SCORETO_RMB_LIMIT" // 兑换兑换金币限额
    static REFLESH_USDT_ADDRESS = "REFLESH_USDT_ADDRESS";
    static EXCHANGE_REQUEST_LIST = "EXCHANGE_REQUEST_LIST";

    static UPDATE_GOLD_ROOMCARDS_LIST = "UPDATE_ROOMCARDS_LIST"; // 金币换房卡列表

    static UPDATE_TESTCHARGE = "UPDATE_TESTCHARGE";
    static ON_CHARGE = "ON_CHARGE";
    static UPDATE_CHARGE_RECORDS = "UPDATE_CHARGE_RECODRDS";
    static UPDATE_EXCHARGE_RECORDS = "UPDATE_EXCHARGE_RECORDS";
    static UPDATE_PROXY = "UPDATE_PROXY";

    static CHARGE_CANCEL_CONFIRM_BOX = "CHARGE_CANCEL_CONFIRM_BOX" // 确认取消订单
    static COMFIRM_HAD_CHARGE = "COMFIRM_HAD_CHARGE" // 确认转账
    static COMFIRM_CANCEL_BINDCARD = "COMFIRM_CANCEL_BINDCARD" // 确认取消绑卡
    static CONFIRM_EXCHANGE = "CONFIRM_EXCHANGE" // 确认提现

    static ACCOUNT_DETAIL = "ACCOUNT_DETAIL" //账户明细
    static BETTING_RECORD = "BETTING_RECORD" //投注记录
    static REF_WECAHT_BIND_STATE = 'REF_WECAHT_BIND_STATE';//刷新微信绑定状态

    static BANKERINFO = "BANKERINFO";//更新上庄列表信息
    static S_BANKERSUCCEED = 'S_BANKERSUCCEED';//上庄成功事件
    static S_BANKERFAILL = 'S_BANKERFAILL';//上庄失败事件
    static S_CANCELSUCCEED = 'S_CANCELSUCCEED';//取消申请成功事件
    static S_CANCELFAILL = 'S_CANCELFAILL';//取消申请失败事件
    static S_DOWNSUCCEED = 'S_DOWNSUCCEED';//下庄成功事件
    static S_DOWNERFAILL = 'S_DOWNERFAILL';//下庄失败事件
    static S_CHANGEBANKER = 'S_CHANGEBANKER';//切换庄家事件
    static S_CHANGEBANKER2 = 'S_CHANGEBANKER2';//切换庄家事件
    static UPDATEBUTTON = "UPDATEBUTTON";//更新按钮
    static bankerBool: boolean = false;//玩家自己是否在庄
    static bankerID: number = 0;//上庄ID
    static downBankerID: number = 0;//下庄ID

    static UPLOAD_HEAD_IMG_SUCCESS = "UPLOAD_HEAD_IMG_SUCCESS" // 上传头像图片


    static CLOSE_REGISTER: string = "close_register";  //关闭注册按钮
    private _score: number = 0;
    /**
     * 金币
     */
    get score(): number {
        return this._score;
    }
    private _bankScore: number = 0;
    private _gamePass: string = "";

    public get gamePass(): string {
        return this._gamePass;
    }

    public set gamePass(v: string) {
        this._gamePass = v;
    }
    /**
     * 金币
     */
    get bankScore(): number {
        return this._bankScore;
    }
    private _headId: number = 0;
    /**
     * 头像
     */
    get headId(): number {
        return this._headId;
    }
    private _nickName: string = "";
    /**
     * 玩家昵称
     */
    get nickName(): string {
        return this._nickName;
    }

    private _account: string = "";
    /**
     * 账号
     */
    get account(): string {
        return this._account;
    }
    private _useId: number = 0;
    /**
     * 用户id
     */
    get useId(): number {
        return this._useId;
    }
    private _mobileNum: string;
    get mobileNum(): string {
        return this._mobileNum;
    }

    private _weChatOpenId: string; //微信openid
    get weChatOpenId(): string {
        return this._weChatOpenId;
    };

    set weChatOpenId(openid: string) {
        this._weChatOpenId = openid;
    };

    private _headImgUrl: string;//头像链接
    get headImgUrl(): string {
        return this._headImgUrl;
    };
    set headImgUrl(url: string) {
        this._headImgUrl = url;
    };

    private _headboxId: number = 0;
    get headboxId(): number {
        return this._headboxId;
    }
    private _gender: number;
    get gender(): number {
        return this._gender;
    }
    private _vipLevel: number = 0;
    get vipLevel(): number {
        return this._vipLevel;
    }
    private _vipInfo: { [key: number]: number };

    get vipInfo(): { [key: number]: number } {
        return this._vipInfo;
    }

    private _chargeAmount: number;
    get rechargeAmount(): number {
        return this._chargeAmount;
    }

    private _nGuideTag: number;
    get nGuideTag(): number {
        return this._nGuideTag;
    }
    private _isSuperAccount: number;
    get isSuperAccount(): number {
        return this._isSuperAccount;
    }

    private _aliPayAccount: string;
    get alipayAccount(): string {
        return this._aliPayAccount;
    }

    private _aliPayName: string;
    get alipayName(): string {
        return this._aliPayName;
    }

    private _bankCardNum: string;
    get bankCardNum(): string {
        return this._bankCardNum;
    }

    private _bankCardName: string;
    get bankCardName(): string {
        return this._bankCardName;
    }

    private _trueName: string;
    get trueName(): string {
        return this._trueName;
    }

    private _usdtAddress: string;
    get usdtAddress(): string {
        return this._usdtAddress;
    }

    //房卡数量
    private _roomCard: number;
    get roomCard(): number {
        return this._roomCard;
    }

    set roomCard(value: number) {
        this._roomCard = value
    }

    private _exchangeRate: number = 0;
    get exchangeRate(): number {
        return this._exchangeRate;
    }

    /**每天最大兑换次数 */
    private _exchangeTimesOneDay: number = 0;
    get exchangeTimesOneDay(): number {
        return this._exchangeTimesOneDay;
    }
    /**两次提交兑换订单的最小时间间隔（分钟） */
    private _exchangeInterval: number = 0;
    get exchangeInterval(): number {
        return this._exchangeInterval;
    }
    /**兑换银行卡最小限额 */
    private _exchangeMinMoneyBank: number = 0;
    get exchangeMinMoneyBank(): number {
        return this._exchangeMinMoneyBank;
    }
    /**兑换银行卡最大限额 */
    private _exchangeMaxMoneyBank: number = 0;
    get exchangeMaxMoneyBank(): number {
        return this._exchangeMaxMoneyBank;
    }
    /**兑换支付宝最小限额 */
    private _exchangeMinMoneyAlipay: number = 0;
    get exchangeMinMoneyAlipay(): number {
        return this._exchangeMinMoneyAlipay;
    }
    /**兑换支付宝最大限额 */
    private _exchangeMaxMoneyAlipay: number = 0;
    get exchangeMaxMoneyAlipay(): number {
        return this._exchangeMaxMoneyAlipay;
    }
    /**兑换最少留下金币 */
    private _exchangeMinLeftMoney: number = 0;
    get exchangeMinLeftMoney(): number {
        return this._exchangeMinLeftMoney;
    }
    /**兑换USDT最小限额 */
    private _exchangeMinMoneyUsdt: number = 0;
    get exchangeMinMoneyUsdt(): number {
        return this._exchangeMinMoneyUsdt;
    }
    /**兑换USDT最大限额 */
    private _exchangeMaxMoneyUsdt: number = 0;
    get exchangeMaxMoneyUsdt(): number {
        return this._exchangeMaxMoneyUsdt;
    }


    private _spreadUrl: string = "http://www.baidu.com";
    get spreadUrl(): string {
        return this._spreadUrl;
    }
    get bindMobile(): boolean {
        if (UStringHelper.isEmptyString(this._mobileNum)) {
            return false;
        }
        return true;
    }
    private _offlineChargeData: UIChargeOffLineData;
    private _onlineChargeData: UIChargeOnLineData;
    private _orderListData: UIChargeOrderListData;
    private _httpchargeData: Array<HallServer.IRechargeChannelItem>;
    private _testChargeData: Array<HallServer.IRechargeChannelItem>;
    private _chargeRecordsData: Array<UIChargeRecordsItem>;
    private _exchargeRecordsData: Array<UIExchargeRecordsItem>;
    private _needRequestCharge: boolean = true;
    private _needRequestExCharge: boolean = true;
    private _needRequestBettingRecord: boolean = true;
    private _accounts: Array<AccountInfo>;
    resetData(): void {
        this._chargeRecordsData = [];

        this._spreadUrl = "";

        this._bankCardName = "";
        this._bankCardNum = "";

        this._aliPayName = "";
        this._aliPayAccount = "";
        this._usdtAddress = "";
        this._exchangeRate = 0;
        this._isSuperAccount = 0;
        this._nGuideTag = 0;

        this._chargeAmount = 0;
        this._vipInfo = {};
        this._vipLevel = 0;
        this._gender = 0;
        this._roomCard = 0;

        this._headboxId = 0;
        this._mobileNum = "";
        this._useId = 0;
        this._weChatOpenId = "";
        this._headImgUrl = "";

        this._account = "";
        this._nickName = "";
        this._headId = 0;
        this._trueName = "";

        this._exchangeInterval = 0;
        this._exchangeTimesOneDay = 0;
        this._exchangeMinMoneyBank = 0;
        this._exchangeMaxMoneyBank = 0;
        this._exchangeMinMoneyAlipay = 0;
        this._exchangeMaxMoneyAlipay = 0;
        this._exchangeMinLeftMoney = 0;
        this._exchangeMinMoneyUsdt = 0;
        this._exchangeMaxMoneyUsdt = 0;

        this._bankScore = 0;
        this._score = 0;
    }
    /**
    * 保存个人信息
    * @param caller 
    */
    saveRoleinfo(loginRetInfo: any): void {
        // let json = JSON.parse(loginRetInfo);
        UDebug.Log("json == " + loginRetInfo);
        if (loginRetInfo) {
            this._gamePass = loginRetInfo.gamePass;
            this._useId = loginRetInfo.userId;
            this._mobileNum = loginRetInfo.mobileNum;
            this._nickName = loginRetInfo.nickName == "" ? loginRetInfo.userId : loginRetInfo.nickName;
            this._headId = loginRetInfo.headId;
            this._headboxId = loginRetInfo.headboxId;
            this._gender = loginRetInfo.gender;
            this._vipLevel = loginRetInfo.vipLevel;
            this._score = loginRetInfo.score;
            this._bankScore = loginRetInfo.bankScore;
            this._chargeAmount = loginRetInfo.rechargeAmount;
            this._nGuideTag = loginRetInfo.guideTag;
            this._isSuperAccount = loginRetInfo.superAccount;
            this._trueName = loginRetInfo.trueName;
            this._aliPayAccount = loginRetInfo.alipayAccount;
            this._aliPayName = loginRetInfo.alipayName;
            this._bankCardNum = loginRetInfo.bankCardNum;
            this._bankCardName = loginRetInfo.bankCardName;
            this._usdtAddress = loginRetInfo.usdtAddress;
            this._spreadUrl = loginRetInfo.officialWebsite;
            this._roomCard = loginRetInfo.roomCard
            this._headImgUrl = loginRetInfo.headImgUrl;
            let openId = loginRetInfo.openId;
            this._weChatOpenId = openId;
            this._vipInfo = {};
            this._vipInfo[0] = 0;

            let openIdDB = ULocalDB.getDB("openid");
            if (openIdDB && openIdDB != openId) {
                ULocalDB.SaveDB("openid", "");
            } else {
                ULocalDB.SaveDB("openid", openId);
            };
            // 更新本地保存的用户对应的手机号信息
            this._accounts = ULocalDB.getDB("accounts");
            let len = this._accounts.length;
            for (let i = 0; i < len; i++) {
                const element = this._accounts[i];
                if (this._useId == element.userId) {
                    element.mobilenum = this._mobileNum;
                }
            }
            ULocalDB.SaveDB("accounts", this._accounts);
            if (loginRetInfo.vips) {
                loginRetInfo.vips.forEach(element => {
                    this._vipInfo[element.level] = element.value;
                });
            }

        }
        else {
            UDebug.log("没有登陆的信息")
        }
    }
    /**
     * 保存电话
     * @param mobile 
     */
    savemobile(mobile: string): void {
        this._mobileNum = mobile;
    }
    /**
     * 保存金币
     * @param gold 
     */
    saveGold(gold: number): void {
        this._score = gold;
        this.emit(MRole.UPDATA_SCORE, this._score);
    }
    saveRoomCard(roomCard: number): void {
        this._roomCard = roomCard;
        this.emit(MRole.UPDATA_ROOM_CARD, this._roomCard);
    }

    saveBank(gold: number): void {
        this._bankScore = gold;
        this.emit(MRole.UPDATA_BANK_SCORE, this._bankScore);
    }
    //#region 实现的抽象方法
    init(): void {
        this._score = 1256;
        this._headId = 2;
        this._nickName = "试玩123456";

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_HEAD_MESSAGE_RES,
            new UHandler(this.set_head_message_res, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USER_SCORE_MESSAGE_RES,
            new UHandler(this.update_user_score_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_HEADBOX_MESSAGE_RES,
            new UHandler(this.set_headbox_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_NICKNAME_MESSAGE_RES,
            new UHandler(this.set_nickname_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_GENDER_MESSAGE_RES,
            new UHandler(this.set_gender_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SAVE_SCORE_TO_BANK_MESSAGE_RES,
            new UHandler(this.save_score_to_bank_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_TAKE_SCORE_FROM_BANK_MESSAGE_RES,
            new UHandler(this.take_score_from_bank_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_TRUENAME_MESSAGE_RES,
            new UHandler(this.set_truename_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_BANK_CARD_MESSAGE_RES,
            new UHandler(this.bind_bank_card_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_USDT_ADDRESS_MESSAGE_RES,
            new UHandler(this.bind_usdt_address_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USDT_EXCHANGE_RATE_MESSAGE_RES,
            new UHandler(this.get_usdt_exchange_rate_message_res, this));


        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_ALIPAY_MESSAGE_RES,
            new UHandler(this.bind_alipay_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_NOVICE_TAG_RES,
            new UHandler(this.set_novice_tag_res, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_EXCHANGE_SCORE_TO_RMB_MESSAGE_RES,
            new UHandler(this.exchange_score_to_rmb_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_CANCEL_EXCHANGE_SCORE_TO_RMB_MESSAGE_RES,
            new UHandler(this.cancel_exchange_score_to_rmb_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_RECHARGE_RECORD_MESSAGE_RES,
            new UHandler(this.charge_records, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_RMB_RECORD_MESSAGE_RES,
            new UHandler(this.excharge_records, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TRUENAME_MESSAGE_RES,
            new UHandler(this.get_truename_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_SCORE_LIMIT_MESSAGE_RES,
            new UHandler(this.get_exchange_score_limit_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_PROXY,
            Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_RECHARGE_MESSAGE_NOTIFY,
            new UHandler(this.recharge_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_PROXY,
            Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_EXCHANGE_MESSAGE_NOTIFY,
            new UHandler(this.excharge_message_res, this));


        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USER_SCORE_CHANGE_RECORD_RES,
            new UHandler(this.req_account_detail, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_USER_SCORE_CHANGE_RECORD_RES,
            new UHandler(this.req_account_detail, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ALL_PLAY_RECORD_RES,
            new UHandler(this.req_betting_record, this));

        UMsgCenter.ins.regester(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_ALL_PLAY_RECORD_RES,
            new UHandler(this.req_betting_record, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_PROXY,
            Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_TRANSFER_RECV_ROOM_CARD_MESSAGE_NOTIFY,
            new UHandler(this.get_room_card_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_WECHAT_MESSAGE_RES,
            new UHandler(this.responseBindWeChat, this));
        // UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
        //     Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_QUERY_RECHARGE_CHANNEL_RES,
        //     new UHandler(this.req_change_list, this));

        cc.systemEvent.on(SysEvent.GET_SERVERLIST_CALLBACK, this.on_serverlist_callback, this);

    }

    update(dt: number): void {

    }

    // 确认取消订单按钮点击
    confirm_order_cancel_click(): void {
        this.emit(MRole.CHARGE_CANCEL_CONFIRM_BOX, true);
    }

    // 确认已经充值按钮点击
    confirm_had_charge_click(): void {
        this.emit(MRole.COMFIRM_HAD_CHARGE, true);
    }
    // 确定取消绑卡
    confirm_cancel_bindcard_click(): void {
        this.emit(MRole.COMFIRM_CANCEL_BINDCARD, true);
    }
    // 确定提现
    confirm_exchange_click(): void {
        this.emit(MRole.CONFIRM_EXCHANGE, true);
    }

    /** 转帐房卡 充值房卡接收到房卡成功*/
    get_room_card_res(caller: ProxyServer.Message.ProxyNotifyTransferRecvRoomCardMessage) {
        AppGame.ins.closeUI(ECommonUI.UI_AWARD_ROOM_CARD);
        AppGame.ins.showUI(ECommonUI.UI_AWARD_ROOM_CARD, { roomCardNum: caller.roomCard / 100 });
        this.requestUpdateScore();
    }

    //#endregion 
    private recharge_message_res(caller: ProxyServer.Message.ProxyNotifyRechargeMessage): void {
        if (caller.realPay > 0) {
            cc.systemEvent.emit(SysEvent.SHOW_AWARDS, caller.realPay, caller.info);
        }
        this.requestUpdateScore();

        // if (this._chargeRecordsData) {
        //     this._chargeRecordsData.forEach(element => {
        //         if (element.listNum == caller.orderId) {
        //             element.status = caller.status;
        //         }
        //     });
        //     cc.systemEvent.emit(SysEvent.SHOW_AWARDS, caller.realPay);
        //     this.requestUpdateScore();
        // }
    }
    private excharge_message_res(caller: ProxyServer.Message.ProxyNotifyExchangeMessage): void {
        if (this._exchargeRecordsData) {
            this._exchargeRecordsData.forEach(element => {
                if (element.num == caller.orderId) {
                    element.status = ULanHelper.PAY_STATUS[caller.status];
                }
            });
            // AppGame.ins.showTips(`订单:${caller.orderId}兑换成功${UStringHelper.getMoneyFormat(caller.realPay * ZJH_SCALE, 4, false)}元！`)
        }
        this.requestUpdateScore();
    }

    private get_truename_message_res(caller: any) {

    }

    private on_serverlist_callback(sucess: boolean, data: string): void {
        AppGame.ins.showConnect(false);
        if (sucess) {
            this.emit(MRole.UPDATE_PROXY, true, data);
        } else {
            this.emit(MRole.UPDATE_PROXY, false, ULanHelper.GET_SERVERLIST_FAIL);
        }
    }
    private charge_records(caller: HallServer.GetRechargeRecordMessageResponse): void {
        if (caller.retCode == 0) {
            this._chargeRecordsData = [];
            // var a=new UIChargeRecordsItem();
            // a.chargeType=1;
            // a.chargetime="2018-03-15";
            // a.gold=500;
            // a.listNum="asdasdweqr354354gg";
            // a.status=1;
            // this._chargeRecordsData.push(a);
            caller.message.forEach(element => {
                var item = new UIChargeRecordsItem();
                item.chargeType = element.rechargeTypeId;
                item.chargetime = element.time;
                item.gold = element.rechargeMoney;
                item.listNum = element.orderId;
                item.status = element.status;
                this._chargeRecordsData.push(item);
            });
            this.emit(MRole.UPDATE_CHARGE_RECORDS, true, "");
        } else {
            this.emit(MRole.UPDATE_CHARGE_RECORDS, false, caller.errorMsg);
        }
    }

    private excharge_records(caller: HallServer.GetExchangeRMBRecordMessageResponse): void {
        if (caller.retCode == 0) {
            this._exchargeRecordsData = [];
            caller.message.forEach(element => {
                var item = new UIExchargeRecordsItem();
                item.id = element.Id;
                item.gold = parseFloat((parseFloat(element.exchangeScore) * CHARGE_SCALE).toFixed(2));
                item.num = element.orderId;
                item.op = element.reason;
                item.orderId = element.orderId;
                item.status = element.status;//ULanHelper.PAY_STATUS[element.status] || "";
                item.time = element.time;
                item.usdtRate = element.usdtRate;
                item.type = element.type;
                item.usdt = (parseFloat(element.usdt) * CHARGE_SCALE).toFixed(2) + "" || "0";
                item.fee = parseFloat(element.fee) * CHARGE_SCALE;
                /*if(element.type == 3) {
                    item.type = "银行卡";
                } else if(element.type == 2){
                    item.type = "支付宝";
                } else if(element.type == 4) {
                    item.type = "USDT";
                }*/
                // item.type = element.type == 1 ? "银行卡" : "支付宝";
                this._exchargeRecordsData.push(item);
            });
            if (this._exchargeRecordsData.length == 0) {
                var str = "兑换记录数据长度length = 0";
                ErrorLogUtil.ins.addErrorLog(str, LogLevelType.INFO);
            }
            this.emit(MRole.UPDATE_EXCHARGE_RECORDS, true, "");
        } else {
            var str = "兑换记录数据数据获取失败---";
            ErrorLogUtil.ins.addErrorLog(str, LogLevelType.ERROR);
            this.emit(MRole.UPDATE_EXCHARGE_RECORDS, false, caller.errorMsg);
        }
    }
    private exchange_score_to_rmb_message_res(caller: HallServer.ExchangeScoreToRMBMessageResponse) {
        if (caller.retCode == 0) {
            if (caller.result == 0) this.saveGold(caller.score);
            this.emit(MRole.UPDATE_CHARGE);
            this.emit(MRole.EXCHANGE_SOCRE, caller.errorMsg, true/*ULanHelper.EXCHARGE_RESULT[caller.result]*/);
        } else {
            this.emit(MRole.EXCHANGE_SOCRE, caller.errorMsg, false);
        }
    }

    private cancel_exchange_score_to_rmb_message_res(caller: HallServer.CancelExchangeScoreToRMBMessageResponse) {
        if (caller.retCode == 0) {
            this._score = caller.score;
            this.emit(MRole.UPDATA_SCORE, this._score);
            this.emit(MRole.CANCEL_EXCHANGE_ORDER, true, caller.errorMsg);
        } else {
            this.emit(MRole.CANCEL_EXCHANGE_ORDER, false, caller.errorMsg);
        }
    }
    private set_novice_tag_res(caller: HallServer.SeNoviceTagMessageResponse): void {
        if (caller.retCode == 0) {
            this._nGuideTag = caller.guideTag;
        } else {

        }
    }
    private bind_alipay_message_res(caller: HallServer.BindAliPayMessageResponse): void {
        if (caller.retCode == 0) {

            this._aliPayName = caller.alipayName;
            this._trueName = caller.alipayName;
            this._aliPayAccount = caller.alipayAccount;
            this.emit(MRole.BIND_ALIPAY, true, caller.errorMsg);
        } else {
            this.emit(MRole.BIND_ALIPAY, false, caller.errorMsg);
        }
    }
    private bind_bank_card_message_res(caller: HallServer.BindBankCardMessageResponse): void {
        if (caller.retCode == 0) {

            this._bankCardName = caller.bankCardName;
            this._trueName = caller.bankCardName;
            this._bankCardNum = caller.bankCardNum;
            this.emit(MRole.BIND_BANK, true, caller.errorMsg);

        } else {
            this.emit(MRole.BIND_BANK, false, caller.errorMsg);
        }
    }

    // 绑定USDT 地址消息回调
    private bind_usdt_address_message_res(caller: HallServer.BindUSDTAddressMessageResponse): void {
        if (caller.retCode == 0) {
            this._usdtAddress = caller.usdtAddress;
            this._exchangeRate = parseFloat((caller.exchangeRate / 100).toFixed(2));//caller.exchangeRate;
            this.emit(MRole.BIND_USDT_ADDRESS, true, caller.errorMsg);
        } else {
            this.emit(MRole.BIND_USDT_ADDRESS, false, caller.errorMsg);
        }
    }

    // usdt汇率回调
    private get_usdt_exchange_rate_message_res(caller: HallServer.GetUSDTExchangeRateMessageResponse): void {
        if (caller.retCode == 0) {
            this._exchangeRate = parseFloat((caller.exchangeRate / 100).toFixed(2));
            this.emit(MRole.UPDATE_USDT_RATE, true, this._exchangeRate, caller.errorMsg);
        } else {
            this.emit(MRole.UPDATE_USDT_RATE, false, 0, caller.errorMsg);
        }
    }


    // 设置真实姓名消息返回
    private set_truename_message_res(caller: HallServer.SetTrueNameMessageesponse): void {
        if (caller.retCode == 0) {
            this._trueName = caller.trueName;
            // this._useId = caller.userId;
            this.emit(MRole.SET_USER_TRUE_NAME, true, caller.errorMsg)
        } else {
            this.emit(MRole.SET_USER_TRUE_NAME, false, caller.errorMsg);
        }
    }

    // 兑换金币限额消息返回
    private get_exchange_score_limit_message_res(caller: HallServer.ExchangeScoreToRMBLimitMessageResponse): void {

        if (caller.retCode == 0) {
            this._exchangeInterval = caller.exchangeInterval;
            this._exchangeTimesOneDay = caller.exchangeTimesOneDay;
            this._exchangeMinMoneyBank = caller.exchangeMinMoneyOneTimesBank;
            this._exchangeMaxMoneyBank = caller.exchangeMaxMoneyOneTimesBank;
            this._exchangeMinMoneyAlipay = caller.exchangeMinMoneyOneTimesAlipay;
            this._exchangeMaxMoneyAlipay = caller.exchangeMaxMoneyOneTimesAlipay;
            this._exchangeMinLeftMoney = caller.exchangeMinLeftMoney;
            this._exchangeMinMoneyUsdt = caller.exchangeMinMoneyOneTimesUsdt;
            this._exchangeMaxMoneyUsdt = caller.exchangeMaxMoneyOneTimesUsdt;
            this.emit(MRole.EXCHANGE_SCORETO_RMB_LIMIT, true, caller.errorMsg);
        } else {
            this.emit(MRole.EXCHANGE_SCORETO_RMB_LIMIT, false, caller.errorMsg);
        }
    }

    private take_score_from_bank_message_res(caller: HallServer.TakeScoreFromBankMessageResponse): void {
        if (caller.retCode == 0) {
            this.saveGold(caller.score);
            this.saveBank(caller.bankScore);
            this.emit(MRole.TAKE_SCORE, true, "取钱成功");
        } else {
            this.emit(MRole.TAKE_SCORE, false, caller.errorMsg);
        }
    }
    private save_score_to_bank_message_res(caller: HallServer.SaveScoreToBankMessageResponse): void {
        if (caller.retCode == 0) {
            this.saveGold(caller.score);
            this.saveBank(caller.bankScore);
            this.emit(MRole.SAVE_SCORE, true, "存钱成功");
        } else {
            this.emit(MRole.SAVE_SCORE, false, caller.errorMsg);
        }
    }
    private set_gender_message_res(caller: HallServer.SetGenderMessageResponse): void {
        if (caller.retCode == 0) {
            this._gender = caller.gender;
            this.emit(MRole.UPDATA_SEX, this._gender, true, "");
        } else {
            this.emit(MRole.UPDATA_SEX, this._gender, false, caller.errorMsg);
        }
    }
    private set_nickname_message_res(caller: HallServer.SetNickNameMessageResponse): void {
        if (caller.retCode == 0) {
            this._nickName = caller.nickName;
            this.emit(MRole.UPDATA_REBNAME, this._nickName, true, "");
        } else {
            this.emit(MRole.UPDATA_REBNAME, this._nickName, false, caller.errorMsg);
        }
    }
    private set_headbox_message_res(caller: HallServer.SetHeadboxIdMessageResponse): void {
        if (caller.retCode == 0) {
            this._headboxId = caller.headboxId;
            this.emit(MRole.UPDATA_HEADBOX, this._headboxId, true, "");
        } else {
            this.emit(MRole.UPDATA_HEADBOX, this._headboxId, false, caller.errorMsg);
        }
    }
    private set_head_message_res(caller: HallServer.SetHeadIdMessageResponse): void {
        if (caller.retCode == 0) {
            this._headImgUrl = '';
            this._headId = caller.headId;
            this.emit(MRole.UPDATA_HEAD, this._headId, true);
        } else {
            UDebug.Log(caller.errorMsg);
            this.emit(MRole.UPDATA_HEAD, this._headId, false);
        }
    }
    private update_user_score_message_res(caller: HallServer.GetUserScoreMessageResponse): void {
        if (caller.retCode == 0) {
            this.saveGold(caller.score)
            this.saveRoomCard(caller.roomCard)
            this._chargeAmount = caller.rechargeAmount;
            this._vipLevel = caller.vip;
            EventManager.getInstance().raiseEvent(cfg_event.CLOSE_CHARGE);
        } else {
            UDebug.Log(caller.errorMsg);
        }
    }
    private req_change_list(caller: HallServer.GetRechargeChannelResponse): void {
        UDebug.log("充值列表" + caller)

        if (caller.retCode == 0) {
            this._httpchargeData = caller.rechargeList;
            this._httpchargeData.sort((a, b) => {
                if (a.sortId > b.sortId)
                    return -1;
                else
                    return 1;
            });
            this.emit(MRole.UPDATE_CHARGE, true);
        } else {
            this.emit(MRole.UPDATE_CHARGE, false);
        }
        AppGame.ins.showConnect(false);
    }
    private _accountDetail: any = null;
    private req_account_detail(caller: HallServer.GetUserScoreChangeRecordMessageResponse | ClubHallServer.GetUserScoreChangeRecordMessageResponse): void {
        console.log("积分变化列表", caller)
        if (caller.retCode == 0) {
            if (!this._accountDetail) {
                this._accountDetail = caller
            } else {
                AppGame.ins.showConnect(false);
                let detailInfo: any[] = this._accountDetail.detailInfo;
                let detailInfo1: any[] = caller.detailInfo;
                let allArr: any[] = detailInfo.concat(detailInfo1);
                let detailInfo2 = allArr.sort((a, b) => {
                    let a1 = a.createTime;
                    a1 = a1.replace(/-/g, "");
                    a1 = a1.replace(/\s/g, "");
                    a1 = a1.replace(/:/g, "") * 1;
                    let b1 = b.createTime;
                    b1 = b1.replace(/-/g, "");
                    b1 = b1.replace(/\s/g, "");
                    b1 = b1.replace(/:/g, "") * 1;
                    return b1 - a1;
                });
                this.emit(MRole.ACCOUNT_DETAIL, { retCode: 0, detailInfo: detailInfo2 });
            };

        } else {
            if (!this._accountDetail) {
                this._accountDetail = caller;
                this.emit(MRole.ACCOUNT_DETAIL, caller.errorMsg);
            } else {
                AppGame.ins.showConnect(false);
                if (this._accountDetail.retCode == 0) {
                    this.emit(MRole.ACCOUNT_DETAIL, this._accountDetail);
                } else {
                    this.emit(MRole.ACCOUNT_DETAIL, caller)
                };
            };
        }
        AppGame.ins.showConnect(false);
    }

    private req_betting_record(caller: HallServer.GetAllPlayRecordMessageResponse | ClubHallServer.GetAllPlayRecordMessageResponse): void {
        UDebug.log("所有游戏记录列表:", caller)

        if (caller.retCode == 0) {
            if (!this._BettingRecords) {
                this._BettingRecords = caller;
            } else {
                AppGame.ins.showConnect(false);
                let detailInfo: any[] = this._BettingRecords.detailInfo;
                let detailInfo1: any[] = caller.detailInfo;
                let allArr: any[] = detailInfo.concat(detailInfo1);
                let detailInfo2 = allArr.sort((a, b) => {
                    let a1 = a.gameEndTime;
                    a1 = a1.replace(/-/g, "");
                    a1 = a1.replace(/\s/g, "");
                    a1 = a1.replace(/:/g, "") * 1;
                    let b1 = b.gameEndTime;
                    b1 = b1.replace(/-/g, "");
                    b1 = b1.replace(/\s/g, "");
                    b1 = b1.replace(/:/g, "") * 1;

                    return b1 - a1;
                });
                this.emit(MRole.BETTING_RECORD, { retCode: 0, detailInfo: detailInfo2 });
            };
        } else {
            if (!this._BettingRecords) {
                this._BettingRecords = caller;
                var timeoutStr = '游戏记录列表数据异常 HallServer.GetAllPlayRecordMessageResponse=' + JSON.stringify(caller);
                ErrorLogUtil.ins.addErrorLog(timeoutStr, LogLevelType.ERROR);
                this.emit(MRole.BETTING_RECORD, caller.errorMsg);
            } else {
                AppGame.ins.showConnect(false);
                if (this._BettingRecords.retCode == 0) {
                    this.emit(MRole.BETTING_RECORD, this._BettingRecords);
                } else {
                    var timeoutStr = '游戏记录列表数据异常 HallServer.GetAllPlayRecordMessageResponse=' + JSON.stringify(caller);
                    ErrorLogUtil.ins.addErrorLog(timeoutStr, LogLevelType.ERROR);
                    this.emit(MRole.BETTING_RECORD, caller)
                };
            };

        }

    }

    //请求玩家积分变化记录列表
    requestAccountDetails(startDate: string, endDate: string, changeType: number, id: string): boolean {
        AppGame.ins.showConnect(true);
        this._accountDetail = null;
        var data = new HallServer.GetUserScoreChangeRecordMessage();
        data.startDate = startDate;
        data.endDate = endDate;
        data.changeType = changeType;
        data.lastCreateTime = id;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USER_SCORE_CHANGE_RECORD_REQ,
            data);

        // if (changeType == 35 || changeType == 80) {
        setTimeout(() => {
            this.requestClubAccountDetails(startDate, endDate, changeType, id);
        }, 100);
        // };


        return true;
    }

    //请求玩家积分变化记录列表-俱乐部
    requestClubAccountDetails(startDate: string, endDate: string, changeType: number, id: string): boolean {
        var data = new ClubHallServer.GetUserScoreChangeRecordMessage();
        data.startDate = startDate;
        data.endDate = endDate;
        data.changeType = changeType;
        data.lastCreateTime = id;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_USER_SCORE_CHANGE_RECORD_REQ,
            data);
        return true;
    }


    private _BettingRecords: any = null;
    //请求投注记录
    requestBettingRecords(startDate: string, endDate: string, gameId: number, id: string): boolean {
        if (!this._needRequestBettingRecord) {
            this.emit(MRole.BETTING_RECORD, true, "");
            return false;
        }
        AppGame.ins.showConnect(true);
        this._BettingRecords = null;
        setTimeout(() => {
            this.requestClubGameRecords(startDate, endDate, gameId, id);
        }, 100);
        var data = new HallServer.GetAllPlayRecordMessage();
        data.startDate = startDate;
        data.endDate = endDate;
        data.gameId = gameId;
        data.lastGameEndTime = id;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ALL_PLAY_RECORD_REQ,
            data);
        return true;
    }


    /**
     * @description 获取记录信息_俱乐部
     * @param gameType 
     */
    requestClubGameRecords(startDate: string, endDate: string, gameId: number, id: string) {
        let data = new ClubHallServer.GetAllPlayRecordMessage();
        data.gameId = gameId;
        data.startDate = startDate;
        data.endDate = endDate;
        data.clubId = 0;
        data.lastGameEndTime = "";
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_ALL_PLAY_RECORD_REQ, data);
    };



    // 请求兑换记录
    requesetExchangeRecords(): boolean {
        if (!this._needRequestExCharge) {
            this.emit(MRole.UPDATE_EXCHARGE_RECORDS, true, "");
            return false;
        }
        var data = new HallServer.GetExchangeRMBRecordMessage();
        data.userId = this._useId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_RMB_RECORD_MESSAGE_REQ,
            data);
        return true;
    }
    // 请求充值记录
    requestChargeRecords(): boolean {
        if (!this._needRequestCharge) {
            this.emit(MRole.UPDATE_CHARGE_RECORDS, true, "");
            return false;
        }
        var data = new HallServer.GetRechargeRecordMessage();
        data.userId = this._useId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_RECHARGE_RECORD_MESSAGE_REQ,
            data);
        return true;
    }
    /**
     * 
     * @param nickName 
     */
    requestReNickName(nickName: string): void {
        if (this._nickName != nickName) {
            if (UStringHelper.isEmptyString(nickName)) {
                this.emit(MRole.UPDATA_REBNAME, this._nickName, false, ULanHelper.NAME_CANT_EMPTY);
            } else {
                var data = new HallServer.SetNickNameMessage();
                data.userId = this._useId;
                data.nickName = nickName;
                UMsgCenter.ins.sendPkg(0,
                    Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
                    Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_NICKNAME_MESSAGE_REQ,
                    data);
            }
        }
    }
    /**
     * 设置性别
     * @param sex 
     */
    requestSex(sex: number): void {
        if (this.gender != sex) {

            var data = new HallServer.SetGenderMessage();
            data.gender = sex;
            data.userId = this._useId;
            UMsgCenter.ins.sendPkg(0,
                Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
                Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_GENDER_MESSAGE_REQ,
                data);
        }
    }
    /**
     * 请求保存头像框
     * @param boxId 
     */
    requestSaveHeadBox(boxId: number): void {
        if (boxId != this.headboxId) {
            var data = new HallServer.SetHeadboxIdMessage();
            data.headboxId = boxId;
            data.userId = this._useId;

            UMsgCenter.ins.sendPkg(0,
                Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
                Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_HEADBOX_MESSAGE_REQ,
                data);
        }
    }
    /**
     * 保存头像
     */
    requestSaveHead(headId: number): void {
        if (this.headId != headId) {

            let data = new HallServer.SetHeadIdMessage();
            data.userId = this._useId;
            data.headId = headId;

            UMsgCenter.ins.sendPkg(0,
                Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
                Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_HEAD_MESSAGE_REQ,
                data);
        }
    }
    /**
     * 请求更新玩家分数
     */
    requestUpdateScore(): void {

        let data = new HallServer.GetUserScoreMessage();
        data.userId = this._useId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USER_SCORE_MESSAGE_REQ,
            data);
    }
    /**
     * 存钱
     * @param saveScore 
     */
    requsetSaveScoreToBack(saveScore: number): void {
        saveScore = saveScore * UNIT;
        if (saveScore == 0) {
            this.emit(MRole.SAVE_SCORE, false, "请输入您需要存入的金额");
            return;
        }
        if (Math.round(saveScore) < 0) {
            this.emit(MRole.SAVE_SCORE, false, "金币不足，无法存入保险箱");
            return;
        }
        if (Math.round(saveScore) > this._score) {
            this.emit(MRole.SAVE_SCORE, false, "金币不足，无法存入保险箱");
            return;
        }
        var data = new HallServer.SaveScoreToBankMessage();
        data.userId = this._useId;
        data.saveScore = saveScore;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SAVE_SCORE_TO_BANK_MESSAGE_REQ,
            data);
    }
    /**
     * 取钱
     * @param takeScore 
     */
    requestTaskScoreFromBack(takeScore: number): void {
        takeScore = takeScore * UNIT;
        if (takeScore == 0) {
            this.emit(MRole.SAVE_SCORE, false, "请输入您需要取出的金额");
            return;
        }
        if (Math.round(takeScore) < 0) {
            this.emit(MRole.SAVE_SCORE, false, "金币不足，无法从保险箱取出");
            return;
        }
        if (Math.round(takeScore) <= 0 || Math.round(takeScore) > this._bankScore) {
            this.emit(MRole.SAVE_SCORE, false, "金币不足，无法从保险箱取出");
            return;
        }
        var data = new HallServer.TakeScoreFromBankMessage();
        data.userId = this._useId;
        data.takeScore = takeScore;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_TAKE_SCORE_FROM_BANK_MESSAGE_REQ,
            data);
    }

    // 请求兑换金币限额
    requestExchangeScoreToRMBLimitMessage() {
        var data = new HallServer.ExchangeScoreToRMBLimitMessage()
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_SCORE_LIMIT_MESSAGE_REQ,
            data);
    }

    /**
     * 绑定用户真实姓名
     * @param userName 用户名
     * @param type 类型 1 为绑定 2 为修改
     */
    requestBindUserName(userName: string, type: number): void {
        if (userName == this._trueName) {
            return;
        }
        var data = new HallServer.SetTrueNameMessage();
        data.userId = this._useId;
        data.trueName = userName;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_TRUENAME_MESSAGE_REQ,
            data);
    }
    /**
     * 请求绑定银行卡
     * @param bankAccount 卡号 
     * @param bankName 真实姓名
     * @param bankCardName 银行名称
     * @param type 类型 1为绑定 2为修改
     */
    requestBindBankCard(bankAccount: string, bankName: string, bankCardName: string, type: number): void {
        if (bankAccount == this._bankCardNum && this._bankCardName == bankName) {
            return;
        }
        var data = new HallServer.BindBankCardMessage();
        data.bankCardName = bankName;
        data.bankCardNum = bankAccount;
        data.bankName = bankCardName;
        data.userId = this._useId;
        data.type = type;

        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_BANK_CARD_MESSAGE_REQ,
            data);
    }

    /**
     * 请求绑定USDT地址
     * @param usdtAddress usdt 地址
     * @param verifyCode 验证码
     * @param type 类型 1为 绑定 2 为修改 暂时都传0 待后期后台完善
     */
    requestBindUsdtAddress(usdtAddress: string, verifyCode: string, type: number): void {
        if (usdtAddress == this._usdtAddress) {
            return;
        }
        var data = new HallServer.BindUSDTAddressMessage();
        data.usdtAddress = usdtAddress;
        data.userId = this._useId;
        data.type = type;
        data.verifyCode = verifyCode;

        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_USDT_ADDRESS_MESSAGE_REQ,
            data);
    }

    // 请求获取USDT汇率
    requestGetUsdtExchangeRate() {
        var data = new HallServer.GetUSDTExchangeRateMessage();
        data.userId = this._useId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USDT_EXCHANGE_RATE_MESSAGE_REQ,
            data);
    }

    /**
     * 请求绑定支付宝
     *  // type 1-first bind   2-modify bind alipay
     * @param banknum 
     */
    requestAlpayCard(alipayAccount: string, alipayName: string, type: number): void {
        if (alipayAccount == this._aliPayAccount && this._aliPayName == alipayName) {

            return;
        }
        var data = new HallServer.BindAliPayMessage();
        data.alipayAccount = alipayAccount;
        data.alipayName = alipayName;
        data.userId = this._useId;
        data.type = type;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_ALIPAY_MESSAGE_REQ,
            data);
    }

    /**
     * 请求设置新手引导tag
     * @param step 
     */
    requestSetGuideTag(step: number): void {
        var data = new HallServer.SetNoviceTagMessage();
        data.guideTag = step;
        data.userId = this._useId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_NOVICE_TAG_REQ,
            data);
    }
    /**
     * 请求兑换
     * @param gold 
     * @param type 类型 
     */
    requesetExchange(gold: number, type: EExchareType): void {
        gold = gold * UNIT;
        if (gold > this._score) {
            this.emit(MRole.EXCHANGE_SOCRE, ULanHelper.GOLD_BUZU);
            return;
        }
        var type = type;
        var data = new HallServer.ExchangeScoreToRMBMessage();
        data.userId = this._useId;
        data.exchangeScore = gold;
        data.type = type;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_EXCHANGE_SCORE_TO_RMB_MESSAGE_REQ,
            data);

    }

    /**
     * 请求取消兑换
     * @param exchangeScore 兑换的积分
     * @param type 类型
     * @param status 状态 正常情况下只有审核中的订单才能取消兑换
     */
    requestCancelExchange(id: string, orderId: string, exchangeScore: number, type: CancelExchangeType, status: number): void {
        var data = new HallServer.CancelExchangeScoreToRMBMessage();
        data.userId = this._useId;
        data.orderId = orderId;
        data.Id = id;
        data.type = type;
        data.exchangeScore = exchangeScore * 100;
        data.status = status;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_CANCEL_EXCHANGE_SCORE_TO_RMB_MESSAGE_REQ,
            data);

    }
    /**
     * 请求支付
     * @param type 
     * @param gold 
     * @param url 
     */
    requestCharge(type: number, gold: number, url: string): void {
    }


    // 请求房卡列表
    requestRoomCardsList(): void {
        this.emit(MRole.UPDATE_GOLD_ROOMCARDS_LIST, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }


    // 请求上传图片
    requestUploadImage(imgBase64Str: string): void {
        var parms = {
            "token": new RsaKey().arrayBufferToBase64(this._gamePass),
            "userId": this._useId,
            "methodName": "upAvatar",
            "avatar": "data:image/png;base64," + imgBase64Str,//"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI4AAABECAMAAABgUP3oAAAA+VBMVEVMXSw/UzVHWS9DVjFAVDNIWi5CVTJFWDBKWy2gm8ZhbFKAg4yVk7J2fHlWZD+Li59rdGVbj3lTdlJPaT9Rb0hNYzVZiG9VfFxXgmVEpU1KbzRHikBFnEhIgTxLZjBGk0RJeDhcV7V/yfTSPIgHpwGUyvZrHCp2LaKOcCr7zoiZsJWEmpzc97GPy8UBCYxKvPJl6QwVK06udw95AK+JWtG2vpUFie4FhVJgSdBBsp9kJjiAMaO1MpOCmLxvz80arlui9+Bs3aGG54orjexeYSkqyDmJ6vcLT8Uhh8pJl9KpLcWk2ECxYvLig9bV4ixw5MlPncbqIRfinHNSbb+/AAADlElEQVRoge2YB5eiMBDHERFFUYx0RfR6773Xd71//w9zCcVkhsDhysrtnf/3dl80JPm9KZlBRfk39GyPZ33f41ly3Wgb4CTqfNsAypm2AfamT/iLq21QKMrndo5tTxfKJj40fdLtpjf8S0QImbXNwGVTHLttCC6H4rjNb/t2q6fvbUYzQrymWXaQT0jQNoMgjxC/bQZBNHScJve7K/96ODINwxxPyheeYv9cWWLNF1EYRpfjZgCpJpaRaVr9oCSx4lWYabnNkWpX63S0bk8yNTS4pDxOQCOYOamYWPOQqz5Pj7Kk6hbmJoaoor9sGr9MviSxRJownCvK0zo0aodLx5Mmo6BhM5my0RhPOyTXjCUWLBFRYhWKMWc+W9VhgTSdTh9OjimDmdqE2clCa23C5eLEWlKGKObjeR2aQeolGjY9nY0GYNYUPDSiY7SYecpzXMVm8YMSKxZoEkvVip4uRdAyBh2bZyo6aFrAodFCAnczJESchAZZ1vNWT6BJLKU9EGYtafjmcs9S2+SpnRjqkjAbAYA1NVUNHGYcFXwSZw3jKw4XQTMxWnwCSwRLq/XWOMwe/JMKg2dYffd54kXjoN5rGWLJcK7AjyowTuI64S4cV/sKADgosRYVOE/KtuxDcyAcSS4JckAq4RKxqmUdJB3efAiHRrJZvtYHRWHGE+sj+xcVcMoy6w0farAwoNixihefIHrRXAM4oGLR8xfla0uELhqUWdU4sNsKUO8VHRFHiGRmLNF3AMfEbLBG4ZcajnN6KxzBOj1krJEQO8Wk93Bigd5rJcZuXLPDgE2FDiM5SfRhNjYLYQ2cFeDeC9QIlmZ1GkLgnR68E1OLZA6yiu1FkAfvz6zRALNzXkGTnrBWIIn2GGgoktKCbg2zZgfnvM/947KKhV5qGEO0jpV4GYHaXiWVV9CERoPTU7EVHKK1zCIep8EvNYVesI5Yi6OpA2XQT/oe3C2PKhplViRIYCuu4xFP8lKzlNOcq8Kp7AUFHhPbRsl7nESFxAI8q/rvNd1KmvQly7Skdd31NjS29NeCJGyiRU1HpernMJrsvaZSOY9D4+hhU78WDPq61tF09c9PQt2hfzMaNr6bVKySXwse7UjXll61DfBf6/Fuy583Q7GTbjW207fGdjroIOVH2wAnUS+E8a/qRy8ew/Evj2HPgzK92+tpN/d62kHN67Xku/t7p9joyxHXvW+U4mi63tRGvwEeSEs3LxlBSgAAAABJRU5ErkJggg==",
            "publicKey": "",
        };
        let url = AppGame.ins.weChatUrl + "/apps/uploadAvatar.php";
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                AppGame.ins.showConnect(false);
                UDebug.Log("data = " + JSON.stringify(data));
                if (data.sucess == 0) {
                    UDebug.log("headImgUrl ======" + data.data.data.headImgUrl);
                    if (data) {
                        if (data.data.code == 0) {
                            if (data.data.data.hasOwnProperty("headImgUrl")) {
                                AppGame.ins.roleModel.headImgUrl = data.data.data.headImgUrl;
                                this.emit(MRole.UPLOAD_HEAD_IMG_SUCCESS, true, data.data.data.headImgUrl);
                            }
                        } else {
                            var str = '头像图片上传失败' + '__url：' + url;
                            ErrorLogUtil.ins.addErrorLog(str, LogLevelType.INFO);
                            this.emit(MRole.UPLOAD_HEAD_IMG_SUCCESS, false, "")
                        }
                    }
                } else {
                    // AppGame.ins.showTips("头像上传失败------");
                    var str = '头像图片上传失败' + '__url：' + url;
                    ErrorLogUtil.ins.addErrorLog(str, LogLevelType.INFO);
                    this.emit(MRole.UPLOAD_HEAD_IMG_SUCCESS, false, "")
                }

            }, this, true));
    }

    /**
     * 请求线上充值列表数据
     */
    requestOnlineChargeList(): void {
        var parms = {
            "token": new RsaKey().arrayBufferToBase64(this._gamePass),
            "userId": this._useId,
            "methodName": VChargeConstants.CHARGE_REQUEST_GETONLINECHARGELIST,
            "publicKey": "",
        };
        let url = AppGame.ins.chargePayUrl + "/apps/recharge.php";
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                AppGame.ins.showConnect(false);
                this._onlineChargeData = new UIChargeOnLineData();
                this._onlineChargeData.datas = [];
                if (data.sucess == 0) {
                    let onData = data.data.data;
                    UDebug.Log("data = " + JSON.stringify(data.data.data));
                    if (data.data.code == -2) { // 请绑定真实姓名
                        this.emit(MRole.BIND_USERNAME, true);
                        this.emit(MRole.UPDATE_ONLINE_CHARGE, false);
                    } else if (data.data.code == 0 && onData.length > 0) {
                        var idx = 0;
                        onData.forEach(element => {
                            idx++;
                            var item = new UIChargeOnLineDataItem();
                            item.inputSw = element.inputSw;
                            item.maxMoneyLimit = element.maxMoneyLimit * CHARGE_SCALE;
                            item.minMoneyLimit = element.minMoneyLimit * CHARGE_SCALE;
                            item.rechargeMoney = element.rechargeMoney;
                            item.rechargeTypeIcon = element.rechargeTypeIcon;
                            item.rechargeTypeId = element.rechargeTypeId;
                            item.rechargeTypeName = element.rechargeTypeName;
                            item.type = element.type;
                            this._onlineChargeData.datas.push(item);
                        });
                        this.emit(MRole.UPDATE_ONLINE_CHARGE, true);
                    } else {
                        this.emit(MRole.UPDATE_ONLINE_CHARGE, true);
                    }
                } else {
                    var str = '线上充值列表数据请求异常，数据长度为空：' + '__url：' + url;
                    ErrorLogUtil.ins.addErrorLog(str, LogLevelType.INFO);
                    this.emit(MRole.UPDATE_ONLINE_CHARGE, false);
                }
            }, this, true));
    }

    /**
    * 创建线上支付订单
    * @param rechargeTypeId 
    * @param requestMoney 
    */
    requestCreateOnlineOrder(rechargeTypeId: number, requestMoney: number): void {
        var parms = {
            "token": new RsaKey().arrayBufferToBase64(this._gamePass),
            "userId": this._useId,
            "methodName": VChargeConstants.CHARGE_REQUEST_ONLINE_CREATE_ORDER,
            "rechargeTypeId": rechargeTypeId,
            "requestMoney": requestMoney * CHARGE_SCALE_100,
            "publicKey": ""
        };
        let url = AppGame.ins.chargePayUrl + "/apps/recharge.php";
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                AppGame.ins.showConnect(false);
                let orderItem = new UIChargeOnLineOrderItem();
                if (data.sucess == 0) {
                    let orderData = data.data.data;
                    if (!UStringHelper.isEmptyString(orderData)) {
                        /*orderItem.actionUrl = orderData.bridgeUrl;
                        orderItem.actionUrl2 = orderData.actionUrl;
                        orderItem.submitParam = orderData.submitParam;
                        this.emit(MRole.UPDATE_ONLINE_CREATE_ORDER, orderItem, true, "");*/
                        this.requestBridgeOnlinePay(orderData.submitParam, orderData.actionUrl);
                    } else {
                        var str = '创建线上支付订单失败：' + '__url：' + url + " 请求参数params = " + JSON.stringify(parms);
                        ErrorLogUtil.ins.addErrorLog(str, LogLevelType.ERROR);
                        this.emit(MRole.UPDATE_ONLINE_CREATE_ORDER, orderItem, false, data.data.msg || "创建线上支付订单失败，请稍后再试");
                    }
                }
                else {
                    var str = '创建线上支付订单失败：' + '__url：' + url + " 请求参数params = " + JSON.stringify(parms);
                    ErrorLogUtil.ins.addErrorLog(str, LogLevelType.ERROR);
                    AppGame.ins.showConnect(false);
                    this.emit(MRole.UPDATE_ONLINE_CREATE_ORDER, orderItem, false, "创建线上支付订单失败，请稍后再试");
                }
            }, this, true));
    }

    // 请求创建线上支付订单跳转链接
    requestBridgeOnlinePay(submitParam: any, actionUrl): void {
        let params: { [k: string]: any } = {};
        var parms = {
            "token": new RsaKey().arrayBufferToBase64(this._gamePass),
            "userId": this._useId,
            "methodName": VChargeConstants.CHARGE_REQUEST_ONLINE_BRIDGE_ORDER,
            "actionUrl": actionUrl,
            "publicKey": AppGame.ins._localRsaKey.aesKey
        };
        for (let key of Object.keys(parms)) {
            params[key] = parms[key];
        }
        if ((submitParam instanceof Object) && submitParam) {
            for (let key of Object.keys(submitParam)) {
                params[key] = submitParam[key];
            }
        }
        let url = AppGame.ins.chargePayUrl + "/apps/bridge.php";
        let jsonParams = JSON.stringify(params);
        let encryptStr = AppGame.ins._localRsaKey.encryptAes(jsonParams, cfg_key.onlinePaypriKey);
        // let dencryptStr = AppGame.ins._localRsaKey.decryptAes(encryptStr, priKey);
        let jumpUrl = url + '?' + "param=" + encodeURIComponent(encryptStr);
        cc.sys.openURL(jumpUrl);
    }

    requestOnlinePay(url: string, params: any, actionUrl: string): void {
        let jumpUrl = url + '?' + UStringHelper.objtoFormdata(params) + "&actionUrl=" + actionUrl;;
        // UDebug.Log("$$$$$$$需要跳转的URL地址为："+jumpUrl);
        cc.sys.openURL(jumpUrl);
    }

    /**
     * 请求继续线上支付订单
     * @param rechargeTypeId 
     * @param requestMoney 
     */
    requestPayOnlineOrder(rechargeTypeId: number, requestMoney: number, orderId: string): void {
        var parms = {
            "token": new RsaKey().arrayBufferToBase64(this._gamePass),
            "userId": this._useId,
            "methodName": "payOnlineOrder",
            "rechargeTypeId": rechargeTypeId,
            "requestMoney": requestMoney * CHARGE_SCALE_100,
            "orderId": orderId,
            "publicKey": ""
        };
        let url = AppGame.ins.chargePayUrl + "/apps/recharge.php";
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                AppGame.ins.showConnect(false);
                if (data.sucess == 0) {
                    let orderItem = new UIChargeOnLineOrderItem();
                    let orderData = data.data.data;
                    if (!UStringHelper.isEmptyString(orderData)) {
                        orderItem.actionUrl = orderData.bridgeUrl;
                        orderItem.submitParam = orderData.submitParam;
                        this.requestOnlinePay(orderData.bridgeUrl, orderData.submitParam, orderData.actionUrl);
                        // this.emit(MRole.UPDATE_ONLINE_CREATE_ORDER, orderItem, true, "");
                    }
                }
                else {
                    AppGame.ins.showConnect(false);
                    AppGame.ins.showTips("请求继续线上支付订单，请稍后再试");
                    // this.emit(MRole.UPDATE_ONLINE_CREATE_ORDER, orderItem, false, data.data.msg||"服务器繁忙，请稍后再试");
                }
            }, this, true));
    }

    /**
     * 请求线下充值列表数据
     */
    requestOffLineChargeList(): void {
        var parms = {
            "token": new RsaKey().arrayBufferToBase64(this._gamePass),
            "userId": this._useId,
            "methodName": VChargeConstants.CHARGE_REQUEST_GETOFFLINECHARGELIST,
            "publicKey": ""
        };
        let url = AppGame.ins.chargePayUrl + "/apps/recharge.php";
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                AppGame.ins.showConnect(false);
                if (data.sucess == 0) {
                    this._offlineChargeData = new UIChargeOffLineData();
                    this._offlineChargeData.datas = [];
                    let offData = data.data.data;
                    UDebug.Log("data = " + JSON.stringify(data.data.data));
                    if (data.data.code == -2) { // 请绑定真实姓名
                    } else if (data.data.code == 0 && offData.length > 0) {
                        var idx = 0;
                        offData.forEach(element => {
                            idx++;
                            var item = new UIChargeOffLineDataItem();
                            item.inputSw = element.inputSw;
                            item.maxMoneyLimit = element.maxMoneyLimit * CHARGE_SCALE;
                            item.minMoneyLimit = element.minMoneyLimit * CHARGE_SCALE;
                            item.rechargeMoney = element.rechargeMoney;
                            item.rechargeTypeIcon = element.rechargeTypeIcon;
                            item.rechargeTypeId = element.rechargeTypeId;
                            item.rechargeTypeName = element.rechargeTypeName;
                            item.type = element.type;
                            this._offlineChargeData.datas.push(item);
                        });
                        this.emit(MRole.UPDATE_OFFLINE_CHARGE, true);
                    } else {
                        var str = '线下充值列表数据为空：' + '__url：' + url + " 请求参数params = " + JSON.stringify(parms);
                        ErrorLogUtil.ins.addErrorLog(str, LogLevelType.INFO);
                        AppGame.ins.showConnect(false);
                        this.emit(MRole.UPDATE_OFFLINE_CHARGE, false);
                    }
                }
                else {
                    var str = '线下充值列表数据为空：' + '__url：' + url + " 请求参数params = " + JSON.stringify(parms);
                    ErrorLogUtil.ins.addErrorLog(str, LogLevelType.INFO);
                    AppGame.ins.showConnect(false);
                    this.emit(MRole.UPDATE_OFFLINE_CHARGE, false);
                }
            }, this, true));
    }

    /**
     * 创建线下充值订单
     * @param rechargeTypeId 充值类型ID
     * @param sp 1 线下 2 线上 3 线下客服充值
     * @param requestMoney 金额
     */
    requestCreateOffLineChargeOrder(rechargeTypeId: number, requestMoney: number, isUsdt: boolean, sp: number, usdtRate?: number, usdtAmount?: number): void {
        var parms = {
            "token": new RsaKey().arrayBufferToBase64(this._gamePass),
            "userId": this._useId,
            "methodName": VChargeConstants.CHARGE_REQUEST_CREATE_ORDER,
            "rechargeTypeId": rechargeTypeId,
            "usdtRate": usdtRate,
            "usdtAmount": usdtAmount,
            "sp": sp,
            "requestMoney": requestMoney * CHARGE_SCALE_100,
            "publicKey": ""
        };
        let url = AppGame.ins.chargePayUrl + "/apps/recharge.php";
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                let orderItem = new UIChargeOffLineOrderItem();
                if (data.sucess == 0) {
                    let orderData = data.data.data;
                    if (!UStringHelper.isEmptyString(orderData)) {
                        orderItem.createTime = orderData.createTime;
                        orderItem.amount = (parseFloat(orderData.amount) / CHARGE_SCALE_100) + "";
                        orderItem.orderId = orderData.orderId;
                        orderItem.userId = orderData.userId;
                        let accountInfo = JSON.parse(orderData.account);
                        orderItem.accountNo = accountInfo.no;
                        orderItem.name = accountInfo.name;
                        orderItem.uid = orderData.uid || "";
                        orderItem.timeSurplus = orderData.timeSurplus || 15
                        this.emit(MRole.UPDATE_OFFLINE_CREATE_ORDER, orderItem, true, data.data.msg || "", isUsdt);
                    } else {
                        this.emit(MRole.UPDATE_OFFLINE_CREATE_ORDER, orderItem, false, data.data.msg || "", isUsdt);
                    }
                }
                else {
                    var str = '创建线下充值订单失败：' + '__url：' + url + " 请求参数params = " + JSON.stringify(parms);
                    ErrorLogUtil.ins.addErrorLog(str, LogLevelType.ERROR);
                    this.emit(MRole.UPDATE_OFFLINE_CREATE_ORDER, orderItem, false, "创建线下充值订单失败，请稍等重试");
                }
            }, this, true));
    }

    /**
    * 请求订单详情
    * @param orderId 订单ID
    * @param payType 支付类型， 1为线上支付 2位线下支付
    */
    requestChargeOrderDetailInfo(orderId: string, payType: number): void {
        var parms = {
            "token": new RsaKey().arrayBufferToBase64(this._gamePass),
            "userId": this._useId,
            "methodName": VChargeConstants.CHARGE_REQUEST_GETONE_ORDER,
            "orderId": orderId,
            "publicKey": ""
        };
        let url = AppGame.ins.chargePayUrl + "/apps/recharge.php";
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                UDebug.Log("data = " + JSON.stringify(data));
                let orderItem = new UIChargeOrderDetailItem();
                if (data.sucess == 0) {
                    let orderData = data.data.data;
                    if (!UStringHelper.isEmptyString(orderData)) {
                        orderItem.createTime = orderData.createTime;
                        orderItem.amount = (parseFloat(orderData.amount) / CHARGE_SCALE_100) + "";
                        orderItem.orderId = orderData.orderId;
                        orderItem.userId = orderData.userId;
                        orderItem.status = orderData.status;
                        orderItem.usdtRate = orderData.usdtRate;
                        orderItem.usdtAmount = orderData.usdt;
                        orderItem.payType = payType;
                        orderItem.rechargeTypeName = orderData.rechargeTypeName;
                        if (this.isJSON(orderData.account)) {
                            let accountInfo = JSON.parse(orderData.account);
                            orderItem.accountNo = accountInfo.no;
                            orderItem.name = accountInfo.name;
                        } else {
                            var payTypeStr = payType == 1 ? "线上支付" : "线下支付";
                            var str = payTypeStr + VChargeConstants.CHARGE_REQUEST_GETONE_ORDER + "订单详情接口返回orderData.account 不是json串，accountNo和name字段配置错误" + "订单id=" + orderId + " ,userId=" + this._useId;
                            if (payType == 2) { // 线下支付，加入错误日志
                                ErrorLogUtil.ins.addErrorLog(str, LogLevelType.ERROR);
                            }
                            orderItem.accountNo = "";
                            orderItem.name = "";
                        }
                        orderItem.uid = orderData.uid || "";
                        orderItem.minus = parseInt((orderData.leftTime / 60).toFixed(2));
                        orderItem.seconds = orderData.leftTime % 60;
                        this.emit(MRole.UPDATE_ORDER_DETAIL_INFO, true, orderItem, data.data.msg);
                    }
                }
                else {
                    var str = "请求订单详情 失败-" + '__url：' + url + " 请求参数params = " + JSON.stringify(parms);
                    ErrorLogUtil.ins.addErrorLog(str, LogLevelType.ERROR);
                    this.emit(MRole.UPDATE_ORDER_DETAIL_INFO, false, orderItem, "请求订单详情失败");
                }
            }, this, true));
    }

    // 是否是json 字符串
    isJSON(str) {
        if (typeof str == 'string') {
            try {
                var obj = JSON.parse(str);
                if (typeof obj == 'object' && obj) {
                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                return false;
            }
        }
    }
    /**
     * 确认充值订单
     * @param orderId 订单id
     */
    requestConfirmOrderInfo(orderId: string): void {
        var parms = {
            "token": new RsaKey().arrayBufferToBase64(this._gamePass),
            "userId": this._useId,
            "methodName": VChargeConstants.CHARGE_REQUEST_CONFIRM_ORDER,
            "orderId": orderId,
            "publicKey": ""
        };
        let url = AppGame.ins.chargePayUrl + "/apps/recharge.php";
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                if (data.sucess == 0) {
                    this.emit(MRole.COMFIRM_ORDER_INFO, true, data.data.msg);
                } else {
                    this.emit(MRole.COMFIRM_ORDER_INFO, false, "确认充值订单失败");
                }
            }, this, true));
    }

    /**
     * 取消订单
     * @param orderId 订单ID
     */
    requestCancelOffLineChargeOrder(orderId: string, isReflseshOrder: boolean): void {
        var parms = {
            "token": new RsaKey().arrayBufferToBase64(this._gamePass),
            "userId": this._useId,
            "methodName": VChargeConstants.CHARGE_REQUEST_CANCLE_ORDER,
            "orderId": orderId,
            "publicKey": ""
        };
        let url = AppGame.ins.chargePayUrl + "/apps/recharge.php";
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                UDebug.Log("data = " + JSON.stringify(data));
                // let orderItem = new UIChargeOffLineOrderItem();
                if (data.sucess == 0) {
                    this.emit(MRole.UPDATE_OFFLINE_CANCEL_ORDER, true, data.data.msg, isReflseshOrder);
                } else {
                    AppGame.ins.showConnect(false);
                    this.emit(MRole.UPDATE_OFFLINE_CANCEL_ORDER, false, "取消订单失败", isReflseshOrder);
                }
            }, this, true));
    }

    /**
     * 请求订单列表数据
     */
    requestOrderList(): void {
        var parms = {
            "token": new RsaKey().arrayBufferToBase64(this._gamePass),
            "userId": this._useId,
            "methodName": VChargeConstants.CHARGE_REQUEST_GETORDERLIST,
            "publicKey": ""
        };
        let url = AppGame.ins.chargePayUrl + "/apps/recharge.php";
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                UDebug.Log("------------data = " + JSON.stringify(data));
                AppGame.ins.showConnect(false);
                if (data.sucess == 0) {
                    this._orderListData = new UIChargeOrderListData();
                    this._orderListData.datas = [];
                    let orderData = data.data.data;
                    if (orderData.length > 0) {
                        var idx = 0;
                        orderData.forEach(element => {
                            idx++;
                            var item = new UIChargeOrderListDataItem();
                            item.createTime = element.createTime;
                            item.orderId = element.orderId;
                            item.rechargeTypeId = element.rechargeTypeId;
                            item.rechargeMoney = parseFloat(element.rechargeMoney) / 100;
                            item.status = element.status;
                            if (element.sp == 1) {
                                if (element.hasOwnProperty("rechargeTypeName")) {
                                    item.sp = "线下-" + element.rechargeTypeName;
                                } else {
                                    item.sp = "线下-支付";
                                }
                                // item.sp = "线下-" + element.rechargeTypeName//element.rechargeTypeId] == ""?"支付":ULanHelper.CHARGE_TYPE[element.rechargeTypeId]);
                            } else if (element.sp == 2) {
                                if (element.hasOwnProperty("rechargeTypeName")) {
                                    item.sp = "线上-" + element.rechargeTypeName;
                                } else {
                                    item.sp = "线上-支付";
                                }
                                // item.sp = "线上-"+ element.rechargeTypeName//(ULanHelper.CHARGE_TYPE[element.rechargeTypeId] == ""?"支付":ULanHelper.CHARGE_TYPE[element.rechargeTypeId]);
                            } else if (element.sp == 3) {
                                item.sp = "线下客服充值";
                            } else if (element.sp == 5) {
                                item.sp = "支付补发";
                            } else {
                                item.sp = "系统补发";
                            }
                            this._orderListData.datas.push(item);
                        });
                    }
                    this.emit(MRole.UPDATE_OFFLINE_ORDER_LIST, true);
                }
                else {
                    var str = "请求订单列表数据失败-" + '__url：' + url + " 请求参数params = " + JSON.stringify(parms);
                    ErrorLogUtil.ins.addErrorLog(str, LogLevelType.ERROR);
                    this.emit(MRole.UPDATE_OFFLINE_ORDER_LIST, false);
                }
            }, this, true));
    }

    // 请求刷新USDT 收款地址
    requestRefleshUsdtAddress(type: number = 2): void {
        var parms = {
            "token": new RsaKey().arrayBufferToBase64(this._gamePass),
            "userId": this._useId,
            "methodName": VChargeConstants.CHARGE_REQUEST_REFLESH_USDT_ADDRESS,
            "type": type,
            "publicKey": ""
        };
        let url = AppGame.ins.chargePayUrl + "/apps/recharge.php";
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                if (data.sucess == 0) {
                    let account = data.data ? data.data.data.account : "";
                    if (!UStringHelper.isEmptyString(account)) {
                        if (this.isJSON(account)) {
                            let address = JSON.parse(account).no;
                            this.emit(MRole.REFLESH_USDT_ADDRESS, true, address);
                        } else {
                            var str = "通过POST 请求连接url=" + url + " 返回的数据解析account字段不是一个JSON的字符串，解析出错";
                            ErrorLogUtil.ins.addErrorLog(str, LogLevelType.ERROR);
                        }
                    }
                } else {
                    this.emit(MRole.REFLESH_USDT_ADDRESS, false, "");
                }
            }, this, true));

    }

    /**
     * 请求 兑换列表方式
     * @param orderId 订单id
     */
    requestExchangeList(): void {
        var parms = {
            "token": new RsaKey().arrayBufferToBase64(this._gamePass),
            "userId": this._useId,
            "methodName": VChargeConstants.EXCHANGE_REQUEST_LIST,
            "publicKey": ""
        };
        let url = AppGame.ins.chargePayUrl + "/apps/recharge.php";
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                if (data.sucess == 0) {
                    this.emit(MRole.EXCHANGE_REQUEST_LIST, true, data.data.data);
                } else {
                    this.emit(MRole.EXCHANGE_REQUEST_LIST, false, "请求兑换列表方式失败");
                }
            }, this, true));
    }


    /**
     * 上传日志 
     * @param logLevel 日志等级
     * @param logBody 日志内容
     */
    requestUploadLog(logLevel: number, logBody: string) {
        var plate = UPlatformHelper.getPlateForm();
        let deviceType = 0;
        if (CC_JSB && cc.sys.OS_ANDROID == cc.sys.os) {
            deviceType = 1; // 安卓app
        } else if (CC_JSB && cc.sys.OS_IOS == cc.sys.os) {
            deviceType = 2; // ios 
        } else {
            deviceType = 5; // 其他pc 类型
        }
        if (logBody.indexOf("socket连接失败") != -1) {
            return;
        }
        var parms = {
            "userId": this._useId, // 用户usderId
            "logLevel": logLevel,// 日志等级1:DEBUG (调试)2:INFO (信息)3:WARNING (警告)4:ERROR (错误)5:FATAL (致命)
            "logBody": logBody,// 日志内容
            "deviceType": deviceType, // 客户端设备类型 
            "deviceNo": plate.machineSerial, // 客户端设备号
            "deviceVersion": plate.machineType,// 客户端设备版本信息
        };

        let url = "";
        if (cfg_global.env == 2) {
            url = cfg_global.upload_log_url_pro;
        } else {
            url = cfg_global.upload_log_url;
        }
        var request = cc.loader.getXMLHttpRequest();
        try {
            // 兼容IE
            request.timeout = 25000;
        } catch (err) { }
        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                if (request.status >= 200 && request.status < 400) {
                    let response = request.responseText;
                    UDebug.Log("日志上报接口数据打印============" + JSON.stringify(response));
                } else {
                    var str = '返回状态：' + request.status + '__url：' + url;
                }
            } else {
            }
        }
        request.open("POST", url);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        request.send(JSON.stringify(parms));
    }


    /**
     * 请求代理充值客服列表
     */
    requsetProxyRecharge(): void {
        UDebug.log("请求代理充值客服列表", AppGame.ins.LoginModel.LoginData.businessId)
        AppGame.ins.showConnect(true);
        UAPIHelper.GetServerPayList(AppGame.ins.LoginModel.LoginData.businessId);
    }
    requestOpenCustomerServiceList(): void {
        UAPIHelper.OpenCustomerServiceList(AppGame.ins.LoginModel.LoginData.businessId, this.useId.toString(), this.nickName);
    }
    requestOpenMessageDetail(serviceid: string, serviceName: string, avatar: string): void {
        UAPIHelper.OpenMessageDetail(serviceid, serviceName, AppGame.ins.LoginModel.LoginData.businessId, this.useId.toString(), this.nickName, avatar);
    }

    /**
     * @description 请求绑定微信
     */
    requsetBindWeChat(openId: string, nickName: string, headImgUrl: string,) {
        AppGame.ins.showConnect(true);
        let _BindWechatMessage = HallServer.BindWechatMessage.create();
        _BindWechatMessage.userId = this._useId
        _BindWechatMessage.openId = openId;
        _BindWechatMessage.nickName = nickName;
        _BindWechatMessage.headImgUrl = headImgUrl;
        _BindWechatMessage.verifyCode = VBindWeChatVerify.editBoxCode;
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_WECHAT_MESSAGE_REQ, _BindWechatMessage);
    };

    /**
     * @description 请求绑定微信返回
     */
    responseBindWeChat(caller: HallServer.BindWechatMessageResponse) {
        console.log("请求绑定微信返回 :", caller.errorMsg)
        AppGame.ins.showConnect(false);
        let retCode = caller.retCode;
        if (retCode == 0) {
            this.emit(MLogin.LOGIN_ERROR, "微信绑定成功");
            AppGame.ins.closeUI(ECommonUI.UI_BIND_WECHAT_VERIFY);
            AppGame.ins.roleModel.weChatOpenId = caller.openId;

            this.emit(MRole.REF_WECAHT_BIND_STATE);
        } else {
            this.emit(MLogin.LOGIN_ERROR, caller.errorMsg);
            AppGame.ins.showTips(caller.errorMsg);
        };

    };



    /**
     * 是否为临时账号
     */
    getIsTempAccount(): boolean {
        return UStringHelper.isEmptyString(this._mobileNum);
    }

    /**
     * @description 是否绑定微信
     */
    getIsBindWeChat(): boolean {
        let boo = UStringHelper.isEmptyString(this.weChatOpenId);
        return boo;
    };

    /**
    * 获取玩家显示信息
    */
    getRoleShowInfo(): URoleInfo {
        let role = new URoleInfo();
        role.gold = this._score;
        role.headId = this._headId;
        role.roleName = this._nickName;
        role.roleId = this._useId;
        role.frameId = this._headboxId;
        role.vip = this._vipLevel;
        return role;
    }
    /**获取玩家金币 */
    getRoleGold(): number {
        return this._score;
    }
    /**获取玩家房卡数量 */
    getRoomCard(): number {
        return this._roomCard;
    }
    /**
     * 获取充值记录
     */
    getChargeRecords(): Array<UIChargeRecordsItem> {
        return this._chargeRecordsData;
    }
    /**获取兑换记录 */
    getExChargeRecords(): Array<UIExchargeRecordsItem> {
        return this._exchargeRecordsData;
    }
    /**
     * 获取兑换界面的UI
     */
    getexchangeData(): UIExchangeData {
        var data = new UIExchangeData();
        data.aliCount = this._aliPayAccount;
        data.bankCount = this._bankCardNum;
        data.gold = this._score;
        return data;
    }
    /**
     * 获取玩家信息界面的信息
     */
    getpersonalinfo(): UIPersonalData {
        var data = new UIPersonalData();
        data.accountId = this.useId;
        data.headBoxId = this.headboxId;
        data.headId = this.headId;
        data.vipLv = this.vipLevel;
        if (this.vipInfo[this.vipLevel + 1]) {
            data.max = this.vipInfo[this.vipLevel + 1];
        } else {
            data.max = 0;
        }
        data.exp = this.rechargeAmount;
        data.gold = this.score;
        data.istempAccount = UStringHelper.isEmptyString(this._mobileNum);
        data.nickName = this.nickName;
        data.trueName = this._trueName;
        return data;
    }
    /**
     * 获取头像列表信息
     */
    getHeadInfo(): UHeadData {
        let role = new UHeadData();
        role.owner = this._headId;
        role.frameId = this._headboxId;
        role.heads = [];
        role.frames = [];
        var unlockframes = cfg_vip[this.vipLevel];
        for (const key in cfg_head) {
            if (cfg_head.hasOwnProperty(key)) {
                const element = cfg_head[key];
                var item = new UIHeadItem();
                item.frameId = element.headId;
                item.lock = false;
                role.heads.push(item);
                if (role.owner == element.headId) {
                    role.sex = element.sex;
                }
            }
        }
        for (const key in cfg_frame) {
            if (cfg_frame.hasOwnProperty(key)) {
                const element = cfg_frame[key];
                var item = new UIHeadItem();
                item.frameId = element.id;
                item.lock = unlockframes.frames.indexOf(element.id) < 0;
                item.toplab = element.toplab
                item.bottomlab = element.bottomlab
                role.frames.push(item);
            }
        }
        return role;
    }
    getbankData(): UIBankData {
        var data = new UIBankData();
        data.bankGold = this._bankScore;
        data.currentGold = this._score;
        return data;
    }
    getChargeType(): Array<UIChargeData> {
        var data = new Array<UIChargeData>();
        // var item = new UIChargeData();
        // item.chargetype = 6;
        // item.chargeurl = 'www.baidu.com';
        // item.charges = [];
        // item.maxmoneylimit = 10000;
        // item.minmoneylimit = 1;
        // data.push(item);
        for (const key in this._httpchargeData) {
            if (this._httpchargeData.hasOwnProperty(key)) {
                const element = this._httpchargeData[key];
                var item = new UIChargeData();
                item.chargetype = element.channelId;
                item.chargeurl = ""//element.payurl;
                item.charges = JSON.parse(element.moneyList);//element.moneyList;
                item.maxmoneylimit = element.maxMoneyLimit;
                item.minmoneylimit = element.minMoneyLimit;
                data.push(item);
            }
        }
        return data;
    }
    getVipData(): UVipData {
        var vip = new UVipData();
        vip.vipLv = this._vipLevel;
        var nextVip = vip.vipLv + 1;
        if (this._vipInfo[nextVip]) {
            vip.max = this._vipInfo[nextVip];
            vip.exp = this._chargeAmount;
            vip.needChargeNum = vip.max - vip.exp;
        } else {
            vip.max = -1;
            vip.exp = 0;
            vip.needChargeNum = 0;
        }
        vip.items = [];
        for (const key in cfg_vip) {
            if (cfg_vip.hasOwnProperty(key)) {
                const element = cfg_vip[key];
                if (element.lv != 0) {
                    var item = new UVipitemData();
                    item.lv = element.lv;
                    item.frameId = element.awards;
                    item.desc = element.desc;
                    if (this._vipInfo[element.lv])
                        item.chargeNum = this._vipInfo[element.lv];
                    else
                        item.chargeNum = element.chargeNum;
                    vip.items.push(item);
                }
            }
        }
        return vip;
    }

    // 获取线下支付数据
    getOffLineChargeData(): UIChargeOffLineData {
        return this._offlineChargeData;
    }

    // 获取线上支付数据
    getOnLineChargeData(): UIChargeOnLineData {
        return this._onlineChargeData;
    }

    // 获取订单列表数据
    getOrderListData(): UIChargeOrderListData {
        return this._orderListData;
    }

    // 获取用户绑定信息
    getBindInfoData(): UserBindInfoData {
        var infoData = new UserBindInfoData();
        infoData.alipayAccount = this._aliPayAccount;
        infoData.alipayName = this._aliPayName;
        infoData.bankCardName = this._bankCardName;
        infoData.bankCardNum = this._bankCardNum;
        infoData.trueName = this._trueName;
        infoData.usdtAddress = this._usdtAddress;
        infoData.mobileNum = this._mobileNum;
        infoData.exchangeRate = this._exchangeRate;
        return infoData;
    }

    // 获取兑换最小限额信息
    getExchangeLimitMoneyInfoData(): ExchangeLimitMoneyInfoData {
        var infoData = new ExchangeLimitMoneyInfoData();
        infoData.exchangeTimesOneDay = this._exchangeTimesOneDay;
        infoData.exchangeInterval = this._exchangeInterval;
        infoData.exchangeMinMoneyBank = this._exchangeMinMoneyBank;
        infoData.exchangeMaxMoneyBank = this._exchangeMaxMoneyBank;
        infoData.exchangeMinMoneyAlipay = this._exchangeMinMoneyAlipay;
        infoData.exchangeMaxMoneyAlipay = this._exchangeMaxMoneyAlipay;
        infoData.exchangeMinLeftMoney = this._exchangeMinLeftMoney;
        infoData.exchangeMinMoneyUsdt = this._exchangeMinMoneyUsdt;
        infoData.exchangeMaxMoneyUsdt = this._exchangeMaxMoneyUsdt;
        return infoData;
    }
}
