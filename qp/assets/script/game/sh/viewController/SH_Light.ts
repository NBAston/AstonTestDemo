import UDebug from "../../../common/utility/UDebug";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SH_Light extends cc.Component {

    tempAngle:number=0;//起点
    sendAngle:number=0;//终点
    isStart:boolean=false;//是否转动
    speedTime:number=170;//速度

    //初始化
    initClass(){
        this.tempAngle=0;
        this.sendAngle=0;
        this.isStart=false;
        this.speedTime=170;
        this.node.angle=0;
    }

    //开始转动
    startRotation(sendAngle:number  ){
        if(sendAngle==this.tempAngle)return;
        this.speedTime = 170;
        if(this.isStart){
            this.isStart=false;
            this.tempAngle=sendAngle;//起点
            this.sendAngle=sendAngle;//终点
            this.node.angle=sendAngle;
        }
        else{
            this.isStart = true;
            
            if(sendAngle>this.tempAngle){//终点大于起点
                this.sendAngle = sendAngle;//终点
            }
            else{
                this.sendAngle = (360 - this.tempAngle) + sendAngle + this.tempAngle;//终点
            }

            this.speedTime = Math.abs(this.sendAngle - this.tempAngle) + 170;//速度
        }
    }

    update (dt) {
        if(this.isStart){
            this.tempAngle += dt*this.speedTime;
            this.node.angle=this.tempAngle;

            if(this.tempAngle>=this.sendAngle){
                this.isStart=false;
                this.node.angle=this.sendAngle;
                if (this.tempAngle >= 360) {
                    this.tempAngle=this.tempAngle-360;
                    this.sendAngle=this.tempAngle;//终点
                }
            }
        }
    }
}
