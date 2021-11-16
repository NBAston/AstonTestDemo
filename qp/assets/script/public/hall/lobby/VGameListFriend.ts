import { ECommonUI, EGameType,EGameUpdateStatus, ERoomKind } from "../../../common/base/UAllenum";
import { UpdaterEvent } from "../../hot/UHotData";
import AppGame from "../../base/AppGame";
import UGameHotUpdate from "../../hot/UGameHotUpdate";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UDebug from "../../../common/utility/UDebug";
import UResManager from "../../../common/base/UResManager";
import MHall from "./MHall";


/*
 * 作用:好友房游戏列表入口
 */
export default class VGameListFriend {
    private _hots: Array<UGameHotUpdate>;
    //游戏列表
    private gameList:any;
    //等待下载的列表
    private waitDownList: Array<number> = []
    //更新提示按钮
    private updateIcon:cc.Node
    //进度条
    private progressBar:cc.Node
    //进度条
    private progress:cc.Label
    //更新状态 
    private status:EGameUpdateStatus = null;
    //需要更新的总数
    private updateTotalCount:number = 0 
    //更新完成的个数
    private finishCount:number = 0 
    //当前更新失败的游戏ID
    private _failGameId: number = 0;

    constructor(rootNode:cc.Node) {
        this.init(rootNode);
    }

     private init(rootNode:cc.Node): void {
        this._hots = [];
        this.gameList = AppGame.ins.roomModel._friendRoomInfo
        this.updateIcon = UNodeHelper.find(rootNode,"checkupdate");
        this.progressBar = UNodeHelper.find(rootNode,"progressBar");
        this.progress = UNodeHelper.getComponent(rootNode,"progressBar/process",cc.Label);
        //加载直角进度条图片
        var url = "common/hall/texture/updateprocess"
        UResManager.loadUrl(url, this.progressBar.getComponent(cc.ProgressBar).barSprite)
        this.intGameList()
    }

    /**
     * 初始化游戏入口
     * @param datas 
     */
    intGameList(): void {
        if (cc.sys.isNative) {
            var path = jsb.fileUtils.getSearchPaths();
            var write_path = jsb.fileUtils.getWritablePath();
            var hotPath = write_path + "/game-remote-asset/"
            if (!jsb.fileUtils.isDirectoryExist(hotPath)){
                jsb.fileUtils.createDirectory(hotPath);
            }
            path.unshift(hotPath);
            jsb.fileUtils.setSearchPaths(path);
            this.regester()
        }
        
        for (var k in this.gameList) {
            if (cc.sys.isNative) {
                let hot = new UGameHotUpdate(this.gameList[k][0].gameId,ERoomKind.Friend);
                hot.on(UpdaterEvent.SUB_UPDATE_FAILED, this.sub_update_failed, this);
                hot.on(UpdaterEvent.SUB_ALREADY_UP_TO_DATE , this.sub_already_up_to_date, this);
                hot.on(UpdaterEvent.SUB_NEW_VERSION_FOUND , this.sub_new_version_found, this);
                hot.on(UpdaterEvent.SUB_UPDATE_PROGRESSION, this.sub_update_progression, this);
                this._hots.push(hot);
                hot.checkUpdate();
            }else{
                this.setUpdateStatus(EGameUpdateStatus.Updated);
            }
        }
        
    }

    /**
     * 重置游戏入口
     */
    resetGameList(): void {
        this.unregester();
    }

    regester(){
        AppGame.ins.hallModel.on(MHall.HALL_RECONNECT, this.onHallReconnect, this);
    }

    unregester(){
        AppGame.ins.hallModel.off(MHall.HALL_RECONNECT, this.onHallReconnect, this);
    }

    private onHallReconnect() {
        UDebug.log('onHallReconnect 重连 更新失败子游戏id => ', this._failGameId)
        if (this.waitDownList.length > 0) {
            this._hots.forEach(hot => {
                if (this._failGameId == hot.gameId) {
                    this._failGameId = 0;
                    let index = this._hots.indexOf(hot);
                    this._hots.splice(index, 1);

                    hot.off(UpdaterEvent.SUB_UPDATE_FAILED, this.sub_update_failed, this);
                    hot.off(UpdaterEvent.SUB_ALREADY_UP_TO_DATE , this.sub_already_up_to_date, this);
                    hot.off(UpdaterEvent.SUB_NEW_VERSION_FOUND , this.sub_new_version_found, this);
                    hot.off(UpdaterEvent.SUB_UPDATE_PROGRESSION, this.sub_update_progression, this);

                    let hotNew = new UGameHotUpdate(hot.gameId,ERoomKind.Friend);
                    hotNew.on(UpdaterEvent.SUB_UPDATE_FAILED, this.sub_update_failed, this);
                    hotNew.on(UpdaterEvent.SUB_ALREADY_UP_TO_DATE , this.sub_already_up_to_date, this);
                    hotNew.on(UpdaterEvent.SUB_NEW_VERSION_FOUND , this.sub_new_version_found, this);
                    hotNew.on(UpdaterEvent.SUB_UPDATE_PROGRESSION, this.sub_update_progression, this);
                    this._hots.push(hotNew);
                    hotNew.checkUpdate(true);
                }
            });
        }
    }


    //发现新版本
    sub_new_version_found(gameId: EGameType) {
        this.waitDownList.push(gameId)
        this.setUpdateStatus(EGameUpdateStatus.Update);
    }

    //游戏的更新进度
    private sub_update_progression(gameId: number, value: number): void {
       var step = 1 / this.updateTotalCount
       var prrcessValue = this.finishCount * step +  step * value
       this.progressBar.getComponent(cc.ProgressBar).progress = prrcessValue
       this.progress.string =  Math.ceil(prrcessValue * 100).toString() + "%"
       
       var bLoad = false
       //超过95%,直角换成圆角
       if (prrcessValue * 100 > 95 && !bLoad){
           var url = "common/hall/texture/updatefinish"
           UResManager.loadUrl(url, this.progressBar.getComponent(cc.ProgressBar).barSprite)
           bLoad = true
       }
    }

    //已经是最新版本
    sub_already_up_to_date(gameId: number) {
        //删除当前已经更新完成的
        if (this.waitDownList.length > 0){
            this.finishCount++
            this.waitDownList.splice(0,1)
        }
        //更新下一个
        if (this.waitDownList.length > 0){
            this.gameDownload(this.waitDownList[0])
        }
        //全部更新完成
        else if (this.waitDownList.length == 0){
            this.progressBar.getComponent(cc.ProgressBar).progress = 1
            this.progress.string = "100%"
            this.setUpdateStatus(EGameUpdateStatus.Updated);
            this._failGameId = 0;
        }
    }

    //点击游戏 
    gameEnterClick(): void {
        UDebug.log('点击好友房 status => ', this.status)
        //好友房列表为空时
        if (this.gameList.length == 0){
            AppGame.ins.showTips("没有可用的好友房游戏")
            return
        }
        //原生更新完成或者是h5
        if (this.status == EGameUpdateStatus.Updated || cc.sys.isBrowser){
            AppGame.ins.showUI(ECommonUI.UI_ENTER_ROOM);
            return
        }
        //需要更新
        if (this.status == EGameUpdateStatus.Update){
            this.updateTotalCount = this.waitDownList.length
            var gameId = this.waitDownList[0]
            this.gameDownload(gameId)
            this.setUpdateStatus(EGameUpdateStatus.Updating);   
            this.progressBar.getComponent(cc.ProgressBar).progress = 0
            this.progress.string = "0%"
            this.finishCount = 0
        }
    }
    
    //下载游戏
    gameDownload(gameId: number): void {
        let hot :UGameHotUpdate = null; 
        this._hots.forEach(element => {
            if (element.gameId == gameId){
                hot = element;
            }   
        });
        hot.hotUpdate();
    }

    /**获取更新状态 */
    getUpdateStatus(): EGameUpdateStatus {
        return this.status;
    }

    //更新状态
    setUpdateStatus(updateStatus: EGameUpdateStatus): void {
        this.status = updateStatus
        switch (updateStatus) {
            case EGameUpdateStatus.Update:
                {
                    this.updateIcon.active = true
                    this.progressBar.active = false
                    this.progress.node.active = false
                }
                break;
            case EGameUpdateStatus.Updated:
                {
                    this.updateIcon.active = false
                    this.progressBar.active = false
                    this.progress.node.active = false
                }
                break;
            case EGameUpdateStatus.Updating:
                {
                    this.updateIcon.active = false
                    this.progressBar.active = true
                    this.progress.node.active = true
                }
                break;
        }
    }

    //更新失败
    sub_update_failed(gameId: number) {
        UDebug.log('好友房 更新失败 => ', gameId);
        this._failGameId = gameId;
    }
}
