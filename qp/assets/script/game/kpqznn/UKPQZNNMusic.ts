import UAudioRes from "../../common/base/UAudioRes";
import UAudioManager from "../../common/base/UAudioManager";
import AppGame from "../../public/base/AppGame";



/**
 * qznn的音乐播放器
 */
export default class UKPQZNNMusic {

    /**
     *音乐资源
     */
    private _audioRes: UAudioRes;

    constructor(audioRes?: UAudioRes) {
        this._audioRes = audioRes;
    }
    /**点击声音 */
    playClick(): void {
        // UAudioManager.ins.playSound(this.getAudio("click"));
        UAudioManager.ins.playSound("audio_click");
    }

    /**紧急倒计时 */
    playTimenotice():void{
        // UAudioManager.ins.playSound("audio_timenotice");
    }

    /**倒计时 */
    playCountDown():void{
        // UAudioManager.ins.playSound("audio_countdown");
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
    /**选中牌 */
    playSelect(): void {
        // UAudioManager.ins.playSound(this.getAudio("card_select"));
    }
    /**发牌 */
    playSendCard(): void {
        // UAudioManager.ins.playSound(this.getAudio("sendcard"));
        UAudioManager.ins.playSound("audio_sendcard");
    }
    /**抢庄牛牛 牌型 */
    playPaiXing(cardtype: number, sex: number): void {
        var aniName = null;
        // if (cardtype < 11) {
        //     aniName = sex == 0 ? ("s_niu_" + cardtype.toString()) : ("s_niu_" + cardtype.toString() + "_w");
        // }
        // else if(cardtype == 12){//四炸
        //     aniName = sex == 0 ? ("s_niu_13") : ("s_niu_13_w");
        // }
        // else if(cardtype == 13){//五花牛
        //     aniName = sex == 0 ? ("s_niu_12") : ("s_niu_12_w");
        // }
        // else if(cardtype == 14){
        //     aniName = sex == 0 ? ("s_niu_14") : ("s_niu_14_w");
        // }
        // cc.log(cardtype);

        if (cardtype >= 0 && cardtype < 15) {
            aniName = sex == 0 ? ("audio_qznn_man_" + cardtype.toString()) : ("audio_qznn_woman_" + cardtype.toString());
        }

        // var res = this.getAudio(aniName);
        // cc.log("aniName:"+aniName);

        //11以后再说 规则不一样
        if (aniName != null) {
            UAudioManager.ins.playSound(aniName);
        }
    }

    /**qznn bgm */
    playGamebg(): void {
        // UAudioManager.ins.playMusic(this.getAudio("bg"));
        UAudioManager.ins.playGameMusic(AppGame.ins.roomModel.BundleName,"audio_kpqznn_bgm");
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
    playZhuang(sex?: number): void {

        // UAudioManager.ins.playSound(this.getAudio("banker"));
        UAudioManager.ins.playSound("audio_bankerselected");
    }

    // 操作时间到
    playTimeOut(): void {
        UAudioManager.ins.playSound("audio_timenotice");   
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
