import UAudioRes from "../../common/base/UAudioRes";
import UAudioManager from "../../common/base/UAudioManager";
import AppGame from "../../public/base/AppGame";



/**
 * pdk的音乐播放器
 */
export default class pdk_Music {

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

    // 播放点击音效
    playClick(): void {
        UAudioManager.ins.playSound("audio_click");
    }
    // 播放游戏背景音乐 
    playGamebg(): void {
        UAudioManager.ins.playGameMusic(AppGame.ins.roomModel.BundleName,"pdk_bgm",true);
    }

    // 警报
    playWarning(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'poker_warning');
    }
    // 报单
    playLastOne(isMan: boolean): void {
        if(isMan) {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'man_last_one');
        } else {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'woman_last_one');
        }
    }
    // 打牌音效
    playDapai(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'pdk_dapai');
    }
    // 翻牌音效
    playFanpai(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'pdk_fanpai');
    }

    // 发牌音效
    playSendCard(): void {
        UAudioManager.ins.playSound('audio_sendcard');
    }

    // 扑克牌点击音效
    playCardClick(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'poker_click');
    }

    // 倒计时音效
    playDjs(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,'pdk_daojishi');
    }

    // 对子
    playPair(isMan: boolean,cardNumStr: string) {
        if(isMan) {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"man_pair_" + cardNumStr);
        } else {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"woman_pair_" + cardNumStr);
        }
    }

    // 单张
    playSingle(isMan: boolean, cardNumStr: string) {
        if(isMan) {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"man_single_" + cardNumStr);
        } else {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"woman_single_" + cardNumStr);
        }
    }

    // 顺子
    playStraight(isMan: boolean) {
        if(isMan) {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"man_straight");
        } else {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"woman_straight");
        }
    }

    // 连对
    playStraightPair(isMan: boolean) {
        if(isMan) {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"man_straight_pair");
        } else {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"woman_straight_pair");
        }
    }

    

    // 播放三跟，三带1  三带二
    playThreeAndNum(isMan: boolean, cardNum: number) {
        if(isMan) {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"man_3_" + cardNum);
        } else {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"woman_3_" + cardNum);
        }
    }

    // 播放四带1，四带2，四带3
    playFourAndNum(isMan: boolean, cardNum: number) {
        if(isMan) {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"man_4_" + cardNum);
        } else {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"woman_4_" + cardNum);
        }
    }

    // 播放飞机
    playPlane(isMan: boolean) {
        if(isMan) {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"man_plane");
        } else {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"man_plane");
        }
    }

    // 播放飞机音效
    playEffectPlane() {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"poker_plane");
    }

    // 播放炸弹
    playBomb(isMan: boolean) {
        if(isMan) {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"man_bomb");
        } else {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"woman_bomb");
        }
    }

    // 炸弹音效
    playBombEffect() {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"poker_bomb");
    }

    // 播放先出
    playFirstOut(isMan: boolean) {
        if(isMan) {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"man_firstcheck");
        } else {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"woman_firstcheck");
        }
    }

    // 播放要不起
    playYaobuqi(isMan: boolean) {
        if(isMan) {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"man_yaobuqi");
        } else {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"woman_yaobuqi");
        }
    }

    // 播放压si
    playYasi(isMan: boolean) {
        if(isMan) {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"man_yasi");
        } else {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"woman_yasi");
        }
    }
    // 播放输赢
    playWinOrLose(isMan: boolean, isWin: boolean) {
        if(isMan) {
            if(isWin) {
                UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"poker_win");
                UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"man_win");
            } else {
                UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"poker_lose");
            }
        } else {
            if(isWin) {
                UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"poker_win");
                UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"woman_win");
            } else {
                UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"poker_lose");
            }
        }
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
