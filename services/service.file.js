const Supabase = require("../configs/supabase");

const postFile = async (newData) => {
	const { folder, kategori, namaFile, file, pegawai } = newData;
	const filename = `${namaFile} - ${pegawai}.${file.name.match(/[^.]+$/)}`;
	const { data, error } = await Supabase.storage.from("dokumen").upload(`${folder}/${kategori}/${filename}`, file);
	if (error) throw error;
	return data;
};

const postPhoto = async (newData) => {
	const { folder, kategori, namaFile, file, pegawai } = newData;
	const filePath = `${folder}/${kategori}/${namaFile} - ${pegawai}.${file.name.match(/[^.]+$/)}`;
	const { data, error } = await Supabase.storage.from("foto").upload(filePath, file, { upsert: true });
	const { data: listFoto } = await Supabase.storage.from("foto").list(`${folder}/${kategori}`);
	if (error) throw error;
	return { ...data, updated_at: listFoto.filter((el) => data.path.split("/").pop() === el.name)[0].metadata.lastModified };
};

const getPhoto = (path) => {
	const { data: getPublicUrl } = Supabase.storage.from("foto").getPublicUrl(path);
	return getPublicUrl;
};

const updateFile = async (newData) => {
	const { path, newName } = newData;
	const toPath = `${path.substring(0, path.lastIndexOf("/"))}/${newName}.${path.match(/[^.]+$/)}`;
	const { error } = await Supabase.storage.from("dokumen").move(path, toPath);
	if (error) throw error;
	return { path: toPath };
};

const deleteFile = async (selectedData) => {
	const { path, storage } = selectedData;
	const { data, error } = await Supabase.storage.from(storage).remove([path]);
	if (error) throw error;
	return data;
};

module.exports = {
	postFile,
	postPhoto,
	getPhoto,
	updateFile,
	deleteFile,
};
