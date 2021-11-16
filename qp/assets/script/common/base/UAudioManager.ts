import cfg_audio, { cfg_audio_game } from "../../config/cfg_audio";
import cfg_game from "../../config/cfg_game";
import AppGame from "../../public/base/AppGame";
import AppStatus from "../../public/base/AppStatus";
import UDebug from "../utility/UDebug";
import UStringHelper from "../utility/UStringHelper";

/**
 * 创建:sq
 * 作用:音效管理
 */
export default class UAudioManager {

    private static _ins: UAudioManager;
    private _loadGameId: { [key: number]: boolean };
    private _error: { [key: string]: boolean };
    private _backmusic: string;
    private _musicmute: boolean;
    private _soundmute: boolean;
    /**
     * 是否在后他
     */
    private _inback: boolean;

    static get ins(): UAudioManager {
        if (!UAudioManager._ins) {
            UAudioManager._ins = new UAudioManager();
        }
        return UAudioManager._ins;
    }
    constructor() {
        this._backmusic = "";
        this._error = {};
        this._loadGameId = {};
    }

    private on_goto_back(caller: boolean): void {
        this._inback = caller;
    }
    /**初始化 */
    init(): void {
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.on_goto_back, this);
        this._inback = false;
        this.playMusic("audio_bgm");
    }
    /**
     * 预加载游戏音效资源
     * @param gameId 
     */
    preload(gameId: number): void {
        if (gameId == null) return;
        if (this._loadGameId[gameId]) return;
        let cfg = cfg_audio_game[gameId] || [];
        if (gameId == 0){
            cfg.forEach(element => {
                let audio = cc.loader.getRes(element);
                if (!audio) {
                    cc.loader.loadRes(element, cc.AudioClip, (err, res) => {
                        if (err) {
                            this._error[element] = true;
                        }
                    });
                }
            }); 
        }
        else{
            cfg.forEach(element => {
                let bundleName = cfg_game[gameId].bundleName
                let bundle = cc.assetManager.getBundle(bundleName)
                let audio = bundle.get(element);
                if (!audio) {
                    bundle.load(element, cc.AudioClip, (err, res) => {
                        if (err) {
                            this._error[element] = true;
                        }
                    });
                }
            });
        }
    }

    /**播放音效 */ 
    playSound(clip: any, loop: boolean = false,callback?:Function): void {
        if (this._inback) return;
        if (!this._soundmute) {
            if (clip instanceof cc.AudioClip)
                var audioID = cc.audioEngine.playEffect(clip, loop);
            else {
                let res = cfg_audio[clip];
                if (res && !this._error[res]) {
                    let audio = cc.loader.getRes(res);
                    if (audio) {
                        var audioID = cc.audioEngine.playEffect(audio, loop);
                        cc.audioEngine.setFinishCallback(audioID,()=>{
                            if (callback != undefined ) 
                            callback()
                        })
                    } else {
                        cc.loader.loadRes(res, cc.AudioClip, (er, assets) => {
                            if (er) {
                                this._error[res] = true;
                            } else {
                                var audioID = cc.audioEngine.playEffect(assets, loop);
                                cc.audioEngine.setFinishCallback(audioID,()=>{
                                    if (callback != undefined ) 
                                    callback()
                                })
                            }
                        });
                    }
                }
            }
        }
    }
    /**设置声音 */
    setSoundVolume(sound: number): void {
        cc.audioEngine.setEffectsVolume(sound);
    }
    /**
     * 播放背景音乐
     * @param name 
     */

  
    playMusic(clip: any, forces: boolean = false): void {
        if (clip instanceof cc.AudioClip) {
            this._backmusic = clip.name;
            cc.audioEngine.stopMusic();
            cc.audioEngine.playMusic(clip, true);
        } else {
            if (UStringHelper.isEmptyString(clip)) return;
            if (this._backmusic == clip && !forces) return;
            this._backmusic = clip;
            let res = cfg_audio[clip];
            if (res) {
                let audio = cc.loader.getRes(res);
                if (audio) {
                    cc.audioEngine.stopMusic();
                    let id = cc.audioEngine.playMusic(audio, true);
                    if (this._musicmute) cc.audioEngine.pauseMusic();
                } else {
                    cc.loader.loadRes(res, cc.AudioClip, (err, audioclip) => {
                        if (!err) {
                            if (this._backmusic == audioclip.name) {
                                cc.audioEngine.stopMusic();
                                let id = cc.audioEngine.playMusic(audioclip, true);
                                if (this._musicmute) cc.audioEngine.pauseMusic();
                            }
                        } else {
                            this._error[res] = true;
                        }
                    });
                }
            }
        }
    }
    /**
     * 暂停播放背景音乐
     */
    setStopMusic(): void {
        this._backmusic = "";
        cc.audioEngine.stopMusic();
    }
    /**
     * 恢复播放背景音乐
     */
    replayMusic(): void {
        cc.audioEngine.resumeMusic();
    }
    setMusicVolume(value: number): void {
        cc.audioEngine.setMusicVolume(value);
    }
    setSoundMute(value: boolean): void {
        this._soundmute = value;
    }
    setMusicmute(value: boolean): void {
        this._musicmute = value;
        if (value) {
            cc.audioEngine.pauseMusic();
        } else {
            cc.audioEngine.resumeMusic();
        }
    }
    stopAll(): void {
        cc.audioEngine.stopAll();
    }


    playGameMusic(bundleName:string,clip: any, forces: boolean = false): void {
        if (clip instanceof cc.AudioClip) {
            this._backmusic = clip.name;
            cc.audioEngine.stopMusic();
            cc.audioEngine.playMusic(clip, true);
        } else {
            if (UStringHelper.isEmptyString(clip)) return;
            if (this._backmusic == clip && !forces) return;
            this._backmusic = clip;
            let res = cfg_audio[clip];
            if (res) {
                let bundle = cc.assetManager.getBundle(bundleName)
                let audio:any= bundle.get(res);
                if (audio) {
                    cc.audioEngine.stopMusic();
                    let id = cc.audioEngine.playMusic(audio, true);
                    if (this._musicmute) cc.audioEngine.pauseMusic();
                } else {
                    bundle.load(res, cc.AudioClip, (err, audioclip:any) => {
                        if (!err) {
                            if (this._backmusic == audioclip.name) {
                                cc.audioEngine.stopMusic();
                                let id = cc.audioEngine.playMusic(audioclip, true);
                                if (this._musicmute) cc.audioEngine.pauseMusic();
                            }
                        } else {
                            this._error[res] = true;
                        }
                    });
                }
            }
        }
    }

     /**播放音效 */ 
     playGameSound(bundleName:string,clip: any, loop: boolean = false,callback?:Function): number {
         let audioID = -1;
        if (this._inback) return audioID;
        if (!this._soundmute) {
            if (clip instanceof cc.AudioClip)
                audioID = cc.audioEngine.playEffect(clip, loop);
            else {
                let res = cfg_audio[clip];
                if (res && !this._error[res]) {
                    let bundle = cc.assetManager.getBundle(bundleName)
                    let audio:any= bundle.get(res);
                    if (audio) {
                        audioID = cc.audioEngine.playEffect(audio, loop);
                        cc.audioEngine.setFinishCallback(audioID,()=>{
                            if (callback != undefined ) 
                            callback()
                        })
                    } else {
                        UDebug.Log("音效路劲" + res)
                        bundle.load(res, cc.AudioClip, (er, assets:any) => {
                            if (er) {
                                this._error[res] = true;
                            } else {
                                audioID = cc.audioEngine.playEffect(assets, loop);
                                cc.audioEngine.setFinishCallback(audioID,()=>{
                                    if (callback != undefined )
                                    callback()
                                })
                            }
                        });
                    }
                }
            }
        }
        return audioID;
    }
}
