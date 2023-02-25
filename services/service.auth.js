const Supabase = require("../configs/supabase");
const status = require("http-status");

const login = async ({ email, password }) => {
	const { data: user, error: userErr } = await Supabase.auth.signInWithPassword({ email, password });
	if (userErr) throw userErr;

	return {
		accessToken: user.session.access_token,
		refreshToken: user.session.refresh_token,
		expiresAt: user.session.expires_at,
	};
};

const getSession = async () => {
	const { data, error } = await Supabase.auth.getSession();
	if (error || !data.session) throw new Error("Session kedaluwarsa, harap login ulang!", { cause: { code: status.UNAUTHORIZED } });
	return data.session;
};

const logout = async () => {
	const { error } = await Supabase.auth.signOut();
	if (error) throw new Error("Logout gagal!", { cause: { code: status.NOT_FOUND } });
	return true;
};

module.exports = {
	login,
	getSession,
	logout,
};
