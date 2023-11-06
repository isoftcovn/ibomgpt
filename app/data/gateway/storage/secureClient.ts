import EncryptedStorage from 'react-native-encrypted-storage';
import {StorageClient} from './storageClient';

export class SecureStorageClient implements StorageClient {
    getString = async (key: string): Promise<string | undefined | null> => {
        const data: string | null = await EncryptedStorage.getItem(key);
        return data;
    };

    putString = async (key: string, value: string): Promise<boolean> => {
        await EncryptedStorage.setItem(key, value);
        return true;
    };

    delete = async (key: string): Promise<boolean> => {
        await EncryptedStorage.removeItem(key);
        return true;
    };

    clean = async (): Promise<boolean> => {
        await EncryptedStorage.clear();
        return true;
    };

}
