"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/app/actions/auth";

export async function recordSwipe(
  targetId: string,
  action: "LIKE" | "PASS"
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (userId === targetId) {
    throw new Error("You cannot swipe on yourself");
  }

  // Check that the target user actually exists
  const targetUser = await prisma.user.findUnique({
    where: {
      id: targetId,
    },
  });

  if (!targetUser) {
    throw new Error("User not found");
  }

  // Save or update the swipe
  await prisma.swipe.upsert({
    where: {
      userId_targetId: {
        userId,
        targetId,
      },
    },
    update: {
      action,
    },
    create: {
      userId,
      targetId,
      action,
    },
  });

  return {
    success: true,
  };
}
