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
require("colors");
const fs = require("fs");
const util = require("util");
const sakura_api_1 = require("./sakura-api");
const log_service_1 = require("./services/log-service");
process.on('unhandledRejection', err => {
    console.log('Caught unhandledRejection');
    console.log(err);
});
process.on('uncaughtException', err => {
    console.log('Caught uncaughtException');
    console.log(err);
});
class Server {
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            const writeFile = util.promisify(fs.writeFile);
            try {
                this.sapi = yield new sakura_api_1.Bootstrap().boot();
                this.log = this.sapi.getProvider(log_service_1.LogService);
                yield this
                    .sapi
                    .listen({ bootMessage: `SakuraAPI Server :: port: ${this.sapi.port} :: By your command |<\n`.red });
                this.log.info(`SakuraAPI Server started :: port: ${this.sapi.port}`);
                const configJson = JSON.stringify(this.sapi.config, null, 2);
                yield writeFile('config.json', configJson, 'utf8');
            }
            catch (err) {
                if (this.log) {
                    this.log.error(`Error starting SakuraAPI Server: %o`, err);
                }
                else {
                    console.log(err);
                }
            }
        });
    }
}
new Server().start();
//# sourceMappingURL=index.js.map