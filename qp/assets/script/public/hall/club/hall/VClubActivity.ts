import VWindow from "../../../../common/base/VWindow";
import { ClubHallServer } from "../../../../common/cmd/proto";
import AppGame from "../../../base/AppGame";
import MClubHall from "./MClubHall";
import VClubRewardRecordItem from "./VClubRewardRecordItem";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VClubActivity extends VWindow {

    @property(cc.ScrollView) scrollView: cc.ScrollView = null;
    @property(cc.Node) content: cc.Node = null;
    @property([cc.Toggle]) toggles: cc.Toggle[] = [];

    @property(cc.Node) noData: cc.Node = null;
    @property(cc.Node) rewardRecordContent: cc.Node = null;
    @property(cc.Prefab) rewardRecordItemPfb: cc.Prefab = null;

    private _leftIndex: number = 0;

    private _rewardRecordData: any = null;
    private _rewardRecordPageSize: number = 10;
    private _rewardRecordTotalPage: number = 1;
    private _rewardRecordPage: number = 1;

    onEnable() {
        AppGame.ins.clubHallModel.on(MClubHall.CLUB_REWARD_RECORD, this.onRewardRecord, this);
        this.noData.opacity = 0;
        this.toggles[0].isChecked = true;
        this._leftIndex = 0;
        this.showActivityContent(0);
    }

    onDisable() {
        AppGame.ins.clubHallModel.off(MClubHall.CLUB_REWARD_RECORD, this.onRewardRecord, this);
    }

    /**奖励记录 */
    onRewardRecord(data: ClubHallServer.GetClubActivityRewardMessageResponse) {
        if (data.retCode != 0 || data.rewardType != 27) {
            this.noData.opacity = 255;
            return;
        }

        this._rewardRecordTotalPage = Math.ceil(data.clubActivityRewardInfo.length / this._rewardRecordPageSize);
        if (data.clubActivityRewardInfo && data.clubActivityRewardInfo.length > 0) {
            this.noData.opacity = 0;
            this._rewardRecordData = data.clubActivityRewardInfo;
            this.addRewardRecordItem();
        } else {
            this.noData.opacity = 255;
        }
    }

    /**添加奖励记录item */
    addRewardRecordItem() {
        let len = this._rewardRecordData.length;
        len = this._rewardRecordPage < this._rewardRecordTotalPage ? this._rewardRecordPageSize : (len - (this._rewardRecordPage - 1) * this._rewardRecordPageSize);
        for (let i = 0; i < len; i++) {
            let item = cc.instantiate(this.rewardRecordItemPfb);
            let data = this._rewardRecordData[(this._rewardRecordPage - 1) * this._rewardRecordPageSize + i];
            item.getComponent(VClubRewardRecordItem).setItemData(data);
            item.parent = this.rewardRecordContent;
        }
    }

    /**滚到底部 */
    onScrollToBottom() {
        // cc.warn('onScrollToBottom page=>' + this._rewardRecordPage + '  totalPage =>' + this._rewardRecordTotalPage)
        if (this._leftIndex != 1 || this._rewardRecordPage >= this._rewardRecordTotalPage) {
            return;
        }
        this._rewardRecordPage++;
        this.addRewardRecordItem();
    }

    /**点击左侧选项 */
    onClickLeftItem(toggle: cc.Toggle, customData: string) {
        this.noData.opacity = 0;
        this._leftIndex = parseInt(customData);
        this.showActivityContent(this._leftIndex);

        //奖励记录
        if (this._leftIndex == 1) {
            this._rewardRecordData = null;
            this._rewardRecordTotalPage = 1;
            this._rewardRecordPage = 1;
            this.rewardRecordContent.destroyAllChildren();
            AppGame.ins.clubHallModel.requestRewardRecord();
        }

        this.scrollView.stopAutoScroll();
        this.scrollView.scrollToTop();
    }

    /**
     * 展示活动内容
     * @param index 下标
     */
    showActivityContent(index: number) {
        this.content.children.forEach(node => {
            node.active = false;
        });
        if (this.content.children[index]) {
            this.content.children[index].active = true;
        }
    }
}
