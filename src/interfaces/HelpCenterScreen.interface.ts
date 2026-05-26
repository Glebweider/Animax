export interface ITicket {
    adminId: string;
    adminNickname: string;
    createdAt: string;
    id: string;
    messages: IMessage[];
    priority: number;
    reason: string;
    tags: string[];
    userId: string;
    userNickname: string;
}

export interface IMessage {
    id: string;
    text: string;
    senderId: string;
    createdAt: string;
}
