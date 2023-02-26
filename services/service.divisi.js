const Supabase = require("../configs/supabase");

const getAllDivisi = async () => {
	const { data, error } = await Supabase.from("divisi").select("*");
	if (error) throw error;
	return data;
};

const getDivisi = async (id) => {
	const { data, error } = await Supabase.from("divisi").select("*").eq("id", id).single();
	if (error) throw error;
	return data;
};

const createDivisi = async (newData) => {
	const { data, error } = await Supabase.from("divisi").insert(newData).select().single();
	if (error) throw error;
	return data;
};

const updateDivisi = async (newData, id) => {
	const { data, error } = await Supabase.from("divisi").update(newData).eq("id", id).select().single();
	if (error) throw error;
	return data;
};

const deleteDivisi = async (id) => {
	const { data, error } = await Supabase.from("divisi").delete().eq("id", id).select().single();
	if (error) throw error;
	return data;
};

module.exports = {
	getAllDivisi,
	getDivisi,
	createDivisi,
	updateDivisi,
	deleteDivisi,
};
