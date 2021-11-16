import Model from "../../../common/base/Model";
import UMsgCenter from "../../../common/net/UMsgCenter";
import UHandler from "../../../common/utility/UHandler";
import { HallServer, Game } from "../../../common/cmd/proto";
import AppGame from "../../base/AppGame";
import MRole from "../lobby/MRole";
import { SysEvent } from "../../../common/base/UAllClass";
import { MailData } from "./MailServiceData";
import { ECommonUI } from "../../../common/base/UAllenum";



/**
 * 游戏
 */
export default class MMailModel extends Model {
    static UPDATE_MAIL = "UPDATE_MAIL";
    static READ_MAIL = "READ_MAIL";
    private _mailData: { [key: string]: MailData };
    
    resetData(): void {
        this._mailData = null;
    }

    update(dt: number): void {
    }

    init(): void {
        //记录
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MAIL_LIST_MESSAGE_RES,
            new UHandler(this.pulL_mail_message_res, this));
        //读取
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_READ_MAIL_MESSAGE_RES,
            new UHandler(this.read_mail_message_res, this));
        //删除
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_DEL_MAIL_MESSAGE_RES,
            new UHandler(this.del_mail_message_res, this));
    }

    private pulL_mail_message_res(caller: HallServer.GetMailListMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this._mailData = {};
            if (caller.mailList) {
                for (const key in caller.mailList) {
                    if (caller.mailList.hasOwnProperty(key)) {
                        const element = caller.mailList[key];
                        let item = new MailData();
                        for (const key2 in element) {
                            if (element.hasOwnProperty(key2)) {
                                const el = element[key2];
                                item[key2] = el;
                            }
                        }
                        this._mailData[item.mailId] = item;
                    }
                }
            }
            this.emit(MMailModel.UPDATE_MAIL, true);
        } else {
            this.emit(MMailModel.UPDATE_MAIL, false, caller.errorMsg);
        }
    }

    private read_mail_message_res(caller: HallServer.ReadMailMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            var mail = this._mailData[caller.mailId];
            if (mail) mail.status = caller.status;
            if (caller.rewardScore > 0) {
                cc.systemEvent.emit(SysEvent.SHOW_AWARDS, caller.rewardScore,"邮件奖励");
            }
            AppGame.ins.roleModel.saveGold(caller.totalScore);
            this.emit(MMailModel.READ_MAIL, true, mail);
        } else {
            this.emit(MMailModel.READ_MAIL, false, null, caller.errorMsg);
        }
    }

    private del_mail_message_res(caller: HallServer.DelMailMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            delete this._mailData[caller.mailId]
            this.emit(MMailModel.UPDATE_MAIL, true);
            AppGame.ins.closeUI(ECommonUI.LB_Mail_Detail);
        } else {
            this.emit(MMailModel.UPDATE_MAIL, false,caller.errorMsg);
        }
    }

    /**
     * 请求拉去邮件列表
     */
    requestPullMail(): boolean {
        AppGame.ins.showConnect(true);
        var request = new HallServer.GetMailListMessage();
        request.userId = AppGame.ins.roleModel.useId;
        request.mailId = "";
        UMsgCenter.ins.sendPkg(0,
             Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
             Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MAIL_LIST_MESSAGE_REQ,
             request);
        return true;
    }
    /**
     * 读取邮件
     * @param mailId 
     */
    requestReadMail(mailId: string): boolean {
        if (!this._mailData) {
            return false;
        }
        var mail = this._mailData[mailId];
        if (mail.status != 0) {
            this.emit(MMailModel.READ_MAIL, true, mail);
            return false;
        }
        AppGame.ins.showConnect(true);
        var request = new HallServer.ReadMailMessage();
        request.userId = AppGame.ins.roleModel.useId;
        request.mailId = mailId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_READ_MAIL_MESSAGE_REQ,
            request);
        return true;
    }

    //删除邮件
    requestDeteleMail(mailId: string): boolean {
        if (!this._mailData) {
            return false;
        }

        AppGame.ins.showConnect(true);
        var request = new HallServer.DelMailMessage();
        request.userId = AppGame.ins.roleModel.useId;
        request.mailId = mailId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_DEL_MAIL_MESSAGE_REQ,
            request);
        return true;
    }

    getdata(): Array<MailData> {
        var dt = [];
        if (this._mailData) {
            for (const key in this._mailData) {
                if (this._mailData.hasOwnProperty(key)) {
                    const element = this._mailData[key];
                    dt.push(element);
                }
            }
        }
        return dt;
    }
}
