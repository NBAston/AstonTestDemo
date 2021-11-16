import { EGameState, EGameUpdateStatus } from "../../../../common/base/UAllenum";
import UAudioManager from "../../../../common/base/UAudioManager";
import UResManager from "../../../../common/base/UResManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VClubGameItem extends cc.Component {

    @property(cc.Sprite) gameIconOn: cc.Sprite = null;
    @property(cc.Sprite) gameIconOff: cc.Sprite = null;

    @property(cc.Node) updateTag: cc.Node = null;
    @property(cc.Node) maintenance: cc.Node = null;

    @property(cc.Node) progressBg: cc.Node = null;
    @property(cc.Sprite) progressJd: cc.Sprite = null;
    @property(cc.Label) progressLbl: cc.Label = null;

    @property(cc.Node) hotTagOn: cc.Node = null;
    @property(cc.Node) hotTagOff: cc.Node = null;
    @property(cc.Node) newTagOn: cc.Node = null;
    @property(cc.Node) newTagOff: cc.Node = null;

    @property(sp.Skeleton) iconSp: sp.Skeleton = null;
    @property(cc.Node) border: cc.Node = null;
    
    private _callback: any = null;
    private _gameInfo: any = null;

    init(data: any) {
        this._callback = data.callback;
        this._gameInfo = data.gameInfo;
        this.getComponent(cc.Toggle).isChecked = false;
        //选中、未选中
        // let urlOn = 'common/hall/texture/club/hall/gameIcon/club_icon_on_' + data.gameInfo.abbreviateName;
        // let urlOff = 'common/hall/texture/club/hall/gameIcon/club_icon_off_' + data.gameInfo.abbreviateName;
        // UResManager.loadUrl(urlOn, this.gameIconOn);
        // UResManager.loadUrl(urlOff, this.gameIconOff);

        let path = "common/hall/ani/club/gameIconSpine/" + data.gameInfo.abbreviateName + "/" + data.gameInfo.clubGameSpine;
        cc.resources.load(path, sp.SkeletonData, (err, res: sp.SkeletonData) => {
            if (!err) {
                this.iconSp.skeletonData = res;
                let str = data.index == 0 ? '_01' : '_02';
                this.border.opacity = data.index == 0 ? 255 : 0;
                this.iconSp.setAnimation(0, data.gameInfo.clubGameSpine + str, true);
            }
        })

        //维护中
        if (data.gameInfo.gameState == EGameState.WeiHu) {
            this.maintenance.active = true;
            this.getComponent(cc.Toggle).interactable = false;
        } else {
            this.maintenance.active = false;
            this.getComponent(cc.Toggle).interactable = true;
        }
    }

    /**设置是否被选中 */
    setIsChecked(isChecked: boolean) {    
        this.getComponent(cc.Toggle).isChecked = isChecked;
        this.setAnimation(isChecked);
        this.setHotNewTagShow(isChecked);
    }

    /**设置spine动画 */
    setAnimation(isChecked: boolean) {
        let str = isChecked ? '_01' : '_02';
        this.border.opacity = isChecked ? 255 : 0;
        this.iconSp.setAnimation(0, this._gameInfo.clubGameSpine + str, true);
    }

    /**设置最新最热标签 */
    setHotNewTagShow(isChecked: boolean) {
        if (this._gameInfo.gameState == EGameState.Hot) {
            this.hotTagOn.opacity = isChecked ? 255 : 0;
            this.hotTagOff.opacity = isChecked ? 0 : 255;
        } else if (this._gameInfo.gameState == EGameState.New) {
            this.newTagOn.opacity = isChecked ? 255 : 0;
            this.newTagOff.opacity = isChecked ? 0 : 255;
        }
    }

    /**
    * 更新标记绑定
    * @param updateStatus 0需要更新,1更新中,2已经是最新版本 
    */
    setUpdateStatus(updateStatus: EGameUpdateStatus): void {
        switch (updateStatus) {
            case EGameUpdateStatus.Update:
                {
                    this.showDownLoadSign(true);
                    this.showProccess(false);
                }
                break;
            case EGameUpdateStatus.Updated:
                {
                    this.showDownLoadSign(false);
                    this.showProccess(false);
                }
                break;
            case EGameUpdateStatus.Updating:
                {
                    this.showDownLoadSign(false);
                    this.showProccess(true);
                }
                break;
        }
    }

    /**显示进度 */
    protected showProccess(isShow: boolean) {
        this.progressBg.active = isShow;
        this.progressJd.node.active = isShow;
        this.progressLbl.node.active = isShow;
    }

    /**显示更新标记 */
    protected showDownLoadSign(isShow: boolean) {
        if (isShow) {
            if (this._gameInfo.gameState == EGameState.WeiHu) return;
            this.updateTag.opacity = 255;
            this.showProccess(false);
        } else {
            this.updateTag.opacity = 0;
        }
    }

    /**设置进度 */
    setProccess(percent: number) {
        if (percent) {
            let count = percent || 0;
            this.progressJd.fillRange = -count || 0;
            this.progressLbl.string = Math.round((count || 0) * 100).toFixed() + "%";
        }
    }

    /**点击 */
    onClickItem() {        
        UAudioManager.ins.playSound("audio_click");
        if (this._callback) {
            this._callback(this._gameInfo);
        }
    }

    /**获取游戏id */
    getGameId() {
        return this._gameInfo.gameType;
    }
}
