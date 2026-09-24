"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { saveBasicInfo } from "@/app/actions/onboarding";

export default function OnboardingPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();

    await saveBasicInfo(
      Number(age),
      gender,
      bio
    );
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm text-pink-500 font-medium mb-3">
            Step 1 of 3
          </p>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Tell us about yourself
          </h1>

          <p className="text-gray-400 mt-3">
            Let’s create your profile so people can get to know you.
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-10">
          <div className="h-1.5 flex-1 rounded-full bg-pink-500" />
          <div className="h-1.5 flex-1 rounded-full bg-[#292929]" />
          <div className="h-1.5 flex-1 rounded-full bg-[#292929]" />
        </div>

        <form onSubmit={handleContinue} className="space-y-7">
          {/* Age */}
          <div>
            <label
              htmlFor="age"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Age
            </label>

            <input
              id="age"
              type="number"
              min="18"
              max="100"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="w-full rounded-xl border border-[#292929] bg-[#151515] px-4 py-3.5 text-white outline-none placeholder:text-gray-600 focus:border-pink-500"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Gender
            </label>

            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-xl border border-[#292929] bg-[#151515] px-4 py-3.5 text-white outline-none focus:border-pink-500"
              required
            >
              <option value="" disabled>
                Select your gender
              </option>

              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">
                Prefer not to say
              </option>
            </select>
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-200"
              >
                About you
              </label>

              <span className="text-xs text-gray-600">
                {bio.length}/300
              </span>
            </div>

            <textarea
              id="bio"
              value={bio}
              onChange={(e) => {
                if (e.target.value.length <= 300) {
                  setBio(e.target.value);
                }
              }}
              placeholder="Tell people a little about yourself..."
              rows={5}
              className="w-full resize-none rounded-xl border border-[#292929] bg-[#151515] px-4 py-3.5 text-white outline-none placeholder:text-gray-600 focus:border-pink-500"
              required
            />
          </div>

          {/* Continue */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-pink-500 py-3.5 font-semibold text-white transition hover:bg-pink-600"
          >
            Continue
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </main>
  );
}

