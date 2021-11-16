import { Bcbm } from "../../common/cmd/proto";
import UDebug from "../../common/utility/UDebug";
import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "../../public/base/AppGame";
import BcbmDeskManager from "./BcbmDeskManager";
import MBcbm from "./model/MBcbm";
import {logoCfg} from "../bcbm/cfg_bcbm"
import VbcbmScene from "./VbcbmScene";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BcbmUIManager extends cc.Component {

    private _startPos:{};
    public _startLogo: number;
    private _nextLogo: number;
    private _runStep: number = 0;
    public _endLogo: number;
    private _steps :number = 0;   //需要跑的步数
    private _stopStep :number = 0;   //需要跑的步数
    private _curSteps: number = 0; //已经跑的步数
    public _times: number; //计时器跑的时间
    public _reduceTime: number;
    public _lightInterval: number;
    private _deskNode:cc.Node;
    private _deskManager: BcbmDeskManager;
    private _rootNode: cc.Node;
    private _bcbmScene: VbcbmScene;
    private runOldSoundID: number = -1;
    private _lightBlinkNode: cc.Node;
    private _lightBlinkNodeB: cc.Node;
    private _bcbm_model: MBcbm;

    private _timeLeft: number;
    private _gameEndData: Bcbm.CMD_S_GameEnd;

    //UI
    private _lbTotalScore: cc.Label;
    private _lbGameStatus: cc.Label;
    private _lbGameStatusTime: cc.Label;
    private _lbGameSeriaNum: cc.Label;

    private _lightRunNode1: cc.Node;
    private _lightRunNode2: cc.Node;
    private _lightRunNode3: cc.Node;

    private _lightRunNode1B: cc.Node;
    private _lightRunNode2B: cc.Node;
    private _lightRunNode3B: cc.Node;

    // private _resultLogo :number;

    //delegate
    private recordDelegate: Function;
    private chipFlyDelegate: Function;

    @property(cc.Label) speedLabG: cc.Label = null;
    @property(cc.Label) speedLabS: cc.Label = null;
    @property(cc.Label) speedLabB: cc.Label = null;

    carNode: cc.Node;//车
    speed = 1;
    MaxSpeed = 1800;
    direction = 1;
    pushAddSpeed = 0.01;
    startRun = 0;
    startRunCoin = 0;
    currP = null;
    currAngle = null;
    SHOW_TIME = 0.3;
    MIN_SPEED = 450;
    MIN_DISTANCE_GAP = 30;
    PACCELERATION = 0.07;
    PACCELERATION2 = 0.095;
    CACCELERATION = 0.05;
    isshowlog = 0;
    isOffLineCount = 0;

    onLoad () {
        this._deskNode = UNodeHelper.find(this.node.parent, "node_desk");
        this._deskManager = this._deskNode.getComponent(BcbmDeskManager);
        this._rootNode = UNodeHelper.find(this.node.parent.parent.parent, "sceneRoot");
        this._bcbmScene = this._rootNode.getComponent(VbcbmScene);
        this._lightBlinkNode = this._deskManager.getLightBlinkNode();
        this._lightBlinkNodeB = this._deskManager.getLightBlinkNode2();
        this._times = 0;

        this._endLogo = 0
        this._lbTotalScore = UNodeHelper.getComponent(this.node, "lb_total_bet/lb_total_bet_score", cc.Label);
        this._lbGameStatus = UNodeHelper.getComponent(this.node, "lb_game_status", cc.Label);
        this._lbGameStatusTime = UNodeHelper.getComponent(this.node, "lb_game_status_time", cc.Label);
        this._lbGameSeriaNum = UNodeHelper.getComponent(this.node, "lb_game_seria_num", cc.Label);

        this._lightRunNode1 = UNodeHelper.find(this._deskNode, "node_circle_logo/bcbm_carlogo_light1");
        this._lightRunNode2 = UNodeHelper.find(this._deskNode, "node_circle_logo/bcbm_carlogo_light2");
        this._lightRunNode3 = UNodeHelper.find(this._deskNode, "node_circle_logo/bcbm_carlogo_light3");

        this._lightRunNode1B = UNodeHelper.find(this._deskNode, "node_car/bcbm_carlogo_light1");
        this._lightRunNode2B = UNodeHelper.find(this._deskNode, "node_car/bcbm_carlogo_light2");
        this._lightRunNode3B = UNodeHelper.find(this._deskNode, "node_car/bcbm_carlogo_light3");

        this.initModelEventListener();

        //初始化delegate
        this.setRecordDelegate(this._bcbmScene.setRecord);
        this.setChipFlyDelegate(this._bcbmScene.flyChip);
    }

    start () {
        UDebug.Log("BcbmUIManager:start");
    }

    onDestroy() {
        this.removeModelEventListener();
    }

    private initModelEventListener() {
        this._bcbm_model = AppGame.ins.bcbmModel;
        this._bcbm_model.on(MBcbm.S_GAME_END, this.onGameEnd, this);
        this._bcbm_model.on(MBcbm.OPEN_CARD, this.onOpenCard, this);
        AppGame.ins.bcbmModel.on(MBcbm.TO_BACK_CLEAR, this.toBackClear, this);
    }

    private removeModelEventListener() {
        this._bcbm_model.off(MBcbm.S_GAME_END, this.onGameEnd, this);
        this._bcbm_model.off(MBcbm.OPEN_CARD, this.onOpenCard, this);
        AppGame.ins.bcbmModel.off(MBcbm.TO_BACK_CLEAR, this.toBackClear, this);
        this._bcbm_model.exit();
    }

    setRecordDelegate(delegate: Function) {
        this.recordDelegate = delegate.bind(this._bcbmScene);
    }

    setChipFlyDelegate(delegate: Function) {
        this.chipFlyDelegate = delegate.bind(this._bcbmScene);
    }
    public showCarAndEffect(){
        this.carNode.active = true;
        this._lightBlinkNode.active = true;
        this.carNode.getComponent(sp.Skeleton).setAnimation(0,"stop",true);
    }
    public initCarPos(carIconNum){
        let carDataPostion = {
            0:[25,2,8,13,19],
            1:[23,1,6,12,18],
            2:[22,27,5,11,16],
            3:[0,14],
            4:[21,7],
            5:[24,10],
            6:[3,17],
            7:[26,4,9,15,20],
        }
        this._nextLogo = carDataPostion[carIconNum][0];
        this._runStep = Number(this._nextLogo + "");
        let carPos = this._deskManager._lightPos3[this._nextLogo];
        this.carNode.x = carPos.x;
        this.carNode.y = carPos.y;

        this._lightBlinkNode.active = true;
        let pmqPos = this._deskManager._lightPos[this._nextLogo];
        this._lightBlinkNode.x = pmqPos.x;
        this._lightBlinkNode.y = pmqPos.y;

        let end = (this._nextLogo + 1) >= this._deskManager._lightPos3a.length ? 0 : (this._nextLogo + 1);
        this.carNode.angle = this.getTrackingAngle(this._deskManager._lightPos3a[end],this.carNode.position);

        this._lightRunNode1.active = false;
        this._lightRunNode2.active = false;
        this._lightRunNode3.active = false;
        this._lightRunNode1B.active = false;
        this._lightRunNode2B.active = false;
        this._lightRunNode3B.active = false;

        this._runStep = 0;
    }
    //开始运行
    public run(time) {
        // this.isOffLineCount = time == 16 ? 0 : time;
        // if(this.isOffLineCount == 0 && time != 0){
            let n = this._bcbmScene.node_car_icon.getChildByName("bcbm_icons"+this._nextLogo);
            if(n){
                let nlab = n.getChildByName("lab").getComponent(cc.Label).string;
                n.getComponent(sp.Skeleton).setAnimation(0,nlab+"_normal",true);
            }
            this._startLogo = this.getStartLogo();
            this._nextLogo = this.getStartLogo();
            n = this._bcbmScene.node_car_icon.getChildByName("bcbm_icons"+this._nextLogo);
            if(n){
                let nlab = n.getChildByName("lab").getComponent(cc.Label).string;
                n.getComponent(sp.Skeleton).setAnimation(0,nlab+"_normal",true);
            }
            this._curSteps = 1;
            this._lightInterval = 1/18;
            this._times = 0;
            this.direction = 1;
            this.ligthtRun(this._startLogo, this._endLogo);
            this.startRunCoin = 0;
            this.pushAddSpeed = 0.01;
            this._lightBlinkNode.stopAllActions();
            this._lightBlinkNode.color = cc.color(255,255,255,255*0.3);
            //打开车灯
            this._bcbmScene.vbcbm_animamgr.showCardLight(true)
            this.startRun = 1;
        // }else{
        //     this.carNode.active = false;
        //     this.carNode.getComponent(sp.Skeleton).setAnimation(0,"run",false);
        // }
    }

    ligthtRun(startLogo :number, endLogo: number) :void{
        if(startLogo!=undefined && endLogo!=undefined) {
            this._startLogo = startLogo;
            this._steps = this.getSteps(startLogo, endLogo);
            let c = Math.random() * 100;
            if(c > 33 && c < 66){
                this._stopStep = 9;
            }else if (c > 66 && c < 99){
                this._stopStep = 8;
            }else if (c < 33){
                this._stopStep = 7;
            }
            this.runOldSoundID = this._bcbmScene._music_mgr.playRunUp()

            this.carNode.getComponent(sp.Skeleton).setCompleteListener((event) => {
                if(this._steps > 10){
                    this.carNode.getComponent(sp.Skeleton).setAnimation(0,"run",true);
                }
            });
            this.carNode.getComponent(sp.Skeleton).setAnimation(0,"accelerate",false);
        }
        return;
    }

    getSteps(startLogo: number, endLogo: number) :number{
        let steps : number = 0;
        if(startLogo <= endLogo) {
            //跑三圈
            steps = 28*3 + (endLogo - startLogo);
        } else {
            //跑四圈
            steps = 28*3 + ( + endLogo - startLogo);
        }
        return steps;
    }
    slowDown(){
        // if(this.direction != -1){
        //     this.pushAddSpeed = 0.01;
        //     this.direction = -1;
        // }
    }
    //汽车运动
    stopRun(bcbm_icons:number){
        this.isshowlog = 0;
        this.speedLabG.string = "0";
        this.speedLabS.string = "0";
        this.speedLabB.string = "0";
        this.startRun = 0;
        this.startRunCoin = 0;
        this.speed = 1;
        this.MaxSpeed = 1800;
        this.direction = 1;
        this.pushAddSpeed = 0;

        this._lightBlinkNode.stopAllActions();
        this._lightBlinkNode.runAction(cc.repeat(
            cc.sequence(
                cc.fadeTo(this.SHOW_TIME,255),cc.fadeTo(this.SHOW_TIME,255*0.3),cc.fadeTo(this.SHOW_TIME,255),
                cc.fadeTo(this.SHOW_TIME,255),cc.fadeTo(this.SHOW_TIME,255*0.3),cc.fadeTo(this.SHOW_TIME,255)
            ), 5)
        );
        this.carNode.getComponent(sp.Skeleton).setAnimation(0,"stop",true);
        let n = this._bcbmScene.node_car_icon.getChildByName("bcbm_icons"+bcbm_icons);
        let nlab = n.getChildByName("lab").getComponent(cc.Label).string;
        n.getComponent(sp.Skeleton).setAnimation(0,nlab+"_win",true);
        //关闭车灯
        this._bcbmScene.vbcbm_animamgr.showCardLight(false)
        //闪烁中奖
        this._bcbmScene.showWinTag(this._bcbmScene._winTag);
        //中奖动动画
        this._bcbmScene.vbcbm_animamgr.showReward(this._bcbmScene._winTag)
    }

    update(dt: number) {
        if(this.isOffLineCount > 0){
            this.isOffLineCount -= dt;
            if(this.isOffLineCount <= 3) {
                this.isOffLineCount = 0;
                this.carNode.active = false;
                //飞筹码
                // if(this._gameEndData && this._gameEndData.deskData){
                //     this._bcbmScene.flyChip(this._gameEndData.deskData.winTag);
                // }
                this._lightBlinkNode.active = false;
                this._lightRunNode1.active = false;
                this._lightRunNode2.active = false;
                this._lightRunNode3.active = false;
                this._lightRunNode1B.active = false;
                this._lightRunNode2B.active = false;
                this._lightRunNode3B.active = false;
                // //插入历史数据
                // this.insetRecord();
                // //中奖动动画
                // this._bcbmScene.vbcbm_animamgr.showReward(this._gameEndData.deskData.winTag);
                return;
            }
        }
        if(this.startRun != 1 || this._steps < 0){
            return
        }
        this.currP = this._deskManager._lightAllPos[this._runStep];
        this.currAngle = this.getTrackingAngle(this.currP,this.carNode.position);
        let checkX = -1;
        if(this.currP){
            checkX = Math.abs(Math.ceil(this.currP.x) - Math.ceil(this.carNode.x));
        }
        let checkY = -1;
        if(this.currP){
            checkY = Math.abs(Math.ceil(this.currP.y) - Math.ceil(this.carNode.y));
        }
        let isArrive = checkX != -1 && checkY != -1 && checkX <= this.MIN_DISTANCE_GAP && checkY <= this.MIN_DISTANCE_GAP;
        if(this._steps == 2 && this.isshowlog == 0){
            this.isshowlog = 1;
        }
        if(!isArrive && this.currP != null){
            if(this.direction == 0){
                this.speed -= this.pushAddSpeed;
                if(this.speed < 150){
                    if(this._steps > 0){
                        this.speed = 150;
                    }
                }
                if(this.speed < 0){
                    if(this._steps <= 0){
                        this.speed = 0;
                    }else{
                        this.speed = 150;
                    }
                }
                this.pushAddSpeed += this.PACCELERATION2;
            }else if(this.direction == 1){
                this.speed += this.pushAddSpeed;
                if(this.speed > this.MaxSpeed){
                    this.speed = this.MaxSpeed;
                }
                this.pushAddSpeed += this.PACCELERATION;
            }
            this.setSpeedNumber(Math.ceil(this.speed/5.5).toString());

            if(this._steps > 0){
                this.carNode.active = true;
                this.carNode.angle = this.currAngle;
                this.carNode.x += dt * this.speed * Math.cos(this.carNode.angle / 180 * Math.PI);
                this.carNode.y += dt * this.speed * Math.sin(this.carNode.angle / 180 * Math.PI);
            }
            this.runHoesLight(dt);
            let ex = Math.abs(Math.ceil(this.currP.x) - Math.ceil(this.carNode.x));
            let ey = Math.abs(Math.ceil(this.currP.y) - Math.ceil(this.carNode.y));
            if(this._steps == 38 && this.direction != 0){
                this.pushAddSpeed = 0.01;
                this.direction = 0;
            }
            if( ex <= this.MIN_DISTANCE_GAP && ey <= this.MIN_DISTANCE_GAP){
                this.onArrive(dt);
            }
        }else{
            if(checkX <= this.MIN_DISTANCE_GAP && checkY <= this.MIN_DISTANCE_GAP){
                this.onArrive(dt);
            }
        }
    }

    runHoesLight(dt){
        this.startRunCoin++;
        if(this.startRunCoin > 0){
            this._lightBlinkNode.x = this._deskManager._lightPos[this._nextLogo].x;
            this._lightBlinkNode.y = this._deskManager._lightPos[this._nextLogo].y;
            this._lightBlinkNodeB.x = this._deskManager._lightPos2[this._nextLogo].x;
            this._lightBlinkNodeB.y = this._deskManager._lightPos2[this._nextLogo].y;
        }else{
            this._lightBlinkNode.angle = this.getTrackingAngle(this._deskManager._lightPos[this._nextLogo],this._lightBlinkNode.position);
            this._lightBlinkNodeB.angle = this.getTrackingAngle(this._deskManager._lightPos2[this._nextLogo],this._lightBlinkNodeB.position);

            this._lightBlinkNode.x += dt * this.speed * Math.cos(this._lightBlinkNode.angle / 180 * Math.PI);
            this._lightBlinkNode.y += dt * this.speed * Math.sin(this._lightBlinkNode.angle / 180 * Math.PI);

            this._lightBlinkNodeB.x += dt * this.speed * Math.cos(this._lightBlinkNodeB.angle / 180 * Math.PI);
            this._lightBlinkNodeB.y += dt * this.speed * Math.sin(this._lightBlinkNodeB.angle / 180 * Math.PI);
        }
        //尾灯
        if (this._steps > 4){
            if (this._curSteps > 1){
                let id = this._nextLogo-1
                if ( id < 0 ) id = id + 28
                this._lightRunNode1.setPosition( this._deskManager._lightPos[id]);
                this._lightRunNode1.active = true;
                this._lightRunNode1B.setPosition( this._deskManager._lightPos2[id]);
                this._lightRunNode1B.active = true;

                if (this._curSteps > 2){
                    id = this._nextLogo-2
                    if ( id < 0 ) id = id + 28
                    this._lightRunNode2.setPosition( this._deskManager._lightPos[id]);
                    this._lightRunNode2.active = true;
                    this._lightRunNode2B.setPosition( this._deskManager._lightPos2[id]);
                    this._lightRunNode2B.active = true;
                }

                if (this._curSteps > 3){
                    id = this._nextLogo-3
                    if ( id < 0 ) id = id + 28
                    this._lightRunNode3.setPosition( this._deskManager._lightPos[id]);
                    this._lightRunNode3.active = true;
                    this._lightRunNode3B.setPosition( this._deskManager._lightPos2[id]);
                    this._lightRunNode3B.active = true;
                }
            }
        }
        else{
            this._lightRunNode1.active = false;
            this._lightRunNode2.active = false;
            this._lightRunNode3.active = false;
            this._lightRunNode1B.active = false;
            this._lightRunNode2B.active = false;
            this._lightRunNode3B.active = false;
        }
    }

    //前后台切换
    toBackClear(){
        this._lightBlinkNode.active = false;
        this._lightRunNode1.active = false;
        this._lightRunNode2.active = false;
        this._lightRunNode3.active = false;
        this._lightRunNode1B.active = false;
        this._lightRunNode2B.active = false;
        this._lightRunNode3B.active = false;
        this.carNode.getComponent(sp.Skeleton).setAnimation(0,"stop",false);
        this.carNode.active = false;
        this.isshowlog = 0;
        this.speedLabG.string = "0";
        this.speedLabS.string = "0";
        this.speedLabB.string = "0";
        this.startRun = 0;
        this.startRunCoin = 0;
        this.speed = 1;
        this.MaxSpeed = 1800;
        this.direction = 1;
        this.pushAddSpeed = 0;
        this._steps = -1;
        this.currP = null;
    }

    onArrive(dt){
        switch (this._stopStep){
            case 9 :
                if(this._steps < 4){//降速3
                    this.slowDown();
                }
                break
            case 8 :
                if(this._steps < 5){//降速4
                    this.slowDown();
                }
                break
            case 7 :
                if(this._steps < 6){//降速5
                    this.slowDown();
                }
                break
        }

        this._runStep++;
        if(this._runStep >= this._deskManager._lightAllPos.length){
            this._runStep = 0;
        }
        let isNext = this._runStep % 6;
        if(isNext == 0){
            this._steps --;
            this._curSteps ++;
            if(this._nextLogo>=0 && this._nextLogo <27) {
                this._nextLogo ++;
            } else if(this._nextLogo == 27){
                this._nextLogo = 0;
            }
        }

        this.runHoesLight(dt);
        let curr = Number("" + (this._nextLogo));
        if(curr<0){
            curr = 27;
        }

        if((this._stopStep == 7 || this._stopStep == 8 || this._stopStep == 9) && this._steps == 4){
            cc.audioEngine.stop(this.runOldSoundID);
            this._bcbmScene._music_mgr.playRunDown();
            this.carNode.getComponent(sp.Skeleton).setAnimation(0,"slow_down",false);
        }
        if((this._stopStep == 7 || this._stopStep == 8 || this._stopStep == 9) && this._steps == 3){
            cc.audioEngine.stop(this.runOldSoundID);
            this._bcbmScene._music_mgr.playRunDown()
        }
        if((this._stopStep == 7 ||this._stopStep == 8 || this._stopStep == 9) && this._steps == 2){
            cc.audioEngine.stop(this.runOldSoundID);
            this._bcbmScene._music_mgr.playRunDown()
        }
        if(this._steps == 1){
            cc.audioEngine.stop(this.runOldSoundID);
            this._bcbmScene._music_mgr.playRunDown()
        }
        if(this._steps == 0){
            this.speed = 0;
            cc.audioEngine.stop(this.runOldSoundID);
            //暂时关闭音效
            this._bcbmScene._music_mgr.playRunDown()
            this.carNode.stopAllActions();
            this.setSpeedNumber(Math.ceil(this.speed/5.5).toString());
            let end = (this._nextLogo + 1) >= this._deskManager._lightPos3a.length ? 0 : (this._nextLogo + 1);
            this.carNode.angle = this.getTrackingAngle(this._deskManager._lightPos3a[end],this.carNode.position);
            this.carNode.runAction(cc.sequence(
                cc.moveTo(0.2,this._deskManager._lightPos3[curr]),cc.callFunc(()=>{
                    this.setSpeedNumber(Math.ceil(this.speed/5.5).toString());
                    this._lightBlinkNode.x = this._deskManager._lightPos[curr].x;
                    this._lightBlinkNode.y = this._deskManager._lightPos[curr].y;
                    this._lightBlinkNodeB.x = this._deskManager._lightPos[curr].x;
                    this._lightBlinkNodeB.y = this._deskManager._lightPos[curr].y;
                })
                , cc.callFunc(()=>{
                    this.setSpeedNumber(Math.ceil(this.speed/5.5).toString());
                    let end = (this._nextLogo + 1) >= this._deskManager._lightPos3a.length ? 0 : (this._nextLogo + 1);
                    this.carNode.angle = this.getTrackingAngle(this._deskManager._lightPos3a[end],this.carNode.position);
            }), cc.delayTime(0.1),cc.callFunc(()=>{
                this.setSpeedNumber(Math.ceil(this.speed/5.5).toString());
                //飞筹码
                // if(this._gameEndData && this._gameEndData.deskData){
                //     // this.chipFlyDelegate(this._gameEndData.deskData.winTag);
                //     this._bcbmScene.flyChip(this._gameEndData.deskData.winTag);
                // }
                this.stopRun(curr);
                //插入历史数据
                this.insetRecord();
            })));
        }
    }

    setSpeedNumber(showSpeed){
        switch (showSpeed.length){
            case 1 :
                this.speedLabG.string = showSpeed.charAt(0) + "";
                this.speedLabS.string = "0";
                this.speedLabB.string = "0";
                break;
            case 2 :
                this.speedLabG.string = showSpeed.charAt(1) + "";
                this.speedLabS.string = showSpeed.charAt(0) + "";
                this.speedLabB.string =  "0";
                break;
            case 3 :
                this.speedLabG.string = showSpeed.charAt(2) + "";
                this.speedLabS.string = showSpeed.charAt(1) + "";
                this.speedLabB.string = showSpeed.charAt(0) + "";
                break;
        }
    }
    //获取追踪角度 【targetPos：追踪目标，currPoint：当前目标】
    getTrackingAngle(targetPos,currPoint){
        return Math.atan2(targetPos.y - currPoint.y, targetPos.x - currPoint.x) * 180 / Math.PI;
    }

    numFix2(num: number) {
        return Math.ceil(num);
    }

    getStartLogo() :number{
        let length = this._deskManager._lightPos.length;
        const GAP = 3;
        for (let index = 0; index < length; index++) {
            const element = this._deskManager._lightPos[index];
            let absX = Number(Math.abs(element.x - this._lightBlinkNode.x).toFixed(0));
            let absY = Number(Math.abs(element.y - this._lightBlinkNode.y).toFixed(0));
            if(absX <= GAP && absY <= GAP) {
                return index;
            }
        }
    }

    getNumberFix2(num: number) :number{
        return Number(num.toFixed(2))
    }


    getLogoIdWithIndex(rstIndex: number) :number{
        for (let index = 0; index < logoCfg.length; index++) {
            const element = logoCfg[index];
            for (let index1 = 0; index1 < element.length; index1++) {
                const element1 = element[index1];
                if(element1 == rstIndex) {
                    return index;
                }
            }
        }
    }

    insetRecord() {
        this.recordDelegate();
    }

    onGameEnd(data: Bcbm.CMD_S_GameEnd) {
        //UDebug.log('BcbmUIManager:onGameEnd' + data);
        this._gameEndData = data;
        // this._endLogo = data.winIndex;

        this._bcbmScene.flyChip(this._gameEndData.deskData.winTag);
        //插入历史数据
        this.insetRecord();
        //中奖动动画
        // this._bcbmScene.vbcbm_animamgr.showReward(this._gameEndData.deskData.winTag);
    }

    onOpenCard(data: Bcbm.CMD_S_OpenCard) {
        UDebug.log('BcbmUIManager:onOpenCard' + data.winIndex);
        this._endLogo = data.winIndex;
    }
    
}