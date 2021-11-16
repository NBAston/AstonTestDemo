import UAudioRes from "../../common/base/UAudioRes";
import UAudioManager from "../../common/base/UAudioManager";


/**
 * 扎金花的音乐播放器
 */
export default class UZJHMusic_hy {

    constructor() {
    }
    playbet(state: number): void {
        if (state == 2) {
            UAudioManager.ins.playSound("audio_roll_gold");
        } else
            UAudioManager.ins.playSound("audio_zjh_raise");
    }
    playfapai(): void {
        UAudioManager.ins.playSound("audio_sendcard");
    }
    playclick(): void {
        UAudioManager.ins.playSound("audio_click");
    }
    playhit(): void {
        UAudioManager.ins.playSound("audio_zjh_flashLight");
    }
    playPaiXing(paixing: string): void {
        // switch (paixing) {
        //     case "baozi":
        //         UAudioManager.ins.playSound(this.getAudio("zjh_baozi"));
        //         break;
        //     case "jinhua":
        //         UAudioManager.ins.playSound(this.getAudio("zjh_jinhua"));
        //         break;
        //     case "shunjin":
        //         UAudioManager.ins.playSound(this.getAudio("zjh_shunjin"));
        //         break;
        //     case "shunzi":
        //         UAudioManager.ins.playSound(this.getAudio("zjh_shunzi"));
        //         break;
        // }
    }
    playGamebg(): void {
        UAudioManager.ins.playMusic("audio_zjh_bgm");
    }
    playflyCoin(): void {
        UAudioManager.ins.playSound("audio_coinsfly");
    }
    playGuzhuyizhi(sex: number): void {
        // let name = sex == 0 ? "zjh_guzhuyizhi_man" : "zjh_guzhuyizhi_woman";
        // UAudioManager.ins.playSound(this.getAudio(name));
    }
    playBiPai(sex: number): void {
        let name = sex == 0 ? "audio_zjh_man_compare" : "audio_zjh_woman_compare";
        UAudioManager.ins.playSound(name);
    }
    playJiazhu(sex: number): void {
        let name = sex == 0 ? "audio_zjh_man_raise" : "audio_zjh_woman_raise";
        UAudioManager.ins.playSound(name);
    }
    playGenzhu(sex: number): void {
        let name = sex == 0 ? "audio_zjh_man_call" : "audio_zjh_woman_call";
        UAudioManager.ins.playSound(name);
    }
    playKanPai(sex: number): void {
        let name = sex == 0 ? "audio_zjh_man_watch" : "audio_zjh_woman_watch";
        UAudioManager.ins.playSound(name);
    }
    playQiPai(sex: number): void {
        let name = sex == 0 ? "audio_zjh_man_fold" : "audio_zjh_woman_fold";
        UAudioManager.ins.playSound(name);
    }
    stop(): void {
        UAudioManager.ins.setStopMusic();
    }
}   
