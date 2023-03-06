const httpStatus = require("http-status");
const config = require("../configs");
const { uploadMultiple } = require("../middlewares/multer");
const { PegawaiServices, PendidikanServices, FileServices, DokumenServices } = require("../services");
const { PendidikanSchema } = require("../validations");
const { validator, validatorMulter } = require("../utils/validator");
const { responseSuccess } = require("../utils/response");

const { docs } = config.multer.filterFile;

const getAllPendidikan = async (req, res, next) => {
	try {
		const { nipPegawai } = await validator(PendidikanSchema.getAllPendidikan, req.query);
		const pendidikan = await PendidikanServices.getAllPendidikan(nipPegawai);
		res.json(responseSuccess("GET pendidikan berhasil!", pendidikan));
	} catch (err) {
		next(err);
	}
};

const createPendidikan = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		await uploadMultiple({ fileTypes: docs, fieldName: ["ijazah", "transkrip"] })(req, res);
		const { ijazah, transkrip, ...validated } = await validatorMulter(PendidikanSchema.createPendidikan, true)(req);
		const { pegawai } = await PegawaiServices.getPegawai(validated.nipPegawai);
		const uploadedIjazah = await FileServices.uploadFile({
			folder: pegawai.nip,
			namaFile: `Ijazah ${validated.jenjang.replaceAll("/", "-")}`,
			kategori: "pendidikan",
			file: req.files.ijazah[0],
			pegawai: pegawai.nama,
		});
		const uploadedTranskrip = await FileServices.uploadFile({
			folder: pegawai.nip,
			namaFile: `Transkrip Nilai ${validated.jenjang.replaceAll("/", "-")}`,
			kategori: "pendidikan",
			file: req.files.transkrip[0],
			pegawai: pegawai.nama,
		});
		const dokIjazah = await DokumenServices.createDokumen({
			nama: `Ijazah ${validated.jenjang.replaceAll("/", "-")} - ${pegawai.nama}`,
			detail: uploadedIjazah,
			kategori: "pendidikan",
			nipPegawai: pegawai.nip,
		});
		const dokTranskrip = await DokumenServices.createDokumen({
			nama: `Transkrip Nilai ${validated.jenjang.replaceAll("/", "-")} - ${pegawai.nama}`,
			detail: uploadedTranskrip,
			kategori: "pendidikan",
			nipPegawai: pegawai.nip,
		});
		const pendidikan = await PendidikanServices.createPendidikan({
			...validated,
			dokumen: { ijazah: dokIjazah.id, transkrip: dokTranskrip.id },
		});
		res.json(responseSuccess("POST pendidikan berhasil!", pendidikan));
	} catch (err) {
		next(err);
	}
};

const updatePendidikan = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		await uploadMultiple({ fileTypes: docs, fieldName: ["ijazah", "transkrip"] })(req, res);
		const { ijazah, transkrip, ...validated } = await validatorMulter(PendidikanSchema.updatePendidikan, true)(req);
		const { dokumen, nipPegawai, jenjang } = await PendidikanServices.getPendidikan(id);
		const { pegawai } = await PegawaiServices.getPegawai(nipPegawai);
		const getIjazah = await DokumenServices.getDokumen(dokumen.ijazah);
		const getTranskrip = await DokumenServices.getDokumen(dokumen.transkrip);

		let dokIjazah = null;
		let dokTranskrip = null;
		if (ijazah) {
			await FileServices.deleteFile({ path: getIjazah.detail.path, storage: "dokumen" });
			const uploadedIjazah = await FileServices.uploadFile({
				folder: pegawai.nip,
				namaFile: validated.jenjang ? `Ijazah ${validated.jenjang.replaceAll("/", "-")}` : `Ijazah ${jenjang.replaceAll("/", "-")}`,
				kategori: "pendidikan",
				file: req.files.ijazah[0],
				pegawai: pegawai.nama,
			});
			dokIjazah = await DokumenServices.updateDokumen(
				{
					nama: validated.jenjang
						? `Ijazah ${validated.jenjang?.replaceAll("/", "-")} - ${pegawai.nama}`
						: `Ijazah ${jenjang?.replaceAll("/", "-")} - ${pegawai.nama}`,
					detail: uploadedIjazah,
				},
				getIjazah.id
			);
		}

		if (transkrip) {
			await FileServices.deleteFile({ path: getTranskrip.detail.path, storage: "dokumen" });
			const uploadedTranskrip = await FileServices.uploadFile({
				folder: pegawai.nip,
				namaFile: validated.jenjang
					? `Transkrip Nilai ${validated.jenjang.replaceAll("/", "-")}`
					: `Transkrip Nilai ${jenjang.replaceAll("/", "-")}`,
				kategori: "pendidikan",
				file: req.files.transkrip[0],
				pegawai: pegawai.nama,
			});
			dokTranskrip = await DokumenServices.updateDokumen(
				{
					nama: validated.jenjang
						? `Transkrip Nilai ${validated.jenjang?.replaceAll("/", "-")} - ${pegawai.nama}`
						: `Transkrip Nilai ${jenjang?.replaceAll("/", "-")} - ${pegawai.nama}`,
					detail: uploadedTranskrip,
				},
				getTranskrip.id
			);
		}

		const pendidikan = await PendidikanServices.updatePendidikan(
			{
				...validated,
				dokumen: {
					ijazah: dokIjazah ? dokIjazah.id : dokumen.ijazah,
					transkrip: dokTranskrip ? dokTranskrip.id : dokumen.transkrip,
				},
			},
			id
		);
		res.json(responseSuccess("UPDATE pendidikan berhasil!", pendidikan));
	} catch (err) {
		next(err);
	}
};

const deletePendidikan = async (req, res, next) => {
	const { app_metadata: user } = req.user;
	const { id } = req.params;
	try {
		if (user.claims !== "ADMIN") throw new Error("Hanya ADMIN yang dapat mengakses!", { cause: { code: httpStatus.FORBIDDEN } });
		if (!id) throw new Error("Parameter ID wajib diisi!", { cause: { code: httpStatus.BAD_REQUEST } });
		const { id: pendidikanId, dokumen } = await PendidikanServices.getPendidikan(id);
		const getIjazah = await DokumenServices.getDokumen(dokumen.ijazah);
		const getTranskrip = await DokumenServices.getDokumen(dokumen.transkrip);
		await FileServices.deleteFile({ path: getIjazah.detail.path, storage: "dokumen" });
		await FileServices.deleteFile({ path: getTranskrip.detail.path, storage: "dokumen" });
		await DokumenServices.deleteDokumen(getIjazah.id);
		await DokumenServices.deleteDokumen(getTranskrip.id);
		const pendidikan = await PendidikanServices.deletePendidikan(pendidikanId);
		res.json(responseSuccess("DELETE pendidikan berhasil!", pendidikan));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	getAllPendidikan,
	createPendidikan,
	updatePendidikan,
	deletePendidikan,
};
