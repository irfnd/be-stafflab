const httpStatus = require("http-status");
const { validator } = require("../utils/validator");
const { InstansiServices } = require("../services");
const { responseSuccess } = require("../utils/response");
const { InstansiSchema } = require("../validations");

const getAllInstansi = async (req, res, next) => {
	try {
		const instansi = await InstansiServices.getAllInstansi();
		res.json(responseSuccess("GET instansi berhasil!", instansi));
	} catch (err) {
		next(err);
	}
};

const getInstansi = async (req, res, next) => {
	const { id } = req.params;
	try {
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const instansi = await InstansiServices.getInstansi(id);
		res.json(responseSuccess("GET instansi berhasil!", instansi));
	} catch (err) {
		next(err);
	}
};

const createInstansi = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		const validated = await validator(InstansiSchema.createInstansi, req.body);
		const instansi = await InstansiServices.createInstansi(validated);
		res.json(responseSuccess("POST instansi berhasil!", instansi));
	} catch (err) {
		next(err);
	}
};

const updateInstansi = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const { id: instansiId, createdAt, ...getInstansi } = await InstansiServices.getInstansi(id);
		const validated = await validator(InstansiSchema.updateInstansi, req.body);
		const instansi = await InstansiServices.updateInstansi({ ...getInstansi, ...validated }, instansiId);
		res.json(responseSuccess("PATCH instansi berhasil!", instansi));
	} catch (err) {
		next(err);
	}
};

const deleteInstansi = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const instansi = await InstansiServices.deleteInstansi(id);
		res.json(responseSuccess("DELETE instansi berhasil!", instansi));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllInstansi,
	getInstansi,
	createInstansi,
	updateInstansi,
	deleteInstansi,
};
