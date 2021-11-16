import { QRCode, QRErrorCorrectLevel } from "./QRcode";
import UDebug from "./UDebug";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UQRCode extends cc.Component {

	make(url: string) {
		//注意 最好把qrImage与qrcode的节点长宽设置为2的倍数。不然可能会出现无法识别二维码
		var ctx = this.node.getComponent(cc.Graphics);
		if (!ctx) ctx = this.node.addComponent(cc.Graphics);
		if (typeof (url) !== 'string') {
			UDebug.Log('url is not string' + url);
			return;
		}
		ctx.clear(true);
		this.QRCreate(ctx, url);
	}

	private QRCreate(ctx, url): void {
		var qrcode = new QRCode(-1, QRErrorCorrectLevel.H);
		qrcode.addData(url);
		qrcode.make();

		ctx.fillColor = cc.Color.BLACK;
		//块宽高
		var tileW = this.node.width / qrcode.getModuleCount();
		var tileH = this.node.height / qrcode.getModuleCount();

		// draw in the Graphics
		for (var row = 0; row < qrcode.getModuleCount(); row++) {
			for (var col = 0; col < qrcode.getModuleCount(); col++) {
				if (qrcode.isDark(row, col)) {
					// ctx.fillColor = cc.Color.BLACK;
					var w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW));
					var h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW));
					ctx.rect(Math.round(col * tileW), Math.round(row * tileH), w, h);
					ctx.fill();
				}
			}
		}
	}
}
