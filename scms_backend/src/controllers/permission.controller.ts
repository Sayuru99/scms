import { Request, Response } from "express";
import { PermissionService } from "../services/permission.service";

const permissionService = new PermissionService();

export const createPermission = async (req: Request, res: Response) => {
  try {
    const { name, category, description } = req.body;
    const permission = await permissionService.createPermission(
      name,
      category,
      description
    );
    res.status(201).json(permission);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getPermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const permission = await permissionService.getPermission(id);
    res.status(200).json(permission);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, description } = req.body;
    const permission = await permissionService.updatePermission(
      id,
      name,
      category,
      description
    );
    res.status(200).json(permission);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await permissionService.deletePermission(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
