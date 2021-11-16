
const { ccclass, property } = cc._decorator;
/**
 * 作用:挂接音乐资源的类
 */
@ccclass
export default class UAudioRes extends cc.Component {
    @property({ type: [cc.AudioClip] })
    audios: Array<cc.AudioClip> = [];

    private _dict: { [key: string]: cc.AudioClip };

    private initDict(): void {
        if (!this._dict) {
            this._dict = {};
            this.audios.forEach(element => {
                if (element) {
                    this._dict[element.name] = element;
                } 
            });
        }
    }
    protected onLoad(): void {
        this.initDict();
    }
    /**
     * 根据名字获取spriteframe
     * @param name 
     */
    getAudio(name: string): cc.AudioClip {
        this.initDict();
        return this._dict[name];
    }
}
