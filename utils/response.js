module.exports = {
	responseSuccess: (message, results) => ({ success: true, message, results: results || undefined }),
	responseError: (error) => ({ success: false, message: error.message }),
};
