
"use client";

import {
  Heart,
  X,
  MapPin,
  BriefcaseBusiness,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

export default function DiscoverPage() {
  return (
   <main className="h-[calc(100vh-65px)] overflow-hidden  bg-[#0b0b0b] px-4 py-6 text-white">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles
                size={17}
                className="text-pink-500"
              />

              <span className="text-sm font-medium text-pink-500">
                Discover
              </span>
            </div>

            <h1 className="mt-1 text-2xl font-bold">
              Find someone interesting
            </h1>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-[#292929] bg-[#151515] px-4 py-2.5 text-sm text-gray-300 transition hover:border-[#3a3a3a] hover:text-white"
          >
            <SlidersHorizontal size={17} />
            Filters
          </button>
        </div>

        {/* Profile Card Area */}
        <div className="flex justify-center">
          <div className="w-full max-w-[430px] overflow-hidden rounded-3xl border border-[#292929] bg-[#151515] shadow-2xl">

            {/* Profile Image */}
            <div className="relative h-[360px] overflow-hidden bg-[#1c1c1c]">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80"
                alt="Profile"
                className="h-full w-full object-cover"
              />

              {/* Gradient */}
              <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              {/* Online Badge */}
              <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Online
              </div>

              {/* Profile Info */}
              <div className="absolute bottom-4 left-5 right-5">
                <h2 className="text-2xl font-bold">
                  Sophia, 24
                </h2>

                <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-gray-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} />
                    Delhi, India
                  </div>

                  <div className="flex items-center gap-1.5">
                    <BriefcaseBusiness size={14} />
                    Designer
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="px-5 py-4">
              <p className="text-sm leading-5 text-gray-400">
                Love good conversations, spontaneous plans
                and discovering new places.
              </p>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#222222] px-3 py-1 text-xs text-gray-300">
                  Travel
                </span>

                <span className="rounded-full bg-[#222222] px-3 py-1 text-xs text-gray-300">
                  Coffee
                </span>

                <span className="rounded-full bg-[#222222] px-3 py-1 text-xs text-gray-300">
                  Music
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-5 border-t border-[#292929] px-5 py-4">
              {/* Pass */}
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#333333] bg-[#1c1c1c] text-gray-300 transition hover:border-red-500 hover:text-red-500"
              >
                <X size={20} />
              </button>

              {/* Like */}
              <button
                type="button"
                className="flex h-13 w-13 items-center justify-center rounded-full bg-pink-500 text-white shadow-lg shadow-pink-500/20 transition hover:bg-pink-600"
              >
                <Heart
                  size={23}
                  fill="currentColor"
                />
              </button>

              {/* Quick Date */}
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#333333] bg-[#1c1c1c] text-gray-300 transition hover:border-pink-500 hover:text-pink-500"
              >
                <Sparkles size={19} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

