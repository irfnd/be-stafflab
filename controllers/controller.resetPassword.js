const httpStatus = require("http-status");
const { AkunServices, PegawaiServices } = require("../services");
const { PegawaiSchema } = require("../validations");
const { validator } = require("../utils/validator");
const { responseSuccess } = require("../utils/response");

const resetPasswordPegawai = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { nip } = req.params;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!nip) throw new Error("Parameter NIP wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const { password } = await validator(PegawaiSchema.resetPasswordPegawai, req.body);
		const { pegawai } = await PegawaiServices.getPegawai(nip);
		const akun = await AkunServices.updateUser({ password }, pegawai.uuidUser);
		res.json(responseSuccess("UPDATE password pegawai berhasil!", akun));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	resetPasswordPegawai,
};
