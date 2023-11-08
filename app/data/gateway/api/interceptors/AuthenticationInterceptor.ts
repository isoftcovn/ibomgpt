import { ApiType } from 'app/data/gateway/api/type';
import { IUserRepository } from 'app/domain/user';
import { AxiosError, InternalAxiosRequestConfig, AxiosHeaders, AxiosResponse } from 'axios';
import qs from 'query-string';
import { IResource } from '../resource';
import Interceptor from './interceptor';
import { DataStore } from '@data/sessionstore';

export default class AuthenticationInterceptor extends Interceptor {

    _userRepository: IUserRepository;

    constructor(resource: IResource, userRepository: IUserRepository) {
        super(resource);

        this._userRepository = userRepository;
    }

    getTokenFromType = (type: ApiType): string => {
        switch (type) {
            case ApiType.Customer:
                const resp = this._userRepository.getSavedUserToken();
                return resp[0] ?? '';
            default:
                return '';
        }
    };

    requestFulfilled = (config: InternalAxiosRequestConfig) => {
        let authHeader;
        let username = DataStore.shared.username;
        const token = this.getTokenFromType(this.resource.Type);

        if (token) {
            authHeader = token;
        }

        if (!config.headers) {
            config.headers = new AxiosHeaders();
        }

        const contentType = config.headers['Content-Type'];
        if (contentType === 'application/x-www-form-urlencoded') {
            config.data = qs.stringify(config.data);
        }

        if (this.resource.Type !== 'public') {
            if (authHeader) {
                config.headers.token = authHeader;
                config.headers.username = username;
            } else {
                // Add default token of axios for unit test
                // config.headers.Authorization = axios.defaults.headers['Authorization'];
            }
        }
        return config;

    };

    requestReject = (error: any) => {
        return Promise.reject(error);
    };

    responseFulfilled = (response: AxiosResponse) => response;

    responseReject = (error: AxiosError) => Promise.reject(error);
}
