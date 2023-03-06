const httpStatus = require("http-status");
const { TipePegawaiServices } = require("../services");
const { responseSuccess } = require("../utils/response");

const getAllTipe = async (req, res, next) => {
	try {
		const tipe = await TipePegawaiServices.getAllTipe();
		res.json(responseSuccess("GET tipe pegawai berhasil!", tipe));
	} catch (err) {
		next(err);
	}
};

const getTipe = async (req, res, next) => {
	const { id } = req.params;
	try {
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const tipe = await TipePegawaiServices.getTipe(id);
		res.json(responseSuccess("GET tipe pegawai berhasil!", tipe));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllTipe,
	getTipe,
};
