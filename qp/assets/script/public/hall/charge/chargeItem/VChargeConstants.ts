const {ccclass, property} = cc._decorator;

@ccclass
export default class VChargeConstants {

    // static CHARGE_REQUEST_SERVER_URL_TEST = "http://192.168.1.125:8070/apps/recharge.php"; // 测试 充值接口地址
    // static CHARGE_REQUEST_SERVER_URL_PRO = "https://byqadmin2.g88288.com:9402/apps/recharge.php"; // 生产 充值接口地址
    static CHARGE_REQUEST_GETOFFLINECHARGELIST = "getOffLineChargeList"; // 线下充值列表
    static CHARGE_REQUEST_GETONLINECHARGELIST = "getOnLineChargeList"; // 线上充值列表
    static CHARGE_REQUEST_ONLINE_CREATE_ORDER = "createOnlineOrder"; // 创建线上支付订单
    static CHARGE_REQUEST_ONLINE_BRIDGE_ORDER = "bridge"; // 线上支付订单跳转
    static CHARGE_REQUEST_CREATE_ORDER = "createOrder"; // 创建订单
    static CHARGE_REQUEST_CANCLE_ORDER = "cancleOrder"; // 取消订单
    static CHARGE_REQUEST_GETONE_ORDER = "getOneOrder"; // 获取单个订单详情
    static CHARGE_REQUEST_CONFIRM_ORDER = "confirmOrder"; // 确认订单
    static CHARGE_REQUEST_GETORDERLIST = "getOrderList"; // 获取订单列表
    static CHARGE_REQUEST_REFLESH_USDT_ADDRESS = "refreshUsdtAddress"; // 刷新USDT地址
    static EXCHANGE_REQUEST_LIST = "getAvaliableExService"; // 兑换列表方式
    static UPLOAD_HEAD_IMG = "" // 上传头像图片

    /**预制体路径地址配置 */
    static CHARGE_PREFAB_CHARGE_ORDER_LIST = "common/hall/prefab/charge/charge_order_list"; // 充值订单列表
    static CHARGE_PREFAB_CHARGE_ORDER_LIST_ITEM = "common/hall/prefab/charge/charge_order_list_item"; // 充值订单列表Item
    static CHARGE_PREFAB_CHARGE_LIST_ITEM = "common/hall/prefab/charge/charge_list_item"; // 充值列表Item
    static CHARGE_PREFAB_CHARGE_BANK_ONE = "common/hall/prefab/charge/charge_bank_one"; // 线下充值界面
    static CHARGE_PREFAB_CHARGE_ORDER_DETAIL = "common/hall/prefab/charge/charge_order_detail"; // 充值订单详情

    static CHARGE_PREFAB_ONLINE_CHARGE_BANK_ONE = "common/hall/prefab/charge/charge_online_bank_one"; // 线上充值界面

    static CHARGE_PREFAB_CHARGE_CANCEL_CONFIRM = "common/hall/prefab/charge/charge_cancel_confirm_box"; // 
    static CHARGE_PREFAB_CHARGE_CONFIRM_BOX = "common/hall/prefab/charge/charge_confirm_box"; 
    static CHARGE_PREFAB_CHARGE_HAD_CHARGE = "common/hall/prefab/charge/charge_had_charge"; 
    static CHARGE_PREFAB_CHARGE_MONEY_ITEM = "common/hall/prefab/charge/charge_money_item"; 
    static CHARGE_PREFAB_CHARGE_NONE_DATA = "common/hall/prefab/charge/charge_none_data"; 
    static CHARGE_PREFAB_CHARGE_NONE_DATA2 = "common/hall/prefab/charge/none_data"; 
    static CHARGE_PREFAB_CHARGE_USDT_ONE = "common/hall/prefab/charge/charge_usdt_one"; 

    /**兑换 */
    static CHARGE_PREFAB_EXCHANGE_ALIPAY = "common/hall/prefab/exchange/exchange_alipay"; 
    static CHARGE_PREFAB_EXCHANGE_BANK_CARD = "common/hall/prefab/exchange/exchange_bank_card"; 
    static CHARGE_PREFAB_EXCHANGE_RECORD = "common/hall/prefab/exchange/exchange_record_list"; 
    static CHARGE_PREFAB_EXCHANGE_RECORD_ITEM = "common/hall/prefab/exchange/exchange_record_list_item"; 
    static CHARGE_PREFAB_EXCHANGE_USDT = "common/hall/prefab/exchange/exchange_usdt"; 

    
    
    



}
