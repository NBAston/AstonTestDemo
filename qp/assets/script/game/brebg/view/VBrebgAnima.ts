import UBrebgMusic from "../UBrebgMusic";
import UDebug from "../../../common/utility/UDebug";
import { Ebg } from "../../../common/cmd/proto";
import USpriteFrames from "../../../common/base/USpriteFrames";
import UNodeHelper from "../../../common/utility/UNodeHelper";


/**
 * 创建： 朱武
 * 作用： 二八杠动画层
 */


const { ccclass, property } = cc._decorator;

@ccclass
export default class VBrebgAnima extends cc.Component {

    @property(sp.Skeleton)  // 色子摇晃动画
    spine_dice: sp.Skeleton = null;

    @property(cc.Node)      // 色子1
    node_dice1: cc.Node = null;

    @property(cc.Node)      // 色子2
    node_dice2: cc.Node = null;

    @property(sp.Skeleton)
    spine_wall: sp.Skeleton = null;


    @property(cc.SpriteAtlas)
    atlas_desk: cc.SpriteAtlas = null;

    @property(sp.Skeleton)
    spine_start_stop: sp.Skeleton = null;

    @property(sp.Skeleton)
    spine_all_win: sp.Skeleton = null;

    @property(sp.Skeleton)
    spine_all_lose: sp.Skeleton = null;

    @property([cc.Node])
    node_cards: cc.Node[] = [];

    @property(cc.Node)
    node_wall: cc.Node = null;

    @property([cc.Node])
    node_results: cc.Node[] = [];

    @property(cc.Node)
    node_action: cc.Node = null;

    @property(cc.Node)
    node_desk: cc.Node = null;


    _spframe: USpriteFrames = null;

    _is_load: boolean = false;

    _dice_1: number = 1;
    _dice_2: number = 2;

    _wallcards: cc.Node[][] = [];
    _node_cards: cc.Node[][] = [];
    _start_rect: number = 0;   // 0 庄   ，1顺  2天  3地

    _card_group: number[] = [];
    _card_type: number[] = [];
    _rect_winindex: boolean[] = [];   //0顺 1天  2地
    _music_mgr: UBrebgMusic = null;


    _cards_group: Ebg.ICardGroup[] = [];


    start() {

        this.init();
        this._is_load = true;

        

        this.spine_dice.setEventListener((event: TrackEvent, data: any) => {
            switch (data.data.name) {
                case 'show1':
                    {
                        this.playDiceShow(this._dice_1, this._dice_2);
                        break;
                    }
                case 'show2':
                    {
                        // this.playResult(1,3,false);
                        this.playDiceMove(this._dice_1, this._dice_2);
                        break;
                    }
            }
            UDebug.Log('aaaaaaaaaa');
        })

        this.spine_start_stop.setCompleteListener((event: any) => {
            this.spine_start_stop.node.active = false;
            if (event.animation.name == 'stop') {
                this.openCard(true);
            }

        })


        this.spine_wall.setCompleteListener((event) => {

            UDebug.Log('bbbb');

            this.playSendCard();
        });


        this.spine_all_lose.setCompleteListener((event:any)=> {
            this.spine_all_lose.node.active = false;
        });

        this.spine_all_win.setCompleteListener((event:any)=> {
            this.spine_all_win.node.active = false;
        });


        this.node_wall.active = false;
        // this.clearAllAnima();
    }

    setMusicMgr(music_mgr: UBrebgMusic) {
        this._music_mgr = music_mgr;
    }


    init() {
        this._spframe = UNodeHelper.getComponent(this.node, '', USpriteFrames);
        this._wallcards = [];
        this._node_cards = [];
        for (let i = 0; i < 4; i++) {
            var node1 = this.node_wall.getChildByName('sp_' + i + '_1');
            var node2 = this.node_wall.getChildByName('sp_' + i + '_2');
            node1['const_x'] = node1.x;
            node1['const_y'] = node1.y;
            node2['const_x'] = node2.x;
            node2['const_y'] = node2.y;
            node1['const_scale'] = node1.scale;
            node2['const_scale'] = node2.scale;
            this._wallcards[i] = [];
            this._wallcards[i][1] = node1;
            this._wallcards[i][2] = node2;

            this._node_cards[i] = [];
            var card1 = this.node_desk.getChildByName('node_card_' + i + '_1');
            var card2 = this.node_desk.getChildByName('node_card_' + i + '_2');
            this._node_cards[i][1] = card1;
            this._node_cards[i][2] = card2;
            var card_spine1 = card1.getComponent(sp.Skeleton);
            var card_spine2 = card2.getComponent(sp.Skeleton);
            card_spine1["anima_name"] = "card_b";
            card_spine2["anima_name"] = "card_b";

        }

    }

    onLoad() {

        UDebug.Log('aaaaaa');
    }


    setDiceValue(dice_1: number, dice_2: number) {

        if (dice_1 <= 0 || dice_2 >= 7) {
            UDebug.Log('色子点数不对：' + dice_1 + ' , ' + dice_2);
            return;
        }
        this._dice_1 = dice_1;
        this._dice_2 = dice_2;

        var sum_dice = dice_1 + dice_2;
        var dir_index = sum_dice % 4;
        dir_index == 0 ? dir_index = 4 : dir_index = dir_index;
        dir_index -= 1;

        this._start_rect = dir_index;
    }


    // setCardValue(value: number[]) {
    //     this._card_group = value;
    // }

    setCardGroup(cards: Ebg.ICardGroup[]) {

        this._cards_group = cards;
    }

    setWinTag(wintag: boolean[]) {
        this._rect_winindex = wintag;
    }    


    /**
     * 设置牌型，输赢
     * @param value 牌型数组   0 庄 ，  1 顺 ，2 天   3 地
     * @param winindex 输赢数组  -1 输   1 赢
     */
    // setCardType(value: number[] , winindex: number[] ) {
    //     this._card_type = value;
    //     this._rect_winindex = winindex;
    // }


    /**
     * 清理动画
     */
    clearAllAnima() {

        if (!this._is_load) {return ;}

        for (const key in this.node_results) {
            if (this.node_results.hasOwnProperty(key)) {
                var node = this.node_results[key];
                node.stopAllActions();
                node.active = false;
            }
        }
        this.spine_start_stop.node.active = false;

        this.spine_all_win.node.active = false;
        this.spine_all_lose.node.active = false;
        this.node_wall.stopAllActions();
        this.node_wall.opacity = 0;

        for (let i = 0; i < 4; i++) {
            var node1 = this._wallcards[i][1];
            var node2 = this._wallcards[i][2];
            node1.x = node1['const_x'];
            node1.y = node1['const_y'];
            node2.x = node2['const_x'];
            node2.y = node2['const_y'];

            node1.scale = node1['const_scale'];
            node2.scale = node2['const_scale'];
            node1.active = true;
            node2.active = true;

            var card1 = this._node_cards[i][1];
            var card2 = this._node_cards[i][2];
            card1.stopAllActions();
            card2.stopAllActions();
            card1.getComponent(sp.Skeleton).setAnimation(0, 'card_b', false);
            card2.getComponent(sp.Skeleton).setAnimation(0, 'card_b', false);
            
            card1.getComponent(sp.Skeleton)['anima_name'] = 'card_b';
            card2.getComponent(sp.Skeleton)['anima_name'] = 'card_b';

            card1.opacity = 0;
            card2.opacity = 0;
        }

        this.spine_dice.node.active = false;

        this.node_dice1.stopAllActions();
        this.node_dice2.stopAllActions();

        this.node_dice1.active = false;
        this.node_dice2.active = false;
    }

    resetOpenCard() {
        this.node_dice1.stopAllActions();
        this.node_dice2.stopAllActions();

        this.node_dice1.active = false;
        this.node_dice2.active = false;

        for (const key in this.node_results) {
            if (this.node_results.hasOwnProperty(key)) {
                var node = this.node_results[key];
                node.stopAllActions();
                node.active = false;
            }
        }
        this.spine_start_stop.node.active = false;

        this.spine_all_win.node.active = false;
        this.spine_all_lose.node.active = false;
        this.node_wall.stopAllActions();
        this.node_wall.opacity = 0;

        this.spine_dice.node.active = false;
        this.spine_wall.node.active = false;
        this.spine_wall.node.stopAllActions();

        for (let i = 0; i < 4; i++) {
            let node1 = this._wallcards[i][1];
            let node2 = this._wallcards[i][2];

            let cur_index = this._start_rect + i
            cur_index = cur_index > 3 ? cur_index - 4 : cur_index;

            let card1 = this._node_cards[cur_index][1];
            let card2 = this._node_cards[cur_index][2];
            card1.opacity = 255;
            card2.opacity = 255;
            card1.active = true;
            card2.active = true;
        }

    }




    /**
     * 播放摇色子动画
     */
    playTrayAnima() {
        this.spine_wall.node.active = false;
        this.node_wall.active = true;
        this.node_wall.opacity = 255;
        for (let i = 0; i < 4; i++) {
            var node1 = this.node_wall.getChildByName('sp_' + i + '_1');
            var node2 = this.node_wall.getChildByName('sp_' + i + '_2');
            node1.opacity = 255;
            node2.opacity = 255;
        }


        this.spine_dice.node.active = true;

        this._music_mgr.playRoll();

        this.spine_dice.setAnimation(0, 'animation', false);
    }

    /**
     * 显示3d色子
     * @param dice_num_1 
     * @param dice_num_2 
     */
    playDiceShow(dice_num_1: number, dice_num_2: number) {
        this.node_dice1.active = true;
        this.node_dice2.active = true;

        this.node_dice1.getComponent(cc.Sprite).spriteFrame = this.atlas_desk.getSpriteFrame('dice1_' + dice_num_1);
        this.node_dice2.getComponent(cc.Sprite).spriteFrame = this.atlas_desk.getSpriteFrame('dice1_' + dice_num_2);

        this.node_dice1.opacity = 0;
        this.node_dice2.opacity = 0;

        this.node_dice1.stopAllActions();
        this.node_dice2.stopAllActions();
        this.node_dice1.runAction(cc.fadeIn(0.2));
        this.node_dice2.runAction(cc.fadeIn(0.2));
    }


    /**
     * 播放色子移动到 庄， 顺，天，地  
     * @param dice_num_1 
     * @param dice_num_2 
     */
    playDiceMove(dice_num_1: number, dice_num_2: number) {

        var new_dice1 = new cc.Node();
        var new_dice2 = new cc.Node();

        var sp_dice1 = new_dice1.addComponent(cc.Sprite);
        var sp_dice2 = new_dice2.addComponent(cc.Sprite);

        sp_dice1.spriteFrame = this.atlas_desk.getSpriteFrame('dice2_' + dice_num_1);
        sp_dice2.spriteFrame = this.atlas_desk.getSpriteFrame('dice2_' + dice_num_2);

        new_dice1.parent = this.node;
        new_dice2.parent = this.node;
        new_dice1.position = this.node_dice1.position;
        new_dice2.position = this.node_dice2.position;

        this.node_dice1.active = false;
        this.node_dice2.active = false;

        var pos = {
            [0]: { x: 0, y: 140 },
            [1]: { x: -270, y: -30 },
            [2]: { x: 0, y: -30 },
            [3]: { x: 270, y: -30 },
        }

        var dir_index = this._start_rect;

        new_dice1.runAction(cc.sequence(cc.moveBy(0.3, pos[dir_index]), cc.delayTime(1), cc.callFunc((node) => {
            node.destroy();
        })));
        new_dice2.runAction(cc.sequence(cc.moveBy(0.3, pos[dir_index]), cc.delayTime(1), cc.callFunc((node) => {
            this.moveCards();
            node.destroy();
        }, this)));
    }


    playStartJetton() {
        this.spine_start_stop.node.active = true;
        this.spine_start_stop.setAnimation(0, 'start', false);
    }

    playStopJetton() {
        this.spine_start_stop.node.active = true;
        this.spine_start_stop.setAnimation(0, 'stop', false);
    }


    /**
     * 播放牌型
     * @param rect 区域
     */
    playResult(rect: number) {
        let node = this.node_results[rect];
        node.active = true;
        var iswin = true;
        // var type = this._card_type[rect];
        var type = this._cards_group[rect].cardType;
        let is_half = false;
        if (type % 10 == 5) {
            is_half = true;
        }
        let t_type = Math.floor(type/10);

        if (this._rect_winindex[rect-1] == false) {
            iswin = false;
        }

        let sp = node.getComponent(cc.Sprite);

        if (iswin) {
            sp.setState(cc.Sprite.State.NORMAL);
        }
        else {
            sp.setState(cc.Sprite.State.GRAY);
        }

        node.active = true;

        node.opacity = 0;
        node.scale = 3.0;
        if (is_half) {
            sp.spriteFrame = this._spframe.getFrames('ebg_result_' + type);
        }else {
            sp.spriteFrame = this.atlas_desk.getSpriteFrame('ebg_result_' + t_type);
        }
        this._music_mgr.playPaiXing(type);
        node.runAction(cc.sequence(cc.spawn(cc.fadeIn(0.1), cc.scaleTo(0.2, 0.9)), cc.scaleTo(0.1, 1)));
    }


    /**
     * 显示牌墙
     * @param is_already_send_card 已经发过牌了
     */
    showWall(is_already_send_card: boolean = true) {
        this.node_wall.active = true;
        this.node_wall.opacity = 255;
        if (is_already_send_card) {

            // for (let i = 0; i < 4; i++) {
            //     var node1 = this.node_wall.getChildByName('sp_' + i + '_1');
            //     var node2 = this.node_wall.getChildByName('sp_' + i + '_2');
            //     node1.opacity = 0;
            //     node2.opacity = 0;
            // }
            this.hideWall(false);
        }else
        {
            for (let i = 0; i < 4; i++) {
                var node1 = this.node_wall.getChildByName('sp_' + i + '_1');
                var node2 = this.node_wall.getChildByName('sp_' + i + '_2');
                node1.opacity = 255;
                node2.opacity = 255;
            }
        }

    }

    hideWall(is_action: boolean = true) {
        if (is_action)
            this.node_wall.runAction(cc.fadeOut(0.2));
        else
            this.node_wall.opacity = 0;
    }

    playWall() {
        this.spine_wall.node.setPosition(new cc.Vec2(0, 0));
        this.spine_wall.node.scale = 1.0;
        this.spine_wall.node.active = true;
        this.node_wall.active = false;
        this.spine_wall.node.stopAllActions();

        this.spine_wall.setAnimation(0, 'animation', false);
    }

    /**
     * 洗牌动画播完之后把牌移动到桌面
     */
    playSendCard() {
        this.spine_wall.node.runAction(cc.sequence(cc.delayTime(0.2), cc.spawn(cc.moveTo(0.3, 260, 140), cc.scaleTo(0.4, 0.57)), cc.callFunc(this.playTrayAnima, this)));
    }


    /**
     * 开牌
     * @param action 是否播放动画
     */
    openCard(action: boolean = false) {

        this.hideWall(true);

    
        this.resetOpenCard();
        // this.playSendCard();

        if (!action) {  // 不播放动画
            // for (let index = 0; index < this._card_group.length; index++) {
            for (let index = 0; index < this._cards_group.length; index++) {
                const element = this._cards_group[index];
                // var rect = Math.floor(index / 2);
                // var card_index = index % 2 + 1;
               
                for (let i=0; i<2; i++) {
                    // let rect = index;
                    // let card_index = i;
                    var card_node = this._node_cards[index][i+1];
                    if (element.cardData[i] && card_node) {
                        let card_num = element.cardData[i];
                        if (card_num == 5) {
                            card_num = 0;
                        }else {
                            card_num = card_num / 10;
                        }
                        card_node.active = true;
                        card_node.opacity = 255;
                        var card_spine = card_node.getComponent(sp.Skeleton);

                        if (card_num >= 0 && card_num < 11) {
                            card_spine['anima_name'] = 'card_' + card_num;
                            card_spine.setAnimation(0, 'card_' + card_num, false);
                        } else {
                            card_spine['anima_name'] = 'card_b';
                            card_spine.setAnimation(0, 'card_b', false);
                        }
                    }
                }

                // var card_node = this._node_cards[rect][card_index];
                
                // if (card_node) {
                //     card_node.active = true;
                //     card_node.opacity = 255;
                //     var card_spine = card_node.getComponent(sp.Skeleton);
  
                //     if (element > 0 && element < 11) {
                //         var card_num = element == 10 ? 0 : element;
                //         card_spine['anima_name'] = 'card_' + card_num;
                //         card_spine.setAnimation(0, 'card_' + card_num, false);
                //     } else {
                //         card_spine['anima_name'] = 'card_b';
                //         card_spine.setAnimation(0, 'card_b', false);
                //     }
                // }
            }
            this._music_mgr.playFanPai();
        } else {
            for (let index = 0; index < this._cards_group.length; index++) {
                // for (let index = 0; index < this._card_group.length; index++) {
                // const element = this._card_group[index];
                const element = this._cards_group[index];


                for (let i=0; i<2; i++) {
                    // let rect = index;
                    // let card_index = i;
                    var card_node = this._node_cards[index][i+1];
                    if (element.cardData[i] && card_node) {
                        // let card_num = element.cardData[i] == 10 ? 0 : element.cardData[i];
                        let card_num = element.cardData[i];
                        if (card_num == 5) {
                            card_num = 0;
                        }else {
                            card_num = card_num / 10;
                        }
                        card_node.active = true;
                        card_node.opacity = 255;
                        let card_spine = card_node.getComponent(sp.Skeleton);
                        card_node['card_index'] = i;
                        card_node['rect'] = index;   
                        if (card_num >= 0 && card_num < 11) {
                            // card_spine['anima_name'] = 'card_' + card_num;
                            // card_spine.setAnimation(0, 'card_' + card_num, false);
                            card_node.stopAllActions();
                            if (card_spine['anima_name'] == 'card_b') {
                                card_node.runAction( cc.sequence( cc.delayTime(index*1) , cc.callFunc((node)=>{
                                    if (node['card_index'] == 1) {
                                        this.playResult(node['rect']);
                                        this._music_mgr.playFanPai();
                                    }
                                    var card_spine = node.getComponent(sp.Skeleton);
                                    card_spine['anima_name'] = 'card_' + card_num;
                                    card_spine.setAnimation(0, 'card_' + card_num, false);
                                },this)));
                            }
                        } else {
                            card_spine['anima_name'] = 'card_b';
                            card_spine.setAnimation(0, 'card_b', false);
                        }
                    }
                }



                // var rect = Math.floor(index / 2);
                // var card_index = index % 2 + 1;
   
                // var card_node = this._node_cards[rect][card_index];
                // card_node['card_index'] = card_index;
                // if (card_node) {
                //     card_node.active = true;
                //     let card_spine = card_node.getComponent(sp.Skeleton);
                //     card_node['rect'] = rect;    
                //     if (element > 0 && element < 11) {
                //         // UDebug.Log(JSON.stringify(card_spine));
                        
                //         if (card_spine['anima_name'] == 'card_b') {
                //             let card_num = element == 10 ? 0 : element;
                            
                //             card_node.stopAllActions();
                    
                //             card_node.runAction( cc.sequence( cc.delayTime(index*0.5) , cc.callFunc((node)=>{
                //                 if (node['card_index'] == 2) {
                //                     this.playResult(node['rect']);
                //                     this._music_mgr.playFanPai();
                //                 }
                                
                //                 card_spine['anima_name'] = 'card_' + card_num;
                //                 card_spine.setAnimation(0, 'card_' + card_num, false);
                //             },this)));
                //         }
                //     } else {
                //         card_spine['anima_name'] = 'card_b';
                //         card_spine.setAnimation(0, 'card_b', false);
                //     }
                // }
            } 
        }
    }

    /**
     * 从牌墙把牌移到 庄顺天地
     */
    moveCards() {

        for (let i = 0; i < 4; i++) {
            let node1 = this._wallcards[i][1];
            let node2 = this._wallcards[i][2];

            let cur_index = this._start_rect + i
            cur_index = cur_index > 3 ? cur_index - 4 : cur_index;

            let card1 = this._node_cards[cur_index][1];
            let card2 = this._node_cards[cur_index][2];

            node1.runAction(cc.sequence(cc.delayTime(0.2 * i), cc.spawn(cc.moveTo(0.1, card1.getPosition()), cc.scaleTo(0.2, 0.9)), cc.callFunc(() => {
                card1.opacity = 255;
                this._music_mgr.playSendCard();
                node1.active = false;
            })));
            node2.runAction(cc.sequence(cc.delayTime(0.2 * i), cc.spawn(cc.moveTo(0.1, card2.getPosition()), cc.scaleTo(0.2, 0.9)), cc.callFunc(() => {
                card2.opacity = 255;
                this._music_mgr.playSendCard();
                node2.active = false;
            })));


            this.scheduleOnce( ()=>{
                this.openCard();
            } , 2);
        }
    }

    playAllWin() {

        this.spine_all_win.node.active = true;
        this.spine_all_win.setAnimation(0 , 'zjts' , false);
    }

    playAllLose() {
        this.spine_all_lose.node.active = true;
        this.spine_all_lose.setAnimation(0 , 'zjtp' , false);
    }




}


