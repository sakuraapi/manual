import { SakuraApiInjectable } from '@sakuraapi/api';
import { LoggerInstance } from 'winston';
export declare type levels = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';
export declare class LogService extends SakuraApiInjectable {
    private static city;
    private static country;
    private static externalHostname;
    private static logger;
    private static hostName;
    private static ip;
    private static nodeEnv;
    readonly logger: LoggerInstance;
    constructor();
    error(message: any, err?: Error): void;
    warn(message: any, err?: Error): void;
    info(message: any, err?: Error): void;
    verbose(message: any, err?: Error): void;
    debug(message: any, err?: Error): void;
    silly(message: any, err?: Error): void;
    private buildJsonObj(message, err?);
    private initializeTransports(config);
    private getIpInfo();
}
