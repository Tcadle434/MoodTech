// Load base config
const config = require("./app.json");

module.exports = () => {
	// Load .env file
	require("dotenv").config();

	return {
		...config, // Spread all existing app.json config
		expo: {
			...config.expo, // Spread all existing expo config
			extra: {
				...config.expo?.extra, // Preserve any existing extra config
				apiUrlDevice: process.env.API_URL_DEVICE,
				apiUrlSimulator: process.env.API_URL_SIMULATOR,
			},
		},
	};
};
