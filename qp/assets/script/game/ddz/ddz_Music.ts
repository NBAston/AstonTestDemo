
import { defaultCipherList } from "constants";
import { EAppStatus } from "../../common/base/UAllenum";
import UAudioManager from "../../common/base/UAudioManager";
import UDebug from "../../common/utility/UDebug";
import AppGame from "../../public/base/AppGame";
import { CardType } from "./ddz_Library";

/**
 * 斗地主的音乐播放器
 */
export default class ddz_Music {
    private playing:boolean = false 
    // 发牌音效
    playSendCard(): void {
        UAudioManager.ins.playSound('audio_sendcard');
    }
    
    //背景音乐
    playGamebg(): void {
        UAudioManager.ins.playGameMusic(AppGame.ins.roomModel.BundleName,"ddz_bgm",true);
    }

    //点击音效
    playClickCard(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'ddz_click');
    }

    //叫分音效
    playCallScore(index:number,sexFlag:string=""): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,sexFlag + "ddz_callscore_" + index);
    }

    //加倍
    playAddScore(index:number,sexFlag:string=""): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,sexFlag + "ddz_addscore_" + index);
    }

    //警告
    playWarn(index:number,sexFlag:string=""): void {
        if (AppGame.ins.appStatus.status != EAppStatus.Game) return
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,sexFlag + "ddz_lastcard_" + index);
        setTimeout(()=>{
            if (AppGame.ins.appStatus.status == EAppStatus.Game)
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"ddz_warn")
        },1000);
    }

    //警告
    playWarnSelf(index:number,sexFlag:string=""): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,sexFlag + "ddz_lastcard_" + index);
    }       

    //闹钟倒计时
    playClock(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"ddz_clock");
    }

    //过牌
    playPass(sexFlag:string=""): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,sexFlag +"ddz_pass");
    }

    //春天
    playChunTian(sexFlag:string=""): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,sexFlag +"ddz_chuntian");
    }

    //比你大
    playBigger(sexFlag:string=""): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,sexFlag + "ddz_bigger");
    }

    //出牌
    playOutCard(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"ddz_out_card");
    }

    //地主帽子
    playBankerResult(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"ddz_banker_result");
    }

    //炸弹
    playBombBg(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"ddz_bomb_bg");
        if (this.playing) return
        setTimeout(()=>{
            if (AppGame.ins.appStatus.status == EAppStatus.Game){
                this.stopAll()
                this.playing = true
                UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"ddz_bgm_fast",false,()=>{
                    this.playing = false
                    this.playGamebg()
                })
            }
        },1000);
    }

    //飞机
    playfeiji(sexFlag:string=""){
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,sexFlag +"ddz_feiji",false,()=>{
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"ddz_feiji_bg")      
        })
    }

    //输赢
    playIsWin(Winflag:boolean): void {
        this.stopAll()
        var path = Winflag ? "ddz_win" : "ddz_lost"
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,path);
    }


    //////////////////////////////////////////////////////////////////////////
    //牌型
    playCardType(cardType:number,key:number,sexFlag:string=""): void {
        var path = ""
        switch (cardType) {
            case CardType.TYPE_SINGLE:
                 path = sexFlag + "ddz_one_" + key 
                 break
            case CardType.TYPE_PAIR:
                path = sexFlag + "ddz_two_" + key
                break
            case CardType.TYPE_THREE:
                path = sexFlag + "ddz_three_" + key
                break
            case CardType.TYPE_ONE_STRAIGHT:
                path = sexFlag + "ddz_shunzi"
                break 
            case CardType.TYPE_TWO_STRAIGHT:
                path = sexFlag + "ddz_liandui"
                break
            case CardType.TYPE_THREE_ONE:
                path = sexFlag + "ddz_sandaiyi"
                break
            case CardType.TYPE_THREE_PAIR:
                path = sexFlag + "ddz_sandaiyidui"
                break
            case CardType.TYPE_FOUR_TWO_ONE:
                path = sexFlag + "ddz_sidaitwo"
                break 
            case CardType.TYPE_FOUR_TWO_PAIR:
                path = sexFlag + "ddz_sidailiangdui"
                break 
            case CardType.TYPE_BOMB:
                path = sexFlag + "ddz_zhadan"
                break 
            case CardType.TYPE_PAIR_KING:
                path = sexFlag + "ddz_wangzha"
                break
        }
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,path)
    }

    stop(): void {
        UAudioManager.ins.setStopMusic();
    }

    stopAll(): void {
        UAudioManager.ins.stopAll();
    }
}   
