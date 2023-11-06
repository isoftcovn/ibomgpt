
export interface StorageClient {
    getString(key: string): Promise<string | undefined | null>;
    putString(key: string, value: string): Promise<boolean>;
    delete(key: string): Promise<boolean>;
    clean(): Promise<boolean>;
}
