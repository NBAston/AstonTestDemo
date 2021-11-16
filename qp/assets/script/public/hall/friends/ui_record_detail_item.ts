import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventListener from "../../../common/utility/UEventListener";
import UResManager from "../../../common/base/UResManager";
import {EGameType} from "../../../common/base/UAllenum";
import AppGame from "../../base/AppGame";
import ULanHelper from "../../../common/utility/ULanHelper";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";


const { ccclass } = cc._decorator;
@ccclass
export default class VRecordDetailItem extends cc.Component {

    private gameIcon: cc.Sprite;
    private game_name: cc.Label
    private end_time: cc.Label;
    private bet_number: cc.Label;
    private turn_number: cc.Label;
    private round_number: cc.Label;
    private score: cc.Label;

    init(): void {
        this.gameIcon = UNodeHelper.getComponent(this.node, "game_icon", cc.Sprite);
        this.game_name = UNodeHelper.getComponent(this.node, "game_name", cc.Label);
        this.end_time = UNodeHelper.getComponent(this.node, "end_time", cc.Label);
        this.bet_number = UNodeHelper.getComponent(this.node, "bet_number", cc.Label);
        this.turn_number = UNodeHelper.getComponent(this.node, "turn_number", cc.Label);
        this.round_number = UNodeHelper.getComponent(this.node, "round_number", cc.Label);
        this.score = UNodeHelper.getComponent(this.node, "score", cc.Label);
        var btnCopy = UNodeHelper.find(this.node, "btn_copy");
        UEventListener.get(btnCopy).onClick = new UHandler(this.onClickCopy, this);
    }

    //复制牌局编号
    onClickCopy(){
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked(this.round_number.string.substr(3,30));
    }

    bind(data:any){
        this.node.active = true
        this.game_name.string = data.gameName
        this.end_time.string = data.gameEndTime
        this.bet_number.string = "已投注:" + (data.betScore / 100).toString()
        this.turn_number.string = "第" + data.currentRound + "局"
        this.round_number.string = "编号:" + data.gameRoundNo
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
