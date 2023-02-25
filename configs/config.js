require("dotenv").config();

const config = {
	nodeEnv: process.env.NODE_ENV,
	port: process.env.PORT || 8000,
	supabase: {
		url: process.env.SUPABASE_URL,
		anonKey: process.env.SUPABASE_ANON,
	},
};

module.exports = config;
