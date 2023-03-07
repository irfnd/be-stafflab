const yup = require("yup");
const config = require("../configs");
const yupPassword = require("yup-password");

yupPassword(yup);

const { jenisMutasi } = config.inputProps;

const getAllMutasi = yup.object({
	nipPegawai: yup.number(),
	jenisMutasi: yup.mixed().oneOf(jenisMutasi, `Pilih jenis mutasi yang tertera! (${jenisMutasi.filter(Boolean).join(", ")})`),
	diterima: yup.boolean().default(false),
});

const createMutasi = yup.object({
	nipPegawai: yup.number().required("NIP wajib diisi!").typeError("NIP wajib diisi!"),
	jenisMutasi: yup
		.mixed()
		.oneOf(jenisMutasi.filter(Boolean), `Pilih jenis mutasi yang tertera! (${jenisMutasi.filter(Boolean).join(", ")})`)
		.required("Jenis mutasi wajib diisi!"),
	detail: yup
		.object({
			tipe: yup.object({
				from: yup.number().required("Detail tipe from wajib diisi!"),
				to: yup.number().required("Detail tipe to wajib diisi!"),
			}),
		})
		.json(),
	dokumen: yup.mixed().required("Dokumen wajib diisi!"),
	tanggalMutasi: yup.string().trim().required("Tanggal mutasi wajib diisi!"),
});

module.exports = {
	getAllMutasi,
	createMutasi,
};
