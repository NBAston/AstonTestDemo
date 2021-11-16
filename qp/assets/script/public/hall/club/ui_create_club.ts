import VWindow from "../../../common/base/VWindow";
import { ClubHallServer } from "../../../common/cmd/proto";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame";
import MClubHall from "./hall/MClubHall";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ui_create_club extends VWindow {

    @property(cc.Label)
    account: cc.Label = null;

    @property(cc.Label)
    url: cc.Label = null;

    @property(cc.Node)
    btn_confirm: cc.Node = null;

    
    @property(cc.Node)
    btn_hide: cc.Node = null;



    init(): void {
        super.init();
        UEventHandler.addClick(this.account.node,this.node,"ui_create_club","copyAccount");
        UEventHandler.addClick(this.url.node,this.node,"ui_create_club","copyUrl");
    }

    private copyAccount():void{
        AppGame.ins.showTips("复制旺旺账号成功!");
        UAPIHelper.onCopyClicked(this.account.string);
        
    }

    private copyUrl():void{
        AppGame.ins.showTips("复制旺旺下载链接成功!");
        UAPIHelper.onCopyClicked(this.url.string);
        cc.sys.openURL(this.url.string);
    }

    private clickComfirm():void{
        super.playclick();
        super.clickClose();
    }

    closeUI(){
        super.playclick();
        super.clickClose();
    }

    /**
     *  隐藏
     */
    hide(): void {
        this.node.active = false;
    }

    /**
     * 显示
     */
    show(data: any): void {
        super.show(data); 
    }

    onEnable() {
        AppGame.ins.clubHallModel.on(MClubHall.CLUB_APPLY_QQ_RES, this.setApplyQQ, this);
        this.account.string = '';
        this.url.string = "";
        AppGame.ins.clubHallModel.requestApplyQQ();
    }

    onDisable() {
        AppGame.ins.clubHallModel.off(MClubHall.CLUB_APPLY_QQ_RES, this.setApplyQQ, this);
    }

    /**设置qq */
    setApplyQQ(data: ClubHallServer.GetApplyClubInfoMessageResponse) {
        this.account.string = data.WW;
        this.url.string = data.WWURL;

    }
}
