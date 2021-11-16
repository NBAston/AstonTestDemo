import UAudioRes from "../../../common/base/UAudioRes";
import UAudioManager from "../../../common/base/UAudioManager";

/**
 * 大厅音乐播放
 */
export default class VHallMusic {
    constructor() {
      
    }
    playmusic(): void {
        UAudioManager.ins.playMusic("audio_bgm");
    }
    playclick(): void {
        UAudioManager.ins.playSound("audio_click");
    }
}
