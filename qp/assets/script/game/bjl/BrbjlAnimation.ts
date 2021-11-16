
const { ccclass, property } = cc._decorator;


export default class BrbjlAnimation {

    /**
     * 结算
     * @param chip 筹码节点
     * @param pos 目标位置
     * @param funcBack 完成回调
     */
    static moveChip(chip: cc.Node, pos: cc.Vec2, funcBack: Function) {
        // var chip_pos =  chip.getPosition();
        var delt_time = 0.4;
        var pos1 = pos;
        var pos2 = chip.getPosition();
        // UDebug.Log('x=' + pos2.x + '   y=' + pos2.y);
        
        var anit_x = (pos2.x - pos1.x) / 15;
        var anit_y = (pos2.y - pos1.y) / 15;

        let del_time = Math.random()*0.15;

        chip.stopAllActions();
        chip.runAction(cc.sequence(cc.delayTime(del_time),cc.moveBy(delt_time * 0.5, anit_x, anit_y), cc.moveTo(delt_time, pos).easing(cc.easeQuadraticActionOut()),
            cc.delayTime(del_time),
            cc.callFunc(funcBack)));
    }


    /**
     * 玩家下注移动筹码
     * @param chip 筹码节点
     * @param stop_pos 停止位置
     * @param funcBack 完成回调
     * @param dt_time 延时发射时间
     */
    static betMove(chip: cc.Node, stop_pos: cc.Vec2, funcBack: Function,  dt_time:number = 0) {
        var act_time = 0.2;
        // chip.opacity = 200;

        var disc_scale = 0.5;

        var rote = 360;//Math.random() * 150 + 150;
        chip.scale = disc_scale * 0.9;
        chip.opacity = 0;
        var seq = cc.sequence(cc.delayTime(dt_time),cc.fadeTo(0.002 , 200),
            // cc.spawn(cc.moveTo(act_time, stop_pos).easing(cc.easeExponentialOut()),
            cc.spawn(cc.moveTo(act_time, stop_pos).easing(cc.easeQuadraticActionOut()),
                cc.fadeIn(act_time / 1.5),
                cc.rotateBy(act_time*1.5, rote),
                cc.scaleTo(act_time, disc_scale * 1.1)),
            cc.scaleTo(0.2, disc_scale),
            cc.callFunc(funcBack));

        chip.stopAllActions();
        chip.runAction(seq);

        // var seq = cc.sequence(cc.delayTime(dt_time),
        //     cc.spawn(cc.moveTo(act_time, stop_pos).easing(cc.easeQuadraticActionOut()),
        //         cc.fadeIn(act_time / 1.5),
        //         cc.rotateBy(act_time*1.1, rote),
        //         cc.scaleTo(act_time*1.1, disc_scale * 1.1)),
        //     cc.scaleTo(0.2, disc_scale),
        //     cc.callFunc(funcBack));
        // chip.stopAllActions();
        // chip.runAction(seq);
    }

/**
     * 玩家下注移动筹码
     * @param chip 筹码节点
     * @param stop_pos 停止位置
     * @param funcBack 完成回调
     * @param notwait 是否延时发射
     * @param dt_time 延时发射时间
     */
    static bankerChipMove(chip: cc.Node, stop_pos: cc.Vec2, funcBack: Function, dt_time:number = 1.0) {
        var act_time = 0.6;
        chip.opacity = 200;

        var disc_scale = 0.5;

        dt_time = Math.random() * dt_time;

        var rote = 360//Math.random() * 180;

        chip.scale = disc_scale;

        var seq = cc.sequence(cc.delayTime(dt_time),
            cc.spawn(cc.moveTo(act_time, stop_pos).easing(cc.easeQuadraticActionOut()),
                cc.fadeIn(act_time / 1.5),
                cc.rotateBy(act_time*1.1, rote),
                cc.scaleTo(act_time*1.1, disc_scale * 1.1)),
            cc.scaleTo(0.2, disc_scale),
            cc.callFunc(funcBack));
        chip.stopAllActions();
        chip.runAction(seq);
    }

   

    /**
     * 上下抖动一个节点
     * @param node  
     * @param times 抖动次数
     * @param landscape 是否横向抖动，  否： 上下抖动
     */
    static shakeNode(node: cc.Node , times: number = 5 , landscape: boolean = false) {
    
        const const_x = node['const_pos_x'] || node.x;
        const const_y = node['const_pos_y'] || node.y;

        node['const_pos_x'] = node['const_pos_x'] || node.x;
        node['const_pos_y'] = node['const_pos_y'] || node.y;
        var marginx = 10;
        var marginy = 10;

        if (landscape) {
            marginy = 0;
        }else {
            marginx = 0;
        }


        if (node['isShakeing']) { return ;}
        node.stopAllActions();
        node['isShakeing'] = true;

        node.scale = 1;

        var cccall = cc.callFunc((node)=>{
                                    node['isShakeing'] = false;
                                },this) 

        node.runAction( cc.sequence(
                                cc.repeat( cc.sequence( cc.moveTo(0.05,const_x + marginx , const_y + marginy),
                                    cc.moveTo(0.05,const_x  - marginx , const_y - marginy),
                                    cc.moveTo(0.05,const_x , const_y)) ,times), cccall));
    }


    /**
     * 创建一个贝塞尔弧线
     * @param t 
     * @param startPoint 
     * @param endPoint 
     * @param height 
     * @param angle 
     */
    static createParabolaTo(t: number, startPoint: any, endPoint: any, height: number = 0, angle: number = 60) {

        // 把角度转换为弧度
        var radian = angle * 3.14159 / 180.0;
        // 第一个控制点为抛物线左半弧的中点
        var q1x = startPoint.x + (endPoint.x - startPoint.x) / 4.0;
        var q1 = new cc.Vec2(q1x, height + startPoint.y + Math.cos(radian) * q1x);
        // 第二个控制点为整个抛物线的中点
        var q2x = startPoint.x + (endPoint.x - startPoint.x) / 2.0;
        var q2 = new cc.Vec2(q2x, height + startPoint.y + Math.cos(radian) * q2x);

        //曲线配置
        var cfg: cc.Vec2[] = [];
        cfg[0] = q1;
        cfg[1] = q2;
        cfg[2] = endPoint;

        return cc.bezierTo(t, cfg);
    }
    
}
