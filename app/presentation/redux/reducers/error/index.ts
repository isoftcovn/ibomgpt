import { IFailedActionPayload } from '@redux/actions/helper';
import { IAction, IErrorState } from '../..';
import { FAILED_ACTION_SUFFIX } from '../../../../shared/constants';
import { getString } from '../../../localization';

const initialState: IErrorState = {
    errorMessage: undefined,
    shouldShowMessage: true,
    error: undefined,
};

export default function (state = initialState, action: IAction<IFailedActionPayload>) {
    const actionType = action.type;
    if (actionType.endsWith(FAILED_ACTION_SUFFIX)) {
        let errorMessage = '';
        if (action.payload && action.payload.error) {
            if (action.payload.error.toString()) {
                errorMessage = action.payload.error.toString();
            } else {
                const errorCode: string = action.payload.error.code ?? '500';
                // @ts-ignore
                errorMessage = getString(`${errorCode}`).toString();
            }
        } else {
            errorMessage = getString('500').toString();
        }
        return {
            error: action.payload?.error,
            errorMessage,
            shouldShowMessage: action.payload && action.payload.shouldShowMessage !== undefined ? action.payload.shouldShowMessage : true,
        };
    }

    return initialState;
}
