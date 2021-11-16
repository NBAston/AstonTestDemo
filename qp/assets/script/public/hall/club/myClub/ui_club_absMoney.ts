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

export const ZJH_SCALE = 0.01;

const { ccclass, property } = cc._decorator;

@ccclass
export default class ui_club_absMoney extends VWindow {

    @property(cc.SpriteFrame)
    editbox_img_normal: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    editbox_img_input: cc.SpriteFrame = null;

    private _num_commission: cc.Label;
    private _num_gold: cc.Label;
    private _editbox: cc.EditBox;
    private _back: cc.Node;

    init(): void {
        super.init();
        this._num_commission = UNodeHelper.getComponent(this._root, "num_commission", cc.Label);
        this._num_gold = UNodeHelper.getComponent(this._root, "num_gold", cc.Label);
        this._editbox = UNodeHelper.getComponent(this._root, "editbox", cc.EditBox);
        this._num_gold.string = "0";
        this._num_commission.string = "0";
        this._editbox.node.on("editing-did-began", this.startInput, this);
        this._editbox.node.on("editing-did-ended", this.getInput, this);
    }

    private getAll(): void {
        super.playclick();
        // if(parseInt(this._editbox.string) == 0){
        //     AppGame.ins.showTips("最小提取佣金为50，请重新输入！");
        //     this._editbox.string = "";
        // }else 
        // if(parseInt(this._editbox.string) < 50){
        //     AppGame.ins.showTips("最小提取佣金为50，请重新输入！");
        //     this._editbox.string = "";
        // }else if(this._editbox.string == ""){
        //     AppGame.ins.showTips("最小提取佣金为50，请重新输入！");
        //     this._editbox.string = "";
        // }else{
        this._editbox.string = parseInt(this._num_commission.string) + "";
        // }

    }

    private updateData(): void {
        let myClubMessgeRes = MClub.myClubMessgeRes;

        if (myClubMessgeRes) {
            let canGetMoney = myClubMessgeRes.allowDrawScore;
            let leftMoney = this._todayProfit + canGetMoney;

            this._num_commission.string = UStringHelper.getMoneyFormat(canGetMoney * ZJH_SCALE);
            this._num_gold.string = UStringHelper.getMoneyFormat(leftMoney * ZJH_SCALE);
        } else {
            this._num_gold.string = "0";
            this._num_commission.string = "0";
        }
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
    private getInput(): void {
        this._editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
        if (UStringHelper.isEmptyString(this._editbox.string)) {
            this._editbox.string = "";
            AppGame.ins.showTips(ULanHelper.ERROR_GOLD);
            return;
        };
        if (parseInt(this._editbox.string) > parseInt(this._num_commission.string)) {
            AppGame.ins.showTips(ULanHelper.COMMISSION_LACK);
            if (parseInt(this._num_commission.string) == 0) {
                this._editbox.string = "";
                return
            } else {
                this._editbox.string = parseInt(this._num_commission.string) + "";
                return
            }

        } else if (parseInt(this._editbox.string) < parseInt(this._num_commission.string) && parseInt(this._editbox.string) >= 50) {
            this._editbox.string = parseInt(this._editbox.string) + "";
            return
        } else {
            AppGame.ins.showTips(ULanHelper.MINCOMMISSION);
            this._editbox.string = "";
            return
        }
    }

    /**
     * 确认提现
     */
    private confirmCommission(): void {
        super.playclick();
        if (UStringHelper.isEmptyString(this._editbox.string)) {
            return;
        };
        if (parseInt(this._editbox.string) == 0) {
            AppGame.ins.showTips(ULanHelper.ERROR_GOLD);
            this._editbox.string = "";
            return
        };
        AppGame.ins.myClubModel.exchanegeMyRevenueClub(Number(this._editbox.string) * 100);

    }

    /**
     * 更新佣金
     */
    private updateCommission(caller: ClubHallServer.ExchangeRevenueMessageResponse): void {
        this._editbox.string = "";
        AppGame.ins.roleModel.requestUpdateScore()
        AppGame.ins.showTips(ULanHelper.GETCOMMISSIONSUCCESS);
        let leftMoney = this._todayProfit + caller.leftScore;
        this._num_commission.string = UStringHelper.getMoneyFormat(caller.leftScore * ZJH_SCALE);
        this._num_gold.string = UStringHelper.getMoneyFormat(leftMoney * ZJH_SCALE);
        AppGame.ins.myClubModel.requestMyClubInfo();
        AppGame.ins.roleModel.requestUpdateScore();
        // this.clickClose();
    };

    private _todayProfit: number = 0;
    show(data: any): void {
        super.show(data);
        UDebug.log(data);
        this._todayProfit = data["todayProfit"];
        this.updateData();
        // this.showAnimation();
    }

    // closeUI() {
    //     this.playclick();
    //     super.clickClose();
    // }

    protected onEnable(): void {
        AppGame.ins.myClubModel.on(MClub.UPDATE_GETGOLD_CLUB, this.updateCommission, this);
    }

    protected onDisable(): void {
        AppGame.ins.myClubModel.off(MClub.UPDATE_GETGOLD_CLUB, this.updateCommission, this);
    }


}
