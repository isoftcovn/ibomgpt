import { combineReducers } from 'redux';

import messagesReducer from './messages';
import participantsReducer from './participants';

export const conversation = combineReducers({
    messages: messagesReducer,
    participants: participantsReducer,
});
