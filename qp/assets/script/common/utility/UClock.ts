import AppGame from "../../public/base/AppGame";
import MBaseGameModel from "../../public/hall/MBaseGameModel";
import { EAppStatus } from "../base/UAllenum";

const { ccclass, property } = cc._decorator;
@ccclass
export default class UClock  {
    static setClock(waitTime:number,interval,finish:Function,isShowZero:boolean=false):any{
        let time = 1;
        time = isShowZero?0:1;
        var clockId = setInterval(()=>{
            //最后一秒结束
            if(isShowZero && waitTime == 1) {
                AppGame.ins.gamebaseModel.emit(MBaseGameModel.SET_CLOCK_RED_COLOR);
            }
            if(waitTime == time) { 
                clearInterval(clockId);
                finish();
            }
            else{
                waitTime--;
                interval();
            }
            }, 1000);
        return clockId
    }

    static setClockNew(waitTime:number = 0,interval,overOneSecond,finish:Function,isShowZero:boolean=false):any{
        var count = 0
        let time = 1;
        time = isShowZero?0:1;
        var clockId = setInterval(()=>{
                //仅在小游戏中使用
                if (AppGame.ins.appStatus.status == EAppStatus.Game){
                    //最后一秒结束
                    if(isShowZero && waitTime == 1) {
                        AppGame.ins.gamebaseModel.emit(MBaseGameModel.SET_CLOCK_RED_COLOR);
                    }
                    if(waitTime == time) { 
                        clearInterval(clockId);
                        finish();
                    }
                    else{
                        interval();
                        count++
                        if (count == 10){
                            waitTime--;
                            count = 0
                            overOneSecond(waitTime)
                        }
                    }
                }
            }, 100);
        return clockId
    }
}
