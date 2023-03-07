const Supabase = require("../configs/supabase");

const getAllCuti = async () => {
	const { data, error } = await Supabase.from("cuti").select("*");
	if (error) throw error;
	return data;
};

const getCuti = async (id) => {
	const { data, error } = await Supabase.from("cuti").select("*").eq("id", id).single();
	if (error) throw error;
	return data;
};

const createCuti = async (newData) => {
	const { data, error } = await Supabase.from("cuti").insert(newData).select().single();
	if (error) throw error;
	return data;
};

const updateCuti = async (newData, id) => {
	const { data, error } = await Supabase.from("cuti").update(newData).eq("id", id).select().single();
	if (error) throw error;
	return data;
};

const deleteCuti = async (id) => {
	const { data, error } = await Supabase.from("cuti").delete().eq("id", id).select().single();
	if (error) throw error;
	return data;
};

module.exports = {
	getAllCuti,
	getCuti,
	createCuti,
	updateCuti,
	deleteCuti,
};
