const yup = require("yup");
const yupPassword = require("yup-password");

yupPassword(yup);

const login = yup.object({
	email: yup.string().email("Email harus valid!").trim().required("Email wajib diisi!"),
	password: yup.string().trim().required("Password wajib diisi!"),
});

const refresh = yup.object({
	refreshToken: yup.string().required("Refresh token wajib diisi!"),
});

module.exports = {
	login,
	refresh,
};
