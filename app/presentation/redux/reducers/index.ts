import { combineReducers } from 'redux';

import { general } from 'app/presentation/redux/reducers/general';
import { auth } from 'app/presentation/redux/reducers/auth';
import { user } from 'app/presentation/redux/reducers/user';
import errorReducer from 'app/presentation/redux/reducers/error';
import successReducer from 'app/presentation/redux/reducers/success';

export const rootReducer = combineReducers({
    general,
    auth,
    user,
    errorReducer,
    successReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
