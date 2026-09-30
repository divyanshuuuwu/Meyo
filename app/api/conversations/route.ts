import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const userId = decoded.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            user1Id: userId,
          },
          {
            user2Id: userId,
          },
        ],
      },

      include: {
        user1: {
          include: {
            images: {
              orderBy: {
                position: "asc",
              },
              take: 1,
            },
          },
        },

        user2: {
          include: {
            images: {
              orderBy: {
                position: "asc",
              },
              take: 1,
            },
          },
        },

        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },

      orderBy: {
        updatedAt: "desc",
      },
    });

    const formattedConversations = conversations.map(
      (conversation) => {
        const otherUser =
          conversation.user1Id === userId
            ? conversation.user2
            : conversation.user1;

        const lastMessage = conversation.messages[0];

        return {
          id: conversation.id,

          name: otherUser.name,

          image:
            otherUser.images[0]?.url ??
            "https://i.pravatar.cc/150?img=12",

          lastMessage:
            lastMessage?.content ?? "Start a conversation",

          time: lastMessage
            ? lastMessage.createdAt
            : conversation.createdAt,

          unread: 0,

          online: false,
        };
      }
    );

    return NextResponse.json({
      userId,
      conversations: formattedConversations,
    });
  } catch (error) {
    console.error(
      "Failed to fetch conversations:",
      error
    );

    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}