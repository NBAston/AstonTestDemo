import UScene from "../../common/base/UScene";
import AppGame from "../../public/base/AppGame";
import MSGModel, { SG_SELF_SEAT } from "./MSGModel";
import USGHelper, {
    USGCmd, UISGUpdateTurnTime, UISGOverTurn, UISGUpdateSeatRoleInfo,
    UISGNextTurn, UISGLookPai, SGBattlePlayerInfo, UISGBattleOver, UISGSetZHU, ESGState
} from "./USGHelper";
import { RoomInfo } from "../../public/hall/URoomClass";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UHandler from "../../common/utility/UHandler";
import USpriteFrames from "../../common/base/USpriteFrames";
import VSGMenu from "./VSGMenu";
import VSGSeat from "./VSGSeat";
import VSGOperate from "./VSGOperate";
import VSGMatch from "./VSGMatch";
import { ToBattle } from "../../common/base/UAllClass";
import MRoomModel from "../../public/hall/room_zjh/MRoomModel";
import AppStatus from "../../public/base/AppStatus";
import { ECommonUI, ELevelType, EGameType, EEnterRoomErrCode } from "../../common/base/UAllenum";
import ULanHelper from "../../common/utility/ULanHelper";
import { triggerAsyncId } from "async_hooks";
import UDebug from "../../common/utility/UDebug";
import UCoinDFlyHelper from "../../common/utility/UCoinFlyHelper";
import USGMusic from "./USGMusic";
import UAudioRes from "../../common/base/UAudioRes";
import { runInThisContext } from "vm";
import UGame from "../../public/base/UGame";
import VFyxbdNode from "../common/VFyxbdNode";
import ULocalDB from "../../common/utility/ULocalStorage";
import { ZJH_SELF_SEAT } from "../zjh/MZJH";
import UAudioManager from "../../common/base/UAudioManager";
import UEventHandler from "../../common/utility/UEventHandler";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import MHall, { NEWS } from "../../public/hall/lobby/MHall";
import UStringHelper from "../../common/utility/UStringHelper";
import { ZJH_SCALE } from "../bcbm/VbcbmScene";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";

const { ccclass, property } = cc._decorator;
/**
 * ??????:dz
 * ??????:
 */
@ccclass
export default class VSG extends UGame { // UScene {

    /**?????? */
    private static _ins: VSG;
    static get ins(): VSG {
        return VSG._ins;
    }

    /**???????????? */
    private _playerNode: cc.Node;
    /**??????????????? */
    private _pokerNode: cc.Node;
    /**??????flagnode */
    private _stataFlagNode: cc.Node;

    /**???ui?????? */
    private _mainNode: cc.Node;
    /**???????????? */
    private _menuNode: cc.Node;


    /**????????????????????????????????? */
    private _myturn: cc.Node;
    /**???????????????????????? */
    private _lableNode: cc.Node;

    /**
     * ??????
     */
    private _menu: VSGMenu;
    /**
     * ??????
     */
    private _seats: { [key: number]: VSGSeat };
    /**
     * ????????????
     */
    private _opreate: VSGOperate;

    /**?????? */
    // private _pkAction: VPKAction;

    /**???????????? */
    private _dizhu: cc.Label;
    /**???????????? */
    // private _dingzhu: cc.Label;
    /**???????????? */
    private _bianhao: cc.Label;
    /**?????????????????? */
    private sg_pjbg: cc.Node;
    private _charge_btn: cc.Node;
    private _emergency_announcement: Array<string>;
    private _enterMinScore: number;

    /**??????????????? */
    private _totalLun: cc.Label;
    /**??? */
    // private _light: cc.Node;

    private _res: USpriteFrames;
    /**???????????? */
    private _cmds: Array<USGCmd>;
    /** ?????????????????????*/
    private _canGetCmd: boolean;
    /**??????????????? */
    private _djsNode: cc.Node;
    /**???????????????label */
    private _djsLabel: cc.Label;
    /**???????????? */
    private _djsTime: number = 0;
    private _allTimer: number = 0
    private _iswait: boolean = false;
    /**???????????? */
    private _tmp_time: number = 0;
    private _tmp_sp_name: string = "ksyx";

    /**???????????? */
    private _match: VSGMatch;
    /**?????????????????? */
    private _tipLabel: cc.Label;

    /**???????????????????????? */
    private _coins_length: number = 12;

    private _wait: cc.Node;
    /**5?????????????????? */
    private _headpos = {
        [0]: cc.v2(-281, -264),
        [1]: cc.v2(546, -20),
        [2]: cc.v2(368, 169),
        [3]: cc.v2(-368, 169),
        [4]: cc.v2(-546, -20),
    }
    private _coinFlyHelper: UCoinDFlyHelper;

    /**???????????? */
    private _tong_Ani: sp.Skeleton;
    private _tongPei_Ani: sp.Skeleton;
    private _ksyxAni: sp.Skeleton;
    /**???????????? */
    private _win_Ani: sp.Skeleton;
    private _music: USGMusic;
    get music(): USGMusic {
        return this._music;
    }

    private _fyxbd_panel: VFyxbdNode;

    /**????????????????????? */
    private _isReconnect: boolean = false;
    /**?????????????????? */
    // private _isNoInGameReset:boolean = false;

    /**
     * ?????????
     */
    init(): void {
        VSG._ins = this;
        var self = this;
        // USGHelper.SG_EVENT.SG_GAMESCENE_CALL

        /**????????????????????? */
        let root = UNodeHelper.find(this.node, "uiroot/content");
        this._playerNode = UNodeHelper.find(root, "players_node");
        this._pokerNode = UNodeHelper.find(root, "poker_node");
        this._stataFlagNode = UNodeHelper.find(root, "stateflag_node");
        this._mainNode = UNodeHelper.find(root, "main");
        // this._wait = UNodeHelper.find(root, "wait");
        // this._wait.active = false;
        this._myturn = UNodeHelper.find(root, "myturn_node");
        this._lableNode = UNodeHelper.find(root, "label_node");
        // this._light = UNodeHelper.find(root, "main/light");

        this._dizhu = UNodeHelper.getComponent(this._lableNode, "dizhu", cc.Label);
        // this._dingzhu = UNodeHelper.getComponent(this._lableNode, "dingzhu", cc.Label);
        this._bianhao = UNodeHelper.getComponent(this._lableNode, "sg_pjbg/bianhao", cc.Label);
        this._bianhao.node.active = false;

        this.sg_pjbg = UNodeHelper.find(this._lableNode, "sg_pjbg");
        this.sg_pjbg.active = false;
        this._charge_btn = UNodeHelper.find(this.node, "uiroot/content/players_node/seat_1/charge_btn");
        UEventHandler.addClick(this.sg_pjbg, this.node, "VSG", "oncopy");
        UEventHandler.addClick(this._charge_btn, this.node, "VSG", "intoCharge");


        this._totalLun = UNodeHelper.getComponent(this._lableNode, "lun", cc.Label);

        this._res = this.node.getComponent(USpriteFrames);

        let btnMenu = UNodeHelper.find(root, "btn_menu");

        this._menuNode = UNodeHelper.find(root, "menu");
        this._menu = new VSGMenu(btnMenu, this._menuNode, this);
        this._menu.setOn(false);

        this._opreate = this._myturn.getComponent(VSGOperate);
        this._opreate.init(this);//, this._addchipNode

        this._djsNode = UNodeHelper.find(root, "Timer");
        this._djsLabel = UNodeHelper.getComponent(this._djsNode, "progressTimerFont", cc.Label);

        this._match = UNodeHelper.getComponent(root, "match_node", VSGMatch);
        this._match.init(this);
        this._match.hide();

        /**??????????????? */
        this._seats = {};
        let fapaiOri = UNodeHelper.find(this._pokerNode, "fapai_ori");
        let len = 5;//this._playerNode.childrenCount;


        for (let i = 0; i < len; i++) {
            let idx = i + 1;
            let win = UNodeHelper.find(this._playerNode, "win_" + idx);
            let st = UNodeHelper.find(this._playerNode, "seat_" + idx);
            let pk = UNodeHelper.find(this._pokerNode, "poker_" + idx);
            let flag = UNodeHelper.find(this._stataFlagNode, "flag_" + idx);
            let paixing = UNodeHelper.find(this._pokerNode, "paixing_" + idx);

            let spine_zhuang = UNodeHelper.getComponent(st, "spine_zhuang", sp.Skeleton);
            let spine_winner = UNodeHelper.getComponent(st, "spine_winner", sp.Skeleton);

            let seat = new VSGSeat(idx, fapaiOri, st, pk, flag, paixing, win, this._res, spine_zhuang, spine_winner);
            this._seats[seat.seatId] = seat;
            seat.free();
        }
        //????????????
        let coinfly_parent = UNodeHelper.find(root, "player_coin");
        let coin_temp = UNodeHelper.find(coinfly_parent, "coinTemp");
        this._coinFlyHelper = new UCoinDFlyHelper(coin_temp, coinfly_parent, this._headpos);

        this._tong_Ani = UNodeHelper.getComponent(root, "ani_node/tongsha_pei/tongsha_pei", sp.Skeleton);
        this._tongPei_Ani = UNodeHelper.getComponent(root, "ani_node/sg_tp/sg_tp", sp.Skeleton);
        this._ksyxAni = UNodeHelper.getComponent(root, "ani_node/sg_ksyx/sg_ksyx", sp.Skeleton);

        this._ksyxAni.setCompleteListener(() => {
            self.fapai_ani();
            self.setTongAni(false);
        });
        this._tong_Ani.setCompleteListener(() => {
            self.setTongAni(false);
        });

        this._tongPei_Ani.setCompleteListener(() => {
            self.setTongAni(false);
        })

        this.setTongAni(false);




        this._win_Ani = UNodeHelper.getComponent(root, "win_self/win_self", sp.Skeleton);
        this._win_Ani.setCompleteListener(() => {
            this.setWinAni(false);
        });
        this.setWinAni(false);


        //????????????
        // let audioRes = this.node.getComponent(UAudioRes);
        this._music = new USGMusic();//audioRes

        //tips
        let tipBg = UNodeHelper.find(root, "main/sg_ts_wzbj");
        this._tipLabel = UNodeHelper.getComponent(tipBg, "label_tip", cc.Label);
        this.setLabelTip(false);

        this._canGetCmd = true;
        this._cmds = [];
    }


    /**??????userId?????????????????? */
    getPropNodeByUserId(userId: number, callback: any = null) {
        for (let key in this._seats) {
            let seat = this._seats[key];
            let propNode = seat.getPropNode();
            let bindUserId = propNode.getComponent(GamePropManager).getBindUserId();
            if (bindUserId && (userId == bindUserId)) {
                callback && callback(propNode);
            }
        };
    }
    /**??????userId?????????????????? */
    getChatPropNodeByUserId(userId: number, callback: any = null) {
        for (let key in this._seats) {
            let seat = this._seats[key];
            let chatProp = seat.getChatPropNode();
            let bindUserId = chatProp.getComponent(VGameChatPropManager).getBindUserId();
            if (bindUserId && (userId == bindUserId)) {
                callback && callback(chatProp);
            }
        };
    }

    test() {
        // this._opreate.updateXiazhuBtns([7, 14, 21, 28, 35]);
    }

    /**???????????????????????? ?????????????????????  *//**sq ?????? ???????????????????????????????????? data:ToBattle */
    openScene(data: any): void {

        super.openScene(data);
        this._enterMinScore = data.roomData.enterMinScore;
        let dt = data as ToBattle;
        if (dt) {
            AppGame.ins.sgModel.saveRoomInfo(dt.roomData);
            if (!dt.fromReconnet) {
                this.waitbattle();
            }
            else {//??????????????????
                this._isReconnect = true;
                this.waitbattle();
            }
        }



        this._music.playGamebg();
        // let room = data.roomData as RoomInfo;
        // this._dingzhu.string = "??????:" + room.ceilScore.toString();
        // this._dizhu.string = "??????:" + room.floorScore.toString();
    }

    //????????????????????????
    private oncopy(): void {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this._bianhao.string).substr(5, 30));
    }

    private intoCharge(): void {
        AppGame.ins.showUI(ECommonUI.LB_Charge);
    }

    protected update(dt: number): void {
        while (this._canGetCmd && this._cmds.length > 0) {
            let cmd = this.getcmd();
            if (cmd) {
                this._canGetCmd = !cmd.needwait;
                this.docmd(cmd);
            } else {
                this._canGetCmd = true;
            }
        }

        //???????????????
        if (this._djsTime > 0 && !this._iswait) {
            this._djsNode.active = true;

            this._djsTime -= dt;

            let leave_time = Math.ceil(this._djsTime);//.floor

            let str_time = leave_time.toString();
            // if (leave_time < 10) {
            //     str_time = '0' + leave_time;
            // }
            this.updateTimerPro(this._allTimer, this._djsTime, false);
            if (this._djsLabel != null) {
                this._djsLabel.string = str_time;
            }

            if (this._djsTime < 0) {
                this._djsTime = 0;
                this._djsNode.active = false;
                this.updateTimerPro(this._allTimer, this._djsTime, true);
                this._music.playTimenotice();
            }

        }

    }

    /**
     * @description ??????????????????
     * @param allTime  ????????? 
     * @param lastTime  ????????????
     * @param isInit ???????????????
     */
    updateTimerPro(allTime: number, lastTime: number, isInit: boolean) {
        let _ProgressBar = this._djsNode.getComponent(cc.ProgressBar);
        this._djsNode.active = !isInit;
        if (isInit) {
            this._djsTime = 0;
            this._allTimer = 0;
            _ProgressBar.progress = 1;
        } else {
            _ProgressBar.progress = lastTime / allTime;
        };

    };

    /**????????????????????????????????? */
    protected pushcmd(cmd: string, dt: any, needwait: boolean): void {
        if (!this._cmds) this._cmds = [];
        let item = new USGCmd();
        item.cmd = cmd;
        item.data = dt;
        item.needwait = false;//needwait;


        // if(this._cmds.length == 0)
        //     this._canGetCmd = true;

        this._cmds.push(item);
    }
    /**????????? */
    protected getcmd(): USGCmd {
        if (this._cmds.length > 0) {
            return this._cmds.shift();
        }
        return null;
    }
    private docmd(cmd: USGCmd): void {
        switch (cmd.cmd) {
            case "game_start"://??????
                this.do_game_start(cmd.data);
                break;

            case "call_banker"://??????????????????
                this.do_call_banker(cmd.data);
                break;
            case "call_banker_result"://????????????
                this.do_call_banker_result(cmd.data);
                break;
            case "xia_zhu"://????????????
                this.do_xia_zhu(cmd.data);
                break;


            //case "seat_info"://????????????
            //this.do_seat_info(cmd.data);
            //    break;
            // case "next_turn":
            //     this.next_turn(cmd.data);
            //     break;
            case "player_score":
                this.player_score(cmd.data);
                break;
            // case "total_turn":
            //     this.total_turn(cmd.data);
            //     break;
            // case "total_score":
            //     this.total_score(cmd.data);
            //     break;
            // case "turn_over":
            //     this.turn_over(cmd.data);
            //     break;
            // case "set_zhu":
            //     this.do_set_zhu(cmd.data);
            //     break;
            case "turn_time"://?????????
                this.do_turn_time(cmd.data);
                break;
            // case "compare":
            //     this.do_compare(cmd.data);
            //     break;
            case "game_end"://??????
                this.do_game_end(cmd.data);
                break;
            case "look_pai"://??????
                this.do_look_pai(cmd.data);
                break;
            // case "guzhuyizhi":
            //     this.do_guzguyizhi(cmd.data);
            //     break;
            case "fapai"://??????
                this.do_fapai(cmd.data);
                break;
            case "no_in_game"://??????
                this.do_no_in_game();
                break;
            case "do_showpai":
                this.do_showpai();
                break;
        }
    }
    private do_showpai(): void {
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                if (!element.isFree) {
                    if (element.isOnRound)
                        element.hidePoker(true);
                }
            }
        }
    }



    //#region ??????????????????
    /**
     * ??????????????????
     * @param num 
     * @param b 
     */
    private setDiZhu(num: number, b?: boolean) {
        UDebug.Log("????????????" + num)
        num = AppGame.ins.sgModel.currentDizhu;
        this._dizhu.string = "??????: " + (num / 100).toString();
        this._dizhu.node.active = true
    }
    //#endregion

    /** ??????????????????*/
    waitbattle(): void {
        // this._isNoInGameReset = false;
        this.sceneHideUi();
        this._isReconnect = false;
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                if (element.seatId == 0) {
                    element.showbaseInfo(AppGame.ins.sgModel.getshowselfinfo());
                } else
                    element.free();
            }
        }
        this.showgameinfo(false);
        if (this._win_Ani) {
            this._win_Ani.unscheduleAllCallbacks();
        }


        this.updateTimerPro(0, 0, true);
        this.unscheduleAllCallbacks();
        this._match.show();
    }

    private showgameinfo(value: boolean): void {
        // this._dingzhu.node.active = value;
        UDebug.Log("showgameinfo" + AppGame.ins.sgModel.currentDizhu)
        this.setDiZhu(AppGame.ins.sgModel.currentDizhu, value);
        // this._totoalCount.node.active = value;
        // this._totalLun.node.active = value;

        this._tipLabel.node.parent.active = false;
        this.setWinAni(false);
        // this._bianhao.node.active = value;
        // this.sg_pjbg.active = value;

    }

    private do_fapai(data?: any): void {
        let sendCard = data["sendCard"];
        let openTime = data["openTime"];
        this._opreate.set_xz_node(false);
        this.setLabelTip(false);

        var isSee = data.isSee;
        if (isSee == true) {//????????????
            this._opreate.set_seepai_node(false);
        } else {
            this._opreate.set_seepai_node(true);

        };

        let seat = this._seats[0];
        seat.fanpai2(sendCard, UHandler.create(() => {
            if (!isSee) {
                let param = {
                    pokerData: sendCard[2],
                    autoCloseTime: openTime,
                    openCardFunc: () => {
                        AppGame.ins.sgModel.sendOpenCard();
                    },
                }
                AppGame.ins.showUI(ECommonUI.UI_GAME_MIPAI, param);
            }
        }, this));


        if (!this._isReconnect) {//???????????????
            this._canGetCmd = true;//????????????????????????
        }
    }

    /**?????????????????? */
    private playCoinFlyAni(start: number, end: number) {
        if (start < 0 || start > 4 || end < 0 || end > 4) return;

        for (let i = 0; i < this._coins_length; i++) {
            var item = this._coinFlyHelper.getInstans();
            item.setPosition(this._headpos[start]);
            this._coinFlyHelper.moveChipToRect(item, start, end);
        }
        /**???10????????? */
        for (let j = 0; j < 5; j++) {
            this._music.playflyCoin();
        }

        this.scheduleOnce(() => {
            this.spineWinner(end);
        }, 0.5);

    }

    private spineWinner(index: number) {
        let pl = this._seats[index];
        if (pl != null) {
            // if (pl.isOnRound) {
            pl.showWinnerSpine();
            // }
        }
    }


    /**??????????????????,?????? */
    private coinFlyComplete(statics: any, waittime?: number) {
        for (const key in statics) {
            if (statics.hasOwnProperty(key)) {
                let element = statics[key];
                let pl = this._seats[element.seatId];
                if (pl != null) {
                    let userId = this._seats[key]._userId;
                    var battleplayer = AppGame.ins.sgModel._battleplayer[userId];
                    if (battleplayer && battleplayer.playStatus) {
                        pl.setScore(element.lastscore);
                        pl.result(element.iswin, element.getScore, waittime);
                        if (element.seatId == SG_SELF_SEAT) {
                            this.winAni(element.iswin, waittime);
                        }
                    }
                }
                // if (element.uipoker) pl.fanpai(element.uipoker);
            }
        }

        // this.scheduleOnce(() => {
        //     this._wait.active = true;
        //     this.clear_seats();
        // }, waittime+3);
    }
    /**???????????? */
    private winAni(iswin: boolean, waittime?: number) {
        if (iswin) {
            if (waittime != null) { //??????/????????????"?????????"??????

                this._win_Ani.unscheduleAllCallbacks();

                this._win_Ani.scheduleOnce(() => {
                    this.setWinAni(true, "sg_win");
                }, waittime);
            }
            else {
                this.setWinAni(true, "sg_win");
            }
        }
        else {

            if (waittime != null) {
                this._win_Ani.unscheduleAllCallbacks();

                this._win_Ani.scheduleOnce(() => {
                    this.setWinAni(true, "sg_lose");
                }, waittime);
            }
            else {
                this.setWinAni(true, "sg_lose");
            }

        }
    }
    /**????????????/??? ?????? */
    private setWinAni(b: boolean, str?: string) {
        this._win_Ani.node.parent.active = b;
        if (b && str != null) {
            // this._tmp_sp_name = str;
            cc.log("????????????/??? ??????:", str);
            this._win_Ani.setAnimation(0, str, false);
            this._win_Ani.setCompleteListener(() => {
                this._win_Ani.animation = "";
                this._win_Ani.node.parent.active = false;
            });
            if (str == "sg_win") {
                UAudioManager.ins.playSound("audio_qznn_gxnyl");
            } else if (str == "sg_lost") {
                UAudioManager.ins.playSound("audio_qznn_nsl");
            }

        }
    }

    /**????????????/?????? ?????? */
    private setTongAni(b: boolean, str?: string) {

        if (b && str != null) {
            this._tmp_sp_name = str;
            if (str == "ts") {
                this._tong_Ani.node.parent.active = b;
                this._tong_Ani.animation = str;
                this._tong_Ani.setAnimation(0, str, false);
                this._tong_Ani.setCompleteListener(() => {
                    this.setTongAni(false);
                });

            } else if (str == "ksyx") {
                this._ksyxAni.node.parent.active = b;
                this._ksyxAni.animation = str;
                this._ksyxAni.setAnimation(0, str, false);
                this._ksyxAni.setCompleteListener(() => {
                    this.fapai_ani();
                    this.setTongAni(false);
                });

            } else {
                this._tongPei_Ani.node.parent.active = b;
                this._tongPei_Ani.animation = str;
                this._tongPei_Ani.setAnimation(0, str, false);

                this._tongPei_Ani.setCompleteListener(() => {
                    this.setTongAni(false);
                })
            }
            UDebug.log("str:" + str);
        } else {
            this._tong_Ani.node.parent.active = b;
            this._ksyxAni.node.parent.active = b;
            this._tongPei_Ani.node.parent.active = b;
            this._tongPei_Ani.setCompleteListener(() => {
            })
            this._ksyxAni.setCompleteListener(() => {
            });
            this._tong_Ani.setCompleteListener(() => {
            });
        };

    }

    private do_game_end(data: any): void { //caller: UISGBattleOver
        this._opreate.set_seepai_node(false);
        //??????????????????
        var self = this
        //todo?????????????????????
        this.node.runAction(cc.sequence(cc.delayTime(data.endTime), cc.callFunc(() => {
            self.waitbattle();
            // self._wait.active = true;
            self.clear_seats();

            // for (const key in AppGame.ins.sgModel._battleplayer) {
            //     if (AppGame.ins.sgModel._battleplayer.hasOwnProperty(key)) {
            //         const element = AppGame.ins.sgModel._battleplayer[key];
            //         element.playStatus = 0
            //     }
            // }
        })));

        this.setLabelTip(false);
        // this._music.playOver();
        // this._pkAction.battleOver();
        var endType = data.endType;
        var bankerLocalPos = AppGame.ins.sgModel.getLocalBankerIndex();

        var statics = data.statics;

        this._canGetCmd = true;

        //?????????????????????
        if (this._seats && this._seats[0] && statics && statics[0]
            && this._seats[0].seatId == 0) {
            this._seats[0].score = statics[0].lastscore;
        }

        //????????????
        if (bankerLocalPos != null) {//?????????
            if (endType == 1) {//??????
                this.setTongAni(true, "ts");
                this._music.playTongsha();

                this.unscheduleAllCallbacks();

                //?????????????????????????????????
                for (const key in statics) {
                    if (statics.hasOwnProperty(key)) {
                        let element = statics[key];
                        let index1 = element.seatId;
                        let score = element.getScore;
                        if (index1 != null && index1 != bankerLocalPos && score != 0) {
                            this.playCoinFlyAni(index1, bankerLocalPos);
                        }
                    }
                }


                this.scheduleOnce(() => {
                    self.coinFlyComplete(statics, 0.8);

                }, 0.8);

                return;
            }
            else if (endType == 2) {//??????
                this.setTongAni(true, "tp");
                this._music.playTongpei();

                this.unscheduleAllCallbacks();

                //?????????????????????????????????
                for (const key in statics) {
                    if (statics.hasOwnProperty(key)) {
                        let element = statics[key];
                        let index2 = element.seatId;
                        let score = element.getScore;
                        if (index2 != null && index2 != bankerLocalPos && score != 0) {
                            this.playCoinFlyAni(bankerLocalPos, index2);
                        }
                    }
                }


                this.scheduleOnce(() => {
                    self.coinFlyComplete(statics, 0.8);

                }, 0.8);

                return;
            }

            /**??????????????? */
            let toBanker = new Array();
            /**??????????????? */
            let toPlayers = new Array();

            for (const key in statics) {
                if (statics.hasOwnProperty(key)) {
                    let element = statics[key];
                    let index = element.seatId;
                    let score = element.getScore;
                    if (score > 0) {//??????????????????
                        if (index != null && bankerLocalPos != index) {//????????????
                            // this.playCoinFlyAni(bankerLocalPos, index);

                            toPlayers.push({ start: bankerLocalPos, end: index });
                        }
                    }
                    else if (score < 0) {
                        if (index != null && bankerLocalPos != index) {
                            // this.playCoinFlyAni(index, bankerLocalPos);

                            toBanker.push({ start: index, end: bankerLocalPos });
                        }
                    }
                }
            }

            this.unscheduleAllCallbacks();

            for (let i = 0; i < toBanker.length; i++) {
                let element = toBanker[i];
                this.playCoinFlyAni(element.start, element.end);
            }

            this.scheduleOnce(() => {
                for (let j = 0; j < toPlayers.length; j++) {
                    let element = toPlayers[j];
                    self.playCoinFlyAni(element.start, element.end);
                }
            }, 0.8);

            this.scheduleOnce(() => {
                self.coinFlyComplete(statics);
            }, 1.5);

        }
    }
    private do_look_pai(caller: UISGLookPai): void {
        let seat = this._seats[caller.seatId];
        // seat.seePai();

        if (caller.seatId == 0) {//??????
            this._opreate.set_seepai_node(false);
            let isEnd = caller["isEnd"];
            if (!isEnd) {
                this.setLabelTip(true, ULanHelper.WAIT_PIN_CARD);
            }
        }

        // this._music.playPaiXing(caller.poker.cardtype, this._seats[caller.seatId].sex);

        if (caller.poker) {
            seat.fanpai(caller.poker, UHandler.create(() => {
                this._music.playPaiXing(caller.poker.cardtype, this._seats[caller.seatId].sex);
                this._canGetCmd = true;
            }, this));
        }
    }


    private do_seat_info(caller: { [key: number]: SGBattlePlayerInfo }): void {
        this.showgameinfo(true);
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                let data = caller[element.seatId];
                element.free();
                if (data) {
                    element.bind(data);
                }
            }
        }
    }

    private player_score(caller: UISGUpdateSeatRoleInfo): void {
        this._seats[caller.seatId].updateScore(caller.score, caller.usetotal);
    }


    /**???????????????????????? ?????????*/
    private do_turn_time(data: any): void {

        // this._seats[caller.seatId].updateturnTime(caller.leftTime);
        // UDebug.Log("do_turn_time:" + JSON.stringify(data));
        // if (data != null) {
        //     this._djsTime = data;
        // }

    }


    //#region  ????????????
    /**
     * ??????????????????
     * @param caller 
     */
    private ts_fapai(data: any): void {
        this.pushcmd("fapai", data, true);
    }
    private updata_seat_info(caller: any): void {
        UDebug.log("seat_info");
        this.pushcmd("seat_info", caller, false);
    }

    // private sc_ts_set_next_turn(caller: UISGNextTurn): void {
    //     this.pushcmd("next_turn", caller, false);
    // }
    private sc_ts_updata_total_player_score(caller: any): void {
        this.pushcmd("player_score", caller, false);
    }

    private sc_ts_updata_total_score(caller: any): void {
        this.pushcmd("total_score", caller, false);
    }
    private game_end(caller: any): void {
        var self = this;

        //???????????????
        this.updateTimerPro(0, 0, true)
        this.scheduleOnce(() => {
            self.pushcmd("game_end", caller, true);
        }, 0.5);
    }
    private look_pai(caller: any): void {
        this.pushcmd("look_pai", caller, true);
    }
    // private set_turn_over(caller: any): void {
    //     this.pushcmd("turn_over", caller, false);
    // }
    private update_turn_time(caller: any, iswait?: boolean): void {
        // this.pushcmd("turn_time", caller, false);

        if (caller != null) {
            this._allTimer = caller;
            this._djsTime = caller;
        }

        if (iswait == true) {
            cc.log("aaaaaaaaaaaaaaa111")
            this._iswait = true;
            this._djsNode.active = false;
            // this._tmp_time = caller;
        }

    }

    private clear_seats() {
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                element.setCallOrXiaZhu(false);
                element.clear();
                element.onRound = false;
            }
        }
    }

    private sc_ts_start_match(data: boolean): void {
        if (data == true) {
            this.waitbattle();
        } else {
            this._opreate.showMatch();
        }
    }

    private set_cancle_match(caller: boolean): void {
        // this._opreate.showMatchBtn(true);

        if (caller == true) {
            this._opreate.showMatchBtn(true);
            this._match.hide();
        } else {
            this.sceneHideUi();
            this._match.show();
        }
    }

    /********* sg begin ******* */
    private game_start(data?: any): void {
        this.pushcmd("game_start", data, true);
    }
    private call_banker(data: any): void {
        this.pushcmd("call_banker", data, true);
    }

    private call_banker_result(data: any): void {
        this.pushcmd("call_banker_result", data, true);
    }
    private xia_zhu(data: any): void {
        this.pushcmd("xia_zhu", data, false);
    }

    /********** sg do_event **************/
    private do_game_start(data: any) {
        UDebug.Log("????????????:" + JSON.stringify(data));
        this._match.hide();
        // this._wait.active = false;
        // this._wait.stopAllActions();

        //this.setDiZhu(data.cellScore);
        this.clear_seats();
        this.node.stopAllActions();
        // this.fapai_ani();
        this.setTongAni(true, "ksyx");
        this._music.playStart();

        // this._canGetCmd = true;//????????????????????????
        this._opreate.set_seepai_node(false);
    }

    private fapai_ani() {
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                if (!element.isFree) {
                    if (element.seatId == SG_SELF_SEAT) {
                        element.fapai(UHandler.create(() => {
                            this._canGetCmd = true;
                        }, this));
                    } else {
                        var playstatus = AppGame.ins.sgModel._battleplayer[this._seats[key]._userId].playStatus
                        if (playstatus) {
                            UDebug.Log("??????" + this._seats[key]._userId)
                            element.fapai(null);
                        }
                    }
                }
            }
        }
    }




    private do_call_banker(data: any) {

        if (this._isReconnect) {
            cc.error("aaaaaaaaaaaaaaaa")
            this._canGetCmd = false;
            this.fapai_ani();
            this._isReconnect = false;
        }
        else {
            this._canGetCmd = true;
        }

        var wCallBankerUser = data.localPos;
        var cbCallMultiple = data.callMultiple;
        let disconnected = data["disconnected"]
        if (wCallBankerUser == 0) {//?????????
            this._opreate.set_qz_node(false);//????????????

            this.setLabelTip(true, ULanHelper.WAIT_CALL_BANKER);
        }

        if (cbCallMultiple == 0) {//??????

            this._seats[wCallBankerUser].setCallOrXiaZhu(true, "??????", true);
            if (!disconnected) {
                this._music.playQiangZhung(false, this._seats[wCallBankerUser].sex);
            }
        }
        else {//??????
            this._seats[wCallBankerUser].setCallOrXiaZhu(true, "??????", true);
            if (!disconnected) {
                this._music.playQiangZhung(true, this._seats[wCallBankerUser].sex);
            }
        }

        this._opreate.set_seepai_node(false);


    }

    private do_call_banker_result(data: any) {
        // this.do_turn_time()
        UDebug.log("do_call_banker_result");
        var beidatas = data.beidatas;//????????????
        var cbCallBankerUser = data.cbCallBankerUser;//??????????????????
        var dwBankerUser = data.dwBankerUser;//??????????????? ??????????????????
        let disconnected = data["disconnected"];
        // UDebug.Log("do_call_banker_result:" + JSON.stringify(data));
        if (dwBankerUser > 5 || dwBankerUser < 0) {
            return;
        }
        if (beidatas != null) {

            //?????????????????? ?????????????????????
            if (AppGame.ins.sgModel.selfRealSeatId != AppGame.ins.sgModel.bankerChairId) {
                // this._opreate.intoSelfturn("xia_zhu");
                if (!disconnected) {
                    this._opreate.updateXiazhuBtns(beidatas, beidatas.length);
                };

                this.setLabelTip(false);
            }
            else {
                this.setLabelTip(true, ULanHelper.WAIT_XIA_ZHU);

            }
        }

        if (cbCallBankerUser != null) {

            // if (AppGame.ins.sgModel.bankerChairId == null) return;

            if (cbCallBankerUser.length > 1) {//???????????????
                for (let i = 0; i < cbCallBankerUser.length; i++) {
                    let seat_pos = cbCallBankerUser[i];
                    this._seats[seat_pos].randomPickBanker(dwBankerUser, i);
                }
            }
            else if (cbCallBankerUser.length == 0) {//???????????? ???????????????
                for (const key in this._seats) {
                    if (this._seats.hasOwnProperty(key)) {
                        const element = this._seats[key];
                        if (!element.isFree) {
                            if (element.isOnRound) {
                                element.randomPickBanker(dwBankerUser, element.seatId);
                            }
                        }
                    }
                }
            }
            else//1???,?????????????????????????????? ?????????
            {
                // this.chooseBankerComplete(dwBankerUser);
                let chairId = AppGame.ins.sgModel.getRealSeatId(dwBankerUser);
                let player = AppGame.ins.sgModel.getbattleplayerbyChairId(chairId);
                if (player && player.userStatus >= 5) {
                    this._seats[dwBankerUser].setBankerSpine(true, disconnected ? null : dwBankerUser);
                };

                //??????????????? ?????????
                //?????????
                // let seat = this._seats[dwBankerUser];
                // this._music.playZhuang(seat.sex);
            }

        }


    }

    private do_xia_zhu(data: any) {

        UDebug.Log("do_xia_zhu" + JSON.stringify(data));

        var wAddJettonUser = data.localPos;
        var cbJettonMultiple = data.cbJettonMultiple;

        if (cbJettonMultiple != null && wAddJettonUser != null) {
            //???????????? ?????????????????????

            if (wAddJettonUser != AppGame.ins.sgModel.getLocalBankerIndex()) {
                let chairId = AppGame.ins.sgModel.getRealSeatId(wAddJettonUser);
                let player = AppGame.ins.sgModel.getbattleplayerbyChairId(chairId);
                if (player && player.userStatus >= 5) {
                    var str = `x${cbJettonMultiple.toString()}???`;
                    this._seats[wAddJettonUser].setCallOrXiaZhu(true, str, true);
                };

            }

            if (wAddJettonUser == 0) {
                this._opreate.set_xz_node(false);
                this.setLabelTip(true, ULanHelper.WAIT_O_XIA_ZHU);
            }
        }
        this._canGetCmd = true;

    }

    /**???????????? */
    chooseBankerComplete(dwBankerUser) {
        //???????????????????????????
        if (dwBankerUser != null && this._seats != null && this._seats[dwBankerUser] != null) {

            this._seats[dwBankerUser].setCallOrXiaZhu(false);

            this._music.playZhuang(this._seats[dwBankerUser].sex);

            var self = this;
            // this.scheduleOnce(() => {
            //?????????????????? ?????????????????????
            if (AppGame.ins.sgModel.selfRealSeatId != AppGame.ins.sgModel.bankerChairId) {
                self._opreate.intoSelfturn("xia_zhu");
            }
            self._iswait = false;
            self._canGetCmd = true;
            // }, 1.5)

        }
    }
    /**
     * @description ??????????????????
     */
    hideSeat() {
        for (let k in this._seats) {
            let seat = this._seats[k];
            seat.free();
        }
    }

    //#region scene event
    /************* scene event *****************/
    private onGameSceneFree(data: any) {
        this.sceneHideUi();
        var dCellScore = data.cellScore;//????????????
        this._match.show();
        this.setDiZhu(dCellScore)
    }

    private onGameSceneCall(data1: any) {
        this.sceneHideUi();
        var data = data1["dt"];
        var onrounds = data1["playerStatus"];
        var call_banker_temp = data1["call_banker"];
        var dCellScore = data.cellScore; //??????
        var cbTimeLeave = data.timeLeave;  //

        UDebug.Log("call:" + JSON.stringify(data1));


        this.setDiZhu(dCellScore);

        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                element.setCallOrXiaZhu(false);

                if (onrounds != null && onrounds[key] != null && onrounds[key] == 1) {
                    element.onRound = true;
                }
            }
        }
        this.doshowPai(null);
        this._canGetCmd = true;
        this._opreate.set_qz_node(true);//????????????
        //??????
        if (call_banker_temp != null || call_banker_temp.length <= 0) {
            for (let i = 0; i < call_banker_temp.length; i++) {
                const element = call_banker_temp[i];
                element["disconnected"] = true;
                this.call_banker(element);
            }
        }
        this._opreate.set_xz_node(false);

        if (cbTimeLeave != null) {
            this.update_turn_time(cbTimeLeave);
        }

    }
    private onGameSceneScore(data1: any) {
        this.sceneHideUi();
        var data = data1["dt"];
        // this._wait.active = false;
        var onrounds = data1["playerStatus"];
        var call_banker_temp = data1["call_banker"];
        var call_banker_result_temp = data1["call_banker_result"];
        var xia_zhu_temp = data1["xia_zhu"];//[]

        UDebug.Log("score:" + JSON.stringify(data1));
        var dCellScore = data.cellScore; //??????
        var cbTimeLeave = data.timeLeave;  //????????????

        this.setDiZhu(dCellScore);

        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                element.setCallOrXiaZhu(false);

                if (onrounds != null && onrounds[key] != null && onrounds[key] == 1) {
                    element.onRound = true;
                }
            }
        }
        this.doshowPai(null);
        this._canGetCmd = true;

        //??????
        if (call_banker_temp != null) {
            // this.call_banker(call_banker_temp);
        }
        //????????????
        if (call_banker_result_temp != null) {
            call_banker_result_temp["disconnected"] = true;
            if (cbTimeLeave > 1) {
                var beidatas = call_banker_result_temp.beidatas;//????????????
                var dwBankerUser = call_banker_result_temp.dwBankerUser;//??????????????? ??????????????????
                this._opreate.updateXiazhuBtns(beidatas, beidatas.length);
                this.chooseBankerComplete(dwBankerUser);
            }
            this.call_banker_result(call_banker_result_temp);

        }
        this._opreate.set_qz_node(false);//????????????
        //????????????
        if (xia_zhu_temp != null) {
            for (let i = 0; i < xia_zhu_temp.length; i++) {
                const element = xia_zhu_temp[i];
                this.xia_zhu(element);
            }
        }


        if (cbTimeLeave != null)
            this.update_turn_time(cbTimeLeave);
    }

    onGameSceneEnd(data1: any) {
        this.sceneHideUi();
        var data = data1["dt"];
        var onrounds = data["playerStatus"];
        var call_banker_result_temp = data1["call_banker_result"];
        var xia_zhu_temp = data1["xia_zhu"];//[]
        var fa_pai = data1["ts_fapai"];
        var look_pai = data1["look_pai"];//[]
        var dCellScore = data.cellScore; //??????
        let gameEndData = data1.gameEndData; //??????????????????

        this.setDiZhu(dCellScore);

        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                element.setCallOrXiaZhu(false);

                if (onrounds != null && onrounds[key] != null && onrounds[key] == 1) {
                    element.onRound = true;
                }
            }
        }
        this.doshowPai(null);
        this._canGetCmd = true;
        // //????????????
        if (call_banker_result_temp != null) {
            call_banker_result_temp["disconnected"] = true;
            this.call_banker_result(call_banker_result_temp);
        }

        // //????????????
        if (xia_zhu_temp != null) {
            for (let i = 0; i < xia_zhu_temp.length; i++) {
                const element = xia_zhu_temp[i];
                this.xia_zhu(element);
            }
        }


        //??????
        if (fa_pai != null) {
            let cardData: [] = data.cardData;
            let chairId = data.user["chairId"];
            let card = cardData.splice(chairId * 3, 3);
            let d = {
                sendCard: card,
                openTime: 0,
                isSee: fa_pai.isSee,
            }
            this.ts_fapai(d);
        }

        //????????????
        if (look_pai != null) {
            for (let i = 0; i < look_pai.length; i++) {
                const element = look_pai[i];
                element["isEnd"] = true;
                this.look_pai(element);
            }
        }
        let statics = gameEndData.statics;
        for (const key in statics) {
            if (statics.hasOwnProperty(key)) {
                let element = statics[key];
                let pl = this._seats[element.seatId];
                if (pl != null) {
                    let userId = this._seats[key]._userId;
                    var battleplayer = AppGame.ins.sgModel._battleplayer[userId];
                    if (battleplayer && battleplayer.playStatus) {
                        pl.setScore(element.lastscore);
                        pl.result(element.iswin, element.getScore, 0, 0);
                    }
                }
                // if (element.uipoker) pl.fanpai(element.uipoker);
            }
        }

        // this.waitbattle()
        // UDebug.Log("????????????" + data.cellScore)

    }

    private onGameSceneOpen(data1: any) {
        this.sceneHideUi();
        var data = data1["dt"];
        var onrounds = data1["playerStatus"];
        var call_banker_temp = data1["call_banker"];
        var call_banker_result_temp = data1["call_banker_result"];
        var xia_zhu_temp = data1["xia_zhu"];//[]
        var fa_pai = data1["ts_fapai"];
        var look_pai = data1["look_pai"];//[]
        var dCellScore = data.cellScore; //??????
        var cbTimeLeave = data.timeLeave;//????????????

        UDebug.Log("open:" + JSON.stringify(data1));

        this.setDiZhu(dCellScore);

        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                element.setCallOrXiaZhu(false);

                if (onrounds != null && onrounds[key] != null && onrounds[key] == 1) {
                    element.onRound = true;
                }
            }
        }

        this.doshowPai(null);
        this._canGetCmd = true;

        // //??????
        if (call_banker_temp != null) {
            // this.call_banker(call_banker_temp);
        }
        // //????????????
        if (call_banker_result_temp != null) {
            call_banker_result_temp["disconnected"] = true;
            this.call_banker_result(call_banker_result_temp);
        }

        // //????????????
        if (xia_zhu_temp != null) {
            for (let i = 0; i < xia_zhu_temp.length; i++) {
                const element = xia_zhu_temp[i];
                this.xia_zhu(element);
            }
        }
        this._opreate.set_qz_node(false);//????????????
        this._opreate.set_xz_node(false);
        this._opreate.hideall();
        //??????
        if (fa_pai != null) {
            let cardData: [] = data.cardData;
            let chairId = data.user["chairId"];
            let card = cardData.splice(chairId * 3, 3);
            let d = {
                sendCard: card,
                openTime: cbTimeLeave,
                isSee: fa_pai.isSee,
            }
            this.ts_fapai(d);
        }

        //????????????
        if (look_pai != null) {
            for (let i = 0; i < look_pai.length; i++) {
                const element = look_pai[i];
                this.look_pai(element);
            }
        }

        if (cbTimeLeave != null && cbTimeLeave > 0)
            this.update_turn_time(cbTimeLeave);
    }
    protected doshowPai(caller: any): void {
        this.pushcmd("do_showpai", caller, false);
    }


    private do_no_in_game() {
        this._opreate.fromeDisconnect(true);
        //#region ????????????
        this._opreate.set_seepai_node(false);
        this._opreate.set_qz_node(false);//????????????
        this._opreate.set_xz_node(false);

        this._cmds = [];
        this._canGetCmd = true;

        this.unscheduleAllCallbacks();
        if (this._win_Ani) {
            this._win_Ani.unscheduleAllCallbacks();
        }
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                if (element.seatId == 0) {
                    element.showbaseInfo(AppGame.ins.sgModel.getshowselfinfo());
                } else
                    element.free();
            }
        }

        if (this._coinFlyHelper) {
            this._coinFlyHelper.resetAll();
        }

        this.showgameinfo(false);
        this._match.hide();

        AppGame.ins.sgModel.setReconnectState(ESGState.Wait, true);
        this._opreate.showMatch();
        UDebug.log("sg no in game");

    }
    private set_left(): void {
        this._cmds = [];
    }
    protected reconnect_in_game_but_no_in_gaming(): void {
        super.reconnect_in_game_but_no_in_gaming();

        // var index = 1;
        if (!this._cmds) {
            // index = 0;
            this._cmds = [];
        }

        if (this._match) {
            this._match.hide();
        }

        if (this._cmds.length <= 0) {
            this._canGetCmd = true;
        }

        this._cmds = [];
        // this._cmds.push(item);
        this.pushcmd("no_in_game", 0, true);

    }

    /**????????????????????? */
    private onMoveNextCmd() {
        this._canGetCmd = true;

        this._iswait = false;
        this._opreate.intoSelfturn("call_banker");
    }
    /**???????????? */
    private onRoomId(roomId: any) {
        if (this._bianhao && roomId != null) {
            this._bianhao.node.active = true;
            this.sg_pjbg.active = true;

            this._bianhao.string = ULanHelper.GAME_NUMBER + roomId;
        }
    }

    private onNextExit(data: any) {
        this._opreate.onNextExit(data);
    }

    /**
     * ??????????????????
     * @param b ????????????
     * @param str ????????????
     */
    setLabelTip(b: boolean, str?: string) {
        this._tipLabel.node.parent.active = b;
        if (str != null) {
            this._tipLabel.string = str;
        }
    }

    /**???????????? */
    playClick() {
        this._music.playClick();
    }
    /**???????????? */
    playWin() {
        this._music.playWin();
    }


    // start() {
    // onLoad() {
    //     this.addEvent();
    // }
    onEnable() {
        super.onEnable();
        this.addEvent();
    }
    onDisable() {
        super.onDisable();

        this.removeEvent();
        this._music.stop();
    }
    // onDestroy() {
    //     this.removeEvent();
    // }

    /**
     * @description ????????????
     */
    onChat() {
        AppGame.ins.showUI(ECommonUI.UI_CHAT_HY);
    };

    private addEvent(): void {
        AppGame.ins.sgModel.on(USGHelper.SG_EVENT.SG_GAMESCENE_FREE, this.onGameSceneFree, this);
        AppGame.ins.sgModel.on(USGHelper.SG_EVENT.SG_GAMESCENE_CALL, this.onGameSceneCall, this);
        AppGame.ins.sgModel.on(USGHelper.SG_EVENT.SG_GAMESCENE_SCORE, this.onGameSceneScore, this);
        AppGame.ins.sgModel.on(USGHelper.SG_EVENT.SG_GAMESCENE_OPEN, this.onGameSceneOpen, this);
        AppGame.ins.sgModel.on(USGHelper.SG_EVENT.SG_GAMESCENE_END, this.onGameSceneEnd, this);

        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_SC_TS_GAME_START, this.game_start, this);
        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_SC_TS_CALL_BANKER, this.call_banker, this);
        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_SC_TZ_CALL_BANKER_RESULT, this.call_banker_result, this);
        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_SC_CZ_PUT_OUT_CHIP, this.xia_zhu, this);
        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_SC_TS_FAPAI, this.ts_fapai, this);
        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_SC_TS_LOOK_PAI, this.look_pai, this);
        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_SC_TS_GAME_END, this.game_end, this);

        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_CHOOSE_BANKER_COMPLETE, this.chooseBankerComplete, this);
        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_MOVE_NEXT_CMD, this.onMoveNextCmd, this);
        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_UPDATE_ROOMID, this.onRoomId, this);

        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_SC_TS_UPDATA_TOTAL_PLAYER_SCORE, this.sc_ts_updata_total_player_score, this);
        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_SC_TS_UPDATA_TOTAL_SCORE, this.sc_ts_updata_total_score, this);

        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_SC_TS_UPDATE_TURN_TIME, this.update_turn_time, this);

        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_SC_TS_START_MATCH, this.sc_ts_start_match, this);
        // AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT., this.sc_ts_show_match, this);
        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_SC_TS_CANCLE_MATCH, this.set_cancle_match, this);
        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.QZNN_NEXT_EXIT, this.onNextExit, this);
        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_SC_TS_LEFT, this.set_left, this);

        AppGame.ins.sgModel.on(USGHelper.SG_SELF_EVENT.SG_CC_UPDATA_SEAT_INFO, this.onUpdatePlayers, this);
        AppGame.ins.sgModel.on(USGHelper.SG_EVENT.SG_HIDE_SEAT, this.hideSeat, this);
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.sgModel.run();

    }
    /**
     * @description ??????????????????
     */
    sceneHideUi() {
        AppGame.ins.closeUI(ECommonUI.UI_GAME_MIPAI);
        this._opreate.set_seepai_node(false);
        this._opreate.set_qz_node(false);//????????????
        this._opreate.set_xz_node(false);
        this._opreate.hideall();
        this.node.stopAllActions();
        this._match.hide();
        this.setLabelTip(false);
        this.unscheduleAllCallbacks();
        if (this._coinFlyHelper) {
            this._coinFlyHelper.resetAll();
        }
        this.setTongAni(false);
        this._ksyxAni.setCompleteListener(() => {
        });
        for (const key in this._seats) {
            if (this._seats.hasOwnProperty(key)) {
                const element = this._seats[key];
                element.clear();
            }
        }
    }

    /**
     * ?????????????????????
     * @param isHide ??????????????????
     */

    onGameToBack(isBack: boolean) {
        if (!isBack) {
            this._opreate.fromeDisconnect(true);
            //#region ????????????
            this._canGetCmd = false;
            this._cmds.length = 0;
            this._cmds = [];
            this._iswait = false;
            this.sceneHideUi();
            if (this._win_Ani) {
                this._win_Ani.unscheduleAllCallbacks();
            }
            this.showgameinfo(false);
            this._canGetCmd = true;
            AppGame.ins.sgModel.setReconnectState(ESGState.Wait, true, true);
            AppGame.ins.sgModel.sendFreshGameScene();
        } else {
            this.sceneHideUi();
        }
    }

    private removeEvent(): void {
        AppGame.ins.sgModel.off(USGHelper.SG_EVENT.SG_GAMESCENE_FREE, this.onGameSceneFree, this);
        AppGame.ins.sgModel.off(USGHelper.SG_EVENT.SG_GAMESCENE_CALL, this.onGameSceneCall, this);
        AppGame.ins.sgModel.off(USGHelper.SG_EVENT.SG_GAMESCENE_SCORE, this.onGameSceneScore, this);
        AppGame.ins.sgModel.off(USGHelper.SG_EVENT.SG_GAMESCENE_OPEN, this.onGameSceneOpen, this);
        AppGame.ins.sgModel.off(USGHelper.SG_EVENT.SG_GAMESCENE_END, this.onGameSceneEnd, this);

        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_SC_TS_GAME_START, this.game_start, this);
        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_SC_TS_CALL_BANKER, this.call_banker, this);
        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_SC_TZ_CALL_BANKER_RESULT, this.call_banker_result, this);
        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_SC_CZ_PUT_OUT_CHIP, this.xia_zhu, this);
        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_SC_TS_FAPAI, this.ts_fapai, this);
        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_SC_TS_LOOK_PAI, this.look_pai, this);
        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_SC_TS_GAME_END, this.game_end, this);

        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_CHOOSE_BANKER_COMPLETE, this.chooseBankerComplete, this);
        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_MOVE_NEXT_CMD, this.onMoveNextCmd, this);
        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_UPDATE_ROOMID, this.onRoomId, this);

        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_SC_TS_UPDATA_TOTAL_PLAYER_SCORE, this.sc_ts_updata_total_player_score, this);
        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_SC_TS_UPDATA_TOTAL_SCORE, this.sc_ts_updata_total_score, this);

        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_SC_TS_UPDATE_TURN_TIME, this.update_turn_time, this);

        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_SC_TS_START_MATCH, this.sc_ts_start_match, this);
        // AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT., this.sc_ts_show_match, this);
        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_SC_TS_CANCLE_MATCH, this.set_cancle_match, this);
        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.QZNN_NEXT_EXIT, this.onNextExit, this);

        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_SC_TS_LEFT, this.set_left, this);
        AppGame.ins.sgModel.off(USGHelper.SG_SELF_EVENT.SG_CC_UPDATA_SEAT_INFO, this.onUpdatePlayers, this);
        AppGame.ins.sgModel.off(USGHelper.SG_EVENT.SG_HIDE_SEAT, this.hideSeat, this);
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.sgModel.exit();
    }


    private onUpdatePlayers(data: any) {
        if (data == null) return;
        let count: number = 0;
        for (const key in data) {
            if (data.hasOwnProperty(key)) {

                const element = data[key];
                let seadId = AppGame.ins.sgModel.getUISeatId(element.chairId);
                if (!element.isExit && element.playStatus >= 0 && seadId != null) {
                    this._seats[seadId].bind(element)
                    count++;
                } else {
                    UDebug.Log("????????????" + data)
                    delete data[key];
                    this._seats[seadId].free()
                }
            }
        };
        if (count == 1 && AppGame.ins.sgModel._state == ESGState.Match) {
            // this.waitbattle();
        };
    }



    //#endregion
}
