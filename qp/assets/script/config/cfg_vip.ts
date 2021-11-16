
/**版本信息 */

export class cfg_vipitem {
    lv: number;
    awards:number;
    chargeNum:number;
    frames: Array<number>;
    desc:Array<string>
}
var cfg_vip: { [key: number]: cfg_vipitem } =
{
    [0]: {
        lv: 0,
        awards:0,
        frames: [0, 1],
        chargeNum:0,
        desc:[
            "专属头像框",
            "敬请期待"
        ]
    }, [1]: {
        lv: 1,
        awards:2,
        frames: [0, 1, 2],
        chargeNum:100,
        desc:[
            "专属头像框",
            "敬请期待"
        ]
    }, [2]: {
        lv: 2,
        awards:3,
        frames: [0, 1, 2, 3],
        chargeNum:200,
        desc:[
            "专属头像框",
            "敬请期待"
        ]
    }, [3]: {
        lv: 3,
        awards:4,
        frames: [0, 1, 2, 3, 4],
        chargeNum:400,
        desc:[
            "专属头像框",
            "敬请期待"
        ]
    }, [4]: {
        lv: 4,
        awards:5,
        frames: [0, 1, 2, 3, 4, 5],
        chargeNum:600,
        desc:[
            "专属头像框",
            "敬请期待"
        ]
    }, [5]: {
        lv: 5,
        awards:6,
        frames: [0, 1, 2, 3, 4,5, 6],
        chargeNum:800,
        desc:[
            "专属头像框",
            "敬请期待"
        ]
    }, [6]: {
        lv: 6,
        awards:7,
        frames: [0, 1, 2, 3, 4, 5, 6, 7],
        chargeNum:1000,
        desc:[
            "专属头像框",
            "敬请期待"
        ]
    }
}
export default cfg_vip;
