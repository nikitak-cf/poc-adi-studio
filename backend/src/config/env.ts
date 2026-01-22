import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  DATABASE_URL_TEST: string;
  REDIS_URL: string;
  SESSION_SECRET: string;
  SESSION_MAX_AGE: number;
  FRONTEND_URL: string;
  USE_MOCK_SERVICES: boolean;
  OPENAI_API_KEY: string;
  LINEAR_CLIENT_ID: string;
  LINEAR_CLIENT_SECRET: string;
  LINEAR_CALLBACK_URL: string;
  ENCRYPTION_KEY: string;
  MAX_CONTEXT_MESSAGES: number;
  MAX_CONTEXT_TOKENS: number;
}

function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue!;
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
}

function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true';
}

export const env: EnvConfig = {
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PORT: getEnvNumber('PORT', 3001),
  DATABASE_URL: getEnv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5433/adi_studio_dev'),
  DATABASE_URL_TEST: getEnv('DATABASE_URL_TEST', 'postgresql://postgres:postgres@localhost:5433/adi_studio_test'),
  REDIS_URL: getEnv('REDIS_URL', 'redis://localhost:6380'),
  SESSION_SECRET: getEnv('SESSION_SECRET', 'dev_secret_change_in_production'),
  SESSION_MAX_AGE: getEnvNumber('SESSION_MAX_AGE', 86400000),
  FRONTEND_URL: getEnv('FRONTEND_URL', 'http://localhost:3000'),
  USE_MOCK_SERVICES: getEnvBoolean('USE_MOCK_SERVICES', true),
  OPENAI_API_KEY: getEnv('OPENAI_API_KEY', 'mock_key'),
  LINEAR_CLIENT_ID: getEnv('LINEAR_CLIENT_ID', 'mock_linear_client_id'),
  LINEAR_CLIENT_SECRET: getEnv('LINEAR_CLIENT_SECRET', 'mock_secret'),
  LINEAR_CALLBACK_URL: getEnv('LINEAR_CALLBACK_URL', 'http://localhost:3001/auth/linear/callback'),
  ENCRYPTION_KEY: getEnv('ENCRYPTION_KEY', 'dev_encryption_key_32_chars_long'),
  MAX_CONTEXT_MESSAGES: getEnvNumber('MAX_CONTEXT_MESSAGES', 12),
  MAX_CONTEXT_TOKENS: getEnvNumber('MAX_CONTEXT_TOKENS', 4000),
};

if (env.NODE_ENV === 'production') {
  if (env.SESSION_SECRET === 'dev_secret_change_in_production') {
    throw new Error('SESSION_SECRET must be changed in production');
  }
}

export default env;