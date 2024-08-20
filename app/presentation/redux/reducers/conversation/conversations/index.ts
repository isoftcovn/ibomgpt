import {ChatItemResponse} from '@models/chat/response/ChatItemResponse';
import {logoutActionTypes} from '@redux/actions/auth';
import {
    IMarkReadConversationPayload,
    getConversationsType,
    updateReadConversationActionTypes,
    updateUnreadConversationActionTypes,
} from '@redux/actions/conversation';
import {IAction, IReducer} from '@redux/index';
import BaseNormalListReducer from '@redux/reducers/handlers/BaseNormalListReducer';

const reducerHandler = new BaseNormalListReducer<ChatItemResponse[], any>(
    getConversationsType,
);

function extraProcess(state: IReducer<any>, action: IAction<any>) {
    if (
        action.type === updateUnreadConversationActionTypes.start ||
        action.type === updateReadConversationActionTypes.start
    ) {
        const {objectId, objectInstanceId} =
            action.payload as IMarkReadConversationPayload;
        const currentData: ChatItemResponse[] = state.data ?? [];
        const index = currentData.findIndex(
            item =>
                item.objectId === objectId &&
                item.objectInstanceId === objectInstanceId,
        );

        if (index !== -1) {
            const conversation = {...currentData[index]};
            conversation.isRead =
                action.type === updateReadConversationActionTypes.start;
            currentData[index] = conversation;
        }

        return {
            ...state,
            data: [...currentData],
        };
    }

    if (action.type === logoutActionTypes.success) {
        return reducerHandler.initialState;
    }
    return state;
}

reducerHandler.extraProcess = extraProcess;

export default reducerHandler;
