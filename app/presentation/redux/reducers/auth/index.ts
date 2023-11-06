import { combineReducers } from 'redux';

import loginReducer from 'app/presentation/redux/reducers/auth/LoginReducer';
import registerUserReducer from './RegisterUserReducer';

export const auth = combineReducers({
    login: loginReducer.reducer,
    register: registerUserReducer.reducer,
});
