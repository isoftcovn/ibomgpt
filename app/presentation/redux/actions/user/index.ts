import UploadFileRequestModel from 'app/models/general/request/UploadFileRequestModel';
import UpdateProfileRequestModel from 'app/models/user/request/UpdateProfileRequestModel';
import UserModel from 'app/models/user/response/UserModel';
import { createActionTypes } from '../helper';

const DOMAIN = 'users';

export const getProfileType = 'get_profile';
export const getProfileActionTypes = createActionTypes<any, UserModel>(getProfileType, DOMAIN);

export const updateProfileType = 'update_profile';
export const updateProfileActionTypes = createActionTypes<UpdateProfileRequestModel, UserModel>(updateProfileType, DOMAIN);

export const updateAvatarType = 'update_avatar';
export const updateAvatarActionTypes = createActionTypes<UploadFileRequestModel, UserModel>(updateAvatarType, DOMAIN);

export const changePasswordType = 'change_password';
export const changePasswordActionTypes = createActionTypes<string, any>(changePasswordType, DOMAIN);
