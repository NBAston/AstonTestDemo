import UAudioRes from "../../common/base/UAudioRes";
import UAudioManager from "../../common/base/UAudioManager";
import AppGame from "../../public/base/AppGame";

export default class UBcbmMusic {

    id:number;

    playbet(): void {
        UAudioManager.ins.playSound('audio_betchip');   
    }
    
    playPaiXing(paixing: string): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'audio_bcbm_woman_' + paixing);
    }
    playGamebg(): void {
        UAudioManager.ins.playGameMusic(AppGame.ins.roomModel.BundleName,'audio_bcbm_bgm');
    }
    playflyCoin(): void {
        UAudioManager.ins.playSound('audio_coinsfly');

    }

    playChipTips():void {
        
        UAudioManager.ins.playSound('audio_timenotice');
    }

    playCountDown(): void {
        UAudioManager.ins.playSound('audio_countdown');
    }


    playStartBet():void {
        UAudioManager.ins.playSound('audio_begain');
    }

    playStopBet():void {
        UAudioManager.ins.playSound('audio_stop');
    }

    playRunDown():void {
         UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'audio_bcbm_down');
    }

    playRunUp():any {
        return UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'audio_bcbm_up');
    }

    playAllPay():void {
        UAudioManager.ins.playSound('audio_allpay');
    }

    playAllKill():void {
        UAudioManager.ins.playSound('audio_allkill');
    }

    stop(): void {
        cc.audioEngine.pauseAllEffects();
    }
}
