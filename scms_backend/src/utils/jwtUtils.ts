import * as jwt from "jsonwebtoken";
import ms from "ms";
import { authConfig } from "../config/auth.config";
import { User } from "../entities/User";

type JwtSecret = jwt.Secret;

export const generateAccessToken = (
  user: User,
  scopes: string[] = []
): string => {
  const secret: JwtSecret = authConfig.jwtAccessSecret as JwtSecret;
  const expiry: string | undefined = authConfig.jwtAccessExpiry;

  if (!secret) throw new Error("JWT Access Secret is not defined");
  if (!expiry) throw new Error("JWT Access Expiry is not defined");

  const expiresIn: number | string =
    typeof expiry === "string" ? ms(expiry as ms.StringValue) / 1000 : expiry;
  const options: jwt.SignOptions = { expiresIn };

  return jwt.sign({ id: user.id, scopes }, secret, options);
};

export const verifyAccessToken = (token: string): any => {
  const secret: JwtSecret = authConfig.jwtAccessSecret as JwtSecret;
  if (!secret) throw new Error("JWT Access Secret is not defined");
  return jwt.verify(token, secret);
};
