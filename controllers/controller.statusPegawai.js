const httpStatus = require("http-status");
const { StatusPegawaiServices } = require("../services");
const { responseSuccess } = require("../utils/response");

const getAllStatus = async (req, res, next) => {
	try {
		const status = await StatusPegawaiServices.getAllStatus();
		res.json(responseSuccess("GET data berhasil!", status));
	} catch (err) {
		next(err);
	}
};

const getStatus = async (req, res, next) => {
	const { id } = req.params;
	try {
		if (!id) throw new Error("ID parameter wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const status = await StatusPegawaiServices.getStatus(id);
		res.json(responseSuccess("GET data berhasil!", status));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllStatus,
	getStatus,
};
