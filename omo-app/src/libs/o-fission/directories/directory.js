var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { withTimeout } from "../fissionDrive";
export class Directory {
    constructor(fs, pathParts, entityFactory) {
        window.o.logger.log("Directory.ctor(pathParts:" + pathParts.join(",") + ")");
        this._pathParts = pathParts;
        this._fs = fs;
        this._entityFactory = entityFactory;
    }
    get fs() {
        return this._fs;
    }
    getPath(pathParts) {
        return this.fs.appPath(pathParts
            ? this._pathParts.concat(pathParts)
            : this._pathParts);
    }
    exists(pathParts) {
        return __awaiter(this, void 0, void 0, function* () {
            return withTimeout(`exists(${this.getPath(pathParts)})`, () => this.fs.exists(this.getPath(pathParts)), Directory.defaultTimeout);
        });
    }
    ensureDirectoryExists(pathParts, publish = true) {
        return __awaiter(this, void 0, void 0, function* () {
            yield withTimeout(`ensureDirectoryExists(${this.getPath(pathParts)})`, () => __awaiter(this, void 0, void 0, function* () {
                if (!(yield this.exists(pathParts))) {
                    yield this.fs.mkdir(this.getPath(pathParts));
                }
            }), Directory.defaultTimeout);
            if (publish) {
                yield this.fs.publish();
            }
        });
    }
    listNames() {
        return __awaiter(this, void 0, void 0, function* () {
            return withTimeout(`listNames(${this.getPath()})`, () => __awaiter(this, void 0, void 0, function* () {
                if (!(yield this.exists())) {
                    return [];
                }
                const listing = yield this.fs.ls(this.getPath());
                const list = Object.entries(listing);
                return list.map(([name, _]) => name);
            }), Directory.defaultTimeout);
        });
    }
    listItems() {
        return __awaiter(this, void 0, void 0, function* () {
            return withTimeout(`listItems(${this.getPath()})`, () => __awaiter(this, void 0, void 0, function* () {
                const names = yield this.listNames();
                const items = yield Promise.all(names.map(name => {
                    return this.fs.cat(this.getPath([name]));
                }));
                if (this._entityFactory) {
                    return items.map(o => this._entityFactory(o.toString()));
                }
                return items.map(item => JSON.parse(item));
            }), Directory.defaultTimeout);
        });
    }
    tryGetByName(entityName) {
        return __awaiter(this, void 0, void 0, function* () {
            return withTimeout(`tryGetByName(${this.getPath([entityName])})`, () => __awaiter(this, void 0, void 0, function* () {
                window.o.logger.log("Fission dir '" + this.getPath() + "': tryGetByName(entityName: '" + entityName + "')");
                if (!(yield this.exists([entityName]))) {
                    window.o.logger.log("Fission dir '" + this.getPath() + "': tryGetByName(entityName: '" + entityName + "') -> Doesn't exist");
                    return null;
                }
                window.o.logger.log("Fission dir '" + this.getPath() + "': tryGetByName(entityName: '" + entityName + "') -> Exists");
                const contents = yield this.fs.cat(this.getPath([entityName]));
                if (this._entityFactory) {
                    return this._entityFactory(contents.toString());
                }
                return JSON.parse(contents);
            }), Directory.defaultTimeout);
        });
    }
    addOrUpdate(entity, publish = true, indexHint) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield withTimeout(`addOrUpdate(${this.getPath([entity.name])}, publish: ${publish})`, () => __awaiter(this, void 0, void 0, function* () {
                yield this.ensureDirectoryExists(null, publish);
                const result = {
                    cid: "",
                    added: yield this.exists([entity.name]),
                    entity: entity
                };
                yield this.fs.add(this.getPath([entity.name]), JSON.stringify(entity));
                return result;
            }), Directory.defaultTimeout);
            yield withTimeout(`addOrUpdate(${this.getPath([entity.name])}, publish: ${publish})`, () => __awaiter(this, void 0, void 0, function* () {
                yield this.maintainIndexes(result.added ? "add" : "update", entity, indexHint);
            }), Directory.defaultTimeout);
            result.cid = publish
                ? yield this.fs.publish()
                : null;
            return result;
        });
    }
    tryRemove(entityName, publish = true, indexHint) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield withTimeout(`tryRemove(${this.getPath([entityName])}, publish: ${publish})`, () => __awaiter(this, void 0, void 0, function* () {
                const entity = yield this.tryGetByName(entityName);
                if (!entity) {
                    return null;
                }
                yield this.fs.rm(this.getPath([entityName]));
                yield this.maintainIndexes("remove", entity, indexHint);
                return entity;
            }), Directory.defaultTimeout);
            return {
                cid: publish
                    ? yield this.fs.publish()
                    : null,
                entity: entity
            };
        });
    }
    publish() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fs.publish();
        });
    }
}
Directory.defaultTimeout = 30000;
