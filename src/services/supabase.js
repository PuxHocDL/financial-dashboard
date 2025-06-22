import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zbybvpdcjyaklqrgherj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpieWJ2cGRjanlha2xxcmdoZXJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzOTcxMTIsImV4cCI6MjA2NTk3MzExMn0.doklJMIFSfrAxOLW2OMozrz8kIUt0qXcW_q5rNRKeX4';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;