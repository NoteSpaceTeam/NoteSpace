import { config } from 'dotenv';

config();

const PG_USER = process.env.PG_USER;
const PG_PASSWORD = process.env.PG_PASSWORD;
const PG_HOST = process.env.PG_HOST;
const PG_PORT = process.env.PG_PORT || '5432';
const PG_DATABASE = process.env.PG_DATABASE;

export default {
  PG_USER,
  PG_PASSWORD,
  PG_HOST,
  PG_PORT,
  PG_DATABASE,
};
