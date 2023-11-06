import LoginModel from 'app/models/auth/response/LoginModel';

export interface IAuthRepository {
    registerUser: (email: string, password: string) => Promise<LoginModel>;
    loginUserEmail: (email: string, password: string) => Promise<LoginModel>;
}
