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
const express_1 = __importDefault(require("express"));
const database_1 = require("../util/database");
const tables_1 = require("../util/tables");
const drizzle_orm_1 = require("drizzle-orm");
const port = 6800;
const app = (0, express_1.default)();
app.get('/ping', (req, res) => {
    res.write("Hello from Astral!");
});
app.post('/warn', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.query.user;
    const db = yield (0, database_1.getDb)();
    const existing = yield db
        .select()
        .from(tables_1.warns)
        .where((0, drizzle_orm_1.eq)(tables_1.warns.userid, parseInt(user)))
        .limit(1);
    if (existing.length > 0) {
        yield db
            .update(tables_1.warns)
            .set({ warns: existing[0].warns + 1 })
            .where((0, drizzle_orm_1.eq)(tables_1.warns.userid, parseInt(user)));
    }
    else {
        yield db.insert(tables_1.warns).values({
            userid: parseInt(user),
            warns: 1
        });
    }
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`You can access the API at http://localhost:${port}/warn?user=<user_id>`);
    console.log(`You can ping the server at http://localhost:${port}/ping`);
});
exports.default = app;
