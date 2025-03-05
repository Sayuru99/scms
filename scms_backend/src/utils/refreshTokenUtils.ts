import * as jwt from "jsonwebtoken";
import ms from "ms";
import { authConfig } from "../config/auth.config";
import { User } from "../entities/User";

type JwtSecret = jwt.Secret;

export const generateRefreshToken = (
  user: User,
  ip: string,
  scopes: string[] = []
): string => {
  const secret: JwtSecret = authConfig.jwtRefreshSecret as JwtSecret;
  const expiry: string | undefined = authConfig.jwtRefreshExpiry;

  if (!secret) throw new Error("JWT Refresh Secret is not defined");
  if (!expiry) throw new Error("JWT Refresh Expiry is not defined");

  const expiresIn: number | string =
    typeof expiry === "string" ? ms(expiry as ms.StringValue) / 1000 : expiry;
  const options: jwt.SignOptions = { expiresIn };

  return jwt.sign({ id: user.id, scopes }, secret, options);
};

export const verifyRefreshToken = (token: string, ip: string): any => {
  const secret: JwtSecret = authConfig.jwtRefreshSecret as JwtSecret;
  if (!secret) throw new Error("JWT Refresh Secret is not defined");

  const decoded = jwt.verify(token, secret) as any;
  if (decoded.ip !== ip) throw new Error("Refresh token invalid: IP mismatch");
  return decoded;
};
