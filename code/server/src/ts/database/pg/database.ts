import pg from 'pg';
import dbConfig from './config';

const credentials = {
  user: dbConfig.PG_USER,
  host: dbConfig.PG_HOST,
  database: dbConfig.PG_DATABASE,
  password: dbConfig.PG_PASSWORD,
  port: parseInt(dbConfig.PG_PORT),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const connect = async () => {
  const { Client } = pg;
  const client = new Client(credentials);
  await client.connect();
  return client;
};
