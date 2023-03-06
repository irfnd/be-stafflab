const httpStatus = require("http-status");
const { PegawaiServices, DokumenServices } = require("../services");
const { PegawaiSchema } = require("../validations");
const { validator } = require("../utils/validator");
const { responseSuccess } = require("../utils/response");
const { pegawaiFormatter } = require("../utils/formatter");

const getProfil = async (req, res, next) => {
	const { id: uid } = req.user;
	try {
		const getPegawai = await PegawaiServices.getPegawaiByUid(uid);
		const pegawai = pegawaiFormatter(getPegawai);
		const dokumen = await DokumenServices.getAllDokumen({ nipPegawai: pegawai.nip });
	} catch (err) {
		next(err);
	}
};
