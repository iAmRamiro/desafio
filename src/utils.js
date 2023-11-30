import { dirname } from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const hashData = async (data) => {
  return bcrypt.hash(data, 10); // crea el hasheo
};

export const compareData = async (data, hashData) => {
  return bcrypt.compare(data, hashData); //true or false
};

const SECRET_KEY_JWT = "secretJWT";

export const generateToken = (user) => {
  const token = jwt.sign(user, SECRET_KEY_JWT, { expiresIn: 400 });
  return token;
};
