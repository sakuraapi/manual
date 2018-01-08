"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@sakuraapi/api");
const body_parser_1 = require("body-parser");
const cors = require("cors");
const debugInit = require("debug");
const helmet = require("helmet");
const bootstrap_indexes_1 = require("./config/bootstrap/bootstrap-indexes");
const config_api_1 = require("./api/config.api");
const jar_api_1 = require("./api/jar.api");
const log_service_1 = require("./services/log-service");
const debug = debugInit('app:bootstrap');
class Bootstrap {
    constructor() {
        this.shuttingDown = false;
    }
    boot() {
        return __awaiter(this, void 0, void 0, function* () {
            debug('boot called');
            process.env.NODE_ENV = process.env.NODE_ENV || 'development';
            this.sapi = new api_1.SakuraApi({
                baseUrl: '/api',
                models: [],
                plugins: [],
                providers: [
                    log_service_1.LogService
                ],
                routables: [
                    config_api_1.ConfigApi,
                    jar_api_1.JarApi
                ]
            });
            this.log = this.sapi.getProvider(log_service_1.LogService);
            this.sapi.addMiddleware(cors(this.sapi.config.cors), 0);
            this.sapi.addMiddleware(helmet(), 0);
            this.sapi.addMiddleware(body_parser_1.json());
            if (this.sapi.config.TRACE_REQ === 'true') {
                this.sapi.addMiddleware((req, res, next) => {
                    this.log.info({
                        body: req.body,
                        method: req.method,
                        url: req.url
                    });
                    next();
                });
            }
            yield this.sapi.dbConnections.connectAll();
            const wait = [];
            wait.push(new bootstrap_indexes_1.BootstrapIndexes(this.sapi).run());
            yield Promise.all(wait);
            process.once('SIGINT', () => this.shutdownServer.call(this, 'SIGINT'));
            process.once('SIGTERM', () => this.shutdownServer.call(this, 'SIGTERM'));
            process.once('SIGUSR1', () => this.shutdownServer.call(this, 'SIGUSR1'));
            process.once('SIGUSR2', () => this.shutdownServer.call(this, 'SIGUSR2'));
            return this.sapi;
        });
    }
    shutdownServer(signal) {
        return __awaiter(this, void 0, void 0, function* () {
            debug(`shutdownServer called by ${signal}`);
            if (this.shuttingDown) {
                return;
            }
            this.shuttingDown = true;
            this.log.info(`Shutting down Donation Server (signal: ${signal})`);
            yield this.sapi
                .close()
                .catch((err) => this.log.error('Unable to shutdown SakuraApi', err));
            this.log.info('And now his watch is ended');
            process.exit(0);
        });
    }
}
exports.Bootstrap = Bootstrap;
//# sourceMappingURL=sakura-api.js.map