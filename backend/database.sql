-- ============================================================
-- SaaS Facturation - Script de création de la base de données
-- ============================================================

CREATE DATABASE IF NOT EXISTS saas_facturation
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE saas_facturation;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nom_entreprise VARCHAR(255) NOT NULL,
  siret VARCHAR(14) UNIQUE NOT NULL,
  adresse TEXT NOT NULL,
  telephone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_siret (siret)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INVOICES
CREATE TABLE IF NOT EXISTS invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  numero_facture VARCHAR(20) UNIQUE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_adresse TEXT,
  montant_ht DECIMAL(10,2) NOT NULL,
  montant_tva DECIMAL(10,2) NOT NULL,
  montant_ttc DECIMAL(10,2) NOT NULL,
  statut ENUM('brouillon','émise','payée','impayée') DEFAULT 'brouillon',
  date_facture DATE NOT NULL,
  date_delai_paiement DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_statut (statut)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- INVOICE LINES
CREATE TABLE IF NOT EXISTS invoice_lines (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_id INT NOT NULL,
  description VARCHAR(500) NOT NULL,
  quantite INT NOT NULL DEFAULT 1,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  montant DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  INDEX idx_invoice_id (invoice_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DEVIS
CREATE TABLE IF NOT EXISTS devis (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  numero_devis VARCHAR(20) UNIQUE NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_adresse TEXT,
  montant_ht DECIMAL(10,2) NOT NULL,
  montant_tva DECIMAL(10,2) NOT NULL,
  montant_ttc DECIMAL(10,2) NOT NULL,
  statut ENUM('brouillon','envoyé','accepté','rejeté') DEFAULT 'brouillon',
  date_creation DATE NOT NULL,
  date_validite DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- DEVIS LINES
CREATE TABLE IF NOT EXISTS devis_lines (
  id INT PRIMARY KEY AUTO_INCREMENT,
  devis_id INT NOT NULL,
  description VARCHAR(500) NOT NULL,
  quantite INT NOT NULL DEFAULT 1,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  montant DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (devis_id) REFERENCES devis(id) ON DELETE CASCADE,
  INDEX idx_devis_id (devis_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FEEDBACKS
CREATE TABLE IF NOT EXISTS feedbacks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type ENUM('bug', 'feature_request', 'improvement', 'other') NOT NULL DEFAULT 'other',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'reviewed', 'in_progress', 'resolved') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Données de test (optionnel - compte démo)
-- ============================================================
-- Mot de passe : demo1234 (bcrypt hash)
INSERT IGNORE INTO users (email, password, nom_entreprise, siret, adresse, telephone)
VALUES (
  'demo@agreagency.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Agre Agency',
  '12345678901234',
  '1 Rue des Artisans, 49000 Angers',
  '06 00 00 00 00'
);
