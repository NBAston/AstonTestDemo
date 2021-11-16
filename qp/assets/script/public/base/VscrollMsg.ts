import { NEWS } from "../hall/lobby/MHall";
import AppGame from "./AppGame";

const { ccclass, property } = cc._decorator;
 
enum Direction {
    LEFT_TO_RIGHT = 2,
    RIGHT_TO_LEFT,
}
 
@ccclass
export default class VscrollMsg extends cc.Component {
 
    @property(cc.RichText)
    label: cc.RichText = null;
 
    @property(cc.Mask)
    maskNode: cc.Mask = null;
 
    @property({
        tooltip:"每秒移动多少像素",
    })
    m_speed: number = 50;
 
    m_xLeftEnd: number = 0;
    m_xRightEnd: number = 0;
 
    m_yPos: number = 0;
 
    @property({
        tooltip:"文字滚动的方向，1是从左到右，2是从右到左",
    })
    m_direction: number = Direction.RIGHT_TO_LEFT;
 
 
 
    start() {
        
        this.m_xRightEnd = this.node.x + this.maskNode.node.width * this.maskNode.node.anchorX;
        this.m_xLeftEnd = -this.m_xRightEnd;
 
        let contentSize = this.label.node.getContentSize();
        
        let xPos:number = 0;
        if(this.m_direction === Direction.LEFT_TO_RIGHT){
            xPos = this.m_xLeftEnd - contentSize.width;
        }else{
            xPos = this.m_xRightEnd;
        }
 
        this.label.node.x = xPos;
        this.label.node.y = this.m_yPos;
    }
 
    update(a:any) {
        if (this.m_direction === Direction.LEFT_TO_RIGHT) {
            let contentSize = this.label.node.getContentSize();
            if (this.label.node.x >= this.m_xRightEnd) { 
                this.label.node.x = this.m_xLeftEnd - contentSize.width;
            }
            this.label.node.x += this.m_speed * a;
            
        }else{
            let contentSize = this.label.node.getContentSize();
            if (this.label.node.x <= this.m_xLeftEnd - contentSize.width - 40) { 
                NEWS.splice(0,1);
                this.label.node.x = this.m_xRightEnd + 20;
                if(NEWS.length > 1){
                    this.node.active = true;
                }else{
                    this.node.active = false;
                }


            }
            this.label.node.x -= this.m_speed * a;
        }
    }
}
