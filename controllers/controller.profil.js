const httpStatus = require("http-status");
const { PegawaiServices, PendidikanServices, DokumenServices } = require("../services");
const { PegawaiSchema } = require("../validations");
const { validator } = require("../utils/validator");
const { responseSuccess } = require("../utils/response");
const { pegawaiFormatter } = require("../utils/formatter");

const getProfil = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id: uid } = req.user;
	try {
		if (user.claims === "ADMIN")
			throw new Error("Hanya PEGAWAI dan MANAJER yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		const getPegawai = await PegawaiServices.getPegawaiByUid(uid);
		const pegawai = pegawaiFormatter(getPegawai);
		const pendidikan = await PendidikanServices.getAllPendidikan(pegawai.nip);
		const dokumen = await DokumenServices.getAllDokumen({ nipPegawai: pegawai.nip });
		res.json(responseSuccess("GET profil berhasil!", { profil: pegawai, pendidikan, dokumen }));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getProfil,
};
