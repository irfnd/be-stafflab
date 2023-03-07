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
	({ schema, multiple = false, array = false }) =>
	async (req) => {
		try {
			if (multiple) {
				const files = Object.keys(req.files).reduce((acc, key) => ({ ...acc, [key]: req.files[key][0] }), {});
				const validated = await schema.validate({ ...req.body, ...files });
				return validated;
			} else {
				if (array) {
					const validated = await schema.validate({ ...req.body, [req.files[0].fieldname]: req.files });
					return validated;
				} else {
					const validated = await schema.validate({ ...req.body, [req.file.fieldname]: req.file });
					return validated;
				}
			}
		} catch (err) {
			throw new Error(err.message, { cause: { code: httpStatus.BAD_REQUEST } });
		}
	};

module.exports = {
	validator,
	validatorMulter,
};
