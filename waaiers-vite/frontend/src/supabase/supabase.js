import { createClient } from "@supabase/supabase-js";

//Creat the supbaseclient
const supabaseUrl = 'https://gdzncndzbvzbiazobnuy.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;
