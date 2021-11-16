// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
/**
 * 文字选择器
 */
@ccclass
export default class UImgTxt extends cc.Component {

    private _arrList: Array<cc.Sprite> = [];
    private _spriteName: number=0;
    @property([cc.Sprite])
    geSprite: Array<cc.Sprite> = [];

    @property([cc.Sprite])
    shiSprite: Array<cc.Sprite> = [];

    @property([cc.Sprite])
    baiSprite: Array<cc.Sprite> = [];

    @property([cc.Sprite])
    qianSprite: Array<cc.Sprite> = [];

    @property({ type: cc.Integer, visible: true })
    get spriteName() {
        return this._spriteName;
    }

    set spriteName(value: number) {
        this.setSpriteName(value);
    }
    @property(cc.SpriteAtlas)
    altas: cc.SpriteAtlas = null;

    protected start() {

    }
    setSpriteName(value: number): void {
        this._spriteName = value;
        let sp = value.toString().split('');
        let len = sp.length;
        let ar: Array<cc.Sprite> = null;
        switch (len) {
            case 1:
                {
                    ar = this.geSprite;
                    this.shiSprite.forEach(element => {
                        element.node.active = false;
                    });
                    this.baiSprite.forEach(element => {
                        element.node.active = false;
                    });
                    this.qianSprite.forEach(element => {
                        element.node.active = false;
                    });

                }
                break;
            case 2:
                ar = this.shiSprite;

                this.geSprite.forEach(element => {
                    element.node.active = false;
                });
                this.baiSprite.forEach(element => {
                    element.node.active = false;
                });
                this.qianSprite.forEach(element => {
                    element.node.active = false;
                });
                break;
            case 3:
                ar = this.baiSprite;
                this.geSprite.forEach(element => {
                    element.node.active = false;
                });
                this.shiSprite.forEach(element => {
                    element.node.active = false;
                });
                this.qianSprite.forEach(element => {
                    element.node.active = false;
                });
                break;
            case 4:
                ar = this.qianSprite;
                this.geSprite.forEach(element => {
                    element.node.active = false;
                });
                this.shiSprite.forEach(element => {
                    element.node.active = false;
                });
                this.baiSprite.forEach(element => {
                    element.node.active = false;
                });
                break;
        }

        for (let i = 0; i < len; i++) {
            ar[i].node.active = true;
            ar[i].spriteFrame = this.altas.getSpriteFrame(sp[i]);
        }
    }
}
