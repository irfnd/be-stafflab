const yup = require("yup");
const yupPassword = require("yup-password");

yupPassword(yup);

const createGolongan = yup.object({
	nama: yup.string().trim().max(50, "Nama golongan harus berisi kurang dari 50 karakter!").required("Nama golongan wajib diisi"),
	keterangan: yup.string().trim().max(200, "Keterangan harus berisi kurang dari 200 karakter!").default(""),
});

const updateGolongan = yup.object({
	nama: yup.string().trim().max(50, "Nama golongan harus berisi kurang dari 50 karakter!"),
	keterangan: yup.string().trim().max(200, "Keterangan harus berisi kurang dari 200 karakter!").default(""),
});

module.exports = {
	createGolongan,
	updateGolongan,
};
