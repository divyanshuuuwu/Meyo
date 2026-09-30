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

// Authenticate every socket connection
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
    ) as { id: string };

    socket.data.userId = decoded.id;

    console.log("Socket authenticated:", decoded.id);

    next();
  } catch (error) {
    console.error("Socket authentication failed:", error);

    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.data.userId;

  console.log("User connected:", userId);

  // Personal room for this user
  socket.join(userId);

  socket.on(
    "send-message",
    async (message, callback) => {
      try {
        console.log("Received send-message:", message);

        const { conversationId, content } = message;

        if (!conversationId) {
          throw new Error("Conversation ID is required");
        }

        if (!content?.trim()) {
          throw new Error("Message content is required");
        }

        // Find conversation
        const conversation =
          await prisma.conversation.findUnique({
            where: {
              id: conversationId,
            },
          });

        if (!conversation) {
          throw new Error("Conversation not found");
        }

        // Make sure sender belongs to conversation
        const isParticipant =
          conversation.user1Id === userId ||
          conversation.user2Id === userId;

        if (!isParticipant) {
          throw new Error(
            "You are not a participant in this conversation"
          );
        }

        // Find receiver
        const receiverId =
          conversation.user1Id === userId
            ? conversation.user2Id
            : conversation.user1Id;

        // Save message
        const newMessage =
          await prisma.message.create({
            data: {
              content: content.trim(),
              conversationId,
              senderId: userId,
            },
          });

        // Update conversation timestamp
        await prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            updatedAt: new Date(),
          },
        });

        console.log(
          "Message saved successfully:",
          newMessage
        );

        // Send to receiver
        io.to(receiverId).emit(
          "new-message",
          newMessage
        );

        // Send back to sender
        io.to(userId).emit(
          "new-message",
          newMessage
        );

        // Tell sender everything succeeded
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