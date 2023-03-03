const httpStatus = require("http-status");
const config = require("../configs");
const upload = require("../middlewares/multer");
const {
	AkunServices,
	ClaimsServices,
	PegawaiServices,
	DataPribadiServices,
	InstansiServices,
	DivisiServices,
	JabatanServices,
	GolonganServices,
	StatusPegawaiServices,
	TipePegawaiServices,
	FileServices,
	DokumenServices,
} = require("../services");
const { PegawaiSchema } = require("../validations");
const { validatorMulter } = require("../utils/validator");
const { responseSuccess } = require("../utils/response");
const { pegawaiFormatter } = require("../utils/formatter");

const fileValidation = config.multer.filterFile;

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

const createPegawai = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	try {
		if (user?.claims === "MANAJER") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		await upload({ fileTypes: fileValidation.photo })(req, res);
		const { foto, ...validated } = await validatorMulter(PegawaiSchema.createPegawai, fileValidation.photo.fieldName)(req);
		await StatusPegawaiServices.getStatus(validated.status);
		await TipePegawaiServices.getTipe(validated.tipe);
		await InstansiServices.getInstansi(validated.instansi);
		await DivisiServices.getDivisi(validated.divisi);
		await GolonganServices.getGolongan(validated.golongan);
		const jabatan = await JabatanServices.getJabatan(validated.jabatan);
		const akun = await AkunServices.createUser(validated);
		const pegawai = await PegawaiServices.createPegawai({ ...validated, uuidUser: akun.id });
		await DataPribadiServices.createDataPribadi({ ...validated, nipPegawai: pegawai.nip });
		if (jabatan.nama.toLowerCase() === "manajer") {
			await ClaimsServices.setClaims({ claim: "claims", value: jabatan.nama.toUpperCase(), uid: akun.id });
		}
		const uploadedPhoto = await FileServices.uploadPhoto({
			folder: pegawai.nip,
			kategori: "profil",
			namaFile: "Foto Profil",
			file: req.file,
			pegawai: pegawai.nama,
		});
		const { publicUrl } = FileServices.getPhoto(uploadedPhoto.path);
		const photo = await DokumenServices.createDokumen({
			nama: `Foto Profil - ${pegawai.nama}`,
			detail: { ...uploadedPhoto, publicUrl },
			kategori: "profil",
			nipPegawai: pegawai.nip,
		});
		res.json(responseSuccess("POST Pegawai berhasil!", { ...validated, photo }));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllPegawai,
	getPegawai,
	createPegawai,
};
