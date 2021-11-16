var cfg_subgame = {


    items: [
        { key: 1, type: 1, game_id: 600, name: "blackjack", desc: "" },
        { key: 2, type: 2, game_id: 720, name: "brebg", desc: "" },
        { key: 3, type: 3, game_id: 210, name: "brhh", desc: "" },
        { key: 4, type: 4, game_id: 900, name: "brlh", desc: "" },
        { key: 5, type: 5, game_id: 930, name: "brnn", desc: "" },
        { key: 6, type: 6, game_id: 830, name: "qznn", desc: "" },
        { key: 7, type: 7, game_id: 860, name: "sg", desc: "" },
        { key: 8, type: 8, game_id: 220, name: "zjh", desc: "" },  
        { key: 9, type: 9, game_id: 840, name: "xpqznn", desc: "" },
    ],

    getNameById:{
        [600]:"blackjack",
        [720]:"brebg",
        [210]:"brhh",
        [900]:"brlh",
        [930]:"brnn",
        [830]:"qznn",
        [860]:"sg",
        [220]:"zjh",
        [840]:"xpqznn",
    },

    subNameCheck : {
        [600] :{isCheck:false,isUpdate:false},
        [720] :{isCheck:false,isUpdate:false},
        [210]:{isCheck:false,isUpdate:false},
        [900]:{isCheck:false,isUpdate:false},
        [930]:{isCheck:false,isUpdate:false},
        [830]:{isCheck:false,isUpdate:false},
        [860]:{isCheck:false,isUpdate:false},
        [220]:{isCheck:false,isUpdate:false},
        [840]:{isCheck:false,isUpdate:false},
    },

    /**
     * 查找第一个符合filter的item
     * @param filter
     * @returns {*}
     */
    getItem(filter): any {
        var result = null;
        for (var i = 0; i < cfg_subgame.items.length; ++i) {
            if (filter(cfg_subgame.items[i])) {
                result = cfg_subgame.items[i];
                return result;
            }
        }
        return result;
    },

    /**
     * 查找第一个符合filter的list
     * @param filter
     * @returns {*}
     */
    getItemList(filter):any {
        var list = [];
        cfg_subgame.items.forEach(function (item) {
            if (filter(item)) {
                list.push(item);
            }
        });
        return list;
    }
}
export default cfg_subgame;