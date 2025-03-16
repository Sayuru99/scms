import { AppDataSource } from "../config/database";
import { Message } from "../entities/Message";
import { Group } from "../entities/Group";
import { GroupMember } from "../entities/GroupMember";
import { User } from "../entities/User";
import { Server, Socket } from "socket.io";
import { BadRequestError, NotFoundError } from "../utils/errors";
import logger from "../config/logger";
import { jwtDecode } from "jwt-decode";

export class ChatService {
  private messageRepo = AppDataSource.getRepository(Message);
  private groupRepo = AppDataSource.getRepository(Group);
  private groupMemberRepo = AppDataSource.getRepository(GroupMember);
  private userRepo = AppDataSource.getRepository(User);
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async getMessages(senderId: string, recipientId: string) {
    const messages = await this.messageRepo.find({
      where: [
        {
          sender: { id: senderId },
          recipient: { id: recipientId },
          isDeleted: false,
        },
        {
          sender: { id: recipientId },
          recipient: { id: senderId },
          isDeleted: false,
        },
      ],
      relations: ["sender", "recipient"],
      order: { sentAt: "ASC" },
    });
    return messages;
  }

  async getGroupMessages(userId: string, groupId: number) {
    const groupMember = await this.groupMemberRepo.findOne({
      where: { groupId, userId, isDeleted: false },
    });
    if (!groupMember) throw new BadRequestError("Not a group member");

    const messages = await this.messageRepo.find({
      where: { group: { id: groupId }, isDeleted: false },
      relations: ["sender"],
      order: { sentAt: "ASC" },
    });
    return messages;
  }

  async getGroups(userId: string) {
    const groupMembers = await this.groupMemberRepo.find({
      where: { userId, isDeleted: false },
      relations: ["group"],
    });
    return groupMembers.map((gm) => gm.group);
  }

  setupSocket(socket: Socket) {
    socket.on("authenticate", async (token: string) => {
      try {
        const decoded = jwtDecode<{ userId: string; permissions: string[] }>(
          token
        );
        // console.log(decoded);
        const user = await this.userRepo.findOne({
          where: { id: decoded.userId, isDeleted: false },
        });
        if (!user) {
        //   console.error(decoded.userId);
          throw new Error("User not found");
        }
        socket.data.userId = user.id;
        socket.data.permissions = decoded.permissions || [];
        socket.join(user.id);
        logger.info(`User ${user.id} authenticated via socket`);
      } catch (err) {
        socket.emit("error", "Authentication failed");
        socket.disconnect();
      }
    });

    socket.on("joinGroup", async (groupId: number) => {
      const userId = socket.data.userId;
      if (!userId) {
        socket.emit("error", "Not authenticated");
        return;
      }
      const groupMember = await this.groupMemberRepo.findOne({
        where: { groupId, userId, isDeleted: false },
      });
      if (groupMember) {
        socket.join(`group_${groupId}`);
        logger.info(`User ${userId} joined group ${groupId}`);
      } else {
        socket.emit("error", "Not a member of this group");
      }
    });

    socket.on(
      "sendMessage",
      async ({
        recipientId,
        content,
      }: {
        recipientId: string;
        content: string;
      }) => {
        const senderId = socket.data.userId;
        const permissions = socket.data.permissions || [];
        if (!senderId) {
          socket.emit("error", "Not authenticated");
          return;
        }
        if (!permissions.includes("create:messages")) {
          socket.emit("error", "Insufficient permissions to send messages");
          return;
        }
        const sender = await this.userRepo.findOne({
          where: { id: senderId, isDeleted: false },
        });
        const recipient = await this.userRepo.findOne({
          where: { id: recipientId, isDeleted: false },
        });
        if (!sender || !recipient) {
          socket.emit("error", "Invalid sender or recipient");
          return;
        }

        const message = this.messageRepo.create({
          sender: { id: senderId },
          recipient: { id: recipientId },
          content,
          isRead: false,
          isDeleted: false,
        });
        await this.messageRepo.save(message);
        const populatedMessage = {
          ...message,
          sender: {
            id: senderId,
            firstName: sender.firstName,
            lastName: sender.lastName,
          },
        };
        this.io.to(recipientId).emit("newMessage", populatedMessage);
        socket.emit("messageSent", populatedMessage);
      }
    );

    socket.on(
      "sendGroupMessage",
      async ({ groupId, content }: { groupId: number; content: string }) => {
        const senderId = socket.data.userId;
        const permissions = socket.data.permissions || [];
        if (!senderId) {
          socket.emit("error", "Not authenticated");
          return;
        }
        if (!permissions.includes("create:messages")) {
          socket.emit("error", "Insufficient permissions to send messages");
          return;
        }
        const sender = await this.userRepo.findOne({
          where: { id: senderId, isDeleted: false },
        });
        const group = await this.groupRepo.findOne({
          where: { id: groupId, isDeleted: false },
        });
        if (!sender || !group) {
          socket.emit("error", "Invalid sender or group");
          return;
        }
        const groupMember = await this.groupMemberRepo.findOne({
          where: { groupId, userId: senderId, isDeleted: false },
        });
        if (!groupMember) {
          socket.emit("error", "Not a member of this group");
          return;
        }

        const message = this.messageRepo.create({
          sender: { id: senderId },
          group: { id: groupId },
          content,
          isRead: false,
          isDeleted: false,
        });
        await this.messageRepo.save(message);
        const populatedMessage = {
          ...message,
          sender: {
            id: senderId,
            firstName: sender.firstName,
            lastName: sender.lastName,
          },
        };
        this.io
          .to(`group_${groupId}`)
          .emit("newGroupMessage", populatedMessage);
        socket.emit("messageSent", populatedMessage);
      }
    );

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  }
}
