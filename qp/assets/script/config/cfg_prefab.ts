
/**
 * 创建:gj
 * 作用:用于资源的配置
 */

/**
 *资源配置节点 
 */
export class res_prefab {
    /**
     * 资源名字
     */
    resname: string;
    /**
     * 资源地址
     */
    url: string;
    /**
     * 资源类型
     */
    type: Function;
}

var cfg_res: { [key: string]: res_prefab } = {
    ["msgbox"]: {
        resname: "msgbox",
        url: "common/hall/prefab/ui_msgbox",
        type: cc.Prefab
    },
    ["room_ddz"]: {
        resname: "ddz_room",
        url: "prefab/ddz_room",
        type: cc.Prefab
    },
    ["room_pdk"]: {
        resname: "pdk_room",
        url: "prefab/pdk_room",
        type: cc.Prefab
    },
    ["room_bjl"]: {
        resname: "bjl_room",
        url: "prefab/bjl_room",
        type: cc.Prefab
    },
    ["bjl_ludan"]: {
        resname: "bjl_ludan",
        url: "prefab/bjl_ludan",
        type: cc.Prefab
    },
    ["room_zjh"]: {
        resname: "room_zjh",
        url: "game/zjh/prefab/zjh_room",
        type: cc.Prefab
    },
    ["ui_zjh_help"]: {
        resname: "ui_zjh_help",
        url: "game/zjh/prefab/zjh_help",
        type: cc.Prefab
    },
    ["ui_records"]: {
        resname: "ui_records",
        url: "common/hall/prefab/ui_records",
        type: cc.Prefab
    },
    ["zjh_setting"]: {
        resname: "zjh_setting",
        url: "prefab/game/zjh/zjh_setting",
        type: cc.Prefab
    },
    ["ui_qznn_menu"]: {
        resname: "ui_qznn_menu",
        url: "prefab/game/qznn/qznnMenuNode",
        type: cc.Prefab
    },
    ["ui_qznn_help"]: {
        resname: "ui_qznn_help",
        url: "game/xpqznn/prefab/xp_qznnHelpNode",
        type: cc.Prefab
    },
    ["ui_head"]: {
        resname: "ui_head",
        url: "common/hall/prefab/ui_head",
        type: cc.Prefab
    },
    ["ui_image_from"]: {
        resname: "ui_image_from",
        url: "common/hall/prefab/ui_image_from",
        type: cc.Prefab
    },
    ["ui_mail_detail"]: {
        resname: "ui_mail_detail",
        url: "common/hall/prefab/ui_mail_detail",
        type: cc.Prefab
    },
    ["ui_setting"]: {
        resname: "ui_setting",
        url: "common/hall/prefab/ui_setting",
        type: cc.Prefab
    },
    ["ui_qznn_sm"]: {
        resname: "ui_qznn_sm",
        url: "prefab/game/qznn/qznn_sm_node",
        type: cc.Prefab
    },
    ["ui_qznn_tip"]: {
        resname: "ui_qznn_tip",
        url: "prefab/game/qznn/qznnTipNode",
        type: cc.Prefab
    },
    ["room_qznn"]: {
        resname: "qznn_room",
        url: "prefab/qznn_room",
        type: cc.Prefab
    },
    ["room_xpqznn"]: {
        resname: "xp_qznn_room",
        url: "prefab/xp_qznn_room",
        type: cc.Prefab
    },
    ["ui_qznn_records"]: {
        resname: "ui_qznn_records",
        url: "prefab/game/qznn/qznn_records",
        type: cc.Prefab
    },
    ["ui_qznn_px"]: {
        resname: "ui_qznn_px",
        url: "prefab/game/qznn/qznnPXNode",
        type: cc.Prefab
    },
    ["ui_qznn_setting"]: {
        resname: "ui_qznn_setting",
        url: "prefab/game/qznn/qznnSettingNode",
        type: cc.Prefab
    },
    ["ui_qznn_fankui"]: {
        resname: "ui_qznn_fankui",
        url: "prefab/game/qznn/qznnFanKuiNode",
        type: cc.Prefab
    },
    ["brlh_room"]: {
        resname: "brlh_room",
        url: "prefab/brlh_room",
        type: cc.Prefab
    },
    ["brlh_help"]: {
        resname: "brlh_help",
        url: "brlh/prefab/brlh_help",
        type: cc.Prefab
    },
    ["brlh_records"]: {
        resname: "brlh_records",
        url: "prefab/game/brlh/brlh_records",
        type: cc.Prefab
    },
    ["brlh_setting"]: {
        resname: "brlh_setting",
        url: "prefab/game/brlh/brlh_setting",
        type: cc.Prefab
    },
    ["brlh_feedback"]: {
        resname: "brlh_feedback",
        url: "prefab/game/brlh/brlh_feedback",
        type: cc.Prefab
    },
    ["brlh_ludan"]: {
        resname: "brlh_ludan",
        url: "prefab/brlh_ludan",
        type: cc.Prefab
    },
    ["sg_room"]: {
        resname: "sg_room",
        url: "prefab/sg_room",
        type: cc.Prefab
    },
    ["sg_help"]: {
        resname: "sg_help",
        url: "sg/prefab/sg_help",
        type: cc.Prefab
    },
    ["sg_records"]: {
        resname: "sg_records",
        url: "prefab/game/sg/sg_records",
        type: cc.Prefab
    },
    ["blackjack_room"]: {
        resname: "blackjack_room",
        url: "prefab/blackjack_room",
        type: cc.Prefab
    },
    ["blackjack_help"]: {
        resname: "blackjack_help",
        url: "blackjack/prefab/blackjack_help",
        type: cc.Prefab
    },
    ["blackjack_records"]: {
        resname: "blackjack_records",
        url: "prefab/game/blackjack/blackjack_records",
        type: cc.Prefab
    },
    ["sss_room"]: {
        resname: "ui_errorlog",
        url: "prefab/sss_room",
        type: cc.Prefab
    },
    ["brnn_room"]: {
        resname: "brnn_room",
        url: "prefab/brnn_room",
        type: cc.Prefab
    },
    ["brnn_help"]: {
        resname: "brnn_help",
        url: "prefab/brnn_help",
        type: cc.Prefab
    },
    ["brnn_records"]: {
        resname: "brnn_records",
        url: "prefab/game/brnn/brnn_records",
        type: cc.Prefab
    },
    ["brnn_ludan"]: {
        resname: "brnn_ludan",
        url: "prefab/brnn_ludan",
        type: cc.Prefab
    },
    ["brebg_room"]: {
        resname: "brebg_room",
        url: "prefab/brebg_room",
        type: cc.Prefab
    },
    ["brebg_help"]: {
        resname: "brebg_help",
        url: "brebg/prefab/brebg_help",
        type: cc.Prefab
    },
    ["brebg_records"]: {
        resname: "brebg_records",
        url: "prefab/game/brebg/brebg_records",
        type: cc.Prefab
    },
    ["brebg_ludan"]: {
        resname: "brebg_ludan",
        url: "prefab/brebg_ludan",
        type: cc.Prefab
    },
    ["wrhh_room"]: {
        resname: "wrhh_room",
        url: "prefab/wrhh_room",
        type: cc.Prefab
    },
    ["wrhh_help"]: {
        resname: "wrhh_help",
        url: "prefab/wrhh_help",
        type: cc.Prefab
    },
    ["wrhh_records"]: {
        resname: "wrhh_records",
        url: "prefab/game/wrhh/wrhh_records",
        type: cc.Prefab
    },
    ["wrhh_ludan"]: {
        resname: "wrhh_ludan",
        url: "prefab/wrhh_ludan",
        type: cc.Prefab
    },
    ["ui_personal"]: {
        resname: "ui_personal",
        url: "common/hall/prefab/ui_personal",
        type: cc.Prefab
    },
    ["ui_rename"]: {
        resname: "ui_rename",
        url: "common/hall/prefab/ui_rename",
        type: cc.Prefab
    },
    ["ui_regester"]: {
        resname: "ui_regester",
        url: "common/hall/prefab/ui_regester",
        type: cc.Prefab
    },
    ["ui_bank"]: {
        resname: "ui_bank",
        url: "common/hall/prefab/ui_bank",
        type: cc.Prefab
    },
    ["ui_service_mail"]: {
        resname: "ui_service_mail",
        url: "common/hall/prefab/ui_service_mail",
        type: cc.Prefab
    },
    ["ui_chat"]: {
        resname: "ui_chat",
        url: "common/hall/prefab/ui_chat",
        type: cc.Prefab
    },
    ["ui_bank_record"]: {
        resname: "ui_bank_record",
        url: "common/hall/prefab/ui_bank_record",
        type: cc.Prefab
    },
    ["ui_exchange"]: {
        resname: "ui_exchange",
        url: "common/hall/prefab/ui_exchange",
        type: cc.Prefab
    },
    ["ui_bindali"]: {
        resname: "ui_bindali",
        url: "common/hall/prefab/ui_bindali",
        type: cc.Prefab
    },
    ["ui_bindbank"]: {
        resname: "ui_bindbank",
        url: "common/hall/prefab/ui_bindbank",
        type: cc.Prefab
    },
    ["ui_new_msgbox"]: {
        resname: "ui_new_msgbox",
        url: "common/hall/prefab/ui_new_msgbox",
        type: cc.Prefab
    },
    ["ui_regesterpopu"]: {
        resname: "ui_regesterpopu",
        url: "common/hall/prefab/ui_regesterpopu",
        type: cc.Prefab
    },
    ["ui_rank"]: {
        resname: "ui_rank",
        url: "common/hall/prefab/ui_rank",
        type: cc.Prefab
    },
    ["ui_announce"]: {
        resname: "ui_announce",
        url: "common/hall/prefab/ui_announce",
        type: cc.Prefab
    },
    ["ui_charge"]: {
        resname: "ui_charge",
        url: "common/hall/prefab/ui_charge",
        type: cc.Prefab
    },
    ["CommVillage"]: {
        resname: "CommVillage",
        url: "common/prefab/CommVillage",
        type: cc.Prefab
    },
    ["CarryingAmount"]: {
        resname: "CarryingAmount",
        url: "common/prefab/CarryingAmount",
        type: cc.Prefab
    },
    ["ui_announcedetail"]: {
        resname: "ui_announcedetail",
        url: "common/hall/prefab/ui_announcedetail",
        type: cc.Prefab
    },
    ["ui_vip"]: {
        resname: "ui_vip",
        url: "common/hall/prefab/ui_vip",
        type: cc.Prefab
    },
    ["ui_proxy"]: {
        resname: "ui_proxy",
        url: "common/hall/prefab/ui_proxy",
        type: cc.Prefab
    },
    ["ui_transfer"]: {
        resname: "ui_transfer",
        url: "common/hall/prefab/ui_transfer",
        type: cc.Prefab
    },
    ["ui_transfer_pop"]: {
        resname: "ui_transfer_pop",
        url: "common/hall/prefab/ui_transfer_pop",
        type: cc.Prefab
    },
    ["ui_select_poster"]: {
        resname: "ui_select_poster",
        url: "common/hall/prefab/ui_select_poster",
        type: cc.Prefab
    },
    ["ui_set_commission"]: {
        resname: "ui_set_commission",
        url: "common/hall/prefab/ui_set_commission",
        type: cc.Prefab
    },
    ["ui_commission_contribution"]: {
        resname: "ui_commission_contribution",
        url: "common/hall/prefab/ui_commission_contribution",
        type: cc.Prefab
    },
    ["ui_chargerecord"]: {
        resname: "ui_chargerecord",
        url: "common/hall/prefab/ui_chargerecord",
        type: cc.Prefab
    },
    ["ui_exchargerecord"]: {
        resname: "ui_proxy",
        url: "common/hall/prefab/ui_exchargerecord",
        type: cc.Prefab
    },
    ["ui_withdraw_commission"]: {
        resname: "ui_withdraw_commission",
        url: "common/hall/prefab/ui_withdraw_commission",
        type: cc.Prefab
    },
    ["ui_performance_query"]: {
        resname: "ui_performance_query",
        url: "common/hall/prefab/ui_performance_query",
        type: cc.Prefab
    },
    // ["ui_setting_game"]: {
    //     resname: "ui_setting_game",
    //     url: "common/hall/prefab/ui_setting_game",
    //     type: cc.Prefab
    // },
    ["tbnn_room"]: {
        resname: "tbnn_room",
        url: "prefab/tbnn_room",
        type: cc.Prefab
    },
    ["kpqznn_room"]: {
        resname: "kpqznn_room",
        url: "prefab/kpqznn_room",
        type: cc.Prefab
    },
    ["tbnn_help"]: {
        resname: "tbnn_help",
        url: "tbnn/prefab/tbnnHelpNode",
        type: cc.Prefab
    },
    ["kpqznn_help"]: {
        resname: "kpqznn_help",
        url: "kpqznn/prefab/kpqznn_help",
        type: cc.Prefab
    },
    ["brjh_room"]: {
        resname: "brjh_room",
        url: "prefab/brjh_room",
        type: cc.Prefab
    },
    ["brjh_ludan"]: {
        resname: "brjh_ludan",
        url: "prefab/brjh_ludan",
        type: cc.Prefab
    },
    ["qzjh_room"]: {
        resname: "qzjh_room",
        url: "prefab/qzjh_room",
        type: cc.Prefab
    },
    ["tbjh_room"]: {
        resname: "tbjh_room",
        url: "prefab/tbjh_room",
        type: cc.Prefab
    },
    ["kpqzjh_room"]: {
        resname: "kpqzjh_room",
        url: "prefab/kpqzjh_room",
        type: cc.Prefab
    },
    ["xpjh_room"]: {
        resname: "xpjh_room",
        url: "prefab/xpjh_room",
        type: cc.Prefab
    },
    ["charge_confirm_box"]: {
        resname: "charge_confirm_box",
        url: "common/hall/prefab/charge/charge_confirm_box",
        type: cc.Prefab
    },
    ["charge_cancel_confirm_box"]: {
        resname: "charge_cancel_confirm_box",
        url: "common/hall/prefab/charge/charge_cancel_confirm_box",
        type: cc.Prefab
    },
    ["ui_bind_bank"]: {
        resname: "ui_bind_bank",
        url: "common/hall/prefab/ui_bind_bank",
        type: cc.Prefab
    },
    ["ui_bind_alipay"]: {
        resname: "ui_bind_alipay",
        url: "common/hall/prefab/ui_bind_alipay",
        type: cc.Prefab
    },
    ["ui_bind_usdt"]: {
        resname: "ui_bind_usdt",
        url: "common/hall/prefab/ui_bind_usdt",
        type: cc.Prefab
    },
    ["ui_bind_username"]: {
        resname: "ui_bind_username",
        url: "common/hall/prefab/ui_bind_username",
        type: cc.Prefab
    },
    ["excharge_cancel_bind_box"]: {
        resname: "excharge_cancel_bind_box",
        url: "common/hall/prefab/exchange/excharge_cancel_bind_box",
        type: cc.Prefab
    },
    ["ui_usdt_help"]: {
        resname: "ui_usdt_help",
        url: "common/hall/prefab/ui_usdt_help",
        type: cc.Prefab
    },
    ["ui_charge_order_detail_box"]: {
        resname: "ui_charge_order_detail_box",
        url: "common/hall/prefab/ui_charge_order_detail_box",
        type: cc.Prefab
    },
    //客服 charge
    ["ui_custom_charge"]: {
        resname: "ui_custom_charge",
        url: "common/hall/prefab/custom/ui_custom_charge",
        type: cc.Prefab
    },
    //任务 task
    ["ui_task"]: {
        resname: "ui_task",
        url: "common/hall/prefab/ui_task",
        type: cc.Prefab
    },
    //活动 activity
    ["ui_activity"]: {
        resname: "ui_activity",
        url: "common/hall/prefab/ui_activity",
        type: cc.Prefab
    },
    ["ui_custom_orderList"]: {
        resname: "ui_custom_orderList",
        url: "common/hall/prefab/custom/ui_custom_orderList",
        type: cc.Prefab
    },

    ["ui_custom_exchange_orderList"]: {
        resname: "ui_custom_exchange_orderList",
        url: "common/hall/prefab/custom/ui_custom_exchange_orderList",
        type: cc.Prefab
    },

    ["ui_charge_usdt_qrcode"]: {
        resname: "ui_charge_usdt_qrcode",
        url: "common/hall/prefab/charge/charge_usdt_qrcode",
        type: cc.Prefab
    },

    ["exchange_reject_box"]: {
        resname: "exchange_reject_box",
        url: "common/hall/prefab/exchange/exchange_reject_box",
        type: cc.Prefab
    },


    ["ui_custom_orderInfo"]: {
        resname: "ui_custom_orderInfo",
        url: "common/hall/prefab/custom/ui_custom_orderInfo",
        type: cc.Prefab
    },

    ["ui_mandatory_popup"]: {
        resname: "ui_mandatory_popup",
        url: "common/hall/prefab/ui_mandatory_popup",
        type: cc.Prefab
    },

    ["ui_errorlog"]: {
        resname: "ui_errorlog",
        url: "common/hall/prefab/ui_errorlog",
        type: cc.Prefab
    },

    ["game_bcbm"]: {
        resname: "game_bcbm",
        url: "bcbm",
        type: cc.Prefab
    },
    ["game_bj"]: {
        resname: "game_bj",
        url: "bj",
        type: cc.Prefab
    },
    ["game_brebg"]: {
        resname: "game_brebg",
        url: "brebg",
        type: cc.Prefab
    },
    ["game_brhh"]: {
        resname: "game_brhh",
        url: "brhh",
        type: cc.Prefab
    },
    ["game_brjh"]: {
        resname: "game_brjh",
        url: "brjh",
        type: cc.Prefab
    },
    ["game_brlh"]: {
        resname: "game_brlh",
        url: "brlh",
        type: cc.Prefab
    },
    ["game_brnn"]: {
        resname: "game_brnn",
        url: "brnn",
        type: cc.Prefab
    },
    ["game_ddz"]: {
        resname: "game_ddz",
        url: "ddz",
        type: cc.Prefab
    },
    ["game_ddz_hy"]: {
        resname: "game_ddz_hy",
        url: "ddz_hy",
        type: cc.Prefab
    },
    ["game_kpqzjh"]: {
        resname: "game_kpqzjh",
        url: "kpqzjh",
        type: cc.Prefab
    },
    ["game_kpqznn"]: {
        resname: "game_kpqznn",
        url: "kpqznn",
        type: cc.Prefab
    },
    ["game_pdk"]: {
        resname: "game_pdk",
        url: "pdk",
        type: cc.Prefab
    },
    ["game_qzjh"]: {
        resname: "game_qzjh",
        url: "qzjh",
        type: cc.Prefab
    },
    ["game_qznn"]: {
        resname: "game_qznn",
        url: "qznn",
        type: cc.Prefab
    },
    ["game_sg"]: {
        resname: "game_sg",
        url: "sg",
        type: cc.Prefab
    },
    ["game_sss"]: {
        resname: "game_sss",
        url: "sss",
        type: cc.Prefab
    },
    ["game_tbjh"]: {
        resname: "game_tbjh",
        url: "tbjh",
        type: cc.Prefab
    },
    ["game_tbnn"]: {
        resname: "game_tbnn",
        url: "tbnn",
        type: cc.Prefab
    },
    ["game_xpjh"]: {
        resname: "game_xpjh",
        url: "xpjh",
        type: cc.Prefab
    },
    ["game_xpqznn"]: {
        resname: "game_xpqznn",
        url: "xpqznn",
        type: cc.Prefab
    },
    ["game_zjh"]: {
        resname: "game_zjh",
        url: "game/zjh/zjh",
        type: cc.Prefab
    },
    ["suoha_room"]: {
        resname: "suoha_room",
        url: "prefab/suoha_room",
        type: cc.Prefab
    },
    ["game_suoha"]: {
        resname: "game_suoha",
        url: "suoha",
        type: cc.Prefab
    },
    ["dzpk_room"]: {
        resname: "dzpk_room",
        url: "prefab/dzpk_room",
        type: cc.Prefab
    },
    ["game_dzpk"]: {
        resname: "game_dzpk",
        url: "dzpk",
        type: cc.Prefab
    },
    ["game_tbnn_hy"]: {
        resname: "game_tbnn_hy",
        url: "tbnn_hy",
        type: cc.Prefab
    },
    ["Game_record_tbnn_hy"]: {
        resname: "Game_record_tbnn_hy",
        url: "prefab/record_tbnn_hy",
        type: cc.Prefab
    },
    ["game_kpqznn_hy"]: {
        resname: "game_kpqznn_hy",
        url: "kpqznn_hy",
        type: cc.Prefab
    },
    ["Game_record_kpqznn_hy"]: {
        resname: "Game_record_kpqznn_hy",
        url: "prefab/record_kpqznn_hy",
        type: cc.Prefab
    },
    ["game_zjh_hy"]: {
        resname: "game_zjh_hy",
        url: "zjh_hy",
        type: cc.Prefab
    },
    ["game_pdk_hy"]: {
        resname: "game_pdk_hy",
        url: "pdk_hy",
        type: cc.Prefab
    },
    ["ui_enter_room"]: {
        resname: "ui_enter_room",
        url: "common/hall/prefab/friends/ui_enter_room",
        type: cc.Prefab
    },

    ["ui_create_room_record"]: {
        resname: "ui_create_room_record",
        url: "common/hall/prefab/friends/ui_create_room_record",
        type: cc.Prefab
    },

    ["ui_appointment_record"]: {
        resname: "ui_appointment_record",
        url: "common/hall/prefab/friends/ui_appointment_record",
        type: cc.Prefab
    },
    ["ui_record_detail"]: {
        resname: "ui_record_detail",
        url: "common/hall/prefab/friends/ui_record_detail",
        type: cc.Prefab
    },
    ["ui_creat_room"]: {
        resname: "ui_creat_room",
        url: "common/hall/prefab/friends/ui_creat_room",
        type: cc.Prefab
    },
    ["ui_resource_loading"]: {
        resname: "ui_resource_loading",
        url: "common/hall/prefab/friends/ui_resource_loading",
        type: cc.Prefab
    },
    ["ui_setting_hy"]: {
        resname: "ui_setting_hy",
        url: "common/hall/prefab/friends/ui_setting_hy",
        type: cc.Prefab
    },
    ["ui_real_time_record"]: {
        resname: "ui_real_time_record",
        url: "common/hall/prefab/friends/ui_real_time_record",
        type: cc.Prefab
    },
    ["ui_game_chat_hy"]: {
        resname: "ui_game_chat_hy",
        url: "common/hall/prefab/friends/ui_game_chat_hy",
        type: cc.Prefab
    },
    ["ui_bring_points"]: {
        resname: "ui_bring_points",
        url: "common/hall/prefab/friends/ui_bring_points",
        type: cc.Prefab
    },
    ["game_bjl"]: {
        resname: "game_bjl",
        url: "bjl",
        type: cc.Prefab
    },
    ["ui_shared_hy"]: {
        resname: "ui_shared_hy",
        url: "common/hall/prefab/friends/ui_shared_hy",
        type: cc.Prefab
    },
    ["ui_tip_hy"]: {
        resname: "ui_tip_hy",
        url: "common/hall/prefab/friends/ui_friend_tip_hy",
        type: cc.Prefab
    },
    ["ui_award_roomCard"]: {
        resname: "ui_award_roomCard",
        url: "common/hall/prefab/friends/ui_award_roomCard",
        type: cc.Prefab
    },

    ["club_hall"]: {
        resname: "club_hall",
        url: "common/hall/prefab/club/club_hall",
        type: cc.Prefab
    },

    ["club_join_club"]: {
        resname: "club_join_club",
        url: "common/hall/prefab/club/club_join_club",
        type: cc.Prefab
    },

    ["club_hall_activity"]: {
        resname: "club_hall_activity",
        url: "common/hall/prefab/club/club_hall_activity",
        type: cc.Prefab
    },

    ["ui_create_club"]: {
        resname: "ui_create_club",
        url: "common/hall/prefab/club/ui_create_club",
        type: cc.Prefab
    },

    ["ui_club"]: {
        resname: "ui_club",
        url: "common/hall/prefab/club/myClub/ui_club",
        type: cc.Prefab
    },
    ["club_roominfo"]: {
        resname: "club_roominfo",
        url: "common/hall/prefab/club/club_roominfo",
        type: cc.Prefab
    },
    ["ui_club_absMoney"]: {
        resname: "ui_club_absMoney",
        url: "common/hall/prefab/club/myClub/ui_club_absMoney",
        type: cc.Prefab
    },
    ["ui_up_partner"]: {
        resname: "ui_up_partner",
        url: "common/hall/prefab/club/myClub/ui_up_partner",
        type: cc.Prefab
    },
    ["ui_club_perf_query"]: {
        resname: "ui_club_perf_query",
        url: "common/hall/prefab/club/myClub/ui_club_perf_query",
        type: cc.Prefab
    },
    ["ui_change_scale"]: {
        resname: "ui_change_scale",
        url: "common/hall/prefab/club/ui_change_scale",
        type: cc.Prefab
    },
    ["ui_level_up"]: {
        resname: "ui_level_up",
        url: "common/hall/prefab/club/ui_level_up",
        type: cc.Prefab
    },
    ["ui_change_info"]: {
        resname: "ui_change_info",
        url: "common/hall/prefab/club/ui_change_info",
        type: cc.Prefab
    },
    ["ui_bindWeChatVerify"]: {
        resname: "ui_bindWeChatVerify",
        url: "common/hall/prefab/ui_bindWeChatVerify",
        type: cc.Prefab
    },
    ["ui_game_prop"]: {
        resname: "game_prop",
        url: "common/prefab/game_prop",
        type: cc.Prefab
    },
    ["ui_game_mipai"]: {
        resname: "game_mipai",
        url: "common/prefab/game_mipai",
        type: cc.Prefab
    },
}
export default cfg_res;