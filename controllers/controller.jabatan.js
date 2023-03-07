const httpStatus = require("http-status");
const { validator } = require("../utils/validator");
const { JabatanServices } = require("../services");
const { responseSuccess } = require("../utils/response");
const { JabatanSchema } = require("../validations");

const getAllJabatan = async (req, res, next) => {
	try {
		const jabatan = await JabatanServices.getAllJabatan();
		res.json(responseSuccess("GET jabatan berhasil!", jabatan));
	} catch (err) {
		next(err);
	}
};

const getJabatan = async (req, res, next) => {
	const { id } = req.params;
	try {
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const jabatan = await JabatanServices.getJabatan(id);
		res.json(responseSuccess("GET jabatan berhasil!", jabatan));
	} catch (err) {
		next(err);
	}
};

const createJabatan = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		const validated = await validator(JabatanSchema.createJabatan, req.body);
		const jabatan = await JabatanServices.createJabatan(validated);
		res.json(responseSuccess("POST jabatan berhasil!", jabatan));
	} catch (err) {
		next(err);
	}
};

const updateJabatan = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const { id: jabatanId, createdAt, ...getJabatan } = await JabatanServices.getJabatan(id);
		const validated = await validator(JabatanSchema.updateJabatan, req.body);
		const jabatan = await JabatanServices.updateJabatan({ ...getJabatan, ...validated }, jabatanId);
		res.json(responseSuccess("PATCH jabatan berhasil!", jabatan));
	} catch (err) {
		next(err);
	}
};

const deleteJabatan = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const jabatan = await JabatanServices.deleteJabatan(id);
		res.json(responseSuccess("DELETE jabatan berhasil!", jabatan));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllJabatan,
	getJabatan,
	createJabatan,
	updateJabatan,
	deleteJabatan,
};
