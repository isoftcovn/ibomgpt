export interface IActionParams {
    sectionId?: string;
    isAppend?: boolean;
    canLoadMore?: boolean;
    refresh?: boolean;

    [key: string]: any;
}

export interface IAction<T> {
    type: string;
    payload?: T;
    params?: IActionParams;
}

export interface IReducer<T> {
    isFetching: boolean;
    data?: T;
    params?: any;
    errorMessage?: string;
    error?: any;
    actionType: string;
    success: boolean;
    canLoadMore?: boolean;
}

export interface IErrorState {
    errorMessage?: string;
    shouldShowMessage: boolean;
    error?: any;
}

export interface ISuccessState {
    successMessage?: string;
    shouldShowMessage?: boolean;
}
