import { Request, Response } from "express";
import { ResourceService } from "../services/resource.service";

const resourceService = new ResourceService();

export const createResource = async (req: Request, res: Response) => {
  try {
    const { name, description, type } = req.body;
    const createdById = (req as any).user.id;
    const resource = await resourceService.createResource(
      name,
      description,
      type,
      createdById
    );
    res.status(201).json(resource);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const resource = await resourceService.getResource(id);
    res.status(200).json(resource);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, type, isAvailable } = req.body;
    const resource = await resourceService.updateResource(
      id,
      name,
      description,
      type,
      isAvailable
    );
    res.status(200).json(resource);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteResource = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await resourceService.deleteResource(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
