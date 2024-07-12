import {
    getMessagesActionTypes,
    getMessagesType
} from '@redux/actions/conversation';
import { IAction, IActionParams, IReducer } from 'app/presentation/redux';
import produce from 'immer';
import { logoutActionTypes } from '../../../actions/auth';
import BaseSectionListReducer from '../../handlers/BaseSectionListReducer';

const reducerHandler = new BaseSectionListReducer<any, any>(getMessagesType);

function extraProcess(state: IReducer<any>, action: IAction<any>) {
    if (action.type === logoutActionTypes.success) {
        return reducerHandler.initialState;
    }
    return state;
}

reducerHandler.extraProcess = extraProcess;

interface IState {
    isFetching: boolean;
    params?: IActionParams;
    data: Record<string, string>;
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
    if (actionType === getMessagesActionTypes.success) {
        const roomName = action.params?.roomName;
        const sectionId = action.params?.sectionId ?? 'default';
        return produce(state, draft => {
            draft.isFetching = false;
            draft.errorMessage = undefined;
            draft.success = true;
            draft.actionType = action.type;
            const currentState = draft.data;
            currentState[sectionId] = roomName;
            draft.data = currentState;
        });
    }

    return state;
}
