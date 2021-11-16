/**
 *全局配置 
 */

var cfg_global = {
    isHot: true,//大厅是否热更
    isSubHot: true,//子游戏是否热更
    version: "1.5.0",
    buildTime: "2021.11.13",
    isSub: false,
    isencrypt: true,
    isUseLocalServer: true,//是否使用本地固定IP
    isUseInputServer: false,//是否显示输入IP框
    env: 0, // 0 测试环境   1 开发环境   2 生产环境 3、预发布环境
    loginUrl: "http://192.168.0.188:808/LoginInfo.ashx?",
    isOverseas: true,
    overseasUrl: ["gw.qiqip8.com:8150"],//海外线路
    avatar: "http://120.25.164.12",
    qq: ["12345678998"],
    ips: ["192.168.128.6:10000"], //测试服(227)  开发服(6、245)
    ips_pro_web: ["apk.qiqip.com:7879"],
    ips_pro_native: ["apk.qiqip.com:7879"],
    ips_pre_native: ["gw.qi147.com:10000"],
    bid: "SHKF0205",//"SHYX0821",
    yundown_url: "http://cn.unionpay.com/zt/2017/139595361/",
    upload_log_url: "http://192.168.128.227:8080/UploadLog", // 日志上传地址
    upload_log_url_pro: "http://log.qiqip8.com:7520/api/UploadLog"
};
export default cfg_global;