import "dotenv/config";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { prisma } from "./lib/prisma";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.use((socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;

    console.log("Socket cookies:", cookies);

    if (!cookies) {
      return next(new Error("Not authenticated"));
    }

    const tokenCookie = cookies
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));

    if (!tokenCookie) {
      return next(new Error("Token not found"));
    }

    const token = tokenCookie.substring("token=".length);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      userId: string;
    };

    if (!decoded.userId) {
      return next(new Error("User ID missing from token"));
    }

    socket.data.userId = decoded.userId;

    console.log(
      "Socket authenticated:",
      decoded.userId
    );

    next();
  } catch (error) {
    console.error(
      "Socket authentication failed:",
      error
    );

    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId as string;

  console.log("User connected:", userId);

  // Personal room
  socket.join(userId);

  socket.on(
    "send-message",
    async (message, callback) => {
      try {
        console.log(
          "Received send-message:",
          message
        );

        const conversationId =
          message?.conversationId;

        const content =
          message?.content?.trim();

        if (!conversationId) {
          throw new Error(
            "Conversation ID is required"
          );
        }

        if (!content) {
          throw new Error(
            "Message content is required"
          );
        }

        const conversation =
          await prisma.conversation.findUnique({
            where: {
              id: conversationId,
            },
          });

        if (!conversation) {
          throw new Error(
            "Conversation not found"
          );
        }

        const isParticipant =
          conversation.user1Id === userId ||
          conversation.user2Id === userId;

        if (!isParticipant) {
          throw new Error(
            "You are not a participant in this conversation"
          );
        }

        const receiverId =
          conversation.user1Id === userId
            ? conversation.user2Id
            : conversation.user1Id;

        const newMessage =
          await prisma.message.create({
            data: {
              content,
              conversationId,
              senderId: userId,
            },
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });

        await prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            updatedAt: new Date(),
          },
        });

        console.log(
          "Message saved:",
          newMessage.id
        );

        // Send to receiver
        io.to(receiverId).emit(
          "new-message",
          newMessage
        );

        // Send to sender
        io.to(userId).emit(
          "new-message",
          newMessage
        );

        if (callback) {
          callback({
            success: true,
            message: newMessage,
          });
        }
      } catch (error) {
        console.error(
          "Failed to send message:",
          error
        );

        if (callback) {
          callback({
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to send message",
          });
        }
      }
    }
  );

  socket.on("disconnect", (reason) => {
    console.log(
      "User disconnected:",
      userId,
      reason
    );
  });
});

httpServer.listen(3001, () => {
  console.log(
    "Socket.IO server running on http://localhost:3001"
  );
});