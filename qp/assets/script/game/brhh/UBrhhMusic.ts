import UAudioRes from "../../common/base/UAudioRes";
import UAudioManager from "../../common/base/UAudioManager";
import cfg_brhh from "./cfg_brhh";
import AppGame from "../../public/base/AppGame";


/**
 * brlh的音乐播放器
 */
export default class UBrhhMusic {

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
    playfapai(): void {
        UAudioManager.ins.playSound('audio_sendcard');
    }

    playPaiXing(paixing:number): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,cfg_brhh.sound[paixing]);
        // UAudioManager.ins.playSound(this.getAudio(cfg_brhh.sound[paixing]));    
    }
     // 播放点击音效
     playClick(): void {
        UAudioManager.ins.playSound("audio_click");
    }
    playGamebg(): void {
        UAudioManager.ins.playGameMusic(AppGame.ins.roomModel.BundleName,'audio_hhdz_bgm');
    }
    playflyCoin(): void {
        UAudioManager.ins.playSound('audio_coinsfly');
    }

    playCountDown():void {
        UAudioManager.ins.playSound('audio_countdown');
    }

    playChipTips():void {
        UAudioManager.ins.playSound('audio_timenotice');

    }

    playStartBet():void {
        UAudioManager.ins.playSound('audio_begain');
    }

    playStopBet():void {
        UAudioManager.ins.playSound('audio_stop');
    }

    playVs():void {
        UAudioManager.ins.playSound('audio_start');
    }

    stop(): void {
        UAudioManager.ins.setStopMusic();
    }
    private getAudio(name: string): cc.AudioClip {
        return this._audioRes.getAudio(name);
    }
}   
