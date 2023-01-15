require("dotenv").config();

const config = {
	nodeEnv: process.env.NODE_ENV,
	port: process.env.PORT || 8000,
};

module.exports = config;
