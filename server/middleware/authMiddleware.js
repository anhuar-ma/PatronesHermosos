import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';
import { pool } from '../server.js';

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided. Access denied.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token. Access denied.'
    });
  }
};

// Middleware to check if user has specific role
export const hasRole = (roles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    try {
      // Get user role from database
      const result = await pool.query(
        'SELECT rol FROM coordinadora WHERE id = $1',
        [req.user.id]
      );

      const userRole = result.rows[0]?.role;

      if (!userRole || !roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions'
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error verifying permissions'
      });
    }
  };
};