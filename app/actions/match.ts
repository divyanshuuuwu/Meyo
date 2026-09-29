"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/app/actions/auth";

export async function matchUser(userId: string) {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    throw new Error("Unauthorized");
  }

  if (currentUserId === userId) {
    throw new Error("You cannot match with yourself");
  }

  // Check that this person actually liked us
  const like = await prisma.swipe.findUnique({
    where: {
      userId_targetId: {
        userId,
        targetId: currentUserId,
      },
    },
  });

  if (!like || like.action !== "LIKE") {
    throw new Error("This person has not liked you");
  }

  // Prevent duplicate matches
  const existingMatch = await prisma.match.findFirst({
    where: {
      OR: [
        {
          user1Id: currentUserId,
          user2Id: userId,
        },
        {
          user1Id: userId,
          user2Id: currentUserId,
        },
      ],
    },
  });

  if (existingMatch) {
    return {
      success: true,
      matchId: existingMatch.id,
    };
  }

  const match = await prisma.match.create({
    data: {
      user1Id: currentUserId,
      user2Id: userId,
    },
  });

  return {
    success: true,
    matchId: match.id,
  };
}