import winston from 'winston';

// Create a Winston logger with default configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    transports: [
        // Log errors to a dedicated file
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // Log all levels to a combined file
        new winston.transports.File({ filename: 'logs/combined.log' }),
        // Log to console for development
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Export the logger for use in other modules
export default logger;