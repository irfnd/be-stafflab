const Supabase = require("../configs/supabase");

const getAllStatus = async () => {
	const { data, error } = await Supabase.from("status_pegawai").select("*");
	if (error) throw error;
	return data;
};

const getStatus = async (id) => {
	const { data, error } = await Supabase.from("status_pegawai").select("*").eq("id", id).single();
	if (error) throw error;
	return data;
};

module.exports = {
	getAllStatus,
	getStatus,
};
