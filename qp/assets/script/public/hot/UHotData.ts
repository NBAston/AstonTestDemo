export const UpdaterEvent = {
    ALREADY_UP_TO_DATE: "already_up_to_date",                  //已经是最新版本
    NEW_VERSION_FOUND: "new_version_found",                   //检查到新版本
    UPDATE_PROGRESSION: "update_progress",                     //更新进度
    UPDATE_PROGRESSION_DESC: "update_progression_desc",                     //更新进度
    UPDATE_FINISHED: "update_finished",                     //更新完成
    ERROR_NO_LOCAL_MANIFEST: "error_no_local_manifest",             //本地无更新清单
    ERROR_DOWNLOAD_MANIFEST: "error_download_manifest",             //无法下载清单文件
    ERROR_PARSE_MANIFEST: "error_parse_manifest",                //解析清单失败
    UPDATE_FAILED: "update_failed",                       //更新失败

    MAIN_ALREADY_UP_TO_DATE: "MAIN_ALREADY_UP_TO_DATE",
    MAIN_UPDATE_PROGRESSION: "MAIN_UPDATE_PROGRESSION",

    SUB_ALREADY_UP_TO_DATE: "SUB_ALREADY_UP_TO_DATE",
    SUB_UPDATE_PROGRESSION: "SUB_UPDATE_PROGRESSION",
    SUB_UPDATE_FINISHED: "SUB_UPDATE_FINISHED",
    SUB_NEW_VERSION_FOUND: "SUB_NEW_VERSION_FOUND",
    SUB_CHECK_OVER: "SUB_CHECK_OVER",
    SUB_UPDATE_FAILED: "sub_update_failed",
};