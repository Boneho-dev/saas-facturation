import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Feedback = sequelize.define('Feedback', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  type: {
    type: DataTypes.ENUM('bug', 'feature_request', 'improvement', 'other'),
    allowNull: false,
    defaultValue: 'other',
  },
  title: { type: DataTypes.STRING(255), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: {
    type: DataTypes.ENUM('new', 'reviewed', 'in_progress', 'resolved'),
    defaultValue: 'new',
  },
}, {
  tableName: 'feedbacks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default Feedback;
