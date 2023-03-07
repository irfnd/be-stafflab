const httpStatus = require("http-status");
const multer = require("multer");
const parseSize = require("filesize-parser");
const util = require("util");

const upload = ({ fileTypes, isArray = false }) => {
	const mimetypes = Object.keys(fileTypes.fileTypes);
	const extensions = Object.values(fileTypes.fileTypes).join(", ");

	if (isArray) {
		return util.promisify(
			multer({
				limits: { fileSize: parseSize(fileTypes.limit, { base: 10 }) },
				storage: multer.memoryStorage(),
				fileFilter: (req, file, cb) => {
					if (mimetypes.includes(file.mimetype)) return cb(null, true);
					return cb(
						new Error(`Hanya file dengan ekstensi (${extensions}) yang diizinkan!`, { cause: { code: httpStatus.BAD_REQUEST } }),
						false
					);
				},
			}).array(fileTypes.fieldName)
		);
	}
	return util.promisify(
		multer({
			limits: { fileSize: parseSize(fileTypes.limit, { base: 10 }) },
			storage: multer.memoryStorage(),
			fileFilter: (req, file, cb) => {
				if (mimetypes.includes(file.mimetype)) return cb(null, true);
				return cb(
					new Error(`Hanya file dengan ekstensi (${extensions}) yang diizinkan!`, { cause: { code: httpStatus.BAD_REQUEST } }),
					false
				);
			},
		}).single(fileTypes.fieldName)
	);
};

const uploadMultiple = ({ fileTypes, fields }) => {
	const mimetypes = Object.keys(fileTypes.fileTypes);
	const extensions = Object.values(fileTypes.fileTypes).join(", ");

	return util.promisify(
		multer({
			limits: { fileSize: parseSize(fileTypes.limit, { base: 10 }) },
			storage: multer.memoryStorage(),
			fileFilter: (req, file, cb) => {
				if (mimetypes.includes(file.mimetype)) return cb(null, true);
				return cb(
					new Error(`Hanya file dengan ekstensi (${extensions}) yang diizinkan!`, { cause: { code: httpStatus.BAD_REQUEST } }),
					false
				);
			},
		}).fields(fields)
	);
};

module.exports = {
	upload,
	uploadMultiple,
};
