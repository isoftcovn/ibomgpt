import perf from '@react-native-firebase/perf';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

class FirebaseInterceptor {
    request = async (config: InternalAxiosRequestConfig | any): Promise<InternalAxiosRequestConfig> => {
        // @ts-ignore
        const httpMetric = perf().newHttpMetric(config.url!, config.method?.toUpperCase() ?? 'HEAD');
        config.metadata = { httpMetric };

        // add any extra metric attributes, if required

        await httpMetric.start();
        return config;
    };

    onFulfilled = async (response: AxiosResponse<any>): Promise<AxiosResponse> => {
        // Request was successful, e.g. HTTP code 200

        try {
            // @ts-ignore
            const { httpMetric } = response.config?.metadata ?? {};

            // add any extra metric attributes if needed

            httpMetric.setHttpResponseCode(response.status);
            httpMetric.setResponseContentType(response.headers['content-type'] ?? 'HEAD');
            await httpMetric.stop();
        } finally {
            return response;
        }
    };

    onRejected = async (error: any): Promise<AxiosError> => {
        // Request failed, e.g. HTTP code 500
        try {
            // @ts-ignore
            const { httpMetric } = error.config?.metadata ?? {};

            // add any extra metric attributes if needed

            httpMetric.setHttpResponseCode(error.response?.status ?? 400);
            httpMetric.setResponseContentType(error.response?.headers['content-type'] ?? 'HEAD');
            await httpMetric.stop();
        } finally {
            // Ensure failed requests throw after interception
            return Promise.reject(error);
        }
    };
}

export default new FirebaseInterceptor();
