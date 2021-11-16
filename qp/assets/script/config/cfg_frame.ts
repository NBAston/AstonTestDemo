

/**
 * 头像
 */
export class frameitem {
    id: number;
    url: string;
    name: string;
    toplab:string;
    bottomlab:string;
}
var cfg_frame: { [key: number]: frameitem } = {
    [0]: {
        id: 0,
        url: "common/texture/frame/frame_0",
        name: "头像框1",
        toplab: "平民百姓",
        bottomlab: "游客",
    },[1]: {
        id: 1,
        url: "common/texture/frame/frame_1",
        name: "头像框1",
        toplab: "小康生活",
        bottomlab: "新用户",
    },[2]: {
        id: 2,
        url: "common/texture/frame/frame_2",
        name: "头像框2",
        toplab: "小富小贵",
        bottomlab: "VIP1专属",
    },[3]: {
        id: 3,
        url: "common/texture/frame/frame_3",
        name: "头像框3",
        toplab: "财运亨通",
        bottomlab: "VIP2专属",
    },[4]: {
        id: 4,
        url: "common/texture/frame/frame_4",
        name: "头像框4",
        toplab: "荣华富贵",
        bottomlab: "VIP3专属",
    },[5]: {
        id: 5,
        url: "common/texture/frame/frame_5",
        name: "头像框5",
        toplab: "堆金积玉",
        bottomlab: "VIP4专属",
    },[6]: {
        id: 6,
        url: "common/texture/frame/frame_6",
        name: "头像框6",
        toplab: "富甲一方",
        bottomlab: "VIP5专属",
    },[7]: {
        id: 7,
        url: "common/texture/frame/frame_7",
        name: "头像框7",
        toplab: "富可敌国",
        bottomlab: "VIP6专属",
    },
    
}
export default cfg_frame;
