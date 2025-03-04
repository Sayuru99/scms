import { Request, Response } from "express";
import { EventService } from "../services/event.service";

const eventService = new EventService();

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, startTime, endTime, location, categoryId } =
      req.body;
    const createdById = (req as any).user.id; // From authMiddleware
    const event = await eventService.createEvent(
      title,
      description,
      new Date(startTime),
      new Date(endTime),
      location,
      createdById,
      categoryId
    );
    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await eventService.getEvent(id);
    res.status(200).json(event);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, startTime, endTime, location, categoryId } =
      req.body;
    const event = await eventService.updateEvent(
      id,
      title,
      description,
      startTime ? new Date(startTime) : undefined,
      endTime ? new Date(endTime) : undefined,
      location,
      categoryId
    );
    res.status(200).json(event);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await eventService.deleteEvent(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
