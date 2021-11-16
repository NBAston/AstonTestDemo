import { ECommonUI } from "../common/base/UAllenum";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
/**
 * 创建:gj
 * 作用:用于的配置
 */

/**
 *资源配置节点 
 */
export class res_ui {
    /**
     * 资源名字
     */
    uiType: ECommonUI;
    /**
     * 资源名字
     */
    resName: string;
}
var cfg_ui: { [key: string]: res_ui } = {
    [ECommonUI.BJL_Room]: {
        resName: "room_bjl",
        uiType: ECommonUI.BJL_Room
    },
    [ECommonUI.PDK_Room]: {
        resName: "room_pdk",
        uiType: ECommonUI.PDK_Room
    },
    [ECommonUI.DDZ_Room]: {
        resName: "room_ddz",
        uiType: ECommonUI.DDZ_Room
    },
    [ECommonUI.MsgBox]: {
        resName: "msgbox",
        uiType: ECommonUI.MsgBox
    },
    [ECommonUI.ZJH_Room]: {
        resName: "room_zjh",
        uiType: ECommonUI.ZJH_Room
    },
    [ECommonUI.ZJH_Help]: {
        resName: "ui_zjh_help",
        uiType: ECommonUI.ZJH_Help
    },
    [ECommonUI.LB_Record]: {
        resName: "ui_records",
        uiType: ECommonUI.LB_Record
    },
    [ECommonUI.QZNN_Menu]: {
        resName: "ui_qznn_menu",
        uiType: ECommonUI.QZNN_Menu
    },
    [ECommonUI.QZNN_Help]: {
        resName: "ui_qznn_help",
        uiType: ECommonUI.QZNN_Help
    },
    [ECommonUI.LB_Head]: {
        resName: "ui_head",
        uiType: ECommonUI.LB_Head
    },
    [ECommonUI.LB_Head_Image_From]: {
        resName: "ui_image_from",
        uiType: ECommonUI.LB_Head_Image_From
    },

    
    [ECommonUI.LB_Setting]: {
        resName: "ui_setting",
        uiType: ECommonUI.LB_Setting
    },
    [ECommonUI.QZNN_SM]: {
        resName: "ui_qznn_sm",
        uiType: ECommonUI.QZNN_SM
    },
    [ECommonUI.QZNN_Tip]: {
        resName: "ui_qznn_tip",
        uiType: ECommonUI.QZNN_Tip
    },
    [ECommonUI.QZNN_Record]: {
        resName: "ui_qznn_records",
        uiType: ECommonUI.QZNN_Record
    },
    [ECommonUI.QZNN_Room]: {
        resName: "room_qznn",
        uiType: ECommonUI.QZNN_Room
    },
    [ECommonUI.XPQZNN_Room]: {
        resName: "room_xpqznn",
        uiType: ECommonUI.XPQZNN_Room
    },
    [ECommonUI.QZNN_PX]: {
        resName: "ui_qznn_px",
        uiType: ECommonUI.QZNN_PX
    },
    [ECommonUI.QZNN_Setting]: {
        resName: "ui_qznn_setting",
        uiType: ECommonUI.QZNN_Setting
    },
    [ECommonUI.QZNN_FanKui]: {
        resName: "ui_qznn_fankui",
        uiType: ECommonUI.QZNN_FanKui
    },
    [ECommonUI.BRLH_Room]: {
        resName: "brlh_room",
        uiType: ECommonUI.BRLH_Room
    },
    [ECommonUI.BRLH_Help]: {
        resName: "brlh_help",
        uiType: ECommonUI.BRLH_Help
    },
    [ECommonUI.BRLH_Records]: {
        resName: "brlh_records",
        uiType: ECommonUI.BRLH_Records
    },
    [ECommonUI.BRLH_Setting]: {
        resName: "brlh_setting",
        uiType: ECommonUI.BRLH_Setting
    },
    [ECommonUI.BRLH_Feedback]: {
        resName: "brlh_feedback",
        uiType: ECommonUI.BRLH_Feedback
    },
    [ECommonUI.BRLH_Ludan]: {
        resName: "brlh_ludan",
        uiType: ECommonUI.BRLH_Ludan
    },
    [ECommonUI.SG_Room]: {
        resName: "sg_room",
        uiType: ECommonUI.SG_Room
    },
    [ECommonUI.SG_Records]: {
        resName: "sg_records",
        uiType: ECommonUI.SG_Records
    },
    [ECommonUI.SG_Help]: {
        resName: "sg_help",
        uiType: ECommonUI.SG_Help
    },
    [ECommonUI.BJ_Room]: {
        resName: "blackjack_room",
        uiType: ECommonUI.BJ_Room
    },
    [ECommonUI.BJ_Help]: {
        resName: "blackjack_help",
        uiType: ECommonUI.BJ_Help
    },
    [ECommonUI.BJ_Records]: {
        resName: "blackjack_records",
        uiType: ECommonUI.BJ_Records
    },
    [ECommonUI.BRNN_Room]: {
        resName: "brnn_room",
        uiType: ECommonUI.BRNN_Room
    },
    [ECommonUI.BRNN_Help]: {
        resName: "brnn_help",
        uiType: ECommonUI.BRNN_Help
    },
    [ECommonUI.BRNN_Record]: {
        resName: "brnn_records",
        uiType: ECommonUI.BRNN_Record
    },
    [ECommonUI.BRNN_Ludan]: {
        resName: "brnn_ludan",
        uiType: ECommonUI.BRNN_Ludan
    },
    [ECommonUI.BRJH_Ludan]: {
        resName: "brjh_ludan",
        uiType: ECommonUI.BRJH_Ludan
    },
    [ECommonUI.EBG_Room]: {
        resName: "brebg_room",
        uiType: ECommonUI.EBG_Room
    },
    [ECommonUI.EBG_Help]: {
        resName: "brebg_help",
        uiType: ECommonUI.EBG_Help
    },
    [ECommonUI.EBG_Record]: {
        resName: "brebg_records",
        uiType: ECommonUI.EBG_Record
    },
    [ECommonUI.EBG_Ludan]: {
        resName: "brebg_ludan",
        uiType: ECommonUI.EBG_Ludan
    },
    [ECommonUI.BRHH_Room]: {
        resName: "wrhh_room",
        uiType: ECommonUI.BRHH_Room
    },
    [ECommonUI.BRHH_Help]: {
        resName: "wrhh_help",
        uiType: ECommonUI.BRHH_Help
    },
    [ECommonUI.BRHH_Record]: {
        resName: "wrhh_records",
        uiType: ECommonUI.BRHH_Record
    },
    [ECommonUI.BRHH_Ludan]: {
        resName: "wrhh_ludan",
        uiType: ECommonUI.BRHH_Ludan
    },
    [ECommonUI.SSS_Room]: {
        resName: "sss_room",
        uiType: ECommonUI.SSS_Room
    },
    [ECommonUI.LB_Personal]: {
        resName: "ui_personal",
        uiType: ECommonUI.LB_Personal
    },
    [ECommonUI.LB_ReName]: {
        resName: "ui_rename",
        uiType: ECommonUI.LB_ReName
    },
    [ECommonUI.LB_Regester]: {
        resName: "ui_regester",
        uiType: ECommonUI.LB_Regester
    },
    [ECommonUI.LB_Bank]: {
        resName: "ui_bank",
        uiType: ECommonUI.LB_Bank
    },
    [ECommonUI.LB_BANK_RECORD]: {
        resName: "ui_bank_record",
        uiType: ECommonUI.LB_BANK_RECORD
    },

    [ECommonUI.LB_EXCHANGE]: {
        resName: "ui_exchange",
        uiType: ECommonUI.LB_EXCHANGE
    },
    [ECommonUI.LB_BindAli]: {
        resName: "ui_bindali",
        uiType: ECommonUI.LB_BindAli
    },
    [ECommonUI.LB_BindBank]: {
        resName: "ui_bindbank",
        uiType: ECommonUI.LB_BindBank
    },
    // [ECommonUI.LB_ExcAli]: {
    //     resName: "ui_excali",
    //     uiType: ECommonUI.LB_ExcAli
    // },
    // [ECommonUI.LB_ExcBank]: {
    //     resName: "ui_excbank",
    //     uiType: ECommonUI.LB_ExcBank
    // },
    [ECommonUI.NewMsgBox]: {
        resName: "ui_new_msgbox",
        uiType: ECommonUI.NewMsgBox
    },
    [ECommonUI.LB_RegesterPopu]: {
        resName: "ui_regesterpopu",
        uiType: ECommonUI.LB_RegesterPopu
    },
    [ECommonUI.LB_Announce]: {
        resName: "ui_announce",
        uiType: ECommonUI.LB_Announce
    },
    [ECommonUI.LB_AnnounceDetail]: {
        resName: "ui_announcedetail",
        uiType: ECommonUI.LB_AnnounceDetail
    },
    [ECommonUI.LB_Rank]: {
        resName: "ui_rank",
        uiType: ECommonUI.LB_Rank
    },
    [ECommonUI.LB_Charge]: {
        resName: "ui_charge",
        uiType: ECommonUI.LB_Charge
    },
    [ECommonUI.LB_Village]: {
        resName: "CommVillage",
        uiType: ECommonUI.LB_Village
    },
    [ECommonUI.UI_CARRYING]: {
        resName: "CarryingAmount",
        uiType: ECommonUI.UI_CARRYING
    },
    [ECommonUI.LB_VIP]: {
        resName: "ui_vip",
        uiType: ECommonUI.LB_VIP
    },
    [ECommonUI.LB_Service_Mail]: {
        resName: "ui_service_mail",
        uiType: ECommonUI.LB_Service_Mail
    },
    [ECommonUI.LB_Mail_Detail]: {
        resName: "ui_mail_detail",
        uiType: ECommonUI.LB_Mail_Detail
    },
    [ECommonUI.LB_Chat]: {
        resName: "ui_chat",
        uiType: ECommonUI.LB_Chat
    },
    [ECommonUI.LB_SELECT_POSTER]: {
        resName: "ui_select_poster",
        uiType: ECommonUI.LB_SELECT_POSTER
    },
    [ECommonUI.LB_COMMISSION_CONTRIBUTION]: {
        resName: "ui_commission_contribution",
        uiType: ECommonUI.LB_COMMISSION_CONTRIBUTION
    },
    [ECommonUI.LB_SET_COMMISSION]: {
        resName: "ui_set_commission",
        uiType: ECommonUI.LB_SET_COMMISSION
    },
    [ECommonUI.UI_TRANSFER]: {
        resName: "ui_transfer",
        uiType: ECommonUI.UI_TRANSFER
    },
    [ECommonUI.UI_TRANSFER_POP]: {
        resName: "ui_transfer_pop",
        uiType: ECommonUI.UI_TRANSFER_POP,
    },
    [ECommonUI.LB_Proxy]: {
        resName: "ui_proxy",
        uiType: ECommonUI.LB_Proxy
    },
    [ECommonUI.LB_ChargeRecords]: {
        resName: "ui_chargerecord",
        uiType: ECommonUI.LB_ChargeRecords
    },
    [ECommonUI.LB_ExChargeRecords]: {
        resName: "ui_exchargerecord",
        uiType: ECommonUI.LB_ExChargeRecords
    },
    [ECommonUI.LB_WithdrawCommission]: {
        resName: "ui_withdraw_commission",
        uiType: ECommonUI.LB_WithdrawCommission
    },
    [ECommonUI.LB_PerformanceQuery]: {
        resName: "ui_performance_query",
        uiType: ECommonUI.LB_PerformanceQuery
    },
    // [ECommonUI.GM_Setting]: {
    //     resName: "ui_setting_game",
    //     uiType: ECommonUI.GM_Setting
    // },
    [ECommonUI.KPQZNN_Room]: {
        resName: "kpqznn_room",
        uiType: ECommonUI.KPQZNN_Room
    },
    [ECommonUI.TBNN_Room]: {
        resName: "tbnn_room",
        uiType: ECommonUI.TBNN_Room
    },
    [ECommonUI.TBNN_Help]: {
        resName: "tbnn_help",
        uiType: ECommonUI.TBNN_Help
    },
    [ECommonUI.KPQZNN_Help]: {
        resName: "kpqznn_help",
        uiType: ECommonUI.KPQZNN_Help
    },
    [ECommonUI.BRJH_Room]: {
        resName: "brjh_room",
        uiType: ECommonUI.BRJH_Room
    },
    [ECommonUI.QZJH_Room]: {
        resName: "qzjh_room",
        uiType: ECommonUI.QZJH_Room
    },
    [ECommonUI.KPQZJH_Room]: {
        resName: "kpqzjh_room",
        uiType: ECommonUI.KPQZJH_Room
    },
    [ECommonUI.TBJH_Room]: {
        resName: "tbjh_room",
        uiType: ECommonUI.TBJH_Room
    },
    [ECommonUI.TBJH_Record]: {
        resName: "ui_records",
        uiType: ECommonUI.TBJH_Record
    },
    [ECommonUI.XPJH_Room]: {
        resName: "xpjh_room",
        uiType: ECommonUI.XPJH_Room
    },
    [ECommonUI.CHARGE_CONFIRM_BOX]: {
        resName: "charge_confirm_box",
        uiType: ECommonUI.CHARGE_CONFIRM_BOX
    },
    [ECommonUI.CHARGE_CANCEL_CONFIRM_BOX]: {
        resName: "charge_cancel_confirm_box",
        uiType: ECommonUI.CHARGE_CANCEL_CONFIRM_BOX
    },
    [ECommonUI.EXCHANGE_BIND_BANK_CARD]: {
        resName: "ui_bind_bank",
        uiType: ECommonUI.EXCHANGE_BIND_BANK_CARD
    },
    [ECommonUI.EXCHANGE_BIND_ALIPAY]: {
        resName: "ui_bind_alipay",
        uiType: ECommonUI.EXCHANGE_BIND_ALIPAY
    },
    [ECommonUI.EXCHANGE_BIND_USDT]: {
        resName: "ui_bind_usdt",
        uiType: ECommonUI.EXCHANGE_BIND_USDT
    },
    [ECommonUI.EXCHANGE_BIND_USERNAME]: {
        resName: "ui_bind_username",
        uiType: ECommonUI.EXCHANGE_BIND_USERNAME
    },
    [ECommonUI.EXCHANGE_CANCEL_BIND_BOX]: {
        resName: "excharge_cancel_bind_box",
        uiType: ECommonUI.EXCHANGE_CANCEL_BIND_BOX
    },
    [ECommonUI.UI_USDT_HELP]: {
        resName: "ui_usdt_help",
        uiType: ECommonUI.UI_USDT_HELP
    },
    [ECommonUI.UI_CHARGE_ORDER_DETAIL_BOX]: {
        resName: "ui_charge_order_detail_box",
        uiType: ECommonUI.UI_CHARGE_ORDER_DETAIL_BOX
    },
    //客服 charge
    [ECommonUI.UI_CUSTOM_CHARGE]: {
        resName: "ui_custom_charge",
        uiType: ECommonUI.UI_CUSTOM_CHARGE
    },
    [ECommonUI.UI_CUSTOM_ORDERLIST]: {
        resName: "ui_custom_orderList",
        uiType: ECommonUI.UI_CUSTOM_ORDERLIST
    },
    [ECommonUI.UI_CUSTOM_ORDERINFO]: {
        resName: "ui_custom_orderInfo",
        uiType: ECommonUI.UI_CUSTOM_ORDERINFO
    },
    [ECommonUI.LB_TASK]: {
        resName: "ui_task",
        uiType: ECommonUI.LB_TASK
    },
    [ECommonUI.LB_ACTIVITY]: {
        resName: "ui_activity",
        uiType: ECommonUI.LB_ACTIVITY
    },
    [ECommonUI.UI_MANDATORY_POPUP]: {
        resName: "ui_mandatory_popup",
        uiType: ECommonUI.UI_MANDATORY_POPUP
    },
    [ECommonUI.UI_ERROR_LOG]: {
        resName: "ui_errorlog",
        uiType: ECommonUI.UI_ERROR_LOG
    },
    [ECommonUI.UI_CHARGE_USDT_QRCODE]: {
        resName: "ui_charge_usdt_qrcode",
        uiType: ECommonUI.UI_CHARGE_USDT_QRCODE
    },
    [ECommonUI.UI_EXCHANGE_ORDER_LIST]: {
        resName: "ui_custom_exchange_orderList",
        uiType: ECommonUI.UI_EXCHANGE_ORDER_LIST
    },
    [ECommonUI.UI_EXCHANGE_ORDER_TIP]: {
        resName: "exchange_reject_box",
        uiType: ECommonUI.UI_EXCHANGE_ORDER_TIP
    },
    [ECommonUI.GAME_Bcbm]: {
        resName: "game_bcbm",
        uiType: ECommonUI.GAME_Bcbm
    },
    [ECommonUI.GAME_bj]: {
        resName: "game_bj",
        uiType: ECommonUI.GAME_bj
    },
    [ECommonUI.GAME_brebg]: {
        resName: "game_brebg",
        uiType: ECommonUI.GAME_brebg
    },
    [ECommonUI.GAME_brhh]: {
        resName: "game_brhh",
        uiType: ECommonUI.GAME_brhh
    },
    [ECommonUI.GAME_brjh]: {
        resName: "game_brjh",
        uiType: ECommonUI.GAME_brjh
    },
    [ECommonUI.GAME_brlh]: {
        resName: "game_brlh",
        uiType: ECommonUI.GAME_brlh
    },
    [ECommonUI.GAME_brnn]: {
        resName: "game_brnn",
        uiType: ECommonUI.GAME_brnn
    },
    [ECommonUI.GAME_ddz]: {
        resName: "game_ddz",
        uiType: ECommonUI.GAME_ddz
    },
    [ECommonUI.Game_ddz_hy]: {
        resName: "game_ddz_hy",
        uiType: ECommonUI.Game_ddz_hy
    },
    [ECommonUI.Game_kpqzjh]: {
        resName: "game_kpqzjh",
        uiType: ECommonUI.Game_kpqzjh
    },
    [ECommonUI.Game_kpqznn]: {
        resName: "game_kpqznn",
        uiType: ECommonUI.Game_kpqznn
    },
    [ECommonUI.Game_pdk]: {
        resName: "game_pdk",
        uiType: ECommonUI.Game_pdk
    },
    [ECommonUI.Game_qzjh]: {
        resName: "game_qzjh",
        uiType: ECommonUI.Game_qzjh
    },
    [ECommonUI.Game_qznn]: {
        resName: "game_qznn",
        uiType: ECommonUI.Game_qznn
    },
    [ECommonUI.Game_sg]: {
        resName: "game_sg",
        uiType: ECommonUI.Game_sg
    },
    [ECommonUI.Game_sss]: {
        resName: "game_sss",
        uiType: ECommonUI.Game_sss
    },
    [ECommonUI.Game_tbjh]: {
        resName: "game_tbjh",
        uiType: ECommonUI.Game_tbjh
    },
    [ECommonUI.Game_tbnn]: {
        resName: "game_tbnn",
        uiType: ECommonUI.Game_tbnn
    },
    [ECommonUI.Game_xpjh]: {
        resName: "game_xpjh",
        uiType: ECommonUI.Game_xpjh
    },
    [ECommonUI.Game_xpqznn]: {
        resName: "game_xpqznn",
        uiType: ECommonUI.Game_xpqznn
    },
    [ECommonUI.Game_zjh]: {
        resName: "game_zjh",
        uiType: ECommonUI.Game_zjh
    },
    [ECommonUI.SUOHA_Room]: {
        resName: "suoha_room",
        uiType: ECommonUI.SUOHA_Room
    },
    [ECommonUI.Game_suoha]: {
        resName: "game_suoha",
        uiType: ECommonUI.Game_suoha
    },
    [ECommonUI.DZPK_Room]: {
        resName: "dzpk_room",
        uiType: ECommonUI.DZPK_Room
    },
    [ECommonUI.Game_dzpk]: {
        resName: "game_dzpk",
        uiType: ECommonUI.Game_dzpk
    },
    [ECommonUI.Game_tbnn_hy]: {
        resName: "game_tbnn_hy",
        uiType: ECommonUI.Game_tbnn_hy
    },
    [ECommonUI.Game_record_tbnn_hy]: {
        resName: "Game_record_tbnn_hy",
        uiType: ECommonUI.Game_record_tbnn_hy
    },
    [ECommonUI.Game_pdk_hy]: {
        resName: "game_pdk_hy",
        uiType: ECommonUI.Game_pdk_hy
    },
    [ECommonUI.Game_kpqznn_hy]: {
        resName: "game_kpqznn_hy",
        uiType: ECommonUI.Game_kpqznn_hy
    },
    [ECommonUI.Game_record_kpqznn_hy]: {
        resName: "Game_record_kpqznn_hy",
        uiType: ECommonUI.Game_record_kpqznn_hy
    },
    [ECommonUI.Game_zjh_hy]: {
        resName: "game_zjh_hy",
        uiType: ECommonUI.Game_zjh_hy
    },
    [ECommonUI.UI_ENTER_ROOM]: {
        resName: "ui_enter_room",
        uiType: ECommonUI.UI_ENTER_ROOM
    },
    [ECommonUI.UI_APPONINTMENT_RECORD]: {
        resName: "ui_appointment_record",
        uiType: ECommonUI.UI_APPONINTMENT_RECORD
    },
    [ECommonUI.UI_CREATE_ROOM_RECORD]: {
        resName: "ui_create_room_record",
        uiType: ECommonUI.UI_CREATE_ROOM_RECORD
    },
    [ECommonUI.UI_RECORD_DETAIL]: {
        resName: "ui_record_detail",
        uiType: ECommonUI.UI_RECORD_DETAIL
    },
    [ECommonUI.UI_CREAT_ROOM]: {
        resName: "ui_creat_room",
        uiType: ECommonUI.UI_CREAT_ROOM
    },
    [ECommonUI.UI_RESOURCE_LOADING]: {
        resName: "ui_resource_loading",
        uiType: ECommonUI.UI_RESOURCE_LOADING
    },
    [ECommonUI.UI_SETTING_HY]: {
        resName: "ui_setting_hy",
        uiType: ECommonUI.UI_SETTING_HY
    },
    [ECommonUI.UI_REAL_TIME_RECORD]: {
        resName: "ui_real_time_record",
        uiType: ECommonUI.UI_REAL_TIME_RECORD
    },
    [ECommonUI.UI_CHAT_HY]: {
        resName: "ui_game_chat_hy",
        uiType: ECommonUI.UI_CHAT_HY
    },
    [ECommonUI.UI_BRING_POINTS]: {
        resName: "ui_bring_points",
        uiType: ECommonUI.UI_BRING_POINTS
    },
    [ECommonUI.Game_bjl]: {
        resName: "game_bjl",
        uiType: ECommonUI.Game_bjl
    },

    [ECommonUI.BJL_Ludan]: {
        resName: "bjl_ludan",
        uiType: ECommonUI.BJL_Ludan
    },

    [ECommonUI.UI_SHARED_HY]: {
        resName: "ui_shared_hy",
        uiType: ECommonUI.UI_SHARED_HY
    },
    [ECommonUI.UI_TIP_HY]: {
        resName: "ui_tip_hy",
        uiType: ECommonUI.UI_TIP_HY
    },
    [ECommonUI.UI_AWARD_ROOM_CARD]: {
        resName: "ui_award_roomCard",
        uiType: ECommonUI.UI_AWARD_ROOM_CARD
    },

    [ECommonUI.CLUB_HALL]: {
        resName: "club_hall",
        uiType: ECommonUI.CLUB_HALL
    },

    [ECommonUI.CLUB_HALL_JOIN]: {
        resName: "club_join_club",
        uiType: ECommonUI.CLUB_HALL_JOIN
    },

    [ECommonUI.CLUB_HALL_ACTIVITY]: {
        resName: "club_hall_activity",
        uiType: ECommonUI.CLUB_HALL_ACTIVITY
    },

    [ECommonUI.UI_CREATE_CLUB]: {
        resName: "ui_create_club",
        uiType: ECommonUI.UI_CREATE_CLUB
    },

    [ECommonUI.UI_CLUB]: {
        resName: "ui_club",
        uiType: ECommonUI.UI_CLUB
    },
    [ECommonUI.CLUB_ROOMINFO]: {
        resName: "club_roominfo",
        uiType: ECommonUI.CLUB_ROOMINFO
    },
    [ECommonUI.CLUB_ABS_MONEY]: {
        resName: "ui_club_absMoney",
        uiType: ECommonUI.CLUB_ABS_MONEY
    },
    [ECommonUI.CLUB_UP_PARTNER]: {
        resName: "ui_up_partner",
        uiType: ECommonUI.CLUB_UP_PARTNER
    },
    [ECommonUI.CLUB_PERF_QUERY]: {
        resName: "ui_club_perf_query",
        uiType: ECommonUI.CLUB_PERF_QUERY
    },
    [ECommonUI.CLUB_CHANGE_SCALE]: {
        resName: "ui_change_scale",
        uiType: ECommonUI.CLUB_CHANGE_SCALE
    },
    [ECommonUI.CLUB_LEVEL_UP]: {
        resName: "ui_level_up",
        uiType: ECommonUI.CLUB_LEVEL_UP
    },
    [ECommonUI.CLUB_CHANGE_INFO]: {
        resName: "ui_change_info",
        uiType: ECommonUI.CLUB_CHANGE_INFO
    },
    [ECommonUI.UI_BIND_WECHAT_VERIFY]: {
        resName: "ui_bindWeChatVerify",
        uiType: ECommonUI.UI_BIND_WECHAT_VERIFY
    },
    [ECommonUI.UI_GAME_PROP]: {
        resName: "ui_game_prop",
        uiType: ECommonUI.UI_GAME_PROP
    },
    [ECommonUI.UI_GAME_MIPAI]: {
        resName: "ui_game_mipai",
        uiType: ECommonUI.UI_GAME_MIPAI
    },
}
export default cfg_ui;
