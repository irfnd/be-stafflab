require("dotenv").config();

const config = {
	nodeEnv: process.env.NODE_ENV,
	port: process.env.PORT || 8000,
	supabase: { url: process.env.SUPABASE_URL, anonKey: process.env.SUPABASE_ANON, edgeFunction: process.env.SUPABASE_FUNCTIONS },
	multer: { filterFile: { photo: require("./fileTypes").photo, docs: require("./fileTypes").docs } },
	inputProps: require("./inputProps"),
};

module.exports = config;
