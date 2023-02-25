const { AuthServices } = require("../services");
const validator = require("../utils/validator");
const { responseSuccess } = require("../utils/response");
const { Auth: AuthSchema } = require("../validations");

const login = async (req, res, next) => {
	try {
		const validated = await validator(AuthSchema.login, req.body);
		const user = await AuthServices.login(validated);
		res.json(responseSuccess("Login berhasil!", { ...user }));
	} catch (err) {
		next(err);
	}
};

module.exports = {
	login,
};
