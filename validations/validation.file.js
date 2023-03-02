const yup = require("yup");
const yupPassword = require("yup-password");

yupPassword(yup);

const kategori = ["profil", "pribadi", "lamaran", "pendidikan", "mutasi", "cuti", "hukuman", null];

const getAllFile = yup.object({
	nipPegawai: yup.string().trim(),
	kategori: yup.mixed().oneOf(kategori, `Kategori yang tersedia (${kategori.filter(Boolean).join(", ")})`),
});

const postFile = yup.object({
	nipPegawai: yup.string().trim().required("NIP pegawai wajib diisi!"),
	namaFile: yup.string().trim().required("Nama file wajib diisi!"),
	kategori: yup
		.mixed()
		.oneOf(kategori.filter(Boolean), `Kategori yang tersedia (${kategori.filter(Boolean).join(", ")})`)
		.required("Kategori wajib diisi!"),
});

module.exports = {
	getAllFile,
	postFile,
};
