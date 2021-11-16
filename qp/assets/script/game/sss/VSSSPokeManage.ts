import USpriteFrames from "../../common/base/USpriteFrames";
import VSSSPokeAni from "./VSSSPokeAni";
import { ESSSRoom, UISSSDunPoker, SSSPX, SSSPokeSuffix, SSSPXStr } from "./ssshelp/USSSData";
import USSSMusic from "./ssshelp/USSSMusic";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UDebug from "../../common/utility/UDebug";
import MSSS from "./MSSS";
import { s13s } from "../../common/cmd/proto";
import AppGame from "../../public/base/AppGame";
import { ETipType } from "../../common/base/UAllenum";
import UResManager from "../../common/base/UResManager";



//**扑克牌和扑克面板逻辑 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class VSSSPokeManage {

    /**图片资源集合 */
    private _res: USpriteFrames;
    private _faPaiarr: cc.Node[][]; //发牌的牌
    private _kaiPaiarr: cc.Sprite[][]; //开牌的牌
    private _paiXingarr: sp.Skeleton[]; //翻牌时贴在每墩牌上的牌型提示
    private _actPaiarr: sp.Skeleton[];  //动画点
    private _lipaiAni: VSSSPokeAni[] //开牌动画
    private _faPaiarrPos: cc.Vec3[][]; //初始位置
    private _kaiPaiarrPos: cc.Vec3[][]; //初始位置
    private _kaipaiFrame: cc.SpriteFrame; //背图纹理
    private _pokeparent: cc.Node  // 
    private _lipainode: cc.Node  //理牌的面板
    private _lipaibtnclickArr: { [key: string]: Function };  //事件数组
    private _pokebtnsNode: cc.Node;   //牌型按钮
    private _pokebtnsArr: cc.Button[];    //牌型按钮组
    private _roominfo: ESSSRoom;   //房间信息
    private _yijianbtn: cc.Button;  //一键
    private _shoudongbtn: cc.Button; //手动
    private _quedingbtn: cc.Button; //确定
    private _chongxinbtn: cc.Button; //重新
    // private _btn_hsdxbg: cc.Node //花色按钮背景
    private _toudunPanel: cc.Button;
    private _zhongdunPanel: cc.Button;
    private _weidunPanel: cc.Button;

    private _music: USSSMusic;

    private _tishiNode: cc.Node;   //牌型提示总面板
    private _headBaiPaiTips: cc.Node;//手动摆牌提示
    private _tishiPanel: cc.Node[];   //牌型提示子面板
    private _tishiArr: cc.Sprite[][]; //牌型组

    private _selfPokeNode: cc.Node; //自己的手牌
    private _selfPokeArr: cc.Sprite[];
    private _tcountdownNode: cc.Node;
    private _tcountdownCD: cc.Sprite;
    private _tcountdownNum: cc.Label;
    private _isTurn: boolean = false;
    private _cdTime: number;
    private _allTimer: number;

    private _totalTurnTime: number;
    //比牌界面等待翻牌倒计时
    private _fangpaiCdNode: cc.Node;
    private _fangpaiCD: cc.Sprite;
    private _fangpaiNum: cc.Label;
    private _fangpaiIsTurn: boolean = false;

    private _selectPokeArr: number[];  //当前选中的牌
    private _toudunPokeArr: cc.Sprite[];  //头墩牌
    private _zhongdunPokeArr: cc.Sprite[];//中墩牌
    private _weidunPokeArr: cc.Sprite[];//尾墩牌
    /**此墩是否可以摆 */
    private _dunSelArr: boolean[];
    private _selfPokedata: number[];
    private _curselfPokedata: number[];  //当前剩余牌

    private _selfDundata: UISSSDunPoker[];  //当前墩牌

    private _curselcetType: number  //当前选中的牌型
    private _pokedatabtnsArr: number[][][];

    private _huasebtn: cc.Toggle;
    private _daxiaobtn: cc.Toggle;
    private _specialTy: number;  //当前是否有特殊牌型

    private _tempcurts: number;
    private _shootAniArr: sp.Skeleton[]; //打枪动画

    private _holesAniArr: sp.Skeleton[]; //子弹动画
    private _pmbarr: cc.Node[];   //牌描边
    private _tspxarr: cc.Node[];  //特殊牌型背面图
    private _toudaoDel: cc.Button;  //墩牌取消按钮
    private _zhongdaoDel: cc.Button;
    private _weidaoDel: cc.Button;

    private _pokerMax: cc.Node[][]; //最大标记
    private old_leave_time: number = 0;






    set selfPokedata(poke: number[]) {
        this._selfPokedata = poke
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    init(pokeparent: cc.Node, lipainode: cc.Node, res: USpriteFrames, music: USSSMusic) {
        this._pokeparent = pokeparent
        this._lipainode = lipainode
        this._res = res
        this._dunSelArr = new Array()
        this._dunSelArr = [true, true, true]
        this._tempcurts = Number(0)  //默认选第一种推荐牌型
        this._music = music
        this.initbtnEvent()
        this.initpai()
        this.initliPaiNode()
        this.clear()
    }

    /**
       * 所有事件集合
       */
    private initbtnEvent() {
        this._lipaibtnclickArr = {
            ["quedingbtn"]: this.onquedingbtnibtn,
            ["lipaiPTBtn"]: this.onlipaiPTBtn,
            ["lipaiTSBtn"]: this.onlipaiTSBtn,
            ["yijianBaipaibtn"]: this.onyijianBaipaibtn,
            ["shoudongBaipaibtn"]: this.onshoudongBaipaibtn,
            ["chongxinbtn"]: this.onchongxinBaipaibtn,
            ["huasebtn"]: this.onHuaseSort,
            ["daxiaobtn"]: this.ondaxiaoSort,

            ["toudun"]: this.ontoudun,  //点击头墩
            ["zhongdun"]: this.onzhongdun,
            ["weidun"]: this.onweidun,

            ["toudundel"]: this.ontoudundel,  //取消头墩
            ["zhongdundel"]: this.onzhongdundel,
            ["weidundel"]: this.onweidundel,
        }
    }

    private initpai() {
        this._faPaiarr = new Array()
        this._kaiPaiarr = new Array()
        this._paiXingarr = new Array()
        this._pmbarr = new Array()
        this._tspxarr = new Array()
        this._faPaiarrPos = new Array()
        this._kaiPaiarrPos = new Array()

        this._actPaiarr = new Array()
        this._lipaiAni = new Array()
        this._pokerMax = new Array()

        this._shootAniArr = new Array()
        this._holesAniArr = new Array()
        //发牌
        for (let i = 0; i < 4; i++) {
            this._faPaiarr[i] = new Array()
            this._kaiPaiarr[i] = new Array()
            this._faPaiarrPos[i] = new Array()
            this._kaiPaiarrPos[i] = new Array()
            this._pokerMax[i] = new Array()
            this._actPaiarr[i] = UNodeHelper.getComponent(this._pokeparent, "poker_" + i + "/13s_xp_fp", sp.Skeleton) //理牌中
            this._faPaiarr[i]["pokeNode"] = UNodeHelper.find(this._pokeparent, "poker_" + i) //13张长条牌父节点
            this._paiXingarr[i] = UNodeHelper.getComponent(this._pokeparent, "lipaiok_" + i + "/paixing_1", sp.Skeleton) //三层叠背牌
            this._paiXingarr[i].node.active = false
            this._paiXingarr[i].node.zIndex = 110

            this._pmbarr[i] = UNodeHelper.find(this._pokeparent, "lipaiok_" + i + "/pmbNode") //三层叠背牌
            this._pmbarr[i].active = false
            this._pmbarr[i].zIndex = 118

            this._tspxarr[i] = UNodeHelper.find(this._pokeparent, "lipaiok_" + i + "/tspxImg") //三层叠背牌
            this._tspxarr[i].active = false
            this._tspxarr[i].zIndex = 50

            for (let j = 0; j < 13; j++) {
                this._faPaiarr[i][j] = UNodeHelper.find(this._pokeparent, "poker_" + i + "/gf_poker" + j) //13张长条背牌
                this._kaiPaiarr[i][j] = UNodeHelper.getComponent(this._pokeparent, "lipaiok_" + i + "/pokerPos_" + j, cc.Sprite) //三层叠背牌

                this._faPaiarrPos[i][j] = this._faPaiarr[i][j].position
                this._kaiPaiarrPos[i][j] = this._kaiPaiarr[i][j].node.position
            }

            //最大标记
            for (let j = 0; j < 3; j++) {
                this._pokerMax[i][j] = UNodeHelper.find(this._pokeparent, "lipaiok_" + i + "/max" + (j + 1))
                this._pokerMax[i][j].active = false
            }

            this._lipaiAni[i] = UNodeHelper.getComponent(this._pokeparent, "lipaiok_" + i, VSSSPokeAni)

            this.setkaipaiShow(i, false) //隐藏开牌（三层叠牌）
            this.setpokeShow(i, false) //隐藏理牌（13张长条牌）

            this._shootAniArr[i] = UNodeHelper.getComponent(this._pokeparent, "lipaiok_" + i + "/shootAni", sp.Skeleton)
            this._holesAniArr[i] = UNodeHelper.getComponent(this._pokeparent, "lipaiok_" + i + "/holes", sp.Skeleton)

            this._holesAniArr[i].enabled = false
            this._shootAniArr[i].enabled = false
        }
        this._kaipaiFrame = this._kaiPaiarr[0][0].spriteFrame
    }


    /**初始化理牌面板 */
    private initliPaiNode() {

        this._pokebtnsNode = UNodeHelper.find(this._lipainode, "btnsNode") //一排牌型提示按钮父节点
        this._pokebtnsArr = new Array()
        for (let i = 1; i < 9; i++) {
            this._pokebtnsArr[i] = UNodeHelper.getComponent(this._lipainode, "btnsNode/btncfg_" + i, cc.Button)
            this._pokebtnsArr[i].node.on('click', this._lipaibtnclickArr["lipaiPTBtn"], this)
            this._pokebtnsArr[i].node["curindex"] = 0
        }
        this._pokebtnsArr[9] = UNodeHelper.getComponent(this._lipainode, "btnsNode/btncfg_" + 9, cc.Button) //特殊
        this._pokebtnsArr[9].node.on('click', this._lipaibtnclickArr["lipaiTSBtn"], this)
        this._yijianbtn = UNodeHelper.getComponent(this._lipainode, "sss_btn_yijian", cc.Button)
        this._yijianbtn.node.on('click', this._lipaibtnclickArr["yijianBaipaibtn"], this)
        this._yijianbtn.node.active = false
        this._shoudongbtn = UNodeHelper.getComponent(this._lipainode, "sss_btn_shoudong", cc.Button)
        this._shoudongbtn.node.on('click', this._lipaibtnclickArr["shoudongBaipaibtn"], this)
        this._quedingbtn = UNodeHelper.getComponent(this._lipainode, "sss_btn_queding", cc.Button)
        this._quedingbtn.node.on(cc.Node.EventType.TOUCH_END, this._lipaibtnclickArr["quedingbtn"], this)
        this._chongxinbtn = UNodeHelper.getComponent(this._lipainode, "sss_btn_chongxin", cc.Button)
        this._chongxinbtn.node.on(cc.Node.EventType.TOUCH_END, this._lipaibtnclickArr["chongxinbtn"], this)
        this._chongxinbtn.node.active = false
        this._huasebtn = UNodeHelper.getComponent(this._lipainode, "toggleContainer/toggle1", cc.Toggle)
        this._huasebtn.node.on(cc.Node.EventType.TOUCH_START, this._lipaibtnclickArr["huasebtn"], this)
        this._daxiaobtn = UNodeHelper.getComponent(this._lipainode, "toggleContainer/toggle2", cc.Toggle)
        this._daxiaobtn.node.on(cc.Node.EventType.TOUCH_START, this._lipaibtnclickArr["daxiaobtn"], this)

        // this._btn_hsdxbg = UNodeHelper.find(this._lipainode, "sss_btn_hsdxbg")

        //头中尾墩
        this._toudunPanel = UNodeHelper.getComponent(this._lipainode, "toudaobg", cc.Button)
        this._zhongdunPanel = UNodeHelper.getComponent(this._lipainode, "zhongdaobg", cc.Button)
        this._weidunPanel = UNodeHelper.getComponent(this._lipainode, "weidaobg", cc.Button)
        this._toudunPanel.node.on(cc.Node.EventType.TOUCH_START, this._lipaibtnclickArr["toudun"], this)
        this._zhongdunPanel.node.on(cc.Node.EventType.TOUCH_START, this._lipaibtnclickArr["zhongdun"], this)
        this._weidunPanel.node.on(cc.Node.EventType.TOUCH_START, this._lipaibtnclickArr["weidun"], this)

        this._toudunPanel.node["pokeData"] = new Array()
        this._zhongdunPanel.node["pokeData"] = new Array()
        this._weidunPanel.node["pokeData"] = new Array()
        this._toudunPokeArr = new Array()
        this._zhongdunPokeArr = new Array()
        this._weidunPokeArr = new Array()
        for (let i = 0; i < 3; i++) {
            this._toudunPokeArr[i] = UNodeHelper.getComponent(this._toudunPanel.node, "poke_" + i, cc.Sprite)
        }
        for (let i = 0; i < 5; i++) {
            this._zhongdunPokeArr[i] = UNodeHelper.getComponent(this._zhongdunPanel.node, "poke_" + i, cc.Sprite)
            this._weidunPokeArr[i] = UNodeHelper.getComponent(this._weidunPanel.node, "poke_" + i, cc.Sprite)
        }
        this._toudunPanel.node["paixing"] = UNodeHelper.getComponent(this._toudunPanel.node, "cardType", cc.Sprite) //牌型
        this._zhongdunPanel.node["paixing"] = UNodeHelper.getComponent(this._zhongdunPanel.node, "cardType", cc.Sprite) //牌型
        this._weidunPanel.node["paixing"] = UNodeHelper.getComponent(this._weidunPanel.node, "cardType", cc.Sprite) //牌型


        this._toudunPanel.node["light"] = UNodeHelper.getComponent(this._toudunPanel.node, "light", cc.Sprite) //高亮背景
        this._zhongdunPanel.node["light"] = UNodeHelper.getComponent(this._zhongdunPanel.node, "light", cc.Sprite) //高亮背景
        this._weidunPanel.node["light"] = UNodeHelper.getComponent(this._weidunPanel.node, "light", cc.Sprite) //高亮背景

        //头中尾墩取消
        this._toudaoDel = UNodeHelper.getComponent(this._lipainode, "toudaoDel", cc.Button)
        this._zhongdaoDel = UNodeHelper.getComponent(this._lipainode, "zhongdaoDel", cc.Button)
        this._weidaoDel = UNodeHelper.getComponent(this._lipainode, "weidaoDel", cc.Button)
        this._toudaoDel.node.on(cc.Node.EventType.TOUCH_START, this._lipaibtnclickArr["toudundel"], this)
        this._zhongdaoDel.node.on(cc.Node.EventType.TOUCH_START, this._lipaibtnclickArr["zhongdundel"], this)
        this._weidaoDel.node.on(cc.Node.EventType.TOUCH_START, this._lipaibtnclickArr["weidundel"], this)


        //提示
        this.setliPaiPanel(false)
        this._tishiNode = UNodeHelper.find(this._lipainode, "tishipaiNode") //三种组合牌型提示父节点
        this._headBaiPaiTips = UNodeHelper.find(this._lipainode, "tips") //手动摆牌提示
        //this._tishiNode.active = false


        this._tishiArr = new Array()
        this._tishiPanel = new Array()
        //三种提示面板
        for (let i = 0; i < 3; i++) {
            this._tishiArr[i] = new Array()

            this._tishiPanel[i] = UNodeHelper.find(this._tishiNode, "tspaixing_" + i)
            //三墩的牌型提示
            for (let j = 0; j < 3; j++) {
                this._tishiArr[i][j] = UNodeHelper.getComponent(this._tishiPanel[i], "pxts_" + j, cc.Sprite)
            }
        }
        //自己的牌父节点 最下面一排13张
        this._selfPokeNode = UNodeHelper.find(this._lipainode, "pkNode")
        //自已的牌
        this._selfPokeArr = new Array()
        for (let i = 0; i < 13; i++) {
            this._selfPokeArr[i] = UNodeHelper.getComponent(this._selfPokeNode, "gf_poker" + i, cc.Sprite)
        }
        this._selectPokeArr = new Array()
        this.cardTouch()

        //理牌倒计时
        this._tcountdownNode = UNodeHelper.find(this._lipainode, "countdownbg")
        this._tcountdownNum = UNodeHelper.getComponent(this._tcountdownNode, "countdownNum", cc.Label)

        //翻牌倒计时
        this._fangpaiCdNode = UNodeHelper.find(this._pokeparent, "timer")
        this._fangpaiCD = UNodeHelper.getComponent(this._fangpaiCdNode, "countdowncd", cc.Sprite)
        this._fangpaiNum = UNodeHelper.getComponent(this._fangpaiCdNode, "countdownNum", cc.Label)
        this._fangpaiCdNode.active = false

        // this._btn_hsdxbg.active = false



    }



    /**帧更新 */
    update(dt: number): void {
        if (this._isTurn) {
            let tmp_leave_time = Math.ceil(this._cdTime);
            this._cdTime -= dt;
            if (this._cdTime > 0) {
                let t = Math.ceil(this._cdTime).toString();
                this.updateLiPaiTimerPro(this._cdTime, false);
                this._tcountdownNum.string = ":" + t;

                if (this._cdTime <= 5 && (tmp_leave_time > (this._cdTime + 1)))
                    this._music.playCountDown()
            }
            else {
                //this._tcountdownCD.fillRange = 0;
                this.leaveTurn();
                let isAutoOpertor = true;
                this.onquedingbtnibtn(null, isAutoOpertor)
            }
        } else if (this._fangpaiIsTurn) {
            this._cdTime -= dt
            if (this._cdTime > 0) {
                //this._fangpaiCD.fillRange = this._cdTime / this._totalTurnTime;
                let timer = Math.ceil(this._cdTime).toString();
                this.updateTimerPro(this._cdTime, false);
                this._fangpaiNum.string = timer;

            }
            else {
                this.leaveFangpaiTurn()

            }
        }
    }

    /**
     * @description 计时器进度条
     * @param lastTime  剩余时间
     * @param isInit 是否初始化
     */
    updateTimerPro(lastTime: number, isInit: boolean) {
        let _ProgressBar = this._fangpaiCdNode.getComponent(cc.ProgressBar);
        this._fangpaiCdNode.active = !isInit;
        if (isInit) {
            this._cdTime = 0;
            this._totalTurnTime = 0;
            _ProgressBar.progress = 1;
        } else {
            _ProgressBar.progress = lastTime / this._allTimer;
        };
    };


    /**
     * @description lipai计时器进度条
     * @param lastTime  剩余时间
     * @param isInit 是否初始化
     */
    updateLiPaiTimerPro(lastTime: number, isInit: boolean) {
        let _ProgressBar = this._tcountdownNode.getComponent(cc.ProgressBar);
        this._tcountdownNode.active = !isInit;
        if (isInit) {
            this._cdTime = 0;
            this._totalTurnTime = 0;
            _ProgressBar.progress = 1;
        } else {
            _ProgressBar.progress = lastTime / this._allTimer;
        };
    };




    /**
     * 设置场别 极速 /常规
     * @param roundid 
     */
    setLev(gameid: number, roundid: number) {
        this._roominfo = roundid - gameid * 10 > 4 ? ESSSRoom.FAST : ESSSRoom.general
    }

    /**开始计时 */
    enterTurn(cd: number, tolCd: number): void {

        this._totalTurnTime = tolCd
        this._cdTime = cd;
        this._allTimer = cd;
        this._isTurn = true;
        UDebug.Log("开始计时" + this._cdTime)
        this.updateLiPaiTimerPro(this._cdTime, false);

        //this._flagRoot.active = false;
    }

    leaveFangpaiTurn(): void {
        //this._fangpaiCD.fillRange = 0;
        this._fangpaiIsTurn = false
        this.updateTimerPro(0, true);
    }


    /** 后台回来 经过的时间 同步时间  */
    syncCDTime(cd: number) {
        this._cdTime = this._cdTime - cd;

    }

    /**摆牌时间到 */
    leaveTurn(): void {
        this._isTurn = false;
        this.updateLiPaiTimerPro(0, true);
        //this.clearChipTouch();
        //时间到无论是手动还是一键摆牌，默认都选择一键摆牌的第一组推荐组合
        this._yijianbtn.node.active = false
        this._tempcurts = 0
        this.setliPaiPanel(false)
    }

    //设置提示子面板显示
    private settishiPanelShow(index: number, active: boolean, data?: number[], isspecialTy?: number) {

        this._tishiPanel[index].active = active;
        if (active && data) {
            this._tishiNode.active = true
            this._headBaiPaiTips.active = true;
            UDebug.Log(index + "面板------------------牌型" + isspecialTy)
            this._tishiArr[index][0].node.active = false
            this._tishiArr[index][1].node.active = false
            this._tishiArr[index][2].node.active = false
            if (isspecialTy >= SSSPX.STH)  //有特殊牌型
            {
                this.loadPxImg(this._tishiArr[index][1], "sss_typebtn_", isspecialTy)
            } else {
                this.loadPxImg(this._tishiArr[index][0], "sss_typebtn_", data[0])
                this.loadPxImg(this._tishiArr[index][1], "sss_typebtn_", data[1])
                this.loadPxImg(this._tishiArr[index][2], "sss_typebtn_", data[2])
                // this._tishiArr[index][0].node.active = true
                // this._tishiArr[index][1].node.active = true
                // this._tishiArr[index][2].node.active = true
            }

        }
    }

    /**
     * 加载牌型图片
     * @param node 
     * @param index 
     */
    private loadPxImg(node: cc.Sprite, prefix: string, index: number) {
        if (index != null) {
            let url = "texture/" + prefix + SSSPokeSuffix[index]
            UResManager.loadUrlByBundle(AppGame.ins.roomModel.BundleName, url, node,
                function (err) {
                    if (err) {
                        UDebug.Log("十三水jiaz失败" + index)
                    }
                    node.node.active = true
                })
        }
    }



    /**
    * 加载牌型动画
    * @param node 
    * @param index 
    */
    private loadPxAni(aninode: sp.Skeleton, index: number, seatid: number) {
        //UDebug.Log("加载牌型，动画，，"+"cardtype_" +SSSPokeSuffix[index])
        if (seatid == 0) {
            this._music.playPaiXing(index, MSSS.ins.selfUserSex)
        }
        aninode.node.active = true
        aninode.setAnimation(0, "cardtype_" + SSSPokeSuffix[index], false);
        aninode.setCompleteListener((event) => {
            UDebug.Log(index + "播放完毕。。。。。。" + SSSPokeSuffix[index])
            if (index < SSSPX.STH) {  //特殊牌型保留
                aninode.node.active = false
            }

        });

    }



    /**
    * 播放打枪动画
    * @param index   播放位置
    * @param shooter   是否是打枪者
    */
    playShoot(index: number, shooter: boolean) {

        let aniShootNameArr = [
            "gun_fire_0_2",
            "gun_fire_1_3",
            "gun_fire_2_0",
            "gun_fire_3_1"];
        // 1 - 3      2 - 0     3 - 1    0 - 2
        this._music.playDQ(MSSS.ins.selfUserSex)
        let sp = shooter ? this._shootAniArr[index] : this._holesAniArr[index];
        sp.enabled = true;
        sp.node.zIndex = 99999;
        UDebug.Log("  打枪播放。。。。。。" + index)
        if (shooter) {

            let aniName = aniShootNameArr[index];
            sp.setAnimation(0, aniName, false)
        }
        else {
            this._pmbarr[index].active = true
            sp.setAnimation(0, "animation", false)
        }

        sp.setCompleteListener((event) => {
            UDebug.Log("  打枪播放完毕。。。。。。" + index)
            sp.enabled = !shooter;
            if (!shooter)
                this._pmbarr[index].active = false
        });
    }

    /**初始化 理牌数据 */
    initlipaiPanelData(data: s13s.IHandCards) {
        //13张牌的数组
        let protobuf = new Uint8Array(data.cards);
        UDebug.Log(protobuf)
        //自已13张牌的数据
        for (let index = 0; index < 13; index++) {
            this._selfPokedata[index] = protobuf[index]
        }

        this._selfDundata = new Array()
        if (data.specialTy >= SSSPX.STH) {
            UDebug.Log("specialTyt  有哦特殊牌型")
            this._specialTy = data.specialTy

        } else {
            UDebug.Log("specialTyt   mei  没 哦特殊牌型")
            this._specialTy = 0
        }
        data.groups.forEach(element => {  //几墩
            let tempdata = new UISSSDunPoker()
            tempdata.pokerType = new Array()
            tempdata.pokerIcons = new Array()
            tempdata.specialTy = element.specialTy //整手牌特殊牌型
            element.duns.forEach(dunsdata => {  //每墩牌
                tempdata.pokerType.push(dunsdata.ty)
                let carddata = new Uint8Array(dunsdata.cards)
                let icondata = new Array<number>()
                for (let index = 0; index < carddata.length; index++) {
                    icondata[index] = carddata[index];
                }
                tempdata.pokerIcons.push(icondata)
            })
            this._selfDundata.push(tempdata)
        });
        UDebug.Log("牌的数据>>>>>>>>>>>>>>>>>>>>")
        UDebug.Info(this._selfDundata)
        //this.enterTurn(data.wTimeLeft,data.wTimeLeft)  //倒计时
        this._tempcurts = 0


        this.setliPaiPanel(true)
        this.onyijianBaipaibtn()


        if (this._roominfo == ESSSRoom.FAST) {
            UDebug.Log("-----------快速场。。。。。。~~----------------")
            this._shoudongbtn.node.active = false
            this._quedingbtn.node.setPosition(0, this._quedingbtn.node.y)
        }

    }

    /**场景初始化 理牌数据 */
    initScenelipaiPanelData(data: any) {
        //初始化 理牌数据
        this.initlipaiPanelData(data.handCards)
        this.enterTurn(data.wTimeLeft > 25 ? 25 : data.wTimeLeft, data.wTotalTime > 25 ? 25 : data.wTotalTime)

    }


    //显示每墩的牌
    private showOneDunpoke(index: number, poketype: number, pokedata: number[]) {
        this._selectPokeArr.sort(function (a, b) {
            return a > b ? -1 : 1
        })
        pokedata.sort(function (a, b) {
            if (a % 16 == 1) {
                a += 13
            }
            if (b % 16 == 1) {
                b += 13
            }
            return a % 16 > b % 16 ? 1 : -1
        })
        this.closeHLight()
        if (index == 0) {
            UDebug.Log("摆第 一 墩的牌" + poketype)
            this._toudunPanel.interactable = false
            this.showDunPoke(this._toudunPokeArr, pokedata)  //显示提示板每墩的牌
            this._toudaoDel.node.active = true //开启取消按钮
            this._toudunPanel.node["paixing"].node.active = false
            if (poketype < SSSPX.STH) //普通牌型
            {
                this.loadPxImg(this._toudunPanel.node["paixing"], "sss_cardtype_", poketype) //显示提示板每墩的牌型
            }
            else {
                this._toudunPanel.node["paixing"].node.active = false
            }

            this._dunSelArr[0] = false

        } else if (index == 1) {
            UDebug.Log("摆第 二 墩的牌" + poketype)
            this._zhongdunPanel.interactable = false
            this.showDunPoke(this._zhongdunPokeArr, pokedata)
            this._zhongdaoDel.node.active = true //开启取消按钮
            this._zhongdunPanel.node["paixing"].node.active = false
            if (poketype < SSSPX.STH) //普通牌型
            {
                this.loadPxImg(this._zhongdunPanel.node["paixing"], "sss_cardtype_", poketype)
            }
            else {
                this._zhongdunPanel.node["paixing"].node.active = false
            }

            this._dunSelArr[1] = false

        } else if (index == 2) {
            UDebug.Log("摆第 三 墩的牌" + poketype)
            this._weidunPanel.interactable = false
            this.showDunPoke(this._weidunPokeArr, pokedata)
            this._weidaoDel.node.active = true //开启取消按钮
            this._weidunPanel.node["paixing"].node.active = false
            if (poketype < SSSPX.STH) //普通牌型
            {
                this.loadPxImg(this._weidunPanel.node["paixing"], "sss_cardtype_", poketype)
            }
            else {
                this._weidunPanel.node["paixing"].node.active = false
            }

            this._dunSelArr[2] = false
        }
    }

    //设置理牌面板显示
    setliPaiPanel(active: boolean) {
        UDebug.Log("理牌面板" + active)
        this._lipainode.active = active
        this._huasebtn.isChecked = false;
        this._daxiaobtn.isChecked = true;
    }

    fangpaiReady(index: number) {
        this.setpokeShow(index, false)
        this._actPaiarr[index].unscheduleAllCallbacks()
        this.setkaipaiShow(index, true)
    }

    //发牌动画
    fapaiAni(index: number, isFaPai: boolean = true) {
        UDebug.Log("  理牌中" + index)
        this._music.playSendCard()

        this.setpokeShow(index, true)
        let godeltime = 0.1
        let backdeltime = godeltime * 2 * 13
        let moveY = 30
        let i = 0
        //let j = 0
        let deli = godeltime * 2 - godeltime

        let aniSp = this._actPaiarr[index];

        // let z = index == 1 ? 3 : (index == 3 ? 1 : index);
        aniSp.node.active = true;
        if (isFaPai) {
            let aniName1 = "fapai_" + index;
            aniSp.setAnimation(0, aniName1, false);
            aniSp.setCompleteListener((event) => {
                let aniName2 = "lipai_" + index;
                aniSp.setAnimation(0, aniName2, true);
            });
        } else {
            let aniName2 = "lipai_" + index;
            aniSp.setAnimation(0, aniName2, true);
        };
    }

    //停止某个发牌动画
    stoponefapaiAni(index: number) {
        this._actPaiarr[index].node.active = false
        this._faPaiarr[index].forEach(poke => {
            poke.stopAllActions()
            poke.active = false
        })
        this.fangpaiReady(index) //开牌背面
    }

    //停止所有发牌动画
    stopfapaiAni() {
        this._faPaiarr.forEach(element => {
            element.forEach(poke => {
                poke.stopAllActions()
                poke.active = false
            })
        });
    }

    /**
     * 开牌动画
     * @param index 
     */
    kaipaiAni(index: number) {
        this.setkaipaiShow(index, true)
        let deli = 2
        let i = 0
        this._actPaiarr[index].unscheduleAllCallbacks()
        this._actPaiarr[index].schedule(() => {
            let ty = 0
            let tz = 0
            if (i == 0) {
                for (let start = 0; start < 3; start++) {
                    this._kaiPaiarr[index][start].node.zIndex += 10 + start
                    //测试
                    this.loadPokeShow(this._kaiPaiarr[index][start], 13 + 16)
                }
                ty = this._kaiPaiarr[index][0].node.position.y
                tz = this._kaiPaiarr[index][2].node.zIndex + 1

            }
            else if (i == 1) {
                for (let start = 3; start < 8; start++) {
                    this._kaiPaiarr[index][start].node.zIndex += 10 + start
                    this.loadPokeShow(this._kaiPaiarr[index][start], 11 + 16)
                }
                ty = this._kaiPaiarr[index][3].node.position.y
                tz = this._kaiPaiarr[index][7].node.zIndex + 1
            }
            else if (i == 2) {
                for (let start = 8; start < 13; start++) {
                    this._kaiPaiarr[index][start].node.zIndex += 10 + start
                    this.loadPokeShow(this._kaiPaiarr[index][start], 1 + 16)
                }
                ty = this._kaiPaiarr[index][8].node.position.y
                tz = this._kaiPaiarr[index][12].node.zIndex + 1
            }
            this._paiXingarr[index].node.setPosition(this._paiXingarr[index].node.position.x, ty - 20)
            this._paiXingarr[index].node.zIndex = tz
            this._paiXingarr[index].node.setScale(0.85);
            i++
            if (i > 3) {
                this._actPaiarr[index].unscheduleAllCallbacks()
            }
        }, deli)
    }

    showTD(target: cc.Node, dundata: s13s.IPlayerItem) {
        if (dundata.group.specialTy) {
            if (dundata.group.specialTy >= SSSPX.STH)
                return  //特殊牌型 
        }

        let index = MSSS.ins.getUISeatId(dundata.chairId)
        let dun = dundata.group.duns

        let cards = new Uint8Array(dun[0].cards)
        for (let i = 0; i < 3; i++) {
            //头墩
            this.loadPokeShow(this._kaiPaiarr[index][i], cards[i])
        }
        //设置牌型
        this._paiXingarr[index].node.setPosition(this._paiXingarr[index].node.position.x, 23)
        this.loadPxAni(this._paiXingarr[index], dun[0].ty, index)
        this._paiXingarr[index].node.setScale(0.85);
        this._lipaiAni[index].playFapai(0, 0)
        if (dun[0].max != undefined && dun[0].max) {
            this._pokerMax[index][0].active = true
            this._pokerMax[index][0].zIndex = 1000
        }

    }
    showZD(target: cc.Node, dundata: s13s.IPlayerItem) {
        if (dundata.group.specialTy) {
            if (dundata.group.specialTy >= SSSPX.STH)
                return  //特殊牌型 
        }
        let index = MSSS.ins.getUISeatId(dundata.chairId)
        let dun = dundata.group.duns
        let cards = new Uint8Array(dun[1].cards)
        for (let i = 3; i < 8; i++) {
            //中墩
            this.loadPokeShow(this._kaiPaiarr[index][i], cards[i - 3])
        }

        //设置牌型
        this._paiXingarr[index].node.setPosition(this._paiXingarr[index].node.position.x, -33)
        this._paiXingarr[index].node.setScale(0.85);
        this.loadPxAni(this._paiXingarr[index], dun[1].ty, index)

        this._lipaiAni[index].playFapai(1, 0)
        if (dun[1].max != undefined && dun[1].max) {
            this._pokerMax[index][1].active = true
            this._pokerMax[index][1].zIndex = 1000
        }
    }
    showWD(target: cc.Node, dundata: s13s.IPlayerItem) {
        if (dundata.group.specialTy) {
            if (dundata.group.specialTy >= SSSPX.STH)
                return  //特殊牌型 
        }
        let index = MSSS.ins.getUISeatId(dundata.chairId)
        let dun = dundata.group.duns
        let cards = new Uint8Array(dun[2].cards)
        for (let i = 8; i < 13; i++) {
            //尾墩
            this.loadPokeShow(this._kaiPaiarr[index][i], cards[i - 8])
        }
        this._paiXingarr[index].node.setPosition(this._paiXingarr[index].node.position.x, -105)
        this._paiXingarr[index].node.setScale(0.85);
        //设置牌型
        this.loadPxAni(this._paiXingarr[index], dun[2].ty, index)

        this._lipaiAni[index].playFapai(2, 0)
        if (dun[2].max != undefined && dun[2].max) {
            this._pokerMax[index][2].active = true
            this._pokerMax[index][2].zIndex = 1000
        }
    }
    /**
    * 显示特殊牌型
    * @param dundata 
    */
    showTSPXBG(index: number, value: boolean) {
        this._tspxarr[index].active = value
    }
    /**
     * 显示特殊牌型
     * @param dundata 
     */
    showTSPX(dundata: s13s.IPlayerItem) {
        let index = MSSS.ins.getUISeatId(dundata.chairId)
        let dun = dundata.group.duns
        let cards0 = new Uint8Array(dun[0].cards)
        let cards1 = new Uint8Array(dun[1].cards)
        let cards2 = new Uint8Array(dun[2].cards)
        this.showTSPXBG(index, false)
        for (let i = 0; i < 3; i++) {
            //
            this.loadPokeShow(this._kaiPaiarr[index][i], cards0[i])
        }
        for (let i = 3; i < 8; i++) {
            //
            this.loadPokeShow(this._kaiPaiarr[index][i], cards1[i - 3])
        }
        for (let i = 8; i < 13; i++) {
            //
            this.loadPokeShow(this._kaiPaiarr[index][i], cards2[i - 8])
        }
        this._paiXingarr[index].node.setPosition(this._paiXingarr[index].node.position.x, -93)
        this._paiXingarr[index].node.setScale(1);
        //设置牌型
        this.loadPxAni(this._paiXingarr[index], dundata.group.specialTy, index)
    }
    /**
     * 每墩的翻牌动画
     * @param index 对应的座位seatid
     * @param dunIndex 对应的墩
     * @param cards 对应每墩的牌
     * @param paixing  每墩的牌型
     */
    fangpaiDunAni(index: number, dunIndex: number, cards: Uint8Array, paixing: number) {
        let ty = 0
        let tz = 0
        let i = 0
        let cardIndex = 0
        if (dunIndex == 0) {
            cardIndex = 0
        } else if (dunIndex == 1) {
            cardIndex = 3
        } else if (dunIndex == 2) {
            cardIndex = 8
        }

        let delay = cc.delayTime(2)
        let scaleby1 = cc.scaleTo(0.5, 1.1)
        let scaleby2 = cc.scaleTo(0.5, 1.0)
        let seq = cc.sequence(scaleby1, scaleby2, delay)
        //let seq2 = cc.sequence(scaleby1,scaleby2,delay,cc.callFunc(()=>{cb()}))

        for (let i = 0; i < cards.length; i++) {
            this._kaiPaiarr[index][cardIndex].node.zIndex += 10 + cardIndex
            //测试
            this.loadPokeShow(this._kaiPaiarr[index][cardIndex], cards[i])
            // this._kaiPaiarr[index][cardIndex].node.stopAllActions()
            // this._kaiPaiarr[index][cardIndex].node.runAction(seq)
            cardIndex++
        }
        ty = this._kaiPaiarr[index][cardIndex - 1].node.position.y
        tz = this._kaiPaiarr[index][cardIndex - 1].node.zIndex + 1
        //设置牌型
        this.loadPxAni(this._paiXingarr[index], paixing, index)
        this._paiXingarr[index].node.setPosition(this._paiXingarr[index].node.position.x, ty - 20)
        this._paiXingarr[index].node.zIndex = tz
        this._paiXingarr[index].node.active = true
        this._paiXingarr[index].node.stopAllActions()
        this._paiXingarr[index].node.runAction(seq)

    }

    //重置三层叠加背景图
    resetKaipaiGg() {
        this._kaiPaiarr.forEach(element => {
            element.forEach(poker => {
                poker.spriteFrame = this._kaipaiFrame
                poker.node.active = false
                poker.node.zIndex = 0;
            })
        })
        this._paiXingarr.forEach(element => {
            element.node.active = false
        })

    }


    private setkaipaiShow(index: number, active: boolean) {
        for (let i = 0; i < 13; i++) {
            this._kaiPaiarr[index][i].node.active = active
        }
        if (!active) {
            this._paiXingarr[index].node.active = active
        }
    }

    paixingHide() {
        for (let i = 0; i < 4; i++) {
            this._paiXingarr[i].node.active = false
        }
    }

    private initkaipaiShow() {
        for (let i = 0; i < 13; i++) {
            this.loadPokeShow(this._kaiPaiarr[0][i], 54)
        }
    }

    setpokeShow(index: number, active: boolean) {  //显示牌 关闭开牌
        this.setkaipaiShow(index, false)
        if (index == 0) return
        this._faPaiarr[index]["pokeNode"].active = active

    }

    //显示墩牌  
    private showDunPoke(pokeNode: Array<cc.Sprite>, data: number[]) {

        this.removeSelfPoke()
        //this.showSelfPoke( )


        for (let i = 0; i < pokeNode.length; i++) {
            if (data[i]) {
                this.loadPokeShow(pokeNode[i], data[i])
            }
            else {
                if (pokeNode[i])
                    pokeNode[i].node.active = false
            }
        }

    }

    //显示选择自己的手牌
    private showSelfPoke() {
        if (!this._curselfPokedata) return
        this._selfPokeNode.active = true
        for (let i = 0; i < 13; i++) {
            if (this._curselfPokedata[i]) {
                this._selfPokeArr[i].node.y = 0
                this.loadPokeShow(this._selfPokeArr[i], this._curselfPokedata[i])
            }
            else {
                if (this._selfPokeArr[i])
                    this._selfPokeArr[i].node.active = false
            }
        }

    }
    //移除选择自己的手牌
    private removeSelfPoke() {
        //移出手牌
        if (!this._curselfPokedata) return

        for (let i = 0; i < this._selectPokeArr.length; i++) {
            for (let j = 0; j < this._curselfPokedata.length; j++) {
                if (this._curselfPokedata[j] == this._selectPokeArr[i]) {
                    UDebug.Log("移除选择自己的手牌" + this._curselfPokedata[j])
                    // UDebug.Log("移除手牌"+this._selectPokeArr[i])
                    this._curselfPokedata.splice(j, 1)

                }
            }
        }

        for (let i = 0; i < 13; i++) {
            if (this._selfPokeArr[i].node.y >= 15) {
                this._selfPokeArr[i].node.y = 0
                this._selfPokeArr[i].node.active = false

            }
        }
    }

    /**
     * 加载牌图片 牌ui   牌值
     * @param poke 
     * @param value 
     */
    private loadPokeShow(poke: cc.Sprite, value: number) {
        if (poke && value) {
            let index = value - 16
            poke.spriteFrame = this._res.getFrames("poker_" + index);
            poke.node["pokedata"] = index + 16
            poke.node.active = true
            //UDebug.Log("load 牌"+ poke.node["pokedata"])
        }

    }

    //刷新自己牌的位置
    private refselfPokePos() {
        for (let i = 0; i < 13; i++) {
            if (this._selfPokeArr[i].node.y >= 15) {
                this._selfPokeArr[i].node.y = 0
            }
        }

    }

    //**手牌 点击*/

    cardTouch() {
        //this.isMove = false
        var self = this
        //UDebug.Log("cdu//"+this._selfPokeArr.length)
        for (let i = 0; i < 13; i++) {
            this._selfPokeArr[i].node.on(cc.Node.EventType.TOUCH_START, function (params) {
                //self.isMove = false
                //UDebug.Info( params)
                self.refSelectPoke(params)
            });

            // this._selfPokeArr[i].node.on(cc.Node.EventType.TOUCH_MOVE, function (params) {
            //     //self.isMove = true
            //     var delta = params.touch.getDelta();
            //     params.target.x += delta.x;
            //     params.target.y += delta.y;
            //     if (params.target.y < 0) {
            //         params.target.y = 0
            //     }
            // });

            // this._selfPokeArr[i].node.on(cc.Node.EventType.TOUCH_END, function (params) {
            //     params.target.x = self.cardPos[i] //delta.x;
            //     if (params.target.y > 20) {
            //         cc.log("发送大牌")
            //     }
            //     if (self.isMove) {
            //         params.target.y = 0
            //     } else {
            //         params.target.y = 15
            //     }
            // });

            //手指移出屏幕了
            // this._selfPokeArr[i].node.on(cc.Node.EventType.TOUCH_CANCEL, function (params) {
            //     params.target.x = self.cardPos[i] //delta.x;
            //     if (self._selfPokeArr[i].node.y > 20) {
            //         cc.log("手指移出屏幕了")
            //     }
            //     params.target.y = 0
            // });

        }
    }

    //刷新选中的牌
    private refSelectPoke(params: cc.Event) {

        if (this._selectPokeArr.length < 5) {

            if (params.target.y >= 15) {
                cc.log("取消选择")
                params.target.y = 0;
            } else {
                params.target.y = 15;
            }
        }
        else {
            if (params.target.y >= 15) {
                cc.log("取消选择")
                params.target.y = 0;
            } else {

                //超牌检测
                cc.log("cch超过五张牌了")
                AppGame.ins.showTips({ data: "超过五张牌了", type: ETipType.onlyone });
                // this._selectPokeArr.forEach(element => {
                //     UDebug.Log(element)
                // });
            }
        }

        this._selectPokeArr = new Array()
        for (let i = 0; i < 13; i++) {
            if (this._selfPokeArr[i].node.y >= 15) {

                this._selectPokeArr.push(this._selfPokeArr[i].node["pokedata"])

            }
        }

        this._selectPokeArr.sort(function (a, b) {
            return a > b ? -1 : 1
        })
        UDebug.Log("当前选择的 牌长度" + this._selectPokeArr.length)


        this.checkDunState()
    }
    /** 检测刷新面板状态 */
    private checkDunState() {
        this._toudunPanel.interactable = false
        this._zhongdunPanel.interactable = false
        this._weidunPanel.interactable = false
        this.closeHLight()
        if (this._selectPokeArr.length == 3 && this._dunSelArr[0] == true) {
            this._toudunPanel.interactable = true
            this._toudunPanel.node["light"].node.active = true
        } else if (this._selectPokeArr.length == 5) {
            if (this._dunSelArr[1] == true) {
                this._zhongdunPanel.interactable = true
                this._zhongdunPanel.node["light"].node.active = true
            }

            if (this._dunSelArr[2] == true) {
                this._weidunPanel.interactable = true
                this._weidunPanel.node["light"].node.active = true
            }
        }
    }
    private AutosetlectTishi(cdata: number) {

        this.selectTishi(cdata)
        UDebug.Log("自动悬选择------" + cdata)

        this._tishiPanel[cdata].getComponent(cc.Toggle).isChecked = true


    }
    /**选择的子牌型提示面板 */
    private selectTishi(cdata: number) {
        this._tempcurts = Number(cdata)
        UDebug.Log("selectTishi" + cdata)
        for (let index = 0; index < 3; index++) {  //关闭所有提示面板 
            this.settishiPanelShow(index, false)
        }
        //头、中、尾墩摆牌的三种提示面板
        for (let index = 0; index < this._selfDundata.length; index++) {//开启有的提示面板
            if (index < 3) {
                if (this._roominfo == ESSSRoom.FAST) {
                    this._tempcurts = 0
                    const element = this._selfDundata[0];
                    this.settishiPanelShow(0, true, element.pokerType, element.specialTy)
                    break
                }
                else if (this._roominfo == ESSSRoom.general) {
                    const element = this._selfDundata[index];
                    this.settishiPanelShow(index, true, element.pokerType, element.specialTy)
                }

            }
        }
        const pokedata = this._selfDundata[cdata]
        if (pokedata) {
            this.showOneDunpoke(0, pokedata.pokerType[0], pokedata.pokerIcons[0]) //头墩
            this.showOneDunpoke(1, pokedata.pokerType[1], pokedata.pokerIcons[1]) //中墩
            this.showOneDunpoke(2, pokedata.pokerType[2], pokedata.pokerIcons[2]) //尾墩
        }

    }
    /**
     * 取消牌墩 刷新
     * @param caller 
     */
    cancelCards(data: s13s.CMD_S_CancelCards) {


        if (this._curselfPokedata.length == 8 || this._curselfPokedata.length == 10) //剩余8张 还原成13即可
        {
            // //重新赋值自已13张牌的数值
            // const tempdata = JSON.parse(JSON.stringify(this._selfPokedata)) 
            // this._curselfPokedata = tempdata
            // //this._curselfPokedata = [1,2,23,34,5,6,7,8,9,10,12,11,13] //测试数据
            // this.huaseSort()
            // this._dunSelArr = [true,true,true]
            // this._toudunPanel.interactable = false
            // this._zhongdunPanel.interactable =false
            // this._weidunPanel.interactable = false

            // this. _toudaoDel.node.active = false
            // this. _zhongdaoDel.node.active = false
            // this. _weidaoDel.node.active = false

            // this.clearDun()
            this.onshoudongBaipaibtn()
        }
        else {
            this.clearOneDun(data.dt) //清空某一顿
            this._dunSelArr[data.dt] = true
            let carddata = new Uint8Array(data.cpy)
            UDebug.Info(carddata)
            let tempdata = new Array<number>()
            for (let index = 0; index < carddata.length; index++) {
                const element = carddata[index];
                tempdata[index] = element
            }
            this._curselfPokedata = tempdata
            this.showSelfPoke()

            this._quedingbtn.node.active = false
            this._chongxinbtn.node.active = false
            this.checkbtns(data.enums.v123, 4) //顺子
            this.checkbtns(data.enums.v123sc, 8) //同花顺
            this.checkbtns(data.enums.v20, 1) //对子
            this.checkbtns(data.enums.v22, 2) //对子
            this.checkbtns(data.enums.v30, 3) //三张
            this.checkbtns(data.enums.v32, 6) //葫芦(三张加一对)
            this.checkbtns(data.enums.v40, 7) //铁支（四张）
            this.checkbtns(data.enums.vsc, 5) //同花
            this._pokebtnsNode.active = true  //打开按钮
        }


    }
    /**
     * //收到当前提示牌型数据
     * @param data 
     */

    setbtns(data: s13s.CMD_S_ManualCards) {
        UDebug.Log("重新摆牌.......")
        if (data.result == 1) {  // 0 成功  1 倒水 
            var context = {
                data: "倒水拉! 已为您自动摆牌。",
                time: 3.5
            }
            AppGame.ins.showTips(context)
            UDebug.Log("!!!!!!!!!!!倒水拉。。。已为您自动摆牌.......!!!!!!!!!!")
            this._tempcurts = 0
            this.onyijianBaipaibtn()
            return
        }
        this._pokedatabtnsArr = new Array()
        this.checkbtns(data.enums.v123, 4) //顺子
        this.checkbtns(data.enums.v123sc, 8) //同花顺
        this.checkbtns(data.enums.v20, 1) //对子
        this.checkbtns(data.enums.v22, 2) //对子
        this.checkbtns(data.enums.v30, 3) //三张
        this.checkbtns(data.enums.v32, 6) //葫芦(三张加一对)
        this.checkbtns(data.enums.v40, 7) //铁支（四张）
        this.checkbtns(data.enums.vsc, 5) //同花
        // let carddata =  new Uint8Array(data.cpy)
        // UDebug.Info(carddata)
        // let tempdata  = new Array<number>()
        // for (let index = 0; index < carddata.length; index++) {
        //     const element = carddata[index];
        //     tempdata[index] = element
        // }
        //this._curselfPokedata  = tempdata

        //是否有特殊
        this._pokebtnsArr[9].interactable = this._specialTy == 0 ? false : true
        if (this._pokebtnsArr[9].interactable) {
            this._pokebtnsArr[9].node.getComponentInChildren(cc.Label).string = SSSPXStr[this._specialTy]
        } else {
            this._pokebtnsArr[9].node.getComponentInChildren(cc.Label).string = "特殊牌型"
        }
        UDebug.Log(data.ty)
        if (data.ty) {
            UDebug.Log("数据有" + data.ty)
        }
        if (data.ty == 0) {
            UDebug.Log("数据00 有" + data.ty)
        }
        if (data.ty != 0) {
            UDebug.Log("数据 不等于0 有" + data.ty)
        }
        if (data.ty == null) {
            UDebug.Log("数据为空  有" + data.ty)
        }
        if (data.ty != null) {
            UDebug.Log("数据  不为空  有" + data.ty)
        }
        let cpydata = new Uint8Array(data.cpy);

        // if (this._curselfPokedata.length == 13 && data.ty==0 && cpydata.length < 3){
        //     data.ty = 0
        //     UDebug.Log("数据  赋值 "+data.ty)
        // }
        if (cpydata.length < 3) {
            UDebug.Log("数据  赋值 " + cpydata.length)
        }
        if (data.ty != null && cpydata.length >= 3) {
            this._pokebtnsArr[9].interactable = false  //出过牌后关闭特殊按钮
            this._curselcetType = Number(data.ty)
            UDebug.Log("显示放牌----------" + this._curselcetType)
            //if(data.dt == 0)
            this.showOneDunpoke(data.dt, this._curselcetType, this._selectPokeArr)
            //  this.loadPxImg(this._toudunPanel.node["paixing"],data.ty)
            // if(data.dt == 1)
            //   this.showOneDunpoke(2,this._curselcetType,this._selectPokeArr)
            //   //  this.loadPxImg(this._zhongdunPanel.node["paixing"],data.ty)
            // if(data.dt == 2)
            //     this.showOneDunpoke(2,this._curselcetType,this._selectPokeArr)
            //  this.loadPxImg(this._weidunPanel.node["paixing"],data.ty)
        }
        else {
            if (this._curselfPokedata.length <= 5) {  //最后一顿的时候
                this._pokebtnsArr[9].interactable = false  //出过牌后关闭特殊按钮
                this._curselcetType = Number(data.ty)
                UDebug.Log("显示 最后一蹲  放牌----------" + this._curselcetType)
                this.showOneDunpoke(data.dt, this._curselcetType, this._selectPokeArr)
            }
        }
        this._pokebtnsNode.active = true  //打开按钮
        UDebug.Info(this._curselfPokedata)
        this.autoMovePai()
    }

    /**游戏结束 */
    getpokeend(gameendData: number[]) {



    }

    /**
       * 每墩的翻牌动画
       * @param index 对应的座位seatid
       * @param dunIndex 对应的墩
       * @param cards 对应每墩的牌
       * @param paixing  每墩的牌型
       * @param totalScoe 每墩的输赢分值
      
      fangpaiDunAni(index:number,dunIndex:number,cards:number[],paixing:number,totalScoe:number) */

    //比牌
    compareCardsInfo(data: s13s.CMD_S_CompareCards) {
        let deli = 2
        let index = 0
        this._fangpaiCD.unscheduleAllCallbacks()
        this._fangpaiCD.schedule(() => {
            index++
            //if(index > data.player)
        }, deli)
    }

    //设置牌型按钮显示
    private checkbtns(data: Uint8Array[], index: number) {
        this._pokedatabtnsArr[index] = new Array()
        if (data.length > 0) {

            this._pokebtnsArr[index].interactable = true //开启牌型按钮
            this._pokebtnsArr[index].node["curindex"] = -1
            data.forEach(element => {  //一种类型
                UDebug.Log("开启id=" + index)
                //UDebug.Log(new Uint8Array(element))
                let tempdata = new Array()
                element.forEach(data => {
                    tempdata.push(data)
                })

                // if((index == Number(4) || index == Number(5) || index == Number(8) && tempdata.length < Number(5))) 
                // {
                //     UDebug.Log("关闭按钮id="+index)
                //     this._pokebtnsArr[index].interactable = false //禁用牌型按钮
                // }
                this._pokedatabtnsArr[index].push(tempdata)
            });
        } else {
            UDebug.Log("关闭按钮id=" + index)
            this._pokebtnsArr[index].interactable = false //禁用牌型按钮
        }
    }

    //弹出所选牌
    private clickbtnUpPoke(typeindex: number) {
        UDebug.Info(this._pokedatabtnsArr[typeindex])
        this._curselcetType = Number(typeindex)  //按钮类型转为牌类型
        this._selectPokeArr = []
        let datapoke = this._pokedatabtnsArr[typeindex]
        let curindex = this._pokebtnsArr[typeindex].node["curindex"]
        // UDebug.Log("da大枪 "+curindex)
        curindex = curindex >= datapoke.length - 1 ? 0 : curindex + 1
        //UDebug.Log("da大枪后。。。。 "+curindex)
        this._pokebtnsArr[typeindex].node["curindex"] = curindex
        const element = datapoke[curindex];
        this.refselfPokePos()
        element.forEach(element => {
            for (let j = 0; j < 13; j++) {
                if (this._selfPokeArr[j].node["pokedata"] == element) {
                    this._selfPokeArr[j].node.y = 15
                    this._selectPokeArr.push(this._selfPokeArr[j].node["pokedata"])
                    break
                }
            }
        })
    }
    //--------------事件

    public onquedingbtnibtn(event: TouchEvent, isAuto?: boolean, isGameing: boolean = true) {
        UDebug.Log("onc确定" + isAuto);
        this._music.playClick()

        //手动摆牌
        if (this._yijianbtn.node.active) {
            this._tempcurts = -1
        }
        let isAutoOpertor: boolean = false;
        if (isAuto == true && isAuto != undefined) {
            isAutoOpertor = true;
        } else {
            isAutoOpertor = false;
        }
        MSSS.ins.onquedingBtn(this._tempcurts, isAutoOpertor)  // 0 是第一个提示的 以此类推 从枚举的几组墩中选择一组，-1手动摆牌确认
        //等待开牌时显示自已三叠的背牌
        this.setkaipaiShow(0, isGameing)

        if (this._cdTime > 3)  //少于的话 没必要显示倒计时了
        {
            this._fangpaiIsTurn = true
            this._totalTurnTime = this._cdTime
            this._allTimer = this._cdTime;
            this._isTurn = false;
            this.updateTimerPro(0, false);
        }
        this.setliPaiPanel(false)
        this._music.playZPWC();  //组牌完成
    }
    //普通牌型按钮点击事件
    private onlipaiPTBtn(e: cc.Event.EventTouch) {
        this._music.playClick()
        let typename = e.target.name.split('_')
        UDebug.Log("onc普通牌型按钮点击事件ceshi测试按钮" + typename[1])
        this.clickbtnUpPoke(typename[1])
        this.checkDunState()
    }
    //特殊牌型按钮点击事件
    private onlipaiTSBtn() {
        this._music.playClick()
        UDebug.Log("oon特殊牌型按钮点击事件测试按钮")
        this._tempcurts = 0
        this.onyijianBaipaibtn()
    }
    //一键按钮点击事件
    private onyijianBaipaibtn() {
        this._music.playClick()
        this._pokebtnsNode.active = false
        this._selfPokeNode.active = false
        this._yijianbtn.node.active = false
        this._shoudongbtn.node.active = true
        this._huasebtn.node.active = false
        this._daxiaobtn.node.active = false
        this._quedingbtn.node.active = true
        this._chongxinbtn.node.active = false
        // this._btn_hsdxbg.active = false
        if (this._tempcurts == -1) {
            this._tempcurts = 0
        }
        this._selectPokeArr = []
        this.AutosetlectTishi(this._tempcurts)

        this.clearBtnIndex()

        this._toudaoDel.node.active = false
        this._zhongdaoDel.node.active = false
        this._weidaoDel.node.active = false
        UDebug.Log("oo一键按钮点击事件点击事件测试按钮" + this._tempcurts)
        this.refBaiPaiTip(false);
    }

    //手动按钮点击事件
    private onshoudongBaipaibtn() {

        this.clearDun()
        MSSS.ins.onShoudong()
        this._tishiNode.active = false
        this._headBaiPaiTips.active = false
        this._pokebtnsNode.active = false
        this._yijianbtn.node.active = true
        this._shoudongbtn.node.active = false
        this._huasebtn.node.active = true
        this._daxiaobtn.node.active = true
        this._quedingbtn.node.active = false
        // this._btn_hsdxbg.active = true
        // this._toudunPanel.interactable = true
        // this._zhongdunPanel.interactable = true
        // this._weidunPanel.interactable = true
        //重新赋值自已13张牌的数值
        const tempdata = JSON.parse(JSON.stringify(this._selfPokedata))
        this._curselfPokedata = tempdata
        //this._curselfPokedata = [1,2,23,34,5,6,7,8,9,10,12,11,13] //测试数据

        //  = true
        // this._daxiaobtn.isChecked = false

        if (this._huasebtn.isChecked) {
            this.onHuaseSort();
        } else {
            this.ondaxiaoSort();
        }




        this._dunSelArr = [true, true, true]
        this._toudunPanel.interactable = false
        this._zhongdunPanel.interactable = false
        this._weidunPanel.interactable = false

        this._toudaoDel.node.active = false
        this._zhongdaoDel.node.active = false
        this._weidaoDel.node.active = false

        this.closeHLight()
        UDebug.Log("oo一手动按钮点击事件点击事件击事件测试按钮")
        UDebug.Info(this._curselfPokedata)
        this.refBaiPaiTip(true);
    }

    /**
     * 刷新 选牌提示 
     * @param bool 
     * @param index 
     */
    refBaiPaiTip(bool: boolean, index: number = 0) {
        if (index == 0) {
            // this._toudunPanel.node.getChildByName("labtou").active = bool;
            // this._zhongdunPanel.node.getChildByName("labtou").active = bool;
            // this._weidunPanel.node.getChildByName("labtou").active = bool;
        } else {
            switch (index) {
                case 1:
                    // this._toudunPanel.node.getChildByName("labtou").active = bool;
                    break
                case 2:
                    // this._zhongdunPanel.node.getChildByName("labtou").active = bool;
                    break;
                case 3:
                    // this._weidunPanel.node.getChildByName("labtou").active = bool;
                    break;
            }
        }
    };

    private onchongxinBaipaibtn() {
        this._chongxinbtn.node.active = false
        this.onshoudongBaipaibtn()
    }
    //点击头墩事件
    private ontoudun() {
        this._music.playClick()
        UDebug.Log("ontoudun点击事件" + this._selectPokeArr.length)
        if (this._selectPokeArr.length == 3) {
            let u8arr = new Uint8Array(this._selectPokeArr)
            // for (let index = 0; index < pokedata.length; index++) {
            //     const element = pokedata[index];
            //     u8arr[index] = element
            // }
            MSSS.ins.onShoudong(0, u8arr)
            // this.showOneDunpoke(0,this._curselcetType,this._selectPokeArr)
            UDebug.Log("ontoudun:" + u8arr)
            // this._selectPokeArr = []
            this.refBaiPaiTip(false, 1);
        }

    }
    private onzhongdun() {
        this._music.playClick()
        UDebug.Log("onzhongdun点击事件" + this._selectPokeArr.length)
        if (this._selectPokeArr.length == 5) {

            let u8arr = new Uint8Array(this._selectPokeArr)
            MSSS.ins.onShoudong(1, u8arr)
            //this.showOneDunpoke(1,this._curselcetType,this._selectPokeArr)
            UDebug.Log("onzhongdun:" + u8arr)
            // this._selectPokeArr = []
            this.refBaiPaiTip(false, 2);
        }

    }
    private onweidun() {
        this._music.playClick()
        UDebug.Log("onweidun点击事件" + this._selectPokeArr.length)
        if (this._selectPokeArr.length == 5) {

            let u8arr = new Uint8Array(this._selectPokeArr)
            MSSS.ins.onShoudong(2, u8arr)
            UDebug.Log("onweidun:" + u8arr)
            //this.showOneDunpoke(2,this._curselcetType,this._selectPokeArr)
            // this._selectPokeArr = []
            this.refBaiPaiTip(false, 3);
        }

    }
    //取消头墩
    private ontoudundel() {
        this._toudaoDel.node.active = false
        this.refBaiPaiTip(true, 1);
        if (this._curselfPokedata.length == 10) //还原13即可
            this.onshoudongBaipaibtn()
        else
            MSSS.ins.oncancelCradBtn(0)
    }
    private onzhongdundel() {
        this._zhongdaoDel.node.active = false
        this.refBaiPaiTip(true, 2);
        if (this._curselfPokedata.length == 8) //还原13即可
            this.onshoudongBaipaibtn()
        else
            MSSS.ins.oncancelCradBtn(1)
    }

    private onweidundel() {
        this._weidaoDel.node.active = false
        this.refBaiPaiTip(true, 3);
        if (this._curselfPokedata.length == 8) //还原13即可
            this.onshoudongBaipaibtn()
        else
            MSSS.ins.oncancelCradBtn(2)

    }
    //手动摆牌，最后一墩自动摆牌
    private autoMovePai() {
        var lastdun = -1
        if (this._dunSelArr[0] && !this._dunSelArr[1] && !this._dunSelArr[2]) {
            lastdun = 0
        } else if (!this._dunSelArr[0] && this._dunSelArr[1] && !this._dunSelArr[2]) {
            lastdun = 1
        } else if (!this._dunSelArr[0] && !this._dunSelArr[1] && this._dunSelArr[2]) {
            lastdun = 2
        } else if (!this._dunSelArr[0] && !this._dunSelArr[1] && !this._dunSelArr[2]) {
            lastdun = 3
        }


        if (lastdun >= 0) {
            this._selectPokeArr = []
            for (let i = 0; i < 13; i++) {
                UDebug.Log("准备数 据" + i)
                if (this._selfPokeArr[i].node.active) {
                    this._selectPokeArr.push(this._selfPokeArr[i].node["pokedata"])
                    this._selfPokeArr[i].node.active = false
                    UDebug.Log("数 据" + this._selfPokeArr[i].node["pokedata"])
                }

            }
            //this._curselfPokedata
            if (lastdun == 0) {
                this.ontoudun()
            } else if (lastdun == 1) {
                this.onzhongdun()
            } else if (lastdun == 2) {
                this.onweidun()
            }
            this._quedingbtn.node.active = true
            this._pokebtnsNode.active = false
            this._chongxinbtn.node.active = true
            this.clearBtnIndex()
        }
        else {

            this._selectPokeArr = []  //没有结束 清理
        }
    }

    //选择的提示牌类型 点击选择提示面板
    onSelectTishi(event: cc.Event, cdata: number) {
        UDebug.Log("点击选择提示面板OnselectTishi" + cdata)
        this._music.playXZPX();  //选择牌型
        this.selectTishi(cdata)
        this._toudaoDel.node.active = false
        this._zhongdaoDel.node.active = false
        this._weidaoDel.node.active = false
    }

    private huaseSort() {
        this._curselfPokedata.sort(function (a, b) {   //花色排序
            return a > b ? -1 : 1
        })
        this.showSelfPoke()

    }
    //排序方式
    onHuaseSort() {
        this._music.playClick()
        if (!this._huasebtn.interactable) return
        UDebug.Log("onHuaseSort")
        this.closeHLight()
        this._selectPokeArr = []
        this.huaseSort()
        this._huasebtn.isChecked = true;
        this._daxiaobtn.isChecked = false;

    }

    //排序方式
    ondaxiaoSort() {
        this._music.playClick()
        if (!this._daxiaobtn.interactable) return
        UDebug.Log("ondaxiaoSort")
        this._huasebtn.isChecked = false;
        this._daxiaobtn.isChecked = true;
        this._curselfPokedata.sort(function (a, b) {   //大小排序
            if (a % 16 == 1) {
                a += 13
            }
            if (b % 16 == 1) {
                b += 13
            }
            return a % 16 > b % 16 ? 1 : -1
        })
        this.closeHLight()
        this._selectPokeArr = []
        this.showSelfPoke()
    }

    clearPmb() {
        for (let index = 0; index < 4; index++) {
            this._pmbarr[index].active = false
        }

    }
    /**清理每墩数据 */
    public clearDun() {
        //摆牌界面的头墩、中墩、尾墩
        for (let i = 0; i < 3; i++) {
            this._toudunPokeArr[i].node.active = false
        }

        for (let i = 0; i < 4; i++) {
            this._pokerMax[i][0].active = false
            this._pokerMax[i][1].active = false
            this._pokerMax[i][2].active = false
        }


        for (let i = 0; i < 5; i++) {
            this._zhongdunPokeArr[i].node.active = false
            this._weidunPokeArr[i].node.active = false
        }
        this._toudunPanel.node["paixing"].node.active = false
        this._zhongdunPanel.node["paixing"].node.active = false
        this._weidunPanel.node["paixing"].node.active = false
        this.closeHLight()
    }

    private clearOneDun(index: number) {

        if (index == 0) {
            for (let i = 0; i < 3; i++) {
                this._toudunPokeArr[i].node.active = false
            }
            this._toudunPanel.node["paixing"].node.active = false
        }
        else {
            if (index == 1) {

                for (let i = 0; i < 5; i++) {
                    this._zhongdunPokeArr[i].node.active = false
                }

                this._zhongdunPanel.node["paixing"].node.active = false
            }
            else {
                for (let i = 0; i < 5; i++) {
                    this._weidunPokeArr[i].node.active = false
                }

                this._weidunPanel.node["paixing"].node.active = false
            }

        }
        this.closeHLight()

    }

    private closeHLight() {

        this._toudunPanel.node["light"].node.active = false
        this._zhongdunPanel.node["light"].node.active = false
        this._weidunPanel.node["light"].node.active = false
    }
    private clearBtnIndex() {

        for (let index = 1; index <= 9; index++) {
            this._pokebtnsArr[index].node["curindex"] = 0
        }
    }


    public clearpoke() {
        this.clearBtnIndex()
        for (let index = 0; index < 4; index++) {
            this._pmbarr[index].active = false
            this._shootAniArr[index].enabled = false
            this._holesAniArr[index].enabled = false
            this.showTSPXBG(index, false)
            this.setpokeShow(index, false)
        }
        this.resetKaipaiGg()
    }

    /**
     * @description  通过玩家座位id 清理卡牌
     * @param seatId  座位id
     */
    clearPokerBySeatId(seatId: number) {
        this._pmbarr[seatId].active = false;
        this._shootAniArr[seatId].enabled = false;
        this._holesAniArr[seatId].enabled = false
        this.showTSPXBG(seatId, false);
        this.setpokeShow(seatId, false);
        this._pokerMax[seatId][0].active = false;
        this._pokerMax[seatId][1].active = false;
        this._pokerMax[seatId][2].active = false;
        this._tspxarr[seatId].active = false;
    };

    clear() {
        this._isTurn = false
        this.updateLiPaiTimerPro(0, true);
        this.updateTimerPro(0, true);
        this._yijianbtn.node.active = false
        this._selfPokedata = []
        this.clearDun()
        this.clearpoke()
        this.paixingHide()
        this.setliPaiPanel(false)
        let cardIndex = 0;
        for (let i = 0; i < this._kaiPaiarr.length; i++) {
            let arr = this._kaiPaiarr[i];
            for (let z = 0; z < arr.length; z++) {
                arr[z].node.zIndex -= 10 + cardIndex;
                arr[z].node.stopAllActions();
            }
            cardIndex++;
        };
        for (let i = 0; i < this._actPaiarr.length; i++) {
            let actNode = this._actPaiarr[i];
            actNode.unscheduleAllCallbacks();
        };

    }
}
