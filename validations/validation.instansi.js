const yup = require("yup");
const yupPassword = require("yup-password");

yupPassword(yup);

const createInstansi = yup.object({
	nama: yup.string().trim().max(100, "Nama instansi harus berisi kurang dari 100 karakter!").required("Nama instansi wajib diisi!"),
	alamat: yup.string().trim().max(300, "Alamat instansi harus berisi kurang dari 300 karakter!").required("Alamat instansi wajib diisi!"),
});

const updateInstansi = yup.object({
	nama: yup.string().trim().max(100, "Nama instansi harus berisi kurang dari 100 karakter!"),
	alamat: yup.string().trim().max(300, "Alamat instansi harus berisi kurang dari 300 karakter!"),
});

module.exports = {
	createInstansi,
	updateInstansi,
};
