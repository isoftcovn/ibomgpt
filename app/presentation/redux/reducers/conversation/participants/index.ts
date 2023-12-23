import UserModel from '@models/user/response/UserModel';
import { updateConversationParticipantsActionTypes } from '@redux/actions/conversation';
import { IAction, IActionParams } from 'app/presentation/redux';
import produce from 'immer';

interface IState {
    isFetching: boolean;
    params?: IActionParams;
    data: Record<string, UserModel[]>;
    error?: any;
    errorMessage?: string;
    success: boolean;
    actionType: string;
    canLoadMore: Record<string, boolean>;
}

const initialState: IState = {
    isFetching: false,
    params: undefined,
    data: {},
    error: undefined,
    errorMessage: undefined,
    success: false,
    actionType: '',
    canLoadMore: {},
};

export default function (state = initialState, action: IAction<any>) {
    const actionType = action.type;
    if (actionType === updateConversationParticipantsActionTypes.start) {
        const sectionId = action.params?.sectionId ?? '';
        const currentUsers = state.data[sectionId] ?? [];
        const newUsers = (action.payload ?? []) as UserModel[];
        const userIdObj: Record<number, boolean> = {};

        for (const user of currentUsers) {
            userIdObj[user.id] = true;
        }
        let needUpdate = false;
        for (const user of newUsers) {
            if (!userIdObj[user.id]) {
                needUpdate = true;
                break;
            }
        }

        if (needUpdate) {
            const data = {...state.data};
            data[sectionId] = newUsers;
            return produce(state, draft => {
                draft.params = action.payload;
                draft.data = data;
                draft.actionType = action.type;
            });
        }
        return state;
    }
    return state;
}
