import { IDeleteMessagePayload, IEditMessagesPayload, IUpdateLocalMessageIdsPayload, deleteMessageActionTypes, editMessagesActionTypes, getMessagesActionTypes, getMessagesType, receiveNewMessagesActionTypes, sendMessagesActionTypes, updateLocalMessageIdsActionTypes } from '@redux/actions/conversation';
import { IAction, IActionParams, IReducer } from 'app/presentation/redux';
import { logoutActionTypes } from '../../../actions/auth';
import BaseSectionListReducer from '../../handlers/BaseSectionListReducer';
import produce from 'immer';
import { IAppChatMessage } from 'app/presentation/models/chat';
import { MessageHelper } from '@shared/helper/MessageHelper';

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
                    returnData = deduplicateListData(returnData);
                    console.info('Append to dataset');
                } else if (isPrepend) {
                    returnData = [...data, ...currentData];
                    returnData = deduplicateListData(returnData);
                } else {
                    // Mean that in redux already has data before. then user comebacks to this screen, API is called to sync latest chat
                    // In order not to lose all previous data, we only deduplicate new data with old data.
                    if (currentData.length > 0) {
                        returnData = removeAllLocalMessageInTheRange(currentData, data.length);
                        returnData = deduplicateListDataFromStart(returnData, data);
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

            if (isAppend) {
                draft.canLoadMore = {
                    ...draft.canLoadMore,
                    [sectionId]: data.length > 0,
                };
            }
        });
    }
    if (actionType === sendMessagesActionTypes.start) {
        const data: IAppChatMessage[] = action.payload ?? [];
        return produce(state, draft => {
            const sectionId = action.params?.sectionId ?? 'default';
            let currentData: IAppChatMessage[] = draft.data?.[sectionId] ?? [];
            draft.data[sectionId] = [...data, ...currentData];
        });
    }
    if (actionType === deleteMessageActionTypes.start) {
        const { messageId, objectId, objectInstanceId } = action.payload! as IDeleteMessagePayload;
        return produce(state, draft => {
            const sectionId = `${objectId}-${objectInstanceId}`;
            let currentData: IAppChatMessage[] = draft.data?.[sectionId] ?? [];
            const realMessageId = MessageHelper.shared.extractRealMessageId(messageId);
            const deletedIds = currentData.filter(item => parseInt(`${item._id}`, 10) === realMessageId ||
                (item.parentMessageId && item.parentMessageId == realMessageId)).map(item => item._id);
            if (deletedIds.length > 0) {
                currentData = [...currentData];
                for (const id of deletedIds) {
                    const index = currentData.findIndex(item => item._id === id);
                    if (index !== -1) {
                        currentData.splice(index, 1);
                    }
                }
            }
            draft.data[sectionId] = currentData;
        });
    }
    if (actionType === editMessagesActionTypes.start) {
        const { messages, objectId, objectInstanceId } = action.payload! as IEditMessagesPayload;
        return produce(state, draft => {
            const sectionId = `${objectId}-${objectInstanceId}`;
            let currentData: IAppChatMessage[] = draft.data?.[sectionId] ?? [];
            for (const editMessagge of messages) {
                const message = currentData.find(item => editMessagge._id === item._id);
                if (message) {
                    message.text = editMessagge.text;
                }
            }
            draft.data[sectionId] = currentData;
        });
    }
    if (actionType === updateLocalMessageIdsActionTypes.start) {
        const { messageIdsToReplace, objectId, objectInstanceId } = action.payload! as IUpdateLocalMessageIdsPayload;
        return produce(state, draft => {
            const sectionId = `${objectId}-${objectInstanceId}`;
            let currentData: IAppChatMessage[] = draft.data?.[sectionId] ?? [];
            Object.keys(messageIdsToReplace).forEach(localMessageId => {
                let didStartReplacing = false;
                for (const item of currentData) {
                    if (`${item._id}`.includes(localMessageId)) {
                        didStartReplacing = true;
                        console.log(`replacing local message: ${item._id} with ${messageIdsToReplace[localMessageId]}`);
                        item._id = `${item._id}`.replace(localMessageId, messageIdsToReplace[localMessageId]);
                    } else if (didStartReplacing) {
                        console.log(`did end replacing local message: ${localMessageId}`);
                        break;
                    }
                }
            });
            draft.data[sectionId] = currentData;
        });
    }

    return state;
}

const removeAllLocalMessageInTheRange = (currentData: IAppChatMessage[], length: number): IAppChatMessage[] => {
    // Current cache data has the same size with new incoming data --> replace all
    console.info(`Removing all local message for: Current length: ${currentData.length}.. length: ${length}`);
    if (currentData.length <= length) {
        return currentData.filter(item => !item._id.toString().startsWith('local_message'));
    } else {
        const slideLength = Math.min(length, currentData.length);
        const removedLocalDataMessages = currentData.slice(0, slideLength).filter(item => !item._id.toString().startsWith('local_message'));
        return [...removedLocalDataMessages, ...currentData.slice(slideLength)];
    }
};

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

const deduplicateListData = (data: IAppChatMessage[]): IAppChatMessage[] => {
    const result: IAppChatMessage[] = [];
    const allData = [...data];
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
