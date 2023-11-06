import { IAction, IReducer } from '../..';
import BaseReducer from './BaseReducer';

export default class BaseSectionListReducer<State extends Record<string, any>, Action extends any[]> extends BaseReducer<Record<string, State>, Action> {

    constructor(actionType: string,
        initialState?: IReducer<State>,
        extraProcess?: (state: IReducer<Record<string, State>>, action: IAction<Action[]>) => IReducer<Record<string, State>>,
        customProcess?: (state: IReducer<Record<string, State>>, action: IAction<Action[]>) => IReducer<Record<string, State>>) {
        super(actionType, initialState, extraProcess, customProcess);
        // @ts-ignore
        this.initialState = initialState ?? {
            isFetching: false,
            params: undefined,
            data: undefined,
            error: undefined,
            errorMessage: undefined,
            success: false,
            actionType: '',
            canLoadMore: {},
        };
    }

    convertActionDataToReducer = (data?: Action[]): State | undefined => {
        return data as unknown as State;
    };

    processSuccess = (state: IReducer<Record<string, State>>, action: IAction<Action[]>): IReducer<Record<string, State>> => {
        const newData = state.data ? { ...state.data } : {};
        const payload = action.payload!;
        const isAppend = action.params?.isAppend ?? false;
        const sectionId = action.params?.sectionId ?? 'defaultt';
        let dataList = newData[sectionId] ?? [];
        if (isAppend) {
            dataList = dataList.concat(this.convertActionDataToReducer(payload)!);
        } else {
            dataList = this.convertActionDataToReducer(payload)!;
        }
        newData[sectionId] = dataList;

        const canLoadMore = state.canLoadMore ?? {};

        return {
            ...state,
            isFetching: false,
            data: newData,
            errorMessage: undefined,
            success: true,
            actionType: action.type,
            // @ts-ignore
            canLoadMore: {
                ...canLoadMore,
                [sectionId]: action.params ? !!action.params.canLoadMore : true,
            },
        };
    };
}
