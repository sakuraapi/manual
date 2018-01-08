/// <reference types="express" />
import { SakuraApiRoutable } from '@sakuraapi/api';
import { NextFunction, Request, Response } from 'express';
import { LogService } from '../services/log-service';
export declare class JarApi extends SakuraApiRoutable {
    private log;
    constructor(log: LogService);
    getHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    defaultHandler(req: Request, res: Response): Promise<void>;
}
