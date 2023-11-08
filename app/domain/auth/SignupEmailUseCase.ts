import LoginModel from 'app/models/auth/response/LoginModel';
import { IAuthRepository } from '.';
import { IUseCase } from '../index';
import { IUserRepository } from '../user';
import Utilities from '@shared/helper/utilities';

export class SignupEmailUseCase implements IUseCase<boolean> {
    userRepository: IUserRepository;
    authRepository: IAuthRepository;

    constructor(
        {
            authRepository,
            userRepository,
        }: {
            authRepository: IAuthRepository,
            userRepository: IUserRepository,
        }
    ) {
        this.authRepository = authRepository;
        this.userRepository = userRepository;
    }

    execute = async (): Promise<boolean> => {
        await Utilities.delay(2000);
        return true;
    };
}
