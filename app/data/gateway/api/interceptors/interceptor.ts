import { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { IResource } from '../resource';

export default abstract class Interceptor {
    resource: IResource;

    protected constructor(resource: IResource) {
        this.resource = resource;
    }

    abstract requestFulfilled(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig;

    abstract requestReject(error: any): any;

    abstract responseFulfilled(response: AxiosResponse): AxiosResponse;

    abstract responseReject(error: any): Promise<any>;
}
