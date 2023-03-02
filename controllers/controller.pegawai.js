const httpStatus = require("http-status");
const { PegawaiServices } = require("../services");
const { responseSuccess } = require("../utils/response");
const { pegawaiFormatter } = require("../utils/formatter");

const getAllPegawai = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	try {
		if (user?.claims === "MANAJER") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		const pegawai = await PegawaiServices.getAllPegawai();
		res.json(responseSuccess("GET data berhasil!", pegawaiFormatter(pegawai)));
	} catch (err) {
		next(err);
	}
};

const getPegawai = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { nip } = req.params;
	try {
		if (user?.claims === "MANAJER") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!nip) throw new Error("Parameter NIP wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const pegawai = await PegawaiServices.getPegawai(nip);
		res.json(responseSuccess("GET data berhasil!", pegawaiFormatter(pegawai)));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllPegawai,
	getPegawai,
};
