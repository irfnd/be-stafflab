const axios = require("axios");
const config = require("../configs");

const authorization = `Bearer ${config.supabase.anonKey}`;

const edgeFunction = axios.create({
	baseURL: config.supabase.edgeFunction,
	headers: { authorization, "content-type": "application/json" },
});

module.exports = edgeFunction;
