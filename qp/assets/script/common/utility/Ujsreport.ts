import UDebug from "./UDebug";
import UHandler from "./UHandler";


const {ccclass, property} = cc._decorator;
/**
 * 信息上报
 * 
 */
@ccclass
export default  class Ujsreport  {
    private static reportTime = 2  //上报时间
    private static reportArr: Array<string> 
    private static reportArrCahe: Array<string> 
    static Init(timeNode:cc.Component)
    {
        console.log("启动上报日志")
        this.reportArr = new Array()
        this.reportArrCahe = new Array()
        window.onerror = function(errorMessage, scriptURI, lineNo, columnNo, error) {
            console.log("收到错误日志")
            console.log('errorMessage: ' + errorMessage); // 异常信息
            console.log('scriptURI: ' + scriptURI); // 异常文件路径
            console.log('lineNo: ' + lineNo); // 异常行号
            console.log('columnNo: ' + columnNo); // 异常列号
            console.log('error: ' + error); // 异常堆栈信息
            // ...
            // 异常上报
            let errMsg = errorMessage+"-"+scriptURI+"-"+lineNo+"-"+columnNo+"-"+error;
 
            Ujsreport.doReport(errMsg, 'jsError');
          };

          //上报测试
        //   let i = 1
        //   timeNode.schedule(()=>{
        //       i++
        //     this.addReport("测试。。。。。上报---------"+i)
        //  },2) 

         //
         this.runReport(timeNode)
    }
    /**
     * 添加上报信息
     * @param error 
     */
    private static addReport(error:string)
    {
        if(this.reportArrCahe.indexOf(error)<0)  //去掉已经上报过的
        {
            this.reportArrCahe.push(error)
            this.reportArr.push(error)
        }
        
    }
    private static runReport(timeNode:cc.Component)
    {
        timeNode.schedule(()=>{
            while(this.reportArr.length>0)
            {
               
                console.log("上报中")
                let element =  this.reportArr.shift()
                console.log(element)
                new Image().src = element;
                console.log("上报完毕")
            }
         },this.reportTime) 
         
    }
   // 上报参数配置
    private static settings = {
        reportUrl: "192.168.2.215:10000",  //上报的服务器
        reportProject: "txqp",
        reportClient: {
            device:  cc.sys.platform,
            browser: cc.sys.browserType + '@' + cc.sys.browserVersion,
            engine: cc.ENGINE_VERSION,
            os: cc.sys.os + '@' + cc.sys.osVersion,
            language: cc.sys.language
        }
    }

    
    /**
     * 暴露出的 统一上报函数
     * @param errMsg 
     * @param errType 
     */
    static doReport (errMsg, errType?) {
        //上报类型，暂时分类jsError , ajaxError, accordError(主动上报) 
        errType = errType || 'accordError'; 

        var ss = Ujsreport.settings;
        if (ss.reportUrl) {
            var src = ss.reportUrl + (ss.reportUrl.indexOf('?') > -1 ? '&' : '?') + 'errType='+ errType + '&errMsg=' + errMsg;
            for (var i in ss.reportClient) {
                if (ss.reportClient.hasOwnProperty(i)) {
                    src += '&' + i + '=' + ss.reportClient[i];
                }
            }
            
            src += ('&href=' + location.href + '&project=' + ss.reportProject + '&t=' + new Date().getTime());
            
            Ujsreport.addReport(src)
        }
    }

    
}
