"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warns = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.warns = (0, pg_core_1.pgTable)("warns", {
    userid: (0, pg_core_1.integer)("userid").notNull(),
    warns: (0, pg_core_1.integer)("warns").notNull()
});
