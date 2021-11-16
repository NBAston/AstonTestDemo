import UStringHelper from "./UStringHelper";


const { ccclass, property } = cc._decorator;
/**
 * 创建:gj
 * 作用:节点帮助类
 */
export default class UNodeHelper {
    /**
     * 获取子节点（同一节点下面不能有重名的节点）
     * @param node 获取对象的子节点 
     * @param path 节点路径
     */
    static find(node: cc.Node, path: string): cc.Node {
        if (!node)
        return null;
        if(UStringHelper.isEmptyString(path)) 
        return node;
        var pts = path.split('/');
        var idx = 0;
        var len = pts.length;
        var tempNode = node;
        while (idx < len) {
            tempNode = tempNode.getChildByName(pts[idx]);
            if (tempNode == null) {
                break;
            }
            idx++;
        }
        return tempNode;
    }
    /**
     * 获取路径节点的组件
     * @param node 
     * @param path 
     * @param type 
     */
    static getComponent<T extends cc.Component>(node: cc.Node, path: string, type: { prototype: T }): T {
        var child = UNodeHelper.find(node, path);
        if (child) {
            //cc.log("获取路径节点的组件",type)
            var com = child.getComponent(type);
            return com;
        }
        return null;
    }

}
