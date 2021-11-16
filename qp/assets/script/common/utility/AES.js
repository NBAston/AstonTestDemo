const { RSA_NO_PADDING } = require('constants');
const CryptoJS = require('crypto-js');
import RsaKey from "./RsaKey";
import ByteArray, { Endian } from "../net/socket/ByteArray";
import UDebug from "../utility/UDebug"
const _iv = [0, 0, 0 , 0 , 0 ,0 , 0 ,0 , 0 , 0 ,0 ,0 ,0, 0, 0, 0 ]

function wordArrayToUint8 (array) {
  var bin = new Uint8Array(array.length * 4);
  for(var i = 0; i < array.length; i++) {
      var num = array[i];
      if (num < 0) {
          num = array[i] + 0x100000000;
      }
      bin[i * 4 + 0] = (num >>> 24) & 0xFF;
      bin[i * 4 + 1] = (num >>> 16) & 0xFF;
      bin[i * 4 + 2] = (num >>> 8) & 0xFF;
      bin[i * 4 + 3] = (num >>> 0) & 0xFF;
  }
  return bin;
};

function base64ToUint8Array(base64String) {
  　　　　const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
                    .replace(/\-/g, '+')
                    .replace(/_/g, '/');
  
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
  
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
      };

var MYAES = {
  // 构建WordArray对象
  int8parse: function (u8arr) {
    var len = u8arr.length;
    var words = [];
    for (var i = 0; i < len; i++) {
        words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
    }
    return CryptoJS.lib.WordArray.create(words, len);
  },

  aesCbcPkcs7Encrypt: function (srcdata, aeskey) {
    // UDebug.Log('key length'+ aeskey.length);
    if (typeof srcdata == "string") {
      let unit8Str = new RsaKey().stringToUint8Array(srcdata); 
      let data = this.int8parse(unit8Str)
      // UDebug.Log('加密data'+ data);
      var iv = this.getIV();
      // UDebug.Log('加密iv'+ iv);
      var key = this.int8parse(aeskey);//密钥
      var encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      var retArray = new Int8Array(base64ToUint8Array(encrypted));
    } else {
      var data = this.int8parse(srcdata);//加密字符串
      var key = this.int8parse(aeskey);//密钥
      var iv = this.getIV();
      // UDebug.Log('加密iv'+ iv);
      //加密
      // UDebug.Log('加密data'+ data);
      //var data = JSON.stringify(data);//将数据对象转换为json字符串
      var encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      var retArray = new Int8Array(base64ToUint8Array(encrypted));
    }
    return retArray;
  },
  aesCbcPkcs7Decrypt: function (aesdata, aeskey) {
    var data = this.int8parse(aesdata);//加密字符串
    var key = this.int8parse(aeskey);//密钥
    var iv = this.getIV();
    //加密
    //var data = JSON.stringify(data);//将数据对象转换为json字符串
    // UDebug.Log('解密iv'+ iv);
    var base64Str = CryptoJS.enc.Base64.stringify(data);
    var decrypted = CryptoJS.AES.decrypt(base64Str, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    var retArray = [];
    if (decrypted.sigBytes > 0) {
      retArray = wordArrayToUint8(decrypted.words);
      let len = retArray[retArray.length - 1];
      retArray = retArray.slice(0, retArray.length - len);
      // retArray = wordArrayToUint8(decrypted.words);
    }
    // UDebug.Log(retArray);
    return retArray;
  },

  getCrc(buff, len) {
    let bufflen = Math.floor(len / 2);
    let sum = 0;
    /**校验 crc */
    for (let i = 0; i < bufflen; i++) {
        sum += buff.readUnsignedShort();
    }
    let aa = len % 2;
    if (aa != 0) {
        sum += buff.readUnsignedByte();
    }
    sum = sum % 65536;
    return sum;
  },

  getIV() {
      let _tempByteArr = new ByteArray();
      for (let index = 0; index < 15; index++) {
        _tempByteArr.writeUnsignedInt(0);
      }
      _tempByteArr.position = 0;
      let len = _tempByteArr.length;
      let crc = this.getCrc(_tempByteArr, len);
      _tempByteArr.position = 0;
      let writeArr = new ByteArray();
      writeArr.writeUnsignedShort(len);
      writeArr.writeUnsignedShort(crc);
      writeArr.writeBytes(_tempByteArr);
      _tempByteArr.clear();
      var iv = this.int8parse(writeArr);
      return iv
  }
}

module.exports = MYAES