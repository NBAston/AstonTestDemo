import { EIconType } from "../../../../common/base/UAllenum";
import UResManager from "../../../../common/base/UResManager";
import UEventHandler from "../../../../common/utility/UEventHandler";
import VFriendGameChat from "./VFriendGameChat";

const { ccclass, property } = cc._decorator;
@ccclass
export default class CommonChatItem extends cc.Component {

    _manager: VFriendGameChat = null;

    onLoad() {

    }

    setEmojItem(pageIndex: number, manager: VFriendGameChat): void {
        let items = this.node.children;
        this._manager = manager;
        let emojUrl = "";
        for (let index = 0; index < items.length; index++) {
            const item = items[index];
            emojUrl = "common/texture/game_chat/game_chat_emoj/game_emoj_" + (pageIndex * 5 + index);
            UResManager.loadUrl(emojUrl, item.getChildByName('chat').getComponent(cc.Sprite));
            UEventHandler.addClick(item, this.node, "CommonChatItem", "onClickEmojItem", (pageIndex * 5 + index));
            // this._manager.onClickEmojItem(pageIndex*5 + index)
        }
    }

    onClickEmojItem(event: any, id: number) {
        this._manager.onClickEmojItem(id);
    }


}
