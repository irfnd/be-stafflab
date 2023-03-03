const Supabase = require("../configs/supabase");

const setClaims = async ({ claim, value, uid }) => {
	const { data, error } = await Supabase.rpc("set_claim", { claim, uid, value });
	if (error) throw error;
	return data;
};

const deleteClaims = async ({ claim, uid }) => {
	const { data, error } = await Supabase.rpc("delete_claim", { claim, uid });
	if (error) throw error;
	return data;
};

module.exports = {
	setClaims,
	deleteClaims,
};
