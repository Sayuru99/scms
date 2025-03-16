
import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export default function chatRoutes(chatController: ChatController) {
  const router = Router();

  router.get(
    "/messages/:recipientId",
    authMiddleware("read:messages"),
    chatController.getMessages.bind(chatController)
  );
  router.get(
    "/group-messages/:groupId",
    authMiddleware("read:messages"),
    chatController.getGroupMessages.bind(chatController)
  );
  router.get(
    "/groups",
    authMiddleware("read:groups"),
    chatController.getGroups.bind(chatController)
  );

  return router;
}
