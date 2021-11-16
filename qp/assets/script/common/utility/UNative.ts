/**
* 创建:LiJun
* 作用:原生层接口
*/
var UNative = {

    /**获取原生层存储的API */
    getNativeApi(apiName: string): string {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', apiName, '()Ljava/lang/String;');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('ShqpController', 'apiName');
        }
    },

    /**退出游戏 */
    ExitGame(): void {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('org/cocos2dx/lib/Cocos2dxHelper', 'terminateProcess', '()V');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('ShqpController', 'stop');
        }
    },

}
export default UNative;