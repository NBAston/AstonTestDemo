import Model from "../../../common/base/Model";
import AppGame from "../../base/AppGame";
import UAudioManager from "../../../common/base/UAudioManager";
import ULocalDB from "../../../common/utility/ULocalStorage";
import UDebug from "../../../common/utility/UDebug";

class db_setting {
    _sound: number = 0.5;
    _music: number = 0.5;
    _musicmute: boolean = false;
    _soundmute: boolean = false;
}
/**
 * 创建:sq
 * 作用:游戏的音量
 */
export default class MSettingModel extends Model {

    private _sound: number;
    private _music: number;
    private _musicmute: boolean;
    private _soundmute: boolean;
    private _save: boolean;
    private _savetime: number = 1;
    get sound(): number {
        if (this._soundmute) {
            return 0;
        }
        return this._sound;
    }

    set sound(value: number) {
        this._sound = value;
        if (value > 0) {
            this._soundmute = false;
        } else {
            this._soundmute = true;
        }
        UAudioManager.ins.setSoundMute(this._soundmute);
        UAudioManager.ins.setSoundVolume(this._sound);
        this._save = true;
        this._savetime = 1;
    }

    get music(): number {
        if (this._musicmute) {
            return 0;
        }
        return this._music;
    }
    set music(value: number) {
        this._music = value;
        if (value > 0) {
            this._musicmute = false;
        } else {
            this._musicmute = true;
        }
        UAudioManager.ins.setMusicmute(this._musicmute);
        UAudioManager.ins.setMusicVolume(this._music);
        this._save = true;
        this._savetime = 1;
    }
    get musicmute(): boolean {
        return this._musicmute;
    }
    set musicmute(value) {
        this._musicmute = value;
        UAudioManager.ins.setMusicmute(this._musicmute);
        if (!value) {
            if (this._music <= 0) {
                this._music = 0.5
            }
            UAudioManager.ins.setMusicVolume(this._music);
        } else {
            UAudioManager.ins.setMusicVolume(0);
        }
        this._save = true;
        this._savetime = 1;
    }
    get soundmute(): boolean {
        return this._soundmute;
    }
    set soundmute(value) {
        this._soundmute = value;
        if (!value) {
            if (this._sound <= 0) {
                this._sound = 0.5;
            }
            UAudioManager.ins.setSoundVolume(this._music);
        } else {
            UAudioManager.ins.setSoundVolume(0);
        }
        UAudioManager.ins.setSoundMute(this._soundmute);
        this._save = true;
        this._savetime = 1;
    }

    init(): void {


        this._sound = ULocalDB.getDB("sound");
        this._music = ULocalDB.getDB("music");
        this._musicmute = ULocalDB.getDB("musicmute");
        this._soundmute = ULocalDB.getDB("soundmute");

        UAudioManager.ins.setSoundVolume(this._sound);
        UAudioManager.ins.setMusicVolume(this._music);
        UAudioManager.ins.setMusicmute(this._musicmute);
        UAudioManager.ins.setSoundMute(this._soundmute);
        UDebug.log("this._sound============" + this._sound);
        UDebug.log("this._music============" + this._music);
    }
    resetData(): void {

    }
    update(dt: number): void {
        if (this._save) {
            this._savetime -= dt;
            if (this._savetime < 0) {
                this._save = false;
                ULocalDB.SaveDB("sound",this._sound);
                ULocalDB.SaveDB("music",this._music);
                ULocalDB.SaveDB("musicmute",this._musicmute);
                ULocalDB.SaveDB("soundmute",this._soundmute);
            }
        }
    }
}
