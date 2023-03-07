const httpStatus = require("http-status");
const { validator } = require("../utils/validator");
const { GolonganServices } = require("../services");
const { responseSuccess } = require("../utils/response");
const { GolonganSchema } = require("../validations");

const getAllGolongan = async (req, res, next) => {
	try {
		const golongan = await GolonganServices.getAllGolongan();
		res.json(responseSuccess("GET golongan berhasil!", golongan));
	} catch (err) {
		next(err);
	}
};

const getGolongan = async (req, res, next) => {
	const { id } = req.params;
	try {
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const golongan = await GolonganServices.getGolongan(id);
		res.json(responseSuccess("GET golongan berhasil!", golongan));
	} catch (err) {
		next(err);
	}
};

const createGolongan = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		const validated = await validator(GolonganSchema.createGolongan, req.body);
		const golongan = await GolonganServices.createGolongan(validated);
		res.json(responseSuccess("POST golongan berhasil!", golongan));
	} catch (err) {
		next(err);
	}
};

const updateGolongan = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const { id: golonganId, createdAt, ...getGolongan } = await GolonganServices.getGolongan(id);
		const validated = await validator(GolonganSchema.updateGolongan, req.body);
		const golongan = await GolonganServices.updateGolongan({ ...getGolongan, ...validated }, golonganId);
		res.json(responseSuccess("PATCH golongan berhasil!", golongan));
	} catch (err) {
		next(err);
	}
};

const deleteGolongan = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const golongan = await GolonganServices.deleteGolongan(id);
		res.json(responseSuccess("DELETE golongan berhasil!", golongan));
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
