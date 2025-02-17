import { createClient } from "@supabase/supabase-js";

//Creat the supbaseclient
console.log(import.meta.env.SUPABASE_URLf)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY 
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;
