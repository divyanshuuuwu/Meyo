import {
  Heart,
  MapPin,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import MatchButton from "./MatchButton";

export default async function LikesPage() {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    redirect("/login");
  }

  // Get all existing matches
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
    select: {
      user1Id: true,
      user2Id: true,
    },
  });

  // Get the IDs of people we have already matched with
  const matchedUserIds = matches.map((match) =>
    match.user1Id === currentUserId
      ? match.user2Id
      : match.user1Id
  );

  // Get people who liked us,
  // but exclude people we already matched with
  const likes = await prisma.swipe.findMany({
    where: {
      targetId: currentUserId,
      action: "LIKE",

      userId: {
        notIn: matchedUserIds,
      },
    },

    include: {
      user: {
        include: {
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

  return (
    <div className="min-h-screen bg-[#080808] px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/10">
              <Heart
                size={21}
                className="text-pink-400"
                fill="currentColor"
              />
            </div>

            <div>
              <h1 className="text-2xl font-semibold">
                Likes
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                People who are interested in you
              </p>
            </div>
          </div>
        </div>

        {/* Likes */}
        {likes.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {likes.map((like) => {
              const person = like.user;
              const image = person.images[0]?.url;

              return (
                <div
                  key={like.id}
                  className="overflow-hidden rounded-2xl border border-[#242424] bg-[#111111] transition hover:border-[#353535]"
                >
                  {/* Image */}
                  <div className="relative h-72 overflow-hidden">
                    {image ? (
                      <img
                        src={image}
                        alt={person.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#181818] text-gray-600">
                        No photo
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent" />

                    <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50 backdrop-blur-md">
                      <Heart
                        size={17}
                        className="text-pink-400"
                        fill="currentColor"
                      />
                    </div>

                    <div className="absolute bottom-4 left-4">
                      <h2 className="text-xl font-semibold">
                        {person.name}

                        {person.age !== null && (
                          <span className="ml-2 font-normal text-gray-300">
                            {person.age}
                          </span>
                        )}
                      </h2>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <div className="space-y-2">
                      {person.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin
                            size={15}
                            className="text-pink-400"
                          />
                          {person.location}
                        </div>
                      )}

                      {person.occupation && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <BriefcaseBusiness
                            size={15}
                            className="text-purple-400"
                          />
                          {person.occupation}
                        </div>
                      )}
                    </div>

                    {person.bio && (
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-500">
                        {person.bio}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="mt-5 flex gap-2">
                      <MatchButton userId={person.id} />

                      <button
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#2c2c2c] bg-[#181818] text-gray-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-[500px] items-center justify-center">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#181818]">
                <Sparkles
                  size={26}
                  className="text-purple-400"
                />
              </div>

              <h2 className="text-xl font-semibold">
                No likes yet
              </h2>

              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                When someone likes your profile,
                they'll appear here. Keep discovering
                new people!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}