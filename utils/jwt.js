const { AuthServices } = require("../services");
const jwtDecode = require("jwt-decode");
const httpStatus = require("http-status");

module.exports = async (token) => {
	const decodedToken = jwtDecode(token);
	const now = new Date().getTime() / 1000;
	if (decodedToken.exp < now) {
		await AuthServices.logout();
		throw new Error("Token kedaluwarsa, harap login ulang!", { cause: { code: httpStatus.UNAUTHORIZED } });
	}

	const { user } = await AuthServices.getSession();
	if (["ADMIN", "MANAJER"].includes(user.app_metadata.claims)) return user;
	user.app_metadata.claims = "PEGAWAI";
	return user;
};
