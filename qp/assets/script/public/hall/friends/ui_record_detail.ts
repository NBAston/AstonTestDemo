
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import MRoomModel from "../room_zjh/MRoomModel";
import VWindow from "../../../common/base/VWindow";
import UDebug from "../../../common/utility/UDebug";
import VRecordDetailItem from "./ui_record_detail_item";
const { ccclass } = cc._decorator;

@ccclass
export default class VRecordDetail extends VWindow {

    private _prefab: cc.Node;
    private _parent: cc.Node;
    //当前页数
    private pageIndex: number ;
    //每页显示的个数
    private pageItemCount: number = 10;
    private _scrollview: cc.ScrollView;
    //收到的网络数据
    private data:any 


    init(): void {
        super.init(); 
        this._prefab = UNodeHelper.find(this._root, "scrollView/item");
        this._parent = UNodeHelper.find(this._root, "scrollView/view/content");
        this._scrollview  = UNodeHelper.getComponent(this._root, "scrollView",cc.ScrollView);
        this._scrollview.node.on('scroll-to-bottom', this.OnScrollCallBack, this);
    }
 
    onEnable(){
        AppGame.ins.roomModel.on(MRoomModel.UPDATA_FRIEND_RECORDS_DETAIL, this.updateRecordDetailList, this);
    }

    onDisable(){
        AppGame.ins.roomModel.on(MRoomModel.UPDATA_FRIEND_RECORDS_DETAIL, this.updateRecordDetailList, this);
    }

    show(data:any){
        super.show(data)
        this.pageIndex = 1
        this._parent.removeAllChildren()
        this._scrollview.scrollToTop()
        AppGame.ins.roomModel.requestFriendRcordDetail(data)
    }

    //获得一个约牌记录实例
    private getInstance(): VRecordDetailItem {
        let ins = cc.instantiate(this._prefab);
        let item = ins.getComponent(VRecordDetailItem);
        if (!item) {
            item = ins.addComponent(VRecordDetailItem);
        }
        ins.setParent(this._parent);
        item.init();
        return item;
    }

    //刷新约牌记录列表
    private updateRecordDetailList(data:any): void{
        if (!data || data.length == 0) return
        UDebug.Log("收到数据" + JSON.stringify(data))
        this.data = data
        this.showData()
    }

    //显示数据
    private showData(){
        var startIndex = (this.pageIndex - 1) * this.pageItemCount
        for (var i = startIndex; i < startIndex + this.pageItemCount; i++){
            if (this.data[i]){
                var item = this.getInstance();
                item.bind(this.data[i]);
            }
        }
    }

    //滚动后最后时
    OnScrollCallBack(){
        var totalPage = Math.ceil(this.data.length / this.pageItemCount)
        if (this.pageIndex < totalPage){
            UDebug.log("加载下一页记录")
            this.pageIndex++
            this.showData()
        }
        else{
            AppGame.ins.showTips("没有更多记录了");
        }
    }
}
