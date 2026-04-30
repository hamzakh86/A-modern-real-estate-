import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  // ✅ Lit depuis header Authorization OU cookie
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1] || req.cookies.access_token;

  if (!token) return next(errorHandler(401, 'Unauthorized'));
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));
    req.user = user;
    next();
  });
};
