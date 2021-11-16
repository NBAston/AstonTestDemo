import { ECommonUI } from "../../../../common/base/UAllenum";
import UAudioManager from "../../../../common/base/UAudioManager";
import VWindow from "../../../../common/base/VWindow";
import { ClubHallServer } from "../../../../common/cmd/proto";
import UDebug from "../../../../common/utility/UDebug";
import UHandler from "../../../../common/utility/UHandler";
import UStringHelper from "../../../../common/utility/UStringHelper";
import AppGame from "../../../base/AppGame";
import MClub from "./MClub";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ui_change_scale extends VWindow {

    @property(cc.Label)
    current_scale: cc.Label = null;

    @property(cc.Label)
    max_scale: cc.Label = null;

    @property(cc.Label)
    subordinate_id: cc.Label = null;

    @property(cc.Label)
    subordinate_name: cc.Label = null;

    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    @property(cc.SpriteFrame)
    editbox_img_normal: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    editbox_img_input: cc.SpriteFrame = null;

    private club_id: number;
    private user_id: number;
    private _istipTS: boolean = false;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init(): void {
        super.init();

    }

    start() {
        this.editBox.node.on("editing-did-began", this.startInput, this);
        this.editBox.node.on("editing-did-ended", this.getInput, this);
    }

    /**
    * 开始输入
    */
    private startInput(): void {
        UAudioManager.ins.playSound("audio_click");
        this.editBox.node.getComponentInChildren(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    /**
     * 结束输入
     */
    private getInput(): void {
        this.editBox.node.getComponentInChildren(cc.Sprite).spriteFrame = this.editbox_img_normal;
        if (!UStringHelper.isInt(this.editBox.string)) {
            if (parseInt(this.editBox.string) == 0) {
                AppGame.ins.showTips("下级分成比例不能设置为0");
            } else {
                if (this.editBox.string == "") {
                    AppGame.ins.showTips("请设置分成比例！");
                } else {
                    AppGame.ins.showTips("您输入的内容含有特殊字符，请重新输入");
                }
            }
            this._istipTS = true;
            this.editBox.string = "";
        }
    }

    closeUI() {
        super.playclick();
        super.clickClose();
    }

    /**
     *  隐藏
     */
    hide(): void {
        this.node.active = false;
    }
    /**
     * 显示
     */
    show(data: any): void {
        super.show(data);
        this.subordinate_id.string = data.a;
        this.subordinate_name.string = data.b;
        this.current_scale.string = data.c;
        this.max_scale.string = data.d;
        this.club_id = data.f;
        this.user_id = data.a;
    }


    private expelled_user(): void {
        UDebug.log('开除此用户');
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 2, data: "确定要开除直属合伙人" + this.user_id + "吗？", handler: UHandler.create((a) => {
                if (a) {
                    AppGame.ins.myClubModel.requestFireMember(this.club_id, AppGame.ins.roleModel.useId, this.user_id);
                }
            }, this)
        });
    }

    private setCommison(): void {
        if (this.editBox.string == "") {
            if (!this._istipTS) {
                AppGame.ins.showTips("请设置分成比例！");
            };
            this._istipTS = false;
        } else {
            AppGame.ins.myClubModel.requestSetSubordinateRate(this.club_id, this.user_id, parseInt(this.editBox.string));
        }
    }


    private getSubordinateRate(caller: ClubHallServer.SetSubordinateRateMessageResponse): void {
        AppGame.ins.showTips("设置下级提成比例成功");
        super.clickClose();
    }

    private fireMember(): void {
        super.clickClose();
    }

    protected onEnable() {
        this.editBox.string = '';
        AppGame.ins.myClubModel.on(MClub.MY_CLUB_FIRE_MEMBER, this.fireMember, this);
        AppGame.ins.myClubModel.on(MClub.UPDATE_SUBORDINATE_RATE, this.getSubordinateRate, this);
    }

    protected onDisable() {
        AppGame.ins.myClubModel.off(MClub.MY_CLUB_FIRE_MEMBER, this.fireMember, this);
        AppGame.ins.myClubModel.off(MClub.UPDATE_SUBORDINATE_RATE, this.getSubordinateRate, this);
    }

    // update (dt) {}
}
