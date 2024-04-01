import { getConversationsType } from '@redux/actions/conversation';
import BaseNormalListReducer from '@redux/reducers/handlers/BaseNormalListReducer';

const reducerHandler = new BaseNormalListReducer<any, any>(getConversationsType);

export default reducerHandler;
