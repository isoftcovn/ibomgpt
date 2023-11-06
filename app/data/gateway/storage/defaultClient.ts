import { StorageClient } from './storageClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class DefaultStorageClient implements StorageClient {
    getString = async (key: string): Promise<string | undefined | null> => {
        const data: string | null = await AsyncStorage.getItem(key);
        return data;
    };

    putString = async (key: string, value: string): Promise<boolean> => {
        await AsyncStorage.setItem(key, value);
        return true;
    };

    delete = async (key: string): Promise<boolean> => {
        await AsyncStorage.removeItem(key);
        return true;
    };

    clean = async (): Promise<boolean> => {
        await AsyncStorage.clear();
        return true;
    };

}
