import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import { StorageAdapter } from './storage.adapter';

@Injectable()
export class SupabaseStorage implements StorageAdapter {
  private client: any;
  private bucket: string;
  
  constructor(private readonly config: ConfigService) {
    const projectUrl = this.config.get<string>('SUPABASE_PROJECT_URL') || 'https://placeholder.supabase.co';
    const serviceRole = this.config.get<string>('SUPABASE_SERVICE_ROLE') || 'placeholder-service-role';
    
    this.client = createClient(projectUrl, serviceRole);
    this.bucket = this.config.get<string>('SUPABASE_STORAGE_BUCKET') || 'docs';
  }
  async uploadObject(path: string, data: Buffer | Uint8Array, contentType?: string) {
    const { error } = await this.client.storage.from(this.bucket).upload(path, data, { contentType, upsert: true });
    if (error) throw error;
    return { path };
  }
  getPublicUrl(path: string) {
    const { data } = this.client.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
