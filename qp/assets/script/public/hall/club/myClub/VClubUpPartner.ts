import { ECommonUI } from "../../../../common/base/UAllenum";
import VWindow from "../../../../common/base/VWindow";
import { ClubHallServer, HallServer } from "../../../../common/cmd/proto";
import UDebug from "../../../../common/utility/UDebug";
import UEventHandler from "../../../../common/utility/UEventHandler";
import ULanHelper from "../../../../common/utility/ULanHelper";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import UStringHelper from "../../../../common/utility/UStringHelper";
import AppGame from "../../../base/AppGame";
import MProxy from "../../proxy/MProxy";
import MClub from "./MClub";
import VClubMyClubDet from "./VClubMyClubDet";


export const ZJH_SCALE = 0.01;

const { ccclass, property } = cc._decorator;

@ccclass
export default class VClubUpPartner extends VWindow {

    @property(cc.SpriteFrame)
    editbox_img_normal: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    editbox_img_input: cc.SpriteFrame = null;

    @property({ type: cc.Toggle, tooltip: "自动合伙人Toggle" }) autoPartToggle: cc.Toggle = null;

    private _editbox: cc.EditBox;
    private _back: cc.Node;

    init(): void {
        super.init();
        this._editbox = UNodeHelper.getComponent(this._root, "editbox", cc.EditBox);
        this._editbox.node.on("editing-did-began", this.startInput, this);
        this._editbox.node.on("editing-did-ended", this.getInput, this);
        this._back = UNodeHelper.find(this.node, "back");
        UEventHandler.addClick(this._back, this.node, "VClubUpPartner", "closeUI");
    }


    /**
     * 开始输入
     */
    private startInput(): void {
        super.playclick();
        this._editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    /**
     * 结束输入
     */
    private _istipTS: boolean = false;
    private getInput(): void {
        this._editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
        if (this._editbox.string.indexOf(".") != -1) {
            this._editbox.string = "";
            AppGame.ins.showTips("不能输入特殊符号");
            this._istipTS = true;
            return;
        };
    }

    /**
     * 确认升级合伙人
     */
    private confirmCommission(): void {
        super.playclick();
        let isChecked = this.autoPartToggle.isChecked;

        if (UStringHelper.isEmptyString(this._editbox.string) && isChecked) {
            this._editbox.string = "";
            if (!this._istipTS)
                AppGame.ins.showTips(ULanHelper.COMMON_EDITBOX_TIPS);
            this._istipTS = false;
            return;
        };

        let num = Number(this._editbox.string);
        if ((num < 1 || num > this._clubInfo.rate) && isChecked) {
            this._editbox.string = "";
            AppGame.ins.showTips(ULanHelper.COMMON_EDITBOX_TIPS);
            return;
        };
        let clubId = this._clubInfo.clubId;
        let autoBCPartnerRate = isChecked ? num : 0;
        AppGame.ins.myClubModel.setAutoBecomePartner(clubId, autoBCPartnerRate);
    };

    /**
     * @description 自动合伙人开关
     */
    private onClickPartSwitch() {
        this.refViewState(this.autoPartToggle.isChecked)
        if (!this.autoPartToggle.isChecked) {
            this._editbox.string = "";
        };
    };

    private _clubInfo: ClubHallServer.IClubHallInfo = null;
    show(data: any): void {
        super.show(data);
        let checkedClubId: number = data["checkedClubId"];
        this._clubInfo = MClub.getClubInfoByClubId(checkedClubId);

        this._editbox.placeholder = `设置默认合伙人分成比例，最低1%，最高${this._clubInfo.rate}%`;
        let autoBCPartnerRate = this._clubInfo.autoBCPartnerRate;
        let isAuto = autoBCPartnerRate > 0 ? true : false;
        this.refViewState(isAuto);
    }

    closeUI() {
        this.playclick();
        super.clickClose();
    };

    /**
     * @description 是否自动
     * @param isAuto ture 自动 false 不自动
     */
    refViewState(isAuto: boolean) {
        this.autoPartToggle.isChecked = isAuto;
        this._editbox.enabled = isAuto;
    };

    /**
     * @description 自动升级合伙人
     * 
     */
    autoBCPartnerRateRes(caller: ClubHallServer.SetAutoBecomePartnerMessageResponse) {
        let autoBCPartnerRate = caller.autoBCPartnerRate;
        let clubId = caller.clubId;
        this.refViewState(autoBCPartnerRate > 0 ? true : false);
        this._editbox.string = "";
        AppGame.ins.closeUI(ECommonUI.CLUB_UP_PARTNER);
        // let vClubInfo = this._VClubMyClubDet.vClubInfo;
        // this._VClubMyClubDet.init(clubId, vClubInfo)

    };

    protected onEnable(): void {
        AppGame.ins.myClubModel.on(MClub.AUTO_BCPARTNER_RATE, this.autoBCPartnerRateRes, this);
    }

    protected onDisable(): void {
        AppGame.ins.myClubModel.off(MClub.AUTO_BCPARTNER_RATE, this.autoBCPartnerRateRes, this);
    }


}
