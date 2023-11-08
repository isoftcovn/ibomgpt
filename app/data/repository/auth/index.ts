import LoginRequestModel from '@models/auth/request/LoginRequestModel';
import ApiGateway from 'app/data/gateway/api';
import { AppResource } from 'app/data/gateway/api/resource';
import { IAuthRepository } from 'app/domain/auth';
import LoginModel from 'app/models/auth/response/LoginModel';
import DeviceInfo from 'react-native-device-info';

export class AuthRepository implements IAuthRepository {
    registerUser = async (email: string, password: string): Promise<LoginModel> => {
        const resource = AppResource.Auth.Login();
        const apiGateway = new ApiGateway({
            method: 'POST',
            resource: resource,
            body: {
                email, password,
            },
        });

        await apiGateway.execute();

        return new LoginModel();
    };

    loginUserEmail = async (body: LoginRequestModel): Promise<LoginModel> => {
        const resource = AppResource.Auth.Login();
        const formData = new FormData();
        Object.entries(body).forEach(([key, value]) => {
            formData.append(key, value);
        });
        const apiGateway = new ApiGateway({
            method: 'POST',
            resource: resource,
            body: formData,
            headers: {
                'content-type': 'multipart/form-data'
            },
        });

        const response = await apiGateway.execute();

        return LoginModel.parseFromJson(response);
    };
}
