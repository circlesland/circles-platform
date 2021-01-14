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
import { FissionDir } from "../fissionBase";
export class Directory extends FissionDir {
    constructor(fissionUser, fs, pathParts, entityFactory, entitySerializer) {
        super(fissionUser, fs, pathParts);
        window.o.logger.log("Directory.ctor(pathParts:" + pathParts.join(",") + ")");
        this._entityFactory = entityFactory;
        this._entitySerializer = entitySerializer;
    }
    listItems() {
        return __awaiter(this, void 0, void 0, function* () {
            return withTimeout(`listItems(${this.getPath()})`, () => __awaiter(this, void 0, void 0, function* () {
                const names = yield this.listNames();
                const items = yield Promise.all(names.map(name => {
                    return this.fs.cat(this.getPath([name]));
                }));
                if (this._entityFactory) {
                    return yield Promise.all(items.map((o) => __awaiter(this, void 0, void 0, function* () { return yield this._entityFactory(o.toString()); })));
                }
                return items.map(item => JSON.parse(item));
            }), Directory.defaultTimeout);
        });
    }
    tryGetEntityByName(entityName) {
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
                    return (yield this._entityFactory(contents.toString()));
                }
                return JSON.parse(contents);
            }), Directory.defaultTimeout);
        });
    }
    addOrUpdateEntity(entity, publish = true, indexHint) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield withTimeout(`addOrUpdate(${this.getPath([entity.name])}, publish: ${publish})`, () => __awaiter(this, void 0, void 0, function* () {
                yield this.ensureDirectoryExists(null, publish);
                const result = {
                    added: yield this.exists([entity.name]),
                    entity: entity
                };
                const serializedEntity = this._entitySerializer
                    ? yield this._entitySerializer(entity)
                    : JSON.stringify(entity);
                yield this.fs.add(this.getPath([entity.name]), serializedEntity);
                return result;
            }), Directory.defaultTimeout);
            yield withTimeout(`addOrUpdate(${this.getPath([entity.name])}, publish: ${publish})`, () => __awaiter(this, void 0, void 0, function* () {
                yield this.maintainIndexes(result.added ? "add" : "update", entity, indexHint);
            }), Directory.defaultTimeout);
            if (publish) {
                yield this.fs.publish();
            }
            return result.added;
        });
    }
    tryRemove(entityName, publish = true, indexHint) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield withTimeout(`tryRemove(${this.getPath([entityName])}, publish: ${publish})`, () => __awaiter(this, void 0, void 0, function* () {
                const entity = yield this.tryGetEntityByName(entityName);
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
