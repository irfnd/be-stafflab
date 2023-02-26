const yup = require("yup");
const yupPassword = require("yup-password");

yupPassword(yup);

const createDivisi = yup.object({
	nama: yup.string().trim().max(100, "Nama divisi harus berisi kurang dari 100 karakter!").required("Nama divisi wajib diisi!"),
	idInstansi: yup.number().min(1).required("ID instansi wajib diisi!").typeError("ID instansi tidak valid!"),
});

const updateDivisi = yup.object({
	nama: yup.string().trim().max(100, "Nama divisi harus berisi kurang dari 100 karakter!"),
	idInstansi: yup.number().min(1).typeError("ID instansi tidak valid!"),
});

module.exports = {
	createDivisi,
	updateDivisi,
};
