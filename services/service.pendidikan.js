const Supabase = require("../configs/supabase");

const getAllPendidikan = async (nip = null) => {
	if (nip) {
		const { data, error } = await Supabase.from("pendidikan").select("*").eq("nipPegawai", nip);
		if (error) throw error;
		return data;
	} else {
		const { data, error } = await Supabase.from("pendidikan").select("*");
		if (error) throw error;
		return data;
	}
};

const getPendidikan = async (id) => {
	const { data, error } = await Supabase.from("pendidikan").select("*").eq("id", id).single();
	if (error) throw error;
	return data;
};

const createPendidikan = async (newData) => {
	const { data, error } = await Supabase.from("pendidikan").insert(newData).select().single();
	if (error) throw error;
	return data;
};

const updatePendidikan = async (newData, id) => {
	const { data, error } = await Supabase.from("pendidikan").update(newData).eq("id", id).select().single();
	if (error) throw error;
	return data;
};

const deletePendidikan = async (id) => {
	const { data, error } = await Supabase.from("pendidikan").delete().eq("id", id).select().single();
	if (error) throw error;
	return data;
};

module.exports = {
	getAllPendidikan,
	getPendidikan,
	createPendidikan,
	updatePendidikan,
	deletePendidikan,
};
