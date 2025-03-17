import { Request, Response, NextFunction } from "express";
import { ResourceService } from "../services/resource.service";

export class ResourceController {
  private resourceService = new ResourceService();

  async createResource(req: Request, res: Response, next: NextFunction) {
    try {
      const resource = await this.resourceService.createResource(req.body);
      res.status(201).json({ message: "Resource created", resource });
    } catch (error) {
      next(error);
    }
  }

  async getResources(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, status, typeId } = req.query;
      const resources = await this.resourceService.getResources({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as "Available" | "Reserved" | "Maintenance",
        typeId: typeId ? parseInt(typeId as string) : undefined,
      });
      res.json(resources);
    } catch (error) {
      next(error);
    }
  }

  async updateResource(req: Request, res: Response, next: NextFunction) {
    try {
      const resource = await this.resourceService.updateResource(
        parseInt(req.params.resourceId),
        req.body
      );
      res.json({ message: "Resource updated", resource });
    } catch (error) {
      next(error);
    }
  }

  async deleteResource(req: Request, res: Response, next: NextFunction) {
    try {
      const resourceId = await this.resourceService.deleteResource(
        parseInt(req.params.resourceId)
      );
      res.json({ message: "Resource deleted", resourceId });
    } catch (error) {
      next(error);
    }
  }

  async createResourceType(req: Request, res: Response, next: NextFunction) {
    try {
      const resourceType = await this.resourceService.createResourceType(
        req.body.type
      );
      res.status(201).json({ message: "Resource type created", resourceType });
    } catch (error) {
      next(error);
    }
  }

  async getResourceTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const resourceTypes = await this.resourceService.getResourceTypes();
      res.json(resourceTypes);
    } catch (error) {
      next(error);
    }
  }

  async updateResourceType(req: Request, res: Response, next: NextFunction) {
    try {
      const resourceType = await this.resourceService.updateResourceType(
        parseInt(req.params.typeId),
        req.body.type
      );
      res.json({ message: "Resource type updated", resourceType });
    } catch (error) {
      next(error);
    }
  }

  async deleteResourceType(req: Request, res: Response, next: NextFunction) {
    try {
      const typeId = await this.resourceService.deleteResourceType(
        parseInt(req.params.typeId)
      );
      res.json({ message: "Resource type deleted", typeId });
    } catch (error) {
      next(error);
    }
  }

  async createReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const reservation = await this.resourceService.createReservation({
        userId: req.user!.userId,
        ...req.body,
      });
      res.status(201).json({ message: "Reservation created!", reservation });
    } catch (error) {
      next(error);
    }
  }

  async getReservations(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, status } = req.query;
      const reservations = await this.resourceService.getReservations({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as "Requested" | "Approved" | "Rejected" | "Returned" | undefined,
      });
      res.json(reservations);
    } catch (error) {
      next(error);
    }
  }

  async requestResource(req: Request, res: Response, next: NextFunction) {
    try {
      const resourceId = parseInt(req.params.resourceId);
      const userId = req.user!.userId;
      const { startTime, endTime, purpose } = req.body;

      const reservation = await this.resourceService.requestResource(resourceId, {
        userId,
        startTime,
        endTime,
        purpose,
      });

      res.status(201).json({ message: "Resource requested successfully", reservation });
    } catch (error) {
      next(error);
    }
  }

  async returnResource(req: Request, res: Response, next: NextFunction) {
    try {
      const resourceId = parseInt(req.params.resourceId);
      const userId = req.user!.userId;

      await this.resourceService.returnResource(resourceId, userId);
      res.json({ message: "Resource returned successfully" });
    } catch (error) {
      next(error);
    }
  }

  async updateReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const reservationId = parseInt(req.params.reservationId);
      const { status } = req.body;
      const approvedById = req.user!.userId;

      const reservation = await this.resourceService.updateReservation(reservationId, { status }, approvedById);
      res.json({ message: `Reservation ${status.toLowerCase()} successfully`, reservation });
    } catch (error) {
      next(error);
    }
  }

  async cancelReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const reservationId = parseInt(req.params.reservationId);
      const userId = req.user!.userId;

      // First check if the reservation belongs to the user
      const reservation = await this.resourceService.getReservationById(reservationId);
      if (reservation.user.id !== userId) {
        throw new Error("You can only cancel your own reservations");
      }

      const updatedReservation = await this.resourceService.updateReservation(reservationId, { status: "Cancelled" });
      res.json({ message: "Reservation cancelled successfully", reservation: updatedReservation });
    } catch (error) {
      next(error);
    }
  }

  async getReservationsByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { page, limit, status } = req.query;
      const reservations = await this.resourceService.getReservations({
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        status: status as "Requested" | "Approved" | "Rejected" | "Returned" | undefined,
        userId
      });
      res.json(reservations);
    } catch (error) {
      next(error);
    }
  }
}
