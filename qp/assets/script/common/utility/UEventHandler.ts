


/**
 * 创建:gj
 * 作用:给节点各种事件
 */
export default class UEventHandler {
    /**
     * 添加Click事件
     * @param node 
     * @param targetNode 
     * @param com 
     * @param handler 
     * @param args 
     */
    static addClick(node: cc.Node, targetNode: cc.Node, com: string, handler: string, args?: any) {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = targetNode; //这个 node 节点是你的事件处理代码组件所属的节点，这里就是Button2
        clickEventHandler.component = com;//这个是脚本文件名
        clickEventHandler.handler = handler; //回调函名称
        clickEventHandler.customEventData = args; //用户数据

        var button = node.getComponent(cc.Button); //获取cc.Button组件
        button.clickEvents.push(clickEventHandler); //增加处理
    }
    /**
     * 给slider添加事件
     * @param node 
     * @param targetNode 
     * @param com 
     * @param handler 
     * @param args 
     */
    static addSliderClick(node: cc.Node, targetNode: cc.Node, com: string, handler: string, args?: any) {

        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = targetNode; //这个 node 节点是你的事件处理代码组件所属的节点，这里就是Button2
        clickEventHandler.component = com;//这个是脚本文件名
        clickEventHandler.handler = handler; //回调函名称
        clickEventHandler.customEventData = args; //用户数据

        var button = node.getComponent(cc.Slider); //获取cc.Button组件
        button.slideEvents.push(clickEventHandler); //增加处理
    }
    static addToggle(node: cc.Node, targetNode: cc.Node, com: string, handler: string, args?: any) {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = targetNode; //这个 node 节点是你的事件处理代码组件所属的节点，这里就是Button2
        clickEventHandler.component = com;//这个是脚本文件名
        clickEventHandler.handler = handler; //回调函名称
        clickEventHandler.customEventData = args; //用户数据

        var button = node.getComponent(cc.Toggle); //获取cc.Button组件
        button.checkEvents.push(clickEventHandler); //增加处理
    }
    static addToggleContainer(node: cc.Node, targetNode: cc.Node, com: string, handler: string, args?: any) {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = targetNode; //这个 node 节点是你的事件处理代码组件所属的节点，这里就是Button2
        clickEventHandler.component = com;//这个是脚本文件名
        clickEventHandler.handler = handler; //回调函名称
        clickEventHandler.customEventData = args; //用户数据

        var button = node.getComponent(cc.ToggleContainer); //获取cc.Button组件
        button.checkEvents.push(clickEventHandler); //增加处理
    }
    static addScrollView(node: cc.Node, targetNode: cc.Node, com: string, handler: string, args?: any) {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = targetNode; //这个 node 节点是你的事件处理代码组件所属的节点，这里就是Button2
        clickEventHandler.component = com;//这个是脚本文件名
        clickEventHandler.handler = handler; //回调函名称
        clickEventHandler.customEventData = args; //用户数据

        var button = node.getComponent(cc.ScrollView); //获取cc.Button组件
        button.scrollEvents.push(clickEventHandler); //增加处理
    }
    static addpageEvents(node: cc.Node, targetNode: cc.Node, com: string, handler: string, args?: any) {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = targetNode; //这个 node 节点是你的事件处理代码组件所属的节点，这里就是Button2
        clickEventHandler.component = com;//这个是脚本文件名
        clickEventHandler.handler = handler; //回调函名称
        clickEventHandler.customEventData = args; //用户数据

        var button = node.getComponent(cc.PageView); //获取cc.Button组件
        button.pageEvents.push(clickEventHandler); //增加处理
    }

    
    static editingDidEnded(node: cc.Node, targetNode: cc.Node, com: string, handler: string, args?: any) {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = targetNode; //这个 node 节点是你的事件处理代码组件所属的节点，这里就是Button2
        clickEventHandler.component = com;//这个是脚本文件名
        clickEventHandler.handler = handler; //回调函名称
        clickEventHandler.customEventData = args; //用户数据

        var button = node.getComponent(cc.EditBox); //获取cc.Button组件
        button.editingDidEnded.push(clickEventHandler); //增加处理
    }
}
