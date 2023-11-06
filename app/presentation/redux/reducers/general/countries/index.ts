import { getCountryType } from 'app/presentation/redux/actions/general/countries';
import BaseNormalListReducer from 'app/presentation/redux/reducers/handlers/BaseNormalListReducer';

const reducerHandler = new BaseNormalListReducer(getCountryType);

export default reducerHandler;
