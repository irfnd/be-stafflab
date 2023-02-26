const status = require("http-status");
const validator = require("../utils/validator");
const { GolonganServices } = require("../services");
const { responseSuccess } = require("../utils/response");
const { GolonganSchema } = require("../validations");

const getAllGolongan = async (req, res, next) => {
	try {
		const instansi = await GolonganServices.getAllGolongan();
		res.json(responseSuccess("GET data berhasil!", instansi));
	} catch (err) {
		next(err);
	}
};

const getGolongan = async (req, res, next) => {
	const { id } = req.params;
	try {
		if (!id) throw new Error("ID Parameter wajib diisi!", { cause: { code: status.BAD_REQUEST } });
		const instansi = await GolonganServices.getGolongan(id);
		res.json(responseSuccess("GET data berhasil!", instansi));
	} catch (err) {
		next(err);
	}
};

const createGolongan = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	try {
		if (user?.claims === "MANAJER") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: status.FORBIDDEN } });
		const validated = await validator(GolonganSchema.createGolongan, req.body);
		const instansi = await GolonganServices.createGolongan(validated);
		res.json(responseSuccess("POST data berhasil!", instansi));
	} catch (err) {
		next(err);
	}
};

const updateGolongan = async (req, res, next) => {
	const { id } = req.params;
	const { app_metadata: user } = req.user;
	try {
		if (!id) throw new Error("ID Parameter wajib diisi!", { cause: { code: status.BAD_REQUEST } });
		if (user?.claims === "MANAJER") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: status.FORBIDDEN } });
		const validated = await validator(GolonganSchema.updateGolongan, req.body);
		const instansi = await GolonganServices.updateGolongan(validated, id);
		res.json(responseSuccess("PATCH data berhasil!", instansi));
	} catch (err) {
		next(err);
	}
};

const deleteGolongan = async (req, res, next) => {
	const { id } = req.params;
	const { app_metadata: user } = req.user;
	try {
		if (!id) throw new Error("ID Parameter wajib diisi!", { cause: { code: status.BAD_REQUEST } });
		if (user?.claims === "MANAJER") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: status.FORBIDDEN } });
		const instansi = await GolonganServices.deleteGolongan(id);
		res.json(responseSuccess("DELETE data berhasil!", instansi));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllGolongan,
	getGolongan,
	createGolongan,
	updateGolongan,
	deleteGolongan,
};
