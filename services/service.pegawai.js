const Supabase = require("../configs/supabase");

const getAllPegawai = async () => {
	const { data, error } = await Supabase.from("data_pribadi").select("*, pegawai (*)");
	if (error) throw error;
	return data;
};

const getPegawai = async (nip) => {
	const { data, error } = await Supabase.from("data_pribadi").select("*, pegawai (*)").eq("nipPegawai", nip).single();
	if (error) throw error;
	return data;
};

const createPegawai = async (newData) => {
	const {
		nip,
		nama,
		email,
		noTelepon,
		tipe: idTipe,
		status: idStatus,
		instansi: idInstansi,
		divisi: idDivisi,
		jabatan: idJabatan,
		golongan: idGolongan,
		uuidUser,
	} = newData;
	const { data, error } = await Supabase.from("pegawai")
		.insert({ nip, nama, email, noTelepon: `+62${noTelepon}`, idTipe, idStatus, idInstansi, idDivisi, idJabatan, idGolongan, uuidUser })
		.select()
		.single();
	if (error) throw error;
	return data;
};

const updatePegawai = async (newData, nip) => {
	const { data, error } = await Supabase.from("pegawai").update(newData).eq("nip", nip).select().single();
	if (error) throw error;
	return data;
};

const deletePegawai = async (nip) => {
	const { data: allFile } = await Supabase.from("dokumen").select("kategori, detail->path").eq("nipPegawai", nip);
	const listDokumen = allFile.filter((el) => el.kategori !== "profil").map((el) => el.path);
	const listFoto = allFile.filter((el) => el.kategori === "profil").map((el) => el.path);

	const { error: dokumenErr } = await Supabase.storage.from("dokumen").remove(listDokumen);
	if (dokumenErr) throw dokumenErr;

	const { error: fotoErr } = await Supabase.storage.from("foto").remove(listFoto);
	if (fotoErr) throw fotoErr;

	const { data, error: pegawaiErr } = await Supabase.from("pegawai").delete().eq("nip", nip).select().single();
	if (pegawaiErr) throw pegawaiErr;

	return data;
};

module.exports = {
	getAllPegawai,
	getPegawai,
	createPegawai,
	updatePegawai,
	deletePegawai,
};
