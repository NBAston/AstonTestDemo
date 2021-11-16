import UAudioManager from "../../common/base/UAudioManager";
import UAudioRes from "../../common/base/UAudioRes";
import AppGame from "../../public/base/AppGame";





export default class UBJMusic {



    /**
     *音乐资源
     */
    private _audioRes: UAudioRes;

    constructor(audioRes?: UAudioRes) {
        this._audioRes = audioRes;
    }

    /**bj bgm */
    playGamebg(): void {
        UAudioManager.ins.playGameMusic(AppGame.ins.roomModel.BundleName, "audio_21_bgm", true);
    }

    playBomb(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "audio_21_bomb", false);
    }

    playBlack(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "audio_21_black", false);
    }
}
