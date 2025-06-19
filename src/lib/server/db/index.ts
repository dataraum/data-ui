import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as urSchema from './schema/user_roles';
import * as mdSchema from './schema/meta_data';
import { DATABASE_URL } from '$env/static/private';

if (!DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = neon(DATABASE_URL);

export const urDb = drizzle(client, { schema: urSchema, casing: 'snake_case' });
export const mdDb = drizzle(client, { schema: mdSchema, casing: 'snake_case' });