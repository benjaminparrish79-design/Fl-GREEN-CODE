import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sbbwirekjcbpbgwwmibo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiYndpcmVramNicGJnd3dtaWJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MjM0OTIsImV4cCI6MjA4OTM5OTQ5Mn0.TV2e7Wl8d0vbkYYqk-RdwEAAz9iYlEfRP8Lq1xvr4Go';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
