import { Pool } from "pg";

const envContent = process.env.DATABASE_URL;

export const pool = new Pool({
  connectionString: envContent,
});
