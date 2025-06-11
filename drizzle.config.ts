import {db_url as db} from "./config.json";
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/util/tables.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: db!,
  },
});