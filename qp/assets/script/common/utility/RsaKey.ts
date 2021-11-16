import JSEncrypt from 'jsencrypt'
import NodeRSA = require('node-rsa');
import { compileFunction } from 'vm';
import cfg_global from '../../config/cfg_global';
import UDebug from './UDebug';
const CryptoJS = require('crypto-js');
const generateRSA = require('generateRSA');
const {ccclass, property} = cc._decorator;
const  message = 'gamepas';

const pubKey:string = "-----BEGIN PUBLIC KEY-----\n\
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMHGxPtvVXXinv/+RrU+YMTfEa\
B8SOFY2WwwEXvzddSSdYOEXhcxrJuJGhTGzUvUX/yCTmIeq/2LqYBho9MbTiAU6o\
Ve99gAAK0VbvHEW5aZQ5boMu+iUICi8oHLkN6jZLOEcU4e8vR9kVG8kF9zsIrTKE\
QS9jW0s9mhS5h9v7+QIDAQAB\n\
-----END PUBLIC KEY-----"
 const priKey:string = "-----BEGIN PRIVATE KEY-----\n\
MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMwcbE+29VdeKe//\
5GtT5gxN8RoHxI4VjZbDARe/N11JJ1g4ReFzGsm4kaFMbNS9Rf/IJOYh6r/YupgG\
Gj0xtOIBTqhV732AAArRVu8cRblplDlugy76JQgKLygcuQ3qNks4RxTh7y9H2RUb\
yQX3OwitMoRBL2NbSz2aFLmH2/v5AgMBAAECgYBGKLL2R55XdK+Xpm7ekY0ux4/L\
ccYXTMNJgigbAIhIUX/rrBQhJY6crguo1PtHuPOZszMzw47MePPSk65rQG268DFY\
6vItDH/w+lFvGDdrDAyw05i15kM1vBCfzBC5MF9Y8AEmYlv3NQAJpxiIDGodB68e\
DxKnPmkitsu8vE72DQJBAPd+BUP5inhvUcNElPiEFXYWOTvhnfmWkeeA1BbAA6bO\
dlw/+v3MuIWgzhOLsrjHt9CaF53/Ty1AlLYOtZK1U78CQQDTIKOoYwW9FbktUYJi\
UlB3AEIJ0P6kyjEBGIn+wxSL+IzgARLfqh9hU44rkY32jDWra8zg0Z3SVCZ0Mfov\
Fr5HAkEAiZajssB9/KpWWCo+b1Ju4/FC7Elnm6PbhUoXnnYtEYTiRDLFhGdVheR5\
7F/Tgep2BCBGVO3kxJGMmxHeW6s23QJBAIeRM8VSIEM0Cb3h0tkThfuDvOPUwU5L\
ToAno6Rk23KtXLgRuG7KLHAwWN/9DK09htDV3a6WqsJ9qlt+I+nMrs0CQEm1ntni\
kuhzDW9Ql1RkYZwmwTnl4TadlCTIROycGccNwFuehC49ZusUYqeiPwrNsx7vHAV/\
VFVugCoKVsj6Sjs=\n\
-----END PRIVATE KEY-----"


const _iv = [0, 0, 0 , 0 , 0 ,0 , 0 ,0 , 0 , 0 ,0 ,0 ,0, 0, 0, 0 ]
@ccclass
export default class RsaKey  {
    private _aesKey:string = null;
    private _priPom = null;
    private _pubPom = null;

    
    set pubPom(v : string) {
      this._pubPom = v;
    }
    
    get pubPom() : string {
      return this._pubPom;
    }
    
    set priPom(v : string) {
      this._priPom = v;
    }
    
    
    get priPom() : string {
      return this._priPom;
    }
    
    set aesKey(v : string) {
      this._aesKey = v;
    }
    
    get aesKey() : string {
      return this._aesKey;
    }
    
    private _key = "49KdgB8_9=12+3hF"; //16位
    generate(fun: Function) {
        let self = this;
        this.aesKey = this.Generate_key(16);
        // UDebug.Log("秘钥明文....", this._aesKey)
        // let Encryt = this.encryptAes("test", this._aesKey);
        // UDebug.Log("加密后1。。。。。。。",Encryt)
        // this.decryptAes(Encryt, this._aesKey);
        fun();
    }

    generateRsaKey(fun: Function) {
        let self = this;
        // let options = {default_key_size : 1024};
        // var jsGenerateKey = new JSEncrypt();
			  // self.pubPom = jsGenerateKey.getPublicKey();
			  // self.priPom = jsGenerateKey.getPrivateKey();
			  // UDebug.Log("generate Key: publicKey:", self.pubPom);
        // UDebug.Log("privateKey:", self.priPom);
        // self.pubPom = cfg_key.publickey1;
        // self.priPom = cfg_key.prikey1;
        var pair = generateRSA();
        self.pubPom = pair.public;
        self.priPom = pair.private;
        UDebug.Log("generate Key: publicKey:"+self.pubPom);
        UDebug.Log("privateKey:"+self.priPom);

        fun();
    }

    //AES加密
    encryptAes(word, paramKey) {
      if (!paramKey) {
          console.error("未生成秘钥");
          return ;
      }
      if (typeof word === "string") {
          let srcs = CryptoJS.enc.Utf8.parse(word);
          let ivStr = _iv.toString();
          let wordArray = CryptoJS.enc.Hex.parse(ivStr);
          let key = CryptoJS.enc.Utf8.parse(paramKey);
          let encrypted = CryptoJS.AES.encrypt(srcs, key, {
              iv :wordArray, 
              mode: CryptoJS.mode.CBC, 
              padding: CryptoJS.pad.Pkcs7 
          });
          UDebug.Log("AES加密后......."+ encrypted.toString());
          return encrypted.toString();
      } else {
          // let srcs = CryptoJS.enc.Utf8.parse(word);
          let ivStr = _iv.toString();
          let wordArray = CryptoJS.enc.Hex.parse(ivStr);
          // let key = CryptoJS.enc.Utf8.parse(paramKey);
          let encrypted = CryptoJS.AES.encrypt(word, paramKey, {
              iv :wordArray, 
              mode: CryptoJS.mode.CBC, 
              padding: CryptoJS.pad.Pkcs7 
          });
          UDebug.Log("AES加密后......."+ encrypted.toString());
          return encrypted.toString();
      }
    }

    // AES解密
    decryptAes(word, paramKey) {
        if (!paramKey) {
            console.error("未生成秘钥")
            return
        }
        let srcs = CryptoJS.enc.Utf8.parse(word);
        let ivStr = _iv.toString();
        let wordArray = CryptoJS.enc.Hex.parse(ivStr);
        let key = CryptoJS.enc.Utf8.parse(paramKey);

        const decrypt = CryptoJS.AES.decrypt(word, key, {
            iv: wordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        let decryptedObj = JSON.parse(decryptedStr)
        //UDebug.Log("AES解密后......."+ decryptedObj);
        return decryptedStr.toString();
    } 

    encryptAesNew(buffer, keyBuffer) {
        // var decArray = hexStrToDecArray(str);
        var wordArray = this.int8parse(buffer);
        var encrypted = CryptoJS.AES.encrypt(wordArray, this.aesKeyBytes(keyBuffer), {
            mode: CryptoJS.mode.CBC, 
            padding: CryptoJS.pad.Pkcs7
        });
        var retArray = new Int8Array(this.base64ToUint8Array(encrypted));
        return retArray;
    }

    decryptAesNew(buffer, keyBuffer) {
        var wordArray = this.int8parse(buffer);
        var base64Str = CryptoJS.enc.Base64.stringify(wordArray);
        var decrypted = CryptoJS.AES.decrypt(base64Str, this.aesKeyBytes(keyBuffer), {
            mode: CryptoJS.mode.ECB, 
            padding: CryptoJS.pad.NoPadding
        });
        let retArray = null;
        if (decrypted.sigBytes > 0) {
          retArray = this.wordArrayToUint8(decrypted.words);
          // let len = retArray[retArray.length - 1];
          // retArray = retArray.slice(0, retArray.length - len);
        }
        return retArray;
        // return wordArrayToHexStr(decrypted.words);
    } 

    // 加解密用到的密钥
    aesKeyBytes(key_Int) {
      var keyBytes = this.int8parse(key_Int);
      return keyBytes;
    }

    // 构建WordArray对象
    int8parse(u8arr) {
      var len = u8arr.length;
      var words = [];
      for (var i = 0; i < len; i++) {
          words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
      }
      return CryptoJS.lib.WordArray.create(words, len);
    }


    //RSA加密1
    encryptRsa(oriStr:any, key: string): string {
        //跟后台支付接口数据传输要对加密后数据转化成16进制
        let self = this;
        let encryptor = new JSEncrypt()  // 创建加密对象实例
        let _pubPom = this.pubPom;
        encryptor.setPublicKey(key)//设置公钥
        let encryPublickey = encryptor.encrypt(oriStr);
        UDebug.Log("RSA加密后base64..........."+ encryPublickey);
        return encryPublickey;
    }

    //RSA解密1
    decryptRsa(encryStr: string, key: string) {
        let encryptor = new JSEncrypt() ;
        let priPom = priKey;
        encryptor.setPrivateKey(key);
        let decrystr = encryptor.decrypt(encryStr)
        UDebug.Log("RSA解密后..........."+ decrystr)
        return decrystr
    }

    wordArrayToUint8 (array) {
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
    
    Generate_key(n) {
        var chars = ['0','1','2','3','4','5','6','7','8','9',
          'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
          'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
          '+', '-', '='];
        if(n==null){
            n = 8;
        }
        var res = "";
        for(var i = 0; i < n ; i ++) {
            var id = Math.floor(Math.random()*65);
            res += chars[id];
        }
        //UDebug.Log("密钥长度"+ res.length);
        return res;
    }

    Uint8ArrayToString(fileData){
      var dataString = "";
      for (var i = 0; i < fileData.length; i++) {
        dataString += String.fromCharCode(fileData[i]);
      }
      return dataString
    }

    arrayBufferToBase64(arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer);
        var byteString = "";
        for(var i = 0; i < byteArray.byteLength; i++) {
            byteString += String.fromCharCode(byteArray[i]);
        }
        var b64 = window.btoa(byteString);
        return b64
    }

    ab2str(u,f) {
      var b = new Blob([u]);
      var r = new FileReader();
       r.readAsText(b, 'utf-8');
       r.onload = function (){if(f)f.call(null,r.result)}
   }

    stringToUint8Array(string, options={stream: false}) {
      if (options.stream) {
        throw new Error(`Failed to encode: the 'stream' option is unsupported.`);
      }
    
      let pos = 0;
      const len = string.length;
      const out = [];
    
      let at = 0;  // output position
      let tlen = Math.max(32, len + (len >> 1) + 7);  // 1.5x size
      let target = new Uint8Array((tlen >> 3) << 3);  // ... but at 8 byte offset
    
      while (pos < len) {
        let value = string.charCodeAt(pos++);
        if (value >= 0xd800 && value <= 0xdbff) {
          // high surrogate
          if (pos < len) {
           const extra = string.charCodeAt(pos);
           if ((extra & 0xfc00) === 0xdc00) {
             ++pos;
             value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
           }
         }
          if (value >= 0xd800 && value <= 0xdbff) {
           continue;  // drop lone surrogate
         }
        }
    
        // expand the buffer if we couldn't write 4 bytes
        if (at + 4 > target.length) {
          tlen += 8;  // minimum extra
          tlen *= (1.0 + (pos / string.length) * 2);  // take 2x the remaining
          tlen = (tlen >> 3) << 3;  // 8 byte offset
    
          const update = new Uint8Array(tlen);
         update.set(target);
         target = update;
        }
    
        if ((value & 0xffffff80) === 0) {  // 1-byte
         target[at++] = value;  // ASCII
         continue;
        } else if ((value & 0xfffff800) === 0) {  // 2-byte
         target[at++] = ((value >>  6) & 0x1f) | 0xc0;
        } else if ((value & 0xffff0000) === 0) {  // 3-byte
         target[at++] = ((value >> 12) & 0x0f) | 0xe0;
         target[at++] = ((value >>  6) & 0x3f) | 0x80;
        } else if ((value & 0xffe00000) === 0) {  // 4-byte
         target[at++] = ((value >> 18) & 0x07) | 0xf0;
         target[at++] = ((value >> 12) & 0x3f) | 0x80;
         target[at++] = ((value >>  6) & 0x3f) | 0x80;
        } else {
          // FIXME: do we care
         continue;
        }
    
        target[at++] = (value & 0x3f) | 0x80;
      }
    
      return target.slice(0, at);
    }
    

    base64toHEX(base64) {
        var raw = atob(base64);
        var HEX = '';
        for ( let i = 0; i < raw.length; i++ ) {
          var _hex = raw.charCodeAt(i).toString(16)
          HEX += (_hex.length==2?_hex:'0'+_hex);
        }
        return HEX.toUpperCase();
   }

   base64ToUint8Array(base64String) {
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
    }

    string2buffer(str) {
      let val = ""
      for (let i = 0; i < str.length; i++) {
        val += ',' + this.code2utf8(str.charCodeAt(i))
      }
      val += ',00';
      //UDebug.Log(val);
      // 将16进制转化为ArrayBuffer
      return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
      })).buffer
    }

    code2utf8(uni) {
      let uni2 = uni.toString(2)
      if (uni < 128) {
        return uni.toString(16);
      } else if (uni < 2048) {
        uni2 = ('00000000000000000' + uni2).slice(-11);
        const s1 =  parseInt("110" + uni2.substring(0, 5), 2);
        const s2 =  parseInt("10" + uni2.substring(5), 2);
        return s1.toString(16) + ',' + s2.toString(16)
      } else {
        uni2 = ('00000000000000000' + uni2).slice(-16);
        const s1 = parseInt('1110' + uni2.substring(0, 4),2 );
        const s2 = parseInt('10' + uni2.substring(4, 10), 2 );
        const s3 = parseInt('10' + uni2.substring(10), 2);
        return s1.toString(16) + ',' + s2.toString(16) + ',' + s3.toString(16)
      }
    }

    HEXToString(sha1) {            
        var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
        var base64_rep = ""
        var ascv
        var bit_arr = 0
        var bit_num = 0
      
        for (var n = 0; n < sha1.length; ++n) {
          if (sha1[n] >= 'A' && sha1[n] <= 'Z') {
            ascv = sha1.charCodeAt(n) - 55
          } else if (sha1[n] >= 'a' && sha1[n] <= 'z') {
            ascv = sha1.charCodeAt(n) - 87
          } else {
            ascv = sha1.charCodeAt(n) - 48
          }
      
          bit_arr = (bit_arr << 4) | ascv
          bit_num += 4
          if (bit_num >= 6) {
            bit_num -= 6
      
            base64_rep += digits[bit_arr >>> bit_num]
            bit_arr &= ~ (-1 << bit_num)
          }
        }
      
        if (bit_num > 0) {
          bit_arr <<= 6 - bit_num
          base64_rep += digits[bit_arr]
        }
        var padding = base64_rep.length % 4
      
        if (padding > 0) {
          for (var n = 0; n < 4 - padding; ++n) {
            base64_rep += "="
          }
        }
        return base64_rep 
    }

    //chat encrypted
    crypt_password(word) {
      let encrypted = "";
      let key = CryptoJS.enc.Utf8.parse(this._key)
      let hashKey = CryptoJS.SHA256(key);
      let ivStr = _iv.toString();
      let wordArray =  CryptoJS.enc.Hex.parse(ivStr);
      if (typeof word == "string") {
        const srcs = CryptoJS.enc.Utf8.parse(word);
        encrypted = CryptoJS.AES.encrypt(srcs, hashKey, {
          iv: wordArray,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
      } else if (typeof word == "object") {
        //对象格式的转成json字符串
        const data = JSON.stringify(word);
        const srcs = CryptoJS.enc.Utf8.parse(data);
        encrypted = CryptoJS.AES.encrypt(srcs, hashKey, {
          iv: wordArray,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
      }
      // return encrypted.ciphertext.toString();
      return encrypted.toString();
    }

     //chat decrypted
    deCrypt_password(enCryptText: string) {
      let key = CryptoJS.enc.Utf8.parse(this._key)
      let hashKey = CryptoJS.SHA256(key);
      let ivStr = _iv.toString();
      let wordArray =  CryptoJS.enc.Hex.parse(ivStr);
      const decrypt = CryptoJS.AES.decrypt(enCryptText, hashKey, {
          iv: wordArray,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
      });
      const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
      //UDebug.Log("AES解密后......."+ decryptedStr);
      return decryptedStr.toString();
  }
}
