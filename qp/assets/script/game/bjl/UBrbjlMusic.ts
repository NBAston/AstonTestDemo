import UAudioRes from "../../common/base/UAudioRes";
import UAudioManager from "../../common/base/UAudioManager";
import AppGame from "../../public/base/AppGame";


/**
 * brlh的音乐播放器
 */
export default class UBrbjlMusic {

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
        UAudioManager.ins.playGameMusic(AppGame.ins.roomModel.BundleName, 'bjl_BG');
    }
    playflyCoin(): void {
        UAudioManager.ins.playSound('audio_coinsfly');
    }

    playResultSound(playerPoint: number, bankerPoint: number, playerCardCount: number, bankCardCount: number, bankWinOrPlayerWin: number) {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, 'bjl-x' + ((playerPoint >= 8 && playerCardCount == 2) ? 'tw' : playerPoint), false, () => {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, 'bjl-z' + ((bankerPoint >= 8 && bankCardCount == 2) ? 'tw' : bankerPoint), false, () => {
                if (bankWinOrPlayerWin == 3) {
                    UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, 'bjl-zy');
                } else if (bankWinOrPlayerWin == 2) {
                    UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, 'bjl-xy');
                } else {
                    UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, 'bjl-tdp');
                }
            })
        });
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
