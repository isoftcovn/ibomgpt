import { registerType } from 'app/presentation/redux/actions/auth';
import BaseReducer from '../handlers/BaseReducer';

const reducerHandler = new BaseReducer<any, any>(registerType);

export default reducerHandler;
