import { ECommonUI, EIconType, ERoomKind } from "../../common/base/UAllenum";
import UResManager from "../../common/base/UResManager";
import UDebug from "../../common/utility/UDebug";
import UHandler from "../../common/utility/UHandler";
import AppGame from "../../public/base/AppGame";
import MRole from "../../public/hall/lobby/MRole";

const {ccclass, property} = cc._decorator;
/**
 * 上庄列表Item
 */
@ccclass
export default class CommVillageItem extends cc.Component {

    @property(cc.Sprite)
    zhuangA1: cc.Sprite = null;//庄家框

    @property(cc.Node)
    lineUpLabel: cc.Node = null;//庄家排队数

    @property(cc.Sprite)
    head: cc.Sprite = null;//头像

    @property(cc.Sprite)
    headframe: cc.Sprite = null;//头像框

    @property(cc.Label)
    nameLabel: cc.Label = null;//玩家ID

    @property(cc.Label)
    goldLabel: cc.Label = null;//玩家金币

    @property(cc.Node)
    cancelButton: cc.Node = null;//取消排队按钮

    @property(cc.Node)
    nameLable: cc.Node = null;//是否是自己在庄

    @property(cc.SpriteFrame)
    btSpriteFrame: cc.SpriteFrame[] = [];//庄家框Sprite

    //当前庄家信息庄家
    systemBanker(tempBool:boolean,tempCurrent:any=null){
        this.zhuangA1.spriteFrame=this.btSpriteFrame[0];
        if(tempBool){  
            // UResManager.load(1, EIconType.Head, this.head);
            // UResManager.load(1, EIconType.Frame, this.headframe);
            // this.nameLabel.string="系统庄家";
            // this.goldLabel.string="1000000";
            // this.lineUpLabel.active=false;
            // this.cancelButton.active=false;
            // this.nameLable.active=false;
        }
        else{
            UResManager.load(tempCurrent.banker.headerId, EIconType.Head, this.head, tempCurrent.banker.headImgUrl);
            UResManager.load(tempCurrent.banker.headboxId, EIconType.Frame, this.headframe);
            this.nameLabel.string = AppGame.ins.currRoomKind == ERoomKind.Normal?tempCurrent.banker.userId:tempCurrent.banker.nickName;
            this.goldLabel.string=(tempCurrent.banker.score/100).toString();
            this.lineUpLabel.active=false;
            this.cancelButton.active=false;

            if(tempCurrent.banker.userId==AppGame.ins.roleModel.useId){//判断自己是否是庄家
                this.nameLable.active=true;
            }
            else{
                this.nameLable.active=false;
            }
        }
    }

    //庄家Item队列
    setItem(tempNum:number,lableColor:string="#FFFFFF",data: any){
        this.zhuangA1.spriteFrame = this.btSpriteFrame[tempNum];
        UResManager.load(data.headerId, EIconType.Head, this.head,data.headImgUrl);
        UResManager.load(data.headboxId, EIconType.Frame, this.headframe);
        this.nameLabel.string = AppGame.ins.currRoomKind == ERoomKind.Normal?data.userId:data.nickName;
        this.goldLabel.string = (data.score/100).toString();
        this.lineUpLabel.getComponent(cc.Label).string = tempNum.toString();
        var color = cc.Color.BLACK;
        this.lineUpLabel.color = color.fromHEX(lableColor);

        if (tempNum == 1) {
            this.lineUpLabel.setPosition(-2, 0);
        }
        else if(tempNum==0){
            this.lineUpLabel.active=false;
        }

        if(data.userId!=AppGame.ins.roleModel.useId){
            this.cancelButton.active=false;
            this.nameLabel.enableBold = false;
        }
        else{
            this.cancelButton.active=true;
            this.nameLabel.string = "我";
            this.nameLabel.enableBold = true;
            this.nameLabel.node.color=color.fromHEX("#FF0000");
            this.goldLabel.node.color=color.fromHEX("#FF0000");
        }
    }

    //取消排队
    onClickCancel(){
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 3, data: "您确定要取消排队上庄吗？", handler: UHandler.create((a) => {
                if (a) {
                    AppGame.ins.hallModel.cancelBanker(MRole.downBankerID);//取消排队
                }
            }, this)
        });
    }
}
