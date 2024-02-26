import AppManager from '@shared/managers/AppManager';
import { IUserRepository } from 'app/domain/user';
import { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AppResource, IResource } from '../resource';
import Interceptor from './interceptor';

const maxRetries = 3;
let retryCount = 0;

const maxRefreshInPeriod = 5;
let retryCountInPeriod = 0;

setInterval(() => {
    retryCountInPeriod = 0;
}, 1000 * 60);

type RefreshTokenCallback = (token?: string, refreshToken?: string, error?: AxiosError) => void

let isRefreshing = false;
let refreshSubscribers: RefreshTokenCallback[] = [];

// 000		OK
// 001		User is not available
// 002		Password is wrong
// 003		Company is not available
// 009		System error
// 011		Could not defined OS
// 012		Device ID is not available
// 013		Request method is wrong

export default class RetryInterceptor extends Interceptor {
    axiosInstance: AxiosInstance;
    customerRepo: IUserRepository;

    URL_BLACKLIST = [AppResource.Auth.Login(), AppResource.Auth.Register()];

    constructor(resource: IResource, axiosInstance: AxiosInstance, customerRepo: IUserRepository) {
        super(resource);
        this.axiosInstance = axiosInstance;
        this.customerRepo = customerRepo;
    }

    requestFulfilled = (config: InternalAxiosRequestConfig) => {
        return config;
    };

    requestReject = (error: any) => {
        return Promise.reject(error);
    };

    responseFulfilled = (response: AxiosResponse): AxiosResponse<any, any> | Promise<any> => {
        const data = response.data;
        if (data) {
            const { error, error_msg } = data;

            if (error === '001') {
                const axiosError = new AxiosError(error_msg, error, response.config, response.request, response);
                return this.responseReject(axiosError);
            }
        }

        return response;
    };

    responseReject = (error: AxiosError) => {
        let status = 0;
        if (error.response) {
            status = error.response.status;
            const errorCode = (error.response.data as any)?.error;

            const originalRequest = error.config;
            if (!originalRequest) { return Promise.reject(error); }
            if (status === 401 || errorCode === '001') {
                const url = originalRequest.url;
                if (this.URL_BLACKLIST.some(item => url?.includes(item.Path) ?? false)) {
                    return Promise.reject(error);
                }
                if (retryCount >= maxRetries) {
                    AppManager.forceSignout.next(errorCode);
                    return Promise.reject(error);
                }
                if (retryCountInPeriod >= maxRefreshInPeriod) {
                    AppManager.forceSignout.next(errorCode);
                    return Promise.reject(error);
                }
                if (!isRefreshing) {
                    isRefreshing = true;
                    retryCount++;
                    retryCountInPeriod++;
                    this.customerRepo.refreshToken()
                        .then(response => {
                            isRefreshing = false;
                            retryCount = 0;
                            onRefreshed(response.token);
                        }).catch(() => {
                            isRefreshing = false;
                            onRefreshed(undefined, undefined, error);
                        });
                }

                const retryOrigReq = new Promise((resolve, reject) => {
                    const handler: RefreshTokenCallback = async (token, refreshToken, innerError) => {
                        // replace the expired token and retry
                        if (token) {
                            if (!originalRequest.headers) {
                                originalRequest.headers = new AxiosHeaders();
                            }
                            originalRequest.headers.token = token;
                            await this.customerRepo.saveUserToken(token, refreshToken);

                            resolve(this.axiosInstance.request(originalRequest));
                        } else {
                            reject(innerError);
                        }
                    };
                    subscribeTokenRefresh(handler);
                });
                return retryOrigReq;
            } else {
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    };
}

const subscribeTokenRefresh = (cb: RefreshTokenCallback) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = (token?: string, refreshToken?: string, error?: AxiosError) => {
    refreshSubscribers.map(cb => cb(token, refreshToken, error));
    refreshSubscribers = [];
};
