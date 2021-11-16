import UAudioManager from "../../../../common/base/UAudioManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VClubItem extends cc.Component {

    @property(cc.Label) clubNameLbl: cc.Label = null;
    @property(cc.Node) line: cc.Node = null;

    private _clubId: number = 0;
    private _callback: any = null;

    init(data: any, hideLine: boolean = false) {
        this._clubId = data.clubInfo.clubId;
        this._callback = data.callback;
        this.clubNameLbl.string = data.clubInfo.clubName;
        this.line.opacity = hideLine ? 0 : 255;
        this.clubNameLbl.node.color = new cc.Color().fromHEX('#b08c68');
        if (data.index == 0) {
            this.clubNameLbl.node.color = new cc.Color().fromHEX('#803606');
        }
    }

    onClickItem() {
        UAudioManager.ins.playSound("audio_click");
        if (this._callback) {
            this._callback(this._clubId);
        }
    }

}
