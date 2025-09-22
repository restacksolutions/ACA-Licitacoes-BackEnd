export interface StorageAdapter {
    uploadObject(path: string, data: Buffer | Uint8Array, contentType?: string): Promise<{
        path: string;
    }>;
    getPublicUrl(path: string): string;
}
