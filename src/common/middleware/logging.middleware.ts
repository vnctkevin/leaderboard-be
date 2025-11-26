import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, ip } = req;
        const start = Date.now();

        res.on('finish', () => {
            const { statusCode } = res;
            const duration = Date.now() - start;
            const logMessage = `${new Date().toISOString()} - ${ip} - ${method} ${originalUrl} - ${statusCode} - ${duration}ms\n`;

            const logFilePath = path.join(__dirname, '..', '..', 'access.log');
            fs.appendFile(logFilePath, logMessage, (err) => {
                if (err) {
                    console.error('Failed to write to log file:', err);
                }
            });
        });

        next();
    }
}
