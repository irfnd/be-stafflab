const httpStatus = require("http-status");
const config = require("../configs");
const upload = require("../middlewares/multer");
const { validator, validatorMulter } = require("../utils/validator");
const { PegawaiServices, FileServices, DokumenServices } = require("../services");
const { responseSuccess } = require("../utils/response");
const { FileSchema } = require("../validations");

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
		await upload({ fileTypes: config.multer.filterFile.docs })(req, res);
		const { nipPegawai, ...validated } = await validatorMulter(FileSchema.uploadFile)(req);
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
		await upload({ fileTypes: config.multer.filterFile.docs })(req, res);
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
	const { id } = req.params;
	try {
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const file = await DokumenServices.deleteDokumen(id);
		await FileServices.deleteFile({ path: file.detail.path, storage: "dokumen" });
		res.json(responseSuccess("DELETE file berhasil!", file));
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
};
