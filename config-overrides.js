const { overrideDevServer } = require('customize-cra');

const devServerConfig = () => (config) => {
	return {
		...config,
		port: 3000,
		host: 'localhost',
		client: {
			overlay: {
				errors: true,
				warnings: false,
			},
			webSocketURL: 'ws://localhost:3000/ws',
		},
	}
};

module.exports = {
	devServer: overrideDevServer(devServerConfig())
}