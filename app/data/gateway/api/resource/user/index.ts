import { ApiType } from 'app/data/gateway/api/type';
import { getApiController, IResource } from 'app/data/gateway/api/resource';

const ChangePassword = (): IResource => ({
    Type: ApiType.Customer,
    Path: `${getApiController()}change-passw`,
});

const Profile = (): IResource => ({
    Type: ApiType.Customer,
    Path: `${getApiController()}members`,
});

const UpdateProfile = (): IResource => ({
    Type: ApiType.Customer,
    Path: `${getApiController()}updateProfile`,
});

const UploadFile = (): IResource => ({
    Type: ApiType.Customer,
    Path: `${getApiController()}user-avatar`,
});

export default {
    Profile,
    ChangePassword,
    UpdateProfile,
    UploadFile,
};

