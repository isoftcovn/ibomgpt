import { IUserRepository } from 'app/domain/user';
import { AxiosError, AxiosHeaders, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { IResource } from '../resource';
import Interceptor from './interceptor';

type RefreshTokenCallback = (token: string, refreshToken?: string) => void

let isRefreshing = false;
let refreshSubscribers: RefreshTokenCallback[] = [];

export default class RetryInterceptor extends Interceptor {
    axiosInstance: AxiosInstance;
    customerRepo: IUserRepository;

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

    responseFulfilled = (response: AxiosResponse) => {
        return response;
    };

    responseReject = (error: AxiosError) => {
        let status = 0;
        if (error.response) {
            status = error.response.status;
            const originalRequest = error.config;
            if (!originalRequest) {return Promise.reject(error);}
            if (status === 401) {
                if (!isRefreshing) {
                    isRefreshing = true;
                    this.customerRepo.refreshToken()
                        .then(response => {
                            isRefreshing = false;
                            onRefreshed(response.token, response.refreshToken);
                        });
                }

                const retryOrigReq = new Promise((resolve) => {
                    const handler: RefreshTokenCallback = async (token, refreshToken) => {
                        // replace the expired token and retry
                        if (!originalRequest.headers) {
                            originalRequest.headers = new AxiosHeaders();
                        }
                        originalRequest.headers.Authorization = 'Bearer ' + token;
                        await this.customerRepo.saveUserToken(token, refreshToken);

                        resolve(this.axiosInstance.request(originalRequest));
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

const onRefreshed = (token: string, refreshToken?: string) => {
    refreshSubscribers.map(cb => cb(token, refreshToken));
    refreshSubscribers = [];
};
