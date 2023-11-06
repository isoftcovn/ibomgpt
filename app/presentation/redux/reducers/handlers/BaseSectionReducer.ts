import { IAction, IReducer } from '../..';
import BaseReducer from './BaseReducer';

export default class BaseSectionReducer<State extends Record<string, any>> extends BaseReducer<Record<string, State>, any> {

    constructor(actionType: string,
        initialState?: IReducer<State>,
        extraProcess?: (state: IReducer<Record<string, State>>, action: IAction<any>) => IReducer<Record<string, State>>,
        customProcess?: (state: IReducer<Record<string, State>>, action: IAction<any>) => IReducer<Record<string, State>>) {
        super(actionType, initialState, extraProcess, customProcess);
        this.initialState = initialState ?? {
            isFetching: false,
            params: undefined,
            data: {},
            error: undefined,
            errorMessage: undefined,
            success: false,
            actionType: '',
        };
    }

    convertActionDataToReducer = (data?: any): State | undefined => {
        return data as unknown as State;
    };

    processSuccess = (state: IReducer<Record<string, State>>, action: IAction<any>): IReducer<Record<string, State>> => {
        const newData = state.data ? { ...state.data } : {};
        const payload = action.payload!;
        const sectionId = action.params?.sectionId ?? 'default';
        newData[sectionId] = this.convertActionDataToReducer(payload)!;

        return {
            ...state,
            isFetching: false,
            data: newData,
            errorMessage: undefined,
            success: true,
            actionType: action.type,
        };
    };
}
