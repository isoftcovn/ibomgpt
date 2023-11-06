import { IAction, ISuccessState } from '../..';
import { SUCCESS_ACTION_SUFFIX } from '../../../../shared/constants';

const initialState: ISuccessState = {
    successMessage: undefined,
    shouldShowMessage: true,
};

export default function (state = initialState, action: IAction<any>) {
    const actionType = action.type;
    if (actionType.endsWith(SUCCESS_ACTION_SUFFIX)) {
        const successMessage = action.payload?.successMessage;
        return {
            successMessage,
            shouldShowMessage: action.payload?.shouldShowMessage !== undefined ? action.payload?.shouldShowMessage : true,
        };
    }

    return initialState;
}
