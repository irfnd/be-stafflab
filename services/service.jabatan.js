const Supabase = require("../configs/supabase");

const getAllJabatan = async () => {
	const { data, error } = await Supabase.from("jabatan").select("*");
	if (error) throw error;
	return data;
};

const getJabatan = async (id) => {
	const { data, error } = await Supabase.from("jabatan").select("*").eq("id", id).single();
	if (error) throw error;
	return data;
};

const createJabatan = async (newData) => {
	const { data, error } = await Supabase.from("jabatan").insert(newData).select().single();
	if (error) throw error;
	return data;
};

const updateJabatan = async (newData, id) => {
	const { data, error } = await Supabase.from("jabatan").update(newData).eq("id", id).select().single();
	if (error) throw error;
	return data;
};

const deleteJabatan = async (id) => {
	const { data, error } = await Supabase.from("jabatan").delete().eq("id", id).select().single();
	if (error) throw error;
	return data;
};

module.exports = {
	getAllJabatan,
	getJabatan,
	createJabatan,
	updateJabatan,
	deleteJabatan,
};
