const httpStatus = require("http-status");
const { PegawaiServices, PendidikanServices, DokumenServices, MutasiServices } = require("../services");
const { responseSuccess } = require("../utils/response");
const { pegawaiFormatter } = require("../utils/formatter");

const getProfil = async (req, res, next) => {
	const { app_metadata: user, id: uid } = req.user;
	try {
		if (user.claims === "ADMIN")
			throw new Error("Hanya PEGAWAI dan MANAJER yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		const getPegawai = await PegawaiServices.getPegawaiByUid(uid);
		const pegawai = pegawaiFormatter(getPegawai);
		const pendidikan = await PendidikanServices.getAllPendidikan(pegawai.nip);
		const mutasi = await MutasiServices.getAllMutasi({ nipPegawai: pegawai.nip, diterima: true });
		const dokumen = await DokumenServices.getAllDokumen({ nipPegawai: pegawai.nip });
		res.json(responseSuccess("GET profil berhasil!", { profil: pegawai, pendidikan, mutasi, dokumen }));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getProfil,
};
