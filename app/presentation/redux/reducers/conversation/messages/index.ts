import { getMessagesType } from '@redux/actions/conversation';
import { IAction, IReducer } from 'app/presentation/redux';
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

export default reducerHandler;
