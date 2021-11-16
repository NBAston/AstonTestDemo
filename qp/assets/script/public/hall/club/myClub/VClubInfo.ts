import { EEXIST } from "constants";
import { ECommonUI, EIconType } from "../../../../common/base/UAllenum";
import UAudioManager from "../../../../common/base/UAudioManager";
import UResManager from "../../../../common/base/UResManager";
import { ClubHallServer, HallServer } from "../../../../common/cmd/proto";
import { UAPIHelper } from "../../../../common/utility/UAPIHelper";
import UEventHandler from "../../../../common/utility/UEventHandler";
import ULanHelper from "../../../../common/utility/ULanHelper";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import UQRCode from "../../../../common/utility/UQRCode";
import UStringHelper from "../../../../common/utility/UStringHelper";
import AppGame from "../../../base/AppGame";
import MProxy from "../../proxy/MProxy";
import VProxyItem from "../../proxy/VProxyItem";
import MClub from "./MClub";
import VClubMyClubDet from "./VClubMyClubDet";


export const ZJH_SCALE = 0.01;

const { ccclass, property } = cc._decorator;

@ccclass
export default class VClubInfo extends cc.Component {
    @property(cc.Node)
    contentNode: cc.Node = null; //俱乐部 content

    @property(cc.Sprite) frame: cc.Sprite = null; //头像框 
    @property(cc.Sprite) head: cc.Sprite = null; //头像 
    @property(cc.Label) userName: cc.Label = null;//名字
    @property(cc.Label) userID: cc.Label = null;//玩家id
    @property(cc.Label) todayComm: cc.Label = null;//今日佣金
    @property(cc.Label) ExtrComm: cc.Label = null;//可提取佣金
    @property(cc.Node) clubItem: cc.Node = null; //俱乐部item
    @property({ type: cc.Node, tooltip: "推广二维码" }) hidden_node: cc.Node = null;
    @property({ type: cc.Node, tooltip: "我的俱乐部Scroll" }) clubScrollView: cc.Node = null;
    @property({ type: cc.Node, tooltip: "没有加入俱乐部提示" }) noClubTips: cc.Node = null;
    @property({ type: cc.EditBox, tooltip: "俱乐部号码输入框" }) clubCodeEdit: cc.EditBox = null;
    @property({ type: cc.Node, tooltip: "俱乐部自动升级合伙人按钮" }) autoPar: cc.Node = null;
    @property({ type: cc.Node, tooltip: "俱乐部已经自动升级合伙人按钮" }) autoParOk: cc.Node = null;
    @property({ type: cc.Node, tooltip: "佣金view （合伙人或者盟主显示）" }) comParent: cc.Node = null;

    private _qrCode: UQRCode;
    private _address: cc.Label;
    private _first_qrcode: UQRCode;
    private _second_qrcode: UQRCode;
    private _third_qrcode: UQRCode;
    private _checkedClubId: number;

    init(): void {
        var dt = AppGame.ins.myClubModel.getMyInfo();
        this.userName.string = dt.name;
        this.userID.string = `ID:${dt.id}`;
        this.clubCodeEdit.string = "";
        UResManager.load(dt.headId, EIconType.Head, this.head, AppGame.ins.roleModel.headImgUrl);
        UResManager.load(dt.frameId, EIconType.Frame, this.frame);

        this._qrCode = UNodeHelper.getComponent(this.node, "hidden_node/qrcode", UQRCode);

        this._address = UNodeHelper.getComponent(this.node, "hidden_node/address_bg/address", cc.Label);
        this._first_qrcode = UNodeHelper.getComponent(this.node, "hidden_node/select_bg/img_first/qrcode", UQRCode);
        this._second_qrcode = UNodeHelper.getComponent(this.node, "hidden_node/select_bg/img_second/qrcode", UQRCode);
        this._third_qrcode = UNodeHelper.getComponent(this.node, "hidden_node/select_bg/img_third/qrcode", UQRCode);

        if (AppGame.ins.myClubModel.requestMyClubInfo()) {
            this.scheduleOnce(() => {
                AppGame.ins.showConnect(false);
            }, 5);
        };
    };

    /**
     * @description 设置选中的俱乐部
     * @param checkedClubId 点击俱乐部id
     */
    set checkedClubId(checkedClubId: number) {
        this._checkedClubId = checkedClubId;
    };

    /**
     * @description  获得点击俱乐部 cc.Node
     */
    get checkedClubId(): number {
        return this._checkedClubId;
    };

    /**
       * 结束输入
       */
    private clubCodeInput(): void {
        if (this.clubCodeEdit.string != "" && UStringHelper.isEmptyString(this.clubCodeEdit.string)) {
            this.clubCodeEdit.string = "";
            AppGame.ins.showTips(ULanHelper.COMMON_EDITBOX_TIPS);
            return;
        };
        if (this.clubCodeEdit.string.indexOf(".") != -1) {
            this.clubCodeEdit.string = "";
            AppGame.ins.showTips("不能输入特殊符号");
            return;
        };
    }


    /**
     * @description 开启自动合伙人
     */
    clickOpenAutoPartner() {
        UAudioManager.ins.playSound("audio_click");

        AppGame.ins.showUI(ECommonUI.CLUB_UP_PARTNER, { checkedClubId: this.checkedClubId });
    };


    /**
     * 提取佣金
     */
    private btn_extract_click(): void {
        AppGame.ins.showUI(ECommonUI.CLUB_ABS_MONEY, { todayProfit: MClub.myClubMessgeRes.todayProfit });
        UAudioManager.ins.playSound("audio_click");
    }

    /**
     * 请求更新二维码
     */
    private refreshQrcode(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.myClubModel.requestClubQRcode(this._checkedClubId);
    }


    /**
     * 更新二维码
     */
    private refreshSpreadUrl(caller: HallServer.RefreshSpreadURLMessageResponse): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showTips("刷新二维码成功");
        this.refreshSpreadUrlView(2, caller.spreadUrl);
    }

    /**
     * 复制链接
     */
    private copyLink(): void {
        UAudioManager.ins.playSound("audio_click");
        if (this._address.string == "") {
            return
        } else {
            AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
            UAPIHelper.onCopyClicked(this._address.string);
        }
    }

    /**
     * @description  俱乐部邀请码输入框修改
     */
    onClubCodeEdit(str: string) {
        // cc.log("aaaaa:", this.clubCodeEdit.string)
    };

    /**
     * 加入俱乐部按钮
     */
    private clickJoinClub(): void {
        UAudioManager.ins.playSound("audio_click");
        if (UStringHelper.isEmptyString(this.clubCodeEdit.string)) {
            AppGame.ins.showTips(ULanHelper.COMMON_EDITBOX_TIPS);
            this.clubCodeEdit.string = "";
            return;
        };
        let code = this.clubCodeEdit.string;
        if (AppGame.ins.myClubModel.requestJoinClub(parseInt(code))) {
            this.scheduleOnce(() => {
                AppGame.ins.showConnect(false);
            }, 5);
        }
        this.clubCodeEdit.string = "";
    }

    /**
     * 加入俱乐部返回
     */
    private joinClubRes(caller: ClubHallServer.JoinTheClubMessageResponse): void {
        this.unscheduleAllCallbacks();
        let clubInfo = caller.clubInfo;
        let url = clubInfo.url;
        if (this.noClubTips.active && clubInfo.status != 1) {//是否是第一个俱乐部
            this.hidden_node.active = true;
            this.refreshSpreadUrlView(clubInfo.status, clubInfo.url);
            this.refAutoParBtnState(clubInfo.autoBCPartnerRate);
            this.refCommission();
        };
        this.refViewNodeActive(true);
        this.createOneClubItem(clubInfo);
        this.refComParent();
    };

    /**
     * @description 创建一个俱乐部icon
     * @param clubInfo
     */
    createOneClubItem(clubInfo: ClubHallServer.IClubHallInfo) {
        let item: cc.Node = null;
        let items = this.contentNode.children;
        for (let i = 0; i < items.length; i++) {
            if (!items[i].active) {
                item = items[i];
                if (i == 0) {
                    this.checkedClubId = clubInfo.clubId;
                };
                item.getComponent(cc.Toggle).isChecked = i == 0;
                break;
            };
        };

        if (!item) {
            item = cc.instantiate(this.clubItem);
            if (items.length == 0) {
                this.checkedClubId = clubInfo.clubId;
                item.getComponent(cc.Toggle).isChecked = true;
            };
            this.contentNode.addChild(item);
        };

        item.y = 0;
        item.active = true;
        item.getComponent(VClubMyClubDet).init(clubInfo.clubId, this);
        this.refClubMask();

    };
    /**
     * @description 刷新 俱乐部遮罩
     */
    refClubMask() {
        let items = this.contentNode.children;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let isChecked = item.getComponent(cc.Toggle).isChecked;
            item.getComponent(VClubMyClubDet).refMaskNodeActive(isChecked);
        };
    };

    /**
     * @description 退出俱乐部后刷新界面
     */
    exitClubRef() {
        let items = this.contentNode.children;
        if (items.length > 0) {
            let item = items[0];
            let _VClubMyClubDet = item.getComponent(VClubMyClubDet);
            item.getComponent(cc.Toggle).isChecked = true;
            let url = _VClubMyClubDet.clubInfo.url;
            let autoBCPartnerRate = _VClubMyClubDet.clubInfo.autoBCPartnerRate;

            if (url) {//是否是第一个俱乐部
                this.hidden_node.active = true;
                this.refreshSpreadUrlView(_VClubMyClubDet.clubInfo.status, url);
                this.refAutoParBtnState(autoBCPartnerRate);
            } else {
                this.hidden_node.active = false;
            };
            this.refClubMask();
        } else {
            this.refViewNodeActive(false);
            this.hidden_node.active = false;
        };
    };

    /**
     * 更换背景
     */
    private selectBg(): void {
        UAudioManager.ins.playSound("audio_click");

        let clubInfo = MClub.getClubInfoByClubId(this._checkedClubId);
        let invitationCode = clubInfo.invitationCode;
        AppGame.ins.showUI(ECommonUI.LB_SELECT_POSTER, {
            spreadUrl: this._address.string,
            viewType: 1,
            invitationCode: invitationCode,
        });
    }

    /**
     * 刷新数据推广二维码
     */
    public refreshSpreadUrlView(status: number, qrcode: string, invitationCode?: number): void {
        if (status != 1) {
            this.hidden_node.active = true;
            this._address.string = qrcode;
            AppGame.ins.showConnect(true);
            this._qrCode.make(qrcode);
            this._first_qrcode.make(qrcode);
            this._second_qrcode.make(qrcode);
            this._third_qrcode.make(qrcode);
            if (invitationCode) {
                let childs = this.hidden_node.getChildByName("select_bg").children;
                for (let i = 0; i < childs.length; i++) {
                    let code = childs[i].getChildByName("code");
                    code.getComponent(cc.Label).string = invitationCode.toString();
                };
            }
            AppGame.ins.showConnect(false);
        } else {
            this.hidden_node.active = false;
        }
    };

    /**
     * @description 刷新自动升级按钮状态
     * @param  autoBCPartnerRate   //-1:自动成为合伙人无效   0:自动成为合伙人 未开启  1-100:自动成为合伙人 提成比例
     */
    refAutoParBtnState(autoBCPartnerRate: number) {
        let boo = autoBCPartnerRate > 0 ? false : true;
        this.autoPar.active = boo
        this.autoParOk.active = !boo;
        if (!boo) {
            this.autoParOk.getChildByName("lab").getComponent(cc.Label).string = `自动升级合伙人(${autoBCPartnerRate}%)`;
        };
    };

    /**
     * @description 设置自动合伙人返回
     */
    autoBCPartnerRateRes(caller: ClubHallServer.SetAutoBecomePartnerMessageResponse) {
        let autoBCPartnerRate = caller.autoBCPartnerRate;
        this.refAutoParBtnState(autoBCPartnerRate);
    };

    /**
     * @description 刷新佣金
     */
    refCommission() {
        let todayProfit = MClub.myClubMessgeRes.todayProfit;
        let allowDrawScore = MClub.myClubMessgeRes.allowDrawScore;

        this.todayComm.string = todayProfit == 0 ? "-" : UStringHelper.getMoneyFormat(todayProfit * ZJH_SCALE);
        this.ExtrComm.string = allowDrawScore == 0 ? "-" : UStringHelper.getMoneyFormat(allowDrawScore * ZJH_SCALE);
    };

    /**
     * 请求我的俱乐部返回
     */
    private updateClubData(success: boolean, msg): void {
        this.unscheduleAllCallbacks();
        this.contentNode.children.forEach((node: cc.Node, index: number) => {
            node.active = false;
        });
        this.hidden_node.active = false;
        this.refViewNodeActive(success);
        this.refCommission();
        this.refComParent();
        if (success) {
            let clubInfos = MClub.myClubMessgeRes.clubInfos;
            clubInfos.forEach((value: ClubHallServer.IClubHallInfo, index: number) => {
                if (index == 0 && value.status != 1) {
                    this.hidden_node.active = true;
                    this.refreshSpreadUrlView(value.status, value.url);
                    this.refAutoParBtnState(value.autoBCPartnerRate);
                };
                this.createOneClubItem(value);
            });

        } else {
            // this.todayComm.string = "-";
            // this.ExtrComm.string = "-";
            this._address.string = "";
            AppGame.ins.showTips("您还没有加入俱乐部");
        };
    };

    /**
     * @description 初始化界面节点显示
     * @param bool 
     */
    refViewNodeActive(bool: boolean) {
        this.noClubTips.active = !bool;
        this.clubScrollView.active = bool;
    };

    /**
     * @description 根据加入的俱乐部是否有合伙人或者盟主显示  佣金
     */
    refComParent() {
        let status = MClub.getMyClubsStatus();
        this.comParent.active = status > 1 ? true : false;
    };



    protected onEnable(): void {
        this.init();
        AppGame.ins.myClubModel.on(MClub.UPDATE_MYCLUB, this.updateClubData, this);
        AppGame.ins.myClubModel.on(MClub.JOIN_CLUB, this.joinClubRes, this);
        AppGame.ins.myClubModel.on(MClub.CLUB_REF_QRCODE, this.refreshSpreadUrl, this);
        AppGame.ins.myClubModel.on(MClub.AUTO_BCPARTNER_RATE, this.autoBCPartnerRateRes, this);
    }
    protected onDisable(): void {
        AppGame.ins.showConnect(false);
        this.unscheduleAllCallbacks();
        AppGame.ins.myClubModel.off(MClub.UPDATE_MYCLUB, this.updateClubData, this);
        AppGame.ins.myClubModel.off(MClub.JOIN_CLUB, this.joinClubRes, this);
        AppGame.ins.myClubModel.off(MClub.CLUB_REF_QRCODE, this.refreshSpreadUrl, this);
        AppGame.ins.myClubModel.off(MClub.AUTO_BCPARTNER_RATE, this.autoBCPartnerRateRes, this);
        this.contentNode.children.forEach((node: cc.Node, index: number) => {
            node.active = false;
        });
    }
}
