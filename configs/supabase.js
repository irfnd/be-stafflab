const { createClient } = require("@supabase/supabase-js");
const config = require("../configs/config");

const Supabase = createClient(config.supabase.url, config.supabase.anonKey, {
	auth: {
		detectSessionInUrl: false,
		persistSession: false,
	},
});

module.exports = Supabase;
