/**
 * 控制按钮点击间隔
 */
cc.Class({
    extends: cc.Component,
    properties: {
        // clickTime: -1,//点击时间
        clickTime:{
            default: -1,
            type: cc.Integer,
            tooltip:"点击时间"
        },
        minInterval: {
            default: 5000,
            type: cc.Integer,
            tooltip:"最小点击间隔时间"
        }
    },
    
    onLoad: function () {
        var self = this;
        function onTouchDown (event) {
            if(self.clickTime == -1) {
                self.clickTime = new Date().getTime();
            } else {
                var now = new Date().getTime();
                if(now - self.clickTime < self.minInterval){
                    //点击间隔小于预设值
                    //TODO 如何中断所绑定的函数
                    self.getComponent(cc.Button).interactable = false;
                }else{
                    self.getComponent(cc.Button).interactable = true;
                    self.clickTime = now;
                }
            }
    
        }
    
        function onTouchUp (event) {
    
        }
    
        this.node.on('touchstart', onTouchDown, this.node);
        // this.node.on('touchend', onTouchUp, this.node);
        // this.node.on('touchcancel', onTouchUp, this.node);
    },
    
    });