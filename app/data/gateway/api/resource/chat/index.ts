import {IResource, getApiController} from '..';
import {ApiType} from '../../type';

const ChatList = (): IResource => ({
    Type: ApiType.Customer,
    Path: `${getApiController()}common/comment.do`,
});

const ChatSearchForm = (): IResource => ({
    Type: ApiType.Customer,
    Path: `${getApiController()}comment/form_search.do`,
});

const ReadConversation = (): IResource => ({
    Type: ApiType.Customer,
    Path: `${getApiController()}comment/read.do`,
});

const Reaction = (): IResource => ({
    Type: ApiType.Customer,
    Path: `${getApiController()}comment/reaction.do`,
});

export default {
    ChatList,
    ChatSearchForm,
    ReadConversation,
    Reaction,
};
