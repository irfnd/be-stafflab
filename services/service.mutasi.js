const Supabase = require("../configs/supabase");

const getAllMutasi = async (queries = null) => {
	if (queries) {
		const { data, error } = await Supabase.from("mutasi").select("*").match(queries);
		if (error) throw error;
		return data;
	} else {
		const { data, error } = await Supabase.from("mutasi").select("*");
		if (error) throw error;
		return data;
	}
};

const getMutasi = async (id) => {
	const { data, error } = await Supabase.from("mutasi").select("*").eq("id", id).single();
	if (error) throw error;
	return data;
};

const createMutasi = async (newData) => {
	const { data, error } = await Supabase.from("mutasi").insert(newData).select().single();
	if (error) throw error;
	return data;
};

const updateMutasi = async (newData, id) => {
	const { data, error } = await Supabase.from("mutasi").update(newData).eq("id", id).select().single();
	if (error) throw error;
	return data;
};

const deleteMutasi = async (id) => {
	const { data, error } = await Supabase.from("mutasi").delete().eq("id", id).select().single();
	if (error) throw error;
	return data;
};

module.exports = {
	getAllMutasi,
	getMutasi,
	createMutasi,
	updateMutasi,
	deleteMutasi,
};
