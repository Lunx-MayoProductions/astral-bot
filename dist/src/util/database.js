"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const config_json_1 = require("../../config.json");
let db = null;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = (0, postgres_1.default)(config_json_1.db_url, { "prepare": false });
        const database = (0, postgres_js_1.drizzle)(client);
        db = database;
    });
}
function getDb() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!db) {
            yield main();
        }
        if (!db) {
            throw new Error("Database not initialized");
        }
        return db;
    });
}
