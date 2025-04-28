import winston from 'winston';
import 'winston-daily-rotate-file';

const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), 
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      level: 'debug', 
      format: winston.format.combine(
        winston.format.colorize(), 
        winston.format.simple()
      ),
    }),

    new winston.transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log', 
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, 
      maxSize: '20m', 
      maxFiles: '14d', 
      level: 'info', 
    }),

    // Error-specific log file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error', 
    }),
  ],
});

logger.exceptions.handle(
  new winston.transports.File({ filename: 'logs/exceptions.log' })
);

logger.rejections.handle(
  new winston.transports.File({ filename: 'logs/rejections.log' })
);



const errorHandlerMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Log the error
  logger.error(`Error: ${message}`, { stack: err.stack });

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};


export default logger;
export { errorHandlerMiddleware };