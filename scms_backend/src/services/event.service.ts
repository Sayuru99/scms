import { AppDataSource } from "../config/db.config";
import { Event } from "../entities/Event";
import { User } from "../entities/User";
import { EventCategory } from "../entities/EventCategory";

export class EventService {
  private eventRepo = AppDataSource.getRepository(Event);
  private userRepo = AppDataSource.getRepository(User);
  private categoryRepo = AppDataSource.getRepository(EventCategory);

  async createEvent(
    title: string,
    description: string,
    startTime: Date,
    endTime: Date,
    location: string,
    createdById: string,
    categoryId: string
  ): Promise<Event> {
    if (!startTime || !endTime)
      throw new Error("Start time and end time are required");

    const createdBy = await this.userRepo.findOne({
      where: { id: createdById },
    });
    if (!createdBy) throw new Error("User not found");

    const category = await this.categoryRepo.findOne({
      where: { id: categoryId },
    });
    if (!category) throw new Error("Event category not found");

    const event = this.eventRepo.create({
      title,
      description,
      startTime,
      endTime,
      location,
      createdBy,
      category,
    });
    return await this.eventRepo.save(event);
  }

  async getEvent(id: string): Promise<Event> {
    const event = await this.eventRepo.findOne({
      where: { id },
      relations: ["createdBy", "category"],
    });
    if (!event) throw new Error("Event not found");
    return event;
  }

  async updateEvent(
    id: string,
    title?: string,
    description?: string,
    startTime?: Date,
    endTime?: Date,
    location?: string,
    categoryId?: string
  ): Promise<Event> {
    const event = await this.getEvent(id);
    if (title) event.title = title;
    if (description) event.description = description;
    if (startTime) event.startTime = startTime;
    if (endTime) event.endTime = endTime;
    if (location) event.location = location;
    if (categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: categoryId },
      });
      if (!category) throw new Error("Event category not found");
      event.category = category;
    }
    return await this.eventRepo.save(event);
  }

  async deleteEvent(id: string): Promise<void> {
    const event = await this.getEvent(id);
    await this.eventRepo.remove(event);
  }
}
