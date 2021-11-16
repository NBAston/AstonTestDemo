
    import UHandler from "../../../common/utility/UHandler";
    import UNodeHelper from "../../../common/utility/UNodeHelper";
    import UEventHandler from "../../../common/utility/UEventHandler";
    import VWindow from "../../../common/base/VWindow";
    import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import UDebug from "../../../common/utility/UDebug";

    const { ccclass, property } = cc._decorator;
    /**
     *创建:sq
    *作用:头像管理器
    */
    @ccclass
    export default class VUploadFace extends VWindow {
    
        /**
         * 初始化 UI创建的时候调用
         */

        init(): void {
            super.init();
        }

        closeUI(){
            super.playclick();
            super.clickClose();
        }
            
        hide(): void {
            this.node.active = false;
        }
        /**
         * 显示
         */
        show(data: any): void {
            super.show(data);
        }
        
        //打开相机
        onCameraBtnClick(){
            super.playclick();
            UAPIHelper.openCameraEx();
            UDebug.Log("原生 openCameraEx 打开相机 ")
            this.closeUI()
        }

        //打开相册
        onlocalBtnClick(){
            super.playclick();
            UAPIHelper.openPhotoEx();
            UDebug.Log("原生 openPhotoEx 打开相册 ")
            this.closeUI()
        }
    }
