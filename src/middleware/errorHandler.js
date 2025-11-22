export function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (err.details) {
    return res.status(status).json({ error: message, details: err.details });
  }

  return res.status(status).json({ error: message });
}