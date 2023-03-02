const pegawaiFormatter = (data) => {
	if (Array.isArray(data)) {
		return data.map(({ createdAt, nipPegawai, pegawai: { createdAt: _, ...akun }, ...selectedData }) => ({ ...selectedData, ...akun }));
	} else {
		const { createdAt, nipPegawai, pegawai, ...selectedData } = data;
		const { createdAt: _, ...akun } = pegawai;
		return { ...selectedData, ...akun };
	}
};

module.exports = {
	pegawaiFormatter,
};
