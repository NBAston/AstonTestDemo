import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventListener from "../../../common/utility/UEventListener";
import UResManager from "../../../common/base/UResManager";
import AppGame from "../../base/AppGame";
import { ECommonUI, EGameType } from "../../../common/base/UAllenum";



const { ccclass, property } = cc._decorator;

@ccclass
export default class VCreateRecordItem extends cc.Component {

    private gameIcon: cc.Sprite;
    private game_name: cc.Label
    private end_time: cc.Label;
    private room_number: cc.Label;
    private turn_number: cc.Label;
    private need_card: cc.Label;

    init(): void {
        this.gameIcon = UNodeHelper.getComponent(this.node, "game_icon", cc.Sprite);
        this.game_name = UNodeHelper.getComponent(this.node, "game_name", cc.Label);
        this.end_time = UNodeHelper.getComponent(this.node, "create_time", cc.Label);
        this.room_number = UNodeHelper.getComponent(this.node, "room_number", cc.Label);
        this.turn_number = UNodeHelper.getComponent(this.node, "turn_number", cc.Label);
        this.need_card = UNodeHelper.getComponent(this.node, "need_card", cc.Label);
    }

   
    bind(data:any){
        this.node.active = true
        this.game_name.string = data.gameName
        this.end_time.string = data.createTime
        this.room_number.string = data.roomId
        
        if (data.roundNum > 0){
            this.turn_number.string = "局数:  " + data.roundNum + "局"
        }else if (data.playDuration > 0 ){
            this.turn_number.string = "时长:  " + Math.ceil(data.playDuration/60)  + "分钟"
        }

        this.need_card.string = (data.needRoomCard / 100).toFixed(2)
        

        //游戏ICON
        var url= ""
        if (data.gameId == EGameType.TBNN_HY) url = "common/hall/texture/task/" + "task_img_tbnn";
        else if (data.gameId == EGameType.DDZ_HY) url = "common/hall/texture/task/" + "task_img_ddz";
        else if (data.gameId == EGameType.PDK_HY) url = "common/hall/texture/task/" + "task_img_pdk";
        else if (data.gameId == EGameType.KPQZNN_HY) url = "common/hall/texture/task/" + "task_img_kpqznn";
        else if (data.gameId == EGameType.ZJH_HY) url = "common/hall/texture/task/" + "task_img_zjh";
        UResManager.loadUrl(url, this.gameIcon);

    }

    hide(): void {
        this.node.active = false;
    }
}
