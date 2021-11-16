import UAudioRes from "../../common/base/UAudioRes";
import UAudioManager from "../../common/base/UAudioManager";
import AppGame from "../../public/base/AppGame";


/**
 * brlh的音乐播放器
 */
export default class UBrlhMusic {

    /**
     *音乐资源
     */
    private _audioRes: UAudioRes;

    constructor(audioRes: UAudioRes) {
        this._audioRes = audioRes;
    }
    // 播放点击音效
    playClick(): void {
        UAudioManager.ins.playSound("audio_click");
    }
    playbet(): void {
        UAudioManager.ins.playSound('audio_betchip');
    }
    playonBet(): void {
        // UAudioManager.ins.playSound(this.getAudio("on_bet"));
    }
    playfapai(): void {
        UAudioManager.ins.playSound('audio_sendcard');
    }

    playLong(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, 'audio_brlh_dragon');
    }
    playHu(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, 'audio_brlh_tiger');
    }
    playPaiXing(paixing: string): void {
        // UAudioManager.ins.playSound(this.getAudio(paixing.toString()));   
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, 'audio_brlh_' + paixing.toString());
    }
    playGamebg(): void {
        UAudioManager.ins.playGameMusic(AppGame.ins.roomModel.BundleName, 'audio_brlh_bgm');
    }
    playflyCoin(): void {
        UAudioManager.ins.playSound('audio_coinsfly');
    }

    playLongWin(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, 'audio_brlh_dragonwin');
    }

    playHuWin(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, 'audio_brlh_tigerwin');
    }

    playHeWin(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, 'audio_brlh_draw');
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

    playVs(): void {
        // UAudioManager.ins.playSound(this.getAudio('lh_vs'));
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, 'audio_lh_start');
    }

    playCountDown(): void {
        UAudioManager.ins.playSound('audio_countdown');
    }

    stop(): void {
        UAudioManager.ins.setStopMusic();
    }
    private getAudio(name: string): cc.AudioClip {
        return this._audioRes.getAudio(name);
    }
}
