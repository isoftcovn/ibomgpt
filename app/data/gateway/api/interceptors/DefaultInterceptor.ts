import { APIError } from 'app/models/error/APIError';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { IResource } from '../resource';
import Interceptor from './interceptor';
export default class DefaultInterceptor extends Interceptor {

    _requestID = uuidv4();

    constructor(resource: IResource) {
        super(resource);
    }

    requestFulfilled = (config: InternalAxiosRequestConfig) => {
        return config;
    };

    requestReject = (error: any) => {
        return Promise.reject(error);
    };

    responseFulfilled = (response: AxiosResponse) => {
        const data = response.data;
        if (data) {
            const { error, error_msg, } = data;
            // success
            if (error === '000') {
                return response;
            } else {
                return Promise.reject(new APIError(error_msg, 500, error, data));
            }
        }

        return response;
    };

    responseReject = (error: AxiosError<any, any>) => {
        let status = 0;
        let code = '';
        let message = '';
        let rawError;
        if (error.response?.data) {
            status = error.response.status;
            console.info(error.response.status);
            console.info(error.response.data);

            const data = error.response.data;
            const { error: errorCode, error_msg, } = data;
            // server was received message, but response smt
            code = errorCode;
            message = error_msg ?? '';
            rawError = data;
        } else {
            console.warn('smt went wrong: ', error);
            // smt went wrong
            status = 500;
            message = error.message;
        }

        return Promise.reject(new APIError(message, status, code, rawError));
    };
}


