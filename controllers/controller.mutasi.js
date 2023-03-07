const httpStatus = require("http-status");
const config = require("../configs");
const { validator, validatorMulter } = require("../utils/validator");
const { upload } = require("../middlewares/multer");
const { MutasiServices } = require("../services");
const { responseSuccess } = require("../utils/response");
const { MutasiSchema } = require("../validations");

const { docs } = config.multer.filterFile;

const getAllMutasi = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	try {
		if (user.claims === "PEGAWAI")
			throw new Error("Hanya ADMIN dan MANAJER yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		const validated = await validator(MutasiSchema.getAllMutasi, req.query);
		const mutasi = await MutasiServices.getAllMutasi(validated);
		res.json(responseSuccess("GET mutasi berhasil!", mutasi));
	} catch (err) {
		next(err);
	}
};

const getMutasi = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims === "PEGAWAI")
			throw new Error("Hanya ADMIN dan MANAJER yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const mutasi = await MutasiServices.getMutasi(id);
		res.json(responseSuccess("GET mutasi berhasil!", mutasi));
	} catch (err) {
		next(err);
	}
};

const createMutasi = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	try {
		if (user.claims === "PEGAWAI")
			throw new Error("Hanya ADMIN dan MANAJER yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		await upload({ fileTypes: docs })(req, res);
		const validated = await validatorMulter({ schema: MutasiSchema.createMutasi })(req);
		res.json(responseSuccess("POST mutasi berhasil!", validated));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllMutasi,
	getMutasi,
	createMutasi,
};
