import { config } from 'dotenv';
import postgres from 'postgres';

config();

const credentials = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT || '5432'),
};

const sql = postgres(credentials);

export default sql;
