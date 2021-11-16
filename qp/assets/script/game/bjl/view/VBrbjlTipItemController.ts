
import UDebug from "../../../common/utility/UDebug";
import BJLConstants from "../BJLConstants";

const { ccclass, property } = cc._decorator;
@ccclass
export default class VBrbjlTipItemController extends cc.Component {
    @property(cc.Label)
    Lab: cc.Label = null;
    @property(cc.Node)
    Tip:cc.Node = null
    @property(cc.Node)
    He_1:cc.Node = null
    m_CountNum:number = 0;
  
    onLoad() {
        this.m_CountNum = 0
    }

    setHe(){
        this.m_CountNum++
        if(this.m_CountNum != 1) {
            this.He_1.active = false;
            this.Lab.string = this.m_CountNum+"";
        } else {
            this.He_1.active = true;
        }
        
    }

    setFrameZhulu(_string){
        this.Tip.active = true;
        if(_string[1] == 1){
            this.Tip.getComponent('MagicSprite').index = 3
        }
        else if(_string[1] == 2){
            this.Tip.getComponent('MagicSprite').index = 1
        }
        else{
            this.Tip.getComponent('MagicSprite').index = 2
        }
    }

    setFrameDalu(flag ,isblink){
        this.Tip.active = true
        // UDebug.log("--------------设置大路路单--flag"+flag);
        switch(flag){
            //判断大路xian
            case BJLConstants.DaLu.xian:
            {
                this.Tip.getComponent('MagicSprite').index = 0
                break
            }

            //判断大路zhuang
            case BJLConstants.DaLu.zhuang:
            {
                this.Tip.getComponent('MagicSprite').index = 1
                break
            }

            //判断大路平
            case BJLConstants.DaLu.he:
            {
                this.Tip.getComponent('MagicSprite').index = 2
                break
            }
        }
        if(isblink) {
            this.Tip.runAction(cc.blink(3, 6));
        }
    }
   
}
