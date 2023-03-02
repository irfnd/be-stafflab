const Supabase = require("../configs/supabase");

const getDataPribadi = async (nip) => {
	const { data, error } = await Supabase.from("data_pribadi").select("*").eq("nipPegawai", nip).single();
	if (error) throw error;
	return data;
};

const createDataPribadi = async (newData) => {
	const { nik, tempatLahir, tanggalLahir, jenisKelamin, agama, kawin, alamat, nipPegawai } = newData;
	const { data, error } = await Supabase.from("data_pribadi")
		.insert({ nik, tempatLahir, tanggalLahir, jenisKelamin, agama, kawin, alamat, nipPegawai })
		.select()
		.single();
	if (error) throw error;
	return data;
};

const updateDataPribadi = async (newData, nik) => {
	const { data, error } = await Supabase.from("data_pribadi").update(newData).eq("nik", nik).select().single();
	if (error) throw error;
	return data;
};

module.exports = {
	getDataPribadi,
	createDataPribadi,
	updateDataPribadi,
};
