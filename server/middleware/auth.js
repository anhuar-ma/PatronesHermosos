import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwtConfig.js";

// Basic authentication middleware
export const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Error in authentication",
      error: error.message,
    });
  }
};

// Check if user is admin
export const requireAdmin = (req, res, next) => {
  if (req.user.rol !== 0) {
    return res.status(403).json({
      success: false,
      message: "Insufficient permissions",
    });
  }
  next();
};

// Check sede access - used for sede-specific operations
export const checkSedeAccess = (req, res, next) => {
  if (req.user.rol === 0 || (req.user.rol === 1 && req.user.id_sede)) {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: "Insufficient permissions",
  });
};
