"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const os_1 = require("os");
const request = require("request-promise-native");
const winston_1 = require("winston");
const winstonAwsCloudWatch = require("winston-aws-cloudwatch");
const error_to_json_string_1 = require("../lib/error-to-json-string");
let LogService = LogService_1 = class LogService extends api_1.SakuraApiInjectable {
    constructor() {
        super();
        const config = this.sapi.config.logging || {};
        if (!LogService_1.logger) {
            LogService_1.logger = new winston_1.Logger();
            this.initializeTransports(config);
            LogService_1.hostName = os_1.hostname() || 'unknown';
            LogService_1.nodeEnv = process.env.NODE_ENV || 'unknown';
            this.getIpInfo();
            LogService_1.logger.on('error', (err) => {
                console.log(`Logging Error: %O:`, err);
            });
        }
    }
    get logger() {
        return LogService_1.logger;
    }
    error(message, err) {
        this.logger.log('error', this.buildJsonObj(message, err));
    }
    warn(message, err) {
        this.logger.log('warn', this.buildJsonObj(message, err));
    }
    info(message, err) {
        this.logger.log('info', this.buildJsonObj(message, err));
    }
    verbose(message, err) {
        this.logger.log('verbose', this.buildJsonObj(message, err));
    }
    debug(message, err) {
        this.logger.log('debug', this.buildJsonObj(message, err));
    }
    silly(message, err) {
        this.logger.log('silly', this.buildJsonObj(message, err));
    }
    buildJsonObj(message, err) {
        const obj = typeof message === 'string' ? { message } : message;
        obj.serverCity = LogService_1.city;
        obj.serverCountry = LogService_1.country;
        obj.serverExternalHostname = LogService_1.externalHostname;
        obj.serverHostname = LogService_1.hostName;
        obj.serverIp = LogService_1.ip;
        obj.serverNodeEnv = LogService_1.nodeEnv;
        if (err) {
            obj.error = error_to_json_string_1.errorToJsonString(err);
        }
        return obj;
    }
    initializeTransports(config) {
        const transportConfigs = config.transports || [];
        for (const transConfig of transportConfigs) {
            let trans = null;
            switch (transConfig.transport) {
                case 'winstonAwsCloudWatch':
                    trans = winstonAwsCloudWatch;
                    break;
                default:
                    trans = winston_1.transports[transConfig.transport];
                    break;
            }
            this.logger.add(trans, transConfig);
        }
    }
    getIpInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            let retries = 0;
            try {
                const result = yield request('https://ifconfig.co/json');
                const json = JSON.parse(result) || {};
                LogService_1.externalHostname = json.hostname || 'unknown';
                LogService_1.city = json.city || 'unknown';
                LogService_1.country = json.country || 'unknown';
                LogService_1.ip = json.ip || 'unknown';
                this.info(`Logger acquired external ip: ${LogService_1.ip}, from ifconfig.co/json: ${result}`);
            }
            catch (err) {
                LogService_1.ip = 'unknown';
                if (retries < 1440) {
                    this.info(`Logger unable to acquire external ip through ifconfig.co/json, retry ${retries}`, err);
                    setTimeout(() => {
                        retries++;
                        this.getIpInfo();
                    }, 60000);
                }
                else {
                    this.info(`Logger unable to acquire external ip through ifconfig.co/json, retry ${retries}... giving up.`, err);
                }
            }
        });
    }
};
LogService.city = 'unacquired';
LogService.country = 'unacquired';
LogService.externalHostname = 'unacquired';
LogService.hostName = 'unknown';
LogService.ip = 'unacquired';
LogService.nodeEnv = 'unknown';
LogService = LogService_1 = __decorate([
    api_1.Injectable(),
    __metadata("design:paramtypes", [])
], LogService);
exports.LogService = LogService;
var LogService_1;
//# sourceMappingURL=log-service.js.map