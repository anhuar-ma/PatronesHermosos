import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "development-secret-please-change-in-production";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// Validate required environment variables in production
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required in production');
}