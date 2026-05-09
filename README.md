# FacturePro — SaaS Facturation Auto-Entrepreneurs

> Projet portfolio #4— Ange-Kevin Agre (Agre Agency, Angers/Toulouse)

Application SaaS complète de facturation pour auto-entrepreneurs français.  
**Stack :** React 18 + Tailwind CSS | Node.js + Express + Sequelize + MySQL | Claude API

---

## Fonctionnalités

- Authentification JWT (register / login)
- Création et gestion de **factures** (lignes dynamiques, calcul HT/TVA/TTC auto)
- Création et gestion de **devis**
- Génération de lignes de prestation avec **l'IA Claude**
- Export **PDF** (mentions légales France incluses)
- Relance **email** aux clients impayés
- Tableau de bord avec statistiques
- Filtres et pagination
- Système de **feedback** utilisateur (signaler bugs, demander des fonctionnalités, suggérer des améliorations)

---

## Prérequis

- Node.js 18+
- MySQL 8
- Compte Anthropic (pour la clé API Claude)

---

## Installation locale (développement)

### 1. Base de données

```bash
# Dans phpMyAdmin ou MySQL CLI :
mysql -u root -p < backend/database.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Editer .env avec vos valeurs (DB_PASSWORD, JWT_SECRET, ANTHROPIC_API_KEY)
npm run dev
# → API sur http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Vérifier que VITE_API_URL=/api (proxy Vite pointe vers localhost:5000)
npm run dev
# → App sur http://localhost:5173
```

---

## Variables d'environnement

### backend/.env (à créer depuis .env.example)

| Variable | Description | Exemple |
|---|---|---|
| `DB_HOST` | Hôte MySQL | `localhost` |
| `DB_NAME` | Nom de la BDD | `saas_facturation` |
| `DB_USER` | Utilisateur MySQL | `root` |
| `DB_PASSWORD` | Mot de passe MySQL | *(vide pour XAMPP)* |
| `JWT_SECRET` | Secret JWT (min 32 chars) | `change-me-strong-secret` |
| `ANTHROPIC_API_KEY` | Clé API Claude | `sk-ant-...` |
| `SMTP_HOST` | Serveur SMTP (optionnel) | `smtp.gmail.com` |
| `FRONTEND_URL` | URL du frontend | `http://localhost:5173` |

### frontend/.env (à créer depuis .env.example)

| Variable | Description |
|---|---|
| `VITE_API_URL` | URL de l'API (en prod : `https://votre-api.render.com/api`) |

---

## Déploiement en production

### 1. Base de données — InfinityFree (MySQL distant)

1. Créer un compte sur [infinityfree.com](https://infinityfree.com)
2. Créer une base de données MySQL
3. Importer `backend/database.sql` via phpMyAdmin InfinityFree
4. Noter `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

### 2. Backend — Render.com

1. Créer un compte sur [render.com](https://render.com)
2. New → Web Service → connecter votre repo GitHub
3. Paramètres :
   - **Root directory :** `backend`
   - **Build command :** `npm install`
   - **Start command :** `npm start`
   - **Node version :** `18`
4. Ajouter les variables d'environnement :
   - `NODE_ENV=production`
   - `DB_HOST=` *(InfinityFree host)*
   - `DB_NAME=`, `DB_USER=`, `DB_PASSWORD=`
   - `JWT_SECRET=` *(générer avec `openssl rand -hex 32`)*
   - `ANTHROPIC_API_KEY=sk-ant-...`
   - `FRONTEND_URL=https://votre-app.vercel.app`

### 3. Frontend — Vercel

1. Créer un compte sur [vercel.com](https://vercel.com)
2. Importer le repo GitHub
3. Paramètres :
   - **Root directory :** `frontend`
   - **Framework :** Vite
   - **Build command :** `npm run build`
   - **Output directory :** `dist`
4. Variable d'environnement :
   - `VITE_API_URL=https://votre-api.render.com/api`
5. Deploy

---

## Feedback utilisateur

La page `/feedback` est accessible depuis le menu latéral (icône 💬).

### Côté utilisateur

1. Choisir un type parmi les 4 disponibles :
   - **Bug** — signaler un comportement inattendu ou une erreur
   - **Fonctionnalité** — demander une nouvelle fonctionnalité
   - **Amélioration** — suggérer d'améliorer ce qui existe déjà
   - **Autre** — tout autre retour
2. Renseigner un titre (min. 5 caractères) et une description (min. 10 caractères)
3. Soumettre — confirmation affichée à l'écran
4. Consulter l'historique de ses feedbacks dans l'onglet **Mes feedbacks** avec le statut de traitement (`Nouveau`, `Examiné`, `En cours`, `Résolu`)

### Côté technique

| Couche | Détail |
|--------|--------|
| BDD | Table `feedbacks` — champs `type` (ENUM), `title`, `message`, `status`, FK `user_id` |
| API | `POST /api/feedbacks` · `GET /api/feedbacks` · `GET /api/feedbacks/:id` (routes protégées JWT) |
| Backend | Modèle `Feedback.js` (Sequelize) + `feedbackController.js` + `feedbackRoutes.js` |
| Frontend | `feedbackService.js` (Axios) + `pages/Feedback.jsx` |

---

## Compte de test

| Email | Mot de passe |
|---|---|
| `demo@agreagency.com` | `demo1234` |

*(Créé par le script `database.sql`)*

---

## Architecture

```
saas-facturation/
├── backend/
│   ├── src/
│   │   ├── config/      # Connexion Sequelize
│   │   ├── models/      # User, Invoice, InvoiceLine, Devis, DevisLine, Feedback
│   │   ├── controllers/ # Auth, Invoice, Devis, AI, PDF, Feedback
│   │   ├── routes/      # Express routers
│   │   ├── middleware/  # JWT auth + error handler
│   │   ├── services/    # Claude API, PDF (pdfkit), Email (nodemailer)
│   │   └── utils/       # Génération numéros FAC-YYYY-NNN
│   └── server.js
└── frontend/
    └── src/
        ├── components/  # Auth, Dashboard, Invoice, Devis, Common
        ├── pages/       # Landing, Login, Register, Dashboard, ...
        ├── hooks/       # useAuth, useInvoices, useAI
        ├── services/    # Axios services
        ├── context/     # AuthContext (JWT)
        └── utils/       # formatters (€, dates, statuts)
```

---

*Développé par **Ange-Kevin Agre** — [Agre Agency](mailto:agrekevin09@gmail.com)*
