const yup = require("yup");
const yupPassword = require("yup-password");
const config = require("../configs");

yupPassword(yup);

const { kategoriDokumen: kategori } = config.inputProps;

const getAllFile = yup.object({
	nipPegawai: yup.string().trim(),
	kategori: yup.mixed().oneOf(kategori, `Pilih kategori yang tertera! (${kategori.filter(Boolean).join(", ")})`),
});

const uploadFile = yup.object({
	nipPegawai: yup.string().trim().required("NIP pegawai wajib diisi!"),
	namaFile: yup.string().trim().required("Nama file wajib diisi!"),
	kategori: yup
		.mixed()
		.oneOf(kategori.filter(Boolean), `Pilih kategori yang tertera! (${kategori.filter(Boolean).join(", ")})`)
		.required("Kategori wajib diisi!"),
	dokumen: yup.mixed().required("Dokumen wajib diisi!"),
});

const updateFile = yup.object({
	namaFile: yup.string().trim(),
	dokumen: yup.mixed().required("Dokumen wajib diisi!"),
});

const uploadPhoto = yup.object({
	nipPegawai: yup.string().trim().required("NIP pegawai wajib diisi!"),
	foto: yup.mixed().required("Foto wajib diisi!"),
});

module.exports = {
	getAllFile,
	uploadFile,
	updateFile,
	uploadPhoto,
};
