import UAudioRes from "../../../common/base/UAudioRes";
import UAudioManager from "../../../common/base/UAudioManager";
import AppGame from "../../../public/base/AppGame";





/**
 * sss的音乐播放器
 */
export default class USSSMusic {

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
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"audio_sss_start");
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
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"audio_sss_fp");
    }
    /** 牌型 */
    playPaiXing(cardtype: number, sex: number): void {
        let res = "audio_sss_woman_" + cardtype.toString();
        if (res != null) {
            UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,res);
        }
    }
    /**
     * 特殊牌型
     */
    playTSPX(){
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"audio_sss_tsp");

    }
    /**sss bgm */
    playGamebg(): void {
        UAudioManager.ins.playGameMusic(AppGame.ins.roomModel.BundleName,"audio_sss_bgm",true);
    }
    /**金币飞 */
    playflyCoin(): void {

        UAudioManager.ins.playSound("audio_coinsfly");
    }

    /**开始比牌 */
    playKSBP(sex: number):void{
        var aniName = null;
        aniName = sex == 0 ? ("audio_sss_ksbp_man") : ("audio_sss_ksbp_woman");
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"audio_sss_ksbp_woman");
    }

    /**组牌完成 */
    playZPWC(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"audio_sss_dealcard");
    }

    /**选择牌型 */
    playXZPX(): void {
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"audio_sss_xzpx");
    }

    playDQ(sex: number){
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"audio_sss_dq");
        var aniName = null;

        aniName = sex == 0 ? ("audio_sss_dq_man") : ("audio_sss_dq_woman");
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"audio_sss_dq_woman");
    }

    playQLD(sex: number){
        var aniName = null;
        aniName = sex == 0 ? ("audio_sss_qld_man") : ("audio_sss_qld_woman");
        UAudioManager.ins.playGameSound(AppGame.ins.roomModel.BundleName,"audio_sss_qld_woman");

    }

    stop(): void {
        UAudioManager.ins.setStopMusic();
    }
    private getAudio(name: string): cc.AudioClip {
        return this._audioRes.getAudio(name);
    }
}   
