
const { ccclass, property } = cc._decorator;

/**
 * 创建:sq
 * 作用: 挂接的资源
 */
@ccclass
export default class USpriteFrames extends cc.Component {
    @property({ type: [cc.SpriteFrame] })
    frames: Array<cc.SpriteFrame> = [];

    private _dict: { [key: string]: cc.SpriteFrame };
    private initDict(): void {
        if (!this._dict) {
            this._dict = {};
            this.frames.forEach(element => {
                if (element) {
                    this._dict[element.name] = element;
                } 
            });
        }
    }
    protected onLoad(): void {
        this.initDict();
    }
    
    protected onDestroy(): void {
       delete this._dict;
       delete this.frames;
    }

    /**
     * 根据名字获取spriteframe
     * @param name 
     */
    getFrames(name: string): cc.SpriteFrame{
        this.initDict();
        return this._dict[name];
    }
    
    getFrameIdx(idx:number):cc.SpriteFrame{
        return this.frames[idx];
    }
}
