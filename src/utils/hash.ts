// utils/hash.ts
import * as bcrypt from "bcrypt";

export const hash = (pwd: string) => bcrypt.hash(pwd, 10);

export const compare = (pwd: string, hashPwd: string) =>
  bcrypt.compare(pwd, hashPwd);

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashed: string
) => {
  return bcrypt.compare(password, hashed);
};
