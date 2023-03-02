const httpStatus = require("http-status");
const { validator } = require("../utils/validator");
const { DivisiServices } = require("../services");
const { responseSuccess } = require("../utils/response");
const { DivisiSchema } = require("../validations");

const getAllDivisi = async (req, res, next) => {
	try {
		const divisi = await DivisiServices.getAllDivisi();
		res.json(responseSuccess("GET data berhasil!", divisi));
	} catch (err) {
		next(err);
	}
};

const getDivisi = async (req, res, next) => {
	const { id } = req.params;
	try {
		if (!id) throw new Error("ID parameter wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const divisi = await DivisiServices.getDivisi(id);
		res.json(responseSuccess("GET data berhasil!", divisi));
	} catch (err) {
		next(err);
	}
};

const createDivisi = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	try {
		if (user?.claims === "MANAJER") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		const validated = await validator(DivisiSchema.createDivisi, req.body);
		const divisi = await DivisiServices.createDivisi(validated);
		res.json(responseSuccess("POST data berhasil!", divisi));
	} catch (err) {
		next(err);
	}
};

const updateDivisi = async (req, res, next) => {
	const { id } = req.params;
	const { app_metadata: user } = req.user;
	try {
		if (!id) throw new Error("ID parameter wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		if (user?.claims === "MANAJER") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		const validated = await validator(DivisiSchema.updateDivisi, req.body);
		const divisi = await DivisiServices.updateDivisi(validated, id);
		res.json(responseSuccess("PATCH data berhasil!", divisi));
	} catch (err) {
		next(err);
	}
};

const deleteDivisi = async (req, res, next) => {
	const { id } = req.params;
	const { app_metadata: user } = req.user;
	try {
		if (!id) throw new Error("ID parameter wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		if (user?.claims === "MANAJER") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		const divisi = await DivisiServices.deleteDivisi(id);
		res.json(responseSuccess("DELETE data berhasil!", divisi));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllDivisi,
	getDivisi,
	createDivisi,
	updateDivisi,
	deleteDivisi,
};
