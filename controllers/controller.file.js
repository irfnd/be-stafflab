const httpStatus = require("http-status");
const config = require("../configs");
const { upload } = require("../middlewares/multer");
const { validator, validatorMulter } = require("../utils/validator");
const { PegawaiServices, FileServices, DokumenServices } = require("../services");
const { responseSuccess } = require("../utils/response");
const { FileSchema } = require("../validations");

const { docs, photo } = config.multer.filterFile;

const getAllFile = async (req, res, next) => {
	try {
		const queries = await validator(FileSchema.getAllFile, req.query);
		const files = await DokumenServices.getAllDokumen(queries);
		res.json(responseSuccess("GET file berhasil!", files));
	} catch (err) {
		next(err);
	}
};

const getFile = async (req, res, next) => {
	const { id } = req.params;
	try {
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const file = await DokumenServices.getDokumen(id);
		res.json(responseSuccess("GET file berhasil!", file));
	} catch (err) {
		next(err);
	}
};

const uploadFile = async (req, res, next) => {
	try {
		await upload({ fileTypes: docs })(req, res);
		const { nipPegawai, dokumen, ...validated } = await validatorMulter(FileSchema.uploadFile)(req);
		const { pegawai } = await PegawaiServices.getPegawai(nipPegawai);
		const uploadedFile = await FileServices.uploadFile({ ...validated, folder: pegawai.nip, file: req.file, pegawai: pegawai.nama });
		const file = await DokumenServices.createDokumen({
			nama: `${validated.namaFile} - ${pegawai.nama}`,
			detail: uploadedFile,
			kategori: validated.kategori,
			nipPegawai: pegawai.nip,
		});
		res.json(responseSuccess("POST file berhasil!", file));
	} catch (err) {
		next(err);
	}
};

const updateFile = async (req, res, next) => {
	const { id } = req.params;
	try {
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		await upload({ fileTypes: docs })(req, res);
		const { namaFile } = await validatorMulter(FileSchema.updateFile)(req);
		const { nipPegawai, kategori, nama: dokNama, detail } = await DokumenServices.getDokumen(id);
		const { pegawai } = await PegawaiServices.getPegawai(nipPegawai);
		await FileServices.deleteFile({ path: detail.path, storage: "dokumen" });
		const uploadedFile = await FileServices.uploadFile({
			folder: nipPegawai,
			kategori,
			namaFile: namaFile || dokNama.replace(` - ${pegawai.nama}`, ""),
			file: req.file,
			pegawai: pegawai.nama,
		});
		const file = await DokumenServices.updateDokumen(
			{
				nama: namaFile ? `${namaFile} - ${pegawai.nama}` : dokNama,
				detail: uploadedFile,
			},
			id
		);
		res.json(responseSuccess("UPDATE file berhasil!", file));
	} catch (err) {
		next(err);
	}
};

const deleteFile = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const file = await DokumenServices.deleteDokumen(id);
		await FileServices.deleteFile({ path: file.detail.path, storage: "dokumen" });
		res.json(responseSuccess("DELETE file berhasil!", file));
	} catch (err) {
		next(err);
	}
};

const uploadPhoto = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		await upload({ fileTypes: photo })(req, res);
		const { nipPegawai } = await validatorMulter(FileSchema.uploadPhoto)(req);
		const { pegawai } = await PegawaiServices.getPegawai(nipPegawai);
		const getPhoto = await DokumenServices.getAllDokumen({ nipPegawai: pegawai.nip, kategori: "profil" });
		if (getPhoto.length === 0) {
			const uploadedPhoto = await FileServices.uploadPhoto({
				folder: pegawai.nip,
				kategori: "profil",
				namaFile: "Foto Profil",
				file: req.file,
				pegawai: pegawai.nama,
			});
			const { publicUrl } = FileServices.getPhoto(uploadedPhoto.path);
			const photo = await DokumenServices.createDokumen({
				nama: `Foto Profil - ${pegawai.nama}`,
				detail: { ...uploadedPhoto, publicUrl },
				kategori: "profil",
				nipPegawai: pegawai.nip,
			});
			res.json(responseSuccess("POST foto berhasil!", photo));
		} else {
			await FileServices.deleteFile({ path: getPhoto[0].detail.path, storage: "foto" });
			const uploadedPhoto = await FileServices.uploadPhoto({
				folder: pegawai.nip,
				kategori: "profil",
				namaFile: "Foto Profil",
				file: req.file,
				pegawai: pegawai.nama,
			});
			const { publicUrl } = FileServices.getPhoto(uploadedPhoto.path);
			const photo = await DokumenServices.updateDokumen(
				{
					nama: `Foto Profil - ${pegawai.nama}`,
					detail: { ...uploadedPhoto, publicUrl: `${publicUrl}?t=${uploadedPhoto.updated_at}` },
				},
				getPhoto[0].id
			);
			res.json(responseSuccess("POST foto berhasil!", photo));
		}
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllFile,
	getFile,
	uploadFile,
	updateFile,
	deleteFile,
	uploadPhoto,
};
