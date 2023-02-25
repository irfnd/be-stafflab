const { responseError } = require("../utils/response");

module.exports = (err, req, res, next) => {
	res.status(err?.cause?.code || err?.status || 500).json(responseError(err));
};
