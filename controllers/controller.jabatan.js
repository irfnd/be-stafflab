const status = require("http-status");
const validator = require("../utils/validator");
const { JabatanServices } = require("../services");
const { responseSuccess } = require("../utils/response");
const { JabatanSchema } = require("../validations");

const getAllJabatan = async (req, res, next) => {
	try {
		const instansi = await JabatanServices.getAllJabatan();
		res.json(responseSuccess("GET data berhasil!", instansi));
	} catch (err) {
		next(err);
	}
};

const getJabatan = async (req, res, next) => {
	const { id } = req.params;
	try {
		if (!id) throw new Error("ID Parameter wajib diisi!", { cause: { code: status.BAD_REQUEST } });
		const instansi = await JabatanServices.getJabatan(id);
		res.json(responseSuccess("GET data berhasil!", instansi));
	} catch (err) {
		next(err);
	}
};

const createJabatan = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	try {
		if (user?.claims === "MANAJER") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: status.FORBIDDEN } });
		const validated = await validator(JabatanSchema.createJabatan, req.body);
		const instansi = await JabatanServices.createJabatan(validated);
		res.json(responseSuccess("POST data berhasil!", instansi));
	} catch (err) {
		next(err);
	}
};

const updateJabatan = async (req, res, next) => {
	const { id } = req.params;
	const { app_metadata: user } = req.user;
	try {
		if (!id) throw new Error("ID Parameter wajib diisi!", { cause: { code: status.BAD_REQUEST } });
		if (user?.claims === "MANAJER") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: status.FORBIDDEN } });
		const validated = await validator(JabatanSchema.updateJabatan, req.body);
		const instansi = await JabatanServices.updateJabatan(validated, id);
		res.json(responseSuccess("PATCH data berhasil!", instansi));
	} catch (err) {
		next(err);
	}
};

const deleteJabatan = async (req, res, next) => {
	const { id } = req.params;
	const { app_metadata: user } = req.user;
	try {
		if (!id) throw new Error("ID Parameter wajib diisi!", { cause: { code: status.BAD_REQUEST } });
		if (user?.claims === "MANAJER") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: status.FORBIDDEN } });
		const instansi = await JabatanServices.deleteJabatan(id);
		res.json(responseSuccess("DELETE data berhasil!", instansi));
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
