import MTBNNModel from "./model/MTBNNModel";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UTBNNScene from "./UTBNNScene";
import UTBNNHelper from "./UTBNNHelper";
import UDebug from "../../common/utility/UDebug";


const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:庄家框节点(另起一个节点是因为 层级与DrawCall 原因)
 */
@ccclass
export default class VTBNNZhuangNode extends cc.Component {
    /**
     * 该节点下需用的dic
     * @param zhuang_Ani  banker图片//确定庄家的龙骨动画 
     * @param zhuang_guang 庄家的黄色外框
     */
    private _zhuangNodeList = {
        "0": {
            zhuang_guang: null,
            // zhuang_sprite: null,
            zhuang_Ani: null
        },
        "1": {
            zhuang_guang: null,
            // zhuang_sprite: null,
            zhuang_Ani: null
        },
        "2": {
            zhuang_guang: null,
            // zhuang_sprite: null,
            zhuang_Ani: null
        },
        "3": {
            zhuang_guang: null,
            // zhuang_sprite: null,
            zhuang_Ani: null
        },
    }

    private _maxplayer: number = 4;

    start() {
        this._maxplayer = MTBNNModel.ins.maxPlayer;
        var self = this;
        for (let i = 0; i < this._maxplayer; i++) {
            // let path = "seat" + i.toString();

            // this._zhuangNodeList[i.toString()].zhuang_guang =
            //     UNodeHelper.find(this.node, path + "/qznn_zhuang_guang");

            // this._zhuangNodeList[i.toString()].zhuang_image =
            //     UNodeHelper.find(this.node, path + "/qznn_zhuang");

            let zg_path = "qznn_zhuang_guang" + i.toString();
            // let zAni_path = "qznnQiangZhuangAni" + i.toString();
            let zAni_path = "sz" + i.toString();

            let z_path = "qznn_zhuang" + i.toString();
            this._zhuangNodeList[i.toString()].zhuang_guang =
                UNodeHelper.find(this.node, zg_path);

            // this._zhuangNodeList[i.toString()].zhuang_Ani =
            //     UNodeHelper.getComponent(this.node, z_path, dragonBones.ArmatureDisplay);


            // this._zhuangNodeList[i.toString()].zhuang_sprite =
            //     UNodeHelper.getComponent(this.node, z_path, cc.Sprite);

            this._zhuangNodeList[i.toString()].zhuang_Ani =
                UNodeHelper.getComponent(this.node, zAni_path, sp.Skeleton);
            this._zhuangNodeList[i.toString()].zhuang_Ani.setCompleteListener((event: any) => {
                UTBNNScene.ins.getMusic.playZhuang();
                MTBNNModel.ins.emit(UTBNNHelper.TBNN_SELF_EVENT.TBNN_DJS_EVENT, null, false);
            });

            // this._zhuangNodeList[i.toString()].zhuang_Ani.setCompleteListener((event:any)=>{
            //     self._zhuangNodeList[i.toString()].zhuang_Ani.node.active = false;
            //     self._zhuangNodeList[i.toString()].zhuang_sprite.node.active = true;
            // });

        }

        // cc.log(this._zhuangNodeList);

        this.addEvent();

        //测试选庄动画
        // this.testAni(0);
    }

    private testAni(index: number) {
        // var self = this;
        // let callback = () => {
        //     self.setBanker(index);
        //     self.showChooseBankerAni([0, 1, 2, 3]);
        // }
        // this.node.runAction(cc.sequence(
        //     cc.delayTime(1),
        //     cc.callFunc(callback)
        // ));
    }

    /**监听事件 */
    private addEvent(): void {
        MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBZNN_SUB_S_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        MTBNNModel.ins.on(UTBNNHelper.TBNN_SELF_EVENT.TBNN_RESET_SCENE, this.onResetScene, this);

    }
    private removeEvent(): void {
        MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBZNN_SUB_S_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        MTBNNModel.ins.off(UTBNNHelper.TBNN_SELF_EVENT.TBNN_RESET_SCENE, this.onResetScene, this);

    }
    onDestroy() {
        this.removeEvent();
    }
    /**
     * 重置场景
     * @param data 
     */
    private onResetScene(data?: any) {
        this.resetBanker();
    }


    //#region 抢庄部分
    /**
     * 设置庄家座位索引
     * @param index 索引
     */
    setBanker(index: number) {
        MTBNNModel.ins.sBankerIndex = index;
    }
    /**获得庄的座位索引 */
    getBankerZhuangGuang(): number {
        var index = MTBNNModel.ins.gBankerIndex;
        var bIndex = MTBNNModel.ins.getUISeatId(index);

        // if (this._zhuangNodeList[bIndex] != null) {
        //     return this._zhuangNodeList[bIndex].zhuang_guang;
        // }
        return bIndex;//null;
    }


    /**隐藏庄的框 */
    hideBankerZhuangGuang() {
        let bankerIndex = this.getBankerZhuangGuang();

        if (this._zhuangNodeList[bankerIndex] != null) {
            this._zhuangNodeList[bankerIndex].zhuang_guang.active = false;
            // this._zhuangNodeList[bankerIndex].zhuang_sprite.node.active = false;
            this._zhuangNodeList[bankerIndex].zhuang_Ani.node.active = false;
        }
    }
    /**重置 */
    resetBanker() {
        this.hideBankerZhuangGuang();
    }

    /**
     * 随机选庄动画
     * @param indexs 座位索引数组
     */
    showChooseBankerAni(indexs: number[]) {
        UDebug.Log("indexs:" + JSON.stringify(indexs));
        // UDebug.Log("MTBNNModel.ins.gBankerIndex:"+MTBNNModel.ins.gBankerIndex );

        if (MTBNNModel.ins.gBankerIndex == null) return;

        var bIndex = this.getBankerZhuangGuang();

        if (indexs.length > 1) {
            for (let i = 0; i < indexs.length; i++) {
                var self = this;
                //重复2次 闪光(将透明度调亮和调暗)
                let rep = cc.repeat(cc.sequence(

                    cc.fadeIn(0.05),
                    cc.delayTime(0.05),
                    cc.fadeOut(0.05),
                    cc.callFunc(() => {
                        UTBNNScene.ins.getMusic.playChooseZhuang();
                    })
                ), 4);
                //每个人延迟执行，并加回调
                let act = cc.sequence(cc.delayTime(i * 0.05), rep, cc.callFunc((node) => {

                    // var bIndex = MTBNNModel.ins.getUISeatId(MTBNNModel.ins.gBankerIndex);
                    if (bIndex == indexs[i]) {
                        self._zhuangNodeList[indexs[i]].zhuang_guang.active = true;
                        self._zhuangNodeList[indexs[i]].zhuang_guang.opacity = 255;

                        // self._zhuangNodeList[node["index"]].zhuang_sprite.node.active = true;
                        this.playszSpine(bIndex, true);

                        MTBNNModel.ins.emit(UTBNNHelper.TBNN_SELF_EVENT.TBNN_XUAN_ZHUANG_END_EVENT);

                    }
                }));

                //添加索引标签
                // this._zhuangNodeList[indexs[i]].zhuang_guang["index"] = indexs[i];
                this._zhuangNodeList[indexs[i]].zhuang_guang.active = true;
                this._zhuangNodeList[indexs[i]].zhuang_guang.runAction(act);

            }

        }
        else if (indexs.length == 0) {//都不抢庄 也要随机庄

            var self = this;
            // var bIndex = MTBNNModel.ins.getUISeatId(MTBNNModel.ins.gBankerIndex);

            for (let i = 0; i < this._maxplayer; i++) {

                //重复2次 闪光(将透明度调亮和调暗)
                let rep = cc.repeat(cc.sequence(

                    cc.fadeIn(0.05),
                    cc.delayTime(0.05),
                    cc.fadeOut(0.05),
                    cc.callFunc(() => {
                        UTBNNScene.ins.getMusic.playChooseZhuang();
                    })
                ), 4);
                //每个人延迟执行，并加回调
                let act = cc.sequence(cc.delayTime(i * 0.05), rep, cc.callFunc((node) => {
                    if (bIndex == i) {
                        self._zhuangNodeList[i.toString()].zhuang_guang.active = true;
                        self._zhuangNodeList[i.toString()].zhuang_guang.opacity = 255;

                        this.playszSpine(bIndex, true);
                        MTBNNModel.ins.emit(UTBNNHelper.TBNN_SELF_EVENT.TBNN_XUAN_ZHUANG_END_EVENT);

                    }
                }));

                let player = MTBNNModel.ins.getbattleplayerbySeatId(i);
                if (player != null && player.playStatus == 1 && player.seatId >= 0 && player.seatId < 4) {
                    this._zhuangNodeList[i.toString()].zhuang_guang.active = true;
                    this._zhuangNodeList[i.toString()].zhuang_guang.runAction(act);
                }
            }
        }
        else//1个,不用播放动画
        {
            // var index1 = MTBNNModel.ins.gBankerIndex;
            // var bIndex = MTBNNModel.ins.getUISeatId(index1);

            if (bIndex != null && this._zhuangNodeList[bIndex.toString()] != null) {
                this._zhuangNodeList[bIndex.toString()].zhuang_guang.active = true;
                this._zhuangNodeList[bIndex.toString()].zhuang_guang.opacity = 255;
                // this._zhuangNodeList[index].zhuang_sprite.node.active = true;

                this.playszSpine(bIndex, true);

                MTBNNModel.ins.emit(UTBNNHelper.TBNN_SELF_EVENT.TBNN_XUAN_ZHUANG_END_EVENT);

            }
        }

    }
    //#endregion

    private onRandomZhuang(data: any) {

        if (data.index != null && data.bankers != null) {
            this.setBanker(data.index);
            this.showChooseBankerAni(data.bankers);//[0,1,2,3]

            // UTBNNScene.ins.getMusic.playZhuang(MTBNNModel.ins.getPlayerSexByRealSeat(data.index));
        }
    }


    /**
     * 叫庄时间到后 庄是谁的结果
     * @param data 
     */
    private onCallBankerResult(data) {
        UDebug.Log("zhuang callbanker:" + JSON.stringify(data));

        var dwBankerUser = data.dwBankerUser || 0;//确定的庄家
        var cbCallBankerUser = data.cbCallBankerUser;//number[]
        var cbAddJettonTime = data.cbAddJettonTime;//下注时间
        var cbRandBanker = data.cbRandBanker || 0;//是否随机庄家

        if (cbAddJettonTime != null) {
            // var djsData = {
            //     time: cbAddJettonTime,
            //     isAuto: true,
            //     callback: "xz"
            // }
            var djsData = cbAddJettonTime;

            MTBNNModel.ins.emit(UTBNNHelper.TBNN_SELF_EVENT.TBNN_DJS_EVENT, djsData, true);
        }
        MTBNNModel.ins.emit(UTBNNHelper.TBNN_SELF_EVENT.TBNN_XUAN_ZHUANG_END_EVENT);
        return

        //随机庄
        if (cbRandBanker == 1) {
            var bIndex = [];
            var dic = {};

            var biggest = 0;//最大下庄

            for (let i = 0; i < cbCallBankerUser.length; i++) {
                const element = cbCallBankerUser[i];
                if (element > 0) {
                    var index = MTBNNModel.ins.getUISeatId(i);
                    dic[index] = element;

                    if (biggest < element) {
                        biggest = element;
                    }
                }
            }
            // console.info("dic：" + JSON.stringify(dic));

            if (biggest > 0) {
                for (const key in dic) {
                    if (dic.hasOwnProperty(key)) {
                        const element = dic[key];
                        if (element == biggest) {
                            bIndex.push(parseInt(key));
                        }
                    }
                }
            }


            var data1 = {
                index: dwBankerUser,
                bankers: bIndex
            }

            this.onRandomZhuang(data1);
        }
        // else if (cbRandBanker == null || cbRandBanker == 0) {}
        else {
            var data2 = {
                index: dwBankerUser,
                bankers: [dwBankerUser]
            }

            this.onRandomZhuang(data2);
        }
    }

    playszSpine(index: number, b: boolean) {
        if (b) {
            this._zhuangNodeList[index].zhuang_Ani.animation = "animation";
            this._zhuangNodeList[index].zhuang_Ani.setAnimation(0, "animation", false);
        }

        this._zhuangNodeList[index].zhuang_Ani.node.active = b;
    }

}