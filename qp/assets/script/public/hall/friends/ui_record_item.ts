import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventListener from "../../../common/utility/UEventListener";
import UResManager from "../../../common/base/UResManager";
import AppGame from "../../base/AppGame";
import { ECommonUI, EGameType, ELevelType } from "../../../common/base/UAllenum";
import { ULocalStorage } from "../../../common/utility/ULocalStorage";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VRecordItem extends cc.Component {
    private gameIcon: cc.Sprite;
    private game_name: cc.Label
    private end_time: cc.Label;
    private room_number: cc.Label;
    private turn_number: cc.Label;
    private set_number: cc.Label;
    private round_number: cc.Label;
    private score: cc.Label;
    private mainId:string;

    init(): void {
        this.gameIcon = UNodeHelper.getComponent(this.node, "game_icon", cc.Sprite);
        this.game_name = UNodeHelper.getComponent(this.node, "game_name", cc.Label);
        this.end_time = UNodeHelper.getComponent(this.node, "end_time", cc.Label);
        this.room_number = UNodeHelper.getComponent(this.node, "room_number", cc.Label);
        this.turn_number = UNodeHelper.getComponent(this.node, "turn_number", cc.Label);
        this.set_number = UNodeHelper.getComponent(this.node, "set_number", cc.Label);
        this.round_number = UNodeHelper.getComponent(this.node, "round_number", cc.Label);
        this.score = UNodeHelper.getComponent(this.node, "score", cc.Label);
        var btnDetail = UNodeHelper.find(this.node, "btn_detail");
        UEventListener.get(btnDetail).onClick = new UHandler(this.onShowDetail, this);
    }

    //显示详情
    onShowDetail(){
        AppGame.ins.showUI(ECommonUI.UI_RECORD_DETAIL,this.mainId);
    }

    bind(data:any){
        this.node.active = true
        this.mainId = data.mainId
        this.game_name.string = data.gameName
        this.end_time.string = data.gameEndTime
        this.room_number.string = "房间号: " + data.roomId
        //局数字段为-1
        if (data.playDuration > 0){
            this.set_number.string = "设置时长: " + Math.ceil(data.playDuration / 60) + "分钟"
            this.turn_number.string = "实际时长: " + Math.ceil(data.currentDuration / 60) + "分钟"
        }else if(data.roundNum > 0){
            this.set_number.string = "设置局数: " + data.roundNum + "局"
            this.turn_number.string = "实际局数: " + data.currentRound + "局"
        }
        this.score.string = (data.winScore / 100).toString()
        //输赢颜色
        var color = cc.Color.BLACK;
        this.score.node.color = data.winScore <= 0 ? color.fromHEX("#32A07C") : color.fromHEX("#CC5516")
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
