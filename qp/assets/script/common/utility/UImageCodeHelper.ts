

const { ccclass, property } = cc._decorator;
/**
 * 创建:jerry
 * 作用:读取base64位图片
 */
export default class UImageCodeHelper {
    
    /**
     * 
     * @param data base64位数据
     * @param imgNode 展示的图片节点
     */
    static showBase64Png(data: any, imgNode: cc.Node) {
        var self = this;
        var imgElement = new Image();
        imgElement.src = data;
        setTimeout(function () {
            var sprite2D = new cc.Texture2D();
            sprite2D.initWithElement(imgElement);
            sprite2D.handleLoadedTexture();
            var spriteFrame = new cc.SpriteFrame(sprite2D);
            var node = new cc.Node();
            var sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
            imgNode.addChild(node);
        }, 10);
    }
    

}
