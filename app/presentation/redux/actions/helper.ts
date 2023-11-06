import { IAction, IActionParams } from '..';
import {
    ACTION_PREFIX, FAILED_ACTION_SUFFIX, LOADMORE_ACTION_PREFIX, REFRESH_ACTION_PREFIX, SUCCESS_ACTION_SUFFIX,
} from '../../../shared/constants';

export interface IFailedActionPayload {
    error?: any;
    errorMessage?: string;
    shouldShowMessage?: boolean;
}

interface IActionType<Request, Result> {
    start: string;
    success: string;
    failed: string;
    startAction: (payload?: Request, params?: IActionParams) => IAction<Request>;
    successAction: (payload?: Result, params?: IActionParams) => IAction<Result>;
    failedAction: (payload?: IFailedActionPayload, params?: IActionParams) => IAction<any>;
}

interface IListViewActionType<Request, Result> extends IActionType<Request, Result> {
    refresh: string;
    loadMore: string;
    refreshAction: (payload?: Request, params?: IActionParams) => IAction<Request>;
    loadmoreAction: (payload?: Request, params?: IActionParams) => IAction<Request>;
}

export const createActionTypes = <Request, Result>(actionType: string, domain = 'app'): IActionType<Request, Result> => {
    const actionTypes = {
        start: `${domain}/${ACTION_PREFIX}_${actionType}`,
        success: `${domain}/${actionType}_${SUCCESS_ACTION_SUFFIX}`,
        failed: `${domain}/${actionType}_${FAILED_ACTION_SUFFIX}`,
    };

    return {
        ...actionTypes,
        startAction: (payload, params) => ({
            type: actionTypes.start,
            payload,
            params,
        }),
        successAction: (payload, params) => ({
            type: actionTypes.success,
            payload,
            params,
        }),
        failedAction: (payload, params) => ({
            type: actionTypes.failed,
            payload,
            params,
        }),
    };
};

export const createListViewActionTypes = <Request, Result>(actionType: string): IListViewActionType<Request, Result> => {
    const actionTypes = {
        refresh: `${REFRESH_ACTION_PREFIX}_${actionType}`,
        loadMore: `${LOADMORE_ACTION_PREFIX}_${actionType}`,
    };
    return {
        ...createActionTypes(actionType),
        ...actionTypes,
        refreshAction: (payload, params) => ({
            type: actionTypes.refresh,
            payload,
            params,
        }),
        loadmoreAction: (payload, params) => ({
            type: actionTypes.loadMore,
            payload,
            params,
        }),
    };
};
