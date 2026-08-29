import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
};

export const createToken = (userId: number) => {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: "1d" });
};