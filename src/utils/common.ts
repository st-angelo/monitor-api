import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __filename: string = fileURLToPath(import.meta.url);
export const __dirname: string = dirname(path.join(__filename, '..'));
