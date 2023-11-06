import axios, {AxiosInstance} from 'axios';
import MockAdapter, {RequestHandler} from 'axios-mock-adapter';

interface MockAdapterOptions {
    delayResponse?: number;
    onNoMatch?: 'passthrough' | 'throwException';
}

export default class MockAdapterWrapper {
    resourcePath: string;
    mock: MockAdapter;
    mockAdapterOptions?: MockAdapterOptions
    axiosInstance: AxiosInstance;

    constructor(resourcePath: string, options?: MockAdapterOptions) {
        this.resourcePath = resourcePath;
        this.mockAdapterOptions = options;
        this.axiosInstance = axios.create();
        this.mock = new MockAdapter(this.axiosInstance, options);
        this.mock.onGet()
    }

    onGet = (body?: any, headers?: any): RequestHandler => {
        return this.mock.onGet(this.resourcePath, body, headers);
    }

    onPost = (body?: any, headers?: any): RequestHandler => {
        return this.mock.onPost(this.resourcePath, body, headers);
    }

    onPut = (body?: any, headers?: any): RequestHandler => {
        return this.mock.onPut(this.resourcePath, body, headers);
    }

    onPatch = (body?: any, headers?: any): RequestHandler => {
        return this.mock.onPatch(this.resourcePath, body, headers);
    }

    onDelete = (body?: any, headers?: any): RequestHandler => {
        return this.mock.onDelete(this.resourcePath, body, headers);
    }
}