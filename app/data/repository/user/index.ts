import { StorageGatewayFactory } from '@data/gateway/storage';
import { DataStore } from '@data/sessionstore';
import ApiGateway from 'app/data/gateway/api';
import { AppResource } from 'app/data/gateway/api/resource';
import { IUserRepository } from 'app/domain/user';
import LoginModel from 'app/models/auth/response/LoginModel';
import UploadFileRequestModel from 'app/models/general/request/UploadFileRequestModel';
import UpdateProfileRequestModel from 'app/models/user/request/UpdateProfileRequestModel';
import UserModel from 'app/models/user/response/UserModel';
import { TokenType, User } from 'app/shared/constants';
import { Platform } from 'react-native';

export class UserRepository implements IUserRepository {
    getUserCreds = async (): Promise<string[] | null | undefined> => {
        const storageGateway = StorageGatewayFactory.createWithSecureClient();
        const response = await storageGateway.doGetJson(User.UserCreds);
        if (response) {
            const { username, password } = response;
            if (username && password) {
                return [username, password];
            }
        }

        return undefined;
    };

    saveUserCreds = async (username: string, password: string): Promise<boolean> => {
        const storageGateway = StorageGatewayFactory.createWithSecureClient();
        const obj = {
            username,
            password
        };
        await storageGateway.doUpdateJson(User.UserCreds, obj);
        return true;
    };

    refreshToken = (): Promise<LoginModel> => {
        return Promise.resolve(new LoginModel());
    };

    activateUserSession = async (): Promise<(string | undefined | null)[]> => {
        const storageGateway = StorageGatewayFactory.createWithSecureClient();
        const responses = await Promise.all([storageGateway.doGet(TokenType.User), storageGateway.doGet(TokenType.UserRefreshToken)]);
        DataStore.shared.accessToken = responses[0];
        DataStore.shared.refreshToken = responses[1];

        return [DataStore.shared.accessToken, DataStore.shared.refreshToken];
    };

    logoutUser = (): Promise<boolean> => {
        // const apiGateway = ApiGateway.createAPIConnection(AppConfig.value);

        // const resource = AppResource.Common.MiddlewareTracking();

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    };

    removeSavedToken = async (): Promise<boolean> => {
        const storageGateway = StorageGatewayFactory.createWithSecureClient();
        DataStore.shared.clearUserData();
        await Promise.all([
            storageGateway.doDelete(TokenType.User),
            storageGateway.doDelete(TokenType.UserRefreshToken),
            storageGateway.doDelete(User.UserCreds)
        ]);
        return true;
    };

    getSavedUserToken = (): Array<string | undefined | null> => {
        return [DataStore.shared.accessToken, DataStore.shared.refreshToken];
    };

    saveUserToken = (token: string, refreshToken?: string): Promise<boolean> => {
        const storageGateway = StorageGatewayFactory.createWithSecureClient();
        DataStore.shared.accessToken = token;
        DataStore.shared.refreshToken = refreshToken;
        if (refreshToken) {
            storageGateway.doUpdate(TokenType.UserRefreshToken, refreshToken);
        }
        return storageGateway.doUpdate(TokenType.User, token);
    };

    getProfile = async (): Promise<UserModel> => {
        const resource = AppResource.User.Profile();
        const apiGateway = new ApiGateway({
            method: 'GET',
            resource,
        });

        const response = await apiGateway.execute();
        response.data = UserModel.parseFromJson(response.data);
        return response;
    };

    updateProfile = async (data: UpdateProfileRequestModel): Promise<boolean> => {
        const resource = AppResource.User.Profile();
        const apiGateway = new ApiGateway({
            method: 'PATCH',
            resource,
            body: data,
        });

        await apiGateway.execute();
        return true;
    };

    uploadAvatar = (data: UploadFileRequestModel): Promise<string> => {
        const resource = AppResource.User.UploadFile();

        const apiGateway = new ApiGateway({
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            resource,
        });

        const dataForm = new FormData();
        if (data.image) {
            dataForm.append('image', {
                name: data.name,
                type: data.type,
                uri: Platform.OS === 'android' ? data.image : data.image.replace('file://', ''),
            });
        }
        dataForm.append('name', data.name);
        dataForm.append('type', data.type);

        return apiGateway.execute();
    };

    resetPassword = async (email: string): Promise<boolean> => {
        const resource = AppResource.User.ChangePassword();
        const apiGateway = new ApiGateway({
            method: 'PATCH',
            resource,
            body: { email },
        });

        await apiGateway.execute();
        return true;
    };
}
