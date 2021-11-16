import Model from "../../../common/base/Model";
import UMsgCenter from "../../../common/net/UMsgCenter";
import UHandler from "../../../common/utility/UHandler";
import { HallServer, Game } from "../../../common/cmd/proto";
import AppGame from "../../base/AppGame";

/**
 * 转账模块，服务器消息
 */
export default class MTransferModel extends Model {
    static UPDATE_MAIL = "UPDATE_MAIL";
    static READ_MAIL = "READ_MAIL";

    resetData(){

    }
    
    update(){

    }

    init(): void {
        //记录
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MAIL_LIST_MESSAGE_RES,
            new UHandler(this.pulL_mail_message_res, this));
    }

    private pulL_mail_message_res(caller: HallServer.GetMailListMessageResponse): void {
        AppGame.ins.showConnect(false);

    }


}
