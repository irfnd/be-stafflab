const Supabase = require("../configs/supabase");

const getAllGolongan = async () => {
	const { data, error } = await Supabase.from("golongan").select("*");
	if (error) throw error;
	return data;
};

const getGolongan = async (id) => {
	const { data, error } = await Supabase.from("golongan").select("*").eq("id", id).single();
	if (error) throw error;
	return data;
};

const createGolongan = async (newData) => {
	const { data, error } = await Supabase.from("golongan").insert(newData).select().single();
	if (error) throw error;
	return data;
};

const updateGolongan = async (newData, id) => {
	const { data, error } = await Supabase.from("golongan").update(newData).eq("id", id).select().single();
	if (error) throw error;
	return data;
};

const deleteGolongan = async (id) => {
	const { data, error } = await Supabase.from("golongan").delete().eq("id", id).select().single();
	if (error) throw error;
	return data;
};

module.exports = {
	getAllGolongan,
	getGolongan,
	createGolongan,
	updateGolongan,
	deleteGolongan,
};
