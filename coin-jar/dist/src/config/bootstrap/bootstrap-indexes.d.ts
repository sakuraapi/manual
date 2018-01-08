import { SakuraApi } from '@sakuraapi/api';
export declare class BootstrapIndexes {
    private sapi;
    constructor(sapi: SakuraApi);
    run(): Promise<void>;
}
