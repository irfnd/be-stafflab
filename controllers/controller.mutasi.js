const httpStatus = require("http-status");
const config = require("../configs");
const { validator, validatorMulter } = require("../utils/validator");
const { upload } = require("../middlewares/multer");
const { MutasiServices, FileServices, PegawaiServices, DokumenServices } = require("../services");
const { responseSuccess } = require("../utils/response");
const { MutasiSchema } = require("../validations");

const { docs } = config.multer.filterFile;

const getAllMutasi = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	try {
		if (user.claims === "PEGAWAI")
			throw new Error("Hanya ADMIN dan MANAJER yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		const validated = await validator(MutasiSchema.getAllMutasi, req.query);
		const mutasi = await MutasiServices.getAllMutasi(validated);
		res.json(responseSuccess("GET mutasi berhasil!", mutasi));
	} catch (err) {
		next(err);
	}
};

const getMutasi = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims === "PEGAWAI")
			throw new Error("Hanya ADMIN dan MANAJER yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const mutasi = await MutasiServices.getMutasi(id);
		res.json(responseSuccess("GET mutasi berhasil!", mutasi));
	} catch (err) {
		next(err);
	}
};

const createMutasi = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	try {
		if (user.claims === "PEGAWAI")
			throw new Error("Hanya ADMIN dan MANAJER yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		await upload({ fileTypes: docs })(req, res);
		const { nipPegawai, ...validated } = await validatorMulter({ schema: MutasiSchema.createMutasi })(req);
		const { pegawai } = await PegawaiServices.getPegawai(nipPegawai);
		const uploadedMutasi = await FileServices.uploadFile({
			folder: pegawai.nip,
			kategori: "mutasi",
			namaFile: "SK Mutasi",
			file: req.file,
			pegawai: pegawai.nama,
		});
		const dokMutasi = await DokumenServices.createDokumen({
			nama: `SK Mutasi - ${pegawai.nama}`,
			detail: uploadedMutasi,
			kategori: "mutasi",
			nipPegawai: pegawai.nip,
		});
		const mutasi = await MutasiServices.createMutasi({
			...validated,
			nipPegawai: pegawai.nip,
			dokumen: { files: [{ id: dokMutasi.id, path: dokMutasi.detail.path }] },
		});
		res.json(responseSuccess("POST mutasi berhasil!", mutasi));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllMutasi,
	getMutasi,
	createMutasi,
};
