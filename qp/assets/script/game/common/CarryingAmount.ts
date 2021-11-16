import { CarryingRoom, UZJHRoomItem } from "../../common/base/UAllClass";
import { ECommonUI, ERoomKind } from "../../common/base/UAllenum";
import VWindow from "../../common/base/VWindow";
import UDebug from "../../common/utility/UDebug";
import UEventHandler from "../../common/utility/UEventHandler";
import UHandler from "../../common/utility/UHandler";
import ULanHelper from "../../common/utility/ULanHelper";
import UStringHelper from "../../common/utility/UStringHelper";
import AppGame from "../../public/base/AppGame";
import DZPK_Model from "../dzpk/model/DZPK_Model";
import SHModel from "../sh/model/SHModel";

const { ccclass, property } = cc._decorator;
export const CarryingNum = 0.01;
@ccclass
export default class CarryingAmount extends VWindow {

    @property(cc.Node)
    slider: cc.Node = null;//滑动器

    @property(cc.Label)
    sumLabel: cc.Label = null;//总金额

    @property(cc.Label)
    handleLabel: cc.Label = null;//滑动数值

    @property(cc.Label)
    minLabel: cc.Label = null;//最小金额

    @property(cc.Label)
    maxLabel: cc.Label = null;//最大金额

    @property(cc.Toggle)
    toggle: cc.Toggle = null;//是否自动补充金额

    public static roomData: CarryingRoom=new CarryingRoom();   //当前房间信息
    public static onClickHandler: UHandler;
    public static sumGod: number = 0;               //总金额
    public static curTakeScore: number = 0;         //当前携带金币
    public static bAutoSetScore: boolean = false;   //设置自动补充金币

    curTakeScore:number=0
    isGame: number = 0;               //0、金币场、1、好友房、2、俱乐部、3、梭哈、4、德州

    isScore: number = 0;
    onLoad() {
        CarryingAmount.sumGod=AppGame.ins.roleModel.score;//总金额
        this.curTakeScore = CarryingAmount.roomData.minScore;//当前携带金币
        UEventHandler.addSliderClick(this.slider, this.node, "CarryingAmount", "sliderProgress");
    }

    //滑动器监听
    sliderProgress(caller: cc.Slider): void {
        if (caller.progress != 1) {
            let num = caller.progress * this.isScore + CarryingAmount.roomData.minScore;
            this.curTakeScore = Math.floor(num * CarryingNum) * 100;//当前携带金币
            this.handleLabel.string = Math.floor(this.curTakeScore * CarryingNum).toFixed();//当前携带金币
        }
        else {
            let tempSumGod=0;//临时总金额
            if (this.isGame == 3 || (this.isGame == 4)) {//3、梭哈、4、德州内打开补充筹码
                tempSumGod=CarryingAmount.sumGod;
            }
            else {
                tempSumGod=AppGame.ins.roleModel.score;
            }

            let tempMax=0;
            if(tempSumGod>=CarryingAmount.roomData.maxScore){
                tempMax=CarryingAmount.roomData.maxScore;
            }
            else{
                tempMax=tempSumGod;
            }
            this.curTakeScore = Math.floor(tempMax* CarryingNum)* 100;//当前携带金币
            this.handleLabel.string = Math.floor(this.curTakeScore * CarryingNum).toFixed();//当前携带金币
        }
    }

    //显示UI界面
    show(data: number) {
        super.show(data);
        this.isGame=data;//0、金币场、1、好友房、2、俱乐部、3、梭哈、4、德州

        let tempSumGod=0;//临时总金额
        let tempBool=false;//是否自动补充
        let tempHandle=0;//滑动数值

        if (this.isGame == 3 || (this.isGame == 4)) {//3、梭哈、4、德州内打开补充筹码
            tempSumGod=CarryingAmount.sumGod;
            tempBool=CarryingAmount.bAutoSetScore;
            tempHandle=CarryingAmount.curTakeScore;
        }
        else {
            tempSumGod=AppGame.ins.roleModel.score;
            tempBool=false;
            tempHandle=CarryingAmount.roomData.minScore;//滑动数值
            this.curTakeScore = CarryingAmount.roomData.minScore;//当前携带金币
        }

        //最高携带判断
        if(CarryingAmount.roomData.maxScore!=-1){//有最高限制
            this.maxLabel.string = (CarryingAmount.roomData.maxScore * CarryingNum).toFixed();//最高金额
            if(tempSumGod>=CarryingAmount.roomData.maxScore){
                this.isScore = CarryingAmount.roomData.maxScore - CarryingAmount.roomData.minScore;
            }
            else{
                this.isScore = tempSumGod - CarryingAmount.roomData.minScore;
            }
        }
        else{//没有最大限制
            this.maxLabel.string = Math.floor(tempSumGod * CarryingNum).toFixed();//最高金额
            this.isScore = tempSumGod - CarryingAmount.roomData.minScore;
        }
        
        this.sumLabel.string = UStringHelper.getMoneyFormat((tempSumGod * CarryingNum)).toString();//总金额
        this.minLabel.string = (CarryingAmount.roomData.minScore * CarryingNum).toFixed();//最小金额
        this.toggle.isChecked=tempBool;//是否自动补充
        if (tempHandle >= tempSumGod) {
            this.handleLabel.string = Math.floor(tempSumGod * CarryingNum).toFixed();//滑动数值
            this.curTakeScore = Math.floor(tempSumGod * CarryingNum) * 100;
            let tempProgress = (tempSumGod - CarryingAmount.roomData.minScore) / this.isScore;
            if (tempProgress > 1) {
                tempProgress = 1;
            }
            this.slider.getComponent(cc.Slider).progress = tempProgress;
        }
        else {
            this.handleLabel.string = Math.floor(tempHandle * CarryingNum).toFixed();//滑动数值
            this.curTakeScore = Math.floor(tempHandle * CarryingNum) * 100;
            let tempProgress = (tempHandle - CarryingAmount.roomData.minScore) / this.isScore;
            if (tempProgress > 1) {
                tempProgress = 1;
            }
            this.slider.getComponent(cc.Slider).progress = tempProgress;
        }
    }

    //点击是否自动补充
    clickToggle(e: cc.Toggle) {
        CarryingAmount.bAutoSetScore = e.isChecked;
    }

    //点击确定
    clickConfirm() {
        CarryingAmount.curTakeScore=Math.floor(this.curTakeScore* CarryingNum)* 100;
        if(CarryingAmount.curTakeScore>CarryingAmount.roomData.maxScore&&CarryingAmount.roomData.maxScore!=-1){
            AppGame.ins.showUI(ECommonUI.NewMsgBox, { type: 1, data: ULanHelper.ENTERROOM_ERROR[8] });
        }
        else{
            switch (this.isGame) {
                case ERoomKind.Normal:
                    CarryingAmount.onClickHandler.runWith(CarryingAmount.roomData.type);
                    break;
                case ERoomKind.Friend:
                    UDebug.error("好友房");
                    break;
                case ERoomKind.Club:
                    AppGame.ins.roomModel.requestEnterRoom(CarryingAmount.roomData.type, CarryingAmount.roomData.gameId, false, ERoomKind.Club, CarryingAmount.roomData.clubId, CarryingAmount.roomData.tableId);
                    break;
                case 3:
                    SHModel.ins.onCarryingAmount(CarryingAmount.curTakeScore,CarryingAmount.bAutoSetScore);
                    break;
                case 4:
                    DZPK_Model.ins.onCarryingAmount(CarryingAmount.curTakeScore,CarryingAmount.bAutoSetScore);
                    break;
            }
            AppGame.ins.closeUI(ECommonUI.UI_CARRYING);
        }
    }
}
