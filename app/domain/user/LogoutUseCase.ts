import AppManager from '@shared/managers/AppManager';
import {IUserRepository} from '.';
import {IUseCase} from '../index';

export default class LogoutUseCase implements IUseCase<boolean> {
    userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    execute = async () => {
        await this.userRepository.logoutUser();
        AppManager.appState = {
            credentialsReadyForAuth: false,
            credentialsReadyForUnauth: true,
        };
        // await Promise.all([this.userRepository.removeSavedToken()]);
        return true;
    };
}
