import LoginModel from 'app/models/auth/response/LoginModel';
import UploadFileRequestModel from 'app/models/general/request/UploadFileRequestModel';
import UpdateProfileRequestModel from 'app/models/user/request/UpdateProfileRequestModel';
import UserModel from 'app/models/user/response/UserModel';

export interface IUserRepository {
    logoutUser: () => Promise<boolean>;
    getProfile: () => Promise<UserModel>;
    updateProfile: (data: UpdateProfileRequestModel) => Promise<boolean>;
    uploadAvatar: (data: UploadFileRequestModel) => Promise<string>;
    resetPassword: (email: string) => Promise<boolean>;
    removeSavedToken: () => Promise<boolean>;
    getSavedUserToken: () => Array<string | undefined | null>;
    activateUserSession: () => Promise<(string | undefined | null)[]>;
    saveUserToken: (token: string, refreshToken?: string) => Promise<boolean>;
    saveUserCreds: (username: string, password: string) => Promise<boolean>;
    getUserCreds: () => Promise<string[] | undefined | null>;
    refreshToken: () => Promise<LoginModel>;
}
