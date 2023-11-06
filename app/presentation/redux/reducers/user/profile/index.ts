import { IAction, IReducer } from 'app/presentation/redux';
import { logoutActionTypes } from '../../../actions/auth';
import { getProfileType } from '../../../actions/user';
import BaseReducer from '../../handlers/BaseReducer';

const reducerHandler = new BaseReducer<any, any>(getProfileType);

function extraProcess(state: IReducer<any>, action: IAction<any>) {
    if (action.type === logoutActionTypes.success) {
        return reducerHandler.initialState;
    }
    return state;
}

reducerHandler.extraProcess = extraProcess;

export default reducerHandler;
