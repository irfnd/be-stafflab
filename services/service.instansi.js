const Supabase = require("../configs/supabase");

const getAllInstansi = async () => {
	const { data, error } = await Supabase.from("instansi").select("*");
	if (error) throw error;
	return data;
};

const getInstansi = async (id) => {
	const { data, error } = await Supabase.from("instansi").select("*").eq("id", id).single();
	if (error) throw error;
	return data;
};

const createInstansi = async (newData) => {
	const { data, error } = await Supabase.from("instansi").insert(newData).select().single();
	if (error) throw error;
	return data;
};

const updateInstansi = async (newData, id) => {
	const { data, error } = await Supabase.from("instansi").update(newData).eq("id", id).select().single();
	if (error) throw error;
	return data;
};

const deleteInstansi = async (id) => {
	const { data, error } = await Supabase.from("instansi").delete().eq("id", id).select().single();
	if (error) throw error;
	return data;
};

module.exports = {
	getAllInstansi,
	getInstansi,
	createInstansi,
	updateInstansi,
	deleteInstansi,
};
