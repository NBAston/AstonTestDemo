

import AppGame from "../../public/base/AppGame";
import pdk_Main_hy from "./pdk_Main_hy";

/**
 * 作用:斗地主入口逻辑,处理框架，公共类逻辑
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class pdk_playPanel_hy extends cc.Component {
    
    @property(cc.ScrollView)
    scrollView:cc.ScrollView = null;
    @property(cc.Toggle)
    type_toggle_0:cc.Toggle = null;
    @property(cc.Toggle)
    type_toggle_1:cc.Toggle = null;
    @property(cc.Toggle)
    type_toggle_2:cc.Toggle = null;
    @property(cc.Toggle)
    type_toggle_3:cc.Toggle = null;
    @property(cc.Toggle)
    type_toggle_4:cc.Toggle = null;
    @property(cc.Toggle)
    type_toggle_5:cc.Toggle = null;
    @property(cc.Toggle)
    type_toggle_5_1:cc.Toggle = null;// 抽四张玩法
    @property(cc.Toggle)
    type_toggle_6:cc.Toggle = null;
    @property(cc.Toggle)
    type_toggle_7:cc.Toggle = null;
    @property(cc.Toggle)
    type_toggle_7_1:cc.Toggle = null; // 红桃三先出
    @property(cc.Toggle)
    type_toggle_8:cc.Toggle = null;
    @property(cc.Toggle)
    type_toggle_8_1:cc.Toggle = null; // 红桃三必出

    @property(cc.Toggle)
    toggle2:cc.Toggle = null;

    @property(cc.Toggle)
    toggle3:cc.Toggle = null;

    @property(cc.Toggle)
    toggle4:cc.Toggle = null;

    @property(cc.Toggle)
    toggle5:cc.Toggle = null;
    @property(cc.Toggle)
    toggle5_2:cc.Toggle = null;// 10倍底分
    @property(cc.Toggle)
    toggle5_3:cc.Toggle = null;// 5倍底分

    @property(cc.Toggle)
    toggle6:cc.Toggle = null;

    @property(cc.Toggle)
    toggle7:cc.Toggle = null;

    @property(cc.Toggle)
    toggle8:cc.Toggle = null;

    @property(cc.Toggle)
    toggle9:cc.Toggle = null;
    @property(cc.Toggle)
    toggle9_1:cc.Toggle = null;// 反关翻倍

    @property(cc.Toggle)
    toggle10:cc.Toggle = null;
    @property(cc.Toggle)
    toggle11:cc.Toggle = null;
    @property(cc.Toggle)
    toggle12:cc.Toggle = null;
    @property(cc.Toggle)
    toggle13:cc.Toggle = null;
    @property(cc.Toggle)
    toggle14:cc.Toggle = null;
   
    

    onEnable() {
       

    }

    onDisable() {

    }

    hidePanel() {
        pdk_Main_hy.ins._music_mgr.playClick();
        this.node.active = false;
    }

    setPlayPanelInfo() {
        this.node.active = true;
        this.scrollView.scrollToTop(0);
        let gameCfgInfo = AppGame.ins.fPdkModel.gameCfgInfo;
        let roomInfoHy = AppGame.ins.fPdkModel.roomInfoHy;
        if(gameCfgInfo) {
            if(roomInfoHy) {
                if(roomInfoHy.allRound == 10) {
                    this.type_toggle_0.isChecked = true;
                } else if(roomInfoHy.allRound == 20) {
                    this.type_toggle_1.isChecked = true;
                } else if(roomInfoHy.allRound == 30) {
                    this.type_toggle_2.isChecked = true;
                } else if(roomInfoHy.allRound == 40) {
                    this.type_toggle_3.isChecked = true;
                } 
            }

            if(gameCfgInfo.hasOwnProperty("Mode")) {
                if(gameCfgInfo["Mode"] == 0) {
                    this.type_toggle_5.isChecked = true;
                } else if(gameCfgInfo["Mode"] == 2) {
                    this.type_toggle_5_1.isChecked = true;
                } else {
                    this.type_toggle_4.isChecked = true;
                }
            } 

            if(gameCfgInfo.hasOwnProperty("WhoFistChuPai")) {
                if(gameCfgInfo["WhoFistChuPai"] == 0) {
                    this.type_toggle_7.isChecked = true;
                } else if(gameCfgInfo["WhoFistChuPai"] == 2) {
                    this.type_toggle_7_1.isChecked = true;
                } else {
                    this.type_toggle_6.isChecked = true;
                }
            } 

            if(gameCfgInfo.hasOwnProperty("MustSpades3") && gameCfgInfo["MustSpades3"]) {
                this.type_toggle_8.isChecked = true;
            } else {
                this.type_toggle_8.isChecked = false;
            }
            if(gameCfgInfo.hasOwnProperty("MustHearts3") && gameCfgInfo["MustHearts3"]) {
                this.type_toggle_8_1.isChecked = true;
            } else {
                this.type_toggle_8_1.isChecked = false;
            }

            if(gameCfgInfo.hasOwnProperty("FollowThreeWithLessCard") && gameCfgInfo["FollowThreeWithLessCard"]) {
                this.toggle2.isChecked = true;
            } else {
                this.toggle2.isChecked = false;
            }

            if(gameCfgInfo.hasOwnProperty("FollowWingWithLessCard") && gameCfgInfo["FollowWingWithLessCard"]) {
                this.toggle3.isChecked = true;
            } else {
                this.toggle3.isChecked = false;
            }

            if(gameCfgInfo.hasOwnProperty("AllowedFourWithThree") && gameCfgInfo["AllowedFourWithThree"]) {
                this.toggle4.isChecked = true;
            } else {
                this.toggle4.isChecked = false;
            }

            if(gameCfgInfo.hasOwnProperty("AllowedFourWithTwo") && gameCfgInfo["AllowedFourWithTwo"]) {
                this.toggle5.isChecked = true;
            } else {
                this.toggle5.isChecked = false;
            }

            if(gameCfgInfo.hasOwnProperty("BombBeiLv") && gameCfgInfo["BombBeiLv"] == 10) {
                this.toggle5_2.isChecked = true;
            } else {
                this.toggle5_2.isChecked = false;
            }

            if(gameCfgInfo.hasOwnProperty("BombBeiLv") && gameCfgInfo["BombBeiLv"] == 5) {
                this.toggle5_3.isChecked = true;
            } else {
                this.toggle5_3.isChecked = false;
            }

            if(gameCfgInfo.hasOwnProperty("ShowCardNum") && gameCfgInfo["ShowCardNum"]) {
                this.toggle6.isChecked = true;
            } else {
                this.toggle6.isChecked = false;
            }

            if(gameCfgInfo.hasOwnProperty("AllowedPass") && gameCfgInfo["AllowedPass"]) {
                this.toggle7.isChecked = true;
            } else {
                this.toggle7.isChecked = false;
            }
            if(gameCfgInfo.hasOwnProperty("NotAllowedSeparateBomb") && gameCfgInfo["NotAllowedSeparateBomb"]) {
                this.toggle8.isChecked = true;
            } else {
                this.toggle8.isChecked = false;
            }
            if(gameCfgInfo.hasOwnProperty("ThreeAIsBomb") && gameCfgInfo["ThreeAIsBomb"]) {
                this.toggle9.isChecked = true;
            } else {
                this.toggle9.isChecked = false;
            }
            if(gameCfgInfo.hasOwnProperty("FanGuanDouble") && gameCfgInfo["FanGuanDouble"]) {
                this.toggle9_1.isChecked = true;
            } else {
                this.toggle9_1.isChecked = false;
            }

            if(gameCfgInfo.hasOwnProperty("ChuPaiTime") && gameCfgInfo["ChuPaiTime"] == 0) {
                this.toggle10.isChecked = true;
            } else {
                this.toggle10.isChecked = false;
            }
            if(gameCfgInfo.hasOwnProperty("ChuPaiTime") && gameCfgInfo["ChuPaiTime"] == 20) {
                this.toggle11.isChecked = true;
            } else {
                this.toggle11.isChecked = false;
            }
            if(gameCfgInfo.hasOwnProperty("ChuPaiTime") && gameCfgInfo["ChuPaiTime"] == 30) {
                this.toggle12.isChecked = true;
            } else {
                this.toggle12.isChecked = false;
            }
            if(gameCfgInfo.hasOwnProperty("ChuPaiTime") && gameCfgInfo["ChuPaiTime"] == 60) {
                this.toggle13.isChecked = true;
            } else {
                this.toggle13.isChecked = false;
            }
            if(gameCfgInfo.hasOwnProperty("ChuPaiTime") && gameCfgInfo["ChuPaiTime"] == 120) {
                this.toggle14.isChecked = true;
            } else {
                this.toggle14.isChecked = false;
            }









        }
    }

}