const httpStatus = require("http-status");
const config = require("../configs");
const capitalize = require("capitalize");
const { validator, validatorMulter } = require("../utils/validator");
const { upload } = require("../middlewares/multer");
const { MutasiServices, FileServices, PegawaiServices, DokumenServices, ClaimsServices, JabatanServices } = require("../services");
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
		const { nipPegawai, jenisMutasi, ...validated } = await validatorMulter({ schema: MutasiSchema.createMutasi })(req);
		const { pegawai } = await PegawaiServices.getPegawai(nipPegawai);
		const uploadedMutasi = await FileServices.uploadFile({
			folder: pegawai.nip,
			kategori: "mutasi",
			namaFile: `SK Mutasi ${capitalize.words(jenisMutasi)}`,
			file: req.file,
			pegawai: pegawai.nama,
		});
		const dokMutasi = await DokumenServices.createDokumen({
			nama: `SK Mutasi ${capitalize.words(`${jenisMutasi} - ${pegawai.nama}`)}`,
			detail: uploadedMutasi,
			kategori: "mutasi",
			nipPegawai: pegawai.nip,
		});
		const mutasi = await MutasiServices.createMutasi({
			...validated,
			jenisMutasi,
			nipPegawai: pegawai.nip,
			dokumen: { files: [{ id: dokMutasi.id, path: dokMutasi.detail.path }] },
		});
		res.json(responseSuccess("POST mutasi berhasil!", mutasi));
	} catch (err) {
		next(err);
	}
};

const updateMutasi = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims !== "MANAJER") throw new Error("Hanya MANAJER yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		await upload({ fileTypes: docs })(req, res);
		await validatorMulter({ schema: MutasiSchema.updateMutasi })(req);
		const { id: mutasiId, nipPegawai, dokumen, jenisMutasi, detail } = await MutasiServices.getMutasi(id);
		const { pegawai } = await PegawaiServices.getPegawai(nipPegawai);
		await FileServices.deleteFile({ path: dokumen.files[0].path, storage: "dokumen" });
		const uploadedMutasi = await FileServices.uploadFile({
			folder: pegawai.nip,
			kategori: "mutasi",
			namaFile: `SK Mutasi ${capitalize.words(jenisMutasi)}`,
			file: req.file,
			pegawai: pegawai.nama,
		});
		const dokMutasi = await DokumenServices.updateDokumen(
			{ nama: `SK Mutasi ${capitalize.words(`${jenisMutasi} - ${pegawai.nama}`)}`, detail: uploadedMutasi },
			dokumen.files[0].id
		);
		const mutasi = await MutasiServices.updateMutasi(
			{ diterima: true, dokumen: { files: [{ id: dokMutasi.id, path: dokMutasi.detail.path }] } },
			mutasiId
		);

		if (jenisMutasi === "golongan") {
			await PegawaiServices.updatePegawai({ idGolongan: detail.golongan.to }, pegawai.nip);
		}
		if (jenisMutasi === "pengangkatan") {
			await PegawaiServices.updatePegawai({ idTipe: detail.tipe.to }, pegawai.nip);
		}
		if (jenisMutasi === "phk" || jenisMutasi === "pensiun") {
			await PegawaiServices.updatePegawai({ idStatus: detail.status.to }, pegawai.nip);
		}
		if (jenisMutasi === "instansi" || jenisMutasi === "divisi" || jenisMutasi === "jabatan") {
			await PegawaiServices.updatePegawai(
				{ idInstansi: detail.instansi.to, idDivisi: detail.divisi.to, idJabatan: detail.jabatan.to },
				pegawai.nip
			);
			const getJabatan = await JabatanServices.getJabatan(detail.jabatan.to);
			if (getJabatan.nama.toLowerCase() === "manajer") {
				await ClaimsServices.setClaims({ claim: "claims", value: "MANAJER", uid: pegawai.uuidUser });
				await ClaimsServices.setClaims({ claim: "claims_admin", value: true, uid: pegawai.uuidUser });
			}
		}
		res.json(responseSuccess("UPDATE mutasi berhasil!", mutasi));
	} catch (err) {
		next(err);
	}
};

const deleteMutasi = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const { id: mutasiId, nipPegawai, detail, dokumen } = await MutasiServices.getMutasi(id);
		const { pegawai } = await PegawaiServices.getPegawai(nipPegawai);
		await PegawaiServices.updatePegawai(
			{
				idTipe: detail.tipe.from,
				idStatus: detail.status.from,
				idInstansi: detail.instansi.from,
				idDivisi: detail.divisi.from,
				idJabatan: detail.jabatan.from,
				idGolongan: detail.golongan.from,
			},
			pegawai.nip
		);
		const getJabatanFrom = await JabatanServices.getJabatan(detail.jabatan.from);
		const getJabatanTo = await JabatanServices.getJabatan(detail.jabatan.to);
		if (getJabatanTo.nama !== getJabatanFrom.nama && getJabatanTo.nama.toLowerCase() === "manajer") {
			await ClaimsServices.deleteClaims({ claim: "claims", uid: pegawai.uuidUser });
		}
		await FileServices.deleteFile({ path: dokumen.files[0].path, storage: "dokumen" });
		await DokumenServices.deleteDokumen(dokumen.files[0].id);
		const mutasi = await MutasiServices.deleteMutasi(mutasiId);
		res.json(responseSuccess("DELETE mutasi berhasil!", mutasi));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllMutasi,
	getMutasi,
	createMutasi,
	updateMutasi,
	deleteMutasi,
};
