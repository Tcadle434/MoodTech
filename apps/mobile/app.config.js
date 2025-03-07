module.exports = () => {
	// Load .env file
	require("dotenv").config();

	return {
		expo: {
			name: "MoodTech",
			slug: "moodtech",
			// ... rest of your existing app.json config ...
			extra: {
				apiUrlDevice: process.env.API_URL_DEVICE,
				apiUrlSimulator: process.env.API_URL_SIMULATOR,
			},
		},
	};
};
