import VWindow from "../../../common/base/VWindow";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame";
import UResManager from "../../../common/base/UResManager";
import { EIconType, ECommonUI, ELevelType, EGameType } from "../../../common/base/UAllenum";
import { UIPersonalData } from "./RoleInfoClass";
import UHandler from "../../../common/utility/UHandler";
import ULanHelper from "../../../common/utility/ULanHelper";
import MRole from "../lobby/MRole";
import MLogin from "../../login/MLogin";
import UStringHelper from "../../../common/utility/UStringHelper";
import { ZJH_SCALE } from "../../../game/zjh/MZJH";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import { Game, HallFriendServer, HallServer, ZJH } from "../../../common/cmd/proto";
import UMsgCenter from "../../../common/net/UMsgCenter";
import UDebug from "../../../common/utility/UDebug";
import VHall from "../lobby/VHall";
import { UserBindInfoData } from "../charge/ChargeData";
import personal from "./personal";
import getDays from "./getDays";
import time_type from "./time_type";
import numberTabel from "./numbeTable";
import game_type from "./game_type";
import room_name from "./room_name";
import FriendDeType from "./FriendsDeType";
import cfg_global from "../../../config/cfg_global";
import MFriendsRoomCardModel from "../friends/friends_room_card/MFriendsRoomCardModel";
import UAudioManager from "../../../common/base/UAudioManager";
import { COIN_RATE } from "../../../config/cfg_common";
import UCommon from "../../../common/utility/UCommon";


var curDate = new Date();
var curYear = curDate.getFullYear();
var curMonth = curDate.getMonth() + 1;
var curDay = curDate.getDate();

const { ccclass, property } = cc._decorator;

/**炸金花焖牌轮数 */
const ZJH_MENPAI_LUNSHU = [1, 1, 2, 3]

@ccclass
export default class VPersonal extends VWindow {

    @property(cc.SpriteFrame)
    vip_first: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    vip_second: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    vip_third: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    vip_fourth: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    vip_fifth: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    vip_sixth: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    vip_seventh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    up_arrow: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    down_arrow: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    banner_bg: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    brlh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    qznn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    brhh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    kpqzjh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    brnn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    qzjh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    ebg: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    tbjh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    tbnn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    kpqznn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    xpnn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    xpjh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    sg: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    brjh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    ddz: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    zjh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    bcbm: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    bj: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    pdk: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    sss: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    select_btn: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    sh: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    dzpk: cc.SpriteFrame = null;

    @property({ type: cc.Node, tooltip: "绑定微信icon" }) weChatIcon: cc.Node = null;
    @property({ type: cc.Node, tooltip: "绑定微信按钮" }) bindWeChatBtn: cc.Node = null;

    @property(cc.SpriteFrame)
    gray: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    white: cc.SpriteFrame = null;

    /**三个按钮时候的位置 */
    private _threepos: number = 250;
    /**两个按钮时候的位置 */
    private _twopos: number = 130;
    /**登出按钮 */
    private _logout: cc.Node;
    /**设置按钮 */
    private _setting: cc.Node;
    /**注册按钮 */
    private _regester: cc.Node;
    private _headIcon: cc.Sprite;
    private _frameIcon: cc.Sprite;
    private _name: cc.Label;
    private _realname: cc.Label;
    private _telephone: cc.Label;
    private _accountId: cc.Label;
    private _labtip: cc.Label;
    private _lv: cc.Sprite;
    private _viplv: cc.Sprite;
    private _lvc: cc.Sprite;
    private _gold: cc.Label;
    private _bankscore: cc.Label;
    private _lvprocess: cc.Label;
    // private _process: cc.Sprite;
    private changeTrueName: cc.Node;
    private _alipayLabel: cc.Label;
    private _bankLabel: cc.Label;
    private _usdtLabel: cc.Label;
    private _bindAlipay: cc.Node;
    private _bindBank: cc.Node;
    private _bindUsdt: cc.Node;
    private _userBindInfoData: UserBindInfoData;
    private _vipLevel: cc.Sprite;
    private _back: cc.Node;
    private _personal_btn: cc.Node;
    private _account_btn: cc.Node;
    private _record_btn: cc.Node;
    private _friendsDetail_btn: cc.Node;
    private __btn: cc.Node;
    private _content: cc.Node;
    private _select_time: cc.Node;
    private _select_type: cc.Node;
    private _record_time_select: cc.Node;
    private _record_game_select: cc.Node;
    private _account_type_content: cc.Node;
    private _account_time_content: cc.Node;
    private _friendsDetails_type_content: cc.Node;
    private _friendsDetails_time_content: cc.Node;
    private _account_item: cc.Node;
    private _no_data: cc.Node;
    private _record_time_content: cc.Node;
    private _record_type_content: cc.Node;
    private _record_select_time: cc.Node;
    private _record_select_type: cc.Node;
    private _record_no_data: cc.Node;
    private _record_item: cc.Node;

    private _friendsDetails_no_data: cc.Node;
    private _friendsDetails_item: cc.Node;
    private _friendsDetails_select_time: cc.Node;
    private _friendsDetails_select_type: cc.Node;

    private _account_request_id: string;
    private _record_request_id: string;
    private _friendsDe_request_id: string;
    private _mobile_tip: cc.Node;


    private _music_toggle: cc.Toggle;

    private _sound_toggle: cc.Toggle;

    init(): void {
        super.init();

        //个人信息
        this._logout = UNodeHelper.find(this._root, "content/personal_information/btn_exit");
        this._regester = UNodeHelper.find(this._root, "content/personal_information/btn_regest");

        this._name = UNodeHelper.getComponent(this._root, "content/personal_information/name", cc.Label);
        this._realname = UNodeHelper.getComponent(this._root, "content/personal_information/realname", cc.Label);
        this._telephone = UNodeHelper.getComponent(this._root, "content/personal_information/mobilenum", cc.Label);
        this._labtip = UNodeHelper.getComponent(this._root, "content/personal_information/labtip", cc.Label);

        this._gold = UNodeHelper.getComponent(this._root, "content/personal_information/gold", cc.Label);
        this._bankscore = UNodeHelper.getComponent(this._root, "content/personal_information/bankscore", cc.Label);
        this._lvprocess = UNodeHelper.getComponent(this._root, "content/personal_information/lvprocess", cc.Label);
        this._accountId = UNodeHelper.getComponent(this._root, "content/personal_information/accountId", cc.Label);
        this._lv = UNodeHelper.getComponent(this._root, "content/personal_information/prs_lv0", cc.Sprite);
        this._lvc = UNodeHelper.getComponent(this._root, "content/personal_information/prs_lvc", cc.Sprite);
        this._viplv = UNodeHelper.getComponent(this._root, "content/personal_information/prs_vip0", cc.Sprite);

        this._headIcon = UNodeHelper.getComponent(this._root, "content/personal_information/headbtn/head_icon", cc.Sprite);
        this._frameIcon = UNodeHelper.getComponent(this._root, "content/personal_information/headbtn/frame_icon", cc.Sprite);
        // this._process = UNodeHelper.getComponent(this._root, "prs_progressBg/prs_progressIng", cc.Sprite);
        this._personal_btn = UNodeHelper.find(this._root, "mask_bg/left_area/personal_btn");

        this._content = UNodeHelper.find(this._root, "content");

        let getNode = (leftBtnNode: string, typeContent: string, timeContent: string,
            noData: string, item: string, selectTime: string, selectType: string, path: string, leftBtnName: string) => {
            this[leftBtnNode] = UNodeHelper.find(this._root, `mask_bg/left_area/${leftBtnName}`);
            this[typeContent] = UNodeHelper.find(this._root, `content/${path}/select_type/checkmark/scrollView/view/content`);
            this[timeContent] = UNodeHelper.find(this._root, `content/${path}/select_time/checkmark/all_dates`);
            this[noData] = UNodeHelper.find(this._root, `content/${path}/scrollView/view/content/no_data`);
            this[item] = UNodeHelper.find(this._root, `content/${path}/scrollView/view/content/item`);
            this[selectTime] = UNodeHelper.find(this._root, `content/${path}/select_time`);
            this[selectType] = UNodeHelper.find(this._root, `content/${path}/select_type`);
        };

        //账户明细
        getNode("_account_btn", "_account_type_content", "_account_time_content",
            "_no_data", "_account_item", "_select_time", "_select_type", "account_details", "account_btn");
        //投注记录
        this._record_time_select = UNodeHelper.find(this._root, "content/betting_record/select_time");
        this._record_game_select = UNodeHelper.find(this._root, "content/betting_record/select_type");

        getNode("_record_btn", "_record_type_content", "_record_time_content",
            "_record_no_data", "_record_item", "_record_select_time", "_record_select_type", "betting_record", "record_btn");

        // 房卡明细
        getNode("_friendsDetail_btn", "_friendsDetails_type_content", "_friendsDetails_time_content",
            "_friendsDetails_no_data", "_friendsDetails_item", "_friendsDetails_select_time", "_friendsDetails_select_type", "friends_details", "friendsDetail_btn");


        var btnCopy = UNodeHelper.find(this._root, "content/personal_information/btn_copy");
        var changehead = UNodeHelper.find(this._root, "content/personal_information/btn_change_head");
        var changeName = UNodeHelper.find(this._root, "content/personal_information/btn_changename");
        this.changeTrueName = UNodeHelper.find(this._root, "content/personal_information/btn_changetruename");
        var headbtn = UNodeHelper.find(this._root, "content/personal_information/headbtn");

        this._alipayLabel = UNodeHelper.getComponent(this._root, "content/personal_information/bindInfo/alipay/cardno", cc.Label);
        this._bankLabel = UNodeHelper.getComponent(this._root, "content/personal_information/bindInfo/bank/cardno", cc.Label);
        this._usdtLabel = UNodeHelper.getComponent(this._root, "content/personal_information/bindInfo/usdt/cardno", cc.Label);
        this._bindAlipay = UNodeHelper.find(this._root, "content/personal_information/bindInfo/alipay/btnbind");
        this._bindBank = UNodeHelper.find(this._root, "content/personal_information/bindInfo/bank/btnbind");
        this._bindUsdt = UNodeHelper.find(this._root, "content/personal_information/bindInfo/usdt/btnbind");
        this._vipLevel = UNodeHelper.getComponent(this._root, "content/personal_information/vip_level", cc.Sprite);
        this._back = UNodeHelper.find(this.node, "back");
        this._mobile_tip = UNodeHelper.find(this._root, "content/personal_information/mobile_tip");
        UEventHandler.addClick(this._back, this.node, "VPersonal", "closeUI");
        UEventHandler.addClick(this._bindAlipay, this.node, "VPersonal", "bindAlipay");
        UEventHandler.addClick(this._bindBank, this.node, "VPersonal", "bindBank");
        UEventHandler.addClick(this._bindUsdt, this.node, "VPersonal", "bindUsdt");
        UEventHandler.addClick(this._logout, this.node, "VPersonal", "onlogout");
        // UEventHandler.addClick(this._setting, this.node, "VPersonal", "onsetting");
        UEventHandler.addClick(this._regester, this.node, "VPersonal", "onregester");
        UEventHandler.addClick(headbtn, this.node, "VPersonal", "onchangehead");
        UEventHandler.addClick(changehead, this.node, "VPersonal", "onchangehead");
        UEventHandler.addClick(changeName, this.node, "VPersonal", "onchangename");
        UEventHandler.addClick(this.changeTrueName, this.node, "VPersonal", "onchangetruename");
        UEventHandler.addClick(btnCopy, this.node, "VPersonal", "oncopy");

        AppGame.ins.roleModel.getRoleShowInfo();

        /**
         * @description  时间和类型下拉列表事件注册
         * @param typeContent 类型下拉列表content
         * @param timeContent 时间下拉列表content 
         * @param selectTCallBackName  时间下拉列表回掉
         * @param selectTyCallBack 类型下拉列表回掉
         */
        let registeredEvent = (typeContent: cc.Node, timeContent: cc.Node, selectTCallBackName: string, selectTyCallBack: string) => {
            for (var i = 0; i < timeContent.childrenCount; i++) {
                UEventHandler.addClick(timeContent.children[i], this.node, "VPersonal", selectTCallBackName, timeContent.children[i].getChildByName("label").getComponent(cc.Label).string);
            }

            for (var i = 0; i < typeContent.childrenCount; i++) {
                UEventHandler.addClick(typeContent.children[i], this.node, "VPersonal", selectTyCallBack, typeContent.children[i].getChildByName("label").getComponent(cc.Label).string);
            }
        };

        registeredEvent(this._account_type_content, this._account_time_content, "accountSelectTime", "accountSelectType");

        registeredEvent(this._record_type_content, this._record_time_content, "detailSelectTime", "detailSelectType");

        registeredEvent(this._friendsDetails_type_content, this._friendsDetails_time_content, "friendsDeSelectTime", "friendsDeSelectType");

        this._content.getChildByName("account_details").getChildByName("scrollView").on("scroll-to-bottom", this.accountScrollToBottom, this);
        this._content.getChildByName("betting_record").getChildByName("scrollView").on("scroll-to-bottom", this.recordScrollToBottom, this);
        this._content.getChildByName("friends_details").getChildByName("scrollView").on("scroll-to-bottom", this.friendsDeScrollToBottom, this);



        this._account_request_id = "";
        this._record_request_id = "";
        this._friendsDe_request_id = "";


        this._music_toggle = UNodeHelper.getComponent(this.node, "root/content/personal_information/ui_setting_hy/music_toggle", cc.Toggle);
        this._sound_toggle = UNodeHelper.getComponent(this.node, "root/content/personal_information/ui_setting_hy/sound_toggle", cc.Toggle);
        UEventHandler.addToggle(this._music_toggle.node, this.node, "VPersonal", "musicBtnClick");
        UEventHandler.addToggle(this._sound_toggle.node, this.node, "VPersonal", "soundBtnClick");
        UNodeHelper.getComponent(this.node, "root/content/personal_information/ui_setting_hy/lab_version", cc.Label).string = "版本  " + cfg_global.version;
        this.refreshData();
    }

    private musicBtnClick(caller: cc.Toggle): void {
        if (this._music_toggle.isChecked) {
            AppGame.ins.setting.music = 1;
        } else {
            AppGame.ins.setting.music = 0;
        }
    }

    private soundBtnClick(caller: cc.Toggle): void {
        if (this._sound_toggle.isChecked) {
            AppGame.ins.setting.sound = 1;
        } else {
            AppGame.ins.setting.sound = 0;
        }
    }

    private refreshData(): void {
        // this._musicBar.progress = AppGame.ins.setting.music;
        // this._soundBar.progress = AppGame.ins.setting.sound;
        // this._muback.fillRange = AppGame.ins.setting.music;
        // this._sdback.fillRange = AppGame.ins.setting.sound;
        if (AppGame.ins.setting.music == 1) {
            this._music_toggle.isChecked = true;
        } else if (AppGame.ins.setting.music == 0) {
            this._music_toggle.isChecked = false;
        };

        if (AppGame.ins.setting.sound == 1) {
            this._sound_toggle.isChecked = true;
        } else if (AppGame.ins.setting.sound == 0) {
            this._sound_toggle.isChecked = false;
        }

    }






    private onlogout(): void {
        super.playclick();
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 3, data: ULanHelper.LOGOUT, handler: UHandler.create((a) => {
                if (a) {
                    AppGame.ins.closeUI(this.uiType);
                    AppGame.ins.jumpToLogin(true);
                }
            }, this)
        });
    }
    // private onsetting(): void {
    //     AppGame.ins.showUI(ECommonUI.LB_Setting);
    //     this.playclick();
    // }

    private accountScrollToBottom(): void {
        var a = this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").childrenCount;
        if(this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").children[a - 1].getChildByName("refId")){
            var b = this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").children[a - 1].getChildByName("refId").getComponent(cc.Label).string;
        }else{
            return
        }
        var startDate = time_type[this._select_time.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string].startDate;
        var endDate = time_type[this._select_time.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string].endDate;
        var type = personal[this._select_type.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string].type;
        AppGame.ins.roleModel.requestAccountDetails(startDate, endDate, type, b);
        this._account_request_id = b;
        AppGame.ins.showConnect(true);

    }

    private recordScrollToBottom(): void {
        var a = this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view").getChildByName("content").childrenCount;
        if(this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view").getChildByName("content").children[a - 1].getChildByName("refId")){
            var b = this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view").getChildByName("content").children[a - 1].getChildByName("refId").getComponent(cc.Label).string;
        }else{
            return
        }
        var startDate = time_type[this._record_select_time.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string].startDate;
        var endDate = time_type[this._record_select_time.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string].endDate;
        var id = game_type[this._record_select_type.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string].id;
        AppGame.ins.roleModel.requestBettingRecords(startDate, endDate, id, b);
        this._record_request_id = b;
        AppGame.ins.showConnect(true);
    }

    private friendsDeScrollToBottom(): void {
        var a = this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").childrenCount;
        if(this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").children[a - 1].getChildByName("refId")){
            var b = this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").children[a - 1].getChildByName("refId").getComponent(cc.Label).string;
        }else{
            return
        }
        var startDate = time_type[this._friendsDetails_select_time.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string].startDate;
        var endDate = time_type[this._friendsDetails_select_time.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string].endDate;
        var type = FriendDeType[this._friendsDetails_select_type.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string].type;
        AppGame.ins.friendsRoomCardModel.requestFriendsDetails(startDate, endDate, type, b);
        this._friendsDe_request_id = b;
        AppGame.ins.showConnect(true);

    }


    private bindAlipay(): void {
        super.playclick();
        AppGame.ins.showUI(ECommonUI.EXCHANGE_BIND_ALIPAY, 1);
    }

    private bindBank(): void {
        super.playclick();
        AppGame.ins.showUI(ECommonUI.EXCHANGE_BIND_BANK_CARD, 1);
    }

    private bindUsdt(): void {
        super.playclick();
        AppGame.ins.showUI(ECommonUI.EXCHANGE_BIND_USDT, 1);
    }



    private onregester(): void {
        AppGame.ins.showUI(ECommonUI.LB_Regester);
        this.playclick();
    }
    private onchangehead(): void {
        AppGame.ins.showUI(ECommonUI.LB_Head);
        this.playclick();
    }
    private onchangename(): void {
        AppGame.ins.showUI(ECommonUI.LB_ReName);
        this.playclick();
    }

    private onchangetruename(): void {
        AppGame.ins.showUI(ECommonUI.EXCHANGE_BIND_USERNAME);
        this.playclick();
    }
    private oncopy(): void {
        super.playclick();
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked(this._accountId.string.substring(3, 20));
    }

    show(data: any): void {
        super.show(data);
        var dt = AppGame.ins.roleModel.getpersonalinfo();
        this.binddata(dt);
        this.personal_btn_click();
        this._root.getChildByName("mask_bg").getChildByName("left_area").getChildByName("personal_btn").getComponent(cc.Toggle).isChecked = true;
        this._root.getChildByName("mask_bg").getChildByName("left_area").getChildByName("account_btn").getComponent(cc.Toggle).isChecked = false;
        this._root.getChildByName("mask_bg").getChildByName("left_area").getChildByName("record_btn").getComponent(cc.Toggle).isChecked = false;
        this.refWeChatBindState();
    };

    /**
     * @description 刷新微信绑定状态
     */
    refWeChatBindState() {
        let boo = AppGame.ins.roleModel.getIsBindWeChat();
        this.weChatIcon.active = !boo;
        this.bindWeChatBtn.active = boo;
    };

    private _viewType = 0;
    /**
     * @description 个人信息
     */
    private personal_btn_click(): void {
        if (this._viewType != 0) {
            this._viewType = 0;
            this.setPersonalCenterShow(this._personal_btn, "personal_information");
        };
    }

    /**
     * @description 账号明细
     */
    private account_btn_click(): void {
        if (this._viewType != 1) {
            this._viewType = 1;
            this.requestAccountDetail();
            this.setPersonalCenterShow(this._account_btn, "account_details");
        };
    }
    /**
     * @description 投注记录
     */
    private record_btn_click(): void {
        if (this._viewType != 2) {
            this._viewType = 2;
            let typeContent = this["_record_select_type"];

            let content = UNodeHelper.find(typeContent, "checkmark/scrollView/view/content");
            let childs = content.children;
            for (let i = 0; i < childs.length; i++) {
                childs[i].active = false;
            };
            childs[0].active = true;

            let gameList = AppGame.ins.hallModel.getGameList();
            let count=0;
            for (let i = 0; i < gameList.length; i++) {
                let abbreviateName = gameList[i]["abbreviateName"];
                let node = content.getChildByName(abbreviateName);
                if(node!=null){
                    node.active = true;
                    node.zIndex=count;
                    if(count % 2 == 0){
                        node.getComponentInChildren(cc.Sprite).spriteFrame = this.white;
                        
                    }else{
                        node.getComponentInChildren(cc.Sprite).spriteFrame  = this.gray;
                    }
                    count++;
                }
            };
            this.requestAllRecord();
            this.setPersonalCenterShow(this._record_btn, "betting_record");
        };
    }


    /**
     * @description 房卡明细
     */
    private friends_details_btn_click(): void {
        if (this._viewType != 3) {
            this._viewType = 3;
            this.requestFriendsDetail();
            this.setPersonalCenterShow(this._friendsDetail_btn, "friends_details");
        };
    }


    /**
     * @description 设置个人中心显示
     * @param leftBtn 昨天按钮
     * @param contentName 中间content显示的内容
     */
    setPersonalCenterShow(leftBtn: cc.Node, contentName: string) {
        super.playclick();
        this._personal_btn.getChildByName("label").color = cc.color(164, 116, 51, 255);
        this._account_btn.getChildByName("label").color = cc.color(164, 116, 51, 255);
        this._friendsDetail_btn.getChildByName("label").color = cc.color(164, 116, 51, 255);
        this._record_btn.getChildByName("label").color = cc.color(164, 116, 51, 255);

        leftBtn.getChildByName("label").color = cc.color(255, 255, 255, 255);


        let contents = this._content.children;
        for (let i = 0; i < contents.length; i++) {
            contents[i].active = false;
        };
        this._content.getChildByName(contentName).active = true;

        if ("personal_information" != contentName) {
            this._content.getChildByName(contentName).getChildByName("select_time").getComponent(cc.Toggle).isChecked = false;
            this._content.getChildByName(contentName).getChildByName("select_type").getComponent(cc.Toggle).isChecked = false;
        };

    };

    private hide_account_time(): void {
        this._select_time.getComponent(cc.Toggle).isChecked = false;
        this._select_time.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.up_arrow;
    }

    private hide_account_type(): void {
        this._select_type.getComponent(cc.Toggle).isChecked = false;
        this._select_type.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.up_arrow;

    }

    private hide_record_time(): void {
        this._record_select_time.getComponent(cc.Toggle).isChecked = false;
        this._record_select_time.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.up_arrow;
    }

    private hide_record_type(): void {
        this._record_select_type.getComponent(cc.Toggle).isChecked = false;
        this._record_select_type.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.up_arrow;
    }

    private hide_friendsDe_time(): void {
        this._friendsDetails_select_time.getComponent(cc.Toggle).isChecked = false;
        this._friendsDetails_select_time.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.up_arrow;
    }

    private hide_friendsDe_type(): void {
        this._friendsDetails_select_type.getComponent(cc.Toggle).isChecked = false;
        this._friendsDetails_select_type.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.up_arrow;
    }


    getDays(n) {
        var now = new Date();
        var date = new Date(now.getTime() - n * 24 * 3600 * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
        var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        var a = year + "-" + month + "-" + day;
        return a
    }

    private accountSelectTime(touEvent: TouchEvent, i): void {
        super.playclick();
        this._select_time.getComponent(cc.Toggle).isChecked = false;
        this._select_time.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string = i;
        var a = this._select_type.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string;
        var startDate = time_type[i].startDate;
        var endDate = time_type[i].endDate;
        AppGame.ins.roleModel.requestAccountDetails(startDate, endDate, personal[a].type, "");
        this._account_request_id = "";
    }

    private accountSelectType(touEvent: TouchEvent, i): void {
        super.playclick();
        this._select_type.getComponent(cc.Toggle).isChecked = false;
        this._select_type.getChildByName('Background').getChildByName("type").getComponent(cc.Label).string = i;
        var a = this._select_time.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string;
        var startDate = time_type[a].startDate;
        var endDate = time_type[a].endDate;
        AppGame.ins.roleModel.requestAccountDetails(startDate, endDate, personal[i].type, "");
        this._account_request_id = "";
    }

    private detailSelectTime(touEvent: TouchEvent, i) {
        super.playclick();
        this._record_select_time.getComponent(cc.Toggle).isChecked = false;
        this._record_select_time.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string = i;
        var a = this._record_select_type.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string;
        var startDate = time_type[i].startDate;
        var endDate = time_type[i].endDate;
        AppGame.ins.roleModel.requestBettingRecords(startDate, endDate, game_type[a].id, "");
        this._record_request_id = "";

    }

    private detailSelectType(touEvent: TouchEvent, i) {
        super.playclick();
        this._record_select_type.getComponent(cc.Toggle).isChecked = false;
        this._record_select_type.getChildByName('Background').getChildByName("type").getComponent(cc.Label).string = i;
        var a = this._record_time_select.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string;
        var startDate = time_type[a].startDate;
        var endDate = time_type[a].endDate;
        AppGame.ins.roleModel.requestBettingRecords(startDate, endDate, game_type[i].id, "");
        this._record_request_id = "";

    }

    private friendsDeSelectTime(touEvent: TouchEvent, i): void {
        super.playclick();
        this._friendsDetails_select_time.getComponent(cc.Toggle).isChecked = false;
        this._friendsDetails_select_time.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string = i;
        var a = this._friendsDetails_select_type.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string;
        var startDate = time_type[i].startDate;
        var endDate = time_type[i].endDate;
        AppGame.ins.friendsRoomCardModel.requestFriendsDetails(startDate, endDate, FriendDeType[a].type, "");
        this._friendsDe_request_id = "";
    }

    private friendsDeSelectType(touEvent: TouchEvent, i): void {
        super.playclick();
        this._friendsDetails_select_type.getComponent(cc.Toggle).isChecked = false;
        this._friendsDetails_select_type.getChildByName('Background').getChildByName("type").getComponent(cc.Label).string = i;
        var a = this._friendsDetails_select_time.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string;
        var startDate = time_type[a].startDate;
        var endDate = time_type[a].endDate;
        AppGame.ins.friendsRoomCardModel.requestFriendsDetails(startDate, endDate, FriendDeType[i].type, "");
        this._friendsDe_request_id = "";
    }


    /**
     * @description 账户明细选择时间
     */
    private select_time_toggle(): void {
        super.playclick();
        if (this._select_time.getComponent(cc.Toggle).isChecked == true) {
            this._select_time.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.down_arrow;
        } else {
            this._select_time.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.up_arrow;
            this._select_time.getComponent(cc.Toggle).isChecked = true;
        }

    }



    /**
    * @description 账户明细选择类型
    */
    private select_type_toggle(): void {
        super.playclick();
        if (this._select_type.getComponent(cc.Toggle).isChecked == true) {
            this._select_type.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.down_arrow;
            let a = this._select_type.getChildByName("checkmark").getChildByName("scrollView").getChildByName("view").getChildByName("content");
            for(let i = 0;i < a.childrenCount;i++){
                if(i % 2 == 0){
                    a.children[i].getComponentInChildren(cc.Sprite).spriteFrame = this.gray;
                }else{
                    a.children[i].getComponentInChildren(cc.Sprite).spriteFrame = this.white;
                }
            }
        } else {
            this._select_type.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.up_arrow;
        }
    }

    private record_time_select(): void {
        super.playclick();
        if (this._record_time_select.getComponent(cc.Toggle).isChecked == true) {
            this._record_time_select.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.down_arrow;
        } else {
            this._record_time_select.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.up_arrow;
        }
    }

    private record_game_select(): void {
        super.playclick();
        if (this._record_game_select.getComponent(cc.Toggle).isChecked == true) {
            this._record_game_select.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.down_arrow;
            this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view").getChildByName("content");
            let a = this._record_game_select.getChildByName("checkmark").getChildByName("scrollView").getChildByName("view").getChildByName("content");
        } else {
            this._record_game_select.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.up_arrow;
        }
    }

    /**
         * @description 房卡明细选择时间
         */
    private friendsDe_time_toggle(): void {
        super.playclick();
        if (this._friendsDetails_select_time.getComponent(cc.Toggle).isChecked == true) {
            this._friendsDetails_select_time.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.down_arrow;
        } else {
            this._friendsDetails_select_time.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.up_arrow;
            this._friendsDetails_select_time.getComponent(cc.Toggle).isChecked = true;
        }

    }

    /**
    * @description 房卡明细选择类型
    */
    private friendsDe_type_toggle(): void {
        super.playclick();
        if (this._friendsDetails_select_type.getComponent(cc.Toggle).isChecked == true) {
            this._friendsDetails_select_type.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.down_arrow;
        } else {
            this._friendsDetails_select_type.getChildByName("Background").getChildByName("arrow").getComponent(cc.Sprite).spriteFrame = this.up_arrow;
        }
    }

    //请求网络数据
    private requestAccountDetail(): void {
        var a = this._select_time.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string;
        var b = this._select_type.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string;
        var startDate = time_type[a].startDate;
        var endDate = time_type[a].endDate;
        var type = personal[b].type;
        this.request_account_detail(startDate, endDate, type, "");
        this._account_request_id = "";
    }

    private requestAllRecord(): void {
        var a = this._record_time_select.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string;
        var b = this._record_select_type.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string;
        var startDate = time_type[a].startDate;
        var endDate = time_type[a].endDate;
        var id = game_type[b].id;
        this.request_betting_record(startDate, endDate, id, "");
        this._record_request_id = "";
    }

    // 房卡明细请求数据
    private requestFriendsDetail(): void {
        var a = this._friendsDetails_select_time.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string;
        var b = this._friendsDetails_select_type.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string;
        var startDate = time_type[a].startDate;
        var endDate = time_type[a].endDate;
        var type = FriendDeType[b].type;
        this.request_friendsDe_detail(startDate, endDate, type, "");
        this._friendsDe_request_id = "";
    }


    private request_account_detail(strDate: string, endDate: string, changeType: number, Id: string): void {
        AppGame.ins.roleModel.requestAccountDetails(strDate, endDate, changeType, Id);
    }

    private request_betting_record(startDate: string, endDate: string, gameId: number, id: string): void {
        AppGame.ins.roleModel.requestBettingRecords(startDate, endDate, gameId, id);
    }


    private request_friendsDe_detail(strDate: string, endDate: string, changeType: number, Id: string): void {
        AppGame.ins.friendsRoomCardModel.requestFriendsDetails(strDate, endDate, changeType, Id);
    }

    private show_betting_record(caller: any): void {
        cc.log("show_betting_record", caller)
        let showNodata = () => {
            this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view").getChildByName("content").removeAllChildren();
            let view = this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view");
            let no_data = view.getChildByName("no_data");
            var _no_data = cc.instantiate(no_data);
            _no_data.active = true;
            this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view")
            _no_data.parent = view.getChildByName("content");
        }

        if (caller.retCode == 0) {
            var a = this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view").getChildByName("content").childrenCount;

            if (caller.detailInfo.length == 0) {
                if (this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view").getChildByName("content").children[a - 1].getChildByName("income") && this._record_request_id == this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view").getChildByName("content").children[a - 1].getChildByName("refId").getComponent(cc.Label).string && (this._record_request_id !== "")) {
                    AppGame.ins.showTips("没有记录了");
                } else {
                    showNodata();
                }
            } else {
                if (!this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view").getChildByName("content").getChildByName("no_data")) {
                    if (this._record_request_id == this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view").getChildByName("content").children[a - 1].getChildByName("refId").getComponent(cc.Label).string) {
                        for (var i = 0; i < caller.detailInfo.length; i++) {
                            var item = cc.instantiate(this._record_item);
                            item.active = true;
                            item.parent = this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view").getChildByName("content");
                            let rName = room_name[caller.detailInfo[i].roomId].room_name;
                            let clubId = caller.detailInfo[i]["clubId"];
                            let a = caller.detailInfo[i].gameId;
                            let b = caller.detailInfo[i].roomId;
                            item.getChildByName("game_name").getComponent(cc.Label).string = clubId ? UCommon.getClubRoomName(a,b,false): rName;
                            item.getChildByName("time").getComponent(cc.Label).string = caller.detailInfo[i].gameEndTime;
                            item.getChildByName("bet").getComponent(cc.Label).string = "已投注:" + UStringHelper.getMoneyFormat(caller.detailInfo[i].betScore * ZJH_SCALE);
                            item.getChildByName("pjbh").getComponent(cc.Label).string = "牌局编号:" + caller.detailInfo[i].gameRoundNo;
                            item.getChildByName("income").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.detailInfo[i].winLoseScore * ZJH_SCALE);
                            if (caller.detailInfo[i].winLoseScore < 0) {
                                item.getChildByName("income").color = cc.color(50, 160, 124, 255);
                            } else {
                                item.getChildByName("income").color = cc.color(206, 105, 56, 255);
                            }
                            UEventHandler.addClick(item.getChildByName("copy"), this.node, "VPersonal", "copyNumber", caller.detailInfo[i].gameRoundNo);
                            // if((i % 2) == 1){
                            //     item.getComponent(cc.Sprite).spriteFrame = null;
                            // }else{
                            //     item.getComponent(cc.Sprite).spriteFrame = this.banner_bg;
                            // }
                            item.getChildByName("refId").getComponent(cc.Label).string = caller.detailInfo[i].gameEndTime;
                            if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "900") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brlh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "830") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.qznn;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "210") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brhh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "820") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.kpqzjh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "930") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brnn;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "840") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.qzjh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "720") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.ebg;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "850") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.tbjh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "870") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.tbnn;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "890") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.kpqznn;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "810") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.xpnn;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "880") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.xpjh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "860") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sg;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "920") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brjh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "100") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.ddz;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "300") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.pdk;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "220") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.zjh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "950") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.bcbm;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "600") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.bj;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "550") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sss;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "420") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "450") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.dzpk;
                            }
                        }
                    } else {
                        this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view").getChildByName("content").removeAllChildren();
                        for (var i = 0; i < caller.detailInfo.length; i++) {
                            var item = cc.instantiate(this._record_item);
                            item.active = true;
                            item.parent = this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view").getChildByName("content");
                            let rName = room_name[caller.detailInfo[i].roomId].room_name;
                            let clubId = caller.detailInfo[i]["clubId"];
                            let a = caller.detailInfo[i].gameId;
                            let b = caller.detailInfo[i].roomId;
                            item.getChildByName("game_name").getComponent(cc.Label).string = clubId ? UCommon.getClubRoomName(a,b,false): rName;
                            item.getChildByName("time").getComponent(cc.Label).string = caller.detailInfo[i].gameEndTime;
                            item.getChildByName("bet").getComponent(cc.Label).string = "已投注:" + UStringHelper.getMoneyFormat(caller.detailInfo[i].betScore * ZJH_SCALE);
                            item.getChildByName("pjbh").getComponent(cc.Label).string = "牌局编号:" + caller.detailInfo[i].gameRoundNo;
                            item.getChildByName("income").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.detailInfo[i].winLoseScore * ZJH_SCALE);
                            if (caller.detailInfo[i].winLoseScore < 0) {
                                item.getChildByName("income").color = cc.color(50, 160, 124, 255);
                            } else {
                                item.getChildByName("income").color = cc.color(206, 105, 56, 255);
                            }
                            UEventHandler.addClick(item.getChildByName("copy"), this.node, "VPersonal", "copyNumber", caller.detailInfo[i].gameRoundNo);
                            // if ((i % 2) == 1) {
                            //     item.getComponent(cc.Sprite).spriteFrame = null;
                            // } else {
                            //     item.getComponent(cc.Sprite).spriteFrame = this.banner_bg;
                            // }
                            item.getChildByName("refId").getComponent(cc.Label).string = caller.detailInfo[i].gameEndTime;
                            if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "900") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brlh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "830") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.qznn;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "210") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brhh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "820") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.kpqzjh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "930") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brnn;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "840") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.qzjh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "720") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.ebg;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "850") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.tbjh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "870") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.tbnn;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "890") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.kpqznn;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "810") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.xpnn;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "880") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.xpjh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "860") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sg;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "920") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brjh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "100") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.ddz;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "300") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.pdk;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "220") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.zjh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "950") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.bcbm;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "600") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.bj;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "550") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sss;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "420") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sh;
                            } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "450") {
                                item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.dzpk;
                            }
                        }
                    }
                } else {
                    this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view").getChildByName("content").removeAllChildren();
                    for (var i = 0; i < caller.detailInfo.length; i++) {
                        var item = cc.instantiate(this._record_item);
                        item.active = true;
                        item.parent = this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view").getChildByName("content");
                        let rName = room_name[caller.detailInfo[i].roomId].room_name;
                        let clubId = caller.detailInfo[i]["clubId"];
                        let a = caller.detailInfo[i].gameId;
                        let b = caller.detailInfo[i].roomId;
                        item.getChildByName("game_name").getComponent(cc.Label).string = clubId ? UCommon.getClubRoomName(a,b,false): rName;

                        item.getChildByName("time").getComponent(cc.Label).string = caller.detailInfo[i].gameEndTime;
                        item.getChildByName("bet").getComponent(cc.Label).string = "已投注:" + UStringHelper.getMoneyFormat(caller.detailInfo[i].betScore * ZJH_SCALE);
                        item.getChildByName("pjbh").getComponent(cc.Label).string = "牌局编号:" + caller.detailInfo[i].gameRoundNo;
                        item.getChildByName("income").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.detailInfo[i].winLoseScore * ZJH_SCALE);
                        if (caller.detailInfo[i].winLoseScore < 0) {
                            item.getChildByName("income").color = cc.color(50, 160, 124, 255);
                        } else {
                            item.getChildByName("income").color = cc.color(206, 105, 56, 255);
                        }
                        UEventHandler.addClick(item.getChildByName("copy"), this.node, "VPersonal", "copyNumber", caller.detailInfo[i].gameRoundNo);
                        // if ((i % 2) == 1) {
                        //     item.getComponent(cc.Sprite).spriteFrame = null;
                        // } else {
                        //     item.getComponent(cc.Sprite).spriteFrame = this.banner_bg;
                        // }

                        item.getChildByName("refId").getComponent(cc.Label).string = caller.detailInfo[i].gameEndTime;
                        if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "900") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brlh;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "830") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.qznn;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "210") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brhh;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "820") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.kpqzjh;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "930") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brnn;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "840") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.qzjh;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "720") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.ebg;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "850") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.tbjh;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "870") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.tbnn;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "890") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.kpqznn;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "810") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.xpnn;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "880") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.xpjh;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "860") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sg;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "920") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.brjh;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "100") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.ddz;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "300") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.pdk;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "220") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.zjh;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "950") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.bcbm;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "600") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.bj;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "550") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sss;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "420") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.sh;
                        } else if (caller.detailInfo[i].roomId.toString().substr(0, 3) == "450") {
                            item.getChildByName("icon").getComponent(cc.Sprite).spriteFrame = this.dzpk;
                        }
                    }
                }
            }
        } else {
            showNodata();
        }
    }

    private show_account_detail(caller: HallServer.GetUserScoreChangeRecordMessageResponse): void {
        if (caller.retCode == 0) {
            var a = this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").childrenCount;
            if (caller.detailInfo.length == 0) {

                if (this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").children[a - 1].getChildByName("money_left") && this._account_request_id == this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").children[a - 1].getChildByName("refId").getComponent(cc.Label).string && (this._account_request_id !== "")) {
                    AppGame.ins.showTips("没有记录了");
                } else {
                    this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").removeAllChildren();
                    var no_data = cc.instantiate(this._no_data);
                    no_data.parent = this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content");
                }
            } else {
                if (!this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").getChildByName("no_data")) {
                    if (this._account_request_id == this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").children[a - 1].getChildByName("refId").getComponent(cc.Label).string) {
                        for (var i = 0; i < caller.detailInfo.length; i++) {
                            var item = cc.instantiate(this._account_item);
                            item.active = true;
                            item.parent = this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content");
                            item.getChildByName("time").getComponent(cc.Label).string = caller.detailInfo[i].createTime;

                            let type = numberTabel[caller.detailInfo[i].changeType].type;
                            // if (caller.detailInfo[i].hasOwnProperty("clubId")) {
                            //     type = ClubNumberTabel[caller.detailInfo[i].changeType].type;
                            // };
                            item.getChildByName("type").getComponent(cc.Label).string = type

                            item.getChildByName("change").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.detailInfo[i].changeScore * ZJH_SCALE);
                            item.getChildByName("money_left").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.detailInfo[i].afterScore * ZJH_SCALE);
                            item.getChildByName("refId").getComponent(cc.Label).string = caller.detailInfo[i].createTime;
                            if (caller.detailInfo[i].changeScore < 0) {
                                item.getChildByName("change").color = cc.color(50, 160, 124, 255);
                            } else {
                                item.getChildByName("change").color = cc.color(206, 105, 56, 255);
                            }
                        }
                    } else {
                        this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").removeAllChildren();
                        for (var i = 0; i < caller.detailInfo.length; i++) {
                            var item = cc.instantiate(this._account_item);
                            item.active = true;
                            item.parent = this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content");
                            item.getChildByName("time").getComponent(cc.Label).string = caller.detailInfo[i].createTime;

                            let type = numberTabel[caller.detailInfo[i].changeType].type;
                            // if (caller.detailInfo[i].hasOwnProperty("clubId")) {
                            //     type = ClubNumberTabel[caller.detailInfo[i].changeType].type;
                            // };
                            item.getChildByName("type").getComponent(cc.Label).string = type

                            item.getChildByName("change").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.detailInfo[i].changeScore * ZJH_SCALE);
                            item.getChildByName("money_left").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.detailInfo[i].afterScore * ZJH_SCALE);
                            item.getChildByName("refId").getComponent(cc.Label).string = caller.detailInfo[i].createTime;
                            if (caller.detailInfo[i].changeScore < 0) {
                                item.getChildByName("change").color = cc.color(50, 160, 124, 255);
                            } else {
                                item.getChildByName("change").color = cc.color(206, 105, 56, 255);
                            }
                        }
                    }
                } else {
                    this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").removeAllChildren();
                    for (var i = 0; i < caller.detailInfo.length; i++) {
                        var item = cc.instantiate(this._account_item);
                        item.active = true;
                        item.parent = this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content");
                        item.getChildByName("time").getComponent(cc.Label).string = caller.detailInfo[i].createTime;

                        let type = numberTabel[caller.detailInfo[i].changeType].type;
                        // if (caller.detailInfo[i].hasOwnProperty("clubId")) {
                        //     type = ClubNumberTabel[caller.detailInfo[i].changeType].type;
                        // };
                        item.getChildByName("type").getComponent(cc.Label).string = type

                        item.getChildByName("change").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.detailInfo[i].changeScore * ZJH_SCALE);
                        item.getChildByName("money_left").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.detailInfo[i].afterScore * ZJH_SCALE);
                        item.getChildByName("refId").getComponent(cc.Label).string = caller.detailInfo[i].createTime;
                        if (caller.detailInfo[i].changeScore < 0) {
                            item.getChildByName("change").color = cc.color(50, 160, 124, 255);
                        } else {
                            item.getChildByName("change").color = cc.color(206, 105, 56, 255);
                        }
                    }
                }
            }
        } else {
            this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").removeAllChildren();
            let view = this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view");
            let no_data = view.getChildByName("no_data");
            var _no_data = cc.instantiate(no_data);
            this._content.getChildByName("betting_record").getChildByName("scrollView").getChildByName("view")
            _no_data.parent = view.getChildByName("content");
            no_data.parent = this._content.getChildByName("account_details").getChildByName("scrollView").getChildByName("view").getChildByName("content");
        }
    }




    private show_friends_detail(caller: HallFriendServer.GetRoomCardChangeRecordResponse): void {
        UDebug.log("个人中心 房卡明细", caller)
        if (caller.retCode == 0) {
            var a = this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").childrenCount;
            if (caller.roomCardChangeItem.length == 0) {

                if (this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").children[a - 1].getChildByName("money_left") && this._friendsDe_request_id
                    == this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").children[a - 1].getChildByName("refId").getComponent(cc.Label).string && (this._friendsDe_request_id !== "")) {
                    AppGame.ins.showTips("没有记录了");
                } else {
                    this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").removeAllChildren();
                    var no_data = cc.instantiate(this._friendsDetails_no_data);
                    no_data.parent = this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content");
                }
            } else {
                let content = this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content");
                let contentY = content.y;

                if (!this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").getChildByName("no_data")) {
                    if (this._friendsDe_request_id == this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").children[a - 1].getChildByName("refId").getComponent(cc.Label).string) {
                        for (var i = 0; i < caller.roomCardChangeItem.length; i++) {
                            var item = cc.instantiate(this._friendsDetails_item);
                            item.active = true;
                            item.parent = this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content");
                            item.getChildByName("time").getComponent(cc.Label).string = caller.roomCardChangeItem[i].createTime;
                            item.getChildByName("type").getComponent(cc.Label).string = numberTabel[caller.roomCardChangeItem[i].changeType].type;
                            item.getChildByName("change").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.roomCardChangeItem[i].addRoomCard * ZJH_SCALE);
                            item.getChildByName("money_left").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.roomCardChangeItem[i].afterRoomCard * ZJH_SCALE);
                            item.getChildByName("refId").getComponent(cc.Label).string = caller.roomCardChangeItem[i].createTime;
                            if (caller.roomCardChangeItem[i].addRoomCard < 0) {
                                item.getChildByName("change").color = cc.color(50, 160, 124, 255);
                            } else {
                                item.getChildByName("change").color = cc.color(206, 105, 56, 255);
                            }
                        }
                    } else {
                        this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").removeAllChildren();
                        for (var i = 0; i < caller.roomCardChangeItem.length; i++) {
                            var item = cc.instantiate(this._friendsDetails_item);
                            item.active = true;
                            item.parent = this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content");
                            item.getChildByName("time").getComponent(cc.Label).string = caller.roomCardChangeItem[i].createTime;
                            item.getChildByName("type").getComponent(cc.Label).string = numberTabel[caller.roomCardChangeItem[i].changeType].type;
                            item.getChildByName("change").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.roomCardChangeItem[i].addRoomCard * ZJH_SCALE);
                            item.getChildByName("money_left").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.roomCardChangeItem[i].afterRoomCard * ZJH_SCALE);
                            item.getChildByName("refId").getComponent(cc.Label).string = caller.roomCardChangeItem[i].createTime;
                            if (caller.roomCardChangeItem[i].addRoomCard < 0) {
                                item.getChildByName("change").color = cc.color(50, 160, 124, 255);
                            } else {
                                item.getChildByName("change").color = cc.color(206, 105, 56, 255);
                            }
                        }
                        content.y = contentY;
                    }
                } else {
                    this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").removeAllChildren();
                    for (var i = 0; i < caller.roomCardChangeItem.length; i++) {
                        var item = cc.instantiate(this._friendsDetails_item);
                        item.active = true;
                        item.parent = this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content");
                        item.getChildByName("time").getComponent(cc.Label).string = caller.roomCardChangeItem[i].createTime;
                        item.getChildByName("type").getComponent(cc.Label).string = numberTabel[caller.roomCardChangeItem[i].changeType].type;
                        item.getChildByName("change").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.roomCardChangeItem[i].addRoomCard * ZJH_SCALE);
                        item.getChildByName("money_left").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.roomCardChangeItem[i].afterRoomCard * ZJH_SCALE);
                        item.getChildByName("refId").getComponent(cc.Label).string = caller.roomCardChangeItem[i].createTime;
                        if (caller.roomCardChangeItem[i].addRoomCard < 0) {
                            item.getChildByName("change").color = cc.color(50, 160, 124, 255);
                        } else {
                            item.getChildByName("change").color = cc.color(206, 105, 56, 255);
                        }
                    }
                    content.y = contentY;
                }
            }
        } else {
            this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content").removeAllChildren();
            var no_data = cc.instantiate(this._friendsDetails_no_data);
            no_data.parent = this._content.getChildByName("friends_details").getChildByName("scrollView").getChildByName("view").getChildByName("content");
        }
    }





    private copyNumber(event, i) {
        super.playclick();
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked(i);

    }

    /**
     * 绑定数据
     * @param dt 
     */
    private binddata(dt: UIPersonalData): void {
        this.refreshBindUI();
        if (dt.max > 0) {
            this._lvc.spriteFrame = this._spriteRes.getFrameIdx(dt.vipLv);
            this._lv.spriteFrame = this._spriteRes.getFrameIdx(dt.vipLv + 1);
            this._lvprocess.string = dt.exp / 100 + "/" + dt.max / 100;
            // this._process.fillRange = dt.exp / dt.max;
        } else {
            this._lvprocess.string = "";
            // this._process.fillRange = 1;
            this._lvc.spriteFrame = this._spriteRes.getFrameIdx(dt.vipLv);
            this._lv.spriteFrame = this._spriteRes.getFrameIdx(dt.vipLv);
        }
        this._viplv.spriteFrame = this._spriteRes.getFrameIdx(dt.vipLv + 10);
        this._name.string = dt.nickName;
        this._accountId.string = "ID:" + dt.accountId.toString();
        if (dt.trueName !== "") {
            this._realname.string = dt.trueName;
        } else {
            this._realname.string = "";
        }

        this.updateVipLevel(dt.vipLv);
        this.update_socre(dt.gold);
        this._bankscore.string = UStringHelper.getMoneyFormat(AppGame.ins.roleModel.bankScore * ZJH_SCALE, -1, false, true).toString();
        // UResManager.load(dt.headId, EIconType.Head, this._headIcon);
        // UResManager.load(dt.headBoxId, EIconType.Frame, this._frameIcon);
        this.refreshbtn(dt.istempAccount);
        this.updata_frame(dt.headBoxId, true);
        this.updata_head(dt.headId, true)
    }
    private refreshbtn(temp: boolean) {
        if (temp) {
            this._regester.active = true;
            //this._logout.x = -this._threepos;
            //this._setting.x = this._threepos;
        } else {
            this._regester.active = false;
            // VHall.node.emit(VHall.CLOSE_REGISTER,null, this);
            AppGame.ins.roleModel.emit(
                MRole.CLOSE_REGISTER, null)
            // this._setting.x = this._twopos;
        }
    }

    private updateVipLevel(number: number) {
        if (number == 0) {
            this._vipLevel.node.active = false;
        } else if (number == 1) {
            this._vipLevel.node.active = true;
            this._vipLevel.spriteFrame = this.vip_first;
        } else if (number == 2) {
            this._vipLevel.node.active = true;
            this._vipLevel.spriteFrame = this.vip_second;
        } else if (number == 3) {
            this._vipLevel.node.active = true;
            this._vipLevel.spriteFrame = this.vip_third;
        } else if (number == 4) {
            this._vipLevel.node.active = true;
            this._vipLevel.spriteFrame = this.vip_fourth;
        } else if (number == 5) {
            this._vipLevel.node.active = true;
            this._vipLevel.spriteFrame = this.vip_fifth;
        } else if (number == 6) {
            this._vipLevel.node.active = true;
            this._vipLevel.spriteFrame = this.vip_sixth;
        } else if (number == 7) {
            this._vipLevel.node.active = true;
            this._vipLevel.spriteFrame = this.vip_seventh;
        }
    }

    // 刷新绑定信息界面
    private refreshBindUI(): void {
        this._userBindInfoData = AppGame.ins.roleModel.getBindInfoData();

        //显示已经绑定的手机号码
        if (this._userBindInfoData.mobileNum !== "") {
            this._telephone.string = this._userBindInfoData.mobileNum;
            this._mobile_tip.active = false;
        } else {
            this._mobile_tip.active = true;
        }


        if (UStringHelper.isEmptyString(this._userBindInfoData.trueName)) {
            this.changeTrueName.active = true;
            this._labtip.node.active = true;
        } else {
            this._realname.string = this._userBindInfoData.trueName;
            this.changeTrueName.active = false;
            this._labtip.node.active = false;
        }

        if (!UStringHelper.isEmptyString(this._userBindInfoData.alipayAccount)) {
            this._alipayLabel.string = UStringHelper.replaceStringFristEndNum(this._userBindInfoData.alipayAccount, 4);
            this._bindAlipay.active = false;
        } else {
            // this._alipayLabel.string = "暂未添加兑换账号";
            this._bindAlipay.active = true;
        }

        if (!UStringHelper.isEmptyString(this._userBindInfoData.bankCardNum)) {
            this._bankLabel.string = UStringHelper.replaceStringFristEndNum(this._userBindInfoData.bankCardNum, 4);
            this._bindBank.active = false;
        } else {
            // this._bankLabel.string = "暂未添加兑换账号";
            this._bindBank.active = true;
        }

        if (!UStringHelper.isEmptyString(this._userBindInfoData.usdtAddress)) {
            this._usdtLabel.string = UStringHelper.replaceStringFristEndNum(this._userBindInfoData.usdtAddress, 4);
            this._bindUsdt.active = false;
        } else {
            // this._usdtLabel.string = "暂未添加兑换账号";
            this._bindUsdt.active = true;
        }

    }


    private bind_alipay_message_res(isSuccess: boolean, errMsg: string): void {
        if (isSuccess) {
            AppGame.ins.showTips("绑定支付宝成功");
            AppGame.ins.closeUI(ECommonUI.EXCHANGE_BIND_ALIPAY)
            this.refreshBindUI();
        } else {
            AppGame.ins.showTips(errMsg);
        }
    }

    private bind_card_message_res(isSuccess: boolean, errMsg: string): void {
        if (isSuccess) {
            AppGame.ins.showTips("绑定银行卡成功");
            AppGame.ins.closeUI(ECommonUI.EXCHANGE_BIND_BANK_CARD)
            this.refreshBindUI();
        } else {
            AppGame.ins.showTips(errMsg);
        }
    }

    private bind_usdt_message_res(isSuccess: boolean, errMsg: string): void {
        if (isSuccess) {
            AppGame.ins.closeUI(ECommonUI.EXCHANGE_BIND_USDT);
            AppGame.ins.showTips("绑定USDT地址成功");
            this.refreshBindUI();
        } else {
            AppGame.ins.showTips(errMsg);
        }
    }

    /**
     * @description 绑定微信btn
     */
    private onBindWeChat() {
        let boo = AppGame.ins.roleModel.getIsTempAccount();

        if (boo) {
            AppGame.ins.showUI(ECommonUI.LB_Regester);
            AppGame.ins.showTips("需要先完成注册账号才可以绑定微信");
            super.playclick();
            UAudioManager.ins.playSound("audio_vhall_register");
        } else {
            AppGame.ins.showUI(ECommonUI.UI_BIND_WECHAT_VERIFY);
        };

    };


    protected onEnable(): void {
        AppGame.ins.roleModel.on(MRole.UPDATA_HEAD, this.updata_head, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_HEADBOX, this.updata_frame, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.update_socre, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_REBNAME, this.update_rename, this);
        AppGame.ins.LoginModel.on(MLogin.BIND_MOBILE, this.on_bind_msg, this);
        AppGame.ins.roleModel.on(MRole.SET_USER_TRUE_NAME, this.on_bind_true_name, this);
        AppGame.ins.roleModel.on(MRole.BIND_ALIPAY, this.bind_alipay_message_res, this);
        AppGame.ins.roleModel.on(MRole.BIND_BANK, this.bind_card_message_res, this);
        AppGame.ins.roleModel.on(MRole.BIND_USDT_ADDRESS, this.bind_usdt_message_res, this);
        AppGame.ins.roleModel.on(MRole.BETTING_RECORD, this.show_betting_record, this);
        AppGame.ins.roleModel.on(MRole.ACCOUNT_DETAIL, this.show_account_detail, this);
        AppGame.ins.roleModel.on(MRole.REF_WECAHT_BIND_STATE, this.refWeChatBindState, this);
        AppGame.ins.friendsRoomCardModel.on(MFriendsRoomCardModel.FRIENDS_DETAIL, this.show_friends_detail, this);
        AppGame.ins.roleModel.on(MRole.UPLOAD_HEAD_IMG_SUCCESS, this.upload_head_success, this);

    }
    protected onDisable(): void {
        AppGame.ins.roleModel.off(MRole.UPDATA_HEAD, this.updata_head, this);
        AppGame.ins.roleModel.off(MRole.UPDATA_HEADBOX, this.updata_frame, this);
        AppGame.ins.roleModel.off(MRole.UPDATA_SCORE, this.update_socre, this);
        AppGame.ins.roleModel.off(MRole.UPDATA_REBNAME, this.update_rename, this);
        AppGame.ins.LoginModel.off(MLogin.BIND_MOBILE, this.on_bind_msg, this);
        AppGame.ins.roleModel.off(MRole.SET_USER_TRUE_NAME, this.on_bind_true_name, this);
        AppGame.ins.roleModel.off(MRole.BIND_ALIPAY, this.bind_alipay_message_res, this);
        AppGame.ins.roleModel.off(MRole.BIND_BANK, this.bind_card_message_res, this);
        AppGame.ins.roleModel.off(MRole.BIND_USDT_ADDRESS, this.bind_usdt_message_res, this);
        AppGame.ins.roleModel.off(MRole.BETTING_RECORD, this.show_betting_record, this);
        AppGame.ins.roleModel.off(MRole.ACCOUNT_DETAIL, this.show_account_detail, this);
        AppGame.ins.friendsRoomCardModel.off(MFriendsRoomCardModel.FRIENDS_DETAIL, this.show_friends_detail, this);
        AppGame.ins.roleModel.off(MRole.REF_WECAHT_BIND_STATE, this.refWeChatBindState, this);
        AppGame.ins.roleModel.off(MRole.UPLOAD_HEAD_IMG_SUCCESS, this.upload_head_success, this);



        this._select_time.getComponent(cc.Toggle).isChecked = false;
        this._select_type.getComponent(cc.Toggle).isChecked = false;
        this._record_select_time.getComponent(cc.Toggle).isChecked = false;
        this._record_select_type.getComponent(cc.Toggle).isChecked = false;
        this._select_time.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string = "全部时间";
        this._select_type.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string = "全部类型";
        this._record_time_select.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string = "全部时间";
        this._record_select_type.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string = "全部游戏";
        this._friendsDetails_select_time.getChildByName("Background").getChildByName("show_time").getComponent(cc.Label).string = "全部时间";
        this._friendsDetails_select_type.getChildByName("Background").getChildByName("type").getComponent(cc.Label).string = "全部类型";
        this._alipayLabel.string = "";
        this._bankLabel.string = "";
        this._usdtLabel.string = "";
        this._content.getChildByName("account_details").getChildByName("scrollView").getComponent(cc.ScrollView).scrollToTop();
        this._content.getChildByName("betting_record").getChildByName("scrollView").getComponent(cc.ScrollView).scrollToTop();
        this._content.getChildByName("friends_details").getChildByName("scrollView").getComponent(cc.ScrollView).scrollToTop();
        this._mobile_tip.active = true;
        this._telephone.string = "";

    }
    private update_socre(score: number): void {
        this._gold.string = UStringHelper.getMoneyFormat(score * ZJH_SCALE, -1, false, true).toString();
    }

    private on_bind_true_name(sucess: boolean, msg: string): void {
        this._realname.string = AppGame.ins.roleModel.getBindInfoData().trueName
        this.changeTrueName.active = this._realname.string == "" ? true : false
        this._labtip.node.active = this.changeTrueName.active;
        AppGame.ins.closeUI(ECommonUI.EXCHANGE_BIND_USERNAME)
    }


    private on_bind_msg(sucess: boolean, msg: string): void {
        AppGame.ins.showTips(msg);
        if (sucess) {
            AppGame.ins.closeUI(ECommonUI.LB_Regester);
            AppGame.ins.closeUI(ECommonUI.LB_Personal);
            this.refreshbtn(false);
        }
    }
    private update_rename(nickname: string, sucess: boolean, error: string): void {
        this._name.string = nickname;
    }
    private updata_frame(frameid: number, sucess: boolean) {
        if (sucess) {
            UResManager.load(frameid, EIconType.Frame, this._frameIcon);
        }
    }
    private updata_head(headId: number, sucess: boolean): void {
        if (sucess) {
            UResManager.load(headId, EIconType.Head, this._headIcon, AppGame.ins.roleModel.headImgUrl);
        }
    }
    private upload_head_success(success: boolean, headImgUrl: string = ''): void {
        if (success) {
            UResManager.load(1, EIconType.Head, this._headIcon, headImgUrl);
        }
    }
    closeUI() {
        super.playclick();
        super.clickClose();
        this._root.getChildByName("mask_bg").getChildByName("left_area").getChildByName("personal_btn").getComponent(cc.Toggle).isChecked = true;
    }
}
