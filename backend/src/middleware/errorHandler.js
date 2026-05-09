export function errorHandler(err, _req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Erreur interne du serveur.';

  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(status).json({ error: message });
}
