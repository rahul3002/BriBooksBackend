import winston from 'winston';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack, service }) => {
    return `${timestamp} [${service || 'app'}] ${level}: ${stack || message}`;
});

// Create logger instance
export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    defaultMeta: { service: 'bribooks' },
    transports: [
        // Console transport
        new winston.transports.Console({
            format: combine(
                colorize(),
                logFormat
            )
        }),
        // File transport for errors
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error'
        }),
        // File transport for all logs
        new winston.transports.File({
            filename: 'logs/combined.log'
        })
    ]
});

// Create service-specific logger
export const createServiceLogger = (serviceName: string) => {
    return logger.child({ service: serviceName });
};

export default logger;
