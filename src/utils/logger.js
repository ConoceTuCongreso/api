const { createLogger, format, transports } = require('winston');

const { combine, timestamp, printf } = format;

const myFormat = printf((info) => {
  const logTemplateString = `${info.timestamp} | ${info.level}: ${info.message}`;
  return logTemplateString;
});

const logger = createLogger({
  format: combine(
    timestamp(),
    myFormat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log' }),
  ],
});

module.exports = logger;
