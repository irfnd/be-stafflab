const httpStatus = require("http-status");

const allMethods = (req, res) => res.status(httpStatus.NOT_FOUND).json({ message: "Route not found" });

module.exports = { allMethods };
