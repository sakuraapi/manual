import { SakuraApi } from '@sakuraapi/api';
export declare class Bootstrap {
    private log;
    private sapi;
    private shuttingDown;
    boot(): Promise<SakuraApi>;
    shutdownServer(signal: string): Promise<void>;
}
