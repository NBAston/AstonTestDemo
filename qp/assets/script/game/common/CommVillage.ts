import { ECommonUI } from "../../common/base/UAllenum";
import VWindow from "../../common/base/VWindow";
import UDebug from "../../common/utility/UDebug";
import UHandler from "../../common/utility/UHandler";
import AppGame from "../../public/base/AppGame";
import MRole from "../../public/hall/lobby/MRole";
import MBrlh from "../brlh/model/MBrlh";
import CommVillageItem from "./CommVillageItem";

const { ccclass, property } = cc._decorator;
/**
 * 上庄列表
 */
@ccclass
export default class CommVillage extends VWindow {

    @property(cc.Label)
    bgLabel_1: cc.Label = null;//上庄需要金币

    @property(cc.Label)
    bgLabel_2: cc.Label = null;//上庄期间低于金币

    @property(cc.Label)
    bgLabel_3: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;//父节点

    @property(CommVillageItem)
    systrmUI: CommVillageItem = null;

    @property(cc.Node)
    item: cc.Node = null;//预制体

    @property(cc.Button)
    villageButton: cc.Button = null;

    private static _ins: CommVillage;
    static get ins(): CommVillage {
        return CommVillage._ins;
    }

    colorArray = ["#DBC880", "#DEC39C", "#D4B59F", "#CED5DD", "#CAD7D3"];

    onLoad() {
        CommVillage._ins = this;
    }

    start() {
        this.setBankInfo();
    }

    setBankInfo() {
        if (AppGame.ins.bankerInfo) {
            this.bgLabel_1.string = "2.上庄至少需要" + AppGame.ins.bankerInfo.applyBankerCondition / 100 + "。";
            this.bgLabel_2.string = "3.上庄期间,低于" + AppGame.ins.bankerInfo.bankerMinScore / 100 + "金币,自动提前下庄。";
            this.bgLabel_3.string = "4.排队期间，若身上携带金额低于" + AppGame.ins.bankerInfo.applyBankerCondition / 100 + ",自动脱离队列。";
        }
    }

    protected onEnable(): void {
        this.instantiateBanker();//生成庄家排队Item
        this.setBankInfo();
    }

    //生成庄家排队Item
    instantiateBanker() {
        if (AppGame.ins.bankerInfo != null) {
            if (AppGame.ins.bankerInfo.currentBankerInfo == null) {//系统庄家
                // this.systrmUI.systemBanker(true);
            }
            else {//玩家庄家
                this.systrmUI.systemBanker(false, AppGame.ins.bankerInfo.currentBankerInfo);
            }
        }
        this.instPrefab();
    }

    /**
     * 更新排队信息
     */
    updateInfo() {
        this.thisBanker();
        this.instPrefab();
    }

    /**
     * 申请庄家成功
     */
    bankerSucceed() {
        this.thisBanker();
        this.instPrefab();
    }

    /**
     * 申请庄家失败
     */
    bankerFail() {

    }

    /**
     * 取消排队失败
     */
    cancelSucceed() {
        this.thisBanker();
        this.instPrefab();
    }

    /**
     * 取消排队失败
     */
    cancelFail() {

    }

    /**
     * 申请下庄成功
     */
    downBankerSucceed() {

    }

    /**
     * 申请下庄失败
     */
    downBankerFail() {

    }

    /**
     * 切换庄家
     */
    changeBanke() {
        this.thisBanker();
        this.instPrefab();
    }

    /**
     * 当前庄家
     */
    thisBanker() {
        if (AppGame.ins.bankerBurrent == null) {//系统庄家
            // this.systrmUI.systemBanker(true);
        }
        else {//玩家庄家
            this.systrmUI.systemBanker(false, AppGame.ins.bankerBurrent);
        }
    }

    /**
     * 生成队列
     */
    instPrefab() {
        this.content.removeAllChildren();//清理子节点
        for (let i = 0; i < AppGame.ins.bankerApply.length; i++) {
            let tempNode = cc.instantiate(this.item);
            tempNode.active = true;
            this.content.addChild(tempNode);
            tempNode.setPosition(0, 0);
            let tempTs = tempNode.getComponent(CommVillageItem);

            let colorStr = "#FFFFFF";
            if (i < 6 && i > 0) {
                colorStr = this.colorArray[i - 1];
            }
            tempTs.setItem(i + 1, colorStr, AppGame.ins.bankerApply[i]);
        }
    }

    /**
     * 我要上庄
     */
    OnTheVillage() {
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 3, data: "您确定要上庄吗？", handler: UHandler.create((a) => {
                if (a) {
                    AppGame.ins.hallModel.sendBanker(MRole.bankerID);//申请上庄
                }
            }, this)
        });
    }
}
