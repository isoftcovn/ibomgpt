import User from 'app/data/gateway/api/resource/user';
import General from 'app/data/gateway/api/resource/general';
import Auth from 'app/data/gateway/api/resource/auth';
import Chat from 'app/data/gateway/api/resource/chat';
import { ApiType } from '../type';

export interface IResource {
    Type: ApiType;
    Path: string;
}

export const getApiController = () => '/';

export const AppResource = {
    User,
    General,
    Auth,
    Chat,
};
