import { getApiController, IResource } from 'app/data/gateway/api/resource';
import { ApiType } from '../../type';

const MiddlewareTracking = (): IResource => ({
    Type: ApiType.Public,
    Path: `${getApiController()}detailed-activities`,
});

export default {
    MiddlewareTracking,
};
