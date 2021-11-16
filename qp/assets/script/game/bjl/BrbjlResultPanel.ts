import { ECommonUI, EGameType } from "../../common/base/UAllenum";
import USpriteFrames from "../../common/base/USpriteFrames";
import { Bjl } from "../../common/cmd/proto";
import UDebug from "../../common/utility/UDebug";
import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "../../public/base/AppGame";
import MBrbjl from "./model/MBrbjl";
import UBrbjlMusic from "./UBrbjlMusic";
import VBrbjlScene from "./VBrbjlScene";


const { ccclass, property } = cc._decorator;
@ccclass
export default class BrbjlResultPanel extends cc.Component {

    @property(sp.Skeleton) fapaiSpine: sp.Skeleton = null; // 发牌动画节点 
    @property(sp.Skeleton) winSpine: sp.Skeleton = null; // 输赢动画
    @property(cc.Node) xian_card1: cc.Node = null; // 闲card1
    @property(cc.Node) xian_card2: cc.Node = null; // 闲card2
    @property(cc.Node) xian_card3: cc.Node = null; // 闲card3
    @property(cc.Node) zhuang_card1: cc.Node = null; // 庄card1
    @property(cc.Node) zhuang_card2: cc.Node = null; // 庄card2
    @property(cc.Node) zhuang_card3: cc.Node = null; // 庄card3

    @property(cc.Label) xian_dlab: cc.Label = null; // 闲点数lab
    @property(cc.Label) zhuang_dlab: cc.Label = null; // 庄点数lab
    @property(cc.Node) xian_bg: cc.Node = null; // 
    @property(cc.Node) zhuang_bg: cc.Node = null; // 

    @property(cc.Node) win_lab: cc.Node = null; // winlab
    @property([cc.Node])
    allNode: Array<cc.Node> = [];
    resultData: any;
    _o_xianData: Array<number> = [];
    _o_zhuangData: Array<number> = [];
    _xianData: any = null;
    _zhuangData: any = null;
    _music_mgr: UBrbjlMusic = null;
    @property({ type: VBrbjlScene })
    brbjl_scene: VBrbjlScene = null;
    protected onEnable(): void {
        // AppGame.ins.roomModel.on(MRoomModel.CLIENT_RECORD_FRIEND, this.updateGameRecord, this);
        // AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_SELF_EVENT.PDK_ROOM_USER_CLICK_AGAIN_GAME, this.showAgainGameBtn, this);
        // AppGame.ins.brbjlModel.on(MBrbjl.S_GAME_START , this.onGameStart , this);
    }

    protected onDisable(): void {
        // AppGame.ins.brbjlModel.off(MBrbjl.S_GAME_START , this.onGameStart , this);

        // AppGame.ins.roomModel.off(MRoomModel.CLIENT_RECORD_FRIEND, this.updateGameRecord, this);
        // AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_SELF_EVENT.PDK_ROOM_USER_CLICK_AGAIN_GAME, this.showAgainGameBtn, this);
    }

    onGameStart() {
        this.node.active = false;
        cc.warn("隐藏开牌-----------");
        this.resetCards();
    }

    resetWinSpine() {
        this.winSpine.node.active = false;
    }

    resetCards() {
        this.xian_dlab.string = "";
        this.zhuang_dlab.string = "";
        this.xian_dlab.node.active = false;
        this.zhuang_dlab.node.active = false;
        this.zhuang_card1.opacity = 0;
        this.zhuang_card2.opacity = 0;
        this.zhuang_card3.opacity = 0;
        this.xian_card1.opacity = 0;
        this.xian_card2.opacity = 0;
        this.xian_card3.opacity = 0;
        var path1 = "ani/xp";
        var path2 = "ani/bjl_fp_shu";
        var path3 = "ani/bjl_fp_heng";
        this.winSpine.node.active = false;
        this.playSpine(path1, 'normal', this.fapaiSpine, false);
        this.playSpine(path2, 'poke_back', this.zhuang_card1.getComponent(sp.Skeleton), false)
        this.playSpine(path2, 'poke_back', this.zhuang_card2.getComponent(sp.Skeleton), false)
        this.playSpine(path3, 'H_back', this.zhuang_card3.getComponent(sp.Skeleton), false)
        this.playSpine(path2, 'poke_back', this.xian_card1.getComponent(sp.Skeleton), false)
        this.playSpine(path2, 'poke_back', this.xian_card2.getComponent(sp.Skeleton), false)
        this.playSpine(path3, 'H_back', this.xian_card3.getComponent(sp.Skeleton), false)

        this.xian_bg.active = false;
        this.zhuang_bg.active = false;
    }

    showResultPanel(data: Bjl.CMD_S_OpenCard, music_mgr: UBrbjlMusic, action: boolean = true) {
        this._music_mgr = music_mgr;
        if (data) {
            // this.resultData = data;
            this.node.active = true;
            this.openCard(data.cards, action);
        }
    }



    // 游戏结算
    onGameEnd(data: Bjl.CMD_S_GameEnd, action: boolean = true) {
        this.resultData = data;
        this.node.active = true;
        cc.warn("-------游戏结算消息-------------"+JSON.stringify(data));
        this.openCard(data.deskData.cards,action, false);
        this.playWinSpine();
    }

    /**
    * 开牌
    * @param action 是否播放动画
    */
    openCard(cards: Array<Bjl.ICardGroup>, action: boolean = true, isEndFlag: boolean = true) {
        if(this.brbjl_scene._game_status != 7 && this.brbjl_scene._game_status != 3) return;
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];

            if (card.groupId == Bjl.JET_AREA.XIAN_AREA) {
                this._xianData = [];
                card.cardData.forEach(element => {
                    this._xianData.push(element & 0x0f);
                });
                this._o_xianData = card.cardData;
                // this.openCards(card.cardData, 0.2, 2.8, 0);
            } else if (card.groupId == Bjl.JET_AREA.ZHUANG_AREA) {
                this._zhuangData = card.cardData;
                this._zhuangData = [];
                card.cardData.forEach(element => {
                    this._zhuangData.push(element & 0x0f);
                });
                this._o_zhuangData = card.cardData;
                // this.openCards(card.cardData, 0.5, 3.3, 1);
            }
        }
        if(isEndFlag) {
            this.openCardsAnimation(action);
        }
    }

    getAniName(cardValue: number, isShuType: boolean = true) {
        var aniStr = ""
        var aniNum = "";
        var aniName = "";
        if (cardValue >= 1 && cardValue <= 13) {
            aniStr = "04";
            aniNum = cardValue < 10 ? (`0` + cardValue) : (cardValue + ``);
        } else if (cardValue >= 17 && cardValue <= 29) {
            aniStr = "03";
            aniNum = cardValue % 16 < 10 ? (`0` + cardValue % 16) : (cardValue % 16 + ``);
        } else if (cardValue >= 33 && cardValue <= 45) {
            aniStr = "02";
            aniNum = cardValue % 32 < 10 ? (`0` + cardValue % 32) : (cardValue % 32 + ``);

        } else if (cardValue >= 49 && cardValue <= 61) {
            aniStr = "01";
            aniNum = cardValue % 48 < 10 ? (`0` + cardValue % 48) : (cardValue % 48 + ``);
        }
        aniName = (isShuType ? 'S_' : 'H_') + aniStr + '_0' + aniNum;

        // cc.warn("动画名称-----cardValue="+cardValue+"  ----"+aniName);
        return aniName;

    }

    openCardsAnimation(action: boolean = true) {
        
        var path1 = "ani/xp";
        var path2 = "ani/bjl_fp_shu";
        var path3 = "ani/bjl_fp_heng";
        let self = this;
        var animationStr = "fapai_"
        var callBackfpBankerAnimation = () => {
            // 播放庄开牌动画之前 先显示闲点数
            self.setXianZhuang(0, 1);
            this._music_mgr.playfapai();
            self.playSpine(path2, self.getAniName(self._o_zhuangData[0], true), self.zhuang_card1.getComponent(sp.Skeleton), false, () => {

            })
            self.playSpine(path2, self.getAniName(self._o_zhuangData[1], true), self.zhuang_card2.getComponent(sp.Skeleton), false, () => {
                self.setXianZhuang(1, 1);
                if (self._o_xianData.length == 3) {
                    callBackFunctionx_3();
                } else {
                    if (self._o_zhuangData.length == 3) {
                        callBackFunctionz_3()
                    } else {
                        // 播放输赢动画
                        // self.playWinSpine();
                    }
                }
            })

        }
        var fpAnimationFunction = () => {
            self.zhuang_card2.opacity = 255;
            this._music_mgr.playfapai();
            self.playSpine(path2, self.getAniName(this._o_xianData[0], true), self.xian_card1.getComponent(sp.Skeleton), false, () => {
            })
            self.playSpine(path2, self.getAniName(this._o_xianData[1], true), self.xian_card2.getComponent(sp.Skeleton), false, callBackfpBankerAnimation)
        }

        var callBackFunctionx_2 = () => {
            self.zhuang_card1.opacity = 255;
            this._music_mgr.playfapai();
            self.playSpine(path2, 'poke_back', self.zhuang_card1.getComponent(sp.Skeleton), false, () => {
                self.playSpine(path1, animationStr + "x_02", self.fapaiSpine, false, callBackFunctionz_2)
            })
        }
        var callBackFunctionx_3 = () => {
            this._music_mgr.playfapai();
            self.playSpine(path1, animationStr + "x_03", self.fapaiSpine, false, () => {
                self.xian_card3.opacity = 255;
                self.playSpine(path3, self.getAniName(self._o_xianData[2], false), self.xian_card3.getComponent(sp.Skeleton), false, () => {
                    self.setXianZhuang(0, 2);
                    if (self._o_zhuangData.length == 3) {
                        callBackFunctionz_3()
                    } else {
                        // 播放输赢动画    
                        // self.playWinSpine();
                    }
                })
            })
        }
        var callBackFunctionz_1 = () => {
            self.xian_card1.opacity = 255;
            this._music_mgr.playfapai();
            self.playSpine(path1, animationStr + "z_01", self.fapaiSpine, false, callBackFunctionx_2)
        }
        var callBackFunctionz_2 = () => {
            this._music_mgr.playfapai();
            self.xian_card2.opacity = 255;
            self.playSpine(path1, animationStr + "z_02", self.fapaiSpine, false, fpAnimationFunction)

        }
        var callBackFunctionz_3 = () => {
            this._music_mgr.playfapai();
            self.playSpine(path1, animationStr + "z_03", self.fapaiSpine, false, () => {
                self.zhuang_card3.opacity = 255;
                self.playSpine(path3, self.getAniName(self._o_zhuangData[2], false), self.zhuang_card3.getComponent(sp.Skeleton), false, () => {
                    self.setXianZhuang(1, 2);
                    // 播放输赢动画
                    // self.playWinSpine();
                })
                // })

            })
        }
        this._music_mgr.playfapai();
        if (action) {
            self.playSpine(path1, animationStr + "x_01", self.fapaiSpine, false, callBackFunctionz_1);
        } else {
            // cc.warn("-------------------------------开始-------------------------"+self._o_xianData[0]+"-----------"+self.getAniName(self._o_xianData[0], true));
            this.zhuang_card1.opacity = 255;
            this.zhuang_card2.opacity = 255;
            this.xian_card1.opacity = 255;
            this.xian_card2.opacity = 255;
            this.winSpine.node.active = true;
            this.xian_dlab.node.active = true;
            this.zhuang_dlab.node.active = true;
            this.xian_bg.active = true;
            this.zhuang_bg.active = true;
            self.playSpine(path2, self.getAniName(self._o_zhuangData[0], true), self.zhuang_card1.getComponent(sp.Skeleton), false)
            self.playSpine(path2, self.getAniName(self._o_zhuangData[1], true), self.zhuang_card2.getComponent(sp.Skeleton), false)
            self.playSpine(path2, self.getAniName(self._o_xianData[0], true), self.xian_card1.getComponent(sp.Skeleton), false)
            self.playSpine(path2, self.getAniName(self._o_xianData[1], true), self.xian_card2.getComponent(sp.Skeleton), false)
            if (self._o_zhuangData.length == 3) {
                this.zhuang_card3.opacity = 255;
                self.playSpine(path3, self.getAniName(self._o_zhuangData[2], false), self.zhuang_card3.getComponent(sp.Skeleton), false)
                self.setXianZhuang(1, 2);
            } else {
                self.setXianZhuang(1, 1);
            }

            if (self._o_xianData.length == 3) {
                this.xian_card3.opacity = 255;
                self.playSpine(path3, self.getAniName(self._o_xianData[2], false), self.xian_card3.getComponent(sp.Skeleton), false)
                self.setXianZhuang(0, 2);
            } else {
                self.setXianZhuang(0, 1);
            }
            // self.playWinSpine();
        }

    }

    playWinSpine() {
        if(this.brbjl_scene._game_status != 3) return;
        cc.warn("-----------------");
        if (this.resultData) {
            var winSpinePath = "ani/win";
            this.winSpine.node.active = true;
            var callBackFunction = () => {
                this.node.runAction(cc.sequence(
                    cc.delayTime(0),
                    cc.callFunc(() => {
                        if (AppGame.ins.brbjlModel.isAutoOpenRecord) {
                            AppGame.ins.showBundleUI(ECommonUI.BJL_Ludan, EGameType.BJL, { "reuse": false, "minScore": this.brbjl_scene._room_info.jettons.length > 0 ? this.brbjl_scene._room_info.jettons[0] : 1 })
                        }
                    })))
            }
            this._music_mgr.playResultSound(this.resultData.lastRecord.playerCount, this.resultData.lastRecord.bankerCount, this._xianData.length, this._zhuangData.length, this.resultData.winArea);
            if (this.resultData.winArea == 2) {
                this.playSpine(winSpinePath, 'xianying', this.winSpine, false, callBackFunction)
            } else if (this.resultData.winArea == 3) {
                this.playSpine(winSpinePath, 'zhuangying', this.winSpine, false, callBackFunction)
            } else if (this.resultData.winArea == 4) {
                this.playSpine(winSpinePath, 'heju', this.winSpine, false, callBackFunction)
            }
        }
    }


    /**
    * 开牌
    * @param cards 
    * @param del_time 延时开始播放动画 
    */
    openCards(cards: Array<number>, del_time: number, time_3: number, cardType: number, is_action: boolean = true) {
    }

    setXianZhuang(type: number, cardNum: number) {
        if(this.brbjl_scene._game_status != 7) return;
        if (type == 0) { // 闲
            if (this._xianData) {
                this.xian_dlab.node.active = true;
                this.xian_bg.active = true;
                if (cardNum == 0) {
                    this.xian_dlab.string = `${this._xianData[0] < 10 ? this._xianData[0] : 0}` + `点`
                } else if (cardNum == 1) {
                    let xian_0 = (this._xianData[0]) < 10 ? (this._xianData[0]) : 0;
                    let xian_1 = (this._xianData[1]) < 10 ? (this._xianData[1]) : 0;
                    this.xian_dlab.string = `${(xian_0 + xian_1) < 10 ? (xian_0 + xian_1) : (xian_0 + xian_1 - 10)}` + `点`
                } else if (cardNum == 2) {
                    let xian_0 = this._xianData[0] < 10 ? this._xianData[0] : 0;
                    let xian_1 = this._xianData[1] < 10 ? this._xianData[1] : 0;
                    let xian_2 = this._xianData[2] < 10 ? this._xianData[2] : 0;
                    this.xian_dlab.string = `${(xian_0 + xian_1 + xian_2) < 10 ? (xian_0 + xian_1 + xian_2) : (xian_0 + xian_1 + xian_2 < 20 ? (xian_0 + xian_1 + xian_2 - 10) : (xian_0 + xian_1 + xian_2 - 20))}` + `点`
                }
            }
        } else if (type == 1) {
            if (this._zhuangData) {
                this.zhuang_dlab.node.active = true;
                this.zhuang_bg.active = true;
                if (cardNum == 0) {
                    this.zhuang_dlab.string = `${this._zhuangData[0] < 10 ? this._zhuangData[0] : 0}` + `点`
                } else if (cardNum == 1) {
                    let zhuang_0 = this._zhuangData[0] < 10 ? this._zhuangData[0] : 0;
                    let zhuang_1 = this._zhuangData[1] < 10 ? this._zhuangData[1] : 0;
                    this.zhuang_dlab.string = `${(zhuang_0 + zhuang_1) < 10 ? (zhuang_0 + zhuang_1) : (zhuang_0 + zhuang_1 - 10)}` + `点`
                } else if (cardNum == 2) {
                    let zhuang_0 = this._zhuangData[0] < 10 ? this._zhuangData[0] : 0;
                    let zhuang_1 = this._zhuangData[1] < 10 ? this._zhuangData[1] : 0;
                    let zhuang_2 = this._zhuangData[2] < 10 ? this._zhuangData[2] : 0;
                    this.zhuang_dlab.string = `${(zhuang_0 + zhuang_1 + zhuang_2) < 10 ? (zhuang_0 + zhuang_1 + zhuang_2) : (zhuang_0 + zhuang_1 + zhuang_2 < 20 ? (zhuang_0 + zhuang_1 + zhuang_2 - 10) : (zhuang_0 + zhuang_1 + zhuang_2 - 20))}` + `点`
                }
            }
        }
    }

    setColor(isWin: number) {
        var color1 = new cc.Color(200, 117, 56);
        var color2 = new cc.Color(255, 255, 255);
        var color3 = new cc.Color(5, 81, 156);

    }

    //播放spine动画
    playSpine(path: string, animation: string, skeleton: sp.Skeleton, loop: boolean, callback?: Function): void {
        if (AppGame.ins.roomModel.BundleName == "") return
        UDebug.Log("name: " + AppGame.ins.roomModel.BundleName)
        let bundle = cc.assetManager.getBundle(AppGame.ins.roomModel.BundleName)
        bundle.load(path, sp.SkeletonData, function (err, res: any) {
            if (err) cc.error(err)
            cc.loader.setAutoRelease(res, true)
            skeleton.skeletonData = res
            skeleton.setAnimation(0, animation, loop)
            skeleton.setCompleteListener((event) => {
                if (callback != undefined) callback()
            })
        })

    }

    hide(event: any, index: string) {

    }


}
