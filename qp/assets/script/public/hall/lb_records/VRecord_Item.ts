import UNodeHelper from "../../../common/utility/UNodeHelper";
import { UZJHRecords } from "../../../common/base/UAllClass";
import UStringHelper from "../../../common/utility/UStringHelper";
import { ZJH_SCALE } from "../../../game/zjh/MZJH";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame";
import ULanHelper from "../../../common/utility/ULanHelper";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import { EGameType, ERoomKind } from "../../../common/base/UAllenum";
import { COIN_RATE } from "../../../config/cfg_common";
import UCommon from "../../../common/utility/UCommon";

const { ccclass, property } = cc._decorator;

/**
 * 创建：sq
 * 作用:zjh的记录item
 */

/**炸金花焖牌轮数 */
const ZJH_MENPAI_LUNSHU = [1, 1, 2, 3]
@ccclass
export default class VRecord_Item extends cc.Component {
    /**
     * 排序
     */
    private _rank: cc.Label;
    /**
     * 编号
     */
    private _bianhao: cc.Label;
    /**
     * 房间
     */
    private _room: cc.RichText;
    /**
     * 盈利
     */
    private _ylJia: cc.Label;
    private _ylJian: cc.Label;
    /**
     * 结束时间
     */
    private _overtime: cc.Label;
    /**
     * 背景节点
     */
    private _back: cc.Node;

    //data
    private _record_data: UZJHRecords;

    private _copy_btn: cc.Node;



    /**
     * 初始化
     */
    init(): void {
        this._record_data = null;

        this._rank = UNodeHelper.getComponent(this.node, "rank", cc.Label);
        this._bianhao = UNodeHelper.getComponent(this.node, "bianhao", cc.Label);
        this._room = UNodeHelper.getComponent(this.node, "room", cc.RichText);
        this._ylJia = UNodeHelper.getComponent(this.node, "yinli_jia", cc.Label);
        this._ylJian = UNodeHelper.getComponent(this.node, "yinli_jian", cc.Label);
        this._overtime = UNodeHelper.getComponent(this.node, "time", cc.Label);
        this._copy_btn = UNodeHelper.find(this.node, "bianhao/copy_btn");
        UEventHandler.addClick(this._copy_btn, this.node, "VRecord_Item", "copyNumber");


    }

    /**
     * 本Item进入ScrollView的时候回调
     */
    onEnterSrcollView() {
        this._loadAndShowPic();
        this.node.runAction(cc.scaleTo(0.27, 1))
        this.scheduleOnce(() => {
            // this.node.opacity = 255;	
            this.node.runAction(cc.fadeIn(0.27))
        }, 0.15)
    }

    /**
     * 本Item离开ScrollView的时候回调
     */
    onExitScrollView() {
        // this.node.scale = 0;
        // this.node.opacity = 0;
        this.node.runAction(cc.fadeOut(0.27))
    }

    getRoomNum(room:string){
        let a = 0;
        switch(room){
            case "体验场":
                a = 1;
                break;
            case "平民场":
                a = 2;
                break;
            case "贵族场":
                a = 3;
                break;
            case "官甲场":
                a = 4;
                break;
        }
        return a;
    }

    _loadAndShowPic() {
        let data = this._record_data;
        this.node.active = true;
        this._rank.string = data.rank.toString();
        this._bianhao.string = data.biaohao;
        this._room.string = AppGame.ins.currRoomKind == ERoomKind.Club ? UCommon.getClubRoomName(AppGame.ins.currGameId,parseInt(AppGame.ins.currGameId + "" + this.getRoomNum(data.room)),true)  : data.room;
        if (data.yinli > 0) {
            this._ylJian.node.active = false;
            this._ylJia.node.active = true;
            this._ylJia.string = "+" + UStringHelper.getMoneyFormat(data.yinli * ZJH_SCALE);
        } else {
            this._ylJian.node.active = true;
            this._ylJia.node.active = false;
            this._ylJian.string = UStringHelper.getMoneyFormat(data.yinli * ZJH_SCALE);
        }
        this._overtime.string = data.time;
    }

    private copyNumber(): void {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked(this._bianhao.string);
    }
    /**
     * 绑定数据
     * @param data 
     */
    bind(data: UZJHRecords): void {
        this._record_data = data;

    }
    reset(): void {
        this.node.active = false;
    }
}
