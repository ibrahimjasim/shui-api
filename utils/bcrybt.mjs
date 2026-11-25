import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);
export const comparePassword = (incoming, hashed) => bcrypt.compare(incoming, hashed);
