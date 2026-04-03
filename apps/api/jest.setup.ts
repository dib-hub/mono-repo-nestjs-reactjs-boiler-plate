/**
 * Global Jest setup — loaded via setupFiles in jest.config.cjs.
 * Injects .env.test variables before any test module is evaluated so
 * PrismaService picks up the test DATABASE_URL at construction time.
 */
import { resolve } from 'path';
import { config as loadEnv } from 'dotenv';

const envPath = resolve(process.cwd(), '.env.test');
loadEnv({ path: envPath, override: true });
