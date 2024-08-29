import { getApiController, IResource } from 'app/data/gateway/api/resource';
import { ApiType } from '../../type';

const MiddlewareTracking = (): IResource => ({
    Type: ApiType.Public,
    Path: `${getApiController()}detailed-activities`,
});

const CheckVersion = (): IResource => ({
    Type: ApiType.Public,
    Path: `${getApiController()}ibot/version.do`,
});

export default {
    MiddlewareTracking,
    CheckVersion,
};
