import User from './User.js';
import Invoice from './Invoice.js';
import InvoiceLine from './InvoiceLine.js';
import Devis from './Devis.js';
import DevisLine from './DevisLine.js';
import Feedback from './Feedback.js';

// User ↔ Invoice
User.hasMany(Invoice, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Invoice.belongsTo(User, { foreignKey: 'user_id' });

// Invoice ↔ InvoiceLine
Invoice.hasMany(InvoiceLine, { foreignKey: 'invoice_id', as: 'lines', onDelete: 'CASCADE' });
InvoiceLine.belongsTo(Invoice, { foreignKey: 'invoice_id' });

// User ↔ Devis
User.hasMany(Devis, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Devis.belongsTo(User, { foreignKey: 'user_id' });

// Devis ↔ DevisLine
Devis.hasMany(DevisLine, { foreignKey: 'devis_id', as: 'lines', onDelete: 'CASCADE' });
DevisLine.belongsTo(Devis, { foreignKey: 'devis_id' });

// User ↔ Feedback
User.hasMany(Feedback, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Feedback.belongsTo(User, { foreignKey: 'user_id' });

export { User, Invoice, InvoiceLine, Devis, DevisLine, Feedback };
