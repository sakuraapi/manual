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
const http_status_1 = require("../lib/http-status");
const log_service_1 = require("../services/log-service");
let ConfigApi = class ConfigApi extends api_1.SakuraApiRoutable {
    constructor(log) {
        super();
        this.log = log;
    }
    deleteHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.configHandler(req, res);
            next();
        });
    }
    getHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.configHandler(req, res);
            next();
        });
    }
    headHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.configHandler(req, res);
            next();
        });
    }
    postHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.configHandler(req, res);
            next();
        });
    }
    putHandler(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.configHandler(req, res);
            next();
        });
    }
    configHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const locals = res.locals;
            try {
                locals
                    .send(http_status_1.OK, {
                    server: 'coin-jar',
                    serverUp: true
                });
            }
            catch (err) {
                locals
                    .send(http_status_1.SERVER_ERROR, {
                    error: 'SERVER_ERROR'
                });
                this.log.error(err);
            }
        });
    }
};
__decorate([
    api_1.Route({
        method: 'delete',
        path: ''
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ConfigApi.prototype, "deleteHandler", null);
__decorate([
    api_1.Route({
        method: 'get',
        path: ''
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ConfigApi.prototype, "getHandler", null);
__decorate([
    api_1.Route({
        method: 'head',
        path: ''
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ConfigApi.prototype, "headHandler", null);
__decorate([
    api_1.Route({
        method: 'post',
        path: ''
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ConfigApi.prototype, "postHandler", null);
__decorate([
    api_1.Route({
        method: 'put',
        path: ''
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], ConfigApi.prototype, "putHandler", null);
ConfigApi = __decorate([
    api_1.Routable({
        baseUrl: '/'
    }),
    __metadata("design:paramtypes", [log_service_1.LogService])
], ConfigApi);
exports.ConfigApi = ConfigApi;
//# sourceMappingURL=config.api.js.map