import { ULocalStorage } from "../../common/utility/ULocalStorage";
import URandomHelper from "../../common/utility/URandomHelper";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import UDebug from "../../common/utility/UDebug";

const plateform_name = "db_plateform_2";


export enum EOSType {

}

/**
 * 平台信息
 */
export class PlateformInfo {
    /**
     * 设备类型
     */
    machineType: string;
    /**设备串号 唯一识别码 */
    machineSerial: string;
    /**系统类型 */
    osType: number;
    /**平台id */
    platformId: number;
    /**频道id */
    channelId: number;
    /**是否为模拟器 */
    emulator: number;
}
/**
 *  平台相关信息 
 */
export default class UPlatformHelper {
    private static _plateform: PlateformInfo;
    /**
     * 获取平台信息
     */
    static getPlateForm(): PlateformInfo {
       
        if (!UPlatformHelper._plateform) {
            if (CC_JSB && cc.sys.OS_ANDROID == cc.sys.os) {
                UPlatformHelper._plateform = new PlateformInfo();
                UPlatformHelper._plateform.machineType = UAPIHelper.getSystemModel();
                UPlatformHelper._plateform.machineSerial = UAPIHelper.getDeviceId();
                UPlatformHelper._plateform.emulator = UAPIHelper.isEmulator();//是否为模拟器
                UPlatformHelper._plateform.platformId = 1;
                UPlatformHelper._plateform.channelId = 1;
                UPlatformHelper._plateform.osType = 2;//系统类型
            } else if (CC_JSB && cc.sys.OS_IOS == cc.sys.os) {
                UPlatformHelper._plateform = new PlateformInfo();
                UPlatformHelper._plateform.machineType = UAPIHelper.getSystemModel();
                UPlatformHelper._plateform.machineSerial = UAPIHelper.getDeviceId();/**时间加随机数生成一个唯一编码 然后存储起来 */
                UPlatformHelper._plateform.emulator = UAPIHelper.isEmulator();//是否为模拟器
                UPlatformHelper._plateform.osType = 1;//系统类型
                UPlatformHelper._plateform.channelId = 1;///总代理ID
                UPlatformHelper._plateform.platformId = 1;//平台ID
            } else {
                // var content = ULocalStorage.getItem(plateform_name);
                var content = null;
                if (content) {
                    UPlatformHelper._plateform = JSON.parse(content);
                } else {
                    UPlatformHelper._plateform = new PlateformInfo();
                    UPlatformHelper._plateform.machineType = "pc";
                    UPlatformHelper._plateform.machineSerial = (new Date()).getTime() + "" + URandomHelper.randomBetween(0, 100000000);/**时间加随机数生成一个唯一编码 然后存储起来 */
                    // UPlatformHelper._plateform.machineSerial = "1231231231231";
                    UPlatformHelper._plateform.emulator = 0;//是否为模拟器
                    UPlatformHelper._plateform.osType = 3;//系统类型
                    UPlatformHelper._plateform.channelId = 1;///总代理ID
                    UPlatformHelper._plateform.platformId = 1;//平台ID
                    ULocalStorage.saveItem(plateform_name, UPlatformHelper._plateform);
                }
            }
        }
        return UPlatformHelper._plateform;
    }
}
