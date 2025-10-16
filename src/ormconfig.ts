import { join } from 'path';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'blog',
  username: 'devuser',
  password: '12346',
  entities: [join(__dirname, '/**/*.entity.{ts,js}')],
  logging: ['error'], // Enable logging
  // synchronize:true,/// dont give true in production code " it will reset your database in every restart"
  migrationsTableName: 'migration',
  migrations: [join(__dirname, '/migrations/**/*.ts')],
};

export const AppDatasource = new DataSource(config);

export default config;
