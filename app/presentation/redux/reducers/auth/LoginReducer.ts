import { logoutActionTypes, loginType } from 'app/presentation/redux/actions/auth';
import { IAction, IReducer } from '../..';
import BaseReducer from '../handlers/BaseReducer';

const reducerHandler = new BaseReducer<any, any>(loginType);

function extraProcess(state: IReducer<any>, action: IAction<any>) {
    if (action.type === logoutActionTypes.success) {
        return reducerHandler.initialState;
    }
    return state;
}

reducerHandler.extraProcess = extraProcess;

export default reducerHandler;
