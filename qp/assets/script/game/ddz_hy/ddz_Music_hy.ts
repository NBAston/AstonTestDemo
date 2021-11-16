
import { defaultCipherList } from "constants";
import UAudioManager from "../../common/base/UAudioManager";
import UDebug from "../../common/utility/UDebug";
import AppGame from "../../public/base/AppGame";
import { CardType } from "./ddz_Library_hy";

/**
 * 斗地主的音乐播放器
 */
export default class ddz_Music_hy {
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
    //点击音效
    playClickBtn(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'ddz_click');
    }

    //叫分音效
    playCallScore(index:number,isMan = true): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,isMan ? "ddz_callscore_" + index : "ddz_callscore_woman_" + index );
    }

    //加倍
    playAddScore(index:number,isMan = true): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"ddz_addscore_" + index);
    }

    //警告
    playWarn(index:number,isMan = true): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,isMan ? "ddz_lastcard_" + index : "ddz_lastcard_woman_" + index);
    }

    //闹钟倒计时
    playClock(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"ddz_clock");
    }

    //过牌
    playPass(isMan = true): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,isMan ? "ddz_pass" : "ddz_pass_woman");
    }

    //春天
    playChunTian(isMan = true): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,isMan ? "ddz_chuntian" : "ddz_chuntian_woman");
    }

    //比你大
    playBigger(isMan = true): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,isMan ? "ddz_bigger" : "ddz_bigger_woman");
    }

    //出牌
    playOutCard(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"ddz_out_card");
    }

    //地主帽子
    playBankerResult(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"ddz_banker_result");
    }

    //不加倍
    play_bujiabei(sex:boolean = true): void {
        let pre = sex ? 'Man' : 'Woman';
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,`ddz_${pre}_bujiabei`);
    }
    //加倍
    play_jiabei(sex:boolean = true): void {
        let pre = sex ? 'Man' : 'Woman';
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,`ddz_${pre}_jiabei`);
    }
    //不抢
    play_NoRob(sex:boolean = true): void {
        let pre = sex ? 'Man' : 'Woman';
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,`ddz_${pre}_NoRob`);
    }
    //叫地主
    play_Order(sex:boolean = true): void {
        let pre = sex ? 'Man' : 'Woman';
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,`ddz_${pre}_Order`);
    }
    //抢地主
    play_Rob1(sex:boolean = true): void {
        let pre = sex ? 'Man' : 'Woman';
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,`ddz_${pre}_Rob1`);
    }
    //不叫
    play_BuJiao(sex:boolean = true): void {
        let pre = sex ? 'Man' : 'Woman';
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,`ddz_${pre}_bujiao`);
    }


    //炸弹
    playBombBg(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"ddz_bomb_bg");
        if (this.playing) return
        this.stopAll()
        this.playing = true
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"ddz_bgm_fast",false,()=>{
            this.playing = false
            this.playGamebg()
        })
    }

    //飞机
    playfeiji(isMan = true){
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,isMan ? "ddz_feiji" : "ddz_feiji_woman",false,()=>{
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"ddz_feiji_bg")      
        })
    }

    //输赢
    playIsWin(Winflag:boolean): void {
        this.stopAll()
        var path = Winflag ? "ddz_win" : "ddz_lost"
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,path);
    }


    ///////////////////////////////////////////////////////////////////////
    //牌型
    playCardType(cardType:number,key:number,isMan = true): void {
        var path = ""
        switch (cardType) {
            case CardType.TYPE_SINGLE:
                 path = isMan ? "ddz_one_" + key : "ddz_one_woman_" + key
                break
            case CardType.TYPE_PAIR:
                path = isMan ? "ddz_two_" + key : "ddz_two_woman_" + key
                break
            case CardType.TYPE_THREE:
                path = isMan ? "ddz_three_" + key : "ddz_three_woman_" + key
                break
            case CardType.TYPE_ONE_STRAIGHT:
                path = isMan ? "ddz_shunzi" : "ddz_shunzi_woman"
                break 
            case CardType.TYPE_TWO_STRAIGHT:
                path = isMan ? "ddz_liandui" : "ddz_liandui_woman"
                break
            case CardType.TYPE_THREE_ONE:
                path = isMan ? "ddz_sandaiyi" : "ddz_sandaiyi_woman"
                break
            case CardType.TYPE_THREE_PAIR:
                path = isMan ? "ddz_sandaiyidui" : "ddz_sandaiyidui_woman"
                break
            case CardType.TYPE_FOUR_TWO_ONE:
                path = "ddz_sidaitwo"
                break 
            case CardType.TYPE_FOUR_TWO_PAIR:
                path = isMan ? "ddz_sidailiangdui" : "ddz_sidailiangdui_woman"
                break 
            case CardType.TYPE_BOMB:
                path = isMan ? "ddz_zhadan" : "ddz_zhadan_woman"
                break 
            case CardType.TYPE_PAIR_KING:
                path = isMan ? "ddz_wangzha" : "ddz_wangzha_woman"
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
