import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/app/actions/auth";

export async function GET() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const conversations =
      await prisma.conversation.findMany({
        where: {
          OR: [
            { user1Id: userId },
            { user2Id: userId },
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

    const formattedConversations =
      conversations.map((conversation) => {
        const otherUser =
          conversation.user1Id === userId
            ? conversation.user2
            : conversation.user1;

        return {
          id: conversation.id,

          user: {
            id: otherUser.id,
            name: otherUser.name,
            image:
              otherUser.images[0]?.url ?? null,
          },

          lastMessage:
            conversation.messages[0] ?? null,

          updatedAt: conversation.updatedAt,
        };
      });

    return NextResponse.json(
      formattedConversations
    );
  } catch (error) {
    console.error(
      "GET conversations error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch conversations",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const currentUserId =
      await getCurrentUserId();

    if (!currentUserId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const targetUserId = body.userId;

    if (!targetUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (currentUserId === targetUserId) {
      return NextResponse.json(
        {
          error:
            "You cannot create a conversation with yourself",
        },
        { status: 400 }
      );
    }

    // Make sure the target user exists
    const targetUser =
      await prisma.user.findUnique({
        where: {
          id: targetUserId,
        },
      });

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Only matched users can start a conversation
    const match =
      await prisma.match.findFirst({
        where: {
          OR: [
            {
              user1Id: currentUserId,
              user2Id: targetUserId,
            },
            {
              user1Id: targetUserId,
              user2Id: currentUserId,
            },
          ],
        },
      });

    if (!match) {
      return NextResponse.json(
        {
          error:
            "You can only message someone you matched with",
        },
        { status: 403 }
      );
    }

    // Always store users in a consistent order
    const [user1Id, user2Id] = [
      currentUserId,
      targetUserId,
    ].sort();

    // Find existing conversation
    let conversation =
      await prisma.conversation.findUnique({
        where: {
          user1Id_user2Id: {
            user1Id,
            user2Id,
          },
        },
      });

    // Create one if it doesn't exist
    if (!conversation) {
      conversation =
        await prisma.conversation.create({
          data: {
            user1Id,
            user2Id,
          },
        });
    }

    return NextResponse.json(
      {
        success: true,
        conversation,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "POST conversation error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to create conversation",
      },
      { status: 500 }
    );
  }
}