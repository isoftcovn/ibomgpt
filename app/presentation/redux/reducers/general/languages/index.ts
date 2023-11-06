import { changeLanguageType } from '../../../actions/general';
import BaseReducer from '../../handlers/BaseReducer';

const reducerHandler = new BaseReducer<any, any>(changeLanguageType);

export default reducerHandler;
