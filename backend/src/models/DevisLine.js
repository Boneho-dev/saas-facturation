import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const DevisLine = sequelize.define('DevisLine', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  devis_id: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.STRING(500), allowNull: false },
  quantite: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  prix_unitaire: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  montant: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  tableName: 'devis_lines',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default DevisLine;
