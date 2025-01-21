import { createClient } from "@supabase/supabase-js";

//Creat the supbaseclient
const supabaseUrl = 'https://gdzncndzbvzbiazobnuy.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkem5jbmR6YnZ6Ymlhem9ibnV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODE2ODMyNDgsImV4cCI6MTk5NzI1OTI0OH0.WLv-mEFyEFDJldvR3Ih5tmtuxUmhIR2yxZhkLaqlnBE"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;
