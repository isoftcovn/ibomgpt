import { DataStore } from '@data/sessionstore';
import LoginRequestModel from '@models/auth/request/LoginRequestModel';
import UserModel from '@models/user/response/UserModel';
import { IAuthRepository } from '.';
import { IUseCase } from '../index';
import { IUserRepository } from '../user';
import { ChatManager } from 'app/presentation/managers/ChatManager';

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
        await this.userRepository.saveUserCreds(this.body.username, this.body.password);
        const response = await this.authRepository.loginUserEmail(this.body);
        const user = new UserModel();
        user.id = response.userId;
        user.email = response.username;
        user.fullname = response.fullname;
        await this.userRepository.saveUserToken(response.token);
        DataStore.shared.apiHost = response.hostApi;
        DataStore.shared.username = this.body.username;
        if (response.chathubURI) {
            ChatManager.shared.storeChatHubURI(response.chathubURI);
        }
        return user;
    };
}
