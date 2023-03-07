const yup = require("yup");
const config = require("../configs");
const yupPassword = require("yup-password");

yupPassword(yup);

const { jenjangPendidikan } = config.inputProps;

const getAllPendidikan = yup.object({ nipPegawai: yup.number() });

const createPendidikan = yup.object({
	nipPegawai: yup.number().required("NIP wajib diisi!").typeError("NIP wajib diisi!"),
	nama: yup
		.string()
		.trim()
		.max(100, "Nama instansi harus berisi kurang dari 100 karakter!")
		.required("Nama instansi pendidikan wajib diisi!"),
	jenjang: yup
		.mixed()
		.oneOf(jenjangPendidikan.filter(Boolean), `Pilih jenjang pendidikan yang tertera! (${jenjangPendidikan.filter(Boolean).join(", ")})`)
		.required("Jenjang wajib diisi!"),
	jurusan: yup.string().trim().max(150, "Jurusan harus berisi kurang dari 150 karakter!").required("Jurusan wajib diisi!"),
	tahunMasuk: yup
		.number()
		.min(1000, "Masukan tahun masuk dengan benar!")
		.max(9999, "Masukan tahun masuk dengan benar!")
		.required("Tahun masuk wajib diisi!")
		.typeError("Tahun masuk wajib diisi!"),
	tahunLulus: yup
		.number()
		.min(1000, "Masukan tahun lulus dengan benar!")
		.max(9999, "Masukan tahun lulus dengan benar!")
		.required("Tahun lulus wajib diisi!")
		.typeError("Tahun lulus wajib diisi!"),
	gelar: yup.string(),
	ijazah: yup.mixed().required("Ijazah wajib diisi!"),
	transkrip: yup.mixed().required("Transkrip wajib diisi!"),
});

const updatePendidikan = yup.object({
	nama: yup.string().trim().max(100, "Nama instansi harus berisi kurang dari 100 karakter!"),
	jenjang: yup.mixed().oneOf(jenjangPendidikan, `Pilih jenjang pendidikan yang tertera! (${jenjangPendidikan.filter(Boolean).join(", ")})`),
	jurusan: yup.string().trim().max(150, "Jurusan harus berisi kurang dari 150 karakter!"),
	tahunMasuk: yup
		.number()
		.min(1000, "Masukan tahun masuk dengan benar!")
		.max(9999, "Masukan tahun masuk dengan benar!")
		.typeError("Tahun masuk wajib diisi!"),
	tahunLulus: yup
		.number()
		.min(1000, "Masukan tahun lulus dengan benar!")
		.max(9999, "Masukan tahun lulus dengan benar!")
		.typeError("Tahun lulus wajib diisi!"),
	gelar: yup.string(),
	ijazah: yup.mixed(),
	transkrip: yup.mixed(),
});

module.exports = {
	getAllPendidikan,
	createPendidikan,
	updatePendidikan,
};
