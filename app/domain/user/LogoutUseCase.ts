import { IUserRepository } from '.';
import { IUseCase } from '../index';

export default class LogoutUseCase implements IUseCase<boolean> {
    userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    execute = async () => {
        await this.userRepository.logoutUser();
        await Promise.all([this.userRepository.removeSavedToken()]);
        return true;
    };
}
