const { createLogger, format, transports } = require('winston');

const { combine, timestamp, printf } = format;

class Logger {
  constructor() {
    this.init();
  }

  init() {
    const myFormat = printf((info) => {
      const logTemplateString = `${info.timestamp} | ${info.level}: ${info.message}`;
      return logTemplateString;
    });
    this.logger = createLogger({
      format: combine(
        timestamp(),
        myFormat,
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'app.log' }),
      ],
    });
  }

  info(s) {
    this.logger.log({
      level: 'info',
      message: s,
    });
  }

  error(s) {
    this.logger.log({
      level: 'error',
      message: s,
    });
  }

  warning(s) {
    this.logger.log({
      level: 'warning',
      message: s,
    });
  }
}

module.exports = Logger;
