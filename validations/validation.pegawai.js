const yup = require("yup");
const yupPassword = require("yup-password");
const config = require("../configs");

yupPassword(yup);

const { agama, jenisKelamin, statusPernikahan } = config.inputProps;

const createPegawai = yup.object({
	agama: yup
		.mixed()
		.oneOf(agama, `Pilih agama yang tertera! (${agama.join(", ")})`)
		.required("Agama wajib diisi!"),
	alamat: yup.string().trim().max(200, "Alamat harus berisi kurang dari 200 karakter!").required("Alamat wajib diisi!"),
	divisi: yup.string().trim().required("Divisi wajib diisi!"),
	email: yup.string().email("Email harus valid!").trim().required("Email wajib diisi!"),
	foto: yup.mixed().required("Foto wajib diisi!").typeError("Foto wajib diisi!"),
	golongan: yup.string().trim().required("Golongan pegawai wajib diisi!"),
	instansi: yup.string().trim().required("Instansi wajib diisi!"),
	jabatan: yup.string().trim().required("Jabatan wajib diisi!"),
	jenisKelamin: yup
		.mixed()
		.oneOf(jenisKelamin, `Pilih jenis kelamin yang tertera! (${jenisKelamin.join(", ")})`)
		.required("Jenis kelamin wajib diisi!"),
	kawin: yup
		.mixed()
		.oneOf(statusPernikahan, "Pilih status pernikahan yang tertera! (true, false)")
		.required("Status pernikahan wajib diisi!"),
	nama: yup.string().trim().max(150, "Nama harus berisi kurang dari 150 karakter!").required("Nama wajib diisi!"),
	nik: yup.number().required("NIK wajib diisi!").typeError("NIK wajib diisi!"),
	nip: yup.number().required("NIP wajib diisi!").typeError("NIP wajib diisi!"),
	noTelepon: yup.number().required("Nomor telepon wajib diisi!").typeError("Nomor telepon wajib diisi!"),
	status: yup.string().default("1"),
	tanggalLahir: yup.string().trim().required("Tanggal lahir wajib diisi!"),
	tempatLahir: yup.string().trim().max(20, "Tempat lahir harus berisi kurang dari 20 karakter!").required("Tempat lahir wajib diisi!"),
	tipe: yup.string().trim().required("Tipe pegawai wajib diisi!"),
});

module.exports = {
	createPegawai,
};
