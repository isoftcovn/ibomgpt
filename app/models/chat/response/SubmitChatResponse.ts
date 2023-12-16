import UserModel from '@models/user/response/UserModel';
import { ChatMessageResponse } from './ChatMessageResponse';

export class SubmitChatResponse {
    commentId?: number;
    commentInfo?: ChatMessageResponse;
    participants?: UserModel[];

    static parseFromResponse = (data: any): SubmitChatResponse => {
        const obj = new SubmitChatResponse();
        const {userList, commentInfo, comment_id} = data;
        obj.commentId = comment_id;
        if (userList && Array.isArray(userList)) {
            obj.participants = userList.map(UserModel.parseFromChatResponse);
        }
        if (commentInfo) {
            obj.commentInfo = ChatMessageResponse.parseFromJson(commentInfo);
        }
        return obj;
    };
}
