import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export async function register(req, res, next) {
  try {
    const { email, password, nom_entreprise, siret, adresse, telephone } = req.body;

    if (!email || !password || !nom_entreprise || !siret || !adresse) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Format email invalide.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' });
    }
    if (!/^\d{14}$/.test(siret)) {
      return res.status(400).json({ error: 'Le SIRET doit contenir exactement 14 chiffres.' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, nom_entreprise, siret, adresse, telephone });

    const token = signToken(user.id);
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(201).json({ token, user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Identifiants incorrects.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Identifiants incorrects.' });
    }

    const token = signToken(user.id);
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { nom_entreprise, adresse, telephone } = req.body;
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    await user.update({ nom_entreprise, adresse, telephone });
    const { password: _, ...userWithoutPassword } = user.toJSON();
    res.json({ user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
}
