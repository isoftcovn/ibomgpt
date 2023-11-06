import LoginRequestModel from '@models/auth/request/LoginRequestModel';
import LoginModel from 'app/models/auth/response/LoginModel';

export interface IAuthRepository {
    registerUser: (email: string, password: string) => Promise<LoginModel>;
    loginUserEmail: (request: LoginRequestModel) => Promise<LoginModel>;
}
