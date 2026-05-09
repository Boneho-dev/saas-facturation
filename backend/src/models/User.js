import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true,
    validate: { isEmail: true },
  },
  password: { type: DataTypes.STRING(255), allowNull: false },
  nom_entreprise: { type: DataTypes.STRING(255), allowNull: false },
  siret: {
    type: DataTypes.STRING(14), allowNull: false, unique: true,
    validate: {
      is: /^\d{14}$/,
    },
  },
  adresse: { type: DataTypes.TEXT, allowNull: false },
  telephone: { type: DataTypes.STRING(20), allowNull: true },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default User;
