const { createLogger, format, transports } = require('winston');

const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

const logger = createLogger({
  format: logFormat,
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs.log' })
  ]
});

module.exports = logger;
