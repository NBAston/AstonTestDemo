import AppGame from "../../../base/AppGame";
import UResManager from "../../../../common/base/UResManager";
import {ECommonUI, EGameType, EIconType} from "../../../../common/base/UAllenum";
import UQRCode from "../../../../common/utility/UQRCode";
import {UAPIHelper} from "../../../../common/utility/UAPIHelper";
import VWindow from "../../../../common/base/VWindow";
import UHandler from "../../../../common/utility/UHandler";
import UStringHelper from "../../../../common/utility/UStringHelper";

const {ccclass, property} = cc._decorator;
/**
 * 公共好友房 分享/邀请 核心
 * **/
@ccclass
export default class ui_shared_hy extends VWindow {

    roomId:number = -1;
    /**
     * 初始化 UI创建的时候调用
     */
    init(): void {
        super.init();
    }

    onDisable() {
        window["isOpenWechat"] = false;
    }

    /**显示的动画 */
    protected closeAnimation(completHandler?: UHandler): void {
        if (completHandler) completHandler.run();
    }

    /**显示的动画 */
    protected showAnimation(completHandler?: UHandler): void {
        if (completHandler) completHandler.run();
    }

    getHeadIdForHeadBoxId(userId: number) {
        let headBoxId = 1;
        for (let key in AppGame.ins.ddzModel_hy.gBattlePlayer){
            if(AppGame.ins.ddzModel_hy.gBattlePlayer[key].userId == userId){
                headBoxId = AppGame.ins.ddzModel_hy.gBattlePlayer[key].headboxId;
                break;
            }
        }
        return headBoxId;
    }
    /***
     * 邀请初始化
     * @param data.eGameType 游戏 id EGameType.xxx
     * @param data.roomInfo 房间信息 必须包含 roomId 、 roomUserId 、 allRound、currentRound 、ceilScore 键值对
     * **/
    show(data: any): void {
        super.show(data);
        this.roomId  = data.roomInfo.roomId;
        let root     = this.node.getChildByName("root");
        root.active  = true;
        let icon     = root.getChildByName("icon");
        let titleSpr = root.getChildByName("title").getComponent(cc.Sprite);

        UResManager.loadUrl(`common/hall/texture/friends/share/title${data.eGameType}`, titleSpr);
        UResManager.load(data.headId, EIconType.Head, icon.getComponent(cc.Sprite));

        let qrCode = root.getChildByName("qrnode");
        let str = `${AppGame.ins.roleModel.spreadUrl}?roomid=${data.roomInfo.roomId}`;
        qrCode.getComponent(UQRCode).make(str);

        let roomTitleLab = root.getChildByName("roomTitleLab").getComponent(cc.Label);
        roomTitleLab.string = `${data.roomInfo.roomUserId}的牌局`;

        let roomLab = root.getChildByName("roomLab").getComponent(cc.Label);
        roomLab.string = `${data.roomInfo.roomId}`;

        let descRoundLab = root.getChildByName("descLabel2").getComponent(cc.Label);
        descRoundLab.string = data.roomInfo.allRound <= 0 ? "时长:" : "局数:";

        let roundLab = root.getChildByName("roundLab").getComponent(cc.Label);
        let m = data.roomInfo.allSeconds/60;
        let h = data.roomInfo.allSeconds/60/60;
        let strM = m < 60 ? `${m}分钟` : `${h}小时` ;

        roundLab.string =  data.roomInfo.allRound <= 0 ? strM : `${data.roomInfo.allRound}`;

        let descLab = root.getChildByName("descLab").getComponent(cc.Label);
        descLab.string = `${UStringHelper.getMoneyFormat2(data.roomInfo.floorScore/100)}`;

        let presLab = root.getChildByName("presionLab").getComponent(cc.Label);
        switch (data.eGameType){
            case EGameType.DDZ_HY :
            case EGameType.PDK_HY :
                presLab.string = `3`;
                break;
            case EGameType.TBNN_HY :
            case EGameType.KPQZNN_HY :
                presLab.string = `4`;
                break;
            case EGameType.ZJH_HY :
                presLab.string = `5`;
                break;
        }
        //打开特效用完后再保存
        this.scheduleOnce(()=>{
            if(this.node != null){
                let picName = "RoomId_"+this.roomId;
                UAPIHelper.savePhoto2(this.node, picName,true,(a)=>{
                    AppGame.ins.closeUI(ECommonUI.UI_SHARED_HY)
                });
            }
        },0.5);
    }
    closeUI(){
        AppGame.ins.closeUI(ECommonUI.UI_SHARED_HY);
    }
    /**
     *  隐藏
     */
    hide(): void {
        this.node.active = false;
    }
}
