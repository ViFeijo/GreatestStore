import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.DATABASE_URL;
const supabaseKey = process.env.DB_PASSWORD;

export const supabase = createClient(supabaseUrl, supabaseKey);