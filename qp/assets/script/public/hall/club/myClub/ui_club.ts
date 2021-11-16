// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ECommonUI } from "../../../../common/base/UAllenum";
import VWindow from "../../../../common/base/VWindow";
import { ClubHallServer } from "../../../../common/cmd/proto";
import UDebug from "../../../../common/utility/UDebug";
import UStringHelper from "../../../../common/utility/UStringHelper";
import AppGame from "../../../base/AppGame";
import MRole from "../../lobby/MRole";
import { ZJH_SCALE } from "../../lobby/VHall";
import MClub from "./MClub";
import club_mysuperior_info from "./club_mysuperior_info";
import UAudioManager from "../../../../common/base/UAudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ui_club extends VWindow {

    // @property(cc.Toggle)
    // myclub_toggle: cc.Toggle = null;

    // @property(cc.Toggle)
    // performance_toggle: cc.Toggle = null;

    // @property(cc.Toggle)
    // record_toggle: cc.Toggle = null;

    // @property(cc.Toggle)
    // team_toggle: cc.Toggle = null;

    // @property(cc.Toggle)
    // bet_record_toggle: cc.Toggle = null;

    // @property(cc.Toggle)
    // mysuperior_toggle: cc.Toggle = null;

    @property({ type: [cc.Toggle], tooltip: "左边toggle数组" }) leftToggles: cc.Toggle[] = [];

    @property(cc.Node)
    club_info: cc.Node = null;

    @property(cc.Node)
    performance_info: cc.Node = null;

    @property(cc.Node)
    record_info: cc.Node = null;

    @property(cc.Node)
    mysuperior_info: cc.Node = null;

    @property(cc.Node)
    team_info: cc.Node = null;

    @property(cc.Node)
    bet_record_info: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;


    @property(cc.Label)
    money: cc.Label = null;

    @property({ type: cc.Node, tooltip: "左边toggle父节点" }) leftTogglePar: cc.Node = null;
    @property({ type: cc.Label, tooltip: "标题" }) titleLab: cc.Label = null;
    @property({ type: cc.Toggle, tooltip: "盟主全局匹配" }) globalMatchBtn: cc.Toggle = null;

    private Vindex: number = 1;// content内容Vie下标
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init() {
        super.init();
        this.money.string = UStringHelper.getMoneyFormat(AppGame.ins.roleModel.score * ZJH_SCALE);
    }


    closeUI() {
        super.playclick();
        super.clickClose();
    }

    clickClose() {
        super.clickClose();
        AppGame.ins.clubHallModel.isAutoRefreshTable = true;
    }

    private toggleClick(event, customEventData): void {

        for (let i = 0; i < this.content.childrenCount; i++) {
            this.content.children[i].active = false;
        }
        if (event)
            UAudioManager.ins.playSound("audio_click");
        customEventData = Number(customEventData);
        switch (customEventData) {


            case 1:
                if (this.leftToggles[customEventData - 1].isChecked) {
                    this.club_info.active = true;
                }
                this.titleLab.string = "俱乐部·我的俱乐部";
                break;

            case 2:
                if (this.leftToggles[customEventData - 1].isChecked) {
                    this.performance_info.active = true;
                }
                this.titleLab.string = "俱乐部·我的业绩";
                break;
            case 4:
                if (this.leftToggles[customEventData - 1].isChecked) {
                    this.team_info.active = true;
                }
                this.titleLab.string = "俱乐部·团队成员";
                break;

            case 5:
                if (this.leftToggles[customEventData - 1].isChecked) {
                    this.bet_record_info.active = true;
                }
                this.titleLab.string = "俱乐部·我的战绩";
                break;
            case 6:
                if (this.leftToggles[customEventData - 1].isChecked) {
                    this.mysuperior_info.active = true;
                    this.mysuperior_info.getComponent(club_mysuperior_info).reqData();
                }
                this.titleLab.string = "俱乐部·我的上级";
                break;
            case 3:
                if (this.leftToggles[customEventData - 1].isChecked) {
                    this.record_info.active = true;
                }
                this.titleLab.string = "俱乐部·佣金记录";
                break;

            default:
                break;
        }
    }

    private intoCharge(): void {
        AppGame.ins.showUI(ECommonUI.LB_Charge);
    }

    private fireMember(caller: ClubHallServer.FireMemberMessageResponse): void {
        AppGame.ins.showTips("用户" + caller.promoterId + "已从俱乐部" + caller.clubId + "移除");
    }

    /**
     *  隐藏
     */
    hide(): void {
        this.node.active = false;
    }

    /**
     * 显示
     * Vindex  跟toggleClick方法中switch对应
     */
    show(data: any): void {
        super.show(data);
        if (data && data["Vindex"]) {
            this.Vindex = data["Vindex"];
            AppGame.ins.myClubModel.requestMyClubInfo()
        } else {
            this.leftToggles[0].isChecked = true;
            this.toggleClick(null, 1);
        };
    }
    private update_socre(score: number): void {
        this.money.string = UStringHelper.getMoneyFormat(score * ZJH_SCALE);
    }

    /**
     * @description 根据玩机加入俱乐部状态  刷新左边按钮  
     *  0没有加入俱乐部 , 1加入俱乐部但是普通会员  ，2是合伙人或者盟主
     */
    refLeftToggle() {
        let key = MClub.getMyClubsStatus();
        let childs = this.leftTogglePar.children;
        for (let i = 1; i < childs.length; i++) {
            childs[i].active = false;
        };

        switch (key) {
            case 0:
                cc.log("没有加入俱乐部");
                break;
            case 1:
                cc.log("我是普通俱乐部会员")
                this.leftTogglePar.getChildByName("myClub").active = true;
                this.leftTogglePar.getChildByName("mySuperiortoggle").active = true;
                this.leftTogglePar.getChildByName("betRecordtoggle").active = true;
                break;
            case 2:
                cc.log("我是盟主");
                let childs = this.leftTogglePar.children;
                for (let i = 0; i < childs.length; i++) {
                    childs[i].active = true;
                };
                break;
        };
        if (this.Vindex > 1) {
            this.leftToggles[this.Vindex - 1].isChecked = true;
            this.toggleClick(null, this.Vindex.toString());
            this.Vindex = 1;
        };
    };

    /**
     * @description 全局匹配的btn
     */
    onGlobalMatchBtn() {
        let isChecked = this.globalMatchBtn.isChecked;
        let num = isChecked ? 1 : 0;
        AppGame.ins.myClubModel.requestSetMyClubGlobalMatchMessage(num);
    };

    /**
     * @description 刷新全局匹配按钮得状态
     * @param //-1 您没有俱乐部 0-不全局匹配 1-全局匹配
     */
    refGlobalMatchBtnState(num: number) {
        switch (num) {
            case -1:
                this.globalMatchBtn.node.active = false;
                break;
            case 0:
                this.globalMatchBtn.node.active = true;
                this.globalMatchBtn.isChecked = false;
                break;
            case 1:
                this.globalMatchBtn.node.active = true;
                this.globalMatchBtn.isChecked = true;
                break;
            default:
                this.globalMatchBtn.isChecked = !this.globalMatchBtn.isChecked;
                break;
        };
    };


    protected onEnable() {
        // this.leftToggles[0].isChecked = true;
        for (let i = 0; i < this.content.childrenCount; i++) {
            this.content.children[i].active = false;
        }
        // this.club_info.active = true;
        this.money.string = UStringHelper.getMoneyFormat(AppGame.ins.roleModel.score * ZJH_SCALE);
        AppGame.ins.myClubModel.on(MClub.MY_CLUB_FIRE_MEMBER, this.fireMember, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.update_socre, this);

        AppGame.ins.myClubModel.on(MClub.UPDATE_MYCLUB, this.refLeftToggle, this);
        AppGame.ins.myClubModel.on(MClub.JOIN_CLUB, this.refLeftToggle, this);
        AppGame.ins.myClubModel.on(MClub.REF_GLOBAL_MATCH_STATIC, this.refGlobalMatchBtnState, this);
        AppGame.ins.myClubModel.requestGetMyClubGlobalMatch();

    }

    protected onDisable() {
        AppGame.ins.myClubModel.off(MClub.UPDATE_MYCLUB, this.refLeftToggle, this);
        AppGame.ins.myClubModel.off(MClub.MY_CLUB_FIRE_MEMBER, this.fireMember, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.update_socre, this);
        AppGame.ins.myClubModel.off(MClub.JOIN_CLUB, this.refLeftToggle, this);
        AppGame.ins.myClubModel.off(MClub.REF_GLOBAL_MATCH_STATIC, this.refGlobalMatchBtnState, this);
    }

    // update (dt) {}
}
