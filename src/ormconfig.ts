import { join } from 'path';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

import * as dotenv from 'dotenv';

dotenv.config();

const config: PostgresConnectionOptions = {
  type: 'postgres',
   host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
  username: process.env.POSTGRES_USER || 'devuser',
  password: process.env.POSTGRES_PASSWORD || '12346',
  database: process.env.POSTGRES_DB || 'blog',

  entities: [join(__dirname, '/**/*.entity.{ts,js}')],
  logging: ['error'], // Enable logging
  // synchronize:true,/// dont give true in production code " it will reset your database in every restart"
  migrationsTableName: 'migration',
  migrations: [join(__dirname, '/migrations/**/*.ts')],
};

export const AppDatasource = new DataSource(config);

export default config;
