
export class chargeitem {
    type: number;
    url: string;
    charges: Array<number>;
}

var cfg_charge: { [key: string]: chargeitem } = {
    [0]: {
        type: 0,
        url: "www.baidu.com",
        charges: [200, 300, 500, 800, 1000, 2000, 3000, 4000]
    },
    [1]: {
        type: 1,
        url: "www.baidu.com",
        charges: [200, 300, 500, 800, 1000, 2000, 3000, 4000]
    },
    [2]: {
        type: 2,
        url: "www.baidu.com",
        charges: [200, 300, 500, 800, 1000, 2000, 3000, 4000]
    },
    [3]: {
        type: 3,
        url: "www.baidu.com",
        charges: [200, 300, 500, 800, 1000, 2000, 3000, 4000]
    }
}
export default cfg_charge;
