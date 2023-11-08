import LoginModel from 'app/models/auth/response/LoginModel';
import { IAuthRepository } from '.';
import { IUseCase } from '../index';
import { IUserRepository } from '../user';
import LoginRequestModel from '@models/auth/request/LoginRequestModel';
import UserModel from '@models/user/response/UserModel';

export class LoginEmailUseCase implements IUseCase<UserModel> {
    body: LoginRequestModel;
    authRepository: IAuthRepository;
    userRepository: IUserRepository;

    constructor({
        authRepository,
        userRepository,
        body,
    }: {
        authRepository: IAuthRepository,
        userRepository: IUserRepository,
        body: LoginRequestModel,
    }) {
        this.body = body;
        this.authRepository = authRepository;
        this.userRepository = userRepository;
    }

    execute = async (): Promise<UserModel> => {
        const response = await this.authRepository.loginUserEmail(this.body);
        const user = new UserModel();
        user.id = response.userId;
        user.email = response.username;
        user.fullname = response.fullname;
        await this.userRepository.saveUserCreds(this.body.username, this.body.password);
        return user;
    };
}
