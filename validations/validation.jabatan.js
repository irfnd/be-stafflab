const yup = require("yup");
const yupPassword = require("yup-password");

yupPassword(yup);

const createJabatan = yup.object({
	nama: yup.string().trim().max(100, "Nama jabatan harus berisi kurang dari 100 karakter!").required("Nama jabatan wajib diisi!"),
	idInstansi: yup.number().min(1).required("ID instansi wajib diisi!").typeError("ID instansi tidak valid!"),
	idDivisi: yup.number().min(1).required("ID divisi wajib diisi!").typeError("ID divisi tidak valid!"),
});

const updateJabatan = yup.object({
	nama: yup.string().trim().max(100, "Nama jabatan harus berisi kurang dari 100 karakter!").required("Nama jabatan wajib diisi!"),
	idInstansi: yup.number().min(1).typeError("ID instansi tidak valid!"),
	idDivisi: yup.number().min(1).typeError("ID divisi tidak valid!"),
});

module.exports = {
	createJabatan,
	updateJabatan,
};
