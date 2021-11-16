
/**
 * 创建:sq
 * 作用:游戏全屏模式
 */
export default class UFullScreen {

    /**
     * 全屏
     * 返回 是否全屏成功
     * 注：有些浏览器可能有
     */
    static fullScreen(): boolean {

        var el: any = document.documentElement;
        var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (typeof rfs != "undefined" && rfs) {
            rfs.call(el);
            cc.game.emit("fullscreen", true);
            return true;
        };
        /**IE */
        // if (cc.sys.isBrowser) {
        //     let win: any = window;
        //     if (win.ActiveXObject !== "undefined") {
        //         var wscript = new win.ActiveXObject("WScript.Shell");
        //         if (wscript !== null) {
        //             wscript.SendKeys("{F11}");
        //         }
        //     }
        // }
        return false;
    }
    //退出全屏
    static exitScreen(): void {
        if (!UFullScreen.isFullScreen()) return;
        let doc: any = document;
        var exitMethod = doc.exitFullscreen || //W3C
            doc.mozCancelFullScreen || //FireFox
            doc.webkitExitFullscreen || //Chrome等PUGBa
            doc.webkitExitFullscreen; //IE11
        if (exitMethod) {
            exitMethod.call(document);
            cc.game.emit("fullscreen", false);
        } else {
            /**IE */
            // if (cc.sys.isBrowser) {
            //     let win: any = window;
            //     if (win.ActiveXObject !== "undefined") {
            //         var wscript = new win.ActiveXObject("WScript.Shell");
            //         if (wscript !== null) {
            //             wscript.SendKeys("{F11}");
            //         }
            //     }
            // }
        }
    }
    /**
     * 是否处于全屏状态
     */
    static isFullScreen(): boolean {
        let doc: any = document;
        return doc.isFullScreen || doc.mozIsFullScreen || doc.webkitIsFullScreen || doc.fullScreen;
    }
}
