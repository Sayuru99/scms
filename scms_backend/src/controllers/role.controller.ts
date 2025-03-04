import { Request, Response } from "express";
import { RoleService } from "../services/role.service";

const roleService = new RoleService();

export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description, permissionIds } = req.body;
    const role = await roleService.createRole(name, description, permissionIds);
    res.status(201).json(role);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = await roleService.getRole(id);
    res.status(200).json(role);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, permissionIds } = req.body;
    const role = await roleService.updateRole(
      id,
      name,
      description,
      permissionIds
    );
    res.status(200).json(role);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await roleService.deleteRole(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const assignPermissions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;
    const role = await roleService.assignPermissions(id, permissionIds);
    res.status(200).json(role);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
