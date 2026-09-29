import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/app/actions/auth";
import { redirect, notFound } from "next/navigation";

type Props = {
  params: Promise<{
    matchId: string;
  }>;
};

export default async function ChatPage({ params }: Props) {
  const currentUserId = await getCurrentUserId();

  if (!currentUserId) {
    redirect("/login");
  }

  const { matchId } = await params;

  const match = await prisma.match.findUnique({
    where: {
      id: matchId,
    },

    include: {
      user1: {
        include: {
          images: {
            where: {
              position: 1,
            },
            take: 1,
          },
        },
      },

      user2: {
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
  });

  if (!match) {
    notFound();
  }

  // Make sure the current user is actually part of this match
  if (
    match.user1Id !== currentUserId &&
    match.user2Id !== currentUserId
  ) {
    notFound();
  }

  const person =
    match.user1Id === currentUserId
      ? match.user2
      : match.user1;

  const image = person.images[0]?.url;

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col bg-[#080808] text-white">

      {/* Chat Header */}
      <div className="border-b border-[#242424] bg-[#0b0b0b] px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center gap-3">

          <div className="h-11 w-11 overflow-hidden rounded-full bg-[#181818]">
            {image ? (
              <img
                src={image}
                alt={person.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-500">
                {person.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h1 className="font-semibold">
              {person.name}
            </h1>

            <p className="text-xs text-gray-500">
              Matched with you
            </p>
          </div>

        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-1 items-center justify-center px-6">

        <div className="text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#181818]">
            <span className="text-xl">💬</span>
          </div>

          <h2 className="text-lg font-semibold">
            Start the conversation
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Say hello to {person.name} and start getting to know each other.
          </p>

        </div>

      </div>

      {/* Message Input */}
      <div className="border-t border-[#242424] bg-[#0b0b0b] px-6 py-4">

        <div className="mx-auto flex max-w-4xl gap-3">

          <input
            type="text"
            placeholder={`Message ${person.name}...`}
            className="flex-1 rounded-xl border border-[#292929] bg-[#151515] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-pink-500"
          />

          <button
            className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-medium transition hover:opacity-90"
          >
            Send
          </button>

        </div>

      </div>

    </div>
  );
}