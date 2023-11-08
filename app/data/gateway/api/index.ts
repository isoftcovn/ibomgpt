import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import qs from 'query-string';
import Config from 'react-native-config';
import 'react-native-get-random-values';
import DefaultInterceptor from './interceptors/DefaultInterceptor';
import FirebaseInterceptor from './interceptors/FirebaseInterceptor';
import Interceptor from './interceptors/interceptor';
import { IResource } from './resource';
import { ApiType } from './type';
import { DataStore } from '@data/sessionstore';
import AuthenticationInterceptor from './interceptors/AuthenticationInterceptor';
import { UserRepository } from '@data/repository/user';

export type HTTPMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

interface IConstructor {
    resource: IResource;
    headers?: Record<string, any>;
    interceptors?: Interceptor[];
    timeout?: number;
    method: HTTPMethod;
    body?: any;
    params?: any;
    onSendProgress?: (progress: number, total: number) => void;
    onReceivedProgress?: (progress: number, total: number) => void;
}

class ApiGateway {
    configTimeout = 30000;
    _instanceAxios!: AxiosInstance;
    requestConfig!: AxiosRequestConfig;
    endpoint: string;
    headers?: Record<string, any>;
    interceptors?: Interceptor[];
    resource: IResource;
    method: HTTPMethod;
    body?: any;
    params?: any;

    onSendProgress?: (progress: number, total: number) => void;
    onReceivedProgress?: (progress: number, total: number) => void;

    constructor(data: IConstructor) {
        const {
            resource,
            headers,
            interceptors,
            timeout = 30 * 1000,
            method,
            body,
            params,
            onReceivedProgress,
            onSendProgress,
        } = data;
        this.resource = resource;
        this.headers = headers;
        this.interceptors = interceptors;
        this.configTimeout = timeout;
        this.method = method;
        this.body = body;
        this.params = params;
        this.onSendProgress = onSendProgress;
        this.onReceivedProgress = onReceivedProgress;

        this.endpoint = this.getEndpoint(resource.Type);

        this._createInstance();
    }

    private _createInstance = () => {
        this.requestConfig = {
            baseURL: this.endpoint,
            timeout: this.configTimeout,
            headers: this.headers
                ? this.headers
                : {
                    'Content-Type': 'multipart/form-data',
                },
            url: this.resource.Path,
            method: this.method,
            params: this.params,
            paramsSerializer: {
                encode: params => qs.stringify(params, { arrayFormat: 'none' }),
            },
            data: this.body,
        };
        if (this.onSendProgress) {
            this.requestConfig.onUploadProgress = ({
                loaded,
                bytes,
            }) => this.onSendProgress!(loaded, bytes);
        }
        if (this.onReceivedProgress) {
            this.requestConfig.onDownloadProgress = ({
                loaded,
                bytes,
            }) => this.onReceivedProgress!(loaded, bytes);
        }
        this._instanceAxios = axios.create(this.requestConfig);
        this._addDefaultInterceptors();
        this._addInterceptors();
    };

    private _addDefaultInterceptors = () => {
        const authenticationInterceptor = new AuthenticationInterceptor(this.resource, new UserRepository());
        this._instanceAxios.interceptors.request.use(
            authenticationInterceptor.requestFulfilled,
            authenticationInterceptor.requestReject
        );

        this._instanceAxios.interceptors.request.use(
            FirebaseInterceptor.request,
        );
        this._instanceAxios.interceptors.response.use(
            FirebaseInterceptor.onFulfilled,
            FirebaseInterceptor.onRejected,
        );
    };

    private _addInterceptors = () => {
        if (this.interceptors) {
            this.interceptors.forEach(interceptor => {
                this._instanceAxios.interceptors.request.use(
                    interceptor.requestFulfilled,
                    interceptor.requestReject,
                );
                this._instanceAxios.interceptors.response.use(
                    interceptor.responseFulfilled,
                    interceptor.responseReject,
                );
            });
        } else {
            const interceptor = new DefaultInterceptor(
                this.resource,
            );
            this._instanceAxios.interceptors.request.use(
                interceptor.requestFulfilled,
                interceptor.requestReject,
            );
            this._instanceAxios.interceptors.response.use(
                interceptor.responseFulfilled,
                interceptor.responseReject,
            );
        }
    };

    getEndpoint = (resourceType: ApiType) => {
        // TODO: Should select endpoint based on ApiType here
        if (resourceType === ApiType.Public) {
            return Config.API_URL;
        }
        return DataStore.shared.apiHost ?? Config.API_URL;
    };

    execute = (): Promise<any> =>
        this._instanceAxios.request(this.requestConfig);
}

export default ApiGateway;
