import UHandler from "../../../../common/utility/UHandler";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import UEventHandler from "../../../../common/utility/UEventHandler";
import VWindow from "../../../../common/base/VWindow";
import { EGameType, ERoomKind } from "../../../../common/base/UAllenum";
import { cfg_game_help } from "../../../../config/cfg_game_help";
import cfg_game from "../../../../config/cfg_game";
import UDebug from "../../../../common/utility/UDebug";
import cfg_friends from "../../../../config/cfg_friends";
import AppGame from "../../../base/AppGame";

const { ccclass, property } = cc._decorator;
/**
 * 作用:zjh的房间UI
 */
@ccclass
export default class VUHelp_ZJH extends VWindow {

    private _init: boolean;
    private _gameType: string;
    private _btn_left: cc.Node;
    private _btn_rule_intro: cc.Node;
    private _btn_paixing_info: cc.Node;
    private _btn_paixing_size: cc.Node;
    private _btn_rule_multiple: cc.Node;
    private _btn_settlement: cc.Node;
    private _game_btns: Array<cc.Toggle>;
    private _rule_type_btns: Array<cc.Toggle>
    private _game_level: EGameType;
    private _left_btn_scrollview: cc.ScrollView;
    private _back: cc.Node;
    private _isShowFriend: boolean = false;

    private _paixingLbl_normal: cc.Label;    //牌型倍数下的label
    private _paixingLbl_selected: cc.Label;   //牌型倍数下的label


    init(): void {
        if (this._init) return;
        super.init();
        this._init = true;
        this._rule_type_btns = [];
        this._game_btns = [];
        this._btn_left = UNodeHelper.find(this.node, "root/mask_bg/btn_left");
        let btnroot_top = UNodeHelper.find(this.node, "root/mask_bg/btnroot_top");
        // this._rule_content = UNodeHelper.find(this.node, "root/rule_content");
        this._btn_rule_intro = UNodeHelper.find(btnroot_top, "toggleContainer/btn_rule_intro");
        this._btn_paixing_info = UNodeHelper.find(btnroot_top, "toggleContainer/btn_paixing_info");
        this._btn_paixing_size = UNodeHelper.find(btnroot_top, "toggleContainer/btn_paixing_size");
        this._btn_rule_multiple = UNodeHelper.find(btnroot_top, "toggleContainer/btn_rule_multiple");
        this._btn_settlement = UNodeHelper.find(btnroot_top, "toggleContainer/btn_settlement");
        this._back = UNodeHelper.find(this.node, "back");
        UEventHandler.addClick(this._back, this.node, "VUHelp_ZJH", "closeUI");

        this._paixingLbl_normal = UNodeHelper.getComponent(this._btn_rule_multiple, "btn_normal/game_name", cc.Label);
        this._paixingLbl_selected = UNodeHelper.getComponent(this._btn_rule_multiple, "btn_selected/game_name", cc.Label);

        this._left_btn_scrollview = UNodeHelper.getComponent(this._btn_left, "scrollView", cc.ScrollView);

        let btn_rule_intro_toggle: cc.Toggle = UNodeHelper.getComponent(btnroot_top, "toggleContainer/btn_rule_intro", cc.Toggle);
        let btn_paixing_info_toggle: cc.Toggle = UNodeHelper.getComponent(btnroot_top, "toggleContainer/btn_paixing_info", cc.Toggle);
        let btn_paixing_size_toggle: cc.Toggle = UNodeHelper.getComponent(btnroot_top, "toggleContainer/btn_paixing_size", cc.Toggle);
        let btn_rule_multiple_toggle: cc.Toggle = UNodeHelper.getComponent(btnroot_top, "toggleContainer/btn_rule_multiple", cc.Toggle);
        let btn_settlement_toggle: cc.Toggle = UNodeHelper.getComponent(btnroot_top, "toggleContainer/btn_settlement", cc.Toggle);
        this._rule_type_btns.push(btn_rule_intro_toggle);
        this._rule_type_btns.push(btn_paixing_info_toggle);
        this._rule_type_btns.push(btn_paixing_size_toggle);
        this._rule_type_btns.push(btn_rule_multiple_toggle);
        this._rule_type_btns.push(btn_settlement_toggle);
        this._rule_type_btns.forEach(element => {
            UEventHandler.addToggle(element.node, this.node, "VUHelp_ZJH", "gameTypeClick", element.node.name);
        });
        let temp_cfg_game = cfg_game;

        let gameList = AppGame.ins.hallModel.getGameList();
        let showList = [];
        for (let key in gameList) {
            if (Object.prototype.hasOwnProperty.call(gameList, key)) {
                let item = gameList[key];
                showList.push(item.gameType);
            }
        }
        // UDebug.log('showList => ', showList)
        let game_keys = Object.keys(cfg_game);
        for (let index = 0; index < game_keys.length; index++) {
            const element = cfg_game[game_keys[index]];
            let help_ZJH_Item: cc.Toggle = UNodeHelper.getComponent(this._btn_left, "scrollView/view/content/btn_" + element.abbreviateName, cc.Toggle);
            if (!showList.includes(element.gametype)) {
                help_ZJH_Item.node.active = false;
                continue;
            }

            help_ZJH_Item.node.active = true;
            this._game_btns.push(help_ZJH_Item);
        }
        this._game_btns.forEach(element => {
            UEventHandler.addToggle(element.node, this.node, "VUHelp_ZJH", "gameClick", element.node.name);
        });
    }

    closeUI() {
        this.playclick();
        super.clickClose();
    }

    gameTypeClick(event: Event, ruleType: string) {
        // UDebug.Log("gameTypeClick  "+ ruleType);
        this._rule_type_btns.forEach(element => {
            if (element.node.name == ruleType) {
                element.isChecked = true;
                this.showHelpContent(ruleType);
            }
        });
    }

    gameClick(event: Event, gameType: string, isPlayClick: boolean = true) {
        if (isPlayClick) {
            super.playclick();
        }
        // UDebug.Log("gameClick  "+ gameType);
        this._gameType = gameType.substring(4);
        // this._gameType = cfg_game[gameType].abbreviateName;
        let game_keys = Object.keys(cfg_game);
        let game_level = 0;
        for (let index = 0; index < game_keys.length; index++) {
            const element = cfg_game[game_keys[index]];
            if (element.abbreviateName == this._gameType) {
                game_level = element.gametype;
                this._game_level = game_level;

            }
        }
        this._game_btns.forEach(element => {
            if (element.node.name == gameType) {
                element.isChecked = true;
                this.initTopBtn(game_level);
                this.showScrollviewContent(gameType);
                // 红黑的没有玩法介绍
                let hhName = cfg_game[EGameType.BRHH].abbreviateName;
                if (this._gameType == hhName) {
                    this.gameTypeClick(null, "btn_paixing_info");
                } else {
                    this.gameTypeClick(null, "btn_rule_intro");
                }
                this._left_btn_scrollview.stopAutoScroll();
                this._left_btn_scrollview.scrollToOffset(cc.v2(0, Math.abs(element.node.y) - element.node.height * 3), 0.2);
            }
            else {
            }
        });
    }

    start() {
        this.init();
    }
    /**
     *  隐藏
     */
    hide(handler?: UHandler): void {
        this.node.active = false;
    }

    showScrollviewContent(gameType: string) {
        let rule_content = UNodeHelper.find(this.node, "root/mask_bg/rule_content");
        let rule_content_scrollview: cc.ScrollView = UNodeHelper.getComponent(rule_content, "scrollview", cc.ScrollView);
        UNodeHelper.find(rule_content, "scrollview/view").children.forEach(element => {
            element.active = false;
        });
        let contentItem = UNodeHelper.find(rule_content, "scrollview/view/content_" + gameType.substring(4));
        contentItem.active = true;
        rule_content_scrollview.content = contentItem;
    }

    showHelpContent(ruleType: string) {
        let rule_content_scrollview: cc.ScrollView = UNodeHelper.getComponent(this.node, "root/mask_bg/rule_content/scrollview", cc.ScrollView);
        // let url = "common/texture/gamerules/" + this._gameType+ '/' +this._gameType+ '_' + ruleType.substring(4);
        let url = this.getContentUrl(this._gameType, ruleType);
        // UDebug.log('url => ', url)
        rule_content_scrollview.stopAutoScroll();
        rule_content_scrollview.scrollToTop();
        cc.loader.loadRes(url, cc.SpriteFrame, (error, res) => {
            let self = this;
            if (error == null) {
                rule_content_scrollview.content.children.forEach(element => {
                    element.active = false;
                });
                let sprite = UNodeHelper.find(rule_content_scrollview.content, ruleType.substring(4));
                sprite.active = true;
                if (sprite && sprite.isValid) {
                    sprite.getComponent(cc.Sprite).spriteFrame = res;
                }
            } else {
                UDebug.Log(error);
            }
        });
    }

    /**获取帮助内容url */
    getContentUrl(gameType: string, ruleType: string) {
        let url = "common/texture/gamerules/" + this._gameType + '/' + this._gameType + '_' + ruleType.substring(4);
        if (!this._isShowFriend) return url;
        let type = ruleType.substring(4);
        switch (gameType) {
            case 'tbnn':
                url = (type == 'rule_intro' || type == 'settlement') ? url + '_hy' : url;
                break;
            case 'kpqznn':
                url = (type == 'rule_intro' || type == 'settlement') ? url + '_hy' : url;
                break;
            case 'ddz':
                url = (type == 'rule_intro' || type == 'settlement' || type == 'paixing_info') ? url + '_hy' : url;
                break;
            case 'pdk':
                url = (type == 'rule_intro' || type == 'settlement' || type == 'paixing_info') ? url + '_hy' : url;
                break;
            case 'zjh':
                url = (type == 'rule_intro' || type == 'settlement' || type == 'paixing_info') ? url + '_hy' : url;
                break;
            default:
                break;
        }
        return url;
    }

    initTopBtn(gameLevel: number) {
        if (gameLevel) {
            cfg_game_help[gameLevel].rule_intro == "" ? this._btn_rule_intro.active = false : this._btn_rule_intro.active = true;
            cfg_game_help[gameLevel].paixing_info == "" ? this._btn_paixing_info.active = false : this._btn_paixing_info.active = true;
            cfg_game_help[gameLevel].paixing_size == "" ? this._btn_paixing_size.active = false : this._btn_paixing_size.active = true;
            cfg_game_help[gameLevel].rule_multiple == "" ? this._btn_rule_multiple.active = false : this._btn_rule_multiple.active = true;
            cfg_game_help[gameLevel].settlement == "" ? this._btn_settlement.active = false : this._btn_settlement.active = true;
        } else {
            cc.error("gameHelp gameType 为空");
        }

        if (gameLevel == EGameType.BCBM) {
            this._paixingLbl_normal.string = '投注点赔率';
            this._paixingLbl_selected.string = '投注点赔率';
        } else {
            this._paixingLbl_normal.string = '牌型倍数';
            this._paixingLbl_selected.string = '牌型倍数';
        }
    }

    show(data: any): void {
        // UDebug.log('show => ', data)
        super.show(data);
        this._game_level = data["gameType"];
        this._isShowFriend = ((data && data.showFriend) || AppGame.ins.currRoomKind == ERoomKind.Friend) || false;
        this.initTopBtn(this._game_level);

        this._game_btns.forEach(element => {
            element.node.active = true;
        });

        if (this._isShowFriend) {
            let friendGameList = [];
            for (const key in cfg_friends) {
                if (Object.prototype.hasOwnProperty.call(cfg_friends, key)) {
                    let element = cfg_friends[key];
                    if (element.abbreviateName) {
                        let name = element.abbreviateName.substring(0, element.abbreviateName.length - 3);
                        friendGameList.push(name);
                    }
                }
            }

            this._game_btns.forEach(element => {
                let name = element.node.name.substring(4);
                if (friendGameList.includes(name)) {
                    element.node.active = true;
                } else {
                    element.node.active = false;
                }
            });
        }

        this.scheduleOnce(() => {
            this.gameClick(null, "btn_" + cfg_game[this._game_level].abbreviateName, false);
        }, 0.05)

    }
}
