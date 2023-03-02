const photo = {
	fileTypes: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
	extensions: [".jpg", ".jpeg", ".png"],
	limit: "100KB",
};

const docs = {
	fileTypes: {
		"application/msword": [".doc", ".dot"],
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
		"application/pdf": [".pdf"],
	},
	extensions: [".doc", ".dot", ".docx", ".pdf"],
	limit: "5MB",
};

module.exports = {
	photo,
	docs,
};
