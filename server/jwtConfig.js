import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret_key";
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";
