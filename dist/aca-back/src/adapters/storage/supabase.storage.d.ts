import { ConfigService } from '@nestjs/config';
import { StorageAdapter } from './storage.adapter';
export declare class SupabaseStorage implements StorageAdapter {
    private readonly config;
    private client;
    private bucket;
    constructor(config: ConfigService);
    uploadObject(path: string, data: Buffer | Uint8Array, contentType?: string): Promise<{
        path: string;
    }>;
    getPublicUrl(path: string): any;
}
