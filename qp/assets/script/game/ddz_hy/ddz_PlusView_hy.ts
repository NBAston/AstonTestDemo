import UNodeHelper from "../../common/utility/UNodeHelper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ddz_PlusView_hy extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _lbBomb:cc.Label;
    private _lbSpring:cc.Label;

    private _lbCommon:cc.Label;
    private _lbLandlord:cc.Label;
    private _lbFarmer:cc.Label;
    private _lbTotal:cc.Label;
    private _lbUser:cc.Label;

    onLoad() {
        this.initView();
    }

    start () {

    }

    initView() {
        this._lbBomb = UNodeHelper.getComponent(this.node, "lb_bomb1", cc.Label);
        this._lbLandlord = UNodeHelper.getComponent(this.node, "lb_landlord1", cc.Label);
        this._lbSpring = UNodeHelper.getComponent(this.node, "lb_spring1", cc.Label);
        this._lbCommon = UNodeHelper.getComponent(this.node, "plus_common", cc.Label);
        this._lbFarmer = UNodeHelper.getComponent(this.node, "plus_farmer", cc.Label);
        this._lbTotal = UNodeHelper.getComponent(this.node, "plus_total", cc.Label);
        this._lbUser = UNodeHelper.getComponent(this.node, "lb_user", cc.Label);
    }

    setBomb(bomb: number) {
        if (bomb&& bomb!=0&&bomb!=1 ) {
            this._lbBomb.string = "x"+bomb;
        } 
    }

    setSpring(spring: number) {
        if (spring&& spring!=0 && spring!=1) {
            this._lbSpring.string = "x"+spring;
        }  
    }

    setCommon(common: number) {
        if (common&& common!=0) {
            this._lbCommon.string = ""+common;
        }  
    }

    setLandlord(landlord: number) {
        if (landlord&& landlord!=0) {
            this._lbLandlord.string = "x"+landlord;
        }  
    }

    setFarmer(farmer: number) {
        if (farmer&& farmer!=0 ) {
            this._lbFarmer.string = "x"+farmer;
        }  
    }

    setTotal(total: number) {
        if (total&& total!=0) {
            this._lbTotal.string = ""+total;
        }  
    }

    setUser(user: number) {
        if (user&& user!=0) {
            this._lbUser.string = ""+user;
        }  
    }

    resetView() {
        this.initView();
        this._lbBomb.string = "---";
        this._lbSpring.string = "---";

        this._lbCommon.string = "1";
        this._lbLandlord.string = "x0";
        this._lbFarmer.string = "x0";
        this._lbTotal.string = "0";
        this._lbUser.string = "";
    }
    // update (dt) {}
}
