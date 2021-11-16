import { EIconType } from "./UAllenum";
import cfg_head from "../../config/cfg_head";
import cfg_frame from "../../config/cfg_frame";
import UDebug from "../utility/UDebug";
import AppGame from "../../public/base/AppGame";

/**
 * 创建:sj
 * 作用:icon资源加载
 */
export default class UResManager {

    /**
     * 加载远程图片资源
     * @param url 图片url地址
     * @param sprite sprite组件
     */
    static loadRemoteImg(url: string, sprite: cc.Sprite) {
        // UDebug.log('loadRemoteImg   url => ', url)
        if (!url || url == '') return;
        cc.assetManager.loadRemote(url, {ext: '.png', cacheEnabled: true}, (err, texture: cc.Texture2D) => {
            if (!err) {
                let sp = new cc.SpriteFrame(texture);
                sprite && (sprite.spriteFrame = sp);
            } else {
                UDebug.log('loadRemoteImg err => ', err);
            }
        })
    }

    /**
     * 
     * @param id 
     * @param iconType 
     * @param sprite 
     */
    static load(id: number, iconType: EIconType, sprite: cc.Sprite, headImgUrl: string = '') {
        let url = "";
        if (iconType == EIconType.Head) {
            //有远程就加载远程头像
            // UDebug.log('加载头像 headImgUrl => ', headImgUrl, 'headId => ', id);
            if (headImgUrl && headImgUrl != '') {
                this.loadRemoteImg(headImgUrl, sprite);
                return;
            }

            if (cfg_head[id])
                url = cfg_head[id].url;
            else{
                UDebug.Log("没有该头像->"+id);
            }
        } else if (iconType == EIconType.Frame) {
            if (cfg_frame[id])
                url = cfg_frame[id].url;
            else{
                UDebug.Log("没有该头像框->"+id);
            }
        } else if (iconType == EIconType.chatHead) {
            if (cfg_head[id])
                url = cfg_head[id].chat_url;
            else{
                UDebug.Log("没有该聊天头像->"+id);
            }
        }
        UResManager.loadUrl(url, sprite, null, true);
    }

    static loadUrl(url: string, sprite: cc.Sprite,callBack?: Function, isAddRef?: boolean): void {
        if (url == null || url == undefined || url == "") return;
        cc.loader.loadRes(url, cc.SpriteFrame, (error, res) => {
            if (error == null) {
                if (sprite && sprite.isValid) {
                    sprite.spriteFrame = res;
                    isAddRef && res.addRef();
                    //加载成功后
                    if (callBack) {
                        callBack();
                    }
                }
            } else {
                UDebug.Log(error);
            }
        });
    }

    //从Bundle目录获得资源
    static loadUrlByBundle(bundleName:string,url: string, sprite: cc.Sprite,callBack?: Function): void {
        if (bundleName == "") return 
        if (url == null || url == undefined || url == "") return
        let bundle = cc.assetManager.getBundle(bundleName)
        bundle.load(url, cc.SpriteFrame, (error, res:any) => {
            if (error == null) {
                if (sprite && sprite.isValid) {
                    sprite.spriteFrame = res;
                    //加载成功后
                    if (callBack) {
                        callBack();
                    }
                }
            } else {
                UDebug.Log(error);
            }
        });
    }


    static loadRemote(url: string, sprite: cc.Sprite, callBack?: Function): void {
        if (url == null || url == undefined || url == "") return;
        cc.loader.load(url, (error, texture) => {
            var sp = new cc.SpriteFrame(texture);
            sprite.spriteFrame = sp;
            if (callBack) {
                callBack(error);
            }
        });
    }

    /**
	 * 加载 Resources 中图片地址
	 *
	 * @param spriteFrameUrl Resources 中图片地址
	 */
	static loadSpriteFrameFromResources(spriteFrameUrl: string) {
		return new Promise<cc.SpriteFrame>((resolve, reject) => {
			cc.loader.loadRes(spriteFrameUrl, cc.SpriteFrame, (error: Error, spriteFrame) => {
				if (error != null) {
					if (CC_DEBUG) {
						cc.error(`load (${spriteFrameUrl}) failed!`);
						cc.error(error);
					}
					reject(error);
					return;
				}
				resolve(spriteFrame);
			});
		});
	}

    /**
     * 释放bundle资源
     */
    static releaseBundle() {
        let bundleName = AppGame.ins.currBundleName;
        UDebug.log('释放bundle资源 bundleName => ', bundleName);
        if (bundleName) {
            let bundle = cc.assetManager.getBundle(bundleName);
            if (bundle) {
                bundle.releaseAll();
                cc.assetManager.removeBundle(bundle);
            }
        }
    }
}
