import UAudioManager from "../../common/base/UAudioManager";
import AppGame from "../../public/base/AppGame";


/**
 * 梭哈音乐
 */
export default class SHMusic {

    constructor() {
    }
    //发牌
    playfapai(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"SH_fapai");
    }
    //点击
    playclick(): void {
        // UAudioManager.ins.playSound("audio_click");
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"SH_button");
    }
    //翻牌
    playfanpai(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"SH_fanpai");
    }
    //游戏背景音乐
    playGamebg(): void {
        UAudioManager.ins.playGameMusic(AppGame.ins.roomModel.BundleName,"SH_bgm",true);
    }
    //欢呼声
    GrandTheftAuto(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"GrandTheftAuto");
    }
    //筹码飞
    playflyCoin(): void {
        UAudioManager.ins.playSound('audio_betchip');
    }

    //一堆筹码飞
    playflyCoins(): void {
        UAudioManager.ins.playSound('audio_coinsfly');
    }

    //让牌
    playRangPai(sex: number): void {
        let name = sex == 0 ? "SH_rangpai_nan" : "SH_rangpai_nv";
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,name);
    }
    //加注
    playJiazhu(sex: number): void {
        let name = sex == 0 ? "SH_jiazhu_nan" : "SH_jiazhu_nnv";
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,name);
    }
    //跟注
    playGenzhu(sex: number): void {
        let name = sex == 0 ? "SH_genzhu_nan" : "SH_genzhu_nv";
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,name);
    }
    //梭哈
    playSoha(sex: number): void {
        let name = sex == 0 ? "SH_suoha_nan" : "SH_suoha_nv";
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,name);
    }
    //弃牌
    playQiPai(sex: number): void {
        let name = sex == 0 ? "SH_qipai_nan" : "SH_qipai_nv";
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,name);
    }
    //游戏胜利
    playGameWin(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"SH_win");
    }

    //游戏胜利
    playGameLose(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"SH_lose");
    }

    //提示
    playGameTiShi(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"SH_ks");
    }
    //停止音乐
    stop(): void {
        UAudioManager.ins.setStopMusic();
    }


}
