import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, universityId } = req.body;
    const user = await authService.register(
      email,
      password,
      firstName,
      lastName,
      universityId
    );
    res
      .status(201)
      .json({ message: "User registered successfully", userId: user.id });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || "";
    const tokens = await authService.login(email, password, ip);
    res.status(200).json(tokens);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const ip = req.ip || "";
    const tokens = await authService.refreshToken(refreshToken, ip);
    res.status(200).json(tokens);
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};
