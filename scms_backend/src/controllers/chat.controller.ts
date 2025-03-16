
import { Request, Response, NextFunction } from "express";
import { ChatService } from "../services/chat.service";

export class ChatController {
  constructor(private chatService: ChatService) {}

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const senderId = req.user!.userId;
      const recipientId = req.params.recipientId;
      const messages = await this.chatService.getMessages(
        senderId,
        recipientId
      );
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }

  async getGroupMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const groupId = parseInt(req.params.groupId);
      const messages = await this.chatService.getGroupMessages(userId, groupId);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  }

  async getGroups(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const groups = await this.chatService.getGroups(userId);
      res.json(groups);
    } catch (error) {
      next(error);
    }
  }
}
