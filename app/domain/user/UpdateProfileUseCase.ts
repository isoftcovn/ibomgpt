import UpdateProfileRequestModel from 'app/models/user/request/UpdateProfileRequestModel';
import { IUserRepository } from '.';
import { IUseCase } from '../index';

export class UpdateProfileUseCase implements IUseCase<boolean> {
    userRepository: IUserRepository;
    request: UpdateProfileRequestModel;

    constructor(userRepository: IUserRepository, request: UpdateProfileRequestModel) {
        this.userRepository = userRepository;
        this.request = request;
    }

    execute = () => this.userRepository.updateProfile(this.request);
}
