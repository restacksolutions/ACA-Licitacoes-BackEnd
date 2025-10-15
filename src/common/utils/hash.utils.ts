import { createHash } from 'crypto';
export const sha256 = (buf: Buffer) =>
  createHash('sha256').update(buf).digest('hex');
