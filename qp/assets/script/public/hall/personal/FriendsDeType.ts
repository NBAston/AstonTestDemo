
class friends_Details_type {
    type: number;
};

let FriendDeType: { [key: string]: friends_Details_type } = {
    ["全部类型"]: {
        type: 0,

    },

    ["金币换房卡"]: {
        type: 13,

    },

    ["转出房卡"]: {
        type: 15,

    },

    ["转入房卡"]: {
        type: 14,

    },

    ["消费房卡"]: {
        type: 16,

    },

    ["系统赠送房卡"]: {
        type: 17,

    },


}

export default FriendDeType;