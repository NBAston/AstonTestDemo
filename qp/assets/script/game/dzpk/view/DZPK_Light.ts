const { ccclass, property } = cc._decorator;

@ccclass
export default class DZPK_Light extends cc.Component {

    tempAngle: number = 335;//起点
    sendAngle: number = 335;//终点
    isStart: boolean = false;//是否转动
    speedTime: number = 200;//速度

    //初始化
    initClass() {
        this.tempAngle = 335;
        this.sendAngle = 335;
        this.isStart = false;
        this.speedTime = 200;
        this.node.angle = 335;
    }

    //开始转动
    startRotation(angle: number) {
        if (angle == 335) {
            this.node.height = 280;
        }
        else {
            this.node.height = 417;
        }
        if (angle == this.tempAngle) return;
        this.speedTime = 200;

        if (this.isStart) {//是否在转动过程中
            this.isStart = false;
            this.tempAngle = angle;//起点
            this.sendAngle = angle;//终点
            this.node.angle = angle;
        }
        else {
            if (angle < this.tempAngle) {//终点小于起点
                this.isStart = true;
                this.sendAngle = angle;//设置终点
            }
            else if (angle <= this.tempAngle + 5 && angle >= this.tempAngle - 5) {
                this.isStart = false;
                this.tempAngle = angle;//起点
                this.sendAngle = angle;//终点
                this.node.angle = angle;
            }
            else {
                this.isStart = true;
                this.sendAngle = angle - 360;//终点
            }

            this.speedTime = Math.abs(this.tempAngle - this.sendAngle) + 200;//速度
        }
    }

    update(dt) {
        if (this.isStart) {
            this.tempAngle -= dt * this.speedTime;
            this.node.angle = this.tempAngle;

            if (this.tempAngle <= this.sendAngle) {
                this.isStart = false;
                this.node.angle = this.sendAngle;
                this.tempAngle = this.sendAngle;
                if (this.tempAngle <= 0) {
                    this.tempAngle = Math.abs(360 + this.tempAngle);
                    this.sendAngle = this.tempAngle;//终点
                }
            }
        }
    }
}
