const edgeFunction = require("../utils/axios");

const createUser = async (newData) => {
	const { email, noTelepon } = newData;
	const data = JSON.stringify({ email, phone: `+62${noTelepon}`, email_confirm: true, phone_confirm: true });
	const results = await edgeFunction.post("users", data);
	return results.data.user;
};

const updateUser = async (newData, uuid) => {
	const data = JSON.stringify(newData);
	const results = await edgeFunction.put(`users/${uuid}`, data);
	return results.data.user;
};

const deleteUser = async (uuid) => {
	await edgeFunction.delete(`users/${uuid}`);
	return true;
};

module.exports = {
	createUser,
	updateUser,
	deleteUser,
};
