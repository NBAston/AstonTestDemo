import Vlb_emoj_text from "../../public/hall/lb_chat/Vlb_emoj_text";
import Vlb_left_select from "../../public/hall/lb_service_mail/Vlb_left_select";
import UDebug from "./UDebug";

export default class UStringHelper {
    static unitConvert(arg0: number): string {
        throw new Error("Method not implemented.");
    }
    /**
     * 数字三位三位显示
     * @param num 
     */
    static toThousands(num): string {
        var num = (num || 0).toString(), result = '';
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) { result = num + result; }
        return result;
    }
    /**
    * 玩家昵称隐藏一半
    * @param name 
    */
    static coverName(name: string): string {
        return UStringHelper.spliteString(name, 3);
    }
    static isRealNum(val): boolean {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    }

    // 只能输入正整数
    static isInt(val): boolean {
        var regPos = /(^[0-9]*[1-9][0-9]*$)/; //非负浮点数
        // var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val)) {
            return true;
        } else {
            return false;
        }
    }

    // 只能输入数字
    static isNumber(val): boolean {
        var regPos = /^[0-9]([0-9])*$/; //数字
        // var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val)) {
            return true;
        } else {
            return false;
        }
    }

    // 只能输入非负浮点数
    static isFloat(val): boolean {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        ; //非负浮点数
        // var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val)) {
            return true;
        } else {
            return false;
        }
    }

    // 只能输入中文
    static isChinesName(val): boolean {
        var regPos = /^[\u4e00-\u9fa5]+$/;
        // var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val)) {
            return true;
        } else {
            return false;
        }
    }

    //判断是否输入中文加数字
    static checkChinaeaseAndNumber(val): boolean {
        var han = /^[\u4e00-\u9fa5_0-9]+$/; //中文
        if (han.test(val)) {
            return true;
        } else {
            return false;
        }
    }

    //只包含中文和英文
    static isGbOrEn(value): boolean {
        var regu = "^[a-zA-Z\u4e00-\u9fa5]+$";
        var re = new RegExp(regu);
        if (value.search(re) != -1) {
            return true;
        } else {
            return false;
        }
    }

    // 英文加数字
    static isEnOrNumber(str): boolean {
        var re = /^[a-zA-Z0-9]+$/;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    }

    // 是否是以0x开头
    static isOxStart(str): boolean {
        var re = /^0x.*$/;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    }

    // 验证手机号码 11位数字 以1开头
    static checkMobile(str): boolean {
        var re = /^1\d{10}$/
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    }

    // 验证支付宝账号 邮箱或者手机号码
    static checkAlipay(str): boolean {
        var re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
        var re1 = /^1\d{10}$/
        if (re.test(str) || re1.test(str)) {
            return true;
        } else {
            return false;
        }
    }

    // 校验小数只能最多两位
    static checkPointTwoData(str): boolean {
        var re = /^(-?\d+)(\.\d{1,2})?$/;
        if (re.test(str)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * string format 
     * “{0}aaa{1}"
     * @param content 
     * @param args 
     */
    static format(content: string, ...args: Array<any>): string {
        return content.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    }
    /**
     * 
     * @param content 
     * @param len 
     */
    static spliteString(content: string, len: number): string {
        let str = "";
        let charLen = content.length;
        let idx = 0;
        let toolong = false;
        for (let index = 0; index < charLen; index++) {
            const element = content[index];
            if (UStringHelper.isChinese(element)) {
                idx += 2;
            } else {
                idx += 1;
            }
            str += element;
            if (idx >= len) {
                toolong = true;
                break;
            }
        }
        if (toolong) {
            str += "***";
        }
        return str;
    }
    /**
     * 处理字符保留前3未和后三位，其他用*
     * @param content 
     */
    static repalceString(content: string): string {
        if (content.length < 7) {

            return content;
        }
        var str_f = content.substr(0, 3);
        var str_b = content.substr(content.length - 3, 3);
        return str_f + "*****" + str_b;
    }

    /**
     * 处理字符串前前num位和后num位，其他用*
     * @param content 字符串
     * @param num 第num位
     */
    static replaceStringFristEndNum(content: string, num: number): string {
        if (content.length < 2 * num) {
            return content;
        }
        var str_f = content.substr(0, num);
        var str_b = content.substr(content.length - num, num);
        return str_f + "*****" + str_b;
    }
    static isChinese(temp): boolean {
        var re = new RegExp("[\\u4E00-\\u9FFF]+", "g");
        return re.test(temp)
    }
    /**
     * 检查是否为移动电话
     * @param content 
     */
    static IsCheckPhone(content: string): boolean {
        if (!(/^1[345678]\d{9}$/.test(content))) {
            return false;
        }
        return true;
    }
    /**
   * 字符串是否为空字符串
   * @param obj 
   */
    static isEmptyString(obj: string): boolean {
        if (typeof obj == "undefined" || obj == null || obj == "") {
            return true;
        } else {
            return false;
        }
    }

    /**玩家头像下金钱格式化（超过10000小于1000000的去掉小数点、负数一样） */
    static formatPlayerCoin(coin: number) {
        let str = this.getMoneyFormat(coin);
        if (Math.abs(coin) >= 10000 && Math.abs(coin) < 1000000 && str != '0') {
            return str.substring(0, str.length - 3);
        }
        return str;
    }

    /**
     * qznn 样式的金钱格式化 xx,xxx.xx
     * @param num 数字
     * @returns 金钱格式化
     */
    static getMoneyFormat(num: number, idx: number = 4, needDouhao: boolean = true, isHall: boolean = false, isBaoxiang: boolean = false): string {
        let len = 7;
        if (num < 0) {
            idx = -1;
            len = 8;
        }
        var str = "";
        let tempStr = num.toFixed(2);
        let pointIndex = tempStr.indexOf("."); //得到从前往后数，离"."的多少个字符。

        let temp = tempStr.split(".", 2);
        let tempFirst = temp[0];
        let tempFirstNum = temp[0].toString();

        if (tempFirstNum.length < len || isBaoxiang) {
            str = tempStr;
        } else {
            let decimal = tempFirst.substring(tempFirstNum.length - 4, tempFirstNum.length - 2);
            str = str = parseInt(num / 10000 + "") + "." + decimal + '万';
        }
        if (str == "0.00") str = "0"
        return str;

        // if(tempFirstNum.length < 6){
        //     if (temp[1] == "00")        //小数点后面部分是00
        //     {
        //             str = tempFirst;
        //     }else {                     //不为0的后2位
        //         if(isHall){
        //             str = tempStr;
        //         }else{
        //             str = tempFirst + "." + temp[1].charAt(0);
        //         }  
        //     }
        // }else if(tempFirstNum.length == 6){
        //     let decimal = tempFirst.substring(tempFirstNum.length - 4,tempFirstNum.length - 2);
        //     str = parseInt(num/10000 + "") +  "." + decimal + '万';
        // }else if(tempFirstNum.length > 6 && tempFirstNum.length <= 8){
        //     let decimal = tempFirst.substring(tempFirstNum.length - 4,tempFirstNum.length - 3);
        //     str = parseInt(num/10000 + "") +  "." + decimal + '万';
        // }else if(tempFirstNum.length > 8){
        //     str = parseInt(num/10000 + "") + '万';
        // }





        // if (num < 0) {
        //     idx = -1;
        // }

        // var str = "";
        // let tempStr = num.toFixed(1);//转换为指定2位小数点 string xxxxx.xx
        // let pointIndex = tempStr.indexOf("."); //得到从前往后数，离"."的多少个字符。


        // let temp = tempStr.split(".", 2);
        // let tempFirst = temp[0];

        // if (pointIndex <= 3 || !needDouhao) {
        //     str = tempFirst;
        // }
        // else {
        //     let tempstr1 = UStringHelper.toThousands(parseFloat(tempFirst));
        //     str = tempstr1;
        // }
        // if (temp[1] == "00")//小数点后面部分是00
        // {
        //     // str = tempFirst;
        //     if (pointIndex <= 3) {
        //         str = tempFirst;
        //     }
        // }
        // else {//不为0的后2位
        //     if (pointIndex <= idx || idx == -1) {
        //         if (temp[1].charAt(1) == "0")//如果是剩1位不为0，把最后的0去掉
        //         {
        //             str = str + "." + temp[1].charAt(0);
        //         } else
        //             str = str + "." + temp[1];
        //     }
        // }
        // if (temp[1] == "00")//小数点后面部分是00
        // {
        //     // str = tempFirst;
        //     if (pointIndex <= 3) {
        //         str = tempFirst;
        //     }
        // }

        // else {//不为0的后2位

        //     if (temp[1].charAt(1) == "0")//如果是剩1位不为0，把最后的0去掉
        //     {
        //         str = str + "." + temp[1].charAt(0);
        //     }
        //     if (pointIndex <= idx || idx == -1)
        //         str = str + "." + temp[1];
        // }

    }
    /**
     * qznn 样式的金钱格式化 xx,xxx.xx
     * @param num 数字
     * @returns 金钱格式化
     */
    static getMoneyFormat2(num: number, fixed: number = 0, idx: number = 4, needDouhao: boolean = true, isHall: boolean = false, isBaoxiang: boolean = false): string {
        if (num.toString().indexOf(".") != -1) {
            fixed = 2;
        }

        if (num < 0) {
            idx = -1;
        }
        var str = "";
        let tempStr = num.toFixed(fixed);
        let pointIndex = tempStr.indexOf("."); //得到从前往后数，离"."的多少个字符。
        let temp;
        if (pointIndex != -1) {
            temp = tempStr;
        } else {
            temp = tempStr.split(".", 2);
        }
        let tempFirst = temp[0];
        let tempFirstNum = temp[0].toString();



        if (tempFirstNum.length < 7 || isBaoxiang) {
            str = tempStr;
        } else {
            let decimal = tempFirst.substring(tempFirstNum.length - 4, tempFirstNum.length - 2);
            str = str = parseInt(num / 10000 + "") + "." + decimal + '万';
        }


        if (str == "0.00") str = "0"
        return str;

        // if(tempFirstNum.length < 6){
        //     if (temp[1] == "00")        //小数点后面部分是00
        //     {
        //             str = tempFirst;
        //     }else {                     //不为0的后2位
        //         if(isHall){
        //             str = tempStr;
        //         }else{
        //             str = tempFirst + "." + temp[1].charAt(0);
        //         }
        //     }
        // }else if(tempFirstNum.length == 6){
        //     let decimal = tempFirst.substring(tempFirstNum.length - 4,tempFirstNum.length - 2);
        //     str = parseInt(num/10000 + "") +  "." + decimal + '万';
        // }else if(tempFirstNum.length > 6 && tempFirstNum.length <= 8){
        //     let decimal = tempFirst.substring(tempFirstNum.length - 4,tempFirstNum.length - 3);
        //     str = parseInt(num/10000 + "") +  "." + decimal + '万';
        // }else if(tempFirstNum.length > 8){
        //     str = parseInt(num/10000 + "") + '万';
        // }





        // if (num < 0) {
        //     idx = -1;
        // }

        // var str = "";
        // let tempStr = num.toFixed(1);//转换为指定2位小数点 string xxxxx.xx
        // let pointIndex = tempStr.indexOf("."); //得到从前往后数，离"."的多少个字符。


        // let temp = tempStr.split(".", 2);
        // let tempFirst = temp[0];

        // if (pointIndex <= 3 || !needDouhao) {
        //     str = tempFirst;
        // }
        // else {
        //     let tempstr1 = UStringHelper.toThousands(parseFloat(tempFirst));
        //     str = tempstr1;
        // }
        // if (temp[1] == "00")//小数点后面部分是00
        // {
        //     // str = tempFirst;
        //     if (pointIndex <= 3) {
        //         str = tempFirst;
        //     }
        // }
        // else {//不为0的后2位
        //     if (pointIndex <= idx || idx == -1) {
        //         if (temp[1].charAt(1) == "0")//如果是剩1位不为0，把最后的0去掉
        //         {
        //             str = str + "." + temp[1].charAt(0);
        //         } else
        //             str = str + "." + temp[1];
        //     }
        // }
        // if (temp[1] == "00")//小数点后面部分是00
        // {
        //     // str = tempFirst;
        //     if (pointIndex <= 3) {
        //         str = tempFirst;
        //     }
        // }

        // else {//不为0的后2位

        //     if (temp[1].charAt(1) == "0")//如果是剩1位不为0，把最后的0去掉
        //     {
        //         str = str + "." + temp[1].charAt(0);
        //     }
        //     if (pointIndex <= idx || idx == -1)
        //         str = str + "." + temp[1];
        // }

    }

    // 对象拼接用于支付跳转
    static objtoFormdata(obj: any): string {
        if (!(obj instanceof Object) || !obj) return "";
        let param = "";
        for (let key of Object.keys(obj)) {
            param += `${key}=${obj[key]}&`;
        }
        param = (param.substring(param.length - 1) == '&') ? param.substring(0, param.length - 1) : param;
        return param;
    }

    static hasSpace(str: string) {
        if (str.indexOf(" ") == -1) {
            return false;
        } else {
            return true;
        }
        return
    }

    static charAtReverse(s: string): string {
        let length = s.length;
        let reverse: string = "";
        for (let i = 0; i < length; i++) {
            reverse = s.charAt(i) + reverse;//字符串中获取单个字符的字符的放法
        }
        return reverse;
    }

    // static createTime(v){
    //     var now = new Date(v);
    //         var yy = now.getFullYear();      //年
    //         var mm = now.getMonth() + 1;     //月
    //         var dd = now.getDate();          //日
    //         var hh = now.getHours();         //时
    //         var ii = now.getMinutes();       //分
    //         var ss = now.getSeconds();       //秒
    //         var ms = now.getMilliseconds()      //秒
    //         var clock = "";
    //         if(mm < 10) clock += "0";
    //         clock += mm + "-";
    //         if(dd < 10) clock += "0";
    //         clock += dd + " ";
    //         if(hh < 10) clock += "0";
    //         clock += hh + ":";
    //         if (ii < 10) clock += '0'; 
    //         clock += ii + ":";
    //         if (ss < 10) clock += '0'; 
    //         clock += ss;
    //      return clock;
    // }

    static createTime(timestamp) {
        let str = timestamp + "";
        if (str.length < 13) {
            timestamp = timestamp * 1000;
        }
        var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = UStringHelper.change(date.getDate()) + ' ';
        let h = UStringHelper.change(date.getHours()) + ':';
        let m = UStringHelper.change(date.getMinutes()) + ':';
        let s = UStringHelper.change(date.getSeconds());
        return Y + M + D + h + m + s;
    }

    static change(t) {
        if (t < 10) {
            return "0" + t;
        } else {
            return t;
        }
    }

    static chatStrReplace(ori: string) {
        if (typeof ori === "string") {
            for (const key in Vlb_emoj_text) {
                if (Object.prototype.hasOwnProperty.call(Vlb_emoj_text, key)) {
                    const element = Vlb_emoj_text[key];
                    if (ori.indexOf(element) != -1) {
                        let replaceStr = "<img src= \'" + key + "\'/>"
                        ori = ori.split(element).join(replaceStr);
                    }
                }
            }
        } else {
            UDebug.warn("需要replace的不是字符串")
        }
        return ori;
    }

    static createUUID() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    }

    //str：字符串    appoint：指定字符
    static validationEnd(str, appoint) {
        str = str.toLowerCase();  //不区分大小写：全部转为小写后进行判断
        var start = str.length - appoint.length;  //相差长度=字符串长度-特定字符长度
        var char = str.substr(start, appoint.length);//将相差长度作为开始下标，特定字符长度为截取长度

        if (char == appoint) { //两者相同，则代表验证通过
            return true;
        }
        return false;
    }
}
