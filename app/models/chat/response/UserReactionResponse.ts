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
            response.reaction_id,
            response.user_id,
            response.username,
            response.user_avatar_url
        );
    }
}