
const { ccclass, property } = cc._decorator;

@ccclass
export default class VActivityItem extends cc.Component {

    @property(cc.Integer)
    type: number = 0;
    init(): void {

    }
    bind(data: any): void {
        this.show();
    }
    show():void{
        this.node.active=true;
    }
    hide():void{
        this.node.active=false;
    }
}
