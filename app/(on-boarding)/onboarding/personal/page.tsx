"use client";
import { savePersonalDetails } from "@/app/actions/onboarding";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function PersonalDetailsPage() {
  const [height, setHeight] = useState("");
  const [occupation, setOccupation] = useState("");
  const [location, setLocation] = useState("");

 const handleContinue = async (e: React.FormEvent) => {
  e.preventDefault();

  await savePersonalDetails(
    Number(height),
    occupation,
    location
  );
};

  const handleBack = () => {
    window.history.back();
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm text-pink-500 font-medium mb-3">
            Step 2 of 3
          </p>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            A little more about you
          </h1>

          <p className="text-gray-400 mt-3">
            Help us personalize your Meyo experience.
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-10">
          <div className="h-1.5 flex-1 rounded-full bg-pink-500" />
          <div className="h-1.5 flex-1 rounded-full bg-pink-500" />
          <div className="h-1.5 flex-1 rounded-full bg-[#292929]" />
        </div>

        <form onSubmit={handleContinue} className="space-y-7">
          {/* Height */}
          <div>
            <label
              htmlFor="height"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Height
            </label>

            <div className="relative">
              <input
                id="height"
                type="number"
                min="100"
                max="250"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter your height"
                className="w-full rounded-xl border border-[#292929] bg-[#151515] px-4 py-3.5 pr-16 text-white outline-none placeholder:text-gray-600 focus:border-pink-500"
                required
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                cm
              </span>
            </div>
          </div>

          {/* Occupation */}
          <div>
            <label
              htmlFor="occupation"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Occupation
            </label>

            <input
              id="occupation"
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="e.g. Software Developer"
              className="w-full rounded-xl border border-[#292929] bg-[#151515] px-4 py-3.5 text-white outline-none placeholder:text-gray-600 focus:border-pink-500"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Location
            </label>

            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Delhi, India"
              className="w-full rounded-xl border border-[#292929] bg-[#151515] px-4 py-3.5 text-white outline-none placeholder:text-gray-600 focus:border-pink-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#292929] bg-[#151515] px-5 py-3.5 font-semibold text-gray-300 transition hover:bg-[#1c1c1c]"
            >
              <ArrowLeft size={18} />
              Back
            </button>

            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-pink-500 py-3.5 font-semibold text-white transition hover:bg-pink-600"
            >
              Continue
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

