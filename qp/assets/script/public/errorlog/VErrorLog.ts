import VWindow from "../../common/base/VWindow";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import ULanHelper from "../../common/utility/ULanHelper";
import AppGame from "../base/AppGame";
import ErrorLogUtil from "./ErrorLogUtil";


const { ccclass, property } = cc._decorator;

@ccclass
export default class ErrorLogNode extends VWindow { 
    @property(cc.Label)
    errorLogLab: cc.Label = null;
    @property(cc.Node)
    closeNode: cc.Node = null;
    @property(cc.Node)
    copyNode: cc.Node = null;
    init(): void {
        super.init();
        this.closeNode.on(cc.Node.EventType.TOUCH_END, function () {
            this.closeErrorLog();
        }.bind(this));
 
        this.copyNode.on(cc.Node.EventType.TOUCH_END, function () {
            this.copyErrorLog();
        }.bind(this));
    }

    show(data: any): void { 
        super.show(data);
        this.errorLogLab.string = '';
        if (ErrorLogUtil.ins.ErrorLog.length < 1) {
            this.errorLogLab.string = this.errorLogLab.string + '\n\n无错误日志';
        } else {
            for (let i = ErrorLogUtil.ins.ErrorLog.length - 1; i >= 0; i--) {
                var logData = ErrorLogUtil.ins.ErrorLog[i];
                this.errorLogLab.string = this.errorLogLab.string + '\n\n' + JSON.stringify(logData);
            }
        }
    }

    closeErrorLog() {
        AppGame.ins.closeUI(this.uiType);
     }
  
     copyErrorLog() {
         AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
         UAPIHelper.onCopyClicked(this.errorLogLab.string);
     }
    
}
