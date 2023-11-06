import { IAction, IReducer } from '../..';
import {
    ACTION_PREFIX,
    REFRESH_ACTION_PREFIX,
    LOADMORE_ACTION_PREFIX,
    FAILED_ACTION_SUFFIX,
    SUCCESS_ACTION_SUFFIX,
} from '../../../../shared/constants';

import produce from 'immer';

export interface IBaseReducer<State extends Record<string, any>, Action extends Record<string, any>> {
    actionType: string;
    initialState: IReducer<State>;
    processFetching: (state: IReducer<State>, action: IAction<Action>) => IReducer<State>;
    processSuccess: (state: IReducer<State>, action: IAction<Action>) => IReducer<State>;
    processFailed: (state: IReducer<State>, action: IAction<Action>) => IReducer<State>;
    reducer: (state: IReducer<State>, action: IAction<Action>) => IReducer<State>;
    // Replace whole process of class
    customProcess?: (state: IReducer<State>, action: IAction<Action>) => IReducer<State>;
    // Run after process of class
    extraProcess?: (state: IReducer<State>, action: IAction<Action>) => IReducer<State>;
    convertActionDataToReducer: (data?: Action) => State | undefined;
}

export default class BaseReducer<State extends Record<string, any>, Action extends Record<string, any>> implements IBaseReducer<State, Action> {
    customProcess?: (state: IReducer<State>, action: IAction<Action>) => IReducer<State>;
    extraProcess?: (state: IReducer<State>, action: IAction<Action>) => IReducer<State>;
    initialState: IReducer<State>;
    actionType: string;

    constructor(actionType: string,
        initialState?: IReducer<State>,
        extraProcess?: (state: IReducer<State>, action: IAction<Action>) => IReducer<State>,
        customProcess?: (state: IReducer<State>, action: IAction<Action>) => IReducer<State>) {
        this.actionType = actionType;
        this.initialState = initialState ?? {
            isFetching: false,
            params: undefined,
            data: undefined,
            errorMessage: undefined,
            error: undefined,
            success: false,
            actionType: '',
        };
        this.customProcess = customProcess;
        this.extraProcess = extraProcess;
    }

    private process = (state = this.initialState, action: IAction<Action>): IReducer<State> => {
        if (this.customProcess) {return this.customProcess(state, action);}
        const actionType = action.type.split('/')[1];
        if (actionType.includes(this.actionType)) {
            if (actionType.startsWith(ACTION_PREFIX) ||
                actionType.startsWith(REFRESH_ACTION_PREFIX) ||
                actionType.startsWith(LOADMORE_ACTION_PREFIX)) {
                return this.processFetching(state, action);
            }
            if (actionType.endsWith(SUCCESS_ACTION_SUFFIX)) {
                return this.processSuccess(state, action);
            }
            if (actionType.endsWith(FAILED_ACTION_SUFFIX)) {
                return this.processFailed(state, action);
            }
        }
        if (this.extraProcess) {return this.extraProcess(state, action);}
        return state;
    };

    convertActionDataToReducer = (data?: Action): State | undefined => {
        return data as unknown as State;
    };

    processFetching = (state: IReducer<State>, action: IAction<Action>): IReducer<State> => {
        return produce(state, draft => {
            draft.isFetching = true;
            draft.params = action.payload;
            draft.errorMessage = undefined;
            draft.success = false;
            draft.actionType = action.type;
        });
    };

    processFailed = (state: IReducer<State>, action: IAction<Action>): IReducer<State> => {
        return produce(state, draft => {
            draft.isFetching = false;
            draft.errorMessage = action.payload?.error?.toString();
            draft.error = action.payload?.error;
            draft.success = false;
            draft.actionType = action.type;
        });
    };

    processSuccess = (state: IReducer<State>, action: IAction<Action>): IReducer<State> => {
        return produce(state, draft => {
            draft.isFetching = false;
            draft.errorMessage = undefined;
            // @ts-expect-error
            draft.data = this.convertActionDataToReducer(action.payload);
            draft.error = undefined;
            draft.success = true;
            draft.actionType = action.type;
        });
    };

    reducer = (state: IReducer<State>, action: IAction<Action>): IReducer<State> => {
        return this.process(state, action);
    };
}
