export class MailData {
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

export enum EBtnType {
    email=1,
    service=2,
    faq=3,
}

export class LeftBtnData
{
    type:EBtnType;
    data:any;
}
