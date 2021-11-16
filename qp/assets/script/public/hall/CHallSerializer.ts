import { USerializer } from "../../common/net/USerializer";
import { ProtoMapItem } from "../../common/cmd/UOpcode";
import { Game, HallServer, GameServer, ProxyServer, HallFriendServer, GameFriendServer, ClubGameServer, ClubHallServer } from "../../common/cmd/proto";
import UMsgCenter from "../../common/net/UMsgCenter";


export default class CHallSerializer extends USerializer {

    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        /**c to hall */
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL]: {
            /** 根据openId确定弹窗口*/
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_WECHAT_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_WECHAT_MESSAGE_REQ,
                request: HallServer.BindWechatMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_WECHAT_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_WECHAT_MESSAGE_RES,
                request: null,
                response: HallServer.BindWechatMessageResponse,
                log: "",
                isprint: false
            },

            /** 根据openId确定弹窗口*/
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_CHECK_OPENID_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_CHECK_OPENID_MESSAGE_REQ,
                request: HallServer.CheckOpenIdMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_CHECK_OPENID_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_CHECK_OPENID_MESSAGE_RES,
                request: null,
                response: HallServer.CheckOpenIdMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_LOGIN_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_LOGIN_MESSAGE_REQ,
                request: HallServer.LoginMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_LOGIN_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_LOGIN_MESSAGE_RES,
                request: null,
                response: HallServer.LoginMessageResponse,
                log: "",
                isprint:
                    false
            },
            [Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_REQ,
                request: Game.Common.KeepAliveMessage,
                response: null,
                log: "",
                isprint:
                    false
            },
            [Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_RES,
                request: null,
                response: Game.Common.KeepAliveMessageResponse,
                log: "",
                isprint:
                    false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_ROOM_INFO_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_ROOM_INFO_RES,
                request: null,
                response: HallServer.GetGameMessageResponse,
                log: "",
                isprint:
                    false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_ROOM_INFO_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_ROOM_INFO_REQ,
                request: HallServer.GetGameMessage,
                response: null,
                log: "",
                isprint:
                    false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_SERVER_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_SERVER_MESSAGE_REQ,
                request: HallServer.GetGameServerMessage,
                response: null,
                log: "",
                isprint:
                    false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_SERVER_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_SERVER_MESSAGE_RES,
                request: null,
                response: HallServer.GetGameServerMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_HEAD_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_HEAD_MESSAGE_REQ,
                request: HallServer.SetHeadIdMessage,
                response: null,
                log: "",
                isprint:
                    false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_HEAD_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_HEAD_MESSAGE_RES,
                request: null,
                response: HallServer.SetHeadIdMessageResponse,
                log: "",
                isprint:
                    false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_WW_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_WW_MESSAGE_REQ,
                request: HallServer.SetWWMessage,
                response: null,
                log: "",
                isprint:
                    false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_WW_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_WW_MESSAGE_RES,
                request: null,
                response: HallServer.SetWWMessageResponse,
                log: "",
                isprint:
                    false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_WECHAT_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_WECHAT_MESSAGE_REQ,
                request: HallServer.SetWechatMessage,
                response: null,
                log: "",
                isprint:
                    false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_WECHAT_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_WECHAT_MESSAGE_RES,
                request: null,
                response: HallServer.SetWechatMessageResponse,
                log: "",
                isprint:
                    false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_QQ_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_QQ_MESSAGE_REQ,
                request: HallServer.SetQQMessage,
                response: null,
                log: "",
                isprint:
                    false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_QQ_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_QQ_MESSAGE_RES,
                request: null,
                response: HallServer.SetQQMessageResponse,
                log: "",
                isprint:
                    false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_HEADBOX_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_HEADBOX_MESSAGE_REQ,
                request: HallServer.SetHeadboxIdMessage,
                response: null,
                log: "",
                isprint:
                    false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_HEADBOX_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_HEADBOX_MESSAGE_RES,
                request: null,
                response: HallServer.SetHeadboxIdMessageResponse,
                log: "",
                isprint:
                    false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PLAY_RECORD_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PLAY_RECORD_REQ,
                request: HallServer.GetPlayRecordMessage,
                response: null,
                log: "",
                isprint:
                    false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PLAY_RECORD_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PLAY_RECORD_RES,
                request: null,
                response: HallServer.GetPlayRecordMessageResponse,
                log: "",
                isprint:
                    false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_REGISTER_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_REGISTER_MESSAGE_REQ,
                request: HallServer.RegisterMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_REGISTER_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_REGISTER_MESSAGE_RES,
                request: null,
                response: HallServer.RegisterMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_NICKNAME_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_NICKNAME_MESSAGE_REQ,
                request: HallServer.SetNickNameMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_NICKNAME_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_NICKNAME_MESSAGE_RES,
                request: null,
                response: HallServer.SetNickNameMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_GENDER_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_GENDER_MESSAGE_REQ,
                request: HallServer.SetGenderMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_GENDER_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_GENDER_MESSAGE_RES,
                request: null,
                response: HallServer.SetGenderMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MOBILE_VERIFY_CODE_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MOBILE_VERIFY_CODE_MESSAGE_REQ,
                request: Game.Common.GetVerifyCodeMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MOBILE_VERIFY_CODE_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MOBILE_VERIFY_CODE_MESSAGE_RES,
                request: null,
                response: Game.Common.GetVerifyCodeMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_MOBILE_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_MOBILE_MESSAGE_REQ,
                request: HallServer.BindMobileMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_MOBILE_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_MOBILE_MESSAGE_RES,
                request: null,
                response: HallServer.BindMobileMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_RESET_PASSWORD_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_RESET_PASSWORD_MESSAGE_REQ,
                request: HallServer.ResetPasswordMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_RESET_PASSWORD_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_RESET_PASSWORD_MESSAGE_RES,
                request: null,
                response: HallServer.ResetPasswordMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SAVE_SCORE_TO_BANK_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SAVE_SCORE_TO_BANK_MESSAGE_REQ,
                request: HallServer.SaveScoreToBankMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SAVE_SCORE_TO_BANK_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SAVE_SCORE_TO_BANK_MESSAGE_RES,
                request: null,
                response: HallServer.SaveScoreToBankMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_TAKE_SCORE_FROM_BANK_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_TAKE_SCORE_FROM_BANK_MESSAGE_REQ,
                request: HallServer.TakeScoreFromBankMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_TAKE_SCORE_FROM_BANK_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_TAKE_SCORE_FROM_BANK_MESSAGE_RES,
                request: null,
                response: HallServer.TakeScoreFromBankMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_ALIPAY_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_ALIPAY_MESSAGE_REQ,
                request: HallServer.BindAliPayMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_ALIPAY_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_ALIPAY_MESSAGE_RES,
                request: null,
                response: HallServer.BindAliPayMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_BANK_CARD_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_BANK_CARD_MESSAGE_REQ,
                request: HallServer.BindBankCardMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_BANK_CARD_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_BANK_CARD_MESSAGE_RES,
                request: null,
                response: HallServer.BindBankCardMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TRUENAME_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TRUENAME_MESSAGE_REQ,
                request: HallServer.GetTrueNameMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TRUENAME_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TRUENAME_MESSAGE_RES,
                request: null,
                response: HallServer.GetTrueNameMessageesponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_TRUENAME_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_TRUENAME_MESSAGE_REQ,
                request: HallServer.SetTrueNameMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_TRUENAME_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_TRUENAME_MESSAGE_RES,
                request: null,
                response: HallServer.SetTrueNameMessageesponse,
                log: "",
                isprint: false
            },


            // [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_QUERY_RECHARGE_CHANNEL_REQ]: {
            //     subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_QUERY_RECHARGE_CHANNEL_REQ,
            //     request: HallServer.GetRechargeChannelMessage,
            //     response: null,
            //     log: "",
            //     isprint: false
            // },
            // [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_QUERY_RECHARGE_CHANNEL_RES]: {
            //     subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_QUERY_RECHARGE_CHANNEL_RES,
            //     request: null,
            //     response: HallServer.GetRechargeChannelResponse,
            //     log: "",
            //     isprint: false
            // },


            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_NOVICE_TAG_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_NOVICE_TAG_REQ,
                request: HallServer.SetNoviceTagMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_NOVICE_TAG_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_NOVICE_TAG_RES,
                request: null,
                response: HallServer.SeNoviceTagMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PLAYING_GAME_INFO_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PLAYING_GAME_INFO_MESSAGE_REQ,
                request: HallServer.GetPlayingGameInfoMessage,
                response: null,
                log: "",
                isprint:
                    false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PLAYING_GAME_INFO_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PLAYING_GAME_INFO_MESSAGE_RES,
                request: null,
                response: HallServer.GetPlayingGameInfoMessageResponse,
                log: "",
                isprint:
                    false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USER_SCORE_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USER_SCORE_MESSAGE_REQ,
                request: HallServer.GetUserScoreMessage,
                response: null,
                log: "",
                isprint:
                    false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USER_SCORE_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USER_SCORE_MESSAGE_RES,
                request: null,
                response: HallServer.GetUserScoreMessageResponse,
                log: "",
                isprint:
                    false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_EXCHANGE_SCORE_TO_RMB_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_EXCHANGE_SCORE_TO_RMB_MESSAGE_REQ,
                request: HallServer.ExchangeScoreToRMBMessage,
                response: null,
                log: "",
                isprint:
                    false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_EXCHANGE_SCORE_TO_RMB_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_EXCHANGE_SCORE_TO_RMB_MESSAGE_RES,
                request: null,
                response: HallServer.ExchangeScoreToRMBMessageResponse,
                log: "",
                isprint:
                    false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MAIL_LIST_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MAIL_LIST_MESSAGE_REQ,
                request: HallServer.GetMailListMessage,
                response: null,
                log: "",
                isprint:
                    false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MAIL_LIST_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MAIL_LIST_MESSAGE_RES,
                request: null,
                response: HallServer.GetMailListMessageResponse,
                log: "",
                isprint:
                    false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_READ_MAIL_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_READ_MAIL_MESSAGE_REQ,
                request: HallServer.ReadMailMessage,
                response: null,
                log: "",
                isprint:
                    false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_READ_MAIL_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_READ_MAIL_MESSAGE_RES,
                request: null,
                response: HallServer.ReadMailMessageResponse,
                log: "",
                isprint: false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_DEL_MAIL_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_DEL_MAIL_MESSAGE_REQ,
                request: HallServer.DelMailMessage,
                response: null,
                log: "",
                isprint: false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_DEL_MAIL_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_DEL_MAIL_MESSAGE_RES,
                request: null,
                response: HallServer.DelMailMessageResponse,
                log: "",
                isprint: false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_SCORE_RANK_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_SCORE_RANK_MESSAGE_REQ,
                request: HallServer.GetScoreRankMessage,
                response: null,
                log: "",
                isprint:
                    false
            }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_SCORE_RANK_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_SCORE_RANK_MESSAGE_RES,
                request: null,
                response: HallServer.GetScoreRankMessageResponse,
                log: "",
                isprint:
                    false
            },
            // [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GETMYURL_REQ]: {
            //     subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GETMYURL_REQ,
            //     request: HallServer.HallWholeNationGetMyURLMessage,
            //     response: null,
            //     log: "",
            //     isprint:
            //         false
            // }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GETMYURL_RES]: {
            //     subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GETMYURL_RES,
            //     request: null,
            //     response: HallServer.HallWholeNationGetMyURLResponse,
            //     log: "",
            //     isprint:
            //         false
            // },






            //  [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GET_MY_TEAM_REQ]: {
            //     subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GET_MY_TEAM_REQ,
            //     request: HallServer.HallWholeNationGetMyTeamMessage,
            //     response: null,
            //     log: "",
            //     isprint:
            //         false
            // },
            //  [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GET_MY_TEAM_RES]: {
            //     subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GET_MY_TEAM_RES,
            //     request: null,
            //     response: HallServer.HallWholeNationGetMyTeamResponse,
            //     log: "",
            //     isprint:
            //         false
            // }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GET_MY_TOTAL_REVENUE_REQ]: {
            //     subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GET_MY_TEAM_REQ,
            //     request: HallServer.HallWholeNationTotalRevenueMessage,
            //     response: null,
            //     log: "",
            //     isprint:
            //         false
            // }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GET_MY_TOTAL_REVENUE_RES]: {
            //     subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GET_MY_TOTAL_REVENUE_RES,
            //     request: null,
            //     response: HallServer.HallWholeNationTotalRevenueResponse,
            //     log: "",
            //     isprint:
            //         false
            // }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GET_MY_REVENUE_DETAIL_REQ]: {
            //     subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GET_MY_REVENUE_DETAIL_REQ,
            //     request: HallServer.HallWholeNationRevenueDetailMessage,
            //     response: null,
            //     log: "",
            //     isprint:
            //         false
            // }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GET_MY_REVENUE_DETAIL_RES]: {
            //     subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_GET_MY_REVENUE_DETAIL_RES,
            //     request: null,
            //     response: HallServer.HallWholeNationRevenueDetailResponse,
            //     log: "",
            //     isprint:
            //         false
            // }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_EXCHANGE_MY_REVENUE_REQ]: {
            //     subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_EXCHANGE_MY_REVENUE_REQ,
            //     request: HallServer.HallWholeNationExchangeRevenueMessage,
            //     response: null,
            //     log: "",
            //     isprint:
            //         false
            // }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_EXCHANGE_MY_REVENUE_RES]: {
            //     subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_WHOLENATION_EXCHANGE_MY_REVENUE_RES,
            //     request: null,
            //     response: HallServer.HallWholeNationExchangeRevenueResponse,
            //     log: "",
            //     isprint:
            //         false
            // },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_RECHARGE_RECORD_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_RECHARGE_RECORD_MESSAGE_REQ,
                request: HallServer.GetRechargeRecordMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_RECHARGE_RECORD_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_RECHARGE_RECORD_MESSAGE_RES,
                request: null,
                response: HallServer.GetRechargeRecordMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_RMB_RECORD_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_RMB_RECORD_MESSAGE_REQ,
                request: HallServer.GetExchangeRMBRecordMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_RMB_RECORD_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_RMB_RECORD_MESSAGE_RES,
                request: null,
                response: HallServer.GetExchangeRMBRecordMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ALL_PLAY_RECORD_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ALL_PLAY_RECORD_REQ,
                request: HallServer.GetAllPlayRecordMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ALL_PLAY_RECORD_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ALL_PLAY_RECORD_RES,
                request: null,
                response: HallServer.GetAllPlayRecordMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USER_SCORE_CHANGE_RECORD_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USER_SCORE_CHANGE_RECORD_REQ,
                request: HallServer.GetUserScoreChangeRecordMessage,
                response: null,
                log: "",
                isprint:
                    false
            },



            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USER_SCORE_CHANGE_RECORD_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USER_SCORE_CHANGE_RECORD_RES,
                request: null,
                response: HallServer.GetUserScoreChangeRecordMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TWO_VERIFY_CODE_IMG_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TWO_VERIFY_CODE_IMG_MESSAGE_REQ,
                request: Game.Common.GetTwoVerifyCodeImgMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TWO_VERIFY_CODE_IMG_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TWO_VERIFY_CODE_IMG_MESSAGE_RES,
                request: null,
                response: Game.Common.GetTwoVerifyCodeImgMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PROMOTER_LEVEL_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PROMOTER_LEVEL_MESSAGE_REQ,
                request: HallServer.GetPromoterLevelMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PROMOTER_LEVEL_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PROMOTER_LEVEL_MESSAGE_RES,
                request: null,
                response: HallServer.GetPromoterLevelMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_SPREAD_INFO_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_SPREAD_INFO_REQ,
                request: HallServer.GetMySpreadInfoMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_SPREAD_INFO_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_SPREAD_INFO_RES,
                request: null,
                response: HallServer.GetMySpreadInfoMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_EXCHANGE_MY_REVENUE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_EXCHANGE_MY_REVENUE_REQ,
                request: HallServer.ExchangeRevenueMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_EXCHANGE_MY_REVENUE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_EXCHANGE_MY_REVENUE_RES,
                request: null,
                response: HallServer.ExchangeRevenueMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BECOME_PROMOTER_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BECOME_PROMOTER_MESSAGE_REQ,
                request: HallServer.BecomePromoterMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BECOME_PROMOTER_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BECOME_PROMOTER_MESSAGE_RES,
                request: null,
                response: HallServer.BecomePromoterMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_ACHIEVEMENT_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_ACHIEVEMENT_REQ,
                request: HallServer.GetMyAchievementMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_ACHIEVEMENT_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_ACHIEVEMENT_RES,
                request: null,
                response: HallServer.GetMyAchievementMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_ACHIEVEMENT_DETAIL_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_ACHIEVEMENT_DETAIL_REQ,
                request: HallServer.GetAchievementDetailMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_ACHIEVEMENT_DETAIL_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_ACHIEVEMENT_DETAIL_RES,
                request: null,
                response: HallServer.GetAchievementDetailMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_REVENUE_RECORD_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_REVENUE_RECORD_REQ,
                request: HallServer.GetExchangeRevenueRecordMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_REVENUE_RECORD_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_REVENUE_RECORD_RES,
                request: null,
                response: HallServer.GetExchangeRevenueRecordMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_TEAM_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_TEAM_REQ,
                request: HallServer.GetMyTeamMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_TEAM_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_TEAM_RES,
                request: null,
                response: HallServer.GetMyTeamMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_SUBORDINATE_RATE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_SUBORDINATE_RATE_REQ,
                request: HallServer.SetSubordinateRateMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_SUBORDINATE_RATE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_SUBORDINATE_RATE_RES,
                request: null,
                response: HallServer.SetSubordinateRateMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_REFRESH_SPREAD_URL_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_REFRESH_SPREAD_URL_REQ,
                request: HallServer.RefreshSpreadURLMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_REFRESH_SPREAD_URL_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_REFRESH_SPREAD_URL_RES,
                request: null,
                response: HallServer.RefreshSpreadURLMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_USDT_ADDRESS_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_USDT_ADDRESS_MESSAGE_REQ,
                request: HallServer.BindUSDTAddressMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_USDT_ADDRESS_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_USDT_ADDRESS_MESSAGE_RES,
                request: null,
                response: HallServer.BindUSDTAddressMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USDT_EXCHANGE_RATE_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USDT_EXCHANGE_RATE_MESSAGE_REQ,
                request: HallServer.GetUSDTExchangeRateMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USDT_EXCHANGE_RATE_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_USDT_EXCHANGE_RATE_MESSAGE_RES,
                request: null,
                response: HallServer.GetUSDTExchangeRateMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_CANCEL_EXCHANGE_SCORE_TO_RMB_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_CANCEL_EXCHANGE_SCORE_TO_RMB_MESSAGE_REQ,
                request: HallServer.CancelExchangeScoreToRMBMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_CANCEL_EXCHANGE_SCORE_TO_RMB_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_CANCEL_EXCHANGE_SCORE_TO_RMB_MESSAGE_RES,
                request: null,
                response: HallServer.CancelExchangeScoreToRMBMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_SCORE_LIMIT_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_SCORE_LIMIT_MESSAGE_REQ,
                request: HallServer.ExchangeScoreToRMBLimitMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_SCORE_LIMIT_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_SCORE_LIMIT_MESSAGE_RES,
                request: null,
                response: HallServer.ExchangeScoreToRMBLimitMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PUBLIC_NOTICE_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PUBLIC_NOTICE_MESSAGE_REQ,
                request: HallServer.GetPublicNoticeListMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PUBLIC_NOTICE_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PUBLIC_NOTICE_MESSAGE_RES,
                request: null,
                response: HallServer.GetPublicNoticeListMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TASK_LIST_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TASK_LIST_MESSAGE_REQ,
                request: HallServer.GetTaskListMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TASK_LIST_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TASK_LIST_MESSAGE_RES,
                request: null,
                response: HallServer.GetTaskListMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TASK_REWARD_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TASK_REWARD_MESSAGE_REQ,
                request: HallServer.GetTaskRewardMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TASK_REWARD_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TASK_REWARD_MESSAGE_RES,
                request: null,
                response: HallServer.GetTaskRewardMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_START_TASK_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_START_TASK_MESSAGE_REQ,
                request: HallServer.StartTaskMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_START_TASK_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_START_TASK_MESSAGE_RES,
                request: null,
                response: HallServer.StartTaskMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ACTIVITY_LIST_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ACTIVITY_LIST_MESSAGE_REQ,
                request: HallServer.GetActivityListMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ACTIVITY_LIST_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ACTIVITY_LIST_MESSAGE_RES,
                request: null,
                response: HallServer.GetActivityListMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ACTIVITY_REWARD_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ACTIVITY_REWARD_MESSAGE_REQ,
                request: HallServer.GetActivityRewardMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ACTIVITY_REWARD_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ACTIVITY_REWARD_MESSAGE_RES,
                request: null,
                response: HallServer.GetActivityRewardMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_PROMOTER_LEVEL_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_PROMOTER_LEVEL_REQ,
                request: HallServer.GetMyPromoterLevelMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_PROMOTER_LEVEL_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_PROMOTER_LEVEL_RES,
                request: null,
                response: HallServer.GetMyPromoterLevelMessageResponse,
                log: "",
                isprint: false
            },
            // 金币场 选场界面 百家乐牌路消息
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_BJL_SUMMARY_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_BJL_SUMMARY_MESSAGE_REQ,
                request: HallServer.GetBJLSummaryMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_BJL_SUMMARY_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_BJL_SUMMARY_MESSAGE_RES,
                request: null,
                response: HallServer.GetBJLSummaryMessageResponse,
                log: "",
                isprint: false
            },

        },
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND]: {
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_REAL_TIME_GAME_RECORD_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_REAL_TIME_GAME_RECORD_MESSAGE_REQ,
                request: HallFriendServer.GetFriendRoomRTGameRecordMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_REAL_TIME_GAME_RECORD_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_REAL_TIME_GAME_RECORD_MESSAGE_RES,
                request: null,
                response: HallFriendServer.GetFriendRoomRTGameRecordMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_GAMES_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_GAMES_MESSAGE_REQ,
                request: HallFriendServer.GameListMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_GAMES_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_GAMES_MESSAGE_RES,
                request: null,
                response: HallFriendServer.GameListMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_CREATE_ROOM_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_CREATE_ROOM_MESSAGE_REQ,
                request: HallFriendServer.CreateRoomMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_CREATE_ROOM_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_CREATE_ROOM_MESSAGE_RES,
                request: null,
                response: HallFriendServer.CreateRoomMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_GAME_SERVER_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_GAME_SERVER_MESSAGE_REQ,
                request: HallFriendServer.GetGameServerMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_GAME_SERVER_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_GAME_SERVER_MESSAGE_RES,
                request: null,
                response: HallFriendServer.GetGameServerMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_MAIN_GAME_RECORD_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_MAIN_GAME_RECORD_MESSAGE_REQ,
                request: HallFriendServer.GetFriendRoomMainGameRecordMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_MAIN_GAME_RECORD_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_MAIN_GAME_RECORD_MESSAGE_RES,
                request: null,
                response: HallFriendServer.GetFriendRoomMainGameRecordMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_DETAIL_GAME_RECORD_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_DETAIL_GAME_RECORD_MESSAGE_REQ,
                request: HallFriendServer.GetFriendRoomDetailGameRecordMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_DETAIL_GAME_RECORD_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_DETAIL_GAME_RECORD_MESSAGE_RES,
                request: null,
                response: HallFriendServer.GetFriendRoomDetailGameRecordMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_CREATE_ROOM_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_CREATE_ROOM_MESSAGE_REQ,
                request: HallFriendServer.GetFriendRoomCreateRoomMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_CREATE_ROOM_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_CREATE_ROOM_MESSAGE_RES,
                request: null,
                response: HallFriendServer.GetFriendRoomCreateRoomMessageResponse,
                log: "",
                isprint: false
            },

            /**购买房卡列表 */
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_LIST_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_LIST_MESSAGE_REQ,
                request: HallFriendServer.GetFriendRechargeRoomCardListMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_LIST_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_LIST_MESSAGE_RES,
                request: null,
                response: HallFriendServer.GetFriendRechargeRoomCardListResponse,
                log: "",
                isprint:
                    false
            },
            /**购买房卡列表 */
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_LIST_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_LIST_MESSAGE_REQ,
                request: HallFriendServer.GetFriendRechargeRoomCardListMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_LIST_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_LIST_MESSAGE_RES,
                request: null,
                response: HallFriendServer.GetFriendRechargeRoomCardListResponse,
                log: "",
                isprint:
                    false
            },
            /**购买房卡 */
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_RECHARGE_ROOM_CARD_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_RECHARGE_ROOM_CARD_MESSAGE_REQ,
                request: HallFriendServer.RechargeRoomCardMessage,
                response: null,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_RECHARGE_ROOM_CARD_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_RECHARGE_ROOM_CARD_MESSAGE_RES,
                request: null,
                response: HallFriendServer.RechargeRoomCardResponse,
                log: "",
                isprint:
                    false
            },
            /**获取玩家信息 */
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_USER_INFO_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_USER_INFO_MESSAGE_REQ,
                request: HallFriendServer.GetUserInfoMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_USER_INFO_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_USER_INFO_MESSAGE_RES,
                request: null,
                response: HallFriendServer.GetUserInfoResponse,
                log: "",
                isprint:
                    false
            },
            /**转房卡给玩家 */
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_TRANSFER_ROOM_CARD_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_TRANSFER_ROOM_CARD_MESSAGE_REQ,
                request: HallFriendServer.TransferRoomCardMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_TRANSFER_ROOM_CARD_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_TRANSFER_ROOM_CARD_MESSAGE_RES,
                request: null,
                response: HallFriendServer.TransferRoomCardResponse,
                log: "",
                isprint:
                    false
            },
            /**房卡转帐记录 */
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_IN_OUT_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_IN_OUT_MESSAGE_REQ,
                request: HallFriendServer.GetRoomCardInOutRecordMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_IN_OUT_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_IN_OUT_MESSAGE_RES,
                request: null,
                response: HallFriendServer.GetRoomCardInOutRecordResponse,
                log: "",
                isprint:
                    false
            },
            /** 个人中心 房卡明细*/
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_CHANGE_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_CHANGE_MESSAGE_REQ,
                request: HallFriendServer.GetRoomCardChangeRecordMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_CHANGE_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_CHANGE_MESSAGE_RES,
                request: null,
                response: HallFriendServer.GetRoomCardChangeRecordResponse,
                log: "",
                isprint:
                    false
            },
            /** 最近转帐*/
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_RECENT_TRANSFER_ROOM_CARD_OUT_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_RECENT_TRANSFER_ROOM_CARD_OUT_MESSAGE_REQ,
                request: HallFriendServer.RecentTransferRoomCardOutMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_RECENT_TRANSFER_ROOM_CARD_OUT_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_RECENT_TRANSFER_ROOM_CARD_OUT_MESSAGE_RES,
                request: null,
                response: HallFriendServer.RecentTransferRoomCardOutResponse,
                log: "",
                isprint:
                    false
            },
            /** 常用转帐*/
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_COMMON_TRANSFER_ROOM_CARD_OUT_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_COMMON_TRANSFER_ROOM_CARD_OUT_MESSAGE_REQ,
                request: HallFriendServer.CommonTransferRoomCardOutMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_COMMON_TRANSFER_ROOM_CARD_OUT_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_COMMON_TRANSFER_ROOM_CARD_OUT_MESSAGE_RES,
                request: null,
                response: HallFriendServer.CommonTransferRoomCardOutResponse,
                log: "",
                isprint:
                    false
            },


        },
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER_FRIEND]: {
            [GameFriendServer.SUBID.SUB_C2S_ENTER_ROOM_REQ]: {
                subId: GameFriendServer.SUBID.SUB_C2S_ENTER_ROOM_REQ,
                request: GameFriendServer.MSG_C2S_UserEnterMessage,
                response: null,
                log: "",
                isprint: false
            },

            [GameFriendServer.SUBID.SUB_S2C_ENTER_ROOM_RES]: {
                subId: GameFriendServer.SUBID.SUB_S2C_ENTER_ROOM_RES,
                request: null,
                response: GameFriendServer.MSG_S2C_UserEnterMessageResponse,
                log: "",
                isprint: false
            },

            [GameFriendServer.SUBID.SUB_S2C_USER_ENTER_NOTIFY]: {
                subId: GameFriendServer.SUBID.SUB_S2C_USER_ENTER_NOTIFY,
                request: null,
                response: GameFriendServer.MSG_S2C_UserBaseInfo,
                log: "",
                isprint: false
            },

            [GameFriendServer.SUBID.SUB_S2C_USER_STATUS_NOTIFY]: {
                subId: GameFriendServer.SUBID.SUB_S2C_USER_STATUS_NOTIFY,
                request: null,
                response: GameFriendServer.MSG_S2C_GameUserStatus,
                log: "",
                isprint: false
            },

            [GameFriendServer.SUBID.SUB_C2S_USER_LEFT_REQ]: {
                subId: GameFriendServer.SUBID.SUB_C2S_USER_LEFT_REQ,
                request: GameFriendServer.MSG_C2S_UserLeftMessage,
                response: null,
                log: "",
                isprint: false
            },

            [GameFriendServer.SUBID.SUB_S2C_USER_LEFT_RES]: {
                subId: GameFriendServer.SUBID.SUB_S2C_USER_LEFT_RES,
                request: null,
                response: GameFriendServer.MSG_C2S_UserLeftMessageResponse,
                log: "",
                isprint: false
            },


        },
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            [GameServer.SUBID.SUB_C2S_MESSAGE_REQ]: {
                subId: GameServer.SUBID.SUB_C2S_MESSAGE_REQ,
                request: GameServer.MSG_CSC_Passageway,
                response: null,
                log: "",
                isprint: false
            },

            [GameServer.SUBID.SUB_S2C_MESSAGE_RES]: {
                subId: GameServer.SUBID.SUB_S2C_MESSAGE_RES,
                request: null,
                response: GameServer.MSG_CSC_Passageway,
                log: "",
                isprint: false
            },
        },

        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND]: {
            [GameServer.SUBID.SUB_C2S_MESSAGE_REQ]: {
                subId: GameServer.SUBID.SUB_C2S_MESSAGE_REQ,
                request: GameServer.MSG_CSC_Passageway,
                response: null,
                log: "",
                isprint: false
            },

            [GameServer.SUBID.SUB_S2C_MESSAGE_RES]: {
                subId: GameServer.SUBID.SUB_S2C_MESSAGE_RES,
                request: null,
                response: GameServer.MSG_CSC_Passageway,
                log: "",
                isprint: false
            },
        },

        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER]:
        {
            [GameServer.SUBID.SUB_C2S_ENTER_ROOM_REQ]: {
                subId: GameServer.SUBID.SUB_C2S_ENTER_ROOM_REQ,
                request: GameServer.MSG_C2S_UserEnterMessage,
                response: null,
                log: "",
                isprint: false
            },

            [GameServer.SUBID.SUB_S2C_ENTER_ROOM_RES]: {
                subId: GameServer.SUBID.SUB_S2C_ENTER_ROOM_RES,
                request: null,
                response: GameServer.MSG_S2C_UserEnterMessageResponse,
                log: "",
                isprint: false
            },

            [GameServer.SUBID.SUB_S2C_USER_ENTER_NOTIFY]: {
                subId: GameServer.SUBID.SUB_S2C_USER_ENTER_NOTIFY,
                request: null,
                response: GameServer.MSG_S2C_UserBaseInfo,
                log: "",
                isprint: false
            },

            [GameServer.SUBID.SUB_S2C_USER_STATUS_NOTIFY]: {
                subId: GameServer.SUBID.SUB_S2C_USER_STATUS_NOTIFY,
                request: null,
                response: GameServer.MSG_S2C_GameUserStatus,
                log: "",
                isprint: false
            },

            [GameServer.SUBID.SUB_C2S_USER_LEFT_REQ]: {
                subId: GameServer.SUBID.SUB_C2S_USER_LEFT_REQ,
                request: GameServer.MSG_C2S_UserLeftMessage,
                response: null,
                log: "",
                isprint: false
            },

            [GameServer.SUBID.SUB_S2C_USER_LEFT_RES]: {
                subId: GameServer.SUBID.SUB_S2C_USER_LEFT_RES,
                request: null,
                response: GameServer.MSG_C2S_UserLeftMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_REQ,
                request: Game.Common.KeepAliveMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_RES,
                request: null,
                response: Game.Common.KeepAliveMessageResponse,
                log: "",
                isprint:
                    false
            },

            [GameServer.SUBID.SUB_GF_SYSTEM_MESSAGE]: {
                subId: GameServer.SUBID.SUB_GF_SYSTEM_MESSAGE,
                request: null,
                response: GameServer.MSG_S2C_SystemMessage,
                log: "",
                isprint: false
            },
        },
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_PROXY]:
        {
            [Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_NEW_EMAIL_MESSAGE_NOTIFY]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_NEW_EMAIL_MESSAGE_NOTIFY,
                request: null,
                response: ProxyServer.Message.ProxyNotifyNewMailMessage,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_SHUTDOWN_USER_CLIENT_MESSAGE_NOTIFY]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_SHUTDOWN_USER_CLIENT_MESSAGE_NOTIFY,
                request: null,
                response: ProxyServer.Message.ProxyNotifyShutDownUserClientMessage,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_PUBLIC_NOTICE_MESSAGE_NOTIFY]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_PUBLIC_NOTICE_MESSAGE_NOTIFY,
                request: null,
                response: ProxyServer.Message.NotifyPublicNoticeMessage,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_RECHARGE_MESSAGE_NOTIFY]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_RECHARGE_MESSAGE_NOTIFY,
                request: null,
                response: ProxyServer.Message.ProxyNotifyRechargeMessage,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_EXCHANGE_MESSAGE_NOTIFY]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_EXCHANGE_MESSAGE_NOTIFY,
                request: null,
                response: ProxyServer.Message.ProxyNotifyExchangeMessage,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_PUBLIC_NOTICE_MESSAGE_NOTIFY]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_PUBLIC_NOTICE_MESSAGE_NOTIFY,
                request: null,
                response: ProxyServer.Message.NotifyPublicNoticeMessage,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.CLIENT_TO_PROXY_GET_AES_KEY_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.CLIENT_TO_PROXY_GET_AES_KEY_MESSAGE_REQ,
                request: ProxyServer.Message.GetAESKeyMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.CLIENT_TO_PROXY_GET_AES_KEY_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.CLIENT_TO_PROXY_GET_AES_KEY_MESSAGE_RES,
                request: null,
                response: ProxyServer.Message.GetAESKeyMessageResponse,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_TRANSFER_RECV_ROOM_CARD_MESSAGE_NOTIFY]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_TRANSFER_RECV_ROOM_CARD_MESSAGE_NOTIFY,
                request: null,
                response: ProxyServer.Message.ProxyNotifyTransferRecvRoomCardMessage,
                log: "",
                isprint: false
            },
            // 百家乐选场界面 推送消息
            [Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_BJL_SUMMARY_MESSAGE_NOTIFY]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_BJL_SUMMARY_MESSAGE_NOTIFY,
                request: null,
                response: ProxyServer.Message.ProxyNotifyBJLSummaryMessage,
                log: "",
                isprint: false
            },

            // 百家乐选场界面 注消推送消息
            [Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.CLIENT_TO_PROXY_UNREGISTER_BJL_SUMMARY_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.CLIENT_TO_PROXY_UNREGISTER_BJL_SUMMARY_MESSAGE_REQ,
                request: ProxyServer.Message.UnregisterBJLSummaryMessage,
                response: null,
                log: "",
                isprint:
                    false
            },

            [Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.CLIENT_TO_PROXY_UNREGISTER_BJL_SUMMARY_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.CLIENT_TO_PROXY_UNREGISTER_BJL_SUMMARY_MESSAGE_RES,
                request: null,
                response: ProxyServer.Message.UnregisterBJLSummaryMessageResponse,
                log: "",
                isprint:
                    false
            },




        },

        /**俱乐部start */
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB]: {
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_ACTIVITY_REWARD_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_ACTIVITY_REWARD_REQ,
                request: ClubHallServer.GetClubActivityRewardMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_ACTIVITY_REWARD_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_ACTIVITY_REWARD_RES,
                request: null,
                response: ClubHallServer.GetClubActivityRewardMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_GAME_SERVER_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_GAME_SERVER_MESSAGE_REQ,
                request: ClubHallServer.GetGameServerMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_GAME_SERVER_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_GAME_SERVER_MESSAGE_RES,
                request: null,
                response: ClubHallServer.GetGameServerMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_GAME_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_GAME_MESSAGE_REQ,
                request: ClubHallServer.GetMyClubGameMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_GAME_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_GAME_MESSAGE_RES,
                request: null,
                response: ClubHallServer.GetMyClubGameMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_JOIN_THE_CLUB_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_JOIN_THE_CLUB_MESSAGE_REQ,
                request: ClubHallServer.JoinTheClubMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_JOIN_THE_CLUB_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_JOIN_THE_CLUB_MESSAGE_RES,
                request: null,
                response: ClubHallServer.JoinTheClubMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_HALL_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_HALL_MESSAGE_REQ,
                request: ClubHallServer.GetMyClubHallMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_HALL_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_HALL_MESSAGE_RES,
                request: null,
                response: ClubHallServer.GetMyClubHallMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_AUTO_BECOME_PARTNER_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_AUTO_BECOME_PARTNER_MESSAGE_REQ,
                request: ClubHallServer.SetAutoBecomePartnerMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_AUTO_BECOME_PARTNER_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_AUTO_BECOME_PARTNER_MESSAGE_RES,
                request: null,
                response: ClubHallServer.SetAutoBecomePartnerMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_EXCHANGE_MY_REVENUE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_EXCHANGE_MY_REVENUE_REQ,
                request: ClubHallServer.ExchangeRevenueMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_EXCHANGE_MY_REVENUE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_EXCHANGE_MY_REVENUE_RES,
                request: null,
                response: ClubHallServer.ExchangeRevenueMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_RES,
                request: null,
                response: ClubHallServer.GetMyAchievementMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_REQ,
                request: ClubHallServer.GetMyAchievementMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_DETAIL_MEMBER_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_DETAIL_MEMBER_REQ,
                request: ClubHallServer.GetAchievementDetailMemberMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_DETAIL_MEMBER_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_DETAIL_MEMBER_RES,
                request: null,
                response: ClubHallServer.GetAchievementDetailMemberMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_DETAIL_PARTNER_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_DETAIL_PARTNER_REQ,
                request: ClubHallServer.GetAchievementDetailPartnerMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_DETAIL_PARTNER_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_DETAIL_PARTNER_RES,
                request: null,
                response: ClubHallServer.GetAchievementDetailPartnerMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_EXIT_THE_CLUB_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_EXIT_THE_CLUB_MESSAGE_REQ,
                request: ClubHallServer.ExitTheClubMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_EXIT_THE_CLUB_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_EXIT_THE_CLUB_MESSAGE_RES,
                request: null,
                response: ClubHallServer.ExitTheClubMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_EXCHANGE_MY_REVENUE_RECORD_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_EXCHANGE_MY_REVENUE_RECORD_REQ,
                request: ClubHallServer.GetExchangeRevenueRecordMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_EXCHANGE_MY_REVENUE_RECORD_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_EXCHANGE_MY_REVENUE_RECORD_RES,
                request: null,
                response: ClubHallServer.GetExchangeRevenueRecordMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_TEAM_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_TEAM_REQ,
                request: ClubHallServer.GetMyTeamMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_TEAM_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_TEAM_RES,
                request: null,
                response: ClubHallServer.GetMyTeamMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_SUBORDINATE_RATE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_SUBORDINATE_RATE_REQ,
                request: ClubHallServer.SetSubordinateRateMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_SUBORDINATE_RATE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_SUBORDINATE_RATE_RES,
                request: null,
                response: ClubHallServer.SetSubordinateRateMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_FIRE_MEMBER_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_FIRE_MEMBER_REQ,
                request: ClubHallServer.FireMemberMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_FIRE_MEMBER_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_FIRE_MEMBER_RES,
                request: null,
                response: ClubHallServer.FireMemberMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_REQ,
                request: ClubHallServer.GetMyClubMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_RES,
                request: null,
                response: ClubHallServer.GetMyClubMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_BECOME_PARTNER_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_BECOME_PARTNER_MESSAGE_REQ,
                request: ClubHallServer.BecomePartnerMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_BECOME_PARTNER_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_BECOME_PARTNER_MESSAGE_RES,
                request: null,
                response: ClubHallServer.BecomePartnerMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_PLAY_RECORD_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_PLAY_RECORD_REQ,
                request: ClubHallServer.GetPlayRecordMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_PLAY_RECORD_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_PLAY_RECORD_RES,
                request: null,
                response: ClubHallServer.GetPlayRecordMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_ALL_PLAY_RECORD_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_ALL_PLAY_RECORD_REQ,
                request: ClubHallServer.GetAllPlayRecordMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_ALL_PLAY_RECORD_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_ALL_PLAY_RECORD_RES,
                request: null,
                response: ClubHallServer.GetAllPlayRecordMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_USER_SCORE_CHANGE_RECORD_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_USER_SCORE_CHANGE_RECORD_REQ,
                request: ClubHallServer.GetUserScoreChangeRecordMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_USER_SCORE_CHANGE_RECORD_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_USER_SCORE_CHANGE_RECORD_RES,
                request: null,
                response: ClubHallServer.GetUserScoreChangeRecordMessageResponse,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_APPLY_CLUB_INFO_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_APPLY_CLUB_INFO_REQ,
                request: ClubHallServer.GetApplyClubInfoMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_APPLY_CLUB_INFO_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_APPLY_CLUB_INFO_RES,
                request: null,
                response: ClubHallServer.GetApplyClubInfoMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_CLUB_PROMOTER_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_CLUB_PROMOTER_REQ,
                request: ClubHallServer.GetClubPromoterInfoMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_CLUB_PROMOTER_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_CLUB_PROMOTER_RES,
                request: null,
                response: ClubHallServer.GetClubPromoterInfoMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_GLOBAL_MATCH_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_GLOBAL_MATCH_MESSAGE_REQ,
                request: ClubHallServer.GetMyClubGlobalMatchMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_GLOBAL_MATCH_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_GLOBAL_MATCH_MESSAGE_RES,
                request: null,
                response: ClubHallServer.GetMyClubGlobalMatchMessageResponse,
                log: "",
                isprint: false
            },

            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_MY_CLUB_GLOBAL_MATCH_MESSAGE_REQ]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_MY_CLUB_GLOBAL_MATCH_MESSAGE_REQ,
                request: ClubHallServer.SetMyClubGlobalMatchMessage,
                response: null,
                log: "",
                isprint: false
            },
            [Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_MY_CLUB_GLOBAL_MATCH_MESSAGE_RES]: {
                subId: Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_MY_CLUB_GLOBAL_MATCH_MESSAGE_RES,
                request: null,
                response: ClubHallServer.SetMyClubGlobalMatchMessageResponse,
                log: "",
                isprint: false
            },
        },

        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER_CLUB]: {
            [ClubGameServer.SUBID.SUB_C2S_GET_ROOM_INFO_REQ]: {
                subId: ClubGameServer.SUBID.SUB_C2S_GET_ROOM_INFO_REQ,
                request: ClubGameServer.MSG_C2S_GetRoomInfoMessage,
                response: null,
                log: "",
                isprint: false
            },
            [ClubGameServer.SUBID.SUB_S2C_GET_ROOM_INFO_RES]: {
                subId: ClubGameServer.SUBID.SUB_S2C_GET_ROOM_INFO_RES,
                request: null,
                response: ClubGameServer.MSG_S2C_GetRoomInfoResponse,
                log: "",
                isprint: false
            },

            [ClubGameServer.SUBID.SUB_C2S_GET_GAME_INFO_REQ]: {
                subId: ClubGameServer.SUBID.SUB_C2S_GET_GAME_INFO_REQ,
                request: ClubGameServer.MSG_C2S_GetGameInfoMessage,
                response: null,
                log: "",
                isprint: false
            },
            [ClubGameServer.SUBID.SUB_S2C_GET_GAME_INFO_RES]: {
                subId: ClubGameServer.SUBID.SUB_S2C_GET_GAME_INFO_RES,
                request: null,
                response: ClubGameServer.MSG_S2C_GetGameInfoResponse,
                log: "",
                isprint: false
            },
        }
        /**俱乐部end */

    }
    protected getProtoMap(mainId: number, subId: number): ProtoMapItem {
        return this.protoMap[mainId][subId];
    }
}
UMsgCenter.ins.addSerializer(0, new CHallSerializer());
