export interface IComment{
    id: string;
    userId: string;
    username: string;
    avatar: string;
    text: string;
    createdAt: Date;
    likes: number;
    likedByUserIds: string[];
    parentCommentId: string;
    repliesCount: number;
    replies: IComment[];
}