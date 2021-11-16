import { ELevelType } from "../common/base/UAllenum";
/**
 * 创建:gj
 * 作用:场景的配置
 */

export class sceneItem {
    /**
     * 场景的类型
     */
    sceneType: ELevelType;
    /**
     * 场景的名字
     */
    sceneName: string;
    /**
     * 是否自动卸载资源
     */
    autoRelease:boolean;
    /**
     * 加载页背景
     */
    loadingBg: string;
    /**     
     * 加载页背景下标
     */
    loadingBgIdx: number;
}

var cfg_scene: { [key: string]: sceneItem } = {
    [ELevelType.Login]: {
        sceneType: ELevelType.Login,
        sceneName: "login",
        autoRelease:false,
        loadingBg: "",
        loadingBgIdx: -1,
    },
    [ELevelType.Hall]: {
        sceneType: ELevelType.Hall,
        sceneName: "hall",
        autoRelease:false,
        loadingBg: "",
        loadingBgIdx: -1,
    },
    [ELevelType.ZJH]: {
        sceneType: ELevelType.ZJH,
        sceneName: "zjh",
        autoRelease:false,
        loadingBg: "zjh_loading",
        loadingBgIdx: 20,
    },
    [ELevelType.QZNN]: {
        sceneType: ELevelType.QZNN,
        sceneName: "qznn",
        autoRelease:false,
        loadingBg: "qznn_loading",
        loadingBgIdx: 13,
    },
    [ELevelType.XPQZNN]: {
        sceneType: ELevelType.XPQZNN,
        sceneName: "xpqznn",
        autoRelease:false,
        loadingBg: "xpnn_loading",
        loadingBgIdx: 19,
    },
    [ELevelType.BRLH]: {
        sceneType: ELevelType.BRLH,
        sceneName: "brlh",
        autoRelease:false,
        loadingBg: "lhd_loading",
        loadingBgIdx: 11,
    },
    [ELevelType.BJ]: {
        sceneType: ELevelType.BJ,
        sceneName: "bj",
        autoRelease:false,
        loadingBg: "21d_loading",
        loadingBgIdx: 0,
    },
    [ELevelType.BRNN]: {
        sceneType: ELevelType.BRNN,
        sceneName: "brnn",
        autoRelease:false,
        loadingBg: "brnn_loading",
        loadingBgIdx: 4,
    },
    [ELevelType.BRHH]: {
        sceneType: ELevelType.BRHH,
        sceneName: "brhh",
        autoRelease:false,
        loadingBg: "hhdz_loading",
        loadingBgIdx: 8,
    },
    [ELevelType.BREBG]: {
        sceneType: ELevelType.BREBG,
        sceneName: "brebg",
        autoRelease:false,
        loadingBg: "ebg_loading",
        loadingBgIdx: 7,
    },
    [ELevelType.SG]: {
        sceneType: ELevelType.SG,
        sceneName: "sg",
        autoRelease:false,
        loadingBg: "sg_loading",
        loadingBgIdx: 14,
    },[ELevelType.KPQZNN]: {
        sceneType: ELevelType.KPQZNN,
        sceneName: "kpqznn",
        autoRelease:false,
        loadingBg: "kpnn_loading",
        loadingBgIdx: 10,
    },[ELevelType.ZZWZ]: {
        sceneType: ELevelType.ZZWZ,
        sceneName: "zzwz",
        autoRelease:false,
        loadingBg: "",
        loadingBgIdx: -1,
    },[ELevelType.TBNN]: {
        sceneType: ELevelType.TBNN,
        sceneName: "tbnn",
        autoRelease:false,
        loadingBg: "tbnn_loading",
        loadingBgIdx: 18,
    },
    [ELevelType.BRJH]: {
        sceneType: ELevelType.BRJH,
        sceneName: "brjh",
        autoRelease:false,
        loadingBg: "brjh_loading",
        loadingBgIdx: 3,
    },
    [ELevelType.QZJH]: {
        sceneType: ELevelType.QZJH,
        sceneName: "qzjh",
        autoRelease:false,
        loadingBg: "",
        loadingBgIdx: -1,
    },
    [ELevelType.TBJH]: {
        sceneType: ELevelType.TBJH,
        sceneName: "tbjh",
        autoRelease:false,
        loadingBg: "tbjh_loading",
        loadingBgIdx: 17,
    },
    [ELevelType.XPJH]: {
        sceneType: ELevelType.XPJH,
        sceneName: "xpjh",
        autoRelease:false,
        loadingBg: "",
        loadingBgIdx: -1,
    },
    [ELevelType.KPQZJH]: {
        sceneType: ELevelType.KPQZJH,
        sceneName: "kpqzjh",
        autoRelease:false,
        loadingBg: "kpjh_loading",
        loadingBgIdx: 9,
    },
    [ELevelType.BCBM]: {
        sceneType: ELevelType.BCBM,
        sceneName: "bcbm",
        autoRelease:false,
        loadingBg: "bcbm_loading",
        loadingBgIdx: 1,
    },
    [ELevelType.DDZ]: {
        sceneType: ELevelType.DDZ,
        sceneName: "ddz",
        autoRelease:false,
        loadingBg: "ddz_loading",
        loadingBgIdx: 5,
    },
    [ELevelType.PDK]: {
        sceneType: ELevelType.PDK,
        sceneName: "pdk",
        autoRelease:false,
        loadingBg: "pdk_loading",
        loadingBgIdx: 12,
    },
    [ELevelType.SSS]: {
        sceneType: ELevelType.SSS,
        sceneName: "sss",
        autoRelease:false,
        loadingBg: "sss_loading",
        loadingBgIdx: 16,
    },
    [ELevelType.SH]: {
        sceneType: ELevelType.SH,
        sceneName: "sh",
        autoRelease:false,
        loadingBg: "sh_loading",
        loadingBgIdx: 15,
    },
    [ELevelType.DZPK]: {
        sceneType: ELevelType.DZPK,
        sceneName: "dzpk",
        autoRelease:false,
        loadingBg: "dzpk_loading",
        loadingBgIdx: 6,
    },
    [ELevelType.BJL]: {
        sceneType: ELevelType.BJL,
        sceneName: "bjl",
        autoRelease:false,
        loadingBg: "bjl_loading",
        loadingBgIdx: 2,
    },

    [ELevelType.TBNN_HY]: {
        sceneType: ELevelType.TBNN_HY,
        sceneName: "tbnn_hy",
        autoRelease:false,
        loadingBg: "tbnn_loading",
        loadingBgIdx: 18,
    },
    [ELevelType.PDK_HY]: {
        sceneType: ELevelType.PDK_HY,
        sceneName: "pdk_hy",
        autoRelease:false,
        loadingBg: "pdk_loading",
        loadingBgIdx: 12,
    },
    [ELevelType.KPQZNN_HY]: {
        sceneType: ELevelType.KPQZNN_HY,
        sceneName: "kpnn_hy",
        autoRelease:false,
        loadingBg: "kpnn_loading",
        loadingBgIdx: 10,
    },
    [ELevelType.ZJH_HY]: {
        sceneType: ELevelType.ZJH_HY,
        sceneName: "zjh_hy",
        autoRelease:false,
        loadingBg: "zjh_loading",
        loadingBgIdx: 20,
    },
    [ELevelType.DDZ_HY]: {
        sceneType: ELevelType.DDZ_HY,
        sceneName: "ddz_hy",
        autoRelease:false,
        loadingBg: "ddz_loading",
        loadingBgIdx: 5,
    },
}
export default cfg_scene;
