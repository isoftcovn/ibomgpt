import { combineReducers } from 'redux';

import messagesReducer from './messages';
import participantsReducer from './participants';
import conversationsReducer from './conversations';
import conversationNameReducer from './messages/ConversationNameReducer';

export const conversation = combineReducers({
    messages: messagesReducer,
    participants: participantsReducer,
    conversations: conversationsReducer.reducer,
    conversationName: conversationNameReducer,
});
