import { Pool } from "pg";
//Prevent creating new databsed connection on every hot reaload
declare global {
  var pgPool: Pool | undefined 
}

const envContent = process.env.DATABASE_URL;

const pool = 
  global.pgPool ?? 
  new Pool({
  connectionString: envContent,
  max: 10
});

if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool;
}

export default pool;

