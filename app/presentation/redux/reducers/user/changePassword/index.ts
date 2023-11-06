import { changePasswordType } from '../../../actions/user';
import BaseReducer from '../../handlers/BaseReducer';

const reducerHandler = new BaseReducer<any, any>(changePasswordType);

export default reducerHandler;
