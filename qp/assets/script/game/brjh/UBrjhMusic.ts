import UAudioRes from "../../common/base/UAudioRes";
import UAudioManager from "../../common/base/UAudioManager";
import AppGame from "../../public/base/AppGame";

export default class UBrjhMusic {
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
    
    playPaiXing(paixing: string): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'audio_brjh_' + paixing);
    }

    playGamebg(): void {
        UAudioManager.ins.playGameMusic(AppGame.ins.roomModel.BundleName,'audio_brjh_bgm');
    }

    playflyCoin(): void {
        UAudioManager.ins.playSound('audio_coinsfly')
    }

    playChipTips():void {
        UAudioManager.ins.playSound('audio_timenotice')
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

    playSendCard():void {
        UAudioManager.ins.playSound('audio_sendcard');
    }

    playTurnCard():void {
        UAudioManager.ins.playSound('audio_turncard');
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
    private getAudio(name: string): cc.AudioClip {
        return this._audioRes.getAudio(name);
    }
}