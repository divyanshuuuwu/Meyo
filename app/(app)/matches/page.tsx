import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import MatchesClient from "./MatchesClient";

export default async function MatchesPage() {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    redirect("/login");
  }

  const matches = await prisma.match.findMany({
    where: {
      OR: [
        {
          user1Id: currentUserId,
        },
        {
          user2Id: currentUserId,
        },
      ],
    },

    include: {
      user1: {
        select: {
          id: true,
          name: true,
          age: true,
          occupation: true,
          location: true,
          images: {
            where: {
              position: 1,
            },
            take: 1,
          },
        },
      },

      user2: {
        select: {
          id: true,
          name: true,
          age: true,
          occupation: true,
          location: true,
          images: {
            where: {
              position: 1,
            },
            take: 1,
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const matchedUsers = matches.map((match) => {
    const user =
      match.user1Id === currentUserId
        ? match.user2
        : match.user1;

    return {
      matchId: match.id,
      ...user,
    };
  });

  return (
    <MatchesClient
      matchedUsers={matchedUsers}
    />
  );
}