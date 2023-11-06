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
        // Should return AxiosResponse, only transform data in the response
        return response;
    };

    responseReject = (error: AxiosError<any, any>) => {
        let status = 0;
        let code = '';
        let message = '';
        let rawError;
        if (error.response?.data?.error) {
            status = error.response.status;
            console.info(error.response.status);
            console.info(error.response.data);
            console.info(error.response.config);

            const data = error.response.data.error;
            const { statusCode, message: _message, code: _code } = data;
            // server was received message, but response smt
            status = !(status >= 200 && status < 300) ? status : statusCode;
            code = _code;
            message = _message || error?.response?.data?.errorMessage;
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


