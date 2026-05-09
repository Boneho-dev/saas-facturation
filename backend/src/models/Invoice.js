import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Invoice = sequelize.define('Invoice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  numero_facture: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  client_name: { type: DataTypes.STRING(255), allowNull: false },
  client_email: { type: DataTypes.STRING(255), allowNull: true },
  client_adresse: { type: DataTypes.TEXT, allowNull: true },
  montant_ht: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  montant_tva: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  montant_ttc: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  statut: {
    type: DataTypes.ENUM('brouillon', 'émise', 'payée', 'impayée'),
    defaultValue: 'brouillon',
  },
  date_facture: { type: DataTypes.DATEONLY, allowNull: false },
  date_delai_paiement: { type: DataTypes.DATEONLY, allowNull: false },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'invoices',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Invoice;
