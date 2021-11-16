import UDebug from "../../common/utility/UDebug";
import cfg_global from "../../config/cfg_global";
import AppGame from "../base/AppGame";
import UPlatformHelper from "../login/UPlatformHelper";

/**
 * 创建:jerry
 * 作用：消息处理中心
 */
export default class ErrorLogUtil {

    private static _ins: ErrorLogUtil;
    /**
     * 消息中心实例
     */
    static get ins(): ErrorLogUtil {
        if (!ErrorLogUtil._ins) {
            ErrorLogUtil._ins = new ErrorLogUtil();
        }
        return ErrorLogUtil._ins;
    }

    ErrorLog: Array<string> = []; // 错误日志
    



    /**
     * 添加内容到日志
     * @param _str 需要添加到日志数组的内容
     */
    addErrorLog(_str: string, logLevel?:LogLevelType): void {
        if(!_str) return
        var args:Array<string> = [];
        args.push(_str);
        var date = '版本号version:'+cfg_global.version+',时间：' + new Date().toLocaleString();
        args.push(date);
        ErrorLogUtil.ins.ErrorLog.push(args.toString());
        AppGame.ins.roleModel.requestUploadLog(logLevel?logLevel:LogLevelType.INFO, args.toString());
        if(ErrorLogUtil.ins.ErrorLog.length > 10) {
            ErrorLogUtil.ins.ErrorLog.shift();
        }
        UDebug.Log(_str);
        cc.sys.localStorage.setItem('ErrorLog', JSON.stringify(ErrorLogUtil.ins.ErrorLog));
    }

    /**
     * 报错日志监听
     */
    onErrorLog(): void {
        var ErroLog = cc.sys.localStorage.getItem('ErrorLog');
        if (ErroLog) {
            ErrorLogUtil.ins.ErrorLog = JSON.parse(ErroLog);
            //UDebug.Log('当前日志******', common.ErroLog);
        }

        if (cc.sys.isNative) {
            let __handler
            if (window['__errorHandler']) {
                __handler = window['__errorHandler']
            }
            window['__errorHandler'] = function (...args) {
                //UDebug.Log('原生报错******', args);
                if (args) {
                  var date = '时间：' + new Date().toLocaleString();
                  args.push(date);
                  ErrorLogUtil.ins.ErrorLog.push(args.toString());
                  if (ErrorLogUtil.ins.ErrorLog.length > 10) {
                    ErrorLogUtil.ins.ErrorLog.shift();
                  }
                  cc.sys.localStorage.setItem('ErrorLog', JSON.stringify(ErrorLogUtil.ins.ErrorLog));
                }
                //handleError(...args)
                if (__handler) {
                    __handler(...args)
                }
            }
        }

        if (cc.sys.isBrowser) {
            let __handler
            if (window.onerror) {
                __handler = window.onerror
            }
            window.onerror = function (...args) {
                //UDebug.Log('浏览器报错******', args)
                if (args) {
                  var date = '时间：' + new Date().toLocaleString();
                  args.push(date);
                  ErrorLogUtil.ins.ErrorLog.push(args.toString());
                  if (ErrorLogUtil.ins.ErrorLog.length > 10) { 
                    ErrorLogUtil.ins.ErrorLog.shift();
                  }
                  cc.sys.localStorage.setItem('ErrorLog', JSON.stringify(ErrorLogUtil.ins.ErrorLog));
                }
                //handleError(...args)
                if (__handler) {
                    __handler(...args)
                }
            }
        }
    }
}

/**日志内容等级 */
export enum LogLevelType {
    DEBUG = 1, // 调试
    INFO = 2, //  信息
    WARNING = 3, // 警告
    ERROR = 4, // 错误
    FATAL = 5, // 致命
    }   