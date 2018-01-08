/// <reference types="express" />
import { SakuraApiRoutable } from '@sakuraapi/api';
import { NextFunction, Request, Response } from 'express';
import { LogService } from '../services/log-service';
export declare class ConfigApi extends SakuraApiRoutable {
    private log;
    constructor(log: LogService);
    deleteHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    getHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    headHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    postHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    putHandler(req: Request, res: Response, next: NextFunction): Promise<void>;
    configHandler(req: Request, res: Response): Promise<void>;
}
