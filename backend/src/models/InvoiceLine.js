import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const InvoiceLine = sequelize.define('InvoiceLine', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  invoice_id: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.STRING(500), allowNull: false },
  quantite: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  prix_unitaire: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  montant: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
}, {
  tableName: 'invoice_lines',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

export default InvoiceLine;
