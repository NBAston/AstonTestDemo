import UAudioRes from "../../common/base/UAudioRes";
import UAudioManager from "../../common/base/UAudioManager";
import AppGame from "../../public/base/AppGame";



/**
 * brebg的音乐播放器
 */
export default class UBrebgMusic {

    /**
     *音乐资源
     */
    private _audioRes: UAudioRes;

    constructor(audioRes: UAudioRes) {
        this._audioRes = audioRes;
    }
    playbet(): void {
        UAudioManager.ins.playSound('audio_betchip');
    }
    playOnBet(): void {
        // UAudioManager.ins.playSound(this.getAudio("on_bet"));
    }

    playSendCard(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'audio_28g_sendcard');
    }

    playFanPai(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'audio_28g_turncard');
    }

    playPaiXing(paixing: number): void {
        // if (paixing == 12) { paixing = 11;} // 金豹子的音效暂时没有
        // paixing = 120;
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'audio_28g_' + paixing.toString());
        // UAudioManager.ins.playSound(this.getAudio('resultNum_' + paixing.toString()));
    }

    playGamebg(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'audio_28g_bgm');
    }

    playRoll(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'audio_28g_roll');
    }

    playflyCoin(): void {
        UAudioManager.ins.playSound('audio_coinsfly');
    }

    playCountDown():void {
        UAudioManager.ins.playSound('audio_countdown');
    }
    
    playChipTips(): void {
        UAudioManager.ins.playSound('audio_timenotice');
    }

    playStartBet(): void {
        UAudioManager.ins.playSound('audio_begain');
    }

    playStopBet(): void {
        UAudioManager.ins.playSound('audio_stop');
    }

    playAllPay():void {
        UAudioManager.ins.playSound('audio_allpay');
    }

    playAllKill():void {
        UAudioManager.ins.playSound('audio_allkill');
    }

    stop(): void {
        UAudioManager.ins.setStopMusic();
    }

    stopAll(): void {
        UAudioManager.ins.stopAll();
    }

    private getAudio(name: string): cc.AudioClip {
        return this._audioRes.getAudio(name);
    }
}   
