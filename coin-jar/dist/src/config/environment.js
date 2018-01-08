"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MONGO_DB_ADDRESS = process.env.MONGO_DB_ADDRESS || 'localhost';
const MONGO_DB_PORT = process.env.MONGO_DB_PORT || '37001';
const MONGO_DB_CONN = process.env.MONGO_DB_CONN || null;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'test';
const url = MONGO_DB_CONN || `mongodb://${MONGO_DB_ADDRESS}:${MONGO_DB_PORT}/${MONGO_DB_NAME}`;
module.exports = {
    cors: {
        allowedHeaders: ['Content-Type', 'Authorization'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        origin: ['*']
    },
    dbConnections: [],
    logging: {
        transports: [
            {
                colorize: true,
                json: true,
                level: 'debug',
                transport: 'Console'
            }
        ]
    },
    server: {
        address: '127.0.0.1',
        port: 8001
    },
    smtp: {
        auth: {
            pass: process.env.SMTP_PASSWORD || '',
            user: process.env.SMTP_USER || ''
        },
        host: process.env.SMTP_HOST || '',
        port: Number.parseInt(process.env.SMTP_PORT || '465'),
        requireTLS: true
    },
    smtpOptions: {
        dateFormat: process.env.SMTP_DATE_FORMAT || 'MMMM D, YYYY h:mm A (UTC: ZZ)',
        forgotPasswordTokenUrl: 'http://localhost:4200/forgot-password',
        from: process.env.SMTP_FROM || 'LOCAL Test<none@do-not-reply>',
        newUserTokenUrl: 'http://localhost:4200/confirm-email',
        templates: './config/templates/email'
    }
};
//# sourceMappingURL=environment.js.map