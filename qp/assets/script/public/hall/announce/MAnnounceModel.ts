import Model from "../../../common/base/Model";
import { mailData, PublicNoticeItem } from "./AnnounceData";
import UMsgCenter from "../../../common/net/UMsgCenter";
import UHandler from "../../../common/utility/UHandler";
import { HallServer, Game } from "../../../common/cmd/proto";
import AppGame from "../../base/AppGame";
import MRole from "../lobby/MRole";
import { SysEvent } from "../../../common/base/UAllClass";



/**
 * 游戏
 */
export default class MAnnounceModel extends Model {

    // static UPDATE_MAIL = "UPDATE_MAIL";
    static UPDATE_ANNOUNCE_LIST = "UPDATE_ANNOUNCE_LIST"; // 更新公告列表
    private _publicNoticeItemData: Array<PublicNoticeItem>;

    resetData(): void {
        this._publicNoticeItemData = [];
    }

    update(dt: number): void {

    }

    init(): void {
        this._publicNoticeItemData = []
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PUBLIC_NOTICE_MESSAGE_RES,
            new UHandler(this.get_public_notice_message_res, this));
    }

    /**公告列表监听返回 */
    private get_public_notice_message_res(caller: HallServer.GetPublicNoticeListMessageResponse) {
        AppGame.ins.showConnect(false);
        if(caller.retCode == 0) {
            this._publicNoticeItemData = [];
            if(caller.items.length > 0) {
                caller.items.forEach(element => {
                    let item = new PublicNoticeItem();
                    item.Id = element.Id;
                    item.bPopShow = element.bPopShow;
                    item.content = element.content;
                    item.sortId = element.sortId;
                    item.title = element.title;
                    this._publicNoticeItemData.push(item);
                });
            }
            this.emit(MAnnounceModel.UPDATE_ANNOUNCE_LIST, true, caller.errorMsg);
        } else {
            this.emit(MAnnounceModel.UPDATE_ANNOUNCE_LIST, false, caller.errorMsg);
        }
    }
  
    /**请求游戏公告列表数据 */
    requestGameAnnounceListData(): boolean {
        // AppGame.ins.showConnect(true);
        var request = new HallServer.GetPublicNoticeListMessage();
        request.userId = AppGame.ins.roleModel.useId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PUBLIC_NOTICE_MESSAGE_REQ,
            request);
        return true;
    }

    // 获取公告列表数据
    getPublicNoticeListData(): Array<PublicNoticeItem> {
        return this._publicNoticeItemData;
    }
  
   /* getannouncedata(): Array<mailData> {
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
    }*/


}
