import { ECommonUI, EMsgType } from "../../../../common/base/UAllenum";
import UAudioManager from "../../../../common/base/UAudioManager";
import UResManager from "../../../../common/base/UResManager";
import { ClubHallServer } from "../../../../common/cmd/proto";
import { UAPIHelper } from "../../../../common/utility/UAPIHelper";
import UHandler from "../../../../common/utility/UHandler";
import ULanHelper from "../../../../common/utility/ULanHelper";
import AppGame from "../../../base/AppGame";
import MClub from "./MClub";
import VClubInfo from "./VClubInfo";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VClubMyClubDet extends cc.Component {

    @property({ type: cc.Label, tooltip: "玩家数量" }) userNumLab: cc.Label = null;
    @property({ type: cc.Sprite, tooltip: "俱乐部icon" }) icon: cc.Sprite = null;
    @property({ type: cc.Label, tooltip: "俱乐部名字" }) clubName: cc.Label = null;
    @property({ type: cc.Label, tooltip: "在俱乐部中的角色" }) roleLab: cc.Label = null; // 盟主 合伙人 会员
    @property({ type: cc.Label, tooltip: "邀请码" }) invitCode: cc.Label = null;
    @property({ type: cc.SpriteAtlas, tooltip: "俱乐部IconAtlas" }) clubIconAtlas: cc.SpriteAtlas = null;
    @property({ type: cc.Node, tooltip: "遮罩" }) maskNode: cc.Node = null;
    @property({ type: cc.Node, tooltip: "退出俱乐部按钮" }) returnBtn: cc.Node = null;
    @property({ type: cc.Label, tooltip: "上级id" }) promoterId: cc.Label = null;


    private _qrcode: string = null; //二维码链接
    private _VClubInfo: VClubInfo = null;
    private _clubInfo: ClubHallServer.IClubHallInfo = null;
    // onLoad () {}

    start() {

    }

    /**
     * @description 初始化界面
     */
    init(clubId: number, _VClubInfo: VClubInfo) {
        let clubInfo = MClub.getClubInfoByClubId(clubId);
        this.clubInfo = clubInfo;
        this._VClubInfo = _VClubInfo;
        this.clubName.string = clubInfo.clubName;

        let clubIconId = clubInfo.clubIconId;
        let clubIconUrl = clubInfo.clubIconUrl;
        // clubIconUrl = "https:\/\/thirdwx.qlogo.cn\/mmopen\/vi_32\/pgibVbcvibGD4XqnMR5HaWibk66dMjCDuyTGOMbRibnqm4rbibwu5uNiaVa2BBJ9FWoVpdyibDW0TPc14FbqomLF1hDkg\/132";
        if (clubIconUrl) {
            UResManager.loadRemoteImg(clubIconUrl, this.icon);
        } else {
            let spriteFrame = this.clubIconAtlas.getSpriteFrame(`clubIcon${clubIconId}`);
            this.icon.spriteFrame = spriteFrame;
        };

        this.userNumLab.string = clubInfo.clubPlayerNum.toString();
        let myInfo = AppGame.ins.myClubModel.getMyInfo();
        let rate = clubInfo.rate;
        this.roleLab.string = clubInfo.status == 1 ? "会员" : (myInfo.id == clubInfo.clubId ? `盟主(${rate}%)` : `合伙人${rate}%`);

        this.invitCode.node.active = false;
        if (clubInfo.invitationCode) {
            this.invitCode.node.active = true;
            this.invitCode.string = "邀请码：" + clubInfo.invitationCode.toString();
        };

        this.returnBtn.active = false;
        this.promoterId.string = clubInfo.promoterId;
        if (clubInfo.status != 1 && myInfo.id == clubInfo.clubId) {
            // this.returnBtn.active = false;
            this.promoterId.string = " --";
        };

        this._qrcode = clubInfo.url;
    };

    get clubInfo(): ClubHallServer.IClubHallInfo {
        return this._clubInfo;
    };

    set clubInfo(clubInfo) {
        this._clubInfo = clubInfo;
    };


    refRoleLab() {

    };

    /**
     * @description 退出俱乐部按钮
     */
    onClickReturnClub() {
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: EMsgType.EOKAndCancel,
            data: "你确认退出俱乐部？",
            handler: UHandler.create((v: boolean) => {
                v && AppGame.ins.myClubModel.requestExitClub(this.clubInfo.clubId);
            })
        });
    };

    /**
     * @description 俱乐部点击
     */
    private onClickToggle() {
        this._VClubInfo.checkedClubId = this.clubInfo.clubId;
        this._VClubInfo.refreshSpreadUrlView(this.clubInfo.status, this._qrcode, this.clubInfo.invitationCode); // 更新俱乐部 推广二维码
        this._VClubInfo.refAutoParBtnState(this.clubInfo.autoBCPartnerRate);
        this._VClubInfo.refClubMask();
    };

    /**
     * @description  刷新遮罩状态
     * @param boo 
     */
    refMaskNodeActive(boo: boolean) {
        this.maskNode.active = !boo;
    };

    /**
     * @description 获得我的俱乐部类
     */
    get vClubInfo(): VClubInfo {
        return this._VClubInfo;
    };

    /**
     * @description  复制邀请码 
     */
    private copyInviCode(event: Event, customData) {
        UAudioManager.ins.playSound("audio_click");
        if (customData == "") {
            return
        } else {
            AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
            UAPIHelper.onCopyClicked(this.clubInfo.invitationCode.toString());
        }
    };

    /**
     * @description 退出俱乐部
     * @param caller 
     */
    exitClubRes(caller: ClubHallServer.ExitTheClubMessageResponse) {
        let clubId = caller.clubId;
        if (this.clubInfo && this.clubInfo.clubId == clubId) {
            this.node.active = false;
            this.node.removeFromParent();
            this._VClubInfo.exitClubRef();
        };
    };


    onEnable() {
        AppGame.ins.myClubModel.on(MClub.EXIT_CLUB, this.exitClubRes, this);
    };
    onDisable() {
        AppGame.ins.myClubModel.off(MClub.EXIT_CLUB, this.exitClubRes, this);
    };
    // update (dt) {}
}
