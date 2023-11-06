import LoginRequestModel from 'app/models/auth/request/LoginRequestModel';
import RegisterRequestModel from 'app/models/auth/request/RegisterRequestModel';
import UserModel from 'app/models/user/response/UserModel';
import { createActionTypes } from '../helper';

const DOMAIN = 'auth';

export const loginType = 'login_user';
export const loginActionTypes = createActionTypes<LoginRequestModel, UserModel>(loginType, DOMAIN);

export const registerType = 'register_user';
export const registerActionTypes = createActionTypes<RegisterRequestModel, boolean>(registerType, DOMAIN);

export const logoutType = 'logout_user';
export const logoutActionTypes = createActionTypes(logoutType, DOMAIN);
