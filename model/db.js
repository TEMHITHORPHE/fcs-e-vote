

const { createClient } = require('@supabase/supabase-js');


// CLIENT API KEY
const SupabaseKey = process.env.SUPABASE_ANON_KEY

// PROJECT URL
const SupabaseUrl = process.env.SUPABASE_URL

const supabase = createClient(SupabaseUrl, SupabaseKey);

module.exports.supabase = supabase;