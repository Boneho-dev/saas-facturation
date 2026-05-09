import { Feedback } from '../models/index.js';

const VALID_TYPES = ['bug', 'feature_request', 'improvement', 'other'];

export async function createFeedback(req, res, next) {
  try {
    const { type, title, message } = req.body;

    if (!type || !title || !message) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Type de feedback invalide.' });
    }
    if (title.trim().length < 5) {
      return res.status(400).json({ error: 'Le titre doit contenir au moins 5 caractères.' });
    }
    if (message.trim().length < 10) {
      return res.status(400).json({ error: 'Le message doit contenir au moins 10 caractères.' });
    }

    const feedback = await Feedback.create({
      user_id: req.userId,
      type,
      title: title.trim(),
      message: message.trim(),
      status: 'new',
    });

    res.status(201).json({ success: true, message: 'Feedback envoyé avec succès.', feedback });
  } catch (err) {
    next(err);
  }
}

export async function getUserFeedbacks(req, res, next) {
  try {
    const feedbacks = await Feedback.findAll({
      where: { user_id: req.userId },
      order: [['created_at', 'DESC']],
    });

    res.json({ feedbacks });
  } catch (err) {
    next(err);
  }
}

export async function getFeedbackById(req, res, next) {
  try {
    const feedback = await Feedback.findOne({
      where: { id: req.params.id, user_id: req.userId },
    });

    if (!feedback) {
      return res.status(404).json({ error: 'Feedback non trouvé.' });
    }

    res.json({ feedback });
  } catch (err) {
    next(err);
  }
}
