import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import { UIBJChips } from "../UBJData";
import AppGame from "../../../public/base/AppGame";
import MBJ, { BJ_SCALE, BJ_SELF_SEAT } from "../MBJ";
import UDebug from "../../../common/utility/UDebug";
import UAudioManager from "../../../common/base/UAudioManager";
import VBJSeat from "../VBJSeat";


const { ccclass, property } = cc._decorator;
/**
 * 创建:gss
 * 加注面板
 */
@ccclass
export default class VBJAddChips extends cc.Component {
    /**
     * chip的btn节点
     */
    private _chips: Array<cc.Button>;
    /**
     * chip的数值
     */
    private _chipsNum: Array<cc.Label>;
    /**
     * 
     */
    private _data: Array<UIBJChips>;

    private _chip_node: cc.Node;

    private _chip_add: cc.Button;
    private chip_addImg: cc.Label;
    private chip_addImgh: cc.Label;
    private _otherChip_node: cc.Node;
    private _addchip_node: cc.Node;
    private _chip_xuya: cc.Node;
    private _chip_complete: cc.Node; //完成下注
    private _baoxian_node: cc.Node;
    private _caozuo_node: cc.Node;
    private _chip_min: cc.Button;
    private _chip_max: cc.Button;

    private _bumai: cc.Node;
    private _maibaoxian: cc.Node;
    private fenpaiBtn: cc.Button;
    private fenpaiBtnImg: cc.Label;
    private fenpaiBtnImgh: cc.Label;

    private shuangbeiBtn: cc.Button;
    private shuangbeiImg: cc.Label;
    private shuangbeiImgh: cc.Label;
    private xuyaImg: cc.Label;
    private xuyaImgh: cc.Label;

    private tingpaiBtn: cc.Button;
    private yaopaiBtn: cc.Button;
    private _dizhuMinNum: cc.Label;
    private _dizhuMaxNum: cc.Label;
    private _dizhuMinNumh: cc.Label; //灰
    private _dizhuMaxNumh: cc.Label;
    private _difen: number;
    private _maxscore: number;//最大下注分
    private _selfScore: number; //自己的分
    init(): void {
        this._chips = [];
        this._chipsNum = [];
        this._chip_node = UNodeHelper.find(this.node, "chip_node");
        this._chip_min = UNodeHelper.find(this._chip_node, "chip_min").getComponent(cc.Button);
        this._chip_max = UNodeHelper.find(this._chip_node, "chip_max").getComponent(cc.Button);
        this._chip_add = UNodeHelper.find(this._chip_node, "chip_add").getComponent(cc.Button);
        this.chip_addImg = UNodeHelper.find(this._chip_node, "chip_add/chip_addImg").getComponent(cc.Label);
        this.chip_addImgh = UNodeHelper.find(this._chip_node, "chip_add/chip_addImgh").getComponent(cc.Label);
        this._chip_xuya = UNodeHelper.find(this._chip_node, "chip_xuya");
        this._chip_complete = UNodeHelper.find(this._chip_node, "chip_complete");
        this._otherChip_node = UNodeHelper.find(this._chip_node, "otherChip_node");
        this._addchip_node = UNodeHelper.find(this._chip_node, "addchip_node");
        this._dizhuMinNum = UNodeHelper.find(this._chip_node, "chip_min/chip_min_number").getComponent(cc.Label);
        this._dizhuMaxNum = UNodeHelper.find(this._chip_node, "chip_max/chip_max_number").getComponent(cc.Label);
        this._dizhuMinNumh = UNodeHelper.find(this._chip_node, "chip_min/chip_min_numberh").getComponent(cc.Label);
        this._dizhuMaxNumh = UNodeHelper.find(this._chip_node, "chip_max/chip_max_numberh").getComponent(cc.Label);
        this.xuyaImg = UNodeHelper.find(this._chip_node, "chip_xuya/chip_xuyaImg").getComponent(cc.Label);
        this.xuyaImgh = UNodeHelper.find(this._chip_node, "chip_xuya/chip_xuyaImgh").getComponent(cc.Label);

        this._chip_min.node.on('click', this.onclickAddMin, this);
        this._chip_max.node.on('click', this.onclickAddMax, this);
        this._chip_add.node.on('click', this.onclickAddother, this);
        UEventHandler.addClick(this._chip_xuya, this.node, "VBJAddChips", "onclickAddxuya")
        UEventHandler.addClick(this._chip_complete, this.node, "VBJAddChips", "onclickChipComplete")

        this._baoxian_node = UNodeHelper.find(this.node, "baoxian_node");
        this._bumai = UNodeHelper.find(this._baoxian_node, "bumai");
        this._maibaoxian = UNodeHelper.find(this._baoxian_node, "maibaoxian");
        UEventHandler.addClick(this._bumai, this.node, "VBJAddChips", "onclickbumaibaox")
        UEventHandler.addClick(this._maibaoxian, this.node, "VBJAddChips", "onclickmaibaox")

        this._caozuo_node = UNodeHelper.find(this.node, "caozuo_node");
        this.fenpaiBtn = UNodeHelper.find(this._caozuo_node, "fenpai").getComponent(cc.Button);
        this.shuangbeiBtn = UNodeHelper.find(this._caozuo_node, "shuangbei").getComponent(cc.Button);
        this.tingpaiBtn = UNodeHelper.find(this._caozuo_node, "tingpai").getComponent(cc.Button);
        this.yaopaiBtn = UNodeHelper.find(this._caozuo_node, "yaopai").getComponent(cc.Button);

        this.fenpaiBtnImg = UNodeHelper.find(this._caozuo_node, "fenpai/fenpaiImg").getComponent(cc.Label);
        this.fenpaiBtnImgh = UNodeHelper.find(this._caozuo_node, "fenpai/fenpaiImgh").getComponent(cc.Label);
        this.shuangbeiImg = UNodeHelper.find(this._caozuo_node, "shuangbei/shuangbeiImg").getComponent(cc.Label);
        this.shuangbeiImgh = UNodeHelper.find(this._caozuo_node, "shuangbei/shuangbeiImgh").getComponent(cc.Label);


        this.fenpaiBtn.node.on('click', this.onclickfenpai, this);
        this.shuangbeiBtn.node.on('click', this.onclickshuanbei, this);
        this.tingpaiBtn.node.on('click', this.onclicktingpai, this);
        this.yaopaiBtn.node.on('click', this.onclickyaopai, this);
        // UEventHandler.addClick(this.fenpaiBtn, this.node, "VBJAddChips", "onclickfenpai")
        // UEventHandler.addClick(this.shuangbeiBtn, this.node, "VBJAddChips", "onclickshuanbei")
        // UEventHandler.addClick(this.tingpaiBtn, this.node, "VBJAddChips", "onclicktingpai")
        // UEventHandler.addClick(this.yaopaiBtn, this.node, "VBJAddChips", "onclickyaopai")

        this._chip_node.active = false
        this._chip_add.node.active = true


        this._baoxian_node.active = false
        this._caozuo_node.active = false
        this._otherChip_node.active = false
        this._addchip_node.active = false;

        //let len1 = chip_node.childrenCount;
        // for (let i = 0; i < len1; i++) {
        //     let cnd = chip_node.children[i];
        //     UEventHandler.addClick(cnd, this.node, "VBJAddChips", "onselectchip", i)
        //     this._chips.push(cnd.getComponent(cc.Button));
        //     let clb = chip_label.children[i];
        //     this._chipsNum.push(clb.getComponent(cc.Label));
        // }
    }
    private onselectchip(evt: any, idx: number): void {
        if (!this._data && this._data.length <= idx) {
            return;
        }
        let dt = this._data[idx];
        if (dt.canUse) {
            // AppGame.ins.bjModel.requestJiaZhu(idx);
        }
    }
    /**
     * 绑定数据
     * @param data 
     */
    bind(data: Array<UIBJChips>): void {
        this._data = data;
        let len = data.length;
        for (let i = 0; i < len; i++) {
            const element = data[i];
            this._chips[i].interactable = element.canUse;
            this._chipsNum[i].string = "+" + (element.count * BJ_SCALE).toString();
        }
    }

    private setChipMin(value: boolean)  //设置灰暗
    {
        this._chip_min.interactable = value
        this._dizhuMinNum.node.active = value
        this._dizhuMinNumh.node.active = !value
    }

    private setChipMax(value: boolean) {
        this._chip_max.interactable = value
        this._dizhuMaxNum.node.active = value
        this._dizhuMaxNumh.node.active = !value
    }

    private setChipAdd(value: boolean) {
        this._chip_add.interactable = value
        this.chip_addImg.node.active = value
        this.chip_addImgh.node.active = !value
    }

    private setChipXuya(value: boolean) {
        this._chip_xuya.active = value;
        let currChipNum = AppGame.ins.bjModel.getCurChipNum
        let xuyaact = currChipNum == 0 ? false : true
        this._chip_xuya.getComponent(cc.Button).interactable = xuyaact
        this.xuyaImg.node.active = xuyaact
        this.xuyaImgh.node.active = !xuyaact

    }

    /** 下注按钮客户端金币不足逻辑*/
    getscore(score: number)  // 分数是缩小的 底注没缩
    {
        this._selfScore = score / BJ_SCALE
        let tempscore = score / BJ_SCALE  //还原
        let minOn = this._difen <= tempscore ? true : false
        if (minOn) {
            this.setChipMin(true)
            this.setChipMax(true)
            this.setChipAdd(true)
            this.setChipXuya(true)
            if (tempscore >= this._difen * 20) {
                this._maxscore = this._difen / 5;
            }
            else {
                this._maxscore = Math.floor(tempscore * BJ_SCALE)
            }
            this._dizhuMaxNum.string = "最大注" + this._maxscore.toString()
            this._dizhuMaxNumh.string = "最大注" + this._maxscore.toString()
        }
        else {
            if (this._chip_node.activeInHierarchy) {
                this.onclickChipComplete();
            }
            if (!this._baoxian_node.activeInHierarchy) //如果不是保险阶段就关闭 不然会造成保险按钮消失
            {
                this.node.active = false
            }

        }
        // let maxOn = this._difen*100 <  tempscore ? true : false 
        // this.setChipMax(maxOn)

    }
    /**分牌双倍按钮 金币不足客户端逻辑 */
    setCaozuobtn(score: number, chipscore: number) {
        if (score < chipscore) {
            this.fenpaiBtn.interactable = false
            this.fenpaiBtnImg.node.active = false
            this.fenpaiBtnImgh.node.active = true

            this.shuangbeiBtn.interactable = false
            this.shuangbeiImg.node.active = false
            this.shuangbeiImgh.node.active = true
        }

    }
    /**
     * 设置
     * @param value 
     */
    setactive(value: boolean): void {
        this.node.active = value;
    }

    setdizhu(value: number) {
        this._difen = value
        let tempmin = this._difen * BJ_SCALE
        let tmepnum = tempmin * 20;
        this._dizhuMinNum.string = "最小注" + tempmin.toString()
        this._dizhuMaxNum.string = "最大注" + tmepnum.toString()
        this._dizhuMinNumh.string = "最小注" + tempmin.toString()
        this._dizhuMaxNumh.string = "最大注" + tmepnum.toString()

    }
    //**  1 初始下注   2 其他区域下注 3  保险  4操作 5下注完成*/
    setChipNodeActive(value?: number, code?: number) {
        //return
        switch (value) {
            case 1: //初始下注
                this._chip_node.active = true;
                this._baoxian_node.active = false;
                this._caozuo_node.active = false;

                // this._chip_min.interactable  = true
                // this._chip_max.interactable  = true
                // this._chip_add.interactable  = true

                // this._dizhuMinNum.node.active =  true
                // this._dizhuMaxNum.node.active =  true
                // this.chip_addImg.node.active =  true
                // this._dizhuMinNumh.node.active =  false
                // this._dizhuMaxNumh.node.active =  false
                // this.chip_addImgh.node.active =  false

                this._chip_add.node.active = true;


                //this.setChipXuya(true)

                this._chip_complete.active = false;
                this._otherChip_node.active = false
                this._addchip_node.active = false;
                break
            case 2: //其他区域下注
                this._chip_node.active = true;
                this._baoxian_node.active = false;
                this._caozuo_node.active = false;
                this._otherChip_node.active = false
                this._addchip_node.active = false;

                this._chip_min.interactable = true
                this._chip_max.interactable = true
                this._chip_add.interactable = true

                this._dizhuMinNum.node.active = true
                this._dizhuMaxNum.node.active = true
                this.chip_addImg.node.active = true
                this._dizhuMinNumh.node.active = false
                this._dizhuMaxNumh.node.active = false
                this.chip_addImgh.node.active = false

                this._chip_add.node.active = true;
                this._chip_complete.active = true; //完成下注
                this._chip_xuya.active = false;

                break
            case 3: //保险
                this._chip_node.active = false;
                this._baoxian_node.active = true;
                this._caozuo_node.active = false;
                break
            case 4: //操作
                this._chip_node.active = false;
                this._baoxian_node.active = false;
                this._caozuo_node.active = true;
                this.setCaoZuoBtn(code)
                break
            case 5: //下注完成
                this._chip_node.active = true;
                this._baoxian_node.active = false;
                this._caozuo_node.active = false;
                this._otherChip_node.active = false
                this._addchip_node.active = false;

                this.setChipMin(false)
                this.setChipMax(false)
                this.setChipAdd(false)


                this._chip_add.node.active = true;
                this._chip_complete.active = true; //完成下注
                this._chip_xuya.active = false;
                break
            case 6:
                this._chip_node.active = false;
                this._baoxian_node.active = false;
                this._caozuo_node.active = false;
                this._chip_add.node.active = true;
                this._chip_complete.active = false;
                this._otherChip_node.active = false;
                this._addchip_node.active = false;
                break
            default:
                this._chip_node.active = false;
                this._baoxian_node.active = false;
                this._caozuo_node.active = false;
                break
        }

    }
    // //自己下注 和在其他区下注按钮切换 true  自己下注
    // onSelfChipState(value:boolean)
    // {
    //     if (value)
    //     {
    //         this._chip_xuya.active =true 
    //         this._chip_complete.active =false
    //     }
    //     else
    //     {
    //         this._chip_xuya.active =false 
    //         this._chip_complete.active =true
    //     }
    // }


    /**最小下注 */
    onclickAddMin() {
        this._chip_min.node.runAction(cc.sequence(cc.scaleTo(0.1, 0.95), cc.callFunc(() => {
            this._chip_min.node.setScale(1)
        })))
        AppGame.ins.bjModel.requestaddScore(this._difen)
        if (this._selfScore >= this._difen * 20) {
            this._dizhuMaxNumh.string = "最大注" + this._difen.toString()
        }
        else {
            let maxscore = Math.floor((this._selfScore - this._difen) * BJ_SCALE)
            this._dizhuMaxNumh.string = "最大注" + maxscore.toString()
        }
        UAudioManager.ins.playSound("audio_click");
    }
    /**最大下注 */
    onclickAddMax() {
        this._chip_max.node.runAction(cc.sequence(cc.scaleTo(0.1, 0.95), cc.callFunc(() => {
            this._chip_max.node.setScale(1)
        })))
        AppGame.ins.bjModel.requestaddScore(this._maxscore / BJ_SCALE)
        //按钮变色
        if (this._selfScore >= this._difen * 20) {
            this._dizhuMaxNumh.string = "最大注" + (this._difen * 0.2).toString()
        }
        else {
            let maxscore = Math.floor((this._selfScore - this._maxscore) * BJ_SCALE)
            this._dizhuMaxNumh.string = "最大注" + (maxscore).toString()
        }


        UAudioManager.ins.playSound("audio_click");
    }
    /**其他下注额 */
    onclickAddother() {
        //AppGame.ins.bjModel.requestaddScore(50)
        this._chip_add.node.active = false
        //打开滑动面板 获得滑动值
        // this._otherChip_node.active = true
        // this._chip_add.node.runAction(cc.sequence(cc.scaleTo(0.1, 0.95), cc.callFunc(() => {
        //     this._chip_add.node.setScale(1)
        // })))
        this._addchip_node.active = true;
        this._chip_add.node.runAction(cc.sequence(cc.scaleTo(0.1, 0.95), cc.callFunc(() => {
            this._chip_add.node.setScale(1)
        })))
        UAudioManager.ins.playSound("audio_click");
    }
    /**续压 */
    onclickAddxuya() {
        let currChipNum = AppGame.ins.bjModel.getCurChipNum
        currChipNum = currChipNum == 0 ? this._difen : currChipNum
        AppGame.ins.bjModel.requestaddScore(currChipNum)
        this._chip_xuya.runAction(cc.sequence(cc.scaleTo(0.1, 0.95), cc.callFunc(() => {
            this._chip_xuya.setScale(1)
        })))
        UAudioManager.ins.playSound("audio_click");
    }


    /**不买保险 */
    onclickbumaibaox() {
        this._baoxian_node.active = false
        AppGame.ins.bjModel.onclickbumaibaox()
        this._bumai.runAction(cc.sequence(cc.scaleTo(0.1, 0.95), cc.callFunc(() => {
            this._bumai.setScale(1)
        })))
        UAudioManager.ins.playSound("audio_click");
    }

    /**买保险 */
    onclickmaibaox() {
        this._baoxian_node.active = false
        AppGame.ins.bjModel.onclickmaibaox()
        this._maibaoxian.runAction(cc.sequence(cc.scaleTo(0.1, 0.95), cc.callFunc(() => {
            this._maibaoxian.setScale(1)
        })))
        UAudioManager.ins.playSound("audio_click");
    }
    /**分牌 */
    onclickfenpai() {
        AppGame.ins.bjModel.onclickfenpai()
        this.fenpaiBtn.node.runAction(cc.sequence(cc.scaleTo(0.1, 0.95), cc.callFunc(() => {
            this.fenpaiBtn.node.setScale(1)
        })))
        UAudioManager.ins.playSound("audio_click");
    }
    /**停牌 */
    onclicktingpai() {
        AppGame.ins.bjModel.onclicktingpai()
        this.tingpaiBtn.node.runAction(cc.sequence(cc.scaleTo(0.1, 0.95), cc.callFunc(() => {
            this.tingpaiBtn.node.setScale(1)
        })))
        UAudioManager.ins.playSound("audio_click");
    }
    /**双倍 */
    onclickshuanbei() {
        AppGame.ins.bjModel.onclickshuanbei()
        this.shuangbeiBtn.node.runAction(cc.sequence(cc.scaleTo(0.1, 0.95), cc.callFunc(() => {
            this.shuangbeiBtn.node.setScale(1)
        })))
        UAudioManager.ins.playSound("audio_click");
    }
    /**要牌 */
    onclickyaopai() {
        UAudioManager.ins.playSound("audio_click");
        this.yaopaiBtn.scheduleOnce(() => {
            AppGame.ins.bjModel.onclickyaopai()
            this.yaopaiBtn.unscheduleAllCallbacks()
        }, 0.5)
        this.yaopaiBtn.node.stopAllActions()
        this.yaopaiBtn.node.runAction(cc.sequence(cc.scaleTo(0.1, 0.95), cc.callFunc(() => {
            this.yaopaiBtn.node.setScale(1)
        })))

    }

    onclickChipComplete() {
        AppGame.ins.bjModel.onChipComplete()
        this.node.active = false
        //关闭其他区下注提示
        AppGame.ins.bjModel.emit(MBJ.CC_TS_SHOW_OTHER_AREA, false)
        AppGame.ins.bjModel.emit(MBJ.CC_TS_SET_ONECD, 0, false)
        UAudioManager.ins.playSound("audio_click");
    }
    /**可分牌8<<可双倍4<<可要牌2<<可停牌1*/
    setCaoZuoBtn(num: number): void {
        this._baoxian_node.active = false;
        if (num != null) {
            if (8 == (num & 8)) {
                this.fenpaiBtn.interactable = true
                this.fenpaiBtnImg.node.active = true
                this.fenpaiBtnImgh.node.active = false
            }
            else {
                this.fenpaiBtn.interactable = false
                this.fenpaiBtnImg.node.active = false
                this.fenpaiBtnImgh.node.active = true
            }
            if (4 == (num & 4)) {
                this.shuangbeiBtn.interactable = true
                this.shuangbeiImg.node.active = true
                this.shuangbeiImgh.node.active = false
            }
            else {
                this.shuangbeiBtn.interactable = false
                this.shuangbeiImg.node.active = false
                this.shuangbeiImgh.node.active = true
            }
            if (2 == (num & 2)) {
                this.yaopaiBtn.interactable = true
            }
            else {
                this.yaopaiBtn.interactable = false
            }
            if (1 == (num & 1)) {
                this.tingpaiBtn.interactable = true
            }
            else {
                this.tingpaiBtn.interactable = false
            }
        }
        else {
            this._caozuo_node.active = false;
        }
    }



}
