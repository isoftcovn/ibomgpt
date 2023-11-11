import { combineReducers } from 'redux';

import messagesReducer from './messages';

export const conversation = combineReducers({
    messages: messagesReducer,
});
