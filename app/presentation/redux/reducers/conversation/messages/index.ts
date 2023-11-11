import { getMessagesActionTypes, getMessagesType } from '@redux/actions/conversation';
import { IAction, IActionParams, IReducer } from 'app/presentation/redux';
import { logoutActionTypes } from '../../../actions/auth';
import BaseSectionListReducer from '../../handlers/BaseSectionListReducer';
import produce from 'immer';
import { IAppChatMessage } from 'app/presentation/models/chat';

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
    data: Record<string, IAppChatMessage[]>;
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
    if (actionType === getMessagesActionTypes.start) {
        return produce(state, draft => {
            draft.isFetching = true;
            draft.params = action.payload;
            draft.errorMessage = undefined;
            draft.success = false;
            draft.actionType = action.type;
        });
    }
    if (actionType === getMessagesActionTypes.failed) {
        return produce(state, draft => {
            draft.isFetching = false;
            draft.errorMessage = action.payload?.error?.toString();
            draft.error = action.payload?.error;
            draft.success = false;
            draft.actionType = action.type;
        });
    }
    if (actionType === getMessagesActionTypes.success) {
        const data: IAppChatMessage[] = action.payload ?? [];
        const isAppend = action.params?.isAppend ?? false;
        const isPrepend = action.params?.isPrepend ?? false;
        const sectionId = action.params?.sectionId ?? 'default';
        return produce(state, draft => {
            draft.isFetching = false;
            draft.errorMessage = undefined;
            draft.success = true;
            draft.actionType = action.type;

            let currentData: IAppChatMessage[] = draft.data?.[sectionId] ?? [];
            let returnData: IAppChatMessage[] = [];
            if (data.length > 0) {
                if (isAppend) {
                    returnData = currentData.concat(data);
                    console.info('Append to dataset');
                } else {
                    // Mean that in redux already has data before. then user comebacks to this screen, API is called to sync latest chat
                    // In order not to lose all previous data, we only deduplicate new data with old data.
                    if (currentData.length > 0) {
                        returnData = deduplicateListDataFromStart(currentData, data);
                        console.info('Deduplicate messages');
                    } else {
                        returnData = data;
                        console.info('Replace the whole dataset');
                    }
                }
                if (!draft.data) {
                    draft.data = {};
                }
                draft.data[sectionId] = returnData;
            }

            draft.canLoadMore = {
                ...draft.canLoadMore,
                [sectionId]: data.length > 0,
            };
        });
    }

    return initialState;
}

const deduplicateListDataFromStart = (currentData: IAppChatMessage[], newData: IAppChatMessage[]): IAppChatMessage[] => {
    const result: IAppChatMessage[] = [];
    const allData = [...newData, ...currentData];
    const allDataMap: Record<string, IAppChatMessage> = {};
    for (const item of allData) {
        // Check to keep new data as new data will be at the beginning of array
        if (!allDataMap[`${item._id}`]) {
            allDataMap[`${item._id}`] = item;
            result.push(item);
        }
    }

    return result;
};
