import { bigint, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const warns = pgTable("warns", {
  userid: bigint("userid", { mode: "number" }).notNull(),
  warns: integer("warns").notNull()
});

export const verified = pgTable("verified", {
  userid: integer("userid").notNull(),
  ip: varchar("ip").notNull()
});