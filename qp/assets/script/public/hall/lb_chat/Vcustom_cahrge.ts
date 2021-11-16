import { ECommonUI } from "../../../common/base/UAllenum";
import VWindow from "../../../common/base/VWindow";
import UDebug from "../../../common/utility/UDebug";
import UEventHandler from "../../../common/utility/UEventHandler";
import UHandler from "../../../common/utility/UHandler";
import ULanHelper from "../../../common/utility/ULanHelper";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UStringHelper from "../../../common/utility/UStringHelper";
import AppGame from "../../base/AppGame";
import { UIChargeOffLineOrderItem } from "../charge/ChargeData";
import MRole from "../lobby/MRole";

const {ccclass, property} = cc._decorator;
const CHARGE_SCALE_100 = 100

@ccclass
export default class Vcustom_cahrge extends  VWindow{

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    @property(cc.SpriteFrame)
    btn_img_normal:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    btn_img_impress:cc.SpriteFrame = null;

    private _accountName:cc.EditBox = null;

    private _score:cc.EditBox = null;

    private _scores:cc.Node = null;

    private _scoreStr: string;

    private _btn_create_order: cc.Node;
    private _rechargetypeId : number;
    accountLine: cc.Node;
    scoreLine: cc.Node;

    onLoad() {
        let root = UNodeHelper.find(this.node, "root");
        // this._accountName = UNodeHelper.getComponent(root, 'ed_name', cc.EditBox);
        this._score = UNodeHelper.getComponent(root, 'ed_score', cc.EditBox);
        this._btn_create_order = UNodeHelper.find(root, "btn_create_order");
        this._scores = UNodeHelper.find(root, 'ed_score');
        let LbScores = UNodeHelper.find(root, 'LbScores');
        // this.accountLine = UNodeHelper.find(this._accountName.node, 'BACKGROUND_SPRITE1');
        this.scoreLine = UNodeHelper.find(this._score.node, 'BACKGROUND_SPRITE1');

        // this._accountName.node.on("editing-did-began",this.verifyStartInputName,this);
        // this._accountName.node.on("editing-did-ended",this.verifyStopInputName,this);
        this._score.node.on("editing-did-began",this.verifyStartInput,this);
        this._score.node.on("editing-did-ended",this.verifyStopInput,this);
        LbScores.children.forEach(element => {
            let scoreLv = element.name.substr(3);
            UEventHandler.addClick(element,this.node, "Vcustom_cahrge", "onScoreClick",scoreLv);
        });
        UEventHandler.addClick(this._btn_create_order, this.node, "Vcustom_cahrge", "createOrder");
    }

    init(): void {
        super.init();
        
    }

    onScoreClick(event: any, scoreLv: string,element:cc.Node) {
        let LbScores = UNodeHelper.find(this.node, 'root/LbScores');
        if (scoreLv && scoreLv!= "") {
            this._scoreStr = scoreLv;
            this._score.string = scoreLv;
            for(var i = 0;i < LbScores.childrenCount;i++){
                LbScores.children[i].getComponent(cc.Sprite).spriteFrame = this.btn_img_normal;
                LbScores.children[i].getChildByName("label").color = cc.color(164,116,51,255);
            }
            var node = event.target;
            var button = node.getComponent(cc.Sprite);
            button.spriteFrame = this.btn_img_impress;
            node.getChildByName("label").color = cc.color(255,255,255,255);
        }    
    }

    onCreateOrder(orderItem :UIChargeOffLineOrderItem, is: boolean ,data: any) {
        if (orderItem.accountNo) {
            AppGame.ins.closeUI(this.uiType);
            AppGame.ins.showUI(ECommonUI.UI_CUSTOM_ORDERINFO, orderItem);
        } else {
            AppGame.ins.showTips(data);
        }
        UDebug.Log("data...................................................................."+ data)
    }

    createOrder() {
        // let accountName = this._accountName.string;
        let score = this._score.string;
        this._score.string = "";
        if (score) {
            AppGame.ins.roleModel.requestCreateOffLineChargeOrder(this._rechargetypeId, parseFloat(score), false, 3); 
        } else {
            cc.error('充值參數不全');
            AppGame.ins.showTips("请输入充值金额");
        }
    }
    
    /**
  * 显示
  */
    show(data: any): void {
        super.show(data);
        this._rechargetypeId = data;
    }

    protected onEnable() {
        AppGame.ins.roleModel.on(MRole.UPDATE_OFFLINE_CREATE_ORDER, this.onCreateOrder, this);
    }

    protected onDisable(): void { 
        AppGame.ins.roleModel.off(MRole.UPDATE_OFFLINE_CREATE_ORDER, this.onCreateOrder, this);
    }
    start () {

    }

    verifyStartInput() {
        this.scoreLine.active = true;
        let LbScores = UNodeHelper.find(this.node, 'root/LbScores');
        for(var i = 0; i < LbScores.childrenCount;i++){
            LbScores.children[i].getComponent(cc.Sprite).spriteFrame = this.btn_img_normal;
            LbScores.children[i].getChildByName("label").color = cc.color(164,116,51,255);
        }
    }

    verifyStopInput() {
        if (!UStringHelper.isInt(this._score.string) || parseInt(this._score.string) <100 || parseInt(this._score.string) >30000) {
            AppGame.ins.showTips(ULanHelper.CHARGE_LIMITED);
            this._score.string = "";
        }
        this.scoreLine.active = false;
    }
}
