import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";
import UAudioManager from "../../common/base/UAudioManager";
import AppGame from "../../public/base/AppGame";
import ULocalDB from "../../common/utility/ULocalStorage";

export default class VFyxbdNode {

    private _btn_iknow: cc.Node;
    private _bg: cc.Node;

    private _tag:string = "";

    constructor(root: cc.Node,gameTag:string) {
        this._bg = UNodeHelper.find(root, "bg_board4");
        this._btn_iknow = UNodeHelper.find(this._bg, "btn_know");

        this._tag = gameTag;

        UEventListener.get(this._btn_iknow).onClick = new UHandler(this.on_iknow, this);
        
        this._bg.active = false; 
    }

    show(isAction:boolean = true) {
        this._bg.active = true;
        if(isAction){
             
            this._bg.stopAllActions();

            // let act = cc.sequence(cc.scaleTo(0.2,1),cc.callFunc(()=>{
                    
            //     }
            // ));
            let act = cc.scaleTo(0.2,1);
            this._bg.runAction(act);
        }
    }

    hide(isAction:boolean = true) {
        if(isAction){
            this._bg.stopAllActions();

            let act = cc.sequence(cc.scaleTo(0.2,0),cc.callFunc(()=>{
                    this._bg.active = false; 
                }
            ));

            this._bg.runAction(act);
        }
        else{
            this._bg.active = false;
        }
        
    }

    /**
     * 我知道了
     */
    private on_iknow(): void {
        UAudioManager.ins.playSound("audio_click");
        
        switch(this._tag){
            case "sg":{
                // AppGame.ins.sgModel.isseen_fyxbd = true;
                ULocalDB.SaveDB("sgfyxbd", true);

            }
            break;
            case "kpqznn":{
                // AppGame.ins.qznnModel.isseen_fyxbd = true;

                ULocalDB.SaveDB("kpqznnfyxbd", true);
            }
            break;
            case "xpqznn": {
                ULocalDB.SaveDB("xpqznnfyxbd", true);
            }
            break;
        }
        
        this.hide();

    }
}
