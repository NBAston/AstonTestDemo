
export class mailData {
    mailId: string;                   // 邮件唯一编号
    userId: number;                   // 邮件玩家ID, 0:表示系统消息.
    mailTitle: string;                   // 邮件标题
    mailContent: string;                   // 邮件内容
    rewardScore: number;                   // 奖励积分
    senderName: string;                   // sender main name
    sendTime: string;                   // 邮件时间
    mailDelType: number;                   // 邮件删除类型(1:表示阅后即毁, 2:普通邮件)
    mailType: number;			// 邮件类型(1:普通邮件, 2:道具邮件)
    status: number;			// 邮件状态(0:表示未读, 1:表示已读, 2:登录弹框) 
}

export class PublicNoticeItem {
    Id: number;  // 公告唯一编号
    sortId: number;// 公告排序
    title: string;// 公告标题
    content: string;// 公告内容
    bPopShow: number;// 是否弹窗公告
}

export enum EAnnType
{
    Ann=1,
    OnlineGM=2,
    QQGM=3,
}
export class UIAnnData
{
    type:EAnnType;
    data:any;
}