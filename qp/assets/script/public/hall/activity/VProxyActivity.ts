import VActivityItem from "./VActivityItem";
import { UIActivityQRCodeData } from "./ActivityData";
import UQRCode from "../../../common/utility/UQRCode";
import UNodeHelper from "../../../common/utility/UNodeHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VProxyActivity extends VActivityItem {

    private _data: UIActivityQRCodeData;
    private _qr: UQRCode;
    init(): void {
        this._qr = UNodeHelper.getComponent(this.node, "qrnode", UQRCode);
    }
    bind(data: UIActivityQRCodeData): void {
        super.bind(data);
        this._data = data;
        this._qr.make(this._data.url);
    }
}
