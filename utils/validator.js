const httpStatus = require("http-status");

const validator = async (schema, data) => {
	try {
		const validated = await schema.validate(data);
		return validated;
	} catch (err) {
		throw new Error(err.message, { cause: { code: httpStatus.BAD_REQUEST } });
	}
};

const validatorMulter =
	(schema, fileType = null) =>
	async (req) => {
		try {
			if (fileType) {
				const validated = await schema.validate({ ...req.body, [fileType]: req.file });
				return validated;
			} else {
				const validated = await schema.validate(req.body);
				return validated;
			}
		} catch (err) {
			throw new Error(err.message, { cause: { code: httpStatus.BAD_REQUEST } });
		}
	};

module.exports = {
	validator,
	validatorMulter,
};
