import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';

@Injectable()
export class CustomLogger extends ConsoleLogger implements LoggerService {
  private readonly logger: winston.Logger;

  constructor(context?: string) {
    super(context);

    // Configure the Winston logger
    const logDir = path.join(__dirname, '..', 'logs'); // Set the log directory path

    this.logger = winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.prettyPrint(),
      ),
      transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
          filename: path.join(logDir, 'application-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });

    // Overwrite the base Logger methods
    this.overrideLoggerMethods();
  }

  private overrideLoggerMethods() {
    this.log = this.logger.info.bind(this.logger);
    this.error = this.logger.error.bind(this.logger);
    this.warn = this.logger.warn.bind(this.logger);
    this.debug = this.logger.debug.bind(this.logger);
    this.verbose = this.logger.verbose.bind(this.logger);
  }
}
