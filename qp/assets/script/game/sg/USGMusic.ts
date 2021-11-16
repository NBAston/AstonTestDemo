import UAudioRes from "../../common/base/UAudioRes";
import UAudioManager from "../../common/base/UAudioManager";
import AppGame from "../../public/base/AppGame";


/**
 * sg的音乐播放器
 */
export default class USGMusic {

    /**
     *音乐资源
     */
    private _audioRes: UAudioRes;

    constructor(audioRes?: UAudioRes) {
        this._audioRes = audioRes;
    }

    /**紧急倒计时 */
    playTimenotice():void{
        UAudioManager.ins.playSound("audio_timenotice");
    }

    /**倒计时 */
    playCountDown():void{
        UAudioManager.ins.playSound("audio_countdown");
    }
    /**翻牌 */
    playTurnCard():void{
        UAudioManager.ins.playSound("audio_turncard");
    }


    /**通杀 */
    playTongsha():void{
        UAudioManager.ins.playSound("audio_allkill");
    }
    /**通赔 */
    playTongpei():void{
        UAudioManager.ins.playSound("audio_allpay");
    }
    /**游戏结束 */
    playOver(): void {
        // UAudioManager.ins.playSound(this.getAudio("game_over"));
    }
    /**游戏开始 */
    playStart(): void {
        // UAudioManager.ins.playSound(this.getAudio("game_start"));
        UAudioManager.ins.playSound("audio_start");
    }
    /**游戏胜利 */
    playWin(): void {
        // UAudioManager.ins.playSound(this.getAudio("game_win"));
        UAudioManager.ins.playSound("audio_win");
    }
    /**点击声音 */
    playClick(): void {
        // UAudioManager.ins.playSound(this.getAudio("click"));
        UAudioManager.ins.playSound("audio_click");
        
    }
    /**发牌 */
    playSendCard(): void {
        // UAudioManager.ins.playSound(this.getAudio("sendcard"));
        UAudioManager.ins.playSound("audio_sendcard");
    }
    /**三公 牌型 */
    playPaiXing(cardtype: number, sex: number): void {
        var aniName = null;

        // aniName = sex == 0 ? ("Point10" + cardtype.toString()) : ("Point00" + cardtype.toString());
        aniName = sex == 0 ? ("audio_sg_man_" + cardtype.toString()) : ("audio_sg_woman_" + cardtype.toString());

        // let res = this.getAudio(aniName);
        let res = aniName;
        if (res != null) {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,res);
        }

    }
    /**sg bgm */
    playGamebg(): void {
        // UAudioManager.ins.playMusic(this.getAudio("music_game"));
        UAudioManager.ins.playGameMusic(AppGame.ins.roomModel.BundleName,"audio_sg_bgm",true);
    }
    /**金币飞 */
    playflyCoin(): void {
        // UAudioManager.ins.playSound(this.getAudio("fly_gold"));
        UAudioManager.ins.playSound("audio_coinsfly");
    }

    /**选庄 */
    playChooseZhuang():void{
        
        UAudioManager.ins.playSound("audio_rollnumber");
    }
    /**确定庄 */
    playZhuang(sex: number): void {

        // UAudioManager.ins.playSound(this.getAudio("banker"));

        UAudioManager.ins.playSound("audio_bankerselected");
    }
    /**是否抢庄 */
    playQiangZhung(isQiang: boolean, sex: number): void {
        var name = "";
        if (isQiang) {
            // name = sex == 0 ? "s_niu_qiang" : "s_niu_qiang_w";
            name = sex == 0 ? "audio_man_vie" : "audio_woman_vie";
        }
        // else {
        //     name = sex == 0 ? "s_niu_buqiang" : "s_niu_buqiang_w";
        // }
        // UAudioManager.ins.playSound(this.getAudio(name));

        UAudioManager.ins.playSound(name);
    }

    stop(): void {
        UAudioManager.ins.setStopMusic();
    }
    private getAudio(name: string): cc.AudioClip {
        return this._audioRes.getAudio(name);
    }
}   
