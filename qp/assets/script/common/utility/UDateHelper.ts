/**
 * 创建:sq
 * 作用:事件帮助
 */
export default class UDateHelper {

    /**
     * 日期格式化
     * @param date 日期
     * @param fmt 格式
     * @param toBeiJingTime 是否转北京时间，默认是
     * @returns 
     */
    static format(date: Date, fmt: string, toBeiJingTime: boolean = true): string {
        if (toBeiJingTime) {
            date = new Date(new Date().getTime() + (new Date().getTimezoneOffset() / 60 + 8) * 3600 * 1000);
        }
        var o = {
            "M+": date.getMonth() + 1,                 //月份 
            "d+": date.getDate(),                    //日 
            "h+": date.getHours(),                   //小时 
            "m+": date.getMinutes(),                 //分 
            "s+": date.getSeconds(),                 //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds()             //毫秒 
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }
    static Date(time?: number): Date {
        if (!time)
            return new Date();
        else
            return new Date(time);
    }

    static getCurrentBeijingTime() {
        return new Date().getTime() + (new Date().getTimezoneOffset() / 60 + 8) * 3600 * 1000;
    }
    /**秒转换成时间格式 00:00:00 */
    static secondsToTime(seconds: number, showHour: boolean = true): string {
        if (showHour) {
            let h = Math.floor(seconds / 3600);
            let m = Math.floor((seconds / 60 % 60));
            let s = Math.floor((seconds % 60));
            let strH = h.toString().length < 2 ? '0' + h : h;
            let strM = m.toString().length < 2 ? '0' + m : m;
            let strS = s.toString().length < 2 ? '0' + s : s;
            return strH + ":" + strM + ":" + strS;
        } else {
            let m = Math.floor((seconds / 60));
            let s = Math.floor((seconds % 60));
            let strM = m.toString().length < 2 ? '0' + m : m;
            let strS = s.toString().length < 2 ? '0' + s : s;
            return strM + ":" + strS;
        }
    }
}