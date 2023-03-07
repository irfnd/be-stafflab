const yup = require("yup");
const yupPassword = require("yup-password");

yupPassword(yup);

const createCuti = yup.object({
	mulaiCuti: yup.string().trim().required("Tanggal mulai cuti wajib diisi!"),
	selesaiCuti: yup
		.string()
		.trim()
		.required("Tanggal selesai cuti wajib diisi!")
		.notOneOf([yup.ref("mulaiCuti"), null], "Tanggal selesai cuti tidak boleh sama dengan tanggal mulai cuti!"),
	keterangan: yup
		.string()
		.trim()
		.max(100, "Keterangan cuti harus berisi kurang dari 100 karakter!")
		.required("Keterangan cuti wajib diisi!"),
});

const updateCuti = yup.object({ dokumen: yup.mixed().required("Dokumen wajib diisi!") });

module.exports = {
	createCuti,
	updateCuti,
};
