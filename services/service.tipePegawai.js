const Supabase = require("../configs/supabase");

const getAllTipe = async () => {
	const { data, error } = await Supabase.from("tipe_pegawai").select("*");
	if (error) throw error;
	return data;
};

const getTipe = async (id) => {
	const { data, error } = await Supabase.from("tipe_pegawai").select("*").eq("id", id).single();
	if (error) throw error;
	return data;
};

module.exports = {
	getAllTipe,
	getTipe,
};
