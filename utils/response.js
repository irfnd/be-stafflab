module.exports = {
	responseSuccess: (message, results) => ({ success: true, message, results }),
	responseError: (error) => ({ success: false, message: error.message }),
};
