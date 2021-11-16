import { EIconType } from "../../../../common/base/UAllenum";
import UAudioManager from "../../../../common/base/UAudioManager";
import UResManager from "../../../../common/base/UResManager";
import UDebug from "../../../../common/utility/UDebug";
import AppGame from "../../../base/AppGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VClubTableItem extends cc.Component {
    @property(cc.SpriteFrame) defaultHead: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) defaultHeadFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) defaultHeadZhuangFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) bigTableSprites: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame) smallTableSprites: cc.SpriteFrame[] = [];

    //小桌子
    @property(cc.Node) tableSmall: cc.Node = null;
    @property(cc.Sprite) tableSmallBg: cc.Sprite = null;
    @property(cc.Node) quickStartSmall: cc.Node = null;
    @property(cc.Node) tableInfoSmall: cc.Node = null;
    @property([cc.Node]) heads: cc.Node[] = [];
    @property(cc.Sprite) gameName: cc.Sprite = null;
    @property(cc.Label) roundInfo: cc.Label = null;
    @property(cc.Label) smallGameNameLbl: cc.Label = null;

    //大桌子
    @property(cc.Node) tableBig: cc.Node = null;
    @property(cc.Sprite) tableBigBg: cc.Sprite = null;
    @property(cc.Node) playerHeadsBig: cc.Node = null;
    @property(cc.Node) zhuangHeadsBig: cc.Node = null;
    @property(cc.Sprite) gameNameBig: cc.Sprite = null;
    @property(cc.Label) zhuangInfoBig: cc.Label = null;
    @property(cc.Label) playerNumBig: cc.Label = null;

    private _maxHeadNum: number = 6;
    private _maxHeadNumBig: number = 22;

    private _tableId: number = 0;
    private _roomId: number = 0;
    private _callback: any = null;
    private _tableType: any = null; //百人场2 其他1
    private _gameInfo: any = null;
    private _tableInfo: any = null;
    private _isQuick: boolean = false; //是否快速开始

    init(data: any) {
        this._callback = data.callback;
        this._tableType = data.tableType;
        this._isQuick = data.isQuick;
        this._gameInfo = data.gameInfo;
        this._tableInfo = data.tableInfo;
        this._tableId = data.tableId;
        this._roomId = data.roomInfo.roomId;
        let playerNum = (this._tableInfo && this._tableInfo.userInfo.length) || 0; //当前人数
        let gameRoomInfo = AppGame.ins.roomModel.getRoomData(data.roomInfo.gameId, data.roomInfo.roomId);
        let maxPlayerNum = gameRoomInfo.maxPlayerNum;
        this.roundInfo.string = playerNum + '/' + maxPlayerNum;
        if (playerNum == maxPlayerNum) {
            this.roundInfo.string = '已满';
        }
        if (this._tableType == 1) { //小桌子
            this.node.width = this.tableSmall.width;
            this.node.height = this.tableSmall.height;
            this.tableSmallBg.spriteFrame = this.smallTableSprites[data.roomIndex];
            this.smallGameNameLbl.string = data.roomName;
            this.tableSmall.active = true;
            this.tableBig.active = false;
            this.quickStartSmall.active = data.index == 0 ? true : false;
            this.tableInfoSmall.active = data.index == 0 ? false : true;
            if (data.index == 0) return;

            // let url = 'common/hall/texture/club/hall/gameName/gameName_small_' + data.gameInfo.abbreviateName;
            // UResManager.loadUrl(url, this.gameName);

            //玩家头像
            this.heads.forEach(headNode => {
                headNode.active = false;
                headNode.parent.active = false;
            });
            let headNum = playerNum > this._maxHeadNum ? this._maxHeadNum : playerNum;
            for (let i = 0; i < maxPlayerNum; i++) {
                this.heads[i].parent.active = true;
            }
            for (let i = 0; i < headNum; i++) {
                let head = this.heads[i].getChildByName('head').getComponent(cc.Sprite);
                let headId = this._tableInfo.userInfo[i].headerId;
                let headImgUrl = this._tableInfo.userInfo[i].headImgUrl;
                UResManager.load(headId, EIconType.Head, head, headImgUrl);

                let headFrame = this.heads[i].getChildByName('touxiangk').getComponent(cc.Sprite);
                let headboxId = this._tableInfo.userInfo[i].headboxId;
                UResManager.load(headboxId, EIconType.Frame, headFrame);
                this.heads[i].active = true;
            }
        } else if (this._tableType == 2) { //大桌子
            this.node.width = this.tableBig.width;
            this.node.height = this.tableBig.height;
            let idx = this._tableId < 3 ? this._tableId : 0;
            this.tableBigBg.spriteFrame = this.bigTableSprites[idx];
            this.tableSmall.active = false;
            this.tableBig.active = true;

            if (this._tableInfo) {
                if (this._tableInfo.applyBankerScore) {
                    this.zhuangInfoBig.string = '上庄需要:' + (this._tableInfo.applyBankerScore / 100);
                    AppGame.ins.clubHallModel.applyBankerScoreTemp = this._tableInfo.applyBankerScore;
                }
                this.playerNumBig.string = this._tableInfo.onlinePlayCount || playerNum;
            } else {
                this.zhuangInfoBig.string = '上庄需要:' + (AppGame.ins.clubHallModel.applyBankerScoreTemp / 100);
                this.playerNumBig.string = '0';
            }

            let urlBig = 'common/hall/texture/club/hall/gameName/gameName_big_' + data.gameInfo.abbreviateName;
            UResManager.loadUrl(urlBig, this.gameNameBig);

            //玩家头像
            this.playerHeadsBig.children.forEach(node => {
                node.active = false;
            });

            let headNum = playerNum > this._maxHeadNumBig ? this._maxHeadNumBig : playerNum;
            for (let i = 0; i < headNum; i++) {
                let node = this.playerHeadsBig.children[i];
                let head = node.getChildByName('head').getComponent(cc.Sprite);
                let headId = this._tableInfo.userInfo[i].headerId;
                let headImgUrl = this._tableInfo.userInfo[i].headImgUrl;
                UResManager.load(headId, EIconType.Head, head, headImgUrl);

                let headFrame = node.getChildByName('touxiangk').getComponent(cc.Sprite);
                let headboxId = this._tableInfo.userInfo[i].headboxId;
                UResManager.load(headboxId, EIconType.Frame, headFrame);

                node.active = true;
            }

            //庄头像
            this.zhuangHeadsBig.children.forEach(node => {
                node.active = false;
            });
            if (this._tableInfo && this._tableInfo.curBankerUserId && this._tableInfo.curBankerUserId != -1) {
                let head = this.zhuangHeadsBig.children[1].getChildByName('head').getComponent(cc.Sprite);
                let headFrame = this.zhuangHeadsBig.children[1].getChildByName('touxiangk').getComponent(cc.Sprite);
                this._tableInfo.userInfo.forEach(element => {
                    if (element.userId == this._tableInfo.curBankerUserId) {
                        UResManager.load(element.headerId, EIconType.Head, head, element.headImgUrl);
                        UResManager.load(element.headboxId, EIconType.Frame, headFrame);
                    }
                });
                this.zhuangHeadsBig.children[1].active = true;
            } else {
                //系统庄家头像
                let head = this.zhuangHeadsBig.children[0].getChildByName('head').getComponent(cc.Sprite);
                UResManager.load(1, EIconType.Head, head);
                this.zhuangHeadsBig.children[0].active = true;
            }
        }
    }

    /**重置 */
    reset(tableType: number) {
        if (tableType == 1) {
            this.smallGameNameLbl.string = '';
            this.roundInfo.string = '';

            this.heads.forEach(node => {
                node.getChildByName('head').getComponent(cc.Sprite).spriteFrame = this.defaultHead;
                node.getChildByName('touxiangk').getComponent(cc.Sprite).spriteFrame = this.defaultHeadFrame;
            });
        } else if (tableType == 2) {
            this.gameNameBig.spriteFrame = null;
            this.zhuangInfoBig.string = '';
            this.playerNumBig.string = '';

            this.zhuangHeadsBig.children.forEach(node => {
                node.getChildByName('head').getComponent(cc.Sprite).spriteFrame = this.defaultHead;
                node.getChildByName('touxiangk').getComponent(cc.Sprite).spriteFrame = this.defaultHeadZhuangFrame;
            });

            this.playerHeadsBig.children.forEach(node => {
                node.getChildByName('head').getComponent(cc.Sprite).spriteFrame = this.defaultHead;
                node.getChildByName('touxiangk').getComponent(cc.Sprite).spriteFrame = this.defaultHeadFrame;
            });
        }
    }

    onClickItem() {
        UAudioManager.ins.playSound("audio_click");
        if (this._callback) {
            this._callback(this._tableInfo, this._tableId, this._isQuick, this._roomId);
        }
    }

}
