export class UserReactionResponse {
    reactionId: string;
    userId: number;
    username: string;
    userAvatarUrl?: string;

    constructor(reactionId: string, userId: number, username: string, userAvatarUrl?: string) {
        this.reactionId = reactionId;
        this.userId = userId;
        this.username = username;
        this.userAvatarUrl = userAvatarUrl;
    }

    static parseFromResponse(response: any): UserReactionResponse {
        return new UserReactionResponse(
            response.react,
            response.user_sent_id,
            response.user_sent_name,
            response.user_avatar_url
        );
    }
}