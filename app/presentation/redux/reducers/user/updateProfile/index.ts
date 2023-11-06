import { IAction, IReducer } from 'app/presentation/redux';
import { logoutActionTypes } from '../../../actions/auth';
import { updateProfileType } from '../../../actions/user';
import BaseReducer from '../../handlers/BaseReducer';

const reducerHandler = new BaseReducer<any, any>(updateProfileType);

function extraProcess(state: IReducer<any>, action: IAction<any>) {
    if (action.type === logoutActionTypes.success) {
        return reducerHandler.initialState;
    }
    return state;
}

reducerHandler.extraProcess = extraProcess;

export default reducerHandler;
