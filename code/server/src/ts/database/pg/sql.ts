import postgres from 'postgres';
import dbConfig from './config';

const credentials = {
  user: dbConfig.PG_USER,
  host: dbConfig.PG_HOST,
  database: dbConfig.PG_DATABASE,
  password: dbConfig.PG_PASSWORD,
  port: parseInt(dbConfig.PG_PORT),
};

const sql = postgres(credentials);

export default sql;

