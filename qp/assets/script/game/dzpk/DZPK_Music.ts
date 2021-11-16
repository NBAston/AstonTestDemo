import UAudioManager from "../../common/base/UAudioManager";
import UDebug from "../../common/utility/UDebug";
import AppGame from "../../public/base/AppGame";


/**
 * 音乐
 */
export default class DZPK_Music {

    constructor() {
    }
    //开始游戏
    startGame(): void {
        UAudioManager.ins.playSound("DZPK_ksyx");
    }
    //发牌
    playfapai(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "DZPK_fanpai");
    }

    //点击
    playclick(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "DZPK_button");
    }

    //游戏背景音乐
    playGamebg(): void {
        UAudioManager.ins.playGameMusic(AppGame.ins.roomModel.BundleName, "DZPK_bgm", true);
    }
    //筹码飞
    playflyCoin(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "DZPK_chouma");
    }
    //过牌
    playRangPai(sex: number): void {
        let name = sex == 0 ? "DZPK_guopai" : "DZPK_guopai1";
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, name);
    }
    //加注
    playJiazhu(sex: number): void {
        let name = sex == 0 ? "DZPK_jiazhu" : "DZPK_jiazhu1";
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, name);
    }
    //跟注
    playGenzhu(sex: number): void {
        let name = sex == 0 ? "DZPK_genzhu" : "DZPK_genzhu1";
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, name);
    }
    //梭哈
    playSoha(sex: number): void {
        let name = sex == 0 ? "DZPK_allin" : "DZPK_allin1";
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, name);
    }
    //弃牌
    playQiPai(sex: number): void {
        let name = sex == 0 ? "DZPK_qipai" : "DZPK_qipai1";
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, name);
    }

    //停止音乐
    stop(): void {
        UAudioManager.ins.setStopMusic();
    }

    winMusic(ty: number) {
        switch (ty) {
            case 0:
                this.DZPK_sanpai();
                break;
            case 1:
                this.DZPK_duizi();
                break;
            case 2:
                this.DZPK_liangdui();
                break;
            case 3:
                this.DZPK_santiao();
                break;
            case 4:
                this.DZPK_shunzi();
                break;
            case 5:
                this.DZPK_tonghua();
                break;
            case 6:
                this.DZPK_hulu();
                break;
            case 7:
                this.DZPK_sitiao();
                break;
            case 8:
                this.DZPK_ths();
                break;
            case 9:
                this.DZPK_hjths();
                break;
        }
    }

    //散牌
    DZPK_sanpai(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "DZPK_sanpai");
    }

    //对子
    DZPK_duizi(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "DZPK_duizi");
    }

    //两对
    DZPK_liangdui(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "DZPK_liangdui");
    }

    //三条
    DZPK_santiao(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "DZPK_santiao");
    }

    //顺子
    DZPK_shunzi(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "DZPK_shunzi");
    }

    //同花
    DZPK_tonghua(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "DZPK_tonghua");
    }

    //葫芦
    DZPK_hulu(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "DZPK_hulu");
    }

    //四条
    DZPK_sitiao(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "DZPK_sitiao");
    }

    //同花顺
    DZPK_ths(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "DZPK_ths");
    }

    //皇家同花顺
    DZPK_hjths(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "DZPK_hjths");
    }

    //赢了
    DZPK_yingpai(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName, "DZPK_yingpai");
    }
}
