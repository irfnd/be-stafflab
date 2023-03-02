const httpStatus = require("http-status");
const config = require("../configs");
const upload = require("../middlewares/multer");
const { validator, validatorMulter } = require("../utils/validator");
const { FileServices, DokumenServices } = require("../services");
const { responseSuccess } = require("../utils/response");
const { FileSchema } = require("../validations");

const getAllFile = async (req, res, next) => {
	try {
		const queries = await validator(FileSchema.getAllFile, req.query);
		const files = await DokumenServices.getAllDokumen(queries);
		res.json(responseSuccess("GET data berhasil!", files));
	} catch (err) {
		next(err);
	}
};

const getFile = async (req, res, next) => {
	const { id } = req.params;
	try {
		if (!id) throw new Error("ID parameter wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const file = await DokumenServices.getDokumen(id);
		res.json(responseSuccess("GET data berhasil!", file));
	} catch (err) {
		next(err);
	}
};

const postFile = async (req, res, next) => {
	const { tipe } = req.query;
	try {
		if (tipe !== "dokumen") throw new Error("Tipe wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		await upload({ fileTypes: config.multer.filterFile.docs })(req, res);
		const { nipPegawai, ...validated } = await validatorMulter(FileSchema.postFile)(req);

		const uploadedFile = await FileServices.postFile({ ...validated, nipPegawai, file: req.file, pegawai: null });

		res.json(responseSuccess("POST data berhasil!", { ...validated, file: req.file }));
	} catch (err) {
		next(err);
	}
};

const updateFile = async (req, res, next) => {};

const deleteFile = async (req, res, next) => {};

module.exports = {
	getAllFile,
	getFile,
	postFile,
	updateFile,
	deleteFile,
};
