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
    this.bucket = this.config.get<string>('SB_BUCKET') || 'docs';
  }

  async uploadObject(path: string, data: Buffer | Uint8Array, contentType?: string) {
    const { error } = await this.client.storage.from(this.bucket).upload(path, data, { 
      contentType, 
      upsert: true 
    });
    if (error) throw error;

    // Retorna signed URL em vez de public URL
    const { data: signedData, error: signedError } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(path, 3600); // 1 hora de expiração
    
    if (signedError) throw signedError;
    
    return { 
      path,
      signedUrl: signedData.signedUrl 
    };
  }

  getPublicUrl(path: string) {
    const { data } = this.client.storage.from(this.bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async getSignedUrl(path: string, expiresIn: number = 3600) {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .createSignedUrl(path, expiresIn);
    
    if (error) throw error;
    return data.signedUrl;
  }

  async downloadObject(path: string): Promise<Buffer> {
    const { data, error } = await this.client.storage
      .from(this.bucket)
      .download(path);
    
    if (error) throw error;
    return Buffer.from(await data.arrayBuffer());
  }

  async deleteObject(path: string): Promise<void> {
    const { error } = await this.client.storage
      .from(this.bucket)
      .remove([path]);
    
    if (error) throw error;
  }
}
