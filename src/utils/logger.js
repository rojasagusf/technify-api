'use strict';
const { createLogger, transports, format } = require('winston');

const logger = createLogger({
	transports: [
		new transports.Console({
			timestamp: true,
			colorize: true,
			level: 'debug',
			format: format.cli(),
		}),
	],
});

module.exports = logger;
