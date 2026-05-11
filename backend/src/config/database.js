import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DB_NAME || 'saas_facturation',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? false : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,
      timestamps: true,
    },
  }
);
