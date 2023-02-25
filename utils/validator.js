const status = require("http-status");

module.exports = async (schema, data) => {
	try {
		const validated = await schema.validate(data);
		return validated;
	} catch (err) {
		throw new Error(err.message, { cause: { code: status.BAD_REQUEST } });
	}
};
