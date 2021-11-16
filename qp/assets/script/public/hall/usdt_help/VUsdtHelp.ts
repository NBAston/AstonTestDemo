import VWindow from "../../../common/base/VWindow";
import UDebug from "../../../common/utility/UDebug";
import UEventHandler from "../../../common/utility/UEventHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VUsdtHelp extends VWindow {

    private _imgItem: cc.Node = null;
    private _left_item: cc.Node[] = [];
    private _top_item: cc.Node[] = [];
    private _left_item_content: cc.Node = null;
    private _help_scroll_content: cc.Node = null;
    private _btnroot_top: cc.Node = null;
    private _left_scrollView: cc.ScrollView = null;
    private _right_scrollView: cc.ScrollView = null;
    private _help_content: cc.Node = null;
    _index: number = 0;
    _top_index: number = 0;
    private _back:cc.Node;
   
    init(): void {
        super.init();
        this._left_item = [];
        this._top_item = [];
        this._left_item_content = UNodeHelper.find(this.node, "root/mask_bg/btn_left/scrollView/view/content");
        this._left_scrollView = UNodeHelper.getComponent(this.node, "root/mask_bg/btn_left/scrollView", cc.ScrollView);
        this._right_scrollView = UNodeHelper.getComponent(this.node, "root/mask_bg/help_content/scrollView", cc.ScrollView);
        this._help_content = UNodeHelper.find(this.node, "root/mask_bg/help_content");
        this._help_scroll_content = UNodeHelper.find(this.node, "root/mask_bg/help_content/scrollView/view/content");
        this._btnroot_top = UNodeHelper.find(this.node, "root/mask_bg/btnroot_top/top_bg");
        this._imgItem = UNodeHelper.find(this.node, "root/img_item");
        this._back = UNodeHelper.find(this.node,"back");
        UEventHandler.addClick(this._back,this.node,"VUsdtHelp","closeUI");

        for (let index = 0; index < this._left_item_content.childrenCount; index++) {
            const element = UNodeHelper.find(this._left_item_content, "usdt_help_"+index);
            UEventHandler.addClick(element, this.node, "VUsdtHelp", "onClickLeftMenuBtn", index);
            this._left_item.push(element);
        }

        for(let index = 0; index < this._btnroot_top.childrenCount; index++) {
            const element = UNodeHelper.find(this._btnroot_top, "btn_"+index);
            UEventHandler.addClick(element, this.node, "VUsdtHelp", "onClickTopBtn", index);
            this._top_item.push(element);
        }
    }

    // 左边按钮点击事件
    onClickLeftMenuBtn(event: any, index: number): void {
        super.playclick();
        this._top_index = 2;
        if(index == this._index) return;
        this._index = index;
        this.autoScorrlToClick(index);
        this.setBtnSelectedInfo(index);
        if([0, 1, 2, 5, 8, 9].indexOf(index) != -1) {
            this._btnroot_top.active = false;
            this._help_content.getComponent(cc.Widget).top = 110;
            this._help_scroll_content.setPosition(cc.v2(0, 283));
            this.refreshContentUI("usdt_help_"+index);
        } else {
            this._btnroot_top.active = true;
            this._help_content.getComponent(cc.Widget).top = 185;
            this._help_scroll_content.setPosition(cc.v2(0, 245));
            this.onClickTopBtn(null, 0);
        }
    }
    
    /**顶部按钮点击 */
    onClickTopBtn(event: any, topIndex: number): void {
        super.playclick();
        if(topIndex == this._top_index) return;
        this.setTopBtnSelectedInfo(topIndex);
        this.refreshContentUI("usdt_help_"+this._index+"_"+topIndex);   
    }
    /**设置顶部按钮颜色 */
    private setTopBtnSelectedInfo(index: number): void {
        for (let i = 0; i < this._top_item.length; i++) {
            let element = this._top_item[i];
            if(index == i) {
                UNodeHelper.find(element, "checkmark").active = true;
                var color2 = new cc.Color(255, 255, 255);
                UNodeHelper.find(element,"title").color = color2;
            } else {
                UNodeHelper.find(element, "checkmark").active = false;
                var color2 = new cc.Color(164, 116, 51);
                UNodeHelper.find(element,"title").color = color2;
            }
        }
    }

     /**设置按钮选中信息 */
     private setBtnSelectedInfo(index: number): void {
        for (let i = 0; i < this._left_item.length; i++) {
            let element = this._left_item[i];
            if(index == i) {
                UNodeHelper.find(element, "checkmark").active = true;
                var color2 = new cc.Color(255, 255, 255);
                UNodeHelper.find(element,"title").color = color2;
            } else {
                UNodeHelper.find(element, "checkmark").active = false;
                var color2 = new cc.Color(164, 116, 51);
                UNodeHelper.find(element,"title").color = color2;
            }
        }
    }

     // 自动滚动位置，左边列表菜单
     autoScorrlToClick(_index){
        let maxoffset = this._left_scrollView.getMaxScrollOffset()
        this._left_scrollView.stopAutoScroll()
        if(_index < 4){
            this._left_scrollView.scrollToTop(0.5)
        }else{
            if((_index - 3) *150 < maxoffset.y){
                this._left_scrollView.scrollToOffset(cc.v2(maxoffset.x, (_index - 3) *150),0.5)
            }else{
                this._left_scrollView.scrollToBottom(0.5)
            }            
        } 
    }

    /**刷新内容 */
    refreshContentUI(imgName: string): void {
        this._help_scroll_content.destroyAllChildren();
        let item = cc.instantiate(this._imgItem);
        let url = "common/texture/usdthelp/"+imgName;
        let self = this;
        cc.loader.loadRes(url, cc.SpriteFrame, (error, res) => {
            if (error == null) {
                item.active = true;
                if (item && item.isValid) {
                    item.getComponent(cc.Sprite).spriteFrame = res;
                }
            } else {
                UDebug.Log(error);
            }
            item.setParent(this._help_scroll_content);
            this.scheduleOnce(function(){
                self._right_scrollView.scrollToTop(0.5);
            }, 0.1)

            if(imgName == "usdt_help_6_0"||imgName == "usdt_help_4_0"||imgName == "usdt_help_4_1"||imgName == "usdt_help_6_1") {
                let item2 = cc.instantiate(this._imgItem);
                let url1 = "common/texture/usdthelp/"+imgName+"_1";
                cc.loader.loadRes(url1, cc.SpriteFrame, (error, res) => {
                    if (error == null) {
                        item2.active = true;
                        if (item2 && item2.isValid) {
                            item2.getComponent(cc.Sprite).spriteFrame = res;
                        }
                    } else {
                        UDebug.Log(error);
                    }
                    item2.setParent(this._help_scroll_content);
                    this.scheduleOnce(function(){
                        self._right_scrollView.scrollToTop(0.5);
                    }, 0.1)
                });
                
            }
        });
        
        
    }

    closeUI(){
        super.playclick();
        super.clickClose();
    }

    
    show(data: any): void {
        super.show(data);
        this.onClickLeftMenuBtn(null, data);
    }   

    protected onEnable(): void {
    
    }
    protected onDisable(): void {
        this._index = -1;
        this._top_index = 0;    
    }
}
