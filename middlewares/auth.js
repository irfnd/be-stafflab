const status = require("http-status");
const checkToken = require("../utils/jwt");

const auth = async (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	try {
		if (!token) throw new Error("Akses token wajib diisi!", { cause: { code: status.FORBIDDEN } });
		const user = await checkToken(token);
		req.user = user;
		next();
	} catch (err) {
		next(err);
	}
};

module.exports = auth;
