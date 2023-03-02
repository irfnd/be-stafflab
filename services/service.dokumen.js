const Supabase = require("../configs/supabase");

const getAllDokumen = async (queries) => {
	const { nipPegawai, kategori } = queries;
	if (nipPegawai) {
		const { data, error } = await Supabase.from("dokumen")
			.select("*")
			.match(kategori ? { nipPegawai, kategori } : { nipPegawai });
		if (error) throw error;
		return data;
	} else {
		if (kategori) {
			const { data, error } = await Supabase.from("dokumen").select("*").eq("kategori", kategori);
			if (error) throw error;
			return data;
		} else {
			const { data, error } = await Supabase.from("dokumen").select("*");
			if (error) throw error;
			return data;
		}
	}
};

const getDokumen = async (id) => {
	const { data, error } = await Supabase.from("dokumen").select("*").eq("id", id).single();
	if (error) throw error;
	return data;
};

const createDokumen = async (newData) => {
	const { nama, detail, nipPegawai, kategori } = newData;
	const { data, error } = await Supabase.from("dokumen").insert({ nama, detail, nipPegawai, kategori }).select().single();
	if (error) throw error;
	return data;
};

const updateDokumen = async (newData, id) => {
	const { data, error } = await Supabase.from("dokumen").update(newData).eq("id", id).select().single();
	if (error) throw error;
	return data;
};

const deleteDokumen = async (id) => {
	const { data, error } = await Supabase.from("dokumen").delete().eq("id", id).select().single();
	if (error) throw error;
	return data;
};

module.exports = {
	getAllDokumen,
	getDokumen,
	createDokumen,
	updateDokumen,
	deleteDokumen,
};
