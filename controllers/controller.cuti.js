const httpStatus = require("http-status");
const config = require("../configs");
const capitalize = require("capitalize");
const { upload } = require("../middlewares/multer");
const { CutiServices, PegawaiServices, FileServices, DokumenServices } = require("../services");
const { CutiSchema } = require("../validations");
const { validator, validatorMulter } = require("../utils/validator");
const { responseSuccess } = require("../utils/response");
const { pegawaiFormatter } = require("../utils/formatter");

const { docs } = config.multer.filterFile;

const getAllCuti = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	try {
		if (user.claims === "PEGAWAI")
			throw new Error("Hanya ADMIN dan MANAJER yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		const cuti = await CutiServices.getAllCuti();
		res.json(responseSuccess("GET cuti berhasil!", cuti));
	} catch (err) {
		next(err);
	}
};

const getCuti = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims === "PEGAWAI")
			throw new Error("Hanya ADMIN dan MANAJER yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const cuti = await CutiServices.getCuti(id);
		res.json(responseSuccess("GET cuti berhasil!", cuti));
	} catch (err) {
		next(err);
	}
};

const createCuti = async (req, res, next) => {
	const { app_metadata: user, id: uid } = req.user;
	try {
		if (user.claims === "ADMIN")
			throw new Error("Hanya PEGAWAI dan MANAJER yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		const validated = await validator(CutiSchema.createCuti, req.body);
		const getPegawai = await PegawaiServices.getPegawaiByUid(uid);
		const pegawai = pegawaiFormatter(getPegawai);
		const cuti = await CutiServices.createCuti({ ...validated, nipPegawai: pegawai.nip });
		res.json(responseSuccess("POST cuti berhasil!", cuti));
	} catch (err) {
		next(err);
	}
};

const updateCuti = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		await upload({ fileTypes: docs })(req, res);
		await validatorMulter({ schema: CutiSchema.updateCuti })(req);
		const { id: cutiId, nipPegawai, keterangan } = await CutiServices.getCuti(id);
		const { pegawai } = await PegawaiServices.getPegawai(nipPegawai);
		const uploadedCuti = await FileServices.uploadFile({
			folder: pegawai.nip,
			kategori: "cuti",
			namaFile: `SK Cuti (${capitalize.words(keterangan)})`,
			file: req.file,
			pegawai: pegawai.nama,
		});
		const dokCuti = await DokumenServices.createDokumen({
			nama: `SK Cuti ${capitalize.words(`(${keterangan}) - ${pegawai.nama}`)}`,
			detail: uploadedCuti,
			kategori: "cuti",
			nipPegawai: pegawai.nip,
		});
		const cuti = await CutiServices.updateCuti(
			{ diterima: true, dokumen: { files: [{ id: dokCuti.id, path: dokCuti.detail.path }] } },
			cutiId
		);
		await PegawaiServices.updatePegawai({ idStatus: 2 }, pegawai.nip);
		res.json(responseSuccess("UPDATE cuti berhasil!", cuti));
	} catch (err) {
		next(err);
	}
};

const deleteCuti = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const cuti = await CutiServices.deleteCuti(id);
		res.json(responseSuccess("DELETE cuti berhasil!", cuti));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllCuti,
	getCuti,
	createCuti,
	updateCuti,
	deleteCuti,
};
