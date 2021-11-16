

import VProxyItem from "./VProxyItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VProxyTutorialsItem extends VProxyItem {


    /**
     * 推广教程
     */

    init():void{
        super.init();
    }

    protected isOnafter(): void {
        super.isOnafter();
        if(this.IsOn)
        {
            super.playclick();
            this.node.children[2].color = cc.color(255,255,255,255)
        }else{
            this.node.children[2].color = cc.color(164,116,51,255)
        }
    }
}
