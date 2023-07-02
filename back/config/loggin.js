const { createLogger, transports, format } = require("winston");
const DailyRotateFile = require('winston-daily-rotate-file');

const fileRotateTransport = new DailyRotateFile({
    filename: 'server-%DATE%.log',
    dirname: 'logs/info',
    datePattern: 'YYYY-MM-DD',
    colorize: false,
    format: format.combine(format.uncolorize(), format.timestamp(), format.json()),
});
const errorfileRotate = new DailyRotateFile({
    filename: 'error-%DATE%.log',
    dirname: 'logs/error',
    datePattern: 'YYYY-MM-DD',
    colorize: false,
    level: 'error',
    format: format.combine(format.uncolorize(), format.timestamp(), format.json()),
});

var logger = createLogger({
    level: 'info',
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.splat(),
                format.metadata(),
                format.timestamp(),
                format.printf(({ timestamp, level, message }) => {
                    return `[${timestamp}] ${level}: ${message}.`;
                })
            ),
        }),
        errorfileRotate,
        fileRotateTransport,
    ]
});

logger.stream = {
    write: function(message, encoding) {
        logger.info(message.trim().replace('\u001b[0m', ''));
    },
};

module.exports = { logger };