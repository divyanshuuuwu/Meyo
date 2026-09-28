"use client";

import { useState } from "react";
import {
  Heart,
  X,
  MapPin,
  BriefcaseBusiness,
  Sparkles,
  Loader2,
} from "lucide-react";

import { recordSwipe } from "@/app/actions/swipe";

type Profile = {
  id: string;
  name: string;
  age: number | null;
  bio: string | null;
  occupation: string | null;
  location: string | null;
  gender: string | null;

  images: {
    id: string;
    url: string;
    position: number;
  }[];
};

type DiscoverClientProps = {
  profiles: Profile[];
};

export default function DiscoverClient({
  profiles,
}: DiscoverClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentProfile = profiles[currentIndex];

  async function handleSwipe(
    action: "LIKE" | "PASS"
  ) {
    if (!currentProfile || loading) return;

    try {
      setLoading(true);
      setError("");

      await recordSwipe(
        currentProfile.id,
        action
      );

      setCurrentIndex((current) => current + 1);
    } catch (error) {
      console.error("SWIPE ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!currentProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-6 text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#181818]">
            <Heart className="h-7 w-7 text-pink-400" />
          </div>

          <h1 className="text-2xl font-semibold">
            You've seen everyone
          </h1>

          <p className="mt-2 max-w-sm text-sm text-gray-500">
            There are no more profiles to discover
            right now. Check back later for new
            people.
          </p>
        </div>
      </div>
    );
  }

  const image = currentProfile.images[0]?.url;

  return (
    <div className="min-h-screen bg-[#080808] px-6 py-8 text-white">
      {/* Header */}
      <div className="mx-auto mb-7 max-w-sm text-center">
        <h1 className="text-2xl font-semibold">
          Discover
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Meet someone worth saying hello.
        </p>
      </div>

      {/* Card */}
      <div className="mx-auto w-full max-w-sm">
        <div className="overflow-hidden rounded-[28px] border border-[#252525] bg-[#111111] shadow-2xl">
          {/* Image */}
          <div className="relative h-[430px] overflow-hidden">
            <img
              src={image}
              alt={currentProfile.name}
              className="h-full w-full object-cover"
            />

            {/* Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/60 to-transparent" />

            {/* Online indicator */}
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-xs backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Online
            </div>

            {/* Name */}
            <div className="absolute bottom-5 left-5">
              <h2 className="text-2xl font-semibold">
                {currentProfile.name}
                {currentProfile.age !== null && (
                  <span className="ml-2 font-normal text-gray-300">
                    {currentProfile.age}
                  </span>
                )}
              </h2>
            </div>
          </div>

          {/* Information */}
          <div className="p-5">
            <div className="space-y-2.5">
              {currentProfile.location && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="h-4 w-4 text-pink-400" />
                  {currentProfile.location}
                </div>
              )}

              {currentProfile.occupation && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <BriefcaseBusiness className="h-4 w-4 text-purple-400" />
                  {currentProfile.occupation}
                </div>
              )}
            </div>

            {currentProfile.bio && (
              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-400">
                {currentProfile.bio}
              </p>
            )}

            {/* Actions */}
            <div className="mt-5 flex items-center justify-center gap-4">
              {/* Pass */}
              <button
                onClick={() =>
                  handleSwipe("PASS")
                }
                disabled={loading}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#303030] bg-[#181818] text-gray-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <X className="h-5 w-5" />
                )}
              </button>

              {/* Quick Date */}
              <button
                disabled
                className="flex h-11 items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-5 text-sm font-medium text-purple-300 opacity-60"
              >
                <Sparkles className="h-4 w-4" />
                Quick Date
              </button>

              {/* Like */}
              <button
                onClick={() =>
                  handleSwipe("LIKE")
                }
                disabled={loading}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/10 transition hover:scale-105 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart className="h-5 w-5 fill-current" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="mt-4 text-center text-sm text-red-400">
            {error}
          </p>
        )}

        {/* Progress */}
        <p className="mt-4 text-center text-xs text-gray-600">
          {currentIndex + 1} / {profiles.length}
        </p>
      </div>
    </div>
  );
}
