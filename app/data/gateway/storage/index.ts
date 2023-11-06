import { DefaultStorageClient } from './defaultClient';
import { SecureStorageClient } from './secureClient';
import { StorageClient } from './storageClient';

export class StorageGateway {
    _client: StorageClient;

    constructor(client: StorageClient) {
        this._client = client;
    }

    doGet = (key: string): Promise<string | undefined | null> => {
        return this._client.getString(key);
    };

    doGetJson = async (key: string): Promise<any> => {
        const rawData = (await this._client.getString(key));
        return rawData ? JSON.parse(rawData) : undefined;
    };

    doUpdate = (key: string, value: string): Promise<boolean> => {
        return this._client.putString(key, value);
    };

    doUpdateJson = (key: string, value: any): Promise<boolean> => {
        return this._client.putString(key, JSON.stringify(value));
    };

    doDelete(key: string): Promise<boolean> {
        return this._client.delete(key);
    }

    doClean(): Promise<boolean> {
        return this._client.clean();
    }
}

export class StorageGatewayFactory {
    static createWithDefaultClient = (): StorageGateway => {
        return new StorageGateway(new DefaultStorageClient());
    };

    static createWithSecureClient = (): StorageGateway => {
        return new StorageGateway(new SecureStorageClient());
    };
}
