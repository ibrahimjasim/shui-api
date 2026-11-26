import jwt from 'jsonwebtoken';

// The secret comes from config.yml -> serverless.yml -> Lambda environment
const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set');
  return secret;
};

// Only non-secret data in the payload, anyone can decode it
export const signToken = (payload) =>
  jwt.sign(payload, getSecret(), { expiresIn: '1h' });

// Throws if the token is expired, tampered with or signed with another secret (used in Stage 4)
export const verifyToken = (token) => jwt.verify(token, getSecret());