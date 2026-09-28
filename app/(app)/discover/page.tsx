
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import DiscoverClient from "./DiscoverClient";

export default async function DiscoverPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const swipedUsers = await prisma.swipe.findMany({
    where: {
      userId,
    },
    select: {
      targetId: true,
    },
  });

  const swipedUserIds = swipedUsers.map(
    (swipe) => swipe.targetId
  );

  const profiles = await prisma.user.findMany({
    where: {
      id: {
        notIn: [userId, ...swipedUserIds],
      },

      onboardingCompleted: true,

      images: {
        some: {
          position: 1,
        },
      },
    },

    include: {
      images: {
        where: {
          position: 1,
        },
        take: 1,
      },
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 20,
  });

  return <DiscoverClient profiles={profiles} />;
}