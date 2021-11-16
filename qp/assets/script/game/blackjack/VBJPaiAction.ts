import UNodeHelper from "../../common/utility/UNodeHelper";
import { UIBJPoker, UIBJFanPai } from "./UBJData";
import USpriteFrames from "../../common/base/USpriteFrames";
import UHandler from "../../common/utility/UHandler";
import VPokerAnimation from "./VBJPokerAnimation";
import { BJ_ZHUANGJIA_SEAT, BJ_SELF_SEAT } from "./MBJ";
import UDebug from "../../common/utility/UDebug";
import UPointLogic from "./help/UPointLogic";
import UAudioManager from "../../common/base/UAudioManager";
import UBJMusic from "./UBJMusic";


/**
 * 创建:gss
 * 作用:展示翻牌效果(加了这个多了 30-40个drawcall 如果低端机性能有问题 那么再找美术做动画)
 */
export default class VBJPaiAction {
    /**扑克牌长度  两手牌 一手最多5张*/
    private _pokerLen = 5;
    /**扑克牌组 */
    public _pokerArr: cc.Sprite[][];
    /**扑克牌1 */
    public _poker1: cc.Sprite;
    /**扑克牌2 */
    public _poker2: cc.Sprite;
    /**扑克牌3 */
    public _poker3: cc.Sprite;
    /**扑克牌4 */
    public _poker4: cc.Sprite;
    /**扑克牌5 */
    public _poker5: cc.Sprite;
    /**
     * 扑克牌节点
     */
    public _pokerRoot: cc.Node;
    /**牌型动画 */
    private _paixingAnim: sp.Skeleton[];

    private _fanpaiAnim: Array<sp.Skeleton>;
    /**看牌 */
    private _seePaiAction: cc.Animation;

    private _fanpaiNode: cc.Node;
    //计算器
    private _jisuanqi: UPointLogic;
    //牌资源前缀
    public _prePokeName: string = "poker_"
    /**
     * 是否在运行
     */
    private _run: boolean;
    /**资源 */
    private _res: USpriteFrames;
    /**两幅扑克牌的数据 */
    private _poker: UIBJPoker[];
    //牌的当前位置
    private _pokerPos: cc.Vec2[][]; //不含一手
    //牌的初始位置
    public _pokerInItPos: cc.Vec2[][];
    public _pokeInItrOnePos: cc.Vec2[]; //分牌后一手的位置
    private _oriScale: number;

    private _fapaiActArr: VPokerAnimation[][];

    private _baopaiImg_1: cc.Sprite;
    private _baopaiImg_2: cc.Sprite;
    public _sbImg_1: cc.Sprite;  //双倍牌型图片
    public _sbImg_2: cc.Sprite;  //双倍牌型
    private _winImg_1: cc.Sprite;  //胜利点数图片
    private _winImg_2: cc.Sprite;  //胜利点数图片
    public _fapaiAct1: VPokerAnimation;
    public _fapaiAct2: VPokerAnimation;
    public _fapaiAct3: VPokerAnimation;
    public _fapaiAct4: VPokerAnimation;
    public _fapaiAct5: VPokerAnimation;
    private _animation: string;
    private _ori: cc.Vec2;
    private _playQipaiAction: boolean;
    private _fanDelay: boolean;

    public _totalPointsImg_1: cc.Sprite;
    private _totalPointsImg_2: cc.Sprite;
    private _totalPointsNum_1: cc.Label;
    private _totalPointsNum_2: cc.Label;
    private _dealtimepoke: number = 0.1;

    private _isfenpai: boolean;  //是否分牌过

    /**
     * 音乐播放器
     */
    private _music: UBJMusic;
    get getMusic(): UBJMusic {
        return this._music;
    }
    /**跑 */
    get run(): boolean {
        return this._run;
    }

    constructor(seatId: number, root: cc.Node, fanpan: cc.Node, paixing: cc.Node, res: USpriteFrames) {

        this._music = new UBJMusic();
        this._jisuanqi = new UPointLogic()
        this._animation = "blue1";
        this._fanpaiAnim = [];
        //this._oriScale = seatId == BJ_SELF_SEAT ? 0.67 : 1;
        this._oriScale = 0.35;
        this._playQipaiAction = seatId != BJ_SELF_SEAT;
        this._pokerRoot = root;
        this._res = res;
        this._fanDelay = seatId == BJ_SELF_SEAT;
        this._isfenpai = false;

        this._poker = new Array()
        this._pokerArr = new Array();
        this._pokerPos = new Array();
        this._pokerInItPos = new Array();
        this._pokeInItrOnePos = new Array();
        this._fapaiActArr = new Array();
        for (let i = 0; i <= 1; i++) {
            this._pokerArr[i] = new Array();
            this._pokerPos[i] = new Array();
            this._pokerInItPos[i] = new Array();
            this._poker[i] = new UIBJPoker()
            this._poker[i].pokerIcons = new Array<number>()
            this._fapaiActArr[i] = new Array();
            for (let j = 1; j <= this._pokerLen; j++) {
                let temp = i * 5 + j
                this._pokerArr[i][j - 1] = UNodeHelper.getComponent(this._pokerRoot, "gf_poker" + temp, cc.Sprite);
                this._pokerPos[i].push(new cc.Vec2(this._pokerArr[i][j - 1].node.x, this._pokerArr[i][j - 1].node.y));
                //未分牌 大牌和二手小牌位置
                this._pokerInItPos[i].push(new cc.Vec2(this._pokerArr[i][j - 1].node.x, this._pokerArr[i][j - 1].node.y));
                this._fapaiActArr[i][j - 1] = this._pokerArr[i][j - 1].getComponent(VPokerAnimation);
            }
        }

        for (let i = 1; i <= this._pokerLen; i++) //分牌 一手小牌位置
        {
            let pos = UNodeHelper.getComponent(this._pokerRoot, "pokerpos_" + i, cc.Sprite);
            this._pokeInItrOnePos.push(new cc.Vec2(pos.node.x, pos.node.y))
            pos.node.active = false
        }
        this._totalPointsImg_1 = UNodeHelper.getComponent(this._pokerRoot, "totalPointsImg_1", cc.Sprite);
        this._totalPointsImg_2 = UNodeHelper.getComponent(this._pokerRoot, "totalPointsImg_2", cc.Sprite);
        this._baopaiImg_1 = UNodeHelper.getComponent(this._pokerRoot, "baopaiImg0", cc.Sprite);
        this._baopaiImg_2 = UNodeHelper.getComponent(this._pokerRoot, "baopaiImg1", cc.Sprite);
        this._totalPointsNum_1 = UNodeHelper.getComponent(this._pokerRoot, "pointsNum_1", cc.Label);
        this._totalPointsNum_2 = UNodeHelper.getComponent(this._pokerRoot, "pointsNum_2", cc.Label);
        this._sbImg_1 = UNodeHelper.getComponent(this._pokerRoot, "sbimg1", cc.Sprite);
        this._sbImg_2 = UNodeHelper.getComponent(this._pokerRoot, "sbimg2", cc.Sprite);
        this._baopaiImg_1.node.active = false;
        this._baopaiImg_2.node.active = false;
        this._sbImg_1.node.active = false;
        this._sbImg_2.node.active = false;
        this._winImg_1 = UNodeHelper.getComponent(this._pokerRoot, "winImg_1", cc.Sprite);
        this._winImg_2 = UNodeHelper.getComponent(this._pokerRoot, "winImg_2", cc.Sprite);
        this._winImg_1.node.active = false;
        this._winImg_2.node.active = false;

        this._ori = new cc.Vec2(this._pokerRoot.x, this._pokerRoot.y);
        this._paixingAnim = new Array()
        for (let i = 0; i < 3; i++)  // 0中间位置  1 左边位置 2 右边位置 
        {
            this._paixingAnim[i] = UNodeHelper.find(paixing, "pokeType_" + i).getComponent(sp.Skeleton);
            this._paixingAnim[i].node.active = false
        }


        let len = fanpan.childrenCount;
        this._fanpaiNode = fanpan;
        for (let i = 0; i < len; i++) {
            const element = fanpan.children[i];
            let ani = element.getComponent(sp.Skeleton);
            if (ani) {
                this._fanpaiAnim.push(ani);
            }
        }
        this.showback();

        //this._seePaiAction = this._pokerRoot.getComponent(cc.Animation);
    }
    resetTransform(): void {
        //this._pokerRoot.opacity = 255;
        this._isfenpai = false;
        for (let i = 0; i <= 1; i++) {
            for (let j = 0; j < this._pokerLen; j++) {
                this._pokerArr[i][j].node.active = false //测试修改  
                this._pokerArr[i][j].node.setPosition(this._pokerInItPos[i][j].x, this._pokerInItPos[i][j].y);
                //this. _pokerArr[i][j].node.setRotation(0);
                this._pokerArr[i][j].node.setScale(this._oriScale);
                this._pokerPos[i][j] = this._pokerInItPos[i][j]
            }

        }
    }
    showback(): void {
        for (let i = 0; i <= 1; i++) {
            for (let j = 0; j < this._pokerLen; j++) {
                this._pokerArr[i][j].spriteFrame = this.getRes("poker_b1");
            }
        }
        this._totalPointsImg_1.node.active = false;
        this._totalPointsImg_2.node.active = false;
        this._totalPointsNum_1.node.active = false;
        this._totalPointsNum_2.node.active = false;

    }

    /**手牌位置 0表示叠加灰色 1表示正常  */
    setState(value: number, handindex?: number): void {
        if (handindex == null) return
        for (let j = 0; j < this._pokerLen; j++) {
            if (this._pokerArr[handindex].length > j) {
                this._fapaiActArr[handindex][j].setState(value);
            }
            else {
                this._pokerArr[handindex][j].node.active = false
            }

        }
    }
    /**弃牌时候牌变灰 */
    playqipai(end: cc.Vec2): void {
        return
        //this.grayState();
        this.resetTransform();
        if (this._playQipaiAction) {
            let action = cc.spawn(cc.moveTo(0.5, end), cc.fadeTo(0.5, 50));
            this._pokerRoot.runAction(cc.sequence(action, cc.callFunc(() => {
                this._pokerRoot.setPosition(this._ori);
                this._pokerRoot.opacity = 255;
            }, this)));
        }
    }
    /**播放看片 */
    playSeePai(): void {
        if (this._seePaiAction) {
            this.showkanpai(true);
            this._seePaiAction.play();
        }
    }
    /**
     * 发牌
     * @param seatId 
     */
    playfapai(start: cc.Vec3, handler?: UHandler): void {
        this.resetTransform();
        start = this._pokerRoot.convertToNodeSpaceAR(start);
        // this._fapaiAct1.playFapai(start, this._pokerPosX[0], this._oriScale, 0);
        // this._fapaiAct2.playFapai(start, this._pokerPosX[1], this._oriScale, 0.1);
        // this._fapaiAct3.playFapai(start, this._pokerPosX[2], this._oriScale, 0.2);
        // this._fapaiAct4.playFapai(start, this._pokerPosX[3], this._oriScale, 0.3);
        // this._fapaiAct5.playFapai(start, this._pokerPosX[4], this._oriScale, 0.4, handler);
    }
    /**
   * 单张发牌
   * @param seatId 
   */
    playfapaiOne(isOneHand: boolean, start: cc.Vec3, data: UIBJFanPai, handler?: UHandler): void {
        //this.resetTransform();
        this._totalPointsImg_1.scheduleOnce(() => {

            let handPos = isOneHand ? 0 : 1
            if (data.showNum) {
                for (const key in data.poker.pokerIcons) {
                    this._poker[handPos].pokerIcons.push(data.poker.pokerIcons[key]);
                    this._poker[handPos].pokerType = data.poker.pokerType
                }
            }
            let playPos = this._poker[handPos].pokerIcons.length - 1;
            if (!data.showNum) {
                playPos = 1
            }
            //庄家开第二张牌
            if (data.seatId == BJ_ZHUANGJIA_SEAT && this._poker[handPos].pokerIcons.length == 2) {
                UAudioManager.ins.playSound("audio_sendcard");
                //this._pokerArr[0][0].scheduleOnce(() => {
                this.arrangePoke(this._poker[0].pokerIcons.length) //移动大牌
                //this._pokerArr[0][0].unscheduleAllCallbacks()
                //},0.5*data.deal)
                if (data.showNum) {
                    let resName = data.poker.pokerIcons[0]
                    //this._pokerArr[handPos][playPos].spriteFrame = this.getRes(this._prePokeName+resName);

                    let fapaihandler = UHandler.create(() => {
                        if (data.poker.pokerType == "2") {
                            //this.setPoint(handPos); //牌点

                            //this._totalPointsNum_1.scheduleOnce(() => {
                            // if (data.poker.pokerType == "2" )  //解决牌点结束未刷新
                            // {
                            this.setPointMax(0)
                            // }
                            if (handler) handler.run()
                            //},data.deal)
                        }
                        else {
                            this.playpaiPaiover(data.poker.pokerType, handPos, handler)  //暂不翻牌
                        }

                    }, this, true)
                    this.playFanPaiOne(resName, fapaihandler)  //翻牌
                    return
                }

            }
            //普通发牌
            start = this._pokerRoot.convertToNodeSpaceAR(start);


            //UDebug.Info(data.poker.pokerIcons)
            //this._fapaiAct5.playFapai(start, this._pokerPosX[index], this._oriScale, 0.1*deal, handler);
            this._fapaiActArr[handPos][playPos].playFapai(start, this._pokerPos[handPos][playPos], this._oriScale, 0,
                UHandler.create(() => {
                    //this._canGetCmd = true;
                    UAudioManager.ins.playSound("audio_sendcard");
                    //this._pokerArr[0][0].scheduleOnce(() => {
                    this.arrangePoke(this._poker[0].pokerIcons.length) //移动大牌
                    //this._pokerArr[0][0].unscheduleAllCallbacks()
                    //},0.5*data.deal)
                    if (data.showNum) {
                        let resName = data.poker.pokerIcons[0]
                        this._pokerArr[handPos][playPos].spriteFrame = this.getRes(this._prePokeName + resName);
                    }
                    else {
                        this._pokerArr[handPos][playPos].spriteFrame = this.getRes(this._prePokeName + "b1")
                        for (let j = 0; j < this._pokerLen; j++) //将庄家一手移动
                        {

                            //this. _pokerArr[0][j].node.stopAllActions();
                            this._pokerArr[0][j].node.setRotation(0)
                            this._pokerArr[0][j].node.setPosition(this._pokerInItPos[0][j].x + 17.5 * 2, this._pokerInItPos[0][j].y);
                        }
                    }
                    if (data.poker.pokerType == "2" && this._poker[handPos].pokerIcons.length > 1) {

                        this.setPoint(handPos); //牌点
                        //this._totalPointsNum_2.scheduleOnce(() => {
                        if (handler != null) {
                            handler.run()
                        }
                        //},data.deal)
                    }
                    else {
                        // if(this._poker[handPos].pokerIcons.length ==1)
                        // {
                        //     if (handler)  //第一次发牌不买保险
                        //     {
                        //         handler.run() 
                        //     } 
                        // }
                        if (this._poker[handPos].pokerIcons.length > 1) {
                            this.playpaiPaiover(data.poker.pokerType, handPos, handler)  //暂不翻牌
                        }


                    }
                    if (data.seatId == BJ_ZHUANGJIA_SEAT) {
                        if (data.poker.pokerType == "2") {
                            this.setPointMax(0)
                        }

                    }
                    //this.arrangePoke( this._poker[0].pokerIcons.length) //移动大牌
                    // for(let k= 0;k <2;k++)
                    // {

                    //     for(let i = 0 ;i<5 ;i++)
                    //     {
                    //         this. _pokerArr[k][i].node.setPosition(this._pokerPos[k][i]);

                    //     }     
                    // } 

                }, this)
            );

        }, data.deal)
    }

    //** 庄家翻牌动画 牌资源名*/ 
    private playFanPaiOne(resName: number, hander: UHandler) {
        this._pokerArr[0][1].node.stopAllActions()
        this._pokerArr[0][1].node.runAction(cc.sequence(cc.scaleTo(0.1, 0.01, 1.15), cc.callFunc((node) => {
            //加载牌
            this._pokerArr[0][1].spriteFrame = this.getRes(this._prePokeName + resName);
        }, this), cc.scaleTo(0.05, 0.7), cc.delayTime(0.1), cc.scaleTo(0.1, this._oriScale), cc.callFunc(() => {
            if (hander) hander.run();
        })))

    }
    /**
     * 播放翻牌动画
     * @param poker 
     */
    playFanPai(poker: UIBJPoker, withAnimation: boolean, hander?: UHandler): void {
        /*
        this._poker = poker;
        this.resetTransform();
        if (withAnimation) {
            this._pokerRoot.active = false;
            this._fanpaiNode.active = true;
            let len = this._fanpaiAnim.length;
            for (let i = 0; i < len; i++) {
                const element = this._fanpaiAnim[i];
                element.setAnimation(0, this._animation, false);
                if (i == 0) {
                    element.setCompleteListener(() => {
                        //this.playpaiPaiover();
                        this._fanpaiNode.active = false;
                        this._pokerRoot.active = true;
                        
                        this._poker1.spriteFrame = this.getRes(this._prePokeName+this._poker.pokerIcons[0]);
                        this._poker2.spriteFrame = this.getRes(this._prePokeName+this._poker.pokerIcons[1]);
                        this._poker3.spriteFrame = this.getRes(this._prePokeName+this._poker.pokerIcons[2]);

                        this.playPokerAction(this._poker1.node);
                        this.playPokerAction(this._poker2.node);
                        this.playPokerAction(this._poker3.node, UHandler.create(() => {

                            //this.playpaiPaiover();
                            if (hander) hander.run();

                        }, this));
                    });
                }
            }
        } else {
            this._poker1.spriteFrame = this.getRes(this._prePokeName+this._poker.pokerIcons[0]);
            this._poker2.spriteFrame = this.getRes(this._prePokeName+this._poker.pokerIcons[1]);
            this._poker3.spriteFrame = this.getRes(this._prePokeName+this._poker.pokerIcons[2]);
            //this.playpaiPaiover();
            if (hander) hander.run();
        }
        */
    }

    /**
  * 播放翻单张牌动画
  * @param poker 
  */
    /*
    playFanPaiOne(poker: UIBJPoker,index:number, withAnimation: boolean, hander?: UHandler): void {
        
        this._poker = poker;
        this.resetTransform();
        if (withAnimation) {
            this._pokerRoot.active = false;
            this._fanpaiNode.active = true;
            let len = this._fanpaiAnim.length;
            for (let i = 0; i < len; i++) {
                const element = this._fanpaiAnim[i];
                element.setAnimation(0, this._animation, false);
                if (i == 0) {
                    element.setCompleteListener(() => {
                        //this.playpaiPaiover();
                        this._fanpaiNode.active = false;
                        this._pokerRoot.active = true;
                        this._pokerArr[index].spriteFrame = this.getRes(this._prePokeName+this._poker.pokerIcons[index]);
                        this.playPokerAction(this._pokerArr[index].node, UHandler.create(() => {

                           // this.playpaiPaiover();
                            if (hander) hander.run();

                        }, this));
                    });
                }
            }
        } else {
            this._fanpaiNode.active = false;
            this._pokerArr[index].spriteFrame = this.getRes(this._prePokeName+this._poker.pokerIcons[index]);
            //this.playpaiPaiover();
            if (hander) hander.run();
        }
        
    }
    */
    //** 发牌后整理扑克  */
    private arrangePoke(len: number): void {
        if (!this._isfenpai) //不是分牌就移动
        {
            switch (len) {

                case 1:
                    this._pokerArr[0][0].node.setRotation(0)
                    this._pokerArr[0][0].node.setPosition(this._pokerInItPos[0][0].x + 17.5 * 2, this._pokerInItPos[0][0].y);
                    break
                case 2:
                    for (let j = 0; j < this._pokerLen; j++) //将一手移动
                    {

                        //this. _pokerArr[0][j].node.stopAllActions();
                        this._pokerArr[0][j].node.setRotation(0)
                        this._pokerArr[0][j].node.setPosition(this._pokerInItPos[0][j].x + 17.5 * 2, this._pokerInItPos[0][j].y);
                    }
                    break
                case 3:
                    for (let j = 0; j < this._pokerLen; j++) //将一手移动
                    {

                        //this. _pokerArr[0][j].node.stopAllActions();
                        this._pokerArr[0][j].node.setRotation(0)
                        this._pokerArr[0][j].node.setPosition(this._pokerInItPos[0][j].x + 18.2, this._pokerInItPos[0][j].y);
                    }
                    break
                case 4:
                    for (let j = 0; j < this._pokerLen; j++) //将一手移动
                    {

                        //this. _pokerArr[0][j].node.stopAllActions();
                        this._pokerArr[0][j].node.setRotation(0)
                        this._pokerArr[0][j].node.setPosition(this._pokerInItPos[0][j].x + 10, this._pokerInItPos[0][j].y);
                    }
                    break
                case 5:
                    for (let j = 0; j < this._pokerLen; j++) //将一手移动
                    {

                        //this. _pokerArr[0][j].node.stopAllActions();
                        this._pokerArr[0][j].node.setRotation(0)
                        this._pokerArr[0][j].node.setPosition(this._pokerInItPos[0][j].x, this._pokerInItPos[0][j].y);
                    }
                    break
                default:
                    for (let j = 0; j < this._pokerLen; j++) //将一手移动
                    {

                        //this. _pokerArr[0][j].node.stopAllActions();
                        this._pokerArr[0][j].node.setRotation(0)
                        this._pokerArr[0][j].node.setPosition(this._pokerInItPos[0][j].x, this._pokerInItPos[0][j].y);
                    }
                    break
            }

        }
    }
    //**设置双倍图片位置  几手牌*/
    setsbImgPos(id: number) {

        let pos = this._poker[id].pokerIcons.length;
        let offsetX = 13;
        let offsetY = 0;
        //是否分牌
        if (this._isfenpai) {
            if (id == 0) {
                this._sbImg_1.node.setScale(1)
                this._sbImg_1.node.active = true;
                this._sbImg_1.node.setPosition(this._pokeInItrOnePos[pos].x + offsetX, this._sbImg_1.node.y + offsetY)
            }
            else if (id == 1) {
                this._sbImg_2.node.setScale(1)
                this._sbImg_2.node.active = true;
                this._sbImg_2.node.setPosition(this._pokerInItPos[1][pos].x + offsetX, this._sbImg_2.node.y + offsetY)


                let pos0 = this._poker[0].pokerIcons.length - 1;
                this._sbImg_1.node.setScale(1)
                this._sbImg_1.node.setPosition(this._pokeInItrOnePos[pos0].x + offsetX, this._sbImg_1.node.y + offsetY)
            }
        }
        else {
            offsetX = 31.5;
            offsetY = 0;
            this._sbImg_1.node.setScale(1)
            this._sbImg_1.node.active = true;
            this._sbImg_1.node.setPosition(this._pokerInItPos[0][pos].x + offsetX, this._sbImg_1.node.y + offsetY)
        }
        //手牌位置




    }
    free(): void {
        this._totalPointsImg_1.node.active = false;
        this._totalPointsImg_2.node.active = false;
        this._totalPointsNum_1.node.active = false;
        this._totalPointsNum_2.node.active = false;
        this._baopaiImg_1.node.active = false;
        this._baopaiImg_2.node.active = false;
        this._winImg_1.node.active = false;
        this._winImg_2.node.active = false;

        this._sbImg_1.node.active = false;
        this._sbImg_2.node.active = false;
        this._totalPointsNum_1.node.color = new cc.Color(255, 255, 255)
        this._totalPointsNum_2.node.color = new cc.Color(255, 255, 255)

        this._poker[0].pokerType = "2"
        this._poker[0].pokerIcons = new Array<number>()
        this._poker[1].pokerType = "2"
        this._poker[1].pokerIcons = new Array<number>()
        this._pokerRoot.stopAllActions();
        this.resetTransform();
        for (let i = 0; i < 3; i++) {
            this._paixingAnim[i].node.active = false
        }

        this._isfenpai = false;
    }
    private showkanpai(value: boolean) {
        if (this._seePaiAction) {
            this._seePaiAction.enabled = value;
            this._seePaiAction.setCurrentTime(0);
        }
    }

    public getRes(name: string): cc.SpriteFrame {
        return this._res.getFrames(name);
    }
    /**翻牌动作播放完毕 牌型*/
    private playpaiPaiover(typeCard: string, index: number, handler?: UHandler): void {



        let AniName = "None"
        switch (typeCard) {
            case "1":
                AniName = "bust"
                this._music.playBomb();
                // UAudioManager.ins.playSound("audio_21_bomb");
                if (index == 0) {

                    this._totalPointsNum_1.unscheduleAllCallbacks()
                    //this._totalPointsNum_1.node.color = new cc.Color(255,0,0)
                    //this._totalPointsNum_1.string = "爆牌"
                    this._baopaiImg_1.node.active = true;
                    this._totalPointsImg_1.node.active = false;
                    this._totalPointsNum_1.node.active = false;
                }
                else {

                    this._totalPointsNum_2.unscheduleAllCallbacks()
                    // this._totalPointsNum_2.node.color = new cc.Color(255,0,0)
                    //this._totalPointsNum_2.string = "爆牌"
                    this._baopaiImg_2.node.active = true;
                    this._totalPointsImg_2.node.active = false;
                    this._totalPointsNum_2.node.active = false;
                }

                break
            case "2":
                AniName = "None"
                if (this._isfenpai) {
                    this._paixingAnim[index + 1].node.active = false;
                }
                else {
                    this._paixingAnim[0].node.active = false;
                }

                if (index == 0) {
                    this._totalPointsImg_1.node.active = true;
                }
                else {
                    this._totalPointsImg_2.node.active = true;
                }

                break
            case "3":
                AniName = "wxl"
                //this.setPoint(index); //牌点
                if (index == 0) {
                    this._totalPointsNum_1.unscheduleAllCallbacks()
                    this._totalPointsImg_1.node.active = false;
                    this._totalPointsNum_1.node.active = false;
                }
                else {

                    this._totalPointsNum_2.unscheduleAllCallbacks()
                    this._totalPointsImg_2.node.active = false;
                    this._totalPointsNum_2.node.active = false;
                }
                break
            case "4":
                AniName = "21d"
                //this.setPoint(index); //牌点
                if (index == 0) {

                    this._totalPointsNum_1.unscheduleAllCallbacks()
                    this._totalPointsImg_1.node.active = false;
                    this._totalPointsNum_1.node.active = false;
                }
                else {

                    this._totalPointsNum_2.unscheduleAllCallbacks()
                    this._totalPointsImg_2.node.active = false;
                    this._totalPointsNum_2.node.active = false;
                }
                // UAudioManager.ins.playSound("audio_21_black");
                this._music.playBlack();
                break
            default:
                AniName = "None"
                if (this._isfenpai) {
                    this._paixingAnim[index + 1].node.active = false;
                }
                else {
                    this._paixingAnim[0].node.active = false;
                }
                break

        }
        if (AniName != "None") {

            if (this._isfenpai) {
                this._paixingAnim[index + 1].node.active = true;
                this._paixingAnim[index + 1].setAnimation(0, AniName, false);
                this._paixingAnim[index + 1].setCompleteListener((event) => {
                    if (handler != null) handler.run();
                });
            }
            else {
                this._paixingAnim[0].node.active = true;
                this._paixingAnim[0].setAnimation(0, AniName, false);
                this._paixingAnim[0].setCompleteListener((event) => {
                    if (handler != null) handler.run();
                });
            }
        }
        if (typeCard == "0") //庄家最后一张保险
        {
            if (handler != null) handler.run();
        }

    }
    private playPokerAction(poker: cc.Node, handler?: UHandler): void {
        poker.setScale(1.2, 1.2);
        let action = cc.sequence(cc.scaleTo(0.2, 1), cc.callFunc(() => {
            if (handler != null) handler.run();
        }, this));
        poker.runAction(action);
    }
    /**清空牌数据 并分牌 isvalue 是否有牌数据*/
    /*
    fenpai(isvalue?:boolean)
    {
        let offsetX = -18 ;
        let offsetY = 5 ;
        let curcard1 = 0
        let curcard2 = 0
        if(isvalue)
        {
            curcard1 = this._poker[0].pokerIcons[0]  //第一张牌值
            curcard2 = this._poker[0].pokerIcons[1]  //第二张牌值
        }
        
        this.clear()
        for(let i = 0 ; i<2 ; i++)
        {
            for(let j = 0 ;j< this._pokerLen;j++)
            {  
                this._pokerArr[i][j].node.setScale (0.4)
            }

        }

            for(let j = 0 ;j< this._pokerLen;j++) //将一手移动
            {
                if (j>1)
                {
                    offsetX =  -72 
                    offsetY =  -20
                }
                this._pokerPos[0][j] = new  cc.Vec2( this._pokerInItPos[0][j].x+offsetX, this. _pokerInItPos[0][j].y+offsetY)
                
             
                this. _pokerArr[0][j].node.setPosition(this._pokerPos[0][j].x,this._pokerPos[0][j].y);
                
                this. _pokerArr[0][j].node.setRotation(0);
                this. _pokerArr[0][j].node.setScale(0.4);
                this. _pokerArr[0][j].node.active = false //测试修改 
            }
            if (isvalue) //赋值
            {
                this._poker[0].pokerIcons  = new Array<number>()
                this._poker[1].pokerIcons  = new Array<number>()
                this._poker[0].pokerIcons[0] =curcard1
                this._poker[1].pokerIcons[0] =curcard2
                for(let i = 0 ; i<2 ; i++)
                {
                    let resName = this._poker[i].pokerIcons[0]
                    //resName= 1  //测试修改
                    this._pokerArr[i][0].spriteFrame = this.getRes(this._prePokeName+resName);
                    this._pokerArr[i][0].node.active = true 

                 
                }
            }

        this._isfenpai = true; 
      
    }
    */
    fenpai(isvalue?: boolean) {
        let offsetX = -18;
        let offsetY = 5;
        let curcard1 = 0
        let curcard2 = 0
        if (isvalue) {
            curcard1 = this._poker[0].pokerIcons[0]  //第一张牌值
            curcard2 = this._poker[0].pokerIcons[1]  //第二张牌值
        }

        this.clear()
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < this._pokerLen; j++) {
                this._pokerArr[i][j].node.setScale(0.35)
            }

        }

        for (let j = 0; j < this._pokerLen; j++) //将一手移动
        {
            this._pokerPos[0][j] = new cc.Vec2(this._pokeInItrOnePos[j].x, this._pokeInItrOnePos[j].y)


            this._pokerArr[0][j].node.setPosition(this._pokerPos[0][j].x, this._pokerPos[0][j].y);

            //this. _pokerArr[0][j].node.setRotation(0);
            this._pokerArr[0][j].node.setScale(0.35);
            this._pokerArr[0][j].node.active = false //测试修改 
        }
        if (isvalue) //赋值
        {
            this._poker[0].pokerIcons = new Array<number>()
            this._poker[1].pokerIcons = new Array<number>()
            this._poker[0].pokerIcons[0] = curcard1
            this._poker[1].pokerIcons[0] = curcard2
            for (let i = 0; i < 2; i++) {
                let resName = this._poker[i].pokerIcons[0]
                //resName= 1  //测试修改
                this._pokerArr[i][0].spriteFrame = this.getRes(this._prePokeName + resName);
                this._pokerArr[i][0].node.active = true


            }
        }

        this._isfenpai = true;

    }
    //显示点数 第一手牌 0  第二手牌1
    private setPoint(index: number): void {
        let point = ""

        //计算点数
        if (this._poker[index].pokerIcons.length > 1) {

            if (index == 0) {
                point = this._jisuanqi.getPokerArrPoint(this._poker[0].pokerIcons)
                //this._totalPointsNum_1.unscheduleAllCallbacks()
                //this._totalPointsNum_1.scheduleOnce(() => {
                this._totalPointsNum_1.string = point
                this._totalPointsImg_1.node.active = true;
                this._totalPointsNum_1.node.active = true;
                //},this._dealtimepoke)
            }
            else if (index == 1) {
                if (this._isfenpai) {
                    point = this._jisuanqi.getPokerArrPoint(this._poker[1].pokerIcons)
                    //this._totalPointsNum_2.unscheduleAllCallbacks()
                    //this._totalPointsNum_2.scheduleOnce(() => {
                    this._totalPointsNum_2.string = point
                    this._totalPointsImg_2.node.active = true;
                    //this._totalPointsNum_1.node.active =true;
                    this._totalPointsNum_2.node.active = true;
                    //},this._dealtimepoke)
                }
            }
            else {
                this._totalPointsImg_1.node.active = false;
                this._totalPointsImg_2.node.active = false;
                this._totalPointsNum_1.node.active = false;
                this._totalPointsNum_2.node.active = false;

            }
        }
    }

    //显示最大点数 第一手牌 0  第二手牌1
    setPointMax(index: number): void {



        let point = ""

        //计算点数
        if (this._poker[index].pokerIcons.length > 1) {

            if (index == 0) {

                this._totalPointsNum_1.scheduleOnce(() => {
                    if (this._poker[0].pokerType == "2") {
                        point = this._jisuanqi.getPokerArrPointMax(this._poker[0].pokerIcons)
                        this._totalPointsNum_1.string = point
                        this._totalPointsImg_1.node.active = true;
                        this._totalPointsNum_1.node.active = true;
                    }

                }, 0.2)
            }
            else if (index == 1) {
                if (this._isfenpai) {

                    this._totalPointsNum_2.scheduleOnce(() => {
                        if (this._poker[1].pokerType == "2") {
                            point = this._jisuanqi.getPokerArrPointMax(this._poker[1].pokerIcons)
                            this._totalPointsNum_2.string = point
                            this._totalPointsImg_2.node.active = true;
                            //this._totalPointsNum_1.node.active =true;
                            this._totalPointsNum_2.node.active = true;

                        }
                    }, 0.2)
                }

            }
            else {
                this._totalPointsImg_1.node.active = false;
                this._totalPointsImg_2.node.active = false;
                this._totalPointsNum_1.node.active = false;
                this._totalPointsNum_2.node.active = false;

            }
        }

    }
    /**显示 第几手牌赢 */
    setWin(index: number): void {
        if (index == 0) {
            this._winImg_1.node.active = true;

        }

        else if (index == 1) {
            this._winImg_2.node.active = true;
        }
        else {
            this._winImg_1.node.active = false;
            this._winImg_2.node.active = false;
        }
    }

    clear(): void {

        this._poker[0] = new UIBJPoker()
        this._pokerPos[0] = new Array()
        this._poker[1] = new UIBJPoker()
        this._pokerPos[1] = new Array()
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 5; j++) {
                this._fapaiActArr[i][j].free();
                this._pokerArr[i][j].node.setScale(this._oriScale)
                this._pokerArr[i][j].spriteFrame = this.getRes(this._prePokeName + "b1")
            }
        }
        this.free()
    }
}

