import { getApiController, IResource } from '..';
import { ApiType } from '../../type';

const Login = (): IResource => ({
    Type: ApiType.Public,
    Path: `${getApiController()}auth.do`,
});

const Register = (): IResource => ({
    Type: ApiType.Public,
    Path: `${getApiController()}register`,
});

export default {
    Login,
    Register,
};
