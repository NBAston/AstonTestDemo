
/**全局事件 */

var cfg_event: { [key: string]: string } =
{
   CLOSE_CHARGE: "closeCharge",
   INIT_CHATDB: "initchatDB",
   SEND_ORDER_MESSAGE: "sendOrderMessage",
   RECIEVE_MSG: "recieveMsg",
   REFRESH_MSG_MARK: "refreshmsgMark",
   START_MATFCH: "startmatch",
   OPEN_CONTINUE: "open_continue",
   LOGIN_YUNXIN: "login_yunxin",
   TASK_LIST: "task_list",
   TASK_REWARD: "task_reward",
   CLOSE_TASK: "close_task",
   GET_TASK: "get_task",
   ACTIVITY_LIST: "activity_list",
   REFRESH_TASK_MARK: "refresh_task_mark",
   ACTIVITY_REWARD: "ACTIVITY_REWARD",
   CLOSE_EDITBOX: "CLOSE_EDITBOX",
   ON_DELET_MSG: "deleteMsg",
   CHAT_TOOL_HIDE: "chatToolHide", //客服点击消息工具按钮的隐藏事件
}
export default cfg_event;