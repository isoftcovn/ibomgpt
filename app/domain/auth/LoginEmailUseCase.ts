import LoginModel from 'app/models/auth/response/LoginModel';
import { IAuthRepository } from '.';
import { IUseCase } from '../index';
import { IUserRepository } from '../user';

export class LoginEmailUseCase implements IUseCase<LoginModel> {
    email: string;
    password: string;
    authRepository: IAuthRepository;
    userRepository: IUserRepository;

    constructor({
        authRepository,
        userRepository,
        email,
        password,
    }: {
        authRepository: IAuthRepository,
        userRepository: IUserRepository,
        email: string,
        password: string
    }) {
        this.email = email;
        this.password = password;
        this.authRepository = authRepository;
        this.userRepository = userRepository;
    }

    execute = async (): Promise<LoginModel> => {
        const response = await this.authRepository.loginUserEmail(this.email, this.password);
        await this.userRepository.saveUserToken(response.token, response.refreshToken);
        return response;
    };
}
