import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://szbsaxhdmrvxjyhegnqk.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjE2MmU3ODVjLTk3YTQtNDNmYi05YjU3LWUwZDgyZWQxMGViYiJ9.eyJwcm9qZWN0SWQiOiJzemJzYXhoZG1ydnhqeWhlZ25xayIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzczNDg2NDkyLCJleHAiOjIwODg4NDY0OTIsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.J0HaRNV96BY3li39XzvsVwMYeEu125g8NtNcMr0sJ88';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };