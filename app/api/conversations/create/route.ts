import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/app/actions/auth";

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
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

    if (targetUserId === userId) {
      return NextResponse.json(
        { error: "You cannot message yourself" },
        { status: 400 }
      );
    }

    // Check that the two users are actually matched.
    const match = await prisma.match.findFirst({
      where: {
        OR: [
          {
            user1Id: userId,
            user2Id: targetUserId,
          },
          {
            user1Id: targetUserId,
            user2Id: userId,
          },
        ],
      },
    });

    if (!match) {
      return NextResponse.json(
        { error: "You can only message your matches" },
        { status: 403 }
      );
    }

    // Always store IDs in a consistent order.
    const [user1Id, user2Id] = [userId, targetUserId].sort();

    let conversation = await prisma.conversation.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id,
          user2Id,
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user1Id,
          user2Id,
        },
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Create conversation error:", error);

    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}