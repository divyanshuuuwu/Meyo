import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import PhotoGallery from "./PhotoGallery";
import {
  MapPin,
  BriefcaseBusiness,
  Ruler,
  VenusAndMars,
  Heart,
  Sparkles,
  Pencil,
} from "lucide-react";

export default async function ProfilePage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-pink-400" />

              <span className="text-sm font-medium text-pink-400">
                Your profile
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your Meyo profile
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              This is how people will see you on Meyo.
            </p>
          </div>

          <button className="flex items-center gap-2 rounded-full border border-[#292929] bg-[#151515] px-4 py-2.5 text-sm font-medium transition hover:border-pink-500/40 hover:bg-[#1a1a1a]">
            <Pencil className="h-4 w-4" />
            Edit profile
          </button>
        </div>

        {/* Main profile card */}
        <div className="overflow-hidden rounded-[28px] border border-[#292929] bg-[#111111]">

          {/* Photo gallery */}
          <PhotoGallery
            images={user.images}
            userName={user.name}
          />

          {/* Profile information */}
          <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1.5fr_1fr] lg:p-10">

            {/* Left */}
            <div>

              {/* Bio */}
              <div className="mb-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  About me
                </p>

                <p className="max-w-2xl text-lg leading-8 text-gray-300">
                  {user.bio || "You haven't added a bio yet."}
                </p>
              </div>

              {/* Details */}
              <div>
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                  About
                </p>

                <div className="grid gap-3 sm:grid-cols-2">

                  {/* Occupation */}
                  <div className="rounded-2xl border border-[#292929] bg-[#151515] p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10">
                      <BriefcaseBusiness className="h-4 w-4 text-purple-400" />
                    </div>

                    <p className="text-xs text-gray-500">
                      Occupation
                    </p>

                    <p className="mt-1 font-medium">
                      {user.occupation || "Not added"}
                    </p>
                  </div>

                  {/* Height */}
                  <div className="rounded-2xl border border-[#292929] bg-[#151515] p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/10">
                      <Ruler className="h-4 w-4 text-pink-400" />
                    </div>

                    <p className="text-xs text-gray-500">
                      Height
                    </p>

                    <p className="mt-1 font-medium">
                      {user.height
                        ? `${user.height} cm`
                        : "Not added"}
                    </p>
                  </div>

                  {/* Gender */}
                  <div className="rounded-2xl border border-[#292929] bg-[#151515] p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                      <VenusAndMars className="h-4 w-4 text-blue-400" />
                    </div>

                    <p className="text-xs text-gray-500">
                      Gender
                    </p>

                    <p className="mt-1 font-medium">
                      {user.gender || "Not added"}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="rounded-2xl border border-[#292929] bg-[#151515] p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10">
                      <MapPin className="h-4 w-4 text-green-400" />
                    </div>

                    <p className="text-xs text-gray-500">
                      Location
                    </p>

                    <p className="mt-1 font-medium">
                      {user.location || "Not added"}
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Right */}
            <div>

              <div className="rounded-3xl border border-[#292929] bg-[#151515] p-6">

                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                    <Sparkles className="h-5 w-5 text-pink-400" />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      Profile strength
                    </h3>

                    <p className="text-xs text-gray-500">
                      Make your profile stand out
                    </p>
                  </div>
                </div>

                <div className="mb-3 h-2 overflow-hidden rounded-full bg-[#292929]">
                  <div className="h-full w-[75%] rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">
                    Looking good
                  </span>

                  <span className="text-pink-400">
                    75%
                  </span>
                </div>

                <div className="mt-6 space-y-3 text-sm">

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">
                      Photos
                    </span>

                    <span className="text-gray-300">
                      {user.images.length}/6
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">
                      Bio
                    </span>

                    <span>
                      {user.bio ? "✓" : "—"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">
                      Basic information
                    </span>

                    <span className="text-green-400">
                      ✓
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="mt-6 text-center text-xs text-gray-600">
          Your first photo is your main profile photo on Meyo.
        </p>

      </div>
    </main>
  );
}
